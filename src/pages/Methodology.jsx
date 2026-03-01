import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { AUTHORS } from "../data/authors";
import { getRegulatorByName } from "../data/regulators";
import Icon from "../components/Icon";
import { ChevronDown } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

// ============================
// METHODOLOGY DATA
// ============================
const CRITERIA = [
  {
    id: "regulation",
    name: "Regulation & Safety",
    weight: 25,
    icon: "shield",
    color: "#059669",
    summary: "We verify every license number directly with the regulator's public database. No exceptions.",
    details: "A broker's regulatory status is the single most important factor in our evaluation. We don't just check if a broker claims to be regulated — we verify every license number directly on the regulator's website. We classify regulators into three tiers based on the strictness of their oversight, capital requirements, and investor protection schemes.",
    scoring: [
      { range: "9.0 – 10.0", desc: "Multiple Tier-1 licenses (FCA, ASIC, NFA, FINMA, MAS). Segregated funds, investor compensation, negative balance protection." },
      { range: "7.0 – 8.9", desc: "At least one Tier-1 + Tier-2 licenses (CySEC, DFSA, FMA). Segregated funds confirmed." },
      { range: "5.0 – 6.9", desc: "Tier-2 regulation only, or single Tier-1 license with offshore entities." },
      { range: "Below 5.0", desc: "Offshore-only regulation (VFSC, SVG, FSA Seychelles). We flag these brokers with warnings." },
    ],
    tiers: [
      { tier: "Tier 1", regs: ["FCA (UK)", "ASIC (Australia)", "NFA/CFTC (USA)", "FINMA (Switzerland)", "MAS (Singapore)", "BaFin (Germany)"], color: "#059669" },
      { tier: "Tier 2", regs: ["CySEC (Cyprus/EU)", "DFSA (Dubai)", "FMA (New Zealand)", "FSCA (South Africa)", "CMA (Kenya)"], color: "#d97706" },
      { tier: "Tier 3", regs: ["FSA (Seychelles)", "VFSC (Vanuatu)", "IFSC (Belize)", "FSC (Mauritius)"], color: "#dc2626" },
    ],
  },
  {
    id: "costs",
    name: "Trading Costs",
    weight: 20,
    icon: "dollar-sign",
    color: "#2563eb",
    summary: "We measure real spreads over 30 days with live accounts — not the minimums brokers advertise.",
    details: "Advertised spreads are meaningless. A broker may claim '0.0 pip spreads' but their average spread could be 0.5 pips with frequent widening. We open real accounts, deposit real money, and measure actual spreads across 500+ trades over a 30-day period. We calculate total cost per lot including spread + commission + any hidden fees.",
    scoring: [
      { range: "9.0 – 10.0", desc: "Total cost under $3/lot on EUR/USD. Commission under $7/lot RT. No hidden fees. No markup on raw spreads." },
      { range: "7.0 – 8.9", desc: "Total cost $3-6/lot. Competitive commission structure. Minimal hidden fees." },
      { range: "5.0 – 6.9", desc: "Total cost $6-10/lot. Spread markup present. Some hidden fees (inactivity, withdrawal)." },
      { range: "Below 5.0", desc: "Total cost above $10/lot. Heavy spread markup. Multiple hidden fees. Deceptive pricing." },
    ],
  },
  {
    id: "trustpilot",
    name: "User Reviews (Trustpilot)",
    weight: 15,
    icon: "star",
    color: "#00B67A",
    summary: "We aggregate real user sentiment and use NLP analysis to filter fake reviews.",
    details: "Trustpilot scores provide real-world feedback from actual traders. However, we don't just use the raw score — we analyze review patterns. We filter for fake positive reviews (same language patterns, burst reviews around the same date) and examine the substance of negative reviews (are complaints about execution, withdrawals, or just user error?). We weight recent reviews more heavily than older ones.",
    scoring: [
      { range: "9.0 – 10.0", desc: "Trustpilot 4.5+/5 with 10,000+ reviews. Minimal fake review patterns. Broker actively responds to complaints." },
      { range: "7.0 – 8.9", desc: "Trustpilot 4.0-4.4/5 with 5,000+ reviews. Some fake patterns but genuine core." },
      { range: "5.0 – 6.9", desc: "Trustpilot 3.5-3.9/5 or fewer than 2,000 reviews. Mixed sentiment." },
      { range: "Below 5.0", desc: "Trustpilot below 3.5/5 or significant fake review patterns detected." },
    ],
  },
  {
    id: "expert",
    name: "Expert Hands-On Test",
    weight: 20,
    icon: "microscope",
    color: "#7c3aed",
    summary: "Our verified traders open real accounts and test execution, slippage, and withdrawals personally.",
    details: "Every broker we rank is tested by at least two members of our team using real money. We open accounts, verify KYC, deposit funds, execute trades, test customer support, and withdraw money. This hands-on testing catches issues that no spreadsheet analysis can find: slow KYC, unresponsive support, hidden withdrawal conditions, platform bugs, and more. Each tester is a verified trader with a public LinkedIn profile.",
    scoring: [
      { range: "9.0 – 10.0", desc: "Flawless onboarding, fast KYC, responsive support, smooth withdrawals, no issues during 30-day test." },
      { range: "7.0 – 8.9", desc: "Minor issues (slow KYC, occasional support delays) but overall positive experience." },
      { range: "5.0 – 6.9", desc: "Notable friction (withdrawal delays, support gaps, platform issues)." },
      { range: "Below 5.0", desc: "Serious problems (KYC rejection, withdrawal blocking, unresponsive support, suspicious behavior)." },
    ],
  },
  {
    id: "platform",
    name: "Platforms & Tools",
    weight: 10,
    icon: "monitor",
    color: "#0ea5e9",
    summary: "We evaluate platform quality, mobile apps, charting tools, and API access.",
    details: "We test every platform a broker offers: MT4, MT5, cTrader, TradingView, proprietary platforms, and mobile apps. We evaluate charting capabilities, order types, indicator availability, algo trading support (EA/cBot), API access, and overall user experience. A broker offering only one platform scores lower than one offering multiple choices.",
    scoring: [
      { range: "9.0 – 10.0", desc: "3+ platforms (MT4/MT5/cTrader/TradingView). Excellent mobile apps. API access. Algo trading supported." },
      { range: "7.0 – 8.9", desc: "2+ platforms with good mobile apps. Some API or algo support." },
      { range: "5.0 – 6.9", desc: "Single platform or outdated software. Basic mobile experience." },
      { range: "Below 5.0", desc: "Proprietary-only platform with limited features. Poor mobile app or no mobile." },
    ],
  },
  {
    id: "execution",
    name: "Execution Quality",
    weight: 10,
    icon: "zap",
    color: "#f59e0b",
    summary: "We measure fill speed, slippage symmetry, requotes, and server uptime.",
    details: "Execution quality separates good brokers from great ones. We measure average execution speed (in milliseconds), slippage frequency and direction (symmetric vs asymmetric), requote rates, and order rejection rates. A broker with fast execution but asymmetric slippage (always against the trader) scores lower than a slightly slower broker with fair, symmetric slippage.",
    scoring: [
      { range: "9.0 – 10.0", desc: "Under 50ms average execution. Symmetric slippage. Zero requotes. 99.9%+ server uptime." },
      { range: "7.0 – 8.9", desc: "50-100ms execution. Mostly symmetric slippage. Rare requotes." },
      { range: "5.0 – 6.9", desc: "100-200ms execution. Slightly asymmetric slippage. Occasional requotes." },
      { range: "Below 5.0", desc: "Over 200ms execution. Clear asymmetric slippage. Frequent requotes or rejections." },
    ],
  },
];

const PROCESS_STEPS = [
  { step: "01", title: "Research & Shortlist", desc: "We identify brokers through market research, user requests, and industry monitoring. Each candidate must have at least one verifiable regulatory license.", duration: "1 week", icon: "search" },
  { step: "02", title: "License Verification", desc: "We manually verify every regulatory license on the regulator's public database. We check authorization scope, disciplinary history, and any sanctions.", duration: "1-2 days", icon: "shield" },
  { step: "03", title: "Account Opening & KYC", desc: "Two team members independently open real accounts, complete KYC verification, and deposit personal funds. We document the entire process.", duration: "2-5 days", icon: "clipboard-list" },
  { step: "04", title: "30-Day Live Testing", desc: "We execute 500+ trades across major pairs, measuring real spreads, execution speed, slippage, and requotes. We test during both calm and volatile markets.", duration: "30 days", icon: "bar-chart-3" },
  { step: "05", title: "Support & Withdrawal Test", desc: "We test customer support across all channels (chat, email, phone) with real questions. We request full withdrawal to verify speed and process.", duration: "1-2 weeks", icon: "message-circle" },
  { step: "06", title: "Scoring & Review Writing", desc: "Two experts independently score the broker across all 6 criteria. Scores are averaged. The lead analyst writes the full review, which is fact-checked by a second expert.", duration: "1 week", icon: "pen-tool" },
  { step: "07", title: "Quarterly Re-evaluation", desc: "Every published broker is re-tested quarterly. Scores are updated, new data is added, and rankings are adjusted. Brokers that decline are flagged or removed.", duration: "Ongoing", icon: "refresh-cw" },
];

const TEAM = [
  { ...AUTHORS["marcus-chen"], specialty: "ECN/STP Execution" },
  { ...AUTHORS["sarah-williams"], specialty: "Crypto Derivatives" },
  { ...AUTHORS["david-kowalski"], specialty: "Broker Licensing" },
  { ...AUTHORS["elena-petrova"], specialty: "Algo Trading" },
];

const FAQ = [
  { q: "How often are broker scores updated?", a: "Every quarter. We re-test all published brokers with live accounts, update spread data, re-check regulatory status, and incorporate new Trustpilot reviews. If a broker undergoes a significant change (new regulation, ownership change, security breach), we update immediately." },
  { q: "Do brokers pay to be listed?", a: "No. Our rankings are based entirely on our independent testing methodology. Some brokers on our site are affiliate partners, meaning we may earn a commission if you open an account through our links. This never affects our scores or rankings. Many of our top-ranked brokers have no affiliate relationship with us." },
  { q: "What happens if a broker's score drops?", a: "If a broker's score drops below 7.0, we add a warning notice to their review. Below 6.0, we move them to a 'Not Recommended' list. Below 5.0, we remove them entirely. We always notify the broker and give them 30 days to address issues before making changes." },
  { q: "Can I suggest a broker for review?", a: "Yes. Email us at reviews@ratedbrokers.com with the broker name and your experience. We prioritize brokers that multiple users request. However, the broker must have at least one verifiable regulatory license to be considered." },
  { q: "Why don't you include [specific broker]?", a: "We only review brokers we can test personally with real money. Some brokers restrict accounts based on geography, making testing impossible. Others are too new (under 2 years) or lack verifiable regulation. We're constantly expanding our coverage." },
  { q: "How do you handle conflicts of interest?", a: "Full transparency: some brokers listed on our site are affiliate partners. However, our scoring is done by analysts who have no visibility into affiliate relationships. The editorial team and business team are completely separate. Our methodology is public — anyone can verify our scores." },
];

// ============================
// COMPONENTS
// ============================
function WeightBar({ weight, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#e2e8f0", overflow: "hidden" }}>
        <div style={{ width: weight + "%", height: "100%", borderRadius: 4, background: color, transition: "width 0.5s" }}/>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 14, color, minWidth: 40, textAlign: "right" }}>{weight}%</span>
    </div>
  );
}

// ============================
// MAIN
// ============================
function useMedia() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const fn = () => setW(window.innerWidth); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  return { mob: w < 640, tab: w >= 640 && w < 1024, desk: w >= 1024 };
}

export default function MethodologyPage() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const { mob, tab } = useMedia();
  const [scrolled, setScrolled] = useState(false);
  const [expandedCriteria, setExpandedCriteria] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  useEffect(() => {
    document.title = "How We Test Forex Brokers: Our Methodology | RatedBrokers";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Our 8-category scoring system explained. We open live accounts, deposit real money, and execute 500+ trades to rank brokers. Transparent, data-driven methodology.");
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#1e293b", minHeight: "100vh" }}>
      {/* Fonts and header rendered by App.jsx */}

      {/* BREADCRUMBS */}
      <div style={{ paddingTop: 0 }}>
        <div style={{ ...cn, padding: "16px 24px" }}>
          <Breadcrumb items={[
            { label: t("meth.breadHome"), path: "/" },
            { label: t("meth.breadMeth") },
          ]} />
        </div>
      </div>

      {/* =================== HERO =================== */}
      <section style={{ ...cn, marginBottom: 40 }}>
        <div style={{ maxWidth: 780 }}>
          <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 26 : 42, lineHeight: 1.15, color: "#0f172a", margin: "0 0 14px" }}>
            {t("meth.title")}
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: "#475569", margin: "0 0 24px" }}>
            {t("meth.desc")}
          </p>

          {/* Trust stats */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { val: "54", label: t("meth.brokersTested") },
              { val: "30", label: t("meth.daysPerTest") },
              { val: "500+", label: t("meth.tradesPerBroker") },
              { val: "4", label: t("meth.expertReviewers") },
              { val: t("meth.quarterly"), label: t("meth.reEvaluation") },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "12px 20px", borderRadius: 10, background: "#fff",
                border: "1px solid #e2e8f0", textAlign: "center",
              }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 22, color: "#059669" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== CORE PRINCIPLE =================== */}
      <section style={{ ...cn, marginBottom: 40 }}>
        <div style={{
          padding: "24px 28px", borderRadius: 14,
          background: "linear-gradient(135deg,#0f172a,#1e3a5f)",
          display: "flex", gap: 20, alignItems: "center",
        }}>
          <span style={{ flexShrink: 0, display: "flex" }}><Icon name="crosshair" size={48} color="#34d399" /></span>
          <div>
            <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 6 }}>
              {t("meth.coreTitle")}
            </div>
            <div style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.7 }}>
              {t("meth.coreDesc")}
            </div>
          </div>
        </div>
      </section>

      {/* =================== SCORING FORMULA =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
          {t("meth.formulaTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#64748b", marginBottom: 10, maxWidth: 700 }}>
          {t("meth.formulaDesc")}
        </p>

        {/* Formula visualization */}
        <div style={{
          padding: "20px 24px", borderRadius: 14, background: "#fff",
          border: "1px solid #e2e8f0", marginBottom: 24,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#334155",
            padding: "14px 20px", borderRadius: 10, background: "#f8f9fb",
            textAlign: "center", lineHeight: 2,
          }}>
            <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 16 }}>{t("meth.overallScore")}</span> =<br/>
            (<span style={{ color: "#059669", fontWeight: 700 }}>{t("criteria.regulation")} × 0.25</span>) +
            (<span style={{ color: "#2563eb", fontWeight: 700 }}>{t("criteria.costs")} × 0.20</span>) +
            (<span style={{ color: "#00B67A", fontWeight: 700 }}>{t("criteria.trustpilot")} × 0.15</span>) +
            (<span style={{ color: "#7c3aed", fontWeight: 700 }}>{t("criteria.expert")} × 0.20</span>) +
            (<span style={{ color: "#0ea5e9", fontWeight: 700 }}>{t("criteria.platform")} × 0.10</span>) +
            (<span style={{ color: "#f59e0b", fontWeight: 700 }}>{t("criteria.execution")} × 0.10</span>)
          </div>
        </div>

        {/* Weight bars overview */}
        <div style={{
          display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 32,
        }}>
          {CRITERIA.map((c, i) => (
            <div key={i} style={{
              padding: "16px 20px", borderRadius: 12,
              background: "#fff", border: "1px solid #e2e8f0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Icon name={c.icon} size={20} color={c.color} />
                <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15 }}>{t("criteria." + c.id)}</span>
              </div>
              <WeightBar weight={c.weight} color={c.color} />
            </div>
          ))}
        </div>
      </section>

      {/* =================== DETAILED CRITERIA =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 20 }}>
          {t("meth.detailedTitle")}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CRITERIA.map((c, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0",
              overflow: "hidden", borderLeft: `4px solid ${c.color}`,
            }}>
              {/* Header - always visible */}
              <div
                onClick={() => setExpandedCriteria(expandedCriteria === i ? null : i)}
                style={{
                  padding: "20px 24px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 14,
                }}
              >
                <Icon name={c.icon} size={28} color={c.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 19 }}>{t("criteria." + c.id)}</span>
                    <span style={{
                      padding: "3px 10px", borderRadius: 6,
                      background: c.color + "14", color: c.color,
                      fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 800,
                    }}>{c.weight}% {t("meth.weight")}</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>{c.summary}</div>
                </div>
                <span style={{
                  color: "#94a3b8", transition: "transform 0.2s",
                  transform: expandedCriteria === i ? "rotate(180deg)" : "none",
                  display: "inline-flex",
                }}><ChevronDown size={20} /></span>
              </div>

              {/* Expanded content */}
              {expandedCriteria === i && (
                <div style={{ padding: "0 24px 24px", borderTop: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: "#334155", margin: "16px 0 20px" }}>
                    {c.details}
                  </p>

                  {/* Scoring table */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{t("meth.howWeScore")}</div>
                    <div style={{ borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                      {c.scoring.map((s, si) => (
                        <div key={si} style={{
                          display: "flex", gap: 16, padding: "12px 16px",
                          background: si % 2 === 0 ? "#fff" : "#f8f9fb",
                          borderBottom: si < c.scoring.length - 1 ? "1px solid #f1f5f9" : "none",
                        }}>
                          <span style={{
                            fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 13,
                            color: si === 0 ? "#059669" : si === 1 ? "#2563eb" : si === 2 ? "#d97706" : "#dc2626",
                            minWidth: 90,
                          }}>{s.range}</span>
                          <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{s.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regulation tiers (only for regulation criteria) */}
                  {c.tiers && (
                    <div>
                      <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{t("meth.regulatorTiers")}</div>
                      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
                        {c.tiers.map((tier, ti) => (
                          <div key={ti} style={{
                            padding: "14px 16px", borderRadius: 10,
                            background: tier.color + "08", border: `1px solid ${tier.color}30`,
                          }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: tier.color, marginBottom: 8 }}>{tier.tier}</div>
                            {tier.regs.map((r, ri) => {
                              const abbr = r.split(" (")[0].split("/")[0];
                              const regData = getRegulatorByName(abbr);
                              return (
                                <div key={ri} style={{ fontSize: 12, color: "#475569", padding: "2px 0" }}>
                                  {regData ? <Link to={lp(`/regulator/${regData.slug}`)} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>{r}</Link> : r}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =================== TESTING PROCESS =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
          {t("meth.processTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#64748b", marginBottom: 24, maxWidth: 700 }}>
          {t("meth.processDesc")}
        </p>

        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: 27, top: 0, bottom: 0, width: 2,
            background: "linear-gradient(to bottom, #059669, #2563eb, #7c3aed)",
          }}/>

          {PROCESS_STEPS.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 20, marginBottom: 20, position: "relative",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: "#fff", border: "2px solid #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, zIndex: 1,
              }}><Icon name={s.icon} size={24} color="#059669" /></div>
              <div style={{
                flex: 1, padding: "18px 22px", borderRadius: 14,
                background: "#fff", border: "1px solid #e2e8f0",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 800,
                    color: "#059669", background: "#ecfdf5", padding: "2px 8px", borderRadius: 4,
                  }}>{t("meth.step")} {s.step}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>⏱ {s.duration}</span>
                </div>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================== ANTI-KITCHEN PLEDGE =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <div style={{
          padding: "32px", borderRadius: 16,
          background: "#fef2f2", border: "2px solid #fecaca",
        }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <span style={{ flexShrink: 0, display: "flex" }}><Icon name="ban" size={48} color="#dc2626" /></span>
            <div>
              <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 26, color: "#991b1b", margin: "0 0 10px" }}>
                {t("meth.pledgeTitle")}
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "#b91c1c", margin: "0 0 16px" }}>
                {t("meth.pledgeDesc1")}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "#b91c1c", margin: "0 0 16px" }}>
                {t("meth.pledgeDesc2")}
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <Link to={lp("/guide/ecn-vs-market-maker")} style={{
                  padding: "10px 20px", borderRadius: 8,
                  background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: 13,
                  textDecoration: "none",
                }}>{t("meth.pledgeLink1")}</Link>
                <Link to={lp("/best-a-book-forex-brokers")} style={{
                  padding: "10px 20px", borderRadius: 8,
                  background: "#fff", color: "#dc2626", fontWeight: 700, fontSize: 13,
                  textDecoration: "none", border: "1px solid #fecaca",
                }}>{t("meth.pledgeLink2")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== OUR TEAM =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
          {t("meth.teamTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#64748b", marginBottom: 20 }}>
          {t("meth.teamDesc")}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : tab ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16 }}>
          {TEAM.map((member, i) => (
            <div key={i} style={{
              padding: "24px 20px", borderRadius: 14,
              background: "#fff", border: "1px solid #e2e8f0",
              textAlign: "center",
            }}>
              {member.image ? (
                <img src={member.image} alt={member.name} style={{
                  width: 64, height: 64, borderRadius: "50%",
                  objectFit: "cover", margin: "0 auto 12px",
                }} />
              ) : (
                <div style={{
                  width: 64, height: 64, borderRadius: "50%", background: "#1e3a5f",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 22, fontFamily: "Outfit",
                  margin: "0 auto 12px",
                }}>{member.initials}</div>
              )}
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17 }}>{member.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>{member.role}</div>
              <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 6, marginBottom: 12 }}>
                <div style={{ padding: "6px", borderRadius: 6, background: "#f8f9fb" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16, color: "#059669" }}>{member.reviews}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8" }}>{t("meth.teamReviews")}</div>
                </div>
                <div style={{ padding: "6px", borderRadius: 6, background: "#f8f9fb" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{member.exp}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8" }}>{t("meth.teamExperience")}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>{t("meth.teamSpecialty")}: {member.specialty}</div>
              <a href={member.linkedin} style={{
                display: "block", padding: "8px", borderRadius: 6,
                background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 600,
                textDecoration: "none", border: "1px solid #bfdbfe",
              }}>{t("meth.verifyLinkedin")}</a>
            </div>
          ))}
        </div>
      </section>

      {/* =================== AFFILIATE DISCLOSURE =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <div style={{
          padding: "24px 28px", borderRadius: 14,
          background: "#fffbeb", border: "1px solid #fde68a", borderLeft: "4px solid #d97706",
        }}>
          <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, color: "#92400e", margin: "0 0 10px" }}>
            {t("meth.affTitle")}
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "#78350f", margin: "0 0 12px" }}>
            {t("meth.affDesc1")}
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "#78350f", margin: "0 0 12px" }}>
            <strong>{t("meth.affDesc2")}</strong>
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "#78350f", margin: 0 }}>
            {t("meth.affDesc3")}
          </p>
        </div>
      </section>

      {/* =================== FAQ =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 20 }}>
          {t("meth.faqTitle")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)} style={{
                padding: "16px 20px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{item.q}</span>
                <span style={{ color: "#64748b", transform: expandedFAQ === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-flex" }}><ChevronDown size={18} /></span>
              </div>
              {expandedFAQ === i && (
                <div style={{ padding: "0 20px 18px", fontSize: 14, lineHeight: 1.8, color: "#334155", borderTop: "1px solid #f1f5f9" }}>
                  <p style={{ marginTop: 12 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =================== CTA =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <div style={{
          padding: "40px", borderRadius: 16,
          background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, color: "#fff", marginBottom: 8 }}>
            {t("meth.ctaTitle")}
          </div>
          <div style={{ fontSize: 16, color: "#94a3b8", marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
            {t("meth.ctaDesc")}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to={lp("/")} style={{
              padding: "14px 32px", borderRadius: 10,
              background: "linear-gradient(135deg,#059669,#34d399)",
              color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none",
            }}>{t("meth.viewRankings")}</Link>
            <Link to={lp("/best-ecn-forex-brokers")} style={{
              padding: "14px 32px", borderRadius: 10,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", fontWeight: 600, fontSize: 16, textDecoration: "none",
            }}>{t("meth.bestECN")}</Link>
          </div>
        </div>
      </section>

      {/* Footer rendered by App.jsx */}
    </div>
  );
}
