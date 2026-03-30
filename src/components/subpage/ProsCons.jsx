import { Check, X as XIcon } from "lucide-react";

const GREEN = "#059669";
const RED = "#dc2626";
const GRAY_TEXT = "#374151";

export default function ProsCons({ pros, cons, mob }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 20 }}>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: GREEN, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Check size={14} /> PROS</div>
        {pros.map((p, i) => (
          <div key={i} style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.6, marginBottom: 6, paddingLeft: 22, position: "relative" }}>
            <Check size={13} color={GREEN} style={{ position: "absolute", left: 0, top: 4 }} />{p}
          </div>
        ))}
      </div>
      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: RED, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><XIcon size={14} /> CONS</div>
        {cons.map((c, i) => (
          <div key={i} style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.6, marginBottom: 6, paddingLeft: 22, position: "relative" }}>
            <XIcon size={13} color={RED} style={{ position: "absolute", left: 0, top: 4 }} />{c}
          </div>
        ))}
      </div>
    </div>
  );
}
