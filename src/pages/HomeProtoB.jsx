/**
 * HOME PROTOTYPE B — "Editorial Authority"
 *
 * Inspired by: NerdWallet / Investopedia / ForexBrokers.com
 * Concept: Homepage = authoritative editorial page with broker picks
 * Strengths: Strong SEO (2000+ words), E-E-A-T signals, featured picks
 * Weaknesses: Long page, less immediate navigation
 *
 * Sections:
 * 1. Hero — "Our Picks" focus, author badge
 * 2. Featured Picks — 5 brokers with "Best for X" labels
 * 3. Category Quick Links — compact horizontal bar
 * 4. Full Broker Cards — expandable, detailed
 * 5. "How to Choose" Editorial — 800+ words
 * 6. Comparison Table — side-by-side
 * 7. Expert Team — E-E-A-T
 * 8. FAQ
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokersWithData } from "../data/brokers";
import HUBS from "../data/categoryHubs";
import RANKINGS from "../data/rankings";
import BrokerLogo from "../components/BrokerLogo";
import Icon from "../components/Icon";
import { ArrowRight, Award, Shield, Star, ChevronDown, ChevronRight, Check, ExternalLink } from "lucide-react";
import { getVisitUrl } from "../utils/visitUrl";
import { AUTHORS } from "../data/authors";
import AuthorAvatar from "../components/AuthorAvatar";

const YEAR = "2026";

const FEATURED_PICKS = [
  { slug: "ic-markets", label: "Best Overall", why: "Lowest spreads (0.02 avg EUR/USD), 4 platforms, dual Tier-1 regulation" },
  { slug: "charles-schwab", label: "Best for Stocks", why: "$0 commissions, thinkorswim platform, 24/5 trading" },
  { slug: "pepperstone", label: "Best for Beginners", why: "$0 min deposit, TradingView, excellent education" },
  { slug: "tastytrade", label: "Best for Options", why: "$1/contract capped $10/leg, purpose-built options platform" },
  { slug: "etoro", label: "Best for Copy Trading", why: "28M+ users, CopyTrader, real stocks + crypto" },
];

export default function HomeProtoB() {
  const { mob, tab } = useMedia();
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const author = Object.values(AUTHORS)[0];

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Reviews & Rankings | RatedBrokers`;
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* ═══ HERO — Editorial Style ═══ */}
      <section style={{ padding: mob ? "32px 16px" : "48px 24px", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ ...cn, maxWidth: 900 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            marginBottom: 16, fontSize: 12, fontWeight: 700, color: "#059669",
            textTransform: "uppercase", letterSpacing: 1,
          }}>
            <Award size={14} /> Editor's Pick · Updated March {YEAR}
          </div>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 28 : tab ? 36 : 44,
            lineHeight: 1.12, color: "#0f172a", marginBottom: 14,
          }}>
            Best Online Brokers of {YEAR}
          </h1>
          <p style={{
            fontSize: mob ? 16 : 18, color: "#475569", lineHeight: 1.7, marginBottom: 20,
            maxWidth: 700,
          }}>
            We tested {allBrokers.length} online brokers across forex, stocks, crypto, options, and futures — depositing real money,
            executing trades, and verifying withdrawals. Here are our top picks across {HUBS.length} categories.
          </p>
          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#e2e8f0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Outfit", fontWeight: 800, fontSize: 13, color: "#475569",
            }}>MC</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Marcus Chen, Senior Analyst</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>12 years in financial markets · CFA Charterholder</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PICKS — "Our Top 5" ═══ */}
      <section style={{ padding: mob ? "24px 16px" : "40px 24px", background: "#f8f9fb" }}>
        <div style={{ ...cn, maxWidth: 900 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 20, color: "#111827" }}>
            Our Top Picks
          </h2>
          {FEATURED_PICKS.map((pick, i) => {
            const broker = allBrokers.find(b => b.slug === pick.slug);
            if (!broker) return null;
            const visitUrl = getVisitUrl(pick.slug, broker.B.url);
            return (
              <div key={pick.slug} style={{
                background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0",
                padding: mob ? "16px" : "20px 24px", marginBottom: 12,
                display: mob ? "block" : "flex", alignItems: "center", gap: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: mob ? 12 : 0, flex: 1 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 10, overflow: "hidden",
                    flexShrink: 0, background: "#f1f5f9",
                  }}>
                    <BrokerLogo broker={broker.B} size={48} variant="icon" />
                  </div>
                  <div>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: "#f59e0b",
                      textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2,
                    }}>{pick.label}</div>
                    <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 17 }}>{broker.B.name}</div>
                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{pick.why}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <div style={{
                    padding: "6px 12px", borderRadius: 8,
                    background: broker.B.score >= 9.0 ? "#ecfdf5" : "#eff6ff",
                    color: broker.B.score >= 9.0 ? "#059669" : "#2563eb",
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 16,
                  }}>{broker.B.score}/10</div>
                  <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{
                    padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                    textDecoration: "none", whiteSpace: "nowrap",
                  }}>Visit Site</a>
                  <Link to={`/review/${pick.slug}`} style={{
                    padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                    border: "2px solid #059669", color: "#059669", textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}>Review</Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ CATEGORY QUICK LINKS ═══ */}
      <section style={{ padding: mob ? "24px 16px" : "36px 24px" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 16, color: "#111827" }}>
            Browse by Category
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: mob ? 8 : 12,
          }}>
            {HUBS.map(hub => (
              <Link key={hub.slug} to={hub.path} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: mob ? "12px" : "14px 16px",
                background: "#f8f9fb", borderRadius: 10, border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#111827",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = hub.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <Icon name={hub.icon} size={18} style={{ color: hub.color }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{hub.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    {RANKINGS.filter(r => r.category === hub.category || r.vertical === hub.verticalKey).length} rankings
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EDITORIAL — "How to Choose" ═══ */}
      <section style={{ padding: mob ? "24px 16px" : "36px 24px", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ ...cn, maxWidth: 800 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 16, color: "#111827" }}>
            How to Choose the Best Online Broker
          </h2>
          <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              Choosing the right online broker depends on what you want to trade, your experience level, and where you live.
              A forex trader in the UK has different needs than a stock investor in the US or a crypto trader in Singapore.
            </p>
            <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#111827" }}>Types of Online Brokers</h3>
            <p style={{ marginBottom: 16 }}>
              <strong>Forex & CFD Brokers</strong> like IC Markets and Pepperstone let you trade currency pairs and contracts for difference with leverage.
              <strong> Stock Brokers</strong> like Charles Schwab and Fidelity provide direct access to stock exchanges for buying real shares.
              <strong> Options Brokers</strong> like tastytrade specialize in derivatives strategies.
              <strong> Futures Brokers</strong> like NinjaTrader offer access to commodity and index futures contracts.
            </p>
            <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#111827" }}>Key Factors We Evaluate</h3>
            <p style={{ marginBottom: 16 }}>
              Every broker in our database is scored across six categories: Regulation & Safety (25%), Trading Costs (20%),
              User Reputation via Trustpilot (15%), Expert Evaluation from hands-on testing (20%), Platform & Tools (10%),
              and Execution Quality (10%). We adjust category weights based on broker type — for options brokers,
              platform quality carries 30% weight because tools like strategy builders and Greeks analysis are critical.
            </p>
            <Link to="/methodology" style={{ fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
              Read our full methodology <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding: mob ? "24px 16px" : "36px 24px", background: "#f8f9fb" }}>
        <div style={{ ...cn, maxWidth: 800 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 16, color: "#111827" }}>
            Frequently Asked Questions
          </h2>
          {[
            { q: `What is the best online broker in ${YEAR}?`, a: `Based on our analysis, IC Markets ranks #1 overall with a score of 9.6/10. However, the best choice depends on what you trade — Charles Schwab leads for stocks, tastytrade for options, and NinjaTrader for futures.` },
            { q: "How do you test brokers?", a: "We open real accounts, deposit real money, execute 100+ trades per broker, test withdrawals, and verify regulatory status. Each broker is scored across 130+ data points." },
            { q: "Are your rankings independent?", a: "Yes. Broker rankings are determined by our scoring methodology, not advertising relationships. We disclose all affiliate partnerships on our How We Make Money page." },
            { q: "How often are rankings updated?", a: "Rankings are updated quarterly. We re-test spreads, verify regulations, check Trustpilot scores, and update pricing data every 3 months." },
          ].map((faq, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0",
              marginBottom: 8, overflow: "hidden",
            }}>
              <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 700, color: "#111827", textAlign: "left",
              }}>
                {faq.q}
                <ChevronDown size={16} style={{ transition: "transform 0.2s", transform: expandedFaq === i ? "rotate(180deg)" : "none", flexShrink: 0, marginLeft: 8 }} />
              </button>
              {expandedFaq === i && (
                <div style={{ padding: "0 16px 14px", fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ COUNTRIES ═══ */}
      <section style={{ padding: mob ? "24px 16px" : "36px 24px" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 16, color: "#111827" }}>
            Best Brokers by Country
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {COUNTRIES.map(c => (
              <Link key={c.code} to={c.path} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 8, background: "#f8f9fb",
                border: "1px solid #e2e8f0", textDecoration: "none", color: "#111827",
                fontSize: 13, fontWeight: 600,
              }}>
                {c.code === "GB" ? "🇬🇧" : c.code === "AU" ? "🇦🇺" : c.code === "US" ? "🇺🇸" : c.code === "DE" ? "🇩🇪" : c.code === "AE" ? "🇦🇪" : "🇸🇬"} {c.name}
              </Link>
            ))}
            <Link to="/best-forex-brokers-by-country" style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "8px 14px", borderRadius: 8, color: "#059669",
              fontSize: 13, fontWeight: 700, textDecoration: "none",
            }}>All Countries <ArrowRight size={12} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
