import { Link } from "react-router-dom";
import { Linkedin, Shield } from "lucide-react";
import { useLocalePath } from "../i18n/useLocalePath";
import AuthorAvatar from "./AuthorAvatar";
import AuthorHoverCard from "./AuthorHoverCard";

function InlineCredit({ label, author, onDark, isFactChecker }) {
  const lp = useLocalePath();
  const nameColor = onDark ? "#fff" : "#111827";
  const labelColor = onDark ? "rgba(255,255,255,0.6)" : "#1f2937";
  const shieldColor = onDark ? "#6ee7b7" : "#059669";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
      {isFactChecker && <Shield size={14} color={shieldColor} style={{ flexShrink: 0 }} />}
      <span style={{ fontSize: 13, color: labelColor }}>{label}</span>
      <AuthorHoverCard author={author} onDark={onDark}>
        <Link
          to={lp(`/author/${author.id}`)}
          style={{
            fontSize: 13, fontWeight: 700, color: nameColor,
            textDecoration: "none",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
          onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
        >{author.name}</Link>
      </AuthorHoverCard>
      {author.linkedin && (
        <a
          href={author.linkedin}
          target="_blank"
          rel="noopener"
          aria-label={`${author.name} on LinkedIn`}
          style={{
            width: 16, height: 16, borderRadius: 3,
            background: onDark ? "rgba(10,102,194,0.8)" : "#0A66C2",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Linkedin size={9} color="#fff" strokeWidth={0} fill="#fff" />
        </a>
      )}
    </span>
  );
}

function Dot({ onDark }) {
  return (
    <span style={{
      color: onDark ? "rgba(255,255,255,0.3)" : "#cbd5e1",
      fontSize: 13,
      margin: "0 2px",
      userSelect: "none",
    }}>&middot;</span>
  );
}

export default function AuthorCredits({ author, editor, reviewer, factChecker, updatedDate, variant = "default" }) {
  if (!author) return null;

  const onDark = variant === "onDark";
  const centered = variant === "centered";
  const dateColor = onDark ? "rgba(255,255,255,0.55)" : "#1f2937";

  const credits = [];
  credits.push({ label: "Written by", author, isFactChecker: false });
  if (editor) credits.push({ label: "Edited by", author: editor, isFactChecker: false });
  if (factChecker) credits.push({ label: "Fact-checked by", author: factChecker, isFactChecker: true });
  if (reviewer) credits.push({ label: "Reviewed by", author: reviewer, isFactChecker: false });

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      flexWrap: "wrap", marginTop: 8,
      justifyContent: centered ? "center" : "flex-start",
    }}>
      {/* Writer avatar 24px */}
      <AuthorAvatar author={author} size={24} />

      {/* Credits inline */}
      {credits.map((c, i) => (
        <span key={c.author.id + c.label} style={{ display: "inline-flex", alignItems: "center" }}>
          <InlineCredit
            label={c.label}
            author={c.author}
            onDark={onDark}
            isFactChecker={c.isFactChecker}
          />
          {(i < credits.length - 1 || updatedDate) && <Dot onDark={onDark} />}
        </span>
      ))}

      {/* Updated date */}
      {updatedDate && (
        <span style={{ fontSize: 13, color: dateColor, whiteSpace: "nowrap" }}>
          Updated {updatedDate}
        </span>
      )}
    </div>
  );
}
