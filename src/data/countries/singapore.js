const data = {
  name: "Singapore", slug: "singapore", code: "SG", flag: "\u{1F1F8}\u{1F1EC}",
  regulator: "MAS", regulatorFull: "Monetary Authority of Singapore",
  regulatorUrl: "https://www.mas.gov.sg", currency: "SGD",
  leverage: "1:50", leverageNote: "Retail (higher for accredited investors)",
  compensation: "No government compensation scheme for forex",
  negativeBalance: "Varies \u2014 not mandated by MAS, broker-dependent",
  taxNote: "Singapore has no capital gains tax. Forex profits are generally tax-free for individuals.",
  localPayments: ["Bank Transfer (DBS/OCBC/UOB)", "Visa/Mastercard", "PayNow", "GrabPay", "Skrill"],
  year: "2026", updatedDate: "February 28, 2026",
  brokersTested: 38, localBrokersTotal: 20, hoursResearch: 74,
  author: { name: "Wei Lin Tan", role: "Asia-Pacific Markets Analyst", exp: "11 years", initials: "WT", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "8 Best Forex Brokers in Singapore for 2026 \u2014 MAS Regulated",
  metaDescription: "We analyzed 20 MAS-regulated brokers for Singaporean traders. These 8 offer the best trading conditions including MAS regulation, SGD deposits, and competitive pricing.",
  keyFinding: "MAS is one of Asia\u2019s most respected financial regulators. All our top-rated brokers hold Capital Markets Services (CMS) licences, ensuring strict compliance with client money, conduct, and risk management rules. Singapore\u2019s tax-free capital gains environment adds further appeal.",

  brokers: [
    { rank: 1, slug: "ig", badge: "Best Overall Singapore", badgeColor: "#059669", localCurrencyMin: "S$0", verdict: "Most trusted global broker with a MAS CMS licence. 50 years of operation, 17,000+ markets, and full SGD account support.", localAdvantages: ["MAS-regulated CMS licence", "50+ years global operation", "SGD base account \u2014 no conversion fees", "17,000+ markets available", "Singapore office with local support"], spreadBetting: false, localAccount: true, localRegRef: "CMS100162" },
    { rank: 2, slug: "saxo-bank", badge: "Best for Professionals", badgeColor: "#6d28d9", localCurrencyMin: "S$3,000", verdict: "Premium multi-asset platform with MAS regulation. Best for experienced Singaporean traders wanting 72,000+ instruments.", localAdvantages: ["MAS-regulated CMS licence", "Danish bank \u2014 highest safety", "72,000+ instruments globally", "SGX-listed equities trading", "SGD base account"], spreadBetting: false, localAccount: true, localRegRef: "CMS200737" },
    { rank: 3, slug: "cmc-markets", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "S$0", verdict: "Best proprietary platform for Singaporean traders. MAS-regulated with 330+ forex pairs and the Next Generation platform.", localAdvantages: ["MAS-regulated CMS licence", "Award-winning Next Generation platform", "330+ forex pairs", "SGD base account", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: "CMS100180" },
    { rank: 4, slug: "oanda", badge: "Best for Transparency", badgeColor: "#d97706", localCurrencyMin: "S$0", verdict: "Pioneer in transparent pricing with over 25 years in Singapore. MAS-regulated with no minimum deposit and SGD accounts.", localAdvantages: ["MAS-regulated CMS licence", "25+ years in Singapore market", "Fully transparent pricing", "No minimum deposit", "SGD base account with PayNow"], spreadBetting: false, localAccount: true, localRegRef: "CMS100735" },
    { rank: 5, slug: "pepperstone", badge: "Best for Active Traders", badgeColor: "#059669", localCurrencyMin: "S$200", verdict: "Excellent execution and tight spreads for active Singaporean traders. MAS CMS-licensed with SGD support.", localAdvantages: ["MAS-regulated CMS licence", "0.0 pip raw spreads", "TradingView + cTrader + MT4/5", "SGD deposits via bank transfer", "Fast execution servers in Asia"], spreadBetting: false, localAccount: true, localRegRef: "CMS101188" },
    { rank: 6, slug: "plus500", badge: "Best for Simplicity", badgeColor: "#2563eb", localCurrencyMin: "S$200", verdict: "Simplest platform for Singaporean beginners. MAS CMS-licensed with an intuitive proprietary app.", localAdvantages: ["MAS-regulated CMS licence", "Simple, intuitive proprietary platform", "SGD base account", "No commissions on CFDs", "Free guaranteed stop-loss orders"], spreadBetting: false, localAccount: true, localRegRef: "CMS100648" },
    { rank: 7, slug: "city-index", badge: null, badgeColor: null, localCurrencyMin: "S$0", verdict: "Part of the StoneX Group with 40+ years of operation. MAS-regulated with competitive forex spreads.", localAdvantages: ["MAS-regulated CMS licence", "Part of NASDAQ-listed StoneX Group", "40+ years of operation", "SGD deposits via bank transfer", "TradingView integration"], spreadBetting: false, localAccount: true, localRegRef: "CMS100178" },
    { rank: 8, slug: "etoro", badge: "Best Social Trading", badgeColor: "#059669", localCurrencyMin: "S$200", verdict: "Best social and copy trading for Singaporean traders. CopyTrader lets you mirror successful traders.", localAdvantages: ["MAS-regulated CMS licence", "CopyTrader \u2014 follow top traders", "SGD deposits accepted", "Fractional shares from S$10", "30M+ users worldwide"], spreadBetting: false, localAccount: true, localRegRef: "CMS101278" },
  ],

  regulation: {
    title: "How MAS Protects Singaporean Traders",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "CMS Licence Required", desc: "Any broker offering leveraged forex trading to Singapore residents must hold a Capital Markets Services (CMS) licence from MAS. Verify any broker at the MAS Financial Institutions Directory before opening an account." },
      { icon: "\u{1F4B0}", title: "Client Money Segregation", desc: "MAS requires CMS-licensed brokers to hold client funds in segregated trust accounts with qualifying financial institutions. Client money cannot be used for the broker\u2019s own operations." },
      { icon: "\u{1F4CA}", title: "Leverage Cap: 1:50 Retail", desc: "MAS limits retail leverage to 1:50 for forex CFDs. Accredited investors (net assets > S$2M or income > S$300K/year) may access higher leverage." },
      { icon: "\u{1F4CB}", title: "Risk Disclosure Requirements", desc: "Brokers must provide clear risk warnings and a Customer Knowledge Assessment (CKA) before allowing Singapore residents to trade leveraged products." },
      { icon: "\u{1F4BC}", title: "Capital Adequacy Requirements", desc: "CMS-licensed firms must maintain minimum financial resources (base capital of S$1M for dealing in securities) and submit regular financial reports to MAS." },
      { icon: "\u2696\uFE0F", title: "FIDReC Dispute Resolution", desc: "The Financial Industry Disputes Resolution Centre (FIDReC) provides a low-cost avenue for retail investors to resolve disputes with MAS-regulated firms, with claims up to S$100,000." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "Are Forex Profits Taxable in Singapore?", a: "Singapore has no capital gains tax. Forex trading profits are generally tax-free for individual traders. However, if IRAS (Inland Revenue Authority of Singapore) considers your trading to be a business activity (high frequency, systematic approach), profits may be classified as income and taxed at your personal income tax rate (0\u201322%)." },
    { q: "When Does IRAS Consider Trading as a Business?", a: "IRAS looks at several factors: frequency of trades, holding period, reason for trading, and whether you have other income. Occasional trading for investment is generally tax-free. If trading is your primary source of income with high frequency, IRAS may classify it as a trade or business, making profits taxable." },
    { q: "Do I Need to Report Forex Income?", a: "If your forex trading is classified as investment (capital gains), you do not need to report it. If it could be classified as income from a trade or business, you should declare it in your annual tax return. When in doubt, consult an IRAS-registered tax professional." },
    { q: "Tax for Expats Trading Forex in Singapore?", a: "Expats who are Singapore tax residents enjoy the same capital gains tax exemption. However, if your forex trading constitutes a business, profits earned in or derived from Singapore are taxable. Additionally, check your home country\u2019s tax obligations \u2014 some countries tax worldwide income regardless of residency." },
  ],

  payments: [
    { method: "Local Bank Transfer (DBS/OCBC/UOB)", deposit: "Free", withdrawal: "Free", time: "Instant \u2013 1d", note: "Best for SG" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit & credit" },
    { method: "PayNow", deposit: "Free", withdrawal: "Free", time: "Instant", note: "Selected brokers" },
    { method: "Skrill", deposit: "Free", withdrawal: "Free\u2013S$5", time: "Instant / 1d", note: "E-wallet" },
  ],

  guide: [
    { q: "How to Verify a MAS-Licensed Broker", a: "Visit the MAS Financial Institutions Directory at eservices.mas.gov.sg/fid and search by the broker\u2019s name. Confirm they hold a Capital Markets Services (CMS) licence and check which regulated activities they\u2019re licensed for." },
    { q: "What Is the Customer Knowledge Assessment (CKA)?", a: "Before trading leveraged forex, Singapore residents must pass a CKA administered by the broker. This assesses your understanding of derivatives trading. If you don\u2019t pass, the broker must provide additional risk warnings but may still allow trading." },
    { q: "What Happens If My MAS Broker Fails?", a: "Singapore does not have a deposit compensation scheme specifically for forex traders. However, MAS requires client funds in segregated trust accounts. In insolvency, segregated client money is returned to clients ahead of other creditors. Choose well-capitalised brokers to minimise risk." },
    { q: "Can Singaporean Traders Become Accredited Investors?", a: "Yes. Accredited Investor (AI) status requires net personal assets exceeding S$2M (or net financial assets > S$1M), or income exceeding S$300K in the preceding 12 months. AIs may access higher leverage and a wider range of products but may lose certain retail protections." },
    { q: "SGX vs OTC Forex Trading", a: "Most retail forex trading in Singapore is over-the-counter (OTC) via CMS-licensed brokers. SGX (Singapore Exchange) also offers currency futures with standardised contracts. OTC offers more flexibility and pairs, while SGX futures offer exchange transparency." },
  ],

  faq: [
    { q: "What is the best forex broker in Singapore for 2026?", a: "IG is our top pick for Singaporean traders in 2026. It holds a MAS CMS licence (CMS100162), offers 17,000+ markets, SGD base accounts, and has a local Singapore office with phone support." },
    { q: "Is forex trading legal in Singapore?", a: "Yes, forex trading is fully legal and regulated in Singapore. The MAS oversees all leveraged forex trading through the Capital Markets Services (CMS) licensing framework." },
    { q: "Are forex profits tax-free in Singapore?", a: "Generally yes. Singapore has no capital gains tax, so most individuals\u2019 forex profits are tax-free. However, if IRAS classifies your trading as a business, profits become taxable as income." },
    { q: "What leverage can Singaporean traders use?", a: "MAS limits retail leverage to 1:50 for forex CFDs. Accredited Investors (net assets > S$2M or income > S$300K) may access higher leverage from some brokers." },
    { q: "What is the minimum deposit for Singapore brokers?", a: "Several top brokers have no minimum: IG, CMC Markets, OANDA, and City Index. Others require S$200 (Pepperstone, Plus500, eToro). Saxo Bank has the highest minimum at S$3,000." },
    { q: "Is there deposit protection in Singapore?", a: "Singapore does not have a government-backed deposit protection scheme for forex trading. MAS requires brokers to hold client funds in segregated trust accounts, which provides structural protection in the event of broker insolvency." },
    { q: "Do I need to pass a test to trade forex in Singapore?", a: "Yes. MAS requires a Customer Knowledge Assessment (CKA) before trading leveraged products. The assessment covers basic knowledge of derivatives. If you don\u2019t pass, your broker must provide additional warnings." },
    { q: "Can I trade in SGD?", a: "Yes. All our top-rated Singapore brokers offer SGD base accounts, saving you approximately 0.3\u20130.5% on every deposit and withdrawal compared to USD accounts." },
  ],

  related: [
    { name: "Best MAS-Regulated Brokers", icon: "\u{1F6E1}\uFE0F", count: 10, url: "#" },
    { name: "Best Low-Spread Brokers", icon: "\u{1F4B0}", count: 10, url: "#" },
    { name: "Best for Beginners", icon: "\u{1F393}", count: 12, url: "#" },
    { name: "Brokers in Australia", icon: "\u{1F1E6}\u{1F1FA}", count: 10, url: "/best-forex-brokers-australia" },
    { name: "Brokers in UK", icon: "\u{1F1EC}\u{1F1E7}", count: 10, url: "/best-forex-brokers-uk" },
    { name: "Brokers in UAE", icon: "\u{1F1E6}\u{1F1EA}", count: 8, url: "/best-forex-brokers-uae" },
  ],
};

export default data;
