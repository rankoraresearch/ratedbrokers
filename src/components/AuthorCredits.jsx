import { Link } from "react-router-dom";
import { Linkedin, Shield } from "lucide-react";
import { useLocalePath } from "../i18n/useLocalePath";
import { useMedia } from "../hooks/useMedia";
import AuthorAvatar from "./AuthorAvatar";
import AuthorHoverCard from "./AuthorHoverCard";

function CreditItem({ label, author, onDark, isFactChecker, showAvatar }) {
  const lp = useLocalePath();
  const nameColor = onDark ? "#fff" : "#111827";
  const labelColor = onDark ? "rgba(255,255,255,0.55)" : "#6b7280";
  const shieldColor = onDark ? "#6ee7b7" : "#059669";
  const underlineColor = onDark ? "rgba(255,255,255,0.3)" : "#cbd5e1";
  const liIconBg = onDark ? "rgba(10,102,194,0.7)" : "#0A66C2";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {showAvatar && <AuthorAvatar author={author} size={28} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Role label */}
        <span style={{
          fontSize: 10, fontWeight: 600, textTransform: "uppercase",
          letterSpacing: "0.06em", color: labelColor, lineHeight: 1,
          display: "flex", alignItems: "center", gap: 3,
        }}>
          {isFactChecker && <Shield size={10} color={shieldColor} />}
          {label}
        </span>
        {/* Name + LinkedIn */}
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <AuthorHoverCard author={author}>
            <Link
              to={lp(`/author/${author.id}`)}
              style={{
                fontSize: 13, fontWeight: 700, color: nameColor,
                textDecoration: "none",
                borderBottom: `1px dotted ${underlineColor}`,
                paddingBottom: 1,
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderBottomStyle = "solid"; e.currentTarget.style.borderBottomColor = nameColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderBottomStyle = "dotted"; e.currentTarget.style.borderBottomColor = underlineColor; }}
            >{author.name}</Link>
          </AuthorHoverCard>
          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener"
              aria-label={`${author.name} on LinkedIn`}
              style={{
                width: 15, height: 15, borderRadius: 3,
                background: liIconBg,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, opacity: 0.85, transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            >
              <Linkedin size={9} color="#fff" strokeWidth={0} fill="#fff" />
            </a>
          )}
        </span>
      </div>
    </div>
  );
}

function Separator({ onDark }) {
  return (
    <div style={{
      width: 1, height: 28, alignSelf: "center",
      background: onDark ? "rgba(255,255,255,0.15)" : "#e2e8f0",
      flexShrink: 0,
    }} />
  );
}

export default function AuthorCredits({ author, editor, reviewer, factChecker, updatedDate, variant = "default", onDark: onDarkProp, compact }) {
  const { mob } = useMedia();
  if (!author) return null;

  const onDark = onDarkProp || variant === "onDark";
  const centered = variant === "centered";
  const useMobileLayout = mob || compact;
  const dateColor = onDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const borderColor = onDark ? "rgba(255,255,255,0.1)" : "#e8ecf1";
  const bgColor = onDark ? "rgba(255,255,255,0.04)" : "rgba(248,249,251,0.6)";

  const credits = [];
  credits.push({ label: "Written by", author, isFactChecker: false, showAvatar: true });
  if (editor) credits.push({ label: "Edited by", author: editor, isFactChecker: false, showAvatar: false });
  if (factChecker) credits.push({ label: "Fact-checked by", author: factChecker, isFactChecker: true, showAvatar: false });
  if (reviewer) credits.push({ label: "Reviewed by", author: reviewer, isFactChecker: false, showAvatar: false });

  // Mobile / compact: 2×2 grid
  if (useMobileLayout) {
    return (
      <div style={{
        marginTop: 12, padding: "12px 14px", borderRadius: 10,
        background: bgColor, border: `1px solid ${borderColor}`,
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "10px 16px",
        }}>
          {credits.map((c) => (
            <CreditItem key={c.author.id + c.label} {...c} onDark={onDark} />
          ))}
        </div>
        {updatedDate && (
          <div style={{
            fontSize: 12, color: dateColor, marginTop: 8,
            paddingTop: 8, borderTop: `1px solid ${borderColor}`,
            textAlign: "center",
          }}>
            Updated {updatedDate}
          </div>
        )}
      </div>
    );
  }

  // Desktop / Tablet: horizontal bar with separators
  return (
    <div style={{
      marginTop: 12, padding: "10px 18px", borderRadius: 10,
      background: bgColor, border: `1px solid ${borderColor}`,
      display: "inline-flex", alignItems: "center", gap: 16,
      flexWrap: "wrap",
      justifyContent: centered ? "center" : "flex-start",
    }}>
      {credits.map((c, i) => (
        <span key={c.author.id + c.label} style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
          <CreditItem {...c} onDark={onDark} />
          {i < credits.length - 1 && <Separator onDark={onDark} />}
        </span>
      ))}
      {updatedDate && (
        <>
          <Separator onDark={onDark} />
          <span style={{ fontSize: 12, color: dateColor, whiteSpace: "nowrap" }}>
            Updated {updatedDate}
          </span>
        </>
      )}
    </div>
  );
}
