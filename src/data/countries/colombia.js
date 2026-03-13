const data = {
  name: "Colombia", slug: "colombia", code: "CO", flag: "🇨🇴",
  regulator: "SFC", regulatorFull: "Superintendencia Financiera de Colombia",
  regulatorUrl: "https://www.superfinanciera.gov.co", currency: "COP",
  leverage: "1:200", leverageNote: "No strict retail cap — broker dependent",
  compensation: "Fogafín covers bank deposits only, not forex",
  negativeBalance: "Varies — offered by most international brokers",
  localPayments: ["PSE Transfer", "Bank Transfer", "Visa/Mastercard", "Nequi", "Daviplata"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 34, localBrokersTotal: 16, hoursResearch: 62,
  author: { name: "Carlos Mendes", role: "Latin American Markets Specialist", exp: "13 years", initials: "CM", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "8 Best Forex Brokers in Colombia for 2026 — SFC Regulated",
  metaDescription: "We analyzed 16 brokers accepting Colombian traders. These 8 offer PSE transfers, Spanish support, and strong international regulation for Colombian forex traders.",
  keyFinding: "Colombia's forex market is growing under SFC oversight, but most retail trading happens through internationally regulated brokers. PSE bank transfers are the preferred funding method, with several brokers now accepting Nequi and Daviplata mobile payments.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall Colombia", badgeColor: "#059669", localCurrencyMin: "COP 0", verdict: "Best overall for Colombian traders. Raw spreads, PSE deposits, and full Spanish support.", localAdvantages: ["PSE deposits accepted", "Spanish-language support", "Raw ECN from 0.0 pips", "No minimum deposit", "cTrader + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "COP 0", verdict: "Tightest raw spreads for Colombian traders. Best for those who prioritize execution.", localAdvantages: ["0.02 pip average EUR/USD", "PSE deposits", "25+ liquidity providers", "cTrader + MetaTrader", "Spanish support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "COP 20,000", verdict: "Lowest deposit and comprehensive Spanish education. Ideal for Colombian beginners.", localAdvantages: ["Low COP 20,000 minimum", "Spanish education & webinars", "Micro lot trading", "PSE deposits", "24/5 Spanish support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "exness", badge: "Instant Withdrawals", badgeColor: "#6d28d9", localCurrencyMin: "COP 40,000", verdict: "Fastest withdrawals for Colombian traders with multiple account types.", localAdvantages: ["Instant withdrawals", "COP deposits accepted", "No minimum on Standard", "Islamic account", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "COP 200,000", verdict: "Copy successful traders with a simple Spanish interface. Great for Colombian beginners.", localAdvantages: ["Copy Trading feature", "Spanish interface", "Fractional shares", "Social community", "30M+ global users"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "COP 0", verdict: "Award-winning xStation platform with Spanish support for Colombian traders.", localAdvantages: ["xStation 5 platform", "Spanish support", "0% commission stocks", "No minimum deposit", "Educational content"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "COP 500,000", verdict: "Lowest ECN commission with competitive spreads for Colombian traders.", localAdvantages: ["ECN commission $6/lot RT", "cTrader + TradingView", "ASIC + CySEC regulated", "COP deposits", "4.8 Trustpilot"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "COP 0", verdict: "Zero minimum with copy trading features for Colombian traders.", localAdvantages: ["No minimum deposit", "Copy trading", "Spanish support", "PSE deposits", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "Forex Regulation in Colombia",
    items: [
      { icon: "shield", title: "SFC Oversight", desc: "The Superintendencia Financiera de Colombia (SFC) regulates financial markets, including securities and investment activities. SFC oversees authorized financial institutions in Colombia." },
      { icon: "landmark", title: "Banco de la República", desc: "Colombia's central bank regulates foreign exchange operations and currency flows. Its policies affect how Colombian traders can fund international broker accounts." },
      { icon: "bar-chart-3", title: "Foreign Investment Rules", desc: "Colombian residents investing abroad must register with the central bank through their bank. Forex trading account funding should comply with foreign investment registration requirements." },
      { icon: "piggy-bank", title: "International Protection", desc: "Most brokers serving Colombian traders are regulated by FCA, ASIC, or CySEC, providing fund segregation, negative balance protection, and regulatory oversight." },
      { icon: "scale", title: "DIAN Tax Compliance", desc: "The DIAN (Dirección de Impuestos y Aduanas Nacionales) requires declaration of all foreign investment income, including forex profits." },
      { icon: "clipboard-list", title: "Consumer Protection", desc: "SFC handles consumer complaints about financial services. For internationally regulated brokers, traders can also escalate to the broker's home regulator." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Colombia?", a: "Forex trading profits are subject to income tax (Renta) at progressive rates from 0% to 39% depending on total annual income. Capital gains from financial instruments may also be taxed at 15%. All foreign income must be declared to DIAN." },
    { q: "Do I Need to Declare Foreign Accounts?", a: "Yes, Colombian residents must declare foreign financial assets exceeding approximately COP 72 million (3,580 UVT) in their annual tax return. This includes forex trading accounts held with international brokers." },
    { q: "What About GMF (Financial Movements Tax)?", a: "Colombia charges GMF (Gravamen a los Movimientos Financieros) at 0.4% on financial transactions. Bank transfers to international brokers may be subject to this tax, though exemptions apply for certain transaction types." },
  ],

  payments: [
    { method: "PSE Transfer", deposit: "Free", withdrawal: "Free", time: "Instant–1h", note: "Best for Colombia" },
    { method: "Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-3 hours", note: "Colombian banks" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Credit/debit" },
    { method: "Nequi/Daviplata", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Select brokers" },
  ],

  guide: [
    { q: "How to Open a Forex Account from Colombia", a: "Choose a broker from our list, submit your cédula de ciudadanía, proof of address (recibo de servicios), and RUT. Most accounts approved within 24 hours. Fund via PSE transfer for instant deposits." },
    { q: "PSE Transfer for Forex Deposits", a: "PSE (Pagos Seguros en Línea) is Colombia's interbank transfer system. It's instant, free, and the most reliable way to fund forex accounts from Colombia. Select PSE on your broker's deposit page and log in to your Colombian bank." },
    { q: "Best Trading Hours for Colombia", a: "Best times for Colombian traders: 3:00 AM – 5:00 AM COT (London open) and 8:30 AM – 11:00 AM COT (New York open). USD/COP is most active during US trading hours." },
    { q: "Is It Legal to Trade Forex in Colombia?", a: "Yes, forex trading is legal in Colombia. Colombian residents can use international brokers. You must register foreign investments with the central bank through your bank and declare all income to DIAN." },
  ],

  faq: [
    { q: "What is the best forex broker in Colombia for 2026?", a: "Pepperstone is our top pick for Colombian traders in 2026. It offers raw ECN spreads, PSE deposits, Spanish support, and no minimum deposit." },
    { q: "Is forex trading legal in Colombia?", a: "Yes, forex trading is legal. The SFC regulates financial markets, and Colombian residents can use international brokers. All foreign income must be declared to DIAN." },
    { q: "Can I deposit via PSE?", a: "Yes, most top brokers accept PSE transfers for instant, free COP deposits from Colombian bank accounts." },
    { q: "What is the minimum deposit?", a: "Minimum deposits range from COP 0 (Pepperstone, IC Markets, XTB, HFM) to COP 500,000 (FP Markets). XM offers a low COP 20,000 minimum." },
    { q: "Are forex profits taxed in Colombia?", a: "Yes, forex profits are subject to income tax at progressive rates from 0% to 39%. You must declare foreign accounts exceeding approximately COP 72 million to DIAN." },
    { q: "What leverage is available?", a: "Most international brokers offer up to 1:200 or 1:500 for Colombian traders. There is no strict SFC leverage cap for international brokers." },
  ],

  related: [
    { name: "Brokers in Brazil", icon: "🇧🇷", count: 10, url: "/best-forex-brokers-brazil" },
    { name: "Brokers in Mexico", icon: "🇲🇽", count: 10, url: "/best-forex-brokers-mexico" },
    { name: "Brokers in Chile", icon: "🇨🇱", count: 8, url: "/best-forex-brokers-chile" },
    { name: "Brokers in Argentina", icon: "🇦🇷", count: 8, url: "/best-forex-brokers-argentina" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best Low Spread Brokers", icon: "trending-down", count: 10, url: "#" },
  ],
};

export default data;
