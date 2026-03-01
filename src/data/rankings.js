/**
 * Master list of all thematic broker rankings for RatedBrokers.com
 * Each entry = one landing page targeting a specific search query cluster.
 * Total: 207 pages
 *
 * Fields:
 *   id        — unique identifier
 *   slug      — URL path (SEO-optimized, matches primary search query)
 *   title     — H1 / page title (without year — year added dynamically)
 *   category  — section for navigation grouping
 *   sub       — sub-category for mega menu / sidebar
 *   priority  — 1 (money page), 2 (high value), 3 (long tail)
 *   icon      — emoji for menu/UI
 */

const RANKINGS = [

  // ═══════════════════════════════════════════════════════════════
  // A. FOREX BROKERS — BY TRADING STYLE & EXPERIENCE (18)
  // ═══════════════════════════════════════════════════════════════
  { id: "forex-overall",          slug: "/best-forex-brokers",                        title: "Best Forex Brokers",                            category: "forex", sub: "top",       priority: 1, icon: "\ud83c\udfc6" },
  { id: "forex-beginners",        slug: "/best-forex-brokers-for-beginners",          title: "Best Forex Brokers for Beginners",               category: "forex", sub: "style",     priority: 1, icon: "\ud83d\udfe2" },
  { id: "forex-professionals",    slug: "/best-forex-brokers-for-professionals",      title: "Best Forex Brokers for Professionals",            category: "forex", sub: "style",     priority: 2, icon: "\ud83d\udc54" },
  { id: "forex-scalping",         slug: "/best-forex-brokers-for-scalping",           title: "Best Forex Brokers for Scalping",                 category: "forex", sub: "style",     priority: 1, icon: "\ud83c\udfaf" },
  { id: "forex-day-trading",      slug: "/best-forex-brokers-for-day-trading",        title: "Best Forex Brokers for Day Trading",              category: "forex", sub: "style",     priority: 1, icon: "\u2600\ufe0f" },
  { id: "forex-swing-trading",    slug: "/best-forex-brokers-for-swing-trading",      title: "Best Forex Brokers for Swing Trading",            category: "forex", sub: "style",     priority: 2, icon: "\ud83d\udcc8" },
  { id: "forex-position-trading", slug: "/best-forex-brokers-for-position-trading",   title: "Best Forex Brokers for Position Trading",         category: "forex", sub: "style",     priority: 3, icon: "\ud83d\udcc5" },
  { id: "forex-hedging",          slug: "/best-forex-brokers-for-hedging",            title: "Best Forex Brokers for Hedging",                  category: "forex", sub: "style",     priority: 2, icon: "\ud83d\udee1\ufe0f" },
  { id: "forex-news-trading",     slug: "/best-forex-brokers-for-news-trading",       title: "Best Forex Brokers for News Trading",             category: "forex", sub: "style",     priority: 3, icon: "\ud83d\udcf0" },
  { id: "forex-automated",        slug: "/best-forex-brokers-for-automated-trading",  title: "Best Forex Brokers for Automated Trading",        category: "forex", sub: "style",     priority: 2, icon: "\ud83e\udd16" },
  { id: "forex-algo",             slug: "/best-forex-brokers-for-algo-trading",       title: "Best Forex Brokers for Algorithmic Trading",      category: "forex", sub: "style",     priority: 2, icon: "\ud83d\udda5\ufe0f" },
  { id: "forex-hft",              slug: "/best-high-frequency-trading-brokers",       title: "Best High-Frequency Trading Brokers",             category: "forex", sub: "style",     priority: 3, icon: "\u26a1" },
  { id: "forex-copy-trading",     slug: "/best-copy-trading-platforms",               title: "Best Copy Trading Platforms",                     category: "forex", sub: "style",     priority: 1, icon: "\ud83d\udccb" },
  { id: "forex-social-trading",   slug: "/best-social-trading-platforms",             title: "Best Social Trading Platforms",                   category: "forex", sub: "style",     priority: 2, icon: "\ud83e\udd1d" },
  { id: "forex-signals",          slug: "/best-forex-signal-providers",               title: "Best Forex Signal Providers",                     category: "forex", sub: "style",     priority: 2, icon: "\ud83d\udce1" },
  { id: "forex-ea",               slug: "/best-forex-brokers-for-expert-advisors",    title: "Best Forex Brokers for Expert Advisors (EA)",     category: "forex", sub: "style",     priority: 3, icon: "\u2699\ufe0f" },
  { id: "forex-grid",             slug: "/best-forex-brokers-for-grid-trading",       title: "Best Forex Brokers for Grid Trading",             category: "forex", sub: "style",     priority: 3, icon: "\ud83d\uddf2\ufe0f" },
  { id: "forex-carry",            slug: "/best-forex-brokers-for-carry-trading",      title: "Best Forex Brokers for Carry Trading",            category: "forex", sub: "style",     priority: 3, icon: "\ud83d\udcb1" },

  // ═══════════════════════════════════════════════════════════════
  // B. BY SPREADS & COSTS (12)
  // ═══════════════════════════════════════════════════════════════
  { id: "low-spread",         slug: "/lowest-spread-forex-brokers",              title: "Lowest Spread Forex Brokers",                  category: "forex", sub: "costs",    priority: 1, icon: "\ud83d\udcc9" },
  { id: "zero-spread",        slug: "/zero-spread-forex-brokers",                title: "Zero Spread Forex Brokers",                    category: "forex", sub: "costs",    priority: 2, icon: "\u0030\ufe0f\u20e3" },
  { id: "low-commission",     slug: "/lowest-commission-forex-brokers",          title: "Lowest Commission Forex Brokers",              category: "forex", sub: "costs",    priority: 2, icon: "\ud83d\udcb2" },
  { id: "low-cost",           slug: "/best-low-cost-forex-brokers",              title: "Best Low Cost Forex Brokers",                  category: "forex", sub: "costs",    priority: 2, icon: "\ud83d\udcb5" },
  { id: "no-hidden-fees",     slug: "/forex-brokers-no-hidden-fees",             title: "Forex Brokers with No Hidden Fees",            category: "forex", sub: "costs",    priority: 3, icon: "\ud83d\udd0d" },
  { id: "no-inactivity-fee",  slug: "/forex-brokers-no-inactivity-fee",          title: "Forex Brokers with No Inactivity Fee",         category: "forex", sub: "costs",    priority: 3, icon: "\ud83d\udeab" },
  { id: "free-deposits",      slug: "/forex-brokers-free-deposits",              title: "Forex Brokers with Free Deposits",             category: "forex", sub: "costs",    priority: 3, icon: "\u2705" },
  { id: "free-withdrawals",   slug: "/forex-brokers-free-withdrawals",           title: "Forex Brokers with Free Withdrawals",          category: "forex", sub: "costs",    priority: 3, icon: "\ud83d\udcb8" },
  { id: "instant-withdrawal", slug: "/forex-brokers-instant-withdrawal",         title: "Forex Brokers with Instant Withdrawal",        category: "forex", sub: "costs",    priority: 2, icon: "\u23e9" },
  { id: "cashback",           slug: "/forex-brokers-cashback-rebates",           title: "Forex Brokers with Cashback & Rebates",        category: "forex", sub: "costs",    priority: 3, icon: "\ud83d\udd04" },
  { id: "no-requotes",        slug: "/forex-brokers-no-requotes",                title: "Forex Brokers with No Requotes",               category: "forex", sub: "costs",    priority: 3, icon: "\u2714\ufe0f" },
  { id: "low-slippage",       slug: "/forex-brokers-low-slippage",               title: "Forex Brokers with Low Slippage",              category: "forex", sub: "costs",    priority: 3, icon: "\ud83d\udccd" },

  // ═══════════════════════════════════════════════════════════════
  // C. BY EXECUTION MODEL (7)
  // ═══════════════════════════════════════════════════════════════
  { id: "ecn",             slug: "/best-ecn-forex-brokers",                title: "Best ECN Forex Brokers",                 category: "forex", sub: "execution", priority: 1, icon: "\u26a1" },
  { id: "stp",             slug: "/best-stp-forex-brokers",                title: "Best STP Forex Brokers",                 category: "forex", sub: "execution", priority: 3, icon: "\u27a1\ufe0f" },
  { id: "ndd",             slug: "/best-ndd-forex-brokers",                title: "Best No Dealing Desk (NDD) Brokers",     category: "forex", sub: "execution", priority: 2, icon: "\ud83d\udd00" },
  { id: "market-maker",    slug: "/market-maker-forex-brokers",            title: "Market Maker Forex Brokers",             category: "forex", sub: "execution", priority: 3, icon: "\ud83c\udfed" },
  { id: "dma",             slug: "/best-dma-forex-brokers",                title: "Best DMA (Direct Market Access) Brokers", category: "forex", sub: "execution", priority: 3, icon: "\ud83c\udfaf" },
  { id: "a-book",          slug: "/best-a-book-forex-brokers",             title: "Best A-Book Forex Brokers",              category: "forex", sub: "execution", priority: 3, icon: "\ud83d\udcda" },
  { id: "fast-execution",  slug: "/best-fast-execution-forex-brokers",     title: "Best Fast Execution Forex Brokers",      category: "forex", sub: "execution", priority: 2, icon: "\ud83d\ude80" },

  // ═══════════════════════════════════════════════════════════════
  // D. BY ACCOUNT TYPE (10)
  // ═══════════════════════════════════════════════════════════════
  { id: "micro-accounts",    slug: "/forex-brokers-micro-accounts",           title: "Forex Brokers with Micro Accounts",         category: "forex", sub: "accounts", priority: 2, icon: "\ud83d\udd2c" },
  { id: "cent-accounts",     slug: "/forex-brokers-cent-accounts",            title: "Forex Brokers with Cent Accounts",          category: "forex", sub: "accounts", priority: 3, icon: "\ud83e\ude99" },
  { id: "standard-accounts", slug: "/forex-brokers-standard-accounts",        title: "Forex Brokers with Standard Accounts",      category: "forex", sub: "accounts", priority: 3, icon: "\ud83d\udccb" },
  { id: "demo-accounts",     slug: "/best-forex-demo-accounts",               title: "Best Forex Demo Accounts",                  category: "forex", sub: "accounts", priority: 2, icon: "\ud83c\udfae" },
  { id: "pamm-accounts",     slug: "/forex-brokers-pamm-accounts",            title: "Forex Brokers with PAMM Accounts",          category: "forex", sub: "accounts", priority: 3, icon: "\ud83d\udcbc" },
  { id: "mam-accounts",      slug: "/forex-brokers-mam-accounts",             title: "Forex Brokers with MAM Accounts",           category: "forex", sub: "accounts", priority: 3, icon: "\ud83d\udcc2" },
  { id: "managed-accounts",  slug: "/forex-brokers-managed-accounts",         title: "Forex Brokers with Managed Accounts",       category: "forex", sub: "accounts", priority: 3, icon: "\ud83e\uddd1\u200d\ud83d\udcbc" },
  { id: "large-accounts",    slug: "/best-forex-brokers-large-accounts",      title: "Best Forex Brokers for Large Accounts",     category: "forex", sub: "accounts", priority: 3, icon: "\ud83d\udcb0" },
  { id: "small-accounts",    slug: "/best-forex-brokers-small-accounts",      title: "Best Forex Brokers for Small Accounts",     category: "forex", sub: "accounts", priority: 2, icon: "\ud83c\udf31" },
  { id: "islamic-accounts",  slug: "/best-islamic-forex-brokers",             title: "Best Islamic (Swap-Free) Forex Brokers",    category: "forex", sub: "accounts", priority: 2, icon: "\u2622\ufe0f" },

  // ═══════════════════════════════════════════════════════════════
  // E. BY MINIMUM DEPOSIT (7)
  // ═══════════════════════════════════════════════════════════════
  { id: "no-min-deposit",    slug: "/no-minimum-deposit-forex-brokers",          title: "No Minimum Deposit Forex Brokers",         category: "forex", sub: "deposit", priority: 2, icon: "\ud83c\udd93" },
  { id: "1-dollar-deposit",  slug: "/1-dollar-minimum-deposit-forex-brokers",    title: "$1 Minimum Deposit Forex Brokers",         category: "forex", sub: "deposit", priority: 2, icon: "1\ufe0f\u20e3" },
  { id: "5-dollar-deposit",  slug: "/5-dollar-minimum-deposit-forex-brokers",    title: "$5 Minimum Deposit Forex Brokers",         category: "forex", sub: "deposit", priority: 2, icon: "5\ufe0f\u20e3" },
  { id: "10-dollar-deposit", slug: "/10-dollar-minimum-deposit-forex-brokers",   title: "$10 Minimum Deposit Forex Brokers",        category: "forex", sub: "deposit", priority: 2, icon: "\ud83d\udcb5" },
  { id: "50-dollar-deposit", slug: "/50-dollar-minimum-deposit-forex-brokers",   title: "$50 Minimum Deposit Forex Brokers",        category: "forex", sub: "deposit", priority: 3, icon: "\ud83d\udcb5" },
  { id: "100-dollar-deposit",slug: "/100-dollar-minimum-deposit-forex-brokers",  title: "$100 Minimum Deposit Forex Brokers",       category: "forex", sub: "deposit", priority: 3, icon: "\ud83d\udcb5" },
  { id: "500-dollar-deposit",slug: "/500-dollar-minimum-deposit-forex-brokers",  title: "$500 Minimum Deposit Forex Brokers",       category: "forex", sub: "deposit", priority: 3, icon: "\ud83d\udcb5" },

  // ═══════════════════════════════════════════════════════════════
  // F. BY LEVERAGE (7)
  // ═══════════════════════════════════════════════════════════════
  { id: "high-leverage",       slug: "/best-high-leverage-forex-brokers",        title: "Best High Leverage Forex Brokers",          category: "forex", sub: "leverage", priority: 1, icon: "\ud83d\udcc8" },
  { id: "leverage-30",         slug: "/1-30-leverage-forex-brokers",             title: "1:30 Leverage Forex Brokers (EU)",          category: "forex", sub: "leverage", priority: 3, icon: "\ud83c\uddea\ud83c\uddfa" },
  { id: "leverage-100",        slug: "/1-100-leverage-forex-brokers",            title: "1:100 Leverage Forex Brokers",              category: "forex", sub: "leverage", priority: 3, icon: "\ud83d\udcaf" },
  { id: "leverage-200",        slug: "/1-200-leverage-forex-brokers",            title: "1:200 Leverage Forex Brokers",              category: "forex", sub: "leverage", priority: 3, icon: "\ud83d\udcaa" },
  { id: "leverage-500",        slug: "/1-500-leverage-forex-brokers",            title: "1:500 Leverage Forex Brokers",              category: "forex", sub: "leverage", priority: 2, icon: "\ud83d\udd25" },
  { id: "leverage-1000",       slug: "/1-1000-leverage-forex-brokers",           title: "1:1000 Leverage Forex Brokers",             category: "forex", sub: "leverage", priority: 2, icon: "\ud83d\udca5" },
  { id: "unlimited-leverage",  slug: "/unlimited-leverage-forex-brokers",        title: "Unlimited Leverage Forex Brokers",          category: "forex", sub: "leverage", priority: 3, icon: "\u267e\ufe0f" },

  // ═══════════════════════════════════════════════════════════════
  // G. BY BONUS & PROMOTIONS (5)
  // ═══════════════════════════════════════════════════════════════
  { id: "bonus",             slug: "/best-forex-brokers-with-bonus",           title: "Best Forex Brokers with Bonus",             category: "forex", sub: "bonus",   priority: 2, icon: "\ud83c\udf81" },
  { id: "no-deposit-bonus",  slug: "/no-deposit-bonus-forex-brokers",          title: "No Deposit Bonus Forex Brokers",            category: "forex", sub: "bonus",   priority: 2, icon: "\ud83c\udd93" },
  { id: "deposit-bonus",     slug: "/deposit-bonus-forex-brokers",             title: "Deposit Bonus Forex Brokers",               category: "forex", sub: "bonus",   priority: 2, icon: "\ud83d\udcb0" },
  { id: "welcome-bonus",     slug: "/welcome-bonus-forex-brokers",             title: "Welcome Bonus Forex Brokers",               category: "forex", sub: "bonus",   priority: 3, icon: "\ud83c\udf89" },
  { id: "loyalty-program",   slug: "/forex-brokers-loyalty-program",           title: "Forex Brokers with Loyalty Programs",        category: "forex", sub: "bonus",   priority: 3, icon: "\u2b50" },

  // ═══════════════════════════════════════════════════════════════
  // H. BY TRADING PLATFORM (10)
  // ═══════════════════════════════════════════════════════════════
  { id: "mt4",             slug: "/best-metatrader-4-brokers",              title: "Best MetaTrader 4 (MT4) Brokers",           category: "forex", sub: "platform", priority: 1, icon: "\ud83d\udcca" },
  { id: "mt5",             slug: "/best-metatrader-5-brokers",              title: "Best MetaTrader 5 (MT5) Brokers",           category: "forex", sub: "platform", priority: 1, icon: "\ud83d\udcca" },
  { id: "ctrader",         slug: "/best-ctrader-brokers",                   title: "Best cTrader Brokers",                      category: "forex", sub: "platform", priority: 2, icon: "\ud83d\udcca" },
  { id: "tradingview",     slug: "/best-tradingview-brokers",               title: "Best TradingView Brokers",                  category: "forex", sub: "platform", priority: 1, icon: "\ud83d\udcca" },
  { id: "ninjatrader",     slug: "/best-ninjatrader-brokers",               title: "Best NinjaTrader Brokers",                  category: "forex", sub: "platform", priority: 3, icon: "\ud83e\udd77" },
  { id: "zulutrade",       slug: "/best-zulutrade-brokers",                 title: "Best ZuluTrade Brokers",                    category: "forex", sub: "platform", priority: 3, icon: "\ud83d\udcca" },
  { id: "prorealtime",     slug: "/best-prorealtime-brokers",               title: "Best ProRealTime Brokers",                  category: "forex", sub: "platform", priority: 3, icon: "\ud83d\udcca" },
  { id: "proprietary",     slug: "/forex-brokers-proprietary-platform",     title: "Forex Brokers with Proprietary Platforms",   category: "forex", sub: "platform", priority: 3, icon: "\ud83c\udfae" },
  { id: "trading-api",     slug: "/forex-brokers-trading-api",              title: "Forex Brokers with Trading API",            category: "forex", sub: "platform", priority: 3, icon: "\ud83d\udd27" },
  { id: "free-vps",        slug: "/forex-brokers-free-vps",                 title: "Forex Brokers with Free VPS",               category: "forex", sub: "platform", priority: 2, icon: "\ud83d\udda5\ufe0f" },

  // ═══════════════════════════════════════════════════════════════
  // I. MOBILE APPS (5)
  // ═══════════════════════════════════════════════════════════════
  { id: "trading-apps",     slug: "/best-forex-trading-apps",               title: "Best Forex Trading Apps",                   category: "forex", sub: "mobile",   priority: 1, icon: "\ud83d\udcf1" },
  { id: "apps-iphone",      slug: "/best-forex-apps-iphone",                title: "Best Forex Apps for iPhone",                category: "forex", sub: "mobile",   priority: 3, icon: "\ud83c\udf4f" },
  { id: "apps-android",     slug: "/best-forex-apps-android",               title: "Best Forex Apps for Android",               category: "forex", sub: "mobile",   priority: 3, icon: "\ud83e\udd16" },
  { id: "crypto-apps",      slug: "/best-crypto-trading-apps",              title: "Best Crypto Trading Apps",                  category: "crypto", sub: "mobile",  priority: 2, icon: "\ud83d\udcf2" },
  { id: "stock-apps",       slug: "/best-stock-trading-apps",               title: "Best Stock Trading Apps",                   category: "stocks", sub: "mobile",  priority: 3, icon: "\ud83d\udcf1" },

  // ═══════════════════════════════════════════════════════════════
  // J. TRUST & SAFETY (5)
  // ═══════════════════════════════════════════════════════════════
  { id: "safest",                  slug: "/safest-forex-brokers",                       title: "Safest & Most Trusted Forex Brokers",         category: "forex", sub: "trust",  priority: 2, icon: "\ud83d\udee1\ufe0f" },
  { id: "regulated",              slug: "/best-regulated-forex-brokers",                title: "Best Regulated Forex Brokers",                category: "forex", sub: "trust",  priority: 2, icon: "\u2705" },
  { id: "negative-balance",       slug: "/forex-brokers-negative-balance-protection",   title: "Forex Brokers with Negative Balance Protection", category: "forex", sub: "trust", priority: 3, icon: "\ud83d\udee1\ufe0f" },
  { id: "guaranteed-stop-loss",   slug: "/forex-brokers-guaranteed-stop-loss",          title: "Forex Brokers with Guaranteed Stop Loss",     category: "forex", sub: "trust",  priority: 3, icon: "\ud83d\uded1" },
  { id: "segregated-accounts",    slug: "/forex-brokers-segregated-accounts",           title: "Forex Brokers with Segregated Accounts",      category: "forex", sub: "trust",  priority: 3, icon: "\ud83c\udfe6" },

  // ═══════════════════════════════════════════════════════════════
  // K. TOOLS & FEATURES (7)
  // ═══════════════════════════════════════════════════════════════
  { id: "education",          slug: "/best-forex-brokers-education",             title: "Best Forex Brokers for Education",           category: "forex", sub: "tools",  priority: 2, icon: "\ud83c\udf93" },
  { id: "research",           slug: "/best-forex-brokers-research-tools",        title: "Best Forex Brokers with Research Tools",     category: "forex", sub: "tools",  priority: 3, icon: "\ud83d\udd2c" },
  { id: "trading-central",    slug: "/forex-brokers-trading-central",            title: "Forex Brokers with Trading Central",         category: "forex", sub: "tools",  priority: 3, icon: "\ud83d\udcca" },
  { id: "autochartist",       slug: "/forex-brokers-autochartist",               title: "Forex Brokers with Autochartist",            category: "forex", sub: "tools",  priority: 3, icon: "\ud83d\udcc8" },
  { id: "economic-calendar",  slug: "/forex-brokers-economic-calendar",          title: "Forex Brokers with Economic Calendar",       category: "forex", sub: "tools",  priority: 3, icon: "\ud83d\udcc5" },
  { id: "charting",           slug: "/best-forex-brokers-charting-tools",        title: "Best Forex Brokers with Charting Tools",     category: "forex", sub: "tools",  priority: 3, icon: "\ud83d\udcc9" },
  { id: "24-7-support",       slug: "/forex-brokers-24-7-support",              title: "Forex Brokers with 24/7 Support",            category: "forex", sub: "tools",  priority: 3, icon: "\ud83d\udcde" },

  // ═══════════════════════════════════════════════════════════════
  // L. CRYPTO BROKERS (12)
  // ═══════════════════════════════════════════════════════════════
  { id: "crypto-overall",     slug: "/best-crypto-brokers",                    title: "Best Crypto Brokers",                        category: "crypto", sub: "top",     priority: 1, icon: "\u20bf" },
  { id: "crypto-bitcoin",     slug: "/best-bitcoin-brokers",                   title: "Best Bitcoin Trading Platforms",              category: "crypto", sub: "coins",   priority: 1, icon: "\u20bf" },
  { id: "crypto-ethereum",    slug: "/best-ethereum-brokers",                  title: "Best Ethereum Trading Platforms",             category: "crypto", sub: "coins",   priority: 2, icon: "\u25c7" },
  { id: "crypto-xrp",         slug: "/best-xrp-brokers",                      title: "Best Ripple (XRP) Brokers",                  category: "crypto", sub: "coins",   priority: 3, icon: "\ud83d\udca7" },
  { id: "crypto-solana",      slug: "/best-solana-brokers",                    title: "Best Solana Trading Platforms",               category: "crypto", sub: "coins",   priority: 3, icon: "\u2600\ufe0f" },
  { id: "crypto-doge",        slug: "/best-dogecoin-brokers",                  title: "Best Dogecoin Brokers",                      category: "crypto", sub: "coins",   priority: 3, icon: "\ud83d\udc36" },
  { id: "crypto-altcoins",    slug: "/best-altcoin-brokers",                   title: "Best Altcoin Trading Platforms",              category: "crypto", sub: "coins",   priority: 2, icon: "\ud83e\ude99" },
  { id: "crypto-staking",     slug: "/best-crypto-staking-platforms",          title: "Best Crypto Staking Platforms",               category: "crypto", sub: "feature", priority: 2, icon: "\ud83d\udcb8" },
  { id: "crypto-copy",        slug: "/best-crypto-copy-trading",              title: "Best Crypto Copy Trading Platforms",           category: "crypto", sub: "feature", priority: 3, icon: "\ud83d\udccb" },
  { id: "crypto-high-lev",    slug: "/best-high-leverage-crypto-brokers",     title: "Best High Leverage Crypto Brokers",            category: "crypto", sub: "feature", priority: 2, icon: "\ud83d\udcc8" },
  { id: "crypto-low-spread",  slug: "/best-low-spread-crypto-brokers",        title: "Best Low Spread Crypto Brokers",               category: "crypto", sub: "feature", priority: 3, icon: "\ud83d\udcc9" },
  { id: "crypto-vs-cfd",      slug: "/crypto-exchanges-vs-cfd-brokers",       title: "Crypto Exchanges vs CFD Brokers",              category: "crypto", sub: "guide",   priority: 3, icon: "\u2696\ufe0f" },

  // ═══════════════════════════════════════════════════════════════
  // M. OTHER ASSET CLASSES (12)
  // ═══════════════════════════════════════════════════════════════
  { id: "cfd",           slug: "/best-cfd-brokers",                  title: "Best CFD Brokers",                     category: "assets", sub: "type",   priority: 1, icon: "\ud83d\udcca" },
  { id: "stocks",        slug: "/best-stock-brokers",                title: "Best Stock Trading Brokers",           category: "assets", sub: "type",   priority: 2, icon: "\ud83d\udcc8" },
  { id: "gold",          slug: "/best-gold-trading-brokers",         title: "Best Gold Trading Brokers",            category: "assets", sub: "type",   priority: 2, icon: "\ud83e\udd47" },
  { id: "silver",        slug: "/best-silver-trading-brokers",       title: "Best Silver Trading Brokers",          category: "assets", sub: "type",   priority: 3, icon: "\ud83e\udd48" },
  { id: "oil",           slug: "/best-oil-trading-brokers",          title: "Best Oil Trading Brokers",             category: "assets", sub: "type",   priority: 3, icon: "\ud83d\udee2\ufe0f" },
  { id: "commodities",   slug: "/best-commodities-brokers",          title: "Best Commodities Brokers",             category: "assets", sub: "type",   priority: 2, icon: "\ud83c\udf3e" },
  { id: "indices",       slug: "/best-index-trading-brokers",        title: "Best Index Trading Brokers",           category: "assets", sub: "type",   priority: 2, icon: "\ud83d\udcca" },
  { id: "options",       slug: "/best-options-brokers",              title: "Best Options Brokers",                 category: "assets", sub: "type",   priority: 2, icon: "\ud83c\udfb0" },
  { id: "futures",       slug: "/best-futures-brokers",              title: "Best Futures Brokers",                 category: "assets", sub: "type",   priority: 2, icon: "\ud83d\udcc5" },
  { id: "etf",           slug: "/best-etf-brokers",                  title: "Best ETF Brokers",                     category: "assets", sub: "type",   priority: 3, icon: "\ud83d\udce6" },
  { id: "spread-betting",slug: "/best-spread-betting-brokers",       title: "Best Spread Betting Brokers",          category: "assets", sub: "type",   priority: 2, icon: "\ud83c\uddec\ud83c\udde7" },
  { id: "bonds",         slug: "/best-bond-trading-brokers",         title: "Best Bond Trading Brokers",            category: "assets", sub: "type",   priority: 3, icon: "\ud83c\udfe6" },

  // ═══════════════════════════════════════════════════════════════
  // N. BY CURRENCY PAIR (10)
  // ═══════════════════════════════════════════════════════════════
  { id: "eurusd",    slug: "/best-eurusd-brokers",           title: "Best EUR/USD Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "\ud83c\uddea\ud83c\uddfa" },
  { id: "gbpusd",    slug: "/best-gbpusd-brokers",           title: "Best GBP/USD Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "\ud83c\uddec\ud83c\udde7" },
  { id: "usdjpy",    slug: "/best-usdjpy-brokers",           title: "Best USD/JPY Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "\ud83c\uddef\ud83c\uddf5" },
  { id: "audusd",    slug: "/best-audusd-brokers",           title: "Best AUD/USD Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "\ud83c\udde6\ud83c\uddfa" },
  { id: "usdcad",    slug: "/best-usdcad-brokers",           title: "Best USD/CAD Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "\ud83c\udde8\ud83c\udde6" },
  { id: "eurgbp",    slug: "/best-eurgbp-brokers",           title: "Best EUR/GBP Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "\ud83c\uddea\ud83c\uddfa" },
  { id: "usdchf",    slug: "/best-usdchf-brokers",           title: "Best USD/CHF Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "\ud83c\udde8\ud83c\udded" },
  { id: "nzdusd",    slug: "/best-nzdusd-brokers",           title: "Best NZD/USD Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "\ud83c\uddf3\ud83c\uddff" },
  { id: "exotic",    slug: "/best-exotic-pairs-brokers",     title: "Best Exotic Pairs Brokers",         category: "forex", sub: "pairs", priority: 3, icon: "\ud83c\udf34" },
  { id: "minor",     slug: "/best-minor-pairs-brokers",      title: "Best Minor Pairs Brokers",          category: "forex", sub: "pairs", priority: 3, icon: "\ud83d\udcb1" },

  // ═══════════════════════════════════════════════════════════════
  // O. BY INDEX (6)
  // ═══════════════════════════════════════════════════════════════
  { id: "sp500",     slug: "/best-sp500-brokers",            title: "Best S&P 500 Trading Brokers",      category: "assets", sub: "index", priority: 3, icon: "\ud83c\uddfa\ud83c\uddf8" },
  { id: "nasdaq",    slug: "/best-nasdaq-brokers",           title: "Best NASDAQ Trading Brokers",       category: "assets", sub: "index", priority: 3, icon: "\ud83d\udcbb" },
  { id: "dow",       slug: "/best-dow-jones-brokers",        title: "Best Dow Jones Trading Brokers",    category: "assets", sub: "index", priority: 3, icon: "\ud83c\udfe2" },
  { id: "ftse",      slug: "/best-ftse-100-brokers",         title: "Best FTSE 100 Trading Brokers",     category: "assets", sub: "index", priority: 3, icon: "\ud83c\uddec\ud83c\udde7" },
  { id: "dax",       slug: "/best-dax-brokers",              title: "Best DAX Trading Brokers",          category: "assets", sub: "index", priority: 3, icon: "\ud83c\udde9\ud83c\uddea" },
  { id: "nikkei",    slug: "/best-nikkei-brokers",           title: "Best Nikkei 225 Trading Brokers",   category: "assets", sub: "index", priority: 3, icon: "\ud83c\uddef\ud83c\uddf5" },

  // ═══════════════════════════════════════════════════════════════
  // P. BY PAYMENT METHOD (14)
  // ═══════════════════════════════════════════════════════════════
  { id: "pay-paypal",       slug: "/forex-brokers-accepting-paypal",         title: "Forex Brokers Accepting PayPal",           category: "forex", sub: "payment", priority: 2, icon: "\ud83d\udcb3" },
  { id: "pay-skrill",       slug: "/forex-brokers-accepting-skrill",         title: "Forex Brokers Accepting Skrill",           category: "forex", sub: "payment", priority: 3, icon: "\ud83d\udcb3" },
  { id: "pay-neteller",     slug: "/forex-brokers-accepting-neteller",       title: "Forex Brokers Accepting Neteller",         category: "forex", sub: "payment", priority: 3, icon: "\ud83d\udcb3" },
  { id: "pay-bitcoin",      slug: "/forex-brokers-accepting-bitcoin",        title: "Forex Brokers Accepting Bitcoin",          category: "forex", sub: "payment", priority: 2, icon: "\u20bf" },
  { id: "pay-crypto",       slug: "/forex-brokers-accepting-crypto",         title: "Forex Brokers Accepting Crypto",           category: "forex", sub: "payment", priority: 3, icon: "\ud83e\ude99" },
  { id: "pay-credit-card",  slug: "/forex-brokers-accepting-credit-cards",   title: "Forex Brokers Accepting Credit Cards",     category: "forex", sub: "payment", priority: 3, icon: "\ud83d\udcb3" },
  { id: "pay-visa",         slug: "/forex-brokers-accepting-visa",           title: "Forex Brokers Accepting Visa",             category: "forex", sub: "payment", priority: 3, icon: "\ud83d\udcb3" },
  { id: "pay-bank-transfer",slug: "/forex-brokers-accepting-bank-transfer",  title: "Forex Brokers Accepting Bank Transfer",    category: "forex", sub: "payment", priority: 3, icon: "\ud83c\udfe6" },
  { id: "pay-apple-pay",    slug: "/forex-brokers-accepting-apple-pay",      title: "Forex Brokers Accepting Apple Pay",        category: "forex", sub: "payment", priority: 3, icon: "\ud83c\udf4f" },
  { id: "pay-google-pay",   slug: "/forex-brokers-accepting-google-pay",     title: "Forex Brokers Accepting Google Pay",       category: "forex", sub: "payment", priority: 3, icon: "\ud83d\udcf1" },
  { id: "pay-perfect-money",slug: "/forex-brokers-accepting-perfect-money",  title: "Forex Brokers Accepting Perfect Money",    category: "forex", sub: "payment", priority: 3, icon: "\ud83d\udcb2" },
  { id: "pay-webmoney",     slug: "/forex-brokers-accepting-webmoney",       title: "Forex Brokers Accepting WebMoney",         category: "forex", sub: "payment", priority: 3, icon: "\ud83d\udcb2" },
  { id: "pay-upi",          slug: "/forex-brokers-accepting-upi",            title: "Forex Brokers Accepting UPI",              category: "forex", sub: "payment", priority: 3, icon: "\ud83c\uddee\ud83c\uddf3" },
  { id: "pay-pix",          slug: "/forex-brokers-accepting-pix",            title: "Forex Brokers Accepting PIX",              category: "forex", sub: "payment", priority: 3, icon: "\ud83c\udde7\ud83c\uddf7" },

  // ═══════════════════════════════════════════════════════════════
  // Q. BY REGULATOR (10)
  // ═══════════════════════════════════════════════════════════════
  { id: "reg-fca",    slug: "/fca-regulated-forex-brokers",          title: "FCA Regulated Forex Brokers",            category: "forex", sub: "regulator", priority: 2, icon: "\ud83c\uddec\ud83c\udde7" },
  { id: "reg-asic",   slug: "/asic-regulated-forex-brokers",         title: "ASIC Regulated Forex Brokers",           category: "forex", sub: "regulator", priority: 2, icon: "\ud83c\udde6\ud83c\uddfa" },
  { id: "reg-cysec",  slug: "/cysec-regulated-forex-brokers",        title: "CySEC Regulated Forex Brokers",          category: "forex", sub: "regulator", priority: 2, icon: "\ud83c\udde8\ud83c\uddfe" },
  { id: "reg-nfa",    slug: "/nfa-regulated-forex-brokers",          title: "NFA / CFTC Regulated Forex Brokers",     category: "forex", sub: "regulator", priority: 3, icon: "\ud83c\uddfa\ud83c\uddf8" },
  { id: "reg-bafin",  slug: "/bafin-regulated-forex-brokers",        title: "BaFin Regulated Forex Brokers",          category: "forex", sub: "regulator", priority: 3, icon: "\ud83c\udde9\ud83c\uddea" },
  { id: "reg-mas",    slug: "/mas-regulated-forex-brokers",          title: "MAS Regulated Forex Brokers",            category: "forex", sub: "regulator", priority: 3, icon: "\ud83c\uddf8\ud83c\uddec" },
  { id: "reg-dfsa",   slug: "/dfsa-regulated-forex-brokers",         title: "DFSA Regulated Forex Brokers",           category: "forex", sub: "regulator", priority: 3, icon: "\ud83c\udde6\ud83c\uddea" },
  { id: "reg-fsca",   slug: "/fsca-regulated-forex-brokers",         title: "FSCA Regulated Forex Brokers",           category: "forex", sub: "regulator", priority: 3, icon: "\ud83c\uddff\ud83c\udde6" },
  { id: "reg-scb",    slug: "/scb-regulated-forex-brokers",          title: "SCB Regulated Forex Brokers",            category: "forex", sub: "regulator", priority: 3, icon: "\ud83c\udde7\ud83c\uddf8" },
  { id: "reg-offshore",slug: "/offshore-forex-brokers",              title: "Offshore Forex Brokers",                 category: "forex", sub: "regulator", priority: 3, icon: "\ud83c\udf34" },

  // ═══════════════════════════════════════════════════════════════
  // R. BY COUNTRY (40)
  // ═══════════════════════════════════════════════════════════════
  // Tier 1 GEO
  { id: "geo-uk",          slug: "/best-forex-brokers-uk",               title: "Best Forex Brokers UK",                category: "country", sub: "tier1", priority: 1, icon: "\ud83c\uddec\ud83c\udde7" },
  { id: "geo-australia",   slug: "/best-forex-brokers-australia",        title: "Best Forex Brokers Australia",         category: "country", sub: "tier1", priority: 1, icon: "\ud83c\udde6\ud83c\uddfa" },
  { id: "geo-usa",         slug: "/best-forex-brokers-usa",              title: "Best Forex Brokers USA",               category: "country", sub: "tier1", priority: 1, icon: "\ud83c\uddfa\ud83c\uddf8" },
  { id: "geo-germany",     slug: "/best-forex-brokers-germany",          title: "Best Forex Brokers Germany",           category: "country", sub: "tier1", priority: 2, icon: "\ud83c\udde9\ud83c\uddea" },
  { id: "geo-canada",      slug: "/best-forex-brokers-canada",           title: "Best Forex Brokers Canada",            category: "country", sub: "tier1", priority: 2, icon: "\ud83c\udde8\ud83c\udde6" },
  { id: "geo-switzerland", slug: "/best-forex-brokers-switzerland",      title: "Best Forex Brokers Switzerland",       category: "country", sub: "tier1", priority: 3, icon: "\ud83c\udde8\ud83c\udded" },
  { id: "geo-singapore",   slug: "/best-forex-brokers-singapore",        title: "Best Forex Brokers Singapore",         category: "country", sub: "tier1", priority: 2, icon: "\ud83c\uddf8\ud83c\uddec" },
  { id: "geo-uae",         slug: "/best-forex-brokers-uae",              title: "Best Forex Brokers UAE",               category: "country", sub: "tier1", priority: 2, icon: "\ud83c\udde6\ud83c\uddea" },
  { id: "geo-japan",       slug: "/best-forex-brokers-japan",            title: "Best Forex Brokers Japan",             category: "country", sub: "tier1", priority: 3, icon: "\ud83c\uddef\ud83c\uddf5" },
  { id: "geo-hongkong",    slug: "/best-forex-brokers-hong-kong",        title: "Best Forex Brokers Hong Kong",         category: "country", sub: "tier1", priority: 3, icon: "\ud83c\udded\ud83c\uddf0" },
  // Tier 2 GEO
  { id: "geo-europe",       slug: "/best-forex-brokers-europe",          title: "Best Forex Brokers Europe",            category: "country", sub: "tier2", priority: 2, icon: "\ud83c\uddea\ud83c\uddfa" },
  { id: "geo-south-africa", slug: "/best-forex-brokers-south-africa",    title: "Best Forex Brokers South Africa",      category: "country", sub: "tier2", priority: 2, icon: "\ud83c\uddff\ud83c\udde6" },
  { id: "geo-india",        slug: "/best-forex-brokers-india",           title: "Best Forex Brokers India",             category: "country", sub: "tier2", priority: 2, icon: "\ud83c\uddee\ud83c\uddf3" },
  { id: "geo-malaysia",     slug: "/best-forex-brokers-malaysia",        title: "Best Forex Brokers Malaysia",          category: "country", sub: "tier2", priority: 2, icon: "\ud83c\uddf2\ud83c\uddfe" },
  { id: "geo-new-zealand",  slug: "/best-forex-brokers-new-zealand",     title: "Best Forex Brokers New Zealand",       category: "country", sub: "tier2", priority: 3, icon: "\ud83c\uddf3\ud83c\uddff" },
  { id: "geo-france",       slug: "/best-forex-brokers-france",          title: "Best Forex Brokers France",            category: "country", sub: "tier2", priority: 3, icon: "\ud83c\uddeb\ud83c\uddf7" },
  { id: "geo-spain",        slug: "/best-forex-brokers-spain",           title: "Best Forex Brokers Spain",             category: "country", sub: "tier2", priority: 3, icon: "\ud83c\uddea\ud83c\uddf8" },
  { id: "geo-italy",        slug: "/best-forex-brokers-italy",           title: "Best Forex Brokers Italy",             category: "country", sub: "tier2", priority: 3, icon: "\ud83c\uddee\ud83c\uddf9" },
  { id: "geo-netherlands",  slug: "/best-forex-brokers-netherlands",     title: "Best Forex Brokers Netherlands",       category: "country", sub: "tier2", priority: 3, icon: "\ud83c\uddf3\ud83c\uddf1" },
  { id: "geo-sweden",       slug: "/best-forex-brokers-sweden",          title: "Best Forex Brokers Sweden",            category: "country", sub: "tier2", priority: 3, icon: "\ud83c\uddf8\ud83c\uddea" },
  { id: "geo-saudi",        slug: "/best-forex-brokers-saudi-arabia",    title: "Best Forex Brokers Saudi Arabia",      category: "country", sub: "tier2", priority: 2, icon: "\ud83c\uddf8\ud83c\udde6" },
  { id: "geo-kuwait",       slug: "/best-forex-brokers-kuwait",          title: "Best Forex Brokers Kuwait",            category: "country", sub: "tier2", priority: 3, icon: "\ud83c\uddf0\ud83c\uddfc" },
  { id: "geo-qatar",        slug: "/best-forex-brokers-qatar",           title: "Best Forex Brokers Qatar",             category: "country", sub: "tier2", priority: 3, icon: "\ud83c\uddf6\ud83c\udde6" },
  // Tier 3 GEO
  { id: "geo-nigeria",      slug: "/best-forex-brokers-nigeria",         title: "Best Forex Brokers Nigeria",           category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddf3\ud83c\uddec" },
  { id: "geo-philippines",  slug: "/best-forex-brokers-philippines",     title: "Best Forex Brokers Philippines",       category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddf5\ud83c\udded" },
  { id: "geo-indonesia",    slug: "/best-forex-brokers-indonesia",       title: "Best Forex Brokers Indonesia",         category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddee\ud83c\udde9" },
  { id: "geo-turkey",       slug: "/best-forex-brokers-turkey",          title: "Best Forex Brokers Turkey",            category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddf9\ud83c\uddf7" },
  { id: "geo-brazil",       slug: "/best-forex-brokers-brazil",          title: "Best Forex Brokers Brazil",            category: "country", sub: "tier3", priority: 3, icon: "\ud83c\udde7\ud83c\uddf7" },
  { id: "geo-mexico",       slug: "/best-forex-brokers-mexico",          title: "Best Forex Brokers Mexico",            category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddf2\ud83c\uddfd" },
  { id: "geo-pakistan",      slug: "/best-forex-brokers-pakistan",        title: "Best Forex Brokers Pakistan",          category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddf5\ud83c\uddf0" },
  { id: "geo-kenya",        slug: "/best-forex-brokers-kenya",           title: "Best Forex Brokers Kenya",             category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddf0\ud83c\uddea" },
  { id: "geo-ghana",        slug: "/best-forex-brokers-ghana",           title: "Best Forex Brokers Ghana",             category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddec\ud83c\udded" },
  { id: "geo-thailand",     slug: "/best-forex-brokers-thailand",        title: "Best Forex Brokers Thailand",          category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddf9\ud83c\udded" },
  { id: "geo-vietnam",      slug: "/best-forex-brokers-vietnam",         title: "Best Forex Brokers Vietnam",           category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddfb\ud83c\uddf3" },
  { id: "geo-bangladesh",   slug: "/best-forex-brokers-bangladesh",      title: "Best Forex Brokers Bangladesh",        category: "country", sub: "tier3", priority: 3, icon: "\ud83c\udde7\ud83c\udde9" },
  { id: "geo-colombia",     slug: "/best-forex-brokers-colombia",        title: "Best Forex Brokers Colombia",          category: "country", sub: "tier3", priority: 3, icon: "\ud83c\udde8\ud83c\uddf4" },
  { id: "geo-egypt",        slug: "/best-forex-brokers-egypt",           title: "Best Forex Brokers Egypt",             category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddea\ud83c\uddec" },
  { id: "geo-poland",       slug: "/best-forex-brokers-poland",          title: "Best Forex Brokers Poland",            category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddf5\ud83c\uddf1" },
  { id: "geo-romania",      slug: "/best-forex-brokers-romania",         title: "Best Forex Brokers Romania",           category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddf7\ud83c\uddf4" },
  { id: "geo-south-korea",  slug: "/best-forex-brokers-south-korea",     title: "Best Forex Brokers South Korea",       category: "country", sub: "tier3", priority: 3, icon: "\ud83c\uddf0\ud83c\uddf7" },

  // ═══════════════════════════════════════════════════════════════
  // S. BROKER ALTERNATIVES (10)
  // ═══════════════════════════════════════════════════════════════
  { id: "alt-etoro",       slug: "/etoro-alternatives",              title: "Best eToro Alternatives",               category: "alternatives", sub: "broker", priority: 2, icon: "\ud83d\udd04" },
  { id: "alt-ic-markets",  slug: "/ic-markets-alternatives",         title: "Best IC Markets Alternatives",          category: "alternatives", sub: "broker", priority: 3, icon: "\ud83d\udd04" },
  { id: "alt-pepperstone", slug: "/pepperstone-alternatives",        title: "Best Pepperstone Alternatives",         category: "alternatives", sub: "broker", priority: 3, icon: "\ud83d\udd04" },
  { id: "alt-xm",          slug: "/xm-alternatives",                 title: "Best XM Alternatives",                  category: "alternatives", sub: "broker", priority: 3, icon: "\ud83d\udd04" },
  { id: "alt-exness",      slug: "/exness-alternatives",             title: "Best Exness Alternatives",              category: "alternatives", sub: "broker", priority: 3, icon: "\ud83d\udd04" },
  { id: "alt-ig",           slug: "/ig-alternatives",                 title: "Best IG Alternatives",                  category: "alternatives", sub: "broker", priority: 3, icon: "\ud83d\udd04" },
  { id: "alt-plus500",     slug: "/plus500-alternatives",            title: "Best Plus500 Alternatives",             category: "alternatives", sub: "broker", priority: 3, icon: "\ud83d\udd04" },
  { id: "alt-oanda",       slug: "/oanda-alternatives",              title: "Best OANDA Alternatives",               category: "alternatives", sub: "broker", priority: 3, icon: "\ud83d\udd04" },
  { id: "alt-avatrade",    slug: "/avatrade-alternatives",           title: "Best AvaTrade Alternatives",            category: "alternatives", sub: "broker", priority: 3, icon: "\ud83d\udd04" },
  { id: "alt-robinhood",   slug: "/robinhood-alternatives-forex",    title: "Best Robinhood Alternatives for Forex", category: "alternatives", sub: "broker", priority: 3, icon: "\ud83d\udd04" },
];

export default RANKINGS;

// ── Helper functions ──

export function getRankingBySlug(slug) {
  return RANKINGS.find((r) => r.slug === slug);
}

export function getRankingsByCategory(category) {
  return RANKINGS.filter((r) => r.category === category);
}

export function getRankingsBySub(category, sub) {
  return RANKINGS.filter((r) => r.category === category && r.sub === sub);
}

export function getRankingsByPriority(priority) {
  return RANKINGS.filter((r) => r.priority === priority);
}

export function getAllRankingSlugs() {
  return RANKINGS.map((r) => r.slug);
}

// Stats
export const RANKING_STATS = {
  total: RANKINGS.length,
  priority1: RANKINGS.filter((r) => r.priority === 1).length,
  priority2: RANKINGS.filter((r) => r.priority === 2).length,
  priority3: RANKINGS.filter((r) => r.priority === 3).length,
  categories: [...new Set(RANKINGS.map((r) => r.category))],
};
