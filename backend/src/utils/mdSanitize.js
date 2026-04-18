/**
 * Server-side Markdown sanitization.
 *
 * This is the ONLY sanitization boundary for submitted body_md in the current
 * build — no MD-renderer sanitizer exists on the frontend yet. When Sprint 7
 * ports content into destination tables for public rendering, a frontend
 * allowlist renderer will be introduced; until then, this module is the only
 * defense against stored XSS. The regex strategy gives:
 *   1. Storage safety — nothing dangerous reaches D1.
 *   2. Low complexity — one regex pass per submission, no extra runtime deps.
 *
 * Allowlist (SPEC §8):
 *   <p>, <strong>, <em>, <ul>, <ol>, <li>, <a href="https://...">, <h2>, <h3>,
 *   <h4>, <code>, <pre>, <blockquote>, <table>, <thead>, <tbody>, <tr>, <th>, <td>
 *
 * Only `https://` URLs are accepted on <a> href per spec. `mailto:`, `javascript:`,
 * `data:`, protocol-relative, and control characters are all stripped.
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

/**
 * Remove a single attribute from a tag opening if it is not allowlisted
 * or if its value is unsafe. Only <a> gets attributes; everything else
 * is normalized to no attributes.
 */
function sanitizeAttributes(tagName, rawAttrs) {
  if (tagName !== 'a') return '';
  if (!rawAttrs) return '';
  // Per SPEC §8: only https:// URLs are accepted on <a href>. No mailto:,
  // no javascript:, no data:, no protocol-relative //.
  const hrefMatch = rawAttrs.match(/\bhref\s*=\s*(['"])([^'"]+)\1/i);
  if (!hrefMatch) return '';
  const href = hrefMatch[2].trim();
  if (!/^https:\/\//i.test(href)) return '';
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

  // Neutralize dangerous Markdown link protocols at storage time.
  // [text](javascript:...) / [text](data:...) / [text](vbscript:...) are
  // replaced with a harmless placeholder URL. https://, http://, mailto:,
  // and relative paths pass through. This is a defense-in-depth layer on
  // top of the frontend allowlist renderer — because some legacy render
  // paths may still regex-replace links into raw <a href="...">.
  out = out.replace(/\[([^\]\n]+)\]\(\s*([^)\s]+)\s*\)/g, (match, text, url) => {
    const lower = url.toLowerCase();
    if (/^(https?:\/\/|mailto:|\/|#)/.test(lower)) return `[${text}](${url})`;
    // Anything else (javascript:, data:, vbscript:, tel:, file:, etc.) —
    // strip the link entirely, keep the text.
    return text;
  });

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
