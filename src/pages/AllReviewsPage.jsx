import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import { getAllBrokers } from "../data/brokers";
import { ArrowRight } from "../components/Icon";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import HUBS from "../data/categoryHubs";

const YEAR = "2026";
const scoreColor = (s) => s >= 9.0 ? "#059669" : s >= 8.0 ? "#2563eb" : "#d97706";

// Filter tabs: "All" + all 8 verticals from HUBS + utility filters
const FILTER_TABS = [
  { key: "all", label: "All Brokers" },
  ...HUBS.map(h => ({ key: h.verticalKey || h.category, label: h.name })),
  { key: "top", label: "Top Rated (9+)" },
  { key: "ecn", label: "ECN / STP" },
];

function filterBrokers(brokers, key) {
  switch (key) {
    case "top": return brokers.filter((b) => b.score >= 9);
    case "ecn": return brokers.filter((b) => /ecn|stp/i.test(b.type));
    case "all": return brokers;
    default: return brokers.filter((b) => (b.verticals || []).includes(key));
  }
}

export default function AllReviewsPage() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const [activeFilter, setActiveFilter] = useState("all");

  const allBrokers = getAllBrokers().sort((a, b) => b.score - a.score);
  const filtered = filterBrokers(allBrokers, activeFilter);

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
            Every broker on RatedBrokers is independently tested by our editorial team across 6 core categories. We do not accept payment for positive reviews.
          </p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
            <div style={{ color: "#34d399", fontSize: 14, fontWeight: 600 }}>{allBrokers.length} Brokers Tested</div>
            <div style={{ color: "rgba(255,255,255,0.5)" }}>·</div>
            <div style={{ color: "#34d399", fontSize: 14, fontWeight: 600 }}>6 Scoring Categories</div>
            <div style={{ color: "rgba(255,255,255,0.5)" }}>·</div>
            <div style={{ color: "#34d399", fontSize: 14, fontWeight: 600 }}>Updated Quarterly</div>
          </div>
        </div>
      </section>

      {/* ═══ FILTERS + BROKER LIST (C6 ticker style) ═══ */}
      <section style={{ ...cn, padding: mob ? "32px 16px 0" : "40px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, color: "#0f172a", margin: 0 }}>
            All Broker Reviews
          </h2>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            {filtered.length} broker{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {FILTER_TABS.map(f => (
            <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{
              padding: "6px 14px", borderRadius: 100, border: "none",
              background: activeFilter === f.key ? "#059669" : "#f1f5f9",
              color: activeFilter === f.key ? "#fff" : "#475569",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s",
            }}>{f.label}</button>
          ))}
        </div>

        {/* C6 Ticker — dark rows, wide-dark logos, score colored */}
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)", gap: mob ? 6 : 8 }}>
          {filtered.map((b) => (
            <Link key={b.slug} to={lp(`/review/${b.slug}`)} style={{
              display: "flex", alignItems: "center", gap: mob ? 10 : 14,
              padding: mob ? "8px 10px" : "10px 16px", borderRadius: 10,
              background: "#0f172a", textDecoration: "none",
              transition: "all 0.2s ease",
              border: "1px solid #1e293b",
              borderLeft: b.score >= 9.0 ? "3px solid #059669" : "1px solid #1e293b",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.borderColor = "#34d399"; e.currentTarget.style.transform = "translateX(3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.borderLeftColor = b.score >= 9.0 ? "#059669" : "#1e293b"; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              <div style={{ width: mob ? 56 : 72, height: mob ? 28 : 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${b.slug}.svg`} alt={b.name} loading="lazy" onError={e => { e.target.style.display = "none"; }} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: mob ? 13 : 14, color: "#f1f5f9", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.name}</span>
              </div>
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 12 : 13, fontWeight: 800, color: scoreColor(b.score), flexShrink: 0, minWidth: 32, textAlign: "right" }}>{b.score}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ HOW WE TEST ═══ */}
      <section style={{ ...cn, padding: mob ? "40px 16px 60px" : "56px 24px 80px" }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: mob ? "24px 20px" : "32px 28px" }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: 12 }}>
            How We Test Brokers
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", marginBottom: 12 }}>
            Our analysts score brokers across 6 weighted categories using publicly available data, regulatory filings, and aggregated user reviews. We collect data from official regulatory databases, broker websites, and independent sources. No broker can pay for a higher score or a more favorable review.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", marginBottom: 16 }}>
            Our scoring formula evaluates: Regulation & Safety (30%), Trading Costs (20%), User Reputation (15%), Broker Transparency (15%), Platforms & Tools (15%), and Execution Model (5%). The full methodology — including the exact weights and scoring criteria — is published openly.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link to={lp("/methodology")} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none" }}>
              Read Our Full Methodology <ArrowRight size={14} />
            </Link>
            <Link to={lp("/compare")} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none" }}>
              Compare Brokers <ArrowRight size={14} />
            </Link>
            <Link to={lp("/best-forex-brokers")} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "#059669", textDecoration: "none" }}>
              Browse Rankings <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
