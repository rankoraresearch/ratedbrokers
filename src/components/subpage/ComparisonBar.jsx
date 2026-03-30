const NAVY = "#0f172a";
const GREEN = "#059669";
const GRAY_TEXT = "#374151";

export default function ComparisonBar({ label, value, max, best, unit = "pips" }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
        <span style={{ fontWeight: 600, color: NAVY }}>
          {label}
          {best && <span style={{ color: "#fff", fontSize: 9, fontWeight: 700, marginLeft: 6, background: GREEN, padding: "2px 6px", borderRadius: 3, letterSpacing: "0.04em" }}>BEST</span>}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: best ? GREEN : GRAY_TEXT }}>{value} {unit}</span>
      </div>
      <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: best ? `linear-gradient(90deg, ${GREEN}, #34d399)` : "#94a3b8", borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}
