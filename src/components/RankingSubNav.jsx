/**
 * RankingSubNav — "Explore {Category} Rankings" block for head ranking pages.
 * Shows featured sub-categories with links. Replaces deleted hub page navigation.
 */
import { Link } from "react-router-dom";
import { useLocalePath } from "../i18n/useLocalePath";
import HUBS, { getRankingsForHub } from "../data/categoryHubs";
import RANKINGS from "../data/rankings";
import Icon from "./Icon";
import { ArrowRight } from "lucide-react";

// Head ranking IDs that should show the sub-nav
const HEAD_RANKING_IDS = [
  "forex-overall", "cfd", "forex-copy-trading", "spread-betting",
  "crypto-overall", "stocks", "options", "futures",
];

export default function RankingSubNav({ rankingId, mob }) {
  const lp = useLocalePath();
  if (!HEAD_RANKING_IDS.includes(rankingId)) return null;

  const ranking = RANKINGS.find(r => r.id === rankingId);
  if (!ranking) return null;

  const hub = HUBS.find(h =>
    h.category === ranking.category || h.verticalKey === ranking.vertical
  );
  if (!hub) return null;

  const allRankings = getRankingsForHub(hub);
  // Exclude current head ranking, pick up to 12 sub-rankings sorted by priority
  const subRankings = allRankings
    .filter(r => r.id !== rankingId)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 12);

  if (subRankings.length === 0) return null;

  const totalCount = allRankings.length;

  return (
    <section style={{
      maxWidth: 1200, margin: "0 auto",
      padding: mob ? "0 16px 24px" : "0 24px 32px",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        padding: mob ? "20px 16px" : "28px 24px",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: mob ? 14 : 18,
        }}>
          <h2 style={{
            fontFamily: "Outfit", fontWeight: 800,
            fontSize: mob ? 18 : 22, color: "#111827", margin: 0,
          }}>
            Explore {hub.name} Rankings
          </h2>
          <Link to={lp(`/rankings?cat=${hub.category}`)} style={{
            fontSize: 13, fontWeight: 600, color: "#059669",
            textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
          }}>
            All {totalCount} <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)",
          gap: mob ? 8 : 10,
        }}>
          {subRankings.map(r => (
            <Link key={r.id} to={lp(r.slug)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: mob ? "10px 12px" : "12px 14px",
              borderRadius: 10,
              border: "1px solid #f1f5f9",
              textDecoration: "none", color: "#111827",
              transition: "border-color 0.2s, background 0.2s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = hub.color;
                e.currentTarget.style.background = `${hub.color}08`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#f1f5f9";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${hub.color}12`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon name={r.icon} size={16} color={hub.color} />
              </span>
              <span style={{
                fontSize: mob ? 13 : 14, fontWeight: 600, lineHeight: 1.3,
              }}>
                {r.title.replace("Best ", "").replace(" Forex Brokers", "").replace(" Brokers", "").replace(" Platforms", "")}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
