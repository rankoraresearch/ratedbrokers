import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import ScoreBadge from "./ScoreBadge";
import RegBadge from "./RegBadge";
import BrokerLogo from "./BrokerLogo";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import { ChevronDown, Check, X as XIcon, ExternalLink } from "lucide-react";

const formatTpCount = (n) => {
  if (!n) return "";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
};

const TpStar = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#00B67A" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const TpStars = ({ rating = 0, size = 14 }) => {
  const full = Math.floor(rating);
  const partial = rating - full;
  const empty = 5 - full - (partial > 0 ? 1 : 0);
  const starPath = "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z";
  const uid = `tp-clip-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
      {Array.from({ length: full }, (_, i) => (
        <svg key={`f${i}`} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d={starPath} fill="#00B67A" />
        </svg>
      ))}
      {partial > 0 && (
        <svg key="p" width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs><clipPath id={uid}><rect x="0" y="0" width={24 * partial} height="24" /></clipPath></defs>
          <path d={starPath} fill="#dcdce6" />
          <path d={starPath} fill="#00B67A" clipPath={`url(#${uid})`} />
        </svg>
      )}
      {Array.from({ length: empty }, (_, i) => (
        <svg key={`e${i}`} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d={starPath} fill="#dcdce6" />
        </svg>
      ))}
    </span>
  );
};

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
  const hasTp = B.tp && B.tp > 0;

  // ── Shared sub-components ──

  const ThematicBlurb = () => (
    <div style={{ padding: mob ? "0 16px 12px" : "12px 0 0" }}>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 }}>
        {thematic.why}
      </div>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", margin: 0, maxWidth: mob ? "none" : 900 }}>
        {thematic.text}
      </p>
    </div>
  );

  const ProConPills = () => (
    <div style={{ padding: mob ? "0 16px 12px" : "10px 0 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
      {thematic.pros.map((p, i) => (
        <span key={`p${i}`} style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 8px", borderRadius: 16, fontSize: 12, fontWeight: 500,
          background: "#ecfdf5", color: "#047857",
        }}>
          <Check size={10} /> {p}
        </span>
      ))}
      {thematic.cons.map((c, i) => (
        <span key={`c${i}`} style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 8px", borderRadius: 16, fontSize: 12, fontWeight: 500,
          background: "#fef2f2", color: "#b91c1c",
        }}>
          <XIcon size={10} /> {c}
        </span>
      ))}
    </div>
  );

  const ExpandableAnalysis = () => (
    <div style={{ padding: mob ? "0 16px 12px" : "10px 0 0" }}>
      <button
        onClick={() => setAnalysisOpen(!analysisOpen)}
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 0",
          border: "none", background: "none", cursor: "pointer",
          fontSize: 13, fontWeight: 600, color: "#2563eb", fontFamily: "inherit",
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
              <p key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", marginBottom: i < thematic.analysis.split("\n\n").length - 1 ? 8 : 0 }}>
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
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 4 }}>
                      Pros for {rankingSlug ? rankingSlug.replace(/.*for-/, "").replace(/-/g, " ") : "this category"}
                    </h4>
                    {thematic.prosDetail.map((p, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 4, marginBottom: 3 }}>
                        <span style={{ color: "#059669", fontWeight: 700, fontSize: 12 }}>✓</span>
                        <span style={{ fontSize: 13, lineHeight: 1.5, color: "#374151" }}>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
                {thematic.consDetail && (
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>
                      Cons for {rankingSlug ? rankingSlug.replace(/.*for-/, "").replace(/-/g, " ") : "this category"}
                    </h4>
                    {thematic.consDetail.map((c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 4, marginBottom: 3 }}>
                        <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 12 }}>✗</span>
                        <span style={{ fontSize: 13, lineHeight: 1.5, color: "#374151" }}>{c}</span>
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
        color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none",
        boxShadow: "0 2px 8px rgba(5,150,105,0.25)",
      }}>
        <span>Open {B.name} Account →</span>
        {B.promo && <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>{B.promo}</span>}
      </a>
      <Link to={reviewPath} style={{
        flex: 1, minWidth: 140, padding: "11px 16px", borderRadius: 10, textAlign: "center",
        background: "#ecfdf5", color: "#047857", fontWeight: 700, fontSize: 14,
        textDecoration: "none", border: "2px solid #059669",
      }}>
        <span>Read Full Review</span>
        <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.7, marginTop: 1 }}>
          {B.score}/10 · Expert tested
        </span>
      </Link>
    </div>
  );

  const RiskWarning = () => (
    B.riskWarning ? (
      <div style={{
        padding: mob ? "4px 16px 12px" : "4px 0 0",
        fontSize: 12, lineHeight: 1.4, color: "#374151", textAlign: "center",
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
        {/* Header: rank left, score right */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 16px 0",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: rank === 1 ? "#059669" : rank <= 3 ? "linear-gradient(135deg,#1e3a5f,#2d5a8e)" : "#f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 14,
            color: rank <= 3 ? "#fff" : "#111827",
          }}>#{rank}</div>
          <ScoreBadge score={B.score} size="lg" />
        </div>

        {/* Centered identity */}
        <div style={{ textAlign: "center", padding: "12px 16px 0" }}>
          <Link to={reviewPath} style={{ display: "inline-block", textDecoration: "none" }}>
            <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={64} shape="icon" />
          </Link>
          <h3 style={{ margin: "8px 0 0", fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>
            <Link to={reviewPath} style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17,
              color: "#111827", textDecoration: "none",
            }}>{B.name}</Link>
          </h3>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{B.type}</div>
          {B.badge && (
            <span style={{
              display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: 6,
              fontSize: 11, fontWeight: 700, background: "#ecfdf5", color: "#059669",
            }}>{B.badge}</span>
          )}
        </div>

        {/* Trustpilot pill button */}
        {hasTp && getTrustpilotUrl(broker.slug) && (
          <div style={{ textAlign: "center", padding: "10px 16px 0" }}>
            <a href={getTrustpilotUrl(broker.slug)} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 20,
              background: "#f8fafc", border: "1px solid #e2e8f0",
              textDecoration: "none", transition: "border-color 0.15s",
            }}>
              <TpStars rating={B.tp} size={13} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: "#111827" }}>{B.tp}</span>
              <span style={{ fontSize: 11, color: "#64748b" }}>({formatTpCount(B.tpCount)})</span>
              <span style={{ fontSize: 11, color: "#64748b", marginLeft: 2 }}>Trustpilot</span>
              <ExternalLink size={11} color="#94a3b8" />
            </a>
          </div>
        )}

        {/* CTA — right after identity */}
        <DualCTA />

        {/* Risk warning right under CTA */}
        <RiskWarning />

        {/* Regs */}
        <div style={{ padding: "0 16px 10px", display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {B.regs.slice(0, 3).map((r) => (
            <RegBadge key={r.name} reg={r.name} />
          ))}
          {B.regs.length > 3 && (
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>+{B.regs.length - 3}</span>
          )}
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
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: "#111827", marginTop: 2, whiteSpace: "nowrap" }}>{val}</div>
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
                cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#111827",
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
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", textTransform: "uppercase", marginBottom: 4 }}>Key Strengths</div>
                  {topPros.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, fontSize: 14, color: "#374151", lineHeight: 1.5 }}>
                      <Check size={12} color="#059669" style={{ flexShrink: 0 }} />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                {B.verdict && (
                  <div style={{
                    marginTop: 8, padding: "8px 12px", borderRadius: 8,
                    background: "#f0fdf4", fontSize: 13, color: "#059669", fontWeight: 600,
                  }}>Verdict: {B.verdict}</div>
                )}
              </div>
            )}
          </>
        )}
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
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = rank === 1 ? "0 6px 24px rgba(5,150,105,0.12)" : "0 6px 24px rgba(0,0,0,0.08)"; }}
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
          fontSize: 16, color: rank <= 3 ? "#fff" : "#111827",
        }}>#{rank}</div>

        {/* Col 1: Identity (logo + name + badge + type) */}
        <div style={{ minWidth: tab ? 150 : 180, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link to={reviewPath} style={{ display: "flex", flexShrink: 0, textDecoration: "none" }}>
              <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={48} shape="icon" />
            </Link>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: 1.2, display: "flex", alignItems: "center", gap: 8 }}>
                <Link to={reviewPath} style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16,
                  color: "#111827", textDecoration: "none", lineHeight: 1.2,
                }}>{B.name}</Link>
                {B.badge && (
                  <span style={{
                    padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                    background: "#ecfdf5", color: "#059669", whiteSpace: "nowrap",
                  }}>{B.badge}</span>
                )}
              </h3>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{B.type}</div>
            </div>
          </div>
        </div>

        {/* Col 2: Stats (Spread, Min Deposit, Leverage, Regulation) + Trustpilot below */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: tab ? "1fr 1fr 1fr" : "1fr 1fr 1fr auto",
            gap: tab ? 10 : 12,
            alignItems: "start",
          }}>
            {[
              ["Spread", `${B.spread} pips`],
              ["Min Deposit", B.minDep === 0 ? "$0" : `$${B.minDep}`],
              ["Leverage", B.leverage],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{label}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: "#111827", marginTop: 2, whiteSpace: "nowrap" }}>{val}</div>
              </div>
            ))}
            {!tab && (
              <div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>Regulation</div>
                <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                  {B.regs.slice(0, 3).map((r) => (
                    <RegBadge key={r.name} reg={r.name} />
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Tablet: Regulation row below stats */}
          {tab && (
            <div style={{ display: "flex", gap: 3, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginRight: 4 }}>Regulation:</span>
              {B.regs.slice(0, 3).map((r) => (
                <RegBadge key={r.name} reg={r.name} />
              ))}
            </div>
          )}
          {/* Trustpilot — social proof with stars */}
          {hasTp && getTrustpilotUrl(broker.slug) && (
            <a href={getTrustpilotUrl(broker.slug)} target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                marginTop: 10, paddingTop: 8, textDecoration: "none",
                borderTop: "1px solid #f1f5f9",
              }}
              onMouseEnter={(e) => { const w = e.currentTarget.querySelector("[data-tp]"); if (w) { w.style.color = "#00B67A"; w.style.borderBottomStyle = "solid"; } }}
              onMouseLeave={(e) => { const w = e.currentTarget.querySelector("[data-tp]"); if (w) { w.style.color = "#4b5563"; w.style.borderBottomStyle = "dotted"; } }}
            >
              <TpStars rating={B.tp} size={15} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: "#111827" }}>{B.tp}</span>
              <span style={{ color: "#cbd5e1", fontSize: 11 }}>·</span>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{formatTpCount(B.tpCount)} reviews on</span>
              <span data-tp="" style={{ fontSize: 12, fontWeight: 600, color: "#4b5563", borderBottom: "1px dotted #94a3b8", transition: "all 0.15s" }}>Trustpilot</span>
            </a>
          )}
        </div>

        {/* Col 3: Score */}
        <ScoreBadge score={B.score} size="lg" />

        {/* CTAs (compact, for non-thematic) */}
        {!hasThematic && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, width: 240 }}>
            <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: "11px 20px", borderRadius: 10, textAlign: "center",
              background: "linear-gradient(135deg,#059669,#047857)",
              color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none",
              boxShadow: "0 2px 8px rgba(5,150,105,0.25)",
            }}>
              <span style={{ whiteSpace: "nowrap" }}>Visit {B.name}</span>
              {B.promo && <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.8, marginTop: 2, lineHeight: 1.3 }}>{B.promo}</span>}
            </a>
            <Link to={reviewPath} style={{
              padding: "11px 16px", borderRadius: 10, textAlign: "center",
              background: "#ecfdf5", color: "#047857", fontWeight: 700, fontSize: 14,
              textDecoration: "none", border: "2px solid #059669",
            }}>
              <span>Read Review</span>
              <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.7, marginTop: 1 }}>
                {B.score}/10 · Expert tested
              </span>
            </Link>
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
