const data = {
  name: "Ireland", slug: "ireland", code: "IE", flag: "🇮🇪",
  regulator: "CBI", regulatorFull: "Central Bank of Ireland",
  regulatorUrl: "https://www.centralbank.ie", currency: "EUR",
  leverage: "1:30", leverageNote: "Retail (ESMA rules via CBI)",
  compensation: "ICCL — €20,000 per person",
  negativeBalance: "Yes — mandatory under ESMA/CBI rules",
  taxNote: "CFD profits are subject to Capital Gains Tax (CGT) at 33%.",
  localPayments: ["Bank Transfer (SEPA)", "Visa/Mastercard", "PayPal", "Skrill", "Neteller"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 40, localBrokersTotal: 26, hoursResearch: 82,
  author: { name: "Liam O'Brien", role: "Irish Markets Analyst", exp: "13 years", initials: "LO", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "9 Best Forex Brokers in Ireland for 2026 — CBI Regulated",
  metaDescription: "We analyzed 26 CBI-registered brokers for Irish traders. These 9 offer the best trading conditions including EUR accounts, ESMA-compliant leverage, and Irish tax reporting support.",
  keyFinding: "The Central Bank of Ireland is one of Europe's most respected regulators. Irish traders benefit from strong ESMA protections and access to both CBI-regulated local brokers and EU-passported firms. AvaTrade, headquartered in Dublin, gives Irish traders a strong homegrown option.",

  brokers: [
    { rank: 1, slug: "avatrade", badge: "Best Overall Ireland", badgeColor: "#059669", localCurrencyMin: "€100", verdict: "Best for Irish traders. CBI-regulated directly with Dublin headquarters. Strong local presence and full Irish support.", localAdvantages: ["CBI-regulated — Dublin HQ", "ICCL €20K protection", "EUR base account — no conversion", "AvaTradeGO mobile platform", "Dublin office with local support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Best Execution", badgeColor: "#6d28d9", localCurrencyMin: "€0", verdict: "Tightest spreads for Irish traders. CySEC-regulated with CBI registration, offering raw pricing from 0.0 pips.", localAdvantages: ["CySEC-regulated, CBI-registered", "EUR base account available", "0.0 pip raw spreads from €3.50/lot", "TradingView + cTrader + MT4/5", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "ig", badge: "Most Trusted", badgeColor: "#6d28d9", localCurrencyMin: "€300", verdict: "Most trusted broker available in Ireland. 50 years of experience with 17,000+ markets and FCA regulation.", localAdvantages: ["FCA-regulated, CBI-registered", "50+ years of operation", "17,000+ markets", "EUR base account", "Award-winning platform"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "€0", verdict: "Award-winning xStation 5 with no minimum deposit. 0% commission on stocks up to €100K/month.", localAdvantages: ["CySEC-regulated, CBI-registered", "xStation 5 — award-winning platform", "0% commission stocks up to €100K/mo", "No minimum deposit", "EUR base account"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "saxo-bank", badge: "Best Multi-Asset", badgeColor: "#1e293b", localCurrencyMin: "€500", verdict: "Premium multi-asset platform with 72,000+ instruments. Excellent for experienced Irish investors.", localAdvantages: ["Danish bank, CBI cross-border", "72,000+ instruments", "Direct access to Irish & EU exchanges", "Professional research", "EUR accounts with SEPA"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "€100", verdict: "Best social trading platform for Irish beginners. Copy trading and fractional shares.", localAdvantages: ["CySEC-regulated, CBI-registered", "Copy Trading — follow top traders", "Fractional shares from €10", "EUR deposits via SEPA free", "30M+ users worldwide"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "€200", verdict: "Tightest raw spreads at 0.02 pips. Excellent for Irish traders focused on execution quality.", localAdvantages: ["CySEC-regulated, EU-passported", "0.02 pip average EUR/USD spread", "EUR base account available", "cTrader + TradingView", "25+ tier-1 liquidity providers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "xm", badge: "Best for Beginners", badgeColor: "#d97706", localCurrencyMin: "€5", verdict: "Lowest minimum deposit at €5 with strong educational content. Good starting point for new Irish traders.", localAdvantages: ["CySEC-regulated, CBI-registered", "€5 minimum deposit — lowest tested", "1,000+ instruments", "Free educational webinars", "EUR base account"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "fp-markets", badge: null, badgeColor: null, localCurrencyMin: "€100", verdict: "Low-cost ECN broker with strong CySEC regulation. Good value for Irish traders.", localAdvantages: ["CySEC-regulated, EU-passported", "Low ECN commission at $6/lot RT", "EUR base account", "cTrader + TradingView access", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How the Central Bank of Ireland Protects Traders",
    items: [
      { icon: "shield", title: "CBI Authorisation Required", desc: "Any broker offering services to Irish residents must be authorized by the Central Bank of Ireland or operate under EU passporting. Verify any broker at centralbank.ie." },
      { icon: "piggy-bank", title: "ICCL Compensation — €20,000", desc: "The Investor Compensation Company Ltd covers up to €20,000 per person (90% of net loss up to this amount) if a CBI-authorized broker becomes insolvent." },
      { icon: "scale", title: "Negative Balance Protection", desc: "Under ESMA rules enforced by the CBI, retail traders can never lose more than their deposit. Brokers must absorb any negative balance." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:30 Retail", desc: "ESMA limits retail leverage to 1:30 for major forex pairs, 1:20 for minor pairs, 1:10 commodities, 1:5 equities, 1:2 crypto." },
      { icon: "ban", title: "Binary Options Banned", desc: "The CBI enforces ESMA's permanent ban on binary options for retail traders. CFDs remain available with leverage restrictions and mandatory risk warnings." },
      { icon: "clipboard-list", title: "Consumer Protection Code", desc: "The CBI's Consumer Protection Code sets strict standards for how financial firms treat Irish consumers, including clear information requirements and complaints procedures." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Ireland?", a: "Forex and CFD profits in Ireland are subject to Capital Gains Tax (CGT) at 33%. Ireland has one of the highest CGT rates in Europe. The annual CGT exemption is €1,270 per person." },
    { q: "Can I Offset Trading Losses?", a: "Yes. Capital losses can be offset against capital gains in the same tax year or carried forward indefinitely. However, losses can only offset gains of the same nature (i.e., capital losses against capital gains, not income)." },
    { q: "When Do I Need to File and Pay CGT?", a: "Irish CGT is payable in two installments: gains from January–November must be paid by December 15; gains from December must be paid by January 31 of the following year. File your CGT return as part of your annual Form 11 or CG1." },
    { q: "Do I Need to Declare Foreign Broker Accounts?", a: "Yes. Irish residents must declare all foreign financial accounts and assets. If your trading account is with a non-Irish broker, you must include it in your tax return. Revenue's automatic exchange of information means foreign accounts are likely to be reported." },
  ],

  payments: [
    { method: "SEPA Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 days", note: "Standard" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit & credit" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Popular in Ireland" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free–€5", time: "Instant / 1d", note: "E-wallet" },
  ],

  guide: [
    { q: "How to Verify a CBI-Authorized Broker", a: "Visit centralbank.ie and search the register of authorized firms. Check the broker's authorization status and permitted activities. The CBI also publishes a warning list of unauthorized entities." },
    { q: "AvaTrade: Ireland's Homegrown Broker", a: "AvaTrade is headquartered in Dublin with direct CBI regulation since 2006. As Ireland's largest homegrown forex broker, it offers strong local support, EUR accounts, and ICCL protection." },
    { q: "Understanding Irish CGT for Traders", a: "Ireland's 33% CGT rate is among the highest in Europe. Use your annual €1,270 exemption, offset losses where possible, and consider the timing of disposals to manage your tax liability." },
    { q: "EU Passporting for Irish Traders", a: "Many brokers serve Ireland via EU passporting — regulated in one EU country (often CySEC) and authorized across the EU. These brokers must register with the CBI and comply with ESMA rules." },
    { q: "Can Irish Traders Use UK Brokers Post-Brexit?", a: "Since Brexit, UK brokers need separate authorization to serve Irish clients. Many UK brokers now route Irish clients through their EU entities (often CySEC-regulated) rather than FCA-regulated entities." },
  ],

  faq: [
    { q: "What is the best forex broker in Ireland for 2026?", a: "AvaTrade is our top pick for Irish traders in 2026. CBI-regulated with Dublin headquarters, it offers EUR accounts, ICCL protection, and strong local support." },
    { q: "Are forex profits taxable in Ireland?", a: "Yes. Forex profits are subject to Capital Gains Tax at 33%, with a €1,270 annual exemption per person." },
    { q: "Is forex trading legal in Ireland?", a: "Yes, forex trading is fully legal. The Central Bank of Ireland oversees all financial service providers, including forex brokers." },
    { q: "What leverage can Irish traders use?", a: "Under ESMA rules enforced by the CBI, retail clients are limited to 1:30 on major forex pairs, 1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto." },
    { q: "What is the ICCL?", a: "The Investor Compensation Company Ltd provides compensation up to €20,000 (90% of net loss) if a CBI-authorized investment firm is unable to return client assets." },
    { q: "Can I still use UK brokers from Ireland?", a: "Post-Brexit, UK brokers need separate authorization for Irish clients. Most major UK brokers now serve Irish clients through EU-regulated subsidiaries." },
    { q: "What is the minimum deposit for forex trading in Ireland?", a: "Minimum deposits range from €0 (Pepperstone, XTB) to €500 (Saxo Bank). XM offers the lowest at €5." },
    { q: "Which brokers have offices in Ireland?", a: "AvaTrade has its global headquarters in Dublin. Most other top brokers operate in Ireland via EU passporting from CySEC or other EU regulators." },
  ],

  related: [
    { name: "Best EU-Regulated Brokers", icon: "🇪🇺", count: 15, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best for Beginners", icon: "graduation-cap", count: 10, url: "#" },
    { name: "Brokers in UK", icon: "🇬🇧", count: 10, url: "/best-forex-brokers-uk" },
    { name: "Brokers in France", icon: "🇫🇷", count: 10, url: "/best-forex-brokers-france" },
    { name: "Brokers in Germany", icon: "🇩🇪", count: 9, url: "/best-forex-brokers-germany" },
  ],
};

export default data;
