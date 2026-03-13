const data = {
  name: "Philippines", slug: "philippines", code: "PH", flag: "\u{1F1F5}\u{1F1ED}",
  regulator: "SEC", regulatorFull: "Securities and Exchange Commission Philippines",
  regulatorUrl: "https://www.sec.gov.ph", currency: "PHP",
  leverage: "1:100", leverageNote: "Offshore brokers — varies; no domestic leverage cap established",
  compensation: "No government compensation scheme for forex trading",
  negativeBalance: "Not mandatory — varies by broker",
  taxNote: "Forex profits may be classified as capital gains or ordinary income depending on trading frequency and nature.",
  localPayments: ["GCash", "Maya (PayMaya)", "Bank Transfer (BDO, BPI, Metrobank)", "Visa/Mastercard", "UnionBank Online"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 34, localBrokersTotal: 8, hoursResearch: 68,
  author: { name: "Carlo Reyes", role: "Southeast Asia Trading Analyst", exp: "9 years", initials: "CR", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Philippines for 2026 — Tested & Reviewed",
  metaDescription: "We analyzed brokers accessible to Filipino traders. These 10 offer the best trading conditions including strong international regulation, PHP funding, GCash support, and competitive spreads.",
  keyFinding: "The Philippines has a growing retail forex market, but domestic regulation for forex CFD trading is limited. The SEC Philippines has issued warnings against unlicensed platforms. Most Filipino traders use internationally-regulated brokers (ASIC, FCA, CySEC) that accept PHP deposits via GCash and local bank transfers.",

  brokers: [
    { rank: 1, slug: "exness", badge: "Best Overall Philippines", badgeColor: "#059669", localCurrencyMin: "\u20B10", verdict: "Best broker for Filipino traders. Instant PHP withdrawals via GCash, no minimum deposit, and strong execution.", localAdvantages: ["FCA + CySEC regulated", "Instant PHP withdrawals via GCash/Maya", "No minimum deposit", "Automatic withdrawal processing", "Filipino-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "\u20B1350", verdict: "Most beginner-friendly broker for Filipinos. Ultra-low deposit, micro lots, and strong education.", localAdvantages: ["CySEC + ASIC regulated", "PHP deposits via GCash & local banks", "Ultra-low minimum deposit \u20B1350", "Micro lot (0.01) trading", "Free webinars and education"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "pepperstone", badge: "Best Execution", badgeColor: "#d97706", localCurrencyMin: "\u20B10", verdict: "Fastest execution and tightest spreads. Top choice for Filipino traders who prioritise pricing.", localAdvantages: ["ASIC + FCA + CySEC regulated", "PHP deposits via local transfer", "Raw spreads from 0.0 pips", "TradingView + cTrader + MT4/MT5", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "\u20B110,000", verdict: "Tightest raw spreads at 0.02 pips EUR/USD. Best for Filipino scalpers and day traders.", localAdvantages: ["ASIC + CySEC regulated", "PHP deposits supported", "0.02 pip average EUR/USD spread", "25+ tier-1 liquidity providers", "cTrader + MT4/MT5 + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "\u20B15,000", verdict: "Lowest ECN commission among top brokers. Great for active Filipino traders.", localAdvantages: ["ASIC + CySEC regulated", "PHP deposits accepted", "Lowest commission at $6/lot RT", "4.8 Trustpilot rating", "cTrader + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "\u20B10", verdict: "Good copy trading platform with PHP support. Accessible for Filipino beginners.", localAdvantages: ["CySEC + FCA + FSCA regulated", "PHP deposits via local bank transfer", "HFcopy — copy trading", "No minimum deposit", "Low spreads from 0.0 pips"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "vantage", badge: null, badgeColor: null, localCurrencyMin: "\u20B12,500", verdict: "Competitive ECN broker with strong APAC presence and PHP deposit channels.", localAdvantages: ["ASIC + VFSC regulated", "PHP deposits via local transfer", "ECN spreads from 0.0 pips", "ProTrader with TradingView", "APAC timezone support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "avatrade", badge: null, badgeColor: null, localCurrencyMin: "\u20B15,000", verdict: "Well-regulated with strong risk management tools. Good for Filipino traders seeking protection.", localAdvantages: ["ASIC + multiple global licences", "PHP deposits supported", "AvaProtect risk management", "AvaSocial copy trading", "Comprehensive trading education"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "fxtm", badge: null, badgeColor: null, localCurrencyMin: "\u20B1500", verdict: "Low entry with strong copy trading features. Popular in the Philippines.", localAdvantages: ["FCA + CySEC regulated", "PHP deposits via local banks & GCash", "Low minimum deposit \u20B1500", "FXTM Invest copy trading", "Local payment channels"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "etoro", badge: "Best Copy Trading", badgeColor: "#2563eb", localCurrencyMin: "\u20B15,000", verdict: "Leading social trading platform for Filipino beginners interested in following experienced traders.", localAdvantages: ["FCA + CySEC + ASIC regulated", "PHP deposits accepted", "Copy Trading — follow top traders", "30M+ users worldwide", "User-friendly mobile app"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "Forex Regulation in the Philippines",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "SEC Philippines Oversight", desc: "The Securities and Exchange Commission Philippines oversees securities and investment products. Forex CFD trading is not specifically regulated as a distinct category, but the SEC has authority over investment contracts and has issued warnings against unlicensed platforms." },
      { icon: "\u{1F3E6}", title: "Bangko Sentral ng Pilipinas (BSP)", desc: "The BSP regulates foreign exchange transactions in the Philippines. BSP's Circular 1030 liberalised forex rules, allowing Filipinos to buy foreign currency up to $500,000/year from authorised agent banks without prior BSP approval." },
      { icon: "\u26A0\uFE0F", title: "SEC Investor Alerts", desc: "The SEC Philippines regularly publishes advisories against unlicensed forex and investment platforms. Check sec.gov.ph/advisories before investing. Many Filipinos have lost money to unregistered schemes." },
      { icon: "\u{1F310}", title: "International Brokers Dominate", desc: "Due to limited domestic forex CFD regulation, most Filipino traders use internationally-regulated brokers (ASIC, FCA, CySEC). These brokers are not SEC Philippines-registered but offer stronger global regulatory protection." },
      { icon: "\u{1F6AB}", title: "Binary Options & Scam Warnings", desc: "The SEC Philippines has specifically warned against binary options platforms and forex MLM schemes. These are not legitimate investment activities. Only trade with verifiable, internationally-regulated brokers." },
      { icon: "\u{1F4CB}", title: "KYC Requirements", desc: "International brokers require Filipino clients to submit valid government ID (passport, driver's licence, or national ID), proof of address, and sometimes a selfie with ID. GCash/Maya verification can speed up the process." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in the Philippines?", a: "Forex trading profits may be subject to income tax under the Philippines' Tax Reform for Acceleration and Inclusion (TRAIN) law. Individual income tax rates range from 0% (up to \u20B1250,000) to 35% (over \u20B18 million). The classification depends on whether profits are treated as capital gains or regular income." },
    { q: "Do I Need to Report Forex Income?", a: "If your forex trading generates significant and regular income, it should be reported on your annual Income Tax Return (BIR Form 1700 for employed, 1701 for self-employed). The BIR (Bureau of Internal Revenue) may classify active forex trading as business income." },
    { q: "Is There a Capital Gains Tax on Forex?", a: "The Philippines applies CGT to real property and unlisted shares, but forex trading profits don't clearly fall under the CGT framework. They are more likely treated as ordinary income (for active traders) or other income. Consult a Filipino tax professional for proper classification." },
    { q: "Can I Offset Trading Losses?", a: "If classified as business income, net operating losses from forex trading can be carried over as a deduction for the next 3 consecutive years (NOLCO provision). This requires proper documentation and filing as a business activity." },
  ],

  payments: [
    { method: "GCash", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Most popular in PH" },
    { method: "Maya (PayMaya)", deposit: "Free", withdrawal: "Free", time: "Instant", note: "E-wallet" },
    { method: "Bank Transfer (BDO, BPI)", deposit: "Free", withdrawal: "Free", time: "Instant–1d", note: "Major PH banks" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit/credit" },
  ],

  guide: [
    { q: "Is Forex Trading Legal in the Philippines?", a: "Forex trading is not explicitly banned in the Philippines. The SEC Philippines does not specifically regulate forex CFD trading, but it has authority over investment activities. Most Filipino traders use internationally-regulated brokers (ASIC, FCA, CySEC) without legal issues. Check SEC advisories for warnings against specific platforms." },
    { q: "How to Deposit PHP to an International Broker", a: "GCash is the most popular method — instant and free. Most top brokers also accept Maya (PayMaya) and direct bank transfers from BDO, BPI, and Metrobank. Your PHP is converted to USD at the broker's exchange rate." },
    { q: "Choosing a Broker as a Filipino Trader", a: "Prioritise: (1) International regulation (ASIC, FCA, CySEC), (2) PHP deposit/withdrawal channels (GCash, Maya), (3) Low minimum deposit, (4) Educational resources, (5) Negative balance protection. Avoid any broker on the SEC Philippines advisory list." },
    { q: "Avoiding Forex Scams in the Philippines", a: "The Philippines has seen many forex scams, especially on social media. Red flags: guaranteed daily/monthly returns, recruitment-based compensation (MLM), unverifiable regulation, and social media testimonials. Check sec.gov.ph/advisories and never send money to individuals." },
    { q: "Understanding PHP Currency Conversion", a: "When depositing PHP, funds convert to USD at the broker's rate (typically 0.5-1.5% spread). GCash and Maya often provide competitive rates. To minimize conversion costs, consider brokers that offer tight FX conversion rates and compare with the BSP reference rate." },
  ],

  faq: [
    { q: "What is the best forex broker in the Philippines for 2026?", a: "Exness is our top pick for Filipino traders. It offers instant PHP withdrawals via GCash, no minimum deposit, automatic withdrawal processing, and is regulated by the FCA and CySEC." },
    { q: "Is forex trading legal in the Philippines?", a: "Forex trading is not explicitly banned. The SEC Philippines doesn't specifically regulate forex CFDs, but most Filipino traders use internationally-regulated brokers without legal issues. Always avoid platforms on the SEC advisory list." },
    { q: "Can I deposit with GCash?", a: "Yes. Exness, XM, FXTM, and several other brokers accept GCash deposits. The process is instant and free. GCash is the most popular funding method for Filipino forex traders." },
    { q: "What is the minimum deposit in PHP?", a: "Exness, Pepperstone, and HFM have no minimum deposit. XM requires just \u20B1350. Most brokers accept instant PHP deposits via GCash, Maya, or local bank transfer." },
    { q: "Are forex profits taxed in the Philippines?", a: "Forex profits may be subject to income tax (0-35% under TRAIN law). The tax treatment depends on whether the activity is classified as investment income or business income. Consult a BIR-accredited tax professional." },
    { q: "What leverage is available?", a: "Through international brokers, Filipino traders can access leverage up to 1:500 (Exness) or 1:1000 depending on the broker. ASIC/CySEC-regulated entities may cap retail leverage at 1:30." },
    { q: "Which broker has the best Filipino support?", a: "Exness and XM offer the best Filipino/Tagalog support including customer service, educational content, and local payment integration. Both have strong APAC support teams." },
    { q: "How long do withdrawals take?", a: "GCash and Maya withdrawals are typically instant (under 1 hour) with Exness. Bank transfers take 1-2 business days. Visa/Mastercard withdrawals take 1-3 business days depending on your bank." },
  ],

  related: [
    { name: "Best Brokers with GCash", icon: "\u{1F4F1}", count: 8, url: "#" },
    { name: "Best Low Deposit Brokers", icon: "\u{1F4B0}", count: 10, url: "#" },
    { name: "Best for Beginners", icon: "\u{1F393}", count: 10, url: "#" },
    { name: "Brokers in Malaysia", icon: "\u{1F1F2}\u{1F1FE}", count: 10, url: "/best-forex-brokers-malaysia" },
    { name: "Brokers in Indonesia", icon: "\u{1F1EE}\u{1F1E9}", count: 10, url: "/best-forex-brokers-indonesia" },
    { name: "Brokers in Thailand", icon: "\u{1F1F9}\u{1F1ED}", count: 8, url: "/best-forex-brokers-thailand" },
  ],
};

export default data;
