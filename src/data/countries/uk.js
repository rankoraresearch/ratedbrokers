const data = {
  name: "United Kingdom", slug: "uk", code: "GB", flag: "\u{1F1EC}\u{1F1E7}",
  regulator: "FCA", regulatorFull: "Financial Conduct Authority",
  regulatorUrl: "https://www.fca.org.uk", currency: "GBP",
  leverage: "1:30", leverageNote: "Retail (1:500 for Professional)",
  compensation: "FSCS \u2014 \u00A385,000 per person",
  negativeBalance: "Yes \u2014 mandatory under FCA rules",
  taxNote: "Spread betting is tax-free. CFD profits are subject to Capital Gains Tax.",
  localPayments: ["Bank Transfer (Faster Payments)", "Visa/Mastercard", "PayPal", "Skrill", "Neteller"],
  year: "2026", updatedDate: "February 27, 2026",
  brokersTested: 54, localBrokersTotal: 38, hoursResearch: 96,
  author: { name: "David Kowalski", role: "Risk Management Expert", exp: "18 years", initials: "DK", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in UK for 2026 \u2014 FCA Regulated",
  metaDescription: "We tested 38 FCA-regulated brokers with real GBP accounts. These 10 offer the best trading conditions for UK traders including FSCS protection, GBP base accounts, and tax-free spread betting.",
  keyFinding: "FCA-regulated brokers consistently scored highest for fund safety in our tests. All top 5 UK brokers offer FSCS protection, segregated client funds, and negative balance protection \u2014 three layers of safety no offshore broker matches.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall UK", badgeColor: "#059669", localCurrencyMin: "\u00A30", verdict: "Best overall for UK traders. FCA-regulated, FSCS-protected, with spread betting and the fastest execution in our test.", localAdvantages: ["FCA-regulated since 2015", "FSCS \u00A385K protection", "Free spread betting account", "GBP base account \u2014 no conversion fees", "London office with local support"], spreadBetting: true, localAccount: true, localRegRef: "684312" },
    { rank: 2, slug: "ig", badge: "Most Trusted", badgeColor: "#6d28d9", localCurrencyMin: "\u00A3250", verdict: "The UK\u2019s most established broker. 50 years of operation, listed on London Stock Exchange, and the widest product range.", localAdvantages: ["FCA-regulated since 1974 \u2014 50+ years", "Listed on London Stock Exchange (LON:IGG)", "FSCS \u00A385K protection", "17,000+ markets including spread betting", "Award-winning proprietary platform"], spreadBetting: true, localAccount: true, localRegRef: "195355" },
    { rank: 3, slug: "cmc-markets", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "\u00A30", verdict: "Best proprietary platform for UK traders. Next Generation platform with advanced charting and 330+ forex pairs.", localAdvantages: ["FCA-regulated since 1989", "LSE-listed (LON:CMCX)", "FSCS \u00A385K protection", "330+ forex pairs \u2014 most of any UK broker", "Next Generation platform with 115 indicators"], spreadBetting: true, localAccount: true, localRegRef: "173730" },
    { rank: 4, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "\u00A3200", verdict: "Tightest raw spreads in our test at 0.02 pips average. Excellent for UK traders who prioritize execution quality.", localAdvantages: ["ASIC + CySEC regulated", "GBP base account available", "0.02 pip average EUR/USD spread", "Connection to 25+ tier-1 LPs", "cTrader + TradingView support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "saxo-bank", badge: "Best for Professionals", badgeColor: "#1e293b", localCurrencyMin: "\u00A3500", verdict: "Premium multi-asset platform ideal for wealthy UK traders. Access to 72,000+ instruments.", localAdvantages: ["FCA-regulated, Danish bank (SAXO.CO)", "FSCS \u00A385K protection", "72,000+ instruments across all asset classes", "DMA access to major stock exchanges", "Premium research from Saxo Strats team"], spreadBetting: true, localAccount: true, localRegRef: "551422" },
    { rank: 6, slug: "city-index", badge: null, badgeColor: null, localCurrencyMin: "\u00A30", verdict: "Established UK broker with 40+ years. Part of StoneX Group, offering excellent spread betting.", localAdvantages: ["FCA-regulated since 1983", "Part of NASDAQ-listed StoneX Group", "FSCS \u00A385K protection", "Tax-free spread betting", "TradingView integration included"], spreadBetting: true, localAccount: true, localRegRef: "113942" },
    { rank: 7, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "\u00A3100", verdict: "Lowest ECN commission among top-rated brokers. Strong for UK traders wanting raw pricing.", localAdvantages: ["ASIC + CySEC regulation", "GBP base account", "Lowest ECN commission at $6/lot RT", "4.8 Trustpilot \u2014 highest in this list", "cTrader + TradingView access"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "spreadex", badge: "UK Specialist", badgeColor: "#059669", localCurrencyMin: "\u00A30", verdict: "UK-only spread betting specialist. Unique combination of financial and sports spread betting.", localAdvantages: ["FCA-regulated UK-only broker", "FSCS \u00A385K protection", "Tax-free financial spread betting", "Sports + financial betting combined", "No minimum deposit, no inactivity fee"], spreadBetting: true, localAccount: true, localRegRef: "190941" },
    { rank: 9, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "\u00A3100", verdict: "Best for UK beginners interested in social/copy trading. Simple interface, but wider spreads.", localAdvantages: ["FCA-regulated with FSCS protection", "Copy Trading \u2014 follow top traders", "Fractional shares from \u00A310", "GBP deposits with free bank transfer", "30M+ users worldwide"], spreadBetting: false, localAccount: true, localRegRef: "583263" },
    { rank: 10, slug: "xtb", badge: null, badgeColor: null, localCurrencyMin: "\u00A30", verdict: "Strong all-rounder with excellent xStation platform. Good for both spread betting and real stocks.", localAdvantages: ["FCA-regulated, Warsaw Stock Exchange listed", "FSCS \u00A385K protection", "Tax-free spread betting", "0% commission real stocks up to \u00A3100K/mo", "Award-winning xStation 5 platform"], spreadBetting: true, localAccount: true, localRegRef: "522157" },
  ],

  regulation: {
    title: "How the FCA Protects UK Traders",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "FCA Authorisation Required", desc: "Any broker offering services to UK residents must be authorised by the FCA. Check any broker\u2019s FCA status at register.fca.org.uk before opening an account." },
      { icon: "\u{1F4B0}", title: "FSCS Compensation \u2014 \u00A385,000", desc: "If an FCA-regulated broker goes bankrupt, the Financial Services Compensation Scheme covers up to \u00A385,000 per person. This is one of the highest deposit protection schemes globally." },
      { icon: "\u2696\uFE0F", title: "Negative Balance Protection", desc: "FCA rules guarantee you can never lose more than you deposit. If your account goes negative due to extreme market moves, the broker must absorb the loss." },
      { icon: "\u{1F4CA}", title: "Leverage Cap: 1:30 Retail", desc: "FCA limits retail leverage to 1:30 for major forex pairs (1:20 for minor pairs, 1:2 for crypto). Professional clients can apply for up to 1:500 but lose FSCS protection." },
      { icon: "\u{1F6AB}", title: "Crypto Derivatives Banned", desc: "Since January 2021, the FCA banned the sale of crypto CFDs and derivatives to UK retail consumers. Only professional clients can trade crypto derivatives." },
      { icon: "\u{1F4CB}", title: "Risk Warnings & Transparency", desc: "FCA-regulated brokers must display the percentage of retail accounts that lose money. This figure is updated quarterly and typically ranges from 62% to 82%." },
    ],
  },

  comparisonTable: {
    title: "Spread Betting vs CFD Trading",
    subtitle: "The UK offers tax-free spread betting \u2014 here\u2019s how it compares to CFD trading.",
    headers: ["Feature", "Spread Betting", "CFD Trading"],
    rows: [
      ["Tax on Profits", "\u2705 Tax-free", "\u274C CGT applies"],
      ["Stamp Duty", "\u2705 Exempt", "\u2705 Exempt"],
      ["Loss Offset", "\u274C Cannot offset", "\u2705 Offset other gains"],
      ["Pricing", "Per point (e.g. \u00A310/pt)", "Per contract/lot"],
      ["Expiry", "Some positions expire", "No expiry"],
      ["DMA Access", "\u274C Not available", "\u2705 Some brokers"],
      ["Best For", "Tax-free, beginners", "Advanced, loss offset"],
    ],
  },

  tax: [
    { q: "Is Spread Betting Tax-Free?", a: "Yes. Under current HMRC rules, profits from spread betting are exempt from Capital Gains Tax (CGT) and Stamp Duty. This is because spread betting is classified as gambling, not investing. However, spread betting losses cannot be offset against other gains. If spread betting is your primary source of income, HMRC may reclassify you as a professional trader, making profits taxable." },
    { q: "How Are CFD Profits Taxed?", a: "CFD trading profits are subject to Capital Gains Tax. The CGT allowance for 2025/26 is \u00A33,000 per year. Profits above this allowance are taxed at 18% (basic rate) or 24% (higher rate). CFD losses can be offset against other capital gains, which is an advantage over spread betting for some traders." },
    { q: "Spread Betting vs CFDs: Which Is More Tax-Efficient?", a: "For most UK traders, spread betting is more tax-efficient because profits are completely tax-free. However, if you expect to make significant losses, CFDs may be preferable because those losses can reduce your other capital gains. High-frequency traders with very large profits should consult a tax advisor." },
    { q: "Do I Need to Report Forex Income?", a: "Spread betting profits do not need to be reported on your self-assessment tax return. CFD profits above the annual CGT allowance must be reported. If you\u2019re unsure whether your activity classifies as spread betting or CFD trading, check with your broker and consider seeking professional tax advice." },
  ],

  payments: [
    { method: "Bank Transfer", deposit: "Free", withdrawal: "Free", time: "Instant \u2013 1h", note: "Best for UK" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit cards" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Pepperstone, IG, eToro" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free\u2013\u00A35", time: "Instant / 1d", note: "E-wallet" },
  ],

  guide: [
    { q: "How to Verify an FCA Broker", a: "Visit register.fca.org.uk and search by firm name or reference number. Verify the firm\u2019s \u2018Current Status\u2019 shows \u2018Authorised\u2019 and check which activities they\u2019re permitted to perform. Never trade with a broker showing \u2018Not authorised\u2019 status." },
    { q: "Should UK Traders Choose Spread Betting or CFDs?", a: "If you\u2019re primarily looking to profit from short-term price movements, spread betting is usually better because profits are tax-free. If you\u2019re hedging an existing portfolio, CFDs are better because losses can offset gains." },
    { q: "What Happens If My UK Broker Goes Bankrupt?", a: "If your broker is FCA-authorised, your funds are held in segregated accounts separate from the broker\u2019s operating funds. If the broker still can\u2019t return your money, FSCS covers up to \u00A385,000 per person. This process typically takes 7\u201314 business days." },
    { q: "Can UK Traders Use Offshore Brokers?", a: "Technically yes, but we strongly advise against it. Offshore brokers without FCA authorisation are operating illegally. You lose FSCS protection, negative balance protection, and leverage limits. If something goes wrong, you have no legal recourse in UK courts." },
    { q: "Professional vs Retail Client Status", a: "UK traders can apply for Professional Client status, unlocking leverage up to 1:500. However, you lose: FSCS \u00A385,000 protection, negative balance guarantee, and certain protections. To qualify, you need 2 of 3: 10+ large trades per quarter, \u00A3500,000+ portfolio, or 1+ year in relevant financial role." },
  ],

  faq: [
    { q: "What is the best forex broker in the UK for 2026?", a: "Pepperstone is our top pick for UK traders in 2026. It\u2019s FCA-regulated (ref: 684312), offers FSCS protection, spread betting, raw ECN pricing from 0.0 pips, and GBP accounts with no minimum deposit." },
    { q: "Are forex profits taxable in the UK?", a: "It depends on how you trade. Spread betting profits are tax-free under current HMRC rules. CFD trading profits are subject to Capital Gains Tax above the \u00A33,000 annual allowance." },
    { q: "Is forex trading legal in the UK?", a: "Yes, forex trading is fully legal and regulated. The FCA oversees all forex brokers operating in the UK, ensuring strict standards for client protection, transparency, and fair dealing." },
    { q: "What leverage can UK traders use?", a: "FCA retail clients are limited to 1:30 on major forex pairs, 1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto (pros only). Professional clients can access up to 1:500 but lose FSCS protection." },
    { q: "Do UK brokers offer GBP accounts?", a: "All top 10 UK brokers in our ranking offer GBP base accounts, saving approximately 0.5-1% on every transaction compared to USD-only accounts." },
    { q: "What is the FSCS?", a: "The Financial Services Compensation Scheme is a UK government-backed safety net. If an FCA-regulated broker becomes insolvent, FSCS covers up to \u00A385,000 per person, typically processed within 7-14 days." },
    { q: "Can I trade crypto CFDs in the UK?", a: "No, since January 2021, the FCA banned crypto derivatives for retail consumers. Only Professional clients can trade crypto CFDs. You can still buy and hold actual crypto on regulated exchanges." },
    { q: "Which UK brokers offer spread betting?", a: "From our top 10: Pepperstone, IG Group, CMC Markets, Saxo Bank, City Index, Spreadex, and XTB all offer spread betting. IC Markets, FP Markets, and eToro do not." },
  ],

  related: [
    { name: "Best FCA-Regulated Brokers", icon: "\u{1F6E1}\uFE0F", count: 16, url: "#" },
    { name: "Best Spread Betting", icon: "\u{1F3AF}", count: 10, url: "#" },
    { name: "Best ECN Brokers", icon: "\u26A1", count: 12, url: "#" },
    { name: "Brokers in Australia", icon: "\u{1F1E6}\u{1F1FA}", count: 10, url: "/best-forex-brokers-australia" },
    { name: "Brokers in UAE", icon: "\u{1F1E6}\u{1F1EA}", count: 8, url: "/best-forex-brokers-uae" },
    { name: "Brokers in Germany", icon: "\u{1F1E9}\u{1F1EA}", count: 9, url: "/best-forex-brokers-germany" },
  ],
};

export default data;
