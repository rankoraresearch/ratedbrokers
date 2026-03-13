const data = {
  name: "Czech Republic", slug: "czech-republic", code: "CZ", flag: "🇨🇿",
  regulator: "CNB", regulatorFull: "Česká národní banka (Czech National Bank)",
  regulatorUrl: "https://www.cnb.cz", currency: "CZK",
  leverage: "1:30", leverageNote: "Retail (ESMA rules, 1:500 for Professional)",
  compensation: "Garanční fond — up to €20,000 per investor",
  negativeBalance: "Yes — mandatory under ESMA rules",
  localPayments: ["Bank Transfer (CZK)", "Visa/Mastercard", "Skrill", "Neteller"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 38, localBrokersTotal: 22, hoursResearch: 72,
  author: { name: "Sophia Papadimitriou", role: "European Markets Analyst", exp: "12 years", initials: "SP", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Czech Republic for 2026 — CNB Regulated",
  metaDescription: "We analyzed 22 brokers accepting Czech traders. These 10 offer CNB regulation, ESMA protections, and competitive conditions for Czech forex traders.",
  keyFinding: "The Czech Republic has one of Central Europe's strongest financial regulators in the CNB. Czech traders benefit from ESMA protections while having access to CZK-denominated accounts. XTB and Purple Trading maintain strong local presences in Prague.",

  brokers: [
    { rank: 1, slug: "xtb", badge: "Best Overall Czech", badgeColor: "#059669", localCurrencyMin: "Kč0", verdict: "Best for Czech traders. Strong local presence in Prague, CNB-registered, xStation platform, and Czech-language support.", localAdvantages: ["Registered with CNB", "Prague office — local presence", "xStation 5 platform", "0% commission stocks", "Czech-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "Kč0", verdict: "Tightest raw spreads for Czech traders. CySEC-regulated with EU passporting.", localAdvantages: ["CySEC-regulated (EU passport)", "Raw ECN from 0.0 pips", "EUR base account", "SEPA deposits free", "cTrader + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "ic-markets", badge: "Best Execution", badgeColor: "#6d28d9", localCurrencyMin: "Kč5,000", verdict: "Best execution quality for Czech traders. 0.02 pip average on major pairs.", localAdvantages: ["CySEC-regulated", "0.02 pip average EUR/USD", "EUR base account", "25+ liquidity providers", "cTrader + MetaTrader"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "Kč100", verdict: "Low minimum deposit with educational content for Czech beginners.", localAdvantages: ["Low minimum deposit", "CySEC-regulated", "Micro lot trading", "Free education", "Czech support available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "Kč1,200", verdict: "Best for Czech traders wanting social/copy trading. Simple interface with EU regulation.", localAdvantages: ["Copy Trading feature", "CySEC-regulated", "ICF protection", "Fractional shares", "SEPA deposits"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "saxo-bank", badge: "Best for Professionals", badgeColor: "#1e293b", localCurrencyMin: "Kč5,000", verdict: "Premium broker with 72,000+ instruments. Best for wealthy Czech investors.", localAdvantages: ["72,000+ instruments", "Licensed Danish bank", "DMA stock access", "Premium research", "CZK account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "Kč2,500", verdict: "Lowest ECN commission for Czech traders. Great raw pricing.", localAdvantages: ["ECN commission $6/lot RT", "CySEC-regulated", "cTrader + TradingView", "EUR base account", "4.8 Trustpilot"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "admirals", badge: null, badgeColor: null, localCurrencyMin: "Kč600", verdict: "Strong educational platform with MetaTrader Supreme Edition for Czech traders.", localAdvantages: ["CySEC-regulated", "MetaTrader Supreme Edition", "Educational content", "Low minimum deposit", "Czech support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "plus500", badge: "Most Simple", badgeColor: "#059669", localCurrencyMin: "Kč2,500", verdict: "Simple CFD platform ideal for Czech beginners. EU-regulated.", localAdvantages: ["CySEC-regulated", "Simple interface", "SEPA deposits", "ICF protection", "LSE-listed"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "capital-com", badge: null, badgeColor: null, localCurrencyMin: "Kč500", verdict: "AI-powered trading insights with TradingView integration for Czech traders.", localAdvantages: ["AI-powered insights", "CySEC-regulated", "TradingView integration", "Low minimum deposit", "Educational content"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How CNB & ESMA Protect Czech Traders",
    items: [
      { icon: "shield", title: "CNB Regulation", desc: "The Czech National Bank (ČNB) supervises financial markets including investment firms. CNB is one of Central Europe's most respected regulators, enforcing strict standards for broker conduct." },
      { icon: "piggy-bank", title: "Garanční fond — €20,000", desc: "The Czech Guarantee Fund (Garanční fond obchodníků s cennými papíry) covers up to €20,000 per investor if a licensed investment firm becomes insolvent." },
      { icon: "scale", title: "Negative Balance Protection", desc: "ESMA rules guarantee Czech retail traders cannot lose more than their deposit. All EU-regulated brokers must absorb negative balances." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:30", desc: "ESMA limits retail leverage to 1:30 for major forex (1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto). Professional clients can access higher leverage." },
      { icon: "ban", title: "No Bonuses", desc: "ESMA prohibits trading bonuses and financial incentives for retail clients, protecting Czech traders from aggressive marketing." },
      { icon: "clipboard-list", title: "EU Passporting", desc: "CySEC, BaFin, and other EU-regulated brokers serve Czech clients through MiFID II passporting under CNB oversight, providing comprehensive investor protection." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Czech Republic?", a: "Forex trading profits are taxed as 'Other Income' (Ostatní příjmy) at a flat rate of 15% for income up to CZK 1,935,552 and 23% above that threshold. Profits must be declared in your annual tax return." },
    { q: "Is There a Time-Based Exemption?", a: "Yes, the Czech Republic offers a time-based exemption: securities held for more than 3 years may be exempt from capital gains tax. However, this typically does not apply to short-term forex/CFD trading as positions are usually held for shorter periods." },
    { q: "Do I Need to File a Tax Return?", a: "Yes, Czech residents must declare all investment income, including forex profits, in their annual tax return to the Finanční správa (Financial Administration). The filing deadline is typically April 1 (July 1 if filed by a tax advisor)." },
    { q: "Can I Offset Losses?", a: "Losses from financial instruments can be offset against gains from the same income category within the same tax year. Consult a Czech tax advisor for specific guidance on loss offset rules." },
  ],

  payments: [
    { method: "Bank Transfer (CZK)", deposit: "Free", withdrawal: "Free", time: "1-2 hours", note: "Czech banks" },
    { method: "SEPA Transfer (EUR)", deposit: "Free", withdrawal: "Free", time: "Instant–1d", note: "EUR accounts" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit/credit" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free–€5", time: "Instant / 1d", note: "E-wallets" },
  ],

  guide: [
    { q: "How to Choose a Broker in Czech Republic", a: "Look for CNB-registered or EU-passported brokers. Verify on CNB's register (cnb.cz) or the relevant EU regulator's website. XTB has a Prague office for local support. Consider CZK vs EUR account options." },
    { q: "CZK vs EUR Accounts", a: "While CZK accounts avoid conversion fees for domestic funding, EUR accounts are more practical for forex trading since major pairs are EUR/USD-based. SEPA transfers in EUR are free. Choose based on your primary trading pairs." },
    { q: "Best Trading Hours for Czech Republic", a: "Best times for Czech traders: 9:00 AM – 11:00 AM CET (London session) and 2:30 PM – 5:30 PM CET (London/New York overlap). EUR/USD and EUR/CZK are the most relevant pairs." },
    { q: "Professional Client Status", a: "Czech traders can apply for Professional status for up to 1:500 leverage. Requirements: 10+ large trades per quarter, €500,000+ portfolio, or 1+ year in relevant financial role. You lose ICF protection and NBP guarantee." },
    { q: "How to Open a Forex Account in Czech Republic", a: "Choose a broker, submit your Czech ID (občanský průkaz) or passport, proof of address, and complete the online application. Fund via Czech bank transfer or SEPA. Most accounts approved within 24 hours." },
  ],

  faq: [
    { q: "What is the best forex broker in Czech Republic for 2026?", a: "XTB is our top pick for Czech traders in 2026. CNB-registered with a Prague office, xStation platform, Czech-language support, and zero-commission stocks." },
    { q: "Is forex trading legal in Czech Republic?", a: "Yes, fully legal and well-regulated. CNB oversees investment firms, and EU-passported brokers serve Czech traders under MiFID II with full ESMA protections." },
    { q: "What leverage can Czech traders use?", a: "ESMA limits retail leverage to 1:30 for major pairs. Professional traders can access up to 1:500 but lose guarantee fund protection." },
    { q: "Are forex profits taxed in Czech Republic?", a: "Yes, forex profits are taxed at 15% (23% above CZK 1,935,552). File your annual tax return with Finanční správa." },
    { q: "What is the minimum deposit?", a: "Minimum deposits range from Kč0 (XTB, Pepperstone) to Kč5,000 (IC Markets, Saxo Bank). XM offers a low Kč100 minimum." },
    { q: "Should I use CZK or EUR accounts?", a: "EUR accounts are more practical for forex trading. CZK accounts are convenient for deposits but require conversion for most trading pairs." },
    { q: "What is the Czech Guarantee Fund?", a: "The Garanční fond covers up to €20,000 per investor if a licensed investment firm becomes insolvent. Similar to ICF in Cyprus." },
    { q: "Can I use Czech bank transfers?", a: "Yes, most brokers accept CZK bank transfers from Czech banks. SEPA transfers in EUR are also free and fast." },
  ],

  related: [
    { name: "Brokers in Germany", icon: "🇩🇪", count: 10, url: "/best-forex-brokers-germany" },
    { name: "Brokers in Romania", icon: "🇷🇴", count: 10, url: "/best-forex-brokers-romania" },
    { name: "Brokers in Greece", icon: "🇬🇷", count: 10, url: "/best-forex-brokers-greece" },
    { name: "Brokers in Ukraine", icon: "🇺🇦", count: 8, url: "/best-forex-brokers-ukraine" },
    { name: "Best CySEC Brokers", icon: "🇨🇾", count: 14, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
  ],
};

export default data;
