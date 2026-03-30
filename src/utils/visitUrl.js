const apiBase = import.meta.env.VITE_API_URL || '';

export function getVisitUrl(slug, fallbackUrl) {
  if (apiBase) return `${apiBase}/go/${slug}`;
  return fallbackUrl || `https://ratedbrokers.com/go/${slug}`;
}
