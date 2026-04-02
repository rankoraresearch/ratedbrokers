/**
 * HOME PROTOTYPE B — "Editorial Authority" (Premium Fintech)
 *
 * Inspired by: Morningstar, NerdWallet editorial, StockBrokers.com
 * Design: Clean editorial layout, muted palette, authoritative typography
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokersWithData } from "../data/brokers";
import HUBS from "../data/categoryHubs";
import RANKINGS from "../data/rankings";
import BrokerLogo from "../components/BrokerLogo";
import Icon from "../components/Icon";
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import { getVisitUrl } from "../utils/visitUrl";
import { AUTHORS } from "../data/authors";

const YEAR = "2026";

const COUNTRIES = [
  { code: "GB", name: "United Kingdom", path: "/best-forex-brokers-uk" },
  { code: "AU", name: "Australia", path: "/best-forex-brokers-australia" },
  { code: "US", name: "United States", path: "/best-forex-brokers-usa" },
  { code: "DE", name: "Germany", path: "/best-forex-brokers-germany" },
  { code: "AE", name: "UAE", path: "/best-forex-brokers-uae" },
  { code: "SG", name: "Singapore", path: "/best-forex-brokers-singapore" },
];

const FEATURED_PICKS = [
  { slug: "ic-markets", label: "Best Overall", why: "Lowest spreads (0.02 avg EUR/USD), 4 platforms, dual Tier-1 regulation" },
  { slug: "charles-schwab", label: "Best for Stocks", why: "$0 commissions, thinkorswim platform, 24/5 trading" },
  { slug: "pepperstone", label: "Best for Beginners", why: "$0 min deposit, TradingView, excellent education" },
  { slug: "tastytrade", label: "Best for Options", why: "$1/contract capped $10/leg, purpose-built options platform" },
  { slug: "etoro", label: "Best for Copy Trading", why: "28M+ users, CopyTrader, real stocks + crypto" },
];

export default function HomeProtoB() {
  const { mob, tab } = useMedia();
  const cn = { maxWidth: 1120, margin: "0 auto", padding: mob ? "0 20px" : "0 32px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Reviews & Rankings | RatedBrokers`;
  }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* ═══ HERO — Editorial Style ═══ */}
      <section style={{
        padding: mob ? "40px 20px 36px" : "56px 32px 48px",
        borderBottom: "1px solid #eef0f4",
      }}>
        <div style={{ ...cn, maxWidth: 860 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            marginBottom: 20, fontSize: 11, fontWeight: 600, color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: 1.5,
          }}>
            Editor's Pick · Updated March {YEAR}
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 30 : tab ? 38 : 48,
            lineHeight: 1.08, color: "#0f172a", marginBottom: 16,
            letterSpacing: "-0.03em",
          }}>
            Best Online Brokers of {YEAR}
          </h1>
          <p style={{
            fontSize: mob ? 15 : 17, color: "#64748b", lineHeight: 1.75, marginBottom: 24,
            maxWidth: 640, fontWeight: 400,
          }}>
            We tested {allBrokers.length} online brokers across forex, stocks, crypto, options, and futures — depositing real money,
            executing trades, and verifying withdrawals. Here are our top picks across {HUBS.length} categories.
          </p>
          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: "#f1f5f9",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif", fontWeight: 700, fontSize: 13, color: "#64748b",
              border: "1px solid #e8ecf1",
            }}>MC</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.01em" }}>Marcus Chen, Senior Analyst</div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>12 years in financial markets · CFA Charterholder</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PICKS ═══ */}
      <section style={{ padding: mob ? "32px 20px" : "48px 32px", background: "#fafbfc" }}>
        <div style={{ ...cn, maxWidth: 860 }}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8,
          }}>Our Selections</p>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif",
            fontWeight: 700, fontSize: mob ? 20 : 24, marginBottom: 24, color: "#0f172a",
            letterSpacing: "-0.02em",
          }}>
            Top Picks
          </h2>
          {FEATURED_PICKS.map((pick, i) => {
            const broker = allBrokers.find(b => b.slug === pick.slug);
            if (!broker) return null;
            const visitUrl = getVisitUrl(pick.slug, broker.B.url);
            return (
              <div key={pick.slug} style={{
                background: "#fff", borderRadius: 12, border: "1px solid #e8ecf1",
                padding: mob ? "18px" : "20px 24px", marginBottom: 12,
                display: mob ? "block" : "flex", alignItems: "center", gap: 20,
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#c0c7d0"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: mob ? 14 : 0, flex: 1 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 10, overflow: "hidden",
                    flexShrink: 0, border: "1px solid #eef0f4",
                  }}>
                    <BrokerLogo broker={broker.B} size={48} variant="icon" />
                  </div>
                  <div>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: "#94a3b8",
                      textTransform: "uppercase", letterSpacing: 1, marginBottom: 3,
                    }}>{pick.label}</div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif",
                      fontWeight: 700, fontSize: 16, color: "#0f172a",
                      letterSpacing: "-0.01em",
                    }}>{broker.B.name}</div>
                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 3, fontWeight: 400, lineHeight: 1.5 }}>{pick.why}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <div style={{
                    padding: "6px 12px", borderRadius: 6,
                    background: "#f1f5f9",
                    color: "#334155",
                    fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 15,
                  }}>{broker.B.score}</div>
                  <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{
                    padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                    background: "#0f172a", color: "#fff",
                    textDecoration: "none", whiteSpace: "nowrap",
                    letterSpacing: "-0.01em",
                  }}>Visit Site</a>
                  <Link to={`/review/${pick.slug}`} style={{
                    padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                    border: "1px solid #d1d5db", color: "#475569", textDecoration: "none",
                    whiteSpace: "nowrap",
                    letterSpacing: "-0.01em",
                  }}>Review</Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ CATEGORY QUICK LINKS ═══ */}
      <section style={{ padding: mob ? "32px 20px" : "48px 32px" }}>
        <div style={cn}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8,
          }}>Categories</p>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif",
            fontWeight: 700, fontSize: mob ? 20 : 24, marginBottom: 20, color: "#0f172a",
            letterSpacing: "-0.02em",
          }}>
            Browse by Category
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: mob ? 10 : 12,
          }}>
            {HUBS.map(hub => (
              <Link key={hub.slug} to={hub.path} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: mob ? "14px" : "16px 18px",
                background: "#fafbfc", borderRadius: 10, border: "1px solid #e8ecf1",
                textDecoration: "none", color: "#0f172a",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; }}
              >
                <Icon name={hub.icon} size={16} style={{ color: "#64748b" }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: "-0.01em" }}>{hub.name}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>
                    {RANKINGS.filter(r => r.category === hub.category || r.vertical === hub.verticalKey).length} rankings
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EDITORIAL ═══ */}
      <section style={{ padding: mob ? "0 20px 32px" : "0 32px 48px", borderTop: "1px solid #eef0f4" }}>
        <div style={{ ...cn, maxWidth: 720, paddingTop: mob ? 32 : 48 }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif",
            fontWeight: 700, fontSize: mob ? 20 : 26, marginBottom: 20, color: "#0f172a",
            letterSpacing: "-0.02em",
          }}>
            How to Choose the Best Online Broker
          </h2>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.85, fontWeight: 400 }}>
            <p style={{ marginBottom: 18 }}>
              Choosing the right online broker depends on what you want to trade, your experience level, and where you live.
              A forex trader in the UK has different needs than a stock investor in the US or a crypto trader in Singapore.
            </p>
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif",
              fontWeight: 700, fontSize: 17, marginBottom: 10, color: "#0f172a",
              letterSpacing: "-0.01em",
            }}>Types of Online Brokers</h3>
            <p style={{ marginBottom: 18 }}>
              <strong style={{ fontWeight: 600, color: "#0f172a" }}>Forex & CFD Brokers</strong> like IC Markets and Pepperstone let you trade currency pairs and contracts for difference with leverage.
              <strong style={{ fontWeight: 600, color: "#0f172a" }}> Stock Brokers</strong> like Charles Schwab and Fidelity provide direct access to stock exchanges for buying real shares.
              <strong style={{ fontWeight: 600, color: "#0f172a" }}> Options Brokers</strong> like tastytrade specialize in derivatives strategies.
              <strong style={{ fontWeight: 600, color: "#0f172a" }}> Futures Brokers</strong> like NinjaTrader offer access to commodity and index futures contracts.
            </p>
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif",
              fontWeight: 700, fontSize: 17, marginBottom: 10, color: "#0f172a",
              letterSpacing: "-0.01em",
            }}>Key Factors We Evaluate</h3>
            <p style={{ marginBottom: 18 }}>
              Every broker in our database is scored across six categories: Regulation & Safety (25%), Trading Costs (20%),
              User Reputation via Trustpilot (15%), Expert Evaluation from hands-on testing (20%), Platform & Tools (10%),
              and Execution Quality (10%). We adjust category weights based on broker type — for options brokers,
              platform quality carries 30% weight because tools like strategy builders and Greeks analysis are critical.
            </p>
            <Link to="/methodology" style={{
              fontSize: 14, fontWeight: 600, color: "#475569",
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
              borderBottom: "1px solid #c0c7d0", paddingBottom: 2,
            }}>
              Read our full methodology <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding: mob ? "0 20px 32px" : "0 32px 48px", background: "#fafbfc", paddingTop: mob ? 32 : 48 }}>
        <div style={{ ...cn, maxWidth: 720 }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif",
            fontWeight: 700, fontSize: mob ? 20 : 24, marginBottom: 20, color: "#0f172a",
            letterSpacing: "-0.02em",
          }}>
            Frequently Asked Questions
          </h2>
          {[
            { q: `What is the best online broker in ${YEAR}?`, a: `Based on our analysis, IC Markets ranks #1 overall with a score of 9.6/10. However, the best choice depends on what you trade — Charles Schwab leads for stocks, tastytrade for options, and NinjaTrader for futures.` },
            { q: "How do you test brokers?", a: "We open real accounts, deposit real money, execute 100+ trades per broker, test withdrawals, and verify regulatory status. Each broker is scored across 130+ data points." },
            { q: "Are your rankings independent?", a: "Yes. Broker rankings are determined by our scoring methodology, not advertising relationships. We disclose all affiliate partnerships on our How We Make Money page." },
            { q: "How often are rankings updated?", a: "Rankings are updated quarterly. We re-test spreads, verify regulations, check Trustpilot scores, and update pricing data every 3 months." },
          ].map((faq, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 10, border: "1px solid #e8ecf1",
              marginBottom: 8, overflow: "hidden",
            }}>
              <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 18px", background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Inter',system-ui", fontSize: 14, fontWeight: 600, color: "#0f172a", textAlign: "left",
                letterSpacing: "-0.01em",
              }}>
                {faq.q}
                <ChevronDown size={16} style={{
                  transition: "transform 0.2s",
                  transform: expandedFaq === i ? "rotate(180deg)" : "none",
                  flexShrink: 0, marginLeft: 12, color: "#94a3b8",
                }} />
              </button>
              {expandedFaq === i && (
                <div style={{ padding: "0 18px 16px", fontSize: 14, color: "#64748b", lineHeight: 1.75, fontWeight: 400 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ COUNTRIES ═══ */}
      <section style={{ padding: mob ? "32px 20px" : "48px 32px" }}>
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {COUNTRIES.map(c => (
              <Link key={c.code} to={c.path} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 16px", borderRadius: 8, background: "#fafbfc",
                border: "1px solid #e8ecf1", textDecoration: "none", color: "#0f172a",
                fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; }}
              >
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#94a3b8",
                  fontFamily: "'JetBrains Mono'",
                }}>{c.code}</span>
                {c.name}
              </Link>
            ))}
            <Link to="/best-forex-brokers-by-country" style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "10px 16px", borderRadius: 8, color: "#64748b",
              fontSize: 13, fontWeight: 600, textDecoration: "none",
              letterSpacing: "-0.01em",
            }}>All Countries <ArrowRight size={12} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
