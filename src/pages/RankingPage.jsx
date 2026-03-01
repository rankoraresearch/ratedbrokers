import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import RANKINGS, { getRankingBySlug, getRankingsByCategory, getRankingsBySub } from "../data/rankings";
import { getBrokersForRanking } from "../data/rankingFilters";
import SEO_CONTENT from "../data/rankingSeoContent";
import BrokerRankCard from "../components/BrokerRankCard";
import Accordion from "../components/Accordion";
import { getAuthorForRanking, getFactChecker } from "../data/authors";
import AuthorByline from "../components/AuthorByline";
import AuthorBioCard from "../components/AuthorBioCard";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import Icon, { ArrowRight, CircleCheck } from "../components/Icon";

const YEAR = "2026";

export default function RankingPage() {
  const { slug } = useParams();
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const [openFaq, setOpenFaq] = useState(null);

  const fullSlug = "/" + slug;
  const ranking = getRankingBySlug(fullSlug);

  useEffect(() => {
    if (ranking) {
      const seo = SEO_CONTENT[ranking.id];
      document.title = seo?.metaTitle || `${ranking.title} ${YEAR}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && seo?.metaDesc) metaDesc.setAttribute("content", seo.metaDesc);

      // JSON-LD Article + BreadcrumbList schema
      const a = getAuthorForRanking(ranking.category);
      const jsonLd = [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: seo?.metaTitle || `${ranking.title} ${YEAR}`,
          description: seo?.metaDesc || "",
          datePublished: "2026-01-15",
          dateModified: "2026-02-28",
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
          { label: "Home", path: "/" },
          { label: "Rankings", path: "/rankings" },
          { label: `${ranking.title} ${YEAR}`, path: fullSlug },
        ]),
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

  if (!ranking) return <Navigate to="/" replace />;

  const brokers = getBrokersForRanking(ranking.id);
  const seo = SEO_CONTENT[ranking.id] || {};
  const topBroker = brokers[0]?.B?.name || "IC Markets";
  const author = getAuthorForRanking(ranking.category);
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

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* BREADCRUMBS */}
      <div style={{ ...cn, padding: mob ? "16px 16px 0" : "20px 24px 0" }}>
        <Breadcrumb items={[
          { label: "Home", path: "/" },
          { label: "Rankings", path: "/rankings" },
          { label: ranking.title },
        ]} />
      </div>

      {/* HERO */}
      <section style={{
        ...cn,
        padding: mob ? "24px 16px 32px" : "32px 24px 40px",
      }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ display: "block", marginBottom: 12 }}><Icon name={ranking.icon} size={mob ? 36 : 48} /></span>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 26 : tab ? 34 : 42,
            lineHeight: 1.1, color: "#0f172a", marginBottom: 8,
          }}>
            {ranking.title} {YEAR}
          </h1>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <AuthorByline author={author} factChecker={factChecker} updatedDate={`February ${YEAR}`} variant="centered" />
          </div>
        </div>
      </section>

      {/* SEO INTRO */}
      {seo.intro && (
        <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
          <div style={{ ...cardBg, padding: mob ? "24px 20px" : "32px 36px" }}>
            {seo.intro.map((p, i) => (
              <p key={i} style={{
                fontSize: 14, lineHeight: 1.8, color: "#475569",
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
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#065f46", marginBottom: 6 }}>Key Finding</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#065f46", margin: 0 }}>
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
            ["search", `${brokers.length}`, "Brokers Ranked"],
            ["timer", "200+", "Hours Research"],
            ["calendar", `Feb ${YEAR}`, "Last Updated"],
          ].map(([iconName, val, label], i) => (
            <div key={i} style={{
              ...cardBg, padding: mob ? "14px" : "18px 24px",
              textAlign: "center",
            }}>
              <Icon name={iconName} size={18} color="#64748b" />
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
                fontSize: mob ? 16 : 20, color: "#0f172a", marginTop: 4,
              }}>{val}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK SUMMARY — TOP 3 */}
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
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 11, color: "#fff",
                  }}>#{i + 1}</div>
                  <Link to={lp(`/review/${b.slug}`)} style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "inherit", textDecoration: "none" }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                  >{b.B.name}</Link>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#475569" }}>
                  <span>Score: <strong style={{ color: "#059669" }}>{b.B.score}</strong></span>
                  <span>Spread: <strong>{b.B.spread} pips</strong></span>
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{b.B.type}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <a href={b.B.url} target="_blank" rel="noopener noreferrer nofollow" style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "6px 14px", borderRadius: 7,
                    background: "linear-gradient(135deg,#059669,#34d399)",
                    color: "#fff", fontWeight: 700, fontSize: 12, textDecoration: "none",
                  }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Visit {b.B.name} <ArrowRight size={12} /></span></a>
                  <Link to={lp(`/review/${b.slug}`)} style={{
                    fontSize: 12, color: "#64748b", fontWeight: 600, textDecoration: "none",
                  }}>Read Review</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            <BrokerRankCard key={b.slug} broker={b} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* HOW WE RANKED */}
      {seo.howWeRanked && (
        <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
          <div style={{ ...cardBg, padding: mob ? "24px 20px" : "32px 36px" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 12 }}>
              How We Ranked These Brokers
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "#475569", margin: 0 }}>
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
                textDecoration: "none", color: "#1e293b",
                display: "flex", alignItems: "center", gap: 12,
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#059669"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <Icon name={r.icon} size={20} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                    {r.category} / {r.sub}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {seo.faq && seo.faq.length > 0 && (
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
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 20, maxWidth: 500, margin: "0 auto 20px" }}>
            Our team opens live accounts, deposits real money, and executes hundreds of trades to give you rankings you can trust.
          </p>
          <Link to={lp("/methodology")} style={{
            display: "inline-block", padding: "12px 28px", borderRadius: 10,
            background: "linear-gradient(135deg,#059669,#34d399)",
            color: "#fff", fontWeight: 700, fontSize: 14,
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
        <div style={{
          padding: mob ? "16px" : "20px 28px", borderRadius: 12,
          background: "#f8fafc", border: "1px solid #f1f5f9",
        }}>
          <p style={{ fontSize: 11, lineHeight: 1.7, color: "#94a3b8", margin: 0 }}>
            <strong>Disclosure:</strong> RatedBrokers.com may receive compensation from brokers listed on this page through affiliate partnerships. This does not influence our rankings, which are based on independent testing and research. CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between 74-89% of retail investor accounts lose money when trading CFDs. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
          </p>
        </div>
      </section>
    </div>
  );
}
