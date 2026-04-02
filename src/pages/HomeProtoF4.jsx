/**
 * HOME PROTOTYPE F4 — "F + Vertical Focus"
 * 8 mini-sections per vertical, quiz hero, all brokers grid
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokersWithData } from "../data/brokers";
import HUBS from "../data/categoryHubs";
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
  const cn = { maxWidth: 1120, margin: "0 auto", padding: mob ? "0 16px" : "0 28px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);

  useEffect(() => { document.title = `Best Online Brokers ${YEAR} — Every Vertical Covered | RatedBrokers`; }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* --- QUIZ HERO --- */}
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

      {/* --- VERTICAL SECTIONS --- */}
      {HUBS.map(hub => {
        const brokers = getBrokersForRanking(hub.featuredIds?.[0] || "forex-overall").slice(0, 3);
        const pair = COMPARE_PAIRS[hub.slug];
        const pairA = pair ? allBrokers.find(x => x.slug === pair.a) : null;
        const pairB = pair ? allBrokers.find(x => x.slug === pair.b) : null;
        return (
          <section key={hub.slug} style={{
            padding: mob ? "28px 16px" : "40px 28px",
            borderLeft: `3px solid ${hub.color}`,
            margin: mob ? "0 8px" : "0 20px",
            position: "relative", overflow: "hidden",
          }}>
            {/* Watermark: top broker wide logo */}
            {brokers[0] && !mob && (
              <div style={{
                position: "absolute", top: "50%", right: 40, transform: "translateY(-50%)",
                opacity: 0.04, pointerEvents: "none", width: 200, height: 80,
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
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={hub.icon} size={16} style={{ color: hub.color }} />
                </div>
                <h2 style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a",
                  letterSpacing: "-0.02em", flex: 1,
                }}>
                  Best {hub.name} {YEAR}
                </h2>
                <Link to={hub.path} style={{
                  fontSize: 12, fontWeight: 600, color: "#64748b",
                  textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
                }}>
                  View All <ChevronRight size={12} />
                </Link>
              </div>

              {/* 3 Broker Cards */}
              <div style={{
                display: "grid",
                gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr",
                gap: 10,
                overflowX: mob ? "auto" : "visible",
                ...(mob ? { display: "flex", gap: 10, paddingBottom: 8, WebkitOverflowScrolling: "touch" } : {}),
              }}>
                {brokers.map((b, i) => {
                  const visitUrl = getVisitUrl(b.slug, b.B.url);
                  return (
                    <div key={b.slug} style={{
                      background: "#fff", borderRadius: 12, border: "1px solid #e8ecf1",
                      padding: mob ? "14px" : "16px",
                      display: "flex", alignItems: "center", gap: 12,
                      transition: "box-shadow 0.15s",
                      ...(mob ? { minWidth: 260, flexShrink: 0 } : {}),
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(5,150,105,0.12)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", border: "1px solid #eef0f4", flexShrink: 0 }}>
                        <BrokerLogo broker={b.B} size={44} variant="icon" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: "'Outfit',sans-serif", fontWeight: 800,
                          fontSize: 14, letterSpacing: "-0.01em", whiteSpace: "nowrap",
                          overflow: "hidden", textOverflow: "ellipsis",
                        }}>{b.B.name}</div>
                        <div style={{
                          fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700,
                          color: "#475569", marginBottom: 3,
                        }}>{b.B.score}</div>
                        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                          {(b.B.verticals || []).slice(0, 3).map(v => {
                            const vm = VERTICAL_MAP[v];
                            return vm ? <span key={v} style={{ fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 3, background: `${vm.color}14`, color: vm.color }}>{vm.label}</span> : null;
                          })}
                        </div>
                      </div>
                      <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{
                        padding: "8px 14px", borderRadius: 7, fontSize: 12, fontWeight: 700,
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
                  display: "inline-flex", alignItems: "center", gap: 8,
                  marginTop: 12, padding: "8px 14px", borderRadius: 8,
                  background: "#f8fafc", border: "1px solid #e8ecf1",
                  textDecoration: "none", color: "#475569", fontSize: 12, fontWeight: 600,
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: 5, overflow: "hidden", border: "1px solid #eef0f4" }}>
                    <BrokerLogo broker={pairA.B} size={20} variant="icon" />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>VS</span>
                  <div style={{ width: 20, height: 20, borderRadius: 5, overflow: "hidden", border: "1px solid #eef0f4" }}>
                    <BrokerLogo broker={pairB.B} size={20} variant="icon" />
                  </div>
                  {pairA.B.name} vs {pairB.B.name}
                  <ChevronRight size={12} style={{ color: "#c0c7d0" }} />
                </Link>
              )}
            </div>
          </section>
        );
      })}

      {/* --- ALL BROKERS GRID --- */}
      <section style={{ padding: mob ? "28px 16px" : "48px 28px", background: "#fafbfc" }}>
        <div style={{ ...cn, paddingTop: mob ? 28 : 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: "#0f172a", letterSpacing: "-0.02em" }}>
              All Brokers
            </h3>
            <Link to="/reviews" style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>View All</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr 1fr" : "repeat(6, 1fr)", gap: 8 }}>
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
    </div>
  );
}
