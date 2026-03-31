import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import RANKINGS from "../data/rankings";
import { getBrokerCountForRanking } from "../data/rankingFilters";
import Icon, { ArrowRight } from "../components/Icon";

const YEAR = "2026";

const CATEGORY_TABS = [
  { key: "all", label: "All" },
  { key: "forex", label: "Forex" },
  { key: "crypto", label: "Crypto" },
  { key: "assets", label: "Assets" },
  { key: "country", label: "Countries" },
];

// Group rankings by category > sub
function groupRankings(rankings) {
  const groups = {};
  for (const r of rankings) {
    const cat = r.category;
    if (!groups[cat]) groups[cat] = {};
    if (!groups[cat][r.sub]) groups[cat][r.sub] = [];
    groups[cat][r.sub].push(r);
  }
  return groups;
}

// Nicer sub-category labels
const SUB_LABELS = {
  top: "Top Ranked",
  style: "By Trading Style",
  costs: "By Costs & Fees",
  execution: "By Execution Model",
  accounts: "By Account Type",
  deposit: "By Minimum Deposit",
  leverage: "By Leverage",
  bonus: "Bonuses & Promotions",
  platform: "By Platform",
  mobile: "Mobile Apps",
  trust: "Trust & Safety",
  tools: "Tools & Features",
  coins: "By Coin",
  feature: "By Feature",
  guide: "Guides",
  type: "By Asset Type",
  pairs: "By Currency Pair",
  index: "By Index",
  payment: "By Payment Method",
  regulator: "By Regulator",
  tier1: "Tier 1 Countries",
  tier2: "Tier 2 Countries",
  tier3: "Tier 3 Countries",
};

export default function AllRankingsPage() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    document.title = `All Broker Rankings ${YEAR} — ${RANKINGS.length} Expert-Tested Lists | RatedBrokers`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `Browse ${RANKINGS.length} broker rankings for ${YEAR}. Forex, crypto, CFDs — filtered by trading style, platform, costs, regulation, and country. All independently analyzed.`);
    window.scrollTo(0, 0);
  }, []);

  const filtered = activeTab === "all"
    ? RANKINGS
    : RANKINGS.filter((r) => r.category === activeTab);

  const grouped = groupRankings(filtered);
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* HEADER */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
        padding: mob ? "40px 16px" : "60px 24px",
        textAlign: "center",
      }}>
        <div style={cn}>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 28 : tab ? 36 : 44,
            lineHeight: 1.1, color: "#fff", marginBottom: 12,
          }}>
            All Broker Rankings {YEAR}
          </h1>
          <p style={{
            fontSize: mob ? 14 : 16, color: "rgba(255,255,255,0.7)",
            maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.7,
          }}>
            {RANKINGS.length} thematic ranking pages covering every angle of forex,
            crypto, and CFD broker selection. Updated quarterly.
          </p>

          {/* Category tabs */}
          <div style={{
            display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap",
          }}>
            {CATEGORY_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: "8px 18px", borderRadius: 100,
                  border: "1px solid",
                  borderColor: activeTab === t.key ? "#34d399" : "rgba(255,255,255,0.15)",
                  background: activeTab === t.key ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.05)",
                  color: activeTab === t.key ? "#34d399" : "rgba(255,255,255,0.7)",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* RANKINGS GRID */}
      <section style={{ ...cn, padding: mob ? "32px 16px 60px" : "48px 24px 80px" }}>
        {Object.entries(grouped).map(([category, subs]) => (
          <div key={category} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontFamily: "Outfit", fontWeight: 800,
              fontSize: mob ? 20 : 24,
              color: "#0f172a", marginBottom: 20,
              textTransform: "capitalize",
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: 10,
            }}>
              {`${category} Rankings`}
            </h2>

            {Object.entries(subs).map(([sub, rankings]) => (
              <div key={sub} style={{ marginBottom: 24 }}>
                <h3 style={{
                  fontSize: 15, fontWeight: 700, color: "#1f2937",
                  textTransform: "uppercase", letterSpacing: 0.5,
                  marginBottom: 12,
                }}>
                  {SUB_LABELS[sub] || sub}
                </h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
                  gap: 10,
                }}>
                  {rankings.map((r) => (
                    <Link
                      key={r.id}
                      to={lp(r.slug)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "14px 18px", borderRadius: 12,
                        background: "#fff", border: "1px solid #e2e8f0",
                        textDecoration: "none", color: "#111827",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#059669";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(5,150,105,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <Icon name={r.icon} size={20} style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 600, fontSize: 14,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{r.title}</div>
                        <div style={{ fontSize: 12, color: "#1f2937", marginTop: 2 }}>
                          {getBrokerCountForRanking(r.id)} brokers
                        </div>
                      </div>
                      {r.priority === 1 && (
                        <span style={{
                          padding: "2px 6px", borderRadius: 4,
                          background: "#ecfdf5", color: "#059669",
                          fontSize: 11, fontWeight: 700, flexShrink: 0,
                        }}>TOP</span>
                      )}
                      <ArrowRight size={14} color="#374151" style={{ flexShrink: 0 }} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
