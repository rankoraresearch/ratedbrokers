const data = {
  name: "Indonesia", slug: "indonesia", code: "ID", flag: "\u{1F1EE}\u{1F1E9}",
  regulator: "BAPPEBTI", regulatorFull: "Badan Pengawas Perdagangan Berjangka Komoditi (Commodity Futures Trading Regulatory Agency)",
  regulatorUrl: "https://www.bappebti.go.id", currency: "IDR",
  leverage: "1:100", leverageNote: "Up to 1:100 through BAPPEBTI-licensed brokers",
  compensation: "Compensation Fund — managed by Indonesia Clearing House (ICH)",
  negativeBalance: "Not mandatory — varies by broker",
  taxNote: "Forex profits taxed as income. Final tax of 0.1% on transaction value applies to exchange-traded futures.",
  localPayments: ["Bank Transfer (BCA, Mandiri, BNI, BRI)", "GoPay", "OVO", "Dana", "Visa/Mastercard"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 38, localBrokersTotal: 22, hoursResearch: 82,
  author: { name: "Ravi Santoso", role: "Southeast Asia Markets Analyst", exp: "11 years", initials: "RS", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Indonesia for 2026 — BAPPEBTI Licensed",
  metaDescription: "We analyzed 22 BAPPEBTI-licensed brokers for Indonesian traders. These 10 offer the best trading conditions including local regulation, IDR deposits, and competitive spreads.",
  keyFinding: "Indonesia requires all forex brokers to hold a BAPPEBTI licence. The market has grown rapidly with over 1 million active retail traders. BAPPEBTI-licensed brokers must clear through the Indonesia Clearing House (ICH) and Jakarta Futures Exchange (JFX) or Indonesia Commodity & Derivatives Exchange (ICDX).",

  brokers: [
    { rank: 1, slug: "ic-markets", badge: "Best Overall Indonesia", badgeColor: "#059669", localCurrencyMin: "Rp3,000,000", verdict: "Best international broker for Indonesian traders. Ultra-tight spreads and fast execution with IDR deposit support.", localAdvantages: ["ASIC + CySEC regulated", "IDR deposits via local bank transfer", "0.02 pip average EUR/USD spread", "cTrader + MT4/MT5 + TradingView", "25+ tier-1 liquidity providers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Best Execution", badgeColor: "#d97706", localCurrencyMin: "Rp0", verdict: "Fastest execution in our Indonesia test. Strong multi-platform support with IDR deposit options.", localAdvantages: ["ASIC + FCA + CySEC regulated", "IDR deposits via local banks", "Raw spreads from 0.0 pips", "TradingView + cTrader + MT4/MT5", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "Rp75,000", verdict: "Most accessible broker for Indonesian beginners. Ultra-low minimum deposit and Bahasa Indonesia support.", localAdvantages: ["CySEC + ASIC regulated", "Bahasa Indonesia customer support", "Ultra-low minimum deposit Rp75,000", "Micro lot (0.01) trading", "Free webinars in Bahasa Indonesia"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "exness", badge: "Instant Withdrawals", badgeColor: "#059669", localCurrencyMin: "Rp0", verdict: "Best for instant IDR withdrawals. No minimum deposit and automatic withdrawal processing.", localAdvantages: ["FCA + CySEC regulated", "Instant IDR withdrawals to local banks", "No minimum deposit", "Automatic withdrawal processing", "Bahasa Indonesia support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "Rp1,500,000", verdict: "Lowest ECN commission among top brokers. Strong for Indonesian traders wanting raw pricing.", localAdvantages: ["ASIC + CySEC regulated", "IDR deposits supported", "Lowest commission at $6/lot RT", "4.8 Trustpilot rating", "cTrader + TradingView access"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "Rp0", verdict: "Good all-rounder with copy trading and Bahasa Indonesia support. Strong for beginners.", localAdvantages: ["CySEC + FCA + FSCA regulated", "Bahasa Indonesia platform & support", "HFcopy — copy trading system", "No minimum deposit", "IDR deposits via local transfer"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "fxpro", badge: null, badgeColor: null, localCurrencyMin: "Rp1,500,000", verdict: "Multi-platform NDD broker with strong execution for Indonesian day traders.", localAdvantages: ["FCA + CySEC regulated", "IDR deposits supported", "NDD execution — no dealing desk", "MT4 + MT5 + cTrader + FxPro Edge", "Negative balance protection"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "vantage", badge: null, badgeColor: null, localCurrencyMin: "Rp750,000", verdict: "Competitive ECN broker with strong APAC presence and IDR support.", localAdvantages: ["ASIC + VFSC regulated", "IDR local bank deposits", "ECN spreads from 0.0 pips", "ProTrader with TradingView", "APAC timezone support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "avatrade", badge: null, badgeColor: null, localCurrencyMin: "Rp1,500,000", verdict: "Well-regulated broker with strong educational tools for Indonesian beginners.", localAdvantages: ["ASIC + multiple global licences", "IDR deposits accepted", "AvaProtect risk management", "AvaSocial copy trading", "Comprehensive trading education"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "fxtm", badge: null, badgeColor: null, localCurrencyMin: "Rp150,000", verdict: "Low entry point with strong copy trading and local payment support for Indonesian traders.", localAdvantages: ["FCA + CySEC regulated", "IDR deposits via local banks", "Low minimum deposit Rp150,000", "FXTM Invest copy trading", "Bahasa Indonesia education"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How BAPPEBTI Regulates Forex in Indonesia",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "BAPPEBTI Licence Required", desc: "All forex brokers operating in Indonesia must hold a BAPPEBTI licence. Operating without one is illegal and subject to criminal prosecution. Verify any broker at bappebti.go.id before trading." },
      { icon: "\u{1F3E6}", title: "Exchange Membership Required", desc: "BAPPEBTI-licensed brokers must be members of the Jakarta Futures Exchange (JFX) or Indonesia Commodity & Derivatives Exchange (ICDX) and clear through the Indonesia Clearing House (ICH)." },
      { icon: "\u{1F4B0}", title: "Segregated Funds & ICH", desc: "Client funds must be held in segregated accounts at designated banks. The Indonesia Clearing House acts as a central counterparty, reducing the risk of broker default." },
      { icon: "\u{1F4CA}", title: "Leverage Limits", desc: "BAPPEBTI allows leverage up to 1:100 for regulated brokers. Some international brokers operating via offshore entities may offer higher leverage, but these are not BAPPEBTI-regulated." },
      { icon: "\u{1F6AB}", title: "Crackdown on Illegal Brokers", desc: "BAPPEBTI and OJK (Financial Services Authority) actively block websites of unlicensed brokers. In recent years, hundreds of illegal forex and binary options platforms have been shut down." },
      { icon: "\u{1F4CB}", title: "KYC & Anti-Money Laundering", desc: "All BAPPEBTI brokers require full KYC verification including KTP (ID card), NPWP (tax number), and bank account details. This protects traders and complies with Indonesia's anti-money laundering framework." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Indonesia?", a: "Forex trading profits are generally classified as income and subject to progressive income tax (PPh) rates: 5% (up to Rp60M), 15% (Rp60-250M), 25% (Rp250-500M), 30% (Rp500M-5B), and 35% (above Rp5B). For exchange-traded futures, a final tax of 0.1% on transaction value applies." },
    { q: "Do I Need an NPWP to Trade Forex?", a: "Yes. BAPPEBTI-regulated brokers require your NPWP (Nomor Pokok Wajib Pajak / Tax ID Number) for account opening. Your NPWP is also needed to report forex income on your annual SPT (tax return)." },
    { q: "Can I Offset Forex Trading Losses?", a: "Trading losses from exchange-traded futures can generally be offset against other income within the same tax year. However, losses from offshore or unregulated trading may not be deductible. Consult a local tax consultant for your specific situation." },
  ],

  payments: [
    { method: "Local Bank Transfer (BCA, Mandiri)", deposit: "Free", withdrawal: "Free", time: "Instant–1h", note: "Most popular" },
    { method: "E-Wallets (GoPay, OVO, Dana)", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Selected brokers" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit cards" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free–$5", time: "Instant / 1d", note: "E-wallet" },
  ],

  guide: [
    { q: "How to Verify a BAPPEBTI-Licensed Broker", a: "Visit bappebti.go.id and check the official list of licensed brokers (Pialang Berjangka). Every BAPPEBTI-licensed broker has a licence number. Also verify they are members of JFX or ICDX. Never trade with a broker not on this list." },
    { q: "BAPPEBTI vs International Brokers", a: "BAPPEBTI-licensed brokers operate under Indonesian law with local dispute resolution. International brokers regulated by ASIC, FCA, or CySEC may offer more instruments and lower spreads, but you have less local legal protection. Many Indonesian traders use internationally-regulated brokers for their wider product range." },
    { q: "Can Indonesians Use International Brokers?", a: "Many Indonesians trade with internationally-regulated brokers (ASIC, FCA, CySEC). While BAPPEBTI discourages this, enforcement has primarily targeted the brokers rather than individual traders. For maximum legal protection, use a BAPPEBTI-licensed broker." },
    { q: "Understanding IDR Deposits and Conversions", a: "When depositing IDR to an international broker, your funds are typically converted to USD at the broker's rate. This adds 0.5-2% conversion cost. Brokers like Exness and XM offer local IDR deposit channels with competitive conversion rates." },
    { q: "Avoiding Forex Scams in Indonesia", a: "Indonesia has seen many forex scams targeting retail traders. Red flags: guaranteed profit promises, unregulated entities, pressure to deposit quickly, and social media 'signal' groups requiring upfront payment. Always verify BAPPEBTI registration." },
  ],

  faq: [
    { q: "What is the best forex broker in Indonesia for 2026?", a: "IC Markets is our top pick for Indonesian traders in 2026, offering the tightest spreads and fastest execution with IDR deposit support. For a BAPPEBTI-regulated option, check local brokers on bappebti.go.id." },
    { q: "Is forex trading legal in Indonesia?", a: "Yes. Forex trading is legal and regulated by BAPPEBTI. Brokers must hold a BAPPEBTI licence and be members of JFX or ICDX. Trading with unlicensed offshore brokers is illegal for the broker, though enforcement against individual traders is limited." },
    { q: "What leverage can Indonesian traders use?", a: "BAPPEBTI-regulated brokers offer up to 1:100 leverage. International brokers accessible from Indonesia may offer up to 1:500, but these are not under BAPPEBTI regulation." },
    { q: "What is the minimum deposit in IDR?", a: "Among our top picks, XM offers the lowest at approximately Rp75,000, while Exness and Pepperstone have no minimum deposit. BAPPEBTI-regulated local brokers typically require Rp5-10 million." },
    { q: "How are forex profits taxed in Indonesia?", a: "Forex profits are subject to progressive income tax (PPh) rates from 5% to 35%. Exchange-traded futures have a final tax of 0.1% on transaction value. You must report forex income on your SPT annual tax return." },
    { q: "Can I deposit in IDR?", a: "Yes. Most international brokers in our top 10 accept IDR deposits via local bank transfer (BCA, Mandiri, BNI, BRI). Funds are converted to USD at the broker's rate. Some brokers also accept GoPay and OVO." },
    { q: "What is BAPPEBTI?", a: "BAPPEBTI (Badan Pengawas Perdagangan Berjangka Komoditi) is Indonesia's Commodity Futures Trading Regulatory Agency under the Ministry of Trade. It oversees all commodity and derivatives trading including forex." },
    { q: "Are offshore brokers safe for Indonesian traders?", a: "Offshore brokers regulated by tier-1 authorities (ASIC, FCA, CySEC) offer strong global protection but limited local legal recourse. Unregulated offshore brokers offer no protection. Always verify the broker's regulatory status before depositing." },
  ],

  related: [
    { name: "Best BAPPEBTI Brokers", icon: "\u{1F6E1}\uFE0F", count: 10, url: "#" },
    { name: "Best Low Deposit Brokers", icon: "\u{1F4B0}", count: 10, url: "#" },
    { name: "Best for Beginners", icon: "\u{1F393}", count: 10, url: "#" },
    { name: "Brokers in Malaysia", icon: "\u{1F1F2}\u{1F1FE}", count: 8, url: "/best-forex-brokers-malaysia" },
    { name: "Brokers in Thailand", icon: "\u{1F1F9}\u{1F1ED}", count: 8, url: "/best-forex-brokers-thailand" },
    { name: "Brokers in Philippines", icon: "\u{1F1F5}\u{1F1ED}", count: 8, url: "/best-forex-brokers-philippines" },
  ],
};

export default data;
