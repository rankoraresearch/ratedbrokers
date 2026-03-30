/**
 * CardProto — Trustpilot positioning prototypes (Round 3)
 *
 * Barbara + Bill consultation:
 * Problem: Trustpilot pill was BEFORE CTA buttons — user wants CTA first
 * Solution: Move Trustpilot AFTER both CTA buttons, test 3 visual styles
 *
 * All variants use same identity: Centered Horizontal Block (logo 72px + name)
 * Order: Identity → CTA (Open Account + Full Review) → Trustpilot → Risk → ...
 *
 * Variant A — Pill (current style, repositioned)
 *   Same rounded pill with stars/rating/count, just moved below CTAs
 *
 * Variant B — Inline text link
 *   Minimal: stars + rating + count + "Trustpilot ↗" as dotted underline link
 *   No background, no border — lightweight social proof
 *
 * Variant C — Compact pill (rounded-rect)
 *   Smaller pill, borderRadius 8, condensed spacing
 *   Professional, less prominent than A
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { getBrokersForRanking } from "../data/rankingFilters";
import BrokerLogo from "../components/BrokerLogo";
import ScoreBadge from "../components/ScoreBadge";
import RegBadge from "../components/RegBadge";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import { ExternalLink, Check, X as XIcon, ChevronDown } from "lucide-react";
import { getVisitUrl as makeVisitUrl } from "../utils/visitUrl";

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

// ── Mock thematic data ──
const MOCK_THEMATIC = {
  "ic-markets": {
    why: "Why IC Markets Is #1 for Forex Trading",
    text: "IC Markets leads our forex ranking with raw spreads from 0.0 pips on EUR/USD via its Raw Spread account, combined with ultra-fast execution averaging 40ms. The broker supports MT4, MT5, and cTrader — giving traders maximum platform flexibility.",
    pros: ["0.0 pip raw spreads", "40ms execution", "cTrader + MT5"],
    cons: ["No proprietary platform", "$200 minimum"],
    analysis: "IC Markets has consistently ranked among the top forex brokers globally since 2007. Their True ECN model routes orders directly to liquidity providers, resulting in institutional-grade pricing.\n\nThe Raw Spread account charges a $3.50 per lot commission but delivers spreads as low as 0.0 pips during peak liquidity hours.",
    prosDetail: ["Raw spreads from 0.0 pips on 60+ pairs", "Three platforms: MT4, MT5, cTrader", "Ultra-fast execution with Equinix data centers"],
    consDetail: ["No proprietary trading platform", "$200 minimum deposit required"],
  },
  "fp-markets": {
    why: "Why FP Markets Excels for ECN Trading",
    text: "FP Markets combines true ECN pricing with DMA access via IRESS, making it ideal for traders who want direct market access alongside standard MT4/MT5 trading.",
    pros: ["ECN + DMA access", "IRESS platform", "$100 min deposit"],
    cons: ["IRESS has extra fees", "Limited crypto"],
  },
  "ig": {
    why: "Why IG Is the Most Trusted Broker",
    text: "With over 50 years of operation and listing on the London Stock Exchange, IG is the most established CFD provider globally.",
    pros: ["50+ years operation", "LSE-listed", "FCA regulated"],
    cons: ["Higher spreads", "No MT5"],
  },
};

// ── Trustpilot variants ──
const TpPill = ({ tpUrl, B }) => (
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
);

const TpInline = ({ tpUrl, B }) => (
  <div style={{ textAlign: "center", padding: "6px 16px 0" }}>
    <a href={tpUrl} target="_blank" rel="noopener noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      textDecoration: "none",
    }}>
      <TpStars rating={B.tp} size={11} />
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: "#111827" }}>{B.tp}</span>
      <span style={{ fontSize: 10, color: "#64748b" }}>({formatTpCount(B.tpCount)})</span>
      <span style={{ color: "#cbd5e1", fontSize: 10 }}>·</span>
      <span style={{ fontSize: 10, fontWeight: 600, color: "#4b5563", borderBottom: "1px dotted #94a3b8" }}>Trustpilot ↗</span>
    </a>
  </div>
);

const TpCompact = ({ tpUrl, B }) => (
  <div style={{ textAlign: "center", padding: "8px 16px 0" }}>
    <a href={tpUrl} target="_blank" rel="noopener noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "5px 12px", borderRadius: 8,
      background: "#f8fafc", border: "1px solid #e2e8f0",
      textDecoration: "none",
    }}>
      <TpStars rating={B.tp} size={11} />
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: "#111827" }}>{B.tp}</span>
      <span style={{ fontSize: 10, color: "#64748b" }}>({formatTpCount(B.tpCount)})</span>
      <span style={{ fontSize: 10, color: "#64748b" }}>Trustpilot</span>
      <ExternalLink size={10} color="#94a3b8" />
    </a>
  </div>
);

// ── Full-width Trustpilot variants (Round 3b, based on C) ──

// C1 — Full-width bar: stretches edge-to-edge, light bg strip
const TpFullBar = ({ tpUrl, B }) => (
  <a href={tpUrl} target="_blank" rel="noopener noreferrer" style={{
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: "9px 16px",
    background: "#f8fafc",
    borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9",
    textDecoration: "none", marginTop: 10,
  }}>
    <TpStars rating={B.tp} size={12} />
    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: "#111827" }}>{B.tp}</span>
    <span style={{ fontSize: 10, color: "#64748b" }}>({formatTpCount(B.tpCount)})</span>
    <span style={{ fontSize: 10, color: "#64748b" }}>Trustpilot</span>
    <ExternalLink size={10} color="#94a3b8" />
  </a>
);

// C2 — Full-width with hairline dividers: minimal horizontal rule style
const TpFullDivider = ({ tpUrl, B }) => (
  <div style={{ padding: "0 16px", marginTop: 10 }}>
    <div style={{ height: 1, background: "#e2e8f0" }} />
    <a href={tpUrl} target="_blank" rel="noopener noreferrer" style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      padding: "8px 0",
      textDecoration: "none",
    }}>
      <TpStars rating={B.tp} size={12} />
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: "#111827" }}>{B.tp}</span>
      <span style={{ fontSize: 10, color: "#64748b" }}>({formatTpCount(B.tpCount)})</span>
      <span style={{ color: "#e2e8f0", fontSize: 10 }}>|</span>
      <span style={{ fontSize: 10, fontWeight: 600, color: "#64748b" }}>Trustpilot</span>
      <ExternalLink size={10} color="#94a3b8" />
    </a>
    <div style={{ height: 1, background: "#e2e8f0" }} />
  </div>
);

// C3 — Full-width green tint: subtle brand-colored bar
const TpFullGreen = ({ tpUrl, B }) => (
  <a href={tpUrl} target="_blank" rel="noopener noreferrer" style={{
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: "9px 16px",
    background: "#ecfdf5",
    borderTop: "1px solid #d1fae5", borderBottom: "1px solid #d1fae5",
    textDecoration: "none", marginTop: 10,
  }}>
    <TpStars rating={B.tp} size={12} />
    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: "#047857" }}>{B.tp}</span>
    <span style={{ fontSize: 10, color: "#059669" }}>({formatTpCount(B.tpCount)})</span>
    <span style={{ fontSize: 10, fontWeight: 600, color: "#047857" }}>Trustpilot</span>
    <ExternalLink size={10} color="#059669" />
  </a>
);

// ── Shared CTA block ──
const CTABlock = ({ visitUrl, reviewPath, B }) => (
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
);

// ── Shared card body (everything below identity) ──
// tpPosition: "pill" | "inline" | "compact" — style of Trustpilot after CTAs
function CardBody({ broker, rank, visitUrl, reviewPath, tpUrl, hasTp, tpStyle = "pill" }) {
  const B = broker.B;
  const thematic = MOCK_THEMATIC[broker.slug];
  const [analysisOpen, setAnalysisOpen] = useState(false);

  const tpMap = { pill: TpPill, inline: TpInline, compact: TpCompact, fullbar: TpFullBar, fulldiv: TpFullDivider, fullgreen: TpFullGreen };
  const TpComponent = tpMap[tpStyle] || TpPill;

  return (
    <>
      {/* CTA first */}
      <CTABlock visitUrl={visitUrl} reviewPath={reviewPath} B={B} />

      {/* Trustpilot AFTER CTAs */}
      {hasTp && <TpComponent tpUrl={tpUrl} B={B} />}

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
                {(thematic.prosDetail || thematic.consDetail) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginTop: 10 }}>
                    {thematic.prosDetail && (
                      <div>
                        <h4 style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 4 }}>Pros for forex trading</h4>
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
                        <h4 style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>Cons for forex trading</h4>
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
    </>
  );
}

// ── Card shell ──
function CardShell({ rank, children }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: rank === 1 ? "2px solid #059669" : "1px solid #e2e8f0",
      overflow: "hidden",
      boxShadow: rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
    }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════
// VARIANT A — Centered Horizontal Block
// Logo 72px left + Name/Type/Badge right, centered as a unit
// ═══════════════════════════════════════════
function VariantA({ broker, rank }) {
  const B = broker.B;
  const visitUrl = makeVisitUrl(broker.slug, B.url);
  const reviewPath = `/review/${broker.slug}`;
  const tpUrl = getTrustpilotUrl(broker.slug);
  const hasTp = B.tp && B.tp > 0 && tpUrl;

  return (
    <CardShell rank={rank}>
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

      {/* Centered horizontal identity block */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        justifyContent: "center",
        padding: "14px 16px 0",
      }}>
        <Link to={reviewPath} style={{ display: "flex", flexShrink: 0, textDecoration: "none" }}>
          <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={72} shape="icon" />
        </Link>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
            <Link to={reviewPath} style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18,
              color: "#111827", textDecoration: "none",
            }}>{B.name}</Link>
          </h3>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{B.type}</div>
          {B.badge && (
            <span style={{
              display: "inline-block", marginTop: 5, padding: "2px 10px", borderRadius: 6,
              fontSize: 11, fontWeight: 700, background: "#ecfdf5", color: "#059669",
            }}>{B.badge}</span>
          )}
        </div>
      </div>

      <CardBody broker={broker} rank={rank} visitUrl={visitUrl} reviewPath={reviewPath} tpUrl={tpUrl} hasTp={hasTp} tpStyle="fullbar" />
    </CardShell>
  );
}

// VariantB and VariantC share same identity, differ only in tpStyle
function makeVariant(tpStyle) {
  return function VariantX({ broker, rank }) {
    const B = broker.B;
    const visitUrl = makeVisitUrl(broker.slug, B.url);
    const reviewPath = `/review/${broker.slug}`;
    const tpUrl = getTrustpilotUrl(broker.slug);
    const hasTp = B.tp && B.tp > 0 && tpUrl;

    return (
      <CardShell rank={rank}>
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
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          justifyContent: "center", padding: "14px 16px 0",
        }}>
          <Link to={reviewPath} style={{ display: "flex", flexShrink: 0, textDecoration: "none" }}>
            <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={72} shape="icon" />
          </Link>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
              <Link to={reviewPath} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18, color: "#111827", textDecoration: "none" }}>{B.name}</Link>
            </h3>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{B.type}</div>
            {B.badge && <span style={{ display: "inline-block", marginTop: 5, padding: "2px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "#ecfdf5", color: "#059669" }}>{B.badge}</span>}
          </div>
        </div>
        <CardBody broker={broker} rank={rank} visitUrl={visitUrl} reviewPath={reviewPath} tpUrl={tpUrl} hasTp={hasTp} tpStyle={tpStyle} />
      </CardShell>
    );
  };
}

const VariantB = makeVariant("fulldiv");
const VariantC = makeVariant("fullgreen");

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
        Trustpilot Full-Width — Round 3b
      </h1>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
        Full-width Trustpilot bar below CTAs. 3 styles based on Compact (C).
      </p>

      {/* VARIANT A */}
      <h2 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, color: "#059669", marginBottom: 6 }}>
        A — Full-width bar (light gray strip)
      </h2>
      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>
        Edge-to-edge #f8fafc background, subtle hairline borders. Clean info strip.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {brokers.map((b, i) => <VariantA key={b.slug} broker={b} rank={i + 1} />)}
      </div>

      {/* VARIANT B */}
      <h2 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, color: "#2563eb", marginBottom: 6 }}>
        B — Full-width with hairline dividers
      </h2>
      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>
        No background, framed by two thin #e2e8f0 lines. Separator style.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {brokers.map((b, i) => <VariantB key={b.slug} broker={b} rank={i + 1} />)}
      </div>

      {/* VARIANT C */}
      <h2 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, color: "#7c3aed", marginBottom: 6 }}>
        C — Full-width green tint strip
      </h2>
      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>
        Brand-colored #ecfdf5 background, green text. Ties into CTA color system.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {brokers.map((b, i) => <VariantC key={b.slug} broker={b} rank={i + 1} />)}
      </div>
    </div>
  );
}
