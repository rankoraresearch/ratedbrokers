/**
 * HomeV2Proto — "Editorial Shell" concept
 *
 * Панель тумблеров справа (DEV only). 5 knobs:
 *   shell            d2k | bare               — унифицированный white-shell для 4 проблемных блоков
 *   howWeRate        inset | full-bleed       — Premium Dark как inset 20r или full-bleed
 *   countryFeatured  off | ribbon             — убрать ли "★ Most Popular" + green border у UK
 *   categoryTone     mono | colored           — chips Forex/Stocks/Crypto monochrome vs radужные
 *   topBrokers       d2k-list | power-cards   — Top 10 как D2k list с Visit CTA vs текущие карточки
 *
 * Дефолты = новый вариант ("Editorial Shell"). Любой knob можно откатить к "bare/current" для сравнения.
 */
import { useState, useEffect, useId } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { getAllBrokersWithData } from "../data/brokers";
import RANKINGS from "../data/rankings";
import HUBS from "../data/categoryHubs";
import { POPULAR_PAIRS_BY_VERTICAL, canonicalPair, VERTICALS } from "../data/comparisons";
import BrokerLogo from "../components/BrokerLogo";
import { BrokerTypeSection } from "../components/BrokerTypeButtons";
import Icon from "../components/Icon";
import { ArrowRight, ArrowUpRight, BarChart3, BookOpen, Target, ChevronDown, ChevronUp, Shield, DollarSign, Star, Eye, Monitor, Zap } from "lucide-react";
import HOMEPAGE_SEO from "../data/homepageSeoContent";
import CountryFlag from "../components/CountryFlag";
import { AUTHORS } from "../data/authors";
import { getVisitUrl } from "../utils/visitUrl";

// ══════════════════════════════════════════════════════
// SHARED CONSTANTS (copied from Home.jsx — data-only)
// ══════════════════════════════════════════════════════
const HOW_WE_RATE_ICONS = {
  "Regulation & Safety": Shield,
  "Trading Costs": DollarSign,
  "User Reputation": Star,
  "Broker Transparency": Eye,
  "Platforms & Tools": Monitor,
  "Execution Model": Zap,
};

const VERTICAL_MAP = {
  forex: { label: "Forex", color: "#059669" },
  cfd: { label: "CFD", color: "#2563eb" },
  stocks: { label: "Stocks", color: "#0ea5e9" },
  crypto: { label: "Crypto", color: "#f59e0b" },
  options: { label: "Options", color: "#8b5cf6" },
  futures: { label: "Futures", color: "#ea580c" },
  "copy-trading": { label: "Copy", color: "#7c3aed" },
  "spread-betting": { label: "SB", color: "#dc2626" },
};

const COUNTRIES = [
  { code: "GB", name: "United Kingdom", geo: "UK", reg: "FCA", featured: true, brokers: 14, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-uk" },
    { label: "CFD", word: "Brokers", path: "/best-cfd-brokers-uk" },
    { label: "Stocks", word: "Brokers", path: "/best-stock-brokers-uk" },
    { label: "Spread Betting", word: "Platforms", path: "/best-spread-betting-uk" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-uk" },
    { label: "Copy Trading", word: "Platforms", path: "/best-copy-trading-uk" },
  ]},
  { code: "US", name: "United States", geo: "USA", reg: "SEC / NFA", brokers: 11, verticals: [
    { label: "Stocks", word: "Brokers", path: "/best-stock-brokers-usa" },
    { label: "Options", word: "Brokers", path: "/best-options-brokers-usa" },
    { label: "Futures", word: "Brokers", path: "/best-futures-brokers-usa" },
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-usa" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-usa" },
    { label: "Copy Trading", word: "Platforms", path: "/best-copy-trading-usa" },
  ]},
  { code: "AU", name: "Australia", geo: "Australia", reg: "ASIC", brokers: 12, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-australia" },
    { label: "CFD", word: "Brokers", path: "/best-cfd-brokers-australia" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-australia" },
  ]},
  { code: "DE", name: "Germany", geo: "Germany", reg: "BaFin", brokers: 10, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-germany" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-germany" },
  ]},
  { code: "AE", name: "UAE", geo: "UAE", reg: "DFSA / VARA", brokers: 9, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-uae" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-uae" },
  ]},
  { code: "SG", name: "Singapore", geo: "Singapore", reg: "MAS", brokers: 8, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-singapore" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-singapore" },
  ]},
  { code: "CA", name: "Canada", geo: "Canada", reg: "CIRO / CSA", brokers: 7, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-canada" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-canada" },
  ]},
  { code: "ZA", name: "South Africa", geo: "South Africa", reg: "FSCA", brokers: 8, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-south-africa" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-south-africa" },
  ]},
];

const scoreColor = (s) => s >= 9.0 ? "#059669" : s >= 8.0 ? "#2563eb" : "#d97706";
const scoreGrad = (s) => s >= 9.0
  ? "linear-gradient(135deg, #059669, #047857)"
  : s >= 8.0
  ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
  : "linear-gradient(135deg, #d97706, #b45309)";

// ══════════════════════════════════════════════════════
// KNOBS
// ══════════════════════════════════════════════════════
const DEFAULT_KNOBS = {
  shell: "d2k",
  howWeRate: "inset",
  countryFeatured: "off",
  categoryTone: "mono",
  topBrokers: "d2k-list",
};

const KNOB_OPTIONS = [
  { key: "shell", label: "Section shell", opts: [
    { v: "d2k", t: "D2k white shell" },
    { v: "bare", t: "Bare (current)" },
  ]},
  { key: "howWeRate", label: "How We Rate", opts: [
    { v: "inset", t: "Inset 20r" },
    { v: "full-bleed", t: "Full-bleed (current)" },
  ]},
  { key: "countryFeatured", label: "Country #1 badge", opts: [
    { v: "off", t: "Off (flat)" },
    { v: "ribbon", t: "★ ribbon (current)" },
  ]},
  { key: "categoryTone", label: "Compare chips", opts: [
    { v: "mono", t: "Monochrome" },
    { v: "colored", t: "Colored (current)" },
  ]},
  { key: "topBrokers", label: "Top Brokers", opts: [
    { v: "d2k-list", t: "D2k list + Visit" },
    { v: "power-cards", t: "Power cards (current)" },
  ]},
];

function KnobPanel({ knobs, setKnobs }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{
      position: "fixed", top: 88, right: 16, zIndex: 9999,
      fontFamily: "'DM Sans',system-ui,sans-serif",
      maxWidth: 280,
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", padding: "10px 14px",
        background: "#0f172a", color: "#f8fafc", border: "none",
        borderRadius: open ? "10px 10px 0 0" : 10, cursor: "pointer",
        fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 8px 24px rgba(15,23,42,0.25)",
      }}>
        <span>Editorial Shell · v2</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div style={{
          background: "#fff", padding: 14,
          border: "1px solid #e2e8f0", borderTop: "none",
          borderRadius: "0 0 10px 10px",
          boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          {KNOB_OPTIONS.map(kn => (
            <div key={kn.key}>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b",
                marginBottom: 6,
              }}>{kn.label}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {kn.opts.map(o => {
                  const active = knobs[kn.key] === o.v;
                  return (
                    <button key={o.v} onClick={() => setKnobs(k => ({ ...k, [kn.key]: o.v }))}
                      style={{
                        padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: active ? "#0f172a" : "#fff",
                        color: active ? "#fff" : "#0f172a",
                        border: `1px solid ${active ? "#0f172a" : "#e2e8f0"}`,
                        cursor: "pointer",
                      }}>{o.t}</button>
                  );
                })}
              </div>
            </div>
          ))}
          <button onClick={() => setKnobs(DEFAULT_KNOBS)} style={{
            marginTop: 4, padding: "6px 10px", borderRadius: 6,
            background: "#f1f5f9", color: "#475569", border: "none",
            fontSize: 11, fontWeight: 600, cursor: "pointer",
          }}>Reset to Editorial Shell</button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// D2k SHELL — unified white wrapper
// ══════════════════════════════════════════════════════
function SectionShell({ title, eyebrow, right, children, mob, enabled = true, maxWidth = 1200 }) {
  const wrap = { maxWidth, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  if (!enabled) return (<div style={wrap}>{children}</div>);
  return (
    <div style={wrap}>
      <div style={{
        background: "#fff", borderRadius: 14, border: "none",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>
        <header style={{
          padding: mob ? "16px 16px 12px" : "20px 24px 14px",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16,
        }}>
          <div>
            {eyebrow && (
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "#f59e0b", marginBottom: 8,
              }}>{eyebrow}</div>
            )}
            <h2 style={{
              fontFamily: "'Outfit',sans-serif", fontWeight: 800,
              fontSize: mob ? 18 : 22, color: "#0f172a", letterSpacing: "-0.02em",
              margin: 0, lineHeight: 1.2,
            }}>{title}</h2>
          </div>
          {right && <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, textAlign: "right" }}>{right}</div>}
        </header>
        {children}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// TOP BROKERS — D2k list (new) or Power Cards (legacy)
// ══════════════════════════════════════════════════════
function TopBrokersD2kList({ mob, tab, lp, brokers }) {
  const topN = mob ? 8 : 10;
  return (
    <div style={{ padding: mob ? "6px 8px 10px" : "8px 10px 12px" }}>
      <div className="d2k-list" style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr",
        gap: 0,
      }}>
        {brokers.slice(0, topN).map((broker, i) => {
          const b = broker.B;
          const visitUrl = getVisitUrl(broker.slug, b.url);
          const isTop3 = i < 3;
          return (
            <div key={broker.slug} className="d2k-row" style={{
              display: "flex", alignItems: "center", gap: mob ? 10 : 12,
              padding: mob ? "12px 10px" : "14px 14px",
              background: "transparent", border: "1px solid transparent",
              borderRadius: 10, color: "#0f172a",
              transition: "box-shadow 160ms, border-color 160ms",
              position: "relative",
            }}>
              {/* Rank badge */}
              <span style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isTop3 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9",
                color: isTop3 ? "#fff" : "#475569",
                fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800,
              }}>#{i + 1}</span>
              {/* Clickable area → review page (logo + name + score) */}
              <Link to={lp(`/reviews/${broker.slug}`)} style={{
                display: "flex", alignItems: "center", gap: mob ? 10 : 12,
                flex: 1, minWidth: 0, textDecoration: "none", color: "inherit",
              }}>
                <div style={{
                  width: mob ? 40 : 44, height: mob ? 40 : 44, borderRadius: 10,
                  overflow: "hidden", flexShrink: 0,
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
                }}>
                  <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={mob ? 40 : 44} shape="icon" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Outfit',sans-serif", fontWeight: 700,
                    fontSize: mob ? 14 : 15, color: "#0f172a", letterSpacing: "-0.01em",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{b.name}</div>
                  <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                    {(b.verticals || []).slice(0, 3).map(v => VERTICAL_MAP[v]?.label).filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div style={{
                  width: 40, height: 28, borderRadius: 7,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: scoreGrad(b.score), color: "#fff",
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800,
                  flexShrink: 0,
                }}>{b.score}</div>
              </Link>
              {/* Visit CTA — affiliate, sibling to Link */}
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored"
                className="cta-orange" style={{
                  padding: mob ? "6px 10px" : "7px 12px", borderRadius: 8,
                  fontFamily: "'Outfit',sans-serif", fontSize: 11.5, fontWeight: 700,
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                  textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3,
                  flexShrink: 0, whiteSpace: "nowrap",
                }}
                aria-label={`Visit ${b.name}`}
              >
                Visit <ArrowUpRight size={12} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopBrokersPowerCards({ mob, tab, lp, brokers }) {
  return (
    <div style={{ padding: mob ? "16px" : "20px 24px 24px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
        gap: mob ? 12 : 16,
      }}>
        {brokers.slice(0, mob ? 3 : 6).map(broker => {
          const b = broker.B;
          const visitUrl = getVisitUrl(broker.slug, b.url);
          return (
            <div key={broker.slug} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: mob ? "16px" : "20px",
              background: "#fff",
              borderRadius: 14, border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
            }}>
              <Link to={lp(`/reviews/${broker.slug}`)} style={{
                width: 56, height: 56, borderRadius: 14, overflow: "hidden", flexShrink: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}>
                <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={56} shape="icon" />
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={lp(`/reviews/${broker.slug}`)} style={{
                  fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15,
                  color: "#0f172a", textDecoration: "none", display: "block",
                }}>{b.name}</Link>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{b.type}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <div style={{
                  width: 44, height: 34, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: scoreGrad(b.score),
                  fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 800, color: "#fff",
                }}>{b.score}</div>
                <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                  textDecoration: "none",
                }}>Visit</a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// ALL REVIEWS — D2k list (new) or dark tiles (current)
// ══════════════════════════════════════════════════════
function AllReviewsD2k({ mob, tab, lp, brokers }) {
  return (
    <div style={{ padding: mob ? "6px 8px 10px" : "8px 10px 14px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
        gap: 0,
      }}>
        {brokers.map(b => (
          <Link key={b.slug} to={lp(`/reviews/${b.slug}`)} className="d2k-row" style={{
            display: "flex", alignItems: "center", gap: mob ? 10 : 12,
            padding: mob ? "9px 10px" : "10px 14px",
            background: "transparent", border: "1px solid transparent",
            borderRadius: 8, textDecoration: "none", color: "#0f172a",
            transition: "box-shadow 160ms, border-color 160ms",
          }}>
            <div style={{
              width: mob ? 60 : 72, height: mob ? 28 : 32, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "#f8f9fb", borderRadius: 6, padding: "4px 8px",
            }}>
              <img src={`${import.meta.env.BASE_URL}logos-wide/${b.slug}.svg`} alt={b.B.name} loading="lazy"
                onError={e => { e.target.outerHTML = `<span style="font-family:'Outfit',sans-serif;font-weight:800;font-size:11px;color:#475569">${b.B.name}</span>`; }}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: mob ? 13 : 14,
                color: "#0f172a", display: "block",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{b.B.name}</span>
            </div>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 12 : 13, fontWeight: 800,
              color: scoreColor(b.B.score), flexShrink: 0, minWidth: 32, textAlign: "right",
            }}>{b.B.score}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AllReviewsDarkTiles({ mob, tab, lp, brokers }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
      gap: mob ? 6 : 8,
      padding: mob ? "16px" : "20px 24px",
    }}>
      {brokers.map(b => (
        <Link key={b.slug} to={lp(`/reviews/${b.slug}`)} style={{
          display: "flex", alignItems: "center", gap: mob ? 10 : 14,
          padding: mob ? "8px 10px" : "10px 16px", borderRadius: 10,
          background: "#0f172a", textDecoration: "none",
          border: "1px solid #1e293b", transition: "all 0.2s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.borderColor = "#34d399"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.borderColor = "#1e293b"; }}
        >
          <div style={{ width: mob ? 56 : 72, height: mob ? 28 : 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${b.slug}.svg`} alt={b.B.name} loading="lazy"
              onError={e => { e.target.style.display = "none"; }}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: mob ? 13 : 14, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.B.name}</span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 12 : 13, fontWeight: 800, color: scoreColor(b.B.score), flexShrink: 0 }}>{b.B.score}</span>
        </Link>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// FAQ accordion
// ══════════════════════════════════════════════════════
function FaqItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div style={{ borderBottom: "1px solid #e2e8f0" }}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", padding: "18px 0", border: "none", background: "none",
        cursor: "pointer", textAlign: "left", gap: 12,
      }}>
        <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", flex: 1 }}>{question}</span>
        {open ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
      </button>
      {open && (<p id={id} style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: "0 0 18px 0" }}>{answer}</p>)}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════
export default function HomeV2Proto() {
  const { mob, tab } = useMedia();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const [knobs, setKnobs] = useState(DEFAULT_KNOBS);

  const allBrokersData = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);

  useEffect(() => { document.title = "Home V2 Proto — Editorial Shell · RatedBrokers"; }, []);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const shellOn = knobs.shell === "d2k";

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>
      <KnobPanel knobs={knobs} setKnobs={setKnobs} />

      {/* ═══ 1. HERO — Premium Dark (unchanged) ═══ */}
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
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "0 20px" : "0 32px", position: "relative", zIndex: 1, display: mob ? "block" : "flex", alignItems: "center", gap: 32 }}>
          <div style={{ flex: 1, marginBottom: mob ? 16 : 0 }}>
            <h1 style={{
              fontFamily: "'Outfit',sans-serif", fontWeight: 800,
              fontSize: mob ? 28 : tab ? 36 : 42, lineHeight: 1.08, color: "#fff",
              marginBottom: 8, letterSpacing: "-0.04em",
            }}>{HOMEPAGE_SEO.h1}</h1>
            <p style={{ fontSize: mob ? 14 : 15, color: "rgba(255,255,255,0.55)", maxWidth: 420, lineHeight: 1.6, marginBottom: mob ? 8 : 0 }}>
              {allBrokersData.length} brokers compared across 130+ data points
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
            {!mob && (
              <div style={{ display: "flex", gap: 20, marginBottom: 4 }}>
                {[
                  { n: allBrokersData.length, l: "Brokers" },
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
            <div style={{ display: "flex", gap: mob ? 8 : 10, flexDirection: mob ? "column" : "row" }}>
              <Link to="/find-your-broker" className="cta-orange" style={{
                padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
              }}><Target size={14} /> Find Your Broker</Link>
              {!mob && <Link to="/compare" style={{
                padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "rgba(30,41,59,0.8)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
              }}><BarChart3 size={14} /> Compare Brokers</Link>}
              <Link to="/rankings" className="cta-orange" style={{
                padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
              }}>Browse All Rankings <ArrowRight size={13} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. BROKER TYPES (FROZEN) ═══ */}
      <BrokerTypeSection />

      {/* ═══ 3. TOP RATED BROKERS — D2k list or legacy cards ═══ */}
      <section style={{ padding: mob ? "36px 0 8px" : "52px 0 12px" }}>
        <SectionShell
          mob={mob}
          enabled={shellOn}
          eyebrow="Editorial pick"
          title={`Top ${knobs.topBrokers === "d2k-list" ? (mob ? 8 : 10) : (mob ? 3 : 6)} Online Brokers 2026`}
          right={`${allBrokersData.length} brokers · sorted by score`}
        >
          {knobs.topBrokers === "d2k-list"
            ? <TopBrokersD2kList mob={mob} tab={tab} lp={lp} brokers={allBrokersData} />
            : <TopBrokersPowerCards mob={mob} tab={tab} lp={lp} brokers={allBrokersData} />
          }
          <div style={{
            padding: mob ? "10px 16px 14px" : "12px 24px 18px",
            borderTop: "1px solid rgba(0,0,0,0.04)",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
          }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>
              Updated Q1 2026 · Sponsored: we earn commission on referrals. <Link to={lp("/how-we-make-money")} className="link-green">Learn more</Link>
            </span>
            <Link to={lp("/reviews")} className="link-green" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              View all {allBrokersData.length} reviews <ArrowRight size={12} className="link-arrow" />
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* ═══ 4. HOW WE RATE — Premium Dark (inset or full-bleed) ═══ */}
      {knobs.howWeRate === "inset" ? (
        <section style={{ padding: mob ? "16px 16px 40px" : "20px 24px 56px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", borderRadius: 20, overflow: "hidden", position: "relative" }}>
            <HowWeRateInner mob={mob} tab={tab} lp={lp} inset />
          </div>
        </section>
      ) : (
        <section style={{
          position: "relative",
          background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
          color: "#fff",
        }}>
          <HowWeRateInner mob={mob} tab={tab} lp={lp} />
        </section>
      )}

      {/* ═══ 5. COUNTRIES — D2k shell or bare ═══ */}
      <section style={{ padding: mob ? "28px 0" : "48px 0" }}>
        <SectionShell
          mob={mob}
          enabled={shellOn}
          eyebrow="By country"
          title="Best Regulated Brokers by Country 2026"
          right={`8 markets · 293+ rankings`}
        >
          <div style={{ padding: mob ? "14px 14px 18px" : "18px 20px 22px" }}>
            <div style={mob ? {
              display: "flex", overflowX: "auto", gap: 12,
              scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", paddingBottom: 4,
            } : {
              display: "grid",
              gridTemplateColumns: tab ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: 14,
            }}>
              {COUNTRIES.map((c, i) => {
                const showRibbon = knobs.countryFeatured === "ribbon" && c.featured;
                return (
                  <div key={i} style={{
                    display: "flex", flexDirection: "column",
                    minHeight: mob ? "auto" : 140,
                    borderRadius: 14, overflow: "visible",
                    background: "#fff",
                    border: showRibbon ? "2px solid #059669" : "1px solid #e8ecf1",
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.04)",
                    transition: "border-color 180ms, box-shadow 180ms, transform 180ms",
                    position: "relative",
                    ...(mob ? { minWidth: 270, maxWidth: 290, flexShrink: 0, scrollSnapAlign: "start" } : {}),
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = showRibbon ? "#059669" : "#e8ecf1"; e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.04)"; }}
                  >
                    {showRibbon && (
                      <span style={{
                        position: "absolute", top: -10, right: 14,
                        padding: "3px 10px", borderRadius: 8,
                        background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                        fontSize: 10, fontWeight: 700, lineHeight: 1, whiteSpace: "nowrap", zIndex: 2,
                      }}>★ Most Popular</span>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: mob ? "16px 16px 0" : "16px 18px 0" }}>
                      <CountryFlag code={c.code} size={mob ? 32 : 36} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: mob ? 15 : 16 }}>{c.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                          <span style={{
                            padding: "2px 8px", borderRadius: 6,
                            background: "#0f172a", color: "#fff",
                            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
                          }}>{c.reg}</span>
                          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{c.brokers} brokers</span>
                        </div>
                      </div>
                      <ArrowRight size={16} color="#cbd5e1" style={{ flexShrink: 0 }} />
                    </div>
                    <div style={{ height: 1, background: "#f0f4f8", margin: mob ? "10px 16px 0" : "12px 18px 0" }} />
                    <div style={{ display: "flex", gap: mob ? 8 : 10, flexWrap: "wrap", alignItems: "center", padding: mob ? "10px 16px 14px" : "12px 18px 14px", marginTop: "auto" }}>
                      {c.verticals.map((v, vi) => (
                        <Link key={vi} to={lp(v.path)} style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          textDecoration: "none", padding: "2px 0", lineHeight: 1.3,
                        }}
                          onMouseEnter={e => { const t = e.currentTarget.querySelector(".country-vl"); if (t) { t.style.color = "#047857"; t.style.borderBottomColor = "#047857"; } }}
                          onMouseLeave={e => { const t = e.currentTarget.querySelector(".country-vl"); if (t) { t.style.color = "#059669"; t.style.borderBottomColor = "transparent"; } }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669", flexShrink: 0 }} />
                          <span className="country-vl" style={{ fontSize: 11.5, fontWeight: 500, color: "#059669", letterSpacing: "0.01em", borderBottom: "1px solid transparent", transition: "all 0.15s" }}>
                            {v.label} {v.word} {c.geo}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {mob && <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Swipe to see more countries →</div>}
          </div>
          <div style={{
            padding: mob ? "10px 16px 14px" : "12px 24px 18px",
            borderTop: "1px solid rgba(0,0,0,0.04)",
            textAlign: "center",
          }}>
            <Link to={lp("/best-forex-brokers-by-country")} className="link-green" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              Browse 293+ rankings across 45 countries <ArrowRight size={14} className="link-arrow" />
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* ═══ 6. SIDE-BY-SIDE COMPARE — navy inset hero + monochrome pills ═══ */}
      <section style={{ padding: mob ? "12px 0 28px" : "16px 0 48px" }}>
        <SectionShell
          mob={mob}
          enabled={shellOn}
          eyebrow="Head-to-head"
          title="Compare Online Brokers — Forex, Stocks & Crypto"
          right="Pick any two of 52"
        >
          <div style={{ padding: mob ? "14px 14px 6px" : "18px 20px 8px" }}>
            <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.65, color: "#475569", margin: "0 0 14px", maxWidth: 640 }}>
              Scores, fees and regulation side by side. Fresh data updated quarterly.
            </p>
            {/* Category pills — monochrome vs colored */}
            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              {["forex", "stocks", "crypto"].map(key => {
                const vert = VERTICALS.find(v => v.key === key);
                const label = vert?.label || key;
                if (knobs.categoryTone === "mono") {
                  return (
                    <span key={key} style={{
                      padding: "5px 12px", borderRadius: 6,
                      background: "#fff", border: "1px solid #e2e8f0",
                      color: "#0f172a", fontSize: 12, fontWeight: 700,
                      display: "inline-flex", alignItems: "center", gap: 6,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#059669" }} />
                      {label}
                    </span>
                  );
                }
                const color = VERTICAL_MAP[key]?.color || "#64748b";
                return (
                  <span key={key} style={{
                    padding: "4px 12px", borderRadius: 6,
                    background: `${color}12`, border: `1px solid ${color}30`,
                    color, fontSize: 12, fontWeight: 700,
                    display: "inline-flex", alignItems: "center", gap: 5,
                  }}>
                    {vert && <Icon name={vert.icon} size={13} />}
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
          <div style={{
            padding: mob ? "0 14px 18px" : "0 20px 22px",
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: 14,
          }}>
            {[
              ...(POPULAR_PAIRS_BY_VERTICAL.forex || []).slice(0, 2).map(p => ({ ...p, cat: "Forex" })),
              ...(POPULAR_PAIRS_BY_VERTICAL.stocks || []).slice(0, 2).map(p => ({ ...p, cat: "Stocks" })),
              ...(POPULAR_PAIRS_BY_VERTICAL.crypto || []).slice(0, 2).map(p => ({ ...p, cat: "Crypto" })),
            ].map((pair, i) => {
              const brokerA = allBrokersData.find(b => b.slug === pair.slugA);
              const brokerB = allBrokersData.find(b => b.slug === pair.slugB);
              if (!brokerA || !brokerB) return null;
              const pairSlug = canonicalPair(pair.slugA, pair.slugB);
              return (
                <Link key={i} to={lp(`/compare/${pairSlug}`)} style={{
                  display: "flex", flexDirection: "column",
                  borderRadius: 14, background: "#fff", border: "1px solid #e8ecf1",
                  overflow: "hidden", textDecoration: "none", color: "#0f172a",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; e.currentTarget.style.borderColor = "#e8ecf1"; }}
                >
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
                    padding: "18px 12px", position: "relative",
                  }}>
                    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                      <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${pair.slugA}.svg`} alt={brokerA.B.name}
                        style={{ maxWidth: "80%", height: 28, objectFit: "contain" }}
                        onError={e => { e.target.style.display = "none"; }} />
                    </div>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: 9, color: "#0f172a",
                    }}>VS</div>
                    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                      <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${pair.slugB}.svg`} alt={brokerB.B.name}
                        style={{ maxWidth: "80%", height: 28, objectFit: "contain" }}
                        onError={e => { e.target.style.display = "none"; }} />
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14 }}>
                        {brokerA.B.name} vs {brokerB.B.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, fontWeight: 500 }}>
                        Fees · Regulation · Platforms
                      </div>
                    </div>
                    {knobs.categoryTone === "mono" ? (
                      <span style={{
                        padding: "3px 9px", borderRadius: 6,
                        background: "#f1f5f9", color: "#475569",
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.02em",
                      }}>{pair.cat}</span>
                    ) : (
                      <span style={{
                        padding: "3px 9px", borderRadius: 6,
                        background: `${VERTICAL_MAP[pair.cat.toLowerCase()]?.color || "#64748b"}12`,
                        color: VERTICAL_MAP[pair.cat.toLowerCase()]?.color || "#64748b",
                        fontSize: 11, fontWeight: 700,
                      }}>{pair.cat}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <div style={{
            padding: mob ? "10px 16px 14px" : "12px 24px 18px",
            borderTop: "1px solid rgba(0,0,0,0.04)",
            textAlign: "right",
          }}>
            <Link to={lp("/compare")} className="link-green" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              Compare any 2 of {allBrokersData.length} brokers <ArrowRight size={12} className="link-arrow" />
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* ═══ 7. ALL BROKER REVIEWS — D2k shell or dark tiles ═══ */}
      <section style={{ padding: mob ? "12px 0 28px" : "16px 0 48px" }}>
        <SectionShell
          mob={mob}
          enabled={shellOn}
          eyebrow="Full library"
          title={`All ${allBrokersData.length} Broker Reviews — Updated April 2026`}
          right="Sorted by score"
        >
          {shellOn
            ? <AllReviewsD2k mob={mob} tab={tab} lp={lp} brokers={allBrokersData} />
            : <AllReviewsDarkTiles mob={mob} tab={tab} lp={lp} brokers={allBrokersData} />
          }
        </SectionShell>
      </section>

      {/* ═══ 8. HOW TO CHOOSE — SEO block (unchanged) ═══ */}
      <section style={{ ...cn, padding: mob ? "28px 16px 40px" : "40px 24px 56px" }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 8 }}>
          {HOMEPAGE_SEO.howToChoose.heading}
        </h2>
        <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#475569", maxWidth: 800, marginBottom: 24 }}>
          {HOMEPAGE_SEO.howToChoose.intro}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 800 }}>
          {HOMEPAGE_SEO.howToChoose.sections.map((s, i) => (
            <div key={i}>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: mob ? 16 : 18, color: "#0f172a", marginBottom: 6 }}>
                {s.subheading}
              </h3>
              <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>{s.text}</p>
              {s.link && (
                <Link to={lp(s.link.path)} className="link-green" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                  {s.link.text} <ArrowRight size={12} className="link-arrow" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 9. ABOUT — Navy closing anchor (unchanged) ═══ */}
      <section style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)", padding: mob ? "48px 16px" : "64px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: mob ? 16 : 24, marginBottom: mob ? 32 : 48,
          }}>
            {[
              { n: "52+", l: "Brokers Tested" },
              { n: RANKINGS.length + "+", l: "Rankings" },
              { n: "924+", l: "Pages" },
              { n: "130+", l: "Data Points" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", borderRight: (!mob && i < 3) ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: mob ? 28 : 40, color: "#34d399", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: mob ? 11 : 13, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 40px" }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 30, color: "#f8fafc", marginBottom: 16, letterSpacing: "-0.03em" }}>
              Independent Research. No Paid Placements.
            </h2>
            <p style={{ fontSize: mob ? 15 : 17, lineHeight: 1.7, color: "#cbd5e1" }}>
              Our analysts score brokers across 6 weighted categories using publicly available data, regulatory filings, and aggregated user reviews. We earn commissions when you open an account — but this never influences our rankings or reviews.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 10. EDITORIAL TEAM (Plate B — FROZEN, unchanged) ═══ */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "44px 16px" : "64px 24px" }}>
        <div style={{ maxWidth: 680, marginBottom: mob ? 20 : 28 }}>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#059669", marginBottom: 10,
          }}>Editorial Team</div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 24 : 28, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
            Meet the team behind every review
          </h2>
          <p style={{ fontSize: mob ? 14 : 15, color: "#64748b", lineHeight: 1.65, margin: "8px 0 0", maxWidth: 680 }}>
            Seven analysts and editors. Every broker review carries a byline and goes through a three-step editorial process.
          </p>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
          gap: mob ? 10 : 14,
        }}>
          {[
            ...Object.values(AUTHORS).filter(a => a.isFounder),
            ...Object.values(AUTHORS).filter(a => !a.isFounder),
          ].map(a => (
            <Link key={a.id} to={lp(`/author/${a.id}`)} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              textDecoration: "none", color: "#0f172a",
              background: "#fff", borderRadius: 12,
              border: "1px solid #e8ecf1",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
              position: "relative", overflow: "hidden",
              minHeight: mob ? 260 : 300,
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3, pointerEvents: "none",
                background: "linear-gradient(90deg, #047857 0%, #10b981 50%, #047857 100%)",
              }} />
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: mob ? "28px 16px 18px" : "32px 18px 22px",
                flex: 1, width: "100%",
              }}>
                <div style={{
                  width: mob ? 72 : 80, height: mob ? 72 : 80, borderRadius: "50%", overflow: "hidden",
                  background: "linear-gradient(180deg, #f8f9fb, #e8ecf1)",
                  boxShadow: "0 0 0 1px #fff, 0 0 0 2px #e8ecf1, 0 8px 16px rgba(15,23,42,0.08)",
                  marginBottom: 14,
                }}>
                  {a.image ? (
                    <img src={`${import.meta.env.BASE_URL}${a.image.replace(/^\//, "")}`} alt={a.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 26, color: "#059669" }}>{a.initials || a.name?.slice(0, 1)}</div>
                  )}
                </div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 14.5 : 16, color: "#0f172a", textAlign: "center", marginBottom: 4 }}>{a.name}</div>
                {a.credentials?.length > 0 && (
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: "#059669", letterSpacing: "0.1em", textAlign: "center", marginBottom: 6 }}>
                    {a.credentials.join(" · ")}
                  </div>
                )}
                <div style={{ fontSize: mob ? 12 : 12.5, color: "#64748b", fontWeight: 500, textAlign: "center" }}>{a.role}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 11. FAQ (unchanged) ═══ */}
      <section style={{ ...cn, padding: mob ? "12px 16px 48px" : "16px 24px 64px" }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 20 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: 0 }}>
          {HOMEPAGE_SEO.faq.map((item, i) => (
            <FaqItem key={i} question={item.q} answer={item.a} defaultOpen={i === 0} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// HOW WE RATE — shared inner (used in inset + full-bleed)
// ══════════════════════════════════════════════════════
function HowWeRateInner({ mob, tab, lp, inset }) {
  const container = {
    position: "relative",
    background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
    color: "#fff",
    padding: inset ? (mob ? "40px 20px" : "56px 40px") : (mob ? "56px 16px" : "80px 24px"),
    ...(inset ? {
      borderRadius: 20,
      boxShadow: "0 12px 40px rgba(15,23,42,0.28)",
      borderTop: "2px solid rgba(245,158,11,0.35)",
    } : {}),
  };
  return (
    <div style={container}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", borderRadius: inset ? 20 : 0,
        background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
      }} />
      <div style={{ position: "relative", maxWidth: inset ? 1120 : 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: mob ? 24 : 36, maxWidth: 760 }}>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600,
            letterSpacing: "0.18em", color: "#f59e0b", textTransform: "uppercase", marginBottom: 12,
          }}>Our Methodology · 6 categories · 130+ data points</div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 26 : 36, lineHeight: 1.1, letterSpacing: "-0.03em", margin: 0, marginBottom: 12 }}>
            How We Rate Online Brokers
          </h2>
          <p style={{ fontSize: mob ? 14 : 16, lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: 0 }}>
            {HOMEPAGE_SEO.howWeRate.intro}
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: mob ? 12 : 14, marginBottom: mob ? 24 : 32,
        }}>
          {HOMEPAGE_SEO.howWeRate.categories.map((cat, i) => {
            const weightNum = parseInt(cat.weight);
            const IconCmp = HOW_WE_RATE_ICONS[cat.name] || Shield;
            return (
              <div key={i} style={{
                padding: mob ? "18px" : "22px", borderRadius: 14,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.28)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <IconCmp size={18} color="#f59e0b" strokeWidth={1.75} />
                  </div>
                  <span style={{
                    padding: "3px 9px", borderRadius: 6,
                    background: "rgba(245,158,11,0.14)", color: "#fbbf24",
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800,
                  }}>{cat.weight}</span>
                </div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 6, letterSpacing: "-0.01em" }}>{cat.name}</div>
                <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 10 }}>
                  <div style={{ width: `${(weightNum / 30) * 100}%`, height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "rgba(255,255,255,0.68)", margin: 0 }}>{cat.desc}</p>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: mob ? 16 : 28, alignItems: mob ? "stretch" : "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: 0, maxWidth: 620 }}>
            {HOMEPAGE_SEO.howWeRate.closing}
          </p>
          <Link to={lp("/methodology")} style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "12px 20px", borderRadius: 10,
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            color: "#0f172a", textDecoration: "none",
            fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14,
            boxShadow: "0 8px 24px rgba(245,158,11,0.32)",
          }}>
            Read full methodology <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
