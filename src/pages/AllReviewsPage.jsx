import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import { getAllBrokers } from "../data/brokers";
import { ArrowRight } from "../components/Icon";
import BrokerLogo from "../components/BrokerLogo";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import HUBS, { getBrokerHub } from "../data/categoryHubs";

const YEAR = "2026";

const FILTER_TABS = [
  { key: "all", label: "All Brokers" },
  { key: "top", label: "Top Rated (9+)" },
  { key: "ecn", label: "ECN / STP" },
  { key: "stocks", label: "Stocks" },
  { key: "crypto", label: "Crypto" },
];

function filterBrokers(brokers, key) {
  switch (key) {
    case "top": return brokers.filter((b) => b.score >= 9);
    case "ecn": return brokers.filter((b) => /ecn|stp/i.test(b.type));
    case "stocks": return brokers.filter((b) => (b.verticals || []).includes("stocks"));
    case "crypto": return brokers.filter((b) => (b.verticals || []).includes("crypto"));
    default: return brokers;
  }
}

function scoreBadgeColor(score) {
  if (score >= 9) return { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" };
  if (score >= 8) return { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };
  return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
}

// Category config derived from HUBS (single source of truth)
const CATEGORIES = HUBS.map(h => ({ key: h.verticalKey || h.category, label: h.name, path: h.path, color: h.color }));

export default function AllReviewsPage() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const [activeFilter, setActiveFilter] = useState("all");

  const allBrokers = getAllBrokers().sort((a, b) => b.score - a.score);
  const filtered = filterBrokers(allBrokers, activeFilter);
  const featured = allBrokers.slice(0, 5);

  useEffect(() => {
    document.title = `Online Broker Reviews ${YEAR} — ${allBrokers.length} Expert-Tested | RatedBrokers`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `Browse ${allBrokers.length} in-depth online broker reviews for ${YEAR}. Forex, stocks, crypto and CFD brokers independently tested across 6 categories. Find the right broker.`);
    window.scrollTo(0, 0);
  }, [allBrokers.length]);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* JSON-LD Breadcrumb + ItemList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        breadcrumbSchema([
          { label: "RatedBrokers", path: "/" },
          { label: "Online Broker Reviews", path: "/reviews" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Online Broker Reviews ${YEAR}`,
          description: `${allBrokers.length} expert-tested broker reviews`,
          numberOfItems: allBrokers.length,
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          itemListElement: allBrokers.slice(0, 20).map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${b.name} Review`,
            url: `https://ratedbrokers.com/reviews/${b.slug}`,
          })),
        },
      ])}} />

      {/* Breadcrumbs */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: "Online Broker Reviews" },
        ]} />
      </div>

      {/* ═══ HERO ═══ */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
        padding: mob ? "40px 16px 48px" : "56px 24px 64px",
        textAlign: "center",
      }}>
        <div style={cn}>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 28 : tab ? 36 : 44,
            lineHeight: 1.1, color: "#fff", marginBottom: 12,
          }}>
            Online Broker Reviews {YEAR}
          </h1>
          <p style={{
            fontSize: mob ? 14 : 16, color: "rgba(255,255,255,0.7)",
            maxWidth: 640, margin: "0 auto", lineHeight: 1.7,
          }}>
            Every broker on RatedBrokers is independently tested by our editorial team across 6 core categories: Trading Costs, Platforms, Safety, Research, Education, and Ease of Use. We do not accept payment for positive reviews.
          </p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
            <div style={{ color: "#34d399", fontSize: 14, fontWeight: 600 }}>{allBrokers.length} Brokers Tested</div>
            <div style={{ color: "rgba(255,255,255,0.5)" }}>•</div>
            <div style={{ color: "#34d399", fontSize: 14, fontWeight: 600 }}>6 Scoring Categories</div>
            <div style={{ color: "rgba(255,255,255,0.5)" }}>•</div>
            <div style={{ color: "#34d399", fontSize: 14, fontWeight: 600 }}>Updated Quarterly</div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED: TOP 5 ═══ */}
      <section style={{ ...cn, padding: mob ? "32px 16px 0" : "48px 24px 0" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, color: "#0f172a", marginBottom: 16 }}>
          Top Rated Brokers
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(5, 1fr)", gap: 12 }}>
          {featured.map((b, i) => {
            const hub = getBrokerHub(b.verticals);
            const badge = scoreBadgeColor(b.score);
            return (
              <Link key={b.slug} to={lp(`/reviews/${b.slug}`)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                padding: "20px 16px", borderRadius: 14,
                background: "#fff", border: `1px solid ${badge.border}`,
                textDecoration: "none", color: "#111827", textAlign: "center",
                transition: "all 0.2s", position: "relative",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = badge.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {i === 0 && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", letterSpacing: 0.5 }}>Editor's Choice</div>}
                <BrokerLogo slug={b.slug} name={b.name} size={48} shape="brand" />
                <div style={{ fontWeight: 700, fontSize: 14 }}>{b.name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{hub.label}</div>
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 16,
                  color: badge.color, background: badge.bg,
                  padding: "4px 12px", borderRadius: 8,
                }}>{b.score}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ BROWSE BY CATEGORY ═══ */}
      <section style={{ ...cn, padding: mob ? "32px 16px 0" : "40px 24px 0" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, color: "#0f172a", marginBottom: 16 }}>
          Browse by Category
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
          {CATEGORIES.map(cat => {
            const count = allBrokers.filter(b => (b.verticals || []).includes(cat.key)).length;
            return (
              <Link key={cat.key} to={lp(cat.path)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: mob ? "12px 14px" : "14px 16px", borderRadius: 12,
                background: "#fff", border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#0f172a", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.background = `${cat.color}08`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${cat.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 14, color: cat.color, fontWeight: 700 }}>{count}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{cat.label}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{count} reviews</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ ALL BROKERS (filterable) ═══ */}
      <section style={{ ...cn, padding: mob ? "32px 16px 0" : "40px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, color: "#0f172a", margin: 0 }}>
            All Broker Reviews
          </h2>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FILTER_TABS.map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{
                padding: "6px 14px", borderRadius: 100, border: "1px solid",
                borderColor: activeFilter === f.key ? "#059669" : "#e2e8f0",
                background: activeFilter === f.key ? "#ecfdf5" : "#fff",
                color: activeFilter === f.key ? "#059669" : "#64748b",
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>{f.label}</button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
          {filtered.length} broker{filtered.length !== 1 ? "s" : ""}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: 10,
        }}>
          {filtered.map((b) => {
            const badge = scoreBadgeColor(b.score);
            const hub = getBrokerHub(b.verticals);
            return (
              <Link key={b.slug} to={lp(`/reviews/${b.slug}`)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 16px", borderRadius: 12,
                background: "#fff", border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#111827", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(5,150,105,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <BrokerLogo slug={b.slug} name={b.name} size={44} shape="brand" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{hub.label} · {b.type}</div>
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14,
                  color: badge.color, background: badge.bg,
                  padding: "4px 8px", borderRadius: 6, flexShrink: 0,
                }}>{b.score}</span>
                <ArrowRight size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ HOW WE TEST ═══ */}
      <section style={{ ...cn, padding: mob ? "40px 16px 60px" : "56px 24px 80px" }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: mob ? "24px 20px" : "32px 28px" }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: 12 }}>
            How We Test Brokers
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", marginBottom: 12 }}>
            Every broker review on RatedBrokers is based on real-money account testing by our editorial team. We open live accounts, deposit funds, execute trades, test withdrawals, and evaluate customer support — all firsthand. No broker can pay for a higher score or a more favorable review.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", marginBottom: 16 }}>
            Our scoring formula evaluates 6 categories: Trading Costs (30%), Platforms & Tools (20%), Safety & Regulation (15%), Research & Education (15%), Ease of Use (15%), and Customer Support (5%). The full methodology — including the exact weights and scoring criteria — is published openly.
          </p>
          <Link to={lp("/methodology")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none",
          }}>
            Read Our Full Methodology <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
