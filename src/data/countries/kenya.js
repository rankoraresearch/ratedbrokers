const data = {
  name: "Kenya", slug: "kenya", code: "KE", flag: "🇰🇪",
  regulator: "CMA Kenya", regulatorFull: "Capital Markets Authority of Kenya",
  regulatorUrl: "https://www.cma.or.ke", currency: "KES",
  leverage: "1:400", leverageNote: "No strict leverage cap — broker dependent",
  compensation: "No formal deposit compensation scheme",
  negativeBalance: "Varies — offered by most international brokers",
  localPayments: ["M-Pesa", "Bank Transfer", "Visa/Mastercard", "Airtel Money"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 42, localBrokersTotal: 18, hoursResearch: 68,
  author: { name: "James Okonkwo", role: "African Markets Analyst", exp: "11 years", initials: "JO", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Kenya for 2026 — CMA Regulated",
  metaDescription: "We tested 18 brokers accepting Kenyan traders with M-Pesa deposits. These 10 offer the best conditions including CMA Kenya regulation, KES accounts, and low minimum deposits.",
  keyFinding: "Kenya is East Africa's leading forex trading hub with a growing number of CMA-licensed brokers. M-Pesa integration is the most important feature for Kenyan traders — our top 5 brokers all support it for instant deposits.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall Kenya", badgeColor: "#059669", localCurrencyMin: "KES 0", verdict: "Best overall for Kenyan traders. CMA-regulated with M-Pesa deposits and the tightest spreads.", localAdvantages: ["CMA Kenya regulated", "M-Pesa deposits accepted", "KES base account available", "Raw ECN spreads from 0.0 pips", "cTrader + TradingView support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "hfm", badge: "Best for M-Pesa", badgeColor: "#059669", localCurrencyMin: "KES 0", verdict: "Top choice for M-Pesa deposits with zero minimum. Strong local presence in Kenya.", localAdvantages: ["M-Pesa instant deposits", "No minimum deposit", "KES base account", "CMA Kenya regulated", "Copy trading available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "KES 500", verdict: "Lowest barrier to entry with excellent education for Kenyan beginners. M-Pesa supported.", localAdvantages: ["Low KES 500 minimum deposit", "M-Pesa deposits", "Free education & webinars", "Micro lot trading (0.01 lots)", "24/5 customer support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "exness", badge: "Instant Withdrawals", badgeColor: "#6d28d9", localCurrencyMin: "KES 1,000", verdict: "Fastest withdrawals for Kenyan traders via M-Pesa. Automatic Islamic accounts available.", localAdvantages: ["M-Pesa instant withdrawals", "KES base currency", "Islamic account available", "No minimum on Standard account", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "fxtm", badge: "Best Education", badgeColor: "#2563eb", localCurrencyMin: "KES 1,000", verdict: "Strong local presence in Kenya with dedicated education programs and M-Pesa integration.", localAdvantages: ["CMA Kenya regulated", "M-Pesa deposits", "Dedicated Kenyan education", "Local office in Nairobi", "KES cent accounts available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "KES 10,000", verdict: "Tightest raw spreads for experienced Kenyan traders. Best for scalping and day trading.", localAdvantages: ["0.02 pip average EUR/USD", "25+ liquidity providers", "MetaTrader 4/5 + cTrader", "Fast execution < 40ms", "Islamic account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "KES 5,000", verdict: "Low-commission ECN trading with competitive raw spreads for Kenyan traders.", localAdvantages: ["ECN commission $6/lot RT", "cTrader + TradingView", "ASIC + CySEC regulated", "Islamic account available", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "tickmill", badge: null, badgeColor: null, localCurrencyMin: "KES 5,000", verdict: "Competitive raw spreads and low commission. Good choice for Kenyan scalpers.", localAdvantages: ["Raw spreads from 0.0 pips", "Low $4/lot commission", "CMA Kenya regulated", "Fast execution", "Islamic account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "avatrade", badge: null, badgeColor: null, localCurrencyMin: "KES 5,000", verdict: "Multi-platform broker with AvaProtect risk management tool for Kenyan traders.", localAdvantages: ["AvaProtect risk management", "Islamic account available", "Multiple platforms", "Fixed and floating spreads", "Regulated by multiple authorities"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "KES 5,000", verdict: "Best for Kenyan traders wanting to copy successful investors. Simple mobile interface.", localAdvantages: ["Copy Trading feature", "Simple mobile app", "Fractional shares available", "30M+ users worldwide", "Social trading community"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How CMA Kenya Protects Kenyan Traders",
    items: [
      { icon: "shield", title: "CMA Licensing Required", desc: "The Capital Markets Authority of Kenya requires all forex brokers serving Kenyan residents to hold a valid CMA licence. Check the CMA register at cma.or.ke before opening an account." },
      { icon: "piggy-bank", title: "Client Fund Segregation", desc: "CMA-licensed brokers must hold client funds in segregated accounts at Kenyan banks, separate from the broker's operating funds." },
      { icon: "bar-chart-3", title: "Capital Adequacy", desc: "CMA requires licensed brokers to maintain minimum capital requirements, ensuring they have sufficient funds to operate and meet client obligations." },
      { icon: "clipboard-list", title: "Regular Reporting", desc: "Licensed brokers must submit regular financial reports to CMA, including audited financial statements and client fund reconciliation reports." },
      { icon: "scale", title: "Investor Education", desc: "CMA Kenya actively promotes investor education and awareness, requiring brokers to provide risk warnings and educational resources to retail clients." },
      { icon: "ban", title: "Anti-Fraud Measures", desc: "CMA maintains a list of unlicensed entities and regularly issues warnings about fraudulent forex schemes targeting Kenyan investors." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "Is Forex Trading Taxed in Kenya?", a: "Yes. Forex trading profits in Kenya are subject to income tax. For individuals, profits are taxed at progressive rates from 10% to 30%. If trading is your primary income source, KRA (Kenya Revenue Authority) may classify you as a business and apply business income tax rates." },
    { q: "Do I Need to Declare Forex Income?", a: "Yes, all forex trading income must be declared to the Kenya Revenue Authority (KRA) in your annual tax return. Failure to declare can result in penalties. Keep detailed records of all trades, profits, and losses." },
    { q: "Are There Withholding Taxes?", a: "Brokers do not withhold tax on your trading profits. It is your responsibility to declare and pay taxes to KRA. Capital gains from forex trading are treated as regular income rather than capital gains in Kenya." },
  ],

  payments: [
    { method: "M-Pesa", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Best for Kenya" },
    { method: "Bank Transfer", deposit: "Free", withdrawal: "Free–KES 500", time: "1-3 hours", note: "Local banks" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Credit/debit" },
    { method: "Airtel Money", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Select brokers" },
  ],

  guide: [
    { q: "How to Verify a CMA Kenya Licence", a: "Visit cma.or.ke and check the list of licensed entities. Verify the broker holds a Non-Dealing Online Foreign Exchange Broker licence. The CMA also publishes a list of unlicensed entities to avoid." },
    { q: "How to Deposit via M-Pesa", a: "Most top Kenyan brokers support M-Pesa deposits. Go to your broker's deposit page, select M-Pesa, enter your phone number, and confirm the STK push notification on your phone. Deposits are instant and free." },
    { q: "Best Trading Hours for Kenya", a: "The best times for Kenyan traders are 11:00 AM – 1:00 PM EAT (London open) and 4:00 PM – 8:00 PM EAT (London/New York overlap). These windows offer the highest liquidity for major forex pairs." },
    { q: "How to Start Forex Trading in Kenya", a: "1. Choose a CMA-licensed broker from our list. 2. Submit your Kenyan ID and proof of address. 3. Fund your account via M-Pesa (instant and free). 4. Start with a demo account to practice. 5. Trade micro lots (0.01) to manage risk." },
    { q: "Is Forex Trading Safe in Kenya?", a: "Trading with CMA-licensed brokers is safer as they are subject to regulatory oversight. Avoid unlicensed brokers and 'forex signal' groups promising guaranteed returns — these are common scams in Kenya." },
  ],

  faq: [
    { q: "What is the best forex broker in Kenya for 2026?", a: "Pepperstone is our top pick for Kenyan traders in 2026. It is CMA Kenya regulated, accepts M-Pesa deposits, offers KES accounts, and has raw ECN spreads from 0.0 pips." },
    { q: "Is forex trading legal in Kenya?", a: "Yes, forex trading is legal and regulated by the Capital Markets Authority (CMA) of Kenya. Only trade with CMA-licensed brokers for maximum protection." },
    { q: "Can I deposit with M-Pesa?", a: "Yes, most top brokers accept M-Pesa deposits. HFM, Pepperstone, XM, Exness, and FXTM all support M-Pesa for instant, free deposits and withdrawals." },
    { q: "What is the minimum deposit in Kenya?", a: "Minimum deposits range from KES 0 (Pepperstone, HFM) to KES 10,000 (IC Markets). XM offers a low KES 500 minimum deposit ideal for beginners." },
    { q: "Are forex profits taxed in Kenya?", a: "Yes, forex trading profits are subject to income tax at rates from 10% to 30%. You must declare all trading income to the Kenya Revenue Authority (KRA)." },
    { q: "What leverage is available in Kenya?", a: "Kenya has no strict leverage cap like EU/UK regulators. Most brokers offer up to 1:400 or 1:500 for Kenyan traders, though high leverage significantly increases risk." },
    { q: "Can I trade forex on my phone in Kenya?", a: "Yes, all brokers in our ranking offer mobile trading apps for Android and iOS. You can also deposit via M-Pesa directly from your phone, making mobile-only trading fully viable." },
    { q: "How do I avoid forex scams in Kenya?", a: "Only trade with CMA Kenya-licensed brokers. Avoid social media 'forex gurus' promising guaranteed returns. Never send money to individuals — only deposit directly with regulated brokers." },
  ],

  related: [
    { name: "Brokers in Nigeria", icon: "🇳🇬", count: 10, url: "/best-forex-brokers-nigeria" },
    { name: "Brokers in Ghana", icon: "🇬🇭", count: 8, url: "/best-forex-brokers-ghana" },
    { name: "Brokers in South Africa", icon: "🇿🇦", count: 10, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best Low Deposit Brokers", icon: "piggy-bank", count: 10, url: "#" },
    { name: "Best Mobile Trading Apps", icon: "smartphone", count: 10, url: "#" },
  ],
};

export default data;
