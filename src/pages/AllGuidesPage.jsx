import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import { useTranslation } from "../i18n/LanguageContext";
import { getAllGuides, getGuidesByCategory } from "../data/guides/index";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import Icon from "../components/Icon";
import { BookOpen, ArrowRight, Compass, Lightbulb, Crosshair, Brain } from "lucide-react";

/* ── Category config ── */

const CATEGORIES = [
  { id: "getting-started", icon: Compass, color: "#059669", tKey: "catGettingStarted", descKey: "catGettingStartedDesc" },
  { id: "concepts", icon: Lightbulb, color: "#2563eb", tKey: "catConcepts", descKey: "catConceptsDesc" },
  { id: "strategies", icon: Crosshair, color: "#ef4444", tKey: "catStrategies", descKey: "catStrategiesDesc" },
  { id: "advanced", icon: Brain, color: "#7c3aed", tKey: "catAdvanced", descKey: "catAdvancedDesc" },
];

const FEATURED_SLUGS = [
  "what-is-forex-trading",
  "how-to-start-forex-trading",
  "how-to-choose-a-forex-broker",
];

/* ── Component ── */

export default function AllGuidesPage() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const { t } = useTranslation();

  const allGuides = getAllGuides();
  const featured = FEATURED_SLUGS.map((s) => allGuides.find((g) => g.slug === s)).filter(Boolean);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  /* ── SEO ── */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = "Forex Trading Guides 2026 — " + allGuides.length + " Expert Guides | RatedBrokers";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Free forex trading guides for 2026. " + allGuides.length + " expert-written guides covering getting started, key concepts, strategies, and advanced topics. Learn forex trading the right way."
      );
    }

    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Forex Trading Guides 2026",
        description: allGuides.length + " expert-written forex trading guides covering getting started, key concepts, strategies, and advanced topics.",
        url: "https://ratedbrokers.com/guides",
        publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
      },
      breadcrumbSchema([
        { label: "RatedBrokers", path: "/" },
        { label: "Trading Guides", path: "/guides" },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "All Forex Trading Guides",
        numberOfItems: allGuides.length,
        itemListElement: allGuides.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: g.hero.h1,
          url: "https://ratedbrokers.com/guide/" + g.slug,
        })),
      },
    ];

    let scriptEl = document.querySelector('script[data-jsonld="all-guides"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-jsonld", "all-guides");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemas);

    return () => {
      const el = document.querySelector('script[data-jsonld="all-guides"]');
      if (el) el.remove();
    };
  }, [allGuides]);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#1e293b", minHeight: "100vh" }}>

      {/* ═══ BREADCRUMBS ═══ */}
      <div style={{ ...cn, padding: mob ? "12px 16px" : "16px 24px" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: t("guides.breadcrumb") },
        ]} />
      </div>

      {/* ═══ HERO ═══ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 40 }}>
        <div style={{
          borderRadius: mob ? 14 : 20,
          padding: mob ? "32px 20px" : "48px 48px",
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)",
          textAlign: "center",
          marginBottom: mob ? 24 : 40,
        }}>
          <span style={{ display: "block", marginBottom: 12 }}>
            <BookOpen size={mob ? 36 : 52} color="#fff" />
          </span>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 800,
            fontSize: mob ? 26 : tab ? 32 : 40,
            color: "#fff", margin: "0 0 12px", lineHeight: 1.15,
          }}>
            {t("guides.pageTitle")}
          </h1>
          <p style={{
            fontSize: mob ? 15 : 17, color: "rgba(255,255,255,0.75)",
            maxWidth: 600, margin: "0 auto 20px", lineHeight: 1.6,
          }}>
            {t("guides.pageSubtitle")}
          </p>
          <div style={{
            display: "flex", justifyContent: "center", gap: mob ? 16 : 32,
            flexWrap: "wrap",
          }}>
            {[
              [allGuides.length, t("guides.statGuides")],
              ["4", t("guides.statCategories")],
              ["\u2713", t("guides.statAccess")],
            ].map(([val, label], i) => (
              <div key={i}>
                <div style={{
                  fontFamily: "'JetBrains Mono'", fontWeight: 800,
                  fontSize: mob ? 22 : 28, color: "#34d399",
                }}>{val}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ FEATURED GUIDES ═══ */}
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 6 }}>
          {t("guides.featuredTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#475569", marginBottom: 16, lineHeight: 1.6 }}>
          {t("guides.featuredDesc")}
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr",
          gap: mob ? 12 : 16,
          marginBottom: mob ? 32 : 48,
        }}>
          {featured.map((g) => (
            <Link key={g.slug} to={lp("/guide/" + g.slug)} style={{
              background: "#fff", borderRadius: 16,
              padding: mob ? "20px 16px" : "24px 20px",
              border: "1px solid #e2e8f0", textDecoration: "none", color: "#1e293b",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              transition: "border-color 0.2s, box-shadow 0.2s",
              display: "flex", flexDirection: "column", gap: 10,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(5,150,105,0.10)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)"; }}
            >
              <span style={{
                width: 44, height: 44, borderRadius: 10,
                background: "#f0fdf4",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>
                {typeof g.hero.icon === "string" && g.hero.icon.length <= 2
                  ? g.hero.icon
                  : <Icon name={g.hero.icon || "book-open"} size={22} color="#059669" />}
              </span>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 16 : 18, lineHeight: 1.3 }}>
                {g.hero.h1}
              </div>
              <div style={{
                fontSize: 15, color: "#475569", lineHeight: 1.6,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {g.hero.subtitle}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'JetBrains Mono'", fontWeight: 600 }}>{g.readTime}</span>
                <ArrowRight size={16} color="#059669" />
              </div>
            </Link>
          ))}
        </div>

        {/* ═══ CATEGORY SECTIONS ═══ */}
        {CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          const guides = getGuidesByCategory(cat.id);
          if (guides.length === 0) return null;

          return (
            <div key={cat.id} style={{ marginBottom: mob ? 28 : 44 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: cat.color + "12",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <CatIcon size={20} color={cat.color} />
                </span>
                <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 24, margin: 0 }}>
                  {t("guides." + cat.tKey)}
                </h2>
                <span style={{
                  fontSize: 13, fontFamily: "'JetBrains Mono'", fontWeight: 700,
                  color: "#64748b", marginLeft: 4,
                }}>
                  {t("guides.guidesCount", { count: guides.length })}
                </span>
              </div>
              <p style={{ fontSize: 15, color: "#475569", marginBottom: 14, lineHeight: 1.6, marginLeft: 46 }}>
                {t("guides." + cat.descKey)}
              </p>

              <div style={{
                display: "grid",
                gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
                gap: mob ? 8 : 12,
              }}>
                {guides.map((g) => (
                  <Link key={g.slug} to={lp("/guide/" + g.slug)} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: mob ? "12px 14px" : "14px 18px",
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
                    textDecoration: "none", color: "#1e293b",
                    transition: "border-color 0.2s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = cat.color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                  >
                    <span style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: cat.color + "12",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, flexShrink: 0,
                    }}>
                      {typeof g.hero.icon === "string" && g.hero.icon.length <= 2
                        ? g.hero.icon
                        : <Icon name={g.hero.icon || "book-open"} size={18} color={cat.color} />}
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3, marginBottom: 2 }}>{g.hero.h1}</div>
                      <div style={{
                        fontSize: 14, color: "#475569", lineHeight: 1.5,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {g.hero.subtitle}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono'", fontWeight: 600, marginTop: 4 }}>
                        {g.readTime}
                      </div>
                    </div>
                    <ArrowRight size={16} color="#64748b" style={{ flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ ...cn, paddingBottom: 48 }}>
        <div style={{
          borderRadius: mob ? 14 : 20,
          padding: mob ? "24px 16px" : "36px 48px",
          background: "#fff", border: "1px solid #e2e8f0", textAlign: "center",
        }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 24, marginBottom: 8 }}>
            {t("guides.ctaTitle")}
          </h2>
          <p style={{ fontSize: mob ? 14 : 16, color: "#475569", marginBottom: 20, maxWidth: 480, margin: "0 auto 20px" }}>
            {t("guides.ctaDesc")}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link to={lp("/rankings")} style={{
              padding: "12px 24px", borderRadius: 10,
              background: "linear-gradient(135deg,#059669,#34d399)",
              color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none",
            }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                {t("guides.ctaRankings")} <ArrowRight size={16} />
              </span>
            </Link>
            <Link to={lp("/compare")} style={{
              padding: "12px 24px", borderRadius: 10,
              background: "#f1f5f9", color: "#1e293b",
              fontWeight: 700, fontSize: 16, textDecoration: "none",
            }}>
              {t("guides.ctaCompare")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
