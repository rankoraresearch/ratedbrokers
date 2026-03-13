/**
 * PROTO 1: "Clean Authority"
 * White background, emerald green accent.
 * Professional, authoritative, premium financial publication feel.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import { RANKINGS, COUNTRIES, visitUrl } from "./shared";
import CountryFlag from "../../components/CountryFlag";
import { Shield, CheckCircle, ArrowRight, Award, TrendingUp } from "lucide-react";

export default function Proto1() {
  const { mob } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top5 = brokers.slice(0, 5);
  const cn = { maxWidth: 1100, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const green = "#059669";

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Trust strip */}
      <div style={{ background: "#f0fdf4", padding: "10px 0", borderBottom: "1px solid #d1fae5" }}>
        <div style={{ ...cn, display: "flex", justifyContent: "center", gap: mob ? 16 : 32, fontSize: 13, color: "#065f46" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Shield size={13} color={green} /> Independent Research</span>
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
              borderRadius: 100, background: "#f0fdf4", border: "1px solid #bbf7d0",
              marginBottom: 20,
            }}>
              <TrendingUp size={13} color={green} />
              <span style={{ fontSize: 13, fontWeight: 700, color: green }}>Updated March 2026</span>
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
              {brokers.length} brokers independently researched and expert-scored. Transparent scoring. No pay-to-play.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to={lp("/best-forex-brokers")} style={{
                padding: "14px 32px", borderRadius: 10, background: green, color: "#fff",
                fontWeight: 800, fontSize: 16, textDecoration: "none",
              }}>View Rankings</Link>
              <Link to={lp("/methodology")} style={{
                padding: "14px 32px", borderRadius: 10, border: "1px solid #e2e8f0",
                color: "#64748b", fontWeight: 600, fontSize: 16, textDecoration: "none",
              }}>Our Methodology</Link>
            </div>
          </div>

          {/* Right side — top 3 preview */}
          {!mob && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {brokers.slice(0, 3).map((br, i) => (
                <Link key={br.slug} to={lp(`/review/${br.slug}`)} style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
                  borderRadius: 14, background: "#f8fafc", border: i === 0 ? `2px solid ${green}` : "1px solid #e2e8f0",
                  textDecoration: "none", color: "#0f172a",
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14,
                    color: i === 0 ? green : "#94a3b8", minWidth: 24,
                  }}>#{i + 1}</span>
                  <BrokerLogo slug={br.slug} name={br.B.name} size={40} shape="wide" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17 }}>{br.B.name}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>{br.B.type}</div>
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
      </section>

      {/* Metrics */}
      <section style={{ background: "#f8fafc", padding: mob ? "40px 0" : "56px 0", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ ...cn, display: "grid", gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16, textAlign: "center" }}>
          {[
            { val: String(brokers.length), label: "Brokers Tested" },
            { val: "6", label: "Scoring Categories" },
            { val: "100%", label: "Independent" },
            { val: "Quarterly", label: "Updated" },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 28, color: green }}>{m.val}</div>
              <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top brokers list */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, margin: 0 }}>Top Rated Brokers</h2>
          <Link to={lp("/best-forex-brokers")} style={{ fontSize: 14, fontWeight: 600, color: green, textDecoration: "none" }}>View All →</Link>
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
            <div style={{ flex: 1 }}>
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
              }}>Visit</a>
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
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 28 }}>Browse by Category</h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
            {RANKINGS.map((r, i) => (
              <Link key={i} to={lp(r.path)} style={{
                padding: "16px", borderRadius: 12, background: "#fff", border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#0f172a", fontWeight: 600, fontSize: 14, textAlign: "center",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = green}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >{r.title}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 28 }}>By Country</h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {COUNTRIES.map((c, i) => (
            <Link key={i} to={lp(c.path)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
              borderRadius: 10, background: "#fff", border: "1px solid #e2e8f0",
              textDecoration: "none", color: "#0f172a",
            }}>
              <CountryFlag code={c.code} size={24} />
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
              <span style={{ fontSize: 12, color: green, fontWeight: 700 }}>{c.reg}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
