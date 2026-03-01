const metatrader5 = {
  slug: "metatrader-5",
  platformName: "MetaTrader 5",
  rankingSlug: "/best-metatrader-5-brokers",
  meta: {
    title: "MetaTrader 5 (MT5) Platform Guide 2026: Features & Best Brokers | RatedBrokers",
    description: "Complete MetaTrader 5 guide: 21 timeframes, MQL5, multi-asset trading, strategy tester, pros & cons, and the best MT5 brokers tested in 2026.",
  },
  hero: {
    badge: "PLATFORM",
    badgeColor: "#eff6ff",
    badgeTextColor: "#2563eb",
    icon: "\uD83D\uDE80",
    h1: "MetaTrader 5 (MT5) Platform Guide 2026",
    subtitle: "The next-generation multi-asset platform from MetaQuotes — more timeframes, faster backtesting, and built-in market depth.",
  },
  author: "elena-petrova",
  updatedDate: "March 2026",
  readTime: "13 min read",
  quickFacts: {
    developer: "MetaQuotes Software",
    released: "2010",
    latestVersion: "Build 4510",
    languages: "40+",
    programmingLang: "MQL5",
    license: "Free (via brokers)",
    operatingSystems: "Windows, macOS (native), iOS, Android, Linux (Wine)",
    website: "https://www.metatrader5.com",
  },
  specs: {
    headers: ["Feature", "Details"],
    rows: [
      ["Timeframes", "21 (M1 through MN, including M2, M3, M4, M6, M10, M12, H2, H3, H6, H8, H12)"],
      ["Chart Types", "Bar, Candlestick, Line"],
      ["Built-in Indicators", "38"],
      ["Graphical Objects", "44"],
      ["Order Types", "6 pending + market"],
      ["Max Open Charts", "100+"],
      ["Expert Advisors", "Unlimited (MQL5)"],
      ["Strategy Tester", "Multi-threaded with cloud agents"],
      ["Depth of Market", "Yes (built-in)"],
      ["Economic Calendar", "Yes (built-in)"],
      ["One-Click Trading", "Yes"],
      ["Netting Mode", "Yes (plus hedging)"],
    ],
  },
  sections: [
    {
      id: "overview",
      title: "What Is MetaTrader 5?",
      paragraphs: [
        "MetaTrader 5 (MT5) is the successor to MetaTrader 4, released by MetaQuotes Software in 2010. Unlike MT4's forex-focused design, MT5 was built from the ground up as a multi-asset platform capable of trading forex, stocks, futures, options, and commodities through a single interface.",
        "MT5 represents a significant technical leap over MT4: 21 timeframes instead of 9, a multi-threaded strategy tester that's dramatically faster, native depth of market (DOM), an integrated economic calendar, and MQL5 — an object-oriented programming language that's more powerful than MQL4.",
        "Adoption of MT5 has accelerated since MetaQuotes stopped selling new MT4 licenses in 2024. More brokers are now MT5-only or MT5-first, and the MQL5 ecosystem has matured with thousands of Expert Advisors, indicators, and signals.",
      ],
    },
    {
      id: "key-features",
      title: "Key Features",
      paragraphs: [
        "MT5 retains everything traders love about MT4 while adding significant upgrades for power users, algo traders, and multi-asset investors.",
      ],
      list: [
        "21 Timeframes — Including M2, M3, M4, M6, M10, M12, H2, H3, H6, H8, H12 for granular analysis",
        "Multi-Threaded Strategy Tester — Run backtests up to 10x faster using local and cloud agents",
        "Depth of Market (DOM) — See Level 2 pricing with full order book visibility",
        "Built-in Economic Calendar — Fundamental analysis integrated directly into the platform",
        "38 Built-in Indicators — More than MT4's 30, plus expanded graphical objects",
        "6 Pending Order Types — Adds Buy Stop Limit and Sell Stop Limit to MT4's 4 types",
        "Hedging + Netting Modes — Choose your preferred position management style",
        "MQL5 Marketplace — Thousands of EAs, indicators, and trading signals",
      ],
      tip: {
        title: "Migration Tip",
        text: "MQL4 Expert Advisors don't run natively on MT5. However, MetaQuotes has added MQL4 compatibility layers in recent builds. Many simple MQL4 EAs can be ported with minimal changes, though complex ones may need rewriting in MQL5.",
      },
    },
    {
      id: "mql5-programming",
      title: "MQL5 Programming & Strategy Tester",
      paragraphs: [
        "MQL5 is a fully object-oriented programming language, more powerful and structured than MQL4. It allows traders to create sophisticated Expert Advisors with classes, inheritance, and advanced data structures — closer in capability to C++ than MQL4's C-like syntax.",
        "The MT5 Strategy Tester is a standout feature. It supports multi-threaded backtesting using local CPU cores and cloud-based agents, making it 5-10x faster than MT4's single-threaded tester. It also supports tick-level testing, forward testing, and optimization with genetic algorithms.",
        "The MQL5 community at mql5.com is the largest trading programming community online, with over 10,000 free and paid products, a freelance service for custom development, and active forums with millions of posts.",
      ],
    },
    {
      id: "multi-asset-trading",
      title: "Multi-Asset Trading",
      paragraphs: [
        "Unlike MT4's forex-only design, MT5 supports trading across multiple asset classes through a single account. This includes forex pairs, stock CFDs, exchange-traded futures, options, and commodities — depending on what your broker offers.",
        "This makes MT5 the better choice for traders who want to diversify beyond forex. Several exchanges, including the Moscow Exchange and Dubai Gold & Commodities Exchange, use MT5 as their official trading platform.",
      ],
      list: [
        "Forex — All major, minor, and exotic pairs",
        "Stocks & ETFs — Real stocks and stock CFDs (broker-dependent)",
        "Futures — Exchange-traded futures contracts",
        "Options — Available through some brokers",
        "Commodities — Gold, silver, oil, and more",
        "Cryptocurrencies — Bitcoin, Ethereum, and other crypto CFDs",
      ],
    },
    {
      id: "mt5-vs-mt4",
      title: "Why Choose MT5 Over MT4?",
      paragraphs: [
        "MT5 is objectively the more capable platform. The question is whether you need those extra capabilities. Here's when MT5 is the clear winner:",
      ],
      list: [
        "You trade multiple asset classes (stocks, futures, not just forex)",
        "You need advanced backtesting with multi-threaded speed",
        "You want 21 timeframes for more precise chart analysis",
        "You need depth of market (DOM) for order flow analysis",
        "You're starting fresh and want the platform with the longer future",
        "You need netting mode for exchange-traded instruments",
      ],
      paragraphs2: [
        "Stick with MT4 if you have existing MQL4 EAs that you don't want to port, or if your preferred broker only offers MT4.",
      ],
    },
    {
      id: "who-is-mt5-for",
      title: "Who Is MT5 Best For?",
      paragraphs: [
        "MT5 is ideal for traders who want a future-proof platform with maximum analytical power. It's particularly well-suited for:",
      ],
      list: [
        "Multi-asset traders who want forex, stocks, and futures in one platform",
        "Algo traders who need fast, multi-threaded backtesting",
        "Quantitative traders leveraging MQL5's object-oriented programming",
        "Professional traders who need depth of market and Level 2 data",
        "New traders choosing between MT4 and MT5 (MT5 has the longer future)",
      ],
    },
  ],
  pros: [
    "21 timeframes for more granular chart analysis",
    "Multi-threaded strategy tester (5-10x faster than MT4)",
    "Native depth of market (DOM) for order flow analysis",
    "Multi-asset support: forex, stocks, futures, options",
    "MQL5 — powerful object-oriented programming language",
    "Built-in economic calendar for fundamental analysis",
    "6 pending order types (vs MT4's 4)",
    "Native macOS app (no Wine needed)",
    "Actively developed — MetaQuotes' primary focus",
  ],
  cons: [
    "MQL4 EAs not natively compatible — may need porting",
    "Smaller EA/indicator library than MT4 (but growing fast)",
    "More complex interface may overwhelm beginners",
    "Some brokers still don't offer MT5",
    "Netting mode can confuse hedging-focused forex traders",
    "Community split between MQL4 and MQL5 forums",
  ],
  faq: [
    {
      q: "Is MetaTrader 5 free?",
      a: "Yes, MT5 is free for traders. Download it from your broker's website or the official MetaTrader 5 website. Brokers pay MetaQuotes for the license.",
    },
    {
      q: "Can I run MT4 Expert Advisors on MT5?",
      a: "Not directly. MQL4 and MQL5 are different languages, though MetaQuotes has added compatibility improvements. Simple EAs may work with minor changes, but complex ones typically need to be rewritten in MQL5.",
    },
    {
      q: "Is MT5 replacing MT4?",
      a: "MetaQuotes is pushing MT5 as the primary platform — they stopped selling new MT4 licenses in 2024. However, MT4 remains widely available through existing broker licenses and continues to receive updates.",
    },
    {
      q: "Does MT5 work on Mac?",
      a: "Yes, MT5 has a native macOS application, unlike MT4 which requires Wine. The macOS version offers most features of the Windows version.",
    },
    {
      q: "Can I trade stocks on MT5?",
      a: "Yes, MT5 supports stock trading (real stocks and CFDs), futures, and options. However, available instruments depend on your broker — not all MT5 brokers offer stocks.",
    },
    {
      q: "What is netting mode in MT5?",
      a: "Netting mode combines all positions in the same instrument into one. If you buy 1 lot and then buy 0.5 lots of EUR/USD, you'll have one 1.5-lot position. Most forex brokers use hedging mode (separate positions) by default.",
    },
  ],
  relatedPlatforms: ["metatrader-4", "ctrader", "tradingview"],
  relatedGuides: ["how-to-choose-a-forex-broker", "technical-analysis-guide"],
  relatedRankings: [
    { label: "Best MT5 Brokers 2026", path: "/best-metatrader-5-brokers" },
    { label: "Best Forex Brokers Overall", path: "/best-forex-brokers" },
    { label: "Best Brokers for Professionals", path: "/best-forex-brokers-for-professionals" },
  ],
};

export default metatrader5;
