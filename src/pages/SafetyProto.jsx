import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBrokerData, getAllBrokersWithData } from "../data/brokers/index";
import { getAuthorByName, getFactChecker, getReviewerForAuthor, getEditor } from "../data/authors";
import AuthorCredits from "../components/AuthorCredits";
import RegBadge from "../components/RegBadge";
import RegulatorLogo from "../components/RegulatorLogo";
import BrokerLogo from "../components/BrokerLogo";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import HeroBand from "../components/HeroBand";
import Icon from "../components/Icon";
import TrustpilotLogo from "../components/TrustpilotLogo";
import { useLocalePath } from "../i18n/useLocalePath";
import { getRegulatorSlug } from "../data/regulators";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import {
  ShieldCheck, ShieldAlert, Shield, Wallet, Umbrella, FileSearch,
  Lock, Building2, ArrowRight, ExternalLink, Check,
  ChevronDown, ChevronUp, Scale, Globe, TrendingUp,
  Users, Landmark, BarChart3, Search,
} from "lucide-react";

/* ── Responsive hook ── */
function useMedia() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { mob: w < 640, tab: w >= 640 && w < 1024, desk: w >= 1024 };
}

/* ── Demo broker slug ── */
const DEMO_SLUG = "etoro";

/* ── Safety-specific data (hardcoded for prototype, will move to MD later) ── */
const SAFETY_DATA = {
  etoro: {
    segregatedFunds: true,
    negativeBalanceProtection: true,
    publicCompany: true,
    stockTicker: "ETOR",
    stockExchange: "Nasdaq",
    ipoYear: 2025,
    ipoPrice: "$52",
    marketCap: "$5.4B",
    financialAudit: "Deloitte",
    twoFactorAuth: true,
    knownIssues: [],
    cfdLossPercent: 51,
    totalUsers: "40M+",
    fundedAccounts: "3.7M",
    revenue: "$931M",
    aum: "$16.6B",
    entities: [
      { entity: "eToro (UK) Ltd", regulator: "FCA", country: "UK", compensation: "FSCS up to \u00a385,000", segregated: true },
      { entity: "eToro (Europe) Ltd", regulator: "CySEC", country: "EU/EEA", compensation: "ICF up to \u20ac20,000", segregated: true },
      { entity: "eToro AUS Capital Ltd", regulator: "ASIC", country: "Australia", compensation: "Segregation mandate", segregated: true },
      { entity: "eToro USA LLC", regulator: "SEC/FINRA", country: "United States", compensation: "SIPC up to $500,000", segregated: true },
      { entity: "eToro (SG) Pte. Ltd", regulator: "MAS", country: "Singapore", compensation: "MAS framework", segregated: true },
    ],
    verificationLinks: [
      { regulator: "FCA", url: "https://register.fca.org.uk/s/firm?id=001b000000MfNWPAA3", label: "FCA Register #583263" },
      { regulator: "ASIC", url: "https://connectonline.asic.gov.au/RegistrySearch/faces/landing/SearchRegisters.jspx", label: "ASIC Connect #491139" },
      { regulator: "SEC", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=etoro&CIK=&type=&dateb=&owner=include&count=40&search_text=&action=getcompany", label: "SEC EDGAR Filing" },
      { regulator: "CySEC", url: "https://www.cysec.gov.cy/en-GB/entities/investment-firms/cypriot/37691/", label: "CySEC Registry #109/10" },
    ],
  },
};

/* ── Safety verdict logic ── */
function getSafetyVerdict(regScore, tier1Count) {
  if (regScore >= 9.5 && tier1Count >= 3) return { label: "Highly Trusted", color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", icon: ShieldCheck };
  if (regScore >= 8.0 && tier1Count >= 2) return { label: "Trusted", color: "#0d9488", bg: "#f0fdfa", border: "#99f6e4", icon: ShieldCheck };
  if (regScore >= 6.0) return { label: "Average Risk", color: "#d97706", bg: "#fef3c7", border: "#fde68a", icon: ShieldAlert };
  return { label: "High Risk", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: ShieldAlert };
}

/* ── Stars (from BrokerReview) ── */
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

/* ── WideLogo (from BrokerReview) ── */
function WideLogo({ slug, name, mob }) {
  const [err, setErr] = useState(false);
  const h = mob ? 56 : 72;
  const w = mob ? 170 : 220;
  if (err) return <BrokerLogo slug={slug} name={name} size={h} shape="icon" />;
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", height: h, width: w, flexShrink: 0, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
      <img src={`${import.meta.env.BASE_URL}logos-wide-dark/${slug}.svg`} alt={`${name} logo`} loading="lazy" onError={() => setErr(true)} style={{ width: "70%", height: "70%", objectFit: "contain" }} />
    </div>
  );
}

/* ── Reusable components ── */
function H2({ id, children, icon: IconComp }) {
  return (
    <h2 id={id} style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 36, scrollMarginTop: 80, display: "flex", alignItems: "center", gap: 10 }}>
      {IconComp && <IconComp size={22} color="#059669" />}
      {children}
    </h2>
  );
}
function P({ children }) { return <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.8, marginBottom: 14 }}>{children}</p>; }
function Card({ children, style = {} }) { return <div style={{ background: "#fff", border: "1px solid #e8ecf1", borderRadius: 12, padding: 22, marginBottom: 16, ...style }}>{children}</div>; }

/* ── Score bar ── */
function ScoreBar({ name, score, weight, detail }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>{weight}%</span>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 15, fontWeight: 800, color: score >= 9.5 ? "#059669" : "#0d9488" }}>{score}</span>
        </div>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "#e8ecf1", marginBottom: 4 }}>
        <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#059669,#059669aa)", width: `${(score / 10) * 100}%` }} />
      </div>
      <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{detail}</div>
    </div>
  );
}

/* ── Protection item ── */
function ProtectionItem({ icon: IconComp, label, value, description, available }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid #f0f4f8" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: available ? "#ecfdf5" : "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <IconComp size={20} color={available ? "#059669" : "#d97706"} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{label}</span>
          {available ? (
            <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "1px 6px", borderRadius: 4 }}>YES</span>
          ) : (
            <span style={{ fontSize: 11, fontWeight: 700, color: "#d97706", background: "#fef3c7", border: "1px solid #fde68a", padding: "1px 6px", borderRadius: 4 }}>NO</span>
          )}
        </div>
        {value && <div style={{ fontSize: 13, color: "#059669", fontWeight: 600, marginBottom: 2 }}>{value}</div>}
        <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>{description}</div>
      </div>
    </div>
  );
}

/* ── FAQ Accordion ── */
function FaqItem({ q, a, open, onClick }) {
  return (
    <div style={{ borderBottom: "1px solid #e8ecf1" }}>
      <button onClick={onClick} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", textAlign: "left" }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#111827", flex: 1, paddingRight: 12 }}>{q}</span>
        {open ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
      </button>
      {open && <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, paddingBottom: 16 }}>{a}</div>}
    </div>
  );
}

/* ── CTA Block (mobile-fixed) ── */
function CTABlock({ B, visitUrl, sub, slug, mob }) {
  const lp = useLocalePath();
  return (
    <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: mob ? "16px" : "20px 24px", display: "flex", flexDirection: mob ? "column" : "row", alignItems: mob ? "stretch" : "center", justifyContent: "space-between", gap: mob ? 12 : 16, margin: "24px 0" }}>
      <div>
        {sub && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{sub}</div>}
        {B.promo && <div style={{ fontSize: 14, color: "#34d399", fontWeight: 600, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><Icon name="lightbulb" size={14} color="#f59e0b" /> {B.promo}</div>}
      </div>
      <div style={{ display: "flex", gap: 10, flexDirection: mob ? "column" : "row" }}>
        <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", fontSize: 14, fontWeight: 700, textDecoration: "none", padding: "12px 28px", borderRadius: 8, boxShadow: "0 2px 8px rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, whiteSpace: "nowrap" }}>
          Visit {B.name} <ExternalLink size={14} />
        </a>
        <Link to={lp(`/review/${slug}`)} className="cta-secondary" style={{ color: "#059669", fontSize: 14, fontWeight: 700, textDecoration: "none", padding: "12px 20px", borderRadius: 8, border: "2px solid #059669", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, whiteSpace: "nowrap" }}>
          Full Review <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

/* ── Sticky CTA Bar ── */
function StickyCTA({ B, visitUrl, visible, mob }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
      transform: visible ? "translateY(0)" : "translateY(100%)",
      transition: "transform 0.3s ease",
      padding: mob ? "10px 16px" : "10px 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <BrokerLogo slug={DEMO_SLUG} name={B.name} size={32} shape="icon" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 4 }}>
              <ShieldCheck size={11} color="#34d399" /> Highly Trusted
            </div>
          </div>
        </div>
        <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", fontSize: mob ? 13 : 14, fontWeight: 700, textDecoration: "none", padding: mob ? "10px 18px" : "10px 24px", borderRadius: 8, boxShadow: "0 2px 8px rgba(245,158,11,0.3)", display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", flexShrink: 0 }}>
          Visit {B.name} <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

/* ── TOC items ── */
const TOC_ITEMS = [
  { id: "quick-answer", label: "Quick Answer" },
  { id: "regulation-licenses", label: "Regulation" },
  { id: "investor-protection", label: "Protection" },
  { id: "protection-mechanisms", label: "Mechanisms" },
  { id: "company-financials", label: "Company" },
  { id: "security-transparency", label: "Security" },
  { id: "risks-considerations", label: "Risks" },
  { id: "safety-comparison", label: "Comparison" },
  { id: "trust-score-breakdown", label: "Trust Score" },
  { id: "verdict", label: "Verdict" },
  { id: "verify-yourself", label: "Verify" },
  { id: "safer-alternatives", label: "Alternatives" },
  { id: "faq", label: "FAQ" },
];

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */
export default function SafetyProto() {
  const { mob, tab, desk } = useMedia();
  const lp = useLocalePath();
  const slug = DEMO_SLUG;
  const data = getBrokerData(slug);
  const [openFaq, setOpenFaq] = useState(null);
  const [stickyVisible, setStickyVisible] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || "";
  const visitUrl = apiBase ? `${apiBase}/go/${slug}` : data?.B?.url;

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    const fn = () => setStickyVisible(window.scrollY > 500);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (!data) return <div style={{ padding: 60, textAlign: "center" }}>Broker not found</div>;

  const { B, SCORES } = data;
  const safety = SAFETY_DATA[slug] || {};
  const regScore = SCORES[0];
  const tier1Regs = B.regs.filter(r => r.tier === 1);
  const tier2Regs = B.regs.filter(r => r.tier === 2);
  const tier3Regs = B.regs.filter(r => r.tier === 3);
  const verdict = getSafetyVerdict(regScore.score, tier1Regs.length);
  const VerdictIcon = verdict.icon;
  const brokerAge = new Date().getFullYear() - B.year;

  const author = getAuthorByName();
  const factChecker = getFactChecker();
  const reviewer = getReviewerForAuthor();
  const editor = getEditor();

  // Alternatives: top-3 by Regulation & Safety score
  const alternatives = getAllBrokersWithData()
    .filter(b => b.slug !== slug && b.SCORES?.[0])
    .map(b => ({ slug: b.slug, name: b.B.name, score: b.B.score, regScore: b.SCORES[0].score, regs: b.B.regs, type: b.B.type, tp: b.B.tp, tpCount: b.B.tpCount, year: b.B.year }))
    .sort((a, b) => b.regScore - a.regScore)
    .slice(0, 3);

  // Safety comparison: top-4 brokers for comparison table
  const compBrokers = getAllBrokersWithData()
    .filter(b => b.SCORES?.[0])
    .map(b => ({ slug: b.slug, name: b.B.name, regScore: b.SCORES[0].score, tier1: b.B.regs.filter(r => r.tier === 1).length, totalRegs: b.B.regs.length, year: b.B.year }))
    .sort((a, b) => b.regScore - a.regScore)
    .slice(0, 5)
    .filter(b => b.slug !== slug)
    .slice(0, 3);

  // FAQ
  const faqs = [
    { q: `Is ${B.name} a legitimate broker?`, a: `Yes. ${B.name} is regulated by ${tier1Regs.length} Tier-1 financial authorities including ${tier1Regs.map(r => r.name).join(", ")}. It has been operating since ${B.year} (${brokerAge} years) and is ${safety.publicCompany ? `publicly listed on ${safety.stockExchange} (${safety.stockTicker})` : "a private company"}. All client funds are held in segregated accounts.` },
    { q: `What regulators oversee ${B.name}?`, a: `${B.name} holds ${B.regs.length} regulatory licenses: ${tier1Regs.length} Tier-1 (${tier1Regs.map(r => r.name).join(", ")}), ${tier2Regs.length} Tier-2 (${tier2Regs.map(r => r.name).join(", ") || "none"}), and ${tier3Regs.length} Tier-3 (${tier3Regs.map(r => r.name).join(", ") || "none"}). Tier-1 regulators provide the highest level of investor protection.` },
    { q: `Can ${B.name} steal my money?`, a: `It is extremely unlikely. ${B.name} is required by ${tier1Regs.length} Tier-1 regulators to keep client funds in segregated bank accounts, separate from company funds. Additionally, investor compensation schemes cover deposits if the broker becomes insolvent. ${safety.publicCompany ? "As a publicly listed company, its financials are independently audited." : ""}` },
    { q: `Does ${B.name} offer negative balance protection?`, a: safety.negativeBalanceProtection ? `Yes. ${B.name} offers negative balance protection for retail clients across all regulated entities. This means you cannot lose more than your deposited funds, even during extreme market volatility.` : `${B.name} does not offer negative balance protection on all account types. Check with your specific entity for details.` },
    { q: `Is my money safe with ${B.name}?`, a: `Based on our analysis, ${B.name} scores ${regScore.score}/10 for Regulation & Safety — rated "${verdict.label}". Your money is protected through segregated funds, ${safety.negativeBalanceProtection ? "negative balance protection, " : ""}investor compensation schemes, and oversight by ${tier1Regs.length} Tier-1 regulators.` },
    { q: `What happens if ${B.name} goes bankrupt?`, a: `If ${B.name} were to go bankrupt, client funds held in segregated accounts would be returned to clients as they are legally separate from company assets. Compensation schemes provide further protection — for example, FSCS covers up to \u00a385,000 for UK clients and ICF covers up to \u20ac20,000 for EU clients. The risk of bankruptcy is low given the company's ${brokerAge}-year track record, ${safety.publicCompany ? `${safety.marketCap} market cap, ` : ""}and multi-jurisdictional regulation.` },
    { q: `How can I verify ${B.name}'s regulatory status?`, a: `You can verify ${B.name}'s licenses directly on regulator websites: FCA Register (UK, #583263), ASIC Connect (Australia, #491139), CySEC Registry (Cyprus, #109/10), and SEC EDGAR (US). We provide direct links to each regulator's database in our "Verify Yourself" section below.` },
  ];

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Reviews", path: "/reviews" },
    { label: B.name, path: `/review/${slug}` },
    { label: `Is ${B.name} Safe?` },
  ];

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  // JSON-LD schemas
  useEffect(() => {
    if (!data) return;
    document.title = `Is ${B.name} Safe? Expert Trust Analysis 2026 | RatedBrokers`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", `Is ${B.name} safe to trade with? Safety score: ${regScore.score}/10. ${tier1Regs.length}x Tier-1 regulated (${tier1Regs.map(r => r.name).join(", ")}). ${safety.totalUsers} users, ${safety.publicCompany ? `listed on ${safety.stockExchange}` : ""}. Expert safety analysis.`);

    const schemas = [
      breadcrumbSchema(breadcrumbItems),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `Is ${B.name} Safe? Expert Trust Analysis 2026`,
        author: { "@type": "Person", name: author.name, url: `https://ratedbrokers.com/author/${author.id}` },
        publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
        datePublished: "2026-03-01",
        dateModified: "2026-03-28",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ];

    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(schemas);
    el.id = "safety-schema";
    document.head.appendChild(el);
    return () => { const old = document.getElementById("safety-schema"); if (old) old.remove(); };
  }, [data]);

  /* ── CONTENT ── */
  const content = (
    <>
      {/* ── 3. AUTHOR CREDITS ── */}
      <AuthorCredits author={author} editor={editor} reviewer={reviewer} factChecker={factChecker} updatedDate="March 28, 2026" compact={mob} />

      {/* ── 4. QUICK ANSWER — Featured Snippet Target ── */}
      <div id="quick-answer" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0a2e3d 100%)", borderRadius: 14, padding: mob ? "20px 18px" : "24px 28px", margin: "24px 0", borderLeft: "4px solid #f59e0b", scrollMarginTop: 80 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#f59e0b", marginBottom: 8 }}>Quick Answer</div>
        <p style={{ fontSize: mob ? 15 : 17, color: "#fff", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
          <strong>Yes, {B.name} is safe.</strong> It is regulated by {tier1Regs.length} Tier-1 financial authorities ({tier1Regs.map(r => r.name).join(", ")}), has been operating since {B.year} ({brokerAge} years), {safety.publicCompany ? `is publicly listed on ${safety.stockExchange} (${safety.stockTicker}), ` : ""}and scores {regScore.score}/10 in our Regulation & Safety assessment. Client funds are held in segregated bank accounts with investor compensation covering up to {safety.entities?.[0]?.compensation?.split("up to ")[1] || "applicable limits"}.
        </p>
      </div>

      <CTABlock B={B} visitUrl={visitUrl} slug={slug} sub={`Satisfied with ${B.name}'s safety?`} mob={mob} />

      {/* ── 5. REGULATION TABLE ── */}
      <H2 id="regulation-licenses" icon={Shield}>Regulation & Licenses</H2>
      <P>
        {B.name} holds {B.regs.length} regulatory licenses across {new Set(B.regs.map(r => r.country)).size} jurisdictions.
        With {tier1Regs.length} Tier-1 licenses, it ranks among the most heavily regulated brokers in the industry.
      </P>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {!mob && (
          <div style={{ background: "#f8f9fb", padding: "10px 18px", borderBottom: "1px solid #e8ecf1", display: "grid", gridTemplateColumns: "1fr 140px 140px 80px 80px", gap: 8 }}>
            {["Regulator", "Country", "License #", "Tier", "Status"].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
            ))}
          </div>
        )}
        {B.regs.map((r, i) => {
          const rSlug = getRegulatorSlug(r.name);
          return (
            <div key={i} style={{ display: mob ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: "1fr 140px 140px 80px 80px", gap: mob ? 4 : 8, padding: mob ? "14px 18px" : "12px 18px", borderBottom: i < B.regs.length - 1 ? "1px solid #f0f4f8" : "none", alignItems: mob ? "flex-start" : "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {rSlug && <RegulatorLogo slug={rSlug} name={r.name} size={24} shape="icon" tier={r.tier} />}
                <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{r.name}</span>
                {mob && <span style={{ background: r.tier === 1 ? "#ecfdf5" : r.tier === 2 ? "#fffbeb" : "#f1f5f9", color: r.tier === 1 ? "#059669" : r.tier === 2 ? "#d97706" : "#64748b", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>Tier {r.tier}</span>}
              </div>
              <span style={{ fontSize: 14, color: "#374151" }}>{r.country}</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: "#374151" }}>#{r.num}</span>
              {!mob && <span style={{ background: r.tier === 1 ? "#ecfdf5" : r.tier === 2 ? "#fffbeb" : "#f1f5f9", color: r.tier === 1 ? "#059669" : r.tier === 2 ? "#d97706" : "#64748b", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, border: `1px solid ${r.tier === 1 ? "#a7f3d0" : r.tier === 2 ? "#fde68a" : "#e2e8f0"}`, textAlign: "center", width: "fit-content" }}>Tier {r.tier}</span>}
              {!mob && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#059669", fontWeight: 600 }}><Check size={14} color="#059669" /> Active</span>}
            </div>
          );
        })}
      </Card>

      {/* ── 6. INVESTOR PROTECTION BY ENTITY ── */}
      <H2 id="investor-protection" icon={Wallet}>Investor Protection by Entity</H2>
      <P>
        Your compensation coverage depends on which {B.name} entity holds your account. Here is the protection breakdown by jurisdiction:
      </P>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {!mob && (
          <div style={{ background: "#f8f9fb", padding: "10px 18px", borderBottom: "1px solid #e8ecf1", display: "grid", gridTemplateColumns: "1.2fr 0.8fr 0.8fr 1.2fr", gap: 8 }}>
            {["Entity", "Regulator", "Region", "Compensation"].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
            ))}
          </div>
        )}
        {(safety.entities || []).map((e, i) => (
          <div key={i} style={{ display: mob ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: "1.2fr 0.8fr 0.8fr 1.2fr", gap: mob ? 2 : 8, padding: mob ? "12px 18px" : "12px 18px", borderBottom: i < safety.entities.length - 1 ? "1px solid #f0f4f8" : "none", alignItems: mob ? "flex-start" : "center" }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{e.entity}</span>
            <span><RegBadge reg={e.regulator} /></span>
            <span style={{ fontSize: 14, color: "#374151" }}>{e.country}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#059669", fontFamily: "'JetBrains Mono'" }}>{e.compensation}</span>
          </div>
        ))}
      </Card>

      {/* ── 7. PROTECTION MECHANISMS ── */}
      <H2 id="protection-mechanisms" icon={ShieldCheck}>Protection Mechanisms</H2>

      <Card style={{ padding: mob ? "4px 18px" : "4px 22px" }}>
        <ProtectionItem icon={Shield} label="Segregated Client Funds" available={safety.segregatedFunds}
          description={`${B.name} keeps all client funds in segregated bank accounts, completely separate from the company's operational funds. In the event of insolvency, these funds are ring-fenced and returned to clients.`} />
        <ProtectionItem icon={Wallet} label="Investor Compensation Scheme" available={!!safety.entities?.length}
          value={safety.entities?.map(e => `${e.regulator}: ${e.compensation}`).join(" | ")}
          description="Clients are protected by investor compensation funds that cover deposits in case the broker becomes insolvent. Coverage varies by entity." />
        <ProtectionItem icon={Umbrella} label="Negative Balance Protection" available={safety.negativeBalanceProtection}
          description={`Retail clients cannot lose more than their deposited funds. If a position moves against you beyond your account balance, ${B.name} absorbs the loss.`} />
        <ProtectionItem icon={FileSearch} label="Independent Financial Audit" available={!!safety.financialAudit}
          value={`Audited by ${safety.financialAudit}`}
          description={`${B.name}'s financial statements are independently audited by a Big Four accounting firm, providing transparency and accountability.`} />
      </Card>

      {/* ── 8. COMPANY & FINANCIAL HEALTH (NEW — MatchMyBroker pattern) ── */}
      <H2 id="company-financials" icon={Building2}>Company & Financial Health</H2>
      <P>
        A broker's financial stability directly impacts the safety of your funds. {safety.publicCompany ? `As a publicly listed company on ${safety.stockExchange}, ${B.name} is required to disclose quarterly financials, undergo independent audits, and maintain regulatory compliance across all operating jurisdictions.` : `${B.name} is a private company, which limits public financial disclosure.`}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: mob ? 10 : 14, marginBottom: 16 }}>
        {[
          { icon: Users, label: "Registered Users", value: safety.totalUsers, color: "#059669" },
          { icon: Landmark, label: "Funded Accounts", value: safety.fundedAccounts, color: "#0d9488" },
          { icon: BarChart3, label: "Revenue (2024)", value: safety.revenue, color: "#0284c7" },
          { icon: TrendingUp, label: "Assets Under Mgmt", value: safety.aum, color: "#7c3aed" },
        ].map((m, i) => (
          <Card key={i} style={{ padding: "16px", marginBottom: 0, textAlign: "center" }}>
            <m.icon size={20} color={m.color} style={{ marginBottom: 6 }} />
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 18 : 22, fontWeight: 800, color: "#0f172a" }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>{m.label}</div>
          </Card>
        ))}
      </div>

      {safety.publicCompany && (
        <Card style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: mob ? "16px" : "18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Building2 size={18} color="#059669" />
            <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#059669" }}>IPO & Public Listing</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
            {[
              { l: "Stock", v: `${safety.stockTicker} (${safety.stockExchange})` },
              { l: "IPO Year", v: safety.ipoYear },
              { l: "IPO Price", v: safety.ipoPrice },
              { l: "Market Cap", v: safety.marketCap },
            ].map((x, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, color: "#065f46", fontWeight: 600, textTransform: "uppercase" }}>{x.l}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{x.v}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: "10px 0 0" }}>
            Public listing provides an additional layer of transparency — {B.name} must publish quarterly earnings,
            undergo SEC oversight, and maintain independent board directors and audit committees.
          </p>
        </Card>
      )}

      {/* ── 9. SECURITY & TRANSPARENCY ── */}
      <H2 id="security-transparency" icon={Lock}>Security & Transparency</H2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: mob ? 10 : 14, marginBottom: 16 }}>
        {[
          { icon: Lock, label: "2FA", value: safety.twoFactorAuth ? "Enabled" : "N/A", ok: safety.twoFactorAuth, desc: "Account-level two-factor authentication." },
          { icon: Building2, label: "Public Company", value: safety.publicCompany ? `${safety.stockTicker}` : "Private", ok: safety.publicCompany, desc: safety.publicCompany ? "Public financials, SEC oversight." : "Limited financial disclosure." },
          { icon: Globe, label: "Track Record", value: `${brokerAge} years`, ok: brokerAge >= 10, desc: `Operating since ${B.year}.` },
          { icon: Scale, label: "Reg. History", value: safety.knownIssues?.length === 0 ? "Clean" : `${safety.knownIssues?.length} issues`, ok: !safety.knownIssues?.length, desc: "No known fines or actions." },
        ].map((item, i) => (
          <Card key={i} style={{ padding: mob ? "14px" : "18px 20px", marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 32, height: 32, borderRadius: 7, background: item.ok ? "#ecfdf5" : "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <item.icon size={16} color={item.ok ? "#059669" : "#d97706"} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: mob ? 12 : 13, fontWeight: 600, color: "#111827" }}>{item.label}</div>
                <div style={{ fontSize: mob ? 13 : 14, fontWeight: 700, color: item.ok ? "#059669" : "#d97706", fontFamily: "'JetBrains Mono'" }}>{item.value}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{item.desc}</div>
          </Card>
        ))}
      </div>

      {/* ── Trustpilot Social Proof ── */}
      <Card style={{ display: "flex", alignItems: mob ? "flex-start" : "center", gap: mob ? 10 : 16, flexDirection: mob ? "column" : "row", padding: mob ? "16px" : "18px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TrustpilotLogo size="xs" />
          <Stars r={B.tp} size={16} />
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, fontWeight: 800, color: "#111827" }}>{B.tp}/5</span>
        </div>
        <div style={{ fontSize: 14, color: "#374151" }}>
          Based on <strong>{B.tpCount?.toLocaleString()}</strong> reviews — independent social proof of reliability and service quality.
        </div>
        <a href={getTrustpilotUrl(slug)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#059669", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", marginLeft: mob ? 0 : "auto" }}>
          View on Trustpilot <ExternalLink size={12} style={{ verticalAlign: "middle" }} />
        </a>
      </Card>

      {/* ── 10. RISKS & CONSIDERATIONS ── */}
      <H2 id="risks-considerations" icon={ShieldAlert}>Risks & Considerations</H2>

      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: mob ? "16px" : "22px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <ShieldAlert size={18} color="#dc2626" />
          <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#dc2626" }}>Risk Warning</span>
        </div>
        <p style={{ fontSize: 14, color: "#991b1b", lineHeight: 1.7, margin: 0, marginBottom: 12 }}>{B.riskWarning}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "CFD Loss Rate", value: `${safety.cfdLossPercent}%`, desc: "of retail accounts lose money" },
            { label: "Max Leverage", value: B.leverage, desc: "Amplifies gains and losses" },
          ].map((r, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", border: "1px solid #fecaca" }}>
              <div style={{ fontSize: 11, color: "#dc2626", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{r.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#991b1b", fontFamily: "'JetBrains Mono'" }}>{r.value}</div>
              <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.3, marginTop: 1 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <P>
        The {safety.cfdLossPercent}% loss rate is {safety.cfdLossPercent <= 70 ? "below" : "around"} the industry average of 70-80%,
        suggesting {B.name}'s risk management tools help reduce client losses compared to peers.
      </P>

      {/* ── 11. SAFETY COMPARISON TABLE (NEW — conversion booster) ── */}
      <H2 id="safety-comparison" icon={Scale}>Safety Comparison</H2>
      <P>
        How does {B.name} compare to other top-rated brokers on safety metrics?
      </P>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 500 }}>
            <thead>
              <tr style={{ background: "#f8f9fb", borderBottom: "1px solid #e8ecf1" }}>
                {["Broker", "Safety Score", "Tier-1", "Total Regs", "Founded"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Current broker — highlighted */}
              <tr style={{ background: "#ecfdf5", borderBottom: "1px solid #a7f3d0" }}>
                <td style={{ padding: "12px 14px", fontWeight: 700, color: "#059669", display: "flex", alignItems: "center", gap: 8 }}>
                  <BrokerLogo slug={slug} name={B.name} size={28} shape="icon" />
                  {B.name}
                </td>
                <td style={{ padding: "12px 14px", fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#059669" }}>{regScore.score}/10</td>
                <td style={{ padding: "12px 14px", fontWeight: 700 }}>{tier1Regs.length}</td>
                <td style={{ padding: "12px 14px" }}>{B.regs.length}</td>
                <td style={{ padding: "12px 14px" }}>{B.year}</td>
              </tr>
              {compBrokers.map((cb, i) => (
                <tr key={cb.slug} style={{ borderBottom: i < compBrokers.length - 1 ? "1px solid #f0f4f8" : "none" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "#111827" }}>
                    <Link to={lp(`/review/${cb.slug}`)} style={{ display: "flex", alignItems: "center", gap: 8, color: "#111827", textDecoration: "none" }}>
                      <BrokerLogo slug={cb.slug} name={cb.name} size={28} shape="icon" />
                      {cb.name}
                    </Link>
                  </td>
                  <td style={{ padding: "12px 14px", fontFamily: "'JetBrains Mono'", fontWeight: 700, color: "#0d9488" }}>{cb.regScore}/10</td>
                  <td style={{ padding: "12px 14px" }}>{cb.tier1}</td>
                  <td style={{ padding: "12px 14px" }}>{cb.totalRegs}</td>
                  <td style={{ padding: "12px 14px" }}>{cb.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── 12. TRUST SCORE BREAKDOWN ── */}
      <H2 id="trust-score-breakdown" icon={TrendingUp}>Trust Score Breakdown</H2>
      <P>
        Regulation & Safety is the most heavily weighted category ({regScore.weight}%) in our methodology.
      </P>

      <Card style={{ borderTop: "3px solid #0f172a", padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "22px 22px 8px" }}>
          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 10, padding: "14px 16px", marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheck size={18} color="#059669" />
                <span style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>{regScore.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>{regScore.weight}%</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 22, fontWeight: 800, color: "#059669" }}>{regScore.score}</span>
              </div>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "#d1fae5", marginBottom: 6 }}>
              <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#059669,#34d399)", width: `${(regScore.score / 10) * 100}%` }} />
            </div>
            <div style={{ fontSize: 13, color: "#065f46", lineHeight: 1.5 }}>{regScore.detail}</div>
          </div>
          {SCORES.slice(1).map((s, i) => <ScoreBar key={i} {...s} />)}
        </div>
        <div style={{ background: "#0f172a", padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, color: "#fff" }}>Overall Score</span>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 24, fontWeight: 800, color: "#34d399" }}>{B.score}/10</span>
        </div>
      </Card>

      <P>
        <Link to={lp("/methodology")} style={{ color: "#059669", fontWeight: 600, textDecoration: "none" }}>
          Learn more about our scoring methodology <ArrowRight size={13} style={{ verticalAlign: "middle" }} />
        </Link>
      </P>

      {/* ── 13. VERDICT + CTA ── */}
      <H2 id="verdict" icon={ShieldCheck}>Final Verdict: Is {B.name} Safe?</H2>

      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0a2e3d 100%)", borderRadius: 14, padding: mob ? "20px" : "28px 32px", margin: "20px 0", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: verdict.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <VerdictIcon size={26} color={verdict.color} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Safety Rating</div>
            <div style={{ fontSize: mob ? 18 : 22, fontWeight: 800, color: "#fff", fontFamily: "Outfit" }}>{verdict.label}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: mob ? 28 : 36, fontWeight: 800, color: "#34d399", lineHeight: 1 }}>{regScore.score}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>out of 10</div>
          </div>
        </div>

        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, marginBottom: 20 }}>
          <strong style={{ color: "#fff" }}>Yes, {B.name} is a safe and highly regulated broker.</strong>{" "}
          With {tier1Regs.length} Tier-1 licenses, a {brokerAge}-year track record, {safety.totalUsers} registered users,
          segregated client funds, negative balance protection,
          {safety.publicCompany ? ` a ${safety.marketCap} public listing on ${safety.stockExchange},` : ""}
          {" "}and a clean regulatory history, {B.name} is one of the most trustworthy brokers available.
        </p>

        <div style={{ display: "flex", gap: 12, flexDirection: mob ? "column" : "row" }}>
          <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", fontSize: 15, fontWeight: 700, textDecoration: "none", padding: "13px 28px", borderRadius: 10, boxShadow: "0 4px 12px rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            Visit {B.name} <ExternalLink size={14} />
          </a>
          <Link to={lp(`/review/${slug}`)} className="cta-secondary" style={{ color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none", padding: "13px 24px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            Read Full Review <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── 14. VERIFY YOURSELF (NEW — E-E-A-T booster) ── */}
      <H2 id="verify-yourself" icon={Search}>Verify Yourself</H2>
      <P>
        Don't take our word for it — verify {B.name}'s regulatory status directly on official regulator websites.
        We believe in transparency, and encourage all traders to independently confirm broker licenses.
      </P>

      <Card style={{ padding: mob ? "16px" : "20px 22px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Official Regulator Databases</div>
        {(safety.verificationLinks || []).map((vl, i) => (
          <a key={i} href={vl.url} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: 10, padding: "12px 0",
            borderBottom: i < safety.verificationLinks.length - 1 ? "1px solid #f0f4f8" : "none",
            textDecoration: "none", color: "#111827",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <RegBadge reg={vl.regulator} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#059669" }}>{vl.label}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Verify on official {vl.regulator} website</div>
            </div>
            <ExternalLink size={16} color="#059669" style={{ flexShrink: 0 }} />
          </a>
        ))}
      </Card>

      {/* ── 15. ALTERNATIVES ── */}
      <H2 id="safer-alternatives">Looking for Even Safer Brokers?</H2>

      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {alternatives.map((alt) => {
          const altVisitUrl = apiBase ? `${apiBase}/go/${alt.slug}` : "#";
          const altTier1 = alt.regs.filter(r => r.tier === 1);
          const altAge = new Date().getFullYear() - alt.year;
          return (
            <Card key={alt.slug} style={{ padding: "18px", marginBottom: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <BrokerLogo slug={alt.slug} name={alt.name} size={34} shape="icon" />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{alt.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{alt.type}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <div style={{ textAlign: "center", flex: 1, background: "#f8f9fb", borderRadius: 6, padding: "6px 4px" }}>
                  <div style={{ fontSize: 9, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Safety</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, fontWeight: 800, color: "#059669" }}>{alt.regScore}</div>
                </div>
                <div style={{ textAlign: "center", flex: 1, background: "#f8f9fb", borderRadius: 6, padding: "6px 4px" }}>
                  <div style={{ fontSize: 9, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Score</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, fontWeight: 800, color: "#0d9488" }}>{alt.score}</div>
                </div>
                <div style={{ textAlign: "center", flex: 1, background: "#f8f9fb", borderRadius: 6, padding: "6px 4px" }}>
                  <div style={{ fontSize: 9, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Years</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, fontWeight: 800, color: "#374151" }}>{altAge}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12, minHeight: 24 }}>
                {altTier1.slice(0, 3).map(r => <RegBadge key={r.name} reg={r.name} />)}
                {altTier1.length > 3 && <span style={{ fontSize: 11, color: "#64748b", alignSelf: "center" }}>+{altTier1.length - 3}</span>}
              </div>

              {/* Trustpilot */}
              {alt.tp && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 12, color: "#64748b" }}>
                  <Stars r={alt.tp} size={12} />
                  <span style={{ fontWeight: 700 }}>{alt.tp}</span>
                  <span>({alt.tpCount?.toLocaleString()})</span>
                </div>
              )}

              <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
                <a href={altVisitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{ flex: 1, background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "9px 10px", borderRadius: 8, textAlign: "center", boxShadow: "0 2px 6px rgba(245,158,11,0.2)" }}>
                  Visit
                </a>
                <Link to={lp(`/review/${alt.slug}`)} className="cta-secondary" style={{ flex: 1, color: "#059669", fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "9px 10px", borderRadius: 8, textAlign: "center", border: "2px solid #059669" }}>
                  Review
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── 16. FAQ ── */}
      <H2 id="faq" icon={Shield}>Frequently Asked Questions</H2>

      <Card style={{ padding: mob ? "4px 18px" : "4px 22px" }}>
        {faqs.map((f, i) => (
          <FaqItem key={i} q={f.q} a={f.a} open={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} />
        ))}
      </Card>

      {/* ── Internal links ── */}
      <div style={{ marginTop: 32, padding: "20px 0", borderTop: "1px solid #e8ecf1" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Related Pages</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { label: `${B.name} Review`, path: `/review/${slug}` },
            { label: "Methodology", path: "/methodology" },
            { label: "All Reviews", path: "/reviews" },
            { label: "Best Forex Brokers", path: "/best-forex-brokers" },
            ...tier1Regs.slice(0, 3).map(r => {
              const rs = getRegulatorSlug(r.name);
              return rs ? { label: `${r.name} Regulated Brokers`, path: `/regulator/${rs}` } : null;
            }).filter(Boolean),
            { label: "Trust Score", path: "/trust-score" },
          ].map((link, i) => (
            <Link key={i} to={lp(link.path)} style={{ fontSize: 13, color: "#059669", fontWeight: 600, textDecoration: "none", padding: "7px 14px", background: "#ecfdf5", borderRadius: 8, border: "1px solid #a7f3d0", display: "inline-flex", alignItems: "center", gap: 4 }}>
              {link.label} <ArrowRight size={11} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div style={{ background: "#f8f9fb", minHeight: "100vh", paddingBottom: stickyVisible ? 60 : 0 }}>
      {/* ── 1. BREADCRUMBS ── */}
      <div style={{ ...cn, padding: mob ? "12px 16px 0" : "16px 24px 0" }}>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* ── 2. HERO BAND ── */}
      <HeroBand mob={mob} tab={tab}>
        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", alignItems: mob ? "flex-start" : "center", gap: mob ? 16 : 24 }}>
          <div style={{ flex: 1 }}>
            {/* Logo + verdict */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <WideLogo slug={slug} name={B.name} mob={mob} />
              <span style={{ background: verdict.bg, color: verdict.color, fontSize: mob ? 11 : 13, fontWeight: 700, padding: "4px 12px", borderRadius: 6, border: `1px solid ${verdict.border}`, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <VerdictIcon size={14} /> {verdict.label}
              </span>
            </div>

            <h1 style={{ fontFamily: "Outfit", fontSize: mob ? 26 : tab ? 32 : 38, fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: 0, marginBottom: 6 }}>
              Is {B.name} Safe?
            </h1>
            <p style={{ fontSize: mob ? 14 : 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, margin: 0, maxWidth: 600 }}>
              Expert Safety Analysis 2026 — {tier1Regs.length}x Tier-1 Regulated, {brokerAge} Years, {safety.totalUsers} Users
            </p>

            {/* Trustpilot */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
              <a href={getTrustpilotUrl(slug)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                <TrustpilotLogo size="xs" onDark />
                <Stars r={B.tp} size={14} />
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: "#fff" }}>{B.tp}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>({B.tpCount?.toLocaleString()})</span>
              </a>
            </div>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: mob ? 6 : 14, marginTop: 14, flexWrap: "wrap" }}>
              {[
                { l: "Tier-1", v: tier1Regs.length },
                { l: "Regulators", v: B.regs.length },
                { l: "Founded", v: B.year },
                ...(!mob ? [{ l: "Safety", v: `${regScore.score}/10` }] : []),
              ].map((x, i) => (
                <div key={i} style={{ textAlign: "center", padding: mob ? "5px 8px" : "6px 14px", background: "rgba(255,255,255,0.06)", borderRadius: 6 }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{x.l}</div>
                  <div style={{ fontSize: mob ? 14 : 16, color: "#fff", fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>{x.v}</div>
                </div>
              ))}
            </div>

            {mob && (
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", fontSize: 15, fontWeight: 700, textDecoration: "none", padding: 12, borderRadius: 10, marginTop: 14, boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}>
                Visit {B.name} <ExternalLink size={14} />
              </a>
            )}
          </div>

          {/* Right: Score card */}
          {!mob && (
            <div style={{ width: tab ? 200 : 240, flexShrink: 0, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "22px", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 4 }}>Safety Score</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 44, fontWeight: 800, color: "#34d399", lineHeight: 1 }}>{regScore.score}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>out of 10</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: verdict.bg, color: verdict.color, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 5, marginBottom: 14 }}>
                <VerdictIcon size={14} /> {verdict.label}
              </div>
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", fontSize: 15, fontWeight: 700, textDecoration: "none", padding: "12px 20px", borderRadius: 10, width: "100%", boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}>
                Visit {B.name} <ExternalLink size={14} />
              </a>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>{B.riskWarning?.split(".")[0]}.</div>
            </div>
          )}
        </div>
      </HeroBand>

      {/* ── MAIN LAYOUT — 3-column on desktop ── */}
      <div style={{ ...cn, display: mob ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: desk ? "180px 1fr 240px" : tab ? "1fr 220px" : "1fr", gap: mob ? 16 : 24, paddingTop: mob ? 20 : 28, paddingBottom: mob ? 40 : 64 }}>

        {/* LEFT TOC (desktop only) */}
        {desk && (
          <aside style={{ position: "sticky", top: 80, alignSelf: "start" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Contents</div>
            {TOC_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`} style={{ display: "block", fontSize: 13, color: "#374151", textDecoration: "none", padding: "5px 10px", borderLeft: "2px solid #e2e8f0", marginBottom: 1, lineHeight: 1.4 }}
                onMouseEnter={e => { e.currentTarget.style.borderLeftColor = "#059669"; e.currentTarget.style.color = "#059669"; }}
                onMouseLeave={e => { e.currentTarget.style.borderLeftColor = "#e2e8f0"; e.currentTarget.style.color = "#374151"; }}
              >{item.label}</a>
            ))}
          </aside>
        )}

        {/* CENTER CONTENT */}
        <main>{content}</main>

        {/* RIGHT SIDEBAR (desktop + tablet) */}
        {!mob && (
          <aside style={{ position: "sticky", top: 80, alignSelf: "start" }}>
            {/* Mini safety card */}
            <Card style={{ padding: "18px", textAlign: "center" }}>
              <BrokerLogo slug={slug} name={B.name} size={40} shape="icon" />
              <div style={{ fontFamily: "Outfit", fontSize: 15, fontWeight: 700, color: "#111827", marginTop: 8 }}>{B.name}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: verdict.bg, color: verdict.color, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, marginTop: 6 }}>
                <VerdictIcon size={12} /> {verdict.label}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 28, fontWeight: 800, color: "#059669", marginTop: 8 }}>{regScore.score}/10</div>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>Safety Score</div>
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{ display: "block", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "10px", borderRadius: 8, textAlign: "center", boxShadow: "0 2px 8px rgba(245,158,11,0.2)" }}>
                Visit {B.name}
              </a>
              <Link to={lp(`/review/${slug}`)} style={{ display: "block", color: "#059669", fontSize: 12, fontWeight: 600, textDecoration: "none", marginTop: 8 }}>
                Full Review <ArrowRight size={11} style={{ verticalAlign: "middle" }} />
              </Link>
            </Card>

            {/* Quick facts */}
            <Card style={{ padding: "16px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Quick Facts</div>
              {[
                { l: "Tier-1 Licenses", v: tier1Regs.length },
                { l: "Total Regulators", v: B.regs.length },
                { l: "Founded", v: B.year },
                { l: "Users", v: safety.totalUsers },
                { l: "Public", v: safety.publicCompany ? `${safety.stockTicker}` : "No" },
                { l: "Segregated Funds", v: safety.segregatedFunds ? "Yes" : "No" },
                { l: "NBP", v: safety.negativeBalanceProtection ? "Yes" : "No" },
                { l: "2FA", v: safety.twoFactorAuth ? "Yes" : "No" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 7 ? "1px solid #f0f4f8" : "none" }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{f.l}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{f.v}</span>
                </div>
              ))}
            </Card>
          </aside>
        )}
      </div>

      {/* ── STICKY CTA BAR ── */}
      <StickyCTA B={B} visitUrl={visitUrl} visible={stickyVisible} mob={mob} />
    </div>
  );
}
