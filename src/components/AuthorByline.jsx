import { Linkedin, Shield } from "lucide-react";
import AuthorAvatar from "./AuthorAvatar";

export default function AuthorByline({ author, factChecker, updatedDate, variant = "default" }) {
  if (!author) return null;

  const onDark = variant === "onDark";
  const centered = variant === "centered";

  const textColor = onDark ? "rgba(255,255,255,0.7)" : "#64748b";
  const nameColor = onDark ? "#fff" : "#1e293b";
  const pillBorder = onDark ? "rgba(255,255,255,0.15)" : "#e2e8f0";

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 8, marginTop: 8,
      alignItems: centered ? "center" : "flex-start",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {/* Avatar 48px */}
        <AuthorAvatar author={author} size={48} showVerified />

        {/* Name + Role + LinkedIn */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener"
              style={{
                fontFamily: "Outfit", fontWeight: 700, fontSize: 15,
                color: nameColor, textDecoration: "none",
              }}
            >{author.name}</a>
            {/* LinkedIn button */}
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener"
              aria-label={`${author.name} on LinkedIn`}
              style={{
                width: 28, height: 28, borderRadius: 6,
                background: "#0A66C2",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                textDecoration: "none", flexShrink: 0,
              }}
            >
              <Linkedin size={16} color="#fff" strokeWidth={0} fill="#fff" />
            </a>
          </div>
          <div style={{ fontSize: 13, color: textColor }}>{author.role}</div>

          {/* Trust pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
            {author.exp && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600,
                background: onDark ? "rgba(16,185,129,0.15)" : "#ecfdf5",
                color: onDark ? "#6ee7b7" : "#059669",
                border: `1px solid ${onDark ? "rgba(16,185,129,0.25)" : "#a7f3d0"}`,
              }}>{author.exp}</span>
            )}
            {author.reviews && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600,
                background: onDark ? "rgba(59,130,246,0.15)" : "#eff6ff",
                color: onDark ? "#93c5fd" : "#2563eb",
                border: `1px solid ${onDark ? "rgba(59,130,246,0.25)" : "#bfdbfe"}`,
              }}>{author.reviews} reviews</span>
            )}
            {(author.credentials || []).map((c) => (
              <span key={c} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600,
                background: onDark ? "rgba(139,92,246,0.15)" : "#f5f3ff",
                color: onDark ? "#c4b5fd" : "#7c3aed",
                border: `1px solid ${onDark ? "rgba(139,92,246,0.25)" : "#ddd6fe"}`,
              }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Fact-checker + updated date */}
      {(factChecker || updatedDate) && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, color: textColor,
          paddingLeft: centered ? 0 : 60,
          flexWrap: "wrap",
        }}>
          {factChecker && (
            <>
              <Shield size={13} color={onDark ? "#6ee7b7" : "#059669"} />
              <span>Fact-checked by </span>
              <a
                href={factChecker.linkedin}
                target="_blank"
                rel="noopener"
                style={{ color: nameColor, fontWeight: 600, textDecoration: "none" }}
              >{factChecker.name}</a>
            </>
          )}
          {factChecker && updatedDate && (
            <span style={{ color: onDark ? "rgba(255,255,255,0.3)" : "#cbd5e1" }}>&middot;</span>
          )}
          {updatedDate && <span>Updated {updatedDate}</span>}
        </div>
      )}
    </div>
  );
}
