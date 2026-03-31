import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import HUBS, { getRankingsForHub } from "../data/categoryHubs";
import RANKINGS from "../data/rankings";
import { getBrokersForRanking } from "../data/rankingFilters";
import { getAllBrokersWithData } from "../data/brokers";
import Icon from "../components/Icon";
import { ArrowRight, ChevronRight, Shield, BarChart3 } from "lucide-react";

const YEAR = "2026";

// Top rankings across all verticals for "Popular Rankings" section
const POPULAR_IDS = [
  "forex-overall", "forex-beginners", "low-spread", "ecn",
  "cfd", "forex-copy-trading", "spread-betting", "crypto-overall",
];

export default function OnlineBrokersHub() {
  const mob = useMedia("(max-width:767px)");
  const tab = useMedia("(min-width:768px) and (max-width:1023px)");
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  const allBrokers = getAllBrokersWithData();
  const totalRankings = RANKINGS.length;

  useEffect(() => {
    document.title = `Best Online Brokers ${YEAR} — Reviews & Rankings | RatedBrokers`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = `Compare ${allBrokers.length}+ online brokers across forex, CFD, crypto, copy trading and more. Expert reviews, independent rankings. Updated ${YEAR}.`;
  }, []);

  const popularRankings = POPULAR_IDS.map(id => RANKINGS.find(r => r.id === id)).filter(Boolean);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* ── Breadcrumbs ── */}
      <div style={{ background: "#fff", padding: mob ? "12px 16px 0" : "16px 24px 0" }}>
        <div style={{ ...cn, fontSize: 13, color: "#64748b", display: "flex", gap: 6 }}>
          <Link to="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <span style={{ color: "#111827", fontWeight: 600 }}>Online Brokers</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #134e4a 100%)",
        padding: mob ? "36px 16px 40px" : "52px 24px 56px",
      }}>
        <div style={{ ...cn, textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
            fontSize: 13, fontWeight: 600, color: "#34d399", marginBottom: 16,
          }}>
            <Shield size={14} />
            {allBrokers.length} Brokers · {totalRankings}+ Rankings · {HUBS.length} Categories
          </div>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 28 : tab ? 38 : 48,
            lineHeight: 1.1, color: "#fff", marginBottom: 14,
          }}>
            Find the Best Online Broker
          </h1>
          <p style={{
            fontSize: mob ? 15 : 17, color: "rgba(255,255,255,0.7)",
            maxWidth: 640, margin: "0 auto", lineHeight: 1.6,
          }}>
            Compare brokers across forex, CFD, crypto, copy trading, and spread betting.
            Independently researched. Ranked by experts.
          </p>
        </div>
      </section>

      {/* ── Category Cards ── */}
      <section style={{ padding: mob ? "24px 16px" : "40px 24px" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 20, color: "#111827" }}>
            Browse by Category
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
            gap: mob ? 12 : 16,
          }}>
            {HUBS.map(hub => {
              const rankingCount = getRankingsForHub(hub).length;
              const brokerCount = getBrokersForRanking(hub.featuredIds[0] || "forex-overall").length;
              return (
                <Link key={hub.slug} to={hub.path} style={{
                  display: "block", background: "#fff", borderRadius: 14,
                  padding: mob ? "18px 16px" : "22px 20px",
                  border: "1px solid #e2e8f0", textDecoration: "none", color: "#111827",
                  transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = hub.color;
                    e.currentTarget.style.boxShadow = `0 4px 16px ${hub.color}18`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${hub.color}12`, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name={hub.icon} size={22} style={{ color: hub.color }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 18 }}>{hub.name}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 14 }}>
                    {hub.subtitle}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700, color: hub.color,
                        background: `${hub.color}10`, padding: "3px 8px", borderRadius: 6,
                      }}>
                        {rankingCount} rankings
                      </span>
                      <span style={{
                        fontSize: 12, fontWeight: 600, color: "#64748b",
                        background: "#f1f5f9", padding: "3px 8px", borderRadius: 6,
                      }}>
                        {brokerCount}+ brokers
                      </span>
                    </div>
                    <ArrowRight size={16} style={{ color: hub.color }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Popular Rankings ── */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 24px 44px" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 16, color: "#111827" }}>
            Popular Rankings
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
            gap: mob ? 8 : 10,
          }}>
            {popularRankings.map(r => (
              <Link key={r.id} to={r.slug} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#fff", borderRadius: 10, padding: "12px 14px",
                border: "1px solid #e2e8f0", textDecoration: "none", color: "#111827",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <Icon name={r.icon || "list"} size={16} style={{ color: "#059669", flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{r.title}</span>
                <ChevronRight size={14} style={{ color: "#cbd5e1", flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Rate ── */}
      <section style={{ padding: mob ? "0 16px 32px" : "0 24px 48px" }}>
        <div style={cn}>
          <div style={{
            background: "#fff", borderRadius: 14, padding: mob ? "20px 16px" : "28px 24px",
            border: "1px solid #e2e8f0",
            display: mob ? "block" : "flex", alignItems: "center", gap: 24,
          }}>
            <div style={{
              width: mob ? 48 : 56, height: mob ? 48 : 56, borderRadius: 14,
              background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, marginBottom: mob ? 14 : 0,
            }}>
              <BarChart3 size={24} style={{ color: "#059669" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 20, marginBottom: 6 }}>
                How We Rate Brokers
              </h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 12 }}>
                Every broker is evaluated across 130+ data points including regulation, trading costs,
                platform quality, and execution speed. We test with real money, not demos.
              </p>
              <Link to="/methodology" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none",
              }}>
                Read Our Methodology <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── JSON-LD ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://ratedbrokers.com/" },
          { "@type": "ListItem", position: 2, name: "Online Brokers", item: "https://ratedbrokers.com/online-brokers" },
        ]
      })}} />
    </div>
  );
}
