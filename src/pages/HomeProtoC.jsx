/**
 * HOME PROTOTYPE C — "Hybrid Power" (Premium Fintech)
 *
 * Inspired by: Bloomberg, Wise.com, Morningstar
 * Design: Visual hierarchy, muted palette, generous whitespace, data-forward
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
  const cn = { maxWidth: 1120, margin: "0 auto", padding: mob ? "0 20px" : "0 32px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const [activeTab, setActiveTab] = useState("category");
  const [editorialOpen, setEditorialOpen] = useState(!mob);

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Reviews & Rankings | RatedBrokers`;
  }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* --- HERO --- */}
      <section style={{
        borderTop: "3px solid #f59e0b",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
        padding: mob ? "48px 20px 44px" : "72px 32px 60px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
        }} />
        <div style={{
          position: "absolute", top: "-30%", right: "-10%", width: "60%", height: "120%",
          background: "radial-gradient(ellipse, rgba(52,211,153,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ ...cn, display: mob ? "block" : "flex", alignItems: "center", gap: 56, position: "relative", zIndex: 1 }}>
          <div style={{ flex: 1, marginBottom: mob ? 28 : 0 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 100,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 11, fontWeight: 600, color: "#34d399", marginBottom: 20,
              textTransform: "uppercase", letterSpacing: 1.5,
            }}>
              <Shield size={12} /> Updated Q1 {YEAR}
            </div>
            <h1 style={{
              fontFamily: "'Outfit',sans-serif", fontWeight: 800,
              fontSize: mob ? 32 : tab ? 40 : 50,
              lineHeight: 1.05, color: "#fff", marginBottom: 16,
              letterSpacing: "-0.02em",
            }}>
              Best Online Brokers {YEAR}
            </h1>
            <p style={{
              fontSize: mob ? 15 : 17, color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7, marginBottom: 24, maxWidth: 460, fontWeight: 400,
            }}>
              {allBrokers.length} brokers tested across forex, stocks, crypto, options & futures.
              130+ data points. Real money. Expert rankings.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/online-brokers" className="cta-orange" style={{
                padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
                letterSpacing: "-0.01em",
              }}>Browse All Categories <ArrowRight size={14} /></Link>
              <Link to="/rankings" className="cta-secondary" style={{
                padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600,
                border: "2px solid #059669", color: "#059669", background: "transparent",
                textDecoration: "none", letterSpacing: "-0.01em",
              }}>{RANKINGS.length}+ Rankings</Link>
            </div>
          </div>
          {/* Right: Quick Stats */}
          {!mob && (
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
              width: 220, flexShrink: 0,
            }}>
              {[
                { n: allBrokers.length, l: "Brokers" },
                { n: HUBS.length, l: "Categories" },
                { n: RANKINGS.length + "+", l: "Rankings" },
                { n: "130+", l: "Data Points" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "14px 12px",
                  textAlign: "center", border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono'", fontSize: 22,
                    fontWeight: 700, color: "#fff", letterSpacing: "-0.02em",
                  }}>{s.n}</div>
                  <div style={{
                    fontSize: 10, color: "#34d399", fontWeight: 500,
                    textTransform: "uppercase", letterSpacing: 1.5, marginTop: 4,
                  }}>{s.l}</div>
                </div>
              ))}
            </div>
          )}
          {/* Logo Strip */}
          {mob && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, marginTop: 24, opacity: 0.35,
            }}>
              {allBrokers.slice(0, 6).map(b => (
                <div key={b.slug} style={{ width: 28, height: 28, borderRadius: 7, overflow: "hidden", background: "rgba(255,255,255,0.08)" }}>
                  <BrokerLogo broker={b.B} size={28} variant="icon" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- CATEGORY CARDS --- */}
      <section style={{ padding: mob ? "40px 20px" : "56px 32px" }}>
        <div style={cn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <p style={{
                fontSize: 11, fontWeight: 600, color: "#94a3b8",
                textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4,
              }}>Navigate</p>
              <h2 style={{
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 800, fontSize: mob ? 20 : 24, color: "#0f172a",
                letterSpacing: "-0.02em",
              }}>
                Browse by Category
              </h2>
            </div>
            <Link to="/online-brokers" style={{
              fontSize: 13, fontWeight: 600, color: "#64748b",
              textDecoration: "none",
            }}>
              All Categories <ArrowRight size={12} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
            gap: mob ? 10 : 14,
          }}>
            {HUBS.map(hub => {
              const topBroker = getBrokersForRanking(hub.featuredIds[0] || "forex-overall")[0];
              return (
                <Link key={hub.slug} to={hub.path} style={{
                  background: "#fff", borderRadius: 12, padding: mob ? "16px 14px" : "20px 18px",
                  border: "1px solid #e8ecf1", textDecoration: "none", color: "#0f172a",
                  transition: "all 0.15s", display: "block",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(5,150,105,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, background: "#f1f5f9",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name={hub.icon} size={16} style={{ color: "#64748b" }} />
                    </div>
                    <div style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em",
                    }}>{hub.name}</div>
                  </div>
                  {topBroker && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px", background: "#fafbfc", borderRadius: 8,
                      border: "1px solid #f1f5f9",
                    }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                        <BrokerLogo broker={topBroker.B} size={24} variant="icon" />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, flex: 1, letterSpacing: "-0.01em" }}>{topBroker.B.name}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: "#334155",
                        fontFamily: "'JetBrains Mono'",
                      }}>{topBroker.B.score}</span>
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 10, fontWeight: 500 }}>
                    {getRankingsForHub(hub).length} rankings <ChevronRight size={10} style={{ verticalAlign: "middle" }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- EDITOR'S PICKS --- */}
      <section style={{ padding: mob ? "40px 20px" : "56px 32px", background: "#fafbfc" }}>
        <div style={cn}>
          <div style={{ marginBottom: 20 }}>
            <p style={{
              fontSize: 11, fontWeight: 600, color: "#94a3b8",
              textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4,
            }}>Selections</p>
            <h2 style={{
              fontFamily: "'Outfit',sans-serif",
              fontWeight: 700, fontSize: mob ? 20 : 24, color: "#0f172a",
              letterSpacing: "-0.02em",
            }}>
              Editor's Picks {YEAR}
            </h2>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: mob ? 10 : 14,
          }}>
            {FEATURED.map((f, i) => {
              const broker = allBrokers.find(b => b.slug === f.slug);
              if (!broker) return null;
              return (
                <Link key={f.slug} to={`/review/${f.slug}`} style={{
                  background: "#fff", borderRadius: 12, padding: mob ? "16px" : "20px",
                  border: i === 0 ? "1px solid #0f172a" : "1px solid #e8ecf1",
                  textDecoration: "none", color: "#0f172a", display: "block",
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; }}
                  onMouseLeave={e => { if (i !== 0) e.currentTarget.style.borderColor = "#e8ecf1"; else e.currentTarget.style.borderColor = "#0f172a"; }}
                >
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: "#94a3b8",
                    textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10,
                  }}>{f.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid #eef0f4" }}>
                      <BrokerLogo broker={broker.B} size={36} variant="icon" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "'Outfit',sans-serif",
                        fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em",
                      }}>{broker.B.name}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>{broker.B.type}</div>
                    </div>
                    <div style={{
                      padding: "5px 10px", borderRadius: 6,
                      background: broker.B.score >= 9.0 ? "rgba(52,211,153,0.15)" : "#f1f5f9",
                      border: broker.B.score >= 9.0 ? "2px solid #34d399" : "none",
                      color: broker.B.score >= 9.0 ? "#34d399" : "#334155",
                      fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 13,
                    }}>{broker.B.score}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- POPULAR RANKINGS - Tabbed --- */}
      <section style={{ padding: mob ? "0 20px 40px" : "0 32px 56px" }}>
        <div style={cn}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4,
          }}>Explore</p>
          <h2 style={{
            fontFamily: "'Outfit',sans-serif",
            fontWeight: 700, fontSize: mob ? 20 : 24, marginBottom: 18, color: "#0f172a",
            letterSpacing: "-0.02em",
          }}>
            Popular Rankings
          </h2>
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {[
              { key: "category", label: "By Category" },
              { key: "style", label: "By Style" },
              { key: "country", label: "By Country" },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                padding: "8px 16px", borderRadius: 8,
                border: activeTab === t.key ? "1px solid #059669" : "1px solid #e8ecf1",
                background: activeTab === t.key ? "#059669" : "#fff",
                color: activeTab === t.key ? "#fff" : "#64748b",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                letterSpacing: "-0.01em",
                transition: "all 0.15s",
              }}>{t.label}</button>
            ))}
          </div>

          {activeTab === "category" && (
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: mob ? 20 : 28 }}>
              {POPULAR_BY_CATEGORY.map(cat => (
                <div key={cat.title}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: "#94a3b8",
                    textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10,
                  }}>{cat.title}</div>
                  {cat.items.map(item => (
                    <Link key={item.path} to={item.path} style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "10px 0",
                      borderBottom: "1px solid #f1f5f9", textDecoration: "none", color: "#0f172a",
                      fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em",
                    }}>
                      {item.name} <ChevronRight size={12} style={{ marginLeft: "auto", color: "#c0c7d0" }} />
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === "style" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {POPULAR_BY_STYLE.map(item => (
                <Link key={item.path} to={item.path} style={{
                  padding: "10px 18px", borderRadius: 8, background: "#fafbfc",
                  border: "1px solid #e8ecf1",
                  textDecoration: "none", color: "#0f172a", fontSize: 13, fontWeight: 600,
                  letterSpacing: "-0.01em",
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; }}
                >{item.name}</Link>
              ))}
            </div>
          )}

          {activeTab === "country" && (
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
              {COUNTRIES.map(c => (
                <Link key={c.name} to={c.path} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                  background: "#fafbfc", borderRadius: 8, border: "1px solid #e8ecf1",
                  textDecoration: "none", color: "#0f172a", fontSize: 13, fontWeight: 600,
                  letterSpacing: "-0.01em",
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; }}
                >
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: "#94a3b8",
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
      <section style={{ padding: mob ? "0 20px 40px" : "0 32px 56px" }}>
        <div style={cn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <p style={{
                fontSize: 11, fontWeight: 600, color: "#94a3b8",
                textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4,
              }}>Directory</p>
              <h2 style={{
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a",
                letterSpacing: "-0.02em",
              }}>
                All {allBrokers.length} Broker Reviews
              </h2>
            </div>
            <Link to="/reviews" style={{
              fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none",
            }}>
              View All <ArrowRight size={12} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(4, 1fr)" : "repeat(6, 1fr)",
            gap: mob ? 10 : 12,
          }}>
            {allBrokers.slice(0, mob ? 8 : 18).map(b => {
              const verts = (b.B.verticals || []).slice(0, 3);
              return (
                <Link key={b.slug} to={`/review/${b.slug}`} style={{
                  background: "#fafbfc", borderRadius: 10, padding: "14px",
                  border: "1px solid #e8ecf1", textDecoration: "none", color: "#0f172a",
                  textAlign: "center", transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", margin: "0 auto 8px", border: "1px solid #eef0f4" }}>
                    <BrokerLogo broker={b.B} size={36} variant="icon" />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3, letterSpacing: "-0.01em" }}>{b.B.name}</div>
                  <div style={{
                    fontSize: 11, fontWeight: 700,
                    color: "#475569",
                    fontFamily: "'JetBrains Mono'",
                    marginBottom: 6,
                  }}>{b.B.score}</div>
                  {verts.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
                      {verts.map(v => {
                        const vm = VERTICAL_MAP[v];
                        return vm ? (
                          <span key={v} style={{
                            fontSize: 9, fontWeight: 600, padding: "2px 5px", borderRadius: 4,
                            background: `${vm.color}12`, color: vm.color,
                          }}>{vm.label}</span>
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
      <section style={{ padding: mob ? "0 20px 40px" : "0 32px 56px" }}>
        <div style={cn}>
          <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)", borderRadius: 16,
            padding: mob ? "24px 20px" : "32px 28px",
            display: mob ? "block" : "flex", gap: 28, alignItems: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
            }} />
            <div style={{ flex: 1, marginBottom: mob ? 20 : 0, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Shield size={18} style={{ color: "#34d399" }} />
                <span style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700, fontSize: 18, color: "#fff",
                  letterSpacing: "-0.02em",
                }}>How We Rate Brokers</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontWeight: 400 }}>
                Every broker is evaluated across 130+ data points including regulation, trading costs,
                platform quality, and execution speed. We test with real money — not demos.
              </p>
            </div>
            <Link to="/methodology" className="cta-orange" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "12px 24px", borderRadius: 10,
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              whiteSpace: "nowrap", flexShrink: 0, letterSpacing: "-0.01em",
              transition: "all 0.15s", position: "relative", zIndex: 1,
            }}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "none"; }}
            >
              Our Methodology <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- EDITORIAL - Collapsible --- */}
      <section style={{ padding: mob ? "0 20px 40px" : "0 32px 56px" }}>
        <div style={{ ...cn, maxWidth: 720 }}>
          <button onClick={() => setEditorialOpen(!editorialOpen)} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",
            background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit",
          }}>
            <h2 style={{
              fontFamily: "'Outfit',sans-serif",
              fontWeight: 700, fontSize: mob ? 18 : 22, color: "#0f172a",
              letterSpacing: "-0.02em",
            }}>
              How to Choose the Best Online Broker
            </h2>
            <ChevronDown size={20} style={{
              color: "#94a3b8", transition: "transform 0.2s",
              transform: editorialOpen ? "rotate(180deg)" : "none",
            }} />
          </button>
          {editorialOpen && (
            <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.85, marginTop: 20, fontWeight: 400 }}>
              <p style={{ marginBottom: 16 }}>
                The best online broker depends on what you trade, your experience level, and your location.
                Forex traders prioritize tight spreads and fast execution. Stock investors look for commission-free trades and research tools.
                Options traders need advanced chain analysis and multi-leg order support.
              </p>
              <p style={{ marginBottom: 16 }}>
                We evaluate every broker across six weighted categories: Regulation & Safety (25%), Trading Costs (20%),
                Trustpilot Score (15%), Expert Evaluation (20%), Platform & Tools (10%), and Execution Quality (10%).
                Weights adjust by broker type — options platforms carry 30% weight for options specialists.
              </p>
              <p>
                Our team of 26 analysts opens real accounts, deposits real money, and executes 100+ trades per broker
                before publishing a review. We update rankings quarterly to reflect changes in pricing, regulation, and platform features.
              </p>
              <Link to="/methodology" style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 14, fontWeight: 600, color: "#475569",
                textDecoration: "none", marginTop: 14,
                borderBottom: "1px solid #c0c7d0", paddingBottom: 2,
              }}>
                Read full methodology <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
