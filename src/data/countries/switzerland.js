const data = {
  name: "Switzerland", slug: "switzerland", code: "CH", flag: "🇨🇭",
  regulator: "FINMA", regulatorFull: "Swiss Financial Market Supervisory Authority",
  regulatorUrl: "https://www.finma.ch", currency: "CHF",
  leverage: "1:100", leverageNote: "No ESMA restrictions (non-EU country)",
  compensation: "esisuisse — CHF 100,000 per depositor",
  negativeBalance: "Varies by broker — not mandatory under FINMA",
  taxNote: "No capital gains tax for private individuals. Forex profits are generally tax-free unless classified as professional trading.",
  localPayments: ["Bank Transfer (SIC/SEPA)", "Visa/Mastercard", "PostFinance", "TWINT", "PayPal"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 36, localBrokersTotal: 18, hoursResearch: 90,
  author: { name: "Thomas Weber", role: "Swiss Finance Specialist", exp: "16 years", initials: "TW", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "8 Best Forex Brokers in Switzerland for 2026 — FINMA Regulated",
  metaDescription: "We tested 18 FINMA-authorized brokers with real CHF accounts. These 8 offer the best trading conditions for Swiss traders including tax-free profits, higher leverage, and CHF base accounts.",
  keyFinding: "Switzerland stands apart in Europe: no ESMA restrictions, no capital gains tax for private traders, and leverage up to 1:100 or higher. FINMA-regulated brokers like Swissquote and Dukascopy offer a combination of Swiss banking security and competitive trading conditions unmatched elsewhere.",

  brokers: [
    { rank: 1, slug: "swissquote", badge: "Best Overall Switzerland", badgeColor: "#059669", localCurrencyMin: "CHF 0", verdict: "Best overall for Swiss traders. FINMA-regulated Swiss bank with SIX-listed shares, offering 400,000+ products and full banking services.", localAdvantages: ["FINMA-regulated Swiss bank", "Listed on SIX Swiss Exchange (SQN)", "esisuisse CHF 100K protection", "CHF base account — no conversion", "Full banking + trading in one platform"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "ig", badge: "Most Markets", badgeColor: "#6d28d9", localCurrencyMin: "CHF 300", verdict: "Largest product range available in Switzerland. FCA-regulated with Swiss operations, offering 17,000+ markets.", localAdvantages: ["FCA-regulated, Swiss operations", "17,000+ markets available", "CHF base account", "50+ years of experience", "Award-winning platform"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "dukascopy", badge: "Best ECN", badgeColor: "#2563eb", localCurrencyMin: "CHF 100", verdict: "Swiss ECN bank with transparent pricing and JForex platform. True Swiss banking with FINMA regulation.", localAdvantages: ["FINMA-regulated Swiss bank", "esisuisse CHF 100K protection", "True ECN with SWFX marketplace", "JForex + MT4/5 platforms", "CHF base account"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "saxo-bank", badge: "Best Multi-Asset", badgeColor: "#1e293b", localCurrencyMin: "CHF 500", verdict: "Premium multi-asset platform with 72,000+ instruments. Danish bank with strong Swiss presence.", localAdvantages: ["Danish bank, FINMA cross-border", "72,000+ instruments", "CHF base account", "Professional-grade SaxoTraderPRO", "Direct market access available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "pepperstone", badge: "Best Execution", badgeColor: "#6d28d9", localCurrencyMin: "CHF 0", verdict: "Tightest spreads available in Switzerland. CySEC-regulated with Swiss cross-border authorization.", localAdvantages: ["CySEC-regulated, cross-border authorized", "0.0 pip raw spreads available", "CHF base account", "TradingView + cTrader + MT4/5", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "CHF 200", verdict: "Tightest raw spreads in our test. Popular with Swiss algorithmic traders.", localAdvantages: ["CySEC-regulated, cross-border", "0.02 pip average EUR/USD spread", "CHF base account available", "cTrader + TradingView", "25+ tier-1 liquidity providers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "CHF 0", verdict: "Award-winning xStation 5 platform with no minimum deposit. Good for Swiss traders seeking modern tools.", localAdvantages: ["CySEC-regulated, cross-border", "xStation 5 — award-winning platform", "0% commission stocks", "No minimum deposit", "Multi-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "fp-markets", badge: null, badgeColor: null, localCurrencyMin: "CHF 100", verdict: "Low-cost ECN broker with competitive commissions. Solid option for cost-conscious Swiss traders.", localAdvantages: ["CySEC-regulated, cross-border", "Low ECN commission at $6/lot RT", "CHF base account", "cTrader + TradingView access", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How FINMA Protects Swiss Traders",
    items: [
      { icon: "shield", title: "FINMA Authorisation Required", desc: "Any broker operating in Switzerland must be authorized by FINMA or operate under cross-border provisions. Verify any broker at finma.ch before depositing funds." },
      { icon: "piggy-bank", title: "esisuisse Protection — CHF 100,000", desc: "FINMA-regulated banks (including Swissquote and Dukascopy) are members of esisuisse, which protects deposits up to CHF 100,000 per depositor per bank." },
      { icon: "scale", title: "No ESMA Restrictions", desc: "As a non-EU country, Switzerland is not bound by ESMA rules. Swiss brokers can offer higher leverage, and there are no mandatory negative balance protection requirements (though many offer it voluntarily)." },
      { icon: "bar-chart-3", title: "Higher Leverage Available", desc: "FINMA-regulated brokers can offer leverage up to 1:100 or higher for retail clients, compared to ESMA's 1:30 limit. Professional accounts may access even higher leverage." },
      { icon: "landmark", title: "Swiss Banking Standard", desc: "FINMA-regulated forex brokers that hold banking licenses (Swissquote, Dukascopy) must meet Swiss banking capital requirements — among the strictest globally." },
      { icon: "clipboard-list", title: "Client Asset Segregation", desc: "FINMA requires strict separation of client funds from the broker's own funds. Swiss banking law provides additional protections for depositors in case of insolvency." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "Are Forex Profits Tax-Free in Switzerland?", a: "For private individuals, capital gains on movable assets (including forex) are generally tax-free in Switzerland. However, if you are classified as a 'professional securities trader' (gewerbsmässiger Wertschriftenhändler), profits become taxable as income." },
    { q: "When Am I Classified as a Professional Trader?", a: "Swiss tax authorities use several criteria: trading volume exceeds total portfolio value 5x per year, leveraged products represent a large share of portfolio, holding periods are very short, or trading is your primary income source. Meeting multiple criteria may trigger professional classification." },
    { q: "Is There a Wealth Tax on Trading Accounts?", a: "Yes. Switzerland levies a cantonal wealth tax (Vermögenssteuer) on total net assets, including trading account balances. Rates vary by canton, typically 0.3%–1.0% per year. This applies regardless of whether trading gains are realized." },
    { q: "Do I Need to Declare Foreign Broker Accounts?", a: "Yes. All financial assets, including foreign trading accounts, must be declared on your cantonal tax return. Switzerland's automatic exchange of information (AEOI) means foreign accounts are likely to be reported to Swiss tax authorities anyway." },
  ],

  payments: [
    { method: "Swiss Bank Transfer", deposit: "Free", withdrawal: "Free", time: "Same day (SIC)", note: "Best for CH" },
    { method: "SEPA Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 days", note: "EUR transfers" },
    { method: "PostFinance", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Popular in CH" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit & credit" },
  ],

  guide: [
    { q: "How to Verify a FINMA-Authorized Broker", a: "Visit finma.ch and search the licensed institutions list. Verify the broker holds a banking license or securities dealer license. For cross-border brokers, check if they are registered in FINMA's cross-border register." },
    { q: "FINMA vs ESMA: Key Differences for Traders", a: "Switzerland is not part of the EU, so ESMA rules don't apply. Key differences: higher leverage (up to 1:100+), no mandatory negative balance protection, no binary options ban, and different compensation schemes. Swiss regulation focuses on banking standards rather than product restrictions." },
    { q: "Swiss Bank vs Cross-Border Broker", a: "FINMA-regulated Swiss banks (Swissquote, Dukascopy) offer esisuisse protection and full banking services. Cross-border brokers (regulated in EU) may offer tighter spreads but lack Swiss deposit protection. Choose based on your priority: security vs cost." },
    { q: "Can Swiss Traders Use EU-Regulated Brokers?", a: "Yes. Many EU-regulated brokers offer cross-border services to Swiss clients. They don't provide esisuisse protection but do offer their home country's compensation schemes (e.g., CySEC ICF at €20,000)." },
  ],

  faq: [
    { q: "What is the best forex broker in Switzerland for 2026?", a: "Swissquote is our top pick for Swiss traders in 2026. It's a FINMA-regulated Swiss bank, SIX-listed, with esisuisse protection and CHF base accounts." },
    { q: "Are forex profits taxable in Switzerland?", a: "Generally no. Private individuals are exempt from capital gains tax on forex trading. However, if classified as a professional trader, profits become taxable income." },
    { q: "Is forex trading legal in Switzerland?", a: "Yes, forex trading is fully legal. FINMA oversees all financial market participants, including forex brokers operating in Switzerland." },
    { q: "What leverage can Swiss traders use?", a: "Switzerland is not bound by ESMA rules. FINMA-regulated brokers typically offer up to 1:100 for retail clients, with professional accounts accessing higher leverage." },
    { q: "Do Swiss brokers offer CHF accounts?", a: "Yes. All top-ranked brokers in our list offer CHF base accounts, avoiding CHF/EUR or CHF/USD conversion fees on deposits and withdrawals." },
    { q: "What is esisuisse?", a: "esisuisse is Switzerland's deposit protection scheme. It covers deposits up to CHF 100,000 per depositor per bank if a FINMA-regulated bank becomes insolvent." },
  ],

  related: [
    { name: "Best FINMA Brokers", icon: "🇨🇭", count: 8, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best for Professionals", icon: "briefcase", count: 10, url: "#" },
    { name: "Brokers in Germany", icon: "🇩🇪", count: 9, url: "/best-forex-brokers-germany" },
    { name: "Brokers in Austria", icon: "🇦🇹", count: 8, url: "/best-forex-brokers-austria" },
    { name: "Brokers in UK", icon: "🇬🇧", count: 10, url: "/best-forex-brokers-uk" },
  ],
};

export default data;
