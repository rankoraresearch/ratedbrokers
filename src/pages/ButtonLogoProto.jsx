/**
 * Button & Logo Prototypes — Realistic full-page views with variant switcher.
 *
 * Two views:
 *   1. REVIEW HERO — realistic broker review hero section with CTA + sidebar
 *   2. RANKING CARDS — realistic ranking card list (top 5)
 *
 * Variants (toggle via fixed bar):
 *   CURRENT      — exact production styles (opacity-only hover, green CTA, flat navy logo bg)
 *   BARBARA      — orange CTA, lift+darken hover, gradient navy logo, frosted glass hero, card hover lift
 *   BILL         — orange gradient CTA, green outline review btn, green-tinted logo bg
 *   BARBARA-ALT  — orange CTA, borderless floating logo, pill-shape logo bg in cards
 *
 * Layout/data/positions unchanged — only colors, hover effects, and logo backgrounds differ.
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBrokersWithData, getBrokerData } from "../data/brokers/index";
import { getBrokerBlurb } from "../data/rankingThematic";
import { useLocalePath } from "../i18n/useLocalePath";
import BrokerLogo from "../components/BrokerLogo";
import RegBadge from "../components/RegBadge";
import ScoreBadge from "../components/ScoreBadge";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import TrustpilotLogo from "../components/TrustpilotLogo";
import Icon from "../components/Icon";
import {
  Shield, Check, X as XIcon, ArrowRight, ExternalLink,
  ChevronRight, ChevronDown, Award, Star, Clock, Search, TrendingUp,
} from "lucide-react";

function useMedia() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const fn = () => setW(window.innerWidth); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  return { mob: w < 640, tab: w >= 640 && w < 1024 };
}

/* ══════════════════════════════════════════════════════════════════
   WIDE LOGO — parameterized background
   ══════════════════════════════════════════════════════════════════ */
function WideLogo({ slug, name, fallback, w = 200, h = 64, radius = 12, bg = "#0f172a", border = "1px solid #1e293b", noBg = false }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div style={{ background: noBg ? "transparent" : bg, borderRadius: radius, padding: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", width: w, height: h }}>
        <BrokerLogo slug={slug} name={name} fallback={fallback} size={h - 8} shape="brand" borderRadius={radius - 4} />
      </div>
    );
  }
  if (noBg) {
    return (
      <div style={{ width: w, height: h, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${slug}.svg`} alt={`${name} logo`} loading="lazy"
          onError={() => setErr(true)} style={{ width: "85%", height: "70%", objectFit: "contain", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }} />
      </div>
    );
  }
  return (
    <div style={{ borderRadius: radius, overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", height: h, width: w, flexShrink: 0, background: bg, border }}>
      <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${slug}.svg`} alt={`${name} logo`} loading="lazy"
        onError={() => setErr(true)} style={{ width: "70%", height: "70%", objectFit: "contain" }} />
    </div>
  );
}

function Stars({ r, size = 15 }) {
  return <div style={{ display: "flex", gap: 2 }}>{[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: size, height: size, background: i <= Math.floor(r) ? "#00B67A" : i - 0.5 <= r ? "linear-gradient(90deg,#00B67A 50%,#d1d5db 50%)" : "#d1d5db", clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)" }} />)}</div>;
}

/* ══════════════════════════════════════════════════════════════════
   VARIANT CONFIGS — all styling differences parameterized here
   ══════════════════════════════════════════════════════════════════ */
const VARIANTS = {
  current: {
    id: "current", label: "Current", color: "#64748b",
    desc: "Production styles: green CTA, opacity hover, flat navy logo bg",
    // Primary CTA (Open Account)
    primaryBg: "#059669", primaryBgHover: "#059669", primaryColor: "#fff", primaryColorHover: "#fff",
    primaryShadow: "0 2px 8px rgba(5,150,105,0.25)", primaryShadowHover: "0 2px 8px rgba(5,150,105,0.25)",
    primaryLift: false,
    // Secondary CTA (Read Review)
    secondaryBg: "#fff", secondaryBgHover: "#fff", secondaryColor: "#0f172a", secondaryColorHover: "#0f172a",
    secondaryBorder: "2px solid #0f172a", secondaryBorderHover: "2px solid #0f172a",
    secondaryLift: false,
    // Orange CTA (Review page Visit)
    orangeBg: "#f59e0b", orangeBgHover: "#f59e0b", orangeShadow: "0 4px 12px rgba(245,158,11,0.3)",
    orangeShadowHover: "0 4px 12px rgba(245,158,11,0.3)", orangeLift: false,
    // Logo background
    logoBg: "#0f172a", logoBorder: "1px solid #1e293b", logoNoBg: false, logoRadius: 12,
    heroLogoBg: "#0f172a", heroLogoBorder: "2px solid rgba(255,255,255,0.3)", heroLogoNoBg: false,
    // Card hover
    cardLift: false,
    // Hero sidebar
    heroSidebarBg: "rgba(255,255,255,0.08)", heroSidebarBorder: "1px solid rgba(255,255,255,0.12)",
  },
  barbara: {
    id: "barbara", label: "Barbara", color: "#f59e0b",
    desc: "Orange CTA, lift+darken hover, gradient navy logo, frosted glass hero, card lift",
    primaryBg: "#f59e0b", primaryBgHover: "#d97706", primaryColor: "#0f172a", primaryColorHover: "#0f172a",
    primaryShadow: "0 2px 8px rgba(245,158,11,0.25)", primaryShadowHover: "0 8px 24px rgba(245,158,11,0.4)",
    primaryLift: true,
    secondaryBg: "#fff", secondaryBgHover: "#0f172a", secondaryColor: "#0f172a", secondaryColorHover: "#fff",
    secondaryBorder: "2px solid #0f172a", secondaryBorderHover: "2px solid #0f172a",
    secondaryLift: false,
    orangeBg: "#f59e0b", orangeBgHover: "#d97706", orangeShadow: "0 4px 12px rgba(245,158,11,0.3)",
    orangeShadowHover: "0 8px 28px rgba(245,158,11,0.45)", orangeLift: true,
    logoBg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", logoBorder: "1px solid #334155",
    logoNoBg: false, logoRadius: 12,
    heroLogoBg: "rgba(255,255,255,0.08)", heroLogoBorder: "1px solid rgba(255,255,255,0.12)", heroLogoNoBg: false,
    cardLift: true,
    heroSidebarBg: "rgba(255,255,255,0.08)", heroSidebarBorder: "1px solid rgba(255,255,255,0.12)",
  },
  bill: {
    id: "bill", label: "Bill", color: "#059669",
    desc: "Orange gradient CTA, green outline review, green-tinted logo bg",
    primaryBg: "linear-gradient(135deg, #f59e0b, #fbbf24)", primaryBgHover: "linear-gradient(135deg, #d97706, #f59e0b)",
    primaryColor: "#0f172a", primaryColorHover: "#0f172a",
    primaryShadow: "0 2px 8px rgba(245,158,11,0.2)", primaryShadowHover: "0 6px 20px rgba(245,158,11,0.4)",
    primaryLift: true,
    secondaryBg: "#fff", secondaryBgHover: "#059669", secondaryColor: "#059669", secondaryColorHover: "#fff",
    secondaryBorder: "2px solid #059669", secondaryBorderHover: "2px solid #059669",
    secondaryLift: false,
    orangeBg: "linear-gradient(135deg, #f59e0b, #fbbf24)", orangeBgHover: "linear-gradient(135deg, #d97706, #f59e0b)",
    orangeShadow: "0 4px 12px rgba(245,158,11,0.3)", orangeShadowHover: "0 8px 24px rgba(245,158,11,0.4)",
    orangeLift: true,
    logoBg: "linear-gradient(135deg, #0a2018, #0f172a)", logoBorder: "1px solid #1a3d30",
    logoNoBg: false, logoRadius: 12,
    heroLogoBg: "linear-gradient(135deg, #0a2018, #0f172a)", heroLogoBorder: "1px solid rgba(52,211,153,0.2)", heroLogoNoBg: false,
    cardLift: true,
    heroSidebarBg: "rgba(255,255,255,0.08)", heroSidebarBorder: "1px solid rgba(255,255,255,0.12)",
  },
  barbaraAlt: {
    id: "barbaraAlt", label: "Barbara Alt", color: "#8b5cf6",
    desc: "Orange CTA, borderless floating logo on hero, pill-shape logos in cards",
    primaryBg: "#f59e0b", primaryBgHover: "#d97706", primaryColor: "#0f172a", primaryColorHover: "#0f172a",
    primaryShadow: "0 2px 8px rgba(245,158,11,0.25)", primaryShadowHover: "0 8px 24px rgba(245,158,11,0.4)",
    primaryLift: true,
    secondaryBg: "#fff", secondaryBgHover: "#0f172a", secondaryColor: "#0f172a", secondaryColorHover: "#fff",
    secondaryBorder: "2px solid #0f172a", secondaryBorderHover: "2px solid #0f172a",
    secondaryLift: false,
    orangeBg: "#f59e0b", orangeBgHover: "#d97706", orangeShadow: "0 4px 12px rgba(245,158,11,0.3)",
    orangeShadowHover: "0 8px 28px rgba(245,158,11,0.45)", orangeLift: true,
    logoBg: "#111827", logoBorder: "none", logoNoBg: false, logoRadius: 24,
    heroLogoBg: "transparent", heroLogoBorder: "none", heroLogoNoBg: true,
    cardLift: true,
    heroSidebarBg: "rgba(255,255,255,0.06)", heroSidebarBorder: "1px solid rgba(255,255,255,0.08)",
  },
  combined: {
    id: "combined", label: "Combined", color: "#e11d48",
    desc: "Bill buttons (orange gradient CTA, green outline review) + Barbara hero logo (frosted glass bg)",
    // Buttons — all from Bill
    primaryBg: "linear-gradient(135deg, #f59e0b, #fbbf24)", primaryBgHover: "linear-gradient(135deg, #d97706, #f59e0b)",
    primaryColor: "#0f172a", primaryColorHover: "#0f172a",
    primaryShadow: "0 2px 8px rgba(245,158,11,0.2)", primaryShadowHover: "0 6px 20px rgba(245,158,11,0.4)",
    primaryLift: true,
    secondaryBg: "#fff", secondaryBgHover: "#059669", secondaryColor: "#059669", secondaryColorHover: "#fff",
    secondaryBorder: "2px solid #059669", secondaryBorderHover: "2px solid #059669",
    secondaryLift: false,
    orangeBg: "linear-gradient(135deg, #f59e0b, #fbbf24)", orangeBgHover: "linear-gradient(135deg, #d97706, #f59e0b)",
    orangeShadow: "0 4px 12px rgba(245,158,11,0.3)", orangeShadowHover: "0 8px 24px rgba(245,158,11,0.4)",
    orangeLift: true,
    // Card logos — from Bill (green-tinted)
    logoBg: "linear-gradient(135deg, #0a2018, #0f172a)", logoBorder: "1px solid #1a3d30",
    logoNoBg: false, logoRadius: 12,
    // Hero logo — from Barbara (frosted glass)
    heroLogoBg: "rgba(255,255,255,0.08)", heroLogoBorder: "1px solid rgba(255,255,255,0.12)", heroLogoNoBg: false,
    cardLift: true,
    heroSidebarBg: "rgba(255,255,255,0.08)", heroSidebarBorder: "1px solid rgba(255,255,255,0.12)",
  },
};

/* ══════════════════════════════════════════════════════════════════
   INTERACTIVE BUTTON WRAPPER — applies hover from variant config
   ══════════════════════════════════════════════════════════════════ */
function HoverBtn({ variant, type, children, style = {}, ...props }) {
  const [hover, setHover] = useState(false);
  const V = variant;
  let base = {}, hovered = {};

  if (type === "primary") {
    base = { background: V.primaryBg, color: V.primaryColor, boxShadow: V.primaryShadow };
    hovered = { background: V.primaryBgHover, color: V.primaryColorHover, boxShadow: V.primaryShadowHover,
      ...(V.primaryLift ? { transform: "translateY(-2px)" } : {}) };
  } else if (type === "secondary") {
    base = { background: V.secondaryBg, color: V.secondaryColor, border: V.secondaryBorder };
    hovered = { background: V.secondaryBgHover, color: V.secondaryColorHover, border: V.secondaryBorderHover };
  } else if (type === "orange") {
    base = { background: V.orangeBg, color: "#0f172a", boxShadow: V.orangeShadow };
    hovered = { background: V.orangeBgHover, color: "#0f172a", boxShadow: V.orangeShadowHover,
      ...(V.orangeLift ? { transform: "translateY(-2px)" } : {}) };
  }

  if (!V.primaryLift && !V.orangeLift && type !== "secondary") {
    hovered.opacity = 0.9;
  }

  const merged = hover ? { ...base, ...hovered, ...style } : { ...base, ...style };

  return (
    <a href="#" onClick={e => e.preventDefault()}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: "none", transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)", ...merged }}
      {...props}
    >
      {typeof children === "function" ? children(hover) : children}
    </a>
  );
}

/* ══════════════════════════════════════════════════════════════════
   VIEW: REVIEW HERO — realistic broker review page (top section)
   ══════════════════════════════════════════════════════════════════ */
function ReviewView({ variant, mob, tab }) {
  const V = VARIANTS[variant];
  const lp = useLocalePath();
  const allBrokers = getAllBrokersWithData();
  const br = allBrokers.find(b => b.slug === "eightcap") || allBrokers[0];
  if (!br) return null;
  const { B } = br;
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const visitUrl = "#";

  const scores = [
    { name: "Fees & Spreads", score: 9.1, weight: 30 },
    { name: "Platforms & Tools", score: 8.8, weight: 20 },
    { name: "Regulation & Safety", score: 9.0, weight: 15 },
    { name: "Tradable Instruments", score: 8.5, weight: 15 },
    { name: "Customer Support", score: 8.2, weight: 15 },
    { name: "Broker Transparency", score: 8.7, weight: 5 },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb" }}>
      {/* Breadcrumb */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <nav style={{ display: "flex", gap: 6, fontSize: 13, color: "#94a3b8", alignItems: "center" }}>
          <span style={{ color: "#64748b" }}>RatedBrokers</span>
          <ChevronRight size={12} />
          <span style={{ color: "#64748b" }}>Forex Brokers</span>
          <ChevronRight size={12} />
          <span style={{ color: "#0f172a", fontWeight: 600 }}>{B.name} Review</span>
        </nav>
      </div>

      {/* Hero Band */}
      <div style={{
        position: "relative", overflow: "hidden", borderTop: "3px solid #f59e0b",
        background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
      }}>
        {/* Diagonal texture */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,1) 35px, rgba(255,255,255,1) 36px)",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto",
          padding: mob ? "32px 16px 40px" : "48px 24px 56px",
        }}>
          <div style={{ display: "flex", flexDirection: mob ? "column" : "row", justifyContent: "space-between", gap: mob ? 20 : 32 }}>
            <div style={{ flex: 1 }}>
              {/* Logo + Title */}
              <div style={{ display: "flex", alignItems: "center", gap: mob ? 12 : 16, marginBottom: 14 }}>
                <WideLogo slug={br.slug} name={B.name} fallback={B.logo} mob={mob}
                  w={mob ? 200 : 280} h={mob ? 64 : 88} radius={14}
                  bg={V.heroLogoBg} border={V.heroLogoBorder} noBg={V.heroLogoNoBg}
                />
                <div>
                  <h1 style={{ fontFamily: "Outfit", fontSize: mob ? 22 : 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                    {B.name} Review 2026
                  </h1>
                  <p style={{ fontSize: mob ? 13 : 15, color: "rgba(255,255,255,0.6)" }}>{B.type} Broker &middot; Est. {B.year}</p>
                </div>
              </div>

              {/* Score + Regs */}
              <div style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 16, flexWrap: "wrap", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ background: "rgba(52,211,153,0.15)", border: "2px solid #34d399", borderRadius: 8, padding: "4px 10px", fontFamily: "'JetBrains Mono'", fontSize: mob ? 16 : 18, fontWeight: 800, color: "#34d399" }}>{B.score}</div>
                  <span style={{ fontSize: mob ? 12 : 14, fontWeight: 600, color: "#34d399" }}>{B.verdict || "Excellent"}</span>
                </div>
                {!mob && <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                  <TrustpilotLogo size="xs" onDark />
                  <Stars r={B.tp} size={14} />
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: "#fff" }}>{B.tp}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>({B.tpCount?.toLocaleString()})</span>
                </div>
                {!mob && <>
                  <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />
                  <div style={{ display: "flex", gap: 4 }}>{B.regs.filter(r => r.tier === 1).map(r => <RegBadge key={r.name} reg={r.name} onDark />)}</div>
                </>}
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(3,1fr)" : "repeat(5,auto)", gap: mob ? 8 : 20 }}>
                {[
                  { l: "Spread", v: `${B.spread} pips` },
                  { l: "Commission", v: B.commission || "$7/lot" },
                  { l: "Min Deposit", v: `$${B.minDep}` },
                  ...(!mob ? [{ l: "Leverage", v: B.leverage }, { l: "Instruments", v: B.instruments || "800+" }] : []),
                ].map((x, i) => (
                  <div key={i} style={mob ? { textAlign: "center", padding: "6px", background: "rgba(255,255,255,0.06)", borderRadius: 6 } : {}}>
                    <div style={{ fontSize: mob ? 10 : 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{x.l}</div>
                    <div style={{ fontSize: mob ? 14 : 15, color: "#fff", fontWeight: 700 }}>{x.v}</div>
                  </div>
                ))}
              </div>

              {/* Mobile CTA */}
              {mob && (
                <HoverBtn variant={V} type="orange" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  fontSize: 15, fontWeight: 700, padding: "12px", borderRadius: 10, marginTop: 14, width: "100%",
                }}>
                  {(h) => <>Visit {B.name} <ArrowRight size={14} style={{ transform: h ? "translateX(3px)" : "none", transition: "transform 0.2s" }} /></>}
                </HoverBtn>
              )}
            </div>

            {/* Desktop Sidebar */}
            {!mob && (
              <div style={{
                width: tab ? 220 : 280, flexShrink: 0,
                background: V.heroSidebarBg, backdropFilter: "blur(12px)",
                border: V.heroSidebarBorder, borderRadius: 16, padding: tab ? "18px" : "22px", textAlign: "center",
              }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 4 }}>Our Rating</div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 40, fontWeight: 800, color: "#34d399", lineHeight: 1 }}>{B.score}</div>
                <div style={{ fontSize: 13, color: "#34d399", fontWeight: 600, marginBottom: 10 }}>{B.verdict || "Excellent"}</div>
                {B.promo && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 8px", marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}><Icon name="lightbulb" size={13} color="#f59e0b" /> {B.promo}</div>}
                <HoverBtn variant={V} type="orange" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  fontSize: 16, fontWeight: 700, padding: "13px 24px", borderRadius: 10, width: "100%",
                }}>
                  {(h) => <>Visit {B.name} <ExternalLink size={14} style={{ transform: h ? "translateX(2px) translateY(-1px)" : "none", transition: "transform 0.2s" }} /></>}
                </HoverBtn>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>74-89% of retail CFD accounts lose money</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content area — overview + scoring + CTA block + pros/cons */}
      <div style={{ ...cn, display: mob ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 220px" : "200px 1fr 260px", gap: mob ? 16 : 24, paddingTop: mob ? 20 : 28, paddingBottom: mob ? 40 : 64 }}>

        {/* TOC (desktop) */}
        {!mob && !tab && (
          <aside style={{ position: "sticky", top: 80, alignSelf: "start" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Contents</div>
            {["Overview", "Scoring", "Pros & Cons", "Expert Verdict"].map((item, i) => (
              <div key={i} style={{ fontSize: 13, color: "#374151", padding: "5px 10px", borderLeft: "2px solid #e2e8f0", marginBottom: 1 }}>{item}</div>
            ))}
          </aside>
        )}

        {/* Main content */}
        <main>
          {/* Author */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24, padding: "12px 16px", background: "#fff", borderRadius: 10, border: "1px solid #e8ecf1" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e2e8f0" }} />
            <div style={{ fontSize: 14 }}>
              <span style={{ fontWeight: 600, color: "#0f172a" }}>Marcus Chen</span>
              <span style={{ color: "#94a3b8" }}> &middot; Senior Analyst &middot; Updated March 2026</span>
            </div>
          </div>

          {/* Overview */}
          <h2 style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 0 }}>{B.name} Overview</h2>
          <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.8, marginBottom: 14 }}>
            {B.name} is a leading {B.type?.toLowerCase()} broker offering raw spreads from {B.spread} pips with competitive execution speeds. Regulated by {B.regs?.slice(0, 2).map(r => r.name).join(" & ")}, it provides access to {B.instruments || "800+"} instruments across forex, commodities, indices, and shares.
          </p>

          {/* Mid-content CTA */}
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, margin: "20px 0" }}>
            <div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Ready to trade with {B.name}?</div>
              {B.promo && <div style={{ fontSize: 14, color: "#34d399", fontWeight: 600, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><Icon name="lightbulb" size={14} color="#f59e0b" /> {B.promo}</div>}
            </div>
            <HoverBtn variant={V} type="orange" style={{
              fontSize: 14, fontWeight: 700, padding: "12px 28px", borderRadius: 8,
              display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", flexShrink: 0,
            }}>
              {(h) => <>Visit {B.name} <ExternalLink size={14} style={{ transform: h ? "translateX(2px) translateY(-1px)" : "none", transition: "transform 0.2s" }} /></>}
            </HoverBtn>
          </div>

          {/* Scoring */}
          <h2 style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>Scoring Breakdown</h2>
          <div style={{ background: "#fff", border: "1px solid #e8ecf1", borderRadius: 12, padding: "22px", marginBottom: 16, borderTop: "3px solid #0f172a" }}>
            {scores.map((s, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{s.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#64748b" }}>{s.weight}%</span>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 15, fontWeight: 800, color: s.score >= 9.5 ? "#059669" : "#0d9488" }}>{s.score}</span>
                  </div>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#e8ecf1" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #059669, #059669aa)", width: `${(s.score / 10) * 100}%` }} />
                </div>
              </div>
            ))}
            <div style={{ background: "#0f172a", margin: "-22px", marginTop: 0, padding: "14px 22px", borderRadius: "0 0 12px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, color: "#fff" }}>Overall Score</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 24, fontWeight: 800, color: "#34d399" }}>{B.score}/10</span>
            </div>
          </div>

          {/* Pros & Cons */}
          <h2 style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>Pros & Cons</h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "20px" }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#059669", marginBottom: 12 }}>Pros</div>
              {(B.pros || ["Competitive spreads", "Strong regulation", "Fast execution", "Multiple platforms"]).slice(0, 4).map((p, i) => (
                <div key={i} style={{ fontSize: 14, color: "#111827", marginBottom: 8, paddingLeft: 16, position: "relative", lineHeight: 1.5 }}>
                  <span style={{ position: "absolute", left: 0, color: "#059669" }}>&bull;</span>{p}
                </div>
              ))}
            </div>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "20px" }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#dc2626", marginBottom: 12 }}>Cons</div>
              {(B.cons || ["No US clients", "Limited crypto", "Higher minimum"]).slice(0, 3).map((c, i) => (
                <div key={i} style={{ fontSize: 14, color: "#111827", marginBottom: 8, paddingLeft: 16, position: "relative", lineHeight: 1.5 }}>
                  <span style={{ position: "absolute", left: 0, color: "#dc2626" }}>&bull;</span>{c}
                </div>
              ))}
            </div>
          </div>

          {/* Expert Verdict */}
          <h2 style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>Expert Verdict</h2>
          <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#0f2e24 100%)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1e293b" }} />
              <div><span style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>Marcus Chen</span><div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Senior Forex Analyst</div></div>
            </div>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, marginBottom: 14 }}>
              {B.name} delivers solid value for active traders — from {B.spread} pips spreads and a strong regulatory framework under {B.regs?.[0]?.name}. For its price-to-quality ratio, it ranks among our top recommendations in 2026.
            </p>
            <HoverBtn variant={V} type="orange" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontSize: 15, fontWeight: 700, padding: "14px 28px", borderRadius: 10, width: "100%",
            }}>
              {(h) => <>Open Account with {B.name} <ExternalLink size={14} style={{ transform: h ? "translateX(2px) translateY(-1px)" : "none", transition: "transform 0.2s" }} /></>}
            </HoverBtn>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: 8 }}>{B.type} &middot; Regulated</div>
          </div>
        </main>

        {/* Right sidebar (desktop) */}
        {!mob && (
          <aside>
            <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "20px", textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 36, fontWeight: 800, color: "#34d399", lineHeight: 1 }}>{B.score}</div>
                <div style={{ fontSize: 13, color: "#34d399", fontWeight: 600, marginBottom: 10 }}>{B.verdict || "Excellent"}</div>
                <HoverBtn variant={V} type="orange" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  fontSize: 15, fontWeight: 700, padding: "12px 20px", borderRadius: 9, width: "100%", marginBottom: 6,
                }}>
                  {(h) => <>Visit {B.name} <span style={{ marginLeft: 4 }}>&rarr;</span></>}
                </HoverBtn>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>74-89% of retail CFD accounts lose money</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e8ecf1", borderRadius: 12, padding: "16px" }}>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Quick Facts</div>
                {[{ l: "Founded", v: B.year }, { l: "HQ", v: B.hq }, { l: "Min Deposit", v: `$${B.minDep}` }, { l: "Spread", v: `${B.spread} pips` }, { l: "Leverage", v: B.leverage }, { l: "Type", v: B.type }].map((x, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 5 ? "1px solid #f0f4f8" : "none" }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>{x.l}</span>
                    <span style={{ fontSize: 13, color: "#111827", fontWeight: 600 }}>{x.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════
   VIEW: RANKING CARDS — realistic ranking page with top 5 broker cards
   ══════════════════════════════════════════════════════════════════ */
function RankingView({ variant, mob, tab }) {
  const V = VARIANTS[variant];
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score).slice(0, 5);
  const cn = { maxWidth: 1100, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb" }}>
      {/* Breadcrumb */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <nav style={{ display: "flex", gap: 6, fontSize: 13, color: "#94a3b8", alignItems: "center" }}>
          <span style={{ color: "#64748b" }}>RatedBrokers</span>
          <ChevronRight size={12} />
          <span style={{ color: "#0f172a", fontWeight: 600 }}>Best Forex Brokers 2026</span>
        </nav>
      </div>

      {/* Hero */}
      <header style={{ ...cn, padding: mob ? "20px 16px 28px" : "32px 24px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 16 }}>
          <TrendingUp size={13} color="#059669" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>Updated March 2026</span>
        </div>
        <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 28 : 44, lineHeight: 1.08, color: "#0f172a", marginBottom: 10 }}>
          Best Forex Brokers 2026
        </h1>
        <p style={{ fontSize: mob ? 15 : 17, color: "#64748b", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
          We analyzed {brokers.length} brokers across 6 scoring categories. Here are the top picks.
        </p>
      </header>

      {/* Cards */}
      <section style={{ ...cn, paddingBottom: 48, display: "flex", flexDirection: "column", gap: 16 }}>
        {brokers.map((broker, idx) => (
          <RankCard key={broker.slug} broker={broker} rank={idx + 1} variant={V} mob={mob} tab={tab} lp={lp} />
        ))}
      </section>
    </div>
  );
}

/* ── Single Ranking Card — with real thematic content from getBrokerBlurb ── */
function RankCard({ broker, rank, variant, mob, tab, lp }) {
  const V = variant;
  const { B } = broker;
  const [cardHover, setCardHover] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const reviewPath = lp(`/review/${broker.slug}`);
  const hasTp = B.tp && B.tp > 0;
  const thematic = getBrokerBlurb("forex-overall", broker.slug, broker);

  const cardStyle = {
    background: "#fff", borderRadius: 16,
    border: rank === 1 ? "2px solid #059669" : "1px solid #e2e8f0",
    boxShadow: (V.cardLift && cardHover)
      ? (rank === 1 ? "0 8px 32px rgba(5,150,105,0.12)" : "0 8px 32px rgba(0,0,0,0.08)")
      : (rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)"),
    transform: (V.cardLift && cardHover) ? "translateY(-2px)" : "none",
    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
    overflow: "hidden",
  };

  /* ── Thematic sub-components (matches production BrokerRankCard) ── */
  const ThematicBlurb = () => thematic ? (
    <div style={{ padding: mob ? "0 16px 12px" : "12px 0 0" }}>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 }}>
        {thematic.why}
      </div>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", margin: 0, maxWidth: mob ? "none" : 900 }}>
        {thematic.text}
      </p>
    </div>
  ) : null;

  const ProConPills = () => thematic ? (
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
  ) : null;

  const ExpandableAnalysis = () => (thematic && thematic.analysis) ? (
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
            {(thematic.prosDetail || thematic.consDetail) && (
              <div style={{
                display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
                gap: 10, marginTop: 10,
              }}>
                {thematic.prosDetail && (
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 4, marginTop: 0 }}>
                      Pros for forex traders
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
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 4, marginTop: 0 }}>
                      Cons for forex traders
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
  ) : null;

  /* ── MOBILE CARD ── */
  if (mob) {
    return (
      <div style={cardStyle}
        onMouseEnter={() => setCardHover(true)} onMouseLeave={() => setCardHover(false)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 16px 0" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#ecfdf5", border: "1px solid #a7f3d0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14, color: "#059669" }}>#{rank}</div>
          <ScoreBadge score={B.score} size="lg" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "14px 16px 0" }}>
          <WideLogo slug={broker.slug} name={B.name} fallback={B.logo} w={200} h={64} radius={V.logoRadius}
            bg={V.logoBg} border={V.logoBorder} noBg={V.logoNoBg} />
          <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827", fontFamily: "'DM Sans'" }}>{B.name}</h3>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{B.type}</div>
            {B.badge && (
              <span style={{ display: "inline-block", marginTop: 5, padding: "2px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0" }}>{B.badge}</span>
            )}
          </div>
        </div>

        {/* Thematic blurb + pills */}
        {thematic && <div style={{ marginTop: 12 }}><ThematicBlurb /></div>}
        {thematic && <ProConPills />}
        {thematic && thematic.analysis && <ExpandableAnalysis />}

        {/* Dual CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 16px 8px" }}>
          <HoverBtn variant={V} type="primary" style={{
            padding: "12px 20px", borderRadius: 10, textAlign: "center", fontWeight: 700, fontSize: 15,
            flexDirection: "column",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 2,
          }}>
            {(h) => <>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>Open {B.name} Account <ArrowRight size={14} style={{ transform: h && V.primaryLift ? "translateX(3px)" : "none", transition: "transform 0.2s" }} /></span>
              {B.promo && <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.8 }}>{B.promo}</span>}
            </>}
          </HoverBtn>
          <HoverBtn variant={V} type="secondary" style={{
            padding: "11px 16px", borderRadius: 10, textAlign: "center", fontWeight: 700, fontSize: 14,
            flexDirection: "column",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 2,
          }}>
            {(h) => <>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>Read Full Review <ChevronRight size={14} style={{ transform: h ? "translateX(3px)" : "none", transition: "transform 0.2s" }} /></span>
              <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.7 }}>{B.score}/10 &middot; Expert tested</span>
            </>}
          </HoverBtn>
        </div>
        {/* Risk warning */}
        {B.riskWarning && (
          <div style={{ padding: "4px 16px 8px", fontSize: 12, lineHeight: 1.4, color: "#374151", textAlign: "center" }}>{B.riskWarning}</div>
        )}
        {/* TP */}
        {hasTp && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", marginTop: 10 }}>
            <Stars r={B.tp} size={12} />
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700, color: "#111827" }}>{B.tp}</span>
            <span style={{ fontSize: 10, color: "#64748b" }}>Trustpilot</span>
          </div>
        )}
        {/* Regs */}
        <div style={{ padding: "8px 16px 10px", display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {B.regs.slice(0, 3).map(r => <RegBadge key={r.name} reg={r.name} />)}
        </div>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "#f1f5f9", margin: "0 16px 12px", borderRadius: 10, overflow: "hidden" }}>
          {[["Spread", `${B.spread} pips`], ["Min Dep", B.minDep === 0 ? "$0" : `$${B.minDep}`], ["Leverage", B.leverage]].map(([label, val]) => (
            <div key={label} style={{ background: "#f8fafc", padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 15, fontWeight: 700, color: "#111827", marginTop: 2, whiteSpace: "nowrap" }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── DESKTOP/TABLET CARD ── */
  return (
    <div style={cardStyle}
      onMouseEnter={() => setCardHover(true)} onMouseLeave={() => setCardHover(false)}>
      <div style={{ padding: tab ? "18px 20px" : "20px 28px", display: "flex", alignItems: "center", gap: tab ? 16 : 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: "#ecfdf5", border: "1px solid #a7f3d0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 16, color: "#059669" }}>#{rank}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
          <WideLogo slug={broker.slug} name={B.name} fallback={B.logo} w={tab ? 160 : 200} h={tab ? 52 : 60} radius={V.logoRadius}
            bg={V.logoBg} border={V.logoBorder} noBg={V.logoNoBg} />
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: 1.2, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 16, color: "#111827" }}>{B.name}</span>
              {B.badge && <span style={{ padding: "1px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0" }}>{B.badge}</span>}
            </h3>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{B.type}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: tab ? 14 : 20 }}>
          {[["Spread", `${B.spread} pips`], ["Min Dep", B.minDep === 0 ? "$0" : `$${B.minDep}`], ["Leverage", B.leverage]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{label}</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 15, fontWeight: 700, color: "#111827", marginTop: 2, whiteSpace: "nowrap" }}>{val}</div>
            </div>
          ))}
        </div>
        <ScoreBadge score={B.score} size="lg" />
      </div>

      <div style={{ padding: tab ? "0 20px 16px" : "0 28px 20px", borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {B.regs.slice(0, 4).map(r => <RegBadge key={r.name} reg={r.name} />)}
          </div>
          {hasTp && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Stars r={B.tp} size={14} />
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 700, color: "#111827" }}>{B.tp}</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>({B.tpCount ? (B.tpCount >= 1000 ? (B.tpCount / 1000).toFixed(1) + "K" : B.tpCount) : ""} reviews)</span>
            </div>
          )}
        </div>

        {/* Thematic blurb + pills + expandable analysis (matches production) */}
        <ThematicBlurb />
        <ProConPills />
        {thematic && thematic.analysis && <ExpandableAnalysis />}

        {/* Dual CTA */}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <HoverBtn variant={V} type="primary" style={{
            flex: 1, minWidth: 170, padding: "12px 20px", borderRadius: 10, textAlign: "center",
            fontWeight: 700, fontSize: 15, flexDirection: "column",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 2,
          }}>
            {(h) => <>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>Open {B.name} Account <ArrowRight size={14} style={{ transform: h && V.primaryLift ? "translateX(3px)" : "none", transition: "transform 0.2s" }} /></span>
              {B.promo && <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.8 }}>{B.promo}</span>}
            </>}
          </HoverBtn>
          <HoverBtn variant={V} type="secondary" style={{
            flex: 1, minWidth: 140, padding: "11px 16px", borderRadius: 10, textAlign: "center",
            fontWeight: 700, fontSize: 14, flexDirection: "column",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 2,
          }}>
            {(h) => <>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>Read Full Review <ChevronRight size={14} style={{ transform: h ? "translateX(3px)" : "none", transition: "transform 0.2s" }} /></span>
              <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.7 }}>{B.score}/10 &middot; Expert tested</span>
            </>}
          </HoverBtn>
        </div>

        {B.riskWarning && (
          <div style={{ padding: "4px 0 0", fontSize: 12, lineHeight: 1.4, color: "#374151", textAlign: "center" }}>{B.riskWarning}</div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE — Switcher bar + views
   ══════════════════════════════════════════════════════════════════ */
const views = [
  { id: "review", label: "Review Page" },
  { id: "ranking", label: "Ranking Cards" },
];

const variantList = [
  VARIANTS.current,
  VARIANTS.barbara,
  VARIANTS.bill,
  VARIANTS.barbaraAlt,
  VARIANTS.combined,
];

export default function ButtonLogoProto() {
  const { mob, tab } = useMedia();
  const [view, setView] = useState("review");
  const [variant, setVariant] = useState("combined");

  const activeV = VARIANTS[variant];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      {/* Fixed top bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          maxWidth: 1600, margin: "0 auto", padding: "8px 16px",
          display: "flex", alignItems: "center", gap: 12, overflowX: "auto",
        }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a", whiteSpace: "nowrap" }}>
            Buttons & Logos
          </span>

          <span style={{ width: 1, height: 24, background: "#e5e7eb", flexShrink: 0 }} />

          {/* View selector */}
          <span style={{ fontWeight: 700, fontSize: 11, color: "#64748b", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            View
          </span>
          {views.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              padding: "6px 14px", borderRadius: 100, border: "none", cursor: "pointer",
              background: view === v.id ? "#0f172a" : "#f1f5f9",
              color: view === v.id ? "#fff" : "#64748b",
              fontWeight: 700, fontSize: 12, fontFamily: "inherit", whiteSpace: "nowrap",
              transition: "all 0.15s", flexShrink: 0,
            }}>{v.label}</button>
          ))}

          <span style={{ width: 1, height: 24, background: "#e5e7eb", flexShrink: 0 }} />

          {/* Variant selector */}
          <span style={{ fontWeight: 700, fontSize: 11, color: "#64748b", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Style
          </span>
          {variantList.map(v => (
            <button key={v.id} onClick={() => setVariant(v.id)}
              title={v.desc}
              style={{
                padding: "6px 14px", borderRadius: 100, border: "none", cursor: "pointer",
                background: variant === v.id ? v.color : "#f1f5f9",
                color: variant === v.id ? (v.color === "#f59e0b" ? "#0f172a" : "#fff") : "#64748b",
                fontWeight: 700, fontSize: 12, fontFamily: "inherit", whiteSpace: "nowrap",
                transition: "all 0.15s", flexShrink: 0,
              }}>{v.label}</button>
          ))}
        </div>

        {/* Description bar */}
        <div style={{ background: "#f8fafc", borderTop: "1px solid #f1f5f9", padding: "4px 16px" }}>
          <div style={{ maxWidth: 1600, margin: "0 auto", fontSize: 12, color: "#64748b" }}>
            <strong style={{ color: activeV.color }}>{activeV.label}:</strong> {activeV.desc}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 76 }}>
        {view === "review" && <ReviewView variant={variant} mob={mob} tab={tab} />}
        {view === "ranking" && <RankingView variant={variant} mob={mob} tab={tab} />}
      </div>
    </div>
  );
}
