import { useState } from "react";

/**
 * RegulatorLogo — displays financial regulator identity.
 *
 * @param {string}  slug     — regulator slug (fca, asic, cysec, etc.)
 * @param {string}  name     — regulator abbreviation (FCA, ASIC, etc.)
 * @param {string}  fullName — full regulator name (optional, shown in pill mode)
 * @param {number}  size     — height in px (default 36)
 * @param {string}  shape    — "icon" (shield logo only) | "pill" (logo + name) | "badge" (compact shield + abbr)
 * @param {number}  tier     — 1, 2, or 3 (for badge color coding, optional)
 */
export default function RegulatorLogo({ slug, name, fullName, size = 36, shape = "icon", tier }) {
  const [err, setErr] = useState(false);

  const r = Math.round(size / 4);
  const src = `${import.meta.env.BASE_URL}regulators/${slug}.svg`;

  // Tier color mapping
  const tierColors = {
    1: { bg: "#ecfdf5", border: "#a7f3d0", text: "#059669" },
    2: { bg: "#fffbeb", border: "#fde68a", text: "#d97706" },
    3: { bg: "#fef2f2", border: "#fecaca", text: "#dc2626" },
  };
  const tc = tierColors[tier] || tierColors[1];

  // Fallback: abbreviation on shield-shaped bg
  const renderFallback = (w, h, br) => (
    <div style={{
      width: w, height: h, borderRadius: br, flexShrink: 0,
      background: "linear-gradient(135deg,#003087,#0052CC)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Outfit", fontWeight: 800,
      fontSize: Math.max(9, Math.round(h * 0.3)),
      color: "#fff",
    }}>
      {name || slug?.toUpperCase()?.slice(0, 4) || "?"}
    </div>
  );

  // Icon mode — shield logo only
  if (shape === "icon") {
    if (err || !slug) return renderFallback(size, size, r);
    return (
      <img
        src={src}
        alt={`${name || slug} logo`}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setErr(true)}
        style={{
          width: size, height: size, borderRadius: r, flexShrink: 0,
          objectFit: "contain",
        }}
      />
    );
  }

  // Badge mode — compact: shield + abbreviation
  if (shape === "badge") {
    const iconH = Math.round(size * 0.65);
    const badgeFontSize = Math.max(10, Math.round(size * 0.32));

    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.12),
        height: size, padding: `0 ${Math.round(size * 0.2)}px`,
        background: tc.bg, border: `1px solid ${tc.border}`,
        borderRadius: Math.round(size / 3), flexShrink: 0,
      }}>
        {(!err && slug) ? (
          <img
            src={src}
            alt={`${name || slug} logo`}
            width={iconH}
            height={iconH}
            loading="lazy"
            onError={() => setErr(true)}
            style={{
              width: iconH, height: iconH, borderRadius: Math.round(iconH / 4),
              flexShrink: 0, objectFit: "contain",
            }}
          />
        ) : renderFallback(iconH, iconH, Math.round(iconH / 4))}
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, fontSize: badgeFontSize,
          color: tc.text, whiteSpace: "nowrap",
        }}>
          {name || slug?.toUpperCase()}
        </span>
      </div>
    );
  }

  // Pill mode — logo + full name
  const iconH = Math.round(size * 0.72);
  const iconR = Math.round(iconH / 4);
  const gap = Math.round(size * 0.15);
  const px = Math.round(size * 0.18);
  const fontSize = Math.max(12, Math.min(16, Math.round(size * 0.34)));

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap,
      height: size, padding: `0 ${px}px`,
      background: "#fff", border: "1px solid #e8ecf1",
      borderRadius: r, flexShrink: 0, overflow: "hidden",
    }}>
      {(!err && slug) ? (
        <img
          src={src}
          alt={`${name || slug} logo`}
          width={iconH}
          height={iconH}
          loading="lazy"
          onError={() => setErr(true)}
          style={{
            width: iconH, height: iconH, borderRadius: iconR, flexShrink: 0,
            objectFit: "contain",
          }}
        />
      ) : renderFallback(iconH, iconH, iconR)}
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700, fontSize,
        color: "#111827",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        lineHeight: 1.1, letterSpacing: "-0.01em",
      }}>
        {fullName || name || slug}
      </span>
    </div>
  );
}
