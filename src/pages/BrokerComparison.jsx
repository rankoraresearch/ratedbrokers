import { useState, useEffect, useRef } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { useMedia } from "../hooks/useMedia";
import { getBrokerData } from "../data/brokers";
import { parsePair, canonicalPair, FEATURED_PAIRS } from "../data/comparisons";
import RegBadge from "../components/RegBadge";
import Stars from "../components/Stars";
import ScoreBadge from "../components/ScoreBadge";
import BrokerLogo from "../components/BrokerLogo";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import TrustpilotLogo from "../components/TrustpilotLogo";
import Breadcrumb from "../components/Breadcrumb";
import Icon, { ArrowRight, Check, ChevronDown } from "../components/Icon";
import { Trophy, Handshake } from "lucide-react";
import { getVisitUrl } from "../utils/visitUrl";

const CATEGORY_ICONS = {
  "Regulation & Safety": "shield",
  "Trading Costs": "dollar-sign",
  "User Reputation": "star",
  "Broker Transparency": "eye",
  "Platforms & Tools": "monitor",
  "Execution Model": "zap",
  // Legacy names (for old broker data files)
  "Trustpilot Score": "star",
  "Expert Evaluation": "eye",
  "Platform & Tools": "monitor",
  "Execution Quality": "zap",
};

function WinnerBadge({ winner, nameA, nameB, t }) {
  if (winner === "tie") return <span style={{ padding: "3px 10px", borderRadius: 6, background: "#f1f5f9", color: "#1f2937", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}><Handshake size={14} /> {t("comp.tie")}</span>;
  const name = winner === "a" ? nameA : nameB;
  return <span style={{ padding: "3px 10px", borderRadius: 6, background: "#ecfdf5", color: "#059669", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}><Trophy size={14} /> {name}</span>;
}

function parseCommission(s) {
  if (!s || s === "$0" || s === "None" || s === "Zero") return 0;
  const m = s.match(/\$([\d.]+)/);
  return m ? parseFloat(m[1]) * 2 : 0;
}

function parseNum(s) {
  if (!s) return 0;
  return parseInt(String(s).replace(/[^0-9]/g, "")) || 0;
}

function NotFoundView({ lp, t }) {
  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 32, marginBottom: 12 }}>{t("review.notFoundTitle")}</div>
      <p style={{ color: "#1f2937", marginBottom: 24 }}>The comparison you're looking for doesn't exist.</p>
      <Link to={lp("/compare")} style={{ padding: "12px 28px", borderRadius: 10, background: "linear-gradient(135deg,#059669,#34d399)", color: "#fff", fontWeight: 800, textDecoration: "none" }}>Browse Comparisons</Link>
    </div>
  );
}

export default function BrokerComparison() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const { mob } = useMedia();
  const { pair } = useParams();
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroRef = useRef(null);

  const parsed = parsePair(pair);
  if (!parsed) return <NotFoundView lp={lp} t={t} />;

  const [slugA, slugB] = parsed;
  if (slugA === slugB) return <Navigate to={lp(`/review/${slugA}`)} replace />;

  const canonical = canonicalPair(slugA, slugB);
  if (pair !== canonical) return <Navigate to={lp(`/compare/${canonical}`)} replace />;

  const dataA = getBrokerData(slugA);
  const dataB = getBrokerData(slugB);
  if (!dataA || !dataB) return <NotFoundView lp={lp} t={t} />;

  const A = dataA.B;
  const B = dataB.B;

  /* ========== Computed: Categories ========== */
  const categories = dataA.SCORES.map((sa, i) => {
    const sb = dataB.SCORES[i];
    if (!sb) return null;
    const diff = sa.score - sb.score;
    let winner, summary;
    if (diff > 0.1) {
      winner = "a";
      summary = sa.detail.length > 150 ? sa.detail.slice(0, 147) + "..." : sa.detail;
    } else if (diff < -0.1) {
      winner = "b";
      summary = sb.detail.length > 150 ? sb.detail.slice(0, 147) + "..." : sb.detail;
    } else {
      winner = "tie";
      summary = `Both brokers score similarly — ${A.name}: ${sa.score}/10, ${B.name}: ${sb.score}/10. Comparable performance in ${sa.name.toLowerCase()}.`;
    }
    return { name: sa.name, icon: CATEGORY_ICONS[sa.name] || "clipboard-list", scoreA: sa.score, scoreB: sb.score, winner, summary };
  }).filter(Boolean);

  const aWins = categories.filter(c => c.winner === "a").length;
  const bWins = categories.filter(c => c.winner === "b").length;
  const ties = categories.filter(c => c.winner === "tie").length;

  /* ========== Computed: Costs ========== */
  const commA = parseCommission(A.commission);
  const commB = parseCommission(B.commission);
  const totalA = parseFloat(A.avgSpread || "0") * 10 + commA;
  const totalB = parseFloat(B.avgSpread || "0") * 10 + commB;

  /* ========== Computed: Tier-1 count ========== */
  const tier1A = A.regs.filter(r => r.tier === 1).length;
  const tier1B = B.regs.filter(r => r.tier === 1).length;

  /* ========== Computed: Auto Verdict ========== */
  const aStrengths = categories.filter(c => c.winner === "a").map(c => c.name).slice(0, 2);
  const bStrengths = categories.filter(c => c.winner === "b").map(c => c.name).slice(0, 2);
  const verdictA = `Choose ${A.name} if you prioritize ${aStrengths.join(" and ") || "overall value"}. ${A.type} broker with ${A.avgSpread} pip average EUR/USD spread${A.minDep ? ` and $${A.minDep} minimum deposit` : " and no minimum deposit"}.`;
  const verdictB = `Choose ${B.name} if you prioritize ${bStrengths.join(" and ") || "overall value"}. ${B.type} broker with ${B.avgSpread} pip average EUR/USD spread${B.minDep ? ` and $${B.minDep} minimum deposit` : " and no minimum deposit"}.`;

  /* ========== Computed: Auto FAQ ========== */
  const lowerMinBroker = A.minDep <= B.minDep ? A : B;
  const higherMinBroker = A.minDep <= B.minDep ? B : A;
  const autoFAQ = [
    {
      q: `Is ${A.name} or ${B.name} better for beginners?`,
      a: `${lowerMinBroker.name} is more accessible with ${lowerMinBroker.minDep === 0 ? "no minimum deposit" : `a $${lowerMinBroker.minDep} minimum deposit`}${A.minDep !== B.minDep ? `, compared to ${higherMinBroker.name}'s $${higherMinBroker.minDep}` : ""}. Both are regulated and offer demo accounts for practice.`,
    },
    {
      q: `Which has lower spreads, ${A.name} or ${B.name}?`,
      a: parseFloat(A.avgSpread) < parseFloat(B.avgSpread)
        ? `${A.name} offers tighter average EUR/USD spreads at ${A.avgSpread} pips vs ${B.name}'s ${B.avgSpread} pips. ${A.name} uses ${A.type} execution.`
        : parseFloat(B.avgSpread) < parseFloat(A.avgSpread)
          ? `${B.name} offers tighter average EUR/USD spreads at ${B.avgSpread} pips vs ${A.name}'s ${A.avgSpread} pips. ${B.name} uses ${B.type} execution.`
          : `Both brokers offer similar EUR/USD spreads at ${A.avgSpread} pips average.`,
    },
    {
      q: `Which is safer, ${A.name} or ${B.name}?`,
      a: `${tier1A >= tier1B ? A.name : B.name} holds ${Math.max(tier1A, tier1B)} Tier-1 license${Math.max(tier1A, tier1B) > 1 ? "s" : ""} (${(tier1A >= tier1B ? A : B).regs.filter(r => r.tier === 1).map(r => r.name).join(", ")}). ${tier1A !== tier1B ? `${(tier1A < tier1B ? A : B).name} holds ${Math.min(tier1A, tier1B)}.` : "Both have equal Tier-1 coverage."} Both offer segregated client funds.`,
    },
    {
      q: `Which has lower total trading costs?`,
      a: totalA < totalB
        ? `${A.name} has lower total EUR/USD cost at $${totalA.toFixed(2)}/lot (spread + commission) vs ${B.name}'s $${totalB.toFixed(2)}/lot.`
        : totalB < totalA
          ? `${B.name} has lower total EUR/USD cost at $${totalB.toFixed(2)}/lot (spread + commission) vs ${A.name}'s $${totalA.toFixed(2)}/lot.`
          : `Both brokers have similar total EUR/USD trading costs at ~$${totalA.toFixed(2)}/lot.`,
    },
    {
      q: `Which platforms are available at ${A.name} and ${B.name}?`,
      a: (() => {
        const shared = A.platforms.filter(p => B.platforms.includes(p));
        return `${A.name} offers ${A.platforms.join(", ")}. ${B.name} offers ${B.platforms.join(", ")}.${shared.length > 0 ? ` Both support ${shared.join(", ")}.` : ""}`;
      })(),
    },
    {
      q: `Which is better overall, ${A.name} or ${B.name}?`,
      a: A.score > B.score
        ? `${A.name} scores ${A.score}/10 vs ${B.name}'s ${B.score}/10 in our testing. ${A.name} wins ${aWins} of 6 categories. The best choice depends on your trading priorities.`
        : A.score < B.score
          ? `${B.name} scores ${B.score}/10 vs ${A.name}'s ${A.score}/10 in our testing. ${B.name} wins ${bWins} of 6 categories. The best choice depends on your trading priorities.`
          : `Both brokers score ${A.score}/10. The best choice depends on your priorities — see the category breakdown above.`,
    },
  ];

  /* ========== Computed: Quick Decisions ========== */
  const instrA = parseNum(A.instruments);
  const instrB = parseNum(B.instruments);
  const quickDecisions = [
    {
      need: "Lowest Trading Cost",
      pick: totalA <= totalB ? A.name : B.name,
      color: totalA <= totalB ? "#059669" : "#2563eb",
      reason: `$${Math.min(totalA, totalB).toFixed(2)}/lot EUR/USD`,
    },
    {
      need: "Best for Beginners",
      pick: A.minDep <= B.minDep ? A.name : B.name,
      color: A.minDep <= B.minDep ? "#059669" : "#2563eb",
      reason: (A.minDep <= B.minDep ? A.minDep : B.minDep) === 0 ? "No minimum deposit" : `$${Math.min(A.minDep, B.minDep)} minimum`,
    },
    {
      need: "Most Instruments",
      pick: instrA >= instrB ? A.name : B.name,
      color: instrA >= instrB ? "#059669" : "#2563eb",
      reason: `${(instrA >= instrB ? A : B).instruments} instruments`,
    },
    {
      need: "Strongest Regulation",
      pick: tier1A >= tier1B ? A.name : B.name,
      color: tier1A >= tier1B ? "#059669" : "#2563eb",
      reason: `${Math.max(tier1A, tier1B)} Tier-1 license${Math.max(tier1A, tier1B) > 1 ? "s" : ""}`,
    },
    {
      need: "Best Platforms",
      pick: A.platforms.length >= B.platforms.length ? A.name : B.name,
      color: A.platforms.length >= B.platforms.length ? "#059669" : "#2563eb",
      reason: `${Math.max(A.platforms.length, B.platforms.length)} platforms available`,
    },
    {
      need: "Most Deposit Methods",
      pick: dataA.DEPOSITS.length >= dataB.DEPOSITS.length ? A.name : B.name,
      color: dataA.DEPOSITS.length >= dataB.DEPOSITS.length ? "#059669" : "#2563eb",
      reason: `${Math.max(dataA.DEPOSITS.length, dataB.DEPOSITS.length)} deposit methods`,
    },
  ];

  /* ========== Computed: Related Pairs ========== */
  const relatedPairs = FEATURED_PAIRS.filter(p => {
    const cp = canonicalPair(p.slugA, p.slugB);
    if (cp === canonical) return false;
    return p.slugA === slugA || p.slugB === slugA || p.slugA === slugB || p.slugB === slugB;
  }).slice(0, 6);

  /* ========== SEO ========== */
  useEffect(() => {
    document.title = `${A.name} vs ${B.name} Review 2026 | RatedBrokers`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = `Compare ${A.name} (${A.score}/10) vs ${B.name} (${B.score}/10). Spreads, fees, regulation, and platforms compared side-by-side.`;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${A.name} vs ${B.name} Comparison`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: A.name, url: `https://ratedbrokers.com/review/${slugA}` },
        { "@type": "ListItem", position: 2, name: B.name, url: `https://ratedbrokers.com/review/${slugB}` },
      ],
    });
    document.head.appendChild(script);
    const faqScript = document.createElement("script");
    faqScript.type = "application/ld+json";
    faqScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: autoFAQ.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.head.appendChild(faqScript);
    return () => { script.remove(); faqScript.remove(); };
  }, [A.name, B.name, A.score, B.score, slugA, slugB]);

  /* ========== Sticky bar: show after hero scrolls out of view ========== */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  /* =================== RENDER =================== */
  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#111827", minHeight: "100vh" }}>

      {/* =================== BREADCRUMBS =================== */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: "Forex Brokers", path: "/best-forex-brokers" },
          { label: t("comp.breadCompare"), path: "/compare" },
          { label: `${A.name} vs ${B.name}` },
        ]} />
      </div>

      {/* =================== HERO: VS CARD =================== */}
      <section ref={heroRef} style={{ ...cn, marginBottom: 32 }}>
        <div style={{ textAlign: "center", marginBottom: mob ? 16 : 28 }}>
          <h1 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 38, lineHeight: 1.15, color: "#0f172a", margin: 0 }}>
            {A.name} vs {B.name}: Which is Better in 2026?
          </h1>
          <div style={{ fontSize: mob ? 14 : 17, color: "#1f2937", marginTop: 6 }}>
            {t("comp.sideBy")}{!mob && ` ${t("comp.basedOnReal")}`} · {t("comp.updated")}
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#1f2937", maxWidth: 750, margin: "12px auto 0", textAlign: "center" }}>
            {A.name} scores {A.score}/10 and {B.name} scores {B.score}/10 in our independent testing.{" "}
            {A.name} is {A.type === B.type ? `also a ${A.type} broker` : `a ${A.type} broker`} founded in {A.year},{" "}
            while {B.name} is a {B.type} broker founded in {B.year}.{" "}
            We compare spreads from {A.avgSpread} vs {B.avgSpread} pips, {tier1A + tier1B} combined Tier-1 licenses,{" "}
            and {A.platforms.length + B.platforms.length - (A.platforms.filter(p => B.platforms.includes(p)).length)} unique platforms to help you decide.
          </p>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr auto 1fr", gap: 0,
          background: "#fff", borderRadius: mob ? 14 : 18, border: "1px solid #e2e8f0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden",
        }}>
          {/* Broker A */}
          <div style={{ padding: mob ? "20px" : "32px", textAlign: "center", borderRight: mob ? "none" : "1px solid #f1f5f9", borderBottom: mob ? "1px solid #f1f5f9" : "none" }}>
            <Link to={lp(`/review/${slugA}`)} style={{ display: "inline-flex", justifyContent: "center", marginBottom: 8, textDecoration: "none" }}><BrokerLogo slug={slugA} name={A.name} fallback={A.logo} size={72} shape="brand" variant="gray" /></Link>
            <div style={{ fontSize: 15, color: "#1f2937", marginBottom: 12 }}>Est. {A.year} · {A.hq}</div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><ScoreBadge score={A.score} size="lg" /></div>
            <a href={getTrustpilotUrl(slugA)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 16, textDecoration: "none", flexWrap: "wrap" }}>
              <TrustpilotLogo size="xs" /><Stars r={A.tp} /><span style={{ fontSize: 15, color: "#1f2937" }}>{A.tp} ({(A.tpCount / 1000).toFixed(1)}k)</span>
            </a>
            <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
              {A.regs.map(r => <RegBadge key={r.name} reg={r.name} />)}
            </div>
            <a href={getVisitUrl(slugA, A.url)} target="_blank" rel="noopener nofollow sponsored" style={{
              display: "inline-block", padding: "12px 32px", borderRadius: 10,
              background: "linear-gradient(135deg,#059669,#34d399)",
              color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(5,150,105,0.3)",
            }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{t("review.visit", { name: A.name })} <ArrowRight size={16} /></span></a>
          </div>

          {/* VS Divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: mob ? "12px 0" : "0 20px", background: "#f8f9fb" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg,#0f172a,#1e3a5f)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Outfit", fontWeight: 900, fontSize: 18, color: "#fff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}>VS</div>
          </div>

          {/* Broker B */}
          <div style={{ padding: mob ? "20px" : "32px", textAlign: "center" }}>
            <Link to={lp(`/review/${slugB}`)} style={{ display: "inline-flex", justifyContent: "center", marginBottom: 8, textDecoration: "none" }}><BrokerLogo slug={slugB} name={B.name} fallback={B.logo} size={72} shape="brand" variant="gray" /></Link>
            <div style={{ fontSize: 15, color: "#1f2937", marginBottom: 12 }}>Est. {B.year} · {B.hq}</div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><ScoreBadge score={B.score} size="lg" /></div>
            <a href={getTrustpilotUrl(slugB)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 16, textDecoration: "none", flexWrap: "wrap" }}>
              <TrustpilotLogo size="xs" /><Stars r={B.tp} /><span style={{ fontSize: 15, color: "#1f2937" }}>{B.tp} ({(B.tpCount / 1000).toFixed(1)}k)</span>
            </a>
            <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
              {B.regs.map(r => <RegBadge key={r.name} reg={r.name} />)}
            </div>
            <a href={getVisitUrl(slugB, B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
              display: "inline-block", padding: "12px 32px", borderRadius: 10,
              background: "linear-gradient(135deg,#2563eb,#60a5fa)",
              color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
            }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{t("review.visit", { name: B.name })} <ArrowRight size={16} /></span></a>
          </div>
        </div>
      </section>

      {/* =================== SCORECARD SUMMARY =================== */}
      <section style={{ ...cn, marginBottom: 32 }}>
        <div style={{
          padding: mob ? "20px" : "24px 32px", borderRadius: 14,
          background: "linear-gradient(135deg,#0f172a,#1e3a5f)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 28 : 36, fontWeight: 800, color: "#34d399" }}>{aWins}</div>
            <div style={{ fontSize: 15, color: "#64748b" }}>{A.name} {t("comp.wins")}</div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 28 : 36, fontWeight: 800, color: "#64748b" }}>{ties}</div>
            <div style={{ fontSize: 15, color: "#1f2937" }}>{t("comp.ties")}</div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 28 : 36, fontWeight: 800, color: "#60a5fa" }}>{bWins}</div>
            <div style={{ fontSize: 15, color: "#64748b" }}>{B.name} {t("comp.wins")}</div>
          </div>
        </div>
      </section>

      {/* =================== CATEGORY BREAKDOWN =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 26, marginBottom: 20 }}>
          {t("comp.categoryTitle")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {categories.map((cat, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <Icon name={cat.icon} size={24} color="#1e3a5f" />
                <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, flex: 1 }}>{cat.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: "#059669" }}>{cat.scoreA}</span>
                  <span style={{ fontSize: 14, color: "#1f2937" }}>vs</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: "#2563eb" }}>{cat.scoreB}</span>
                </div>
                <WinnerBadge winner={cat.winner} nameA={A.name} nameB={B.name} t={t} />
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.7, color: "#111827" }}>{cat.summary}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =================== MID-PAGE CTA =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <div style={{
          padding: mob ? "24px" : "28px 32px", borderRadius: 14,
          background: "linear-gradient(135deg,#059669 0%,#34d399 100%)",
          display: "flex", flexDirection: mob ? "column" : "row", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          <div style={{ color: "#fff" }}>
            <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Ready to try them out?</div>
            <div style={{ fontSize: 16, opacity: 0.9 }}>Both brokers offer demo accounts — test risk-free.</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href={getVisitUrl(slugA, A.url)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: "10px 24px", borderRadius: 8, background: "#fff", color: "#059669",
              fontWeight: 800, fontSize: 16, textDecoration: "none", whiteSpace: "nowrap",
            }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{A.name} <ArrowRight size={15} /></span></a>
            <a href={getVisitUrl(slugB, B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: "10px 24px", borderRadius: 8, background: "rgba(255,255,255,0.2)", color: "#fff",
              fontWeight: 800, fontSize: 16, textDecoration: "none", border: "1px solid rgba(255,255,255,0.4)", whiteSpace: "nowrap",
            }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{B.name} <ArrowRight size={15} /></span></a>
          </div>
        </div>
      </section>

      {/* =================== SPREAD COMPARISON =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 26, marginBottom: 6 }}>
          {t("comp.spreadTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#1f2937", marginBottom: 20 }}>{t("comp.spreadDesc")}</p>
        <div style={{ borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", background: "#fff" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", color: "#fff", fontFamily: "Outfit", fontWeight: 700, fontSize: 15 }}>Pair</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", color: "#34d399", fontFamily: "Outfit", fontWeight: 700, fontSize: 15 }}>{A.name}</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", color: "#60a5fa", fontFamily: "Outfit", fontWeight: 700, fontSize: 15 }}>{B.name}</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", color: "#fff", fontFamily: "Outfit", fontWeight: 700, fontSize: 15 }}>{t("comp.winner")}</th>
                </tr>
              </thead>
              <tbody>
                {dataA.SPREADS.map((sp, i) => {
                  const spB = dataB.SPREADS[i];
                  if (!spB) return null;
                  const valA = parseFloat(sp.values[0]);
                  const valB = parseFloat(spB.values[0]);
                  const w = valA < valB ? "a" : valA > valB ? "b" : "tie";
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8f9fb" }}>
                      <td style={{ padding: "12px 20px", fontWeight: 700, fontSize: 16 }}>{sp.pair}</td>
                      <td style={{
                        padding: "12px 20px", textAlign: "center",
                        fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 16,
                        color: w === "a" ? "#059669" : "#1f2937",
                        background: w === "a" ? "#f0fdf4" : "transparent",
                      }}>{valA.toFixed(2)} pips</td>
                      <td style={{
                        padding: "12px 20px", textAlign: "center",
                        fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 16,
                        color: w === "b" ? "#2563eb" : "#1f2937",
                        background: w === "b" ? "#eff6ff" : "transparent",
                      }}>{valB.toFixed(2)} pips</td>
                      <td style={{ padding: "12px 20px", textAlign: "center", fontSize: 15, fontWeight: 600 }}>
                        {w === "a" ? <span style={{ color: "#059669", display: "inline-flex", alignItems: "center", gap: 4 }}><Check size={14} /> {A.name}</span> : w === "b" ? <span style={{ color: "#2563eb", display: "inline-flex", alignItems: "center", gap: 4 }}><Check size={14} /> {B.name}</span> : <span style={{ color: "#1f2937" }}>{t("comp.tie")}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f8f9fb", borderTop: "2px solid #e2e8f0" }}>
                  <td style={{ padding: "14px 20px", fontWeight: 800, fontSize: 16 }}>{t("comp.commissionRT")}</td>
                  <td style={{ padding: "14px 20px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16, color: commA <= commB ? "#059669" : "#1f2937" }}>
                    {commA === 0 ? "$0" : `$${commA.toFixed(0)}`}
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16, color: commB <= commA ? "#2563eb" : "#1f2937" }}>
                    {commB === 0 ? "$0" : `$${commB.toFixed(0)}`}
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "center", fontSize: 15, fontWeight: 600, color: commA <= commB ? "#059669" : "#2563eb" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Check size={14} /> {commA <= commB ? A.name : B.name}</span>
                  </td>
                </tr>
                <tr style={{ background: "#0f172a" }}>
                  <td style={{ padding: "14px 20px", fontWeight: 800, fontSize: 16, color: "#fff" }}>{t("comp.totalCost")}</td>
                  <td style={{ padding: "14px 20px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16, color: "#34d399" }}>${totalA.toFixed(2)}</td>
                  <td style={{ padding: "14px 20px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16, color: "#60a5fa" }}>${totalB.toFixed(2)}</td>
                  <td style={{ padding: "14px 20px", textAlign: "center", fontSize: 15, fontWeight: 700, color: totalA <= totalB ? "#34d399" : "#60a5fa" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Trophy size={14} /> {totalA <= totalB ? A.name : B.name}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* =================== ACCOUNT TYPES =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 26, marginBottom: 8 }}>{t("comp.accountTitle")}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#1f2937", marginBottom: 20 }}>
          {A.name} offers {dataA.ACCOUNTS.length} account type{dataA.ACCOUNTS.length > 1 ? "s" : ""}{" "}
          {A.minDep === 0 ? "with no minimum deposit" : `starting from $${A.minDep}`}.{" "}
          {B.name} offers {dataB.ACCOUNTS.length} account type{dataB.ACCOUNTS.length > 1 ? "s" : ""}{" "}
          {B.minDep === 0 ? "with no minimum deposit" : `starting from $${B.minDep}`}.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>
          {[{ data: dataA, b: A, color: "#059669", grad: "linear-gradient(135deg,#059669,#10b981)" }, { data: dataB, b: B, color: "#2563eb", grad: "linear-gradient(135deg,#2563eb,#3b82f6)" }].map((item, bi) => (
            <div key={bi} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", background: item.grad, color: "#fff", fontFamily: "Outfit", fontWeight: 700, fontSize: 18 }}>
                {item.b.name} Accounts
              </div>
              {item.data.ACCOUNTS.map((acc, ai) => (
                <div key={ai} style={{ padding: "16px 20px", borderBottom: ai < item.data.ACCOUNTS.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{acc.name}</div>
                  <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 8 }}>
                    {[
                      { l: t("review.spread"), v: acc.spread },
                      { l: t("review.commission"), v: acc.commission || "None" },
                      { l: t("review.minDeposit"), v: acc.min === 0 ? t("comp.noMin") : `$${acc.min}` },
                      { l: t("table.bestFor"), v: acc.best },
                    ].map((d, di) => (
                      <div key={di}>
                        <div style={{ fontSize: 13, color: "#1f2937", fontWeight: 600, textTransform: "uppercase" }}>{d.l}</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{d.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* =================== FEATURE TABLE =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 26, marginBottom: 8 }}>{t("comp.featureTitle")}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#1f2937", marginBottom: 20 }}>
          A detailed side-by-side look at regulation, trading conditions, platforms, and fees for {A.name} and {B.name}.
        </p>
        <div style={{ borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", background: "#fff" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
              <thead>
                <tr style={{ background: "#f8f9fb" }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, color: "#1f2937", fontSize: 15, width: "30%" }}>{t("comp.feature")}</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 700, color: "#059669", fontSize: 15 }}>{A.name}</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 700, color: "#2563eb", fontSize: 15 }}>{B.name}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [t("comp.feat.founded"), A.year, B.year],
                  [t("comp.feat.hq"), A.hq, B.hq],
                  [t("comp.feat.regulation"), A.regs.map(r => r.name).join(", "), B.regs.map(r => r.name).join(", ")],
                  [t("comp.feat.ourScore"), A.score + "/10", B.score + "/10"],
                  [t("comp.feat.trustpilot"), A.tp + "/5 (" + (A.tpCount / 1000).toFixed(1) + "k)", B.tp + "/5 (" + (B.tpCount / 1000).toFixed(1) + "k)"],
                  [t("comp.feat.execType"), A.type, B.type],
                  [t("comp.feat.minDeposit"), A.minDep === 0 ? t("comp.noMin") : "$" + A.minDep, B.minDep === 0 ? t("comp.noMin") : "$" + B.minDep],
                  [t("comp.feat.maxLeverage"), A.leverage, B.leverage],
                  [t("comp.feat.instruments"), A.instruments, B.instruments],
                  [t("comp.feat.platforms"), A.platforms.join(", "), B.platforms.join(", ")],
                  [t("comp.feat.avgSpread"), A.avgSpread + " pips", B.avgSpread + " pips"],
                  [t("comp.feat.rawCommission"), A.commission, B.commission],
                  [t("comp.feat.depositMethods"), dataA.DEPOSITS.length + " " + t("comp.methods"), dataB.DEPOSITS.length + " " + t("comp.methods")],
                ].map((row, ri) => (
                  <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#f8f9fb" }}>
                    <td style={{ padding: "11px 20px", fontWeight: 600, fontSize: 15, color: "#111827", borderBottom: "1px solid #f1f5f9" }}>{row[0]}</td>
                    <td style={{ padding: "11px 20px", textAlign: "center", fontSize: 15, color: "#111827", borderBottom: "1px solid #f1f5f9" }}>{row[1]}</td>
                    <td style={{ padding: "11px 20px", textAlign: "center", fontSize: 15, color: "#111827", borderBottom: "1px solid #f1f5f9" }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =================== PROS & CONS =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 26, marginBottom: 8 }}>{t("comp.prosConsTitle")}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#1f2937", marginBottom: 20 }}>
          Key strengths and weaknesses identified during our independent analysis of both brokers.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>
          {[{ b: A, data: dataA, bg: "#ecfdf5", color: "#059669" }, { b: B, data: dataB, bg: "#eff6ff", color: "#2563eb" }].map((item, bi) => (
            <div key={bi} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{
                padding: "14px 20px", fontFamily: "Outfit", fontWeight: 700, fontSize: 17,
                background: item.bg, color: item.color, borderBottom: "1px solid #e2e8f0",
              }}>{item.b.name}</div>
              <div style={{ padding: "16px 20px" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#059669", textTransform: "uppercase", marginBottom: 8 }}>{t("review.pros")}</div>
                {item.data.PROS.map((p, pi) => (
                  <div key={pi} style={{ fontSize: 15, lineHeight: 1.6, color: "#111827", padding: "4px 0", paddingLeft: 16, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#059669" }}>+</span>{p}
                  </div>
                ))}
                <div style={{ fontSize: 15, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", marginTop: 16, marginBottom: 8 }}>{t("review.cons")}</div>
                {item.data.CONS.map((c, ci) => (
                  <div key={ci} style={{ fontSize: 15, lineHeight: 1.6, color: "#111827", padding: "4px 0", paddingLeft: 16, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#dc2626" }}>&minus;</span>{c}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================== EXPERT VERDICT =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 26, marginBottom: 20 }}>{t("comp.verdictTitle")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>
          {[{ b: A, verdict: verdictA, bg: "#f0fdf4", border: "#bbf7d0", color: "#059669", grad: "linear-gradient(135deg,#059669,#34d399)" },
            { b: B, verdict: verdictB, bg: "#eff6ff", border: "#bfdbfe", color: "#2563eb", grad: "linear-gradient(135deg,#2563eb,#60a5fa)" }].map((item, bi) => (
            <div key={bi} style={{ padding: "24px", borderRadius: 14, background: item.bg, border: `2px solid ${item.border}` }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, color: item.color, marginBottom: 6 }}>
                {t("comp.chooseIf", { name: item.b.name })}
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#111827", margin: 0 }}>{item.verdict}</p>
              <a href={item.b.url} target="_blank" rel="noopener noreferrer nofollow" style={{
                display: "inline-block", marginTop: 16, padding: "12px 28px", borderRadius: 10,
                background: item.grad, color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none",
              }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{t("review.visit", { name: item.b.name })} <ArrowRight size={15} /></span></a>
            </div>
          ))}
        </div>
      </section>

      {/* =================== QUICK DECISION =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 26, marginBottom: 8 }}>{t("comp.quickTitle")}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#1f2937", marginBottom: 20 }}>
          Based on our testing data, here's which broker is better for specific trading needs.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {quickDecisions.map((item, i) => (
            <div key={i} style={{
              padding: "14px 18px", borderRadius: 12,
              background: "#fff", border: "1px solid #e2e8f0",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 8, height: 36, borderRadius: 4, background: item.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{item.need}</div>
                <div style={{ fontSize: 15, color: item.color, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><ArrowRight size={14} /> {item.pick}</div>
                <div style={{ fontSize: 14, color: "#1f2937" }}>{item.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================== FAQ =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 26, marginBottom: 8 }}>{t("comp.faqTitle")}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#1f2937", marginBottom: 20 }}>
          Common questions traders ask when choosing between {A.name} and {B.name}.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {autoFAQ.map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)} style={{
                padding: "16px 20px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <h3 style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>{item.q}</h3>
                <ChevronDown size={20} color="#374151" style={{ transition: "transform 0.2s", transform: expandedFAQ === i ? "rotate(180deg)" : "none" }} />
              </div>
              {expandedFAQ === i && (
                <div style={{ padding: "0 20px 18px", fontSize: 16, lineHeight: 1.8, color: "#111827", borderTop: "1px solid #f1f5f9" }}>
                  <p style={{ marginTop: 12 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =================== RELATED COMPARISONS =================== */}
      {relatedPairs.length > 0 && (
        <section style={{ ...cn, marginBottom: 48 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 26, marginBottom: 20 }}>{t("comp.moreTitle")}</h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
            {relatedPairs.map((rp, i) => {
              const rA = getBrokerData(rp.slugA);
              const rB = getBrokerData(rp.slugB);
              if (!rA || !rB) return null;
              const cp = canonicalPair(rp.slugA, rp.slugB);
              return (
                <Link key={i} to={lp(`/compare/${cp}`)} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "16px", borderRadius: 12,
                  background: "#fff", border: "1px solid #e2e8f0",
                  textDecoration: "none", fontFamily: "Outfit", fontWeight: 700, fontSize: 16, color: "#111827",
                }}>
                  {rA.B.name} vs {rB.B.name} <ArrowRight size={18} color="#cbd5e1" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* =================== BOTTOM LINE =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 26, marginBottom: 12 }}>
            {A.name} vs {B.name}: The Bottom Line
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", marginBottom: 12 }}>
            {A.score >= B.score ? A.name : B.name} takes the overall lead with a {Math.max(A.score, B.score)}/10 score,
            winning {Math.max(aWins, bWins)} out of 6 categories in our head-to-head comparison.
            {A.score >= B.score
              ? ` ${A.name}'s strengths lie in ${aStrengths.length > 0 ? aStrengths.join(" and ").toLowerCase() : "overall value"}, making it a strong choice for ${parseFloat(A.avgSpread) < 0.5 ? "active traders and scalpers" : "traders looking for a reliable platform"}.`
              : ` ${B.name}'s strengths lie in ${bStrengths.length > 0 ? bStrengths.join(" and ").toLowerCase() : "overall value"}, making it a strong choice for ${parseFloat(B.avgSpread) < 0.5 ? "active traders and scalpers" : "traders looking for a reliable platform"}.`
            }
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", margin: 0 }}>
            {A.score < B.score ? A.name : B.name} remains competitive
            {Math.min(aWins, bWins) > 0 ? `, winning ${Math.min(aWins, bWins)} categor${Math.min(aWins, bWins) > 1 ? "ies" : "y"}` : ""}.{" "}
            {A.minDep < B.minDep
              ? `${A.name}'s lower $${A.minDep || 0} minimum deposit makes it more accessible for beginners.`
              : B.minDep < A.minDep
                ? `${B.name}'s lower $${B.minDep || 0} minimum deposit makes it more accessible for beginners.`
                : "Both brokers offer the same minimum deposit requirements."
            }{" "}
            We recommend opening demo accounts with both to test execution and platform fit before committing real funds.
          </p>
        </div>
      </section>

      {/* =================== FINAL CTA =================== */}
      <section style={{ ...cn, marginBottom: showStickyBar ? 100 : 48 }}>
        <div style={{ padding: mob ? "28px 20px" : "40px", borderRadius: 16, background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)", textAlign: "center" }}>
          <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 28, color: "#fff", marginBottom: 8 }}>{t("comp.ctaTitle")}</div>
          <div style={{ fontSize: mob ? 15 : 16, color: "#64748b", marginBottom: 24 }}>{t("comp.ctaDesc")}</div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={getVisitUrl(slugA, A.url)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: mob ? "12px 24px" : "14px 32px", borderRadius: 10,
              background: "linear-gradient(135deg,#059669,#34d399)",
              color: "#fff", fontWeight: 800, fontSize: mob ? 15 : 16, textDecoration: "none",
            }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{t("review.visit", { name: A.name })} <ArrowRight size={16} /></span></a>
            <a href={getVisitUrl(slugB, B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: mob ? "12px 24px" : "14px 32px", borderRadius: 10,
              background: "linear-gradient(135deg,#2563eb,#60a5fa)",
              color: "#fff", fontWeight: 800, fontSize: mob ? 15 : 16, textDecoration: "none",
            }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{t("review.visit", { name: B.name })} <ArrowRight size={16} /></span></a>
          </div>
          <div style={{ fontSize: 14, color: "#1f2937", marginTop: 16 }}>{t("comp.ctaRisk")}</div>
        </div>
      </section>

      {/* =================== STICKY BOTTOM BAR =================== */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999,
        transform: showStickyBar ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "rgba(15, 23, 42, 0.97)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: mob ? "10px 16px" : "12px 24px",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: mob ? 8 : 24,
        }}>
          {/* Broker A */}
          <div style={{ display: "flex", alignItems: "center", gap: mob ? 6 : 12, flex: mob ? 1 : "0 0 auto" }}>
            {!mob && <BrokerLogo slug={slugA} name={A.name} fallback={A.logo} size={40} shape="icon" variant="gray" />}
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 12 : 14, color: "#fff",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{A.name}</div>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: mob ? 11 : 12,
                color: "#34d399",
              }}>{A.score}/10</div>
            </div>
            <a href={getVisitUrl(slugA, A.url)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: mob ? "8px 12px" : "9px 20px", borderRadius: 8,
              background: "linear-gradient(135deg,#059669,#34d399)",
              color: "#fff", fontWeight: 800, fontSize: mob ? 12 : 14,
              textDecoration: "none", whiteSpace: "nowrap",
              display: "inline-flex", alignItems: "center", gap: 4,
              boxShadow: "0 2px 8px rgba(5,150,105,0.3)",
              transition: "transform 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {mob ? "Visit" : t("review.visit", { name: A.name })} <ArrowRight size={mob ? 12 : 14} />
            </a>
          </div>

          {/* VS divider */}
          <div style={{
            width: mob ? 28 : 36, height: mob ? 28 : 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 10 : 12, color: "#64748b",
            flexShrink: 0,
          }}>VS</div>

          {/* Broker B */}
          <div style={{ display: "flex", alignItems: "center", gap: mob ? 6 : 12, flex: mob ? 1 : "0 0 auto", justifyContent: "flex-end" }}>
            {!mob && <BrokerLogo slug={slugB} name={B.name} fallback={B.logo} size={40} shape="icon" variant="gray" />}
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 12 : 14, color: "#fff",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{B.name}</div>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: mob ? 11 : 12,
                color: "#60a5fa",
              }}>{B.score}/10</div>
            </div>
            <a href={getVisitUrl(slugB, B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: mob ? "8px 12px" : "9px 20px", borderRadius: 8,
              background: "linear-gradient(135deg,#2563eb,#60a5fa)",
              color: "#fff", fontWeight: 800, fontSize: mob ? 12 : 14,
              textDecoration: "none", whiteSpace: "nowrap",
              display: "inline-flex", alignItems: "center", gap: 4,
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              transition: "transform 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {mob ? "Visit" : t("review.visit", { name: B.name })} <ArrowRight size={mob ? 12 : 14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
