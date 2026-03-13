import { useState } from "react";

/**
 * PlatformLogo — displays trading platform identity.
 *
 * @param {string}  slug     — platform slug (metatrader-4, metatrader-5, ctrader, tradingview)
 * @param {string}  name     — platform display name
 * @param {number}  size     — height in px (default 40)
 * @param {string}  shape    — "icon" (square logo only) | "pill" (logo + name in horizontal pill)
 * @param {string}  variant  — "default" | "light" (lighter bg for pill mode)
 */
export default function PlatformLogo({ slug, name, size = 40, shape = "icon", variant = "default" }) {
  const [err, setErr] = useState(false);

  const r = Math.round(size / 4);
  const src = `${import.meta.env.BASE_URL}platforms/${slug}.svg`;

  // Fallback: initials on gradient
  const renderFallback = (w, h, br) => {
    const abbr = name
      ? name.replace(/MetaTrader\s*/i, "MT").replace(/TradingView/i, "TV").slice(0, 3)
      : slug?.slice(0, 2).toUpperCase() || "?";
    return (
      <div style={{
        width: w, height: h, borderRadius: br, flexShrink: 0,
        background: "linear-gradient(135deg,#1565C0,#42A5F5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Outfit", fontWeight: 800,
        fontSize: Math.max(10, Math.round(h * 0.32)),
        color: "#fff",
      }}>
        {abbr}
      </div>
    );
  };

  // Icon-only mode
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

  // Pill mode: logo + name
  const iconH = Math.round(size * 0.72);
  const iconR = Math.round(iconH / 4);
  const gap = Math.round(size * 0.18);
  const px = Math.round(size * 0.2);
  const fontSize = Math.max(12, Math.min(16, Math.round(size * 0.34)));
  const isLight = variant === "light";

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap,
      height: size, padding: `0 ${px}px`,
      background: isLight ? "#f8fafc" : "#fff",
      border: `1px solid ${isLight ? "#e2e8f0" : "#e8ecf1"}`,
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
        color: isLight ? "#334155" : "#1e293b",
        whiteSpace: "nowrap", lineHeight: 1.1,
        letterSpacing: "-0.01em",
      }}>
        {name || slug}
      </span>
    </div>
  );
}
