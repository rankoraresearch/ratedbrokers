/**
 * RANKING HERO PROTOTYPES — 4 variants of the ranking page header
 * All keep: gradient duo (navy→green), orange 3px top border, diagonal texture, dark TOC strip
 * Switchable on one page for comparison
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokersWithData } from "../data/brokers";
import { getBrokersForRanking } from "../data/rankingFilters";
import BrokerLogo from "../components/BrokerLogo";
import Icon from "../components/Icon";
import { ArrowRight, Shield, ChevronRight, Star } from "lucide-react";

const YEAR = "2026";
const RANKING = { title: "Best Forex Brokers", icon: "trophy", id: "forex-overall" };

// Simulated TOC items
const TOC = ["Intro", "Quick Grid", "Key Finding", "All Brokers", "Spread Chart", "Comparison", "Education", "FAQ"];

// Shared texture overlay
function Texture() {
  return <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)", pointerEvents: "none" }} />;
}

// Shared dark TOC strip
function TocStrip({ mob }) {
  return (
    <div style={{
      background: "#0a0f1a", borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: mob ? "0 12px" : "0 24px", overflowX: "auto",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", gap: mob ? 2 : 4, minWidth: "max-content",
      }}>
        {TOC.map((item, i) => (
          <button key={i} style={{
            padding: mob ? "10px 12px" : "12px 16px",
            background: "transparent", border: "none",
            color: i === 0 ? "#fbbf24" : "rgba(255,255,255,0.4)",
            fontSize: mob ? 12 : 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap",
            borderBottom: i === 0 ? "2px solid #fbbf24" : "2px solid transparent",
          }}>{item}</button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// VARIANT A — Current (centered, icon top)
// ═══════════════════════════════════════════════════════
function HeroA({ mob, tab, brokers }) {
  return (
    <>
      <div style={{
        position: "relative", overflow: "hidden",
        borderTop: "3px solid #f59e0b",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
      }}>
        <Texture />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: mob ? "32px 16px 40px" : "48px 24px 56px", textAlign: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: mob ? 56 : 72, height: mob ? 56 : 72, borderRadius: 16, background: "rgba(255,255,255,0.1)", marginBottom: 14 }}>
            <Icon name={RANKING.icon} size={mob ? 28 : 36} color="#34d399" />
          </span>
          <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 26 : tab ? 34 : 42, lineHeight: 1.1, color: "#fff", marginBottom: 8 }}>
            {RANKING.title} {YEAR}
          </h1>
          <p style={{ fontSize: mob ? 14 : 15, color: "rgba(255,255,255,0.75)", maxWidth: 540, margin: "0 auto 10px", lineHeight: 1.5 }}>
            {brokers.length} brokers independently tested across 130+ data points
          </p>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            By Marcus Chen · Updated March {YEAR}
          </div>
        </div>
      </div>
      <TocStrip mob={mob} />
    </>
  );
}

// ═══════════════════════════════════════════════════════
// VARIANT B — Compact left-aligned + stats right
// ═══════════════════════════════════════════════════════
function HeroB({ mob, tab, brokers }) {
  return (
    <>
      <div style={{
        position: "relative", overflow: "hidden",
        borderTop: "3px solid #f59e0b",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
      }}>
        <Texture />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: mob ? "24px 16px 28px" : "32px 24px 36px", display: mob ? "block" : "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.08)" }}>
                <Icon name={RANKING.icon} size={18} color="#34d399" />
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>
                {brokers.length} brokers · Updated Q1 {YEAR}
              </span>
            </div>
            <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 24 : tab ? 30 : 36, lineHeight: 1.1, color: "#fff", letterSpacing: "-0.03em" }}>
              {RANKING.title} {YEAR}
            </h1>
          </div>
          {!mob && (
            <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
              {[
                { n: brokers.length, l: "Brokers" },
                { n: "130+", l: "Data Points" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 20, fontWeight: 700, color: "#fbbf24" }}>{s.n}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1.5 }}>{s.l}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <TocStrip mob={mob} />
    </>
  );
}

// ═══════════════════════════════════════════════════════
// VARIANT C — With top 3 broker logos inline
// ═══════════════════════════════════════════════════════
function HeroC({ mob, tab, brokers }) {
  const top3 = brokers.slice(0, 3);
  return (
    <>
      <div style={{
        position: "relative", overflow: "hidden",
        borderTop: "3px solid #f59e0b",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
      }}>
        <Texture />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: mob ? "28px 16px 32px" : "36px 24px 40px" }}>
          <div style={{ display: mob ? "block" : "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", marginBottom: 12 }}>
                <Icon name={RANKING.icon} size={12} color="#fbbf24" />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: 1 }}>Top Ranking</span>
              </div>
              <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 26 : tab ? 32 : 40, lineHeight: 1.1, color: "#fff", marginBottom: 6, letterSpacing: "-0.03em" }}>
                {RANKING.title} {YEAR}
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: mob ? 16 : 0 }}>
                {brokers.length} brokers tested · By Marcus Chen, CFA · Updated March {YEAR}
              </p>
            </div>
            {/* Top 3 mini-podium */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              {top3.map((b, i) => (
                <Link key={b.slug} to={`/review/${b.slug}`} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "12px 14px", borderRadius: 12,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none", width: mob ? 80 : 96,
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                >
                  <span style={{ fontSize: 9, fontWeight: 800, color: i === 0 ? "#fbbf24" : "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>#{i + 1}</span>
                  <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", marginBottom: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                    <BrokerLogo broker={b.B} size={40} variant="icon" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", textAlign: "center" }}>{b.B.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700, color: "#34d399", marginTop: 2 }}>{b.B.score}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <TocStrip mob={mob} />
    </>
  );
}

// ═══════════════════════════════════════════════════════
// VARIANT D — Full-width with score bar + broker strip
// ═══════════════════════════════════════════════════════
function HeroD({ mob, tab, brokers }) {
  const top5 = brokers.slice(0, 5);
  return (
    <>
      <div style={{
        position: "relative", overflow: "hidden",
        borderTop: "3px solid #f59e0b",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
      }}>
        <Texture />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: mob ? "28px 16px 20px" : "36px 24px 24px" }}>
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={RANKING.icon} size={20} color="#fbbf24" />
            </div>
            <div>
              <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 22 : tab ? 28 : 34, lineHeight: 1.1, color: "#fff", letterSpacing: "-0.03em" }}>
                {RANKING.title} {YEAR}
              </h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                {brokers.length} brokers · 130+ data points · By Marcus Chen · Updated March {YEAR}
              </p>
            </div>
          </div>
          {/* Top 5 broker strip */}
          <div style={{
            display: "flex", gap: mob ? 8 : 12, overflowX: "auto",
            padding: "12px 0 4px", borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            {top5.map((b, i) => (
              <Link key={b.slug} to={`/review/${b.slug}`} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 12px", borderRadius: 8,
                background: i === 0 ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${i === 0 ? "rgba(251,191,36,0.25)" : "rgba(255,255,255,0.06)"}`,
                textDecoration: "none", whiteSpace: "nowrap",
                transition: "background 0.15s",
                flexShrink: 0,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = i === 0 ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.04)"; }}
              >
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 700, color: i === 0 ? "#fbbf24" : "rgba(255,255,255,0.3)", width: 16 }}>#{i + 1}</span>
                <div style={{ width: 28, height: 28, borderRadius: 7, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
                  <BrokerLogo broker={b.B} size={28} variant="icon" />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{b.B.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700, color: i === 0 ? "#fbbf24" : "#34d399" }}>{b.B.score}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <TocStrip mob={mob} />
    </>
  );
}

// ═══════════════════════════════════════════════════════
// SWITCHER
// ═══════════════════════════════════════════════════════
const VARIANTS = [
  { key: "A", label: "Current — Centered Icon", Component: HeroA },
  { key: "B", label: "Compact — Left + Stats Right", Component: HeroB },
  { key: "C", label: "Podium — Top 3 Logos", Component: HeroC },
  { key: "D", label: "Strip — Title + Top 5 Row", Component: HeroD },
];

export default function RankingHeroProtos() {
  const [active, setActive] = useState("A");
  const { mob, tab } = useMedia();
  const brokers = getBrokersForRanking(RANKING.id);
  const ActiveHero = VARIANTS.find(v => v.key === active)?.Component || HeroA;

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      {/* Switcher */}
      <div style={{
        position: "sticky", top: 64, zIndex: 900,
        background: "#0f172a", borderBottom: "1px solid #1e293b",
        padding: mob ? "8px 12px" : "10px 24px",
        display: "flex", gap: 6, justifyContent: "center",
      }}>
        {VARIANTS.map(v => (
          <button key={v.key} onClick={() => setActive(v.key)} style={{
            padding: mob ? "6px 10px" : "8px 16px",
            borderRadius: 8, border: "1px solid",
            borderColor: active === v.key ? "#fbbf24" : "rgba(255,255,255,0.12)",
            background: active === v.key ? "rgba(251,191,36,0.1)" : "transparent",
            color: active === v.key ? "#fbbf24" : "rgba(255,255,255,0.5)",
            fontSize: mob ? 11 : 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap",
          }}>
            {v.key}: {mob ? "" : v.label}
          </button>
        ))}
      </div>
      {/* Info */}
      <div style={{ background: "#f8fafc", padding: "10px 24px", textAlign: "center", borderBottom: "1px solid #e8ecf1" }}>
        <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
          Ranking Hero — Variant {active}
        </span>
        <span style={{ fontSize: 13, color: "#94a3b8", marginLeft: 8 }}>
          {VARIANTS.find(v => v.key === active)?.label}
        </span>
      </div>
      {/* Render hero */}
      <ActiveHero mob={mob} tab={tab} brokers={brokers} />
      {/* Placeholder content below */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ background: "#f8fafc", borderRadius: 12, padding: 40, textAlign: "center", color: "#94a3b8", border: "1px dashed #e2e8f0" }}>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Ranking page content would appear here</p>
          <p style={{ fontSize: 13 }}>Quick Grid · Key Finding · Broker Cards · Spread Chart · FAQ</p>
        </div>
      </div>
    </div>
  );
}
