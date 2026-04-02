/**
 * HERO BUTTONS PROTOTYPE — 4 variants of the 3-button area in the hero
 * Same hero design, only the right-side buttons change
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokersWithData } from "../data/brokers";
import HUBS, { getRankingsForHub } from "../data/categoryHubs";
import RANKINGS from "../data/rankings";
import Icon from "../components/Icon";
import { ArrowRight, Search, Globe, BarChart3, BookOpen } from "lucide-react";

const YEAR = "2026";

/* ───── VARIANT DEFINITIONS ───── */
const VARIANTS = [
  { key: "1", label: "Smart Filter", desc: "Asset + Country → redirect to matching ranking" },
  { key: "2", label: "Quiz Lite", desc: "Asset + Experience → find broker" },
  { key: "3", label: "Top Actions", desc: "Compare + Methodology + Browse Rankings" },
  { key: "4", label: "Country + CTA", desc: "Auto-detect country + reviews + find broker" },
];

/* ───── COUNTRY DATA ───── */
const COUNTRIES = [
  { code: "GB", name: "United Kingdom", slug: "uk" },
  { code: "AU", name: "Australia", slug: "australia" },
  { code: "US", name: "United States", slug: "usa" },
  { code: "AE", name: "UAE", slug: "uae" },
  { code: "DE", name: "Germany", slug: "germany" },
  { code: "SG", name: "Singapore", slug: "singapore" },
  { code: "SA", name: "South Africa", slug: "south-africa" },
  { code: "KE", name: "Kenya", slug: "kenya" },
  { code: "MY", name: "Malaysia", slug: "malaysia" },
  { code: "IN", name: "India", slug: "india" },
  { code: "PH", name: "Philippines", slug: "philippines" },
  { code: "NG", name: "Nigeria", slug: "nigeria" },
  { code: "PK", name: "Pakistan", slug: "pakistan" },
  { code: "OM", name: "Oman", slug: "oman" },
];

const ASSETS = [
  { label: "Forex", slug: "forex" },
  { label: "CFD", slug: "cfd" },
  { label: "Stocks & ETFs", slug: "stocks" },
  { label: "Crypto", slug: "crypto" },
  { label: "Options", slug: "options" },
  { label: "Futures", slug: "futures" },
  { label: "Copy Trading", slug: "copy-trading" },
  { label: "Spread Betting", slug: "spread-betting" },
];

/* ───── SHARED STYLES ───── */
const selectStyle = {
  flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(30,41,59,0.8)", backdropFilter: "blur(8px)",
  color: "#e2e8f0", fontSize: 13, fontFamily: "inherit",
  appearance: "none", cursor: "pointer", minWidth: 0,
};

const ctaStyle = {
  padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700,
  background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", textDecoration: "none",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 6, whiteSpace: "nowrap",
  border: "none", cursor: "pointer",
};

const outlineBtn = {
  padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
  background: "rgba(30,41,59,0.8)", backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0",
  textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
  gap: 6, whiteSpace: "nowrap", cursor: "pointer", transition: "all 0.15s",
};

/* ───── BUTTON VARIANTS ───── */
function ButtonsV1({ mob }) {
  const [asset, setAsset] = useState("");
  const [country, setCountry] = useState("");

  const getTarget = () => {
    if (asset && country) return `/combi-${asset}-${country}`;
    if (asset) {
      const hub = HUBS.find(h => h.slug === asset);
      return hub ? hub.path : "/rankings";
    }
    if (country) return `/best-forex-brokers-${country}`;
    return "/rankings";
  };

  return (
    <div style={{ display: "flex", gap: mob ? 8 : 10, flexDirection: mob ? "column" : "row" }}>
      <select style={selectStyle} value={asset} onChange={e => setAsset(e.target.value)}>
        <option value="">What do you trade?</option>
        {ASSETS.map(a => <option key={a.slug} value={a.slug}>{a.label}</option>)}
      </select>
      <select style={selectStyle} value={country} onChange={e => setCountry(e.target.value)}>
        <option value="">Your country</option>
        {COUNTRIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
      </select>
      <Link to={getTarget()} className="cta-orange" style={ctaStyle}>
        Show Best Match <ArrowRight size={13} />
      </Link>
    </div>
  );
}

function ButtonsV2({ mob }) {
  return (
    <div style={{ display: "flex", gap: mob ? 8 : 10, flexDirection: mob ? "column" : "row" }}>
      <select style={selectStyle}>
        <option>Asset type</option>
        {ASSETS.map(a => <option key={a.slug}>{a.label}</option>)}
      </select>
      <select style={selectStyle}>
        <option>Experience level</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Professional</option>
      </select>
      <Link to="/rankings" className="cta-orange" style={ctaStyle}>
        Find Broker <ArrowRight size={13} />
      </Link>
    </div>
  );
}

function ButtonsV3({ mob }) {
  return (
    <div style={{ display: "flex", gap: mob ? 8 : 10, flexDirection: mob ? "column" : "row" }}>
      <Link to="/compare" style={outlineBtn}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(30,41,59,0.8)"; e.currentTarget.style.color = "#e2e8f0"; }}
      >
        <BarChart3 size={14} /> Compare Brokers
      </Link>
      <Link to="/methodology" style={outlineBtn}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(30,41,59,0.8)"; e.currentTarget.style.color = "#e2e8f0"; }}
      >
        <BookOpen size={14} /> Our Methodology
      </Link>
      <Link to="/rankings" className="cta-orange" style={ctaStyle}>
        Browse All Rankings <ArrowRight size={13} />
      </Link>
    </div>
  );
}

function ButtonsV4({ mob, brokerCount }) {
  return (
    <div style={{ display: "flex", gap: mob ? 8 : 10, flexDirection: mob ? "column" : "row" }}>
      <select style={{ ...selectStyle, paddingLeft: 36, position: "relative" }}>
        <option>United Kingdom</option>
        {COUNTRIES.map(c => <option key={c.slug}>{c.name}</option>)}
      </select>
      <Link to="/reviews" style={outlineBtn}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(30,41,59,0.8)"; e.currentTarget.style.color = "#e2e8f0"; }}
      >
        All {brokerCount} Reviews
      </Link>
      <Link to="/best-forex-brokers-uk" className="cta-orange" style={ctaStyle}>
        Find Best Broker <ArrowRight size={13} />
      </Link>
    </div>
  );
}

const BUTTON_COMPONENTS = { "1": ButtonsV1, "2": ButtonsV2, "3": ButtonsV3, "4": ButtonsV4 };

/* ───── MAIN COMPONENT ───── */
export default function HeroButtonsProto() {
  const { mob, tab } = useMedia();
  const [active, setActive] = useState("1");
  const cn = { maxWidth: 1080, margin: "0 auto", padding: mob ? "0 20px" : "0 32px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const ButtonsComponent = BUTTON_COMPONENTS[active];

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* ── VARIANT SWITCHER ── */}
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
            borderColor: active === v.key ? "#f59e0b" : "rgba(255,255,255,0.12)",
            background: active === v.key ? "#f59e0b" : "transparent",
            color: active === v.key ? "#0f172a" : "rgba(255,255,255,0.5)",
            fontSize: mob ? 11 : 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
            whiteSpace: "nowrap", transition: "all 0.15s",
          }}>{v.key}: {v.label}</button>
        ))}
      </div>

      {/* ── VARIANT LABEL ── */}
      <div style={{
        textAlign: "center", padding: "10px 16px",
        background: "#f8f9fb", borderBottom: "1px solid #e5e7eb",
        fontSize: 13, color: "#6b7280",
      }}>
        <strong style={{ color: "#0f172a" }}>Variant {active}: {VARIANTS.find(v => v.key === active)?.label}</strong>{" "}
        <span>{VARIANTS.find(v => v.key === active)?.desc}</span>
      </div>

      {/* ── HERO ── */}
      <section style={{
        borderTop: "3px solid #f59e0b",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
        padding: mob ? "28px 16px 24px" : "36px 28px 32px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
        }} />
        <div style={{ ...cn, position: "relative", zIndex: 1, display: mob ? "block" : "flex", alignItems: "center", gap: 32 }}>

          {/* Left: Title */}
          <div style={{ flex: 1, marginBottom: mob ? 16 : 0 }}>
            <h1 style={{
              fontFamily: "'Outfit',sans-serif", fontWeight: 800,
              fontSize: mob ? 28 : tab ? 36 : 42, lineHeight: 1.08, color: "#fff",
              marginBottom: 8, letterSpacing: "-0.04em",
            }}>
              Find Your Perfect Broker
            </h1>
            <p style={{ fontSize: mob ? 14 : 15, color: "rgba(255,255,255,0.55)", maxWidth: 420, lineHeight: 1.6, marginBottom: mob ? 8 : 0 }}>
              {allBrokers.length} brokers compared across 130+ data points
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4,
            }}>
              {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#fbbf24", fontSize: 14 }}>{s}</span>)}
              <span style={{ marginLeft: 4 }}>Trusted by traders worldwide</span>
            </div>
          </div>

          {/* Right: Stats + Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
            {!mob && (
              <div style={{ display: "flex", gap: 20, marginBottom: 4 }}>
                {[
                  { n: allBrokers.length, l: "Brokers" },
                  { n: HUBS.length, l: "Categories" },
                  { n: RANKINGS.length + "+", l: "Rankings" },
                  { n: "130+", l: "Data Points" },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, fontWeight: 700, color: "#fff" }}>{s.n}</span>
                    <span style={{ fontSize: 10, color: "#34d399", fontWeight: 500, marginLeft: 4 }}>{s.l}</span>
                  </div>
                ))}
              </div>
            )}
            <ButtonsComponent mob={mob} brokerCount={allBrokers.length} />
          </div>
        </div>
      </section>

      {/* ── PILL NAV (only 8 categories) ── */}
      <div style={{
        background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: mob ? "10px 16px" : "12px 28px",
        overflowX: "auto", WebkitOverflowScrolling: "touch",
      }}>
        <div style={{ ...cn, display: "flex", gap: 8, minWidth: "max-content" }}>
          {HUBS.map(hub => (
            <Link key={hub.slug} to={hub.path} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600,
              textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            >
              <Icon name={hub.slug === "futures" ? "timer" : hub.icon} size={13} />
              {hub.name}
              <span style={{ fontSize: 10, opacity: 0.5 }}>{getRankingsForHub(hub).length}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── PLACEHOLDER CONTENT ── */}
      <section style={{ padding: mob ? "48px 16px" : "64px 28px" }}>
        <div style={{ ...cn, textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            Broker cards, rankings, and other homepage sections would appear below
          </p>
        </div>
      </section>
    </div>
  );
}
