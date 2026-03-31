const apiBase = import.meta.env.VITE_API_URL || '';

export function getVisitUrl(slug, fallbackUrl) {
  const base = apiBase ? `${apiBase}/go/${slug}` : (fallbackUrl || `https://ratedbrokers.com/go/${slug}`);
  const ref = typeof window !== 'undefined' ? window.location.pathname : '';
  return ref ? `${base}?ref=${encodeURIComponent(ref)}` : base;
}
