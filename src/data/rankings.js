/**
 * Master list of all thematic broker rankings for RatedBrokers.com
 * Each entry = one landing page targeting a specific search query cluster.
 * Total: 253 pages (200 original + 53 M4 umbrella expansion)
 *
 * Fields:
 *   id        — unique identifier
 *   slug      — URL path (SEO-optimized, matches primary search query)
 *   title     — H1 / page title (without year — year added dynamically)
 *   category  — section for navigation grouping
 *   sub       — sub-category for mega menu / sidebar
 *   priority  — 1 (money page), 2 (high value), 3 (long tail)
 *   icon      — lucide-react icon name for menu/UI
 */

const RANKINGS = [

  // ═══════════════════════════════════════════════════════════════
  // A. FOREX BROKERS — BY TRADING STYLE & EXPERIENCE (18)
  // ═══════════════════════════════════════════════════════════════
  { id: "forex-overall",          slug: "/best-forex-brokers",                        title: "Best Forex Brokers",                            category: "forex", sub: "top",       priority: 1, icon: "trophy" },
  { id: "forex-beginners",        slug: "/best-forex-brokers-for-beginners",          title: "Best Forex Brokers for Beginners",               category: "forex", sub: "style",     priority: 1, icon: "graduation-cap" },
  { id: "forex-professionals",    slug: "/best-forex-brokers-for-professionals",      title: "Best Forex Brokers for Professionals",            category: "forex", sub: "style",     priority: 2, icon: "briefcase" },
  { id: "forex-scalping",         slug: "/best-forex-brokers-for-scalping",           title: "Best Forex Brokers for Scalping",                 category: "forex", sub: "style",     priority: 1, icon: "crosshair" },
  { id: "forex-day-trading",      slug: "/best-forex-brokers-for-day-trading",        title: "Best Forex Brokers for Day Trading",              category: "forex", sub: "style",     priority: 1, icon: "sun" },
  { id: "forex-swing-trading",    slug: "/best-forex-brokers-for-swing-trading",      title: "Best Forex Brokers for Swing Trading",            category: "forex", sub: "style",     priority: 2, icon: "trending-up" },
  { id: "forex-position-trading", slug: "/best-forex-brokers-for-position-trading",   title: "Best Forex Brokers for Position Trading",         category: "forex", sub: "style",     priority: 3, icon: "calendar" },
  { id: "forex-hedging",          slug: "/best-forex-brokers-for-hedging",            title: "Best Forex Brokers for Hedging",                  category: "forex", sub: "style",     priority: 2, icon: "umbrella" },
  { id: "forex-news-trading",     slug: "/best-forex-brokers-for-news-trading",       title: "Best Forex Brokers for News Trading",             category: "forex", sub: "style",     priority: 3, icon: "newspaper" },
  { id: "forex-automated",        slug: "/best-forex-brokers-for-automated-trading",  title: "Best Forex Brokers for Automated Trading",        category: "forex", sub: "style",     priority: 2, icon: "bot" },
  { id: "forex-algo",             slug: "/best-forex-brokers-for-algo-trading",       title: "Best Forex Brokers for Algorithmic Trading",      category: "forex", sub: "style",     priority: 2, icon: "cpu" },
  { id: "forex-hft",              slug: "/best-high-frequency-trading-brokers",       title: "Best High-Frequency Trading Brokers",             category: "forex", sub: "style",     priority: 3, icon: "zap" },
  { id: "forex-copy-trading",     slug: "/best-copy-trading-platforms",               title: "Best Copy Trading Platforms",                     category: "forex", sub: "style",     priority: 1, icon: "copy" },
  { id: "forex-social-trading",   slug: "/best-social-trading-platforms",             title: "Best Social Trading Platforms",                   category: "forex", sub: "style",     priority: 2, icon: "users" },
  { id: "forex-signals",          slug: "/best-forex-signal-providers",               title: "Best Forex Signal Providers",                     category: "forex", sub: "style",     priority: 2, icon: "signal" },
  { id: "forex-ea",               slug: "/best-forex-brokers-for-expert-advisors",    title: "Best Forex Brokers for Expert Advisors (EA)",     category: "forex", sub: "style",     priority: 3, icon: "settings" },
  { id: "forex-grid",             slug: "/best-forex-brokers-for-grid-trading",       title: "Best Forex Brokers for Grid Trading",             category: "forex", sub: "style",     priority: 3, icon: "grid-3x3" },
  { id: "forex-carry",            slug: "/best-forex-brokers-for-carry-trading",      title: "Best Forex Brokers for Carry Trading",            category: "forex", sub: "style",     priority: 3, icon: "hand-coins" },

  // ═══════════════════════════════════════════════════════════════
  // B. BY SPREADS & COSTS (12)
  // ═══════════════════════════════════════════════════════════════
  { id: "low-spread",         slug: "/lowest-spread-forex-brokers",              title: "Lowest Spread Forex Brokers",                  category: "forex", sub: "costs",    priority: 1, icon: "trending-down" },
  { id: "zero-spread",        slug: "/zero-spread-forex-brokers",                title: "Zero Spread Forex Brokers",                    category: "forex", sub: "costs",    priority: 2, icon: "circle-off" },
  { id: "low-commission",     slug: "/lowest-commission-forex-brokers",          title: "Lowest Commission Forex Brokers",              category: "forex", sub: "costs",    priority: 2, icon: "badge-percent" },
  { id: "low-cost",           slug: "/best-low-cost-forex-brokers",              title: "Best Low Cost Forex Brokers",                  category: "forex", sub: "costs",    priority: 2, icon: "piggy-bank" },
  { id: "no-hidden-fees",     slug: "/forex-brokers-no-hidden-fees",             title: "Forex Brokers with No Hidden Fees",            category: "forex", sub: "costs",    priority: 3, icon: "search" },
  { id: "no-inactivity-fee",  slug: "/forex-brokers-no-inactivity-fee",          title: "Forex Brokers with No Inactivity Fee",         category: "forex", sub: "costs",    priority: 3, icon: "ban" },
  { id: "free-deposits",      slug: "/forex-brokers-free-deposits",              title: "Forex Brokers with Free Deposits",             category: "forex", sub: "costs",    priority: 3, icon: "circle-check" },
  { id: "free-withdrawals",   slug: "/forex-brokers-free-withdrawals",           title: "Forex Brokers with Free Withdrawals",          category: "forex", sub: "costs",    priority: 3, icon: "wallet" },
  { id: "instant-withdrawal", slug: "/forex-brokers-instant-withdrawal",         title: "Forex Brokers with Instant Withdrawal",        category: "forex", sub: "costs",    priority: 2, icon: "fast-forward" },
  { id: "cashback",           slug: "/forex-brokers-cashback-rebates",           title: "Forex Brokers with Cashback & Rebates",        category: "forex", sub: "costs",    priority: 3, icon: "refresh-cw" },
  { id: "no-requotes",        slug: "/forex-brokers-no-requotes",                title: "Forex Brokers with No Requotes",               category: "forex", sub: "costs",    priority: 3, icon: "check-circle" },
  { id: "low-slippage",       slug: "/forex-brokers-low-slippage",               title: "Forex Brokers with Low Slippage",              category: "forex", sub: "costs",    priority: 3, icon: "map-pin" },

  // ═══════════════════════════════════════════════════════════════
  // C. BY EXECUTION MODEL (7)
  // ═══════════════════════════════════════════════════════════════
  { id: "ecn",             slug: "/best-ecn-forex-brokers",                title: "Best ECN Forex Brokers",                 category: "forex", sub: "execution", priority: 1, icon: "activity" },
  { id: "stp",             slug: "/best-stp-forex-brokers",                title: "Best STP Forex Brokers",                 category: "forex", sub: "execution", priority: 3, icon: "arrow-right" },
  { id: "ndd",             slug: "/best-ndd-forex-brokers",                title: "Best No Dealing Desk (NDD) Brokers",     category: "forex", sub: "execution", priority: 2, icon: "shuffle" },
  { id: "market-maker",    slug: "/market-maker-forex-brokers",            title: "Market Maker Forex Brokers",             category: "forex", sub: "execution", priority: 3, icon: "factory" },
  { id: "dma",             slug: "/best-dma-forex-brokers",                title: "Best DMA (Direct Market Access) Brokers", category: "forex", sub: "execution", priority: 3, icon: "target" },
  { id: "a-book",          slug: "/best-a-book-forex-brokers",             title: "Best A-Book Forex Brokers",              category: "forex", sub: "execution", priority: 3, icon: "book-open" },
  { id: "fast-execution",  slug: "/best-fast-execution-forex-brokers",     title: "Best Fast Execution Forex Brokers",      category: "forex", sub: "execution", priority: 2, icon: "rocket" },

  // ═══════════════════════════════════════════════════════════════
  // D. BY ACCOUNT TYPE (10)
  // ═══════════════════════════════════════════════════════════════
  { id: "micro-accounts",    slug: "/forex-brokers-micro-accounts",           title: "Forex Brokers with Micro Accounts",         category: "forex", sub: "accounts", priority: 2, icon: "microscope" },
  { id: "cent-accounts",     slug: "/forex-brokers-cent-accounts",            title: "Forex Brokers with Cent Accounts",          category: "forex", sub: "accounts", priority: 3, icon: "coins" },
  { id: "standard-accounts", slug: "/forex-brokers-standard-accounts",        title: "Forex Brokers with Standard Accounts",      category: "forex", sub: "accounts", priority: 3, icon: "clipboard-list" },
  { id: "demo-accounts",     slug: "/best-forex-demo-accounts",               title: "Best Forex Demo Accounts",                  category: "forex", sub: "accounts", priority: 2, icon: "gamepad-2" },
  { id: "pamm-accounts",     slug: "/forex-brokers-pamm-accounts",            title: "Forex Brokers with PAMM Accounts",          category: "forex", sub: "accounts", priority: 3, icon: "layers" },
  { id: "mam-accounts",      slug: "/forex-brokers-mam-accounts",             title: "Forex Brokers with MAM Accounts",           category: "forex", sub: "accounts", priority: 3, icon: "folder-open" },
  { id: "managed-accounts",  slug: "/forex-brokers-managed-accounts",         title: "Forex Brokers with Managed Accounts",       category: "forex", sub: "accounts", priority: 3, icon: "users" },
  { id: "large-accounts",    slug: "/best-forex-brokers-large-accounts",      title: "Best Forex Brokers for Large Accounts",     category: "forex", sub: "accounts", priority: 3, icon: "gem" },
  { id: "small-accounts",    slug: "/best-forex-brokers-small-accounts",      title: "Best Forex Brokers for Small Accounts",     category: "forex", sub: "accounts", priority: 2, icon: "sprout" },
  { id: "islamic-accounts",  slug: "/best-islamic-forex-brokers",             title: "Best Islamic (Swap-Free) Forex Brokers",    category: "forex", sub: "accounts", priority: 2, icon: "moon" },

  // ═══════════════════════════════════════════════════════════════
  // E. BY MINIMUM DEPOSIT (7)
  // ═══════════════════════════════════════════════════════════════
  { id: "no-min-deposit",    slug: "/no-minimum-deposit-forex-brokers",          title: "No Minimum Deposit Forex Brokers",         category: "forex", sub: "deposit", priority: 2, icon: "circle-off" },
  { id: "1-dollar-deposit",  slug: "/1-dollar-minimum-deposit-forex-brokers",    title: "$1 Minimum Deposit Forex Brokers",         category: "forex", sub: "deposit", priority: 2, icon: "dollar-sign" },
  { id: "5-dollar-deposit",  slug: "/5-dollar-minimum-deposit-forex-brokers",    title: "$5 Minimum Deposit Forex Brokers",         category: "forex", sub: "deposit", priority: 2, icon: "dollar-sign" },
  { id: "10-dollar-deposit", slug: "/10-dollar-minimum-deposit-forex-brokers",   title: "$10 Minimum Deposit Forex Brokers",        category: "forex", sub: "deposit", priority: 2, icon: "banknote" },
  { id: "50-dollar-deposit", slug: "/50-dollar-minimum-deposit-forex-brokers",   title: "$50 Minimum Deposit Forex Brokers",        category: "forex", sub: "deposit", priority: 3, icon: "banknote" },
  { id: "100-dollar-deposit",slug: "/100-dollar-minimum-deposit-forex-brokers",  title: "$100 Minimum Deposit Forex Brokers",       category: "forex", sub: "deposit", priority: 3, icon: "banknote" },
  { id: "500-dollar-deposit",slug: "/500-dollar-minimum-deposit-forex-brokers",  title: "$500 Minimum Deposit Forex Brokers",       category: "forex", sub: "deposit", priority: 3, icon: "banknote" },

  // ═══════════════════════════════════════════════════════════════
  // F. BY LEVERAGE (7)
  // ═══════════════════════════════════════════════════════════════
  { id: "high-leverage",       slug: "/best-high-leverage-forex-brokers",        title: "Best High Leverage Forex Brokers",          category: "forex", sub: "leverage", priority: 1, icon: "trending-up" },
  { id: "leverage-30",         slug: "/1-30-leverage-forex-brokers",             title: "1:30 Leverage Forex Brokers (EU)",          category: "forex", sub: "leverage", priority: 3, icon: "scale" },
  { id: "leverage-100",        slug: "/1-100-leverage-forex-brokers",            title: "1:100 Leverage Forex Brokers",              category: "forex", sub: "leverage", priority: 3, icon: "gauge" },
  { id: "leverage-200",        slug: "/1-200-leverage-forex-brokers",            title: "1:200 Leverage Forex Brokers",              category: "forex", sub: "leverage", priority: 3, icon: "gauge" },
  { id: "leverage-500",        slug: "/1-500-leverage-forex-brokers",            title: "1:500 Leverage Forex Brokers",              category: "forex", sub: "leverage", priority: 2, icon: "flame" },
  { id: "leverage-1000",       slug: "/1-1000-leverage-forex-brokers",           title: "1:1000 Leverage Forex Brokers",             category: "forex", sub: "leverage", priority: 2, icon: "zap" },
  { id: "unlimited-leverage",  slug: "/unlimited-leverage-forex-brokers",        title: "Unlimited Leverage Forex Brokers",          category: "forex", sub: "leverage", priority: 3, icon: "infinity" },

  // ═══════════════════════════════════════════════════════════════
  // G. BY BONUS & PROMOTIONS (5)
  // ═══════════════════════════════════════════════════════════════
  { id: "bonus",             slug: "/best-forex-brokers-with-bonus",           title: "Best Forex Brokers with Bonus",             category: "forex", sub: "bonus",   priority: 2, icon: "gift" },
  { id: "no-deposit-bonus",  slug: "/no-deposit-bonus-forex-brokers",          title: "No Deposit Bonus Forex Brokers",            category: "forex", sub: "bonus",   priority: 2, icon: "sparkles" },
  { id: "deposit-bonus",     slug: "/deposit-bonus-forex-brokers",             title: "Deposit Bonus Forex Brokers",               category: "forex", sub: "bonus",   priority: 2, icon: "badge-dollar-sign" },
  { id: "welcome-bonus",     slug: "/welcome-bonus-forex-brokers",             title: "Welcome Bonus Forex Brokers",               category: "forex", sub: "bonus",   priority: 3, icon: "party-popper" },
  { id: "loyalty-program",   slug: "/forex-brokers-loyalty-program",           title: "Forex Brokers with Loyalty Programs",        category: "forex", sub: "bonus",   priority: 3, icon: "crown" },

  // ═══════════════════════════════════════════════════════════════
  // H. BY TRADING PLATFORM (10)
  // ═══════════════════════════════════════════════════════════════
  { id: "mt4",             slug: "/best-metatrader-4-brokers",              title: "Best MetaTrader 4 (MT4) Brokers",           category: "forex", sub: "platform", priority: 1, icon: "chart-candlestick" },
  { id: "mt5",             slug: "/best-metatrader-5-brokers",              title: "Best MetaTrader 5 (MT5) Brokers",           category: "forex", sub: "platform", priority: 1, icon: "chart-line" },
  { id: "ctrader",         slug: "/best-ctrader-brokers",                   title: "Best cTrader Brokers",                      category: "forex", sub: "platform", priority: 2, icon: "chart-area" },
  { id: "tradingview",     slug: "/best-tradingview-brokers",               title: "Best TradingView Brokers",                  category: "forex", sub: "platform", priority: 1, icon: "chart-no-axes-combined" },
  { id: "ninjatrader",     slug: "/best-ninjatrader-brokers",               title: "Best NinjaTrader Brokers",                  category: "forex", sub: "platform", priority: 3, icon: "crosshair" },
  { id: "zulutrade",       slug: "/best-zulutrade-brokers",                 title: "Best ZuluTrade Brokers",                    category: "forex", sub: "platform", priority: 3, icon: "bar-chart-3" },
  { id: "prorealtime",     slug: "/best-prorealtime-brokers",               title: "Best ProRealTime Brokers",                  category: "forex", sub: "platform", priority: 3, icon: "chart-bar" },
  { id: "proprietary",     slug: "/forex-brokers-proprietary-platform",     title: "Forex Brokers with Proprietary Platforms",   category: "forex", sub: "platform", priority: 3, icon: "laptop" },
  { id: "trading-api",     slug: "/forex-brokers-trading-api",              title: "Forex Brokers with Trading API",            category: "forex", sub: "platform", priority: 3, icon: "code" },
  { id: "free-vps",        slug: "/forex-brokers-free-vps",                 title: "Forex Brokers with Free VPS",               category: "forex", sub: "platform", priority: 2, icon: "server" },

  // ═══════════════════════════════════════════════════════════════
  // I. MOBILE APPS (5)
  // ═══════════════════════════════════════════════════════════════
  { id: "trading-apps",     slug: "/best-forex-trading-apps",               title: "Best Forex Trading Apps",                   category: "forex", sub: "mobile",   priority: 1, icon: "smartphone" },
  { id: "apps-iphone",      slug: "/best-forex-apps-iphone",                title: "Best Forex Apps for iPhone",                category: "forex", sub: "mobile",   priority: 3, icon: "apple" },
  { id: "apps-android",     slug: "/best-forex-apps-android",               title: "Best Forex Apps for Android",               category: "forex", sub: "mobile",   priority: 3, icon: "bot" },
  { id: "crypto-apps",      slug: "/best-crypto-trading-apps",              title: "Best Crypto Trading Apps",                  category: "crypto", sub: "mobile",  priority: 2, icon: "monitor-smartphone" },
  { id: "stock-apps",       slug: "/best-stock-trading-apps",               title: "Best Stock Trading Apps",                   category: "stocks", sub: "mobile",  priority: 3, icon: "smartphone" },

  // ═══════════════════════════════════════════════════════════════
  // J. TRUST & SAFETY (5)
  // ═══════════════════════════════════════════════════════════════
  { id: "safest",                  slug: "/safest-forex-brokers",                       title: "Safest & Most Trusted Forex Brokers",         category: "forex", sub: "trust",  priority: 2, icon: "shield-check" },
  { id: "regulated",              slug: "/best-regulated-forex-brokers",                title: "Best Regulated Forex Brokers",                category: "forex", sub: "trust",  priority: 2, icon: "badge-check" },
  { id: "negative-balance",       slug: "/forex-brokers-negative-balance-protection",   title: "Forex Brokers with Negative Balance Protection", category: "forex", sub: "trust", priority: 3, icon: "shield-alert" },
  { id: "guaranteed-stop-loss",   slug: "/forex-brokers-guaranteed-stop-loss",          title: "Forex Brokers with Guaranteed Stop Loss",     category: "forex", sub: "trust",  priority: 3, icon: "shield" },
  { id: "segregated-accounts",    slug: "/forex-brokers-segregated-accounts",           title: "Forex Brokers with Segregated Accounts",      category: "forex", sub: "trust",  priority: 3, icon: "vault" },

  // ═══════════════════════════════════════════════════════════════
  // K. TOOLS & FEATURES (7)
  // ═══════════════════════════════════════════════════════════════
  { id: "education",          slug: "/best-forex-brokers-education",             title: "Best Forex Brokers for Education",           category: "forex", sub: "tools",  priority: 2, icon: "graduation-cap" },
  { id: "research",           slug: "/best-forex-brokers-research-tools",        title: "Best Forex Brokers with Research Tools",     category: "forex", sub: "tools",  priority: 3, icon: "microscope" },
  { id: "trading-central",    slug: "/forex-brokers-trading-central",            title: "Forex Brokers with Trading Central",         category: "forex", sub: "tools",  priority: 3, icon: "bar-chart-3" },
  { id: "autochartist",       slug: "/forex-brokers-autochartist",               title: "Forex Brokers with Autochartist",            category: "forex", sub: "tools",  priority: 3, icon: "scan-line" },
  { id: "economic-calendar",  slug: "/forex-brokers-economic-calendar",          title: "Forex Brokers with Economic Calendar",       category: "forex", sub: "tools",  priority: 3, icon: "calendar" },
  { id: "charting",           slug: "/best-forex-brokers-charting-tools",        title: "Best Forex Brokers with Charting Tools",     category: "forex", sub: "tools",  priority: 3, icon: "chart-line" },
  { id: "24-7-support",       slug: "/forex-brokers-24-7-support",              title: "Forex Brokers with 24/7 Support",            category: "forex", sub: "tools",  priority: 3, icon: "headphones" },

  // ═══════════════════════════════════════════════════════════════
  // L. CRYPTO BROKERS (12)
  // ═══════════════════════════════════════════════════════════════
  { id: "crypto-overall",     slug: "/best-crypto-brokers",                    title: "Best Crypto Brokers",                        category: "crypto", sub: "top",     priority: 1, icon: "bitcoin" },
  { id: "crypto-bitcoin",     slug: "/best-bitcoin-brokers",                   title: "Best Bitcoin Trading Platforms",              category: "crypto", sub: "coins",   priority: 1, icon: "bitcoin" },
  { id: "crypto-ethereum",    slug: "/best-ethereum-brokers",                  title: "Best Ethereum Trading Platforms",             category: "crypto", sub: "coins",   priority: 2, icon: "gem" },
  { id: "crypto-xrp",         slug: "/best-xrp-brokers",                      title: "Best Ripple (XRP) Brokers",                  category: "crypto", sub: "coins",   priority: 3, icon: "droplets" },
  { id: "crypto-solana",      slug: "/best-solana-brokers",                    title: "Best Solana Trading Platforms",               category: "crypto", sub: "coins",   priority: 3, icon: "sun" },
  { id: "crypto-doge",        slug: "/best-dogecoin-brokers",                  title: "Best Dogecoin Brokers",                      category: "crypto", sub: "coins",   priority: 3, icon: "dog" },
  { id: "crypto-altcoins",    slug: "/best-altcoin-brokers",                   title: "Best Altcoin Trading Platforms",              category: "crypto", sub: "coins",   priority: 2, icon: "coins" },
  { id: "crypto-staking",     slug: "/best-crypto-staking-platforms",          title: "Best Crypto Staking Platforms",               category: "crypto", sub: "feature", priority: 2, icon: "layers" },
  { id: "crypto-copy",        slug: "/best-crypto-copy-trading",              title: "Best Crypto Copy Trading Platforms",           category: "crypto", sub: "feature", priority: 3, icon: "copy" },
  { id: "crypto-high-lev",    slug: "/best-high-leverage-crypto-brokers",     title: "Best High Leverage Crypto Brokers",            category: "crypto", sub: "feature", priority: 2, icon: "trending-up" },
  { id: "crypto-low-spread",  slug: "/best-low-spread-crypto-brokers",        title: "Best Low Spread Crypto Brokers",               category: "crypto", sub: "feature", priority: 3, icon: "trending-down" },

  // ═══════════════════════════════════════════════════════════════
  // M. OTHER ASSET CLASSES (12)
  // ═══════════════════════════════════════════════════════════════
  { id: "cfd",           slug: "/best-cfd-brokers",                  title: "Best CFD Brokers",                     category: "assets", sub: "type",   priority: 1, icon: "chart-candlestick" },
  { id: "stocks",        slug: "/best-stock-brokers",                title: "Best Stock Trading Brokers",           category: "assets", sub: "type",   priority: 2, icon: "chart-no-axes-combined" },
  { id: "gold",          slug: "/best-gold-trading-brokers",         title: "Best Gold Trading Brokers",            category: "assets", sub: "type",   priority: 2, icon: "award" },
  { id: "silver",        slug: "/best-silver-trading-brokers",       title: "Best Silver Trading Brokers",          category: "assets", sub: "type",   priority: 3, icon: "circle-dollar-sign" },
  { id: "oil",           slug: "/best-oil-trading-brokers",          title: "Best Oil Trading Brokers",             category: "assets", sub: "type",   priority: 3, icon: "fuel" },
  { id: "commodities",   slug: "/best-commodities-brokers",          title: "Best Commodities Brokers",             category: "assets", sub: "type",   priority: 2, icon: "wheat" },
  { id: "indices",       slug: "/best-index-trading-brokers",        title: "Best Index Trading Brokers",           category: "assets", sub: "type",   priority: 2, icon: "bar-chart-3" },
  { id: "options",       slug: "/best-options-brokers",              title: "Best Options Brokers",                 category: "assets", sub: "type",   priority: 2, icon: "toggle-right" },
  { id: "futures",       slug: "/best-futures-brokers",              title: "Best Futures Brokers",                 category: "assets", sub: "type",   priority: 2, icon: "hourglass" },
  { id: "etf",           slug: "/best-etf-brokers",                  title: "Best ETF Brokers",                     category: "assets", sub: "type",   priority: 3, icon: "package" },
  { id: "spread-betting",slug: "/best-spread-betting-brokers",       title: "Best Spread Betting Brokers",          category: "assets", sub: "type",   priority: 2, icon: "dice-6" },
  { id: "bonds",         slug: "/best-bond-trading-brokers",         title: "Best Bond Trading Brokers",            category: "assets", sub: "type",   priority: 3, icon: "landmark" },

  // ═══════════════════════════════════════════════════════════════
  // N. BY CURRENCY PAIR (10)
  // ═══════════════════════════════════════════════════════════════
  { id: "eurusd",    slug: "/best-eurusd-brokers",           title: "Best EUR/USD Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "globe" },
  { id: "gbpusd",    slug: "/best-gbpusd-brokers",           title: "Best GBP/USD Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "globe" },
  { id: "usdjpy",    slug: "/best-usdjpy-brokers",           title: "Best USD/JPY Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "globe" },
  { id: "audusd",    slug: "/best-audusd-brokers",           title: "Best AUD/USD Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "globe" },
  { id: "usdcad",    slug: "/best-usdcad-brokers",           title: "Best USD/CAD Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "globe" },
  { id: "eurgbp",    slug: "/best-eurgbp-brokers",           title: "Best EUR/GBP Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "globe" },
  { id: "usdchf",    slug: "/best-usdchf-brokers",           title: "Best USD/CHF Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "globe" },
  { id: "nzdusd",    slug: "/best-nzdusd-brokers",           title: "Best NZD/USD Brokers",              category: "forex", sub: "pairs", priority: 3, icon: "globe" },
  { id: "exotic",    slug: "/best-exotic-pairs-brokers",     title: "Best Exotic Pairs Brokers",         category: "forex", sub: "pairs", priority: 3, icon: "palm-tree" },
  { id: "minor",     slug: "/best-minor-pairs-brokers",      title: "Best Minor Pairs Brokers",          category: "forex", sub: "pairs", priority: 3, icon: "arrow-right-left" },

  // ═══════════════════════════════════════════════════════════════
  // O. BY INDEX (6)
  // ═══════════════════════════════════════════════════════════════
  { id: "sp500",     slug: "/best-sp500-brokers",            title: "Best S&P 500 Trading Brokers",      category: "assets", sub: "index", priority: 3, icon: "building-2" },
  { id: "nasdaq",    slug: "/best-nasdaq-brokers",           title: "Best NASDAQ Trading Brokers",       category: "assets", sub: "index", priority: 3, icon: "laptop" },
  { id: "dow",       slug: "/best-dow-jones-brokers",        title: "Best Dow Jones Trading Brokers",    category: "assets", sub: "index", priority: 3, icon: "landmark" },
  { id: "ftse",      slug: "/best-ftse-100-brokers",         title: "Best FTSE 100 Trading Brokers",     category: "assets", sub: "index", priority: 3, icon: "globe" },
  { id: "dax",       slug: "/best-dax-brokers",              title: "Best DAX Trading Brokers",          category: "assets", sub: "index", priority: 3, icon: "globe" },
  { id: "nikkei",    slug: "/best-nikkei-brokers",           title: "Best Nikkei 225 Trading Brokers",   category: "assets", sub: "index", priority: 3, icon: "globe" },

  // ═══════════════════════════════════════════════════════════════
  // P. BY PAYMENT METHOD (14)
  // ═══════════════════════════════════════════════════════════════
  { id: "pay-paypal",       slug: "/forex-brokers-accepting-paypal",         title: "Forex Brokers Accepting PayPal",           category: "forex", sub: "payment", priority: 2, icon: "credit-card" },
  { id: "pay-skrill",       slug: "/forex-brokers-accepting-skrill",         title: "Forex Brokers Accepting Skrill",           category: "forex", sub: "payment", priority: 3, icon: "wallet" },
  { id: "pay-neteller",     slug: "/forex-brokers-accepting-neteller",       title: "Forex Brokers Accepting Neteller",         category: "forex", sub: "payment", priority: 3, icon: "wallet" },
  { id: "pay-bitcoin",      slug: "/forex-brokers-accepting-bitcoin",        title: "Forex Brokers Accepting Bitcoin",          category: "forex", sub: "payment", priority: 2, icon: "bitcoin" },
  { id: "pay-crypto",       slug: "/forex-brokers-accepting-crypto",         title: "Forex Brokers Accepting Crypto",           category: "forex", sub: "payment", priority: 3, icon: "coins" },
  { id: "pay-credit-card",  slug: "/forex-brokers-accepting-credit-cards",   title: "Forex Brokers Accepting Credit Cards",     category: "forex", sub: "payment", priority: 3, icon: "credit-card" },
  { id: "pay-visa",         slug: "/forex-brokers-accepting-visa",           title: "Forex Brokers Accepting Visa",             category: "forex", sub: "payment", priority: 3, icon: "credit-card" },
  { id: "pay-bank-transfer",slug: "/forex-brokers-accepting-bank-transfer",  title: "Forex Brokers Accepting Bank Transfer",    category: "forex", sub: "payment", priority: 3, icon: "landmark" },
  { id: "pay-apple-pay",    slug: "/forex-brokers-accepting-apple-pay",      title: "Forex Brokers Accepting Apple Pay",        category: "forex", sub: "payment", priority: 3, icon: "apple" },
  { id: "pay-google-pay",   slug: "/forex-brokers-accepting-google-pay",     title: "Forex Brokers Accepting Google Pay",       category: "forex", sub: "payment", priority: 3, icon: "smartphone" },
  { id: "pay-perfect-money",slug: "/forex-brokers-accepting-perfect-money",  title: "Forex Brokers Accepting Perfect Money",    category: "forex", sub: "payment", priority: 3, icon: "circle-dollar-sign" },
  { id: "pay-webmoney",     slug: "/forex-brokers-accepting-webmoney",       title: "Forex Brokers Accepting WebMoney",         category: "forex", sub: "payment", priority: 3, icon: "dollar-sign" },
  { id: "pay-upi",          slug: "/forex-brokers-accepting-upi",            title: "Forex Brokers Accepting UPI",              category: "forex", sub: "payment", priority: 3, icon: "receipt" },
  { id: "pay-pix",          slug: "/forex-brokers-accepting-pix",            title: "Forex Brokers Accepting PIX",              category: "forex", sub: "payment", priority: 3, icon: "receipt" },

  // ═══════════════════════════════════════════════════════════════
  // Q. BY REGULATOR (10)
  // ═══════════════════════════════════════════════════════════════
  { id: "reg-fca",    slug: "/fca-regulated-forex-brokers",          title: "FCA Regulated Forex Brokers",            category: "forex", sub: "regulator", priority: 2, icon: "shield-check" },
  { id: "reg-asic",   slug: "/asic-regulated-forex-brokers",         title: "ASIC Regulated Forex Brokers",           category: "forex", sub: "regulator", priority: 2, icon: "shield-check" },
  { id: "reg-cysec",  slug: "/cysec-regulated-forex-brokers",        title: "CySEC Regulated Forex Brokers",          category: "forex", sub: "regulator", priority: 2, icon: "shield-check" },
  { id: "reg-nfa",    slug: "/nfa-regulated-forex-brokers",          title: "NFA / CFTC Regulated Forex Brokers",     category: "forex", sub: "regulator", priority: 3, icon: "shield-check" },
  { id: "reg-bafin",  slug: "/bafin-regulated-forex-brokers",        title: "BaFin Regulated Forex Brokers",          category: "forex", sub: "regulator", priority: 3, icon: "shield-check" },
  { id: "reg-mas",    slug: "/mas-regulated-forex-brokers",          title: "MAS Regulated Forex Brokers",            category: "forex", sub: "regulator", priority: 3, icon: "shield-check" },
  { id: "reg-dfsa",   slug: "/dfsa-regulated-forex-brokers",         title: "DFSA Regulated Forex Brokers",           category: "forex", sub: "regulator", priority: 3, icon: "shield-check" },
  { id: "reg-fsca",   slug: "/fsca-regulated-forex-brokers",         title: "FSCA Regulated Forex Brokers",           category: "forex", sub: "regulator", priority: 3, icon: "shield-check" },
  { id: "reg-scb",    slug: "/scb-regulated-forex-brokers",          title: "SCB Regulated Forex Brokers",            category: "forex", sub: "regulator", priority: 3, icon: "shield-check" },
  { id: "reg-offshore",slug: "/offshore-forex-brokers",              title: "Offshore Forex Brokers",                 category: "forex", sub: "regulator", priority: 3, icon: "palm-tree" },

  // ═══════════════════════════════════════════════════════════════
  // R. BY COUNTRY (40)
  // ═══════════════════════════════════════════════════════════════
  // Tier 1 GEO
  { id: "geo-uk",          slug: "/best-forex-brokers-uk",               title: "Best Forex Brokers UK",                category: "country", sub: "tier1", priority: 1, icon: "globe" },
  { id: "geo-australia",   slug: "/best-forex-brokers-australia",        title: "Best Forex Brokers Australia",         category: "country", sub: "tier1", priority: 1, icon: "globe" },
  { id: "geo-usa",         slug: "/best-forex-brokers-usa",              title: "Best Forex Brokers USA",               category: "country", sub: "tier1", priority: 1, icon: "globe" },
  { id: "geo-germany",     slug: "/best-forex-brokers-germany",          title: "Best Forex Brokers Germany",           category: "country", sub: "tier1", priority: 2, icon: "globe" },
  { id: "geo-canada",      slug: "/best-forex-brokers-canada",           title: "Best Forex Brokers Canada",            category: "country", sub: "tier1", priority: 2, icon: "globe" },
  { id: "geo-switzerland", slug: "/best-forex-brokers-switzerland",      title: "Best Forex Brokers Switzerland",       category: "country", sub: "tier1", priority: 3, icon: "globe" },
  { id: "geo-singapore",   slug: "/best-forex-brokers-singapore",        title: "Best Forex Brokers Singapore",         category: "country", sub: "tier1", priority: 2, icon: "globe" },
  { id: "geo-uae",         slug: "/best-forex-brokers-uae",              title: "Best Forex Brokers UAE",               category: "country", sub: "tier1", priority: 2, icon: "globe" },
  { id: "geo-japan",       slug: "/best-forex-brokers-japan",            title: "Best Forex Brokers Japan",             category: "country", sub: "tier1", priority: 3, icon: "globe" },
  { id: "geo-hongkong",    slug: "/best-forex-brokers-hong-kong",        title: "Best Forex Brokers Hong Kong",         category: "country", sub: "tier1", priority: 3, icon: "globe" },
  // Tier 2 GEO
  { id: "geo-europe",       slug: "/best-forex-brokers-europe",          title: "Best Forex Brokers Europe",            category: "country", sub: "tier2", priority: 2, icon: "globe" },
  { id: "geo-south-africa", slug: "/best-forex-brokers-south-africa",    title: "Best Forex Brokers South Africa",      category: "country", sub: "tier2", priority: 2, icon: "globe" },
  { id: "geo-india",        slug: "/best-forex-brokers-india",           title: "Best Forex Brokers India",             category: "country", sub: "tier2", priority: 2, icon: "globe" },
  { id: "geo-malaysia",     slug: "/best-forex-brokers-malaysia",        title: "Best Forex Brokers Malaysia",          category: "country", sub: "tier2", priority: 2, icon: "globe" },
  { id: "geo-new-zealand",  slug: "/best-forex-brokers-new-zealand",     title: "Best Forex Brokers New Zealand",       category: "country", sub: "tier2", priority: 3, icon: "globe" },
  { id: "geo-france",       slug: "/best-forex-brokers-france",          title: "Best Forex Brokers France",            category: "country", sub: "tier2", priority: 3, icon: "globe" },
  { id: "geo-spain",        slug: "/best-forex-brokers-spain",           title: "Best Forex Brokers Spain",             category: "country", sub: "tier2", priority: 3, icon: "globe" },
  { id: "geo-italy",        slug: "/best-forex-brokers-italy",           title: "Best Forex Brokers Italy",             category: "country", sub: "tier2", priority: 3, icon: "globe" },
  { id: "geo-netherlands",  slug: "/best-forex-brokers-netherlands",     title: "Best Forex Brokers Netherlands",       category: "country", sub: "tier2", priority: 3, icon: "globe" },
  { id: "geo-sweden",       slug: "/best-forex-brokers-sweden",          title: "Best Forex Brokers Sweden",            category: "country", sub: "tier2", priority: 3, icon: "globe" },
  { id: "geo-saudi",        slug: "/best-forex-brokers-saudi-arabia",    title: "Best Forex Brokers Saudi Arabia",      category: "country", sub: "tier2", priority: 2, icon: "globe" },
  { id: "geo-kuwait",       slug: "/best-forex-brokers-kuwait",          title: "Best Forex Brokers Kuwait",            category: "country", sub: "tier2", priority: 3, icon: "globe" },
  { id: "geo-qatar",        slug: "/best-forex-brokers-qatar",           title: "Best Forex Brokers Qatar",             category: "country", sub: "tier2", priority: 3, icon: "globe" },
  // Tier 3 GEO
  { id: "geo-nigeria",      slug: "/best-forex-brokers-nigeria",         title: "Best Forex Brokers Nigeria",           category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-philippines",  slug: "/best-forex-brokers-philippines",     title: "Best Forex Brokers Philippines",       category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-indonesia",    slug: "/best-forex-brokers-indonesia",       title: "Best Forex Brokers Indonesia",         category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-turkey",       slug: "/best-forex-brokers-turkey",          title: "Best Forex Brokers Turkey",            category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-brazil",       slug: "/best-forex-brokers-brazil",          title: "Best Forex Brokers Brazil",            category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-mexico",       slug: "/best-forex-brokers-mexico",          title: "Best Forex Brokers Mexico",            category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-pakistan",      slug: "/best-forex-brokers-pakistan",        title: "Best Forex Brokers Pakistan",          category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-kenya",        slug: "/best-forex-brokers-kenya",           title: "Best Forex Brokers Kenya",             category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-ghana",        slug: "/best-forex-brokers-ghana",           title: "Best Forex Brokers Ghana",             category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-thailand",     slug: "/best-forex-brokers-thailand",        title: "Best Forex Brokers Thailand",          category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-vietnam",      slug: "/best-forex-brokers-vietnam",         title: "Best Forex Brokers Vietnam",           category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-bangladesh",   slug: "/best-forex-brokers-bangladesh",      title: "Best Forex Brokers Bangladesh",        category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-colombia",     slug: "/best-forex-brokers-colombia",        title: "Best Forex Brokers Colombia",          category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-egypt",        slug: "/best-forex-brokers-egypt",           title: "Best Forex Brokers Egypt",             category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-poland",       slug: "/best-forex-brokers-poland",          title: "Best Forex Brokers Poland",            category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-romania",      slug: "/best-forex-brokers-romania",         title: "Best Forex Brokers Romania",           category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-south-korea",  slug: "/best-forex-brokers-south-korea",     title: "Best Forex Brokers South Korea",       category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-oman",         slug: "/best-forex-brokers-oman",            title: "Best Forex Brokers Oman",              category: "country", sub: "tier3", priority: 3, icon: "globe" },

  // ═══════════════════════════════════════════════════════════════
  // T. NEW THEMATIC (4)
  // ═══════════════════════════════════════════════════════════════
  { id: "natural-gas",      slug: "/best-natural-gas-brokers",         title: "Best Natural Gas Trading Brokers",       category: "assets", sub: "type",    priority: 3, icon: "flame" },
  { id: "real-stocks",      slug: "/best-real-stock-brokers",          title: "Best Brokers for Real Stock Trading",    category: "assets", sub: "type",    priority: 2, icon: "chart-no-axes-combined" },
  { id: "multi-asset",      slug: "/best-multi-asset-brokers",         title: "Best Multi-Asset Brokers",               category: "assets", sub: "type",    priority: 2, icon: "layers" },
  { id: "no-kyc",           slug: "/no-kyc-forex-brokers",             title: "No KYC Forex Brokers",                   category: "forex",  sub: "accounts", priority: 3, icon: "user-x" },

  // ═══════════════════════════════════════════════════════════════
  // U. CFD BROKERS (7) — M4 Umbrella
  // ═══════════════════════════════════════════════════════════════
  { id: "cfd-beginners",       slug: "/best-cfd-brokers-for-beginners",       title: "Best CFD Brokers for Beginners",           category: "cfd", sub: "audience",  priority: 1, icon: "graduation-cap", vertical: "cfd" },
  { id: "cfd-professionals",   slug: "/best-cfd-brokers-for-professionals",   title: "Best CFD Brokers for Professionals",        category: "cfd", sub: "audience",  priority: 2, icon: "briefcase",      vertical: "cfd" },
  { id: "cfd-low-spread",      slug: "/lowest-spread-cfd-brokers",            title: "Lowest Spread CFD Brokers",                 category: "cfd", sub: "costs",     priority: 1, icon: "trending-down",  vertical: "cfd" },
  { id: "cfd-low-cost",        slug: "/best-low-cost-cfd-brokers",            title: "Best Low Cost CFD Brokers",                 category: "cfd", sub: "costs",     priority: 2, icon: "piggy-bank",     vertical: "cfd" },
  { id: "cfd-uk",              slug: "/best-cfd-brokers-uk",                  title: "Best CFD Brokers UK",                       category: "cfd", sub: "country",   priority: 1, icon: "globe",          vertical: "cfd" },
  { id: "cfd-australia",       slug: "/best-cfd-brokers-australia",           title: "Best CFD Brokers Australia",                category: "cfd", sub: "country",   priority: 2, icon: "globe",          vertical: "cfd" },
  { id: "cfd-charting",        slug: "/best-cfd-brokers-charting",            title: "Best CFD Brokers with Charting Tools",      category: "cfd", sub: "platform",  priority: 3, icon: "bar-chart-3",    vertical: "cfd" },

  // ═══════════════════════════════════════════════════════════════
  // V. COPY TRADING (8) — M4 Umbrella
  // ═══════════════════════════════════════════════════════════════
  { id: "ct-beginners",        slug: "/best-copy-trading-for-beginners",          title: "Best Copy Trading Platforms for Beginners",   category: "copy-trading", sub: "audience",  priority: 1, icon: "graduation-cap", vertical: "copy-trading" },
  { id: "ct-apps",             slug: "/best-copy-trading-apps",                   title: "Best Copy Trading Apps",                      category: "copy-trading", sub: "platform",  priority: 1, icon: "smartphone",     vertical: "copy-trading" },
  { id: "ct-forex",            slug: "/best-forex-copy-trading-platforms",        title: "Best Forex Copy Trading Platforms",            category: "copy-trading", sub: "asset",     priority: 2, icon: "trending-up",    vertical: "copy-trading" },
  { id: "ct-stocks",           slug: "/best-stock-copy-trading-platforms",        title: "Best Stock Copy Trading Platforms",            category: "copy-trading", sub: "asset",     priority: 2, icon: "building-2",     vertical: "copy-trading" },
  { id: "ct-free",             slug: "/best-free-copy-trading-platforms",         title: "Best Free Copy Trading Platforms",             category: "copy-trading", sub: "costs",     priority: 2, icon: "circle-check",   vertical: "copy-trading" },
  { id: "ct-myfxbook",         slug: "/best-myfxbook-autotrade-brokers",         title: "Best Myfxbook AutoTrade Brokers",              category: "copy-trading", sub: "platform",  priority: 3, icon: "bar-chart-3",    vertical: "copy-trading" },
  { id: "ct-uk",               slug: "/best-copy-trading-uk",                    title: "Best Copy Trading Platforms UK",               category: "copy-trading", sub: "country",   priority: 2, icon: "globe",          vertical: "copy-trading" },
  { id: "ct-usa",              slug: "/best-copy-trading-usa",                   title: "Best Copy Trading Platforms USA",              category: "copy-trading", sub: "country",   priority: 2, icon: "globe",          vertical: "copy-trading" },

  // ═══════════════════════════════════════════════════════════════
  // W. SPREAD BETTING (8) — M4 Umbrella
  // ═══════════════════════════════════════════════════════════════
  { id: "sb-beginners",        slug: "/best-spread-betting-for-beginners",        title: "Best Spread Betting Platforms for Beginners",  category: "spread-betting", sub: "audience",  priority: 1, icon: "graduation-cap", vertical: "spread-betting" },
  { id: "sb-apps",             slug: "/best-spread-betting-apps",                 title: "Best Spread Betting Apps",                     category: "spread-betting", sub: "platform",  priority: 1, icon: "smartphone",     vertical: "spread-betting" },
  { id: "sb-day-trading",      slug: "/best-spread-betting-day-trading",          title: "Best Spread Betting for Day Trading",          category: "spread-betting", sub: "style",     priority: 2, icon: "sun",            vertical: "spread-betting" },
  { id: "sb-scalping",         slug: "/best-spread-betting-scalping",             title: "Best Spread Betting for Scalping",             category: "spread-betting", sub: "style",     priority: 3, icon: "crosshair",      vertical: "spread-betting" },
  { id: "sb-forex",            slug: "/best-forex-spread-betting",                title: "Best Forex Spread Betting Platforms",          category: "spread-betting", sub: "asset",     priority: 2, icon: "trending-up",    vertical: "spread-betting" },
  { id: "sb-shares",           slug: "/best-shares-spread-betting",               title: "Best Shares Spread Betting Platforms",         category: "spread-betting", sub: "asset",     priority: 2, icon: "building-2",     vertical: "spread-betting" },
  { id: "sb-indices",          slug: "/best-index-spread-betting",                title: "Best Index Spread Betting Platforms",          category: "spread-betting", sub: "asset",     priority: 3, icon: "bar-chart-3",    vertical: "spread-betting" },
  { id: "sb-uk",               slug: "/best-spread-betting-uk",                   title: "Best Spread Betting Platforms UK",             category: "spread-betting", sub: "country",   priority: 1, icon: "globe",          vertical: "spread-betting" },

  // ═══════════════════════════════════════════════════════════════
  // X. CRYPTO EXPANSION (14) — M4 Umbrella
  // ═══════════════════════════════════════════════════════════════
  { id: "crypto-beginners",    slug: "/best-crypto-brokers-for-beginners",        title: "Best Crypto Brokers for Beginners",            category: "crypto", sub: "audience",  priority: 1, icon: "graduation-cap", vertical: "crypto" },
  { id: "crypto-regulated",    slug: "/best-regulated-crypto-brokers",            title: "Best Regulated Crypto Brokers",                category: "crypto", sub: "trust",     priority: 1, icon: "shield-check",   vertical: "crypto" },
  { id: "crypto-cardano",      slug: "/best-cardano-brokers",                     title: "Best Cardano (ADA) Brokers",                   category: "crypto", sub: "coins",     priority: 3, icon: "bitcoin",        vertical: "crypto" },
  { id: "crypto-usdt",         slug: "/best-usdt-trading-platforms",              title: "Best USDT Trading Platforms",                  category: "crypto", sub: "coins",     priority: 2, icon: "bitcoin",        vertical: "crypto" },
  { id: "crypto-btc-etf",      slug: "/best-bitcoin-etf-brokers",                title: "Best Bitcoin ETF Brokers",                     category: "crypto", sub: "coins",     priority: 1, icon: "bitcoin",        vertical: "crypto" },
  { id: "crypto-margin",       slug: "/best-crypto-margin-trading",              title: "Best Crypto Margin Trading Platforms",         category: "crypto", sub: "feature",   priority: 2, icon: "scale",          vertical: "crypto" },
  { id: "crypto-demo",         slug: "/best-crypto-demo-accounts",               title: "Best Crypto Demo Accounts",                    category: "crypto", sub: "feature",   priority: 3, icon: "test-tube",      vertical: "crypto" },
  { id: "crypto-uk",           slug: "/best-crypto-brokers-uk",                  title: "Best Crypto Brokers UK",                       category: "crypto", sub: "country",   priority: 1, icon: "globe",          vertical: "crypto" },
  { id: "crypto-usa",          slug: "/best-crypto-brokers-usa",                 title: "Best Crypto Brokers USA",                      category: "crypto", sub: "country",   priority: 1, icon: "globe",          vertical: "crypto" },
  { id: "crypto-australia",    slug: "/best-crypto-brokers-australia",           title: "Best Crypto Brokers Australia",                category: "crypto", sub: "country",   priority: 2, icon: "globe",          vertical: "crypto" },
  { id: "crypto-canada",       slug: "/best-crypto-brokers-canada",              title: "Best Crypto Brokers Canada",                   category: "crypto", sub: "country",   priority: 2, icon: "globe",          vertical: "crypto" },
  { id: "crypto-germany",      slug: "/best-crypto-brokers-germany",             title: "Best Crypto Brokers Germany",                  category: "crypto", sub: "country",   priority: 3, icon: "globe",          vertical: "crypto" },
  { id: "crypto-exchanges",    slug: "/best-crypto-exchanges",                   title: "Best Crypto Exchanges",                        category: "crypto", sub: "type",      priority: 1, icon: "repeat",         vertical: "crypto" },
  { id: "crypto-wallets",      slug: "/best-crypto-wallets",                     title: "Best Crypto Wallets",                          category: "crypto", sub: "type",      priority: 2, icon: "wallet",         vertical: "crypto" },

  // ═══════════════════════════════════════════════════════════════
  // Y. FOREX GAPS (16) — M4 Umbrella
  // ═══════════════════════════════════════════════════════════════
  // Countries
  { id: "geo-portugal",        slug: "/best-forex-brokers-portugal",              title: "Best Forex Brokers Portugal",                  category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-denmark",         slug: "/best-forex-brokers-denmark",               title: "Best Forex Brokers Denmark",                   category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-norway",          slug: "/best-forex-brokers-norway",                title: "Best Forex Brokers Norway",                    category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-finland",         slug: "/best-forex-brokers-finland",               title: "Best Forex Brokers Finland",                   category: "country", sub: "tier3", priority: 3, icon: "globe" },
  { id: "geo-greece",          slug: "/best-forex-brokers-greece",                title: "Best Forex Brokers Greece",                    category: "country", sub: "tier3", priority: 3, icon: "globe" },
  // Regulators
  { id: "reg-fsa",             slug: "/fsa-regulated-forex-brokers",              title: "FSA Regulated Forex Brokers",                  category: "forex", sub: "regulator", priority: 3, icon: "shield" },
  { id: "reg-ifsc",            slug: "/ifsc-regulated-forex-brokers",             title: "IFSC Regulated Forex Brokers",                 category: "forex", sub: "regulator", priority: 3, icon: "shield" },
  { id: "reg-vfsc",            slug: "/vfsc-regulated-forex-brokers",             title: "VFSC Regulated Forex Brokers",                 category: "forex", sub: "regulator", priority: 3, icon: "shield" },
  // Platform
  { id: "forex-mac",           slug: "/best-forex-brokers-mac",                   title: "Best Forex Brokers for Mac",                   category: "forex", sub: "platform", priority: 3, icon: "monitor" },
  // Pairs
  { id: "pair-usdcny",         slug: "/best-usdcny-brokers",                     title: "Best USD/CNY Brokers",                         category: "forex", sub: "pairs",    priority: 3, icon: "refresh-cw" },
  // Leverage
  { id: "leverage-50",         slug: "/1-50-leverage-forex-brokers",              title: "1:50 Leverage Forex Brokers",                  category: "forex", sub: "leverage", priority: 3, icon: "scale" },
  { id: "leverage-300",        slug: "/1-300-leverage-forex-brokers",             title: "1:300 Leverage Forex Brokers",                 category: "forex", sub: "leverage", priority: 3, icon: "scale" },
  // Education / Tools
  { id: "forex-courses",       slug: "/best-forex-trading-courses",               title: "Best Forex Trading Courses",                   category: "forex", sub: "tools",    priority: 2, icon: "book-open" },
  { id: "forex-charts",        slug: "/best-forex-chart-websites",                title: "Best Forex Chart Websites",                    category: "forex", sub: "tools",    priority: 3, icon: "bar-chart-3" },
  // Payment
  { id: "pay-amex",            slug: "/forex-brokers-accepting-amex",             title: "Forex Brokers Accepting Amex",                 category: "forex", sub: "payment",  priority: 3, icon: "credit-card" },
  { id: "pay-trustly",         slug: "/forex-brokers-accepting-trustly",          title: "Forex Brokers Accepting Trustly",              category: "forex", sub: "payment",  priority: 3, icon: "credit-card" },
];

export default RANKINGS;

// ── Combinatorial rankings integration ──
import { getCombiRankingBySlug, COMBINATORIAL_RANKINGS } from "./combinatorialRankings";

// ── Helper functions ──

export function getRankingBySlug(slug) {
  return RANKINGS.find((r) => r.slug === slug) || getCombiRankingBySlug(slug);
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
  return [...RANKINGS.map((r) => r.slug), ...COMBINATORIAL_RANKINGS.map((r) => r.slug)];
}

// Stats
export const RANKING_STATS = {
  total: RANKINGS.length,
  priority1: RANKINGS.filter((r) => r.priority === 1).length,
  priority2: RANKINGS.filter((r) => r.priority === 2).length,
  priority3: RANKINGS.filter((r) => r.priority === 3).length,
  categories: [...new Set(RANKINGS.map((r) => r.category))],
};
