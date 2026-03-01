import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import ScoreBadge from "./ScoreBadge";
import RegBadge from "./RegBadge";
import BrokerLogo from "./BrokerLogo";
import { getPlatformSlugByName } from "../data/platforms/index";
import { ChevronDown, Check } from "lucide-react";

export default function BrokerRankCard({ broker, rank }) {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const [expanded, setExpanded] = useState(false);
  const B = broker.B;

  const reviewPath = lp(`/review/${broker.slug}`);
  const visitUrl = B.url;

  const pros = B.pros || broker.PROS || [];
  const topPros = pros.slice(0, 3);

  if (mob) {
    return (
      <div style={{
        background: "#fff", borderRadius: 16,
        border: rank === 1 ? "2px solid #059669" : "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
      }}>
        {/* Top row: rank + name + score */}
        <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: rank === 1 ? "#059669" : "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 13, color: "#fff",
          }}>#{rank}</div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <Link to={reviewPath} style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, color: "inherit", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
              >{B.name}</Link>
              {B.badge && (
                <span style={{
                  padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                  background: "#ecfdf5", color: "#059669",
                }}>{B.badge}</span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
              {B.type}
            </div>
          </div>

          <ScoreBadge score={B.score} size="md" />
        </div>

        {/* Regs */}
        <div style={{ padding: "0 16px 10px", display: "flex", gap: 4, flexWrap: "wrap" }}>
          {B.regs.slice(0, 3).map((r) => (
            <RegBadge key={r.name} reg={r.name} />
          ))}
        </div>

        {/* Quick stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 1, background: "#f1f5f9", margin: "0 16px", borderRadius: 10, overflow: "hidden",
        }}>
          {[
            ["Spread", `${B.spread} pips`],
            ["Min Dep", B.minDep === 0 ? "$0" : `$${B.minDep}`],
            ["Leverage", B.leverage],
          ].map(([label, val]) => (
            <div key={label} style={{ background: "#f8fafc", padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: "#1e293b", marginTop: 2 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Expand toggle */}
        {topPros.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              width: "100%", padding: "10px", border: "none", background: "none",
              cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#64748b",
              fontFamily: "inherit",
            }}
          >
            {expanded ? "Less" : "More details"}
            <span style={{
              transition: "transform 0.2s",
              transform: expanded ? "rotate(180deg)" : "none",
              display: "inline-flex",
            }}><ChevronDown size={12} /></span>
          </button>
        )}

        {expanded && (
          <div style={{ padding: "0 16px 12px" }}>
            {/* Platforms */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>Platforms</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {B.platforms.map((p) => {
                  const pSlug = getPlatformSlugByName(p);
                  const tagStyle = { padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: "#f1f5f9", color: "#475569" };
                  return pSlug
                    ? <Link key={p} to={lp(`/platform/${pSlug}`)} style={{ ...tagStyle, textDecoration: "none" }}>{p}</Link>
                    : <span key={p} style={tagStyle}>{p}</span>;
                })}
              </div>
            </div>
            {/* Pros */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>Key Strengths</div>
              {topPros.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
                  <Check size={12} color="#059669" style={{ flexShrink: 0 }} />
                  <span>{p}</span>
                </div>
              ))}
            </div>
            {/* Verdict */}
            {B.verdict && (
              <div style={{
                marginTop: 8, padding: "8px 12px", borderRadius: 8,
                background: "#f0fdf4", fontSize: 12, color: "#059669", fontWeight: 600,
              }}>
                Verdict: {B.verdict}
              </div>
            )}
          </div>
        )}

        {/* CTA buttons */}
        <div style={{
          display: "flex", gap: 8, padding: "12px 16px 16px",
          borderTop: "1px solid #f1f5f9",
        }}>
          <a href={visitUrl} target="_blank" rel="noopener noreferrer nofollow" style={{
            flex: 1, padding: "11px 16px", borderRadius: 10, textAlign: "center",
            background: "linear-gradient(135deg,#059669,#34d399)",
            color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
          }}>Visit Broker</a>
          <Link to={reviewPath} style={{
            flex: 1, padding: "11px 16px", borderRadius: 10, textAlign: "center",
            background: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: 14,
            textDecoration: "none",
          }}>Read Review</Link>
        </div>
      </div>
    );
  }

  // ── Desktop / Tablet ──
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: tab ? "18px 20px" : "20px 28px",
      border: rank === 1 ? "2px solid #059669" : "1px solid #e2e8f0",
      display: "flex", alignItems: "center", gap: tab ? 16 : 24,
      boxShadow: rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
      transition: "all 0.2s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)"; }}
    >
      {/* Rank badge */}
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: rank === 1 ? "#059669" : rank <= 3 ? "linear-gradient(135deg,#1e3a5f,#2d5a8e)" : "#f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
        fontSize: 15, color: rank <= 3 ? "#fff" : "#475569",
      }}>#{rank}</div>

      {/* Logo + Name block */}
      <div style={{ width: tab ? 140 : 180, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href={visitUrl} target="_blank" rel="noopener noreferrer nofollow" style={{ display: "flex", flexShrink: 0 }}><BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={36} /></a>
          <div>
            <Link to={reviewPath} style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, lineHeight: 1.2, color: "inherit", textDecoration: "none", display: "inline-block" }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
            >{B.name}</Link>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 1 }}>{B.type}</div>
          </div>
        </div>
        {B.badge && (
          <span style={{
            display: "inline-block", marginTop: 6, padding: "2px 8px", borderRadius: 5,
            background: "#ecfdf5", color: "#059669", fontSize: 10, fontWeight: 700,
          }}>{B.badge}</span>
        )}
        <div style={{ display: "flex", gap: 3, marginTop: 6, flexWrap: "wrap" }}>
          {B.regs.slice(0, 3).map((r) => (
            <RegBadge key={r.name} reg={r.name} />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: tab ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr",
        gap: 12,
      }}>
        {[
          ["Spread", `${B.spread} pips`],
          ["Min Deposit", B.minDep === 0 ? "$0" : `$${B.minDep}`],
          ["Leverage", B.leverage],
          ...(!tab ? [["Platforms", B.platforms.length + " platforms"]] : []),
        ].map(([label, val]) => (
          <div key={label}>
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: "#1e293b", marginTop: 2 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Score */}
      <ScoreBadge score={B.score} size="md" />

      {/* CTAs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
        <a href={visitUrl} target="_blank" rel="noopener noreferrer nofollow" style={{
          padding: "10px 20px", borderRadius: 8, textAlign: "center",
          background: "linear-gradient(135deg,#059669,#34d399)",
          color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none",
          whiteSpace: "nowrap",
        }}>Visit Broker</a>
        <Link to={reviewPath} style={{
          padding: "8px 20px", borderRadius: 8, textAlign: "center",
          background: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: 13,
          textDecoration: "none", whiteSpace: "nowrap",
        }}>Read Review</Link>
      </div>
    </div>
  );
}
