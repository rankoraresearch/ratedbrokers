import { useEffect, useRef } from "react";

const BASE_URL = "https://ratedbrokers.com";
const DEFAULT_IMAGE = "/og-default.png";

/**
 * Declarative SEO hook — manages <head> meta tags with full cleanup on unmount.
 * Prevents SPA tag leakage between routes.
 *
 * @param {Object} opts
 * @param {string} opts.title - Page title (also sets document.title)
 * @param {string} opts.description - Meta description
 * @param {string} opts.path - Canonical path (e.g. "/reviews/ic-markets")
 * @param {string} [opts.image] - OG image path (relative to BASE_URL)
 * @param {string} [opts.type] - OG type (default: "website")
 * @param {string} [opts.datePublished] - ISO date string for JSON-LD
 * @param {string} [opts.dateModified] - ISO date string for JSON-LD
 */
export function useSEO({ title, description, path, image, type = "website" }) {
  const tagsRef = useRef([]);

  useEffect(() => {
    // Clean up any previous tags from this hook instance
    tagsRef.current.forEach(el => el.remove());
    tagsRef.current = [];

    if (!path) return;

    const canonicalUrl = `${BASE_URL}${path}`;
    const imageUrl = `${BASE_URL}${image || DEFAULT_IMAGE}`;

    // Set document.title
    if (title) document.title = title;

    // Set meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) metaDesc.setAttribute("content", description);

    // Helper: create and track a tag
    const addTag = (tag, attrs) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      tagsRef.current.push(el);
      return el;
    };

    // Canonical
    addTag("link", { rel: "canonical", href: canonicalUrl, "data-seo": "1" });

    // Open Graph
    addTag("meta", { property: "og:title", content: title || "", "data-seo": "1" });
    addTag("meta", { property: "og:description", content: description || "", "data-seo": "1" });
    addTag("meta", { property: "og:url", content: canonicalUrl, "data-seo": "1" });
    addTag("meta", { property: "og:image", content: imageUrl, "data-seo": "1" });
    addTag("meta", { property: "og:type", content: type, "data-seo": "1" });
    addTag("meta", { property: "og:site_name", content: "RatedBrokers", "data-seo": "1" });

    // Twitter Card
    addTag("meta", { name: "twitter:card", content: "summary_large_image", "data-seo": "1" });
    addTag("meta", { name: "twitter:title", content: title || "", "data-seo": "1" });
    addTag("meta", { name: "twitter:description", content: description || "", "data-seo": "1" });
    addTag("meta", { name: "twitter:image", content: imageUrl, "data-seo": "1" });

    // Cleanup on unmount or dependency change
    return () => {
      tagsRef.current.forEach(el => el.remove());
      tagsRef.current = [];
    };
  }, [title, description, path, image, type]);
}
