import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import Icon, { IconBox } from "./Icon";
import CountryFlag from "./CountryFlag";
import { ChevronDown, X as XIcon, Menu as MenuIcon, ArrowRight, Search as SearchIcon, Shield, CalendarCheck, Globe } from "lucide-react";
import SearchOverlay from "./SearchOverlay";

/* ── Data ───────────────────────────────────────────── */

const FOREX_CATEGORIES = [
  { icon: "circle", key: "beginners", path: "/best-forex-brokers-for-beginners", color: "#10b981" },
  { icon: "trending-down", key: "lowSpreads", path: "/lowest-spread-forex-brokers", color: "#6366f1" },
  { icon: "zap", key: "ecn", path: "/best-ecn-forex-brokers", color: "#f59e0b" },
  { icon: "crosshair", key: "scalping", path: "/best-forex-brokers-for-scalping", color: "#ef4444" },
  { icon: "smartphone", key: "apps", path: "/best-forex-trading-apps", color: "#8b5cf6" },
  { icon: "handshake", key: "social", path: "/best-social-trading-platforms", color: "#ec4899" },
  { icon: "piggy-bank", key: "lowDeposit", path: "/no-minimum-deposit-forex-brokers", color: "#14b8a6" },
  { icon: "briefcase", key: "professional", path: "/best-forex-brokers-for-professionals", color: "#1e3a5f" },
];

const FOREX_PLATFORMS = [
  { name: "MetaTrader 4", path: "/best-metatrader-4-brokers" },
  { name: "MetaTrader 5", path: "/best-metatrader-5-brokers" },
  { name: "cTrader", path: "/best-ctrader-brokers" },
  { name: "TradingView", path: "/best-tradingview-brokers" },
];

const FOREX_COSTS = [
  { icon: "trending-down", key: "costLowSpread", path: "/lowest-spread-forex-brokers", color: "#6366f1" },
  { icon: "ban", key: "costZeroSpread", path: "/zero-spread-forex-brokers", color: "#ef4444" },
  { icon: "dollar-sign", key: "costLowComm", path: "/lowest-commission-forex-brokers", color: "#f59e0b" },
  { icon: "circle-check", key: "costNoFees", path: "/best-no-hidden-fees-forex-brokers", color: "#10b981" },
];

const FOREX_ACCOUNTS = [
  { icon: "gamepad-2", key: "acctDemo", path: "/best-forex-demo-accounts", color: "#8b5cf6" },
  { icon: "microscope", key: "acctMicro", path: "/forex-brokers-micro-accounts", color: "#ec4899" },
  { icon: "landmark", key: "acctIslamic", path: "/best-islamic-forex-brokers", color: "#059669" },
  { icon: "piggy-bank", key: "acctLowDep", path: "/no-minimum-deposit-forex-brokers", color: "#14b8a6" },
];

const CRYPTO_BY_COIN = [
  { key: "cryptoBitcoin", path: "/best-bitcoin-brokers" },
  { key: "cryptoEthereum", path: "/best-ethereum-brokers" },
  { key: "cryptoXrp", path: "/best-xrp-brokers" },
  { key: "cryptoSolana", path: "/best-solana-brokers" },
  { key: "cryptoAltcoins", path: "/best-altcoin-brokers" },
];

const CRYPTO_BY_FEATURE = [
  { key: "cryptoHighLev", path: "/best-high-leverage-crypto-brokers" },
  { key: "cryptoLowSpread", path: "/best-low-spread-crypto-brokers" },
  { key: "cryptoApps", path: "/best-crypto-trading-apps" },
];

const GUIDE_GETTING_STARTED = [
  { icon: "compass", key: "guideChoose", path: "/guide/how-to-choose-a-forex-broker", color: "#059669" },
  { icon: "book-open", key: "guideBeginners", path: "/guide/how-to-start-forex-trading", color: "#2563eb" },
  { icon: "globe", key: "guideWhatIsForex", path: "/guide/what-is-forex-trading", color: "#0ea5e9" },
  { icon: "gamepad-2", key: "guideDemo", path: "/guide/forex-demo-account-guide", color: "#8b5cf6" },
  { icon: "bar-chart-3", key: "guideWhatIsPip", path: "/guide/what-is-a-pip", color: "#14b8a6" },
];

const GUIDE_STRATEGIES = [
  { icon: "crosshair", key: "guideStrategies", path: "/guide/forex-trading-strategies", color: "#ef4444" },
  { icon: "zap", key: "guideScalping", path: "/guide/scalping-strategy-guide", color: "#f59e0b" },
  { icon: "sun", key: "guideDayTrading", path: "/guide/day-trading-guide", color: "#d97706" },
  { icon: "waves", key: "guideSwing", path: "/guide/swing-trading-guide", color: "#06b6d4" },
  { icon: "handshake", key: "guideCopy", path: "/guide/copy-trading-guide", color: "#ec4899" },
];

const GUIDE_CONCEPTS = [
  { icon: "dollar-sign", key: "guideSpreads", path: "/guide/understanding-spreads-and-fees", color: "#d97706" },
  { icon: "scale", key: "guideEcnMm", path: "/guide/ecn-vs-market-maker", color: "#7c3aed" },
  { icon: "shield", key: "guideRegulation", path: "/guide/forex-regulation-guide", color: "#dc2626" },
  { icon: "scale", key: "guideLeverage", path: "/guide/what-is-leverage", color: "#059669" },
  { icon: "trending-down", key: "guideTechnical", path: "/guide/technical-analysis-guide", color: "#6366f1" },
];

/* backward-compat: flat list for mobile */
const GUIDE_ITEMS = [...GUIDE_GETTING_STARTED, ...GUIDE_STRATEGIES, ...GUIDE_CONCEPTS];

const COUNTRIES_EUROPE = [
  { code: "GB", name: "United Kingdom", path: "/best-forex-brokers-uk" },
  { code: "DE", name: "Germany", path: "/best-forex-brokers-germany" },
  { code: "FR", name: "France", path: "/best-forex-brokers-france" },
  { code: "CH", name: "Switzerland", path: "/best-forex-brokers-switzerland" },
  { code: "CY", name: "Cyprus", path: "/best-forex-brokers-cyprus" },
];

const COUNTRIES_ASIA_PACIFIC = [
  { code: "AU", name: "Australia", path: "/best-forex-brokers-australia" },
  { code: "JP", name: "Japan", path: "/best-forex-brokers-japan" },
  { code: "SG", name: "Singapore", path: "/best-forex-brokers-singapore" },
  { code: "HK", name: "Hong Kong", path: "/best-forex-brokers-hong-kong" },
  { code: "IN", name: "India", path: "/best-forex-brokers-india" },
];

const COUNTRIES_AMERICAS_MENA = [
  { code: "US", name: "United States", path: "/best-forex-brokers-usa" },
  { code: "CA", name: "Canada", path: "/best-forex-brokers-canada" },
  { code: "AE", name: "UAE", path: "/best-forex-brokers-uae" },
  { code: "ZA", name: "South Africa", path: "/best-forex-brokers-south-africa" },
  { code: "TR", name: "Turkey", path: "/best-forex-brokers-turkey" },
];

const COUNTRIES = [...COUNTRIES_EUROPE, ...COUNTRIES_ASIA_PACIFIC, ...COUNTRIES_AMERICAS_MENA];

const TOP_REVIEWS = [
  { name: "IC Markets", score: 9.7, slug: "ic-markets" },
  { name: "Pepperstone", score: 9.5, slug: "pepperstone" },
  { name: "IG", score: 9.5, slug: "ig" },
  { name: "FP Markets", score: 9.4, slug: "fp-markets" },
  { name: "CMC Markets", score: 9.3, slug: "cmc-markets" },
];

const POPULAR_REVIEWS = [
  { name: "Exness", slug: "exness" },
  { name: "XTB", slug: "xtb" },
  { name: "eToro", slug: "etoro" },
  { name: "Saxo Bank", slug: "saxo-bank" },
  { name: "OANDA", slug: "oanda" },
];

/* ── Component ──────────────────────────────────────── */

export default function Header() {
  const { mob, tab } = useMedia();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
    setMobileExpanded(null);
    setSearchOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleCmdK = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleCmdK);
    return () => window.removeEventListener("keydown", handleCmdK);
  }, []);

  const enter = useCallback((id) => {
    clearTimeout(timeoutRef.current);
    setActiveDropdown(id);
  }, []);

  const leave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  }, []);

  /* ── shared styles ── */

  const secHead = {
    fontSize: 12, fontWeight: 700, color: "#1f2937",
    textTransform: "uppercase", letterSpacing: 1.2,
    marginBottom: 12, paddingBottom: 8,
    borderBottom: "1px solid #f1f5f9",
  };

  const ddLink = {
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 10px", borderRadius: 8,
    textDecoration: "none", color: "#111827",
    fontSize: 15, fontWeight: 500, transition: "all 0.15s",
  };

  const ddBase = {
    position: "absolute", top: "calc(100% + 8px)",
    background: "#fff", borderRadius: 16,
    border: "1px solid #e2e8f0",
    boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.05)",
    padding: 24, zIndex: 1001,
  };

  const hov = (e) => { e.currentTarget.style.background = "#f0fdf4"; };
  const unhov = (e) => { e.currentTarget.style.background = "transparent"; };

  /* compact link style (no icons, no descriptions) */
  const compactLink = {
    display: "block", padding: "5px 8px", borderRadius: 6,
    textDecoration: "none", color: "#1f2937",
    fontSize: 14, fontWeight: 500, transition: "all 0.15s",
    lineHeight: 1.4,
  };
  const hovCompact = (e) => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#059669"; };
  const unhovCompact = (e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1f2937"; };

  /* ── helper: nav button (desktop) ── */
  const NavBtn = ({ id, label }) => (
    <button
      style={{
        fontSize: 15, fontWeight: 500,
        color: activeDropdown === id ? "#059669" : "#111827",
        background: activeDropdown === id ? "#f0fdf4" : "transparent",
        border: "none", padding: "8px 10px", borderRadius: 8,
        cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
        transition: "all 0.2s", fontFamily: "inherit", whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => { if (activeDropdown !== id) { e.currentTarget.style.color = "#059669"; e.currentTarget.style.background = "#f0fdf4"; } }}
      onMouseLeave={(e) => { if (activeDropdown !== id) { e.currentTarget.style.color = "#111827"; e.currentTarget.style.background = "transparent"; } }}
    >
      {label}
      <span style={{
        color: "#64748b",
        transition: "transform 0.2s",
        transform: activeDropdown === id ? "rotate(180deg)" : "none",
        display: "inline-flex",
      }}><ChevronDown size={12} /></span>
    </button>
  );

  /* ── helper: simple link (desktop) ── */
  const NavLink = ({ to, label, match }) => (
    <Link
      to={to}
      style={{
        fontSize: 15, fontWeight: match ? 700 : 500,
        color: match ? "#0f172a" : "#111827",
        textDecoration: "none", padding: "8px 10px", borderRadius: 8,
        transition: "all 0.2s", whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "#059669"; e.currentTarget.style.background = "#f0fdf4"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = match ? "#059669" : "#1f2937"; e.currentTarget.style.background = "transparent"; }}
    >
      {label}
    </Link>
  );

  /* ── helper: icon square (uses shared IconBox) ── */

  /* ── helper: mobile section toggle ── */
  const MobToggle = ({ id, label }) => (
    <button
      onClick={() => setMobileExpanded(mobileExpanded === id ? null : id)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", fontSize: 16, fontWeight: 500, color: "#111827",
        background: "none", border: "none", padding: "12px 0",
        borderBottom: "1px solid #f1f5f9", cursor: "pointer", fontFamily: "inherit",
      }}
    >
      {label}
      <span style={{
        color: "#64748b",
        transition: "transform 0.2s",
        transform: mobileExpanded === id ? "rotate(180deg)" : "none",
        display: "inline-flex",
      }}><ChevronDown size={14} /></span>
    </button>
  );

  const MobLink = ({ to, label, match }) => (
    <Link
      to={to}
      style={{
        display: "block", fontSize: 16,
        fontWeight: match ? 700 : 500,
        color: match ? "#059669" : "#111827",
        textDecoration: "none", padding: "12px 0",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      {label}
    </Link>
  );

  /* ── Render category list (used in dropdowns) ── */
  const renderCatItems = (items) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((item) => (
        <Link
          key={item.key}
          to={lp(item.path)}
          style={ddLink}
          onMouseEnter={hov} onMouseLeave={unhov}
        >
          <IconBox name={item.icon} color={item.color} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.2 }}>{t(`mega.${item.key}`)}</div>
            <div style={{ fontSize: 13, color: "#1f2937", marginTop: 1 }}>{t(`mega.${item.key}Desc`)}</div>
          </div>
        </Link>
      ))}
    </div>
  );

  /* ── Render mobile category list ── */
  const renderMobCatItems = (items) => (
    items.map((item) => (
      <Link
        key={item.key}
        to={lp(item.path)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 0", fontSize: 14, fontWeight: 500,
          color: "#1f2937", textDecoration: "none",
        }}
      >
        <Icon name={item.icon} size={14} color={item.color} />
        {t(`mega.${item.key}`)}
      </Link>
    ))
  );

  /* ══════════════════════════════════════════════════ */
  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        transform: "translateY(0)",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
    >
      {/* ═══ MAIN NAV ═══ */}
      <div style={{
        height: 64,
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
        transition: "box-shadow 0.3s",
        display: "flex", alignItems: "center",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 20px", width: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* LOGO */}
          <Link to={lp("/")} style={{ display: "flex", alignItems: "baseline", textDecoration: "none" }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#059669", letterSpacing: "-0.5px" }}>Brokers</span>
            <span style={{ display: "inline-block", width: mob ? 8 : 10, height: mob ? 8 : 10, borderRadius: "50%", background: "#f59e0b", marginLeft: 3, marginBottom: mob ? 1 : 1, verticalAlign: "baseline" }} />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: mob ? 11 : 15, color: "#0f172a", letterSpacing: "-0.3px", marginLeft: 1 }}>com</span>
          </Link>

          {/* ══ DESKTOP NAV ══ */}
          {(mob || tab) ? (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                style={{ background: "none", border: "none", color: "#1f2937", padding: "4px 8px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
              ><SearchIcon size={20} /></button>
              <button
                aria-label="Language"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "4px 6px", borderRadius: 6,
                }}
              >
                <CountryFlag code="GB" size={16} />
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ background: "none", border: "none", color: "#1f2937", padding: "4px 8px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
              >{menuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}</button>
            </div>
          ) : (
            <nav style={{ display: "flex", gap: 2, alignItems: "center" }}>

              {/* ─── 1. Forex Brokers ▾ ─── */}
              <div style={{ position: "relative" }} onMouseEnter={() => enter("forex")} onMouseLeave={leave}>
                <Link to={lp("/best-forex-brokers")} style={{
                  fontSize: 15, fontWeight: 500,
                  color: activeDropdown === "forex" ? "#059669" : "#1f2937",
                  background: activeDropdown === "forex" ? "#f0fdf4" : "transparent",
                  border: "none", padding: "8px 10px", borderRadius: 8,
                  display: "flex", alignItems: "center", gap: 3,
                  transition: "all 0.2s", whiteSpace: "nowrap", textDecoration: "none",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#059669"; e.currentTarget.style.background = "#f0fdf4"; }}
                  onMouseLeave={(e) => { if (activeDropdown !== "forex") { e.currentTarget.style.color = "#111827"; e.currentTarget.style.background = "transparent"; } }}
                >
                  {t("nav.forexBrokers")}
                  <span style={{
                    color: "#64748b",
                    transition: "transform 0.2s",
                    transform: activeDropdown === "forex" ? "rotate(180deg)" : "none",
                    display: "inline-flex",
                  }}><ChevronDown size={12} /></span>
                </Link>
                {activeDropdown === "forex" && (
                  <div style={{ ...ddBase, left: "50%", transform: "translateX(-50%)", width: 620, padding: "20px 24px" }}
                    onMouseEnter={() => enter("forex")} onMouseLeave={leave}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                      {/* Col 1: By Strategy */}
                      <div>
                        <div style={secHead}>By Trading Style</div>
                        {FOREX_CATEGORIES.map((item) => (
                          <Link key={item.key} to={lp(item.path)} style={compactLink} onMouseEnter={hovCompact} onMouseLeave={unhovCompact}>
                            {t(`mega.${item.key}`)}
                          </Link>
                        ))}
                      </div>
                      {/* Col 2: By Cost & Platform */}
                      <div>
                        <div style={secHead}>By Cost</div>
                        {FOREX_COSTS.map((item) => (
                          <Link key={item.key} to={lp(item.path)} style={compactLink} onMouseEnter={hovCompact} onMouseLeave={unhovCompact}>
                            {t(`mega.${item.key}`)}
                          </Link>
                        ))}
                        <div style={{ ...secHead, marginTop: 14 }}>By Platform</div>
                        {FOREX_PLATFORMS.map((p) => (
                          <Link key={p.name} to={lp(p.path)} style={compactLink} onMouseEnter={hovCompact} onMouseLeave={unhovCompact}>
                            Best {p.name} Brokers
                          </Link>
                        ))}
                        <div style={{ ...secHead, marginTop: 14 }}>Platform Guides</div>
                        {FOREX_PLATFORMS.map((p) => (
                          <Link key={`guide-${p.name}`} to={lp(`/platform/${p.name.toLowerCase().replace(/\s+/g, "-")}`)} style={compactLink} onMouseEnter={hovCompact} onMouseLeave={unhovCompact}>
                            {p.name} Guide
                          </Link>
                        ))}
                      </div>
                      {/* Col 3: By Account */}
                      <div>
                        <div style={secHead}>By Account Type</div>
                        {FOREX_ACCOUNTS.map((item) => (
                          <Link key={item.key} to={lp(item.path)} style={compactLink} onMouseEnter={hovCompact} onMouseLeave={unhovCompact}>
                            {t(`mega.${item.key}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link to={lp("/best-forex-brokers")} style={{
                      display: "block", marginTop: 16, padding: "10px 14px", borderRadius: 8,
                      background: "#f0fdf4", color: "#059669", fontSize: 14, fontWeight: 700,
                      textDecoration: "none", textAlign: "center", border: "1px solid #a7f3d0",
                    }}>Best Forex Brokers 2026 — Full Rankings &amp; Comparison <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></Link>
                    <Link to={lp("/rankings")} style={{
                      display: "block", marginTop: 6, padding: "8px 14px", borderRadius: 8,
                      background: "transparent", color: "#1f2937", fontSize: 13, fontWeight: 600,
                      textDecoration: "none", textAlign: "center", transition: "color 0.15s",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#059669"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#1f2937"; }}
                    >{t("mega.browseAllRankings")} <ArrowRight size={12} style={{ verticalAlign: "middle" }} /></Link>
                  </div>
                )}
              </div>

              {/* ─── 2. Crypto Brokers ▾ ─── */}
              <div style={{ position: "relative" }} onMouseEnter={() => enter("crypto")} onMouseLeave={leave}>
                <Link to={lp("/best-crypto-brokers")} style={{
                  fontSize: 15, fontWeight: 500,
                  color: activeDropdown === "crypto" ? "#059669" : "#1f2937",
                  background: activeDropdown === "crypto" ? "#f0fdf4" : "transparent",
                  border: "none", padding: "8px 10px", borderRadius: 8,
                  display: "flex", alignItems: "center", gap: 3,
                  transition: "all 0.2s", whiteSpace: "nowrap", textDecoration: "none",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#059669"; e.currentTarget.style.background = "#f0fdf4"; }}
                  onMouseLeave={(e) => { if (activeDropdown !== "crypto") { e.currentTarget.style.color = "#111827"; e.currentTarget.style.background = "transparent"; } }}
                >
                  {t("nav.cryptoBrokers")}
                  <span style={{
                    color: "#64748b",
                    transition: "transform 0.2s",
                    transform: activeDropdown === "crypto" ? "rotate(180deg)" : "none",
                    display: "inline-flex",
                  }}><ChevronDown size={12} /></span>
                </Link>
                {activeDropdown === "crypto" && (
                  <div style={{ ...ddBase, left: "50%", transform: "translateX(-50%)", width: 380, padding: "20px 24px" }}
                    onMouseEnter={() => enter("crypto")} onMouseLeave={leave}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <div>
                        <div style={secHead}>By Cryptocurrency</div>
                        {CRYPTO_BY_COIN.map((item) => (
                          <Link key={item.key} to={lp(item.path)} style={compactLink} onMouseEnter={hovCompact} onMouseLeave={unhovCompact}>
                            {t(`mega.${item.key}`)}
                          </Link>
                        ))}
                      </div>
                      <div>
                        <div style={secHead}>By Feature</div>
                        {CRYPTO_BY_FEATURE.map((item) => (
                          <Link key={item.key} to={lp(item.path)} style={compactLink} onMouseEnter={hovCompact} onMouseLeave={unhovCompact}>
                            {t(`mega.${item.key}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link to={lp("/best-crypto-brokers")} style={{
                      display: "block", marginTop: 16, padding: "10px 14px", borderRadius: 8,
                      background: "#f0fdf4", color: "#059669", fontSize: 14, fontWeight: 700,
                      textDecoration: "none", textAlign: "center", border: "1px solid #a7f3d0",
                    }}>Best Crypto Brokers 2026 — Full Rankings &amp; Comparison <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></Link>
                  </div>
                )}
              </div>

              {/* ─── M4: New vertical links ─── */}
              <Link to="/cfd-trading" style={{
                fontSize: 15, fontWeight: 500, color: "#1f2937", padding: "8px 8px",
                borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.background = "#eff6ff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#1f2937"; e.currentTarget.style.background = "transparent"; }}
              >CFD</Link>
              <Link to="/copy-trading" style={{
                fontSize: 15, fontWeight: 500, color: "#1f2937", padding: "8px 8px",
                borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "#f5f3ff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#1f2937"; e.currentTarget.style.background = "transparent"; }}
              >Copy Trading</Link>
              <Link to="/spread-betting" style={{
                fontSize: 15, fontWeight: 500, color: "#1f2937", padding: "8px 8px",
                borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fef2f2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#1f2937"; e.currentTarget.style.background = "transparent"; }}
              >Spread Betting</Link>

              {/* ─── 3. Reviews ▾ ─── */}
              <div style={{ position: "relative" }} onMouseEnter={() => enter("reviews")} onMouseLeave={leave}>
                <NavBtn id="reviews" label={t("nav.reviews")} />
                {activeDropdown === "reviews" && (
                  <div style={{ ...ddBase, left: "50%", transform: "translateX(-50%)", width: 460 }}
                    onMouseEnter={() => enter("reviews")} onMouseLeave={leave}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                      <div>
                        <div style={secHead}>{t("mega.topRated")}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {TOP_REVIEWS.map((b) => (
                            <Link key={b.slug} to={lp(`/review/${b.slug}`)}
                              style={{ ...ddLink, justifyContent: "space-between" }}
                              onMouseEnter={hov} onMouseLeave={unhov}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{
                                  width: 28, height: 28, borderRadius: 6,
                                  background: "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontFamily: "Outfit", fontWeight: 800, fontSize: 9, color: "#fff", flexShrink: 0,
                                }}>{b.name.slice(0, 2)}</div>
                                <span style={{ fontWeight: 600 }}>{b.name}</span>
                              </div>
                              <span style={{
                                fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 13,
                                color: b.score >= 9.5 ? "#059669" : "#2563eb",
                                background: b.score >= 9.5 ? "#ecfdf5" : "#eff6ff",
                                padding: "2px 6px", borderRadius: 4,
                              }}>{b.score}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={secHead}>{t("mega.popular")}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {POPULAR_REVIEWS.map((b) => (
                            <Link key={b.slug} to={lp(`/review/${b.slug}`)} style={ddLink}
                              onMouseEnter={hov} onMouseLeave={unhov}
                            >
                              <div style={{
                                width: 28, height: 28, borderRadius: 6,
                                background: "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "Outfit", fontWeight: 800, fontSize: 9, color: "#fff", flexShrink: 0,
                              }}>{b.name.slice(0, 2)}</div>
                              <span style={{ fontWeight: 600 }}>{b.name}</span>
                            </Link>
                          ))}
                        </div>
                        <Link to={lp("/best-forex-brokers")} style={{
                          display: "block", marginTop: 12, padding: "10px 14px", borderRadius: 8,
                          background: "#f0fdf4", color: "#059669", fontSize: 14, fontWeight: 700,
                          textDecoration: "none", textAlign: "center",
                        }}>Best Forex Brokers 2026 — Full Rankings</Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ─── 4. Guides ▾ ─── */}
              <div style={{ position: "relative" }} onMouseEnter={() => enter("guides")} onMouseLeave={leave}>
                <NavBtn id="guides" label={t("nav.guides")} />
                {activeDropdown === "guides" && (
                  <div style={{ ...ddBase, left: "50%", transform: "translateX(-50%)", width: 680 }}
                    onMouseEnter={() => enter("guides")} onMouseLeave={leave}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                      <div>
                        <div style={secHead}>{t("mega.guideGettingStarted")}</div>
                        {GUIDE_GETTING_STARTED.map((item) => (
                          <Link key={item.key} to={lp(item.path)} style={compactLink} onMouseEnter={hovCompact} onMouseLeave={unhovCompact}>
                            {t(`mega.${item.key}`)}
                          </Link>
                        ))}
                      </div>
                      <div>
                        <div style={secHead}>{t("mega.guideStrategiesHead")}</div>
                        {GUIDE_STRATEGIES.map((item) => (
                          <Link key={item.key} to={lp(item.path)} style={compactLink} onMouseEnter={hovCompact} onMouseLeave={unhovCompact}>
                            {t(`mega.${item.key}`)}
                          </Link>
                        ))}
                      </div>
                      <div>
                        <div style={secHead}>{t("mega.guideConceptsHead")}</div>
                        {GUIDE_CONCEPTS.map((item) => (
                          <Link key={item.key} to={lp(item.path)} style={compactLink} onMouseEnter={hovCompact} onMouseLeave={unhovCompact}>
                            {t(`mega.${item.key}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link to={lp("/guides")} style={{
                      display: "block", marginTop: 16, padding: "10px 14px", borderRadius: 8,
                      background: "#f0fdf4", color: "#059669", fontSize: 14, fontWeight: 700,
                      textDecoration: "none", textAlign: "center",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#dcfce7"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
                    >{t("mega.viewAllGuides")} <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></Link>
                  </div>
                )}
              </div>

              {/* ─── 5. Countries ▾ ─── */}
              <div style={{ position: "relative" }} onMouseEnter={() => enter("countries")} onMouseLeave={leave}>
                <NavBtn id="countries" label={t("nav.countries")} />
                {activeDropdown === "countries" && (
                  <div style={{ ...ddBase, right: 0, width: 520 }}
                    onMouseEnter={() => enter("countries")} onMouseLeave={leave}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                      <div>
                        <div style={secHead}>{t("mega.countryEurope")}</div>
                        {COUNTRIES_EUROPE.map((c) => (
                          <Link key={c.code} to={lp(c.path)} style={{ ...compactLink, display: "flex", alignItems: "center", gap: 8 }}
                            onMouseEnter={hovCompact} onMouseLeave={unhovCompact}
                          >
                            <CountryFlag code={c.code} size={14} />
                            {c.name}
                          </Link>
                        ))}
                      </div>
                      <div>
                        <div style={secHead}>{t("mega.countryAsiaPacific")}</div>
                        {COUNTRIES_ASIA_PACIFIC.map((c) => (
                          <Link key={c.code} to={lp(c.path)} style={{ ...compactLink, display: "flex", alignItems: "center", gap: 8 }}
                            onMouseEnter={hovCompact} onMouseLeave={unhovCompact}
                          >
                            <CountryFlag code={c.code} size={14} />
                            {c.name}
                          </Link>
                        ))}
                      </div>
                      <div>
                        <div style={secHead}>{t("mega.countryAmericasMena")}</div>
                        {COUNTRIES_AMERICAS_MENA.map((c) => (
                          <Link key={c.code} to={lp(c.path)} style={{ ...compactLink, display: "flex", alignItems: "center", gap: 8 }}
                            onMouseEnter={hovCompact} onMouseLeave={unhovCompact}
                          >
                            <CountryFlag code={c.code} size={14} />
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link to={lp("/best-forex-brokers-by-country")} style={{
                      display: "block", marginTop: 16, padding: "10px 14px", borderRadius: 8,
                      background: "#f0fdf4", color: "#059669", fontSize: 14, fontWeight: 700,
                      textDecoration: "none", textAlign: "center",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#dcfce7"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
                    >{t("mega.viewAllCountries")} <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></Link>
                  </div>
                )}
              </div>

              {/* ─── Search ─── */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                style={{
                  background: "#f1f5f9", border: "none",
                  color: "#1f2937", padding: "6px 8px", borderRadius: 8,
                  cursor: "pointer", display: "inline-flex", alignItems: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#059669"; e.currentTarget.style.background = "#f0fdf4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#1f2937"; e.currentTarget.style.background = "#f1f5f9"; }}
              ><SearchIcon size={16} /></button>

              {/* ─── Language ─── */}
              <button
                aria-label="Language"
                style={{
                  background: "#f1f5f9", border: "none", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 10px", borderRadius: 8,
                  fontSize: 13, fontWeight: 600, color: "#1f2937",
                  fontFamily: "inherit", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#059669"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#111827"; }}
              >
                <CountryFlag code="GB" size={16} />
                EN
                <ChevronDown size={11} style={{ color: "#64748b" }} />
              </button>

              {/* ─── CTA: Compare Brokers ─── */}
              <Link
                to={lp("/compare")}
                style={{
                  background: "#059669", color: "#fff",
                  padding: "8px 16px", borderRadius: 8,
                  fontWeight: 700, fontSize: 14,
                  textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
                  transition: "background 0.2s", whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#047857"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#059669"; }}
              >
                {t("nav.compare")} Brokers
                <ArrowRight size={14} />
              </Link>

            </nav>
          )}
        </div>
      </div>

      {/* ══ MOBILE NAV ══ */}
      {(mob || tab) && menuOpen && (
        <nav style={{
          padding: "8px 16px 16px", background: "#fff",
          borderTop: "1px solid #e2e8f0", maxHeight: "80vh", overflowY: "auto",
        }}>
          {/* 1. Forex Brokers */}
          <div>
            <div style={{
              display: "flex", alignItems: "center",
              borderBottom: "1px solid #f1f5f9",
            }}>
              <Link to={lp("/best-forex-brokers")} style={{
                flex: 1, fontSize: 16, fontWeight: 500, color: "#111827",
                textDecoration: "none", padding: "12px 0",
              }}>{t("nav.forexBrokers")}</Link>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === "forex" ? null : "forex")}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: "12px 4px",
                  color: "#64748b", fontFamily: "inherit", display: "inline-flex",
                  transition: "transform 0.2s",
                  transform: mobileExpanded === "forex" ? "rotate(180deg)" : "none",
                }}
              ><ChevronDown size={14} /></button>
            </div>
            {mobileExpanded === "forex" && (
              <div style={{ padding: "8px 0 8px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  By Trading Style
                </div>
                {FOREX_CATEGORIES.map((item) => (
                  <Link key={item.key} to={lp(item.path)} style={{
                    display: "block", padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>{t(`mega.${item.key}`)}</Link>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginTop: 10, marginBottom: 6 }}>
                  By Cost
                </div>
                {FOREX_COSTS.map((item) => (
                  <Link key={item.key} to={lp(item.path)} style={{
                    display: "block", padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>{t(`mega.${item.key}`)}</Link>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginTop: 10, marginBottom: 6 }}>
                  By Platform
                </div>
                {FOREX_PLATFORMS.map((p) => (
                  <Link key={p.name} to={lp(p.path)} style={{
                    display: "block", padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>Best {p.name} Brokers</Link>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginTop: 10, marginBottom: 6 }}>
                  Platform Guides
                </div>
                {FOREX_PLATFORMS.map((p) => (
                  <Link key={`guide-${p.name}`} to={lp(`/platform/${p.name.toLowerCase().replace(/\s+/g, "-")}`)} style={{
                    display: "block", padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>{p.name} Guide</Link>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginTop: 10, marginBottom: 6 }}>
                  By Account Type
                </div>
                {FOREX_ACCOUNTS.map((item) => (
                  <Link key={item.key} to={lp(item.path)} style={{
                    display: "block", padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>{t(`mega.${item.key}`)}</Link>
                ))}
                <Link to={lp("/best-forex-brokers")} style={{
                  display: "block", marginTop: 10, padding: "8px 0", fontSize: 14,
                  fontWeight: 700, color: "#059669", textDecoration: "none",
                }}>Best Forex Brokers 2026 — Full Rankings <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></Link>
              </div>
            )}
          </div>

          {/* 2. Crypto Brokers */}
          <div>
            <div style={{
              display: "flex", alignItems: "center",
              borderBottom: "1px solid #f1f5f9",
            }}>
              <Link to={lp("/best-crypto-brokers")} style={{
                flex: 1, fontSize: 16, fontWeight: 500, color: "#111827",
                textDecoration: "none", padding: "12px 0",
              }}>{t("nav.cryptoBrokers")}</Link>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === "crypto" ? null : "crypto")}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: "12px 4px",
                  color: "#64748b", fontFamily: "inherit", display: "inline-flex",
                  transition: "transform 0.2s",
                  transform: mobileExpanded === "crypto" ? "rotate(180deg)" : "none",
                }}
              ><ChevronDown size={14} /></button>
            </div>
            {mobileExpanded === "crypto" && (
              <div style={{ padding: "8px 0 8px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  By Cryptocurrency
                </div>
                {CRYPTO_BY_COIN.map((item) => (
                  <Link key={item.key} to={lp(item.path)} style={{
                    display: "block", padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>{t(`mega.${item.key}`)}</Link>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginTop: 10, marginBottom: 6 }}>
                  By Feature
                </div>
                {CRYPTO_BY_FEATURE.map((item) => (
                  <Link key={item.key} to={lp(item.path)} style={{
                    display: "block", padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>{t(`mega.${item.key}`)}</Link>
                ))}
                <Link to={lp("/best-crypto-brokers")} style={{
                  display: "block", marginTop: 10, padding: "8px 0", fontSize: 14,
                  fontWeight: 700, color: "#059669", textDecoration: "none",
                }}>Best Crypto Brokers 2026 — Full Rankings <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></Link>
              </div>
            )}
          </div>

          {/* M4: New vertical links (mobile) */}
          <Link to="/cfd-trading" onClick={() => setMenuOpen(false)} style={{
            display: "block", padding: "12px 0", fontSize: 16, fontWeight: 700,
            color: "#1f2937", textDecoration: "none", borderBottom: "1px solid #f1f5f9",
          }}>CFD Brokers</Link>
          <Link to="/copy-trading" onClick={() => setMenuOpen(false)} style={{
            display: "block", padding: "12px 0", fontSize: 16, fontWeight: 700,
            color: "#1f2937", textDecoration: "none", borderBottom: "1px solid #f1f5f9",
          }}>Copy Trading</Link>
          <Link to="/spread-betting" onClick={() => setMenuOpen(false)} style={{
            display: "block", padding: "12px 0", fontSize: 16, fontWeight: 700,
            color: "#1f2937", textDecoration: "none", borderBottom: "1px solid #f1f5f9",
          }}>Spread Betting</Link>

          {/* 3. Reviews */}
          <div>
            <MobToggle id="reviews" label={t("nav.reviews")} />
            {mobileExpanded === "reviews" && (
              <div style={{ padding: "8px 0 8px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  {t("mega.topRated")}
                </div>
                {TOP_REVIEWS.map((b) => (
                  <Link key={b.slug} to={lp(`/review/${b.slug}`)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>
                    <span>{b.name}</span>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700, color: b.score >= 9.5 ? "#059669" : "#2563eb" }}>{b.score}</span>
                  </Link>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginTop: 12, marginBottom: 8 }}>
                  {t("mega.popular")}
                </div>
                {POPULAR_REVIEWS.map((b) => (
                  <Link key={b.slug} to={lp(`/review/${b.slug}`)} style={{
                    display: "block", padding: "8px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>{b.name}</Link>
                ))}
                <Link to={lp("/best-forex-brokers")} style={{
                  display: "block", marginTop: 8, padding: "8px 0", fontSize: 14,
                  fontWeight: 700, color: "#059669", textDecoration: "none",
                }}>Best Forex Brokers 2026 — Full Rankings <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></Link>
              </div>
            )}
          </div>

          {/* 4. Guides */}
          <div>
            <MobToggle id="guides" label={t("nav.guides")} />
            {mobileExpanded === "guides" && (
              <div style={{ padding: "8px 0 8px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  {t("mega.guideGettingStarted")}
                </div>
                {GUIDE_GETTING_STARTED.map((item) => (
                  <Link key={item.key} to={lp(item.path)} style={{
                    display: "block", padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>{t(`mega.${item.key}`)}</Link>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginTop: 12, marginBottom: 8 }}>
                  {t("mega.guideStrategiesHead")}
                </div>
                {GUIDE_STRATEGIES.map((item) => (
                  <Link key={item.key} to={lp(item.path)} style={{
                    display: "block", padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>{t(`mega.${item.key}`)}</Link>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginTop: 12, marginBottom: 8 }}>
                  {t("mega.guideConceptsHead")}
                </div>
                {GUIDE_CONCEPTS.map((item) => (
                  <Link key={item.key} to={lp(item.path)} style={{
                    display: "block", padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>{t(`mega.${item.key}`)}</Link>
                ))}
                <Link to={lp("/guides")} style={{
                  display: "block", marginTop: 8, padding: "8px 0", fontSize: 14,
                  fontWeight: 700, color: "#059669", textDecoration: "none",
                }}>{t("mega.viewAllGuides")} <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></Link>
              </div>
            )}
          </div>

          {/* 5. Compare */}
          <MobLink to={lp("/compare")} label={t("nav.compare")} match={location.pathname.includes("/compare")} />

          {/* 6. Countries */}
          <div>
            <MobToggle id="countries" label={t("nav.countries")} />
            {mobileExpanded === "countries" && (
              <div style={{ padding: "8px 0 8px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  {t("mega.countryEurope")}
                </div>
                {COUNTRIES_EUROPE.map((c) => (
                  <Link key={c.code} to={lp(c.path)} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>
                    <CountryFlag code={c.code} size={16} />
                    {c.name}
                  </Link>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginTop: 12, marginBottom: 8 }}>
                  {t("mega.countryAsiaPacific")}
                </div>
                {COUNTRIES_ASIA_PACIFIC.map((c) => (
                  <Link key={c.code} to={lp(c.path)} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>
                    <CountryFlag code={c.code} size={16} />
                    {c.name}
                  </Link>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: 1, marginTop: 12, marginBottom: 8 }}>
                  {t("mega.countryAmericasMena")}
                </div>
                {COUNTRIES_AMERICAS_MENA.map((c) => (
                  <Link key={c.code} to={lp(c.path)} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 0", fontSize: 14, fontWeight: 500, color: "#1f2937", textDecoration: "none",
                  }}>
                    <CountryFlag code={c.code} size={16} />
                    {c.name}
                  </Link>
                ))}
                <Link to={lp("/best-forex-brokers-by-country")} style={{
                  display: "block", marginTop: 8, padding: "8px 0", fontSize: 14,
                  fontWeight: 700, color: "#059669", textDecoration: "none",
                }}>{t("mega.viewAllCountries")} <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></Link>
              </div>
            )}
          </div>

          {/* 7. Method */}
          <MobLink to={lp("/methodology")} label={t("nav.method")} match={location.pathname.includes("/methodology")} />

          {/* 8. About Us */}
          <MobLink to={lp("/about")} label={t("nav.about")} match={location.pathname.includes("/about")} />

        </nav>
      )}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
