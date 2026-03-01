export default {
  slug: "what-is-a-pip",
  meta: {
    title: "What Is a Pip in Forex? Calculation Guide 2026 | RatedBrokers",
    description: "Learn what a pip is in forex trading, how to calculate pip values for any currency pair and lot size, and why pips directly impact your trading costs."
  },
  hero: {
    badge: "GUIDE",
    badgeColor: "#ecfdf5",
    badgeTextColor: "#059669",
    icon: "bar-chart-3",
    h1: "What Is a Pip in Forex?",
    subtitle: "Master the fundamental unit of price measurement in forex — understand pip values, pip calculations, and how pips determine your profit, loss, and trading costs."
  },
  author: "marcus-chen",
  updatedDate: "February 2026",
  readTime: "11 min read",
  category: "getting-started",
  sections: [
    {
      id: "intro",
      title: null,
      paragraphs: [
        "If you have spent any time researching forex trading, you have encountered the term \"pip\" countless times. Pips are the standard unit of measurement for price changes in the currency market, and understanding them is not optional — it is foundational. Every aspect of forex trading, from spread costs to position sizing to profit and loss calculations, revolves around pips.",
        "This guide will give you a complete understanding of pips: what they are, how to calculate their value for any currency pair and lot size, the difference between pips and pipettes, and why pip values directly determine whether your trading is profitable after costs."
      ]
    },
    {
      id: "pip-definition",
      title: "What Exactly Is a Pip?",
      paragraphs: [
        "A pip — short for \"percentage in point\" or \"price interest point\" — is the smallest standard unit of price movement in a forex currency pair. For most currency pairs, a pip is equal to 0.0001, or one ten-thousandth of a unit. This is the fourth decimal place in the price quote.",
        "For example, if EUR/USD moves from 1.0850 to 1.0851, that is a one-pip movement. If GBP/USD moves from 1.2700 to 1.2735, that is a 35-pip movement. Each of those tiny increments is one pip.",
        "The major exception is currency pairs involving the Japanese yen (JPY). Because the yen is valued at roughly 1/100th of most major currencies, JPY pairs are quoted to two decimal places instead of four. For JPY pairs, one pip equals 0.01. So if USD/JPY moves from 150.50 to 150.75, that is a 25-pip movement."
      ]
    },
    {
      id: "pip-calculation",
      title: "How to Calculate Pip Value",
      paragraphs: [
        "The monetary value of a pip depends on three factors: the currency pair you are trading, the size of your position (lot size), and the exchange rate. The formula for calculating pip value is straightforward.",
        "For pairs where USD is the quote currency (e.g., EUR/USD, GBP/USD): Pip Value = (0.0001 / Exchange Rate) x Lot Size in units. However, since the quote currency is USD, the calculation simplifies to: Pip Value = 0.0001 x Lot Size. For a standard lot (100,000 units), that gives you $10 per pip. For a mini lot (10,000 units), it is $1 per pip. For a micro lot (1,000 units), it is $0.10 per pip.",
        "For pairs where USD is the base currency (e.g., USD/JPY, USD/CHF), you need to convert: Pip Value = (0.0001 / Quote Currency Rate) x Lot Size. For USD/JPY, since pips are measured at 0.01, the formula becomes: Pip Value = (0.01 / USD/JPY Rate) x Lot Size.",
        "For cross pairs (no USD involved, e.g., EUR/GBP), calculate the pip value in the quote currency first, then convert to your account currency using the current exchange rate."
      ],
      tip: {
        icon: "lightbulb",
        title: "Pro Tip",
        text: "Most trading platforms calculate pip values automatically in real time. You do not need to do manual calculations for every trade. However, understanding the math ensures you can verify position sizing and never accidentally risk more than intended."
      }
    },
    {
      id: "pip-vs-pipette",
      title: "Pip vs. Pipette: What Is the Difference?",
      paragraphs: [
        "Many modern brokers quote prices with an extra decimal place beyond the standard pip. This fifth decimal place (or third for JPY pairs) is called a pipette, also known as a fractional pip or point. A pipette is one-tenth of a pip.",
        "For example, a broker may quote EUR/USD at 1.08501 instead of 1.0850. That final \"1\" is a pipette. If the price moves from 1.08501 to 1.08516, it has moved 1.5 pips (or 15 pipettes). Pipettes provide more granular pricing, which is especially important for traders using tight stop-losses or for brokers offering raw ECN spreads that frequently fall below one full pip.",
        "When comparing spreads across brokers, pay attention to whether they are quoting in pips or pipettes. A broker advertising a \"3-point spread\" on EUR/USD may mean 3 pipettes (0.3 pips), not 3 full pips. This distinction can cause significant confusion and miscomparison if overlooked."
      ]
    },
    {
      id: "pip-value-table",
      title: "Pip Value by Lot Size Across Major Pairs",
      paragraphs: [
        "The table below shows the approximate pip value in US dollars for the most commonly traded currency pairs at each standard lot size. These values are approximate because they fluctuate slightly with the exchange rate, but they provide a reliable reference for position sizing."
      ],
      table: {
        headers: ["Currency Pair", "Standard Lot (100K)", "Mini Lot (10K)", "Micro Lot (1K)", "Nano Lot (100)"],
        rows: [
          ["EUR/USD", "$10.00", "$1.00", "$0.10", "$0.01"],
          ["GBP/USD", "$10.00", "$1.00", "$0.10", "$0.01"],
          ["AUD/USD", "$10.00", "$1.00", "$0.10", "$0.01"],
          ["NZD/USD", "$10.00", "$1.00", "$0.10", "$0.01"],
          ["USD/JPY*", "~$6.60", "~$0.66", "~$0.066", "~$0.0066"],
          ["USD/CHF*", "~$11.15", "~$1.115", "~$0.1115", "~$0.01115"],
          ["USD/CAD*", "~$7.25", "~$0.725", "~$0.0725", "~$0.00725"],
          ["EUR/GBP**", "~£7.85 (~$10.00)", "~£0.785 (~$1.00)", "~£0.0785 (~$0.10)", "~£0.00785 (~$0.01)"]
        ]
      },
      paragraphs: [
        "* Values for pairs where USD is the base currency vary with the current exchange rate. The figures above are approximations at typical 2026 rates.",
        "** Cross pair pip values are first calculated in the quote currency, then converted to USD (or your account currency) at the prevailing rate."
      ]
    },
    {
      id: "calculation-examples",
      title: "Pip Calculation Examples in Practice",
      paragraphs: [
        "Let us work through three practical examples to cement your understanding of pip calculations in real trading scenarios."
      ],
      numberedList: [
        "EUR/USD Long Trade — You buy 1 mini lot (10,000 units) of EUR/USD at 1.0850 and close at 1.0890. The price moved 40 pips in your favor. Since each pip on a mini lot of EUR/USD is worth $1.00, your profit is 40 x $1.00 = $40.00.",
        "USD/JPY Short Trade — You sell 1 standard lot (100,000 units) of USD/JPY at 151.50 and close at 151.20. The price moved 30 pips in your favor. Pip value = (0.01 / 151.20) x 100,000 = $6.61 per pip. Your profit is 30 x $6.61 = $198.30.",
        "GBP/USD Risk Calculation — You want to risk exactly $50 on a GBP/USD trade with a 25-pip stop-loss. You need to determine the correct lot size. Required pip value = $50 / 25 pips = $2 per pip. Since a mini lot on GBP/USD is $1 per pip, you need 2 mini lots (0.2 standard lots or 20,000 units) to match your desired risk."
      ],
      tip: {
        icon: "lightbulb",
        title: "Pro Tip",
        text: "Use the pip value calculation in reverse for position sizing. Decide how much money you are willing to risk, set your stop-loss in pips, then calculate the exact lot size that keeps your risk at the desired dollar amount. This is the foundation of professional risk management."
      }
    },
    {
      id: "pips-and-costs",
      title: "Why Pips Matter for Your Trading Costs",
      paragraphs: [
        "Every time you open a trade, you pay the spread — the difference between the bid and ask price — measured in pips. This is your primary transaction cost in forex. Understanding pip values allows you to translate abstract spread numbers into concrete dollar amounts.",
        "If a broker quotes a 1.2-pip spread on EUR/USD and you trade 1 standard lot, your immediate cost is 1.2 x $10 = $12.00. On a commission-based ECN account with a 0.2-pip raw spread and $7 commission per round trip, your total cost is (0.2 x $10) + $7 = $9.00. The ECN account is cheaper by $3 per trade in this scenario.",
        "For active traders executing 10–20 trades per day, this difference adds up rapidly. Ten trades per day at $3 savings each equals $30 daily, or roughly $600 per month. Over a year, that is $7,200 — a material impact on your bottom line. This is why serious traders obsess over pip costs and why our broker rankings include verified spread measurements.",
        "Pip understanding also determines your position sizing. Professional traders use the \"risk per pip\" approach to calculate exactly how many lots to trade so that their stop-loss distance translates to a fixed percentage of their account. Without understanding pip values, proper position sizing is impossible."
      ]
    },
    {
      id: "advanced-considerations",
      title: "Advanced Pip Considerations",
      paragraphs: [
        "As you progress in your trading, there are several nuances around pips that become increasingly important.",
        "Spread widening during news events and low-liquidity periods can increase your pip costs by 5x to 20x. A pair that normally has a 0.8-pip spread might widen to 5–10 pips during Non-Farm Payrolls or central bank announcements. Factor this into your strategy if you trade around major economic releases.",
        "Slippage, which is the difference between your requested price and your actual fill price, is also measured in pips. A stop-loss set at a specific level might execute 1–3 pips worse during volatile conditions. Account for potential slippage when calculating your maximum risk per trade.",
        "Different account currencies affect your pip value conversion. If your account is denominated in EUR but you are trading a USD-quoted pair, your platform converts the pip value at the current EUR/USD rate. This means your actual pip value in your account currency fluctuates, adding another variable to your position sizing."
      ]
    },
    {
      id: "bottom-line",
      title: "The Bottom Line",
      paragraphs: [
        "Pips are the language of forex trading. They measure price movements, define your trading costs, determine your position sizing, and calculate your profit and loss. While most modern platforms handle pip calculations automatically, understanding the underlying math gives you a critical edge in cost management and risk control.",
        "Now that you understand pips, explore how they interact with leverage (which amplifies pip values) and spreads (which are your direct pip costs per trade) to build a complete understanding of forex trading mechanics."
      ]
    }
  ],
  faq: [
    { q: "What is a pip in forex trading?", a: "A pip (percentage in point) is the smallest standard unit of price movement in forex. For most pairs, it equals 0.0001 (the fourth decimal place). For Japanese yen pairs, a pip equals 0.01 (the second decimal place)." },
    { q: "How much is 1 pip worth?", a: "The value of 1 pip depends on the lot size and currency pair. For EUR/USD, 1 pip equals $10 per standard lot (100,000 units), $1 per mini lot (10,000 units), and $0.10 per micro lot (1,000 units)." },
    { q: "What is the difference between a pip and a pipette?", a: "A pipette is one-tenth of a pip. It is the fifth decimal place for most pairs (third for JPY pairs). Many brokers use pipettes for more precise pricing, especially on ECN accounts with sub-pip spreads." },
    { q: "How do I calculate pips in a trade?", a: "Subtract the entry price from the exit price (for a long trade) and divide by the pip size (0.0001 for most pairs, 0.01 for JPY pairs). Multiply the number of pips by the pip value per lot to get your profit or loss in dollars." },
    { q: "Why are pips different for JPY pairs?", a: "JPY pairs use 0.01 as the pip size because the Japanese yen is valued at roughly 1/100th of most major currencies. This different convention has been standard in forex since the market's inception." },
    { q: "How many pips per day do professional traders make?", a: "This varies enormously by strategy. Scalpers might target 5–15 pips per trade across many trades. Day traders might target 20–50 pips on fewer trades. The number of pips is less important than the risk-adjusted return relative to your stop-loss." },
    { q: "What is a good spread in pips for EUR/USD?", a: "For EUR/USD, a raw spread of 0.0–0.3 pips (on ECN accounts with separate commission) or an all-in spread of 0.8–1.2 pips (on commission-free accounts) is competitive. Anything above 1.5 pips is considered expensive by 2026 standards." },
    { q: "Do pips work the same way for crypto and stocks?", a: "Not exactly. While the concept of minimum price increments exists in all markets (called ticks in futures, cents in stocks), the term pip is specific to forex. Crypto exchanges use different decimal conventions depending on the asset." },
    { q: "Can I lose more than my deposit due to pip movements?", a: "With leverage, large pip movements against your position can potentially exceed your deposit. However, most Tier 1 regulated brokers offer negative balance protection, which prevents your account from going below zero." },
    { q: "How do pips relate to position sizing?", a: "Pips are essential for position sizing. You calculate the required lot size by dividing your desired risk (in dollars) by the product of your stop-loss (in pips) and the pip value per lot. This ensures every trade risks a consistent percentage of your account." }
  ],
  relatedGuides: ["what-is-leverage", "understanding-spreads-and-fees", "what-is-forex-trading"],
  relatedRankings: [
    { label: "Lowest Spread Brokers", path: "/lowest-spread-forex-brokers" },
    { label: "Best Micro Account Brokers", path: "/best-micro-account-forex-brokers" }
  ]
};
