import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { useLocalePath } from "../i18n/useLocalePath";
import AuthorAvatar from "./AuthorAvatar";

/* X (Twitter) icon */
function XIcon({ size = 13, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const CARD_W = 300;
const ARROW = 8;
const GAP = 10;

/**
 * AuthorHoverCard — Portal-based popup card on hover.
 * Renders in document.body to avoid overflow:hidden clipping.
 */
export default function AuthorHoverCard({ author, children }) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, arrowLeft: 0, pos: "below" });
  const triggerRef = useRef(null);
  const cardRef = useRef(null);
  const timerRef = useRef(null);
  const lp = useLocalePath();

  if (!author) return children;

  const calcPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Vertical: prefer below
    const spaceBelow = vh - rect.bottom;
    const pos = spaceBelow < 300 ? "above" : "below";
    const top = pos === "below"
      ? rect.bottom + scrollY + GAP
      : rect.top + scrollY - GAP; // cardRef will use bottom alignment

    // Horizontal: center on trigger, clamp to viewport
    let left = rect.left + scrollX + rect.width / 2 - CARD_W / 2;
    left = Math.max(8 + scrollX, Math.min(left, vw - CARD_W - 8 + scrollX));

    // Arrow points at trigger center
    const triggerCenterX = rect.left + scrollX + rect.width / 2;
    const arrowLeft = Math.max(20, Math.min(triggerCenterX - left, CARD_W - 20));

    setCoords({ top, left, arrowLeft, pos });
  }, []);

  const handleEnter = () => {
    clearTimeout(timerRef.current);
    calcPosition();
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

  // Recalc position on scroll/resize while visible
  useEffect(() => {
    if (!show) return;
    const update = () => calcPosition();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [show, calcPosition]);

  const { top, left, arrowLeft, pos } = coords;

  const cardStyle = {
    position: "absolute",
    top: pos === "below" ? top : undefined,
    bottom: pos === "above" ? undefined : undefined,
    left,
    width: CARD_W,
    padding: 16,
    background: "#fff",
    border: "1px solid #e4e4eb",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    zIndex: 10000,
    display: "grid",
    gap: 10,
  };

  // For "above" position, we need to place the card above the trigger
  if (pos === "above" && triggerRef.current) {
    // We'll measure card height after render, but use a reasonable estimate
    cardStyle.top = undefined;
    // Use a ref-based approach: position from top, then shift up by card height
    // For now, use transform
    const rect = triggerRef.current.getBoundingClientRect();
    cardStyle.top = rect.top + window.scrollY - GAP;
    cardStyle.transform = "translateY(-100%)";
  }

  const arrowBase = {
    position: "absolute",
    left: arrowLeft,
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
  };

  const arrowBorder = {
    ...arrowBase,
    ...(pos === "below"
      ? {
          top: -ARROW,
          borderLeft: `${ARROW}px solid transparent`,
          borderRight: `${ARROW}px solid transparent`,
          borderBottom: `${ARROW}px solid #e4e4eb`,
        }
      : {
          bottom: -ARROW,
          borderLeft: `${ARROW}px solid transparent`,
          borderRight: `${ARROW}px solid transparent`,
          borderTop: `${ARROW}px solid #e4e4eb`,
        }),
  };

  const arrowFill = {
    ...arrowBase,
    ...(pos === "below"
      ? {
          top: -(ARROW - 1),
          borderLeft: `${ARROW - 1}px solid transparent`,
          borderRight: `${ARROW - 1}px solid transparent`,
          borderBottom: `${ARROW - 1}px solid #fff`,
        }
      : {
          bottom: -(ARROW - 1),
          borderLeft: `${ARROW - 1}px solid transparent`,
          borderRight: `${ARROW - 1}px solid transparent`,
          borderTop: `${ARROW - 1}px solid #fff`,
        }),
    zIndex: 1,
  };

  const bio = author.shortBio || author.bio || "";

  const popup = show && createPortal(
    <div
      ref={cardRef}
      onMouseEnter={handleCardEnter}
      onMouseLeave={handleCardLeave}
      style={cardStyle}
      role="tooltip"
    >
      {/* Arrow */}
      <div style={arrowBorder} />
      <div style={arrowFill} />

      {/* Header: Avatar + Name + Role */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <AuthorAvatar author={author} size={40} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{
            fontFamily: "Outfit", fontWeight: 700, fontSize: 15,
            color: "#111827", lineHeight: 1.2,
          }}>
            {author.name}
          </span>
          <span style={{ fontSize: 13, color: "#1f2937", lineHeight: 1.3 }}>
            {author.role}
          </span>
        </div>
      </div>

      {/* Trust pills */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
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
      </div>

      {/* Short bio */}
      <div style={{
        fontSize: 13, lineHeight: 1.5,
        color: "#545454",
        overflow: "hidden",
        maxHeight: 60,
      }}>
        {bio}
      </div>

      {/* Footer: See full bio + social icons */}
      <div style={{
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
      </div>
    </div>,
    document.body
  );

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
    >
      {children}
      {popup}
    </span>
  );
}
