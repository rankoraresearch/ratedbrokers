import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import { useTranslation } from "../i18n/LanguageContext";
import { getGuideBySlug, getAllGuides } from "../data/guides/index";
import { AUTHORS, getFactChecker } from "../data/authors";
import Accordion from "../components/Accordion";
import AuthorByline from "../components/AuthorByline";
import AuthorBioCard from "../components/AuthorBioCard";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import renderLinkedText from "../utils/renderLinkedText";
import Icon from "../components/Icon";
import { ChevronRight, CircleCheck, CircleX } from "lucide-react";

export default function GuidePage() {
  const { slug } = useParams();
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);

  const guide = getGuideBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!guide) return;

    document.title = guide.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", guide.meta.description);

    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.hero.h1,
        description: guide.meta.description,
        datePublished: "2026-01-20",
        dateModified: "2026-02-28",
        author: (() => {
          const a = AUTHORS[guide.author];
          if (!a) return { "@type": "Person", name: "RatedBrokers Team", jobTitle: "Trading Analyst" };
          return {
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
          };
        })(),
        publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: (guide.faq || []).map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      breadcrumbSchema([
        { label: "RatedBrokers", path: "/" },
        { label: "Guides", path: "/guides" },
        { label: guide.hero.h1, path: `/guide/${slug}` },
      ]),
    ];

    let scriptEl = document.querySelector(`script[data-jsonld="guide-${slug}"]`);
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-jsonld", `guide-${slug}`);
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemas);

    return () => {
      const el = document.querySelector(`script[data-jsonld="guide-${slug}"]`);
      if (el) el.remove();
    };
  }, [guide, slug]);

  if (!guide) {
    return (
      <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh", padding: "80px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 12 }}>Guide Not Found</h1>
        <p style={{ color: "#64748b", marginBottom: 24 }}>The guide you're looking for doesn't exist.</p>
        <Link to={lp("/")} style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Back to Home</Link>
      </div>
    );
  }

  const author = AUTHORS[guide.author] || AUTHORS["marcus-chen"];
  const factChecker = getFactChecker(author.id);
  const cn = { maxWidth: 800, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const allGuides = getAllGuides();
  const related = (guide.relatedGuides || []).map(s => allGuides.find(g => g.slug === s)).filter(Boolean);

  // Track which internal URLs have been linked in this article (max once each).
  const linkedUrls = new Set();

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#1e293b", minHeight: "100vh" }}>

      {/* ══════ BREADCRUMBS ══════ */}
      <div style={{ ...cn, paddingTop: mob ? 12 : 16, paddingBottom: 0 }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: "Guides", path: "/guides" },
          { label: guide.hero.h1 },
        ]} />
      </div>

      {/* ══════ HERO ══════ */}
      <section style={{ ...cn, paddingTop: mob ? 20 : 32, paddingBottom: mob ? 20 : 32 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{
            display: "inline-block", padding: "4px 10px", borderRadius: 6,
            background: guide.hero.badgeColor || "#ecfdf5", color: guide.hero.badgeTextColor || "#059669",
            fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
          }}>{guide.hero.badge || "GUIDE"}</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{guide.readTime}</span>
        </div>

        <h1 style={{
          fontFamily: "Outfit", fontWeight: 800,
          fontSize: mob ? 28 : tab ? 34 : 42,
          lineHeight: 1.15, color: "#0f172a", margin: "0 0 14px",
        }}>{guide.hero.h1}</h1>

        <p style={{
          fontSize: mob ? 16 : 18, lineHeight: 1.6, color: "#475569",
          margin: "0 0 20px", maxWidth: 640,
        }}>{guide.hero.subtitle}</p>

        <AuthorByline author={author} factChecker={factChecker} updatedDate={guide.updatedDate} />
      </section>

      {/* ══════ TABLE OF CONTENTS ══════ */}
      <section style={cn}>
        <div style={{
          background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0",
          padding: mob ? "16px 16px" : "20px 24px", marginBottom: mob ? 24 : 36,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            Contents
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {guide.sections.filter(s => s.title).map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  fontSize: 14, color: "#2563eb", textDecoration: "none",
                  padding: "4px 0", fontWeight: 500,
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono'", fontWeight: 700, width: 20 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </a>
            ))}
            {guide.faq && guide.faq.length > 0 && (
              <a href="#faq" style={{ fontSize: 14, color: "#2563eb", textDecoration: "none", padding: "4px 0", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono'", fontWeight: 700, width: 20 }}>
                  {String(guide.sections.filter(s => s.title).length + 1).padStart(2, "0")}
                </span>
                Frequently Asked Questions
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ══════ CONTENT SECTIONS ══════ */}
      <article style={cn}>
        {guide.sections.map((section) => (
          <section key={section.id} id={section.id} style={{ marginBottom: mob ? 28 : 40 }}>
            {section.title && (
              <h2 style={{
                fontFamily: "Outfit", fontWeight: 800,
                fontSize: mob ? 20 : 26, color: "#0f172a",
                margin: "0 0 16px", lineHeight: 1.25,
              }}>{section.title}</h2>
            )}

            {(section.paragraphs || []).map((p, i) => (
              <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "#334155", margin: "0 0 16px" }}>
                {renderLinkedText(p, slug, linkedUrls, lp)}
              </p>
            ))}

            {section.list && (
              <ul style={{ margin: "0 0 16px", paddingLeft: 20 }}>
                {section.list.map((item, i) => (
                  <li key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "#334155", marginBottom: 6 }}>{item}</li>
                ))}
              </ul>
            )}

            {section.numberedList && (
              <ol style={{ margin: "0 0 16px", paddingLeft: 20 }}>
                {section.numberedList.map((item, i) => (
                  <li key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "#334155", marginBottom: 6 }}>{item}</li>
                ))}
              </ol>
            )}

            {section.tip && (
              <div style={{
                background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12,
                padding: mob ? "14px 16px" : "16px 20px", margin: "16px 0",
              }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#059669", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  {section.tip.icon || <Icon name="lightbulb" size={16} color="#f59e0b" />} {section.tip.title || "Pro Tip"}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#166534", margin: 0 }}>{section.tip.text}</p>
              </div>
            )}

            {section.warning && (
              <div style={{
                background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 12,
                padding: mob ? "14px 16px" : "16px 20px", margin: "16px 0",
              }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#92400e", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="alert-triangle" size={16} color="#d97706" /> Warning
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#78350f", margin: 0 }}>{section.warning}</p>
              </div>
            )}

            {section.table && (
              <div style={{ overflowX: "auto", margin: "16px 0" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr>
                      {section.table.headers.map((h, i) => (
                        <th key={i} style={{
                          textAlign: "left", padding: "10px 14px",
                          background: "#f1f5f9", fontWeight: 700, color: "#0f172a",
                          borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} style={{
                            padding: "10px 14px",
                            borderBottom: "1px solid #f1f5f9",
                            color: "#334155",
                          }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.comparisonCards && (
              <div style={{
                display: "grid",
                gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
                gap: 16, margin: "16px 0",
              }}>
                {section.comparisonCards.map((card, ci) => (
                  <div key={ci} style={{
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: mob ? 16 : 20,
                  }}>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, color: "#0f172a", marginBottom: 10 }}>
                      {card.title}
                    </div>
                    {card.description && <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 10 }}>{card.description}</p>}
                    {card.pros && (
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 4 }}>PROS</div>
                        {card.pros.map((p, pi) => <div key={pi} style={{ fontSize: 13, color: "#334155", padding: "2px 0", display: "flex", alignItems: "center", gap: 6 }}><CircleCheck size={14} color="#059669" style={{ flexShrink: 0 }} /> {p}</div>)}
                      </div>
                    )}
                    {card.cons && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>CONS</div>
                        {card.cons.map((c, ci2) => <div key={ci2} style={{ fontSize: 13, color: "#334155", padding: "2px 0", display: "flex", alignItems: "center", gap: 6 }}><CircleX size={14} color="#dc2626" style={{ flexShrink: 0 }} /> {c}</div>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* ══════ INLINE CTA ══════ */}
        {guide.relatedRankings && guide.relatedRankings.length > 0 && (
          <div style={{
            background: "linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius: 16,
            padding: mob ? "24px 18px" : "32px 32px", marginBottom: mob ? 28 : 40,
            textAlign: "center",
          }}>
            <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#fff", marginBottom: 8 }}>
              Ready to Find Your Broker?
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginBottom: 20 }}>
              Browse our expert-tested broker rankings, updated quarterly with real money accounts.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {guide.relatedRankings.map((r, i) => (
                <Link key={i} to={lp(r.path)} style={{
                  padding: "10px 20px", borderRadius: 10,
                  background: i === 0 ? "linear-gradient(135deg,#059669,#34d399)" : "rgba(255,255,255,0.1)",
                  color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
                  border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.2)",
                }}>{r.label} {"\u2192"}</Link>
              ))}
            </div>
          </div>
        )}

        {/* ══════ FAQ ══════ */}
        {guide.faq && guide.faq.length > 0 && (
          <section id="faq" style={{ marginBottom: mob ? 28 : 40 }}>
            <h2 style={{
              fontFamily: "Outfit", fontWeight: 800,
              fontSize: mob ? 20 : 26, color: "#0f172a", margin: "0 0 16px",
            }}>Frequently Asked Questions</h2>
            <Accordion items={guide.faq} expanded={openFaq} setExpanded={setOpenFaq} />
          </section>
        )}

        {/* ══════ RELATED GUIDES ══════ */}
        {related.length > 0 && (
          <section style={{ marginBottom: mob ? 28 : 40 }}>
            <h2 style={{
              fontFamily: "Outfit", fontWeight: 800,
              fontSize: mob ? 18 : 22, color: "#0f172a", margin: "0 0 16px",
            }}>Related Guides</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
              gap: 12,
            }}>
              {related.map((rg) => (
                <Link key={rg.slug} to={lp(`/guide/${rg.slug}`)} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: mob ? "12px 14px" : "14px 18px",
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
                  textDecoration: "none", color: "#1e293b",
                  transition: "box-shadow 0.2s",
                }}>
                  <span style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: `${rg.hero?.badgeTextColor || "#059669"}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>{rg.hero?.icon || "\uD83D\uDCDA"}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{rg.hero?.h1 || rg.slug}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{rg.readTime}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ══════ AUTHOR BIO ══════ */}
        <section style={{ marginBottom: mob ? 28 : 40 }}>
          <AuthorBioCard author={author} />
        </section>

        {/* ══════ DISCLOSURE ══════ */}
        <div style={{
          background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0",
          padding: mob ? 16 : 20, marginBottom: mob ? 28 : 40,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
            Risk Disclosure
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: "#64748b", margin: 0 }}>
            CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between 62% and 82% of retail investor accounts lose money when trading CFDs. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
          </p>
        </div>
      </article>
    </div>
  );
}
