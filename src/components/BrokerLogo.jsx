import { useState } from "react";

export default function BrokerLogo({ slug, name, fallback, size = 48, borderRadius, variant = "blue", shape = "square" }) {
  const [err, setErr] = useState(false);
  const isWide = shape === "wide";
  const w = isWide ? Math.round(size * 2) : size;
  const h = size;
  const r = borderRadius ?? Math.round(Math.min(w, h) / 4);

  if (err || !slug) {
    const fbText = fallback || (isWide ? name?.slice(0, 5) : name?.slice(0, 2)) || "?";
    return (
      <div style={{
        width: w, height: h, borderRadius: r, flexShrink: 0,
        background: variant === "gray" ? "#f1f5f9" : "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
        border: variant === "gray" ? "1px solid #e2e8f0" : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Outfit", fontWeight: 800,
        fontSize: Math.max(10, Math.round(h * 0.28)),
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
      width={w}
      height={h}
      loading="lazy"
      onError={() => setErr(true)}
      style={{
        width: w, height: h, borderRadius: r, flexShrink: 0,
        objectFit: "contain", background: "#fff", border: "1px solid #e8ecf1",
      }}
    />
  );
}
