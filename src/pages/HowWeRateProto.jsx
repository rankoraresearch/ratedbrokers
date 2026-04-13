/**
 * HOW WE RATE — иконки в стиле Methodology page
 * URL: /proto/how-we-rate
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import Icon from "../components/Icon";
import { ArrowRight } from "lucide-react";
import HOMEPAGE_SEO from "../data/homepageSeoContent";

/* Цвета и иконки — из CRITERIA_V2 (methodologyData.js) */
const CAT_META = {
  "Regulation & Safety": { color: "#059669", icon: "shield" },
  "Trading Costs": { color: "#2563eb", icon: "dollar-sign" },
  "User Reputation": { color: "#00B67A", icon: "star" },
  "Broker Transparency": { color: "#7c3aed", icon: "eye" },
  "Platforms & Tools": { color: "#0ea5e9", icon: "monitor" },
  "Execution Model": { color: "#f59e0b", icon: "zap" },
};

const cn = { maxWidth: 1200, margin: "0 auto" };
const SHADOW = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)";
const SHADOW_HOVER = "0 4px 12px rgba(0,0,0,0.12)";

function Links() {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {HOMEPAGE_SEO.howWeRate.links.map((l, i) => (
        <Link key={i} to={l.path} style={{ fontSize: 13, fontWeight: 600, color: "#059669", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
          {l.text} <ArrowRight size={12} />
        </Link>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   V1 — Methodology-style inline (Icon 22px + цветной weight badge)
   Как на /methodology — Weight bars section
   ══════════════════════════════════════════════════════ */
function V1({ mob, tab }) {
  return (
    <section style={{ ...cn, padding: mob ? "40px 16px" : "56px 24px" }}>
      <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 12 }}>
        {HOMEPAGE_SEO.howWeRate.heading}
      </h2>
      <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#475569", maxWidth: 800, marginBottom: 24 }}>
        {HOMEPAGE_SEO.howWeRate.intro}
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
        gap: 14, marginBottom: 20,
      }}>
        {HOMEPAGE_SEO.howWeRate.categories.map((cat, i) => {
          const m = CAT_META[cat.name];
          return (
            <div key={i} style={{
              padding: mob ? "16px" : "20px", borderRadius: 14,
              background: "#fff", border: "1px solid #e2e8f0",
              boxShadow: SHADOW, transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = SHADOW_HOVER; e.currentTarget.style.borderColor = "#059669"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = SHADOW; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Icon name={m.icon} size={22} color={m.color} />
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15, color: "#0f172a", flex: 1 }}>{cat.name}</span>
                <span style={{
                  padding: "3px 10px", borderRadius: 6,
                  background: m.color + "14", color: m.color,
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 800,
                }}>{cat.weight}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#64748b", margin: 0 }}>{cat.desc}</p>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#475569", maxWidth: 800, marginBottom: 12 }}>
        {HOMEPAGE_SEO.howWeRate.closing}
      </p>
      <Links />
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   V2 — Detailed-criteria style (Icon 26px + left color border + weight bar)
   Как accordion на /methodology — borderLeft 4px
   ══════════════════════════════════════════════════════ */
function V2({ mob, tab }) {
  return (
    <section style={{ ...cn, padding: mob ? "40px 16px" : "56px 24px" }}>
      <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 12 }}>
        {HOMEPAGE_SEO.howWeRate.heading}
      </h2>
      <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#475569", maxWidth: 800, marginBottom: 24 }}>
        {HOMEPAGE_SEO.howWeRate.intro}
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
        gap: 14, marginBottom: 20,
      }}>
        {HOMEPAGE_SEO.howWeRate.categories.map((cat, i) => {
          const m = CAT_META[cat.name];
          const weightNum = parseInt(cat.weight);
          return (
            <div key={i} style={{
              padding: mob ? "16px" : "20px", borderRadius: 14,
              background: "#fff", border: "1px solid #e2e8f0",
              borderLeft: `4px solid ${m.color}`,
              boxShadow: SHADOW, transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = SHADOW_HOVER; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = SHADOW; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <Icon name={m.icon} size={26} color={m.color} />
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 16, color: "#0f172a", flex: 1 }}>{cat.name}</span>
              </div>
              {/* Weight bar — как на /methodology */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#e2e8f0", overflow: "hidden" }}>
                  <div style={{ width: `${weightNum}%`, height: "100%", borderRadius: 3, background: m.color }} />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 14, color: m.color, minWidth: 32, textAlign: "right" }}>{cat.weight}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#64748b", margin: 0 }}>{cat.desc}</p>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#475569", maxWidth: 800, marginBottom: 12 }}>
        {HOMEPAGE_SEO.howWeRate.closing}
      </p>
      <Links />
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   V3 — Hybrid: Icon 24px inline + colored weight badge + WeightBar
   Карточки с обоими элементами — badge И bar
   ══════════════════════════════════════════════════════ */
function V3({ mob, tab }) {
  return (
    <section style={{ ...cn, padding: mob ? "40px 16px" : "56px 24px" }}>
      <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 12 }}>
        {HOMEPAGE_SEO.howWeRate.heading}
      </h2>
      <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#475569", maxWidth: 800, marginBottom: 24 }}>
        {HOMEPAGE_SEO.howWeRate.intro}
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
        gap: 14, marginBottom: 20,
      }}>
        {HOMEPAGE_SEO.howWeRate.categories.map((cat, i) => {
          const m = CAT_META[cat.name];
          const weightNum = parseInt(cat.weight);
          return (
            <div key={i} style={{
              padding: mob ? "16px" : "20px", borderRadius: 14,
              background: "#fff", border: "1px solid #e2e8f0",
              boxShadow: SHADOW, transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = SHADOW_HOVER; e.currentTarget.style.borderColor = "#059669"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = SHADOW; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <Icon name={m.icon} size={24} color={m.color} />
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15, color: "#0f172a", flex: 1 }}>{cat.name}</span>
                <span style={{
                  padding: "3px 10px", borderRadius: 6,
                  background: m.color + "14", color: m.color,
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 800,
                }}>{cat.weight}</span>
              </div>
              {/* Thin weight bar */}
              <div style={{ height: 4, borderRadius: 2, background: "#f1f5f9", overflow: "hidden", marginBottom: 12 }}>
                <div style={{ width: `${(weightNum / 30) * 100}%`, height: "100%", borderRadius: 2, background: m.color, opacity: 0.6 }} />
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#64748b", margin: 0 }}>{cat.desc}</p>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#475569", maxWidth: 800, marginBottom: 12 }}>
        {HOMEPAGE_SEO.howWeRate.closing}
      </p>
      <Links />
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN
   ══════════════════════════════════════════════════════ */
export default function HowWeRateProto() {
  const { mob, tab } = useMedia();
  const [active, setActive] = useState("V1");
  const variants = [
    { id: "V1", label: "V1 — Inline", desc: "Icon 22px inline + цветной weight badge (как Weight Bars на /methodology)" },
    { id: "V2", label: "V2 — Left Border", desc: "Icon 26px + borderLeft 4px + WeightBar (как Detailed Criteria на /methodology)" },
    { id: "V3", label: "V3 — Hybrid", desc: "Icon 24px + weight badge + тонкий bar (оба элемента)" },
  ];

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        padding: mob ? "12px 16px" : "16px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 16 : 20, color: "#0f172a", marginBottom: 12 }}>
            How We Rate — Methodology-Style Icons
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {variants.map(v => (
              <button key={v.id}
                onClick={() => setActive(v.id)}
                style={{
                  padding: mob ? "6px 12px" : "8px 16px",
                  borderRadius: 8,
                  border: active === v.id ? "2px solid #059669" : "1px solid #e2e8f0",
                  background: active === v.id ? "#ecfdf5" : "#fff",
                  color: active === v.id ? "#059669" : "#64748b",
                  fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
            {variants.find(v => v.id === active)?.desc}
          </div>
        </div>
      </div>

      {active === "V1" && <V1 mob={mob} tab={tab} />}
      {active === "V2" && <V2 mob={mob} tab={tab} />}
      {active === "V3" && <V3 mob={mob} tab={tab} />}
    </div>
  );
}
