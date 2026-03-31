const data = {
  name: "Oman", slug: "oman", code: "OM", flag: "\u{1F1F4}\u{1F1F2}",
  regulator: "CMA", regulatorFull: "Capital Market Authority of Oman",
  regulatorUrl: "https://www.cma.gov.om", currency: "OMR",
  leverage: "1:500", leverageNote: "No specific retail cap (offshore entities available)",
  compensation: "No formal compensation scheme",
  negativeBalance: "Depends on broker \u2014 not mandated locally",
  taxNote: "Oman has no personal income tax, including on trading profits.",
  localPayments: ["Bank Transfer", "Visa/Mastercard", "Local Bank Wire"],
  year: "2026", updatedDate: "March 31, 2026",
  brokersTested: 31, localBrokersTotal: 15, hoursResearch: 40,
  author: { name: "Aisha Al-Rashid", role: "Middle East Markets Analyst", exp: "12 years", initials: "AA", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "Best Forex Brokers in Oman for 2026 \u2014 Trusted & Tested",
  metaDescription: "We tested 15 forex brokers accepting Omani traders. These offer the best conditions including OMR accounts, Islamic swap-free options, and reliable withdrawals.",
  keyFinding: "Omani traders benefit from a tax-free trading environment but face limited local regulation for forex. Brokers regulated by FCA, ASIC, or CySEC scored highest in our analysis, offering stronger fund protections than locally registered alternatives.",

  brokers: [
    {
      rank: 1, slug: "ic-markets", badge: "Best Overall Oman", badgeColor: "#059669", localCurrencyMin: "$200", verdict: "Best overall for Omani traders. ASIC and CySEC regulated with ultra-tight ECN spreads and Islamic accounts.", localAdvantages: ["ASIC + CySEC regulated", "Raw ECN spreads from 0.0 pips", "Islamic (swap-free) accounts available", "MetaTrader 4, MT5, cTrader"], spreadBetting: false, localAccount: false, localRegRef: "AFSL 335692",
      countryReview: {
        paragraphs: [
          "IC Markets is our top pick for Omani traders due to its combination of ultra-tight raw spreads, ASIC regulation, and availability of Islamic swap-free accounts. With average EUR/USD spreads of 0.1 pips on the Raw Spread account, IC Markets offers institutional-grade pricing accessible to retail traders in Oman.",
          "For Muslim traders in Oman, IC Markets provides genuine swap-free accounts on both MT4 and MT5 platforms without widened spreads or hidden fees \u2014 a significant advantage over brokers that charge admin fees on Islamic accounts.",
          "The $200 minimum deposit is reasonable for the region, and IC Markets supports bank wire transfers commonly used in Oman. Withdrawal processing is typically completed within 1-2 business days."
        ],
        pros: ["Raw ECN spreads from 0.0 pips \u2014 lowest in our Oman test", "Genuine Islamic accounts without hidden fees", "ASIC + CySEC \u2014 dual Tier-1 regulation", "3 platforms: MT4, MT5, cTrader"],
        cons: ["No local Omani office or phone support", "USD accounts only \u2014 no OMR base currency"]
      },
    },
    {
      rank: 2, slug: "exness", badge: "Best for Leverage", badgeColor: "#6d28d9", localCurrencyMin: "$1", verdict: "Unlimited leverage and instant withdrawals make Exness popular among Omani traders.", localAdvantages: ["FCA + CySEC regulated", "Unlimited leverage available", "Instant withdrawal processing", "$1 minimum deposit", "Islamic accounts"], spreadBetting: false, localAccount: false, localRegRef: "FCA 730729",
      countryReview: {
        paragraphs: [
          "Exness has gained significant popularity among Omani traders thanks to its unlimited leverage offering and instant withdrawal system. For traders in Oman where leverage caps are not enforced by local regulation, Exness provides access to leverage levels well beyond what European-regulated entities permit.",
          "The $1 minimum deposit makes Exness the most accessible broker for new Omani traders. Combined with Islamic swap-free accounts and competitive spreads starting from 0.3 pips on Standard accounts, Exness offers strong value.",
          "Exness holds FCA and CySEC licenses, providing regulatory protections through its European entities. Omani traders should verify which entity they are onboarded to, as protections vary."
        ],
        pros: ["Unlimited leverage \u2014 highest in our Oman comparison", "Instant withdrawals \u2014 unique selling point", "$1 minimum deposit \u2014 lowest barrier to entry", "FCA + CySEC dual regulation"],
        cons: ["Unlimited leverage increases risk significantly", "Variable entity assignment \u2014 check your regulator"]
      },
    },
    {
      rank: 3, slug: "xm", badge: "Best for Beginners", badgeColor: "#2563eb", localCurrencyMin: "$5", verdict: "Excellent education, low entry barrier, and swap-free accounts suit beginner Omani traders.", localAdvantages: ["CySEC + ASIC regulated", "XM Academy education", "$5 minimum deposit", "Islamic accounts", "24/5 multilingual support"], spreadBetting: false, localAccount: false, localRegRef: "CySEC 120/10",
      countryReview: {
        paragraphs: [
          "XM stands out for Omani beginners with its comprehensive XM Academy education program and $5 minimum deposit. The learning resources include webinars, video tutorials, and market analysis \u2014 all accessible to traders in the MENA region.",
          "XM\u2019s Islamic swap-free accounts are available across all account types, and the broker offers Arabic-language customer support, making it particularly accessible for Omani traders who prefer Arabic communication.",
          "While XM\u2019s standard spreads of 1.6 pips on EUR/USD are wider than ECN alternatives, the focus on education and low barrier to entry makes it the best choice for traders starting their forex journey in Oman."
        ],
        pros: ["XM Academy \u2014 best education for beginners", "$5 minimum deposit \u2014 very low barrier", "Arabic-language support available", "Islamic accounts on all account types"],
        cons: ["Standard spreads wider than ECN alternatives", "No cTrader platform"]
      },
    },
    {
      rank: 4, slug: "pepperstone", badge: "Best Execution", badgeColor: "#059669", localCurrencyMin: "$0", verdict: "Triple Tier-1 regulation and fast execution for experienced Omani traders.", localAdvantages: ["FCA + ASIC + CySEC regulated", "$0 minimum deposit", "Fast execution under 40ms", "Islamic accounts", "cTrader + MT4 + MT5"], spreadBetting: false, localAccount: false, localRegRef: "FCA 684312",
      countryReview: {
        paragraphs: [
          "Pepperstone brings triple Tier-1 regulation (FCA, ASIC, CySEC) and some of the fastest execution speeds in the industry to Omani traders. The zero minimum deposit removes any financial barrier to entry.",
          "For experienced traders in Oman, Pepperstone\u2019s Razor account with raw spreads from 0.0 pips and $7/lot commission offers institutional-level pricing. Islamic swap-free accounts are available on request.",
          "Pepperstone\u2019s platform range (MT4, MT5, cTrader, TradingView) is among the most comprehensive available, giving Omani traders full flexibility in choosing their preferred trading environment."
        ],
        pros: ["Triple Tier-1 regulation \u2014 strongest in our comparison", "Zero minimum deposit", "Raw spreads from 0.0 pips on Razor", "4 platform options including TradingView"],
        cons: ["No local Omani office", "Razor account commission adds to costs for small trades"]
      },
    },
    {
      rank: 5, slug: "avatrade", badge: "Best Platform Range", badgeColor: "#f59e0b", localCurrencyMin: "$100", verdict: "AvaTrade offers unique tools like AvaProtect and strong platform diversity for Omani traders.", localAdvantages: ["Multi-regulated (CBI, ASIC, FSCA)", "AvaProtect risk management tool", "Islamic accounts", "AvaOptions for options trading", "Arabic support"], spreadBetting: false, localAccount: false, localRegRef: "CBI C53877",
      countryReview: {
        paragraphs: [
          "AvaTrade brings a unique combination of risk management tools and platform diversity to Omani traders. The AvaProtect feature allows traders to insure individual trades against losses for a premium \u2014 a feature unavailable at most competitors.",
          "For Omani traders interested in options, AvaTrade\u2019s AvaOptions platform provides vanilla options trading alongside standard forex CFDs. Islamic swap-free accounts are available, and Arabic-language support makes communication straightforward.",
          "The $100 minimum deposit is reasonable, and AvaTrade\u2019s multi-regulation across CBI, ASIC, and FSCA provides regulatory diversification. Spreads start from 0.9 pips on EUR/USD \u2014 not the tightest, but competitive for a market maker model."
        ],
        pros: ["AvaProtect \u2014 unique trade insurance feature", "AvaOptions for options trading", "Arabic customer support", "Multi-regulated with strong compliance"],
        cons: ["Market maker model \u2014 potential conflict of interest", "Spreads wider than ECN alternatives"]
      },
    },
  ],
};

export default data;
