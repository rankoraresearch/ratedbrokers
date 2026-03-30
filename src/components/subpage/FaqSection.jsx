import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { H2 } from "./Typography";

const NAVY = "#0f172a";
const GRAY_MUTED = "#64748b";
const GRAY_TEXT = "#374151";
const BORDER = "#e8ecf1";

export default function FaqSection({ faqs, mob }) {
  const [open, setOpen] = useState(null);
  if (!faqs || faqs.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <H2>Frequently Asked Questions</H2>
      {faqs.map((f, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${BORDER}`, marginBottom: 0 }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: NAVY, lineHeight: 1.5 }}>{f.q}</span>
            {open === i ? <ChevronUp size={18} color={GRAY_MUTED} style={{ flexShrink: 0 }} /> : <ChevronDown size={18} color={GRAY_MUTED} style={{ flexShrink: 0 }} />}
          </button>
          {open === i && <div style={{ padding: "0 0 16px", fontSize: 15, color: GRAY_TEXT, lineHeight: 1.8 }}>{f.a}</div>}
        </div>
      ))}
    </div>
  );
}
