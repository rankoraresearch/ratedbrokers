const data = {
  name: "Italy", slug: "italy", code: "IT", flag: "🇮🇹",
  regulator: "CONSOB", regulatorFull: "Commissione Nazionale per le Società e la Borsa",
  regulatorUrl: "https://www.consob.it", currency: "EUR",
  leverage: "1:30", leverageNote: "Retail (ESMA rules via CONSOB)",
  compensation: "ICF — €20,000 per person",
  negativeBalance: "Yes — mandatory under ESMA/CONSOB rules",
  taxNote: "CFD profits are subject to 26% substitute tax (imposta sostitutiva) on capital gains.",
  localPayments: ["Bank Transfer (SEPA)", "Visa/Mastercard", "PayPal", "Skrill", "Neteller", "PostePay"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 46, localBrokersTotal: 30, hoursResearch: 85,
  author: { name: "Marco Rossi", role: "Mediterranean Markets Specialist", exp: "15 years", initials: "MR", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Italy for 2026 — CONSOB Regulated",
  metaDescription: "We analyzed 30 CONSOB-registered brokers for Italian traders. These 10 offer the best trading conditions including EUR accounts, ESMA protection, and Italian-language support.",
  keyFinding: "CONSOB-registered brokers provide strong trader protection under Italian and ESMA regulations. All top 5 brokers for Italy offer Italian-language platforms, EUR accounts, and full ESMA compliance — essential for retail traders in one of Europe's largest CFD markets.",

  brokers: [
    { rank: 1, slug: "ig", badge: "Best Overall Italy", badgeColor: "#059669", localCurrencyMin: "€300", verdict: "Best overall for Italian traders. CONSOB-registered with 50 years of experience, 17,000+ markets and full Italian support.", localAdvantages: ["CONSOB-registered, FCA-regulated", "17,000+ markets including Borsa Italiana", "EUR base account — no conversion fees", "Italian-language platform and support", "50+ years of market experience"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Best Execution", badgeColor: "#6d28d9", localCurrencyMin: "€0", verdict: "Tightest spreads and fastest execution. CySEC-regulated with CONSOB registration, ideal for active Italian traders.", localAdvantages: ["CySEC-regulated, CONSOB-registered", "EUR base account available", "0.0 pip raw spreads from €3.50/lot", "TradingView + cTrader + MT4/5", "No minimum deposit required"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "€0", verdict: "Award-winning xStation 5 with comprehensive Italian-language education. No minimum deposit.", localAdvantages: ["CySEC-regulated, CONSOB-registered", "xStation 5 — award-winning platform", "0% commission stocks up to €100K/mo", "Full Italian-language education center", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "€100", verdict: "Most popular social trading platform in Italy. Copy trading feature and fractional shares from €10.", localAdvantages: ["CySEC-regulated, CONSOB-registered", "Copy Trading — follow top traders", "Fractional shares from €10", "EUR deposits via SEPA free", "Very popular in Italy — large community"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "€100", verdict: "Lowest ECN commission with strong CySEC regulation. Excellent value for cost-conscious Italian traders.", localAdvantages: ["CySEC-regulated, EU-passported", "EUR base account", "Lowest ECN commission at $6/lot RT", "cTrader + TradingView access", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "xm", badge: "Best for Beginners", badgeColor: "#d97706", localCurrencyMin: "€5", verdict: "Lowest minimum deposit at €5 with excellent Italian-language education and webinars.", localAdvantages: ["CySEC-regulated, CONSOB-registered", "€5 minimum deposit — lowest tested", "1,000+ instruments available", "Free webinars in Italian", "Loyalty program with trading rewards"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "plus500", badge: null, badgeColor: null, localCurrencyMin: "€100", verdict: "Simple, intuitive platform popular with Italian traders. Listed on London Stock Exchange.", localAdvantages: ["CySEC-regulated, CONSOB-registered", "LSE-listed (LON:PLUS)", "Simple proprietary platform", "Italian-language support", "EUR base account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "€200", verdict: "Tightest raw spreads at 0.02 pips. Best for Italian traders focused on execution quality.", localAdvantages: ["CySEC-regulated, EU-passported", "0.02 pip average EUR/USD spread", "EUR base account available", "cTrader + TradingView support", "25+ tier-1 liquidity providers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "capital-com", badge: null, badgeColor: null, localCurrencyMin: "€20", verdict: "AI-powered trading insights with low minimum deposit. Growing in popularity in Italy.", localAdvantages: ["CySEC-regulated, CONSOB-registered", "AI-powered trading signals", "Low €20 minimum deposit", "6,000+ markets available", "Italian-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "admirals", badge: null, badgeColor: null, localCurrencyMin: "€100", verdict: "Solid all-rounder with MetaTrader Supreme Edition and diversified account types.", localAdvantages: ["CySEC-regulated, EU-passported", "MetaTrader Supreme Edition free", "EUR base account", "Invest.MT5 for real stocks", "Educational content in Italian"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How CONSOB Protects Italian Traders",
    items: [
      { icon: "shield", title: "CONSOB Registration Required", desc: "Any broker offering services to Italian residents must be registered with CONSOB or operate under an EU passport. Verify any broker at consob.it before opening an account." },
      { icon: "piggy-bank", title: "ICF Compensation — €20,000", desc: "The Investor Compensation Fund (Fondo Nazionale di Garanzia) covers up to €20,000 per person if a CONSOB-registered broker becomes insolvent." },
      { icon: "scale", title: "Negative Balance Protection", desc: "Under ESMA rules enforced by CONSOB, retail traders can never lose more than their deposit. Brokers must reset negative balances to zero." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:30 Retail", desc: "ESMA limits retail leverage to 1:30 for major forex pairs, 1:20 for minor pairs, 1:10 commodities, 1:5 equities, and 1:2 crypto." },
      { icon: "ban", title: "Unauthorized Broker Warnings", desc: "CONSOB regularly publishes warnings about unauthorized brokers and has the power to block websites of illegal operators targeting Italian investors." },
      { icon: "clipboard-list", title: "Standardized Risk Warnings", desc: "CONSOB-registered brokers must display the percentage of retail accounts that lose money and provide risk documentation in Italian." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Italy?", a: "Forex and CFD profits in Italy are subject to a 26% substitute tax (imposta sostitutiva) on capital gains. This applies to all financial instrument gains including forex, CFDs, stocks, and ETFs." },
    { q: "Do I Need to File a Tax Return for Trading?", a: "Yes. Italian traders must report trading income on their annual Modello Redditi (formerly Unico). If your broker is Italian or has an Italian branch, they may act as a tax substitute (sostituto d'imposta). Otherwise, you must self-declare using the 'dichiarativo' regime." },
    { q: "Can I Offset Trading Losses in Italy?", a: "Yes. Capital losses can be offset against capital gains of the same type over a 4-year carry-forward period. Losses from forex can offset gains from other financial instruments under the 'redditi diversi' category." },
    { q: "Is There an IVAFE Tax on Foreign Accounts?", a: "Yes. Italian residents holding financial assets abroad must pay IVAFE (Imposta sul Valore delle Attività Finanziarie detenute all'Estero) of 0.2% per year on the account value, plus declare these accounts in the RW section of their tax return." },
  ],

  payments: [
    { method: "SEPA Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 days", note: "Standard" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit & credit" },
    { method: "PostePay", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Popular in Italy" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Widely used" },
  ],

  guide: [
    { q: "How to Verify a CONSOB-Registered Broker", a: "Visit consob.it and search the register of authorized firms. You can search by broker name or registration number. Also check CONSOB's warning list for unauthorized operators." },
    { q: "Dichiarativo vs Amministrato Tax Regime", a: "Italian traders can choose between two tax regimes: 'amministrato' (broker handles taxes as substitute) or 'dichiarativo' (self-declaration). Most international brokers require dichiarativo, meaning you calculate and pay taxes yourself." },
    { q: "What Happens If My Broker Goes Bankrupt?", a: "Client funds at EU-regulated brokers must be held in segregated accounts. The ICF covers up to €20,000 per investor. For CySEC-regulated brokers, the same €20,000 limit applies via the Cyprus ICF." },
    { q: "Can Italian Traders Use Non-EU Brokers?", a: "Strongly discouraged. Non-EU brokers lack ESMA protections and are not supervised by CONSOB. Italy has been aggressive in blocking unauthorized broker websites." },
  ],

  faq: [
    { q: "What is the best forex broker in Italy for 2026?", a: "IG is our top pick for Italian traders in 2026. It's CONSOB-registered, offers 17,000+ markets, EUR accounts, and full Italian-language support." },
    { q: "Are forex profits taxable in Italy?", a: "Yes. Forex profits are subject to a 26% substitute tax on capital gains. Foreign accounts also incur a 0.2% annual IVAFE tax." },
    { q: "Is forex trading legal in Italy?", a: "Yes, forex trading is fully legal in Italy. Brokers must be registered with CONSOB or authorized under EU passporting rules." },
    { q: "What leverage can Italian traders use?", a: "Under ESMA rules enforced by CONSOB, retail clients are limited to 1:30 on major forex pairs, 1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto." },
    { q: "Do I need to pay IVAFE on my trading account?", a: "If your trading account is held with a foreign broker (non-Italian), yes — you must pay 0.2% IVAFE annually on the account value and declare it in the RW section." },
    { q: "What is the minimum deposit for forex trading in Italy?", a: "Minimum deposits range from €0 (Pepperstone, XTB) to €300 (IG). XM offers the lowest at just €5." },
    { q: "Which brokers offer Italian-language support?", a: "All of our top 10 brokers offer Italian-language platforms and/or customer support: IG, Pepperstone, XTB, eToro, XM, Plus500, and Capital.com all have dedicated Italian support." },
    { q: "Can I trade on Borsa Italiana through these brokers?", a: "Yes. IG, Saxo Bank, and XTB offer direct access to Borsa Italiana stocks and ETFs. Other brokers offer Italian equity CFDs." },
  ],

  related: [
    { name: "Best EU-Regulated Brokers", icon: "🇪🇺", count: 15, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best for Beginners", icon: "graduation-cap", count: 10, url: "#" },
    { name: "Brokers in France", icon: "🇫🇷", count: 10, url: "/best-forex-brokers-france" },
    { name: "Brokers in Spain", icon: "🇪🇸", count: 10, url: "/best-forex-brokers-spain" },
    { name: "Brokers in Germany", icon: "🇩🇪", count: 9, url: "/best-forex-brokers-germany" },
  ],
};

export default data;
