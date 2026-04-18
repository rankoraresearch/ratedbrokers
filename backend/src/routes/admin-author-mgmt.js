/**
 * Admin endpoints for managing author tokens (invite / list / revoke / rotate).
 * Separate from admin-authors.js (which is the outreach map of 580 competitor authors).
 *
 * See AUTHOR-SUBMISSIONS-SPEC.md §6.2 (author management endpoints), §3.1 (expert_tokens).
 */
import { corsHeaders } from '../utils/cors.js';
import { checkAuth } from '../utils/auth.js';
import { generateToken } from '../utils/authorAuth.js';

function jsonHeaders(request) {
  return { ...corsHeaders(request), 'Content-Type': 'application/json' };
}

function validateScopes(scopes) {
  if (!scopes || typeof scopes !== 'object') return 'scopes must be an object';
  for (const key of ['reviews', 'rankings', 'cards', 'langs']) {
    if (scopes[key] !== undefined && !Array.isArray(scopes[key])) {
      return `scopes.${key} must be an array`;
    }
  }
  if (scopes.cards) {
    for (const entry of scopes.cards) {
      if (entry !== '*' && !/^[a-z0-9-]+:([a-z0-9-]+|\*)$/.test(entry)) {
        return `invalid card scope entry '${entry}' — expected '<ranking>:<broker>' or '<ranking>:*' or '*'`;
      }
    }
  }
  return null;
}

function resolveFrontendBase(env, request) {
  if (env.FRONTEND_URL) return env.FRONTEND_URL.replace(/\/+$/, '');
  try {
    return new URL(request.url).origin;
  } catch {
    return 'https://ratedbrokers.com';
  }
}

// ─── POST /api/admin/authors/invite ─── create a new author/expert token
// Body: { name, email?, role?, lang?, scopes?, broker_slugs?, expires_days? }
// Returns: { ok, id, token, invite_url, name, role }
export async function handleAuthorInvite(request, env) {
  const headers = jsonHeaders(request);
  if (!checkAuth(request, env)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers });
  }

  const { name, email, role, lang, scopes, broker_slugs, expires_days } = body || {};
  if (!name || typeof name !== 'string' || name.length > 200) {
    return Response.json({ error: 'name is required (≤200 chars)' }, { status: 400, headers });
  }

  const resolvedRole = role || 'author';
  if (!['expert', 'author', 'admin'].includes(resolvedRole)) {
    return Response.json({ error: "role must be 'expert', 'author', or 'admin'" }, { status: 400, headers });
  }

  // Validate scopes if provided (author role expects scopes_json)
  let scopesJson = null;
  if (scopes !== undefined && scopes !== null) {
    const invalid = validateScopes(scopes);
    if (invalid) return Response.json({ error: invalid }, { status: 400, headers });
    scopesJson = JSON.stringify(scopes);
    if (scopesJson.length > 8192) {
      return Response.json({ error: 'scopes JSON too large (≤8KB)' }, { status: 400, headers });
    }
  }

  const token = generateToken();
  const expiresAt = expires_days
    ? new Date(Date.now() + Number(expires_days) * 86400000)
        .toISOString().slice(0, 19).replace('T', ' ')
    : null;

  const res = await env.DB.prepare(`
    INSERT INTO expert_tokens (token, name, email, lang, broker_slugs, expires_at, role, scopes_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    token,
    name,
    email || null,
    lang || 'en',
    broker_slugs || null,
    expiresAt,
    resolvedRole,
    scopesJson,
  ).run();

  const base = resolveFrontendBase(env, request);
  const inviteUrl = `${base}/author?token=${encodeURIComponent(token)}`;

  return Response.json({
    ok: true,
    id: res.meta?.last_row_id ?? null,
    token,
    invite_url: inviteUrl,
    name,
    role: resolvedRole,
    lang: lang || 'en',
    expires_at: expiresAt,
  }, { headers });
}

// ─── GET /api/admin/authors/list ─── list all author/expert tokens
// Returns: [{ id, name, email, role, lang, active, created_at, expires_at, scopes, submission_count }]
export async function handleAuthorList(request, env) {
  const headers = jsonHeaders(request);
  if (!checkAuth(request, env)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  const rows = await env.DB.prepare(
    `SELECT t.id, t.name, t.email, t.role, t.lang, t.broker_slugs, t.scopes_json,
            t.active, t.created_at, t.expires_at,
            (SELECT COUNT(*) FROM content_submissions cs WHERE cs.author_id = t.id) AS submission_count
     FROM expert_tokens t
     ORDER BY t.created_at DESC`
  ).all();

  const results = rows.results.map(r => {
    let scopes = null;
    if (r.scopes_json) {
      try { scopes = JSON.parse(r.scopes_json); } catch { scopes = null; }
    }
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role || 'expert',
      lang: r.lang,
      broker_slugs: r.broker_slugs,
      scopes,
      active: r.active === 1,
      created_at: r.created_at,
      expires_at: r.expires_at,
      submission_count: r.submission_count ?? 0,
    };
  });

  return Response.json(results, { headers });
}

// ─── PATCH /api/admin/authors/:id ─── update scopes, role, name, email, or revoke
// Body: any of { name, email, role, lang, scopes, active, expires_days }
export async function handleAuthorPatch(request, env, id) {
  const headers = jsonHeaders(request);
  if (!checkAuth(request, env)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  const authorId = parseInt(id, 10);
  if (!Number.isFinite(authorId)) {
    return Response.json({ error: 'Invalid id' }, { status: 400, headers });
  }

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers });
  }

  const existing = await env.DB.prepare(
    'SELECT id FROM expert_tokens WHERE id = ?'
  ).bind(authorId).first();
  if (!existing) {
    return Response.json({ error: 'Author not found' }, { status: 404, headers });
  }

  const updates = [];
  const binds = [];

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.length > 200) {
      return Response.json({ error: 'name must be string ≤200 chars' }, { status: 400, headers });
    }
    updates.push('name = ?');
    binds.push(body.name);
  }
  if (body.email !== undefined) {
    updates.push('email = ?');
    binds.push(body.email || null);
  }
  if (body.role !== undefined) {
    if (!['expert', 'author', 'admin'].includes(body.role)) {
      return Response.json({ error: "role must be 'expert', 'author', or 'admin'" }, { status: 400, headers });
    }
    updates.push('role = ?');
    binds.push(body.role);
  }
  if (body.lang !== undefined) {
    updates.push('lang = ?');
    binds.push(body.lang || 'en');
  }
  if (body.scopes !== undefined) {
    if (body.scopes === null) {
      updates.push('scopes_json = ?');
      binds.push(null);
    } else {
      const invalid = validateScopes(body.scopes);
      if (invalid) return Response.json({ error: invalid }, { status: 400, headers });
      const scopesJson = JSON.stringify(body.scopes);
      if (scopesJson.length > 8192) {
        return Response.json({ error: 'scopes JSON too large (≤8KB)' }, { status: 400, headers });
      }
      updates.push('scopes_json = ?');
      binds.push(scopesJson);
    }
  }
  if (body.active !== undefined) {
    updates.push('active = ?');
    binds.push(body.active ? 1 : 0);
  }
  if (body.expires_days !== undefined) {
    const expiresAt = body.expires_days === null
      ? null
      : new Date(Date.now() + Number(body.expires_days) * 86400000)
          .toISOString().slice(0, 19).replace('T', ' ');
    updates.push('expires_at = ?');
    binds.push(expiresAt);
  }

  if (updates.length === 0) {
    return Response.json({ error: 'no fields to update' }, { status: 400, headers });
  }

  binds.push(authorId);
  await env.DB.prepare(
    `UPDATE expert_tokens SET ${updates.join(', ')} WHERE id = ?`
  ).bind(...binds).run();

  return Response.json({ ok: true, id: authorId }, { headers });
}

// ─── POST /api/admin/authors/:id/rotate ─── regenerate token, keep all else
// Returns: { ok, id, token, invite_url }
export async function handleAuthorRotate(request, env, id) {
  const headers = jsonHeaders(request);
  if (!checkAuth(request, env)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  const authorId = parseInt(id, 10);
  if (!Number.isFinite(authorId)) {
    return Response.json({ error: 'Invalid id' }, { status: 400, headers });
  }

  const existing = await env.DB.prepare(
    'SELECT id, name FROM expert_tokens WHERE id = ?'
  ).bind(authorId).first();
  if (!existing) {
    return Response.json({ error: 'Author not found' }, { status: 404, headers });
  }

  const newToken = generateToken();
  await env.DB.prepare(
    'UPDATE expert_tokens SET token = ?, active = 1 WHERE id = ?'
  ).bind(newToken, authorId).run();

  const base = resolveFrontendBase(env, request);
  const inviteUrl = `${base}/author?token=${encodeURIComponent(newToken)}`;

  return Response.json({
    ok: true,
    id: authorId,
    token: newToken,
    invite_url: inviteUrl,
    name: existing.name,
  }, { headers });
}
