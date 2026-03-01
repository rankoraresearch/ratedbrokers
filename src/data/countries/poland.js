const data = {
  name: "Poland", slug: "poland", code: "PL", flag: "🇵🇱",
  regulator: "KNF", regulatorFull: "Komisja Nadzoru Finansowego",
  regulatorUrl: "https://www.knf.gov.pl", currency: "PLN",
  leverage: "1:30", leverageNote: "Retail (ESMA rules via KNF)",
  compensation: "KDPW — PLN equivalent of €20,100 per investor",
  negativeBalance: "Yes — mandatory under ESMA/KNF rules",
  taxNote: "CFD profits are subject to 19% flat tax (podatek od zysków kapitałowych / podatek Belki).",
  localPayments: ["BLIK", "Bank Transfer (SEPA)", "Visa/Mastercard", "Przelewy24", "Skrill"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 40, localBrokersTotal: 22, hoursResearch: 80,
  author: { name: "Jakub Kowalski", role: "Central European Markets Analyst", exp: "12 years", initials: "JK", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Poland for 2026 — KNF Regulated",
  metaDescription: "We tested 22 KNF-registered brokers with real PLN accounts. These 10 offer the best trading conditions for Polish traders including BLIK deposits, PLN accounts, and ESMA-compliant leverage.",
  keyFinding: "Poland has one of the most active retail forex markets in Europe. XTB, headquartered in Warsaw with direct KNF regulation, dominates the market. Polish traders benefit from BLIK instant payments and competitive PLN account offerings across major EU brokers.",

  brokers: [
    { rank: 1, slug: "xtb", badge: "Best Overall Poland", badgeColor: "#059669", localCurrencyMin: "zł0", verdict: "Best overall for Polish traders. KNF-regulated directly with Warsaw HQ, WSE-listed, and the most popular broker in Poland.", localAdvantages: ["KNF-regulated directly — Warsaw HQ", "Listed on Warsaw Stock Exchange (XTB)", "PLN base account — no conversion fees", "xStation 5 — award-winning platform", "Full Polish-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 2, slug: "pepperstone", badge: "Best Execution", badgeColor: "#6d28d9", localCurrencyMin: "zł0", verdict: "Tightest spreads for Polish traders. CySEC-regulated with KNF registration, offering raw pricing from 0.0 pips.", localAdvantages: ["CySEC-regulated, KNF-registered", "PLN base account available", "0.0 pip raw spreads from $3.50/lot", "TradingView + cTrader + MT4/5", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "zł900", verdict: "Tightest raw spreads at 0.02 pips average. Excellent for Polish traders focused on execution quality.", localAdvantages: ["CySEC-regulated, EU-passported", "0.02 pip average EUR/USD spread", "PLN base account available", "cTrader + TradingView", "25+ tier-1 liquidity providers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "zł400", verdict: "Most popular social trading platform in Poland. Copy trading and fractional shares for beginners.", localAdvantages: ["CySEC-regulated, KNF-registered", "Copy Trading — follow top traders", "Fractional shares available", "PLN deposits accepted", "30M+ users worldwide"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "xm", badge: "Best for Beginners", badgeColor: "#d97706", localCurrencyMin: "zł20", verdict: "Very low minimum deposit with excellent educational resources in Polish. Ideal for Polish beginners.", localAdvantages: ["CySEC-regulated, KNF-registered", "Very low minimum deposit", "1,000+ instruments", "Free webinars in Polish", "Loyalty program"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "exness", badge: "Best Conditions", badgeColor: "#059669", localCurrencyMin: "zł0", verdict: "Competitive trading conditions with no minimum deposit. Growing presence in the Polish market.", localAdvantages: ["CySEC-regulated, EU-passported", "No minimum deposit", "Instant withdrawals", "PLN account available", "Tight spreads on majors"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "fp-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "zł400", verdict: "Lowest ECN commission among top brokers. Strong value for cost-conscious Polish traders.", localAdvantages: ["CySEC-regulated, EU-passported", "Low ECN commission at $6/lot RT", "cTrader + TradingView access", "4.8 Trustpilot rating", "Multiple base currencies"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "admirals", badge: null, badgeColor: null, localCurrencyMin: "zł400", verdict: "Solid all-rounder with MetaTrader Supreme Edition and Polish-language support.", localAdvantages: ["CySEC-regulated, EU-passported", "MetaTrader Supreme Edition free", "PLN base account", "Invest.MT5 for real stocks", "Polish-language support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "plus500", badge: null, badgeColor: null, localCurrencyMin: "zł400", verdict: "Simple platform popular in Poland. LSE-listed with full Polish-language interface.", localAdvantages: ["CySEC-regulated, KNF-registered", "LSE-listed (LON:PLUS)", "Simple proprietary platform", "Polish-language support", "PLN base account"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "oanda", badge: null, badgeColor: null, localCurrencyMin: "zł0", verdict: "Trusted global broker with transparent pricing. Good for Polish traders seeking reliability.", localAdvantages: ["Multi-regulated globally", "Transparent pricing model", "No minimum deposit", "OANDA fxTrade platform", "Quality market analysis"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How the KNF Protects Polish Traders",
    items: [
      { icon: "shield", title: "KNF Registration Required", desc: "Any broker offering services to Polish residents must be registered with the KNF or authorized under EU passporting. Verify any broker at knf.gov.pl before depositing funds." },
      { icon: "piggy-bank", title: "KDPW Compensation — €20,100", desc: "The National Depository for Securities (KDPW) operates the investor compensation scheme covering up to €20,100 per investor if a KNF-registered broker becomes insolvent." },
      { icon: "scale", title: "Negative Balance Protection", desc: "Under ESMA rules enforced by the KNF, retail traders can never lose more than their deposit. Brokers must absorb any negative balance." },
      { icon: "bar-chart-3", title: "Leverage Cap: 1:30 Retail", desc: "ESMA limits retail leverage to 1:30 for major forex pairs, 1:20 for minor pairs, 1:10 commodities, 1:5 equities, 1:2 crypto." },
      { icon: "ban", title: "KNF Warning List", desc: "The KNF maintains a public warning list of unauthorized brokers. Polish traders should always check this list before opening an account with any broker." },
      { icon: "clipboard-list", title: "Risk Warnings in Polish", desc: "KNF-registered brokers must display standardized risk warnings in Polish, including the percentage of retail accounts that lose money when trading CFDs." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Poland?", a: "Forex and CFD profits in Poland are subject to a flat 19% capital gains tax (podatek od zysków kapitałowych), commonly known as 'podatek Belki'. This applies to all realized gains from financial instruments." },
    { q: "How Do I Report Trading Income?", a: "Report trading income on PIT-38 tax form, filed annually by April 30. If your broker is Polish (like XTB), they will provide a PIT-8C form with calculated gains and losses. For foreign brokers, you must calculate gains yourself." },
    { q: "Can I Offset Trading Losses?", a: "Yes. Capital losses can be offset against capital gains from the same source category. Unused losses can be carried forward for 5 years, with a maximum of 50% of the loss used in any single year." },
    { q: "Is There a Tax-Free Allowance?", a: "No. Poland does not have a tax-free allowance for capital gains. All profits from forex trading are taxed at the flat 19% rate from the first zloty earned." },
  ],

  payments: [
    { method: "BLIK", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "Best for Poland" },
    { method: "Przelewy24", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "Popular in PL" },
    { method: "SEPA Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 days", note: "Standard" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit & credit" },
  ],

  guide: [
    { q: "How to Verify a KNF-Registered Broker", a: "Visit knf.gov.pl and search the register of licensed entities. Check that the broker is authorized to provide investment services. Also check the KNF's public warning list for unauthorized firms." },
    { q: "BLIK: Instant PLN Deposits", a: "BLIK is Poland's most popular mobile payment system, offering instant PLN deposits. Many top brokers accept BLIK, making account funding seamless for Polish traders." },
    { q: "XTB: Poland's Homegrown Broker", a: "XTB (X-Trade Brokers) is headquartered in Warsaw, directly regulated by the KNF, and listed on the Warsaw Stock Exchange. It's the most popular broker in Poland and provides PIT-8C tax forms for easy tax filing." },
    { q: "Filing PIT-38 for Trading Income", a: "Polish traders must file PIT-38 by April 30 each year. Polish brokers like XTB provide PIT-8C forms with calculated gains. For foreign brokers, you must calculate gains/losses yourself and convert to PLN using NBP exchange rates." },
    { q: "Can Polish Traders Use Non-EU Brokers?", a: "Not recommended. Non-EU brokers lack ESMA protections and are not supervised by the KNF. The KNF has been active in warning Polish consumers about unauthorized offshore brokers." },
  ],

  faq: [
    { q: "What is the best forex broker in Poland for 2026?", a: "XTB is our top pick for Polish traders in 2026. It's directly KNF-regulated with Warsaw headquarters, WSE-listed, and provides PLN accounts with PIT-8C tax forms." },
    { q: "Are forex profits taxable in Poland?", a: "Yes. Forex profits are subject to a flat 19% capital gains tax (podatek Belki). Report on PIT-38 by April 30 annually." },
    { q: "Is forex trading legal in Poland?", a: "Yes, forex trading is fully legal. Poland has one of the most active retail forex markets in Europe, overseen by the KNF." },
    { q: "What leverage can Polish traders use?", a: "Under ESMA rules enforced by the KNF, retail clients are limited to 1:30 on major forex pairs, 1:20 minor, 1:10 commodities, 1:5 equities, 1:2 crypto." },
    { q: "Can I deposit with BLIK?", a: "Yes, several top brokers accept BLIK for instant PLN deposits. XTB, as a Polish broker, has full BLIK integration." },
    { q: "What is the minimum deposit for forex trading in Poland?", a: "Minimum deposits range from zł0 (XTB, Pepperstone, Exness) to zł900 (IC Markets). XM offers one of the lowest at approximately zł20." },
    { q: "Does XTB provide tax documents?", a: "Yes. XTB provides PIT-8C forms to Polish clients, making tax filing straightforward. For foreign brokers, you must calculate and report gains yourself." },
    { q: "Which brokers offer PLN accounts?", a: "XTB, Pepperstone, IC Markets, Admirals, and several others offer PLN base accounts, avoiding currency conversion fees." },
  ],

  related: [
    { name: "Best EU-Regulated Brokers", icon: "🇪🇺", count: 15, url: "#" },
    { name: "Best ECN Brokers", icon: "zap", count: 12, url: "#" },
    { name: "Best for Beginners", icon: "graduation-cap", count: 10, url: "#" },
    { name: "Brokers in Germany", icon: "🇩🇪", count: 9, url: "/best-forex-brokers-germany" },
    { name: "Brokers in Czech Republic", icon: "🇨🇿", count: 8, url: "#" },
    { name: "Brokers in UK", icon: "🇬🇧", count: 10, url: "/best-forex-brokers-uk" },
  ],
};

export default data;
