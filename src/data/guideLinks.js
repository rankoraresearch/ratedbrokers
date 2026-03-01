/**
 * Internal linking map for guide articles.
 *
 * Each entry: { anchor, url, excludeSlugs }
 *  - anchor:       exact phrase to match (case-insensitive, whole-word)
 *  - url:          internal path (without locale prefix)
 *  - excludeSlugs: guide slugs where this link must NOT appear
 *
 * Rules applied by the renderer:
 *  1. Each anchor is linked at most ONCE per article.
 *  2. Only the first occurrence is linked.
 *  3. Self-links are always suppressed (the guide's own slug is excluded automatically).
 *  4. Longer anchors are matched first to avoid partial overlaps.
 */

const GUIDE_LINKS = [
  // ───── Guide-to-guide: Getting Started ─────
  { anchor: "what is forex trading", url: "/guide/what-is-forex-trading", excludeSlugs: [] },
  { anchor: "how to start forex trading", url: "/guide/how-to-start-forex-trading", excludeSlugs: [] },
  { anchor: "how to choose a forex broker", url: "/guide/how-to-choose-a-forex-broker", excludeSlugs: [] },
  { anchor: "choosing a broker", url: "/guide/how-to-choose-a-forex-broker", excludeSlugs: ["how-to-choose-a-forex-broker"] },
  { anchor: "demo account", url: "/guide/forex-demo-account-guide", excludeSlugs: ["forex-demo-account-guide"] },

  // ───── Guide-to-guide: Core Concepts ─────
  { anchor: "what a pip is", url: "/guide/what-is-a-pip", excludeSlugs: ["what-is-a-pip"] },
  { anchor: "pips and lots", url: "/guide/what-is-a-pip", excludeSlugs: ["what-is-a-pip"] },
  { anchor: "pip value", url: "/guide/what-is-a-pip", excludeSlugs: ["what-is-a-pip"] },
  { anchor: "spreads and fees", url: "/guide/understanding-spreads-and-fees", excludeSlugs: ["understanding-spreads-and-fees"] },
  { anchor: "trading costs", url: "/guide/understanding-spreads-and-fees", excludeSlugs: ["understanding-spreads-and-fees", "how-to-choose-a-forex-broker"] },
  { anchor: "spread pricing", url: "/guide/understanding-spreads-and-fees", excludeSlugs: ["understanding-spreads-and-fees"] },
  { anchor: "leverage", url: "/guide/what-is-leverage", excludeSlugs: ["what-is-leverage", "what-is-forex-trading"] },
  { anchor: "forex regulation", url: "/guide/forex-regulation-guide", excludeSlugs: ["forex-regulation-guide"] },
  { anchor: "regulatory oversight", url: "/guide/forex-regulation-guide", excludeSlugs: ["forex-regulation-guide"] },
  { anchor: "Tier 1 regulated", url: "/guide/forex-regulation-guide", excludeSlugs: ["forex-regulation-guide", "how-to-choose-a-forex-broker"] },
  { anchor: "forex market hours", url: "/guide/forex-market-hours", excludeSlugs: ["forex-market-hours"] },
  { anchor: "London-New York overlap", url: "/guide/forex-market-hours", excludeSlugs: ["forex-market-hours", "scalping-strategy-guide"] },
  { anchor: "ECN vs market maker", url: "/guide/ecn-vs-market-maker", excludeSlugs: ["ecn-vs-market-maker"] },
  { anchor: "ECN broker", url: "/guide/ecn-vs-market-maker", excludeSlugs: ["ecn-vs-market-maker", "scalping-strategy-guide"] },
  { anchor: "CFD trading", url: "/guide/what-is-cfd-trading", excludeSlugs: ["what-is-cfd-trading"] },
  { anchor: "forex vs stocks", url: "/guide/forex-vs-stocks", excludeSlugs: ["forex-vs-stocks"] },

  // ───── Guide-to-guide: Analysis ─────
  { anchor: "technical analysis", url: "/guide/technical-analysis-guide", excludeSlugs: ["technical-analysis-guide"] },
  { anchor: "fundamental analysis", url: "/guide/fundamental-analysis-guide", excludeSlugs: ["fundamental-analysis-guide"] },
  { anchor: "read forex charts", url: "/guide/how-to-read-forex-charts", excludeSlugs: ["how-to-read-forex-charts"] },
  { anchor: "candlestick patterns", url: "/guide/how-to-read-forex-charts", excludeSlugs: ["how-to-read-forex-charts", "technical-analysis-guide"] },
  { anchor: "chart patterns", url: "/guide/how-to-read-forex-charts", excludeSlugs: ["how-to-read-forex-charts", "technical-analysis-guide"] },

  // ───── Guide-to-guide: Strategies ─────
  { anchor: "trading strategies", url: "/guide/forex-trading-strategies", excludeSlugs: ["forex-trading-strategies"] },
  { anchor: "scalping strategy", url: "/guide/scalping-strategy-guide", excludeSlugs: ["scalping-strategy-guide"] },
  { anchor: "scalping", url: "/guide/scalping-strategy-guide", excludeSlugs: ["scalping-strategy-guide", "forex-trading-strategies"] },
  { anchor: "day trading", url: "/guide/day-trading-guide", excludeSlugs: ["day-trading-guide", "forex-trading-strategies"] },
  { anchor: "swing trading", url: "/guide/swing-trading-guide", excludeSlugs: ["swing-trading-guide", "forex-trading-strategies"] },
  { anchor: "trend trading", url: "/guide/trend-trading-guide", excludeSlugs: ["trend-trading-guide", "forex-trading-strategies"] },
  { anchor: "copy trading", url: "/guide/copy-trading-guide", excludeSlugs: ["copy-trading-guide"] },
  { anchor: "hedging", url: "/guide/hedging-in-forex", excludeSlugs: ["hedging-in-forex"] },

  // ───── Guide-to-guide: Advanced ─────
  { anchor: "risk management", url: "/guide/risk-management-guide", excludeSlugs: ["risk-management-guide"] },
  { anchor: "position sizing", url: "/guide/risk-management-guide", excludeSlugs: ["risk-management-guide", "scalping-strategy-guide"] },
  { anchor: "trading psychology", url: "/guide/trading-psychology-guide", excludeSlugs: ["trading-psychology-guide"] },
  { anchor: "MT4 vs MT5", url: "/guide/mt4-vs-mt5", excludeSlugs: ["mt4-vs-mt5"] },

  // ───── Guide-to-ranking pages ─────
  { anchor: "best forex brokers", url: "/best-forex-brokers", excludeSlugs: [] },
  { anchor: "best brokers for beginners", url: "/best-forex-brokers-for-beginners", excludeSlugs: [] },
  { anchor: "best brokers for scalping", url: "/best-forex-brokers-for-scalping", excludeSlugs: [] },
  { anchor: "lowest spread brokers", url: "/lowest-spread-forex-brokers", excludeSlugs: [] },
  { anchor: "best ECN brokers", url: "/best-ecn-forex-brokers", excludeSlugs: [] },
  { anchor: "best regulated brokers", url: "/best-regulated-forex-brokers", excludeSlugs: [] },
  { anchor: "best forex demo accounts", url: "/best-forex-demo-accounts", excludeSlugs: [] },
  { anchor: "best copy trading platforms", url: "/best-copy-trading-platforms", excludeSlugs: [] },

  // ───── Guide-to-platform pages ─────
  { anchor: "MetaTrader 4", url: "/platform/metatrader-4", excludeSlugs: ["mt4-vs-mt5"] },
  { anchor: "MetaTrader 5", url: "/platform/metatrader-5", excludeSlugs: ["mt4-vs-mt5"] },
  { anchor: "cTrader", url: "/platform/ctrader", excludeSlugs: ["mt4-vs-mt5"] },
  { anchor: "TradingView", url: "/platform/tradingview", excludeSlugs: [] },
];

export default GUIDE_LINKS;
