import ScoreBadge from "../ScoreBadge";

const GREEN = "#059669";
const NAVY = "#0f172a";

export default function QuickAnswerBox({ text, score, scoreLabel }) {
  return (
    <div style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.15)", borderRadius: 12, padding: "18px 22px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Quick Answer</div>
        <div style={{ fontSize: 15, color: NAVY, lineHeight: 1.7, fontWeight: 500 }}>{text}</div>
      </div>
      {score && <div style={{ flexShrink: 0 }}><ScoreBadge score={score} size="lg" /></div>}
    </div>
  );
}
