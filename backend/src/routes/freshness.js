/**
 * Freshness Pipeline — главный механизм обновления данных о брокерах.
 *
 * Spec: FRESHNESS-PIPELINE-SPEC.md (root)
 * Migration: backend/migrations/004-freshness-pipeline.sql
 *
 * 5-stage pipeline:
 *   1. COLLECT (Джон)  — scrape broker site → agent_findings (staging)
 *   2. VERIFY  (Боб)   — cross-check vs 2nd source → agent_findings.verified
 *   3. SCORE   (Лео)   — recompute trust score per methodology → score_history
 *   4. RE-RANK         — auto-apply scores → preview ranking changes
 *   5. APPROVE (Yegor) — per-broker checkboxes → write MD + git commit + deploy
 *
 * S2 scope (this file): backend orchestrator + admin handlers with MOCK agents.
 * S3 will replace mocks with real Claude API calls (anthropic-ai/sdk).
 * S6 will replace `mockApply` with real MD writing + GitHub Contents API commit.
 *
 * Auth: existing checkAuth() — Authorization: Bearer or ?key=
 */
import { corsHeaders } from '../utils/cors.js';
import { adminHeaderCSS, adminHeaderHTML, adminFooterHTML, adminHeaderScript } from '../utils/adminLayout.js';
import { checkAuth, extractKey } from '../utils/auth.js';
import { runJohn, runBob, runLeo, isTestMode, getDefaultModel } from '../agents/runner.js';
import { applyAndCommit } from '../agents/md-writer.js';
import { isGitDryRun } from '../agents/github-client.js';

// ─── Constants ───────────────────────────────────────────────────────────
const STAGE_NAMES   = { 1: 'COLLECT', 2: 'VERIFY', 3: 'SCORE', 4: 'RE-RANK', 5: 'APPROVE' };
const STAGE_AGENTS  = { 1: 'john',    2: 'bob',    3: 'leo' };
const ACTIVE_STATUSES   = new Set(['pending', 'running']);
const TERMINAL_STATUSES = new Set(['published', 'rejected', 'rolled_back', 'failed']);
const SCORE_REVIEW_THRESHOLD = 0.3;  // Lock per spec §3 row 3 — Δ ≥ 0.3 → needs Yegor review

// Live broker fields we touch (per spec §3 row 1 — Джон collects only "live" data)
const LIVE_FIELDS = [
  'spread', 'avg_spread', 'commission', 'min_deposit', 'leverage', 'instruments',
  'platforms', 'regulations', 'payment_methods', 'affiliate_url', 'tp', 'tp_count', 'status',
];

// ─── Helpers ─────────────────────────────────────────────────────────────
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// XSS guard: agent-supplied URLs (source_url, signals.source_url) might contain
// `javascript:` or `data:` schemes that bypass HTML escaping when used in href.
// Returns the URL only if it parses and uses http/https, otherwise null.
function safeHttpUrl(raw) {
  if (!raw) return null;
  try {
    const u = new URL(String(raw));
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.toString();
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d.includes('T') || d.includes('Z') ? d : d + 'Z');
  if (Number.isNaN(dt.valueOf())) return '—';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const HH = String(dt.getUTCHours()).padStart(2, '0');
  const MM = String(dt.getUTCMinutes()).padStart(2, '0');
  return `${months[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()} ${HH}:${MM}`;
}

function fmtDuration(startStr, endStr) {
  if (!startStr) return '—';
  const start = new Date(startStr.includes('T') ? startStr : startStr + 'Z').valueOf();
  const end   = endStr ? new Date(endStr.includes('T') ? endStr : endStr + 'Z').valueOf() : Date.now();
  if (Number.isNaN(start) || Number.isNaN(end)) return '—';
  const sec = Math.max(0, Math.floor((end - start) / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function jsonResponse(data, request, status = 200) {
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  return new Response(JSON.stringify(data), { status, headers });
}

function jsonError(request, message, status = 400) {
  return jsonResponse({ error: message }, request, status);
}

function validateRunId(raw) {
  const id = parseInt(raw, 10);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

// ─── DB helpers ──────────────────────────────────────────────────────────
async function getRun(env, runId) {
  return env.DB.prepare('SELECT * FROM pipeline_runs WHERE id = ?').bind(runId).first();
}

async function getActiveRun(env) {
  return env.DB.prepare(
    `SELECT * FROM pipeline_runs WHERE status IN ('pending', 'running', 'awaiting_approval')
     ORDER BY started_at DESC LIMIT 1`
  ).first();
}

async function listAllBrokerSlugs(env) {
  const result = await env.DB.prepare('SELECT slug FROM brokers ORDER BY slug').all();
  return result.results.map(r => r.slug);
}

// ─── Orchestration: self-rescheduling tick (S3) ─────────────────────────
//
// /start fans out queued agent_runs (3 per broker × N brokers) and schedules
// the first /tick. Each /tick claims one queued agent_run, runs the matching
// agent (john/bob/leo), persists its output, then schedules the next /tick.
// When no queued work remains, the tick advances completed pipeline_runs to
// 'awaiting_approval'. Ticks are short — Worker CPU/wall limits are respected
// because each iteration is a fresh request.

const STAGE_TO_AGENT = { 1: 'john', 2: 'bob', 3: 'leo' };

function selfTickUrl(request) {
  const u = new URL(request.url);
  // POST /api/admin/refresh/tick on the same origin we were invoked on.
  return `${u.protocol}//${u.host}/api/admin/refresh/tick`;
}

async function scheduleNextTick(request, env, ctx) {
  // Fire-and-forget self-fetch; new request = fresh CPU/wall budget. Auth via API_KEY.
  const url = selfTickUrl(request);
  const apiKey = env.API_KEY;
  const job = fetch(url, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + apiKey },
  }).catch(err => console.error('[freshness] tick reschedule failed:', err?.message || err));
  if (ctx?.waitUntil) ctx.waitUntil(job);
  else await job;
}

async function fanOutAgentRuns(env, runId, slugs) {
  // Build batched INSERTs: 3 agent_runs per broker (john/bob/leo).
  const stmts = [];
  for (const slug of slugs) {
    for (const stage of [1, 2, 3]) {
      stmts.push(env.DB.prepare(
        `INSERT INTO agent_runs (pipeline_run_id, broker_slug, agent, stage, status)
         VALUES (?, ?, ?, ?, 'queued')`
      ).bind(runId, slug, STAGE_TO_AGENT[stage], stage));
    }
  }
  if (stmts.length > 0) await env.DB.batch(stmts);
}

async function pickAndClaimNextAgentRun(env) {
  // Sequential per broker: only pick a queued row whose ALL earlier stages
  // for the same broker are 'done'. Failed/skipped predecessors mean a real
  // problem upstream — we should NOT silently let later stages run no-op
  // (Codex S3 H3). The cascade-skip in handleTick already marks downstream
  // rows 'skipped' on failure, so this gate just enforces "done == ready".
  const next = await env.DB.prepare(
    `SELECT ar.* FROM agent_runs ar
     JOIN pipeline_runs pr ON pr.id = ar.pipeline_run_id
     WHERE pr.status = 'running'
       AND ar.status = 'queued'
       AND NOT EXISTS (
         SELECT 1 FROM agent_runs prev
         WHERE prev.pipeline_run_id = ar.pipeline_run_id
           AND prev.broker_slug    = ar.broker_slug
           AND prev.stage          < ar.stage
           AND prev.status         <> 'done'
       )
     ORDER BY ar.stage ASC, ar.id ASC
     LIMIT 1`
  ).first();

  if (!next) return null;

  // Atomic claim: only proceed if still 'queued'. Lost-claim → caller retries.
  const claim = await env.DB.prepare(
    `UPDATE agent_runs SET status = 'running', started_at = ?
     WHERE id = ? AND status = 'queued'`
  ).bind(nowIso(), next.id).run();

  if ((claim.meta?.changes ?? 0) === 0) return null;
  return next;
}

// On agent failure, cascade-skip all later stages for the same broker so they
// do not run with missing/inconsistent predecessor data (Codex S3 H3).
async function cascadeSkipDownstream(env, agentRun, reason) {
  await env.DB.prepare(
    `UPDATE agent_runs
       SET status = 'skipped', finished_at = ?, error = ?
     WHERE pipeline_run_id = ? AND broker_slug = ? AND stage > ? AND status = 'queued'`
  ).bind(
    nowIso(),
    `skipped: upstream stage ${agentRun.stage} (${agentRun.agent}) ${reason}`.slice(0, 500),
    agentRun.pipeline_run_id,
    agentRun.broker_slug,
    agentRun.stage,
  ).run();
}

async function processAgentRun(env, agentRun) {
  const broker = await env.DB.prepare(
    `SELECT slug, name, affiliate_url FROM brokers WHERE slug = ?`
  ).bind(agentRun.broker_slug).first();

  if (!broker) {
    throw new Error(`Broker not found in DB: ${agentRun.broker_slug}`);
  }

  if (agentRun.agent === 'john') {
    // Idempotency (Codex S3 H3): if this agent_run is being retried, wipe any
    // findings inserted by a prior partial execution before re-inserting. The
    // (pipeline_run_id, broker_slug) pair owns John's slice exclusively.
    await env.DB.prepare(
      `DELETE FROM agent_findings WHERE pipeline_run_id = ? AND broker_slug = ?`
    ).bind(agentRun.pipeline_run_id, broker.slug).run();

    const out = await runJohn(env, broker);
    if (out.findings.length > 0) {
      const stmts = out.findings.map(f =>
        env.DB.prepare(
          `INSERT INTO agent_findings (pipeline_run_id, broker_slug, field, old_value, new_value, source_url, is_critical)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(agentRun.pipeline_run_id, broker.slug, f.field, f.old_value, f.new_value, f.source_url, out.is_critical ? 1 : 0)
      );
      await env.DB.batch(stmts);
    }
    return { output_json: { findings_count: out.findings.length, is_critical: out.is_critical, raw: out.raw_text }, usage: out.usage };
  }

  if (agentRun.agent === 'bob') {
    // Read John's findings for this (run, broker).
    const johnFindings = await env.DB.prepare(
      `SELECT id, field, new_value, source_url FROM agent_findings
       WHERE pipeline_run_id = ? AND broker_slug = ?`
    ).bind(agentRun.pipeline_run_id, broker.slug).all();

    const out = await runBob(env, broker, johnFindings.results || []);

    // Apply verifications
    if (out.verified.length > 0) {
      const stmts = out.verified.map(v =>
        env.DB.prepare(
          `UPDATE agent_findings SET verified = 1, verified_source_url = ?, verified_at = ?
           WHERE id = ? AND pipeline_run_id = ? AND broker_slug = ?`
        ).bind(v.verified_source_url, nowIso(), v.id, agentRun.pipeline_run_id, broker.slug)
      );
      await env.DB.batch(stmts);
    }
    if (out.rejected.length > 0) {
      const stmts = out.rejected.map(r =>
        env.DB.prepare(
          `UPDATE agent_findings SET verified = -1, verified_source_url = ?, verified_at = ?
           WHERE id = ? AND pipeline_run_id = ? AND broker_slug = ?`
        ).bind(`rejected: ${r.reason}`.slice(0, 500), nowIso(), r.id, agentRun.pipeline_run_id, broker.slug)
      );
      await env.DB.batch(stmts);
    }
    return { output_json: { verified: out.verified.length, rejected: out.rejected.length, raw: out.raw_text }, usage: out.usage };
  }

  if (agentRun.agent === 'leo') {
    // Only verified findings reach Leo.
    const verifiedFindings = await env.DB.prepare(
      `SELECT id, field, new_value FROM agent_findings
       WHERE pipeline_run_id = ? AND broker_slug = ? AND verified = 1`
    ).bind(agentRun.pipeline_run_id, broker.slug).all();

    // S6 will join MD frontmatter for current score; for S3 we have no baseline.
    const out = await runLeo(env, broker, verifiedFindings.results || [], null, null);

    // Idempotency (Codex S3 H3): wipe prior score_history rows for this (run, broker)
    // so a retry does not produce duplicate score deltas.
    await env.DB.prepare(
      `DELETE FROM score_history WHERE pipeline_run_id = ? AND broker_slug = ?`
    ).bind(agentRun.pipeline_run_id, broker.slug).run();

    // Persist score_history when Leo produced a numeric score (any delta — even 0).
    if (typeof out.score_new === 'number') {
      const needsReview = Math.abs(out.delta || 0) >= SCORE_REVIEW_THRESHOLD ? 1 : 0;
      await env.DB.prepare(
        `INSERT INTO score_history
          (pipeline_run_id, broker_slug, score_old, score_new, delta, needs_review, breakdown_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        agentRun.pipeline_run_id, broker.slug,
        typeof out.score_old === 'number' ? out.score_old : null,
        out.score_new,
        typeof out.delta === 'number' ? out.delta : 0,
        needsReview,
        out.breakdown ? JSON.stringify(out.breakdown) : null,
      ).run();
    }
    return {
      output_json: { score_old: out.score_old, score_new: out.score_new, delta: out.delta, rationale: out.rationale, raw: out.raw_text },
      usage: out.usage,
    };
  }

  throw new Error(`Unknown agent: ${agentRun.agent}`);
}

async function advanceCompletedRuns(env) {
  // Any 'running' run whose every agent_run is in a terminal status → flip to awaiting_approval.
  const candidates = await env.DB.prepare(
    `SELECT pr.id FROM pipeline_runs pr
     WHERE pr.status = 'running'
       AND NOT EXISTS (
         SELECT 1 FROM agent_runs ar
         WHERE ar.pipeline_run_id = pr.id AND ar.status IN ('queued', 'running')
       )`
  ).all();

  for (const row of candidates.results) {
    // Codex S3 M2: count distinct brokers with at least one failed agent_run,
    // not ceil(failed_runs / 3) — that under/overcounted depending on which
    // stages failed.
    const stats = await env.DB.prepare(
      `SELECT
         COUNT(DISTINCT broker_slug) AS total_brokers,
         (SELECT COUNT(DISTINCT broker_slug) FROM agent_runs
          WHERE pipeline_run_id = ? AND status = 'failed') AS failed_brokers
       FROM agent_runs WHERE pipeline_run_id = ?`
    ).bind(row.id, row.id).first();

    const findings = await env.DB.prepare(
      `SELECT COUNT(*) AS c FROM agent_findings WHERE pipeline_run_id = ?`
    ).bind(row.id).first();

    // Atomic transition: only if still 'running' (avoids racing /reject).
    await env.DB.prepare(
      `UPDATE pipeline_runs
         SET status = 'awaiting_approval', current_stage = 5,
             brokers_done = ?, brokers_failed = ?, changes_count = ?, finished_at = ?
       WHERE id = ? AND status = 'running'`
    ).bind(
      stats?.total_brokers ?? 0,
      stats?.failed_brokers ?? 0,
      findings?.c ?? 0,
      nowIso(),
      row.id,
    ).run();
  }
}

// ─── POST /api/admin/refresh/tick ─── (internal, but auth-protected)
//
// One tick processes up to MAX_TICK_ITERATIONS agent_runs back-to-back, then
// returns. This avoids relying on self-fetch self-rescheduling (which is flaky
// under `wrangler dev --local`) while still respecting Worker wall-clock limits.
//
// In test mode (stubs), all 114 runs finish in 1-2 ticks (~1s).
// In production with real Claude API, each iteration is ~30-60s wall-time but
// near-zero CPU (awaiting fetch), so MAX_TICK_ITERATIONS=8 keeps us under both
// the 30s CPU limit and the 5-min wall-clock per-request limit (8 × 30s = 4 min).
//
// After MAX_TICK_ITERATIONS, if work remains, we (a) try a fire-and-forget
// self-fetch to keep momentum, and (b) rely on the hourly cron tick as a fallback
// recovery channel. Worst case: pipeline pauses until next cron tick.

const MAX_TICK_ITERATIONS = 8;
const TICK_WALL_BUDGET_MS = 4 * 60 * 1000;  // 4 minutes — Worker request limit is 5 min on paid plan

export async function handleTick(request, env, ctx) {
  if (!checkAuth(request, env)) return jsonError(request, 'Unauthorized', 401);

  const startMs = Date.now();
  const processed = [];

  for (let i = 0; i < MAX_TICK_ITERATIONS; i++) {
    if (Date.now() - startMs > TICK_WALL_BUDGET_MS) break;

    const next = await pickAndClaimNextAgentRun(env);
    if (!next) break;

    try {
      const result = await processAgentRun(env, next);
      await env.DB.prepare(
        `UPDATE agent_runs
           SET status = 'done', finished_at = ?, output_json = ?,
               prompt_tokens = ?, completion_tokens = ?, cost_usd = ?
         WHERE id = ?`
      ).bind(
        nowIso(),
        result.output_json ? JSON.stringify(result.output_json).slice(0, 8000) : null,
        result.usage?.input_tokens ?? null,
        result.usage?.output_tokens ?? null,
        result.usage?.cost_usd ?? null,
        next.id,
      ).run();
      processed.push({ agent_run_id: next.id, broker_slug: next.broker_slug, agent: next.agent });
    } catch (err) {
      const msg = String(err?.message || err).slice(0, 500);
      console.error(`[freshness tick] agent_run ${next.id} (${next.agent}/${next.broker_slug}) failed:`, msg);
      await env.DB.prepare(
        `UPDATE agent_runs SET status = 'failed', finished_at = ?, error = ? WHERE id = ?`
      ).bind(nowIso(), msg, next.id).run();
      // Cascade-skip later stages for this broker so Bob/Leo don't run after
      // John failed (or Leo after a failed Bob) — see Codex S3 H3.
      await cascadeSkipDownstream(env, next, 'failed');
      processed.push({ agent_run_id: next.id, broker_slug: next.broker_slug, agent: next.agent, error: msg });
    }
  }

  // Try to advance completed runs.
  await advanceCompletedRuns(env);

  // If queued work remains, try to keep momentum via self-fetch.
  // Falls back to the hourly cron tick on platforms where self-fetch is unavailable.
  const remaining = await env.DB.prepare(
    `SELECT COUNT(*) AS c FROM agent_runs ar
     JOIN pipeline_runs pr ON pr.id = ar.pipeline_run_id
     WHERE pr.status = 'running' AND ar.status = 'queued'`
  ).first();
  if ((remaining?.c ?? 0) > 0) {
    await scheduleNextTick(request, env, ctx);
  }

  return jsonResponse({
    ok: true,
    iterations: processed.length,
    processed,
    remaining_queued: remaining?.c ?? 0,
    elapsed_ms: Date.now() - startMs,
  }, request);
}

// ═══ HANDLERS ════════════════════════════════════════════════════════════

// ─── POST /api/admin/refresh/start ───
export async function handleStartRefresh(request, env, ctx) {
  if (!checkAuth(request, env)) return jsonError(request, 'Unauthorized', 401);

  const body = await request.json().catch(() => ({}));
  const triggeredBy = (body.triggered_by || 'manual').slice(0, 50);

  // Atomic single-active-run guarantee: check + insert in one statement.
  // INSERT ... SELECT WHERE NOT EXISTS races safely against concurrent /start
  // calls — at most one of them produces a row.
  const insertRes = await env.DB.prepare(
    `INSERT INTO pipeline_runs (status, triggered_by)
     SELECT 'pending', ?
     WHERE NOT EXISTS (
       SELECT 1 FROM pipeline_runs WHERE status IN ('pending', 'running', 'awaiting_approval')
     )`
  ).bind(triggeredBy).run();

  if ((insertRes.meta?.changes ?? 0) === 0) {
    const active = await getActiveRun(env);
    return jsonError(
      request,
      active
        ? `Run #${active.id} is already ${active.status}. Wait for it to finish or reject it first.`
        : 'Could not start a new run (concurrent attempt).',
      409,
    );
  }

  const runId = insertRes.meta.last_row_id;

  // Fan out queued agent_runs (3 stages × N brokers) atomically. If this fails,
  // mark the run as 'failed' so the operator sees the error in the dashboard.
  let slugs;
  try {
    slugs = await listAllBrokerSlugs(env);
    if (slugs.length === 0) throw new Error('No brokers in DB to refresh');
    await fanOutAgentRuns(env, runId, slugs);

    // Atomic flip: pending → running. Only commits if still pending (no race with /reject).
    const flip = await env.DB.prepare(
      `UPDATE pipeline_runs SET status = 'running', current_stage = 1, total_brokers = ?
       WHERE id = ? AND status = 'pending'`
    ).bind(slugs.length, runId).run();
    if ((flip.meta?.changes ?? 0) === 0) {
      // Run was rejected before we finished setup — leave it alone (no agents will be processed
      // because /tick filters by pr.status='running').
      return jsonResponse({ ok: true, run_id: runId, note: 'Run was cancelled before fan-out completed.' }, request);
    }
  } catch (err) {
    const msg = String(err?.message || err).slice(0, 500);
    console.error(`[freshness] /start failed for run #${runId}:`, msg);
    await env.DB.prepare(
      `UPDATE pipeline_runs SET status = 'failed', finished_at = ?, notes = ?
       WHERE id = ? AND status NOT IN ('published', 'rolled_back', 'rejected')`
    ).bind(nowIso(), msg, runId).run().catch(() => {});
    return jsonError(request, `Failed to start run: ${msg}`, 500);
  }

  // Kick off the first tick. Each subsequent tick reschedules itself.
  await scheduleNextTick(request, env, ctx);

  return jsonResponse({
    ok: true,
    run_id: runId,
    queued_agent_runs: slugs.length * 3,
    test_mode: isTestMode(env),
    model: getDefaultModel(env),
  }, request);
}

// ─── GET /api/admin/refresh/active ───
export async function handleActiveRun(request, env) {
  if (!checkAuth(request, env)) return jsonError(request, 'Unauthorized', 401);

  const run = await getActiveRun(env);
  if (!run) return jsonResponse({ active: null }, request);

  const stages = [];
  for (let s = 1; s <= 3; s++) {
    const row = await env.DB.prepare(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'done'    THEN 1 ELSE 0 END) AS done,
         SUM(CASE WHEN status = 'failed'  THEN 1 ELSE 0 END) AS failed,
         SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) AS running
       FROM agent_runs WHERE pipeline_run_id = ? AND stage = ?`
    ).bind(run.id, s).first();
    stages.push({ stage: s, name: STAGE_NAMES[s], ...row });
  }

  return jsonResponse({ active: { ...run, stages } }, request);
}

// ─── GET /api/admin/refresh/runs ───
export async function handleRunsList(request, env) {
  if (!checkAuth(request, env)) return jsonError(request, 'Unauthorized', 401);

  const url = new URL(request.url);
  // Strict positive-integer validation: reject NaN, ≤0 or non-numeric input,
  // fall back to safe default. Cap at 200.
  const rawLimit = parseInt(url.searchParams.get('limit') || '', 10);
  const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 200) : 50;

  const runs = await env.DB.prepare(
    `SELECT id, status, started_at, finished_at, approved_at, total_brokers,
            brokers_done, brokers_failed, changes_count, triggered_by, git_commit_sha
     FROM pipeline_runs
     ORDER BY started_at DESC
     LIMIT ?`
  ).bind(limit).all();

  return jsonResponse({ runs: runs.results }, request);
}

// ─── GET /api/admin/refresh/:id ───
export async function handleRunDetail(request, env, runIdRaw) {
  if (!checkAuth(request, env)) return jsonError(request, 'Unauthorized', 401);
  const runId = validateRunId(runIdRaw);
  if (!runId) return jsonError(request, 'Invalid run id');

  const run = await getRun(env, runId);
  if (!run) return jsonError(request, 'Run not found', 404);

  const [agentRuns, findings, scores] = await Promise.all([
    env.DB.prepare('SELECT * FROM agent_runs WHERE pipeline_run_id = ? ORDER BY broker_slug, stage').bind(runId).all(),
    env.DB.prepare('SELECT * FROM agent_findings WHERE pipeline_run_id = ? ORDER BY is_critical DESC, broker_slug, field').bind(runId).all(),
    env.DB.prepare('SELECT * FROM score_history WHERE pipeline_run_id = ? ORDER BY needs_review DESC, broker_slug').bind(runId).all(),
  ]);

  return jsonResponse({
    run,
    agent_runs: agentRuns.results,
    findings: findings.results,
    score_changes: scores.results,
  }, request);
}

// ─── GET /api/admin/refresh/:id/diff ───
// Approval-screen data: per-broker findings + score deltas, joined for UI.
export async function handleRunDiff(request, env, runIdRaw) {
  if (!checkAuth(request, env)) return jsonError(request, 'Unauthorized', 401);
  const runId = validateRunId(runIdRaw);
  if (!runId) return jsonError(request, 'Invalid run id');

  const run = await getRun(env, runId);
  if (!run) return jsonError(request, 'Run not found', 404);

  const [findings, scores] = await Promise.all([
    env.DB.prepare(
      `SELECT * FROM agent_findings WHERE pipeline_run_id = ? AND verified = 1
       ORDER BY is_critical DESC, broker_slug, field`
    ).bind(runId).all(),
    env.DB.prepare(
      `SELECT * FROM score_history WHERE pipeline_run_id = ? ORDER BY broker_slug`
    ).bind(runId).all(),
  ]);

  // Group findings by broker_slug
  const byBroker = {};
  for (const f of findings.results) {
    if (!byBroker[f.broker_slug]) byBroker[f.broker_slug] = { findings: [], score: null };
    byBroker[f.broker_slug].findings.push(f);
  }
  for (const s of scores.results) {
    if (!byBroker[s.broker_slug]) byBroker[s.broker_slug] = { findings: [], score: null };
    byBroker[s.broker_slug].score = s;
  }

  const brokers = Object.entries(byBroker)
    .map(([slug, data]) => ({ slug, ...data }))
    .sort((a, b) => {
      // Critical first, then needs_review, then by slug
      const aCrit = a.findings.some(f => f.is_critical) ? 1 : 0;
      const bCrit = b.findings.some(f => f.is_critical) ? 1 : 0;
      if (aCrit !== bCrit) return bCrit - aCrit;
      const aRev = a.score?.needs_review ? 1 : 0;
      const bRev = b.score?.needs_review ? 1 : 0;
      if (aRev !== bRev) return bRev - aRev;
      return a.slug.localeCompare(b.slug);
    });

  return jsonResponse({ run, brokers }, request);
}

// ─── POST /api/admin/refresh/:id/approve ───
// Body: { approved_finding_ids: number[] }  (empty array allowed → "approve nothing")
export async function handleApproveRun(request, env, runIdRaw) {
  if (!checkAuth(request, env)) return jsonError(request, 'Unauthorized', 401);
  const runId = validateRunId(runIdRaw);
  if (!runId) return jsonError(request, 'Invalid run id');

  const run = await getRun(env, runId);
  if (!run) return jsonError(request, 'Run not found', 404);
  if (run.status !== 'awaiting_approval') {
    return jsonError(request, `Cannot approve run in status '${run.status}'`, 409);
  }

  const body = await request.json().catch(() => ({}));
  const approvedIdsRaw = Array.isArray(body.approved_finding_ids) ? body.approved_finding_ids : [];
  const safeIds = approvedIdsRaw.filter(n => Number.isInteger(n) && n > 0);

  // Pre-flight: every submitted finding must belong to this run AND be verified by Боб.
  // This is the Stage 2 gate — without it, a crafted POST could publish unverified findings.
  if (safeIds.length > 0) {
    const placeholders = safeIds.map(() => '?').join(',');
    const check = await env.DB.prepare(
      `SELECT COUNT(*) AS cnt FROM agent_findings
       WHERE pipeline_run_id = ? AND verified = 1 AND id IN (${placeholders})`
    ).bind(runId, ...safeIds).first();
    if ((check?.cnt ?? 0) !== safeIds.length) {
      return jsonError(request, 'One or more submitted findings are not verified by Боб (Stage 2). Cannot approve.', 409);
    }
  }

  // Atomic CLAIM (intermediate 'approved' state) — prevents double-approve race
  // and lets us roll back to 'awaiting_approval' if the git commit fails.
  // Two terminal states from here:
  //   approved → published (commit OK)
  //   approved → awaiting_approval (commit failed; user can retry)
  const claimTx = await env.DB.prepare(
    `UPDATE pipeline_runs SET status = 'approved', approved_at = ?, approved_by = ?
     WHERE id = ? AND status = 'awaiting_approval'`
  ).bind(nowIso(), 'yegor', runId).run();
  if ((claimTx.meta?.changes ?? 0) === 0) {
    return jsonError(request, 'Run status changed concurrently — refresh and retry.', 409);
  }

  // (Codex S6 H1) Reset ALL findings' approval state for this run before applying
  // the new selection. Previous attempts could have left rows at approved=1 or -1;
  // without this reset, a retry's intent silently merges with the old attempt.
  // Note: the row's `verified` column is untouched (Bob's gate stays valid).
  await env.DB.prepare(
    `UPDATE agent_findings SET approved = 0 WHERE pipeline_run_id = ?`
  ).bind(runId).run();

  // Mark approved findings (verified gate already satisfied by pre-flight check above).
  if (safeIds.length > 0) {
    const placeholders = safeIds.map(() => '?').join(',');
    await env.DB.prepare(
      `UPDATE agent_findings SET approved = 1
       WHERE pipeline_run_id = ? AND verified = 1 AND id IN (${placeholders})`
    ).bind(runId, ...safeIds).run();
  }

  // Mark un-selected findings as skipped (approved = -1) for clear audit trail.
  await env.DB.prepare(
    `UPDATE agent_findings SET approved = -1
     WHERE pipeline_run_id = ? AND approved = 0`
  ).bind(runId).run();

  // ─── S6: gather approved findings + score changes → write MD → git commit ─
  // (Codex S6 round 2 H1) Use Object.create(null) — defends against prototype
  // pollution if a poisoned broker_slug like '__proto__' / 'constructor' ever
  // reaches us. Slugs are also re-validated at the route level (below) so they
  // never even reach md-writer with an invalid value.
  const SLUG_GUARD = /^[a-z0-9][a-z0-9-]{0,99}$/;

  const approvedRows = await env.DB.prepare(
    `SELECT broker_slug, field, new_value FROM agent_findings
     WHERE pipeline_run_id = ? AND approved = 1 AND verified = 1`
  ).bind(runId).all();
  const findingsByBroker = Object.create(null);
  for (const r of approvedRows.results || []) {
    if (!SLUG_GUARD.test(r.broker_slug || '')) {
      // Should never happen (DB slugs are validated upstream), but reject loudly
      // rather than silently dropping. Roll back the claim and 409.
      await env.DB.prepare(
        `UPDATE pipeline_runs SET status = 'awaiting_approval', approved_at = NULL, approved_by = NULL,
          notes = ? WHERE id = ? AND status = 'approved'`
      ).bind(`invalid broker_slug in findings: ${String(r.broker_slug).slice(0, 60)}`, runId).run().catch(() => {});
      return jsonError(request, `Invalid broker_slug in findings — aborted.`, 409);
    }
    if (!findingsByBroker[r.broker_slug]) findingsByBroker[r.broker_slug] = [];
    findingsByBroker[r.broker_slug].push({ field: r.field, new_value: r.new_value });
  }
  // Pull Leo's score deltas (only for brokers with at least one approved finding).
  const scoreRows = await env.DB.prepare(
    `SELECT broker_slug, score_new, score_old, delta FROM score_history
     WHERE pipeline_run_id = ? AND broker_slug IN (
       SELECT DISTINCT broker_slug FROM agent_findings
       WHERE pipeline_run_id = ? AND approved = 1
     )`
  ).bind(runId, runId).all();
  const scoreByBroker = Object.create(null);
  for (const r of scoreRows.results || []) {
    if (SLUG_GUARD.test(r.broker_slug || '')) scoreByBroker[r.broker_slug] = r;
  }

  let commitResult = null;
  try {
    commitResult = await applyAndCommit(env, findingsByBroker, scoreByBroker, runId);
  } catch (err) {
    const msg = String(err?.message || err).slice(0, 500);
    console.error(`[freshness] /approve commit failed for run #${runId}:`, msg);
    // (Codex S6 H1) Roll back BOTH the run state AND the findings approval flags
    // so the next attempt starts from a clean slate.
    await env.DB.prepare(
      `UPDATE agent_findings SET approved = 0 WHERE pipeline_run_id = ?`
    ).bind(runId).run().catch(() => {});
    await env.DB.prepare(
      `UPDATE pipeline_runs SET status = 'awaiting_approval', approved_at = NULL, approved_by = NULL,
        notes = ? WHERE id = ? AND status = 'approved'`
    ).bind(`commit failed: ${msg}`, runId).run().catch(() => {});
    return jsonError(request, `Approve failed during git commit: ${msg}`, 500);
  }

  const isDry = commitResult?.dry_run === true;
  // (Codex S6 M2) Dry-run produces 'published' too (so the UI flow finishes),
  // BUT we leave git_commit_sha NULL and write a notes marker so the audit log
  // makes clear no repo mutation occurred.
  // (Codex S6 round 2 M1) Always overwrite notes on publish — without this a
  // stale "commit failed: ..." from a previous attempt would survive a
  // successful retry and mislead the audit trail.
  const publishNotes = isDry ? 'dry-run (no git commit — FRESHNESS_TEST_MODE=1 or creds missing)' : null;

  // Commit OK (or dry-run with no real commit). Flip to 'published' atomically.
  const publishTx = await env.DB.prepare(
    `UPDATE pipeline_runs SET status = 'published', git_commit_sha = ?, notes = ?
     WHERE id = ? AND status = 'approved'`
  ).bind(commitResult?.commit_sha || null, publishNotes, runId).run();
  if ((publishTx.meta?.changes ?? 0) === 0) {
    return jsonError(request, 'Could not finalise publish — run state changed concurrently.', 500);
  }

  // (Codex S6 H2) Mark score_history.applied=1 ONLY for brokers actually
  // committed (or all dry-run brokers, since none were committed for real).
  // Use committed_slugs from applyAndCommit to avoid partial-publish drift.
  const committed = Array.isArray(commitResult?.committed_slugs) ? commitResult.committed_slugs : [];
  if (committed.length > 0) {
    const placeholders = committed.map(() => '?').join(',');
    await env.DB.prepare(
      `UPDATE score_history SET applied = 1
       WHERE pipeline_run_id = ? AND broker_slug IN (${placeholders})`
    ).bind(runId, ...committed).run();
  }

  return jsonResponse({
    ok: true,
    approved_count: safeIds.length,
    git: {
      dry_run:         isDry,
      commit_sha:      commitResult?.commit_sha || null,
      branch:          commitResult?.branch || null,
      file_count:      commitResult?.file_count ?? 0,
      committed_slugs: committed,
      summary:         commitResult?.summary || null,
    },
  }, request);
}

// ─── POST /api/admin/refresh/:id/reject ───
export async function handleRejectRun(request, env, runIdRaw) {
  if (!checkAuth(request, env)) return jsonError(request, 'Unauthorized', 401);
  const runId = validateRunId(runIdRaw);
  if (!runId) return jsonError(request, 'Invalid run id');

  const run = await getRun(env, runId);
  if (!run) return jsonError(request, 'Run not found', 404);

  // Atomic transition: only flip if not already terminal AND not in the middle
  // of an approval commit. (Codex S6 M1) 'approved' is an intermediate state
  // during /approve — rejecting there could race past a successful git commit
  // and leave the branch with a commit while the run reads 'rejected'.
  // simulatePipeline (S2) re-reads status before each broker, so flipping
  // to 'rejected' here will halt an in-flight worker on its next iteration.
  const tx = await env.DB.prepare(
    `UPDATE pipeline_runs SET status = 'rejected', finished_at = COALESCE(finished_at, ?)
     WHERE id = ? AND status NOT IN ('published', 'rolled_back', 'failed', 'rejected', 'approved')`
  ).bind(nowIso(), runId).run();

  if ((tx.meta?.changes ?? 0) === 0) {
    return jsonError(request, `Cannot reject run in status '${run.status}' — wait for current state to settle.`, 409);
  }

  return jsonResponse({ ok: true }, request);
}

// ─── POST /api/admin/refresh/:id/rollback ───
// Post-publish reversal: revert MD via git revert + restore previous scores.
// S6 will execute the actual git operation; S2 just sets status.
export async function handleRollbackRun(request, env, runIdRaw) {
  if (!checkAuth(request, env)) return jsonError(request, 'Unauthorized', 401);
  const runId = validateRunId(runIdRaw);
  if (!runId) return jsonError(request, 'Invalid run id');

  const run = await getRun(env, runId);
  if (!run) return jsonError(request, 'Run not found', 404);

  // Atomic transition: only flip if currently 'published'. Prevents a second
  // rollback or a concurrent reject from racing through.
  const tx = await env.DB.prepare(
    `UPDATE pipeline_runs SET status = 'rolled_back' WHERE id = ? AND status = 'published'`
  ).bind(runId).run();
  if ((tx.meta?.changes ?? 0) === 0) {
    return jsonError(request, `Can only rollback published runs (current: '${run.status}')`, 409);
  }

  await env.DB.prepare(
    `UPDATE score_history SET applied = 0 WHERE pipeline_run_id = ?`
  ).bind(runId).run();

  return jsonResponse({ ok: true, note: 'Rollback complete (S6 will add real git revert).' }, request);
}

// ─── GET /api/admin/signals ───
export async function handleSignalsList(request, env) {
  if (!checkAuth(request, env)) return jsonError(request, 'Unauthorized', 401);

  const url = new URL(request.url);
  const onlyOpen = url.searchParams.get('open') !== '0';

  const sql = onlyOpen
    ? `SELECT * FROM signals WHERE resolved = 0 ORDER BY severity DESC, created_at DESC LIMIT 200`
    : `SELECT * FROM signals ORDER BY created_at DESC LIMIT 200`;

  const rows = await env.DB.prepare(sql).all();
  return jsonResponse({ signals: rows.results }, request);
}

// ─── POST /api/admin/signals/:id/resolve ───
export async function handleSignalResolve(request, env, signalIdRaw) {
  if (!checkAuth(request, env)) return jsonError(request, 'Unauthorized', 401);
  const signalId = parseInt(signalIdRaw, 10);
  if (!Number.isInteger(signalId) || signalId <= 0) return jsonError(request, 'Invalid signal id');

  await env.DB.prepare(
    `UPDATE signals SET resolved = 1, resolved_at = ?, resolved_by = ? WHERE id = ?`
  ).bind(nowIso(), 'yegor', signalId).run();

  return jsonResponse({ ok: true }, request);
}

// ─── GET /api/admin/refresh/dashboard — HTML ────────────────────────────
export async function handleFreshnessDashboard(request, env) {
  if (!checkAuth(request, env)) return new Response('Unauthorized', { status: 401 });

  const encodedKey = encodeURIComponent(extractKey(request));

  const [active, lastPublished, runsRes, signalsRes, totalBrokers] = await Promise.all([
    getActiveRun(env),
    env.DB.prepare(
      `SELECT * FROM pipeline_runs WHERE status = 'published' ORDER BY approved_at DESC LIMIT 1`
    ).first(),
    env.DB.prepare(
      `SELECT id, status, started_at, finished_at, approved_at, total_brokers, brokers_done, changes_count, triggered_by
       FROM pipeline_runs ORDER BY started_at DESC LIMIT 20`
    ).all(),
    env.DB.prepare(
      `SELECT * FROM signals WHERE resolved = 0 ORDER BY severity DESC, created_at DESC LIMIT 20`
    ).all(),
    env.DB.prepare('SELECT COUNT(*) AS c FROM brokers').first(),
  ]);

  const runs = runsRes.results;
  const signals = signalsRes.results;
  const totalCount = totalBrokers?.c ?? 0;

  const runRows = runs.length === 0
    ? `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:24px">No runs yet — click "Start Monthly Refresh" to begin.</td></tr>`
    : runs.map(r => `
        <tr>
          <td style="font-weight:700;color:var(--text-primary)">#${r.id}</td>
          <td>${statusBadge(r.status)}</td>
          <td style="white-space:nowrap;color:var(--text-secondary)">${fmtDate(r.started_at)}</td>
          <td style="color:var(--text-muted)">${fmtDuration(r.started_at, r.finished_at)}</td>
          <td style="color:var(--text-secondary)">${r.brokers_done ?? 0} / ${r.total_brokers ?? 0}</td>
          <td style="color:var(--amber);font-weight:700">${r.changes_count ?? 0}</td>
          <td style="text-align:right">
            ${r.status === 'awaiting_approval'
              ? `<a class="btn-primary" href="/api/admin/refresh/${r.id}/approve-ui?key=${encodedKey}" style="text-decoration:none">Review →</a>`
              : `<a class="btn-secondary" href="/api/admin/refresh/${r.id}/approve-ui?key=${encodedKey}" style="text-decoration:none">View</a>`}
          </td>
        </tr>
      `).join('');

  const signalRows = signals.length === 0
    ? `<div style="text-align:center;color:var(--text-muted);padding:24px;font-size:13px">No active signals.</div>`
    : signals.map(s => `
        <div class="signal-row sev-${esc(s.severity)}">
          <div class="signal-dot"></div>
          <div class="signal-meta">
            <div class="signal-source">${esc(s.source)}${s.broker_slug ? ' · ' + esc(s.broker_slug) : ''}</div>
            <div class="signal-msg">${esc(s.message)}</div>
            <div class="signal-time">${fmtDate(s.created_at)}</div>
          </div>
          <button class="btn-ghost" onclick="resolveSignal(${s.id}, this)">Resolve</button>
        </div>
      `).join('');

  const activeBlock = active ? `
    <div class="active-run">
      <div class="ar-header">
        <div>
          <div class="ar-label">Active Run #${active.id} — ${esc(active.status)}</div>
          <div class="ar-sub">Started ${fmtDate(active.started_at)} · ${fmtDuration(active.started_at, active.finished_at)}</div>
        </div>
        ${active.status === 'awaiting_approval'
          ? `<a class="btn-primary" href="/api/admin/refresh/${active.id}/approve-ui?key=${encodedKey}" style="text-decoration:none">Review changes →</a>`
          : `<button class="btn-secondary" disabled>Running…</button>`}
      </div>
      <div class="ar-progress">
        <div class="ar-progress-fill" style="width:${Math.min(100, (active.brokers_done / Math.max(1, active.total_brokers)) * 100)}%"></div>
      </div>
      <div class="ar-stats">
        ${active.brokers_done ?? 0} / ${active.total_brokers ?? 0} brokers
        · ${active.changes_count ?? 0} changes
        · current stage: <strong>${STAGE_NAMES[active.current_stage] || '—'}</strong>
      </div>
    </div>
  ` : '';

  const startDisabled = active ? 'disabled' : '';

  const lastSummary = lastPublished
    ? `Last run: <strong>#${lastPublished.id}</strong> · ${fmtDate(lastPublished.approved_at)} · ${lastPublished.changes_count ?? 0} changes published`
    : `No published runs yet.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Freshness Pipeline — Rated.Admin</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0c10; color: #f0f0f0; }
  ${adminHeaderCSS()}

  .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  @media (max-width: 768px) { .summary-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .summary-grid { grid-template-columns: 1fr; } }

  .hero-bar {
    background: linear-gradient(135deg, rgba(74,222,128,0.06), rgba(96,165,250,0.04));
    border: 1px solid rgba(74,222,128,0.15);
    border-radius: 14px; padding: 22px 28px; margin-bottom: 24px;
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
    box-shadow: 0 0 24px rgba(74,222,128,0.04);
  }
  .hero-bar h1 { font-size: 20px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; }
  .hero-bar p  { font-size: 13px; color: var(--text-secondary); }
  .hero-bar .btn-primary { font-size: 14px; padding: 12px 24px; }
  .hero-bar .btn-primary:disabled { background: rgba(255,255,255,0.04); color: var(--text-muted); border-color: var(--border); box-shadow: none; }

  .active-run {
    background: var(--bg-card-solid); border: 1px solid var(--amber);
    border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;
    box-shadow: 0 0 16px rgba(251,191,36,0.08);
  }
  .ar-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
  .ar-label { font-size: 13px; font-weight: 700; color: var(--amber); text-transform: uppercase; letter-spacing: 0.5px; }
  .ar-sub { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
  .ar-progress { height: 6px; background: rgba(255,255,255,0.04); border-radius: 3px; overflow: hidden; margin-bottom: 8px; }
  .ar-progress-fill { height: 100%; background: linear-gradient(90deg, var(--amber), var(--green)); transition: width 0.3s; }
  .ar-stats { font-size: 12px; color: var(--text-secondary); }
  .ar-stats strong { color: var(--text-primary); }

  .badge {
    display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px;
    border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .badge-pending     { background: rgba(255,255,255,0.06); color: var(--text-muted); }
  .badge-running     { background: var(--amber-glow); color: var(--amber); }
  .badge-awaiting    { background: var(--blue-glow); color: var(--blue); }
  .badge-published   { background: var(--green-glow); color: var(--green); }
  .badge-rejected    { background: rgba(255,255,255,0.06); color: var(--text-muted); }
  .badge-failed      { background: var(--red-glow); color: var(--red); }
  .badge-rolledback  { background: rgba(248,113,113,0.08); color: var(--red); }

  .grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start; }
  @media (max-width: 1024px) { .grid-2 { grid-template-columns: 1fr; } }

  .panel {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 12px; padding: 18px 20px; backdrop-filter: blur(12px);
  }

  .signal-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 14px; border-radius: 10px;
    border: 1px solid var(--border); margin-bottom: 8px;
    background: rgba(255,255,255,0.02);
  }
  .signal-row.sev-critical { border-left: 3px solid var(--red); }
  .signal-row.sev-warning  { border-left: 3px solid var(--amber); }
  .signal-row.sev-info     { border-left: 3px solid var(--blue); }
  .signal-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
  .signal-row.sev-critical .signal-dot { background: var(--red); box-shadow: 0 0 8px var(--red); }
  .signal-row.sev-warning  .signal-dot { background: var(--amber); }
  .signal-row.sev-info     .signal-dot { background: var(--blue); }
  .signal-meta { flex: 1; min-width: 0; }
  .signal-source { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .signal-msg { font-size: 13px; color: var(--text-primary); margin: 4px 0; }
  .signal-time { font-size: 11px; color: var(--text-muted); }
</style>
</head>
<body>
<div class="admin-shell">
  ${adminHeaderHTML('freshness', encodedKey)}
  <div class="admin-body">

    <div class="hero-bar">
      <div>
        <h1>Freshness Pipeline</h1>
        <p>${lastSummary}</p>
      </div>
      <button id="startBtn" class="btn-primary" onclick="startRefresh()" ${startDisabled}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Start Monthly Refresh
      </button>
    </div>

    ${activeBlock}

    <div class="summary-grid">
      <div class="glass-card c-green">
        <div class="card-label">Brokers tracked</div>
        <div class="card-value">${totalCount}</div>
        <div class="card-sub">live data fields per broker</div>
      </div>
      <div class="glass-card c-blue">
        <div class="card-label">Total runs</div>
        <div class="card-value">${runs.length}</div>
        <div class="card-sub">history (last 20 shown)</div>
      </div>
      <div class="glass-card c-amber">
        <div class="card-label">Active signals</div>
        <div class="card-value">${signals.length}</div>
        <div class="card-sub">unresolved</div>
      </div>
      <div class="glass-card c-purple">
        <div class="card-label">Last published</div>
        <div class="card-value" style="font-size:18px">${lastPublished ? '#' + lastPublished.id : '—'}</div>
        <div class="card-sub">${lastPublished ? fmtDate(lastPublished.approved_at) : 'No history'}</div>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div class="section-hdr sh-green">
          <div class="sh-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>
          </div>
          <h2>Recent Runs</h2>
        </div>
        <div class="panel" style="padding:0;overflow:hidden">
          <table class="premium-table">
            <thead><tr>
              <th>#</th><th>Status</th><th>Started</th><th>Duration</th><th>Brokers</th><th>Changes</th><th></th>
            </tr></thead>
            <tbody>${runRows}</tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="section-hdr sh-amber">
          <div class="sh-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h2>Active Signals</h2>
        </div>
        <div class="panel">
          ${signalRows}
        </div>
      </div>
    </div>

  </div>
  ${adminFooterHTML()}
</div>

<script>
  ${adminHeaderScript()}

  const KEY = ${JSON.stringify(extractKey(request))};

  async function startRefresh() {
    const btn = document.getElementById('startBtn');
    if (!btn || btn.disabled) return;
    if (!confirm('Start a new monthly refresh? This runs Джон/Боб/Лео across all brokers.')) return;
    btn.disabled = true;
    btn.textContent = 'Starting…';
    try {
      const res = await fetch('/api/admin/refresh/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
        body: JSON.stringify({ triggered_by: 'manual' }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert('Failed: ' + (data.error || 'unknown'));
        btn.disabled = false;
        btn.textContent = 'Start Monthly Refresh';
        return;
      }
      window.location.reload();
    } catch (err) {
      alert('Network error: ' + err.message);
      btn.disabled = false;
      btn.textContent = 'Start Monthly Refresh';
    }
  }

  async function resolveSignal(id, btn) {
    if (!confirm('Mark signal as resolved?')) return;
    btn.disabled = true;
    try {
      const res = await fetch('/api/admin/signals/' + id + '/resolve', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + KEY },
      });
      if (res.ok) btn.closest('.signal-row').remove();
      else { btn.disabled = false; alert('Failed.'); }
    } catch (err) {
      btn.disabled = false; alert('Error: ' + err.message);
    }
  }
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

// ─── GET /api/admin/refresh/:id/approve-ui — HTML approval screen ───────
export async function handleApprovalUI(request, env, runIdRaw) {
  if (!checkAuth(request, env)) return new Response('Unauthorized', { status: 401 });
  const runId = validateRunId(runIdRaw);
  if (!runId) return new Response('Invalid run id', { status: 400 });

  const run = await getRun(env, runId);
  if (!run) return new Response('Run not found', { status: 404 });

  const encodedKey = encodeURIComponent(extractKey(request));

  // Only verified findings reach the approval screen — same gate as /diff.
  // Bob-rejected (verified = -1) and unverified (verified = 0) findings stay out
  // so they cannot be checked into approval by accident.
  const findings = await env.DB.prepare(
    `SELECT * FROM agent_findings WHERE pipeline_run_id = ? AND verified = 1
     ORDER BY is_critical DESC, broker_slug, field`
  ).bind(runId).all();

  const scores = await env.DB.prepare(
    `SELECT * FROM score_history WHERE pipeline_run_id = ? ORDER BY needs_review DESC, broker_slug`
  ).bind(runId).all();

  const scoreBySlug = {};
  for (const s of scores.results) scoreBySlug[s.broker_slug] = s;

  const byBroker = {};
  for (const f of findings.results) {
    if (!byBroker[f.broker_slug]) byBroker[f.broker_slug] = [];
    byBroker[f.broker_slug].push(f);
  }

  const isReadOnly = run.status !== 'awaiting_approval';

  const brokerCards = Object.entries(byBroker)
    .sort((a, b) => {
      const aCrit = a[1].some(f => f.is_critical) ? 1 : 0;
      const bCrit = b[1].some(f => f.is_critical) ? 1 : 0;
      if (aCrit !== bCrit) return bCrit - aCrit;
      const aRev = scoreBySlug[a[0]]?.needs_review ? 1 : 0;
      const bRev = scoreBySlug[b[0]]?.needs_review ? 1 : 0;
      if (aRev !== bRev) return bRev - aRev;
      return a[0].localeCompare(b[0]);
    })
    .map(([slug, items]) => {
      const score = scoreBySlug[slug];
      const isCritical = items.some(f => f.is_critical);
      const needsReview = score?.needs_review === 1;

      const findingRows = items.map(f => {
        const safeSrc = safeHttpUrl(f.source_url);
        return `
        <label class="finding-row ${f.is_critical ? 'is-critical' : ''}">
          <input type="checkbox" data-fid="${f.id}"
            ${isReadOnly ? 'disabled' : (f.approved !== -1 ? 'checked' : '')}
            ${f.approved === 1 ? 'data-was-approved="1"' : ''}>
          <div class="finding-meta">
            <div class="finding-field">${esc(f.field)}</div>
            <div class="finding-change">
              <span class="old">${esc(f.old_value)}</span>
              <span class="arrow">→</span>
              <span class="new">${esc(f.new_value)}</span>
            </div>
            ${safeSrc
              ? `<a href="${esc(safeSrc)}" target="_blank" rel="noopener noreferrer" class="finding-source">${esc(safeSrc)}</a>`
              : (f.source_url ? `<span class="finding-source" style="color:var(--text-muted)">${esc(f.source_url)} (blocked: non-http scheme)</span>` : '')}
          </div>
        </label>
      `;
      }).join('');

      const scoreBlock = score ? `
        <div class="score-block ${needsReview ? 'needs-review' : ''}">
          <div class="score-label">Trust score</div>
          <div class="score-values">
            <span class="old">${score.score_old?.toFixed(1) ?? '—'}</span>
            <span class="arrow">→</span>
            <span class="new">${score.score_new?.toFixed(1) ?? '—'}</span>
            <span class="delta ${score.delta >= 0 ? 'pos' : 'neg'}">${score.delta >= 0 ? '+' : ''}${score.delta?.toFixed(2)}</span>
          </div>
          ${needsReview ? '<div class="needs-review-flag">⚠️ Needs review (Δ ≥ 0.3)</div>' : ''}
        </div>
      ` : '';

      return `
        <div class="broker-card ${isCritical ? 'is-critical' : ''} ${needsReview ? 'needs-review' : ''}" data-slug="${esc(slug)}">
          <div class="broker-header">
            <h3>${esc(slug)}</h3>
            <div class="broker-flags">
              ${isCritical ? '<span class="flag flag-critical">CRITICAL</span>' : ''}
              ${needsReview ? '<span class="flag flag-review">REVIEW</span>' : ''}
            </div>
          </div>
          ${scoreBlock}
          <div class="findings-list">${findingRows}</div>
        </div>
      `;
    }).join('');

  const headerStatus = statusBadge(run.status);

  const totalFindings = findings.results.length;
  const criticalCount = findings.results.filter(f => f.is_critical).length;
  const reviewCount   = scores.results.filter(s => s.needs_review).length;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Run #${run.id} — Approval — Rated.Admin</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0c10; color: #f0f0f0; }
  ${adminHeaderCSS()}

  .approval-summary {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    padding: 18px 22px; margin-bottom: 24px;
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px;
  }
  .approval-summary h1 { font-size: 20px; font-weight: 800; }
  .summary-stat { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; background: rgba(255,255,255,0.04); }
  .summary-stat.critical { color: var(--red); background: var(--red-glow); }
  .summary-stat.review { color: var(--amber); background: var(--amber-glow); }
  .summary-stat.ok { color: var(--green); background: var(--green-glow); }

  .approval-actions { margin-left: auto; display: flex; gap: 10px; }

  .toolbar {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 16px; margin-bottom: 16px;
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px;
  }

  .broker-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 1024px) { .broker-grid { grid-template-columns: 1fr; } }

  .broker-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px 18px; transition: border-color 0.2s;
  }
  .broker-card:hover { border-color: var(--border-hover); }
  .broker-card.is-critical { border-left: 3px solid var(--red); }
  .broker-card.needs-review:not(.is-critical) { border-left: 3px solid var(--amber); }

  .broker-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
  .broker-header h3 { font-size: 16px; font-weight: 700; color: var(--text-primary); }
  .broker-flags { display: flex; gap: 6px; }
  .flag { font-size: 9px; padding: 2px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .flag-critical { background: var(--red); color: #fff; }
  .flag-review   { background: var(--amber); color: #0a0c10; }

  .score-block { padding: 10px 12px; margin-bottom: 10px; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); }
  .score-block.needs-review { border-color: var(--amber); }
  .score-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .score-values { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; margin-top: 4px; }
  .score-values .old { color: var(--text-muted); }
  .score-values .arrow { color: var(--text-muted); font-size: 14px; }
  .score-values .new { color: var(--text-primary); }
  .score-values .delta.pos { color: var(--green); font-size: 13px; }
  .score-values .delta.neg { color: var(--red); font-size: 13px; }
  .needs-review-flag { font-size: 11px; color: var(--amber); margin-top: 6px; }

  .findings-list { display: flex; flex-direction: column; gap: 6px; }
  .finding-row {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 8px 10px; border-radius: 8px; cursor: pointer;
    transition: background 0.15s;
  }
  .finding-row:hover { background: rgba(255,255,255,0.03); }
  .finding-row.is-critical { background: rgba(248,113,113,0.04); }
  .finding-row input[type="checkbox"] { margin-top: 3px; cursor: pointer; }
  .finding-row input[type="checkbox"]:disabled { cursor: not-allowed; opacity: 0.6; }
  .finding-meta { flex: 1; }
  .finding-field { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; }
  .finding-change { font-size: 13px; margin: 3px 0; }
  .finding-change .old { color: var(--text-muted); text-decoration: line-through; }
  .finding-change .arrow { color: var(--text-muted); margin: 0 6px; }
  .finding-change .new { color: var(--green); font-weight: 600; }
  .finding-source { font-size: 10px; color: var(--blue); text-decoration: none; word-break: break-all; }
  .finding-source:hover { text-decoration: underline; }

  .empty-state { text-align: center; padding: 48px 24px; color: var(--text-muted); }
</style>
</head>
<body>
<div class="admin-shell">
  ${adminHeaderHTML('freshness', encodedKey)}
  <div class="admin-body">

    <div class="approval-summary">
      <div>
        <h1>Run #${run.id}</h1>
        <div style="margin-top:6px">${headerStatus}</div>
      </div>
      <span class="summary-stat ok">${Object.keys(byBroker).length} brokers changed</span>
      <span class="summary-stat">${totalFindings} findings</span>
      ${reviewCount > 0   ? `<span class="summary-stat review">${reviewCount} need review</span>` : ''}
      ${criticalCount > 0 ? `<span class="summary-stat critical">${criticalCount} critical</span>` : ''}
      <div class="approval-actions">
        <a class="btn-secondary" href="/api/admin/refresh/dashboard?key=${encodedKey}" style="text-decoration:none">← Back</a>
        ${run.status === 'awaiting_approval' ? `
          <button class="btn-danger" onclick="rejectRun()">Reject Run</button>
          <button class="btn-primary" onclick="approveRun()">Approve Selected & Publish</button>
        ` : ''}
        ${run.status === 'published' ? `
          <button class="btn-danger" onclick="rollbackRun()">Rollback</button>
        ` : ''}
      </div>
    </div>

    ${run.status === 'awaiting_approval' ? `
      <div class="toolbar">
        <button class="btn-ghost" onclick="selectAll(true)">Select all</button>
        <button class="btn-ghost" onclick="selectAll(false)">Deselect all</button>
        <button class="btn-ghost" onclick="selectSafe()">Select only safe (Δ &lt; 0.3)</button>
        <span style="color:var(--text-muted);font-size:11px;margin-left:auto">
          Unchecked findings = skipped this run.
        </span>
      </div>
    ` : ''}

    <div class="broker-grid">
      ${Object.keys(byBroker).length === 0
        ? `<div class="empty-state">No findings — nothing to approve.</div>`
        : brokerCards}
    </div>

  </div>
  ${adminFooterHTML()}
</div>

<script>
  ${adminHeaderScript()}

  const KEY    = ${JSON.stringify(extractKey(request))};
  const RUN_ID = ${runId};

  function selectAll(checked) {
    document.querySelectorAll('.finding-row input[type="checkbox"]:not([disabled])').forEach(cb => cb.checked = checked);
  }
  function selectSafe() {
    document.querySelectorAll('.broker-card').forEach(card => {
      const safe = !card.classList.contains('needs-review') && !card.classList.contains('is-critical');
      card.querySelectorAll('input[type="checkbox"]:not([disabled])').forEach(cb => cb.checked = safe);
    });
  }

  async function approveRun() {
    const ids = Array.from(document.querySelectorAll('.finding-row input[type="checkbox"]:checked'))
      .map(cb => parseInt(cb.dataset.fid, 10))
      .filter(n => Number.isInteger(n));
    if (!confirm('Approve ' + ids.length + ' findings and publish to MD + git?')) return;
    const res = await fetch('/api/admin/refresh/' + RUN_ID + '/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
      body: JSON.stringify({ approved_finding_ids: ids }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('Approved ' + (data.approved_count || 0) + ' findings. Run published.');
      window.location.reload();
    } else {
      alert('Failed: ' + (data.error || 'unknown'));
    }
  }

  async function rejectRun() {
    if (!confirm('Reject this run? All findings will be discarded (audit trail kept).')) return;
    const res = await fetch('/api/admin/refresh/' + RUN_ID + '/reject', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + KEY },
    });
    if (res.ok) window.location.href = '/api/admin/refresh/dashboard?key=' + encodeURIComponent(KEY);
    else alert('Failed.');
  }

  async function rollbackRun() {
    if (!confirm('Rollback this published run? MD will be reverted in S6.')) return;
    const res = await fetch('/api/admin/refresh/' + RUN_ID + '/rollback', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + KEY },
    });
    const data = await res.json();
    if (res.ok) { alert('Rollback complete.'); window.location.reload(); }
    else alert('Failed: ' + (data.error || 'unknown'));
  }
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

// ─── Helpers (UI) ────────────────────────────────────────────────────────
function statusBadge(status) {
  const map = {
    pending:            { cls: 'badge-pending',     text: 'Pending' },
    running:            { cls: 'badge-running',     text: 'Running' },
    awaiting_approval:  { cls: 'badge-awaiting',    text: 'Awaiting approval' },
    approved:           { cls: 'badge-published',   text: 'Approved' },
    published:          { cls: 'badge-published',   text: 'Published' },
    rejected:           { cls: 'badge-rejected',    text: 'Rejected' },
    failed:             { cls: 'badge-failed',      text: 'Failed' },
    rolled_back:        { cls: 'badge-rolledback',  text: 'Rolled back' },
  };
  const m = map[status] || { cls: 'badge-pending', text: status };
  return `<span class="badge ${m.cls}">${m.text}</span>`;
}
