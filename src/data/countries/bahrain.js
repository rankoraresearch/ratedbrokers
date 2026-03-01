const data = {
  name: "Bahrain", slug: "bahrain", code: "BH", flag: "🇧🇭",
  regulator: "CBB", regulatorFull: "Central Bank of Bahrain",
  regulatorUrl: "https://www.cbb.gov.bh", currency: "BHD",
  leverage: "1:30", leverageNote: "Retail (up to 1:500 with offshore entities)",
  compensation: "No formal deposit insurance for investment firms",
  negativeBalance: "Yes — offered by most regulated brokers",
  localPayments: ["Bank Transfer", "Visa/Mastercard", "BenefitPay", "Apple Pay"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 32, localBrokersTotal: 16, hoursResearch: 64,
  author: { name: "Omar Farooq", role: "MENA Markets Specialist", exp: "14 years", initials: "OF", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "8 Best Forex Brokers in Bahrain for 2026 — CBB Regulated",
  metaDescription: "We tested 16 brokers accepting Bahraini traders with real BHD accounts. These 8 offer the best conditions including CBB regulation, Islamic accounts, and competitive spreads.",
  keyFinding: "Bahrain's CBB is one of the most progressive financial regulators in the Gulf. All our top-rated brokers offer Islamic swap-free accounts and accept BHD deposits, with several maintaining physical offices in Bahrain's financial district.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall Bahrain", badgeColor: "#059669", localCurrencyMin: "BHD 0", verdict: "Best overall for Bahraini traders. Tight spreads, Islamic accounts, and comprehensive Arabic support.", localAdvantages: ["Islamic swap-free accounts", "Arabic-language support", "BHD deposits accepted", "Raw ECN spreads from 0.0 pips", "cTrader + TradingView support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "BHD 75", verdict: "Tightest raw spreads available for Bahraini traders. Excellent execution and deep liquidity.", localAdvantages: ["Islamic swap-free account", "0.02 pip average EUR/USD", "BHD deposits via bank transfer", "25+ tier-1 liquidity providers", "MetaTrader 4/5 + cTrader"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "exness", badge: "Best Islamic Account", badgeColor: "#059669", localCurrencyMin: "BHD 4", verdict: "Best swap-free conditions with automatic Islamic accounts for Bahraini clients. Instant withdrawals.", localAdvantages: ["Automatic Islamic account for Bahrain", "Instant withdrawals 24/7", "Very low minimum deposit", "No swap fees on Islamic account", "Full Arabic platform"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "BHD 2", verdict: "Lowest minimum deposit and excellent education. Perfect for Bahraini beginners.", localAdvantages: ["BHD 2 minimum deposit", "Arabic webinars & education", "Islamic account available", "Micro lot trading (0.01 lots)", "24/5 Arabic support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "avatrade", badge: "Best Multi-Platform", badgeColor: "#6d28d9", localCurrencyMin: "BHD 38", verdict: "Multi-platform broker with strong Arabic support and AvaProtect risk management.", localAdvantages: ["Islamic swap-free account", "AvaProtect risk management", "Arabic customer support", "Multiple platform options", "Regulated by multiple authorities"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "BHD 38", verdict: "Lowest commission ECN broker available for Bahraini traders.", localAdvantages: ["Islamic account available", "Commission at $6/lot RT", "cTrader + TradingView", "ASIC + CySEC regulated", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "BHD 75", verdict: "Best for Bahraini traders wanting to copy successful investors.", localAdvantages: ["Copy Trading feature", "Arabic interface available", "Fractional shares", "Sharia-compliant options", "30M+ global users"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "BHD 0", verdict: "Zero minimum deposit with Islamic accounts and strong copy trading features.", localAdvantages: ["No minimum deposit", "Islamic account available", "Arabic support", "Copy trading feature", "Wide account type range"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How the CBB Protects Bahraini Traders",
    items: [
      { icon: "shield", title: "CBB Licensing", desc: "The Central Bank of Bahrain licenses and supervises all financial institutions operating in Bahrain. Investment firms must hold a Category 1 or 2 licence to offer forex trading services." },
      { icon: "file-text", title: "Volume 4 Regulations", desc: "CBB's Volume 4 regulations govern investment firms, setting requirements for capital adequacy, client fund segregation, and operational standards." },
      { icon: "scale", title: "Sharia Governance", desc: "Bahrain is a global hub for Islamic finance. The CBB has a dedicated Sharia governance framework ensuring Islamic financial products meet strict compliance standards." },
      { icon: "piggy-bank", title: "Client Fund Segregation", desc: "Licensed brokers must segregate client funds from operating capital in approved Bahraini banks, ensuring client money is protected if the broker faces financial difficulties." },
      { icon: "landmark", title: "Bahrain Fintech Hub", desc: "Bahrain's progressive regulatory sandbox allows innovative fintech firms to operate under CBB oversight, fostering innovation while maintaining investor protection." },
      { icon: "clipboard-list", title: "Complaint Mechanism", desc: "Bahraini traders can file complaints with CBB directly. The regulator investigates and can impose sanctions, fines, or licence revocations on non-compliant firms." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "Is Forex Trading Taxed in Bahrain?", a: "Bahrain has no personal income tax, no capital gains tax, and no withholding tax on investment income. Forex trading profits earned by Bahraini residents are completely tax-free for individuals." },
    { q: "Are There Corporate Taxes on Trading?", a: "Bahrain does not levy corporate income tax on most businesses. However, oil and gas companies pay a 46% tax rate. Financial services firms may be subject to specific regulatory fees but not income tax on trading profits." },
    { q: "What About VAT on Broker Fees?", a: "Bahrain introduced VAT at 10% in 2019. Financial services including broker commissions may be subject to VAT. However, the forex spread itself is generally VAT-exempt as a financial transaction." },
  ],

  payments: [
    { method: "Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-3 hours", note: "Local banks" },
    { method: "BenefitPay", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Select brokers" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Credit/debit" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free–$5", time: "Instant / 1d", note: "E-wallets" },
  ],

  guide: [
    { q: "How to Verify a Broker's CBB Licence", a: "Visit the CBB website at cbb.gov.bh and check the licensed financial institutions list. Verify the broker holds a valid Category 1 or 2 investment firm licence. Report any unlicensed entities to CBB." },
    { q: "Is Forex Trading Halal?", a: "Forex trading can be Sharia-compliant when using Islamic swap-free accounts. Bahrain is a global Islamic finance hub, and all brokers in our list offer dedicated Islamic accounts. Consult a Sharia scholar for specific guidance." },
    { q: "Best Trading Hours for Bahrain", a: "The best trading hours for Bahraini traders are 11:00 AM – 1:00 PM (London open overlap) and 4:30 PM – 7:30 PM (US session). Major pairs like EUR/USD see peak liquidity during these times." },
    { q: "How to Open a Forex Account in Bahrain", a: "Choose a broker from our list, submit your Bahraini ID or CPR, proof of address, and complete the online application. Most accounts are approved within 24 hours. Fund via local bank transfer for the fastest processing." },
  ],

  faq: [
    { q: "What is the best forex broker in Bahrain for 2026?", a: "Pepperstone is our top pick for Bahraini traders in 2026. It offers Islamic swap-free accounts, raw ECN spreads from 0.0 pips, Arabic support, and accepts BHD deposits with no minimum." },
    { q: "Is forex trading legal in Bahrain?", a: "Yes, forex trading is legal and regulated by the Central Bank of Bahrain (CBB). Bahraini residents can trade with CBB-licensed firms or internationally regulated brokers." },
    { q: "Do Bahraini brokers offer Islamic accounts?", a: "Yes, all top brokers in our ranking offer Islamic swap-free accounts. Bahrain is a global Islamic finance centre, and Sharia-compliant trading is widely available." },
    { q: "What is the minimum deposit in Bahrain?", a: "Minimum deposits range from BHD 0 (Pepperstone, HFM) to BHD 75 (IC Markets, eToro). XM offers an ultra-low BHD 2 minimum deposit." },
    { q: "Are forex profits taxed in Bahrain?", a: "No. Bahrain has no personal income tax or capital gains tax. Forex trading profits are completely tax-free for individual Bahraini residents." },
    { q: "What leverage can Bahraini traders use?", a: "Most regulated brokers offer up to 1:30 leverage for retail traders. Some international brokers provide higher leverage through offshore entities, but this carries increased risk." },
  ],

  related: [
    { name: "Best Islamic Forex Brokers", icon: "landmark", count: 12, url: "#" },
    { name: "Brokers in Saudi Arabia", icon: "🇸🇦", count: 10, url: "/best-forex-brokers-saudi-arabia" },
    { name: "Brokers in UAE", icon: "🇦🇪", count: 10, url: "/best-forex-brokers-uae" },
    { name: "Brokers in Kuwait", icon: "🇰🇼", count: 8, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best Low Spread Brokers", icon: "trending-down", count: 10, url: "#" },
  ],
};

export default data;
