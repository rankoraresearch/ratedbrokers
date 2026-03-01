import { Link } from "react-router-dom";
import GUIDE_LINKS from "../data/guideLinks";

/**
 * Render a text string with internal links injected where keyword phrases match.
 *
 * @param {string} text          - The plain paragraph text.
 * @param {string} currentSlug   - The current guide slug (to prevent self-links).
 * @param {Set}    usedUrls      - Mutable Set; tracks which URLs have already been linked
 *                                 in this article so each target is linked at most once.
 * @param {Function} lp          - useLocalePath() hook result for locale-prefixed paths.
 * @returns {React.ReactNode}    - String fragments and <Link> elements.
 */
export default function renderLinkedText(text, currentSlug, usedUrls, lp) {
  // Build applicable rules: exclude self-links and already-used URLs.
  const rules = GUIDE_LINKS
    .filter(
      (r) =>
        r.url !== `/guide/${currentSlug}` &&
        !r.excludeSlugs.includes(currentSlug) &&
        !usedUrls.has(r.url)
    )
    // Sort longest anchor first so "swing trading" matches before "trading".
    .sort((a, b) => b.anchor.length - a.anchor.length);

  if (rules.length === 0) return text;

  // Try to find the first matching rule in this text.
  for (const rule of rules) {
    // Build a regex that matches the anchor as a whole word, case-insensitive.
    const escaped = rule.anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b(${escaped})\\b`, "i");
    const match = text.match(regex);

    if (match) {
      const idx = match.index;
      const matchedText = match[0]; // preserve original casing
      usedUrls.add(rule.url);

      const before = text.slice(0, idx);
      const after = text.slice(idx + matchedText.length);

      // Recursively process the remaining text (before and after the match).
      return (
        <>
          {before.length > 0 && renderLinkedText(before, currentSlug, usedUrls, lp)}
          <Link
            to={lp(rule.url)}
            style={{ color: "#2563eb", textDecoration: "none", borderBottom: "1px solid #bfdbfe" }}
          >
            {matchedText}
          </Link>
          {after.length > 0 && renderLinkedText(after, currentSlug, usedUrls, lp)}
        </>
      );
    }
  }

  // No matches found — return plain text.
  return text;
}
