import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import ScoreBadge from "./ScoreBadge";
import RegBadge from "./RegBadge";
import BrokerLogo from "./BrokerLogo";
import { getPlatformSlugByName } from "../data/platforms/index";
import { ChevronDown, Check, X as XIcon } from "lucide-react";

export default function BrokerRankCard({ broker, rank, thematic, rankingSlug }) {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const [expanded, setExpanded] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const B = broker.B;

  const reviewPath = lp(`/review/${broker.slug}`);
  const apiBase = import.meta.env.VITE_API_URL || '';
  const visitUrl = apiBase ? `${apiBase}/go/${broker.slug}` : B.url;

  const pros = B.pros || broker.PROS || [];
  const topPros = pros.slice(0, 3);

  const hasThematic = !!thematic;

  // ── Shared sub-components ──

  const ThematicBlurb = () => (
    <div style={{ padding: mob ? "0 16px 12px" : "12px 0 0" }}>
      <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 4 }}>
        {thematic.why}
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: "#475569", margin: 0 }}>
        {thematic.text}
      </p>
    </div>
  );

  const ProConPills = () => (
    <div style={{ padding: mob ? "0 16px 12px" : "8px 0 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
      {thematic.pros.map((p, i) => (
        <span key={`p${i}`} style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 8px", borderRadius: 16, fontSize: 10, fontWeight: 500,
          background: "#ecfdf5", color: "#047857",
        }}>
          <Check size={10} /> {p}
        </span>
      ))}
      {thematic.cons.map((c, i) => (
        <span key={`c${i}`} style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 8px", borderRadius: 16, fontSize: 10, fontWeight: 500,
          background: "#fef2f2", color: "#b91c1c",
        }}>
          <XIcon size={10} /> {c}
        </span>
      ))}
    </div>
  );

  const ExpandableAnalysis = () => (
    <div style={{ padding: mob ? "0 16px 12px" : "8px 0 0" }}>
      <button
        onClick={() => setAnalysisOpen(!analysisOpen)}
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 0",
          border: "none", background: "none", cursor: "pointer",
          fontSize: 12, fontWeight: 600, color: "#2563eb", fontFamily: "inherit",
        }}
      >
        {analysisOpen ? "Hide full analysis" : "\uD83D\uDD0E Read our full analysis"}
        <span style={{
          transition: "transform 0.2s",
          transform: analysisOpen ? "rotate(180deg)" : "none",
          display: "inline-flex",
        }}><ChevronDown size={14} /></span>
      </button>

      {analysisOpen && (
        <div style={{ paddingTop: 8 }}>
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: 14 }}>
            {thematic.analysis.split("\n\n").map((p, i) => (
              <p key={i} style={{ fontSize: 12, lineHeight: 1.7, color: "#374151", marginBottom: i < thematic.analysis.split("\n\n").length - 1 ? 8 : 0 }}>
                {p}
              </p>
            ))}

            {/* Pros/Cons Detail Grid */}
            {(thematic.prosDetail || thematic.consDetail) && (
              <div style={{
                display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
                gap: 10, marginTop: 10,
              }}>
                {thematic.prosDetail && (
                  <div>
                    <h4 style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 4 }}>
                      Pros for {rankingSlug ? rankingSlug.replace(/.*for-/, "").replace(/-/g, " ") : "this category"}
                    </h4>
                    {thematic.prosDetail.map((p, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 4, marginBottom: 3 }}>
                        <span style={{ color: "#059669", fontWeight: 700, fontSize: 11 }}>✓</span>
                        <span style={{ fontSize: 11, lineHeight: 1.5, color: "#4b5563" }}>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
                {thematic.consDetail && (
                  <div>
                    <h4 style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>
                      Cons for {rankingSlug ? rankingSlug.replace(/.*for-/, "").replace(/-/g, " ") : "this category"}
                    </h4>
                    {thematic.consDetail.map((c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 4, marginBottom: 3 }}>
                        <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 11 }}>✗</span>
                        <span style={{ fontSize: 11, lineHeight: 1.5, color: "#4b5563" }}>{c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const DualCTA = () => (
    <div style={{
      display: "flex", gap: 8, padding: mob ? "12px 16px 8px" : "12px 0 4px",
      flexDirection: mob ? "column" : "row",
    }}>
      <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
        flex: 1, minWidth: 170, padding: "11px 20px", borderRadius: 10, textAlign: "center",
        background: "linear-gradient(135deg,#059669,#047857)",
        color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
        boxShadow: "0 2px 8px rgba(5,150,105,0.25)",
      }}>
        <span>Open {B.name} Account →</span>
        {B.promo && <span style={{ display: "block", fontSize: 10, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>{B.promo}</span>}
      </a>
      <Link to={reviewPath} style={{
        flex: 1, minWidth: 140, padding: "11px 16px", borderRadius: 10, textAlign: "center",
        background: "#ecfdf5", color: "#047857", fontWeight: 700, fontSize: 13,
        textDecoration: "none", border: "2px solid #059669",
      }}>
        <span>Read Full Review</span>
        <span style={{ display: "block", fontSize: 10, fontWeight: 400, opacity: 0.7, marginTop: 1 }}>
          {B.score}/10 · Expert tested
        </span>
      </Link>
    </div>
  );

  const RiskWarning = () => (
    B.riskWarning ? (
      <div style={{
        padding: mob ? "4px 16px 12px" : "4px 0 0",
        fontSize: 9, lineHeight: 1.4, color: "#94a3b8", textAlign: "center",
      }}>
        {B.riskWarning}
      </div>
    ) : null
  );

  // ═══════════════════════════════════════════
  // MOBILE
  // ═══════════════════════════════════════════
  if (mob) {
    return (
      <div style={{
        background: "#fff", borderRadius: 16,
        border: rank === 1 ? "2px solid #059669" : "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
      }}>
        {/* Top row: rank + logo + name + score */}
        <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: rank === 1 ? "#059669" : "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 13, color: "#fff",
          }}>#{rank}</div>

          <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{ display: "flex", flexShrink: 0 }}>
            <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={32} />
          </a>

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
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{B.type}</div>
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

        {/* Thematic blurb */}
        {hasThematic && <div style={{ marginTop: 12 }}><ThematicBlurb /></div>}

        {/* Pro/Con pills */}
        {hasThematic && <ProConPills />}

        {/* Expandable analysis (thematic) */}
        {hasThematic && thematic.analysis && <ExpandableAnalysis />}

        {/* Fallback expand (non-thematic) */}
        {!hasThematic && topPros.length > 0 && (
          <>
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

            {expanded && (
              <div style={{ padding: "0 16px 12px" }}>
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
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>Key Strengths</div>
                  {topPros.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
                      <Check size={12} color="#059669" style={{ flexShrink: 0 }} />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                {B.verdict && (
                  <div style={{
                    marginTop: 8, padding: "8px 12px", borderRadius: 8,
                    background: "#f0fdf4", fontSize: 12, color: "#059669", fontWeight: 600,
                  }}>Verdict: {B.verdict}</div>
                )}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        {hasThematic ? <DualCTA /> : (
          <div style={{
            display: "flex", gap: 8, padding: "12px 16px 16px",
            borderTop: "1px solid #f1f5f9",
          }}>
            <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
              flex: 1, padding: "11px 16px", borderRadius: 10, textAlign: "center",
              background: "linear-gradient(135deg,#059669,#047857)",
              color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
              boxShadow: "0 2px 8px rgba(5,150,105,0.25)",
            }}>Visit Broker</a>
            <Link to={reviewPath} style={{
              flex: 1, padding: "11px 16px", borderRadius: 10, textAlign: "center",
              background: "#fff", color: "#475569", fontWeight: 600, fontSize: 14,
              textDecoration: "none", border: "1.5px solid #cbd5e1",
            }}>Read Review</Link>
          </div>
        )}

        {/* Risk warning */}
        <RiskWarning />
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // DESKTOP / TABLET
  // ═══════════════════════════════════════════
  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: rank === 1 ? "2px solid #059669" : "1px solid #e2e8f0",
      boxShadow: rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
      transition: "all 0.2s",
      overflow: "hidden",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)"; }}
    >
      {/* ── Top row: horizontal summary ── */}
      <div style={{
        padding: tab ? "18px 20px" : "20px 28px",
        display: "flex", alignItems: "center", gap: tab ? 16 : 24,
      }}>
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
            <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{ display: "flex", flexShrink: 0 }}>
              <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={36} />
            </a>
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

        {/* CTAs (compact, for non-thematic) */}
        {!hasThematic && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
            <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: "10px 20px", borderRadius: 8, textAlign: "center",
              background: "linear-gradient(135deg,#059669,#047857)",
              color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none",
              whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(5,150,105,0.25)",
            }}>Visit Broker</a>
            <Link to={reviewPath} style={{
              padding: "8px 20px", borderRadius: 8, textAlign: "center",
              background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13,
              textDecoration: "none", whiteSpace: "nowrap", border: "1.5px solid #cbd5e1",
            }}>Read Review</Link>
          </div>
        )}
      </div>

      {/* ── Thematic content area (desktop) ── */}
      {hasThematic && (
        <div style={{
          padding: tab ? "0 20px 16px" : "0 28px 20px",
          borderTop: "1px solid #f1f5f9",
        }}>
          <ThematicBlurb />
          <ProConPills />
          {thematic.analysis && <ExpandableAnalysis />}
          <DualCTA />
        </div>
      )}

      {/* Risk warning — always shown */}
      <div style={{ padding: tab ? "0 20px 12px" : "0 28px 14px" }}>
        <RiskWarning />
      </div>
    </div>
  );
}
