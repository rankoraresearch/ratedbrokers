const data = {
  name: "Netherlands", slug: "netherlands", code: "NL", flag: "🇳🇱",
  regulator: "AFM", regulatorFull: "Autoriteit Financiële Markten",
  regulatorUrl: "https://www.afm.nl", currency: "EUR",
  leverage: "1:30", leverageNote: "Retail (ESMA rules via AFM)",
  compensation: "DGS — €100,000 per person (cash); ICF €20,000 (securities)",
  negativeBalance: "Yes — mandatory under ESMA/AFM rules",
  taxNote: "Netherlands uses Box 3 taxation — wealth tax on assets, not capital gains.",
  localPayments: ["iDEAL", "Bank Transfer (SEPA)", "Visa/Mastercard", "PayPal", "Skrill"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 42, localBrokersTotal: 28, hoursResearch: 82,
  author: { name: "Lars van Dijk", role: "European Markets Analyst", exp: "12 years", initials: "LV", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "8 Best Forex Brokers in Netherlands for 2026 — AFM Regulated",
  metaDescription: "We analyzed 28 AFM-registered brokers for Dutch traders. These 8 offer the best trading conditions including iDEAL deposits, EUR accounts, and ESMA-compliant leverage.",
  keyFinding: "AFM-registered brokers in the Netherlands provide strong retail protection under ESMA rules. iDEAL support for instant EUR deposits is a key differentiator — 7 of our top 8 brokers accept iDEAL, making funding seamless for Dutch traders.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall NL", badgeColor: "#059669", localCurrencyMin: "€0", verdict: "Best overall for Dutch traders. CySEC-regulated with AFM registration, tightest spreads, and EUR account support with iDEAL.", localAdvantages: ["CySEC-regulated, AFM-registered", "EUR base account — no conversion fees", "0.0 pip raw spreads available", "iDEAL deposits supported", "TradingView + cTrader + MT4/5"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "ig", badge: "Most Trusted", badgeColor: "#6d28d9", localCurrencyMin: "€300", verdict: "Most trusted broker available in the Netherlands. 50 years of operation with 17,000+ markets.", localAdvantages: ["FCA & BaFin regulated, AFM-registered", "50+ years of operation", "17,000+ markets available", "EUR base account", "Dutch-language platform support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "saxo-bank", badge: "Best Multi-Asset", badgeColor: "#1e293b", localCurrencyMin: "€500", verdict: "Premium multi-asset platform with access to 72,000+ instruments including Euronext Amsterdam.", localAdvantages: ["Danish bank, AFM-registered", "Direct access to Euronext Amsterdam", "72,000+ instruments", "Professional-grade SaxoTraderPRO", "EUR accounts with SEPA transfers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "€0", verdict: "Award-winning xStation 5 platform with no minimum deposit. Excellent for Dutch beginners and intermediates.", localAdvantages: ["CySEC-regulated, AFM-registered", "xStation 5 — award-winning platform", "0% commission real stocks up to €100K/mo", "No minimum deposit required", "iDEAL deposits available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "€100", verdict: "Best for Dutch beginners interested in copy trading. Simple interface with fractional shares.", localAdvantages: ["CySEC-regulated, AFM-registered", "Copy Trading — follow top traders", "Fractional shares from €10", "iDEAL deposits supported", "30M+ users worldwide"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "€200", verdict: "Tightest raw spreads in our analysis. Ideal for Dutch traders who prioritize execution quality.", localAdvantages: ["CySEC-regulated, EU-passported", "0.02 pip average EUR/USD spread", "EUR base account available", "cTrader + TradingView", "25+ tier-1 liquidity providers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "xm", badge: "Best Education", badgeColor: "#d97706", localCurrencyMin: "€5", verdict: "Lowest minimum deposit and excellent educational resources. Great starting point for new Dutch traders.", localAdvantages: ["CySEC-regulated, AFM-registered", "€5 minimum deposit", "1,000+ instruments", "Free educational webinars", "EUR base account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "admirals", badge: null, badgeColor: null, localCurrencyMin: "€100", verdict: "Solid all-rounder with MetaTrader Supreme Edition and real stock investing via Invest.MT5.", localAdvantages: ["CySEC-regulated, EU-passported", "MetaTrader Supreme Edition free", "EUR base account", "Invest.MT5 for real stocks", "iDEAL deposits available"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How the AFM Protects Dutch Traders",
    items: [
      { icon: "shield", title: "AFM Registration Required", desc: "Any broker offering services to Dutch residents must be registered with the AFM or operate under an EU passport. Verify any broker at afm.nl before opening an account." },
      { icon: "piggy-bank", title: "Deposit Guarantee — €100,000", desc: "The Dutch Deposit Guarantee Scheme (DGS) covers cash deposits up to €100,000 per person per bank. For securities, the Investor Compensation Fund covers up to €20,000." },
      { icon: "scale", title: "Negative Balance Protection", desc: "Under ESMA rules enforced by the AFM, retail traders can never lose more than their deposit. Brokers must absorb any negative balance." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:30 Retail", desc: "ESMA limits retail leverage to 1:30 for major forex pairs. The AFM has been among the strictest EU regulators, previously implementing even tighter restrictions." },
      { icon: "ban", title: "Binary Options Banned", desc: "The AFM enforces ESMA's permanent ban on binary options for retail traders. CFDs remain available with leverage restrictions and mandatory risk warnings." },
      { icon: "clipboard-list", title: "Risk Warnings Required", desc: "All AFM-registered brokers must display standardized risk warnings including the percentage of retail accounts that lose money when trading CFDs." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Trading Accounts Taxed in the Netherlands?", a: "The Netherlands uses a unique Box 3 wealth tax system. Rather than taxing capital gains, you pay tax on the assumed return of your assets. As of 2026, the tax is calculated on the actual composition of your assets (savings vs investments) at a deemed return rate, taxed at 36%." },
    { q: "Do I Pay Capital Gains Tax on Forex Profits?", a: "No, the Netherlands does not have a traditional capital gains tax for individuals. Instead, your trading account balance is included in your Box 3 assets, and you pay wealth tax on the deemed return. This can be advantageous for profitable traders." },
    { q: "How Do I Report My Trading Account?", a: "Report the value of all trading accounts (domestic and foreign) in your Box 3 declaration on your annual tax return. The reference date is January 1st of the tax year. Foreign accounts must also be reported separately." },
  ],

  payments: [
    { method: "iDEAL", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "Best for NL" },
    { method: "SEPA Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 days", note: "Standard" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit & credit" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Widely used" },
  ],

  guide: [
    { q: "How to Verify an AFM-Registered Broker", a: "Visit afm.nl and use the register to search for the broker by name. Verify the firm is authorized to provide investment services in the Netherlands. Also check the AFM warning list for unauthorized firms." },
    { q: "iDEAL: The Best Way to Fund Your Account", a: "iDEAL is the most popular payment method in the Netherlands with instant processing and no fees. Most top brokers accept iDEAL for deposits. Withdrawals are typically processed via SEPA bank transfer." },
    { q: "Understanding Box 3 Tax for Traders", a: "Unlike most countries, the Netherlands taxes wealth rather than capital gains. Your trading account balance on January 1st is included in Box 3 assets. The deemed return rate varies by asset type, taxed at 36%. This system can benefit active traders with high returns." },
    { q: "EU Passporting for Dutch Traders", a: "Many brokers serve the Netherlands via EU passporting — regulated in one EU country (often Cyprus) and authorized across the EU. These brokers must comply with ESMA rules and register with the AFM." },
    { q: "Can Dutch Traders Use Non-EU Brokers?", a: "We strongly advise against it. Non-EU brokers lack ESMA protections including leverage limits, negative balance protection, and compensation schemes. The AFM actively warns against unauthorized brokers." },
  ],

  faq: [
    { q: "What is the best forex broker in the Netherlands for 2026?", a: "Pepperstone is our top pick for Dutch traders in 2026. It's CySEC-regulated with AFM registration, offers EUR base accounts, iDEAL deposits, and the tightest spreads in our analysis." },
    { q: "Do I pay capital gains tax on forex in the Netherlands?", a: "No. The Netherlands uses a Box 3 wealth tax system. You pay tax on the deemed return of your total assets, not on individual capital gains." },
    { q: "Is forex trading legal in the Netherlands?", a: "Yes, forex trading is fully legal. Brokers must be registered with the AFM or authorized under EU passporting. The AFM actively supervises trading services." },
    { q: "What leverage can Dutch traders use?", a: "Under ESMA rules enforced by the AFM, retail clients are limited to 1:30 on major forex pairs, 1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto." },
    { q: "Which brokers accept iDEAL?", a: "Most of our top-ranked brokers accept iDEAL for instant EUR deposits: Pepperstone, XTB, eToro, XM, and Admirals all support iDEAL payments." },
    { q: "What is the minimum deposit for forex trading in the Netherlands?", a: "Minimum deposits range from €0 (Pepperstone, XTB) to €500 (Saxo Bank). XM offers the lowest at €5." },
  ],

  related: [
    { name: "Best EU-Regulated Brokers", icon: "🇪🇺", count: 15, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best for Beginners", icon: "graduation-cap", count: 10, url: "#" },
    { name: "Brokers in Germany", icon: "🇩🇪", count: 9, url: "/best-forex-brokers-germany" },
    { name: "Brokers in France", icon: "🇫🇷", count: 10, url: "/best-forex-brokers-france" },
    { name: "Brokers in UK", icon: "🇬🇧", count: 10, url: "/best-forex-brokers-uk" },
  ],
};

export default data;
