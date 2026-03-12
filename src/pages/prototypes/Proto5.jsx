/**
 * PROTO 5: "Dashboard Metrics"
 * Analytics dashboard aesthetic. Blue accent.
 * Metric cards prominent, data-driven, sidebar navigation feel.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import RegBadge from "../../components/RegBadge";
import { RANKINGS, COUNTRIES, visitUrl } from "./shared";
import CountryFlag from "../../components/CountryFlag";
import { ArrowRight, TrendingUp, Shield, Clock, Users } from "lucide-react";

export default function Proto5() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top5 = brokers.slice(0, 5);
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const blue = "#3b82f6";

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>

      {/* Hero - compact */}
      <section style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: mob ? "24px 0" : "32px 0" }}>
        <div style={{ ...cn, display: "flex", flexDirection: mob ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 32, color: "#0f172a", marginBottom: 4 }}>
              Broker Intelligence Dashboard
            </h1>
            <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>
              {brokers.length} brokers tested · Last updated March 2026
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to={lp("/best-forex-brokers")} style={{
              padding: "10px 20px", borderRadius: 8, background: blue, color: "#fff",
              fontWeight: 700, fontSize: 14, textDecoration: "none",
            }}>Full Rankings</Link>
            <Link to={lp("/compare")} style={{
              padding: "10px 20px", borderRadius: 8, border: "1px solid #e2e8f0",
              color: "#64748b", fontWeight: 600, fontSize: 14, textDecoration: "none",
            }}>Compare</Link>
          </div>
        </div>
      </section>

      {/* Metric cards */}
      <section style={{ ...cn, padding: mob ? "24px 16px" : "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
          {[
            { icon: <Users size={20} color={blue} />, val: String(brokers.length), label: "Brokers Tested", change: "+3 this quarter" },
            { icon: <TrendingUp size={20} color="#10b981" />, val: "0.02", label: "Best Avg Spread (pips)", change: "IC Markets" },
            { icon: <Shield size={20} color="#f59e0b" />, val: "6", label: "Tier-1 Regulators", change: "FCA, ASIC, CySEC..." },
            { icon: <Clock size={20} color="#8b5cf6" />, val: "Q1 2026", label: "Last Full Update", change: "Next: April 2026" },
          ].map((m, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 12, padding: "20px", border: "1px solid #e2e8f0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                {m.icon}
                <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>{m.label}</span>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 28, color: "#0f172a", marginBottom: 4 }}>{m.val}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{m.change}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main content */}
      <section style={{ ...cn, padding: mob ? "0 16px 32px" : "0 24px 48px" }}>
        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: 16 }}>

          {/* Sidebar - categories */}
          {!mob && (
            <div style={{ width: 220, flexShrink: 0 }}>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", fontWeight: 700, fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Categories
                </div>
                {RANKINGS.map((r, i) => (
                  <Link key={i} to={lp(r.path)} style={{
                    display: "block", padding: "10px 16px", fontSize: 14, fontWeight: 500,
                    color: "#475569", textDecoration: "none", borderBottom: "1px solid #f8fafc",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.color = blue; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                  >{r.title}</Link>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", marginTop: 12, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", fontWeight: 700, fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  By Country
                </div>
                {COUNTRIES.map((c, i) => (
                  <Link key={i} to={lp(c.path)} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
                    fontSize: 14, color: "#475569", textDecoration: "none", borderBottom: "1px solid #f8fafc",
                  }}>
                    <CountryFlag code={c.code} size={18} />
                    <span style={{ flex: 1 }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{c.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Main table */}
          <div style={{ flex: 1 }}>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, margin: 0 }}>Top Rated Brokers</h2>
                <Link to={lp("/best-forex-brokers")} style={{ fontSize: 13, fontWeight: 600, color: blue, textDecoration: "none" }}>
                  View All →
                </Link>
              </div>

              {/* Table header */}
              {!mob && (
                <div style={{
                  display: "grid", gridTemplateColumns: "40px 1fr 80px 80px 80px 100px 120px",
                  padding: "10px 20px", background: "#f8fafc", fontSize: 12, fontWeight: 700,
                  color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5,
                }}>
                  <span>#</span><span>Broker</span><span>Score</span><span>Spread</span><span>Min Dep</span><span>Regulation</span><span></span>
                </div>
              )}

              {top5.map((br, i) => (
                <div key={br.slug} style={{
                  display: mob ? "flex" : "grid",
                  gridTemplateColumns: mob ? undefined : "40px 1fr 80px 80px 80px 100px 120px",
                  flexDirection: mob ? "column" : undefined,
                  gap: mob ? 8 : 0,
                  padding: mob ? "16px 20px" : "14px 20px",
                  alignItems: "center",
                  borderBottom: "1px solid #f1f5f9",
                }}>
                  {!mob && <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 14, color: "#94a3b8" }}>{i + 1}</span>}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <BrokerLogo slug={br.slug} name={br.B.name} size={32} shape="wide" />
                    <div>
                      <Link to={lp(`/review/${br.slug}`)} style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", textDecoration: "none" }}>{br.B.name}</Link>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{br.B.type}</div>
                    </div>
                  </div>
                  {mob ? (
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, color: blue }}>{br.B.score}</span>
                      <span style={{ fontSize: 13 }}>{br.B.spread} pips</span>
                      <span style={{ fontSize: 13 }}>${br.B.minDep}</span>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 15, color: blue }}>{br.B.score}</span>
                      <span style={{ fontSize: 14 }}>{br.B.spread} pips</span>
                      <span style={{ fontSize: 14 }}>${br.B.minDep}</span>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{br.B.regs?.[0]?.name || ""}</span>
                    </>
                  )}
                  <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                    padding: "8px 16px", borderRadius: 6, background: blue, color: "#fff",
                    fontWeight: 700, fontSize: 13, textDecoration: "none", textAlign: "center",
                    width: mob ? "100%" : "auto",
                  }}>Visit</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
