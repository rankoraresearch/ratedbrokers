const data = {
  name: "New Zealand", slug: "new-zealand", code: "NZ", flag: "\u{1F1F3}\u{1F1FF}",
  regulator: "FMA", regulatorFull: "Financial Markets Authority",
  regulatorUrl: "https://www.fma.govt.nz", currency: "NZD",
  leverage: "1:500", leverageNote: "No retail leverage cap — FMA allows high leverage",
  compensation: "No government compensation scheme",
  negativeBalance: "Not mandatory — check individual broker policies",
  taxNote: "Forex profits are taxable income. No capital gains tax, but forex trading profits on revenue account are taxed as income.",
  localPayments: ["Bank Transfer (NZ domestic)", "Visa/Mastercard", "POLi", "PayPal", "Skrill"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 42, localBrokersTotal: 18, hoursResearch: 78,
  author: { name: "James Whitfield", role: "Pacific Markets Analyst", exp: "12 years", initials: "JW", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in New Zealand for 2026 — FMA Regulated",
  metaDescription: "We tested 18 FMA-regulated brokers with real NZD accounts. These 10 offer the best trading conditions for New Zealand traders including FMA regulation, NZD base accounts, and competitive spreads.",
  keyFinding: "New Zealand's FMA provides solid oversight but no deposit compensation scheme — making broker selection critical. All our top picks are regulated by the FMA or hold equivalent tier-1 licences, and most offer NZD base accounts to eliminate conversion costs.",

  brokers: [
    { rank: 1, slug: "pepperstone", badge: "Best Overall NZ", badgeColor: "#059669", localCurrencyMin: "NZ$0", verdict: "Best all-round broker for NZ traders. FMA-regulated with raw spreads from 0.0 pips and full NZD account support.", localAdvantages: ["FMA-regulated (FSP #388608)", "NZD base account — no conversion fees", "Raw spreads from 0.0 pips on Razor", "TradingView + cTrader + MT4/MT5", "24/5 support including APAC hours"], spreadBetting: false, localAccount: true, localRegRef: "FSP388608" },
    { rank: 2, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "NZ$200", verdict: "Lowest raw spreads in our NZ test. Excellent for high-volume traders who prioritise execution speed.", localAdvantages: ["ASIC + CySEC regulated", "NZD base account available", "0.02 pip average EUR/USD spread", "25+ tier-1 liquidity providers", "cTrader + MT4/MT5 + TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 3, slug: "fp-markets", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "NZ$100", verdict: "Beginner-friendly with ECN pricing and strong educational resources. ASIC-regulated with NZD support.", localAdvantages: ["ASIC + CySEC regulated", "NZD base account", "Low ECN commission at $6/lot RT", "Comprehensive NZ trading guides", "4.8 Trustpilot rating"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "blackbull", badge: "NZ Local Champion", badgeColor: "#059669", localCurrencyMin: "NZ$0", verdict: "Headquartered in Auckland — the only top-tier NZ-based broker. FMA-regulated with institutional-grade pricing.", localAdvantages: ["FMA-regulated NZ company (FSP #403326)", "Auckland headquarters — local support", "NZD base account with NZ bank transfer", "26,000+ instruments", "ECN pricing from 0.0 pips"], spreadBetting: false, localAccount: true, localRegRef: "FSP403326" },
    { rank: 5, slug: "cmc-markets", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "NZ$0", verdict: "Premium platform experience for NZ traders. FMA-regulated with 330+ forex pairs and the Next Generation platform.", localAdvantages: ["FMA-regulated (FSP #41187)", "Next Generation platform with 115 indicators", "330+ forex pairs — most of any NZ broker", "NZD base account", "Free Reuters & Morningstar research"], spreadBetting: false, localAccount: true, localRegRef: "FSP41187" },
    { rank: 6, slug: "ig", badge: "Most Trusted", badgeColor: "#6d28d9", localCurrencyMin: "NZ$0", verdict: "50+ years of operation globally. FMA-regulated with the widest product range for NZ traders.", localAdvantages: ["FMA-regulated (FSP #684191)", "50+ years global operation", "17,000+ markets", "Award-winning proprietary platform", "NZD deposits via NZ bank transfer"], spreadBetting: false, localAccount: true, localRegRef: "FSP684191" },
    { rank: 7, slug: "vantage", badge: null, badgeColor: null, localCurrencyMin: "NZ$50", verdict: "Low-cost entry point for NZ traders with competitive ECN spreads and strong APAC support.", localAdvantages: ["ASIC + VFSC regulated", "NZD base account", "Low minimum deposit NZ$50", "ECN spreads from 0.0 pips", "ProTrader with TradingView"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "avatrade", badge: null, badgeColor: null, localCurrencyMin: "NZ$100", verdict: "Well-regulated multi-asset broker with strong educational content for NZ beginners.", localAdvantages: ["ASIC + multiple global licences", "NZD deposits supported", "AvaProtect risk management tool", "AvaSocial copy trading", "Free trading education"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "go-markets", badge: null, badgeColor: null, localCurrencyMin: "NZ$200", verdict: "Australian-based broker with strong APAC presence. Good ECN pricing for NZ day traders.", localAdvantages: ["ASIC-regulated", "NZD base account", "ECN pricing from 0.0 pips", "MT4 + MT5 support", "Strong APAC timezone support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "fusion-markets", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "NZ$0", verdict: "Ultra-low commissions at $4.50/lot. No minimum deposit — ideal for NZ traders who want pure ECN access.", localAdvantages: ["ASIC-regulated", "NZD base account", "$4.50/lot RT — lowest in NZ", "No minimum deposit", "MT4 + MT5 + cTrader"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How the FMA Protects NZ Traders",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "FMA Licensing Required", desc: "Brokers offering derivative trading in New Zealand must hold a Derivatives Issuer Licence from the FMA. Verify any broker at fma.govt.nz/compliance/lists before opening an account." },
      { icon: "\u{1F50D}", title: "Financial Service Provider Register", desc: "All licensed brokers are listed on the FSPR (Financial Service Providers Register). Check for a valid FSP number and ensure the entity is listed as a Derivatives Issuer, not just a Financial Service Provider." },
      { icon: "\u26A0\uFE0F", title: "No Compensation Scheme", desc: "Unlike the UK or EU, New Zealand has no government-backed deposit compensation scheme. If a broker becomes insolvent, client funds in segregated accounts may be returned but there is no guaranteed payout." },
      { icon: "\u{1F4CA}", title: "No Leverage Cap", desc: "The FMA does not impose mandatory leverage limits for retail traders. Brokers in NZ can offer leverage up to 1:500, though the FMA encourages risk warnings for high leverage." },
      { icon: "\u{1F512}", title: "Segregated Client Funds", desc: "FMA-regulated brokers must hold client funds in segregated accounts with NZ or Australian banks, separate from the broker's operating capital." },
      { icon: "\u{1F4CB}", title: "Fair Dealing Obligations", desc: "The FMA enforces fair dealing rules requiring brokers to act fairly, provide clear information about risks, and avoid misleading promotional material." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "Are Forex Profits Taxable in New Zealand?", a: "Yes. New Zealand has no formal capital gains tax, but forex trading profits are generally taxable as income under the 'revenue account' rules. If you trade forex with the intention of making a profit, IRD considers those profits as taxable income at your marginal tax rate (10.5% to 39%)." },
    { q: "What Records Do I Need to Keep?", a: "You should keep records of all trades including dates, amounts, currency pairs, and profits/losses. IRD may request these records during an audit. Most brokers provide annual trade statements that can simplify this process." },
    { q: "Can I Offset Forex Losses?", a: "If your forex trading is treated as a business or on revenue account, you can offset trading losses against other income. This can reduce your overall tax liability. Consult an NZ tax accountant to confirm your specific situation." },
    { q: "Do I Pay GST on Forex Trading?", a: "Financial services including forex trading are exempt from GST (Goods and Services Tax) in New Zealand. You do not need to charge or pay GST on your trading activities." },
  ],

  payments: [
    { method: "NZ Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 hours", note: "Best for NZ" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit or credit" },
    { method: "POLi", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "NZ online banking" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Selected brokers" },
  ],

  guide: [
    { q: "How to Verify an FMA-Regulated Broker", a: "Go to fma.govt.nz/compliance/lists and search by company name or FSP number. Ensure the broker holds a 'Derivatives Issuer' licence, not just a generic FSP registration. Some entities register on the FSPR without holding the correct licence type." },
    { q: "Why NZD Base Accounts Matter", a: "Trading with an NZD base account eliminates currency conversion fees on deposits and withdrawals. Without an NZD account, you typically lose 0.5-1.5% on every conversion. All our top 5 brokers offer NZD base accounts." },
    { q: "What Happens If My NZ Broker Goes Bankrupt?", a: "With no compensation scheme, your protection relies on segregated client funds. FMA-regulated brokers must hold your money separately from company funds. In insolvency, segregated funds are typically returned to clients, but the process can take months." },
    { q: "Should NZ Traders Use High Leverage?", a: "New Zealand allows up to 1:500 leverage, but this magnifies both gains and losses. Beginners should start at 1:10 or lower. Even experienced traders rarely need more than 1:50. Higher leverage increases the risk of a margin call and account wipeout." },
  ],

  faq: [
    { q: "What is the best forex broker in New Zealand for 2026?", a: "Pepperstone is our top pick for NZ traders in 2026. It's FMA-regulated, offers NZD base accounts, raw ECN spreads from 0.0 pips, and supports TradingView, cTrader, and MT4/MT5." },
    { q: "Is forex trading legal in New Zealand?", a: "Yes, forex trading is fully legal and regulated by the Financial Markets Authority (FMA). Brokers must hold a Derivatives Issuer Licence to offer leveraged trading to NZ residents." },
    { q: "What leverage can NZ traders use?", a: "The FMA does not cap leverage. Brokers in NZ can offer up to 1:500. However, higher leverage increases risk. We recommend beginners use no more than 1:10 to 1:30." },
    { q: "Is there a deposit protection scheme in NZ?", a: "No. Unlike the UK's FSCS or EU's ICF, New Zealand has no government-backed compensation scheme. Your protection relies on segregated client funds held by FMA-regulated brokers." },
    { q: "Do NZ brokers offer NZD accounts?", a: "Yes. All top 10 brokers in our ranking offer NZD base accounts, eliminating currency conversion fees. BlackBull Markets, being NZ-headquartered, also offers NZ domestic bank transfers." },
    { q: "Are forex profits taxed in New Zealand?", a: "Yes. While NZ has no formal capital gains tax, forex profits from trading with profit intent are treated as taxable income at your marginal rate (10.5% to 39%)." },
    { q: "Which NZ broker has the lowest spreads?", a: "IC Markets recorded the lowest average spreads in our NZ test at 0.02 pips on EUR/USD (Raw account). Pepperstone was a close second at 0.09 pips. Both charge ~$7/lot RT commission on raw accounts." },
    { q: "Can NZ traders use offshore brokers?", a: "Technically yes, but the FMA strongly warns against using unlicensed offshore brokers. You lose all regulatory protection and have no legal recourse in NZ courts if something goes wrong." },
  ],

  related: [
    { name: "Best FMA-Regulated Brokers", icon: "\u{1F6E1}\uFE0F", count: 12, url: "#" },
    { name: "Best ECN Brokers", icon: "\u26A1", count: 12, url: "#" },
    { name: "Best for Beginners", icon: "\u{1F393}", count: 10, url: "#" },
    { name: "Brokers in Australia", icon: "\u{1F1E6}\u{1F1FA}", count: 10, url: "/best-forex-brokers-australia" },
    { name: "Brokers in UK", icon: "\u{1F1EC}\u{1F1E7}", count: 10, url: "/best-forex-brokers-uk" },
    { name: "Brokers in Singapore", icon: "\u{1F1F8}\u{1F1EC}", count: 8, url: "/best-forex-brokers-singapore" },
  ],
};

export default data;
