import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import RegBadge from "../components/RegBadge";
import BrokerLogo from "../components/BrokerLogo";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import { getBrokersForRanking } from "../data/rankingFilters";
import { getBrokerBlurb } from "../data/rankingThematic";
import { ChevronDown, Check, X as XIcon, ExternalLink } from "lucide-react";

/* ── Wide logo maps (synced with BrokerReview.jsx) ── */
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

/* ── WideLogo ── */
function WideLogo({ slug, name, fallback, w = 200, h = 64, radius = 14 }) {
  const [err, setErr] = useState(false);
  const ext = WIDE_EXT[slug] || "svg";
  const bg = LOGO_BG[slug] || "#fff";
  const isRaster = ext !== "svg";
  if (err) {
    return (
      <div style={{ background: "#fff", borderRadius: radius, padding: 4, display: "inline-flex" }}>
        <BrokerLogo slug={slug} name={name} fallback={fallback} size={h} shape="brand" borderRadius={radius - 4} />
      </div>
    );
  }
  return (
    <div style={{
      borderRadius: radius, overflow: "hidden", display: "inline-flex",
      alignItems: "center", justifyContent: "center",
      height: h, width: w, flexShrink: 0, background: bg,
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

/* ── Trustpilot Stars ── */
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

const makeVisitUrl = (slug, url) => {
  const apiBase = import.meta.env.VITE_API_URL || "";
  return apiBase ? `${apiBase}/go/${slug}` : url;
};

/* ── Dark Crown texture overlay ── */
const TextureOverlay = () => (
  <div style={{
    position: "absolute", inset: 0,
    backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)",
    pointerEvents: "none",
  }} />
);

/* ── Score label ── */
const scoreLabel = (s) => s >= 9.5 ? "Excellent" : s >= 9.0 ? "Great" : s >= 8.5 ? "Very Good" : "Good";

/* ═══════════════════════════════════════════════════════════════
 *  CTA THEME DEFINITIONS
 *  3 цветовых решения для кнопок на Dark Crown
 * ═══════════════════════════════════════════════════════════════ */

const CTA_THEMES = {
  /* A: Orange + Navy — как на ревью-странице.
     Primary: оранжевый (brand CTA color). Secondary: navy outline */
  orange: {
    name: "Orange CTA",
    desc: "Оранжевый primary CTA (как на ревью) + navy outline secondary. Оранжевый — наш brand CTA цвет, максимальный контраст с зелёной темой.",
    primary: {
      bg: "#f59e0b",
      color: "#0f172a",
      shadow: "0 2px 8px rgba(245,158,11,0.3)",
    },
    secondary: {
      bg: "#fff",
      color: "#0f172a",
      border: "2px solid #0f172a",
    },
  },

  /* B: White + Slate — нейтральные CTA, дают тёмной зоне дышать.
     Primary: белый с тёмным текстом. Secondary: светло-серый */
  white: {
    name: "White CTA",
    desc: "Белый primary + светло-серый secondary. Нейтральные, чистые. Зелёный остаётся только на dark crown — нет путаницы.",
    primary: {
      bg: "#0f172a",
      color: "#fff",
      shadow: "0 2px 8px rgba(15,23,42,0.2)",
    },
    secondary: {
      bg: "#f8fafc",
      color: "#374151",
      border: "2px solid #e2e8f0",
    },
  },

  /* C: Orange primary + Green secondary — компромисс.
     Главное действие выделено оранжевым, ревью остаётся зелёным */
  split: {
    name: "Orange + Green Split",
    desc: "Оранжевый primary (Open Account), зелёный secondary (Read Review). Чёткая иерархия: оранжевый = конверсия, зелёный = информация.",
    primary: {
      bg: "#f59e0b",
      color: "#0f172a",
      shadow: "0 2px 8px rgba(245,158,11,0.3)",
    },
    secondary: {
      bg: "#ecfdf5",
      color: "#047857",
      border: "2px solid #059669",
    },
  },
};

/* ═══════════════════════════════════════════════════════════════
 *  DARK CROWN CARD — parametrized by CTA theme
 * ═══════════════════════════════════════════════════════════════ */
function DarkCrownCard({ broker, rank, thematic, mob, tab, ctaTheme }) {
  const lp = useLocalePath();
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const B = broker.B;
  const reviewPath = lp(`/review/${broker.slug}`);
  const visitUrl = makeVisitUrl(broker.slug, B.url);
  const hasTp = B.tp && B.tp > 0;
  const ct = CTA_THEMES[ctaTheme];

  /* ── Dark Crown (shared desktop/mobile) ── */
  const DarkCrown = ({ children }) => (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <TextureOverlay />
      {children}
    </div>
  );

  /* ── CTA buttons ── */
  const CTAButtons = ({ direction = "column" }) => (
    <div style={{ display: "flex", gap: 8, flexDirection: direction }}>
      <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
        flex: 1, minWidth: direction === "row" ? 170 : "auto",
        padding: "12px 20px", borderRadius: 10, textAlign: "center",
        background: ct.primary.bg, color: ct.primary.color,
        fontWeight: 700, fontSize: 15, textDecoration: "none",
        boxShadow: ct.primary.shadow,
      }}>
        <span>Open {B.name} Account →</span>
        {B.promo && <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.75, marginTop: 2 }}>{B.promo}</span>}
      </a>
      <Link to={reviewPath} style={{
        flex: 1, minWidth: direction === "row" ? 140 : "auto",
        padding: "11px 16px", borderRadius: 10, textAlign: "center",
        background: ct.secondary.bg, color: ct.secondary.color,
        fontWeight: 700, fontSize: 14, textDecoration: "none",
        border: ct.secondary.border,
      }}>
        <span>Read Full Review</span>
        <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.7, marginTop: 1 }}>{B.score}/10 · Expert tested</span>
      </Link>
    </div>
  );

  /* ── Trustpilot bar ── */
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
        <span style={{ fontSize: mob ? 10 : 12, color: "#64748b" }}>({formatTpCount(B.tpCount)} reviews on Trustpilot)</span>
        {mob && <ExternalLink size={10} color="#94a3b8" />}
      </a>
    ) : null
  );

  /* ── Thematic content ── */
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
              {analysisOpen ? "Hide full analysis" : "\uD83D\uDD0E Read our full analysis"}
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
        background: "#fff", borderRadius: 16,
        border: rank === 1 ? "2px solid #059669" : "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
      }}>
        {/* Dark Crown */}
        <DarkCrown>
          <div style={{ padding: "18px 16px 20px", position: "relative", zIndex: 2 }}>
            {/* Rank + Score */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: rank === 1 ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.1)",
                border: rank === 1 ? "2px solid #34d399" : "1px solid rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 14,
                color: rank <= 3 ? "#34d399" : "rgba(255,255,255,0.7)",
              }}>#{rank}</div>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  background: "rgba(52,211,153,0.15)", border: "2px solid #34d399",
                  borderRadius: 10, padding: "4px 10px",
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 800, color: "#34d399",
                }}>{B.score}</div>
                <div style={{ fontSize: 11, color: "#34d399", fontWeight: 600, marginTop: 2 }}>{scoreLabel(B.score)}</div>
              </div>
            </div>
            {/* Logo + Name */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <Link to={reviewPath} style={{ display: "flex", textDecoration: "none" }}>
                <WideLogo slug={broker.slug} name={B.name} fallback={B.logo} w={200} h={64} radius={12} />
              </Link>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  <Link to={reviewPath} style={{ color: "#fff", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>{B.name}</Link>
                </h3>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{B.type}</div>
                {B.badge && (
                  <span style={{
                    display: "inline-block", marginTop: 5, padding: "2px 10px", borderRadius: 6,
                    fontSize: 11, fontWeight: 700, background: "rgba(52,211,153,0.15)", color: "#34d399",
                    border: "1px solid rgba(110,231,183,0.3)",
                  }}>{B.badge}</span>
                )}
              </div>
            </div>
          </div>
        </DarkCrown>

        {/* White section */}
        <div style={{ padding: "14px 16px 8px" }}>
          <CTAButtons direction="column" />
        </div>

        <TpBar />

        {B.riskWarning && <div style={{ padding: "4px 16px 8px", fontSize: 12, color: "#374151", textAlign: "center" }}>{B.riskWarning}</div>}

        <div style={{ padding: "0 16px 10px", display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {B.regs.slice(0, 3).map((r) => <RegBadge key={r.name} reg={r.name} />)}
          {B.regs.length > 3 && <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>+{B.regs.length - 3}</span>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "#f1f5f9", margin: "0 16px", borderRadius: 10, overflow: "hidden" }}>
          {[["Spread", `${B.spread} pips`], ["Min Dep", B.minDep === 0 ? "$0" : `$${B.minDep}`], ["Leverage", B.leverage]].map(([label, val]) => (
            <div key={label} style={{ background: "#f8fafc", padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: "#111827", marginTop: 2, whiteSpace: "nowrap" }}>{val}</div>
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
      background: "#fff", borderRadius: 16,
      border: rank === 1 ? "2px solid #059669" : "1px solid #e2e8f0",
      boxShadow: rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
      overflow: "hidden",
    }}>
      {/* Dark Crown */}
      <DarkCrown>
        <div style={{
          padding: tab ? "16px 20px" : "18px 28px",
          display: "flex", alignItems: "center", gap: tab ? 16 : 24,
          position: "relative", zIndex: 2,
        }}>
          {/* Rank */}
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: rank === 1 ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.1)",
            border: rank === 1 ? "2px solid #34d399" : "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
            fontSize: 16, color: rank <= 3 ? "#34d399" : "rgba(255,255,255,0.7)",
          }}>#{rank}</div>

          {/* Logo + Name */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
            <Link to={reviewPath} style={{ display: "flex", flexShrink: 0, textDecoration: "none" }}>
              <WideLogo slug={broker.slug} name={B.name} fallback={B.logo} w={tab ? 160 : 200} h={tab ? 52 : 60} radius={12} />
            </Link>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <Link to={reviewPath} style={{ color: "#fff", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>{B.name}</Link>
                {B.badge && (
                  <span style={{ padding: "1px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: "rgba(52,211,153,0.15)", color: "#34d399", whiteSpace: "nowrap", border: "1px solid rgba(110,231,183,0.3)" }}>{B.badge}</span>
                )}
              </h3>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{B.type}</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: tab ? 14 : 20 }}>
            {[["Spread", `${B.spread} pips`], ["Min Dep", B.minDep === 0 ? "$0" : `$${B.minDep}`], ["Leverage", B.leverage]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{label}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 2, whiteSpace: "nowrap" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Score */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              background: "rgba(52,211,153,0.15)", border: "2px solid #34d399",
              borderRadius: 10, width: 52, height: 52,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 800, color: "#34d399",
            }}>{B.score}</div>
            <div style={{ fontSize: 11, color: "#34d399", fontWeight: 600, marginTop: 2 }}>{scoreLabel(B.score)}</div>
          </div>
        </div>
      </DarkCrown>

      {/* White content */}
      <div style={{ padding: tab ? "12px 20px 16px" : "14px 28px 20px" }}>
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
 *  PAGE — 3 секции с разными CTA темами
 * ═══════════════════════════════════════════════════════════════ */
export default function RankingProtoWide() {
  const { mob, tab } = useMedia();
  const allBrokers = getBrokersForRanking("forex-overall");
  const brokers = allBrokers.slice(0, 4);

  const sections = [
    { key: "orange", label: "VARIANT A", color: "#f59e0b" },
    { key: "white", label: "VARIANT B", color: "#0f172a" },
    { key: "split", label: "VARIANT C", color: "#059669" },
  ];

  return (
    <>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
        padding: mob ? "32px 16px" : "48px 24px",
        textAlign: "center",
        borderTop: "3px solid #f59e0b",
      }}>
        <h1 style={{ fontFamily: "Outfit", fontSize: mob ? 24 : 36, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
          Dark Crown — CTA Color Variants
        </h1>
        <p style={{ fontSize: mob ? 14 : 16, color: "rgba(255,255,255,0.7)", maxWidth: 700, margin: "0 auto" }}>
          Dark Crown фиксирован. Проблема: всё зелёное — crown, CTA, review кнопка. Тестируем 3 цветовых решения для кнопок.
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "24px 16px" : "40px 24px" }}>
        {sections.map(({ key, label, color }) => {
          const ct = CTA_THEMES[key];
          return (
            <div key={key} style={{ marginBottom: 60 }}>
              <div style={{ marginBottom: 24 }}>
                <span style={{
                  display: "inline-block", padding: "3px 12px", borderRadius: 6,
                  fontSize: 12, fontWeight: 700, background: `${color}20`, color: color,
                  marginBottom: 8, border: `1px solid ${color}40`,
                }}>{label}</span>
                <h2 style={{ fontFamily: "Outfit", fontSize: mob ? 22 : 28, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{ct.name}</h2>
                <p style={{ fontSize: 15, color: "#64748b", maxWidth: 700 }}>{ct.desc}</p>

                {/* CTA preview swatches */}
                <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
                  <div style={{
                    padding: "8px 20px", borderRadius: 8,
                    background: ct.primary.bg, color: ct.primary.color,
                    fontWeight: 700, fontSize: 13, boxShadow: ct.primary.shadow,
                  }}>Open Account →</div>
                  <div style={{
                    padding: "7px 16px", borderRadius: 8,
                    background: ct.secondary.bg, color: ct.secondary.color,
                    fontWeight: 700, fontSize: 13, border: ct.secondary.border,
                  }}>Read Review</div>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>← preview</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {brokers.map((b, i) => {
                  const thematic = getBrokerBlurb("forex-overall", b.slug, b);
                  return <DarkCrownCard key={b.slug} broker={b} rank={i + 1} thematic={thematic} mob={mob} tab={tab} ctaTheme={key} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
