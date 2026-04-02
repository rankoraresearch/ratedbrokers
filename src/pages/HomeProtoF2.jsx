/**
 * HOME PROTOTYPE F2 — "F + Data Density"
 * More data visible: inline chips, comparison table, score breakdowns
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
  const cn = { maxWidth: 1120, margin: "0 auto", padding: mob ? "0 16px" : "0 28px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top5 = allBrokers.slice(0, 5);

  useEffect(() => { document.title = `Best Online Brokers ${YEAR} — Data-Driven Comparison | RatedBrokers`; }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* --- ACTION HERO + QUIZ --- */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: mob ? "40px 16px 36px" : "64px 28px 52px",
      }}>
        <div style={{ ...cn, textAlign: "center" }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 28 : tab ? 38 : 48, lineHeight: 1.08, color: "#fff",
            marginBottom: 12, letterSpacing: "-0.03em",
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
            <Link to="/rankings" style={{
              padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 700,
              background: "#f59e0b", color: "#0f172a", textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              whiteSpace: "nowrap",
            }}>
              Show Matches <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- TOP BROKER CARDS - Data Dense --- */}
      <section style={{ padding: mob ? "28px 16px" : "48px 28px" }}>
        <div style={cn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: mob ? 20 : 24, color: "#0f172a", letterSpacing: "-0.02em" }}>
              Top Rated Brokers
            </h2>
            <Link to="/reviews" style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>
              All {allBrokers.length} <ArrowRight size={12} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {top5.map((b, i) => {
              const visitUrl = getVisitUrl(b.slug, b.B.url);
              const spread = b.B.spread || "0.0";
              const commission = b.B.commission || "$0";
              const platforms = (b.B.platforms || []).slice(0, 3);
              const minDep = b.B.minDeposit || "$0";
              return (
                <div key={b.slug} style={{
                  padding: mob ? "16px" : "20px 24px",
                  background: "#fff", borderRadius: 12, border: "1px solid #e8ecf1",
                  transition: "box-shadow 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  {/* Row 1: Identity + Score + CTAs */}
                  <div style={{
                    display: "flex", alignItems: mob ? "flex-start" : "center",
                    flexDirection: mob ? "column" : "row", gap: mob ? 12 : 16,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 16, color: i === 0 ? "#0f172a" : "#94a3b8", width: 24 }}>
                        {i + 1}
                      </span>
                      <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", border: "1px solid #eef0f4", flexShrink: 0 }}>
                        <BrokerLogo broker={b.B} size={48} variant="icon" />
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>{b.B.name}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>{b.B.type} · {b.B.regs.filter(r=>r.tier===1).map(r=>r.name).join(", ")}</div>
                      </div>
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono'", fontSize: 18, fontWeight: 800,
                      color: "#0f172a", background: "#f1f5f9", padding: "6px 14px", borderRadius: 8,
                      flexShrink: 0,
                    }}>{b.B.score}</div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <a href={visitUrl} target="_blank" rel="nofollow sponsored" style={{
                        padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                        background: "#f59e0b", color: "#0f172a", textDecoration: "none",
                      }}>Visit Broker</a>
                      <Link to={`/review/${b.slug}`} style={{
                        padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                        border: "1px solid #d1d5db", color: "#475569", textDecoration: "none",
                      }}>Review</Link>
                    </div>
                  </div>
                  {/* Row 2: Data Chips */}
                  <div style={{
                    display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap",
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: "#f0fdf4", color: "#059669" }}>
                      Spread: {spread}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: "#eff6ff", color: "#2563eb" }}>
                      Commission: {commission}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: "#fefce8", color: "#ca8a04" }}>
                      Min: {minDep}
                    </span>
                    {platforms.map(p => (
                      <span key={p} style={{ fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 6, background: "#f8fafc", color: "#64748b", border: "1px solid #e8ecf1" }}>
                        {p}
                      </span>
                    ))}
                  </div>
                  {/* Row 3: Score Breakdown Mini-Bars */}
                  <div style={{
                    display: "flex", gap: mob ? 8 : 16, marginTop: 12,
                  }}>
                    {SCORE_CATS.map(cat => {
                      const val = b.B.scores?.[cat.key] || b.B.score;
                      return (
                        <div key={cat.key} style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>{cat.label}</span>
                            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 600, color: "#64748b" }}>{val}</span>
                          </div>
                          <div style={{ height: 3, borderRadius: 2, background: "#e8ecf1" }}>
                            <div style={{ width: `${val * 10}%`, height: "100%", borderRadius: 2, background: "#0f172a" }} />
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
      <section style={{ padding: mob ? "0 16px 28px" : "0 28px 48px" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Quick Comparison Table
          </h3>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{
              width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 600,
            }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e8ecf1" }}>
                  {["Broker", "Score", "Spread / Commission", "Min Deposit", "Platforms"].map(h => (
                    <th key={h} style={{
                      padding: "10px 12px", textAlign: "left", fontSize: 11,
                      fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1,
                      fontFamily: "'Inter',sans-serif",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {top5.map((b, i) => (
                  <tr key={b.slug} style={{ borderBottom: i < 4 ? "1px solid #f1f5f9" : "none" }}>
                    <td style={{ padding: "12px", display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, overflow: "hidden", border: "1px solid #eef0f4", flexShrink: 0 }}>
                        <BrokerLogo broker={b.B} size={28} variant="icon" />
                      </div>
                      <Link to={`/review/${b.slug}`} style={{ fontWeight: 600, color: "#0f172a", textDecoration: "none", letterSpacing: "-0.01em" }}>
                        {b.B.name}
                      </Link>
                    </td>
                    <td style={{ padding: "12px", fontFamily: "'JetBrains Mono'", fontWeight: 700, color: "#0f172a" }}>
                      {b.B.score}
                    </td>
                    <td style={{ padding: "12px", color: "#475569" }}>
                      {b.B.spread || "0.0"} / {b.B.commission || "$0"}
                    </td>
                    <td style={{ padding: "12px", color: "#475569" }}>
                      {b.B.minDeposit || "$0"}
                    </td>
                    <td style={{ padding: "12px", color: "#64748b", fontSize: 12 }}>
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
      <section style={{ padding: mob ? "0 16px 28px" : "0 28px 48px" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Browse by Category
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 8 }}>
            {HUBS.map(hub => (
              <Link key={hub.slug} to={hub.path} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: mob ? "12px 8px" : "14px 12px", borderRadius: 10,
                background: "#f8fafc", border: "1px solid #e8ecf1",
                textDecoration: "none", color: "#0f172a",
                fontSize: 13, fontWeight: 600, transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#0f172a"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.borderColor = "#e8ecf1"; }}
              >
                <Icon name={hub.icon} size={14} />
                {hub.name}
                <span style={{ fontSize: 11, opacity: 0.5 }}>({getRankingsForHub(hub).length})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- COMPARE PAIRS --- */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 28px 48px" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: mob ? 18 : 20, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>
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
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; }}
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
            <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 18, color: "#0f172a", letterSpacing: "-0.02em" }}>
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
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; }}
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
