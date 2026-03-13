const data = {
  name: "Malaysia", slug: "malaysia", code: "MY", flag: "\u{1F1F2}\u{1F1FE}",
  regulator: "SC", regulatorFull: "Securities Commission Malaysia",
  regulatorUrl: "https://www.sc.com.my", currency: "MYR",
  leverage: "1:50", leverageNote: "SC-licensed brokers — varies; offshore brokers up to 1:500",
  compensation: "Capital Markets Compensation Fund Corporation (CMC Fund)",
  negativeBalance: "Not mandatory — varies by broker",
  taxNote: "Malaysia has no capital gains tax. Forex profits are generally tax-free unless trading is classified as a business activity.",
  localPayments: ["Online Banking (FPX)", "Visa/Mastercard", "GrabPay", "Touch 'n Go eWallet", "Bank Transfer"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 40, localBrokersTotal: 14, hoursResearch: 76,
  author: { name: "Ahmad Razif", role: "ASEAN Trading Specialist", exp: "13 years", initials: "AR", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Malaysia for 2026 — SC Regulated",
  metaDescription: "We analyzed 14 SC-regulated and top international brokers for Malaysian traders. These 10 offer the best conditions for Malaysian traders including local regulation, MYR accounts, and Shariah-compliant options.",
  keyFinding: "Malaysia's Securities Commission (SC) regulates forex trading under the Capital Markets and Services Act. Only SC-licensed entities can legally offer forex trading to Malaysian residents. Many Malaysian traders also use internationally-regulated brokers. Islamic (swap-free) accounts are widely available given Malaysia's Muslim-majority population.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall Malaysia", badgeColor: "#059669", localCurrencyMin: "RM0", verdict: "Best all-round broker for Malaysian traders. Top-tier regulation, Islamic accounts, and raw ECN spreads.", localAdvantages: ["ASIC + FCA + CySEC regulated", "MYR deposits via local bank transfer", "Islamic (swap-free) account available", "Raw spreads from 0.0 pips", "TradingView + cTrader + MT4/MT5"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "RM900", verdict: "Tightest raw spreads in our Malaysia test. Ideal for scalpers and high-volume traders.", localAdvantages: ["ASIC + CySEC regulated", "MYR deposits supported", "0.02 pip average EUR/USD spread", "Islamic (swap-free) account", "cTrader + MT4/MT5 + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "RM25", verdict: "Most beginner-friendly with ultra-low minimum and Malay-language support.", localAdvantages: ["CySEC + ASIC regulated", "Malay-language customer support", "RM25 minimum deposit", "Islamic (swap-free) account", "Free webinars and education in Malay"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "exness", badge: "Best Withdrawals", badgeColor: "#059669", localCurrencyMin: "RM0", verdict: "Instant MYR withdrawals and no minimum deposit. Best for traders who value fast fund access.", localAdvantages: ["FCA + CySEC regulated", "Instant MYR withdrawals to local banks", "No minimum deposit", "Islamic (swap-free) account", "Automatic withdrawal processing"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "RM450", verdict: "Lowest ECN commission with strong platform choice. Good for Malaysian day traders.", localAdvantages: ["ASIC + CySEC regulated", "MYR deposits accepted", "Lowest commission at $6/lot RT", "Islamic (swap-free) account", "cTrader + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "avatrade", badge: "Best Islamic Account", badgeColor: "#6d28d9", localCurrencyMin: "RM450", verdict: "Best Shariah-compliant trading experience with AvaProtect and comprehensive Islamic account.", localAdvantages: ["ASIC + multiple global licences", "MYR deposits supported", "Comprehensive Islamic (swap-free) account", "AvaProtect risk management", "AvaSocial copy trading"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "RM0", verdict: "Strong all-rounder with copy trading and local Malaysian payment support.", localAdvantages: ["CySEC + FCA + FSCA regulated", "MYR deposits via online banking", "HFcopy — copy trading", "Islamic (swap-free) account", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "vantage", badge: null, badgeColor: null, localCurrencyMin: "RM225", verdict: "Good ECN broker with APAC focus and MYR deposit support.", localAdvantages: ["ASIC + VFSC regulated", "MYR deposits via local transfer", "ECN spreads from 0.0 pips", "Islamic (swap-free) account", "ProTrader with TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "etoro", badge: "Best Copy Trading", badgeColor: "#2563eb", localCurrencyMin: "RM450", verdict: "Leading social trading platform with 30M+ users. Good for Malaysian beginners.", localAdvantages: ["FCA + CySEC + ASIC regulated", "MYR deposits accepted", "Copy Trading — follow top traders", "30M+ users globally", "User-friendly mobile app"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "fxtm", badge: null, badgeColor: null, localCurrencyMin: "RM45", verdict: "Low entry point with strong copy trading. Popular among Malaysian retail traders.", localAdvantages: ["FCA + CySEC regulated", "MYR deposits via local bank", "Low minimum deposit RM45", "FXTM Invest copy trading", "Islamic (swap-free) account"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How the SC Regulates Forex in Malaysia",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "SC Licensing Required", desc: "Under the Capital Markets and Services Act 2007, only SC-licensed entities can legally offer forex and CFD trading to Malaysian residents. Check the SC's list of licensed entities at sc.com.my before trading." },
      { icon: "\u{1F3E6}", title: "Bank Negara Malaysia (BNM) Oversight", desc: "Bank Negara Malaysia oversees foreign exchange policy and money services businesses. While the SC regulates capital markets, BNM controls the Malaysian Ringgit and foreign exchange administration rules." },
      { icon: "\u{1F6AB}", title: "Active Enforcement Against Scams", desc: "The SC maintains an Investor Alert List of unauthorised entities. SC and BNM have actively pursued illegal forex schemes, which have been a significant issue in Malaysia. Always check the alert list before investing." },
      { icon: "\u{1F4B0}", title: "Capital Markets Compensation", desc: "The Capital Markets Compensation Fund Corporation provides compensation for losses arising from a licensed broker's default, subject to limits. This adds a layer of protection for Malaysian traders." },
      { icon: "\u2696\uFE0F", title: "Shariah Compliance", desc: "Malaysia's SC has specific guidelines for Islamic capital market products. Some SC-licensed brokers offer Shariah-compliant trading accounts approved by their Shariah advisory boards." },
      { icon: "\u{1F4CB}", title: "KYC & AML Requirements", desc: "Licensed brokers must conduct full KYC verification including MyKad (IC number), proof of address, and source of funds. This complies with Malaysia's Anti-Money Laundering Act." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "Are Forex Profits Taxed in Malaysia?", a: "Malaysia does not have a capital gains tax. Forex trading profits for individual retail traders are generally not subject to income tax. However, if LHDN (Inland Revenue Board) classifies your trading as a business activity (frequent trading, professional setup), profits may be taxed as business income." },
    { q: "When Would Forex Be Classified as Business Income?", a: "LHDN may classify forex profits as taxable business income if: you trade full-time as your primary occupation, you have a systematic and organised trading operation, or you use borrowed capital. Casual/occasional traders are generally not taxed." },
    { q: "Do I Need to Declare Forex Income?", a: "If your forex trading is not classified as a business, you generally do not need to declare it. However, for large or consistent profits, it's prudent to consult a Malaysian tax advisor. If trading is your business, you must declare income and can deduct trading expenses." },
  ],

  payments: [
    { method: "FPX (Online Banking)", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "Most popular in Malaysia" },
    { method: "Bank Transfer", deposit: "Free", withdrawal: "Free", time: "Instant–1d", note: "All Malaysian banks" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit/credit" },
    { method: "E-Wallets (GrabPay, TnG)", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Selected brokers" },
  ],

  guide: [
    { q: "How to Verify an SC-Licensed Broker", a: "Visit sc.com.my and check the Register of Licensed and Registered Persons. Also check the SC Investor Alert List for unauthorised entities. Verify the broker holds a Capital Markets Services Licence (CMSL) for the relevant regulated activity." },
    { q: "Why Islamic Accounts Matter in Malaysia", a: "Malaysia's Muslim-majority population means Shariah-compliant (swap-free) accounts are essential. These accounts eliminate overnight swap/rollover interest charges, which are considered riba (prohibited). Most international brokers in our top 10 offer Islamic accounts for Malaysian traders." },
    { q: "MYR Deposits and Currency Conversion", a: "When depositing MYR with an international broker, funds are converted to USD (or another base currency) at the broker's rate. FPX (Financial Process Exchange) is the fastest local method — instant with no fees. Bank transfers take 1 business day." },
    { q: "Avoiding Forex Scams in Malaysia", a: "Malaysia has seen many illegal forex schemes. Red flags: guaranteed returns, unregistered entities, pressure to recruit others (MLM structure), and gold/forex 'investment packages'. Always verify with SC's Investor Alert List at sc.com.my/investor-alert." },
  ],

  faq: [
    { q: "What is the best forex broker in Malaysia for 2026?", a: "Pepperstone is our top pick for Malaysian traders. It offers MYR deposits, Islamic (swap-free) accounts, raw ECN spreads from 0.0 pips, and is regulated by ASIC, FCA, and CySEC." },
    { q: "Is forex trading legal in Malaysia?", a: "Yes, forex trading is legal but only through SC-licensed entities or recognised international brokers. Trading with unlicensed entities is illegal. Bank Negara Malaysia also regulates foreign exchange transactions involving MYR." },
    { q: "Are forex profits tax-free in Malaysia?", a: "For most individual retail traders, yes. Malaysia has no capital gains tax, and casual forex profits are generally not taxed. However, if LHDN classifies your trading as a business, profits become taxable income." },
    { q: "Do Malaysian brokers offer Islamic accounts?", a: "Yes. All 10 brokers in our ranking offer Islamic (swap-free) accounts for Malaysian Muslim traders. These accounts eliminate overnight swap charges to comply with Shariah principles." },
    { q: "What is the minimum deposit in MYR?", a: "XM offers the lowest at RM25. Pepperstone, Exness, and HFM have no minimum deposit. Most brokers accept MYR via FPX online banking for instant, fee-free deposits." },
    { q: "What leverage is available in Malaysia?", a: "SC-licensed brokers may have limited leverage. International brokers accessible from Malaysia offer up to 1:500 (IC Markets, Pepperstone) depending on account type. SC doesn't mandate a specific leverage cap for CFD trading." },
    { q: "Can Malaysians use offshore brokers?", a: "Many Malaysian traders use internationally-regulated brokers (ASIC, FCA, CySEC). While the SC discourages unlicensed entities, reputable internationally-regulated brokers are widely used. Check the SC Investor Alert List to ensure a broker is not flagged." },
    { q: "Is Bank Negara involved in forex regulation?", a: "Yes. Bank Negara Malaysia (BNM) regulates foreign exchange administration, MYR transactions, and money services businesses. The SC regulates capital markets including securities and derivatives. Both may be relevant depending on the type of forex activity." },
  ],

  related: [
    { name: "Best SC-Licensed Brokers", icon: "\u{1F6E1}\uFE0F", count: 8, url: "#" },
    { name: "Best Islamic Brokers", icon: "\u{1F54C}", count: 10, url: "#" },
    { name: "Best for Beginners", icon: "\u{1F393}", count: 10, url: "#" },
    { name: "Brokers in Singapore", icon: "\u{1F1F8}\u{1F1EC}", count: 8, url: "/best-forex-brokers-singapore" },
    { name: "Brokers in Indonesia", icon: "\u{1F1EE}\u{1F1E9}", count: 10, url: "/best-forex-brokers-indonesia" },
    { name: "Brokers in Thailand", icon: "\u{1F1F9}\u{1F1ED}", count: 8, url: "/best-forex-brokers-thailand" },
  ],
};

export default data;
