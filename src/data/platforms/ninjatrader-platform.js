const ninjatraderPlatform = {
  slug: "ninjatrader-platform",
  platformName: "NinjaTrader",
  rankingSlug: "/best-futures-brokers-ninjatrader",
  meta: {
    title: "NinjaTrader Platform Guide 2026: Features & Best Brokers | RatedBrokers",
    description: "Complete NinjaTrader guide: SuperDOM, C# indicators, Market Replay, backtesting, and the best brokers supporting NinjaTrader in 2026.",
  },
  hero: {
    badge: "PLATFORM",
    badgeColor: "#fff7ed",
    badgeTextColor: "#ea580c",
    icon: "📈",
    h1: "NinjaTrader Platform Guide 2026",
    subtitle: "The most popular futures trading platform — featuring SuperDOM, C# custom indicators, and ultra-low day trade margins.",
  },
  author: "marcus-chen",
  updatedDate: "March 2026",
  readTime: "11 min read",
  quickFacts: {
    developer: "NinjaTrader Group, LLC (acquired by Kraken 2025)",
    released: "2003",
    latestVersion: "NinjaTrader 8",
    languages: "English, German, Spanish",
    programmingLang: "C# / NinjaScript",
    license: "Free (basic), $99/mo or $1,499 lifetime",
    operatingSystems: "Windows (64-bit), Web, Mobile",
    website: "https://ninjatrader.com",
  },
  specs: {
    headers: ["Feature", "Details"],
    rows: [
      ["Chart Types", "Candlestick, Bar, Line, Point & Figure, Renko, Kagi"],
      ["Timeframes", "Tick, Volume, Range, Time-based (fully customizable)"],
      ["Built-in Indicators", "100+"],
      ["Custom Indicators", "Unlimited (C# / NinjaScript)"],
      ["SuperDOM", "Yes — one-click order entry with depth of market"],
      ["Market Replay", "Yes — replay historical sessions for practice"],
      ["Backtesting", "Yes — Strategy Analyzer with optimization"],
      ["Automation", "Full automated strategy execution via NinjaScript"],
      ["Day Trade Margins", "$50 micro, $500 E-mini S&P 500"],
      ["Supported Brokers", "NinjaTrader, AMP, Optimus, Dorman, Phillip Capital"],
    ],
  },
  brokers: [
    { name: "NinjaTrader", slug: "ninjatrader", note: "Native — lowest commissions from $0.09/micro", score: 8.3 },
    { name: "AMP Futures", slug: "amp-futures", note: "50+ platforms including NinjaTrader", score: 8.0 },
    { name: "Optimus Futures", slug: "optimus-futures", note: "Multi-platform with personal support", score: 7.8 },
  ],
  sections: [
    {
      title: "What is NinjaTrader?",
      content: "NinjaTrader is the leading futures trading platform, purpose-built for active day traders and scalpers. Its flagship feature — SuperDOM — provides one-click order entry directly from the depth-of-market ladder. The platform supports C#-based custom indicators (NinjaScript), automated strategies, backtesting, and Market Replay for risk-free practice.",
    },
    {
      title: "Key Features",
      content: "SuperDOM is NinjaTrader's defining feature — a depth-of-market ladder that allows one-click order placement, modification, and cancellation. Market Replay lets you replay historical trading sessions to practice strategies. The Strategy Analyzer provides backtesting with walk-forward optimization. Day trade margins start at $50 for micro futures.",
    },
    {
      title: "Who Should Use NinjaTrader?",
      content: "NinjaTrader is ideal for futures day traders and scalpers who need fast order entry, low margins, and the ability to create custom indicators. The C# programming requirement for advanced customization means it's best suited for technically-inclined traders. The free plan is sufficient for most beginners.",
    },
  ],
  pros: [
    "SuperDOM — best depth-of-market tool for futures scalping",
    "C# / NinjaScript — professional-grade custom indicator development",
    "Market Replay — practice with historical data risk-free",
    "$50 micro day trade margins — most accessible in the industry",
    "Free plan available — no platform cost to start",
  ],
  cons: [
    "Windows-only desktop application — no native Mac support",
    "Futures-only — no stocks or options trading on NinjaTrader platform",
    "C# programming knowledge needed for advanced customization",
    "Lifetime license costs $1,499 upfront",
    "Acquired by Kraken — future direction uncertain",
  ],
  faq: [
    { q: "Is NinjaTrader free?", a: "The basic plan is free with higher commissions. Paid plans ($99/mo or $1,499 lifetime) reduce commissions significantly." },
    { q: "Can I use NinjaTrader on Mac?", a: "Not natively. NinjaTrader Desktop requires Windows. Mac users can use Parallels, Boot Camp, or the web/mobile versions." },
    { q: "What brokers support NinjaTrader?", a: "NinjaTrader (native), AMP Futures, Optimus Futures, Dorman Trading, and Phillip Capital all support the NinjaTrader platform." },
  ],
};

export default ninjatraderPlatform;
