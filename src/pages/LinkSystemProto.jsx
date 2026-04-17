/**
 * LinkSystemProto v2 — живой плейграунд на реальных кусках сайта
 *
 * Принцип: никаких абстрактных «light bg / dark bg» демо. Только 10 живых кусков
 * из реального кода (Home.jsx, BrokerReview.jsx, Header.jsx, Footer.jsx,
 * WarningPage.jsx, SubPageTabs.jsx) в формате AS-IS → PROPOSED.
 *
 * Reference: LINK-BUTTON-SYSTEM.md. Токены rb-* живут inline — до аппрува
 * концепции в CSS не выносим.
 */
import { useState } from "react";
import { ArrowRight, ArrowUpRight, ExternalLink, ChevronRight, Target, BarChart3, BookOpen, Shield } from "lucide-react";

// ══════════════════════════════════════════════════════
// TOKEN STYLES (9 types)
// ══════════════════════════════════════════════════════
const T = {
  ctaAffiliate: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: "12px 24px", borderRadius: 10,
    fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em",
    background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
    textDecoration: "none", border: "none", cursor: "pointer",
    boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
    transition: "box-shadow 250ms cubic-bezier(0.4,0,0.2,1), transform 250ms cubic-bezier(0.4,0,0.2,1)",
  },
  ctaInternal: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: "12px 22px", borderRadius: 10,
    fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em",
    background: "#0f172a", color: "#fff",
    textDecoration: "none", border: "none", cursor: "pointer",
    boxShadow: "0 2px 8px rgba(15,23,42,0.15)",
    transition: "box-shadow 250ms cubic-bezier(0.4,0,0.2,1), transform 250ms, background 250ms",
  },
  ctaGhost: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: "10px 22px", borderRadius: 10,
    fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em",
    background: "transparent", color: "#059669", border: "2px solid #059669",
    textDecoration: "none", cursor: "pointer",
    transition: "background 250ms, color 250ms",
  },
  ctaGhostDark: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: "10px 18px", borderRadius: 10,
    fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 13,
    background: "rgba(255,255,255,0.08)", color: "#e2e8f0",
    border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
    textDecoration: "none", cursor: "pointer", whiteSpace: "nowrap",
    transition: "background 250ms, border-color 250ms, color 250ms",
  },
  linkInline: {
    color: "#047857", fontWeight: 600,
    textDecoration: "underline", textDecorationThickness: "1px",
    textUnderlineOffset: 3, textDecorationColor: "rgba(4,120,87,0.4)",
    transition: "color 150ms, text-decoration-color 150ms",
  },
  linkStandalone: {
    display: "inline-flex", alignItems: "center", gap: 4,
    fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14,
    color: "#059669", textDecoration: "none",
    transition: "color 150ms",
  },
  linkRail: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "6px 10px", borderRadius: 6,
    fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14,
    color: "#0f172a", textDecoration: "none", background: "transparent",
    transition: "background 150ms, color 150ms",
  },
  linkRailDark: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "5px 8px", borderRadius: 6,
    fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 14,
    color: "#e2e8f0", textDecoration: "none", background: "transparent",
    transition: "background 150ms, color 150ms",
  },
  linkRailDot: { width: 4, height: 4, borderRadius: "50%", background: "#059669", flexShrink: 0 },
  linkRailDotDark: { width: 4, height: 4, borderRadius: "50%", background: "#34d399", flexShrink: 0 },
  linkMeta: {
    color: "#64748b", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 13,
    letterSpacing: "0.01em", textDecoration: "none",
    transition: "color 150ms",
  },
  linkCrumb: { color: "#64748b", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 13, textDecoration: "none" },
  linkCrumbCurrent: { color: "#0f172a", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13 },
};

const H = {
  ctaAffiliate: { transform: "translateY(-1px)", boxShadow: "0 8px 24px rgba(245,158,11,0.4)" },
  ctaInternal: { background: "#1e293b", transform: "translateY(-1px)" },
  ctaGhost: { background: "#059669", color: "#fff" },
  ctaGhostDark: { background: "rgba(52,211,153,0.12)", borderColor: "#34d399", color: "#fff" },
  linkInline: { color: "#059669", textDecorationColor: "#059669" },
  linkStandalone: { color: "#f59e0b" },
  linkRail: { background: "#f1f5f9", color: "#047857" },
  linkRailDark: { background: "rgba(255,255,255,0.06)", color: "#34d399" },
  linkMeta: { color: "#0f172a" },
};

function Hv({ children, rest, hover, tag = "a", ...rest_props }) {
  const [h, setH] = useState(false);
  const Tag = tag;
  return (
    <Tag {...rest_props} style={{ ...rest, ...(h ? hover : {}) }} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </Tag>
  );
}

// ══════════════════════════════════════════════════════
// UI HELPERS
// ══════════════════════════════════════════════════════
const Eyebrow = ({ children, color = "#f59e0b" }) => (
  <div style={{
    fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
    letterSpacing: "0.18em", textTransform: "uppercase",
    color, marginBottom: 10,
  }}>{children}</div>
);

const Tag = ({ children, tone = "slate" }) => {
  const palette = {
    slate: { bg: "#f1f5f9", fg: "#475569" },
    green: { bg: "#ecfdf5", fg: "#047857" },
    red: { bg: "#fef2f2", fg: "#b91c1c" },
    amber: { bg: "#fef3c7", fg: "#b45309" },
  }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 6,
      background: palette.bg, color: palette.fg,
      fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.04em", textTransform: "uppercase",
    }}>{children}</span>
  );
};

function PieceCard({ index, title, fileRef, tokens, problems, children }) {
  return (
    <section style={{
      background: "#fff", borderRadius: 14,
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)",
      overflow: "hidden", marginBottom: 22,
    }}>
      <header style={{
        padding: "18px 24px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 800,
              color: "#94a3b8", letterSpacing: "0.08em",
            }}>P{index}</span>
            <h3 style={{
              fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18,
              color: "#0f172a", margin: 0, letterSpacing: "-0.01em",
            }}>{title}</h3>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {tokens.map(t => <Tag key={t} tone="green">{t}</Tag>)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#64748b",
          }}>{fileRef}</span>
          {problems.map(p => (
            <Tag key={p} tone="red">{p}</Tag>
          ))}
        </div>
      </header>
      {children}
    </section>
  );
}

function BeforeAfter({ before, after, diff, beforeWide = false }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        <div style={{ padding: "22px 24px", background: "#fef9f6", borderRight: "1px solid #f1f5f9" }}>
          <Eyebrow color="#dc2626">Before · AS-IS</Eyebrow>
          <div>{before}</div>
        </div>
        <div style={{ padding: "22px 24px", background: "#f0fdf4" }}>
          <Eyebrow color="#059669">After · Proposed</Eyebrow>
          <div>{after}</div>
        </div>
      </div>
      <div style={{
        padding: "14px 24px", background: "#fafbfc",
        fontSize: 13.5, lineHeight: 1.65, color: "#475569",
        borderTop: "1px solid #f1f5f9",
      }}>
        {diff}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════
// REAL PIECE #1 — Countries card (Home.jsx:519-575)
// ══════════════════════════════════════════════════════
const UK_VERTICALS_ASIS = [
  { label: "Forex", word: "Brokers", color: "#059669" },
  { label: "CFD", word: "Brokers", color: "#2563eb" },
  { label: "Stocks", word: "Brokers", color: "#0ea5e9" },
  { label: "Spread Betting", word: "Platforms", color: "#dc2626" },
  { label: "Crypto", word: "Brokers", color: "#d97706" },
  { label: "Copy Trading", word: "Platforms", color: "#7c3aed" },
];
const UK_VERTICALS_NEW = UK_VERTICALS_ASIS.map(v => ({ ...v, color: "#059669" }));

function UKFlag({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size * 0.7, borderRadius: 4, overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      background: "linear-gradient(180deg, #012169 50%, #012169 50%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 800,
    }}>UK</div>
  );
}

function CountryCardASIS() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", minHeight: 160,
      borderRadius: 14, overflow: "visible",
      background: "#fff", border: "2px solid #059669",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
      position: "relative", maxWidth: 340,
    }}>
      <span style={{
        position: "absolute", top: -10, right: 14,
        padding: "3px 10px", borderRadius: 8,
        background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
        fontSize: 10, fontWeight: 700, boxShadow: "0 2px 6px rgba(245,158,11,0.3)",
        lineHeight: 1, whiteSpace: "nowrap",
      }}>★ Most Popular</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 20px 0" }}>
        <UKFlag size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16 }}>United Kingdom</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
            <span style={{ padding: "2px 8px", borderRadius: 6, background: "#0f172a", color: "#fff", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700 }}>FCA</span>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>14 brokers</span>
          </div>
        </div>
        <ArrowRight size={16} color="#cbd5e1" />
      </div>
      <div style={{ height: 1, background: "#f0f4f8", margin: "12px 20px 0" }} />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", padding: "12px 20px 16px", marginTop: "auto" }}>
        {UK_VERTICALS_ASIS.map((v, vi) => (
          <a key={vi} href="#" style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            textDecoration: "none", padding: "2px 0", lineHeight: 1.3,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: v.color }} />
            <span style={{ fontSize: 11.5, fontWeight: 500, color: "#059669", letterSpacing: "0.01em" }}>
              {v.label} {v.word} UK
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function CountryCardNEW() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", minHeight: 160,
      borderRadius: 14, overflow: "hidden",
      background: "#fff", border: "1px solid #e8ecf1",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.04)",
      position: "relative", maxWidth: 340,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 18px 0" }}>
        <UKFlag size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16 }}>United Kingdom</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
            <span style={{ padding: "2px 8px", borderRadius: 6, background: "#0f172a", color: "#fff", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700 }}>FCA</span>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>14 brokers</span>
          </div>
        </div>
        <ArrowRight size={16} color="#cbd5e1" />
      </div>
      <div style={{ height: 1, background: "#f0f4f8", margin: "12px 18px 0" }} />
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", padding: "10px 14px 14px", marginTop: "auto" }}>
        {UK_VERTICALS_NEW.map((v, vi) => (
          <Hv key={vi} rest={T.linkRail} hover={H.linkRail} href="#">
            <span style={T.linkRailDot} />
            {v.label} {v.word} UK
          </Hv>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// REAL PIECE #2 — Editorial meta row (Home.jsx:960-972)
// ══════════════════════════════════════════════════════
function EditorialMetaASIS() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: 13 }}>
      <a href="#" style={{ color: "#059669", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
        Editorial standards <ArrowRight size={12} />
      </a>
      <span style={{ color: "#cbd5e1" }}>·</span>
      <a href="#" style={{ color: "#059669", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
        Scoring methodology <ArrowRight size={12} />
      </a>
      <span style={{ color: "#cbd5e1" }}>·</span>
      <a href="#" style={{ color: "#059669", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
        How we make money <ArrowRight size={12} />
      </a>
    </div>
  );
}

function EditorialMetaNEW() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      {["Editorial standards", "Scoring methodology", "How we make money"].map((txt, i, arr) => (
        <span key={txt} style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
          <Hv rest={T.linkMeta} hover={H.linkMeta} href="#">{txt}</Hv>
          {i < arr.length - 1 && <span style={{ color: "#cbd5e1" }}>·</span>}
        </span>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// REAL PIECE #3 — Home hero CTA cluster (Home.jsx:339-380)
// ══════════════════════════════════════════════════════
function HeroASIS() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
      padding: "22px 20px", borderRadius: 10, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
      }} />
      <div style={{ position: "relative", display: "flex", gap: 8, flexWrap: "wrap" }}>
        <a href="#" style={{
          padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
          whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
        }}>
          <Target size={14} /> Find Your Broker
        </a>
        <a href="#" style={{
          padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          background: "rgba(30,41,59,0.8)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0",
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <BarChart3 size={14} /> Compare Brokers
        </a>
        <a href="#" style={{
          padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          background: "rgba(30,41,59,0.8)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0",
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <BookOpen size={14} /> Our Methodology
        </a>
        <a href="#" style={{
          padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
          whiteSpace: "nowrap",
        }}>
          Browse All Rankings <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
}

function HeroNEW() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
      padding: "22px 20px", borderRadius: 10, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
      }} />
      <div style={{ position: "relative", display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Hv rest={T.ctaAffiliate} hover={H.ctaAffiliate} href="#">
          <Target size={14} /> Find Your Broker
        </Hv>
        <Hv rest={T.ctaGhostDark} hover={H.ctaGhostDark} href="#">
          <BarChart3 size={14} /> Compare Brokers
        </Hv>
        <Hv rest={T.ctaGhostDark} hover={H.ctaGhostDark} href="#">
          <BookOpen size={14} /> Our Methodology
        </Hv>
        <Hv rest={T.ctaGhostDark} hover={H.ctaGhostDark} href="#">
          Browse All Rankings <ArrowRight size={13} />
        </Hv>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// REAL PIECE #4 — BrokerReview Visit CTA (3 разных реализации!)
// ══════════════════════════════════════════════════════
function ReviewCTAsASIS() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <Eyebrow color="#94a3b8">Mobile hero (BrokerReview.jsx:319)</Eyebrow>
        <a href="#" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
          fontSize: 15, fontWeight: 700, textDecoration: "none",
          padding: "12px 20px", borderRadius: 10,
          boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
        }}>
          Visit IC Markets <ArrowRight size={14} />
        </a>
      </div>
      <div>
        <Eyebrow color="#94a3b8">Desktop hero (BrokerReview.jsx:349)</Eyebrow>
        <a href="#" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
          fontSize: 16, fontWeight: 700, textDecoration: "none",
          padding: "13px 24px", borderRadius: 10,
          boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
        }}>
          Visit IC Markets
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
      <div>
        <Eyebrow color="#94a3b8">Sidebar sticky (BrokerReview.jsx:722)</Eyebrow>
        <a href="#" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
          fontSize: 15, fontWeight: 700, textDecoration: "none",
          padding: "12px 20px", borderRadius: 9,
          boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
        }}>
          Visit IC Markets {"\u2197"}
        </a>
      </div>
    </div>
  );
}

function ReviewCTAsNEW() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <Eyebrow color="#94a3b8">All three → one token</Eyebrow>
        <Hv rest={T.ctaAffiliate} hover={H.ctaAffiliate} href="#">
          Visit IC Markets <ArrowUpRight size={14} />
        </Hv>
      </div>
      <div style={{
        fontSize: 12, color: "#64748b", lineHeight: 1.6,
        background: "#f8fafc", padding: "10px 12px", borderRadius: 8,
        border: "1px dashed #e2e8f0",
      }}>
        <strong style={{ color: "#0f172a" }}>Unified spec:</strong> Outfit 700 14–15px, padding 12–13px × 24px,
        radius 10, shadow rest `0 2px 8px rgba(245,158,11,0.3)` → hover `0 8px 24px rgba(245,158,11,0.4)`,
        `translateY(-1px)` lift, ArrowUpRight 14px lucide (не Unicode, не ArrowRight).
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// REAL PIECE #5 — All Broker Reviews grid (Home.jsx:590-614)
// ══════════════════════════════════════════════════════
const SAMPLE_BROKERS = [
  { name: "IC Markets", score: 9.6 },
  { name: "FP Markets", score: 9.5 },
  { name: "IG", score: 9.3 },
  { name: "Pepperstone", score: 9.3 },
  { name: "FOREX.com", score: 9.2 },
  { name: "CMC Markets", score: 9.1 },
];

function AllReviewsASIS() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {SAMPLE_BROKERS.map(b => (
        <a key={b.name} href="#" style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "10px 16px", borderRadius: 10,
          background: "#0f172a", textDecoration: "none",
          border: "1px solid #1e293b",
        }}>
          <div style={{ width: 72, height: 32, flexShrink: 0, display: "flex", alignItems: "center", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 800 }}>
            [logo-dark]
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#f1f5f9" }}>{b.name}</span>
          </div>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)" }} />
          <span style={{
            fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 800,
            color: b.score >= 9.0 ? "#059669" : "#2563eb", minWidth: 32, textAlign: "right",
          }}>{b.score}</span>
        </a>
      ))}
    </div>
  );
}

function AllReviewsNEW() {
  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{ padding: "6px 4px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {SAMPLE_BROKERS.map(b => (
            <Hv key={b.name} rest={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 8,
              background: "transparent", textDecoration: "none",
              border: "1px solid transparent",
              transition: "box-shadow 160ms, border-color 160ms",
            }} hover={{
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              borderColor: "#cbd5e1",
            }} href="#">
              <div style={{
                width: 72, height: 30, flexShrink: 0, borderRadius: 6,
                background: "#f8f9fb", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 800, color: "#475569",
              }}>[logo]</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{b.name}</span>
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 800,
                color: b.score >= 9.0 ? "#059669" : "#2563eb",
              }}>{b.score}</span>
            </Hv>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// REAL PIECE #6 — Header mega-menu compactLink column (Header.jsx:213)
// ══════════════════════════════════════════════════════
function HeaderMenuASIS() {
  const compactLink = {
    display: "block", padding: "6px 10px", borderRadius: 0,
    textDecoration: "none", color: "#1f2937",
    fontSize: 14, fontWeight: 500, transition: "all 0.15s",
    lineHeight: 1.4,
  };
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: 24,
      border: "1px solid #e2e8f0",
      boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
      maxWidth: 240,
    }}>
      <div style={{
        fontSize: 12, fontWeight: 700, color: "#1f2937",
        textTransform: "uppercase", letterSpacing: 1.2,
        marginBottom: 12, paddingBottom: 8,
        borderBottom: "1px solid #f1f5f9",
      }}>Forex by country</div>
      {["United Kingdom", "United States", "Australia", "Germany", "Singapore"].map(t => (
        <a key={t} href="#" style={compactLink}
          onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#047857"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1f2937"; }}
        >{t}</a>
      ))}
    </div>
  );
}

function HeaderMenuNEW() {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: 24,
      border: "1px solid #e2e8f0",
      boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
      maxWidth: 240,
    }}>
      <div style={{
        fontSize: 12, fontWeight: 700, color: "#1f2937",
        textTransform: "uppercase", letterSpacing: 1.2,
        marginBottom: 12, paddingBottom: 8,
        borderBottom: "1px solid #f1f5f9",
      }}>Forex by country</div>
      {["United Kingdom", "United States", "Australia", "Germany", "Singapore"].map(t => (
        <Hv key={t} rest={{ ...T.linkRail, display: "flex", width: "100%", margin: "1px 0" }} hover={H.linkRail} href="#">
          <span style={T.linkRailDot} />{t}
        </Hv>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// REAL PIECE #7 — Footer dark rail (Footer.jsx:111-150)
// ══════════════════════════════════════════════════════
const FOOTER_LINKS = ["Best Forex Brokers", "Best CFD Brokers", "Best Crypto Brokers", "Best Stock Brokers", "Best Copy Trading Platforms"];

function FooterASIS() {
  const baseLinkStyle = { fontSize: 15, color: "#cbd5e1", textDecoration: "none", display: "block", padding: "4px 0", transition: "color 0.2s" };
  return (
    <div style={{ background: "#0f172a", padding: 22, borderRadius: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Rankings</div>
      {FOOTER_LINKS.map(t => (
        <Hv key={t} rest={baseLinkStyle} hover={{ color: "#34d399" }} href="#">{t}</Hv>
      ))}
    </div>
  );
}

function FooterNEW() {
  return (
    <div style={{ background: "#0f172a", padding: 22, borderRadius: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Rankings</div>
      {FOOTER_LINKS.map(t => (
        <Hv key={t} rest={{ ...T.linkRailDark, display: "flex", width: "100%", margin: "1px 0" }} hover={H.linkRailDark} href="#">
          <span style={T.linkRailDotDark} />{t}
        </Hv>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// REAL PIECE #8 — WarningPage blue-underlined link (WarningPage.jsx:354)
// ══════════════════════════════════════════════════════
function WarningLinkASIS() {
  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8, border: "1px solid #fee2e2", maxWidth: 420 }}>
      <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 6 }}>
        License revoked by FCA (2024-08-15)
      </div>
      <a href="#" style={{
        fontSize: 13, color: "#2563eb", textDecoration: "underline",
        display: "inline-flex", alignItems: "center", gap: 4,
      }}>View source <ExternalLink size={12} /></a>
    </div>
  );
}

function WarningLinkNEW() {
  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8, border: "1px solid #fee2e2", maxWidth: 420 }}>
      <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 6 }}>
        License revoked by FCA (2024-08-15)
      </div>
      <Hv rest={{
        fontSize: 13, color: "#64748b", fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
        transition: "color 150ms",
      }} hover={{ color: "#059669" }} href="#" target="_blank" rel="noopener noreferrer">
        View source <ExternalLink size={12} />
      </Hv>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// REAL PIECE #9 — SubPage 8 tabs (SubPageTabs.jsx)
// ══════════════════════════════════════════════════════
function SubTabsDemo() {
  const [active, setActive] = useState("Fees");
  const tabs = ["Overview", "Fees", "Platforms", "Regulation", "Account", "Research", "Beginners", "Alternatives"];
  return (
    <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #e8ecf1", overflowX: "auto" }}>
      {tabs.map(tab => {
        const isActive = active === tab;
        return (
          <button key={tab} onClick={() => setActive(tab)} style={isActive ? {
            padding: "14px 18px", border: "none",
            background: "#0f172a", color: "#fff",
            fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "-0.01em",
            cursor: "pointer", borderBottom: "3px solid #059669", whiteSpace: "nowrap",
          } : {
            padding: "14px 18px", border: "none", background: "transparent",
            fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "-0.01em",
            color: "#64748b", cursor: "pointer",
            borderBottom: "3px solid transparent", whiteSpace: "nowrap",
          }}>{tab}</button>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// REAL PIECE #10 — Intro inline links (Home.jsx:389-396)
// ══════════════════════════════════════════════════════
function IntroASIS() {
  return (
    <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0, maxWidth: 680 }}>
      RatedBrokers is an independent broker comparison platform. We evaluate online brokers across
      forex, stocks, crypto, options, and futures — scoring each one on regulation, costs, reputation,
      transparency, platforms, and execution. Our{" "}
      <a href="#" style={{ color: "#059669", fontWeight: 600, textDecoration: "none" }}
        onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline"; e.currentTarget.style.textDecorationColor = "#059669"; }}
        onMouseLeave={e => { e.currentTarget.style.textDecoration = "none"; }}
      >full methodology</a>{" "}
      explains our scoring formula. Learn{" "}
      <a href="#" style={{ color: "#059669", fontWeight: 600, textDecoration: "none" }}
        onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline"; e.currentTarget.style.textDecorationColor = "#059669"; }}
        onMouseLeave={e => { e.currentTarget.style.textDecoration = "none"; }}
      >how we make money</a>.
    </p>
  );
}

function IntroNEW() {
  return (
    <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0, maxWidth: 680 }}>
      RatedBrokers is an independent broker comparison platform. We evaluate online brokers across
      forex, stocks, crypto, options, and futures — scoring each one on regulation, costs, reputation,
      transparency, platforms, and execution. Our{" "}
      <Hv rest={T.linkInline} hover={H.linkInline} href="#">full methodology</Hv>{" "}
      explains our scoring formula. Learn{" "}
      <Hv rest={T.linkInline} hover={H.linkInline} href="#">how we make money</Hv>.
    </p>
  );
}

// ══════════════════════════════════════════════════════
// TOKEN KEY (compact strip)
// ══════════════════════════════════════════════════════
function TokenKey() {
  const rows = [
    { id: "B1", name: "rb-cta-affiliate", desc: "Visit Broker → /go/ (orange)" },
    { id: "B2", name: "rb-cta-internal", desc: "Find Your Broker (navy)" },
    { id: "B3", name: "rb-cta-ghost", desc: "Compare, methodology (ghost)" },
    { id: "L1", name: "rb-link-inline", desc: "Underline в параграфе" },
    { id: "L2", name: "rb-link-standalone", desc: "See all → (action)" },
    { id: "L3", name: "rb-link-rail", desc: "Countries, footer, menu" },
    { id: "L4", name: "rb-link-meta", desc: "Footer legal / editorial" },
    { id: "N1", name: "rb-link-crumb", desc: "Breadcrumb" },
    { id: "N2", name: "rb-tab", desc: "SubPage 8 tabs" },
  ];
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "14px 18px", marginBottom: 22,
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04)",
      display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 20px",
    }}>
      {rows.map(r => (
        <div key={r.id} style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 12 }}>
          <span style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 800,
            color: "#059669", letterSpacing: "0.05em", minWidth: 18,
          }}>{r.id}</span>
          <span style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600,
            color: "#0f172a",
          }}>{r.name}</span>
          <span style={{ color: "#94a3b8", fontSize: 11.5 }}>— {r.desc}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════
export default function LinkSystemProto() {
  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh", color: "#0f172a" }}>

      {/* ═══ HERO ═══ */}
      <section style={{
        borderTop: "3px solid #f59e0b",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
        padding: "40px 24px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <Eyebrow color="#fbbf24">Design System · v2 · real pieces · 2026-04-17</Eyebrow>
          <h1 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800,
            fontSize: 36, lineHeight: 1.1, color: "#fff", margin: 0, letterSpacing: "-0.03em",
          }}>
            Link &amp; Button System
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.72)", margin: "12px 0 0", maxWidth: 800 }}>
            10 реальных кусков из живого кода сайта — <strong style={{ color: "#fff" }}>AS-IS vs PROPOSED</strong>.
            Без абстрактных демо. Сайт не тогглируется light/dark — тёмный фон живёт только
            внутри секций (hero, footer, premium-dark якоря), а не как отдельный режим.
            Все 9 токенов <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#fbbf24" }}>rb-*</code>
            {" "}применяются в контексте, как они будут работать на продакшене.
          </p>
        </div>
      </section>

      {/* ═══ CONTENT ═══ */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>

        <Eyebrow>Token key (reference)</Eyebrow>
        <TokenKey />

        <Eyebrow>10 real pieces · AS-IS → Proposed</Eyebrow>
        <div style={{ marginBottom: 12 }}>
          <h2 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 28,
            letterSpacing: "-0.03em", margin: "0 0 8px",
          }}>Каждый кусок — один в один с живого сайта</h2>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0, maxWidth: 720 }}>
            Слева точная копия текущего кода. Справа — тот же блок с применёнными токенами из системы.
            Комментарий внизу каждого блока объясняет, что поменялось и почему.
          </p>
        </div>
        <div style={{ height: 18 }} />

        {/* P1 — Countries card */}
        <PieceCard
          index={1}
          title="Regulated Brokers by Country — card"
          fileRef="src/pages/Home.jsx:519–575"
          tokens={["L3 rb-link-rail"]}
          problems={["anti-pattern §3 радужные dots", "anti-pattern §4 Most Popular", "anti-pattern §5 green border", "anti-pattern §6 < 14px"]}
        >
          <BeforeAfter
            before={<CountryCardASIS />}
            after={<CountryCardNEW />}
            diff={<><strong style={{ color: "#0f172a" }}>Diff:</strong> убран «★ Most Popular» ribbon (§4) и зелёная рамка featured-флага (§5).
              Dots были 6 разных цветов per vertical (§3) — стали единым `#059669`.
              Шрифт ссылок 11.5px weight 500 (§6 «мелкий шрифт в country») → 14px weight 600 navy-body.
              Подсветка на hover — subtle slate bg `#f1f5f9` + цвет зелёный, как в Header mega-menu.
              Зелёный возвращает роль «action», а не дефолта всего ряда.
            </>}
          />
        </PieceCard>

        {/* P2 — Editorial meta row */}
        <PieceCard
          index={2}
          title="Editorial meta row under Team"
          fileRef="src/pages/Home.jsx:960–972"
          tokens={["L4 rb-link-meta"]}
          problems={["служебные ссылки в роли action"]}
        >
          <BeforeAfter
            before={<EditorialMetaASIS />}
            after={<EditorialMetaNEW />}
            diff={<><strong style={{ color: "#0f172a" }}>Diff:</strong> стояли с `.link-green` + arrow — визуально как action-links,
              из-за чего отвлекали внимание от основной H2 «Editorial Team».
              Правильный тип meta: 13px slate, без стрелки, `·` middot разделитель. Hover просто затемняет до navy.
              Не спорит с H2, читается как подпись.
            </>}
          />
        </PieceCard>

        {/* P3 — Intro inline */}
        <PieceCard
          index={3}
          title="Intro paragraph (SEO text)"
          fileRef="src/pages/Home.jsx:389–396"
          tokens={["L1 rb-link-inline"]}
          problems={["inconsistency: applied in 2 of ~80 пара body-ссылок"]}
        >
          <BeforeAfter
            before={<IntroASIS />}
            after={<IntroNEW />}
            diff={<><strong style={{ color: "#0f172a" }}>Diff:</strong> текущий `.link-inline` class правильный,
              но применён в 2 файлах из ~80 мест где есть body-ссылки. Предлагаемая спека формализует это:
              **постоянный underline** 1px thickness, offset 3px, rest-alpha 40% → hover 100% + color shift.
              Постоянный underline — единственное место на сайте где он используется (везде text-decoration: none).
              Смысл: в тексте ссылка должна быть отличима без наведения (accessibility).
            </>}
          />
        </PieceCard>

        {/* P4 — Hero CTA cluster */}
        <PieceCard
          index={4}
          title="Home hero — 4 CTA cluster"
          fileRef="src/pages/Home.jsx:339–380"
          tokens={["B1 rb-cta-affiliate", "B3 rb-cta-ghost-dark"]}
          problems={["2 orange сразу", "3 вызова к действию конкурируют"]}
        >
          <BeforeAfter
            before={<HeroASIS />}
            after={<HeroNEW />}
            diff={<><strong style={{ color: "#0f172a" }}>Diff:</strong> сейчас 2 orange CTAs («Find Your Broker» и «Browse All Rankings»)
              плюс 2 glass-pills в промежутке. Правило <strong>max 2 orange на screen</strong> нарушено:
              глаз не понимает, что важнее — квиз или рейтинги. Предлагаю: <strong>одна</strong> orange (Find Your Broker = primary conversion),
              три ghost-dark в одинаковом стиле (Compare, Methodology, Browse Rankings). Визуально один главный удар + три саппорта.
              Пользователь фокусируется сначала на Quiz, потом сканирует остальные.
            </>}
          />
        </PieceCard>

        {/* P5 — BrokerReview Visit CTA */}
        <PieceCard
          index={5}
          title="BrokerReview — Visit CTA × 3 разных реализации"
          fileRef="src/pages/BrokerReview.jsx:319, 349, 722"
          tokens={["B1 rb-cta-affiliate"]}
          problems={["3 arrow-реализации в 1 файле", "ArrowRight для внешней ссылки (семантически неверно)"]}
        >
          <BeforeAfter
            before={<ReviewCTAsASIS />}
            after={<ReviewCTAsNEW />}
            diff={<><strong style={{ color: "#0f172a" }}>Diff:</strong> одна и та же кнопка «Visit IC Markets» имеет
              <strong>3 разных arrow-реализации</strong> в одном файле:
              (a) mobile — lucide ArrowRight (это <em>внутренняя</em> стрелка для <em>внешней</em> affiliate ссылки — семантически неверно);
              (b) desktop — кастомный inline SVG с path `M2.5 9.5...`;
              (c) sidebar — hardcoded Unicode `\u2197` text symbol.
              Стрелка каждый раз с разным stroke-width и visual weight. Нормализация: все три → одна `rb-cta-affiliate`
              с `<ArrowUpRight size={14} />` lucide. Единый stroke 1.5, единый padding, единая shadow-ladder.
            </>}
          />
        </PieceCard>

        {/* P6 — All Broker Reviews */}
        <PieceCard
          index={6}
          title="All Broker Reviews grid"
          fileRef="src/pages/Home.jsx:586–615"
          tokens={["L3 rb-link-rail (внутри D2k-shell)"]}
          problems={["navy-плитки на светлой странице = «чёрный блок»"]}
        >
          <BeforeAfter
            before={<AllReviewsASIS />}
            after={<AllReviewsNEW />}
            diff={<><strong style={{ color: "#0f172a" }}>Diff:</strong> 50+ navy-плиток посреди светлой страницы — тот самый «чёрный блок»,
              который ты описывал. Это мелочь, но в масштабе ломает ритм.
              Предлагаемое: белый D2k-shell (стандарт сайта из CLAUDE.md §D2k), строки прозрачные,
              логотип в серой подложке, score справа, hover — тень + серая рамка.
              Это editorial-список как на `/find-your-broker` («Your Top 10 Matches») — единый паттерн.
            </>}
          />
        </PieceCard>

        {/* P7 — Header mega-menu */}
        <PieceCard
          index={7}
          title="Header mega-menu — compactLink column"
          fileRef="src/components/Header.jsx:213–221"
          tokens={["L3 rb-link-rail"]}
          problems={["5-й несвязанный стиль link", "свой hover handler с inline mutations"]}
        >
          <BeforeAfter
            before={<HeaderMenuASIS />}
            after={<HeaderMenuNEW />}
            diff={<><strong style={{ color: "#0f172a" }}>Diff:</strong> сейчас это отдельный объект `compactLink` с inline hover-handler'ами
              — 5-я несвязанная система ссылок на сайте. Предлагаю: тот же `rb-link-rail` что в Countries и Footer.
              Ровно одинаковая навигация по сайту — один токен.
              Визуально почти без изменений (padding 6→6, hover bg одинаковый `#f1f5f9`), но + зелёный dot для consistency с Countries,
              и код становится декларативным: `className="rb-link-rail"` вместо 9 строк inline.
            </>}
          />
        </PieceCard>

        {/* P8 — Footer */}
        <PieceCard
          index={8}
          title="Footer — dark rankings rail"
          fileRef="src/components/Footer.jsx:111–151"
          tokens={["L3 rb-link-rail--dark"]}
          problems={["6-я несвязанная система", "baseLinkStyle + HoverLink wrapper"]}
        >
          <BeforeAfter
            before={<FooterASIS />}
            after={<FooterNEW />}
            diff={<><strong style={{ color: "#0f172a" }}>Diff:</strong> текущий Footer использует `baseLinkStyle` 15px `#cbd5e1` и обёртку `HoverLink`
              со state. Шестая система link'ов на сайте. Предлагаю: `rb-link-rail--dark` — 14px (slightly меньше для плотности),
              зелёный dot (как везде), hover bg `rgba(255,255,255,0.06)` + color `#34d399`. Hover-обёртка удаляется —
              pure CSS-класс, без useState.
            </>}
          />
        </PieceCard>

        {/* P9 — WarningPage blue */}
        <PieceCard
          index={9}
          title="WarningPage — View source (blue relic)"
          fileRef="src/pages/WarningPage.jsx:354"
          tokens={["L4 rb-link-meta"]}
          problems={["реликт старой палитры #2563eb", "underline на meta-контексте"]}
        >
          <BeforeAfter
            before={<WarningLinkASIS />}
            after={<WarningLinkNEW />}
            diff={<><strong style={{ color: "#0f172a" }}>Diff:</strong> единственное место на сайте с blue `#2563eb` underlined link —
              реликт старой палитры. Конфликтует с brand-palette (green/orange/navy). «View source» — это служебная meta-ссылка,
              не action. Правильный тип: `rb-link-meta` (13px slate, без underline, ExternalLink icon, hover тёмно-зелёный).
              Underline убирается — остаётся только на L1 (inline в body-тексте).
            </>}
          />
        </PieceCard>

        {/* P10 — SubPage tabs */}
        <PieceCard
          index={10}
          title="SubPage 8 tabs (Fees/Platforms/Regulation/…)"
          fileRef="src/components/subpage/SubPageTabs.jsx:38–100"
          tokens={["N2 rb-tab"]}
          problems={[]}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            <div style={{ padding: "22px 24px", background: "#f0fdf4", borderRight: "1px solid #f1f5f9" }}>
              <Eyebrow color="#059669">AS-IS = Proposed (keep!)</Eyebrow>
              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e8ecf1", overflow: "hidden" }}>
                <SubTabsDemo />
              </div>
            </div>
            <div style={{ padding: "22px 24px", background: "#f0fdf4" }}>
              <Eyebrow color="#059669">Token name</Eyebrow>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "#475569" }}>
                Текущий SubPageTabs компонент — один из немногих корректных паттернов на сайте.
                Navy-fill active + 3px green bottom-border — идеальная модель для <strong>N2 `rb-tab`</strong>.
                Мы его <strong>не трогаем</strong> визуально. Только переименовываем token в словаре для consistency.
                Если появятся новые табы (например в Compare vertical pills) — стиль копируется с этого эталона.
              </div>
            </div>
          </div>
          <div style={{
            padding: "14px 24px", background: "#fafbfc",
            fontSize: 13.5, lineHeight: 1.65, color: "#475569",
            borderTop: "1px solid #f1f5f9",
          }}>
            <strong style={{ color: "#0f172a" }}>Zero-change piece.</strong> Оставляем как есть. Показывает что не
            всё на сайте плохо — таб-система уже работает. Это гарантия того, что миграция
            не сломает рабочие места, а уберёт несвязанность там, где она реально вредит.
          </div>
        </PieceCard>

        {/* ───────── FINAL RECOMMENDATIONS ───────── */}
        <div style={{ marginTop: 40 }}>
          <Eyebrow>Final recommendations · 3-phase migration plan</Eyebrow>
          <h2 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 28,
            letterSpacing: "-0.03em", margin: "0 0 18px", color: "#0f172a",
          }}>Как конкретно мы улучшаем сайт</h2>

          <div style={{
            background: "#fff", borderRadius: 14,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)",
            padding: 28, marginBottom: 22,
          }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, margin: "0 0 14px", color: "#0f172a" }}>
              Phase 1 · CSS foundation <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: 13 }}>(~2-3 часа)</span>
            </h3>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: "#475569", paddingLeft: 18, margin: 0 }}>
              <li>Добавить 9 классов <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>rb-*</code> в <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>src/index.css</code>.</li>
              <li>Добавить базовый <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>:focus-visible</code> outline 2px `#f59e0b` — accessibility.</li>
              <li>Добавить <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>@media (prefers-reduced-motion: reduce)</code> override — отключает translateX/Y, оставляет color transitions.</li>
              <li>Старые <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>.link-green</code>, <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>.link-inline</code>, <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>.cta-primary/secondary/orange</code> оставляем как deprecated alias на 2 недели.</li>
              <li><strong>Коммит:</strong> <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>feat(css): add rb-* link/button tokens (phase 1)</code></li>
            </ul>
          </div>

          <div style={{
            background: "#fff", borderRadius: 14,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)",
            padding: 28, marginBottom: 22,
          }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, margin: "0 0 14px", color: "#0f172a" }}>
              Phase 2 · High-impact migration <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: 13 }}>(~4-6 часов)</span>
            </h3>
            <p style={{ fontSize: 14, color: "#475569", margin: "0 0 12px" }}>Приоритет по визуальному эффекту — что сразу даст тебе ощущение целостности:</p>
            <ol style={{ fontSize: 14, lineHeight: 1.8, color: "#475569", paddingLeft: 20, margin: 0 }}>
              <li><strong>P1 Countries card</strong> (Home.jsx:519) — 4 anti-patterns фиксятся одним куском. Самое заметное место.</li>
              <li><strong>P4 Home hero CTA cluster</strong> (Home.jsx:339) — правило «max 2 orange» возвращает ритм first-screen.</li>
              <li><strong>P5 BrokerReview Visit CTA × 3</strong> (BrokerReview.jsx) — 3 разные реализации → один токен. Важно т.к. это самая частая CTA на сайте.</li>
              <li><strong>P6 All Broker Reviews grid</strong> (Home.jsx:586) — убираем «чёрный блок».</li>
              <li><strong>P2 Editorial meta row</strong> + <strong>P9 WarningPage blue</strong> — быстрые win'ы.</li>
            </ol>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: "14px 0 0" }}><strong>Коммиты:</strong> по 1 файлу (5 коммитов). После каждого — Codex review.</p>
          </div>

          <div style={{
            background: "#fff", borderRadius: 14,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)",
            padding: 28, marginBottom: 22,
          }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, margin: "0 0 14px", color: "#0f172a" }}>
              Phase 3 · Sitewide cleanup <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: 13 }}>(~3-4 часа)</span>
            </h3>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: "#475569", paddingLeft: 18, margin: 0 }}>
              <li><strong>P7 Header mega-menu</strong> — консолидация, -9 строк inline.</li>
              <li><strong>P8 Footer</strong> — удаление `HoverLink` React wrapper, pure CSS.</li>
              <li><strong>P3 Intro</strong> + остальные ~70 inline-ссылок в body-тексте → `rb-link-inline` class.</li>
              <li>Grep-замены по 14 файлам (107 вхождений `.link-*` / `.cta-*`).</li>
              <li>Удаление deprecated alias.</li>
              <li><strong>Коммит:</strong> <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>chore(links): sitewide migration to rb-* tokens</code></li>
            </ul>
          </div>

          {/* ZERO-CHANGE block */}
          <div style={{
            background: "#ecfdf5", borderRadius: 14,
            boxShadow: "inset 0 0 0 1px rgba(4,120,87,0.15), 0 4px 24px rgba(4,120,87,0.05)",
            padding: 24, marginBottom: 22,
          }}>
            <Eyebrow color="#059669">Zero-change — что НЕ трогаем</Eyebrow>
            <ul style={{ fontSize: 14, lineHeight: 1.75, color: "#047857", paddingLeft: 18, margin: 0 }}>
              <li><strong>Header D1 Rail bottom</strong> (nav items 15px navy + зелёный bottom-border) — заморожен коммитом 5ffa063.</li>
              <li><strong>Broker Types section</strong> (home) — frozen там же.</li>
              <li><strong>SubPage 8 tabs</strong> (P10) — корректный паттерн, только переименовываем в token.</li>
              <li><strong>Editorial Team Plate B cards</strong> — frozen, токен зелёного strip top.</li>
              <li><strong>Breadcrumb</strong> (components/Breadcrumb.jsx) — корректный, только переименование.</li>
              <li><strong>Премия Dark hero + How We Rate</strong> — цветовое решение секции не меняем, только кнопки внутри.</li>
            </ul>
          </div>

          {/* Summary block */}
          <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
            borderRadius: 14, padding: 28, color: "#fff", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
            }} />
            <div style={{ position: "relative" }}>
              <Eyebrow color="#fbbf24">Next step</Eyebrow>
              <h2 style={{
                fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 24,
                letterSpacing: "-0.02em", margin: "0 0 12px", color: "#fff",
              }}>После твоего аппрува — сразу в фазу 1</h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(255,255,255,0.82)", margin: 0, maxWidth: 760 }}>
                Если концепция по 10 реальным кускам подходит — начинаю с <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: "rgba(255,255,255,0.12)", padding: "1px 6px", borderRadius: 4, color: "#fbbf24" }}>src/index.css</code> (9 токенов, ~2ч) и потом P1+P4+P5 (~3ч).
                После этого возвращаемся к главной — дорабатываем живой Home через <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: "rgba(255,255,255,0.12)", padding: "1px 6px", borderRadius: 4, color: "#fbbf24" }}>?redesign=v2</code> с новыми токенами —
                и уже всё будет визуально сцеплено. Если хочешь поменять какой-то токен до миграции — скажи сейчас, правлю в этом плейграунде.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
