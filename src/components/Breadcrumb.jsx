import { Link } from "react-router-dom";
import { useLocalePath } from "../i18n/useLocalePath";
import { ChevronRight } from "lucide-react";

/**
 * Unified Breadcrumb component with JSON-LD BreadcrumbList schema.
 *
 * @param {Array} items - [{ label, path }] where path is omitted for the last (current) item.
 * @param {Object} [containerStyle] - optional override for the outer wrapper style.
 */
export default function Breadcrumb({ items, containerStyle }) {
  const lp = useLocalePath();

  return (
    <nav aria-label="Breadcrumb" style={containerStyle || {}}>
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 13,
          color: "#64748b",
          flexWrap: "wrap",
          listStyle: "none",
          margin: 0,
          padding: 0,
          letterSpacing: "0.01em",
        }}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {i > 0 && (
                <span style={{ color: "#94a3b8", display: "inline-flex", userSelect: "none" }}><ChevronRight size={11} /></span>
              )}
              {isLast ? (
                <span style={{ color: "#0f172a", fontWeight: 600 }}>{item.label}</span>
              ) : item.path ? (
                <Link
                  to={lp(item.path)}
                  style={{ color: "#64748b", textDecoration: "none", fontWeight: 500, transition: "color 0.15s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#059669"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; }}
                >
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: "#64748b", fontWeight: 500 }}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Generate JSON-LD BreadcrumbList schema object.
 * @param {Array} items - [{ label, path }]
 * @param {string} [baseUrl] - defaults to "https://ratedbrokers.com"
 */
export function breadcrumbSchema(items, baseUrl = "https://ratedbrokers.com") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.path ? { item: `${baseUrl}${item.path}` } : {}),
    })),
  };
}
