/**
 * HOME PROTOTYPE F — "Conversion Machine" (Bankrate / Credit Karma)
 * Quiz hero, aggressive CTAs, maximum broker density, sticky compare
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
import { ArrowRight, ChevronRight, Search } from "lucide-react";
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

export default function HomeProtoF() {
  const { mob, tab } = useMedia();
  const cn = { maxWidth: 1120, margin: "0 auto", padding: mob ? "0 16px" : "0 28px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Compare & Choose | RatedBrokers`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = `Compare ${allBrokers.length} online brokers in ${YEAR}. Find your perfect broker across forex, stocks, crypto, options & futures. 130+ data points.`;
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "WebPage",
      name: `Best Online Brokers ${YEAR} — Compare & Choose`,
      description: meta.content,
      url: "https://ratedbrokers.com/",
      publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
    });
    document.head.appendChild(ld);
    return () => { document.head.removeChild(ld); };
  }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* --- ACTION HERO + QUIZ --- */}
      <section style={{
        borderTop: "3px solid #f59e0b",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
        padding: mob ? "40px 16px 36px" : "64px 28px 52px",
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
        <div style={{ ...cn, textAlign: "center", position: "relative", zIndex: 1 }}>
          <h1 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 28 : tab ? 38 : 48, lineHeight: 1.08, color: "#fff",
            marginBottom: 12, letterSpacing: "-0.02em",
          }}>
            Find Your Perfect Broker
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 28, maxWidth: 440, margin: "0 auto 28px" }}>
            {allBrokers.length} brokers compared across 130+ data points
          </p>
          {/* Quick Match Dropdowns */}
          <div style={{
            display: "flex", gap: mob ? 8 : 12, justifyContent: "center",
            flexDirection: mob ? "column" : "row", maxWidth: 600, margin: "0 auto",
          }}>
            <select style={{
              flex: 1, padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
              background: "#1e293b", color: "#e2e8f0", fontSize: 14, fontFamily: "inherit",
              appearance: "none", cursor: "pointer",
            }}>
              <option>What do you trade?</option>
              <option>Forex</option>
              <option>CFD</option>
              <option>Stocks & ETFs</option>
              <option>Crypto</option>
              <option>Options</option>
              <option>Futures</option>
              <option>Copy Trading</option>
              <option>Spread Betting</option>
            </select>
            <select style={{
              flex: 1, padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
              background: "#1e293b", color: "#e2e8f0", fontSize: 14, fontFamily: "inherit",
              appearance: "none", cursor: "pointer",
            }}>
              <option>Experience level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Professional</option>
            </select>
            <Link to="/rankings" className="cta-orange" style={{
              padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 700,
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              whiteSpace: "nowrap",
            }}>
              Show Matches <ArrowRight size={14} />
            </Link>
          </div>
          {/* Logo Strip */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: mob ? 8 : 12, marginTop: 28, flexWrap: "wrap",
          }}>
            {allBrokers.slice(0, mob ? 8 : 12).map(b => (
              <div key={b.slug} style={{ width: 30, height: 30, borderRadius: 8, overflow: "hidden", opacity: 0.5, border: "1px solid rgba(255,255,255,0.1)" }}>
                <BrokerLogo broker={b.B} size={30} variant="icon" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- QUICK PICK ROW --- */}
      <section style={{ padding: mob ? "28px 16px 0" : "48px 28px 0" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: 14, letterSpacing: "-0.02em" }}>
            Quick Picks
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: 10,
          }}>
            {[
              { label: "Best for Forex", slug: "ic-markets" },
              { label: "Best for Stocks", slug: "charles-schwab" },
              { label: "Best for Options", slug: "tastytrade" },
              { label: "Best for Futures", slug: "ninjatrader" },
            ].map(pick => {
              const broker = allBrokers.find(b => b.slug === pick.slug);
              if (!broker) return null;
              const visitUrl = getVisitUrl(broker.slug, broker.B.url);
              return (
                <div key={pick.slug} style={{
                  background: "#fff", borderRadius: 12, padding: mob ? "14px" : "16px",
                  border: "1px solid #e8ecf1", textAlign: "center",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>
                    {pick.label}
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", margin: "0 auto 8px", border: "1px solid #eef0f4" }}>
                    <BrokerLogo broker={broker.B} size={44} variant="icon" />
                  </div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{broker.B.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 8 }}>{broker.B.score}</div>
                  <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                    padding: "8px 16px", borderRadius: 7, fontSize: 11, fontWeight: 700,
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                    textDecoration: "none", display: "inline-block",
                  }}>Visit</a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- TOP BROKER CARDS - Aggressive CTAs --- */}
      <section style={{ padding: mob ? "28px 16px" : "48px 28px" }}>
        <div style={cn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 20 : 24, color: "#0f172a", letterSpacing: "-0.02em" }}>
              Top Rated Brokers
            </h2>
            <Link to="/reviews" style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>
              All {allBrokers.length} <ArrowRight size={12} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {allBrokers.slice(0, 5).map((b, i) => {
              const visitUrl = getVisitUrl(b.slug, b.B.url);
              const verts = (b.B.verticals || []).slice(0, 4);
              return (
                <div key={b.slug} style={{
                  display: "flex", alignItems: mob ? "flex-start" : "center",
                  flexDirection: mob ? "column" : "row",
                  gap: mob ? 12 : 16,
                  padding: mob ? "16px" : "16px 20px",
                  background: "#fff", borderRadius: 12, border: "1px solid #e8ecf1",
                  transition: "box-shadow 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(5,150,105,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 16, color: i === 0 ? "#0f172a" : "#94a3b8", width: 24 }}>
                      {i + 1}
                    </span>
                    <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", border: "1px solid #eef0f4", flexShrink: 0 }}>
                      <BrokerLogo broker={b.B} size={48} variant="icon" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em" }}>{b.B.name}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{b.B.type} · {b.B.regs.filter(r=>r.tier===1).map(r=>r.name).join(", ")}</div>
                      {verts.length > 0 && (
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {verts.map(v => {
                            const vm = VERTICAL_MAP[v];
                            return vm ? (
                              <span key={v} style={{
                                fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                                background: `${vm.color}14`, color: vm.color,
                              }}>{vm.label}</span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Score */}
                  <div style={{
                    fontFamily: "'JetBrains Mono'", fontSize: 18, fontWeight: 800,
                    color: b.B.score >= 9.0 ? "#34d399" : "#0f172a",
                    background: b.B.score >= 9.0 ? "rgba(52,211,153,0.15)" : "#f1f5f9",
                    border: b.B.score >= 9.0 ? "2px solid #34d399" : "none",
                    padding: "6px 14px", borderRadius: 8,
                    flexShrink: 0,
                  }}>{b.B.score}</div>
                  {/* CTAs */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                      padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                      background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", textDecoration: "none",
                    }}>Visit Broker</a>
                    <Link to={`/review/${b.slug}`} className="cta-secondary" style={{
                      padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                      border: "2px solid #059669", color: "#059669", textDecoration: "none",
                    }}>Review</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CATEGORY PILLS --- */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 28px 48px" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Browse by Category
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: 8,
          }}>
            {HUBS.map(hub => {
              const topBroker = getBrokersForRanking(hub.featuredIds[0] || "forex-overall")[0];
              const rankCount = getRankingsForHub(hub).length;
              return (
                <Link key={hub.slug} to={hub.path} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: mob ? "12px 8px" : "14px 12px", borderRadius: 10,
                  background: "#f8fafc", border: "1px solid #e8ecf1",
                  textDecoration: "none", color: "#0f172a",
                  fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#059669"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.borderColor = "#e8ecf1"; }}
                >
                  {topBroker && (
                    <div style={{ width: 20, height: 20, borderRadius: 5, overflow: "hidden", border: "1px solid #eef0f4", flexShrink: 0 }}>
                      <BrokerLogo broker={topBroker.B} size={20} variant="icon" />
                    </div>
                  )}
                  <Icon name={hub.icon} size={14} />
                  {hub.name}
                  <span style={{ fontSize: 11, opacity: 0.5 }}>({rankCount})</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- COMPARE PAIRS --- */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 28px 48px" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 18 : 20, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Popular Comparisons
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr", gap: 10 }}>
            {COMPARISONS.map(c => {
              const a = allBrokers.find(x => x.slug === c.a);
              const b = allBrokers.find(x => x.slug === c.b);
              if (!a || !b) return null;
              return (
                <Link key={`${c.a}-${c.b}`} to={`/compare/${c.a}-vs-${c.b}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "14px", background: "#fafbfc", borderRadius: 10, border: "1px solid #e8ecf1",
                  textDecoration: "none", color: "#0f172a", transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", border: "1px solid #eef0f4" }}>
                    <BrokerLogo broker={a.B} size={32} variant="icon" />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>VS</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", border: "1px solid #eef0f4" }}>
                    <BrokerLogo broker={b.B} size={32} variant="icon" />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 4 }}>{a.B.name} vs {b.B.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- ALL BROKERS GRID --- */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 28px 48px", background: "#fafbfc" }}>
        <div style={{ ...cn, paddingTop: mob ? 28 : 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: "#0f172a", letterSpacing: "-0.02em" }}>
              All Brokers
            </h3>
            <Link to="/reviews" style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>View All</Link>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr 1fr" : "repeat(6, 1fr)",
            gap: 8,
          }}>
            {allBrokers.slice(0, mob ? 9 : 18).map(b => (
              <Link key={b.slug} to={`/review/${b.slug}`} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "12px 8px", background: "#fff", borderRadius: 8,
                border: "1px solid #e8ecf1", textDecoration: "none", color: "#0f172a",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", marginBottom: 6, border: "1px solid #eef0f4" }}>
                  <BrokerLogo broker={b.B} size={36} variant="icon" />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, textAlign: "center" }}>{b.B.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700, color: "#475569", marginTop: 2 }}>{b.B.score}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- RISK DISCLAIMER + AFFILIATE DISCLOSURE --- */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 28px 48px" }}>
        <div style={{ ...cn, maxWidth: 800 }}>
          <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7, textAlign: "center" }}>
            <strong>Affiliate Disclosure:</strong> RatedBrokers may receive compensation from brokers featured on this site.
            This does not influence our rankings or reviews, which are based on independent research.
          </p>
          <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7, textAlign: "center", marginTop: 8 }}>
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
