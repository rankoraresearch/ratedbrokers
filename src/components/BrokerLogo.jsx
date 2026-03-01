import { useState } from "react";

export default function BrokerLogo({ slug, name, fallback, size = 48, borderRadius, variant = "blue" }) {
  const [err, setErr] = useState(false);
  const r = borderRadius ?? Math.round(size / 4);

  if (err || !slug) {
    return (
      <div style={{
        width: size, height: size, borderRadius: r, flexShrink: 0,
        background: variant === "gray" ? "#f1f5f9" : "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
        border: variant === "gray" ? "1px solid #e2e8f0" : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Outfit", fontWeight: 800,
        fontSize: Math.max(10, Math.round(size * 0.28)),
        color: variant === "gray" ? "#1e3a5f" : "#fff",
      }}>
        {fallback || name?.slice(0, 2) || "?"}
      </div>
    );
  }

  return (
    <img
      src={`/logos/${slug}.png`}
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
