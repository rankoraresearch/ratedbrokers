const data = {
  name: "Spain", slug: "spain", code: "ES", flag: "🇪🇸",
  regulator: "CNMV", regulatorFull: "Comisión Nacional del Mercado de Valores",
  regulatorUrl: "https://www.cnmv.es", currency: "EUR",
  leverage: "1:30", leverageNote: "Retail (ESMA rules via CNMV)",
  compensation: "FOGAIN — €100,000 per person",
  negativeBalance: "Yes — mandatory under ESMA/CNMV rules",
  taxNote: "CFD profits are subject to savings income tax (impuesto sobre el ahorro) at progressive rates from 19% to 28%.",
  localPayments: ["Bank Transfer (SEPA)", "Visa/Mastercard", "PayPal", "Skrill", "Neteller"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 44, localBrokersTotal: 29, hoursResearch: 84,
  author: { name: "Carlos García", role: "Iberian Markets Analyst", exp: "13 years", initials: "CG", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Spain for 2026 — CNMV Regulated",
  metaDescription: "We tested 29 CNMV-registered brokers with real EUR accounts. These 10 offer the best trading conditions for Spanish traders including FOGAIN protection, EUR accounts, and ESMA-compliant leverage.",
  keyFinding: "CNMV-registered brokers offer some of the strongest investor protection in Europe. Spain's FOGAIN compensation scheme covers up to €100,000 — one of the highest in the EU. All our top 5 brokers provide Spanish-language support and EUR accounts.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall Spain", badgeColor: "#059669", localCurrencyMin: "€0", verdict: "Best overall for Spanish traders. CySEC-regulated with CNMV registration, offering the tightest spreads and no minimum deposit.", localAdvantages: ["CySEC-regulated, CNMV-registered", "EUR base account — no conversion fees", "0.0 pip raw spreads available", "TradingView + cTrader + MT4/5", "Spanish-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "ig", badge: "Most Trusted", badgeColor: "#6d28d9", localCurrencyMin: "€300", verdict: "Most trusted broker in Spain. 50 years of operation, with Madrid office and 17,000+ markets.", localAdvantages: ["FCA-regulated, CNMV-registered", "Madrid office with local team", "17,000+ markets including BME", "EUR base account", "Spanish-language platform"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "€0", verdict: "Award-winning xStation 5 with excellent Spanish-language education. Madrid office, very popular in Spain.", localAdvantages: ["CNMV-regulated directly — Madrid office", "xStation 5 — award-winning platform", "0% commission stocks up to €100K/mo", "Extensive Spanish education center", "No minimum deposit required"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "€100", verdict: "Most popular social trading platform in Spain. Copy trading and fractional shares for beginners.", localAdvantages: ["CySEC-regulated, CNMV-registered", "Copy Trading — follow top traders", "Fractional shares from €10", "EUR deposits via SEPA free", "Very popular in Spain"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "saxo-bank", badge: "Best Multi-Asset", badgeColor: "#1e293b", localCurrencyMin: "€500", verdict: "Premium platform with 72,000+ instruments. Ideal for experienced Spanish traders and investors.", localAdvantages: ["Danish bank, CNMV-registered", "72,000+ instruments", "Direct access to BME stocks", "Professional research team", "EUR accounts with SEPA"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "xm", badge: "Best for Beginners", badgeColor: "#d97706", localCurrencyMin: "€5", verdict: "Lowest minimum deposit at €5. Excellent education and webinars in Spanish.", localAdvantages: ["CySEC-regulated, CNMV-registered", "€5 minimum deposit", "1,000+ instruments", "Free webinars in Spanish", "EUR base account"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "€200", verdict: "Tightest raw spreads in our test at 0.02 pips. Best for Spanish traders focused on execution.", localAdvantages: ["CySEC-regulated, EU-passported", "0.02 pip average EUR/USD spread", "EUR base account available", "cTrader + TradingView", "25+ tier-1 liquidity providers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "€100", verdict: "Lowest ECN commission among top brokers. Strong value for cost-conscious Spanish traders.", localAdvantages: ["CySEC-regulated, EU-passported", "EUR base account", "Low ECN commission at $6/lot RT", "cTrader + TradingView access", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "plus500", badge: null, badgeColor: null, localCurrencyMin: "€100", verdict: "Simple platform popular in Spain. LSE-listed with full Spanish-language support.", localAdvantages: ["CySEC-regulated, CNMV-registered", "LSE-listed (LON:PLUS)", "Simple proprietary platform", "Full Spanish-language support", "EUR base account"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "admirals", badge: null, badgeColor: null, localCurrencyMin: "€100", verdict: "Versatile all-rounder with MetaTrader Supreme Edition and multiple account types.", localAdvantages: ["CySEC-regulated, EU-passported", "MetaTrader Supreme Edition free", "EUR base account", "Invest.MT5 for real stocks", "Spanish-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How the CNMV Protects Spanish Traders",
    items: [
      { icon: "shield", title: "CNMV Registration Required", desc: "Any broker offering services to Spanish residents must be registered with the CNMV or authorized under EU passporting. Verify any broker at cnmv.es before depositing funds." },
      { icon: "piggy-bank", title: "FOGAIN Compensation — €100,000", desc: "The Fondo General de Garantía de Inversiones covers up to €100,000 per investor if a CNMV-registered broker becomes insolvent — one of the highest protection levels in the EU." },
      { icon: "scale", title: "Negative Balance Protection", desc: "Under ESMA rules enforced by the CNMV, retail traders can never lose more than their deposit. Brokers must absorb any negative balance." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:30 Retail", desc: "ESMA limits retail leverage to 1:30 for major forex pairs, 1:20 for minor pairs, 1:10 commodities, 1:5 equities, 1:2 crypto." },
      { icon: "ban", title: "CFD Advertising Restrictions", desc: "Spain has strict rules on CFD advertising. The CNMV requires pre-approval of marketing materials and has imposed restrictions on social media promotions targeting retail investors." },
      { icon: "clipboard-list", title: "Risk Warnings in Spanish", desc: "CNMV-registered brokers must display standardized risk warnings in Spanish, including the percentage of retail accounts that lose money when trading CFDs." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Spain?", a: "Forex and CFD profits in Spain are classified as savings income (rendimientos del ahorro) and taxed at progressive rates: 19% (first €6,000), 21% (€6,001–€50,000), 23% (€50,001–€200,000), and 28% (above €200,000)." },
    { q: "Can I Offset Trading Losses?", a: "Yes. Capital losses from forex trading can be offset against capital gains in the same tax year. Unused losses can be carried forward for 4 years. Losses from derivatives can offset gains from other financial instruments." },
    { q: "Do I Need to Declare Foreign Broker Accounts?", a: "Yes. Spanish residents must declare foreign assets exceeding €50,000 using Modelo 720. This includes trading accounts held with non-Spanish brokers. Failure to declare can result in significant penalties." },
    { q: "Is There a Wealth Tax (Impuesto sobre el Patrimonio)?", a: "Yes. Spain applies a wealth tax on net assets above €700,000 (varies by region). Trading account balances are included. Some regions like Madrid have historically exempted residents, but a solidarity tax applies nationally above €3M." },
  ],

  payments: [
    { method: "SEPA Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 days", note: "Standard" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit & credit" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Popular in Spain" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free–€5", time: "Instant / 1d", note: "E-wallet" },
  ],

  guide: [
    { q: "How to Verify a CNMV-Registered Broker", a: "Visit cnmv.es and use the register search to find the broker by name or registration number. Check that the firm is authorized to provide investment services in Spain. The CNMV also publishes a list of unauthorized entities." },
    { q: "Modelo 720: Declaring Foreign Trading Accounts", a: "Spanish residents must file Modelo 720 to declare foreign assets above €50,000. This includes trading accounts held outside Spain. File by March 31 each year. Only report when first exceeding the threshold or when values increase by more than €20,000." },
    { q: "What Happens If My Broker Goes Bankrupt?", a: "Client funds must be held in segregated accounts. FOGAIN covers up to €100,000 per investor for Spanish-authorized brokers. For CySEC-regulated brokers operating via passport, the Cyprus ICF covers up to €20,000." },
    { q: "Can Spanish Traders Use Non-EU Brokers?", a: "Not recommended. Non-EU brokers lack ESMA protections and are not overseen by the CNMV. Spain has strict rules against unauthorized brokers and has blocked several offshore operator websites." },
  ],

  faq: [
    { q: "What is the best forex broker in Spain for 2026?", a: "Pepperstone is our top pick for Spanish traders in 2026. It's CNMV-registered, offers EUR accounts, zero minimum deposit, and the tightest spreads in our test." },
    { q: "Are forex profits taxable in Spain?", a: "Yes. Forex profits are classified as savings income and taxed at progressive rates from 19% to 28% depending on the amount." },
    { q: "Is forex trading legal in Spain?", a: "Yes, forex trading is fully legal. Brokers must be registered with the CNMV or authorized under EU passporting rules." },
    { q: "What leverage can Spanish traders use?", a: "Under ESMA rules enforced by the CNMV, retail clients are limited to 1:30 on major forex pairs, 1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto." },
    { q: "Do I need to file Modelo 720?", a: "If you hold trading accounts outside Spain worth more than €50,000 in total, yes — you must file Modelo 720 by March 31 each year." },
    { q: "What is the FOGAIN?", a: "FOGAIN (Fondo General de Garantía de Inversiones) is Spain's investor compensation scheme, covering up to €100,000 per investor if an authorized broker becomes insolvent." },
    { q: "What is the minimum deposit for forex trading in Spain?", a: "Minimum deposits range from €0 (Pepperstone, XTB) to €500 (Saxo Bank). XM offers the lowest at just €5." },
    { q: "Which brokers have offices in Spain?", a: "XTB has a Madrid office with direct CNMV regulation. IG also has a Madrid presence. Most other top brokers operate via EU passporting with Spanish-language remote support." },
  ],

  related: [
    { name: "Best EU-Regulated Brokers", icon: "🇪🇺", count: 15, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best for Beginners", icon: "graduation-cap", count: 10, url: "#" },
    { name: "Brokers in France", icon: "🇫🇷", count: 10, url: "/best-forex-brokers-france" },
    { name: "Brokers in Italy", icon: "🇮🇹", count: 10, url: "/best-forex-brokers-italy" },
    { name: "Brokers in UK", icon: "🇬🇧", count: 10, url: "/best-forex-brokers-uk" },
  ],
};

export default data;
