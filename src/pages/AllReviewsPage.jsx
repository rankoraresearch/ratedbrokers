import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { getAllBrokers } from "../data/brokers";
import { ArrowRight } from "../components/Icon";

const YEAR = "2026";

const FILTER_TABS = [
  { key: "all", i18n: "reviews.filterAll" },
  { key: "top", i18n: "reviews.filterTop" },
  { key: "great", i18n: "reviews.filterGreat" },
  { key: "ecn", i18n: "reviews.filterEcn" },
  { key: "mm", i18n: "reviews.filterMm" },
];

function filterBrokers(brokers, key) {
  switch (key) {
    case "top": return brokers.filter((b) => b.score >= 9);
    case "great": return brokers.filter((b) => b.score >= 8.5);
    case "ecn": return brokers.filter((b) => /ecn|stp/i.test(b.type));
    case "mm": return brokers.filter((b) => /market maker/i.test(b.type));
    default: return brokers;
  }
}

function scoreBadgeColor(score) {
  if (score >= 9) return { bg: "#ecfdf5", color: "#059669" };
  if (score >= 8) return { bg: "#eff6ff", color: "#2563eb" };
  return { bg: "#fffbeb", color: "#d97706" };
}

export default function AllReviewsPage() {
  const { mob, tab } = useMedia();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const [activeFilter, setActiveFilter] = useState("all");

  const allBrokers = getAllBrokers().sort((a, b) => b.score - a.score);
  const filtered = filterBrokers(allBrokers, activeFilter);

  useEffect(() => {
    document.title = `All Broker Reviews ${YEAR} — ${allBrokers.length} Expert-Tested Reviews | RatedBrokers`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `Browse ${allBrokers.length} in-depth broker reviews for ${YEAR}. Forex, crypto, and CFD brokers tested with real money. Scored across 6 categories.`);
    window.scrollTo(0, 0);
  }, [allBrokers.length]);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* JSON-LD Breadcrumb */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "RatedBrokers", "item": "https://ratedbrokers.com/" },
          { "@type": "ListItem", "position": 2, "name": "Reviews", "item": "https://ratedbrokers.com/reviews" },
        ],
      })}} />

      {/* HERO */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
        padding: mob ? "40px 16px" : "60px 24px",
        textAlign: "center",
      }}>
        <div style={cn}>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 28 : tab ? 36 : 44,
            lineHeight: 1.1, color: "#fff", marginBottom: 12,
          }}>
            {t("reviews.pageTitle")}
          </h1>
          <p style={{
            fontSize: mob ? 14 : 16, color: "rgba(255,255,255,0.7)",
            maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.7,
          }}>
            {t("reviews.pageDesc", { count: allBrokers.length })}
          </p>

          {/* Filter tabs */}
          <div style={{
            display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap",
          }}>
            {FILTER_TABS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: "8px 18px", borderRadius: 100,
                  border: "1px solid",
                  borderColor: activeFilter === f.key ? "#34d399" : "rgba(255,255,255,0.15)",
                  background: activeFilter === f.key ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.05)",
                  color: activeFilter === f.key ? "#34d399" : "rgba(255,255,255,0.7)",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                }}
              >
                {t(f.i18n)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BROKER GRID */}
      <section style={{ ...cn, padding: mob ? "32px 16px 60px" : "48px 24px 80px" }}>
        <div style={{ marginBottom: 16, fontSize: 15, color: "#64748b" }}>
          {filtered.length} broker{filtered.length !== 1 ? "s" : ""}
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: 12,
        }}>
          {filtered.map((b) => {
            const badge = scoreBadgeColor(b.score);
            return (
              <Link
                key={b.slug}
                to={lp(`/review/${b.slug}`)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "16px 18px", borderRadius: 12,
                  background: "#fff", border: "1px solid #e2e8f0",
                  textDecoration: "none", color: "#1e293b",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#059669";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(5,150,105,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Logo placeholder */}
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Outfit", fontWeight: 800, fontSize: 13, color: "#fff",
                  flexShrink: 0,
                }}>
                  {b.name.slice(0, 2).toUpperCase()}
                </div>

                {/* Name + type */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 700, fontSize: 15,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                    {b.type}
                  </div>
                </div>

                {/* Score badge */}
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14,
                  color: badge.color, background: badge.bg,
                  padding: "4px 8px", borderRadius: 6, flexShrink: 0,
                }}>
                  {b.score}
                </span>

                <ArrowRight size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
