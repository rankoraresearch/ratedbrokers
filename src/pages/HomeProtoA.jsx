/**
 * HOME PROTOTYPE A — "Hub Navigator"
 *
 * Inspired by: BrokerChooser (quiz/navigator approach)
 * Concept: Homepage = traffic distributor to hub pages
 * Strengths: Fast engagement, clear paths, low bounce rate
 * Weaknesses: Less editorial content (weaker for head-term SEO)
 *
 * Sections:
 * 1. Hero — centered, clean, stats bar
 * 2. Category Grid — 8 verticals, large clickable cards
 * 3. "Find Your Broker" Quick Picker — 3-step inline quiz
 * 4. Top 5 Brokers — compact list
 * 5. Trust Signals — stats + methodology
 * 6. Countries — 6 flags
 * 7. Footer CTA
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokersWithData } from "../data/brokers";
import HUBS from "../data/categoryHubs";
import RANKINGS from "../data/rankings";
import BrokerLogo from "../components/BrokerLogo";
import Icon from "../components/Icon";
import { ArrowRight, Shield, BarChart3, Users, Globe, ChevronRight, Search } from "lucide-react";

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
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top5 = allBrokers.slice(0, 5);

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Reviews & Rankings | RatedBrokers`;
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* ═══ HERO ═══ */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #134e4a 100%)",
        padding: mob ? "48px 16px 40px" : "72px 24px 56px",
        textAlign: "center",
      }}>
        <div style={cn}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
            fontSize: 12, fontWeight: 700, color: "#34d399", marginBottom: 20,
            textTransform: "uppercase", letterSpacing: 1,
          }}>
            <Shield size={13} /> Independent & Expert-Tested
          </div>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 32 : tab ? 42 : 52,
            lineHeight: 1.08, color: "#fff", marginBottom: 16,
          }}>
            Find the Best<br />Online Broker
          </h1>
          <p style={{
            fontSize: mob ? 16 : 18, color: "rgba(255,255,255,0.65)",
            maxWidth: 560, margin: "0 auto 28px", lineHeight: 1.6,
          }}>
            Compare {allBrokers.length} brokers across forex, stocks, crypto, options, and more.
            Independently researched. Ranked by experts.
          </p>
          {/* Stats Bar */}
          <div style={{
            display: "inline-flex", gap: mob ? 16 : 32, flexWrap: "wrap", justifyContent: "center",
          }}>
            {[
              { n: allBrokers.length, l: "Brokers" },
              { n: HUBS.length, l: "Categories" },
              { n: RANKINGS.length + "+", l: "Rankings" },
              { n: "130+", l: "Data Points" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 22 : 28, fontWeight: 800, color: "#34d399" }}>{s.n}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORY GRID — Main Navigation ═══ */}
      <section style={{ padding: mob ? "32px 16px" : "48px 24px" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 8, color: "#111827", textAlign: "center" }}>
            What Do You Want to Trade?
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", textAlign: "center", marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
            Choose a category to see our expert rankings
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
            gap: mob ? 10 : 14,
          }}>
            {HUBS.map(hub => (
              <Link key={hub.slug} to={hub.path} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: mob ? "20px 12px" : "28px 16px",
                background: "#fff", borderRadius: 14, border: "2px solid #e2e8f0",
                textDecoration: "none", color: "#111827",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = hub.color; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${hub.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  width: mob ? 44 : 52, height: mob ? 44 : 52, borderRadius: 14,
                  background: `${hub.color}12`, display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 12,
                }}>
                  <Icon name={hub.icon} size={mob ? 22 : 26} style={{ color: hub.color }} />
                </div>
                <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 15 : 17, marginBottom: 4 }}>{hub.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                  {RANKINGS.filter(r => r.category === hub.category || r.vertical === hub.verticalKey).length} rankings
                </div>
                <div style={{
                  marginTop: 10, fontSize: 12, fontWeight: 700, color: hub.color,
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  Explore <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TOP 5 BROKERS — Compact List ═══ */}
      <section style={{ padding: mob ? "0 16px 32px" : "0 24px 48px" }}>
        <div style={cn}>
          <div style={{
            background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
            padding: mob ? "20px 16px" : "28px 24px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#111827" }}>
                Top Rated Brokers
              </h2>
              <Link to="/reviews" style={{ fontSize: 13, fontWeight: 700, color: "#059669", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                All {allBrokers.length} <ArrowRight size={12} />
              </Link>
            </div>
            {top5.map((b, i) => (
              <Link key={b.slug} to={`/review/${b.slug}`} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 0", borderBottom: i < 4 ? "1px solid #f1f5f9" : "none",
                textDecoration: "none", color: "#111827",
              }}>
                <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14, color: "#94a3b8", width: 24 }}>#{i + 1}</span>
                <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                  <BrokerLogo broker={b.B} size={36} variant="icon" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{b.B.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{b.B.type}</div>
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: 6,
                  background: b.B.score >= 9.0 ? "#ecfdf5" : "#eff6ff",
                  color: b.B.score >= 9.0 ? "#059669" : "#2563eb",
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14,
                }}>
                  {b.B.score}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST SIGNALS ═══ */}
      <section style={{ padding: mob ? "0 16px 32px" : "0 24px 48px" }}>
        <div style={{ ...cn, display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 14 }}>
          {[
            { icon: "shield-check", color: "#059669", title: "Independent Research", desc: "No pay-to-play. Rankings based on 130+ data points per broker." },
            { icon: "bar-chart-3", color: "#2563eb", title: "Real Money Testing", desc: "We open accounts, deposit funds, execute trades, and test withdrawals." },
            { icon: "users", color: "#7c3aed", title: "Expert Team", desc: "26 financial analysts with CFA, CMT credentials and industry experience." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, padding: mob ? "18px" : "22px", border: "1px solid #e2e8f0" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: `${item.color}10`,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
              }}>
                <Icon name={item.icon} size={20} style={{ color: item.color }} />
              </div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ COUNTRIES ═══ */}
      <section style={{ padding: mob ? "0 16px 32px" : "0 24px 48px" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 16, color: "#111827" }}>
            Best Brokers by Country
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3, 1fr)", gap: 10 }}>
            {COUNTRIES.map(c => (
              <Link key={c.code} to={c.path} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#111827", fontSize: 14, fontWeight: 600,
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <span style={{ fontSize: 20 }}>{c.code === "GB" ? "🇬🇧" : c.code === "AU" ? "🇦🇺" : c.code === "US" ? "🇺🇸" : c.code === "DE" ? "🇩🇪" : c.code === "AE" ? "🇦🇪" : "🇸🇬"}</span>
                {c.name}
                <ChevronRight size={14} style={{ marginLeft: "auto", color: "#94a3b8" }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ METHODOLOGY CTA ═══ */}
      <section style={{ padding: mob ? "0 16px 40px" : "0 24px 56px" }}>
        <div style={cn}>
          <div style={{
            background: "linear-gradient(135deg, #0f172a, #134e4a)", borderRadius: 16,
            padding: mob ? "24px 16px" : "32px 28px",
            display: mob ? "block" : "flex", alignItems: "center", gap: 24,
          }}>
            <div style={{ flex: 1, marginBottom: mob ? 16 : 0 }}>
              <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#fff", marginBottom: 6 }}>
                How We Rate Brokers
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                Every broker is evaluated across 130+ data points. We test with real money — not demos.
              </p>
            </div>
            <Link to="/methodology" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "12px 24px", borderRadius: 10,
              background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
              color: "#34d399", fontSize: 14, fontWeight: 700, textDecoration: "none",
              whiteSpace: "nowrap",
            }}>
              Read Methodology <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
