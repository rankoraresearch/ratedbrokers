import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight, Check, AlertTriangle } from "lucide-react";
import ScoreBadge from "../ScoreBadge";
import { Card } from "./Typography";
import { getVisitUrl } from "../../utils/visitUrl";

const NAVY = "#0f172a";
const GREEN = "#059669";
const ORANGE = "#f59e0b";

export default function VerdictBox({ slug, name, score, title, text, bestFor, notFor, mob }) {
  const vUrl = getVisitUrl(slug);
  return (
    <Card style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0f2e24 50%, #047857 100%)`, border: "none", padding: mob ? 20 : 28, color: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <ScoreBadge score={score} size="lg" />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Our Verdict</div>
          <div style={{ fontFamily: "Outfit", fontSize: mob ? 18 : 22, fontWeight: 800, color: "#fff" }}>{title}</div>
        </div>
      </div>
      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, marginBottom: 16 }}>{text}</p>
      {bestFor && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
          <Check size={16} color="#34d399" style={{ marginTop: 3, flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: "#a7f3d0" }}><strong>Best for:</strong> {bestFor}</span>
        </div>
      )}
      {notFor && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
          <AlertTriangle size={16} color={ORANGE} style={{ marginTop: 3, flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}><strong>Not ideal for:</strong> {notFor}</span>
        </div>
      )}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
        <a href={vUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{ background: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, color: NAVY, fontSize: 14, fontWeight: 700, textDecoration: "none", padding: "12px 24px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>
          Visit {name} <ExternalLink size={14} />
        </a>
        <Link to={`/review/${slug}`} className="cta-secondary" style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.3)", fontSize: 14, fontWeight: 700, textDecoration: "none", padding: "10px 20px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>
          Read Full Review <ArrowRight size={14} />
        </Link>
      </div>
    </Card>
  );
}
