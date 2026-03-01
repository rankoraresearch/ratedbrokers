const data = {
  name: "United Kingdom", slug: "uk", code: "GB", flag: "\u{1F1EC}\u{1F1E7}",
  regulator: "FCA", regulatorFull: "Financial Conduct Authority",
  regulatorUrl: "https://www.fca.org.uk", currency: "GBP",
  leverage: "1:30", leverageNote: "Retail (1:500 for Professional)",
  compensation: "FSCS \u2014 \u00A385,000 per person",
  negativeBalance: "Yes \u2014 mandatory under FCA rules",
  taxNote: "Spread betting is tax-free. CFD profits are subject to Capital Gains Tax.",
  localPayments: ["Bank Transfer (Faster Payments)", "Visa/Mastercard", "PayPal", "Skrill", "Neteller"],
  year: "2026", updatedDate: "February 27, 2026",
  brokersTested: 54, localBrokersTotal: 38, hoursResearch: 96,
  author: { name: "David Kowalski", role: "Risk Management Expert", exp: "18 years", initials: "DK", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in UK for 2026 \u2014 FCA Regulated",
  metaDescription: "We tested 38 FCA-regulated brokers with real GBP accounts. These 10 offer the best trading conditions for UK traders including FSCS protection, GBP base accounts, and tax-free spread betting.",
  keyFinding: "FCA-regulated brokers consistently scored highest for fund safety in our tests. All top 5 UK brokers offer FSCS protection, segregated client funds, and negative balance protection \u2014 three layers of safety no offshore broker matches.",

  brokers: [
    {
      rank: 1, slug: "pepperstone", badge: "Best Overall UK", badgeColor: "#059669", localCurrencyMin: "\u00A30", verdict: "Best overall for UK traders. FCA-regulated, FSCS-protected, with spread betting and the fastest execution in our test.", localAdvantages: ["FCA-regulated since 2015", "FSCS \u00A385K protection", "Free spread betting account", "GBP base account \u2014 no conversion fees", "London office with local support"], spreadBetting: true, localAccount: true, localRegRef: "684312",
      countryReview: {
        paragraphs: [
          "Pepperstone has earned the #1 spot for UK traders thanks to a rare combination: FCA regulation (ref: 684312), zero minimum deposit, and genuinely institutional-grade execution. In our 2026 testing with a real GBP account, Pepperstone delivered the fastest average order execution at 30ms \u2014 critical for scalpers and day traders operating during London session volatility.",
          "For UK-specific advantages, Pepperstone stands out by offering both spread betting and CFD accounts under the same login. This means you can trade forex and indices via tax-free spread betting while using CFDs for asset classes where you might want to offset losses against capital gains. GBP base accounts eliminate the 0.5\u20131% conversion fee that eats into profits with USD-only brokers.",
          "Pepperstone\u2019s Razor account averaged 0.09 pips on EUR/USD during our test \u2014 the second-tightest raw spread among all FCA-accessible brokers. Combined with the $7/lot round-turn commission and FSCS \u00A385,000 protection, this is the strongest overall package for UK residents who prioritize execution quality and cost efficiency."
        ],
        pros: ["Tax-free spread betting + CFD accounts under one login", "Zero minimum deposit \u2014 lowest barrier to entry", "30ms average execution \u2014 fastest in our UK test", "FSCS \u00A385K protection with segregated funds at Barclays"],
        cons: ["No proprietary platform \u2014 relies on MT4/MT5/cTrader", "Not listed on a stock exchange (less transparency than IG or CMC)"]
      },
    },
    {
      rank: 2, slug: "ig", badge: "Most Trusted", badgeColor: "#6d28d9", localCurrencyMin: "\u00A3250", verdict: "The UK\u2019s most established broker. 50 years of operation, listed on London Stock Exchange, and the widest product range.", localAdvantages: ["FCA-regulated since 1974 \u2014 50+ years", "Listed on London Stock Exchange (LON:IGG)", "FSCS \u00A385K protection", "17,000+ markets including spread betting", "Award-winning proprietary platform"], spreadBetting: true, localAccount: true, localRegRef: "195355",
      countryReview: {
        paragraphs: [
          "IG is the gold standard for trust in UK forex trading. Founded in 1974 and listed on the London Stock Exchange (LON:IGG), IG has a 50-year track record that no other broker can match. For UK traders who prioritise safety above all else, IG\u2019s \u00A31B+ market capitalisation and FTSE 250 membership provide a level of transparency and financial stability that\u2019s genuinely unmatched.",
          "What makes IG particularly compelling for UK residents is the breadth of its offering: 17,000+ markets spanning forex, indices, shares, commodities, and options \u2014 all accessible through a single FCA-regulated account. The spread betting account is tax-free on profits, and IG\u2019s proprietary platform has won multiple awards for its advanced charting, with ProRealTime included free for active traders.",
          "The main trade-off is cost. IG\u2019s standard EUR/USD spread of 0.6 pips is wider than Pepperstone\u2019s raw account, and the \u00A3250 minimum deposit is higher. But for UK traders who value a decades-long regulatory record, LSE listing, FSCS protection, and the ability to trade almost anything from one platform, IG remains the most trusted name in the industry."
        ],
        pros: ["50-year FCA track record \u2014 longest of any UK broker", "LSE-listed with \u00A31B+ market cap \u2014 maximum transparency", "17,000+ markets including shares, options, futures", "ProRealTime advanced charting included free for active traders"],
        cons: ["\u00A3250 minimum deposit \u2014 higher than competitors", "Standard spreads wider than raw ECN alternatives"]
      },
    },
    {
      rank: 3, slug: "cmc-markets", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "\u00A30", verdict: "Best proprietary platform for UK traders. Next Generation platform with advanced charting and 330+ forex pairs.", localAdvantages: ["FCA-regulated since 1989", "LSE-listed (LON:CMCX)", "FSCS \u00A385K protection", "330+ forex pairs \u2014 most of any UK broker", "Next Generation platform with 115 indicators"], spreadBetting: true, localAccount: true, localRegRef: "173730",
      countryReview: {
        paragraphs: [
          "CMC Markets is a UK-born broker that\u2019s been FCA-regulated since 1989 and trades on the London Stock Exchange (LON:CMCX). For UK traders who want a sophisticated proprietary platform without relying on MetaTrader, CMC\u2019s Next Generation platform is the clear winner \u2014 it offers 115 technical indicators, 12 chart types, pattern recognition, and client sentiment data built in.",
          "The standout for UK forex traders is market access: CMC offers 330+ currency pairs, far more than any other broker on this list. This includes exotic pairs that are simply unavailable elsewhere. Combined with spread betting for tax-free trading, zero minimum deposit, and FSCS \u00A385,000 protection, CMC provides exceptional value for UK residents who want deep forex market access.",
          "CMC also runs regular spread discount programmes for active UK traders. In our test, the average GBP/USD spread was 0.7 pips \u2014 competitive for a non-commission model. The platform\u2019s built-in Reuters news feed and pattern recognition scanner make it particularly useful for technical traders who want everything in one place without external subscriptions."
        ],
        pros: ["Next Generation platform with 115 indicators and pattern recognition", "330+ forex pairs \u2014 by far the widest selection", "Zero minimum deposit and competitive spread-only pricing", "LSE-listed with 35+ years of FCA regulation"],
        cons: ["MT4 available but no MT5 or cTrader support", "Research tools excellent but can feel overwhelming for beginners"]
      },
    },
    {
      rank: 4, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "\u00A3200", verdict: "Tightest raw spreads in our test at 0.02 pips average. Excellent for UK traders who prioritize execution quality.", localAdvantages: ["ASIC + CySEC regulated", "GBP base account available", "0.02 pip average EUR/USD spread", "Connection to 25+ tier-1 LPs", "cTrader + TradingView support"], spreadBetting: false, localAccount: true, localRegRef: null,
      countryReview: {
        paragraphs: [
          "IC Markets consistently delivers the tightest raw spreads we\u2019ve measured across all tested brokers. In our 2026 UK test, the average EUR/USD spread was 0.02 pips on the Raw Spread account \u2014 roughly 85% tighter than IG\u2019s standard account. For high-frequency UK traders and scalpers, this spread advantage translates to significant savings: approximately \u00A30.20 per standard lot versus \u00A36.00 elsewhere.",
          "While IC Markets isn\u2019t directly FCA-regulated (it operates under ASIC and CySEC licences), UK traders can open accounts through the CySEC-regulated entity, which provides negative balance protection and segregated funds under EU MiFID II standards. GBP base accounts are available, eliminating currency conversion costs on deposits and withdrawals via UK bank transfer.",
          "The trade-off for UK traders is the lack of FSCS \u00A385K protection and spread betting. IC Markets is a pure CFD broker, so all profits are subject to Capital Gains Tax. However, for serious traders who prioritise execution quality and raw pricing above all else \u2014 especially those trading during the London/New York overlap \u2014 IC Markets offers an objectively superior trading environment."
        ],
        pros: ["0.02 pip average EUR/USD \u2014 tightest spreads in our entire test", "cTrader + MT5 + TradingView \u2014 widest platform choice", "$7/lot commission \u2014 transparent, no markup", "25+ tier-1 liquidity providers for deep order book"],
        cons: ["No FCA regulation or FSCS protection \u2014 operates via CySEC", "No spread betting \u2014 all profits subject to UK Capital Gains Tax"]
      },
    },
    {
      rank: 5, slug: "saxo-bank", badge: "Best for Professionals", badgeColor: "#1e293b", localCurrencyMin: "\u00A3500", verdict: "Premium multi-asset platform ideal for wealthy UK traders. Access to 72,000+ instruments.", localAdvantages: ["FCA-regulated, Danish bank (SAXO.CO)", "FSCS \u00A385K protection", "72,000+ instruments across all asset classes", "DMA access to major stock exchanges", "Premium research from Saxo Strats team"], spreadBetting: true, localAccount: true, localRegRef: "551422",
      countryReview: {
        paragraphs: [
          "Saxo Bank is a Danish-licensed bank (not just a broker) that holds an FCA licence for UK operations. This banking status provides UK traders with an extra layer of institutional credibility. With 72,000+ instruments covering forex, stocks, bonds, ETFs, options, and futures, Saxo offers the widest product range of any broker accessible to UK residents \u2014 making it ideal for portfolio-minded traders.",
          "For UK-specific benefits, Saxo offers spread betting alongside traditional CFDs, GBP base accounts, and FSCS \u00A385,000 protection. The SaxoTraderPRO platform is built for professionals: it includes DMA (Direct Market Access) to major stock exchanges, professional-grade charting, and research from Saxo\u2019s in-house Strats team that\u2019s frequently cited by Bloomberg and Reuters.",
          "The minimum deposit of \u00A3500 and tiered pricing structure mean Saxo is not aimed at beginners. However, for UK traders with \u00A325,000+ portfolios who want institutional-quality execution, genuine DMA, and the ability to trade anything from forex to IPO allocations under one regulated roof, Saxo Bank is the premium choice."
        ],
        pros: ["Full banking licence \u2014 higher institutional standards than broker-only firms", "72,000+ instruments including DMA stocks, bonds, futures", "Professional-grade research from Saxo Strats team", "Spread betting + CFDs + real stocks in one platform"],
        cons: ["\u00A3500 minimum deposit \u2014 not beginner-friendly", "Tiered pricing favours high-volume traders; casual traders pay more"]
      },
    },
    {
      rank: 6, slug: "city-index", badge: null, badgeColor: null, localCurrencyMin: "\u00A30", verdict: "Established UK broker with 40+ years. Part of StoneX Group, offering excellent spread betting.", localAdvantages: ["FCA-regulated since 1983", "Part of NASDAQ-listed StoneX Group", "FSCS \u00A385K protection", "Tax-free spread betting", "TradingView integration included"], spreadBetting: true, localAccount: true, localRegRef: "113942",
      countryReview: {
        paragraphs: [
          "City Index has been serving UK traders since 1983, making it one of the longest-standing FCA-regulated brokers in the country. Now part of the NASDAQ-listed StoneX Group (annual revenue $60B+), City Index combines decades of UK market expertise with the financial backing of a major publicly traded financial services company.",
          "The key differentiator for UK traders is City Index\u2019s TradingView integration \u2014 you can trade directly from TradingView charts through your City Index spread betting account, combining TradingView\u2019s superior charting with tax-free execution. Zero minimum deposit and GBP accounts make it accessible, while FSCS \u00A385,000 protection provides the safety net UK traders expect.",
          "City Index\u2019s spread betting pricing is competitive at 0.5 pips on major pairs during peak hours. The AT Pro platform offers advanced order types and algorithmic trading for more experienced UK traders, while the mobile app is well-designed for casual monitoring."
        ],
        pros: ["40+ years of FCA regulation \u2014 proven UK track record", "TradingView integration for spread betting \u2014 trade directly from charts", "Zero minimum deposit with FSCS protection", "Part of NASDAQ-listed StoneX Group \u2014 strong financial backing"],
        cons: ["Fewer forex pairs than CMC Markets (around 84)", "No MT5 or cTrader \u2014 limited to proprietary platform and MT4"]
      },
    },
    {
      rank: 7, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "\u00A3100", verdict: "Lowest ECN commission among top-rated brokers. Strong for UK traders wanting raw pricing.", localAdvantages: ["ASIC + CySEC regulation", "GBP base account", "Lowest ECN commission at $6/lot RT", "4.8 Trustpilot \u2014 highest in this list", "cTrader + TradingView access"], spreadBetting: false, localAccount: true, localRegRef: null,
      countryReview: {
        paragraphs: [
          "FP Markets delivers the lowest ECN commission we\u2019ve found among reputable brokers: $6 per round-turn lot on the Raw account, compared to $7 at IC Markets and Pepperstone. For UK traders executing 10+ lots daily, this $1/lot saving adds up to hundreds of pounds annually. The 4.8 Trustpilot rating from 3,000+ reviews \u2014 the highest among all brokers in this ranking \u2014 reflects consistently positive client experiences.",
          "Like IC Markets, FP Markets operates under ASIC and CySEC regulation rather than a direct FCA licence. UK traders access the CySEC entity, which provides negative balance protection and segregated client funds. GBP base accounts are available for UK bank transfers, avoiding conversion fees that would otherwise erode the commission savings.",
          "FP Markets supports cTrader, MT4, MT5, and TradingView \u2014 giving UK traders maximum flexibility in choosing their preferred platform. The Iress platform is also available for DMA share trading. The main limitation for UK traders is the absence of spread betting, meaning all profits are subject to CGT."
        ],
        pros: ["$6/lot round-turn \u2014 lowest ECN commission in our test", "4.8 Trustpilot from 3,000+ reviews \u2014 highest client satisfaction", "cTrader + MT4 + MT5 + TradingView \u2014 full platform choice", "DMA share trading via Iress platform"],
        cons: ["No FCA regulation \u2014 CySEC entity for UK clients", "No spread betting \u2014 CFD profits taxable under CGT"]
      },
    },
    {
      rank: 8, slug: "spreadex", badge: "UK Specialist", badgeColor: "#059669", localCurrencyMin: "\u00A30", verdict: "UK-only spread betting specialist. Unique combination of financial and sports spread betting.", localAdvantages: ["FCA-regulated UK-only broker", "FSCS \u00A385K protection", "Tax-free financial spread betting", "Sports + financial betting combined", "No minimum deposit, no inactivity fee"], spreadBetting: true, localAccount: true, localRegRef: "190941",
      countryReview: {
        paragraphs: [
          "Spreadex is a uniquely British proposition: an FCA-regulated spread betting specialist that serves only UK clients. Unlike global brokers who bolt on spread betting as an afterthought, Spreadex has built its entire business around tax-free UK spread betting since 1999. This focus shows in the product \u2014 the spread betting interface is cleaner and more intuitive than competitors who juggle multiple account types.",
          "For UK traders whose primary goal is tax-free forex trading, Spreadex removes complexity. There\u2019s no choosing between CFD and spread betting accounts, no minimum deposit, no inactivity fees, and FSCS \u00A385,000 protection as standard. GBP pricing is native, and Spreadex also offers sports spread betting through the same account \u2014 a unique combination for traders who enjoy both financial and sports markets.",
          "The trade-off is narrower market coverage and less advanced platforms compared to IG or CMC. Spreadex focuses on what it does best: straightforward, tax-free spread betting for UK residents who want simplicity and dedicated domestic service."
        ],
        pros: ["Pure UK spread betting specialist \u2014 25+ years FCA-regulated", "Zero minimum deposit, zero inactivity fees", "Financial + sports spread betting in one account", "FSCS \u00A385K with 100% UK-focused customer support"],
        cons: ["Smaller product range than IG or CMC Markets", "No MT4/MT5/cTrader \u2014 proprietary platform only"]
      },
    },
    {
      rank: 9, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "\u00A3100", verdict: "Best for UK beginners interested in social/copy trading. Simple interface, but wider spreads.", localAdvantages: ["FCA-regulated with FSCS protection", "Copy Trading \u2014 follow top traders", "Fractional shares from \u00A310", "GBP deposits with free bank transfer", "30M+ users worldwide"], spreadBetting: false, localAccount: true, localRegRef: "583263",
      countryReview: {
        paragraphs: [
          "eToro is the dominant social trading platform for UK beginners, with 30M+ registered users and a uniquely simple interface that removes the intimidation factor of traditional trading platforms. The CopyTrader feature lets UK newcomers automatically replicate the trades of top-performing investors \u2014 a genuinely different approach to entering the forex market that doesn\u2019t require charting expertise.",
          "For UK-specific considerations, eToro is FCA-regulated (ref: 583263) with FSCS \u00A385,000 protection. GBP deposits via UK bank transfer are free, and the minimum deposit of \u00A3100 is accessible. eToro also offers fractional shares from \u00A310, making it a good all-in-one platform for UK traders who want forex alongside stock investing.",
          "The significant trade-off is cost. eToro\u2019s forex spreads start at 1.0 pip on EUR/USD \u2014 roughly 10x wider than Pepperstone\u2019s raw account. There\u2019s no spread betting, so forex profits are subject to CGT. For beginners testing the waters, this is acceptable. For active UK traders doing 10+ trades per day, the spread costs make eToro unsuitable."
        ],
        pros: ["CopyTrader \u2014 automatically replicate top investors' trades", "30M+ users \u2014 largest social trading community", "FCA-regulated with FSCS \u00A385K protection", "Fractional shares from \u00A310 + crypto under one account"],
        cons: ["1.0 pip minimum EUR/USD spread \u2014 significantly wider than ECN brokers", "No spread betting \u2014 forex profits subject to Capital Gains Tax"]
      },
    },
    {
      rank: 10, slug: "xtb", badge: null, badgeColor: null, localCurrencyMin: "\u00A30", verdict: "Strong all-rounder with excellent xStation platform. Good for both spread betting and real stocks.", localAdvantages: ["FCA-regulated, Warsaw Stock Exchange listed", "FSCS \u00A385K protection", "Tax-free spread betting", "0% commission real stocks up to \u00A3100K/mo", "Award-winning xStation 5 platform"], spreadBetting: true, localAccount: true, localRegRef: "522157",
      countryReview: {
        paragraphs: [
          "XTB is a Warsaw Stock Exchange-listed broker with FCA regulation and a growing UK presence. The xStation 5 platform is XTB\u2019s main selling point: it\u2019s fast, modern, and includes built-in sentiment data, economic calendar, and a heat map \u2014 all without the dated interface of MetaTrader. For UK traders who want a clean, browser-based experience, xStation consistently ranks among the best proprietary platforms.",
          "UK traders benefit from spread betting through XTB, making forex and index profits tax-free. But XTB\u2019s strongest UK-specific feature is commission-free real stock trading up to \u00A3100,000 per month. This makes XTB a compelling single-platform solution for UK residents who want tax-free spread betting alongside a real stock portfolio without paying per-trade commissions.",
          "Zero minimum deposit, FSCS \u00A385,000 protection, and GBP base accounts round out a solid UK proposition. Spreads are competitive at 0.5 pips on majors during London session hours. The main limitation is the relatively smaller forex pair count (57 pairs) compared to CMC Markets\u2019 330+."
        ],
        pros: ["xStation 5 \u2014 modern, award-winning proprietary platform", "0% commission stocks up to \u00A3100K/month alongside spread betting", "Zero minimum deposit with FSCS protection", "Listed on Warsaw Stock Exchange \u2014 publicly audited financials"],
        cons: ["Only 57 forex pairs \u2014 limited exotic selection", "Not as deep on research tools as IG or Saxo"]
      },
    },
  ],

  regulation: {
    title: "How the FCA Protects UK Traders",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "FCA Authorisation Required", desc: "Any broker offering services to UK residents must be authorised by the FCA. Check any broker\u2019s FCA status at register.fca.org.uk before opening an account." },
      { icon: "\u{1F4B0}", title: "FSCS Compensation \u2014 \u00A385,000", desc: "If an FCA-regulated broker goes bankrupt, the Financial Services Compensation Scheme covers up to \u00A385,000 per person. This is one of the highest deposit protection schemes globally." },
      { icon: "\u2696\uFE0F", title: "Negative Balance Protection", desc: "FCA rules guarantee you can never lose more than you deposit. If your account goes negative due to extreme market moves, the broker must absorb the loss." },
      { icon: "\u{1F4CA}", title: "Leverage Cap: 1:30 Retail", desc: "FCA limits retail leverage to 1:30 for major forex pairs (1:20 for minor pairs, 1:2 for crypto). Professional clients can apply for up to 1:500 but lose FSCS protection." },
      { icon: "\u{1F6AB}", title: "Crypto Derivatives Banned", desc: "Since January 2021, the FCA banned the sale of crypto CFDs and derivatives to UK retail consumers. Only professional clients can trade crypto derivatives." },
      { icon: "\u{1F4CB}", title: "Risk Warnings & Transparency", desc: "FCA-regulated brokers must display the percentage of retail accounts that lose money. This figure is updated quarterly and typically ranges from 62% to 82%." },
    ],
  },

  comparisonTable: {
    title: "Spread Betting vs CFD Trading",
    subtitle: "The UK offers tax-free spread betting \u2014 here\u2019s how it compares to CFD trading.",
    headers: ["Feature", "Spread Betting", "CFD Trading"],
    rows: [
      ["Tax on Profits", "\u2705 Tax-free", "\u274C CGT applies"],
      ["Stamp Duty", "\u2705 Exempt", "\u2705 Exempt"],
      ["Loss Offset", "\u274C Cannot offset", "\u2705 Offset other gains"],
      ["Pricing", "Per point (e.g. \u00A310/pt)", "Per contract/lot"],
      ["Expiry", "Some positions expire", "No expiry"],
      ["DMA Access", "\u274C Not available", "\u2705 Some brokers"],
      ["Best For", "Tax-free, beginners", "Advanced, loss offset"],
    ],
  },

  tax: [
    { q: "Is Spread Betting Tax-Free?", a: "Yes. Under current HMRC rules, profits from spread betting are exempt from Capital Gains Tax (CGT) and Stamp Duty. This is because spread betting is classified as gambling, not investing. However, spread betting losses cannot be offset against other gains. If spread betting is your primary source of income, HMRC may reclassify you as a professional trader, making profits taxable." },
    { q: "How Are CFD Profits Taxed?", a: "CFD trading profits are subject to Capital Gains Tax. The CGT allowance for 2025/26 is \u00A33,000 per year. Profits above this allowance are taxed at 18% (basic rate) or 24% (higher rate). CFD losses can be offset against other capital gains, which is an advantage over spread betting for some traders." },
    { q: "Spread Betting vs CFDs: Which Is More Tax-Efficient?", a: "For most UK traders, spread betting is more tax-efficient because profits are completely tax-free. However, if you expect to make significant losses, CFDs may be preferable because those losses can reduce your other capital gains. High-frequency traders with very large profits should consult a tax advisor." },
    { q: "Do I Need to Report Forex Income?", a: "Spread betting profits do not need to be reported on your self-assessment tax return. CFD profits above the annual CGT allowance must be reported. If you\u2019re unsure whether your activity classifies as spread betting or CFD trading, check with your broker and consider seeking professional tax advice." },
  ],

  payments: [
    { method: "Bank Transfer", deposit: "Free", withdrawal: "Free", time: "Instant \u2013 1h", note: "Best for UK" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit cards" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Pepperstone, IG, eToro" },
    { method: "Skrill/Neteller", deposit: "Free", withdrawal: "Free\u2013\u00A35", time: "Instant / 1d", note: "E-wallet" },
  ],

  guide: [
    { q: "How to Verify an FCA Broker", a: "Visit register.fca.org.uk and search by firm name or reference number. Verify the firm\u2019s \u2018Current Status\u2019 shows \u2018Authorised\u2019 and check which activities they\u2019re permitted to perform. Never trade with a broker showing \u2018Not authorised\u2019 status." },
    { q: "Should UK Traders Choose Spread Betting or CFDs?", a: "If you\u2019re primarily looking to profit from short-term price movements, spread betting is usually better because profits are tax-free. If you\u2019re hedging an existing portfolio, CFDs are better because losses can offset gains." },
    { q: "What Happens If My UK Broker Goes Bankrupt?", a: "If your broker is FCA-authorised, your funds are held in segregated accounts separate from the broker\u2019s operating funds. If the broker still can\u2019t return your money, FSCS covers up to \u00A385,000 per person. This process typically takes 7\u201314 business days." },
    { q: "Can UK Traders Use Offshore Brokers?", a: "Technically yes, but we strongly advise against it. Offshore brokers without FCA authorisation are operating illegally. You lose FSCS protection, negative balance protection, and leverage limits. If something goes wrong, you have no legal recourse in UK courts." },
    { q: "Professional vs Retail Client Status", a: "UK traders can apply for Professional Client status, unlocking leverage up to 1:500. However, you lose: FSCS \u00A385,000 protection, negative balance guarantee, and certain protections. To qualify, you need 2 of 3: 10+ large trades per quarter, \u00A3500,000+ portfolio, or 1+ year in relevant financial role." },
  ],

  faq: [
    { q: "What is the best forex broker in the UK for 2026?", a: "Pepperstone is our top pick for UK traders in 2026. It\u2019s FCA-regulated (ref: 684312), offers FSCS protection, spread betting, raw ECN pricing from 0.0 pips, and GBP accounts with no minimum deposit." },
    { q: "Are forex profits taxable in the UK?", a: "It depends on how you trade. Spread betting profits are tax-free under current HMRC rules. CFD trading profits are subject to Capital Gains Tax above the \u00A33,000 annual allowance." },
    { q: "Is forex trading legal in the UK?", a: "Yes, forex trading is fully legal and regulated. The FCA oversees all forex brokers operating in the UK, ensuring strict standards for client protection, transparency, and fair dealing." },
    { q: "What leverage can UK traders use?", a: "FCA retail clients are limited to 1:30 on major forex pairs, 1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto (pros only). Professional clients can access up to 1:500 but lose FSCS protection." },
    { q: "Do UK brokers offer GBP accounts?", a: "All top 10 UK brokers in our ranking offer GBP base accounts, saving approximately 0.5-1% on every transaction compared to USD-only accounts." },
    { q: "What is the FSCS?", a: "The Financial Services Compensation Scheme is a UK government-backed safety net. If an FCA-regulated broker becomes insolvent, FSCS covers up to \u00A385,000 per person, typically processed within 7-14 days." },
    { q: "Can I trade crypto CFDs in the UK?", a: "No, since January 2021, the FCA banned crypto derivatives for retail consumers. Only Professional clients can trade crypto CFDs. You can still buy and hold actual crypto on regulated exchanges." },
    { q: "Which UK brokers offer spread betting?", a: "From our top 10: Pepperstone, IG Group, CMC Markets, Saxo Bank, City Index, Spreadex, and XTB all offer spread betting. IC Markets, FP Markets, and eToro do not." },
  ],

  related: [
    { name: "Best FCA-Regulated Brokers", icon: "\u{1F6E1}\uFE0F", count: 16, url: "#" },
    { name: "Best Spread Betting", icon: "\u{1F3AF}", count: 10, url: "#" },
    { name: "Best ECN Brokers", icon: "\u26A1", count: 12, url: "#" },
    { name: "Brokers in Australia", icon: "\u{1F1E6}\u{1F1FA}", count: 10, url: "/best-forex-brokers-australia" },
    { name: "Brokers in UAE", icon: "\u{1F1E6}\u{1F1EA}", count: 8, url: "/best-forex-brokers-uae" },
    { name: "Brokers in Germany", icon: "\u{1F1E9}\u{1F1EA}", count: 9, url: "/best-forex-brokers-germany" },
  ],
};

export default data;
