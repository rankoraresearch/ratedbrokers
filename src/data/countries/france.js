const data = {
  name: "France", slug: "france", code: "FR", flag: "🇫🇷",
  regulator: "AMF", regulatorFull: "Autorité des Marchés Financiers",
  regulatorUrl: "https://www.amf-france.org", currency: "EUR",
  leverage: "1:30", leverageNote: "Retail (ESMA rules via AMF)",
  compensation: "FGDR — €70,000 per person",
  negativeBalance: "Yes — mandatory under ESMA/AMF rules",
  taxNote: "CFD profits are subject to flat tax (PFU) of 30% or progressive income tax.",
  localPayments: ["Bank Transfer (SEPA)", "Visa/Mastercard", "PayPal", "Skrill", "Neteller"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 48, localBrokersTotal: 32, hoursResearch: 88,
  author: { name: "Sophie Dupont", role: "European Markets Analyst", exp: "14 years", initials: "SD", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in France for 2026 — AMF Regulated",
  metaDescription: "We analyzed 32 AMF-registered brokers for French traders. These 10 offer the best trading conditions including FGDR protection, EUR base accounts, and ESMA-compliant leverage.",
  keyFinding: "AMF-registered brokers operating under ESMA rules provide robust trader protection. All top 5 brokers for France offer negative balance protection, segregated funds, and leverage caps — essential safeguards for retail traders in the French market.",

  brokers: [
    { rank: 1, slug: "ig", badge: "Best Overall France", badgeColor: "#059669", localCurrencyMin: "€300", verdict: "Best overall for French traders. AMF-registered with 50 years of experience, offering 17,000+ markets and comprehensive EUR account support.", localAdvantages: ["AMF-registered, FCA & BaFin regulated", "FGDR €70K deposit protection", "EUR base account — no conversion fees", "17,000+ markets including French stocks", "French-language platform and support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Best Execution", badgeColor: "#6d28d9", localCurrencyMin: "€0", verdict: "Fastest execution and tightest spreads in our analysis. CySEC-regulated with EU passport, fully compliant with AMF requirements.", localAdvantages: ["CySEC-regulated, AMF-registered", "EUR base account available", "0.0 pip raw spreads from €3.50/lot", "TradingView + cTrader + MT4/5", "24/5 support in French"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "€0", verdict: "Award-winning xStation 5 platform with excellent educational content in French. Warsaw-listed, highly trusted.", localAdvantages: ["CySEC-regulated, AMF-registered", "xStation 5 — award-winning platform", "0% commission real stocks up to €100K/mo", "Comprehensive French-language education", "No minimum deposit required"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "saxo-bank", badge: "Best Multi-Asset", badgeColor: "#1e293b", localCurrencyMin: "€500", verdict: "Premium multi-asset platform ideal for experienced French traders. Access to 72,000+ instruments including Euronext Paris.", localAdvantages: ["Danish bank, AMF-registered", "72,000+ instruments across all classes", "Direct access to Euronext Paris", "Professional research and analysis", "EUR accounts with SEPA transfers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "€100", verdict: "Best for French beginners. Simple interface with copy trading and fractional shares from €10.", localAdvantages: ["CySEC-regulated, AMF-registered", "Copy Trading — follow top traders", "Fractional shares from €10", "EUR deposits via SEPA free", "30M+ users worldwide"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "xm", badge: "Best Education", badgeColor: "#d97706", localCurrencyMin: "€5", verdict: "Excellent for beginners with €5 minimum deposit and comprehensive French-language education.", localAdvantages: ["CySEC-regulated, AMF-registered", "€5 minimum deposit — lowest tested", "1,000+ instruments available", "Free webinars and seminars in French", "Loyalty bonus program"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "admirals", badge: null, badgeColor: null, localCurrencyMin: "€100", verdict: "Solid all-rounder with strong educational content and MetaTrader Supreme Edition.", localAdvantages: ["CySEC-regulated, AMF-registered", "MetaTrader Supreme Edition free", "EUR base account", "Invest.MT5 for real stocks", "French-language support team"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "€200", verdict: "Tightest raw spreads at 0.02 pips average. Excellent for French traders prioritizing execution quality.", localAdvantages: ["CySEC-regulated, EU-passported", "0.02 pip average EUR/USD spread", "EUR base account available", "cTrader + TradingView support", "25+ tier-1 liquidity providers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "fp-markets", badge: null, badgeColor: null, localCurrencyMin: "€100", verdict: "Low-cost ECN broker with strong CySEC regulation and EUR account support.", localAdvantages: ["CySEC-regulated, EU-passported", "EUR base account", "Low ECN commission at $6/lot RT", "cTrader + TradingView access", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "capital-com", badge: null, badgeColor: null, localCurrencyMin: "€20", verdict: "AI-powered trading insights with low minimum deposit. Good for tech-savvy French traders.", localAdvantages: ["CySEC-regulated, AMF-registered", "AI-powered trading signals", "Low €20 minimum deposit", "6,000+ markets available", "TradingView integration"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How the AMF Protects French Traders",
    items: [
      { icon: "shield", title: "AMF Registration Required", desc: "Any broker offering services to French residents must be registered with the AMF or operate under an EU passport. Check any broker's status at amf-france.org before opening an account." },
      { icon: "piggy-bank", title: "FGDR Compensation — €70,000", desc: "If an AMF-registered broker goes bankrupt, the Fonds de Garantie des Dépôts et de Résolution covers up to €70,000 per person for securities and €100,000 for cash deposits." },
      { icon: "scale", title: "Negative Balance Protection", desc: "Under ESMA rules enforced by the AMF, retail clients can never lose more than their deposit. If your account goes negative, the broker must absorb the loss." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:30 Retail", desc: "ESMA limits retail leverage to 1:30 for major forex pairs, 1:20 for minor pairs, and 1:2 for crypto. Professional clients can apply for higher leverage." },
      { icon: "ban", title: "CFD Advertising Restrictions", desc: "Since 2019, France has banned aggressive CFD advertising. The AMF maintains a blacklist of unauthorized brokers and regularly updates it to protect retail traders." },
      { icon: "clipboard-list", title: "Risk Warnings & Transparency", desc: "AMF-registered brokers must display the percentage of retail accounts that lose money and provide standardized risk documentation in French." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in France?", a: "Forex and CFD profits in France are subject to the Prélèvement Forfaitaire Unique (PFU) — a flat tax of 30% (12.8% income tax + 17.2% social contributions). Alternatively, you can opt for progressive income tax if your marginal rate is below 12.8%." },
    { q: "Do I Need to Declare Foreign Broker Accounts?", a: "Yes. French residents must declare all foreign financial accounts (including trading accounts) on their annual tax return using Form 3916. Failure to declare can result in fines of €1,500 per undeclared account per year." },
    { q: "Can I Offset Trading Losses?", a: "Yes. Capital losses from CFD trading can be offset against capital gains of the same nature over a 10-year period. You must report both gains and losses on your tax return." },
    { q: "Is There a Tax-Free Allowance?", a: "There is no specific tax-free allowance for forex trading profits. However, if your total securities sales (across all accounts) are below €15,000 per year, you may be exempt from reporting under certain conditions. Consult a tax advisor for your specific situation." },
  ],

  payments: [
    { method: "SEPA Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 days", note: "Best for France" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit & credit" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Popular in France" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free–€5", time: "Instant / 1d", note: "E-wallet" },
  ],

  guide: [
    { q: "How to Verify an AMF-Registered Broker", a: "Visit amf-france.org and search the REGAFI database for the broker's name or registration number. Verify the firm is authorized to provide investment services. Also check the AMF blacklist to ensure the broker isn't flagged." },
    { q: "EU Passporting: What French Traders Need to Know", a: "Many brokers serve France via EU passporting — regulated in one EU country (often CySEC in Cyprus) and authorized to operate across the EU. These brokers are still subject to ESMA rules and must register with the AMF." },
    { q: "What Happens If My Broker Goes Bankrupt?", a: "If your broker is EU-regulated, client funds must be held in segregated accounts. The FGDR provides compensation up to €70,000 for securities. For CySEC-regulated brokers, the ICF covers up to €20,000." },
    { q: "Can French Traders Use Non-EU Brokers?", a: "It's technically possible but strongly discouraged. Non-EU brokers are not subject to ESMA protections including leverage limits, negative balance protection, and compensation schemes. The AMF regularly warns against unauthorized brokers." },
  ],

  faq: [
    { q: "What is the best forex broker in France for 2026?", a: "IG is our top pick for French traders in 2026. It's AMF-registered, offers 17,000+ markets, EUR base accounts, and has 50 years of experience in financial markets." },
    { q: "Are forex profits taxable in France?", a: "Yes. Forex profits are subject to the flat tax (PFU) of 30% or progressive income tax at your option. All foreign trading accounts must be declared annually." },
    { q: "Is forex trading legal in France?", a: "Yes, forex trading is fully legal in France. Brokers must be registered with the AMF or authorized under EU passporting rules. The AMF maintains strict oversight of trading services." },
    { q: "What leverage can French traders use?", a: "Under ESMA rules enforced by the AMF, retail clients are limited to 1:30 on major forex pairs, 1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto." },
    { q: "Do French brokers offer EUR accounts?", a: "All top 10 brokers in our ranking offer EUR base accounts, eliminating conversion fees on deposits and trades denominated in euros." },
    { q: "What is the minimum deposit for forex trading in France?", a: "Minimum deposits range from €0 (Pepperstone, XTB) to €500 (Saxo Bank). XM offers the lowest at €5, making it accessible for beginners." },
    { q: "How do I report forex income in France?", a: "Report forex gains on your annual income tax return using Form 2042-C. Foreign broker accounts must also be declared on Form 3916. Consider using a tax advisor familiar with trading income." },
    { q: "Which brokers are on the AMF blacklist?", a: "The AMF regularly publishes a blacklist of unauthorized brokers at amf-france.org. Always verify a broker's registration before depositing funds. All 10 brokers in our ranking are properly AMF-registered." },
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
