import { Link } from "react-router-dom";
import { Linkedin, Shield, Target } from "lucide-react";
import { useLocalePath } from "../i18n/useLocalePath";
import AuthorAvatar from "./AuthorAvatar";

export default function AuthorBioCard({ author }) {
  const lp = useLocalePath();
  if (!author) return null;

  const expNum = parseInt(author.exp) || 0;
  const stats = [
    { value: expNum, label: "yrs exp", color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
    { value: `${author.reviews}+`, label: "reviews", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  ];
  if (author.credentials?.length) {
    stats.push({
      value: author.credentials[0],
      label: "cert",
      color: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ddd6fe",
    });
  }

  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
      overflow: "hidden",
    }}>
      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 24px",
        background: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
        borderBottom: "1px solid #a7f3d0",
      }}>
        <Shield size={14} color="#059669" />
        <span style={{
          fontSize: 12, fontWeight: 700, color: "#065f46",
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>Verified Expert Author</span>
      </div>

      <div style={{ padding: "24px 28px" }}>
        {/* Avatar + Name */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <AuthorAvatar author={author} size={72} showVerified />
          <div>
            <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 19, color: "#0f172a" }}>
              {author.name}
            </div>
            <div style={{ fontSize: 15, color: "#475569" }}>{author.role}</div>
          </div>
        </div>

        {/* Stat boxes */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 12, marginBottom: 20 }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              textAlign: "center", padding: "14px 8px",
              borderRadius: 10, background: s.bg,
              border: `1px solid ${s.border}`,
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
                fontSize: 20, color: s.color, lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                fontSize: 12, color: s.color, fontWeight: 600,
                textTransform: "uppercase", marginTop: 4,
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#334155", margin: "0 0 14px" }}>
          {author.bio}
        </p>

        {/* Specialty */}
        {author.specialty && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 14, color: "#475569", marginBottom: 20,
          }}>
            <Target size={14} color="#059669" />
            <span><strong style={{ color: "#1e293b" }}>Specialty:</strong> {author.specialty}</span>
          </div>
        )}

        {/* View Full Profile */}
        <Link
          to={lp(`/author/${author.id}`)}
          style={{
            display: "block", textAlign: "center", padding: "12px 20px",
            borderRadius: 10, marginBottom: 10,
            background: "#f1f5f9", color: "#1e293b",
            fontSize: 15, fontWeight: 700, textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#e2e8f0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
        >
          View Full Profile &rarr;
        </Link>

        {/* LinkedIn CTA full-width */}
        <a
          href={author.linkedin}
          target="_blank"
          rel="noopener"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", padding: "14px 20px", borderRadius: 10,
            background: "#0A66C2", color: "#fff",
            fontSize: 15, fontWeight: 700, textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#0856a0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0A66C2"; }}
        >
          <span style={{
            width: 22, height: 22, borderRadius: 4,
            background: "rgba(255,255,255,0.2)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <Linkedin size={14} color="#fff" strokeWidth={0} fill="#fff" />
          </span>
          Connect on LinkedIn
          <span style={{ marginLeft: "auto", opacity: 0.7 }}>&rarr;</span>
        </a>
      </div>
    </div>
  );
}
