const metatrader4 = {
  slug: "metatrader-4",
  platformName: "MetaTrader 4",
  rankingSlug: "/best-metatrader-4-brokers",
  meta: {
    title: "MetaTrader 4 (MT4) Platform Guide 2026: Features & Best Brokers | RatedBrokers",
    description: "Complete MetaTrader 4 guide: features, Expert Advisors, MQL4, mobile trading, pros & cons, and the best MT4 brokers tested with real money in 2026.",
  },
  hero: {
    badge: "PLATFORM",
    badgeColor: "#eff6ff",
    badgeTextColor: "#2563eb",
    icon: "\uD83D\uDCBB",
    h1: "MetaTrader 4 (MT4) Platform Guide 2026",
    subtitle: "The world's most popular forex trading platform — trusted by millions of traders and supported by 750+ brokers globally.",
  },
  author: "elena-petrova",
  updatedDate: "March 2026",
  readTime: "14 min read",
  quickFacts: {
    developer: "MetaQuotes Software",
    released: "2005",
    latestVersion: "Build 1420",
    languages: "40+",
    programmingLang: "MQL4",
    license: "Free (via brokers)",
    operatingSystems: "Windows, macOS (Wine), iOS, Android",
    website: "https://www.metatrader4.com",
  },
  specs: {
    headers: ["Feature", "Details"],
    rows: [
      ["Timeframes", "9 (M1, M5, M15, M30, H1, H4, D1, W1, MN)"],
      ["Chart Types", "Bar, Candlestick, Line"],
      ["Built-in Indicators", "30+"],
      ["Graphical Objects", "31"],
      ["Order Types", "4 pending + market"],
      ["Max Open Charts", "100+"],
      ["Expert Advisors", "Unlimited"],
      ["Custom Indicators", "Unlimited (MQL4)"],
      ["Strategy Tester", "Single-threaded backtesting"],
      ["Alerts", "Sound, Email, Push notifications"],
      ["One-Click Trading", "Yes"],
      ["Depth of Market", "No (limited)"],
    ],
  },
  sections: [
    {
      id: "overview",
      title: "What Is MetaTrader 4?",
      paragraphs: [
        "MetaTrader 4 (MT4) is a trading platform developed by MetaQuotes Software, first released in 2005. It quickly became the industry standard for retail forex trading and remains the most widely used platform globally, supported by over 750 brokers worldwide.",
        "MT4 was designed with forex traders in mind, offering a clean interface, reliable charting, and the ability to automate trades through Expert Advisors (EAs). Despite being over 20 years old, its stability, massive community, and extensive library of custom indicators keep it relevant against newer competitors.",
        "MetaQuotes officially stopped selling new licenses for MT4 in 2024, encouraging brokers to migrate to MT5. However, existing MT4 installations continue to receive updates, and most major brokers still offer it due to overwhelming trader demand.",
      ],
    },
    {
      id: "key-features",
      title: "Key Features",
      paragraphs: [
        "MT4's feature set is focused on forex trading simplicity and automation. While it lacks some advanced features found in MT5 or cTrader, its core functionality remains robust and battle-tested.",
      ],
      list: [
        "Expert Advisors (EAs) — Fully automated trading bots written in MQL4, with a massive marketplace of free and paid EAs available",
        "Custom Indicators — Thousands of community-built indicators available through the MQL4 marketplace and forums",
        "One-Click Trading — Execute trades instantly from the chart or order window",
        "9 Timeframes — M1 through Monthly, covering all major trading styles",
        "30+ Built-in Indicators — RSI, MACD, Bollinger Bands, Moving Averages, and more",
        "Strategy Tester — Backtest EAs on historical data (single-threaded)",
        "Alerts System — Price alerts via sound, email, and push notifications",
        "Multiple Order Types — Market, limit, stop, and trailing stop orders",
      ],
      tip: {
        title: "Pro Tip",
        text: "MT4's single-threaded strategy tester can be slow for complex EAs. For faster backtesting, consider MT5's multi-threaded tester or use third-party tools like Tick Data Suite for tick-level accuracy.",
      },
    },
    {
      id: "mql4-programming",
      title: "MQL4 Programming & Expert Advisors",
      paragraphs: [
        "MQL4 (MetaQuotes Language 4) is the proprietary scripting language used to create Expert Advisors, custom indicators, and scripts on MT4. It's a C-like language that's relatively easy to learn for programmers familiar with C or C++.",
        "The MQL4 ecosystem is one of MT4's greatest strengths. The MQL5.com marketplace (which also hosts MQL4 products) contains thousands of free and paid EAs, indicators, and scripts. The community forum is one of the largest trading-related programming communities online.",
        "Popular use cases for MQL4 include: grid trading bots, news trading EAs, copy trading solutions, custom risk management tools, and multi-pair correlation indicators.",
      ],
      warning: "Free EAs from unknown sources can contain malicious code. Only download from trusted sources like the official MQL4 marketplace, and always test on a demo account first.",
    },
    {
      id: "mobile-trading",
      title: "Mobile Trading",
      paragraphs: [
        "MT4 mobile apps are available for both iOS and Android, offering a streamlined version of the desktop platform. The mobile apps support live trading, charting with 30 indicators, and push notifications for price alerts.",
        "However, the MT4 mobile app has notable limitations: you cannot run Expert Advisors, the charting is more basic than desktop, and customization options are limited. For EA-based trading on the go, traders typically use a VPS (Virtual Private Server) to keep their desktop MT4 running 24/7.",
      ],
      tip: {
        title: "VPS Tip",
        text: "Many MT4 brokers offer free VPS hosting for active traders. This lets your EAs run continuously without needing your computer on, with latency as low as 1-2ms to the broker's server.",
      },
    },
    {
      id: "mt4-vs-mt5",
      title: "MT4 vs MT5: Key Differences",
      paragraphs: [
        "MetaTrader 5 is technically superior to MT4 in almost every way — more timeframes (21 vs 9), multi-threaded backtesting, depth of market, and multi-asset support. However, MT4 remains more popular for several reasons.",
        "MT4's simplicity is its strength. Many traders don't need 21 timeframes or built-in economic calendars. The massive library of MT4-specific EAs and indicators, built over nearly two decades, is not fully compatible with MT5's MQL5 language.",
      ],
      list: [
        "MT4: 9 timeframes vs MT5: 21 timeframes",
        "MT4: Hedging only vs MT5: Hedging + Netting",
        "MT4: Single-threaded tester vs MT5: Multi-threaded tester with agents",
        "MT4: MQL4 (simpler) vs MT5: MQL5 (more powerful, object-oriented)",
        "MT4: No built-in economic calendar vs MT5: Integrated calendar",
        "MT4: 4 pending order types vs MT5: 6 pending order types",
        "MT4: Forex-focused vs MT5: Multi-asset (stocks, futures, options)",
      ],
    },
    {
      id: "who-is-mt4-for",
      title: "Who Is MT4 Best For?",
      paragraphs: [
        "MT4 is ideal for forex-focused traders who value simplicity, automation, and a massive community ecosystem. It's particularly well-suited for:",
      ],
      list: [
        "Forex traders who need a reliable, proven platform without unnecessary complexity",
        "Algo traders running MQL4 Expert Advisors — the largest EA ecosystem in retail trading",
        "Beginners who benefit from MT4's simple interface and extensive tutorial resources",
        "Scalpers who rely on one-click trading and fast execution",
        "Copy traders using MT4-based signal services",
      ],
      paragraphs2: [
        "However, if you trade stocks, futures, or need advanced analytical tools, MT5 or cTrader may be better choices.",
      ],
    },
  ],
  pros: [
    "Industry standard with the largest community and EA ecosystem",
    "Simple, intuitive interface — easy for beginners to learn",
    "Thousands of free and paid Expert Advisors and custom indicators",
    "Extremely stable and well-tested over 20+ years",
    "Supported by 750+ brokers worldwide",
    "MQL4 is relatively easy to learn for algo trading",
    "Low system requirements — runs on virtually any computer",
    "Excellent mobile apps for iOS and Android",
  ],
  cons: [
    "Only 9 timeframes (MT5 offers 21)",
    "No native depth of market (DOM)",
    "Single-threaded strategy tester is slow for complex EAs",
    "MetaQuotes stopped selling new MT4 licenses to brokers",
    "No built-in economic calendar",
    "Limited to forex and CFDs — no stock or futures trading",
    "MQL4 is less powerful than MQL5 or C#",
    "macOS version requires Wine (not native)",
  ],
  faq: [
    {
      q: "Is MetaTrader 4 free to download?",
      a: "Yes, MT4 is completely free for traders. You download it through your broker's website. The broker pays MetaQuotes for the license, while you use it at no cost.",
    },
    {
      q: "Can I still use MT4 in 2026?",
      a: "Yes. While MetaQuotes stopped selling new MT4 licenses to brokers, existing installations continue to receive updates. Most major brokers still offer MT4, and it remains fully functional.",
    },
    {
      q: "Is MT4 better than MT5?",
      a: "It depends on your needs. MT4 is simpler and has a larger EA ecosystem, making it ideal for forex-focused traders. MT5 offers more timeframes, multi-threaded backtesting, and multi-asset trading. For pure forex with EAs, many traders still prefer MT4.",
    },
    {
      q: "Can I run Expert Advisors on MT4 mobile?",
      a: "No, EAs only run on the desktop version of MT4. To keep EAs running 24/7 without your computer on, use a Virtual Private Server (VPS). Many brokers offer free VPS for active traders.",
    },
    {
      q: "Does MT4 work on Mac?",
      a: "MT4 doesn't have a native macOS version. However, most brokers offer MT4 for Mac through Wine (a Windows compatibility layer) or provide web-based versions that work in any browser.",
    },
    {
      q: "How many brokers support MT4?",
      a: "Over 750 brokers worldwide still offer MT4. It remains the most widely supported trading platform in the retail forex industry, despite MetaQuotes pushing MT5 adoption.",
    },
  ],
  relatedPlatforms: ["metatrader-5", "ctrader", "tradingview"],
  relatedGuides: ["how-to-choose-a-forex-broker", "forex-trading-strategies"],
  relatedRankings: [
    { label: "Best MT4 Brokers 2026", path: "/best-metatrader-4-brokers" },
    { label: "Best Forex Brokers Overall", path: "/best-forex-brokers" },
    { label: "Best ECN Brokers", path: "/best-ecn-forex-brokers" },
  ],
};

export default metatrader4;
