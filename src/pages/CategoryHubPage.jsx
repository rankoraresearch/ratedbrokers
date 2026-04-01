import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getHubBySlug, getRankingsForHub, getFeaturedRankings } from "../data/categoryHubs";
import HUBS from "../data/categoryHubs";
import { getBrokersForRanking } from "../data/rankingFilters";
import BrokerLogo from "../components/BrokerLogo";
import Icon from "../components/Icon";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function CategoryHubPage({ hubSlug }) {
  const mob = useMedia("(max-width:767px)");
  const tab = useMedia("(min-width:768px) and (max-width:1023px)");

  // hubSlug passed as prop from route
  const hub = getHubBySlug(hubSlug);
  if (!hub) return <Navigate to="/rankings" replace />;

  const allRankings = getRankingsForHub(hub);
  const featured = getFeaturedRankings(hub);
  const topBrokers = getBrokersForRanking(allRankings[0]?.id || hub.featuredIds[0]).slice(0, 5);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const YEAR = "2026";

  useEffect(() => {
    document.title = `${hub.title} ${YEAR} — Expert Ranked | RatedBrokers`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = hub.subtitle;
  }, [hub]);

  // Group non-featured rankings by sub
  const grouped = {};
  allRankings.forEach(r => {
    if (hub.featuredIds.includes(r.id)) return;
    const key = r.sub || "other";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  });

  const subLabels = {
    top: "Top Rankings", style: "By Trading Style", costs: "By Cost", execution: "By Execution",
    platform: "By Platform", accounts: "By Account Type", leverage: "By Leverage", bonus: "By Bonus",
    trust: "Trust & Safety", tools: "Tools & Education", payment: "By Payment", regulator: "By Regulator",
    pairs: "By Currency Pair", coins: "By Coin", audience: "By Audience", asset: "By Asset",
    country: "By Country", feature: "By Feature", type: "By Type", mobile: "Mobile Apps",
    tier1: "Tier 1 Markets", tier2: "Tier 2 Markets", tier3: "Other Markets", other: "Other",
  };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* ── Breadcrumbs ── */}
      <div style={{ background: "#fff", padding: mob ? "12px 16px 0" : "16px 24px 0" }}>
        <div style={{ ...cn, fontSize: 13, color: "#64748b", display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Link to="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <span style={{ color: "#111827", fontWeight: 600 }}>{hub.name}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #134e4a 100%)",
        padding: mob ? "32px 16px 36px" : "48px 24px 52px",
      }}>
        <div style={{ ...cn, textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            background: `${hub.color}22`, border: `1px solid ${hub.color}44`,
            fontSize: 13, fontWeight: 600, color: hub.color, marginBottom: 16,
          }}>
            <Icon name={hub.icon} size={14} />
            {allRankings.length} Rankings · {topBrokers.length > 0 ? `${getBrokersForRanking(allRankings[0]?.id).length}+ Brokers` : ""}
          </div>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 28 : tab ? 36 : 44,
            lineHeight: 1.1, color: "#fff", marginBottom: 12,
          }}>
            Best {hub.title} {YEAR}
          </h1>
          <p style={{
            fontSize: mob ? 15 : 17, color: "rgba(255,255,255,0.7)",
            maxWidth: 600, margin: "0 auto", lineHeight: 1.5,
          }}>
            {hub.subtitle}
          </p>
        </div>
      </section>

      {/* ── Featured Rankings ── */}
      <section style={{ padding: mob ? "24px 16px" : "36px 24px" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 16, color: "#111827" }}>
            Featured Rankings
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
            gap: mob ? 10 : 14,
          }}>
            {featured.map(r => (
              <Link key={r.id} to={r.slug} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "#fff", borderRadius: 12, padding: mob ? "14px 14px" : "16px 18px",
                border: "1px solid #e2e8f0", textDecoration: "none", color: "#111827",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = hub.color; e.currentTarget.style.boxShadow = `0 2px 8px ${hub.color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${hub.color}12`, display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon name={r.icon || hub.icon} size={18} style={{ color: hub.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {getBrokersForRanking(r.id).length} brokers ranked
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top 5 Brokers ── */}
      {topBrokers.length > 0 && (
        <section style={{ padding: mob ? "0 16px 24px" : "0 24px 36px" }}>
          <div style={cn}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 16, color: "#111827" }}>
              Top Rated {hub.name}
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(5, 1fr)",
              gap: mob ? 10 : 14,
            }}>
              {topBrokers.map((b, i) => (
                <Link key={b.slug} to={`/review/${b.slug}`}
                  style={{
                    background: "#fff", borderRadius: 12, padding: mob ? "14px" : "16px",
                    border: "1px solid #e2e8f0", textDecoration: "none", color: "#111827",
                    textAlign: "center", transition: "border-color 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, margin: "0 auto 8px",
                    overflow: "hidden", background: "#f1f5f9",
                  }}>
                    <BrokerLogo broker={b.B} size={48} variant="icon" />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{b.B.name}</div>
                  <div style={{
                    display: "inline-block", marginTop: 4, padding: "2px 8px",
                    borderRadius: 6, fontSize: 12, fontWeight: 700,
                    background: b.B.score >= 9.0 ? "#ecfdf5" : "#eff6ff",
                    color: b.B.score >= 9.0 ? "#059669" : "#2563eb",
                  }}>
                    {b.B.score}/10
                  </div>
                  {i === 0 && (
                    <div style={{ fontSize: 10, fontWeight: 700, color: hub.color, marginTop: 4, textTransform: "uppercase" }}>
                      #1 {hub.name.replace(" Brokers", "").replace(" Platforms", "")}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── All Rankings by Sub-category ── */}
      <section style={{ padding: mob ? "0 16px 32px" : "0 24px 48px" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 20, color: "#111827" }}>
            All {hub.name} Rankings
          </h2>
          {Object.entries(grouped).map(([sub, rankings]) => (
            <div key={sub} style={{ marginBottom: 20 }}>
              <h3 style={{
                fontSize: 14, fontWeight: 700, color: "#64748b",
                textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10,
              }}>
                {subLabels[sub] || sub}
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
                gap: mob ? 6 : 8,
              }}>
                {rankings.map(r => (
                  <Link key={r.id} to={r.slug} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: mob ? "10px 12px" : "10px 14px",
                    background: "#fff", borderRadius: 8, border: "1px solid #e8ecf1",
                    textDecoration: "none", color: "#111827", fontSize: 13, fontWeight: 600,
                    transition: "border-color 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = hub.color; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; }}
                  >
                    <Icon name={r.icon || "list"} size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span>
                    <ArrowRight size={12} style={{ color: "#cbd5e1", flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Related Categories ── */}
      <section style={{ padding: mob ? "0 16px 32px" : "0 24px 48px" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 20, marginBottom: 14, color: "#111827" }}>
            Explore Other Categories
          </h2>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
          }}>
            {HUBS.filter(h => h.slug !== hub.slug).map(h => (
              <Link key={h.slug} to={h.path} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 8,
                background: "#fff", border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#111827",
                fontSize: 13, fontWeight: 600,
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = h.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <Icon name={h.icon} size={14} style={{ color: h.color }} />
                {h.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── JSON-LD ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://ratedbrokers.com/" },
          { "@type": "ListItem", position: 2, name: hub.name, item: `https://ratedbrokers.com${hub.path}` },
        ]
      })}} />
    </div>
  );
}
