import { useState } from "react";

/**
 * BrokerLogo — displays broker identity.
 *
 * Shapes:
 *   "brand"  — horizontal pill: icon + name text (default, recommended)
 *   "icon"   — square icon only (for tight spaces like sticky bars)
 *
 * @param {string}  slug        — broker slug for logo file lookup
 * @param {string}  name        — broker display name (shown as text in brand mode)
 * @param {string}  fallback    — short fallback text if no name
 * @param {number}  size        — height in px (default 48)
 * @param {number}  borderRadius — override border radius
 * @param {string}  variant     — "blue" (dark gradient) | "gray" (light) | "white"
 * @param {string}  shape       — "brand" | "icon" | "square" | "wide" (legacy)
 */
export default function BrokerLogo({ slug, name, fallback, size = 48, borderRadius, variant = "blue", shape = "brand" }) {
  const [err, setErr] = useState(false);

  // Legacy compat: map old shapes
  const mode = (shape === "wide" || shape === "brand") ? "brand" : "icon";

  const iconSize = mode === "brand" ? Math.round(size * 0.65) : size;
  const r = borderRadius ?? (mode === "brand" ? Math.round(size / 4) : Math.round(size / 4));
  const displayName = name || fallback || "?";

  // Icon-only mode (square)
  if (mode === "icon") {
    if (err || !slug) {
      const fbText = fallback || name?.slice(0, 2) || "?";
      return (
        <div style={{
          width: size, height: size, borderRadius: r, flexShrink: 0,
          background: variant === "gray" ? "#f1f5f9" : "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
          border: variant === "gray" ? "1px solid #e2e8f0" : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Outfit", fontWeight: 800,
          fontSize: Math.max(10, Math.round(size * 0.32)),
          color: variant === "gray" ? "#1e3a5f" : "#fff",
        }}>
          {fbText}
        </div>
      );
    }
    return (
      <img
        src={`${import.meta.env.BASE_URL}logos/${slug}.png`}
        alt={`${name} logo`}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setErr(true)}
        style={{
          width: size, height: size, borderRadius: r, flexShrink: 0,
          objectFit: "contain", background: "#fff", border: "1px solid #e8ecf1",
        }}
      />
    );
  }

  // Brand mode: icon + name in horizontal pill
  const bgColor = variant === "gray" ? "#f8fafc" : variant === "white" ? "#fff" : "#fff";
  const borderColor = variant === "gray" ? "#e2e8f0" : "#e8ecf1";
  const textColor = variant === "gray" ? "#334155" : "#1e293b";
  const fontSize = Math.max(11, Math.min(15, Math.round(size * 0.3)));
  const iconR = Math.round(iconSize / 4);
  const gap = Math.round(size * 0.15);
  const px = Math.round(size * 0.18);
  // Fixed width so all pills are identical regardless of name length
  const pillW = Math.round(size * 3.2);

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap,
      height: size, width: pillW, padding: `0 ${px}px`,
      background: bgColor, border: `1px solid ${borderColor}`,
      borderRadius: r, flexShrink: 0, overflow: "hidden",
    }}>
      {/* Icon */}
      {(!err && slug) ? (
        <img
          src={`${import.meta.env.BASE_URL}logos/${slug}.png`}
          alt={`${name} logo`}
          width={iconSize}
          height={iconSize}
          loading="lazy"
          onError={() => setErr(true)}
          style={{
            width: iconSize, height: iconSize, borderRadius: iconR, flexShrink: 0,
            objectFit: "contain",
          }}
        />
      ) : (
        <div style={{
          width: iconSize, height: iconSize, borderRadius: iconR, flexShrink: 0,
          background: "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Outfit", fontWeight: 800,
          fontSize: Math.max(8, Math.round(iconSize * 0.35)),
          color: "#fff",
        }}>
          {(fallback || name?.slice(0, 2) || "?")}
        </div>
      )}
      {/* Name */}
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700,
        fontSize,
        color: textColor,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: 1.1,
        letterSpacing: "-0.01em",
      }}>
        {displayName}
      </span>
    </div>
  );
}
