const data = {
  name: "Romania", slug: "romania", code: "RO", flag: "🇷🇴",
  regulator: "ASF", regulatorFull: "Autoritatea de Supraveghere Financiară",
  regulatorUrl: "https://asfromania.ro", currency: "RON",
  leverage: "1:30", leverageNote: "Retail (ESMA rules, 1:500 for Professional)",
  compensation: "ICF — up to €20,000 per investor",
  negativeBalance: "Yes — mandatory under ESMA rules",
  localPayments: ["Bank Transfer (RON)", "Visa/Mastercard", "Skrill", "Neteller"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 36, localBrokersTotal: 20, hoursResearch: 68,
  author: { name: "Sophia Papadimitriou", role: "European Markets Analyst", exp: "12 years", initials: "SP", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Romania for 2026 — ASF & CySEC Regulated",
  metaDescription: "We analyzed 20 brokers accepting Romanian traders. These 10 offer ESMA-compliant trading, ICF protection, and competitive conditions for Romanian forex traders.",
  keyFinding: "Romanian traders benefit from EU-wide ESMA protections through ASF regulation and CySEC-passported brokers. While Romania uses RON, most traders prefer EUR-denominated accounts to avoid conversion costs. XTB maintains a strong local presence with a Bucharest office.",

  brokers: [
    { rank: 1, slug: "xtb", badge: "Best Overall Romania", badgeColor: "#059669", localCurrencyMin: "€0", verdict: "Best for Romanian traders. ASF-authorized with Bucharest office, xStation platform, and zero-commission stocks.", localAdvantages: ["ASF-authorized in Romania", "Bucharest office — local presence", "xStation 5 platform", "0% commission stocks", "Romanian-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "€0", verdict: "Tightest raw spreads for Romanian traders. CySEC-regulated with ESMA protections.", localAdvantages: ["CySEC-regulated (EU passport)", "Raw ECN from 0.0 pips", "EUR base account", "SEPA deposits — free", "cTrader + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "ic-markets", badge: "Best Execution", badgeColor: "#6d28d9", localCurrencyMin: "€200", verdict: "Best execution quality for Romanian traders. 0.02 pip average EUR/USD.", localAdvantages: ["CySEC-regulated", "0.02 pip average EUR/USD", "EUR base account", "25+ liquidity providers", "cTrader + MetaTrader"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "€5", verdict: "Ultra-low €5 minimum with Romanian education content. CySEC-regulated.", localAdvantages: ["€5 minimum deposit", "Romanian-language content", "CySEC-regulated", "Micro lot trading", "Free webinars"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "€50", verdict: "Copy successful traders with a simple interface. Popular among Romanian beginners.", localAdvantages: ["Copy Trading feature", "CySEC-regulated", "ICF protection", "Fractional shares", "SEPA deposits free"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "€100", verdict: "Lowest ECN commission with competitive pricing for Romanian traders.", localAdvantages: ["ECN commission $6/lot RT", "CySEC-regulated", "cTrader + TradingView", "EUR base account", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "plus500", badge: "Most Simple", badgeColor: "#059669", localCurrencyMin: "€100", verdict: "Simple CFD platform ideal for Romanian beginners. EU-regulated.", localAdvantages: ["CySEC-regulated", "Simple interface", "SEPA deposits", "ICF protection", "LSE-listed"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "admirals", badge: null, badgeColor: null, localCurrencyMin: "€25", verdict: "Strong education with MetaTrader Supreme Edition for Romanian traders.", localAdvantages: ["CySEC-regulated", "MetaTrader Supreme Edition", "Educational content", "EUR base account", "Low minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "saxo-bank", badge: "Best for Professionals", badgeColor: "#1e293b", localCurrencyMin: "€200", verdict: "Premium multi-asset platform for wealthy Romanian investors. 72,000+ instruments.", localAdvantages: ["72,000+ instruments", "Licensed Danish bank", "DMA stock access", "Premium research", "Professional accounts"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "capital-com", badge: null, badgeColor: null, localCurrencyMin: "€20", verdict: "AI-powered insights with TradingView integration for Romanian traders.", localAdvantages: ["AI-powered insights", "CySEC-regulated", "TradingView integration", "Low minimum deposit", "Educational content"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How ASF & ESMA Protect Romanian Traders",
    items: [
      { icon: "shield", title: "ASF Regulation", desc: "Autoritatea de Supraveghere Financiară (ASF) is Romania's financial supervisory authority. ASF regulates local investment firms and enforces ESMA rules for all EU-passported brokers operating in Romania." },
      { icon: "piggy-bank", title: "ICF Compensation — €20,000", desc: "Romania's Investor Compensation Fund covers up to €20,000 per investor (99% of first €18,000 + 90% of next €2,000) if an authorized broker becomes insolvent." },
      { icon: "scale", title: "Negative Balance Protection", desc: "ESMA rules guarantee Romanian retail traders cannot lose more than their deposit. All EU-regulated brokers must absorb negative balances." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:30", desc: "ESMA limits retail leverage to 1:30 for major forex (1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto). Professional clients can access higher leverage." },
      { icon: "ban", title: "No Bonuses Permitted", desc: "ESMA prohibits trading bonuses and financial incentives for retail clients in the EU, protecting Romanian traders from predatory marketing." },
      { icon: "clipboard-list", title: "MiFID II Passporting", desc: "CySEC and other EU-regulated brokers can serve Romanian clients through MiFID II passporting, providing the same protections as locally authorized firms." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Romania?", a: "Forex trading profits in Romania are subject to a flat 10% income tax on capital gains. This applies to profits from CFDs, forex, and other financial instruments. The tax must be declared and paid annually." },
    { q: "Do I Need to File a Tax Return?", a: "Yes, Romanian residents must declare capital gains from forex trading in their annual tax return (Declarația Unică) to ANAF (Agenția Națională de Administrare Fiscală). The filing deadline is typically May 25." },
    { q: "Is There a Health Insurance Contribution?", a: "Yes, if your total annual investment income exceeds 6 minimum gross salaries, you must pay an additional 10% health insurance contribution (CASS). This effectively doubles the tax rate to 20% for income above this threshold." },
    { q: "Can I Offset Trading Losses?", a: "Capital losses can be offset against capital gains from the same category within the same tax year. Unused losses can be carried forward for up to 7 years." },
  ],

  payments: [
    { method: "SEPA Transfer", deposit: "Free", withdrawal: "Free", time: "Instant–1d", note: "EUR — best option" },
    { method: "Bank Transfer (RON)", deposit: "Free", withdrawal: "Free–RON 20", time: "1-2 days", note: "Romanian banks" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit/credit" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free–€5", time: "Instant / 1d", note: "E-wallets" },
  ],

  guide: [
    { q: "How to Choose a Broker in Romania", a: "Look for ASF-authorized or CySEC/EU-passported brokers. Verify on ASF's register (asfromania.ro) or CySEC (cysec.gov.cy). Choose brokers offering EUR accounts to avoid RON conversion costs." },
    { q: "EUR vs RON Accounts", a: "Most Romanian forex traders prefer EUR-denominated accounts since major pairs are quoted in USD/EUR. This avoids double conversion (RON→EUR→USD). SEPA transfers in EUR are free and instant." },
    { q: "Best Trading Hours for Romania", a: "Best times for Romanian traders: 10:00 AM – 12:00 PM EET (London session) and 3:30 PM – 6:30 PM EET (London/New York overlap). EUR/USD is the most relevant pair." },
    { q: "XTB's Local Presence in Romania", a: "XTB is the only major broker with a physical office in Bucharest and ASF authorization. This provides local customer service, Romanian-language events, and easier dispute resolution." },
    { q: "How to Open a Forex Account in Romania", a: "Choose a broker, submit your Romanian ID (buletin) or passport, proof of address, and complete the online application. Fund via SEPA transfer in EUR for the fastest, cheapest deposits." },
  ],

  faq: [
    { q: "What is the best forex broker in Romania for 2026?", a: "XTB is our top pick for Romanian traders in 2026. It has a Bucharest office, ASF authorization, xStation platform, zero-commission stocks, and Romanian-language support." },
    { q: "Is forex trading legal in Romania?", a: "Yes, forex trading is fully legal. ASF regulates local firms, and CySEC-passported brokers serve Romania under EU MiFID II rules with full ESMA protections." },
    { q: "What leverage can Romanian traders use?", a: "ESMA limits retail leverage to 1:30 for major pairs. Professional traders can access up to 1:500 but lose ICF protection and negative balance guarantee." },
    { q: "Are forex profits taxed in Romania?", a: "Yes, capital gains from forex are taxed at 10%. If annual investment income exceeds 6 minimum gross salaries, an additional 10% CASS health contribution applies." },
    { q: "What is the minimum deposit?", a: "Minimum deposits range from €0 (XTB, Pepperstone) to €200 (IC Markets, Saxo Bank). XM offers an ultra-low €5 minimum." },
    { q: "Should I use EUR or RON accounts?", a: "EUR accounts are recommended for most Romanian traders. This avoids double conversion fees and SEPA deposits are free and fast." },
    { q: "What is ICF protection?", a: "Romania's Investor Compensation Fund covers up to €20,000 per investor if an authorized investment firm becomes insolvent." },
    { q: "Can I trade from Romania with CySEC brokers?", a: "Yes, CySEC-regulated brokers can serve Romanian clients through EU MiFID II passporting, providing the same ESMA protections as locally authorized firms." },
  ],

  related: [
    { name: "Brokers in Greece", icon: "🇬🇷", count: 10, url: "/best-forex-brokers-greece" },
    { name: "Brokers in Czech Republic", icon: "🇨🇿", count: 8, url: "/best-forex-brokers-czech-republic" },
    { name: "Brokers in Germany", icon: "🇩🇪", count: 10, url: "/best-forex-brokers-germany" },
    { name: "Brokers in Ukraine", icon: "🇺🇦", count: 8, url: "/best-forex-brokers-ukraine" },
    { name: "Best CySEC Brokers", icon: "🇨🇾", count: 14, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
  ],
};

export default data;
