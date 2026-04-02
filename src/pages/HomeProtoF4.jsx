/**
 * HOME PROTOTYPE F4 — "F + Vertical Focus"
 * 8 mini-sections per vertical, quiz hero, all brokers grid
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

const COMPARE_PAIRS = {
  forex: { a: "ic-markets", b: "pepperstone" },
  cfd: { a: "ig", b: "cmc-markets" },
  "copy-trading": { a: "etoro", b: "trading-212" },
  "spread-betting": { a: "spreadex", b: "ig" },
  crypto: { a: "etoro", b: "pepperstone" },
  stocks: { a: "charles-schwab", b: "fidelity" },
  options: { a: "tastytrade", b: "interactive-brokers" },
  futures: { a: "ninjatrader", b: "tradestation" },
};

export default function HomeProtoF4() {
  const { mob, tab } = useMedia();
  const cn = { maxWidth: 1080, margin: "0 auto", padding: mob ? "0 20px" : "0 32px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Every Vertical Covered | RatedBrokers`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = `${allBrokers.length} online brokers compared across every vertical — forex, stocks, crypto, options, futures. Expert-ranked in ${YEAR}.`;
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "WebPage",
      name: `Best Online Brokers ${YEAR} — Every Vertical Covered`,
      description: meta.content,
      url: "https://ratedbrokers.com/",
      publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
    });
    document.head.appendChild(ld);
    return () => { document.head.removeChild(ld); };
  }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* --- COMPACT QUIZ HERO --- */}
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

      {/* --- VERTICAL SECTIONS --- */}
      {HUBS.map((hub, hubIdx) => {
        const brokers = getBrokersForRanking(hub.featuredIds?.[0] || "forex-overall").slice(0, 3);
        const pair = COMPARE_PAIRS[hub.slug];
        const pairA = pair ? allBrokers.find(x => x.slug === pair.a) : null;
        const pairB = pair ? allBrokers.find(x => x.slug === pair.b) : null;
        const isAlt = hubIdx % 2 === 1;
        return (
          <section key={hub.slug} style={{
            padding: mob ? "48px 20px" : "72px 32px",
            background: isAlt ? "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)" : "linear-gradient(180deg, #fff 0%, #f8fafc 100%)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Watermark: top broker wide logo */}
            {brokers[0] && !mob && (
              <div style={{
                position: "absolute", top: "50%", right: 60, transform: "translateY(-50%)",
                opacity: 0.03, pointerEvents: "none", width: 240, height: 100,
              }}>
                <img
                  src={`${import.meta.env.BASE_URL}logos-wide/${brokers[0].slug}.svg`}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              </div>
            )}
            <div style={cn}>
              {/* Section Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: isAlt ? "rgba(255,255,255,0.7)" : "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                  <Icon name={hub.icon} size={20} style={{ color: hub.color }} />
                </div>
                <h2 style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 800, fontSize: mob ? 24 : 32, color: "#0f172a",
                  letterSpacing: "-0.04em", flex: 1,
                }}>
                  Best {hub.name} {YEAR}
                </h2>
                <Link to={hub.path} style={{
                  fontSize: 13, fontWeight: 600, color: "#64748b",
                  textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
                }}>
                  View All <ChevronRight size={14} />
                </Link>
              </div>

              {/* 3 Broker Cards */}
              <div style={{
                display: "grid",
                gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr",
                gap: mob ? 16 : 20,
                overflowX: mob ? "auto" : "visible",
                ...(mob ? { display: "flex", gap: 16, paddingBottom: 8, WebkitOverflowScrolling: "touch" } : {}),
              }}>
                {brokers.map((b, i) => {
                  const visitUrl = getVisitUrl(b.slug, b.B.url);
                  return (
                    <div key={b.slug} style={{
                      background: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(12px)",
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.8)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                      padding: mob ? "20px" : "24px",
                      display: "flex", alignItems: "center", gap: 14,
                      transition: "all 0.2s",
                      ...(mob ? { minWidth: 280, flexShrink: 0 } : {}),
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.12), 0 12px 32px rgba(0,0,0,0.06)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
                    >
                      <div style={{
                        width: 48, height: 48, borderRadius: 14, overflow: "hidden", flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                      }}>
                        <BrokerLogo broker={b.B} size={48} variant="icon" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: "'Outfit',sans-serif", fontWeight: 800,
                          fontSize: 15, letterSpacing: "-0.02em", whiteSpace: "nowrap",
                          overflow: "hidden", textOverflow: "ellipsis",
                        }}>{b.B.name}</div>
                        {/* Premium circular score badge inline */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, marginBottom: 6 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: b.B.score >= 9.0 ? "linear-gradient(135deg, #059669, #34d399)" : "#f1f5f9",
                            color: b.B.score >= 9.0 ? "#fff" : "#334155",
                            fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 800,
                            boxShadow: b.B.score >= 9.0 ? "0 2px 8px rgba(5,150,105,0.25)" : "none",
                          }}>{b.B.score}</div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {(b.B.verticals || []).slice(0, 3).map(v => {
                            const vm = VERTICAL_MAP[v];
                            return vm ? (
                              <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: "#64748b" }}>
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: vm.color }} />
                                {vm.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                      <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                        padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                        background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", textDecoration: "none",
                        whiteSpace: "nowrap", flexShrink: 0,
                      }}>Visit</a>
                    </div>
                  );
                })}
              </div>

              {/* Compare pair link */}
              {pairA && pairB && (
                <Link to={`/compare/${pair.a}-vs-${pair.b}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  marginTop: 20, padding: "10px 18px", borderRadius: 12,
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  textDecoration: "none", color: "#475569", fontSize: 13, fontWeight: 600,
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.12), 0 12px 32px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: 7, overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                  }}>
                    <BrokerLogo broker={pairA.B} size={24} variant="icon" />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>VS</span>
                  <div style={{
                    width: 24, height: 24, borderRadius: 7, overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                  }}>
                    <BrokerLogo broker={pairB.B} size={24} variant="icon" />
                  </div>
                  {pairA.B.name} vs {pairB.B.name}
                  <ChevronRight size={14} style={{ color: "#c0c7d0" }} />
                </Link>
              )}
            </div>
          </section>
        );
      })}

      {/* --- ALL BROKERS GRID --- */}
      <section style={{ padding: mob ? "48px 20px" : "80px 32px", background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)" }}>
        <div style={cn}>
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
