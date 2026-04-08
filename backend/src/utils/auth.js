/**
 * Centralized auth — accepts both Authorization header and ?key= query param.
 * Header is preferred (more secure), query param kept for backwards compatibility
 * (browser navigation to HTML dashboards can't set headers).
 */

export function checkAuth(request, env) {
  // 1. Authorization: Bearer <key> (preferred)
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match && match[1] === env.API_KEY) return true;
  }

  // 2. X-API-Key header (legacy, used by stats.js)
  const xApiKey = request.headers.get('X-API-Key');
  if (xApiKey && xApiKey === env.API_KEY) return true;

  // 3. ?key= query param (fallback for browser navigation)
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  if (key && key === env.API_KEY) return true;

  return false;
}

/**
 * Extract the raw key value for passing to dashboard HTML/JS.
 * Needed for nav links (browser GET) and initial page render.
 */
export function extractKey(request) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match) return match[1];
  }

  const xApiKey = request.headers.get('X-API-Key');
  if (xApiKey) return xApiKey;

  const url = new URL(request.url);
  return url.searchParams.get('key') || '';
}
