const data = {
  name: "Thailand", slug: "thailand", code: "TH", flag: "\u{1F1F9}\u{1F1ED}",
  regulator: "SEC", regulatorFull: "Securities and Exchange Commission Thailand",
  regulatorUrl: "https://www.sec.or.th", currency: "THB",
  leverage: "1:50", leverageNote: "SEC-licensed brokers; offshore brokers may offer higher",
  compensation: "No government compensation scheme for forex",
  negativeBalance: "Not mandatory — varies by broker",
  taxNote: "Forex profits may be taxable as assessable income. Capital gains from securities are generally exempt, but forex/CFD profits fall under different rules.",
  localPayments: ["Thai Bank Transfer", "PromptPay", "Visa/Mastercard", "TrueMoney Wallet", "LINE Pay"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 36, localBrokersTotal: 10, hoursResearch: 72,
  author: { name: "Siriporn Tanaka", role: "ASEAN Markets Analyst", exp: "10 years", initials: "ST", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Thailand for 2026 — SEC Licensed",
  metaDescription: "We analyzed brokers accessible to Thai traders. These 10 offer the best conditions including strong regulation, Thai language support, and competitive spreads for THB pair trading.",
  keyFinding: "Thailand's SEC and Bank of Thailand (BOT) regulate forex activity. Retail forex CFD trading through international brokers operates in a grey area — not explicitly banned but not domestically regulated. Most Thai traders use internationally-regulated brokers with THB deposit options. The BOT manages THB foreign exchange controls.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall Thailand", badgeColor: "#059669", localCurrencyMin: "\u0E3F0", verdict: "Best all-round broker for Thai traders. Multi-regulated with THB deposits, raw spreads, and Thai-language resources.", localAdvantages: ["ASIC + FCA + CySEC regulated", "THB deposits via local bank transfer", "Raw spreads from 0.0 pips", "TradingView + cTrader + MT4/MT5", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "exness", badge: "Best for Thai Payments", badgeColor: "#059669", localCurrencyMin: "\u0E3F0", verdict: "Best local payment support for Thai traders. Instant THB withdrawals and Thai-language platform.", localAdvantages: ["FCA + CySEC regulated", "Instant THB withdrawals to Thai banks", "Thai-language customer support", "No minimum deposit", "PromptPay deposits supported"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "\u0E3F175", verdict: "Most beginner-friendly with Thai-language support, low deposit, and extensive education.", localAdvantages: ["CySEC + ASIC regulated", "Thai-language platform & support", "Low minimum deposit \u0E3F175", "Micro lot (0.01) trading", "Free Thai-language webinars"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "\u0E3F5,000", verdict: "Tightest raw spreads in our Thailand test. Best for scalpers and active day traders.", localAdvantages: ["ASIC + CySEC regulated", "THB deposits via bank transfer", "0.02 pip average EUR/USD spread", "25+ tier-1 liquidity providers", "cTrader + MT4/MT5 + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "\u0E3F3,500", verdict: "Lowest ECN commission at $6/lot. Strong for Thai traders seeking raw pricing.", localAdvantages: ["ASIC + CySEC regulated", "THB deposits accepted", "Lowest commission at $6/lot RT", "4.8 Trustpilot rating", "cTrader + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "\u0E3F0", verdict: "Good all-rounder with copy trading features and Thai bank transfer support.", localAdvantages: ["CySEC + FCA + FSCA regulated", "THB deposits via local transfer", "HFcopy — copy trading system", "No minimum deposit", "Thai-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "avatrade", badge: "Best Education", badgeColor: "#2563eb", localCurrencyMin: "\u0E3F3,500", verdict: "Strong educational tools and risk management features for Thai beginners.", localAdvantages: ["ASIC + multiple global licences", "THB deposits supported", "AvaProtect risk management", "AvaSocial copy trading", "Comprehensive trading education"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "vantage", badge: null, badgeColor: null, localCurrencyMin: "\u0E3F1,750", verdict: "Competitive ECN broker with APAC focus and Thai deposit options.", localAdvantages: ["ASIC + VFSC regulated", "THB local bank deposits", "ECN spreads from 0.0 pips", "ProTrader with TradingView", "APAC timezone support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "fxtm", badge: null, badgeColor: null, localCurrencyMin: "\u0E3F350", verdict: "Low entry point with strong copy trading. Popular among Thai retail traders.", localAdvantages: ["FCA + CySEC regulated", "THB deposits via local banks", "Low minimum deposit \u0E3F350", "FXTM Invest copy trading", "Thai-language education"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "roboforex", badge: null, badgeColor: null, localCurrencyMin: "\u0E3F350", verdict: "Wide range of account types and copy trading via CopyFX for Thai traders.", localAdvantages: ["IFSC regulated", "THB deposits accepted", "CopyFX copy trading platform", "R StocksTrader proprietary platform", "Low minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How Thailand Regulates Forex Trading",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "SEC Thailand Oversight", desc: "The Securities and Exchange Commission Thailand regulates securities, derivatives, and digital assets. Forex CFD trading through offshore brokers is not directly regulated by the SEC, creating a grey area for Thai retail traders." },
      { icon: "\u{1F3E6}", title: "Bank of Thailand (BOT) Controls", desc: "The BOT manages Thailand's foreign exchange regulations. Thai residents can transfer up to $50,000/year abroad for investment purposes without prior approval. Larger amounts require BOT documentation." },
      { icon: "\u{1F4B1}", title: "THB Exchange Controls", desc: "Thailand maintains certain capital controls on the Thai Baht. Converting THB to foreign currencies for trading purposes is permitted within BOT's annual limits, but reporting requirements apply for large amounts." },
      { icon: "\u26A0\uFE0F", title: "Grey Area for Retail Forex", desc: "Retail forex CFD trading through international brokers is neither explicitly legal nor illegal in Thailand. The SEC focuses on regulating domestic securities markets. Thai traders commonly use internationally-regulated brokers." },
      { icon: "\u{1F6AB}", title: "Scam Warnings", desc: "The SEC Thailand and BOT periodically issue warnings about unauthorised forex investment schemes. Thailand has seen numerous forex Ponzi schemes. Always verify a broker's international regulatory status." },
      { icon: "\u{1F4CB}", title: "KYC Requirements", desc: "International brokers serving Thai clients require standard KYC: Thai ID card or passport, proof of address (utility bill or bank statement), and in some cases a Thai bank statement showing the source of funds." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "Are Forex Profits Taxed in Thailand?", a: "Forex profits earned from overseas brokers may be taxable in Thailand if the funds are remitted to Thailand in the same tax year they are earned. Since January 2024, Thailand has tightened rules on foreign-sourced income. Consult a Thai tax advisor for your specific situation." },
    { q: "What Is the Tax Rate on Trading Income?", a: "If taxable, forex profits are classified as assessable income and subject to Thailand's progressive income tax rates: 0% (up to \u0E3F150,000), 5% (\u0E3F150K-300K), 10% (\u0E3F300K-500K), 15% (\u0E3F500K-750K), 20% (\u0E3F750K-1M), 25% (\u0E3F1M-2M), 30% (\u0E3F2M-5M), 35% (above \u0E3F5M)." },
    { q: "Do I Need to Report Foreign Broker Accounts?", a: "Thailand does not currently require disclosure of foreign financial accounts as some countries do. However, if you remit trading profits to Thailand, they should be reported on your annual tax return (PND 90/91). Tax rules on foreign income have been evolving." },
  ],

  payments: [
    { method: "Thai Bank Transfer", deposit: "Free", withdrawal: "Free", time: "Instant–1h", note: "Best for Thailand" },
    { method: "PromptPay", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Thai instant payment" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit/credit" },
    { method: "TrueMoney / LINE Pay", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Selected brokers" },
  ],

  guide: [
    { q: "Is Forex Trading Legal in Thailand?", a: "Forex trading through international brokers is a grey area. It's not explicitly banned for Thai residents, but it's not domestically regulated either. The SEC Thailand focuses on local securities markets. Most Thai traders use internationally-regulated brokers (ASIC, FCA, CySEC) without legal issues." },
    { q: "How to Choose a Broker as a Thai Trader", a: "Since domestic forex CFD regulation is limited, Thai traders should prioritise internationally-regulated brokers. Look for: ASIC, FCA, or CySEC licence; THB deposit/withdrawal options; Thai-language support; and negative balance protection. Avoid unregulated brokers." },
    { q: "Understanding BOT's Foreign Exchange Rules", a: "Thai residents can transfer up to $50,000/year abroad for investment without prior BOT approval. For amounts exceeding this, you need documentation from an authorised bank. When depositing to an international broker, use a Thai bank that processes FX transfers efficiently." },
    { q: "Avoiding Forex Scams in Thailand", a: "Thailand has been hit by numerous forex Ponzi schemes. Warning signs: guaranteed monthly returns (e.g., 10%/month), MLM recruitment structure, no verifiable regulation, and social media testimonials with luxury lifestyles. If it sounds too good to be true, it is." },
    { q: "THB Deposits and Currency Conversion", a: "Most international brokers accept THB via local bank transfer. Your THB is converted to USD at the broker's rate. PromptPay is the fastest deposit method for Thai traders — instant with zero fees. Be aware of the 0.5-1.5% FX conversion spread." },
  ],

  faq: [
    { q: "What is the best forex broker in Thailand for 2026?", a: "Pepperstone is our top pick for Thai traders. It offers THB deposits, raw ECN spreads from 0.0 pips, and is regulated by ASIC, FCA, and CySEC — providing strong international protection." },
    { q: "Is forex trading legal in Thailand?", a: "Retail forex CFD trading through international brokers exists in a grey area — not explicitly banned but not domestically regulated by the SEC Thailand. Most Thai traders use internationally-regulated brokers without issues." },
    { q: "What leverage can Thai traders access?", a: "Through internationally-regulated brokers, Thai traders can access leverage up to 1:500 depending on the broker and account type. ASIC/CySEC-regulated entities may cap retail leverage at 1:30, while offshore entities offer higher." },
    { q: "Are forex profits taxed in Thailand?", a: "Potentially yes. Since 2024, Thailand has tightened foreign income rules. Forex profits remitted to Thailand in the same tax year may be subject to progressive income tax (0-35%). Consult a Thai tax advisor for specifics." },
    { q: "Can I deposit in Thai Baht?", a: "Yes. All top 10 brokers in our ranking accept THB deposits via Thai bank transfer. Exness also supports PromptPay for instant deposits. Funds are typically converted to USD at the broker's exchange rate." },
    { q: "Which broker has the best Thai-language support?", a: "Exness and XM offer the most comprehensive Thai-language experience including platform translation, customer support in Thai, and Thai-language educational content. Pepperstone also provides Thai-language resources." },
    { q: "What is the minimum deposit for Thai traders?", a: "Pepperstone, Exness, and HFM have no minimum deposit. XM requires just \u0E3F175. Most brokers accept instant THB deposits via Thai bank transfer or PromptPay." },
    { q: "How much can I transfer abroad for trading?", a: "Under BOT rules, Thai residents can transfer up to $50,000/year abroad for investment purposes without prior approval. Larger amounts require supporting documentation through your Thai bank." },
  ],

  related: [
    { name: "Best ASIC-Regulated Brokers", icon: "\u{1F6E1}\uFE0F", count: 14, url: "#" },
    { name: "Best Low Deposit Brokers", icon: "\u{1F4B0}", count: 10, url: "#" },
    { name: "Best for Beginners", icon: "\u{1F393}", count: 10, url: "#" },
    { name: "Brokers in Malaysia", icon: "\u{1F1F2}\u{1F1FE}", count: 10, url: "/best-forex-brokers-malaysia" },
    { name: "Brokers in Indonesia", icon: "\u{1F1EE}\u{1F1E9}", count: 10, url: "/best-forex-brokers-indonesia" },
    { name: "Brokers in Philippines", icon: "\u{1F1F5}\u{1F1ED}", count: 8, url: "/best-forex-brokers-philippines" },
  ],
};

export default data;
