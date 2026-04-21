import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  X as XIcon,
  Menu as MenuIcon,
  ArrowRight,
  ArrowUpRight,
  Search as SearchIcon,
} from "lucide-react";
import { useMedia } from "../hooks/useMedia";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import CountryFlag from "./CountryFlag";
import { COUNTRY_VERTICALS, VERTICAL_META } from "../data/countryVerticals";
import RANKINGS from "../data/rankings";
import { getAllBrokersWithData } from "../data/brokers";

const SearchOverlay = lazy(() => import("./SearchOverlay"));

/* Derived catalog sizes — single source для всех "N rankings / N brokers" подсчётов. */
const TOTAL_RANKINGS = RANKINGS.length;
const TOTAL_BROKERS = getAllBrokersWithData().length;
const TOTAL_COUNTRIES = COUNTRY_VERTICALS.length;
const TOTAL_VERTICALS = Object.keys(VERTICAL_META).length;

/* ═══════════════════════════════════════════════════════
   MENU DATA
   ═══════════════════════════════════════════════════════ */

/* Labels sitewide используют "Best {vertical} {Brokers|Platforms|Apps}" pattern.
   Большинство destination URL /best-* и title тоже начинаются с "Best" (exact-match).
   Для исключений (/lowest-spread-forex-brokers, /no-minimum-deposit-forex-brokers)
   "Best" prefix работает как commercial modifier — ловит best-модифицированные queries
   ("best lowest spread forex brokers") без потери keyword-match на core-phrase. */
const BROKERS_BY_ASSET = [
  { label: "Best Forex Brokers",           path: "/best-forex-brokers",          count: 48 },
  { label: "Best CFD Brokers",             path: "/best-cfd-brokers",            count: 46 },
  { label: "Best Stock Brokers",           path: "/best-stock-brokers",          count: 13 },
  { label: "Best Options Brokers",         path: "/best-options-brokers",        count: 9  },
  { label: "Best Futures Brokers",         path: "/best-futures-brokers",        count: 10 },
  { label: "Best Crypto Brokers",          path: "/best-crypto-brokers",         count: 28 },
  { label: "Best Copy Trading Platforms",  path: "/best-copy-trading-platforms", count: 18 },
  { label: "Best Spread Betting Brokers",  path: "/best-spread-betting-brokers", count: 10 },
];

const BROKERS_BY_STYLE = [
  { label: "Best Forex Brokers for Beginners",    path: "/best-forex-brokers-for-beginners" },
  // "Best" prepended to non-/best slug per sitewide pattern (user-requested).
  // Acts as commercial modifier; title on destination is "Lowest Spread Forex Brokers".
  { label: "Best Lowest Spread Forex Brokers",    path: "/lowest-spread-forex-brokers" },
  { label: "Best ECN Forex Brokers",              path: "/best-ecn-forex-brokers" },
  { label: "Best Forex Brokers for Scalping",     path: "/best-forex-brokers-for-scalping" },
  { label: "Best Social Trading Platforms",       path: "/best-social-trading-platforms" },
  // "Best" prepended to non-/best slug per sitewide pattern (user-requested).
  // Acts as commercial modifier; title on destination is "No Minimum Deposit Forex Brokers".
  { label: "Best No Minimum Deposit Forex Brokers", path: "/no-minimum-deposit-forex-brokers" },
  { label: "Best Forex Brokers for Professionals", path: "/best-forex-brokers-for-professionals" },
  { label: "Best Islamic Forex Brokers",          path: "/best-islamic-forex-brokers" },
];

const BROKERS_BY_PLATFORM = [
  { label: "Best MT4 Brokers",          path: "/best-metatrader-4-brokers" },
  { label: "Best MT5 Brokers",          path: "/best-metatrader-5-brokers" },
  { label: "Best cTrader Brokers",      path: "/best-ctrader-brokers" },
  { label: "Best TradingView Brokers",  path: "/best-tradingview-brokers" },
  { label: "Best Forex Trading Apps",   path: "/best-forex-trading-apps" },
  { label: "Best Crypto Trading Apps",  path: "/best-crypto-trading-apps" },
];

const TOP_REVIEWS = [
  { name: "IC Markets",  slug: "ic-markets",  score: 9.6 },
  { name: "FP Markets",  slug: "fp-markets",  score: 9.5 },
  { name: "IG",          slug: "ig",          score: 9.3 },
  { name: "Pepperstone", slug: "pepperstone", score: 9.3 },
  { name: "Forex.com",   slug: "forex-com",   score: 9.2 },
];

const POPULAR_REVIEWS = [
  { name: "eToro",               slug: "etoro",               tag: "Copy Trading" },
  { name: "Plus500",             slug: "plus500",             tag: "CFD" },
  { name: "Interactive Brokers", slug: "interactive-brokers", tag: "Multi-asset" },
  { name: "Robinhood",           slug: "robinhood",           tag: "Stocks" },
  { name: "tastytrade",          slug: "tastytrade",          tag: "Options" },
];

const GUIDE_GETTING_STARTED = [
  { label: "How to Choose a Broker",     path: "/guide/how-to-choose-a-forex-broker" },
  { label: "How to Start Forex Trading", path: "/guide/how-to-start-forex-trading" },
  { label: "What is Forex Trading",      path: "/guide/what-is-forex-trading" },
  { label: "Demo Account Guide",         path: "/guide/forex-demo-account-guide" },
  { label: "What is a Pip",              path: "/guide/what-is-a-pip" },
];

const GUIDE_STRATEGIES = [
  { label: "Forex Strategies",    path: "/guide/forex-trading-strategies" },
  { label: "Scalping Guide",      path: "/guide/scalping-strategy-guide" },
  { label: "Day Trading Guide",   path: "/guide/day-trading-guide" },
  { label: "Swing Trading Guide", path: "/guide/swing-trading-guide" },
  { label: "Copy Trading Guide",  path: "/guide/copy-trading-guide" },
];

const GUIDE_CONCEPTS = [
  { label: "Spreads & Fees",      path: "/guide/understanding-spreads-and-fees" },
  { label: "ECN vs Market Maker", path: "/guide/ecn-vs-market-maker" },
  { label: "Regulation Guide",    path: "/guide/forex-regulation-guide" },
  { label: "What is Leverage",    path: "/guide/what-is-leverage" },
  { label: "Technical Analysis",  path: "/guide/technical-analysis-guide" },
];

/* Countries dropdown — Variant B (Split by Vertical).
   Подборка: 6 топ-forex стран × 6 топ-crypto стран × 6 other-asset combos.
   Anchor text полный: "Forex Brokers UK", "Stock Brokers USA" и т.д. */
const byCountry = (slug) => COUNTRY_VERTICALS.find((c) => c.slug === slug);
const COUNTRIES_FOREX = [
  byCountry("uk"), byCountry("usa"), byCountry("australia"),
  byCountry("germany"), byCountry("singapore"), byCountry("uae"),
].filter(Boolean);
const COUNTRIES_CRYPTO = [
  byCountry("usa"), byCountry("uk"), byCountry("australia"),
  byCountry("uae"), byCountry("singapore"), byCountry("india"),
].filter(Boolean);
const COUNTRIES_OTHER = [
  { country: byCountry("usa"),       vertKey: "stocks"        },
  { country: byCountry("usa"),       vertKey: "options"       },
  { country: byCountry("usa"),       vertKey: "futures"       },
  { country: byCountry("uk"),        vertKey: "spreadBetting" },
  { country: byCountry("uk"),        vertKey: "cfd"           },
  { country: byCountry("australia"), vertKey: "cfd"           },
].filter((c) => c.country);

/* Mobile Countries — одномерный список топ-стран (accordion) с per-vertical chips */
const MOBILE_COUNTRY_SLUGS = [
  "uk", "usa", "australia", "germany", "singapore", "uae",
  "canada", "south-africa", "india", "france",
];
const MOBILE_COUNTRIES = MOBILE_COUNTRY_SLUGS
  .map(byCountry)
  .filter(Boolean);

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

/* Square logo chip 32×32 для Reviews dropdown — из public/logos/{slug}.png.
   Имя брокера рендерится отдельным span, потому img — decorative. */
function MenuSquareLogo({ slug, name, size = 32 }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div
        role="img"
        aria-hidden="true"
        style={{
          width: size, height: size, borderRadius: 6,
          background: "#f1f5f9", border: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 11,
          color: "#0f172a", letterSpacing: -0.3, flexShrink: 0,
        }}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 6,
      background: "#ffffff", border: "1px solid #e2e8f0",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", flexShrink: 0, padding: 3,
    }}>
      <img
        src={`${import.meta.env.BASE_URL}logos/${slug}.png`}
        alt=""
        aria-hidden="true"
        width={size - 6}
        height={size - 6}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        onError={() => setErr(true)}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════ */

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
  /* Escape — закрывает открытый dropdown для клавиатуры */
  useEffect(() => {
    if (!activeDropdown) return undefined;
    const fn = (e) => {
      if (e.key === "Escape") {
        clearTimeout(timeoutRef.current);
        setActiveDropdown(null);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [activeDropdown]);

  /* ── shared styles ── */
  const secHead = {
    fontSize: 11, fontWeight: 700, color: "#0f172a",
    textTransform: "uppercase", letterSpacing: 1.2,
    marginBottom: 10, paddingBottom: 8,
    borderBottom: "1px solid #f1f5f9",
  };
  const ddBase = {
    position: "absolute", top: "calc(100% + 8px)",
    background: "#fff", borderRadius: 16,
    border: "1px solid #e2e8f0",
    boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.05)",
    padding: "22px 24px", zIndex: 1001,
  };
  const bottomCta = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 8, marginTop: 16, padding: "10px 14px",
    background: "#f8fafc", color: "#047857", fontSize: 13.5, fontWeight: 700,
    textDecoration: "none",
    borderTop: "1px solid #e2e8f0", borderLeft: "3px solid #059669",
    transition: "background 160ms",
  };
  const colLink = {
    display: "flex", alignItems: "center", gap: 8,
    padding: "7px 8px", borderRadius: 6,
    textDecoration: "none", color: "#0f172a",
    fontSize: 13, fontWeight: 600,
    transition: "background 0.15s, color 0.15s",
  };

  /* ── Desktop nav button ── */
  const NavBtn = ({ id, label, href }) => {
    const isActive = activeDropdown === id;
    const content = (
      <>
        {label}
        <span style={{
          color: "#64748b",
          transition: "transform 0.2s",
          transform: isActive ? "rotate(180deg)" : "none",
          display: "inline-flex",
        }}><ChevronDown size={12} /></span>
      </>
    );
    const styl = {
      fontSize: 15, fontWeight: 500,
      color: isActive ? "#047857" : "#0f172a",
      background: "transparent",
      border: "none",
      borderBottom: `3px solid ${isActive ? "#059669" : "transparent"}`,
      padding: "8px 10px 5px",
      cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
      transition: "color 160ms, border-color 160ms",
      fontFamily: "inherit", whiteSpace: "nowrap", textDecoration: "none",
    };
    if (href) {
      return (
        <Link to={lp(href)} style={styl}
          onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = "#047857"; e.currentTarget.style.borderBottomColor = "#059669"; } }}
          onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.borderBottomColor = "transparent"; } }}
        >{content}</Link>
      );
    }
    return <button type="button" style={styl}>{content}</button>;
  };

  /* ── Desktop simple link ── */
  const NavLink = ({ to, label }) => (
    <Link
      to={lp(to)}
      style={{
        fontSize: 15, fontWeight: 500, color: "#0f172a",
        textDecoration: "none", padding: "8px 10px 5px",
        borderBottom: "3px solid transparent",
        transition: "color 160ms, border-color 160ms", whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "#047857"; e.currentTarget.style.borderBottomColor = "#059669"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.borderBottomColor = "transparent"; }}
    >{label}</Link>
  );

  /* ── Mobile section toggle ── */
  const MobToggle = ({ id, label }) => (
    <button
      onClick={() => setMobileExpanded(mobileExpanded === id ? null : id)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", fontSize: 16, fontWeight: 500, color: "#0f172a",
        background: "none", border: "none", padding: "14px 0",
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

  /* ══════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════ */
  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
    >
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
            <span style={{ display: "inline-block", width: mob ? 8 : 10, height: mob ? 8 : 10, borderRadius: "50%", background: "#f59e0b", marginLeft: 3, verticalAlign: "baseline" }} />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: mob ? 11 : 15, color: "#0f172a", letterSpacing: "-0.3px", marginLeft: 1 }}>com</span>
          </Link>

          {/* Mobile actions */}
          {(mob || tab) && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                style={{ background: "none", border: "none", color: "#0f172a", padding: "4px 8px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
              ><SearchIcon size={20} /></button>
              <button
                aria-label="Language (coming soon)"
                disabled
                style={{
                  background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "not-allowed",
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "5px 10px", borderRadius: 8,
                  fontSize: 12, fontWeight: 700, color: "#94a3b8",
                  fontFamily: "inherit", letterSpacing: 0.5, opacity: 0.7,
                }}
              >EN</button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                style={{ background: "none", border: "none", color: "#0f172a", padding: "4px 8px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
              >{menuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}</button>
            </div>
          )}

          {/* Desktop nav */}
          {!(mob || tab) && (
            <nav style={{ display: "flex", gap: 2, alignItems: "center" }}>

              {/* 1. Brokers ▾ */}
              <div style={{ position: "relative" }} onMouseEnter={() => enter("brokers")} onMouseLeave={leave} onFocus={() => enter("brokers")} onBlur={leave}>
                <NavBtn id="brokers" label={t("nav.brokers")} href="/rankings" />
                {activeDropdown === "brokers" && (
                  <div
                    style={{ ...ddBase, left: "50%", transform: "translateX(-50%)", width: 760 }}
                    onMouseEnter={() => enter("brokers")} onMouseLeave={leave}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr 1fr", gap: 20 }}>
                      <div>
                        <div style={secHead}>By Asset Class</div>
                        {BROKERS_BY_ASSET.map((item) => (
                          <Link
                            key={item.path}
                            to={lp(item.path)}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "7px 10px", borderRadius: 6, textDecoration: "none",
                              color: "#0f172a", fontWeight: 600, fontSize: 14,
                              transition: "background 0.15s, color 0.15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#047857"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0f172a"; }}
                          >
                            <span>{item.label}</span>
                            <span style={{
                              fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
                              color: "#64748b", background: "#f1f5f9", padding: "1px 6px", borderRadius: 4,
                            }}>{item.count}</span>
                          </Link>
                        ))}
                      </div>
                      <div>
                        <div style={secHead}>By Trading Style</div>
                        {BROKERS_BY_STYLE.map((item) => (
                          <Link key={item.path} to={lp(item.path)} className="rb-link-rail" style={{ width: "100%" }}>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <div>
                        <div style={secHead}>By Platform</div>
                        {BROKERS_BY_PLATFORM.map((item) => (
                          <Link key={item.path} to={lp(item.path)} className="rb-link-rail" style={{ width: "100%" }}>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link to={lp("/rankings")} style={bottomCta}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <span>Browse all {TOTAL_RANKINGS} rankings across {TOTAL_BROKERS} brokers</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              {/* 2. Reviews ▾ */}
              <div style={{ position: "relative" }} onMouseEnter={() => enter("reviews")} onMouseLeave={leave} onFocus={() => enter("reviews")} onBlur={leave}>
                <NavBtn id="reviews" label={t("nav.reviews")} href="/reviews" />
                {activeDropdown === "reviews" && (
                  <div style={{ ...ddBase, left: "50%", transform: "translateX(-50%)", width: 540 }}
                    onMouseEnter={() => enter("reviews")} onMouseLeave={leave}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <div>
                        <div style={secHead}>Top Rated</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {TOP_REVIEWS.map((b) => (
                            <Link key={b.slug} to={lp(`/reviews/${b.slug}`)}
                              style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "6px 8px",
                                borderRadius: 6, textDecoration: "none", transition: "background 0.15s",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                              <MenuSquareLogo slug={b.slug} name={b.name} size={32} />
                              <span style={{
                                fontSize: 14, fontWeight: 600, color: "#0f172a",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                minWidth: 0, flex: 1,
                              }}>{b.name}</span>
                              <span style={{
                                marginLeft: "auto",
                                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 12,
                                color: "#0f172a", background: "#f1f5f9",
                                padding: "2px 6px", borderRadius: 4, flexShrink: 0,
                              }}>{b.score}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={secHead}>Popular</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {POPULAR_REVIEWS.map((b) => (
                            <Link key={b.slug} to={lp(`/reviews/${b.slug}`)}
                              style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "6px 8px",
                                borderRadius: 6, textDecoration: "none", transition: "background 0.15s",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                              <MenuSquareLogo slug={b.slug} name={b.name} size={32} />
                              <span style={{
                                fontSize: 14, fontWeight: 600, color: "#0f172a",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                minWidth: 0, flex: 1,
                              }}>{b.name}</span>
                              <span style={{
                                marginLeft: "auto", fontSize: 10.5, fontWeight: 700,
                                color: "#64748b", textTransform: "uppercase", letterSpacing: 0.4,
                                flexShrink: 0,
                              }}>{b.tag}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Link to={lp("/reviews")} style={bottomCta}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <span>Browse all {TOTAL_BROKERS} broker reviews</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              <NavLink to="/compare" label={t("nav.compare")} />

              {/* 4. Guides ▾ */}
              <div style={{ position: "relative" }} onMouseEnter={() => enter("guides")} onMouseLeave={leave} onFocus={() => enter("guides")} onBlur={leave}>
                <NavBtn id="guides" label={t("nav.guides")} href="/guides" />
                {activeDropdown === "guides" && (
                  <div style={{ ...ddBase, left: "50%", transform: "translateX(-50%)", width: 680 }}
                    onMouseEnter={() => enter("guides")} onMouseLeave={leave}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                      <div>
                        <div style={secHead}>Getting Started</div>
                        {GUIDE_GETTING_STARTED.map((i) => (
                          <Link key={i.path} to={lp(i.path)} className="rb-link-rail" style={{ width: "100%" }}>{i.label}</Link>
                        ))}
                      </div>
                      <div>
                        <div style={secHead}>Strategies</div>
                        {GUIDE_STRATEGIES.map((i) => (
                          <Link key={i.path} to={lp(i.path)} className="rb-link-rail" style={{ width: "100%" }}>{i.label}</Link>
                        ))}
                      </div>
                      <div>
                        <div style={secHead}>Concepts</div>
                        {GUIDE_CONCEPTS.map((i) => (
                          <Link key={i.path} to={lp(i.path)} className="rb-link-rail" style={{ width: "100%" }}>{i.label}</Link>
                        ))}
                      </div>
                    </div>
                    <Link to={lp("/guides")} style={bottomCta}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <span>View all guides</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              {/* 5. Countries ▾ — Variant B (Split by Vertical) */}
              <div style={{ position: "relative" }} onMouseEnter={() => enter("countries")} onMouseLeave={leave} onFocus={() => enter("countries")} onBlur={leave}>
                <NavBtn id="countries" label={t("nav.countries")} href="/best-brokers-by-country" />
                {activeDropdown === "countries" && (
                  <div style={{ ...ddBase, right: 0, width: 780 }}
                    onMouseEnter={() => enter("countries")} onMouseLeave={leave}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22 }}>
                      {/* Col 1: Forex */}
                      <div>
                        <div style={{ ...secHead, color: VERTICAL_META.forex.color, borderBottomColor: "#ecfdf5" }}>
                          Forex Brokers
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {COUNTRIES_FOREX.map((c) => {
                            const v = c.verticals.find((x) => x.key === "forex");
                            if (!v) return null;
                            return (
                              <Link key={c.slug} to={lp(v.path)}
                                style={colLink}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#047857"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0f172a"; }}
                              >
                                <CountryFlag code={c.code} size={16} />
                                <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  Best Forex Brokers {c.geo}
                                </span>
                                <ArrowUpRight size={12} color="#cbd5e1" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                      {/* Col 2: Crypto */}
                      <div>
                        <div style={{ ...secHead, color: VERTICAL_META.crypto.color, borderBottomColor: "#fef3c7" }}>
                          Crypto Brokers
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {COUNTRIES_CRYPTO.map((c) => {
                            const v = c.verticals.find((x) => x.key === "crypto");
                            if (!v) return null;
                            return (
                              <Link key={c.slug} to={lp(v.path)}
                                style={colLink}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#047857"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0f172a"; }}
                              >
                                <CountryFlag code={c.code} size={16} />
                                <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  Best Crypto Brokers {c.geo}
                                </span>
                                <ArrowUpRight size={12} color="#cbd5e1" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                      {/* Col 3: Other assets */}
                      <div>
                        <div style={{ ...secHead, color: "#0f172a", borderBottomColor: "#e2e8f0" }}>
                          Other Assets
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {COUNTRIES_OTHER.map((row) => {
                            const meta = VERTICAL_META[row.vertKey];
                            const v = row.country.verticals.find((x) => x.key === row.vertKey);
                            if (!meta || !v) return null;
                            return (
                              <Link
                                key={`${row.country.slug}-${row.vertKey}`}
                                to={lp(v.path)}
                                style={colLink}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#047857"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0f172a"; }}
                              >
                                <CountryFlag code={row.country.code} size={16} />
                                <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  Best {meta.label} {row.vertKey !== "spreadBetting" && `${meta.word} `}{row.country.geo}
                                </span>
                                <ArrowUpRight size={12} color="#cbd5e1" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <Link to={lp("/best-brokers-by-country")} style={bottomCta}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <span>All {TOTAL_COUNTRIES} countries across {TOTAL_VERTICALS} verticals</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              <NavLink to="/methodology" label={t("nav.methodology")} />

              {/* Right rail: Search · Lang (disabled) · CTA */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  style={{
                    background: "#f1f5f9", border: "none", color: "#0f172a",
                    padding: "6px 8px", borderRadius: 8, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#047857"; e.currentTarget.style.background = "#e2e8f0"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.background = "#f1f5f9"; }}
                ><SearchIcon size={16} /></button>

                <button
                  aria-label="Language (coming soon)"
                  disabled
                  style={{
                    background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "not-allowed",
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "5px 10px", borderRadius: 8,
                    fontSize: 13, fontWeight: 700, color: "#94a3b8",
                    fontFamily: "inherit", letterSpacing: 0.5, opacity: 0.7,
                  }}
                >EN <ChevronDown size={11} /></button>

                <Link to={lp("/find-your-broker")} className="cta-orange" style={{
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                  padding: "8px 16px", borderRadius: 8,
                  fontWeight: 700, fontSize: 14,
                  textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
                  transition: "all 0.2s", whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(245,158,11,0.2)",
                }}>
                  {t("nav.findBroker")} <ArrowRight size={14} />
                </Link>
              </div>
            </nav>
          )}
        </div>
      </div>

      {/* Mobile menu panel */}
      {(mob || tab) && menuOpen && (
        <nav style={{
          background: "#fff", borderTop: "1px solid #e2e8f0",
          borderBottom: "1px solid #e2e8f0",
          padding: "8px 16px 20px",
          maxHeight: "calc(100vh - 64px)", overflowY: "auto",
        }}>
          {/* Brokers */}
          <MobToggle id="brokers" label={t("nav.brokers")} />
          {mobileExpanded === "brokers" && (
            <div style={{ padding: "6px 0 10px 12px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, margin: "8px 0 6px" }}>By Asset Class</div>
              {BROKERS_BY_ASSET.map((i) => (
                <Link key={i.path} to={lp(i.path)} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "8px 0", fontSize: 14, fontWeight: 500,
                  color: "#0f172a", textDecoration: "none",
                }}>
                  <span>{i.label}</span>
                  <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono',monospace" }}>{i.count}</span>
                </Link>
              ))}
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 6px" }}>By Trading Style</div>
              {BROKERS_BY_STYLE.map((i) => (
                <Link key={i.path} to={lp(i.path)} style={{ display: "block", padding: "6px 0", fontSize: 14, color: "#0f172a", textDecoration: "none" }}>{i.label}</Link>
              ))}
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 6px" }}>By Platform</div>
              {BROKERS_BY_PLATFORM.map((i) => (
                <Link key={i.path} to={lp(i.path)} style={{ display: "block", padding: "6px 0", fontSize: 14, color: "#0f172a", textDecoration: "none" }}>{i.label}</Link>
              ))}
              <Link to={lp("/rankings")} style={{ display: "block", marginTop: 10, padding: "8px 0", fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none" }}>
                Browse all {TOTAL_RANKINGS} rankings <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
              </Link>
            </div>
          )}

          {/* Reviews */}
          <MobToggle id="reviews" label={t("nav.reviews")} />
          {mobileExpanded === "reviews" && (
            <div style={{ padding: "6px 0 10px 12px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, margin: "8px 0 6px" }}>Top Rated</div>
              {TOP_REVIEWS.map((b) => (
                <Link key={b.slug} to={lp(`/reviews/${b.slug}`)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 0", fontSize: 14, color: "#0f172a", textDecoration: "none",
                }}>
                  <span>{b.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: "#059669" }}>{b.score}</span>
                </Link>
              ))}
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 6px" }}>Popular</div>
              {POPULAR_REVIEWS.map((b) => (
                <Link key={b.slug} to={lp(`/reviews/${b.slug}`)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 0", fontSize: 14, color: "#0f172a", textDecoration: "none",
                }}>
                  <span>{b.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{b.tag}</span>
                </Link>
              ))}
              <Link to={lp("/reviews")} style={{ display: "block", marginTop: 10, padding: "8px 0", fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none" }}>
                All {TOTAL_BROKERS} reviews <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
              </Link>
            </div>
          )}

          <Link to={lp("/compare")} style={{
            display: "block", fontSize: 16, fontWeight: 500,
            color: "#0f172a", textDecoration: "none", padding: "14px 0",
            borderBottom: "1px solid #f1f5f9",
          }}>{t("nav.compare")}</Link>

          {/* Guides */}
          <MobToggle id="guides" label={t("nav.guides")} />
          {mobileExpanded === "guides" && (
            <div style={{ padding: "6px 0 10px 12px" }}>
              {[["Getting Started", GUIDE_GETTING_STARTED], ["Strategies", GUIDE_STRATEGIES], ["Concepts", GUIDE_CONCEPTS]].map(([head, arr]) => (
                <div key={head}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, margin: "8px 0 6px" }}>{head}</div>
                  {arr.map((i) => (
                    <Link key={i.path} to={lp(i.path)} style={{ display: "block", padding: "6px 0", fontSize: 14, color: "#0f172a", textDecoration: "none" }}>{i.label}</Link>
                  ))}
                </div>
              ))}
              <Link to={lp("/guides")} style={{ display: "block", marginTop: 10, padding: "8px 0", fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none" }}>
                View all guides <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
              </Link>
            </div>
          )}

          {/* Countries — mobile accordion с full-keyword links */}
          <MobToggle id="countries" label={t("nav.countries")} />
          {mobileExpanded === "countries" && (
            <div style={{ padding: "6px 0 10px 12px" }}>
              {MOBILE_COUNTRIES.map((c) => (
                <div key={c.slug} style={{
                  padding: "10px 0", borderBottom: "1px solid #f1f5f9",
                }}>
                  {/* Country heading — plain text, НЕ ссылка (link equity идёт через chips) */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    marginBottom: 6,
                  }}>
                    <CountryFlag code={c.code} size={16} />
                    <span style={{
                      fontSize: 14, color: "#0f172a", fontWeight: 700,
                      fontFamily: "'Outfit', sans-serif",
                    }}>{c.name}</span>
                    <span style={{
                      marginLeft: "auto",
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 10, fontWeight: 700, color: "#64748b",
                    }}>{c.regulator.split(" / ")[0]}</span>
                  </div>
                  {/* Vertical links — full-keyword анкоры */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {c.verticals.map((v) => {
                      const meta = VERTICAL_META[v.key];
                      if (!meta) return null;
                      return (
                        <Link key={v.key} to={lp(v.path)} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "6px 8px", borderRadius: 6,
                          textDecoration: "none",
                          fontSize: 13.5, fontWeight: 600, color: "#0f172a",
                        }}>
                          Best {meta.label} {v.key !== "spreadBetting" && `${meta.word} `}{c.geo}
                          <ArrowUpRight size={12} color="#cbd5e1" style={{ marginLeft: "auto" }} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <Link to={lp("/best-brokers-by-country")} style={{ display: "block", marginTop: 10, padding: "8px 0", fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none" }}>
                All {TOTAL_COUNTRIES} countries across {TOTAL_VERTICALS} verticals <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
              </Link>
            </div>
          )}

          <Link to={lp("/methodology")} style={{
            display: "block", fontSize: 16, fontWeight: 500,
            color: "#0f172a", textDecoration: "none", padding: "14px 0",
            borderBottom: "1px solid #f1f5f9",
          }}>{t("nav.methodology")}</Link>

          <Link to={lp("/about")} style={{
            display: "block", fontSize: 16, fontWeight: 500,
            color: "#0f172a", textDecoration: "none", padding: "14px 0",
            borderBottom: "1px solid #f1f5f9",
          }}>{t("nav.about")}</Link>

          <Link to={lp("/find-your-broker")} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            margin: "16px 0 8px", padding: "14px 20px", borderRadius: 12,
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            color: "#0f172a", fontWeight: 700, fontSize: 16,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(245,158,11,0.25)",
          }}>{t("nav.findBroker")} <ArrowRight size={16} /></Link>
        </nav>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <Suspense fallback={null}>
          <SearchOverlay onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}
    </header>
  );
}
