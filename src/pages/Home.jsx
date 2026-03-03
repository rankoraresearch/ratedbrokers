import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { getAllBrokersWithData } from "../data/brokers";
import RegBadge from "../components/RegBadge";
import BrokerLogo from "../components/BrokerLogo";
import Icon from "../components/Icon";
import { ArrowRight, Award } from "lucide-react";
import CountryFlag from "../components/CountryFlag";


const COUNTRIES = [
  { code: "GB", name: "United Kingdom", reg: "FCA", count: 38, path: "/best-forex-brokers-uk", featured: true },
  { code: "AU", name: "Australia", reg: "ASIC", count: 24, path: "/best-forex-brokers-australia" },
  { code: "AE", name: "UAE", reg: "DFSA / VARA", count: 18, path: "/best-forex-brokers-uae" },
  { code: "DE", name: "Germany", reg: "BaFin", count: 22, path: "/best-forex-brokers-germany" },
  { code: "SG", name: "Singapore", reg: "MAS", count: 15, path: "/best-forex-brokers-singapore" },
  { code: "US", name: "United States", reg: "NFA / CFTC", count: 12, path: "/best-forex-brokers-usa" },
];

const COMPARISONS = [
  { a: "IC Markets", b: "Pepperstone", path: "/compare/ic-markets-vs-pepperstone" },
  { a: "IG", b: "CMC Markets", path: "/compare/cmc-markets-vs-ig" },
  { a: "eToro", b: "XTB", path: "/compare/etoro-vs-xtb" },
  { a: "Saxo Bank", b: "OANDA", path: "/compare/oanda-vs-saxo-bank" },
];

const QUICK_RANKINGS = [
  { icon: "trophy", title: "Best Forex Brokers", path: "/best-forex-brokers" },
  { icon: "circle", title: "Beginners", path: "/best-forex-brokers-for-beginners" },
  { icon: "crosshair", title: "Scalping", path: "/best-forex-brokers-for-scalping" },
  { icon: "trending-down", title: "Lowest Spreads", path: "/lowest-spread-forex-brokers" },
  { icon: "bar-chart-3", title: "MT4 Brokers", path: "/best-metatrader-4-brokers" },
  { icon: "bar-chart-3", title: "MT5 Brokers", path: "/best-metatrader-5-brokers" },
  { icon: "bar-chart-3", title: "cTrader", path: "/best-ctrader-brokers" },
  { icon: "zap", title: "ECN Brokers", path: "/best-ecn-forex-brokers" },
  { icon: "handshake", title: "Copy Trading", path: "/best-copy-trading-platforms" },
  { icon: "smartphone", title: "Trading Apps", path: "/best-forex-trading-apps" },
  { icon: "dollar-sign", title: "Zero Spread", path: "/zero-spread-forex-brokers" },
  { icon: "bitcoin", title: "Crypto Brokers", path: "/best-crypto-brokers" },
];

export default function Home() {
  const { mob, tab } = useMedia();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  const allBrokersData = getAllBrokersWithData()
    .sort((a, b) => b.B.score - a.B.score);
  const topPicks = allBrokersData.slice(0, 3);

  useEffect(() => {
    document.title = "RatedBrokers \u2014 Forex Broker Reviews & Rankings (2026)";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `RatedBrokers is an independent broker comparison platform. We test ${allBrokersData.length} forex brokers with real money deposits. Expert reviews, rankings by category, and side-by-side comparisons.`);

    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "RatedBrokers",
        url: "https://ratedbrokers.com",
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "RatedBrokers",
        url: "https://ratedbrokers.com",
        logo: "https://ratedbrokers.com/logo.png",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "RatedBrokers", item: "https://ratedbrokers.com/" },
        ],
      },
    ];

    let scriptEl = document.querySelector('script[data-jsonld="home"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-jsonld", "home");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemas);

    return () => {
      const el = document.querySelector('script[data-jsonld="home"]');
      if (el) el.remove();
    };
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* ===== 1. HERO ===== */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
        padding: mob ? "36px 16px 28px" : "48px 24px 36px",
        textAlign: "center",
      }}>
        <div style={{ ...cn }}>
          <div style={{
            display: "inline-block", padding: "6px 16px", borderRadius: 100,
            background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
            fontSize: 12, fontWeight: 600, color: "#34d399", marginBottom: 20, letterSpacing: 0.5,
          }}>
            {t("home.updated")}
          </div>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 28 : tab ? 38 : 48,
            lineHeight: 1.1, color: "#fff", marginBottom: 12,
          }}>
            {t("home.heroTitle1")}
          </h1>
          <p style={{
            fontSize: mob ? 16 : 18, color: "rgba(255,255,255,0.8)", fontWeight: 600,
            marginBottom: 8,
          }}>
            {t("home.heroSubtitle")}
          </p>
          <p style={{
            fontSize: mob ? 14 : 16, color: "rgba(255,255,255,0.6)", maxWidth: 580,
            margin: "0 auto 24px", lineHeight: 1.6,
          }}>
            {t("home.heroDesc")}
          </p>

          <div style={{
            display: "flex", gap: mob ? 12 : 24, justifyContent: "center",
            flexWrap: "wrap",
          }}>
            {[
              [String(allBrokersData.length), t("home.stat.brokers")],
              ["500+", t("home.stat.trades")],
              ["96h", t("home.stat.research")],
              ["Q1 2026", t("home.stat.update")],
            ].map(([val, label], i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#fff" }}>{val}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 2. FEATURED BROKERS (3 cards) ===== */}
      <section style={{ ...cn, padding: mob ? "32px 16px" : "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, marginBottom: 8 }}>
            {t("home.mostPopularBrokers")}
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", maxWidth: 500, margin: "0 auto" }}>
            {t("home.mostPopularBrokersDesc")}
          </p>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)",
          gap: 16,
        }}>
          {topPicks.map((broker, idx) => {
            const b = broker.B;
            const rank = idx + 1;
            const isFirst = rank === 1;
            return (
              <div
                key={broker.slug}
                style={{
                  position: "relative",
                  background: "#fff",
                  border: isFirst ? "2px solid #059669" : "1px solid #e2e8f0",
                  borderRadius: 16,
                  padding: mob ? "20px" : "24px",
                  boxShadow: isFirst ? "0 4px 20px rgba(5,150,105,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {isFirst && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "4px 12px", borderRadius: 100,
                    background: "#059669", color: "#fff",
                    fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                  }}>
                    <Award size={13} /> #1 {t("home.editorChoice")}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, marginTop: isFirst ? 8 : 0 }}>
                  <Link to={lp(`/review/${broker.slug}`)} style={{ flexShrink: 0 }}>
                    <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={48} />
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={lp(`/review/${broker.slug}`)} style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, color: "#1e293b", textDecoration: "none" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#059669"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#1e293b"; }}
                    >{b.name}</Link>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 18, color: b.score >= 9.5 ? "#059669" : "#2563eb" }}>{b.score}</div>
                  </div>
                  {!isFirst && (
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "#1e3a5f", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 11,
                    }}>#{rank}</div>
                  )}
                </div>

                <div style={{
                  display: "flex", gap: 16, marginBottom: 14,
                  fontSize: 13, color: "#64748b",
                }}>
                  <div><span style={{ fontWeight: 700, color: "#1e293b" }}>{b.spread}</span> pips</div>
                  <div>Min <span style={{ fontWeight: 700, color: "#1e293b" }}>${b.minDep}</span></div>
                </div>

                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
                  {b.regs.slice(0, 3).map((r, ri) => (
                    <RegBadge key={ri} reg={r.name} />
                  ))}
                </div>

                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  style={{
                    display: "block", padding: "12px 0", borderRadius: 10,
                    background: "linear-gradient(135deg,#059669,#34d399)",
                    color: "#fff", fontWeight: 700, fontSize: 14,
                    textAlign: "center", textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  {t("home.openAccount")}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== 3. QUICK RANKINGS NAV (pills) ===== */}
      <section style={{ ...cn, padding: mob ? "32px 16px" : "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, marginBottom: 8 }}>
            {t("home.quickRankingsTitle")}
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", maxWidth: 500, margin: "0 auto" }}>
            {t("home.quickRankingsDesc")}
          </p>
        </div>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center",
          maxWidth: 800, margin: "0 auto",
        }}>
          {QUICK_RANKINGS.map((r, i) => (
            <Link key={i} to={lp(r.path)} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: 100,
              background: "#fff", border: "1px solid #e2e8f0",
              textDecoration: "none", color: "#1e293b",
              fontSize: 13, fontWeight: 600,
              transition: "all 0.2s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#059669";
                e.currentTarget.style.background = "#ecfdf5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "#fff";
              }}
            >
              <Icon name={r.icon} size={15} color="#059669" />
              {r.title}
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to={lp("/rankings")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 24px", borderRadius: 10,
            background: "transparent", color: "#059669", fontWeight: 700, fontSize: 14,
            textDecoration: "none", border: "2px solid #059669",
            transition: "all 0.2s",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#059669";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#059669";
            }}
          >
            {t("home.viewAllRankings")}
          </Link>
        </div>
      </section>

      {/* ===== 4. ABOUT RATEDBROKERS ===== */}
      <section style={{ ...cn, padding: mob ? "32px 16px" : "48px 24px" }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: mob ? "28px 20px" : "40px 48px",
          border: "1px solid #e2e8f0",
        }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 16, textAlign: "center" }}>
            {t("home.aboutTitle")}
          </h2>
          <p style={{
            fontSize: 15, color: "#475569", lineHeight: 1.7, maxWidth: 720,
            margin: "0 auto 24px", textAlign: "center",
          }}>
            {t("home.aboutText")}
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: 12, marginBottom: 24,
          }}>
            {[
              ["piggy-bank", t("home.aboutDiff1")],
              ["shield", t("home.aboutDiff2")],
              ["bar-chart-3", t("home.aboutDiff3")],
              ["refresh-cw", t("home.aboutDiff4")],
            ].map(([iconName, label], i) => (
              <div key={i} style={{
                padding: "14px 12px", borderRadius: 12,
                background: "#f8fafc", border: "1px solid #f1f5f9",
                textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              }}>
                <Icon name={iconName} size={22} color="#059669" />
                <span style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={lp("/methodology")} style={{
              padding: "10px 22px", borderRadius: 10,
              background: "#1e3a5f", color: "#fff",
              fontWeight: 700, fontSize: 14, textDecoration: "none",
            }}>{t("home.aboutMethodology")}</Link>
            <Link to={lp("/about")} style={{
              padding: "10px 22px", borderRadius: 10,
              background: "#f1f5f9", color: "#475569",
              fontWeight: 600, fontSize: 14, textDecoration: "none",
            }}>{t("home.aboutLearnMore")}</Link>
          </div>
        </div>
      </section>

      {/* ===== 5. BROWSE BY COUNTRY ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, textAlign: "center", marginBottom: 8 }}>
          {t("home.countryTitle")}
        </h2>
        <p style={{ textAlign: "center", fontSize: 15, color: "#64748b", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
          {t("home.countryDesc")}
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: 16,
        }}>
          {COUNTRIES.map((c, i) => (
            <Link key={i} to={lp(c.path)} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: mob ? "16px" : "20px 24px", borderRadius: 14,
              background: "#fff", border: c.featured ? "2px solid #059669" : "1px solid #e2e8f0",
              textDecoration: "none", color: "#1e293b",
              boxShadow: c.featured ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
              transition: "all 0.2s", position: "relative",
            }}>
              {c.featured && (
                <span style={{
                  position: "absolute", top: -10, right: 16,
                  padding: "3px 10px", borderRadius: 6,
                  background: "#059669", color: "#fff",
                  fontSize: 10, fontWeight: 700,
                }}>{t("home.mostPopular")}</span>
              )}
              <CountryFlag code={c.code} size={mob ? 32 : 38} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 15 : 17 }}>{c.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span style={{
                    padding: "2px 8px", borderRadius: 4,
                    background: "#ecfdf5", color: "#059669",
                    fontSize: 11, fontWeight: 700,
                  }}>{c.reg}</span>
                  <span style={{ fontSize: 13, color: "#64748b" }}>{c.count} {t("home.brokers")}</span>
                </div>
              </div>
              <ArrowRight size={18} color="#94a3b8" />
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 6. ALL BROKER REVIEWS (logo grid) ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, textAlign: "center", marginBottom: 8 }}>
          {t("home.allTitle")}
        </h2>
        <p style={{ textAlign: "center", fontSize: 15, color: "#64748b", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
          {t("home.allDesc", { count: allBrokersData.length })}
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: 12,
        }}>
          {allBrokersData.map((broker) => (
            <Link key={broker.slug} to={lp(`/review/${broker.slug}`)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 16px", borderRadius: 10,
              background: "#fff", border: "1px solid #e2e8f0",
              textDecoration: "none", color: "#1e293b",
              transition: "all 0.2s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#a7f3d0";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <BrokerLogo slug={broker.slug} name={broker.B.name} fallback={broker.B.logo} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600, fontSize: 14, color: "#1e293b",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{broker.B.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700, color: broker.B.score >= 9.0 ? "#059669" : broker.B.score >= 8.0 ? "#2563eb" : "#d97706" }}>{broker.B.score}</div>
              </div>
              <ArrowRight size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 7. COMPARISONS ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, textAlign: "center", marginBottom: 32 }}>
          {t("home.compTitle")}
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 16,
        }}>
          {COMPARISONS.map((c, i) => (
            <Link key={i} to={lp(c.path)} style={{
              padding: mob ? "20px" : "24px", borderRadius: 14,
              background: "#fff", border: "1px solid #e2e8f0",
              textAlign: "center", textDecoration: "none", color: "#1e293b",
              transition: "all 0.2s",
            }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{c.a}</div>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", margin: "0 auto 8px",
                background: "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 11, color: "#fff",
              }}>VS</div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{c.b}</div>
              <span style={{
                padding: "6px 14px", borderRadius: 6,
                background: "#f1f5f9", color: "#2563eb",
                fontSize: 12, fontWeight: 700,
              }}>{t("home.compare")}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 8. MEET THE FOUNDER ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: mob ? "28px 20px" : "40px 48px",
          border: "1px solid #e2e8f0",
          display: "flex", flexDirection: mob ? "column" : "row",
          alignItems: mob ? "center" : "flex-start", gap: mob ? 20 : 32,
        }}>
          {/* Founder avatar */}
          <div style={{
            width: mob ? 80 : 100, height: mob ? 80 : 100, borderRadius: "50%",
            background: "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, overflow: "hidden",
          }}>
            <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 28 : 34, color: "#fff" }}>YB</span>
          </div>
          <div style={{ textAlign: mob ? "center" : "left" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 4 }}>
              {t("home.founderTitle")}
            </h2>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1e293b", marginBottom: 2 }}>
              {t("home.founderName")}
            </div>
            <div style={{ fontSize: 13, color: "#059669", fontWeight: 600, marginBottom: 12 }}>
              {t("home.founderRole")}
            </div>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16, maxWidth: 560 }}>
              {t("home.founderBio")}
            </p>
            <a
              href="https://linkedin.com/in/yegor-barakovskiy"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 18px", borderRadius: 8,
                background: "#eff6ff", color: "#2563eb",
                fontWeight: 600, fontSize: 13, textDecoration: "none",
                border: "1px solid #bfdbfe",
              }}
            >
              <Icon name="linkedin" size={16} color="#2563eb" />
              {t("home.founderLinkedin")}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
