import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { getAllBrokersWithData } from "../data/brokers";
import RANKINGS from "../data/rankings";
import RegBadge from "../components/RegBadge";
import BrokerLogo from "../components/BrokerLogo";
import Icon from "../components/Icon";
import { ArrowRight, Award, Check } from "lucide-react";
import CountryFlag from "../components/CountryFlag";
import { AUTHORS } from "../data/authors";
import AuthorAvatar from "../components/AuthorAvatar";
import HeroWave from "../components/HeroWave";

// ══════════════════════════════════════════════════════
// VARIANT CONFIG — change these to preview layouts
// ══════════════════════════════════════════════════════
const NAV_VARIANT = "B";      // "A" = Compact Grid | "B" = Hero Pills | "C" = Tabbed
const BROKER_VARIANT = "E";   // "A" = Podium+List | "B" = Card Grid | "C" = Editorial | "D" = NerdWallet Rows | "E" = Power Cards | "F" = Leaderboard
// ALL_REVIEWS_VARIANT — now controlled via useState switcher on the page

// ══════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════
const COUNTRIES = [
  { code: "GB", name: "United Kingdom", reg: "FCA", count: 38, path: "/best-forex-brokers-uk", featured: true },
  { code: "AU", name: "Australia", reg: "ASIC", count: 24, path: "/best-forex-brokers-australia" },
  { code: "AE", name: "UAE", reg: "DFSA / VARA", count: 18, path: "/best-forex-brokers-uae" },
  { code: "DE", name: "Germany", reg: "BaFin", count: 22, path: "/best-forex-brokers-germany" },
  { code: "SG", name: "Singapore", reg: "MAS", count: 15, path: "/best-forex-brokers-singapore" },
  { code: "US", name: "United States", reg: "NFA / CFTC", count: 12, path: "/best-forex-brokers-usa" },
];

const COMPARISONS = [
  { a: "IC Markets", b: "Pepperstone", path: "/compare/ic-markets-vs-pepperstone" },
  { a: "IG", b: "CMC Markets", path: "/compare/cmc-markets-vs-ig" },
  { a: "eToro", b: "XTB", path: "/compare/etoro-vs-xtb" },
  { a: "Saxo Bank", b: "OANDA", path: "/compare/oanda-vs-saxo-bank" },
];

const NAV_GRID_ITEMS = [
  { title: "Best Forex Brokers", path: "/best-forex-brokers", icon: "trophy" },
  { title: "Best for Beginners", path: "/best-forex-brokers-for-beginners", icon: "circle" },
  { title: "Best for Scalping", path: "/best-forex-brokers-for-scalping", icon: "crosshair" },
  { title: "Lowest Spreads", path: "/lowest-spread-forex-brokers", icon: "trending-down" },
  { title: "MT4 Brokers", path: "/best-metatrader-4-brokers", icon: "bar-chart-3" },
  { title: "Trading Apps", path: "/best-forex-trading-apps", icon: "smartphone" },
  { title: "Copy Trading", path: "/best-copy-trading-platforms", icon: "handshake" },
  { title: "ECN Brokers", path: "/best-ecn-forex-brokers", icon: "zap" },
  { title: "Crypto Brokers", path: "/best-crypto-brokers", icon: "bitcoin" },
];

const HERO_PILLS = [
  { title: "Best Forex Brokers", path: "/best-forex-brokers", icon: "trophy" },
  { title: "Best for Beginners", path: "/best-forex-brokers-for-beginners", icon: "circle" },
  { title: "Lowest Spreads", path: "/lowest-spread-forex-brokers", icon: "trending-down" },
  { title: "Best for Scalping", path: "/best-forex-brokers-for-scalping", icon: "crosshair" },
  { title: "Best Trading Apps", path: "/best-forex-trading-apps", icon: "smartphone" },
  { title: "ECN Brokers", path: "/best-ecn-forex-brokers", icon: "zap" },
  { title: "Copy Trading", path: "/best-copy-trading-platforms", icon: "handshake" },
  { title: "Crypto Brokers", path: "/best-crypto-brokers", icon: "bitcoin" },
];

const TAB_DATA = [
  {
    key: "style", label: "By Style",
    items: [
      { title: "Beginners", path: "/best-forex-brokers-for-beginners", icon: "circle" },
      { title: "Scalping", path: "/best-forex-brokers-for-scalping", icon: "crosshair" },
      { title: "Day Trading", path: "/best-forex-brokers-for-day-trading", icon: "sun" },
      { title: "Swing Trading", path: "/best-forex-brokers-for-swing-trading", icon: "trending-up" },
      { title: "Hedging", path: "/best-forex-brokers-for-hedging", icon: "shield" },
      { title: "Copy Trading", path: "/best-copy-trading-platforms", icon: "handshake" },
    ],
  },
  {
    key: "platform", label: "By Platform",
    items: [
      { title: "MetaTrader 4", path: "/best-metatrader-4-brokers", icon: "bar-chart-3" },
      { title: "MetaTrader 5", path: "/best-metatrader-5-brokers", icon: "bar-chart-3" },
      { title: "cTrader", path: "/best-ctrader-brokers", icon: "bar-chart-3" },
      { title: "TradingView", path: "/best-tradingview-brokers", icon: "bar-chart-3" },
      { title: "Trading Apps", path: "/best-forex-trading-apps", icon: "smartphone" },
      { title: "Free VPS", path: "/forex-brokers-free-vps", icon: "monitor" },
    ],
  },
  {
    key: "cost", label: "By Cost",
    items: [
      { title: "Lowest Spreads", path: "/lowest-spread-forex-brokers", icon: "trending-down" },
      { title: "Zero Spread", path: "/zero-spread-forex-brokers", icon: "hash" },
      { title: "ECN Brokers", path: "/best-ecn-forex-brokers", icon: "zap" },
      { title: "Low Commission", path: "/lowest-commission-forex-brokers", icon: "dollar-sign" },
      { title: "No Min Deposit", path: "/no-minimum-deposit-forex-brokers", icon: "sprout" },
      { title: "Free Withdrawals", path: "/forex-brokers-free-withdrawals", icon: "wallet" },
    ],
  },
  {
    key: "country", label: "By Country",
    items: [
      { title: "United Kingdom", path: "/best-forex-brokers-uk", icon: "\uD83C\uDDEC\uD83C\uDDE7" },
      { title: "Australia", path: "/best-forex-brokers-australia", icon: "\uD83C\uDDE6\uD83C\uDDFA" },
      { title: "United States", path: "/best-forex-brokers-usa", icon: "\uD83C\uDDFA\uD83C\uDDF8" },
      { title: "Germany", path: "/best-forex-brokers-germany", icon: "\uD83C\uDDE9\uD83C\uDDEA" },
      { title: "Singapore", path: "/best-forex-brokers-singapore", icon: "\uD83C\uDDF8\uD83C\uDDEC" },
      { title: "UAE", path: "/best-forex-brokers-uae", icon: "\uD83C\uDDE6\uD83C\uDDEA" },
    ],
  },
];

// ── Helpers ──
const scoreColor = (s) => s >= 9.0 ? "#059669" : s >= 8.0 ? "#2563eb" : "#d97706";
const scoreLabel = (s) => s >= 9.5 ? "Excellent" : s >= 9.0 ? "Great" : s >= 8.5 ? "Very Good" : "Good";
import { getVisitUrl } from "../utils/visitUrl";

// ══════════════════════════════════════════════════════
// NAV VARIANT A — Compact Grid (3x3)
// ══════════════════════════════════════════════════════
function NavGrid({ mob, tab, lp }) {
  return (
    <section style={{ background: "#f1f5f9", padding: mob ? "32px 16px" : "48px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30,
          textAlign: "center", marginBottom: 8,
        }}>
          Find Your Perfect Broker
        </h2>
        <p style={{ textAlign: "center", fontSize: 15, color: "#1f2937", marginBottom: 28, maxWidth: 500, margin: "0 auto 28px" }}>
          Explore our expert-curated rankings across {RANKINGS.length} categories.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: 12, maxWidth: 800, margin: "0 auto",
        }}>
          {NAV_GRID_ITEMS.map((r, i) => (
            <Link key={i} to={lp(r.path)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "16px 20px", borderRadius: 12,
              background: "#fff", border: "1px solid #e2e8f0",
              textDecoration: "none", color: "#111827",
              transition: "all 0.2s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#059669";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{
                width: 36, height: 36, borderRadius: 8,
                background: "#ecfdf5", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon name={r.icon} size={18} color="#059669" />
              </span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</span>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to={lp("/rankings")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 24px", borderRadius: 10,
            background: "transparent", color: "#059669", fontWeight: 700, fontSize: 15,
            textDecoration: "none", border: "2px solid #059669",
            transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#059669"; }}
          >
            View All {RANKINGS.length} Rankings <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// NAV VARIANT C — Tabbed Navigator
// ══════════════════════════════════════════════════════
function NavTabs({ mob, tab, lp }) {
  const [activeTab, setActiveTab] = useState("style");
  const currentTab = TAB_DATA.find((t) => t.key === activeTab);
  return (
    <section style={{ padding: mob ? "32px 16px" : "48px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30,
          textAlign: "center", marginBottom: 24,
        }}>
          Explore Rankings
        </h2>
        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, justifyContent: "center",
          marginBottom: 24, flexWrap: "wrap",
        }}>
          {TAB_DATA.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: "8px 18px", borderRadius: 100, border: "none", cursor: "pointer",
              background: activeTab === t.key ? "#059669" : "#f1f5f9",
              color: activeTab === t.key ? "#fff" : "#374151",
              fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans',sans-serif",
              transition: "all 0.2s",
            }}>
              {activeTab === t.key && <Check size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />}
              {t.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: 12, maxWidth: 700, margin: "0 auto",
        }}>
          {currentTab?.items.map((item, i) => (
            <Link key={i} to={lp(item.path)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              padding: "18px 12px", borderRadius: 12,
              background: "#fff", border: "1px solid #e2e8f0",
              textDecoration: "none", color: "#111827",
              transition: "all 0.2s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#059669";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Icon name={item.icon} size={22} color="#059669" />
              <span style={{ fontWeight: 700, fontSize: 14, textAlign: "center" }}>{item.title}</span>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to={lp("/rankings")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#059669", fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}>
            View All {RANKINGS.length} Rankings <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// BROKER VARIANT A — Podium (Top 3) + Compact List (#4-10)
// ══════════════════════════════════════════════════════
function BrokerPodium({ mob, tab, lp, brokers }) {
  const top3 = brokers.slice(0, 3);
  const rest = brokers.slice(3, 10);
  return (
    <section style={{ padding: mob ? "32px 16px" : "48px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30,
          textAlign: "center", marginBottom: 8,
        }}>
          Best Forex Brokers 2026
        </h2>
        <p style={{ textAlign: "center", fontSize: 15, color: "#1f2937", marginBottom: 28, maxWidth: 500, margin: "0 auto 28px" }}>
          Ranked by our expert team across 6 scoring categories.
        </p>

        {/* Top 3 Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)",
          gap: 16, marginBottom: 24,
        }}>
          {top3.map((broker, idx) => {
            const b = broker.B;
            const rank = idx + 1;
            const isFirst = rank === 1;
            const visitUrl = getVisitUrl(broker.slug, b.url);
            return (
              <div key={broker.slug} style={{
                position: "relative", background: "#fff",
                border: isFirst ? "2px solid #059669" : "1px solid #e2e8f0",
                borderRadius: 16, padding: mob ? "20px" : "24px",
                boxShadow: isFirst ? "0 4px 20px rgba(5,150,105,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                {isFirst && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "4px 12px", borderRadius: 100,
                    background: "#059669", color: "#fff",
                    fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
                  }}>
                    <Award size={13} /> #1 Editor's Choice
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, marginTop: isFirst ? 8 : 0 }}>
                  <Link to={lp(`/review/${broker.slug}`)} style={{ flexShrink: 0, textDecoration: "none" }}>
                    <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={56} shape="brand" />
                  </Link>
                  <div style={{ flex: 1, minWidth: 0, textAlign: "right" }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 22, color: scoreColor(b.score) }}>{b.score}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: scoreColor(b.score) }}>{scoreLabel(b.score)}</div>
                  </div>
                  {!isFirst && (
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "#1e3a5f", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 12,
                    }}>#{rank}</div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 14, fontSize: 14, color: "#1f2937" }}>
                  <div><span style={{ fontWeight: 700, color: "#111827" }}>{b.spread}</span> pips</div>
                  <div>Min <span style={{ fontWeight: 700, color: "#111827" }}>${b.minDep}</span></div>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
                  {b.regs.slice(0, 3).map((r, ri) => <RegBadge key={ri} reg={r.name} />)}
                </div>
                <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                  display: "block", padding: "12px 0", borderRadius: 10,
                  background: "linear-gradient(135deg,#059669,#34d399)",
                  color: "#fff", fontWeight: 700, fontSize: 15,
                  textAlign: "center", textDecoration: "none", transition: "opacity 0.2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  Visit Broker <ArrowRight size={14} style={{ verticalAlign: "middle", marginLeft: 4 }} />
                </a>
              </div>
            );
          })}
        </div>

        {/* #4-#10 Compact Rows */}
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}>
          {rest.map((broker, idx) => {
            const b = broker.B;
            const rank = idx + 4;
            const visitUrl = getVisitUrl(broker.slug, b.url);
            return (
              <div key={broker.slug} style={{
                display: "flex", alignItems: "center", gap: mob ? 8 : 16,
                padding: mob ? "12px 14px" : "14px 24px",
                borderBottom: idx < rest.length - 1 ? "1px solid #f1f5f9" : "none",
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14,
                  color: "#64748b", width: 28, textAlign: "center", flexShrink: 0,
                }}>#{rank}</span>
                <Link to={lp(`/review/${broker.slug}`)} style={{ flexShrink: 0, textDecoration: "none" }}>
                  <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={44} shape="brand" />
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 15,
                    color: scoreColor(b.score),
                  }}>{b.score}</span>
                </div>
                {!mob && (
                  <>
                    <span style={{ fontSize: 13, color: "#1f2937", width: 80, textAlign: "center" }}>{b.spread} pips</span>
                    <span style={{ fontSize: 13, color: "#1f2937", width: 60, textAlign: "center" }}>${b.minDep}</span>
                  </>
                )}
                <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                  padding: mob ? "6px 12px" : "8px 16px", borderRadius: 8,
                  background: "#ecfdf5", color: "#059669",
                  fontWeight: 700, fontSize: 13, textDecoration: "none",
                  whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#ecfdf5"; e.currentTarget.style.color = "#059669"; }}
                >
                  Visit <ArrowRight size={12} style={{ verticalAlign: "middle" }} />
                </a>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to={lp("/best-forex-brokers")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 24px", borderRadius: 10,
            background: "#1e3a5f", color: "#fff", fontWeight: 700, fontSize: 15,
            textDecoration: "none", transition: "opacity 0.2s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            See Full Ranking <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// BROKER VARIANT B — Card Grid (3 large + 7 mini)
// ══════════════════════════════════════════════════════
function BrokerCardGrid({ mob, tab, lp, brokers }) {
  const top3 = brokers.slice(0, 3);
  const rest = brokers.slice(3, 10);
  return (
    <section style={{ padding: mob ? "32px 16px" : "48px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30,
          textAlign: "center", marginBottom: 8,
        }}>
          Top Rated Brokers 2026
        </h2>
        <p style={{ textAlign: "center", fontSize: 15, color: "#1f2937", marginBottom: 28, maxWidth: 500, margin: "0 auto 28px" }}>
          Our highest-scoring brokers based on independent expert analysis.
        </p>

        {/* Top 3 Large Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)",
          gap: 16, marginBottom: 16,
        }}>
          {top3.map((broker, idx) => {
            const b = broker.B;
            const rank = idx + 1;
            const isFirst = rank === 1;
            const visitUrl = getVisitUrl(broker.slug, b.url);
            return (
              <div key={broker.slug} style={{
                position: "relative", background: "#fff",
                border: isFirst ? "2px solid #059669" : "1px solid #e2e8f0",
                borderRadius: 16, padding: "20px", textAlign: "center",
                boxShadow: isFirst ? "0 4px 20px rgba(5,150,105,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                {isFirst && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    padding: "4px 14px", borderRadius: 100,
                    background: "#059669", color: "#fff",
                    fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                  }}>
                    FEATURED
                  </div>
                )}
                <div style={{
                  position: "absolute", top: 12, right: 12,
                  width: 24, height: 24, borderRadius: "50%",
                  background: isFirst ? "#059669" : "#1e3a5f", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 11,
                }}>#{rank}</div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, marginTop: isFirst ? 8 : 0 }}>
                  <Link to={lp(`/review/${broker.slug}`)} style={{ textDecoration: "none" }}>
                    <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={56} shape="brand" />
                  </Link>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 22, color: scoreColor(b.score) }}>{b.score}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: scoreColor(b.score), marginLeft: 4 }}>{scoreLabel(b.score)}</span>
                </div>
                <div style={{ fontSize: 14, color: "#1f2937", marginBottom: 14 }}>{b.spread} pips</div>
                <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                  display: "block", padding: "10px 0", borderRadius: 10,
                  background: "linear-gradient(135deg,#059669,#34d399)",
                  color: "#fff", fontWeight: 700, fontSize: 14,
                  textDecoration: "none", transition: "opacity 0.2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  Visit Broker <ArrowRight size={13} style={{ verticalAlign: "middle" }} />
                </a>
              </div>
            );
          })}
        </div>

        {/* #4-#10 Mini Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
          gap: 12,
        }}>
          {rest.map((broker, idx) => {
            const b = broker.B;
            const rank = idx + 4;
            const visitUrl = getVisitUrl(broker.slug, b.url);
            return (
              <div key={broker.slug} style={{
                background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
                padding: "16px", textAlign: "center",
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", marginBottom: 8, fontFamily: "'JetBrains Mono'" }}>#{rank}</div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                  <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={40} shape="icon" />
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 16, color: scoreColor(b.score), marginBottom: 10 }}>{b.score}</div>
                <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                  display: "block", padding: "7px 0", borderRadius: 8,
                  background: "#ecfdf5", color: "#059669",
                  fontWeight: 700, fontSize: 12, textDecoration: "none",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#ecfdf5"; e.currentTarget.style.color = "#059669"; }}
                >
                  Visit
                </a>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to={lp("/best-forex-brokers")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#059669", fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}>
            Compare All Brokers <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// BROKER VARIANT C — Editorial Table
// ══════════════════════════════════════════════════════
function BrokerEditorial({ mob, tab, lp, brokers }) {
  const featured = brokers[0];
  const rest = brokers.slice(1, 10);
  const fb = featured.B;
  const featuredUrl = getVisitUrl(featured.slug, fb.url);
  return (
    <section style={{ padding: mob ? "32px 16px" : "48px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30,
          textAlign: "center", marginBottom: 8,
        }}>
          Our Top Picks &mdash; March 2026
        </h2>
        <p style={{ textAlign: "center", fontSize: 15, color: "#1f2937", marginBottom: 28, maxWidth: 500, margin: "0 auto 28px" }}>
          Handpicked by our editorial team after exhaustive research and analysis.
        </p>

        {/* #1 Featured Card */}
        <div style={{
          background: "#fff", border: "2px solid #059669", borderRadius: 16,
          padding: mob ? "20px" : "28px 32px", marginBottom: 20,
          boxShadow: "0 4px 20px rgba(5,150,105,0.1)",
        }}>
          <div style={{
            display: "inline-block", padding: "4px 12px", borderRadius: 6,
            background: "#059669", color: "#fff", fontSize: 11, fontWeight: 700,
            marginBottom: 16,
          }}>
            EDITOR'S CHOICE
          </div>
          <div style={{
            display: "flex", flexDirection: mob ? "column" : "row",
            gap: mob ? 16 : 24, alignItems: mob ? "flex-start" : "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
              <Link to={lp(`/review/${featured.slug}`)} style={{ flexShrink: 0, textDecoration: "none" }}>
                <BrokerLogo slug={featured.slug} name={fb.name} fallback={fb.logo} size={60} shape="brand" />
              </Link>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 24, color: scoreColor(fb.score) }}>{fb.score}/10</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: scoreColor(fb.score) }}>{scoreLabel(fb.score)}</span>
                </div>
                <div style={{ fontSize: 14, color: "#1f2937", marginBottom: 6 }}>
                  {fb.type} &middot; {fb.spread} pips &middot; ${fb.minDep} min &middot; {fb.regs.slice(0, 2).map(r => r.name).join(", ")}
                </div>
                {fb.promo && (
                  <div style={{ fontSize: 14, color: "#111827", fontStyle: "italic" }}>
                    &ldquo;{fb.promo}&rdquo;
                  </div>
                )}
              </div>
            </div>
            <a href={featuredUrl} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: "12px 28px", borderRadius: 10,
              background: "linear-gradient(135deg,#059669,#34d399)",
              color: "#fff", fontWeight: 700, fontSize: 15,
              textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
              transition: "opacity 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              Open Account <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
            </a>
          </div>
        </div>

        {/* #2-#10 Table */}
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}>
          {/* Table Header (desktop only) */}
          {!mob && (
            <div style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "10px 24px", background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5,
            }}>
              <span style={{ width: 40 }}>Rank</span>
              <span style={{ flex: 1 }}>Broker</span>
              <span style={{ width: 60, textAlign: "center" }}>Score</span>
              <span style={{ width: 80, textAlign: "center" }}>Spread</span>
              <span style={{ width: 60, textAlign: "center" }}>Min</span>
              <span style={{ width: 100 }}></span>
            </div>
          )}
          {rest.map((broker, idx) => {
            const b = broker.B;
            const rank = idx + 2;
            const visitUrl = getVisitUrl(broker.slug, b.url);
            return (
              <div key={broker.slug} style={{
                display: "flex", alignItems: "center", gap: mob ? 8 : 16,
                padding: mob ? "12px 14px" : "14px 24px",
                borderBottom: idx < rest.length - 1 ? "1px solid #f1f5f9" : "none",
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14,
                  color: "#64748b", width: mob ? 24 : 40, textAlign: "center", flexShrink: 0,
                }}>#{rank}</span>
                <Link to={lp(`/review/${broker.slug}`)} style={{ flexShrink: 0, textDecoration: "none" }}>
                  <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={44} shape="brand" />
                </Link>
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 15,
                    color: scoreColor(b.score),
                  }}>{b.score}</span>
                </div>
                {!mob && (
                  <>
                    <span style={{ fontSize: 13, color: "#1f2937", width: 80, textAlign: "center" }}>{b.spread} pips</span>
                    <span style={{ fontSize: 13, color: "#1f2937", width: 60, textAlign: "center" }}>${b.minDep}</span>
                  </>
                )}
                <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                  padding: mob ? "6px 12px" : "8px 16px", borderRadius: 8,
                  background: "#ecfdf5", color: "#059669",
                  fontWeight: 700, fontSize: 13, textDecoration: "none",
                  whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#ecfdf5"; e.currentTarget.style.color = "#059669"; }}
                >
                  Visit <ArrowRight size={12} style={{ verticalAlign: "middle" }} />
                </a>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to={lp("/best-forex-brokers")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#059669", fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}>
            See Full Ranking ({brokers.length} brokers) <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// BROKER VARIANT D — NerdWallet Rows (Top 5, horizontal)
// ══════════════════════════════════════════════════════
function BrokerNerdwallet({ mob, tab, lp, brokers }) {
  const top5 = brokers.slice(0, 5);
  return (
    <section style={{ padding: mob ? "32px 16px" : "48px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30,
          textAlign: "center", marginBottom: 8,
        }}>
          Best Forex Brokers 2026
        </h2>
        <p style={{ textAlign: "center", fontSize: 15, color: "#1f2937", marginBottom: 28, maxWidth: 500, margin: "0 auto 28px" }}>
          Ranked by our expert team across 6 scoring categories.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {top5.map((broker, idx) => {
            const b = broker.B;
            const rank = idx + 1;
            const isFirst = rank === 1;
            const visitUrl = getVisitUrl(broker.slug, b.url);
            return (
              <div key={broker.slug} style={{
                position: "relative",
                display: mob ? "block" : "flex",
                alignItems: "center", gap: 20,
                padding: mob ? "20px 16px" : "20px 28px",
                background: isFirst ? "#f0fdf4" : "#fff",
                borderLeft: isFirst ? "4px solid #059669" : "4px solid transparent",
                borderBottom: idx < 4 ? "1px solid #e2e8f0" : "none",
                borderRadius: idx === 0 ? "16px 16px 0 0" : idx === 4 ? "0 0 16px 16px" : 0,
                border: isFirst
                  ? "1px solid #a7f3d0"
                  : "1px solid #e2e8f0",
                borderBottomColor: idx < 4 ? "#e2e8f0" : undefined,
                marginBottom: isFirst ? 0 : 0,
                transition: "box-shadow 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(5,150,105,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Mobile layout */}
                {mob ? (
                  <>
                    {/* Row 1: Rank + Logo + Name + Score */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: isFirst ? "#059669" : "#1e3a5f", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 13, flexShrink: 0,
                      }}>#{rank}</span>
                      <Link to={lp(`/review/${broker.slug}`)} style={{ flexShrink: 0, textDecoration: "none" }}>
                        <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={44} shape="brand" />
                      </Link>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {isFirst && (
                          <span style={{
                            display: "inline-block", padding: "2px 8px", borderRadius: 4,
                            background: "#059669", color: "#fff", fontSize: 10, fontWeight: 700, marginBottom: 4,
                          }}>EDITOR'S CHOICE</span>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 18, color: scoreColor(b.score) }}>{b.score}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: scoreColor(b.score) }}>{scoreLabel(b.score)}</div>
                      </div>
                    </div>
                    {/* Row 2: Metrics + Regs */}
                    <div style={{ display: "flex", gap: 12, marginBottom: 12, fontSize: 13, color: "#374151" }}>
                      <span><strong>{b.spread}</strong> pips</span>
                      <span>Min <strong>${b.minDep}</strong></span>
                      <span style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                        {b.regs.slice(0, 2).map((r, ri) => <RegBadge key={ri} reg={r.name} />)}
                      </span>
                    </div>
                    {/* Row 3: Full-width CTA */}
                    <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                      display: "block", padding: "12px 0", borderRadius: 10,
                      background: "linear-gradient(135deg,#059669,#34d399)",
                      color: "#fff", fontWeight: 700, fontSize: 15,
                      textAlign: "center", textDecoration: "none", transition: "opacity 0.2s",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    >
                      Visit Broker <ArrowRight size={14} style={{ verticalAlign: "middle", marginLeft: 4 }} />
                    </a>
                  </>
                ) : (
                  /* Desktop layout */
                  <>
                    {/* Rank */}
                    <span style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: isFirst ? "#059669" : "#1e3a5f", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 13, flexShrink: 0,
                    }}>#{rank}</span>

                    {/* Logo */}
                    <Link to={lp(`/review/${broker.slug}`)} style={{ flexShrink: 0, textDecoration: "none" }}>
                      <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={48} shape="brand" />
                    </Link>

                    {/* Name + Review link */}
                    <div style={{ width: 160, flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {isFirst && (
                          <span style={{
                            display: "inline-block", padding: "2px 8px", borderRadius: 4,
                            background: "#059669", color: "#fff", fontSize: 10, fontWeight: 700,
                          }}>EDITOR'S CHOICE</span>
                        )}
                      </div>
                      <Link to={lp(`/review/${broker.slug}`)} style={{
                        fontSize: 13, color: "#059669", fontWeight: 600, textDecoration: "none",
                      }}>
                        Read Review <ArrowRight size={11} style={{ verticalAlign: "middle" }} />
                      </Link>
                    </div>

                    {/* Score */}
                    <div style={{ width: 70, textAlign: "center", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 18, color: scoreColor(b.score) }}>{b.score}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: scoreColor(b.score) }}>{scoreLabel(b.score)}</div>
                    </div>

                    {/* Spread */}
                    <div style={{ width: 80, textAlign: "center", flexShrink: 0, fontSize: 14, color: "#374151" }}>
                      <div style={{ fontWeight: 700, color: "#111827" }}>{b.spread} pips</div>
                    </div>

                    {/* Min Deposit */}
                    <div style={{ width: 70, textAlign: "center", flexShrink: 0, fontSize: 14, color: "#374151" }}>
                      <div style={{ fontWeight: 700, color: "#111827" }}>${b.minDep}</div>
                    </div>

                    {/* Regs */}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", width: 120, flexShrink: 0 }}>
                      {b.regs.slice(0, 3).map((r, ri) => <RegBadge key={ri} reg={r.name} />)}
                    </div>

                    {/* CTA */}
                    <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                      padding: "10px 20px", borderRadius: 10,
                      background: "linear-gradient(135deg,#059669,#34d399)",
                      color: "#fff", fontWeight: 700, fontSize: 14,
                      textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                      transition: "opacity 0.2s", minWidth: 140, textAlign: "center",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    >
                      Visit Broker <ArrowRight size={13} style={{ verticalAlign: "middle", marginLeft: 2 }} />
                    </a>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to={lp("/best-forex-brokers")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 24px", borderRadius: 10,
            background: "#1e3a5f", color: "#fff", fontWeight: 700, fontSize: 15,
            textDecoration: "none", transition: "opacity 0.2s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            See All {brokers.length} Brokers <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// BROKER VARIANT E — Compact Power Cards (Top 5, vertical)
// ══════════════════════════════════════════════════════
function BrokerPowerCards({ mob, tab, lp, brokers }) {
  const top5 = brokers.slice(0, 5);
  return (
    <section style={{ padding: mob ? "32px 16px" : "48px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30,
          textAlign: "center", marginBottom: 8,
        }}>
          Best Forex Brokers 2026
        </h2>
        <p style={{ textAlign: "center", fontSize: 15, color: "#1f2937", marginBottom: 28, maxWidth: 500, margin: "0 auto 28px" }}>
          5 highest-scored brokers from our expert research.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
          gap: 12,
        }}>
          {top5.map((broker, idx) => {
            const b = broker.B;
            const rank = idx + 1;
            const isFirst = rank === 1;
            const visitUrl = getVisitUrl(broker.slug, b.url);
            return (
              <div key={broker.slug} style={{
                position: "relative", background: "#fff",
                border: isFirst ? "2px solid #059669" : "1px solid #e2e8f0",
                borderRadius: 16, padding: "20px 16px", textAlign: "center",
                boxShadow: isFirst ? "0 4px 20px rgba(5,150,105,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex", flexDirection: "column", alignItems: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isFirst ? "0 4px 20px rgba(5,150,105,0.1)" : "0 1px 4px rgba(0,0,0,0.04)";
                }}
              >
                {/* Editor's Choice ribbon for #1 */}
                {isFirst && (
                  <div style={{
                    position: "absolute", top: -1, left: -1, right: -1,
                    padding: "5px 0", borderRadius: "16px 16px 0 0",
                    background: "#059669", color: "#fff",
                    fontSize: 10, fontWeight: 700, textAlign: "center", letterSpacing: 0.5,
                  }}>
                    <Award size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
                    EDITOR'S CHOICE
                  </div>
                )}

                {/* Rank badge */}
                <div style={{
                  position: "absolute", top: isFirst ? 30 : 10, right: 10,
                  width: 24, height: 24, borderRadius: "50%",
                  background: "#1e3a5f", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 11,
                }}>#{rank}</div>

                {/* Logo */}
                <div style={{ marginTop: isFirst ? 28 : 8, marginBottom: 12 }}>
                  <Link to={lp(`/review/${broker.slug}`)} style={{ textDecoration: "none" }}>
                    <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={48} shape="icon" />
                  </Link>
                </div>

                {/* Name */}
                <Link to={lp(`/review/${broker.slug}`)} style={{
                  fontSize: 14, fontWeight: 700, color: "#111827",
                  textDecoration: "none", marginBottom: 6,
                }}>
                  {b.name}
                </Link>

                {/* Score */}
                <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 24, color: scoreColor(b.score), lineHeight: 1 }}>
                  {b.score}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: scoreColor(b.score), marginBottom: 12 }}>
                  {scoreLabel(b.score)}
                </div>

                {/* Metrics */}
                <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: "#111827" }}>{b.spread}</span> pips
                </div>
                <div style={{ fontSize: 13, color: "#374151", marginBottom: 12 }}>
                  Min <span style={{ fontWeight: 700, color: "#111827" }}>${b.minDep}</span>
                </div>

                {/* Regs */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", marginBottom: 14 }}>
                  {b.regs.slice(0, 2).map((r, ri) => <RegBadge key={ri} reg={r.name} />)}
                </div>

                {/* CTA — pushes to bottom via margin-top auto */}
                <div style={{ marginTop: "auto", width: "100%" }}>
                  <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                    display: "block", padding: "10px 0", borderRadius: 10,
                    background: "linear-gradient(135deg,#059669,#34d399)",
                    color: "#fff", fontWeight: 700, fontSize: 14,
                    textAlign: "center", textDecoration: "none", transition: "opacity 0.2s",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    Visit Broker
                  </a>
                  <Link to={lp(`/review/${broker.slug}`)} style={{
                    display: "block", marginTop: 8, fontSize: 12, fontWeight: 600,
                    color: "#059669", textDecoration: "none", textAlign: "center",
                  }}>
                    Read Review <ArrowRight size={11} style={{ verticalAlign: "middle" }} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to={lp("/best-forex-brokers")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 24px", borderRadius: 10,
            background: "#1e3a5f", color: "#fff", fontWeight: 700, fontSize: 15,
            textDecoration: "none", transition: "opacity 0.2s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            See All {brokers.length} Brokers <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// BROKER VARIANT F — Leaderboard Table (Top 10, dense)
// ══════════════════════════════════════════════════════
function BrokerLeaderboard({ mob, tab, lp, brokers }) {
  const top10 = brokers.slice(0, 10);
  return (
    <section style={{ padding: mob ? "32px 16px" : "48px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30,
          textAlign: "center", marginBottom: 8,
        }}>
          Best Forex Brokers 2026
        </h2>
        <p style={{ textAlign: "center", fontSize: 15, color: "#1f2937", marginBottom: 28, maxWidth: 500, margin: "0 auto 28px" }}>
          10 highest-scored brokers. Updated March 2026.
        </p>

        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}>
          {/* Header row — desktop only */}
          {!mob && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "50px 1fr 70px 80px 70px 80px 110px",
              alignItems: "center", gap: 8,
              padding: "10px 20px", background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5,
            }}>
              <span>#</span>
              <span>Broker</span>
              <span style={{ textAlign: "center" }}>Score</span>
              <span style={{ textAlign: "center" }}>Spread</span>
              <span style={{ textAlign: "center" }}>Min</span>
              <span>Regs</span>
              <span></span>
            </div>
          )}

          {top10.map((broker, idx) => {
            const b = broker.B;
            const rank = idx + 1;
            const isFirst = rank === 1;
            const visitUrl = getVisitUrl(broker.slug, b.url);

            if (mob) {
              /* Mobile: compact row */
              return (
                <div key={broker.slug} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 14px",
                  background: isFirst ? "#f0fdf4" : "transparent",
                  borderLeft: isFirst ? "3px solid #059669" : "3px solid transparent",
                  borderBottom: idx < 9 ? "1px solid #f1f5f9" : "none",
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 13,
                    color: isFirst ? "#059669" : "#64748b", width: 24, textAlign: "center", flexShrink: 0,
                  }}>
                    {isFirst ? "★" : rank}
                  </span>
                  <Link to={lp(`/review/${broker.slug}`)} style={{ flexShrink: 0, textDecoration: "none" }}>
                    <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={28} shape="icon" />
                  </Link>
                  <Link to={lp(`/review/${broker.slug}`)} style={{
                    flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: "#111827",
                    textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {b.name}
                  </Link>
                  <span style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 15,
                    color: scoreColor(b.score), flexShrink: 0,
                  }}>{b.score}</span>
                  <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                    padding: "6px 14px", borderRadius: 8,
                    background: "linear-gradient(135deg,#059669,#34d399)",
                    color: "#fff", fontWeight: 700, fontSize: 12,
                    textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                    transition: "opacity 0.2s",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    Visit <ArrowRight size={11} style={{ verticalAlign: "middle" }} />
                  </a>
                </div>
              );
            }

            /* Desktop: grid row */
            return (
              <div key={broker.slug} style={{
                display: "grid",
                gridTemplateColumns: "50px 1fr 70px 80px 70px 80px 110px",
                alignItems: "center", gap: 8,
                padding: "12px 20px",
                background: isFirst ? "#f0fdf4" : "transparent",
                borderLeft: isFirst ? "3px solid #059669" : "3px solid transparent",
                borderBottom: idx < 9 ? "1px solid #f1f5f9" : "none",
                transition: "background 0.15s",
              }}
                onMouseEnter={(e) => {
                  if (!isFirst) e.currentTarget.style.background = "#fafffe";
                }}
                onMouseLeave={(e) => {
                  if (!isFirst) e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Rank */}
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14,
                  color: isFirst ? "#059669" : "#64748b",
                }}>
                  {isFirst ? "1 ★" : rank}
                </span>

                {/* Broker: icon + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <Link to={lp(`/review/${broker.slug}`)} style={{ flexShrink: 0, textDecoration: "none" }}>
                    <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={32} shape="icon" />
                  </Link>
                  <Link to={lp(`/review/${broker.slug}`)} style={{
                    fontSize: 14, fontWeight: 700, color: "#111827", textDecoration: "none",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {b.name}
                  </Link>
                </div>

                {/* Score */}
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 15,
                  color: scoreColor(b.score), textAlign: "center",
                }}>{b.score}</span>

                {/* Spread */}
                <span style={{ fontSize: 13, color: "#374151", textAlign: "center" }}>{b.spread} pips</span>

                {/* Min deposit */}
                <span style={{ fontSize: 13, color: "#374151", textAlign: "center" }}>${b.minDep}</span>

                {/* Regs — main one */}
                <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>
                  {b.regs.slice(0, 1).map(r => r.name).join(", ")}
                </span>

                {/* Visit CTA */}
                <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4,
                  padding: "8px 16px", borderRadius: 8,
                  background: "linear-gradient(135deg,#059669,#34d399)",
                  color: "#fff", fontWeight: 700, fontSize: 13,
                  textDecoration: "none", whiteSpace: "nowrap",
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  Visit <ArrowRight size={12} />
                </a>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to={lp("/best-forex-brokers")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 24px", borderRadius: 10,
            background: "#1e3a5f", color: "#fff", fontWeight: 700, fontSize: 15,
            textDecoration: "none", transition: "opacity 0.2s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            See Full Ranking — {brokers.length} Brokers <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════
export default function Home() {
  const { mob, tab } = useMedia();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  const allBrokersData = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const [allRevVar, setAllRevVar] = useState("A");
  const top10 = allBrokersData.slice(0, 10);

  useEffect(() => {
    document.title = "RatedBrokers \u2014 Forex Broker Reviews & Rankings (2026)";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `RatedBrokers is an independent broker comparison platform. We analyze ${allBrokersData.length} forex brokers across 130+ data points. Expert reviews, rankings by category, and side-by-side comparisons.`);
    const schemas = [
      { "@context": "https://schema.org", "@type": "WebSite", name: "RatedBrokers", url: "https://ratedbrokers.com" },
      { "@context": "https://schema.org", "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com", logo: "https://ratedbrokers.com/logo.png" },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "RatedBrokers", item: "https://ratedbrokers.com/" }] },
    ];
    let scriptEl = document.querySelector('script[data-jsonld="home"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-jsonld", "home");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemas);
    return () => { const el = document.querySelector('script[data-jsonld="home"]'); if (el) el.remove(); };
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* ===== HERO ===== */}
      {NAV_VARIANT === "B" ? (
        /* Variant B: Hero with integrated pill navigation */
        <section style={{
          position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #0f172a 0%, #1a365d 50%, #134e4a 100%)",
          backgroundImage: [
            "radial-gradient(ellipse 600px 400px at 15% 60%, rgba(52,211,153,0.12) 0%, transparent 70%)",
            "radial-gradient(ellipse 500px 350px at 85% 25%, rgba(59,130,246,0.09) 0%, transparent 70%)",
            "radial-gradient(ellipse 300px 300px at 50% 90%, rgba(16,185,129,0.07) 0%, transparent 70%)",
            "linear-gradient(135deg, #0f172a 0%, #1a365d 50%, #134e4a 100%)",
          ].join(", "),
          padding: mob ? "36px 16px 0" : "52px 24px 0",
        }}>
          <div style={{
            ...cn,
            display: mob ? "block" : "flex",
            alignItems: "center", gap: 48,
          }}>
            {/* Left: Text */}
            <div style={{ flex: 1, marginBottom: mob ? 28 : 0 }}>
              <div style={{
                display: "inline-block", padding: "6px 16px", borderRadius: 100,
                background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
                fontSize: 13, fontWeight: 600, color: "#34d399", marginBottom: 20, letterSpacing: 0.5,
              }}>
                {t("home.updated")}
              </div>
              <h1 style={{
                fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 28 : tab ? 36 : 44,
                lineHeight: 1.1, color: "#fff", marginBottom: 12,
              }}>
                {t("home.heroTitle1")}
              </h1>
              <p style={{ fontSize: mob ? 15 : 17, color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 20, lineHeight: 1.5 }}>
                Independently researched. {allBrokersData.length} brokers ranked.
              </p>
              <div style={{ display: "flex", gap: mob ? 16 : 28, flexWrap: "wrap" }}>
                {[
                  [String(allBrokersData.length), t("home.stat.brokers")],
                  ["130+", t("home.stat.trades")],
                  ["96h", t("home.stat.research")],
                  ["Q1 2026", t("home.stat.update")],
                ].map(([val, label], i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: mob ? 17 : 20, color: "#fff" }}>{val}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Pill Navigation */}
            <div style={{
              display: "grid",
              gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
              gap: 8, flexShrink: 0,
              width: mob ? "100%" : tab ? 340 : 400,
            }}>
              {HERO_PILLS.map((pill, i) => (
                <Link key={i} to={lp(pill.path)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 16px", borderRadius: 10,
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                  textDecoration: "none", color: "#fff",
                  fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.borderColor = "rgba(52,211,153,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  }}
                >
                  <Check size={14} color="#34d399" style={{ flexShrink: 0 }} />
                  {pill.title}
                </Link>
              ))}
            </div>
          </div>
          <HeroWave color="#f8f9fb" height={mob ? 32 : 48} />
        </section>
      ) : (
        /* Variants A & C: Compact standalone hero */
        <section style={{
          position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #0f172a 0%, #1a365d 50%, #134e4a 100%)",
          backgroundImage: [
            "radial-gradient(ellipse 600px 400px at 15% 60%, rgba(52,211,153,0.12) 0%, transparent 70%)",
            "radial-gradient(ellipse 500px 350px at 85% 25%, rgba(59,130,246,0.09) 0%, transparent 70%)",
            "linear-gradient(135deg, #0f172a 0%, #1a365d 50%, #134e4a 100%)",
          ].join(", "),
          padding: mob ? "32px 16px 0" : "40px 24px 0",
          textAlign: "center",
        }}>
          <div style={{ ...cn }}>
            <div style={{
              display: "inline-block", padding: "6px 16px", borderRadius: 100,
              background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
              fontSize: 13, fontWeight: 600, color: "#34d399", marginBottom: 16, letterSpacing: 0.5,
            }}>
              {t("home.updated")}
            </div>
            <h1 style={{
              fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 26 : tab ? 36 : 44,
              lineHeight: 1.1, color: "#fff", marginBottom: 10,
            }}>
              {t("home.heroTitle1")}
            </h1>
            <p style={{
              fontSize: mob ? 15 : 17, color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 20,
            }}>
              {t("home.heroSubtitle")}
            </p>
            <div style={{ display: "flex", gap: mob ? 12 : 24, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                [String(allBrokersData.length), t("home.stat.brokers")],
                ["500+", t("home.stat.trades")],
                ["96h", t("home.stat.research")],
                ["Q1 2026", t("home.stat.update")],
              ].map(([val, label], i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: mob ? 17 : 20, color: "#fff" }}>{val}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <HeroWave color="#f8f9fb" height={mob ? 32 : 48} />
        </section>
      )}

      {/* ===== NAV BLOCK (Variants A & C only, B is in hero) ===== */}
      {NAV_VARIANT === "A" && <NavGrid mob={mob} tab={tab} lp={lp} />}
      {NAV_VARIANT === "C" && <NavTabs mob={mob} tab={tab} lp={lp} />}

      {/* ===== BROKER SHOWCASE ===== */}
      {BROKER_VARIANT === "A" && <BrokerPodium mob={mob} tab={tab} lp={lp} brokers={top10} />}
      {BROKER_VARIANT === "B" && <BrokerCardGrid mob={mob} tab={tab} lp={lp} brokers={top10} />}
      {BROKER_VARIANT === "C" && <BrokerEditorial mob={mob} tab={tab} lp={lp} brokers={allBrokersData} />}
      {BROKER_VARIANT === "D" && <BrokerNerdwallet mob={mob} tab={tab} lp={lp} brokers={allBrokersData} />}
      {BROKER_VARIANT === "E" && <BrokerPowerCards mob={mob} tab={tab} lp={lp} brokers={allBrokersData} />}
      {BROKER_VARIANT === "F" && <BrokerLeaderboard mob={mob} tab={tab} lp={lp} brokers={allBrokersData} />}

      {/* ===== BROWSE BY COUNTRY ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, textAlign: "center", marginBottom: 8 }}>
          {t("home.countryTitle")}
        </h2>
        <p style={{ textAlign: "center", fontSize: 16, color: "#1f2937", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
          {t("home.countryDesc")}
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: 16,
        }}>
          {COUNTRIES.map((c, i) => (
            <Link key={i} to={lp(c.path)} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: mob ? "16px" : "20px 24px", borderRadius: 14,
              background: "#fff", border: c.featured ? "2px solid #059669" : "1px solid #e2e8f0",
              textDecoration: "none", color: "#111827",
              boxShadow: c.featured ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
              transition: "all 0.2s", position: "relative",
            }}>
              {c.featured && (
                <span style={{
                  position: "absolute", top: -10, right: 16,
                  padding: "3px 10px", borderRadius: 6,
                  background: "#059669", color: "#fff",
                  fontSize: 11, fontWeight: 700,
                }}>{t("home.mostPopular")}</span>
              )}
              <CountryFlag code={c.code} size={mob ? 32 : 38} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 15 : 17 }}>{c.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span style={{
                    padding: "2px 8px", borderRadius: 4,
                    background: "#ecfdf5", color: "#059669",
                    fontSize: 12, fontWeight: 700,
                  }}>{c.reg}</span>
                  <span style={{ fontSize: 14, color: "#1f2937" }}>{c.count} {t("home.brokers")}</span>
                </div>
              </div>
              <ArrowRight size={18} color="#64748b" />
            </Link>
          ))}
        </div>
      </section>

      {/* ===== ALL BROKER REVIEWS — VARIANT SWITCHER ===== */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: mob ? "24px 16px 0" : "32px 24px 0" }}>
        {[
          { id: "A", label: "Dark Cards" },
          { id: "B", label: "Glass Navy" },
          { id: "C", label: "Ticker Wall" },
          { id: "D", label: "Reveal Grid" },
        ].map((v) => (
          <button key={v.id} onClick={() => setAllRevVar(v.id)} style={{
            padding: mob ? "6px 12px" : "8px 16px", borderRadius: 8,
            border: allRevVar === v.id ? "2px solid #059669" : "2px solid #e2e8f0",
            background: allRevVar === v.id ? "#059669" : "#fff",
            color: allRevVar === v.id ? "#fff" : "#334155",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: mob ? 12 : 13, cursor: "pointer",
            transition: "all 0.15s",
          }}>{v.id}. {v.label}</button>
        ))}
      </div>

      {allRevVar === "A" && (
      /* ─── Variant A: Dark Cards 6-col ─── */
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, textAlign: "center", marginBottom: 8 }}>{t("home.allTitle")}</h2>
        <p style={{ textAlign: "center", fontSize: 16, color: "#1f2937", marginBottom: mob ? 24 : 36, maxWidth: 500, margin: "0 auto" }}>{t("home.allDesc", { count: allBrokersData.length })}</p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(3, 1fr)" : tab ? "repeat(4, 1fr)" : "repeat(6, 1fr)", gap: mob ? 10 : 16 }}>
          {allBrokersData.map((b) => (
            <Link key={b.slug} to={lp(`/review/${b.slug}`)} style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", transition: "transform 0.25s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px) scale(1.03)"; const c = e.currentTarget.querySelector("[data-lc]"); if (c) { c.style.boxShadow = "0 8px 24px rgba(15,23,42,0.35)"; c.style.borderColor = "#34d399"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; const c = e.currentTarget.querySelector("[data-lc]"); if (c) { c.style.boxShadow = "0 2px 8px rgba(15,23,42,0.15)"; c.style.borderColor = "transparent"; } }}
            >
              <div data-lc style={{ width: "100%", aspectRatio: "16/9", borderRadius: mob ? 8 : 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", border: "2px solid transparent", boxShadow: "0 2px 8px rgba(15,23,42,0.15)", transition: "box-shadow 0.25s ease, border-color 0.25s ease", marginBottom: mob ? 6 : 8 }}>
                <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${b.slug}.svg`} alt={b.B.name} loading="lazy" onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} style={{ width: "70%", height: "55%", objectFit: "contain" }} />
                <span style={{ display: "none", alignItems: "center", justifyContent: "center", fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 9 : 11, color: "#94a3b8" }}>{b.B.name}</span>
              </div>
              <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: mob ? 10 : 12, color: "#334155", textAlign: "center", lineHeight: 1.2, maxWidth: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.B.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 10 : 11, fontWeight: 800, color: scoreColor(b.B.score), marginTop: 1 }}>{b.B.score}</span>
            </Link>
          ))}
        </div>
      </section>
      )}

      {allRevVar === "B" && (
      /* ─── Variant B: Glass Navy — полная тёмная секция, glass-карточки, зелёное свечение ─── */
      <section style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)", padding: mob ? "48px 16px" : "64px 24px" }}>
        <div style={{ ...cn }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, textAlign: "center", marginBottom: 8, color: "#f8fafc" }}>{t("home.allTitle")}</h2>
          <p style={{ textAlign: "center", fontSize: 15, color: "#94a3b8", marginBottom: mob ? 28 : 40, maxWidth: 500, margin: "0 auto" }}>{t("home.allDesc", { count: allBrokersData.length })}</p>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(2, 1fr)" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: mob ? 12 : 16 }}>
            {allBrokersData.map((b) => (
              <Link key={b.slug} to={lp(`/review/${b.slug}`)} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: mob ? "16px 10px 12px" : "20px 14px 14px", borderRadius: 14,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)", textDecoration: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(52,211,153,0.4)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(52,211,153,0.12), 0 8px 32px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ width: "100%", height: mob ? 36 : 44, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: mob ? 10 : 12 }}>
                  <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${b.slug}.svg`} alt={b.B.name} loading="lazy" onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }} style={{ maxWidth: "75%", maxHeight: "100%", objectFit: "contain" }} />
                  <span style={{ display: "none", fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 13 : 15, color: "#e2e8f0" }}>{b.B.name}</span>
                </div>
                <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: mob ? 12 : 13, color: "#cbd5e1", textAlign: "center", marginBottom: 4 }}>{b.B.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 13 : 14, fontWeight: 800, color: "#34d399" }}>{b.B.score}</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>{scoreLabel(b.B.score)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {allRevVar === "C" && (
      /* ─── Variant C: Ticker Wall — компактные горизонтальные пилы с dark лого, плотный грид ─── */
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, textAlign: "center", marginBottom: 8 }}>{t("home.allTitle")}</h2>
        <p style={{ textAlign: "center", fontSize: 16, color: "#1f2937", marginBottom: mob ? 24 : 36, maxWidth: 500, margin: "0 auto" }}>{t("home.allDesc", { count: allBrokersData.length })}</p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: mob ? 6 : 8 }}>
          {allBrokersData.map((b) => (
            <Link key={b.slug} to={lp(`/review/${b.slug}`)} style={{
              display: "flex", alignItems: "center", gap: mob ? 8 : 10,
              padding: mob ? "6px 8px" : "8px 12px", borderRadius: 8,
              background: "#0f172a", textDecoration: "none",
              transition: "all 0.2s ease",
              border: "1px solid #1e293b",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1e293b";
                e.currentTarget.style.borderColor = "#34d399";
                e.currentTarget.style.transform = "translateX(3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0f172a";
                e.currentTarget.style.borderColor = "#1e293b";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{ width: mob ? 48 : 60, height: mob ? 24 : 28, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${b.slug}.svg`} alt={b.B.name} loading="lazy" onError={(e) => { e.target.style.display = "none"; }} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
              <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: mob ? 11 : 13, color: "#e2e8f0", flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.B.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 10 : 11, fontWeight: 800, color: "#34d399", flexShrink: 0 }}>{b.B.score}</span>
            </Link>
          ))}
        </div>
      </section>
      )}

      {allRevVar === "D" && (
      /* ─── Variant D: Reveal Grid — карточки расширяются при hover, показывая скор и стрелку ─── */
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, textAlign: "center", marginBottom: 8 }}>{t("home.allTitle")}</h2>
        <p style={{ textAlign: "center", fontSize: 16, color: "#1f2937", marginBottom: mob ? 24 : 36, maxWidth: 500, margin: "0 auto" }}>{t("home.allDesc", { count: allBrokersData.length })}</p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(3, 1fr)" : tab ? "repeat(4, 1fr)" : "repeat(6, 1fr)", gap: mob ? 8 : 12 }}>
          {allBrokersData.map((b) => (
            <Link key={b.slug} to={lp(`/review/${b.slug}`)} style={{ textDecoration: "none", display: "block" }}
              onMouseEnter={(e) => {
                const ov = e.currentTarget.querySelector("[data-ov]");
                if (ov) ov.style.opacity = "1";
                e.currentTarget.querySelector("[data-lc2]").style.transform = "scale(1.05)";
                e.currentTarget.querySelector("[data-lc2]").style.boxShadow = "0 8px 24px rgba(15,23,42,0.4)";
              }}
              onMouseLeave={(e) => {
                const ov = e.currentTarget.querySelector("[data-ov]");
                if (ov) ov.style.opacity = "0";
                e.currentTarget.querySelector("[data-lc2]").style.transform = "scale(1)";
                e.currentTarget.querySelector("[data-lc2]").style.boxShadow = "0 2px 8px rgba(15,23,42,0.15)";
              }}
            >
              <div data-lc2 style={{
                width: "100%", aspectRatio: "16/10", borderRadius: mob ? 8 : 10,
                overflow: "hidden", position: "relative", background: "#0f172a",
                boxShadow: "0 2px 8px rgba(15,23,42,0.15)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${b.slug}.svg`} alt={b.B.name} loading="lazy" onError={(e) => { e.target.style.display = "none"; }} style={{ width: "65%", height: "50%", objectFit: "contain", transition: "opacity 0.3s" }} />
                {/* Hover overlay */}
                <div data-ov style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, rgba(15,23,42,0) 30%, rgba(5,150,105,0.85) 100%)",
                  display: "flex", flexDirection: "column", justifyContent: "flex-end",
                  padding: mob ? "6px 8px" : "10px 12px",
                  opacity: 0, transition: "opacity 0.3s ease",
                }}>
                  <span style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: mob ? 10 : 12, color: "#fff", lineHeight: 1.2 }}>{b.B.name}</span>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 11 : 13, fontWeight: 800, color: "#fff" }}>{b.B.score}</span>
                    <ArrowRight size={mob ? 12 : 14} color="#fff" />
                  </div>
                </div>
              </div>
              {/* Name below card always visible */}
              <div style={{ textAlign: "center", marginTop: mob ? 5 : 6 }}>
                <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: mob ? 10 : 11, color: "#475569" }}>{b.B.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* ===== COMPARISONS ===== */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "60px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 30, textAlign: "center", marginBottom: 32 }}>
          {t("home.compTitle")}
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 16,
        }}>
          {COMPARISONS.map((c, i) => (
            <Link key={i} to={lp(c.path)} style={{
              padding: mob ? "20px" : "24px", borderRadius: 14,
              background: "#fff", border: "1px solid #e2e8f0",
              textAlign: "center", textDecoration: "none", color: "#111827",
              transition: "all 0.2s",
            }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{c.a}</div>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", margin: "0 auto 8px",
                background: "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 12, color: "#fff",
              }}>VS</div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{c.b}</div>
              <span style={{
                padding: "6px 14px", borderRadius: 6,
                background: "#f1f5f9", color: "#2563eb",
                fontSize: 13, fontWeight: 700,
              }}>{t("home.compare")}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== ABOUT / METHODOLOGY (compact) ===== */}
      <section style={{ ...cn, padding: mob ? "32px 16px" : "48px 24px" }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: mob ? "24px 20px" : "32px 40px",
          border: "1px solid #e2e8f0", textAlign: "center",
        }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 12 }}>
            {t("home.aboutTitle")}
          </h2>
          <p style={{
            fontSize: 15, color: "#1f2937", lineHeight: 1.7, maxWidth: 680,
            margin: "0 auto 20px",
          }}>
            {t("home.aboutText")}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={lp("/methodology")} style={{
              padding: "10px 22px", borderRadius: 10,
              background: "#1e3a5f", color: "#fff",
              fontWeight: 700, fontSize: 15, textDecoration: "none",
            }}>{t("home.aboutMethodology")}</Link>
            <Link to={lp("/about")} style={{
              padding: "10px 22px", borderRadius: 10,
              background: "#f1f5f9", color: "#1f2937",
              fontWeight: 600, fontSize: 15, textDecoration: "none",
            }}>{t("home.aboutLearnMore")}</Link>
          </div>
        </div>
      </section>

      {/* ===== OUR EXPERTS ===== */}
      <section style={{ ...cn, padding: mob ? "0 16px 40px" : "0 24px 60px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 8 }}>
          Our Expert Team
        </h2>
        <p style={{ textAlign: "center", fontSize: 15, color: "#1f2937", marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
          Every review is written, peer-reviewed, and fact-checked by certified industry professionals.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 12,
        }}>
          {Object.values(AUTHORS).map((a) => (
            <Link key={a.id} to={lp(`/author/${a.id}`)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              padding: mob ? "20px 12px" : "24px 16px", borderRadius: 14,
              background: "#fff", border: "1px solid #e2e8f0",
              textDecoration: "none", color: "#111827", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#a7f3d0";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(5,150,105,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <AuthorAvatar author={a} size={mob ? 48 : 56} showVerified />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 13 : 15 }}>{a.name}</div>
                <div style={{ fontSize: 13, color: "#1f2937", marginTop: 2 }}>{a.role}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#059669" }}>View Profile &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
