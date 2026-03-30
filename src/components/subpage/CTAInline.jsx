import { ExternalLink, Zap } from "lucide-react";

const NAVY = "#0f172a";
const ORANGE = "#f59e0b";

export default function CTAInline({ slug, name, promo, label, sub, mob }) {
  const vUrl = `${import.meta.env.VITE_API_URL || ''}/go/${slug}`;
  return (
    <div style={{ background: NAVY, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: mob ? "16px" : "18px 24px", display: "flex", alignItems: mob ? "stretch" : "center", flexDirection: mob ? "column" : "row", justifyContent: "space-between", gap: mob ? 12 : 16, margin: "24px 0" }}>
      <div>
        {sub && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{sub}</div>}
        {promo && <div style={{ fontSize: 14, color: "#34d399", fontWeight: 600, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><Zap size={14} color={ORANGE} /> {promo}</div>}
      </div>
      <a href={vUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{ background: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, color: NAVY, fontSize: 14, fontWeight: 700, textDecoration: "none", padding: "12px 28px", borderRadius: 8, boxShadow: "0 2px 8px rgba(245,158,11,0.3)", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", flexShrink: 0, justifyContent: "center" }}>
        {label || `Visit ${name}`} <ExternalLink size={14} />
      </a>
    </div>
  );
}
