/**
 * HOME PROTOTYPE E — "Magazine / Editorial" (Financial Times aesthetic)
 * Serif headlines, cream background, column layout, pull-quotes
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokersWithData } from "../data/brokers";
import HUBS, { getRankingsForHub } from "../data/categoryHubs";
import BrokerLogo from "../components/BrokerLogo";
import { ArrowRight, ChevronRight } from "lucide-react";

const YEAR = "2026";

const FEATURED = [
  { slug: "ic-markets", label: "Best Overall", text: "IC Markets delivers institutional-grade execution at retail prices. Raw spreads from 0.02 pips, four platforms including TradingView, and dual Tier-1 regulation make it our top choice." },
  { slug: "charles-schwab", label: "Best for Stocks", text: "With $0 commissions, the thinkorswim platform, and 24/5 extended-hours trading, Schwab is the gold standard for US stock investors." },
  { slug: "pepperstone", label: "Best for Beginners", text: "$0 minimum deposit, TradingView integration, and comprehensive education resources make Pepperstone ideal for new traders." },
  { slug: "tastytrade", label: "Best for Options", text: "Purpose-built for derivatives with options capped at $10/leg and $0 to close. The most advanced retail options platform available." },
];

export default function HomeProtoE() {
  const { mob, tab } = useMedia();
  const cn = { maxWidth: 1040, margin: "0 auto", padding: mob ? "0 20px" : "0 32px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);

  useEffect(() => { document.title = `Best Online Brokers ${YEAR} — The Definitive Guide | RatedBrokers`; }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#faf9f7", minHeight: "100vh" }}>

      {/* ═══ NEWSPAPER HERO ═══ */}
      <section style={{ padding: mob ? "36px 20px 28px" : "56px 32px 40px", borderBottom: "2px solid #0f172a" }}>
        <div style={cn}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>
            March 31, {YEAR} · Special Report
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display','Georgia',serif", fontWeight: 400,
            fontSize: mob ? 30 : tab ? 40 : 52,
            lineHeight: 1.1, color: "#0f172a", marginBottom: 16,
          }}>
            The Definitive Guide to<br />Online Brokers in {YEAR}
          </h1>
          <p style={{ fontSize: mob ? 15 : 18, color: "#64748b", lineHeight: 1.75, marginBottom: 20, maxWidth: 600 }}>
            Our research team tested {allBrokers.length} brokers with real money across eight categories.
            Here's what we found.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #d1d5db", paddingTop: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#e8ecf1",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'DM Serif Display',serif", fontSize: 14, color: "#475569",
            }}>MC</div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Marcus Chen</span>
              <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>Senior Analyst · CFA Charterholder</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED ARTICLES — 2 Column ═══ */}
      <section style={{ padding: mob ? "28px 20px" : "48px 32px" }}>
        <div style={{ ...cn, display: mob ? "block" : "grid", gridTemplateColumns: "3fr 2fr", gap: 32 }}>
          {/* Main Article */}
          <div>
            {(() => {
              const b = allBrokers.find(x => x.slug === FEATURED[0].slug);
              if (!b) return null;
              return (
                <Link to={`/review/${b.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <div style={{
                    background: "linear-gradient(135deg, #0f172a, #1e3a5f)", borderRadius: 12,
                    padding: mob ? "24px 18px" : "32px 28px", marginBottom: 16,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden" }}>
                        <BrokerLogo broker={b.B} size={48} variant="icon" />
                      </div>
                      <div>
                        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: 1 }}>{FEATURED[0].label}</div>
                        <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, color: "#fff" }}>{b.B.name}</div>
                      </div>
                      <div style={{
                        marginLeft: "auto", fontFamily: "'JetBrains Mono'", fontSize: 20, fontWeight: 700,
                        color: "#fff", background: "rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: 8,
                      }}>{b.B.score}</div>
                    </div>
                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{FEATURED[0].text}</p>
                  </div>
                </Link>
              );
            })()}
            {/* Pull Quote */}
            <div style={{
              borderLeft: "3px solid #0f172a", paddingLeft: 20, margin: "24px 0",
            }}>
              <p style={{
                fontFamily: "'DM Serif Display','Georgia',serif", fontSize: mob ? 18 : 22,
                color: "#0f172a", lineHeight: 1.5, fontStyle: "italic",
              }}>
                "In an era of zero-commission trading, the real differentiator is execution quality and platform depth."
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>— Marcus Chen, RatedBrokers</p>
            </div>
          </div>
          {/* Side Articles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FEATURED.slice(1).map(f => {
              const b = allBrokers.find(x => x.slug === f.slug);
              if (!b) return null;
              return (
                <Link key={f.slug} to={`/review/${b.slug}`} style={{
                  display: "flex", gap: 12, padding: "14px 0",
                  borderBottom: "1px solid #d1d5db",
                  textDecoration: "none", color: "inherit",
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid #e8ecf1" }}>
                    <BrokerLogo broker={b.B} size={36} variant="icon" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#b91c1c", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 16, color: "#0f172a", lineHeight: 1.3 }}>{b.B.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, lineHeight: 1.5 }}>{f.text.slice(0, 80)}...</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES — Sidebar Style ═══ */}
      <section style={{ padding: mob ? "0 20px 28px" : "0 32px 48px" }}>
        <div style={{ ...cn, display: mob ? "block" : "grid", gridTemplateColumns: "2fr 1fr", gap: 40 }}>
          {/* Left: How We Rate */}
          <div>
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontWeight: 400, fontSize: mob ? 22 : 28, color: "#0f172a", marginBottom: 16 }}>
              How We Rate Brokers
            </h2>
            <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 12 }}>
              Every broker in our database undergoes a rigorous six-category evaluation. We open real accounts,
              deposit real funds, execute trades across multiple sessions, and test withdrawal processes before
              publishing a single score.
            </p>
            <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
              Our methodology weights Regulation & Safety at 25%, recognizing that fund protection is the foundation
              of any trading relationship. Trading Costs (20%) and Expert Evaluation (20%) follow, with Trustpilot
              Score (15%), Platform Quality (10%), and Execution (10%) completing the framework.
            </p>
            <Link to="/methodology" style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Read our full methodology
            </Link>
          </div>
          {/* Right: Category Sidebar */}
          <div style={{ borderLeft: mob ? "none" : "1px solid #d1d5db", paddingLeft: mob ? 0 : 24, marginTop: mob ? 24 : 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Browse by Category</div>
            {HUBS.map((hub, i) => (
              <Link key={hub.slug} to={hub.path} style={{
                display: "flex", justifyContent: "space-between", padding: "10px 0",
                borderBottom: i < HUBS.length - 1 ? "1px solid #e8ecf1" : "none",
                textDecoration: "none", color: "#0f172a",
              }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{hub.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#94a3b8" }}>{getRankingsForHub(hub).length}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COUNTRIES ═══ */}
      <section style={{ padding: mob ? "0 20px 28px" : "0 32px 48px" }}>
        <div style={cn}>
          <h3 style={{ fontFamily: "'DM Serif Display',serif", fontWeight: 400, fontSize: 20, color: "#0f172a", marginBottom: 14 }}>Brokers by Region</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { code: "GB", name: "United Kingdom", path: "/best-forex-brokers-uk" },
              { code: "AU", name: "Australia", path: "/best-forex-brokers-australia" },
              { code: "US", name: "United States", path: "/best-forex-brokers-usa" },
              { code: "DE", name: "Germany", path: "/best-forex-brokers-germany" },
              { code: "SG", name: "Singapore", path: "/best-forex-brokers-singapore" },
              { code: "AE", name: "UAE", path: "/best-forex-brokers-uae" },
            ].map(c => (
              <Link key={c.code} to={c.path} style={{
                padding: "8px 14px", borderRadius: 6, background: "#fff",
                border: "1px solid #d1d5db", textDecoration: "none",
                color: "#0f172a", fontSize: 13, fontWeight: 500,
              }}>{c.name}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
