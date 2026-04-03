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
  platform: "Traders who know their platform save weeks of learning curve. We'll match you perfectly.",
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
      { value: "micro", label: "Under $100", desc: "Just getting started" },
      { value: "small", label: "$100 – $1,000", desc: "Testing the waters" },
      { value: "medium", label: "$1,000 – $10,000", desc: "Serious about trading" },
      { value: "large", label: "$10,000+", desc: "Looking for premium service" },
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
    id: "platform",
    title: "Any platform preference?",
    subtitle: "Skip if you don't have a preference.",
    type: "single",
    whyMatters: "If you already know a platform, we'll prioritize brokers that support it. Each platform has unique strengths for different trading styles.",
    options: [
      { value: "mt4", label: "MetaTrader 4", desc: "Industry standard, huge EA library" },
      { value: "mt5", label: "MetaTrader 5", desc: "Multi-asset, depth of market" },
      { value: "ctrader", label: "cTrader", desc: "Modern UI, level II pricing" },
      { value: "tradingview", label: "TradingView", desc: "Best charting, social features" },
      { value: "proprietary", label: "Broker's own platform", desc: "Custom-built, often most user-friendly" },
      { value: "any", label: "No preference", desc: "Show me the best overall" },
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

    // ── 3. Experience match (15 points) ──
    maxScore += 15;
    const exp = answers.experience;
    if (exp === "beginner") {
      // Beginners need high score (good for beginners = high trust), low min deposit
      const begScore = broker.B.score >= 8.0 ? 10 : 5;
      const lowDep = broker.B.minDep <= 100 ? 5 : 0;
      score += begScore + lowDep;
      if (broker.B.score >= 8.5 && broker.B.minDep <= 100) {
        reasons.push("Great for beginners with low deposit");
      }
    } else if (exp === "intermediate") {
      score += broker.B.score >= 8.0 ? 12 : 8;
    } else if (exp === "advanced" || exp === "professional") {
      // Advanced: ECN/STP, tight spreads
      const isECN = /ecn|stp|dma/i.test(broker.B.type);
      const tightSpreads = parseFloat(broker.B.spread) <= 0.2;
      score += (isECN ? 8 : 4) + (tightSpreads ? 7 : 3);
      if (isECN && tightSpreads) {
        reasons.push("ECN execution with raw spreads");
      }
    } else {
      score += Math.round(broker.B.score * 1.5);
    }

    // ── 4. Budget match (10 points) ──
    maxScore += 10;
    const budget = answers.budget;
    const minDep = broker.B.minDep;
    if (budget === "micro") {
      score += minDep <= 10 ? 10 : minDep <= 100 ? 6 : 2;
      if (minDep <= 10) reasons.push(`Low minimum deposit ($${minDep})`);
    } else if (budget === "small") {
      score += minDep <= 200 ? 10 : minDep <= 500 ? 6 : 2;
    } else if (budget === "medium") {
      score += minDep <= 1000 ? 10 : minDep <= 5000 ? 6 : 2;
    } else if (budget === "large") {
      // Large budget: prefer premium brokers
      score += broker.B.score >= 9.0 ? 10 : 6;
      if (broker.B.score >= 9.0) reasons.push("Premium broker for serious traders");
    } else {
      score += 5; // no answer
    }

    // ── 5. Priority weight adjustment (15 points) ──
    maxScore += 15;
    const priority = answers.priority;
    if (priority === "costs") {
      const spread = parseFloat(broker.B.spread);
      const isECN = /ecn|stp/i.test(broker.B.type);
      score += spread <= 0.1 ? 15 : spread <= 0.5 ? 10 : isECN ? 8 : 4;
      if (spread <= 0.1) reasons.push(`Ultra-tight spreads from ${broker.B.spread} pips`);
    } else if (priority === "safety") {
      const tier1Count = broker.B.regs.filter((r) => r.tier === 1).length;
      score += tier1Count >= 2 ? 15 : tier1Count === 1 ? 10 : 3;
      if (tier1Count >= 2) reasons.push(`${tier1Count} Tier-1 licenses for maximum safety`);
    } else if (priority === "platform") {
      const platCount = broker.B.platforms.length;
      score += platCount >= 4 ? 15 : platCount >= 3 ? 10 : platCount >= 2 ? 7 : 4;
      if (platCount >= 4) reasons.push(`${platCount} trading platforms available`);
    } else if (priority === "ease") {
      score += broker.B.score >= 8.5 ? 12 : 8;
      const hasTp = broker.B.tp >= 4.0;
      score += hasTp ? 3 : 0;
      if (broker.B.tp >= 4.5) reasons.push(`${broker.B.tp}/5 Trustpilot rating — users love it`);
    } else if (priority === "speed") {
      const isECN = /ecn|stp|dma|ndd/i.test(broker.B.type);
      score += isECN ? 15 : 5;
      if (isECN) reasons.push("ECN/STP execution — direct market access");
    } else {
      score += Math.round(broker.B.score * 1.5);
    }

    // ── 6. Platform preference (10 points) ──
    maxScore += 10;
    const plat = answers.platform;
    const platMap = {
      mt4: "MetaTrader 4",
      mt5: "MetaTrader 5",
      ctrader: "cTrader",
      tradingview: "TradingView",
    };
    if (plat && plat !== "any" && plat !== "proprietary") {
      const platName = platMap[plat];
      if (platName && brokerHasPlatform(broker, platName)) {
        score += 10;
        reasons.push(`Supports ${platName}`);
      } else {
        score += 0;
      }
    } else if (plat === "proprietary") {
      // Check if has proprietary platform (not just MT4/MT5)
      const hasProprietary = broker.B.platforms.some(
        (p) => !/metatrader|ctrader|tradingview|ninjatrader|zulutrade/i.test(p)
      );
      score += hasProprietary ? 10 : 3;
      if (hasProprietary) reasons.push("Has its own proprietary platform");
    } else {
      score += 5; // no preference
    }

    // ── Base quality bonus (up to 5 points) ──
    const qualityBonus = Math.round((broker.B.score / 10) * 5);
    score += qualityBonus;
    maxScore += 5;

    // ── Calculate match percentage ──
    const matchPct = Math.min(99, Math.max(15, Math.round((score / maxScore) * 100)));

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
