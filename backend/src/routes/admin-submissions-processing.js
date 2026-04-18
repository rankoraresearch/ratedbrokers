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
export function splitReviewBody(bodyMd, fallbackSection) {
  const sections = [];
  // Normalize line endings, then walk lines to find `## Section: <key>` markers.
  const lines = String(bodyMd || '').replace(/\r\n/g, '\n').split('\n');
  let currentKey = null;
  let currentBuf = [];
  let preludeBuf = [];

  const headerRe = /^##\s+Section:\s*([a-zA-Z]+)\s*$/;

  for (const line of lines) {
    const m = line.match(headerRe);
    if (m) {
      const key = m[1];
      // Flush previous section if any.
      if (currentKey) {
        sections.push({ section: currentKey, content: currentBuf.join('\n').trim() });
      } else if (preludeBuf.length && preludeBuf.some(l => l.trim())) {
        // Non-empty content before the first header — treat as fallback section's content.
        sections.push({ section: fallbackSection || 'overview', content: preludeBuf.join('\n').trim() });
      }
      currentKey = REVIEW_SECTIONS.has(key) ? key : null;
      currentBuf = [];
      preludeBuf = [];
    } else {
      if (currentKey) currentBuf.push(line);
      else preludeBuf.push(line);
    }
  }
  // Flush last buffer.
  if (currentKey) {
    sections.push({ section: currentKey, content: currentBuf.join('\n').trim() });
  } else if (preludeBuf.length) {
    const content = preludeBuf.join('\n').trim();
    if (content) sections.push({ section: fallbackSection || 'overview', content });
  }

  // Drop empty-content sections.
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
      // Parse Q:/A: pairs.
      const faq = [];
      let q = null;
      for (const ln of buf) {
        const qm = ln.match(/^Q:\s*(.+)$/i);
        const am = ln.match(/^A:\s*(.+)$/i);
        if (qm) { if (q) faq.push({ q, a: '' }); q = qm[1].trim(); }
        else if (am && q) { faq.push({ q, a: am[1].trim() }); q = null; }
        else if (q && ln.trim()) {
          // Continuation of previous A:
          if (faq.length && !faq[faq.length - 1].a) faq[faq.length - 1].a = ln.trim();
        }
      }
      if (q && !faq.find(f => f.q === q)) faq.push({ q, a: '' });
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

  const ref = `${sub.target_slug}:${sub.lang}`;
  statements.push(env.DB.prepare(
    `INSERT OR IGNORE INTO submission_imports (submission_id, destination_type, destination_ref, imported_by)
     VALUES (?, 'ranking_content', ?, 'admin')`
  ).bind(submissionId, ref));

  const imported = Object.keys(parts).filter(k => parts[k] != null);
  statements.push(env.DB.prepare(
    `INSERT INTO submission_events (submission_id, actor_type, actor_id, event, notes)
     VALUES (?, 'admin', NULL, 'processed', ?)`
  ).bind(submissionId, `Imported to ranking_content: ${imported.join(', ')}`));

  const results = await env.DB.batch(statements);
  if ((results[0].meta?.changes ?? 0) === 0) {
    return err(headers, 409, 'Submission status changed concurrently');
  }

  return Response.json({ ok: true, id: submissionId, status: 'processed', ref, imported }, { headers });
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

  const now = nowSql();
  const statements = [];

  statements.push(env.DB.prepare(
    `UPDATE content_submissions SET status = 'published', published_at = ?, updated_at = ?
     WHERE id = ? AND status = 'processed'`
  ).bind(now, now, submissionId));

  // Per destination: flip draft-slot → live-slot.
  for (const imp of imports.results) {
    if (imp.destination_type === 'review_override') {
      const [broker_slug, section, lang] = imp.destination_ref.split(':');
      statements.push(env.DB.prepare(
        `UPDATE review_overrides SET status = 'published', updated_at = ?
         WHERE broker_slug = ? AND section = ? AND lang = ?`
      ).bind(now, broker_slug, section, lang));
    } else if (imp.destination_type === 'ranking_content') {
      const [ranking_id, lang] = imp.destination_ref.split(':');
      statements.push(env.DB.prepare(
        `UPDATE ranking_content SET
           meta_title = COALESCE(meta_title_draft, meta_title),
           meta_desc = COALESCE(meta_desc_draft, meta_desc),
           intro_md = COALESCE(intro_md_draft, intro_md),
           key_finding = COALESCE(key_finding_draft, key_finding),
           how_we_ranked = COALESCE(how_we_ranked_draft, how_we_ranked),
           outro_md = COALESCE(outro_md_draft, outro_md),
           faq_json = COALESCE(faq_json_draft, faq_json),
           published_at = ?
         WHERE ranking_id = ? AND lang = ?`
      ).bind(now, ranking_id, lang));
    } else if (imp.destination_type === 'ranking_card') {
      const parts = imp.destination_ref.split(':');
      const ranking_id = parts[0], broker_slug = parts[1];
      statements.push(env.DB.prepare(
        `UPDATE ranking_overrides SET
           description_md = description_md_draft,
           description_published_at = ?,
           updated_at = ?
         WHERE ranking_id = ? AND broker_slug = ?`
      ).bind(now, now, ranking_id, broker_slug));
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

  for (const imp of (imports.results || [])) {
    if (imp.destination_type === 'review_override') {
      const [broker_slug, section, lang] = imp.destination_ref.split(':');
      statements.push(env.DB.prepare(
        `UPDATE review_overrides SET status = 'draft', updated_at = ?
         WHERE broker_slug = ? AND section = ? AND lang = ?`
      ).bind(now, broker_slug, section, lang));
    } else if (imp.destination_type === 'ranking_content') {
      const [ranking_id, lang] = imp.destination_ref.split(':');
      // Clear LIVE fields only. Drafts are preserved for forensics / re-publish.
      statements.push(env.DB.prepare(
        `UPDATE ranking_content SET
           meta_title = NULL, meta_desc = NULL, intro_md = NULL,
           key_finding = NULL, how_we_ranked = NULL, outro_md = NULL, faq_json = NULL,
           published_at = NULL
         WHERE ranking_id = ? AND lang = ?`
      ).bind(ranking_id, lang));
    } else if (imp.destination_type === 'ranking_card') {
      const parts = imp.destination_ref.split(':');
      const ranking_id = parts[0], broker_slug = parts[1];
      statements.push(env.DB.prepare(
        `UPDATE ranking_overrides SET
           description_md = NULL, description_published_at = NULL, updated_at = ?
         WHERE ranking_id = ? AND broker_slug = ?`
      ).bind(now, ranking_id, broker_slug));
    }
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

  return Response.json({
    available: true,
    meta_title: row.meta_title,
    meta_desc: row.meta_desc,
    intro_md: row.intro_md,
    key_finding: row.key_finding,
    how_we_ranked: row.how_we_ranked,
    outro_md: row.outro_md,
    faq: row.faq_json ? JSON.parse(row.faq_json) : null,
    published_at: row.published_at,
  }, { headers });
}
