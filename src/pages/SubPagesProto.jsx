import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroBand from "../components/HeroBand";
import Breadcrumb from "../components/Breadcrumb";
import ScoreBadge from "../components/ScoreBadge";
import BrokerLogo from "../components/BrokerLogo";
import RegBadge from "../components/RegBadge";
import Icon from "../components/Icon";
import AuthorCredits from "../components/AuthorCredits";
import AuthorBioCard from "../components/AuthorBioCard";
import { AUTHORS } from "../data/authors";
import { Check, X as XIcon, ChevronDown, ChevronUp, ExternalLink, Shield, CreditCard, Smartphone, BookOpen, Users, UserCheck, ArrowRight, Clock, FileText, AlertTriangle, Star, TrendingUp, Zap, Globe, Award, BarChart3, Wallet, ArrowUpDown, MonitorSmartphone, HelpCircle, Linkedin, BadgeCheck, Target } from "lucide-react";

/* ───────── hooks ───────── */
function useMedia() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const fn = () => setW(window.innerWidth); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  return { mob: w < 640, tab: w >= 640 && w < 1024, desk: w >= 1024 };
}

/* ───────── design tokens ───────── */
const NAVY = "#0f172a";
const GREEN = "#059669";
const GREEN_LIGHT = "#ecfdf5";
const GREEN_BORDER = "#a7f3d0";
const ORANGE = "#f59e0b";
const RED = "#dc2626";
const GRAY_TEXT = "#374151";
const GRAY_MUTED = "#64748b";
const GRAY_LIGHT = "#f8f9fb";
const BORDER = "#e8ecf1";
const CARD_BG = "#fff";

/* ───────── IC Markets mock data ───────── */
const B = { name: "IC Markets", slug: "ic-markets", score: 9.6, verdict: "Excellent", logo: "IC", year: 2007, hq: "Sydney, Australia", minDep: 200, spread: "0.0", commission: "$3.50/lot", leverage: "1:1000", instruments: "2,250+", type: "ECN / Raw Spread", tp: 4.8, tpCount: 52067, riskWarning: "70.53% of retail investor accounts lose money when trading CFDs with this provider.", platforms: ["MetaTrader 4", "MetaTrader 5", "cTrader", "TradingView"], badge: "Editor's Choice 2026", promo: "0.0 pip raw spreads — no markup" };
const REGS = [{ name: "ASIC", country: "Australia", num: "335692", tier: 1 }, { name: "CySEC", country: "Cyprus", num: "362/18", tier: 1 }, { name: "FSA", country: "Seychelles", num: "SD018", tier: 3 }];

/* ───────── sub-page definitions ───────── */
const TABS = [
  { id: "fees", label: "Fees", icon: BarChart3 },
  { id: "min-deposit", label: "Min Deposit", icon: Wallet },
  { id: "platforms", label: "Platforms", icon: MonitorSmartphone },
  { id: "regulation", label: "Regulation", icon: Shield },
  { id: "deposit", label: "Deposit", icon: ArrowUpDown },
  { id: "beginners", label: "Beginners", icon: BookOpen },
  { id: "alternatives", label: "Alternatives", icon: Users },
  { id: "account", label: "Account", icon: UserCheck },
];

/* ───────── reusable mini-components ───────── */
function H2({ children, id }) { return <h2 id={id} style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: NAVY, marginBottom: 14, marginTop: 36, scrollMarginTop: 80 }}>{children}</h2>; }
function H3({ children }) { return <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 10, marginTop: 24 }}>{children}</h3>; }
function P({ children }) { return <p style={{ fontSize: 16, color: GRAY_TEXT, lineHeight: 1.8, marginBottom: 14 }}>{children}</p>; }
function Card({ children, style = {} }) { return <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 22, marginBottom: 16, ...style }}>{children}</div>; }

function QuickAnswerBox({ text, score, scoreLabel }) {
  return (
    <div style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.15)", borderRadius: 12, padding: "18px 22px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Quick Answer</div>
        <div style={{ fontSize: 15, color: NAVY, lineHeight: 1.7, fontWeight: 500 }}>{text}</div>
      </div>
      {score && <div style={{ flexShrink: 0 }}><ScoreBadge score={score} size="lg" /></div>}
    </div>
  );
}

function ProsCons({ pros, cons, mob }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 20 }}>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: GREEN, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Check size={14} /> PROS</div>
        {pros.map((p, i) => <div key={i} style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.6, marginBottom: 6, paddingLeft: 22, position: "relative" }}><Check size={13} color={GREEN} style={{ position: "absolute", left: 0, top: 4 }} />{p}</div>)}
      </div>
      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: RED, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><XIcon size={14} /> CONS</div>
        {cons.map((c, i) => <div key={i} style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.6, marginBottom: 6, paddingLeft: 22, position: "relative" }}><XIcon size={13} color={RED} style={{ position: "absolute", left: 0, top: 4 }} />{c}</div>)}
      </div>
    </div>
  );
}

function DataTable({ headers, rows, highlightFirst, mob }) {
  return (
    <div style={{ position: "relative", marginBottom: 20 }}>
      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${BORDER}`, WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: mob ? 13 : 14, minWidth: mob ? 500 : "auto" }}>
          <thead>
            <tr>{headers.map((h, i) => <th key={i} style={{ background: GRAY_LIGHT, color: GRAY_MUTED, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, padding: "10px 14px", textAlign: i === 0 ? "left" : "center", borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap", position: i === 0 && mob ? "sticky" : "static", left: 0, zIndex: i === 0 ? 1 : 0 }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : GRAY_LIGHT }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ padding: "10px 14px", textAlign: ci === 0 ? "left" : "center", borderBottom: `1px solid ${BORDER}`, fontWeight: ci === 0 || (highlightFirst && ci === 1) ? 600 : (cell === "Yes" || cell === "No" || cell === "None") ? 600 : 400, color: highlightFirst && ci === 1 ? GREEN : cell === "Yes" ? GREEN : cell === "No" || cell === "None" ? "#94a3b8" : NAVY, fontFamily: ci > 0 ? "'JetBrains Mono',monospace" : "inherit", fontSize: ci > 0 ? 13 : 14, whiteSpace: "nowrap", position: ci === 0 && mob ? "sticky" : "static", left: 0, background: ci === 0 && mob ? (ri % 2 === 0 ? "#fff" : GRAY_LIGHT) : "inherit", zIndex: ci === 0 ? 1 : 0 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mob && <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 28, background: "linear-gradient(90deg, transparent, rgba(232,236,241,0.7))", borderRadius: "0 10px 10px 0", pointerEvents: "none" }} />}
    </div>
  );
}

function ComparisonBar({ label, value, max, best, unit = "pips" }) {
  const pct = Math.min((value / max) * 100, 100);
  const isBest = best;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
        <span style={{ fontWeight: 600, color: NAVY }}>{label}{isBest && <span style={{ color: "#fff", fontSize: 9, fontWeight: 700, marginLeft: 6, background: GREEN, padding: "2px 6px", borderRadius: 3, letterSpacing: "0.04em" }}>BEST</span>}</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: isBest ? GREEN : GRAY_TEXT }}>{value} {unit}</span>
      </div>
      <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: isBest ? `linear-gradient(90deg, ${GREEN}, #34d399)` : "#94a3b8", borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function CTAInline({ label, sub, mob }) {
  const vUrl = `${import.meta.env.VITE_API_URL || ''}/go/ic-markets`;
  return (
    <div style={{ background: NAVY, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: mob ? "16px" : "18px 24px", display: "flex", alignItems: mob ? "stretch" : "center", flexDirection: mob ? "column" : "row", justifyContent: "space-between", gap: mob ? 12 : 16, margin: "24px 0" }}>
      <div>
        {sub && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{sub}</div>}
        <div style={{ fontSize: 14, color: "#34d399", fontWeight: 600, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><Zap size={14} color={ORANGE} /> {B.promo}</div>
      </div>
      <a href={vUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{ background: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, color: NAVY, fontSize: 14, fontWeight: 700, textDecoration: "none", padding: "12px 28px", borderRadius: 8, boxShadow: "0 2px 8px rgba(245,158,11,0.3)", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", flexShrink: 0, justifyContent: "center" }}>{label || `Visit ${B.name}`} <ExternalLink size={14} /></a>
    </div>
  );
}

function FaqSection({ faqs, mob }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ marginBottom: 24 }}>
      <H2>Frequently Asked Questions</H2>
      {faqs.map((f, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${BORDER}`, marginBottom: 0 }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: NAVY, lineHeight: 1.5 }}>{f.q}</span>
            {open === i ? <ChevronUp size={18} color={GRAY_MUTED} style={{ flexShrink: 0 }} /> : <ChevronDown size={18} color={GRAY_MUTED} style={{ flexShrink: 0 }} />}
          </button>
          {open === i && <div style={{ padding: "0 0 16px", fontSize: 15, color: GRAY_TEXT, lineHeight: 1.8 }}>{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

function VerdictBox({ title, text, bestFor, notFor, mob }) {
  return (
    <Card style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0f2e24 50%, #047857 100%)`, border: "none", padding: mob ? 20 : 28, color: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <ScoreBadge score={B.score} size="lg" />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Our Verdict</div>
          <div style={{ fontFamily: "Outfit", fontSize: mob ? 18 : 22, fontWeight: 800, color: "#fff" }}>{title}</div>
        </div>
      </div>
      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, marginBottom: 16 }}>{text}</p>
      {bestFor && <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}><Check size={16} color="#34d399" style={{ marginTop: 3, flexShrink: 0 }} /><span style={{ fontSize: 14, color: "#a7f3d0" }}><strong>Best for:</strong> {bestFor}</span></div>}
      {notFor && <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}><AlertTriangle size={16} color={ORANGE} style={{ marginTop: 3, flexShrink: 0 }} /><span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}><strong>Not ideal for:</strong> {notFor}</span></div>}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
        <a href={`${import.meta.env.VITE_API_URL || ''}/go/ic-markets`} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{ background: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, color: NAVY, fontSize: 14, fontWeight: 700, textDecoration: "none", padding: "12px 24px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>Visit {B.name} <ExternalLink size={14} /></a>
        <Link to="/review/ic-markets" className="cta-secondary" style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.3)", fontSize: 14, fontWeight: 700, textDecoration: "none", padding: "10px 20px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>Read Full Review <ArrowRight size={14} /></Link>
      </div>
    </Card>
  );
}

/* Author data for standard AuthorCredits component */
const MOCK_AUTHOR = AUTHORS["marcus-chen"];
const MOCK_EDITOR = AUTHORS["sarah-williams"];
const MOCK_FACT_CHECKER = AUTHORS["elena-petrova"];

/* Dynamic related links per tab + other sub-pages */
const RELATED_MAP = {
  fees: [
    { icon: FileText, label: "IC Markets Full Review", path: "/review/ic-markets" },
    { icon: BarChart3, label: "IC Markets vs Pepperstone", path: "/compare/ic-markets-vs-pepperstone" },
    { icon: TrendingUp, label: "Best Low-Spread Forex Brokers", path: "/lowest-spread-forex-brokers" },
  ],
  "min-deposit": [
    { icon: FileText, label: "IC Markets Full Review", path: "/review/ic-markets" },
    { icon: Wallet, label: "IC Markets Fees & Spreads", path: "/review/ic-markets/fees" },
    { icon: BookOpen, label: "How to Choose a Broker", path: "/guide/how-to-choose-forex-broker" },
  ],
  platforms: [
    { icon: FileText, label: "IC Markets Full Review", path: "/review/ic-markets" },
    { icon: MonitorSmartphone, label: "Best MT4 Brokers", path: "/best-metatrader-4-brokers" },
    { icon: MonitorSmartphone, label: "Best TradingView Brokers", path: "/best-tradingview-brokers" },
  ],
  regulation: [
    { icon: FileText, label: "IC Markets Full Review", path: "/review/ic-markets" },
    { icon: Shield, label: "ASIC Regulation Guide", path: "/regulator/asic" },
    { icon: Shield, label: "CySEC Regulation Guide", path: "/regulator/cysec" },
  ],
  deposit: [
    { icon: FileText, label: "IC Markets Full Review", path: "/review/ic-markets" },
    { icon: Wallet, label: "IC Markets Minimum Deposit", path: "/review/ic-markets/minimum-deposit" },
    { icon: BarChart3, label: "IC Markets Fees & Spreads", path: "/review/ic-markets/fees" },
  ],
  beginners: [
    { icon: FileText, label: "IC Markets Full Review", path: "/review/ic-markets" },
    { icon: BookOpen, label: "How to Start Forex Trading", path: "/guide/how-to-start-forex-trading" },
    { icon: Users, label: "Best Brokers for Beginners", path: "/best-forex-brokers-for-beginners" },
  ],
  alternatives: [
    { icon: FileText, label: "IC Markets Full Review", path: "/review/ic-markets" },
    { icon: BarChart3, label: "IC Markets vs Pepperstone", path: "/compare/ic-markets-vs-pepperstone" },
    { icon: TrendingUp, label: "Best Forex Brokers 2026", path: "/best-forex-brokers" },
  ],
  account: [
    { icon: FileText, label: "IC Markets Full Review", path: "/review/ic-markets" },
    { icon: Wallet, label: "IC Markets Deposit Methods", path: "/review/ic-markets/deposit-withdrawal" },
    { icon: BookOpen, label: "How to Choose a Broker", path: "/guide/how-to-choose-forex-broker" },
  ],
};

function RelatedLinks({ activeTab }) {
  const contextLinks = RELATED_MAP[activeTab] || RELATED_MAP.fees;
  /* Also show other sub-page tabs as "Explore More" */
  const otherTabs = TABS.filter(t => t.id !== activeTab).slice(0, 4);
  return (
    <>
      <Card style={{ background: GRAY_LIGHT }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Related</div>
        {contextLinks.map((l, i) => (
          <Link key={i} to={l.path} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < contextLinks.length - 1 ? `1px solid ${BORDER}` : "none", textDecoration: "none", color: NAVY, fontSize: 14, fontWeight: 500 }} onMouseEnter={e => e.currentTarget.style.color = GREEN} onMouseLeave={e => e.currentTarget.style.color = NAVY}>
            <l.icon size={16} color={GREEN} />{l.label}
          </Link>
        ))}
      </Card>
      {/* Cross-link to other sub-pages */}
      <Card style={{ background: "#fff", marginTop: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Explore IC Markets</div>
        {otherTabs.map((t, i) => {
          const TabIcon = t.icon;
          const subMeta = CONTENT_MAP[t.id];
          return (
            <Link key={i} to={`/review/ic-markets/${t.id}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < otherTabs.length - 1 ? `1px solid ${BORDER}` : "none", textDecoration: "none", color: NAVY, fontSize: 13, fontWeight: 500 }} onMouseEnter={e => e.currentTarget.style.color = GREEN} onMouseLeave={e => e.currentTarget.style.color = NAVY}>
              <TabIcon size={14} color={GREEN} />{subMeta?.breadcrumb || t.label}
            </Link>
          );
        })}
      </Card>
    </>
  );
}

function RiskDisclaimer() {
  return (
    <div style={{ fontSize: 12, color: GRAY_MUTED, lineHeight: 1.6, marginTop: 24, padding: "14px 16px", background: "#fef3cd", border: "1px solid #fde68a", borderRadius: 8 }}>
      <strong>Risk Warning:</strong> CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. {B.riskWarning} You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════════ PAGE CONTENT FOR EACH SUB-PAGE ═══════════════ */
/* ═══════════════════════════════════════════════════════════ */

/* ──── 1. FEES ──── */
function FeesContent({ mob }) {
  return (<>
    <QuickAnswerBox text="IC Markets offers raw spreads from 0.0 pips on EUR/USD with $3.50 commission per lot per side. Standard account spreads start at 0.8 pips with no commission. No deposit fees, no withdrawal fees, no inactivity fee." score={9.6} />
    <ProsCons
      pros={["Raw spreads from 0.0 pips — among lowest in industry", "No deposit or withdrawal fees", "No inactivity fee", "Transparent commission: $3.50/lot/side (MT4/MT5)"]}
      cons={["$3.50/lot commission on Raw accounts", "No fixed spread option", "Bank wire withdrawals: $20 fee (non-AUD)", "Standard account spreads slightly wider than Pepperstone"]}
      mob={mob} />

    <H2 id="trading-fees">Trading Fees Overview</H2>
    <P>IC Markets offers two pricing models: a commission-free Standard account with all costs built into the spread, and Raw Spread accounts with near-zero spreads plus a small per-lot commission. Both models provide access to 2,250+ instruments.</P>
    <DataTable headers={["Account Type", "Spread", "Commission", "Min Deposit", "Best For"]} rows={[
      ["Standard", "0.8 pips", "None", "$200", "Beginners"],
      ["Raw Spread (MT4/MT5)", "0.0 pips", "$3.50/lot/side", "$200", "Scalpers, Day traders"],
      ["Raw Spread (cTrader)", "0.0 pips", "$3.00/lot/side", "$200", "Algo traders"],
    ]} mob={mob} />

    <H2 id="spread-comparison">Spread Comparison</H2>
    <P>We tested average spreads during the London/New York overlap session — the highest liquidity period. All figures are for Raw/ECN accounts in pips:</P>
    <DataTable headers={["Pair", "IC Markets", "Pepperstone", "FP Markets", "XM", "IG"]} rows={[
      ["EUR/USD", "0.02", "0.10", "0.05", "0.80", "0.60"],
      ["GBP/USD", "0.23", "0.30", "0.24", "1.30", "0.90"],
      ["USD/JPY", "0.05", "0.11", "0.09", "0.90", "0.70"],
      ["AUD/USD", "0.06", "0.10", "0.07", "0.90", "0.60"],
      ["EUR/GBP", "0.33", "0.40", "0.36", "1.50", "1.00"],
      ["Gold (XAU)", "0.05", "0.10", "0.08", "0.25", "0.30"],
    ]} highlightFirst mob={mob} />

    <CTAInline label="Compare IC Markets Fees" sub="Raw spreads from 0.0 pips" mob={mob} />

    <H2 id="commissions">Commission Structure</H2>
    <P>IC Markets charges a round-turn commission of $7.00 per standard lot on Raw Spread MT4/MT5 accounts, and $6.00 per lot on cTrader. No commission on Standard accounts — costs are embedded in wider spreads.</P>
    <Card>
      <div style={{ fontSize: 13, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Worked Example: 1 Lot EUR/USD Trade</div>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 14 }}>
        {[
          { l: "Raw Account", spread: "0.02 pips ($0.20)", comm: "$7.00", total: "$7.20", highlight: true },
          { l: "Standard Account", spread: "0.82 pips ($8.20)", comm: "$0", total: "$8.20" },
          { l: "Industry Average", spread: "0.40 pips ($4.00)", comm: "$5.00", total: "$9.00" },
        ].map((x, i) => (
          <div key={i} style={{ background: x.highlight ? GREEN_LIGHT : GRAY_LIGHT, border: `1px solid ${x.highlight ? GREEN_BORDER : BORDER}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: x.highlight ? GREEN : GRAY_MUTED, marginBottom: 8 }}>{x.l}</div>
            <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 4 }}>Spread: {x.spread}</div>
            <div style={{ fontSize: 12, color: GRAY_TEXT, marginBottom: 8 }}>Commission: {x.comm}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 800, color: x.highlight ? GREEN : NAVY }}>{x.total}</div>
            <div style={{ fontSize: 11, color: GRAY_MUTED }}>total cost/lot</div>
          </div>
        ))}
      </div>
    </Card>

    <H2 id="non-trading">Non-Trading Fees</H2>
    <DataTable headers={["Fee Type", "Amount", "Notes"]} rows={[
      ["Deposit Fee", "Free", "All methods"],
      ["Withdrawal Fee", "Free", "1 free/day; $20 bank wire (non-AUD)"],
      ["Inactivity Fee", "None", "No charges for dormant accounts"],
      ["Currency Conversion", "0.3%", "If account currency ≠ trade currency"],
      ["Overnight Swap", "Variable", "Standard rates; swap-free available"],
    ]} mob={mob} />

    <CTAInline label="Open IC Markets Account" sub="No hidden fees — verified by our team" mob={mob} />

    <H2 id="how-compares">How IC Markets Compares on Fees</H2>
    <P>IC Markets ranks among the cheapest brokers we've tested. Here's how it stacks up:</P>
    <Card>
      <ComparisonBar label="IC Markets" value={0.02} max={1.0} best unit="pips" />
      <ComparisonBar label="Pepperstone" value={0.10} max={1.0} unit="pips" />
      <ComparisonBar label="FP Markets" value={0.05} max={1.0} unit="pips" />
      <ComparisonBar label="XM" value={0.80} max={1.0} unit="pips" />
      <ComparisonBar label="Industry Average" value={0.40} max={1.0} unit="pips" />
      <div style={{ fontSize: 12, color: GRAY_MUTED, marginTop: 8 }}>Average EUR/USD spread on Raw/ECN accounts (London/NY session)</div>
    </Card>

    <FaqSection faqs={[
      { q: "What are IC Markets' spreads on EUR/USD?", a: "IC Markets' average EUR/USD spread is 0.02 pips on Raw Spread accounts and 0.82 pips on Standard accounts. These are among the lowest in the industry." },
      { q: "Does IC Markets charge deposit fees?", a: "No. IC Markets does not charge fees on any deposit method including cards, PayPal, Skrill, Neteller, and bank transfer." },
      { q: "Is IC Markets cheaper than Pepperstone?", a: "Yes, slightly. IC Markets' average EUR/USD spread (0.02 pips) is lower than Pepperstone's (0.10 pips). Commission rates are identical at $3.50/lot/side on MT4/MT5. IC Markets charges $3.00/lot/side on cTrader vs Pepperstone's $3.50." },
      { q: "Does IC Markets have hidden fees?", a: "No. IC Markets has no inactivity fee, no account maintenance fee, and no hidden charges. The only non-trading fee is a $20 charge for bank wire withdrawals in non-AUD currencies." },
    ]} mob={mob} />

    <VerdictBox title="IC Markets Fees Verdict" text="IC Markets offers some of the lowest trading costs in the industry. The Raw Spread account with $3.50 commission per lot is ideal for active traders seeking institutional-grade pricing. Standard accounts suit beginners with all-inclusive spreads. No hidden fees." bestFor="Active traders, scalpers, algo traders, high-volume traders" notFor="Traders wanting fixed spreads or zero-commission on raw accounts" mob={mob} />
  </>);
}

/* ──── 2. MINIMUM DEPOSIT ──── */
function MinDepositContent({ mob }) {
  return (<>
    <QuickAnswerBox text="IC Markets requires a minimum deposit of $200 for all account types (Standard, Raw Spread MT4/MT5, and Raw Spread cTrader). All deposits are free. IC Markets supports 10 base currencies." score={7.5} scoreLabel="Deposit" />
    <ProsCons
      pros={["All deposit methods are free", "Instant processing via cards and e-wallets", "10 base currencies supported", "Crypto deposits accepted (BTC, USDT)"]}
      cons={["$200 minimum — higher than Pepperstone ($0) or XM ($5)", "Bank transfer takes 1-3 business days", "No specific micro-account option", "Higher barrier to entry for beginners"]}
      mob={mob} />

    <H2>Minimum Deposit by Account Type</H2>
    <DataTable headers={["Account", "Min Deposit", "Spread", "Commission", "Base Currencies"]} rows={[
      ["Standard", "$200", "0.8 pips", "None", "10"],
      ["Raw Spread (MT4/MT5)", "$200", "0.0 pips", "$3.50/lot", "10"],
      ["Raw Spread (cTrader)", "$200", "0.0 pips", "$3.00/lot", "10"],
      ["Demo Account", "$0 (virtual)", "Same as live", "Same as live", "—"],
    ]} mob={mob} />
    <P>The $200 minimum deposit applies to all live account types. There is no difference in minimum deposit between Standard and Raw Spread accounts. Demo accounts are free with $100,000 in virtual funds.</P>

    <H2>Deposit Methods & Processing Times</H2>
    <DataTable headers={["Method", "Fee", "Processing", "Min Amount"]} rows={[
      ["Credit/Debit Card", "Free", "Instant", "$200"],
      ["Bank Transfer", "Free", "1-3 days", "$200"],
      ["PayPal", "Free", "Instant", "$200"],
      ["Skrill", "Free", "Instant", "$200"],
      ["Neteller", "Free", "Instant", "$200"],
      ["Crypto (BTC/USDT)", "Free", "10-60 min", "$200"],
    ]} mob={mob} />

    <CTAInline label="Open Account — $200 Min" sub="All deposit methods free" mob={mob} />

    <H2>How IC Markets Compares</H2>
    <Card>
      <div style={{ fontSize: 13, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Minimum Deposit Comparison</div>
      {[
        { name: "Pepperstone", dep: "$0", badge: "Lowest" },
        { name: "XM", dep: "$5" },
        { name: "Exness", dep: "$1" },
        { name: "IC Markets", dep: "$200", current: true },
        { name: "IG", dep: "$250" },
        { name: "Saxo Bank", dep: "$2,000" },
      ].map((b, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 5 ? `1px solid ${BORDER}` : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: b.current ? 700 : 500, color: b.current ? GREEN : NAVY }}>{b.name}</span>
            {b.badge && <span style={{ fontSize: 10, fontWeight: 700, color: GREEN, background: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}`, padding: "1px 6px", borderRadius: 4 }}>{b.badge}</span>}
            {b.current && <span style={{ fontSize: 10, fontWeight: 700, color: "#2563eb", background: "#eff6ff", border: "1px solid #93c5fd", padding: "1px 6px", borderRadius: 4 }}>THIS BROKER</span>}
          </div>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: NAVY }}>{b.dep}</span>
        </div>
      ))}
    </Card>

    <FaqSection faqs={[
      { q: "What is IC Markets' minimum deposit?", a: "$200 for all account types (Standard, Raw Spread MT4/MT5, Raw Spread cTrader)." },
      { q: "Can I start with $10 on IC Markets?", a: "No. The minimum is $200. For lower minimums, consider Exness ($1), XM ($5), or Pepperstone ($0)." },
      { q: "Does IC Markets charge deposit fees?", a: "No. All deposit methods are free including cards, PayPal, Skrill, Neteller, bank transfer, and crypto." },
    ]} mob={mob} />

    <VerdictBox title="IC Markets Deposit Verdict" text="IC Markets' $200 minimum deposit is higher than many competitors but reasonable for serious traders. All deposit methods are free with instant processing for cards and e-wallets. The 10 base currencies reduce conversion costs." bestFor="Traders with $200+ to invest" notFor="Absolute beginners wanting to start with $5-10" mob={mob} />
  </>);
}

/* ──── 3. PLATFORMS ──── */
function PlatformsContent({ mob }) {
  return (<>
    <QuickAnswerBox text="IC Markets supports 4 trading platforms: MetaTrader 4, MetaTrader 5, cTrader, and TradingView. All platforms are available on desktop, web, and mobile. Servers are hosted in Equinix NY4 and LD5 data centers." score={10} />
    <ProsCons
      pros={["4 platforms — more than most competitors", "TradingView integration (since 2023)", "Equinix NY4/LD5 servers for low latency", "Free VPS for $1,500+ equity clients"]}
      cons={["No proprietary platform", "cTrader mobile app less polished than MT4", "TradingView requires separate subscription for premium features", "Learning curve for beginners with 4 platform options"]}
      mob={mob} />

    <H2>Available Platforms</H2>
    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 20 }}>
      {[
        { name: "MetaTrader 4", desc: "Most popular — 30+ indicators, EA support, one-click trading", devices: "Desktop, Web, iOS, Android", best: "General trading, EAs" },
        { name: "MetaTrader 5", desc: "21 timeframes, built-in economic calendar, advanced strategy tester", devices: "Desktop, Web, iOS, Android", best: "Advanced analysis, algo" },
        { name: "cTrader", desc: "Level II pricing, iceberg/TWAP orders, C# automation", devices: "Desktop, Web, iOS, Android", best: "Scalpers, pro traders" },
        { name: "TradingView", desc: "Best-in-class charting, Pine Script, social features", devices: "Web, iOS, Android", best: "Chart analysis, ideas" },
      ].map((p, i) => (
        <Card key={i} style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <MonitorSmartphone size={20} color={GREEN} />
            <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{p.name}</div>
          </div>
          <div style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.6, marginBottom: 10 }}>{p.desc}</div>
          <div style={{ fontSize: 12, color: GRAY_MUTED, marginBottom: 4 }}><strong>Devices:</strong> {p.devices}</div>
          <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>Best for: {p.best}</div>
        </Card>
      ))}
    </div>

    <CTAInline label="Try IC Markets Platform Free" sub="Open a demo account in 2 minutes" mob={mob} />

    <H2>Platform Feature Matrix</H2>
    <DataTable headers={["Feature", "MT4", "MT5", "cTrader", "TradingView"]} rows={[
      ["Indicators", "30+", "38+", "65+", "100+"],
      ["Timeframes", "9", "21", "26", "Custom"],
      ["Order Types", "4", "6", "7", "6"],
      ["Algo Trading", "MQL4", "MQL5", "C#", "Pine Script"],
      ["Copy Trading", "Yes", "Yes", "Yes", "No"],
      ["Economic Calendar", "Plugin", "Built-in", "Yes", "Yes"],
      ["One-Click Trading", "Yes", "Yes", "Yes", "Yes"],
      ["Level II Pricing", "No", "Yes", "Yes", "No"],
      ["Price Alerts", "Yes", "Yes", "Yes", "Yes"],
      ["Mobile App Rating", "4.5/5", "4.4/5", "4.3/5", "4.8/5"],
    ]} mob={mob} />

    <H2>Mobile Trading</H2>
    <P>All four platforms offer mobile apps for iOS and Android with full trading functionality including order placement, charting, push notifications, and account management. The cTrader mobile app supports advanced order types like trailing stops and stop-limit orders. IC Social app enables mobile copy trading.</P>

    <CTAInline label="Download IC Markets App" sub="Trade on the go — all 4 platforms" mob={mob} />

    <FaqSection faqs={[
      { q: "What platforms does IC Markets support?", a: "IC Markets supports MetaTrader 4, MetaTrader 5, cTrader, and TradingView. All available on desktop, web, and mobile." },
      { q: "Does IC Markets support TradingView?", a: "Yes. IC Markets integrated TradingView in 2023, allowing direct order execution from TradingView's charting interface." },
      { q: "Which platform is best for beginners on IC Markets?", a: "MetaTrader 4 is the simplest to learn. For the best charting experience, TradingView is recommended." },
    ]} mob={mob} />

    <VerdictBox title="IC Markets Platforms Verdict" text="IC Markets scores a perfect 10/10 for platforms. Four trading platforms with Equinix server hosting is industry-leading. The TradingView integration is a standout feature that most competitors lack." bestFor="Traders wanting platform choice and flexibility" notFor="Beginners overwhelmed by multiple platform options" mob={mob} />
  </>);
}

/* ──── 4. REGULATION ──── */
function RegulationContent({ mob }) {
  return (<>
    <QuickAnswerBox text="IC Markets is regulated by ASIC (Australia) and CySEC (Cyprus) — both Tier-1 authorities. A third entity operates under FSA (Seychelles). Client funds are segregated at Westpac and NAB banks. No major regulatory incidents since 2007." score={9.6} />
    <ProsCons
      pros={["Dual Tier-1 regulation (ASIC + CySEC)", "Client funds fully segregated at AA-rated banks", "Negative balance protection for retail clients", "Clean regulatory track record since 2007"]}
      cons={["FSA Seychelles entity has weaker protections", "No FCA (UK) regulation", "UK clients onboarded under Seychelles entity", "No FDIC/SIPC-type insurance"]}
      mob={mob} />

    <H2>Regulatory Licenses</H2>
    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
      {REGS.map((r, i) => {
        const color = r.tier === 1 ? GREEN : r.tier === 2 ? ORANGE : GRAY_MUTED;
        const bg = r.tier === 1 ? GREEN_LIGHT : r.tier === 2 ? "#fffbeb" : GRAY_LIGHT;
        const borderColor = r.tier === 1 ? GREEN_BORDER : r.tier === 2 ? "#fde68a" : BORDER;
        return (
          <Card key={i} style={{ background: bg, border: `1px solid ${borderColor}`, textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Tier {r.tier}</div>
            <RegBadge reg={r.name} />
            <div style={{ fontSize: 18, fontWeight: 800, color: NAVY, marginTop: 8, fontFamily: "Outfit" }}>{r.name}</div>
            <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 4 }}>{r.country}</div>
            <div style={{ fontSize: 12, color: GRAY_MUTED, marginTop: 8, fontFamily: "'JetBrains Mono',monospace" }}>License: {r.num}</div>
            <div style={{ fontSize: 12, color: GRAY_MUTED, marginTop: 4 }}>Protection: {r.tier === 1 && r.name === "CySEC" ? "€20,000 (ICF)" : r.tier === 1 ? "None (AU)" : "None"}</div>
          </Card>
        );
      })}
    </div>

    <CTAInline label="Trade with Regulated Broker" sub="ASIC + CySEC dual Tier-1 regulation" mob={mob} />

    <H2>Client Money Protection</H2>
    <DataTable headers={["Protection Feature", "ASIC Entity", "CySEC Entity", "FSA Entity"]} rows={[
      ["Segregated Funds", "Yes", "Yes", "Yes"],
      ["Negative Balance Protection", "Yes", "Yes", "Yes"],
      ["Investor Compensation", "None", "€20,000", "None"],
      ["Max Leverage (Retail)", "1:30", "1:30", "1:1000"],
      ["Banks Used", "Westpac, NAB", "European banks", "Not disclosed"],
    ]} mob={mob} />

    <H2>Company Background</H2>
    <P>IC Markets was founded in 2007 in Sydney, Australia by Andrew Budzinski. The broker is privately held and processes over $1 trillion in monthly trading volume. With 200,000+ active clients across 200+ countries, IC Markets is one of the world's largest forex brokers by daily volume.</P>

    <H2>Track Record</H2>
    <P>IC Markets has maintained a clean regulatory record since founding in 2007. No material fines, sanctions, or enforcement actions from any of its regulators. Trustpilot rating: 4.8/5 from 52,000+ reviews. The broker has been awarded "Best ECN Broker" and "Best Forex Broker" by multiple industry publications.</P>

    <FaqSection faqs={[
      { q: "Is IC Markets regulated?", a: "Yes. IC Markets is regulated by ASIC (Australia, license 335692), CySEC (Cyprus, license 362/18), and FSA (Seychelles, license SD018). ASIC and CySEC are Tier-1 regulators." },
      { q: "Is IC Markets safe for my money?", a: "Yes. Client funds are held in segregated trust accounts at AA-rated Australian banks (Westpac and NAB). Negative balance protection is provided for all retail clients. CySEC entity offers additional €20,000 investor compensation." },
      { q: "Which IC Markets entity should I choose?", a: "If available, choose the ASIC (Australia) or CySEC (Cyprus) entity for maximum regulatory protection. The Seychelles entity has weaker oversight but offers higher leverage (up to 1:1000)." },
      { q: "Has IC Markets ever been fined?", a: "No. IC Markets has maintained a clean regulatory record since 2007 with no material fines or enforcement actions." },
    ]} mob={mob} />

    <VerdictBox title="IC Markets Regulation Verdict" text="IC Markets scores 9.6/10 for regulation — one of the highest in our database. Dual Tier-1 regulation (ASIC + CySEC) with fully segregated funds provides strong protection. The Seychelles entity is the only weak point." bestFor="Safety-conscious traders" notFor="UK traders wanting FCA protection" mob={mob} />
  </>);
}

/* ──── 5. DEPOSIT & WITHDRAWAL ──── */
function DepositContent({ mob }) {
  return (<>
    <QuickAnswerBox text="IC Markets supports 6+ deposit methods, all free. Card and e-wallet deposits are instant. Withdrawals are processed within 1-2 business days. One free withdrawal per day. Bank wire: $20 fee for non-AUD." score={9.0} />
    <ProsCons
      pros={["All deposits free — no exceptions", "Instant processing via cards and e-wallets", "Crypto deposits accepted (BTC, USDT)", "One free withdrawal per day"]}
      cons={["$200 minimum for all methods", "$20 fee for bank wire withdrawals (non-AUD)", "No Apple Pay or Google Pay", "Bank transfers take 1-3 business days"]}
      mob={mob} />

    <H2>Deposit Methods</H2>
    <DataTable headers={["Method", "Fee", "Processing", "Min", "Max"]} rows={[
      ["Visa / Mastercard", "Free", "Instant", "$200", "Unlimited"],
      ["Bank Transfer", "Free", "1-3 days", "$200", "Unlimited"],
      ["PayPal", "Free", "Instant", "$200", "$10,000/txn"],
      ["Skrill", "Free", "Instant", "$200", "$10,000/txn"],
      ["Neteller", "Free", "Instant", "$200", "$10,000/txn"],
      ["BTC / USDT", "Free", "10-60 min", "$200", "Unlimited"],
    ]} mob={mob} />

    <H2>How to Deposit — Step by Step</H2>
    <Card>
      {[
        { step: 1, title: "Log into your IC Markets Client Area", desc: "Visit secure.icmarkets.com and enter your credentials" },
        { step: 2, title: "Navigate to 'Fund Your Account'", desc: "Click the green 'Deposit' button in the dashboard" },
        { step: 3, title: "Select your deposit method", desc: "Choose from cards, bank transfer, e-wallets, or crypto" },
        { step: 4, title: "Enter amount and confirm", desc: "Minimum $200. Select your trading account to fund" },
        { step: 5, title: "Complete payment", desc: "Follow the payment provider's instructions. Funds appear instantly for cards/e-wallets" },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < 4 ? `1px solid ${BORDER}` : "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14, color: GREEN }}>{s.step}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: NAVY, marginBottom: 2 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: GRAY_MUTED }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </Card>

    <CTAInline label="Open Account & Deposit" sub="All methods free · Instant processing" mob={mob} />

    <H2>Withdrawal Methods</H2>
    <DataTable headers={["Method", "Fee", "Processing", "Min Withdrawal"]} rows={[
      ["Visa / Mastercard", "Free", "1-2 days", "$50"],
      ["Bank Transfer", "$20 (non-AUD)", "2-5 days", "$200"],
      ["PayPal", "Free", "Same day", "$50"],
      ["Skrill", "Free", "Same day", "$50"],
      ["Neteller", "Free", "Same day", "$50"],
    ]} mob={mob} />
    <P>In our testing, PayPal withdrawals were processed within 4 hours. One withdrawal per day is free — additional same-day withdrawals may incur a small processing fee.</P>

    <FaqSection faqs={[
      { q: "Does IC Markets charge deposit fees?", a: "No. All deposit methods are free including cards, bank transfer, PayPal, Skrill, Neteller, and cryptocurrency." },
      { q: "How long does IC Markets withdrawal take?", a: "E-wallets (PayPal, Skrill, Neteller): same day. Cards: 1-2 business days. Bank transfer: 2-5 business days." },
      { q: "What is the minimum withdrawal?", a: "$50 for cards and e-wallets, $200 for bank transfer." },
    ]} mob={mob} />

    <VerdictBox title="IC Markets Deposit & Withdrawal Verdict" text="IC Markets offers free, fast deposits with 6+ methods. Withdrawal processing is competitive. The $20 bank wire fee for non-AUD is the only notable charge." bestFor="Traders wanting free, instant deposits" notFor="Those needing Apple Pay / Google Pay" mob={mob} />
  </>);
}

/* ──── 6. BEGINNERS ──── */
function BeginnersContent({ mob }) {
  const criteria = [
    { name: "Ease of Account Opening", score: 8, detail: "15-minute process, approved in 1 day" },
    { name: "Platform Usability", score: 7, detail: "4 platforms can be overwhelming; MT4 is beginner-friendly" },
    { name: "Educational Resources", score: 5, detail: "Basic tutorials, limited structured courses" },
    { name: "Demo Account", score: 9, detail: "$100K virtual funds, 30-day renewable" },
    { name: "Minimum Deposit", score: 5, detail: "$200 — higher barrier than Pepperstone ($0) or XM ($5)" },
    { name: "Fee Transparency", score: 9, detail: "Clear fee schedule, no hidden costs" },
    { name: "Customer Support", score: 7, detail: "24/7 but 10-15 min wait during peak" },
    { name: "Risk Management Tools", score: 8, detail: "Stop-loss, NBP, margin call alerts" },
  ];
  const avgScore = (criteria.reduce((a, c) => a + c.score, 0) / criteria.length).toFixed(1);

  return (<>
    <QuickAnswerBox text={`IC Markets scores ${avgScore}/10 for beginner-friendliness. While it offers excellent execution and tight spreads, the $200 minimum deposit and limited educational resources make it more suited for intermediate to advanced traders. Beginners should consider starting with a demo account.`} score={parseFloat(avgScore)} />
    <ProsCons
      pros={["Free demo account with $100K virtual funds", "MT4 is straightforward for beginners", "No inactivity fee — take your time learning", "Negative balance protection for all retail accounts"]}
      cons={["$200 minimum deposit — high for beginners", "Limited educational content vs IG or XM", "4 platform options may overwhelm new traders", "No dedicated beginner tutorial pathway"]}
      mob={mob} />

    <H2>Beginner-Friendliness Rating</H2>
    <Card>
      {criteria.map((c, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{c.name}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: c.score >= 8 ? GREEN : c.score >= 6 ? ORANGE : RED }}>{c.score}/10</span>
          </div>
          <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
            <div style={{ height: "100%", width: `${c.score * 10}%`, background: c.score >= 8 ? `linear-gradient(90deg, ${GREEN}, #34d399)` : c.score >= 6 ? `linear-gradient(90deg, ${ORANGE}, #fbbf24)` : `linear-gradient(90deg, ${RED}, #f87171)`, borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 12, color: GRAY_MUTED }}>{c.detail}</div>
        </div>
      ))}
      <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 14, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 800, color: NAVY }}>Overall Beginner Score</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 800, color: parseFloat(avgScore) >= 8 ? GREEN : ORANGE }}>{avgScore}/10</span>
      </div>
    </Card>

    <CTAInline label="Open Demo Account Free" sub="$100K virtual funds — no deposit required" mob={mob} />

    <H2>Demo Account</H2>
    <P>IC Markets offers a free demo account with $100,000 in virtual funds. The demo mirrors live market conditions including real-time pricing and spreads. Demo accounts are valid for 30 days but can be renewed by contacting support. All four platforms are available in demo mode.</P>

    <H2>Education & Learning Resources</H2>
    <P>IC Markets provides basic educational content: trading tutorials, a forex glossary, webinars, and blog articles. However, the content lacks the structured learning pathways found at IG (IG Academy), XM (XM Learning), or AvaTrade (SharpTrader). For beginners, we recommend supplementing with external resources like BabyPips or Investopedia.</P>

    <H2>Better Alternatives for Beginners</H2>
    <P>If you're a complete beginner, these brokers may be better suited:</P>
    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
      {[
        { name: "XM", score: 9.2, why: "$5 min deposit, excellent education hub, structured courses", slug: "xm" },
        { name: "Pepperstone", score: 9.0, why: "$0 min deposit, clean UI, TradingView integration", slug: "pepperstone" },
        { name: "AvaTrade", score: 8.5, why: "SharpTrader academy, AvaProtect risk tool, copy trading", slug: "avatrade" },
      ].map((alt, i) => (
        <Card key={i} style={{ padding: 18, textAlign: "center" }}>
          <BrokerLogo slug={alt.slug} name={alt.name} fallback={alt.name.slice(0, 2)} size={48} shape="icon" borderRadius={10} />
          <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginTop: 8 }}>{alt.name}</div>
          <div style={{ fontSize: 12, color: GREEN, fontWeight: 600, marginBottom: 8 }}>Score: {alt.score}/10</div>
          <div style={{ fontSize: 13, color: GRAY_TEXT, lineHeight: 1.5, marginBottom: 12 }}>{alt.why}</div>
          <a href={`${import.meta.env.VITE_API_URL || ''}/go/${alt.slug}`} target="_blank" rel="nofollow sponsored" className="cta-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, color: NAVY, fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "10px 20px", borderRadius: 8 }}>Visit {alt.name} <ExternalLink size={12} /></a>
        </Card>
      ))}
    </div>

    <FaqSection faqs={[
      { q: "Is IC Markets good for beginners?", a: `IC Markets scores ${avgScore}/10 for beginners. It's excellent for execution but limited in education and has a $200 minimum deposit. Best for beginners with some trading knowledge.` },
      { q: "Does IC Markets offer a demo account?", a: "Yes. Free demo with $100,000 virtual funds, renewable for 30 days. Available on all 4 platforms." },
      { q: "What platform should a beginner use on IC Markets?", a: "MetaTrader 4 for simplicity. TradingView for the best charting experience. Both are beginner-friendly." },
      { q: "What is the minimum to start on IC Markets?", a: "$200 for live accounts. Demo accounts are free with no deposit required." },
    ]} mob={mob} />

    <VerdictBox title="IC Markets for Beginners — Verdict" text={`IC Markets is an excellent broker overall but scores ${avgScore}/10 for beginner-friendliness. The limited education and $200 minimum deposit create barriers. However, the free demo account and transparent fees make it workable for motivated beginners.`} bestFor="Beginners with $200+ who value low costs over education" notFor="Complete beginners wanting structured learning" mob={mob} />
  </>);
}

/* ──── 7. ALTERNATIVES ──── */
function AlternativesContent({ mob }) {
  const alternatives = [
    { name: "Pepperstone", score: 9.5, spread: "0.0", minDep: "$0", platforms: 4, tier1: 3, why: "Same ECN quality with $0 minimum deposit and FCA regulation. Better for UK traders and beginners.", slug: "pepperstone", bestFor: "Beginners, UK traders" },
    { name: "FP Markets", score: 9.4, spread: "0.0", minDep: "$100", platforms: 4, tier1: 2, why: "Similar ECN execution with IRESS platform for stock trading. Lower commission on some pairs.", slug: "fp-markets", bestFor: "Stock + forex traders" },
    { name: "Exness", score: 9.1, spread: "0.0", minDep: "$1", platforms: 3, tier1: 2, why: "Ultra-low minimum deposit, unlimited leverage on some accounts, instant withdrawals 24/7.", slug: "exness", bestFor: "High leverage traders" },
    { name: "XM", score: 9.0, spread: "0.1", minDep: "$5", platforms: 2, tier1: 2, why: "Best educational content in the industry, $5 minimum deposit, loyalty program with cashback.", slug: "xm", bestFor: "Beginners, education-focused" },
    { name: "Tickmill", score: 8.7, spread: "0.0", minDep: "$100", platforms: 2, tier1: 2, why: "FCA-regulated with competitive raw spreads. Lower commissions at $4/lot round-turn.", slug: "tickmill", bestFor: "FCA regulation + low costs" },
  ];

  return (<>
    <QuickAnswerBox text={`The best alternatives to IC Markets are Pepperstone (same ECN quality, $0 minimum), FP Markets (similar execution, stock trading), and Exness ($1 minimum, unlimited leverage). All offer competitive raw spreads.`} score={null} />

    <H2>Quick Comparison</H2>
    <DataTable headers={["Broker", "Score", "Spread", "Min Dep", "Platforms", "Tier-1"]} rows={[
      ["IC Markets", "9.6", "0.0 pips", "$200", "4", "2"],
      ...alternatives.map(a => [a.name, String(a.score), `${a.spread} pips`, a.minDep, String(a.platforms), String(a.tier1)])
    ]} highlightFirst mob={mob} />

    <H2>Why Look for IC Markets Alternatives?</H2>
    <P>IC Markets is our top-rated broker, but it's not perfect for everyone. Common reasons to consider alternatives: $200 minimum deposit is too high, you need FCA (UK) regulation, you want better educational resources, or you prefer a proprietary platform.</P>

    <H2>Top Alternatives</H2>
    {alternatives.map((alt, i) => (
      <Card key={i} style={{ padding: mob ? 18 : 22, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: mob ? "flex-start" : "center", gap: 14, marginBottom: 12, flexDirection: mob ? "column" : "row" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
            <BrokerLogo slug={alt.slug} name={alt.name} fallback={alt.name.slice(0, 2)} size={44} shape="icon" borderRadius={10} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, fontFamily: "Outfit" }}>{alt.name}</div>
              <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>Best for: {alt.bestFor}</div>
            </div>
          </div>
          <ScoreBadge score={alt.score} size="md" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14, background: GRAY_LIGHT, borderRadius: 8, padding: 12 }}>
          {[
            { l: "Spread", v: `${alt.spread} pips` },
            { l: "Min Deposit", v: alt.minDep },
            { l: "Platforms", v: alt.platforms },
            { l: "Tier-1 Regs", v: alt.tier1 },
          ].map((s, j) => (
            <div key={j} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: GRAY_MUTED, fontWeight: 600, marginBottom: 2 }}>{s.l}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: NAVY }}>{s.v}</div>
            </div>
          ))}
        </div>
        <P>{alt.why}</P>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href={`${import.meta.env.VITE_API_URL || ''}/go/${alt.slug}`} target="_blank" rel="nofollow sponsored" className="cta-primary" style={{ background: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, color: NAVY, fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "10px 20px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>Visit {alt.name} <ExternalLink size={12} /></a>
          <Link to={`/review/${alt.slug}`} className="cta-secondary" style={{ background: "#fff", color: GREEN, border: `2px solid ${GREEN}`, fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "8px 16px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>Read Review <ArrowRight size={12} /></Link>
        </div>
      </Card>
    ))}

    <H2>Which Alternative Is Best For You?</H2>
    <Card style={{ background: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}` }}>
      {[
        { q: "Lowest cost trading?", a: "Pepperstone — same 0.0 pip spreads, $0 minimum" },
        { q: "Best for beginners?", a: "XM — $5 minimum, structured education, loyalty program" },
        { q: "Lowest minimum deposit?", a: "Exness — $1 minimum, instant withdrawals" },
        { q: "Best for UK traders?", a: "Pepperstone — FCA-regulated with similar ECN quality" },
        { q: "Best for stock trading?", a: "FP Markets — IRESS platform for real stock access" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, padding: "10px 0", borderBottom: i < 4 ? `1px solid ${GREEN_BORDER}` : "none" }}>
          <HelpCircle size={16} color={GREEN} style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600, color: NAVY }}>{item.q}</span>
            <span style={{ color: GRAY_TEXT }}> → {item.a}</span>
          </div>
        </div>
      ))}
    </Card>

    <FaqSection faqs={[
      { q: "What is the best alternative to IC Markets?", a: "Pepperstone is the closest alternative — same ECN execution, 0.0 pip spreads, but with $0 minimum deposit and FCA regulation." },
      { q: "Is Pepperstone better than IC Markets?", a: "For UK traders and beginners, yes (FCA regulation, $0 minimum). For pure execution cost, IC Markets has a slight edge (0.02 vs 0.10 avg spread on EUR/USD)." },
      { q: "Which broker has lower fees than IC Markets?", a: "Very few. IC Markets has among the lowest fees in the industry. Tickmill charges slightly less commission ($4/lot round-turn vs $7), but spreads are slightly wider." },
    ]} mob={mob} />

    <VerdictBox title="IC Markets Alternatives — Verdict" text="IC Markets is our top-rated broker, but alternatives like Pepperstone (for UK traders), XM (for beginners), and Exness (for low deposits) serve specific needs better. Choose based on your priorities: cost, regulation, education, or minimum deposit." bestFor="Comparing specific features head-to-head" notFor="Those already satisfied with IC Markets" mob={mob} />
  </>);
}

/* ──── 8. ACCOUNT OPENING ──── */
function AccountOpeningContent({ mob }) {
  return (<>
    <QuickAnswerBox text="Opening an IC Markets account takes 10-15 minutes online. You'll need a valid ID (passport or driver's license) and proof of address (utility bill or bank statement). Accounts are typically approved within 1 business day." score={8.5} />
    <ProsCons
      pros={["Fully online registration — no paperwork", "Approved within 1 business day", "Demo account available immediately", "Islamic (swap-free) accounts available on request"]}
      cons={["$200 minimum deposit required", "Verification documents mandatory (ID + proof of address)", "Peak-hour support delays for verification issues", "Seychelles entity used for some countries (less protection)"]}
      mob={mob} />

    <H2>Account Types</H2>
    <DataTable headers={["Account", "Min Deposit", "Spread", "Commission", "Demo?", "Best For"]} rows={[
      ["Standard", "$200", "0.8 pips", "None", "Yes", "Beginners"],
      ["Raw (MT4/MT5)", "$200", "0.0 pips", "$3.50/lot", "Yes", "Active traders"],
      ["Raw (cTrader)", "$200", "0.0 pips", "$3.00/lot", "Yes", "Algo traders"],
      ["Islamic", "$200", "Varies", "Varies", "Yes", "Swap-free trading"],
      ["Demo", "Free", "Same as live", "Same", "—", "Practice"],
    ]} mob={mob} />

    {/* Account type CTA cards — Barbara: visual card per account type, Bill: max CTA density */}
    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 24 }}>
      {[
        { name: "Raw Spread (MT4/MT5)", icon: Zap, spread: "0.0 pips", commission: "$3.50/lot", bestFor: "Scalpers & Day Traders", tag: "MOST POPULAR", tagBg: ORANGE, tagColor: NAVY, accent: ORANGE, ctaClass: "cta-orange", ctaBg: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, ctaColor: NAVY },
        { name: "Standard Account", icon: BookOpen, spread: "0.8 pips", commission: "None", bestFor: "Beginners", tag: "NO COMMISSION", tagBg: GREEN, tagColor: "#fff", accent: GREEN, ctaClass: "cta-secondary", ctaBg: "#fff", ctaColor: GREEN, ctaBorder: `2px solid ${GREEN}` },
        { name: "Raw Spread (cTrader)", icon: MonitorSmartphone, spread: "0.0 pips", commission: "$3.00/lot", bestFor: "Algo & API Traders", tag: "LOWEST COMMISSION", tagBg: "#6366f1", tagColor: "#fff", accent: "#6366f1", ctaClass: "cta-secondary", ctaBg: "#fff", ctaColor: "#6366f1", ctaBorder: "2px solid #6366f1" },
        { name: "Islamic Account", icon: Shield, spread: "Varies", commission: "Varies", bestFor: "Swap-Free Trading", tag: "SWAP-FREE", tagBg: "#0891b2", tagColor: "#fff", accent: "#0891b2", ctaClass: "cta-secondary", ctaBg: "#fff", ctaColor: "#0891b2", ctaBorder: "2px solid #0891b2" },
      ].map((acc, i) => (
        <div key={i} style={{
          background: "#fff", borderRadius: 12, border: `1px solid ${BORDER}`,
          overflow: "hidden", display: "flex", flexDirection: "column",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          {/* Tag ribbon */}
          <div style={{ background: acc.tagBg, color: acc.tagColor, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textAlign: "center", padding: "5px 0" }}>
            {acc.tag}
          </div>
          {/* Card body */}
          <div style={{ padding: mob ? "14px 14px 16px" : "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${acc.accent}12`, border: `1.5px solid ${acc.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <acc.icon size={19} color={acc.accent} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, lineHeight: 1.25 }}>{acc.name}</div>
            </div>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <div style={{ background: GRAY_LIGHT, borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: "0.04em" }}>Spread</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: NAVY, fontFamily: "'JetBrains Mono',monospace" }}>{acc.spread}</div>
              </div>
              <div style={{ background: GRAY_LIGHT, borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: "0.04em" }}>Commission</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: NAVY, fontFamily: "'JetBrains Mono',monospace" }}>{acc.commission}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: GRAY_MUTED, marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
              <Target size={12} color={acc.accent} /> Best for: <span style={{ fontWeight: 600, color: GRAY_TEXT }}>{acc.bestFor}</span>
            </div>
            {/* CTA */}
            <a href={`${import.meta.env.VITE_API_URL || ''}/go/ic-markets`} target="_blank" rel="nofollow sponsored" className={acc.ctaClass} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "11px 16px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700,
              background: acc.ctaBg, color: acc.ctaColor, border: acc.ctaBorder || "none",
              marginTop: "auto",
            }}>
              Open {acc.name.split(" (")[0]} <ExternalLink size={12} />
            </a>
          </div>
        </div>
      ))}
    </div>

    {/* Demo account — low commitment, prominent */}
    <div style={{
      background: `linear-gradient(135deg, ${NAVY}, #1e293b)`, borderRadius: 12, padding: mob ? "16px" : "18px 22px",
      display: "flex", flexDirection: mob ? "column" : "row", alignItems: mob ? "stretch" : "center",
      gap: mob ? 12 : 20, marginBottom: 24,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ background: "rgba(52,211,153,0.15)", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MonitorSmartphone size={16} color="#34d399" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Free Demo Account</span>
          <span style={{ fontSize: 10, fontWeight: 700, background: "#34d399", color: NAVY, padding: "2px 7px", borderRadius: 4 }}>NO RISK</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
          $100,000 virtual funds · All 4 platforms · Real market conditions · No ID required
        </div>
      </div>
      <a href={`${import.meta.env.VITE_API_URL || ''}/go/ic-markets`} target="_blank" rel="nofollow sponsored" className="cta-secondary" style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700,
        background: "transparent", border: "2px solid #34d399", color: "#34d399",
        whiteSpace: "nowrap",
      }}>
        Try Free Demo <ExternalLink size={13} />
      </a>
    </div>

    <H2>What You Need</H2>
    <Card>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14 }}>
        {[
          { icon: FileText, label: "Valid ID", desc: "Passport, driver's license, or national ID card (color photo)" },
          { icon: Globe, label: "Proof of Address", desc: "Utility bill, bank statement, or government letter (within 3 months)" },
          { icon: Smartphone, label: "Email & Phone", desc: "Valid email address and mobile phone for verification" },
          { icon: Clock, label: "15 minutes", desc: "Total time to complete registration and upload documents" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><r.icon size={18} color={GREEN} /></div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{r.label}</div>
              <div style={{ fontSize: 13, color: GRAY_MUTED }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>

    <CTAInline label="Start Registration" sub="15-minute process · Approved within 1 day" mob={mob} />

    <H2>Step-by-Step Account Opening Guide</H2>
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, padding: mob ? "0" : "0 10px", position: "relative" }}>
        {/* Connecting line */}
        <div style={{ position: "absolute", top: 14, left: mob ? 14 : 24, right: mob ? 14 : 24, height: 2, background: GREEN_BORDER, zIndex: 0 }} />
        {[1, 2, 3, 4, 5, 6, 7].map(s => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 1 }}>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: GREEN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, boxShadow: "0 0 0 3px #fff" }}>{s}</div>
            {!mob && <div style={{ fontSize: 10, color: GRAY_MUTED, textAlign: "center", maxWidth: 65, fontWeight: 500, lineHeight: 1.2 }}>{["Register", "Personal Details", "Account Type", "Platform", "Assessment", "Verify ID", "Fund"][s - 1]}</div>}
          </div>
        ))}
      </div>

      {[
        { step: 1, title: "Visit IC Markets Registration Page", desc: "Go to icmarkets.com and click 'Start Trading' or 'Open Account'. Select your country of residence." },
        { step: 2, title: "Enter Personal Details", desc: "Full name, date of birth, email address, phone number, and residential address. Must match your ID documents." },
        { step: 3, title: "Choose Account Type", desc: "Select Standard (simpler pricing) or Raw Spread (tighter spreads + commission). You can open multiple accounts later." },
        { step: 4, title: "Select Platform & Base Currency", desc: "Choose MT4, MT5, or cTrader. Select from 10 base currencies (USD, EUR, GBP, AUD recommended to avoid conversion fees)." },
        { step: 5, title: "Complete Financial Questionnaire", desc: "Answer questions about employment, income, trading experience, and risk tolerance. This is a regulatory requirement — answer honestly." },
        { step: 6, title: "Upload Verification Documents", desc: "Upload color photos of your ID (passport or driver's license) and proof of address (utility bill within 3 months). Clear, unobstructed photos required." },
        { step: 7, title: "Fund Your Account", desc: "Deposit a minimum of $200 via card, bank transfer, PayPal, Skrill, Neteller, or crypto. Card/e-wallet deposits are instant." },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: i < 6 ? `1px solid ${BORDER}` : "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: GREEN_LIGHT, border: `2px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 15, color: GREEN }}>{s.step}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </Card>

    <CTAInline label="Open IC Markets Account" sub="Takes 15 minutes · Start trading today" mob={mob} />

    <H2>Verification Process</H2>
    <P>IC Markets typically verifies documents within 1 business day. During peak periods it may take up to 2 days. Common reasons for rejection: blurry photos, expired documents, or address mismatch. If rejected, you'll receive an email with specific instructions on how to resubmit.</P>

    <H2>Demo Account — Quick Start</H2>
    <P>Don't want to commit yet? Open a free demo account in under 2 minutes — no ID required, no deposit needed. You get $100,000 in virtual funds to practice on all four platforms with real market conditions.</P>

    {/* Demo CTA — reinforce after copy section */}
    <a href={`${import.meta.env.VITE_API_URL || ''}/go/ic-markets`} target="_blank" rel="nofollow sponsored" className="cta-secondary" style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      padding: "14px 20px", background: GREEN_LIGHT, border: `2px solid ${GREEN}`,
      borderRadius: 10, textDecoration: "none", color: GREEN, fontSize: 14, fontWeight: 700,
      marginBottom: 20,
    }}>
      <MonitorSmartphone size={16} /> Open Free Demo — $100K Virtual Funds <ExternalLink size={13} />
    </a>

    <H2>How IC Markets Compares</H2>
    <DataTable headers={["Broker", "Registration Time", "Documents", "Approval", "Min Deposit"]} rows={[
      ["IC Markets", "~15 min", "ID + Address", "1 day", "$200"],
      ["Pepperstone", "~10 min", "ID + Address", "Same day", "$0"],
      ["XM", "~5 min", "ID + Address", "Same day", "$5"],
      ["Exness", "~5 min", "ID only", "Instant", "$1"],
    ]} mob={mob} />

    <FaqSection faqs={[
      { q: "How long does it take to open an IC Markets account?", a: "Registration takes about 15 minutes. Account verification and approval typically takes 1 business day." },
      { q: "What documents do I need?", a: "A valid photo ID (passport, driver's license, or national ID) and proof of address (utility bill or bank statement dated within 3 months)." },
      { q: "Can I open an IC Markets account from my country?", a: "IC Markets accepts clients from 200+ countries. Notable exceptions: USA, Canada, Israel, Iran, and North Korea." },
      { q: "Does IC Markets offer a demo account?", a: "Yes. Free demo with $100,000 virtual funds. No ID or deposit required. Available on all 4 platforms." },
      { q: "How do I verify my IC Markets account?", a: "Upload color photos of your ID and proof of address in the Client Area. Approval takes 1 business day." },
    ]} mob={mob} />

    <VerdictBox title="IC Markets Account Opening — Verdict" text="Opening an IC Markets account is straightforward — fully online, 15-minute process, and 1-day approval. The $200 minimum deposit is the main barrier. We recommend starting with a free demo account to test the platform before committing funds." bestFor="Traders ready to start with $200+" notFor="Those wanting instant verification and $0 deposit" mob={mob} />
  </>);
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════════════ MAIN PROTOTYPE PAGE ═══════════════════ */
/* ═══════════════════════════════════════════════════════════ */

const CONTENT_MAP = {
  "fees": { Component: FeesContent, h1: "IC Markets Fees & Spreads 2026", breadcrumb: "Fees & Spreads" },
  "min-deposit": { Component: MinDepositContent, h1: "IC Markets Minimum Deposit 2026", breadcrumb: "Minimum Deposit" },
  "platforms": { Component: PlatformsContent, h1: "IC Markets Trading Platforms 2026", breadcrumb: "Platforms" },
  "regulation": { Component: RegulationContent, h1: "IC Markets Regulation & Safety 2026", breadcrumb: "Regulation" },
  "deposit": { Component: DepositContent, h1: "IC Markets Deposit & Withdrawal 2026", breadcrumb: "Deposit & Withdrawal" },
  "beginners": { Component: BeginnersContent, h1: "Is IC Markets Good for Beginners?", breadcrumb: "For Beginners" },
  "alternatives": { Component: AlternativesContent, h1: "Best IC Markets Alternatives 2026", breadcrumb: "Alternatives" },
  "account": { Component: AccountOpeningContent, h1: "How to Open an IC Markets Account", breadcrumb: "Account Opening" },
};

export default function SubPagesProto() {
  const { mob, tab, desk } = useMedia();
  const [activeTab, setActiveTab] = useState("fees");
  const [stickyVisible, setStickyVisible] = useState(false);
  const current = CONTENT_MAP[activeTab];
  const ContentComponent = current.Component;

  useEffect(() => {
    const fn = () => setStickyVisible(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [activeTab]);

  /* FAQPage JSON-LD schema for SEO (Bill) */
  useEffect(() => {
    const faqMap = {
      fees: [
        { q: "What are IC Markets' spreads on EUR/USD?", a: "IC Markets' average EUR/USD spread is 0.02 pips on Raw Spread accounts and 0.82 pips on Standard accounts." },
        { q: "Does IC Markets charge deposit fees?", a: "No. IC Markets does not charge fees on any deposit method." },
      ],
      platforms: [
        { q: "What platforms does IC Markets support?", a: "IC Markets supports MetaTrader 4, MetaTrader 5, cTrader, and TradingView." },
        { q: "Does IC Markets support TradingView?", a: "Yes. IC Markets integrated TradingView in 2023." },
      ],
      regulation: [
        { q: "Is IC Markets regulated?", a: "Yes. IC Markets is regulated by ASIC (Australia) and CySEC (Cyprus) — both Tier-1 regulators." },
        { q: "Is IC Markets safe for my money?", a: "Yes. Client funds are held in segregated trust accounts at AA-rated Australian banks." },
      ],
    };
    const faqs = faqMap[activeTab];
    if (!faqs) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-schema";
    script.textContent = JSON.stringify(schema);
    const old = document.getElementById("faq-schema");
    if (old) old.remove();
    document.head.appendChild(script);
    return () => { const el = document.getElementById("faq-schema"); if (el) el.remove(); };
  }, [activeTab]);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  const visitUrl = `${import.meta.env.VITE_API_URL || ''}/go/ic-markets`;

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: GRAY_LIGHT, minHeight: "100vh", color: "#111827" }}>

      {/* ── Breadcrumbs + Back link — easy navigation back to review ── */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <Breadcrumb items={[
          { label: "Home", path: "/" },
          { label: "Reviews", path: "/reviews" },
          { label: "IC Markets Review", path: "/review/ic-markets" },
          { label: current.breadcrumb },
        ]} />
        <Link to="/review/ic-markets" style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 12, fontWeight: 600, color: GREEN,
          textDecoration: "none", padding: "5px 12px",
          borderRadius: 6, border: `1px solid ${GREEN_BORDER}`,
          background: GREEN_LIGHT, whiteSpace: "nowrap",
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = GREEN; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = GREEN; }}
          onMouseLeave={e => { e.currentTarget.style.background = GREEN_LIGHT; e.currentTarget.style.color = GREEN; e.currentTarget.style.borderColor = GREEN_BORDER; }}
        >
          <ArrowRight size={11} style={{ transform: "rotate(180deg)" }} /> Back to Full Review
        </Link>
      </div>

      {/* ── Hero Band — matched to BrokerReview layout ── */}
      <HeroBand mob={mob} tab={tab}>
        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", justifyContent: "space-between", gap: mob ? 20 : 32 }}>
          <div style={{ flex: 1 }}>
            {/* Logo + H1 inline — like BrokerReview */}
            <div style={{ display: "flex", alignItems: "center", gap: mob ? 12 : 16, marginBottom: 14 }}>
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{ display: "flex", flexShrink: 0, textDecoration: "none" }}>
                <div style={{ borderRadius: 14, overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", height: mob ? 64 : 88, width: mob ? 200 : 280, flexShrink: 0, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <img src={`${import.meta.env.BASE_URL}logos-wide-dark/ic-markets.svg`} alt="IC Markets" style={{ width: "70%", height: "70%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
                </div>
              </a>
              <div>
                <h1 style={{ fontFamily: "Outfit", fontSize: mob ? 22 : 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{current.h1}</h1>
                <p style={{ fontSize: mob ? 13 : 15, color: "rgba(255,255,255,0.6)", margin: 0 }}>{B.type} broker · Est. {B.year}{!mob && ` · ${B.hq}`}</p>
              </div>
            </div>

            {/* Score + Trustpilot + RegBadges row — like BrokerReview */}
            <div style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 16, flexWrap: "wrap", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ background: "rgba(52,211,153,0.15)", border: "2px solid #34d399", borderRadius: 8, padding: "4px 10px", fontFamily: "'JetBrains Mono'", fontSize: mob ? 16 : 18, fontWeight: 800, color: "#34d399" }}>{B.score}</div>
                <span style={{ fontSize: mob ? 12 : 14, fontWeight: 600, color: "#34d399" }}>{B.verdict}</span>
              </div>
              {!mob && <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />}
              {!mob && <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Trustpilot</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: "#fff" }}>{B.tp}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>({B.tpCount.toLocaleString()})</span>
              </div>}
              {!mob && <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />}
              <div style={{ display: "flex", gap: 4 }}>{REGS.filter(r => r.tier === 1).map((r, i) => <RegBadge key={i} reg={r.name} onDark />)}</div>
              {B.badge && <span style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", fontSize: mob ? 10 : 11, fontWeight: 600, padding: "3px 10px", borderRadius: 5, border: "1px solid rgba(110,231,183,0.3)", display: "inline-flex", alignItems: "center", gap: 4 }}><Award size={12} color="#34d399" />{B.badge}</span>}
            </div>

            {/* Key stats grid — like BrokerReview */}
            <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(3,1fr)" : "repeat(5,auto)", gap: mob ? 8 : 20, marginBottom: 14 }}>
              {[{ l: "Spread", v: `${B.spread} pips` }, { l: "Commission", v: B.commission }, { l: "Min Deposit", v: `$${B.minDep}` }, ...(!mob ? [{ l: "Leverage", v: B.leverage }, { l: "Instruments", v: B.instruments }] : [])].map((x, i) => (
                <div key={i} style={mob ? { textAlign: "center", padding: "6px", background: "rgba(255,255,255,0.06)", borderRadius: 6 } : {}}>
                  <div style={{ fontSize: mob ? 10 : 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{x.l}</div>
                  <div style={{ fontSize: mob ? 14 : 15, color: "#fff", fontWeight: 700 }}>{x.v}</div>
                </div>
              ))}
            </div>

            {/* Mobile CTA */}
            {mob && <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: NAVY, fontSize: 15, fontWeight: 700, textDecoration: "none", padding: "12px", borderRadius: 10, boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}>Visit {B.name} <ArrowRight size={14} /></a>}
          </div>

          {/* Right: Frosted glass score card — like BrokerReview */}
          {!mob && (
            <div style={{ width: tab ? 220 : 280, flexShrink: 0, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: tab ? "18px" : "22px", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 4 }}>Our Rating</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 40, fontWeight: 800, color: "#34d399", lineHeight: 1 }}>{B.score}</div>
              <div style={{ fontSize: 13, color: "#34d399", fontWeight: 600, marginBottom: 10 }}>{B.verdict}</div>
              {B.promo && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 8px", marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}><Zap size={13} color={ORANGE} /> {B.promo}</div>}
              <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: NAVY, fontSize: 16, fontWeight: 700, textDecoration: "none", padding: "13px 24px", borderRadius: 10, width: "100%", boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}>Visit {B.name} <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>70.53% of retail investors lose money</div>
            </div>
          )}
        </div>
      </HeroBand>

      {/* ── Sub-page Tab Navigation ── */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 64, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none", position: "relative" }}>
          <div style={{ display: "flex", gap: 0, minWidth: "max-content" }}>
            {TABS.map(t => {
              const active = t.id === activeTab;
              const TabIcon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: mob ? "12px 14px" : "14px 20px",
                    background: active ? NAVY : "transparent",
                    color: active ? "#fff" : GRAY_MUTED,
                    border: "none", borderBottom: active ? `3px solid ${GREEN}` : "3px solid transparent",
                    fontSize: mob ? 12 : 13, fontWeight: 700,
                    cursor: "pointer", whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = NAVY; e.currentTarget.style.background = GRAY_LIGHT; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = GRAY_MUTED; e.currentTarget.style.background = "transparent"; } }}
                >
                  <TabIcon size={mob ? 14 : 16} />
                  {t.label}
                </button>
              );
            })}
          </div>
          {/* Mobile scroll fade indicator — now properly positioned */}
          {mob && <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 40, background: "linear-gradient(90deg, transparent, #fff)", pointerEvents: "none", zIndex: 2 }} />}
        </div>
      </div>

      {/* ── Main Content — layout matches BrokerReview ── */}
      <div style={{ ...cn, display: "flex", flexDirection: mob ? "column" : "row", gap: mob ? 16 : 24, paddingTop: mob ? 20 : 28, paddingBottom: mob ? 40 : 64 }}>
        {/* Content Column */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Author credits — standard component, same as BrokerReview */}
          <AuthorCredits author={MOCK_AUTHOR} editor={MOCK_EDITOR} factChecker={MOCK_FACT_CHECKER} updatedDate="March 2026" compact={mob} />
          <div style={{ marginTop: 16 }} />
          <ContentComponent mob={mob} />
          <AuthorBioCard author={MOCK_AUTHOR} style={{ marginTop: 24 }} />
          <RelatedLinks activeTab={activeTab} />
          <RiskDisclaimer />
        </main>

        {/* Desktop Sidebar — 260px like BrokerReview */}
        {desk && (
          <aside style={{ width: 260, flexShrink: 0 }}>
            <div style={{ position: "sticky", top: 130 }}>
              {/* Broker Quick Card */}
              <Card style={{ textAlign: "center", padding: 20 }}>
                <BrokerLogo slug="ic-markets" name="IC Markets" fallback="IC" size={56} shape="icon" borderRadius={12} />
                <div style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 800, color: NAVY, marginTop: 8 }}>IC Markets</div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: 8, marginBottom: 12 }}><ScoreBadge score={B.score} size="md" /></div>
                <div style={{ fontSize: 12, color: GRAY_MUTED, marginBottom: 4 }}>{B.type} · Est. {B.year}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
                  {REGS.filter(r => r.tier === 1).map((r, i) => <RegBadge key={i} reg={r.name} />)}
                </div>
                <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{ display: "block", background: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, color: NAVY, fontSize: 14, fontWeight: 700, textDecoration: "none", padding: "12px 0", borderRadius: 8, textAlign: "center", marginBottom: 8 }}>Visit IC Markets</a>
                <Link to="/review/ic-markets" style={{ display: "block", fontSize: 13, color: GREEN, fontWeight: 600, textDecoration: "none" }}>Read Full Review →</Link>
              </Card>

              {/* Key Stats */}
              <Card>
                <div style={{ fontSize: 12, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Key Facts</div>
                {[
                  { l: "Min Deposit", v: `$${B.minDep}` },
                  { l: "EUR/USD Spread", v: `${B.spread} pips` },
                  { l: "Commission", v: B.commission },
                  { l: "Max Leverage", v: B.leverage },
                  { l: "Instruments", v: B.instruments },
                  { l: "Platforms", v: "4" },
                  { l: "Trustpilot", v: `${B.tp}/5 (${(B.tpCount / 1000).toFixed(0)}K)` },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 6 ? `1px solid ${BORDER}` : "none" }}>
                    <span style={{ fontSize: 13, color: GRAY_MUTED }}>{s.l}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: NAVY, fontFamily: "'JetBrains Mono',monospace" }}>{s.v}</span>
                  </div>
                ))}
              </Card>

              {/* Deep Dive Links — shows how review page integrates */}
              <Card style={{ background: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Deep Dive</div>
                {TABS.map((t, i) => {
                  const TabIcon = t.icon;
                  const isActive = t.id === activeTab;
                  return (
                    <button key={i} onClick={() => setActiveTab(t.id)} style={{
                      display: "flex", alignItems: "center", gap: 8, width: "100%",
                      padding: "7px 8px", border: "none", borderRadius: 6, cursor: "pointer",
                      background: isActive ? GREEN : "transparent",
                      color: isActive ? "#fff" : NAVY,
                      fontSize: 12, fontWeight: isActive ? 700 : 500, textAlign: "left",
                      marginBottom: 2, transition: "all 0.15s ease",
                    }}>
                      <TabIcon size={13} color={isActive ? "#fff" : GREEN} />
                      {CONTENT_MAP[t.id]?.breadcrumb || t.label}
                    </button>
                  );
                })}
              </Card>

              {/* Risk Warning */}
              <div style={{ fontSize: 11, color: GRAY_MUTED, lineHeight: 1.5, padding: "12px 14px", background: "#fff8e1", border: "1px solid #fde68a", borderRadius: 8 }}>
                <strong>Risk Warning:</strong> {B.riskWarning}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ── Sticky Mobile CTA — smooth slide-up animation ── */}
      {mob && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          background: NAVY, borderTop: `1px solid rgba(255,255,255,0.1)`,
          padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
          transform: stickyVisible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BrokerLogo slug="ic-markets" name="IC Markets" fallback="IC" size={28} shape="icon" borderRadius={6} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>IC Markets</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Score: {B.score}/10</div>
            </div>
          </div>
          <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{ background: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, color: NAVY, fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "10px 20px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 4 }}>Visit Broker <ExternalLink size={12} /></a>
        </div>
      )}
    </div>
  );
}
