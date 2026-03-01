const data = {
  name: "Australia", slug: "australia", code: "AU", flag: "\u{1F1E6}\u{1F1FA}",
  regulator: "ASIC", regulatorFull: "Australian Securities and Investments Commission",
  regulatorUrl: "https://www.asic.gov.au", currency: "AUD",
  leverage: "1:30", leverageNote: "Retail (1:500 for Professional via offshore entity)",
  compensation: "No government compensation scheme",
  negativeBalance: "Yes \u2014 mandatory under ASIC rules since 2021",
  taxNote: "Forex profits are assessable income or capital gains depending on trading frequency.",
  localPayments: ["Bank Transfer (BPAY/PayID)", "Visa/Mastercard", "POLi", "PayPal", "Skrill"],
  year: "2026", updatedDate: "February 28, 2026",
  brokersTested: 48, localBrokersTotal: 32, hoursResearch: 88,
  author: { name: "James Mitchell", role: "Derivatives Trading Analyst", exp: "14 years", initials: "JM", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Australia for 2026 \u2014 ASIC Regulated",
  metaDescription: "We tested 32 ASIC-regulated brokers with real AUD accounts. These 10 offer the best trading conditions for Australian traders including negative balance protection and true ECN pricing.",
  keyFinding: "Australian traders benefit from a mature regulatory environment under ASIC. Our top-rated brokers all hold AFS licences, offer AUD base accounts, and comply with ASIC\u2019s 2021 product intervention order on leverage and negative balance protection.",

  brokers: [
    { rank: 1, slug: "ic-markets", badge: "Best Overall Australia", badgeColor: "#059669", localCurrencyMin: "A$200", verdict: "Australia\u2019s largest forex broker by volume. ASIC-regulated with true ECN pricing, 0.0 pip raw spreads, and the fastest execution in our test.", localAdvantages: ["ASIC-regulated (AFS 335692)", "Sydney-based HQ with local support", "AUD base account \u2014 no conversion fees", "True ECN with 25+ liquidity providers", "cTrader + TradingView + MT4/5"], spreadBetting: false, localAccount: true, localRegRef: "335692" },
    { rank: 2, slug: "pepperstone", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "A$0", verdict: "Excellent all-rounder for Australian traders. Melbourne-based, ASIC-regulated, with award-winning platforms and no minimum deposit.", localAdvantages: ["ASIC-regulated (AFS 414530)", "Melbourne HQ \u2014 Australian-founded", "No minimum deposit", "TradingView + cTrader + MT4/5", "Free Smart Trader Tools"], spreadBetting: false, localAccount: true, localRegRef: "414530" },
    { rank: 3, slug: "fp-markets", badge: "Best Value", badgeColor: "#d97706", localCurrencyMin: "A$100", verdict: "Sydney-based broker offering the lowest commissions for Australian traders. Raw ECN at A$6/lot round trip.", localAdvantages: ["ASIC-regulated (AFS 286354)", "Sydney HQ \u2014 20+ years operation", "Lowest ECN commission A$6/lot RT", "AUD base account with BPAY/PayID", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: "286354" },
    { rank: 4, slug: "ig", badge: "Most Trusted", badgeColor: "#6d28d9", localCurrencyMin: "A$0", verdict: "Globally trusted broker with 50 years of history. 17,000+ markets and a premium platform for Australian traders.", localAdvantages: ["ASIC-regulated (AFS 220440)", "50+ years global operation", "17,000+ markets available", "ASX-listed CFDs on equities", "Premium ProRealTime charting free"], spreadBetting: false, localAccount: true, localRegRef: "220440" },
    { rank: 5, slug: "cmc-markets", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "A$0", verdict: "Best proprietary platform for Australian traders. ASX-listed, with 330+ forex pairs and advanced Next Generation platform.", localAdvantages: ["ASIC-regulated (AFS 238054)", "ASX-listed (ASX:CMC)", "330+ forex pairs \u2014 industry leading", "Next Generation platform", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: "238054" },
    { rank: 6, slug: "fusion-markets", badge: "Lowest Cost", badgeColor: "#d97706", localCurrencyMin: "A$0", verdict: "Ultra-low cost Australian broker. Just A$4.50/lot RT commission and no minimum deposit.", localAdvantages: ["ASIC-regulated (AFS 385620)", "Melbourne-based broker", "A$4.50/lot \u2014 lowest commission in AU", "No minimum deposit, no inactivity fee", "AUD base account with PayID"], spreadBetting: false, localAccount: true, localRegRef: "385620" },
    { rank: 7, slug: "go-markets", badge: null, badgeColor: null, localCurrencyMin: "A$200", verdict: "Melbourne-based broker established in 2006. Solid choice for Australian traders wanting local support.", localAdvantages: ["ASIC-regulated (AFS 254963)", "Melbourne HQ since 2006", "AUD base account", "Copy trading via MetaTrader Signals", "Local bank transfer via PayID"], spreadBetting: false, localAccount: true, localRegRef: "254963" },
    { rank: 8, slug: "vantage", badge: null, badgeColor: null, localCurrencyMin: "A$200", verdict: "Sydney-based broker with competitive raw spreads and strong platform variety.", localAdvantages: ["ASIC-regulated (AFS 428901)", "Sydney HQ", "Raw ECN spreads from 0.0 pips", "TradingView + ProTrader + MT4/5", "AUD deposits via BPAY"], spreadBetting: false, localAccount: true, localRegRef: "428901" },
    { rank: 9, slug: "axi", badge: null, badgeColor: null, localCurrencyMin: "A$0", verdict: "Sydney-founded broker with strong MT4 integration and competitive pricing for Australian traders.", localAdvantages: ["ASIC-regulated (AFS 318232)", "Sydney-founded, global presence", "No minimum deposit", "AutoChartist and PsyQuation analytics", "AUD base account"], spreadBetting: false, localAccount: true, localRegRef: "318232" },
    { rank: 10, slug: "thinkmarkets", badge: null, badgeColor: null, localCurrencyMin: "A$0", verdict: "Melbourne-based broker with proprietary ThinkTrader platform and strong mobile trading experience.", localAdvantages: ["ASIC-regulated (AFS 424700)", "Melbourne HQ", "ThinkTrader proprietary platform", "No minimum deposit", "AUD base account with local transfers"], spreadBetting: false, localAccount: true, localRegRef: "424700" },
  ],

  regulation: {
    title: "How ASIC Protects Australian Traders",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "AFS Licence Required", desc: "Any broker offering derivatives to Australian residents must hold an Australian Financial Services (AFS) licence. Verify any broker\u2019s licence at ASIC\u2019s Connect professional register before opening an account." },
      { icon: "\u26A0\uFE0F", title: "Product Intervention Order", desc: "Since March 2021, ASIC\u2019s product intervention order limits retail leverage to 1:30 for major forex pairs, requires negative balance protection, and bans retail incentives like bonuses." },
      { icon: "\u2696\uFE0F", title: "Negative Balance Protection", desc: "ASIC rules guarantee retail clients cannot lose more than their deposited funds. If your account goes negative due to extreme market moves, the broker must absorb the loss." },
      { icon: "\u{1F4CA}", title: "Leverage Cap: 1:30 Retail", desc: "ASIC limits retail leverage to 1:30 for major forex pairs, 1:20 for minor pairs/gold, 1:10 for commodities, 1:5 for equity CFDs, and 1:2 for crypto CFDs." },
      { icon: "\u{1F4B0}", title: "Client Money Rules", desc: "ASIC requires brokers to hold client funds in segregated trust accounts with Australian ADIs (banks). Brokers cannot use client funds for hedging or operating expenses." },
      { icon: "\u{1F4CB}", title: "Target Market Determinations", desc: "Since October 2021, brokers must publish Target Market Determinations (TMDs) for each product. These documents clearly outline who the product is designed for and the associated risks." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Australia?", a: "Forex profits are generally taxed as either income or capital gains, depending on your trading activity. If you trade frequently and it\u2019s your primary income, the ATO may classify you as a \u2018trader\u2019 and profits are assessed as ordinary income at your marginal tax rate. If you trade occasionally, profits may be treated as capital gains with the 50% CGT discount for assets held over 12 months." },
    { q: "Do I Need an ABN for Forex Trading?", a: "Most retail forex traders do not need an ABN. However, if the ATO classifies your trading as a business activity (frequent trading, systematic approach, profit-making intent), you may need to register for an ABN and report income accordingly. Consult a tax professional if your trading is frequent." },
    { q: "Can I Claim Trading Expenses as Deductions?", a: "Yes. If classified as a trader, you can deduct trading-related expenses including platform subscriptions, data feeds, internet costs, education courses, and home office expenses. If classified as an investor, deductions are more limited. Keep detailed records of all trading-related expenses." },
    { q: "Is There GST on Forex Trading?", a: "Financial supplies including forex trading are generally GST-free in Australia. You don\u2019t charge or pay GST on forex transactions. However, commissions and fees charged by your broker are also GST-free as they relate to financial supply." },
  ],

  payments: [
    { method: "Bank Transfer (PayID/BPAY)", deposit: "Free", withdrawal: "Free", time: "Instant \u2013 1h", note: "Best for AU" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit cards" },
    { method: "POLi", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "AU bank only" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "IC Markets, Pepperstone" },
  ],

  guide: [
    { q: "How to Verify an ASIC-Regulated Broker", a: "Visit ASIC\u2019s Connect professional register (connectonline.asic.gov.au) and search by the broker\u2019s AFS licence number or name. Confirm the licence status is \u2018Current\u2019 and check which financial services the broker is authorised to provide." },
    { q: "Should Australian Traders Use a Local Broker?", a: "Using an ASIC-regulated Australian broker ensures compliance with local laws, AUD base accounts, fast local bank transfers (PayID/BPAY), and access to AFCA dispute resolution. Offshore brokers may offer higher leverage but lack these protections." },
    { q: "What Happens If My ASIC Broker Goes Bankrupt?", a: "Unlike the UK\u2019s FSCS, Australia has no government compensation scheme for retail client funds. However, ASIC requires brokers to hold client funds in segregated trust accounts with Australian banks, which provides a level of protection. This makes choosing a well-capitalised broker essential." },
    { q: "Can Australian Traders Access Higher Leverage?", a: "ASIC limits retail leverage to 1:30. Some brokers offer offshore entities (e.g., Bahamas, Seychelles) with higher leverage, but you lose ASIC protections. We recommend staying with the ASIC-regulated entity for safety." },
    { q: "How to Use AFCA for Disputes", a: "The Australian Financial Complaints Authority (AFCA) handles disputes between consumers and ASIC-regulated firms. If you have a complaint, first contact your broker. If unresolved, lodge a complaint at afca.org.au. The service is free for consumers." },
  ],

  faq: [
    { q: "What is the best forex broker in Australia for 2026?", a: "IC Markets is our top pick for Australian traders in 2026. It\u2019s ASIC-regulated (AFS 335692), Sydney-based, offers true ECN pricing from 0.0 pips, AUD base accounts, and the deepest liquidity in our test." },
    { q: "Are forex profits taxable in Australia?", a: "Yes. Forex profits are either assessed as income or capital gains depending on your trading frequency. Frequent traders are taxed at their marginal rate. Occasional traders may qualify for the 50% CGT discount on positions held over 12 months." },
    { q: "Is forex trading legal in Australia?", a: "Yes, forex trading is fully legal and regulated in Australia. ASIC oversees all brokers offering derivatives to Australian residents, ensuring compliance with strict client protection rules." },
    { q: "What leverage can Australian traders use?", a: "ASIC retail clients are limited to 1:30 on major forex pairs, 1:20 for minor pairs and gold, 1:10 for commodities, 1:5 for equities, and 1:2 for crypto CFDs." },
    { q: "Is there deposit protection in Australia?", a: "Australia does not have a government-backed deposit compensation scheme like the UK\u2019s FSCS. However, ASIC requires brokers to hold client funds in segregated trust accounts with Australian banks, providing structural protection." },
    { q: "What is the minimum deposit for Australian brokers?", a: "Many top ASIC-regulated brokers have no minimum deposit, including Pepperstone, CMC Markets, Fusion Markets, and Axi. IC Markets and Go Markets require A$200." },
    { q: "Can I trade crypto CFDs in Australia?", a: "Yes, but with restrictions. ASIC limits retail crypto CFD leverage to 1:2. Unlike the UK, crypto derivatives are not banned for retail traders in Australia." },
    { q: "Which Australian brokers offer TradingView?", a: "From our top 10: IC Markets, Pepperstone, FP Markets, and Vantage all offer native TradingView integration. This lets you trade directly from TradingView charts." },
  ],

  related: [
    { name: "Best ASIC-Regulated Brokers", icon: "\u{1F6E1}\uFE0F", count: 14, url: "#" },
    { name: "Best ECN Brokers", icon: "\u26A1", count: 12, url: "#" },
    { name: "Best Low-Cost Brokers", icon: "\u{1F4B0}", count: 10, url: "#" },
    { name: "Brokers in UK", icon: "\u{1F1EC}\u{1F1E7}", count: 10, url: "/best-forex-brokers-uk" },
    { name: "Brokers in Singapore", icon: "\u{1F1F8}\u{1F1EC}", count: 8, url: "/best-forex-brokers-singapore" },
    { name: "Brokers in South Africa", icon: "\u{1F1FF}\u{1F1E6}", count: 9, url: "/best-forex-brokers-south-africa" },
  ],
};

export default data;
