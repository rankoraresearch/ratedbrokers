/**
 * HOME PROTOTYPE F2 — "F + Data Density"
 * More data visible: inline chips, comparison table, score breakdowns
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
import { ArrowRight, ChevronRight } from "lucide-react";
import { getVisitUrl } from "../utils/visitUrl";

const YEAR = "2026";

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

const COMPARISONS = [
  { a: "ic-markets", b: "pepperstone" },
  { a: "etoro", b: "trading-212" },
  { a: "charles-schwab", b: "fidelity" },
  { a: "ig", b: "cmc-markets" },
  { a: "tastytrade", b: "interactive-brokers" },
  { a: "ninjatrader", b: "tradestation" },
];

const SCORE_CATS = [
  { key: "regulation", label: "Regulation" },
  { key: "costs", label: "Costs" },
  { key: "platforms", label: "Platforms" },
  { key: "trust", label: "Trust" },
];

export default function HomeProtoF2() {
  const { mob, tab } = useMedia();
  const cn = { maxWidth: 1080, margin: "0 auto", padding: mob ? "0 20px" : "0 32px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top5 = allBrokers.slice(0, 5);

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Data-Driven Comparison | RatedBrokers`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = `Data-driven comparison of ${allBrokers.length} online brokers in ${YEAR}. Scores, spreads, commissions, platforms — all in one place.`;
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "WebPage",
      name: `Best Online Brokers ${YEAR} — Data-Driven Comparison`,
      description: meta.content,
      url: "https://ratedbrokers.com/",
      publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
    });
    document.head.appendChild(ld);
    return () => { document.head.removeChild(ld); };
  }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* --- COMPACT HERO + QUIZ --- */}
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
          <div style={{ flex: 1, marginBottom: mob ? 16 : 0 }}>
            <h1 style={{
              fontFamily: "'Outfit',sans-serif", fontWeight: 800,
              fontSize: mob ? 28 : tab ? 36 : 42, lineHeight: 1.08, color: "#fff",
              marginBottom: 8, letterSpacing: "-0.04em",
            }}>
              Find Your Perfect Broker
            </h1>
            <p style={{ fontSize: mob ? 14 : 15, color: "rgba(255,255,255,0.55)", maxWidth: 420, lineHeight: 1.6, marginBottom: mob ? 16 : 0 }}>
              {allBrokers.length} brokers compared across 130+ data points
            </p>
          </div>
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
            <div style={{
              display: "flex", gap: mob ? 8 : 10,
              flexDirection: mob ? "column" : "row",
            }}>
              <select style={{
                flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(30,41,59,0.8)", backdropFilter: "blur(8px)",
                color: "#e2e8f0", fontSize: 13, fontFamily: "inherit",
                appearance: "none", cursor: "pointer",
              }}>
                <option>What do you trade?</option>
                <option>Forex</option><option>CFD</option><option>Stocks & ETFs</option>
                <option>Crypto</option><option>Options</option><option>Futures</option>
                <option>Copy Trading</option><option>Spread Betting</option>
              </select>
              <select style={{
                flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(30,41,59,0.8)", backdropFilter: "blur(8px)",
                color: "#e2e8f0", fontSize: 13, fontFamily: "inherit",
                appearance: "none", cursor: "pointer",
              }}>
                <option>Experience level</option>
                <option>Beginner</option><option>Intermediate</option><option>Professional</option>
              </select>
              <Link to="/rankings" className="cta-orange" style={{
                padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", textDecoration: "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6, whiteSpace: "nowrap",
              }}>
                Show Matches <ArrowRight size={13} />
              </Link>
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

      {/* --- TOP BROKER CARDS - Data Dense --- */}
      <section style={{ padding: mob ? "48px 20px" : "80px 32px" }}>
        <div style={cn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 24 : 32, color: "#0f172a", letterSpacing: "-0.04em" }}>
              Top Rated Brokers
            </h2>
            <Link to="/reviews" style={{ fontSize: 14, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>
              All {allBrokers.length} <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {top5.map((b, i) => {
              const visitUrl = getVisitUrl(b.slug, b.B.url);
              const spread = b.B.spread || "0.0";
              const commission = b.B.commission || "$0";
              const platforms = (b.B.platforms || []).slice(0, 3);
              const minDep = b.B.minDeposit || "$0";
              return (
                <div key={b.slug} style={{
                  padding: mob ? "24px" : "28px 32px",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.12), 0 12px 32px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
                >
                  {/* Row 1: Identity + Score + CTAs */}
                  <div style={{
                    display: "flex", alignItems: mob ? "flex-start" : "center",
                    flexDirection: mob ? "column" : "row", gap: mob ? 16 : 20,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 18, color: i === 0 ? "#0f172a" : "#94a3b8", width: 28 }}>
                        {i + 1}
                      </span>
                      <div style={{
                        width: 52, height: 52, borderRadius: 14, overflow: "hidden", flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                      }}>
                        <BrokerLogo broker={b.B} size={52} variant="icon" />
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>{b.B.name}</div>
                        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>{b.B.type} · {b.B.regs.filter(r=>r.tier===1).map(r=>r.name).join(", ")}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {(b.B.verticals || []).slice(0, 4).map(v => {
                            const vm = VERTICAL_MAP[v];
                            return vm ? (
                              <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: vm.color }} />
                                {vm.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                    {/* Premium circular score badge */}
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: b.B.score >= 9.0 ? "linear-gradient(135deg, #059669, #34d399)" : "#f1f5f9",
                      color: b.B.score >= 9.0 ? "#fff" : "#334155",
                      fontFamily: "'JetBrains Mono'", fontSize: 15, fontWeight: 800,
                      boxShadow: b.B.score >= 9.0 ? "0 4px 12px rgba(5,150,105,0.25)" : "none",
                      flexShrink: 0,
                    }}>{b.B.score}</div>
                    <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                      <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                        padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                        background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", textDecoration: "none",
                      }}>Visit Broker</a>
                      <Link to={`/review/${b.slug}`} className="cta-secondary" style={{
                        padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600,
                        border: "2px solid #059669", color: "#059669", textDecoration: "none",
                      }}>Review</Link>
                    </div>
                  </div>
                  {/* Row 2: Data Chips */}
                  <div style={{
                    display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap",
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 10, background: "#f0fdf4", color: "#059669" }}>
                      Spread: {spread}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 10, background: "#eff6ff", color: "#2563eb" }}>
                      Commission: {commission}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 10, background: "#fefce8", color: "#ca8a04" }}>
                      Min: {minDep}
                    </span>
                    {platforms.map(p => (
                      <span key={p} style={{
                        fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 10,
                        background: "rgba(255,255,255,0.7)", color: "#64748b",
                        border: "1px solid rgba(255,255,255,0.8)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      }}>
                        {p}
                      </span>
                    ))}
                  </div>
                  {/* Row 3: Score Breakdown Mini-Bars */}
                  <div style={{
                    display: "flex", gap: mob ? 12 : 20, marginTop: 16,
                  }}>
                    {SCORE_CATS.map(cat => {
                      const val = b.B.scores?.[cat.key] || b.B.score;
                      return (
                        <div key={cat.key} style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{cat.label}</span>
                            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 600, color: "#64748b" }}>{val}</span>
                          </div>
                          <div style={{ height: 4, borderRadius: 2, background: "#e8ecf1" }}>
                            <div style={{ width: `${val * 10}%`, height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #059669, #34d399)" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- QUICK COMPARISON TABLE --- */}
      <section style={{ padding: mob ? "0 20px 48px" : "0 32px 80px" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 24 : 32, color: "#0f172a", marginBottom: 24, letterSpacing: "-0.04em" }}>
            Quick Comparison Table
          </h3>
          <div style={{
            overflowX: "auto", WebkitOverflowScrolling: "touch",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
            padding: mob ? "8px" : "12px",
          }}>
            <table style={{
              width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 600,
            }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e8ecf1" }}>
                  {["Broker", "Score", "Spread / Commission", "Min Deposit", "Platforms"].map(h => (
                    <th key={h} style={{
                      padding: "14px 16px", textAlign: "left", fontSize: 11,
                      fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1,
                      fontFamily: "'Inter',sans-serif",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {top5.map((b, i) => (
                  <tr key={b.slug} style={{ borderBottom: i < 4 ? "1px solid #f1f5f9" : "none" }}>
                    <td style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 10, overflow: "hidden", flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                      }}>
                        <BrokerLogo broker={b.B} size={32} variant="icon" />
                      </div>
                      <Link to={`/review/${b.slug}`} style={{ fontWeight: 600, color: "#0f172a", textDecoration: "none", letterSpacing: "-0.02em" }}>
                        {b.B.name}
                      </Link>
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "'JetBrains Mono'", fontWeight: 700, color: "#0f172a" }}>
                      {b.B.score}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#475569" }}>
                      {b.B.spread || "0.0"} / {b.B.commission || "$0"}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#475569" }}>
                      {b.B.minDeposit || "$0"}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#64748b", fontSize: 13 }}>
                      {(b.B.platforms || []).slice(0, 3).join(", ") || "Proprietary"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- CATEGORY PILLS --- */}
      <section style={{ padding: mob ? "0 20px 48px" : "0 32px 80px" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 24 : 32, color: "#0f172a", marginBottom: 24, letterSpacing: "-0.04em" }}>
            Browse by Category
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: mob ? 12 : 16 }}>
            {HUBS.map(hub => {
              const topBroker = getBrokersForRanking(hub.featuredIds?.[0] || "forex-overall")[0];
              return (
                <Link key={hub.slug} to={hub.path} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: mob ? "16px 12px" : "18px 16px", borderRadius: 14,
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  textDecoration: "none", color: "#0f172a",
                  fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.7)"; e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)"; e.currentTarget.style.transform = "none"; }}
                >
                  {topBroker && (
                    <div style={{
                      width: 24, height: 24, borderRadius: 7, overflow: "hidden", flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                    }}>
                      <BrokerLogo broker={topBroker.B} size={24} variant="icon" />
                    </div>
                  )}
                  <Icon name={hub.icon} size={16} />
                  {hub.name}
                  <span style={{ fontSize: 11, opacity: 0.5 }}>({getRankingsForHub(hub).length})</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- COMPARE PAIRS --- */}
      <section style={{ padding: mob ? "0 20px 48px" : "0 32px 80px" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 24 : 32, color: "#0f172a", marginBottom: 24, letterSpacing: "-0.04em" }}>
            Popular Comparisons
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr", gap: 16 }}>
            {COMPARISONS.map(c => {
              const a = allBrokers.find(x => x.slug === c.a);
              const b = allBrokers.find(x => x.slug === c.b);
              if (!a || !b) return null;
              return (
                <Link key={`${c.a}-${c.b}`} to={`/compare/${c.a}-vs-${c.b}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
                  padding: "18px",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  textDecoration: "none", color: "#0f172a", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.12), 0 12px 32px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                  }}>
                    <BrokerLogo broker={a.B} size={36} variant="icon" />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>VS</span>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                  }}>
                    <BrokerLogo broker={b.B} size={36} variant="icon" />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 4 }}>{a.B.name} vs {b.B.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- ALL BROKERS GRID --- */}
      <section style={{ padding: mob ? "0 20px 48px" : "0 32px 80px", background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)" }}>
        <div style={{ ...cn, paddingTop: mob ? 48 : 80 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 24 : 32, color: "#0f172a", letterSpacing: "-0.04em" }}>
              All Brokers
            </h3>
            <Link to="/reviews" style={{ fontSize: 14, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>View All</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr 1fr" : "repeat(6, 1fr)", gap: mob ? 12 : 16 }}>
            {allBrokers.slice(0, mob ? 9 : 18).map(b => (
              <Link key={b.slug} to={`/review/${b.slug}`} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: mob ? "16px 10px" : "20px 14px",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(12px)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                textDecoration: "none", color: "#0f172a",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.12), 0 12px 32px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, overflow: "hidden", marginBottom: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                }}>
                  <BrokerLogo broker={b.B} size={40} variant="icon" />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, textAlign: "center", letterSpacing: "-0.01em" }}>{b.B.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700, color: "#475569", marginTop: 4 }}>{b.B.score}</span>
              </Link>
            ))}
          </div>
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
