const data = {
  name: "Argentina", slug: "argentina", code: "AR", flag: "🇦🇷",
  regulator: "CNV", regulatorFull: "Comisión Nacional de Valores",
  regulatorUrl: "https://www.argentina.gob.ar/cnv", currency: "ARS",
  leverage: "1:500", leverageNote: "No strict retail cap — broker dependent",
  compensation: "No formal deposit compensation for forex",
  negativeBalance: "Varies — offered by most international brokers",
  localPayments: ["Bank Transfer", "Visa/Mastercard", "Mercado Pago", "Crypto (USDT)"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 35, localBrokersTotal: 16, hoursResearch: 64,
  author: { name: "Carlos Mendes", role: "Latin American Markets Specialist", exp: "13 years", initials: "CM", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "8 Best Forex Brokers in Argentina for 2026 — Tested & Reviewed",
  metaDescription: "We tested 16 brokers accepting Argentine traders. These 8 offer the best conditions with USD access, competitive spreads, and workarounds for Argentina's currency controls.",
  keyFinding: "Argentina's strict capital controls (cepo cambiario) make forex trading uniquely challenging. Our top picks are international brokers that accept Argentine clients through crypto (USDT) deposits or dollar-denominated accounts, bypassing ARS conversion restrictions.",

  brokers: [
    { rank: 1, slug: "exness", badge: "Best Overall Argentina", badgeColor: "#059669", localCurrencyMin: "ARS 0", verdict: "Best for Argentine traders. Accepts crypto deposits (USDT) to bypass capital controls. Instant withdrawals.", localAdvantages: ["Crypto (USDT) deposits accepted", "No minimum deposit", "Instant withdrawals", "Multiple account types", "Spanish-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "ARS 0", verdict: "Tightest raw spreads with crypto funding options for Argentine traders.", localAdvantages: ["Raw ECN from 0.0 pips", "Crypto deposits accepted", "Spanish-language support", "cTrader + TradingView", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "ARS 5,000", verdict: "Lowest barrier with Spanish education. Best entry point for Argentine beginners.", localAdvantages: ["Low minimum deposit", "Spanish education & webinars", "Micro lot trading (0.01 lots)", "24/5 Spanish support", "Islamic account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "ic-markets", badge: "Best Execution", badgeColor: "#6d28d9", localCurrencyMin: "ARS 50,000", verdict: "Best execution quality for Argentine traders. Ultra-tight raw spreads from 25+ LPs.", localAdvantages: ["0.02 pip average EUR/USD", "Crypto funding available", "25+ liquidity providers", "cTrader + MetaTrader", "Fast execution < 40ms"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "ARS 50,000", verdict: "Copy successful traders with Spanish interface. Good for Argentine beginners.", localAdvantages: ["Copy Trading feature", "Spanish interface", "Fractional shares", "Social trading community", "30M+ global users"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "ARS 50,000", verdict: "Lowest ECN commission with competitive raw pricing for Argentine traders.", localAdvantages: ["ECN commission $6/lot RT", "Crypto funding", "cTrader + TradingView", "ASIC + CySEC regulated", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "ARS 0", verdict: "Zero minimum with copy trading features and crypto funding for Argentine traders.", localAdvantages: ["No minimum deposit", "Crypto deposits", "Copy trading feature", "Spanish support", "Wide account variety"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "avatrade", badge: null, badgeColor: null, localCurrencyMin: "ARS 50,000", verdict: "Multi-platform broker with Spanish support and risk management tools.", localAdvantages: ["AvaProtect risk management", "Spanish support", "Multiple platforms", "Fixed and floating spreads", "Multi-regulated"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "Forex Regulation in Argentina",
    items: [
      { icon: "shield", title: "CNV Oversight", desc: "The Comisión Nacional de Valores (CNV) regulates securities markets in Argentina. While forex-specific regulation is limited, CNV oversees capital market activities and investor protection." },
      { icon: "landmark", title: "BCRA Capital Controls", desc: "The Banco Central de la República Argentina (BCRA) imposes strict capital controls (cepo cambiario) limiting USD purchases to $200/month for individuals. This significantly affects how Argentine traders fund forex accounts." },
      { icon: "alert-triangle", title: "Currency Restrictions", desc: "Argentina's multiple exchange rates (official, blue, MEP, CCL) create complexity for forex traders. Most traders use crypto (USDT) or MEP dollar to fund international broker accounts." },
      { icon: "piggy-bank", title: "International Protection", desc: "Since most Argentine traders use internationally regulated brokers (FCA, ASIC, CySEC), they benefit from fund segregation and regulatory oversight from these jurisdictions." },
      { icon: "bar-chart-3", title: "Tax Obligations", desc: "AFIP (Federal Administration of Public Revenue) requires Argentine residents to declare all foreign investment income, including forex profits, and pay applicable taxes." },
      { icon: "clipboard-list", title: "No Local Forex Licensing", desc: "Argentina does not have a specific licensing framework for retail forex brokers. International brokers operate outside CNV jurisdiction, making regulator quality essential when choosing a broker." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Argentina?", a: "Forex trading profits are subject to income tax (Ganancias) at progressive rates from 5% to 35%. Gains from financial instruments held in foreign accounts are taxed at 15%. All income must be declared to AFIP." },
    { q: "What About Bienes Personales (Wealth Tax)?", a: "Argentina charges Bienes Personales (personal property tax) on assets held abroad at rates from 0.5% to 2.25%. Your forex trading account balance as of December 31 must be declared and may be subject to this tax." },
    { q: "How Do Capital Controls Affect Forex Trading?", a: "BCRA's capital controls (cepo cambiario) limit USD purchases. Most Argentine traders fund accounts via crypto (USDT), MEP dollar, or CCL mechanisms. Withdrawals may also be affected by currency conversion restrictions." },
  ],

  payments: [
    { method: "Crypto (USDT)", deposit: "Free", withdrawal: "Network fee", time: "10-30 min", note: "Most popular" },
    { method: "Bank Transfer (USD)", deposit: "Free", withdrawal: "Varies", time: "1-3 days", note: "Via dollar account" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Subject to limits" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free–$5", time: "Instant / 1d", note: "E-wallets" },
  ],

  guide: [
    { q: "How to Fund a Forex Account from Argentina", a: "Due to capital controls, the most common methods are: 1. Crypto (USDT) — buy on local exchanges (Binance P2P, Lemon Cash) and send to broker. 2. MEP Dollar — convert ARS to USD via bond market. 3. International credit/debit card — subject to 75% surcharge on official rate." },
    { q: "Understanding Argentina's Exchange Rates", a: "Argentina has multiple exchange rates: Official (regulated), Blue (informal), MEP (via bonds), CCL (via stocks). For forex trading, the effective rate you get depends on how you fund your account. Crypto typically offers rates close to the blue dollar." },
    { q: "Best Trading Hours for Argentina", a: "Best times for Argentine traders: 5:00 AM – 7:00 AM ART (London open) and 10:30 AM – 1:00 PM ART (New York open). USD/ARS pairs are most active during US hours." },
    { q: "Is It Legal for Argentines to Trade Forex?", a: "Yes, forex trading is legal in Argentina. However, capital controls affect how you can send money abroad. Using internationally regulated brokers is legal, and you must declare all foreign investment income to AFIP." },
  ],

  faq: [
    { q: "What is the best forex broker in Argentina for 2026?", a: "Exness is our top pick for Argentine traders in 2026. It accepts crypto (USDT) deposits to bypass capital controls, has no minimum deposit, offers instant withdrawals, and provides Spanish-language support." },
    { q: "Is forex trading legal in Argentina?", a: "Yes, forex trading is legal. However, BCRA capital controls limit how much USD you can buy. Most Argentine traders use crypto (USDT) or MEP dollar to fund international broker accounts." },
    { q: "How do I deposit with capital controls?", a: "The most popular method is crypto (USDT). Buy USDT on a local exchange (Binance P2P, Lemon Cash, Buenbit), then send it to your broker. This bypasses BCRA's $200/month USD purchase limit." },
    { q: "What is the minimum deposit?", a: "Minimum deposits range from ARS 0 (Exness, Pepperstone, HFM) to ARS 50,000 (IC Markets, eToro). The actual USD equivalent varies significantly due to exchange rate fluctuations." },
    { q: "Are forex profits taxed in Argentina?", a: "Yes, forex profits are subject to income tax (5-35%) and foreign financial instrument gains are taxed at 15%. Assets abroad are also subject to Bienes Personales wealth tax." },
    { q: "What leverage is available?", a: "Most international brokers offer up to 1:500 leverage for Argentine traders. There is no local leverage cap, but high leverage significantly increases risk." },
  ],

  related: [
    { name: "Brokers in Brazil", icon: "🇧🇷", count: 10, url: "/best-forex-brokers-brazil" },
    { name: "Brokers in Chile", icon: "🇨🇱", count: 8, url: "/best-forex-brokers-chile" },
    { name: "Brokers in Colombia", icon: "🇨🇴", count: 8, url: "/best-forex-brokers-colombia" },
    { name: "Brokers in Mexico", icon: "🇲🇽", count: 10, url: "/best-forex-brokers-mexico" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best Low Deposit Brokers", icon: "piggy-bank", count: 10, url: "#" },
  ],
};

export default data;
