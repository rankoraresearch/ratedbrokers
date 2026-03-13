const data = {
  name: "Japan", slug: "japan", code: "JP", flag: "\u{1F1EF}\u{1F1F5}",
  regulator: "JFSA", regulatorFull: "Japan Financial Services Agency",
  regulatorUrl: "https://www.fsa.go.jp/en/", currency: "JPY",
  leverage: "1:25", leverageNote: "Maximum 1:25 for all retail forex — strictest in the world",
  compensation: "JIPF — \u00A510,000,000 (approx. $67,000)",
  negativeBalance: "Not mandatory — but most JFSA brokers offer it",
  taxNote: "Forex profits taxed at flat 20.315% (income tax 15% + resident tax 5% + reconstruction tax 0.315%). Losses can be carried forward 3 years.",
  localPayments: ["Japan Bank Transfer", "Quick Deposit (即時入金)", "Visa/Mastercard", "Japan Post Bank", "Convenience Store Payment"],
  year: "2026", updatedDate: "March 1, 2026",
  brokersTested: 48, localBrokersTotal: 55, hoursResearch: 110,
  author: { name: "Takeshi Morimoto", role: "Asia-Pacific Trading Specialist", exp: "15 years", initials: "TM", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "10 Best Forex Brokers in Japan for 2026 — JFSA Regulated",
  metaDescription: "We analyzed 55 JFSA-registered brokers for Japanese traders. These 10 offer the best trading conditions including full JIPF protection, ultra-tight JPY pair spreads, and 1:25 leverage.",
  keyFinding: "Japan has the world's largest retail forex market and strictest regulation. All JFSA-registered brokers must cap leverage at 1:25 and contribute to the JIPF compensation fund. Japanese domestic brokers dominate, but several international brokers hold JFSA licences and offer competitive JPY pair spreads.",

  brokers: [
    { rank: 1, slug: "oanda", badge: "Best Overall Japan", badgeColor: "#059669", localCurrencyMin: "\u00A50", verdict: "Best international broker for Japan. JFSA-registered with ultra-tight USD/JPY spreads and full Japanese-language platform.", localAdvantages: ["JFSA-registered (関東財務局長(金商)第2137号)", "JIPF ¥10M protection", "JPY base account — no conversion", "0.3 pip average USD/JPY spread", "Full Japanese-language platform & support"], spreadBetting: false, localAccount: true, localRegRef: "関東財務局長(金商)第2137号" },
    { rank: 2, slug: "ig", badge: "Widest Product Range", badgeColor: "#6d28d9", localCurrencyMin: "\u00A50", verdict: "Widest range of products for Japanese traders. JFSA-registered with 17,000+ markets beyond forex.", localAdvantages: ["JFSA-registered (関東財務局長(金商)第255号)", "JIPF ¥10M protection", "17,000+ tradeable instruments", "Full Japanese support team in Tokyo", "ProRealTime advanced charting"], spreadBetting: false, localAccount: true, localRegRef: "関東財務局長(金商)第255号" },
    { rank: 3, slug: "saxo-bank", badge: "Best for Professionals", badgeColor: "#1e293b", localCurrencyMin: "\u00A50", verdict: "Premium multi-asset trading for serious Japanese investors. Access to global markets with institutional-grade tools.", localAdvantages: ["JFSA-registered", "JIPF ¥10M protection", "72,000+ instruments globally", "SaxoTraderPRO for active traders", "DMA access to global exchanges"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 4, slug: "avatrade", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "\u00A510,000", verdict: "Most beginner-friendly international broker in Japan. Full Japanese support with strong educational content.", localAdvantages: ["JFSA-registered", "JIPF ¥10M protection", "Full Japanese education centre", "AvaProtect risk management", "AvaSocial copy trading in Japanese"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 5, slug: "pepperstone", badge: "Best Execution", badgeColor: "#d97706", localCurrencyMin: "\u00A50", verdict: "Fastest execution speeds in our Japan test. Strong for JPY pair traders who need reliability.", localAdvantages: ["ASIC + FCA + CySEC regulated", "JPY deposits supported", "Ultra-fast execution under 30ms", "TradingView + cTrader + MT4/MT5", "Raw spreads on JPY pairs"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "xm", badge: "Best Bonus Offers", badgeColor: "#059669", localCurrencyMin: "\u00A5500", verdict: "Strong promotional offers for Japanese traders. Micro lot trading available for small accounts.", localAdvantages: ["ASIC + CySEC regulated", "JPY base account", "Micro lot (0.01) trading", "Japanese webinars & education", "Loyalty program with XM Points"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "thinkmarkets", badge: null, badgeColor: null, localCurrencyMin: "\u00A50", verdict: "Solid all-rounder for Japan. ASIC-regulated with Japanese support and competitive JPY pair pricing.", localAdvantages: ["ASIC + FCA regulated", "JPY base account", "ThinkTrader proprietary platform", "Japanese customer support", "No minimum deposit"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "fxpro", badge: null, badgeColor: null, localCurrencyMin: "\u00A510,000", verdict: "Multi-platform broker with strong JPY pair spreads and NDD execution model.", localAdvantages: ["FCA + CySEC regulated", "JPY deposits supported", "NDD execution — no dealing desk", "MT4 + MT5 + cTrader + FxPro Edge", "Negative balance protection"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "capital-com", badge: null, badgeColor: null, localCurrencyMin: "\u00A52,000", verdict: "AI-powered insights and clean interface. Good for Japanese traders transitioning from domestic platforms.", localAdvantages: ["FCA + CySEC + ASIC regulated", "JPY deposits accepted", "AI-driven trading insights", "TradingView integration", "3,000+ markets including JPY pairs"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 10, slug: "admirals", badge: null, badgeColor: null, localCurrencyMin: "\u00A510,000", verdict: "Well-regulated European broker with strong educational tools and JPY pair coverage.", localAdvantages: ["FCA + CySEC + ASIC regulated", "JPY deposits via bank transfer", "Supreme Edition MT5 add-ons", "Trading Central signals", "Comprehensive education in English/Japanese"], spreadBetting: false, localAccount: true, localRegRef: null },
  ],

  regulation: {
    title: "How the JFSA Protects Japanese Traders",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "JFSA Registration Required", desc: "All forex brokers operating in Japan must register with the JFSA (Financial Services Agency) as a Type I Financial Instruments Business. Operating without registration is a criminal offence." },
      { icon: "\u{1F4B0}", title: "JIPF Compensation — \u00A510,000,000", desc: "The Japan Investor Protection Fund (JIPF) covers up to \u00A510 million (~$67,000) per customer if a registered broker becomes insolvent. All JFSA-registered brokers must be JIPF members." },
      { icon: "\u{1F4CA}", title: "Leverage Cap: 1:25 Maximum", desc: "Japan imposes the world's strictest retail forex leverage limit at 1:25 for all currency pairs. This was reduced from 1:50 in 2011. There is no professional client exemption." },
      { icon: "\u{1F512}", title: "Trust Segregation (信託保全)", desc: "JFSA-registered brokers must place 100% of client funds in trust with a designated bank or trust company. This trust segregation ensures client funds are protected even if the broker goes bankrupt." },
      { icon: "\u{1F4CB}", title: "Strict Advertising Rules", desc: "JFSA enforces rigorous advertising standards. Brokers cannot exaggerate profits, must display risk warnings prominently, and cannot offer incentive bonuses that encourage excessive trading." },
      { icon: "\u{1F50D}", title: "Regular Audits & Reporting", desc: "JFSA conducts regular on-site inspections and requires monthly reporting of client positions, segregated fund balances, and capital adequacy. Non-compliant brokers face suspension or licence revocation." },
    ],
  },

  comparisonTable: null,

  tax: [
    { q: "How Are Forex Profits Taxed in Japan?", a: "Forex profits from exchange-traded (くりっく365) and OTC forex are taxed at a flat rate of 20.315% — comprising 15% income tax, 5% resident tax, and 0.315% special reconstruction tax. This flat rate applies regardless of your total income." },
    { q: "Can I Carry Forward Forex Losses?", a: "Yes. Forex trading losses can be carried forward for up to 3 years. You must file a tax return (確定申告) each year to maintain the loss carryforward. Losses from forex can offset gains from other 'miscellaneous income' in the futures/forex category." },
    { q: "When Do I Need to File a Tax Return?", a: "Salaried workers with forex profits exceeding \u00A5200,000 per year must file a tax return. Self-employed individuals must report all forex profits regardless of amount. The filing deadline is March 15 for the previous calendar year." },
    { q: "Can I Deduct Trading Expenses?", a: "Yes. Legitimate trading expenses can be deducted, including platform fees, data feed costs, trading education, computer equipment used for trading, and internet costs (proportional). Keep all receipts and records." },
  ],

  payments: [
    { method: "Quick Deposit (即時入金)", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "Most popular in Japan" },
    { method: "Japan Bank Transfer", deposit: "Free–\u00A5500", withdrawal: "Free–\u00A5500", time: "Same day", note: "All major banks" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Credit/debit" },
    { method: "Japan Post Bank", deposit: "Free", withdrawal: "Free", time: "1-2d", note: "ゆうちょ銀行" },
  ],

  guide: [
    { q: "How to Verify a JFSA-Registered Broker", a: "Visit the JFSA website (fsa.go.jp) and search the Financial Instruments Business Operators directory. Every registered broker has a registration number format: [Regional Finance Bureau](Financial Instruments Business) No.XXX. Verify this number before depositing." },
    { q: "Why Japan's 1:25 Leverage Limit Matters", a: "Japan's 1:25 cap is the world's strictest. While this limits profit potential, it also dramatically reduces risk. To trade 1 standard lot ($100,000) of USD/JPY, you need at least $4,000 in margin. This prevents the catastrophic account blowups common at 1:500 leverage." },
    { q: "Domestic vs International Brokers in Japan", a: "Japanese domestic brokers (GMO Click, DMM FX, SBI FX) offer ultra-tight JPY pair spreads but limited global markets. International brokers (OANDA, IG, Saxo) offer wider product ranges and more advanced platforms. Many Japanese traders use both." },
    { q: "Understanding Trust Segregation (信託保全)", a: "JFSA-registered brokers must place all client funds in trust custody with a designated bank. This is stronger than simple account segregation — even if the broker goes bankrupt, the trust funds are legally protected and cannot be claimed by creditors." },
    { q: "What Is くりっく365 (Click 365)?", a: "Click 365 is Japan's exchange-traded forex market operated by TFX (Tokyo Financial Exchange). It offers standardised contracts with central clearing, transparent pricing, and the same 20.315% flat tax rate as OTC forex. Some traders prefer it for its exchange-backed transparency." },
  ],

  faq: [
    { q: "What is the best forex broker in Japan for 2026?", a: "OANDA Japan is our top pick for Japanese traders in 2026. It's JFSA-registered with JIPF protection, offers JPY base accounts, ultra-tight USD/JPY spreads (0.3 pips average), and a full Japanese-language platform." },
    { q: "Is forex trading legal in Japan?", a: "Yes. Japan has the world's largest retail forex market. All forex brokers must be registered with the JFSA as Type I Financial Instruments Business operators. Japan's regulatory framework is considered one of the strongest globally." },
    { q: "What is the maximum leverage in Japan?", a: "1:25 for all retail forex traders. Japan has the world's strictest leverage cap, with no professional client exemption. This limit applies to all currency pairs and all JFSA-registered brokers." },
    { q: "How are forex profits taxed in Japan?", a: "Forex profits are taxed at a flat 20.315% rate (15% income tax + 5% resident tax + 0.315% reconstruction tax). Losses can be carried forward for 3 years. Salaried workers with profits under \u00A5200,000/year are exempt from additional filing." },
    { q: "What is the JIPF compensation?", a: "The Japan Investor Protection Fund covers up to \u00A510,000,000 (~$67,000) per customer if a JFSA-registered broker becomes insolvent. All registered brokers must be JIPF members." },
    { q: "Can Japanese traders use offshore brokers?", a: "Using offshore unregistered brokers is strongly discouraged by the JFSA. While not illegal for the trader, offshore brokers operating in Japan without registration are breaking the law. You lose JIPF protection and have no legal recourse." },
    { q: "Which broker has the tightest USD/JPY spread?", a: "Among international brokers, OANDA Japan offers the tightest USD/JPY spreads at 0.3 pips average. Domestic brokers like GMO Click and DMM FX may offer 0.2 pips, but their platforms and product ranges are more limited." },
    { q: "Do I need a My Number (マイナンバー) to open a forex account?", a: "Yes. Since 2016, all financial institutions in Japan require your Individual Number (My Number / マイナンバー) for account opening. This applies to both domestic and JFSA-registered international brokers." },
  ],

  related: [
    { name: "Best JFSA-Regulated Brokers", icon: "\u{1F6E1}\uFE0F", count: 14, url: "#" },
    { name: "Best Low Leverage Brokers", icon: "\u{1F4CA}", count: 8, url: "#" },
    { name: "Best JPY Pair Brokers", icon: "\u{1F4B4}", count: 10, url: "#" },
    { name: "Brokers in Australia", icon: "\u{1F1E6}\u{1F1FA}", count: 10, url: "/best-forex-brokers-australia" },
    { name: "Brokers in Singapore", icon: "\u{1F1F8}\u{1F1EC}", count: 8, url: "/best-forex-brokers-singapore" },
    { name: "Brokers in Hong Kong", icon: "\u{1F1ED}\u{1F1F0}", count: 8, url: "/best-forex-brokers-hong-kong" },
  ],
};

export default data;
