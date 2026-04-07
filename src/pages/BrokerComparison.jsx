import { useState, useEffect, useRef } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { useMedia } from "../hooks/useMedia";
import { getBrokerData } from "../data/brokers";
import { parsePair, canonicalPair, FEATURED_PAIRS } from "../data/comparisons";
import { AUTHORS } from "../data/authors";
import RegBadge from "../components/RegBadge";
import Stars from "../components/Stars";
import ScoreBadge from "../components/ScoreBadge";
import BrokerLogo from "../components/BrokerLogo";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import TrustpilotLogo from "../components/TrustpilotLogo";
import Breadcrumb from "../components/Breadcrumb";
import HeroBand from "../components/HeroBand";
import AuthorCredits from "../components/AuthorCredits";
import Icon, { ArrowRight, Check, ChevronDown } from "../components/Icon";
import { Trophy, Handshake } from "lucide-react";
import { getVisitUrl } from "../utils/visitUrl";
import {
  getComparisonVertical, isForexPair, isStockPair, isOptionsPair, isFuturesPair, isGenericPair,
  BREADCRUMB_MAP, getCTAText, getCTATextShort,
} from "../utils/comparisonVertical";

const CATEGORY_ICONS = {
  "Regulation & Safety": "shield",
  "Trading Costs": "dollar-sign",
  "User Reputation": "star",
  "Broker Transparency": "eye",
  "Platforms & Tools": "monitor",
  "Execution Model": "zap",
  "Trustpilot Score": "star",
  "Expert Evaluation": "eye",
  "Platform & Tools": "monitor",
  "Execution Quality": "zap",
};

function WinnerBadge({ winner, nameA, nameB, t }) {
  if (winner === "tie") return <span style={{ padding: "3px 10px", borderRadius: 6, background: "#f1f5f9", color: "#64748b", fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}><Handshake size={14} /> {t("comp.tie")}</span>;
  const name = winner === "a" ? nameA : nameB;
  const bg = winner === "a" ? "#ecfdf5" : "#fef3c7";
  const color = winner === "a" ? "#059669" : "#d97706";
  return <span style={{ padding: "3px 10px", borderRadius: 6, background: bg, color, fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}><Trophy size={14} /> {name}</span>;
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
      <p style={{ color: "#374151", marginBottom: 24 }}>The comparison you're looking for doesn't exist.</p>
      <Link to={lp("/compare")} className="cta-orange" style={{ padding: "12px 28px", borderRadius: 10, background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#0f172a", fontWeight: 800, textDecoration: "none" }}>Browse Comparisons</Link>
    </div>
  );
}

export default function BrokerComparison() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const { mob, tab } = useMedia();
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
  const vertical = getComparisonVertical(A, B);
  const isForex = isForexPair(vertical);
  const isStock = isStockPair(vertical);
  const author = AUTHORS["marcus-chen"];
  const editor = AUTHORS["sarah-williams"];

  /* ========== Categories ========== */
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

  /* ========== Costs (safe for non-forex) ========== */
  const commA = parseCommission(A.commission);
  const commB = parseCommission(B.commission);
  const spreadA = parseFloat(A.avgSpread);
  const spreadB = parseFloat(B.avgSpread);
  const hasForexCosts = !isNaN(spreadA) && !isNaN(spreadB);
  const totalA = hasForexCosts ? spreadA * 10 + commA : 0;
  const totalB = hasForexCosts ? spreadB * 10 + commB : 0;

  /* ========== Tier-1 count ========== */
  const tier1A = A.regs.filter(r => r.tier === 1).length;
  const tier1B = B.regs.filter(r => r.tier === 1).length;

  /* ========== Strengths ========== */
  const aStrengths = categories.filter(c => c.winner === "a").map(c => c.name).slice(0, 2);
  const bStrengths = categories.filter(c => c.winner === "b").map(c => c.name).slice(0, 2);

  /* ========== Verdict (vertical-adaptive) ========== */
  function buildVerdict(broker, strengths) {
    const str = strengths.length > 0 ? strengths.join(" and ") : "overall value";
    let costInfo;
    if (isForex && broker.avgSpread && broker.avgSpread !== "N/A") {
      costInfo = `${broker.avgSpread} pip EUR/USD spread`;
    } else if (isStock) {
      costInfo = `${broker.commission_per_trade || broker.commission || "$0"} stock trades${broker.fractional_shares ? ", fractional shares" : ""}`;
    } else if (isOptionsPair(vertical)) {
      costInfo = `${broker.options_contract_fee || broker.commission} per options contract`;
    } else if (isFuturesPair(vertical)) {
      costInfo = `${broker.futures_commission || broker.commission} per futures contract`;
    } else {
      costInfo = `competitive fees`;
    }
    const depInfo = broker.minDep ? `$${broker.minDep} minimum` : "no minimum deposit";
    return `Choose ${broker.name} if you prioritize ${str}. ${broker.type} broker with ${costInfo} and ${depInfo}.`;
  }
  const verdictA = buildVerdict(A, aStrengths);
  const verdictB = buildVerdict(B, bStrengths);

  /* ========== Hero description ========== */
  const uniquePlatforms = A.platforms.length + B.platforms.length - A.platforms.filter(p => B.platforms.includes(p)).length;
  const heroDesc = (() => {
    const base = `${A.name} scores ${A.score}/10 and ${B.name} scores ${B.score}/10 in our independent testing. `;
    const typeInfo = A.type === B.type ? `Both are ${A.type} brokers` : `${A.name} is a ${A.type} broker, ${B.name} is a ${B.type} broker`;
    const founded = `, founded in ${A.year} and ${B.year}. `;
    let comparison;
    if (isForex) {
      comparison = `We compare spreads from ${A.avgSpread} vs ${B.avgSpread} pips, ${tier1A + tier1B} combined Tier-1 licenses, and ${uniquePlatforms} unique platforms.`;
    } else if (isStock) {
      comparison = `We compare commissions, ${A.fractional_shares && B.fractional_shares ? "fractional shares, " : ""}${tier1A + tier1B} combined Tier-1 licenses, and ${uniquePlatforms} unique platforms.`;
    } else if (isOptionsPair(vertical)) {
      comparison = `We compare per-contract fees, platform capabilities, and ${tier1A + tier1B} combined Tier-1 licenses.`;
    } else if (isFuturesPair(vertical)) {
      comparison = `We compare futures commissions, margins, and ${tier1A + tier1B} combined Tier-1 licenses.`;
    } else {
      comparison = `We compare fees, regulation, and ${uniquePlatforms} unique platforms.`;
    }
    return base + typeInfo + founded + comparison;
  })();

  /* ========== Auto FAQ (vertical-adaptive) ========== */
  const lowerMinBroker = A.minDep <= B.minDep ? A : B;
  const autoFAQ = [];

  // Q1: Beginners (universal)
  autoFAQ.push({
    q: `Is ${A.name} or ${B.name} better for beginners?`,
    a: `${lowerMinBroker.name} is more accessible with ${lowerMinBroker.minDep === 0 ? "no minimum deposit" : `a $${lowerMinBroker.minDep} minimum deposit`}. Both are regulated and offer ${isStock ? "educational resources and paper trading" : "demo accounts for practice"}.`,
  });

  // Q2: Costs (adaptive)
  if (isForex && hasForexCosts) {
    autoFAQ.push({
      q: `Which has lower spreads, ${A.name} or ${B.name}?`,
      a: spreadA < spreadB
        ? `${A.name} offers tighter average EUR/USD spreads at ${A.avgSpread} pips vs ${B.name}'s ${B.avgSpread} pips.`
        : spreadB < spreadA
          ? `${B.name} offers tighter average EUR/USD spreads at ${B.avgSpread} pips vs ${A.name}'s ${A.avgSpread} pips.`
          : `Both brokers offer similar EUR/USD spreads at ${A.avgSpread} pips average.`,
    });
  } else if (isStock) {
    autoFAQ.push({
      q: `Which has lower commissions, ${A.name} or ${B.name}?`,
      a: `${A.name} charges ${A.commission_per_trade || A.commission || "$0"} per stock/ETF trade. ${B.name} charges ${B.commission_per_trade || B.commission || "$0"} per stock/ETF trade.${(A.commission_per_trade === "$0" || A.commission === "$0") && (B.commission_per_trade === "$0" || B.commission === "$0") ? " Both offer commission-free stock and ETF trading." : ""}`,
    });
  } else {
    autoFAQ.push({
      q: `Which has lower fees, ${A.name} or ${B.name}?`,
      a: `${A.name} charges ${A.commission || "competitive fees"} while ${B.name} charges ${B.commission || "competitive fees"}. Compare the detailed fee schedule above.`,
    });
  }

  // Q3: Safety (universal)
  autoFAQ.push({
    q: `Which is safer, ${A.name} or ${B.name}?`,
    a: `${tier1A >= tier1B ? A.name : B.name} holds ${Math.max(tier1A, tier1B)} Tier-1 license${Math.max(tier1A, tier1B) > 1 ? "s" : ""} (${(tier1A >= tier1B ? A : B).regs.filter(r => r.tier === 1).map(r => r.name).join(", ")}). ${tier1A !== tier1B ? `${(tier1A < tier1B ? A : B).name} holds ${Math.min(tier1A, tier1B)}.` : "Both have equal Tier-1 coverage."} Both offer segregated client funds.`,
  });

  // Q4: Value (adaptive)
  if (isForex && hasForexCosts) {
    autoFAQ.push({
      q: `Which has lower total trading costs?`,
      a: totalA < totalB
        ? `${A.name} has lower total EUR/USD cost at $${totalA.toFixed(2)}/lot vs ${B.name}'s $${totalB.toFixed(2)}/lot.`
        : totalB < totalA
          ? `${B.name} has lower total EUR/USD cost at $${totalB.toFixed(2)}/lot vs ${A.name}'s $${totalA.toFixed(2)}/lot.`
          : `Both brokers have similar total EUR/USD trading costs at ~$${totalA.toFixed(2)}/lot.`,
    });
  } else if (isStock) {
    autoFAQ.push({
      q: `Which offers better value for investors?`,
      a: (() => {
        const pts = [];
        if (A.fractional_shares) pts.push(`${A.name} offers fractional shares`);
        if (B.fractional_shares) pts.push(`${B.name} offers fractional shares`);
        if (A.dividend_reinvestment) pts.push(`${A.name} has automatic DRIP`);
        if (B.dividend_reinvestment) pts.push(`${B.name} has automatic DRIP`);
        return pts.length > 0 ? pts.join(". ") + ". Compare tools and research capabilities above." : "Both offer competitive pricing. Compare tools and research capabilities above.";
      })(),
    });
  }

  // Q5: Platforms (universal)
  autoFAQ.push({
    q: `Which platforms are available at ${A.name} and ${B.name}?`,
    a: (() => {
      const shared = A.platforms.filter(p => B.platforms.includes(p));
      return `${A.name} offers ${A.platforms.join(", ")}. ${B.name} offers ${B.platforms.join(", ")}.${shared.length > 0 ? ` Both support ${shared.join(", ")}.` : ""}`;
    })(),
  });

  // Q6: Overall (universal)
  autoFAQ.push({
    q: `Which is better overall, ${A.name} or ${B.name}?`,
    a: A.score > B.score
      ? `${A.name} scores ${A.score}/10 vs ${B.name}'s ${B.score}/10 in our testing. ${A.name} wins ${aWins} of 6 categories. The best choice depends on your priorities.`
      : A.score < B.score
        ? `${B.name} scores ${B.score}/10 vs ${A.name}'s ${A.score}/10 in our testing. ${B.name} wins ${bWins} of 6 categories. The best choice depends on your priorities.`
        : `Both brokers score ${A.score}/10. The best choice depends on your priorities — see the category breakdown above.`,
  });

  /* ========== Quick Decisions (vertical-adaptive) ========== */
  const instrA = parseNum(A.instruments);
  const instrB = parseNum(B.instruments);
  const quickDecisions = [];

  // Cost — compare both brokers
  if (isForex && hasForexCosts) {
    quickDecisions.push({ need: "Lowest Trading Cost", pick: totalA <= totalB ? A.name : B.name, reason: `$${Math.min(totalA, totalB).toFixed(2)}/lot EUR/USD` });
  } else if (isStock) {
    const feeA = A.commission_per_trade || A.commission || "$0";
    const feeB = B.commission_per_trade || B.commission || "$0";
    const bothZero = feeA === "$0" && feeB === "$0";
    quickDecisions.push({ need: "Lowest Trading Cost", pick: bothZero ? "Both" : (feeA === "$0" ? A.name : feeB === "$0" ? B.name : A.name), reason: bothZero ? "$0 commissions — both" : `${feeA === "$0" ? feeA : feeB} per trade` });
  } else if (isOptionsPair(vertical)) {
    const feeA = A.options_contract_fee || A.commission || "N/A";
    const feeB = B.options_contract_fee || B.commission || "N/A";
    quickDecisions.push({ need: "Lowest Options Cost", pick: feeA === feeB ? "Both" : A.name, reason: `${feeA} per contract` });
  } else if (isFuturesPair(vertical)) {
    const feeA = A.futures_commission || A.commission || "N/A";
    const feeB = B.futures_commission || B.commission || "N/A";
    quickDecisions.push({ need: "Lowest Futures Cost", pick: feeA === feeB ? "Both" : A.name, reason: `${feeA} per contract` });
  } else {
    const feeA = A.commission || "N/A";
    const feeB = B.commission || "N/A";
    quickDecisions.push({ need: "Lowest Trading Cost", pick: feeA === feeB ? "Both" : A.name, reason: `${feeA}` });
  }

  // Beginners
  quickDecisions.push({ need: "Best for Beginners", pick: A.minDep <= B.minDep ? A.name : B.name, reason: (A.minDep <= B.minDep ? A.minDep : B.minDep) === 0 ? "No minimum deposit" : `$${Math.min(A.minDep, B.minDep)} minimum` });

  // Instruments/assets
  quickDecisions.push({ need: isStock ? "Most Stocks & ETFs" : "Most Instruments", pick: instrA >= instrB ? A.name : B.name, reason: `${(instrA >= instrB ? A : B).instruments} available` });

  // Regulation
  quickDecisions.push({ need: "Strongest Regulation", pick: tier1A >= tier1B ? A.name : B.name, reason: `${Math.max(tier1A, tier1B)} Tier-1 license${Math.max(tier1A, tier1B) > 1 ? "s" : ""}` });

  // Platforms
  quickDecisions.push({ need: "Best Platforms", pick: A.platforms.length >= B.platforms.length ? A.name : B.name, reason: `${Math.max(A.platforms.length, B.platforms.length)} platforms` });

  // Deposits
  quickDecisions.push({ need: "Most Deposit Methods", pick: dataA.DEPOSITS.length >= dataB.DEPOSITS.length ? A.name : B.name, reason: `${Math.max(dataA.DEPOSITS.length, dataB.DEPOSITS.length)} methods` });

  /* ========== Feature Table Rows (vertical-adaptive) ========== */
  const featureRows = [
    [t("comp.feat.founded"), A.year, B.year],
    [t("comp.feat.hq"), A.hq, B.hq],
    [t("comp.feat.regulation"), A.regs.map(r => r.name).join(", "), B.regs.map(r => r.name).join(", ")],
    [t("comp.feat.ourScore"), A.score + "/10", B.score + "/10"],
    [t("comp.feat.trustpilot"), A.tp + "/5 (" + (A.tpCount / 1000).toFixed(1) + "k)", B.tp + "/5 (" + (B.tpCount / 1000).toFixed(1) + "k)"],
    [t("comp.feat.execType"), A.type, B.type],
    [t("comp.feat.minDeposit"), A.minDep === 0 ? t("comp.noMin") : "$" + A.minDep, B.minDep === 0 ? t("comp.noMin") : "$" + B.minDep],
  ];

  if (isForex) {
    featureRows.push(
      [t("comp.feat.maxLeverage"), A.leverage, B.leverage],
      [t("comp.feat.instruments"), A.instruments, B.instruments],
      [t("comp.feat.avgSpread"), A.avgSpread + " pips", B.avgSpread + " pips"],
      [t("comp.feat.rawCommission"), A.commission, B.commission],
    );
  } else if (isStock) {
    featureRows.push(
      ["Commission per Trade", A.commission_per_trade || A.commission, B.commission_per_trade || B.commission],
      ["Fractional Shares", A.fractional_shares ? "Yes" : "No", B.fractional_shares ? "Yes" : "No"],
      ["Real Stocks (not CFD)", A.real_stocks ? "Yes" : "No", B.real_stocks ? "Yes" : "No"],
      ["Dividend Reinvestment", A.dividend_reinvestment ? "Yes" : "No", B.dividend_reinvestment ? "Yes" : "No"],
      ["Extended Hours", A.extended_hours ? "Yes" : "No", B.extended_hours ? "Yes" : "No"],
      ["IPO Access", A.ipo_access ? "Yes" : "No", B.ipo_access ? "Yes" : "No"],
      ["Available Assets", A.instruments, B.instruments],
    );
  } else if (isOptionsPair(vertical)) {
    featureRows.push(
      ["Per Contract Fee", A.options_contract_fee || "N/A", B.options_contract_fee || "N/A"],
      ["Multi-Leg Orders", A.multi_leg_orders ? "Yes" : "No", B.multi_leg_orders ? "Yes" : "No"],
      ["Paper Trading", A.paper_trading ? "Yes" : "No", B.paper_trading ? "Yes" : "No"],
      [t("comp.feat.instruments"), A.instruments, B.instruments],
    );
  } else if (isFuturesPair(vertical)) {
    featureRows.push(
      ["Commission/Contract", A.futures_commission || "N/A", B.futures_commission || "N/A"],
      ["Micro Futures", A.micro_futures ? "Yes" : "No", B.micro_futures ? "Yes" : "No"],
      [t("comp.feat.instruments"), A.instruments, B.instruments],
    );
  } else {
    featureRows.push(
      [t("comp.feat.instruments"), A.instruments, B.instruments],
      [t("comp.feat.rawCommission"), A.commission, B.commission],
    );
  }
  featureRows.push(
    [t("comp.feat.platforms"), A.platforms.join(", "), B.platforms.join(", ")],
    [t("comp.feat.depositMethods"), dataA.DEPOSITS.length + " " + t("comp.methods"), dataB.DEPOSITS.length + " " + t("comp.methods")],
  );

  /* ========== Related Pairs ========== */
  const relatedPairs = FEATURED_PAIRS.filter(p => {
    const cp = canonicalPair(p.slugA, p.slugB);
    if (cp === canonical) return false;
    return p.slugA === slugA || p.slugB === slugA || p.slugA === slugB || p.slugB === slugB;
  }).slice(0, 6);

  /* ========== SEO ========== */
  useEffect(() => {
    document.title = `${A.name} vs ${B.name} Review 2026 | RatedBrokers`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      if (isStock) meta.content = `Compare ${A.name} (${A.score}/10) vs ${B.name} (${B.score}/10). Commissions, fractional shares, platforms, and features compared.`;
      else if (isOptionsPair(vertical)) meta.content = `Compare ${A.name} (${A.score}/10) vs ${B.name} (${B.score}/10). Options fees, platforms, and tools compared.`;
      else if (isFuturesPair(vertical)) meta.content = `Compare ${A.name} (${A.score}/10) vs ${B.name} (${B.score}/10). Futures commissions, platforms, and margins compared.`;
      else meta.content = `Compare ${A.name} (${A.score}/10) vs ${B.name} (${B.score}/10). Spreads, fees, regulation, and platforms compared side-by-side.`;
    }
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "ItemList",
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
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: autoFAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
    document.head.appendChild(faqScript);
    return () => { script.remove(); faqScript.remove(); };
  }, [A.name, B.name, A.score, B.score, slugA, slugB]);

  /* ========== Sticky bar observer ========== */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const crumb = BREADCRUMB_MAP[vertical] || BREADCRUMB_MAP.forex;
  const ctaA = getCTAText(A.name, vertical);
  const ctaB = getCTAText(B.name, vertical);
  const ctaShort = getCTATextShort(vertical);
  const midCTA = isForex ? "Both brokers offer demo accounts — test risk-free." : isStock ? "Both brokers offer $0 commission trading — open an account in minutes." : "Compare both platforms — open demo accounts to test.";

  /* =================== RENDER =================== */
  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#111827", minHeight: "100vh" }}>

      {/* ── BREADCRUMBS ── */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: crumb.label, path: crumb.path },
          { label: t("comp.breadCompare"), path: "/compare" },
          { label: `${A.name} vs ${B.name}` },
        ]} />
      </div>

      {/* ── HERO BAND ── */}
      <HeroBand mob={mob} tab={tab}>
        <div style={{ textAlign: "center", marginBottom: mob ? 16 : 24 }}>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 800,
            fontSize: mob ? 24 : tab ? 32 : 42,
            lineHeight: 1.1, color: "#fff", margin: 0,
          }}>
            {A.name} vs {B.name}
          </h1>
          <p style={{ fontSize: mob ? 14 : 17, color: "rgba(255,255,255,0.65)", marginTop: 8 }}>
            Side-by-side comparison based on 130+ data points · Updated April 2026
          </p>
        </div>

        {/* VS Card — white on dark */}
        <div ref={heroRef} style={{
          background: "#fff", borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden", maxWidth: 900, margin: "0 auto",
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr auto 1fr", gap: 0,
          }}>
            {/* Broker A */}
            <div style={{ padding: mob ? "24px 20px" : "32px", textAlign: "center", borderRight: mob ? "none" : "1px solid #f1f5f9", borderBottom: mob ? "1px solid #f1f5f9" : "none" }}>
              <Link to={lp(`/review/${slugA}`)} style={{ display: "inline-flex", justifyContent: "center", marginBottom: 10, textDecoration: "none" }}>
                <BrokerLogo slug={slugA} name={A.name} fallback={A.logo} size={72} shape="brand" variant="gray" />
              </Link>
              <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 12 }}>Est. {A.year} · {A.hq}</div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><ScoreBadge score={A.score} size="lg" /></div>
              <a href={getTrustpilotUrl(slugA)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 14, textDecoration: "none", flexWrap: "wrap" }}>
                <TrustpilotLogo size="xs" /><Stars r={A.tp} /><span style={{ fontSize: 14, color: "#374151" }}>{A.tp} ({(A.tpCount / 1000).toFixed(1)}k)</span>
              </a>
              <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
                {A.regs.map(r => <RegBadge key={r.name} reg={r.name} />)}
              </div>
              <a href={getVisitUrl(slugA, A.url)} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                display: "inline-block", padding: "12px 28px", borderRadius: 10,
                background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
                color: "#0f172a", fontWeight: 800, fontSize: 15, textDecoration: "none",
                boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
              }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{ctaA} <ArrowRight size={15} /></span></a>
            </div>

            {/* VS Divider */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: mob ? "14px 0" : "0 20px", background: "#f8f9fb" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg,#0f172a,#1e3a5f)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Outfit", fontWeight: 900, fontSize: 18, color: "#fff",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}>VS</div>
            </div>

            {/* Broker B */}
            <div style={{ padding: mob ? "24px 20px" : "32px", textAlign: "center" }}>
              <Link to={lp(`/review/${slugB}`)} style={{ display: "inline-flex", justifyContent: "center", marginBottom: 10, textDecoration: "none" }}>
                <BrokerLogo slug={slugB} name={B.name} fallback={B.logo} size={72} shape="brand" variant="gray" />
              </Link>
              <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 12 }}>Est. {B.year} · {B.hq}</div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><ScoreBadge score={B.score} size="lg" /></div>
              <a href={getTrustpilotUrl(slugB)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 14, textDecoration: "none", flexWrap: "wrap" }}>
                <TrustpilotLogo size="xs" /><Stars r={B.tp} /><span style={{ fontSize: 14, color: "#374151" }}>{B.tp} ({(B.tpCount / 1000).toFixed(1)}k)</span>
              </a>
              <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
                {B.regs.map(r => <RegBadge key={r.name} reg={r.name} />)}
              </div>
              <a href={getVisitUrl(slugB, B.url)} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                display: "inline-block", padding: "12px 28px", borderRadius: 10,
                background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
                color: "#0f172a", fontWeight: 800, fontSize: 15, textDecoration: "none",
                boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
              }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{ctaB} <ArrowRight size={15} /></span></a>
            </div>
          </div>

          {/* Hero description inside card */}
          <div style={{ padding: mob ? "16px 20px" : "16px 32px", borderTop: "1px solid #f1f5f9", background: "#f8f9fb" }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", margin: 0, textAlign: "center" }}>{heroDesc}</p>
          </div>
        </div>

        {/* Author credits */}
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <AuthorCredits author={author} editor={editor} updatedDate="April 2026" onDark compact={mob} />
        </div>
      </HeroBand>

      {/* ── SCORECARD SUMMARY ── */}
      <section style={{ ...cn, marginBottom: 32, marginTop: -20 }}>
        <div style={{
          padding: mob ? "20px" : "24px 32px", borderRadius: 16,
          background: "linear-gradient(135deg,#0f172a,#1e3a5f)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 28 : 36, fontWeight: 800, color: "#34d399" }}>{aWins}</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{A.name} {t("comp.wins")}</div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 28 : 36, fontWeight: 800, color: "#94a3b8" }}>{ties}</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{t("comp.ties")}</div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 28 : 36, fontWeight: 800, color: "#fbbf24" }}>{bWins}</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{B.name} {t("comp.wins")}</div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY BREAKDOWN ── */}
      <div style={{ background: "#fff", padding: "48px 0" }}>
        <section style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 26, marginBottom: 20 }}>{t("comp.categoryTitle")}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {categories.map((cat, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 14,
                border: cat.winner === "tie" ? "1px solid #e2e8f0" : "1px solid #e2e8f0",
                borderLeft: cat.winner === "a" ? "4px solid #059669" : cat.winner === "b" ? "4px solid #f59e0b" : "1px solid #e2e8f0",
                padding: "18px 24px",
                boxShadow: cat.winner !== "tie" ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: cat.winner === "a" ? "#ecfdf5" : cat.winner === "b" ? "#fef3c7" : "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={cat.icon} size={18} color={cat.winner === "a" ? "#059669" : cat.winner === "b" ? "#d97706" : "#64748b"} />
                  </div>
                  <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, flex: 1 }}>{cat.name}</span>
                  <WinnerBadge winner={cat.winner} nameA={A.name} nameB={B.name} t={t} />
                </div>
                {/* Score bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: "#059669", minWidth: 32 }}>{cat.scoreA}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#e2e8f0", position: "relative", overflow: "hidden" }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, bottom: 0,
                      width: `${(cat.scoreA / (cat.scoreA + cat.scoreB)) * 100}%`,
                      background: "linear-gradient(90deg, #059669, #34d399)",
                      borderRadius: 3,
                    }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: "#f59e0b", minWidth: 32, textAlign: "right" }}>{cat.scoreB}</span>
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.7, color: "#374151" }}>{cat.summary}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── MID-PAGE CTA ── */}
      <section style={{ ...cn, marginTop: 48, marginBottom: 48 }}>
        <div style={{
          padding: mob ? "24px" : "28px 32px", borderRadius: 16,
          background: "linear-gradient(135deg,#0f172a 0%,#0f2e24 40%,#047857 100%)",
          display: "flex", flexDirection: mob ? "column" : "row", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          <div style={{ color: "#fff" }}>
            <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Ready to get started?</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.7)" }}>{midCTA}</div>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            <a href={getVisitUrl(slugA, A.url)} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
              padding: "10px 22px", borderRadius: 10, background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#0f172a",
              fontWeight: 800, fontSize: 15, textDecoration: "none", whiteSpace: "nowrap",
            }}><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{A.name} <ArrowRight size={14} /></span></a>
            <a href={getVisitUrl(slugB, B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: "10px 22px", borderRadius: 10, background: "transparent", color: "#fbbf24",
              fontWeight: 800, fontSize: 15, textDecoration: "none", border: "2px solid rgba(251,191,36,0.5)", whiteSpace: "nowrap",
            }}><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{B.name} <ArrowRight size={14} /></span></a>
          </div>
        </div>
      </section>

      {/* ── SPREAD / COST COMPARISON ── */}
      {isForex && dataA.SPREADS.length > 0 && (
        <section style={{ ...cn, marginBottom: 48 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 26, marginBottom: 6 }}>{t("comp.spreadTitle")}</h2>
          <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 20 }}>{t("comp.spreadDesc")}</p>
          <div style={{ borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", background: "#fff" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                <thead>
                  <tr style={{ background: "#0f172a" }}>
                    <th style={{ padding: "14px 20px", textAlign: "left", color: "#fff", fontFamily: "Outfit", fontWeight: 700, fontSize: 15 }}>Pair</th>
                    <th style={{ padding: "14px 20px", textAlign: "center", color: "#34d399", fontFamily: "Outfit", fontWeight: 700, fontSize: 15 }}>{A.name}</th>
                    <th style={{ padding: "14px 20px", textAlign: "center", color: "#fbbf24", fontFamily: "Outfit", fontWeight: 700, fontSize: 15 }}>{B.name}</th>
                    <th style={{ padding: "14px 20px", textAlign: "center", color: "#fff", fontFamily: "Outfit", fontWeight: 700, fontSize: 15 }}>Winner</th>
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
                        <td style={{ padding: "12px 20px", fontWeight: 700, fontSize: 15 }}>{sp.pair}</td>
                        <td style={{ padding: "12px 20px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 15, color: w === "a" ? "#059669" : "#374151", background: w === "a" ? "#f0fdf4" : "transparent" }}>{valA.toFixed(2)} pips</td>
                        <td style={{ padding: "12px 20px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 15, color: w === "b" ? "#d97706" : "#374151", background: w === "b" ? "#fef3c7" : "transparent" }}>{valB.toFixed(2)} pips</td>
                        <td style={{ padding: "12px 20px", textAlign: "center", fontSize: 14, fontWeight: 600 }}>
                          {w === "a" ? <span style={{ color: "#059669", display: "inline-flex", alignItems: "center", gap: 3 }}><Check size={14} /> {A.name}</span> : w === "b" ? <span style={{ color: "#d97706", display: "inline-flex", alignItems: "center", gap: 3 }}><Check size={14} /> {B.name}</span> : <span style={{ color: "#6b7280" }}>{t("comp.tie")}</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#f8f9fb", borderTop: "2px solid #e2e8f0" }}>
                    <td style={{ padding: "14px 20px", fontWeight: 800, fontSize: 15 }}>Commission (RT)</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 15, color: commA <= commB ? "#059669" : "#374151" }}>{commA === 0 ? "$0" : `$${commA.toFixed(0)}`}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 15, color: commB <= commA ? "#d97706" : "#374151" }}>{commB === 0 ? "$0" : `$${commB.toFixed(0)}`}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", fontSize: 14, fontWeight: 600, color: commA <= commB ? "#059669" : "#d97706" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Check size={14} /> {commA <= commB ? A.name : B.name}</span></td>
                  </tr>
                  <tr style={{ background: "#0f172a" }}>
                    <td style={{ padding: "14px 20px", fontWeight: 800, fontSize: 15, color: "#fff" }}>Total Cost/Lot</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 15, color: "#34d399" }}>${totalA.toFixed(2)}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 15, color: "#fbbf24" }}>${totalB.toFixed(2)}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", fontSize: 14, fontWeight: 700, color: totalA <= totalB ? "#34d399" : "#fbbf24" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Trophy size={14} /> {totalA <= totalB ? A.name : B.name}</span></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── STOCK/OPTIONS/FUTURES COST TABLE (non-forex) ── */}
      {!isForex && (
        <section style={{ ...cn, marginBottom: 48 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 26, marginBottom: 6 }}>
            {isStock ? "Commission Comparison" : isOptionsPair(vertical) ? "Options Cost Comparison" : isFuturesPair(vertical) ? "Futures Cost Comparison" : "Fee Comparison"}
          </h2>
          <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 20 }}>
            {isStock ? "Trading costs for stocks, ETFs, and options across both brokers." : "Key trading costs and account fees compared side-by-side."}
          </p>
          <div style={{ borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", background: "#fff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", color: "#fff", fontFamily: "Outfit", fontWeight: 700, fontSize: 15 }}>Fee</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", color: "#34d399", fontFamily: "Outfit", fontWeight: 700, fontSize: 15 }}>{A.name}</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", color: "#fbbf24", fontFamily: "Outfit", fontWeight: 700, fontSize: 15 }}>{B.name}</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const rows = [];
                  if (isStock) {
                    rows.push(["Stock/ETF Trade", A.commission_per_trade || A.commission || "$0", B.commission_per_trade || B.commission || "$0"]);
                    rows.push(["Options (per contract)", A.options_contract_fee || "N/A", B.options_contract_fee || "N/A"]);
                    rows.push(["Margin Rate", A.leverage || "N/A", B.leverage || "N/A"]);
                    rows.push(["Account Minimum", A.minDep === 0 ? "$0" : `$${A.minDep}`, B.minDep === 0 ? "$0" : `$${B.minDep}`]);
                  } else if (isOptionsPair(vertical)) {
                    rows.push(["Per Contract Fee", A.options_contract_fee || "N/A", B.options_contract_fee || "N/A"]);
                    rows.push(["Base Commission", A.commission_per_trade || A.commission, B.commission_per_trade || B.commission]);
                    rows.push(["Account Minimum", A.minDep === 0 ? "$0" : `$${A.minDep}`, B.minDep === 0 ? "$0" : `$${B.minDep}`]);
                  } else if (isFuturesPair(vertical)) {
                    rows.push(["Commission/Contract", A.futures_commission || "N/A", B.futures_commission || "N/A"]);
                    rows.push(["Account Minimum", A.minDep === 0 ? "$0" : `$${A.minDep}`, B.minDep === 0 ? "$0" : `$${B.minDep}`]);
                  } else {
                    rows.push(["Trading Commission", A.commission, B.commission]);
                    rows.push(["Min Deposit", A.minDep === 0 ? "$0" : `$${A.minDep}`, B.minDep === 0 ? "$0" : `$${B.minDep}`]);
                  }
                  return rows.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#f8f9fb" }}>
                      <td style={{ padding: "12px 20px", fontWeight: 600, fontSize: 15, color: "#111827" }}>{row[0]}</td>
                      <td style={{ padding: "12px 20px", textAlign: "center", fontSize: 15, fontWeight: 600, color: "#111827" }}>{row[1]}</td>
                      <td style={{ padding: "12px 20px", textAlign: "center", fontSize: 15, fontWeight: 600, color: "#111827" }}>{row[2]}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── ACCOUNT TYPES ── */}
      <div style={{ background: "#fff", padding: "48px 0" }}>
        <section style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 26, marginBottom: 8 }}>{t("comp.accountTitle")}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#6b7280", marginBottom: 20 }}>
            {A.name} offers {dataA.ACCOUNTS.length} account type{dataA.ACCOUNTS.length > 1 ? "s" : ""}{A.minDep === 0 ? " with no minimum deposit" : ` starting from $${A.minDep}`}. {B.name} offers {dataB.ACCOUNTS.length} account type{dataB.ACCOUNTS.length > 1 ? "s" : ""}{B.minDep === 0 ? " with no minimum deposit" : ` starting from $${B.minDep}`}.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>
            {[{ data: dataA, b: A, slug: slugA, color: "#059669", grad: "linear-gradient(135deg,#059669,#10b981)" },
              { data: dataB, b: B, slug: slugB, color: "#d97706", grad: "linear-gradient(135deg,#f59e0b,#fbbf24)" }].map((item, bi) => (
              <div key={bi} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", background: item.grad, color: bi === 0 ? "#fff" : "#0f172a", fontFamily: "Outfit", fontWeight: 700, fontSize: 17 }}>{item.b.name} Accounts</div>
                {item.data.ACCOUNTS.map((acc, ai) => (
                  <div key={ai} style={{ padding: "14px 20px", borderBottom: ai < item.data.ACCOUNTS.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{acc.name}</div>
                    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 6 }}>
                      {[
                        { l: t("review.spread"), v: acc.spread },
                        { l: t("review.commission"), v: acc.commission || "None" },
                        { l: t("review.minDeposit"), v: acc.min === 0 ? t("comp.noMin") : `$${acc.min}` },
                        { l: t("table.bestFor"), v: acc.best },
                      ].map((d, di) => (
                        <div key={di}>
                          <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>{d.l}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{d.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── FEATURE TABLE ── */}
      <section style={{ ...cn, marginTop: 48, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 26, marginBottom: 8 }}>{t("comp.featureTitle")}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#6b7280", marginBottom: 20 }}>A detailed side-by-side look at regulation, trading conditions, platforms, and fees.</p>
        <div style={{ borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", background: "#fff" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, color: "#fff", fontSize: 15, width: "30%" }}>Feature</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 700, color: "#34d399", fontSize: 15 }}>{A.name}</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 700, color: "#fbbf24", fontSize: 15 }}>{B.name}</th>
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, ri) => (
                  <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#f8f9fb" }}>
                    <td style={{ padding: "11px 20px", fontWeight: 600, fontSize: 14, color: "#111827", borderBottom: "1px solid #f1f5f9" }}>{row[0]}</td>
                    <td style={{ padding: "11px 20px", textAlign: "center", fontSize: 14, color: "#111827", borderBottom: "1px solid #f1f5f9" }}>{row[1]}</td>
                    <td style={{ padding: "11px 20px", textAlign: "center", fontSize: 14, color: "#111827", borderBottom: "1px solid #f1f5f9" }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── PROS & CONS ── */}
      <div style={{ background: "#fff", padding: "48px 0" }}>
        <section style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 26, marginBottom: 8 }}>{t("comp.prosConsTitle")}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#6b7280", marginBottom: 20 }}>Key strengths and weaknesses identified during our independent analysis.</p>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>
            {[{ b: A, data: dataA, bg: "#ecfdf5", color: "#059669" }, { b: B, data: dataB, bg: "#fef3c7", color: "#d97706" }].map((item, bi) => (
              <div key={bi} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", fontFamily: "Outfit", fontWeight: 700, fontSize: 16, background: item.bg, color: item.color, borderBottom: "1px solid #e2e8f0" }}>{item.b.name}</div>
                <div style={{ padding: "14px 20px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#059669", textTransform: "uppercase", marginBottom: 8 }}>{t("review.pros")}</div>
                  {item.data.PROS.map((p, pi) => (
                    <div key={pi} style={{ fontSize: 14, lineHeight: 1.6, color: "#111827", padding: "3px 0", paddingLeft: 16, position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "#059669" }}>+</span>{p}
                    </div>
                  ))}
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", marginTop: 14, marginBottom: 8 }}>{t("review.cons")}</div>
                  {item.data.CONS.map((c, ci) => (
                    <div key={ci} style={{ fontSize: 14, lineHeight: 1.6, color: "#111827", padding: "3px 0", paddingLeft: 16, position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "#dc2626" }}>&minus;</span>{c}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── EXPERT VERDICT ── */}
      <section style={{ ...cn, marginTop: 48, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 26, marginBottom: 20 }}>{t("comp.verdictTitle")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>
          {[{ b: A, slug: slugA, verdict: verdictA, bg: "#f0fdf4", border: "#bbf7d0", color: "#059669" },
            { b: B, slug: slugB, verdict: verdictB, bg: "#fffbeb", border: "#fde68a", color: "#d97706" }].map((item, bi) => (
            <div key={bi} style={{ padding: "24px", borderRadius: 14, background: item.bg, border: `2px solid ${item.border}` }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 18, color: item.color, marginBottom: 6 }}>
                {t("comp.chooseIf", { name: item.b.name })}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "#111827", margin: 0 }}>{item.verdict}</p>
              <a href={getVisitUrl(item.slug, item.b.url)} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                display: "inline-block", marginTop: 16, padding: "12px 24px", borderRadius: 10,
                background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#0f172a", fontWeight: 800, fontSize: 15, textDecoration: "none",
              }}><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{getCTAText(item.b.name, vertical)} <ArrowRight size={14} /></span></a>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUICK DECISION ── */}
      <div style={{ background: "#fff", padding: "48px 0" }}>
        <section style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 26, marginBottom: 8 }}>{t("comp.quickTitle")}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#6b7280", marginBottom: 20 }}>Based on our testing data, here's which broker is better for specific needs.</p>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
            {quickDecisions.map((item, i) => {
              const isA = item.pick === A.name;
              const accent = isA ? "#059669" : "#f59e0b";
              return (
                <div key={i} style={{ padding: "14px 18px", borderRadius: 12, background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 36, borderRadius: 4, background: accent, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{item.need}</div>
                    <div style={{ fontSize: 14, color: accent, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><ArrowRight size={13} /> {item.pick}</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{item.reason}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── FAQ ── */}
      <section style={{ ...cn, marginTop: 48, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 26, marginBottom: 8 }}>{t("comp.faqTitle")}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#6b7280", marginBottom: 20 }}>Common questions when choosing between {A.name} and {B.name}.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {autoFAQ.map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{item.q}</h3>
                <ChevronDown size={18} color="#6b7280" style={{ transition: "transform 0.2s", transform: expandedFAQ === i ? "rotate(180deg)" : "none", flexShrink: 0, marginLeft: 8 }} />
              </div>
              {expandedFAQ === i && (
                <div style={{ padding: "0 20px 18px", fontSize: 15, lineHeight: 1.8, color: "#374151", borderTop: "1px solid #f1f5f9" }}>
                  <p style={{ marginTop: 12 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── RELATED COMPARISONS ── */}
      {relatedPairs.length > 0 && (
        <div style={{ background: "#fff", padding: "48px 0" }}>
          <section style={cn}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 26, marginBottom: 20 }}>{t("comp.moreTitle")}</h2>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
              {relatedPairs.map((rp, i) => {
                const rA = getBrokerData(rp.slugA);
                const rB = getBrokerData(rp.slugB);
                if (!rA || !rB) return null;
                const cp = canonicalPair(rp.slugA, rp.slugB);
                return (
                  <Link key={i} to={lp(`/compare/${cp}`)} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "14px 16px", borderRadius: 12,
                    background: "#fff", border: "1px solid #e2e8f0",
                    textDecoration: "none", color: "#111827", transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "none"; }}
                  >
                    <BrokerLogo slug={rp.slugA} name={rA.B.name} fallback={rA.B.logo} size={28} shape="icon" variant="gray" />
                    <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 14, flex: 1 }}>{rA.B.name} vs {rB.B.name}</span>
                    <BrokerLogo slug={rp.slugB} name={rB.B.name} fallback={rB.B.logo} size={28} shape="icon" variant="gray" />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ── BOTTOM LINE + FINAL CTA ── */}
      <section style={{ ...cn, marginTop: 48, marginBottom: showStickyBar ? 100 : 48 }}>
        <div style={{ padding: mob ? "28px 20px" : "40px", borderRadius: 16, background: "linear-gradient(135deg,#0f172a 0%,#0f2e24 40%,#047857 100%)", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#fff", marginBottom: 8, marginTop: 0 }}>
            {A.name} vs {B.name}: The Bottom Line
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.75)", maxWidth: 750, margin: "0 auto 8px" }}>
            {A.score >= B.score ? A.name : B.name} takes the overall lead with a {Math.max(A.score, B.score)}/10 score, winning {Math.max(aWins, bWins)} out of 6 categories.
            {aStrengths.length > 0 || bStrengths.length > 0
              ? ` ${A.score >= B.score ? A.name : B.name}'s strengths lie in ${(A.score >= B.score ? aStrengths : bStrengths).join(" and ").toLowerCase() || "overall value"}.`
              : ""}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", maxWidth: 750, margin: "0 auto 24px" }}>
            We recommend {isStock ? "opening accounts with both to compare platforms and research tools" : "opening demo accounts with both to test execution and platform fit"} before committing real funds.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={getVisitUrl(slugA, A.url)} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
              padding: mob ? "12px 24px" : "14px 32px", borderRadius: 10,
              background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
              color: "#0f172a", fontWeight: 800, fontSize: mob ? 14 : 16, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
            }}><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{ctaA} <ArrowRight size={15} /></span></a>
            <a href={getVisitUrl(slugB, B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: mob ? "12px 24px" : "14px 32px", borderRadius: 10,
              background: "transparent", border: "2px solid rgba(251,191,36,0.5)",
              color: "#fbbf24", fontWeight: 800, fontSize: mob ? 14 : 16, textDecoration: "none",
            }}><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{ctaB} <ArrowRight size={15} /></span></a>
          </div>
          {(isForex || vertical === "spread-betting") && (
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 16 }}>CFDs are complex instruments. Between 62% and 82% of retail accounts lose money trading CFDs.</div>
          )}
        </div>
      </section>

      {/* ── STICKY BOTTOM BAR ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999,
        transform: showStickyBar ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "rgba(15, 23, 42, 0.97)", backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: mob ? "10px 16px" : "12px 24px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: mob ? 8 : 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: mob ? 6 : 12, flex: mob ? 1 : "0 0 auto" }}>
            {!mob && <BrokerLogo slug={slugA} name={A.name} fallback={A.logo} size={36} shape="icon" variant="gray" />}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 12 : 14, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{A.name}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: mob ? 11 : 12, color: "#34d399" }}>{A.score}/10</div>
            </div>
            <a href={getVisitUrl(slugA, A.url)} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
              padding: mob ? "7px 12px" : "8px 18px", borderRadius: 8,
              background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
              color: "#0f172a", fontWeight: 800, fontSize: mob ? 12 : 13,
              textDecoration: "none", whiteSpace: "nowrap",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              {mob ? ctaShort : ctaA} <ArrowRight size={mob ? 11 : 13} />
            </a>
          </div>

          <div style={{
            width: mob ? 26 : 32, height: mob ? 26 : 32, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 9 : 11, color: "#64748b", flexShrink: 0,
          }}>VS</div>

          <div style={{ display: "flex", alignItems: "center", gap: mob ? 6 : 12, flex: mob ? 1 : "0 0 auto", justifyContent: "flex-end" }}>
            {!mob && <BrokerLogo slug={slugB} name={B.name} fallback={B.logo} size={36} shape="icon" variant="gray" />}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 12 : 14, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: mob ? 11 : 12, color: "#fbbf24" }}>{B.score}/10</div>
            </div>
            <a href={getVisitUrl(slugB, B.url)} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
              padding: mob ? "7px 12px" : "8px 18px", borderRadius: 8,
              background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
              color: "#0f172a", fontWeight: 800, fontSize: mob ? 12 : 13,
              textDecoration: "none", whiteSpace: "nowrap",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              {mob ? ctaShort : ctaB} <ArrowRight size={mob ? 11 : 13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
