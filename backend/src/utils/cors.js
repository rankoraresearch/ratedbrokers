const DEFAULT_ORIGINS = [
  'https://ratedbrokers.com',
  'https://www.ratedbrokers.com',
];

function getAllowedOrigins(env) {
  if (env?.ALLOWED_ORIGINS) {
    return env.ALLOWED_ORIGINS.split(',').map(s => s.trim());
  }
  return DEFAULT_ORIGINS;
}

function isAllowedOrigin(origin, env) {
  const allowed = getAllowedOrigins(env);
  if (allowed.includes(origin)) return true;
  // Allow localhost only if explicitly in ALLOWED_ORIGINS or in dev
  if (env?.ALLOWED_ORIGINS && /^http:\/\/localhost:\d+$/.test(origin)) {
    return allowed.some(o => o.includes('localhost'));
  }
  // Fallback: allow localhost in dev (when ALLOWED_ORIGINS not set)
  if (!env?.ALLOWED_ORIGINS && /^http:\/\/localhost:\d+$/.test(origin)) return true;
  return false;
}

export function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const isAllowed = isAllowedOrigin(origin, env);

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : DEFAULT_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
  };
}

export function handleOptions(request, env) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, env),
  });
}
