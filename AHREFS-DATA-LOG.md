# Ahrefs Data Log — RatedBrokers Keyword Intelligence

> **⚠️ Важно:** Ahrefs API используется ТОЛЬКО по явной команде Егора (см. `memory/feedback_ahrefs_api.md`).
> Данные собираются для двух целей: (1) content tier segmentation, (2) будущий linkbuilding (какие страницы продвигать outreach-ссылками).

---

## История запросов

### Запрос #4 — 2026-04-16 — v2 Enrichment (improved primary selection + all_emails)

**Цель:** после сбора 3,755 контактов в Запросе #3 — переработать выбор primary с учётом DR, сохранить все email'ы на домене, добавить provenance (source_url + source_snippet).

**Скрипты:**
- `scripts/enrich-donors-v2.mjs` — v2 crawler с DR-aware scoring, retry, bounded body, structured logging
- `scripts/donors-rescore.mjs` — re-apply rules на all_emails без повторного fetch

**Schema changes (D1):**
- `all_emails TEXT` — JSON массив: `[{email, cat, w, m, host, score}, ...]`
- `primary_email TEXT` — выбранный по новым правилам
- `fallback_email_1, fallback_email_2 TEXT`
- `source_url, source_method, source_snippet TEXT` — provenance
- `enriched_v2_at TEXT` — timestamp обработки

**Ключевые правила v2:**
- **DR-aware weights:** contact@ wins на DR<60 (weight 80), pr@ wins на DR≥80 (weight 85)
- **Host classification:** on_domain +30, foreign_provider −25 (gmail/yahoo etc)
- **Non-outreach exclusion:** jobs, careers, privacy, legal, corrections, feedback — никогда primary
- **Multi-lang placeholder filter:** example.com, voorbeeld@domein.com, beispiel@domain.de, ejemplo@dominio.es, exemple@domaine.fr
- **Methods:** plain regex + Cloudflare email decode + mailto URL-decode + JSON-LD ContactPoint + obfuscated (&#64;)

**Codex Review:** 3 HIGH findings выявлены и пофикшены:
1. H1 — failed crawl → D1 write null (затирало legacy v1 data) → добавлен `anySuccess` флаг, если все 9 fetches упали → **skip D1 write**
2. H2 — нет retry/backoff на 408/425/429/5xx → добавлен exp backoff + jitter
3. H3 — drop-телеметрия → structured NDJSON лог в `logs/enrich/v2-errors-*.ndjson`

**Recovery 312 records:** во время transient event 259 доменов подряд записали primary_email=null, all_emails=[]. После codex fix я сбросил их `enriched_v2_at=NULL` и перезапустил pending-only прогон.

**Финальные результаты v2:**

| Метрика | Значение |
|---|---|
| v2 processed | **3,559 / 3,755** (95%) |
| with new primary_email | **2,902** |
| with fallback_email_1 | **1,308** |
| with fallback_email_2 | **722** |
| primary changed vs v1 | **497** (~13%) |
| rescore updates | **120 changed + 12 placeholders cleared** |
| errors in final | **0** |

**Total all_emails flat:** **8,620** email-записей across all domains (primary + fallbacks + rank_N).

**Файлы:**
- `Donor-List-2026-04-16-FINAL.xlsx` — 9 вкладок, 26 MB (+ backup в `data/backups/`)
- `logs/enrich/v2-full-*.log`, `v2-resume-*.log` — полные логи прогонов
- `logs/enrich/v2-errors-*.ndjson` — structured error log

**Коммиты:**
- `c3d4de5` — donors infrastructure
- `9928777` — v2 enrichment baseline
- `402b897` — resilience fixes (codex review)
- `93ec61b` — rescore + dashboard UI + final xlsx

**Credits Ahrefs:** 0 (всё self-hosted fetch).

---

### Запрос #3 — 2026-04-15/16 — Contact Enrichment (donors → outreach contacts)

**Цель:** Обогатить 7,805 refdomains (из Запроса #2) реальными email/contact-form URL для будущих outreach-кампаний.

**Скрипты:**
- `scripts/enrich-donors.mjs` — базовый (fetch + regex)
- `scripts/enrich-donors-headless.mjs` — Playwright+stealth для blocked/JS-heavy

**Правила:** `OUTREACH-EMAIL-RULES.md` (tier-scoring, extraction, placeholder filters)
**Спринты:** `OUTREACH-SPRINTS.md` (8 фаз от калибровки до campaign export)

**Хранение:** D1 таблица `donors` (schema в `backend/schema.sql`), dashboard `/api/admin/donors/dashboard`.

**Результаты на 2026-04-16:**

| Статус | Кол-во | % от 7,805 |
|---|---|---|
| ✅ **found** (email или contact form) | **3,755** | **48%** |
| ⚪ no_contact | 2,556 | 33% |
| 🛑 blocked | 684 | 9% |
| 💀 dead | 810 | 10% |

**По tier (из 3,755 found — точная раскладка на момент 3,616 до Sprint A):**
- tier1 (guest-post): 3
- tier2 (editorial): ~80+
- tier3 (PR): ~33+
- tier4 (partnerships): ~15+
- tier5 (info/support): ~326+
- tier9 (personal domain): ~88+
- Contact form URL: ~72+

**Этапы прогона:**
1. **Базовый regex** (3,616 found) — fetch + regex на 7,805 доменов
2. **Sprint A v1 — Playwright+stealth** (+133 → 3,749): зависание на batch 68, killed
3. **Sprint A v2 — hard-timeout 35s** (+6 чистых → 3,755, batch 107/431 до остановки): часть PUT в 404 из-за временной потери routes

**Непробиваемые классы (~30% от всего):**
- Enterprise bot shields (muckrack, crunchbase до починки) — даже с stealth
- Гео-блоки (iau.ir)
- SPA без публичного email (aol.com, forexfactory.com)
- Платформы без контента (github.io)

**Откат деплоя:** Worker потерял donors-routes в середине Sprint A v2 → PUT 404. Перезадеплоили 16.04 01:10 UTC. D1 данные не потеряны, но часть upgraded-статусов из v2 не записались.

**Credits Ahrefs использовано:** 0 (enrichment не использует Ahrefs, только self-hosted fetch + Playwright).

---

### Запрос #2 — 2026-04-15 — Competitor refdomains pull (11 конкурентов)

**Цель:** Собрать все ссылающиеся домены 11 конкурентов для outreach-стратегии линкбилдинга.

**Команда Егора:** "У Ахревса точно есть возможность скачивать бэк ссылки... Ты можешь это сделать для наших конкурентов." + уточнил: "обратные ссылки не нужно, просто домены, ссылающиеся".

**Конкуренты:** forexbrokers, bestbrokers, brokerchooser, investopedia, nerdwallet, bankrate, fxempire, compareforexbrokers, tradersunion, fxscouts, investing.com

**Endpoints:**
- `GET /v3/site-explorer/domain-rating` — DR per domain
- `GET /v3/site-explorer/backlinks-stats` — total backlinks/refdomains
- `GET /v3/site-explorer/metrics` — org_traffic/org_keywords
- `GET /v3/site-explorer/refdomains` — список refdomains (с keyset pagination через `where={"field":"domain_rating","is":["lte",N]}`)

**Скрипт:** `scripts/ahrefs-backlinks.mjs` (команды: `metrics`, `refdomains [limit]`). Keyset pagination (Ahrefs v3 не поддерживает `offset`), дедупликация на клиенте, resume-friendly (скипает сайты с существующим CSV).

**Входные данные:** хардкод 11 доменов в скрипте.
**Выходные данные:** `data/ahrefs-refdomains-2026-04-14/<domain>.csv` (11 файлов) + `_summary.json`.

**Колонки CSV:** domain, domain_rating, traffic_domain, first_seen, last_seen, links_to_target, dofollow_links, dofollow_refdomains, is_root_domain, is_spam

**Результаты pull:**

| Конкурент | Rows | Cutoff DR | Покрытие от total | Статус |
|---|---|---|---|---|
| investopedia.com | 106,141 | 2.3 | ~33% от 320K | ✅ Ценное ниже DR 2 — спам |
| tradersunion.com | 3,977 | 38 | ~30% от 13K | ⚠️ Частично |
| investing.com | 3,912 | 76 | ~5% от 83K | ⚠️ Только top |
| fxempire.com | 3,000 | 49 | ~26% от 12K | ⚠️ Частично |
| forexbrokers.com | 1,000 | 35 | ~18% (top-1000 by DR) | ✅ Full по ценности |
| brokerchooser.com | 1,000 | 49 | ~14% (top-1000 by DR) | ✅ Full cream |
| bestbrokers.com | 1,000 | 38 | ~38% | ✅ Full |
| compareforexbrokers.com | 1,000 | 35 | ~46% | ✅ Full |
| fxscouts.com | 1,000 | 16 | ~35% | ✅ Full |
| **nerdwallet.com** | **0** | — | 0% | ❌ Потерян |
| **bankrate.com** | **0** | — | 0% | ❌ Потерян |

**Total:** 122,031 refdomains across 11 CSVs.

**Credits использовано:** ~20M units (исчерпан месячный лимит workspace). **API units left: 0.**

**Узнали про Ahrefs API v3:**
- Стоимость одной страницы `refdomains` с `where`+`select`(10 cols)+`order_by` = ~23,000 units за 1000 rows (гораздо дороже обычного 1 unit/row). Запрос без `where` дешевле.
- `offset` параметр **НЕ поддерживается**. Только keyset pagination через `where`.
- `where` syntax: `{"field":"X","is":["<op>",value]}` (ключ `is`, не `operator`). Операторы: `eq/neq/gt/gte/lt/lte/substring/prefix/empty/is_null`. Для массивов: `list_is`.
- `mode: 'domain'` исключает поддомены — для крупных сайтов (investopedia.com → www.investopedia.com) нужен `mode: 'subdomains'`.
- Эндпоинт `metrics` не возвращает `domain_rating`/`backlinks` — для них отдельные endpoints: `domain-rating` и `backlinks-stats`.

**Ошибка сессии:** перед full pull я удалил CSV nerdwallet и bankrate, чтобы keyset начался с DR=100. Rerun упёрся в 403 на первом запросе каждого сайта → сохранены пустые CSV. Top-1000 cream, который уже был с предыдущего запуска (из первого pull с offset), оказался потерян. **Вывод:** при будущих pulls не удалять существующие файлы — делать отдельный `refdomains-continue` режим, который читает существующий CSV, находит последний DR и продолжает keyset оттуда.

**Следующий шаг (после reset месячного лимита):**
- Доделать nerdwallet, bankrate, investing, fxempire, tradersunion до DR 20.
- Ожидаемая стоимость: ~5-10M units (только крупные, с фильтром `where domain_rating:gte:20`, чтобы не тянуть шлак).

**Metrics snapshot (из первой части Запроса #2, до исчерпания):**

| target | DR | backlinks | refdomains | org_traffic |
|---|---|---|---|---|
| investopedia.com | 92 | 10M | 320K | 19M |
| nerdwallet.com | 90 | 3.5M | 98K | 7.7M |
| bankrate.com | 90 | 6M | 98K | 10.2M |
| investing.com | 89 | 25M | 83K | 93M |
| fxempire.com | 73 | 341K | 12K | 224K |
| tradersunion.com | 72 | 978K | 13K | 1.5M |
| compareforexbrokers.com | 69 | 12K | 2K | 881 |
| brokerchooser.com | 66 | 198K | 7K | 89K |
| forexbrokers.com | 61 | 25K | 5K | 96K |
| bestbrokers.com | 58 | 21K | 3K | 25K |
| fxscouts.com | 30 | 14K | 3K | 15K |

Файл: `data/ahrefs-competitors-metrics-2026-04-14.json`

---

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
