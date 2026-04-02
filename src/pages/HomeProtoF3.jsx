/**
 * HOME PROTOTYPE F3 — "F + Social Proof"
 * Trustpilot badges, rank badges, trust stats, social proof emphasis
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
import { ArrowRight, ChevronRight, Shield, Star } from "lucide-react";
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

const RANK_BADGES = [
  { label: "Most Popular", bg: "linear-gradient(135deg, #fef3c7, #fde68a)", color: "#92400e" },
  { label: "Editor's Choice", bg: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#6d28d9" },
  { label: "Best Value", bg: "linear-gradient(135deg, #dcfce7, #bbf7d0)", color: "#166534" },
];

const COMPARISONS = [
  { a: "ic-markets", b: "pepperstone" },
  { a: "etoro", b: "trading-212" },
  { a: "charles-schwab", b: "fidelity" },
  { a: "ig", b: "cmc-markets" },
  { a: "tastytrade", b: "interactive-brokers" },
  { a: "ninjatrader", b: "tradestation" },
];

export default function HomeProtoF3() {
  const { mob, tab } = useMedia();
  const cn = { maxWidth: 1080, margin: "0 auto", padding: mob ? "0 20px" : "0 32px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Trusted Reviews | RatedBrokers`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = `Trusted reviews of ${allBrokers.length} online brokers in ${YEAR}. Verified Trustpilot ratings, expert scores, real-money testing.`;
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "WebPage",
      name: `Best Online Brokers ${YEAR} — Trusted Reviews`,
      description: meta.content,
      url: "https://ratedbrokers.com/",
      publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
    });
    document.head.appendChild(ld);
    return () => { document.head.removeChild(ld); };
  }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* --- COMPACT HERO with Social Proof --- */}
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
            <p style={{ fontSize: mob ? 14 : 15, color: "rgba(255,255,255,0.55)", maxWidth: 420, lineHeight: 1.6, marginBottom: 10 }}>
              {allBrokers.length} brokers compared across 130+ data points
            </p>
            {/* Trusted by traders — inline */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 14px", borderRadius: 100,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={11} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
                Trusted by traders worldwide
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0, marginTop: mob ? 16 : 0 }}>
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

      {/* ═══ BROKER SHOWCASE ═══ */}
      <section style={{ padding: mob ? "32px 16px" : "48px 28px" }}>
        <div style={cn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Top Rated Brokers
            </h2>
            <Link to="/reviews" style={{ fontSize: 13, fontWeight: 600, color: "#059669", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              All {allBrokers.length} reviews <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: mob ? 12 : 16,
          }}>
            {allBrokers.slice(0, mob ? 3 : 6).map((b, i) => {
              const visitUrl = getVisitUrl(b.slug, b.B.url);
              return (
                <div key={b.slug} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: mob ? "16px" : "20px",
                  background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                  borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(5,150,105,0.12)"; e.currentTarget.style.borderColor = "#059669"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", flexShrink: 0, border: "1px solid rgba(0,0,0,0.04)" }}>
                    <BrokerLogo broker={b.B} size={56} variant="icon" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>{b.B.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{b.B.type}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      {(b.B.verticals || []).slice(0, 3).map(v => {
                        const vm = VERTICAL_MAP[v];
                        return vm ? <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, color: "#64748b" }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: vm.color }} />{vm.label}
                        </span> : null;
                      })}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: b.B.score >= 9.0 ? "linear-gradient(135deg, #059669, #34d399)" : "#f1f5f9",
                      color: b.B.score >= 9.0 ? "#fff" : "#334155",
                      fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 800,
                      boxShadow: b.B.score >= 9.0 ? "0 4px 12px rgba(5,150,105,0.25)" : "none",
                    }}>{b.B.score}</div>
                    <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                      padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                      background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                      textDecoration: "none",
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
        background: "#0f172a", padding: mob ? "24px 16px" : "28px 28px",
        borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ ...cn, display: "flex", justifyContent: "center", gap: mob ? 24 : 56, flexWrap: "wrap" }}>
          {[
            { n: "130+", l: "Data Points Per Broker" },
            { n: "100%", l: "Independent Rankings" },
            { n: "Real $", l: "Money Testing" },
            { n: "Q1 2026", l: "Last Updated" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 18 : 22, fontWeight: 700, color: "#34d399", letterSpacing: "-0.02em" }}>{s.n}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- TOP BROKER CARDS with Rank Badges + TP --- */}
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
            {allBrokers.slice(0, 5).map((b, i) => {
              const visitUrl = getVisitUrl(b.slug, b.B.url);
              const badge = i < 3 ? RANK_BADGES[i] : null;
              return (
                <div key={b.slug} style={{
                  display: "flex", alignItems: mob ? "flex-start" : "center",
                  flexDirection: mob ? "column" : "row",
                  gap: mob ? 16 : 20, position: "relative",
                  padding: mob ? "24px" : "24px 28px",
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
                  {/* Rank badge */}
                  {badge && (
                    <div style={{
                      position: "absolute", top: -10, right: 20,
                      padding: "4px 12px", borderRadius: 8,
                      background: badge.bg, color: badge.color,
                      fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}>
                      #{i + 1} {badge.label}
                    </div>
                  )}
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
                      {/* Trustpilot dots */}
                      {b.B.tp && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <div style={{ display: "flex", gap: 3 }}>
                            {[1,2,3,4,5].map(s => {
                              const tpScore = parseFloat(b.B.tp) || 0;
                              const filled = s <= Math.round(tpScore);
                              return <div key={s} style={{
                                width: 10, height: 10, borderRadius: "50%",
                                background: filled ? "#00b67a" : "#e2e8f0",
                              }} />;
                            })}
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#00b67a" }}>{b.B.tp}</span>
                        </div>
                      )}
                      {/* Vertical badges - dot + text */}
                      <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                        {(b.B.verticals || []).slice(0, 3).map(v => {
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
                  {/* CTAs */}
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
              );
            })}
          </div>
        </div>
      </section>

      {/* --- WHY TRADERS TRUST US --- */}
      <section style={{ padding: mob ? "0 20px 56px" : "0 32px 88px", background: "linear-gradient(180deg, #fff 0%, #f8fafc 100%)" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 24 : 32, color: "#0f172a", marginBottom: 28, letterSpacing: "-0.04em" }}>
            Why Traders Trust Us
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 20 }}>
            {[
              { value: `${allBrokers.length}`, label: "Brokers Tested", desc: "Real accounts opened. Real money deposited. Real trades executed." },
              { value: "130+", label: "Data Points per Broker", desc: "Regulation, costs, platforms, execution, trust scores, and more." },
              { value: "26", label: "Expert Analysts", desc: "CFA, CMT credentialed team with 200+ combined years of experience." },
            ].map((item, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(12px)",
                borderRadius: 16, padding: mob ? "28px" : "36px",
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono'", fontSize: mob ? 36 : 48,
                  fontWeight: 800, color: "#0f172a", letterSpacing: "-0.04em",
                  marginBottom: 8,
                }}>{item.value}</div>
                <div style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 8,
                  letterSpacing: "-0.02em",
                }}>{item.label}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORY PILLS --- */}
      <section style={{ padding: mob ? "0 20px 48px" : "0 32px 80px" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 24 : 32, color: "#0f172a", marginBottom: 24, letterSpacing: "-0.04em" }}>
            Browse by Category
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: mob ? 12 : 16,
          }}>
            {HUBS.map(hub => {
              const rankCount = getRankingsForHub(hub).length;
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
                  position: "relative",
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
                  <span style={{ fontSize: 11, opacity: 0.5 }}>({rankCount})</span>
                  {rankCount > 50 && (
                    <span style={{
                      position: "absolute", top: -8, right: 10,
                      fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                      background: "linear-gradient(135deg, #fef3c7, #fde68a)", color: "#92400e",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}>Popular</span>
                  )}
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
                  width: "100%", height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#0f172a", borderRadius: 10, padding: "8px 16px", marginBottom: 8,
                  overflow: "hidden",
                }}>
                  <img
                    src={`${import.meta.env.BASE_URL}logos-wide-dark/${b.slug}.svg`}
                    alt={b.B.name}
                    style={{ maxWidth: "80%", maxHeight: "70%", objectFit: "contain" }}
                    onError={e => { e.target.style.display = "none"; e.target.parentElement.innerHTML = `<span style="color:#fff;font-weight:700;font-size:13px">${b.B.name}</span>`; }}
                  />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700, color: "#475569", marginTop: 4 }}>{b.B.score}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EDITORIAL ═══ */}
      <section style={{ padding: mob ? "48px 16px" : "80px 28px", background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)" }}>
        <div style={{ ...cn, maxWidth: 760 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 20 }}>
            How to Choose the Best Online Broker
          </h2>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            <p style={{ marginBottom: 14 }}>
              The right online broker depends on what you trade. Forex traders need tight spreads and fast execution from brokers like IC Markets or Pepperstone. Stock investors look for commission-free trading and fractional shares from platforms like Charles Schwab or Fidelity. Options traders prioritize advanced chain analysis from specialists like tastytrade, while futures traders need low margins and DOM tools from NinjaTrader or TradeStation.
            </p>
            <p style={{ marginBottom: 14 }}>
              We evaluate every broker across six weighted categories: Regulation & Safety (25%), Trading Costs (20%), Trustpilot Score (15%), Expert Evaluation (20%), Platform & Tools (10%), and Execution Quality (10%). Our team opens real accounts, deposits real money, and executes 100+ trades per broker before publishing a single rating.
            </p>
            <p style={{ marginBottom: 14 }}>
              With {allBrokers.length} brokers across {HUBS.length} categories — forex, CFD, stocks, crypto, options, futures, copy trading, and spread betting — finding the right platform requires comparing dozens of factors. Our {RANKINGS.length}+ expert rankings cut through marketing noise to show you which brokers actually deliver on their promises, verified with real-money testing and updated quarterly.
            </p>
            <Link to="/methodology" style={{ fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
              Read our full methodology <ArrowRight size={14} />
            </Link>
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
