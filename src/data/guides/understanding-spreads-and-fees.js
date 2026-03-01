export default {
  slug: "understanding-spreads-and-fees",
  meta: {
    title: "Forex Spreads Explained: Complete Fee Guide 2026 | RatedBrokers",
    description: "Understand forex spreads, commissions, swap fees, and hidden costs. Compare fixed vs variable spreads and learn how to minimize your total trading expenses."
  },
  hero: {
    badge: "GUIDE",
    badgeColor: "#ecfdf5",
    badgeTextColor: "#059669",
    icon: "dollar-sign",
    h1: "Understanding Forex Spreads and Fees",
    subtitle: "Every pip of spread is money out of your pocket. Learn to identify, compare, and minimize the true costs of forex trading across different broker models."
  },
  author: "marcus-chen",
  updatedDate: "February 2026",
  readTime: "14 min read",
  category: "concepts",
  sections: [
    {
      id: "intro",
      title: null,
      paragraphs: [
        "The difference between a profitable forex trader and a breakeven one often comes down to costs. Spreads, commissions, and fees silently erode your returns on every single trade, and over the course of hundreds or thousands of trades per year, these costs compound into a staggering sum. A trader generating 500 pips of profit per month could see 30–40% of that profit consumed by trading costs if they are not paying attention.",
        "This guide breaks down every cost component in forex trading — from the spread you see on your screen to the hidden fees buried in terms and conditions. By the end, you will know exactly how to calculate your all-in trading costs and how to choose broker account types that minimize them."
      ]
    },
    {
      id: "what-is-a-spread",
      title: "What Is a Spread in Forex?",
      paragraphs: [
        "The spread is the difference between the bid price (the price at which you can sell) and the ask price (the price at which you can buy) of a currency pair. It is quoted in pips and represents the immediate cost of entering a trade.",
        "When you open a buy (long) position on EUR/USD quoted at 1.0850 / 1.0852, you enter at the ask price of 1.0852. If you immediately closed the trade, you would sell at the bid price of 1.0850, resulting in a 2-pip loss. This 2-pip spread is the broker's implicit charge for facilitating your trade.",
        "The spread exists because market makers and liquidity providers build their profit margin into the difference between what they will buy and sell currency for. Think of it like a currency exchange booth at an airport — they buy euros from you at one rate and sell them to you at a higher rate. The gap between those rates is how they make money."
      ]
    },
    {
      id: "fixed-vs-variable",
      title: "Fixed Spreads vs. Variable Spreads",
      paragraphs: [
        "Brokers offer two primary spread models, each with distinct advantages and trade-offs. The right choice depends on your trading style, preferred market hours, and tolerance for uncertainty."
      ],
      comparisonCards: [
        {
          title: "Fixed Spread Accounts",
          description: "The spread remains constant regardless of market conditions. Common with market maker brokers.",
          pros: [
            "Predictable trading costs — you know exactly what you will pay before entering",
            "No spread widening during news events or low-liquidity periods",
            "Easier to calculate position sizing and risk",
            "Better for beginners who need cost certainty"
          ],
          cons: [
            "Generally wider than variable spreads during normal market conditions",
            "Broker may requote during extreme volatility instead of widening",
            "Often indicate a dealing desk (market maker) model where the broker takes the opposite side",
            "Typically not available on ECN/STP account types"
          ]
        },
        {
          title: "Variable Spread Accounts",
          description: "The spread fluctuates based on market liquidity and volatility. Standard with ECN/STP brokers.",
          pros: [
            "Tighter spreads during peak liquidity hours (London/NY overlap)",
            "ECN raw spreads can drop to 0.0 pips on major pairs",
            "Direct market access with no dealing desk intervention",
            "Better for high-frequency and scalping strategies"
          ],
          cons: [
            "Spreads can widen dramatically during news events (5–20x normal)",
            "Unpredictable costs make exact risk calculation harder",
            "ECN accounts typically add a per-lot commission on top of the spread",
            "Low-liquidity sessions (late US/early Asia) often see wider spreads"
          ]
        }
      ]
    },
    {
      id: "commission-vs-spread",
      title: "Commission-Based vs. Spread-Only Accounts",
      paragraphs: [
        "Beyond the fixed/variable distinction, brokers structure their pricing in two fundamental ways: spread-only accounts and commission-based accounts. Understanding the total cost of each model is essential for choosing the right account type.",
        "Spread-only accounts embed all costs within the spread markup. There is no separate commission charge, which makes cost tracking simple. However, the spread is wider than what the broker receives from its liquidity providers because the markup is built in.",
        "Commission-based accounts (often called Raw, ECN, or Zero accounts) pass through near-raw interbank spreads and charge a fixed commission per lot traded. The commission is usually $5–$7 per standard lot per round trip (buy and sell). The total cost is often lower than spread-only accounts, but you need to account for both components."
      ],
      table: {
        headers: ["Cost Component", "Spread-Only Account", "Commission-Based (ECN)", "Difference"],
        rows: [
          ["EUR/USD Spread", "1.0–1.4 pips", "0.0–0.3 pips", "ECN spread much tighter"],
          ["Commission", "$0", "$6–$7 per lot round trip", "Only ECN has commission"],
          ["Total Cost (1 lot EUR/USD)", "$10–$14", "$6–$10", "ECN usually cheaper"],
          ["GBP/USD Spread", "1.2–1.8 pips", "0.2–0.5 pips", "ECN significantly tighter"],
          ["Total Cost (1 lot GBP/USD)", "$12–$18", "$8–$12", "ECN usually cheaper"],
          ["USD/JPY Spread", "1.0–1.5 pips", "0.1–0.4 pips", "ECN tighter"],
          ["Total Cost (1 lot USD/JPY)", "$6.60–$9.90", "$4.60–$7.60", "ECN usually cheaper"]
        ]
      },
      tip: {
        icon: "lightbulb",
        title: "Pro Tip",
        text: "If you trade more than 5 lots per day, a commission-based ECN account will almost certainly save you money over a spread-only account. Calculate your monthly trading volume and compare the all-in cost at both account types before deciding."
      }
    },
    {
      id: "swap-fees",
      title: "Swap and Overnight Fees",
      paragraphs: [
        "Swap fees (also called rollover fees) are charges or credits applied when you hold a position overnight past the daily rollover time, typically 5 PM New York time. Swaps exist because forex trading involves two currencies with different interest rates, and holding a leveraged position is effectively borrowing one currency to buy another.",
        "If you buy a pair where the base currency has a higher interest rate than the quote currency, you may receive a positive swap (a small credit). If the base currency's interest rate is lower, you pay a negative swap. In practice, most swap rates are negative for retail traders because brokers add a markup.",
        "Swap rates are expressed in pips or dollars per standard lot and are applied for each night a position is held. On Wednesday nights, a triple swap is charged to account for the weekend settlement. For traders holding positions for weeks or months, swap fees can accumulate into a significant cost — or occasionally a benefit.",
        "Islamic (swap-free) accounts are offered by many brokers for traders who cannot pay or receive interest for religious reasons. These accounts typically eliminate swap charges but may impose a fixed administration fee after positions are held beyond a certain number of days."
      ]
    },
    {
      id: "deposit-withdrawal-fees",
      title: "Deposit and Withdrawal Fees",
      paragraphs: [
        "While spreads and commissions are the primary ongoing costs, deposit and withdrawal fees can catch traders off guard, especially with certain payment methods or smaller account sizes.",
        "Most reputable brokers do not charge fees for deposits via bank transfer or major credit/debit cards. However, some brokers charge percentage-based fees for certain e-wallet deposits (Skrill, Neteller) or pass through the payment processor's fees. Withdrawal fees are more common and can range from $0 at the best brokers to $25–$50 per transaction at others.",
        "Wire transfers almost always incur fees — typically $15–$30 from the broker's bank, plus any intermediary bank charges. For small accounts, a single $30 wire transfer fee on a $500 account is a 6% cost that needs to be recovered through trading before you break even."
      ],
      list: [
        "Bank Wire Transfer — Most common for large amounts. Expect $15–$30 in fees per withdrawal. Processing takes 1–5 business days.",
        "Credit/Debit Cards — Usually free for deposits; withdrawals return to the same card. Processing takes 1–5 business days.",
        "E-Wallets (Skrill, Neteller, PayPal) — Fast processing (same day to 24 hours). Some brokers charge 1–2% on e-wallet transactions.",
        "Cryptocurrency — Increasingly offered. Low fees but limited to select brokers. Processing varies from minutes to hours depending on network congestion."
      ]
    },
    {
      id: "hidden-costs",
      title: "Hidden Costs to Watch For",
      paragraphs: [
        "Beyond the obvious costs, several less visible charges can impact your bottom line. Being aware of these ensures no unpleasant surprises."
      ],
      list: [
        "Inactivity Fees — Many brokers charge $10–$15 per month after 3–12 months of no trading activity. If you stop trading temporarily, check whether your broker will drain your balance while you are away.",
        "Currency Conversion Fees — If your account is in USD but you deposit in EUR, the broker converts your deposit at an exchange rate that includes a markup (typically 0.5–1.5%). This is a one-time cost but can be significant on large deposits.",
        "Guaranteed Stop-Loss Fees — Some brokers offer guaranteed stop-loss orders that will execute at exactly your specified price regardless of market gaps. This insurance comes at a cost, usually an additional 1–3 pips on the spread.",
        "Data Feed Fees — While most forex data is free, some brokers charge for premium data feeds, Level 2 pricing, or access to their full range of market analysis tools.",
        "Slippage — Not technically a fee, but slippage (execution at a worse price than requested) is a real cost. During volatile markets, slippage of 1–5 pips is common and should be factored into your cost analysis.",
        "Account Maintenance Fees — Rare among competitive brokers, but some charge monthly or annual maintenance fees for live accounts, particularly for premium account tiers."
      ],
      warning: "Always read the full fee schedule on the broker's website before opening an account. If the fee schedule is not easily accessible or clearly written, treat that as a red flag. Transparent brokers make their costs easy to find and understand."
    },
    {
      id: "how-we-measure",
      title: "How We Measure Spreads at RatedBrokers",
      paragraphs: [
        "At RatedBrokers, we do not rely on broker-reported spreads. We measure them independently using real-money accounts during actual trading conditions. Our methodology ensures that the spread data in our rankings reflects what you will actually experience as a trader.",
        "We record tick-by-tick spread data on major, minor, and exotic pairs across multiple trading sessions over a minimum two-week period. We calculate the average spread, the median spread, and the 95th percentile spread (the worst spread you would experience 5% of the time). We also measure spreads specifically during high-impact news events to show how much spreads widen during volatility.",
        "This data is published in our broker reviews and comparison tables, allowing you to make cost comparisons based on real-world conditions rather than the best-case scenario figures that brokers prefer to advertise. When we say a broker offers a 0.8-pip average spread on EUR/USD, that is a verified number from our own testing."
      ]
    },
    {
      id: "bottom-line",
      title: "The Bottom Line",
      paragraphs: [
        "Trading costs are the one variable in forex that you can control with certainty. You cannot control market direction, volatility, or news events — but you can choose a broker and account type that minimizes the toll extracted from every trade.",
        "For most active traders, a commission-based ECN account with raw spreads will deliver the lowest all-in costs. For casual or beginner traders, a competitive spread-only account with no commission simplifies cost tracking. Regardless of which model you choose, the key is to calculate your total cost per trade and compare it across multiple brokers before making a commitment."
      ]
    }
  ],
  faq: [
    { q: "What is a spread in forex?", a: "The spread is the difference between the bid (sell) and ask (buy) price of a currency pair, measured in pips. It is the primary cost of trading forex and is how most brokers generate revenue." },
    { q: "What is a good spread for EUR/USD?", a: "A competitive EUR/USD spread is 0.0–0.3 pips on a raw ECN account (with commission) or 0.8–1.2 pips on a standard spread-only account. Anything above 1.5 pips for EUR/USD is considered expensive." },
    { q: "Is it better to have fixed or variable spreads?", a: "Variable spreads are generally cheaper during peak trading hours and preferred by active traders. Fixed spreads offer cost predictability and are better for traders who want consistent costs or trade during low-liquidity periods." },
    { q: "What are swap fees in forex?", a: "Swap fees are overnight holding charges applied when you keep a position open past the daily rollover time. They are based on the interest rate differential between the two currencies in the pair, plus a broker markup." },
    { q: "Why do spreads widen during news events?", a: "During major news releases, liquidity providers widen their quotes to compensate for increased uncertainty and the risk of being caught on the wrong side of a large price move. This reduced liquidity and higher risk translates directly into wider spreads." },
    { q: "How do I calculate my total trading cost?", a: "Total Cost = (Spread in pips x Pip Value) + Commission (if any) + Swap (if holding overnight). For example, a 0.3-pip spread on 1 lot EUR/USD = $3, plus $7 commission round trip = $10 total per trade." },
    { q: "Are ECN brokers always cheaper?", a: "For active traders, ECN brokers with raw spreads plus commission are usually cheaper. However, for very small accounts or very low-frequency traders, the per-lot commission can offset the spread advantage. Calculate based on your specific trading volume." },
    { q: "Do all brokers charge withdrawal fees?", a: "No. Many competitive brokers offer free withdrawals via e-wallets and credit cards, though bank wire withdrawals often carry a $15–$30 fee. Always check the broker's fee schedule before depositing." },
    { q: "What is slippage and does it cost me money?", a: "Slippage is when your order executes at a different price than requested, usually during volatile markets. Positive slippage (better price) is possible but negative slippage (worse price) is more common and adds to your effective trading costs." },
    { q: "How can I minimize my forex trading costs?", a: "Trade during peak liquidity hours (London/NY overlap), use a competitive ECN account, trade major pairs with tight spreads, avoid holding positions through high-impact news events, and choose a broker with verified low spreads based on independent measurement." },
    { q: "What is a zero spread account?", a: "Zero spread accounts advertise spreads starting from 0.0 pips but always charge a per-lot commission. The total cost (spread + commission) determines whether these accounts are truly cheaper. Compare the all-in cost, not just the headline spread." }
  ],
  relatedGuides: ["ecn-vs-market-maker", "what-is-a-pip", "how-to-choose-a-forex-broker"],
  relatedRankings: [
    { label: "Lowest Spread Brokers", path: "/lowest-spread-forex-brokers" },
    { label: "Zero Spread Brokers", path: "/zero-spread-forex-brokers" }
  ]
};
