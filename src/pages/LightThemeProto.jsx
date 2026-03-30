import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import RegBadge from "../components/RegBadge";
import BrokerLogo from "../components/BrokerLogo";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import { getBrokersForRanking } from "../data/rankingFilters";
import { getBrokerBlurb } from "../data/rankingThematic";
import { getBrokerData } from "../data/brokers/index";
import TrustpilotLogo from "../components/TrustpilotLogo";
import Icon from "../components/Icon";
import { Check, X as XIcon, ChevronDown, ArrowRight, ExternalLink } from "lucide-react";

/* ── Wide logo (dark text on white/transparent bg — from logos-wide/) ── */
const WIDE_EXT = { "capital-com":"png","libertex":"png","fxpro":"jpg" };
const LOGO_BG = {
  "activtrades":"#fff","admirals":"#fff","avatrade":"#fff","axi":"#fff",
  "blackbull":"#fff","capital-com":"#fff","city-index":"#fff","cmc-markets":"#fff",
  "dukascopy":"#fff","eightcap":"#fff","etoro":"#fff","exness":"#ffde02",
  "forex-com":"#fff","fp-markets":"#fff","fusion-markets":"#fff","fxcm":"#fff",
  "fxpro":"#f31112","fxtm":"#fff","go-markets":"#fff","hfm":"#fff",
  "ic-markets":"#fff","ig":"#fff","interactive-brokers":"#fff","libertex":"#fff",
  "naga":"#fff","oanda":"#fff","pepperstone":"#fff","plus500":"#fff",
  "roboforex":"#fff","saxo-bank":"#fff","spreadex":"#fff","swissquote":"#fff",
  "thinkmarkets":"#fff","tickmill":"#fff","trading-212":"#000","vantage":"#fff",
  "xm":"#1a1a2e","xtb":"#fff",
};

/* ── WideLogo — light version (no border, breathes on light bg) ── */
function WideLogo({ slug, name, fallback, w = 200, h = 64, radius = 12, border, shadow }) {
  const [err, setErr] = useState(false);
  const ext = WIDE_EXT[slug] || "svg";
  const bg = LOGO_BG[slug] || "#fff";
  const isRaster = ext !== "svg";
  if (err) {
    return (
      <div style={{ background: bg, borderRadius: radius, padding: 4, display: "inline-flex" }}>
        <BrokerLogo slug={slug} name={name} fallback={fallback} size={h} shape="brand" borderRadius={radius - 4} />
      </div>
    );
  }
  return (
    <div style={{
      borderRadius: radius, overflow: "hidden", display: "inline-flex",
      alignItems: "center", justifyContent: "center",
      height: h, width: w, flexShrink: 0, background: bg,
      border: border || "none",
      boxShadow: shadow || "none",
    }}>
      <img
        src={`${import.meta.env.BASE_URL}logos-wide/${slug}.${ext}`}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setErr(true)}
        style={{
          width: bg !== "#fff" && isRaster ? "100%" : "70%",
          height: bg !== "#fff" && isRaster ? "100%" : "70%",
          objectFit: bg !== "#fff" && isRaster ? "cover" : "contain",
        }}
      />
    </div>
  );
}

/* ── Helpers ── */
const TpStars = ({ rating = 0, size = 14 }) => {
  const full = Math.floor(rating);
  const partial = rating - full;
  const empty = 5 - full - (partial > 0 ? 1 : 0);
  const starPath = "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z";
  const uid = `tp-clip-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
      {Array.from({ length: full }, (_, i) => (
        <svg key={`f${i}`} width={size} height={size} viewBox="0 0 24 24"><path d={starPath} fill="#00B67A" /></svg>
      ))}
      {partial > 0 && (
        <svg key="p" width={size} height={size} viewBox="0 0 24 24">
          <defs><clipPath id={uid}><rect x="0" y="0" width={24 * partial} height="24" /></clipPath></defs>
          <path d={starPath} fill="#dcdce6" /><path d={starPath} fill="#00B67A" clipPath={`url(#${uid})`} />
        </svg>
      )}
      {Array.from({ length: empty }, (_, i) => (
        <svg key={`e${i}`} width={size} height={size} viewBox="0 0 24 24"><path d={starPath} fill="#dcdce6" /></svg>
      ))}
    </span>
  );
};

const formatTpCount = (n) => {
  if (!n) return "";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
};

import { getVisitUrl as makeVisitUrl } from "../utils/visitUrl";

const scoreLabel = (s) => s >= 9.5 ? "Excellent" : s >= 9.0 ? "Great" : s >= 8.5 ? "Very Good" : "Good";

function Stars({ r, size = 15 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{
          width: size, height: size,
          background: i <= Math.floor(r) ? "#00B67A" : i - 0.5 <= r ? "linear-gradient(90deg,#00B67A 50%,#d1d5db 50%)" : "#d1d5db",
          clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
        }} />
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
 *  THEME DEFINITIONS — 3 Light Theme variants
 * ═══════════════════════════════════════════════════════════════ */

const THEMES = {
  /* A: "Clean White" — NerdWallet-inspired */
  white: {
    name: "Clean White",
    desc: "Чисто белый фон, зелёный акцент. Паттерн NerdWallet/Bankrate. Логотип дышит на белом, максимум разборчивости.",
    heroBg: "#fff",
    heroBorder: "3px solid #059669",
    heroTextColor: "#0f172a",
    heroSubColor: "#64748b",
    scoreBg: "#ecfdf5",
    scoreBorder: "2px solid #059669",
    scoreColor: "#059669",
    statLabelColor: "#64748b",
    statValueColor: "#0f172a",
    statBg: "#f8fafc",
    cardBg: "#fff",
    cardBorder: "1px solid #e2e8f0",
    cardWinnerBorder: "2px solid #059669",
    rankBg: "#ecfdf5",
    rankBorder: "1px solid #a7f3d0",
    rankColor: "#059669",
    primaryCta: { bg: "#059669", color: "#fff", shadow: "0 2px 8px rgba(5,150,105,0.25)" },
    secondaryCta: { bg: "#fff", color: "#0f172a", border: "2px solid #0f172a" },
    accentColor: "#059669",
    logoBorder: "1px solid #e2e8f0",
    logoShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },

  /* B: "Warm Cream" — Investopedia-inspired */
  cream: {
    name: "Warm Cream",
    desc: "Тёплый кремовый фон, оранжевый акцент. Investopedia-стиль. Премиальное, approachable ощущение.",
    heroBg: "#faf8f5",
    heroBorder: "3px solid #f59e0b",
    heroTextColor: "#1a1a2e",
    heroSubColor: "#6b7280",
    scoreBg: "#fffbeb",
    scoreBorder: "2px solid #f59e0b",
    scoreColor: "#d97706",
    statLabelColor: "#6b7280",
    statValueColor: "#1a1a2e",
    statBg: "#f5f0eb",
    cardBg: "#fff",
    cardBorder: "1px solid #e5e0d8",
    cardWinnerBorder: "2px solid #f59e0b",
    rankBg: "#fffbeb",
    rankBorder: "1px solid #fde68a",
    rankColor: "#d97706",
    primaryCta: { bg: "#f59e0b", color: "#0f172a", shadow: "0 2px 8px rgba(245,158,11,0.3)" },
    secondaryCta: { bg: "#faf8f5", color: "#1a1a2e", border: "2px solid #1a1a2e" },
    accentColor: "#f59e0b",
    logoBorder: "1px solid #e5e0d8",
    logoShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },

  /* C: "Navy Authority" — Bankrate-inspired */
  navy: {
    name: "Navy Authority",
    desc: "Белый фон с navy структурными элементами. Bankrate-стиль. Авторитетный, институциональный feel.",
    heroBg: "#fff",
    heroBorder: "3px solid #0f172a",
    heroTextColor: "#0f172a",
    heroSubColor: "#475569",
    scoreBg: "#0f172a",
    scoreBorder: "2px solid #0f172a",
    scoreColor: "#34d399",
    statLabelColor: "#475569",
    statValueColor: "#0f172a",
    statBg: "#f1f5f9",
    cardBg: "#fff",
    cardBorder: "1px solid #e2e8f0",
    cardWinnerBorder: "2px solid #0f172a",
    rankBg: "#0f172a",
    rankBorder: "1px solid #0f172a",
    rankColor: "#fff",
    primaryCta: { bg: "#0f172a", color: "#fff", shadow: "0 2px 8px rgba(15,23,42,0.2)" },
    secondaryCta: { bg: "#f8fafc", color: "#0f172a", border: "2px solid #e2e8f0" },
    accentColor: "#0f172a",
    logoBorder: "1px solid #e2e8f0",
    logoShadow: "0 2px 8px rgba(15,23,42,0.06)",
  },
};


/* ═══════════════════════════════════════════════════════════════
 *  LIGHT REVIEW HERO — shows hero section of review page
 * ═══════════════════════════════════════════════════════════════ */
function LightReviewHero({ slug, theme, mob, tab }) {
  const data = getBrokerData(slug);
  if (!data) return null;
  const { B } = data;
  const T = THEMES[theme];
  const lp = useLocalePath();
  const visitUrl = makeVisitUrl(slug, B.url);
  const hasTp = B.tp && B.tp > 0;

  return (
    <div style={{
      borderTop: T.heroBorder,
      background: T.heroBg,
      borderBottom: "1px solid #e2e8f0",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: mob ? "24px 16px 28px" : tab ? "32px 24px 36px" : "36px 24px 44px",
      }}>
        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", justifyContent: "space-between", gap: mob ? 20 : 32 }}>
          <div style={{ flex: 1 }}>
            {/* Logo + Title */}
            <div style={{ display: "flex", alignItems: mob ? "flex-start" : "center", gap: mob ? 12 : 16, marginBottom: 14 }}>
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{ display: "flex", flexShrink: 0, textDecoration: "none" }}>
                <WideLogo
                  slug={slug} name={B.name} fallback={B.logo}
                  w={mob ? 180 : 260} h={mob ? 56 : 80} radius={12}
                  border={T.logoBorder} shadow={T.logoShadow}
                />
              </a>
              <div>
                <h1 style={{
                  fontFamily: "Outfit", fontSize: mob ? 20 : 26, fontWeight: 800,
                  color: T.heroTextColor, letterSpacing: "-0.02em", margin: 0,
                }}>{B.name} Review 2026</h1>
                <p style={{ fontSize: mob ? 13 : 15, color: T.heroSubColor, margin: "4px 0 0" }}>
                  {B.type} Broker · Est. {B.year}{!mob && ` · ${B.hq}`}
                </p>
              </div>
            </div>

            {/* Score + TP + Regs row */}
            <div style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 16, flexWrap: "wrap", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  background: T.scoreBg, border: T.scoreBorder, borderRadius: 8,
                  padding: "4px 10px",
                  fontFamily: "'JetBrains Mono'", fontSize: mob ? 16 : 18, fontWeight: 800,
                  color: T.scoreColor,
                }}>{B.score}</div>
                <span style={{ fontSize: mob ? 12 : 14, fontWeight: 600, color: T.scoreColor }}>
                  {scoreLabel(B.score)}
                </span>
              </div>
              {!mob && <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />}
              {hasTp && (
                <a href={getTrustpilotUrl(slug)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                  <TrustpilotLogo size="xs" />
                  <Stars r={B.tp} size={14} />
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: "#111827" }}>{B.tp}</span>
                  <span style={{ fontSize: 13, color: "#64748b" }}>({B.tpCount.toLocaleString()})</span>
                </a>
              )}
              {!mob && (
                <>
                  <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />
                  <div style={{ display: "flex", gap: 4 }}>
                    {B.regs.filter(r => r.tier === 1).map(r => <RegBadge key={r.name} reg={r.name} />)}
                  </div>
                </>
              )}
              {B.badge && (
                <span style={{
                  background: theme === "cream" ? "#fffbeb" : "#ecfdf5",
                  color: theme === "cream" ? "#d97706" : "#059669",
                  fontSize: mob ? 10 : 11, fontWeight: 600,
                  padding: "3px 10px", borderRadius: 5,
                  border: `1px solid ${theme === "cream" ? "#fde68a" : "#a7f3d0"}`,
                }}>🏆 {B.badge}</span>
              )}
            </div>

            {/* Stats grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: mob ? "repeat(3,1fr)" : "repeat(5,auto)",
              gap: mob ? 8 : 20,
            }}>
              {[
                { l: "Spread", v: `${B.spread} pips` },
                { l: "Commission", v: B.commission },
                { l: "Min Deposit", v: `$${B.minDep}` },
                ...(!mob ? [{ l: "Leverage", v: B.leverage }, { l: "Instruments", v: B.instruments }] : []),
              ].map((x, i) => (
                <div key={i} style={mob ? {
                  textAlign: "center", padding: "6px", background: T.statBg, borderRadius: 6,
                } : {}}>
                  <div style={{
                    fontSize: mob ? 10 : 12, color: T.statLabelColor, fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2,
                  }}>{x.l}</div>
                  <div style={{ fontSize: mob ? 14 : 15, color: T.statValueColor, fontWeight: 700 }}>{x.v}</div>
                </div>
              ))}
            </div>

            {/* Mobile CTA */}
            {mob && (
              <a href={visitUrl} target="_blank" rel="nofollow sponsored" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: T.primaryCta.bg, color: T.primaryCta.color,
                fontSize: 15, fontWeight: 700, textDecoration: "none",
                padding: "12px", borderRadius: 10, marginTop: 14,
                boxShadow: T.primaryCta.shadow,
              }}>Visit {B.name} <ArrowRight size={14} /></a>
            )}
          </div>

          {/* Desktop sidebar score card */}
          {!mob && (
            <div style={{
              width: tab ? 220 : 260, flexShrink: 0,
              background: theme === "navy" ? "#0f172a" : T.statBg,
              border: theme === "navy" ? "1px solid rgba(255,255,255,0.1)" : `1px solid ${T.accentColor}20`,
              borderRadius: 16, padding: tab ? "18px" : "22px", textAlign: "center",
            }}>
              <div style={{
                fontSize: 13, fontWeight: 600, marginBottom: 4,
                color: theme === "navy" ? "rgba(255,255,255,0.6)" : T.heroSubColor,
              }}>Our Rating</div>
              <div style={{
                fontFamily: "'JetBrains Mono'", fontSize: 40, fontWeight: 800, lineHeight: 1,
                color: theme === "navy" ? "#34d399" : T.scoreColor,
              }}>{B.score}</div>
              <div style={{
                fontSize: 13, fontWeight: 600, marginBottom: 10,
                color: theme === "navy" ? "#34d399" : T.scoreColor,
              }}>{scoreLabel(B.score)}</div>
              {B.promo && (
                <div style={{
                  fontSize: 12, fontWeight: 600, marginBottom: 12, padding: "5px 8px", borderRadius: 6,
                  display: "flex", alignItems: "center", gap: 4, justifyContent: "center",
                  background: theme === "navy" ? "rgba(255,255,255,0.08)" : `${T.accentColor}10`,
                  color: theme === "navy" ? "rgba(255,255,255,0.7)" : T.heroSubColor,
                }}>
                  <Icon name="lightbulb" size={13} color="#f59e0b" /> {B.promo}
                </div>
              )}
              <a href={visitUrl} target="_blank" rel="nofollow sponsored" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: theme === "navy" ? "#f59e0b" : T.primaryCta.bg,
                color: theme === "navy" ? "#0f172a" : T.primaryCta.color,
                fontSize: 16, fontWeight: 700, textDecoration: "none",
                padding: "13px 24px", borderRadius: 10, width: "100%",
                boxShadow: theme === "navy" ? "0 4px 12px rgba(245,158,11,0.3)" : T.primaryCta.shadow,
              }}>
                Visit {B.name} ↗
              </a>
              <div style={{
                fontSize: 11, marginTop: 8,
                color: theme === "navy" ? "rgba(255,255,255,0.4)" : "#94a3b8",
              }}>CFDs are complex instruments</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
 *  LIGHT RANKING CARD — ranking card for light themes
 * ═══════════════════════════════════════════════════════════════ */
function LightRankCard({ broker, rank, thematic, mob, tab, theme }) {
  const lp = useLocalePath();
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const B = broker.B;
  const T = THEMES[theme];
  const reviewPath = lp(`/review/${broker.slug}`);
  const visitUrl = makeVisitUrl(broker.slug, B.url);
  const hasTp = B.tp && B.tp > 0;
  const isWinner = rank === 1;

  /* ── CTA buttons ── */
  const CTAButtons = ({ direction = "column" }) => (
    <div style={{ display: "flex", gap: 8, flexDirection: direction }}>
      <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
        flex: 1, minWidth: direction === "row" ? 170 : "auto",
        padding: "12px 20px", borderRadius: 10, textAlign: "center",
        background: T.primaryCta.bg, color: T.primaryCta.color,
        fontWeight: 700, fontSize: 15, textDecoration: "none",
        boxShadow: T.primaryCta.shadow,
      }}>
        <span>Open {B.name} Account →</span>
        {B.promo && <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.75, marginTop: 2 }}>{B.promo}</span>}
      </a>
      <Link to={reviewPath} style={{
        flex: 1, minWidth: direction === "row" ? 140 : "auto",
        padding: "11px 16px", borderRadius: 10, textAlign: "center",
        background: T.secondaryCta.bg, color: T.secondaryCta.color,
        fontWeight: 700, fontSize: 14, textDecoration: "none",
        border: T.secondaryCta.border,
      }}>
        <span>Read Full Review</span>
        <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.7, marginTop: 1 }}>{B.score}/10 · Expert tested</span>
      </Link>
    </div>
  );

  /* ── TP bar ── */
  const TpBar = () => (
    hasTp && getTrustpilotUrl(broker.slug) ? (
      <a href={getTrustpilotUrl(broker.slug)} target="_blank" rel="noopener noreferrer" style={{
        display: "flex", alignItems: "center", justifyContent: mob ? "center" : "flex-start",
        gap: 6, padding: mob ? "9px 16px" : "0",
        background: mob ? "#f8fafc" : "none",
        borderTop: mob ? "1px solid #f1f5f9" : "none",
        borderBottom: mob ? "1px solid #f1f5f9" : "none",
        textDecoration: "none",
      }}>
        <TpStars rating={B.tp} size={mob ? 12 : 14} />
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 12 : 13, fontWeight: 700, color: "#111827" }}>{B.tp}</span>
        <span style={{ fontSize: mob ? 10 : 12, color: "#64748b" }}>({formatTpCount(B.tpCount)} reviews)</span>
        {mob && <ExternalLink size={10} color="#94a3b8" />}
      </a>
    ) : null
  );

  /* ── Thematic ── */
  const ThematicSection = ({ pad }) => (
    thematic ? (
      <div style={{ padding: pad }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 }}>{thematic.why}</div>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", margin: "0 0 10px", maxWidth: mob ? "none" : 900 }}>{thematic.text}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {thematic.pros.map((p, i) => (
            <span key={`p${i}`} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 16, fontSize: 12, fontWeight: 500, background: "#ecfdf5", color: "#047857" }}>
              <Check size={10} /> {p}
            </span>
          ))}
          {thematic.cons.map((c, i) => (
            <span key={`c${i}`} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 16, fontSize: 12, fontWeight: 500, background: "#fef2f2", color: "#b91c1c" }}>
              <XIcon size={10} /> {c}
            </span>
          ))}
        </div>
        {thematic.analysis && (
          <div style={{ marginBottom: 10 }}>
            <button onClick={() => setAnalysisOpen(!analysisOpen)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 0",
              border: "none", background: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, color: "#2563eb", fontFamily: "inherit",
            }}>
              {analysisOpen ? "Hide full analysis" : "🔎 Read our full analysis"}
              <span style={{ transition: "transform 0.2s", transform: analysisOpen ? "rotate(180deg)" : "none", display: "inline-flex" }}><ChevronDown size={14} /></span>
            </button>
            {analysisOpen && (
              <div style={{ background: "#f8fafc", borderRadius: 8, padding: 14 }}>
                {thematic.analysis.split("\n\n").map((p, i) => (
                  <p key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", marginBottom: 8 }}>{p}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    ) : null
  );

  // ═══════════════════════════
  // MOBILE
  // ═══════════════════════════
  if (mob) {
    return (
      <div style={{
        background: T.cardBg, borderRadius: 16,
        border: isWinner ? T.cardWinnerBorder : T.cardBorder,
        overflow: "hidden",
        boxShadow: isWinner ? `0 4px 16px ${T.accentColor}15` : "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        {/* Header: rank + score */}
        <div style={{ padding: "16px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: T.rankBg, border: T.rankBorder,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 14,
            color: T.rankColor,
          }}>#{rank}</div>
          <div style={{ textAlign: "center" }}>
            <div style={{
              background: T.scoreBg, border: T.scoreBorder,
              borderRadius: 10, padding: "4px 10px",
              fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 800,
              color: T.scoreColor,
            }}>{B.score}</div>
            <div style={{ fontSize: 11, color: T.scoreColor, fontWeight: 600, marginTop: 2 }}>{scoreLabel(B.score)}</div>
          </div>
        </div>

        {/* Logo + Name — centered */}
        <div style={{ padding: "14px 16px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Link to={reviewPath} style={{ display: "flex", textDecoration: "none" }}>
            <WideLogo slug={broker.slug} name={B.name} fallback={B.logo}
              w={200} h={64} radius={12}
              border={T.logoBorder} shadow={T.logoShadow}
            />
          </Link>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              <Link to={reviewPath} style={{ color: T.heroTextColor, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>{B.name}</Link>
            </h3>
            <div style={{ fontSize: 13, color: T.heroSubColor, marginTop: 2 }}>{B.type}</div>
            {B.badge && (
              <span style={{
                display: "inline-block", marginTop: 5, padding: "2px 10px", borderRadius: 6,
                fontSize: 11, fontWeight: 700,
                background: theme === "cream" ? "#fffbeb" : "#ecfdf5",
                color: theme === "cream" ? "#d97706" : "#047857",
                border: `1px solid ${theme === "cream" ? "#fde68a" : "#a7f3d0"}`,
              }}>{B.badge}</span>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ padding: "14px 16px 8px" }}>
          <CTAButtons direction="column" />
        </div>

        <TpBar />

        {B.riskWarning && <div style={{ padding: "4px 16px 8px", fontSize: 12, color: "#374151", textAlign: "center" }}>{B.riskWarning}</div>}

        <div style={{ padding: "0 16px 10px", display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {B.regs.slice(0, 3).map((r) => <RegBadge key={r.name} reg={r.name} />)}
          {B.regs.length > 3 && <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>+{B.regs.length - 3}</span>}
        </div>

        {/* Stats grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1,
          background: "#f1f5f9", margin: "0 16px", borderRadius: 10, overflow: "hidden",
        }}>
          {[["Spread", `${B.spread} pips`], ["Min Dep", B.minDep === 0 ? "$0" : `$${B.minDep}`], ["Leverage", B.leverage]].map(([label, val]) => (
            <div key={label} style={{ background: T.statBg, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: T.statLabelColor, fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: T.statValueColor, marginTop: 2, whiteSpace: "nowrap" }}>{val}</div>
            </div>
          ))}
        </div>

        <ThematicSection pad="12px 16px 12px" />
      </div>
    );
  }

  // ═══════════════════════════
  // DESKTOP / TABLET
  // ═══════════════════════════
  return (
    <div style={{
      background: T.cardBg, borderRadius: 16,
      border: isWinner ? T.cardWinnerBorder : T.cardBorder,
      boxShadow: isWinner ? `0 4px 16px ${T.accentColor}15` : "0 1px 4px rgba(0,0,0,0.04)",
      overflow: "hidden",
    }}>
      {/* Main row */}
      <div style={{
        padding: tab ? "18px 20px" : "20px 28px",
        display: "flex", alignItems: "center", gap: tab ? 16 : 24,
      }}>
        {/* Rank */}
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: T.rankBg, border: T.rankBorder,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
          fontSize: 16, color: T.rankColor,
        }}>#{rank}</div>

        {/* Logo + Name */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
          <Link to={reviewPath} style={{ display: "flex", flexShrink: 0, textDecoration: "none" }}>
            <WideLogo slug={broker.slug} name={B.name} fallback={B.logo}
              w={tab ? 160 : 200} h={tab ? 52 : 60} radius={12}
              border={T.logoBorder} shadow={T.logoShadow}
            />
          </Link>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <Link to={reviewPath} style={{ color: T.heroTextColor, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>{B.name}</Link>
              {B.badge && (
                <span style={{
                  padding: "1px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
                  background: theme === "cream" ? "#fffbeb" : "#ecfdf5",
                  color: theme === "cream" ? "#d97706" : "#047857",
                  border: `1px solid ${theme === "cream" ? "#fde68a" : "#a7f3d0"}`,
                }}>{B.badge}</span>
              )}
            </h3>
            <div style={{ fontSize: 13, color: T.heroSubColor, marginTop: 2 }}>{B.type}</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: tab ? 14 : 20 }}>
          {[["Spread", `${B.spread} pips`], ["Min Dep", B.minDep === 0 ? "$0" : `$${B.minDep}`], ["Leverage", B.leverage]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: T.statLabelColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{label}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: T.statValueColor, marginTop: 2, whiteSpace: "nowrap" }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Score */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            background: T.scoreBg, border: T.scoreBorder,
            borderRadius: 10, width: 52, height: 52,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 800,
            color: T.scoreColor,
          }}>{B.score}</div>
          <div style={{ fontSize: 11, color: T.scoreColor, fontWeight: 600, marginTop: 2 }}>{scoreLabel(B.score)}</div>
        </div>
      </div>

      {/* Bottom content area */}
      <div style={{
        padding: tab ? "0 20px 16px" : "0 28px 20px",
        borderTop: `1px solid ${theme === "cream" ? "#f0ebe4" : "#f1f5f9"}`,
        paddingTop: 14,
      }}>
        {/* Regs + TP */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {B.regs.slice(0, 4).map((r) => <RegBadge key={r.name} reg={r.name} />)}
          </div>
          <TpBar />
        </div>

        <ThematicSection pad="0" />

        <CTAButtons direction="row" />

        {B.riskWarning && <div style={{ padding: "8px 0 0", fontSize: 12, color: "#374151", textAlign: "center" }}>{B.riskWarning}</div>}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
 *  PAGE — Light Theme Prototypes
 * ═══════════════════════════════════════════════════════════════ */
export default function LightThemeProto() {
  const { mob, tab } = useMedia();
  const allBrokers = getBrokersForRanking("forex-overall");

  // Use specific brokers the user mentioned + top ones
  const targetSlugs = ["pepperstone", "ic-markets", "fxtm", "swissquote", "xm", "blackbull"];
  const brokers = targetSlugs
    .map(slug => allBrokers.find(b => b.slug === slug))
    .filter(Boolean);

  const reviewSlug = "pepperstone"; // Primary review demo

  const sections = [
    { key: "white", label: "VARIANT A", color: "#059669" },
    { key: "cream", label: "VARIANT B", color: "#d97706" },
    { key: "navy", label: "VARIANT C", color: "#0f172a" },
  ];

  return (
    <>
      {/* Page hero */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        padding: mob ? "32px 16px" : "48px 24px",
        textAlign: "center",
      }}>
        <span style={{
          display: "inline-block", padding: "3px 12px", borderRadius: 6,
          fontSize: 12, fontWeight: 700, background: "#ecfdf5", color: "#059669",
          marginBottom: 12, border: "1px solid #a7f3d0",
        }}>PAIR 2 · LIGHT THEME</span>
        <h1 style={{
          fontFamily: "Outfit", fontSize: mob ? 24 : 36, fontWeight: 800,
          color: "#0f172a", marginBottom: 10,
        }}>Light Theme — Dark Logos on Light Background</h1>
        <p style={{ fontSize: mob ? 14 : 16, color: "#64748b", maxWidth: 700, margin: "0 auto 16px" }}>
          Тёмные логотипы (из logos-wide/) на светлом фоне. Паттерн NerdWallet, Bankrate, Investopedia.
          Максимальная читаемость, институциональный feel. 3 цветовых варианта.
        </p>

        {/* Barbara + Bill notes */}
        <div style={{
          maxWidth: 800, margin: "0 auto",
          display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12,
          textAlign: "left",
        }}>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#059669", marginBottom: 4 }}>🎨 Barbara (UX)</div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
              Светлая тема +15-20% скорость сканирования. Тёмные логотипы на белом — максимум legibility.
              Логотип должен ДЫШАТЬ на светлом фоне — без тяжёлых рамок.
            </div>
          </div>
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#2563eb", marginBottom: 4 }}>📊 Bill (Conversion)</div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
              87% топовых affiliate сайтов — светлые темы. Оранжевый CTA на белом = +22% CTR.
              Trust signals лучше читаются на светлом. Логотип — главный визуальный якорь.
            </div>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "24px 16px" : "40px 24px" }}>
        {sections.map(({ key, label, color }) => {
          const T = THEMES[key];
          return (
            <div key={key} style={{ marginBottom: 80 }}>
              {/* Section header */}
              <div style={{ marginBottom: 24 }}>
                <span style={{
                  display: "inline-block", padding: "3px 12px", borderRadius: 6,
                  fontSize: 12, fontWeight: 700, background: `${color}15`, color: color,
                  marginBottom: 8, border: `1px solid ${color}30`,
                }}>{label}</span>
                <h2 style={{ fontFamily: "Outfit", fontSize: mob ? 22 : 28, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                  {T.name}
                </h2>
                <p style={{ fontSize: 15, color: "#64748b", maxWidth: 700 }}>{T.desc}</p>

                {/* Color swatch preview */}
                <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: T.heroBg, border: "1px solid #e2e8f0" }} />
                    <span style={{ fontSize: 11, color: "#64748b" }}>Hero BG</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: T.primaryCta.bg }} />
                    <span style={{ fontSize: 11, color: "#64748b" }}>Primary CTA</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: T.scoreBg, border: T.scoreBorder }} />
                    <span style={{ fontSize: 11, color: "#64748b" }}>Score</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: T.rankBg, border: T.rankBorder }} />
                    <span style={{ fontSize: 11, color: "#64748b" }}>Rank</span>
                  </div>
                </div>
              </div>

              {/* Review Hero demo */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                  ← Review Page Hero
                </div>
                <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <LightReviewHero slug={reviewSlug} theme={key} mob={mob} tab={tab} />
                </div>
              </div>

              {/* Ranking Cards demo */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                  ← Ranking Cards
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {brokers.map((b, i) => {
                    const thematic = getBrokerBlurb("forex-overall", b.slug, b);
                    return (
                      <LightRankCard
                        key={b.slug}
                        broker={b}
                        rank={i + 1}
                        thematic={thematic}
                        mob={mob}
                        tab={tab}
                        theme={key}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
