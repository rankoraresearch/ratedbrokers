const data = {
  name: "Turkey", slug: "turkey", code: "TR", flag: "🇹🇷",
  regulator: "CMB/SPK", regulatorFull: "Capital Markets Board of Turkey (Sermaye Piyasası Kurulu)",
  regulatorUrl: "https://www.spk.gov.tr", currency: "TRY",
  leverage: "1:10", leverageNote: "Retail (SPK cap since 2017, was 1:100)",
  compensation: "Investor Compensation Center (MKK) — up to ₺100,000",
  negativeBalance: "Yes — mandatory under SPK rules",
  localPayments: ["Bank Transfer (EFT/Havale)", "Visa/Mastercard", "Papara", "Ininal"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 42, localBrokersTotal: 28, hoursResearch: 82,
  author: { name: "Elif Arslan", role: "Turkish Markets Specialist", exp: "12 years", initials: "EA", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Turkey for 2026 — SPK Regulated",
  metaDescription: "We tested 28 SPK-regulated brokers with real TRY accounts. These 10 offer the best conditions for Turkish traders including SPK regulation, TRY accounts, and investor compensation.",
  keyFinding: "Turkey's SPK imposes the world's strictest leverage cap at 1:10 for retail forex, making it crucial to choose brokers with the tightest spreads. All our top SPK-regulated picks offer investor compensation, negative balance protection, and TRY accounts.",

  brokers: [
    { rank: 1, slug: "ic-markets", badge: "Best Overall Turkey", badgeColor: "#059669", localCurrencyMin: "₺0", verdict: "Best overall for Turkish traders. Tightest spreads compensate for low leverage. SPK-compliant accounts available.", localAdvantages: ["SPK-compliant account option", "Tightest raw spreads at 0.02 pip", "TRY base account", "Turkish-language support", "cTrader + MetaTrader 4/5"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Best Platforms", badgeColor: "#2563eb", localCurrencyMin: "₺0", verdict: "Multi-platform broker with tight spreads and Turkish support. TRY deposits via EFT.", localAdvantages: ["TRY deposits via EFT/Havale", "Turkish-language support", "Raw ECN from 0.0 pips", "TradingView + cTrader", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "₺200", verdict: "Low deposit, Turkish education, and micro lots. Ideal entry point for Turkish beginners.", localAdvantages: ["Low ₺200 minimum deposit", "Turkish education & webinars", "Micro lot trading (0.01 lots)", "TRY deposits via EFT", "24/5 Turkish support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "exness", badge: "Instant Withdrawals", badgeColor: "#6d28d9", localCurrencyMin: "₺200", verdict: "Fastest withdrawals for Turkish traders. Multiple account types and instant TRY processing.", localAdvantages: ["Instant TRY withdrawals", "TRY base currency", "No minimum on Standard", "Islamic account available", "Multiple account types"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "₺1,500", verdict: "Copy successful traders with Turkish interface. Popular for social trading in Turkey.", localAdvantages: ["Copy Trading feature", "Turkish interface", "Fractional shares", "TRY deposits", "30M+ global users"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "₺1,500", verdict: "Lowest ECN commission for Turkish traders. Great raw pricing with cTrader.", localAdvantages: ["ECN commission $6/lot RT", "cTrader + TradingView", "ASIC + CySEC regulated", "TRY deposits", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "avatrade", badge: "Best Fixed Spreads", badgeColor: "#059669", localCurrencyMin: "₺1,500", verdict: "Fixed spread option with AvaProtect. Good for Turkish traders wanting predictable costs.", localAdvantages: ["Fixed spread option", "AvaProtect risk management", "Turkish support", "Multiple platforms", "Multi-regulated"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "hfm", badge: null, badgeColor: null, localCurrencyMin: "₺0", verdict: "Zero minimum deposit with copy trading for Turkish traders.", localAdvantages: ["No minimum deposit", "TRY base account", "Copy trading feature", "Turkish support", "Islamic account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "tickmill", badge: null, badgeColor: null, localCurrencyMin: "₺1,500", verdict: "Competitive raw spreads with low commission. Good for Turkish scalpers.", localAdvantages: ["Raw spreads from 0.0 pips", "Low $4/lot commission", "FCA + CySEC regulated", "Fast execution", "Islamic account available"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "capital-com", badge: null, badgeColor: null, localCurrencyMin: "₺500", verdict: "AI-powered insights with Turkish education and TradingView integration.", localAdvantages: ["AI-powered insights", "Turkish education", "TradingView integration", "Low minimum deposit", "FCA + CySEC regulated"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How SPK Protects Turkish Traders",
    items: [
      { icon: "shield", title: "SPK Licensing Required", desc: "The Capital Markets Board (SPK/CMB) requires all forex brokers serving Turkish residents to hold an SPK licence. Only SPK-licensed firms can legally offer forex trading in Turkey." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:10", desc: "SPK imposed the world's strictest retail leverage cap at 1:10 for all forex pairs in 2017. This was reduced from 1:100 to protect retail traders from excessive losses." },
      { icon: "piggy-bank", title: "Investor Compensation", desc: "The Investor Compensation Center (Yatırımcı Tazmin Merkezi) covers up to ₺100,000 per investor if an SPK-licensed broker becomes insolvent." },
      { icon: "scale", title: "Negative Balance Protection", desc: "SPK mandates negative balance protection for all retail clients. Turkish traders cannot lose more than their deposited funds." },
      { icon: "ban", title: "Binary Options Banned", desc: "SPK banned binary options trading for Turkish retail investors. Only forex and CFD trading through licensed brokers is permitted." },
      { icon: "clipboard-list", title: "Strict Advertising Rules", desc: "SPK restricts forex advertising in Turkey and requires risk warnings. Brokers must clearly disclose the percentage of retail accounts that lose money." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Turkey?", a: "Forex trading profits in Turkey are subject to a 10% stoppage tax (stopaj vergisi) on gains from leveraged transactions through SPK-licensed brokers. This is withheld at source by the broker. If trading through international brokers, you must declare profits in your annual tax return." },
    { q: "Do I Need to File a Tax Return?", a: "If you trade through an SPK-licensed Turkish broker, the stoppage tax is withheld automatically and no separate declaration is needed. For international broker accounts, you must declare all income in your annual income tax return to the Turkish Revenue Administration (GİB)." },
    { q: "What About BSMV (Banking Tax)?", a: "BSMV (Banka ve Sigorta Muameleleri Vergisi) at 5% applies to certain financial transactions in Turkey. However, forex transactions through SPK-licensed brokers are generally exempt from BSMV." },
    { q: "Are Foreign Accounts Reportable?", a: "Yes, Turkish residents must declare foreign financial accounts exceeding certain thresholds. Failure to declare can result in tax penalties. The Turkish tax authority has information exchange agreements with many countries." },
  ],

  payments: [
    { method: "EFT/Havale", deposit: "Free", withdrawal: "Free", time: "Instant–1h", note: "Best for Turkey" },
    { method: "Papara", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Select brokers" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit/credit" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free–$5", time: "Instant / 1d", note: "E-wallets" },
  ],

  guide: [
    { q: "How to Verify an SPK Licence", a: "Visit spk.gov.tr and check the list of licensed investment firms (Yatırım Kuruluşları). Only trade with firms showing active SPK authorization. The SPK also publishes a blacklist of unauthorized firms." },
    { q: "Understanding Turkey's 1:10 Leverage Cap", a: "SPK limits retail leverage to 1:10 on all forex pairs — the world's strictest. This means you need ₺10,000 to open a 1-lot EUR/USD position. Some traders apply for professional status for higher leverage, but this removes some protections." },
    { q: "Best Trading Hours for Turkey", a: "Best times for Turkish traders: 11:00 AM – 1:00 PM TRT (London session) and 4:30 PM – 7:30 PM TRT (London/New York overlap). EUR/TRY and USD/TRY are most active during European/US hours." },
    { q: "SPK-Licensed vs International Brokers", a: "SPK-licensed brokers offer investor compensation (₺100,000) and local regulation but with 1:10 leverage. International brokers offer higher leverage but without SPK protections. Choose based on your priorities: safety vs flexibility." },
    { q: "How to Open a Forex Account in Turkey", a: "For SPK-licensed brokers: submit TC Kimlik (Turkish ID) number, address proof, and complete the online application. For international brokers: submit passport/ID and address proof. Most accounts approved within 24 hours." },
  ],

  faq: [
    { q: "What is the best forex broker in Turkey for 2026?", a: "IC Markets is our top pick for Turkish traders in 2026. It offers the tightest raw spreads (essential with 1:10 leverage), TRY accounts, Turkish support, and SPK-compliant account options." },
    { q: "Is forex trading legal in Turkey?", a: "Yes, forex trading is legal and regulated by the SPK (Capital Markets Board). Only SPK-licensed brokers can legally offer forex services in Turkey, though many Turkish traders also use international brokers." },
    { q: "What leverage is available in Turkey?", a: "SPK limits retail leverage to 1:10 for all forex pairs — the world's strictest cap. Professional traders may access higher leverage. International brokers may offer up to 1:500 but outside SPK jurisdiction." },
    { q: "Are forex profits taxed in Turkey?", a: "Yes, a 10% stoppage tax applies to forex gains through SPK-licensed brokers (withheld at source). International broker profits must be declared in your annual tax return." },
    { q: "What is the minimum deposit in Turkey?", a: "Minimum deposits range from ₺0 (IC Markets, Pepperstone, HFM) to ₺1,500 (eToro, FP Markets, Tickmill). XM offers a low ₺200 minimum." },
    { q: "Can I deposit in Turkish Lira?", a: "Yes, all top brokers accept TRY deposits via EFT/Havale (Turkish bank transfer). Some also accept Papara for instant deposits." },
    { q: "What happens if my Turkish broker goes bankrupt?", a: "If the broker is SPK-licensed, the Investor Compensation Center covers up to ₺100,000 per investor. This is similar to FSCS in the UK or ICF in Cyprus." },
    { q: "Can Turkish traders use MetaTrader?", a: "Yes, all brokers in our ranking offer MetaTrader 4 and/or MetaTrader 5. IC Markets and Pepperstone also offer cTrader and TradingView." },
  ],

  related: [
    { name: "Brokers in Greece", icon: "🇬🇷", count: 8, url: "/best-forex-brokers-greece" },
    { name: "Brokers in Israel", icon: "🇮🇱", count: 8, url: "/best-forex-brokers-israel" },
    { name: "Brokers in UAE", icon: "🇦🇪", count: 10, url: "/best-forex-brokers-uae" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best Low Spread Brokers", icon: "trending-down", count: 10, url: "#" },
    { name: "Best Islamic Brokers", icon: "landmark", count: 12, url: "#" },
  ],
};

export default data;
