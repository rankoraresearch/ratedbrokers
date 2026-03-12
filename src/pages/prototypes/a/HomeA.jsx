/**
 * Direction A: "Clean Authority" — Homepage (refined)
 * White background, emerald green accent.
 * Professional, authoritative, premium financial publication.
 * Enhanced version of Proto1 with more depth and polish.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../../hooks/useMedia";
import { useLocalePath } from "../../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../../data/brokers";
import BrokerLogo from "../../../components/BrokerLogo";
import CountryFlag from "../../../components/CountryFlag";
import { RANKINGS, COUNTRIES, visitUrl } from "../shared";
import {
  Shield, CheckCircle, ArrowRight, Award, TrendingUp,
  Star, Users, BookOpen, ChevronRight, ExternalLink,
} from "lucide-react";

const green = "#059669";
const YEAR = "2026";

export default function HomeA() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top5 = brokers.slice(0, 5);
  const cn = { maxWidth: 1100, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Trust strip */}
      <div style={{ background: "#f0fdf4", padding: "10px 0", borderBottom: "1px solid #d1fae5" }}>
        <div style={{ ...cn, display: "flex", justifyContent: "center", gap: mob ? 16 : 32, fontSize: 13, color: "#065f46", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Shield size={13} color={green} /> Real Money Testing</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={13} color={green} /> Independent Research</span>
          {!mob && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Award size={13} color={green} /> No Sponsored Rankings</span>}
        </div>
      </div>

      {/* Hero */}
      <section style={{ ...cn, padding: mob ? "48px 16px 40px" : "80px 24px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
              borderRadius: 100, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 20,
            }}>
              <TrendingUp size={13} color={green} />
              <span style={{ fontSize: 13, fontWeight: 700, color: green }}>Updated March {YEAR}</span>
            </div>

            <h1 style={{
              fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 34 : 52,
              lineHeight: 1.08, color: "#0f172a", marginBottom: 16,
            }}>
              Find the Best<br />Forex Broker
            </h1>
            <p style={{
              fontSize: mob ? 16 : 18, color: "#64748b", lineHeight: 1.7,
              marginBottom: 28, maxWidth: 440,
            }}>
              {brokers.length} brokers independently tested with real deposits.
              Transparent scoring. No pay-to-play.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to={lp("/best-forex-brokers")} style={{
                padding: "14px 32px", borderRadius: 10, background: green, color: "#fff",
                fontWeight: 800, fontSize: 16, textDecoration: "none",
                boxShadow: `0 4px 20px ${green}30`,
              }}>View Rankings</Link>
              <Link to={lp("/methodology")} style={{
                padding: "14px 32px", borderRadius: 10, border: "1px solid #e2e8f0",
                color: "#64748b", fontWeight: 600, fontSize: 16, textDecoration: "none",
              }}>Our Methodology</Link>
            </div>
          </div>

          {/* Right side — top 3 */}
          {!mob && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {brokers.slice(0, 3).map((br, i) => (
                <Link key={br.slug} to={lp(`/review/${br.slug}`)} style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
                  borderRadius: 14, background: "#f8fafc",
                  border: i === 0 ? `2px solid ${green}` : "1px solid #e2e8f0",
                  textDecoration: "none", color: "#0f172a", transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <span style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14,
                    color: i === 0 ? green : "#94a3b8", minWidth: 24,
                  }}>#{i + 1}</span>
                  <BrokerLogo slug={br.slug} name={br.B.name} size={40} shape="wide" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17 }}>{br.B.name}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>
                      {br.B.type} · {br.B.spread} pips
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 22,
                    color: i === 0 ? green : "#0f172a",
                  }}>{br.B.score}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mobile: horizontal top 3 */}
        {mob && (
          <div style={{ display: "flex", gap: 10, overflowX: "auto", marginTop: 32, padding: "4px 0" }}>
            {brokers.slice(0, 3).map((br, i) => (
              <Link key={br.slug} to={lp(`/review/${br.slug}`)} style={{
                minWidth: 200, padding: "16px", borderRadius: 14,
                background: "#f8fafc", border: i === 0 ? `2px solid ${green}` : "1px solid #e2e8f0",
                textDecoration: "none", color: "#0f172a", flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 12,
                    color: i === 0 ? green : "#94a3b8",
                  }}>#{i + 1}</span>
                  <BrokerLogo slug={br.slug} name={br.B.name} size={32} shape="wide" />
                </div>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{br.B.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 20, color: green }}>{br.B.score}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Metrics bar */}
      <section style={{
        background: "#f8fafc", padding: mob ? "36px 0" : "52px 0",
        borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0",
      }}>
        <div style={{ ...cn, display: "grid", gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16, textAlign: "center" }}>
          {[
            { val: String(brokers.length), label: "Brokers Tested", icon: <Users size={18} color={green} /> },
            { val: "6", label: "Scoring Categories", icon: <Star size={18} color={green} /> },
            { val: "100%", label: "Independent", icon: <Shield size={18} color={green} /> },
            { val: "Quarterly", label: "Updated", icon: <TrendingUp size={18} color={green} /> },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 28, color: "#0f172a" }}>{m.val}</div>
              <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top brokers list */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, margin: 0 }}>Top Rated Brokers</h2>
          <Link to={lp("/best-forex-brokers")} style={{ fontSize: 14, fontWeight: 600, color: green, textDecoration: "none" }}>
            View All <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
          </Link>
        </div>

        {top5.map((br, i) => (
          <div key={br.slug} style={{
            display: "flex", alignItems: "center", gap: mob ? 12 : 20,
            padding: mob ? "16px 0" : "20px 0",
            borderBottom: "1px solid #f1f5f9",
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14,
              color: i === 0 ? green : "#cbd5e1", minWidth: 28,
            }}>{String(i + 1).padStart(2, "0")}</span>
            <BrokerLogo slug={br.slug} name={br.B.name} size={mob ? 36 : 44} shape="wide" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 16 : 18 }}>{br.B.name}</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
                {br.B.type} · {br.B.spread} pips · ${br.B.minDep} min
              </div>
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: mob ? 20 : 26,
              color: i === 0 ? green : "#0f172a",
            }}>{br.B.score}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                padding: mob ? "10px 14px" : "10px 20px", borderRadius: 8, background: green,
                color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none",
                display: "flex", alignItems: "center", gap: 4,
              }}>Visit <ExternalLink size={11} /></a>
              {!mob && (
                <Link to={lp(`/review/${br.slug}`)} style={{
                  padding: "10px 16px", borderRadius: 8, border: "1px solid #e2e8f0",
                  color: "#64748b", fontWeight: 600, fontSize: 13, textDecoration: "none",
                }}>Review</Link>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section style={{ background: "#f8fafc", padding: mob ? "48px 0" : "72px 0" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 8 }}>Browse by Category</h2>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 15, marginBottom: 28 }}>
            Specialized rankings for every trading style
          </p>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
            {RANKINGS.map((r, i) => (
              <Link key={i} to={lp(r.path)} style={{
                padding: "16px", borderRadius: 12, background: "#fff", border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#0f172a", fontWeight: 600, fontSize: 14, textAlign: "center",
                transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = green; e.currentTarget.style.color = green; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#0f172a"; }}
              >{r.title}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* How we test */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: mob ? 24 : 48, alignItems: "center",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
              borderRadius: 100, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 16,
            }}>
              <Shield size={13} color={green} />
              <span style={{ fontSize: 13, fontWeight: 700, color: green }}>Our Process</span>
            </div>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 32, marginBottom: 12, lineHeight: 1.15 }}>
              How We Test Brokers
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, marginBottom: 20 }}>
              Every ranking is backed by real money testing. We deposit funds, execute 100+ trades per broker,
              and measure everything that matters to traders.
            </p>
            <Link to={lp("/methodology")} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 15, fontWeight: 700, color: green, textDecoration: "none",
            }}>Read Our Methodology <ArrowRight size={14} /></Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { title: "Open Real Accounts", desc: "We sign up, verify, and deposit — just like you would" },
              { title: "Execute Real Trades", desc: "100+ trades during peak sessions to measure true costs" },
              { title: "Score Objectively", desc: "6 weighted categories, transparent formula" },
              { title: "Update Quarterly", desc: "Re-test every 3 months to keep scores accurate" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "20px", borderRadius: 14, background: "#f8fafc", border: "1px solid #e2e8f0",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background: "#ecfdf5",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
                }}>
                  <CheckCircle size={14} color={green} />
                </div>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section style={{ background: "#f8fafc", padding: mob ? "48px 0" : "72px 0", borderTop: "1px solid #e2e8f0" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 8 }}>By Country</h2>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 15, marginBottom: 28 }}>
            Find brokers regulated in your country
          </p>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
            {COUNTRIES.map((c, i) => (
              <Link key={i} to={lp(c.path)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
                borderRadius: 10, background: "#fff", border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#0f172a", transition: "all 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = green}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <CountryFlag code={c.code} size={24} />
                <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                <span style={{ fontSize: 12, color: green, fontWeight: 700 }}>{c.reg}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest reviews */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, margin: 0 }}>Latest Reviews</h2>
          <Link to={lp("/reviews")} style={{ fontSize: 14, fontWeight: 600, color: green, textDecoration: "none" }}>
            All Reviews <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
          {brokers.slice(0, 3).map((br) => (
            <Link key={br.slug} to={lp(`/review/${br.slug}`)} style={{
              padding: "20px", borderRadius: 14, border: "1px solid #e2e8f0",
              textDecoration: "none", color: "#0f172a", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = green; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <BrokerLogo slug={br.slug} name={br.B.name} size={36} shape="wide" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16 }}>{br.B.name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{br.B.type}</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 18, color: green }}>{br.B.score}</div>
              </div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 12 }}>
                From {br.B.spread} pips · {br.B.minDep === 0 ? "No minimum deposit" : `$${br.B.minDep} min deposit`}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: green }}>Read Full Review <ChevronRight size={12} style={{ verticalAlign: "middle" }} /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
        padding: mob ? "56px 16px" : "80px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <Shield size={36} color="#34d399" style={{ marginBottom: 16 }} />
          <h2 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 26 : 36, color: "#fff", marginBottom: 12, lineHeight: 1.1 }}>
            Trade with Confidence
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 28, lineHeight: 1.7 }}>
            Every recommendation on RatedBrokers is backed by real money testing and transparent methodology.
            No broker can buy their way to the top.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={lp("/best-forex-brokers")} style={{
              padding: "14px 32px", borderRadius: 10,
              background: `linear-gradient(135deg, ${green}, #34d399)`,
              color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none",
            }}>View Rankings</Link>
            <Link to={lp("/methodology")} style={{
              padding: "14px 32px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
              fontWeight: 600, fontSize: 16, textDecoration: "none",
            }}>Our Methodology</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
