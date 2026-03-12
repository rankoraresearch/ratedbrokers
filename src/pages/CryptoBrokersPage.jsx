import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import { useTranslation } from "../i18n/LanguageContext";
import { getBrokersForRanking } from "../data/rankingFilters";
import { getAuthorForRanking, getFactChecker, getReviewerForAuthor } from "../data/authors";
import CONTENT from "../data/cryptoPillarContent";
import BrokerRankCard from "../components/BrokerRankCard";
import Accordion from "../components/Accordion";
import AffiliateDisclosureBanner from "../components/AffiliateDisclosureBanner";
import AuthorCredits from "../components/AuthorCredits";
import AuthorBioCard from "../components/AuthorBioCard";
import Breadcrumb from "../components/Breadcrumb";

export default function CryptoBrokersPage() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);

  const brokers = getBrokersForRanking("crypto-overall");
  const top3 = brokers.slice(0, 3);
  const top5 = brokers.slice(0, 5);
  const top12 = brokers.slice(0, 12);
  const author = getAuthorForRanking("crypto");
  const reviewer = getReviewerForAuthor(author.id);
  const factChecker = getFactChecker(author.id);

  useEffect(() => {
    document.title = CONTENT.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", CONTENT.meta.description);

    // JSON-LD: Article + FAQPage + ItemList + BreadcrumbList
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: CONTENT.hero.h1,
        description: CONTENT.meta.description,
        datePublished: "2026-01-15",
        dateModified: "2026-02-28",
        author: {
          "@type": "Person",
          name: author.name,
          jobTitle: author.role,
          url: author.linkedin,
          sameAs: [author.linkedin],
          ...(author.credentials?.length ? {
            hasCredential: author.credentials.map(c => ({
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "Professional Certification",
              name: c,
            })),
          } : {}),
          ...(author.specialty ? { knowsAbout: author.specialty.split(", ") } : {}),
          ...(author.image ? { image: `https://ratedbrokers.com${author.image}` } : {}),
        },
        publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: CONTENT.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Best Crypto Brokers 2026",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: top12.length,
        itemListElement: top12.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.B.name,
          url: `https://ratedbrokers.com/review/${b.slug}`,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "RatedBrokers", item: "https://ratedbrokers.com/" },
          { "@type": "ListItem", position: 2, name: "Best Crypto Brokers 2026", item: "https://ratedbrokers.com/best-crypto-brokers" },
        ],
      },
    ];

    let scriptEl = document.querySelector('script[data-jsonld="crypto-pillar"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-jsonld", "crypto-pillar");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemas);
    window.scrollTo(0, 0);

    return () => {
      const el = document.querySelector('script[data-jsonld="crypto-pillar"]');
      if (el) el.remove();
    };
  }, []);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const cardBg = { background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0" };
  const secTitle = { fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, color: "#0f172a", marginBottom: 16 };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* ══════ 1. HERO ══════ */}
      <section style={{
        background: "linear-gradient(135deg,#0f172a 0%,#1a1a2e 50%,#0f172a 100%)",
        padding: mob ? "40px 16px 48px" : "56px 24px 64px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          {/* Badge */}
          <div style={{
            display: "inline-block", padding: "5px 14px", borderRadius: 20,
            background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)",
            color: "#fbbf24", fontSize: 13, fontWeight: 700, letterSpacing: 0.5, marginBottom: 20,
          }}>{CONTENT.hero.badge}</div>

          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 28 : tab ? 40 : 50,
            lineHeight: 1.05, color: "#fff", marginBottom: 12,
          }}>{CONTENT.hero.h1}</h1>

          <p style={{ fontSize: mob ? 15 : 18, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
            {CONTENT.hero.subtitle}
          </p>

          {/* Author byline */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <AuthorCredits author={author} reviewer={reviewer} factChecker={factChecker} updatedDate="March 2026" variant="onDark" />
          </div>

          {/* Trust stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
            gap: 12, maxWidth: 640, margin: "0 auto",
          }}>
            {CONTENT.hero.stats.map((s) => (
              <div key={s.label} style={{
                padding: "12px 16px", borderRadius: 12,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
                  fontSize: mob ? 18 : 22, color: "#fbbf24",
                }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div style={{ ...cn, padding: mob ? "16px 16px 0" : "20px 24px 0" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: "Best Crypto Brokers 2026" },
        ]} />
      </div>

      {/* ══════ 2. TOP 3 QUICK PICKS ══════ */}
      <section style={{ ...cn, paddingTop: mob ? 24 : 32, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.topPicks")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 16 }}>
          {top3.map((b, i) => (
            <div key={b.slug} style={{
              ...cardBg, padding: mob ? "20px" : "24px", position: "relative",
              border: i === 0 ? "2px solid #f59e0b" : "1px solid #e2e8f0",
              boxShadow: i === 0 ? "0 4px 20px rgba(245,158,11,0.12)" : undefined,
            }}>
              {i === 0 && (
                <div style={{
                  position: "absolute", top: -1, left: 24, right: 24,
                  height: 3, background: "linear-gradient(90deg,#f59e0b,#fbbf24)", borderRadius: "0 0 4px 4px",
                }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: i === 0 ? "#f59e0b" : "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 15, color: "#fff",
                }}>#{i + 1}</div>
                <div>
                  <Link to={lp(`/review/${b.slug}`)} style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, color: "inherit", textDecoration: "none" }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                  >{b.B.name}</Link>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{b.B.type}</div>
                </div>
                <div style={{
                  marginLeft: "auto",
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 20,
                  color: b.B.score >= 9.5 ? "#059669" : "#2563eb",
                }}>{b.B.score}</div>
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16,
                fontSize: 13, color: "#475569",
              }}>
                <div>Spread: <strong>{b.B.spread} pips</strong></div>
                <div>Min Dep: <strong>{b.B.minDep === 0 ? "$0" : `$${b.B.minDep}`}</strong></div>
                <div>Leverage: <strong>{b.B.leverage}</strong></div>
                <div>Platforms: <strong>{b.B.platforms.length}</strong></div>
              </div>
              <a href={b.B.url} target="_blank" rel="noopener noreferrer nofollow" style={{
                display: "block", padding: "12px", borderRadius: 10, textAlign: "center",
                background: "linear-gradient(135deg,#059669,#34d399)",
                color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none",
              }}>Visit Broker →</a>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ 3. SEO INTRO ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        {CONTENT.introCards.map((card) => (
          <div key={card.title} style={{ ...cardBg, padding: mob ? "24px 20px" : "32px 28px" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 14 }}>
              {card.title}
            </h2>
            {card.paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "#475569", marginBottom: i < card.paragraphs.length - 1 ? 14 : 0 }}>
                {p}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* ══════ 4. CFD vs SPOT EXPLAINER ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.cfdVsSpot")}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#475569", marginBottom: 20 }}>
          {CONTENT.cfdVsSpot.intro}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 16 }}>
          {[CONTENT.cfdVsSpot.cfd, CONTENT.cfdVsSpot.spot].map((side, idx) => (
            <div key={side.label} style={{
              ...cardBg, padding: mob ? "20px" : "24px",
              border: idx === 0 ? "1px solid #bfdbfe" : "1px solid #a7f3d0",
            }}>
              <div style={{
                display: "inline-block", padding: "4px 12px", borderRadius: 6,
                background: idx === 0 ? "#eff6ff" : "#ecfdf5",
                color: idx === 0 ? "#2563eb" : "#059669",
                fontFamily: "Outfit", fontWeight: 700, fontSize: 15, marginBottom: 14,
              }}>{side.label}</div>
              <ul style={{ padding: "0 0 0 16px", margin: "0 0 14px" }}>
                {side.points.map((p, i) => (
                  <li key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "#475569", marginBottom: 6 }}>{p}</li>
                ))}
              </ul>
              <div style={{
                padding: "10px 14px", borderRadius: 8,
                background: idx === 0 ? "#eff6ff" : "#ecfdf5",
                fontSize: 13, color: idx === 0 ? "#1e40af" : "#065f46", fontWeight: 600,
              }}>Best for: {side.bestFor}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ 5. FULL BROKER RANKINGS ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 32 : 48 }}>
        <h2 style={secTitle}>Best Crypto Brokers 2026 — Full Rankings</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {top12.map((b, i) => (
            <BrokerRankCard key={b.slug} broker={b} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* ══════ 6. COMPARISON TABLE ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.compareTop", { count: 5 })}</h2>
        <div style={{ ...cardBg, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 650 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["#", "Broker", "Score", "Spread", "Min Deposit", "Leverage", "Platforms", "Regulation"].map((h) => (
                  <th key={h} style={{
                    padding: "12px 14px", textAlign: "left", fontWeight: 700, fontSize: 12,
                    color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5,
                    borderBottom: "1px solid #e2e8f0",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {top5.map((b, i) => {
                const isBestScore = top5.every((o) => b.B.score >= o.B.score);
                const isBestSpread = top5.every((o) => parseFloat(b.B.spread) <= parseFloat(o.B.spread));
                const isBestDep = top5.every((o) => b.B.minDep <= o.B.minDep);
                return (
                  <tr key={b.slug} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 14px", fontFamily: "'JetBrains Mono'", fontWeight: 800, color: i === 0 ? "#f59e0b" : "#475569" }}>
                      #{i + 1}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <Link to={lp(`/review/${b.slug}`)} style={{ fontWeight: 700, color: "#1e293b", textDecoration: "none" }}>
                        {b.B.name}
                      </Link>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono'", fontWeight: 800,
                        color: isBestScore ? "#059669" : "#1e293b",
                        background: isBestScore ? "#ecfdf5" : "transparent",
                        padding: isBestScore ? "2px 6px" : 0, borderRadius: 4,
                      }}>{b.B.score}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono'", fontWeight: 700,
                        color: isBestSpread ? "#059669" : "#1e293b",
                        background: isBestSpread ? "#ecfdf5" : "transparent",
                        padding: isBestSpread ? "2px 6px" : 0, borderRadius: 4,
                      }}>{b.B.spread} pips</span>
                    </td>
                    <td style={{ padding: "12px 14px", fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>
                      <span style={{
                        color: isBestDep ? "#059669" : "#1e293b",
                        background: isBestDep ? "#ecfdf5" : "transparent",
                        padding: isBestDep ? "2px 6px" : 0, borderRadius: 4,
                      }}>{b.B.minDep === 0 ? "$0" : `$${b.B.minDep}`}</span>
                    </td>
                    <td style={{ padding: "12px 14px", fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>{b.B.leverage}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {b.B.platforms.slice(0, 2).map((p) => (
                          <span key={p} style={{
                            padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                            background: "#f1f5f9", color: "#475569",
                          }}>{p}</span>
                        ))}
                        {b.B.platforms.length > 2 && (
                          <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "#f1f5f9", color: "#94a3b8" }}>
                            +{b.B.platforms.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {b.B.regs.slice(0, 2).map((r) => (
                          <span key={r.name} style={{
                            padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                            background: r.tier === 1 ? "#ecfdf5" : "#f1f5f9",
                            color: r.tier === 1 ? "#059669" : "#64748b",
                          }}>{r.name}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══════ 7. COIN-SPECIFIC SECTIONS ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.coinGuide")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr", gap: 16 }}>
          {CONTENT.coinSections.map((coin) => (
            <div key={coin.coin} style={{ ...cardBg, padding: mob ? "20px" : "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{coin.icon}</span>
                <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, margin: 0 }}>{coin.coin}</h3>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#64748b", marginBottom: 14 }}>{coin.desc}</p>
              <Link to={lp(coin.path)} style={{
                display: "inline-block", padding: "8px 16px", borderRadius: 8,
                background: "#f0fdf4", color: "#059669", fontWeight: 700, fontSize: 14,
                textDecoration: "none", border: "1px solid #a7f3d0",
              }}>View Best {coin.coin.split(" ")[0]} Brokers →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ 8. CATEGORY NAVIGATION ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.browseCategories")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 16 }}>
          {[
            { title: "By Coin", items: CONTENT.categoryNav.byCoin },
            { title: "By Feature", items: CONTENT.categoryNav.byFeature },
          ].map((col) => (
            <div key={col.title} style={cardBg}>
              <div style={{
                padding: "14px 20px", borderBottom: "1px solid #f1f5f9",
                fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#0f172a",
              }}>{col.title}</div>
              <div style={{ padding: "8px 12px" }}>
                {col.items.map((item) => (
                  <Link key={item.path} to={lp(item.path)} style={{
                    display: "block", padding: "8px 10px", borderRadius: 6,
                    fontSize: 14, fontWeight: 500, color: "#475569", textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#059669"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                  >{item.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ 9. SECURITY SECTION ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.security")}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#475569", marginBottom: 20 }}>
          {CONTENT.securitySection.intro}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 16 }}>
          {CONTENT.securitySection.features.map((feat) => (
            <div key={feat.name} style={{ ...cardBg, padding: mob ? "20px" : "24px" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{feat.icon}</div>
              <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{feat.name}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#64748b", margin: 0 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ 10. FAQ ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.faq")}</h2>
        <Accordion items={CONTENT.faq} expanded={openFaq} setExpanded={setOpenFaq} />
      </section>

      {/* ══════ 11. AUTHOR + CTA + DISCLOSURE ══════ */}
      {/* Author bio */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <AuthorBioCard author={author} />
      </section>

      {/* Methodology CTA */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{
          padding: mob ? "24px 20px" : "32px 36px", borderRadius: 16,
          background: "linear-gradient(135deg,#0f172a,#1a1a2e)",
          textAlign: "center",
        }}>
          <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#fff", marginBottom: 8 }}>
            How We Test Crypto Brokers
          </h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 20, maxWidth: 500, margin: "0 auto 20px" }}>
            Our team opens live accounts, deposits real money, and executes hundreds of crypto trades to give you rankings you can trust.
          </p>
          <Link to={lp("/methodology")} style={{
            display: "inline-block", padding: "12px 28px", borderRadius: 10,
            background: "linear-gradient(135deg,#059669,#34d399)",
            color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}>Read Our Methodology</Link>
        </div>
      </section>

      {/* Disclosure */}
      <section style={{ ...cn, paddingBottom: mob ? 40 : 60 }}>
        <AffiliateDisclosureBanner crypto />
      </section>
    </div>
  );
}
