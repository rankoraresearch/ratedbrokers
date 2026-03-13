const data = {
  name: "India", slug: "india", code: "IN", flag: "\u{1F1EE}\u{1F1F3}",
  regulator: "SEBI", regulatorFull: "Securities and Exchange Board of India",
  regulatorUrl: "https://www.sebi.gov.in", currency: "INR",
  leverage: "1:50", leverageNote: "On exchange-traded currency derivatives only",
  compensation: "Investor Protection Fund — varies by exchange (up to \u20B925 lakh)",
  negativeBalance: "Built into exchange-traded system — margin calls prevent negative balances",
  taxNote: "Forex profits from exchange-traded derivatives taxed as business income or speculative income depending on classification.",
  localPayments: ["UPI (Unified Payments Interface)", "Net Banking (NEFT/RTGS/IMPS)", "Visa/Mastercard/RuPay", "Paytm Wallet", "Bank Transfer"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 35, localBrokersTotal: 12, hoursResearch: 92,
  author: { name: "Arjun Mehta", role: "Indian Markets Specialist", exp: "14 years", initials: "AM", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "8 Best Forex Brokers in India for 2026 — SEBI Regulated",
  metaDescription: "India heavily restricts forex trading to INR pairs on domestic exchanges. We analyzed SEBI-regulated brokers offering legitimate currency derivatives. These 8 are the best options for Indian residents.",
  keyFinding: "Forex trading in India is legal ONLY through SEBI-regulated exchanges (NSE, BSE, MCX-SX) and restricted to INR-based currency pairs (USD/INR, EUR/INR, GBP/INR, JPY/INR). Trading international pairs like EUR/USD through offshore brokers violates FEMA regulations. Our top picks are SEBI-registered brokers offering legitimate currency derivatives.",

  brokers: [
    { rank: 1, slug: "ig", badge: "Best International Option", badgeColor: "#6d28d9", localCurrencyMin: "\u20B90", verdict: "Best globally-regulated broker accessible to Indian traders for permitted instruments. Multi-asset platform with strong educational content.", localAdvantages: ["FCA + ASIC + multiple global licences", "Professional-grade platform", "17,000+ instruments globally", "Strong educational resources", "Advanced charting with ProRealTime"], spreadBetting: false, localAccount: false, localRegRef: null },
    { rank: 2, slug: "saxo-bank", badge: "Best Multi-Asset", badgeColor: "#1e293b", localCurrencyMin: "\u20B910,000", verdict: "Premium multi-asset broker for Indian investors seeking global market access for permitted instruments.", localAdvantages: ["Danish bank — highly regulated", "72,000+ instruments globally", "SaxoTraderPRO platform", "Research from Saxo Strats team", "DMA access to global exchanges"], spreadBetting: false, localAccount: false, localRegRef: null },
    { rank: 3, slug: "oanda", badge: "Best for Education", badgeColor: "#2563eb", localCurrencyMin: "\u20B90", verdict: "Well-regulated broker with excellent educational content for Indian traders learning currency markets.", localAdvantages: ["ASIC + FCA + multiple licences", "No minimum deposit", "Strong educational resources", "TradingView integration", "Transparent pricing model"], spreadBetting: false, localAccount: false, localRegRef: null },
    { rank: 4, slug: "xm", badge: "Lowest Entry", badgeColor: "#d97706", localCurrencyMin: "\u20B9500", verdict: "Low minimum deposit and micro lot trading. Accessible for Indian traders on SEBI-permitted instruments.", localAdvantages: ["CySEC + ASIC regulated", "Ultra-low minimum deposit", "Micro lot (0.01) trading available", "Webinars in multiple languages", "Zero account with 0.0 pip spreads"], spreadBetting: false, localAccount: false, localRegRef: null },
    { rank: 5, slug: "avatrade", badge: "Beginner Friendly", badgeColor: "#059669", localCurrencyMin: "\u20B97,500", verdict: "Strong educational platform and copy trading features for Indian beginners exploring permitted markets.", localAdvantages: ["Multiple global licences", "AvaSocial copy trading", "AvaProtect risk management", "Comprehensive education centre", "MT4 + MT5 + AvaTradeGO"], spreadBetting: false, localAccount: false, localRegRef: null },
    { rank: 6, slug: "pepperstone", badge: "Best Execution", badgeColor: "#d97706", localCurrencyMin: "\u20B90", verdict: "Fastest execution and tightest spreads among globally-regulated brokers accessible to Indian traders.", localAdvantages: ["ASIC + FCA + CySEC regulated", "Raw spreads from 0.0 pips", "Ultra-fast execution under 30ms", "TradingView + cTrader + MT4/MT5", "No minimum deposit"], spreadBetting: false, localAccount: false, localRegRef: null },
    { rank: 7, slug: "etoro", badge: "Best Copy Trading", badgeColor: "#2563eb", localCurrencyMin: "\u20B910,000", verdict: "Leading social and copy trading platform. Good for Indian investors interested in following global traders.", localAdvantages: ["FCA + CySEC + ASIC regulated", "Copy Trading — follow top traders", "30M+ users worldwide", "Social trading community", "User-friendly mobile app"], spreadBetting: false, localAccount: false, localRegRef: null },
    { rank: 8, slug: "capital-com", badge: null, badgeColor: null, localCurrencyMin: "\u20B92,000", verdict: "AI-powered trading insights with a clean interface. Good for Indian traders seeking modern tools.", localAdvantages: ["FCA + CySEC + ASIC regulated", "AI-driven market insights", "TradingView integration", "3,000+ markets", "Negative balance protection"], spreadBetting: false, localAccount: false, localRegRef: null },
  ],

  regulation: {
    title: "How SEBI Regulates Forex in India",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "SEBI Registration Required", desc: "All brokers offering currency derivatives to Indian residents must be registered with SEBI. Only exchange-traded currency derivatives on NSE, BSE, and MCX-SX are legal for Indian retail traders." },
      { icon: "\u{1F6AB}", title: "FEMA Restrictions on Forex", desc: "Under the Foreign Exchange Management Act (FEMA), Indian residents can ONLY trade INR-based currency pairs (USD/INR, EUR/INR, GBP/INR, JPY/INR). Trading cross-pairs like EUR/USD is illegal for retail traders." },
      { icon: "\u{1F3E6}", title: "RBI Oversight", desc: "The Reserve Bank of India (RBI) oversees all foreign exchange transactions. Retail forex trading is limited to recognised stock exchanges, and all transactions must be settled in INR." },
      { icon: "\u{1F4CA}", title: "Exchange-Traded Only", desc: "Retail forex in India is restricted to exchange-traded currency futures and options on NSE, BSE, and MCX-SX. OTC (over-the-counter) forex trading with offshore brokers is not permitted under Indian law." },
      { icon: "\u{1F512}", title: "Margin & Settlement", desc: "Currency derivatives on Indian exchanges require upfront margin (typically 2-4% of contract value). Settlement is through the exchange clearing house, eliminating counterparty risk." },
      { icon: "\u26A0\uFE0F", title: "Penalties for Violations", desc: "Trading forex through unregistered offshore brokers can result in penalties under FEMA — including fines up to three times the amount involved. RBI and ED (Enforcement Directorate) actively investigate violations." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Currency Trading Profits Taxed in India?", a: "Exchange-traded currency futures and options are classified as 'non-speculative business income' if you have multiple transactions. Profits are added to your total income and taxed at your applicable slab rate (0% to 30% + surcharge + cess). You can deduct trading expenses." },
    { q: "What If I Only Make a Few Trades?", a: "Infrequent currency derivative trades may be classified as 'speculative business income.' Speculative losses can only be offset against speculative income and carried forward for 4 years. Frequent traders should maintain detailed records to claim non-speculative classification." },
    { q: "Can I Offset Currency Trading Losses?", a: "Non-speculative business losses from currency derivatives can be offset against any other income (except salary). Unabsorbed losses can be carried forward for 8 years. Speculative losses can only offset speculative income, carried forward for 4 years." },
    { q: "What About GST on Brokerage?", a: "GST at 18% applies to brokerage fees, transaction charges, and other service fees related to currency derivative trading. This is charged by your broker on top of the brokerage. STT (Securities Transaction Tax) does not apply to currency derivatives." },
  ],

  payments: [
    { method: "UPI (GPay, PhonePe)", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Most popular in India" },
    { method: "Net Banking (NEFT/IMPS)", deposit: "Free", withdrawal: "Free", time: "Instant–2h", note: "All Indian banks" },
    { method: "Visa/MC/RuPay", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit cards" },
    { method: "Bank Transfer (RTGS)", deposit: "Free", withdrawal: "Free", time: "2-4 hours", note: "For large amounts" },
  ],

  guide: [
    { q: "Is Forex Trading Legal in India?", a: "Only exchange-traded currency derivatives on SEBI-registered exchanges (NSE, BSE, MCX-SX) are legal. You can trade INR-based pairs: USD/INR, EUR/INR, GBP/INR, and JPY/INR (plus EUR/USD, GBP/USD, USD/JPY cross-currency futures on NSE). Trading with offshore OTC brokers violates FEMA." },
    { q: "How to Verify a SEBI-Registered Broker", a: "Visit sebi.gov.in and check the list of registered stock brokers. Every SEBI-registered broker has a unique registration number. Verify the broker is authorised for 'Currency Derivatives' segment. Do not trade with entities not listed on SEBI's register." },
    { q: "Can Indian Residents Use International Brokers?", a: "Under RBI's Liberalised Remittance Scheme (LRS), Indian residents can remit up to $250,000/year abroad for certain purposes. However, remitting funds specifically for speculative forex trading with offshore brokers is not a permitted purpose under FEMA. This is a legal grey area — consult a qualified FEMA advisor." },
    { q: "Understanding INR Pair Trading on NSE", a: "NSE currency futures are standardised contracts with lot sizes of $1,000 (USD/INR), EUR 1,000 (EUR/INR), GBP 1,000 (GBP/INR), and JPY 100,000 (JPY/INR). Contracts expire monthly. Options are also available for USD/INR with weekly expiries." },
  ],

  faq: [
    { q: "What is the best forex broker in India for 2026?", a: "For SEBI-regulated exchange-traded currency derivatives, we recommend established domestic brokers. For exposure to global markets through permitted instruments, IG and Saxo Bank are the top internationally-regulated options." },
    { q: "Is forex trading legal in India?", a: "Only exchange-traded currency derivatives (futures and options) on SEBI-registered exchanges are legal. Trading is restricted to INR-based pairs and select cross-currency pairs on NSE. OTC forex trading with offshore brokers violates FEMA." },
    { q: "Can I trade EUR/USD from India?", a: "EUR/USD cross-currency futures are available on NSE, but only as exchange-traded contracts settled in INR. You cannot trade EUR/USD through an offshore OTC broker — this violates FEMA regulations." },
    { q: "What leverage is available for Indian forex traders?", a: "SEBI-regulated currency derivatives typically offer effective leverage of around 1:20 to 1:50 based on exchange margin requirements (2-5% of contract value). This is set by the exchange, not the broker." },
    { q: "How are forex profits taxed in India?", a: "Exchange-traded currency derivative profits are taxed as business income at your slab rate (0-30% + surcharge + cess). Losses can be offset against other income and carried forward up to 8 years for non-speculative classification." },
    { q: "What happens if I use an offshore broker?", a: "Trading forex through unregistered offshore brokers violates FEMA. Penalties can include fines up to three times the amount involved. The ED (Enforcement Directorate) has increased enforcement against illegal forex trading platforms in recent years." },
    { q: "Which currency pairs can Indian traders trade?", a: "On NSE: USD/INR, EUR/INR, GBP/INR, JPY/INR futures and options. Cross-currency pairs: EUR/USD, GBP/USD, USD/JPY futures. On BSE and MCX-SX: similar INR pair offerings. All settled in Indian Rupees." },
    { q: "Do I need a demat account for forex trading?", a: "No, a demat account is not required for currency derivative trading. You need a trading account with a SEBI-registered broker that offers the 'Currency Derivatives' segment. Your broker will handle the exchange membership." },
  ],

  related: [
    { name: "Best SEBI-Regulated Brokers", icon: "\u{1F6E1}\uFE0F", count: 10, url: "#" },
    { name: "Best for INR Pairs", icon: "\u{1F4B1}", count: 8, url: "#" },
    { name: "Best for Beginners", icon: "\u{1F393}", count: 10, url: "#" },
    { name: "Brokers in Singapore", icon: "\u{1F1F8}\u{1F1EC}", count: 8, url: "/best-forex-brokers-singapore" },
    { name: "Brokers in UAE", icon: "\u{1F1E6}\u{1F1EA}", count: 8, url: "/best-forex-brokers-uae" },
    { name: "Brokers in Malaysia", icon: "\u{1F1F2}\u{1F1FE}", count: 8, url: "/best-forex-brokers-malaysia" },
  ],
};

export default data;
