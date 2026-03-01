const data = {
  name: "Austria", slug: "austria", code: "AT", flag: "🇦🇹",
  regulator: "FMA", regulatorFull: "Finanzmarktaufsicht",
  regulatorUrl: "https://www.fma.gv.at", currency: "EUR",
  leverage: "1:30", leverageNote: "Retail (ESMA rules via FMA)",
  compensation: "AeW — €20,000 per person",
  negativeBalance: "Yes — mandatory under ESMA/FMA rules",
  taxNote: "CFD profits are subject to 27.5% capital gains tax (Kapitalertragsteuer / KESt).",
  localPayments: ["Bank Transfer (SEPA)", "Visa/Mastercard", "eps-Überweisung", "PayPal", "Skrill"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 38, localBrokersTotal: 22, hoursResearch: 78,
  author: { name: "Maximilian Huber", role: "DACH Markets Specialist", exp: "12 years", initials: "MH", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "9 Best Forex Brokers in Austria for 2026 — FMA Regulated",
  metaDescription: "We tested 22 FMA-registered brokers with real EUR accounts. These 9 offer the best conditions for Austrian traders including EUR accounts, ESMA protection, and eps-Überweisung support.",
  keyFinding: "Austrian traders benefit from FMA oversight and ESMA protections while having access to major EU-passported brokers. German-language support is widely available across top brokers, and eps-Überweisung enables instant EUR deposits for seamless account funding.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall Austria", badgeColor: "#059669", localCurrencyMin: "€0", verdict: "Best overall for Austrian traders. CySEC-regulated with FMA registration, tightest spreads and no minimum deposit.", localAdvantages: ["CySEC-regulated, FMA-registered", "EUR base account — no conversion fees", "0.0 pip raw spreads from €3.50/lot", "TradingView + cTrader + MT4/5", "German-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "ig", badge: "Most Trusted", badgeColor: "#6d28d9", localCurrencyMin: "€300", verdict: "Most trusted broker available in Austria. BaFin & FCA regulated with 50 years of experience.", localAdvantages: ["BaFin & FCA regulated, FMA-registered", "50+ years of operation", "17,000+ markets including Vienna Stock Exchange", "EUR base account", "German-language platform"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "€0", verdict: "Award-winning xStation 5 platform with no minimum deposit. Excellent German-language education and support.", localAdvantages: ["CySEC-regulated, FMA-registered", "xStation 5 — award-winning platform", "0% commission stocks up to €100K/mo", "German-language education center", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "saxo-bank", badge: "Best Multi-Asset", badgeColor: "#1e293b", localCurrencyMin: "€500", verdict: "Premium multi-asset platform with 72,000+ instruments. Ideal for experienced Austrian investors.", localAdvantages: ["Danish bank, FMA-registered", "72,000+ instruments", "Direct access to Wiener Börse", "Professional research", "EUR accounts with SEPA"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "€100", verdict: "Best social trading for Austrian beginners. Copy trading and fractional shares with EUR deposits.", localAdvantages: ["CySEC-regulated, FMA-registered", "Copy Trading — follow top traders", "Fractional shares from €10", "EUR deposits via SEPA free", "German-language platform"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "€200", verdict: "Tightest raw spreads at 0.02 pips. Best for Austrian traders prioritizing execution quality.", localAdvantages: ["CySEC-regulated, EU-passported", "0.02 pip average EUR/USD spread", "EUR base account", "cTrader + TradingView", "25+ tier-1 liquidity providers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "xm", badge: "Best for Beginners", badgeColor: "#d97706", localCurrencyMin: "€5", verdict: "Lowest minimum deposit at €5 with German-language webinars. Ideal starting point for new Austrian traders.", localAdvantages: ["CySEC-regulated, FMA-registered", "€5 minimum deposit", "1,000+ instruments", "Free webinars in German", "EUR base account"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "€100", verdict: "Lowest ECN commission at $6/lot RT. Strong value for cost-conscious Austrian traders.", localAdvantages: ["CySEC-regulated, EU-passported", "Low ECN commission at $6/lot RT", "EUR base account", "cTrader + TradingView access", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "admirals", badge: null, badgeColor: null, localCurrencyMin: "€100", verdict: "Solid all-rounder with MetaTrader Supreme Edition and German-language support.", localAdvantages: ["CySEC-regulated, EU-passported", "MetaTrader Supreme Edition free", "EUR base account", "Invest.MT5 for real stocks", "German-language support team"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How the FMA Protects Austrian Traders",
    items: [
      { icon: "shield", title: "FMA Registration Required", desc: "Any broker offering services to Austrian residents must be registered with the FMA or authorized under EU passporting. Verify any broker at fma.gv.at before depositing funds." },
      { icon: "piggy-bank", title: "AeW Compensation — €20,000", desc: "The Anlegerentschädigung von Wertpapierfirmen covers up to €20,000 per investor (90% of claims) if an FMA-registered broker becomes insolvent." },
      { icon: "scale", title: "Negative Balance Protection", desc: "Under ESMA rules enforced by the FMA, retail traders can never lose more than their deposit. Brokers must absorb any negative balance." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:30 Retail", desc: "ESMA limits retail leverage to 1:30 for major forex pairs, 1:20 for minor pairs, 1:10 commodities, 1:5 equities, 1:2 crypto." },
      { icon: "ban", title: "FMA Warning List", desc: "The FMA maintains a public warning list (Investorenwarnungen) of unauthorized companies. Austrian traders should check this list before opening any trading account." },
      { icon: "clipboard-list", title: "German-Language Requirements", desc: "FMA-registered brokers must provide key information documents and risk warnings in German. Complaints can be filed in German through the FMA's consumer information service." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Austria?", a: "Forex and CFD profits in Austria are subject to 27.5% capital gains tax (Kapitalertragsteuer / KESt). This flat rate applies to all realized gains from financial instruments including forex, CFDs, stocks, and bonds." },
    { q: "Is KESt Withheld Automatically?", a: "For Austrian-domiciled brokers, KESt is withheld automatically at source. For foreign brokers (which includes most forex brokers), you must self-declare capital gains in your annual tax return (Einkommensteuererklärung) using Form E1." },
    { q: "Can I Offset Trading Losses?", a: "Yes. Capital losses from forex trading can be offset against capital gains from other financial instruments (stocks, bonds, etc.) within the same tax year. Losses cannot be carried forward to future years for individuals." },
    { q: "Do I Need to Declare Foreign Broker Accounts?", a: "Yes. Austrian residents must declare all foreign financial assets and income. Under the automatic exchange of information (CRS), foreign broker accounts are reported to Austrian tax authorities. Failure to declare can result in penalties." },
  ],

  payments: [
    { method: "eps-Überweisung", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "Best for Austria" },
    { method: "SEPA Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 days", note: "Standard" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit & credit" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Widely used" },
  ],

  guide: [
    { q: "How to Verify an FMA-Registered Broker", a: "Visit fma.gv.at and search the company database (Unternehmensdatenbank). Check the broker's registration status and authorized activities. Also check the FMA's investor warnings (Investorenwarnungen) list." },
    { q: "eps-Überweisung: Instant Austrian Deposits", a: "eps-Überweisung is Austria's online payment system for instant EUR transfers. Many top brokers accept eps for deposits, making funding seamless for Austrian traders." },
    { q: "Austrian vs German Brokers: Differences", a: "Austria and Germany share the German language but have different regulators (FMA vs BaFin). Many brokers register with both. Austrian traders also have access to all EU-passported brokers. Tax treatment differs slightly between countries." },
    { q: "Understanding KESt for Austrian Traders", a: "Austria's 27.5% KESt is automatically withheld by Austrian brokers but must be self-declared for foreign brokers. Keep detailed records of all trades for your annual tax return." },
    { q: "Can Austrian Traders Use Non-EU Brokers?", a: "Not recommended. Non-EU brokers lack ESMA protections and are not supervised by the FMA. Austria actively cooperates with other EU regulators to protect consumers from unauthorized firms." },
  ],

  faq: [
    { q: "What is the best forex broker in Austria for 2026?", a: "Pepperstone is our top pick for Austrian traders in 2026. FMA-registered, it offers EUR base accounts, the tightest spreads, no minimum deposit, and German-language support." },
    { q: "Are forex profits taxable in Austria?", a: "Yes. Forex profits are subject to 27.5% Kapitalertragsteuer (KESt). Self-declaration is required for foreign broker accounts." },
    { q: "Is forex trading legal in Austria?", a: "Yes, forex trading is fully legal. The FMA oversees financial services in Austria, including forex brokers." },
    { q: "What leverage can Austrian traders use?", a: "Under ESMA rules enforced by the FMA, retail clients are limited to 1:30 on major forex pairs, 1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto." },
    { q: "Can I trade on the Vienna Stock Exchange?", a: "Yes. IG and Saxo Bank offer direct access to the Wiener Börse. Other brokers offer Austrian equity CFDs." },
    { q: "Which brokers accept eps-Überweisung?", a: "Several top brokers accept eps for instant EUR deposits, including some of our top-ranked options. Check individual broker pages for current eps support." },
    { q: "What is the minimum deposit for forex trading in Austria?", a: "Minimum deposits range from €0 (Pepperstone, XTB) to €500 (Saxo Bank). XM offers the lowest at €5." },
    { q: "Do Austrian brokers withhold KESt?", a: "Austrian-domiciled brokers withhold KESt automatically. For foreign brokers (most in this list), you must self-declare gains on your annual tax return using Form E1." },
  ],

  related: [
    { name: "Best EU-Regulated Brokers", icon: "🇪🇺", count: 15, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best for Beginners", icon: "graduation-cap", count: 10, url: "#" },
    { name: "Brokers in Germany", icon: "🇩🇪", count: 9, url: "/best-forex-brokers-germany" },
    { name: "Brokers in Switzerland", icon: "🇨🇭", count: 8, url: "/best-forex-brokers-switzerland" },
    { name: "Brokers in UK", icon: "🇬🇧", count: 10, url: "/best-forex-brokers-uk" },
  ],
};

export default data;
