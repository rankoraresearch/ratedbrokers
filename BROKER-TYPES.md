# BROKER-TYPES.md — Различия типов брокеров

> Справочник для адаптации review-страниц, скоринга и контента.
> Полное исследование: `memory/broker-types-research.md`

---

## Быстрая справка: 6 типов

| Тип | Ключевая метрика | Регулятор | Комиссии | Платформа |
|-----|-----------------|-----------|----------|-----------|
| **Forex/CFD** | Spread EUR/USD | FCA, ASIC, CySEC | $0–7/lot | MT4, MT5, cTrader |
| **Stocks** | Commission/trade | SEC, FINRA, BaFin | $0 (US), €1–5 (EU) | thinkorswim, Web |
| **Options** | Per-contract fee | SEC, FINRA | $0–0.65/contract | thinkorswim, Power E*TRADE |
| **Futures** | Commission/side | CFTC, NFA | $0.09–2.25/side | NinjaTrader, TITAN X |
| **Crypto** | Maker/Taker fee | varies | 0.02–0.10% | Proprietary |
| **Prop Firms** | Challenge price | нерегулируемые | $99–$999 challenge | MT4/MT5 + Dashboard |

---

## Review-страница: что показывать/скрывать по типу

### Hero Quick Stats

| Тип | Stat 1 | Stat 2 | Stat 3 | Stat 4 (desktop) |
|-----|--------|--------|--------|-------------------|
| **Forex** | Spread: X pips | Commission | Min Deposit | Leverage |
| **Stocks** | Commission | Min Deposit | Regulation | Instruments |
| **Options** | Contract Fee | Commission | Min Deposit | Regulation |
| **Futures** | Commission/side | Day Margins | Min Deposit | Regulation |
| **Crypto** | Maker/Taker Fee | Coins | Min Deposit | Staking APY |
| **Prop Firms** | Challenge Price | Profit Split | Max Drawdown | Payout |

### Секции: Show/Hide/Rename

| Секция | Forex | Stocks | Options | Futures | Crypto | Prop |
|--------|:-----:|:------:|:-------:|:-------:|:------:|:----:|
| Spread Table | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cost Boxes | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Deposits Table | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Account Types | ✅ | ✅ | ✅ | ✅ rename "Plans" | ✅ | ✅ rename "Challenges" |
| Platform Deep Dive | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Mobile | ✅ | ✅ | ✅ | ❌ desktop-only | ✅ | ❌ |
| Leverage | ✅ | ❌ irrelevant | ❌ margin only | ❌ exchange set | ✅ | ❌ |
| Trustpilot | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ critical |

### Секции: Новые (будущее, M6)

| Секция | Для типов | Описание |
|--------|-----------|----------|
| Investment Products Grid | Stocks | Stocks, ETFs, Bonds, Funds — что доступно |
| Fractional Shares | Stocks | Min investment, eligible tickers |
| IRA/Retirement | Stocks (US) | Types, match %, conversion |
| Options Chain Quality | Options | Greeks, probability, strategy builder |
| Commission Calculator | Stocks, Options | "If you trade X per month, you'll pay $Y" |
| Day Trade Margins | Futures | Per-contract intraday margins |
| Platform Licensing | Futures | Free vs Monthly vs Lifetime |
| Challenge Rules | Prop Firms | Profit target, drawdown, time limit |
| Payout History | Prop Firms | Speed, reliability, denied payouts |

---

## Скоринг: веса по типу

### Текущие веса (Forex — baseline)

| Категория | Forex | Stocks | Options | Futures | Crypto | Prop |
|-----------|:-----:|:------:|:-------:|:-------:|:------:|:----:|
| Regulation & Safety | 25% | 25% | 20% | 20% | 30% | 5% |
| Trading Costs | 20% | 25% | 25% | 30% | 15% | — |
| User Reputation | 15% | 10% | 10% | 15% | 10% | 20% |
| Expert Evaluation | 20% | — | — | — | — | — |
| Platform & Tools | 10% | 15% | 30% | 25% | 15% | 10% |
| Execution Quality | 10% | — | — | — | — | — |
| Research & Education | — | 15% | 10% | — | — | — |
| Investment Selection | — | 10% | 5% | 10% | 15% | — |
| Challenge Fairness | — | — | — | — | — | 25% |
| Payout Reliability | — | — | — | — | — | 25% |
| Security & Trust | — | — | — | — | 15% | 15% |

> **Мульти-тип:** Брокеры в нескольких вертикалях (IBKR, Schwab) получают один общий score.
> Per-vertical scoring отложен на M6 — требует отдельного компонента скоринга.

---

## CTA текст по типу

| Тип | Primary CTA | Secondary CTA | Sub-text |
|-----|------------|---------------|----------|
| Forex | "Visit {name}" | "Read Review" | "From {spread} pips" |
| Stocks | "Start Investing" | "Read Review" | "{commission}" |
| Options | "Trade Options" | "Read Review" | "{contract_fee}/contract" |
| Futures | "Trade Futures" | "Read Review" | "From {commission}/side" |
| Crypto | "Start Trading" | "Read Review" | "{maker_fee} maker fee" |
| Prop Firms | "Get Funded" | "Read Review" | "{profit_split} profit split" |

---

## Risk Warning по типу

| Тип | Default Warning |
|-----|----------------|
| Forex/CFD | "X% of retail CFD accounts lose money" (из B.riskWarning YAML) |
| Stocks | "Investing involves risk, including possible loss of principal" |
| Options | "Options involve risk and are not suitable for all investors" |
| Futures | "Futures trading involves substantial risk of loss" |
| Crypto | "Crypto assets are highly volatile and unregulated" |
| Prop Firms | "Most traders fail funded account challenges" |

---

## Breadcrumb по типу

Определяется полем `B.verticals[]` → первый match из HUB_MAP:

| Вертикаль в B.verticals | Hub Label | Hub Path |
|--------------------------|-----------|----------|
| forex (default) | Forex Brokers | /forex-brokers |
| stocks | Stock Brokers | /stock-trading |
| options | Options Brokers | /options-trading |
| futures | Futures Brokers | /futures-trading |
| crypto | Crypto Brokers | /crypto-trading |
| (prop — будущее) | Prop Firms | /prop-trading-firms |

Приоритет: stocks > options > futures > crypto > forex (для мульти-тип брокеров показываем primary вертикаль)

---

## Файлы для обновления при изменении правил

| Файл | Что содержит |
|------|-------------|
| `src/pages/BrokerReview.jsx` | Conditional rendering, Quick Stats, TOC, CTA |
| `src/data/rankingFilters.js` | hasVertical() primitives, filters |
| `src/data/categoryHubs.js` | Hub configs (slug, path, color, icon) |
| `scripts/build-brokers.mjs` | YAML → JS field mapping |
| `content/brokers/*.md` | YAML frontmatter + MD sections |
| `BROKER-TYPES.md` | **Этот файл** — source of truth для различий |
