const data = {
  name: "Russia", slug: "russia", code: "RU", flag: "🇷🇺",
  regulator: "CBR", regulatorFull: "Central Bank of Russia (Bank of Russia)",
  regulatorUrl: "https://www.cbr.ru", currency: "RUB",
  leverage: "1:50", leverageNote: "Retail (CBR cap for licensed dealers)",
  compensation: "Up to ₽1.4M bank deposit insurance (forex not covered)",
  negativeBalance: "Yes — required by CBR for licensed forex dealers",
  localPayments: ["Bank Transfer", "Visa/Mastercard (limited)", "Mir Card", "WebMoney", "YooMoney"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 30, localBrokersTotal: 8, hoursResearch: 70,
  author: { name: "Dmitry Volkov", role: "CIS Markets Analyst", exp: "15 years", initials: "DV", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "8 Best Forex Brokers in Russia for 2026 — CBR Licensed",
  metaDescription: "We analyzed brokers accepting Russian traders under heavy sanctions. These 8 still operate for Russian clients with RUB accounts, offering the best available conditions in a restricted market.",
  keyFinding: "Since 2022, Western sanctions have severely restricted Russian access to international forex brokers. Most FCA/ASIC/CySEC-regulated brokers no longer accept Russian clients. Our list focuses on CBR-licensed dealers and the few international brokers still serving Russian traders — with important risk caveats.",

  brokers: [
    { rank: 1, slug: "exness", badge: "Best Available for Russia", badgeColor: "#059669", localCurrencyMin: "₽0", verdict: "One of few international brokers still accepting Russian clients. Instant RUB withdrawals and multiple account types.", localAdvantages: ["Still accepts Russian clients", "RUB base account", "Instant withdrawals to Russian banks", "No minimum deposit", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "roboforex", badge: "Best Local Broker", badgeColor: "#059669", localCurrencyMin: "₽0", verdict: "CIS-focused broker with strong RUB support and cent accounts. One of the most accessible options for Russian traders.", localAdvantages: ["RUB base account", "Cent account available", "R StocksTrader platform", "Copy trading (CopyFX)", "Russian-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "₽500", verdict: "Accepts Russian clients with low minimum deposit and Russian-language education.", localAdvantages: ["Low ₽500 minimum deposit", "Russian education & webinars", "Micro lot trading", "RUB deposits", "24/5 Russian support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "hfm", badge: "Best Copy Trading", badgeColor: "#6d28d9", localCurrencyMin: "₽0", verdict: "Zero minimum with copy trading features. Still serving Russian clients.", localAdvantages: ["No minimum deposit", "Copy trading feature", "RUB base account", "Russian support", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "fxpro", badge: "Best Platforms", badgeColor: "#2563eb", localCurrencyMin: "₽5,000", verdict: "Multi-platform broker still accessible to Russian traders with cTrader support.", localAdvantages: ["Multiple platform options", "cTrader available", "Russian support", "RUB deposits via alternatives", "Islamic account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "fxtm", badge: "Best Education", badgeColor: "#2563eb", localCurrencyMin: "₽1,000", verdict: "Strong Russian-language education and cent accounts for beginners.", localAdvantages: ["Russian education programs", "Cent account available", "RUB deposits", "Copy trading", "Russian-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "naga", badge: "Social Trading", badgeColor: "#059669", localCurrencyMin: "₽5,000", verdict: "Social trading platform still accessible to Russian traders. Copy trades automatically.", localAdvantages: ["Social trading platform", "Copy trading", "Russian interface", "Multiple asset classes", "Mobile app"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "libertex", badge: null, badgeColor: null, localCurrencyMin: "₽1,000", verdict: "Commission-based broker with Russian roots. Simple interface for beginners.", localAdvantages: ["Commission-based model", "Simple interface", "Russian heritage", "Mobile trading", "Educational content"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "Forex Regulation in Russia — Post-Sanctions Landscape",
    items: [
      { icon: "shield", title: "CBR Licensed Forex Dealers", desc: "The Central Bank of Russia licenses forex dealers under Federal Law 460-FZ. As of 2026, only a handful of firms hold CBR forex dealer licences. These provide the strongest local protection." },
      { icon: "alert-triangle", title: "Sanctions Impact Since 2022", desc: "Western sanctions have caused most FCA, ASIC, and CySEC-regulated brokers to stop accepting Russian clients. Visa and Mastercard suspended operations in Russia. Payment options are severely limited." },
      { icon: "piggy-bank", title: "No Forex Deposit Insurance", desc: "Russia's deposit insurance (up to ₽1.4M) covers bank deposits only, not forex dealer accounts. Trader funds with forex dealers are not covered by the DIA (Deposit Insurance Agency)." },
      { icon: "bar-chart-3", title: "1:50 Leverage Cap", desc: "CBR limits leverage for licensed forex dealers to 1:50 for retail clients. International brokers may offer higher leverage but operate outside CBR oversight." },
      { icon: "ban", title: "Restricted International Access", desc: "SWIFT restrictions, Visa/Mastercard suspension, and broker withdrawals have made international forex trading significantly harder for Russian residents since 2022." },
      { icon: "clipboard-list", title: "Alternative Payment Methods", desc: "Russian traders rely on Mir cards, WebMoney, YooMoney, crypto (USDT), and domestic bank transfers. These are the primary methods for funding accounts with brokers that still accept Russian clients." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Russia?", a: "Forex trading profits are subject to personal income tax (NDFL) at 13% for annual income up to ₽5 million and 15% for income exceeding ₽5 million. CBR-licensed forex dealers withhold tax automatically. For international brokers, you must self-declare." },
    { q: "Do CBR-Licensed Brokers Withhold Tax?", a: "Yes, CBR-licensed forex dealers act as tax agents and withhold 13% NDFL from your profits automatically. You receive net profits after tax. This simplifies tax compliance significantly." },
    { q: "How Do I Report International Broker Income?", a: "Russian residents must file a 3-NDFL tax declaration by April 30 each year for income from international brokers. You must also notify the FNS (Federal Tax Service) about opening foreign financial accounts within one month." },
  ],

  payments: [
    { method: "Russian Bank Transfer", deposit: "Free", withdrawal: "Free", time: "Instant–1h", note: "Domestic banks" },
    { method: "Mir Card", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Russian cards" },
    { method: "WebMoney (WMR)", deposit: "1-3%", withdrawal: "1-3%", time: "Instant", note: "E-wallet" },
    { method: "Crypto (USDT)", deposit: "Free", withdrawal: "Network fee", time: "10-30 min", note: "Increasingly common" },
  ],

  guide: [
    { q: "The Impact of Sanctions on Russian Forex Trading", a: "Since 2022, most Western-regulated brokers have exited Russia. Visa/Mastercard don't work. SWIFT is restricted. Russian traders now rely on: CBR-licensed domestic dealers, the few international brokers still accepting Russians, crypto for funding, and Mir/WebMoney for payments." },
    { q: "How to Verify a CBR Licence", a: "Visit cbr.ru and check the list of licensed forex dealers (Реестр форекс-дилеров). Only 4-5 firms hold active CBR licences. Operating without a CBR licence is illegal for firms serving Russian residents." },
    { q: "Best Trading Hours for Russia", a: "Best times for Moscow-based traders: 11:00 AM – 1:00 PM MSK (London session peak) and 4:30 PM – 7:30 PM MSK (London/New York overlap). USD/RUB is most active during Moscow trading hours." },
    { q: "Risks of Using Unlicensed Brokers", a: "Many offshore brokers target Russian traders with aggressive marketing. These are unregulated and offer no fund protection. Stick to CBR-licensed dealers or brokers with verifiable international regulation (even if limited)." },
    { q: "How to Fund Accounts After Sanctions", a: "Primary methods: 1. Russian bank transfer (for domestic brokers), 2. Crypto (USDT) — buy on domestic exchanges and send to broker, 3. WebMoney/YooMoney, 4. Mir card (accepted by some brokers). Visa/Mastercard and SWIFT are no longer viable." },
  ],

  faq: [
    { q: "What is the best forex broker for Russian traders in 2026?", a: "Exness is the top international broker still accepting Russian clients. For CBR-regulated domestic options, check the CBR's forex dealer register. Options are limited due to sanctions." },
    { q: "Is forex trading legal in Russia?", a: "Yes, forex trading is legal and regulated by the CBR. Domestic forex dealers must hold a CBR licence. Russian residents can also use international brokers that still accept them, though options are limited since 2022." },
    { q: "How do sanctions affect forex trading?", a: "Sanctions have restricted access to most Western-regulated brokers, suspended Visa/Mastercard, limited SWIFT transfers, and reduced available trading platforms. Russian traders now use alternative payment methods and the few brokers still serving Russia." },
    { q: "Can I still use MetaTrader?", a: "MetaTrader 4/5 remain available through brokers that still serve Russian clients. MetaQuotes (the developer) is a Cypriot company and MetaTrader itself has not been sanctioned." },
    { q: "What payment methods work in Russia?", a: "Domestic bank transfers, Mir cards, WebMoney, YooMoney, and crypto (USDT) are the primary options. Visa and Mastercard suspended operations in Russia in 2022." },
    { q: "Are forex profits taxed in Russia?", a: "Yes, forex profits are subject to 13% NDFL (15% above ₽5M). CBR-licensed dealers withhold tax automatically. International broker income must be self-declared via 3-NDFL by April 30." },
    { q: "What leverage is available?", a: "CBR-licensed dealers offer up to 1:50. International brokers may offer higher leverage (up to 1:500) but operate outside CBR oversight with limited protections." },
    { q: "Is it safe to trade forex in Russia now?", a: "Trading with CBR-licensed dealers is the safest option. International brokers that still accept Russians carry additional risk — they could exit the market at any time. Use only what you can afford to lose." },
  ],

  related: [
    { name: "Brokers in Ukraine", icon: "🇺🇦", count: 8, url: "/best-forex-brokers-ukraine" },
    { name: "Brokers in Turkey", icon: "🇹🇷", count: 10, url: "/best-forex-brokers-turkey" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best Low Deposit Brokers", icon: "piggy-bank", count: 10, url: "#" },
    { name: "Best Islamic Brokers", icon: "landmark", count: 12, url: "#" },
    { name: "Best Copy Trading", icon: "users", count: 10, url: "#" },
  ],
};

export default data;
