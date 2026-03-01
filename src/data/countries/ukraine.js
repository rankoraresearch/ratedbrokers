const data = {
  name: "Ukraine", slug: "ukraine", code: "UA", flag: "🇺🇦",
  regulator: "NSSMC", regulatorFull: "National Securities and Stock Market Commission",
  regulatorUrl: "https://www.nssmc.gov.ua", currency: "UAH",
  leverage: "1:500", leverageNote: "No strict retail cap — broker dependent",
  compensation: "No formal deposit compensation for forex",
  negativeBalance: "Varies — offered by most international brokers",
  localPayments: ["Bank Transfer (UAH)", "Visa/Mastercard", "Privat24", "Monobank"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 34, localBrokersTotal: 14, hoursResearch: 64,
  author: { name: "Dmitry Volkov", role: "CIS Markets Analyst", exp: "15 years", initials: "DV", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "8 Best Forex Brokers in Ukraine for 2026 — NSSMC Regulated",
  metaDescription: "We tested brokers accepting Ukrainian traders with UAH accounts. These 8 offer the best conditions despite wartime challenges, with UAH deposits and Ukrainian-language support.",
  keyFinding: "Ukraine's forex market continues despite the ongoing conflict. The NBU (National Bank of Ukraine) has imposed temporary currency controls, but forex trading remains legal. Our top picks are international brokers that still accept Ukrainian clients with UAH deposits via PrivatBank and Monobank.",

  brokers: [
    { rank: 1, slug: "exness", badge: "Best Overall Ukraine", badgeColor: "#059669", localCurrencyMin: "₴0", verdict: "Best for Ukrainian traders. Accepts UAH deposits, instant withdrawals, and multiple account types despite wartime restrictions.", localAdvantages: ["UAH base account", "Instant withdrawals", "No minimum deposit", "Ukrainian-language support", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "₴0", verdict: "Tightest raw spreads for Ukrainian traders. Strong international regulation.", localAdvantages: ["Raw ECN from 0.0 pips", "UAH deposits accepted", "FCA + ASIC regulated", "cTrader + TradingView", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "₴200", verdict: "Low deposit and Ukrainian-language education. Best entry point for Ukrainian beginners.", localAdvantages: ["Low ₴200 minimum deposit", "Ukrainian education content", "Micro lot trading", "UAH deposits", "24/5 support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "ic-markets", badge: "Best Execution", badgeColor: "#6d28d9", localCurrencyMin: "₴5,000", verdict: "Best execution quality for Ukrainian traders. Ultra-tight spreads from 25+ LPs.", localAdvantages: ["0.02 pip average EUR/USD", "25+ liquidity providers", "cTrader + MetaTrader", "Fast execution < 40ms", "Islamic account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "hfm", badge: "Best Copy Trading", badgeColor: "#059669", localCurrencyMin: "₴0", verdict: "Zero minimum with copy trading. Good option for Ukrainian beginners.", localAdvantages: ["No minimum deposit", "Copy trading feature", "UAH deposits", "Multiple account types", "Ukrainian support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "fxtm", badge: "Best Cent Account", badgeColor: "#2563eb", localCurrencyMin: "₴200", verdict: "Cent accounts for minimal risk trading. Good for Ukrainians starting small.", localAdvantages: ["Cent account available", "Low minimum deposit", "UAH deposits", "Copy trading", "Educational content"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "₴3,000", verdict: "Lowest ECN commission with competitive raw pricing.", localAdvantages: ["ECN commission $6/lot RT", "cTrader + TradingView", "ASIC + CySEC regulated", "4.8 Trustpilot", "Islamic account"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "roboforex", badge: null, badgeColor: null, localCurrencyMin: "₴0", verdict: "CIS-focused broker with strong UAH support and multiple account types.", localAdvantages: ["UAH base account", "Cent account", "R StocksTrader platform", "CopyFX trading", "Ukrainian support"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "Forex Regulation in Ukraine",
    items: [
      { icon: "shield", title: "NSSMC Oversight", desc: "The National Securities and Stock Market Commission (NSSMC) regulates capital markets in Ukraine. NSSMC has been developing a forex-specific regulatory framework, with legislation progressing since 2021." },
      { icon: "landmark", title: "NBU Currency Controls", desc: "The National Bank of Ukraine has imposed temporary currency controls due to the conflict. These affect international transfers and may limit how Ukrainian traders can fund and withdraw from forex accounts." },
      { icon: "alert-triangle", title: "Wartime Restrictions", desc: "Since February 2022, Ukraine has implemented martial law measures affecting financial transactions. Some restrictions apply to international money transfers and currency conversion." },
      { icon: "piggy-bank", title: "International Regulation", desc: "Most brokers serving Ukrainian traders are regulated by FCA, ASIC, or CySEC. These provide fund segregation and regulatory oversight, which is especially important given Ukraine's developing local framework." },
      { icon: "bar-chart-3", title: "Developing Framework", desc: "Ukraine has been working on comprehensive forex market legislation. Once implemented, this will establish licensing requirements, capital adequacy rules, and client protection standards." },
      { icon: "clipboard-list", title: "DPS Tax Service", desc: "The State Tax Service of Ukraine (DPS) requires declaration of all investment income, including forex profits, in annual tax returns. Tax compliance remains important despite wartime conditions." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Ukraine?", a: "Forex trading profits are subject to personal income tax (PDFO) at 18% plus military levy at 1.5% (total 19.5%) since the conflict began. All investment income from foreign sources must be declared in the annual tax return." },
    { q: "Do I Need to Declare Foreign Accounts?", a: "Yes, Ukrainian residents should declare foreign financial accounts and investment income to the State Tax Service (DPS). This includes forex trading accounts held with international brokers." },
    { q: "Are There Currency Conversion Restrictions?", a: "The NBU has imposed temporary limits on currency purchases and international transfers. Check current NBU regulations before making large deposits or withdrawals from international forex accounts." },
  ],

  payments: [
    { method: "Bank Transfer (UAH)", deposit: "Free", withdrawal: "Free", time: "1-3 hours", note: "PrivatBank, Monobank" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Ukrainian cards" },
    { method: "Crypto (USDT)", deposit: "Free", withdrawal: "Network fee", time: "10-30 min", note: "Bypasses restrictions" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free–$5", time: "Instant / 1d", note: "E-wallets" },
  ],

  guide: [
    { q: "How to Trade Forex from Ukraine During Conflict", a: "Forex trading is still possible from Ukraine. Use brokers that accept UAH deposits and support Ukrainian banks (PrivatBank, Monobank). Crypto (USDT) is an alternative if bank transfers are restricted. Be aware of NBU currency controls affecting international transfers." },
    { q: "How to Open a Forex Account from Ukraine", a: "Choose an international broker from our list. Submit your Ukrainian passport or ID card and proof of address. Fund via PrivatBank/Monobank transfer or Visa/Mastercard. Most accounts are approved within 24 hours." },
    { q: "Best Trading Hours for Ukraine", a: "Best times for Ukrainian traders: 11:00 AM – 1:00 PM EET (London session) and 4:30 PM – 7:30 PM EET (London/New York overlap). EUR/UAH pairs are less liquid; focus on major pairs." },
    { q: "Currency Controls and Forex Trading", a: "NBU has imposed temporary limits on foreign currency purchases and international transfers. These may affect large deposits and withdrawals. Check current NBU rules. Crypto (USDT) can be used to bypass some banking restrictions." },
  ],

  faq: [
    { q: "What is the best forex broker in Ukraine for 2026?", a: "Exness is our top pick for Ukrainian traders in 2026. It accepts UAH deposits, offers instant withdrawals, no minimum deposit, and supports Ukrainian-language trading." },
    { q: "Is forex trading legal in Ukraine?", a: "Yes, forex trading is legal in Ukraine. The NSSMC is developing a regulatory framework. International brokers regulated by FCA, ASIC, or CySEC are commonly used by Ukrainian traders." },
    { q: "Can I trade forex during the conflict?", a: "Yes, many Ukrainian traders continue to trade forex. Some NBU currency restrictions apply, but UAH deposits to international brokers and crypto funding remain viable." },
    { q: "What payment methods work from Ukraine?", a: "PrivatBank and Monobank transfers, Visa/Mastercard, crypto (USDT), and e-wallets (Skrill/Neteller) are the main options. Some methods may be temporarily restricted by NBU." },
    { q: "Are forex profits taxed in Ukraine?", a: "Yes, forex profits are subject to 18% PDFO + 1.5% military levy (total 19.5%). Declare all foreign income to the State Tax Service." },
    { q: "What leverage is available?", a: "Most international brokers offer up to 1:500 for Ukrainian traders. There is no local leverage cap as Ukraine's forex regulation is still developing." },
  ],

  related: [
    { name: "Brokers in Russia", icon: "🇷🇺", count: 8, url: "/best-forex-brokers-russia" },
    { name: "Brokers in Czech Republic", icon: "🇨🇿", count: 8, url: "/best-forex-brokers-czech-republic" },
    { name: "Brokers in Romania", icon: "🇷🇴", count: 8, url: "/best-forex-brokers-romania" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best Low Deposit Brokers", icon: "piggy-bank", count: 10, url: "#" },
    { name: "Best Copy Trading", icon: "users", count: 10, url: "#" },
  ],
};

export default data;
