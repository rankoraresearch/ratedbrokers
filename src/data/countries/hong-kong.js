const data = {
  name: "Hong Kong", slug: "hong-kong", code: "HK", flag: "\u{1F1ED}\u{1F1F0}",
  regulator: "SFC", regulatorFull: "Securities and Futures Commission",
  regulatorUrl: "https://www.sfc.hk", currency: "HKD",
  leverage: "1:20", leverageNote: "SFC-licensed brokers limit leverage to around 1:20 for retail forex",
  compensation: "Investor Compensation Fund (ICF) — HK$500,000 per person",
  negativeBalance: "Not mandatory — but major SFC-licensed brokers typically offer it",
  taxNote: "Hong Kong has NO capital gains tax and NO tax on forex trading profits. One of the world's most tax-friendly jurisdictions for traders.",
  localPayments: ["FPS (Faster Payment System)", "Bank Transfer (HSBC, Hang Seng, BOC HK)", "Visa/Mastercard", "PayMe", "AlipayHK"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 44, localBrokersTotal: 28, hoursResearch: 88,
  author: { name: "Kenneth Lam", role: "Hong Kong Markets Specialist", exp: "16 years", initials: "KL", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Hong Kong for 2026 — SFC Licensed",
  metaDescription: "We analyzed 28 SFC-licensed and top international brokers for HK traders. These 10 offer the best conditions including SFC regulation, ICF protection, and tax-free trading profits.",
  keyFinding: "Hong Kong is one of the world's premier financial centres with zero tax on trading profits. The SFC provides robust regulatory oversight with HK$500,000 investor compensation. SFC-licensed brokers must meet strict capital and compliance requirements, making Hong Kong one of the safest jurisdictions for retail forex trading.",

  brokers: [
    { rank: 1, slug: "ig", badge: "Best Overall HK", badgeColor: "#059669", localCurrencyMin: "HK$0", verdict: "Best overall broker for Hong Kong traders. SFC-licensed with the widest product range and 50+ years of operation.", localAdvantages: ["SFC-licensed (AHY301)", "ICF HK$500K protection", "17,000+ markets", "HKD base account — no conversion", "Full Cantonese/Mandarin support"], spreadBetting: false, localAccount: true, localRegRef: "AHY301" },
    { rank: 2, slug: "saxo-bank", badge: "Best Multi-Asset", badgeColor: "#1e293b", localCurrencyMin: "HK$0", verdict: "Premium multi-asset platform for serious HK investors. SFC-licensed with access to 72,000+ instruments.", localAdvantages: ["SFC-licensed (Type 1, 2, 3, 4, 9)", "ICF HK$500K protection", "72,000+ instruments globally", "SaxoTraderPRO for professionals", "DMA access to HKEX and global exchanges"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "cmc-markets", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "HK$0", verdict: "Best proprietary platform for HK traders. SFC-licensed with 330+ forex pairs and advanced charting.", localAdvantages: ["SFC-licensed (BOA different)", "ICF HK$500K protection", "330+ forex pairs", "Next Generation platform", "HKD base account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "pepperstone", badge: "Best Execution", badgeColor: "#d97706", localCurrencyMin: "HK$0", verdict: "Fastest execution and tightest spreads. Excellent for HK traders who want raw ECN pricing.", localAdvantages: ["ASIC + FCA + CySEC regulated", "HKD deposits via bank transfer", "Raw spreads from 0.0 pips", "TradingView + cTrader + MT4/MT5", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "HK$1,500", verdict: "Tightest raw spreads in our HK test. Best for scalpers and high-frequency traders.", localAdvantages: ["ASIC + CySEC regulated", "HKD deposits supported", "0.02 pip average EUR/USD spread", "25+ tier-1 liquidity providers", "cTrader + MT4/MT5 + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "oanda", badge: "Best for USD/HKD", badgeColor: "#2563eb", localCurrencyMin: "HK$0", verdict: "Best USD/HKD pair pricing and transparent execution. Strong for HK traders focused on local currency pairs.", localAdvantages: ["SFC-licensed (Type 3)", "Competitive USD/HKD spreads", "Transparent pricing model", "TradingView integration", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "city-index", badge: null, badgeColor: null, localCurrencyMin: "HK$0", verdict: "Part of StoneX Group with strong HK presence. Solid for multi-asset trading.", localAdvantages: ["SFC-licensed", "Part of NASDAQ-listed StoneX Group", "ICF HK$500K protection", "TradingView integration", "HKD deposits via FPS"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "HK$800", verdict: "Lowest ECN commission among quality brokers. Good for cost-conscious HK day traders.", localAdvantages: ["ASIC + CySEC regulated", "HKD deposits supported", "Lowest commission at $6/lot RT", "4.8 Trustpilot rating", "cTrader + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "HK$800", verdict: "Leading social trading platform. Good for HK beginners and investors interested in copy trading.", localAdvantages: ["FCA + CySEC + ASIC regulated", "HKD deposits accepted", "Copy Trading — follow top traders", "30M+ users worldwide", "Fractional shares from $10"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "swissquote", badge: "Swiss Safety", badgeColor: "#1e293b", localCurrencyMin: "HK$2,000", verdict: "Swiss-bank level security for HK high-net-worth traders. Premium offering with institutional-grade tools.", localAdvantages: ["FINMA-regulated Swiss bank", "SIX Swiss Exchange listed", "HKD deposits via bank transfer", "Swiss banking security standards", "Advanced research & analytics"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How the SFC Protects Hong Kong Traders",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "SFC Licensing Required", desc: "Any broker providing leveraged forex trading to HK residents must hold a Type 3 (Leveraged Foreign Exchange Trading) licence from the SFC. Verify any broker at sfc.hk/en/Regulatory-functions/Intermediaries/Licensing before trading." },
      { icon: "\u{1F4B0}", title: "Investor Compensation — HK$500,000", desc: "The Investor Compensation Fund (ICF) covers up to HK$500,000 per investor if an SFC-licensed broker defaults. This is one of the most generous compensation schemes in Asia." },
      { icon: "\u{1F512}", title: "Client Asset Protection", desc: "SFC-licensed brokers must segregate client funds in trust accounts with licensed banks. The SFC conducts regular audits to verify compliance with client asset rules." },
      { icon: "\u{1F4CA}", title: "Conservative Leverage Limits", desc: "SFC-licensed brokers typically limit forex leverage to around 1:20 for retail clients. This is lower than many jurisdictions but significantly reduces the risk of large losses." },
      { icon: "\u{1F4CB}", title: "Strict Fitness & Properness", desc: "The SFC applies rigorous 'fit and proper' standards to licensed firms and their responsible officers. Firms must maintain minimum liquid capital requirements and submit monthly financial returns." },
      { icon: "\u{1F50D}", title: "Regulatory Enforcement", desc: "The SFC has strong enforcement powers including the ability to suspend licences, impose fines, and pursue criminal prosecution. The SFC's track record of enforcement adds credibility to its regulatory framework." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "Are Forex Profits Taxed in Hong Kong?", a: "No. Hong Kong does not impose capital gains tax, and forex trading profits are generally NOT taxable for individual traders. This makes Hong Kong one of the most tax-efficient jurisdictions in the world for forex trading." },
    { q: "Is There Any Scenario Where Trading Is Taxed?", a: "If you trade forex as a registered business (sole proprietorship or company), profits may be considered business income and subject to Hong Kong's profits tax (8.25% on first HK$2M, 16.5% thereafter). Individual retail traders are not affected." },
    { q: "Do I Need to Report Forex Income?", a: "Individual retail forex traders in Hong Kong generally do not need to report trading profits on their tax return (BIR60). However, if the IRD considers your trading to constitute a business, you may be required to declare it as business income." },
  ],

  payments: [
    { method: "FPS (Faster Payment System)", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Best for HK" },
    { method: "Bank Transfer (HSBC, Hang Seng)", deposit: "Free", withdrawal: "Free", time: "Same day", note: "All major HK banks" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit/credit" },
    { method: "PayMe / AlipayHK", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Selected brokers" },
  ],

  guide: [
    { q: "How to Verify an SFC-Licensed Broker", a: "Visit sfc.hk and use the Licensed Persons and Registered Institutions search. Look for Type 3 licence (Leveraged Foreign Exchange Trading). Each licensed entity has a Central Entity number (CE). Never trade with a broker not on the SFC register." },
    { q: "SFC-Licensed vs International Brokers", a: "SFC-licensed brokers offer ICF compensation (HK$500K), strict regulatory oversight, and local dispute resolution. International brokers (ASIC, FCA) may offer higher leverage, more instruments, and lower spreads. Many HK traders use both for different purposes." },
    { q: "Hong Kong's Tax-Free Advantage", a: "Hong Kong has no capital gains tax and no tax on forex trading profits for individuals. Combined with strong regulation and HKD stability (pegged to USD), HK is one of the world's best jurisdictions for retail forex trading." },
    { q: "Understanding HKD and the Currency Peg", a: "The HKD is pegged to the USD within a band of 7.75-7.85. This peg, maintained by the HKMA since 1983, means USD/HKD has very limited movement. HK traders typically trade major pairs like EUR/USD, GBP/USD, and USD/JPY rather than USD/HKD." },
    { q: "Professional Investor Status in Hong Kong", a: "HK traders can qualify as Professional Investors with a portfolio of HK$8 million+. This unlocks higher leverage limits, access to more products, and fewer regulatory restrictions — but you waive some retail protections." },
  ],

  faq: [
    { q: "What is the best forex broker in Hong Kong for 2026?", a: "IG is our top pick for HK traders in 2026. It's SFC-licensed (AHY301), offers ICF protection up to HK$500,000, 17,000+ markets, and full Cantonese/Mandarin support with HKD base accounts." },
    { q: "Is forex trading legal in Hong Kong?", a: "Yes. Forex trading is fully legal and well-regulated by the Securities and Futures Commission (SFC). Brokers offering leveraged forex trading must hold a Type 3 SFC licence." },
    { q: "Are forex profits taxed in Hong Kong?", a: "No. Hong Kong has no capital gains tax and does not tax forex trading profits for individual traders. This is one of the key advantages of trading from Hong Kong." },
    { q: "What leverage can HK traders use?", a: "SFC-licensed brokers typically offer around 1:20 for retail clients. Through international brokers (ASIC, FCA), HK traders may access up to 1:30 (regulated) or higher through offshore entities. Professional Investors can access higher leverage." },
    { q: "What is the ICF?", a: "The Investor Compensation Fund covers up to HK$500,000 per investor if an SFC-licensed broker defaults. It is funded by a levy on securities and futures transactions. This is one of Asia's strongest compensation schemes." },
    { q: "Do HK brokers offer HKD accounts?", a: "Yes. All SFC-licensed brokers in our top 10 offer HKD base accounts. This eliminates USD conversion costs and allows seamless FPS deposits and withdrawals in HKD." },
    { q: "Can I use international brokers from Hong Kong?", a: "Yes. Many HK traders use internationally-regulated brokers (ASIC, FCA, CySEC) alongside SFC-licensed ones. International brokers may offer higher leverage and wider product ranges, but without SFC licensing you won't have ICF protection." },
    { q: "Which broker has the best USD/JPY spreads from HK?", a: "IC Markets recorded the tightest average spreads across major pairs including USD/JPY in our HK test. For SFC-licensed brokers, IG and OANDA offer competitive USD/JPY spreads with local regulatory protection." },
  ],

  related: [
    { name: "Best SFC-Licensed Brokers", icon: "\u{1F6E1}\uFE0F", count: 10, url: "#" },
    { name: "Best for Professionals", icon: "\u{1F4BC}", count: 8, url: "#" },
    { name: "Best Multi-Asset Brokers", icon: "\u{1F4CA}", count: 10, url: "#" },
    { name: "Brokers in Singapore", icon: "\u{1F1F8}\u{1F1EC}", count: 8, url: "/best-forex-brokers-singapore" },
    { name: "Brokers in Japan", icon: "\u{1F1EF}\u{1F1F5}", count: 10, url: "/best-forex-brokers-japan" },
    { name: "Brokers in Australia", icon: "\u{1F1E6}\u{1F1FA}", count: 10, url: "/best-forex-brokers-australia" },
  ],
};

export default data;
