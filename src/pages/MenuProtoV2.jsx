import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight, Search as SearchIcon, Menu as MenuIcon, X as XIcon } from "lucide-react";
import CountryFlag from "../components/CountryFlag";

/* ──────────────────────────────────────────────────────────────
   MenuProtoV2 — целевой концепт главного меню (/proto/menu-v2)

   Ключевые изменения vs live Header.jsx:
   1. «Forex Brokers ▾» + «Crypto Brokers ▾» → один «Brokers ▾»
      с 3 колонками (By Asset × 8 / By Trading Style × 8 / By Platform × 6)
   2. «Reviews ▾» — настоящие wide-лого вместо монограмм,
      линк на /reviews (фикс: раньше вёл на /best-forex-brokers)
   3. Compare + Methodology возвращены на desktop
   4. Countries — per-vertical чипы (клик на страну ведёт в forex-landing,
      рядом мини-ссылки CFD/Crypto для той же страны — все URL реальные)
   5. Language — оставлен в UI, но disabled state (RU/DE не готовы)
   ────────────────────────────────────────────────────────────── */

const BROKERS_BY_ASSET = [
  { label: "Forex Brokers",       path: "/best-forex-brokers",         count: 48 },
  { label: "CFD Brokers",         path: "/best-cfd-brokers",           count: 46 },
  { label: "Stock Brokers",       path: "/best-stock-brokers",         count: 13 },
  { label: "Options Brokers",     path: "/best-options-brokers",       count: 9  },
  { label: "Futures Brokers",     path: "/best-futures-brokers",       count: 10 },
  { label: "Crypto Brokers",      path: "/best-crypto-brokers",        count: 28 },
  { label: "Copy Trading",        path: "/best-copy-trading-platforms",count: 18 },
  { label: "Spread Betting",      path: "/best-spread-betting-brokers",count: 10 },
];

const BROKERS_BY_STYLE = [
  { label: "For Beginners",      path: "/best-forex-brokers-for-beginners" },
  { label: "Lowest Spreads",     path: "/lowest-spread-forex-brokers" },
  { label: "ECN Brokers",        path: "/best-ecn-forex-brokers" },
  { label: "For Scalping",       path: "/best-forex-brokers-for-scalping" },
  { label: "Social Trading",     path: "/best-social-trading-platforms" },
  { label: "No Min. Deposit",    path: "/no-minimum-deposit-forex-brokers" },
  { label: "For Professionals",  path: "/best-forex-brokers-for-professionals" },
  { label: "Islamic Accounts",   path: "/best-islamic-forex-brokers" },
];

const BROKERS_BY_PLATFORM = [
  { label: "MetaTrader 4",  path: "/best-metatrader-4-brokers" },
  { label: "MetaTrader 5",  path: "/best-metatrader-5-brokers" },
  { label: "cTrader",       path: "/best-ctrader-brokers" },
  { label: "TradingView",   path: "/best-tradingview-brokers" },
  { label: "Trading Apps",  path: "/best-forex-trading-apps" },
  { label: "Crypto Apps",   path: "/best-crypto-trading-apps" },
];

const TOP_REVIEWS = [
  { name: "IC Markets",   slug: "ic-markets",   score: 9.6 },
  { name: "FP Markets",   slug: "fp-markets",   score: 9.5 },
  { name: "IG",           slug: "ig",           score: 9.3 },
  { name: "Pepperstone",  slug: "pepperstone",  score: 9.3 },
  { name: "Forex.com",    slug: "forex-com",    score: 9.2 },
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
  { label: "Forex Strategies",     path: "/guide/forex-trading-strategies" },
  { label: "Scalping Guide",       path: "/guide/scalping-strategy-guide" },
  { label: "Day Trading Guide",    path: "/guide/day-trading-guide" },
  { label: "Swing Trading Guide",  path: "/guide/swing-trading-guide" },
  { label: "Copy Trading Guide",   path: "/guide/copy-trading-guide" },
];

const GUIDE_CONCEPTS = [
  { label: "Spreads & Fees",       path: "/guide/understanding-spreads-and-fees" },
  { label: "ECN vs Market Maker",  path: "/guide/ecn-vs-market-maker" },
  { label: "Regulation Guide",     path: "/guide/forex-regulation-guide" },
  { label: "What is Leverage",     path: "/guide/what-is-leverage" },
  { label: "Technical Analysis",   path: "/guide/technical-analysis-guide" },
];

const COUNTRIES = [
  { code: "GB", name: "United Kingdom", forex: "/best-forex-brokers-uk",           crypto: "/best-crypto-brokers-uk",         cfd: "/best-cfd-brokers-uk" },
  { code: "US", name: "United States",  forex: "/best-forex-brokers-usa",          crypto: "/best-crypto-brokers-usa" },
  { code: "AU", name: "Australia",      forex: "/best-forex-brokers-australia",    crypto: "/best-crypto-brokers-australia",  cfd: "/best-cfd-brokers-australia" },
  { code: "DE", name: "Germany",        forex: "/best-forex-brokers-germany" },
  { code: "FR", name: "France",         forex: "/best-forex-brokers-france" },
  { code: "CH", name: "Switzerland",    forex: "/best-forex-brokers-switzerland" },
  { code: "CY", name: "Cyprus",         forex: "/best-forex-brokers-cyprus" },
  { code: "SG", name: "Singapore",      forex: "/best-forex-brokers-singapore",    crypto: "/best-crypto-brokers-singapore" },
  { code: "AE", name: "UAE",            forex: "/best-forex-brokers-uae",          crypto: "/best-crypto-brokers-uae" },
  { code: "JP", name: "Japan",          forex: "/best-forex-brokers-japan" },
  { code: "HK", name: "Hong Kong",      forex: "/best-forex-brokers-hong-kong" },
  { code: "IN", name: "India",          forex: "/best-forex-brokers-india",        crypto: "/best-crypto-brokers-india" },
  { code: "CA", name: "Canada",         forex: "/best-forex-brokers-canada" },
  { code: "ZA", name: "South Africa",   forex: "/best-forex-brokers-south-africa", crypto: "/best-crypto-brokers-south-africa" },
  { code: "TR", name: "Turkey",         forex: "/best-forex-brokers-turkey" },
];

/* Wide logo из public/logos-wide/ с fallback на PNG и имя брокера */
function MenuLogo({ slug, name, w = 96, h = 28 }) {
  const [err, setErr] = useState(false);
  const [ext, setExt] = useState("svg");
  if (err && ext === "svg") {
    return (
      <div style={{
        width: w, height: h, borderRadius: 6, background: "#f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 11, color: "#0f172a",
        letterSpacing: -0.2,
      }}>{name}</div>
    );
  }
  return (
    <div style={{
      width: w, height: h, background: "#ffffff", borderRadius: 6,
      border: "1px solid #e2e8f0",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      padding: "2px 6px", overflow: "hidden", flexShrink: 0,
    }}>
      <img
        src={`${import.meta.env.BASE_URL}logos-wide/${slug}.${ext}`}
        alt={`${name} logo`}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        onError={() => {
          if (ext === "svg") setExt("png");
          else setErr(true);
        }}
      />
    </div>
  );
}

export default function MenuProtoV2() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const timeoutRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 1024);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const enter = useCallback((id) => {
    clearTimeout(timeoutRef.current);
    setActiveDropdown(id);
  }, []);
  const leave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 180);
  }, []);

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
    padding: 24, zIndex: 1001,
  };
  const bottomCta = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 8, marginTop: 16, padding: "10px 14px",
    background: "#f8fafc", color: "#047857", fontSize: 13.5, fontWeight: 700,
    textDecoration: "none",
    borderTop: "1px solid #e2e8f0", borderLeft: "3px solid #059669",
    transition: "background 160ms",
  };

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
        <Link to={href} style={styl}
          onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = "#047857"; e.currentTarget.style.borderBottomColor = "#059669"; } }}
          onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.borderBottomColor = "transparent"; } }}
        >{content}</Link>
      );
    }
    return <button type="button" style={styl}>{content}</button>;
  };

  const NavLink = ({ to, label }) => (
    <Link to={to} style={{
      fontSize: 15, fontWeight: 500, color: "#0f172a",
      textDecoration: "none", padding: "8px 10px 5px",
      borderBottom: "3px solid transparent",
      transition: "color 160ms, border-color 160ms", whiteSpace: "nowrap",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "#047857"; e.currentTarget.style.borderBottomColor = "#059669"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.borderBottomColor = "transparent"; }}
    >{label}</Link>
  );

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

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <header style={{
        position: "sticky", top: 0, zIndex: 1000,
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
        transition: "box-shadow 0.3s",
      }}>
        <div style={{
          height: 64, maxWidth: 1200, margin: "0 auto", padding: "0 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link to="/" style={{ display: "flex", alignItems: "baseline", textDecoration: "none" }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: isMobile ? 22 : 28, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: isMobile ? 22 : 28, color: "#059669", letterSpacing: "-0.5px" }}>Brokers</span>
            <span style={{ display: "inline-block", width: isMobile ? 8 : 10, height: isMobile ? 8 : 10, borderRadius: "50%", background: "#f59e0b", marginLeft: 3, verticalAlign: "baseline" }} />
            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: isMobile ? 11 : 15, color: "#0f172a", letterSpacing: "-0.3px", marginLeft: 1 }}>com</span>
          </Link>

          {!isMobile && (
            <nav style={{ display: "flex", gap: 2, alignItems: "center" }}>

              {/* 1. Brokers ▾ */}
              <div style={{ position: "relative" }}
                onMouseEnter={() => enter("brokers")} onMouseLeave={leave}>
                <NavBtn id="brokers" label="Brokers" href="/rankings" />
                {activeDropdown === "brokers" && (
                  <div
                    style={{ ...ddBase, left: "50%", transform: "translateX(-50%)", width: 680, padding: "22px 24px" }}
                    onMouseEnter={() => enter("brokers")} onMouseLeave={leave}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: 20 }}>
                      <div>
                        <div style={secHead}>By Asset Class</div>
                        {BROKERS_BY_ASSET.map((item) => (
                          <Link key={item.path} to={item.path}
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
                          <Link key={item.path} to={item.path} className="rb-link-rail" style={{ width: "100%" }}>
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div>
                        <div style={secHead}>By Platform</div>
                        {BROKERS_BY_PLATFORM.map((item) => (
                          <Link key={item.path} to={item.path} className="rb-link-rail" style={{ width: "100%" }}>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Link to="/rankings" style={bottomCta}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <span>Browse all 293 rankings across 52 brokers</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              {/* 2. Reviews ▾ */}
              <div style={{ position: "relative" }}
                onMouseEnter={() => enter("reviews")} onMouseLeave={leave}>
                <NavBtn id="reviews" label="Reviews" href="/reviews" />
                {activeDropdown === "reviews" && (
                  <div style={{ ...ddBase, left: "50%", transform: "translateX(-50%)", width: 540 }}
                    onMouseEnter={() => enter("reviews")} onMouseLeave={leave}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <div>
                        <div style={secHead}>Top Rated</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {TOP_REVIEWS.map((b) => (
                            <Link key={b.slug} to={`/reviews/${b.slug}`}
                              style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "6px 8px",
                                borderRadius: 6, textDecoration: "none", transition: "background 0.15s",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                              <MenuLogo slug={b.slug} name={b.name} w={104} h={30} />
                              <span style={{
                                marginLeft: "auto",
                                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 12,
                                color: "#0f172a", background: "#f1f5f9",
                                padding: "2px 6px", borderRadius: 4,
                              }}>{b.score}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={secHead}>Popular</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {POPULAR_REVIEWS.map((b) => (
                            <Link key={b.slug} to={`/reviews/${b.slug}`}
                              style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "6px 8px",
                                borderRadius: 6, textDecoration: "none", transition: "background 0.15s",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                              <MenuLogo slug={b.slug} name={b.name} w={104} h={30} />
                              <span style={{
                                marginLeft: "auto", fontSize: 10.5, fontWeight: 700,
                                color: "#64748b", textTransform: "uppercase", letterSpacing: 0.4,
                              }}>{b.tag}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Link to="/reviews" style={bottomCta}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <span>Browse all 52 broker reviews</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              <NavLink to="/compare" label="Compare" />

              {/* 4. Guides ▾ */}
              <div style={{ position: "relative" }}
                onMouseEnter={() => enter("guides")} onMouseLeave={leave}>
                <NavBtn id="guides" label="Guides" href="/guides" />
                {activeDropdown === "guides" && (
                  <div style={{ ...ddBase, left: "50%", transform: "translateX(-50%)", width: 680 }}
                    onMouseEnter={() => enter("guides")} onMouseLeave={leave}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                      <div>
                        <div style={secHead}>Getting Started</div>
                        {GUIDE_GETTING_STARTED.map((i) => (
                          <Link key={i.path} to={i.path} className="rb-link-rail" style={{ width: "100%" }}>{i.label}</Link>
                        ))}
                      </div>
                      <div>
                        <div style={secHead}>Strategies</div>
                        {GUIDE_STRATEGIES.map((i) => (
                          <Link key={i.path} to={i.path} className="rb-link-rail" style={{ width: "100%" }}>{i.label}</Link>
                        ))}
                      </div>
                      <div>
                        <div style={secHead}>Concepts</div>
                        {GUIDE_CONCEPTS.map((i) => (
                          <Link key={i.path} to={i.path} className="rb-link-rail" style={{ width: "100%" }}>{i.label}</Link>
                        ))}
                      </div>
                    </div>
                    <Link to="/guides" style={bottomCta}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <span>View all guides</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              {/* 5. Countries ▾ */}
              <div style={{ position: "relative" }}
                onMouseEnter={() => enter("countries")} onMouseLeave={leave}>
                <NavBtn id="countries" label="Countries" href="/best-forex-brokers-by-country" />
                {activeDropdown === "countries" && (
                  <div style={{ ...ddBase, right: 0, width: 580 }}
                    onMouseEnter={() => enter("countries")} onMouseLeave={leave}
                  >
                    <div style={secHead}>Regulated brokers by country</div>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 4, rowGap: 2,
                    }}>
                      {COUNTRIES.map((c) => (
                        <div key={c.code} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "6px 8px", borderRadius: 6,
                        }}>
                          <CountryFlag code={c.code} size={14} />
                          <Link to={c.forex} style={{
                            fontSize: 13.5, fontWeight: 600, color: "#0f172a",
                            textDecoration: "none", flex: 1,
                          }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#047857"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#0f172a"; }}
                          >{c.name}</Link>
                          <span style={{ display: "flex", gap: 4 }}>
                            {c.cfd && (
                              <Link to={c.cfd} title={`CFD brokers ${c.name}`} style={{
                                fontSize: 10, fontWeight: 700, color: "#64748b",
                                background: "#f1f5f9", padding: "1px 5px", borderRadius: 3,
                                textDecoration: "none", letterSpacing: 0.3,
                              }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }}
                              >CFD</Link>
                            )}
                            {c.crypto && (
                              <Link to={c.crypto} title={`Crypto brokers ${c.name}`} style={{
                                fontSize: 10, fontWeight: 700, color: "#64748b",
                                background: "#f1f5f9", padding: "1px 5px", borderRadius: 3,
                                textDecoration: "none", letterSpacing: 0.3,
                              }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#f59e0b"; e.currentTarget.style.color = "#0f172a"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }}
                              >BTC</Link>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link to="/best-forex-brokers-by-country" style={bottomCta}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <span>All 38 country rankings</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              <NavLink to="/methodology" label="Methodology" />

              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
                <button aria-label="Search" style={{
                  background: "#f1f5f9", border: "none", color: "#0f172a",
                  padding: "6px 8px", borderRadius: 8, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#047857"; e.currentTarget.style.background = "#e2e8f0"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.background = "#f1f5f9"; }}
                ><SearchIcon size={16} /></button>

                <button aria-label="Language (coming soon)" disabled style={{
                  background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "not-allowed",
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 10px", borderRadius: 8,
                  fontSize: 13, fontWeight: 700, color: "#94a3b8",
                  fontFamily: "inherit", letterSpacing: 0.5, opacity: 0.7,
                }}>EN <ChevronDown size={11} /></button>

                <Link to="/find-your-broker" style={{
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                  padding: "8px 16px", borderRadius: 8,
                  fontWeight: 700, fontSize: 14,
                  textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
                  transition: "all 0.2s", whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(245,158,11,0.2)",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #d97706, #f59e0b)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(245,158,11,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #f59e0b, #fbbf24)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(245,158,11,0.2)"; }}
                >Find Your Broker <ArrowRight size={14} /></Link>
              </div>
            </nav>
          )}

          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button aria-label="Search" style={{ background: "none", border: "none", color: "#0f172a", padding: "4px 8px", cursor: "pointer" }}>
                <SearchIcon size={20} />
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                style={{ background: "none", border: "none", color: "#0f172a", padding: "4px 8px", cursor: "pointer" }}>
                {menuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          )}
        </div>

        {isMobile && menuOpen && (
          <nav style={{
            padding: "8px 16px 20px", background: "#fff",
            borderTop: "1px solid #e2e8f0", maxHeight: "80vh", overflowY: "auto",
          }}>
            <div>
              <MobToggle id="brokers" label="Brokers" />
              {mobileExpanded === "brokers" && (
                <div style={{ padding: "6px 0 10px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, margin: "8px 0 6px" }}>By Asset Class</div>
                  {BROKERS_BY_ASSET.map((i) => (
                    <Link key={i.path} to={i.path} style={{
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
                    <Link key={i.path} to={i.path} style={{ display: "block", padding: "6px 0", fontSize: 14, color: "#0f172a", textDecoration: "none" }}>{i.label}</Link>
                  ))}
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 6px" }}>By Platform</div>
                  {BROKERS_BY_PLATFORM.map((i) => (
                    <Link key={i.path} to={i.path} style={{ display: "block", padding: "6px 0", fontSize: 14, color: "#0f172a", textDecoration: "none" }}>{i.label}</Link>
                  ))}
                  <Link to="/rankings" style={{ display: "block", marginTop: 10, padding: "8px 0", fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none" }}>
                    Browse all 293 rankings <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
                  </Link>
                </div>
              )}
            </div>

            <div>
              <MobToggle id="reviews" label="Reviews" />
              {mobileExpanded === "reviews" && (
                <div style={{ padding: "6px 0 10px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, margin: "8px 0 6px" }}>Top Rated</div>
                  {TOP_REVIEWS.map((b) => (
                    <Link key={b.slug} to={`/reviews/${b.slug}`} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "8px 0", fontSize: 14, color: "#0f172a", textDecoration: "none",
                    }}>
                      <span>{b.name}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: "#059669" }}>{b.score}</span>
                    </Link>
                  ))}
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 6px" }}>Popular</div>
                  {POPULAR_REVIEWS.map((b) => (
                    <Link key={b.slug} to={`/reviews/${b.slug}`} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "8px 0", fontSize: 14, color: "#0f172a", textDecoration: "none",
                    }}>
                      <span>{b.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{b.tag}</span>
                    </Link>
                  ))}
                  <Link to="/reviews" style={{ display: "block", marginTop: 10, padding: "8px 0", fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none" }}>
                    All 52 reviews <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
                  </Link>
                </div>
              )}
            </div>

            <Link to="/compare" style={{
              display: "block", fontSize: 16, fontWeight: 500,
              color: "#0f172a", textDecoration: "none", padding: "14px 0",
              borderBottom: "1px solid #f1f5f9",
            }}>Compare</Link>

            <div>
              <MobToggle id="guides" label="Guides" />
              {mobileExpanded === "guides" && (
                <div style={{ padding: "6px 0 10px 12px" }}>
                  {[["Getting Started", GUIDE_GETTING_STARTED], ["Strategies", GUIDE_STRATEGIES], ["Concepts", GUIDE_CONCEPTS]].map(([head, arr]) => (
                    <div key={head}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, margin: "8px 0 6px" }}>{head}</div>
                      {arr.map((i) => (
                        <Link key={i.path} to={i.path} style={{ display: "block", padding: "6px 0", fontSize: 14, color: "#0f172a", textDecoration: "none" }}>{i.label}</Link>
                      ))}
                    </div>
                  ))}
                  <Link to="/guides" style={{ display: "block", marginTop: 10, padding: "8px 0", fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none" }}>
                    View all guides <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
                  </Link>
                </div>
              )}
            </div>

            <div>
              <MobToggle id="countries" label="Countries" />
              {mobileExpanded === "countries" && (
                <div style={{ padding: "6px 0 10px 12px" }}>
                  {COUNTRIES.map((c) => (
                    <div key={c.code} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
                      <CountryFlag code={c.code} size={14} />
                      <Link to={c.forex} style={{ flex: 1, fontSize: 14, color: "#0f172a", textDecoration: "none" }}>{c.name}</Link>
                      {c.cfd && <Link to={c.cfd} style={{ fontSize: 10, fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "2px 6px", borderRadius: 3, textDecoration: "none" }}>CFD</Link>}
                      {c.crypto && <Link to={c.crypto} style={{ fontSize: 10, fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "2px 6px", borderRadius: 3, textDecoration: "none" }}>BTC</Link>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/methodology" style={{
              display: "block", fontSize: 16, fontWeight: 500,
              color: "#0f172a", textDecoration: "none", padding: "14px 0",
              borderBottom: "1px solid #f1f5f9",
            }}>Methodology</Link>

            <Link to="/about" style={{
              display: "block", fontSize: 16, fontWeight: 500,
              color: "#0f172a", textDecoration: "none", padding: "14px 0",
              borderBottom: "1px solid #f1f5f9",
            }}>About Us</Link>

            <Link to="/find-your-broker" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              margin: "16px 0 8px", padding: "14px 20px", borderRadius: 12,
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
              color: "#0f172a", fontWeight: 700, fontSize: 16,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(245,158,11,0.25)",
            }}>Find Your Broker <ArrowRight size={16} /></Link>
          </nav>
        )}
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: "28px 32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0",
          marginBottom: 24,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: 1.5, marginBottom: 8 }}>MENU PROTO V2</div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 32, color: "#0f172a", margin: "0 0 12px" }}>
            Целевой концепт главного меню
          </h1>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, maxWidth: 820, margin: 0 }}>
            Наведи курсор на пункты навигации выше — все dropdown'ы живые. Все ссылки ведут на реальные страницы сайта.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          <section style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: "#0f172a", margin: "0 0 14px" }}>Что изменилось vs live</h3>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
              <li><b>«Brokers ▾»</b> заменил Forex + Crypto. Все 8 вертикалей — в одном месте.</li>
              <li><b>Top Rated</b> с настоящими wide-лого вместо монограмм.</li>
              <li><b>Reviews → /reviews</b> (live ведёт на /best-forex-brokers — баг).</li>
              <li><b>Compare + Methodology</b> возвращены на desktop.</li>
              <li><b>Countries</b> — per-vertical чипы (CFD/BTC рядом с флагом).</li>
              <li><b>Language EN</b> — явный disabled state.</li>
              <li><b>Counts</b> справа в By Asset — видна ширина каталога.</li>
            </ul>
          </section>
          <section style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: "#0f172a", margin: "0 0 14px" }}>Что сохранено 1:1</h3>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
              <li>Лого RatedBrokers.com (Outfit 800, navy/green + orange dot).</li>
              <li>D1 Rail bottom на nav-кнопках (зелёный underline 3px).</li>
              <li>Белые mega-dropdown'ы с soft shadow + 16px radius.</li>
              <li>Bottom CTA с green left-border.</li>
              <li>Orange gradient CTA «Find Your Broker».</li>
              <li>rb-link-rail класс для ссылок внутри dropdown'ов.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
