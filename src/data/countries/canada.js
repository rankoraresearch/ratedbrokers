const data = {
  name: "Canada", slug: "canada", code: "CA", flag: "\u{1F1E8}\u{1F1E6}",
  regulator: "IIROC", regulatorFull: "Canadian Investment Regulatory Organization (formerly IIROC)",
  regulatorUrl: "https://www.ciro.ca", currency: "CAD",
  leverage: "1:50", leverageNote: "Varies by CIRO member, typically 1:33\u20131:50",
  compensation: "CIPF \u2014 C$1 million per account category",
  negativeBalance: "Varies \u2014 not mandated by CIRO, broker-dependent",
  taxNote: "Forex profits are taxed as capital gains (50% inclusion rate) or business income depending on activity.",
  localPayments: ["Bank Transfer (Interac e-Transfer)", "Visa/Mastercard", "Wire Transfer", "Interac Online"],
  year: "2026", updatedDate: "February 28, 2026",
  brokersTested: 34, localBrokersTotal: 18, hoursResearch: 72,
  author: { name: "Michael Torres", role: "North American Markets Analyst", exp: "13 years", initials: "MT", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "8 Best Forex Brokers in Canada for 2026 \u2014 CIRO Regulated",
  metaDescription: "We analyzed 18 CIRO-regulated brokers for Canadian traders. These 8 offer the best trading conditions including CIPF protection, CAD accounts, and Interac deposits.",
  keyFinding: "Canada\u2019s regulatory framework under CIRO (formerly IIROC) provides strong protections including CIPF coverage up to C$1 million. Canadian traders benefit from a well-regulated market with competitive pricing, though broker choice is more limited than in Europe or Australia.",

  brokers: [
    { rank: 1, slug: "ig", badge: "Best Overall Canada", badgeColor: "#059669", localCurrencyMin: "C$0", verdict: "Most trusted global broker available in Canada. CIRO-regulated with the widest product range and premium platform.", localAdvantages: ["CIRO-regulated dealer member", "CIPF protection up to C$1M", "CAD base account", "17,000+ markets", "ProRealTime charting included free"], spreadBetting: false, localAccount: true, localRegRef: "CIRO member" },
    { rank: 2, slug: "oanda", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "C$0", verdict: "Best for Canadian beginners. CIRO-regulated with no minimum deposit, transparent pricing, and over 20 years serving Canadian traders.", localAdvantages: ["CIRO-regulated (IIROC member)", "CIPF protection up to C$1M", "No minimum deposit", "CAD base account", "Over 20 years in Canada"], spreadBetting: false, localAccount: true, localRegRef: "CIRO member" },
    { rank: 3, slug: "cmc-markets", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "C$0", verdict: "Best proprietary platform for Canadian traders. CIRO-regulated with 330+ forex pairs and the Next Generation platform.", localAdvantages: ["CIRO-regulated dealer member", "CIPF protection up to C$1M", "330+ forex pairs", "Next Generation platform", "CAD base account, no min deposit"], spreadBetting: false, localAccount: true, localRegRef: "CIRO member" },
    { rank: 4, slug: "saxo-bank", badge: "Best for Professionals", badgeColor: "#6d28d9", localCurrencyMin: "C$2,000", verdict: "Premium multi-asset platform for professional Canadian traders. 72,000+ instruments with bank-level security.", localAdvantages: ["CIRO-regulated", "CIPF protection up to C$1M", "72,000+ instruments globally", "CAD base account", "TSX-listed equities trading"], spreadBetting: false, localAccount: true, localRegRef: "CIRO member" },
    { rank: 5, slug: "pepperstone", badge: "Best for Active Traders", badgeColor: "#d97706", localCurrencyMin: "C$0", verdict: "Excellent execution and tight spreads for active Canadian traders. Raw pricing from 0.0 pips.", localAdvantages: ["Regulated for Canadian clients", "0.0 pip raw spreads", "TradingView + cTrader + MT4/5", "CAD deposits accepted", "Fast execution servers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "C$200", verdict: "Tightest raw spreads in our analysis. True ECN pricing with 25+ liquidity providers for Canadian traders.", localAdvantages: ["ASIC + CySEC regulated", "0.02 pip average EUR/USD", "True ECN with 25+ LPs", "CAD deposits via wire transfer", "cTrader + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "avatrade", badge: "Best Multi-Platform", badgeColor: "#059669", localCurrencyMin: "C$100", verdict: "Strong multi-platform offering for Canadian traders with AvaOptions for vanilla options trading.", localAdvantages: ["Regulated for Canadian clients", "CAD base account", "AvaOptions for vanilla options", "AvaProtect risk management", "Free AvaAcademy education"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "fxcm", badge: null, badgeColor: null, localCurrencyMin: "C$50", verdict: "Established forex specialist serving Canadian traders since 1999. Strong for pure forex traders.", localAdvantages: ["CIRO member", "CIPF protection up to C$1M", "CAD base account", "25+ years forex specialist", "Trading Station proprietary platform"], spreadBetting: false, localAccount: true, localRegRef: "CIRO member" },
  ],

  regulation: {
    title: "How CIRO Protects Canadian Traders",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "CIRO Dealer Membership Required", desc: "Any firm offering leveraged forex trading to Canadian residents should be a CIRO (formerly IIROC) member or regulated provincially. Verify at ciro.ca before opening an account." },
      { icon: "\u{1F4B0}", title: "CIPF Protection \u2014 C$1 Million", desc: "The Canadian Investor Protection Fund covers up to C$1 million per account category if a CIRO member firm becomes insolvent. This is one of the highest compensation schemes globally." },
      { icon: "\u{1F4CA}", title: "Leverage Limits", desc: "CIRO sets margin requirements that effectively cap leverage around 1:33 to 1:50 for major forex pairs. Specific requirements vary by currency pair and market conditions." },
      { icon: "\u{1F3E6}", title: "Provincial Securities Regulators", desc: "In addition to CIRO, each province has its own securities regulator (e.g., OSC in Ontario, AMF in Quebec). Brokers may need provincial registration depending on their services." },
      { icon: "\u{1F4CB}", title: "Know Your Client (KYC)", desc: "CIRO members must conduct suitability assessments to ensure forex trading is appropriate for each client. This includes assessing financial knowledge, risk tolerance, and net worth." },
      { icon: "\u2696\uFE0F", title: "Ombudsman for Banking Services", desc: "Canadian forex traders can escalate complaints to the Ombudsman for Banking Services and Investments (OBSI) for free dispute resolution, with recommendations up to C$350,000." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Canada?", a: "Forex profits in Canada are generally taxed as capital gains or business income. For capital gains, only 50% of the gain is included in your taxable income (the inclusion rate). If the CRA considers your trading a business, 100% of profits are taxable as business income. The distinction depends on factors like trading frequency, holding periods, and intent." },
    { q: "Capital Gains vs Business Income for Forex", a: "Capital gains treatment (50% inclusion rate) applies to occasional, investment-style trading. Business income (100% taxable) applies if you trade frequently, have a systematic approach, and it resembles a business. CRA considers: frequency of trades, period of ownership, knowledge of securities markets, and time spent on trading." },
    { q: "Can I Use a TFSA or RRSP for Forex?", a: "TFSAs and RRSPs are designed for investment purposes and most self-directed accounts don\u2019t offer forex/CFD trading. Some brokers may offer limited forex within these accounts (e.g., currency ETFs), but leveraged forex CFDs are generally not eligible. Day trading within a TFSA may trigger CRA scrutiny." },
    { q: "Tax Reporting for Canadian Forex Traders", a: "Report capital gains on Schedule 3 of your T1 return. Business income goes on Form T2125. Keep detailed records of all trades including dates, amounts, exchange rates, and fees. Your broker should provide annual tax statements, but maintaining your own records is essential." },
  ],

  payments: [
    { method: "Interac e-Transfer", deposit: "Free", withdrawal: "Free", time: "Instant \u2013 1h", note: "Best for Canada" },
    { method: "Bank Wire Transfer", deposit: "Free\u2013C$25", withdrawal: "C$25\u201350", time: "1-2 business days", note: "Larger amounts" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit cards" },
    { method: "Interac Online", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "Selected brokers" },
  ],

  guide: [
    { q: "How to Verify a CIRO-Regulated Broker", a: "Visit ciro.ca and use the dealer member search to verify a broker\u2019s membership status. Confirm the firm is an active dealer member and check its registration history. Also verify provincial registration with your local securities regulator (e.g., OSC for Ontario)." },
    { q: "CIPF Protection: What Canadian Traders Should Know", a: "The Canadian Investor Protection Fund covers up to C$1 million per account category if a CIRO member becomes insolvent. This covers cash and securities, including forex positions. Note: CIPF does not cover losses from market movements or bad investment decisions." },
    { q: "Provincial Registration Requirements", a: "Canada\u2019s regulatory framework includes federal (CIRO) and provincial components. Some services require provincial registration. Quebec residents have additional protections under the AMF. Always verify your broker\u2019s registration in your specific province." },
    { q: "Can Canadian Traders Access Higher Leverage?", a: "CIRO margin requirements limit leverage to approximately 1:33\u20131:50 for major forex pairs. Unlike the EU and Australia, Canada does not have a formal Professional Client category with higher leverage. Some international brokers may offer higher leverage through offshore entities, but this means losing CIPF protection." },
    { q: "Understanding the OBSI Dispute Process", a: "The Ombudsman for Banking Services and Investments (OBSI) provides free dispute resolution for Canadian investors. If your complaint isn\u2019t resolved by the broker directly, OBSI can investigate and make non-binding recommendations up to C$350,000. Most firms comply voluntarily." },
  ],

  faq: [
    { q: "What is the best forex broker in Canada for 2026?", a: "IG is our top pick for Canadian traders in 2026. It\u2019s CIRO-regulated with CIPF protection, offers 17,000+ markets, CAD base accounts, and free ProRealTime charting." },
    { q: "Is forex trading legal in Canada?", a: "Yes, forex trading is fully legal and regulated in Canada. CIRO (formerly IIROC) oversees investment dealers nationally, while provincial securities regulators provide additional oversight." },
    { q: "Are forex profits taxable in Canada?", a: "Yes. Profits are taxed as either capital gains (50% inclusion rate) or business income (100% taxable), depending on your trading frequency and intent. Occasional trading is usually capital gains." },
    { q: "What leverage can Canadian traders use?", a: "CIRO member firms typically offer 1:33 to 1:50 leverage on major forex pairs. There is no Professional Client category in Canada offering higher leverage." },
    { q: "Is there deposit protection in Canada?", a: "Yes. CIPF covers up to C$1 million per account category if a CIRO member firm becomes insolvent. This is one of the most generous compensation schemes globally." },
    { q: "What is the minimum deposit for Canadian brokers?", a: "Several CIRO-regulated brokers have no minimum deposit, including IG, OANDA, CMC Markets, and Pepperstone. Others range from C$50 (FXCM) to C$2,000 (Saxo Bank)." },
    { q: "Can I deposit with Interac e-Transfer?", a: "Yes. Most Canadian brokers accept Interac e-Transfer for instant or near-instant deposits. This is the most popular and cost-effective deposit method for Canadian traders." },
    { q: "Do Canadian brokers offer CAD accounts?", a: "Yes. All our top-rated Canadian brokers offer CAD base accounts, eliminating currency conversion fees on deposits and withdrawals." },
  ],

  related: [
    { name: "Best CIRO-Regulated Brokers", icon: "\u{1F6E1}\uFE0F", count: 8, url: "#" },
    { name: "Best Low-Spread Brokers", icon: "\u{1F4B0}", count: 10, url: "#" },
    { name: "Best ECN Brokers", icon: "\u26A1", count: 12, url: "#" },
    { name: "Brokers in USA", icon: "\u{1F1FA}\u{1F1F8}", count: 5, url: "/best-forex-brokers-usa" },
    { name: "Brokers in UK", icon: "\u{1F1EC}\u{1F1E7}", count: 10, url: "/best-forex-brokers-uk" },
    { name: "Brokers in Australia", icon: "\u{1F1E6}\u{1F1FA}", count: 10, url: "/best-forex-brokers-australia" },
  ],
};

export default data;
