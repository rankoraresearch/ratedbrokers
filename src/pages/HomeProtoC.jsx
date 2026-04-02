/**
 * HOME PROTOTYPE C — "Hybrid Power" (Premium Fintech)
 *
 * Inspired by: Bloomberg, Wise.com, Morningstar
 * Design: Visual hierarchy, muted palette, generous whitespace, data-forward
 * Premium: Stripe-level spacing, glass morphism, gradient orbs, circular badges
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokersWithData } from "../data/brokers";
import HUBS, { getRankingsForHub } from "../data/categoryHubs";
import RANKINGS from "../data/rankings";
import { getBrokersForRanking } from "../data/rankingFilters";
import BrokerLogo from "../components/BrokerLogo";
import Icon from "../components/Icon";
import { ArrowRight, Shield, ChevronRight, ChevronDown } from "lucide-react";
import { getVisitUrl } from "../utils/visitUrl";

const YEAR = "2026";

const FEATURED = [
  { slug: "ic-markets", label: "Best for Forex" },
  { slug: "ig", label: "Best for CFD" },
  { slug: "etoro", label: "Best for Copy Trading" },
  { slug: "spreadex", label: "Best for Spread Betting" },
  { slug: "pepperstone", label: "Best for Beginners" },
  { slug: "charles-schwab", label: "Best for Stocks" },
  { slug: "tastytrade", label: "Best for Options" },
  { slug: "ninjatrader", label: "Best for Futures" },
];

const POPULAR_BY_CATEGORY = [
  { title: "Forex", items: [
    { name: "Best Forex Brokers", path: "/best-forex-brokers" },
    { name: "Forex for Beginners", path: "/best-forex-brokers-for-beginners" },
    { name: "Lowest Spread", path: "/lowest-spread-forex-brokers" },
    { name: "ECN Brokers", path: "/best-ecn-forex-brokers" },
  ]},
  { title: "Stocks", items: [
    { name: "Best Stock Brokers", path: "/best-stock-brokers" },
    { name: "Commission-Free", path: "/best-commission-free-stock-brokers" },
    { name: "Fractional Shares", path: "/best-fractional-shares-brokers" },
  ]},
  { title: "Options", items: [
    { name: "Best Options Brokers", path: "/best-options-brokers" },
    { name: "Zero-Fee Options", path: "/best-zero-fee-options-brokers" },
  ]},
  { title: "Crypto", items: [
    { name: "Best Crypto Brokers", path: "/best-crypto-brokers" },
    { name: "Bitcoin Brokers", path: "/best-bitcoin-brokers" },
  ]},
  { title: "CFD", items: [
    { name: "Best CFD Brokers", path: "/best-cfd-brokers" },
    { name: "CFD for Beginners", path: "/best-cfd-brokers-for-beginners" },
    { name: "Low Spread CFD", path: "/lowest-spread-cfd-brokers" },
  ]},
  { title: "Copy Trading", items: [
    { name: "Copy Trading Platforms", path: "/best-copy-trading-platforms" },
    { name: "Social Trading", path: "/best-social-trading-platforms" },
    { name: "Copy Trading Apps", path: "/best-copy-trading-apps" },
  ]},
  { title: "Spread Betting", items: [
    { name: "Spread Betting Platforms", path: "/best-spread-betting-brokers" },
    { name: "Spread Betting for Beginners", path: "/best-spread-betting-brokers-for-beginners" },
    { name: "Spread Betting Apps", path: "/best-spread-betting-apps" },
  ]},
  { title: "Futures", items: [
    { name: "Best Futures Brokers", path: "/best-futures-brokers" },
    { name: "Micro Futures", path: "/best-micro-futures-brokers" },
    { name: "Futures for Beginners", path: "/best-futures-brokers-for-beginners" },
  ]},
];

const POPULAR_BY_STYLE = [
  { name: "Beginners", path: "/best-forex-brokers-for-beginners" },
  { name: "Scalping", path: "/best-forex-brokers-for-scalping" },
  { name: "Day Trading", path: "/best-forex-brokers-for-day-trading" },
  { name: "Copy Trading", path: "/best-copy-trading-platforms" },
  { name: "Trading Apps", path: "/best-forex-trading-apps" },
  { name: "Low Deposit", path: "/no-minimum-deposit-forex-brokers" },
  { name: "Islamic Accounts", path: "/best-islamic-forex-brokers" },
  { name: "High Leverage", path: "/best-high-leverage-forex-brokers" },
];

const COUNTRIES = [
  { code: "GB", name: "UK", path: "/best-forex-brokers-uk" },
  { code: "AU", name: "Australia", path: "/best-forex-brokers-australia" },
  { code: "US", name: "USA", path: "/best-forex-brokers-usa" },
  { code: "DE", name: "Germany", path: "/best-forex-brokers-germany" },
  { code: "AE", name: "UAE", path: "/best-forex-brokers-uae" },
  { code: "SG", name: "Singapore", path: "/best-forex-brokers-singapore" },
  { code: "IN", name: "India", path: "/best-forex-brokers-india" },
  { code: "ZA", name: "South Africa", path: "/best-forex-brokers-south-africa" },
];

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

export default function HomeProtoC() {
  const { mob, tab } = useMedia();
  const cn = { maxWidth: 1080, margin: "0 auto", padding: mob ? "0 20px" : "0 32px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const [activeTab, setActiveTab] = useState("category");
  const [editorialOpen, setEditorialOpen] = useState(!mob);

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Reviews & Rankings | RatedBrokers`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = `Compare ${allBrokers.length} online brokers in ${YEAR}. Expert reviews, rankings across forex, stocks, crypto, options & futures. 130+ data points per broker.`;
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "WebPage",
      name: `Best Online Brokers ${YEAR} — Reviews & Rankings`,
      description: meta.content,
      url: "https://ratedbrokers.com/",
      publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
    });
    document.head.appendChild(ld);
    return () => { document.head.removeChild(ld); };
  }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* --- COMPACT HERO --- */}
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
        <div style={{ ...cn, display: mob ? "block" : "flex", alignItems: "center", gap: 32, position: "relative", zIndex: 1 }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 12px", borderRadius: 100,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 10, fontWeight: 600, color: "#34d399", marginBottom: 12,
              textTransform: "uppercase", letterSpacing: 1.5,
            }}>
              <Shield size={11} /> Updated Q1 {YEAR}
            </div>
            <h1 style={{
              fontFamily: "'Outfit',sans-serif", fontWeight: 800,
              fontSize: mob ? 28 : tab ? 36 : 42,
              lineHeight: 1.08, color: "#fff", marginBottom: 8,
              letterSpacing: "-0.04em",
            }}>
              Best Online Brokers {YEAR}
            </h1>
            <p style={{
              fontSize: mob ? 14 : 15, color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6, maxWidth: 420, fontWeight: 400, marginBottom: mob ? 16 : 0,
            }}>
              {allBrokers.length} brokers tested across forex, stocks, crypto, options & futures.
              130+ data points. Real money. Expert rankings.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: mob ? "flex-start" : "flex-end", gap: 12, flexShrink: 0 }}>
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
            <div style={{ display: "flex", gap: 10 }}>
              <Link to="/online-brokers" className="cta-orange" style={{
                padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
              }}>Browse All <ArrowRight size={13} /></Link>
              <Link to="/rankings" className="cta-secondary" style={{
                padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                border: "2px solid #059669", color: "#059669", background: "transparent",
                textDecoration: "none",
              }}>{RANKINGS.length}+ Rankings</Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- PILL NAV BAR --- */}
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
              <Icon name={hub.icon} size={13} />
              {hub.name}
              <span style={{ fontSize: 10, opacity: 0.5 }}>{getRankingsForHub(hub).length}</span>
            </Link>
          ))}
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)", margin: "0 4px", flexShrink: 0 }} />
          {[
            { name: "Beginners", path: "/best-forex-brokers-for-beginners" },
            { name: "Low Spread", path: "/lowest-spread-forex-brokers" },
            { name: "ECN", path: "/best-ecn-forex-brokers" },
            { name: "Trading Apps", path: "/best-forex-trading-apps" },
          ].map(r => (
            <Link key={r.path} to={r.path} style={{
              padding: "7px 12px", borderRadius: 8,
              background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 500,
              textDecoration: "none", whiteSpace: "nowrap",
            }}>{r.name}</Link>
          ))}
        </div>
      </div>

      {/* --- CATEGORY CARDS --- */}
      <section style={{ padding: mob ? "56px 20px" : "88px 32px", background: "linear-gradient(180deg, #fff 0%, #f8fafc 100%)" }}>
        <div style={cn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div>
              <p style={{
                fontSize: 11, fontWeight: 600, color: "#94a3b8",
                textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
              }}>Navigate</p>
              <h2 style={{
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 800, fontSize: mob ? 24 : 32, color: "#0f172a",
                letterSpacing: "-0.04em",
              }}>
                Browse by Category
              </h2>
            </div>
            <Link to="/online-brokers" style={{
              fontSize: 14, fontWeight: 600, color: "#64748b",
              textDecoration: "none",
            }}>
              All Categories <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
            gap: mob ? 16 : 20,
          }}>
            {HUBS.map(hub => {
              const topBroker = getBrokersForRanking(hub.featuredIds[0] || "forex-overall")[0];
              return (
                <Link key={hub.slug} to={hub.path} style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 16,
                  padding: mob ? "20px 18px" : "28px 24px",
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  textDecoration: "none", color: "#0f172a",
                  transition: "all 0.2s", display: "block",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.12), 0 12px 32px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, background: "#f1f5f9",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name={hub.icon} size={20} style={{ color: "#64748b" }} />
                    </div>
                    <div style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em",
                    }}>{hub.name}</div>
                  </div>
                  {topBroker && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px", background: "rgba(248,250,252,0.8)", borderRadius: 12,
                      border: "1px solid #f1f5f9",
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, overflow: "hidden", flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                      }}>
                        <BrokerLogo broker={topBroker.B} size={36} variant="icon" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", display: "block" }}>{topBroker.B.name}</span>
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          {(topBroker.B.verticals || []).slice(0, 2).map(v => {
                            const vm = VERTICAL_MAP[v];
                            return vm ? (
                              <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, color: "#64748b" }}>
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: vm.color }} />
                                {vm.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                      {/* Premium circular score badge */}
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: topBroker.B.score >= 9.0 ? "linear-gradient(135deg, #059669, #34d399)" : "#f1f5f9",
                        color: topBroker.B.score >= 9.0 ? "#fff" : "#334155",
                        fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 800,
                        boxShadow: topBroker.B.score >= 9.0 ? "0 4px 12px rgba(5,150,105,0.25)" : "none",
                      }}>{topBroker.B.score}</div>
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 12, fontWeight: 500 }}>
                    {getRankingsForHub(hub).length} rankings <ChevronRight size={11} style={{ verticalAlign: "middle" }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- EDITOR'S PICKS --- */}
      <section style={{ padding: mob ? "56px 20px" : "88px 32px", background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)" }}>
        <div style={cn}>
          <div style={{ marginBottom: 28 }}>
            <p style={{
              fontSize: 11, fontWeight: 600, color: "#94a3b8",
              textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
            }}>Selections</p>
            <h2 style={{
              fontFamily: "'Outfit',sans-serif",
              fontWeight: 700, fontSize: mob ? 24 : 32, color: "#0f172a",
              letterSpacing: "-0.04em",
            }}>
              Editor's Picks {YEAR}
            </h2>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: mob ? 16 : 20,
          }}>
            {FEATURED.map((f, i) => {
              const broker = allBrokers.find(b => b.slug === f.slug);
              if (!broker) return null;
              return (
                <Link key={f.slug} to={`/review/${f.slug}`} style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 16, padding: mob ? "20px" : "28px",
                  border: i === 0 ? "1px solid #0f172a" : "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  textDecoration: "none", color: "#0f172a", display: "block",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.12), 0 12px 32px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
                >
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: "#94a3b8",
                    textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14,
                  }}>{f.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, overflow: "hidden", flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                    }}>
                      <BrokerLogo broker={broker.B} size={44} variant="icon" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "'Outfit',sans-serif",
                        fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em",
                      }}>{broker.B.name}</div>
                      <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>{broker.B.type}</div>
                    </div>
                    {/* Premium circular score badge */}
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: broker.B.score >= 9.0 ? "linear-gradient(135deg, #059669, #34d399)" : "#f1f5f9",
                      color: broker.B.score >= 9.0 ? "#fff" : "#334155",
                      fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 800,
                      boxShadow: broker.B.score >= 9.0 ? "0 4px 12px rgba(5,150,105,0.25)" : "none",
                    }}>{broker.B.score}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- POPULAR RANKINGS - Tabbed --- */}
      <section style={{ padding: mob ? "0 20px 56px" : "0 32px 88px" }}>
        <div style={cn}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
          }}>Explore</p>
          <h2 style={{
            fontFamily: "'Outfit',sans-serif",
            fontWeight: 700, fontSize: mob ? 24 : 32, marginBottom: 24, color: "#0f172a",
            letterSpacing: "-0.04em",
          }}>
            Popular Rankings
          </h2>
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {[
              { key: "category", label: "By Category" },
              { key: "style", label: "By Style" },
              { key: "country", label: "By Country" },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                padding: "10px 20px", borderRadius: 10,
                border: activeTab === t.key ? "1px solid #059669" : "1px solid rgba(255,255,255,0.8)",
                background: activeTab === t.key ? "#059669" : "rgba(255,255,255,0.7)",
                backdropFilter: activeTab !== t.key ? "blur(12px)" : "none",
                boxShadow: activeTab !== t.key ? "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)" : "none",
                color: activeTab === t.key ? "#fff" : "#64748b",
                fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                letterSpacing: "-0.01em",
                transition: "all 0.2s",
              }}>{t.label}</button>
            ))}
          </div>

          {activeTab === "category" && (
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: mob ? 24 : 32 }}>
              {POPULAR_BY_CATEGORY.map(cat => (
                <div key={cat.title}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: "#94a3b8",
                    textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14,
                  }}>{cat.title}</div>
                  {cat.items.map(item => (
                    <Link key={item.path} to={item.path} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "12px 0",
                      borderBottom: "1px solid #f1f5f9", textDecoration: "none", color: "#0f172a",
                      fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em",
                    }}>
                      {item.name} <ChevronRight size={14} style={{ marginLeft: "auto", color: "#c0c7d0" }} />
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === "style" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {POPULAR_BY_STYLE.map(item => (
                <Link key={item.path} to={item.path} style={{
                  padding: "12px 22px", borderRadius: 12,
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  textDecoration: "none", color: "#0f172a", fontSize: 14, fontWeight: 600,
                  letterSpacing: "-0.01em",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.12), 0 12px 32px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
                >{item.name}</Link>
              ))}
            </div>
          )}

          {activeTab === "country" && (
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14 }}>
              {COUNTRIES.map(c => (
                <Link key={c.name} to={c.path} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "16px 18px",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  textDecoration: "none", color: "#0f172a", fontSize: 14, fontWeight: 600,
                  letterSpacing: "-0.01em",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.12), 0 12px 32px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
                >
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: "#94a3b8",
                    fontFamily: "'JetBrains Mono'",
                  }}>{c.code}</span>
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- ALL BROKERS - Compact Grid --- */}
      <section style={{ padding: mob ? "0 20px 56px" : "0 32px 88px" }}>
        <div style={cn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <p style={{
                fontSize: 11, fontWeight: 600, color: "#94a3b8",
                textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
              }}>Directory</p>
              <h2 style={{
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 800, fontSize: mob ? 24 : 32, color: "#0f172a",
                letterSpacing: "-0.04em",
              }}>
                All {allBrokers.length} Broker Reviews
              </h2>
            </div>
            <Link to="/reviews" style={{
              fontSize: 14, fontWeight: 600, color: "#64748b", textDecoration: "none",
            }}>
              View All <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(4, 1fr)" : "repeat(6, 1fr)",
            gap: mob ? 14 : 16,
          }}>
            {allBrokers.slice(0, mob ? 8 : 18).map(b => {
              const verts = (b.B.verticals || []).slice(0, 3);
              return (
                <Link key={b.slug} to={`/review/${b.slug}`} style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 14, padding: mob ? "16px" : "20px",
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  textDecoration: "none", color: "#0f172a",
                  textAlign: "center", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.12), 0 12px 32px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, overflow: "hidden", margin: "0 auto 10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                  }}>
                    <BrokerLogo broker={b.B} size={44} variant="icon" />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, letterSpacing: "-0.01em" }}>{b.B.name}</div>
                  <div style={{
                    fontSize: 12, fontWeight: 700,
                    color: "#475569",
                    fontFamily: "'JetBrains Mono'",
                    marginBottom: 8,
                  }}>{b.B.score}</div>
                  {verts.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                      {verts.map(v => {
                        const vm = VERTICAL_MAP[v];
                        return vm ? (
                          <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, color: "#64748b" }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: vm.color }} />
                            {vm.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- TRUST + METHODOLOGY --- */}
      <section style={{ padding: mob ? "0 20px 56px" : "0 32px 88px" }}>
        <div style={cn}>
          <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)", borderRadius: 20,
            padding: mob ? "32px 24px" : "44px 40px",
            display: mob ? "block" : "flex", gap: 36, alignItems: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
            }} />
            {/* Gradient orb */}
            <div style={{ position: "absolute", top: "10%", right: "20%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ flex: 1, marginBottom: mob ? 24 : 0, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Shield size={20} style={{ color: "#34d399" }} />
                <span style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700, fontSize: 22, color: "#fff",
                  letterSpacing: "-0.03em",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}>How We Rate Brokers</span>
              </div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontWeight: 400 }}>
                Every broker is evaluated across 130+ data points including regulation, trading costs,
                platform quality, and execution speed. We test with real money — not demos.
              </p>
            </div>
            <Link to="/methodology" className="cta-orange" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 12,
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              whiteSpace: "nowrap", flexShrink: 0, letterSpacing: "-0.01em",
              transition: "all 0.15s", position: "relative", zIndex: 1,
            }}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "none"; }}
            >
              Our Methodology <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- EDITORIAL - Collapsible --- */}
      <section style={{ padding: mob ? "0 20px 56px" : "0 32px 88px" }}>
        <div style={{ ...cn, maxWidth: 720 }}>
          <button onClick={() => setEditorialOpen(!editorialOpen)} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",
            background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit",
          }}>
            <h2 style={{
              fontFamily: "'Outfit',sans-serif",
              fontWeight: 700, fontSize: mob ? 24 : 32, color: "#0f172a",
              letterSpacing: "-0.04em",
            }}>
              How to Choose the Best Online Broker
            </h2>
            <ChevronDown size={22} style={{
              color: "#94a3b8", transition: "transform 0.2s",
              transform: editorialOpen ? "rotate(180deg)" : "none",
            }} />
          </button>
          {editorialOpen && (
            <div style={{ fontSize: 16, color: "#475569", lineHeight: 1.85, marginTop: 24, fontWeight: 400 }}>
              <p style={{ marginBottom: 20 }}>
                The best online broker depends on what you trade, your experience level, and your location.
                Forex traders prioritize tight spreads and fast execution. Stock investors look for commission-free trades and research tools.
                Options traders need advanced chain analysis and multi-leg order support.
              </p>
              <p style={{ marginBottom: 20 }}>
                We evaluate every broker across six weighted categories: Regulation & Safety (25%), Trading Costs (20%),
                Trustpilot Score (15%), Expert Evaluation (20%), Platform & Tools (10%), and Execution Quality (10%).
                Weights adjust by broker type — options platforms carry 30% weight for options specialists.
              </p>
              <p>
                Our team of 26 analysts opens real accounts, deposits real money, and executes 100+ trades per broker
                before publishing a review. We update rankings quarterly to reflect changes in pricing, regulation, and platform features.
              </p>
              <Link to="/methodology" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 15, fontWeight: 600, color: "#475569",
                textDecoration: "none", marginTop: 18,
                borderBottom: "1px solid #c0c7d0", paddingBottom: 2,
              }}>
                Read full methodology <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* --- RISK DISCLAIMER + AFFILIATE DISCLOSURE --- */}
      <section style={{ padding: mob ? "0 20px 48px" : "0 32px 64px" }}>
        <div style={{ ...cn, maxWidth: 800 }}>
          <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8, textAlign: "center" }}>
            <strong>Affiliate Disclosure:</strong> RatedBrokers may receive compensation from brokers featured on this site.
            This does not influence our rankings or reviews, which are based on independent research.
          </p>
          <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8, textAlign: "center", marginTop: 12 }}>
            <strong>Risk Warning:</strong> CFDs are complex instruments and come with a high risk of losing money rapidly
            due to leverage. Between 74-89% of retail investor accounts lose money when trading CFDs.
            You should consider whether you understand how CFDs work and whether you can afford to take
            the high risk of losing your money.
          </p>
        </div>
      </section>
    </div>
  );
}
