/**
 * Direction A: "Clean Authority" — Ranking Page
 * White bg, emerald green accent, professional authority.
 * Structured sections: hero, quick verdict, broker cards, comparison table, FAQ.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../../../hooks/useMedia";
import { useLocalePath } from "../../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../../data/brokers";
import BrokerLogo from "../../../components/BrokerLogo";
import { RANKINGS, visitUrl } from "../shared";
import {
  Shield, CheckCircle, ArrowRight, Award, ChevronDown,
  TrendingUp, Search, Clock, Star, ExternalLink,
} from "lucide-react";

const green = "#059669";
const YEAR = "2026";

export default function RankingA() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const [openFaq, setOpenFaq] = useState(null);
  const cn = { maxWidth: 1100, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const cardBg = { background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0" };

  const faqs = [
    { q: "How do you research forex brokers?", a: "We analyze 130+ data points per broker — verifying licenses on regulatory databases, collecting spread data from independent sources, aggregating user reviews, and cross-checking conditions across multiple platforms." },
    { q: "How often are rankings updated?", a: "Rankings are reviewed quarterly. We re-test top brokers and adjust scores based on any regulatory changes, fee updates, or platform improvements." },
    { q: "Do you accept payment for rankings?", a: "No. Our rankings are 100% independent. We earn through affiliate partnerships, but this never influences our scores or rankings. See our methodology for details." },
    { q: "What makes a broker \"best for beginners\"?", a: "Low minimum deposits, educational resources, a user-friendly platform, responsive customer support, and strong regulation. We weight these factors more heavily in our beginner-specific rankings." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* Breadcrumbs */}
      <div style={{ ...cn, padding: mob ? "16px 16px 0" : "20px 24px 0" }}>
        <nav style={{ display: "flex", gap: 6, fontSize: 13, color: "#94a3b8" }}>
          <Link to={lp("/")} style={{ color: "#94a3b8", textDecoration: "none" }}>RatedBrokers</Link>
          <span>/</span>
          <Link to={lp("/best-forex-brokers")} style={{ color: "#94a3b8", textDecoration: "none" }}>Forex Brokers</Link>
          <span>/</span>
          <span style={{ color: "#475569", fontWeight: 600 }}>Best Forex Brokers {YEAR}</span>
        </nav>
      </div>

      {/* Hero */}
      <header style={{ ...cn, padding: mob ? "28px 16px 36px" : "40px 24px 48px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
          borderRadius: 100, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 20,
        }}>
          <TrendingUp size={13} color={green} />
          <span style={{ fontSize: 13, fontWeight: 700, color: green }}>Updated March {YEAR}</span>
        </div>

        <h1 style={{
          fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 28 : tab ? 38 : 48,
          lineHeight: 1.08, color: "#0f172a", marginBottom: 12,
        }}>
          Best Forex Brokers {YEAR}
        </h1>
        <p style={{
          fontSize: mob ? 15 : 17, color: "#64748b", lineHeight: 1.7,
          maxWidth: 600, margin: "0 auto 8px",
        }}>
          We analyzed {brokers.length} brokers across 6 scoring categories.
          Here are the ones we actually recommend.
        </p>

        {/* Author line */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, fontSize: 13, color: "#94a3b8" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e2e8f0" }} />
          <span>By <strong style={{ color: "#475569" }}>James Chen, CFA</strong></span>
          <span>·</span>
          <span>Reviewed by Alex Thompson</span>
        </div>
      </header>

      {/* Trust stats */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            [<Search size={16} color="#64748b" />, String(brokers.length), mob ? "Tested" : "Brokers Tested"],
            [<Clock size={16} color="#64748b" />, "200+", mob ? "Hours" : "Hours Research"],
            [<Award size={16} color="#64748b" />, `Mar ${YEAR}`, mob ? "Updated" : "Last Updated"],
          ].map(([icon, val, label], i) => (
            <div key={i} style={{ ...cardBg, padding: mob ? "14px" : "18px 24px", textAlign: "center" }}>
              {icon}
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a", marginTop: 4 }}>{val}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Finding */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{
          padding: mob ? "20px" : "24px 32px", borderRadius: 16,
          background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
          border: "1px solid #a7f3d0",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <CheckCircle size={20} color={green} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, color: "#065f46", marginBottom: 6 }}>Key Finding</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#065f46", margin: 0 }}>
                {brokers[0]?.B.name} earned our #1 spot with a score of {brokers[0]?.B.score}/10, offering
                the tightest spreads from {brokers[0]?.B.spread} pips and regulation by {brokers[0]?.B.regs?.length || 3} top-tier authorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Verdict: Top 3 */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{ ...cardBg, padding: mob ? "20px" : "28px 32px" }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 16 }}>
            Quick Verdict
          </h2>
          {brokers.slice(0, 3).map((b, i) => (
            <div key={b.slug} style={{
              display: "flex", alignItems: "center", gap: mob ? 10 : 16,
              padding: mob ? "14px 0" : "16px 0",
              borderTop: i > 0 ? "1px solid #f1f5f9" : "none",
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: i === 0 ? green : "#1e3a5f",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 12, color: "#fff",
                flexShrink: 0,
              }}>#{i + 1}</span>
              {!mob && <BrokerLogo slug={b.slug} name={b.B.name} size={32} shape="wide" />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 15 : 16, color: "#0f172a" }}>{b.B.name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
                  {["Best Overall", "Runner-Up", "Best Value"][i]}
                </div>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: mob ? 16 : 20,
                color: i === 0 ? green : "#0f172a",
              }}>{b.B.score}</div>
              <a href={visitUrl(b.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: mob ? "8px 14px" : "8px 16px", borderRadius: 8, flexShrink: 0,
                background: green, color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none",
              }}>Visit <ArrowRight size={12} /></a>
            </div>
          ))}
        </div>
      </section>

      {/* Broker Cards */}
      <section style={{ ...cn, paddingBottom: mob ? 32 : 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 28, marginBottom: 20 }}>
          All {brokers.length} Brokers Ranked
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {brokers.map((b, i) => {
            const scoreColor = b.B.score >= 9.0 ? green : b.B.score >= 8.5 ? "#2563eb" : "#d97706";
            return (
              <div key={b.slug} style={{
                ...cardBg, padding: mob ? "16px" : "20px 24px",
                border: i === 0 ? `2px solid ${green}` : "1px solid #e2e8f0",
                display: "flex", alignItems: mob ? "flex-start" : "center", gap: mob ? 12 : 20,
                flexDirection: mob ? "column" : "row",
              }}>
                {/* Desktop: rank + logo + info inline */}
                <div style={{ display: "flex", alignItems: "center", gap: mob ? 10 : 16, width: mob ? "100%" : "auto" }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: i === 0 ? green : "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 13,
                    color: i === 0 ? "#fff" : "#64748b", flexShrink: 0,
                  }}>#{i + 1}</span>
                  <BrokerLogo slug={b.slug} name={b.B.name} size={mob ? 36 : 44} shape="wide" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 16 : 18, color: "#0f172a" }}>{b.B.name}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
                      {b.B.type} · {b.B.spread} pips
                    </div>
                  </div>
                  {mob && (
                    <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 22, color: scoreColor }}>{b.B.score}</div>
                  )}
                </div>

                {/* Desktop: stats */}
                {!mob && (
                  <div style={{ display: "flex", gap: 24, flex: 1, justifyContent: "center" }}>
                    {[
                      ["Spread", `${b.B.spread} pips`],
                      ["Min Dep.", b.B.minDep === 0 ? "$0" : `$${b.B.minDep}`],
                      ["Leverage", b.B.leverage || "1:500"],
                    ].map(([label, val]) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#475569", marginTop: 2 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Score + CTA */}
                <div style={{
                  display: "flex", alignItems: "center", gap: mob ? 12 : 16,
                  width: mob ? "100%" : "auto",
                }}>
                  {!mob && (
                    <div style={{
                      width: 52, height: 52, borderRadius: 12,
                      background: b.B.score >= 9.0 ? "#ecfdf5" : "#eff6ff",
                      border: `2px solid ${scoreColor}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 20, color: scoreColor,
                    }}>{b.B.score}</div>
                  )}
                  <div style={{ display: "flex", gap: 8, flex: mob ? 1 : undefined }}>
                    <a href={visitUrl(b.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                      padding: mob ? "10px 0" : "10px 20px", borderRadius: 8,
                      background: green, color: "#fff", fontWeight: 700, fontSize: 14,
                      textDecoration: "none", textAlign: "center",
                      flex: mob ? 1 : undefined,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}>Visit {b.B.name} <ExternalLink size={12} /></a>
                    <Link to={lp(`/review/${b.slug}`)} style={{
                      padding: mob ? "10px 0" : "10px 16px", borderRadius: 8,
                      border: "1px solid #e2e8f0", color: "#64748b", fontWeight: 600, fontSize: 14,
                      textDecoration: "none", textAlign: "center",
                      flex: mob ? 1 : undefined,
                    }}>Review</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      {!mob && (
        <section style={{ ...cn, paddingBottom: 48 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 26, marginBottom: 20 }}>
            Side-by-Side Comparison
          </h2>
          <div style={{ ...cardBg, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 700, borderCollapse: "collapse", fontSize: 15 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Broker", "Score", "Spread", "Min Deposit", "Leverage", "Type"].map(h => (
                      <th key={h} style={{
                        padding: "14px 16px", textAlign: "left", fontFamily: "Outfit", fontWeight: 700,
                        fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em",
                        borderBottom: "2px solid #e2e8f0",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {brokers.map((b, i) => {
                    const sc = b.B.score >= 9.0 ? green : b.B.score >= 8.5 ? "#2563eb" : "#d97706";
                    return (
                      <tr key={b.slug} style={{ borderBottom: "1px solid #f1f5f9" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "14px 16px", fontWeight: 600 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{
                              width: 22, height: 22, borderRadius: 5,
                              background: i === 0 ? green : "#1e3a5f",
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 11, color: "#fff",
                            }}>#{i + 1}</span>
                            {b.B.name}
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 16, color: sc }}>{b.B.score}</span>
                        </td>
                        <td style={{ padding: "14px 16px", color: "#475569" }}>{b.B.spread} pips</td>
                        <td style={{ padding: "14px 16px", color: "#475569" }}>{b.B.minDep === 0 ? "$0" : `$${b.B.minDep}`}</td>
                        <td style={{ padding: "14px 16px", color: "#475569" }}>{b.B.leverage || "1:500"}</td>
                        <td style={{ padding: "14px 16px", color: "#475569" }}>{b.B.type}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* How We Ranked */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{ ...cardBg, padding: mob ? "24px 20px" : "32px 36px" }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 12 }}>
            How We Ranked These Brokers
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#475569", marginBottom: 16 }}>
            Each broker was evaluated across 6 weighted categories using our proprietary methodology.
            We analyze 130+ data points from independent sources and verify every aspect of the trading experience.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12 }}>
            {[
              { cat: "Regulation & Safety", weight: "30%", desc: "Tier-1 licenses, fund protection" },
              { cat: "Trading Costs", weight: "20%", desc: "Spreads, commissions, swap rates" },
              { cat: "Platforms & Tools", weight: "15%", desc: "MT4/MT5, proprietary, mobile" },
              { cat: "Research & Education", weight: "15%", desc: "Analysis quality, learning resources" },
              { cat: "Broker Transparency", weight: "15%", desc: "Fee disclosure, corporate governance" },
              { cat: "Customer Service", weight: "5%", desc: "Response time, channels, quality" },
            ].map((c, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, padding: "14px 16px", borderRadius: 12,
                background: "#f8fafc",
              }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14, color: green, minWidth: 36 }}>{c.weight}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{c.cat}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <Link to={lp("/methodology")} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 14, fontWeight: 700, color: green, textDecoration: "none",
            }}>Read Full Methodology <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      {/* Related Rankings */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 16 }}>Related Rankings</h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
          {RANKINGS.slice(1, 6).map((r, i) => (
            <Link key={i} to={lp(r.path)} style={{
              ...cardBg, padding: "14px 16px", textDecoration: "none", color: "#1e293b",
              display: "flex", flexDirection: "column", gap: 4,
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = green}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
            >
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: green }}>View →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 16 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ ...cardBg, overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: mob ? "16px" : "18px 24px", background: "transparent", border: "none",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 15 : 16, color: "#0f172a", textAlign: "left" }}>{f.q}</span>
                <ChevronDown size={16} color="#94a3b8" style={{
                  transition: "transform 0.2s", transform: openFaq === i ? "rotate(180deg)" : "none", flexShrink: 0, marginLeft: 12,
                }} />
              </button>
              {openFaq === i && (
                <div style={{ padding: mob ? "0 16px 16px" : "0 24px 20px" }}>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Methodology CTA */}
      <section style={{ ...cn, paddingBottom: mob ? 32 : 48 }}>
        <div style={{
          padding: mob ? "32px 20px" : "40px 36px", borderRadius: 16,
          background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
          textAlign: "center",
        }}>
          <Shield size={32} color="#34d399" style={{ marginBottom: 12 }} />
          <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, color: "#fff", marginBottom: 8 }}>
            How We Test Brokers
          </h3>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", marginBottom: 24, maxWidth: 480, margin: "0 auto 24px" }}>
            Real deposits. Real trades. Real scores. No broker can pay for a better ranking.
          </p>
          <Link to={lp("/methodology")} style={{
            display: "inline-block", padding: "14px 32px", borderRadius: 10,
            background: `linear-gradient(135deg, ${green}, #34d399)`,
            color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}>Read Our Methodology</Link>
        </div>
      </section>
    </div>
  );
}
