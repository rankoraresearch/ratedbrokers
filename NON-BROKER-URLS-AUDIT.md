# Non-Broker URLs Audit — RatedBrokers

> **Дата:** 2026-04-22
> **Запрос Егора:** «у нас есть странные рейтинги не связанные с брокерами — `/best-crypto-exchanges`, `/best-crypto-wallets`. Найди все подобные, разберись как мы к этому пришли, предложи стратегию.»
> **Статус:** Research завершён, ждём решения Егора по варианту (A/B/C).
> **Главный документ для resume сессии.**

---

## TL;DR

Из 293 тематических рейтингов **5 имеют критичный intent mismatch** (страница про брокеров, а пользователь искал не брокера) и **3 подозрительных**. Они появились в коммите `d04440b` (01.04.2026) — план Билла включал предупреждение "requires different content type", но при переносе из исследования в Sprint 2.4 это предупреждение потерялось, и URL добавили в общий массив `RANKINGS` с фильтром `isCrypto`. Рекомендация — **Hybrid (Вариант C)**: delete+301 для low-affiliate, noindex placeholder + future content для high-affiliate.

---

## 1. Хронология как мы к этому пришли

| Дата | Событие | Файл |
|------|---------|------|
| 31.03.2026 | Билл (SEO) собрал дерево 330 рейтингов **с предупреждениями**: `/best-crypto-wallets [NEW] — requires different content type` и `/best-crypto-exchanges [NEW] — другой тип контента` | `THEMATIC-RANKINGS-TREE.md:596,611-612` |
| 31.03.2026 | План `URL-ARCHITECTURE-v3-OPTIONS.md` Билла учитывал non-broker URL как отдельную проблему | `URL-ARCHITECTURE-v3-OPTIONS.md` |
| ~31.03.2026 | При переносе в `MILESTONES.md` Sprint 2.4 предупреждения **потеряны** — `best-crypto-exchanges, best-crypto-wallets` в одной bullet-строке с `best-crypto-brokers-uk, -usa, -australia` | `MILESTONES.md:137-143` |
| **01.04.2026** | Коммит **`d04440b`** ("M4 Sprint 1+2 — broker verticals + 53 new rankings") добавил все 53 URL скопом в `rankings.js` секцию «X. CRYPTO EXPANSION (14)» | `src/data/rankings.js:353-354` |
| 01.04.2026 | В `rankingFilters.js` фильтры = `isCrypto` для exchanges/wallets, `scoreAbove(8.0)` для courses, `TradingView/cTrader` для chart-websites — все рендерят **существующих CFD-брокеров** | `src/data/rankingFilters.js:385-386,403-404` |

**Источники-доказательства:**
```bash
git log --all --oneline -- src/data/rankings.js
# d04440b feat: M4 Sprint 1+2 — broker verticals + 53 new rankings

git show d04440b -s
# "Crypto expansion (14): beginners, regulated, cardano, usdt, btc-etf,
#  margin, demo, 5 countries, exchanges, wallets"
```

---

## 2. Root cause (3 слоя)

1. **Lost-in-translation:** предупреждения "requires different content type" из research → потеряны при переносе в план/спринт.
2. **Нет валидации pipeline:** любой slug в `rankings.js` автоматически рендерится через `RankingPage.jsx` — нет ассерта "этот URL про брокера + есть фильтр + возвращает релевантный контент".
3. **Нет архитектурного разделения:** broker-rankings и non-broker entity rankings (exchanges, wallets, courses, robo-advisors) живут в одном массиве с одним template — но это **разные сущности** с разной методологией, метриками, affiliate-сетями.

---

## 3. Полная ревизия 293 URL

Метод: `grep -oE 'slug: "/[a-z0-9-]+"' src/data/rankings.js | sort -u` → 293 URL → отфильтровать без `broker(s)` → 39 кандидатов → классификация по search intent (что пользователь ожидает увидеть).

### 🔴 КАТЕГОРИЯ A — критичный intent mismatch (5 URL)

| URL | Intent (что искал юзер) | Что выводит сейчас | SV/мес |
|-----|------------------------|---------------------|--------|
| `/best-crypto-exchanges` | Binance, Coinbase, Kraken, Bybit, OKX | Список наших CFD-крипто-брокеров | **20K** |
| `/best-crypto-wallets` | MetaMask, Ledger, Trezor, Trust Wallet | Те же CFD-брокеры | **10K** |
| `/best-forex-trading-courses` | Udemy, Investopedia Academy, Babypips, BabyPips School | Top-форекс брокеры с score≥8 | **5K** |
| `/best-forex-chart-websites` | TradingView, Investing.com, MarketWatch | Брокеры с TradingView/cTrader | **2K** |
| `/best-robo-advisors` | Betterment, Wealthfront, Acorns, M1, SoFi | Stock-брокеры | **8K** |

**Суммарно ~45K SV/мес теряется из-за intent mismatch.**

### 🟡 КАТЕГОРИЯ B — подозрительные (3 URL)

| URL | Проблема |
|-----|----------|
| `/best-crypto-staking-platforms` | Юзер ищет CEX (Binance/Kraken) или DeFi (Lido, Rocket Pool), не CFD-брокеров |
| `/best-usdt-trading-platforms` | Юзер ищет Binance/Bybit/OKX, не брокеров с USDT-депозитом |
| `/best-forex-signal-providers` | Юзер ищет MQL5 Signals marketplace или Signals.io, не брокеров |

### 🟢 КАТЕГОРИЯ C — OK (правильный intent, оставить)

- Все `/best-*-trading-apps`, `/best-*-trading-platforms` (про брокерские платформы/приложения)
- `/best-copy-trading-platforms`, `/best-social-trading-platforms` (eToro/NAGA/ZuluTrade — реально брокеры)
- `/best-crypto-copy-trading`, `/best-crypto-trading-apps`
- Все индивидуальные крипто-активы: `/best-bitcoin-brokers`, `/best-ethereum-brokers`, `/best-bitcoin-etf-brokers`, `/best-cardano-brokers`, `/best-solana-brokers`, `/best-altcoin-brokers`, `/best-dogecoin-brokers`, `/best-xrp-brokers`
- `/best-stocks-and-shares-isa` (UK ISA-брокеры)
- Все остальные `/best-forex-*`, `/best-cfd-*`, `/best-stock-*`, `/best-options-*`, `/best-futures-*`, `/best-spread-betting-*`

---

## 4. Последствия (ROI / SEO / risk)

1. **SEO-штраф за intent mismatch:** Google видит high bounce + low dwell time → проседание всего кластера `/best-crypto-*`.
2. **YMYL deception risk:** финансовая ниша + brokers подписаны как "exchanges/wallets" → риск manual action или algorithmic penalty.
3. **Потерянный affiliate-доход:** 45K SV/мес в high-CPA нише (Binance Partner $50-200, Ledger 10-20% revshare).
4. **Internal link equity drain:** ссылки из `/best-crypto-brokers` на `/best-crypto-exchanges` усиливают проблему.
5. **E-E-A-T минус:** content claim экспертизы которой у нас нет (мы не тестируем биржи и кошельки).

---

## 5. Стратегия — 3 варианта

### 🅰️ Вариант 1 — DELETE + 301 (~2-3 часа, 0 контента)

Удалить из `rankings.js`, добавить redirects в `public/_redirects`:

```
/best-crypto-exchanges       → /best-crypto-brokers              (301)
/best-crypto-wallets         → /best-crypto-trading-apps         (301)
/best-forex-trading-courses  → /best-forex-brokers-education     (301)
/best-forex-chart-websites   → /best-tradingview-brokers         (301)
/best-robo-advisors          → /best-stock-brokers-for-beginners (301)
```

**Плюсы:** мгновенно чистит SEO-яму, минимальный риск.
**Минусы:** теряем 45K SV/мес потенциала.

### 🅱️ Вариант 2 — REPURPOSE (4-6 недель)

Оставить URL, написать настоящий контент под intent. Требует:
- Новые data-модели: `src/data/exchanges.js`, `src/data/wallets.js`, `src/data/roboAdvisors.js`, `src/data/courses.js`, `src/data/chartTools.js`
- Новый template (не `RankingPage.jsx`) — другие метрики
- 5 × 2000-3000 слов контента (Джон/Билл research)
- Интеграция affiliate-сетей: Binance Partner, Coinbase Affiliate, Ledger, Trezor, Impact (Betterment), ShareASale (courses), TradingView affiliate
- Отдельная методология (не applicable: spreads, leverage, regulators)

**Плюсы:** новая вертикаль дохода, 45K SV/мес, расширение moat.
**Минусы:** большой скоуп; конфликт с позиционированием "Independent Broker Reviews" на `/about`.

### 🅲 Вариант 3 — HYBRID ⭐ (рекомендован)

Делим по **affiliate potential × intent legitimacy**:

**Фаза 1 (срочно, ~2-3 часа) — DELETE + 301** для low-affiliate / non-monetizable:
```
/best-forex-trading-courses    → /best-forex-brokers-education
/best-forex-chart-websites     → /best-tradingview-brokers
/best-forex-signal-providers   → /best-copy-trading-platforms (опционально, если signals не в roadmap)
/best-crypto-staking-platforms → /best-crypto-brokers
/best-usdt-trading-platforms   → /best-crypto-brokers
```

**Фаза 1 — noindex placeholder** для high-affiliate (готовим к будущему монетизированию):
- `/best-crypto-exchanges` (20K SV, Binance/Coinbase $50-200 CPA) ⭐
- `/best-crypto-wallets` (10K SV, Ledger/Trezor 10-20% revshare) ⭐
- `/best-robo-advisors` (8K SV, Betterment/Wealthfront via Impact)

Поставить `<meta name="robots" content="noindex, nofollow">` + "coming soon" placeholder, чтобы Google не пессимизировал текущие версии до запуска нормального контента.

**Фаза 2 (M5+) — REPURPOSE** трёх high-affiliate URL как отдельная вертикаль с новым template и data-моделью.

**Плюсы:** срочная чистка SEO-ямы + сохранённая опция монетизировать 38K SV/мес.
**Минусы:** двухфазный execution.

---

## 6. План фазы 1 (если Егор выбирает Вариант C)

**Чек-лист (~2-3 часа, отдельный спринт + Codex-review):**

1. **Edit `src/data/rankings.js`** — удалить 5-7 строк (Категория A + опционально B):
   - id `crypto-exchanges`, `crypto-wallets`, `forex-courses`, `forex-charts`, `stocks-robo` + опц. `crypto-staking`, `crypto-usdt`, `forex-signals`
2. **Edit `src/data/rankingFilters.js`** — удалить соответствующие фильтры
3. **Edit `src/data/rankingSeoContent.js`** — удалить SEO-content для удалённых slug
4. **Edit `public/_redirects`** (Cloudflare Pages) — добавить 5 × 301 redirects
5. **Для 3 high-affiliate URL** — добавить `<meta robots="noindex">` через `useSEO` hook + простой placeholder
6. **Edit `src/data/cryptoPillarContent.js`** — убрать ссылку на `/crypto-exchanges-vs-cfd-brokers` если эта страница тоже под удаление
7. **D1 cleanup:** удалить из `page_publish` таблицы (через `/api/admin/publish/...`)
8. **Sitemap:** перегенерится автоматически через `/api/sitemap.xml` (Cache 5min) — проверить
9. **Edit `THEMATIC-RANKINGS-TREE.md`, `FINAL-SITEMAP.md`, `RANKINGS-MAP.md`** — убрать удалённые URL из EXISTS, отметить как DELETED с reason
10. **Edit `MEMORY.md`, `memory/status.md`** — отразить изменение
11. **Verification:** `npm run brokers:build` + `npm run build` без ошибок, все ссылки в Header/Footer/internal linking не указывают на удалённые URL (`grep -rn "best-crypto-exchanges\|best-crypto-wallets\|..." src/`)
12. **Codex-review** перед merge в main
13. **Safepoint tag** перед merge: `git tag safepoint-non-broker-cleanup-2026-04-22-HHMM main && git push origin --tags`
14. **Push** → Cloudflare auto-deploy
15. **GSC:** через 1-2 недели submit removal requests для удалённых URL (опционально, ускоряет деиндексацию)

---

## 7. Что зафиксировать как процесс (anti-recurrence)

1. **Pre-commit валидация** в `scripts/validate-rankings.mjs`:
   - Каждый slug в `rankings.js` имеет фильтр в `rankingFilters.js`
   - Фильтр возвращает ≥5 брокеров на текущем пуле
   - Slug содержит `broker(s)` ИЛИ присутствует в whitelist (для legitimate `*-platforms`/`*-apps`)
2. **Чек-лист "Add new ranking URL"** в `CLAUDE.md`:
   - "Это про брокеров? Если нет — нужен отдельный data-source + template, иначе НЕ добавляй в `rankings.js`"
3. **Memory update** `memory/design_antipatterns.md` (или новый узел):
   - "Broker-rankings и non-broker entity rankings — разные сущности. Не смешивать в одном массиве."

---

## 8. Файлы для следующей сессии

| Файл | Что там |
|------|---------|
| **`NON-BROKER-URLS-AUDIT.md`** (этот файл) | Полный аудит, 3 варианта, план фазы 1 |
| `memory/status.md` § «АКТИВНОЕ (2026-04-22)» | Краткий статус |
| `memory/non-broker-urls-audit.md` | Узел графа знаний |
| `logs/2026-04.md` запись `2026-04-22 Аудит non-broker URL` | Детальный лог действий |
| `THEMATIC-RANKINGS-TREE.md:596,611-612` | Исходные предупреждения Билла |
| `MILESTONES.md:137-143` | Sprint 2.4 (где предупреждения потерялись) |
| `src/data/rankings.js:353-354,377-378,399` | Где сейчас живут проблемные URL |
| `src/data/rankingFilters.js:385-386,403-404` | Фильтры (показывают неподходящих брокеров) |
| Коммит `d04440b` (`git show d04440b -s`) | Виновник: M4 Sprint 1+2 |

---

## 9. Pending (ждём от Егора)

1. **Какой вариант?** A (delete всё) / B (repurpose всё) / **C (hybrid — рекомендован)**
2. **Если C:** запускать фазу 1 отдельным спринтом? (~2-3 ч + Codex-review)
3. **Стратегические вопросы для фазы 2 (M5+):**
   - Готов ли позиционировать сайт шире чем "Independent Broker Reviews" (`/about` upgrade под "Online Trading & Investing Reviews")?
   - Заводим affiliate-аккаунты в Binance Partner / Ledger / Impact (Betterment) сейчас или после готовности контента?
