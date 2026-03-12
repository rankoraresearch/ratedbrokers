import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import { useTranslation } from "../i18n/LanguageContext";
import { getBrokersForRanking } from "../data/rankingFilters";
import { getAuthorForRanking, getFactChecker, getReviewerForAuthor } from "../data/authors";
import CONTENT from "../data/forexPillarContent";
import BrokerRankCard from "../components/BrokerRankCard";
import Accordion from "../components/Accordion";
import AffiliateDisclosureBanner from "../components/AffiliateDisclosureBanner";
import AuthorCredits from "../components/AuthorCredits";
import AuthorBioCard from "../components/AuthorBioCard";
import Breadcrumb from "../components/Breadcrumb";
import Icon, { ArrowRight } from "../components/Icon";
import CountryFlag from "../components/CountryFlag";

export default function ForexBrokersPage() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);

  const brokers = getBrokersForRanking("forex-overall");
  const top3 = brokers.slice(0, 3);
  const top5 = brokers.slice(0, 5);
  const top15 = brokers.slice(0, 15);
  const author = getAuthorForRanking("forex");
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
        name: "Best Forex Brokers 2026",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: top15.length,
        itemListElement: top15.map((b, i) => ({
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
          { "@type": "ListItem", position: 2, name: "Best Forex Brokers 2026", item: "https://ratedbrokers.com/best-forex-brokers" },
        ],
      },
    ];

    let scriptEl = document.querySelector('script[data-jsonld="forex-pillar"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-jsonld", "forex-pillar");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemas);
    window.scrollTo(0, 0);

    return () => {
      const el = document.querySelector('script[data-jsonld="forex-pillar"]');
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
        background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)",
        padding: mob ? "40px 16px 48px" : "56px 24px 64px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          {/* Badge */}
          <div style={{
            display: "inline-block", padding: "5px 14px", borderRadius: 20,
            background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
            color: "#34d399", fontSize: 13, fontWeight: 700, letterSpacing: 0.5, marginBottom: 20,
          }}>{CONTENT.hero.badge}</div>

          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 30 : tab ? 42 : 52,
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
                  fontSize: mob ? 18 : 22, color: "#34d399",
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
          { label: "Best Forex Brokers 2026" },
        ]} />
      </div>

      {/* ══════ 2. TOP 3 QUICK PICKS ══════ */}
      <section style={{ ...cn, paddingTop: mob ? 24 : 32, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.topPicks")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 16 }}>
          {top3.map((b, i) => (
            <div key={b.slug} style={{
              ...cardBg, padding: mob ? "20px" : "24px", position: "relative",
              border: i === 0 ? "2px solid #059669" : "1px solid #e2e8f0",
              boxShadow: i === 0 ? "0 4px 20px rgba(5,150,105,0.12)" : undefined,
            }}>
              {i === 0 && (
                <div style={{
                  position: "absolute", top: -1, left: 24, right: 24,
                  height: 3, background: "linear-gradient(90deg,#059669,#34d399)", borderRadius: "0 0 4px 4px",
                }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: i === 0 ? "#059669" : "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
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
              }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Visit Broker <ArrowRight size={14} /></span></a>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ 3. SEO INTRO ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 16 }}>
          {CONTENT.introCards.map((card) => (
            <div key={card.title} style={{ ...cardBg, padding: mob ? "24px 20px" : "32px 28px" }}>
              <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 20, marginBottom: 14 }}>
                {card.title}
              </h2>
              {card.paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "#475569", marginBottom: i < card.paragraphs.length - 1 ? 14 : 0 }}>
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ══════ 4. HOW WE TEST ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.howWeTest")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 16 }}>
          {CONTENT.howWeTest.map((step) => (
            <div key={step.step} style={{ ...cardBg, padding: mob ? "20px" : "24px", textAlign: "center" }}>
              <div style={{ marginBottom: 10 }}><Icon name={step.icon} size={32} color="#059669" /></div>
              <div style={{
                display: "inline-block", padding: "2px 10px", borderRadius: 10,
                background: "#f0fdf4", color: "#059669", fontSize: 11, fontWeight: 700, marginBottom: 8,
              }}>STEP {step.step}</div>
              <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#64748b", margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to={lp("/methodology")} style={{
            display: "inline-block", padding: "10px 24px", borderRadius: 8,
            background: "#f0fdf4", color: "#059669", fontWeight: 700, fontSize: 15,
            textDecoration: "none", border: "1px solid #a7f3d0",
          }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Read Full Methodology <ArrowRight size={14} /></span></Link>
        </div>
      </section>

      {/* ══════ 5. FULL BROKER RANKINGS ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 32 : 48 }}>
        <h2 style={secTitle}>Best Forex Brokers 2026 — Full Rankings</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {top15.map((b, i) => (
            <BrokerRankCard key={b.slug} broker={b} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* ══════ 6. COMPARISON TABLE ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.compareTop", { count: 5 })}</h2>
        <div style={{ ...cardBg, overflow: "auto" }}>
          <table style={{
            width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 700,
          }}>
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
                const isBestSpread = top5.every((o) => parseFloat(b.B.spread) <= parseFloat(o.B.spread));
                const isBestScore = top5.every((o) => b.B.score >= o.B.score);
                const isBestDep = top5.every((o) => b.B.minDep <= o.B.minDep);
                return (
                  <tr key={b.slug} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 14px", fontFamily: "'JetBrains Mono'", fontWeight: 800, color: i === 0 ? "#059669" : "#475569" }}>
                      #{i + 1}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <Link to={lp(`/review/${b.slug}`)} style={{ fontWeight: 700, color: "#1e293b", textDecoration: "none" }}>
                        {b.B.name}
                      </Link>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14,
                        color: isBestScore ? "#059669" : "#1e293b",
                        background: isBestScore ? "#ecfdf5" : "transparent",
                        padding: isBestScore ? "2px 6px" : 0, borderRadius: 4,
                      }}>{b.B.score}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 14,
                        color: isBestSpread ? "#059669" : "#1e293b",
                        background: isBestSpread ? "#ecfdf5" : "transparent",
                        padding: isBestSpread ? "2px 6px" : 0, borderRadius: 4,
                      }}>{b.B.spread} pips</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 14,
                        color: isBestDep ? "#059669" : "#1e293b",
                        background: isBestDep ? "#ecfdf5" : "transparent",
                        padding: isBestDep ? "2px 6px" : 0, borderRadius: 4,
                      }}>{b.B.minDep === 0 ? "$0" : `$${b.B.minDep}`}</span>
                    </td>
                    <td style={{ padding: "12px 14px", fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>{b.B.leverage}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {b.B.platforms.slice(0, 3).map((p) => (
                          <span key={p} style={{
                            padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                            background: "#f1f5f9", color: "#475569",
                          }}>{p}</span>
                        ))}
                        {b.B.platforms.length > 3 && (
                          <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "#f1f5f9", color: "#94a3b8" }}>
                            +{b.B.platforms.length - 3}
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

      {/* ══════ 7. CATEGORY NAVIGATION HUB ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.browseCategories")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 16 }}>
          {[
            { title: "By Strategy", items: CONTENT.categoryNav.byStrategy },
            { title: "By Cost", items: CONTENT.categoryNav.byCost },
            { title: "By Platform", items: CONTENT.categoryNav.byPlatform },
            { title: "By Account", items: CONTENT.categoryNav.byAccount },
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

      {/* ══════ 8. COST ANALYSIS ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.costAnalysis")}</h2>
        <div style={{ ...cardBg, padding: mob ? "24px 20px" : "32px 28px" }}>
          {CONTENT.costAnalysis.paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "#475569", marginBottom: 14 }}>{p}</p>
          ))}
          {/* Mini cost comparison table */}
          <div style={{ overflow: "auto", marginTop: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 500 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Broker", "Account", "Avg Spread", "Commission", "Total Cost/Lot"].map((h) => (
                    <th key={h} style={{
                      padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 12,
                      color: "#94a3b8", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CONTENT.costAnalysis.costTable.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "#1e293b" }}>{row.broker}</td>
                    <td style={{ padding: "10px 14px", color: "#64748b" }}>{row.account}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>{row.spread} pips</td>
                    <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>{row.commission}</td>
                    <td style={{
                      padding: "10px 14px", fontFamily: "'JetBrains Mono'", fontWeight: 800,
                      color: i === 2 ? "#059669" : "#1e293b",
                    }}>{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════ 9. REGULATION GUIDE ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.regulation")}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#475569", marginBottom: 20 }}>
          {CONTENT.regulationGuide.intro}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr", gap: 16 }}>
          {CONTENT.regulationGuide.regulators.map((reg) => (
            <div key={reg.name} style={{ ...cardBg, padding: mob ? "20px" : "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  padding: "4px 10px", borderRadius: 6,
                  background: reg.tier === 1 ? "#ecfdf5" : "#f1f5f9",
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 15,
                  color: reg.tier === 1 ? "#059669" : "#64748b",
                }}>{reg.name}</div>
                <span style={{
                  padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                  background: "#f0fdf4", color: "#059669",
                }}>Tier {reg.tier}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 2 }}>{reg.fullName}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>{reg.country}</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#64748b", marginBottom: 8 }}>{reg.desc}</p>
              {reg.compensation && (
                <div style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>
                  Compensation: {reg.compensation}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════ 10. PLATFORM COMPARISON ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.platforms")}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#475569", marginBottom: 20 }}>
          {CONTENT.platformComparison.intro}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 16 }}>
          {CONTENT.platformComparison.platforms.map((pl) => (
            <div key={pl.name} style={{ ...cardBg, padding: mob ? "20px" : "24px" }}>
              <div style={{
                fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 22,
                color: "#1e3a5f", marginBottom: 4,
              }}>{pl.abbr}</div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{pl.name}</div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", marginBottom: 4 }}>Strengths</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#475569", margin: 0 }}>{pl.strengths}</p>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", marginBottom: 4 }}>Weakness</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#475569", margin: 0 }}>{pl.weakness}</p>
              </div>
              <div style={{
                padding: "8px 10px", borderRadius: 8, background: "#f0fdf4",
                fontSize: 12, color: "#065f46", fontWeight: 600,
              }}>Best for: {pl.bestFor}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ 11. FAQ ══════ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.faq")}</h2>
        <Accordion items={CONTENT.faq} expanded={openFaq} setExpanded={setOpenFaq} />
      </section>

      {/* ══════ 12. COUNTRY RANKINGS + AUTHOR + CTA + DISCLOSURE ══════ */}
      {/* Country links */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={secTitle}>{t("pillar.countryRankings")}</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : tab ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr",
          gap: 10,
        }}>
          {CONTENT.countryLinks.map((c) => (
            <Link key={c.name} to={lp(c.path)} style={{
              ...cardBg, padding: "12px 16px",
              display: "flex", alignItems: "center", gap: 8,
              textDecoration: "none", color: "#1e293b", fontSize: 14, fontWeight: 500,
              transition: "all 0.15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#059669"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <CountryFlag code={c.code} size={18} />
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Author bio */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <AuthorBioCard author={author} />
      </section>

      {/* Methodology CTA */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{
          padding: mob ? "24px 20px" : "32px 36px", borderRadius: 16,
          background: "linear-gradient(135deg,#0f172a,#1e3a5f)",
          textAlign: "center",
        }}>
          <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#fff", marginBottom: 8 }}>
            How We Test Brokers
          </h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 20, maxWidth: 500, margin: "0 auto 20px" }}>
            Our team opens live accounts, deposits real money, and executes hundreds of trades to give you rankings you can trust.
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
        <AffiliateDisclosureBanner />
      </section>
    </div>
  );
}
