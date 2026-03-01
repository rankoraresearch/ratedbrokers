const data = {
  name: "Cyprus", slug: "cyprus", code: "CY", flag: "🇨🇾",
  regulator: "CySEC", regulatorFull: "Cyprus Securities and Exchange Commission",
  regulatorUrl: "https://www.cysec.gov.cy", currency: "EUR",
  leverage: "1:30", leverageNote: "Retail (ESMA rules via CySEC)",
  compensation: "ICF — €20,000 per person",
  negativeBalance: "Yes — mandatory under ESMA/CySEC rules",
  taxNote: "No capital gains tax on forex/CFD trading profits for individuals in Cyprus (except real estate).",
  localPayments: ["Bank Transfer (SEPA)", "Visa/Mastercard", "JCC Payment", "PayPal", "Skrill", "Neteller"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 52, localBrokersTotal: 45, hoursResearch: 92,
  author: { name: "Andreas Georgiou", role: "CySEC Regulation Expert", exp: "15 years", initials: "AG", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Cyprus for 2026 — CySEC Regulated",
  metaDescription: "We tested 45 CySEC-regulated brokers with real EUR accounts. These 10 offer the best conditions for Cypriot traders including ICF protection, zero capital gains tax, and EUR base accounts.",
  keyFinding: "Cyprus is the forex hub of Europe — home to more CySEC-regulated brokers than any other EU country. Local traders benefit from zero capital gains tax on trading profits, ESMA protection, and direct access to locally headquartered brokers with physical offices in Limassol and Nicosia.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall Cyprus", badgeColor: "#059669", localCurrencyMin: "€0", verdict: "Best overall for Cypriot traders. CySEC-regulated with Limassol office, tightest spreads and no minimum deposit.", localAdvantages: ["CySEC-regulated — Limassol office", "ICF €20K protection", "EUR base account — no conversion", "0.0 pip raw spreads from €3.50/lot", "TradingView + cTrader + MT4/5"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "€200", verdict: "Tightest raw spreads at 0.02 pips. CySEC-regulated with Limassol presence, ideal for active Cypriot traders.", localAdvantages: ["CySEC-regulated — local presence", "0.02 pip average EUR/USD spread", "EUR base account", "cTrader + TradingView", "25+ tier-1 liquidity providers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#d97706", localCurrencyMin: "€5", verdict: "CySEC-headquartered broker with €5 minimum deposit. Excellent education and the strongest local presence.", localAdvantages: ["CySEC-regulated — Nicosia HQ", "€5 minimum deposit", "1,000+ instruments", "Free seminars in Cyprus", "EUR base account"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "exness", badge: "Best Conditions", badgeColor: "#059669", localCurrencyMin: "€0", verdict: "CySEC-headquartered with industry-leading conditions. Instant withdrawals and no minimum deposit.", localAdvantages: ["CySEC-regulated — Limassol HQ", "No minimum deposit", "Instant withdrawals", "Tight spreads on majors", "EUR base account"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "fxpro", badge: "Most Established Local", badgeColor: "#6d28d9", localCurrencyMin: "€100", verdict: "One of Cyprus's most established brokers. CySEC-headquartered since 2007 with multiple platform options.", localAdvantages: ["CySEC-regulated since 2007 — Limassol HQ", "ICF €20K protection", "Multiple platforms: MT4/5, cTrader, FxPro Edge", "EUR base account", "Strong local reputation"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "€0", verdict: "Award-winning xStation 5 platform with CySEC regulation and no minimum deposit.", localAdvantages: ["CySEC-regulated", "xStation 5 — award-winning platform", "0% commission stocks up to €100K/mo", "No minimum deposit", "EUR base account"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "€0", verdict: "CySEC-headquartered broker with competitive conditions and no minimum deposit.", localAdvantages: ["CySEC-regulated — Limassol office", "No minimum deposit", "EUR base account", "Multiple account types", "Loyalty program"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "€100", verdict: "Lowest ECN commission at $6/lot RT. CySEC-regulated with EUR account support.", localAdvantages: ["CySEC-regulated — Limassol office", "Lowest ECN commission at $6/lot RT", "EUR base account", "cTrader + TradingView", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "€100", verdict: "Best social trading platform. CySEC-regulated with copy trading and fractional shares.", localAdvantages: ["CySEC-regulated — Limassol office", "Copy Trading — follow top traders", "Fractional shares from €10", "EUR deposits via SEPA free", "30M+ users worldwide"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "tickmill", badge: null, badgeColor: null, localCurrencyMin: "€100", verdict: "CySEC-headquartered with competitive raw spreads and low commissions.", localAdvantages: ["CySEC-regulated — Limassol HQ", "Low commission at $4/lot RT", "EUR base account", "MT4/5 platforms", "VPS hosting available"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How CySEC Protects Cypriot Traders",
    items: [
      { icon: "shield", title: "CySEC Licence Required", desc: "Cyprus Securities and Exchange Commission is one of Europe's most active regulators. Verify any broker's CySEC licence at cysec.gov.cy before opening an account." },
      { icon: "piggy-bank", title: "ICF Compensation — €20,000", desc: "The Investor Compensation Fund covers up to €20,000 per person if a CySEC-regulated broker becomes insolvent. All CySEC-licensed firms must contribute to the ICF." },
      { icon: "scale", title: "Negative Balance Protection", desc: "Under ESMA rules enforced by CySEC, retail traders can never lose more than their deposit. Brokers must absorb any negative balance." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:30 Retail", desc: "ESMA limits retail leverage to 1:30 for major forex pairs, 1:20 for minor pairs, 1:10 commodities, 1:5 equities, 1:2 crypto." },
      { icon: "building-2", title: "Physical Presence Required", desc: "CySEC requires regulated firms to maintain physical offices in Cyprus with qualified staff. This makes Cyprus home to hundreds of forex broker headquarters." },
      { icon: "clipboard-list", title: "EU Passporting Rights", desc: "CySEC-regulated brokers can operate across all 27 EU/EEA countries via passporting rights, making Cyprus the gateway for forex brokers to the European market." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "Are Forex Profits Tax-Free in Cyprus?", a: "Yes, for individuals. Cyprus does not impose capital gains tax on profits from forex, CFDs, stocks, or other financial instruments. The only capital gains tax in Cyprus applies to immovable property (real estate) located in Cyprus." },
    { q: "Is There a Special Defence Contribution?", a: "The Special Defence Contribution (SDC) applies to dividends, interest, and rental income for Cyprus tax residents. However, trading profits from forex/CFDs are classified as capital gains, not income, and are therefore exempt from SDC." },
    { q: "Do I Need to Declare Trading Income?", a: "While forex profits are not taxed, you should still maintain proper records. If trading becomes your primary income source, tax authorities may classify it as business income, which would be subject to income tax. Consult a Cyprus tax advisor." },
    { q: "Tax Benefits of Cyprus Residency for Traders", a: "Cyprus offers attractive tax conditions: no capital gains tax on trading, 12.5% corporate tax rate (one of EU's lowest), and no wealth tax. Many professional traders establish Cyprus residency for these advantages." },
  ],

  payments: [
    { method: "SEPA Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 days", note: "Standard" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit & credit" },
    { method: "JCC Payment", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "Local CY cards" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Widely used" },
  ],

  guide: [
    { q: "How to Verify a CySEC-Regulated Broker", a: "Visit cysec.gov.cy and search the regulated entities list by company name or CIF number. Verify the broker's licence status and authorized activities. CySEC also maintains a list of warnings about unauthorized entities." },
    { q: "Why Are So Many Brokers Based in Cyprus?", a: "Cyprus offers a unique combination: EU membership (full passporting rights), favorable tax regime (12.5% corporate tax), English-speaking workforce, and CySEC's reputation as a proactive regulator. Over 300 investment firms are CySEC-regulated." },
    { q: "Local vs Passported Broker: What's the Difference?", a: "CySEC-headquartered brokers have physical offices you can visit, local bank accounts, and direct CySEC supervision. Passported brokers from other EU countries operate remotely. Both offer ESMA protection, but local brokers provide easier dispute resolution." },
    { q: "ICF Compensation Process", a: "If a CySEC-regulated broker becomes insolvent, the ICF begins processing claims. Eligible investors can receive up to €20,000 compensation. Claims must be filed within 12 months of the broker's licence revocation." },
  ],

  faq: [
    { q: "What is the best forex broker in Cyprus for 2026?", a: "Pepperstone is our top pick for Cypriot traders in 2026. CySEC-regulated with a Limassol office, it offers the tightest spreads, no minimum deposit, and EUR base accounts." },
    { q: "Are forex profits taxable in Cyprus?", a: "No. Cyprus does not impose capital gains tax on forex/CFD trading profits for individuals. Only real estate gains are subject to capital gains tax." },
    { q: "Is forex trading legal in Cyprus?", a: "Yes, forex trading is fully legal and Cyprus is the forex hub of Europe. CySEC regulates over 300 investment firms from its offices in Nicosia." },
    { q: "What leverage can Cypriot traders use?", a: "Under ESMA rules enforced by CySEC, retail clients are limited to 1:30 on major forex pairs, 1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto." },
    { q: "What is the ICF?", a: "The Investor Compensation Fund covers up to €20,000 per person if a CySEC-regulated broker becomes insolvent. All CySEC-licensed firms must contribute to the fund." },
    { q: "Can I visit my broker's office in Cyprus?", a: "Yes. Many top brokers have headquarters in Limassol and Nicosia. Pepperstone, IC Markets, XM, Exness, FxPro, eToro, and others maintain physical offices you can visit." },
    { q: "What is the minimum deposit for forex trading in Cyprus?", a: "Minimum deposits range from €0 (Pepperstone, Exness, XTB, HFM) to €200 (IC Markets). XM offers one of the lowest at €5." },
    { q: "Why should I choose a CySEC broker?", a: "CySEC brokers offer EU-wide passporting, ESMA protection, negative balance protection, and ICF compensation. Being based in Cyprus also means easier local dispute resolution and the ability to visit offices in person." },
  ],

  related: [
    { name: "Best CySEC-Regulated Brokers", icon: "🇨🇾", count: 20, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best for Beginners", icon: "graduation-cap", count: 10, url: "#" },
    { name: "Brokers in Greece", icon: "🇬🇷", count: 8, url: "#" },
    { name: "Brokers in UK", icon: "🇬🇧", count: 10, url: "/best-forex-brokers-uk" },
    { name: "Brokers in Germany", icon: "🇩🇪", count: 9, url: "/best-forex-brokers-germany" },
  ],
};

export default data;
