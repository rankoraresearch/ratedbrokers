import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { useLocalePath } from "../i18n/useLocalePath";
import { useMedia } from "../hooks/useMedia";
import AuthorAvatar from "./AuthorAvatar";

function CreditColumn({ label, author, onDark }) {
  const lp = useLocalePath();
  const nameColor = onDark ? "#fff" : "#1e293b";
  const labelColor = onDark ? "rgba(255,255,255,0.5)" : "#94a3b8";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.06em", color: labelColor,
      }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <AuthorAvatar author={author} size={36} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Link
            to={lp(`/author/${author.id}`)}
            style={{
              fontSize: 13, fontWeight: 700, color: nameColor,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
          >{author.name}</Link>
          <a
            href={author.linkedin}
            target="_blank"
            rel="noopener"
            aria-label={`${author.name} on LinkedIn`}
            style={{
              width: 20, height: 20, borderRadius: 4,
              background: "#0A66C2",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Linkedin size={12} color="#fff" strokeWidth={0} fill="#fff" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AuthorCredits({ author, reviewer, factChecker, updatedDate, variant = "default" }) {
  const { mob } = useMedia();
  if (!author) return null;

  const onDark = variant === "onDark";
  const centered = variant === "centered";
  const dateColor = onDark ? "rgba(255,255,255,0.4)" : "#94a3b8";

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 12, marginTop: 8,
      alignItems: centered ? "center" : "flex-start",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : "repeat(3, auto)",
        gap: mob ? 14 : 32,
      }}>
        <CreditColumn label="Written By" author={author} onDark={onDark} />
        {reviewer && <CreditColumn label="Reviewed By" author={reviewer} onDark={onDark} />}
        {factChecker && <CreditColumn label="Fact Checked By" author={factChecker} onDark={onDark} />}
      </div>
      {updatedDate && (
        <span style={{ fontSize: 12, color: dateColor }}>
          Updated {updatedDate}
        </span>
      )}
    </div>
  );
}
