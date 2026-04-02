/**
 * HOME PROTOTYPES — Switcher Page
 * All 6 homepage concepts on one URL with tab switching
 */
import { useState } from "react";
import { useMedia } from "../hooks/useMedia";
import HomeProtoA from "./HomeProtoA";
import HomeProtoC from "./HomeProtoC";
import HomeProtoF from "./HomeProtoF";
import HomeProtoF2 from "./HomeProtoF2";
import HomeProtoF3 from "./HomeProtoF3";
import HomeProtoF4 from "./HomeProtoF4";

const VARIANTS = [
  { key: "A", label: "Hub Navigator", desc: "Categories first — top 3 brokers per vertical" },
  { key: "C", label: "Hybrid Power", desc: "8 verticals + Editor's Picks + tabbed rankings" },
  { key: "F", label: "Conversion", desc: "Quiz + CTAs + vertical badges + compare pairs" },
  { key: "F2", label: "F + Data", desc: "Data chips, comparison table, score breakdown" },
  { key: "F3", label: "F + Social", desc: "Trustpilot, rank badges, trust stats" },
  { key: "F4", label: "F + Verticals", desc: "8 mini-sections, one per category" },
];

const COMPONENTS = { A: HomeProtoA, C: HomeProtoC, F: HomeProtoF, F2: HomeProtoF2, F3: HomeProtoF3, F4: HomeProtoF4 };

export default function HomePrototypes() {
  const [active, setActive] = useState("A");
  const { mob } = useMedia();
  const Component = COMPONENTS[active];

  return (
    <div>
      {/* Sticky Switcher Bar */}
      <div style={{
        position: "sticky", top: 64, zIndex: 900,
        background: "#0f172a", borderBottom: "1px solid #1e293b",
        padding: mob ? "8px 12px" : "10px 24px",
        display: "flex", gap: mob ? 4 : 8, overflowX: "auto",
        justifyContent: mob ? "flex-start" : "center",
      }}>
        {VARIANTS.map(v => (
          <button key={v.key} onClick={() => setActive(v.key)} style={{
            padding: mob ? "6px 10px" : "8px 16px",
            borderRadius: 8, border: "1px solid",
            borderColor: active === v.key ? "#fff" : "rgba(255,255,255,0.12)",
            background: active === v.key ? "#fff" : "transparent",
            color: active === v.key ? "#0f172a" : "rgba(255,255,255,0.5)",
            fontSize: mob ? 11 : 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
            whiteSpace: "nowrap", transition: "all 0.15s",
            letterSpacing: "-0.01em",
          }}>
            {v.key} {!mob && `— ${v.label}`}
          </button>
        ))}
      </div>
      {/* Active variant info bar */}
      <div style={{
        background: "#f8fafc", padding: mob ? "10px 16px" : "12px 24px",
        borderBottom: "1px solid #e8ecf1", textAlign: "center",
      }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 14, color: "#0f172a", letterSpacing: "-0.01em" }}>
          Variant {active}: {VARIANTS.find(v => v.key === active)?.label}
        </span>
        <span style={{ fontSize: 13, color: "#94a3b8", marginLeft: 8 }}>
          {VARIANTS.find(v => v.key === active)?.desc}
        </span>
      </div>
      {/* Render active component */}
      <Component />
    </div>
  );
}
