/**
 * HOME PROTOTYPE F3 — "F + Social Proof"
 * Trustpilot badges, rank badges, trust stats, social proof emphasis
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

const RANK_BADGES = [
  { label: "Most Popular", bg: "#fef3c7", color: "#92400e" },
  { label: "Editor's Choice", bg: "#ede9fe", color: "#6d28d9" },
  { label: "Best Value", bg: "#dcfce7", color: "#166534" },
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
  const cn = { maxWidth: 1120, margin: "0 auto", padding: mob ? "0 16px" : "0 28px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);

  useEffect(() => { document.title = `Best Online Brokers ${YEAR} — Trusted Reviews | RatedBrokers`; }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* --- HERO with Social Proof --- */}
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
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 16, maxWidth: 440, margin: "0 auto 16px" }}>
            {allBrokers.length} brokers compared across 130+ data points
          </p>
          {/* Trusted by traders */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "8px 20px", borderRadius: 100,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            marginBottom: 28,
          }}>
            <div style={{ display: "flex", gap: 2 }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={12} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
              Trusted by traders worldwide
            </span>
          </div>
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
        </div>
      </section>

      {/* --- TOP BROKER CARDS with Rank Badges + TP --- */}
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
              const badge = i < 3 ? RANK_BADGES[i] : null;
              return (
                <div key={b.slug} style={{
                  display: "flex", alignItems: mob ? "flex-start" : "center",
                  flexDirection: mob ? "column" : "row",
                  gap: mob ? 12 : 16, position: "relative",
                  padding: mob ? "16px" : "16px 20px",
                  background: "#fff", borderRadius: 12, border: "1px solid #e8ecf1",
                  transition: "box-shadow 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(5,150,105,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  {/* Rank badge */}
                  {badge && (
                    <div style={{
                      position: "absolute", top: -8, right: 16,
                      padding: "3px 10px", borderRadius: 6,
                      background: badge.bg, color: badge.color,
                      fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
                    }}>
                      #{i + 1} {badge.label}
                    </div>
                  )}
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
                      {/* Trustpilot badge */}
                      {b.B.tp && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                          background: "#00b67a", color: "#fff",
                        }}>
                          TP {b.B.tp}
                        </span>
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
                    <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{
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

      {/* --- WHY TRADERS TRUST US --- */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 28px 48px" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Why Traders Trust Us
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
            {[
              { value: `${allBrokers.length}`, label: "Brokers Tested", desc: "Real accounts opened. Real money deposited. Real trades executed." },
              { value: "130+", label: "Data Points per Broker", desc: "Regulation, costs, platforms, execution, trust scores, and more." },
              { value: "26", label: "Expert Analysts", desc: "CFA, CMT credentialed team with 200+ combined years of experience." },
            ].map((item, i) => (
              <div key={i} style={{
                background: "#fafbfc", borderRadius: 12, padding: mob ? "20px" : "24px",
                border: "1px solid #e8ecf1", textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono'", fontSize: mob ? 32 : 40,
                  fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em",
                  marginBottom: 4,
                }}>{item.value}</div>
                <div style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 6,
                  letterSpacing: "-0.01em",
                }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
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
              const rankCount = getRankingsForHub(hub).length;
              return (
                <Link key={hub.slug} to={hub.path} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: mob ? "12px 8px" : "14px 12px", borderRadius: 10,
                  background: "#f8fafc", border: "1px solid #e8ecf1",
                  textDecoration: "none", color: "#0f172a",
                  fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                  position: "relative",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#059669"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.borderColor = "#e8ecf1"; }}
                >
                  <Icon name={hub.icon} size={14} />
                  {hub.name}
                  <span style={{ fontSize: 11, opacity: 0.5 }}>({rankCount})</span>
                  {rankCount > 50 && (
                    <span style={{
                      position: "absolute", top: -6, right: 8,
                      fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                      background: "#fef3c7", color: "#92400e",
                    }}>Popular</span>
                  )}
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
