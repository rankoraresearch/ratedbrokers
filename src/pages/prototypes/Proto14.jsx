/**
 * PROTO 14: "Marketplace Grid"
 * E-commerce-style browse pattern. Card grid with filter chips.
 * Purple accent, product-like broker cards.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import { RANKINGS, COUNTRIES, visitUrl } from "./shared";
import CountryFlag from "../../components/CountryFlag";
import { Star, Filter, ChevronRight, CheckCircle } from "lucide-react";

export default function Proto14() {
  const { mob } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const purple = "#7c3aed";
  const purpleLight = "#ede9fe";

  const filters = ["All", "ECN", "Market Maker", "STP", "Low Spread", "Beginner"];
  const [active, setActive] = useState("All");
  const displayed = brokers.slice(0, mob ? 6 : 9);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fafafa", minHeight: "100vh" }}>

      {/* Hero — compact, marketplace-style */}
      <section style={{
        background: `linear-gradient(135deg, ${purple} 0%, #5b21b6 100%)`,
        padding: mob ? "40px 16px 36px" : "60px 24px 52px", textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 26 : 42,
          lineHeight: 1.1, color: "#fff", marginBottom: 12,
        }}>
          Browse {brokers.length} Forex Brokers
        </h1>
        <p style={{ fontSize: mob ? 15 : 17, color: "rgba(255,255,255,0.75)", maxWidth: 460, margin: "0 auto" }}>
          Independently tested & scored. Find the perfect match for your trading style.
        </p>
      </section>

      {/* Filter bar */}
      <section style={{
        ...cn, position: "relative", zIndex: 5,
        marginTop: -20, marginBottom: 8,
      }}>
        <div style={{
          display: "flex", gap: 8, overflowX: "auto", padding: "16px 20px",
          background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}>
          <Filter size={18} color="#a3a3a3" style={{ flexShrink: 0, marginTop: 4 }} />
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)} style={{
              padding: "8px 18px", borderRadius: 100, border: "none", cursor: "pointer",
              background: active === f ? purple : "#f4f4f5", color: active === f ? "#fff" : "#71717a",
              fontWeight: 700, fontSize: 14, fontFamily: "inherit", whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}>{f}</button>
          ))}
        </div>
      </section>

      {/* Product grid */}
      <section style={{ ...cn, padding: mob ? "24px 16px 48px" : "32px 24px 72px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)",
          gap: 16,
        }}>
          {displayed.map((br, i) => (
            <div key={br.slug} style={{
              background: "#fff", borderRadius: 16, overflow: "hidden",
              border: "1px solid #e5e7eb", transition: "all 0.2s",
            }}>
              {/* Top color bar */}
              <div style={{ height: 4, background: i < 3 ? purple : "#e5e7eb" }} />

              <div style={{ padding: "20px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <BrokerLogo slug={br.slug} name={br.B.name} size={44} shape="wide" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17 }}>{br.B.name}</div>
                    <div style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>{br.B.type}</div>
                  </div>
                  {i < 3 && (
                    <div style={{
                      padding: "4px 10px", borderRadius: 6, background: purpleLight,
                      fontSize: 11, fontWeight: 700, color: purple,
                    }}>Top {i + 1}</div>
                  )}
                </div>

                {/* Score + stars */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 24, color: purple,
                  }}>{br.B.score}</div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1, 2, 3, 4, 5].map(si => <Star key={si} size={14} fill="#fbbf24" color="#fbbf24" />)}
                  </div>
                </div>

                {/* Specs grid */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
                  padding: "12px", background: "#fafafa", borderRadius: 10, marginBottom: 16,
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#a3a3a3", textTransform: "uppercase" }}>Spread</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{br.B.spread} pips</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#a3a3a3", textTransform: "uppercase" }}>Min Deposit</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>${br.B.minDep}</div>
                  </div>
                </div>

                {/* Quick features */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                  {(br.B.regs || []).slice(0, 2).map((r, ri) => (
                    <span key={ri} style={{
                      padding: "4px 10px", borderRadius: 100, background: "#f0fdf4",
                      border: "1px solid #bbf7d0", fontSize: 12, fontWeight: 600, color: "#15803d",
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <CheckCircle size={10} /> {r.name}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                    flex: 1, padding: "12px", borderRadius: 10, background: purple,
                    color: "#fff", fontWeight: 700, fontSize: 14, textAlign: "center", textDecoration: "none",
                  }}>Visit Broker</a>
                  <Link to={lp(`/review/${br.slug}`)} style={{
                    padding: "12px 14px", borderRadius: 10, border: "1px solid #e5e7eb",
                    color: "#71717a", fontWeight: 600, fontSize: 14, textDecoration: "none",
                  }}>Review</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <Link to={lp("/best-forex-brokers")} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px", borderRadius: 12, border: `2px solid ${purple}`,
            color: purple, fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}>
            View All {brokers.length} Brokers <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Categories strip */}
      <section style={{ background: "#fff", padding: mob ? "48px 0" : "64px 0", borderTop: "1px solid #e5e7eb" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 24 }}>
            Shop by Category
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
            {RANKINGS.map((r, i) => (
              <Link key={i} to={lp(r.path)} style={{
                padding: "16px", borderRadius: 14, background: "#fafafa",
                border: "1px solid #e5e7eb", textDecoration: "none",
                color: "#374151", fontWeight: 600, fontSize: 14, textAlign: "center",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = purpleLight; e.currentTarget.style.borderColor = purple; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
              >{r.title}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "64px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 24 }}>
          By Region
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {COUNTRIES.map((c, i) => (
            <Link key={i} to={lp(c.path)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "14px 16px",
              borderRadius: 12, background: "#fff", border: "1px solid #e5e7eb",
              textDecoration: "none", color: "#374151",
            }}>
              <CountryFlag code={c.code} size={24} />
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
              <span style={{ fontSize: 12, color: purple, fontWeight: 700 }}>{c.count} brokers</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
