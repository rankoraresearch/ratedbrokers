const data = {
  name: "Israel", slug: "israel", code: "IL", flag: "🇮🇱",
  regulator: "ISA", regulatorFull: "Israel Securities Authority",
  regulatorUrl: "https://www.isa.gov.il", currency: "ILS",
  leverage: "1:100", leverageNote: "ISA cap for forex (lower for some instruments)",
  compensation: "No formal deposit compensation scheme",
  negativeBalance: "Yes — required by ISA for licensed dealers",
  localPayments: ["Bank Transfer (ILS)", "Visa/Mastercard", "PayPal", "Bit"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 36, localBrokersTotal: 18, hoursResearch: 70,
  author: { name: "Daniel Levi", role: "Middle East Financial Markets Expert", exp: "16 years", initials: "DL", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Israel for 2026 — ISA Regulated",
  metaDescription: "We analyzed 18 brokers accepting Israeli traders. These 10 offer ISA-compliant trading, competitive spreads, and Hebrew-language support for Israeli forex traders.",
  keyFinding: "Israel's ISA imposes strict regulation including 1:100 leverage cap for forex, mandatory risk warnings, and binary options ban. eToro (founded in Tel Aviv) is the most prominent Israeli-origin broker. Our top picks combine ISA compliance with tight spreads and ILS account support.",

  brokers: [
    { rank: 1, slug: "etoro", badge: "Best Overall Israel", badgeColor: "#059669", localCurrencyMin: "₪0", verdict: "Israel's homegrown broker. Founded in Tel Aviv, ISA-regulated, with social trading and Hebrew interface.", localAdvantages: ["ISA-regulated — founded in Israel", "Hebrew-language platform", "Copy Trading feature", "ILS deposits via bank transfer", "30M+ global users"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "₪0", verdict: "Tightest raw spreads for Israeli traders. Strong international regulation.", localAdvantages: ["Raw ECN from 0.0 pips", "ILS deposits accepted", "FCA + ASIC regulated", "cTrader + TradingView", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "ic-markets", badge: "Best Execution", badgeColor: "#6d28d9", localCurrencyMin: "₪750", verdict: "Best execution quality for Israeli traders. Ultra-tight spreads from 25+ LPs.", localAdvantages: ["0.02 pip average EUR/USD", "25+ liquidity providers", "cTrader + MetaTrader", "Fast execution < 40ms", "Islamic account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "₪20", verdict: "Low deposit and comprehensive education. Ideal entry for Israeli beginners.", localAdvantages: ["Low ₪20 minimum deposit", "Educational content", "Micro lot trading", "ILS deposits", "24/5 support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "plus500", badge: "ISA Licensed", badgeColor: "#059669", localCurrencyMin: "₪400", verdict: "ISA-licensed Israeli broker. Listed on LSE. Simple platform for Israeli retail traders.", localAdvantages: ["ISA-licensed in Israel", "Hebrew interface", "Simple trading platform", "ILS base account", "LSE-listed (PLUS.L)"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "exness", badge: "Instant Withdrawals", badgeColor: "#6d28d9", localCurrencyMin: "₪40", verdict: "Fastest withdrawals for Israeli traders with multiple account types.", localAdvantages: ["Instant withdrawals", "ILS deposits accepted", "No minimum on Standard", "Islamic account", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "xtb", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "₪0", verdict: "Award-winning xStation platform with zero-commission stocks.", localAdvantages: ["xStation 5 platform", "FCA + CySEC regulated", "0% commission stocks", "No minimum deposit", "Hebrew support available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "₪400", verdict: "Lowest ECN commission with competitive raw pricing.", localAdvantages: ["ECN commission $6/lot RT", "cTrader + TradingView", "ASIC + CySEC regulated", "ILS deposits", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "saxo-bank", badge: "Best for Professionals", badgeColor: "#1e293b", localCurrencyMin: "₪1,000", verdict: "Premium multi-asset broker with 72,000+ instruments for sophisticated Israeli investors.", localAdvantages: ["72,000+ instruments", "Licensed Danish bank", "DMA stock access", "Premium research", "Professional accounts"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "avatrade", badge: null, badgeColor: null, localCurrencyMin: "₪400", verdict: "Multi-platform broker with AvaProtect risk management for Israeli traders.", localAdvantages: ["AvaProtect risk management", "Multiple platforms", "Hebrew support", "Islamic account", "Multi-regulated"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How ISA Protects Israeli Traders",
    items: [
      { icon: "shield", title: "ISA Licensing", desc: "The Israel Securities Authority (ISA) requires all forex dealers serving Israeli residents to hold a valid ISA licence. ISA conducts regular audits and enforces strict compliance standards." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:100", desc: "ISA limits retail forex leverage to 1:100. For CFDs on equities, the cap is lower. These limits protect retail traders from excessive losses while remaining more generous than ESMA's 1:30." },
      { icon: "ban", title: "Binary Options Banned", desc: "Israel banned binary options in 2017 under the 'Binary Options Law.' This was a landmark decision that other jurisdictions (EU, UK) later followed. Only regulated forex and CFD trading is permitted." },
      { icon: "scale", title: "Mandatory Risk Warnings", desc: "ISA requires brokers to display prominent risk warnings and the percentage of losing retail accounts. Brokers must also conduct suitability assessments for new clients." },
      { icon: "piggy-bank", title: "Client Fund Requirements", desc: "ISA-licensed brokers must maintain minimum capital requirements and hold client funds in segregated accounts at Israeli banks." },
      { icon: "clipboard-list", title: "Advertising Restrictions", desc: "ISA restricts forex advertising in Israel and bans misleading claims about potential profits. All marketing materials must include risk warnings." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Israel?", a: "Forex trading profits in Israel are subject to capital gains tax at 25% for Israeli residents. If the broker is not ISA-licensed, the rate may be higher at 30%. Tax is calculated on net annual profits after offsetting losses." },
    { q: "Is There a Distinction Between Traders and Investors?", a: "Yes, the Israel Tax Authority may classify frequent traders as 'business income' rather than capital gains. Business income is taxed at marginal rates (up to 50%). Factors include trading frequency, volume, and whether it's your primary income." },
    { q: "Do I Need to Report to Mas Hachnasa?", a: "Yes, Israeli residents must declare all investment income, including forex profits, to Mas Hachnasa (Israel Tax Authority) in their annual tax return (Tofes 1301). ISA-licensed brokers may provide annual statements." },
    { q: "Can I Offset Trading Losses?", a: "Yes, capital losses from forex trading can offset capital gains from the same tax year. Excess losses can be carried forward to future years. Consult a licensed Israeli tax advisor (Yoetz Mas) for specific guidance." },
  ],

  payments: [
    { method: "Bank Transfer (ILS)", deposit: "Free", withdrawal: "Free", time: "1-3 hours", note: "Israeli banks" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Israeli cards" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Select brokers" },
    { method: "Bit / Apple Pay", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Select brokers" },
  ],

  guide: [
    { q: "How to Verify an ISA Licence", a: "Visit the ISA website at isa.gov.il and check the licensed entities list (רשימת בעלי רישיון). Verify the broker holds a valid forex dealer licence. ISA also publishes warnings about unlicensed operators." },
    { q: "ISA vs International Regulation", a: "ISA-licensed brokers (eToro, Plus500) offer local regulatory protection and Hebrew support. International brokers (FCA, ASIC) may offer tighter spreads and more platforms. Both are legitimate — choose based on your priorities." },
    { q: "Best Trading Hours for Israel", a: "Best times for Israeli traders: 10:00 AM – 12:00 PM IST (London session) and 4:30 PM – 7:30 PM IST (London/New York overlap). USD/ILS is most active during overlap with US markets." },
    { q: "How to Open a Forex Account in Israel", a: "Choose a broker, submit your Teudat Zehut (Israeli ID) or passport, proof of address (arnona bill), and complete the online application. Fund via Israeli bank transfer for the fastest deposits." },
    { q: "Israel's Role in Forex Industry", a: "Israel is a major hub for fintech and forex. eToro, Plus500, and many technology providers are Israeli companies. The country's strict regulation (including the binary options ban) has helped clean up the industry." },
  ],

  faq: [
    { q: "What is the best forex broker in Israel for 2026?", a: "eToro is our top pick for Israeli traders in 2026. ISA-regulated, founded in Tel Aviv, with Hebrew interface, social trading, ILS accounts, and no minimum deposit." },
    { q: "Is forex trading legal in Israel?", a: "Yes, forex trading is legal and regulated by the Israel Securities Authority (ISA). Binary options are banned. Only ISA-licensed or internationally regulated brokers should be used." },
    { q: "What leverage is available in Israel?", a: "ISA caps retail forex leverage at 1:100, which is more generous than the EU's 1:30 but stricter than many offshore jurisdictions." },
    { q: "Are forex profits taxed in Israel?", a: "Yes, capital gains from forex are taxed at 25% (30% if using a non-ISA broker). Frequent traders may be classified as business income and taxed at marginal rates up to 50%." },
    { q: "What is the minimum deposit?", a: "Minimum deposits range from ₪0 (eToro, Pepperstone, XTB) to ₪1,000 (Saxo Bank). XM offers a low ₪20 minimum." },
    { q: "Can I trade in Hebrew?", a: "Yes, eToro and Plus500 offer full Hebrew-language platforms. Other brokers provide Hebrew customer support and translated materials." },
    { q: "Are binary options legal in Israel?", a: "No, Israel banned binary options in 2017. This was a landmark law that helped clean up the industry. Only regulated forex and CFD trading is permitted." },
    { q: "Which brokers are ISA-licensed?", a: "eToro and Plus500 are the most prominent ISA-licensed brokers. Other international brokers serve Israeli clients through FCA, ASIC, or CySEC regulation." },
  ],

  related: [
    { name: "Brokers in Turkey", icon: "🇹🇷", count: 10, url: "/best-forex-brokers-turkey" },
    { name: "Brokers in UAE", icon: "🇦🇪", count: 10, url: "/best-forex-brokers-uae" },
    { name: "Brokers in Greece", icon: "🇬🇷", count: 10, url: "/best-forex-brokers-greece" },
    { name: "Best Social Trading", icon: "users", count: 10, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best Low Spread Brokers", icon: "trending-down", count: 10, url: "#" },
  ],
};

export default data;
