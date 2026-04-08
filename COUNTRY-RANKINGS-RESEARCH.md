# Country Rankings для Non-Forex вертикалей — Research & Decision

> Дата: 2026-04-08
> Статус: RESEARCH COMPLETE — ожидает решения Егора
> Участники: Билл (SEO), Codex (архитектура), Панель экспертов (6 ролей)

---

## Вопрос

Нужно ли RatedBrokers добавлять страновые рейтинги (Type × Country) для non-forex вертикалей: **Stocks, Crypto, Options, Futures**?

---

## Текущее состояние

### Что есть сейчас

| Вертикаль | Страновых в rankings.js | Комбинаторных | Всего |
|-----------|:-:|:-:|:-:|
| **Forex** | 43 страны | 240 (16 типов × 15 стран) | 283 |
| **CFD** | 2 (UK, AU) | 15 (× 15 стран) | 17 |
| **Copy Trading** | 2 (UK, USA) | 8 (× 8 стран) | 10 |
| **Spread Betting** | 1 (UK) | 3 (UK, IE, AU) | 4 |
| **Crypto** | 5 (UK, USA, AU, CA, DE) | 0 | 5 |
| **Stocks** | 3 (USA, UK, Europe) | 0 | 3 |
| **Options** | 1 (USA) | 0 | 1 |
| **Futures** | 1 (USA) | 0 | 1 |

### Что делают конкуренты

| Конкурент | DA | Crypto × Country | Stocks × Country | Options/Futures × Country |
|-----------|:--:|:-:|:-:|:-:|
| **BrokerChooser** | 76 | 50-100 стран | 5-10 стран | 5-10 стран |
| **BestBrokers** | 55 | 16 стран | 0 | 0 |
| **ForexBrokers.com** | 73 | 0 | 0 | 0 |
| **StockBrokers.com** | — | 0 | 3 (US, UK, AU) | 0 |
| **DayTrading.com** | 70 | Минимально | Минимально | 0 |
| **RatedBrokers** | ~30 | 5 стран | 3 страны | 1 (USA) |

**Ключевой инсайт:** BrokerChooser — единственный кто масштабирует all combinations. Получил HCU penalty (-37% трафика) за thin content. Остальные конкуренты **не делают** полную комбинаторику для non-forex.

---

## Три мнения

### 1. Билл (SEO/Affiliate эксперт)

**Вердикт: ЧАСТИЧНО**

| Вертикаль | Решение | Страны | Обоснование |
|-----------|---------|--------|-------------|
| **Crypto** | ДА, +5 стран | Singapore, UAE, India, South Africa, New Zealand | Search volume 400-1,500/мес, CPA $200-800, пробел у конкурентов |
| **Stocks** | ДА, +3 страны | Australia, Canada, Germany | Volume 1,000-1,500/мес, но высокая конкуренция |
| **Options** | НЕТ | Только USA (уже есть) | Volume < 300/мес вне USA |
| **Futures** | НЕТ | Только USA (уже есть) | Volume < 400/мес вне USA |

**Anti-HCU правила Билла:**
1. Минимум 5 брокеров без fallback
2. >30% unique content на каждой странице
3. Уникальный #1 broker per country
4. Country-specific data (регулятор, валюта, налоги, payment methods)
5. Постепенный rollout (2 страницы/неделю)

### 2. Codex (Архитектурный ревью)

**Вердикт: NEEDS_CHANGES**

**Crypto — APPROVE:** Фильтрация через регулятор работает корректно (crypto-брокеры = forex-брокеры с международными лицензиями). Breadcrumbs корректны. Добавление в rankings.js — 3 строки на страницу.

**Stocks — CONDITIONAL APPROVE:** Три блокера:

| # | Блокер | Суть | Решение |
|---|--------|------|---------|
| 1 | **GEO_FILTERS ломаются** | Schwab/Robinhood (SEC/FINRA, tier1) пройдут фильтр UK через `hasTier1` | Ручные фильтры (Вариант A) с явным списком брокеров |
| 2 | **Fallback подмешивает мусор** | "Best Stock Brokers Singapore" → 3 реальных + IC Markets/Pepperstone из fallback | Вертикально-ограниченный fallback (pad только из stocks) |
| 3 | **Thin content** | Singapore = 3-4 stocks-брокера → ниже порога | Не создавать страницы с < 6 брокерами |

**Рекомендация по масштабированию:** сейчас — ручные записи в rankings.js. Комбинаторный движок — только при > 15 страниц (нужен рефакторинг slug-генератора).

### 3. Панель экспертов (6 ролей)

**Вердикт: ОСТОРОЖНОЕ РАСШИРЕНИЕ CRYPTO, STOCKS — СТОП**

#### Консенсус панели

| Вертикаль | Решение | Голосование |
|-----------|---------|-------------|
| **Crypto +3-5 стран** | ДА (после аудита фильтров) | 5 из 6 за |
| **Stocks-страновые** | НЕТ сейчас | 4 из 6 против (Business Owner + Content + Tech SEO + QA) |
| **Options/Futures** | Только USA | 6 из 6 (единогласно) |

#### Ключевые аргументы

**За crypto-расширение:**
- Расширение СУЩЕСТВУЮЩЕЙ вертикали (5 страниц уже есть) — не размывает topical authority
- Crypto-брокеры = forex-брокеры → GEO_FILTERS работают корректно
- Регуляторные различия (MAS vs VARA vs SEBI) дают natural unique content

**Против stocks-расширения:**
- Фильтрация сломана (Codex blocker) — Schwab/Robinhood пройдут UK/Germany
- Контент не уникален — DEGIRO в UK vs DEGIRO в Germany ≈ идентичный
- DA ~30 слишком низкий для конкуренции с NerdWallet/Investopedia на stocks
- Лучше инвестировать ресурсы в DA growth (linkbait) или углубление forex

#### Конфликты и резолюции

| Тема | Позиция A | Позиция B | Резолюция |
|------|-----------|-----------|-----------|
| Stocks-страновые | Билл: +3 страны (AU, CA, DE) | Панель: НЕТ (фильтры + DA + контент) | **Панель побеждает** (Safety > Cost) |
| Crypto: сколько стран | Билл: +5 (SG, UAE, IN, ZA, NZ) | Tech SEO: только >= 8 брокеров | **Зависит от аудита фильтров** |
| Timing | Business Owner: после DA 50 | SEO Architect: crypto сейчас | **Crypto сейчас, stocks позже** |
| Volume верификация | Researcher: обязательно Ahrefs | Business Owner: по интуиции | **Researcher побеждает** |

---

## Финальное решение

### Что делаем

| # | Действие | Фаза | Зависимости |
|---|----------|------|-------------|
| 1 | **Аудит crypto-фильтров** — посчитать брокеров для SG, UAE, IN, ZA, NZ без fallback | Сейчас | — |
| 2 | **Исправить fallback** — pad только из той же вертикали | Сейчас | — |
| 3 | **Crypto +3-5 стран** (только где >= 6 брокеров) | Ближайший спринт | #1, #2 |
| 4 | **Верификация volume** через Ahrefs/SEMrush | Перед #3 | Доступ к инструменту |
| 5 | **Stocks фильтрация** — ручные фильтры (Вариант A) | M6 | — |
| 6 | **Stocks +3-5 стран** (AU, CA, DE, SG, NZ) | M6+ | #5, DA > 40 |

### Что НЕ делаем

- Options × Country (кроме USA) — нулевой volume
- Futures × Country (кроме USA) — нулевой volume
- Массовая комбинаторика (BrokerChooser-style) — HCU risk
- Stocks-страновые до исправления фильтрации и роста DA

### Технический план (crypto)

Добавление одной crypto-страновой страницы = 3 файла:

```
1. src/data/rankings.js — запись { id, slug, title, category, sub, priority, icon, vertical }
2. src/data/rankingFilters.js — фильтр and(isCrypto, geoFilter)
3. src/data/rankingSeoContent.js — уникальный SEO-контент (intro, FAQ, description)
```

Также перед первой страницей:
- Исправить fallback в `getBrokersForRanking` (вертикально-ограниченный pad)
- Проверить breadcrumbs для новых страниц

### Anti-HCU Checklist

- [ ] >= 6 брокеров проходят фильтр БЕЗ fallback
- [ ] >= 500 слов unique content (местное регулирование, налоги, payment methods)
- [ ] Уникальный intro (3-4 абзаца) — не шаблон с подстановкой страны
- [ ] Country-specific FAQ (3-5 вопросов)
- [ ] Search volume >= 500/мес (верифицировано)
- [ ] Постепенный rollout (1-2 страницы/неделю)
- [ ] Индексация pilot-страницы подтверждена перед rollout

---

## Open Questions (для Егора)

1. **Ahrefs/SEMrush** — есть ли доступ для верификации volume?
2. **Приоритет ресурсов** — crypto-страновые vs улучшение существующих money pages vs linkbait для DA?
3. **Контент-бюджет** — сколько страниц в неделю реально при GPTZero-проверке?
4. **Pilot** — crypto-singapore как первый тест? Или другая страна?

---

## Appendix: Потенциальные crypto-страновые страницы

| Страна | Est. Volume | CPA | Crypto-регулятор | Уникальный контент |
|--------|:-:|:-:|---|---|
| Singapore | 1,000 | $600-800 | MAS Payment Services Act | Crypto licensing, SG payment methods |
| UAE | 800 | $500-700 | VARA (Dubai), ADGM | VARA framework, AED on-ramp |
| India | 1,500 | $200-400 | SEBI/RBI restrictions | 30% crypto tax, INR deposits |
| South Africa | 600 | $300-500 | FSCA (с Oct 2022) | FSCA crypto licensing, ZAR |
| New Zealand | 400 | $400-600 | FMA (не регулирует crypto) | NZD payment methods, tax |

## Appendix: Stocks-страновые (отложено до M6)

| Страна | Volume | Stocks-брокеры (реально доступны) | Блокеры |
|--------|:-:|---|---|
| Australia | 1,500 | DEGIRO(?), eToro, IG, Interactive Brokers, Saxo Bank | Нужна проверка DEGIRO |
| Canada | 1,200 | Interactive Brokers, Questrade(нет в базе), Wealthsimple(нет) | Мало брокеров в нашей базе |
| Germany | 1,000 | DEGIRO, Trade Republic, eToro, Trading 212, Interactive Brokers, Saxo Bank | Нужны ручные фильтры |
