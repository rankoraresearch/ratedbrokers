/**
 * PROTO 7: "Trust & Safety"
 * Light background, soft blue + amber accents.
 * Regulation-first, shield motifs, authoritative but approachable.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import RegBadge from "../../components/RegBadge";
import { RANKINGS, COUNTRIES, visitUrl } from "./shared";
import CountryFlag from "../../components/CountryFlag";
import { Shield, CheckCircle, Lock, ArrowRight, Award } from "lucide-react";

export default function Proto7() {
  const { mob } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top3 = brokers.slice(0, 3);
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const blue = "#1d4ed8";
  const amber = "#f59e0b";

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Trust banner */}
      <div style={{ background: "#eff6ff", padding: "10px 0", borderBottom: "1px solid #bfdbfe" }}>
        <div style={{ ...cn, display: "flex", justifyContent: "center", gap: mob ? 16 : 32, fontSize: 12, color: "#1e40af" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Shield size={12} color={blue} /> Independent Research</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Lock size={12} color={blue} /> Expert Analysis</span>
          {!mob && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={12} color={blue} /> No Sponsored Rankings</span>}
        </div>
      </div>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(180deg, #eff6ff 0%, #fff 100%)",
        padding: mob ? "48px 16px 56px" : "72px 24px 80px", textAlign: "center",
      }}>
        <div style={cn}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px",
            borderRadius: 100, background: "#fef3c7", border: "1px solid #fde68a",
            marginBottom: 24,
          }}>
            <Shield size={16} color={amber} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>Regulated · Tested · Trusted</span>
          </div>
          <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 30 : 52, lineHeight: 1.1, color: "#0f172a", marginBottom: 16 }}>
            Your Money Deserves<br />a Safe Broker
          </h1>
          <p style={{ fontSize: mob ? 16 : 18, color: "#64748b", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.7 }}>
            We analyze {brokers.length} brokers across 130+ data points so you don't have to. Every broker verified against 6 safety and performance criteria.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={lp("/best-forex-brokers")} style={{
              padding: "14px 32px", borderRadius: 10, background: blue, color: "#fff",
              fontWeight: 800, fontSize: 16, textDecoration: "none",
            }}>Find Safe Brokers</Link>
            <Link to={lp("/methodology")} style={{
              padding: "14px 32px", borderRadius: 10, border: "1px solid #e2e8f0",
              color: "#64748b", fontWeight: 600, fontSize: 16, textDecoration: "none",
            }}>Our Methodology</Link>
          </div>
        </div>
      </section>

      {/* Trust metrics */}
      <section style={{ ...cn, padding: mob ? "0 16px 48px" : "0 24px 64px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12,
        }}>
          {[
            { val: String(brokers.length), label: "Brokers Analyzed", sub: "130+ data points each" },
            { val: "100%", label: "Independent", sub: "No pay-to-play" },
            { val: "6", label: "Safety Criteria", sub: "Transparent formula" },
            { val: "Quarterly", label: "Updated", sub: "Fresh data always" },
          ].map((m, i) => (
            <div key={i} style={{
              background: "#f8fafc", borderRadius: 14, padding: "20px", textAlign: "center",
              border: "1px solid #e2e8f0",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 28, color: blue }}>{m.val}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginTop: 4 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top brokers with regulation emphasis */}
      <section style={{ ...cn, padding: mob ? "0 16px 48px" : "0 24px 72px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 34, textAlign: "center", marginBottom: 8 }}>
          Safest Brokers of 2026
        </h2>
        <p style={{ textAlign: "center", color: "#64748b", fontSize: 16, marginBottom: 36 }}>
          Only brokers with Tier-1 regulation make our top picks.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {top3.map((br, i) => (
            <div key={br.slug} style={{
              background: "#fff", borderRadius: 16, overflow: "hidden",
              border: i === 0 ? `2px solid ${amber}` : "1px solid #e2e8f0",
            }}>
              {/* Regulation strip */}
              <div style={{
                background: i === 0 ? "#fef3c7" : "#f1f5f9", padding: "10px 20px",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <Shield size={14} color={i === 0 ? "#92400e" : "#64748b"} />
                <span style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? "#92400e" : "#64748b" }}>
                  {br.B.regs?.map(r => r.name).join(" · ") || "Regulated"}
                </span>
              </div>
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <BrokerLogo slug={br.slug} name={br.B.name} size={48} shape="wide" />
                  <div>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18 }}>{br.B.name}</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>{br.B.type}</div>
                  </div>
                  <div style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 22, color: blue }}>{br.B.score}</div>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 16, fontSize: 14 }}>
                  <div><span style={{ color: "#94a3b8" }}>Spread</span> <strong>{br.B.spread} pips</strong></div>
                  <div><span style={{ color: "#94a3b8" }}>Min</span> <strong>${br.B.minDep}</strong></div>
                </div>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {br.B.regs?.slice(0, 3).map((r, ri) => <RegBadge key={ri} reg={r.name} />)}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                    flex: 1, padding: "12px 0", borderRadius: 10, background: blue,
                    color: "#fff", fontWeight: 700, fontSize: 15, textAlign: "center", textDecoration: "none",
                  }}>Visit Broker</a>
                  <Link to={lp(`/review/${br.slug}`)} style={{
                    padding: "12px 20px", borderRadius: 10, border: "1px solid #e2e8f0",
                    color: "#64748b", fontWeight: 600, fontSize: 14, textDecoration: "none",
                  }}>Review</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Countries */}
      <section style={{ background: "#f8fafc", padding: mob ? "48px 0" : "72px 0", borderTop: "1px solid #e2e8f0" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 32, textAlign: "center", marginBottom: 32 }}>
            Brokers by Your Regulator
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
            {COUNTRIES.map((c, i) => (
              <Link key={i} to={lp(c.path)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
                borderRadius: 10, background: "#fff", border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#0f172a",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = blue}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <CountryFlag code={c.code} size={24} />
                <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                <span style={{ fontSize: 12, color: amber, fontWeight: 700 }}>{c.reg}</span>
                <ArrowRight size={14} color="#94a3b8" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
