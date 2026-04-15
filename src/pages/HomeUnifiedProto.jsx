/**
 * HomeUnifiedProto — Unified homepage prototype
 * Route: /proto/home-unified (dev-only)
 *
 * Design language lifted 1:1 from BrokerReview.jsx (the page Egor loves).
 * Applies Barbara's audit from 14.04.2026:
 *   - Radius 12 for cards, 10 for buttons — single stack
 *   - Two H2 scales (light 24/28, dark 28/40) — single helpers
 *   - D2k-row for every broker list (both affiliate and internal)
 *   - HeroBand for Hero AND About — one dark language
 *   - Country: green-uniform kept, orange "Most Popular" ribbon removed
 *   - Comparisons: pastel chips → mono dot+label
 *   - Top Rated score: always green pill, no per-threshold colors
 *   - Expert Team: Founder ribbon → eyebrow paragraph
 *   - Hero CTAs reduced from 4 → 2
 *   - Trust Strip removed (duplicate of About stats)
 *   - Category Nav: per-category border-left removed, unified neutral + orange hover
 */

import { useState, useEffect, useId } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import { getAllBrokersWithData } from "../data/brokers";
import RANKINGS from "../data/rankings";
import HUBS from "../data/categoryHubs";
import { POPULAR_PAIRS_BY_VERTICAL, canonicalPair, VERTICALS } from "../data/comparisons";
import BrokerLogo from "../components/BrokerLogo";
import Icon from "../components/Icon";
import HeroBand from "../components/HeroBand";
import CountryFlag from "../components/CountryFlag";
import AuthorAvatar from "../components/AuthorAvatar";
import { AUTHORS } from "../data/authors";
import HOMEPAGE_SEO from "../data/homepageSeoContent";
import { getVisitUrl } from "../utils/visitUrl";
import {
  ArrowRight, ArrowUpRight, Target, BookOpen,
  Shield, DollarSign, Star, Eye, Monitor, Zap, Check,
  ChevronDown, ChevronUp,
  ArrowRightLeft, ChartCandlestick, Users, Dices, Bitcoin, TrendingUp, GitBranch, Hourglass,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS — single source of truth, mirrors BrokerReview
   ═══════════════════════════════════════════════════════════════ */
const T = {
  bgPage: "#f8f9fb",
  bgCard: "#fff",
  border: "1px solid #e8ecf1",
  borderSoft: "1px solid #e2e8f0",
  radiusCard: 12,
  radiusBtn: 10,
  radiusPill: 8,

  textDark: "#0f172a",
  textBody: "#374151",
  textMuted: "#64748b",
  accentGreen: "#059669",
  accentGreenDark: "#047857",
  accentOrange: "#f59e0b",

  darkGreen: "#34d399",
  darkText: "rgba(255,255,255,0.9)",
  darkMuted: "rgba(255,255,255,0.65)",
  darkSoft: "rgba(255,255,255,0.08)",
  darkBorder: "1px solid rgba(255,255,255,0.10)",

  fontH: "'Outfit',sans-serif",
  fontBody: "'DM Sans',system-ui,sans-serif",
  fontMono: "'JetBrains Mono',monospace",

  shadowCard: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
  shadowCardHover: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
};

/* ── Icon maps ───────────────────────────────────────────────── */
const HOW_WE_RATE_ICONS = {
  "Regulation & Safety": Shield,
  "Trading Costs": DollarSign,
  "User Reputation": Star,
  "Broker Transparency": Eye,
  "Platforms & Tools": Monitor,
  "Execution Model": Zap,
};
const CAT_ICONS = {
  forex: ArrowRightLeft, cfd: ChartCandlestick, "copy-trading": Users,
  "spread-betting": Dices, crypto: Bitcoin, stocks: TrendingUp, options: GitBranch, futures: Hourglass,
};
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

const COUNTRIES = [
  { code: "GB", name: "United Kingdom", geo: "UK", reg: "FCA", featured: true, brokers: 14, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-uk", color: "#059669" },
    { label: "CFD", word: "Brokers", path: "/best-cfd-brokers-uk", color: "#2563eb" },
    { label: "Stocks", word: "Brokers", path: "/best-stock-brokers-uk", color: "#0ea5e9" },
    { label: "Spread Betting", word: "Platforms", path: "/best-spread-betting-uk", color: "#dc2626" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-uk", color: "#d97706" },
    { label: "Copy Trading", word: "Platforms", path: "/best-copy-trading-uk", color: "#7c3aed" },
  ]},
  { code: "US", name: "United States", geo: "USA", reg: "SEC / NFA", brokers: 11, verticals: [
    { label: "Stocks", word: "Brokers", path: "/best-stock-brokers-usa", color: "#0ea5e9" },
    { label: "Options", word: "Brokers", path: "/best-options-brokers-usa", color: "#7c3aed" },
    { label: "Futures", word: "Brokers", path: "/best-futures-brokers-usa", color: "#ea580c" },
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-usa", color: "#059669" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-usa", color: "#d97706" },
    { label: "Copy Trading", word: "Platforms", path: "/best-copy-trading-usa", color: "#7c3aed" },
  ]},
  { code: "AU", name: "Australia", geo: "Australia", reg: "ASIC", brokers: 12, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-australia", color: "#059669" },
    { label: "CFD", word: "Brokers", path: "/best-cfd-brokers-australia", color: "#2563eb" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-australia", color: "#d97706" },
  ]},
  { code: "DE", name: "Germany", geo: "Germany", reg: "BaFin", brokers: 10, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-germany", color: "#059669" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-germany", color: "#d97706" },
  ]},
  { code: "AE", name: "UAE", geo: "UAE", reg: "DFSA / VARA", brokers: 9, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-uae", color: "#059669" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-uae", color: "#d97706" },
  ]},
  { code: "SG", name: "Singapore", geo: "Singapore", reg: "MAS", brokers: 8, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-singapore", color: "#059669" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-singapore", color: "#d97706" },
  ]},
  { code: "CA", name: "Canada", geo: "Canada", reg: "CIRO / CSA", brokers: 7, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-canada", color: "#059669" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-canada", color: "#d97706" },
  ]},
  { code: "ZA", name: "South Africa", geo: "South Africa", reg: "FSCA", brokers: 8, verticals: [
    { label: "Forex", word: "Brokers", path: "/best-forex-brokers-south-africa", color: "#059669" },
    { label: "Crypto", word: "Brokers", path: "/best-crypto-brokers-south-africa", color: "#d97706" },
  ]},
];

const POPULAR_SEARCHES = [
  { label: "Forex Brokers UK", path: "/best-forex-brokers-uk" },
  { label: "Lowest Spread Brokers", path: "/lowest-spread-forex-brokers" },
  { label: "ECN FX Brokers", path: "/best-ecn-forex-brokers" },
  { label: "MT5 Forex Brokers", path: "/best-mt5-forex-brokers" },
  { label: "Bitcoin Brokers", path: "/best-crypto-brokers" },
  { label: "Brokers for Scalping", path: "/best-forex-brokers-for-scalping" },
  { label: "Zero Spread Brokers", path: "/zero-spread-forex-brokers" },
  { label: "Forex Brokers India", path: "/best-forex-brokers-india" },
];

/* ═══════════════════════════════════════════════════════════════
   Shared atoms
   ═══════════════════════════════════════════════════════════════ */
function H2Light({ children, mob }) {
  return <h2 style={{
    fontFamily: T.fontH, fontWeight: 800,
    fontSize: mob ? 24 : 28, color: T.textDark,
    letterSpacing: "-0.02em", margin: 0,
  }}>{children}</h2>;
}
function H2Dark({ children, mob }) {
  return <h2 style={{
    fontFamily: T.fontH, fontWeight: 800,
    fontSize: mob ? 28 : 40, color: "#fff",
    letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1,
  }}>{children}</h2>;
}
function Eyebrow({ children, dark = false }) {
  return <div style={{
    fontFamily: T.fontMono, fontSize: 11, fontWeight: 700,
    letterSpacing: "0.18em", textTransform: "uppercase",
    color: dark ? T.accentOrange : T.accentGreen,
    marginBottom: 10,
  }}>{children}</div>;
}
function SectionLead({ children, mob, dark = false }) {
  return <p style={{
    fontSize: mob ? 14 : 15, color: dark ? T.darkMuted : T.textMuted,
    lineHeight: 1.65, marginTop: 8, maxWidth: 680, margin: "8px 0 0",
  }}>{children}</p>;
}
function ScorePill({ score }) {
  return <span style={{
    fontFamily: T.fontMono, fontWeight: 800, fontSize: 13,
    color: T.accentGreen,
    padding: "4px 9px", borderRadius: T.radiusPill,
    background: "rgba(5,150,105,0.08)", border: "1px solid #a7f3d0",
    minWidth: 44, textAlign: "center", letterSpacing: "-0.02em",
    display: "inline-block", lineHeight: 1.3,
  }}>{score}</span>;
}
function CatDot({ vKey }) {
  const vm = VERTICAL_MAP[vKey];
  if (!vm) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 500, color: T.textMuted }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: vm.color, flexShrink: 0 }} />
      {vm.label}
    </span>
  );
}
function RankBadge({ n, accent = T.accentGreen }) {
  return <span style={{
    width: 28, height: 28, borderRadius: T.radiusPill,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: "#fff", border: `1.5px solid ${accent}`, color: accent,
    fontFamily: T.fontMono, fontWeight: 800, fontSize: 13, flexShrink: 0,
  }}>{n}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   CategoryNav — monochrome, orange hover (Barbara: C5)
   One cohesive dark block, no per-category colors on borders
   ═══════════════════════════════════════════════════════════════ */
function CategoryNav({ mob }) {
  const hubsData = HUBS.map(h => ({ ...h, IconComp: CAT_ICONS[h.slug] || ArrowRight }));
  return (
    <div style={{
      background: "#0a1220",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      padding: mob ? "18px 16px" : "24px 28px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 12px)",
      }} />
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: mob ? "0 4px" : "0 32px",
        display: "grid",
        gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        gap: mob ? 8 : 10, position: "relative",
      }}>
        {hubsData.map(hub => {
          const Ic = hub.IconComp;
          const color = VERTICAL_MAP[hub.slug]?.color || "#94a3b8";
          return (
            <Link key={hub.slug} to={hub.path} style={{
              display: "flex", alignItems: "center", gap: 10,
              height: mob ? 48 : 52,
              padding: mob ? "0 14px" : "0 18px",
              background: T.darkSoft,
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: T.radiusBtn,
              textDecoration: "none",
              transition: "background 0.2s, border-color 0.2s, transform 0.18s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(245,158,11,0.08)";
                e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)";
                e.currentTarget.style.transform = "translateY(-1px)";
                const arr = e.currentTarget.querySelector("[data-arr]");
                if (arr) { arr.style.color = T.accentOrange; arr.style.transform = "translateX(3px)"; }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = T.darkSoft;
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "none";
                const arr = e.currentTarget.querySelector("[data-arr]");
                if (arr) { arr.style.color = "rgba(255,255,255,0.3)"; arr.style.transform = "none"; }
              }}
            >
              <Ic size={17} strokeWidth={1.75} style={{ color, flexShrink: 0, opacity: 0.9 }} />
              <span style={{ fontFamily: T.fontH, fontSize: mob ? 14 : 15, fontWeight: 700, color: "#f8fafc", flex: 1, letterSpacing: "-0.01em" }}>
                {hub.name}
              </span>
              <ArrowRight data-arr size={14} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0, transition: "color 0.18s, transform 0.18s" }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CategoryCardsV2 — light airy cards, replaces 8 dark buttons
   Improves rhythm: Hero (dark) → Cards (light) → Intro (light)
   Each card: pastel icon tile + name + broker count + arrow
   ═══════════════════════════════════════════════════════════════ */
function CategoryCardsV2({ mob, tab }) {
  const hubsData = HUBS.map(h => ({ ...h, IconComp: CAT_ICONS[h.slug] || ArrowRight }));
  // Broker counts per category — static approximation from rankings
  const COUNT_BY_SLUG = {
    forex: 32, cfd: 24, crypto: 18, "copy-trading": 9,
    "spread-betting": 6, stocks: 12, options: 5, futures: 8,
  };
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "28px 16px 0" : "40px 24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: mob ? 16 : 20, gap: 20 }}>
        <div>
          <Eyebrow>Explore by Category</Eyebrow>
          <H2Light mob={mob}>What do you want to trade?</H2Light>
        </div>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
        gap: mob ? 10 : 14,
      }}>
        {hubsData.map(hub => {
          const Ic = hub.IconComp;
          const color = VERTICAL_MAP[hub.slug]?.color || "#64748b";
          const count = COUNT_BY_SLUG[hub.slug] || 6;
          return (
            <Link key={hub.slug} to={hub.path} style={{
              display: "flex", flexDirection: "column", gap: 12,
              padding: mob ? "16px 14px" : "20px 20px",
              background: T.bgCard, borderRadius: T.radiusCard,
              border: T.border, boxShadow: T.shadowCard,
              textDecoration: "none", color: T.textDark,
              transition: "all 0.2s", position: "relative",
              minHeight: mob ? 108 : 128,
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = T.shadowCardHover;
                e.currentTarget.style.borderColor = color;
                const arr = e.currentTarget.querySelector("[data-cc-arr]");
                if (arr) { arr.style.color = color; arr.style.transform = "translateX(3px)"; }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = T.shadowCard;
                e.currentTarget.style.borderColor = "#e8ecf1";
                const arr = e.currentTarget.querySelector("[data-cc-arr]");
                if (arr) { arr.style.color = "#cbd5e1"; arr.style.transform = "none"; }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{
                  width: mob ? 38 : 44, height: mob ? 38 : 44, borderRadius: T.radiusBtn,
                  background: `${color}14`, border: `1px solid ${color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Ic size={mob ? 18 : 22} color={color} strokeWidth={1.8} />
                </div>
                <ArrowRight data-cc-arr size={16} style={{ color: "#cbd5e1", transition: "color 0.2s, transform 0.2s" }} />
              </div>
              <div>
                <div style={{ fontFamily: T.fontH, fontWeight: 700, fontSize: mob ? 14 : 16, color: T.textDark, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                  {hub.name}
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4, fontWeight: 500 }}>
                  {count} brokers rated
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Broker row — light D2k (Barbara: R1)
   Used for both affiliate Visit and internal Review links
   ═══════════════════════════════════════════════════════════════ */
function BrokerRow({ rank, broker, mob, lp, mode = "visit" }) {
  // mode: "visit" = external aff link; "review" = internal link to /reviews/:slug
  const b = broker.B;
  const visitUrl = getVisitUrl(broker.slug, b.url);
  const reviewPath = lp(`/reviews/${broker.slug}`);
  const verticals = (b.verticals || []).slice(0, mob ? 2 : 3);

  return (
    <div className="d2k-row" style={{
      display: "flex", alignItems: "center", gap: mob ? 10 : 14,
      padding: mob ? "12px 14px" : "14px 18px",
      background: T.bgCard, borderRadius: T.radiusCard,
      border: T.border,
      minHeight: 72, position: "relative",
    }}>
      {rank && <RankBadge n={rank} />}

      <Link to={reviewPath} style={{
        width: mob ? 44 : 48, height: mob ? 44 : 48,
        borderRadius: 10, overflow: "hidden", flexShrink: 0,
        border: "1px solid rgba(0,0,0,0.04)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={mob ? 44 : 48} shape="icon" />
      </Link>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        <Link to={reviewPath} style={{
          fontFamily: T.fontH, fontWeight: 700, fontSize: mob ? 15 : 16,
          color: T.textDark, textDecoration: "none", letterSpacing: "-0.01em",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{b.name}</Link>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {verticals.map(v => <CatDot key={v} vKey={v} />)}
        </div>
        {/* Risk warning on hover */}
        <p className="d2k-risk" style={{
          fontSize: 10, color: "#94a3b8", fontWeight: 500, fontStyle: "italic",
        }}>CFDs are complex — most retail accounts lose money.</p>
      </div>

      <ScorePill score={b.score} />

      {mode === "visit" ? (
        <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" aria-label={`Visit ${b.name}`} style={{
          width: 36, height: 36, borderRadius: T.radiusBtn,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#fff", border: "1px solid #e2e8f0", flexShrink: 0,
          textDecoration: "none",
        }}>
          <ArrowUpRight className="d2k-arrow" size={18} color="#94a3b8" />
        </a>
      ) : (
        <Link to={reviewPath} aria-label={`Read ${b.name} review`} style={{
          width: 36, height: 36, borderRadius: T.radiusBtn,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#fff", border: "1px solid #e2e8f0", flexShrink: 0,
        }}>
          <ArrowRight className="d2k-arrow" size={18} color="#94a3b8" />
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BrokerRowV2 — stable height, no jump (Egor fix)
   - Content column has fixed minHeight that always fits risk line
   - Risk warning: opacity 0/1 on hover, no height change
   - showRisk=false → no risk element rendered at all (All Reviews)
   - editorPick → small amber "Top Pick" inline tag for #1
   ═══════════════════════════════════════════════════════════════ */
function BrokerRowV2({ rank, broker, mob, lp, mode = "visit", showRisk = true, editorPick = false }) {
  const [hover, setHover] = useState(false);
  const b = broker.B;
  const visitUrl = getVisitUrl(broker.slug, b.url);
  const reviewPath = lp(`/reviews/${broker.slug}`);
  const verticals = (b.verticals || []).slice(0, mob ? 2 : 3);
  // Reserve space for: name(22) + meta(16) + risk line(16) = ~54px desktop, ~50px mobile
  const infoMinHeight = showRisk ? (mob ? 52 : 56) : (mob ? 36 : 40);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: mob ? 10 : 14,
      padding: mob ? "12px 14px" : "14px 18px",
      background: T.bgCard, borderRadius: T.radiusCard,
      border: `1.5px solid ${hover ? "#cbd5e1" : "transparent"}`,
      boxShadow: hover ? "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)" : "0 1px 3px rgba(0,0,0,0.04)",
      transition: "border-color 0.2s, box-shadow 0.2s",
      minHeight: 72, position: "relative",
    }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {rank && <RankBadge n={rank} />}

      <Link to={reviewPath} style={{
        width: mob ? 44 : 48, height: mob ? 44 : 48,
        borderRadius: 10, overflow: "hidden", flexShrink: 0,
        border: "1px solid rgba(0,0,0,0.04)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <BrokerLogo slug={broker.slug} name={b.name} fallback={b.logo} size={mob ? 44 : 48} shape="icon" />
      </Link>

      <div style={{ flex: 1, minWidth: 0, minHeight: infoMinHeight, display: "flex", flexDirection: "column", justifyContent: "center", gap: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Link to={reviewPath} style={{
            fontFamily: T.fontH, fontWeight: 700, fontSize: mob ? 15 : 16,
            color: T.textDark, textDecoration: "none", letterSpacing: "-0.01em",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%",
          }}>{b.name}</Link>
          {editorPick && (
            <span style={{
              padding: "2px 7px", borderRadius: 5,
              background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)",
              color: "#b45309", fontSize: 10, fontWeight: 800, letterSpacing: "0.04em",
              textTransform: "uppercase", fontFamily: T.fontMono,
            }}>★ Top Pick</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {verticals.map(v => <CatDot key={v} vKey={v} />)}
        </div>
        {showRisk && (
          <p style={{
            fontSize: 10, color: "#94a3b8", fontWeight: 500, fontStyle: "italic", margin: 0,
            opacity: hover ? 1 : 0, transition: "opacity 0.2s",
            height: 14, lineHeight: "14px", overflow: "hidden",
          }}>CFDs are complex — most retail accounts lose money.</p>
        )}
      </div>

      <ScorePill score={b.score} />

      {mode === "visit" ? (
        <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" aria-label={`Visit ${b.name}`} style={{
          width: 36, height: 36, borderRadius: T.radiusBtn,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#fff", border: "1px solid #e2e8f0", flexShrink: 0,
          textDecoration: "none",
          transition: "transform 0.2s",
          transform: hover ? "translateX(2px)" : "none",
        }}>
          <ArrowUpRight size={18} color={hover ? T.accentGreen : "#94a3b8"} style={{ transition: "color 0.2s" }} />
        </a>
      ) : (
        <Link to={reviewPath} aria-label={`Read ${b.name} review`} style={{
          width: 36, height: 36, borderRadius: T.radiusBtn,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#fff", border: "1px solid #e2e8f0", flexShrink: 0,
          transition: "transform 0.2s",
          transform: hover ? "translateX(2px)" : "none",
        }}>
          <ArrowRight size={18} color={hover ? T.accentGreen : "#94a3b8"} style={{ transition: "color 0.2s" }} />
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ExpertTeamV2 — featured founder + grid (Egor: "прилично")
   Credentials as green pills. Hover: border + "View profile →"
   ═══════════════════════════════════════════════════════════════ */
function ExpertTeamV2({ mob, tab, lp }) {
  const founders = Object.values(AUTHORS).filter(a => a.isFounder);
  const others = Object.values(AUTHORS).filter(a => !a.isFounder);
  const founder = founders[0];

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "40px 16px" : "56px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 20 }}>
        <div>
          <Eyebrow>Editorial Team</Eyebrow>
          <H2Light mob={mob}>Reviewed by certified experts</H2Light>
        </div>
        <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600, fontFamily: T.fontMono }}>
          {Object.values(AUTHORS).length} reviewers
        </span>
      </div>
      <SectionLead mob={mob}>
        Every review is written, peer-reviewed, and fact-checked by industry professionals —
        CFA charterholders, Series-licensed brokers, and practising traders.
      </SectionLead>

      {/* Featured founder — wide card */}
      {founder && (
        <Link to={lp(`/author/${founder.id}`)} style={{
          display: "block", marginTop: mob ? 20 : 28,
          padding: mob ? "22px 18px" : "28px 28px",
          borderRadius: T.radiusCard, background: T.bgCard,
          border: `2px solid ${T.accentGreen}`,
          textDecoration: "none", color: T.textDark,
          boxShadow: T.shadowCard, transition: "all 0.2s",
          position: "relative", overflow: "hidden",
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(5,150,105,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = T.shadowCard; e.currentTarget.style.transform = "none"; }}
        >
          {/* Decorative corner tag */}
          <div style={{
            position: "absolute", top: 0, right: 0,
            padding: "6px 14px", borderRadius: "0 0 0 10px",
            background: T.accentGreen, color: "#fff",
            fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase",
            fontFamily: T.fontMono,
          }}>Editor-in-Chief</div>
          <div style={{ display: mob ? "block" : "flex", gap: 24, alignItems: "center" }}>
            <div style={{ flexShrink: 0, display: "flex", justifyContent: mob ? "flex-start" : "center", marginBottom: mob ? 16 : 0 }}>
              <AuthorAvatar author={founder} size={mob ? 72 : 92} showVerified />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.fontH, fontWeight: 800, fontSize: mob ? 20 : 24, color: T.textDark, letterSpacing: "-0.02em" }}>
                {founder.name}
              </div>
              <div style={{ fontSize: 14, color: T.textMuted, marginTop: 4, fontWeight: 500 }}>
                {founder.role}
              </div>
              {founder.credentials && founder.credentials.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                  {founder.credentials.map(cr => (
                    <span key={cr} style={{
                      padding: "3px 9px", borderRadius: 5,
                      background: "rgba(5,150,105,0.08)",
                      border: "1px solid #a7f3d0",
                      color: T.accentGreen,
                      fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.04em",
                    }}>{cr}</span>
                  ))}
                </div>
              )}
              {founder.bio && (
                <p style={{ fontSize: mob ? 13 : 14, color: T.textBody, lineHeight: 1.6, margin: "12px 0 0", maxWidth: 600 }}>
                  {founder.bio.slice(0, mob ? 110 : 170)}{founder.bio.length > (mob ? 110 : 170) ? "…" : ""}
                </p>
              )}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 14, fontSize: 13, fontWeight: 700, color: T.accentGreen }}>
                View full profile <ArrowRight size={13} />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Grid of other reviewers */}
      <div style={{
        marginTop: mob ? 12 : 16,
        display: "grid",
        gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
        gap: 12,
      }}>
        {others.map(a => (
          <Link key={a.id} to={lp(`/author/${a.id}`)} style={{
            display: "flex", flexDirection: "column", gap: 10,
            padding: mob ? "16px 14px" : "20px 18px",
            borderRadius: T.radiusCard, background: T.bgCard, border: T.border,
            textDecoration: "none", color: T.textDark,
            boxShadow: T.shadowCard, transition: "all 0.2s",
            position: "relative", minHeight: mob ? 172 : 196,
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = T.accentGreen;
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(5,150,105,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
              const l = e.currentTarget.querySelector("[data-vp]");
              if (l) { l.style.color = T.accentGreen; l.style.opacity = "1"; }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "#e8ecf1";
              e.currentTarget.style.boxShadow = T.shadowCard;
              e.currentTarget.style.transform = "none";
              const l = e.currentTarget.querySelector("[data-vp]");
              if (l) { l.style.color = T.textMuted; l.style.opacity = "0.6"; }
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <AuthorAvatar author={a} size={mob ? 44 : 52} showVerified />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.fontH, fontWeight: 700, fontSize: mob ? 13 : 14.5, color: T.textDark, letterSpacing: "-0.01em", lineHeight: 1.25 }}>
                  {a.name}
                </div>
                <div style={{ fontSize: 11.5, color: T.textMuted, marginTop: 3, lineHeight: 1.3 }}>{a.role}</div>
              </div>
            </div>
            {a.credentials && a.credentials.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {a.credentials.slice(0, 3).map(cr => (
                  <span key={cr} style={{
                    padding: "2px 7px", borderRadius: 4,
                    background: "rgba(5,150,105,0.08)",
                    border: "1px solid #a7f3d0",
                    color: T.accentGreen,
                    fontFamily: T.fontMono, fontSize: 10, fontWeight: 700, letterSpacing: "0.02em",
                  }}>{cr}</span>
                ))}
              </div>
            )}
            <div data-vp style={{
              marginTop: "auto", fontSize: 11, fontWeight: 700,
              color: T.textMuted, opacity: 0.6,
              display: "inline-flex", alignItems: "center", gap: 3,
              transition: "color 0.2s, opacity 0.2s",
            }}>
              View profile <ArrowRight size={11} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CategoryCardsV3 — top broker preview per category (Egor: "cheap → concept")
   Real brand signal: dark strip with #1 broker wordmark + category meta
   Typography-led (big category letters), not abstract icon circles
   ═══════════════════════════════════════════════════════════════ */
function CategoryCardsV3({ mob, tab, allBrokers }) {
  const COUNT_BY_SLUG = {
    forex: 32, cfd: 24, crypto: 18, "copy-trading": 9,
    "spread-betting": 6, stocks: 12, options: 5, futures: 8,
  };
  const REG_BY_SLUG = {
    forex: "FCA · ASIC · CySEC", cfd: "FCA · BaFin · ASIC",
    crypto: "MAS · DFSA · FSCA", "copy-trading": "CySEC · FCA",
    "spread-betting": "FCA only", stocks: "SEC · FCA",
    options: "SEC · FINRA", futures: "CFTC · NFA",
  };
  // For each hub, find the top-ranked broker that trades this vertical
  function topBrokerFor(slug) {
    // allBrokers already sorted desc by score
    const verticalKey = slug; // matches B.verticals keys in data
    return allBrokers.find(b => (b.B.verticals || []).includes(verticalKey));
  }

  const hubsData = HUBS.map(h => ({
    ...h,
    IconComp: CAT_ICONS[h.slug] || ArrowRight,
    topBroker: topBrokerFor(h.slug),
    count: COUNT_BY_SLUG[h.slug] || 6,
    regs: REG_BY_SLUG[h.slug] || "Regulated",
  }));

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "28px 16px 0" : "44px 24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: mob ? 18 : 24, gap: 20, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 560 }}>
          <Eyebrow>Browse rankings</Eyebrow>
          <H2Light mob={mob}>Pick your market. See who leads it.</H2Light>
          <SectionLead mob={mob}>
            Eight asset classes, each with a tier-1-regulated #1. Click any category to see the full ranking.
          </SectionLead>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
        gap: mob ? 10 : 14,
      }}>
        {hubsData.map(hub => {
          const Ic = hub.IconComp;
          const color = VERTICAL_MAP[hub.slug]?.color || "#64748b";
          const tb = hub.topBroker;

          return (
            <Link key={hub.slug} to={hub.path} style={{
              display: "flex", flexDirection: "column",
              background: T.bgCard, borderRadius: T.radiusCard,
              border: T.border, boxShadow: T.shadowCard,
              textDecoration: "none", color: T.textDark,
              transition: "all 0.22s", overflow: "hidden",
              minHeight: mob ? 180 : 210,
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(15,23,42,0.10)";
                e.currentTarget.style.borderColor = color;
                const strip = e.currentTarget.querySelector("[data-strip]");
                if (strip) strip.style.filter = "brightness(1.15)";
                const arr = e.currentTarget.querySelector("[data-v3-arr]");
                if (arr) { arr.style.color = color; arr.style.transform = "translateX(3px)"; }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = T.shadowCard;
                e.currentTarget.style.borderColor = "#e8ecf1";
                const strip = e.currentTarget.querySelector("[data-strip]");
                if (strip) strip.style.filter = "none";
                const arr = e.currentTarget.querySelector("[data-v3-arr]");
                if (arr) { arr.style.color = T.textMuted; arr.style.transform = "none"; }
              }}
            >
              {/* Top: dark strip with #1 broker wordmark */}
              <div data-strip style={{
                background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 60%, #064e3b 100%)",
                padding: mob ? "14px 14px 12px" : "16px 18px 14px",
                position: "relative",
                borderBottom: `2px solid ${color}`,
                transition: "filter 0.22s",
              }}>
                <div style={{
                  position: "absolute", top: 10, left: mob ? 14 : 18,
                  fontFamily: T.fontMono, fontSize: 9, fontWeight: 800,
                  color, letterSpacing: "0.18em", textTransform: "uppercase",
                  opacity: 0.9,
                }}>#1 Pick</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: mob ? 44 : 54, marginTop: 10 }}>
                  {tb ? (
                    <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${tb.slug}.svg`}
                      alt={tb.B.name}
                      style={{ maxWidth: "80%", maxHeight: mob ? 30 : 36, objectFit: "contain" }}
                      onError={e => { e.target.style.display = "none"; e.target.parentNode.innerHTML = `<span style="font-family: ${T.fontH}; font-weight:800; font-size:${mob ? 16 : 18}px; color:#fff; letter-spacing:-0.02em">${tb.B.name}</span>`; }}
                    />
                  ) : (
                    <Ic size={mob ? 26 : 30} color={color} strokeWidth={1.5} />
                  )}
                </div>
              </div>

              {/* Body: category name + meta */}
              <div style={{ padding: mob ? "14px 14px 12px" : "16px 18px 14px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                <div style={{
                  fontFamily: T.fontH, fontWeight: 800, fontSize: mob ? 16 : 19,
                  color: T.textDark, letterSpacing: "-0.02em", lineHeight: 1.15,
                }}>
                  Best {hub.name}
                </div>
                <div style={{ fontSize: 11.5, color: T.textMuted, fontWeight: 500, lineHeight: 1.4 }}>
                  {hub.count} brokers · {hub.regs}
                </div>
                <div style={{
                  marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between",
                  paddingTop: 8, borderTop: "1px solid #f1f5f9",
                }}>
                  {tb ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{
                        fontFamily: T.fontMono, fontSize: 11, fontWeight: 800,
                        color: T.accentGreen,
                      }}>{tb.B.score}</span>
                      <span style={{ fontSize: 10.5, color: T.textMuted, fontWeight: 500 }}>/ 10</span>
                    </div>
                  ) : <span />}
                  <ArrowRight data-v3-arr size={15} style={{ color: T.textMuted, transition: "color 0.2s, transform 0.2s", flexShrink: 0 }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ExpertTeamV3 — real editorial, not template (Egor: "шаблонно")
   Aggregate stats strip + founder pull quote + specialty tags
   ═══════════════════════════════════════════════════════════════ */
function ExpertTeamV3({ mob, tab, lp }) {
  const all = Object.values(AUTHORS);
  const founders = all.filter(a => a.isFounder);
  const others = all.filter(a => !a.isFounder);
  const founder = founders[0];

  // Aggregate stats
  const totalYears = all.reduce((sum, a) => {
    const m = String(a.exp || "").match(/(\d+)/);
    return sum + (m ? parseInt(m[1]) : 0);
  }, 0);
  const totalReviews = all.reduce((s, a) => s + (a.reviews || 0), 0);
  const credentialCount = all.reduce((s, a) => s + (a.credentials?.length || 0), 0);
  const licenseTypes = Array.from(new Set(all.flatMap(a => a.credentials || []))).slice(0, 6);

  // Specialty tag color picker — mono with subtle accent
  const specialtyColor = (specialty) => {
    const s = String(specialty || "").toLowerCase();
    if (s.includes("forex") || s.includes("fx")) return "#059669";
    if (s.includes("crypto")) return "#f59e0b";
    if (s.includes("stock") || s.includes("equit")) return "#0ea5e9";
    if (s.includes("options")) return "#8b5cf6";
    if (s.includes("regul") || s.includes("licens") || s.includes("compli")) return "#dc2626";
    if (s.includes("algo") || s.includes("platform") || s.includes("infra")) return "#7c3aed";
    return "#64748b";
  };

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "40px 16px" : "64px 24px" }}>
      <div style={{ maxWidth: 760 }}>
        <Eyebrow>Editorial · Q1 2026</Eyebrow>
        <H2Light mob={mob}>
          {totalYears}+ years of markets experience behind every review
        </H2Light>
        <p style={{ fontSize: mob ? 15 : 16, color: T.textBody, lineHeight: 1.7, margin: "14px 0 0", maxWidth: 680 }}>
          Seven analysts. Thousands of hours of broker testing. Credentials verified. Real money accounts.
          Every published review has been through a three-step editorial process — written, peer-reviewed, fact-checked.
        </p>
      </div>

      {/* Stats strip */}
      <div style={{
        marginTop: mob ? 26 : 32,
        display: "grid",
        gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        gap: 1, background: "#e8ecf1",
        border: T.border, borderRadius: T.radiusCard, overflow: "hidden",
      }}>
        {[
          { n: `${totalYears}+`, l: "Years combined" },
          { n: all.length, l: "Analysts & editors" },
          { n: `${totalReviews}+`, l: "Broker reviews published" },
          { n: credentialCount, l: "Verified credentials" },
        ].map((s, i) => (
          <div key={i} style={{
            background: T.bgCard, padding: mob ? "20px 16px" : "24px 20px", textAlign: "left",
          }}>
            <div style={{
              fontFamily: T.fontMono, fontSize: mob ? 26 : 34, fontWeight: 800,
              color: T.accentGreen, letterSpacing: "-0.03em", lineHeight: 1,
            }}>{s.n}</div>
            <div style={{
              fontSize: 11, color: T.textMuted, fontWeight: 600,
              letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 8,
            }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Credential chips row */}
      {licenseTypes.length > 0 && (
        <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: T.fontMono, marginRight: 4 }}>Certifications:</span>
          {licenseTypes.map(cr => (
            <span key={cr} style={{
              padding: "3px 9px", borderRadius: 5,
              background: "rgba(5,150,105,0.08)", border: "1px solid #a7f3d0",
              color: T.accentGreen,
              fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.04em",
            }}>{cr}</span>
          ))}
        </div>
      )}

      {/* Founder pull-quote */}
      {founder && (
        <figure style={{
          margin: mob ? "32px 0 0" : "44px 0 0",
          padding: mob ? "22px 18px 22px 22px" : "28px 28px 28px 36px",
          background: T.bgCard, borderRadius: T.radiusCard,
          border: T.border,
          borderLeft: `4px solid ${T.accentGreen}`,
          boxShadow: T.shadowCard,
          display: mob ? "block" : "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr auto",
          gap: mob ? 16 : 28, alignItems: "center",
        }}>
          <div>
            <div style={{
              fontFamily: T.fontH, fontWeight: 700, fontSize: mob ? 17 : 21,
              color: T.textDark, lineHeight: 1.45, letterSpacing: "-0.01em",
            }}>
              <span style={{ color: T.accentGreen, fontSize: mob ? 24 : 32, lineHeight: 0, verticalAlign: "-0.2em", marginRight: 4 }}>"</span>
              We built RatedBrokers because nobody should choose a broker based on who paid for the top spot.
              Every score, every ranking, every review — data-driven, verified, and independent.
            </div>
            <figcaption style={{
              marginTop: mob ? 14 : 16,
              fontSize: 12, color: T.textMuted,
              display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            }}>
              <Link to={lp(`/author/${founder.id}`)} style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", color: T.textDark }}>
                <AuthorAvatar author={founder} size={28} showVerified={false} />
                <span style={{ fontWeight: 700, color: T.textDark }}>{founder.name}</span>
              </Link>
              <span style={{ color: "#cbd5e1" }}>·</span>
              <span>{founder.role}</span>
              <span style={{ color: "#cbd5e1" }}>·</span>
              <span style={{ fontFamily: T.fontMono, color: T.accentGreen, fontWeight: 700 }}>{founder.exp}</span>
            </figcaption>
          </div>
          {!mob && (
            <Link to={lp(`/author/${founder.id}`)} className="link-green" style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", alignSelf: "center" }}>
              Meet the founder <ArrowRight size={12} className="link-arrow" />
            </Link>
          )}
        </figure>
      )}

      {/* Reviewers grid with specialty tags */}
      <div style={{
        marginTop: mob ? 22 : 28,
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
        gap: 12,
      }}>
        {others.map(a => {
          const spColor = specialtyColor(a.specialty);
          return (
            <Link key={a.id} to={lp(`/author/${a.id}`)} style={{
              display: "flex", flexDirection: "column", gap: 12,
              padding: mob ? "18px" : "22px",
              borderRadius: T.radiusCard, background: T.bgCard, border: T.border,
              textDecoration: "none", color: T.textDark,
              boxShadow: T.shadowCard, transition: "all 0.2s",
              position: "relative",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = T.accentGreen;
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(5,150,105,0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#e8ecf1";
                e.currentTarget.style.boxShadow = T.shadowCard;
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <AuthorAvatar author={a} size={mob ? 52 : 56} showVerified />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: T.fontH, fontWeight: 800, fontSize: mob ? 15 : 16, color: T.textDark, letterSpacing: "-0.01em", lineHeight: 1.25 }}>
                    {a.name}
                  </div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3, lineHeight: 1.35 }}>{a.role}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10.5, color: T.accentGreen, fontWeight: 700, marginTop: 6, letterSpacing: "0.04em" }}>
                    {a.exp.toUpperCase()} {a.reviews > 0 ? `· ${a.reviews} reviews` : ""}
                  </div>
                </div>
              </div>

              {/* Specialty tag */}
              {a.specialty && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 10px", borderRadius: 6,
                  background: `${spColor}0f`,
                  border: `1px solid ${spColor}35`,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: spColor, flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, color: spColor, fontWeight: 700, letterSpacing: "-0.01em" }}>
                    {a.specialty}
                  </span>
                </div>
              )}

              {/* Credentials + bio */}
              {a.credentials && a.credentials.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {a.credentials.map(cr => (
                    <span key={cr} style={{
                      padding: "2px 7px", borderRadius: 4,
                      background: "#f1f5f9", border: "1px solid #e2e8f0",
                      color: T.textBody,
                      fontFamily: T.fontMono, fontSize: 10, fontWeight: 700, letterSpacing: "0.02em",
                    }}>{cr}</span>
                  ))}
                </div>
              )}
              {a.shortBio && (
                <p style={{ fontSize: 12.5, color: T.textBody, lineHeight: 1.55, margin: 0 }}>
                  {a.shortBio.length > 120 ? a.shortBio.slice(0, 118) + "…" : a.shortBio}
                </p>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer link — editorial process */}
      <div style={{ marginTop: mob ? 20 : 24, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <Link to={lp("/trust-score")} className="link-green">
          How we edit and verify reviews <ArrowRight size={12} className="link-arrow" />
        </Link>
        <span style={{ color: "#cbd5e1" }}>·</span>
        <Link to={lp("/methodology")} className="link-green">
          Full scoring methodology <ArrowRight size={12} className="link-arrow" />
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ExpertTeamV4 — "Editorial newsroom" (Egor: "убого, шаблонно")
   References: BestBrokers founder-first, ForexBrokers opening narrative.
   Principles:
     - Type-first. No pills. No decorative stat blocks.
     - Opening narrative paragraph with numbers woven in, not stat strip
     - Founder as "Note from the editor" — portrait + signed quote
     - Roster: newspaper masthead (name · cred / role · years / specialty · reviews)
     - Subtle grayscale on avatars → color on hover (restraint)
   ═══════════════════════════════════════════════════════════════ */
function ExpertTeamV4({ mob, tab, lp }) {
  const all = Object.values(AUTHORS);
  const founder = all.find(a => a.isFounder);
  const reviewers = all.filter(a => !a.isFounder);

  const totalYears = all.reduce((s, a) => {
    const m = String(a.exp || "").match(/(\d+)/);
    return s + (m ? parseInt(m[1]) : 0);
  }, 0);
  const totalReviews = all.reduce((s, a) => s + (a.reviews || 0), 0);

  return (
    <section style={{ maxWidth: 1080, margin: "0 auto", padding: mob ? "48px 20px" : "80px 24px" }}>

      {/* Opening — editorial lead paragraph */}
      <div style={{ maxWidth: 640, marginBottom: mob ? 36 : 56 }}>
        <div style={{
          fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700,
          color: T.textMuted, letterSpacing: "0.22em", textTransform: "uppercase",
          marginBottom: 18, display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ width: 22, height: 1, background: T.textMuted, display: "inline-block" }} />
          Editorial
        </div>
        <h2 style={{
          fontFamily: T.fontH, fontWeight: 800,
          fontSize: mob ? 28 : 40, lineHeight: 1.12, color: T.textDark,
          letterSpacing: "-0.035em", margin: 0,
        }}>
          The people behind every score.
        </h2>
        <p style={{
          fontSize: mob ? 15 : 17, lineHeight: 1.7, color: T.textBody,
          margin: mob ? "18px 0 0" : "22px 0 0",
        }}>
          <span style={{ fontWeight: 700, color: T.textDark }}>{all.length} analysts</span>.{" "}
          <span style={{ fontWeight: 700, color: T.textDark }}>{totalYears}+ years</span> of markets experience combined.{" "}
          <span style={{ fontWeight: 700, color: T.textDark }}>{totalReviews}+ broker reviews</span> published with a byline.
          Every review is written, peer-reviewed, and fact-checked — no ghostwriters,
          no AI-only copy. Credentials are verified against the issuing body before a name goes next to a score.
        </p>
      </div>

      {/* Founder — "Note from the editor" */}
      {founder && (
        <div style={{
          display: mob ? "block" : "grid",
          gridTemplateColumns: mob ? "1fr" : "220px 1fr",
          gap: mob ? 24 : 48,
          alignItems: "start",
          paddingBottom: mob ? 40 : 56,
          borderBottom: "1px solid #e8ecf1",
          marginBottom: mob ? 36 : 48,
        }}>
          {/* Portrait */}
          <Link to={lp(`/author/${founder.id}`)} style={{
            display: "block", textDecoration: "none",
            marginBottom: mob ? 18 : 0,
          }}>
            <div style={{
              width: mob ? 140 : 200, height: mob ? 140 : 200,
              overflow: "hidden", borderRadius: 4,
              background: "#e8ecf1",
              filter: "grayscale(30%) contrast(1.02)",
              transition: "filter 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.filter = "grayscale(0%) contrast(1)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "grayscale(30%) contrast(1.02)"; }}
            >
              {founder.image ? (
                <img src={`${import.meta.env.BASE_URL}${founder.image.replace(/^\//, "")}`}
                  alt={founder.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              ) : (
                <AuthorAvatar author={founder} size={mob ? 140 : 200} showVerified={false} />
              )}
            </div>
          </Link>

          {/* Note */}
          <div>
            <div style={{
              fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700,
              color: T.accentGreen, letterSpacing: "0.22em", textTransform: "uppercase",
              marginBottom: 14,
            }}>
              Note from the editor
            </div>
            <p style={{
              fontFamily: T.fontH, fontWeight: 500,
              fontSize: mob ? 17 : 21, lineHeight: 1.55,
              color: T.textDark, letterSpacing: "-0.015em",
              margin: 0, fontStyle: "italic",
            }}>
              I started RatedBrokers because the top spot on most comparison sites goes to the highest bidder, not the best broker.
              We publish the methodology, show our working, and score every broker the same way —
              the ones that pay us a commission and the ones that don't.
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginTop: mob ? 18 : 24,
              paddingTop: mob ? 16 : 20, borderTop: "1px solid #f1f5f9",
              flexWrap: "wrap",
            }}>
              <Link to={lp(`/author/${founder.id}`)} style={{
                fontFamily: T.fontH, fontWeight: 700, fontSize: 15,
                color: T.textDark, textDecoration: "none", letterSpacing: "-0.01em",
              }}>
                — {founder.name}
              </Link>
              <span style={{ fontSize: 13, color: T.textMuted }}>{founder.role}</span>
              <span style={{ color: "#cbd5e1" }}>·</span>
              <span style={{ fontFamily: T.fontMono, fontSize: 12, color: T.textMuted, fontWeight: 600, letterSpacing: "0.04em" }}>
                {founder.exp.toUpperCase()}
              </span>
              {founder.linkedin && (
                <>
                  <span style={{ color: "#cbd5e1" }}>·</span>
                  <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="link-green" style={{ fontSize: 13 }}>
                    LinkedIn
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Roster — newspaper masthead */}
      <div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: mob ? 22 : 28, gap: 16 }}>
          <h3 style={{
            fontFamily: T.fontH, fontWeight: 800, fontSize: mob ? 20 : 24,
            color: T.textDark, letterSpacing: "-0.02em", margin: 0,
          }}>The reviewers</h3>
          <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {reviewers.length} analysts
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: 0,
          borderTop: "1px solid #e8ecf1",
        }}>
          {reviewers.map((a, i) => {
            const isOdd = i % 2 === 1;
            return (
              <Link key={a.id} to={lp(`/author/${a.id}`)} style={{
                display: "flex", gap: 16, alignItems: "center",
                padding: mob ? "18px 0" : "22px 0",
                borderBottom: "1px solid #e8ecf1",
                ...((!mob && !isOdd) ? { borderRight: "1px solid #e8ecf1", paddingRight: 24 } : {}),
                ...((!mob && isOdd) ? { paddingLeft: 24 } : {}),
                textDecoration: "none", color: T.textDark,
                transition: "background 0.15s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(5,150,105,0.03)";
                  const img = e.currentTarget.querySelector("[data-ava]");
                  if (img) img.style.filter = "grayscale(0%)";
                  const arr = e.currentTarget.querySelector("[data-ra]");
                  if (arr) { arr.style.color = T.accentGreen; arr.style.transform = "translateX(3px)"; }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  const img = e.currentTarget.querySelector("[data-ava]");
                  if (img) img.style.filter = "grayscale(40%) contrast(1.02)";
                  const arr = e.currentTarget.querySelector("[data-ra]");
                  if (arr) { arr.style.color = "#cbd5e1"; arr.style.transform = "none"; }
                }}
              >
                <div data-ava style={{
                  width: mob ? 52 : 64, height: mob ? 52 : 64,
                  overflow: "hidden", borderRadius: 4,
                  background: "#e8ecf1", flexShrink: 0,
                  filter: "grayscale(40%) contrast(1.02)",
                  transition: "filter 0.25s",
                }}>
                  {a.image ? (
                    <img src={`${import.meta.env.BASE_URL}${a.image.replace(/^\//, "")}`} alt={a.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <AuthorAvatar author={a} size={mob ? 52 : 64} showVerified={false} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: T.fontH, fontWeight: 800,
                    fontSize: mob ? 15 : 16.5, color: T.textDark,
                    letterSpacing: "-0.015em", lineHeight: 1.25,
                    display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap",
                  }}>
                    <span>{a.name}</span>
                    {a.credentials && a.credentials.length > 0 && (
                      <span style={{
                        fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700,
                        color: T.accentGreen, letterSpacing: "0.06em",
                      }}>
                        {a.credentials.join(" · ")}
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: mob ? 12.5 : 13, color: T.textMuted, marginTop: 4,
                    lineHeight: 1.45,
                  }}>
                    {a.role} · {a.exp}
                  </div>
                  {a.specialty && (
                    <div style={{
                      fontSize: mob ? 12 : 12.5, color: T.textBody, marginTop: 4,
                      lineHeight: 1.45,
                    }}>
                      <span style={{ color: T.textMuted }}>—</span> {a.specialty}
                      {a.reviews > 0 && (
                        <span style={{ color: T.textMuted, fontFamily: T.fontMono, fontSize: 11, marginLeft: 8, fontWeight: 600 }}>
                          · {a.reviews} reviews
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <span data-ra style={{ fontSize: 16, color: "#cbd5e1", transition: "color 0.2s, transform 0.2s", flexShrink: 0 }}>→</span>
              </Link>
            );
          })}
        </div>

        {/* Editorial footer */}
        <div style={{
          marginTop: mob ? 24 : 32,
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          fontSize: 13, color: T.textMuted,
        }}>
          <Link to={lp("/trust-score")} className="link-green">
            How we edit and verify <ArrowRight size={12} className="link-arrow" />
          </Link>
          <span style={{ color: "#cbd5e1" }}>·</span>
          <Link to={lp("/methodology")} className="link-green">
            Scoring methodology <ArrowRight size={12} className="link-arrow" />
          </Link>
          <span style={{ color: "#cbd5e1" }}>·</span>
          <Link to={lp("/how-we-make-money")} className="link-green">
            How we make money <ArrowRight size={12} className="link-arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ExpertTeamV5 — clean cards with circular grounded avatars
   Egor: "обычные карточки, просто сделаны красиво · кружочки · не висящие"
   Principles:
     - Standard card grid, each → /author/{id}
     - Circular 80px avatar, grounded with thin ring + soft floor shadow
     - Founder accent via subtle amber top-stripe (3px), not overlay
     - Centered content, clean typography hierarchy
     - Every element serves, nothing decorative
   ═══════════════════════════════════════════════════════════════ */
function ExpertCardV5({ a, mob, lp }) {
  const isFounder = a.isFounder;
  return (
    <Link to={lp(`/author/${a.id}`)} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 0, textDecoration: "none", color: T.textDark,
      background: T.bgCard, borderRadius: T.radiusCard,
      border: T.border, boxShadow: T.shadowCard,
      padding: mob ? "28px 16px 20px" : "32px 20px 24px",
      position: "relative", overflow: "hidden",
      transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      minHeight: mob ? 260 : 300,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = isFounder ? T.accentOrange : T.accentGreen;
        e.currentTarget.style.boxShadow = isFounder
          ? "0 6px 24px rgba(245,158,11,0.10)"
          : "0 6px 24px rgba(5,150,105,0.08)";
        e.currentTarget.style.transform = "translateY(-3px)";
        const v = e.currentTarget.querySelector("[data-view-link]");
        if (v) v.style.color = isFounder ? T.accentOrange : T.accentGreen;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#e8ecf1";
        e.currentTarget.style.boxShadow = T.shadowCard;
        e.currentTarget.style.transform = "none";
        const v = e.currentTarget.querySelector("[data-view-link]");
        if (v) v.style.color = T.textMuted;
      }}
    >
      {/* Subtle top-stripe accent — founder: amber, others: green hairline */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: isFounder ? 3 : 2,
        background: isFounder
          ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
          : "linear-gradient(90deg, transparent 30%, rgba(5,150,105,0.25) 50%, transparent 70%)",
      }} />

      {/* Founder label — small, above avatar */}
      {isFounder && (
        <div style={{
          fontFamily: T.fontMono, fontSize: 10, fontWeight: 800,
          color: T.accentOrange, letterSpacing: "0.22em", textTransform: "uppercase",
          marginBottom: 12,
        }}>Founder</div>
      )}

      {/* Circular avatar with grounding ring + floor shadow */}
      <div style={{
        width: mob ? 76 : 84, height: mob ? 76 : 84,
        borderRadius: "50%", overflow: "hidden", position: "relative",
        background: "linear-gradient(180deg, #f8f9fb, #e8ecf1)",
        flexShrink: 0,
        boxShadow: [
          "0 0 0 1px #fff",                         // inner white pad
          "0 0 0 2px #e8ecf1",                      // thin outer ring
          "0 8px 16px rgba(15,23,42,0.08)",         // soft floor shadow
          "0 2px 4px rgba(15,23,42,0.06)",
        ].join(", "),
        marginBottom: 16,
      }}>
        {a.image ? (
          <img src={`${import.meta.env.BASE_URL}${a.image.replace(/^\//, "")}`} alt={a.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={e => { e.target.style.display = "none"; }}
          />
        ) : (
          // Fallback to initials
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: T.fontH, fontWeight: 800, fontSize: 28, color: T.accentGreen,
          }}>{a.initials || a.name?.slice(0, 1)}</div>
        )}
      </div>

      {/* Name */}
      <div style={{
        fontFamily: T.fontH, fontWeight: 800, fontSize: mob ? 15 : 16.5,
        color: T.textDark, letterSpacing: "-0.015em", textAlign: "center",
        lineHeight: 1.25, marginBottom: 4,
      }}>{a.name}</div>

      {/* Credentials inline (if any) */}
      {a.credentials && a.credentials.length > 0 && (
        <div style={{
          fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700,
          color: T.accentGreen, letterSpacing: "0.1em", textAlign: "center",
          marginBottom: 8,
        }}>{a.credentials.join(" · ")}</div>
      )}

      {/* Role + experience */}
      <div style={{
        fontSize: mob ? 12 : 12.5, color: T.textMuted, fontWeight: 500,
        textAlign: "center", lineHeight: 1.4, marginBottom: 2,
      }}>{a.role}</div>
      {a.exp && (
        <div style={{
          fontFamily: T.fontMono, fontSize: 10.5, color: "#94a3b8", fontWeight: 600,
          textAlign: "center", letterSpacing: "0.04em",
        }}>{a.exp.toUpperCase()}</div>
      )}

      {/* Hairline divider + specialty */}
      {a.specialty && (
        <>
          <div style={{
            width: 32, height: 1, background: "#e8ecf1",
            margin: mob ? "14px 0 12px" : "16px 0 14px",
          }} />
          <div style={{
            fontSize: mob ? 11.5 : 12, color: T.textBody, fontWeight: 500,
            textAlign: "center", lineHeight: 1.5, maxWidth: 180,
          }}>{a.specialty}</div>
        </>
      )}

      {/* View profile */}
      <div data-view-link style={{
        marginTop: "auto", paddingTop: mob ? 16 : 20,
        fontFamily: T.fontH, fontSize: 12, fontWeight: 700,
        color: T.textMuted, letterSpacing: "-0.01em",
        display: "inline-flex", alignItems: "center", gap: 4,
        transition: "color 0.2s",
      }}>
        View full profile <ArrowRight size={12} />
      </div>
    </Link>
  );
}

function ExpertTeamV5({ mob, tab, lp }) {
  const all = Object.values(AUTHORS);
  const founders = all.filter(a => a.isFounder);
  const reviewers = all.filter(a => !a.isFounder);
  const ordered = [...founders, ...reviewers];

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "44px 16px" : "64px 24px" }}>
      {/* Clean editorial header */}
      <div style={{ maxWidth: 680, marginBottom: mob ? 28 : 40 }}>
        <Eyebrow>Editorial Team</Eyebrow>
        <H2Light mob={mob}>Meet the team behind every review</H2Light>
        <SectionLead mob={mob}>
          Seven analysts and editors. Every broker review carries a byline and goes through
          a three-step editorial process — written, peer-reviewed, fact-checked against
          regulator databases. Click any name to see their full profile, credentials, and published reviews.
        </SectionLead>
      </div>

      {/* Cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
        gap: mob ? 10 : 14,
      }}>
        {ordered.map(a => <ExpertCardV5 key={a.id} a={a} mob={mob} lp={lp} />)}
      </div>

      {/* Footer links */}
      <div style={{
        marginTop: mob ? 24 : 32,
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        fontSize: 13,
      }}>
        <Link to={lp("/trust-score")} className="link-green">
          Editorial standards <ArrowRight size={12} className="link-arrow" />
        </Link>
        <span style={{ color: "#cbd5e1" }}>·</span>
        <Link to={lp("/methodology")} className="link-green">
          Scoring methodology <ArrowRight size={12} className="link-arrow" />
        </Link>
        <span style={{ color: "#cbd5e1" }}>·</span>
        <Link to={lp("/how-we-make-money")} className="link-green">
          How we make money <ArrowRight size={12} className="link-arrow" />
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ExpertCardV7 — stable (no-jump) + green top plate, no founder accent
   Egor: шаблонность ушла, плашки зелёные, фаундер как все остальные
   ═══════════════════════════════════════════════════════════════ */
function specialtyPlateV7(a) {
  const firstTerm = String(a.specialty || a.role || "Research").split(",")[0].trim();
  // Compact label — max ~18 chars
  if (firstTerm.length > 22) return firstTerm.slice(0, 20).toUpperCase().trim() + "…";
  return firstTerm.toUpperCase();
}

function ExpertCardV7({ a, mob, lp }) {
  return (
    <Link to={lp(`/author/${a.id}`)} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      textDecoration: "none", color: T.textDark,
      background: T.bgCard, borderRadius: T.radiusCard,
      border: T.border, boxShadow: T.shadowCard,
      position: "relative", overflow: "hidden",
      transition: "border-color 0.25s, box-shadow 0.25s",
      minHeight: mob ? 280 : 320,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = T.accentGreen;
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(5,150,105,0.10)";
        const p = e.currentTarget.querySelector("[data-plate]");
        if (p) { p.style.background = "rgba(5,150,105,0.1)"; p.style.borderBottomColor = T.accentGreen; }
        const v = e.currentTarget.querySelector("[data-view-link]");
        if (v) v.style.color = T.accentGreen;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#e8ecf1";
        e.currentTarget.style.boxShadow = T.shadowCard;
        const p = e.currentTarget.querySelector("[data-plate]");
        if (p) { p.style.background = "rgba(5,150,105,0.055)"; p.style.borderBottomColor = "#d1fae5"; }
        const v = e.currentTarget.querySelector("[data-view-link]");
        if (v) v.style.color = T.textMuted;
      }}
    >
      {/* Green glass top plate — specialty category */}
      <div data-plate style={{
        width: "100%",
        background: "rgba(5,150,105,0.055)",
        borderBottom: "1px solid #d1fae5",
        padding: "7px 14px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        transition: "background 0.25s, border-color 0.25s",
      }}>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: T.accentGreen, flexShrink: 0 }} />
        <span style={{
          fontFamily: T.fontMono, fontSize: 10, fontWeight: 800,
          color: T.accentGreen, letterSpacing: "0.18em", textTransform: "uppercase",
          lineHeight: 1.2, textAlign: "center",
        }}>{specialtyPlateV7(a)}</span>
      </div>

      {/* Card body */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: mob ? "24px 16px 20px" : "28px 20px 24px",
        flex: 1, width: "100%",
      }}>
        {/* Circular avatar — grounded with ring + floor shadow */}
        <div style={{
          width: mob ? 76 : 84, height: mob ? 76 : 84,
          borderRadius: "50%", overflow: "hidden", position: "relative",
          background: "linear-gradient(180deg, #f8f9fb, #e8ecf1)",
          flexShrink: 0,
          boxShadow: [
            "0 0 0 1px #fff",
            "0 0 0 2px #e8ecf1",
            "0 8px 16px rgba(15,23,42,0.08)",
            "0 2px 4px rgba(15,23,42,0.06)",
          ].join(", "),
          marginBottom: 16,
        }}>
          {a.image ? (
            <img src={`${import.meta.env.BASE_URL}${a.image.replace(/^\//, "")}`} alt={a.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => { e.target.style.display = "none"; }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: T.fontH, fontWeight: 800, fontSize: 28, color: T.accentGreen,
            }}>{a.initials || a.name?.slice(0, 1)}</div>
          )}
        </div>

        {/* Name */}
        <div style={{
          fontFamily: T.fontH, fontWeight: 800, fontSize: mob ? 15 : 16.5,
          color: T.textDark, letterSpacing: "-0.015em", textAlign: "center",
          lineHeight: 1.25, marginBottom: 4,
        }}>{a.name}</div>

        {/* Credentials inline (if any) */}
        {a.credentials && a.credentials.length > 0 && (
          <div style={{
            fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700,
            color: T.accentGreen, letterSpacing: "0.1em", textAlign: "center",
            marginBottom: 8,
          }}>{a.credentials.join(" · ")}</div>
        )}

        {/* Role + experience */}
        <div style={{
          fontSize: mob ? 12 : 12.5, color: T.textMuted, fontWeight: 500,
          textAlign: "center", lineHeight: 1.4, marginBottom: 2,
        }}>{a.role}</div>
        {a.exp && (
          <div style={{
            fontFamily: T.fontMono, fontSize: 10.5, color: "#94a3b8", fontWeight: 600,
            textAlign: "center", letterSpacing: "0.04em",
          }}>{a.exp.toUpperCase()}</div>
        )}

        {/* Hairline divider */}
        <div style={{
          width: 32, height: 1, background: "#e8ecf1",
          margin: mob ? "14px 0 12px" : "16px 0 14px",
        }} />

        {/* Full specialty text */}
        {a.specialty && (
          <div style={{
            fontSize: mob ? 11.5 : 12, color: T.textBody, fontWeight: 500,
            textAlign: "center", lineHeight: 1.5, maxWidth: 200,
          }}>{a.specialty}</div>
        )}

        {/* View profile */}
        <div data-view-link style={{
          marginTop: "auto", paddingTop: mob ? 16 : 20,
          fontFamily: T.fontH, fontSize: 12, fontWeight: 700,
          color: T.textMuted, letterSpacing: "-0.01em",
          display: "inline-flex", alignItems: "center", gap: 4,
          transition: "color 0.2s",
        }}>
          View full profile <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}

function ExpertTeamV7({ mob, tab, lp }) {
  const all = Object.values(AUTHORS);
  // Keep display order: founder first for hierarchy, but no visual highlight
  const founders = all.filter(a => a.isFounder);
  const reviewers = all.filter(a => !a.isFounder);
  const ordered = [...founders, ...reviewers];

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "44px 16px" : "64px 24px" }}>
      <div style={{ maxWidth: 680, marginBottom: mob ? 28 : 40 }}>
        <Eyebrow>Editorial Team</Eyebrow>
        <H2Light mob={mob}>Meet the team behind every review</H2Light>
        <SectionLead mob={mob}>
          Seven analysts and editors. Every broker review carries a byline and goes through
          a three-step editorial process — written, peer-reviewed, fact-checked against
          regulator databases. Click any name to see their full profile, credentials, and published reviews.
        </SectionLead>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
        gap: mob ? 10 : 14,
      }}>
        {ordered.map(a => <ExpertCardV7 key={a.id} a={a} mob={mob} lp={lp} />)}
      </div>

      <div style={{
        marginTop: mob ? 24 : 32,
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        fontSize: 13,
      }}>
        <Link to={lp("/trust-score")} className="link-green">
          Editorial standards <ArrowRight size={12} className="link-arrow" />
        </Link>
        <span style={{ color: "#cbd5e1" }}>·</span>
        <Link to={lp("/methodology")} className="link-green">
          Scoring methodology <ArrowRight size={12} className="link-arrow" />
        </Link>
        <span style={{ color: "#cbd5e1" }}>·</span>
        <Link to={lp("/how-we-make-money")} className="link-green">
          How we make money <ArrowRight size={12} className="link-arrow" />
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ExpertCardV8 — stable card with 3px green top strip (Plate B).
   Egor (16.04.2026): final = Plate B + hover border OFF.
   ═══════════════════════════════════════════════════════════════ */
function ExpertCardV8({ a, mob, lp }) {
  return (
    <Link to={lp(`/author/${a.id}`)} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      textDecoration: "none", color: T.textDark,
      background: T.bgCard, borderRadius: T.radiusCard,
      border: T.border, boxShadow: T.shadowCard,
      position: "relative", overflow: "hidden",
      transition: "border-color 0.25s, box-shadow 0.25s",
      minHeight: mob ? 280 : 320,
    }}
      onMouseEnter={e => {
        const v = e.currentTarget.querySelector("[data-view-link]");
        if (v) v.style.color = T.accentGreen;
      }}
      onMouseLeave={e => {
        const v = e.currentTarget.querySelector("[data-view-link]");
        if (v) v.style.color = T.textMuted;
      }}
    >
      {/* Plate B — solid 3px green top strip */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 3, pointerEvents: "none",
        background: "linear-gradient(90deg, #047857 0%, #10b981 50%, #047857 100%)",
      }} />

      {/* Card body — identical across all plate styles */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: mob ? "32px 16px 20px" : "36px 20px 24px",
        flex: 1, width: "100%", position: "relative",
      }}>
        {/* Circular avatar grounded with ring + floor shadow */}
        <div style={{
          width: mob ? 76 : 84, height: mob ? 76 : 84,
          borderRadius: "50%", overflow: "hidden", position: "relative",
          background: "linear-gradient(180deg, #f8f9fb, #e8ecf1)",
          flexShrink: 0,
          boxShadow: [
            "0 0 0 1px #fff",
            "0 0 0 2px #e8ecf1",
            "0 8px 16px rgba(15,23,42,0.08)",
            "0 2px 4px rgba(15,23,42,0.06)",
          ].join(", "),
          marginBottom: 16,
        }}>
          {a.image ? (
            <img src={`${import.meta.env.BASE_URL}${a.image.replace(/^\//, "")}`} alt={a.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => { e.target.style.display = "none"; }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: T.fontH, fontWeight: 800, fontSize: 28, color: T.accentGreen,
            }}>{a.initials || a.name?.slice(0, 1)}</div>
          )}
        </div>

        <div style={{
          fontFamily: T.fontH, fontWeight: 800, fontSize: mob ? 15 : 16.5,
          color: T.textDark, letterSpacing: "-0.015em", textAlign: "center",
          lineHeight: 1.25, marginBottom: 4,
        }}>{a.name}</div>

        {a.credentials && a.credentials.length > 0 && (
          <div style={{
            fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700,
            color: T.accentGreen, letterSpacing: "0.1em", textAlign: "center",
            marginBottom: 8,
          }}>{a.credentials.join(" · ")}</div>
        )}

        <div style={{
          fontSize: mob ? 12 : 12.5, color: T.textMuted, fontWeight: 500,
          textAlign: "center", lineHeight: 1.4, marginBottom: 2,
        }}>{a.role}</div>
        {a.exp && (
          <div style={{
            fontFamily: T.fontMono, fontSize: 10.5, color: "#94a3b8", fontWeight: 600,
            textAlign: "center", letterSpacing: "0.04em",
          }}>{a.exp.toUpperCase()}</div>
        )}

        <div style={{
          width: 32, height: 1, background: "#e8ecf1",
          margin: mob ? "14px 0 12px" : "16px 0 14px",
        }} />

        {a.specialty && (
          <div style={{
            fontSize: mob ? 11.5 : 12, color: T.textBody, fontWeight: 500,
            textAlign: "center", lineHeight: 1.5, maxWidth: 200,
          }}>{a.specialty}</div>
        )}

        <div data-view-link style={{
          marginTop: "auto", paddingTop: mob ? 16 : 20,
          fontFamily: T.fontH, fontSize: 12, fontWeight: 700,
          color: T.textMuted, letterSpacing: "-0.01em",
          display: "inline-flex", alignItems: "center", gap: 4,
          transition: "color 0.2s",
        }}>
          View full profile <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}

function ExpertTeamV8({ mob, tab, lp }) {
  const all = Object.values(AUTHORS);
  const founders = all.filter(a => a.isFounder);
  const reviewers = all.filter(a => !a.isFounder);
  const ordered = [...founders, ...reviewers];

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "44px 16px" : "64px 24px" }}>
      <div style={{ maxWidth: 680, marginBottom: mob ? 20 : 28 }}>
        <Eyebrow>Editorial Team</Eyebrow>
        <H2Light mob={mob}>Meet the team behind every review</H2Light>
        <SectionLead mob={mob}>
          Seven analysts and editors. Every broker review carries a byline and goes through
          a three-step editorial process — written, peer-reviewed, fact-checked against
          regulator databases. Click any name to see their full profile, credentials, and published reviews.
        </SectionLead>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
        gap: mob ? 10 : 14,
      }}>
        {ordered.map(a => <ExpertCardV8 key={a.id} a={a} mob={mob} lp={lp} />)}
      </div>

      <div style={{
        marginTop: mob ? 24 : 32,
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        fontSize: 13,
      }}>
        <Link to={lp("/trust-score")} className="link-green">
          Editorial standards <ArrowRight size={12} className="link-arrow" />
        </Link>
        <span style={{ color: "#cbd5e1" }}>·</span>
        <Link to={lp("/methodology")} className="link-green">
          Scoring methodology <ArrowRight size={12} className="link-arrow" />
        </Link>
        <span style={{ color: "#cbd5e1" }}>·</span>
        <Link to={lp("/how-we-make-money")} className="link-green">
          How we make money <ArrowRight size={12} className="link-arrow" />
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FeaturedBrokerV6 — Top #1 showcase card (hybrid: dark logo strip + light body)
   Mirror of Review hero, shrunk to homepage scale.
   Contains: #1 rank, wordmark, score, stars, type, 3 pros, regs, 2 CTAs
   ═══════════════════════════════════════════════════════════════ */
function FeaturedBrokerV6({ broker, mob, tab, lp }) {
  const b = broker.B;
  const visitUrl = getVisitUrl(broker.slug, b.url);
  const reviewPath = lp(`/reviews/${broker.slug}`);
  const pros = (broker.PROS || []).slice(0, 3);
  const tier1Regs = (b.regs || []).filter(r => r.tier <= 2).slice(0, 4);

  return (
    <div style={{
      display: mob ? "block" : "grid",
      gridTemplateColumns: mob ? "1fr" : tab ? "280px 1fr" : "320px 1fr",
      background: T.bgCard, borderRadius: T.radiusCard,
      border: T.border, boxShadow: T.shadowCard,
      overflow: "hidden", marginBottom: mob ? 14 : 18,
      transition: "box-shadow 0.25s, transform 0.25s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(15,23,42,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = T.shadowCard; e.currentTarget.style.transform = "none"; }}
    >
      {/* Left: dark logo panel with rank + wordmark + score */}
      <Link to={reviewPath} style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: mob ? 12 : 16, padding: mob ? "24px 20px 20px" : "28px 24px",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 55%, #064e3b 100%)",
        color: "#fff", textDecoration: "none", position: "relative", minHeight: mob ? 180 : "auto",
        borderBottom: mob ? `2px solid ${T.accentOrange}` : "none",
        borderRight: mob ? "none" : `2px solid ${T.accentOrange}`,
      }}>
        {/* #1 rank ribbon */}
        <div style={{
          position: "absolute", top: 14, left: 14,
          padding: "4px 10px", borderRadius: 6,
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
          color: T.textDark,
          fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em",
        }}>#1 · Q1 2026</div>

        {/* Quarterly/editors label */}
        <div style={{
          position: "absolute", top: 14, right: 14,
          fontFamily: T.fontMono, fontSize: 9.5, fontWeight: 700,
          color: "rgba(255,255,255,0.5)", letterSpacing: "0.18em", textTransform: "uppercase",
        }}>Top Pick</div>

        {/* Wordmark logo */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          height: mob ? 48 : 56, marginTop: 8,
        }}>
          <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${broker.slug}.svg`}
            alt={b.name}
            style={{ maxWidth: "80%", maxHeight: "100%", objectFit: "contain" }}
            onError={e => {
              e.target.outerHTML = `<span style="font-family:${T.fontH}; font-weight:800; font-size:${mob ? 22 : 26}px; color:#fff; letter-spacing:-0.02em">${b.name}</span>`;
            }}
          />
        </div>

        {/* Score + stars */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex", alignItems: "baseline", gap: 2,
            padding: "6px 12px", borderRadius: 8,
            background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.35)",
          }}>
            <span style={{ fontFamily: T.fontMono, fontSize: mob ? 22 : 26, fontWeight: 800, color: T.darkGreen, letterSpacing: "-0.02em" }}>{b.score}</span>
            <span style={{ fontFamily: T.fontMono, fontSize: 11, color: "rgba(52,211,153,0.7)", fontWeight: 600 }}>/ 10</span>
          </div>
          {b.tp && (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={12} fill={i <= Math.round(b.tp) ? "#fbbf24" : "transparent"} color={i <= Math.round(b.tp) ? "#fbbf24" : "rgba(255,255,255,0.2)"} strokeWidth={1.5} />
                ))}
              </div>
              <div style={{ fontFamily: T.fontMono, fontSize: 10, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
                {b.tp} · {b.tpCount?.toLocaleString()} reviews
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Right: info + CTAs */}
      <div style={{
        padding: mob ? "22px 20px 24px" : "28px 32px",
        display: "flex", flexDirection: "column", gap: mob ? 14 : 16,
      }}>
        {/* Name + type */}
        <div>
          <Link to={reviewPath} style={{ textDecoration: "none" }}>
            <div style={{
              fontFamily: T.fontH, fontWeight: 800, fontSize: mob ? 22 : 26,
              color: T.textDark, letterSpacing: "-0.025em", lineHeight: 1.15,
            }}>{b.name}</div>
          </Link>
          <div style={{
            fontSize: mob ? 12.5 : 13, color: T.textMuted, fontWeight: 500,
            marginTop: 4, letterSpacing: "-0.005em",
          }}>
            {b.type} · Est. {b.year} · Min dep ${b.minDep}
          </div>
        </div>

        {/* Pros as checkmark list */}
        {pros.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {pros.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Check size={15} color={T.accentGreen} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: mob ? 13 : 13.5, color: T.textBody, lineHeight: 1.5 }}>
                  {p.length > 100 ? p.slice(0, 98) + "…" : p}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Regulator badges */}
        {tier1Regs.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <span style={{
              fontFamily: T.fontMono, fontSize: 10, color: T.textMuted, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", marginRight: 4,
            }}>Regulated by</span>
            {tier1Regs.map(r => (
              <span key={r.name} style={{
                padding: "3px 8px", borderRadius: 5,
                background: r.tier === 1 ? "rgba(5,150,105,0.08)" : "#f1f5f9",
                border: r.tier === 1 ? "1px solid #a7f3d0" : "1px solid #e2e8f0",
                color: r.tier === 1 ? T.accentGreen : T.textBody,
                fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.04em",
              }}>{r.name}</span>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div style={{
          display: "flex", gap: 10, flexDirection: mob ? "column" : "row",
          marginTop: mob ? 2 : 4, alignItems: mob ? "stretch" : "center",
        }}>
          <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: mob ? "11px 20px" : "12px 22px", borderRadius: T.radiusBtn,
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            color: T.textDark, textDecoration: "none",
            fontFamily: T.fontH, fontWeight: 700, fontSize: mob ? 13.5 : 14, whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
          }}>
            Visit {b.name} <ArrowUpRight size={14} />
          </a>
          <Link to={reviewPath} style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: mob ? "11px 18px" : "12px 20px", borderRadius: T.radiusBtn,
            background: "transparent",
            border: "1px solid #e2e8f0", color: T.textDark, textDecoration: "none",
            fontFamily: T.fontH, fontWeight: 600, fontSize: mob ? 13 : 13.5, whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accentGreen; e.currentTarget.style.color = T.accentGreen; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = T.textDark; }}
          >
            Read full review <ArrowRight size={13} />
          </Link>
          {!mob && b.riskWarning && (
            <span style={{ fontSize: 10.5, color: "#94a3b8", fontStyle: "italic", marginLeft: "auto", maxWidth: 220, lineHeight: 1.4 }}>
              {b.riskWarning.slice(0, 80)}{b.riskWarning.length > 80 ? "…" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FAQ accordion
   ═══════════════════════════════════════════════════════════════ */
function FaqItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div style={{ borderBottom: "1px solid #e8ecf1" }}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", padding: "18px 0", border: "none", background: "none",
        cursor: "pointer", textAlign: "left", gap: 12,
      }}>
        <span style={{ fontFamily: T.fontH, fontWeight: 700, fontSize: 16, color: T.textDark, flex: 1 }}>
          {question}
        </span>
        {open ? <ChevronUp size={18} color={T.textMuted} /> : <ChevronDown size={18} color={T.textMuted} />}
      </button>
      {open && (
        <p id={id} style={{ fontSize: 15, lineHeight: 1.75, color: T.textBody, margin: "0 0 18px 0" }}>
          {answer}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════ */
export default function HomeUnifiedProto() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const wrap = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const [variant, setVariant] = useState("v8"); // v8 = team cards with decorative green plates A/B/C/D (no text)
  const [showBar, setShowBar] = useState(true);

  const allBrokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);

  useEffect(() => {
    document.title = `[PROTO ${variant.toUpperCase()}] Home Unified — ${HOMEPAGE_SEO.metaTitle}`;
  }, [variant]);

  // Push the site header down by 36px while dev bar is shown, so bar sits above logo
  useEffect(() => {
    const id = "proto-home-unified-devbar-css";
    let el = document.getElementById(id);
    if (showBar) {
      if (!el) {
        el = document.createElement("style");
        el.id = id;
        document.head.appendChild(el);
      }
      el.textContent = `header[style*="position: fixed"] { top: 36px !important; }`;
      document.body.style.paddingTop = "36px";
    } else {
      if (el) el.remove();
      document.body.style.paddingTop = "";
    }
    return () => {
      const cleanup = document.getElementById(id);
      if (cleanup) cleanup.remove();
      document.body.style.paddingTop = "";
    };
  }, [showBar]);

  const v2 = ["v2", "v3", "v4", "v5", "v6", "v7", "v8"].includes(variant);
  const v3 = ["v3", "v4", "v5", "v6", "v7", "v8"].includes(variant);
  const v4 = variant === "v4";
  const v5 = variant === "v5";
  const v6 = ["v6", "v7", "v8"].includes(variant);
  const v7 = variant === "v7";
  const v8 = variant === "v8";

  return (
    <div style={{ fontFamily: T.fontBody, background: T.bgPage, minHeight: "100vh", color: T.textBody }}>

      {/* Dev-only toolbar — fixed above site header, hideable. Does NOT ship to prod. */}
      {showBar ? (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 2000,
          background: "#0a1220", color: "rgba(255,255,255,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: mob ? "6px 10px" : "6px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          fontSize: 11, fontFamily: T.fontMono, letterSpacing: "0.04em",
          minHeight: 36, height: 36,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 14, flex: 1, minWidth: 0 }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600, flexShrink: 0 }}>DEV</span>
            <div style={{
              display: "inline-flex", gap: 2, padding: 2, borderRadius: 6,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
            }}>
              {["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8"].map(v => (
                <button key={v} onClick={() => setVariant(v)} style={{
                  padding: "3px 12px", borderRadius: 4, border: "none",
                  background: variant === v ? T.accentOrange : "transparent",
                  color: variant === v ? T.textDark : "rgba(255,255,255,0.55)",
                  fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em",
                  cursor: "pointer", transition: "all 0.15s",
                }}>{v.toUpperCase()}</button>
              ))}
            </div>
            {!mob && <span style={{ color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {v8 ? "Team cards: 4 decorative green plate styles (no text)"
                : variant === "v7" ? "Team cards: stable, green text plates"
                : variant === "v6" ? "Featured #1 showcase + Top 5"
                : variant === "v5" ? "Clean team cards · circular grounded avatars"
                : v4 ? "Editorial team rework — newsroom style"
                : variant === "v3" ? "Deeper concept · top-broker category cards"
                : variant === "v2" ? "Improved · category cards · stable rows · featured founder"
                : "Barbara unification pass"}
            </span>}
          </div>
          <button onClick={() => setShowBar(false)} style={{
            padding: "3px 10px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.12)",
            background: "transparent", color: "rgba(255,255,255,0.65)",
            fontFamily: T.fontMono, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
          >HIDE</button>
        </div>
      ) : (
        // Tiny peek tab when hidden — brings toolbar back
        <button onClick={() => setShowBar(true)} style={{
          position: "fixed", top: 68, right: 16, zIndex: 50,
          padding: "5px 10px", borderRadius: 6,
          background: "rgba(10,18,32,0.85)", backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.8)",
          fontFamily: T.fontMono, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
          cursor: "pointer",
        }} aria-label="Show dev toolbar">
          DEV · {variant.toUpperCase()}
        </button>
      )}

      {/* ═══════════════════════════════════════════════════════
          1. HERO — HeroBand wrapper (dark anchor #1)
          Barbara R4: 2 CTAs, not 4
          Barbara R13: use HeroBand component
          ═══════════════════════════════════════════════════════ */}
      <HeroBand mob={mob} tab={tab}>
        <div style={{
          display: mob ? "block" : "flex",
          alignItems: "center", gap: 40,
        }}>
          <div style={{ flex: 1, marginBottom: mob ? 20 : 0 }}>
            <div style={{
              fontFamily: T.fontMono, fontSize: 11, fontWeight: 700,
              color: T.accentOrange, letterSpacing: "0.18em", textTransform: "uppercase",
              marginBottom: 14,
            }}>Independent · Updated Q1 2026</div>
            <h1 style={{
              fontFamily: T.fontH, fontWeight: 800,
              fontSize: mob ? 28 : tab ? 36 : 44, lineHeight: 1.08, color: "#fff",
              marginBottom: 14, letterSpacing: "-0.035em",
            }}>
              {HOMEPAGE_SEO.h1}
            </h1>
            <p style={{
              fontSize: mob ? 15 : 17, color: "rgba(255,255,255,0.78)",
              maxWidth: 560, lineHeight: 1.55, marginBottom: 22,
            }}>
              {allBrokers.length} brokers scored across 130+ data points. Six weighted categories.
              No paid placements. No compensation-driven rankings.
            </p>
            <div style={{ display: "flex", gap: mob ? 8 : 12, flexDirection: mob ? "column" : "row" }}>
              <Link to={lp("/find-your-broker")} className="cta-orange" style={{
                padding: "12px 22px", borderRadius: T.radiusBtn, fontSize: 14, fontWeight: 700,
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: T.textDark,
                textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: 8, whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
                fontFamily: T.fontH,
              }}>
                <Target size={15} /> Find Your Broker
              </Link>
              <a href="#how-we-rate" style={{
                padding: "12px 22px", borderRadius: T.radiusBtn, fontSize: 14, fontWeight: 600,
                background: T.darkSoft, backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0",
                textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: 8, whiteSpace: "nowrap", transition: "all 0.2s",
                fontFamily: T.fontH,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.darkSoft; e.currentTarget.style.color = "#e2e8f0"; }}
              >
                <BookOpen size={15} /> See How We Rate
              </a>
            </div>
          </div>

          {/* Right: Stats card — glass, BrokerReview Quick Facts style */}
          {!mob && (
            <div style={{
              flexShrink: 0, width: tab ? 280 : 320,
              background: T.darkSoft, backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14, padding: 22,
            }}>
              <div style={{
                fontFamily: T.fontMono, fontSize: 10, fontWeight: 700,
                color: T.darkGreen, letterSpacing: "0.18em", textTransform: "uppercase",
                marginBottom: 14,
              }}>At a Glance</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { n: allBrokers.length, l: "Brokers" },
                  { n: HUBS.length, l: "Categories" },
                  { n: `${RANKINGS.length}+`, l: "Rankings" },
                  { n: "130+", l: "Data Points" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: T.fontMono, fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{s.n}</div>
                    <div style={{ fontSize: 10, color: T.darkMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "18px 0 14px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.darkMuted }}>
                {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: T.accentOrange, fontSize: 13 }}>{s}</span>)}
                <span style={{ marginLeft: 4 }}>Trusted by traders worldwide</span>
              </div>
            </div>
          )}
        </div>
      </HeroBand>

      {/* ═══════════════════════════════════════════════════════
          2. CATEGORY NAV — V1 dark buttons / V2 light cards / V3 top-broker preview
          ═══════════════════════════════════════════════════════ */}
      {v3
        ? <CategoryCardsV3 mob={mob} tab={tab} allBrokers={allBrokers} />
        : v2
        ? <CategoryCardsV2 mob={mob} tab={tab} />
        : <CategoryNav mob={mob} />}

      {/* ═══════════════════════════════════════════════════════
          3. SEO INTRO — clean text, sits between dark and light
          ═══════════════════════════════════════════════════════ */}
      <section style={{ ...wrap, padding: mob ? "32px 16px 0" : "44px 24px 0" }}>
        <p style={{ fontSize: mob ? 15 : 16, lineHeight: 1.75, color: T.textBody, maxWidth: 860 }}>
          {HOMEPAGE_SEO.intro.text}{" "}
          <Link to={lp(HOMEPAGE_SEO.intro.links[0].path)} className="link-inline">{HOMEPAGE_SEO.intro.links[0].text}</Link>
          {" "}explains our scoring formula. Learn{" "}
          <Link to={lp(HOMEPAGE_SEO.intro.links[1].path)} className="link-inline">{HOMEPAGE_SEO.intro.links[1].text}</Link>.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. TOP RATED BROKERS — V1 rows / V2-5 enhanced rows / V6 Featured #1 + 5 rows
          ═══════════════════════════════════════════════════════ */}
      <section style={{ ...wrap, padding: mob ? "32px 16px" : "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 20 }}>
          <H2Light mob={mob}>{v6 ? "This Quarter's Top Broker" : "Top Rated Brokers"}</H2Light>
          <Link to={lp("/reviews")} className="link-green" style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            All {allBrokers.length} reviews <ArrowRight size={12} className="link-arrow" />
          </Link>
        </div>
        <SectionLead mob={mob}>
          {v6
            ? "Our #1-ranked broker for Q1 2026 — plus the five closest challengers. Tap any name for the full review, or visit the broker directly."
            : "Our highest-scoring brokers this quarter, across all categories. Click a name for the full review, or the arrow to visit."}
        </SectionLead>

        {v6 && allBrokers[0] && (
          <div style={{ marginTop: mob ? 20 : 24 }}>
            <FeaturedBrokerV6 broker={allBrokers[0]} mob={mob} tab={tab} lp={lp} />
          </div>
        )}

        {v6 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            marginTop: mob ? 20 : 28, marginBottom: 14,
          }}>
            <div style={{
              fontFamily: T.fontMono, fontSize: 11, fontWeight: 700,
              color: T.textMuted, letterSpacing: "0.14em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ width: 24, height: 1, background: "#cbd5e1" }} />
              The Top 5 Challengers
            </div>
          </div>
        )}

        <div style={{
          marginTop: v6 ? 0 : (mob ? 20 : 24),
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr" : "1fr 1fr",
          gap: mob ? 10 : 12,
        }}>
          {(v6
            ? allBrokers.slice(1, mob ? 6 : 6)  // positions 2-6
            : allBrokers.slice(0, mob ? 5 : 6)
          ).map((broker, i) => (
            v2
              ? <BrokerRowV2 key={broker.slug} rank={v6 ? i + 2 : i + 1} broker={broker} mob={mob} lp={lp} mode="visit" showRisk editorPick={!v6 && i === 0} />
              : <BrokerRow key={broker.slug} rank={i + 1} broker={broker} mob={mob} lp={lp} mode="visit" />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. HOW WE RATE — dark anchor #2 (Premium Dark Orange Tiles)
          Kept as-is — this is an approved anchor
          ═══════════════════════════════════════════════════════ */}
      <section id="how-we-rate" style={{
        position: "relative",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
        color: "#fff",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)",
          borderTop: "3px solid #f59e0b",
        }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: mob ? "48px 16px" : "72px 24px" }}>
          <div style={{ marginBottom: mob ? 28 : 40, maxWidth: 760 }}>
            <Eyebrow dark>Our Methodology</Eyebrow>
            <H2Dark mob={mob}>{HOMEPAGE_SEO.howWeRate.heading}</H2Dark>
            <p style={{
              fontSize: mob ? 14 : 16, lineHeight: 1.65,
              color: T.darkMuted, margin: "14px 0 0",
            }}>{HOMEPAGE_SEO.howWeRate.intro}</p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: mob ? 12 : 16, marginBottom: mob ? 28 : 40,
          }}>
            {HOMEPAGE_SEO.howWeRate.categories.map((cat, i) => {
              const weightNum = parseInt(cat.weight);
              const IconCmp = HOW_WE_RATE_ICONS[cat.name] || Shield;
              return (
                <div key={i}
                  style={{
                    padding: mob ? "20px" : "22px",
                    borderRadius: T.radiusCard,
                    background: "rgba(255,255,255,0.04)",
                    border: T.darkBorder,
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = T.accentOrange;
                    e.currentTarget.style.background = "rgba(245,158,11,0.06)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: T.radiusBtn,
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.28)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <IconCmp size={20} color={T.accentOrange} strokeWidth={1.75} />
                    </div>
                    <span style={{
                      padding: "4px 10px", borderRadius: 6,
                      background: "rgba(245,158,11,0.14)", color: "#fbbf24",
                      fontFamily: T.fontMono, fontSize: 13, fontWeight: 800,
                    }}>{cat.weight}</span>
                  </div>
                  <div style={{ fontFamily: T.fontH, fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 8, letterSpacing: "-0.01em" }}>
                    {cat.name}
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ width: `${(weightNum / 30) * 100}%`, height: "100%", background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.68)", margin: 0 }}>{cat.desc}</p>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: mob ? 20 : 32, alignItems: mob ? "stretch" : "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.65, color: T.darkMuted, margin: 0, maxWidth: 620 }}>
              {HOMEPAGE_SEO.howWeRate.closing}
            </p>
            <Link to={lp("/methodology")} className="cta-orange" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "13px 22px", borderRadius: T.radiusBtn,
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
              color: T.textDark, textDecoration: "none",
              fontFamily: T.fontH, fontWeight: 700, fontSize: 14,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
            }}>
              Read full methodology <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. COUNTRY — green uniform kept, orange ribbon removed (Barbara R6)
          Radius normalized to 12 (Barbara R2)
          ═══════════════════════════════════════════════════════ */}
      <section style={{ ...wrap, padding: mob ? "40px 16px" : "56px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 20 }}>
          <H2Light mob={mob}>Regulated Brokers by Country</H2Light>
          <Link to={lp("/best-forex-brokers-by-country")} className="link-green" style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            All 45 Countries <ArrowRight size={12} className="link-arrow" />
          </Link>
        </div>
        <SectionLead mob={mob}>
          Find brokers licensed by your country's regulator. Each link opens the ranking for that vertical.
        </SectionLead>

        {(() => {
        const countryGrid = mob
          ? { marginTop: 20, display: "flex", overflowX: "auto", gap: 12, scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", paddingBottom: 4 }
          : { marginTop: 24, display: "grid", gridTemplateColumns: tab ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14 };
        return <div style={countryGrid}>
          {COUNTRIES.map((c, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column",
              minHeight: mob ? "auto" : 140,
              borderRadius: T.radiusCard, overflow: "hidden",
              background: T.bgCard,
              border: c.featured ? `2px solid ${T.accentGreen}` : T.border,
              boxShadow: T.shadowCard,
              transition: "all 0.2s",
              ...(mob ? { minWidth: 270, maxWidth: 290, flexShrink: 0, scrollSnapAlign: "start" } : {}),
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = T.shadowCardHover;
                e.currentTarget.style.borderColor = T.accentGreen;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = T.shadowCard;
                e.currentTarget.style.borderColor = c.featured ? T.accentGreen : "#e8ecf1";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: mob ? "16px 16px 0" : "20px 20px 0" }}>
                <CountryFlag code={c.code} size={mob ? 32 : 36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.fontH, fontWeight: 700, fontSize: mob ? 15 : 16, color: T.textDark }}>{c.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{
                      display: "inline-block",
                      padding: "2px 8px", borderRadius: 6,
                      background: T.textDark, color: "#fff",
                      fontFamily: T.fontMono, fontSize: 11, fontWeight: 700,
                    }}>{c.reg}</span>
                    <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>{c.brokers} brokers</span>
                  </div>
                </div>
                <ArrowRight size={16} color="#cbd5e1" style={{ flexShrink: 0 }} />
              </div>
              <div style={{ height: 1, background: "#f0f4f8", margin: mob ? "12px 16px 0" : "14px 20px 0" }} />
              <div style={{ display: "flex", gap: mob ? 8 : 10, flexWrap: "wrap", alignItems: "center", padding: mob ? "10px 16px 14px" : "12px 20px 16px", marginTop: "auto" }}>
                {c.verticals.map((v, vi) => (
                  <Link key={vi} to={lp(v.path)} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    textDecoration: "none", padding: "2px 0", lineHeight: 1.3,
                  }}
                    onMouseEnter={e => { const t = e.currentTarget.querySelector(".country-vl"); if (t) { t.style.color = T.accentGreenDark; t.style.borderBottomColor = T.accentGreenDark; } }}
                    onMouseLeave={e => { const t = e.currentTarget.querySelector(".country-vl"); if (t) { t.style.color = T.accentGreen; t.style.borderBottomColor = "transparent"; } }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: v.color, flexShrink: 0 }} />
                    <span className="country-vl" style={{
                      fontSize: 12, fontWeight: 500, color: T.accentGreen,
                      borderBottom: "1px solid transparent", transition: "all 0.15s",
                    }}>
                      {v.label} {v.word} {c.geo}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>;
        })()}
        {mob && <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Swipe to see more countries →</div>}
      </section>

      {/* ═══════════════════════════════════════════════════════
          7. ALL BROKER REVIEWS — D2k rows (Barbara R1)
          Navy list removed. Now identical visual language as Top Rated.
          ═══════════════════════════════════════════════════════ */}
      <section style={{ ...wrap, padding: mob ? "8px 16px 40px" : "16px 24px 56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 20 }}>
          <H2Light mob={mob}>All Broker Reviews</H2Light>
          <span style={{ fontSize: 13, color: T.textMuted, fontWeight: 500 }}>{allBrokers.length} reviews</span>
        </div>
        <SectionLead mob={mob}>
          Every broker we cover, ranked by overall score. Tap a name to read the full review.
        </SectionLead>

        <div style={{
          marginTop: mob ? 20 : 24,
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: mob ? 8 : 10,
        }}>
          {allBrokers.map((broker) => (
            v2
              ? <BrokerRowV2 key={broker.slug} broker={broker} mob={mob} lp={lp} mode="review" showRisk={false} />
              : <BrokerRow key={broker.slug} broker={broker} mob={mob} lp={lp} mode="review" />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          8. SIDE-BY-SIDE COMPARISONS — mono chips (Barbara R7, R8)
          Radius 14 → 12, VS medal calmed
          ═══════════════════════════════════════════════════════ */}
      <section style={{ ...wrap, padding: mob ? "40px 16px" : "56px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 20 }}>
          <H2Light mob={mob}>Side-by-Side Comparisons</H2Light>
          <Link to={lp("/compare")} className="link-green" style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            Compare any two <ArrowRight size={12} className="link-arrow" />
          </Link>
        </div>
        <SectionLead mob={mob}>
          Head-to-head matchups across forex, stocks, and crypto — scores, fees, and regulation side by side.
        </SectionLead>

        <div style={{
          marginTop: mob ? 20 : 24,
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: 14,
        }}>
          {[
            ...(POPULAR_PAIRS_BY_VERTICAL.forex || []).slice(0, 2).map(p => ({ ...p, catKey: "forex" })),
            ...(POPULAR_PAIRS_BY_VERTICAL.stocks || []).slice(0, 2).map(p => ({ ...p, catKey: "stocks" })),
            ...(POPULAR_PAIRS_BY_VERTICAL.crypto || []).slice(0, 2).map(p => ({ ...p, catKey: "crypto" })),
          ].map((pair, i) => {
            const brokerA = allBrokers.find(b => b.slug === pair.slugA);
            const brokerB = allBrokers.find(b => b.slug === pair.slugB);
            if (!brokerA || !brokerB) return null;
            const pairSlug = canonicalPair(pair.slugA, pair.slugB);
            return (
              <Link key={i} to={lp(`/compare/${pairSlug}`)} style={{
                display: "flex", flexDirection: "column",
                borderRadius: T.radiusCard, background: T.bgCard, border: T.border,
                overflow: "hidden", textDecoration: "none", color: T.textDark,
                boxShadow: T.shadowCard, transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = T.shadowCardHover; e.currentTarget.style.borderColor = T.accentGreen; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = T.shadowCard; e.currentTarget.style.borderColor = "#e8ecf1"; }}
              >
                {/* Logos band — same dark gradient as HeroBand */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
                  padding: "18px 14px", position: "relative",
                }}>
                  <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${pair.slugA}.svg`} alt={brokerA.B.name}
                      style={{ maxWidth: "80%", height: 28, objectFit: "contain" }}
                      onError={e => { e.target.style.display = "none"; }} />
                  </div>
                  {/* Calmed VS badge — navy chip with subtle orange outline, not screaming orange circle */}
                  <div style={{
                    padding: "4px 9px", borderRadius: 6, flexShrink: 0,
                    background: "rgba(0,0,0,0.45)",
                    border: "1px solid rgba(245,158,11,0.4)",
                    color: T.accentOrange,
                    fontFamily: T.fontMono, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
                  }}>VS</div>
                  <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${pair.slugB}.svg`} alt={brokerB.B.name}
                      style={{ maxWidth: "80%", height: 28, objectFit: "contain" }}
                      onError={e => { e.target.style.display = "none"; }} />
                  </div>
                </div>
                <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: T.fontH, fontWeight: 700, fontSize: 14, color: T.textDark }}>
                      {brokerA.B.name} vs {brokerB.B.name}
                    </div>
                    <div style={{ marginTop: 5 }}>
                      <CatDot vKey={pair.catKey} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontFamily: T.fontMono, fontWeight: 800, fontSize: 13, color: T.accentGreen }}>{brokerA.B.score}</span>
                    <span style={{ fontSize: 10, color: "#cbd5e1", fontFamily: T.fontMono }}>vs</span>
                    <span style={{ fontFamily: T.fontMono, fontWeight: 800, fontSize: 13, color: T.accentGreen }}>{brokerB.B.score}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          9. HOW TO CHOOSE — SEO block, clean text
          ═══════════════════════════════════════════════════════ */}
      <section style={{ ...wrap, padding: mob ? "40px 16px" : "56px 24px" }}>
        <H2Light mob={mob}>{HOMEPAGE_SEO.howToChoose.heading}</H2Light>
        <SectionLead mob={mob}>{HOMEPAGE_SEO.howToChoose.intro}</SectionLead>
        <div style={{ display: "flex", flexDirection: "column", gap: v2 ? (mob ? 20 : 24) : 22, maxWidth: 860, marginTop: mob ? 22 : 28 }}>
          {HOMEPAGE_SEO.howToChoose.sections.map((s, i) => (
            <div key={i} style={v2 ? { display: "flex", gap: mob ? 14 : 20, alignItems: "flex-start" } : {}}>
              {v2 && (
                <div style={{
                  width: mob ? 36 : 44, height: mob ? 36 : 44, borderRadius: "50%",
                  background: "rgba(5,150,105,0.08)", border: "1px solid #a7f3d0",
                  color: T.accentGreen, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: T.fontMono, fontWeight: 800, fontSize: mob ? 13 : 15,
                  letterSpacing: "-0.02em",
                }}>{String(i + 1).padStart(2, "0")}</div>
              )}
              <div style={v2 ? { flex: 1 } : {}}>
                <h3 style={{ fontFamily: T.fontH, fontWeight: 700, fontSize: mob ? 17 : 18, color: T.textDark, marginBottom: 8, letterSpacing: "-0.01em" }}>
                  {s.subheading}
                </h3>
                <p style={{ fontSize: mob ? 15 : 16, lineHeight: 1.75, color: T.textBody, margin: 0 }}>
                  {s.text}
                </p>
                {s.link && (
                  <Link to={lp(s.link.path)} className="link-green" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                    {s.link.text} <ArrowRight size={12} className="link-arrow" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          10. ABOUT — HeroBand gradient (Barbara R3)
          Same dark language as Hero + How We Rate. Third anchor.
          ═══════════════════════════════════════════════════════ */}
      <HeroBand mob={mob} tab={tab} compact>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <Eyebrow dark>About RatedBrokers</Eyebrow>
          <H2Dark mob={mob}>Independent Research. No Paid Placements.</H2Dark>
          <p style={{
            fontSize: mob ? 15 : 17, lineHeight: 1.7, color: "rgba(255,255,255,0.82)",
            marginTop: 16, marginBottom: 28,
          }}>
            Our analysts score brokers across 6 weighted categories using publicly available data,
            regulatory filings, and aggregated user reviews. We earn commissions when you open an account —
            but this never influences our rankings or reviews.
          </p>
        </div>

        {/* Stats — single source, no duplication with hero */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: mob ? 16 : 24, marginBottom: mob ? 28 : 40,
        }}>
          {[
            { n: `${allBrokers.length}+`, l: "Brokers Tested" },
            { n: `${RANKINGS.length}+`, l: "Rankings" },
            { n: "924+", l: "Pages" },
            { n: "130+", l: "Data Points" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", borderRight: (!mob && i < 3) ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
              <div style={{ fontFamily: T.fontMono, fontWeight: 900, fontSize: mob ? 28 : 40, color: T.darkGreen, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: T.fontH, fontWeight: 600, fontSize: mob ? 11 : 12, color: T.darkMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Link cards — glass, same style as hero sidebar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)",
          gap: 14,
        }}>
          {[
            { icon: "book-open", title: "Our Mission", desc: "Why we built RatedBrokers and our commitment to transparency.", path: "/about" },
            { icon: "bar-chart-3", title: "Scoring Methodology", desc: "6 categories, 130+ data points — how we rate every broker.", path: "/methodology" },
            { icon: "shield", title: "Trust & Transparency", desc: "How we make money, editorial independence, and our trust score.", path: "/trust-score" },
          ].map((card, i) => (
            <Link key={i} to={lp(card.path)} style={{
              display: "block", padding: mob ? "20px 18px" : "22px 20px",
              borderRadius: T.radiusCard,
              background: T.darkSoft,
              border: "1px solid rgba(255,255,255,0.12)",
              textDecoration: "none", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.45)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = T.darkSoft; e.currentTarget.style.transform = "none"; }}
            >
              <Icon name={card.icon} size={22} color={T.accentOrange} />
              <div style={{ fontFamily: T.fontH, fontWeight: 700, fontSize: 16, color: "#f8fafc", marginTop: 12, letterSpacing: "-0.01em" }}>{card.title}</div>
              <div style={{ fontSize: 13, color: T.darkMuted, marginTop: 6, lineHeight: 1.55 }}>{card.desc}</div>
            </Link>
          ))}
        </div>
      </HeroBand>

      {/* ═══════════════════════════════════════════════════════
          11. EXPERT TEAM — V1 / V2 / V3 / V4 / V5 / V7 (stable + plates, no founder highlight)
          ═══════════════════════════════════════════════════════ */}
      {v8 ? (
        <ExpertTeamV8 mob={mob} tab={tab} lp={lp} />
      ) : v7 ? (
        <ExpertTeamV7 mob={mob} tab={tab} lp={lp} />
      ) : variant === "v5" ? (
        <ExpertTeamV5 mob={mob} tab={tab} lp={lp} />
      ) : v4 ? (
        <ExpertTeamV4 mob={mob} tab={tab} lp={lp} />
      ) : variant === "v3" ? (
        <ExpertTeamV3 mob={mob} tab={tab} lp={lp} />
      ) : variant === "v2" ? (
        <ExpertTeamV2 mob={mob} tab={tab} lp={lp} />
      ) : (
        <section style={{ ...wrap, padding: mob ? "40px 16px" : "56px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 20 }}>
            <H2Light mob={mob}>Our Expert Team</H2Light>
            <span style={{ fontSize: 13, color: T.textMuted, fontWeight: 500 }}>
              {Object.values(AUTHORS).length} reviewers · CFA · MBA · Series 7/3
            </span>
          </div>
          <SectionLead mob={mob}>
            Every review is written, peer-reviewed, and fact-checked by certified industry professionals
            with real trading experience.
          </SectionLead>

          <div style={{
            marginTop: mob ? 20 : 24,
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
            gap: 12,
          }}>
            {[
              ...Object.values(AUTHORS).filter(a => a.isFounder),
              ...Object.values(AUTHORS).filter(a => !a.isFounder),
            ].map((a) => (
              <Link key={a.id} to={lp(`/author/${a.id}`)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                padding: mob ? "18px 12px" : "22px 16px",
                borderRadius: T.radiusCard,
                background: T.bgCard,
                border: T.border,
                textDecoration: "none", color: T.textDark, transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.accentGreen; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(5,150,105,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf1"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {a.isFounder && (
                  <div style={{
                    fontFamily: T.fontMono, fontSize: 9, fontWeight: 800,
                    color: T.accentGreen, letterSpacing: "0.18em", textTransform: "uppercase",
                    marginBottom: 2,
                  }}>Founder</div>
                )}
                <AuthorAvatar author={a} size={mob ? 48 : 56} showVerified />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: T.fontH, fontWeight: 700, fontSize: mob ? 13 : 15, color: T.textDark }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{a.role}</div>
                  {a.credentials && a.credentials.length > 0 && (
                    <div style={{ fontFamily: T.fontMono, fontSize: 10.5, color: T.accentGreen, fontWeight: 700, marginTop: 4 }}>
                      {a.credentials.join(" · ")}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          12. POPULAR SEARCHES — light, Quick Pills relocated (Barbara R14)
          ═══════════════════════════════════════════════════════ */}
      <section style={{ ...wrap, padding: mob ? "16px 16px 32px" : "20px 24px 40px" }}>
        <div style={{
          padding: mob ? "20px" : "24px 28px",
          background: T.bgCard,
          border: T.border,
          borderRadius: T.radiusCard,
        }}>
          <Eyebrow>Popular Searches</Eyebrow>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {POPULAR_SEARCHES.map(ql => (
              <Link key={ql.path} to={lp(ql.path)} style={{
                display: "inline-flex", alignItems: "center",
                padding: "7px 14px", borderRadius: T.radiusPill,
                background: "#f1f5f9", border: "1px solid #e2e8f0",
                color: T.textBody, fontSize: 12, fontWeight: 600,
                textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,158,11,0.1)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)"; e.currentTarget.style.color = T.accentGreenDark; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = T.textBody; }}
              >{ql.label}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          13. FAQ — clean accordion
          ═══════════════════════════════════════════════════════ */}
      <section style={{ ...wrap, padding: mob ? "0 16px 48px" : "0 24px 64px" }}>
        <H2Light mob={mob}>Frequently Asked Questions</H2Light>
        <SectionLead mob={mob}>Everything you need to know about our methodology, affiliate model, and broker ratings.</SectionLead>
        <div style={{ maxWidth: 860, display: "flex", flexDirection: "column", gap: 0, marginTop: mob ? 20 : 24 }}>
          {HOMEPAGE_SEO.faq.map((item, i) => (
            <FaqItem key={i} question={item.q} answer={item.a} defaultOpen={i === 0} />
          ))}
        </div>
      </section>

    </div>
  );
}
