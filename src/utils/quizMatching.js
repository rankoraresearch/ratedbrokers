/**
 * Quiz Matching Engine for "Find Your Broker"
 *
 * Takes user answers and scores all brokers with weighted matching.
 * Returns sorted list with match percentages and reasons.
 */
import { getAllBrokersWithData } from "../data/brokers/index";

// ── Popular countries (shown first) ──

export const POPULAR_COUNTRIES = ["GB", "US", "AU", "DE", "SG", "AE"];

// ── Contextual tips per question ──

export const CONTEXTUAL_TIPS = {
  country: "Brokers regulated in your country offer stronger legal protections and local-language support.",
  assets: "Selecting multiple markets helps us find versatile brokers that cover all your interests.",
  experience: "Beginners benefit from educational resources; pros need raw spreads and advanced execution.",
  budget: "Higher deposits often unlock better spreads, dedicated account managers, and VIP perks.",
  priority: "This single choice has the biggest impact on your results — it reshapes our scoring weights.",
  frequency: "Day traders need tight spreads and fast execution. Long-term investors care more about fees and reliability.",
};

// ── Question definitions ──────────────────────────────────

export const QUIZ_QUESTIONS = [
  {
    id: "country",
    title: "Where are you based?",
    subtitle: "We'll show brokers available and regulated in your region.",
    type: "dropdown",
    whyMatters: "Regulation varies by country. We prioritize brokers with licenses from your local financial authority, ensuring your funds are protected under local laws.",
    options: [
      { value: "GB", label: "United Kingdom", flag: "GB" },
      { value: "US", label: "United States", flag: "US" },
      { value: "AU", label: "Australia", flag: "AU" },
      { value: "DE", label: "Germany", flag: "DE" },
      { value: "CA", label: "Canada", flag: "CA" },
      { value: "SG", label: "Singapore", flag: "SG" },
      { value: "AE", label: "UAE", flag: "AE" },
      { value: "ZA", label: "South Africa", flag: "ZA" },
      { value: "JP", label: "Japan", flag: "JP" },
      { value: "HK", label: "Hong Kong", flag: "HK" },
      { value: "CH", label: "Switzerland", flag: "CH" },
      { value: "FR", label: "France", flag: "FR" },
      { value: "ES", label: "Spain", flag: "ES" },
      { value: "IT", label: "Italy", flag: "IT" },
      { value: "NL", label: "Netherlands", flag: "NL" },
      { value: "SE", label: "Sweden", flag: "SE" },
      { value: "NZ", label: "New Zealand", flag: "NZ" },
      { value: "IN", label: "India", flag: "IN" },
      { value: "MY", label: "Malaysia", flag: "MY" },
      { value: "PH", label: "Philippines", flag: "PH" },
      { value: "NG", label: "Nigeria", flag: "NG" },
      { value: "KE", label: "Kenya", flag: "KE" },
      { value: "TR", label: "Turkey", flag: "TR" },
      { value: "BR", label: "Brazil", flag: "BR" },
      { value: "PK", label: "Pakistan", flag: "PK" },
      { value: "SA", label: "Saudi Arabia", flag: "SA" },
      { value: "KW", label: "Kuwait", flag: "KW" },
      { value: "QA", label: "Qatar", flag: "QA" },
      { value: "PL", label: "Poland", flag: "PL" },
      { value: "OTHER", label: "Other", flag: null },
    ],
  },
  {
    id: "assets",
    title: "What do you want to trade?",
    subtitle: "Select all that interest you.",
    type: "multi",
    whyMatters: "Different brokers specialize in different markets. Forex-focused brokers offer tighter spreads on currency pairs, while stock brokers provide access to exchanges worldwide.",
    options: [
      { value: "forex", label: "Forex", desc: "EUR/USD, GBP/USD and other currency pairs" },
      { value: "stocks", label: "Stocks & ETFs", desc: "Apple, Tesla, S&P 500 ETFs" },
      { value: "crypto", label: "Crypto", desc: "Bitcoin, Ethereum, altcoins" },
      { value: "cfd", label: "CFDs", desc: "Trade indices, commodities with leverage" },
      { value: "options", label: "Options", desc: "Calls, puts, multi-leg strategies" },
      { value: "futures", label: "Futures", desc: "E-mini S&P 500, crude oil futures" },
      { value: "copy-trading", label: "Copy Trading", desc: "Follow successful traders automatically" },
      { value: "spread-betting", label: "Spread Betting", desc: "Tax-free trading (UK)" },
      { value: "unknown", label: "I'm not sure yet", desc: "Show me the best all-rounders" },
    ],
  },
  {
    id: "experience",
    title: "How experienced are you?",
    subtitle: "This helps us match the right platform complexity.",
    type: "single",
    whyMatters: "Beginners need educational resources and simple platforms. Experienced traders need advanced tools, fast execution, and competitive pricing.",
    options: [
      { value: "beginner", label: "Beginner", desc: "New to trading, looking to learn" },
      { value: "intermediate", label: "Intermediate", desc: "Made some trades, understand the basics" },
      { value: "advanced", label: "Advanced", desc: "Regular trader with proven strategies" },
      { value: "professional", label: "Professional", desc: "Full-time trader or financial professional" },
    ],
  },
  {
    id: "budget",
    title: "How much do you plan to deposit?",
    subtitle: "We'll filter brokers by minimum deposit requirements.",
    type: "single",
    whyMatters: "Some premium brokers require higher deposits but offer better spreads and service. Lower-deposit brokers are accessible but may have wider spreads.",
    options: [
      { value: "under50", label: "Less than $50", desc: "Minimal commitment" },
      { value: "50-200", label: "$50 – $200", desc: "Getting started" },
      { value: "200-500", label: "$200 – $500", desc: "Testing the waters" },
      { value: "500-1k", label: "$500 – $1,000", desc: "Building a portfolio" },
      { value: "1k-5k", label: "$1,000 – $5,000", desc: "Serious about trading" },
      { value: "5k-50k", label: "$5,000 – $50,000", desc: "Experienced investor" },
      { value: "50k+", label: "$50,000+", desc: "Premium service expected" },
      { value: "unknown", label: "I don't know yet", desc: "Show me the best overall" },
    ],
  },
  {
    id: "priority",
    title: "What matters most to you?",
    subtitle: "Pick the single most important factor.",
    type: "single",
    whyMatters: "This adjusts how we weight our scoring criteria — putting your top priority front and center in the results.",
    options: [
      { value: "costs", label: "Lowest costs", desc: "Tight spreads and low commissions" },
      { value: "safety", label: "Maximum safety", desc: "Top-tier regulation and fund protection" },
      { value: "platform", label: "Best platform & tools", desc: "Advanced charting, research, mobile apps" },
      { value: "ease", label: "Ease of use", desc: "Simple interface, good for beginners" },
      { value: "speed", label: "Fast execution", desc: "ECN/STP, no requotes, low latency" },
    ],
  },
  {
    id: "frequency",
    title: "How often do you plan to trade?",
    subtitle: "This helps us match the right cost structure.",
    type: "single",
    whyMatters: "Day traders need ultra-tight spreads and fast execution. Long-term investors benefit from low commissions and reliable platforms.",
    options: [
      { value: "daily", label: "Daily", desc: "Active day trader" },
      { value: "weekly", label: "Weekly", desc: "Swing trader, a few trades per week" },
      { value: "monthly", label: "Monthly", desc: "Position trader, buy and hold weeks" },
      { value: "yearly", label: "A few times a year", desc: "Long-term investor" },
      { value: "unknown", label: "I'm not sure yet", desc: "Show me the best overall" },
    ],
  },
];

// ── Country → Regulator mapping ──

const COUNTRY_REGS = {
  GB: ["FCA"],
  US: ["NFA", "CFTC", "SEC", "FINRA"],
  AU: ["ASIC"],
  DE: ["BaFin", "CySEC", "FCA"],
  CA: ["FCA", "ASIC", "CySEC"],
  SG: ["MAS"],
  AE: ["DFSA"],
  ZA: ["FSCA"],
  JP: ["FSA"],
  HK: ["SFC"],
  CH: ["FINMA", "FCA"],
  FR: ["CySEC", "FCA"],
  ES: ["CySEC", "FCA"],
  IT: ["CySEC", "FCA"],
  NL: ["AFM", "CySEC", "FCA"],
  SE: ["CySEC", "FCA"],
  NZ: ["ASIC", "FCA"],
  IN: ["SEBI"], MY: ["SC"], PH: ["SEC"], NG: ["SEC"], KE: ["CMA"], TR: ["CMB"],
  BR: ["CVM"], PK: ["SECP"], SA: ["CMA"], KW: ["CMA"], QA: ["QFMA"], PL: ["KNF"],
};

// ── Matching algorithm ──────────────────────────────────

function parseLeverage(lev) {
  const m = lev?.match(/1:(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function brokerHasReg(broker, regName) {
  return broker.B.regs.some((r) => r.name === regName);
}

function brokerHasTier1(broker) {
  return broker.B.regs.some((r) => r.tier === 1);
}

function brokerHasPlatform(broker, name) {
  return broker.B.platforms.some((p) => p.toLowerCase().includes(name.toLowerCase()));
}

function brokerHasVertical(broker, v) {
  return (broker.B.verticals || []).includes(v);
}

export function matchBrokers(answers) {
  const allBrokers = getAllBrokersWithData();

  const scored = allBrokers.map((broker) => {
    let score = 0;
    let maxScore = 0;
    const reasons = [];

    // ── 1. Country match (25 points) ──
    maxScore += 25;
    const country = answers.country;
    if (country && country !== "OTHER") {
      const preferredRegs = COUNTRY_REGS[country] || [];
      const hasLocalReg = preferredRegs.some((reg) => brokerHasReg(broker, reg));
      const hasTier1 = brokerHasTier1(broker);

      if (hasLocalReg) {
        score += 25;
        const matchedReg = preferredRegs.find((reg) => brokerHasReg(broker, reg));
        reasons.push(`Regulated by ${matchedReg} in your region`);
      } else if (hasTier1) {
        score += 15;
        reasons.push("Holds Tier-1 international license");
      } else {
        score += 5;
      }
    } else {
      // No country = give base score for any regulated broker
      score += brokerHasTier1(broker) ? 20 : 10;
    }

    // ── 2. Asset/vertical match (25 points) ──
    maxScore += 25;
    const assets = answers.assets || [];
    if (assets.length === 0 || assets.includes("unknown")) {
      // No preference — base on overall score
      score += Math.round(broker.B.score * 2.5);
      if (broker.B.score >= 9.0) reasons.push("Top-rated all-rounder");
    } else {
      let verticalMatches = 0;
      const verticalMap = {
        forex: "forex",
        stocks: "stocks",
        crypto: "crypto",
        cfd: "cfd",
        options: "options",
        futures: "futures",
        "copy-trading": "copy-trading",
        "spread-betting": "spread-betting",
      };

      for (const asset of assets) {
        const v = verticalMap[asset];
        if (v && brokerHasVertical(broker, v)) {
          verticalMatches++;
        }
      }

      const matchRatio = assets.length > 0 ? verticalMatches / assets.length : 0;
      score += Math.round(matchRatio * 25);

      if (verticalMatches === assets.length && assets.length > 0) {
        reasons.push(`Supports all ${assets.length} markets you selected`);
      } else if (verticalMatches > 0) {
        reasons.push(`Covers ${verticalMatches} of ${assets.length} selected markets`);
      }
    }

    // ── 3. Experience match (12 points) ──
    maxScore += 12;
    const exp = answers.experience;
    if (exp === "beginner") {
      const begScore = broker.B.score >= 8.0 ? 8 : 4;
      const lowDep = broker.B.minDep <= 100 ? 4 : 0;
      score += begScore + lowDep;
      if (broker.B.score >= 8.5 && broker.B.minDep <= 100) {
        reasons.push("Great for beginners with low deposit");
      }
    } else if (exp === "intermediate") {
      score += broker.B.score >= 8.0 ? 10 : 7;
    } else if (exp === "advanced" || exp === "professional") {
      const isECN = /ecn|stp|dma/i.test(broker.B.type);
      const tightSpreads = parseFloat(broker.B.spread) <= 0.2;
      score += (isECN ? 6 : 3) + (tightSpreads ? 6 : 3);
      if (isECN && tightSpreads) {
        reasons.push("ECN execution with raw spreads");
      }
    } else {
      score += Math.min(12, Math.round(broker.B.score * 1.2));
    }

    // ── 4. Budget match (10 points) ──
    maxScore += 10;
    const budget = answers.budget;
    const minDep = broker.B.minDep;
    if (budget === "under50") {
      score += minDep <= 5 ? 10 : minDep <= 50 ? 7 : minDep <= 100 ? 3 : 1;
      if (minDep <= 5) reasons.push(`Ultra-low minimum deposit ($${minDep})`);
    } else if (budget === "50-200") {
      score += minDep <= 50 ? 10 : minDep <= 200 ? 7 : 3;
    } else if (budget === "200-500") {
      score += minDep <= 200 ? 10 : minDep <= 500 ? 7 : 3;
    } else if (budget === "500-1k") {
      score += minDep <= 500 ? 10 : minDep <= 1000 ? 7 : 3;
    } else if (budget === "1k-5k") {
      score += minDep <= 1000 ? 10 : minDep <= 5000 ? 7 : 3;
    } else if (budget === "5k-50k") {
      score += minDep <= 5000 ? 10 : minDep <= 10000 ? 7 : 4;
      if (broker.B.score >= 9.0) reasons.push("Premium broker for serious traders");
    } else if (budget === "50k+") {
      score += broker.B.score >= 9.0 ? 10 : 6;
      if (broker.B.score >= 9.0) reasons.push("Premium broker for high-value accounts");
    } else {
      score += 5; // unknown or no answer
    }

    // ── 5. Priority weight adjustment (13 points) ──
    maxScore += 13;
    const priority = answers.priority;
    if (priority === "costs") {
      const spread = parseFloat(broker.B.spread);
      const isECN = /ecn|stp/i.test(broker.B.type);
      score += spread <= 0.1 ? 13 : spread <= 0.5 ? 9 : isECN ? 7 : 3;
      if (spread <= 0.1) reasons.push(`Ultra-tight spreads from ${broker.B.spread} pips`);
    } else if (priority === "safety") {
      const tier1Count = broker.B.regs.filter((r) => r.tier === 1).length;
      score += tier1Count >= 2 ? 13 : tier1Count === 1 ? 9 : 3;
      if (tier1Count >= 2) reasons.push(`${tier1Count} Tier-1 licenses for maximum safety`);
    } else if (priority === "platform") {
      const platCount = broker.B.platforms.length;
      score += platCount >= 4 ? 13 : platCount >= 3 ? 9 : platCount >= 2 ? 6 : 3;
      if (platCount >= 4) reasons.push(`${platCount} trading platforms available`);
    } else if (priority === "ease") {
      score += broker.B.score >= 8.5 ? 10 : 7;
      const hasTp = broker.B.tp >= 4.0;
      score += hasTp ? 3 : 0;
      if (broker.B.tp >= 4.5) reasons.push(`${broker.B.tp}/5 Trustpilot rating — users love it`);
    } else if (priority === "speed") {
      const isECN = /ecn|stp|dma|ndd/i.test(broker.B.type);
      score += isECN ? 13 : 4;
      if (isECN) reasons.push("ECN/STP execution — direct market access");
    } else {
      score += Math.round(broker.B.score * 1.3);
    }

    // ── 6. Trading frequency (10 points) ──
    maxScore += 10;
    const freq = answers.frequency;
    if (freq === "daily") {
      const isECN = /ecn|stp|dma/i.test(broker.B.type);
      const tightSpread = parseFloat(broker.B.spread) <= 0.2;
      score += (isECN ? 5 : 2) + (tightSpread ? 5 : 2);
      if (isECN && tightSpread) reasons.push("Ideal for active day trading");
    } else if (freq === "weekly") {
      score += broker.B.score >= 8.0 ? 8 : 5;
      score += broker.B.platforms.length >= 3 ? 2 : 0;
    } else if (freq === "monthly") {
      const tier1Count = broker.B.regs.filter((r) => r.tier === 1).length;
      score += broker.B.score >= 8.5 ? 6 : 3;
      score += tier1Count >= 2 ? 4 : tier1Count === 1 ? 2 : 0;
    } else if (freq === "yearly") {
      const spread = parseFloat(broker.B.spread);
      score += broker.B.score >= 9.0 ? 6 : 3;
      score += spread <= 0.5 ? 4 : spread <= 1.0 ? 2 : 0;
    } else {
      score += 5; // unknown or no answer
    }

    // ── Base quality bonus (up to 5 points) ──
    const qualityBonus = Math.round((broker.B.score / 10) * 5);
    score += qualityBonus;
    maxScore += 5;

    // ── Calculate match percentage ──
    const matchPct = Math.min(99, Math.max(5, Math.round((score / maxScore) * 100)));

    // ── Ensure at least 1 reason ──
    if (reasons.length === 0) {
      if (broker.B.score >= 9.0) reasons.push("One of our highest-rated brokers");
      else if (broker.B.tp >= 4.0) reasons.push(`${broker.B.tp}/5 Trustpilot rating`);
      else reasons.push("Regulated and established broker");
    }

    return {
      slug: broker.slug,
      broker,
      score,
      maxScore,
      matchPct,
      reasons: reasons.slice(0, 3),
    };
  });

  // Sort by score descending, then by broker.B.score as tiebreaker
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.broker.B.score - a.broker.B.score;
  });

  return scored;
}

// ── Weak Point generator (contextual, for Top 3) ──

export function getWeakPoint(broker, answers) {
  const B = broker.B;
  const minDep = B.minDep;
  const spread = parseFloat(B.spread);
  const country = answers.country;

  if (answers.budget) {
    const budgetMax = { "under50": 50, "50-200": 200, "200-500": 500, "500-1k": 1000, "1k-5k": 5000 };
    const max = budgetMax[answers.budget];
    if (max && minDep > max) return `Consider: Minimum deposit is $${minDep} — higher than your stated budget.`;
  }
  if (answers.priority === "costs" && spread > 1.0) return `Consider: Spreads from ${B.spread} pips — competitive, but not the tightest available.`;
  if (country && country !== "OTHER") {
    const preferredRegs = COUNTRY_REGS[country] || [];
    if (preferredRegs.length > 0 && !preferredRegs.some((reg) => B.regs.some((r) => r.name === reg))) {
      return `Consider: Not locally regulated in your country — operates under international license.`;
    }
  }
  if (B.tp && B.tp < 3.5) return `Consider: Trustpilot rating ${B.tp}/5 — though our expert score rates it ${B.score}/10.`;
  if (answers.experience === "professional" && B.score < 8.5) return `Consider: Primarily designed for beginners to intermediate traders.`;
  return null;
}

// ── User Profile Label generator ──

export function getUserProfile(answers) {
  const expMap = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", professional: "Professional" };
  const prioMap = { costs: "Cost-Conscious", safety: "Safety-Focused", platform: "Tech-Savvy", ease: "Simplicity-First", speed: "Speed-Oriented" };
  const assetMap = { forex: "Forex", stocks: "Stock", crypto: "Crypto", cfd: "CFD", options: "Options", futures: "Futures", "copy-trading": "Copy", "spread-betting": "Spread Betting" };
  const exp = expMap[answers.experience] || "";
  const prio = prioMap[answers.priority] || "";
  const assets = answers.assets || [];
  const mainAsset = assets.length === 1 && assets[0] !== "unknown" ? assetMap[assets[0]] || "" : assets.length > 2 ? "Multi-Asset" : "";
  const suffix = answers.frequency === "yearly" ? "Investor" : "Trader";
  return [exp, prio, mainAsset, suffix].filter(Boolean).join(" ");
}

// ── GeoIP detection ──

const CF_COUNTRY_MAP = {
  GB: "GB", US: "US", AU: "AU", DE: "DE", CA: "CA", SG: "SG",
  AE: "AE", ZA: "ZA", JP: "JP", HK: "HK", CH: "CH", FR: "FR",
  ES: "ES", IT: "IT", NL: "NL", SE: "SE", NZ: "NZ", IN: "IN",
  MY: "MY", PH: "PH", NG: "NG", KE: "KE", TR: "TR", BR: "BR",
  PK: "PK", SA: "SA", KW: "KW", QA: "QA", PL: "PL",
};

export async function detectCountry() {
  try {
    // Try Cloudflare trace endpoint (works on CF Pages)
    const res = await fetch("/cdn-cgi/trace");
    if (res.ok) {
      const text = await res.text();
      const match = text.match(/loc=(\w{2})/);
      if (match) {
        const code = match[1];
        return CF_COUNTRY_MAP[code] || "OTHER";
      }
    }
  } catch {
    // ignore
  }
  return null;
}
