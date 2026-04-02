/**
 * HOME PROTOTYPE A — "Hub Navigator" (Premium Fintech)
 *
 * Inspired by: Bloomberg Terminal, Morningstar, Wise.com
 * Design: Restrained palette, generous whitespace, sharp typography
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokersWithData } from "../data/brokers";
import HUBS from "../data/categoryHubs";
import { getBrokersForRanking } from "../data/rankingFilters";
import RANKINGS from "../data/rankings";
import BrokerLogo from "../components/BrokerLogo";
import Icon from "../components/Icon";
import { ArrowRight, Shield, ChevronRight } from "lucide-react";

const YEAR = "2026";

const COUNTRIES = [
  { code: "GB", name: "United Kingdom", path: "/best-forex-brokers-uk" },
  { code: "AU", name: "Australia", path: "/best-forex-brokers-australia" },
  { code: "US", name: "United States", path: "/best-forex-brokers-usa" },
  { code: "DE", name: "Germany", path: "/best-forex-brokers-germany" },
  { code: "AE", name: "UAE", path: "/best-forex-brokers-uae" },
  { code: "SG", name: "Singapore", path: "/best-forex-brokers-singapore" },
];

export default function HomeProtoA() {
  const { mob, tab } = useMedia();
  const cn = { maxWidth: 1120, margin: "0 auto", padding: mob ? "0 20px" : "0 32px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top5 = allBrokers.slice(0, 5);

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Reviews & Rankings | RatedBrokers`;
  }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* ═══ HERO ═══ */}
      <section style={{
        background: "#0f172a",
        padding: mob ? "56px 20px 48px" : "80px 32px 64px",
        textAlign: "center",
      }}>
        <div style={cn}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 24,
            textTransform: "uppercase", letterSpacing: 1.5,
          }}>
            <Shield size={12} /> Independent Research
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 34 : tab ? 44 : 56,
            lineHeight: 1.05, color: "#fff", marginBottom: 20,
            letterSpacing: "-0.03em",
          }}>
            Find the Best<br />Online Broker
          </h1>
          <p style={{
            fontSize: mob ? 15 : 17, color: "rgba(255,255,255,0.45)",
            maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7,
            fontWeight: 400,
          }}>
            Compare {allBrokers.length} brokers across forex, stocks, crypto, options, and more.
            Independently researched. Ranked by experts.
          </p>
          {/* Stats Bar */}
          <div style={{
            display: "inline-flex", gap: mob ? 24 : 48, flexWrap: "wrap", justifyContent: "center",
            marginBottom: mob ? 32 : 40,
          }}>
            {[
              { n: allBrokers.length, l: "Brokers" },
              { n: HUBS.length, l: "Categories" },
              { n: RANKINGS.length + "+", l: "Rankings" },
              { n: "130+", l: "Data Points" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'JetBrains Mono'", fontSize: mob ? 24 : 32,
                  fontWeight: 700, color: "#fff", letterSpacing: "-0.02em",
                }}>{s.n}</div>
                <div style={{
                  fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: 1.5, marginTop: 4,
                }}>{s.l}</div>
              </div>
            ))}
          </div>
          {/* Logo Strip */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: mob ? 12 : 20, flexWrap: "wrap", opacity: 0.4,
          }}>
            {allBrokers.slice(0, mob ? 6 : 10).map(b => (
              <div key={b.slug} style={{ width: mob ? 28 : 36, height: mob ? 28 : 36, borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.08)" }}>
                <BrokerLogo broker={b.B} size={mob ? 28 : 36} variant="icon" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORY GRID ═══ */}
      <section style={{ padding: mob ? "40px 20px" : "56px 32px" }}>
        <div style={cn}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8,
          }}>Categories</p>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif", fontWeight: 700,
            fontSize: mob ? 22 : 28, marginBottom: 32, color: "#0f172a",
            letterSpacing: "-0.02em",
          }}>
            What Do You Want to Trade?
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
            gap: mob ? 12 : 16,
          }}>
            {HUBS.map(hub => (
              <Link key={hub.slug} to={hub.path} style={{
                display: "flex", flexDirection: "column",
                padding: mob ? "20px 16px" : "24px 20px",
                background: "#fff", borderRadius: 12,
                border: "1px solid #e8ecf1",
                textDecoration: "none", color: "#0f172a",
                transition: "all 0.2s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 14,
                }}>
                  <Icon name={hub.icon} size={18} style={{ color: "#475569" }} />
                </div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif",
                  fontWeight: 700, fontSize: mob ? 14 : 15, marginBottom: 4, letterSpacing: "-0.01em",
                }}>{hub.name}</div>
                <div style={{ display: "flex", gap: 4, margin: "10px 0 8px" }}>
                  {getBrokersForRanking(hub.featuredIds?.[0] || "forex-overall").slice(0, 3).map(b => (
                    <div key={b.slug} style={{ width: 24, height: 24, borderRadius: 6, overflow: "hidden", border: "1px solid #eef0f4" }}>
                      <BrokerLogo broker={b.B} size={24} variant="icon" />
                    </div>
                  ))}
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, alignSelf: "center", marginLeft: 2 }}>
                    +{getBrokersForRanking(hub.featuredIds?.[0] || "forex-overall").length - 3}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                  {RANKINGS.filter(r => r.category === hub.category || r.vertical === hub.verticalKey).length} rankings
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TOP 5 BROKERS ═══ */}
      <section style={{ padding: mob ? "40px 20px" : "56px 32px", background: "#fafbfc" }}>
        <div style={cn}>
          <div style={{
            background: "#fafbfc", borderRadius: 16,
            border: "1px solid #e8ecf1",
            padding: mob ? "24px 20px" : "32px 28px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <p style={{
                  fontSize: 11, fontWeight: 600, color: "#94a3b8",
                  textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4,
                }}>Rankings</p>
                <h2 style={{
                  fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif",
                  fontWeight: 700, fontSize: mob ? 18 : 22, color: "#0f172a",
                  letterSpacing: "-0.02em",
                }}>
                  Top Rated Brokers
                </h2>
              </div>
              <Link to="/reviews" style={{
                fontSize: 13, fontWeight: 600, color: "#64748b",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
              }}>
                All {allBrokers.length} <ArrowRight size={12} />
              </Link>
            </div>
            {top5.map((b, i) => (
              <Link key={b.slug} to={`/review/${b.slug}`} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 0",
                borderBottom: i < 4 ? "1px solid #eef0f4" : "none",
                textDecoration: "none", color: "#0f172a",
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontWeight: 600,
                  fontSize: 13, color: "#c0c7d0", width: 28,
                  letterSpacing: "-0.02em",
                }}>#{i + 1}</span>
                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: "1px solid #eef0f4" }}>
                  <BrokerLogo broker={b.B} size={44} variant="icon" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>{b.B.name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>{b.B.type} · {b.B.regs.filter(r=>r.tier===1).map(r=>r.name).join(", ")}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 48, height: 4, borderRadius: 2, background: "#e8ecf1" }}>
                    <div style={{ width: `${b.B.score * 10}%`, height: "100%", borderRadius: 2, background: "#0f172a" }} />
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 14, color: "#334155",
                    letterSpacing: "-0.02em", minWidth: 28,
                  }}>{b.B.score}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST SIGNALS ═══ */}
      <section style={{ padding: mob ? "0 20px 40px" : "0 32px 56px" }}>
        <div style={{ ...cn, display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 16 }}>
          {[
            { icon: "shield-check", title: "Independent Research", desc: "No pay-to-play. Rankings based on 130+ data points per broker." },
            { icon: "bar-chart-3", title: "Real Money Testing", desc: "We open accounts, deposit funds, execute trades, and test withdrawals." },
            { icon: "users", title: "Expert Team", desc: "26 financial analysts with CFA, CMT credentials and industry experience." },
          ].map((item, i) => (
            <div key={i} style={{
              background: "#fafbfc", borderRadius: 12,
              padding: mob ? "20px" : "24px",
              border: "1px solid #e8ecf1",
            }}>
              <Icon name={item.icon} size={20} style={{ color: "#64748b", marginBottom: 14, display: "block" }} />
              <div style={{
                fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif",
                fontWeight: 700, fontSize: 14, marginBottom: 6, color: "#0f172a",
                letterSpacing: "-0.01em",
              }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, fontWeight: 400 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ COUNTRIES ═══ */}
      <section style={{ padding: mob ? "0 20px 40px" : "0 32px 56px" }}>
        <div style={cn}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8,
          }}>Regions</p>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif",
            fontWeight: 700, fontSize: mob ? 18 : 22, marginBottom: 20, color: "#0f172a",
            letterSpacing: "-0.02em",
          }}>
            Best Brokers by Country
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12 }}>
            {COUNTRIES.map(c => (
              <Link key={c.code} to={c.path} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                background: "#fafbfc", borderRadius: 10, border: "1px solid #e8ecf1",
                textDecoration: "none", color: "#0f172a", fontSize: 14, fontWeight: 600,
                transition: "border-color 0.15s",
                letterSpacing: "-0.01em",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; }}
              >
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#94a3b8",
                  fontFamily: "'JetBrains Mono'",
                  width: 24, textAlign: "center",
                }}>{c.code}</span>
                {c.name}
                <ChevronRight size={14} style={{ marginLeft: "auto", color: "#c0c7d0" }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ METHODOLOGY CTA ═══ */}
      <section style={{ padding: mob ? "0 20px 48px" : "0 32px 64px" }}>
        <div style={cn}>
          <div style={{
            background: "#0f172a", borderRadius: 16,
            padding: mob ? "28px 20px" : "36px 32px",
            display: mob ? "block" : "flex", alignItems: "center", gap: 32,
          }}>
            <div style={{ flex: 1, marginBottom: mob ? 20 : 0 }}>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif",
                fontWeight: 700, fontSize: mob ? 18 : 22, color: "#fff", marginBottom: 8,
                letterSpacing: "-0.02em",
              }}>
                How We Rate Brokers
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                Every broker is evaluated across 130+ data points. We test with real money — not demos.
              </p>
            </div>
            <Link to="/methodology" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "12px 24px", borderRadius: 10,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 600, textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            >
              Read Methodology <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
