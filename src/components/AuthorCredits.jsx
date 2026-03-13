import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { useLocalePath } from "../i18n/useLocalePath";
import { useMedia } from "../hooks/useMedia";
import AuthorAvatar from "./AuthorAvatar";
import AuthorHoverCard from "./AuthorHoverCard";

function CreditColumn({ label, author, onDark }) {
  const lp = useLocalePath();
  const nameColor = onDark ? "#fff" : "#1e293b";
  const labelColor = onDark ? "rgba(255,255,255,0.6)" : "#64748b";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{
        fontSize: 12, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.06em", color: labelColor,
      }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <AuthorAvatar author={author} size={32} />
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <AuthorHoverCard author={author} onDark={onDark}>
            <Link
              to={lp(`/author/${author.id}`)}
              style={{
                fontSize: 14, fontWeight: 700, color: nameColor,
                textDecoration: "none",
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
              width: 18, height: 18, borderRadius: 3,
              background: "#0A66C2",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Linkedin size={10} color="#fff" strokeWidth={0} fill="#fff" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AuthorCredits({ author, editor, reviewer, factChecker, updatedDate, variant = "default" }) {
  const { mob, tab } = useMedia();
  if (!author) return null;

  const onDark = variant === "onDark";
  const centered = variant === "centered";
  const dateColor = onDark ? "rgba(255,255,255,0.55)" : "#64748b";

  // 4 cols desktop, 2x2 tablet, 1 col mobile
  const cols = mob ? "1fr" : tab ? "repeat(2, auto)" : "repeat(4, auto)";

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 10, marginTop: 8,
      alignItems: centered ? "center" : "flex-start",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: cols,
        gap: mob ? 12 : tab ? "12px 28px" : 24,
      }}>
        <CreditColumn label="Written By" author={author} onDark={onDark} />
        {editor && <CreditColumn label="Edited By" author={editor} onDark={onDark} />}
        {factChecker && <CreditColumn label="Fact-Checked By" author={factChecker} onDark={onDark} />}
        {reviewer && <CreditColumn label="Reviewed By" author={reviewer} onDark={onDark} />}
      </div>
      {updatedDate && (
        <span style={{ fontSize: 13, color: dateColor }}>
          Updated {updatedDate}
        </span>
      )}
    </div>
  );
}
