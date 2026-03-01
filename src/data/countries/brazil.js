const data = {
  name: "Brazil", slug: "brazil", code: "BR", flag: "🇧🇷",
  regulator: "CVM", regulatorFull: "Comissão de Valores Mobiliários",
  regulatorUrl: "https://www.gov.br/cvm", currency: "BRL",
  leverage: "1:200", leverageNote: "No strict retail cap — broker dependent",
  compensation: "No formal deposit compensation for forex",
  negativeBalance: "Varies — offered by most international brokers",
  localPayments: ["PIX", "Bank Transfer (TED/DOC)", "Boleto Bancário", "Visa/Mastercard"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 40, localBrokersTotal: 22, hoursResearch: 78,
  author: { name: "Carlos Mendes", role: "Latin American Markets Specialist", exp: "13 years", initials: "CM", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Brazil for 2026 — CVM Regulated",
  metaDescription: "We tested 22 brokers accepting Brazilian traders with BRL accounts. These 10 offer PIX deposits, Portuguese support, and strong regulation for Brazilian forex traders.",
  keyFinding: "Brazil's forex market is regulated by CVM and BCB, but most retail forex trading happens through internationally regulated brokers. PIX instant payments have revolutionized how Brazilian traders fund accounts — all our top picks support it for free, instant deposits.",

  brokers: [
    { rank: 1, slug: "ic-markets", badge: "Best Overall Brazil", badgeColor: "#059669", localCurrencyMin: "R$0", verdict: "Best overall for Brazilian traders. Tightest raw spreads, fast execution, and BRL deposits via PIX.", localAdvantages: ["PIX instant deposits accepted", "BRL base account available", "Raw ECN spreads from 0.0 pips", "Portuguese-language support", "cTrader + MetaTrader 4/5"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Best Platforms", badgeColor: "#2563eb", localCurrencyMin: "R$0", verdict: "Multi-platform broker with tight spreads and full Portuguese support. PIX deposits accepted.", localAdvantages: ["PIX deposits — instant & free", "Portuguese-language platform", "Raw ECN from 0.0 pips", "TradingView + cTrader", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "R$25", verdict: "Lowest deposit and comprehensive Portuguese education. Ideal for Brazilian beginners.", localAdvantages: ["Ultra-low R$25 minimum deposit", "Portuguese education & webinars", "Micro lot trading (0.01 lots)", "PIX deposits accepted", "24/5 Portuguese support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "exness", badge: "Instant Withdrawals", badgeColor: "#6d28d9", localCurrencyMin: "R$40", verdict: "Fastest withdrawals for Brazilian traders via PIX. Automatic Islamic accounts available.", localAdvantages: ["PIX instant deposits & withdrawals", "BRL base currency", "No minimum on Standard", "Islamic account available", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "R$100", verdict: "Best for Brazilian beginners wanting to copy successful investors. Available in Portuguese.", localAdvantages: ["Copy Trading — follow top traders", "Portuguese interface", "Fractional shares from R$50", "PIX deposits supported", "30M+ global users"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "R$500", verdict: "Lowest ECN commission for Brazilian traders. Great raw pricing with cTrader.", localAdvantages: ["ECN commission at $6/lot RT", "cTrader + TradingView", "ASIC + CySEC regulated", "BRL deposits accepted", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "avatrade", badge: "Best Fixed Spreads", badgeColor: "#059669", localCurrencyMin: "R$500", verdict: "Fixed and floating spread options with AvaProtect risk management for Brazilian traders.", localAdvantages: ["AvaProtect risk management", "Fixed spread option", "Portuguese support", "Multiple platforms", "Multi-regulated broker"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "tickmill", badge: null, badgeColor: null, localCurrencyMin: "R$500", verdict: "Competitive raw spreads and low commission. Good choice for Brazilian scalpers.", localAdvantages: ["Raw spreads from 0.0 pips", "Low $4/lot commission", "FCA + CySEC regulated", "Fast execution", "Islamic account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "R$0", verdict: "Zero minimum deposit with copy trading features. Accepts PIX for Brazilian traders.", localAdvantages: ["No minimum deposit", "PIX deposits accepted", "Copy trading feature", "Portuguese support", "Wide account variety"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "capital-com", badge: null, badgeColor: null, localCurrencyMin: "R$100", verdict: "AI-powered trading insights and educational content in Portuguese for Brazilian traders.", localAdvantages: ["AI-powered trading insights", "Portuguese education content", "Low minimum deposit", "TradingView integration", "FCA + CySEC regulated"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "Forex Regulation in Brazil",
    items: [
      { icon: "shield", title: "CVM Oversight", desc: "The Comissão de Valores Mobiliários (CVM) regulates securities and derivatives markets in Brazil. While CVM does not specifically license retail forex brokers, it oversees capital market activities." },
      { icon: "landmark", title: "Central Bank (BCB)", desc: "The Banco Central do Brasil regulates foreign exchange transactions and authorized forex dealers. BCB policies affect currency conversion and international transfers for Brazilian traders." },
      { icon: "bar-chart-3", title: "B3 Exchange", desc: "Brazil's official exchange B3 (formerly BM&F Bovespa) offers dollar futures trading, which is the primary regulated way to trade forex domestically. International CFD brokers operate alongside this." },
      { icon: "piggy-bank", title: "IOF Tax", desc: "Brazil charges IOF (Imposto sobre Operações Financeiras) on foreign exchange transactions. This tax affects international transfers to and from forex broker accounts." },
      { icon: "scale", title: "International Regulation", desc: "Most brokers serving Brazilian traders are regulated by FCA (UK), ASIC (Australia), or CySEC (EU), providing fund segregation and negative balance protection." },
      { icon: "clipboard-list", title: "Consumer Protection", desc: "Brazilian traders benefit from the Consumer Defence Code (CDC) for disputes with financial service providers, alongside protections from international regulators." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Brazil?", a: "Forex trading profits are subject to income tax in Brazil. Capital gains from forex are taxed at progressive rates: 15% up to R$5 million, 17.5% up to R$10 million, 20% up to R$30 million, and 22.5% above R$30 million. Monthly profits must be reported via DARF." },
    { q: "What Is IOF Tax?", a: "IOF (Imposto sobre Operações Financeiras) is charged on foreign exchange transactions at a rate of 0.38% for most forex transfers. This applies when sending BRL to international broker accounts and when receiving withdrawals." },
    { q: "How Do I Report Forex Income?", a: "Brazilian traders must report forex profits monthly using DARF (Documento de Arrecadação de Receitas Federais) and declare all foreign assets above USD 100 in the annual DIRPF tax return. Failure to report can result in fines of 20% to 75% of the unpaid tax." },
    { q: "Are Foreign Accounts Reportable?", a: "Yes, Brazilian residents must declare foreign financial accounts exceeding USD 100 (or equivalent) in the annual DIRPF tax return. The Receita Federal (Brazilian IRS) has information exchange agreements with many countries." },
  ],

  payments: [
    { method: "PIX", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Best for Brazil" },
    { method: "Bank Transfer (TED)", deposit: "Free", withdrawal: "Free", time: "Same day", note: "Brazilian banks" },
    { method: "Boleto Bancário", deposit: "Free", withdrawal: "N/A", time: "1-2 days", note: "Deposit only" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Credit/debit" },
  ],

  guide: [
    { q: "How to Open a Forex Account from Brazil", a: "Choose an internationally regulated broker from our list, submit your CPF, RG or passport, and proof of address (comprovante de residência). Most accounts are approved within 24 hours. Fund via PIX for instant, free deposits." },
    { q: "PIX vs Bank Transfer for Forex Deposits", a: "PIX is faster (instant vs same-day), free, and available 24/7. Bank transfers (TED) work during business hours only. PIX is the recommended method for all Brazilian forex deposits and withdrawals." },
    { q: "Best Trading Hours for Brazil", a: "Best times for Brazilian traders: 5:00 AM – 7:00 AM BRT (London open) and 10:30 AM – 1:00 PM BRT (New York open). EUR/USD and USD/BRL pairs are most liquid during these windows." },
    { q: "B3 Dollar Futures vs International Forex", a: "B3 offers regulated USD/BRL futures (mini-dollar contracts), ideal for hedging. International CFD brokers offer wider pair selection, higher leverage, and lower costs. Many Brazilian traders use both." },
    { q: "Is It Legal for Brazilians to Use International Brokers?", a: "Yes, Brazilian residents can legally trade with international brokers. You must declare foreign accounts and pay applicable taxes. There are no laws prohibiting the use of international forex brokers." },
  ],

  faq: [
    { q: "What is the best forex broker in Brazil for 2026?", a: "IC Markets is our top pick for Brazilian traders in 2026. It offers the tightest raw spreads, PIX deposits, BRL accounts, and Portuguese-language support." },
    { q: "Is forex trading legal in Brazil?", a: "Yes, forex trading is legal in Brazil. CVM regulates capital markets, and Brazilian residents can trade with both domestic (B3) and international brokers. All income must be declared to Receita Federal." },
    { q: "Can I deposit via PIX?", a: "Yes, most top brokers accept PIX deposits for instant, free BRL transfers. IC Markets, Pepperstone, XM, Exness, and eToro all support PIX." },
    { q: "What is the minimum deposit in Brazil?", a: "Minimum deposits range from R$0 (IC Markets, Pepperstone, HFM) to R$500 (FP Markets, Tickmill). XM offers a low R$25 minimum." },
    { q: "How are forex profits taxed in Brazil?", a: "Capital gains from forex are taxed at 15% to 22.5% depending on the amount. Monthly profits must be reported via DARF, and foreign accounts declared in the annual DIRPF." },
    { q: "What is IOF tax?", a: "IOF is a 0.38% tax on foreign exchange transactions, including transfers to and from international forex broker accounts." },
    { q: "What leverage is available for Brazilian traders?", a: "Most international brokers offer up to 1:200 or 1:500 for Brazilian traders. There is no strict CVM leverage cap for international brokers, but higher leverage increases risk." },
    { q: "Can I trade USD/BRL?", a: "Yes, both through B3's mini-dollar futures (regulated, BRL-settled) and international forex brokers offering USD/BRL CFDs. Spreads on USD/BRL are wider than major pairs." },
  ],

  related: [
    { name: "Brokers in Mexico", icon: "🇲🇽", count: 10, url: "/best-forex-brokers-mexico" },
    { name: "Brokers in Argentina", icon: "🇦🇷", count: 8, url: "/best-forex-brokers-argentina" },
    { name: "Brokers in Colombia", icon: "🇨🇴", count: 8, url: "/best-forex-brokers-colombia" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best Low Spread Brokers", icon: "trending-down", count: 10, url: "#" },
    { name: "Best Social Trading", icon: "users", count: 10, url: "#" },
  ],
};

export default data;
