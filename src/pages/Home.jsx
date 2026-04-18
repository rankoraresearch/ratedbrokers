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
import { BrokerTypeSection } from "../components/BrokerTypeButtons";
import Icon from "../components/Icon";
import { ArrowRight, ArrowUpRight, BarChart3, BookOpen, Target, ChevronDown, ChevronUp, ArrowRightLeft, ChartCandlestick, Users, Dices, Bitcoin, TrendingUp, GitBranch, Hourglass, Shield, DollarSign, Star, Eye, Monitor, Zap } from "lucide-react";
import HOMEPAGE_SEO from "../data/homepageSeoContent";
import CountryFlag from "../components/CountryFlag";
import { AUTHORS } from "../data/authors";
import AuthorAvatar from "../components/AuthorAvatar";


// ══════════════════════════════════════════════════════
// CATEGORY NAV — Variants with switcher
// ══════════════════════════════════════════════════════
const HOW_WE_RATE_ICONS = {
  "Regulation & Safety": Shield,
  "Trading Costs": DollarSign,
  "User Reputation": Star,
  "Broker Transparency": Eye,
  "Platforms & Tools": Monitor,
  "Execution Model": Zap,
};
const CAT_ICONS = {
  forex: ArrowRightLeft, cfd: ChartCandlestick, "copy-trading": Users,
  "spread-betting": Dices, crypto: Bitcoin, stocks: TrendingUp, options: GitBranch, futures: Hourglass,
};
const IC = { forex: "#fbbf24", cfd: "#60a5fa", "copy-trading": "#34d399", "spread-betting": "#f87171", crypto: "#f59e0b", stocks: "#38bdf8", options: "#a78bfa", futures: "#94a3b8" };
function CategoryNav() {
  return <BrokerTypeSection />;
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
const scoreColor = (s) => s >= 9.0 ? "#059669" : "#64748b";
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
            <Link to={lp("/reviews")} className="link-green" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              All {brokers.length} reviews <ArrowRight size={12} className="link-arrow" />
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
                      fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: mob ? 16 : 15,
                      letterSpacing: "-0.01em", color: "#0f172a", textDecoration: "none",
                      display: "block",
                    }}>{b.name}</Link>
                    <div style={{ fontSize: mob ? 13 : 12, color: "#64748b", marginTop: 2 }}>{b.type}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                      {(b.verticals || []).slice(0, 3).map(v => {
                        const vm = VERTICAL_MAP[v];
                        return vm ? <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: mob ? 11 : 10, color: "#64748b" }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: vm.color }} />{vm.label}
                        </span> : null;
                      })}
                    </div>
                  </div>
                  {/* Score + Visit */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <div style={{
                      width: mob ? 48 : 44, height: mob ? 36 : 34, borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: b.score >= 9.0
                        ? "linear-gradient(135deg, #047857, #065f46)"
                        : "linear-gradient(135deg, #475569, #334155)",
                      fontFamily: "'JetBrains Mono'", fontSize: mob ? 15 : 14, fontWeight: 800,
                      color: "#fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}>{b.score}</div>
                    <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                      padding: mob ? "12px 20px" : "6px 14px", borderRadius: 8, fontSize: mob ? 13 : 11, fontWeight: 800,
                      background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                      textDecoration: "none", minHeight: mob ? 44 : "auto", display: "inline-flex", alignItems: "center",
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
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 20 : 24, fontWeight: 700, color: "#34d399", letterSpacing: "-0.02em" }}>{s.n}</div>
              <div style={{ fontSize: mob ? 12 : 11, color: "rgba(255,255,255,0.55)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2, marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}


// ══════════════════════════════════════════════════════
// V2 — Verification Snapshot navy band (S1.8, replaces Trust Strip)
// ══════════════════════════════════════════════════════
function VerificationSnapshotV2({ mob, allBrokersData }) {
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2e24 100%)",
      padding: mob ? "40px 16px" : "56px 24px",
      color: "#fff",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
      }} />
      <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ maxWidth: 760, marginBottom: mob ? 24 : 32 }}>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#fbbf24", marginBottom: 12,
          }}>Verification Snapshot · Q1 2026</div>
          <h2 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 24 : 32, lineHeight: 1.15, color: "#fff",
            letterSpacing: "-0.03em", margin: 0,
          }}>Every broker re-verified against regulators this quarter</h2>
          <p style={{
            fontSize: mob ? 14 : 15, lineHeight: 1.65,
            color: "rgba(255,255,255,0.72)", margin: "12px 0 0", maxWidth: 620,
          }}>
            License numbers pulled directly from FCA, ASIC, SEC, NFA, CySEC registers. Platform fees
            re-tested on demo accounts. User reviews aggregated from Trustpilot.
          </p>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: mob ? 16 : 24,
        }}>
          {[
            { n: allBrokersData.length + "+", l: "Brokers re-verified" },
            { n: RANKINGS.length + "+", l: "Rankings live" },
            { n: "130+", l: "Data points each" },
            { n: "Apr 2026", l: "Latest audit" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 900,
                fontSize: mob ? 22 : 32, color: "#34d399", lineHeight: 1,
              }}>{s.n}</div>
              <div style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11.5 : 12,
                fontWeight: 500, color: "#94a3b8", letterSpacing: "0.04em",
                textTransform: "uppercase", marginTop: 6,
              }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
            {/* V3: Top Actions — rb-cta-affiliate (1) + rb-cta-ghost--dark (3) */}
            <div style={{ display: "flex", gap: mob ? 8 : 10, flexDirection: mob ? "column" : "row" }}>
              <Link to="/find-your-broker" className="rb-cta-affiliate" style={{
                padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.01em",
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
              }}>
                <Target size={14} /> Find Your Broker
              </Link>
              {!mob && <Link to="/compare" className="rb-cta-ghost--dark" style={{
                padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                fontFamily: "'Outfit',sans-serif",
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)", color: "#e2e8f0",
                textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, whiteSpace: "nowrap",
              }}>
                <BarChart3 size={14} /> Compare Brokers
              </Link>}
              {!mob && <Link to="/methodology" className="rb-cta-ghost--dark" style={{
                padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                fontFamily: "'Outfit',sans-serif",
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)", color: "#e2e8f0",
                textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, whiteSpace: "nowrap",
              }}>
                <BookOpen size={14} /> Our Methodology
              </Link>}
              <Link to="/rankings" className="rb-cta-ghost--dark" style={{
                padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                fontFamily: "'Outfit',sans-serif",
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)", color: "#e2e8f0",
                textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, whiteSpace: "nowrap",
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
          <Link to={lp(HOMEPAGE_SEO.intro.links[0].path)} className="rb-link-inline">{HOMEPAGE_SEO.intro.links[0].text}</Link>
          {" "}explains our scoring formula.{" "}
          Learn <Link to={lp(HOMEPAGE_SEO.intro.links[1].path)} className="rb-link-inline">{HOMEPAGE_SEO.intro.links[1].text}</Link>.
        </p>
      </section>

      {/* ===== BROKER SHOWCASE — Power Cards (kept in both v1 and v2 per Egor feedback) ===== */}
      <BrokerPowerCards mob={mob} tab={tab} lp={lp} brokers={allBrokersData} />

      {/* ===== HOW WE RATE BROKERS — Premium Dark (Orange Tiles) ===== */}
      <section style={{
        position: "relative",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
        color: "#fff",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
        }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: mob ? "48px 16px" : "72px 24px" }}>
          <div style={{ marginBottom: mob ? 28 : 40, maxWidth: 760 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", color: "#f59e0b", textTransform: "uppercase", marginBottom: 14 }}>
              Our Methodology
            </div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 28 : 40, lineHeight: 1.1, letterSpacing: "-0.03em", margin: 0, marginBottom: 14 }}>
              {HOMEPAGE_SEO.howWeRate.heading}
            </h2>
            <p style={{ fontSize: mob ? 14 : 16, lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: 0 }}>
              {HOMEPAGE_SEO.howWeRate.intro}
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: mob ? 12 : 16, marginBottom: mob ? 28 : 40,
          }}>
            {HOMEPAGE_SEO.howWeRate.categories.map((cat, i) => {
              const weightNum = parseInt(cat.weight);
              const IconCmp = HOW_WE_RATE_ICONS[cat.name] || Shield;
              return (
                <div key={i}
                  style={{
                    padding: mob ? "20px" : "24px", borderRadius: 14,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#f59e0b";
                    e.currentTarget.style.background = "rgba(245,158,11,0.06)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.28)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <IconCmp size={20} color="#f59e0b" strokeWidth={1.75} />
                    </div>
                    <span style={{
                      padding: "4px 10px", borderRadius: 6,
                      background: "rgba(245,158,11,0.14)", color: "#fbbf24",
                      fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 800, letterSpacing: "0.02em",
                    }}>{cat.weight}</span>
                  </div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 8, letterSpacing: "-0.01em" }}>
                    {cat.name}
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ width: `${(weightNum / 30) * 100}%`, height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.68)", margin: 0 }}>{cat.desc}</p>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: mob ? 20 : 32, alignItems: mob ? "stretch" : "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: 0, maxWidth: 620 }}>
              {HOMEPAGE_SEO.howWeRate.closing}
            </p>
            <Link
              to={lp("/methodology")}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "14px 22px", borderRadius: 10,
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                color: "#0f172a", textDecoration: "none",
                fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15,
                whiteSpace: "nowrap",
                boxShadow: "0 8px 24px rgba(245,158,11,0.32)",
              }}
            >
              Read full methodology <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== REGULATED BROKERS BY COUNTRY ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 30, color: "#0f172a", letterSpacing: "-0.03em" }}>
            Regulated Brokers by Country
          </h2>
          <Link to={lp("/best-forex-brokers-by-country")} className="link-green" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            All 45 Forex Countries <ArrowRight size={12} className="link-arrow" />
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
              borderRadius: 14, overflow: "hidden",
              background: "#fff", border: "1px solid #e8ecf1",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.04)",
              transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", position: "relative",
              ...(mob ? { minWidth: 270, maxWidth: 290, flexShrink: 0, scrollSnapAlign: "start" } : {}),
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.04)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: mob ? "16px 16px 0" : "18px 18px 0" }}>
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
              <div style={{ height: 1, background: "#f0f4f8", margin: mob ? "10px 16px 0" : "12px 18px 0" }} />
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center", padding: mob ? "10px 12px 14px" : "10px 14px 14px", marginTop: "auto" }}>
                {c.verticals.map((v, vi) => (
                  <Link key={vi} to={lp(v.path)} className="rb-link-rail">
                    <span className="rb-dot" />
                    {v.label} {v.word} {c.geo}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        {mob && <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Swipe to see more countries →</div>}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to={lp("/best-forex-brokers-by-country")} className="link-green" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            Browse All 45 Forex Countries <ArrowRight size={14} className="link-arrow" />
          </Link>
        </div>
      </section>


      {/* ===== Verification Snapshot navy band — mid-page dark anchor ===== */}
      <VerificationSnapshotV2 mob={mob} allBrokersData={allBrokersData} />

      {/* ===== ALL BROKER REVIEWS — D2k shell, light rail rows (P6 migrated) ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <div style={{
          background: "#fff", borderRadius: 14, overflow: "hidden",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)",
        }}>
          <header style={{
            padding: mob ? "16px 16px 12px" : "20px 24px 14px",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
            display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap",
          }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.2 }}>
              {t("home.allTitle")}
            </h2>
            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
              {allBrokersData.length} brokers · sorted by score
            </span>
          </header>
          <div style={{ padding: mob ? "6px 8px 10px" : "8px 10px 14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)", gap: 0 }}>
              {allBrokersData.map((b) => (
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
                    <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: mob ? 13 : 14, color: "#0f172a", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.B.name}</span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 12 : 13, fontWeight: 800, color: scoreColor(b.B.score), flexShrink: 0, minWidth: 32, textAlign: "right" }}>{b.B.score}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ===== SIDE-BY-SIDE BROKER COMPARISONS — 3×2 compact grid, monochrome category tag ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 30, color: "#0f172a", letterSpacing: "-0.03em" }}>
            Side-by-Side Comparisons
          </h2>
          <Link to={lp("/compare")} className="rb-link-standalone">
            Compare any two <ArrowRight size={12} />
          </Link>
        </div>
        <p style={{ fontSize: 15, color: "#64748b", marginBottom: mob ? 20 : 28, maxWidth: 620 }}>
          Head-to-head reviews across forex, stocks and crypto — scores, fees and regulation side by side.
        </p>

        <div style={{
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
                display: "flex", flexDirection: "column", gap: 0,
                borderRadius: 14, background: "#fff", border: "1px solid #e8ecf1",
                overflow: "hidden", textDecoration: "none", color: "#0f172a",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.04)",
                transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                position: "relative",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#e8ecf1"; }}
              >
                {/* Premium Dark header with logos + VS */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 0,
                  background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 50%, #047857 100%)",
                  padding: "18px 12px", position: "relative",
                }}>
                  {/* Monochrome category mark in top-right corner */}
                  <span style={{
                    position: "absolute", top: 8, right: 10,
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.5)",
                  }}>{pair.cat}</span>
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
                {/* Info — name + scores, no chips */}
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14,
                      color: "#0f172a", letterSpacing: "-0.01em",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {brokerA.B.name} vs {brokerB.B.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 500, marginTop: 3 }}>
                      Fees · Regulation · Platforms
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 14, color: "#0f172a" }}>{brokerA.B.score}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>vs</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 14, color: "#0f172a" }}>{brokerB.B.score}</span>
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
                <Link to={lp(s.link.path)} className="link-green" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                  {s.link.text} <ArrowRight size={12} className="link-arrow" />
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
              { n: allBrokersData.length + "+", l: "Brokers Tested" },
              { n: RANKINGS.length + "+", l: "Rankings" },
              { n: (allBrokersData.length * 9 + RANKINGS.length + 50) + "+", l: "Pages" },
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

      {/* ===== EDITORIAL TEAM (V8 — Plate B + hover OFF, ported from /proto/home-unified, 2026-04-16) ===== */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "44px 16px" : "64px 24px" }}>
        <div style={{ maxWidth: 680, marginBottom: mob ? 20 : 28 }}>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#059669", marginBottom: 10,
          }}>Editorial Team</div>
          <h2 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 24 : 28, color: "#0f172a",
            letterSpacing: "-0.02em", margin: 0,
          }}>Meet the team behind every review</h2>
          <p style={{
            fontSize: mob ? 14 : 15, color: "#64748b",
            lineHeight: 1.65, margin: "8px 0 0", maxWidth: 680,
          }}>
            Seven analysts and editors. Every broker review carries a byline and goes through
            a three-step editorial process — written, peer-reviewed, fact-checked against
            regulator databases. Click any name to see their full profile, credentials, and published reviews.
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
          ].map((a) => (
            <Link key={a.id} to={lp(`/author/${a.id}`)} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              textDecoration: "none", color: "#0f172a",
              background: "#fff", borderRadius: 12,
              border: "1px solid #e8ecf1",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
              position: "relative", overflow: "hidden",
              transition: "border-color 0.25s, box-shadow 0.25s",
              minHeight: mob ? 280 : 320,
            }}
              onMouseEnter={e => {
                const v = e.currentTarget.querySelector("[data-view-link]");
                if (v) v.style.color = "#059669";
              }}
              onMouseLeave={e => {
                const v = e.currentTarget.querySelector("[data-view-link]");
                if (v) v.style.color = "#64748b";
              }}
            >
              {/* Plate B — solid 3px green top strip */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 3, pointerEvents: "none",
                background: "linear-gradient(90deg, #047857 0%, #10b981 50%, #047857 100%)",
              }} />

              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: mob ? "32px 16px 20px" : "36px 20px 24px",
                flex: 1, width: "100%", position: "relative",
              }}>
                {/* Circular avatar grounded with ring + floor shadow */}
                <div style={{
                  width: mob ? 76 : 84, height: mob ? 76 : 84,
                  borderRadius: "50%", overflow: "hidden", position: "relative",
                  background: "linear-gradient(180deg, #f8f9fb, #e8ecf1)",
                  flexShrink: 0,
                  boxShadow: [
                    "0 0 0 1px #fff",
                    "0 0 0 2px #e8ecf1",
                    "0 8px 16px rgba(15,23,42,0.08)",
                    "0 2px 4px rgba(15,23,42,0.06)",
                  ].join(", "),
                  marginBottom: 16,
                }}>
                  {a.image ? (
                    <img src={`${import.meta.env.BASE_URL}${a.image.replace(/^\//, "")}`} alt={a.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 28, color: "#059669",
                    }}>{a.initials || a.name?.slice(0, 1)}</div>
                  )}
                </div>

                <div style={{
                  fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 15 : 16.5,
                  color: "#0f172a", letterSpacing: "-0.015em", textAlign: "center",
                  lineHeight: 1.25, marginBottom: 4,
                }}>{a.name}</div>

                {a.credentials && a.credentials.length > 0 && (
                  <div style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 700,
                    color: "#059669", letterSpacing: "0.1em", textAlign: "center",
                    marginBottom: 8,
                  }}>{a.credentials.join(" · ")}</div>
                )}

                <div style={{
                  fontSize: mob ? 12 : 12.5, color: "#64748b", fontWeight: 500,
                  textAlign: "center", lineHeight: 1.4, marginBottom: 2,
                }}>{a.role}</div>
                {a.exp && (
                  <div style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: "#94a3b8", fontWeight: 600,
                    textAlign: "center", letterSpacing: "0.04em",
                  }}>{a.exp.toUpperCase()}</div>
                )}

                <div style={{
                  width: 32, height: 1, background: "#e8ecf1",
                  margin: mob ? "14px 0 12px" : "16px 0 14px",
                }} />

                {a.specialty && (
                  <div style={{
                    fontSize: mob ? 11.5 : 12, color: "#374151", fontWeight: 500,
                    textAlign: "center", lineHeight: 1.5, maxWidth: 200,
                  }}>{a.specialty}</div>
                )}

                <div data-view-link style={{
                  marginTop: "auto", paddingTop: mob ? 16 : 20,
                  fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700,
                  color: "#64748b", letterSpacing: "-0.01em",
                  display: "inline-flex", alignItems: "center", gap: 4,
                  transition: "color 0.2s",
                }}>
                  View full profile <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{
          marginTop: mob ? 24 : 32,
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        }}>
          <Link to={lp("/trust-score")} className="rb-link-meta">Editorial standards</Link>
          <span style={{ color: "#cbd5e1", fontSize: 13 }}>·</span>
          <Link to={lp("/methodology")} className="rb-link-meta">Scoring methodology</Link>
          <span style={{ color: "#cbd5e1", fontSize: 13 }}>·</span>
          <Link to={lp("/how-we-make-money")} className="rb-link-meta">How we make money</Link>
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
