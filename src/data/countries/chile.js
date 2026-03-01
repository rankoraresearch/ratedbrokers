const data = {
  name: "Chile", slug: "chile", code: "CL", flag: "🇨🇱",
  regulator: "CMF", regulatorFull: "Comisión para el Mercado Financiero",
  regulatorUrl: "https://www.cmfchile.cl", currency: "CLP",
  leverage: "1:200", leverageNote: "No strict retail cap — broker dependent",
  compensation: "No formal deposit compensation for forex",
  negativeBalance: "Varies — offered by most international brokers",
  localPayments: ["Bank Transfer (TEF)", "Visa/Mastercard", "WebPay", "Khipu"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 32, localBrokersTotal: 14, hoursResearch: 60,
  author: { name: "Carlos Mendes", role: "Latin American Markets Specialist", exp: "13 years", initials: "CM", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "8 Best Forex Brokers in Chile for 2026 — CMF Regulated",
  metaDescription: "We tested 14 brokers accepting Chilean traders with CLP deposits. These 8 offer bank transfer funding, Spanish support, and strong international regulation for Chilean forex traders.",
  keyFinding: "Chile has South America's most stable economy and a well-developed financial regulatory framework under CMF. Our top picks are internationally regulated brokers that accept Chilean clients with CLP deposits via local bank transfers and offer full Spanish-language support.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall Chile", badgeColor: "#059669", localCurrencyMin: "CLP 0", verdict: "Best overall for Chilean traders. Raw spreads, bank transfer deposits, and full Spanish support.", localAdvantages: ["CLP deposits via bank transfer", "Spanish-language support", "Raw ECN from 0.0 pips", "No minimum deposit", "cTrader + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "CLP 0", verdict: "Tightest raw spreads for Chilean traders. Outstanding execution quality.", localAdvantages: ["0.02 pip average EUR/USD", "CLP deposits accepted", "25+ liquidity providers", "cTrader + MetaTrader", "Spanish support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "CLP 5,000", verdict: "Lowest deposit and comprehensive Spanish education. Perfect for Chilean beginners.", localAdvantages: ["Low CLP 5,000 minimum", "Spanish webinars & education", "Micro lot trading", "Bank transfer deposits", "24/5 Spanish support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "CLP 100,000", verdict: "Copy successful traders with Spanish interface. Great for Chilean beginners and passive investors.", localAdvantages: ["Copy Trading feature", "Spanish interface", "Fractional shares", "CLP deposits accepted", "30M+ global users"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "exness", badge: "Instant Withdrawals", badgeColor: "#6d28d9", localCurrencyMin: "CLP 10,000", verdict: "Fastest withdrawals with multiple account types for Chilean traders.", localAdvantages: ["Instant withdrawals", "CLP deposits accepted", "No minimum on Standard", "Islamic account", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "CLP 0", verdict: "Award-winning xStation platform with Spanish support and zero-commission stocks.", localAdvantages: ["xStation 5 platform", "Spanish support", "0% commission stocks", "No minimum deposit", "Educational content"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "CLP 100,000", verdict: "Lowest ECN commission with competitive raw spreads for Chilean traders.", localAdvantages: ["ECN commission $6/lot RT", "cTrader + TradingView", "ASIC + CySEC regulated", "CLP deposits", "4.8 Trustpilot"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "CLP 0", verdict: "Zero minimum with copy trading for Chilean beginners.", localAdvantages: ["No minimum deposit", "Copy trading", "Spanish support", "Bank transfer deposits", "Wide account variety"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "Forex Regulation in Chile",
    items: [
      { icon: "shield", title: "CMF Oversight", desc: "The Comisión para el Mercado Financiero (CMF) regulates financial markets in Chile, including securities, banking, and insurance. CMF provides oversight of financial institutions operating in Chile." },
      { icon: "landmark", title: "Banco Central de Chile", desc: "Chile's central bank regulates foreign exchange operations. Chile has a free-floating exchange rate with no capital controls, making it easier for Chilean traders to fund international accounts." },
      { icon: "bar-chart-3", title: "Open Capital Account", desc: "Chile has one of Latin America's most open capital accounts. There are no restrictions on Chilean residents sending money to international brokers, making forex trading straightforward." },
      { icon: "piggy-bank", title: "International Protection", desc: "Most brokers serving Chilean traders are regulated by FCA, ASIC, or CySEC, providing fund segregation, negative balance protection, and regulatory oversight." },
      { icon: "scale", title: "SII Tax Compliance", desc: "The Servicio de Impuestos Internos (SII) requires Chilean residents to declare all investment income, including forex profits from international accounts." },
      { icon: "clipboard-list", title: "Consumer Protection", desc: "SERNAC (Servicio Nacional del Consumidor) provides consumer protection. For financial disputes, CMF handles complaints about regulated financial institutions." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Chile?", a: "Forex trading profits are subject to Impuesto Global Complementario (personal income tax) at progressive rates from 0% to 40% depending on total annual income. Capital gains from financial instruments are generally taxed as regular income." },
    { q: "Do I Need to Declare Foreign Accounts?", a: "Yes, Chilean residents must declare foreign financial assets and income to the SII (Servicio de Impuestos Internos). This includes forex trading accounts held with international brokers and any profits earned." },
    { q: "Is There a Capital Gains Tax?", a: "Chile does not have a separate capital gains tax. Gains from forex trading are treated as regular income (renta) and taxed at the applicable income tax rate. Losses may be offset against other investment gains within the same fiscal year." },
  ],

  payments: [
    { method: "Bank Transfer (TEF)", deposit: "Free", withdrawal: "Free", time: "1-3 hours", note: "Best for Chile" },
    { method: "WebPay", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "Deposit only" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Credit/debit" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free–$5", time: "Instant / 1d", note: "E-wallets" },
  ],

  guide: [
    { q: "How to Open a Forex Account from Chile", a: "Choose a broker from our list, submit your RUT (Rol Único Tributario), cédula de identidad, and proof of address. Most accounts are approved within 24 hours. Fund via Chilean bank transfer for the fastest deposits." },
    { q: "Why Chile Is Good for Forex Trading", a: "Chile has no capital controls, a stable currency, an open capital account, and strong rule of law. Chilean traders can freely send money to international brokers without restrictions — unlike many other Latin American countries." },
    { q: "Best Trading Hours for Chile", a: "Best times for Chilean traders: 5:00 AM – 7:00 AM CLT (London open) and 10:30 AM – 1:00 PM CLT (New York open). USD/CLP is most active during US trading hours." },
    { q: "Is It Legal to Trade Forex in Chile?", a: "Yes, forex trading is fully legal in Chile. There are no restrictions on Chilean residents using international brokers. You must declare all foreign investment income to SII." },
  ],

  faq: [
    { q: "What is the best forex broker in Chile for 2026?", a: "Pepperstone is our top pick for Chilean traders in 2026. It offers raw ECN spreads, CLP bank transfer deposits, Spanish support, and no minimum deposit." },
    { q: "Is forex trading legal in Chile?", a: "Yes, forex trading is fully legal in Chile. CMF regulates financial markets, and there are no capital controls restricting international broker use." },
    { q: "Can I deposit in Chilean Pesos?", a: "Yes, most top brokers accept CLP deposits via Chilean bank transfer. Pepperstone, IC Markets, and XM all support local bank transfers." },
    { q: "What is the minimum deposit?", a: "Minimum deposits range from CLP 0 (Pepperstone, IC Markets, XTB, HFM) to CLP 100,000 (eToro, FP Markets). XM offers a low CLP 5,000 minimum." },
    { q: "Are forex profits taxed in Chile?", a: "Yes, forex profits are taxed as regular income at progressive rates from 0% to 40%. Declare all foreign income to SII." },
    { q: "What leverage is available?", a: "Most international brokers offer up to 1:200 or 1:500 for Chilean traders. There is no strict CMF leverage cap for international brokers." },
  ],

  related: [
    { name: "Brokers in Brazil", icon: "🇧🇷", count: 10, url: "/best-forex-brokers-brazil" },
    { name: "Brokers in Argentina", icon: "🇦🇷", count: 8, url: "/best-forex-brokers-argentina" },
    { name: "Brokers in Colombia", icon: "🇨🇴", count: 8, url: "/best-forex-brokers-colombia" },
    { name: "Brokers in Mexico", icon: "🇲🇽", count: 10, url: "/best-forex-brokers-mexico" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best Low Spread Brokers", icon: "trending-down", count: 10, url: "#" },
  ],
};

export default data;
