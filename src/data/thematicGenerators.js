/**
 * Auto-generation system for thematic ranking content.
 * Provides blurb generators, education templates, Quick Verdict logic,
 * and comparison column configs for all 207 ranking pages.
 *
 * Architecture:
 *   - Text Fragment Builders: generate text snippets from broker B data
 *   - Universal Blurb Generator: assembles fragments into themed blurbs
 *   - Ranking Configs: maps each ranking ID to generator params
 *   - Education Templates: category-level education content
 *   - Quick Verdict: auto-selects 3 winners per ranking
 *   - Comparison Columns: theme-relevant table columns
 */

// ═══════════════════════════════════════════════════════════════
// TEXT FRAGMENT BUILDERS
// ═══════════════════════════════════════════════════════════════

const TIER1 = ["FCA", "ASIC", "CySEC", "BaFin", "FINMA", "MAS", "IIROC", "NFA", "CFTC"];

function t1Regs(B) {
  return (B.regs || []).filter(r => TIER1.includes(r.name)).map(r => r.name);
}
function allRegs(B) {
  return (B.regs || []).map(r => r.name);
}
function isType(B, keyword) {
  return (B.type || "").toLowerCase().includes(keyword.toLowerCase());
}
function hasPlat(B, name) {
  return (B.platforms || []).some(p => p.toLowerCase().includes(name.toLowerCase()));
}
function spreadVal(B) {
  return parseFloat(B.avgSpread) || parseFloat(B.spread) || 0;
}
function levNum(B) {
  const m = (B.leverage || "").match(/1:(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

// Fragment generators — each returns a text sentence
const F = {
  spread(B) {
    const s = spreadVal(B);
    return `${s} pip${s !== 1 ? "s" : ""} EUR/USD average spread${isType(B, "ecn") ? " on raw ECN account" : ""}`;
  },
  execution(B) {
    const model = isType(B, "ecn") ? "ECN" : isType(B, "stp") ? "STP" : isType(B, "dma") ? "DMA" : isType(B, "market maker") ? "Market Maker" : "hybrid";
    return `${model} execution model${isType(B, "ecn") ? " with direct liquidity provider access" : ""}`;
  },
  platforms(B) {
    const ps = (B.platforms || []).slice(0, 3);
    return ps.length ? `${ps.join(", ")} available` : "multiple platforms supported";
  },
  platformFocus(B, plat) {
    if (hasPlat(B, plat)) {
      return `Supports ${plat} with full feature set`;
    }
    return `${(B.platforms || []).slice(0, 2).join(" and ")} available`;
  },
  regulation(B) {
    const t1 = t1Regs(B);
    if (t1.length >= 2) return `${t1.slice(0, 3).join(" + ")} regulation`;
    if (t1.length === 1) return `${t1[0]} regulated`;
    const all = allRegs(B);
    return all.length ? `${all[0]} regulated` : "multi-jurisdiction regulated";
  },
  deposit(B) {
    if (B.minDep === 0) return "no minimum deposit required";
    return `$${B.minDep} minimum deposit`;
  },
  leverage(B) {
    return `up to ${B.leverage || "1:500"} leverage`;
  },
  instruments(B) {
    return B.instruments ? `${B.instruments} tradable instruments` : "wide instrument range";
  },
  commission(B) {
    if (B.commission) return `${B.commission} commission`;
    return "commission included in spread";
  },
  score(B) {
    return `rated ${B.score}/10 in our expert evaluation`;
  },
  year(B) {
    if (B.year) return `established in ${B.year} (${2026 - B.year} years in operation)`;
    return "established broker";
  },
  trustpilot(B) {
    if (B.tp) return `${B.tp}/5 Trustpilot rating from ${B.tpCount?.toLocaleString() || "thousands of"} reviews`;
    return "";
  },
  type(B) {
    return B.type || "forex broker";
  },
  copyTrading(B) {
    return `${B.name} ${isType(B, "social") ? "offers built-in social and copy trading features" : "supports copy trading integration"}`;
  },
  islamic(B) {
    return `swap-free Islamic account available${B.minDep === 0 ? " with no minimum deposit" : ""}`;
  },
};


// ═══════════════════════════════════════════════════════════════
// PROS / CONS BUILDERS
// ═══════════════════════════════════════════════════════════════

function buildPros(B, cfg) {
  const pros = [];
  const s = spreadVal(B);
  const t1 = t1Regs(B);

  // Always start with the most relevant metric for this ranking
  for (const emphasis of (cfg.prosOrder || ["spread", "regulation", "deposit", "platforms"])) {
    if (pros.length >= 4) break;
    switch (emphasis) {
      case "spread":
        if (s <= (cfg.goodSpread || 0.3)) pros.push(`${s} pip raw spread`);
        else pros.push(`${s} pip spread`);
        break;
      case "regulation":
        if (t1.length >= 2) pros.push(t1.slice(0, 3).join(" + "));
        else if (t1.length === 1) pros.push(`${t1[0]} regulated`);
        break;
      case "deposit":
        if (B.minDep === 0) pros.push("$0 min deposit");
        else if (B.minDep <= 50) pros.push(`$${B.minDep} min deposit`);
        break;
      case "platforms":
        if (hasPlat(B, "cTrader")) pros.push("cTrader Level II");
        else if (hasPlat(B, "TradingView")) pros.push("TradingView charts");
        else if ((B.platforms || []).length >= 3) pros.push(`${B.platforms.length} platforms`);
        break;
      case "execution":
        if (isType(B, "ecn")) pros.push("True ECN execution");
        else if (isType(B, "stp")) pros.push("STP execution");
        else if (isType(B, "dma")) pros.push("DMA access");
        break;
      case "leverage":
        if (levNum(B) >= 500) pros.push(`${B.leverage} leverage`);
        else if (levNum(B) >= 100) pros.push(`${B.leverage} leverage`);
        break;
      case "instruments":
        if (B.instruments) pros.push(`${B.instruments} instruments`);
        break;
      case "commission":
        if (B.commission && B.commission.includes("$0")) pros.push("Zero commission");
        else if (B.commission) pros.push(B.commission);
        break;
      case "copy":
        if (isType(B, "social") || isType(B, "copy")) pros.push("Copy trading built-in");
        break;
      case "score":
        if (B.score >= 9.0) pros.push(`${B.score}/10 expert score`);
        break;
      case "year":
        if (B.year && 2026 - B.year >= 15) pros.push(`${2026 - B.year} years operating`);
        break;
    }
  }
  // Fill remaining slots
  if (pros.length < 2) {
    if (!pros.some(p => /pip/.test(p))) pros.push(`${s} pip spread`);
    if (!pros.some(p => TIER1.some(r => p.includes(r)))) {
      if (t1.length) pros.push(t1[0] + " regulated");
    }
  }
  return pros.slice(0, 4);
}

function buildCons(B, cfg) {
  const cons = [];
  const s = spreadVal(B);
  const t1 = t1Regs(B);

  if (cfg.badSpread && s >= cfg.badSpread) cons.push("Wider spreads vs top ECN brokers");
  if (t1.length === 0) cons.push("No Tier-1 regulation");
  if (cfg.expectECN && !isType(B, "ecn") && !isType(B, "dma")) cons.push("Non-ECN execution model");
  if (cfg.expectPlatform && !hasPlat(B, cfg.expectPlatform)) cons.push(`No ${cfg.expectPlatform}`);
  if (B.minDep >= 200 && cfg.checkDeposit) cons.push(`$${B.minDep} minimum deposit`);
  if (!hasPlat(B, "cTrader") && cfg.wantCTrader) cons.push("No cTrader Level II");
  if (isType(B, "market maker") && cfg.preferNDD) cons.push("Market Maker model");

  if (cons.length === 0) {
    // Generate sensible default cons
    if (s >= 0.5) cons.push("Higher spreads than ECN leaders");
    else if (!hasPlat(B, "cTrader")) cons.push("No cTrader Level II");
    else cons.push("Limited educational resources");
  }
  return cons.slice(0, 2);
}


// ═══════════════════════════════════════════════════════════════
// UNIVERSAL BLURB GENERATOR
// ═══════════════════════════════════════════════════════════════

function makeBlurb(broker, cfg) {
  const B = broker.B;

  // Build "why" heading
  const why = typeof cfg.why === "function"
    ? cfg.why(B)
    : `Why ${B.name} works for ${cfg.whyTemplate || "traders"}:`;

  // Build text from focus fragments
  const textParts = [];
  for (const focus of (cfg.focus || ["spread", "execution", "regulation", "deposit"])) {
    if (typeof focus === "function") {
      const r = focus(B);
      if (r) textParts.push(r);
    } else if (focus.includes(":")) {
      const [fn, arg] = focus.split(":");
      if (F[fn]) {
        const r = F[fn](B, arg);
        if (r) textParts.push(r);
      }
    } else if (F[focus]) {
      const r = F[focus](B);
      if (r) textParts.push(r);
    }
  }

  const text = textParts.filter(Boolean).join(". ") + ".";
  const pros = buildPros(B, cfg);
  const cons = buildCons(B, cfg);

  // Build analysis, prosDetail, consDetail
  const analysis = buildAnalysis(B, cfg);
  const prosDetail = buildProsDetail(B, cfg, pros);
  const consDetail = buildConsDetail(B, cfg, cons);

  return { why, text, pros, cons, analysis, prosDetail, consDetail };
}


// ── Auto-generated analysis, prosDetail, consDetail ──

function buildAnalysis(B, cfg) {
  const s = spreadVal(B);
  const t1 = t1Regs(B);
  const allR = allRegs(B);
  const isECN = isType(B, "ecn");
  const isSTP = isType(B, "stp");
  const isDMA = isType(B, "dma");
  const isMM = isType(B, "market maker");
  const plats = B.platforms || [];
  const lev = levNum(B);
  const theme = cfg.whyTemplate || "traders";
  const yearsOp = B.year ? (2026 - B.year) : null;

  const paragraphs = [];

  // P1: Core value proposition for this theme
  if (isECN || isDMA) {
    paragraphs.push(
      `${B.name} operates a ${isECN ? "true ECN" : "DMA"} execution model, routing orders directly to liquidity providers without dealing desk intervention. For ${theme}, this means transparent pricing with raw spreads from ${B.spread || "0.0"} pips on the tightest account tier. The average EUR/USD spread of ${s} pips in our analysis places ${B.name} ${s <= 0.1 ? "among the tightest-spread brokers available" : s <= 0.3 ? "in the competitive mid-range for ECN brokers" : "at a reasonable level for its execution model"}.`
    );
  } else if (isMM) {
    paragraphs.push(
      `${B.name} uses a market maker model, which means spreads are set by the broker rather than aggregated from external liquidity. The ${s} pip average EUR/USD spread includes all costs — no separate commission. For ${theme} who prefer simple, predictable pricing without calculating spread-plus-commission, this straightforward cost structure has clear advantages. ${B.commission && B.commission.includes("$0") ? "Zero commission on all trades keeps cost calculations simple." : ""}`
    );
  } else if (isSTP) {
    paragraphs.push(
      `${B.name} uses STP (Straight Through Processing) execution, forwarding orders to liquidity providers without manual intervention. The ${s} pip average EUR/USD spread reflects genuine market pricing. For ${theme}, this no-dealing-desk approach provides execution transparency while maintaining competitive costs.`
    );
  } else {
    paragraphs.push(
      `${B.name}'s hybrid execution model combines elements of both direct market access and internal processing. The ${s} pip average EUR/USD spread is ${s <= 0.3 ? "competitive" : s <= 0.8 ? "reasonable" : "wider than ECN alternatives but includes all costs in the spread"}. For ${theme}, ${B.name} provides a balanced approach between cost efficiency and execution reliability.`
    );
  }

  // P2: Regulation and safety
  if (t1.length >= 3) {
    paragraphs.push(
      `Regulatory coverage is a standout strength: ${t1.join(", ")} provide ${t1.length} Tier-1 licenses — among the broadest top-tier regulatory profiles available. Client funds are segregated under multiple jurisdictions, and compensation schemes (such as FSCS up to £85,000 for FCA clients) add a financial safety net. ${yearsOp && yearsOp >= 10 ? `With ${yearsOp} years of operation since ${B.year}, ${B.name} has demonstrated long-term stability through multiple market cycles.` : ""}`
    );
  } else if (t1.length >= 1) {
    paragraphs.push(
      `${t1.join(" and ")} regulation provides Tier-1 oversight with mandated fund segregation and negative balance protection. ${allR.length > t1.length ? `Additional licenses (${allR.filter(r => !t1.includes(r)).join(", ")}) extend coverage to more jurisdictions.` : ""} ${yearsOp && yearsOp >= 10 ? `${B.name} has been operating since ${B.year} (${yearsOp} years), demonstrating consistent regulatory compliance through multiple market cycles.` : ""}`
    );
  } else {
    paragraphs.push(
      `${B.name} is regulated by ${allR.join(", ") || "its home jurisdiction"}. ${yearsOp && yearsOp >= 5 ? `With ${yearsOp} years of operation since ${B.year}, the broker has an established track record, though traders prioritizing maximum regulatory protection may prefer brokers with Tier-1 licenses (FCA, ASIC, CySEC).` : "Traders prioritizing maximum regulatory protection may prefer brokers with Tier-1 licenses."}`
    );
  }

  // P3: Platform and tools
  if (plats.length >= 3) {
    paragraphs.push(
      `The platform lineup — ${plats.slice(0, 4).join(", ")} — provides ${plats.length} distinct trading environments. ${hasPlat(B, "cTrader") ? "cTrader offers Level II order book depth for order-flow analysis and C# algo development via cAlgo." : ""} ${hasPlat(B, "TradingView") ? "TradingView integration provides access to 100,000+ community indicators and advanced charting capabilities." : ""} ${hasPlat(B, "MetaTrader 4") && hasPlat(B, "MetaTrader 5") ? "Both MetaTrader 4 and MT5 are available, covering the largest EA and indicator ecosystem in forex." : hasPlat(B, "MetaTrader 4") ? "MetaTrader 4 provides access to the largest ecosystem of Expert Advisors and custom indicators." : ""} For ${theme}, this platform diversity means you can choose the workflow that matches your strategy.`
    );
  } else if (plats.length >= 1) {
    paragraphs.push(
      `${B.name} offers ${plats.join(" and ")}. ${hasPlat(B, "MetaTrader 4") || hasPlat(B, "MetaTrader 5") ? "MetaTrader provides access to the largest ecosystem of Expert Advisors and custom indicators, plus comprehensive charting with 30+ built-in indicators." : "The platform provides essential charting and order management tools for active trading."} While the platform selection is narrower than some competitors who offer 4+ options, ${plats[0]} covers the core trading needs for most ${theme}.`
    );
  }

  // P4: Cost and value context
  if (B.commission && !B.commission.includes("$0")) {
    const commMatch = B.commission.match(/\$([0-9.]+)/);
    const commVal = commMatch ? parseFloat(commMatch[1]) : 0;
    const totalCost = (s * 10) + (commVal * 2); // rough RT cost
    paragraphs.push(
      `Total trading cost per standard lot is approximately $${totalCost.toFixed(1)} (${s} pip spread + ${B.commission} round-turn). ${totalCost <= 5 ? "This places " + B.name + " among the cheapest brokers available — ideal for active traders where cost compounds significantly." : totalCost <= 8 ? "This is competitive within the ECN/STP broker category and reasonable for the execution quality provided." : "While not the cheapest, the cost includes premium execution infrastructure and regulatory coverage."} ${B.minDep === 0 ? "The $0 minimum deposit removes any barrier to testing the account with a small amount before committing larger capital." : B.minDep <= 100 ? `The $${B.minDep} minimum deposit is accessible for most traders.` : `The $${B.minDep} minimum deposit may be a consideration for traders starting with smaller capital.`}`
    );
  }

  // P5: Trustpilot if available
  if (B.tp && B.tpCount) {
    paragraphs.push(
      `${B.name} holds a ${B.tp}/5 rating on Trustpilot from ${B.tpCount.toLocaleString()}+ verified reviews. ${B.tp >= 4.5 ? "This places it among the highest-rated brokers in the industry, with consistent praise for" : B.tp >= 4.0 ? "Client feedback is generally positive, with common themes around" : B.tp >= 3.5 ? "Reviews are mixed, with positive comments about" : "Client ratings suggest room for improvement, though many reviews mention"} ${s <= 0.3 ? "tight spreads and reliable execution" : "platform quality and customer support"}.`
    );
  }

  return paragraphs.slice(0, 3).join("\n\n");
}

function buildProsDetail(B, cfg, shortPros) {
  const s = spreadVal(B);
  const t1 = t1Regs(B);
  const plats = B.platforms || [];
  const yearsOp = B.year ? (2026 - B.year) : null;
  const detail = [];

  // Expand each short pro into a detailed version
  if (s <= 0.3) {
    detail.push(`${s} pip EUR/USD average — among the tightest spreads available in the market`);
  } else if (s <= 0.8) {
    detail.push(`${s} pip EUR/USD average — competitive for its execution model`);
  } else {
    detail.push(`${s} pip EUR/USD spread with zero commission — simple, all-inclusive pricing`);
  }

  if (t1.length >= 2) {
    detail.push(`${t1.join(" + ")} — ${t1.length} Tier-1 licenses with client fund segregation`);
  } else if (t1.length === 1) {
    detail.push(`${t1[0]} regulated with mandated fund segregation and negative balance protection`);
  }

  if (plats.length >= 3) {
    detail.push(`${plats.length} platforms available: ${plats.slice(0, 4).join(", ")} — choose the best fit for your strategy`);
  } else if (plats.length >= 1) {
    detail.push(`${plats.join(" and ")} — ${hasPlat(B, "MetaTrader") ? "access to the largest EA and indicator ecosystem" : "reliable execution and charting tools"}`);
  }

  if (B.minDep === 0) {
    detail.push("$0 minimum deposit — start with any amount to test the broker's execution quality");
  } else if (B.minDep <= 100) {
    detail.push(`$${B.minDep} minimum deposit — accessible entry point for most traders`);
  }

  if (yearsOp && yearsOp >= 10) {
    detail.push(`${yearsOp} years of continuous operation since ${B.year} — proven long-term stability`);
  } else if (B.tp >= 4.5) {
    detail.push(`${B.tp}/5 Trustpilot from ${B.tpCount?.toLocaleString() || "thousands of"}+ reviews — strong client satisfaction`);
  } else if (B.instruments) {
    detail.push(`${B.instruments} tradable instruments — diversified trading opportunities`);
  }

  return detail.slice(0, 5);
}

function buildConsDetail(B, cfg, shortCons) {
  const s = spreadVal(B);
  const t1 = t1Regs(B);
  const detail = [];

  if (s >= 0.8) {
    detail.push(`${s} pip average EUR/USD — wider than ECN brokers offering 0.0-0.1 pip raw spreads`);
  } else if (s >= 0.3) {
    detail.push(`${s} pip spread is competitive but not the tightest available — ECN leaders offer 0.02-0.1 pips`);
  }

  if (t1.length === 0) {
    detail.push("No Tier-1 regulation (FCA, ASIC, CySEC) — limited compensation scheme protection");
  } else if (t1.length === 1 && !t1.includes("FCA")) {
    detail.push(`${t1[0]} regulated but no FCA license — UK traders lack FSCS protection`);
  }

  if (B.minDep >= 200) {
    detail.push(`$${B.minDep} minimum deposit — higher than brokers offering $0 entry`);
  }

  if (isType(B, "market maker")) {
    detail.push("Market maker model — broker sets prices rather than passing through raw market spreads");
  }

  if (!hasPlat(B, "cTrader") && !hasPlat(B, "TradingView") && cfg.wantCTrader) {
    detail.push("No cTrader or TradingView — limited advanced charting and order-flow analysis options");
  }

  if ((B.platforms || []).length <= 2) {
    detail.push(`Limited to ${(B.platforms || []).join(" and ")} — fewer platform choices than competitors offering 4+`);
  }

  if (detail.length === 0) {
    detail.push("Limited educational resources compared to education-focused brokers");
    detail.push("Narrower instrument range than the widest-coverage brokers (IG, CMC Markets)");
  }

  return detail.slice(0, 3);
}


// ═══════════════════════════════════════════════════════════════
// RANKING CONFIGS
// Maps every ranking ID → generator config
// ═══════════════════════════════════════════════════════════════

const CONFIGS = {

  // ─── A. FOREX STYLE (18) ───────────────────────────────────

  "forex-overall": {
    whyTemplate: "forex traders",
    focus: ["spread", "execution", "regulation", "platforms", "instruments"],
    prosOrder: ["score", "spread", "regulation", "platforms"],
    compCols: ["Avg Spread", "Commission", "Platforms", "Min Dep"],
    goodSpread: 0.5,
  },
  "forex-scalping": {
    whyTemplate: "scalpers",
    focus: ["spread", "execution", "commission", "platforms"],
    prosOrder: ["spread", "execution", "platforms", "regulation"],
    compCols: ["Avg Spread", "Commission", "Execution", "Min Dep"],
    goodSpread: 0.1, badSpread: 0.5, expectECN: true, wantCTrader: true, preferNDD: true,
  },
  "forex-beginners": {
    whyTemplate: "beginners",
    focus: ["deposit", "regulation", "platforms", "score"],
    prosOrder: ["deposit", "regulation", "platforms", "score"],
    compCols: ["Min Dep", "Spread", "Platforms", "Regulation"],
    goodSpread: 1.0, checkDeposit: false,
  },
  "forex-professionals": {
    whyTemplate: "professional traders",
    focus: ["execution", "spread", "platforms", "instruments"],
    prosOrder: ["execution", "spread", "platforms", "instruments"],
    compCols: ["Avg Spread", "Commission", "Execution", "Platforms"],
    goodSpread: 0.2, expectECN: true, wantCTrader: true,
  },
  "forex-day-trading": {
    whyTemplate: "day traders",
    focus: ["spread", "execution", "commission", "platforms"],
    prosOrder: ["spread", "execution", "commission", "platforms"],
    compCols: ["Avg Spread", "Commission", "Execution", "Platforms"],
    goodSpread: 0.3, badSpread: 0.8,
  },
  "forex-swing-trading": {
    whyTemplate: "swing traders",
    focus: ["instruments", "platforms", "regulation", "spread"],
    prosOrder: ["instruments", "platforms", "regulation", "spread"],
    compCols: ["Instruments", "Platforms", "Spread", "Min Dep"],
    goodSpread: 1.0,
  },
  "forex-position-trading": {
    whyTemplate: "position traders",
    focus: ["instruments", "regulation", "year", "spread"],
    prosOrder: ["instruments", "regulation", "year", "platforms"],
    compCols: ["Instruments", "Regulation", "Spread", "Min Dep"],
    goodSpread: 1.5,
  },
  "forex-hedging": {
    whyTemplate: "hedging strategies",
    focus: ["execution", "spread", "leverage", "instruments"],
    prosOrder: ["execution", "spread", "leverage", "instruments"],
    compCols: ["Spread", "Leverage", "Instruments", "Platforms"],
    goodSpread: 0.5,
  },
  "forex-news-trading": {
    whyTemplate: "news traders",
    focus: ["execution", "spread", "regulation", "platforms"],
    prosOrder: ["execution", "spread", "regulation", "platforms"],
    compCols: ["Execution", "Spread", "Slippage", "Min Dep"],
    goodSpread: 0.5, preferNDD: true,
  },
  "forex-automated": {
    whyTemplate: "automated trading",
    focus: ["platforms", "execution", "spread", "commission"],
    prosOrder: ["platforms", "execution", "spread", "commission"],
    compCols: ["Platforms", "Execution", "Spread", "Commission"],
    goodSpread: 0.5, expectPlatform: "MetaTrader",
  },
  "forex-algo": {
    whyTemplate: "algorithmic trading",
    focus: ["execution", "platforms", "spread", "commission"],
    prosOrder: ["execution", "platforms", "spread", "commission"],
    compCols: ["Execution", "API", "Spread", "Commission"],
    goodSpread: 0.3, wantCTrader: true,
  },
  "forex-hft": {
    whyTemplate: "high-frequency trading",
    focus: ["execution", "spread", "commission", "platforms"],
    prosOrder: ["execution", "spread", "commission", "platforms"],
    compCols: ["Execution", "Commission", "Spread", "API"],
    goodSpread: 0.2, expectECN: true,
  },
  "forex-copy-trading": {
    whyTemplate: "copy trading",
    focus: ["copyTrading", "regulation", "deposit", "platforms"],
    prosOrder: ["copy", "regulation", "deposit", "platforms"],
    compCols: ["Copy Platform", "Min Dep", "Regulation", "Score"],
    goodSpread: 1.5,
  },
  "forex-social-trading": {
    whyTemplate: "social trading",
    focus: ["copyTrading", "regulation", "deposit", "score"],
    prosOrder: ["copy", "regulation", "deposit", "score"],
    compCols: ["Social Features", "Min Dep", "Regulation", "Score"],
    goodSpread: 1.5,
  },
  "forex-signals": {
    whyTemplate: "forex signal followers",
    focus: ["platforms", "regulation", "spread", "deposit"],
    prosOrder: ["platforms", "regulation", "spread", "deposit"],
    compCols: ["Platforms", "Signals", "Spread", "Min Dep"],
    goodSpread: 1.0,
  },
  "forex-ea": {
    whyTemplate: "Expert Advisor (EA) trading",
    focus: ["platforms", "execution", "spread", "commission"],
    prosOrder: ["platforms", "execution", "spread", "commission"],
    compCols: ["MT4/MT5", "Execution", "Spread", "VPS"],
    goodSpread: 0.5, expectPlatform: "MetaTrader",
  },
  "forex-grid": {
    whyTemplate: "grid trading",
    focus: ["execution", "spread", "commission", "leverage"],
    prosOrder: ["execution", "spread", "commission", "leverage"],
    compCols: ["Spread", "Commission", "Leverage", "Platforms"],
    goodSpread: 0.5,
  },
  "forex-carry": {
    whyTemplate: "carry trading",
    focus: ["instruments", "regulation", "spread", "leverage"],
    prosOrder: ["instruments", "regulation", "leverage", "spread"],
    compCols: ["Instruments", "Leverage", "Spread", "Min Dep"],
    goodSpread: 1.0,
  },

  // ─── B. COSTS (12) ─────────────────────────────────────────

  "low-spread": {
    whyTemplate: "low-spread trading",
    focus: ["spread", "commission", "execution", "platforms"],
    prosOrder: ["spread", "commission", "execution", "regulation"],
    compCols: ["Avg Spread", "Commission", "Total Cost", "Min Dep"],
    goodSpread: 0.2, badSpread: 0.5,
  },
  "zero-spread": {
    whyTemplate: "zero-spread trading",
    focus: ["spread", "commission", "execution", "regulation"],
    prosOrder: ["spread", "commission", "execution", "regulation"],
    compCols: ["Avg Spread", "Commission", "Total Cost", "Execution"],
    goodSpread: 0.1, badSpread: 0.3,
  },
  "low-commission": {
    whyTemplate: "low-commission trading",
    focus: ["commission", "spread", "execution", "platforms"],
    prosOrder: ["commission", "spread", "execution", "regulation"],
    compCols: ["Commission", "Spread", "Total Cost", "Min Dep"],
    goodSpread: 0.5,
  },
  "low-cost": {
    whyTemplate: "low-cost trading",
    focus: ["spread", "commission", "deposit", "regulation"],
    prosOrder: ["spread", "commission", "deposit", "regulation"],
    compCols: ["Total Cost", "Spread", "Commission", "Min Dep"],
    goodSpread: 0.3,
  },
  "no-hidden-fees": {
    whyTemplate: "transparent pricing",
    focus: ["commission", "spread", "regulation", "deposit"],
    prosOrder: ["commission", "spread", "regulation", "deposit"],
    compCols: ["Spread", "Commission", "Deposit Fee", "Withdrawal Fee"],
    goodSpread: 0.8,
  },
  "no-inactivity-fee": {
    whyTemplate: "fee-free dormant accounts",
    focus: ["regulation", "deposit", "spread", "platforms"],
    prosOrder: ["regulation", "deposit", "spread", "platforms"],
    compCols: ["Inactivity Fee", "Min Dep", "Spread", "Withdrawal Fee"],
    goodSpread: 1.0,
  },
  "free-deposits": {
    whyTemplate: "free-deposit trading",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["Deposit Methods", "Deposit Fee", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },
  "free-withdrawals": {
    whyTemplate: "free-withdrawal trading",
    focus: ["regulation", "deposit", "spread", "platforms"],
    prosOrder: ["regulation", "deposit", "spread", "platforms"],
    compCols: ["Withdrawal Fee", "Methods", "Processing Time", "Min Dep"],
    goodSpread: 1.0,
  },
  "instant-withdrawal": {
    whyTemplate: "instant withdrawal",
    focus: ["regulation", "deposit", "spread", "platforms"],
    prosOrder: ["regulation", "deposit", "spread", "platforms"],
    compCols: ["Withdrawal Speed", "Methods", "Fee", "Min Dep"],
    goodSpread: 1.0,
  },
  "cashback": {
    whyTemplate: "cashback and rebate trading",
    focus: ["commission", "spread", "regulation", "deposit"],
    prosOrder: ["commission", "spread", "regulation", "deposit"],
    compCols: ["Rebate Program", "Spread", "Commission", "Min Dep"],
    goodSpread: 0.8,
  },
  "no-requotes": {
    whyTemplate: "requote-free trading",
    focus: ["execution", "spread", "regulation", "platforms"],
    prosOrder: ["execution", "spread", "regulation", "platforms"],
    compCols: ["Execution", "Requotes", "Spread", "Commission"],
    goodSpread: 0.5, preferNDD: true,
  },
  "low-slippage": {
    whyTemplate: "low-slippage trading",
    focus: ["execution", "spread", "regulation", "commission"],
    prosOrder: ["execution", "spread", "regulation", "commission"],
    compCols: ["Execution", "Slippage", "Spread", "Commission"],
    goodSpread: 0.3, expectECN: true,
  },

  // ─── C. EXECUTION MODEL (7) ────────────────────────────────

  "ecn": {
    whyTemplate: "ECN trading",
    focus: ["execution", "spread", "commission", "platforms"],
    prosOrder: ["execution", "spread", "commission", "regulation"],
    compCols: ["ECN Type", "Spread", "Commission", "Execution"],
    goodSpread: 0.2, badSpread: 0.5, expectECN: true,
  },
  "stp": {
    whyTemplate: "STP trading",
    focus: ["execution", "spread", "regulation", "deposit"],
    prosOrder: ["execution", "spread", "regulation", "deposit"],
    compCols: ["STP Type", "Spread", "Commission", "Min Dep"],
    goodSpread: 0.5,
  },
  "ndd": {
    whyTemplate: "No Dealing Desk trading",
    focus: ["execution", "spread", "regulation", "platforms"],
    prosOrder: ["execution", "spread", "regulation", "platforms"],
    compCols: ["NDD Model", "Spread", "Commission", "Execution"],
    goodSpread: 0.3, preferNDD: true,
  },
  "market-maker": {
    whyTemplate: "Market Maker accounts",
    focus: ["spread", "deposit", "regulation", "platforms"],
    prosOrder: ["spread", "deposit", "regulation", "platforms"],
    compCols: ["Spread", "Commission", "Min Dep", "Platforms"],
    goodSpread: 1.0,
  },
  "dma": {
    whyTemplate: "Direct Market Access",
    focus: ["execution", "spread", "instruments", "platforms"],
    prosOrder: ["execution", "spread", "instruments", "platforms"],
    compCols: ["DMA Access", "Spread", "Commission", "Instruments"],
    goodSpread: 0.2, expectECN: true,
  },
  "a-book": {
    whyTemplate: "A-Book execution",
    focus: ["execution", "spread", "regulation", "commission"],
    prosOrder: ["execution", "spread", "regulation", "commission"],
    compCols: ["Execution Model", "Spread", "Commission", "Regulation"],
    goodSpread: 0.3, preferNDD: true,
  },
  "fast-execution": {
    whyTemplate: "fast execution",
    focus: ["execution", "spread", "commission", "platforms"],
    prosOrder: ["execution", "spread", "commission", "platforms"],
    compCols: ["Execution Speed", "Spread", "Commission", "Platforms"],
    goodSpread: 0.3,
  },

  // ─── D. ACCOUNT TYPE (10) ──────────────────────────────────

  "micro-accounts": {
    whyTemplate: "micro account trading",
    focus: ["deposit", "spread", "regulation", "platforms"],
    prosOrder: ["deposit", "spread", "regulation", "platforms"],
    compCols: ["Min Lot", "Min Dep", "Spread", "Platforms"],
    goodSpread: 1.0,
  },
  "cent-accounts": {
    whyTemplate: "cent account trading",
    focus: ["deposit", "spread", "regulation", "leverage"],
    prosOrder: ["deposit", "spread", "regulation", "leverage"],
    compCols: ["Cent Account", "Min Dep", "Spread", "Leverage"],
    goodSpread: 1.0,
  },
  "standard-accounts": {
    whyTemplate: "standard account trading",
    focus: ["spread", "regulation", "platforms", "instruments"],
    prosOrder: ["spread", "regulation", "platforms", "instruments"],
    compCols: ["Spread", "Commission", "Min Dep", "Platforms"],
    goodSpread: 0.8,
  },
  "demo-accounts": {
    whyTemplate: "demo trading practice",
    focus: ["platforms", "regulation", "deposit", "score"],
    prosOrder: ["platforms", "regulation", "deposit", "score"],
    compCols: ["Demo Duration", "Platforms", "Virtual Funds", "Score"],
    goodSpread: 1.5,
  },
  "pamm-accounts": {
    whyTemplate: "PAMM account management",
    focus: ["regulation", "platforms", "deposit", "instruments"],
    prosOrder: ["regulation", "platforms", "deposit", "instruments"],
    compCols: ["PAMM Features", "Min Dep", "Regulation", "Platforms"],
    goodSpread: 1.0,
  },
  "mam-accounts": {
    whyTemplate: "MAM account management",
    focus: ["regulation", "platforms", "execution", "instruments"],
    prosOrder: ["regulation", "platforms", "execution", "instruments"],
    compCols: ["MAM Features", "Min Dep", "Regulation", "Platforms"],
    goodSpread: 0.8,
  },
  "managed-accounts": {
    whyTemplate: "managed account services",
    focus: ["regulation", "year", "instruments", "platforms"],
    prosOrder: ["regulation", "year", "instruments", "platforms"],
    compCols: ["Managed Options", "Regulation", "Min Dep", "Score"],
    goodSpread: 1.0,
  },
  "large-accounts": {
    whyTemplate: "large account holders",
    focus: ["regulation", "execution", "spread", "instruments"],
    prosOrder: ["regulation", "execution", "spread", "instruments"],
    compCols: ["Regulation", "Spread", "Execution", "Instruments"],
    goodSpread: 0.3,
  },
  "small-accounts": {
    whyTemplate: "small account trading",
    focus: ["deposit", "spread", "regulation", "leverage"],
    prosOrder: ["deposit", "spread", "regulation", "leverage"],
    compCols: ["Min Dep", "Min Lot", "Spread", "Leverage"],
    goodSpread: 1.0,
  },
  "islamic-accounts": {
    whyTemplate: "Islamic (swap-free) trading",
    focus: ["islamic", "regulation", "spread", "deposit"],
    prosOrder: ["regulation", "deposit", "spread", "platforms"],
    compCols: ["Swap-Free", "Spread", "Min Dep", "Regulation"],
    goodSpread: 1.0,
  },

  // ─── E. MINIMUM DEPOSIT (7) ────────────────────────────────

  "no-min-deposit": {
    whyTemplate: "zero-deposit entry",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["Min Dep", "Spread", "Regulation", "Platforms"],
    goodSpread: 1.0,
  },
  "1-dollar-deposit": {
    whyTemplate: "$1 deposit trading",
    focus: ["deposit", "regulation", "spread", "leverage"],
    prosOrder: ["deposit", "regulation", "spread", "leverage"],
    compCols: ["Min Dep", "Spread", "Leverage", "Platforms"],
    goodSpread: 1.0,
  },
  "5-dollar-deposit": {
    whyTemplate: "$5 deposit trading",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["Min Dep", "Spread", "Leverage", "Platforms"],
    goodSpread: 1.0,
  },
  "10-dollar-deposit": {
    whyTemplate: "$10 deposit trading",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["Min Dep", "Spread", "Leverage", "Regulation"],
    goodSpread: 1.0,
  },
  "50-dollar-deposit": {
    whyTemplate: "$50 deposit trading",
    focus: ["deposit", "spread", "regulation", "platforms"],
    prosOrder: ["deposit", "spread", "regulation", "platforms"],
    compCols: ["Min Dep", "Spread", "Commission", "Platforms"],
    goodSpread: 0.8,
  },
  "100-dollar-deposit": {
    whyTemplate: "$100 deposit trading",
    focus: ["deposit", "spread", "regulation", "platforms"],
    prosOrder: ["deposit", "spread", "regulation", "platforms"],
    compCols: ["Min Dep", "Spread", "Commission", "Regulation"],
    goodSpread: 0.8,
  },
  "500-dollar-deposit": {
    whyTemplate: "$500 deposit trading",
    focus: ["deposit", "spread", "execution", "regulation"],
    prosOrder: ["spread", "execution", "regulation", "platforms"],
    compCols: ["Min Dep", "Spread", "Execution", "Regulation"],
    goodSpread: 0.5,
  },

  // ─── F. LEVERAGE (7) ───────────────────────────────────────

  "high-leverage": {
    whyTemplate: "high leverage trading",
    focus: ["leverage", "execution", "spread", "regulation"],
    prosOrder: ["leverage", "spread", "execution", "regulation"],
    compCols: ["Max Leverage", "Spread", "Regulation", "Min Dep"],
    goodSpread: 0.5,
  },
  "leverage-30": {
    whyTemplate: "EU-regulated 1:30 leverage trading",
    focus: ["regulation", "spread", "leverage", "deposit"],
    prosOrder: ["regulation", "spread", "deposit", "platforms"],
    compCols: ["Leverage", "Regulation", "Spread", "Min Dep"],
    goodSpread: 0.8,
  },
  "leverage-100": {
    whyTemplate: "1:100 leverage trading",
    focus: ["leverage", "spread", "regulation", "execution"],
    prosOrder: ["leverage", "spread", "regulation", "execution"],
    compCols: ["Leverage", "Spread", "Regulation", "Min Dep"],
    goodSpread: 0.5,
  },
  "leverage-200": {
    whyTemplate: "1:200 leverage trading",
    focus: ["leverage", "spread", "regulation", "execution"],
    prosOrder: ["leverage", "spread", "regulation", "execution"],
    compCols: ["Leverage", "Spread", "Regulation", "Min Dep"],
    goodSpread: 0.5,
  },
  "leverage-500": {
    whyTemplate: "1:500 leverage trading",
    focus: ["leverage", "execution", "spread", "commission"],
    prosOrder: ["leverage", "execution", "spread", "commission"],
    compCols: ["Leverage", "Spread", "Execution", "Min Dep"],
    goodSpread: 0.5,
  },
  "leverage-1000": {
    whyTemplate: "1:1000 leverage trading",
    focus: ["leverage", "execution", "spread", "deposit"],
    prosOrder: ["leverage", "execution", "spread", "deposit"],
    compCols: ["Leverage", "Spread", "Min Dep", "Regulation"],
    goodSpread: 0.5,
  },
  "unlimited-leverage": {
    whyTemplate: "unlimited leverage trading",
    focus: ["leverage", "execution", "spread", "deposit"],
    prosOrder: ["leverage", "execution", "spread", "deposit"],
    compCols: ["Leverage", "Spread", "Min Dep", "Regulation"],
    goodSpread: 0.5,
  },

  // ─── G. BONUS (5) ──────────────────────────────────────────

  "bonus": {
    whyTemplate: "bonus and promotions",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["Bonus Type", "Min Dep", "Regulation", "Spread"],
    goodSpread: 1.0,
  },
  "no-deposit-bonus": {
    whyTemplate: "no-deposit bonus accounts",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["Bonus Amount", "Min Dep", "Regulation", "Spread"],
    goodSpread: 1.0,
  },
  "deposit-bonus": {
    whyTemplate: "deposit bonus promotions",
    focus: ["deposit", "regulation", "spread", "leverage"],
    prosOrder: ["deposit", "regulation", "spread", "leverage"],
    compCols: ["Bonus %", "Min Dep", "Regulation", "Spread"],
    goodSpread: 1.0,
  },
  "welcome-bonus": {
    whyTemplate: "welcome bonus promotions",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["Welcome Bonus", "Min Dep", "Regulation", "Platforms"],
    goodSpread: 1.0,
  },
  "loyalty-program": {
    whyTemplate: "loyalty program benefits",
    focus: ["regulation", "spread", "commission", "platforms"],
    prosOrder: ["regulation", "spread", "commission", "platforms"],
    compCols: ["Loyalty Program", "Spread", "Commission", "Min Dep"],
    goodSpread: 0.8,
  },

  // ─── H. PLATFORM (10) ─────────────────────────────────────

  "mt4": {
    whyTemplate: "MetaTrader 4 trading",
    focus: ["platformFocus:MetaTrader 4", "spread", "execution", "regulation"],
    prosOrder: ["platforms", "spread", "execution", "regulation"],
    compCols: ["MT4 Features", "Spread", "Commission", "Min Dep"],
    goodSpread: 0.5, expectPlatform: "MetaTrader 4",
  },
  "mt5": {
    whyTemplate: "MetaTrader 5 trading",
    focus: ["platformFocus:MetaTrader 5", "spread", "execution", "regulation"],
    prosOrder: ["platforms", "spread", "execution", "regulation"],
    compCols: ["MT5 Features", "Spread", "Commission", "Min Dep"],
    goodSpread: 0.5, expectPlatform: "MetaTrader 5",
  },
  "ctrader": {
    whyTemplate: "cTrader trading",
    focus: ["platformFocus:cTrader", "spread", "execution", "commission"],
    prosOrder: ["platforms", "spread", "execution", "commission"],
    compCols: ["cTrader Version", "Spread", "Commission", "Execution"],
    goodSpread: 0.3, expectPlatform: "cTrader", wantCTrader: true,
  },
  "tradingview": {
    whyTemplate: "TradingView integration",
    focus: ["platformFocus:TradingView", "spread", "regulation", "deposit"],
    prosOrder: ["platforms", "spread", "regulation", "deposit"],
    compCols: ["TradingView", "Spread", "Commission", "Min Dep"],
    goodSpread: 0.5, expectPlatform: "TradingView",
  },
  "ninjatrader": {
    whyTemplate: "NinjaTrader trading",
    focus: ["platformFocus:NinjaTrader", "execution", "spread", "instruments"],
    prosOrder: ["platforms", "execution", "spread", "instruments"],
    compCols: ["NinjaTrader", "Spread", "Commission", "Instruments"],
    goodSpread: 0.5, expectPlatform: "NinjaTrader",
  },
  "zulutrade": {
    whyTemplate: "ZuluTrade copy trading",
    focus: ["platformFocus:ZuluTrade", "regulation", "deposit", "spread"],
    prosOrder: ["copy", "regulation", "deposit", "spread"],
    compCols: ["ZuluTrade", "Spread", "Min Dep", "Regulation"],
    goodSpread: 1.0,
  },
  "prorealtime": {
    whyTemplate: "ProRealTime charting",
    focus: ["platformFocus:ProRealTime", "spread", "regulation", "instruments"],
    prosOrder: ["platforms", "spread", "regulation", "instruments"],
    compCols: ["ProRealTime", "Spread", "Commission", "Instruments"],
    goodSpread: 0.5,
  },
  "proprietary": {
    whyTemplate: "proprietary platform trading",
    focus: ["platforms", "regulation", "spread", "instruments"],
    prosOrder: ["platforms", "regulation", "spread", "instruments"],
    compCols: ["Platform", "Spread", "Commission", "Min Dep"],
    goodSpread: 0.8,
  },
  "trading-api": {
    whyTemplate: "API trading",
    focus: ["platforms", "execution", "spread", "commission"],
    prosOrder: ["platforms", "execution", "spread", "commission"],
    compCols: ["API Type", "Execution", "Spread", "Commission"],
    goodSpread: 0.3,
  },
  "free-vps": {
    whyTemplate: "free VPS hosting",
    focus: ["platforms", "execution", "spread", "commission"],
    prosOrder: ["platforms", "execution", "spread", "commission"],
    compCols: ["VPS Specs", "Spread", "Commission", "Min Dep"],
    goodSpread: 0.5,
  },

  // ─── I. MOBILE (5) ────────────────────────────────────────

  "trading-apps": {
    whyTemplate: "mobile trading",
    focus: ["platforms", "regulation", "spread", "deposit"],
    prosOrder: ["platforms", "regulation", "spread", "deposit"],
    compCols: ["App Rating", "Platforms", "Spread", "Min Dep"],
    goodSpread: 0.8,
  },
  "apps-iphone": {
    whyTemplate: "iPhone trading",
    focus: ["platforms", "regulation", "deposit", "spread"],
    prosOrder: ["platforms", "regulation", "deposit", "spread"],
    compCols: ["iOS App", "Rating", "Spread", "Min Dep"],
    goodSpread: 1.0,
  },
  "apps-android": {
    whyTemplate: "Android trading",
    focus: ["platforms", "regulation", "deposit", "spread"],
    prosOrder: ["platforms", "regulation", "deposit", "spread"],
    compCols: ["Android App", "Rating", "Spread", "Min Dep"],
    goodSpread: 1.0,
  },
  "crypto-apps": {
    whyTemplate: "crypto mobile trading",
    focus: ["platforms", "regulation", "instruments", "deposit"],
    prosOrder: ["platforms", "regulation", "instruments", "deposit"],
    compCols: ["Crypto App", "Crypto Pairs", "Spread", "Min Dep"],
    goodSpread: 1.0,
  },
  "stock-apps": {
    whyTemplate: "stock mobile trading",
    focus: ["platforms", "instruments", "regulation", "deposit"],
    prosOrder: ["platforms", "instruments", "regulation", "deposit"],
    compCols: ["Stock App", "Stocks", "Commission", "Min Dep"],
    goodSpread: 1.0,
  },

  // ─── J. TRUST & SAFETY (5) ────────────────────────────────

  "safest": {
    whyTemplate: "safe and trusted trading",
    focus: ["regulation", "year", "trustpilot", "score"],
    prosOrder: ["regulation", "year", "score", "spread"],
    compCols: ["Regulation", "Years", "Trustpilot", "Score"],
    goodSpread: 1.0,
  },
  "regulated": {
    whyTemplate: "regulated trading",
    focus: ["regulation", "year", "score", "deposit"],
    prosOrder: ["regulation", "year", "score", "deposit"],
    compCols: ["Regulation", "Tier", "Years", "Score"],
    goodSpread: 1.0,
  },
  "negative-balance": {
    whyTemplate: "negative balance protected trading",
    focus: ["regulation", "leverage", "deposit", "spread"],
    prosOrder: ["regulation", "leverage", "deposit", "spread"],
    compCols: ["NBP", "Regulation", "Leverage", "Min Dep"],
    goodSpread: 1.0,
  },
  "guaranteed-stop-loss": {
    whyTemplate: "guaranteed stop-loss trading",
    focus: ["regulation", "spread", "platforms", "instruments"],
    prosOrder: ["regulation", "spread", "platforms", "instruments"],
    compCols: ["GSL Available", "GSL Cost", "Regulation", "Spread"],
    goodSpread: 1.0,
  },
  "segregated-accounts": {
    whyTemplate: "segregated account protection",
    focus: ["regulation", "year", "score", "deposit"],
    prosOrder: ["regulation", "year", "score", "deposit"],
    compCols: ["Segregated", "Regulation", "Years", "Score"],
    goodSpread: 1.0,
  },

  // ─── K. TOOLS & FEATURES (7) ──────────────────────────────

  "education": {
    whyTemplate: "learning to trade",
    focus: ["platforms", "regulation", "deposit", "score"],
    prosOrder: ["platforms", "regulation", "deposit", "score"],
    compCols: ["Education", "Platforms", "Min Dep", "Score"],
    goodSpread: 1.0,
  },
  "research": {
    whyTemplate: "research and analysis",
    focus: ["platforms", "instruments", "regulation", "spread"],
    prosOrder: ["platforms", "instruments", "regulation", "spread"],
    compCols: ["Research Tools", "Platforms", "Instruments", "Score"],
    goodSpread: 0.8,
  },
  "trading-central": {
    whyTemplate: "Trading Central analysis",
    focus: ["platforms", "regulation", "spread", "instruments"],
    prosOrder: ["platforms", "regulation", "spread", "instruments"],
    compCols: ["Trading Central", "Platforms", "Spread", "Score"],
    goodSpread: 0.8,
  },
  "autochartist": {
    whyTemplate: "Autochartist pattern recognition",
    focus: ["platforms", "regulation", "spread", "instruments"],
    prosOrder: ["platforms", "regulation", "spread", "instruments"],
    compCols: ["Autochartist", "Platforms", "Spread", "Score"],
    goodSpread: 0.8,
  },
  "economic-calendar": {
    whyTemplate: "economic calendar tools",
    focus: ["platforms", "regulation", "instruments", "spread"],
    prosOrder: ["platforms", "regulation", "instruments", "spread"],
    compCols: ["Calendar", "Platforms", "Instruments", "Score"],
    goodSpread: 1.0,
  },
  "charting": {
    whyTemplate: "advanced charting",
    focus: ["platforms", "instruments", "spread", "regulation"],
    prosOrder: ["platforms", "instruments", "spread", "regulation"],
    compCols: ["Charting", "Indicators", "Platforms", "Score"],
    goodSpread: 0.8,
  },
  "24-7-support": {
    whyTemplate: "24/7 customer support",
    focus: ["regulation", "platforms", "deposit", "score"],
    prosOrder: ["regulation", "platforms", "deposit", "score"],
    compCols: ["Support Hours", "Languages", "Channels", "Score"],
    goodSpread: 1.0,
  },

  // ─── L. CRYPTO (12) ───────────────────────────────────────

  "crypto-overall": {
    whyTemplate: "cryptocurrency trading",
    focus: ["instruments", "regulation", "spread", "platforms"],
    prosOrder: ["instruments", "regulation", "spread", "platforms"],
    compCols: ["Crypto Pairs", "Spread", "Leverage", "Min Dep"],
    goodSpread: 1.0,
  },
  "crypto-bitcoin": {
    whyTemplate: "Bitcoin trading",
    focus: ["instruments", "spread", "regulation", "leverage"],
    prosOrder: ["instruments", "spread", "regulation", "leverage"],
    compCols: ["BTC Spread", "Leverage", "Regulation", "Min Dep"],
    goodSpread: 1.0,
  },
  "crypto-ethereum": {
    whyTemplate: "Ethereum trading",
    focus: ["instruments", "spread", "regulation", "platforms"],
    prosOrder: ["instruments", "spread", "regulation", "platforms"],
    compCols: ["ETH Spread", "Leverage", "Regulation", "Min Dep"],
    goodSpread: 1.0,
  },
  "crypto-xrp": {
    whyTemplate: "XRP (Ripple) trading",
    focus: ["instruments", "spread", "regulation", "deposit"],
    prosOrder: ["instruments", "spread", "regulation", "deposit"],
    compCols: ["XRP Available", "Spread", "Leverage", "Min Dep"],
    goodSpread: 1.0,
  },
  "crypto-solana": {
    whyTemplate: "Solana trading",
    focus: ["instruments", "spread", "regulation", "platforms"],
    prosOrder: ["instruments", "spread", "regulation", "platforms"],
    compCols: ["SOL Available", "Spread", "Leverage", "Min Dep"],
    goodSpread: 1.0,
  },
  "crypto-doge": {
    whyTemplate: "Dogecoin trading",
    focus: ["instruments", "spread", "regulation", "deposit"],
    prosOrder: ["instruments", "spread", "regulation", "deposit"],
    compCols: ["DOGE Available", "Spread", "Leverage", "Min Dep"],
    goodSpread: 1.0,
  },
  "crypto-altcoins": {
    whyTemplate: "altcoin trading",
    focus: ["instruments", "spread", "regulation", "platforms"],
    prosOrder: ["instruments", "spread", "regulation", "platforms"],
    compCols: ["Altcoins", "Spread", "Leverage", "Min Dep"],
    goodSpread: 1.0,
  },
  "crypto-staking": {
    whyTemplate: "crypto staking",
    focus: ["instruments", "regulation", "deposit", "platforms"],
    prosOrder: ["instruments", "regulation", "deposit", "platforms"],
    compCols: ["Staking", "Crypto Pairs", "Regulation", "Min Dep"],
    goodSpread: 1.0,
  },
  "crypto-copy": {
    whyTemplate: "crypto copy trading",
    focus: ["copyTrading", "instruments", "regulation", "deposit"],
    prosOrder: ["copy", "instruments", "regulation", "deposit"],
    compCols: ["Copy Trading", "Crypto Pairs", "Min Dep", "Regulation"],
    goodSpread: 1.0,
  },
  "crypto-high-lev": {
    whyTemplate: "high-leverage crypto trading",
    focus: ["leverage", "instruments", "spread", "execution"],
    prosOrder: ["leverage", "instruments", "spread", "execution"],
    compCols: ["Crypto Leverage", "Pairs", "Spread", "Min Dep"],
    goodSpread: 1.0,
  },
  "crypto-low-spread": {
    whyTemplate: "low-spread crypto trading",
    focus: ["spread", "instruments", "regulation", "platforms"],
    prosOrder: ["spread", "instruments", "regulation", "platforms"],
    compCols: ["BTC Spread", "ETH Spread", "Pairs", "Min Dep"],
    goodSpread: 0.5,
  },
  "crypto-vs-cfd": {
    whyTemplate: "crypto CFD trading",
    focus: ["instruments", "regulation", "spread", "leverage"],
    prosOrder: ["instruments", "regulation", "spread", "leverage"],
    compCols: ["Crypto CFDs", "Regulation", "Spread", "Leverage"],
    goodSpread: 1.0,
  },

  // ─── M. ASSETS (12) ───────────────────────────────────────

  "cfd": {
    whyTemplate: "CFD trading",
    focus: ["instruments", "spread", "regulation", "platforms"],
    prosOrder: ["instruments", "spread", "regulation", "platforms"],
    compCols: ["CFD Range", "Spread", "Commission", "Platforms"],
    goodSpread: 0.5,
  },
  "stocks": {
    whyTemplate: "stock trading",
    focus: ["instruments", "regulation", "platforms", "commission"],
    prosOrder: ["instruments", "regulation", "platforms", "commission"],
    compCols: ["Stocks", "Commission", "Platforms", "Min Dep"],
    goodSpread: 1.0,
  },
  "gold": {
    whyTemplate: "gold trading",
    focus: ["spread", "instruments", "leverage", "regulation"],
    prosOrder: ["spread", "instruments", "leverage", "regulation"],
    compCols: ["Gold Spread", "Leverage", "Regulation", "Min Dep"],
    goodSpread: 0.5,
  },
  "silver": {
    whyTemplate: "silver trading",
    focus: ["spread", "instruments", "leverage", "regulation"],
    prosOrder: ["spread", "instruments", "leverage", "regulation"],
    compCols: ["Silver Spread", "Leverage", "Regulation", "Min Dep"],
    goodSpread: 0.5,
  },
  "oil": {
    whyTemplate: "oil trading",
    focus: ["instruments", "spread", "leverage", "regulation"],
    prosOrder: ["instruments", "spread", "leverage", "regulation"],
    compCols: ["Oil Spread", "Leverage", "Regulation", "Min Dep"],
    goodSpread: 0.8,
  },
  "commodities": {
    whyTemplate: "commodity trading",
    focus: ["instruments", "spread", "regulation", "platforms"],
    prosOrder: ["instruments", "spread", "regulation", "platforms"],
    compCols: ["Commodities", "Spread", "Leverage", "Platforms"],
    goodSpread: 0.8,
  },
  "indices": {
    whyTemplate: "index trading",
    focus: ["instruments", "spread", "regulation", "platforms"],
    prosOrder: ["instruments", "spread", "regulation", "platforms"],
    compCols: ["Indices", "Spread", "Leverage", "Min Dep"],
    goodSpread: 0.8,
  },
  "options": {
    whyTemplate: "options trading",
    focus: ["instruments", "platforms", "regulation", "deposit"],
    prosOrder: ["instruments", "platforms", "regulation", "deposit"],
    compCols: ["Options", "Platforms", "Regulation", "Min Dep"],
    goodSpread: 1.0,
  },
  "futures": {
    whyTemplate: "futures trading",
    focus: ["instruments", "platforms", "execution", "regulation"],
    prosOrder: ["instruments", "platforms", "execution", "regulation"],
    compCols: ["Futures", "Platforms", "Commission", "Min Dep"],
    goodSpread: 0.8,
  },
  "etf": {
    whyTemplate: "ETF trading",
    focus: ["instruments", "commission", "platforms", "regulation"],
    prosOrder: ["instruments", "commission", "platforms", "regulation"],
    compCols: ["ETFs", "Commission", "Platforms", "Min Dep"],
    goodSpread: 1.0,
  },
  "spread-betting": {
    whyTemplate: "spread betting",
    focus: ["spread", "instruments", "regulation", "platforms"],
    prosOrder: ["spread", "instruments", "regulation", "platforms"],
    compCols: ["Markets", "Spread", "Tax-Free", "Min Dep"],
    goodSpread: 0.8,
  },
  "bonds": {
    whyTemplate: "bond trading",
    focus: ["instruments", "regulation", "platforms", "spread"],
    prosOrder: ["instruments", "regulation", "platforms", "spread"],
    compCols: ["Bonds", "Spread", "Regulation", "Platforms"],
    goodSpread: 1.0,
  },

  // ─── N. CURRENCY PAIRS (10) ───────────────────────────────

  "eurusd": {
    whyTemplate: "EUR/USD trading",
    focus: ["spread", "execution", "regulation", "commission"],
    prosOrder: ["spread", "execution", "regulation", "commission"],
    compCols: ["EUR/USD Spread", "Commission", "Execution", "Min Dep"],
    goodSpread: 0.2, badSpread: 0.5,
  },
  "gbpusd": {
    whyTemplate: "GBP/USD trading",
    focus: ["spread", "execution", "regulation", "platforms"],
    prosOrder: ["spread", "execution", "regulation", "platforms"],
    compCols: ["GBP/USD Spread", "Commission", "Execution", "Min Dep"],
    goodSpread: 0.3, badSpread: 0.8,
  },
  "usdjpy": {
    whyTemplate: "USD/JPY trading",
    focus: ["spread", "execution", "regulation", "leverage"],
    prosOrder: ["spread", "execution", "regulation", "leverage"],
    compCols: ["USD/JPY Spread", "Commission", "Execution", "Min Dep"],
    goodSpread: 0.3, badSpread: 0.8,
  },
  "audusd": {
    whyTemplate: "AUD/USD trading",
    focus: ["spread", "execution", "regulation", "platforms"],
    prosOrder: ["spread", "execution", "regulation", "platforms"],
    compCols: ["AUD/USD Spread", "Commission", "Regulation", "Min Dep"],
    goodSpread: 0.3, badSpread: 0.8,
  },
  "usdcad": {
    whyTemplate: "USD/CAD trading",
    focus: ["spread", "execution", "regulation", "platforms"],
    prosOrder: ["spread", "execution", "regulation", "platforms"],
    compCols: ["USD/CAD Spread", "Commission", "Regulation", "Min Dep"],
    goodSpread: 0.5, badSpread: 1.0,
  },
  "eurgbp": {
    whyTemplate: "EUR/GBP trading",
    focus: ["spread", "execution", "regulation", "platforms"],
    prosOrder: ["spread", "execution", "regulation", "platforms"],
    compCols: ["EUR/GBP Spread", "Commission", "Regulation", "Min Dep"],
    goodSpread: 0.5, badSpread: 1.0,
  },
  "usdchf": {
    whyTemplate: "USD/CHF trading",
    focus: ["spread", "execution", "regulation", "platforms"],
    prosOrder: ["spread", "execution", "regulation", "platforms"],
    compCols: ["USD/CHF Spread", "Commission", "Regulation", "Min Dep"],
    goodSpread: 0.5, badSpread: 1.0,
  },
  "nzdusd": {
    whyTemplate: "NZD/USD trading",
    focus: ["spread", "execution", "regulation", "platforms"],
    prosOrder: ["spread", "execution", "regulation", "platforms"],
    compCols: ["NZD/USD Spread", "Commission", "Regulation", "Min Dep"],
    goodSpread: 0.5, badSpread: 1.0,
  },
  "exotic": {
    whyTemplate: "exotic pairs trading",
    focus: ["instruments", "spread", "leverage", "regulation"],
    prosOrder: ["instruments", "spread", "leverage", "regulation"],
    compCols: ["Exotic Pairs", "Spread", "Leverage", "Commission"],
    goodSpread: 1.0,
  },
  "minor": {
    whyTemplate: "minor pairs trading",
    focus: ["instruments", "spread", "execution", "regulation"],
    prosOrder: ["instruments", "spread", "execution", "regulation"],
    compCols: ["Minor Pairs", "Spread", "Commission", "Execution"],
    goodSpread: 0.5,
  },

  // ─── O. INDEX (6) ─────────────────────────────────────────

  "sp500": {
    whyTemplate: "S&P 500 trading",
    focus: ["instruments", "spread", "regulation", "platforms"],
    prosOrder: ["instruments", "spread", "regulation", "platforms"],
    compCols: ["S&P 500 Spread", "Leverage", "Regulation", "Min Dep"],
    goodSpread: 0.8,
  },
  "nasdaq": {
    whyTemplate: "NASDAQ trading",
    focus: ["instruments", "spread", "regulation", "platforms"],
    prosOrder: ["instruments", "spread", "regulation", "platforms"],
    compCols: ["NASDAQ Spread", "Leverage", "Regulation", "Min Dep"],
    goodSpread: 0.8,
  },
  "dow": {
    whyTemplate: "Dow Jones trading",
    focus: ["instruments", "spread", "regulation", "platforms"],
    prosOrder: ["instruments", "spread", "regulation", "platforms"],
    compCols: ["DJ30 Spread", "Leverage", "Regulation", "Min Dep"],
    goodSpread: 0.8,
  },
  "ftse": {
    whyTemplate: "FTSE 100 trading",
    focus: ["instruments", "spread", "regulation", "platforms"],
    prosOrder: ["instruments", "spread", "regulation", "platforms"],
    compCols: ["FTSE Spread", "Leverage", "Regulation", "Min Dep"],
    goodSpread: 0.8,
  },
  "dax": {
    whyTemplate: "DAX trading",
    focus: ["instruments", "spread", "regulation", "platforms"],
    prosOrder: ["instruments", "spread", "regulation", "platforms"],
    compCols: ["DAX Spread", "Leverage", "Regulation", "Min Dep"],
    goodSpread: 0.8,
  },
  "nikkei": {
    whyTemplate: "Nikkei 225 trading",
    focus: ["instruments", "spread", "regulation", "platforms"],
    prosOrder: ["instruments", "spread", "regulation", "platforms"],
    compCols: ["Nikkei Spread", "Leverage", "Regulation", "Min Dep"],
    goodSpread: 0.8,
  },

  // ─── P. PAYMENT METHOD (14) ───────────────────────────────

  "pay-paypal": {
    whyTemplate: "PayPal-funded trading",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["PayPal", "Deposit Fee", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },
  "pay-skrill": {
    whyTemplate: "Skrill-funded trading",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["Skrill", "Deposit Fee", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },
  "pay-neteller": {
    whyTemplate: "Neteller-funded trading",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["Neteller", "Deposit Fee", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },
  "pay-bitcoin": {
    whyTemplate: "Bitcoin deposit trading",
    focus: ["deposit", "instruments", "regulation", "spread"],
    prosOrder: ["deposit", "instruments", "regulation", "spread"],
    compCols: ["BTC Deposits", "Deposit Fee", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },
  "pay-crypto": {
    whyTemplate: "crypto deposit trading",
    focus: ["deposit", "instruments", "regulation", "spread"],
    prosOrder: ["deposit", "instruments", "regulation", "spread"],
    compCols: ["Crypto Deposits", "Methods", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },
  "pay-credit-card": {
    whyTemplate: "credit card funded trading",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["Card Deposits", "Fee", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },
  "pay-visa": {
    whyTemplate: "Visa card funded trading",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["Visa", "Fee", "Min Dep", "Processing"],
    goodSpread: 1.0,
  },
  "pay-bank-transfer": {
    whyTemplate: "bank transfer funded trading",
    focus: ["deposit", "regulation", "spread", "platforms"],
    prosOrder: ["deposit", "regulation", "spread", "platforms"],
    compCols: ["Bank Transfer", "Fee", "Min Dep", "Processing"],
    goodSpread: 1.0,
  },
  "pay-apple-pay": {
    whyTemplate: "Apple Pay funded trading",
    focus: ["deposit", "platforms", "regulation", "spread"],
    prosOrder: ["deposit", "platforms", "regulation", "spread"],
    compCols: ["Apple Pay", "Fee", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },
  "pay-google-pay": {
    whyTemplate: "Google Pay funded trading",
    focus: ["deposit", "platforms", "regulation", "spread"],
    prosOrder: ["deposit", "platforms", "regulation", "spread"],
    compCols: ["Google Pay", "Fee", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },
  "pay-perfect-money": {
    whyTemplate: "Perfect Money funded trading",
    focus: ["deposit", "regulation", "spread", "leverage"],
    prosOrder: ["deposit", "regulation", "spread", "leverage"],
    compCols: ["Perfect Money", "Fee", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },
  "pay-webmoney": {
    whyTemplate: "WebMoney funded trading",
    focus: ["deposit", "regulation", "spread", "leverage"],
    prosOrder: ["deposit", "regulation", "spread", "leverage"],
    compCols: ["WebMoney", "Fee", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },
  "pay-upi": {
    whyTemplate: "UPI funded trading",
    focus: ["deposit", "regulation", "spread", "leverage"],
    prosOrder: ["deposit", "regulation", "spread", "leverage"],
    compCols: ["UPI", "Fee", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },
  "pay-pix": {
    whyTemplate: "PIX funded trading",
    focus: ["deposit", "regulation", "spread", "leverage"],
    prosOrder: ["deposit", "regulation", "spread", "leverage"],
    compCols: ["PIX", "Fee", "Min Dep", "Spread"],
    goodSpread: 1.0,
  },

  // ─── Q. REGULATOR (10) ────────────────────────────────────

  "reg-fca": {
    why: (B) => `Why ${B.name} for FCA-regulated trading:`,
    focus: ["regulation", "spread", "platforms", "deposit"],
    prosOrder: ["regulation", "spread", "platforms", "deposit"],
    compCols: ["FCA License", "Spread", "Min Dep", "Platforms"],
    goodSpread: 0.5,
  },
  "reg-asic": {
    why: (B) => `Why ${B.name} for ASIC-regulated trading:`,
    focus: ["regulation", "spread", "platforms", "deposit"],
    prosOrder: ["regulation", "spread", "platforms", "deposit"],
    compCols: ["ASIC License", "Spread", "Min Dep", "Platforms"],
    goodSpread: 0.5,
  },
  "reg-cysec": {
    why: (B) => `Why ${B.name} for CySEC-regulated trading:`,
    focus: ["regulation", "spread", "platforms", "deposit"],
    prosOrder: ["regulation", "spread", "platforms", "deposit"],
    compCols: ["CySEC License", "Spread", "Min Dep", "Platforms"],
    goodSpread: 0.5,
  },
  "reg-nfa": {
    why: (B) => `Why ${B.name} for NFA/CFTC-regulated trading:`,
    focus: ["regulation", "spread", "instruments", "platforms"],
    prosOrder: ["regulation", "spread", "instruments", "platforms"],
    compCols: ["NFA License", "Spread", "Instruments", "Platforms"],
    goodSpread: 0.8,
  },
  "reg-bafin": {
    why: (B) => `Why ${B.name} for BaFin-regulated trading:`,
    focus: ["regulation", "spread", "platforms", "deposit"],
    prosOrder: ["regulation", "spread", "platforms", "deposit"],
    compCols: ["BaFin License", "Spread", "Min Dep", "Platforms"],
    goodSpread: 0.5,
  },
  "reg-mas": {
    why: (B) => `Why ${B.name} for MAS-regulated trading:`,
    focus: ["regulation", "spread", "platforms", "deposit"],
    prosOrder: ["regulation", "spread", "platforms", "deposit"],
    compCols: ["MAS License", "Spread", "Min Dep", "Platforms"],
    goodSpread: 0.5,
  },
  "reg-dfsa": {
    why: (B) => `Why ${B.name} for DFSA-regulated trading:`,
    focus: ["regulation", "spread", "platforms", "deposit"],
    prosOrder: ["regulation", "spread", "platforms", "deposit"],
    compCols: ["DFSA License", "Spread", "Min Dep", "Platforms"],
    goodSpread: 0.8,
  },
  "reg-fsca": {
    why: (B) => `Why ${B.name} for FSCA-regulated trading:`,
    focus: ["regulation", "spread", "deposit", "platforms"],
    prosOrder: ["regulation", "spread", "deposit", "platforms"],
    compCols: ["FSCA License", "Spread", "Min Dep", "Platforms"],
    goodSpread: 0.8,
  },
  "reg-scb": {
    why: (B) => `Why ${B.name} for SCB-regulated trading:`,
    focus: ["regulation", "leverage", "spread", "deposit"],
    prosOrder: ["regulation", "leverage", "spread", "deposit"],
    compCols: ["SCB License", "Leverage", "Spread", "Min Dep"],
    goodSpread: 1.0,
  },
  "reg-offshore": {
    whyTemplate: "offshore-regulated trading",
    focus: ["leverage", "deposit", "spread", "instruments"],
    prosOrder: ["leverage", "deposit", "spread", "instruments"],
    compCols: ["Regulation", "Leverage", "Spread", "Min Dep"],
    goodSpread: 0.8,
  },

  // ─── R. COUNTRY (40) ──────────────────────────────────────
  // Country rankings use a generic country config builder

  ...buildCountryConfigs(),

  // ─── S. ALTERNATIVES (10) ─────────────────────────────────

  "alt-etoro": { whyTemplate: "an eToro alternative", focus: ["spread", "regulation", "platforms", "instruments"], prosOrder: ["spread", "regulation", "platforms", "instruments"], compCols: ["Spread", "Commission", "Platforms", "Min Dep"], goodSpread: 0.8 },
  "alt-ic-markets": { whyTemplate: "an IC Markets alternative", focus: ["spread", "execution", "commission", "regulation"], prosOrder: ["spread", "execution", "commission", "regulation"], compCols: ["Spread", "Commission", "Execution", "Regulation"], goodSpread: 0.3 },
  "alt-pepperstone": { whyTemplate: "a Pepperstone alternative", focus: ["spread", "execution", "regulation", "platforms"], prosOrder: ["spread", "execution", "regulation", "platforms"], compCols: ["Spread", "Commission", "Execution", "Min Dep"], goodSpread: 0.3 },
  "alt-xm": { whyTemplate: "an XM alternative", focus: ["deposit", "regulation", "spread", "leverage"], prosOrder: ["deposit", "regulation", "spread", "leverage"], compCols: ["Min Dep", "Spread", "Leverage", "Regulation"], goodSpread: 0.8 },
  "alt-exness": { whyTemplate: "an Exness alternative", focus: ["execution", "spread", "leverage", "deposit"], prosOrder: ["execution", "spread", "leverage", "deposit"], compCols: ["Spread", "Execution", "Leverage", "Min Dep"], goodSpread: 0.5 },
  "alt-ig": { whyTemplate: "an IG alternative", focus: ["instruments", "regulation", "spread", "platforms"], prosOrder: ["instruments", "regulation", "spread", "platforms"], compCols: ["Instruments", "Spread", "Regulation", "Platforms"], goodSpread: 0.5 },
  "alt-plus500": { whyTemplate: "a Plus500 alternative", focus: ["regulation", "platforms", "spread", "instruments"], prosOrder: ["regulation", "platforms", "spread", "instruments"], compCols: ["Spread", "Platforms", "Regulation", "Min Dep"], goodSpread: 0.8 },
  "alt-oanda": { whyTemplate: "an OANDA alternative", focus: ["spread", "regulation", "platforms", "instruments"], prosOrder: ["spread", "regulation", "platforms", "instruments"], compCols: ["Spread", "Regulation", "Platforms", "Min Dep"], goodSpread: 0.5 },
  "alt-avatrade": { whyTemplate: "an AvaTrade alternative", focus: ["regulation", "platforms", "spread", "deposit"], prosOrder: ["regulation", "platforms", "spread", "deposit"], compCols: ["Regulation", "Platforms", "Spread", "Min Dep"], goodSpread: 0.5 },
  "alt-robinhood": { whyTemplate: "a Robinhood alternative for forex", focus: ["instruments", "regulation", "spread", "platforms"], prosOrder: ["instruments", "regulation", "spread", "platforms"], compCols: ["Forex Pairs", "Spread", "Regulation", "Platforms"], goodSpread: 0.8 },
};

// Country config builder
function buildCountryConfigs() {
  const countries = {
    "geo-uk": "UK", "geo-australia": "Australian", "geo-usa": "US",
    "geo-germany": "German", "geo-canada": "Canadian", "geo-switzerland": "Swiss",
    "geo-singapore": "Singaporean", "geo-uae": "UAE", "geo-japan": "Japanese",
    "geo-hongkong": "Hong Kong", "geo-europe": "European", "geo-south-africa": "South African",
    "geo-india": "Indian", "geo-malaysia": "Malaysian", "geo-new-zealand": "New Zealand",
    "geo-france": "French", "geo-spain": "Spanish", "geo-italy": "Italian",
    "geo-netherlands": "Dutch", "geo-sweden": "Swedish", "geo-saudi": "Saudi",
    "geo-kuwait": "Kuwaiti", "geo-qatar": "Qatari", "geo-nigeria": "Nigerian",
    "geo-philippines": "Filipino", "geo-indonesia": "Indonesian", "geo-turkey": "Turkish",
    "geo-brazil": "Brazilian", "geo-mexico": "Mexican", "geo-pakistan": "Pakistani",
    "geo-kenya": "Kenyan", "geo-ghana": "Ghanaian", "geo-thailand": "Thai",
    "geo-vietnam": "Vietnamese", "geo-bangladesh": "Bangladeshi", "geo-colombia": "Colombian",
    "geo-egypt": "Egyptian", "geo-poland": "Polish", "geo-romania": "Romanian",
    "geo-south-korea": "South Korean",
  };
  const cfgs = {};
  for (const [id, adj] of Object.entries(countries)) {
    cfgs[id] = {
      whyTemplate: `${adj} traders`,
      focus: ["regulation", "deposit", "spread", "platforms"],
      prosOrder: ["regulation", "deposit", "spread", "platforms"],
      compCols: ["Regulation", "Spread", "Min Dep", "Platforms"],
      goodSpread: 0.8,
    };
  }
  return cfgs;
}


// ═══════════════════════════════════════════════════════════════
// QUICK VERDICT AUTO-SELECTION
// ═══════════════════════════════════════════════════════════════

const VERDICT_TEMPLATES = {
  style:     [{ label: "Best Overall", icon: "🏆" }, { label: "Best Value", icon: "💰" }, { label: "Best Platform", icon: "💻" }],
  costs:     [{ label: "Lowest Cost", icon: "💰" }, { label: "Tightest Spread", icon: "📉" }, { label: "Best Value", icon: "⭐" }],
  execution: [{ label: "Best Execution", icon: "⚡" }, { label: "Tightest Spread", icon: "📉" }, { label: "Most Trusted", icon: "🛡️" }],
  platform:  [{ label: "Best Overall", icon: "🏆" }, { label: "Tightest Spread", icon: "📉" }, { label: "Best Value", icon: "💰" }],
  accounts:  [{ label: "Best Overall", icon: "🏆" }, { label: "Lowest Entry", icon: "🎯" }, { label: "Most Trusted", icon: "🛡️" }],
  deposit:   [{ label: "Best Overall", icon: "🏆" }, { label: "Lowest Spread", icon: "📉" }, { label: "Most Regulated", icon: "🛡️" }],
  leverage:  [{ label: "Highest Leverage", icon: "📈" }, { label: "Best Regulated", icon: "🛡️" }, { label: "Best Spread", icon: "📉" }],
  bonus:     [{ label: "Best Bonus", icon: "🎁" }, { label: "Most Trusted", icon: "🛡️" }, { label: "Best Value", icon: "💰" }],
  trust:     [{ label: "Most Trusted", icon: "🛡️" }, { label: "Best Regulated", icon: "✅" }, { label: "Longest Track Record", icon: "📅" }],
  tools:     [{ label: "Best Tools", icon: "🔧" }, { label: "Best Overall", icon: "🏆" }, { label: "Best Value", icon: "💰" }],
  mobile:    [{ label: "Best App", icon: "📱" }, { label: "Most Features", icon: "⭐" }, { label: "Best Value", icon: "💰" }],
  pairs:     [{ label: "Tightest Spread", icon: "📉" }, { label: "Best Execution", icon: "⚡" }, { label: "Best Value", icon: "💰" }],
  payment:   [{ label: "Best Overall", icon: "🏆" }, { label: "Fastest Deposits", icon: "⚡" }, { label: "Lowest Fees", icon: "💰" }],
  regulator: [{ label: "Best Overall", icon: "🏆" }, { label: "Tightest Spread", icon: "📉" }, { label: "Best Value", icon: "💰" }],
  crypto:    [{ label: "Best Overall", icon: "🏆" }, { label: "Most Crypto", icon: "₿" }, { label: "Best Spread", icon: "📉" }],
  assets:    [{ label: "Best Overall", icon: "🏆" }, { label: "Most Markets", icon: "📊" }, { label: "Best Value", icon: "💰" }],
  index:     [{ label: "Best Overall", icon: "🏆" }, { label: "Tightest Spread", icon: "📉" }, { label: "Best Platform", icon: "💻" }],
  country:   [{ label: "Best Overall", icon: "🏆" }, { label: "Best Value", icon: "💰" }, { label: "Most Trusted", icon: "🛡️" }],
  alternatives: [{ label: "Best Alternative", icon: "🔄" }, { label: "Best Value", icon: "💰" }, { label: "Best Spread", icon: "📉" }],
};

function autoQuickVerdict(brokers, rankingId) {
  if (!brokers || brokers.length < 3) return null;

  // Determine category for verdict labels
  const cfg = CONFIGS[rankingId];
  if (!cfg) return null;

  const cat = getCategoryForRanking(rankingId);
  const templates = VERDICT_TEMPLATES[cat] || VERDICT_TEMPLATES.style;

  const b0 = brokers[0]; // Best overall (highest score)
  // Tightest spread excluding b0
  const rest = brokers.filter(b => b.slug !== b0.slug);
  const b1 = rest.reduce((best, b) => spreadVal(b.B) < spreadVal(best.B) ? b : best, rest[0]);
  const b2 = brokers.find(b => b.slug !== b0.slug && b.slug !== b1.slug) || brokers[2]; // Third pick

  // Build metrics based on category
  function metricFor(b, idx) {
    const B = b.B;
    const s = spreadVal(B);
    if (idx === 1) return `${s} pip spread`;
    if (cat === "leverage") return B.leverage;
    if (cat === "deposit") return B.minDep === 0 ? "$0 deposit" : `$${B.minDep} min`;
    if (cat === "trust" || cat === "country") {
      const t1 = t1Regs(B);
      return t1.length ? t1.join(", ") : `${B.score}/10 score`;
    }
    return `${B.score}/10 score`;
  }

  return [
    { ...templates[0], slug: b0.slug, metric: metricFor(b0, 0) },
    { ...templates[1], slug: b1.slug, metric: metricFor(b1, 1) },
    { ...templates[2], slug: b2.slug, metric: metricFor(b2, 2) },
  ];
}

function getCategoryForRanking(rankingId) {
  if (rankingId.startsWith("geo-")) return "country";
  if (rankingId.startsWith("alt-")) return "alternatives";
  if (rankingId.startsWith("crypto")) return "crypto";
  if (rankingId.startsWith("pay-")) return "payment";
  if (rankingId.startsWith("reg-")) return "regulator";
  if (rankingId.startsWith("apps-") || rankingId === "trading-apps" || rankingId === "crypto-apps" || rankingId === "stock-apps") return "mobile";
  const cfg = CONFIGS[rankingId];
  if (!cfg) return "style";
  // Infer from focus
  if (cfg.focus?.[0] === "leverage") return "leverage";
  if (cfg.focus?.[0] === "instruments") return "assets";
  if (cfg.compCols?.[0]?.includes("Spread") || cfg.whyTemplate?.includes("spread") || cfg.whyTemplate?.includes("cost") || cfg.whyTemplate?.includes("commission")) return "costs";
  if (cfg.whyTemplate?.includes("ECN") || cfg.whyTemplate?.includes("STP") || cfg.whyTemplate?.includes("NDD") || cfg.whyTemplate?.includes("DMA") || cfg.whyTemplate?.includes("execution") || cfg.whyTemplate?.includes("A-Book") || cfg.whyTemplate?.includes("Market Maker")) return "execution";
  if (cfg.expectPlatform || cfg.whyTemplate?.includes("MetaTrader") || cfg.whyTemplate?.includes("cTrader") || cfg.whyTemplate?.includes("TradingView") || cfg.whyTemplate?.includes("API") || cfg.whyTemplate?.includes("VPS")) return "platform";
  if (cfg.whyTemplate?.includes("account") || cfg.whyTemplate?.includes("demo") || cfg.whyTemplate?.includes("Islamic") || cfg.whyTemplate?.includes("PAMM") || cfg.whyTemplate?.includes("MAM")) return "accounts";
  if (cfg.whyTemplate?.includes("deposit")) return "deposit";
  if (cfg.whyTemplate?.includes("bonus") || cfg.whyTemplate?.includes("loyalty")) return "bonus";
  if (cfg.whyTemplate?.includes("safe") || cfg.whyTemplate?.includes("regulated") || cfg.whyTemplate?.includes("segregated") || cfg.whyTemplate?.includes("negative balance") || cfg.whyTemplate?.includes("stop-loss")) return "trust";
  if (cfg.whyTemplate?.includes("education") || cfg.whyTemplate?.includes("research") || cfg.whyTemplate?.includes("calendar") || cfg.whyTemplate?.includes("chart") || cfg.whyTemplate?.includes("support") || cfg.whyTemplate?.includes("Trading Central") || cfg.whyTemplate?.includes("Autochartist")) return "tools";
  return "style";
}


// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export function generateBlurb(rankingId, broker) {
  const cfg = CONFIGS[rankingId];
  if (!cfg) return null;
  return makeBlurb(broker, cfg);
}

export function generateQuickVerdict(rankingId, brokers) {
  return autoQuickVerdict(brokers, rankingId);
}

export function getCompCols(rankingId) {
  return CONFIGS[rankingId]?.compCols || null;
}

export function hasConfig(rankingId) {
  return !!CONFIGS[rankingId];
}
