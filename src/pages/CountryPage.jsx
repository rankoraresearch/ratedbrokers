import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import RegBadge from "../components/RegBadge";
import BrokerLogo from "../components/BrokerLogo";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import TrustpilotLogo from "../components/TrustpilotLogo";
import { getCountryData } from "../data/countries/index";
import { getBrokerData } from "../data/brokers/index";
import Breadcrumb from "../components/Breadcrumb";
import Icon from "../components/Icon";
import { Check, X as XIcon, ArrowRight, ChevronRight, ChevronUp, ChevronDown, HelpCircle, ExternalLink } from "lucide-react";
import CountryFlag from "../components/CountryFlag";

// ============================
// RESPONSIVE HOOK
// ============================
function useMedia() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { mob: w < 640, tab: w >= 640 && w < 1024, desk: w >= 1024 };
}

// ============================
// SHARED COMPONENTS
// ============================
function Stars({ r, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: size, height: size,
          background: i <= Math.floor(r) ? "#00B67A" : i - 0.5 <= r ? "linear-gradient(90deg,#00B67A 50%,#d1d5db 50%)" : "#d1d5db",
          clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
        }}/>
      ))}
    </div>
  );
}

function ScoreBadge({ score, size = "md" }) {
  const color = score >= 9.0 ? "#059669" : score >= 8.0 ? "#2563eb" : "#d97706";
  const bg = score >= 9.0 ? "#ecfdf5" : score >= 8.0 ? "#eff6ff" : "#fffbeb";
  const label = score >= 9.5 ? "Excellent" : score >= 9.0 ? "Great" : score >= 8.5 ? "Very Good" : "Good";
  const s = size === "lg" ? 52 : 40;
  const fs = size === "lg" ? 18 : 14;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ width: s, height: s, borderRadius: 10, background: bg, border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: fs, color }}>{score}</span>
      </div>
      <span style={{ fontSize: size === "lg" ? 12 : 10, color, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function Accordion({ items, expanded, setExpanded }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderRadius: 12, border: "1px solid #f1f5f9", overflow: "hidden" }}>
          <button onClick={() => setExpanded(expanded === i ? null : i)} style={{
            width: "100%", padding: "14px 16px", background: expanded === i ? "#f8fafc" : "#fff",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "space-between", textAlign: "left", gap: 12,
          }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", flex: 1 }}>{item.q}</span>
            <span style={{ fontSize: 16, color: "#94a3b8", transform: expanded === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>{"\u25BE"}</span>
          </button>
          {expanded === i && (
            <div style={{ padding: "0 16px 16px" }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#475569", margin: 0 }}>{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================
// MERGE BROKER DATA: country-specific + global
// ============================
function mergeBrokers(countryBrokers) {
  return countryBrokers.map((cb, idx) => {
    const global = getBrokerData(cb.slug);
    if (!global) return { id: idx + 1, ...cb, name: cb.slug, score: 0, tp: 0, tpCount: 0, regs: [], type: "N/A", minDep: 0, spread: "N/A", avgSpread: "N/A", commission: "N/A", leverage: "N/A", year: 0, platforms: [], pairs: 0, execution: "N/A", logo: cb.slug.slice(0, 2).toUpperCase(), promo: null, url: `https://ratedbrokers.com/go/${cb.slug}` };
    const b = global.B;
    return {
      id: idx + 1,
      rank: cb.rank,
      name: b.name,
      slug: cb.slug,
      logo: b.logo || cb.slug.slice(0, 2).toUpperCase(),
      score: b.score,
      tp: b.tp,
      tpCount: b.tpCount,
      regs: (b.regs || []).map(r => typeof r === "string" ? r : r.name),
      type: b.type,
      minDep: b.minDep,
      minDepLocal: cb.localCurrencyMin,
      spread: b.spread,
      avgSpread: b.avgSpread,
      commission: b.commission,
      leverage: b.leverage,
      year: b.year,
      platforms: b.platforms || [],
      pairs: b.instruments || b.pairs || 0,
      execution: b.execution || "N/A",
      spreadBetting: cb.spreadBetting,
      localAccount: cb.localAccount,
      badge: cb.badge,
      badgeColor: cb.badgeColor,
      url: b.url || `https://ratedbrokers.com/go/${cb.slug}`,
      promo: b.promo,
      verdict: cb.verdict,
      localAdvantages: cb.localAdvantages,
      localRegRef: cb.localRegRef,
    };
  });
}

// ============================
// MAIN COMPONENT
// ============================
export default function CountryPage() {
  const { countrySlug } = useParams();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const { mob, tab } = useMedia();
  const [expandedBroker, setExpandedBroker] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [expandedGuide, setExpandedGuide] = useState(null);
  const [expandedTax, setExpandedTax] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [compare, setCompare] = useState([]);

  const COUNTRY = getCountryData(countrySlug);

  // Reset state when country changes
  useEffect(() => {
    setExpandedBroker(null);
    setExpandedFAQ(null);
    setExpandedGuide(null);
    setExpandedTax(null);
    setActiveTab("all");
    setCompare([]);
  }, [countrySlug]);

  // Set SEO meta tags
  useEffect(() => {
    if (COUNTRY) {
      document.title = COUNTRY.metaTitle || `Best Forex Brokers in ${COUNTRY.name} for 2026 | RatedBrokers`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", COUNTRY.metaDescription || `Compare the best forex brokers for ${COUNTRY.name} traders in 2026. ${COUNTRY.regulator}-regulated, tested with real money.`);
    }
    window.scrollTo(0, 0);
  }, [countrySlug, COUNTRY]);

  if (!COUNTRY) return <Navigate to="/" replace />;

  const BROKERS = mergeBrokers(COUNTRY.brokers);

  const toggleCompare = (id) => {
    setCompare(p => p.includes(id) ? p.filter(x => x !== id) : p.length < 3 ? [...p, id] : p);
  };

  const filteredBrokers = activeTab === "spread-bet"
    ? BROKERS.filter(b => b.spreadBetting)
    : activeTab === "ecn" ? BROKERS.filter(b => b.type.includes("ECN")) : BROKERS;

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  // Quick facts (country-specific)
  const quickFacts = [
    ["Regulator", COUNTRY.regulator],
    ["Deposit Protection", COUNTRY.compensation],
    ["Max Leverage", COUNTRY.leverage],
    ["Negative Balance", COUNTRY.negativeBalance ? "\u2705 " + COUNTRY.negativeBalance : "\u274C No"],
    ...(COUNTRY.taxNote ? [["Tax Note", COUNTRY.taxNote]] : []),
    [t("country.brokersTested"), `${COUNTRY.localBrokersTotal} ${COUNTRY.regulator}-authorised`],
  ];

  const regSubtitle = COUNTRY.regulation?.items?.length
    ? `The ${COUNTRY.name}\u2019s ${COUNTRY.regulatorFull} ensures high standards for trader protection.`
    : null;

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#1e293b", minHeight: "100vh" }}>

      {/* ===== BREADCRUMBS ===== */}
      <div style={{ paddingTop: 0 }}>
        <div style={{ ...cn, padding: mob ? "12px 16px" : "16px 24px" }}>
          <Breadcrumb items={[
            { label: t("nav.home"), path: "/" },
            { label: "Best Forex Brokers by Country", path: "/best-forex-brokers-by-country" },
            { label: COUNTRY.name },
          ]} />
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 40 }}>
        <div style={{
          display: mob ? "flex" : "grid",
          flexDirection: "column",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr" : "1fr 340px",
          gap: mob ? 20 : 32,
        }}>
          {/* Left side */}
          <div>
            <div style={{ display: "flex", alignItems: mob ? "flex-start" : "center", gap: mob ? 10 : 14, marginBottom: 14 }}>
              <CountryFlag code={COUNTRY.code} size={mob ? 38 : 52} />
              <div>
                <h1 style={{
                  fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : tab ? 28 : 34,
                  lineHeight: 1.1, color: "#1e293b", margin: 0,
                }}>
                  {t("country.bestBrokersIn", { country: COUNTRY.name, year: COUNTRY.year })}
                </h1>
                <span style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: mob ? 14 : 17, color: "#059669" }}>
                  {COUNTRY.regulator}-Regulated {"\u2022"} {COUNTRY.year}
                </span>
              </div>
            </div>
            <p style={{ fontSize: mob ? 15 : 16, lineHeight: 1.7, color: "#475569", marginBottom: 16 }}>
              {t("country.tested", { count: COUNTRY.localBrokersTotal, reg: COUNTRY.regulator, currency: COUNTRY.currency, date: COUNTRY.updatedDate })}
            </p>

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {COUNTRY.author.image ? (
                  <img src={COUNTRY.author.image} alt={COUNTRY.author.name} style={{
                    width: 32, height: 32, borderRadius: "50%", objectFit: "cover",
                  }} />
                ) : (
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13, color: "#fff",
                  }}>{COUNTRY.author.initials}</div>
                )}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{COUNTRY.author.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{COUNTRY.author.role}</div>
                </div>
              </div>
              {!mob && <div style={{ width: 1, height: 24, background: "#e2e8f0" }} />}
              <div style={{ fontSize: 13, color: "#64748b" }}>
                {t("country.lastUpdated")}: {COUNTRY.updatedDate}
              </div>
            </div>
          </div>

          {/* Quick Facts card */}
          <div style={{
            background: "#fff", borderRadius: 14, padding: mob ? 16 : 20,
            border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <CountryFlag code={COUNTRY.code} size={16} /> {COUNTRY.name} Trading Quick Facts
            </div>
            {quickFacts.map(([label, val], i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0", borderBottom: i < quickFacts.length - 1 ? "1px solid #f1f5f9" : "none",
              }}>
                <span style={{ fontSize: 14, color: "#64748b" }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", textAlign: "right", maxWidth: "60%" }}>{val}</span>
              </div>
            ))}
            <a href={COUNTRY.regulatorUrl} target="_blank" rel="noopener noreferrer" style={{
              display: "block", textAlign: "center", marginTop: 12, padding: "8px 0", borderRadius: 8,
              background: "#f1f5f9", color: "#2563eb", fontSize: 13, fontWeight: 700, textDecoration: "none",
            }}>{"\uD83D\uDD0D"} Verify on {COUNTRY.regulator} Register <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></a>
          </div>
        </div>

        {/* Key finding */}
        <div style={{
          marginTop: 20, padding: mob ? "12px 14px" : "14px 20px", borderRadius: 12,
          background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", border: "1px solid #a7f3d0",
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>{"\uD83D\uDD11"}</span>
          <div>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#059669", letterSpacing: 0.5 }}>{t("country.keyFinding").toUpperCase()}</span>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#1e293b", margin: "4px 0 0" }}>{COUNTRY.keyFinding}</p>
          </div>
        </div>

        {/* Trust stats */}
        <div style={{
          marginTop: 16, display: "grid",
          gridTemplateColumns: mob ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
          gap: mob ? 8 : 16, padding: "12px 0",
        }}>
          {[
            [COUNTRY.brokersTested, t("country.brokersTested")],
            [COUNTRY.localBrokersTotal, `${COUNTRY.regulator} Verified`],
            [`${COUNTRY.hoursResearch}h`, t("country.hoursResearch")],
            ...(!mob ? [["\u00A325K+", "Deposited"], ["500+", "Trades"]] : []),
          ].map(([val, label], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: mob ? 20 : 24, color: "#1e3a5f" }}>{val}</div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FILTER TABS ===== */}
      <section style={{ ...cn, paddingBottom: 12 }}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 4 }}>
          {[
            { key: "all", label: mob ? "All" : `All ${COUNTRY.name} (${BROKERS.length})`, icon: null, countryCode: COUNTRY.code },
            { key: "spread-bet", label: mob ? "Spread Bet" : `Spread Betting (${BROKERS.filter(b => b.spreadBetting).length})`, icon: "\uD83C\uDFAF" },
            { key: "ecn", label: mob ? "ECN" : `ECN (${BROKERS.filter(b => b.type.includes("ECN")).length})`, icon: "\u26A1" },
          ].map(tb => (
            <button key={tb.key} onClick={() => setActiveTab(tb.key)} style={{
              padding: mob ? "6px 12px" : "8px 16px", borderRadius: 8, whiteSpace: "nowrap",
              background: activeTab === tb.key ? "#1e3a5f" : "#fff",
              color: activeTab === tb.key ? "#fff" : "#475569",
              border: `1px solid ${activeTab === tb.key ? "#1e3a5f" : "#e2e8f0"}`,
              fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}>
              {tb.countryCode ? <CountryFlag code={tb.countryCode} size={14} /> : tb.icon} {tb.label}
            </button>
          ))}
        </div>
      </section>

      {/* ===== BROKER RANKINGS ===== */}
      <section style={{ ...cn, paddingBottom: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: mob ? 12 : 16 }}>
          {filteredBrokers.map((b, idx) => (
            <div key={b.id} style={{
              background: "#fff", borderRadius: mob ? 14 : 16,
              border: idx === 0 ? "2px solid #059669" : "1px solid #e2e8f0",
              boxShadow: idx === 0 ? "0 4px 20px rgba(5,150,105,0.1)" : "0 1px 4px rgba(0,0,0,0.03)",
              overflow: "hidden",
            }}>
              {/* Top ribbon for #1 */}
              {idx === 0 && (
                <div style={{
                  background: "linear-gradient(135deg,#059669,#34d399)",
                  padding: mob ? "6px 14px" : "8px 24px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 4,
                }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: mob ? 13 : 14 }}>
                    {"\uD83C\uDFC6"} #1 Best Broker for {COUNTRY.name} {"\u2014"} {COUNTRY.year}
                  </span>
                  {!mob && b.localRegRef && <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{COUNTRY.regulator} Ref: {b.localRegRef}</span>}
                </div>
              )}

              <div style={{ padding: mob ? "16px" : "20px 24px" }}>
                {/* === MOBILE LAYOUT === */}
                {mob ? (
                  <div>
                    {/* Row 1: Logo + Name + Score */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <a href={b.url} target="_blank" rel="noopener noreferrer nofollow" style={{ position: "relative", flexShrink: 0, display: "block" }}>
                        <BrokerLogo slug={b.slug} name={b.name} fallback={b.logo} size={48} />
                        <div style={{
                          position: "absolute", top: -5, left: -5,
                          width: 20, height: 20, borderRadius: "50%",
                          background: "#1e3a5f", border: "2px solid #fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 12, color: "#fff",
                        }}>#{b.rank}</div>
                      </a>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <Link to={lp(`/review/${b.slug}`)} style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, color: "inherit", textDecoration: "none" }}
                            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                          >{b.name}</Link>
                          {b.badge && (
                            <span style={{
                              padding: "2px 7px", borderRadius: 4,
                              background: b.badgeColor + "15", color: b.badgeColor,
                              fontSize: 10, fontWeight: 700,
                            }}>{b.badge}</span>
                          )}
                        </div>
                        <a href={getTrustpilotUrl(b.slug)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, textDecoration: "none" }}>
                          <TrustpilotLogo size="xs" />
                          <Stars r={b.tp} size={12} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#00B67A" }}>{b.tp}</span>
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>({(b.tpCount/1000).toFixed(1)}K)</span>
                        </a>
                      </div>
                      <ScoreBadge score={b.score} />
                    </div>

                    {/* Regs + badges row */}
                    <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
                      {b.regs.slice(0, 4).map((r, i) => <RegBadge key={i} reg={r} />)}
                      {b.spreadBetting && (
                        <span style={{
                          padding: "2px 6px", borderRadius: 4,
                          background: "#fef3c7", color: "#b45309",
                          fontSize: 10, fontWeight: 700,
                        }}>SPREAD BET</span>
                      )}
                    </div>

                    {/* Key stats row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                      {[
                        [t("country.minDeposit"), b.minDepLocal],
                        [t("country.spread"), `${b.spread} pips`],
                        ["Leverage", b.leverage],
                      ].map(([k, v], i) => (
                        <div key={i} style={{ textAlign: "center", padding: "8px 4px", background: "#f8fafc", borderRadius: 8 }}>
                          <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>{k}</div>
                          <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 14, color: i === 1 ? "#059669" : "#1e293b" }}>{v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Verdict */}
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: "#475569", marginBottom: 12, padding: "10px 12px", background: "#f8fafc", borderRadius: 8 }}>
                      <span style={{ fontWeight: 700, color: "#1e293b" }}>{t("country.ourVerdict")}: </span>{b.verdict}
                    </div>

                    {/* CTA */}
                    <a href={b.url} target="_blank" rel="noopener noreferrer nofollow" style={{
                      display: "block", padding: "12px 0", borderRadius: 10, textAlign: "center",
                      background: "linear-gradient(135deg,#059669,#34d399)",
                      color: "#fff", fontWeight: 700, fontSize: 15,
                      textDecoration: "none", marginBottom: 8,
                    }}>{t("country.visitBroker")} {b.name} <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></a>

                    <div style={{ display: "flex", gap: 8 }}>
                      <Link to={lp(`/review/${b.slug}`)} style={{
                        flex: 1, padding: "8px 0", borderRadius: 8, textAlign: "center",
                        background: "#f1f5f9", color: "#475569", fontSize: 14, fontWeight: 600, textDecoration: "none",
                      }}>{t("country.readReview")}</Link>
                      <button onClick={() => toggleCompare(b.id)} style={{
                        flex: 1, padding: "8px 0", borderRadius: 8,
                        background: compare.includes(b.id) ? "#1e3a5f" : "#f1f5f9",
                        color: compare.includes(b.id) ? "#fff" : "#475569",
                        fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
                      }}>{compare.includes(b.id) ? <><Check size={14} color="#059669" style={{ verticalAlign: "middle" }} /> Added</> : "Compare"}</button>
                      <button onClick={() => setExpandedBroker(expandedBroker === b.id ? null : b.id)} style={{
                        flex: 1, padding: "8px 0", borderRadius: 8,
                        background: expandedBroker === b.id ? "#1e3a5f" : "#f1f5f9",
                        color: expandedBroker === b.id ? "#fff" : "#2563eb",
                        fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
                      }}>{expandedBroker === b.id ? <>Less <ChevronUp size={14} style={{ verticalAlign: "middle" }} /></> : <>{COUNTRY.name} Info <ChevronDown size={14} style={{ verticalAlign: "middle" }} /></>}</button>
                    </div>
                  </div>
                ) : (
                  /* === DESKTOP / TABLET LAYOUT === */
                  <div>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: tab ? "56px 1fr 120px 100px" : "60px 1fr 150px 120px 140px",
                      gap: tab ? 14 : 20, alignItems: "center",
                    }}>
                      {/* Logo */}
                      <a href={b.url} target="_blank" rel="noopener noreferrer nofollow" style={{ position: "relative", flexShrink: 0, display: "block" }}>
                        <BrokerLogo slug={b.slug} name={b.name} fallback={b.logo} size={56} />
                        <div style={{
                          position: "absolute", top: -6, left: -6,
                          width: 22, height: 22, borderRadius: "50%",
                          background: "#1e3a5f", border: "2px solid #fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 12, color: "#fff",
                        }}>#{b.rank}</div>
                      </a>

                      {/* Info */}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <Link to={lp(`/review/${b.slug}`)} style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: tab ? 17 : 19, color: "inherit", textDecoration: "none" }}
                            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                          >{b.name}</Link>
                          {b.badge && <span style={{ padding: "2px 8px", borderRadius: 5, background: b.badgeColor + "15", color: b.badgeColor, fontSize: 12, fontWeight: 700 }}>{b.badge}</span>}
                          {b.spreadBetting && <span style={{ padding: "2px 7px", borderRadius: 5, background: "#fef3c7", color: "#b45309", fontSize: 12, fontWeight: 700 }}>SPREAD BET</span>}
                        </div>
                        <div style={{ display: "flex", gap: 4, marginBottom: 5, flexWrap: "wrap" }}>
                          {b.regs.map((r, i) => <RegBadge key={i} reg={r} />)}
                        </div>
                        <a href={getTrustpilotUrl(b.slug)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                          <TrustpilotLogo size="sm" />
                          <Stars r={b.tp} />
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#00B67A" }}>{b.tp}</span>
                          <span style={{ fontSize: 13, color: "#94a3b8" }}>({b.tpCount.toLocaleString()})</span>
                        </a>
                        {b.localRegRef && <span style={{ fontSize: 12, color: "#64748b", marginLeft: 6 }}>{COUNTRY.regulator} #{b.localRegRef}</span>}
                      </div>

                      {/* Stats */}
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 1 }}>{t("country.minDeposit")}</div>
                        <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 16 }}>{b.minDepLocal}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, marginBottom: 1 }}>{t("country.spread")}</div>
                        <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 14, color: "#059669" }}>{b.spread} pips</div>
                      </div>

                      {/* Score */}
                      <ScoreBadge score={b.score} size="lg" />

                      {/* CTA (desktop only) */}
                      {!tab && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <a href={b.url} target="_blank" rel="noopener noreferrer nofollow" style={{
                            display: "block", padding: "11px 0", borderRadius: 10, textAlign: "center",
                            background: "linear-gradient(135deg,#059669,#34d399)",
                            color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
                          }}>{t("country.visitBroker")} {b.name} <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></a>
                          <div style={{ display: "flex", gap: 6 }}>
                            <Link to={lp(`/review/${b.slug}`)} style={{ flex: 1, padding: "6px 0", borderRadius: 7, textAlign: "center", background: "#f1f5f9", color: "#475569", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>{t("home.review")}</Link>
                            <button onClick={() => toggleCompare(b.id)} style={{ flex: 1, padding: "6px 0", borderRadius: 7, background: compare.includes(b.id) ? "#1e3a5f" : "#f1f5f9", color: compare.includes(b.id) ? "#fff" : "#475569", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>{compare.includes(b.id) ? <Check size={14} color="#059669" /> : "Compare"}</button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tablet CTA row */}
                    {tab && (
                      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                        <a href={b.url} target="_blank" rel="noopener noreferrer nofollow" style={{
                          flex: 2, padding: "10px 0", borderRadius: 10, textAlign: "center",
                          background: "linear-gradient(135deg,#059669,#34d399)",
                          color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
                        }}>{t("country.visitBroker")} {b.name} <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></a>
                        <Link to={lp(`/review/${b.slug}`)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, textAlign: "center", background: "#f1f5f9", color: "#475569", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{t("home.review")}</Link>
                        <button onClick={() => toggleCompare(b.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: compare.includes(b.id) ? "#1e3a5f" : "#f1f5f9", color: compare.includes(b.id) ? "#fff" : "#475569", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>{compare.includes(b.id) ? <><Check size={14} color="#059669" style={{ verticalAlign: "middle" }} /> Added</> : "Compare"}</button>
                      </div>
                    )}

                    {/* Verdict */}
                    <div style={{ marginTop: 14, padding: "10px 14px", background: "#f8fafc", borderRadius: 8 }}>
                      <span style={{ fontSize: 14, lineHeight: 1.6, color: "#475569" }}>
                        <span style={{ fontWeight: 700, color: "#1e293b" }}>{t("country.ourVerdict")}: </span>{b.verdict}
                      </span>
                    </div>

                    <button onClick={() => setExpandedBroker(expandedBroker === b.id ? null : b.id)} style={{
                      marginTop: 10, background: "none", border: "none", cursor: "pointer",
                      color: "#2563eb", fontSize: 14, fontWeight: 600, padding: 0,
                    }}>
                      {expandedBroker === b.id ? <>Hide {COUNTRY.name} Details <ChevronUp size={14} style={{ verticalAlign: "middle" }} /></> : <>Show {COUNTRY.name} Details <ChevronDown size={14} style={{ verticalAlign: "middle" }} /></>}
                    </button>
                  </div>
                )}

                {/* === EXPANDED DETAILS (both layouts) === */}
                {expandedBroker === b.id && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
                      gap: mob ? 16 : 20,
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><CountryFlag code={COUNTRY.code} size={15} /> Why {b.name} for {COUNTRY.name} Traders</div>
                        {b.localAdvantages.map((adv, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                            <Check size={14} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: 14, lineHeight: "18px", color: "#475569" }}>{adv}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{"\uD83D\uDCCA"} Trading Conditions</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                          {[
                            ["Type", b.type], ["Leverage", b.leverage],
                            ["Platforms", b.platforms.slice(0, 3).join(", ")],
                            ["Pairs", b.pairs], ["Avg Spread", b.avgSpread + " pips"],
                            ["Execution", b.execution],
                          ].map(([k, v], i) => (
                            <div key={i} style={{ padding: "6px 8px", background: "#f8fafc", borderRadius: 6 }}>
                              <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 1 }}>{k}</div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {b.promo && (
                      <div style={{
                        marginTop: 12, padding: "8px 14px", borderRadius: 8,
                        background: "#fef3c7", border: "1px solid #fde68a",
                        fontSize: 14, fontWeight: 600, color: "#92400e",
                      }}>{"\uD83C\uDF81"} {b.promo}</div>
                    )}
                    <a href={b.url} target="_blank" rel="noopener noreferrer nofollow" style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      marginTop: 12, fontSize: 14, fontWeight: 600, color: "#059669", textDecoration: "none",
                    }}>Visit {b.name} Official Website <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== REGULATION ===== */}
      {COUNTRY.regulation && (
        <section style={{ ...cn, paddingBottom: 40 }}>
          <div style={{
            background: "#fff", borderRadius: mob ? 14 : 20, padding: mob ? 20 : 36,
            border: "1px solid #e2e8f0",
          }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 6 }}>
              {"\uD83D\uDEE1\uFE0F"} {COUNTRY.regulation.title}
            </h2>
            {regSubtitle && <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>{regSubtitle}</p>}
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr", gap: 12 }}>
              {COUNTRY.regulation.items.map((item, i) => (
                <div key={i} style={{
                  padding: mob ? 14 : 18, borderRadius: 12,
                  background: "#f8fafc", border: "1px solid #f1f5f9",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Icon name={item.icon} size={20} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{item.title}</span>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#475569", margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== COMPARISON TABLE (e.g. Spread Betting vs CFDs for UK) ===== */}
      {COUNTRY.comparisonTable && (
        <section style={{ ...cn, paddingBottom: 40 }}>
          <div style={{
            background: "#fff", borderRadius: mob ? 14 : 20, padding: mob ? 20 : 36,
            border: "1px solid #e2e8f0",
          }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 6 }}>
              {"\uD83C\uDFAF"} {COUNTRY.comparisonTable.title}
            </h2>
            {COUNTRY.comparisonTable.subtitle && <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>{COUNTRY.comparisonTable.subtitle}</p>}

            {mob ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {COUNTRY.comparisonTable.rows.map((row, i) => (
                  <div key={i} style={{ padding: 14, background: "#f8fafc", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginBottom: 8 }}>{row[0]}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 10, color: "#059669", fontWeight: 700, marginBottom: 2 }}>{COUNTRY.comparisonTable.headers[1]}</div>
                        <div style={{ fontSize: 14, color: "#1e293b" }}>{row[1]}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "#2563eb", fontWeight: 700, marginBottom: 2 }}>{COUNTRY.comparisonTable.headers[2]}</div>
                        <div style={{ fontSize: 14, color: "#1e293b" }}>{row[2]}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr>{COUNTRY.comparisonTable.headers.map((h, i) => (
                      <th key={i} style={{ padding: "12px 16px", textAlign: "left", background: "#1e3a5f", color: "#fff", fontWeight: 700, fontSize: 14 }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {COUNTRY.comparisonTable.rows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: "10px 16px", fontWeight: j === 0 ? 600 : 400, color: j === 0 ? "#1e293b" : "#475569", background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== TAX GUIDE ===== */}
      {COUNTRY.tax && COUNTRY.tax.length > 0 && (
        <section style={{ ...cn, paddingBottom: 40 }}>
          <div style={{ background: "#fff", borderRadius: mob ? 14 : 20, padding: mob ? 20 : 36, border: "1px solid #e2e8f0" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 6 }}>
              {"\uD83D\uDCB7"} {COUNTRY.name} Forex Tax Guide
            </h2>
            <div style={{
              padding: "12px 14px", borderRadius: 10, background: "#fef3c7", border: "1px solid #fde68a",
              marginBottom: 18, fontSize: 14, color: "#92400e", lineHeight: 1.6,
            }}>
              {"\u26A0\uFE0F"} <strong>Disclaimer:</strong> General information, not tax advice. Consult a qualified tax advisor.
            </div>
            <Accordion items={COUNTRY.tax} expanded={expandedTax} setExpanded={setExpandedTax} />
          </div>
        </section>
      )}

      {/* ===== PAYMENTS ===== */}
      {COUNTRY.payments && COUNTRY.payments.length > 0 && (
        <section style={{ ...cn, paddingBottom: 40 }}>
          <div style={{ background: "#fff", borderRadius: mob ? 14 : 20, padding: mob ? 20 : 36, border: "1px solid #e2e8f0" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 16 }}>
              {"\uD83D\uDCB3"} {t("country.paymentTitle", { country: COUNTRY.name })}
            </h2>
            {mob ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {COUNTRY.payments.map((p, i) => (
                  <div key={i} style={{ padding: 14, background: "#f8fafc", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{p.method}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 14 }}>
                      <div><span style={{ color: "#94a3b8" }}>Deposit: </span><span style={{ color: "#059669", fontWeight: 600 }}>{p.deposit}</span></div>
                      <div><span style={{ color: "#94a3b8" }}>Withdrawal: </span><span style={{ fontWeight: 600 }}>{p.withdrawal}</span></div>
                      <div><span style={{ color: "#94a3b8" }}>{t("country.processing")}: </span>{p.time}</div>
                      <div style={{ color: "#64748b", fontSize: 13 }}>{p.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr>{[t("country.methodName"), "Deposit", "Withdrawal", t("country.processing"), "Notes"].map((h, i) => (
                      <th key={i} style={{ padding: "12px 14px", textAlign: "left", background: "#1e3a5f", color: "#fff", fontWeight: 700, fontSize: 14 }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {COUNTRY.payments.map((p, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px 14px", fontWeight: 600, background: i % 2 ? "#f8fafc" : "#fff" }}>{p.method}</td>
                        <td style={{ padding: "10px 14px", color: "#059669", fontWeight: 600, background: i % 2 ? "#f8fafc" : "#fff" }}>{p.deposit}</td>
                        <td style={{ padding: "10px 14px", background: i % 2 ? "#f8fafc" : "#fff" }}>{p.withdrawal}</td>
                        <td style={{ padding: "10px 14px", background: i % 2 ? "#f8fafc" : "#fff" }}>{p.time}</td>
                        <td style={{ padding: "10px 14px", color: "#64748b", fontSize: 14, background: i % 2 ? "#f8fafc" : "#fff" }}>{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== GUIDE ===== */}
      {COUNTRY.guide && COUNTRY.guide.length > 0 && (
        <section style={{ ...cn, paddingBottom: 40 }}>
          <div style={{ background: "#fff", borderRadius: mob ? 14 : 20, padding: mob ? 20 : 36, border: "1px solid #e2e8f0" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 16 }}>
              {"\uD83D\uDCDA"} {t("country.guideTitle", { country: COUNTRY.name })}
            </h2>
            <Accordion items={COUNTRY.guide} expanded={expandedGuide} setExpanded={setExpandedGuide} />
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      {COUNTRY.faq && COUNTRY.faq.length > 0 && (
        <section style={{ ...cn, paddingBottom: 40 }}>
          <div style={{ background: "#fff", borderRadius: mob ? 14 : 20, padding: mob ? 20 : 36, border: "1px solid #e2e8f0" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 16 }}>
              <HelpCircle size={24} style={{ verticalAlign: "middle" }} /> {t("country.faqTitle")}
            </h2>
            <Accordion items={COUNTRY.faq} expanded={expandedFAQ} setExpanded={setExpandedFAQ} />
          </div>
        </section>
      )}

      {/* ===== RELATED ===== */}
      {COUNTRY.related && COUNTRY.related.length > 0 && (
        <section style={{ ...cn, paddingBottom: 40 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 16 }}>
            <ExternalLink size={22} style={{ verticalAlign: "middle" }} /> {t("country.relatedTitle")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3, 1fr)", gap: mob ? 8 : 12 }}>
            {COUNTRY.related.map((cat, i) => (
              <Link key={i} to={lp(cat.url)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: mob ? "12px" : "14px 18px", borderRadius: 12,
                background: "#fff", border: "1px solid #e2e8f0", textDecoration: "none", color: "#1e293b",
              }}>
                <span style={{ fontSize: mob ? 20 : 24 }}>{cat.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: mob ? 14 : 15 }}>{cat.name}</div>
                  <div style={{ fontSize: mob ? 12 : 14, color: "#64748b" }}>{cat.count} brokers</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== DISCLOSURE ===== */}
      <section style={{ ...cn, paddingBottom: 40 }}>
        <div style={{ padding: mob ? "14px" : "18px 24px", borderRadius: 12, background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{"\uD83D\uDCCB"} {t("footer.affTitle")}</div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "#64748b", margin: 0 }}>
            {t("footer.affText")}
          </p>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{ ...cn, paddingBottom: 48 }}>
        <div style={{
          borderRadius: mob ? 14 : 20, padding: mob ? "32px 20px" : 48, textAlign: "center",
          background: "linear-gradient(135deg,#1e3a5f 0%,#2d5a8e 100%)",
          overflow: "hidden", position: "relative",
        }}>
          <div style={{ marginBottom: 10 }}><CountryFlag code={COUNTRY.code} size={mob ? 36 : 48} /></div>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 28, color: "#fff", margin: "0 0 8px" }}>
            Start Trading with a {COUNTRY.regulator} Broker
          </h2>
          <p style={{ fontSize: mob ? 14 : 16, color: "rgba(255,255,255,0.8)", marginBottom: 24, maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
            All brokers tested with real money. {COUNTRY.compensation ? COUNTRY.compensation + "." : ""}
          </p>
          <a href={BROKERS[0]?.url} target="_blank" rel="noopener noreferrer nofollow" style={{
            display: "inline-block", padding: mob ? "12px 28px" : "14px 36px", borderRadius: 12,
            background: "linear-gradient(135deg,#059669,#34d399)",
            color: "#fff", fontWeight: 700, fontSize: mob ? 15 : 16, textDecoration: "none",
          }}>{t("country.visitBroker")} #1 {COUNTRY.name} Broker <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></a>
        </div>
      </section>

      {/* ===== COMPARE FLOAT BAR ===== */}
      {compare.length >= 2 && (
        <div style={{
          position: "fixed", bottom: mob ? 16 : 24, left: "50%", transform: "translateX(-50%)",
          background: "#1e293b", borderRadius: 14, padding: mob ? "10px 16px" : "12px 24px",
          display: "flex", alignItems: "center", gap: mob ? 10 : 16, zIndex: 90,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)", maxWidth: mob ? "calc(100% - 32px)" : "auto",
        }}>
          <div style={{ display: "flex", gap: 6 }}>
            {compare.map(id => {
              const b = BROKERS.find(x => x.id === id);
              return b ? <span key={id} style={{ padding: "3px 10px", borderRadius: 6, background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 14, fontWeight: 600 }}>{b.name}</span> : null;
            })}
          </div>
          <Link to={lp("/compare")} style={{ padding: mob ? "8px 14px" : "8px 18px", borderRadius: 8, background: "linear-gradient(135deg,#059669,#34d399)", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}>Compare <ArrowRight size={14} style={{ verticalAlign: "middle" }} /></Link>
          <button onClick={() => setCompare([])} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, color: "#94a3b8", padding: "6px 10px", cursor: "pointer", fontSize: 13 }}><XIcon size={20} /></button>
        </div>
      )}
    </div>
  );
}
