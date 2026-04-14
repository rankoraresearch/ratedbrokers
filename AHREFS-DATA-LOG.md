# Ahrefs Data Log — RatedBrokers Keyword Intelligence

> **⚠️ Важно:** Ahrefs API используется ТОЛЬКО по явной команде Егора (см. `memory/feedback_ahrefs_api.md`).
> Данные собираются для двух целей: (1) content tier segmentation, (2) будущий linkbuilding (какие страницы продвигать outreach-ссылками).

---

## История запросов

### Запрос #1 — 2026-04-15 — Initial keyword segmentation (293 rankings + 51 reviews)

**Цель:** Сегментировать 293 тематических рейтинга + 51 ревью на tier S/A/B/C по потенциалу трафика, чтобы определить приоритет написания контента (1.89M слов с нуля).

**Команда Егора:** "У меня есть апи Ахревса. Ты можешь эту информацию найти через Ахревс?" + выдал ключ.

**Endpoint:** `GET https://api.ahrefs.com/v3/keywords-explorer/overview`

**Fields requested:** `keyword, volume, difficulty, cpc, traffic_potential, parent_topic, global_volume, clicks, intents`

**Country mapping (для country-specific рейтингов):**
- 310 keywords → US (default + general queries)
- 7 → GB (UK)
- 4 → DE (Germany, Europe)
- 3 → AU
- 2 каждая → CA, IN, AE, SG, ZA, NZ
- 1 каждая → NL, FR, IT, CH, MX, JP, BR, ES

**Скрипт:** `scripts/ahrefs-fetch.mjs` (идемпотентный, читает ключ из `.env`)
**Входные данные:** `data/kw-seed.json` (293 ranking-имён + 51 review-имён, преобразованные в ключи)
**Выходные данные:** `data/kw-ahrefs.json` + `data/kw-tiers.csv` (отсортировано по tier + TP)

**Credits использовано:** ~350 из 1M лимита API-ключа (workspace limit 20M/мес, usage 19M на момент запроса — почти исчерпано).

---

## Сводка данных (2026-04-15)

### Общие объёмы

| Метрика | Rankings (293) | Reviews (51) |
|---|---|---|
| Total Traffic Potential (parent) | 291,240 | 30,920 |
| Total exact volume (страна) | 15,810 | — |
| Zero-volume keywords | 159 (54%) | — |

### Tier distribution

**Rankings:** S=21, A=24, B=35, C=213
**Reviews:** S=9, A=29, B=13, C=0

**Tier formula (применена):**
- **S:** TP ≥ 4,000 OR (TP ≥ 1,500 AND CPC ≥ $5)
- **A:** TP ≥ 800 OR (TP ≥ 300 AND CPC ≥ $4)
- **B:** TP ≥ 100 OR (V ≥ 20 AND CPC ≥ $3)
- **C:** остальное

---

## Top-20 Rankings по Traffic Potential

| # | Ranking | Tier | TP | V | KD | CPC |
|---|---------|------|----|----|-----|-----|
| 1 | Best Stock Trading Brokers | S | 41,000 | 70 | 61 | $3.50 |
| 2 | Best Stock Trading Platforms | S | 41,000 | 400 | 87 | $2.00 |
| 3 | Best Crypto Brokers | S | 29,000 | 150 | 83 | $6.00 |
| 4 | Best Stock Brokers UK | S | 24,000 | 150 | 2 | $5.00 |
| 5 | Best Bitcoin Trading Platforms | S | 19,000 | 40 | 77 | $0.00 |
| 6 | Best Stock Trading Apps | S | 17,000 | 700 | 50 | $3.00 |
| 7 | Best Crypto Wallets | S | 17,000 | 1300 | 87 | $4.50 |
| 8 | Best Crypto Trading Apps | S | 11,000 | 250 | 80 | $8.00 |
| 9 | Best Regulated Forex Brokers | S | 9,600 | 150 | 25 | $6.00 |
| 10 | Best Forex Brokers USA | S | 8,100 | 80 | 33 | $8.00 |
| 11 | Best Forex Brokers | S | 7,800 | 1300 | 39 | $4.50 |
| 12 | Best Stock Brokers for Beginners | S | 6,500 | 200 | 52 | $3.00 |
| 13 | Best Crypto Exchanges | S | 4,700 | 2200 | 94 | $5.00 |
| 14 | Best Options Brokers | S | 4,400 | 250 | 16 | $5.00 |
| 15 | Best Forex Brokers for Day Trading | S | 4,200 | 10 | 31 | $6.00 |
| 16 | Best Futures Brokers USA | A | 3,700 | 90 | 5 | $0.00 |
| 17 | Best Forex Brokers UK | S | 3,300 | 350 | 49 | $15.00 |
| 18 | Best Robo-Advisors | A | 3,100 | 100 | 51 | $0.00 |
| 19 | Best Copy Trading Platforms | A | 2,700 | 400 | 63 | $3.50 |
| 20 | Best TradingView Brokers | S | 2,500 | 20 | — | $7.00 |


---

## Top-20 Reviews по Traffic Potential

| # | Broker | Tier | TP | V | KD | CPC |
|---|--------|------|----|----|-----|-----|
| 1 | XM | S | 9,100 | 400 | 37 | $0.35 |
| 2 | Robinhood | S | 3,000 | 2500 | 54 | $1.90 |
| 3 | Webull | S | 1,600 | 3700 | 31 | $2.00 |
| 4 | Exness | S | 1,600 | 1100 | 28 | $0.80 |
| 5 | eToro | S | 1,200 | 1600 | 50 | $1.40 |
| 6 | FP Markets | A | 1,100 | 250 | 15 | $2.00 |
| 7 | FOREX.com | A | 1,000 | 400 | 7 | $12.00 |
| 8 | Fidelity Investments | A | 1,000 | 300 | 26 | $1.70 |
| 9 | Plus500 | A | 800 | 1100 | 10 | $3.50 |
| 10 | Charles Schwab | A | 800 | 1000 | 24 | $1.70 |
| 11 | Interactive Brokers | S | 700 | 900 | 17 | $1.80 |
| 12 | TradeStation | A | 600 | 1300 | 12 | $4.50 |
| 13 | IG | A | 600 | 250 | 1 | $4.00 |
| 14 | Axi | B | 600 | 100 | 4 | $0.00 |
| 15 | BlackBull Markets | A | 500 | 250 | 2 | $9.00 |
| 16 | OANDA | A | 450 | 400 | 7 | $2.00 |
| 17 | AvaTrade | A | 450 | 500 | 5 | $1.80 |
| 18 | FxPro | S | 400 | 600 | 7 | $2.50 |
| 19 | Trading 212 | S | 400 | 400 | 8 | $1.20 |
| 20 | Libertex | A | 350 | 500 | 1 | $2.00 |


---

## Топ-20 High-CPC (commercial intent proxy — для linkbuilding)

Высокий CPC = рекламодатели платят много = коммерческий трафик конвертирует. Приоритет для outreach-ссылок.

| # | Keyword | Tier | CPC | V | TP | KD |
|---|---------|------|-----|----|----|-----|
| 1 | Best Spread Betting Platforms UK | A | $40.00 | 200 | 0 | — |
| 2 | Best CFD Brokers UK | A | $35.00 | 150 | 400 | 14 |
| 3 | Best Forex Brokers Australia | A | $19.00 | 150 | 1,400 | 5 |
| 4 | Best Forex Brokers UK | S | $15.00 | 350 | 3,300 | 49 |
| 5 | Best Commodities Brokers | A | $12.00 | 10 | 300 | 2 |
| 6 | Best CFD Brokers Australia | A | $11.00 | 100 | 1,400 | 2 |
| 7 | Best Forex Brokers USA | S | $8.00 | 80 | 8,100 | 33 |
| 8 | Best Crypto Trading Apps | S | $8.00 | 250 | 11,000 | 80 |
| 9 | Best Forex Brokers Canada | S | $8.00 | 250 | 1,900 | 51 |
| 10 | Best Forex Brokers UAE | A | $8.00 | 150 | 600 | — |
| 11 | Best Forex Trading Apps | S | $7.00 | 300 | 1,900 | 55 |
| 12 | Best Forex Brokers for Beginners | A | $7.00 | 150 | 800 | 9 |
| 13 | Best TradingView Brokers | S | $7.00 | 20 | 2,500 | — |
| 14 | Best Futures Trading Platforms | S | $7.00 | 400 | 2,000 | 44 |
| 15 | Best Regulated Forex Brokers | S | $6.00 | 150 | 9,600 | 25 |
| 16 | Best Spread Betting Brokers | A | $6.00 | 100 | 350 | 39 |
| 17 | Deposit Bonus Forex Brokers | C | $6.00 | 10 | 0 | — |
| 18 | Best Forex Brokers for Day Trading | S | $6.00 | 10 | 4,200 | 31 |
| 19 | Best ECN Forex Brokers | B | $6.00 | 80 | 250 | 1 |
| 20 | Best Crypto Brokers | S | $6.00 | 150 | 29,000 | 83 |


---

## Low-KD Reachable (KD ≤ 30 + TP ≥ 500) — quick wins для linkbuilding

Рейтинги с низкой конкуренцией И реальным трафиком. Идеальные кандидаты для outreach с фокусом.

| # | Ranking | Tier | KD | TP | V | CPC |
|---|---------|------|-----|-----|----|-----|
| 1 | Best Stock Brokers UK | S | 2 | 24,000 | 150 | $5.00 |
| 2 | Best Regulated Forex Brokers | S | 25 | 9,600 | 150 | $6.00 |
| 3 | Best Options Brokers | S | 16 | 4,400 | 250 | $5.00 |
| 4 | Best Futures Brokers USA | A | 5 | 3,700 | 90 | $0.00 |
| 5 | Best TradingView Brokers | S | 0 | 2,500 | 20 | $7.00 |
| 6 | Best Forex Signal Providers | A | 4 | 2,400 | 200 | $1.30 |
| 7 | Best Stock Brokers for Day Trading | A | 0 | 2,200 | 30 | $4.50 |
| 8 | Best Stocks and Shares ISA | S | 17 | 2,100 | 400 | $1.90 |
| 9 | Best CFD Brokers Australia | A | 2 | 1,400 | 100 | $11.00 |
| 10 | Best Forex Brokers Australia | A | 5 | 1,400 | 150 | $19.00 |
| 11 | Best Forex Brokers South Africa | A | 26 | 1,300 | 150 | $3.00 |
| 12 | Best Futures Brokers | A | 22 | 900 | 500 | $0.80 |
| 13 | Best Penny Stock Brokers | A | 12 | 900 | 80 | $3.50 |
| 14 | Best CFD Brokers | A | 22 | 800 | 250 | $2.50 |
| 15 | Best Forex Brokers for Beginners | A | 9 | 800 | 150 | $7.00 |
| 16 | Zero Spread Forex Brokers | B | 4 | 700 | 100 | $3.50 |
| 17 | Lowest Spread Forex Brokers | A | 13 | 600 | 150 | $5.00 |
| 18 | Best ETF Brokers | B | 6 | 600 | 200 | $2.00 |
| 19 | Best Forex Brokers UAE | A | 0 | 600 | 150 | $8.00 |


---

## Zero-volume Keywords (159 шт.) — blue ocean / cut candidates

Эти 159 рейтингов имеют нулевой exact volume И нулевой global volume в Ahrefs. Два варианта:
1. **Blue ocean** — реальный спрос есть, но через long-tail (parent topic может подтягивать)
2. **Cut** — нет ни volume, ни parent topic traffic → не инвестируем в контент

Полный список см. `data/kw-tiers.csv` (фильтр tier=C, volume=0, traffic_potential=0).

### Первые 30 для ознакомления:

- Best Low Spread Crypto Brokers
- Forex Brokers with Proprietary Platforms
- Best Low Cost CFD Brokers
- Best CFD Brokers with Charting Tools
- Best Forex Brokers for Carry Trading
- Forex Brokers with 24/7 Support
- Lowest Spread CFD Brokers
- Best Dogecoin Brokers
- Best Forex Brokers for Position Trading
- Best CFD Brokers for Professionals
- Best Brokers for Real Stock Trading
- Best USD/CHF Brokers
- Best GBP/USD Brokers
- Best EUR/USD Brokers
- Forex Brokers with Loyalty Programs
- Best Myfxbook AutoTrade Brokers
- Best High-Frequency Trading Brokers
- Best Forex Brokers with Charting Tools
- Best Futures Brokers with NinjaTrader
- Best Spread Betting Platforms for Beginners
- Best Shares Spread Betting Platforms
- Best Index Spread Betting Platforms
- Best Forex Brokers for Professionals
- 1:1000 Leverage Forex Brokers
- Best Forex Apps for Android
- Best AUD/USD Brokers
- Best Regulated Crypto Brokers
- 1:200 Leverage Forex Brokers
- Best EUR/GBP Brokers
- 1:100 Leverage Forex Brokers


---

## Как использовать эти данные для linkbuilding (будущее)

### Приоритеты для outreach (по мере важности)

1. **S-tier rankings с TP ≥ 4,000** — главные money pages. Таргетировать outreach на эти URL. Backlinks дадут максимальный ROI.
2. **High-CPC keywords (CPC ≥ $5)** — commercial intent, конвертируют в affiliate revenue. Guest posts / link inserts сюда.
3. **Low-KD Reachable (KD ≤ 30 + TP ≥ 500)** — можно дотянуться малым количеством ссылок (5-15 DR40+ ссылок часто хватает).
4. **Reviews top-20 по TP** — broker review pages с большим TP. Linkbuilding на них драйвит affiliate conversions.

### Anti-priority

- **Zero-volume keywords** — не тратить outreach-бюджет. Либо cut, либо template+ без продвижения.
- **KD ≥ 70 без brand** — Forbes, Investopedia забрали первые места. На новом домене DR < 40 нереально.

### Данные для Bill (SEO strategist)

Полный датасет в `data/kw-ahrefs.json` — Bill может использовать для:
- SEO audit existing pages (соответствие KD нашему DR)
- Keyword clustering (через parent_topic)
- SERP features map (serp_features поле в сыром JSON, не в summary)
- Intent filtering (informational/commercial/transactional разделение)

---

## Файлы

| Файл | Содержание | Git |
|---|---|---|
| `scripts/ahrefs-fetch.mjs` | Скрипт batch fetch по 50 KW/запрос, country-aware | commit |
| `data/kw-seed.json` | 293 ranking + 51 review names → Ahrefs-ready keywords | gitignored |
| `data/kw-ahrefs.json` | Сырые данные из Ahrefs (все поля + tier) | gitignored |
| `data/kw-tiers.csv` | Human-readable CSV, sortable в Excel | gitignored |
| `public/audit/wordcount-v2.html` | Визуализация с tier badges + сортировкой по TP | commit |

---

## Changelog

- **2026-04-15:** Первый массовый запрос. 344 keywords. Tier формула применена. HTML-отчёт обновлён.
- **Следующее обновление:** планируется когда пойдём в production content writing — refresh данные через 30-60 дней для проверки динамики.
