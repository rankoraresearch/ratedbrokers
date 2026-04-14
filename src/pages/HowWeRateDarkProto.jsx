/**
 * HOW WE RATE — Premium Dark concept prototypes
 * URL: /proto/how-we-rate-dark
 *
 * Концепция: тёмный фон (navy→green gradient) + оранжевые акценты.
 * A — Editorial Dark: без карточек
 * B — Orange Tiles: тёмные плитки, с отдельными тумблерами (eyebrow, texture, emphasis, icon, progress)
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { ArrowUpRight, Shield, DollarSign, Star, Eye, Monitor, Zap } from "lucide-react";
import HOMEPAGE_SEO from "../data/homepageSeoContent";

const ICONS = {
  "Regulation & Safety": Shield,
  "Trading Costs": DollarSign,
  "User Reputation": Star,
  "Broker Transparency": Eye,
  "Platforms & Tools": Monitor,
  "Execution Model": Zap,
};

const DARK_BG = "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)";
const ORANGE = "#f59e0b";
const ORANGE_SOFT = "#fbbf24";
const TEXTURE = "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)";

/* ════════════════════════════════════════════════════════════════
   A — EDITORIAL DARK
   ════════════════════════════════════════════════════════════════ */
function VariantA({ mob, tab }) {
  return (
    <section style={{ position: "relative", background: DARK_BG, color: "#fff" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: TEXTURE }} />
      <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: mob ? "56px 16px" : "88px 32px" }}>
        <div style={{ marginBottom: mob ? 40 : 64, maxWidth: 820 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", color: ORANGE, textTransform: "uppercase", marginBottom: 16 }}>
            Our Methodology
          </div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 34 : 52, lineHeight: 1.05, letterSpacing: "-0.03em", margin: 0, marginBottom: 20 }}>
            How We Rate Brokers
          </h2>
          <p style={{ fontSize: mob ? 15 : 17, lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: 0, maxWidth: 720 }}>
            {HOMEPAGE_SEO.howWeRate.intro}
          </p>
        </div>
        <div>
          {HOMEPAGE_SEO.howWeRate.categories.map((cat, i) => {
            const isTop = i === 0;
            const IconCmp = ICONS[cat.name];
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: mob ? "80px 1fr" : "180px 1fr",
                gap: mob ? 16 : 40, alignItems: "baseline",
                padding: mob ? "24px 0" : "32px 0",
                borderTop: i === 0 ? "1px solid rgba(255,255,255,0.14)" : "none",
                borderBottom: "1px solid rgba(255,255,255,0.14)",
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
                  fontSize: mob ? 42 : 72, lineHeight: 1,
                  color: isTop ? ORANGE : "#fff",
                  letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums",
                }}>{cat.weight}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <IconCmp size={mob ? 18 : 20} color={isTop ? ORANGE : "rgba(255,255,255,0.55)"} strokeWidth={1.75} />
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: mob ? 18 : 22, letterSpacing: "-0.01em" }}>{cat.name}</span>
                  </div>
                  <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.65, color: "rgba(255,255,255,0.65)", margin: 0, maxWidth: 640 }}>{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <ClosingCTA mob={mob} />
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   B — ORANGE TILES (с отдельными тумблерами опций)
   ════════════════════════════════════════════════════════════════ */
function VariantB({ mob, tab, opts }) {
  const { eyebrow, texture, emphasis, iconStyle, progressBar } = opts;

  return (
    <section style={{ position: "relative", background: DARK_BG, color: "#fff" }}>
      {texture && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: TEXTURE }} />}
      <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: mob ? "48px 16px" : "72px 32px" }}>
        {/* ─── Header ─── */}
        <div style={{ marginBottom: mob ? 28 : 40, maxWidth: 760 }}>
          {eyebrow && (
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", color: ORANGE, textTransform: "uppercase", marginBottom: 14 }}>
              Our Methodology
            </div>
          )}
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 28 : 40, lineHeight: 1.1, letterSpacing: "-0.03em", margin: 0, marginBottom: 14 }}>
            How We Rate Brokers
          </h2>
          <p style={{ fontSize: mob ? 14 : 16, lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: 0 }}>
            {HOMEPAGE_SEO.howWeRate.intro}
          </p>
        </div>

        {/* ─── Tiles ─── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: mob ? 12 : 16, marginBottom: mob ? 28 : 40,
        }}>
          {HOMEPAGE_SEO.howWeRate.categories.map((cat, i) => {
            const weightNum = parseInt(cat.weight);
            const IconCmp = ICONS[cat.name];
            const isTop = i === 0;
            const emphasized = emphasis && isTop;

            // Icon rendering
            let iconEl;
            if (iconStyle === "boxed") {
              iconEl = (
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(245,158,11,0.12)",
                  border: "1px solid rgba(245,158,11,0.28)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <IconCmp size={20} color={ORANGE} strokeWidth={1.75} />
                </div>
              );
            } else {
              // outline — no box
              iconEl = (
                <IconCmp size={24} color={ORANGE} strokeWidth={1.75} />
              );
            }

            return (
              <div key={i}
                style={{
                  position: "relative",
                  padding: mob ? "20px" : "24px", borderRadius: 14,
                  background: emphasized ? "rgba(245,158,11,0.05)" : "rgba(255,255,255,0.04)",
                  border: emphasized ? "1px solid rgba(245,158,11,0.40)" : "1px solid rgba(255,255,255,0.10)",
                  transition: "border-color 0.2s, background 0.2s",
                  cursor: "default",
                  overflow: "hidden",
                }}
                onMouseEnter={e => {
                  if (!emphasized) {
                    e.currentTarget.style.borderColor = ORANGE;
                    e.currentTarget.style.background = "rgba(245,158,11,0.06)";
                  }
                }}
                onMouseLeave={e => {
                  if (!emphasized) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }
                }}
              >
                {emphasized && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE_SOFT})` }} />
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  {iconEl}
                  <span style={{
                    padding: "4px 10px", borderRadius: 6,
                    background: "rgba(245,158,11,0.14)", color: ORANGE_SOFT,
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 800,
                    letterSpacing: "0.02em",
                  }}>{cat.weight}</span>
                </div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 8, letterSpacing: "-0.01em" }}>
                  {cat.name}
                </div>
                {progressBar && (
                  <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ width: `${(weightNum / 30) * 100}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE_SOFT})` }} />
                  </div>
                )}
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.68)", margin: 0, marginTop: progressBar ? 0 : 4 }}>
                  {cat.desc}
                </p>
              </div>
            );
          })}
        </div>

        <ClosingCTA mob={mob} />
      </div>
    </section>
  );
}

function ClosingCTA({ mob }) {
  return (
    <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: mob ? 20 : 32, alignItems: mob ? "stretch" : "center", justifyContent: "space-between" }}>
      <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: 0, maxWidth: 620 }}>
        {HOMEPAGE_SEO.howWeRate.closing}
      </p>
      <Link
        to="/methodology"
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "14px 22px", borderRadius: 10,
          background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_SOFT})`,
          color: "#0f172a", textDecoration: "none",
          fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15,
          whiteSpace: "nowrap",
          boxShadow: "0 8px 24px rgba(245,158,11,0.32)",
        }}
      >
        Read full methodology <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Toggle chip
   ════════════════════════════════════════════════════════════════ */
function Tog({ label, on, onChange }) {
  return (
    <button onClick={() => onChange(!on)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "7px 12px", borderRadius: 999,
        border: on ? "1px solid #0f172a" : "1px solid #cbd5e1",
        background: on ? "#0f172a" : "#fff",
        color: on ? "#fff" : "#475569",
        fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 12,
        cursor: "pointer",
        transition: "all 0.15s",
      }}>
      <span style={{
        width: 8, height: 8, borderRadius: 999,
        background: on ? ORANGE : "#cbd5e1",
      }} />
      {label}
    </button>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div style={{ display: "inline-flex", padding: 3, borderRadius: 999, background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)}
          style={{
            padding: "6px 12px", borderRadius: 999, cursor: "pointer",
            border: "none",
            background: value === o.value ? "#0f172a" : "transparent",
            color: value === o.value ? "#fff" : "#64748b",
            fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 12,
          }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════ */
export default function HowWeRateDarkProto() {
  const [v, setV] = useState("B");
  const { mob, tab } = useMedia();

  // B options
  const [eyebrow, setEyebrow] = useState(true);
  const [texture, setTexture] = useState(true);
  const [emphasis, setEmphasis] = useState(false);
  const [iconStyle, setIconStyle] = useState("boxed"); // boxed | outline
  const [progressBar, setProgressBar] = useState(true);

  const opts = { eyebrow, texture, emphasis, iconStyle, progressBar };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Toggle bar */}
      <div style={{ position: "sticky", top: 64, zIndex: 10, background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "12px 16px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 15, color: "#0f172a" }}>
              How We Rate — Premium Dark
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { id: "A", label: "A · Editorial Dark" },
                { id: "B", label: "B · Orange Tiles" },
              ].map(o => (
                <button key={o.id} onClick={() => setV(o.id)}
                  style={{
                    padding: "8px 14px", borderRadius: 8, cursor: "pointer",
                    border: v === o.id ? "1px solid #0f172a" : "1px solid #e2e8f0",
                    background: v === o.id ? "#0f172a" : "#fff",
                    color: v === o.id ? "#fff" : "#475569",
                    fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 13,
                  }}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {v === "B" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", paddingTop: 6, borderTop: "1px dashed #e2e8f0" }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase", marginRight: 4 }}>Options:</span>
              <Tog label="Eyebrow" on={eyebrow} onChange={setEyebrow} />
              <Tog label="Texture" on={texture} onChange={setTexture} />
              <Tog label="Emphasis Regulation" on={emphasis} onChange={setEmphasis} />
              <Tog label="Progress bar" on={progressBar} onChange={setProgressBar} />
              <span style={{ width: 1, height: 22, background: "#e2e8f0", margin: "0 4px" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>Icons:</span>
              <Segmented value={iconStyle} onChange={setIconStyle} options={[
                { value: "boxed", label: "Boxed" },
                { value: "outline", label: "Outline" },
              ]} />
            </div>
          )}
        </div>
      </div>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "20px 16px" : "24px 32px" }}>
        <div style={{ padding: 12, borderRadius: 10, background: "#f8fafc", border: "1px dashed #cbd5e1", fontSize: 12, color: "#64748b" }}>
          Предпросмотр: секция How We Rate так, как встала бы на главной.
        </div>
      </section>

      {v === "A" && <VariantA mob={mob} tab={tab} />}
      {v === "B" && <VariantB mob={mob} tab={tab} opts={opts} />}

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "20px 16px 48px" : "24px 32px 64px" }}>
        <div style={{ padding: 12, borderRadius: 10, background: "#f8fafc", border: "1px dashed #cbd5e1", fontSize: 12, color: "#64748b" }}>
          Ниже обычно идёт Regulated Brokers by Country.
        </div>
      </section>
    </div>
  );
}
