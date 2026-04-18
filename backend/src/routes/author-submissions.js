/**
 * Author-side REST API for content_submissions.
 *
 * All endpoints require a valid author token. Ownership is enforced per :id
 * via `WHERE id=? AND author_id=?`. Scope enforcement happens at create and
 * when target fields are mutated on edit.
 *
 * See AUTHOR-SUBMISSIONS-SPEC.md §6.1 + §8.
 */
import { corsHeaders } from '../utils/cors.js';
import { requireAuthor, authorizeTarget } from '../utils/authorAuth.js';
import { sanitizeMarkdownBody, countWords } from '../utils/mdSanitize.js';

// Size/rate limits per SPEC §8.
const MAX_BODY_BYTES = 100 * 1024;        // 100 KB per body_md
const MAX_TITLE_LEN = 200;
const MAX_REQUEST_BYTES = 128 * 1024;     // 128 KB total request payload
const RATE_LIMIT_CREATE_PER_DAY = 30;     // submissions created per author per 24h
const RATE_LIMIT_SUBMIT_PER_HOUR = 10;    // submit transitions per author per hour
const VALID_TARGET_TYPES = new Set(['review', 'ranking', 'card']);
// Matches review_overrides SECTIONS keys (see reviews.js).
const VALID_REVIEW_SECTIONS = new Set([
  'overview', 'scoring', 'accountIntro', 'accountOutro', 'regulation', 'costs',
  'spreads', 'deposits', 'platforms', 'mobile', 'support', 'education',
  'trustpilot', 'country', 'verdict',
]);

function jsonHeaders(request) {
  return { ...corsHeaders(request), 'Content-Type': 'application/json' };
}

function err(headers, status, error, extra = {}) {
  return Response.json({ error, ...extra }, { status, headers });
}

function nowSql() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Read and validate JSON body with a hard byte cap. Returns [data, errorResponse].
 * Rejects non-object payloads (null, arrays, primitives) with 400.
 */
async function readJsonBody(request, headers) {
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return [null, err(headers, 413, 'Request body too large')];
  }
  let text;
  try {
    text = await request.text();
  } catch {
    return [null, err(headers, 400, 'Invalid body')];
  }
  // Byte-accurate check — Content-Length may be missing and text.length counts
  // UTF-16 code units, not bytes (multibyte payloads would otherwise slip through).
  const bytes = new TextEncoder().encode(text).length;
  if (bytes > MAX_REQUEST_BYTES) {
    return [null, err(headers, 413, 'Request body too large')];
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return [null, err(headers, 400, 'Invalid JSON')];
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return [null, err(headers, 400, 'Request body must be a JSON object')];
  }
  return [parsed, null];
}

/**
 * Enforce per-author rate limits. Returns errorResponse or null.
 */
async function checkRateLimit(env, authorId, kind, headers) {
  if (kind === 'create') {
    const row = await env.DB.prepare(
      `SELECT COUNT(*) as c FROM content_submissions
       WHERE author_id = ? AND created_at >= datetime('now', '-1 day')`
    ).bind(authorId).first();
    if ((row?.c ?? 0) >= RATE_LIMIT_CREATE_PER_DAY) {
      return err(headers, 429, `Rate limit: ≤${RATE_LIMIT_CREATE_PER_DAY} submissions per day`);
    }
  } else if (kind === 'submit') {
    const row = await env.DB.prepare(
      `SELECT COUNT(*) as c FROM submission_events se
       JOIN content_submissions cs ON cs.id = se.submission_id
       WHERE cs.author_id = ? AND se.event = 'submitted'
         AND se.created_at >= datetime('now', '-1 hour')`
    ).bind(authorId).first();
    if ((row?.c ?? 0) >= RATE_LIMIT_SUBMIT_PER_HOUR) {
      return err(headers, 429, `Rate limit: ≤${RATE_LIMIT_SUBMIT_PER_HOUR} submit actions per hour`);
    }
  }
  return null;
}

function validateBodyMd(body_md) {
  if (typeof body_md !== 'string' || body_md.length === 0) {
    return 'body_md is required';
  }
  // Compare by UTF-8 byte length, not character count.
  const bytes = new TextEncoder().encode(body_md).length;
  if (bytes > MAX_BODY_BYTES) {
    return `body_md too large (${bytes} bytes > ${MAX_BODY_BYTES})`;
  }
  return null;
}

// Strict lowercase lang tag check (mirrors admin-author-mgmt.js LANG_RE, no /i).
const LANG_RE = /^[a-z]{2}(-[a-z0-9]{2,8})?$/;

function validateTargetShape(body) {
  const { target_type, target_slug, target_section, target_ranking_broker } = body;
  if (!VALID_TARGET_TYPES.has(target_type)) {
    return `target_type must be one of: ${Array.from(VALID_TARGET_TYPES).join(', ')}`;
  }
  if (typeof target_slug !== 'string' || !/^[a-z0-9-]+$/.test(target_slug)) {
    return 'target_slug must be a lowercase slug';
  }
  if (target_section != null) {
    if (target_type !== 'review') {
      return `target_section is only valid for target_type='review'`;
    }
    if (!VALID_REVIEW_SECTIONS.has(target_section)) {
      return `invalid target_section '${target_section}'`;
    }
  }
  if (target_type === 'card') {
    if (!target_ranking_broker || !/^[a-z0-9-]+$/.test(target_ranking_broker)) {
      return 'target_ranking_broker is required for card type (lowercase slug)';
    }
  } else if (target_ranking_broker != null) {
    return `target_ranking_broker only valid for target_type='card'`;
  }
  return null;
}

function validateLangTag(lang) {
  if (lang == null) return null;
  if (typeof lang !== 'string' || !LANG_RE.test(lang)) {
    return `invalid lang '${lang}' — expected 'en', 'ru', 'es-mx', etc.`;
  }
  return null;
}

async function logEvent(env, submissionId, actor, event, notes = null) {
  await env.DB.prepare(
    `INSERT INTO submission_events (submission_id, actor_type, actor_id, event, notes)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(submissionId, actor.type, actor.id ?? null, event, notes).run();
}

function submissionToPublic(row) {
  return {
    id: row.id,
    author_id: row.author_id,
    target_type: row.target_type,
    target_slug: row.target_slug,
    target_section: row.target_section,
    target_ranking_broker: row.target_ranking_broker,
    lang: row.lang,
    title: row.title,
    body_md: row.body_md,
    word_count: row.word_count,
    status: row.status,
    admin_notes: row.admin_notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    submitted_at: row.submitted_at,
    accepted_at: row.accepted_at,
    processed_at: row.processed_at,
    published_at: row.published_at,
    rejected_at: row.rejected_at,
    reverted_at: row.reverted_at,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/author/targets ─── available brokers/rankings from author's scopes
// ═══════════════════════════════════════════════════════════════════════════
export async function handleAuthorTargets(request, env) {
  const cors = corsHeaders(request);
  const headers = jsonHeaders(request);
  const { author, response } = await requireAuthor(request, env, cors);
  if (response) return response;

  // Full broker catalog — used to hydrate card pickers regardless of review scope.
  const allBrokersRows = await env.DB.prepare('SELECT slug, name FROM brokers ORDER BY name').all();
  const allBrokers = allBrokersRows.results || [];

  // Reviews: list brokers in scope (subset of allBrokers).
  let reviewBrokers;
  if (author.scopes.reviews.includes('*')) {
    reviewBrokers = allBrokers;
  } else if (author.scopes.reviews.length) {
    const allow = new Set(author.scopes.reviews);
    reviewBrokers = allBrokers.filter(b => allow.has(b.slug));
  } else {
    reviewBrokers = [];
  }

  // Rankings / cards: the ranking catalog lives in src/data/rankings.js bundled
  // with the frontend; the Worker doesn't have that catalog. We return scope
  // entries as canonical shapes, and the client hydrates display names from the
  // bundle. This is documented in SPEC §6.1.
  const rankings = author.scopes.rankings.map(id => ({ id, wildcard: id === '*' }));
  const cards = author.scopes.cards.map(entry => {
    if (entry === '*') return { wildcard: true };
    const [ranking_id, broker_slug] = entry.split(':', 2);
    return { ranking_id, broker_slug, wildcard: broker_slug === '*' };
  });

  // Derive the list of target_types the author can actually use, so the UI
  // can hide empty categories.
  const availableTargetTypes = [];
  if (reviewBrokers.length) availableTargetTypes.push('review');
  if (author.scopes.rankings.length) availableTargetTypes.push('ranking');
  if (author.scopes.cards.length) availableTargetTypes.push('card');

  return Response.json({
    role: author.role,
    scopes: author.scopes,
    sections: Array.from(VALID_REVIEW_SECTIONS),
    target_types: Array.from(VALID_TARGET_TYPES),
    available_target_types: availableTargetTypes,
    reviews: reviewBrokers,
    brokers_all: allBrokers, // for card pickers (independent of review scope)
    rankings,
    cards,
    langs: author.scopes.langs,
  }, { headers });
}

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/author/submissions ─── create draft
// ═══════════════════════════════════════════════════════════════════════════
export async function handleSubmissionCreate(request, env) {
  const cors = corsHeaders(request);
  const headers = jsonHeaders(request);
  const { author, response } = await requireAuthor(request, env, cors);
  if (response) return response;

  const rateBlock = await checkRateLimit(env, author.id, 'create', headers);
  if (rateBlock) return rateBlock;

  const [body, bodyErr] = await readJsonBody(request, headers);
  if (bodyErr) return bodyErr;

  const shapeErr = validateTargetShape(body);
  if (shapeErr) return err(headers, 400, shapeErr);

  const { target_type, target_slug, target_section, target_ranking_broker, lang, title, body_md } = body;

  const langErr = validateLangTag(lang);
  if (langErr) return err(headers, 400, langErr);

  const bodyValidationErr = validateBodyMd(body_md);
  if (bodyValidationErr) return err(headers, 400, bodyValidationErr);
  if (title != null && (typeof title !== 'string' || title.length > MAX_TITLE_LEN)) {
    return err(headers, 400, `title must be string ≤${MAX_TITLE_LEN}`);
  }

  const effectiveLang = lang || author.defaultLang || 'en';
  const authz = authorizeTarget(author, { target_type, target_slug, target_ranking_broker, lang: effectiveLang });
  if (!authz.ok) return err(headers, authz.status, authz.reason);

  const sanitizedBody = sanitizeMarkdownBody(body_md);
  const wc = countWords(sanitizedBody);
  const now = nowSql();

  const res = await env.DB.prepare(
    `INSERT INTO content_submissions
     (author_id, target_type, target_slug, target_section, target_ranking_broker,
      lang, title, body_md, word_count, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`
  ).bind(
    author.id,
    target_type,
    target_slug,
    target_section || null,
    target_type === 'card' ? target_ranking_broker : null,
    effectiveLang,
    title || null,
    sanitizedBody,
    wc,
    now,
    now,
  ).run();

  const submissionId = res.meta?.last_row_id;
  await logEvent(env, submissionId, { type: 'author', id: author.id }, 'created');

  return Response.json({
    ok: true,
    id: submissionId,
    status: 'draft',
    word_count: wc,
  }, { status: 201, headers });
}

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/author/submissions ─── list own submissions (filter by status/type)
// ═══════════════════════════════════════════════════════════════════════════
export async function handleSubmissionList(request, env) {
  const cors = corsHeaders(request);
  const headers = jsonHeaders(request);
  const { author, response } = await requireAuthor(request, env, cors);
  if (response) return response;

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get('status');
  const typeFilter = url.searchParams.get('type');

  const clauses = ['author_id = ?'];
  const binds = [author.id];
  if (statusFilter) {
    clauses.push('status = ?');
    binds.push(statusFilter);
  }
  if (typeFilter) {
    clauses.push('target_type = ?');
    binds.push(typeFilter);
  }

  const rows = await env.DB.prepare(
    `SELECT id, target_type, target_slug, target_section, target_ranking_broker,
            lang, title, word_count, status, admin_notes, created_at, updated_at,
            submitted_at, processed_at, published_at
     FROM content_submissions
     WHERE ${clauses.join(' AND ')}
     ORDER BY updated_at DESC
     LIMIT 200`
  ).bind(...binds).all();

  return Response.json(rows.results || [], { headers });
}

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/author/submissions/:id ─── detail + events timeline
// ═══════════════════════════════════════════════════════════════════════════
export async function handleSubmissionGet(request, env, id) {
  const cors = corsHeaders(request);
  const headers = jsonHeaders(request);
  const { author, response } = await requireAuthor(request, env, cors);
  if (response) return response;

  const submissionId = parseInt(id, 10);
  if (!Number.isFinite(submissionId)) return err(headers, 400, 'Invalid id');

  const row = await env.DB.prepare(
    `SELECT * FROM content_submissions WHERE id = ? AND author_id = ?`
  ).bind(submissionId, author.id).first();
  if (!row) return err(headers, 404, 'Submission not found');

  const events = await env.DB.prepare(
    `SELECT id, actor_type, actor_id, event, notes, created_at
     FROM submission_events WHERE submission_id = ? ORDER BY created_at ASC`
  ).bind(submissionId).all();

  return Response.json(
    { ...submissionToPublic(row), events: events.results || [] },
    { headers }
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PATCH /api/author/submissions/:id ─── edit draft or submit
// Body keys: any of { title, body_md, target_section, lang, action: 'submit' }
// target_type/target_slug/target_ranking_broker cannot change post-creation.
// ═══════════════════════════════════════════════════════════════════════════
export async function handleSubmissionPatch(request, env, id) {
  const cors = corsHeaders(request);
  const headers = jsonHeaders(request);
  const { author, response } = await requireAuthor(request, env, cors);
  if (response) return response;

  const submissionId = parseInt(id, 10);
  if (!Number.isFinite(submissionId)) return err(headers, 400, 'Invalid id');

  const [body, bodyErr] = await readJsonBody(request, headers);
  if (bodyErr) return bodyErr;

  const existing = await env.DB.prepare(
    `SELECT * FROM content_submissions WHERE id = ? AND author_id = ?`
  ).bind(submissionId, author.id).first();
  if (!existing) return err(headers, 404, 'Submission not found');

  // Author can only edit in states 'draft' or 'needs_changes'.
  if (existing.status !== 'draft' && existing.status !== 'needs_changes') {
    return err(headers, 409, `cannot edit in status '${existing.status}'`);
  }

  const updates = [];
  const binds = [];

  if (body.title !== undefined) {
    if (body.title != null && (typeof body.title !== 'string' || body.title.length > MAX_TITLE_LEN)) {
      return err(headers, 400, `title must be string ≤${MAX_TITLE_LEN}`);
    }
    updates.push('title = ?');
    binds.push(body.title || null);
  }

  if (body.body_md !== undefined) {
    const vErr = validateBodyMd(body.body_md);
    if (vErr) return err(headers, 400, vErr);
    const sanitized = sanitizeMarkdownBody(body.body_md);
    updates.push('body_md = ?');
    binds.push(sanitized);
    updates.push('word_count = ?');
    binds.push(countWords(sanitized));
  }

  if (body.target_section !== undefined) {
    if (existing.target_type !== 'review') {
      return err(headers, 400, 'target_section only valid for target_type=review');
    }
    if (body.target_section != null && !VALID_REVIEW_SECTIONS.has(body.target_section)) {
      return err(headers, 400, `invalid target_section '${body.target_section}'`);
    }
    updates.push('target_section = ?');
    binds.push(body.target_section || null);
  }

  if (body.lang !== undefined) {
    const langErr = validateLangTag(body.lang);
    if (langErr) return err(headers, 400, langErr);
    const newLang = body.lang || 'en';
    const authz = authorizeTarget(author, {
      target_type: existing.target_type,
      target_slug: existing.target_slug,
      target_ranking_broker: existing.target_ranking_broker,
      lang: newLang,
    });
    if (!authz.ok) return err(headers, authz.status, authz.reason);
    updates.push('lang = ?');
    binds.push(newLang);
  }

  const now = nowSql();
  let submitNow = false;
  if (body.action === 'submit') {
    // Rate-limit before we count
    const rateBlock = await checkRateLimit(env, author.id, 'submit', headers);
    if (rateBlock) return rateBlock;
    updates.push('status = ?');
    binds.push('submitted');
    updates.push('submitted_at = ?');
    binds.push(now);
    submitNow = true;
  }

  if (updates.length === 0) {
    return err(headers, 400, 'no fields to update');
  }

  updates.push('updated_at = ?');
  binds.push(now);

  // CAS guard: status must still be in allowed set at UPDATE time.
  const cas = existing.status === 'draft'
    ? "status = 'draft'"
    : "status = 'needs_changes'";
  binds.push(submissionId, author.id);

  const result = await env.DB.prepare(
    `UPDATE content_submissions SET ${updates.join(', ')}
     WHERE id = ? AND author_id = ? AND ${cas}`
  ).bind(...binds).run();

  if ((result.meta?.changes ?? 0) === 0) {
    return err(headers, 409, 'Submission state changed concurrently; reload and retry');
  }

  await logEvent(env, submissionId, { type: 'author', id: author.id },
    submitNow ? 'submitted' : 'edited');

  return Response.json({ ok: true, id: submissionId, status: submitNow ? 'submitted' : existing.status }, { headers });
}

// ═══════════════════════════════════════════════════════════════════════════
// DELETE /api/author/submissions/:id ─── delete own draft only
// ═══════════════════════════════════════════════════════════════════════════
export async function handleSubmissionDelete(request, env, id) {
  const cors = corsHeaders(request);
  const headers = jsonHeaders(request);
  const { author, response } = await requireAuthor(request, env, cors);
  if (response) return response;

  const submissionId = parseInt(id, 10);
  if (!Number.isFinite(submissionId)) return err(headers, 400, 'Invalid id');

  // CAS-safe: only author's own drafts can be deleted.
  const result = await env.DB.prepare(
    `DELETE FROM content_submissions
     WHERE id = ? AND author_id = ? AND status = 'draft'`
  ).bind(submissionId, author.id).run();

  if ((result.meta?.changes ?? 0) === 0) {
    // Figure out why so the author sees a useful error.
    const existing = await env.DB.prepare(
      `SELECT id, status FROM content_submissions WHERE id = ? AND author_id = ?`
    ).bind(submissionId, author.id).first();
    if (!existing) return err(headers, 404, 'Submission not found');
    return err(headers, 409, `cannot delete in status '${existing.status}'`);
  }

  // We can't log to submission_events here (FK would fail on the now-gone row).
  // Deletion itself is terminal; no audit needed for drafts the author created and scrapped.
  return Response.json({ ok: true, id: submissionId, deleted: true }, { headers });
}
