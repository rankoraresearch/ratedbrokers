# Исследование: Типы брокеров — Различия в Review-страницах, Скоринге, UX

> Авторы: Bill (SEO/Affiliate) + Leo (Methodology/Scoring)
> Дата: 31.03.2026
> Статус: Reference document для M4 Phase 2+3

---

## Содержание

1. [Part 1 (Bill): Что пользователи ищут по каждому типу](#part-1)
2. [Part 2 (Leo): Адаптация скоринга по типам](#part-2)
3. [Part 3 (Bill+Leo): Адаптация Review-страниц](#part-3)
4. [Part 4: Маппинг полей для YAML](#part-4)

---

## Part 1: Что пользователи ищут по каждому типу брокера {#part-1}

### 1.1 Forex/CFD Brokers (IC Markets, Pepperstone, IG)

**Это наша текущая вертикаль — базовая линия.**

#### Ключевые метрики, которые ищут пользователи:
- Спреды на EUR/USD (raw vs standard)
- Комиссия за лот ($0–$7)
- Кредитное плечо (1:30 EU, 1:500 offshore)
- Минимальный депозит ($0–$200)
- Количество валютных пар (40–80)
- ECN/STP vs Market Maker
- Swap rates / overnight costs

#### Уникальные data points (не у других типов):
- `spread_eurusd` — средний спред на EUR/USD
- `commission_per_lot` — комиссия за стандартный лот
- `leverage_max` — максимальное плечо
- `execution_model` — ECN/STP/MM/Hybrid
- `liquidity_providers` — список LP
- `currency_pairs_count` — количество пар
- `swap_free` — Islamic accounts

#### Структура комиссий:
- **Spread-based**: всё включено в спред (Exness Standard, eToro)
- **Commission-based**: raw spread + фиксированная комиссия (IC Markets Raw, Pepperstone Razor)
- **Hybrid**: оба типа аккаунтов

#### Регуляция:
- Tier-1: FCA, ASIC, CySEC, BaFin, MAS, NFA/CFTC
- Tier-2: DFSA, FMA, FSCA
- Tier-3: offshore (FSA Seychelles, VFSC)
- Ключевой вопрос: Investor Compensation Scheme (до £85K UK, до €20K EU)

#### Платформы:
- MT4, MT5, cTrader, TradingView — это стандарт
- Proprietary platforms (IG ProRealTime, Saxo SaxoTraderGO)
- API для алго-трейдинга

#### Что делает брокера "хорошим":
- Спреды < 1.0 pip на EUR/USD (raw < 0.2 pip)
- Комиссия ≤ $7/lot round turn
- Tier-1 регуляция × 2+
- MT4 + MT5 + cTrader или TradingView
- Trustpilot 4.0+
- Быстрый вывод (< 24 часа)

**Конкуренты и что показывают:**
- ForexBrokers.com: Trust Score, спреды таблицей, platform comparison matrix
- BrokerChooser: Overall Score + 6 sub-scores, Fee Calculator
- Investopedia: Pros/Cons, Why We Picked It, Who It's For

---

### 1.2 Stock Brokers (Charles Schwab, Fidelity, DEGIRO, Interactive Brokers)

#### Ключевые метрики:
- Commission per trade ($0 в США — стандарт; в EU: €0.50–€5)
- Account minimums ($0 vs $25,000 для pattern day trading)
- Number of stocks/ETFs available (5,000–50,000+)
- Number of exchanges accessible (1 vs 50+)
- Fractional shares (yes/no)
- DRIP — Dividend Reinvestment Plans
- Research quality (Morningstar, S&P, own reports)
- Screener tools quality
- Cash sweep rate / interest on uninvested cash
- Portfolio analysis tools

#### Уникальные data points:
- `stock_commission` — комиссия за сделку с акциями ($0 / $1 / €2)
- `etf_commission` — комиссия за ETF ($0 / €0.50)
- `stocks_available` — количество акций
- `exchanges_count` — количество бирж
- `fractional_shares` — да/нет
- `drip` — автореинвестирование дивидендов
- `research_providers` — Morningstar, S&P, Refinitiv, etc.
- `cash_interest_rate` — % на свободные средства
- `ipo_access` — доступ к IPO
- `mutual_funds_count` — количество взаимных фондов
- `etf_selection` — количество ETF
- `tax_loss_harvesting` — автоматический tax-loss harvesting
- `robo_advisor` — встроенный робо-советник (Schwab Intelligent Portfolios, Fidelity Go)

#### Структура комиссий (кардинально отличается от Forex):
- **US market**: $0 commission на акции и ETF — это СТАНДАРТ (Schwab, Fidelity, Robinhood)
- **European market**: €0.50–€5 per trade (DEGIRO, Saxo, Interactive Brokers)
- **Payment for Order Flow (PFOF)**: скрытый cost в US (Robinhood)
- **Margin rates**: 5%–13% годовых — огромный разброс
- **Account fees**: monthly/annual fee (некоторые EU-брокеры)
- **FX conversion fee**: при покупке иностранных акций (0.15%–1.5%)
- **Inactivity fee**: $0–$10/month

#### Регуляция (ДРУГАЯ чем Forex):
- **US**: SEC + FINRA + SIPC (до $500K страховка!)
- **EU**: национальные регуляторы + MiFID II
- **UK**: FCA + FSCS (до £85K)
- **Ключевое отличие**: SIPC $500K >> ICF €20K >> FSCS £85K
- Broker-dealer vs Investment firm — разные лицензии

#### Платформы:
- Proprietary platforms — КРИТИЧНЫ (Schwab thinkorswim, Fidelity Active Trader Pro)
- Мобильное приложение > всего остального
- MT4/MT5 — НЕ АКТУАЛЬНО (никто не торгует акциями через MT4)
- Web-platform — must have
- TradingView integration — бонус
- Research integration (Morningstar в платформе)

#### Что делает stock broker "хорошим":
- $0 commission на US stocks/ETFs
- 50+ бирж или deep US market access
- Fractional shares
- Quality research (Morningstar, собственные отчёты)
- Powerful screeners
- Конкурентные margin rates
- SIPC/FSCS protection
- Intuitive mobile app

**Конкуренты и что показывают (NerdWallet, Investopedia, StockBrokers.com):**
- NerdWallet: "Best for" labels (beginners, day trading, ETFs), fee table с margin rates
- Investopedia: Feature comparison table (account minimum, stocks offered, options, fractional)
- StockBrokers.com: 15 категорий scoring (commissions, platforms, research, education, mobile, etc.)
- Bankrate: Star ratings + editorial pick labels

---

### 1.3 Options Brokers (tastytrade, Schwab/thinkorswim, IBKR)

#### Ключевые метрики:
- Options commission per contract ($0–$0.65)
- Options base fee per trade ($0–$6.95)
- Exercise/assignment fees ($0–$15)
- Number of optionable stocks
- Complex order types support (spreads, iron condors, strangles)
- Options chain layout quality
- Probability/Greeks calculators
- Options analytics (P&L graphs, risk analysis)
- Paper trading for options
- Options level tiers (1–5 approval levels)

#### Уникальные data points:
- `options_per_contract` — комиссия за контракт ($0.50, $0.65)
- `options_base_fee` — базовая комиссия ($0, $4.95)
- `options_exercise_fee` — fee за exercise/assignment
- `options_levels` — уровни одобрения (1–5)
- `complex_orders` — поддержка multi-leg strategies
- `options_screener` — есть/нет
- `probability_calculator` — есть/нет
- `greeks_display` — в options chain или нет
- `options_on_futures` — да/нет
- `early_assignment_alerts` — да/нет

#### Структура комиссий:
- **Per-contract fee**: $0.50 (tastytrade) — $0.65 (Schwab, Fidelity, IBKR)
- **Closing trades**: $0 на tastytrade (unique selling point!)
- **Multi-leg orders**: один spread = $0.50 × legs
- **Index options**: отдельный прайсинг у некоторых
- **Assignment/exercise**: $0–$15 (скрытая стоимость)
- **Penny Pilot**: better fills на penny-increment options

#### Платформы:
- thinkorswim (Schwab) — золотой стандарт для options
- tastytrade platform — заточена специально под options
- Power E*TRADE — visual P&L builder
- IBKR TWS — most powerful но complex
- **Обязательно**: visual P&L диаграммы, strategy builder, options chain с Greeks

#### Что делает options broker "хорошим":
- Низкая per-contract fee (≤ $0.50)
- $0 closing fee
- Intuitive options chain layout
- Visual strategy builder
- Fast fills на multi-leg orders
- Paper trading с реальными данными
- Options education content
- Low margin requirements

---

### 1.4 Futures Brokers (NinjaTrader, AMP Futures, TradeStation)

#### Ключевые метрики:
- Commission per contract per side ($0.09–$2.50)
- Margin requirements (intraday vs overnight)
- Available futures markets (CME, ICE, EUREX, etc.)
- Micro futures availability (MES, MNQ, M2K)
- Platform fees (NinjaTrader = $60/month или $1,099 lifetime)
- Data feed costs ($0–$100+/month)
- Clearing fees (отдельно от commission)
- DOM (Depth of Market) quality
- Order types (bracket, OCO, trailing stop)

#### Уникальные data points:
- `futures_commission_per_side` — комиссия за контракт per side
- `futures_all_in_cost` — total cost включая exchange + clearing + NFA fees
- `intraday_margins` — дневная маржа (часто 50% от overnight)
- `overnight_margins` — ночная маржа (exchange minimum)
- `futures_markets` — список доступных бирж (CME, CBOT, NYMEX, COMEX, ICE, EUREX)
- `micro_futures` — Micro E-mini S&P, Micro Nasdaq, etc.
- `platform_fee_monthly` — месячная плата за платформу
- `data_feed_cost` — стоимость маркет-данных
- `dom_quality` — Depth of Market (ladder)
- `order_types_advanced` — bracket, OCO, trailing

#### Структура комиссий (САМАЯ СЛОЖНАЯ):
- **Commission**: $0.09 (AMP micro) — $2.50 (full-service)
- **Exchange fees**: $1.14–$1.50 per contract (CME) — НЕИЗБЕЖНЫЕ
- **Clearing fees**: $0.10–$0.30 per contract
- **NFA fees**: $0.02 per contract
- **Platform fees**: $0 (web) — $60/month (NinjaTrader) — $99/month (CQG)
- **Data feed**: $0 (delayed) — $15–$100 (real-time CME/ICE bundle)
- **Total all-in cost**: сумма всех выше — ЭТО ключевая метрика

#### Регуляция:
- **US**: NFA + CFTC (обязательно для US futures)
- **FCM** (Futures Commission Merchant) — лицензия для клиринга
- **IB** (Introducing Broker) — перенаправляет в FCM (AMP → Dorman Trading)
- Нет аналога SIPC — futures не покрыты
- Customer Segregated Funds — единственная защита

#### Платформы:
- NinjaTrader — #1 для futures, DOM-centric
- Sierra Chart — ultra-low-latency, для профи
- TradingView — набирает популярность
- CQG — институциональный стандарт
- Rithmic — data feed provider + execution
- MT4/MT5 — МИНИМАЛЬНО используются для futures

#### Что делает futures broker "хорошим":
- All-in cost < $2/contract (Micro) или < $5 (E-mini)
- Low intraday margins ($50 Micro ES, $500 E-mini ES)
- Professional DOM/ladder
- Fast execution (< 1ms)
- No platform fees или lifetime license
- Free real-time data (or bundled)
- Micro futures support

---

### 1.5 Crypto Brokers/Exchanges (Binance, Coinbase, Kraken, eToro)

#### Ключевые метрики:
- Maker/Taker fees (0.01%–0.60%)
- Number of coins/tokens listed (50–500+)
- Fiat on-ramp methods (bank transfer, card, Apple Pay)
- Withdrawal fees per coin (BTC: 0.0001–0.0005 BTC)
- Staking APY (ETH 3–5%, SOL 5–8%)
- Security track record (hacks, funds recovery)
- Proof of Reserves (PoR) — после FTX критически важно
- Cold storage % (90%+ = хорошо)
- Insurance fund size
- KYC requirements (full/partial/none)

#### Уникальные data points:
- `maker_fee` / `taker_fee` — maker/taker комиссии
- `coins_listed` — количество монет/токенов
- `fiat_currencies` — поддерживаемые фиатные валюты
- `staking_available` — список монет для стейкинга
- `staking_apy` — диапазон APY
- `proof_of_reserves` — да/нет + ссылка на аудит
- `cold_storage_percent` — % средств в cold storage
- `insurance_fund` — размер страхового фонда
- `security_incidents` — история взломов
- `withdrawal_fee_btc` / `_eth` / `_usdt` — withdrawal fees по монетам
- `leverage_crypto` — максимальное плечо на крипто (обычно 2x–125x)
- `futures_crypto` — крипто-фьючерсы (perpetual swaps)
- `earn_products` — savings, lending, liquidity pools

#### Структура комиссий:
- **Spot trading**: Maker 0.01%–0.10% / Taker 0.02%–0.60%
- **VIP tiers**: скидки по объёму (BNB discount на Binance)
- **Spread markup**: скрытая наценка у "простых" платформ (Coinbase basic: 1.5%!)
- **Withdrawal fees**: фиксированные per coin — ОГРОМНЫЙ разброс
- **Deposit fees**: card 1.5%–3.5%, bank transfer = бесплатно
- **Staking commission**: биржа берёт 10%–25% от staking rewards

#### Регуляция (ФРАГМЕНТИРОВАННАЯ):
- **US**: FinCEN MSB + state licenses (BitLicense NY) — SEC борьба
- **EU**: MiCA (2024) — единый стандарт
- **UK**: FCA crypto registration
- **Japan**: FSA crypto license
- Нет единого стандарта — регуляция по стране
- Proof of Reserves > регуляция (мнение community)

#### Платформы:
- Proprietary web + mobile — ТОЛЬКО ЭТО (никаких MT4)
- Advanced trading interface (Binance Pro, Coinbase Advanced)
- API для ботов (REST + WebSocket)
- TradingView charts integration
- Mobile app quality — #1 приоритет

#### Что делает крипто-платформу "хорошей":
- Maker fee ≤ 0.10%
- 200+ монет
- Proof of Reserves опубликован
- Zero security incidents за 3+ года
- Fast fiat on-ramp (< 1 день)
- Staking с competitive APY
- Intuitive mobile app

---

### 1.6 Prop Trading Firms (FTMO, FundedNext, The5ers, TopStep)

#### КАРДИНАЛЬНО ДРУГАЯ МОДЕЛЬ — не брокер, а фандинг-провайдер

#### Ключевые метрики:
- Challenge price ($99–$1,100+)
- Account sizes ($5K–$200K)
- Profit split (70%–90%)
- Profit target Phase 1 (8%–10%)
- Profit target Phase 2 (5%)
- Max daily loss (4%–5%)
- Max total loss (8%–12%)
- Time limit (30 days / unlimited)
- Payout frequency (bi-weekly / monthly)
- Payout methods (bank, crypto, PayPal)
- Scaling plan (условия для увеличения капитала)
- Allowed instruments (forex only vs multi-asset)
- Allowed strategies (news trading, EAs, hedging, weekend holding)

#### Уникальные data points:
- `challenge_price_10k` — стоимость challenge на $10K аккаунт
- `challenge_price_100k` — стоимость challenge на $100K
- `profit_split` — % прибыли трейдеру
- `profit_target_p1` / `_p2` — targets по фазам
- `max_daily_loss` — макс. дневной убыток
- `max_total_loss` — макс. общий убыток
- `time_limit_days` — лимит времени на challenge
- `payout_frequency` — частота выплат
- `scaling_plan` — условия роста капитала
- `min_trading_days` — минимум торговых дней
- `news_trading_allowed` — торговля на новостях
- `ea_allowed` — автоматическая торговля разрешена
- `weekend_holding` — удержание через выходные
- `hedging_allowed` — хеджирование
- `free_retry` — бесплатный повтор challenge
- `refund_on_pass` — возврат стоимости challenge

#### Структура "комиссий" (НЕТ комиссий — есть стоимость challenge):
- **One-time fee**: $155 (FTMO $10K) — $1,080 (FTMO $200K)
- **Refundable**: да (FTMO возвращает при прохождении)
- **Monthly subscription**: $0 (большинство) — $99/month (некоторые)
- **Spread markup**: зависит от underlying broker (часто скрыт)
- **Scaling fee**: $0 (обычно бесплатно)
- **NO trading commissions** — prop firm не берёт отдельно

#### "Регуляция" (ОТСУТСТВУЕТ в традиционном смысле):
- Prop firms НЕ регулируются как брокеры
- НЕТ лицензии FCA/ASIC/CySEC
- Юрисдикция: Czech Republic (FTMO), UAE, UK Ltd
- **Вместо регуляции**: трекинг рекорд, Trustpilot, community reputation
- Пройденные выплаты — главный показатель доверия
- Total paid out to traders ($XX million) — ключевая метрика

#### Платформы:
- MT4/MT5 — основа (через underlying broker — обычно Purple Trading, Eightcap)
- cTrader — набирает популярность
- DXTrade — новая альтернатива
- Match Trader — появляется
- Dashboard — обязательная панель для отслеживания challenge progress

#### Что делает prop firm "хорошей":
- Profit split ≥ 80%
- Refundable challenge fee
- No time limit (или generous)
- Realistic profit targets (≤ 8% Phase 1)
- Reasonable drawdown rules (≤ 5% daily)
- Fast payouts (< 5 дней)
- Proven track record ($10M+ paid out)
- EA и news trading разрешены
- Free retry при close-to-target

---

## Part 2: Адаптация скоринга по типам брокеров {#part-2}

### 2.1 Текущая методология (Forex/CFD — базовая линия)

| # | Категория | Вес | Ключ |
|---|-----------|-----|------|
| 1 | Regulation & Safety | 30% | `regulation` |
| 2 | Trading Costs | 20% | `costs` |
| 3 | User Reputation | 15% | `reputation` |
| 4 | Broker Transparency | 15% | `transparency` |
| 5 | Platforms & Tools | 15% | `platform` |
| 6 | Execution Model | 5% | `execution` |

### 2.2 Предложенные веса по типам

#### Stock Brokers — ИЗМЕНЁННЫЕ ВЕСА

| # | Категория | Вес | Изменение | Обоснование |
|---|-----------|-----|-----------|-------------|
| 1 | Regulation & Safety | 25% | -5% | SEC/FINRA + SIPC = высокий baseline, меньше вариативность |
| 2 | Investment Costs | 25% | +5% | $0 commission — стандарт, но margin rates, FX fees, account fees создают огромный разброс |
| 3 | User Reputation | 10% | -5% | Крупные брокеры все имеют 4.0+ на Trustpilot |
| 4 | Research & Education | 15% | НОВАЯ | Morningstar, screeners, reports — критически важно для stock investors |
| 5 | Platforms & Mobile App | 15% | = | Mobile app > всего для stocks |
| 6 | Investment Selection | 10% | НОВАЯ | Количество акций, ETF, бирж, fractional shares, DRIP |

**Убраны**: Execution Model (нерелевантно — все stock brokers = exchange execution), Broker Transparency (поглощена Regulation для regulated US/EU brokers)

**Новые категории:**
- **Research & Education** — качество research tools, screeners, аналитика. Benchmark: Schwab/Fidelity = 9.5+, Robinhood = 6.0
- **Investment Selection** — ширина продуктовой линейки. Benchmark: IBKR 50+ бирж = 10.0, Robinhood US-only = 6.0

**Бенчмарки "отлично" vs "плохо":**
| Метрика | Excellent (9–10) | Good (7–8.9) | Poor (< 5) |
|---------|-----------------|--------------|------------|
| Stock commission | $0 | < $5 | > $10 |
| ETF commission | $0 | < $2 | > $5 |
| Margin rate | < 6% | 6–9% | > 12% |
| Stocks available | 10,000+ | 5,000+ | < 1,000 |
| Exchanges | 20+ | 5+ | 1 |
| Research | Morningstar + proprietary | Basic screeners | None |

---

#### Options Brokers — ИЗМЕНЁННЫЕ ВЕСА

| # | Категория | Вес | Обоснование |
|---|-----------|-----|-------------|
| 1 | Regulation & Safety | 20% | Все major options brokers = SEC/FINRA |
| 2 | Options Pricing | 25% | Per-contract fee + exercise + closing = ключевая дифференциация |
| 3 | User Reputation | 10% | |
| 4 | Options Platform & Tools | 30% | Strategy builder, Greeks, P&L — КРИТИЧНО для options |
| 5 | Options Education | 10% | Options education = must have (сложный инструмент) |
| 6 | Options Selection | 5% | Все major brokers = все optionable US stocks |

**Ключевые бенчмарки:**
| Метрика | Excellent (9–10) | Good (7–8.9) | Poor (< 5) |
|---------|-----------------|--------------|------------|
| Per-contract fee | $0 (Robinhood) | $0.50 (tastytrade) | > $1.00 |
| Closing fee | $0 | = opening | Penalty fee |
| Strategy builder | Visual + Greeks + P&L | Basic multi-leg | No multi-leg |
| Options chains | Real-time Greeks, probability | Basic chain | Delayed data |
| Paper trading | Full-featured | Limited | None |
| Education | Video courses + webinars | Articles | None |

**Новая категория: Options Platform & Tools (30%)**
- Visual strategy builder с P&L диаграммами
- Greeks display в options chain (Delta, Gamma, Theta, Vega, Rho)
- Probability of profit calculator
- Risk/reward analysis
- Multi-leg order entry (2–4 legs)
- Paper trading с real-time data
- Options screener/scanner
- This is THE differentiator — tastytrade и thinkorswim доминируют именно из-за tools

---

#### Futures Brokers — ИЗМЕНЁННЫЕ ВЕСА

| # | Категория | Вес | Обоснование |
|---|-----------|-----|-------------|
| 1 | Regulation (NFA/CFTC) | 15% | Все US futures brokers = NFA, минимальная вариативность |
| 2 | All-in Trading Costs | 30% | Commission + exchange + clearing + NFA + platform + data = ОГРОМНАЯ разница |
| 3 | User Reputation | 10% | |
| 4 | Platform & Execution | 25% | DOM quality, order types, execution speed — для futures первостепенно |
| 5 | Margin Requirements | 10% | Intraday margins = key differentiator ($50 vs $500 на Micro ES) |
| 6 | Market Access | 10% | CME/ICE/EUREX, micro futures, options on futures |

**Ключевые бенчмарки:**
| Метрика | Excellent (9–10) | Good (7–8.9) | Poor (< 5) |
|---------|-----------------|--------------|------------|
| All-in per contract (Micro) | < $1.50 | $1.50–$3.00 | > $4.00 |
| All-in per contract (E-mini) | < $4.00 | $4.00–$6.00 | > $8.00 |
| Platform fee | $0 | < $50/month | > $100/month |
| Data feed cost | $0 (bundled) | < $25/month | > $50/month |
| Intraday margin (Micro ES) | $50 | $100–$200 | > $500 |
| DOM quality | Professional ladder | Basic DOM | No DOM |
| Execution speed | < 1ms | 1–5ms | > 10ms |

---

#### Crypto Brokers/Exchanges — ИЗМЕНЁННЫЕ ВЕСА

| # | Категория | Вес | Обоснование |
|---|-----------|-----|-------------|
| 1 | Security & Trust | 30% | После FTX, security = #1 concern. PoR, cold storage, hack history |
| 2 | Trading Fees | 20% | Maker/Taker + hidden spread + withdrawal fees |
| 3 | User Reputation | 15% | Community trust = огромная роль в crypto |
| 4 | Coin Selection & Features | 15% | Coins listed, staking, earn products, DeFi integration |
| 5 | Platform & Mobile | 15% | Mobile-first audience |
| 6 | Fiat Access | 5% | On-ramp/off-ramp methods, supported currencies |

**НОВАЯ категория: Security & Trust (вместо Regulation)**
- Proof of Reserves (опубликован? аудирован? real-time?)
- Cold storage % (>95% = excellent)
- Security incidents history (hacks, breaches)
- Insurance fund size ($1B+ = excellent)
- Bug bounty program
- SOC 2 / ISO 27001 certification
- 2FA enforcement

**Ключевые бенчмарки:**
| Метрика | Excellent (9–10) | Good (7–8.9) | Poor (< 5) |
|---------|-----------------|--------------|------------|
| Maker fee | ≤ 0.05% | 0.05–0.15% | > 0.30% |
| Taker fee | ≤ 0.10% | 0.10–0.25% | > 0.50% |
| BTC withdrawal fee | ≤ 0.0001 BTC | 0.0001–0.0003 | > 0.0005 |
| Coins listed | 500+ | 100–500 | < 50 |
| Cold storage | 95%+ | 85–95% | < 70% |
| Proof of Reserves | Real-time, audited | Published, periodic | None |
| Security incidents | 0 in 5 years | 1 minor, recovered | Major hack |

---

#### Prop Trading Firms — ПОЛНОСТЬЮ НОВАЯ МЕТОДОЛОГИЯ

| # | Категория | Вес | Обоснование |
|---|-----------|-----|-------------|
| 1 | Payout Reliability | 25% | Выплачивают ли реально? Total paid out, payout speed, community proof |
| 2 | Challenge Rules Fairness | 25% | Targets, drawdown, time limits, разрешённые стратегии |
| 3 | Pricing Value | 15% | Challenge cost relative to account size, refund policy |
| 4 | User Reputation | 20% | Trustpilot + community (Discord, Reddit, YouTube) — КРИТИЧНО |
| 5 | Trading Conditions | 10% | Spreads, slippage, platforms, instruments |
| 6 | Scaling & Growth | 5% | Scaling plan, max account size |

**Принципиальное отличие**: НЕТ категории "Regulation" — prop firms нерегулируемы. Вместо неё — "Payout Reliability" (доказанная история выплат).

**НОВЫЕ категории:**
1. **Payout Reliability** — total $ paid, average payout speed, % successful traders who got paid, community verification
2. **Challenge Rules Fairness** — насколько достижимы цели, нет ли скрытых правил, consistency rule fairness

**Ключевые бенчмарки:**
| Метрика | Excellent (9–10) | Good (7–8.9) | Poor (< 5) |
|---------|-----------------|--------------|------------|
| Total paid out | $100M+ | $10M–$100M | < $1M или неизвестно |
| Payout speed | < 3 дня | 3–7 дней | > 14 дней |
| Profit split | 90%+ | 80–89% | < 70% |
| Challenge cost ($100K) | < $500 | $500–$800 | > $1,000 |
| Profit target P1 | ≤ 8% | 8–10% | > 12% |
| Max daily drawdown | ≤ 5% | 5–6% | > 8% |
| Time limit | Unlimited | 30+ days | < 14 days |
| EA allowed | Yes | Restricted | No |
| Refund on pass | Full | Partial | None |

### 2.3 Мульти-тип брокеры (Schwab, IBKR, IG)

**Проблема**: Interactive Brokers = Stocks + Options + Futures + Forex. Schwab = Stocks + Options + Futures. IG = Forex + CFD + Stocks + Spread Betting.

**Решение: Per-vertical scoring**

Каждый брокер получает **отдельный скор для каждой вертикали**, в которой он участвует:

```
Interactive Brokers:
  - stocks_score: 9.2 (weights: stock methodology)
  - options_score: 8.8 (weights: options methodology)
  - futures_score: 8.5 (weights: futures methodology)
  - forex_score: 7.9 (weights: forex methodology)
  - overall_score: 9.2 (highest vertical = primary display)
```

**Правила:**
1. `overall_score` = средневзвешенный по вертикалям ИЛИ лучший вертикальный скор (решение: лучший, т.к. "IBKR best for stocks" важнее чем "IBKR average across all")
2. На странице review — показывать скор по текущей вертикали (если пришёл из stock ranking → stock score)
3. В рейтинге — использовать скор соответствующей вертикали (stock ranking → stock_score)
4. На главной review-странице — overall_score (primary vertical)

**Реализация в YAML:**
```yaml
scores:
  overall: 9.2
  forex:
    regulation: 8.5
    costs: 7.5
    reputation: 9.0
    transparency: 8.5
    platform: 9.0
    execution: 8.0
    total: 7.9
  stocks:
    regulation: 9.5
    investment_costs: 9.0
    reputation: 9.0
    research: 9.8
    platform: 9.5
    selection: 10.0
    total: 9.2
```

---

## Part 3: Адаптация Review-страниц {#part-3}

### 3.1 Forex/CFD Review (ТЕКУЩИЙ — baseline)

**Секции (текущие, без изменений):**
1. Hero: Trust Score, badge, минимальный депозит, год основания, штаб
2. Quick Stats: Overall Score, 6 sub-scores
3. Key Finding (editorial verdict)
4. Pros & Cons
5. Overview / About
6. Scoring Breakdown (6 категорий)
7. Account Types (Standard, ECN, Islamic)
8. Spreads & Fees (таблица спредов по парам)
9. Platforms & Tools
10. Regulation & Safety
11. Deposit & Withdrawal
12. Customer Support
13. FAQ
14. Author Credits

**Hero Quick Stats:**
- Overall Score | Min Deposit | Max Leverage | Spread from | Regulation

**CTA текст:** "Visit {Broker}" / "Open Account"

---

### 3.2 Stock Broker Review — АДАПТАЦИЯ

#### Секции ПОКАЗАТЬ:
1. Hero (адаптированный)
2. Quick Stats (адаптированные)
3. Key Finding
4. Pros & Cons
5. Overview
6. Scoring Breakdown (stock weights)
7. **Investment Products** ← ПЕРЕИМЕНОВАНО из "Account Types"
8. **Fees & Commissions** ← ПЕРЕИМЕНОВАНО из "Spreads & Fees"
9. **Research & Analysis Tools** ← НОВАЯ (вместо Execution Model)
10. Platforms & Mobile App
11. Regulation & Investor Protection ← ПЕРЕИМЕНОВАНО
12. **Fractional Shares & ETFs** ← НОВАЯ
13. Deposit & Withdrawal
14. Customer Support
15. FAQ
16. Author Credits

#### Секции СКРЫТЬ:
- Spreads & Fees (в Forex формате — спреды по парам нерелевантны)
- Execution Model (все stock brokers = exchange)
- Leverage section (не актуально для stock investing, margin — отдельно)

#### Секции ПЕРЕИМЕНОВАТЬ:
| Было (Forex) | Стало (Stocks) |
|-------------|----------------|
| Account Types | Investment Products |
| Spreads & Fees | Fees & Commissions |
| Regulation & Safety | Regulation & Investor Protection |
| Max Leverage | Margin Rate |

#### Секции ДОБАВИТЬ:
- **Research & Analysis Tools**: Morningstar rating, screeners, analyst reports, portfolio analysis
- **Fractional Shares & ETFs**: fractional support, DRIP, ETF selection, commission-free ETFs
- **Robo-Advisor / Managed Portfolios**: если есть (Schwab Intelligent, Fidelity Go)
- **Cash Management**: interest on cash, money market sweep, debit card

#### Hero Quick Stats:
```
Overall Score | Commission per Trade | Account Minimum | Stocks Available | Investor Protection
   9.2/10     |        $0           |       $0        |     12,000+     |    SIPC $500K
```

#### Account Types → Investment Products:
| Столбец | Описание |
|---------|----------|
| Product Type | Brokerage, IRA, Roth IRA, 401K, Joint, Custodial |
| Account Minimum | $0–$25,000 |
| Commission | $0 stocks, $0.65/contract options |
| Fractional Shares | Yes/No |
| Margin Available | Yes, rate: X% |
| DRIP | Yes/No |

#### CTA текст:
- Primary: "Open Brokerage Account" / "Start Investing"
- Secondary: "Compare Stock Brokers"

---

### 3.3 Options Broker Review — АДАПТАЦИЯ

#### Секции ПОКАЗАТЬ:
1. Hero (адаптированный)
2. Quick Stats (адаптированные)
3. Key Finding
4. Pros & Cons
5. Overview
6. Scoring Breakdown (options weights)
7. **Options Pricing** ← НОВАЯ (центральная секция)
8. **Options Platform & Tools** ← НОВАЯ (расширенная)
9. **Strategy Builder** ← НОВАЯ
10. Account Types
11. Regulation & Investor Protection
12. **Options Education** ← НОВАЯ
13. Customer Support
14. FAQ
15. Author Credits

#### Секции СКРЫТЬ:
- Spreads & Fees (forex-формат)
- Execution Model
- Deposit & Withdrawal (стандартные для US brokers)

#### Секции ДОБАВИТЬ:
- **Options Pricing**: per-contract fee, base fee, exercise fee, closing fee, index options
- **Options Platform & Tools**: chain layout, Greeks display, probability, DOM
- **Strategy Builder**: visual P&L, multi-leg entry, risk analysis
- **Options Education**: courses, webinars, paper trading

#### Hero Quick Stats:
```
Overall Score | Per Contract | Closing Fee | Strategy Builder | Options Levels | Paper Trading
   8.5/10    |    $0.50     |     $0      |     ✓ Visual     |    1–5 tiers   |     ✓ Yes
```

#### CTA текст:
- Primary: "Start Trading Options" / "Open Options Account"
- Secondary: "Compare Options Brokers"

---

### 3.4 Futures Broker Review — АДАПТАЦИЯ

#### Секции ПОКАЗАТЬ:
1. Hero (адаптированный)
2. Quick Stats (адаптированные)
3. Key Finding
4. Pros & Cons
5. Overview
6. Scoring Breakdown (futures weights)
7. **All-in Cost Calculator** ← НОВАЯ (центральная feature)
8. **Margin Requirements** ← НОВАЯ
9. **Available Markets** ← НОВАЯ
10. **Platform & Execution** ← переименовано + расширено
11. Regulation (NFA/CFTC)
12. Customer Support
13. FAQ
14. Author Credits

#### Секции СКРЫТЬ:
- Spreads & Fees (неприменимо)
- Account Types (все futures accounts = одинаковые)
- Execution Model (отдельная секция не нужна — интегрировано в Platform)
- Deposit & Withdrawal (стандартное)

#### Секции ДОБАВИТЬ:
- **All-in Cost Calculator**: commission + exchange + clearing + NFA + platform + data = TOTAL
- **Margin Requirements**: intraday vs overnight, per contract (ES, NQ, CL, GC, Micro)
- **Available Markets**: CME, CBOT, NYMEX, COMEX, ICE, EUREX — что доступно
- **Platform & Data Fees**: platform cost, data feed cost, lifetime vs monthly

#### Hero Quick Stats:
```
Overall Score | All-in per Micro | Intraday Margin | Platform Fee | Markets | NFA Member
   8.0/10    |     $1.29        |  $50 (Micro ES) |   $0/month   |  CME+ICE |    ✓ Yes
```

#### CTA текст:
- Primary: "Open Futures Account" / "Start Trading Futures"
- Secondary: "Compare Futures Brokers"

---

### 3.5 Crypto Exchange Review — АДАПТАЦИЯ

#### Секции ПОКАЗАТЬ:
1. Hero (адаптированный)
2. Quick Stats (адаптированные)
3. Key Finding
4. Pros & Cons
5. Overview
6. Scoring Breakdown (crypto weights)
7. **Trading Fees** ← адаптированная (Maker/Taker + tiers)
8. **Security & Trust** ← НОВАЯ (центральная секция)
9. **Supported Coins** ← НОВАЯ
10. **Staking & Earn** ← НОВАЯ
11. Platform & Mobile App
12. **Fiat On/Off Ramp** ← НОВАЯ
13. Regulation & Compliance
14. Customer Support
15. FAQ
16. Author Credits

#### Секции СКРЫТЬ:
- Spreads & Fees (forex формат)
- Account Types (большинство = один аккаунт)
- Execution Model (exchange model = стандарт)
- Deposit & Withdrawal (интегрировано в Fiat On/Off Ramp)

#### Секции ДОБАВИТЬ:
- **Security & Trust**: Proof of Reserves, cold storage %, hack history, insurance, 2FA, SOC 2
- **Supported Coins**: top 50 coins, token categories, listing criteria
- **Staking & Earn**: APY по монетам, lockup periods, risks
- **Fiat On/Off Ramp**: банковский перевод, карта, Apple Pay, fees, currencies

#### Hero Quick Stats:
```
Overall Score | Maker/Taker | Coins Listed | Proof of Reserves | Cold Storage | Staking
   8.7/10    | 0.02/0.04%  |    350+      |    ✓ Audited     |    95%+     | 15+ coins
```

#### CTA текст:
- Primary: "Start Trading Crypto" / "Open Account"
- Secondary: "Compare Crypto Exchanges"

---

### 3.6 Prop Trading Firm Review — ПОЛНОСТЬЮ НОВЫЙ ШАБЛОН

#### Секции (новые, не адаптация):
1. Hero (полностью переработан)
2. Quick Stats (полностью новые)
3. Key Finding
4. Pros & Cons
5. Overview
6. Scoring Breakdown (prop methodology)
7. **Challenge Rules** ← ЦЕНТРАЛЬНАЯ секция
8. **Pricing & Value** ← стоимость challenge, refund policy
9. **Payout History** ← total paid, payout speed, proof
10. **Allowed Strategies** ← что можно, что нельзя
11. **Trading Conditions** ← spreads, platforms, instruments
12. **Scaling Plan** ← как растёт капитал
13. Community & Reputation ← Trustpilot + Discord + YouTube
14. FAQ
15. Author Credits

#### Секции из Forex шаблона — НЕ ПОКАЗЫВАТЬ:
- Regulation & Safety (нерегулируемы)
- Account Types (challenge = единственный "тип аккаунта")
- Deposit & Withdrawal (пополнение = покупка challenge, вывод = payout)
- Execution Model (не применимо)
- Spreads & Fees (не их спреды)

#### Hero Quick Stats:
```
Score | $100K Challenge | Profit Split | Max Drawdown | Time Limit | Total Paid Out
8.3/10|     $540        |     80%      |   10% total  |  Unlimited | $150M+
```

#### Challenge Rules — таблица:
| Параметр | Phase 1 | Phase 2 | Funded |
|----------|---------|---------|--------|
| Profit Target | 8% | 5% | — |
| Max Daily Loss | 5% | 5% | 5% |
| Max Total Loss | 10% | 10% | 10% |
| Min Trading Days | 4 | 4 | — |
| Time Limit | 30 days | 60 days | — |
| Profit Split | — | — | 80% |

#### Allowed Strategies — чеклист:
```
✓ News Trading    ✓ Weekend Holding    ✓ EAs/Bots
✗ Martingale      ✓ Hedging            ✓ Scalping
✗ Copy Trading    ✗ Grid Trading       ✓ Swing Trading
```

#### CTA текст:
- Primary: "Start Challenge" / "Get Funded"
- Secondary: "Compare Prop Firms"

---

## Part 4: Маппинг полей для YAML {#part-4}

### 4.1 Общие поля (все типы)

```yaml
# Общий блок — в каждом broker MD файле
name: "Interactive Brokers"
slug: "interactive-brokers"
verticals: [forex, stocks, options, futures]  # ← NEW
year_founded: 1978
headquarters: "Greenwich, CT, USA"
website: "https://www.interactivebrokers.com"
trustpilot_score: 4.2
trustpilot_count: 5200
min_deposit: 0
```

### 4.2 Forex-специфичные поля

```yaml
forex:
  spread_eurusd: 0.1
  commission_per_lot: 3.50
  leverage_max: "1:500"
  leverage_eu: "1:30"
  currency_pairs: 100
  execution_model: "ECN/STP"
  swap_free: true
  platforms: [MT4, MT5, cTrader, TradingView]
```

### 4.3 Stocks-специфичные поля

```yaml
stocks:
  stock_commission: 0
  etf_commission: 0
  stocks_available: 12000
  etf_available: 13000
  exchanges_count: 150
  fractional_shares: true
  drip: true
  margin_rate: "5.83%"
  cash_interest_rate: "4.83%"
  research_providers: [Morningstar, S&P, Refinitiv]
  ipo_access: true
  mutual_funds: 40000
  robo_advisor: "IBKR Lite Portfolios"
  account_types: [Individual, Joint, IRA, Roth IRA, Trust, Custodial]
  tax_loss_harvesting: false
```

### 4.4 Options-специфичные поля

```yaml
options:
  per_contract_fee: 0.65
  base_fee: 0
  closing_fee: 0.65
  exercise_fee: 0
  assignment_fee: 0
  options_levels: 5
  complex_orders: true
  strategy_builder: true
  greeks_display: true
  probability_calculator: true
  options_screener: true
  paper_trading: true
  options_on_futures: true
```

### 4.5 Futures-специфичные поля

```yaml
futures:
  commission_per_side: 0.85
  exchange_fees: true  # pass-through
  clearing_fee: 0.10
  all_in_micro: 1.32
  all_in_emini: 2.50
  platform_fee_monthly: 0
  data_feed_monthly: 0  # bundled
  intraday_margin_micro_es: 50
  overnight_margin_micro_es: 1320
  markets: [CME, CBOT, NYMEX, COMEX, ICE, EUREX]
  micro_futures: [MES, MNQ, M2K, MYM, MCL]
  dom_quality: "professional"
  order_types: [bracket, OCO, trailing, stop-limit]
```

### 4.6 Crypto-специфичные поля

```yaml
crypto:
  maker_fee: 0.02
  taker_fee: 0.04
  coins_listed: 350
  fiat_currencies: [USD, EUR, GBP]
  staking: true
  staking_coins: [ETH, SOL, ADA, DOT, ATOM]
  staking_apy_range: "3-8%"
  proof_of_reserves: true
  proof_of_reserves_url: "https://..."
  cold_storage_percent: 95
  insurance_fund: "$1B SAFU"
  security_incidents: 0
  withdrawal_fee_btc: 0.0001
  withdrawal_fee_eth: 0.001
  withdrawal_fee_usdt: 1.0
  earn_products: [savings, lending, launchpool]
  leverage_crypto_max: "125x"
  perpetual_swaps: true
```

### 4.7 Prop Firm-специфичные поля

```yaml
prop:
  challenge_prices:
    "10k": 155
    "25k": 250
    "50k": 345
    "100k": 540
    "200k": 1080
  profit_split: 80
  profit_target_p1: 8
  profit_target_p2: 5
  max_daily_loss: 5
  max_total_loss: 10
  time_limit_p1: 30
  time_limit_p2: 60
  min_trading_days: 4
  payout_frequency: "bi-weekly"
  payout_methods: [bank, crypto, paypal]
  scaling_plan: true
  scaling_max: "2M"
  total_paid_out: "$150M+"
  refund_on_pass: true
  free_retry: false
  news_trading: true
  ea_allowed: true
  weekend_holding: true
  hedging: true
  martingale: false
  copy_trading: false
  underlying_broker: "Purple Trading"
  platforms: [MT4, MT5, cTrader]
  instruments: [forex, indices, commodities, crypto]
```

---

## Part 5: Сводная таблица — Конкурентный анализ по типам

### Что показывают конкуренты для каждого типа

| Секция | ForexBrokers.com | BrokerChooser | NerdWallet | Investopedia | StockBrokers.com |
|--------|-----------------|---------------|------------|--------------|-----------------|
| **Forex Review** | Trust Score, 7 categories, spread table | Overall + 6 sub-scores, Fee calc | Pros/Cons, star rating | Pros/Cons, "Why We Picked It" | 5 star categories |
| **Stock Review** | N/A | Overall + fee-focused | Star rating, "Best for" labels, NerdWallet rating | "Why We Chose It", fee table | 15 categories, 1st place awards |
| **Options Review** | N/A | Combined with stock | Combined with stock | Separate "Best for Options" | Per-contract table |
| **Futures Review** | N/A | N/A | N/A | Separate "Best for Futures" | Commission table |
| **Crypto Review** | N/A | Overall + safety focus | Star rating | Separate vertical | N/A |
| **Prop Firm** | N/A | N/A | N/A | N/A | N/A |

**Вывод**: НИКТО не покрывает все 6 типов в едином формате. Это наше конкурентное преимущество — unified scoring across all broker types с адаптированной методологией.

---

## Part 6: Приоритеты реализации

### Порядок внедрения (ROI-based):

| Приоритет | Тип | Обоснование | Объём работы |
|-----------|-----|-------------|--------------|
| 1 | Forex/CFD | Уже сделано — baseline | ✅ Done |
| 2 | Stock Brokers | Огромный объём поиска, $0 commission war, высокий CPL | L (новые брокеры + scoring) |
| 3 | Crypto | Горячий рынок, высокий CPA, уже есть данные по crypto у наших брокеров | M |
| 4 | Options | Niche но high-value audience (US), high CPL | M (новые брокеры) |
| 5 | Prop Firms | Взрывной рост запросов, NO конкурентов с quality scoring | M (полностью новый шаблон) |
| 6 | Futures | Самая маленькая аудитория, niche | S |

### Ключевые технические задачи:

1. **YAML schema extension**: добавить per-vertical поля (Part 4)
2. **Per-vertical scoring engine**: разные веса для разных вертикалей (Part 2)
3. **Review page template adapter**: conditional sections based on `verticals[]` (Part 3)
4. **Hero Quick Stats adapter**: разные метрики в Hero для разных типов (Part 3)
5. **CTA text adapter**: разный текст CTA для разных типов (Part 3)
6. **Ranking filter integration**: vertical-specific ranking filters уже запланированы в M4

---

## Связанные узлы графа

- [[MILESTONES]] — M4 Phase 2 (Stock, Options, Futures)
- [[decisions]] — scoring methodology
- [[design]] — review page template
- [[bill]] — CTA optimization per vertical
