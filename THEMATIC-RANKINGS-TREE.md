# Thematic Rankings Tree — RatedBrokers

> Полное дерево тематических рейтингов по 9 категориям.
> Источники: BrokerChooser, BestBrokers, ForexBrokers.com, Investopedia, NerdWallet + собственный анализ search volume.
>
> **Маркировка:**
> - `[EXISTS]` — страница уже существует на RatedBrokers (из 201 thematic + 31 combi)
> - `[NEW]` — нужно создать (наши брокеры уже покрывают нишу)
> - `[FUTURE]` — Phase 2+ (нужны новые брокеры, которых у нас нет)
>
> Дата: 31 марта 2026

---

## 1. FOREX BROKERS

**Основная money page:** `/best-forex-brokers` [EXISTS]

```
FOREX BROKERS
├── MAIN
│   └── Best Forex Brokers (/best-forex-brokers) [EXISTS] — главная money page
│
├── BY AUDIENCE / EXPERIENCE
│   ├── Best Forex Brokers for Beginners (/best-forex-brokers-for-beginners) [EXISTS]
│   │   Конкуренты: BC, BB, FB, NW — все имеют. Volume: 12K+/мес
│   ├── Best Forex Brokers for Professionals (/best-forex-brokers-for-professionals) [EXISTS]
│   │   BC, BB, FB. Volume: 3K/мес
│   ├── Best Forex Brokers for Small Accounts (/best-forex-brokers-small-accounts) [EXISTS]
│   │   BB (micro accounts). Volume: 2K/мес
│   ├── Best Forex Brokers for Large Accounts (/best-forex-brokers-large-accounts) [EXISTS]
│   │   BB. Volume: 1.5K/мес
│   └── Best Forex Brokers for Students (/best-forex-brokers-for-students) [NEW]
│       Нет у конкурентов. Volume: 800/мес — long-tail, низкая конкуренция
│
├── BY TRADING STYLE
│   ├── Best Forex Brokers for Scalping (/best-forex-brokers-for-scalping) [EXISTS]
│   │   BC, BB, FB. Volume: 8K/мес
│   ├── Best Forex Brokers for Day Trading (/best-forex-brokers-for-day-trading) [EXISTS]
│   │   BB, FB. Volume: 6K/мес
│   ├── Best Forex Brokers for Swing Trading (/best-forex-brokers-for-swing-trading) [EXISTS]
│   │   FB (trend trading). Volume: 3K/мес
│   ├── Best Forex Brokers for Position Trading (/best-forex-brokers-for-position-trading) [EXISTS]
│   │   Volume: 1K/мес
│   ├── Best Forex Brokers for Hedging (/best-forex-brokers-for-hedging) [EXISTS]
│   │   BB, FB. Volume: 4K/мес
│   ├── Best Forex Brokers for News Trading (/best-forex-brokers-for-news-trading) [EXISTS]
│   │   Volume: 1.5K/мес
│   ├── Best Forex Brokers for Carry Trading (/best-forex-brokers-for-carry-trading) [EXISTS]
│   │   Volume: 800/мес
│   ├── Best Forex Brokers for Grid Trading (/best-forex-brokers-for-grid-trading) [EXISTS]
│   │   FB. Volume: 1K/мес
│   ├── Best Forex Brokers for Technical Analysis (/best-forex-brokers-charting-tools) [EXISTS]
│   │   BC (quality charting). Volume: 2K/мес
│   └── Best Forex Brokers for Fundamental Analysis (/best-forex-brokers-research-tools) [EXISTS]
│       FB (research). Volume: 1.5K/мес
│
├── BY COST / SPREAD
│   ├── Lowest Spread Forex Brokers (/lowest-spread-forex-brokers) [EXISTS]
│   │   BC, BB, FB. Volume: 15K/мес — TOP PRIORITY
│   ├── Zero Spread Forex Brokers (/zero-spread-forex-brokers) [EXISTS]
│   │   Volume: 8K/мес
│   ├── Best Low Cost Forex Brokers (/best-low-cost-forex-brokers) [EXISTS]
│   │   BB. Volume: 5K/мес
│   ├── Lowest Commission Forex Brokers (/lowest-commission-forex-brokers) [EXISTS]
│   │   Volume: 4K/мес
│   ├── Forex Brokers No Hidden Fees (/forex-brokers-no-hidden-fees) [EXISTS]
│   │   Volume: 2K/мес
│   ├── Forex Brokers No Inactivity Fee (/forex-brokers-no-inactivity-fee) [EXISTS]
│   │   Volume: 3K/мес
│   ├── Forex Brokers Cashback & Rebates (/forex-brokers-cashback-rebates) [EXISTS]
│   │   Volume: 2K/мес
│   ├── Forex Brokers Free Deposits (/forex-brokers-free-deposits) [EXISTS]
│   │   Volume: 1.5K/мес
│   ├── Forex Brokers Free Withdrawals (/forex-brokers-free-withdrawals) [EXISTS]
│   │   Volume: 2K/мес
│   └── Forex Brokers Instant Withdrawal (/forex-brokers-instant-withdrawal) [EXISTS]
│       Volume: 3K/мес
│
├── BY EXECUTION MODEL
│   ├── Best ECN Forex Brokers (/best-ecn-forex-brokers) [EXISTS]
│   │   BB, FB. Volume: 10K/мес — HIGH
│   ├── Best STP Forex Brokers (/best-stp-forex-brokers) [EXISTS]
│   │   Volume: 5K/мес
│   ├── Best NDD Forex Brokers (/best-ndd-forex-brokers) [EXISTS]
│   │   BB. Volume: 3K/мес
│   ├── Best DMA Forex Brokers (/best-dma-forex-brokers) [EXISTS]
│   │   Volume: 2K/мес
│   ├── Best A-Book Forex Brokers (/best-a-book-forex-brokers) [EXISTS]
│   │   Volume: 1K/мес
│   ├── Market Maker Forex Brokers (/market-maker-forex-brokers) [EXISTS]
│   │   BB, FB. Volume: 4K/мес
│   └── Best Fast Execution Forex Brokers (/best-fast-execution-forex-brokers) [EXISTS]
│       Volume: 2K/мес
│
├── BY PLATFORM
│   ├── Best MetaTrader 4 Brokers (/best-metatrader-4-brokers) [EXISTS]
│   │   BB, FB. Volume: 12K/мес — HIGH
│   ├── Best MetaTrader 5 Brokers (/best-metatrader-5-brokers) [EXISTS]
│   │   BB, FB. Volume: 10K/мес — HIGH
│   ├── Best cTrader Brokers (/best-ctrader-brokers) [EXISTS]
│   │   BB, FB. Volume: 5K/мес
│   ├── Best TradingView Brokers (/best-tradingview-brokers) [EXISTS]
│   │   BC, BB, FB. Volume: 8K/мес — HIGH
│   ├── Forex Brokers Proprietary Platform (/forex-brokers-proprietary-platform) [EXISTS]
│   │   Volume: 1.5K/мес
│   ├── Forex Brokers Trading API (/forex-brokers-trading-api) [EXISTS]
│   │   FB (API brokers). Volume: 2K/мес
│   ├── Forex Brokers Free VPS (/forex-brokers-free-vps) [EXISTS]
│   │   Volume: 3K/мес
│   ├── Best NinjaTrader Brokers (/best-ninjatrader-brokers) [EXISTS]
│   │   FB. Volume: 3K/мес
│   ├── Best ProRealTime Brokers (/best-prorealtime-brokers) [EXISTS]
│   │   Volume: 1K/мес
│   ├── Best ZuluTrade Brokers (/best-zulutrade-brokers) [EXISTS]
│   │   FB. Volume: 1.5K/мес
│   ├── Best HFT Brokers (/best-high-frequency-trading-brokers) [EXISTS]
│   │   FB. Volume: 2K/мес
│   └── Best Forex Brokers for Mac (/best-forex-brokers-mac) [NEW]
│       FB. Volume: 1.5K/мес
│
├── BY AUTOMATION / COPY TRADING
│   ├── Best Copy Trading Platforms (/best-copy-trading-platforms) [EXISTS]
│   │   BC, FB. Volume: 10K/мес — HIGH
│   ├── Best Social Trading Platforms (/best-social-trading-platforms) [EXISTS]
│   │   BC, BB. Volume: 6K/мес
│   ├── Best Forex Brokers for Algo Trading (/best-forex-brokers-for-algo-trading) [EXISTS]
│   │   BC, FB. Volume: 4K/мес
│   ├── Best Forex Brokers for Automated Trading (/best-forex-brokers-for-automated-trading) [EXISTS]
│   │   BB. Volume: 3K/мес
│   ├── Best Forex Brokers for Expert Advisors (/best-forex-brokers-for-expert-advisors) [EXISTS]
│   │   Volume: 3K/мес
│   └── Best Forex Signal Providers (/best-forex-signal-providers) [EXISTS]
│       FB. Volume: 8K/мес
│
├── BY MOBILE
│   ├── Best Forex Trading Apps (/best-forex-trading-apps) [EXISTS]
│   │   BB, FB. Volume: 12K/мес — HIGH
│   ├── Best Forex Apps iPhone (/best-forex-apps-iphone) [EXISTS]
│   │   Volume: 3K/мес
│   └── Best Forex Apps Android (/best-forex-apps-android) [EXISTS]
│       Volume: 2K/мес
│
├── BY ACCOUNT TYPE
│   ├── Best Islamic Forex Brokers (/best-islamic-forex-brokers) [EXISTS]
│   │   BB. Volume: 8K/мес — HIGH
│   ├── Best Forex Demo Accounts (/best-forex-demo-accounts) [EXISTS]
│   │   BB. Volume: 6K/мес
│   ├── Forex Brokers Micro Accounts (/forex-brokers-micro-accounts) [EXISTS]
│   │   BB. Volume: 4K/мес
│   ├── Forex Brokers Cent Accounts (/forex-brokers-cent-accounts) [EXISTS]
│   │   Volume: 3K/мес
│   ├── Forex Brokers Standard Accounts (/forex-brokers-standard-accounts) [EXISTS]
│   │   BB. Volume: 1K/мес
│   ├── Forex Brokers PAMM Accounts (/forex-brokers-pamm-accounts) [EXISTS]
│   │   BB. Volume: 3K/мес
│   ├── Forex Brokers MAM Accounts (/forex-brokers-mam-accounts) [EXISTS]
│   │   Volume: 2K/мес
│   ├── Forex Brokers Managed Accounts (/forex-brokers-managed-accounts) [EXISTS]
│   │   BB. Volume: 2K/мес
│   └── No KYC Forex Brokers (/no-kyc-forex-brokers) [EXISTS]
│       Volume: 5K/мес — HIGH intent
│
├── BY MINIMUM DEPOSIT
│   ├── No Minimum Deposit Forex Brokers (/no-minimum-deposit-forex-brokers) [EXISTS]
│   │   BB (low minimum). Volume: 6K/мес
│   ├── $1 Minimum Deposit (/1-dollar-minimum-deposit-forex-brokers) [EXISTS]
│   │   Volume: 4K/мес
│   ├── $5 Minimum Deposit (/5-dollar-minimum-deposit-forex-brokers) [EXISTS]
│   │   Volume: 3K/мес
│   ├── $10 Minimum Deposit (/10-dollar-minimum-deposit-forex-brokers) [EXISTS]
│   │   Volume: 3K/мес
│   ├── $50 Minimum Deposit (/50-dollar-minimum-deposit-forex-brokers) [EXISTS]
│   │   Volume: 2K/мес
│   ├── $100 Minimum Deposit (/100-dollar-minimum-deposit-forex-brokers) [EXISTS]
│   │   Volume: 2K/мес
│   └── $500 Minimum Deposit (/500-dollar-minimum-deposit-forex-brokers) [EXISTS]
│       Volume: 1K/мес
│
├── BY LEVERAGE
│   ├── Best High Leverage Forex Brokers (/best-high-leverage-forex-brokers) [EXISTS]
│   │   FB. Volume: 10K/мес — HIGH
│   ├── 1:30 Leverage (/1-30-leverage-forex-brokers) [EXISTS]
│   │   Volume: 1K/мес
│   ├── 1:100 Leverage (/1-100-leverage-forex-brokers) [EXISTS]
│   │   BB. Volume: 4K/мес
│   ├── 1:200 Leverage (/1-200-leverage-forex-brokers) [EXISTS]
│   │   BB. Volume: 3K/мес
│   ├── 1:500 Leverage (/1-500-leverage-forex-brokers) [EXISTS]
│   │   BB. Volume: 5K/мес
│   ├── 1:1000 Leverage (/1-1000-leverage-forex-brokers) [EXISTS]
│   │   Volume: 3K/мес
│   └── Unlimited Leverage (/unlimited-leverage-forex-brokers) [EXISTS]
│       Volume: 2K/мес
│
├── BY BONUS / PROMOTION
│   ├── Best Forex Brokers with Bonus (/best-forex-brokers-with-bonus) [EXISTS]
│   │   Volume: 8K/мес
│   ├── No Deposit Bonus (/no-deposit-bonus-forex-brokers) [EXISTS]
│   │   Volume: 15K/мес — VERY HIGH (emerging markets)
│   ├── Deposit Bonus (/deposit-bonus-forex-brokers) [EXISTS]
│   │   Volume: 6K/мес
│   ├── Welcome Bonus (/welcome-bonus-forex-brokers) [EXISTS]
│   │   Volume: 5K/мес
│   └── Loyalty Programs (/forex-brokers-loyalty-program) [EXISTS]
│       Volume: 1K/мес
│
├── BY TRUST & SAFETY
│   ├── Safest Forex Brokers (/safest-forex-brokers) [EXISTS]
│   │   FB (trusted brokers). Volume: 6K/мес
│   ├── Best Regulated Forex Brokers (/best-regulated-forex-brokers) [EXISTS]
│   │   Volume: 5K/мес
│   ├── Negative Balance Protection (/forex-brokers-negative-balance-protection) [EXISTS]
│   │   Volume: 2K/мес
│   ├── Segregated Accounts (/forex-brokers-segregated-accounts) [EXISTS]
│   │   Volume: 1.5K/мес
│   ├── Guaranteed Stop Loss (/forex-brokers-guaranteed-stop-loss) [EXISTS]
│   │   Volume: 1.5K/мес
│   ├── Offshore Forex Brokers (/offshore-forex-brokers) [EXISTS]
│   │   Volume: 4K/мес
│   └── Forex Brokers No Requotes (/forex-brokers-no-requotes) [EXISTS]
│       Volume: 1K/мес
│
├── BY TOOLS & EDUCATION
│   ├── Best Forex Brokers for Education (/best-forex-brokers-education) [EXISTS]
│   │   FB. Volume: 3K/мес
│   ├── Forex Brokers Trading Central (/forex-brokers-trading-central) [EXISTS]
│   │   FB. Volume: 1.5K/мес
│   ├── Forex Brokers Autochartist (/forex-brokers-autochartist) [EXISTS]
│   │   Volume: 1K/мес
│   ├── Forex Brokers Economic Calendar (/forex-brokers-economic-calendar) [EXISTS]
│   │   Volume: 1K/мес
│   ├── Forex Brokers Low Slippage (/forex-brokers-low-slippage) [EXISTS]
│   │   Volume: 2K/мес
│   └── Forex Brokers 24/7 Support (/forex-brokers-24-7-support) [EXISTS]
│       Volume: 1.5K/мес
│
├── BY PAYMENT METHOD
│   ├── PayPal Forex Brokers (/forex-brokers-accepting-paypal) [EXISTS]
│   │   BB, FB. Volume: 5K/мес
│   ├── Credit Card Forex Brokers (/forex-brokers-accepting-credit-cards) [EXISTS]
│   │   BB. Volume: 2K/мес
│   ├── Visa Forex Brokers (/forex-brokers-accepting-visa) [EXISTS]
│   │   BB. Volume: 1.5K/мес
│   ├── Bitcoin Deposit (/forex-brokers-accepting-bitcoin) [EXISTS]
│   │   BB. Volume: 3K/мес
│   ├── Crypto Deposit (/forex-brokers-accepting-crypto) [EXISTS]
│   │   BB. Volume: 2K/мес
│   ├── Skrill Forex Brokers (/forex-brokers-accepting-skrill) [EXISTS]
│   │   Volume: 3K/мес
│   ├── Neteller Forex Brokers (/forex-brokers-accepting-neteller) [EXISTS]
│   │   Volume: 2K/мес
│   ├── Perfect Money (/forex-brokers-accepting-perfect-money) [EXISTS]
│   │   Volume: 2K/мес
│   ├── WebMoney (/forex-brokers-accepting-webmoney) [EXISTS]
│   │   Volume: 1K/мес
│   ├── Google Pay (/forex-brokers-accepting-google-pay) [EXISTS]
│   │   Volume: 1K/мес
│   ├── Apple Pay (/forex-brokers-accepting-apple-pay) [EXISTS]
│   │   Volume: 1K/мес
│   ├── Bank Transfer (/forex-brokers-accepting-bank-transfer) [EXISTS]
│   │   BB. Volume: 1.5K/мес
│   ├── UPI (/forex-brokers-accepting-upi) [EXISTS]
│   │   Volume: 2K/мес (India-specific)
│   └── PIX (/forex-brokers-accepting-pix) [EXISTS]
│       Volume: 1.5K/мес (Brazil-specific)
│
├── BY REGULATOR
│   ├── FCA Regulated (/fca-regulated-forex-brokers) [EXISTS]
│   │   BB. Volume: 5K/мес
│   ├── ASIC Regulated (/asic-regulated-forex-brokers) [EXISTS]
│   │   BB. Volume: 4K/мес
│   ├── CySEC Regulated (/cysec-regulated-forex-brokers) [EXISTS]
│   │   BB. Volume: 3K/мес
│   ├── BaFin Regulated (/bafin-regulated-forex-brokers) [EXISTS]
│   │   Volume: 1.5K/мес
│   ├── DFSA Regulated (/dfsa-regulated-forex-brokers) [EXISTS]
│   │   Volume: 1K/мес
│   ├── FSCA Regulated (/fsca-regulated-forex-brokers) [EXISTS]
│   │   Volume: 1.5K/мес
│   ├── MAS Regulated (/mas-regulated-forex-brokers) [EXISTS]
│   │   Volume: 1K/мес
│   ├── NFA Regulated (/nfa-regulated-forex-brokers) [EXISTS]
│   │   Volume: 2K/мес
│   ├── SCB Regulated (/scb-regulated-forex-brokers) [EXISTS]
│   │   Volume: 800/мес
│   ├── FSA Regulated (/fsa-regulated-forex-brokers) [NEW]
│   │   BB. Volume: 1K/мес
│   ├── IFSC Regulated (/ifsc-regulated-forex-brokers) [NEW]
│   │   BB. Volume: 800/мес
│   └── VFSC Regulated (/vfsc-regulated-forex-brokers) [NEW]
│       BB. Volume: 600/мес
│
├── BY CURRENCY PAIR
│   ├── EUR/USD Brokers (/best-eurusd-brokers) [EXISTS]
│   │   BC (lowest EUR/USD spread), BB. Volume: 3K/мес
│   ├── GBP/USD Brokers (/best-gbpusd-brokers) [EXISTS]
│   │   BB. Volume: 2K/мес
│   ├── USD/JPY Brokers (/best-usdjpy-brokers) [EXISTS]
│   │   BB. Volume: 1.5K/мес
│   ├── AUD/USD Brokers (/best-audusd-brokers) [EXISTS]
│   │   BB. Volume: 1K/мес
│   ├── USD/CAD Brokers (/best-usdcad-brokers) [EXISTS]
│   │   BB. Volume: 800/мес
│   ├── USD/CHF Brokers (/best-usdchf-brokers) [EXISTS]
│   │   BB. Volume: 600/мес
│   ├── EUR/GBP Brokers (/best-eurgbp-brokers) [EXISTS]
│   │   BB. Volume: 600/мес
│   ├── NZD/USD Brokers (/best-nzdusd-brokers) [EXISTS]
│   │   Volume: 400/мес
│   ├── Minor Pairs Brokers (/best-minor-pairs-brokers) [EXISTS]
│   │   Volume: 800/мес
│   ├── Exotic Pairs Brokers (/best-exotic-pairs-brokers) [EXISTS]
│   │   Volume: 1K/мес
│   └── USD/CNY Brokers (/best-usdcny-brokers) [NEW]
│       BB. Volume: 500/мес
│
├── BY COUNTRY (top markets)
│   ├── Best Forex Brokers UK (/best-forex-brokers-uk) [EXISTS]
│   │   BC, BB. Volume: 8K/мес
│   ├── Best Forex Brokers USA (/best-forex-brokers-usa) [EXISTS]
│   │   BC, FB. Volume: 10K/мес
│   ├── Best Forex Brokers Australia (/best-forex-brokers-australia) [EXISTS]
│   │   BB. Volume: 5K/мес
│   ├── Best Forex Brokers Canada (/best-forex-brokers-canada) [EXISTS]
│   │   BB. Volume: 4K/мес
│   ├── Best Forex Brokers India (/best-forex-brokers-india) [EXISTS]
│   │   BB, FB. Volume: 6K/мес
│   ├── Best Forex Brokers South Africa (/best-forex-brokers-south-africa) [EXISTS]
│   │   BB. Volume: 4K/мес
│   ├── Best Forex Brokers Germany (/best-forex-brokers-germany) [EXISTS]
│   │   BB. Volume: 3K/мес
│   ├── Best Forex Brokers UAE (/best-forex-brokers-uae) [EXISTS]
│   │   Volume: 3K/мес
│   ├── Best Forex Brokers Singapore (/best-forex-brokers-singapore) [EXISTS]
│   │   BB. Volume: 2K/мес
│   ├── Best Forex Brokers Malaysia (/best-forex-brokers-malaysia) [EXISTS]
│   │   BB. Volume: 3K/мес
│   ├── Best Forex Brokers Nigeria (/best-forex-brokers-nigeria) [EXISTS]
│   │   Volume: 3K/мес
│   ├── Best Forex Brokers Europe (/best-forex-brokers-europe) [EXISTS]
│   │   Volume: 2K/мес
│   ├── ... (ещё 28 стран — все [EXISTS], см. полный список slug-ов)
│   │   Включая: Japan, Hong Kong, Philippines, Indonesia, Thailand, Vietnam,
│   │   Pakistan, Bangladesh, Kenya, Ghana, Egypt, Turkey, Saudi Arabia, Qatar,
│   │   Kuwait, Oman, Brazil, Mexico, Colombia, South Korea, France, Italy,
│   │   Spain, Netherlands, Sweden, Switzerland, Poland, Romania, New Zealand
│   │
│   └── GAPS — страны у конкурентов, которых нет у нас:
│       ├── Best Forex Brokers Portugal (/best-forex-brokers-portugal) [NEW]
│       │   BB. Volume: 800/мес
│       ├── Best Forex Brokers Denmark (/best-forex-brokers-denmark) [NEW]
│       │   Volume: 500/мес
│       ├── Best Forex Brokers Norway (/best-forex-brokers-norway) [NEW]
│       │   Volume: 500/мес
│       ├── Best Forex Brokers Finland (/best-forex-brokers-finland) [NEW]
│       │   Volume: 400/мес
│       └── Best Forex Brokers Greece (/best-forex-brokers-greece) [NEW]
│           Volume: 400/мес
│
└── GAPS — рейтинги у конкурентов, которых нет у нас:
    ├── Best Forex Trading Courses (/best-forex-trading-courses) [NEW]
    │   FB. Volume: 5K/мес — educational, trust builder
    ├── Best Forex Chart Websites (/best-forex-chart-websites) [NEW]
    │   FB. Volume: 2K/мес
    ├── Best Forex Brokers for Dollar-Cost Averaging (/best-forex-brokers-dca) [NEW]
    │   BC. Volume: 800/мес
    ├── Forex Brokers Accepting Amex (/forex-brokers-accepting-amex) [NEW]
    │   BB. Volume: 500/мес
    ├── Forex Brokers Accepting Trustly (/forex-brokers-accepting-trustly) [NEW]
    │   BB. Volume: 400/мес
    ├── Forex Brokers Accepting PayID (/forex-brokers-accepting-payid) [NEW]
    │   BB (Australia-specific). Volume: 300/мес
    ├── 1:50 Leverage Forex Brokers (/1-50-leverage-forex-brokers) [NEW]
    │   BB. Volume: 800/мес
    └── 1:300 Leverage Forex Brokers (/1-300-leverage-forex-brokers) [NEW]
        BB. Volume: 600/мес
```

**ИТОГО Forex:** ~190 EXISTS + ~15 NEW = ~205 рейтингов

---

## 2. CFD BROKERS

**Основная money page:** `/best-cfd-brokers` [EXISTS]

```
CFD BROKERS
├── MAIN
│   └── Best CFD Brokers (/best-cfd-brokers) [EXISTS]
│       BC, BB, FB. Volume: 12K/мес
│
├── BY AUDIENCE
│   ├── Best CFD Brokers for Beginners (/best-cfd-brokers-for-beginners) [NEW]
│   │   BC (implied). Volume: 4K/мес
│   └── Best CFD Brokers for Professionals (/best-cfd-brokers-for-professionals) [NEW]
│       Volume: 1.5K/мес
│
├── BY COST
│   ├── Lowest Spread CFD Brokers (/lowest-spread-cfd-brokers) [NEW]
│   │   BC. Volume: 3K/мес — IMPORTANT
│   └── Best Low Cost CFD Brokers (/best-low-cost-cfd-brokers) [NEW]
│       Volume: 2K/мес
│
├── BY ASSET
│   ├── Best Gold CFD Brokers (/best-gold-trading-brokers) [EXISTS]
│   │   BC (lowest gold spread). Volume: 5K/мес
│   ├── Best Oil CFD Brokers (/best-oil-trading-brokers) [EXISTS]
│   │   Volume: 3K/мес
│   ├── Best Index CFD Brokers (/best-index-trading-brokers) [EXISTS]
│   │   Volume: 3K/мес
│   ├── Best Silver CFD Brokers (/best-silver-trading-brokers) [EXISTS]
│   │   Volume: 2K/мес
│   ├── Best Natural Gas Brokers (/best-natural-gas-brokers) [EXISTS]
│   │   Volume: 1.5K/мес
│   ├── Best Commodities Brokers (/best-commodities-brokers) [EXISTS]
│   │   Volume: 3K/мес
│   ├── Best US30/Dow Jones CFD Brokers (/best-dow-jones-brokers) [EXISTS]
│   │   BC (US30 CFDs). Volume: 2K/мес
│   ├── Best S&P 500 Brokers (/best-sp500-brokers) [EXISTS]
│   │   Volume: 2K/мес
│   ├── Best NASDAQ Brokers (/best-nasdaq-brokers) [EXISTS]
│   │   BC. Volume: 2K/мес
│   ├── Best DAX Brokers (/best-dax-brokers) [EXISTS]
│   │   BC (DAX futures). Volume: 1.5K/мес
│   ├── Best FTSE 100 Brokers (/best-ftse-100-brokers) [EXISTS]
│   │   Volume: 1K/мес
│   └── Best Nikkei Brokers (/best-nikkei-brokers) [EXISTS]
│       Volume: 800/мес
│
├── BY PLATFORM
│   ├── Best CFD Brokers with Charting Tools (/best-cfd-brokers-charting) [NEW]
│   │   BC. Volume: 1.5K/мес
│   └── (Платформенные рейтинги MT4/MT5/cTrader/TradingView уже в секции Forex)
│
├── BY COUNTRY
│   ├── Best CFD Brokers UK (/best-cfd-brokers-uk) [NEW]
│   │   Volume: 3K/мес — UK is #1 CFD market
│   ├── Best CFD Brokers Australia (/best-cfd-brokers-australia) [NEW]
│   │   Volume: 2K/мес
│   └── Best CFD Brokers Europe (/best-cfd-brokers-europe) [NEW]
│       Volume: 1.5K/мес
│
└── MULTI-ASSET
    ├── Best Multi-Asset Brokers (/best-multi-asset-brokers) [EXISTS]
    │   Volume: 2K/мес
    ├── Best Bond Trading Brokers (/best-bond-trading-brokers) [EXISTS]
    │   NW. Volume: 2K/мес
    └── Best ETF Brokers (/best-etf-brokers) [EXISTS]
        BC, NW. Volume: 5K/мес
```

**ИТОГО CFD:** ~18 EXISTS + ~7 NEW = ~25 рейтингов

---

## 3. COPY TRADING

**Основная money page:** `/best-copy-trading-platforms` [EXISTS]

```
COPY TRADING
├── MAIN
│   ├── Best Copy Trading Platforms (/best-copy-trading-platforms) [EXISTS]
│   │   BC, FB. Volume: 10K/мес
│   └── Best Social Trading Platforms (/best-social-trading-platforms) [EXISTS]
│       BC, BB. Volume: 6K/мес
│
├── BY ASSET
│   ├── Best Crypto Copy Trading (/best-crypto-copy-trading) [EXISTS]
│   │   BB. Volume: 4K/мес
│   ├── Best Forex Copy Trading (/best-forex-copy-trading-platforms) [NEW]
│   │   Volume: 3K/мес
│   └── Best Stock Copy Trading (/best-stock-copy-trading-platforms) [NEW]
│       Volume: 1.5K/мес
│
├── BY AUDIENCE
│   ├── Best Copy Trading for Beginners (/best-copy-trading-for-beginners) [NEW]
│   │   Volume: 3K/мес — HIGH value
│   └── Best Copy Trading for Professionals (/best-copy-trading-for-professionals) [NEW]
│       Volume: 800/мес
│
├── BY PLATFORM
│   ├── Best ZuluTrade Brokers (/best-zulutrade-brokers) [EXISTS]
│   │   FB. Volume: 1.5K/мес
│   └── Best Myfxbook AutoTrade Brokers (/best-myfxbook-autotrade-brokers) [NEW]
│       Volume: 1K/мес
│
├── BY COST
│   └── Best Free Copy Trading Platforms (/best-free-copy-trading-platforms) [NEW]
│       Volume: 2K/мес
│
└── BY COUNTRY
    ├── Best Copy Trading UK (/best-copy-trading-uk) [NEW]
    │   Volume: 1.5K/мес
    └── Best Copy Trading USA (/best-copy-trading-usa) [NEW]
        Volume: 1K/мес
```

**ИТОГО Copy Trading:** 4 EXISTS + 8 NEW = 12 рейтингов

---

## 4. SPREAD BETTING

**Основная money page:** `/best-spread-betting-brokers` [EXISTS]

```
SPREAD BETTING
├── MAIN
│   └── Best Spread Betting Brokers (/best-spread-betting-brokers) [EXISTS]
│       BC, FB. Volume: 8K/мес — UK/Ireland only
│
├── BY STYLE
│   ├── Best Spread Betting for Beginners (/best-spread-betting-for-beginners) [NEW]
│   │   Volume: 2K/мес
│   ├── Best Spread Betting for Day Trading (/best-spread-betting-day-trading) [NEW]
│   │   Volume: 1.5K/мес
│   └── Best Spread Betting for Scalping (/best-spread-betting-scalping) [NEW]
│       Volume: 800/мес
│
├── BY ASSET
│   ├── Best Forex Spread Betting (/best-forex-spread-betting) [NEW]
│   │   Volume: 2K/мес
│   ├── Best Shares Spread Betting (/best-shares-spread-betting) [NEW]
│   │   Volume: 1.5K/мес
│   └── Best Index Spread Betting (/best-index-spread-betting) [NEW]
│       Volume: 1K/мес
│
├── BY PLATFORM
│   └── Best Spread Betting Apps (/best-spread-betting-apps) [NEW]
│       Volume: 2K/мес
│
└── BY COUNTRY
    └── Best Spread Betting UK (/best-spread-betting-uk) [NEW]
        BC. Volume: 4K/мес — Primary market
```

**ИТОГО Spread Betting:** 1 EXISTS + 8 NEW = 9 рейтингов

---

## 5. CRYPTO BROKERS

**Основная money page:** `/best-crypto-brokers` [EXISTS]

```
CRYPTO BROKERS
├── MAIN
│   └── Best Crypto Brokers (/best-crypto-brokers) [EXISTS]
│       BC, FB. Volume: 15K/мес — VERY HIGH
│
├── BY COIN
│   ├── Best Bitcoin Brokers (/best-bitcoin-brokers) [EXISTS]
│   │   Volume: 10K/мес — HIGH
│   ├── Best Ethereum Brokers (/best-ethereum-brokers) [EXISTS]
│   │   BB. Volume: 5K/мес
│   ├── Best XRP Brokers (/best-xrp-brokers) [EXISTS]
│   │   BB (Ripple). Volume: 3K/мес
│   ├── Best Solana Brokers (/best-solana-brokers) [EXISTS]
│   │   BB. Volume: 3K/мес
│   ├── Best Dogecoin Brokers (/best-dogecoin-brokers) [EXISTS]
│   │   BB. Volume: 2K/мес
│   ├── Best Altcoin Brokers (/best-altcoin-brokers) [EXISTS]
│   │   BB. Volume: 3K/мес
│   ├── Best Cardano Brokers (/best-cardano-brokers) [NEW]
│   │   BB. Volume: 1.5K/мес
│   ├── Best USDT Trading Platforms (/best-usdt-trading-platforms) [NEW]
│   │   BB. Volume: 2K/мес
│   └── Best Bitcoin ETF Brokers (/best-bitcoin-etf-brokers) [NEW]
│       FB. Volume: 4K/мес — HOT topic
│
├── BY FEATURE
│   ├── Best Crypto Staking Platforms (/best-crypto-staking-platforms) [EXISTS]
│   │   Volume: 5K/мес
│   ├── Best Crypto Copy Trading (/best-crypto-copy-trading) [EXISTS]
│   │   BB. Volume: 4K/мес
│   ├── Best Low Spread Crypto Brokers (/best-low-spread-crypto-brokers) [EXISTS]
│   │   BB. Volume: 3K/мес
│   ├── Best High Leverage Crypto Brokers (/best-high-leverage-crypto-brokers) [EXISTS]
│   │   BB. Volume: 4K/мес
│   └── Best Crypto Margin Trading (/best-crypto-margin-trading) [NEW]
│       BB. Volume: 3K/мес
│
├── BY AUDIENCE
│   ├── Best Crypto Brokers for Beginners (/best-crypto-brokers-for-beginners) [NEW]
│   │   BB. Volume: 5K/мес — HIGH
│   └── Best Regulated Crypto Brokers (/best-regulated-crypto-brokers) [NEW]
│       Volume: 3K/мес
│
├── BY APP
│   ├── Best Crypto Trading Apps (/best-crypto-trading-apps) [EXISTS]
│   │   FB. Volume: 8K/мес
│   └── Best Crypto Wallets (/best-crypto-wallets) [NEW]
│       FB. Volume: 10K/мес — requires different content type
│
├── BY COUNTRY
│   ├── Best Crypto Brokers UK (/best-crypto-brokers-uk) [NEW]
│   │   BB. Volume: 3K/мес
│   ├── Best Crypto Brokers Australia (/best-crypto-brokers-australia) [NEW]
│   │   BB. Volume: 2K/мес
│   ├── Best Crypto Brokers Canada (/best-crypto-brokers-canada) [NEW]
│   │   BB. Volume: 2K/мес
│   ├── Best Crypto Brokers Germany (/best-crypto-brokers-germany) [NEW]
│   │   BB. Volume: 1.5K/мес
│   └── Best Crypto Brokers USA (/best-crypto-brokers-usa) [NEW]
│       Volume: 4K/мес
│
└── EXCHANGES (separate vertical, adjacent)
    └── Best Crypto Exchanges (/best-crypto-exchanges) [NEW]
        FB. Volume: 20K/мес — VERY HIGH, но другой тип контента
```

**ИТОГО Crypto:** 12 EXISTS + ~14 NEW = ~26 рейтингов

---

## 6. STOCK BROKERS

**Основная money page:** `/best-stock-brokers` [EXISTS]

```
STOCK BROKERS
├── MAIN
│   ├── Best Stock Brokers (/best-stock-brokers) [EXISTS]
│   │   BC, BB, NW. Volume: 15K/мес
│   └── Best Real Stock Brokers (/best-real-stock-brokers) [EXISTS]
│       (Физические акции vs CFD.) Volume: 2K/мес
│
├── BY AUDIENCE
│   ├── Best Stock Brokers for Beginners (/best-stock-brokers-for-beginners) [FUTURE]
│   │   BC, NW. Volume: 10K/мес — VERY HIGH
│   │   Нужны US/EU stock brokers: Fidelity, Schwab, Robinhood, eToro
│   ├── Best Stock Brokers for Day Trading (/best-stock-brokers-day-trading) [FUTURE]
│   │   NW. Volume: 5K/мес
│   └── Best Stock Brokers for Professionals (/best-stock-brokers-for-professionals) [FUTURE]
│       BC. Volume: 2K/мес
│
├── BY FEATURE
│   ├── Best Stock Trading Apps (/best-stock-trading-apps) [EXISTS]
│   │   NW. Volume: 8K/мес
│   ├── Best Brokers for Fractional Shares (/best-fractional-shares-brokers) [FUTURE]
│   │   BC, NW. Volume: 4K/мес
│   ├── Best Brokers for Dividend Investing (/best-dividend-investing-brokers) [FUTURE]
│   │   NW. Volume: 3K/мес
│   ├── Best Brokers for Penny Stocks (/best-penny-stock-brokers) [FUTURE]
│   │   NW. Volume: 5K/мес
│   ├── Best Brokers for Paper Trading (/best-paper-trading-brokers) [FUTURE]
│   │   NW. Volume: 3K/мес
│   ├── Best Brokers for Mutual Funds (/best-mutual-fund-brokers) [FUTURE]
│   │   NW. Volume: 4K/мес
│   └── Best Brokers for After-Hours Trading (/best-after-hours-trading-brokers) [FUTURE]
│       NW. Volume: 2K/мес
│
├── BY COST
│   ├── Best Commission-Free Stock Brokers (/best-commission-free-stock-brokers) [FUTURE]
│   │   Volume: 5K/мес
│   └── Best Low Fee Stock Brokers (/best-low-fee-stock-brokers) [FUTURE]
│       Volume: 3K/мес
│
├── BY COUNTRY
│   ├── Best Stock Brokers USA (/best-stock-brokers-usa) [FUTURE]
│   │   BC, NW. Volume: 8K/мес
│   ├── Best Stock Brokers UK (/best-stock-brokers-uk) [FUTURE]
│   │   Volume: 4K/мес
│   └── Best Stock Brokers Europe (/best-stock-brokers-europe) [FUTURE]
│       Volume: 2K/мес
│
└── BY PLATFORM
    ├── Best Brokers for TradingView Stocks (/best-tradingview-stock-brokers) [FUTURE]
    │   Volume: 2K/мес
    └── Best Robo-Advisors (/best-robo-advisors) [FUTURE]
        NW. Volume: 8K/мес — совсем другая вертикаль
```

**ИТОГО Stock Brokers:** 3 EXISTS + 0 NEW + ~15 FUTURE = ~18 рейтингов
> Большинство stock broker рейтингов требуют US-ориентированных брокеров (Fidelity, Schwab, Robinhood), которых у нас пока нет.

---

## 7. OPTIONS BROKERS

**Основная money page:** `/best-options-brokers` [EXISTS]

```
OPTIONS BROKERS
├── MAIN
│   └── Best Options Brokers (/best-options-brokers) [EXISTS]
│       BC, NW, FB. Volume: 12K/мес
│
├── BY TYPE
│   ├── Best Brokers for US Stock Options (/best-us-stock-options-brokers) [FUTURE]
│   │   BC. Volume: 4K/мес
│   ├── Best Brokers for Index Options (/best-index-options-brokers) [FUTURE]
│   │   BC. Volume: 2K/мес
│   ├── Best Forex Options Brokers (/best-forex-options-brokers) [NEW]
│   │   FB. Volume: 2K/мес — наши брокеры покрывают forex options
│   └── Best Brokers for Binary Options (/best-binary-options-brokers) [FUTURE]
│       Volume: 8K/мес — RISKY, regulatory issues
│
├── BY AUDIENCE
│   ├── Best Options Brokers for Beginners (/best-options-brokers-for-beginners) [FUTURE]
│   │   NW. Volume: 5K/мес
│   └── Best Options Trading Platforms (/best-options-trading-platforms) [FUTURE]
│       BC, NW. Volume: 6K/мес
│
├── BY COST
│   └── Best Low Fee Options Brokers (/best-low-fee-options-brokers) [FUTURE]
│       Volume: 3K/мес
│
└── BY COUNTRY
    └── Best Options Brokers USA (/best-options-brokers-usa) [FUTURE]
        BC, NW. Volume: 5K/мес
```

**ИТОГО Options:** 1 EXISTS + 1 NEW + ~7 FUTURE = ~9 рейтингов
> Options trading = преимущественно US market (tastytrade, IBKR, Schwab). Нужны новые брокеры.

---

## 8. FUTURES BROKERS

**Основная money page:** `/best-futures-brokers` [EXISTS]

```
FUTURES BROKERS
├── MAIN
│   └── Best Futures Brokers (/best-futures-brokers) [EXISTS]
│       BC, NW. Volume: 8K/мес
│
├── BY AUDIENCE
│   ├── Best Futures Brokers for Beginners (/best-futures-brokers-for-beginners) [FUTURE]
│   │   Volume: 3K/мес
│   └── Best Futures Brokers for Small Accounts (/best-futures-brokers-small-accounts) [FUTURE]
│       BC. Volume: 2K/мес
│
├── BY ASSET
│   ├── Best Brokers for Commodities (/best-commodities-futures-brokers) [FUTURE]
│   │   NW. Volume: 3K/мес
│   └── Best Brokers for DAX Futures (/best-dax-futures-brokers) [FUTURE]
│       BC. Volume: 1K/мес
│
├── BY PLATFORM
│   ├── Best Futures Brokers with TradingView (/best-futures-brokers-tradingview) [FUTURE]
│   │   BC. Volume: 1.5K/мес
│   └── Best Futures Brokers NinjaTrader (/best-futures-ninjatrader-brokers) [FUTURE]
│       Volume: 1K/мес
│
├── BY COST
│   └── Best Low Fee Futures Brokers (/best-low-fee-futures-brokers) [FUTURE]
│       Volume: 2K/мес
│
└── BY COUNTRY
    └── Best Futures Brokers USA (/best-futures-brokers-usa) [FUTURE]
        BC, NW. Volume: 4K/мес
```

**ИТОГО Futures:** 1 EXISTS + 0 NEW + ~8 FUTURE = ~9 рейтингов
> Futures = US-centric (NinjaTrader, Topstep, IBKR, Schwab). Полностью Phase 2.

---

## 9. PROP FIRMS

**Основная money page:** нет [FUTURE]

```
PROP FIRMS
├── MAIN
│   └── Best Prop Trading Firms (/best-prop-trading-firms) [FUTURE]
│       Benzinga, Myfxbook, PropFirmMatch. Volume: 15K/мес — VERY HIGH, растущая ниша
│
├── BY AUDIENCE
│   ├── Best Prop Firms for Beginners (/best-prop-firms-for-beginners) [FUTURE]
│   │   ForTraders. Volume: 5K/мес
│   └── Best Prop Firms for Experienced Traders (/best-prop-firms-experienced) [FUTURE]
│       Volume: 2K/мес
│
├── BY ASSET
│   ├── Best Forex Prop Firms (/best-forex-prop-firms) [FUTURE]
│   │   Axi, Myfxbook. Volume: 8K/мес
│   ├── Best Futures Prop Firms (/best-futures-prop-firms) [FUTURE]
│   │   TopStep, Apex. Volume: 5K/мес
│   └── Best Crypto Prop Firms (/best-crypto-prop-firms) [FUTURE]
│       Volume: 3K/мес
│
├── BY CHALLENGE TYPE
│   ├── Best 1-Step Challenge Prop Firms (/best-1-step-prop-firms) [FUTURE]
│   │   Volume: 3K/мес
│   ├── Best 2-Step Challenge Prop Firms (/best-2-step-prop-firms) [FUTURE]
│   │   Volume: 2K/мес
│   └── Best Instant Funding Prop Firms (/best-instant-funding-prop-firms) [FUTURE]
│       Volume: 4K/мес
│
├── BY FEATURE
│   ├── Best Prop Firms with Highest Payout (/best-prop-firms-highest-payout) [FUTURE]
│   │   FundedNext. Volume: 3K/мес
│   ├── Best Cheap Prop Firms (/best-cheap-prop-firms) [FUTURE]
│   │   Volume: 4K/мес
│   └── Best Prop Firms with No Time Limit (/best-prop-firms-no-time-limit) [FUTURE]
│       Volume: 2K/мес
│
├── BY PLATFORM
│   └── Best Prop Firms with MT4/MT5 (/best-prop-firms-mt4-mt5) [FUTURE]
│       Volume: 2K/мес
│
├── BY COUNTRY
│   ├── Best Prop Firms USA (/best-prop-firms-usa) [FUTURE]
│   │   CBS. Volume: 5K/мес
│   └── Best Prop Firms UK (/best-prop-firms-uk) [FUTURE]
│       Volume: 2K/мес
│
└── SPECIFIC FIRMS (review-style, high SV)
    ├── FTMO Review (/prop-firms/ftmo-review) [FUTURE]
    │   Volume: 20K/мес
    ├── FundedNext Review (/prop-firms/fundednext-review) [FUTURE]
    │   Volume: 8K/мес
    └── TopStep Review (/prop-firms/topstep-review) [FUTURE]
        Volume: 5K/мес
```

**ИТОГО Prop Firms:** 0 EXISTS + 0 NEW + ~17 FUTURE = ~17 рейтингов
> Полностью новая вертикаль. Нужны данные и партнёрки с FTMO, FundedNext, TopStep и т.д.
> Очень перспективная ниша: CPA $50-150, растущий volume.

---

## СВОДНАЯ ТАБЛИЦА

| Категория | EXISTS | NEW | FUTURE | Итого | Приоритет |
|-----------|--------|-----|--------|-------|-----------|
| 1. Forex Brokers | ~190 | ~15 | 0 | ~205 | DONE (ядро) |
| 2. CFD Brokers | ~18 | ~7 | 0 | ~25 | Phase 1.5 |
| 3. Copy Trading | 4 | 8 | 0 | 12 | Phase 1.5 |
| 4. Spread Betting | 1 | 8 | 0 | 9 | Phase 1.5 |
| 5. Crypto Brokers | 12 | ~14 | 0 | ~26 | Phase 1 — HIGH PRIORITY |
| 6. Stock Brokers | 3 | 0 | ~15 | ~18 | Phase 2 |
| 7. Options Brokers | 1 | 1 | ~7 | ~9 | Phase 2 |
| 8. Futures Brokers | 1 | 0 | ~8 | ~9 | Phase 2 |
| 9. Prop Firms | 0 | 0 | ~17 | ~17 | Phase 3 (новая вертикаль) |
| **ИТОГО** | **~230** | **~53** | **~47** | **~330** | |

---

## ПРИОРИТЕТЫ СОЗДАНИЯ

### Phase 1 — немедленно (наши 38 брокеров покрывают)
**~53 NEW рейтинга** — можно создать прямо сейчас:

**TOP PRIORITY (SV > 3K/мес):**
1. `/best-crypto-brokers-for-beginners` — 5K/мес
2. `/best-bitcoin-etf-brokers` — 4K/мес
3. `/best-cfd-brokers-for-beginners` — 4K/мес
4. `/best-crypto-brokers-usa` — 4K/мес
5. `/best-spread-betting-uk` — 4K/мес
6. `/best-copy-trading-for-beginners` — 3K/мес
7. `/best-crypto-margin-trading` — 3K/мес
8. `/best-regulated-crypto-brokers` — 3K/мес
9. `/best-crypto-brokers-uk` — 3K/мес
10. `/lowest-spread-cfd-brokers` — 3K/мес
11. `/best-cfd-brokers-uk` — 3K/мес
12. `/best-forex-copy-trading-platforms` — 3K/мес

**MEDIUM PRIORITY (SV 1.5K-3K/мес):**
13-30. Остальные NEW из Crypto, CFD, Copy Trading, Spread Betting

**LONG-TAIL (SV < 1.5K/мес):**
31-53. Мелкие страны, нишевые фичи, специфические регуляторы

### Phase 2 — после расширения пула брокеров
**~32 FUTURE рейтинга** (Stock, Options, Futures) — нужны:
- US Stock Brokers: Fidelity, Charles Schwab, Robinhood, E*TRADE, Webull
- Options: tastytrade, thinkorswim
- Futures: NinjaTrader, TopStep
- EU Stock: Degiro, Trading 212, Freetrade

### Phase 3 — новая вертикаль
**~17 FUTURE рейтинга** Prop Firms — нужны:
- FTMO, FundedNext, TopStep, Apex Trader Funding, The5ers, FXIFY
- Партнёрские программы (CPA $50-150)
- Отдельный review template для prop firms

---

## КОНКУРЕНТНЫЙ АНАЛИЗ — КТО ЧТО ПОКРЫВАЕТ

| Категория | BrokerChooser | BestBrokers | ForexBrokers.com | NerdWallet | Investopedia |
|-----------|:---:|:---:|:---:|:---:|:---:|
| Forex (thematic) | ~50 | ~80 | ~40 | 3 | 3 |
| Forex (countries) | ~180 | ~25 | 3 | - | - |
| CFD | ~10 | 1 main | 1 | - | - |
| Copy/Social Trading | ~5 | ~3 | 1 | - | - |
| Spread Betting | ~3 | 1 | 1 | - | - |
| Crypto | ~15 | ~20 | ~5 | - | 3 |
| Stock | ~20 | 1 main | - | ~10 | ~10 |
| Options | ~5 | - | 1 | ~3 | ~3 |
| Futures | ~5 | - | - | ~2 | ~2 |
| Prop Firms | - | - | - | - | - |
| **ИТОГО** | **~293** | **~131** | **~52** | **~18** | **~21** |

### Ключевые наблюдения:

1. **BrokerChooser** — абсолютный лидер по количеству (293+ ranking pages). Их секрет: каждый рейтинг x каждая страна = отдельная страница. У них ~180 стран, и каждый рейтинг имеет страновой вариант.

2. **BestBrokers** — фокус на forex/crypto с глубокими подкатегориями (платформы, рычаг, пары, регуляторы, платёжные методы). Наша структура очень близка к BestBrokers.

3. **ForexBrokers.com** — качество > количество. ~50 супер-качественных guide pages, каждая на 5000+ слов с ежегодными awards. Их подход к контенту — benchmark.

4. **NerdWallet/Investopedia** — чисто US market (stock/options/futures). Не конкуренты в forex/CFD, но доминируют в stock broker rankings.

5. **Prop Firms** — ПУСТАЯ НИША у всех крупных агрегаторов. Только Benzinga и мелкие сайты. Огромная возможность.

---

## Источники исследования

- [BrokerChooser Best Brokers Hub](https://brokerchooser.com/best-brokers)
- [BestBrokers Forex](https://www.bestbrokers.com/forex-brokers/)
- [BestBrokers Crypto](https://www.bestbrokers.com/crypto-brokers/)
- [BestBrokers Stock](https://www.bestbrokers.com/stock-brokers/)
- [BestBrokers CFD](https://www.bestbrokers.com/cfd-brokers/)
- [ForexBrokers.com Guides](https://www.forexbrokers.com/guides)
- [ForexBrokers.com 2026 Awards](https://www.forexbrokers.com/annual-awards-2026)
- [NerdWallet Best Brokers](https://www.nerdwallet.com/investing/best/online-brokers-for-stock-trading)
- [NerdWallet Options](https://www.nerdwallet.com/investing/best/options-trading-brokers)
- [NerdWallet Futures](https://www.nerdwallet.com/investing/best/brokers-futures-trading-commodities)
- [PropFirmMatch](https://propfirmmatch.com/)
- [Benzinga Prop Firms](https://www.benzinga.com/money/best-prop-trading-firms)
