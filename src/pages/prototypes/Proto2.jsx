/**
 * PROTO 2: "Clean White" (NerdWallet-inspired)
 * Light, airy, generous whitespace, teal accent.
 * Search-first approach, large readable cards.
 * Approachable and trustworthy.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import RegBadge from "../../components/RegBadge";
import { RANKINGS, COUNTRIES, visitUrl } from "./shared";
import CountryFlag from "../../components/CountryFlag";
import { ArrowRight, Search, Shield, DollarSign, BarChart3 } from "lucide-react";

export default function Proto2() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top3 = brokers.slice(0, 3);
  const cn = { maxWidth: 1100, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const teal = "#0891b2";

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ ...cn, padding: mob ? "48px 16px 40px" : "80px 24px 64px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 32 : 56, lineHeight: 1.08, color: "#0f172a", marginBottom: 16 }}>
          Find the Best Broker<br />for Your Trading Style
        </h1>
        <p style={{ fontSize: mob ? 16 : 20, color: "#64748b", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 }}>
          {brokers.length} brokers independently tested with real money. Compare spreads, fees, and regulation side by side.
        </p>
        {/* Search bar */}
        <div style={{
          maxWidth: 580, margin: "0 auto 40px", display: "flex", alignItems: "center",
          border: "2px solid #e2e8f0", borderRadius: 14, padding: "4px 4px 4px 20px",
          background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          <Search size={20} color="#94a3b8" style={{ flexShrink: 0 }} />
          <input
            placeholder="Search brokers, e.g. IC Markets, Pepperstone..."
            style={{
              flex: 1, border: "none", outline: "none", fontSize: 16, padding: "14px 12px",
              fontFamily: "inherit", background: "transparent", color: "#1e293b",
            }}
          />
          <button style={{
            padding: "12px 24px", borderRadius: 10, background: teal, color: "#fff",
            fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
          }}>Search</button>
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {["Best Overall", "Beginners", "Lowest Spreads", "ECN", "Copy Trading"].map((label, i) => (
            <Link key={i} to={lp(RANKINGS[i]?.path || "/best-forex-brokers")} style={{
              padding: "8px 16px", borderRadius: 100, background: "#f0fdfa", border: "1px solid #99f6e4",
              color: teal, fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>{label}</Link>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: "#f1f5f9" }} />

      {/* Top Picks */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: teal, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
            Editor's Picks
          </div>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 26 : 36, color: "#0f172a" }}>
            Top Rated Brokers for 2026
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
          {top3.map((br, i) => (
            <div key={br.slug} style={{
              border: i === 0 ? `2px solid ${teal}` : "1px solid #e2e8f0",
              borderRadius: 20, padding: mob ? "24px" : "28px",
              background: "#fff", position: "relative",
            }}>
              {i === 0 && (
                <div style={{
                  position: "absolute", top: -12, left: 24, padding: "5px 14px",
                  borderRadius: 100, background: teal, color: "#fff",
                  fontSize: 12, fontWeight: 700,
                }}>Best Overall</div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, marginTop: i === 0 ? 8 : 0 }}>
                <BrokerLogo slug={br.slug} name={br.B.name} size={48} shape="wide" />
                <div>
                  <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, color: "#0f172a" }}>{br.B.name}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{br.B.type}</div>
                </div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
                padding: "10px 14px", borderRadius: 10, background: "#f0fdfa",
              }}>
                <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 24, color: teal }}>{br.B.score}</span>
                <span style={{ fontSize: 14, color: "#64748b" }}>/ 10</span>
                <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: teal }}>
                  {br.B.score >= 9.5 ? "Excellent" : br.B.score >= 9 ? "Great" : "Good"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 14 }}>
                <div><span style={{ color: "#94a3b8" }}>Spread</span><br /><strong>{br.B.spread} pips</strong></div>
                <div><span style={{ color: "#94a3b8" }}>Min Dep</span><br /><strong>${br.B.minDep}</strong></div>
                <div><span style={{ color: "#94a3b8" }}>Leverage</span><br /><strong>{br.B.leverage || "1:500"}</strong></div>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
                {br.B.regs?.slice(0, 3).map((r, ri) => <RegBadge key={ri} reg={r.name} />)}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                  flex: 1, padding: "12px 0", borderRadius: 10, background: teal,
                  color: "#fff", fontWeight: 700, fontSize: 15, textAlign: "center", textDecoration: "none",
                }}>Visit Broker</a>
                <Link to={lp(`/review/${br.slug}`)} style={{
                  padding: "12px 16px", borderRadius: 10, border: "1px solid #e2e8f0",
                  color: "#64748b", fontWeight: 600, fontSize: 14, textDecoration: "none",
                }}>Review</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Trust Us */}
      <section style={{ background: "#f8fafc", padding: mob ? "48px 0" : "72px 0" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 32, textAlign: "center", marginBottom: 40 }}>
            Why Traders Trust RatedBrokers
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: <Shield size={28} color={teal} />, title: "Independent Testing", desc: "We deposit real money and execute 500+ trades per broker. No demo shortcuts." },
              { icon: <DollarSign size={28} color={teal} />, title: "No Pay-to-Play", desc: "Rankings are based on our methodology, not sponsorship fees. Affiliate revenue never influences scores." },
              { icon: <BarChart3 size={28} color={teal} />, title: "Transparent Scoring", desc: "6 weighted categories, published formula. Every score is verifiable and reproducible." },
            ].map((item, i) => (
              <div key={i} style={{ padding: "28px", borderRadius: 16, background: "#fff", border: "1px solid #e2e8f0" }}>
                <div style={{ marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, marginBottom: 8, marginTop: 0 }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 32, textAlign: "center", marginBottom: 32 }}>
          Find Brokers in Your Country
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {COUNTRIES.map((c, i) => (
            <Link key={i} to={lp(c.path)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
              borderRadius: 12, border: "1px solid #e2e8f0",
              textDecoration: "none", color: "#0f172a", transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = teal}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
            >
              <CountryFlag code={c.code} size={28} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{c.count} brokers</div>
              </div>
              <ArrowRight size={16} color="#94a3b8" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
