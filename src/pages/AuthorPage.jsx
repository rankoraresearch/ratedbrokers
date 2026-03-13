import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Linkedin, Target, ArrowRight } from "lucide-react";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import { AUTHORS, RANKING_CATEGORY_AUTHORS, getReviewerForAuthor, getFactChecker } from "../data/authors";
import RANKINGS from "../data/rankings";
import AuthorAvatar from "../components/AuthorAvatar";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";

export default function AuthorPage() {
  const { slug } = useParams();
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const author = AUTHORS[slug];

  useEffect(() => {
    if (!author) return;
    document.title = `${author.name} — ${author.role} | RatedBrokers`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `${author.name} is a ${author.role} at RatedBrokers with ${author.exp} of experience. ${author.specialty}.`);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
      url: `https://ratedbrokers.com/author/${author.id}`,
      sameAs: [author.linkedin],
      worksFor: { "@type": "Organization", name: "RatedBrokers" },
    };

    let scriptEl = document.querySelector('script[data-jsonld="author"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-jsonld", "author");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);

    return () => {
      const el = document.querySelector('script[data-jsonld="author"]');
      if (el) el.remove();
    };
  }, [author]);

  if (!author) return <Navigate to="/" replace />;

  // Рейтинги, которые ведёт этот автор
  const authorRankings = RANKINGS.filter((r) => {
    return RANKING_CATEGORY_AUTHORS[r.category] === author.id;
  }).slice(0, 12);

  const reviewer = getReviewerForAuthor(author.id);
  const factChecker = getFactChecker(author.id);
  const expNum = parseInt(author.exp) || 0;

  const stats = [
    { value: expNum, label: "Years Experience", color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
    { value: `${author.reviews}+`, label: "Reviews", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  ];
  if (author.credentials?.length) {
    stats.push({ value: author.credentials[0], label: "Certification", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" });
  }

  const crumbs = [
    { label: "Home", path: "/" },
    { label: "Our Experts", path: null },
    { label: author.name },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
        padding: mob ? "28px 16px 32px" : "40px 24px 48px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Breadcrumb items={crumbs} variant="onDark" />

          <div style={{
            display: "flex", flexDirection: mob ? "column" : "row",
            alignItems: mob ? "center" : "flex-start", gap: mob ? 16 : 28,
            marginTop: 24,
          }}>
            <AuthorAvatar author={author} size={mob ? 100 : 120} showVerified />

            <div style={{ textAlign: mob ? "center" : "left" }}>
              <h1 style={{
                fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 26 : 34,
                color: "#fff", margin: "0 0 4px",
              }}>{author.name}</h1>
              <div style={{ fontSize: 16, color: "#34d399", fontWeight: 600, marginBottom: 8 }}>
                {author.role}
              </div>
              {author.credentials?.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: mob ? "center" : "flex-start", marginBottom: 12 }}>
                  {author.credentials.map((c) => (
                    <span key={c} style={{
                      padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                      background: "rgba(139,92,246,0.15)", color: "#c4b5fd",
                      border: "1px solid rgba(139,92,246,0.25)",
                    }}>{c}</span>
                  ))}
                </div>
              )}
              <a
                href={author.linkedin}
                target="_blank"
                rel="noopener"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "8px 18px", borderRadius: 8,
                  background: "#0A66C2", color: "#fff",
                  fontSize: 14, fontWeight: 700, textDecoration: "none",
                }}
              >
                <Linkedin size={16} color="#fff" strokeWidth={0} fill="#fff" />
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: mob ? "24px 16px" : "32px 24px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 12,
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              textAlign: "center", padding: "18px 12px", borderRadius: 12,
              background: "#fff", border: `1px solid ${s.border}`,
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
                fontSize: 24, color: s.color, lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                fontSize: 13, color: s.color, fontWeight: 600,
                textTransform: "uppercase", marginTop: 6,
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bio + Specialty */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: mob ? "0 16px 24px" : "0 24px 32px" }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: mob ? "24px 20px" : "32px 36px",
          border: "1px solid #e2e8f0",
        }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 12, color: "#0f172a" }}>
            About {author.name}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", margin: "0 0 16px" }}>
            {author.bio}
          </p>
          {author.specialty && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: "#1f2937" }}>
              <Target size={16} color="#059669" />
              <span><strong style={{ color: "#111827" }}>Specialty:</strong> {author.specialty}</span>
            </div>
          )}
        </div>
      </section>

      {/* Peer review info */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: mob ? "0 16px 24px" : "0 24px 32px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12,
        }}>
          {reviewer && (
            <div style={{
              background: "#fff", borderRadius: 12, padding: "16px 20px",
              border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12,
            }}>
              <AuthorAvatar author={reviewer} size={40} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#1f2937", letterSpacing: "0.05em" }}>Reviewed By</div>
                <Link to={lp(`/author/${reviewer.id}`)} style={{ fontSize: 15, fontWeight: 700, color: "#111827", textDecoration: "none" }}>
                  {reviewer.name}
                </Link>
              </div>
            </div>
          )}
          {factChecker && (
            <div style={{
              background: "#fff", borderRadius: 12, padding: "16px 20px",
              border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12,
            }}>
              <AuthorAvatar author={factChecker} size={40} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#1f2937", letterSpacing: "0.05em" }}>Fact Checked By</div>
                <Link to={lp(`/author/${factChecker.id}`)} style={{ fontSize: 15, fontWeight: 700, color: "#111827", textDecoration: "none" }}>
                  {factChecker.name}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Articles by this author */}
      {authorRankings.length > 0 && (
        <section style={{ maxWidth: 800, margin: "0 auto", padding: mob ? "0 16px 40px" : "0 24px 48px" }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 16, color: "#0f172a" }}>
            Articles by {author.name}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 10 }}>
            {authorRankings.map((r) => (
              <Link key={r.id} to={lp(r.slug)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "14px 16px", borderRadius: 10,
                background: "#fff", border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#111827",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a7f3d0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <span style={{ fontSize: 18 }}>{r.icon}</span>
                <span style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>{r.title}</span>
                <ArrowRight size={14} color="#374151" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
