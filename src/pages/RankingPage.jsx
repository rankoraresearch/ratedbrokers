import { useState, useEffect, useRef } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import RANKINGS, { getRankingBySlug, getRankingsByCategory, getRankingsBySub } from "../data/rankings";
import { getBrokersForRanking } from "../data/rankingFilters";
import SEO_CONTENT from "../data/rankingSeoContent";
import { getThematicData, getBrokerBlurb, getQuickVerdict, getComparisonCols, getEducation } from "../data/rankingThematic";
import BrokerRankCard from "../components/BrokerRankCard";
import Accordion from "../components/Accordion";
import AffiliateDisclosureBanner from "../components/AffiliateDisclosureBanner";
import { getAuthorForRanking, getFactChecker, getReviewerForAuthor, getEditor } from "../data/authors";
import AuthorCredits from "../components/AuthorCredits";
import AuthorBioCard from "../components/AuthorBioCard";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import Icon, { ArrowRight, CircleCheck, Check, X as XIcon } from "../components/Icon";
import BrokerLogo from "../components/BrokerLogo";
import HeroWave, { DotGrid } from "../components/HeroWave";
import { getCountryData } from "../data/countries/index";
import { canonicalPair } from "../data/comparisons";

const YEAR = "2026";
const apiBase = import.meta.env.VITE_API_URL || '';
const makeVisitUrl = (slug, fallbackUrl) => apiBase ? `${apiBase}/go/${slug}` : fallbackUrl;

export default function RankingPage() {
  const { slug } = useParams();
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const [openFaq, setOpenFaq] = useState(null);
  const [openThematicFaq, setOpenThematicFaq] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroRef = useRef(null);

  const fullSlug = "/" + slug;
  const ranking = getRankingBySlug(fullSlug);

  useEffect(() => {
    if (ranking) {
      const seo = SEO_CONTENT[ranking.id];
      document.title = seo?.metaTitle || `${ranking.title} ${YEAR}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && seo?.metaDesc) metaDesc.setAttribute("content", seo.metaDesc);

      // JSON-LD Article + BreadcrumbList + FAQPage schema
      const a = getAuthorForRanking(ranking.category);
      const brokersForSchema = getBrokersForRanking(ranking.id);
      const topName = brokersForSchema[0]?.B?.name || "IC Markets";
      const fv = (t) => t.replace(/\{year\}/g, YEAR).replace(/\{topBroker\}/g, topName).replace(/\{count\}/g, String(brokersForSchema.length));
      const jsonLd = [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: seo?.metaTitle || `${ranking.title} ${YEAR}`,
          description: seo?.metaDesc || "",
          datePublished: "2026-01-15",
          dateModified: new Date().toISOString().split('T')[0],
          author: {
            "@type": "Person",
            name: a.name,
            jobTitle: a.role,
            url: a.linkedin,
            sameAs: [a.linkedin],
            ...(a.credentials?.length ? {
              hasCredential: a.credentials.map(c => ({
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "Professional Certification",
                name: c,
              })),
            } : {}),
            ...(a.specialty ? { knowsAbout: a.specialty.split(", ") } : {}),
            ...(a.image ? { image: `https://ratedbrokers.com${a.image}` } : {}),
          },
          publisher: {
            "@type": "Organization",
            name: "RatedBrokers",
            url: "https://ratedbrokers.com",
          },
        },
        breadcrumbSchema([
          { label: "RatedBrokers", path: "/" },
          { label: "Forex Brokers", path: "/best-forex-brokers" },
          { label: `${ranking.title} ${YEAR}`, path: fullSlug },
        ]),
        ...(seo.faq?.length ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: seo.faq.map((f) => ({
            "@type": "Question",
            name: fv(f.q),
            acceptedAnswer: { "@type": "Answer", text: fv(f.a) },
          })),
        }] : []),
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: seo?.metaTitle || `${ranking.title} ${YEAR}`,
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          numberOfItems: brokersForSchema.length,
          itemListElement: brokersForSchema.map(({ B: br, slug: s }, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: br.name,
            url: `https://ratedbrokers.com/review/${s}`,
          })),
        },
      ];
      let scriptEl = document.querySelector('script[data-jsonld="ranking"]');
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.type = "application/ld+json";
        scriptEl.setAttribute("data-jsonld", "ranking");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    }
    window.scrollTo(0, 0);
    return () => {
      const el = document.querySelector('script[data-jsonld="ranking"]');
      if (el) el.remove();
    };
  }, [ranking]);

  // Sticky CTA bar: show after hero scrolls out of view
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!ranking) return <Navigate to="/" replace />;

  const brokers = getBrokersForRanking(ranking.id);
  const seo = SEO_CONTENT[ranking.id] || {};
  const topBroker = brokers[0]?.B?.name || "IC Markets";
  const author = getAuthorForRanking(ranking.category);
  const editor = getEditor();
  const reviewer = getReviewerForAuthor(author.id);
  const factChecker = getFactChecker(author.id);

  // Replace template variables
  const fillVars = (text) =>
    text
      .replace(/\{year\}/g, YEAR)
      .replace(/\{topBroker\}/g, topBroker)
      .replace(/\{count\}/g, String(brokers.length));

  // Related rankings
  const related = [
    ...getRankingsBySub(ranking.category, ranking.sub).filter((r) => r.id !== ranking.id),
    ...getRankingsByCategory(ranking.category).filter((r) => r.sub !== ranking.sub && r.id !== ranking.id),
  ].slice(0, 6);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const cardBg = { background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0" };

  // Country-specific data for In-Depth Reviews
  const countrySlug = ranking.category === "country"
    ? ranking.slug.replace("/best-forex-brokers-", "")
    : null;
  const countryData = countrySlug ? getCountryData(countrySlug) : null;
  const countryBrokerMap = {};
  if (countryData?.brokers) {
    countryData.brokers.forEach((cb) => {
      if (cb.countryReview) countryBrokerMap[cb.slug] = cb;
    });
  }

  // Thematic data (F1 template)
  const thematicData = getThematicData(ranking.id);
  const quickVerdict = getQuickVerdict(ranking.id, brokers);
  const educationData = getEducation(ranking.id);

  // Comparison table columns: thematic custom or fallback defaults
  const compCols = getComparisonCols(ranking.id);
  const compData = thematicData?.comparisonData || null;

  return (
    <main style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* BREADCRUMBS */}
      <div style={{ ...cn, padding: mob ? "16px 16px 0" : "20px 24px 0" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: "Forex Brokers", path: "/best-forex-brokers" },
          { label: ranking.title },
        ]} />
      </div>

      {/* HERO */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(180deg, #f0f9ff 0%, #ecfdf5 50%, #f8f9fb 100%)",
        borderTop: "4px solid #059669",
      }}>
        <DotGrid size={28} color="rgba(5,150,105,0.04)" dotSize={1} />
        <header ref={heroRef} style={{
          ...cn, position: "relative",
          padding: mob ? "28px 16px 8px" : "36px 24px 8px",
        }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: mob ? 56 : 72, height: mob ? 56 : 72, borderRadius: 16, background: "rgba(5,150,105,0.08)", marginBottom: 14 }}>
              <Icon name={ranking.icon} size={mob ? 28 : 36} />
            </span>
            <h1 style={{
              fontFamily: "Outfit", fontWeight: 900,
              fontSize: mob ? 26 : tab ? 34 : 42,
              lineHeight: 1.1, color: "#0f172a", marginBottom: 8,
            }}>
              {ranking.title} {YEAR}
            </h1>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <AuthorCredits author={author} editor={editor} reviewer={reviewer} factChecker={factChecker} updatedDate={`March ${YEAR}`} variant="centered" />
            </div>
          </div>
        </header>
        <HeroWave color="#f8f9fb" height={mob ? 28 : 40} />
      </div>

      {/* SEO INTRO */}
      {seo.intro && (
        <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
          <div style={{ ...cardBg, padding: mob ? "24px 20px" : "32px 36px" }}>
            {seo.intro.map((p, i) => (
              <p key={i} style={{
                fontSize: 15, lineHeight: 1.8, color: "#1f2937",
                marginBottom: i < seo.intro.length - 1 ? 16 : 0,
              }}>
                {fillVars(p)}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* KEY FINDING */}
      {seo.keyFinding && (
        <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
          <div style={{
            padding: mob ? "20px" : "24px 32px", borderRadius: 16,
            background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
            border: "1px solid #a7f3d0",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <CircleCheck size={20} color="#059669" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, color: "#065f46", marginBottom: 6 }}>Key Finding</div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#065f46", margin: 0 }}>
                  {fillVars(seo.keyFinding)}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TRUST STATS BAR */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr 1fr" : "1fr 1fr 1fr",
          gap: 12,
        }}>
          {[
            ["search", `${brokers.length}`, mob ? "Ranked" : "Brokers Ranked"],
            ["timer", "200+", mob ? "Research" : "Hours Research"],
            ["calendar", `Feb ${YEAR}`, mob ? "Updated" : "Last Updated"],
          ].map(([iconName, val, label], i) => (
            <div key={i} style={{
              ...cardBg, padding: mob ? "14px" : "18px 24px",
              textAlign: "center",
            }}>
              <Icon name={iconName} size={18} color="#374151" />
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
                fontSize: mob ? 16 : 20, color: "#0f172a", marginTop: 4,
              }}>{val}</div>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK VERDICT (thematic) or QUICK SUMMARY (fallback) */}
      {quickVerdict ? (
        <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
          <div style={{ ...cardBg, padding: mob ? "20px" : "28px 36px" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 16 }}>
              Quick Verdict
            </h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {quickVerdict.map((v, i) => {
                const vBroker = brokers.find(b => b.slug === v.slug);
                if (!vBroker) return null;
                return (
                  <div key={v.slug} style={{
                    display: "flex", alignItems: "center", gap: mob ? 10 : 16,
                    padding: mob ? "14px 0" : "16px 0",
                    borderTop: i > 0 ? "1px solid #f1f5f9" : "none",
                  }}>
                    <span style={{ fontSize: mob ? 18 : 22, flexShrink: 0 }}>{v.icon}</span>
                    <div style={{ width: mob ? 80 : tab ? 110 : 150, flexShrink: 0 }}>
                      <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 11 : 13, color: "#1f2937", textTransform: "uppercase", letterSpacing: 0.3, lineHeight: 1.3 }}>
                        {v.label}
                      </div>
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      {!mob && <BrokerLogo slug={vBroker.slug} name={vBroker.B.name} fallback={vBroker.B.logo} size={32} shape="icon" />}
                      <div>
                        <Link to={lp(`/review/${vBroker.slug}`)} style={{
                          fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 14 : 15, color: "#0f172a", textDecoration: "none",
                        }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                        >{vBroker.B.name}</Link>
                        {mob && v.metric && (
                          <div style={{
                            fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
                            fontWeight: 600, color: "#1f2937", marginTop: 1,
                          }}>{v.metric}</div>
                        )}
                      </div>
                    </div>
                    {!mob && (
                      <div style={{
                        fontFamily: "'JetBrains Mono',monospace", fontSize: 13,
                        fontWeight: 600, color: "#1f2937", whiteSpace: "nowrap",
                      }}>
                        {v.metric}
                      </div>
                    )}
                    <a href={makeVisitUrl(vBroker.slug, vBroker.B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: mob ? "10px 16px" : "8px 16px", borderRadius: 8, flexShrink: 0,
                      background: "#059669", color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none",
                    }}>Visit <ArrowRight size={12} /></a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
          <div style={{ ...cardBg, padding: mob ? "20px" : "28px 36px" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 16 }}>
              Quick Summary: Top 3
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
              {brokers.slice(0, 3).map((b, i) => (
                <div key={b.slug} style={{
                  padding: "16px", borderRadius: 12,
                  background: i === 0 ? "#f0fdf4" : "#f8fafc",
                  border: i === 0 ? "1px solid #a7f3d0" : "1px solid #f1f5f9",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: i === 0 ? "#059669" : "#1e3a5f",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 12, color: "#fff",
                    }}>#{i + 1}</div>
                    <Link to={lp(`/review/${b.slug}`)} style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, color: "inherit", textDecoration: "none" }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                    >{b.B.name}</Link>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 13, color: "#1f2937" }}>
                    <span>Score: <strong style={{ color: "#059669" }}>{b.B.score}</strong></span>
                    <span>Spread: <strong>{b.B.spread} pips</strong></span>
                  </div>
                  <div style={{ fontSize: 12, color: "#1f2937", marginTop: 4 }}>{b.B.type}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                    <a href={makeVisitUrl(b.slug, b.B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "6px 14px", borderRadius: 7,
                      background: "linear-gradient(135deg,#059669,#34d399)",
                      color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none",
                    }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Visit {b.B.name} <ArrowRight size={12} /></span></a>
                    <Link to={lp(`/review/${b.slug}`)} style={{
                      fontSize: 13, color: "#1f2937", fontWeight: 600, textDecoration: "none",
                    }}>Read Review</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BROKER CARDS */}
      <section style={{ ...cn, paddingBottom: mob ? 32 : 48 }}>
        <h2 style={{
          fontFamily: "Outfit", fontWeight: 800,
          fontSize: mob ? 20 : 26, marginBottom: 20,
        }}>
          All {ranking.title} {YEAR}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {brokers.map((b, i) => (
            <BrokerRankCard
              key={b.slug}
              broker={b}
              rank={i + 1}
              thematic={getBrokerBlurb(ranking.id, b.slug, b)}
              rankingSlug={ranking.slug}
            />
          ))}
        </div>
      </section>

      {/* EDUCATIONAL SECTION (thematic or auto-generated) */}
      {educationData && (
        <section style={{ ...cn, paddingBottom: mob ? 32 : 48 }}>
          <div style={{ ...cardBg, padding: mob ? "24px 20px" : "36px 40px" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 8 }}>
              {educationData.title}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "#1f2937", marginBottom: 20 }}>
              {educationData.intro}
            </p>

            {/* Main bullet points */}
            {educationData.points && (
              <div style={{ marginBottom: 24 }}>
                {educationData.points.map((pt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <CircleCheck size={16} color="#059669" style={{ flexShrink: 0, marginTop: 4 }} />
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "#1f2937", margin: 0 }}>
                      <strong>{pt.bold}</strong> {pt.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Additional sections */}
            {educationData.sections?.map((sec, si) => (
              <div key={si} style={{ marginBottom: 28, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: 12 }}>
                  {sec.heading}
                </h3>
                {sec.paragraphs?.map((p, pi) => (
                  <p key={pi} style={{ fontSize: 15, lineHeight: 1.75, color: "#1f2937", marginBottom: 12 }}>{p}</p>
                ))}
                {sec.points && (
                  <div style={{ marginTop: 8 }}>
                    {sec.points.map((pt, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <CircleCheck size={14} color="#059669" style={{ flexShrink: 0, marginTop: 4 }} />
                        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#1f2937", margin: 0 }}>
                          <strong>{pt.bold}</strong> {pt.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {sec.tip && (
                  <div style={{
                    marginTop: 16, padding: mob ? "16px" : "20px 24px", borderRadius: 12,
                    background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #93c5fd",
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1e40af", marginBottom: 6 }}>Pro Tip</div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#1e3a5f", margin: 0 }}>{sec.tip}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Thematic FAQ (inline accordion) */}
            {educationData.faq && educationData.faq.length > 0 && (
              <div style={{ paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: 16 }}>
                  Frequently Asked Questions
                </h3>
                <Accordion
                  items={educationData.faq}
                  expanded={openThematicFaq}
                  setExpanded={setOpenThematicFaq}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* COMPARISON TABLE (all rankings) */}
      <section style={{ ...cn, paddingBottom: mob ? 32 : 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 20 }}>
          {countryData ? `${countryData.name} Broker` : ranking.title} Comparison {YEAR}
        </h2>
        {mob ? (
          /* Mobile: cards instead of table */
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {brokers.map((b, i) => {
              const scoreColor = b.B.score >= 9.0 ? "#059669" : b.B.score >= 8.5 ? "#2563eb" : "#d97706";
              const customRow = compData?.[b.slug];
              const getVal = (col) => {
                const lc = col.toLowerCase();
                const fallback =
                  lc.includes("spread") ? (b.B.avgSpread ? `${b.B.avgSpread} pips` : `${b.B.spread} pips`)
                  : lc.includes("commission") ? (b.B.commission || "—")
                  : lc.includes("execution") ? "—"
                  : lc.includes("min dep") || lc.includes("deposit") ? (b.B.minDep === 0 ? "$0" : `$${b.B.minDep}`)
                  : lc.includes("leverage") ? b.B.leverage
                  : lc.includes("platform") ? (b.B.platforms?.length + " platforms" || "—")
                  : "—";
                return customRow ? (customRow[col] || fallback) : fallback;
              };
              return (
                <div key={b.slug} style={{
                  ...cardBg, padding: 14,
                  border: i === 0 ? "2px solid #059669" : "1px solid #e2e8f0",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 5, display: "inline-flex",
                      alignItems: "center", justifyContent: "center",
                      background: i === 0 ? "#059669" : "#1e3a5f", color: "#fff",
                      fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 11,
                    }}>#{i + 1}</span>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", flex: 1 }}>{b.B.name}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16, color: scoreColor,
                    }}>{b.B.score}</span>
                  </div>
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px",
                  }}>
                    {compCols.map((col) => (
                      <div key={col}>
                        <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{col}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", marginTop: 1 }}>{getVal(col)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop/Tablet: table */
          <div style={{ ...cardBg, overflow: "hidden" }}>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{
                width: "100%", minWidth: 700, borderCollapse: "collapse", fontSize: 15,
              }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Broker", "Score", ...compCols].map((h) => (
                      <th key={h} style={{
                        padding: "14px 16px", textAlign: "left", fontFamily: "Outfit", fontWeight: 700,
                        fontSize: 13, color: "#1f2937", textTransform: "uppercase", letterSpacing: "0.05em",
                        borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap",
                        ...(h === "Broker" ? { position: "sticky", left: 0, background: "#f8fafc", zIndex: 1 } : {}),
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {brokers.map((b, i) => {
                    const scoreColor = b.B.score >= 9.0 ? "#059669" : b.B.score >= 8.5 ? "#2563eb" : "#d97706";
                    const customRow = compData?.[b.slug];
                    return (
                      <tr key={b.slug}
                        style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{
                          padding: "14px 16px", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap",
                          position: "sticky", left: 0, background: "#fff", zIndex: 1,
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{
                              width: 22, height: 22, borderRadius: 5, display: "inline-flex",
                              alignItems: "center", justifyContent: "center",
                              background: i === 0 ? "#059669" : "#1e3a5f", color: "#fff",
                              fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 11,
                            }}>#{i + 1}</span>
                            {b.B.name}
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{
                            fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16,
                            color: scoreColor,
                          }}>{b.B.score}</span>
                        </td>
                        {compCols.map((col) => {
                          const lc = col.toLowerCase();
                          const fallback =
                            lc.includes("spread") ? (b.B.avgSpread ? `${b.B.avgSpread} pips` : `${b.B.spread} pips`)
                            : lc.includes("commission") ? (b.B.commission || "—")
                            : lc.includes("execution") ? "—"
                            : lc.includes("min dep") || lc.includes("deposit") ? (b.B.minDep === 0 ? "$0" : `$${b.B.minDep}`)
                            : lc.includes("leverage") ? b.B.leverage
                            : lc.includes("platform") ? (b.B.platforms?.length + " platforms" || "—")
                            : "—";
                          return (
                            <td key={col} style={{ padding: "14px 16px", color: "#1f2937" }}>
                              {customRow ? (customRow[col] || fallback) : fallback}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* IN-DEPTH BROKER REVIEWS (country rankings only) */}
      {countryData && Object.keys(countryBrokerMap).length > 0 && (
        <section style={{ ...cn, paddingBottom: mob ? 32 : 48 }}>
          <div style={{ ...cardBg, padding: mob ? "20px" : "36px" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 28, marginBottom: 6 }}>
              {countryData.name} Broker Reviews — In-Depth Analysis
            </h2>
            <p style={{ fontSize: 16, color: "#1f2937", lineHeight: 1.7, marginBottom: 28 }}>
              We analyzed each broker's {countryData.currency || "local"} account conditions, regulatory status, and trading costs. Here's what {countryData.name} traders need to know.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: mob ? 24 : 32 }}>
              {brokers.map((b, i) => {
                const cb = countryBrokerMap[b.slug];
                if (!cb?.countryReview) return null;
                const review = cb.countryReview;
                return (
                  <div key={b.slug} id={`review-${b.slug}`} style={{
                    paddingTop: mob ? 20 : 28,
                    borderTop: "1px solid #e2e8f0",
                  }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: mob ? "flex-start" : "center", gap: mob ? 12 : 16, marginBottom: 16, flexWrap: "wrap" }}>
                      <a href={makeVisitUrl(b.slug, b.B.url)} target="_blank" rel="noopener nofollow sponsored" style={{ flexShrink: 0, display: "block", textDecoration: "none" }}>
                        <BrokerLogo slug={b.slug} name={b.B.name} fallback={b.B.logo} size={mob ? 52 : 60} shape="brand" />
                      </a>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, margin: 0, lineHeight: 1.2 }}>
                          #{i + 1}. {b.B.name} for {countryData.name} Traders
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                          {cb.badge && <span style={{ padding: "2px 8px", borderRadius: 5, background: (cb.badgeColor || "#059669") + "15", color: cb.badgeColor || "#059669", fontSize: 13, fontWeight: 700 }}>{cb.badge}</span>}
                        </div>
                      </div>
                      <div style={{
                        width: 52, height: 52, borderRadius: 12,
                        background: b.B.score >= 9.0 ? "#ecfdf5" : b.B.score >= 8.0 ? "#eff6ff" : "#fffbeb",
                        border: `2px solid ${b.B.score >= 9.0 ? "#059669" : b.B.score >= 8.0 ? "#2563eb" : "#d97706"}`,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 18, lineHeight: 1, color: b.B.score >= 9.0 ? "#059669" : b.B.score >= 8.0 ? "#2563eb" : "#d97706" }}>{b.B.score}</span>
                        <span style={{ fontSize: 8, fontWeight: 700, color: "#1f2937", textTransform: "uppercase" }}>{b.B.score >= 9.5 ? "Excellent" : b.B.score >= 9.0 ? "Great" : b.B.score >= 8.5 ? "Very Good" : "Good"}</span>
                      </div>
                    </div>

                    {/* Review paragraphs */}
                    <div style={{ marginBottom: 16 }}>
                      {review.paragraphs.map((p, pi) => (
                        <p key={pi} style={{ fontSize: 16, lineHeight: 1.75, color: "#1f2937", margin: pi < review.paragraphs.length - 1 ? "0 0 12px" : 0 }}>{p}</p>
                      ))}
                    </div>

                    {/* Pros / Cons */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
                      gap: mob ? 12 : 16,
                      marginBottom: 16,
                    }}>
                      <div style={{ padding: mob ? 14 : 16, borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#059669", marginBottom: 8 }}>Pros for {countryData.name} Traders</div>
                        {review.pros.map((pro, pi) => (
                          <div key={pi} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
                            <Check size={14} color="#059669" style={{ flexShrink: 0, marginTop: 3 }} />
                            <span style={{ fontSize: 15, lineHeight: 1.5, color: "#1f2937" }}>{pro}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: mob ? 14 : 16, borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#dc2626", marginBottom: 8 }}>Cons for {countryData.name} Traders</div>
                        {review.cons.map((con, ci) => (
                          <div key={ci} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
                            <XIcon size={14} color="#dc2626" style={{ flexShrink: 0, marginTop: 3 }} />
                            <span style={{ fontSize: 15, lineHeight: 1.5, color: "#1f2937" }}>{con}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <a href={makeVisitUrl(b.slug, b.B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: mob ? "10px 18px" : "10px 22px", borderRadius: 10,
                        background: "linear-gradient(135deg,#059669,#34d399)",
                        color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none",
                      }}>Visit {b.B.name} <ArrowRight size={14} /></a>
                      <Link to={lp(`/review/${b.slug}`)} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: mob ? "10px 18px" : "10px 22px", borderRadius: 10,
                        background: "#f1f5f9", color: "#1f2937", fontWeight: 600, fontSize: 15, textDecoration: "none",
                      }}>Read Full {b.B.name} Review <ArrowRight size={14} /></Link>
                      {i > 0 && (
                        <Link to={lp(`/compare/${canonicalPair(b.slug, brokers[0].slug)}`)} style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: mob ? "10px 18px" : "10px 22px", borderRadius: 10,
                          background: "#f1f5f9", color: "#1f2937", fontWeight: 600, fontSize: 15, textDecoration: "none",
                        }}>Compare vs {brokers[0].B.name} <ArrowRight size={14} /></Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* HOW WE RANKED */}
      {seo.howWeRanked && (
        <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
          <div style={{ ...cardBg, padding: mob ? "24px 20px" : "32px 36px" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 12 }}>
              How We Ranked These Brokers
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#1f2937", margin: 0 }}>
              {fillVars(seo.howWeRanked)}
            </p>
          </div>
        </section>
      )}

      {/* RELATED RANKINGS */}
      {related.length > 0 && (
        <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 16 }}>
            Related Rankings
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
            gap: 12,
          }}>
            {related.map((r) => (
              <Link key={r.id} to={lp(r.slug)} style={{
                ...cardBg, padding: "16px 20px",
                textDecoration: "none", color: "#111827",
                display: "flex", alignItems: "center", gap: 12,
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#059669"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <Icon name={r.icon} size={20} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#1f2937", marginTop: 2 }}>
                    {r.category} / {r.sub}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ (skip if thematic FAQ exists — avoids duplicate section) */}
      {seo.faq && seo.faq.length > 0 && !educationData?.faq?.length && (
        <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 16 }}>
            Frequently Asked Questions
          </h2>
          <Accordion
            items={seo.faq.map((f) => ({ q: fillVars(f.q), a: fillVars(f.a) }))}
            expanded={openFaq}
            setExpanded={setOpenFaq}
          />
        </section>
      )}

      {/* METHODOLOGY CTA */}
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
            Our team verifies licenses, analyzes 130+ data points per broker, and cross-checks conditions across independent sources to give you rankings you can trust.
          </p>
          <Link to={lp("/methodology")} style={{
            display: "inline-block", padding: "12px 28px", borderRadius: 10,
            background: "linear-gradient(135deg,#059669,#34d399)",
            color: "#fff", fontWeight: 700, fontSize: 15,
            textDecoration: "none",
          }}>Read Our Methodology</Link>
        </div>
      </section>

      {/* AUTHOR BIO */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <AuthorBioCard author={author} />
      </section>

      {/* DISCLOSURE */}
      <section style={{ ...cn, paddingBottom: mob ? 40 : 60 }}>
        <AffiliateDisclosureBanner />
      </section>

      {/* STICKY CTA BAR for #1 broker */}
      {brokers[0] && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999,
          transform: showStickyBar ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "rgba(15, 23, 42, 0.97)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.2)",
        }}>
          <div style={{
            maxWidth: 1200, margin: "0 auto",
            padding: mob ? "10px 16px" : "12px 24px",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: mob ? 10 : 16,
          }}>
            <BrokerLogo slug={brokers[0].slug} name={brokers[0].B.name} fallback={brokers[0].B.logo} size={mob ? 32 : 36} shape="icon" />
            <span style={{
              fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 13 : 15,
              color: "#fff", whiteSpace: "nowrap",
            }}>
              #{1} {brokers[0].B.name}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
              fontSize: mob ? 14 : 16, color: "#34d399",
            }}>{brokers[0].B.score}</span>
            <a href={makeVisitUrl(brokers[0].slug, brokers[0].B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: mob ? "8px 16px" : "10px 24px", borderRadius: 8,
              background: "linear-gradient(135deg,#059669,#34d399)",
              color: "#fff", fontWeight: 700, fontSize: mob ? 13 : 14,
              textDecoration: "none", whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(5,150,105,0.3)",
            }}>Visit {brokers[0].B.name} <span style={{ marginLeft: 4 }}>&rarr;</span></a>
          </div>
        </div>
      )}
    </main>
  );
}
