const data = {
  name: "South Africa", slug: "south-africa", code: "ZA", flag: "\u{1F1FF}\u{1F1E6}",
  regulator: "FSCA", regulatorFull: "Financial Sector Conduct Authority",
  regulatorUrl: "https://www.fsca.co.za", currency: "ZAR",
  leverage: "1:200", leverageNote: "No retail cap (brokers set their own limits)",
  compensation: "No government compensation scheme for forex",
  negativeBalance: "Varies \u2014 not mandated by FSCA, broker-dependent",
  taxNote: "Forex profits may be taxed as income or capital gains depending on SARS classification.",
  localPayments: ["EFT Bank Transfer (FNB/Standard/Nedbank/ABSA)", "Visa/Mastercard", "Ozow (Instant EFT)", "SCode", "Skrill"],
  year: "2026", updatedDate: "February 28, 2026",
  brokersTested: 44, localBrokersTotal: 28, hoursResearch: 82,
  author: { name: "Thabo Ndlovu", role: "African Markets Specialist", exp: "10 years", initials: "TN", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "9 Best Forex Brokers in South Africa for 2026 \u2014 FSCA Regulated",
  metaDescription: "We tested 28 FSCA-regulated brokers with real ZAR accounts. These 9 offer the best trading conditions for South African traders including FSCA regulation, ZAR deposits, and local EFT support.",
  keyFinding: "South Africa\u2019s FSCA provides a solid regulatory foundation, though it\u2019s less restrictive than tier-1 regulators like the FCA or ASIC. Higher leverage is available (up to 1:200+), but without mandatory negative balance protection. All our top picks hold FSCA licences and offer ZAR base accounts.",

  brokers: [
    { rank: 1, slug: "ig", badge: "Best Overall South Africa", badgeColor: "#059669", localCurrencyMin: "R0", verdict: "Most trusted global broker with FSCA authorisation. 50 years of operation, 17,000+ markets, and South African office.", localAdvantages: ["FSCA-authorised (FSP 41393)", "Johannesburg office with local support", "ZAR base account", "17,000+ markets", "Free ProRealTime charting"], spreadBetting: false, localAccount: true, localRegRef: "41393" },
    { rank: 2, slug: "pepperstone", badge: "Best for Active Traders", badgeColor: "#2563eb", localCurrencyMin: "R0", verdict: "Excellent execution with the tightest spreads for South African traders. FSCA-regulated with ZAR account support.", localAdvantages: ["FSCA-authorised (FSP 47390)", "0.0 pip raw spreads", "TradingView + cTrader + MT4/5", "ZAR base account", "Instant ZAR deposits via EFT"], spreadBetting: false, localAccount: true, localRegRef: "47390" },
    { rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "R85", verdict: "Best for South African beginners with low minimum deposit, excellent education, and full local support.", localAdvantages: ["FSCA-authorised (FSP 49976)", "Very low minimum deposit (R85)", "Free daily webinars and education", "ZAR base account", "Local EFT deposits and withdrawals"], spreadBetting: false, localAccount: true, localRegRef: "49976" },
    { rank: 4, slug: "exness", badge: "Best Instant Withdrawals", badgeColor: "#d97706", localCurrencyMin: "R0", verdict: "Fastest deposits and withdrawals in South Africa. No minimum deposit and instant ZAR processing.", localAdvantages: ["FSCA-authorised (FSP 51024)", "No minimum deposit", "Instant ZAR deposits and withdrawals", "0.0 pip spreads on Pro account", "Leverage up to 1:200"], spreadBetting: false, localAccount: true, localRegRef: "51024" },
    { rank: 5, slug: "hfm", badge: "Best Bonuses", badgeColor: "#059669", localCurrencyMin: "R0", verdict: "Strong value proposition for South African traders with bonuses, low minimums, and FSCA regulation.", localAdvantages: ["FSCA-authorised (FSP 46632)", "No minimum deposit", "ZAR base account", "Deposit bonuses available", "Free VPS for active traders"], spreadBetting: false, localAccount: true, localRegRef: "46632" },
    { rank: 6, slug: "tickmill", badge: "Lowest Commission", badgeColor: "#d97706", localCurrencyMin: "R1,500", verdict: "Lowest raw spread commission for South African traders. Excellent for cost-conscious active traders.", localAdvantages: ["FSCA-authorised (FSP 49464)", "Ultra-low commissions", "Raw spreads from 0.0 pips", "ZAR deposits via EFT", "Free Autochartist and trading tools"], spreadBetting: false, localAccount: true, localRegRef: "49464" },
    { rank: 7, slug: "fxpro", badge: null, badgeColor: null, localCurrencyMin: "R1,500", verdict: "Well-regulated multi-platform broker with strong execution and ZAR account support.", localAdvantages: ["FSCA-authorised (FSP 45052)", "cTrader + MT4/5", "ZAR base account", "Negative balance protection offered", "Edge accounts with raw pricing"], spreadBetting: false, localAccount: true, localRegRef: "45052" },
    { rank: 8, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "R3,500", verdict: "Tightest raw spreads at 0.02 pips average. True ECN for South African traders who prioritise execution.", localAdvantages: ["FSCA-authorised (FSP 51018)", "0.02 pip average EUR/USD", "True ECN with 25+ LPs", "ZAR deposits accepted", "cTrader + TradingView"], spreadBetting: false, localAccount: true, localRegRef: "51018" },
    { rank: 9, slug: "avatrade", badge: null, badgeColor: null, localCurrencyMin: "R1,500", verdict: "Established multi-platform broker with FSCA regulation and strong educational resources.", localAdvantages: ["FSCA-authorised (FSP 45984)", "ZAR base account", "AvaProtect risk management", "AvaOptions for vanilla options", "Free AvaAcademy education"], spreadBetting: false, localAccount: true, localRegRef: "45984" },
  ],

  regulation: {
    title: "How the FSCA Protects South African Traders",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "FSP Licence Required", desc: "Any firm offering forex/CFD trading to South African residents must be authorised by the FSCA and hold a Financial Services Provider (FSP) licence. Verify at fsca.co.za before opening an account." },
      { icon: "\u{1F4B0}", title: "Client Fund Segregation", desc: "FSCA requires authorised brokers to hold client funds in segregated accounts with South African banks. However, there is no government-backed compensation scheme if a broker fails." },
      { icon: "\u{1F4CA}", title: "No Leverage Cap", desc: "Unlike the FCA or ASIC, the FSCA does not impose a specific leverage cap. Brokers set their own limits, typically between 1:100 and 1:500. Higher leverage means higher risk \u2014 choose carefully." },
      { icon: "\u{1F4CB}", title: "FAIS Compliance", desc: "Brokers must comply with the Financial Advisory and Intermediary Services (FAIS) Act, which requires fair treatment of clients, proper disclosures, and suitability assessments." },
      { icon: "\u2696\uFE0F", title: "FAIS Ombud for Disputes", desc: "South African traders can lodge complaints with the FAIS Ombud for free dispute resolution with FSCA-regulated firms. The Ombud can make binding determinations." },
      { icon: "\u{1F4B1}", title: "SARB Exchange Controls", desc: "The South African Reserve Bank (SARB) limits individual offshore forex allowances to R11 million per year (Single Discretionary Allowance: R1 million, Foreign Investment Allowance: R10 million). Trading with a local FSCA broker avoids these limits." },
    ],
  },

  comparisonTable: {
    title: "FSCA vs Tier-1 Regulators",
    subtitle: "How FSCA regulation compares to stricter regulators like FCA and ASIC.",
    headers: ["Feature", "FSCA (South Africa)", "FCA/ASIC (Tier-1)"],
    rows: [
      ["Leverage Cap", "\u274C No cap (broker sets)", "\u2705 1:30 retail"],
      ["Negative Balance", "\u26A0\uFE0F Not mandated", "\u2705 Mandatory"],
      ["Compensation Scheme", "\u274C None for forex", "\u2705 FSCS/ICF"],
      ["Client Money Rules", "\u2705 Segregated", "\u2705 Segregated"],
      ["Dispute Resolution", "\u2705 FAIS Ombud", "\u2705 FOS/AFCA"],
      ["Risk Warnings", "\u2705 Required", "\u2705 Required"],
      ["Best For", "Flexibility, higher leverage", "Maximum safety"],
    ],
  },

  tax: [
    { q: "How Are Forex Profits Taxed in South Africa?", a: "SARS (South African Revenue Service) may tax forex profits as either revenue (income) or capital gains, depending on your intent and frequency. If you trade frequently with the intent to profit, SARS will classify it as revenue, taxed at your marginal income tax rate (18\u201345%). If trading is occasional/investment, it may qualify as capital gains with a R40,000 annual exclusion and effective rate of up to 18%." },
    { q: "Revenue vs Capital Gains Classification", a: "SARS considers several factors: frequency of trades, holding period, intent (profit-making vs investment), and whether trading is your primary activity. Active, frequent traders are typically classified as revenue. Long-term, infrequent traders may qualify for capital gains treatment. The distinction has a significant tax impact." },
    { q: "Do I Need to Declare Forex Income to SARS?", a: "Yes. All forex profits must be declared on your annual tax return, regardless of classification. Revenue income goes on your ITR12 return under \u2018Other Income\u2019 or business income. Capital gains are reported in the capital gains section. Keep detailed records of all trades." },
    { q: "Tax on Offshore Forex Accounts", a: "South African tax residents are taxed on worldwide income. Profits from offshore forex accounts must be declared to SARS. Additionally, SARB exchange controls apply: you need a tax clearance to invest more than R1 million offshore (or R10 million with Foreign Investment Allowance)." },
  ],

  payments: [
    { method: "EFT Bank Transfer (FNB/Standard/Nedbank/ABSA)", deposit: "Free", withdrawal: "Free", time: "Instant \u2013 1d", note: "Best for SA" },
    { method: "Ozow (Instant EFT)", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "Most brokers" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit cards" },
    { method: "Skrill", deposit: "Free", withdrawal: "Free\u2013R50", time: "Instant / 1d", note: "E-wallet" },
  ],

  guide: [
    { q: "How to Verify an FSCA-Authorised Broker", a: "Visit the FSCA website at fsca.co.za and search for the broker by name or FSP number. Confirm the licence status is \u2018Authorised\u2019 and check which categories of financial services they\u2019re licensed for. Only trade with brokers holding active FSP licences." },
    { q: "Why Choose an FSCA-Regulated Broker?", a: "Using a locally FSCA-regulated broker means: ZAR base accounts (no conversion fees), fast local EFT deposits, FAIS Ombud for disputes, compliance with South African laws, and no need to use your SARB foreign exchange allowance for deposits." },
    { q: "Understanding SARB Exchange Controls", a: "South African residents have annual forex allowances: R1 million Single Discretionary Allowance (no tax clearance needed) and R10 million Foreign Investment Allowance (tax clearance required). Trading with a local FSCA broker keeps funds within South Africa, avoiding these limits." },
    { q: "Is Higher Leverage Better?", a: "The FSCA does not cap leverage, so brokers may offer 1:200 or higher. While higher leverage amplifies potential profits, it equally amplifies losses. We recommend starting with 1:30\u20131:50 as a beginner and only increasing leverage as you gain experience and develop risk management skills." },
    { q: "Load Shedding and Trading", a: "Load shedding (scheduled power outages) can disrupt trading. Use mobile data as backup, set stop-loss orders on every position, and consider a UPS (uninterruptible power supply). Most brokers\u2019 mobile apps continue to work on cellular data." },
  ],

  faq: [
    { q: "What is the best forex broker in South Africa for 2026?", a: "IG is our top pick for South African traders in 2026. It\u2019s FSCA-authorised (FSP 41393), has a Johannesburg office, offers ZAR accounts, 17,000+ markets, and 50+ years of global trust." },
    { q: "Is forex trading legal in South Africa?", a: "Yes, forex trading is fully legal and regulated in South Africa. The FSCA oversees all forex/CFD brokers through the Financial Services Provider (FSP) licensing framework." },
    { q: "Are forex profits taxable in South Africa?", a: "Yes. SARS taxes forex profits as either revenue (income tax at 18\u201345%) or capital gains (effective rate up to 18% with R40,000 exclusion), depending on your trading frequency and intent." },
    { q: "What leverage is available in South Africa?", a: "The FSCA does not impose leverage limits, so brokers set their own. Typical offerings range from 1:100 to 1:500. Our top-rated brokers offer up to 1:200 for forex pairs." },
    { q: "Is there deposit protection in South Africa?", a: "No. South Africa does not have a government-backed deposit compensation scheme for forex trading. FSCA requires client fund segregation, but there is no safety net if a broker becomes insolvent. Choose well-established brokers." },
    { q: "What is the minimum deposit in ZAR?", a: "Several brokers have no minimum: IG, Pepperstone, Exness, and HFM. XM starts from R85. Others like Tickmill, FxPro, and AvaTrade require around R1,500. IC Markets requires R3,500." },
    { q: "Can I deposit in ZAR?", a: "Yes. All our top-rated South African brokers accept ZAR deposits via local EFT from major banks (FNB, Standard Bank, Nedbank, ABSA). This avoids currency conversion fees and SARB exchange control limits." },
    { q: "What about load shedding?", a: "Load shedding can disrupt trading. Protect yourself by: always using stop-loss orders, having mobile data backup, using a UPS for your equipment, and choosing a broker with a reliable mobile app." },
  ],

  related: [
    { name: "Best FSCA-Regulated Brokers", icon: "\u{1F6E1}\uFE0F", count: 12, url: "#" },
    { name: "Best Low Minimum Deposit", icon: "\u{1F4B0}", count: 10, url: "#" },
    { name: "Best for Beginners", icon: "\u{1F393}", count: 12, url: "#" },
    { name: "Brokers in UK", icon: "\u{1F1EC}\u{1F1E7}", count: 10, url: "/best-forex-brokers-uk" },
    { name: "Brokers in UAE", icon: "\u{1F1E6}\u{1F1EA}", count: 8, url: "/best-forex-brokers-uae" },
    { name: "Brokers in Australia", icon: "\u{1F1E6}\u{1F1FA}", count: 10, url: "/best-forex-brokers-australia" },
  ],
};

export default data;
