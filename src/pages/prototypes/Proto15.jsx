/**
 * PROTO 15: "Content Hub / News"
 * Magazine-style editorial grid. Trending topics, featured content.
 * Warm neutral + indigo accent. Feels like Bloomberg + Medium hybrid.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import { RANKINGS, COMPARISONS, COUNTRIES, visitUrl } from "./shared";
import CountryFlag from "../../components/CountryFlag";
import { TrendingUp, Clock, ArrowRight, Star, Flame, BookOpen } from "lucide-react";

export default function Proto15() {
  const { mob } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top3 = brokers.slice(0, 3);
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const indigo = "#4f46e5";

  const trending = [
    { label: "IC Markets vs Pepperstone: 2026 Update", path: "/compare/ic-markets-vs-pepperstone", tag: "Comparison" },
    { label: "Best ECN Brokers for Scalpers", path: "/best-ecn-forex-brokers", tag: "Ranking" },
    { label: "Lowest Spread Brokers Tested", path: "/lowest-spread-forex-brokers", tag: "Research" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Ticker-like top bar */}
      <div style={{
        background: "#0f172a", padding: "10px 0", overflow: "hidden",
      }}>
        <div style={{
          ...cn, display: "flex", alignItems: "center", gap: 20,
          fontSize: 13, color: "#94a3b8",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#22d3ee", fontWeight: 700, flexShrink: 0 }}>
            <Flame size={12} /> TRENDING
          </span>
          {!mob && trending.map((t, i) => (
            <Link key={i} to={lp(t.path)} style={{
              color: "#94a3b8", textDecoration: "none", whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{
                padding: "2px 8px", borderRadius: 4, background: indigo + "20",
                fontSize: 11, fontWeight: 700, color: "#818cf8",
              }}>{t.tag}</span>
              {t.label}
            </Link>
          ))}
          {mob && (
            <Link to={lp(trending[0].path)} style={{ color: "#94a3b8", textDecoration: "none", fontSize: 13 }}>
              {trending[0].label}
            </Link>
          )}
        </div>
      </div>

      {/* Hero — magazine grid */}
      <section style={{ ...cn, padding: mob ? "32px 16px 40px" : "48px 24px 56px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1.5fr 1fr",
          gap: 16,
        }}>
          {/* Main feature */}
          <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: 20, padding: mob ? "28px 20px" : "40px 36px",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            minHeight: mob ? 280 : 360,
          }}>
            <div style={{
              padding: "4px 12px", borderRadius: 6, background: indigo,
              fontSize: 12, fontWeight: 700, color: "#fff", display: "inline-flex",
              alignItems: "center", gap: 4, width: "fit-content", marginBottom: 16,
            }}>
              <Star size={12} /> EDITOR'S PICK
            </div>
            <h1 style={{
              fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 26 : 40,
              lineHeight: 1.15, color: "#fff", marginBottom: 12,
            }}>
              Best Forex Brokers of 2026 — Tested & Ranked
            </h1>
            <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.6, marginBottom: 20 }}>
              We tested {brokers.length} brokers with real money across 6 categories.
              Here are the results.
            </p>
            <Link to={lp("/best-forex-brokers")} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none",
            }}>
              Read Full Rankings <ArrowRight size={16} />
            </Link>
          </div>

          {/* Side cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Link to={lp("/best-forex-brokers-for-beginners")} style={{
              flex: 1, background: "#fef3c7", borderRadius: 20, padding: "24px",
              textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "flex-end",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>
                <BookOpen size={14} style={{ verticalAlign: "-2px" }} /> GUIDE
              </div>
              <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, color: "#451a03", lineHeight: 1.3 }}>
                Best Brokers for Beginners
              </div>
              <div style={{ fontSize: 13, color: "#92400e", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <Clock size={12} /> 8 min read
              </div>
            </Link>

            <Link to={lp("/compare/ic-markets-vs-pepperstone")} style={{
              flex: 1, background: "#ede9fe", borderRadius: 20, padding: "24px",
              textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "flex-end",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: indigo, marginBottom: 8 }}>
                <TrendingUp size={14} style={{ verticalAlign: "-2px" }} /> COMPARISON
              </div>
              <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, color: "#1e1b4b", lineHeight: 1.3 }}>
                IC Markets vs Pepperstone
              </div>
              <div style={{ fontSize: 13, color: "#5b21b6", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <Clock size={12} /> 5 min read
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Top brokers — compact table */}
      <section style={{ ...cn, padding: mob ? "0 16px 48px" : "0 24px 64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, margin: 0 }}>
            Top Rated Brokers
          </h2>
          <Link to={lp("/best-forex-brokers")} style={{ fontSize: 14, fontWeight: 600, color: indigo, textDecoration: "none" }}>
            Full Rankings →
          </Link>
        </div>
        <div style={{
          background: "#f8fafc", borderRadius: 16, border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}>
          {brokers.slice(0, 6).map((br, i) => (
            <div key={br.slug} style={{
              display: "flex", alignItems: "center", gap: mob ? 12 : 16,
              padding: mob ? "14px 16px" : "16px 24px",
              borderBottom: i < 5 ? "1px solid #e2e8f0" : "none",
              background: i === 0 ? `${indigo}08` : "transparent",
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 13,
                color: "#94a3b8", width: 20,
              }}>{i + 1}</span>
              <BrokerLogo slug={br.slug} name={br.B.name} size={32} shape="wide" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{br.B.name}</div>
                {!mob && <div style={{ fontSize: 12, color: "#94a3b8" }}>{br.B.type} · {br.B.spread} pips</div>}
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 18,
                color: i === 0 ? indigo : "#0f172a",
              }}>{br.B.score}</div>
              <Link to={lp(`/review/${br.slug}`)} style={{
                padding: "8px 14px", borderRadius: 8, background: i === 0 ? indigo : "#e2e8f0",
                color: i === 0 ? "#fff" : "#475569", fontWeight: 700, fontSize: 13, textDecoration: "none",
              }}>Review</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Content grid — comparisons + categories */}
      <section style={{ background: "#f8fafc", padding: mob ? "48px 0" : "64px 0", borderTop: "1px solid #e2e8f0" }}>
        <div style={cn}>
          <div style={{
            display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 32,
          }}>
            {/* Comparisons */}
            <div>
              <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, marginBottom: 16 }}>
                Popular Comparisons
              </h3>
              {COMPARISONS.map((c, i) => (
                <Link key={i} to={lp(c.path)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 0", borderBottom: "1px solid #e2e8f0",
                  textDecoration: "none", color: "#0f172a", fontWeight: 600, fontSize: 15,
                }}
                  onMouseEnter={e => e.currentTarget.style.color = indigo}
                  onMouseLeave={e => e.currentTarget.style.color = "#0f172a"}
                >
                  <span>{c.a} vs {c.b}</span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
              ))}
            </div>

            {/* Categories */}
            <div>
              <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, marginBottom: 16 }}>
                Browse by Category
              </h3>
              {RANKINGS.slice(0, 4).map((r, i) => (
                <Link key={i} to={lp(r.path)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 0", borderBottom: "1px solid #e2e8f0",
                  textDecoration: "none", color: "#0f172a", fontWeight: 600, fontSize: 15,
                }}
                  onMouseEnter={e => e.currentTarget.style.color = indigo}
                  onMouseLeave={e => e.currentTarget.style.color = "#0f172a"}
                >
                  <span>{r.title}</span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Countries */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "64px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 24 }}>
          Brokers by Country
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {COUNTRIES.map((c, i) => (
            <Link key={i} to={lp(c.path)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "14px 16px",
              borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0",
              textDecoration: "none", color: "#0f172a",
            }}>
              <CountryFlag code={c.code} size={24} />
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
              <span style={{ fontSize: 12, color: indigo, fontWeight: 700 }}>{c.reg}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
