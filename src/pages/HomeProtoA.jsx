/**
 * HOME PROTOTYPE A — "Hub Navigator" (Premium Fintech)
 *
 * Inspired by: Bloomberg Terminal, Morningstar, Wise.com
 * Design: Restrained palette, generous whitespace, sharp typography
 * Premium: Stripe-level spacing, glass morphism, gradient orbs, circular score badges
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

const VERTICAL_MAP = {
  forex: { label: "Forex", color: "#059669" },
  cfd: { label: "CFD", color: "#2563eb" },
  stocks: { label: "Stocks", color: "#0ea5e9" },
  crypto: { label: "Crypto", color: "#f59e0b" },
  options: { label: "Options", color: "#8b5cf6" },
  futures: { label: "Futures", color: "#ea580c" },
  "copy-trading": { label: "Copy", color: "#7c3aed" },
  "spread-betting": { label: "SB", color: "#dc2626" },
};

const COUNTRIES = [
  { code: "GB", name: "United Kingdom", path: "/best-forex-brokers-uk", verticals: "Forex / CFD / Spread Betting" },
  { code: "AU", name: "Australia", path: "/best-forex-brokers-australia", verticals: "Forex / CFD / Stocks" },
  { code: "US", name: "United States", path: "/best-forex-brokers-usa", verticals: "Stocks / Options / Futures" },
  { code: "DE", name: "Germany", path: "/best-forex-brokers-germany", verticals: "Forex / CFD / Stocks" },
  { code: "AE", name: "UAE", path: "/best-forex-brokers-uae", verticals: "Forex / CFD / Crypto" },
  { code: "SG", name: "Singapore", path: "/best-forex-brokers-singapore", verticals: "Forex / CFD / Stocks" },
];

const POPULAR_RANKINGS = [
  { label: "Best Forex Brokers", path: "/best-forex-brokers" },
  { label: "Best CFD Brokers", path: "/best-cfd-brokers" },
  { label: "Best for Beginners", path: "/best-forex-brokers-for-beginners" },
  { label: "Copy Trading", path: "/best-copy-trading-platforms" },
  { label: "Lowest Spreads", path: "/lowest-spread-forex-brokers" },
  { label: "Best Stock Brokers", path: "/best-stock-brokers" },
  { label: "Best Options Brokers", path: "/best-options-brokers" },
  { label: "Best Futures Brokers", path: "/best-futures-brokers" },
];

export default function HomeProtoA() {
  const { mob, tab } = useMedia();
  const cn = { maxWidth: 1080, margin: "0 auto", padding: mob ? "0 20px" : "0 32px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top5 = allBrokers.slice(0, 5);

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Reviews & Rankings | RatedBrokers`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = `Compare ${allBrokers.length} online brokers in ${YEAR}. Expert reviews, rankings across forex, stocks, crypto, options & futures. 130+ data points per broker.`;
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Best Online Brokers ${YEAR} — Reviews & Rankings`,
      description: meta.content,
      url: "https://ratedbrokers.com/",
      publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
    });
    document.head.appendChild(ld);
    return () => { document.head.removeChild(ld); };
  }, []);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* --- HERO --- */}
      <section style={{
        borderTop: "3px solid #f59e0b",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
        padding: mob ? "64px 20px 56px" : "96px 32px 80px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Diagonal texture overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
        }} />
        {/* Gradient orbs for depth */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* Radial glow */}
        <div style={{
          position: "absolute", top: "-30%", right: "-10%", width: "60%", height: "120%",
          background: "radial-gradient(ellipse, rgba(52,211,153,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ ...cn, position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            fontSize: 11, fontWeight: 600, color: "#34d399", marginBottom: 28,
            textTransform: "uppercase", letterSpacing: 1.5,
          }}>
            <Shield size={12} /> Independent Research
          </div>
          <h1 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 36 : tab ? 48 : 56,
            lineHeight: 1.05, color: "#fff", marginBottom: 24,
            letterSpacing: "-0.04em",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}>
            Find the Best<br />Online Broker
          </h1>
          <p style={{
            fontSize: mob ? 16 : 18, color: "rgba(255,255,255,0.6)",
            maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7,
            fontWeight: 400,
          }}>
            Compare {allBrokers.length} brokers across forex, stocks, crypto, options, and more.
            Independently researched. Ranked by experts.
          </p>
          {/* Stats Bar */}
          <div style={{
            display: "inline-flex", gap: mob ? 32 : 56, flexWrap: "wrap", justifyContent: "center",
            marginBottom: mob ? 36 : 48,
          }}>
            {[
              { n: allBrokers.length, l: "Brokers" },
              { n: HUBS.length, l: "Categories" },
              { n: RANKINGS.length + "+", l: "Rankings" },
              { n: "130+", l: "Data Points" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'JetBrains Mono'", fontSize: mob ? 28 : 36,
                  fontWeight: 700, color: "#fff", letterSpacing: "-0.02em",
                }}>{s.n}</div>
                <div style={{
                  fontSize: 10, color: "#34d399", fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: 1.5, marginTop: 6,
                }}>{s.l}</div>
              </div>
            ))}
          </div>
          {/* Logo Strip */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: mob ? 16 : 20, flexWrap: "wrap",
          }}>
            {allBrokers.slice(0, mob ? 6 : 10).map(b => (
              <div key={b.slug} style={{
                width: mob ? 36 : 40, height: mob ? 36 : 40, borderRadius: 12, overflow: "hidden",
                background: "rgba(255,255,255,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)", opacity: 0.7,
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
                <BrokerLogo broker={b.B} size={mob ? 36 : 40} variant="icon" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORY GRID --- */}
      <section style={{ padding: mob ? "56px 20px" : "88px 32px", background: "linear-gradient(180deg, #fff 0%, #f8fafc 100%)" }}>
        <div style={cn}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10,
          }}>Categories</p>
          <h2 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 24 : 32, marginBottom: 40, color: "#0f172a",
            letterSpacing: "-0.04em",
          }}>
            What Do You Want to Trade?
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
            gap: mob ? 16 : 20,
          }}>
            {HUBS.map(hub => (
              <Link key={hub.slug} to={hub.path} style={{
                display: "flex", flexDirection: "column",
                padding: mob ? "24px 20px" : "28px 24px",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(12px)",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                borderLeft: `3px solid ${hub.color}`,
                textDecoration: "none", color: "#0f172a",
                transition: "all 0.2s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.12), 0 12px 32px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                }}>
                  <Icon name={hub.icon} size={20} style={{ color: "#475569" }} />
                </div>
                <div style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700, fontSize: mob ? 15 : 16, marginBottom: 6, letterSpacing: "-0.02em",
                }}>{hub.name}</div>
                {/* Top 3 broker list */}
                <div style={{ margin: "12px 0 10px" }}>
                  {getBrokersForRanking(hub.featuredIds?.[0] || "forex-overall").slice(0, 3).map((b, i) => (
                    <div key={b.slug} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 7, overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        border: "1px solid rgba(0,0,0,0.04)",
                      }}>
                        <BrokerLogo broker={b.B} size={24} variant="icon" />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, flex: 1, color: "#475569" }}>{b.B.name}</span>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>{b.B.score}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                  {RANKINGS.filter(r => r.category === hub.category || r.vertical === hub.verticalKey).length} rankings
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED BROKER SPOTLIGHT --- */}
      {(() => {
        const featured = allBrokers.find(b => b.slug === "ic-markets");
        if (!featured) return null;
        const visitUrl = (import.meta.env.VITE_API_URL || '') + `/go/${featured.slug}`;
        return (
          <section style={{ padding: mob ? "0 20px 48px" : "0 32px 64px" }}>
            <div style={cn}>
              <div style={{
                background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 50%, #047857 100%)",
                borderRadius: 20, padding: mob ? "28px 24px" : "36px 40px",
                display: mob ? "block" : "flex", alignItems: "center", gap: 32,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
                }} />
                {/* Gradient orb */}
                <div style={{ position: "absolute", top: "-20%", right: "10%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1, position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: 16, overflow: "hidden", flexShrink: 0,
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  }}>
                    <BrokerLogo broker={featured.B} size={72} variant="icon" />
                  </div>
                  <div>
                    <div style={{
                      fontSize: 10, fontWeight: 700, color: "#f59e0b",
                      textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
                    }}>Featured Broker</div>
                    <div style={{
                      fontFamily: "'Outfit',sans-serif", fontWeight: 800,
                      fontSize: mob ? 22 : 28, color: "#fff", letterSpacing: "-0.03em",
                      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}>{featured.B.name}</div>
                    <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Score: <strong style={{ color: "#34d399" }}>{featured.B.score}</strong></span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{featured.B.regs.filter(r=>r.tier===1).map(r=>r.name).join(", ")}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                      {(featured.B.verticals || []).slice(0, 4).map(v => {
                        const vm = VERTICAL_MAP[v];
                        return vm ? (
                          <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: vm.color }} />
                            {vm.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: mob ? 20 : 0, position: "relative", zIndex: 1 }}>
                  <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                    padding: "14px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
                  }}>Visit Broker <ArrowRight size={14} /></a>
                  <Link to={`/review/${featured.slug}`} style={{
                    padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                    border: "2px solid #059669", color: "#059669", textDecoration: "none",
                  }}>Full Review</Link>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* --- POPULAR RANKINGS --- */}
      <section style={{ padding: mob ? "0 20px 48px" : "0 32px 64px" }}>
        <div style={cn}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10,
          }}>Trending</p>
          <h2 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 24 : 32, marginBottom: 24, color: "#0f172a",
            letterSpacing: "-0.04em",
          }}>
            Popular Rankings
          </h2>
          <div style={{
            display: "flex", gap: 12, overflowX: "auto",
            paddingBottom: 8,
            WebkitOverflowScrolling: "touch",
          }}>
            {POPULAR_RANKINGS.map(r => (
              <Link key={r.path} to={r.path} style={{
                flexShrink: 0, padding: "12px 22px", borderRadius: 100,
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                textDecoration: "none", color: "#0f172a",
                fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em",
                whiteSpace: "nowrap", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.7)"; e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)"; e.currentTarget.style.transform = "none"; }}
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- TOP 5 BROKERS --- */}
      <section style={{ padding: mob ? "56px 20px" : "88px 32px", background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)" }}>
        <div style={cn}>
          <div style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
            padding: mob ? "28px 24px" : "36px 32px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <div>
                <p style={{
                  fontSize: 11, fontWeight: 600, color: "#94a3b8",
                  textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
                }}>Rankings</p>
                <h2 style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700, fontSize: mob ? 24 : 32, color: "#0f172a",
                  letterSpacing: "-0.04em",
                }}>
                  Top Rated Brokers
                </h2>
              </div>
              <Link to="/reviews" style={{
                fontSize: 14, fontWeight: 600, color: "#64748b",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
              }}>
                All {allBrokers.length} <ArrowRight size={14} />
              </Link>
            </div>
            {top5.map((b, i) => (
              <Link key={b.slug} to={`/review/${b.slug}`} style={{
                display: "flex", alignItems: "center", gap: mob ? 14 : 20,
                padding: mob ? "16px 0" : "20px 0",
                borderBottom: i < 4 ? "1px solid #eef0f4" : "none",
                textDecoration: "none", color: "#0f172a",
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontWeight: 600,
                  fontSize: 14, color: "#c0c7d0", width: 28,
                  letterSpacing: "-0.02em",
                }}>#{i + 1}</span>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, overflow: "hidden", flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}>
                  <BrokerLogo broker={b.B} size={48} variant="icon" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em" }}>{b.B.name}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 400, marginBottom: 6 }}>{b.B.type} · {b.B.regs.filter(r=>r.tier===1).map(r=>r.name).join(", ")}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(b.B.verticals || []).slice(0, 3).map(v => {
                      const vm = VERTICAL_MAP[v];
                      return vm ? (
                        <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: vm.color }} />
                          {vm.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                {/* Premium circular score badge */}
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: b.B.score >= 9.0 ? "linear-gradient(135deg, #059669, #34d399)" : "#f1f5f9",
                  color: b.B.score >= 9.0 ? "#fff" : "#334155",
                  fontFamily: "'JetBrains Mono'", fontSize: 15, fontWeight: 800,
                  boxShadow: b.B.score >= 9.0 ? "0 4px 12px rgba(5,150,105,0.25)" : "none",
                  flexShrink: 0,
                }}>{b.B.score}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRUST SIGNALS --- */}
      <section style={{ padding: mob ? "0 20px 56px" : "0 32px 88px" }}>
        <div style={{ ...cn, display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 20 }}>
          {[
            { icon: "shield-check", title: "Independent Research", desc: "No pay-to-play. Rankings based on 130+ data points per broker." },
            { icon: "bar-chart-3", title: "Real Money Testing", desc: "We open accounts, deposit funds, execute trades, and test withdrawals." },
            { icon: "users", title: "Expert Team", desc: "26 financial analysts with CFA, CMT credentials and industry experience." },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(12px)",
              borderRadius: 16,
              padding: mob ? "24px" : "32px",
              border: "1px solid rgba(255,255,255,0.8)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
            }}>
              <Icon name={item.icon} size={22} style={{ color: "#64748b", marginBottom: 16, display: "block" }} />
              <div style={{
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 700, fontSize: 16, marginBottom: 8, color: "#0f172a",
                letterSpacing: "-0.02em",
              }}>{item.title}</div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, fontWeight: 400 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- COUNTRIES --- */}
      <section style={{ padding: mob ? "0 20px 56px" : "0 32px 88px" }}>
        <div style={cn}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10,
          }}>Regions</p>
          <h2 style={{
            fontFamily: "'Outfit',sans-serif",
            fontWeight: 700, fontSize: mob ? 24 : 32, marginBottom: 28, color: "#0f172a",
            letterSpacing: "-0.04em",
          }}>
            Best Brokers by Country
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {COUNTRIES.map(c => (
              <Link key={c.code} to={c.path} style={{
                display: "flex", alignItems: "center", gap: 14, padding: mob ? "16px 18px" : "20px 22px",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(12px)",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                textDecoration: "none", color: "#0f172a",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.12), 0 12px 32px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
              >
                <span style={{
                  fontSize: 12, fontWeight: 700, color: "#94a3b8",
                  fontFamily: "'JetBrains Mono'",
                  width: 28, textAlign: "center",
                }}>{c.code}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em" }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400, marginTop: 4 }}>{c.verticals}</div>
                </div>
                <ChevronRight size={16} style={{ color: "#c0c7d0", flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- METHODOLOGY CTA --- */}
      <section style={{ padding: mob ? "0 20px 56px" : "0 32px 80px" }}>
        <div style={cn}>
          <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)", borderRadius: 20,
            padding: mob ? "32px 24px" : "44px 40px",
            display: mob ? "block" : "flex", alignItems: "center", gap: 36,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
            }} />
            {/* Gradient orb */}
            <div style={{ position: "absolute", top: "10%", right: "20%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ flex: 1, marginBottom: mob ? 24 : 0, position: "relative", zIndex: 1 }}>
              <h3 style={{
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 800, fontSize: mob ? 22 : 28, color: "#fff", marginBottom: 12,
                letterSpacing: "-0.03em",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}>
                How We Rate Brokers
              </h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                Every broker is evaluated across 130+ data points. We test with real money — not demos.
              </p>
            </div>
            <Link to="/methodology" className="cta-orange" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 12,
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              whiteSpace: "nowrap", position: "relative", zIndex: 1,
              transition: "all 0.15s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "none"; }}
            >
              Read Methodology <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- RISK DISCLAIMER + AFFILIATE DISCLOSURE --- */}
      <section style={{ padding: mob ? "0 20px 48px" : "0 32px 64px" }}>
        <div style={{ ...cn, maxWidth: 800 }}>
          <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8, textAlign: "center" }}>
            <strong>Affiliate Disclosure:</strong> RatedBrokers may receive compensation from brokers featured on this site.
            This does not influence our rankings or reviews, which are based on independent research.
          </p>
          <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8, textAlign: "center", marginTop: 12 }}>
            <strong>Risk Warning:</strong> CFDs are complex instruments and come with a high risk of losing money rapidly
            due to leverage. Between 74-89% of retail investor accounts lose money when trading CFDs.
            You should consider whether you understand how CFDs work and whether you can afford to take
            the high risk of losing your money.
          </p>
        </div>
      </section>
    </div>
  );
}
