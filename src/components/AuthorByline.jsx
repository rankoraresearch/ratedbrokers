import { Link } from "react-router-dom";
import { Linkedin, Shield } from "lucide-react";
import { useLocalePath } from "../i18n/useLocalePath";
import AuthorAvatar from "./AuthorAvatar";
import AuthorHoverCard from "./AuthorHoverCard";

export default function AuthorByline({ author, editor, factChecker, reviewer, updatedDate, variant = "default" }) {
  const lp = useLocalePath();
  if (!author) return null;

  const onDark = variant === "onDark";
  const centered = variant === "centered";

  const textColor = onDark ? "rgba(255,255,255,0.7)" : "#1f2937";
  const nameColor = onDark ? "#fff" : "#111827";

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
            <AuthorHoverCard author={author} onDark={onDark}>
              <Link
                to={lp(`/author/${author.id}`)}
                style={{
                  fontFamily: "Outfit", fontWeight: 700, fontSize: 16,
                  color: nameColor, textDecoration: "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
              >{author.name}</Link>
            </AuthorHoverCard>
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
          <div style={{ fontSize: 14, color: textColor }}>{author.role}</div>

          {/* Trust pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
            {author.exp && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: onDark ? "rgba(16,185,129,0.15)" : "#ecfdf5",
                color: onDark ? "#6ee7b7" : "#059669",
                border: `1px solid ${onDark ? "rgba(16,185,129,0.25)" : "#a7f3d0"}`,
              }}>{author.exp}</span>
            )}
            {author.reviews && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: onDark ? "rgba(59,130,246,0.15)" : "#eff6ff",
                color: onDark ? "#93c5fd" : "#2563eb",
                border: `1px solid ${onDark ? "rgba(59,130,246,0.25)" : "#bfdbfe"}`,
              }}>{author.reviews} reviews</span>
            )}
            {(author.credentials || []).map((c) => (
              <span key={c} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: onDark ? "rgba(139,92,246,0.15)" : "#f5f3ff",
                color: onDark ? "#c4b5fd" : "#7c3aed",
                border: `1px solid ${onDark ? "rgba(139,92,246,0.25)" : "#ddd6fe"}`,
              }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary credits + date */}
      {(editor || factChecker || reviewer || updatedDate) && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 13, color: textColor,
          paddingLeft: centered ? 0 : 60,
          flexWrap: "wrap",
        }}>
          {editor && (
            <>
              <span>Edited by </span>
              <AuthorHoverCard author={editor} onDark={onDark}>
                <Link to={lp(`/author/${editor.id}`)} style={{ color: nameColor, fontWeight: 600, textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                >{editor.name}</Link>
              </AuthorHoverCard>
              <span style={{ color: onDark ? "rgba(255,255,255,0.3)" : "#cbd5e1" }}>&middot;</span>
            </>
          )}
          {factChecker && (
            <>
              <Shield size={13} color={onDark ? "#6ee7b7" : "#059669"} />
              <span>Fact-checked by </span>
              <AuthorHoverCard author={factChecker} onDark={onDark}>
                <Link to={lp(`/author/${factChecker.id}`)} style={{ color: nameColor, fontWeight: 600, textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                >{factChecker.name}</Link>
              </AuthorHoverCard>
              <span style={{ color: onDark ? "rgba(255,255,255,0.3)" : "#cbd5e1" }}>&middot;</span>
            </>
          )}
          {reviewer && (
            <>
              <span>Reviewed by </span>
              <AuthorHoverCard author={reviewer} onDark={onDark}>
                <Link to={lp(`/author/${reviewer.id}`)} style={{ color: nameColor, fontWeight: 600, textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                >{reviewer.name}</Link>
              </AuthorHoverCard>
            </>
          )}
          {updatedDate && (
            <>
              {(editor || factChecker || reviewer) && (
                <span style={{ color: onDark ? "rgba(255,255,255,0.3)" : "#cbd5e1" }}>&middot;</span>
              )}
              <span>Updated {updatedDate}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
