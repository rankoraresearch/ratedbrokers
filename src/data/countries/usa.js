const data = {
  name: "United States", slug: "usa", code: "US", flag: "\u{1F1FA}\u{1F1F8}",
  regulator: "NFA / CFTC", regulatorFull: "National Futures Association / Commodity Futures Trading Commission",
  regulatorUrl: "https://www.nfa.futures.org", currency: "USD",
  leverage: "1:50", leverageNote: "Major forex (1:20 for minors, no exceptions)",
  compensation: "No government deposit compensation for forex",
  negativeBalance: "No \u2014 not required by US regulators",
  taxNote: "Forex profits are taxed under Section 988 (ordinary income) or Section 1256 (60/40 split).",
  localPayments: ["ACH Bank Transfer", "Wire Transfer", "Visa/Mastercard", "Check"],
  year: "2026", updatedDate: "February 28, 2026",
  brokersTested: 28, localBrokersTotal: 5, hoursResearch: 64,
  author: { name: "David Kowalski", role: "Risk Management Expert", exp: "18 years", initials: "DK", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "Best Forex Brokers in USA for 2026 \u2014 NFA/CFTC Regulated",
  metaDescription: "We analyzed all NFA-registered forex brokers available to US residents. These are the best options with CFTC regulation, USD accounts, and competitive pricing.",
  keyFinding: "The US has the most restrictive forex regulatory environment globally. Only a handful of brokers hold NFA registration and CFTC licences required to serve US retail traders. No hedging, no negative balance protection, FIFO rule enforced, and leverage capped at 1:50. But these restrictions come with strong oversight.",

  brokers: [
    { rank: 1, slug: "ig", badge: "Best Overall USA", badgeColor: "#059669", localCurrencyMin: "$250", verdict: "IG re-entered the US market in 2019 and offers the best overall experience. NFA-registered with 80+ forex pairs and the best platform.", localAdvantages: ["NFA-registered (0509630)", "80+ forex pairs \u2014 most in US", "ProRealTime advanced charting free", "Competitive spreads from 0.6 pips", "50+ years global operation"], spreadBetting: false, localAccount: true, localRegRef: "0509630" },
    { rank: 2, slug: "oanda", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "$0", verdict: "Best for US beginners with no minimum deposit and transparent pricing. Pioneer in US retail forex since 2001.", localAdvantages: ["NFA-registered (0325821)", "No minimum deposit requirement", "25+ years in US forex", "Transparent, commission-free pricing", "TradingView integration"], spreadBetting: false, localAccount: true, localRegRef: "0325821" },
    { rank: 3, slug: "etoro", badge: "Best Social Trading", badgeColor: "#059669", localCurrencyMin: "$50", verdict: "eToro re-launched US forex in recent years with its social trading platform. Offers copy trading and a simplified experience for US retail traders.", localAdvantages: ["FinCEN-registered MSB", "CopyTrader \u2014 follow top traders", "Simple, beginner-friendly interface", "USD accounts with ACH deposits", "30M+ global community"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "plus500", badge: "Best Mobile App", badgeColor: "#2563eb", localCurrencyMin: "$100", verdict: "Plus500 entered the US market through its Futures Commission Merchant licence. Intuitive mobile-first platform for US traders.", localAdvantages: ["CFTC-registered FCM", "NFA member (0001398)", "Simple, intuitive mobile app", "Competitive futures pricing", "USD accounts with ACH deposits"], spreadBetting: false, localAccount: true, localRegRef: "0001398" },
    { rank: 5, slug: "saxo-bank", badge: "Best for Professionals", badgeColor: "#6d28d9", localCurrencyMin: "$0", verdict: "Saxo Bank offers US traders access to a premium multi-asset platform with institutional-grade execution through its US entity.", localAdvantages: ["NFA-registered", "72,000+ instruments globally", "Premium SaxoTraderPRO platform", "DMA access to US exchanges", "Comprehensive research and analysis"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How US Regulators Protect Forex Traders",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "NFA Registration Required", desc: "Any firm offering retail forex to US persons must be registered with the NFA as a Retail Foreign Exchange Dealer (RFED) and hold a CFTC licence. Verify at nfa.futures.org/basicnet before opening an account." },
      { icon: "\u{1F4B0}", title: "Minimum Capital: $20 Million", desc: "US retail forex dealers must maintain minimum adjusted net capital of $20 million plus 5% of customer obligations. This is the highest capital requirement globally, ensuring only well-funded firms operate." },
      { icon: "\u{1F504}", title: "FIFO Rule", desc: "The First In, First Out rule requires that if you have multiple positions in the same currency pair, the oldest position must be closed first. This prevents certain hedging strategies common in other jurisdictions." },
      { icon: "\u{1F6AB}", title: "No Hedging Allowed", desc: "US regulations prohibit holding simultaneous long and short positions in the same currency pair in the same account. This is a significant restriction for traders used to hedging strategies." },
      { icon: "\u{1F4CA}", title: "Leverage Cap: 1:50 Major", desc: "CFTC limits leverage to 1:50 for major currency pairs and 1:20 for minor pairs. There is no Professional Client category \u2014 these limits apply to all US retail traders." },
      { icon: "\u26A0\uFE0F", title: "No Negative Balance Protection", desc: "Unlike most other jurisdictions, US forex regulations do not require negative balance protection. In extreme market conditions, your account can go negative, and you would owe the broker the deficit." },
    ],
  },

  comparisonTable: {
    title: "US vs International Forex Regulation",
    subtitle: "US forex regulation is the strictest globally \u2014 here\u2019s how it compares.",
    headers: ["Feature", "USA (NFA/CFTC)", "International (FCA/ASIC)"],
    rows: [
      ["Broker Capital Requirement", "$20 million", "$1\u20132 million"],
      ["Max Leverage (Major)", "1:50", "1:30 (retail)"],
      ["Hedging", "\u274C Not allowed", "\u2705 Allowed"],
      ["FIFO Rule", "\u2705 Enforced", "\u274C Not enforced"],
      ["Negative Balance Protection", "\u274C Not required", "\u2705 Mandatory"],
      ["Number of Brokers", "~5 active", "100+"],
      ["Best For", "Maximum oversight", "More flexibility"],
    ],
  },

  tax: [
    { q: "How Are Forex Profits Taxed in the US?", a: "US forex traders typically choose between two tax treatments: Section 988 (default for spot forex) treats gains/losses as ordinary income taxed at your marginal rate (10\u201337%). Section 1256 (for futures/options) applies a 60/40 split: 60% long-term capital gains (max 20%) and 40% short-term (marginal rate). You can elect Section 1256 for spot forex by filing an internal election." },
    { q: "Section 988 vs Section 1256: Which Is Better?", a: "Section 1256 is generally better for profitable traders because the 60/40 split gives a lower blended rate (~23% vs up to 37%). Section 988 is better if you have net losses, as those losses can offset ordinary income without the $3,000 capital loss cap. Consult a tax professional to determine the best approach for your situation." },
    { q: "Do I Need to Report All Forex Trades?", a: "Yes. All forex profits and losses must be reported on your US tax return. Your broker will issue a 1099-B or equivalent statement. If using Section 988 (default), report on Form 8949 and Schedule D. If electing Section 1256, use Form 6781." },
    { q: "Wash Sale Rule for Forex", a: "The wash sale rule (disallowing a loss if you buy a substantially identical security within 30 days) technically applies to securities but not to forex contracts under Section 988. However, the IRS position is not entirely clear, so many tax professionals recommend tracking wash sales for forex as a precaution." },
  ],

  payments: [
    { method: "ACH Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 business days", note: "Best for US" },
    { method: "Wire Transfer", deposit: "Free\u2013$25", withdrawal: "$25\u201350", time: "Same day / 1d", note: "Faster, fees vary" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit cards" },
    { method: "Check", deposit: "Free", withdrawal: "Free", time: "3-5 business days", note: "OANDA, IG" },
  ],

  guide: [
    { q: "How to Verify an NFA-Registered Broker", a: "Visit the NFA BASIC system at nfa.futures.org/basicnet and search by firm name or NFA ID. Confirm the firm\u2019s Registration Status is \u2018Approved\u2019 and check its membership category includes \u2018Retail Foreign Exchange Dealer\u2019 (RFED)." },
    { q: "Why Are There So Few US Forex Brokers?", a: "The US has the strictest forex regulations globally: $20 million minimum capital, FIFO rule, no hedging, and intense regulatory oversight. These requirements make it extremely expensive to operate, driving most international brokers out of the US market. Only a handful of well-capitalised firms remain." },
    { q: "Can US Traders Use Offshore Brokers?", a: "Technically some offshore brokers accept US clients, but this is illegal for the broker (not the trader). We strongly advise against it: you have no legal protection, no NFA recourse, and the broker could freeze your funds. The Dodd-Frank Act prohibits unregistered firms from soliciting US customers." },
    { q: "Understanding FIFO and No-Hedging Rules", a: "The FIFO rule means your oldest open position in a pair must be closed first. The no-hedging rule prevents holding both long and short positions in the same pair. These rules limit certain strategies but exist to protect retail traders from unnecessary complexity. Use separate pairs or correlated instruments for hedging strategies." },
    { q: "Section 988 Election: What You Need to Know", a: "By default, spot forex profits/losses fall under Section 988 (ordinary income). You can elect out of Section 988 into Section 1256 treatment (60/40 split) by making an internal election before trading. This election must be made before the tax year begins or before your first trade. Keep a dated record of your election." },
  ],

  faq: [
    { q: "What is the best forex broker in the USA for 2026?", a: "IG is our top pick for US traders in 2026. It\u2019s NFA-registered (0509630), offers 80+ forex pairs (the most in the US), competitive spreads from 0.6 pips, and free ProRealTime charting." },
    { q: "Is forex trading legal in the USA?", a: "Yes, forex trading is legal but heavily regulated. Brokers must be NFA-registered and CFTC-licensed. Retail forex is restricted compared to other countries \u2014 no hedging, FIFO rule, and leverage capped at 1:50." },
    { q: "How many forex brokers are available in the US?", a: "Very few. Due to the $20 million capital requirement and strict regulations, only about 5 retail forex dealers are active in the US. This contrasts with hundreds of options available in Europe or Australia." },
    { q: "What leverage can US traders use?", a: "US retail traders are limited to 1:50 for major pairs and 1:20 for minor pairs. There is no Professional Client category to access higher leverage \u2014 these limits apply to everyone." },
    { q: "Is there deposit protection for US forex accounts?", a: "No. The US has no government deposit compensation scheme specifically for retail forex. However, the $20 million minimum capital requirement and NFA oversight provide structural safety." },
    { q: "Can I hedge in a US forex account?", a: "No. NFA regulations prohibit holding simultaneous long and short positions in the same currency pair within the same account. This is unique to US regulation and does not apply in other countries." },
  ],

  related: [
    { name: "Best NFA-Registered Brokers", icon: "\u{1F6E1}\uFE0F", count: 5, url: "#" },
    { name: "Best Low-Spread Brokers", icon: "\u{1F4B0}", count: 10, url: "#" },
    { name: "Best for Beginners", icon: "\u{1F393}", count: 12, url: "#" },
    { name: "Brokers in UK", icon: "\u{1F1EC}\u{1F1E7}", count: 10, url: "/best-forex-brokers-uk" },
    { name: "Brokers in Australia", icon: "\u{1F1E6}\u{1F1FA}", count: 10, url: "/best-forex-brokers-australia" },
    { name: "Brokers in Canada", icon: "\u{1F1E8}\u{1F1E6}", count: 8, url: "/best-forex-brokers-canada" },
  ],
};

export default data;
