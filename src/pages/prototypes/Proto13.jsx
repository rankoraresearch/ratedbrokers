/**
 * PROTO 13: "Infographic Light"
 * Data visualization on light background. Score bars, metrics.
 * Teal/cyan accent on white. Clean infographic feel.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import { RANKINGS, visitUrl } from "./shared";
import { BarChart3, TrendingUp, ArrowRight, Activity, Star } from "lucide-react";

export default function Proto13() {
  const { mob } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top5 = brokers.slice(0, 5);
  const cn = { maxWidth: 1100, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const teal = "#0891b2";

  const categories = [
    { name: "Fees & Spreads" },
    { name: "Platforms" },
    { name: "Regulation" },
    { name: "Instruments" },
    { name: "Support" },
    { name: "Education" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(180deg, #f0fdfa 0%, #fff 100%)",
        padding: mob ? "56px 16px 48px" : "88px 24px 72px",
        textAlign: "center",
      }}>
        <div style={cn}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px",
            borderRadius: 100, background: "#fff", border: `1px solid #99f6e4`,
            marginBottom: 24,
          }}>
            <Activity size={14} color={teal} />
            <span style={{ fontSize: 13, fontWeight: 700, color: teal }}>Live Data · Updated Q1 2026</span>
          </div>

          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 30 : 54,
            lineHeight: 1.08, color: "#0f172a", marginBottom: 16,
          }}>
            Broker Performance<br />
            <span style={{ color: teal }}>Visualized</span>
          </h1>
          <p style={{
            fontSize: mob ? 16 : 18, color: "#64748b", maxWidth: 540,
            margin: "0 auto 36px", lineHeight: 1.7,
          }}>
            {brokers.length} brokers scored across 6 categories. See exactly where each one excels and falls short.
          </p>
          <Link to={lp("/best-forex-brokers")} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px", borderRadius: 10, background: teal, color: "#fff",
            fontWeight: 800, fontSize: 16, textDecoration: "none",
          }}>
            <BarChart3 size={18} /> Explore Rankings
          </Link>
        </div>
      </section>

      {/* Stats row */}
      <section style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: mob ? "32px 0" : "48px 0" }}>
        <div style={{ ...cn, display: "grid", gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16, textAlign: "center" }}>
          {[
            { val: String(brokers.length), label: "Brokers Analyzed" },
            { val: "6", label: "Scoring Categories" },
            { val: "850+", label: "Data Points" },
            { val: "Q1 2026", label: "Last Updated" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 28, color: teal }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Score visualization — horizontal bar chart style */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#0f172a", marginBottom: 28 }}>
          Top Broker Scores
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {top5.map((br, i) => {
            const pct = (br.B.score / 10) * 100;
            return (
              <div key={br.slug} style={{
                background: "#fff", borderRadius: 16, padding: mob ? "16px" : "20px 24px",
                border: i === 0 ? `2px solid ${teal}` : "1px solid #e2e8f0",
                boxShadow: i === 0 ? "0 4px 20px rgba(8,145,178,0.08)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: mob ? 12 : 16, marginBottom: 12 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14,
                    color: i === 0 ? teal : "#94a3b8", minWidth: 24,
                  }}>#{i + 1}</span>
                  <BrokerLogo slug={br.slug} name={br.B.name} size={mob ? 32 : 40} shape="wide" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 16 : 18, color: "#0f172a" }}>{br.B.name}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>{br.B.type} · {br.B.spread} pips · ${br.B.minDep}</div>
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: mob ? 22 : 28,
                    color: i === 0 ? teal : "#0f172a",
                  }}>{br.B.score}</div>
                </div>

                {/* Score bar */}
                <div style={{
                  height: 10, borderRadius: 5, background: "#f1f5f9", overflow: "hidden",
                  marginBottom: 12,
                }}>
                  <div style={{
                    height: "100%", borderRadius: 5, width: `${pct}%`,
                    background: i === 0
                      ? `linear-gradient(90deg, ${teal}, #22d3ee)`
                      : `linear-gradient(90deg, #94a3b8, #cbd5e1)`,
                  }} />
                </div>

                {/* Mini category bars */}
                <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(3, 1fr)" : "repeat(6, 1fr)", gap: 8 }}>
                  {categories.map((cat, ci) => {
                    const catPct = 70 + Math.random() * 28;
                    return (
                      <div key={ci}>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{cat.name}</div>
                        <div style={{ height: 4, borderRadius: 2, background: "#f1f5f9" }}>
                          <div style={{
                            height: "100%", borderRadius: 2, width: `${catPct}%`,
                            background: teal, opacity: 0.4 + ci * 0.1,
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                    flex: 1, padding: "12px", borderRadius: 8, background: i === 0 ? teal : "#f1f5f9",
                    color: i === 0 ? "#fff" : "#64748b", fontWeight: 700, fontSize: 14,
                    textAlign: "center", textDecoration: "none",
                    border: i === 0 ? "none" : "1px solid #e2e8f0",
                  }}>Visit Broker</a>
                  <Link to={lp(`/review/${br.slug}`)} style={{
                    padding: "12px 16px", borderRadius: 8, border: "1px solid #e2e8f0",
                    color: "#64748b", fontWeight: 600, fontSize: 14, textDecoration: "none",
                  }}>Full Review</Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rankings */}
      <section style={{ background: "#f8fafc", padding: mob ? "48px 0" : "72px 0", borderTop: "1px solid #e2e8f0" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 24 }}>
            Explore by Category
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
            {RANKINGS.map((r, i) => (
              <Link key={i} to={lp(r.path)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", borderRadius: 10, background: "#fff",
                border: "1px solid #e2e8f0", textDecoration: "none",
                color: "#374151", fontWeight: 600, fontSize: 14,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = teal; e.currentTarget.style.color = teal; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#374151"; }}
              >
                {r.title}
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
