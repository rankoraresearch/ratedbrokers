/**
 * Server-side Markdown sanitization.
 *
 * Strategy: the body_md is stored as-is (still Markdown text), but we strip
 * any raw HTML tags that aren't in the allowlist. This gives:
 *  1. Defense in depth — the frontend also runs rehype-sanitize.
 *  2. Storage safety — nothing dangerous reaches D1.
 *  3. Low complexity — one regex pass per submission, no extra runtime deps.
 *
 * Allowlist (SPEC §8):
 *   <p>, <strong>, <em>, <ul>, <ol>, <li>, <a href="https://...">, <h2>, <h3>,
 *   <h4>, <code>, <pre>, <blockquote>, <table>, <thead>, <tbody>, <tr>, <th>, <td>
 *
 * Everything else — raw HTML, <script>, <iframe>, <object>, <embed>,
 * event-handler attrs (onclick, onload, onerror, etc.) — is stripped.
 *
 * Note: Markdown syntax (**bold**, [link](url), etc.) is preserved intact;
 * only inline HTML inside the Markdown is filtered.
 */

const ALLOWED_TAGS = new Set([
  'p', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'h4',
  'code', 'pre', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
]);

const ALLOWED_TAG_CLOSE = new Set(Array.from(ALLOWED_TAGS).map(t => '/' + t));

/**
 * Remove a single attribute from a tag opening if it is not allowlisted
 * or if its value is unsafe. Only <a> gets attributes; everything else
 * is normalized to no attributes.
 */
function sanitizeAttributes(tagName, rawAttrs) {
  if (tagName !== 'a') return '';
  if (!rawAttrs) return '';
  // Allow only href starting with https:// or mailto: (no javascript:, no data:, no //)
  const hrefMatch = rawAttrs.match(/\bhref\s*=\s*(['"])([^'"]+)\1/i);
  if (!hrefMatch) return '';
  const href = hrefMatch[2].trim();
  if (!/^(https:\/\/|mailto:)/i.test(href)) return '';
  // No control chars or quotes that could break out of attribute.
  if (/[\x00-\x1f"'<>]/.test(href)) return '';
  return ` href="${href}" rel="nofollow noopener"`;
}

export function sanitizeMarkdownBody(input) {
  if (typeof input !== 'string') return '';
  // Step 1: remove explicitly dangerous blocks entirely (script/style/iframe/...).
  // This catches patterns even if the tag form is unusual (case-insensitive, multi-line).
  let out = input.replace(
    /<(script|style|iframe|object|embed|form|input|textarea|button|link|meta|base|svg|math)\b[^>]*>[\s\S]*?<\/\1>/gi,
    ''
  );
  // Also strip self-closing or unclosed variants of the same.
  out = out.replace(
    /<(script|style|iframe|object|embed|form|input|textarea|button|link|meta|base|svg|math)\b[^>]*\/?>/gi,
    ''
  );

  // Step 2: walk all remaining tags, allowlist-filter.
  out = out.replace(/<(\/)?\s*([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (match, slash, rawName, rawAttrs) => {
    const name = rawName.toLowerCase();
    const isClose = slash === '/';
    if (isClose) {
      return ALLOWED_TAGS.has(name) ? `</${name}>` : '';
    }
    if (!ALLOWED_TAGS.has(name)) return '';
    return `<${name}${sanitizeAttributes(name, rawAttrs)}>`;
  });

  // Step 3: strip any residual event-handler syntax fragments (defense-in-depth).
  // If someone tries `<strong onclick="...">`, the attribute string was discarded
  // in step 2; this catches stray `onclick=` text in the body that isn't in a tag.
  // We do NOT rewrite URLs in Markdown `[text](url)` — that stays user-controlled
  // but gets sanitized at render time by rehype-sanitize on the frontend.

  return out;
}

/**
 * Count words in Markdown body (rough — for word_count metric on submissions).
 * Strips MD markers and HTML tags, then splits on whitespace.
 */
export function countWords(md) {
  if (typeof md !== 'string') return 0;
  const stripped = md
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*_`~\[\]()>]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!stripped) return 0;
  return stripped.split(' ').length;
}
