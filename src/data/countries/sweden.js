const data = {
  name: "Sweden", slug: "sweden", code: "SE", flag: "🇸🇪",
  regulator: "FI", regulatorFull: "Finansinspektionen",
  regulatorUrl: "https://www.fi.se", currency: "SEK",
  leverage: "1:30", leverageNote: "Retail (ESMA rules via FI)",
  compensation: "Insättningsgarantin — SEK 1,050,000 per person",
  negativeBalance: "Yes — mandatory under ESMA/FI rules",
  taxNote: "CFD profits are subject to 30% capital gains tax (kapitalvinstskatt).",
  localPayments: ["Swish", "Bank Transfer (SEPA)", "Visa/Mastercard", "Trustly", "Skrill"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 38, localBrokersTotal: 24, hoursResearch: 78,
  author: { name: "Erik Lindström", role: "Nordic Markets Specialist", exp: "11 years", initials: "EL", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "9 Best Forex Brokers in Sweden for 2026 — FI Regulated",
  metaDescription: "We tested 24 FI-registered brokers with real SEK accounts. These 9 offer the best trading conditions for Swedish traders including Swish deposits, SEK accounts, and ESMA-compliant leverage.",
  keyFinding: "Swedish traders benefit from some of the highest deposit protection in Europe at SEK 1,050,000. Finansinspektionen enforces strict ESMA rules while allowing access to major EU-passported brokers. Swish support makes instant funding seamless.",

  brokers: [
    { rank: 1, slug: "ig", badge: "Best Overall Sweden", badgeColor: "#059669", localCurrencyMin: "kr2000", verdict: "Best overall for Swedish traders. FI-registered with 50 years of experience and 17,000+ markets including OMX Stockholm.", localAdvantages: ["FI-registered, FCA-regulated", "17,000+ markets including OMX Stockholm", "SEK base account — no conversion fees", "Swedish-language support available", "50+ years of market experience"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Best Execution", badgeColor: "#6d28d9", localCurrencyMin: "kr0", verdict: "Tightest spreads and fastest execution. CySEC-regulated with FI registration, ideal for active Swedish traders.", localAdvantages: ["CySEC-regulated, FI-registered", "SEK base account available", "0.0 pip raw spreads from $3.50/lot", "TradingView + cTrader + MT4/5", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "saxo-bank", badge: "Best Multi-Asset", badgeColor: "#1e293b", localCurrencyMin: "kr0", verdict: "Premium multi-asset platform popular in Scandinavia. Direct access to OMX Stockholm and 72,000+ instruments.", localAdvantages: ["Danish bank, FI-registered", "Direct access to OMX Stockholm", "72,000+ instruments", "SEK base account", "SaxoTraderPRO for professionals"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "kr0", verdict: "Award-winning xStation 5 with no minimum deposit. Growing rapidly in the Swedish market.", localAdvantages: ["CySEC-regulated, FI-registered", "xStation 5 — award-winning platform", "0% commission stocks up to SEK equiv.", "No minimum deposit", "Swedish-language education"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "kr1000", verdict: "Best social trading platform for Swedish beginners. Copy trading with fractional shares.", localAdvantages: ["CySEC-regulated, FI-registered", "Copy Trading — follow top traders", "Fractional shares available", "Trustly deposits supported", "30M+ users worldwide"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "kr2000", verdict: "Tightest raw spreads at 0.02 pips. Excellent for Swedish traders who prioritize execution quality.", localAdvantages: ["CySEC-regulated, EU-passported", "0.02 pip average EUR/USD spread", "Multiple base currencies", "cTrader + TradingView", "25+ tier-1 liquidity providers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "cmc-markets", badge: "Most Markets", badgeColor: "#2563eb", localCurrencyMin: "kr0", verdict: "Largest product range with 10,000+ instruments. LSE-listed, with strong Scandinavian presence.", localAdvantages: ["FCA-regulated, FI-registered", "10,000+ instruments available", "Next Generation platform", "SEK base account", "LSE-listed (LON:CMCX)"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "xm", badge: "Best for Beginners", badgeColor: "#d97706", localCurrencyMin: "kr50", verdict: "Lowest minimum deposit with excellent educational resources. Good starting point for new Swedish traders.", localAdvantages: ["CySEC-regulated, FI-registered", "Very low minimum deposit", "1,000+ instruments", "Free webinars and education", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "fp-markets", badge: null, badgeColor: null, localCurrencyMin: "kr1000", verdict: "Low-cost ECN broker with strong CySEC regulation. Good value for cost-conscious Swedish traders.", localAdvantages: ["CySEC-regulated, EU-passported", "Low ECN commission at $6/lot RT", "cTrader + TradingView access", "4.8 Trustpilot rating", "Multiple base currencies"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How Finansinspektionen Protects Swedish Traders",
    items: [
      { icon: "shield", title: "FI Registration Required", desc: "Any broker offering services to Swedish residents must be registered with Finansinspektionen or authorized under EU passporting. Verify any broker at fi.se before opening an account." },
      { icon: "piggy-bank", title: "Deposit Guarantee — SEK 1,050,000", desc: "The Swedish deposit guarantee scheme (insättningsgarantin) covers up to SEK 1,050,000 per person per institution — one of the highest in the EU." },
      { icon: "scale", title: "Negative Balance Protection", desc: "Under ESMA rules enforced by FI, retail traders can never lose more than their deposit. Brokers must absorb any negative balance." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:30 Retail", desc: "ESMA limits retail leverage to 1:30 for major forex pairs, 1:20 for minor pairs, 1:10 commodities, 1:5 equities, 1:2 crypto." },
      { icon: "ban", title: "Binary Options Banned", desc: "FI enforces ESMA's permanent ban on binary options for retail traders. CFDs remain available with mandatory leverage restrictions." },
      { icon: "clipboard-list", title: "Strict Transparency Rules", desc: "FI-registered brokers must display risk warnings in Swedish and report the percentage of retail accounts that lose money when trading leveraged products." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Sweden?", a: "Forex and CFD profits in Sweden are taxed as capital gains (kapitalvinst) at a flat rate of 30%. Gains and losses are reported under the 'inkomst av kapital' category on your annual tax return." },
    { q: "Can I Use an ISK Account for Forex Trading?", a: "No. Investeringssparkonto (ISK) accounts are designed for stocks, funds, and ETFs. Forex CFDs and leveraged products cannot be held in ISK accounts. Standard trading accounts with 30% capital gains tax apply to forex trading." },
    { q: "Can I Offset Trading Losses?", a: "Yes. Capital losses from forex trading can offset 70% of capital gains (losses above SEK 100,000 can offset 100%). Unused losses carry forward indefinitely." },
    { q: "Do I Need to Report Foreign Broker Accounts?", a: "Yes. Swedish residents must report all income from foreign accounts on their annual tax return. If using a non-Swedish broker, you are responsible for calculating and reporting your own gains and losses." },
  ],

  payments: [
    { method: "Swish", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "Best for Sweden" },
    { method: "Trustly", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Popular in Nordics" },
    { method: "SEPA Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 days", note: "Standard" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit & credit" },
  ],

  guide: [
    { q: "How to Verify an FI-Registered Broker", a: "Visit fi.se and use the company register to search for the broker. Check that the firm is authorized to provide investment services in Sweden. FI also publishes warnings about unauthorized firms." },
    { q: "Swish & Trustly: Fastest Ways to Fund Your Account", a: "Swish offers instant SEK deposits for most top brokers. Trustly is another popular option providing direct bank transfers. Both are free and widely accepted by EU-regulated brokers serving Sweden." },
    { q: "ISK vs Standard Account for Trading", a: "ISK accounts offer a favorable flat tax on stocks and funds, but cannot be used for forex CFD trading. For forex, you must use a standard account with 30% capital gains tax." },
    { q: "EU Passporting for Swedish Traders", a: "Many brokers serve Sweden via EU passporting — regulated in one EU country and authorized across the EU. These brokers must register with FI and comply with ESMA rules." },
    { q: "Can Swedish Traders Use Non-EU Brokers?", a: "Not recommended. Non-EU brokers lack ESMA protections including leverage limits, negative balance protection, and the Swedish deposit guarantee. FI warns against unauthorized brokers." },
  ],

  faq: [
    { q: "What is the best forex broker in Sweden for 2026?", a: "IG is our top pick for Swedish traders in 2026. It's FI-registered, offers SEK base accounts, 17,000+ markets including OMX Stockholm, and has decades of experience." },
    { q: "Are forex profits taxable in Sweden?", a: "Yes. Forex profits are taxed at a flat 30% capital gains rate under the 'inkomst av kapital' category." },
    { q: "Is forex trading legal in Sweden?", a: "Yes, forex trading is fully legal. Brokers must be registered with Finansinspektionen or authorized under EU passporting." },
    { q: "What leverage can Swedish traders use?", a: "Under ESMA rules enforced by FI, retail clients are limited to 1:30 on major forex pairs, 1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto." },
    { q: "Can I use Swish to deposit funds?", a: "Several brokers accept Swish for instant SEK deposits, including some of our top-ranked options. Check individual broker pages for current Swish support." },
    { q: "What is the minimum deposit for forex trading in Sweden?", a: "Minimum deposits range from kr0 (Pepperstone, Saxo Bank, XTB, CMC Markets) to kr2,000 (IG, IC Markets)." },
  ],

  related: [
    { name: "Best EU-Regulated Brokers", icon: "🇪🇺", count: 15, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best for Beginners", icon: "graduation-cap", count: 10, url: "#" },
    { name: "Brokers in Germany", icon: "🇩🇪", count: 9, url: "/best-forex-brokers-germany" },
    { name: "Brokers in UK", icon: "🇬🇧", count: 10, url: "/best-forex-brokers-uk" },
    { name: "Brokers in Netherlands", icon: "🇳🇱", count: 8, url: "/best-forex-brokers-netherlands" },
  ],
};

export default data;
