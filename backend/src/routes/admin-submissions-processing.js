/**
 * Side-effect endpoints for content_submissions (Sprint 7).
 *
 * These endpoints atomically (via D1 batch) transition submission status
 * AND mutate destination tables. PATCH /:id/status (Sprint 6) is for
 * review-decision only and is explicitly BANNED from reaching these states.
 *
 * State transitions handled here:
 *   accepted     → processed   via /import-to-{review,ranking,card}
 *   processed    → published   via /publish
 *   processed|published → reverted via /revert
 *
 * All destination writes go to DRAFT slots only; publish flips draft→live.
 *
 * See AUTHOR-SUBMISSIONS-SPEC.md §4 (state machine), §6.2 (endpoint contracts),
 * §7.4 (processing pipeline), §3.2a (submission_imports idempotency).
 */
import { corsHeaders } from '../utils/cors.js';
import { checkAuth } from '../utils/auth.js';

function jsonHeaders(request, env) { return { ...corsHeaders(request, env), 'Content-Type': 'application/json' }; }
function err(headers, status, error) { return Response.json({ error }, { status, headers }); }
function nowSql() { return new Date().toISOString().slice(0, 19).replace('T', ' '); }

// Same section set as reviews.js / author-submissions.js. Kept in sync intentionally.
const REVIEW_SECTIONS = new Set([
  'overview', 'scoring', 'accountIntro', 'accountOutro', 'regulation', 'costs',
  'spreads', 'deposits', 'platforms', 'mobile', 'support', 'education',
  'trustpilot', 'country', 'verdict',
]);

// ═══════════════════════════════════════════════════════════════════════════
// Section splitter — detects `## Section: <key>` headers in body_md and splits
// the body into per-section chunks. Used by import-to-review.
// ═══════════════════════════════════════════════════════════════════════════
// Case-insensitive lookup: map lowercase label → canonical section key.
// Accepts both camelCase keys ("accountIntro") and their lowercase prefixes
// ("account intro" normalized to "accountintro" → matched).
const SECTION_LOOKUP = (() => {
  const m = new Map();
  for (const key of REVIEW_SECTIONS) {
    m.set(key.toLowerCase(), key);
  }
  return m;
})();

export function splitReviewBody(bodyMd, fallbackSection) {
  const sections = [];
  const lines = String(bodyMd || '').replace(/\r\n/g, '\n').split('\n');
  let currentKey = null;
  let currentBuf = [];
  let preludeBuf = [];

  // Tolerant: allow any alnum label (letters, spaces, digits); normalize case.
  const headerRe = /^##\s+Section:\s*([a-zA-Z0-9 ]+?)\s*$/;

  for (const line of lines) {
    const m = line.match(headerRe);
    if (m) {
      const rawKey = m[1];
      const normalized = rawKey.replace(/\s+/g, '').toLowerCase();
      const canonical = SECTION_LOOKUP.get(normalized);
      // Flush previous section if any.
      if (currentKey) {
        sections.push({ section: currentKey, content: currentBuf.join('\n').trim() });
      } else if (preludeBuf.length && preludeBuf.some(l => l.trim())) {
        sections.push({ section: fallbackSection || 'overview', content: preludeBuf.join('\n').trim() });
      }
      // Unknown section key → skip content until the next known header
      // (avoids accidentally misrouting into the fallback).
      currentKey = canonical || null;
      currentBuf = [];
      preludeBuf = [];
    } else {
      if (currentKey) currentBuf.push(line);
      else if (currentKey === null && sections.length === 0) preludeBuf.push(line);
      // If we're inside an unknown section (currentKey===null after a header)
      // — just drop the lines.
    }
  }
  if (currentKey) {
    sections.push({ section: currentKey, content: currentBuf.join('\n').trim() });
  } else if (preludeBuf.length && sections.length === 0) {
    const content = preludeBuf.join('\n').trim();
    if (content) sections.push({ section: fallbackSection || 'overview', content });
  }
  return sections.filter(s => s.content);
}

// ═══════════════════════════════════════════════════════════════════════════
// Ranking body parser — looks for `## Intro`, `## Key Finding`,
// `## How We Ranked`, `## Outro`, `## FAQ` markers. FAQ body parsed as
// alternating `Q: ...` / `A: ...` lines into [{q, a}, ...].
// ═══════════════════════════════════════════════════════════════════════════
export function splitRankingBody(bodyMd) {
  const lines = String(bodyMd || '').replace(/\r\n/g, '\n').split('\n');
  const out = { intro_md: null, key_finding: null, how_we_ranked: null, outro_md: null, faq_json: null };
  let current = null;
  let buf = [];

  // Map of header text (normalized) → output key.
  const HEADER_MAP = {
    'intro': 'intro_md',
    'key finding': 'key_finding',
    'how we ranked': 'how_we_ranked',
    'outro': 'outro_md',
    'faq': '__faq__', // handled specially
  };

  function flush() {
    if (!current) return;
    const text = buf.join('\n').trim();
    if (!text) return;
    if (current === '__faq__') {
      // Parse Q:/A: pairs. Answers may span multiple lines until the next
      // Q: marker (or end of FAQ section).
      const faq = [];
      let q = null;
      let aLines = [];
      const flushPair = () => {
        if (q) {
          faq.push({ q, a: aLines.join('\n').trim() });
          q = null;
          aLines = [];
        }
      };
      for (const ln of buf) {
        const qm = ln.match(/^Q:\s*(.+)$/i);
        const am = ln.match(/^A:\s*(.*)$/i); // allow empty A: on first line
        if (qm) {
          flushPair();
          q = qm[1].trim();
          aLines = [];
        } else if (am) {
          if (q) aLines.push(am[1]);
          // else: stray A: before any Q: — ignore
        } else if (q && aLines.length > 0) {
          // Continuation line of the current answer.
          aLines.push(ln);
        }
        // other lines outside Q/A context are skipped
      }
      flushPair();
      if (faq.length) out.faq_json = JSON.stringify(faq);
    } else {
      out[current] = text;
    }
  }

  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      const key = m[1].trim().toLowerCase();
      const mapped = HEADER_MAP[key];
      if (mapped) {
        flush();
        current = mapped;
        buf = [];
        continue;
      }
    }
    if (current) buf.push(line);
  }
  flush();

  return out;
}

// ═══════════════════════════════════════════════════════════════════════════
// Shared helpers
// ═══════════════════════════════════════════════════════════════════════════
async function loadAcceptedSubmission(env, id, requireType) {
  const row = await env.DB.prepare(
    `SELECT * FROM content_submissions WHERE id = ?`
  ).bind(id).first();
  if (!row) return { error: 'Submission not found', status: 404 };
  if (row.status !== 'accepted') {
    return { error: `cannot import in status '${row.status}' (must be 'accepted')`, status: 409 };
  }
  if (row.target_type !== requireType) {
    return { error: `submission target_type='${row.target_type}' — use the matching import endpoint`, status: 400 };
  }
  return { submission: row };
}

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/admin/submissions/:id/import-to-review
// ═══════════════════════════════════════════════════════════════════════════
export async function handleImportToReview(request, env, id) {
  const headers = jsonHeaders(request, env);
  if (!checkAuth(request, env)) return err(headers, 401, 'Unauthorized');
  const submissionId = parseInt(id, 10);
  if (!Number.isFinite(submissionId)) return err(headers, 400, 'Invalid id');

  const loaded = await loadAcceptedSubmission(env, submissionId, 'review');
  if (loaded.error) return err(headers, loaded.status, loaded.error);
  const sub = loaded.submission;

  // Split body into sections — use target_section as fallback for no-H2 bodies.
  const sections = splitReviewBody(sub.body_md, sub.target_section);
  if (!sections.length) return err(headers, 400, 'No content to import (empty body?)');

  const now = nowSql();
  const editor = `author:${sub.author_id}`;
  const statements = [];

  // CAS update on submission.
  statements.push(env.DB.prepare(
    `UPDATE content_submissions SET status = 'processed', processed_at = ?, updated_at = ?
     WHERE id = ? AND status = 'accepted'`
  ).bind(now, now, submissionId));

  // For each section: upsert review_overrides with status='draft'; log review_edit_log;
  // record destination in submission_imports (idempotent via UNIQUE index).
  for (const { section, content } of sections) {
    statements.push(env.DB.prepare(
      `INSERT INTO review_overrides (broker_slug, section, lang, content, edited_by, status, updated_at)
       VALUES (?, ?, ?, ?, ?, 'draft', ?)
       ON CONFLICT(broker_slug, section, lang) DO UPDATE SET
         content = excluded.content, edited_by = excluded.edited_by,
         status = 'draft', updated_at = excluded.updated_at`
    ).bind(sub.target_slug, section, sub.lang, content, editor, now));

    statements.push(env.DB.prepare(
      `INSERT INTO review_edit_log (broker_slug, section, action, edited_by, new_content)
       VALUES (?, ?, 'import-from-submission', ?, ?)`
    ).bind(sub.target_slug, section, editor, content));

    const ref = `${sub.target_slug}:${section}:${sub.lang}`;
    statements.push(env.DB.prepare(
      `INSERT OR IGNORE INTO submission_imports (submission_id, destination_type, destination_ref, imported_by)
       VALUES (?, 'review_override', ?, 'admin')`
    ).bind(submissionId, ref));
  }

  statements.push(env.DB.prepare(
    `INSERT INTO submission_events (submission_id, actor_type, actor_id, event, notes)
     VALUES (?, 'admin', NULL, 'processed', ?)`
  ).bind(submissionId, `Imported to review_overrides: ${sections.map(s => s.section).join(', ')}`));

  const results = await env.DB.batch(statements);
  const casResult = results[0];
  if ((casResult.meta?.changes ?? 0) === 0) {
    return err(headers, 409, 'Submission status changed concurrently');
  }

  return Response.json({
    ok: true, id: submissionId, status: 'processed',
    imported: sections.map(s => ({ section: s.section, ref: `${sub.target_slug}:${s.section}:${sub.lang}` })),
  }, { headers });
}

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/admin/submissions/:id/import-to-ranking
// ═══════════════════════════════════════════════════════════════════════════
export async function handleImportToRanking(request, env, id) {
  const headers = jsonHeaders(request, env);
  if (!checkAuth(request, env)) return err(headers, 401, 'Unauthorized');
  const submissionId = parseInt(id, 10);
  if (!Number.isFinite(submissionId)) return err(headers, 400, 'Invalid id');

  const loaded = await loadAcceptedSubmission(env, submissionId, 'ranking');
  if (loaded.error) return err(headers, loaded.status, loaded.error);
  const sub = loaded.submission;

  const parts = splitRankingBody(sub.body_md);
  if (!parts.intro_md && !parts.key_finding && !parts.how_we_ranked && !parts.outro_md && !parts.faq_json) {
    return err(headers, 400, 'Ranking body has no recognized sections (## Intro / ## Key Finding / ## How We Ranked / ## Outro / ## FAQ)');
  }

  const now = nowSql();
  const editor = `author:${sub.author_id}`;
  const statements = [];

  statements.push(env.DB.prepare(
    `UPDATE content_submissions SET status = 'processed', processed_at = ?, updated_at = ?
     WHERE id = ? AND status = 'accepted'`
  ).bind(now, now, submissionId));

  // Upsert into ranking_content draft slots. Columns not parsed stay unchanged.
  statements.push(env.DB.prepare(
    `INSERT INTO ranking_content (ranking_id, lang, intro_md_draft, key_finding_draft,
                                  how_we_ranked_draft, outro_md_draft, faq_json_draft,
                                  updated_by, draft_updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(ranking_id, lang) DO UPDATE SET
       intro_md_draft       = COALESCE(excluded.intro_md_draft, ranking_content.intro_md_draft),
       key_finding_draft    = COALESCE(excluded.key_finding_draft, ranking_content.key_finding_draft),
       how_we_ranked_draft  = COALESCE(excluded.how_we_ranked_draft, ranking_content.how_we_ranked_draft),
       outro_md_draft       = COALESCE(excluded.outro_md_draft, ranking_content.outro_md_draft),
       faq_json_draft       = COALESCE(excluded.faq_json_draft, ranking_content.faq_json_draft),
       updated_by           = excluded.updated_by,
       draft_updated_at     = excluded.draft_updated_at`
  ).bind(
    sub.target_slug, sub.lang,
    parts.intro_md, parts.key_finding, parts.how_we_ranked, parts.outro_md, parts.faq_json,
    editor, now,
  ));

  // Record ONE submission_imports row PER field actually imported. This lets
  // publish/revert operate per-field so two submissions editing different
  // fields on the same ranking_content row don't step on each other.
  const imported = Object.keys(parts).filter(k => parts[k] != null);
  for (const field of imported) {
    const ref = `${sub.target_slug}:${sub.lang}:${field}`;
    statements.push(env.DB.prepare(
      `INSERT OR IGNORE INTO submission_imports (submission_id, destination_type, destination_ref, imported_by)
       VALUES (?, 'ranking_content', ?, 'admin')`
    ).bind(submissionId, ref));
  }

  statements.push(env.DB.prepare(
    `INSERT INTO submission_events (submission_id, actor_type, actor_id, event, notes)
     VALUES (?, 'admin', NULL, 'processed', ?)`
  ).bind(submissionId, `Imported to ranking_content: ${imported.join(', ')}`));

  const results = await env.DB.batch(statements);
  if ((results[0].meta?.changes ?? 0) === 0) {
    return err(headers, 409, 'Submission status changed concurrently');
  }

  return Response.json({
    ok: true, id: submissionId, status: 'processed',
    imported,
    refs: imported.map(f => `${sub.target_slug}:${sub.lang}:${f}`),
  }, { headers });
}

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/admin/submissions/:id/import-to-card
// ═══════════════════════════════════════════════════════════════════════════
export async function handleImportToCard(request, env, id) {
  const headers = jsonHeaders(request, env);
  if (!checkAuth(request, env)) return err(headers, 401, 'Unauthorized');
  const submissionId = parseInt(id, 10);
  if (!Number.isFinite(submissionId)) return err(headers, 400, 'Invalid id');

  const loaded = await loadAcceptedSubmission(env, submissionId, 'card');
  if (loaded.error) return err(headers, loaded.status, loaded.error);
  const sub = loaded.submission;
  if (!sub.target_ranking_broker) {
    return err(headers, 400, 'submission is missing target_ranking_broker');
  }
  if (!sub.body_md || !sub.body_md.trim()) {
    return err(headers, 400, 'empty body');
  }

  const now = nowSql();
  const statements = [];

  statements.push(env.DB.prepare(
    `UPDATE content_submissions SET status = 'processed', processed_at = ?, updated_at = ?
     WHERE id = ? AND status = 'accepted'`
  ).bind(now, now, submissionId));

  // ranking_overrides has PK (ranking_id, broker_slug). If the row doesn't exist
  // yet, create it with position=999 (lowest priority) so FK isn't broken; if it
  // exists, just update description_md_draft + description_lang + updated_at.
  statements.push(env.DB.prepare(
    `INSERT INTO ranking_overrides (ranking_id, broker_slug, position, description_md_draft, description_lang, updated_at)
     VALUES (?, ?, 999, ?, ?, ?)
     ON CONFLICT(ranking_id, broker_slug) DO UPDATE SET
       description_md_draft = excluded.description_md_draft,
       description_lang     = excluded.description_lang,
       updated_at           = excluded.updated_at`
  ).bind(sub.target_slug, sub.target_ranking_broker, sub.body_md, sub.lang, now));

  const ref = `${sub.target_slug}:${sub.target_ranking_broker}:${sub.lang}`;
  statements.push(env.DB.prepare(
    `INSERT OR IGNORE INTO submission_imports (submission_id, destination_type, destination_ref, imported_by)
     VALUES (?, 'ranking_card', ?, 'admin')`
  ).bind(submissionId, ref));

  statements.push(env.DB.prepare(
    `INSERT INTO submission_events (submission_id, actor_type, actor_id, event, notes)
     VALUES (?, 'admin', NULL, 'processed', ?)`
  ).bind(submissionId, `Imported card draft: ${ref}`));

  const results = await env.DB.batch(statements);
  if ((results[0].meta?.changes ?? 0) === 0) {
    return err(headers, 409, 'Submission status changed concurrently');
  }

  return Response.json({ ok: true, id: submissionId, status: 'processed', ref }, { headers });
}

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/admin/submissions/:id/publish ─── flip draft → live
// ═══════════════════════════════════════════════════════════════════════════
export async function handlePublishSubmission(request, env, id) {
  const headers = jsonHeaders(request, env);
  if (!checkAuth(request, env)) return err(headers, 401, 'Unauthorized');
  const submissionId = parseInt(id, 10);
  if (!Number.isFinite(submissionId)) return err(headers, 400, 'Invalid id');

  const sub = await env.DB.prepare(
    `SELECT status FROM content_submissions WHERE id = ?`
  ).bind(submissionId).first();
  if (!sub) return err(headers, 404, 'Submission not found');
  if (sub.status !== 'processed') {
    return err(headers, 409, `cannot publish in status '${sub.status}' (must be 'processed')`);
  }

  const imports = await env.DB.prepare(
    `SELECT destination_type, destination_ref FROM submission_imports WHERE submission_id = ?`
  ).bind(submissionId).all();
  if (!imports.results || imports.results.length === 0) {
    return err(headers, 400, 'No imports to publish — run /import-to-{review,ranking,card} first');
  }

  const RANKING_FIELDS = new Set([
    'meta_title', 'meta_desc', 'intro_md', 'key_finding',
    'how_we_ranked', 'outro_md', 'faq_json',
  ]);

  // ─── PRE-VALIDATE DESTINATIONS ───
  // Every import row must still have a valid destination draft slot. This
  // guarantees the atomicity spec §6.2 requires: if we can't actually
  // promote every draft to live, we don't change submission state at all.
  const missing = [];
  for (const imp of imports.results) {
    if (imp.destination_type === 'review_override') {
      const [broker_slug, section, lang] = imp.destination_ref.split(':');
      const row = await env.DB.prepare(
        `SELECT 1 FROM review_overrides
         WHERE broker_slug = ? AND section = ? AND lang = ? AND status = 'draft' LIMIT 1`
      ).bind(broker_slug, section, lang).first();
      if (!row) missing.push(imp.destination_ref);
    } else if (imp.destination_type === 'ranking_content') {
      const [ranking_id, lang, field] = imp.destination_ref.split(':');
      if (!RANKING_FIELDS.has(field)) { missing.push(imp.destination_ref + ' (bad field)'); continue; }
      // Must have the specific draft field populated, not just any row.
      const row = await env.DB.prepare(
        `SELECT 1 FROM ranking_content
         WHERE ranking_id = ? AND lang = ? AND ${field}_draft IS NOT NULL LIMIT 1`
      ).bind(ranking_id, lang).first();
      if (!row) missing.push(imp.destination_ref + ' (draft field empty)');
    } else if (imp.destination_type === 'ranking_card') {
      const [ranking_id, broker_slug] = imp.destination_ref.split(':');
      const row = await env.DB.prepare(
        `SELECT 1 FROM ranking_overrides
         WHERE ranking_id = ? AND broker_slug = ? AND description_md_draft IS NOT NULL LIMIT 1`
      ).bind(ranking_id, broker_slug).first();
      if (!row) missing.push(imp.destination_ref);
    }
  }
  if (missing.length) {
    return err(headers, 409,
      `destination(s) missing or already published: ${missing.join(', ')}`);
  }

  const now = nowSql();
  const statements = [];

  statements.push(env.DB.prepare(
    `UPDATE content_submissions SET status = 'published', published_at = ?, updated_at = ?
     WHERE id = ? AND status = 'processed'`
  ).bind(now, now, submissionId));

  // Per destination: flip draft-slot → live-slot.
  // Each UPDATE is tracked so we can detect no-op matches (deleted/missing rows).
  for (const imp of imports.results) {
    if (imp.destination_type === 'review_override') {
      const [broker_slug, section, lang] = imp.destination_ref.split(':');
      statements.push(env.DB.prepare(
        `UPDATE review_overrides SET status = 'published', updated_at = ?
         WHERE broker_slug = ? AND section = ? AND lang = ? AND status = 'draft'`
      ).bind(now, broker_slug, section, lang));
    } else if (imp.destination_type === 'ranking_content') {
      // New ref shape: "<ranking_id>:<lang>:<field>". Flip only this field.
      const [ranking_id, lang, field] = imp.destination_ref.split(':');
      if (!RANKING_FIELDS.has(field)) {
        // Legacy or malformed ref — skip rather than risk bad SQL.
        continue;
      }
      statements.push(env.DB.prepare(
        `UPDATE ranking_content SET
           ${field} = COALESCE(${field}_draft, ${field}),
           published_at = ?
         WHERE ranking_id = ? AND lang = ?`
      ).bind(now, ranking_id, lang));
    } else if (imp.destination_type === 'ranking_card') {
      // Ref: "<ranking_id>:<broker_slug>:<lang>". Include lang in scoping.
      const [ranking_id, broker_slug, lang] = imp.destination_ref.split(':');
      statements.push(env.DB.prepare(
        `UPDATE ranking_overrides SET
           description_md = description_md_draft,
           description_published_at = ?,
           description_lang = ?,
           updated_at = ?
         WHERE ranking_id = ? AND broker_slug = ? AND description_md_draft IS NOT NULL`
      ).bind(now, lang, now, ranking_id, broker_slug));
    }
  }

  statements.push(env.DB.prepare(
    `INSERT INTO submission_events (submission_id, actor_type, actor_id, event, notes)
     VALUES (?, 'admin', NULL, 'published', ?)`
  ).bind(submissionId, `Published ${imports.results.length} destination(s)`));

  const results = await env.DB.batch(statements);
  if ((results[0].meta?.changes ?? 0) === 0) {
    return err(headers, 409, 'Submission status changed concurrently');
  }

  return Response.json({
    ok: true, id: submissionId, status: 'published',
    published: imports.results.length,
  }, { headers });
}

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/admin/submissions/:id/revert ─── clear live slots, keep drafts
// ═══════════════════════════════════════════════════════════════════════════
export async function handleRevertSubmission(request, env, id) {
  const headers = jsonHeaders(request, env);
  if (!checkAuth(request, env)) return err(headers, 401, 'Unauthorized');
  const submissionId = parseInt(id, 10);
  if (!Number.isFinite(submissionId)) return err(headers, 400, 'Invalid id');

  const sub = await env.DB.prepare(
    `SELECT status FROM content_submissions WHERE id = ?`
  ).bind(submissionId).first();
  if (!sub) return err(headers, 404, 'Submission not found');
  if (sub.status !== 'processed' && sub.status !== 'published') {
    return err(headers, 409, `cannot revert in status '${sub.status}' (must be 'processed' or 'published')`);
  }

  const imports = await env.DB.prepare(
    `SELECT destination_type, destination_ref FROM submission_imports WHERE submission_id = ?`
  ).bind(submissionId).all();

  const now = nowSql();
  const statements = [];

  statements.push(env.DB.prepare(
    `UPDATE content_submissions SET status = 'reverted', reverted_at = ?, updated_at = ?
     WHERE id = ? AND status IN ('processed', 'published')`
  ).bind(now, now, submissionId));

  const RANKING_FIELDS = new Set([
    'meta_title', 'meta_desc', 'intro_md', 'key_finding',
    'how_we_ranked', 'outro_md', 'faq_json',
  ]);

  // Track per-ranking row whether any live field remains; only clear
  // `published_at` when all fields we're reverting are zeroed. (Other
  // submissions' fields on the same ranking row must stay live.)
  // We approximate this here: after clearing our specific fields, check
  // whether the row still has any live content; if nothing left, clear
  // published_at. Executed as separate UPDATE after per-field clears.
  const rankingKeysTouched = new Set();

  for (const imp of (imports.results || [])) {
    if (imp.destination_type === 'review_override') {
      const [broker_slug, section, lang] = imp.destination_ref.split(':');
      statements.push(env.DB.prepare(
        `UPDATE review_overrides SET status = 'draft', updated_at = ?
         WHERE broker_slug = ? AND section = ? AND lang = ? AND status = 'published'`
      ).bind(now, broker_slug, section, lang));
    } else if (imp.destination_type === 'ranking_content') {
      const [ranking_id, lang, field] = imp.destination_ref.split(':');
      if (!RANKING_FIELDS.has(field)) continue;
      // Per SPEC §4 / §6.2: revert unconditionally clears the live field.
      // If a later submission republished the same field with different
      // content, the admin should re-run that submission's publish to
      // restore it. Drafts are always preserved, so the content is
      // recoverable. Full provenance-safety (prior_live_value snapshot)
      // is deferred to a future migration — see SPEC §10 out-of-scope.
      statements.push(env.DB.prepare(
        `UPDATE ranking_content SET ${field} = NULL
         WHERE ranking_id = ? AND lang = ?`
      ).bind(ranking_id, lang));
      rankingKeysTouched.add(`${ranking_id}:${lang}`);
    } else if (imp.destination_type === 'ranking_card') {
      const [ranking_id, broker_slug] = imp.destination_ref.split(':');
      // Unconditional live-slot clear per SPEC §4 + §10. Draft preserved.
      // ranking_overrides.(ranking_id, broker_slug) is the PK, so lang is not
      // a row-identity column — omitting it makes revert clear regardless of
      // whether a later submission republished in a different lang.
      statements.push(env.DB.prepare(
        `UPDATE ranking_overrides SET
           description_md = NULL, description_published_at = NULL, updated_at = ?
         WHERE ranking_id = ? AND broker_slug = ?`
      ).bind(now, ranking_id, broker_slug));
    }
  }

  // Only clear ranking_content.published_at when ALL live fields on that
  // row are now NULL — i.e. this submission's revert didn't leave other
  // published content behind.
  for (const ref of rankingKeysTouched) {
    const [ranking_id, lang] = ref.split(':');
    statements.push(env.DB.prepare(
      `UPDATE ranking_content SET published_at = NULL
       WHERE ranking_id = ? AND lang = ?
         AND meta_title IS NULL AND meta_desc IS NULL AND intro_md IS NULL
         AND key_finding IS NULL AND how_we_ranked IS NULL AND outro_md IS NULL
         AND faq_json IS NULL`
    ).bind(ranking_id, lang));
  }

  statements.push(env.DB.prepare(
    `INSERT INTO submission_events (submission_id, actor_type, actor_id, event, notes)
     VALUES (?, 'admin', NULL, 'reverted', ?)`
  ).bind(submissionId, `Reverted ${imports.results?.length || 0} destination(s); drafts preserved`));

  const results = await env.DB.batch(statements);
  if ((results[0].meta?.changes ?? 0) === 0) {
    return err(headers, 409, 'Submission status changed concurrently');
  }

  return Response.json({
    ok: true, id: submissionId, status: 'reverted',
    reverted: imports.results?.length || 0,
  }, { headers });
}

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/rankings/:id/content ─── PUBLIC endpoint for frontend merge
// Returns only PUBLISHED fields. Frontend falls back to rankingSeoContent.js.
// ═══════════════════════════════════════════════════════════════════════════
export async function handleRankingContentPublic(request, env, rankingId) {
  const cors = corsHeaders(request, env);
  const headers = {
    ...cors,
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
  };
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'en';

  const row = await env.DB.prepare(
    `SELECT meta_title, meta_desc, intro_md, key_finding, how_we_ranked,
            outro_md, faq_json, published_at
     FROM ranking_content
     WHERE ranking_id = ? AND lang = ? AND published_at IS NOT NULL`
  ).bind(rankingId, lang).first();

  if (!row) {
    return Response.json({ available: false }, { status: 200, headers });
  }

  let faq = null;
  if (row.faq_json) {
    try { faq = JSON.parse(row.faq_json); }
    catch { faq = null; }
  }

  return Response.json({
    available: true,
    meta_title: row.meta_title,
    meta_desc: row.meta_desc,
    intro_md: row.intro_md,
    key_finding: row.key_finding,
    how_we_ranked: row.how_we_ranked,
    outro_md: row.outro_md,
    faq,
    published_at: row.published_at,
  }, { headers });
}
