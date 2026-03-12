/**
 * PROTO 6: "Swiss Minimal"
 * Ultra-clean, bold typography, red accent, massive whitespace.
 * Award-winning design minimalism. Every pixel intentional.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import { RANKINGS, visitUrl } from "./shared";
import { ArrowRight } from "lucide-react";

export default function Proto6() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top5 = brokers.slice(0, 5);
  const cn = { maxWidth: 1080, margin: "0 auto", padding: mob ? "0 20px" : "0 40px" };
  const red = "#ef4444";

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff", color: "#0a0a0a", minHeight: "100vh" }}>

      {/* Hero — extreme minimalism */}
      <section style={{ ...cn, padding: mob ? "64px 20px" : "120px 40px 100px" }}>
        <h1 style={{
          fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 40 : 80,
          lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: 24,
        }}>
          Best Forex<br />Brokers {mob ? "" : <span style={{ color: red }}>2026</span>}{mob && <span style={{ color: red }}>2026</span>}.
        </h1>
        <p style={{ fontSize: mob ? 16 : 20, color: "#71717a", maxWidth: 480, lineHeight: 1.7, marginBottom: 40 }}>
          {brokers.length} brokers. Real money. Independent research. No sponsored rankings.
        </p>
        <Link to={lp("/best-forex-brokers")} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 16, fontWeight: 700, color: "#0a0a0a", textDecoration: "none",
          borderBottom: `2px solid ${red}`, paddingBottom: 4,
        }}>
          View Rankings <ArrowRight size={18} />
        </Link>
      </section>

      {/* Divider */}
      <div style={{ ...cn }}><div style={{ height: 1, background: "#e4e4e7" }} /></div>

      {/* Top brokers — clean list */}
      <section style={{ ...cn, padding: mob ? "48px 20px" : "80px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 28, margin: 0 }}>Top Rated</h2>
          <Link to={lp("/best-forex-brokers")} style={{ fontSize: 14, fontWeight: 600, color: red, textDecoration: "none" }}>
            All brokers →
          </Link>
        </div>

        {top5.map((br, i) => (
          <Link key={br.slug} to={lp(`/review/${br.slug}`)} style={{
            display: "flex", alignItems: "center", gap: mob ? 16 : 24,
            padding: mob ? "20px 0" : "28px 0",
            borderBottom: "1px solid #f4f4f5",
            textDecoration: "none", color: "#0a0a0a",
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: mob ? 14 : 18,
              color: i === 0 ? red : "#d4d4d8", minWidth: mob ? 24 : 32,
            }}>{String(i + 1).padStart(2, "0")}</span>

            <BrokerLogo slug={br.slug} name={br.B.name} size={mob ? 36 : 44} shape="wide" />

            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 16 : 20 }}>{br.B.name}</div>
              <div style={{ fontSize: 14, color: "#a1a1aa", marginTop: 2 }}>
                {br.B.type} · {br.B.spread} pips · ${br.B.minDep} min
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{
                fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: mob ? 20 : 28,
                color: i === 0 ? red : "#0a0a0a",
              }}>{br.B.score}</div>
              <div style={{ fontSize: 12, color: "#a1a1aa" }}>/10</div>
            </div>
          </Link>
        ))}
      </section>

      {/* Divider */}
      <div style={{ ...cn }}><div style={{ height: 1, background: "#e4e4e7" }} /></div>

      {/* Categories — minimal grid */}
      <section style={{ ...cn, padding: mob ? "48px 20px" : "80px 40px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 28, marginBottom: 32 }}>By Category</h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(2, 1fr)", gap: 0 }}>
          {RANKINGS.map((r, i) => (
            <Link key={i} to={lp(r.path)} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "18px 0", borderBottom: "1px solid #f4f4f5",
              textDecoration: "none", color: "#0a0a0a", fontSize: 16, fontWeight: 600,
              paddingRight: i % 2 === 0 && !mob ? 40 : 0,
              paddingLeft: i % 2 === 1 && !mob ? 40 : 0,
              borderLeft: i % 2 === 1 && !mob ? "1px solid #f4f4f5" : "none",
            }}
              onMouseEnter={e => e.currentTarget.style.color = red}
              onMouseLeave={e => e.currentTarget.style.color = "#0a0a0a"}
            >
              {r.title}
              <ArrowRight size={16} color="#d4d4d8" />
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: mob ? "48px 0" : "80px 0", textAlign: "center", borderTop: "1px solid #e4e4e7" }}>
        <div style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 24 : 40, marginBottom: 20, letterSpacing: "-0.02em" }}>
          Ready to trade?
        </div>
        <Link to={lp("/best-forex-brokers")} style={{
          display: "inline-block", padding: "16px 40px", background: red, color: "#fff",
          fontWeight: 800, fontSize: 16, borderRadius: 8, textDecoration: "none",
        }}>
          Find Your Broker
        </Link>
      </section>
    </div>
  );
}
