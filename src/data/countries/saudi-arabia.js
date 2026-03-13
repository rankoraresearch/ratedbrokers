const data = {
  name: "Saudi Arabia", slug: "saudi-arabia", code: "SA", flag: "🇸🇦",
  regulator: "CMA", regulatorFull: "Capital Market Authority",
  regulatorUrl: "https://cma.org.sa", currency: "SAR",
  leverage: "1:30", leverageNote: "Retail (up to 1:500 with offshore entities)",
  compensation: "No formal deposit compensation scheme",
  negativeBalance: "Yes — offered by most CMA-licensed brokers",
  localPayments: ["Bank Transfer (SARIE)", "Visa/Mastercard", "Mada", "STC Pay", "Apple Pay"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 38, localBrokersTotal: 22, hoursResearch: 72,
  author: { name: "Omar Farooq", role: "MENA Markets Specialist", exp: "14 years", initials: "OF", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Saudi Arabia for 2026 — CMA Regulated",
  metaDescription: "We analyzed 22 brokers accepting Saudi traders. These 10 offer the best trading conditions including CMA regulation, SAR deposits, and Sharia-compliant accounts.",
  keyFinding: "CMA-regulated brokers provide the strongest protection for Saudi traders. Our top picks all offer Islamic swap-free accounts, SAR base currencies, and Arabic-language support — essential for compliant trading in the Kingdom.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall KSA", badgeColor: "#059669", localCurrencyMin: "SAR 0", verdict: "Best overall for Saudi traders. Offers Islamic accounts, tight spreads, and full Arabic support with multiple platform options.", localAdvantages: ["Swap-free Islamic accounts available", "Arabic-language platform & support", "SAR deposits accepted via bank transfer", "Raw ECN spreads from 0.0 pips", "cTrader + TradingView support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "SAR 750", verdict: "Best raw spreads for Saudi traders. Lightning-fast execution and deep liquidity from 25+ LPs.", localAdvantages: ["Islamic swap-free account", "0.02 pip average EUR/USD spread", "Arabic customer support", "SAR deposits via local bank transfer", "MetaTrader 4/5 + cTrader"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "SAR 20", verdict: "Lowest minimum deposit and excellent educational content in Arabic. Ideal for Saudi beginners.", localAdvantages: ["Ultra-low SAR 20 minimum deposit", "Full Arabic education & webinars", "Islamic account with no swap fees", "Micro lot trading (0.01 lots)", "24/5 Arabic customer support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "exness", badge: "Best Islamic Account", badgeColor: "#059669", localCurrencyMin: "SAR 40", verdict: "Best swap-free conditions with automatic Islamic account for Saudi clients. Instant withdrawals.", localAdvantages: ["Automatic Islamic account for KSA", "Instant withdrawals 24/7", "SAR base currency account", "No minimum deposit on Standard", "Full Arabic platform & support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "SAR 750", verdict: "Best for Saudi traders wanting to copy successful investors. Simple interface with social features.", localAdvantages: ["Copy Trading — follow top investors", "Sharia-compliant portfolio options", "Arabic interface available", "Fractional shares from SAR 40", "30M+ users worldwide"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "avatrade", badge: "Best Platforms", badgeColor: "#6d28d9", localCurrencyMin: "SAR 375", verdict: "Multi-platform broker with strong Arabic support. AvaProtect risk management tool is unique.", localAdvantages: ["Islamic swap-free account", "AvaProtect risk management", "Arabic-language support", "AvaTradeGO mobile app", "Fixed and floating spreads"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "SAR 375", verdict: "Lowest commission ECN broker for Saudi traders. Strong for those wanting raw pricing.", localAdvantages: ["Islamic swap-free available", "Lowest ECN commission at $6/lot RT", "SAR deposits accepted", "cTrader + TradingView access", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "fxpro", badge: null, badgeColor: null, localCurrencyMin: "SAR 375", verdict: "Well-regulated multi-platform broker with Islamic accounts and competitive spreads.", localAdvantages: ["Islamic swap-free account", "Multiple platform choices", "Arabic customer support", "cTrader with advanced tools", "Regulated by FCA, CySEC, FSCA"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "SAR 0", verdict: "Zero minimum deposit and strong bonus programs. Good for Saudi traders starting small.", localAdvantages: ["No minimum deposit required", "Islamic account available", "Arabic-language support", "Copy trading feature", "Wide range of account types"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "tickmill", badge: null, badgeColor: null, localCurrencyMin: "SAR 375", verdict: "Competitive raw spreads with Islamic account options. Solid choice for Saudi scalpers.", localAdvantages: ["Islamic swap-free account", "Raw spreads from 0.0 pips", "Low commission at $4/lot RT", "Fast execution under 0.20s", "Regulated by FCA & CySEC"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How the CMA Protects Saudi Traders",
    items: [
      { icon: "shield", title: "CMA Authorisation", desc: "The Capital Market Authority regulates all securities and investment activities in Saudi Arabia. Brokers must hold a CMA licence to legally offer services to Saudi residents." },
      { icon: "file-text", title: "Authorised Persons Regulations", desc: "CMA enforces Authorised Persons Regulations requiring brokers to maintain capital adequacy, segregate client funds, and follow strict operational procedures." },
      { icon: "scale", title: "Sharia Compliance", desc: "Many CMA-licensed brokers offer Sharia-compliant (Islamic) trading accounts with no swap or interest charges, aligned with Islamic finance principles." },
      { icon: "piggy-bank", title: "Client Fund Segregation", desc: "CMA requires all licensed brokers to hold client funds in segregated accounts at Saudi banks, separate from the broker's operational capital." },
      { icon: "bar-chart-3", title: "Leverage Restrictions", desc: "CMA follows international best practices with leverage caps for retail traders. Most CMA-regulated brokers offer up to 1:30 for major forex pairs." },
      { icon: "clipboard-list", title: "Complaints & Dispute Resolution", desc: "Saudi traders can file complaints directly with the CMA through the official complaints portal. The CMA investigates and enforces penalties against non-compliant firms." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "Is Forex Trading Taxed in Saudi Arabia?", a: "Saudi Arabia does not impose personal income tax on individuals. Forex trading profits earned by Saudi residents are generally not subject to income tax. However, Zakat (2.5% Islamic wealth tax) may apply to your total assets including trading capital if they meet the Nisab threshold." },
    { q: "Do Companies Pay Tax on Trading Income?", a: "Saudi companies and foreign-owned businesses are subject to corporate income tax at 20% on trading profits. Saudi-owned companies pay Zakat at 2.5% instead of corporate income tax. The tax treatment depends on the ownership structure." },
    { q: "Are There VAT Implications?", a: "VAT at 15% applies to broker fees and commissions charged within Saudi Arabia. However, the underlying forex transactions themselves are generally VAT-exempt as financial services. Spreads charged by international brokers are typically not subject to Saudi VAT." },
  ],

  payments: [
    { method: "Bank Transfer (SARIE)", deposit: "Free", withdrawal: "Free", time: "1-3 hours", note: "Preferred for KSA" },
    { method: "Mada Debit Card", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Saudi debit cards" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Credit/debit" },
    { method: "STC Pay", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Select brokers" },
  ],

  guide: [
    { q: "How to Verify a Broker's CMA Licence", a: "Visit the CMA website at cma.org.sa and check the Authorised Persons list. Verify the broker's licence number and permitted activities. Never trade with an unlicensed broker — report them to CMA." },
    { q: "Is Forex Trading Halal in Saudi Arabia?", a: "Forex trading can be Sharia-compliant when using Islamic (swap-free) accounts that eliminate interest charges. Most brokers in our list offer dedicated Islamic accounts. Consult a qualified Islamic finance scholar if you have specific concerns." },
    { q: "What Is the Best Time to Trade in Saudi Arabia?", a: "The best trading hours for Saudi traders are 10:00 AM - 12:00 PM AST (London open overlap) and 4:00 PM - 7:00 PM AST (US session). The EUR/USD and GBP/USD pairs are most liquid during these windows." },
    { q: "Can Saudi Traders Use International Brokers?", a: "Saudi residents can use internationally regulated brokers, but CMA-licensed brokers offer the strongest local protection. International brokers regulated by FCA, ASIC, or CySEC are generally considered safe alternatives." },
    { q: "How to Open a Forex Trading Account in KSA", a: "Choose a broker from our list, submit your Saudi national ID or Iqama, proof of address, and complete the online application. Most accounts are approved within 24 hours. Fund via SARIE bank transfer for the fastest deposits." },
  ],

  faq: [
    { q: "What is the best forex broker in Saudi Arabia for 2026?", a: "Pepperstone is our top pick for Saudi traders in 2026. It offers Islamic swap-free accounts, tight raw spreads, Arabic-language support, and accepts SAR deposits with no minimum." },
    { q: "Is forex trading legal in Saudi Arabia?", a: "Yes, forex trading is legal and regulated by the Capital Market Authority (CMA). Saudi residents can trade with CMA-licensed brokers or internationally regulated brokers." },
    { q: "Do Saudi brokers offer Islamic accounts?", a: "Yes, all top brokers in our ranking offer Islamic (swap-free) accounts that comply with Sharia principles. These accounts eliminate overnight interest charges, replacing them with fixed administration fees or no charges at all." },
    { q: "What is the minimum deposit for Saudi traders?", a: "Minimum deposits range from SAR 0 (Pepperstone, HFM) to SAR 750 (IC Markets, eToro). XM offers the lowest meaningful minimum at just SAR 20." },
    { q: "Can I trade forex with SAR?", a: "Several brokers accept SAR deposits and offer SAR base accounts, eliminating currency conversion fees. Bank transfers via SARIE are the fastest local deposit method." },
    { q: "What leverage is available in Saudi Arabia?", a: "CMA-regulated brokers typically offer up to 1:30 leverage for retail traders. Some international brokers may offer higher leverage up to 1:500 through their offshore entities, though this carries additional risk." },
    { q: "Are forex profits taxed in Saudi Arabia?", a: "Saudi Arabia has no personal income tax, so individual forex trading profits are not taxed. However, Zakat obligations may apply to your total wealth including trading capital." },
    { q: "How do I deposit SAR to a forex broker?", a: "The fastest method is SARIE bank transfer, which typically processes within 1-3 hours. Mada debit cards offer instant deposits. Most brokers also accept Visa/Mastercard." },
  ],

  related: [
    { name: "Best Islamic Forex Brokers", icon: "landmark", count: 12, url: "#" },
    { name: "Best Brokers in UAE", icon: "🇦🇪", count: 10, url: "/best-forex-brokers-uae" },
    { name: "Best Brokers in Bahrain", icon: "🇧🇭", count: 8, url: "/best-forex-brokers-bahrain" },
    { name: "Best Brokers in Kuwait", icon: "🇰🇼", count: 8, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best Low Spread Brokers", icon: "trending-down", count: 10, url: "#" },
  ],
};

export default data;
