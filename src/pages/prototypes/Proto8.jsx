/**
 * PROTO 8: "Comparison First"
 * Hero IS the comparison tool. Orange accent.
 * Interactive feel, tool-first approach.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import { canonicalPair } from "../../data/comparisons";
import BrokerLogo from "../../components/BrokerLogo";
import { RANKINGS, COMPARISONS, visitUrl } from "./shared";
import { ArrowRight, ArrowLeftRight } from "lucide-react";

export default function Proto8() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const navigate = useNavigate();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top3 = brokers.slice(0, 3);
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const orange = "#f97316";
  const [pickA, setPickA] = useState("");
  const [pickB, setPickB] = useState("");

  const handleCompare = () => {
    if (pickA && pickB && pickA !== pickB) {
      navigate(lp(`/compare/${canonicalPair(pickA, pickB)}`));
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fafafa", minHeight: "100vh" }}>

      {/* Hero = Compare Tool */}
      <section style={{
        background: "linear-gradient(180deg, #fff8f0 0%, #fff 100%)",
        padding: mob ? "48px 16px 56px" : "72px 24px 80px", textAlign: "center",
      }}>
        <div style={cn}>
          <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 28 : 48, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 12 }}>
            Compare Forex Brokers<br />Side by Side
          </h1>
          <p style={{ fontSize: mob ? 15 : 18, color: "#71717a", maxWidth: 520, margin: "0 auto 36px" }}>
            Select two brokers from our database of {brokers.length} tested options. See exactly how they compare.
          </p>

          {/* Compare widget */}
          <div style={{
            maxWidth: 700, margin: "0 auto", background: "#fff", borderRadius: 20,
            border: "2px solid #fed7aa", padding: mob ? "24px" : "32px",
            boxShadow: "0 8px 40px rgba(249,115,22,0.08)",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr auto 1fr", gap: 16, alignItems: "end" }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#71717a", marginBottom: 6, textTransform: "uppercase" }}>
                  Broker A
                </label>
                <select value={pickA} onChange={e => setPickA(e.target.value)} style={{
                  width: "100%", padding: "14px", borderRadius: 10, border: "2px solid #e5e5e5",
                  fontSize: 16, fontFamily: "inherit", background: "#fafafa", cursor: "pointer",
                }}>
                  <option value="">Choose broker...</option>
                  {brokers.map(b => <option key={b.slug} value={b.slug} disabled={b.slug === pickB}>{b.B.name} ({b.B.score})</option>)}
                </select>
              </div>
              {!mob && (
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", background: orange,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ArrowLeftRight size={20} color="#fff" />
                </div>
              )}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#71717a", marginBottom: 6, textTransform: "uppercase" }}>
                  Broker B
                </label>
                <select value={pickB} onChange={e => setPickB(e.target.value)} style={{
                  width: "100%", padding: "14px", borderRadius: 10, border: "2px solid #e5e5e5",
                  fontSize: 16, fontFamily: "inherit", background: "#fafafa", cursor: "pointer",
                }}>
                  <option value="">Choose broker...</option>
                  {brokers.map(b => <option key={b.slug} value={b.slug} disabled={b.slug === pickA}>{b.B.name} ({b.B.score})</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleCompare} disabled={!pickA || !pickB || pickA === pickB} style={{
              display: "block", width: "100%", marginTop: 20, padding: "16px",
              borderRadius: 12, border: "none", cursor: pickA && pickB ? "pointer" : "not-allowed",
              background: pickA && pickB && pickA !== pickB ? orange : "#e5e5e5",
              color: pickA && pickB && pickA !== pickB ? "#fff" : "#a3a3a3",
              fontWeight: 800, fontSize: 16, fontFamily: "inherit",
            }}>Compare Now →</button>
          </div>

          {/* Popular comparisons */}
          <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#a3a3a3", alignSelf: "center" }}>Popular:</span>
            {COMPARISONS.slice(0, 3).map((c, i) => (
              <Link key={i} to={lp(c.path)} style={{
                padding: "6px 14px", borderRadius: 100, background: "#fff", border: "1px solid #e5e5e5",
                fontSize: 13, fontWeight: 600, color: "#525252", textDecoration: "none",
              }}>{c.a} vs {c.b}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* Or browse top rated */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 32, textAlign: "center", marginBottom: 8 }}>
          Or Start with Our Top Picks
        </h2>
        <p style={{ textAlign: "center", color: "#71717a", marginBottom: 36 }}>
          These brokers scored highest across all 6 testing categories.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {top3.map((br, i) => (
            <div key={br.slug} style={{
              background: "#fff", borderRadius: 16, padding: "24px",
              border: i === 0 ? `2px solid ${orange}` : "1px solid #e5e5e5",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <BrokerLogo slug={br.slug} name={br.B.name} size={44} shape="wide" />
                  <div>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17 }}>{br.B.name}</div>
                    <div style={{ fontSize: 13, color: "#a3a3a3" }}>{br.B.type}</div>
                  </div>
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 20,
                  color: "#fff", background: orange, padding: "4px 10px", borderRadius: 8,
                }}>{br.B.score}</div>
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 16, fontSize: 14, color: "#71717a" }}>
                <span>Spread: <strong style={{ color: "#1a1a1a" }}>{br.B.spread} pips</strong></span>
                <span>Min: <strong style={{ color: "#1a1a1a" }}>${br.B.minDep}</strong></span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                  flex: 1, padding: "12px", borderRadius: 10, background: orange,
                  color: "#fff", fontWeight: 700, fontSize: 14, textAlign: "center", textDecoration: "none",
                }}>Visit Broker</a>
                <Link to={lp(`/review/${br.slug}`)} style={{
                  padding: "12px 16px", borderRadius: 10, border: "1px solid #e5e5e5",
                  color: "#71717a", fontWeight: 600, fontSize: 14, textDecoration: "none",
                }}>Review</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rankings grid */}
      <section style={{ ...cn, padding: mob ? "0 16px 48px" : "0 24px 72px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 24 }}>
          Browse by Category
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
          {RANKINGS.map((r, i) => (
            <Link key={i} to={lp(r.path)} style={{
              padding: "16px", borderRadius: 12, background: "#fff", border: "1px solid #e5e5e5",
              textDecoration: "none", color: "#1a1a1a", fontWeight: 600, fontSize: 14,
              textAlign: "center", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = orange; e.currentTarget.style.color = orange; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.color = "#1a1a1a"; }}
            >{r.title}</Link>
          ))}
        </div>
      </section>
    </div>
  );
}
