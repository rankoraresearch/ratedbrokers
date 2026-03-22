/**
 * CardProto — Mobile card layout prototypes
 * Concept A: Centered Identity Hero
 * Concept B: Centered Identity + Inline Trustpilot Button
 *
 * Barbara's design notes:
 * - Logo centered, large (64px) — hero-style identity
 * - Name 17px centered, type underneath
 * - Rank badge top-left, score top-right — balanced
 * - Trustpilot as pill button (not inline text)
 * - CTA buttons full-width stacked
 * - Clean vertical rhythm, generous spacing
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { getBrokersForRanking } from "../data/rankingFilters";
import BrokerLogo from "../components/BrokerLogo";
import ScoreBadge from "../components/ScoreBadge";
import RegBadge from "../components/RegBadge";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import { Star, ExternalLink, Check, X as XIcon, ChevronDown } from "lucide-react";

const apiBase = import.meta.env.VITE_API_URL || "";
const makeVisitUrl = (slug, url) => apiBase ? `${apiBase}/go/${slug}` : url;

const formatTpCount = (n) => {
  if (!n) return "";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
};

const TpStars = ({ rating = 0, size = 14 }) => {
  const full = Math.floor(rating);
  const partial = rating - full;
  const empty = 5 - full - (partial > 0 ? 1 : 0);
  const starPath = "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z";
  const uid = `tp-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
      {Array.from({ length: full }, (_, i) => (
        <svg key={`f${i}`} width={size} height={size} viewBox="0 0 24 24"><path d={starPath} fill="#00B67A" /></svg>
      ))}
      {partial > 0 && (
        <svg key="p" width={size} height={size} viewBox="0 0 24 24">
          <defs><clipPath id={uid}><rect x="0" y="0" width={24 * partial} height="24" /></clipPath></defs>
          <path d={starPath} fill="#dcdce6" />
          <path d={starPath} fill="#00B67A" clipPath={`url(#${uid})`} />
        </svg>
      )}
      {Array.from({ length: empty }, (_, i) => (
        <svg key={`e${i}`} width={size} height={size} viewBox="0 0 24 24"><path d={starPath} fill="#dcdce6" /></svg>
      ))}
    </span>
  );
};

// ── Mock thematic data for prototype ──
const MOCK_THEMATIC = {
  "ic-markets": {
    why: "Why IC Markets Is #1 for Forex Trading",
    text: "IC Markets leads our forex ranking with raw spreads from 0.0 pips on EUR/USD via its Raw Spread account, combined with ultra-fast execution averaging 40ms. The broker supports MT4, MT5, and cTrader — giving traders maximum platform flexibility.",
    pros: ["0.0 pip raw spreads", "40ms execution", "cTrader + MT5"],
    cons: ["No proprietary platform", "$200 minimum"],
    analysis: "IC Markets has consistently ranked among the top forex brokers globally since 2007. Their True ECN model routes orders directly to liquidity providers, resulting in institutional-grade pricing.\n\nThe Raw Spread account charges a $3.50 per lot commission but delivers spreads as low as 0.0 pips during peak liquidity hours. For high-volume traders, this translates to significant cost savings compared to spread-only brokers.",
    prosDetail: ["Raw spreads from 0.0 pips on 60+ pairs", "Three platforms: MT4, MT5, cTrader", "Ultra-fast execution with Equinix data centers"],
    consDetail: ["No proprietary trading platform", "$200 minimum deposit required"],
  },
  "fp-markets": {
    why: "Why FP Markets Excels for ECN Trading",
    text: "FP Markets combines true ECN pricing with DMA access via IRESS, making it ideal for traders who want direct market access alongside standard MT4/MT5 trading. Spreads start from 0.0 pips with a competitive $3 per lot commission.",
    pros: ["ECN + DMA access", "IRESS platform", "$100 min deposit"],
    cons: ["IRESS has extra fees", "Limited crypto"],
    analysis: "FP Markets stands out by offering both retail ECN trading and institutional-grade DMA via the IRESS platform. This dual approach caters to both beginning and advanced traders.\n\nThe broker's ECN account delivers raw spreads with a $3 per lot commission — slightly lower than IC Markets. IRESS DMA provides Level 2 depth of market and direct routing to exchanges.",
    prosDetail: ["ECN raw spreads from 0.0 pips", "IRESS DMA for direct market access", "Low $100 minimum deposit"],
    consDetail: ["IRESS platform carries additional monthly fees", "Cryptocurrency offering is limited"],
  },
  "ig": {
    why: "Why IG Is the Most Trusted Broker",
    text: "With over 50 years of operation and listing on the London Stock Exchange, IG is the most established CFD provider globally. FCA regulation, segregated client funds, and a proprietary platform with advanced charting make IG the benchmark for trust and reliability.",
    pros: ["50+ years operation", "LSE-listed", "FCA regulated"],
    cons: ["Higher spreads", "No MT5"],
    analysis: "IG Group was founded in 1974 and has grown to become the world's largest CFD provider by revenue. Its London Stock Exchange listing (IGG) means the company is subject to rigorous financial reporting requirements.\n\nIG's proprietary platform offers ProRealTime advanced charting at no extra cost and integrates with L2 Dealer for direct market access. The broker serves 313,000+ active clients globally.",
    prosDetail: ["Established in 1974 — 50+ years of trust", "Listed on London Stock Exchange (IGG)", "FCA, ASIC, NFA — top-tier regulation"],
    consDetail: ["Spreads slightly higher than pure ECN brokers", "MT5 not available — only MT4 and proprietary"],
  },
};

// ═══════════════════════════════════════════
// CONCEPT A — Centered Identity Hero
// ═══════════════════════════════════════════
function ConceptA({ broker, rank }) {
  const B = broker.B;
  const visitUrl = makeVisitUrl(broker.slug, B.url);
  const reviewPath = `/review/${broker.slug}`;
  const tpUrl = getTrustpilotUrl(broker.slug);
  const hasTp = B.tp && B.tp > 0 && tpUrl;
  const [analysisOpen, setAnalysisOpen] = useState(false);

  const thematic = MOCK_THEMATIC[broker.slug];
  const pros = B.pros || [];
  const topPros = pros.slice(0, 3);

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
      {hasTp && (
        <div style={{ textAlign: "center", padding: "10px 16px 0" }}>
          <a href={tpUrl} target="_blank" rel="noopener noreferrer" style={{
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

      {/* CTA */}
      <div style={{ padding: "14px 16px 6px", display: "flex", flexDirection: "column", gap: 8 }}>
        <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
          padding: "13px 20px", borderRadius: 10, textAlign: "center",
          background: "linear-gradient(135deg,#059669,#047857)",
          color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none",
          boxShadow: "0 2px 8px rgba(5,150,105,0.25)",
        }}>
          <span>Open {B.name} Account →</span>
          {B.promo && <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>{B.promo}</span>}
        </a>
        <Link to={reviewPath} style={{
          padding: "12px 16px", borderRadius: 10, textAlign: "center",
          background: "#ecfdf5", color: "#047857", fontWeight: 700, fontSize: 14,
          textDecoration: "none", border: "2px solid #059669",
        }}>
          <span>Read Full Review</span>
          <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.7, marginTop: 1 }}>
            {B.score}/10 · Expert tested
          </span>
        </Link>
      </div>

      {/* Risk */}
      {B.riskWarning && (
        <div style={{ padding: "4px 16px 12px", fontSize: 12, lineHeight: 1.4, color: "#374151", textAlign: "center" }}>
          {B.riskWarning}
        </div>
      )}

      {/* Regs */}
      <div style={{ padding: "0 16px 10px", display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
        {B.regs.slice(0, 3).map((r) => <RegBadge key={r.name} reg={r.name} />)}
        {B.regs.length > 3 && <span style={{ fontSize: 11, color: "#64748b" }}>+{B.regs.length - 3}</span>}
      </div>

      {/* Stats */}
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
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: "#111827", marginTop: 2 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Thematic blurb */}
      {thematic && (
        <div style={{ padding: "12px 16px" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 }}>
            {thematic.why}
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", margin: 0 }}>
            {thematic.text}
          </p>
        </div>
      )}

      {/* Pro/Con pills */}
      {thematic && (
        <div style={{ padding: "0 16px 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
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
      )}

      {/* Expandable analysis */}
      {thematic && thematic.analysis && (
        <div style={{ padding: "0 16px 12px" }}>
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginTop: 10 }}>
                    {thematic.prosDetail && (
                      <div>
                        <h4 style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 4 }}>
                          Pros for forex trading
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
                          Cons for forex trading
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
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}

// ═══════════════════════════════════════════
// CONCEPT B — Compact Centered + Score Row
// ═══════════════════════════════════════════
function ConceptB({ broker, rank }) {
  const B = broker.B;
  const visitUrl = makeVisitUrl(broker.slug, B.url);
  const reviewPath = `/review/${broker.slug}`;
  const tpUrl = getTrustpilotUrl(broker.slug);
  const hasTp = B.tp && B.tp > 0 && tpUrl;

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: rank === 1 ? "2px solid #059669" : "1px solid #e2e8f0",
      overflow: "hidden",
      boxShadow: rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
    }}>
      {/* Centered identity block */}
      <div style={{ textAlign: "center", padding: "18px 16px 0" }}>
        {/* Rank + Logo + Score inline */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: rank === 1 ? "#059669" : rank <= 3 ? "linear-gradient(135deg,#1e3a5f,#2d5a8e)" : "#f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 12,
            color: rank <= 3 ? "#fff" : "#111827",
          }}>#{rank}</div>

          <Link to={reviewPath} style={{ display: "inline-block", textDecoration: "none" }}>
            <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={56} shape="icon" />
          </Link>

          <ScoreBadge score={B.score} size="lg" />
        </div>

        {/* Name + type */}
        <h3 style={{ margin: "10px 0 0", fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
          <Link to={reviewPath} style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18,
            color: "#111827", textDecoration: "none",
          }}>{B.name}</Link>
        </h3>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{B.type}</div>
        {B.badge && (
          <span style={{
            display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: 6,
            fontSize: 11, fontWeight: 700, background: "#ecfdf5", color: "#059669",
          }}>{B.badge}</span>
        )}
      </div>

      {/* Trustpilot pill — styled as a subtle card */}
      {hasTp && (
        <div style={{ textAlign: "center", padding: "12px 16px 0" }}>
          <a href={tpUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "7px 14px", borderRadius: 10,
            background: "#fff", border: "1.5px solid #00B67A",
            textDecoration: "none",
          }}>
            <TpStars rating={B.tp} size={12} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: "#111827" }}>{B.tp}</span>
            <span style={{ fontSize: 11, color: "#64748b" }}>{formatTpCount(B.tpCount)} reviews</span>
            <ExternalLink size={10} color="#00B67A" />
          </a>
        </div>
      )}

      {/* Regs inline — centered */}
      <div style={{ textAlign: "center", padding: "10px 16px 0", display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
        {B.regs.slice(0, 3).map((r) => <RegBadge key={r.name} reg={r.name} />)}
        {B.regs.length > 3 && <span style={{ fontSize: 11, color: "#64748b" }}>+{B.regs.length - 3}</span>}
      </div>

      {/* CTA */}
      <div style={{ padding: "14px 16px 6px", display: "flex", flexDirection: "column", gap: 8 }}>
        <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
          padding: "13px 20px", borderRadius: 10, textAlign: "center",
          background: "linear-gradient(135deg,#059669,#047857)",
          color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none",
          boxShadow: "0 2px 8px rgba(5,150,105,0.25)",
        }}>
          <span>Open {B.name} Account →</span>
          {B.promo && <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>{B.promo}</span>}
        </a>
        <Link to={reviewPath} style={{
          padding: "12px 16px", borderRadius: 10, textAlign: "center",
          background: "#ecfdf5", color: "#047857", fontWeight: 700, fontSize: 14,
          textDecoration: "none", border: "2px solid #059669",
        }}>
          <span>Read Full Review</span>
          <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.7, marginTop: 1 }}>
            {B.score}/10 · Expert tested
          </span>
        </Link>
      </div>

      {/* Risk */}
      {B.riskWarning && (
        <div style={{ padding: "4px 16px 10px", fontSize: 12, lineHeight: 1.4, color: "#374151", textAlign: "center" }}>
          {B.riskWarning}
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: 1, background: "#f1f5f9", margin: "0 16px 16px", borderRadius: 10, overflow: "hidden",
      }}>
        {[
          ["Spread", `${B.spread} pips`],
          ["Min Dep", B.minDep === 0 ? "$0" : `$${B.minDep}`],
          ["Leverage", B.leverage],
        ].map(([label, val]) => (
          <div key={label} style={{ background: "#f8fafc", padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: "#111827", marginTop: 2 }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PROTO PAGE
// ═══════════════════════════════════════════
export default function CardProto() {
  const brokers = getBrokersForRanking("best-forex-brokers").slice(0, 3);

  return (
    <div style={{
      fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb",
      minHeight: "100vh", padding: "20px 16px", maxWidth: 400, margin: "0 auto",
    }}>
      <h1 style={{ fontFamily: "Outfit", fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
        Mobile Card Prototypes
      </h1>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
        Barbara's design review — centered identity, Trustpilot button
      </p>

      {/* CONCEPT A */}
      <h2 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, color: "#059669", marginBottom: 12 }}>
        Concept A — Centered Identity Hero
      </h2>
      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>
        Rank top-left, Score top-right. Large centered logo (64px). Name 17px centered.
        Trustpilot as pill button. CTA full-width.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {brokers.map((b, i) => <ConceptA key={b.slug} broker={b} rank={i + 1} />)}
      </div>

      {/* CONCEPT B */}
      <h2 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, color: "#2563eb", marginBottom: 12 }}>
        Concept B — Compact Centered + Inline Score
      </h2>
      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>
        Rank + Logo (56px) + Score in one centered row. Name 18px below.
        Trustpilot pill with green border. Regs before CTA.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {brokers.map((b, i) => <ConceptB key={b.slug} broker={b} rank={i + 1} />)}
      </div>
    </div>
  );
}
