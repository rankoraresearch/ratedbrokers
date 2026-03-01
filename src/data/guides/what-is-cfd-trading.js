export default {
  slug: "what-is-cfd-trading",
  meta: {
    title: "What Is CFD Trading? Complete Guide (2026) | RatedBrokers",
    description: "Learn what CFD trading is, how Contracts for Difference work, their advantages and risks, costs, and how to choose a CFD broker."
  },
  hero: {
    badge: "GUIDE",
    badgeColor: "#ecfdf5",
    badgeTextColor: "#059669",
    icon: "\uD83D\uDCC4",
    h1: "What Is CFD Trading? A Complete Guide for Beginners",
    subtitle: "Contracts for Difference let you speculate on price movements without owning the underlying asset. Here's everything you need to know."
  },
  author: "marcus-chen",
  updatedDate: "February 2026",
  readTime: "12 min read",
  category: "concepts",
  sections: [
    {
      id: "intro",
      title: null,
      paragraphs: [
        "A Contract for Difference (CFD) is a financial derivative that allows you to profit from price movements in stocks, forex, commodities, indices, and cryptocurrencies \u2014 without actually owning the underlying asset. Instead, you enter into a contract with your broker to exchange the difference in price between when you open and close the trade.",
        "CFDs are the backbone of retail forex and multi-asset trading. When you trade EUR/USD, gold, or the S&P 500 through most online brokers, you're trading CFDs. Understanding how they work is fundamental to becoming a successful retail trader."
      ]
    },
    {
      id: "how-cfds-work",
      title: "How CFDs Work: A Simple Example",
      paragraphs: [
        "Suppose you believe Apple stock will rise from its current price of $200. With traditional stock investing, you'd need $20,000 to buy 100 shares. With CFDs, you might only need $1,000 in margin (at 1:20 leverage), while gaining the same exposure to 100 shares' worth of price movement.",
        "If Apple rises to $210, your profit is the same as owning the shares: $10 \u00D7 100 = $1,000. But you only used $1,000 in margin, giving you a 100% return on your capital instead of a 5% return. The flip side: if Apple drops to $190, you lose $1,000 \u2014 your entire margin deposit.",
        "This leverage effect is both the greatest advantage and the greatest risk of CFD trading. It amplifies both profits and losses proportionally."
      ]
    },
    {
      id: "cfd-vs-ownership",
      title: "CFD Trading vs Owning the Asset",
      paragraphs: [
        "The fundamental difference between CFDs and traditional investing is ownership. With CFDs, you never own the underlying asset \u2014 no shares, no physical gold, no cryptocurrency in a wallet."
      ],
      comparisonCards: [
        {
          title: "CFD Trading",
          description: "Speculate on price movements with leverage.",
          pros: [
            "Trade with leverage (1:5 to 1:500)",
            "Profit from falling prices (short selling)",
            "Access thousands of markets from one account",
            "No ownership costs (storage, custody)",
            "Trade fractional amounts"
          ],
          cons: [
            "Overnight financing costs (swaps)",
            "No voting rights or dividends (usually)",
            "Higher risk due to leverage",
            "Banned in some countries (USA for stocks)",
            "62\u201382% of retail accounts lose money"
          ]
        },
        {
          title: "Traditional Investing",
          description: "Buy and own the actual asset.",
          pros: [
            "You own the asset outright",
            "Receive dividends and voting rights",
            "No overnight financing costs",
            "No leverage risk",
            "Suitable for long-term holding"
          ],
          cons: [
            "Full capital required (no leverage)",
            "Cannot profit from falling prices easily",
            "Limited to one asset class per account",
            "Custody and storage costs (crypto, gold)",
            "Market hours restrictions"
          ]
        }
      ]
    },
    {
      id: "markets",
      title: "Markets Available for CFD Trading",
      paragraphs: [
        "One of the biggest advantages of CFDs is the sheer range of markets accessible from a single trading account."
      ],
      table: {
        headers: ["Market", "Examples", "Typical Leverage (EU)", "Trading Hours"],
        rows: [
          ["Forex", "EUR/USD, GBP/JPY, USD/CAD", "1:30", "24/5"],
          ["Stock Indices", "S&P 500, FTSE 100, DAX 40", "1:20", "Near 24/5"],
          ["Individual Stocks", "Apple, Tesla, Amazon", "1:5", "Exchange hours"],
          ["Commodities", "Gold, Oil, Natural Gas", "1:10\u20131:20", "Near 24/5"],
          ["Cryptocurrencies", "BTC, ETH, SOL, XRP", "1:2", "24/7"],
          ["Bonds & Rates", "US 10-Year, Bund", "1:5", "Exchange hours"],
          ["ETFs", "SPY, QQQ, GLD", "1:5", "Exchange hours"]
        ]
      }
    },
    {
      id: "costs",
      title: "CFD Trading Costs Explained",
      paragraphs: [
        "CFD trading involves several cost components that traders must understand to accurately assess their profitability.",
        "The spread is the primary cost for most CFD traders \u2014 the difference between the buy (ask) and sell (bid) price. On EUR/USD, this might be 0.0\u20131.5 pips depending on your account type. On stock CFDs, it's usually slightly wider than the exchange spread.",
        "Commission applies on raw/ECN accounts (typically $3\u2013$7 per lot for forex) and on individual stock CFDs (usually 0.05\u20130.10% of the trade value). Not all brokers charge commission \u2014 many build their profit into the spread.",
        "Overnight financing (swap fees) is charged for holding CFD positions past the daily rollover time. This is essentially interest on the leveraged portion of your position. For a 1-lot EUR/USD position held overnight, this might be $3\u201310 depending on interest rate differentials. Short positions sometimes earn positive swap.",
        "Currency conversion fees apply when you trade assets denominated in a different currency from your account base currency. This is typically 0.3\u20130.7% and often overlooked by traders."
      ]
    },
    {
      id: "regulation-by-country",
      title: "CFD Regulation by Country",
      paragraphs: [
        "CFD regulation varies significantly around the world. Some countries embrace CFDs with protective frameworks, while others ban them entirely."
      ],
      table: {
        headers: ["Country/Region", "CFDs Allowed?", "Max Retail Leverage", "Key Restriction"],
        rows: [
          ["UK", "Yes", "1:30 (forex), 1:5 (stocks)", "Crypto CFDs banned for retail"],
          ["EU (MiFID II)", "Yes", "1:30 (forex), 1:2 (crypto)", "ESMA leverage caps since 2018"],
          ["Australia", "Yes", "1:30 (forex), 1:2 (crypto)", "ASIC leverage caps since 2021"],
          ["United States", "No (stocks/crypto)", "N/A", "Only forex CFDs via NFA brokers (1:50)"],
          ["Japan", "Yes", "1:25", "Strict licensing requirements"],
          ["Singapore", "Yes", "1:20", "MAS leverage restrictions"],
          ["South Africa", "Yes", "1:200+", "Less restrictive than EU/UK"],
          ["Hong Kong", "Yes", "1:20", "SFC regulated"]
        ]
      },
      warning: "Between 62% and 82% of retail CFD accounts lose money. This statistic is legally required on all EU and UK broker websites and reflects the genuine risk of leveraged trading."
    },
    {
      id: "risk-management",
      title: "Managing CFD Trading Risks",
      paragraphs: [
        "The leveraged nature of CFDs means that risk management isn't optional \u2014 it's essential for survival."
      ],
      numberedList: [
        "Never risk more than 1\u20132% of your account on a single trade. This means your stop loss should be positioned so that the maximum loss is 1\u20132% of your total equity.",
        "Always use stop losses. A trade without a stop loss has unlimited downside potential. Even 'safe' positions can be destroyed by unexpected news events.",
        "Understand the leverage you're using. Just because your broker offers 1:30 doesn't mean you should use it. Most professionals trade at effective leverage of 1:5 to 1:10.",
        "Account for overnight costs. If you're swing trading, calculate the daily swap cost and ensure it doesn't erode your potential profit.",
        "Start with a demo account. Practice your strategy with virtual funds until you're consistently profitable before risking real money."
      ]
    },
    {
      id: "choosing-broker",
      title: "How to Choose a CFD Broker",
      paragraphs: [
        "Selecting the right CFD broker is critical. At RatedBrokers, we evaluate brokers on regulation (Tier 1 licenses from FCA, ASIC, or CySEC are essential), trading costs (spreads, commissions, and swap fees), execution quality (speed and slippage), platform quality (charting tools, order types, mobile apps), and range of markets (how many CFD instruments are available).",
        "Our top-rated CFD brokers combine competitive pricing with strict regulation and excellent execution. We test every broker with real money accounts, executing 500+ trades to measure actual trading conditions."
      ]
    }
  ],
  faq: [
    { q: "What does CFD stand for?", a: "CFD stands for Contract for Difference. It's a financial derivative that lets you speculate on the price movement of an asset without owning it. You profit or lose based on the difference between the opening and closing price of your position." },
    { q: "Can you lose more than your deposit with CFDs?", a: "With Tier 1 regulated brokers (FCA, ASIC, CySEC), negative balance protection means you cannot lose more than your deposit. With unregulated brokers, theoretically yes \u2014 which is another reason to only trade with properly regulated brokers." },
    { q: "Are CFDs legal in the United States?", a: "Stock and commodity CFDs are not available to US residents. However, forex trading through NFA-registered brokers uses a similar structure. US traders can trade forex with up to 1:50 leverage through regulated brokers like OANDA and IG US." },
    { q: "What is the minimum amount to start CFD trading?", a: "Many brokers offer CFD accounts with minimums of $0\u2013$200. However, we recommend starting with at least $500\u2013$1,000 to have sufficient margin for proper position sizing and risk management." },
    { q: "Do I have to pay tax on CFD profits?", a: "Tax treatment varies by country. In the UK, CFD profits are subject to Capital Gains Tax but exempt from Stamp Duty. In Australia, they're taxed as income or capital gains. In some jurisdictions, spread betting (similar to CFDs) is tax-free. Always consult a tax professional." },
    { q: "How are CFDs different from spread betting?", a: "CFDs and spread betting are functionally similar \u2014 both are leveraged derivatives. The key difference is tax treatment: in the UK, spread betting profits are typically tax-free, while CFD profits are subject to Capital Gains Tax. Spread betting is only available in the UK and Ireland." },
    { q: "Can I hold CFDs long-term?", a: "You can, but overnight financing costs accumulate. For a leveraged position held for weeks or months, swap fees can significantly reduce profits. CFDs are best suited for short to medium-term trading (minutes to days). For long-term exposure, consider unleveraged investing." },
    { q: "What platforms support CFD trading?", a: "The most popular CFD trading platforms are MetaTrader 4, MetaTrader 5, cTrader, and TradingView. Most major brokers offer at least one of these alongside their own proprietary platforms." }
  ],
  relatedGuides: ["what-is-forex-trading", "what-is-leverage", "risk-management-guide", "forex-vs-stocks"],
  relatedRankings: [
    { label: "Best Forex Brokers 2026", path: "/best-forex-brokers" },
    { label: "Best Crypto Brokers", path: "/best-crypto-brokers" },
    { label: "Best for Beginners", path: "/best-forex-brokers-for-beginners" }
  ]
};
