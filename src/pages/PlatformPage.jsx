import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import { getPlatformBySlug, getAllPlatforms } from "../data/platforms/index";
import { getAllBrokersWithData } from "../data/brokers/index";
import { AUTHORS, getFactChecker, getReviewerForAuthor, getEditor } from "../data/authors";
import BrokerRankCard from "../components/BrokerRankCard";
import Accordion from "../components/Accordion";
import AuthorCredits from "../components/AuthorCredits";
import AuthorBioCard from "../components/AuthorBioCard";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import Icon, { ArrowRight, Check, X as XIcon, ExternalLink } from "../components/Icon";
import PlatformLogo from "../components/PlatformLogo";
import HeroBand from "../components/HeroBand";
import { Lightbulb, AlertTriangle } from "lucide-react";

function Card({ children, style = {} }) {
  return <div style={{ background: "#fff", border: "1px solid #e8ecf1", borderRadius: 12, padding: "22px", marginBottom: 16, ...style }}>{children}</div>;
}

export default function PlatformPage() {
  const { slug } = useParams();
  const platform = getPlatformBySlug(slug);
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const [openFaq, setOpenFaq] = useState(null);
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // SEO: title, meta, JSON-LD
  useEffect(() => {
    if (!platform) return;

    document.title = platform.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", platform.meta.description);

    const authorA = AUTHORS[platform.author] || AUTHORS["marcus-chen"];
    const authorJsonLd = {
      "@type": "Person",
      name: authorA.name,
      jobTitle: authorA.role,
      url: authorA.linkedin,
      sameAs: [authorA.linkedin],
      ...(authorA.credentials?.length ? {
        hasCredential: authorA.credentials.map(c => ({
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Professional Certification",
          name: c,
        })),
      } : {}),
      ...(authorA.specialty ? { knowsAbout: authorA.specialty.split(", ") } : {}),
      ...(authorA.image ? { image: `https://ratedbrokers.com${authorA.image}` } : {}),
    };
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: platform.platformName,
        applicationCategory: "FinanceApplication",
        operatingSystem: platform.quickFacts.operatingSystems,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: platform.meta.description,
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: platform.hero.h1,
        description: platform.meta.description,
        datePublished: "2026-01-20",
        dateModified: "2026-02-28",
        author: authorJsonLd,
        publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: (platform.faq || []).map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      breadcrumbSchema([
        { label: "RatedBrokers", path: "/" },
        { label: platform.platformName, path: `/platform/${slug}` },
      ]),
    ];

    let scriptEl = document.querySelector(`script[data-jsonld="platform-${slug}"]`);
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-jsonld", `platform-${slug}`);
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemas);

    return () => {
      const el = document.querySelector(`script[data-jsonld="platform-${slug}"]`);
      if (el) el.remove();
    };
  }, [platform, slug]);

  // Not found
  if (!platform) {
    return (
      <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh", padding: "80px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 12 }}>Platform Not Found</h1>
        <p style={{ color: "#1f2937", marginBottom: 24 }}>The trading platform you're looking for doesn't exist in our database.</p>
        <Link to={lp("/")} style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Back to Home</Link>
      </div>
    );
  }

  const author = AUTHORS[platform.author] || AUTHORS["marcus-chen"];
  const editor = getEditor();
  const factChecker = getFactChecker(author.id);
  const reviewer = getReviewerForAuthor(author.id);

  // Get brokers that support this platform
  const allBrokers = getAllBrokersWithData();
  const platformBrokers = allBrokers
    .filter((b) => b.B.platforms.includes(platform.platformName))
    .sort((a, b) => b.B.score - a.B.score);

  // Related platforms
  const allPlatforms = getAllPlatforms();
  const related = (platform.relatedPlatforms || [])
    .map((s) => allPlatforms.find((p) => p.slug === s))
    .filter(Boolean);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#111827", minHeight: "100vh" }}>

      {/* ══════ BREADCRUMBS ══════ */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf1", padding: mob ? "10px 0" : "12px 0" }}>
        <div style={cn}>
          <Breadcrumb items={[
            { label: "RatedBrokers", path: "/" },
            { label: platform.platformName },
          ]} />
        </div>
      </div>

      {/* ══════ HERO ══════ */}
      <HeroBand mob={mob} tab={tab} compact>
        <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ background: "#fff", borderRadius: 10, padding: 4, display: "inline-flex" }}>
            <PlatformLogo slug={slug} name={platform.platformName} size={mob ? 36 : 48} shape="icon" />
          </div>
          <span style={{
            display: "inline-block", padding: "4px 10px", borderRadius: 6,
            background: "rgba(52,211,153,0.15)", color: "#34d399",
            fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
          }}>{platform.hero.badge}</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{platform.readTime}</span>
        </div>
        <h1 style={{
          fontFamily: "Outfit", fontWeight: 800,
          fontSize: mob ? 26 : tab ? 32 : 40,
          lineHeight: 1.15, color: "#fff", margin: "0 0 14px",
        }}>{platform.hero.h1}</h1>
        <p style={{
          fontSize: mob ? 15 : 17, lineHeight: 1.6, color: "rgba(255,255,255,0.7)",
          margin: "0 0 20px", maxWidth: 700,
        }}>{platform.hero.subtitle}</p>
        <AuthorCredits author={author} editor={editor} factChecker={factChecker} reviewer={reviewer} updatedDate={platform.updatedDate} onDark />
      </HeroBand>

      {/* ══════ MAIN LAYOUT: content + sidebar ══════ */}
      <div style={{
        ...cn,
        display: mob ? "flex" : "grid",
        flexDirection: "column",
        gridTemplateColumns: mob ? "1fr" : "1fr 300px",
        gap: mob ? 16 : 28,
        paddingTop: mob ? 20 : 28,
        paddingBottom: mob ? 40 : 64,
      }}>
        {/* ── Main Content ── */}
        <main>
          {/* ══════ CONTENT SECTIONS ══════ */}
          {platform.sections.map((section) => (
            <section key={section.id} id={section.id} style={{ marginBottom: mob ? 28 : 40, scrollMarginTop: 80 }}>
              {section.title && (
                <h2 style={{
                  fontFamily: "Outfit", fontWeight: 800,
                  fontSize: mob ? 20 : 26, color: "#0f172a",
                  margin: "0 0 16px", lineHeight: 1.25,
                }}>{section.title}</h2>
              )}

              {(section.paragraphs || []).map((p, i) => (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", margin: "0 0 16px" }}>{p}</p>
              ))}

              {section.list && (
                <ul style={{ margin: "0 0 16px", paddingLeft: 20 }}>
                  {section.list.map((item, i) => (
                    <li key={i} style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", marginBottom: 6 }}>{item}</li>
                  ))}
                </ul>
              )}

              {(section.paragraphs2 || []).map((p, i) => (
                <p key={`p2-${i}`} style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", margin: "0 0 16px" }}>{p}</p>
              ))}

              {section.tip && (
                <div style={{
                  background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12,
                  padding: mob ? "14px 16px" : "16px 20px", margin: "16px 0",
                }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#059669", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <Lightbulb size={16} /> {section.tip.title || "Pro Tip"}
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "#166534", margin: 0 }}>{section.tip.text}</p>
                </div>
              )}

              {section.warning && (
                <div style={{
                  background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 12,
                  padding: mob ? "14px 16px" : "16px 20px", margin: "16px 0",
                }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#92400e", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertTriangle size={16} /> Warning
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "#78350f", margin: 0 }}>{section.warning}</p>
                </div>
              )}
            </section>
          ))}

          {/* ══════ SPECS TABLE ══════ */}
          <section id="specifications" style={{ marginBottom: mob ? 28 : 40, scrollMarginTop: 80 }}>
            <h2 style={{
              fontFamily: "Outfit", fontWeight: 800,
              fontSize: mob ? 20 : 26, color: "#0f172a",
              margin: "0 0 16px", lineHeight: 1.25,
            }}>Technical Specifications</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                <thead>
                  <tr>
                    {platform.specs.headers.map((h, i) => (
                      <th key={i} style={{
                        textAlign: "left", padding: "10px 14px",
                        background: "#f1f5f9", fontWeight: 700, color: "#0f172a",
                        borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {platform.specs.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{
                          padding: "10px 14px",
                          borderBottom: "1px solid #f1f5f9",
                          color: ci === 0 ? "#111827" : "#1f2937",
                          fontWeight: ci === 0 ? 600 : 400,
                        }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ══════ PROS & CONS ══════ */}
          <section id="pros-cons" style={{ marginBottom: mob ? 28 : 40, scrollMarginTop: 80 }}>
            <h2 style={{
              fontFamily: "Outfit", fontWeight: 800,
              fontSize: mob ? 20 : 26, color: "#0f172a",
              margin: "0 0 16px", lineHeight: 1.25,
            }}>Pros & Cons</h2>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14 }}>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "20px" }}>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#059669", marginBottom: 12 }}>Pros</div>
                {platform.pros.map((p, i) => (
                  <div key={i} style={{ fontSize: 14, color: "#111827", marginBottom: 8, paddingLeft: 16, position: "relative", lineHeight: 1.5 }}>
                    <span style={{ position: "absolute", left: 0, color: "#059669" }}><Check size={14} /></span>{p}
                  </div>
                ))}
              </div>
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "20px" }}>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#dc2626", marginBottom: 12 }}>Cons</div>
                {platform.cons.map((c, i) => (
                  <div key={i} style={{ fontSize: 14, color: "#111827", marginBottom: 8, paddingLeft: 16, position: "relative", lineHeight: 1.5 }}>
                    <span style={{ position: "absolute", left: 0, color: "#dc2626" }}><XIcon size={14} /></span>{c}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════ BROKERS USING PLATFORM ══════ */}
          <section id="brokers" style={{ marginBottom: mob ? 28 : 40, scrollMarginTop: 80 }}>
            <h2 style={{
              fontFamily: "Outfit", fontWeight: 800,
              fontSize: mob ? 20 : 26, color: "#0f172a",
              margin: "0 0 16px", lineHeight: 1.25,
            }}>Best Brokers Using {platform.platformName}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", margin: "0 0 20px" }}>
              We analyzed {platformBrokers.length} brokers that offer {platform.platformName}. Here are the top-rated ones, sorted by our expert score. All brokers are independently researched and scored.
            </p>
            {platformBrokers.length === 0 ? (
              <p style={{ fontSize: 16, color: "#1f2937" }}>No brokers in our database currently offer {platform.platformName}.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: mob ? 12 : 14 }}>
                {platformBrokers.map((b, i) => (
                  <BrokerRankCard key={b.slug} broker={b} rank={i + 1} />
                ))}
              </div>
            )}
          </section>

          {/* ══════ CTA BANNER ══════ */}
          <div style={{
            background: "linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius: 16,
            padding: mob ? "24px 18px" : "32px 32px", marginBottom: mob ? 28 : 40,
            textAlign: "center",
          }}>
            <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#fff", marginBottom: 8 }}>
              Find the Best {platform.platformName} Broker
            </div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", marginBottom: 20 }}>
              Compare {platformBrokers.length} {platform.platformName} brokers by spreads, fees, and regulation in our expert-tested ranking.
            </p>
            <Link to={lp(platform.rankingSlug)} style={{
              display: "inline-block", padding: "12px 28px", borderRadius: 10,
              background: "linear-gradient(135deg,#059669,#34d399)",
              color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none",
            }}>View Full Ranking <ArrowRight size={16} style={{ display: "inline", verticalAlign: "middle" }} /></Link>
          </div>

          {/* ══════ FAQ ══════ */}
          {platform.faq && platform.faq.length > 0 && (
            <section id="faq" style={{ marginBottom: mob ? 28 : 40, scrollMarginTop: 80 }}>
              <h2 style={{
                fontFamily: "Outfit", fontWeight: 800,
                fontSize: mob ? 20 : 26, color: "#0f172a", margin: "0 0 16px",
              }}>Frequently Asked Questions</h2>
              <Accordion items={platform.faq} expanded={openFaq} setExpanded={setOpenFaq} />
            </section>
          )}

          {/* ══════ RELATED PLATFORMS ══════ */}
          {related.length > 0 && (
            <section style={{ marginBottom: mob ? 28 : 40 }}>
              <h2 style={{
                fontFamily: "Outfit", fontWeight: 800,
                fontSize: mob ? 18 : 22, color: "#0f172a", margin: "0 0 16px",
              }}>Other Trading Platforms</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: mob ? "1fr" : `repeat(${Math.min(related.length, 3)}, 1fr)`,
                gap: 12,
              }}>
                {related.map((rp) => (
                  <Link key={rp.slug} to={lp(`/platform/${rp.slug}`)} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: mob ? "12px 14px" : "14px 18px",
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
                    textDecoration: "none", color: "#111827",
                    transition: "box-shadow 0.2s",
                  }}>
                    <PlatformLogo slug={rp.slug} name={rp.platformName} size={36} shape="icon" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{rp.platformName}</div>
                      <div style={{ fontSize: 13, color: "#1f2937" }}>{rp.readTime}</div>
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

          {/* ══════ RISK DISCLOSURE ══════ */}
          <div style={{
            background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0",
            padding: mob ? 16 : 20, marginBottom: mob ? 28 : 40,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              Risk Disclosure
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#1f2937", margin: 0 }}>
              CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between 62% and 82% of retail investor accounts lose money when trading CFDs. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
            </p>
          </div>
        </main>

        {/* ── Sidebar (desktop) ── */}
        {!mob && (
          <aside>
            <div style={{ position: "sticky", top: 70, display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Quick Facts */}
              <Card style={{ padding: "20px" }}>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, marginBottom: 14, color: "#0f172a" }}>Quick Facts</div>
                {[
                  { l: "Developer", v: platform.quickFacts.developer },
                  { l: "Released", v: platform.quickFacts.released },
                  { l: "Version", v: platform.quickFacts.latestVersion },
                  { l: "Languages", v: platform.quickFacts.languages },
                  { l: "Scripting", v: platform.quickFacts.programmingLang },
                  { l: "License", v: platform.quickFacts.license },
                  { l: "OS", v: platform.quickFacts.operatingSystems },
                ].map((x, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 6 ? "1px solid #f0f4f8" : "none" }}>
                    <span style={{ fontSize: 14, color: "#1f2937" }}>{x.l}</span>
                    <span style={{ fontSize: 14, color: "#111827", fontWeight: 600, textAlign: "right", maxWidth: "55%" }}>{x.v}</span>
                  </div>
                ))}
                <a href={platform.quickFacts.website} target="_blank" rel="noopener noreferrer" style={{
                  display: "block", textAlign: "center", marginTop: 14,
                  padding: "10px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  background: "#eff6ff", color: "#2563eb", textDecoration: "none",
                  border: "1px solid #bfdbfe",
                }}>Official Website <ExternalLink size={13} style={{ display: "inline", verticalAlign: "middle" }} /></a>
              </Card>

              {/* Related Rankings */}
              {platform.relatedRankings && platform.relatedRankings.length > 0 && (
                <Card style={{ padding: "16px" }}>
                  <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, marginBottom: 10, color: "#0f172a" }}>Related Rankings</div>
                  {platform.relatedRankings.map((r, i) => (
                    <Link key={i} to={lp(r.path)} style={{
                      display: "block", padding: "7px 8px", borderRadius: 6,
                      fontSize: 14, fontWeight: 500, color: "#2563eb",
                      textDecoration: "none", transition: "background 0.15s",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    ><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{r.label} <ArrowRight size={14} /></span></Link>
                  ))}
                </Card>
              )}

              {/* Other Platforms */}
              {related.length > 0 && (
                <Card style={{ padding: "16px" }}>
                  <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, marginBottom: 10, color: "#0f172a" }}>Other Platforms</div>
                  {related.map((rp, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < related.length - 1 ? "1px solid #f0f4f8" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <PlatformLogo slug={rp.slug} name={rp.platformName} size={22} shape="icon" />
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{rp.platformName}</span>
                      </div>
                      <Link to={lp(`/platform/${rp.slug}`)} style={{ fontSize: 12, color: "#1e3a5f", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}>View <ArrowRight size={11} /></Link>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
