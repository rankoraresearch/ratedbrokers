import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { useLocalePath } from "../i18n/useLocalePath";
import AuthorAvatar from "./AuthorAvatar";

/**
 * AuthorHoverCard — popup card on hover over author name.
 * Shows: avatar, name, short bio, "See full bio" link, LinkedIn icon.
 * Arrow points up from the card.
 */
export default function AuthorHoverCard({ author, children, onDark = false }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState("below"); // "below" or "above"
  const triggerRef = useRef(null);
  const cardRef = useRef(null);
  const timerRef = useRef(null);
  const lp = useLocalePath();

  if (!author) return children;

  const handleEnter = () => {
    clearTimeout(timerRef.current);
    // Check if card fits below
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPos(spaceBelow < 220 ? "above" : "below");
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

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const arrowSize = 8;

  const cardStyle = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    ...(pos === "below"
      ? { top: "calc(100% + 10px)" }
      : { bottom: "calc(100% + 10px)" }),
    width: 300,
    padding: 16,
    background: "#fff",
    border: "1px solid #e4e4eb",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
    zIndex: 10000,
    display: show ? "grid" : "none",
    gap: 12,
  };

  const arrowStyle = {
    position: "absolute",
    left: "50%",
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
    left: "50%",
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

        {/* Header: Avatar + Name */}
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <AuthorAvatar author={author} size={40} />
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span style={{
              fontFamily: "Outfit", fontWeight: 700, fontSize: 15,
              color: "#1e293b", lineHeight: 1.2,
            }}>
              {author.name}
            </span>
            <span style={{ fontSize: 13, color: "#64748b", lineHeight: 1.3 }}>
              {author.role}
            </span>
          </span>
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

        {/* Footer: See full bio + LinkedIn */}
        <span style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <Link
            to={lp(`/author/${author.id}`)}
            style={{
              fontSize: 13, fontWeight: 700,
              color: "#1e3a5f", textDecoration: "underline",
            }}
          >
            See full bio
          </Link>
          <a
            href={author.linkedin}
            target="_blank"
            rel="noopener"
            aria-label={`${author.name} on LinkedIn`}
            style={{
              width: 22, height: 22, borderRadius: 4,
              background: "#0A66C2",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Linkedin size={13} color="#fff" strokeWidth={0} fill="#fff" />
          </a>
        </span>
      </span>
    </span>
  );
}
