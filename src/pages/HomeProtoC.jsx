/**
 * HOME PROTOTYPE C — "Hybrid Power"
 *
 * Inspired by: BestBrokers (visual cards) + ForexBrokers.com (trust) + NerdWallet (editorial)
 * Concept: Visual category navigator + featured picks + editorial depth
 * Strengths: Best of both worlds — navigation + authority + SEO
 * Weaknesses: Longest page
 *
 * Sections:
 * 1. Hero — gradient, stats, clear value prop
 * 2. Category Cards — 8 visual cards with top broker per category
 * 3. Editor's Picks — 5 "Best for X" cards (NerdWallet style)
 * 4. Popular Rankings — tabbed (Category / Style / Country)
 * 5. All Brokers Grid — compact scorecard grid
 * 6. Trust & Methodology — authority block
 * 7. How to Choose — editorial (collapsed on mobile)
 * 8. Countries
 * 9. Comparisons
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
import { ArrowRight, Shield, ChevronRight, ChevronDown, Award, Star, Check } from "lucide-react";
import { getVisitUrl } from "../utils/visitUrl";

const YEAR = "2026";

const FEATURED = [
  { slug: "ic-markets", label: "Best Overall Broker", color: "#059669" },
  { slug: "charles-schwab", label: "Best for Stock Trading", color: "#0ea5e9" },
  { slug: "pepperstone", label: "Best for Beginners", color: "#8b5cf6" },
  { slug: "tastytrade", label: "Best for Options", color: "#f59e0b" },
  { slug: "ninjatrader", label: "Best for Futures", color: "#ea580c" },
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
  { title: "More", items: [
    { name: "CFD Brokers", path: "/best-cfd-brokers" },
    { name: "Copy Trading", path: "/best-copy-trading-platforms" },
    { name: "Spread Betting", path: "/best-spread-betting-brokers" },
    { name: "Futures Brokers", path: "/best-futures-brokers" },
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
  { flag: "🇬🇧", name: "UK", path: "/best-forex-brokers-uk" },
  { flag: "🇦🇺", name: "Australia", path: "/best-forex-brokers-australia" },
  { flag: "🇺🇸", name: "USA", path: "/best-forex-brokers-usa" },
  { flag: "🇩🇪", name: "Germany", path: "/best-forex-brokers-germany" },
  { flag: "🇦🇪", name: "UAE", path: "/best-forex-brokers-uae" },
  { flag: "🇸🇬", name: "Singapore", path: "/best-forex-brokers-singapore" },
  { flag: "🇮🇳", name: "India", path: "/best-forex-brokers-india" },
  { flag: "🇿🇦", name: "South Africa", path: "/best-forex-brokers-south-africa" },
];

export default function HomeProtoC() {
  const { mob, tab } = useMedia();
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const [activeTab, setActiveTab] = useState("category");
  const [editorialOpen, setEditorialOpen] = useState(!mob);

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Reviews & Rankings | RatedBrokers`;
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* ═══ HERO ═══ */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1a365d 50%, #134e4a 100%)",
        padding: mob ? "40px 16px 36px" : "60px 24px 52px",
      }}>
        <div style={{ ...cn, display: mob ? "block" : "flex", alignItems: "center", gap: 48 }}>
          <div style={{ flex: 1, marginBottom: mob ? 24 : 0 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 100,
              background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)",
              fontSize: 11, fontWeight: 700, color: "#34d399", marginBottom: 16,
              textTransform: "uppercase", letterSpacing: 1,
            }}>
              <Shield size={12} /> Updated Q1 {YEAR}
            </div>
            <h1 style={{
              fontFamily: "Outfit", fontWeight: 900,
              fontSize: mob ? 30 : tab ? 38 : 46,
              lineHeight: 1.08, color: "#fff", marginBottom: 14,
            }}>
              Best Online Brokers {YEAR}
            </h1>
            <p style={{ fontSize: mob ? 15 : 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 20, maxWidth: 500 }}>
              {allBrokers.length} brokers tested across forex, stocks, crypto, options & futures.
              130+ data points. Real money. Expert rankings.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/online-brokers" className="cta-orange" style={{
                padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
              }}>Browse All Categories <ArrowRight size={14} /></Link>
              <Link to="/rankings" style={{
                padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                textDecoration: "none",
              }}>{RANKINGS.length}+ Rankings</Link>
            </div>
          </div>
          {/* Right: Quick Stats */}
          {!mob && (
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
              width: 240, flexShrink: 0,
            }}>
              {[
                { n: allBrokers.length, l: "Brokers", c: "#34d399" },
                { n: HUBS.length, l: "Categories", c: "#60a5fa" },
                { n: RANKINGS.length + "+", l: "Rankings", c: "#fbbf24" },
                { n: "130+", l: "Data Points", c: "#a78bfa" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px",
                  textAlign: "center", border: "1px solid rgba(255,255,255,0.08)",
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 22, fontWeight: 800, color: s.c }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase" }}>{s.l}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ CATEGORY CARDS — 8 verticals with top broker ═══ */}
      <section style={{ padding: mob ? "28px 16px" : "40px 24px" }}>
        <div style={cn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, color: "#111827" }}>
              Browse by Category
            </h2>
            <Link to="/online-brokers" style={{ fontSize: 13, fontWeight: 700, color: "#059669", textDecoration: "none" }}>
              All Categories <ArrowRight size={12} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
            gap: mob ? 8 : 12,
          }}>
            {HUBS.map(hub => {
              const topBroker = getBrokersForRanking(hub.featuredIds[0] || "forex-overall")[0];
              return (
                <Link key={hub.slug} to={hub.path} style={{
                  background: "#fff", borderRadius: 12, padding: mob ? "14px 12px" : "18px 16px",
                  border: "1px solid #e2e8f0", textDecoration: "none", color: "#111827",
                  transition: "all 0.2s", display: "block",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = hub.color; e.currentTarget.style.boxShadow = `0 4px 16px ${hub.color}15`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, background: `${hub.color}10`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name={hub.icon} size={16} style={{ color: hub.color }} />
                    </div>
                    <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 14 }}>{hub.name}</div>
                  </div>
                  {topBroker && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px", background: "#f8f9fb", borderRadius: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                        <BrokerLogo broker={topBroker.B} size={24} variant="icon" />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{topBroker.B.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#059669" }}>{topBroker.B.score}</span>
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, fontWeight: 600 }}>
                    {getRankingsForHub(hub).length} rankings <ChevronRight size={10} style={{ verticalAlign: "middle" }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ EDITOR'S PICKS ═══ */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 24px 40px" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 16, color: "#111827" }}>
            <Award size={20} style={{ verticalAlign: "middle", color: "#f59e0b", marginRight: 8 }} />
            Editor's Picks {YEAR}
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
            gap: mob ? 10 : 12,
          }}>
            {FEATURED.map((f, i) => {
              const broker = allBrokers.find(b => b.slug === f.slug);
              if (!broker) return null;
              return (
                <Link key={f.slug} to={`/review/${f.slug}`} style={{
                  background: "#fff", borderRadius: 12, padding: mob ? "14px" : "18px",
                  border: `2px solid ${i === 0 ? f.color : "#e2e8f0"}`,
                  textDecoration: "none", color: "#111827", display: "block",
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; }}
                  onMouseLeave={e => { if (i !== 0) e.currentTarget.style.borderColor = "#e2e8f0"; }}
                >
                  <div style={{
                    fontSize: 10, fontWeight: 800, color: f.color,
                    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8,
                  }}>{f.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                      <BrokerLogo broker={broker.B} size={36} variant="icon" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 16 }}>{broker.B.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{broker.B.type}</div>
                    </div>
                    <div style={{
                      marginLeft: "auto", padding: "4px 8px", borderRadius: 6,
                      background: "#ecfdf5", color: "#059669",
                      fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 13,
                    }}>{broker.B.score}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ POPULAR RANKINGS — Tabbed ═══ */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 24px 40px" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 14, color: "#111827" }}>
            Popular Rankings
          </h2>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {[
              { key: "category", label: "By Category" },
              { key: "style", label: "By Style" },
              { key: "country", label: "By Country" },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                padding: "7px 16px", borderRadius: 8, border: "1px solid",
                borderColor: activeTab === t.key ? "#059669" : "#e2e8f0",
                background: activeTab === t.key ? "#ecfdf5" : "#fff",
                color: activeTab === t.key ? "#059669" : "#475569",
                fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>{t.label}</button>
            ))}
          </div>

          {activeTab === "category" && (
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: mob ? 16 : 20 }}>
              {POPULAR_BY_CATEGORY.map(cat => (
                <div key={cat.title}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{cat.title}</div>
                  {cat.items.map(item => (
                    <Link key={item.path} to={item.path} style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "8px 0",
                      borderBottom: "1px solid #f1f5f9", textDecoration: "none", color: "#111827",
                      fontSize: 13, fontWeight: 600,
                    }}>
                      {item.name} <ChevronRight size={12} style={{ marginLeft: "auto", color: "#cbd5e1" }} />
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
                  padding: "8px 16px", borderRadius: 8, background: "#fff", border: "1px solid #e2e8f0",
                  textDecoration: "none", color: "#111827", fontSize: 13, fontWeight: 600,
                }}>{item.name}</Link>
              ))}
            </div>
          )}

          {activeTab === "country" && (
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 8 }}>
              {COUNTRIES.map(c => (
                <Link key={c.name} to={c.path} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
                  background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0",
                  textDecoration: "none", color: "#111827", fontSize: 13, fontWeight: 600,
                }}>
                  <span style={{ fontSize: 18 }}>{c.flag}</span> {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ ALL BROKERS — Compact Grid ═══ */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 24px 40px" }}>
        <div style={cn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#111827" }}>
              All {allBrokers.length} Broker Reviews
            </h2>
            <Link to="/reviews" style={{ fontSize: 13, fontWeight: 700, color: "#059669", textDecoration: "none" }}>
              View All <ArrowRight size={12} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(4, 1fr)" : "repeat(6, 1fr)",
            gap: mob ? 8 : 10,
          }}>
            {allBrokers.slice(0, mob ? 8 : 18).map(b => (
              <Link key={b.slug} to={`/review/${b.slug}`} style={{
                background: "#fff", borderRadius: 10, padding: "12px",
                border: "1px solid #e2e8f0", textDecoration: "none", color: "#111827",
                textAlign: "center", transition: "border-color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", margin: "0 auto 6px" }}>
                  <BrokerLogo broker={b.B} size={36} variant="icon" />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{b.B.name}</div>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: b.B.score >= 9.0 ? "#059669" : "#2563eb",
                }}>{b.B.score}/10</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST + METHODOLOGY ═══ */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 24px 40px" }}>
        <div style={cn}>
          <div style={{
            background: "linear-gradient(135deg, #0f172a, #0f2e24)", borderRadius: 16,
            padding: mob ? "20px 16px" : "28px 24px",
            display: mob ? "block" : "flex", gap: 24, alignItems: "center",
          }}>
            <div style={{ flex: 1, marginBottom: mob ? 16 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Shield size={18} style={{ color: "#34d399" }} />
                <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 18, color: "#fff" }}>How We Rate Brokers</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                Every broker is evaluated across 130+ data points including regulation, trading costs,
                platform quality, and execution speed. We test with real money — not demos.
              </p>
            </div>
            <Link to="/methodology" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "12px 24px", borderRadius: 10,
              background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
              color: "#34d399", fontSize: 14, fontWeight: 700, textDecoration: "none",
              whiteSpace: "nowrap", flexShrink: 0,
            }}>
              Our Methodology <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ EDITORIAL — Collapsible ═══ */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 24px 40px" }}>
        <div style={{ ...cn, maxWidth: 800 }}>
          <button onClick={() => setEditorialOpen(!editorialOpen)} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",
            background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit",
          }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#111827" }}>
              How to Choose the Best Online Broker
            </h2>
            <ChevronDown size={20} style={{ color: "#94a3b8", transition: "transform 0.2s", transform: editorialOpen ? "rotate(180deg)" : "none" }} />
          </button>
          {editorialOpen && (
            <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginTop: 16 }}>
              <p style={{ marginBottom: 14 }}>
                The best online broker depends on what you trade, your experience level, and your location.
                Forex traders prioritize tight spreads and fast execution. Stock investors look for commission-free trades and research tools.
                Options traders need advanced chain analysis and multi-leg order support.
              </p>
              <p style={{ marginBottom: 14 }}>
                We evaluate every broker across six weighted categories: Regulation & Safety (25%), Trading Costs (20%),
                Trustpilot Score (15%), Expert Evaluation (20%), Platform & Tools (10%), and Execution Quality (10%).
                Weights adjust by broker type — options platforms carry 30% weight for options specialists.
              </p>
              <p>
                Our team of 26 analysts opens real accounts, deposits real money, and executes 100+ trades per broker
                before publishing a review. We update rankings quarterly to reflect changes in pricing, regulation, and platform features.
              </p>
              <Link to="/methodology" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none", marginTop: 12 }}>
                Read full methodology <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
