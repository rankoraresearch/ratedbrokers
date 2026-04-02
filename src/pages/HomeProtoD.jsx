/**
 * HOME PROTOTYPE D — "Data Dashboard" (Bloomberg Terminal aesthetic)
 * Full dark theme, data-forward, tables over cards, monospace numbers
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokersWithData } from "../data/brokers";
import HUBS, { getRankingsForHub } from "../data/categoryHubs";
import RANKINGS from "../data/rankings";
import { getBrokersForRanking } from "../data/rankingFilters";
import BrokerLogo from "../components/BrokerLogo";
import Icon from "../components/Icon";
import { ArrowRight, ChevronRight, Search } from "lucide-react";

const YEAR = "2026";

export default function HomeProtoD() {
  const { mob, tab } = useMedia();
  const cn = { maxWidth: 1120, margin: "0 auto", padding: mob ? "0 16px" : "0 28px" };
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const [activeVertical, setActiveVertical] = useState("forex");

  useEffect(() => { document.title = `Best Online Brokers ${YEAR} | RatedBrokers`; }, []);

  const activeHub = HUBS.find(h => h.slug === activeVertical) || HUBS[0];
  const activeBrokers = getBrokersForRanking(activeHub.featuredIds?.[0] || "forex-overall").slice(0, 10);

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#0f172a", minHeight: "100vh", color: "#e2e8f0" }}>

      {/* ═══ TICKER BAR ═══ */}
      <div style={{
        background: "#1e293b", borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "8px 0", overflowX: "auto",
      }}>
        <div style={{ display: "flex", gap: mob ? 16 : 24, padding: "0 20px", minWidth: "max-content" }}>
          {allBrokers.slice(0, 8).map(b => (
            <Link key={b.slug} to={`/review/${b.slug}`} style={{
              display: "flex", alignItems: "center", gap: 8,
              textDecoration: "none", color: "#e2e8f0",
            }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, overflow: "hidden" }}>
                <BrokerLogo broker={b.B} size={20} variant="icon" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{b.B.name}</span>
              <span style={{
                fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700,
                color: b.B.score >= 9 ? "#34d399" : "#94a3b8",
              }}>{b.B.score}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: mob ? "36px 16px 28px" : "56px 28px 40px" }}>
        <div style={cn}>
          <p style={{
            fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#475569",
            marginBottom: 12, letterSpacing: 1,
          }}>&gt; RATEDBROKERS.COM / {YEAR}</p>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans','Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 28 : 44, lineHeight: 1.08, color: "#fff",
            marginBottom: 12, letterSpacing: "-0.03em",
          }}>
            Best Online Brokers
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 24, maxWidth: 500, lineHeight: 1.6 }}>
            {allBrokers.length} brokers · {HUBS.length} categories · {RANKINGS.length}+ rankings · 130+ data points per broker
          </p>
          {/* Search bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", borderRadius: 8,
            background: "#1e293b", border: "1px solid #334155",
            maxWidth: 400,
          }}>
            <Search size={16} style={{ color: "#475569" }} />
            <span style={{ fontSize: 14, color: "#475569" }}>Search brokers, rankings, categories...</span>
          </div>
        </div>
      </section>

      {/* ═══ MARKET OVERVIEW WIDGETS ═══ */}
      <section style={{ padding: mob ? "0 16px 28px" : "0 28px 40px" }}>
        <div style={{ ...cn, display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
          {/* Widget 1: Top by Score */}
          <div style={{ background: "#1e293b", borderRadius: 10, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Top by Score</div>
            {allBrokers.slice(0, 5).map((b, i) => (
              <div key={b.slug} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, overflow: "hidden" }}>
                  <BrokerLogo broker={b.B} size={22} variant="icon" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: "#cbd5e1" }}>{b.B.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 700, color: "#34d399" }}>{b.B.score}</span>
              </div>
            ))}
          </div>
          {/* Widget 2: Lowest Spreads */}
          <div style={{ background: "#1e293b", borderRadius: 10, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Lowest Spreads (EUR/USD)</div>
            {allBrokers.filter(b => b.B.spread && b.B.spread !== "N/A").slice(0, 5).map((b, i) => (
              <div key={b.slug} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, overflow: "hidden" }}>
                  <BrokerLogo broker={b.B} size={22} variant="icon" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: "#cbd5e1" }}>{b.B.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>{b.B.spread} pip</span>
              </div>
            ))}
          </div>
          {/* Widget 3: Categories */}
          <div style={{ background: "#1e293b", borderRadius: 10, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Categories</div>
            {HUBS.map((hub, i) => (
              <Link key={hub.slug} to={hub.path} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "5px 0",
                borderBottom: i < HUBS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                textDecoration: "none", color: "#cbd5e1",
              }}>
                <Icon name={hub.icon} size={14} style={{ color: "#475569" }} />
                <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{hub.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#475569" }}>{getRankingsForHub(hub).length}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VERTICAL TABS + TABLE ═══ */}
      <section style={{ padding: mob ? "0 16px 36px" : "0 28px 48px" }}>
        <div style={cn}>
          <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto" }}>
            {HUBS.map(hub => (
              <button key={hub.slug} onClick={() => setActiveVertical(hub.slug)} style={{
                padding: "6px 14px", borderRadius: 6, border: "1px solid",
                borderColor: activeVertical === hub.slug ? "#34d399" : "rgba(255,255,255,0.08)",
                background: activeVertical === hub.slug ? "rgba(52,211,153,0.1)" : "transparent",
                color: activeVertical === hub.slug ? "#34d399" : "#64748b",
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'JetBrains Mono'",
                whiteSpace: "nowrap", letterSpacing: "-0.01em",
              }}>{hub.name}</button>
            ))}
          </div>
          {/* Data Table */}
          <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: mob ? "1fr auto auto" : "40px 40px 1fr auto auto auto auto",
              background: "#1e293b", padding: "8px 12px", gap: 12,
              fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1,
            }}>
              {!mob && <span>#</span>}
              {!mob && <span></span>}
              <span>Broker</span>
              <span>Score</span>
              {!mob && <span>Type</span>}
              {!mob && <span>Min Dep</span>}
              <span></span>
            </div>
            {activeBrokers.map((b, i) => (
              <Link key={b.slug} to={`/review/${b.slug}`} style={{
                display: "grid",
                gridTemplateColumns: mob ? "1fr auto auto" : "40px 40px 1fr auto auto auto auto",
                padding: "10px 12px", gap: 12, alignItems: "center",
                background: i % 2 === 0 ? "#0f172a" : "#1e293b",
                textDecoration: "none", color: "#e2e8f0",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                transition: "background 0.1s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#334155"; }}
                onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? "#0f172a" : "#1e293b"; }}
              >
                {!mob && <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#475569" }}>{i + 1}</span>}
                {!mob && <div style={{ width: 28, height: 28, borderRadius: 6, overflow: "hidden" }}><BrokerLogo broker={b.B} size={28} variant="icon" /></div>}
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{b.B.name}</span>
                  {mob && <span style={{ fontSize: 11, color: "#64748b", marginLeft: 6 }}>{b.B.type}</span>}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 700, color: b.B.score >= 9 ? "#34d399" : "#94a3b8" }}>{b.B.score}</span>
                {!mob && <span style={{ fontSize: 12, color: "#64748b" }}>{b.B.type}</span>}
                {!mob && <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#94a3b8" }}>${b.B.minDep}</span>}
                <ChevronRight size={14} style={{ color: "#334155" }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ METHODOLOGY ═══ */}
      <section style={{ padding: mob ? "0 16px 36px" : "0 28px 48px" }}>
        <div style={{ ...cn, display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "#1e293b", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Methodology</div>
            <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.5 }}>130+ data points per broker. Real money testing. 6-category weighted scoring.</p>
          </div>
          <Link to="/methodology" style={{ fontSize: 13, fontWeight: 600, color: "#34d399", textDecoration: "none", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
            Details <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </div>
  );
}
