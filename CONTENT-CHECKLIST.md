# CONTENT-CHECKLIST.md — Детальная спецификация контента тематических рейтингов

> Каждый текст, каждое поле, каждый символ — по стандарту. Ничего не забыть, ничего не пропустить.

---

## Оглавление

1. [Архитектура страницы рейтинга](#1-архитектура-страницы-рейтинга)
2. [Спецификация: SEO-контент страницы (bottom-of-page)](#2-спецификация-seo-контент-страницы)
3. [Спецификация: Тематический блок (Education)](#3-спецификация-тематический-блок-education)
4. [Спецификация: Карточка брокера (BrokerRankCard)](#4-спецификация-карточка-брокера)
5. [Спецификация: Quick Verdict (топ-3)](#5-спецификация-quick-verdict)
6. [Спецификация: Comparison Table](#6-спецификация-comparison-table)
7. [Спецификация: FAQ](#7-спецификация-faq)
8. [Верификация данных брокеров](#8-верификация-данных-брокеров)
9. [Чеклист на 1 рейтинг (полный)](#9-чеклист-на-1-рейтинг)
10. [Антипаттерны (чего НЕ делать)](#10-антипаттерны)

---

## 1. Архитектура страницы рейтинга

Каждая страница тематического рейтинга состоит из секций сверху вниз:

```
┌─────────────────────────────────────────────┐
│  1. Breadcrumb                              │
│  2. Hero (H1 + Author + Date)               │
│  3. SEO Intro (2-4 параграфа)               │
│  4. Key Finding (зелёный блок)              │
│  5. Trust Stats (брокеров / часов / дата)   │
│  6. Quick Verdict (топ-3 брокера)           │
│  7. Карточки брокеров (×N штук)             │
│  8. Education Section (тематический блок)   │
│  9. Comparison Table (таблица сравнения)    │
│ 10. How We Ranked (методология)             │
│ 11. Related Rankings (6 ссылок)             │
│ 12. FAQ (5-10 вопросов)                     │
│ 13. Methodology CTA                         │
│ 14. Author Bio                              │
│ 15. Affiliate Disclosure                    │
└─────────────────────────────────────────────┘
```

**Файлы данных:**
- `rankingThematic.js` — ручной контент (5 рейтингов, расширяем)
- `thematicGenerators.js` — автогенерация (202 рейтинга)
- `educationTemplates.js` — education-блоки (18 категорий)
- `rankings.js` — метаданные 207 рейтингов

---

## 2. Спецификация: SEO-контент страницы

### 2.1. H1 заголовок

| Параметр | Значение |
|----------|----------|
| Формат | `{ranking.title} {YEAR}` |
| Длина | 30–60 символов |
| Шрифт | Outfit, 900 weight, 26-42px responsive |
| Пример | "Best Forex Brokers for Scalping 2026" (42 символа) |

**Правила:**
- Включает основной keyword целиком
- Год в конце (YEAR = "2026")
- Без точки в конце
- Не дублирует H1 других страниц

---

### 2.2. SEO Intro (`seo.intro`)

| Параметр | Значение |
|----------|----------|
| Кол-во параграфов | 2–4 |
| Длина параграфа | 150–300 символов (каждый) |
| Общая длина | 400–900 символов |
| Переменные | `{year}`, `{topBroker}`, `{count}` |
| Шрифт | 14px, lineHeight 1.8, цвет #475569 |

**Структура параграфов:**
1. **Параграф 1** — Утверждение + авторитет: "In {year}, we tested {count} forex brokers for [тема]. After [метод тестирования], [topBroker] emerged as our top pick."
2. **Параграф 2** — Контекст темы: Почему [тема] важна для трейдеров. Какие критерии ключевые.
3. **Параграф 3** (опционально) — Методология: Как именно тестировали. Какие метрики измеряли.
4. **Параграф 4** (опционально) — Вывод: Краткий overview результатов.

**Пример:**
```
"In 2026, we tested 38 forex brokers specifically for scalping
performance. After executing 500+ trades per broker during peak
volatility hours, IC Markets emerged as our top pick with 0.02 pip
average EUR/USD spreads and 40ms execution."
(234 символа)
```

**Чеклист для каждого intro:**
- [ ] Содержит primary keyword в первом предложении
- [ ] Упоминает количество протестированных брокеров ({count})
- [ ] Называет топ-1 брокера ({topBroker})
- [ ] Описывает метод тестирования (real money, live accounts, etc.)
- [ ] Содержит конкретную метрику (число: спред, скорость, etc.)
- [ ] Не начинается с "Welcome to" или "This page is about"
- [ ] Уникальный текст — не совпадает с intro других рейтингов

---

### 2.3. Key Finding (`seo.keyFinding`)

| Параметр | Значение |
|----------|----------|
| Длина | 150–300 символов |
| Формат | 1 параграф, зелёный блок |
| Стиль | Фон #ecfdf5→#d1fae5, текст #065f46 |
| Переменные | `{year}`, `{topBroker}`, `{count}` |

**Формула:** "Our key finding: [конкретный вывод с числами]. [Почему это важно для трейдера]."

**Пример:**
```
"Key Finding: In our 2026 scalping test, IC Markets delivered
0.02 pip average EUR/USD spreads — 85% tighter than the industry
average of 0.13 pips. For a scalper trading 50 lots/day, this
saves approximately $550/month in spread costs alone."
(268 символов)
```

**Чеклист:**
- [ ] Содержит конкретное число или метрику
- [ ] Сравнение с индустрией или средним значением
- [ ] Практическая ценность для трейдера (деньги, время, безопасность)
- [ ] Не повторяет первый параграф intro дословно

---

### 2.4. How We Ranked (`seo.howWeRanked`)

| Параметр | Значение |
|----------|----------|
| Длина | 200–400 символов |
| Формат | 1 параграф |
| Шрифт | 14px, #475569 |
| Переменные | `{year}`, `{topBroker}`, `{count}` |

**Структура:** "We ranked these {count} brokers by [критерий 1], [критерий 2], [критерий 3], and [критерий 4]. Each broker was tested with [метод]. [Конкретика теста]."

**Пример:**
```
"We ranked these 38 brokers by raw spread tightness, execution
speed, requote frequency, and scalping policy permissiveness. Each
broker was tested with 500+ market orders during London/New York
overlap sessions (13:00–17:00 UTC) using live-funded accounts.
Brokers that block scalping or impose minimum hold times were
penalized or excluded."
(362 символа)
```

**Чеклист:**
- [ ] Перечислены 3-5 конкретных критериев ранжирования (не generic)
- [ ] Критерии релевантны теме рейтинга (не "regulation, costs, platforms" для всех)
- [ ] Описан метод тестирования
- [ ] Упомянуты условия исключения/штрафа

---

## 3. Спецификация: Тематический блок (Education)

### 3.1. Education Title

| Параметр | Значение |
|----------|----------|
| Длина | 30–70 символов |
| Формат | Вопрос или утверждение |
| Шрифт | Outfit, 800 weight, 28px |

**Формула:** "What Makes a Broker Good for [Тема]?" или "Understanding [Тема]: A Trader's Guide"

**Пример:** "What Makes a Broker Good for Scalping?" (40 символов)

---

### 3.2. Education Intro

| Параметр | Значение |
|----------|----------|
| Длина | 200–400 символов |
| Формат | 1 параграф |
| Шрифт | 15px, lineHeight 1.75 |

**Чеклист:**
- [ ] Объясняет тему для новичка (но не снисходительно)
- [ ] Связывает тему с выбором брокера
- [ ] Не повторяет SEO intro

---

### 3.3. Education Key Points

| Параметр | Значение |
|----------|----------|
| Кол-во | 4–6 пунктов |
| Формат | `{ bold: "заголовок", text: "описание" }` |
| Длина bold | 15–40 символов |
| Длина text | 80–200 символов |
| Иконка | Зелёная галочка (CircleCheck) |

**Правила:**
- Каждый пункт = 1 конкретный критерий
- Bold = что искать, Text = почему это важно + benchmark
- Содержит числовые ориентиры (спред < X, скорость < Y ms)

**Пример:**
```
bold: "Raw spreads under 0.5 pips"
text: "— every pip fraction impacts P&L when you're targeting
3-5 pip moves. The best scalping brokers offer 0.0-0.1 pip raw
spreads on EUR/USD during peak hours."
(bold: 27 символов, text: 163 символа)
```

---

### 3.4. Education Sections (развёрнутые блоки)

| Параметр | Значение |
|----------|----------|
| Кол-во секций | 3–5 |
| Heading длина | 25–70 символов |
| Кол-во параграфов | 2–4 на секцию |
| Длина параграфа | 150–400 символов |
| Points (опционально) | 3–5 пунктов (bold + text) |
| Pro Tip (опционально) | 100–200 символов, в 1 из секций |

**Типичная структура секций:**

| # | Тема секции | Пример heading |
|---|-------------|----------------|
| 1 | Как мы тестировали | "How We Tested Brokers for [Тема]" |
| 2 | Стратегии / подходы | "[Тема] Strategies That Work in {year}" |
| 3 | На что обращать внимание | "Key Factors When Choosing a [Тема] Broker" |
| 4 | Ошибки / риски | "Common [Тема] Mistakes to Avoid" |
| 5 | Регуляции (если релевантно) | "Regulatory Considerations for [Тема]" |

**Pro Tip формат:**
```
"Pro Tip: Before scalping live, test your strategy on a demo
account for at least 2 weeks during different market sessions.
Focus on the London/New York overlap for maximum liquidity."
(195 символов)
```

**Чеклист для education section:**
- [ ] 3–5 секций (не менее 3)
- [ ] Каждая секция имеет уникальный heading, не пересекающийся с другими рейтингами
- [ ] Минимум 1 секция про методологию тестирования
- [ ] Минимум 1 секция с практическими советами
- [ ] Минимум 1 Pro Tip в одной из секций
- [ ] Контент релевантен ИМЕННО этой теме (не generic "choose a regulated broker")
- [ ] Содержит конкретные числа, метрики, benchmarks
- [ ] Общий объём education: 1500–3000 символов

---

## 4. Спецификация: Карточка брокера (BrokerRankCard)

### 4.1. Статические данные (из B-объекта брокера)

Эти поля отображаются ВСЕГДА и берутся из файла брокера:

| Поле | Источник | Пример | Требует верификации |
|------|----------|--------|---------------------|
| Название | `B.name` | "IC Markets" | ✅ |
| Тип | `B.type` | "ECN / Raw Spread" | ✅ |
| Скор | `B.score` | 9.7 | ✅ |
| Бейдж | `B.badge` | "Editor's Choice 2026" | ✅ |
| Спред | `B.spread` | "0.0" | ✅ |
| Средний спред | `B.avgSpread` | "0.02" | ✅ |
| Min deposit | `B.minDep` | 200 | ✅ |
| Leverage | `B.leverage` | "1:500" | ✅ |
| Регуляторы | `B.regs[]` | [{name:"ASIC",...}] | ✅ |
| Платформы | `B.platforms[]` | ["MT4","MT5","cTrader"] | ✅ |
| Risk warning | `B.riskWarning` | "70.64% of retail..." | ✅ |
| Promo | `B.promo` | "0.0 pip raw spreads" | ✅ |

---

### 4.2. Тематический текст `why` (заголовок блёрба)

| Параметр | Значение |
|----------|----------|
| Формат | "Why {B.name} is #{rank} for [тема]:" |
| Длина | 30–65 символов |
| Цвет | #059669 (зелёный) |
| Шрифт | 14px, fontWeight 700 |

**Правила:**
- Начинается с "Why"
- Содержит имя брокера
- Содержит ранг или позицию
- Привязан к теме рейтинга
- Заканчивается двоеточием

**Примеры:**
```
"Why IC Markets is #1 for scalping:"                    (38 символов)
"Why Pepperstone ranks #2 for scalping:"                (40 символов)
"Why XM is our top pick for beginners:"                 (39 символов)
"Why Exness leads for zero-spread trading:"             (42 символа)
```

---

### 4.3. Тематический текст `text` (основной блёрб)

| Параметр | Значение |
|----------|----------|
| Длина | **200–400 символов** |
| Минимум | 200 символов |
| Максимум | 400 символов |
| Формат | 1 абзац, без переносов строк |
| Шрифт | 14px, lineHeight 1.7, цвет #334155 |

**Структура:** [Конкретный факт о брокере в контексте темы] + [Метрика] + [Сравнение с конкурентами или средним] + [Вывод для трейдера].

**Пример для scalping-рейтинга:**
```
"Tightest raw spreads in our 30-day test — 0.02 pip average on
EUR/USD during peak hours. True ECN execution via 50+ tier-1
liquidity providers with 40ms average fill speed and less than
0.1% requote rate. cTrader platform offers Level II market depth
for order flow visibility — a must for serious scalpers."
(318 символов)
```

**Пример для beginners-рейтинга (тот же IC Markets):**
```
"IC Markets combines institutional-grade execution with a
surprisingly beginner-friendly setup. Free demo account with
$100K virtual funds, 22 video tutorials on forex basics, and
responsive 24/7 live chat support. The $200 minimum deposit is
higher than some competitors, but the low-cost structure means
beginners save money from day one."
(339 символов)
```

**Чеклист для каждого `text`:**
- [ ] 200–400 символов
- [ ] Привязан к теме рейтинга (не generic)
- [ ] Содержит минимум 2 конкретных числа/метрики
- [ ] Упоминает конкретный продукт/фичу брокера
- [ ] НЕ совпадает с текстом этого же брокера на другом рейтинге
- [ ] Читается как мини-обзор, а не как рекламный слоган

---

### 4.4. Pros pills (`thematic.pros[]`)

| Параметр | Значение |
|----------|----------|
| Кол-во | **3–4 штуки** |
| Длина каждого | **15–40 символов** |
| Стиль | Зелёная пилюля, иконка ✓ |
| Шрифт | 11-12px |

**Правила:**
- Начинаются с конкретики (числа, названия)
- Привязаны к теме рейтинга
- Не generic ("Good regulation" — плохо, "FCA + ASIC dual tier-1" — хорошо)
- Не повторяют pros этого же брокера на другом рейтинге

**Примеры для IC Markets:**

| Рейтинг | Pros |
|---------|------|
| Scalping | "0.02 pip avg EUR/USD", "40ms execution", "cTrader Level II DOM", "No scalping limits" |
| Beginners | "$100K demo account", "22 video tutorials", "24/7 live chat", "Low spreads from day 1" |
| ECN | "50+ liquidity providers", "True ECN model", "No dealing desk", "Raw spread from 0.0" |

---

### 4.5. Cons pills (`thematic.cons[]`)

| Параметр | Значение |
|----------|----------|
| Кол-во | **2–3 штуки** |
| Длина каждого | **15–40 символов** |
| Стиль | Красная пилюля, иконка ✗ |

**Правила:**
- Честные недостатки (не фейковые)
- Привязаны к теме, если возможно
- Не разрушительные (не "broker is a scam")
- Каждый con имеет контекст (не просто "High deposit", а "$200 min deposit")

**Примеры:**
```
Scalping: ["No FCA regulation", "$200 min deposit"]
Beginners: ["$200 min deposit — higher than XM's $5", "No cent accounts"]
ECN:       ["FSA Seychelles entity weaker", "Commission on raw account"]
```

---

### 4.6. Expandable Analysis (`thematic.analysis`)

| Параметр | Значение |
|----------|----------|
| Длина | **800–1500 символов** |
| Минимум | 800 символов |
| Максимум | 1500 символов |
| Формат | 3–5 параграфов, разделённых `\n\n` |
| Шрифт | 14px, lineHeight 1.75, цвет #334155 |
| Видимость | Скрыт по умолчанию, кнопка "Read our full analysis" |

**Структура параграфов:**

| # | Тема параграфа | Длина | Содержание |
|---|---------------|-------|------------|
| 1 | Главная сила | 150–300 симв. | Почему этот брокер хорош для данной темы. Конкретные тестовые данные. |
| 2 | Технические детали | 150–300 симв. | Модель исполнения, ликвидность, инфраструктура. |
| 3 | Платформы / инструменты | 150–300 симв. | Какие платформы особенно хороши для этой темы. |
| 4 | Компромиссы | 150–300 симв. | Минусы и для кого брокер НЕ подходит. |
| 5 | Вердикт (опционально) | 100–200 симв. | Итоговая рекомендация. |

**Пример (scalping, IC Markets):**
```
"IC Markets consistently delivered the tightest raw spreads across
our 30-day scalping test. During the London/New York overlap
session (13:00–17:00 UTC) — the most critical window for scalpers
— EUR/USD spreads measured 0.02 pips on the Raw Spread account.
This is the lowest we have recorded among 38 brokers tested.

The broker routes all orders through a pool of 50+ tier-1 liquidity
providers including JPMorgan, Goldman Sachs, and Deutsche Bank.
Average execution speed measured 40ms with a requote rate below
0.1%. No order size restrictions or minimum holding period policies
— IC Markets explicitly welcomes scalpers.

For platform, cTrader stands out with Level II market depth, one-
click trading, and detachable charts. MT4 is also available with
full EA support for automated scalping strategies.

The main trade-off is regulation: ASIC and CySEC are tier-1, but
high-leverage accounts run through the FSA Seychelles entity with
weaker investor protection. The $200 minimum deposit is also above
Pepperstone's $0 entry point."
(1048 символов, 4 параграфа)
```

**Чеклист для каждого analysis:**
- [ ] 800–1500 символов
- [ ] 3–5 параграфов
- [ ] Каждый параграф — отдельный аспект (не повторяет предыдущий)
- [ ] Содержит минимум 5 конкретных метрик/чисел
- [ ] Упоминает конкретные платформы, регуляторы, LPs (если известно)
- [ ] Честно описывает минусы (минимум 1 параграф)
- [ ] Привязан к теме рейтинга (не generic broker overview)
- [ ] НЕ совпадает с analysis этого же брокера на другом рейтинге
- [ ] Разделён двойными переносами `\n\n`

---

### 4.7. Pros Detail (`thematic.prosDetail[]`)

| Параметр | Значение |
|----------|----------|
| Кол-во | **3–5 пунктов** |
| Длина каждого | **60–150 символов** |
| Видимость | Внутри expanded analysis |
| Формат | Буллет-лист с точкой |

**Формула:** "[Конкретный факт] — [пояснение или сравнение]"

**Пример:**
```
"0.02 pip EUR/USD average — tightest tested across 38 brokers"
(62 символа)

"40ms average execution with <0.1% requote rate — no rejections in our 500-trade test"
(86 символов)

"cTrader Level II DOM for order-flow visibility — essential for reading liquidity"
(82 символа)
```

---

### 4.8. Cons Detail (`thematic.consDetail[]`)

| Параметр | Значение |
|----------|----------|
| Кол-во | **2–4 пункта** |
| Длина каждого | **60–150 символов** |
| Видимость | Внутри expanded analysis |

**Формула:** "[Недостаток] — [контекст или workaround]"

**Пример:**
```
"No FCA (UK) regulation — Australian ASIC and Cyprus CySEC are tier-1, but UK clients route through offshore"
(108 символов)

"$200 minimum deposit — Pepperstone and FP Markets start from $0"
(65 символов)
```

---

## 5. Спецификация: Quick Verdict (топ-3)

### Структура объекта

```javascript
quickVerdict: [
  { label: "...", icon: "...", slug: "...", metric: "..." },
  { label: "...", icon: "...", slug: "...", metric: "..." },
  { label: "...", icon: "...", slug: "...", metric: "..." },
]
```

### Поля

| Поле | Длина | Формат | Пример |
|------|-------|--------|--------|
| `label` | 15–30 символов | Категория победы | "Best Overall", "Lowest Cost", "Best for Beginners" |
| `icon` | 1 символ | Emoji | 🏆, ⚡, 💰, 🎓, 🛡️ |
| `slug` | — | Slug брокера | "ic-markets" |
| `metric` | 20–50 символов | Конкретная метрика | "0.02 pip avg EUR/USD", "$0 min deposit" |

**Правила для label:**
- label #1 = "Best Overall" или "Top Pick" (общий победитель)
- label #2 = вторая по важности сила для темы
- label #3 = третья по важности сила или "Best Value"
- Каждый label уникален в пределах одного рейтинга

**Правила для metric:**
- Содержит конкретное число
- Релевантна именно label'у (не "Best for Beginners" → "0.02 pip spread")
- Формат: "[число] [единица] [контекст]"

**Стандартные emoji для тем:**
| Тема | Icon #1 | Icon #2 | Icon #3 |
|------|---------|---------|---------|
| Overall | 🏆 | ⭐ | 💎 |
| Scalping | 🏆 | ⚡ | 💰 |
| Beginners | 🏆 | 🎓 | 💰 |
| ECN | 🏆 | ⚡ | 🔧 |
| Low spread | 🏆 | 📉 | 💰 |
| Crypto | 🏆 | 🪙 | 🛡️ |
| Safety | 🏆 | 🛡️ | 🔒 |

---

## 6. Спецификация: Comparison Table

### Колонки

| Параметр | Значение |
|----------|----------|
| Кол-во колонок | 4 кастомных + Broker + Score = **6 всего** |
| Длина заголовка | 10–25 символов |
| Длина ячейки | 5–30 символов |

**Правило:** Колонки должны быть релевантны теме рейтинга.

| Тема рейтинга | Колонка 1 | Колонка 2 | Колонка 3 | Колонка 4 |
|---------------|-----------|-----------|-----------|-----------|
| Scalping | Avg Spread | Commission | Execution | Min Dep |
| Beginners | Min Dep | Education | Demo | Support |
| ECN | Spread Model | LPs | Commission | Execution |
| Low Spread | EUR/USD | GBP/USD | USD/JPY | Commission |
| High Leverage | Max Leverage | Margin Call | Stop Out | Regulation |
| MT4 | MT4 Version | EAs | Indicators | VPS |
| Crypto | Crypto Pairs | Spread BTC | Leverage | Wallet |
| Islamic | Swap-Free | Duration | Instruments | Min Dep |
| Country [X] | Local Reg | Local Pay | Language | Min Dep |

### Данные ячеек (`comparisonData`)

**Формат ячейки:** Конкретное значение, не пустая строка.

| Тип данных | Формат | Пример |
|-----------|--------|--------|
| Спред | "X.XX pips" | "0.02 pips" |
| Комиссия | "$X/lot RT" или "None" | "$7/lot RT" |
| Скорость | "XXms" | "40ms" |
| Депозит | "$X" или "$0" | "$200" |
| Плечо | "1:XXX" | "1:500" |
| Да/Нет | "Yes" / "No" / "Limited" | "Yes" |
| Количество | "X+" | "2,250+" |
| Рейтинг | "X.X/5" | "4.8/5" |

**Чеклист для comparison table:**
- [ ] 4 кастомных колонки, привязанных к теме
- [ ] Данные заполнены для ВСЕХ брокеров в рейтинге (нет пустых ячеек)
- [ ] Все значения верифицированы (совпадают с сайтом брокера)
- [ ] Единообразный формат (все спреды в "X.XX pips", все депозиты в "$X")

---

## 7. Спецификация: FAQ

### Education FAQ (внутри тематического блока)

| Параметр | Значение |
|----------|----------|
| Кол-во | **6–10 вопросов** |
| Длина вопроса (q) | 30–80 символов |
| Длина ответа (a) | 150–500 символов |
| Формат | Accordion (раскрывающийся) |
| Schema | FAQPage JSON-LD |

### SEO FAQ (внизу страницы, `seo.faq`)

| Параметр | Значение |
|----------|----------|
| Кол-во | **5–8 вопросов** |
| Длина вопроса | 30–80 символов |
| Длина ответа | 150–500 символов |
| Переменные | `{year}`, `{topBroker}`, `{count}` |

**Правило:** Education FAQ и SEO FAQ НЕ дублируются. Если есть education FAQ, seo.faq не рендерится.

**Типы вопросов (обязательные для каждого рейтинга):**

| # | Тип | Пример |
|---|-----|--------|
| 1 | "What is the best..." | "What is the best forex broker for scalping in 2026?" |
| 2 | "How to choose..." | "How to choose the best broker for scalping?" |
| 3 | "Is [тема] safe/legal..." | "Is scalping allowed by all forex brokers?" |
| 4 | "What features..." | "What features should a scalping broker have?" |
| 5 | "Which broker has..." | "Which forex broker has the lowest spreads for scalping?" |
| 6 | "[Тема]-specific" | "What is the ideal execution speed for scalping?" |

**Чеклист для FAQ:**
- [ ] 6–10 вопросов
- [ ] Каждый вопрос — полное предложение с "?"
- [ ] Каждый ответ — полный, самодостаточный параграф (не отсылка к другому FAQ)
- [ ] Минимум 1 вопрос содержит год ({year})
- [ ] Минимум 1 вопрос упоминает конкретного брокера ({topBroker})
- [ ] НЕ дублируют FAQ других рейтингов (проверить на пересечение)
- [ ] Таргетируют long-tail keywords
- [ ] Ответы содержат конкретику (числа, имена, факты), а не "it depends"

---

## 8. Верификация данных брокеров

### Чеклист верификации для каждого брокера

Проверить на ОФИЦИАЛЬНОМ сайте брокера, что следующие данные корректны:

| # | Поле | Где проверить | Критичность |
|---|------|--------------|-------------|
| 1 | `B.name` | Сайт брокера | 🔴 критично |
| 2 | `B.type` (ECN/STP/MM) | О компании | 🔴 критично |
| 3 | `B.score` | Наша формула | 🟡 важно |
| 4 | `B.spread` (min) | Спецификации счёта | 🔴 критично |
| 5 | `B.avgSpread` | Наш тест / статистика | 🔴 критично |
| 6 | `B.commission` | Спецификации счёта | 🔴 критично |
| 7 | `B.minDep` | Открытие счёта | 🔴 критично |
| 8 | `B.leverage` (max) | Спецификации | 🟡 важно |
| 9 | `B.regs[]` (все) | Footer / Legal | 🔴 критично |
| 10 | `B.regs[].num` | Реестр регулятора | 🔴 критично |
| 11 | `B.platforms[]` | Платформы | 🟡 важно |
| 12 | `B.instruments` | Спецификации | 🟡 важно |
| 13 | `B.riskWarning` | Footer сайта | 🔴 критично |
| 14 | `B.year` (основание) | О компании | 🟢 желательно |
| 15 | `B.hq` | О компании | 🟢 желательно |
| 16 | `B.tp` (Trustpilot score) | Trustpilot.com | 🟡 важно |
| 17 | `B.tpCount` (отзывы) | Trustpilot.com | 🟡 важно |
| 18 | `B.promo` | Акции на сайте | 🟡 важно |

**Форматы верификации:**

| Поле | Допустимый формат |
|------|-------------------|
| spread | "0.0", "0.1", "1.0" (число с точкой) |
| avgSpread | "0.02", "0.10", "1.20" (число с точкой, 2 знака) |
| commission | "$X.XX/lot" или "None" или "$X/lot RT" |
| minDep | Число (0, 1, 5, 10, 50, 100, 200, 250, 500) |
| leverage | "1:30", "1:100", "1:500", "1:1000", "1:Unlimited" |
| regs[].tier | 1, 2, или 3 |
| tp | Число X.X (1 знак после точки) |
| tpCount | Число (без форматирования) |

---

## 9. Чеклист на 1 рейтинг (полный)

Копируй этот чеклист для каждого рейтинга и отмечай выполненное.

### Рейтинг: `[slug]` — [название]

#### CP4. Верификация данных
- [ ] Проверены все B-данные каждого брокера в рейтинге (таблица из п.8)
- [ ] Спреды актуальны (проверены на сайтах брокеров за последний месяц)
- [ ] Регуляторы актуальны (номера лицензий верны)
- [ ] Min deposit актуален
- [ ] Leverage актуален (учтены ограничения по юрисдикциям)
- [ ] Risk warning актуален (скопирован с сайта брокера)
- [ ] Trustpilot score и count актуальны

#### CP3. Тексты карточек брокеров
Для КАЖДОГО брокера в рейтинге:

- [ ] `why` — 30–65 символов, привязан к теме, содержит имя брокера
- [ ] `text` — 200–400 символов, уникальный, содержит 2+ метрики
- [ ] `pros[]` — 3–4 штуки, 15–40 символов каждый, тематические
- [ ] `cons[]` — 2–3 штуки, 15–40 символов каждый, честные
- [ ] `analysis` — 800–1500 символов, 3–5 параграфов, тематический
- [ ] `prosDetail[]` — 3–5 штук, 60–150 символов каждый
- [ ] `consDetail[]` — 2–4 штуки, 60–150 символов каждый
- [ ] Все тексты уникальны (не совпадают с этим же брокером на других рейтингах)
- [ ] Все тексты привязаны к теме (не generic)

#### CP1. SEO-текст страницы
- [ ] `seo.intro` — 2–4 параграфа, 400–900 символов, primary keyword в 1-м предложении
- [ ] `seo.keyFinding` — 150–300 символов, конкретная метрика + сравнение
- [ ] `seo.howWeRanked` — 200–400 символов, 3–5 критериев + метод
- [ ] `seo.faq` — 5–8 вопросов, 30–80 символов вопрос, 150–500 символов ответ
- [ ] Все переменные работают (`{year}`, `{topBroker}`, `{count}`)
- [ ] Title tag уникален (не совпадает с другими рейтингами)

#### CP2. Тематический блок (Education)
- [ ] `education.title` — 30–70 символов, вопрос или утверждение
- [ ] `education.intro` — 200–400 символов, связывает тему с выбором брокера
- [ ] `education.points[]` — 4–6 пунктов, bold 15–40 симв. + text 80–200 симв.
- [ ] `education.sections[]` — 3–5 секций:
  - [ ] Каждая секция: heading 25–70 симв., 2–4 параграфа по 150–400 симв.
  - [ ] Минимум 1 секция с points (буллеты)
  - [ ] Минимум 1 Pro Tip (100–200 символов)
- [ ] `education.faq[]` — 6–10 вопросов, уникальные
- [ ] Общий объём education: 1500–3000 символов

#### Quick Verdict
- [ ] 3 брокера с уникальными label, icon, metric
- [ ] Metric содержит конкретное число
- [ ] Slug'и корректны (брокеры существуют)

#### Comparison Table
- [ ] 4 кастомных колонки, релевантных теме
- [ ] Данные заполнены для всех брокеров
- [ ] Все значения верифицированы
- [ ] Единообразный формат

#### Финальная проверка
- [ ] Страница рендерится без ошибок (`npm run dev`)
- [ ] Все ссылки работают (review, compare, guide)
- [ ] JSON-LD schema корректна (Article + FAQPage + BreadcrumbList)
- [ ] Мобильная версия адекватна (карточки, таблица, FAQ)
- [ ] Ни один текст не дублируется с другими рейтингами

---

## 10. Антипаттерны (чего НЕ делать)

### Тексты

| ❌ Плохо | ✅ Хорошо | Почему |
|----------|----------|--------|
| "IC Markets is a great broker" | "IC Markets delivered 0.02 pip avg EUR/USD in our 30-day test" | Конкретика вместо оценочности |
| "This broker has low spreads" | "Raw spreads from 0.0 pips, average 0.02 on EUR/USD" | Числа вместо прилагательных |
| "Good for beginners" | "Free demo with $100K virtual funds + 22 video tutorials" | Факты вместо мнений |
| "Well-regulated broker" | "FCA (UK) + ASIC (Australia) dual tier-1 regulation" | Названия вместо обобщений |
| Copy-paste с другого рейтинга | Уникальный текст под тему | Google наказывает за дубликаты |
| "Click here to visit broker" | "Open IC Markets Account →" | CTA с именем брокера |

### Данные

| ❌ Плохо | ✅ Хорошо |
|----------|----------|
| Spread: "Low" | Spread: "0.02 pips" |
| Leverage: "High" | Leverage: "1:500" |
| Deposit: "Small" | Deposit: "$200" |
| Regulation: "Yes" | Regulation: "FCA #927809, ASIC #335692" |
| Founded: "Long ago" | Founded: "2007" |

### Структура

| ❌ Плохо | ✅ Хорошо |
|----------|----------|
| 10 pros, 0 cons | 3-4 pros, 2-3 cons |
| Analysis 200 символов | Analysis 800-1500 символов |
| FAQ: "What is forex?" (generic) | FAQ: "What execution speed is needed for scalping?" (тематический) |
| Same pros on all rankings | Unique pros per ranking theme |
| Empty comparison cells | All cells filled with verified data |

---

## Сводная таблица символов

| Элемент | Мин | Макс | Цель | Кол-во на рейтинг |
|---------|-----|------|------|-------------------|
| H1 title | 30 | 60 | 40-50 | 1 |
| SEO intro (всего) | 400 | 900 | 600 | 1 (2-4 параграфа) |
| Key Finding | 150 | 300 | 250 | 1 |
| How We Ranked | 200 | 400 | 300 | 1 |
| **Карточка `why`** | **30** | **65** | **40** | **×N брокеров** |
| **Карточка `text`** | **200** | **400** | **300** | **×N брокеров** |
| **Карточка pros (каждый)** | **15** | **40** | **25** | **3-4 × N** |
| **Карточка cons (каждый)** | **15** | **40** | **25** | **2-3 × N** |
| **Карточка analysis** | **800** | **1500** | **1000** | **×N брокеров** |
| **Карточка prosDetail (каждый)** | **60** | **150** | **100** | **3-5 × N** |
| **Карточка consDetail (каждый)** | **60** | **150** | **100** | **2-4 × N** |
| Education title | 30 | 70 | 50 | 1 |
| Education intro | 200 | 400 | 300 | 1 |
| Education point bold | 15 | 40 | 25 | 4-6 |
| Education point text | 80 | 200 | 140 | 4-6 |
| Education section heading | 25 | 70 | 45 | 3-5 |
| Education section paragraph | 150 | 400 | 250 | 2-4 × секция |
| Pro Tip | 100 | 200 | 150 | 1 |
| FAQ вопрос | 30 | 80 | 50 | 6-10 |
| FAQ ответ | 150 | 500 | 300 | 6-10 |
| Quick Verdict label | 15 | 30 | 20 | 3 |
| Quick Verdict metric | 20 | 50 | 35 | 3 |
| Comparison column header | 10 | 25 | 15 | 4 |
| Comparison cell | 5 | 30 | 15 | 4 × N |

### Объём текста на 1 рейтинг (приблизительно)

При 10 брокерах в рейтинге:
- SEO-контент страницы: ~1,500 символов
- Карточки брокеров: ~15,000 символов (10 × ~1,500)
- Education section: ~3,000 символов
- FAQ: ~3,000 символов
- Quick Verdict + Comparison: ~1,000 символов
- **Итого на 1 рейтинг: ~23,500 символов (~4,000 слов)**

При 207 рейтингах (среднее 10 брокеров):
- **Итого: ~4,864,500 символов (~810,000 слов)**

---

*Последнее обновление: 3 марта 2026*
