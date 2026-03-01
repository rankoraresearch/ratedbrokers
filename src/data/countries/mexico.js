const data = {
  name: "Mexico", slug: "mexico", code: "MX", flag: "🇲🇽",
  regulator: "CNBV", regulatorFull: "Comisión Nacional Bancaria y de Valores",
  regulatorUrl: "https://www.gob.mx/cnbv", currency: "MXN",
  leverage: "1:200", leverageNote: "No strict retail cap — broker dependent",
  compensation: "No formal deposit compensation for forex",
  negativeBalance: "Varies — offered by most international brokers",
  localPayments: ["SPEI Transfer", "Visa/Mastercard", "OXXO Pay", "CoDi"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 38, localBrokersTotal: 20, hoursResearch: 72,
  author: { name: "Carlos Mendes", role: "Latin American Markets Specialist", exp: "13 years", initials: "CM", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Mexico for 2026 — CNBV Regulated",
  metaDescription: "We tested 20 brokers accepting Mexican traders with MXN accounts. These 10 offer SPEI deposits, Spanish support, competitive spreads, and strong international regulation.",
  keyFinding: "Mexico has Latin America's most developed forex market with growing CNBV oversight. SPEI instant transfers are the preferred funding method — all our top brokers accept them for free, instant MXN deposits. USD/MXN is one of the world's most traded emerging market pairs.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall Mexico", badgeColor: "#059669", localCurrencyMin: "MX$0", verdict: "Best overall for Mexican traders. Raw spreads, SPEI deposits, and full Spanish-language support.", localAdvantages: ["SPEI instant deposits accepted", "Spanish-language platform & support", "Raw ECN spreads from 0.0 pips", "No minimum deposit", "cTrader + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "MX$0", verdict: "Tightest raw spreads for Mexican traders. Outstanding execution and deep liquidity.", localAdvantages: ["0.02 pip average EUR/USD", "SPEI deposits accepted", "25+ tier-1 LPs", "MetaTrader 4/5 + cTrader", "Spanish support available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "MX$100", verdict: "Lowest deposit and comprehensive Spanish education. Perfect entry point for Mexican beginners.", localAdvantages: ["Low MX$100 minimum deposit", "Spanish webinars & education", "Micro lot trading (0.01 lots)", "SPEI deposits", "24/5 Spanish support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "MX$1,500", verdict: "Best for Mexican beginners wanting to copy successful traders. Full Spanish interface.", localAdvantages: ["Copy Trading feature", "Spanish interface", "Fractional shares", "SPEI deposits", "30M+ global users"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "exness", badge: "Instant Withdrawals", badgeColor: "#6d28d9", localCurrencyMin: "MX$200", verdict: "Fastest withdrawals for Mexican traders. Multiple account types and instant processing.", localAdvantages: ["Instant withdrawals", "MXN deposits via SPEI", "No minimum on Standard", "Islamic account available", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "MX$0", verdict: "Award-winning xStation platform with Spanish support and commission-free stock trading.", localAdvantages: ["xStation 5 platform", "Spanish-language support", "0% commission on stocks", "No minimum deposit", "Educational content in Spanish"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "MX$1,500", verdict: "Lowest ECN commission with competitive raw spreads for Mexican traders.", localAdvantages: ["ECN commission $6/lot RT", "cTrader + TradingView", "ASIC + CySEC regulated", "MXN deposits accepted", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "avatrade", badge: null, badgeColor: null, localCurrencyMin: "MX$1,500", verdict: "Multi-platform broker with AvaProtect risk management and Spanish support.", localAdvantages: ["AvaProtect risk management", "Spanish customer support", "Multiple platforms", "Fixed and floating spreads", "Multi-regulated"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "capital-com", badge: null, badgeColor: null, localCurrencyMin: "MX$500", verdict: "AI-powered insights and educational content in Spanish for Mexican traders.", localAdvantages: ["AI-powered trading insights", "Spanish education content", "TradingView integration", "Low minimum deposit", "FCA + CySEC regulated"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "MX$0", verdict: "Zero minimum deposit with copy trading for Mexican beginners.", localAdvantages: ["No minimum deposit", "Copy trading feature", "Spanish support", "SPEI deposits", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "Forex Regulation in Mexico",
    items: [
      { icon: "shield", title: "CNBV Oversight", desc: "The Comisión Nacional Bancaria y de Valores (CNBV) supervises banking and securities markets in Mexico. CNBV regulates authorized financial institutions offering investment services." },
      { icon: "landmark", title: "Banxico (Central Bank)", desc: "Banco de México regulates the Mexican foreign exchange market and sets monetary policy. Banxico's policies directly affect MXN exchange rates and forex market conditions." },
      { icon: "file-text", title: "Fintech Law (2018)", desc: "Mexico's Fintech Law provides a regulatory framework for financial technology companies, including some forex-related services. This law is gradually expanding oversight of digital trading platforms." },
      { icon: "piggy-bank", title: "CONDUSEF Consumer Protection", desc: "CONDUSEF (Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros) handles consumer complaints about financial services, including broker disputes." },
      { icon: "scale", title: "International Regulation", desc: "Most brokers serving Mexican traders are regulated by FCA, ASIC, or CySEC. These provide stronger protections including fund segregation and negative balance protection." },
      { icon: "clipboard-list", title: "SAT Tax Compliance", desc: "The Servicio de Administración Tributaria (SAT) requires Mexican traders to declare all investment income, including forex profits, in their annual tax returns." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Mexico?", a: "Forex trading profits are subject to ISR (Impuesto Sobre la Renta) at progressive rates from 1.92% to 35% depending on your total annual income. Capital gains from financial instruments are taxed at 10% for gains on listed securities, but CFD profits may be treated as regular income." },
    { q: "Do I Need to Report to SAT?", a: "Yes, Mexican traders must report all forex income to SAT (Servicio de Administración Tributaria) in their annual tax return. This includes profits from international brokers. Keep CFDI receipts and trade records for all transactions." },
    { q: "What About IVA (VAT)?", a: "Financial services are generally exempt from IVA (16% VAT) in Mexico. Broker commissions and spreads are not subject to IVA. However, some ancillary services may incur IVA charges." },
  ],

  payments: [
    { method: "SPEI Transfer", deposit: "Free", withdrawal: "Free", time: "Instant–1h", note: "Best for Mexico" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Credit/debit" },
    { method: "OXXO Pay", deposit: "Free", withdrawal: "N/A", time: "1-24 hours", note: "Deposit only" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free–$5", time: "Instant / 1d", note: "E-wallets" },
  ],

  guide: [
    { q: "How to Open a Forex Account from Mexico", a: "Choose a broker from our list, submit your INE/IFE (voter ID) or passport, CURP, proof of address (comprobante de domicilio), and RFC. Most accounts are approved within 24 hours. Fund via SPEI for instant deposits." },
    { q: "SPEI vs OXXO for Forex Deposits", a: "SPEI is instant, free, and works 24/7 — it's the best method. OXXO deposits can take up to 24 hours and are deposit-only (no withdrawals). Use SPEI whenever possible." },
    { q: "Best Trading Hours for Mexico", a: "Best times for Mexican traders: 2:00 AM – 4:00 AM CST (London open) and 7:30 AM – 10:00 AM CST (New York open). USD/MXN is most active during US trading hours." },
    { q: "Trading USD/MXN", a: "USD/MXN is one of the most liquid EM pairs. Spreads are wider than majors (typically 3-10 pips) but offer high volatility and profit potential. Best traded during US market hours when liquidity is highest." },
    { q: "Is It Legal for Mexicans to Use International Brokers?", a: "Yes, Mexican residents can legally trade with international brokers. There are no laws prohibiting it. You must declare all foreign investment income to SAT and comply with anti-money laundering regulations." },
  ],

  faq: [
    { q: "What is the best forex broker in Mexico for 2026?", a: "Pepperstone is our top pick for Mexican traders in 2026. It offers raw ECN spreads, SPEI deposits, full Spanish support, and no minimum deposit." },
    { q: "Is forex trading legal in Mexico?", a: "Yes, forex trading is legal in Mexico. CNBV oversees financial markets, and Mexican residents can trade with domestic and international brokers. All income must be declared to SAT." },
    { q: "Can I deposit via SPEI?", a: "Yes, most top brokers accept SPEI transfers for instant, free MXN deposits. Pepperstone, IC Markets, XM, and Exness all support SPEI." },
    { q: "What is the minimum deposit in Mexico?", a: "Minimum deposits range from MX$0 (Pepperstone, IC Markets, XTB, HFM) to MX$1,500 (eToro, FP Markets). XM offers a low MX$100 minimum." },
    { q: "How are forex profits taxed in Mexico?", a: "Forex profits are subject to ISR at progressive rates from 1.92% to 35%. You must declare all trading income to SAT in your annual tax return." },
    { q: "What leverage is available in Mexico?", a: "Most international brokers offer up to 1:200 or 1:500 for Mexican traders. There is no strict CNBV leverage cap for international brokers." },
    { q: "Can I trade USD/MXN?", a: "Yes, USD/MXN is available at all brokers in our ranking. It's one of the world's most liquid emerging market pairs with spreads typically between 3-10 pips." },
    { q: "Do Mexican brokers offer Spanish support?", a: "Yes, all top 10 brokers in our ranking offer Spanish-language platforms, customer support, and educational content for Mexican traders." },
  ],

  related: [
    { name: "Brokers in Brazil", icon: "🇧🇷", count: 10, url: "/best-forex-brokers-brazil" },
    { name: "Brokers in Colombia", icon: "🇨🇴", count: 8, url: "/best-forex-brokers-colombia" },
    { name: "Brokers in Chile", icon: "🇨🇱", count: 8, url: "/best-forex-brokers-chile" },
    { name: "Brokers in Argentina", icon: "🇦🇷", count: 8, url: "/best-forex-brokers-argentina" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best Low Spread Brokers", icon: "trending-down", count: 10, url: "#" },
  ],
};

export default data;
