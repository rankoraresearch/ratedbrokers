import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { TRUST_SCORE_TIERS, CRITERIA_V2 } from "../data/methodologyData";
import { getAllBrokers, getBrokerData } from "../data/brokers/index";
import { FAQ_TRUST_SCORE, COMPETITOR_SYSTEMS, HOW_TO_READ_STEPS } from "../data/trustScoreData";
import Icon from "../components/Icon";
import { Shield, Search, ChevronDown, ChevronUp, ArrowRight, Award, BarChart3, ExternalLink } from "lucide-react";

/* ── helpers ── */

function getTier(score) {
  return TRUST_SCORE_TIERS.find((t) => score >= t.min && score <= t.max) || TRUST_SCORE_TIERS[TRUST_SCORE_TIERS.length - 1];
}

function getTierColor(score) {
  return getTier(score).color;
}

/* ── component ── */

export default function TrustScorePage() {
  const { mob, tab, desk } = useMedia();
  const { t } = useTranslation();
  const lp = useLocalePath();

  const allBrokers = useMemo(() => getAllBrokers().sort((a, b) => b.score - a.score), []);

  /* — SEO — */
  useEffect(() => {
    document.title = "RatedBrokers Trust Score — Transparent Broker Rating System | RatedBrokers";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Understand the RatedBrokers Trust Score: a transparent 0–10 rating system for forex brokers, built on 6 weighted categories and independent research. Search any broker instantly.");

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "DefinedTerm",
          name: "RatedBrokers Trust Score",
          description: "A composite 0–10 rating measuring the quality and trustworthiness of forex brokers across 6 weighted categories using independent research.",
          inDefinedTermSet: { "@type": "DefinedTermSet", name: "RatedBrokers Rating System" },
        },
        {
          "@type": "FAQPage",
          mainEntity: FAQ_TRUST_SCORE.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://ratedbrokers.com/" },
            { "@type": "ListItem", position: 2, name: "Trust Score", item: "https://ratedbrokers.com/trust-score" },
          ],
        },
        {
          "@type": "ItemList",
          name: "Top 10 Highest-Rated Brokers",
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          numberOfItems: 10,
          itemListElement: allBrokers.slice(0, 10).map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: b.name,
            url: `https://ratedbrokers.com/review/${b.slug}`,
          })),
        },
      ],
    };

    let el = document.querySelector('script[data-jsonld="trust-score"]');
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.setAttribute("data-jsonld", "trust-score");
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);

    return () => { if (el?.parentNode) el.parentNode.removeChild(el); };
  }, [allBrokers]);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <div style={{ background: "#f8f9fb", minHeight: "100vh" }}>
      {/* ── Breadcrumb ── */}
      <div style={{ ...cn, paddingTop: 16, paddingBottom: 0 }}>
        <nav style={{ fontSize: 14, color: "#94a3b8", display: "flex", gap: 6, alignItems: "center" }}>
          <Link to={lp("/")} style={{ color: "#94a3b8", textDecoration: "none" }}>{t("ts.breadHome")}</Link>
          <span>/</span>
          <span style={{ color: "#0f172a", fontWeight: 600 }}>{t("ts.breadTrustScore")}</span>
        </nav>
      </div>

      {/* =================== 1. HERO =================== */}
      <HeroSection cn={cn} mob={mob} tab={tab} t={t} />

      {/* =================== 2. QUICK SCORE LOOKUP =================== */}
      <LookupSection cn={cn} mob={mob} tab={tab} t={t} lp={lp} allBrokers={allBrokers} />

      {/* =================== 3. WHAT IS =================== */}
      <WhatIsSection cn={cn} mob={mob} t={t} lp={lp} />

      {/* =================== 4. SCORE TIERS =================== */}
      <TiersSection cn={cn} mob={mob} tab={tab} t={t} allBrokers={allBrokers} />

      {/* =================== 5. THE 6 CRITERIA =================== */}
      <CriteriaSection cn={cn} mob={mob} tab={tab} t={t} />

      {/* =================== 6. SCORE DISTRIBUTION =================== */}
      <DistributionSection cn={cn} mob={mob} t={t} allBrokers={allBrokers} />

      {/* =================== 7. TOP 10 LEADERBOARD =================== */}
      <LeaderboardSection cn={cn} mob={mob} tab={tab} t={t} lp={lp} allBrokers={allBrokers} />

      {/* =================== 8. HOW TO READ =================== */}
      <HowToReadSection cn={cn} mob={mob} t={t} lp={lp} />

      {/* =================== 9. COMPETITOR COMPARISON =================== */}
      <CompareSection cn={cn} mob={mob} t={t} />

      {/* =================== 10. FAQ =================== */}
      <FaqSection cn={cn} mob={mob} t={t} />

      {/* =================== 11. CTA =================== */}
      <CtaSection cn={cn} mob={mob} t={t} lp={lp} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 1 — HERO
   ═══════════════════════════════════════════════ */

function HeroSection({ cn, mob, tab, t }) {
  const stats = [
    { val: "6", label: t("ts.statCategories") },
    { val: "130+", label: t("ts.statDataPoints") },
    { val: "36", label: t("ts.statBrokersRated") },
    { val: t("ts.statUpdatesVal"), label: t("ts.statUpdates") },
  ];

  return (
    <section style={{
      ...cn, paddingTop: mob ? 32 : 48, paddingBottom: mob ? 32 : 48, marginBottom: 0,
      textAlign: "center",
    }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 999,
        padding: "6px 16px", marginBottom: 16,
      }}>
        <Shield size={14} color="#059669" />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#065f46", letterSpacing: 1 }}>{t("ts.badge")}</span>
      </div>

      <h1 style={{
        fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 28 : 44, lineHeight: 1.12,
        color: "#0f172a", marginBottom: 14,
      }}>
        {t("ts.title")}
      </h1>
      <p style={{
        fontSize: mob ? 15 : 18, color: "#64748b", lineHeight: 1.7,
        maxWidth: 680, margin: "0 auto 32px",
      }}>
        {t("ts.subtitle")}
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: mob ? 12 : 16,
        maxWidth: 700, margin: "0 auto",
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            padding: "16px 12px", borderRadius: 12,
            background: "#fff", border: "1px solid #e2e8f0",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 22, color: "#059669" }}>
              {s.val}
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 2 — QUICK SCORE LOOKUP
   ═══════════════════════════════════════════════ */

function LookupSection({ cn, mob, tab, t, lp, allBrokers }) {
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allBrokers.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 5);
  }, [query, allBrokers]);

  const selectedData = useMemo(() => {
    if (!selectedSlug) return null;
    return getBrokerData(selectedSlug);
  }, [selectedSlug]);

  return (
    <section style={{ ...cn, marginBottom: 48 }}>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
        {t("ts.lookupTitle")}
      </h2>
      <p style={{ fontSize: 16, color: "#64748b", marginBottom: 20, maxWidth: 700 }}>
        {t("ts.lookupDesc")}
      </p>

      {/* Search input */}
      <div style={{ position: "relative", maxWidth: 500, marginBottom: 16 }}>
        <Search size={18} color="#94a3b8" style={{ position: "absolute", left: 14, top: 14 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedSlug(null); }}
          placeholder={t("ts.lookupPlaceholder")}
          style={{
            width: "100%", padding: "12px 14px 12px 42px", fontSize: 16,
            border: "2px solid #e2e8f0", borderRadius: 12,
            outline: "none", fontFamily: "inherit", background: "#fff",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#059669"; }}
          onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; }}
        />
      </div>

      {/* Dropdown results */}
      {query.trim() && !selectedSlug && (
        <div style={{
          maxWidth: 500, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)", marginBottom: 16, overflow: "hidden",
        }}>
          {results.length === 0 ? (
            <div style={{ padding: "16px 20px", color: "#94a3b8", fontSize: 15 }}>{t("ts.lookupNoResults")}</div>
          ) : results.map((b) => {
            const tier = getTier(b.score);
            return (
              <button
                key={b.slug}
                onClick={() => { setSelectedSlug(b.slug); setQuery(b.name); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "12px 20px", background: "none",
                  border: "none", borderBottom: "1px solid #f1f5f9",
                  cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fffe"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{b.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 15, color: tier.color,
                  }}>{b.score}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: tier.color,
                    background: tier.color + "14", padding: "2px 8px", borderRadius: 6,
                  }}>{tier.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected broker detail */}
      {selectedData && (
        <div style={{
          background: "#fff", border: "2px solid #a7f3d0", borderRadius: 16,
          padding: mob ? 20 : 28, maxWidth: 700,
        }}>
          <div style={{
            display: "flex", alignItems: mob ? "flex-start" : "center",
            flexDirection: mob ? "column" : "row", gap: mob ? 12 : 20, marginBottom: 20,
          }}>
            <div style={{ textAlign: mob ? "left" : "center" }}>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
                fontSize: 48, color: getTierColor(selectedData.B.score), lineHeight: 1,
              }}>
                {selectedData.B.score}
              </div>
              <div style={{
                fontSize: 13, fontWeight: 700, color: getTierColor(selectedData.B.score),
                background: getTierColor(selectedData.B.score) + "14",
                padding: "3px 10px", borderRadius: 6, display: "inline-block", marginTop: 4,
              }}>
                {getTier(selectedData.B.score).label}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 22, marginBottom: 2 }}>
                {selectedData.B.name}
              </div>
              <div style={{ fontSize: 15, color: "#64748b" }}>
                {selectedData.B.type} · Est. {selectedData.B.year} · {selectedData.B.hq}
              </div>
            </div>
          </div>

          {/* 6 criteria mini bars */}
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: 10,
          }}>
            {selectedData.SCORES.map((s, i) => (
              <div key={i} style={{
                padding: "10px 14px", borderRadius: 10,
                background: "#f8f9fb", border: "1px solid #e8ecf1",
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{s.name}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14,
                    color: getTierColor(s.score),
                  }}>{s.score}</span>
                </div>
                <div style={{
                  height: 6, borderRadius: 3, background: "#e2e8f0", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: `${(s.score / 10) * 100}%`,
                    background: getTierColor(s.score),
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <Link to={lp(`/review/${selectedSlug}`)} style={{
              color: "#059669", fontWeight: 600, fontSize: 15, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              {t("ts.lookupReadReview")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3 — WHAT IS
   ═══════════════════════════════════════════════ */

function WhatIsSection({ cn, mob, t, lp }) {
  return (
    <section style={{ ...cn, marginBottom: 48 }}>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 12 }}>
        {t("ts.whatIsTitle")}
      </h2>
      <div style={{ maxWidth: 780, fontSize: 16, color: "#475569", lineHeight: 1.8 }}>
        <p style={{ marginBottom: 14 }}>{t("ts.whatIsP1")}</p>
        <p style={{ marginBottom: 14 }}>{t("ts.whatIsP2")}</p>
        <p style={{ marginBottom: 14 }}>{t("ts.whatIsP3")}</p>
      </div>
      <Link to={lp("/methodology")} style={{
        color: "#059669", fontWeight: 600, fontSize: 15, textDecoration: "none",
        display: "inline-flex", alignItems: "center", gap: 4,
      }}>
        {t("ts.whatIsLink")} <ArrowRight size={14} />
      </Link>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 4 — SCORE TIERS
   ═══════════════════════════════════════════════ */

function TiersSection({ cn, mob, tab, t, allBrokers }) {
  return (
    <section style={{ ...cn, marginBottom: 48 }}>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
        {t("ts.tiersTitle")}
      </h2>
      <p style={{ fontSize: 16, color: "#64748b", marginBottom: 20, maxWidth: 700 }}>
        {t("ts.tiersDesc")}
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(5, 1fr)",
        gap: 12,
      }}>
        {TRUST_SCORE_TIERS.map((tier, i) => {
          const brokersInTier = allBrokers.filter((b) => b.score >= tier.min && b.score <= tier.max);
          const count = brokersInTier.length;
          const examples = brokersInTier.slice(0, 2).map((b) => b.name).join(", ");

          return (
            <div key={i} style={{
              padding: "20px 18px", borderRadius: 14,
              background: "#fff", border: `2px solid ${tier.color}30`,
              borderTop: `4px solid ${tier.color}`,
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 22,
                color: tier.color, marginBottom: 4,
              }}>
                {tier.min}–{tier.max}
              </div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>
                {tier.label}
              </div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 10 }}>
                {tier.desc}
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600, color: tier.color,
                background: tier.color + "14", padding: "4px 10px",
                borderRadius: 6, display: "inline-block", marginBottom: count > 0 ? 6 : 0,
              }}>
                {count === 1 ? t("ts.tiersBroker", { count }) : t("ts.tiersBrokersCount", { count })}
              </div>
              {examples && (
                <div style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>
                  {t("ts.tiersExamples", { names: examples })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 5 — THE 6 CRITERIA
   ═══════════════════════════════════════════════ */

function CriteriaSection({ cn, mob, tab, t }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <section style={{ ...cn, marginBottom: 48 }}>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
        {t("ts.criteriaTitle")}
      </h2>
      <p style={{ fontSize: 16, color: "#64748b", marginBottom: 20, maxWidth: 700 }}>
        {t("ts.criteriaDesc")}
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)",
        gap: 14,
      }}>
        {CRITERIA_V2.map((c, i) => {
          const isOpen = expanded === i;
          return (
            <div key={c.key} style={{
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
              borderTop: `3px solid ${c.color}`,
              gridColumn: isOpen && !mob ? "1 / -1" : "auto",
            }}>
              {/* Card front */}
              <div style={{ padding: "20px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: c.color + "14", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={c.icon} size={20} color={c.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: c.color, fontWeight: 600 }}>
                      {t("ts.criteriaWeight", { weight: c.weight })}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 12 }}>
                  {c.summary}
                </p>
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: "none", border: "none", cursor: "pointer",
                    color: c.color, fontWeight: 600, fontSize: 14, fontFamily: "inherit",
                    padding: 0,
                  }}
                >
                  {isOpen ? t("ts.criteriaHideDetails") : t("ts.criteriaSeeDetails")}
                  {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div style={{
                  padding: "0 18px 20px", borderTop: "1px solid #f1f5f9",
                  paddingTop: 16,
                }}>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
                    {c.details}
                  </p>

                  {/* Sub-criteria table */}
                  {c.subCriteria && (
                    <>
                      <div style={{
                        fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 8,
                      }}>{t("ts.criteriaSubCriteria")}</div>
                      <div style={{
                        borderRadius: 8, overflow: "hidden", border: "1px solid #e8ecf1",
                        marginBottom: 16,
                      }}>
                        <div style={{
                          display: "grid", gridTemplateColumns: "1fr 60px",
                          background: "#f8f9fb", padding: "8px 14px", fontSize: 12,
                          fontWeight: 700, color: "#64748b", textTransform: "uppercase",
                        }}>
                          <span>{t("ts.criteriaSubName")}</span>
                          <span style={{ textAlign: "right" }}>{t("ts.criteriaSubWeight")}</span>
                        </div>
                        {c.subCriteria.map((sc, j) => (
                          <div key={j} style={{
                            display: "grid", gridTemplateColumns: "1fr 60px",
                            padding: "8px 14px", fontSize: 14,
                            borderTop: "1px solid #f1f5f9",
                          }}>
                            <span style={{ color: "#334155" }}>{sc.name}</span>
                            <span style={{
                              textAlign: "right", fontWeight: 600, color: c.color,
                            }}>{sc.weight}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Scoring ranges */}
                  {c.scoring && (
                    <>
                      <div style={{
                        fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 8,
                      }}>{t("ts.criteriaScoringRanges")}</div>
                      <div style={{
                        borderRadius: 8, overflow: "hidden", border: "1px solid #e8ecf1",
                        marginBottom: 16,
                      }}>
                        {c.scoring.map((sr, j) => (
                          <div key={j} style={{
                            padding: "10px 14px", fontSize: 14,
                            borderTop: j > 0 ? "1px solid #f1f5f9" : "none",
                            display: "flex", gap: 12,
                          }}>
                            <span style={{
                              fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
                              fontSize: 13, color: "#059669", whiteSpace: "nowrap", minWidth: 80,
                            }}>{sr.range}</span>
                            <span style={{ color: "#475569", lineHeight: 1.5 }}>{sr.desc}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Regulator tiers (only for regulation) */}
                  {c.tiers && (
                    <>
                      <div style={{
                        fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 8,
                      }}>Regulator Tiers</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {c.tiers.map((rt, j) => (
                          <div key={j} style={{
                            padding: "10px 14px", borderRadius: 10,
                            border: `1px solid ${rt.color}40`, background: rt.color + "08",
                            flex: mob ? "1 1 100%" : "1 1 30%",
                          }}>
                            <div style={{
                              fontWeight: 700, fontSize: 14, color: rt.color, marginBottom: 6,
                            }}>{rt.tier}</div>
                            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                              {rt.regs.join(" · ")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 6 — SCORE DISTRIBUTION
   ═══════════════════════════════════════════════ */

function DistributionSection({ cn, mob, t, allBrokers }) {
  const sorted = useMemo(() => [...allBrokers].sort((a, b) => b.score - a.score), [allBrokers]);
  const scores = sorted.map((b) => b.score);
  const highest = scores[0];
  const lowest = scores[scores.length - 1];
  const sortedScores = [...scores].sort((a, b) => a - b);
  const median = sortedScores.length % 2 === 0
    ? ((sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2).toFixed(1)
    : sortedScores[Math.floor(sortedScores.length / 2)].toFixed(1);
  const average = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);

  const summaryStats = [
    { label: t("ts.distHighest"), value: highest, color: "#059669" },
    { label: t("ts.distLowest"), value: lowest, color: "#ef4444" },
    { label: t("ts.distMedian"), value: median, color: "#2563eb" },
    { label: t("ts.distAverage"), value: average, color: "#7c3aed" },
  ];

  return (
    <section style={{ ...cn, marginBottom: 48 }}>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
        {t("ts.distTitle")}
      </h2>
      <p style={{ fontSize: 16, color: "#64748b", marginBottom: 20, maxWidth: 700 }}>
        {t("ts.distDesc")}
      </p>

      {/* Summary stats */}
      <div style={{
        display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: 12, marginBottom: 24,
      }}>
        {summaryStats.map((s) => (
          <div key={s.label} style={{
            padding: "14px 16px", borderRadius: 12,
            background: "#fff", border: "1px solid #e2e8f0", textAlign: "center",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 24, color: s.color,
            }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: mob ? 16 : 24,
      }}>
        {sorted.map((b) => {
          const tier = getTier(b.score);
          return (
            <div key={b.slug} style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 6,
            }}>
              <div style={{
                width: mob ? 90 : 140, fontSize: 13, fontWeight: 500, color: "#475569",
                textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {b.name}
              </div>
              <div style={{ flex: 1, height: 14, borderRadius: 4, background: "#f1f5f9", position: "relative" }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  width: `${(b.score / 10) * 100}%`,
                  background: `linear-gradient(90deg, ${tier.color}cc, ${tier.color})`,
                  transition: "width 0.4s ease",
                }} />
                {/* Median line */}
                <div style={{
                  position: "absolute", top: -2, bottom: -2,
                  left: `${(parseFloat(median) / 10) * 100}%`,
                  width: 2, background: "#2563eb40",
                }} />
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700,
                color: tier.color, width: 32, textAlign: "right",
              }}>
                {b.score}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 7 — TOP 10 LEADERBOARD
   ═══════════════════════════════════════════════ */

function LeaderboardSection({ cn, mob, tab, t, lp, allBrokers }) {
  const [showAll, setShowAll] = useState(false);
  const display = showAll ? allBrokers : allBrokers.slice(0, 10);

  return (
    <section style={{ ...cn, marginBottom: 48 }}>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
        {t("ts.leaderTitle")}
      </h2>
      <p style={{ fontSize: 16, color: "#64748b", marginBottom: 20, maxWidth: 700 }}>
        {t("ts.leaderDesc")}
      </p>

      <div style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden",
      }}>
        {/* Table header */}
        {!mob && (
          <div style={{
            display: "grid",
            gridTemplateColumns: tab ? "40px 1fr 70px 80px 90px" : "50px 1fr 80px 100px 140px 90px",
            padding: "12px 20px", background: "#f8f9fb",
            fontSize: 12, fontWeight: 700, color: "#64748b",
            textTransform: "uppercase", letterSpacing: 0.5,
          }}>
            <span>{t("ts.leaderRank")}</span>
            <span>{t("ts.leaderBroker")}</span>
            <span style={{ textAlign: "center" }}>{t("ts.leaderScore")}</span>
            <span>{t("ts.leaderVerdict")}</span>
            {!tab && <span>{t("ts.leaderType")}</span>}
            <span style={{ textAlign: "right" }}>{t("ts.leaderReview")}</span>
          </div>
        )}

        {display.map((b, i) => {
          const tier = getTier(b.score);
          if (mob) {
            return (
              <div key={b.slug} style={{
                padding: "14px 16px",
                borderTop: i > 0 ? "1px solid #f1f5f9" : "none",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 15,
                  color: "#94a3b8", width: 24,
                }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: "#0f172a" }}>{b.name}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{b.type}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
                    fontSize: 16, color: tier.color,
                  }}>{b.score}</div>
                  <div style={{ fontSize: 11, color: tier.color, fontWeight: 600 }}>{tier.label}</div>
                </div>
              </div>
            );
          }
          return (
            <div key={b.slug} style={{
              display: "grid",
              gridTemplateColumns: tab ? "40px 1fr 70px 80px 90px" : "50px 1fr 80px 100px 140px 90px",
              padding: "12px 20px", alignItems: "center",
              borderTop: i > 0 ? "1px solid #f1f5f9" : "none",
              background: i === 0 ? "#fafff8" : "transparent",
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 15,
                color: i < 3 ? "#059669" : "#94a3b8",
              }}>#{i + 1}</span>
              <span style={{ fontWeight: 600, fontSize: 15, color: "#0f172a" }}>{b.name}</span>
              <span style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
                fontSize: 16, color: tier.color, textAlign: "center",
              }}>{b.score}</span>
              <span style={{
                fontSize: 13, fontWeight: 600, color: tier.color,
              }}>{tier.label}</span>
              {!tab && (
                <span style={{ fontSize: 13, color: "#64748b" }}>{b.type}</span>
              )}
              <span style={{ textAlign: "right" }}>
                <Link to={lp(`/review/${b.slug}`)} style={{
                  fontSize: 14, fontWeight: 600, color: "#059669", textDecoration: "none",
                }}>
                  {t("ts.leaderReadReview")}
                </Link>
              </span>
            </div>
          );
        })}
      </div>

      {/* Toggle button */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            background: "none", border: "1px solid #e2e8f0", borderRadius: 10,
            padding: "10px 24px", cursor: "pointer", fontFamily: "inherit",
            fontSize: 15, fontWeight: 600, color: "#059669",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
          {showAll
            ? t("ts.leaderShowTop")
            : t("ts.leaderShowAll", { count: allBrokers.length })}
        </button>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 8 — HOW TO READ A SCORE
   ═══════════════════════════════════════════════ */

function HowToReadSection({ cn, mob, t, lp }) {
  return (
    <section style={{ ...cn, marginBottom: 48 }}>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
        {t("ts.howToReadTitle")}
      </h2>
      <p style={{ fontSize: 16, color: "#64748b", marginBottom: 24, maxWidth: 700 }}>
        {t("ts.howToReadDesc")}
      </p>

      <div style={{ position: "relative", paddingLeft: mob ? 24 : 40 }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute", left: mob ? 10 : 18, top: 0, bottom: 0,
          width: 3, background: "linear-gradient(to bottom, #059669, #34d399)",
          borderRadius: 2,
        }} />

        {HOW_TO_READ_STEPS.map((step, i) => (
          <div key={i} style={{ position: "relative", marginBottom: i < HOW_TO_READ_STEPS.length - 1 ? 28 : 0 }}>
            {/* Step circle */}
            <div style={{
              position: "absolute",
              left: mob ? -24 : -40,
              top: 0, width: mob ? 28 : 36, height: mob ? 28 : 36,
              borderRadius: "50%", background: "#059669",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontFamily: "'JetBrains Mono',monospace",
              fontWeight: 800, fontSize: mob ? 12 : 14,
              boxShadow: "0 2px 8px rgba(5,150,105,0.3)",
            }}>
              {step.step}
            </div>

            <div style={{
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
              padding: mob ? "16px" : "20px 24px",
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "#059669",
                letterSpacing: 1, marginBottom: 4,
              }}>{t("ts.howToReadStep")} {step.step}</div>
              <div style={{
                fontFamily: "Outfit", fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#0f172a",
              }}>{step.title}</div>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 10 }}>
                {step.desc}
              </p>
              <div style={{
                fontSize: 14, color: "#059669", fontFamily: "'JetBrains Mono',monospace",
                fontWeight: 600, background: "#f0fdf4", padding: "8px 14px", borderRadius: 8,
                border: "1px solid #a7f3d040",
              }}>
                {step.example}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 9 — COMPETITOR COMPARISON
   ═══════════════════════════════════════════════ */

function CompareSection({ cn, mob, t }) {
  const headers = [
    t("ts.compareSystem"),
    t("ts.compareScale"),
    t("ts.compareVariables"),
    t("ts.compareFormula"),
    t("ts.compareTesting"),
  ];

  return (
    <section style={{ ...cn, marginBottom: 48 }}>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
        {t("ts.compareTitle")}
      </h2>
      <p style={{ fontSize: 16, color: "#64748b", marginBottom: 20, maxWidth: 700 }}>
        {t("ts.compareDesc")}
      </p>

      <div style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
        overflow: "auto",
      }}>
        {/* Header row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "120px repeat(4, 90px)" : "180px repeat(4, 1fr)",
          padding: "12px 20px", background: "#f8f9fb",
          fontSize: 12, fontWeight: 700, color: "#64748b",
          textTransform: "uppercase", letterSpacing: 0.5,
          minWidth: mob ? 480 : "auto",
        }}>
          {headers.map((h) => <span key={h}>{h}</span>)}
        </div>

        {COMPETITOR_SYSTEMS.map((sys, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: mob ? "120px repeat(4, 90px)" : "180px repeat(4, 1fr)",
            padding: "14px 20px", alignItems: "center",
            borderTop: "1px solid #f1f5f9",
            background: sys.highlight ? "#f0fdf4" : "transparent",
            border: sys.highlight ? "2px solid #34d399" : "none",
            borderTop: sys.highlight ? "2px solid #34d399" : (i > 0 ? "1px solid #f1f5f9" : "none"),
            borderRadius: sys.highlight ? 10 : 0,
            minWidth: mob ? 480 : "auto",
          }}>
            <span style={{
              fontWeight: sys.highlight ? 800 : 600,
              fontSize: 15, color: sys.highlight ? "#059669" : "#0f172a",
            }}>{sys.name}</span>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 14,
              fontWeight: sys.highlight ? 700 : 400,
              color: sys.highlight ? "#059669" : "#475569",
            }}>{sys.scale}</span>
            <span style={{
              fontSize: 14, color: sys.highlight ? "#059669" : "#475569",
              fontWeight: sys.highlight ? 700 : 400,
            }}>{sys.variables}</span>
            <span style={{
              fontSize: 14,
              color: sys.formula === "Fully Published" ? "#059669" : sys.formula === "Proprietary" ? "#ef4444" : "#f59e0b",
              fontWeight: 600,
            }}>{sys.formula}</span>
            <span style={{
              fontSize: 14,
              color: sys.highlight ? "#059669" : "#94a3b8",
              fontWeight: sys.highlight ? 700 : 400,
            }}>{sys.testing}</span>
          </div>
        ))}
      </div>

      {/* Callout */}
      <div style={{
        marginTop: 16, padding: "16px 20px", borderRadius: 12,
        background: "#f0fdf4", border: "1px solid #a7f3d0",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Award size={20} color="#059669" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 15, color: "#065f46", fontWeight: 500, lineHeight: 1.5 }}>
          {t("ts.compareCallout")}
        </span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 10 — FAQ
   ═══════════════════════════════════════════════ */

function FaqSection({ cn, mob, t }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section style={{ ...cn, marginBottom: 48 }}>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 20 }}>
        {t("ts.faqTitle")}
      </h2>

      <div style={{ maxWidth: 780 }}>
        {FAQ_TRUST_SCORE.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} style={{
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
              marginBottom: 8, overflow: "hidden",
            }}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{
                  width: "100%", padding: "16px 20px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", textAlign: "left",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 16, color: "#0f172a", paddingRight: 12 }}>
                  {faq.q}
                </span>
                {isOpen ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
              </button>
              {isOpen && (
                <div style={{
                  padding: "0 20px 16px",
                  fontSize: 15, color: "#475569", lineHeight: 1.7,
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 11 — CTA
   ═══════════════════════════════════════════════ */

function CtaSection({ cn, mob, t, lp }) {
  return (
    <section style={{
      ...cn, marginBottom: 0, paddingTop: 48, paddingBottom: 64,
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
        borderRadius: 20, padding: mob ? "32px 20px" : "48px 40px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 32,
          color: "#fff", marginBottom: 10,
        }}>
          {t("ts.ctaTitle")}
        </h2>
        <p style={{
          fontSize: mob ? 15 : 17, color: "#94a3b8", marginBottom: 28,
          maxWidth: 500, margin: "0 auto 28px",
        }}>
          {t("ts.ctaDesc")}
        </p>

        <div style={{
          display: "flex", gap: 12, justifyContent: "center",
          flexWrap: "wrap",
        }}>
          <Link to={lp("/")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "linear-gradient(135deg, #059669, #047857)",
            color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none",
            padding: "14px 28px", borderRadius: 12,
            boxShadow: "0 4px 14px rgba(5,150,105,0.3)",
          }}>
            {t("ts.ctaRankings")} <ArrowRight size={16} />
          </Link>
          <Link to={lp("/methodology")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none",
            padding: "14px 28px", borderRadius: 12,
          }}>
            {t("ts.ctaMethodology")}
          </Link>
          <Link to={lp("/compare")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none",
            padding: "14px 28px", borderRadius: 12,
          }}>
            {t("ts.ctaCompare")}
          </Link>
        </div>
      </div>
    </section>
  );
}
