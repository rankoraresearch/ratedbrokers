import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Linkedin, Twitter, MapPin, ArrowRight, BookOpen, Award, ExternalLink, Mail } from "lucide-react";
import { useMedia } from "../hooks/useMedia";
import { AUTHORS } from "../data/authors";
import AuthorAvatar from "../components/AuthorAvatar";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import {
  OUTLET_STYLES, MEDIA_MENTIONS, ACTIVITY_FEED, MILESTONES,
  ROLE_LABEL, monthLabel, pageTypeLabel,
  getTrustNumbers, getManifesto,
} from "../data/authorActivity";

function OutletWordmark({ name, color = "#0f172a" }) {
  const style = OUTLET_STYLES[name] || { fontFamily: "Outfit", fontWeight: 800, fontSize: 17 };
  return (
    <span style={{ ...style, color, lineHeight: 1, whiteSpace: "nowrap", userSelect: "none" }}>
      {name}
    </span>
  );
}

export default function AuthorPage() {
  const { slug } = useParams();
  const { mob } = useMedia();
  const author = AUTHORS[slug];

  useEffect(() => {
    if (!author) return;
    document.title = `${author.name} — ${author.role} | RatedBrokers`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `${author.name} is a ${author.role} at RatedBrokers with ${author.exp} of experience. ${author.specialty || ""}`.trim());

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
      description: author.bio,
      url: `https://ratedbrokers.com/author/${author.id}`,
      sameAs: [author.linkedin, author.twitter].filter(Boolean),
      worksFor: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
      ...(author.image ? { image: `https://ratedbrokers.com${author.image}` } : {}),
      ...(author.credentials?.length ? {
        hasCredential: author.credentials.map(c => ({
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Professional Certification",
          name: c,
        })),
      } : {}),
      ...(author.specialty ? { knowsAbout: author.specialty.split(", ") } : {}),
      ...(author.exp ? { award: `${author.exp} of industry experience` } : {}),
    };

    let scriptEl = document.querySelector('script[data-jsonld="author"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-jsonld", "author");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);

    const bcSchema = breadcrumbSchema([
      { label: "RatedBrokers", path: "/" },
      { label: "Our Experts", path: "/about" },
      { label: author.name, path: `/author/${slug}` },
    ]);
    let bcEl = document.getElementById("breadcrumb-schema-author");
    if (!bcEl) { bcEl = document.createElement("script"); bcEl.id = "breadcrumb-schema-author"; bcEl.type = "application/ld+json"; document.head.appendChild(bcEl); }
    bcEl.textContent = JSON.stringify(bcSchema);

    return () => {
      const el = document.querySelector('script[data-jsonld="author"]');
      if (el) el.remove();
      const bc = document.getElementById("breadcrumb-schema-author");
      if (bc) bc.remove();
    };
  }, [author, slug]);

  if (!author) return <Navigate to="/" replace />;

  const mentions = MEDIA_MENTIONS[author.id] || [];
  const feed = ACTIVITY_FEED[author.id] || [];
  const milestones = MILESTONES[author.id] || [];
  const trust = getTrustNumbers(author, feed);
  const manifesto = getManifesto(author);

  const crumbs = [
    { label: "RatedBrokers", path: "/" },
    { label: "Our Experts", path: "/about" },
    { label: author.name },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Breadcrumbs */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={crumbs} />
      </div>

      {/* HERO — Premium Dark */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #064e3b 100%)",
        padding: mob ? "40px 16px 48px" : "64px 24px 72px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(255,255,255,0.02) 11px, rgba(255,255,255,0.02) 12px)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", display: "flex", gap: mob ? 20 : 40, flexDirection: mob ? "column" : "row", alignItems: mob ? "center" : "flex-start" }}>
          <AuthorAvatar author={author} size={mob ? 120 : 160} />
          <div style={{ flex: 1, textAlign: mob ? "center" : "left" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: "#f59e0b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
              {author.role}
            </div>
            <h1 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 32 : 44, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              {author.name}
            </h1>
            {manifesto && (
              <p style={{ fontSize: mob ? 16 : 19, color: "rgba(255,255,255,0.82)", lineHeight: 1.55, margin: "0 0 20px", maxWidth: 640, fontWeight: 300 }}>
                {author.isFounder ? manifesto : `"${manifesto}"`}
              </p>
            )}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: mob ? "center" : "flex-start" }}>
              {(author.credentials || []).map((c) => (
                <span key={c} style={{
                  padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: "0.05em",
                  background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
                }}>{c}</span>
              ))}
              {author.linkedin && (
                <a href={author.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                }}>
                  <Linkedin size={15} />
                </a>
              )}
              {author.twitter && (
                <a href={author.twitter} target="_blank" rel="noopener" aria-label="Twitter" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                }}>
                  <Twitter size={15} />
                </a>
              )}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.6)", marginLeft: 6 }}>
                <MapPin size={13} /> {author.isFounder ? "Global" : "London, UK"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST RIBBON */}
      <section style={{ background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "16px" : "18px 24px" }}>
          <div style={{ display: "flex", gap: mob ? 12 : 32, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            {trust.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 15 : 18, fontWeight: 700, color: "#fff" }}>{t.num}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: mob ? "40px 16px 32px" : "64px 24px 40px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 24, color: "#0f172a", margin: "0 0 20px" }}>
          About {author.name.split(" ")[0]}
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: "#1f2937", margin: "0 0 16px" }}>
          {author.bio}
        </p>
        {author.specialty && (
          <div style={{ fontSize: 14, color: "#475569", paddingTop: 16, borderTop: "1px solid #e2e8f0", marginTop: 24 }}>
            <span style={{ fontWeight: 700, color: "#0f172a" }}>Areas: </span>
            {author.specialty}
          </div>
        )}
      </section>

      {/* MEDIA COVERAGE — quote cards with inline outlet wordmarks */}
      {mentions.length > 0 && (
        <section style={{ background: "#f8fafc", padding: mob ? "40px 16px" : "56px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#f59e0b", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
              As Featured In
            </div>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 26 : 30, color: "#0f172a", margin: "0 0 28px", letterSpacing: "-0.02em" }}>
              Media Coverage
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : `repeat(${Math.min(mentions.length, 3)}, 1fr)`, gap: 14 }}>
              {mentions.map((m, i) => (
                <a key={i} href={m.url} target="_blank" rel="noopener" style={{
                  display: "block", padding: mob ? "24px 22px" : "28px 26px",
                  background: "#fff", borderRadius: 14,
                  border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit",
                  transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                >
                  <div style={{
                    height: 36, display: "flex", alignItems: "center",
                    paddingBottom: 18, marginBottom: 18,
                    borderBottom: "1px solid #f1f5f9",
                  }}>
                    <OutletWordmark name={m.outlet} color="#0f172a" />
                  </div>
                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                    {m.date}
                  </div>
                  <div style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 16, color: "#0f172a", lineHeight: 1.35, marginBottom: 12, letterSpacing: "-0.01em" }}>
                    {m.title}
                  </div>
                  <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                    {m.quote}
                  </p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#059669", fontWeight: 600, marginTop: 16 }}>
                    Read the article <ExternalLink size={11} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EDITORIAL ACTIVITY / PLATFORM MILESTONES */}
      {author.isFounder
        ? <MilestonesSection milestones={milestones} mob={mob} />
        : <ActivityFeedSection feed={feed} authorName={author.name} mob={mob} />
      }

      {/* CTA */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "8px 16px 48px" : "16px 24px 72px" }}>
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #064e3b 100%)", borderRadius: 16, padding: mob ? "24px 20px" : "32px 40px", display: "flex", flexDirection: mob ? "column" : "row", alignItems: mob ? "flex-start" : "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#fbbf24", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
              Get in touch
            </div>
            <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 22, color: "#fff", margin: 0 }}>
              Have a question for {author.name.split(" ")[0]}?
            </h3>
          </div>
          <a href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px",
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
            borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}>
            <Mail size={16} /> Ask the team
          </a>
        </div>
      </section>
    </div>
  );
}

// ─── ActivityFeedSection — editorial timeline ──

function ActivityFeedSection({ feed, authorName, mob }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? feed : feed.filter(f => f.role === filter);

  const months = [];
  filtered.forEach(item => {
    const monthKey = item.isoDate.slice(0, 7);
    let group = months.find(g => g.key === monthKey);
    if (!group) {
      group = { key: monthKey, label: monthLabel(monthKey), items: [] };
      months.push(group);
    }
    group.items.push(item);
  });

  const filters = [
    { key: "all",          label: "All",          count: feed.length },
    { key: "writer",       label: "Wrote",        count: feed.filter(f => f.role === "writer").length },
    { key: "reviewer",     label: "Reviewed",     count: feed.filter(f => f.role === "reviewer").length },
    { key: "fact-checker", label: "Fact-checked", count: feed.filter(f => f.role === "fact-checker").length },
  ];
  const firstName = authorName.split(" ")[0];

  return (
    <section style={{ maxWidth: 920, margin: "0 auto", padding: mob ? "40px 16px 24px" : "64px 24px 32px" }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#f59e0b", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
        Recent Activity
      </div>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 26 : 30, color: "#0f172a", margin: "0 0 28px", letterSpacing: "-0.02em" }}>
        Editorial work by {firstName}
      </h2>

      {feed.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 14, borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
          No editorial activity logged yet.
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: mob ? 18 : 28, borderBottom: "1px solid #e2e8f0", marginBottom: 8, overflowX: "auto" }}>
            {filters.map(f => {
              const active = filter === f.key;
              return (
                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                  padding: "12px 0", marginBottom: -1,
                  borderTop: "none", borderLeft: "none", borderRight: "none",
                  borderBottom: active ? "2px solid #f59e0b" : "2px solid transparent",
                  background: "transparent",
                  color: active ? "#0f172a" : "#64748b",
                  fontWeight: active ? 700 : 500,
                  fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                  whiteSpace: "nowrap", transition: "color 0.15s",
                }}>
                  {f.label}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: active ? "#94a3b8" : "#cbd5e1", marginLeft: 6, fontWeight: 500 }}>
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
              No editorial actions in this category yet.
            </div>
          ) : (
            months.map(month => (
              <div key={month.key} style={{ marginTop: 28 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  marginBottom: 6, paddingBottom: 6,
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#475569", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                    {month.label}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#cbd5e1", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {month.items.length} {month.items.length === 1 ? "action" : "actions"}
                  </div>
                </div>

                {month.items.map((item, i) => (
                  <a key={`${month.key}-${i}`} href={item.slug} className="d2k-row" style={{
                    display: "grid",
                    gridTemplateColumns: mob ? "60px 1fr 14px" : "76px 1fr 132px 14px",
                    gap: mob ? 14 : 20, alignItems: "center",
                    padding: mob ? "16px 0" : "18px 0",
                    borderTop: "1px solid #f1f5f9",
                    borderBottom: i === month.items.length - 1 ? "1px solid #f1f5f9" : "none",
                    textDecoration: "none", color: "inherit", background: "transparent",
                  }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 500, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {item.date}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: mob ? 16 : 17, color: "#0f172a", lineHeight: 1.3, marginBottom: 3, letterSpacing: "-0.01em" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span>{pageTypeLabel(item.type)}</span>
                        {mob && (
                          <>
                            <span style={{ color: "#e2e8f0" }}>·</span>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                              {ROLE_LABEL[item.role]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {!mob && (
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right" }}>
                        {ROLE_LABEL[item.role]}
                      </span>
                    )}
                    <ArrowRight className="d2k-arrow" size={14} color="#cbd5e1" />
                  </a>
                ))}
              </div>
            ))
          )}
        </>
      )}
    </section>
  );
}

// ─── MilestonesSection (founder) ──

function MilestonesSection({ milestones, mob }) {
  return (
    <section style={{ maxWidth: 920, margin: "0 auto", padding: mob ? "40px 16px 24px" : "64px 24px 32px" }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#f59e0b", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
        Platform
      </div>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 26 : 30, color: "#0f172a", margin: "0 0 24px", letterSpacing: "-0.02em" }}>
        Platform milestones
      </h2>
      <div style={{ background: "#fff", borderRadius: 14, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        {milestones.map((m, i) => (
          <div key={i} style={{
            display: "flex", gap: 20, padding: mob ? "16px" : "20px 24px",
            borderBottom: i === milestones.length - 1 ? "none" : "1px solid rgba(0,0,0,0.05)",
            alignItems: "flex-start",
          }}>
            <div style={{ flexShrink: 0, width: mob ? 80 : 100, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: "#059669", letterSpacing: "0.05em", paddingTop: 3 }}>
              {m.date}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 4 }}>{m.title}</div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.55 }}>{m.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
