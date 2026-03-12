/**
 * PROTO 3: "Gradient Fintech" (SaaS Startup)
 * Bold purple-to-blue gradient hero, floating cards.
 * Modern, premium, energetic. Think Stripe/Linear aesthetic.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import RegBadge from "../../components/RegBadge";
import { RANKINGS, visitUrl } from "./shared";
import { ArrowRight, Star, Shield, Zap } from "lucide-react";

export default function Proto3() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top3 = brokers.slice(0, 3);
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const accent = "#8b5cf6";

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fafafa", minHeight: "100vh" }}>

      {/* Hero with gradient */}
      <section style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #6366f1 100%)",
        padding: mob ? "48px 16px 64px" : "80px 24px 100px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(139,92,246,0.15)" }} />
        <div style={{ position: "absolute", bottom: -50, left: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.2)" }} />

        <div style={{ ...cn, position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px",
            borderRadius: 100, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
            fontSize: 13, fontWeight: 600, color: "#c4b5fd", marginBottom: 24,
          }}>
            <Star size={14} /> Updated Q1 2026 — {brokers.length} Brokers Tested
          </div>
          <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 34 : 60, lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
            Broker Intelligence,<br />{mob ? "" : ""}Simplified.
          </h1>
          <p style={{ fontSize: mob ? 16 : 20, color: "rgba(255,255,255,0.7)", maxWidth: 580, margin: "0 auto 36px", lineHeight: 1.6 }}>
            Independent broker reviews backed by real-money testing. Find, compare, and choose with confidence.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={lp("/best-forex-brokers")} style={{
              padding: "16px 32px", borderRadius: 12, background: "#fff", color: "#1e1b4b",
              fontWeight: 800, fontSize: 16, textDecoration: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}>View Rankings</Link>
            <Link to={lp("/compare")} style={{
              padding: "16px 32px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none",
            }}>Compare Brokers</Link>
          </div>
        </div>
      </section>

      {/* Floating cards - overlapping hero */}
      <section style={{ ...cn, marginTop: mob ? -32 : -60, position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {top3.map((br, i) => (
            <div key={br.slug} style={{
              background: "#fff", borderRadius: 20, padding: "24px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <BrokerLogo slug={br.slug} name={br.B.name} size={44} shape="wide" />
                  <div>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17 }}>{br.B.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{br.B.type}</div>
                  </div>
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 20,
                  color: "#fff", background: `linear-gradient(135deg, ${accent}, #6366f1)`,
                  padding: "6px 12px", borderRadius: 10,
                }}>{br.B.score}</div>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {br.B.regs?.slice(0, 2).map((r, ri) => <RegBadge key={ri} reg={r.name} />)}
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 20, fontSize: 14, color: "#64748b" }}>
                <span><strong style={{ color: "#1e293b" }}>{br.B.spread}</strong> pips</span>
                <span>Min <strong style={{ color: "#1e293b" }}>${br.B.minDep}</strong></span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                  flex: 1, padding: "12px 0", borderRadius: 10,
                  background: `linear-gradient(135deg, ${accent}, #6366f1)`,
                  color: "#fff", fontWeight: 700, fontSize: 14, textAlign: "center", textDecoration: "none",
                }}>Visit Broker</a>
                <Link to={lp(`/review/${br.slug}`)} style={{
                  padding: "12px 20px", borderRadius: 10, border: "1px solid #e2e8f0",
                  color: "#64748b", fontWeight: 600, fontSize: 14, textDecoration: "none",
                }}>Review</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ ...cn, padding: mob ? "56px 16px" : "80px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 26 : 36, textAlign: "center", marginBottom: 48, color: "#1e1b4b" }}>
          How We Rate Brokers
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 24 }}>
          {[
            { icon: <Shield size={32} color={accent} />, step: "01", title: "Open Real Accounts", desc: "We register, verify, and deposit real money with every broker we review." },
            { icon: <Zap size={32} color={accent} />, step: "02", title: "Execute 500+ Trades", desc: "Test spreads, execution speed, slippage, and platform stability over 30+ days." },
            { icon: <Star size={32} color={accent} />, step: "03", title: "Score & Rank", desc: "Rate across 6 weighted categories with a transparent, published methodology." },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "32px 24px" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, background: "#f5f3ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>{item.icon}</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: accent, fontWeight: 700, marginBottom: 8 }}>STEP {item.step}</div>
              <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 8, marginTop: 0, color: "#1e1b4b" }}>{item.title}</h3>
              <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ background: "#1e1b4b", padding: mob ? "48px 0" : "72px 0" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 32, color: "#fff", textAlign: "center", marginBottom: 32 }}>
            Browse Rankings
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
            {RANKINGS.map((r, i) => (
              <Link key={i} to={lp(r.path)} style={{
                padding: "16px", borderRadius: 12, background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)", textDecoration: "none",
                color: "#e2e8f0", fontSize: 14, fontWeight: 600, textAlign: "center",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.2)"; e.currentTarget.style.borderColor = accent; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                {r.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
