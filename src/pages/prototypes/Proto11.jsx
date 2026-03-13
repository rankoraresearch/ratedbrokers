/**
 * PROTO 11: "Elegant Cream"
 * Warm luxury feel on cream/white background.
 * Burgundy/wine accent. Refined, premium, light.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import { RANKINGS, COUNTRIES, visitUrl } from "./shared";
import CountryFlag from "../../components/CountryFlag";
import { Award, Star, ArrowRight, ChevronRight } from "lucide-react";

export default function Proto11() {
  const { mob } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top5 = brokers.slice(0, 5);
  const cn = { maxWidth: 1100, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const wine = "#9f1239";
  const cream = "#faf8f5";

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: cream, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ ...cn, padding: mob ? "56px 16px 48px" : "96px 24px 80px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px",
            borderRadius: 100, background: "#fff", border: "1px solid #e8e0d8",
            marginBottom: 28,
          }}>
            <Award size={14} color={wine} />
            <span style={{ fontSize: 13, fontWeight: 700, color: wine, letterSpacing: "0.03em" }}>
              Independent Broker Research
            </span>
          </div>

          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 34 : 58,
            lineHeight: 1.06, color: "#1a1a1a", marginBottom: 20, letterSpacing: "-0.02em",
          }}>
            The Definitive Guide<br />to Forex Brokers
          </h1>
          <p style={{
            fontSize: mob ? 16 : 19, color: "#7c7268", maxWidth: 520,
            margin: "0 auto 36px", lineHeight: 1.7,
          }}>
            {brokers.length} brokers independently analyzed. Transparent methodology. No sponsored placements.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={lp("/best-forex-brokers")} style={{
              padding: "16px 36px", borderRadius: 10, background: wine, color: "#fff",
              fontWeight: 800, fontSize: 16, textDecoration: "none",
            }}>View Rankings</Link>
            <Link to={lp("/methodology")} style={{
              padding: "16px 36px", borderRadius: 10, border: "1px solid #d4cdc5",
              background: "#fff", color: "#5c534a", fontWeight: 600, fontSize: 16, textDecoration: "none",
            }}>Our Methodology</Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ ...cn }}><div style={{ height: 1, background: "#e8e0d8" }} /></div>

      {/* Top brokers — elegant list */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, margin: 0, color: "#1a1a1a" }}>
            Top Rated 2026
          </h2>
          <Link to={lp("/best-forex-brokers")} style={{
            fontSize: 14, fontWeight: 600, color: wine, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            All Brokers <ArrowRight size={14} />
          </Link>
        </div>

        {top5.map((br, i) => (
          <div key={br.slug} style={{
            display: "flex", alignItems: "center", gap: mob ? 14 : 24,
            padding: mob ? "18px 0" : "24px 0",
            borderBottom: "1px solid #ede7e0",
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 15,
              color: i === 0 ? wine : "#c4b8ab", minWidth: 28,
            }}>{String(i + 1).padStart(2, "0")}</span>

            <BrokerLogo slug={br.slug} name={br.B.name} size={mob ? 36 : 44} shape="wide" />

            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 16 : 19, color: "#1a1a1a" }}>{br.B.name}</div>
              <div style={{ fontSize: 13, color: "#9c918a", marginTop: 3 }}>
                {br.B.type} · {br.B.spread} pips · ${br.B.minDep} min
              </div>
            </div>

            <div style={{
              fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: mob ? 22 : 28,
              color: i === 0 ? wine : "#1a1a1a",
            }}>{br.B.score}</div>

            <div style={{ display: "flex", gap: 8 }}>
              <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                padding: mob ? "10px 14px" : "10px 20px", borderRadius: 8, background: wine,
                color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none",
              }}>Visit</a>
              {!mob && (
                <Link to={lp(`/review/${br.slug}`)} style={{
                  padding: "10px 16px", borderRadius: 8, border: "1px solid #d4cdc5",
                  color: "#7c7268", fontWeight: 600, fontSize: 13, textDecoration: "none",
                }}>Review</Link>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Divider */}
      <div style={{ ...cn }}><div style={{ height: 1, background: "#e8e0d8" }} /></div>

      {/* Rankings */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 28, color: "#1a1a1a" }}>
          Browse Rankings
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
          {RANKINGS.map((r, i) => (
            <Link key={i} to={lp(r.path)} style={{
              padding: "14px 16px", borderRadius: 10, border: "1px solid #e0d8d0",
              background: "#fff", textDecoration: "none", color: "#3d352e",
              fontWeight: 600, fontSize: 14, textAlign: "center",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = wine; e.currentTarget.style.color = wine; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0d8d0"; e.currentTarget.style.color = "#3d352e"; }}
            >{r.title}</Link>
          ))}
        </div>
      </section>

      {/* Countries */}
      <section style={{ background: "#fff", padding: mob ? "48px 0" : "72px 0", borderTop: "1px solid #e8e0d8" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 28 }}>
            By Country
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
            {COUNTRIES.map((c, i) => (
              <Link key={i} to={lp(c.path)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
                borderRadius: 10, background: cream, border: "1px solid #e0d8d0",
                textDecoration: "none", color: "#1a1a1a",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = wine}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e0d8d0"}
              >
                <CountryFlag code={c.code} size={24} />
                <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                <span style={{ fontSize: 12, color: wine, fontWeight: 700 }}>{c.reg}</span>
                <ChevronRight size={14} color="#c4b8ab" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        textAlign: "center", padding: mob ? "48px 16px" : "72px 24px",
        borderTop: "1px solid #e8e0d8",
      }}>
        <div style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 24 : 40, marginBottom: 16, color: "#1a1a1a" }}>
          Start Trading Smarter
        </div>
        <p style={{ color: "#7c7268", fontSize: 16, marginBottom: 28 }}>Find the right broker for your strategy.</p>
        <Link to={lp("/best-forex-brokers")} style={{
          display: "inline-block", padding: "16px 40px", background: wine, color: "#fff",
          fontWeight: 800, fontSize: 16, borderRadius: 10, textDecoration: "none",
        }}>Find Your Broker</Link>
      </section>
    </div>
  );
}
