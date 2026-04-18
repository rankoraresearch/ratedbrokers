/**
 * Author/expert token authentication & authorization.
 *
 * Used by /api/author/* endpoints (author portal) and any future role-gated
 * surface built on top of expert_tokens. Admin API key auth stays in auth.js.
 *
 * Token transport: `?token=…` query param OR `Authorization: Bearer …` header.
 * localStorage flow: frontend reads ?token= from invite URL on first visit,
 * saves to localStorage, then sends as Authorization Bearer for subsequent requests.
 *
 * See AUTHOR-SUBMISSIONS-SPEC.md §3.1 (expert_tokens extension), §5 (scope model),
 * §6 (endpoint contracts), §8 (security).
 */

/**
 * Extract the raw token string from the request (or null).
 */
export function extractToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match) return match[1];
  }
  const url = new URL(request.url);
  return url.searchParams.get('token') || null;
}

/**
 * Parse scopes_json into a shape with safe defaults.
 * Missing keys default to empty (= denied), except langs which defaults to ['en'].
 */
function parseScopes(raw) {
  if (!raw) return { reviews: [], rankings: [], cards: [], langs: ['en'] };
  try {
    const s = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return {
      reviews: Array.isArray(s.reviews) ? s.reviews : [],
      rankings: Array.isArray(s.rankings) ? s.rankings : [],
      cards: Array.isArray(s.cards) ? s.cards : [],
      langs: Array.isArray(s.langs) && s.langs.length ? s.langs : ['en'],
    };
  } catch {
    return { reviews: [], rankings: [], cards: [], langs: ['en'] };
  }
}

/**
 * SHA-256 hex digest of an input string. Uses Web Crypto (Workers runtime).
 */
export async function hashToken(raw) {
  const data = new TextEncoder().encode(raw);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Look up the caller by token in expert_tokens. Returns a full author object
 * or null if: no token, token not found, inactive, or expired.
 *
 * Two lookup paths:
 *   1. Modern (post-migration-002): compute SHA-256 of incoming raw token,
 *      look up by `token_hash`. Used for all author invites + rotations.
 *   2. Legacy: fall back to raw `token` column for pre-migration-002 rows
 *      (notably legacy expert rows created via reviews.js handleTokenCreate
 *      before hashing existed, still used by /api/expert/*).
 *
 * Legacy `expert` role rows derive scopes from broker_slugs for back-compat.
 */
export async function getAuthor(request, env) {
  const token = extractToken(request);
  if (!token) return null;

  const tokenHash = await hashToken(token);
  let row = await env.DB.prepare(
    `SELECT id, token, name, email, lang, broker_slugs, active, expires_at, role, scopes_json
     FROM expert_tokens WHERE token_hash = ? AND active = 1`
  ).bind(tokenHash).first();

  if (!row) {
    // Legacy path: raw token comparison (pre-migration-002 rows).
    row = await env.DB.prepare(
      `SELECT id, token, name, email, lang, broker_slugs, active, expires_at, role, scopes_json
       FROM expert_tokens WHERE token = ? AND token_hash IS NULL AND active = 1`
    ).bind(token).first();
  }
  if (!row) return null;
  if (row.expires_at && new Date(row.expires_at) < new Date()) return null;

  let scopes;
  if (row.role === 'author' || row.role === 'admin') {
    scopes = parseScopes(row.scopes_json);
  } else {
    // legacy 'expert' role — derive scopes from broker_slugs
    const legacyReviews = row.broker_slugs
      ? row.broker_slugs.split(',').map(s => s.trim()).filter(Boolean)
      : ['*'];
    scopes = { reviews: legacyReviews, rankings: [], cards: [], langs: [row.lang || 'en'] };
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role || 'expert',
    defaultLang: row.lang || 'en',
    scopes,
  };
}

/**
 * Guard for author-facing endpoints. Returns { author, response? } — if
 * response is present, the caller should return it directly (401 short-circuit).
 */
export async function requireAuthor(request, env, corsHeaders) {
  const author = await getAuthor(request, env);
  if (!author) {
    return {
      author: null,
      response: Response.json(
        { error: 'Unauthorized — invalid or expired token' },
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      ),
    };
  }
  return { author };
}

/**
 * Check whether a list of scope entries grants access to a given value.
 * Used for reviews/rankings (single-dimension scopes).
 */
export function scopeAllows(list, value) {
  if (!Array.isArray(list) || list.length === 0) return false;
  if (list.includes('*')) return true;
  return list.includes(value);
}

/**
 * Two-dimensional scope check for card targets: "<ranking_id>:<broker_slug>".
 * Supports exact match, per-ranking wildcard "<ranking_id>:*", and global "*".
 */
export function cardScopeAllows(list, rankingId, brokerSlug) {
  if (!Array.isArray(list) || list.length === 0) return false;
  if (list.includes('*')) return true;
  const exact = `${rankingId}:${brokerSlug}`;
  if (list.includes(exact)) return true;
  const perRanking = `${rankingId}:*`;
  if (list.includes(perRanking)) return true;
  return false;
}

/**
 * Authorize a submission create/edit request against the author's scopes.
 * Returns { ok: true } or { ok: false, reason, status }.
 *
 * Enforces SPEC §5:
 *  - target_type=review   → scopes.reviews  allows target_slug
 *  - target_type=ranking  → scopes.rankings allows target_slug
 *  - target_type=card     → target_ranking_broker REQUIRED; scopes.cards allows pair
 *  - lang in scopes.langs
 */
export function authorizeTarget(author, { target_type, target_slug, target_ranking_broker, lang }) {
  const effectiveLang = lang || 'en';
  if (!scopeAllows(author.scopes.langs, effectiveLang)) {
    return { ok: false, reason: `language '${effectiveLang}' not in scope`, status: 403 };
  }

  if (target_type === 'review') {
    if (!scopeAllows(author.scopes.reviews, target_slug)) {
      return { ok: false, reason: `broker '${target_slug}' not in review scope`, status: 403 };
    }
    return { ok: true };
  }

  if (target_type === 'ranking') {
    if (!scopeAllows(author.scopes.rankings, target_slug)) {
      return { ok: false, reason: `ranking '${target_slug}' not in ranking scope`, status: 403 };
    }
    return { ok: true };
  }

  if (target_type === 'card') {
    if (!target_ranking_broker) {
      return { ok: false, reason: 'target_ranking_broker required for card type', status: 400 };
    }
    if (!cardScopeAllows(author.scopes.cards, target_slug, target_ranking_broker)) {
      return {
        ok: false,
        reason: `card '${target_slug}:${target_ranking_broker}' not in card scope`,
        status: 403,
      };
    }
    return { ok: true };
  }

  return { ok: false, reason: `invalid target_type '${target_type}'`, status: 400 };
}

/**
 * Generate a 32-byte cryptographically-random token, hex-encoded.
 * Same pattern as reviews.js handleTokenCreate — 64 hex chars.
 */
export function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}
