const data = {
  name: "Greece", slug: "greece", code: "GR", flag: "🇬🇷",
  regulator: "HCMC", regulatorFull: "Hellenic Capital Market Commission",
  regulatorUrl: "https://www.hcmc.gr", currency: "EUR",
  leverage: "1:30", leverageNote: "Retail (ESMA rules, 1:500 for Professional)",
  compensation: "ICF — up to €30,000 per investor",
  negativeBalance: "Yes — mandatory under ESMA rules",
  localPayments: ["Bank Transfer (SEPA)", "Visa/Mastercard", "Skrill", "Neteller"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 40, localBrokersTotal: 24, hoursResearch: 76,
  author: { name: "Sophia Papadimitriou", role: "European Markets Analyst", exp: "12 years", initials: "SP", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Greece for 2026 — HCMC & CySEC Regulated",
  metaDescription: "We analyzed 24 brokers accepting Greek traders. These 10 offer ESMA-compliant trading with ICF protection, SEPA deposits, and competitive spreads for Greek forex traders.",
  keyFinding: "Greek traders benefit from EU-wide ESMA protections including 1:30 leverage cap, negative balance protection, and ICF compensation up to €30,000. Cyprus (CySEC) is the EU's forex hub, and most CySEC-regulated brokers passporting into Greece offer strong conditions for Greek traders.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall Greece", badgeColor: "#059669", localCurrencyMin: "€0", verdict: "Best overall for Greek traders. CySEC-regulated with ESMA protections, raw spreads, and EUR accounts.", localAdvantages: ["CySEC-regulated (EU passport)", "ICF €30,000 protection", "SEPA instant deposits", "EUR base account — no conversion", "cTrader + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "€200", verdict: "Tightest raw spreads for Greek traders. 0.02 pip average on EUR/USD.", localAdvantages: ["CySEC-regulated", "0.02 pip average EUR/USD", "EUR base account", "25+ liquidity providers", "cTrader + MetaTrader"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "€5", verdict: "Ultra-low €5 minimum and Greek-language support. Cyprus-headquartered with strong local presence.", localAdvantages: ["€5 minimum deposit", "Greek-language support", "CySEC-regulated (Cyprus HQ)", "Micro lot trading", "Free education in Greek"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "€50", verdict: "Best for Greek traders wanting social/copy trading. Simple interface with EU regulation.", localAdvantages: ["Copy Trading feature", "CySEC-regulated", "ICF protection", "Fractional shares from €10", "SEPA deposits — instant & free"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "€0", verdict: "Award-winning xStation platform with zero-commission stocks and EU regulation.", localAdvantages: ["xStation 5 platform", "CySEC + FCA regulated", "0% commission stocks up to €100K/mo", "No minimum deposit", "Greek-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "€100", verdict: "Lowest ECN commission with competitive raw pricing for Greek traders.", localAdvantages: ["ECN commission $6/lot RT", "CySEC-regulated", "cTrader + TradingView", "EUR base account", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "saxo-bank", badge: "Best for Professionals", badgeColor: "#1e293b", localCurrencyMin: "€200", verdict: "Premium multi-asset broker with 72,000+ instruments. Best for wealthy Greek investors.", localAdvantages: ["72,000+ instruments", "Licensed Danish bank", "DMA stock access", "Premium research", "Professional accounts available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "plus500", badge: "Most Simple", badgeColor: "#059669", localCurrencyMin: "€100", verdict: "Simple CFD platform ideal for Greek beginners. CySEC-regulated with SEPA deposits.", localAdvantages: ["CySEC-regulated", "Very simple interface", "SEPA deposits", "ICF protection", "LSE-listed company"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "admirals", badge: null, badgeColor: null, localCurrencyMin: "€25", verdict: "Strong educational content and MetaTrader Supreme Edition for Greek traders.", localAdvantages: ["CySEC-regulated", "MetaTrader Supreme Edition", "Educational content", "EUR base account", "Low minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "capital-com", badge: null, badgeColor: null, localCurrencyMin: "€20", verdict: "AI-powered insights with TradingView integration for Greek traders.", localAdvantages: ["AI-powered insights", "CySEC-regulated", "TradingView integration", "Low minimum deposit", "Educational content"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How HCMC & ESMA Protect Greek Traders",
    items: [
      { icon: "shield", title: "HCMC & CySEC Regulation", desc: "Greek traders are protected by HCMC (local regulator) and benefit from CySEC-regulated brokers passporting into Greece under EU MiFID II. Both enforce ESMA's strict investor protection rules." },
      { icon: "piggy-bank", title: "ICF Compensation — €30,000", desc: "The Investor Compensation Fund (ICF) covers up to €30,000 per investor if a CySEC-regulated broker becomes insolvent. This applies to all EU-passported brokers serving Greek clients." },
      { icon: "scale", title: "Negative Balance Protection", desc: "ESMA rules guarantee Greek retail traders cannot lose more than their deposit. If your account goes negative, the broker must absorb the loss." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:30", desc: "ESMA limits retail leverage to 1:30 for major forex pairs (1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto). Professional traders can apply for up to 1:500." },
      { icon: "ban", title: "No Bonuses or Incentives", desc: "ESMA prohibits brokers from offering trading bonuses, contests, or financial incentives to retail clients in the EU, including Greece." },
      { icon: "clipboard-list", title: "Risk Warnings Required", desc: "All EU-regulated brokers must display prominent risk warnings showing the percentage of retail accounts that lose money. This is updated regularly." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Greece?", a: "Forex trading profits are subject to capital gains tax in Greece. For individuals, capital gains from financial instruments are taxed at 15%. This applies to CFD profits, forex gains, and other derivative income." },
    { q: "Do I Need to File a Tax Return?", a: "Yes, Greek residents must declare all investment income, including forex profits, in their annual income tax return (E1 form) to AADE (Independent Authority for Public Revenue). Broker statements serve as documentation." },
    { q: "Is There a Solidarity Surcharge?", a: "Greece previously imposed a solidarity surcharge on income. Check current AADE guidelines for the latest rates and applicability to investment income, as these have changed in recent years." },
    { q: "Can I Offset Trading Losses?", a: "Capital losses from financial instruments can be offset against capital gains from the same category within the same tax year. Unused losses can be carried forward for up to 5 years." },
  ],

  payments: [
    { method: "SEPA Transfer", deposit: "Free", withdrawal: "Free", time: "Instant–1d", note: "Best for Greece" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit/credit" },
    { method: "Skrill", deposit: "Free", withdrawal: "Free–€5", time: "Instant / 1d", note: "E-wallet" },
    { method: "Neteller", deposit: "Free", withdrawal: "Free–€5", time: "Instant / 1d", note: "E-wallet" },
  ],

  guide: [
    { q: "How to Choose a Broker in Greece", a: "Look for CySEC or HCMC-regulated brokers with EU MiFID II passporting. Verify the broker on the CySEC register (cysec.gov.cy) or HCMC register (hcmc.gr). Ensure they offer EUR accounts and SEPA deposits." },
    { q: "ESMA Protections for Greek Traders", a: "As an EU member, Greece benefits from ESMA rules: 1:30 leverage cap, negative balance protection, ICF compensation (€30,000), no bonuses, and mandatory risk warnings. These apply to all EU-regulated brokers." },
    { q: "Best Trading Hours for Greece", a: "Best times for Greek traders: 10:00 AM – 12:00 PM EET (London session) and 3:30 PM – 6:30 PM EET (London/New York overlap). EUR/USD is the most relevant pair for Greek traders." },
    { q: "Professional vs Retail Status", a: "Greek traders can apply for Professional Client status for leverage up to 1:500. Requirements: 10+ large trades per quarter, €500,000+ portfolio, or 1+ year in relevant financial role. Downsides: lose ICF protection and NBP guarantee." },
    { q: "Why Are So Many Brokers in Cyprus?", a: "Cyprus is the EU's forex broker hub due to its CySEC regulation, lower corporate tax (12.5%), EU passporting rights, and proximity to Greece. CySEC-regulated brokers can serve all EU countries including Greece under MiFID II." },
  ],

  faq: [
    { q: "What is the best forex broker in Greece for 2026?", a: "Pepperstone is our top pick for Greek traders in 2026. CySEC-regulated with ICF protection, raw ECN spreads, EUR accounts, and SEPA deposits with no minimum deposit." },
    { q: "Is forex trading legal in Greece?", a: "Yes, forex trading is fully legal and regulated. HCMC is the local regulator, and most brokers serve Greece through CySEC EU passporting under MiFID II." },
    { q: "What leverage can Greek traders use?", a: "ESMA limits retail leverage to 1:30 for major pairs. Professional traders can access up to 1:500 but lose ICF protection and negative balance guarantee." },
    { q: "Are forex profits taxed in Greece?", a: "Yes, capital gains from forex trading are taxed at 15%. Declare all investment income to AADE in your annual tax return." },
    { q: "What is the minimum deposit?", a: "Minimum deposits range from €0 (Pepperstone, XTB) to €200 (IC Markets, Saxo Bank). XM offers an ultra-low €5 minimum." },
    { q: "Do Greek brokers offer EUR accounts?", a: "Yes, all top brokers in our ranking offer EUR base accounts, eliminating currency conversion fees for Greek traders." },
    { q: "What is ICF protection?", a: "The Investor Compensation Fund covers up to €30,000 per investor if a CySEC-regulated broker becomes insolvent. It's the EU equivalent of the UK's FSCS." },
    { q: "Can I trade crypto CFDs in Greece?", a: "Yes, unlike the UK, crypto CFDs are permitted for EU retail traders. However, ESMA limits crypto leverage to 1:2 for retail clients." },
  ],

  related: [
    { name: "Brokers in Turkey", icon: "🇹🇷", count: 10, url: "/best-forex-brokers-turkey" },
    { name: "Brokers in Romania", icon: "🇷🇴", count: 8, url: "/best-forex-brokers-romania" },
    { name: "Brokers in Czech Republic", icon: "🇨🇿", count: 8, url: "/best-forex-brokers-czech-republic" },
    { name: "Brokers in Germany", icon: "🇩🇪", count: 10, url: "/best-forex-brokers-germany" },
    { name: "Best CySEC Brokers", icon: "🇨🇾", count: 14, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
  ],
};

export default data;
