/**
 * SCORE BADGE PROTOTYPES — 6 variants of the score indicator
 * Shown in context of the Top Rated Brokers compact card grid
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokersWithData } from "../data/brokers";
import BrokerLogo from "../components/BrokerLogo";
import RegBadge from "../components/RegBadge";
import { ArrowRight } from "lucide-react";
import { getVisitUrl } from "../utils/visitUrl";

/* ── Wide logo (simplified from BrokerRankCard) ── */
const WIDE_EXT = { "charles-schwab": "png" };
function WideLogo({ slug, name, fallback, w = 200, h = 60 }) {
  const [err, setErr] = useState(false);
  const ext = WIDE_EXT[slug] || "svg";
  const bg = "linear-gradient(135deg, #0a2018, #0f172a)";
  if (err) {
    return (
      <div style={{ background: bg, borderRadius: 12, padding: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", width: w, height: h }}>
        <BrokerLogo slug={slug} name={name} fallback={fallback} size={h - 8} shape="brand" borderRadius={8} />
      </div>
    );
  }
  return (
    <div style={{
      borderRadius: 12, overflow: "hidden", display: "inline-flex",
      alignItems: "center", justifyContent: "center",
      height: h, width: w, flexShrink: 0, background: bg,
      border: "1px solid #1a3d30",
    }}>
      <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${slug}.${ext}`}
        alt={name} style={{ maxWidth: "85%", maxHeight: "70%", objectFit: "contain" }}
        onError={() => setErr(true)} />
    </div>
  );
}

const VERTICAL_MAP = {
  forex: { label: "Forex", color: "#059669" },
  cfd: { label: "CFD", color: "#2563eb" },
  stocks: { label: "Stocks", color: "#0ea5e9" },
  crypto: { label: "Crypto", color: "#f59e0b" },
  options: { label: "Options", color: "#8b5cf6" },
  futures: { label: "Futures", color: "#ea580c" },
  "copy-trading": { label: "Copy", color: "#7c3aed" },
  "spread-betting": { label: "SB", color: "#dc2626" },
};

const VARIANTS = [
  { key: "B", label: "Current (ScoreBadge)", desc: "Outlined rounded square + label — current standard on ranking pages" },
  { key: "B2", label: "Outlined + Shadow", desc: "Same as B but with subtle shadow and slightly larger" },
  { key: "C", label: "Ring Progress", desc: "SVG circular progress ring around score number" },
  { key: "F", label: "Gradient Card", desc: "Score in colored gradient mini-card with label below" },
];

function scoreColor(s) { return s >= 9.0 ? "#059669" : s >= 8.0 ? "#2563eb" : "#d97706"; }
function scoreBg(s) { return s >= 9.0 ? "#ecfdf5" : s >= 8.0 ? "#eff6ff" : "#fffbeb"; }
function scoreLabel(s) { return s >= 9.5 ? "Excellent" : s >= 9.0 ? "Great" : s >= 8.5 ? "Very Good" : "Good"; }

/* ── VARIANT B: Outlined rounded square + label (ScoreBadge.jsx style — current standard) ── */
function BadgeB({ score }) {
  const c = scoreColor(score);
  const bg = scoreBg(score);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: 48, height: 48, borderRadius: 10,
        background: bg, border: `2px solid ${c}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 2,
      }}>
        <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 16, color: c }}>{score}</span>
      </div>
      <span style={{ fontSize: 10, color: c, fontWeight: 600 }}>{scoreLabel(score)}</span>
    </div>
  );
}

/* ── VARIANT C: Ring progress circle ── */
function BadgeC({ score }) {
  const c = scoreColor(score);
  const pct = (score / 10) * 100;
  const r = 20, cx = 24, cy = 24, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position: "relative", width: 48, height: 48 }}>
      <svg width={48} height={48} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={3} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={3}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 13, color: c,
      }}>{score}</div>
    </div>
  );
}

/* ── VARIANT B2: Outlined + shadow (enhanced B) ── */
function BadgeB2({ score }) {
  const c = scoreColor(score);
  const bg = scoreBg(score);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12,
        background: bg, border: `2px solid ${c}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 2,
        boxShadow: `0 4px 12px ${c}25`,
      }}>
        <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 18, color: c }}>{score}</span>
      </div>
      <span style={{ fontSize: 11, color: c, fontWeight: 700 }}>{scoreLabel(score)}</span>
    </div>
  );
}

/* ── VARIANT F: Gradient mini-card ── */
function BadgeF({ score }) {
  const grad = score >= 9.0
    ? "linear-gradient(135deg, #059669, #047857)"
    : score >= 8.0
    ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
    : "linear-gradient(135deg, #d97706, #b45309)";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: 52, height: 40, borderRadius: 10,
        background: grad,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}>
        <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 16, color: "#fff" }}>{score}</span>
      </div>
      <span style={{ fontSize: 10, color: scoreColor(score), fontWeight: 600, marginTop: 2, display: "block" }}>{scoreLabel(score)}</span>
    </div>
  );
}

const BADGE_COMPONENTS = { B: BadgeB, B2: BadgeB2, C: BadgeC, F: BadgeF };

export default function ScoreBadgeProto() {
  const { mob, tab } = useMedia();
  const [active, setActive] = useState("B");
  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const Badge = BADGE_COMPONENTS[active];

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* Switcher */}
      <div style={{
        position: "sticky", top: 64, zIndex: 900,
        background: "#0f172a", borderBottom: "1px solid #1e293b",
        padding: mob ? "8px 12px" : "10px 24px",
        display: "flex", gap: mob ? 4 : 8, overflowX: "auto",
        justifyContent: mob ? "flex-start" : "center",
      }}>
        {VARIANTS.map(v => (
          <button key={v.key} onClick={() => setActive(v.key)} style={{
            padding: mob ? "6px 10px" : "8px 16px",
            borderRadius: 8, border: "1px solid",
            borderColor: active === v.key ? "#f59e0b" : "rgba(255,255,255,0.12)",
            background: active === v.key ? "#f59e0b" : "transparent",
            color: active === v.key ? "#0f172a" : "rgba(255,255,255,0.5)",
            fontSize: mob ? 11 : 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
            whiteSpace: "nowrap", transition: "all 0.15s",
          }}>{v.key}: {v.label}</button>
        ))}
      </div>

      {/* Label */}
      <div style={{
        textAlign: "center", padding: "10px 16px",
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        fontSize: 13, color: "#6b7280",
      }}>
        <strong style={{ color: "#0f172a" }}>Variant {active}: {VARIANTS.find(v => v.key === active)?.label}</strong>{" "}
        <span>{VARIANTS.find(v => v.key === active)?.desc}</span>
      </div>

      {/* Cards */}
      <section style={{ padding: mob ? "32px 16px" : "48px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "0" : "0 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Top Rated Brokers
            </h2>
            <Link to="/reviews" style={{ fontSize: 13, fontWeight: 600, color: "#059669", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              All {allBrokers.length} reviews <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: mob ? 12 : 16,
          }}>
            {allBrokers.slice(0, 6).map((broker, i) => {
              const b = broker.B;
              const visitUrl = getVisitUrl(broker.slug, b.url);
              return (
                <div key={broker.slug} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: mob ? "16px" : "20px",
                  background: "#fff",
                  borderRadius: 14, border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"; }}
                >
                  <Link to={`/review/${broker.slug}`} style={{
                    width: 56, height: 56, borderRadius: 14, overflow: "hidden", flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.04)",
                    textDecoration: "none",
                  }}>
                    <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={56} shape="icon" />
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/review/${broker.slug}`} style={{
                      fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15,
                      letterSpacing: "-0.01em", color: "#0f172a", textDecoration: "none", display: "block",
                    }}>{b.name}</Link>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{b.type}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      {(b.verticals || []).slice(0, 3).map(v => {
                        const vm = VERTICAL_MAP[v];
                        return vm ? <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, color: "#64748b" }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: vm.color }} />{vm.label}
                        </span> : null;
                      })}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <Badge score={b.score} />
                    <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                      padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                      background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                      textDecoration: "none",
                    }}>Visit</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ RANKING CARDS (BrokerRankCard style) ═══ */}
      <section style={{ padding: mob ? "16px 16px 48px" : "16px 24px 64px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "0" : "0 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 20 : 26, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Ranking Card Preview
            </h2>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Same badge style as above</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {allBrokers.slice(0, 3).map((broker, i) => {
              const b = broker.B;
              const rank = i + 1;
              const visitUrl = getVisitUrl(broker.slug, b.url);
              return (
                <div key={broker.slug} style={{
                  background: "#fff", borderRadius: 16,
                  border: rank === 1 ? "2px solid #059669" : "1px solid #e2e8f0",
                  overflow: "hidden",
                  boxShadow: rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
                }}>
                  {/* Top row: rank + logo + name + stats + score */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 20,
                    padding: mob ? "16px" : "20px 28px",
                  }}>
                    {/* Rank */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: "#ecfdf5", border: "1px solid #a7f3d0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 15, color: "#059669",
                      flexShrink: 0,
                    }}>#{rank}</div>

                    {/* Wide logo */}
                    <Link to={`/review/${broker.slug}`} style={{ display: "flex", flexShrink: 0, textDecoration: "none" }}>
                      <WideLogo slug={broker.slug} name={b.name} fallback={b.logo} w={200} h={60} />
                    </Link>

                    {/* Name + type */}
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                        <Link to={`/review/${broker.slug}`} style={{
                          fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 16,
                          color: "#111827", textDecoration: "none",
                        }}>{b.name}</Link>
                        {rank === 1 && (
                          <span style={{
                            padding: "1px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                            background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d",
                          }}>Editor's Choice 2026</span>
                        )}
                      </h3>
                      <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{b.type}</div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: 20, marginLeft: "auto" }}>
                      {[
                        ["SPREAD", `${b.spread} pips`],
                        ["MIN DEP", b.minDep === 0 ? "$0" : `$${b.minDep}`],
                        ["LEVERAGE", b.leverage],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 15, fontWeight: 700, color: "#111827", marginTop: 2 }}>{val}</div>
                        </div>
                      ))}
                    </div>

                    {/* Score badge — same variant as above */}
                    <Badge score={b.score} />
                  </div>

                  {/* Bottom: regs + CTA */}
                  <div style={{
                    padding: mob ? "0 16px 16px" : "0 28px 20px",
                    borderTop: "1px solid #f1f5f9", paddingTop: 14,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", gap: 12,
                  }}>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      {b.regs.slice(0, 4).map((r) => <RegBadge key={r.name} reg={r.name} />)}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-primary" style={{
                        padding: "12px 20px", borderRadius: 10, textAlign: "center",
                        background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                        color: "#0f172a", fontWeight: 700, fontSize: 14, textDecoration: "none",
                      }}>Open Account →</a>
                      <Link to={`/review/${broker.slug}`} className="cta-secondary" style={{
                        padding: "11px 16px", borderRadius: 10, textAlign: "center",
                        background: "#fff", color: "#059669", fontWeight: 700, fontSize: 14,
                        textDecoration: "none", border: "2px solid #059669",
                      }}>Read Review</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
