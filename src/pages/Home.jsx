import { useState, useEffect, useId } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useSEO } from "../hooks/useSEO";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { getAllBrokersWithData } from "../data/brokers";
import RANKINGS from "../data/rankings";
import HUBS, { getRankingsForHub } from "../data/categoryHubs";
import { POPULAR_PAIRS_BY_VERTICAL, canonicalPair, VERTICALS } from "../data/comparisons";
import BrokerLogo from "../components/BrokerLogo";
import Icon from "../components/Icon";
import { ArrowRight, BarChart3, BookOpen, Target, ChevronDown, ChevronUp, ArrowRightLeft, ChartCandlestick, Users, Dices, Bitcoin, TrendingUp, GitBranch, Hourglass } from "lucide-react";
import HOMEPAGE_SEO from "../data/homepageSeoContent";
import CountryFlag from "../components/CountryFlag";
import { AUTHORS } from "../data/authors";
import AuthorAvatar from "../components/AuthorAvatar";


// ══════════════════════════════════════════════════════
// CATEGORY NAV — Variants with switcher
// ══════════════════════════════════════════════════════
const RATE_CAT_META = {
  "Regulation & Safety": { color: "#059669", bg: "#ecfdf5", icon: "shield" },
  "Trading Costs": { color: "#2563eb", bg: "#eff6ff", icon: "dollar-sign" },
  "User Reputation": { color: "#16a34a", bg: "#f0fdf4", icon: "star" },
  "Broker Transparency": { color: "#7c3aed", bg: "#f5f3ff", icon: "eye" },
  "Platforms & Tools": { color: "#0284c7", bg: "#f0f9ff", icon: "monitor" },
  "Execution Model": { color: "#d97706", bg: "#fffbeb", icon: "zap" },
};
const RATE_NAV = [
  { icon: "bar-chart-3", title: "Scoring Methodology", path: "/methodology" },
  { icon: "book-open", title: "About RatedBrokers", path: "/about" },
  { icon: "shield", title: "Trust & Transparency", path: "/trust-score" },
];
const CAT_ICONS = {
  forex: ArrowRightLeft, cfd: ChartCandlestick, "copy-trading": Users,
  "spread-betting": Dices, crypto: Bitcoin, stocks: TrendingUp, options: GitBranch, futures: Hourglass,
};
const IC = { forex: "#fbbf24", cfd: "#60a5fa", "copy-trading": "#34d399", "spread-betting": "#f87171", crypto: "#f59e0b", stocks: "#38bdf8", options: "#a78bfa", futures: "#94a3b8" };
const PILL_ROWS = [
  { links: [
    { label: "Forex Brokers UK", path: "/best-forex-brokers-uk" },
    { label: "Lowest Spread Brokers", path: "/lowest-spread-forex-brokers" },
    { label: "ECN FX Brokers", path: "/best-ecn-forex-brokers" },
    { label: "MT5 Forex Brokers", path: "/best-mt5-forex-brokers" },
    { label: "Bitcoin Brokers", path: "/best-crypto-brokers" },
    { label: "Forex Brokers for Scalping", path: "/best-forex-brokers-for-scalping" },
    { label: "Zero Spread Forex Brokers", path: "/zero-spread-forex-brokers" },
    { label: "Forex Brokers India", path: "/best-forex-brokers-india" },
  ]},
];

function CategoryNav({ mob }) {
  const hubsData = HUBS.map(hub => ({
    ...hub,
    IconComp: CAT_ICONS[hub.slug] || ArrowRight,
  }));
  const hex2rgb = (h) => `${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`;
  return (
    <>
      {/* Quick Links — single pill strip (Dark + Stripes) */}
      <div style={{ background: "#1a2332", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: mob ? "10px 16px" : "12px 28px", overflowX: mob ? "auto" : "hidden", WebkitOverflowScrolling: "touch", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)" }} />
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: mob ? "0 4px" : "0 32px",
          display: "flex", alignItems: "center", gap: mob ? 8 : 6,
          ...(mob ? { minWidth: "max-content" } : {}),
        }}>
          {PILL_ROWS[0].links.map(ql => (
            <Link key={ql.path} to={ql.path} style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "6px 13px", borderRadius: 8,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: 600,
              textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.15s",
              ...(mob ? {} : { flex: 1 }),
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
            >{ql.label}</Link>
          ))}
        </div>
      </div>
      {/* 8 Category Buttons — Frost+Arrow */}
      <div style={{ background: "#0f172a", padding: mob ? "14px 16px" : "18px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "0 4px" : "0 32px", display: "grid", gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: mob ? 8 : 10 }}>
          {hubsData.map(hub => {
            const Ic = hub.IconComp;
            const c = IC[hub.slug] || "#94a3b8";
            const rgb = hex2rgb(c);
            return (
              <Link key={hub.slug} to={hub.path} style={{
                display: "flex", alignItems: "center", gap: 10,
                height: mob ? 48 : 52, padding: mob ? "0 14px 0 16px" : "0 18px 0 22px",
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
                borderTop: "1px solid rgba(255,255,255,0.14)", borderRight: "1px solid rgba(255,255,255,0.14)",
                borderBottom: "1px solid rgba(255,255,255,0.14)", borderLeft: `3px solid ${c}`,
                borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
                textDecoration: "none", transition: "background 0.18s, transform 0.18s, box-shadow 0.18s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.13)";
                  e.currentTarget.style.borderTopColor = "rgba(255,255,255,0.24)";
                  e.currentTarget.style.borderRightColor = "rgba(255,255,255,0.24)";
                  e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.24)";
                  e.currentTarget.style.borderLeft = `3px solid ${c}`;
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.35), -2px 0 10px rgba(${rgb},0.12)`;
                  const arr = e.currentTarget.querySelector("[data-arr]");
                  if (arr) { arr.style.color = `rgba(${rgb},0.80)`; arr.style.transform = "translateX(3px)"; }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderTopColor = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.borderRightColor = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.borderLeft = `3px solid ${c}`;
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)";
                  const arr = e.currentTarget.querySelector("[data-arr]");
                  if (arr) { arr.style.color = "rgba(255,255,255,0.15)"; arr.style.transform = "none"; }
                }}
              >
                <Ic size={17} strokeWidth={1.75} style={{ color: c, flexShrink: 0, opacity: 0.85 }} />
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: mob ? 14 : 15, fontWeight: 700, color: "#f8fafc", flex: 1 }}>{hub.name}</span>
                <span data-arr style={{ fontSize: 14, color: "rgba(255,255,255,0.15)", flexShrink: 0, transition: "color 0.18s, transform 0.18s", fontWeight: 700 }}>&#8594;</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════
const COUNTRIES = [
  { code: "GB", name: "United Kingdom", geo: "UK", reg: "FCA", featured: true, brokers: 14, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-uk", color: "#059669" },
    { label: "CFD", word: "Brokers", path: "/best-cfd-brokers-uk", color: "#2563eb" },
    { label: "Stocks", word: "Brokers", path: "/best-stock-brokers-uk", color: "#0ea5e9" },
    { label: "Spread Betting", word: "Platforms", path: "/best-spread-betting-uk", color: "#dc2626" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-uk", color: "#d97706" },
    { label: "Copy Trading", word: "Platforms", path: "/best-copy-trading-uk", color: "#7c3aed" },
  ]},
  { code: "US", name: "United States", geo: "USA", reg: "SEC / NFA", brokers: 11, verticals: [
    { label: "Stocks", word: "Brokers", path: "/best-stock-brokers-usa", color: "#0ea5e9" },
    { label: "Options", word: "Brokers", path: "/best-options-brokers-usa", color: "#7c3aed" },
    { label: "Futures", word: "Brokers", path: "/best-futures-brokers-usa", color: "#ea580c" },
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-usa", color: "#059669" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-usa", color: "#d97706" },
    { label: "Copy Trading", word: "Platforms", path: "/best-copy-trading-usa", color: "#7c3aed" },
  ]},
  { code: "AU", name: "Australia", geo: "Australia", reg: "ASIC", brokers: 12, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-australia", color: "#059669" },
    { label: "CFD", word: "Brokers", path: "/best-cfd-brokers-australia", color: "#2563eb" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-australia", color: "#d97706" },
  ]},
  { code: "DE", name: "Germany", geo: "Germany", reg: "BaFin", brokers: 10, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-germany", color: "#059669" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-germany", color: "#d97706" },
  ]},
  { code: "AE", name: "UAE", geo: "UAE", reg: "DFSA / VARA", brokers: 9, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-uae", color: "#059669" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-uae", color: "#d97706" },
  ]},
  { code: "SG", name: "Singapore", geo: "Singapore", reg: "MAS", brokers: 8, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-singapore", color: "#059669" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-singapore", color: "#d97706" },
  ]},
  { code: "CA", name: "Canada", geo: "Canada", reg: "CIRO / CSA", brokers: 7, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-canada", color: "#059669" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-canada", color: "#d97706" },
  ]},
  { code: "ZA", name: "South Africa", geo: "South Africa", reg: "FSCA", brokers: 8, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-south-africa", color: "#059669" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-south-africa", color: "#d97706" },
  ]},
];

// ── Helpers ──
const scoreColor = (s) => s >= 9.0 ? "#059669" : s >= 8.0 ? "#2563eb" : "#d97706";
import { getVisitUrl } from "../utils/visitUrl";

// ══════════════════════════════════════════════════════
// Top Rated Brokers — Power Cards
// ══════════════════════════════════════════════════════
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

function BrokerPowerCards({ mob, tab, lp, brokers }) {
  return (
    <>
      {/* ═══ TOP RATED BROKERS — Compact Grid (from F3) ═══ */}
      <section style={{ padding: mob ? "32px 16px" : "48px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "0 0" : "0 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Top Rated Brokers
            </h2>
            <Link to={lp("/reviews")} style={{ fontSize: 13, fontWeight: 600, color: "#059669", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              All {brokers.length} reviews <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: mob ? 12 : 16,
          }}>
            {brokers.slice(0, mob ? 3 : 6).map((broker, i) => {
              const b = broker.B;
              const visitUrl = getVisitUrl(broker.slug, b.url);
              return (
                <div key={broker.slug} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: mob ? "16px" : "20px",
                  background: "#fff",
                  borderRadius: 14, border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
                >
                  {/* Logo */}
                  <Link to={lp(`/reviews/${broker.slug}`)} style={{
                    width: 56, height: 56, borderRadius: 14, overflow: "hidden", flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.04)",
                    textDecoration: "none",
                  }}>
                    <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={56} shape="icon" />
                  </Link>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={lp(`/reviews/${broker.slug}`)} style={{
                      fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15,
                      letterSpacing: "-0.01em", color: "#0f172a", textDecoration: "none",
                      display: "block",
                    }}>{b.name}</Link>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{b.type}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      {(b.verticals || []).slice(0, 3).map(v => {
                        const vm = VERTICAL_MAP[v];
                        return vm ? <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, color: "#64748b" }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: vm.color }} />{vm.label}
                        </span> : null;
                      })}
                    </div>
                  </div>
                  {/* Score + Visit */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <div style={{
                      width: 44, height: 34, borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: b.score >= 9.0
                        ? "linear-gradient(135deg, #059669, #047857)"
                        : b.score >= 8.0
                        ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                        : "linear-gradient(135deg, #d97706, #b45309)",
                      fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 800,
                      color: "#fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section style={{
        background: "#0f172a", padding: mob ? "24px 16px" : "28px 24px",
        borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", gap: mob ? 24 : 56, flexWrap: "wrap" }}>
          {[
            { n: "130+", l: "Data Points Per Broker" },
            { n: "100%", l: "Independent Rankings" },
            { n: "51+", l: "Brokers Rated" },
            { n: "Q1 2026", l: "Last Updated" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 18 : 22, fontWeight: 700, color: "#34d399", letterSpacing: "-0.02em" }}>{s.n}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}


// ══════════════════════════════════════════════════════
// FAQ Accordion Item
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
        <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", flex: 1 }}>
          {question}
        </span>
        {open ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
      </button>
      {open && (
        <p id={id} style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: "0 0 18px 0" }}>
          {answer}
        </p>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════
export default function Home() {
  const { mob, tab } = useMedia();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  const allBrokersData = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);

  useSEO({
    title: HOMEPAGE_SEO.metaTitle,
    description: HOMEPAGE_SEO.metaDescription,
    path: "/",
  });

  useEffect(() => {
    document.title = HOMEPAGE_SEO.metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", HOMEPAGE_SEO.metaDescription);
    const schemas = [
      { "@context": "https://schema.org", "@type": "WebSite", name: "RatedBrokers", url: "https://ratedbrokers.com", description: "Independent online broker comparison platform. Expert reviews and rankings across forex, CFD, crypto, copy trading, and spread betting." },
      { "@context": "https://schema.org", "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com", logo: "https://ratedbrokers.com/logo.png" },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "RatedBrokers", item: "https://ratedbrokers.com/" }] },
      { "@context": "https://schema.org", "@type": "CollectionPage", name: HOMEPAGE_SEO.h1, url: "https://ratedbrokers.com/", description: HOMEPAGE_SEO.metaDescription, publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" } },
      { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: HOMEPAGE_SEO.faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ];
    let scriptEl = document.querySelector('script[data-jsonld="home"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-jsonld", "home");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemas);
    return () => { const el = document.querySelector('script[data-jsonld="home"]'); if (el) el.remove(); };
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* ===== REMOVED: Old category nav bar — replaced by pill strip inside hero ===== */}

      {/* ===== HERO — from HeroButtonsProto V3 (exact copy) ===== */}
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

          {/* Left: Title */}
          <div style={{ flex: 1, marginBottom: mob ? 16 : 0 }}>
            <h1 style={{
              fontFamily: "'Outfit',sans-serif", fontWeight: 800,
              fontSize: mob ? 28 : tab ? 36 : 42, lineHeight: 1.08, color: "#fff",
              marginBottom: 8, letterSpacing: "-0.04em",
            }}>
              {HOMEPAGE_SEO.h1}
            </h1>
            <p style={{ fontSize: mob ? 14 : 15, color: "rgba(255,255,255,0.55)", maxWidth: 420, lineHeight: 1.6, marginBottom: mob ? 8 : 0 }}>
              {allBrokersData.length} brokers compared across 130+ data points
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
            {/* V3: Top Actions */}
            <div style={{ display: "flex", gap: mob ? 8 : 10, flexDirection: mob ? "column" : "row" }}>
              <Link to="/find-your-broker" className="cta-orange" style={{
                padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, whiteSpace: "nowrap", cursor: "pointer",
                boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
              }}>
                <Target size={14} /> Find Your Broker
              </Link>
              {!mob && <Link to="/compare" style={{
                padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "rgba(30,41,59,0.8)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0",
                textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, whiteSpace: "nowrap", cursor: "pointer", transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(30,41,59,0.8)"; e.currentTarget.style.color = "#e2e8f0"; }}
              >
                <BarChart3 size={14} /> Compare Brokers
              </Link>}
              {!mob && <Link to="/methodology" style={{
                padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "rgba(30,41,59,0.8)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0",
                textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, whiteSpace: "nowrap", cursor: "pointer", transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(30,41,59,0.8)"; e.currentTarget.style.color = "#e2e8f0"; }}
              >
                <BookOpen size={14} /> Our Methodology
              </Link>}
              <Link to="/rankings" className="cta-orange" style={{
                padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", textDecoration: "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6, whiteSpace: "nowrap",
              }}>
                Browse All Rankings <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY NAV ===== */}
      <CategoryNav mob={mob} />

      {/* ===== SEO INTRO ===== */}
      <section style={{ ...cn, padding: mob ? "28px 16px 0" : "36px 24px 0" }}>
        <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#475569", maxWidth: 800 }}>
          {HOMEPAGE_SEO.intro.text}{" "}
          <Link to={lp(HOMEPAGE_SEO.intro.links[0].path)} style={{ color: "#059669", fontWeight: 600, textDecoration: "none" }}>{HOMEPAGE_SEO.intro.links[0].text}</Link>
          {" "}explains our scoring formula.{" "}
          Learn <Link to={lp(HOMEPAGE_SEO.intro.links[1].path)} style={{ color: "#059669", fontWeight: 600, textDecoration: "none" }}>{HOMEPAGE_SEO.intro.links[1].text}</Link>.
        </p>
      </section>

      {/* ===== BROKER SHOWCASE — Power Cards ===== */}
      <BrokerPowerCards mob={mob} tab={tab} lp={lp} brokers={allBrokersData} />

      {/* ===== HOW WE RATE BROKERS — SEO block (A5 Left Accent) ===== */}
      <section style={{ background: "#f8fafc", padding: mob ? "40px 16px" : "56px 24px" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 12 }}>
            {HOMEPAGE_SEO.howWeRate.heading}
          </h2>
          <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#475569", maxWidth: 800, marginBottom: 28 }}>
            {HOMEPAGE_SEO.howWeRate.intro}
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: mob ? 12 : 16, marginBottom: 24,
          }}>
            {HOMEPAGE_SEO.howWeRate.categories.map((cat, i) => {
              const m = RATE_CAT_META[cat.name] || { color: "#059669", bg: "#ecfdf5", icon: "shield" };
              const weightNum = parseInt(cat.weight);
              return (
                <div key={i} style={{
                  borderRadius: 14, background: "#fff",
                  border: "1px solid #f1f5f9", borderLeft: `3px solid ${m.color}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  overflow: "hidden", transition: "all 0.2s ease",
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ padding: mob ? "18px 16px" : "22px 20px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 11,
                        background: m.bg,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Icon name={m.icon} size={20} color={m.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15, color: "#0f172a", lineHeight: 1.3 }}>{cat.name}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: m.color, marginTop: 3 }}>{cat.weight} weight</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: "#64748b", margin: 0 }}>{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#475569", maxWidth: 800, marginBottom: 8 }}>
            {HOMEPAGE_SEO.howWeRate.closing}
          </p>
          <div style={{
            display: "flex", gap: mob ? 12 : 20, flexWrap: "wrap",
            alignItems: "center",
            padding: "16px 0 0", borderTop: "1px solid #f1f5f9", marginTop: 8,
          }}>
            {RATE_NAV.map((l, i) => (
              <Link key={i} to={lp(l.path)} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 600, color: "#059669", textDecoration: "none",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "#047857"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#059669"; }}
              >
                <Icon name={l.icon} size={14} color="#059669" />
                {l.title}
                <ArrowRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REGULATED BROKERS BY COUNTRY ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 30, color: "#0f172a", letterSpacing: "-0.03em" }}>
            Regulated Brokers by Country
          </h2>
          <Link to={lp("/best-forex-brokers-by-country")} style={{ fontSize: 13, fontWeight: 600, color: "#059669", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            All 45 Forex Countries <ArrowRight size={12} />
          </Link>
        </div>
        <p style={{ fontSize: 15, color: "#64748b", marginBottom: mob ? 20 : 28, maxWidth: 600 }}>
          Find brokers licensed by your country's regulator. Click a category to see the ranking.
        </p>
        <div style={mob ? {
          display: "flex", overflowX: "auto", gap: 12,
          scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", paddingBottom: 4,
        } : {
          display: "grid",
          gridTemplateColumns: tab ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 14,
        }}>
          {COUNTRIES.map((c, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column",
              minHeight: mob ? "auto" : 140,
              borderRadius: 14, overflow: "visible",
              background: "#fff", border: c.featured ? "2px solid #059669" : "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
              transition: "all 0.2s", position: "relative",
              ...(mob ? { minWidth: 270, maxWidth: 290, flexShrink: 0, scrollSnapAlign: "start" } : {}),
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"; e.currentTarget.style.borderColor = "#059669"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; e.currentTarget.style.borderColor = c.featured ? "#059669" : "#e2e8f0"; }}
            >
              {c.featured && (
                <span style={{
                  position: "absolute", top: -10, right: 14,
                  padding: "3px 10px", borderRadius: 8,
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                  fontSize: 10, fontWeight: 700, boxShadow: "0 2px 6px rgba(245,158,11,0.3)",
                  lineHeight: 1, whiteSpace: "nowrap", zIndex: 2,
                }}>★ Most Popular</span>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: mob ? "16px 16px 0" : "20px 20px 0" }}>
                <CountryFlag code={c.code} size={mob ? 32 : 36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: mob ? 15 : 16 }}>{c.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                    <span style={{
                      display: "inline-block",
                      padding: "2px 8px", borderRadius: 6,
                      background: "#0f172a", color: "#fff",
                      fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
                    }}>{c.reg}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{c.brokers} brokers</span>
                  </div>
                </div>
                <ArrowRight size={16} color="#cbd5e1" style={{ flexShrink: 0, transition: "color 0.2s" }} />
              </div>
              <div style={{ height: 1, background: "#f0f4f8", margin: mob ? "10px 16px 0" : "12px 20px 0" }} />
              <div style={{ display: "flex", gap: mob ? 8 : 10, flexWrap: "wrap", alignItems: "center", padding: mob ? "10px 16px 14px" : "12px 20px 16px", marginTop: "auto" }}>
                {c.verticals.map((v, vi) => (
                  <Link key={vi} to={lp(v.path)} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    textDecoration: "none", padding: "2px 0", lineHeight: 1.3,
                  }}
                    onMouseEnter={e => { const t = e.currentTarget.querySelector(".country-vl"); if (t) { t.style.color = "#047857"; t.style.borderBottomColor = "#047857"; } }}
                    onMouseLeave={e => { const t = e.currentTarget.querySelector(".country-vl"); if (t) { t.style.color = "#059669"; t.style.borderBottomColor = "transparent"; } }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: v.color, flexShrink: 0, transition: "transform 0.15s" }} />
                    <span className="country-vl" style={{ fontSize: 11.5, fontWeight: 500, color: "#059669", letterSpacing: "0.01em", borderBottom: "1px solid transparent", transition: "all 0.15s" }}>
                      {v.label} {v.word} {c.geo}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        {mob && <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Swipe to see more countries →</div>}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to={lp("/best-forex-brokers-by-country")} style={{
            fontSize: 14, fontWeight: 600, color: "#059669",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            Browse All 45 Forex Countries <ArrowRight size={14} />
          </Link>
        </div>
      </section>


      {/* ===== ALL BROKER REVIEWS ===== */}
      /* ─── Variant C6: Ticker 3-col — wider rows, more breathing room, subtle separator ─── */
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, textAlign: "center", marginBottom: 8 }}>{t("home.allTitle")}</h2>
        <p style={{ textAlign: "center", fontSize: 16, color: "#1f2937", marginBottom: mob ? 24 : 36, maxWidth: 500, margin: "0 auto" }}>{t("home.allDesc", { count: allBrokersData.length })}</p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)", gap: mob ? 6 : 8 }}>
          {allBrokersData.map((b) => (
            <Link key={b.slug} to={lp(`/reviews/${b.slug}`)} style={{
              display: "flex", alignItems: "center", gap: mob ? 10 : 14,
              padding: mob ? "8px 10px" : "10px 16px", borderRadius: 10,
              background: "#0f172a", textDecoration: "none",
              transition: "all 0.2s ease",
              border: "1px solid #1e293b",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.borderColor = "#34d399"; e.currentTarget.style.transform = "translateX(3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              <div style={{ width: mob ? 56 : 72, height: mob ? 28 : 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${b.slug}.svg`} alt={b.B.name} loading="lazy" onError={e => { e.target.style.display = "none"; }} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: mob ? 13 : 14, color: "#f1f5f9", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.B.name}</span>
              </div>
              <div style={{
                width: 1, height: 20, background: "rgba(255,255,255,0.08)", flexShrink: 0,
              }} />
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 12 : 13, fontWeight: 800, color: scoreColor(b.B.score), flexShrink: 0, minWidth: 32, textAlign: "right" }}>{b.B.score}</span>
            </Link>
          ))}
        </div>
      </section>


      {/* ===== SIDE-BY-SIDE BROKER COMPARISONS ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 30, color: "#0f172a", letterSpacing: "-0.03em" }}>
            Side-by-Side Comparisons
          </h2>
          <Link to={lp("/compare")} style={{ fontSize: 13, fontWeight: 600, color: "#059669", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            Compare any two <ArrowRight size={12} />
          </Link>
        </div>
        <p style={{ fontSize: 15, color: "#64748b", marginBottom: 24, maxWidth: 600 }}>
          Compare brokers head-to-head across forex, stocks, crypto, and more — scores, fees, and regulation side by side.
        </p>

        {/* Vertical category labels — icons + labels from VERTICALS, colors from VERTICAL_MAP */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {["forex", "stocks", "crypto"].map(key => {
            const vert = VERTICALS.find(v => v.key === key);
            const color = VERTICAL_MAP[key]?.color || "#64748b";
            return (
              <span key={key} style={{
                padding: "4px 12px", borderRadius: 6,
                background: `${color}12`, border: `1px solid ${color}30`,
                color, fontSize: 12, fontWeight: 700,
                display: "inline-flex", alignItems: "center", gap: 5,
              }}>
                {vert && <Icon name={vert.icon} size={13} />}
                {vert ? vert.label : key}
              </span>
            );
          })}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: 14,
        }}>
          {[
            ...(POPULAR_PAIRS_BY_VERTICAL.forex || []).slice(0, 2).map(p => ({ ...p, cat: "Forex", catColor: "#059669" })),
            ...(POPULAR_PAIRS_BY_VERTICAL.stocks || []).slice(0, 2).map(p => ({ ...p, cat: "Stocks", catColor: "#2563eb" })),
            ...(POPULAR_PAIRS_BY_VERTICAL.crypto || []).slice(0, 2).map(p => ({ ...p, cat: "Crypto", catColor: "#f59e0b" })),
          ].map((pair, i) => {
            const brokerA = allBrokersData.find(b => b.slug === pair.slugA);
            const brokerB = allBrokersData.find(b => b.slug === pair.slugB);
            if (!brokerA || !brokerB) return null;
            const pairSlug = canonicalPair(pair.slugA, pair.slugB);
            return (
              <Link key={i} to={lp(`/compare/${pairSlug}`)} style={{
                display: "flex", flexDirection: "column", gap: 0,
                borderRadius: 14, background: "#fff", border: "1px solid #e2e8f0",
                overflow: "hidden", textDecoration: "none", color: "#111827",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"; e.currentTarget.style.borderColor = "#059669"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                {/* Broker logos side by side */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 0,
                  background: "linear-gradient(135deg, #0a2018, #0f172a)",
                  padding: "16px 12px", position: "relative",
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
                {/* Info */}
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14 }}>
                      {brokerA.B.name} vs {brokerB.B.name}
                    </div>
                    <span style={{
                      display: "inline-block", marginTop: 4,
                      padding: "2px 7px", borderRadius: 4,
                      background: `${pair.catColor}12`, color: pair.catColor,
                      fontSize: 11, fontWeight: 700,
                    }}>{pair.cat}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 14, color: "#059669" }}>{brokerA.B.score}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>vs</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 14, color: "#059669" }}>{brokerB.B.score}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== HOW TO CHOOSE AN ONLINE BROKER — SEO block ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "56px 24px" }}>
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
              <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
                {s.text}
              </p>
              {s.link && (
                <Link to={lp(s.link.path)} style={{ fontSize: 13, fontWeight: 600, color: "#059669", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                  {s.link.text} <ArrowRight size={12} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== ABOUT RATEDBROKERS — Navy Section ===== */}
      <section style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        padding: mob ? "48px 16px" : "64px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Stats row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: mob ? 16 : 24, marginBottom: mob ? 32 : 48,
          }}>
            {[
              { n: "51+", l: "Brokers Tested" },
              { n: "288+", l: "Rankings" },
              { n: "924+", l: "Pages" },
              { n: "130+", l: "Data Points" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", borderRight: (!mob && i < 3) ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: mob ? 28 : 40, color: "#34d399", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: mob ? 11 : 13, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Text */}
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 40px" }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 30, color: "#f8fafc", marginBottom: 16, letterSpacing: "-0.03em" }}>
              Independent Research. No Paid Placements.
            </h2>
            <p style={{ fontSize: mob ? 15 : 17, lineHeight: 1.7, color: "#cbd5e1" }}>
              Our analysts score brokers across 6 weighted categories using publicly available data, regulatory filings, and aggregated user reviews. We earn commissions when you open an account — but this never influences our rankings or reviews.
            </p>
          </div>

          {/* Link cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)",
            gap: 16,
          }}>
            {[
              { icon: "book-open", title: "Our Mission", desc: "Why we built RatedBrokers and our commitment to transparency.", path: "/about" },
              { icon: "bar-chart-3", title: "Scoring Methodology", desc: "6 categories, 130+ data points — how we rate every broker.", path: "/methodology" },
              { icon: "shield", title: "Trust & Transparency", desc: "How we make money, editorial independence, and our trust score.", path: "/trust-score" },
            ].map((card, i) => (
              <Link key={i} to={lp(card.path)} style={{
                display: "block", padding: mob ? "20px 16px" : "24px 20px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                textDecoration: "none", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "none"; }}
              >
                <Icon name={card.icon} size={24} color="#f59e0b" />
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, color: "#f8fafc", marginTop: 12 }}>{card.title}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6, lineHeight: 1.5 }}>{card.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR EXPERT TEAM ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 30, color: "#0f172a", letterSpacing: "-0.03em" }}>
            Our Expert Team
          </h2>
        </div>
        <p style={{ fontSize: 15, color: "#64748b", marginBottom: 24, maxWidth: 600 }}>
          Every review is written, peer-reviewed, and fact-checked by certified industry professionals with real trading experience.
        </p>

        {/* All team members — equal cards, founder first */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
          gap: 12,
        }}>
          {[
            ...Object.values(AUTHORS).filter(a => a.isFounder),
            ...Object.values(AUTHORS).filter(a => !a.isFounder),
          ].map((a) => (
            <Link key={a.id} to={lp(`/author/${a.id}`)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              padding: mob ? "20px 12px" : "24px 16px", borderRadius: 14,
              background: "#fff",
              border: a.isFounder ? "2px solid #059669" : "1px solid #e2e8f0",
              textDecoration: "none", color: "#111827", transition: "all 0.2s",
              position: "relative",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#a7f3d0"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(5,150,105,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = a.isFounder ? "#059669" : "#e2e8f0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {a.isFounder && (
                <span style={{
                  position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                  padding: "2px 8px", borderRadius: 4,
                  background: "#059669", color: "#fff",
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>Founder</span>
              )}
              <AuthorAvatar author={a} size={mob ? 48 : 56} showVerified />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: mob ? 13 : 15 }}>{a.name}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{a.role}</div>
                {a.credentials && a.credentials.length > 0 && (
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#059669", fontWeight: 700, marginTop: 4 }}>
                    {a.credentials.join(" · ")}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>View Profile →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FAQ — SEO block with JSON-LD ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "56px 24px" }}>
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
