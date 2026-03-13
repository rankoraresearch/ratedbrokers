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
          gap: 6,
          fontSize: 14,
          color: "#1f2937",
          flexWrap: "wrap",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && (
                <span style={{ color: "#cbd5e1", display: "inline-flex", userSelect: "none" }}><ChevronRight size={12} /></span>
              )}
              {isLast ? (
                <span style={{ color: "#111827", fontWeight: 600 }}>{item.label}</span>
              ) : item.path ? (
                <Link
                  to={lp(item.path)}
                  style={{ color: "#1f2937", textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#059669"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#1f2937"; }}
                >
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: "#1f2937" }}>{item.label}</span>
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
