import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { useLocalePath } from "../i18n/useLocalePath";
import AuthorAvatar from "./AuthorAvatar";

/* X (Twitter) icon — simple inline SVG */
function XIcon({ size = 13, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * AuthorHoverCard — popup card on hover over author name.
 * Shows: avatar, name, role, trust pills, short bio, footer with "See full bio" + LinkedIn + Twitter.
 */
export default function AuthorHoverCard({ author, children, onDark = false }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState("below");
  const [align, setAlign] = useState("center"); // "center", "left", "right"
  const triggerRef = useRef(null);
  const cardRef = useRef(null);
  const timerRef = useRef(null);
  const lp = useLocalePath();

  if (!author) return children;

  const handleEnter = () => {
    clearTimeout(timerRef.current);
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPos(spaceBelow < 280 ? "above" : "below");
      // Horizontal alignment — keep card on screen
      const centerX = rect.left + rect.width / 2;
      if (centerX < 170) setAlign("left");
      else if (window.innerWidth - centerX < 170) setAlign("right");
      else setAlign("center");
    }
    setShow(true);
  };

  const handleLeave = () => {
    timerRef.current = setTimeout(() => setShow(false), 150);
  };

  const handleCardEnter = () => {
    clearTimeout(timerRef.current);
  };

  const handleCardLeave = () => {
    timerRef.current = setTimeout(() => setShow(false), 100);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const arrowSize = 8;

  const alignStyles = align === "left"
    ? { left: 0, transform: "none" }
    : align === "right"
      ? { right: 0, transform: "none" }
      : { left: "50%", transform: "translateX(-50%)" };

  const cardStyle = {
    position: "absolute",
    ...alignStyles,
    ...(pos === "below"
      ? { top: "calc(100% + 10px)" }
      : { bottom: "calc(100% + 10px)" }),
    width: 300,
    padding: 16,
    background: "#fff",
    border: "1px solid #e4e4eb",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    zIndex: 10000,
    display: show ? "grid" : "none",
    gap: 10,
  };

  const arrowLeft = align === "left" ? "24px" : align === "right" ? "calc(100% - 24px)" : "50%";

  const arrowStyle = {
    position: "absolute",
    left: arrowLeft,
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    ...(pos === "below"
      ? {
          top: -arrowSize,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid #e4e4eb`,
        }
      : {
          bottom: -arrowSize,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid #e4e4eb`,
        }),
  };

  const arrowFillStyle = {
    position: "absolute",
    left: arrowLeft,
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    ...(pos === "below"
      ? {
          top: -(arrowSize - 1),
          borderLeft: `${arrowSize - 1}px solid transparent`,
          borderRight: `${arrowSize - 1}px solid transparent`,
          borderBottom: `${arrowSize - 1}px solid #fff`,
        }
      : {
          bottom: -(arrowSize - 1),
          borderLeft: `${arrowSize - 1}px solid transparent`,
          borderRight: `${arrowSize - 1}px solid transparent`,
          borderTop: `${arrowSize - 1}px solid #fff`,
        }),
    zIndex: 10001,
  };

  const bio = author.shortBio || author.bio || "";

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ position: "relative", display: "inline-block" }}
    >
      {children}

      {/* Popup card */}
      <span
        ref={cardRef}
        onMouseEnter={handleCardEnter}
        onMouseLeave={handleCardLeave}
        style={cardStyle}
        role="tooltip"
      >
        {/* Arrow */}
        <span style={arrowStyle} />
        <span style={arrowFillStyle} />

        {/* Header: Avatar + Name + Role */}
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <AuthorAvatar author={author} size={40} />
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span style={{
              fontFamily: "Outfit", fontWeight: 700, fontSize: 15,
              color: "#111827", lineHeight: 1.2,
            }}>
              {author.name}
            </span>
            <span style={{ fontSize: 13, color: "#1f2937", lineHeight: 1.3 }}>
              {author.role}
            </span>
          </span>
        </span>

        {/* Trust pills */}
        <span style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {author.exp && (
            <span style={{
              display: "inline-flex", alignItems: "center",
              padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600,
              background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
            }}>{author.exp}</span>
          )}
          {author.reviews && (
            <span style={{
              display: "inline-flex", alignItems: "center",
              padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600,
              background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe",
            }}>{author.reviews} reviews</span>
          )}
          {(author.credentials || []).map((c) => (
            <span key={c} style={{
              display: "inline-flex", alignItems: "center",
              padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600,
              background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe",
            }}>{c}</span>
          ))}
        </span>

        {/* Short bio */}
        <span style={{
          display: "block", fontSize: 13, lineHeight: 1.5,
          color: "#545454", margin: 0,
          overflow: "hidden",
          maxHeight: 60,
        }}>
          {bio}
        </span>

        {/* Footer: See full bio + social icons */}
        <span style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <Link
            to={lp(`/author/${author.id}`)}
            style={{
              fontSize: 13, fontWeight: 700,
              color: "#059669", textDecoration: "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
          >
            See full bio →
          </Link>
          <span style={{ display: "flex", gap: 6 }}>
            {author.linkedin && (
              <a
                href={author.linkedin}
                target="_blank"
                rel="noopener"
                aria-label={`${author.name} on LinkedIn`}
                style={{
                  width: 24, height: 24, borderRadius: 5,
                  background: "#0A66C2",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Linkedin size={13} color="#fff" strokeWidth={0} fill="#fff" />
              </a>
            )}
            {author.twitter && (
              <a
                href={author.twitter}
                target="_blank"
                rel="noopener"
                aria-label={`${author.name} on X`}
                style={{
                  width: 24, height: 24, borderRadius: 5,
                  background: "#000",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <XIcon size={12} color="#fff" />
              </a>
            )}
          </span>
        </span>
      </span>
    </span>
  );
}
