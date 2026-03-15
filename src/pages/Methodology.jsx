import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { AUTHORS } from "../data/authors";
import { getRegulatorByName } from "../data/regulators";
import { getBrokerData } from "../data/brokers/index";
import { TRUST_SCORE_TIERS, CRITERIA_V2, CHANGELOG, FAQ_METHODOLOGY } from "../data/methodologyData";
import Icon from "../components/Icon";
import RegulatorLogo from "../components/RegulatorLogo";
import { ChevronDown } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

// ============================
// STATIC DATA
// ============================
const PROCESS_STEPS = [
  { step: "01", title: "Research & Shortlist", desc: "We identify brokers through market research, user requests, and industry monitoring. Each candidate must hold at least one Tier-1 regulatory license (knockout criterion).", duration: "1 week", icon: "search" },
  { step: "02", title: "License Verification", desc: "We manually verify every regulatory license on the regulator's public database. We check authorization scope, disciplinary history, and any sanctions.", duration: "1-2 days", icon: "shield" },
  { step: "03", title: "Data Collection", desc: "We collect spread data, fee schedules, platform features, and account conditions from broker websites and independent comparison sources.", duration: "3-5 days", icon: "clipboard-list" },
  { step: "04", title: "User Review Aggregation", desc: "We aggregate Trustpilot scores, review volume, recency, and broker response patterns. We assess sentiment consistency across review platforms.", duration: "1-2 days", icon: "star" },
  { step: "05", title: "Cross-Verification", desc: "We cross-check data points across multiple sources. Flag discrepancies for manual review. Verify fee disclosure, withdrawal conditions, and ownership structure for transparency scoring.", duration: "2-3 days", icon: "check-circle" },
  { step: "06", title: "Scoring & Review Writing", desc: "We apply our scoring formula across all 6 criteria. The lead analyst writes the full review, which is fact-checked by a second expert.", duration: "1 week", icon: "pen-tool" },
  { step: "07", title: "Quarterly Update", desc: "Every published broker is re-evaluated quarterly. Scores are updated, new data is collected, and rankings are adjusted. Brokers that decline are flagged or removed.", duration: "Ongoing", icon: "refresh-cw" },
];

const TEAM = [
  { ...AUTHORS["marcus-chen"], specialty: "ECN/STP Execution" },
  { ...AUTHORS["sarah-williams"], specialty: "Crypto Derivatives" },
  { ...AUTHORS["david-kowalski"], specialty: "Broker Licensing" },
  { ...AUTHORS["elena-petrova"], specialty: "Algo Trading" },
];

const TOC_ITEMS = [
  { id: "score-explained", label: "RatedBrokers Score Explained" },
  { id: "scoring-formula", label: "Scoring Formula" },
  { id: "detailed-criteria", label: "Detailed Criteria & Sub-Criteria" },
  { id: "scoring-example", label: "Scoring Example: IC Markets" },
  { id: "testing-process", label: "Our Testing Process" },
  { id: "editorial-independence", label: "Editorial Independence" },
  { id: "anti-kitchen", label: "Anti-Kitchen Broker Pledge" },
  { id: "changelog", label: "Update Schedule & Changelog" },
  { id: "team", label: "Our Expert Team" },
  { id: "faq", label: "FAQ" },
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
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 15, color, minWidth: 40, textAlign: "right" }}>{weight}%</span>
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
  const [expandedCriteria, setExpandedCriteria] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Get IC Markets data for scoring example
  const icData = getBrokerData("ic-markets");

  useEffect(() => {
    document.title = "How We Test Forex Brokers: Our Methodology | RatedBrokers";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Our 6-category scoring methodology explained. We verify regulatory licenses, collect spread data from independent sources, and aggregate user reviews to rank brokers. Transparent, research-based methodology with full sub-criteria breakdown.");

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: "How We Test & Rate Forex Brokers: Our Methodology",
          description: "RatedBrokers methodology: 6 weighted criteria, research-based scoring with transparent formula.",
          author: [
            { "@type": "Person", name: "Marcus Chen", jobTitle: "Senior Forex Analyst" },
            { "@type": "Person", name: "David Kowalski", jobTitle: "Compliance Analyst" },
          ],
          publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
          datePublished: "2024-06-01",
          dateModified: "2026-03-01",
        },
        {
          "@type": "FAQPage",
          mainEntity: FAQ_METHODOLOGY.map(item => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
        {
          "@type": "HowTo",
          name: "How RatedBrokers Tests Forex Brokers",
          step: PROCESS_STEPS.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.desc,
          })),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "RatedBrokers", item: "https://ratedbrokers.com/" },
            { "@type": "ListItem", position: 2, name: "Methodology", item: "https://ratedbrokers.com/methodology" },
          ],
        },
      ],
    };
    let el = document.getElementById("methodology-schema");
    if (!el) {
      el = document.createElement("script");
      el.id = "methodology-schema";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    return () => { if (el.parentNode) el.parentNode.removeChild(el); };
  }, []);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#111827", minHeight: "100vh" }}>

      {/* BREADCRUMBS */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: t("meth.breadMeth") },
        ]} />
      </div>

      {/* =================== HERO =================== */}
      <section style={{ ...cn, marginBottom: 24 }}>
        <div style={{ maxWidth: 780 }}>
          <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 26 : 42, lineHeight: 1.15, color: "#0f172a", margin: "0 0 14px" }}>
            {t("meth.title")}
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: "#1f2937", margin: "0 0 24px" }}>
            {t("meth.desc")}
          </p>

          {/* Trust stats */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { val: "6", label: t("meth.scoringCategories") },
              { val: "Tier-1", label: t("meth.knockoutReq") },
              { val: "4", label: t("meth.expertReviewers") },
              { val: t("meth.quarterly"), label: t("meth.reEvaluation") },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "12px 20px", borderRadius: 10, background: "#fff",
                border: "1px solid #e2e8f0", textAlign: "center",
              }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 22, color: "#059669" }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "#1f2937", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== AUTHOR BYLINE =================== */}
      <section style={{ ...cn, marginBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, fontSize: 14, color: "#1f2937" }}>
          <span>{t("meth.writtenBy")} <strong style={{ color: "#111827" }}>Marcus Chen, CMT</strong></span>
          <span style={{ color: "#e2e8f0" }}>|</span>
          <span>{t("meth.factChecked")} <strong style={{ color: "#111827" }}>David Kowalski, CAMS</strong></span>
          <span style={{ color: "#e2e8f0" }}>|</span>
          <span style={{
            padding: "2px 8px", borderRadius: 4,
            background: "#ecfdf5", color: "#059669", fontSize: 12, fontWeight: 600,
          }}>{t("meth.lastUpdated")}: March 2026</span>
          <span style={{
            padding: "2px 8px", borderRadius: 4,
            background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 600,
          }}>{t("meth.nextReview")}: June 2026</span>
        </div>
      </section>

      {/* =================== TABLE OF CONTENTS =================== */}
      <section style={{ ...cn, marginBottom: 40 }}>
        <div style={{
          padding: "20px 24px", borderRadius: 14,
          background: "#fff", border: "1px solid #e2e8f0",
        }}>
          <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 16, marginBottom: 12, color: "#0f172a" }}>
            {t("meth.tocTitle")}
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: "4px 24px",
          }}>
            {TOC_ITEMS.map((item, i) => (
              <a key={i} href={`#${item.id}`} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 0", fontSize: 15, color: "#2563eb",
                textDecoration: "none", fontWeight: 500,
                transition: "color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#059669"}
                onMouseLeave={e => e.currentTarget.style.color = "#2563eb"}
              >
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#1f2937", minWidth: 20 }}>{i + 1}.</span>
                {item.label}
              </a>
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
            <div style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7 }}>
              {t("meth.coreDesc")}
            </div>
          </div>
        </div>
      </section>

      {/* =================== RATEDBROKERS SCORE EXPLAINED =================== */}
      <section id="score-explained" style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
          {t("meth.scoreExplainedTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#1f2937", marginBottom: 20, maxWidth: 700 }}>
          {t("meth.scoreExplainedDesc")}
        </p>

        {/* Score tiers */}
        <div style={{
          display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(5, 1fr)", gap: 12,
        }}>
          {TRUST_SCORE_TIERS.map((tier, i) => (
            <div key={i} style={{
              padding: "18px 16px", borderRadius: 12,
              background: "#fff", border: `2px solid ${tier.color}30`,
              borderTop: `4px solid ${tier.color}`,
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 20,
                color: tier.color, marginBottom: 4,
              }}>{tier.min}–{tier.max}</div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{tier.label}</div>
              <div style={{ fontSize: 13, color: "#1f2937", lineHeight: 1.6 }}>{tier.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <Link to={lp("/trust-score")} style={{
            color: "#059669", fontWeight: 600, fontSize: 15, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 4,
          }}>Learn how to interpret scores & search any broker →</Link>
        </div>
      </section>

      {/* =================== SCORING FORMULA =================== */}
      <section id="scoring-formula" style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
          {t("meth.formulaTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#1f2937", marginBottom: 10, maxWidth: 700 }}>
          {t("meth.formulaDesc")}
        </p>

        {/* Formula visualization */}
        <div style={{
          padding: "20px 24px", borderRadius: 14, background: "#fff",
          border: "1px solid #e2e8f0", marginBottom: 24,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 15, color: "#1f2937",
            padding: "14px 20px", borderRadius: 10, background: "#f8f9fb",
            textAlign: "center", lineHeight: 2,
          }}>
            <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 16 }}>{t("meth.overallScore")}</span> =<br/>
            (<span style={{ color: "#059669", fontWeight: 700 }}>{t("criteria.regulation")} × 0.30</span>) +
            (<span style={{ color: "#2563eb", fontWeight: 700 }}>{t("criteria.costs")} × 0.20</span>) +
            (<span style={{ color: "#00B67A", fontWeight: 700 }}>{t("criteria.reputation")} × 0.15</span>) +
            (<span style={{ color: "#7c3aed", fontWeight: 700 }}>{t("criteria.transparency")} × 0.15</span>) +
            (<span style={{ color: "#0ea5e9", fontWeight: 700 }}>{t("criteria.platform")} × 0.15</span>) +
            (<span style={{ color: "#f59e0b", fontWeight: 700 }}>{t("criteria.execution")} × 0.05</span>)
          </div>
        </div>

        {/* Weight bars overview */}
        <div style={{
          display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 32,
        }}>
          {CRITERIA_V2.map((c, i) => (
            <div key={i} style={{
              padding: "16px 20px", borderRadius: 12,
              background: "#fff", border: "1px solid #e2e8f0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Icon name={c.icon} size={20} color={c.color} />
                <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16 }}>{t("criteria." + c.key)}</span>
              </div>
              <WeightBar weight={c.weight} color={c.color} />
            </div>
          ))}
        </div>
      </section>

      {/* =================== DETAILED CRITERIA WITH SUB-CRITERIA =================== */}
      <section id="detailed-criteria" style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 20 }}>
          {t("meth.detailedTitle")}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CRITERIA_V2.map((c, i) => (
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
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 19 }}>{t("criteria." + c.key)}</span>
                    <span style={{
                      padding: "3px 10px", borderRadius: 6,
                      background: c.color + "14", color: c.color,
                      fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 800,
                    }}>{c.weight}% {t("meth.weight")}</span>
                    <span style={{
                      padding: "3px 10px", borderRadius: 6,
                      background: "#f1f5f9", color: "#1f2937",
                      fontSize: 12, fontWeight: 600,
                    }}>{c.subCriteria.length} sub-criteria</span>
                  </div>
                  <div style={{ fontSize: 15, color: "#1f2937", marginTop: 4 }}>{c.summary}</div>
                </div>
                <span style={{
                  color: "#1f2937", transition: "transform 0.2s",
                  transform: expandedCriteria === i ? "rotate(180deg)" : "none",
                  display: "inline-flex",
                }}><ChevronDown size={20} /></span>
              </div>

              {/* Expanded content */}
              {expandedCriteria === i && (
                <div style={{ padding: "0 24px 24px", borderTop: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", margin: "16px 0 20px" }}>
                    {c.details}
                  </p>

                  {/* Sub-criteria table */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{t("meth.subCriteriaTitle")}</div>
                    <div style={{ borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                      <div style={{
                        display: "grid", gridTemplateColumns: "1fr 60px",
                        padding: "10px 16px", background: c.color + "08",
                        fontWeight: 700, fontSize: 13, color: "#1f2937", textTransform: "uppercase",
                      }}>
                        <div>{t("meth.subCriteriaName")}</div>
                        <div style={{ textAlign: "center" }}>{t("meth.weight")}</div>
                      </div>
                      {c.subCriteria.map((sc, si) => (
                        <div key={si} style={{
                          display: "grid", gridTemplateColumns: "1fr 60px",
                          padding: "10px 16px",
                          background: si % 2 === 0 ? "#fff" : "#f8f9fb",
                          borderTop: "1px solid #f1f5f9",
                        }}>
                          <span style={{ fontSize: 14, color: "#1f2937" }}>{sc.name}</span>
                          <span style={{
                            textAlign: "center", fontFamily: "'JetBrains Mono',monospace",
                            fontWeight: 700, fontSize: 14, color: c.color,
                          }}>{sc.weight}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

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
                            fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14,
                            color: si === 0 ? "#059669" : si === 1 ? "#2563eb" : si === 2 ? "#d97706" : "#dc2626",
                            minWidth: 90,
                          }}>{s.range}</span>
                          <span style={{ fontSize: 14, color: "#1f2937", lineHeight: 1.6 }}>{s.desc}</span>
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
                            <div style={{ fontWeight: 700, fontSize: 15, color: tier.color, marginBottom: 8 }}>{tier.tier}</div>
                            {tier.regs.map((r, ri) => {
                              const abbr = r.split(" (")[0].split("/")[0];
                              const regData = getRegulatorByName(abbr);
                              return (
                                <div key={ri} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#1f2937", padding: "3px 0" }}>
                                  {regData && <RegulatorLogo slug={regData.slug} name={regData.name} size={18} shape="icon" tier={ti + 1} />}
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

      {/* =================== SCORING EXAMPLE =================== */}
      <section id="scoring-example" style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
          {t("meth.scoringExampleTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#1f2937", marginBottom: 20, maxWidth: 700 }}>
          {t("meth.scoringExampleDesc")}
        </p>

        {icData && (
          <div style={{
            borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", background: "#fff",
          }}>
            {/* Header */}
            <div style={{
              padding: "16px 24px", background: "linear-gradient(135deg,#0f172a,#1e3a5f)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, color: "#fff" }}>
                  {icData.B.name}
                </div>
                <div style={{ fontSize: 14, color: "#64748b" }}>{t("meth.scoringExampleSubtitle")}</div>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 28,
                color: "#34d399",
              }}>{icData.B.score}</div>
            </div>

            {/* Table header */}
            <div style={{
              display: "grid", gridTemplateColumns: mob ? "1fr 60px 60px 70px" : "2fr 80px 80px 100px",
              padding: "10px 24px", background: "#f8f9fb",
              fontWeight: 700, fontSize: 13, color: "#1f2937", textTransform: "uppercase",
            }}>
              <div>{t("meth.criterion")}</div>
              <div style={{ textAlign: "center" }}>{t("meth.weight")}</div>
              <div style={{ textAlign: "center" }}>{t("meth.score")}</div>
              <div style={{ textAlign: "center" }}>{t("meth.weighted")}</div>
            </div>

            {/* Score rows */}
            {icData.SCORES.map((s, i) => {
              const weighted = (s.score * s.weight / 100).toFixed(2);
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: mob ? "1fr 60px 60px 70px" : "2fr 80px 80px 100px",
                  padding: "12px 24px", borderTop: "1px solid #f1f5f9",
                  background: i % 2 === 0 ? "#fff" : "#fafbfc",
                }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{s.name}</div>
                  <div style={{
                    textAlign: "center", fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 14, color: "#1f2937",
                  }}>{s.weight}%</div>
                  <div style={{
                    textAlign: "center", fontFamily: "'JetBrains Mono',monospace",
                    fontWeight: 700, fontSize: 15, color: "#059669",
                  }}>{s.score}</div>
                  <div style={{
                    textAlign: "center", fontFamily: "'JetBrains Mono',monospace",
                    fontWeight: 700, fontSize: 15, color: "#111827",
                  }}>{weighted}</div>
                </div>
              );
            })}

            {/* Total */}
            <div style={{
              display: "grid", gridTemplateColumns: mob ? "1fr 60px 60px 70px" : "2fr 80px 80px 100px",
              padding: "14px 24px", borderTop: "2px solid #e2e8f0",
              background: "#ecfdf5",
            }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 16 }}>{t("meth.total")}</div>
              <div></div>
              <div></div>
              <div style={{
                textAlign: "center", fontFamily: "'JetBrains Mono',monospace",
                fontWeight: 800, fontSize: 18, color: "#059669",
              }}>{icData.B.score}</div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <Link to={lp("/review/ic-markets")} style={{
            color: "#2563eb", fontWeight: 600, textDecoration: "none", fontSize: 15,
          }}>{t("meth.readFullReview")} →</Link>
        </div>
      </section>

      {/* =================== TESTING PROCESS =================== */}
      <section id="testing-process" style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
          {t("meth.processTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#1f2937", marginBottom: 24, maxWidth: 700 }}>
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
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800,
                    color: "#059669", background: "#ecfdf5", padding: "2px 8px", borderRadius: 4,
                  }}>{t("meth.step")} {s.step}</span>
                  <span style={{ fontSize: 13, color: "#1f2937" }}>⏱ {s.duration}</span>
                </div>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 15, color: "#1f2937", lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================== EDITORIAL INDEPENDENCE =================== */}
      <section id="editorial-independence" style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 20 }}>
          {t("meth.editorialTitle")}
        </h2>
        <div style={{
          padding: "28px", borderRadius: 14,
          background: "#fff", border: "1px solid #e2e8f0",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Icon name="shield" size={20} color="#059669" />
                <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17 }}>{t("meth.editorialWall")}</span>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "#1f2937", margin: "0 0 16px" }}>
                {t("meth.editorialWallDesc")}
              </p>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Icon name="eye-off" size={20} color="#7c3aed" />
                <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17 }}>{t("meth.editorialBlind")}</span>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "#1f2937", margin: "0 0 16px" }}>
                {t("meth.editorialBlindDesc")}
              </p>
            </div>
          </div>
          <div style={{
            padding: "14px 20px", borderRadius: 10,
            background: "#f8f9fb", marginTop: 8,
          }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#1f2937", margin: 0 }}>
              <strong>{t("meth.editorialProof")}</strong>{" "}
              {t("meth.editorialProofDesc")}
            </p>
          </div>
          <div style={{ marginTop: 16 }}>
            <Link to={lp("/how-we-make-money")} style={{
              color: "#059669", fontWeight: 600, textDecoration: "none", fontSize: 15,
            }}>{t("meth.editorialLink")} →</Link>
          </div>
        </div>
      </section>

      {/* =================== ANTI-KITCHEN PLEDGE =================== */}
      <section id="anti-kitchen" style={{ ...cn, marginBottom: 48 }}>
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
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#b91c1c", margin: "0 0 16px" }}>
                {t("meth.pledgeDesc1")}
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#b91c1c", margin: "0 0 16px" }}>
                {t("meth.pledgeDesc2")}
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to={lp("/guide/ecn-vs-market-maker")} style={{
                  padding: "10px 20px", borderRadius: 8,
                  background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: 14,
                  textDecoration: "none",
                }}>{t("meth.pledgeLink1")}</Link>
                <Link to={lp("/best-a-book-forex-brokers")} style={{
                  padding: "10px 20px", borderRadius: 8,
                  background: "#fff", color: "#dc2626", fontWeight: 700, fontSize: 14,
                  textDecoration: "none", border: "1px solid #fecaca",
                }}>{t("meth.pledgeLink2")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== UPDATE SCHEDULE & CHANGELOG =================== */}
      <section id="changelog" style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
          {t("meth.changelogTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#1f2937", marginBottom: 20, maxWidth: 700 }}>
          {t("meth.changelogDesc")}
        </p>

        {/* Update triggers */}
        <div style={{
          padding: "16px 20px", borderRadius: 10,
          background: "#eff6ff", border: "1px solid #bfdbfe", marginBottom: 20,
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1e40af", marginBottom: 8 }}>{t("meth.triggerTitle")}</div>
          <div style={{ fontSize: 14, color: "#1e3a8a", lineHeight: 1.7 }}>
            {t("meth.triggerList")}
          </div>
        </div>

        {/* Changelog table */}
        <div style={{ borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", background: "#fff" }}>
          <div style={{
            display: "grid", gridTemplateColumns: mob ? "80px 80px 80px 1fr" : "100px 120px 100px 1fr",
            padding: "10px 20px", background: "#f8f9fb",
            fontWeight: 700, fontSize: 13, color: "#1f2937", textTransform: "uppercase",
          }}>
            <div>{t("meth.clDate")}</div>
            <div>{t("meth.clBroker")}</div>
            <div>{t("meth.clChange")}</div>
            <div>{t("meth.clReason")}</div>
          </div>
          {CHANGELOG.map((entry, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: mob ? "80px 80px 80px 1fr" : "100px 120px 100px 1fr",
              padding: "12px 20px", borderTop: "1px solid #f1f5f9",
              background: i % 2 === 0 ? "#fff" : "#fafbfc",
              fontSize: 14,
            }}>
              <div style={{ color: "#1f2937" }}>{entry.date}</div>
              <div style={{ fontWeight: 600 }}>{entry.broker}</div>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 13,
                color: entry.change.includes("→") && entry.change.split("→")[0].trim() !== entry.change.split("→")[1].trim()
                  ? (parseFloat(entry.change.split("→")[1]) > parseFloat(entry.change.split("→")[0]) ? "#059669" : "#dc2626")
                  : "#374151",
              }}>{entry.change}</div>
              <div style={{ color: "#1f2937" }}>{entry.reason}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =================== OUR TEAM =================== */}
      <section id="team" style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
          {t("meth.teamTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#1f2937", marginBottom: 20 }}>
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
              <div style={{ fontSize: 13, color: "#1f2937", marginBottom: 10 }}>{member.role}</div>
              <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 6, marginBottom: 12 }}>
                <div style={{ padding: "6px", borderRadius: 6, background: "#f8f9fb" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16, color: "#059669" }}>{member.reviews}</div>
                  <div style={{ fontSize: 11, color: "#1f2937" }}>{t("meth.teamReviews")}</div>
                </div>
                <div style={{ padding: "6px", borderRadius: 6, background: "#f8f9fb" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{member.exp}</div>
                  <div style={{ fontSize: 11, color: "#1f2937" }}>{t("meth.teamExperience")}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#1f2937", marginBottom: 10 }}>{t("meth.teamSpecialty")}: {member.specialty}</div>
              <a href={member.linkedin} style={{
                display: "block", padding: "8px", borderRadius: 6,
                background: "#eff6ff", color: "#2563eb", fontSize: 13, fontWeight: 600,
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
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#78350f", margin: "0 0 12px" }}>
            {t("meth.affDesc1")}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#78350f", margin: "0 0 12px" }}>
            <strong>{t("meth.affDesc2")}</strong>
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#78350f", margin: "0 0 12px" }}>
            {t("meth.affDesc3")}
          </p>
          <Link to={lp("/how-we-make-money")} style={{
            color: "#92400e", fontWeight: 700, textDecoration: "none", fontSize: 15,
          }}>{t("meth.affLink")} →</Link>
        </div>
      </section>

      {/* =================== FAQ =================== */}
      <section id="faq" style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 20 }}>
          {t("meth.faqTitle")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQ_METHODOLOGY.map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)} style={{
                padding: "16px 20px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{item.q}</span>
                <span style={{ color: "#1f2937", transform: expandedFAQ === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-flex" }}><ChevronDown size={18} /></span>
              </div>
              {expandedFAQ === i && (
                <div style={{ padding: "0 20px 18px", fontSize: 15, lineHeight: 1.8, color: "#1f2937", borderTop: "1px solid #f1f5f9" }}>
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
          <div style={{ fontSize: 16, color: "#64748b", marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
            {t("meth.ctaDesc")}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
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
    </div>
  );
}
