# MILESTONES.md — Дорожная карта RatedBrokers

> Путь от кода до денег. Каждый майлстоун приближает к первому органическому трафику и первой аффилиатной конверсии.

---

## M1. Фундамент сайта ✅

**Статус: ЗАВЕРШЁН (2 марта 2026)**

- [x] React 19 + Vite + react-router-dom v7
- [x] 36 брокеров с полными данными
- [x] 43 страновых страницы с локальными регуляциями
- [x] Система скоринга: 0–10, 6 критериев, публичная формула
- [x] Methodology, About, How We Make Money — trust-страницы
- [x] Header с мега-меню, Footer, SearchOverlay (⌘K)
- [x] 26 экспертных авторов с LinkedIn и credentials
- [x] JSON-LD schema на каждой странице

---

## M2. SEO Powerhouse — программатические рейтинги ✅

**Статус: ЗАВЕРШЁН (3 марта 2026)**

- [x] 207 тематических рейтингов через единый RankingPage.jsx
- [x] BrokerRankCard: dual CTA, expandable analysis, pros/cons
- [x] Шаблонный генератор для всех 207 рейтингов
- [x] 25 гайдов, 4 платформы, 10+ регуляторов
- [x] TrustScorePage, AllGuidesPage, ContactPage

---

## M2.5. Инфраструктурные фиксы ✅

**Статус: ЗАВЕРШЁН (11–12 марта 2026)**

- [x] Methodology v2 — честная формула 30/20/15/15/15/5
- [x] i18n удалён — English-only, API сохранён
- [x] Cloudflare Workers бэкенд — click tracking + contact form
- [x] Шаблон рейтинга: CTA-фикс, mobile UX, sticky bar, ItemList JSON-LD
- [x] GitHub Pages фикс: BASE_URL для изображений, VITE_API_URL в CI
- [x] Удалены 37 брокеров — перезапуск контента с нуля

---

## M3. Подготовка: роли и страницы авторов ✅

**Статус: ЗАВЕРШЁН (12 марта 2026)**

- [x] AuthorPage — bio, credentials, LinkedIn, статьи автора, JSON-LD Person
- [x] AuthorCredits — "Written By / Reviewed By / Fact Checked By"
- [x] Перелинковка: AuthorCredits → AuthorPage → статьи автора
- [x] Home → секция "Our Expert Team"

---

## M3.5. Бэкенд и админ-панель ✅

**Статус: ЗАВЕРШЁН (31 марта 2026)**

- [x] Cloudflare Workers API + D1 на api.ratedbrokers.com
- [x] Click Dashboard, Affiliate Links, Ranking Manager, Publication Planner
- [x] 21 CTA починены → `/go/{slug}`
- [x] Ranking overrides: manual positions, featured labels, Pin Top 5
- [x] Publication Planner: 831 стр, 16-week auto-schedule, dynamic sitemap

---

## M4. Online Brokers Umbrella 🌐

**Статус: Phase 1 ЗАВЕРШЕНА (31 марта 2026)**

**Цель:** Расширение сайта от "Forex Brokers" к зонтичной концепции "Online Brokers". 9 категорий брокеров, хаб-страницы, новая homepage, +53 рейтинга из текущих 38 брокеров.

**Исследование:** `THEMATIC-RANKINGS-TREE.md`, `memory/homepage-concept-research.md`

**URL-подход:** Hybrid (Option C) — хаб-страницы + flat ranking URLs, 0 редиректов.

### Категории (вертикали)

| # | Категория | Рейтингов | Статус |
|---|-----------|-----------|--------|
| 1 | Forex Brokers | ~205 | ✅ Ядро (190 есть) |
| 2 | CFD Brokers | ~25 | Phase 1 (+7 новых) |
| 3 | Copy Trading | ~12 | Phase 1 (+8 новых) |
| 4 | Spread Betting | ~9 | Phase 1 (+8 новых) |
| 5 | Crypto Brokers | ~26 | Phase 1 (+14 новых) |
| 6 | Stock Brokers | ~18 | Phase 2 (нужны новые брокеры) |
| 7 | Options Brokers | ~9 | Phase 2 |
| 8 | Futures Brokers | ~9 | Phase 2 |
| 9 | Prop Firms | ~17 | Phase 3 (новая вертикаль) |

---

### Phase 1: Расширение с текущими 38 брокерами (15 спринтов)

#### Sprint 1: Категории брокеров в данных `[S, 1 день]`

Каждый из 38 брокеров получает поле `verticals[]` — массив вертикалей, в которых он участвует.

- [ ] **1.1** Составить маппинг: какие брокеры в какие вертикали входят
  - `forex` — все 38
  - `cfd` — все 38 (все наши брокеры предоставляют CFD)
  - `copy-trading` — ~18 (eToro, Pepperstone, IC Markets, Exness, AvaTrade, BlackBull, RoboForex, FXTM, OctaFX, FP Markets, Fusion, Eightcap, Vantage, HF Markets, Axi, Capital.com, XM, Tickmill)
  - `spread-betting` — ~13 (IG, Spreadex, CMC, City Index, Pepperstone, Capital.com, eToro, AvaTrade, FP Markets, Saxo, FxPro, Plus500, OANDA)
  - `crypto` — ~30 (все кроме чисто-forex брокеров без крипто)
- [ ] **1.2** Добавить `verticals:` в YAML frontmatter каждого из 38 файлов `content/brokers/*.md`
- [ ] **1.3** Обновить `scripts/build-brokers.mjs` — парсить `verticals` из frontmatter, пробросить в JS-объект
- [ ] **1.4** Добавить специфичные поля для новых вертикалей в YAML (где данные уже известны):
  - `cfd_instruments_count` — кол-во CFD инструментов
  - `copy_trading_platform` — название платформы (CopyTrader, ZuluTrade, etc.)
  - `spread_betting` — `true/false`
- [ ] **1.5** `npm run brokers:build` — проверить что всё парсится без ошибок
- [ ] **1.6** Проверить в коде: `B.verticals.includes('cfd')` работает для фильтрации

**Файлы:** `content/brokers/*.md` (38 файлов), `scripts/build-brokers.mjs`

#### Sprint 2: Новые рейтинги — определения `[S, 1 день]`

53 новых рейтинга добавляются в единый файл rankings.js с новыми category-группами.

- [ ] **2.1** Добавить секцию **CFD** (7 рейтингов):
  - `best-cfd-brokers-for-beginners`, `best-cfd-brokers-for-professionals`
  - `lowest-spread-cfd-brokers`, `best-low-cost-cfd-brokers`
  - `best-cfd-brokers-uk`, `best-cfd-brokers-australia`, `best-cfd-brokers-charting`
- [ ] **2.2** Добавить секцию **Copy Trading** (8 рейтингов):
  - `best-copy-trading-for-beginners`, `best-copy-trading-apps`
  - `best-forex-copy-trading-platforms`, `best-stock-copy-trading-platforms`
  - `best-free-copy-trading-platforms`, `best-myfxbook-autotrade-brokers`
  - `best-copy-trading-uk`, `best-copy-trading-usa`
- [ ] **2.3** Добавить секцию **Spread Betting** (8 рейтингов):
  - `best-spread-betting-for-beginners`, `best-spread-betting-apps`
  - `best-spread-betting-day-trading`, `best-spread-betting-scalping`
  - `best-forex-spread-betting`, `best-shares-spread-betting`
  - `best-index-spread-betting`, `best-spread-betting-uk`
- [ ] **2.4** Добавить секцию **Crypto расширение** (14 рейтингов):
  - `best-crypto-brokers-for-beginners`, `best-regulated-crypto-brokers`
  - `best-cardano-brokers`, `best-usdt-trading-platforms`, `best-bitcoin-etf-brokers`
  - `best-crypto-margin-trading`, `best-crypto-demo-accounts`
  - `best-crypto-brokers-uk`, `best-crypto-brokers-usa`, `best-crypto-brokers-australia`
  - `best-crypto-brokers-canada`, `best-crypto-brokers-germany`
  - `best-crypto-exchanges`, `best-crypto-wallets`
- [ ] **2.5** Добавить секцию **Forex gaps** (16 рейтингов):
  - Страны: `best-forex-brokers-portugal`, `-denmark`, `-norway`, `-finland`, `-greece`
  - Регуляторы: `fsa-regulated-forex-brokers`, `ifsc-regulated-forex-brokers`, `vfsc-regulated-forex-brokers`
  - Платформы: `best-forex-brokers-mac`
  - Пары: `best-usdcny-brokers`
  - Leverage: `1-50-leverage-forex-brokers`, `1-300-leverage-forex-brokers`
  - Education: `best-forex-trading-courses`, `best-forex-chart-websites`
  - Payment: `forex-brokers-accepting-amex`, `forex-brokers-accepting-trustly`
- [ ] **2.6** Для каждого рейтинга задать: `id`, `slug`, `name`, `category`, `sub`, `vertical`
- [ ] **2.7** Проверить: нет конфликтов slug-ов с существующими 201 + 240

**Файлы:** `src/data/rankings.js`
**Зависимости:** нет (параллельно со Sprint 1)

#### Sprint 3: Фильтры рейтингов по вертикали `[S, 1 день]`

Каждый новый рейтинг получает функцию-фильтр, определяющую какие брокеры в него попадают.

- [ ] **3.1** CFD-фильтры (7 функций):
  - `best-cfd-brokers-for-beginners`: `B.verticals.includes('cfd') && B.score.overall >= 8.0`
  - `lowest-spread-cfd-brokers`: сортировка по `B.spreads.eurusd` + `B.verticals.includes('cfd')`
  - `best-cfd-brokers-uk`: FCA-лицензия + CFD vertical
  - и т.д. — каждый фильтр уникален
- [ ] **3.2** Copy Trading фильтры (8 функций):
  - Основа: `B.verticals.includes('copy-trading')` — только 18 брокеров с copy-функцией
  - `best-copy-trading-for-beginners`: + low min deposit + good education
  - `best-copy-trading-apps`: + mobile app rating > 4.0
- [ ] **3.3** Spread Betting фильтры (8 функций):
  - Основа: `B.spread_betting === true` — только 13 брокеров
  - Все UK-фокусированные (spread betting = UK/Ireland legal product)
- [ ] **3.4** Crypto фильтры (14 функций):
  - Основа: `B.verticals.includes('crypto')`
  - По монетам: проверка `B.crypto_assets` на наличие конкретной монеты
  - По стране: + регулятор для крипто в данной юрисдикции
- [ ] **3.5** Forex gaps фильтры (16 функций):
  - Страновые: стандартная фильтрация по `accepts_clients_from` или регулятору
  - Регуляторные: `B.regulators.includes('FSA')` и т.д.
- [ ] **3.6** Тест: каждый фильтр возвращает ≥ 3 брокера (минимум для рейтинга)
- [ ] **3.7** Fallback: если фильтр пуст — показать top-10 из вертикали

**Файлы:** `src/data/rankingFilters.js`
**Зависимости:** Sprint 1, Sprint 2

#### Sprint 4: SEO-контент для новых рейтингов `[M, 2 дня]`

Уникальный title, description, intro, education и FAQ для каждого из 53 рейтингов.

- [ ] **4.1** Title tags (53 шт): формат `"Best [X] Brokers 2026 — Expert Ranked | RatedBrokers"` — каждый уникален
- [ ] **4.2** Meta descriptions (53 шт): 150-160 символов, CTA-ориентированные, уникальные
- [ ] **4.3** Intro paragraphs (53 шт): 100-200 слов, объясняют суть рейтинга
- [ ] **4.4** Education sections: шаблоны по вертикалям:
  - CFD: "What is CFD Trading?", "How to Choose a CFD Broker", "CFD vs Forex"
  - Copy Trading: "How Copy Trading Works", "Risks of Copy Trading"
  - Spread Betting: "What is Spread Betting?", "Tax Benefits", "Spread Betting vs CFD"
  - Crypto: специфичные под каждую монету/фичу
- [ ] **4.5** FAQ (53 × 3-5 вопросов): уникальные long-tail вопросы для FAQ Schema
- [ ] **4.6** Key Findings: одно уникальное предложение-инсайт для каждого рейтинга
- [ ] **4.7** Аудит: ни один title/description не дублируется (скрипт проверки)

**Файлы:** `src/data/rankingSeoContent.js`, `src/data/educationTemplates.js`
**Зависимости:** Sprint 2

#### Sprint 5: Компонент CategoryHubPage `[M, 2 дня]`

Одна универсальная React-страница, которая рендерит хаб для любой вертикали по slug.

- [ ] **5.1** Создать `src/data/categoryHubs.js` — конфиг для каждого из 5 хабов:
  - `slug`, `name`, `title`, `description`, `icon`, `color`
  - `featuredRankings[]` — 3-5 главных рейтингов этой вертикали
  - `topBrokers[]` — 5 лучших брокеров вертикали
  - `faq[]` — 4-6 FAQ-вопросов
  - `intro` — 200-300 слов текст (будет дописан в контентном спринте)
- [ ] **5.2** Создать `src/pages/CategoryHubPage.jsx`:
  - Hero band: gradient duo (navy→green) + H1 + subtitle + broker count badge
  - "Featured Rankings" секция: 3-5 карточек с иконками → ссылки на рейтинги
  - "All Rankings" grid: все рейтинги данной вертикали (карточки 2 колонки на desktop)
  - "Top 5 Brokers" мини-карточки: logo + score + CTA (reuse BrokerLogo)
  - FAQ аккордеон + FAQ Schema JSON-LD
  - BreadcrumbList JSON-LD: `Home > {Category}`
  - ItemList JSON-LD (все рейтинги вертикали)
- [ ] **5.3** Адаптивность:
  - 375px: 1 колонка, карточки stack
  - 768px: 2 колонки featured, 2 колонки grid
  - 1440px: 3 колонки grid, sidebar с top brokers
- [ ] **5.4** Стилизация: inline CSS, reuse brand colors (#0f172a, #059669, #f59e0b)
- [ ] **5.5** `document.title` и `<meta name="description">` через useEffect

**Файлы:** `src/pages/CategoryHubPage.jsx`, `src/data/categoryHubs.js`
**Зависимости:** Sprint 2, Sprint 3

#### Sprint 6: Роутинг хаб-страниц `[S, 0.5 дня]`

Подключить CategoryHubPage к React Router.

- [ ] **6.1** Добавить routes в `App.jsx` (ПЕРЕД catch-all `:slug`):
  - `/forex-brokers` → CategoryHubPage slug="forex"
  - `/cfd-trading` → CategoryHubPage slug="cfd"
  - `/copy-trading` → CategoryHubPage slug="copy-trading"
  - `/spread-betting` → CategoryHubPage slug="spread-betting"
  - `/crypto-trading` → CategoryHubPage slug="crypto"
- [ ] **6.2** Убедиться что catch-all `:slug` не перехватывает хаб-URL
- [ ] **6.3** Добавить route `/online-brokers` (placeholder для Sprint 7)
- [ ] **6.4** Проверить: все 5 хабов открываются, старые рейтинги не ломаются

**Файлы:** `src/App.jsx`
**Зависимости:** Sprint 5

#### Sprint 7: Master Hub "Online Brokers" `[M, 1.5 дня]`

Зонтичная страница всех вертикалей — `/online-brokers`.

- [ ] **7.1** Создать `src/pages/OnlineBrokersHub.jsx`:
  - Hero: "Find the Best Online Broker for You" + subtitle
  - Category cards grid (5 карточек Phase 1):
    - Иконка, название, кол-во рейтингов, кол-во брокеров
    - CTA-кнопка → хаб вертикали
    - Badge "Phase 2" на серых карточках (Stocks, Options, Futures)
  - "Popular Rankings" секция: top-8 рейтингов across all вертикалей
  - "How We Rate Brokers" блок → ссылка на /methodology
  - "Latest Reviews" → 4 последних ревью брокеров
- [ ] **7.2** JSON-LD: Organization + ItemList (вертикали)
- [ ] **7.3** Адаптивность: mobile 1 колонка, tablet 2, desktop 3 карточки
- [ ] **7.4** Route `/online-brokers` в App.jsx

**Файлы:** `src/pages/OnlineBrokersHub.jsx`, `src/App.jsx`
**Зависимости:** Sprint 5, Sprint 6

#### Sprint 8: Навигация — Header mega-menu `[M, 2 дня]`

Переработать мега-меню для зонтичной структуры.

- [ ] **8.1** Создать `src/data/navigationConfig.js` — вынести структуру меню из Header:
  - 5 вертикалей × top-6 рейтингов + "View All" ссылка на хаб
  - Guides и Resources остаются
- [ ] **8.2** Desktop mega-menu:
  - Dropdown "Brokers" → 5 колонок (Forex | CFD | Copy Trading | Spread Betting | Crypto)
  - Каждая колонка: заголовок + 5-6 top рейтингов + "View All →" ссылка на хаб
  - Ширина: 900-1000px (5 колонок)
- [ ] **8.3** Mobile navigation:
  - Аккордеон: "Forex Brokers ▼", "CFD Brokers ▼", "Copy Trading ▼"...
  - Каждый раскрывает 5-6 ссылок + "View All"
- [ ] **8.4** Обновить текущие пункты меню:
  - Убрать отдельные "Forex Brokers" и "Crypto Brokers" → объединить в "Brokers" dropdown
  - Guides, Compare, Reviews — оставить
  - About, Contact → в футер (если не помещаются)
- [ ] **8.5** Active state: подсветка текущей вертикали
- [ ] **8.6** Проверить: все ссылки ведут на корректные URL

**Файлы:** `src/components/Header.jsx`, `src/data/navigationConfig.js`
**Зависимости:** Sprint 6, Sprint 7

#### Sprint 9: Homepage — трансформация `[L, 2.5 дня]`

Превратить homepage из "forex-only" в зонтичный "online brokers" хаб.

- [ ] **9.1** Hero секция:
  - H1: `"Best Online Brokers 2026"` (вместо текущего forex-title)
  - Subtitle: `"Compare {X} brokers across forex, CFD, crypto, and more"`
  - Убрать/заменить forex-only pills
- [ ] **9.2** Category navigation (сразу после hero):
  - Grid/row из 5 кнопок-карточек: Forex | CFD | Copy Trading | Spread Betting | Crypto
  - Каждая: иконка + name + кол-во рейтингов + ссылка на хаб
  - На десктопе: горизонтальная полоса, на мобиле: горизонтальный scroll
- [ ] **9.3** Featured Rankings секция:
  - "Top Rankings" — 8-10 рейтингов из РАЗНЫХ вертикалей (не только forex)
  - Карточки с badge вертикали (Forex, CFD, Crypto...)
- [ ] **9.4** Top Brokers секция:
  - Оставить текущий Quick Grid / Power Cards, но title → "Top Rated Brokers" (не "forex brokers")
- [ ] **9.5** Countries секция:
  - Title: "Best Brokers by Country" (не "Best Forex Brokers by Country")
  - Ссылки остаются те же (пока forex-country, расширим позже)
- [ ] **9.6** Comparisons и Reviews секции — title обновить
- [ ] **9.7** `document.title`: `"Best Online Brokers 2026 — Reviews & Rankings | RatedBrokers"`
- [ ] **9.8** Meta description: `"Compare {X} online brokers across forex, CFD, crypto, copy trading and more. Expert reviews, rankings by category."`
- [ ] **9.9** JSON-LD: обновить Organization description, WebSite name
- [ ] **9.10** Удалить DEV blueprint блок (добавленный сейчас) или скрыть за `import.meta.env.DEV`

**Файлы:** `src/pages/Home.jsx`
**Зависимости:** Sprint 7, Sprint 8

#### Sprint 10: Breadcrumbs и internal linking `[M, 1.5 дня]`

Обновить breadcrumbs на всех типах страниц + перелинковка между вертикалями.

- [ ] **10.1** Определить маппинг "рейтинг → вертикаль" для breadcrumbs:
  - Каждый рейтинг в rankings.js имеет поле `vertical` → определяет хаб-родителя
  - CFD-рейтинг: `Home > CFD Trading > Best CFD Brokers for Beginners`
  - Forex-рейтинг: `Home > Forex Brokers > Best ECN Forex Brokers`
  - Crypto: `Home > Crypto Trading > Best Bitcoin Brokers`
- [ ] **10.2** Обновить breadcrumbs в `RankingPage.jsx`:
  - Текущее: `Home > Rankings > {name}`
  - Новое: `Home > {Hub Name} > {name}` (hub = ссылка на хаб-страницу)
- [ ] **10.3** Breadcrumbs в `CategoryHubPage.jsx`: `Home > {Hub Name}`
- [ ] **10.4** Breadcrumbs в `OnlineBrokersHub.jsx`: `Home > Online Brokers`
- [ ] **10.5** BreadcrumbList JSON-LD: обновить на всех страницах (рейтинги, хабы)
- [ ] **10.6** "Related Categories" блок в CategoryHubPage — ссылки на другие 4 хаба
- [ ] **10.7** "Related Rankings" блок в RankingPage — ссылки на смежные рейтинги из той же вертикали

**Файлы:** `src/pages/RankingPage.jsx`, `src/pages/CategoryHubPage.jsx`, `src/pages/OnlineBrokersHub.jsx`
**Зависимости:** Sprint 6, Sprint 9

#### Sprint 11: AllRankingsPage — группировка `[S, 1 день]`

Переработать `/rankings` для отображения рейтингов по вертикалям.

- [ ] **11.1** Добавить табы-фильтры в начале страницы:
  - `All (553)` | `Forex (205)` | `CFD (25)` | `Copy Trading (12)` | `Spread Betting (9)` | `Crypto (26)` | `Countries (240)`
- [ ] **11.2** При клике на таб — фильтрация списка рейтингов
- [ ] **11.3** Счётчик рейтингов в каждом табе (динамический)
- [ ] **11.4** Сохранить текущий поиск (fuse.js) — работает поверх выбранного таба
- [ ] **11.5** Обновить title: "All Rankings — Online Broker Rankings | RatedBrokers"

**Файлы:** `src/pages/AllRankingsPage.jsx`
**Зависимости:** Sprint 2

#### Sprint 12: Комбинаторные рейтинги — новые вертикали `[M, 1.5 дня]`

Расширить комбинаторный движок: CFD × страны, Copy Trading × страны.

- [ ] **12.1** Добавить типы в `combinatorialRankings.js`:
  - CFD types (5): `cfd`, `cfd-beginners`, `cfd-low-spread`, `cfd-day-trading`, `cfd-demo`
  - Copy Trading types (3): `copy-trading`, `copy-trading-beginners`, `copy-trading-apps`
  - Spread Betting: только UK + Ireland + Australia (3 страны × 1 тип = 3)
- [ ] **12.2** Генерация URL-slug-ов:
  - `/best-cfd-brokers-in-uk`, `/best-cfd-brokers-in-australia`...
  - `/best-copy-trading-platforms-in-uk`, `/best-copy-trading-platforms-in-usa`...
  - `/best-spread-betting-brokers-in-uk` (уже может быть, проверить)
- [ ] **12.3** SEO-контент шаблоны для новых комбинаторных типов:
  - Title: `"Best {Type} {Category} Brokers in {Country} 2026"`
  - Description: уникальный шаблон по типу
- [ ] **12.4** Фильтрующие функции: `category_filter(type) && country_filter(country)`
- [ ] **12.5** Итого: ~33 новых комбинаторных (CFD 5×15=75 → берём top-15 стран, Copy 3×15=45, Spread 3)
- [ ] **12.6** Проверить: slug-и не конфликтуют с существующими 240 комбинаторными

**Файлы:** `src/data/combinatorialRankings.js`
**Зависимости:** Sprint 2, Sprint 3

#### Sprint 13: Footer и About — обновление `[S, 0.5 дня]`

Обновить footer, about, disclosure для umbrella-позиционирования.

- [ ] **13.1** Footer — секция "Broker Categories":
  - Ссылки: Forex Brokers, CFD Trading, Copy Trading, Spread Betting, Crypto Trading
  - + Online Brokers (master hub)
- [ ] **13.2** Footer — обновить description: "RatedBrokers is an independent online broker comparison platform"
- [ ] **13.3** About Page — обновить первый абзац:
  - Текущее: "We analyze forex brokers..."
  - Новое: "We compare online brokers across forex, CFD, crypto, copy trading, and spread betting..."
- [ ] **13.4** How We Make Money — расширить disclosure:
  - Перечислить все типы продуктов (CFD, spread betting, copy trading)
  - Объяснить что CPA может отличаться по типу продукта
- [ ] **13.5** Contact Page — обновить если есть forex-specific текст

**Файлы:** `src/components/Footer.jsx`, `src/pages/AboutPage.jsx`, `src/pages/HowWeMakeMoneyPage.jsx`, `src/pages/ContactPage.jsx`
**Зависимости:** Sprint 9

#### Sprint 14: Sitemap и SEO-аудит `[M, 1.5 дня]`

Обновить sitemap, проверить все SEO-элементы на новых страницах.

- [ ] **14.1** Publication Planner: seed ~92 новых URL (53 рейтинга + 33 комбинаторных + 6 хабов)
  - Обновить hardcoded каталог в `publish.js`
  - Auto-seed при первом запуске
- [ ] **14.2** Sitemap: убедиться что все новые URL попадают в `/api/sitemap.xml`
- [ ] **14.3** Аудит title tags:
  - Скрипт: извлечь все title из rankingSeoContent.js → проверить на дубли
  - 0 дубликатов допустимо
- [ ] **14.4** Аудит meta descriptions: все уникальны, 150-160 символов
- [ ] **14.5** Canonical URLs: каждая страница имеет `<link rel="canonical">`
- [ ] **14.6** JSON-LD: проверить на всех новых страницах (BreadcrumbList, ItemList, FAQPage)
- [ ] **14.7** OG tags: title, description, image для хаб-страниц
- [ ] **14.8** Ranking Manager: обновить кол-во рейтингов (207 → ~253)

**Файлы:** backend `publish.js`, `src/data/rankingSeoContent.js`, все новые компоненты
**Зависимости:** все предыдущие

#### Sprint 15: QA и regression testing `[M, 1.5 дня]`

Полный QA всех новых и существующих страниц.

- [ ] **15.1** Новые рейтинги (53 шт):
  - Каждый открывается по URL
  - Карточки брокеров рендерятся (≥ 3 брокера)
  - CTA → `/go/{slug}` (не прямая ссылка)
  - Title tag и meta корректны
- [ ] **15.2** Хаб-страницы (5 шт):
  - 375px, 768px, 1440px — адаптивность
  - Все ссылки ведут на корректные рейтинги
  - FAQ аккордеон работает
  - JSON-LD валиден
- [ ] **15.3** Master Hub `/online-brokers`:
  - 5 карточек кликабельны
  - Popular Rankings ведут на рейтинги
- [ ] **15.4** Homepage:
  - H1 = "Best Online Brokers 2026"
  - Категории-кнопки ведут на хабы
  - DEV blueprint блок скрыт/удалён
- [ ] **15.5** Мега-меню:
  - Desktop: все 5 колонок, все ссылки рабочие
  - Mobile: аккордеон, все ссылки
- [ ] **15.6** AllRankingsPage:
  - Табы переключаются, счётчики корректны
  - Поиск работает в рамках таба
- [ ] **15.7** Regression — старые страницы НЕ сломаны:
  - `/best-forex-brokers` — рейтинг (не хаб) рендерится
  - `/best-ecn-forex-brokers-in-uk` — комбинаторный работает
  - `/review/ic-markets` — ревью не затронуто
  - `/review/ic-markets/fees` — subpage работает
- [ ] **15.8** `npm run build` — 0 ошибок, 0 warnings
- [ ] **15.9** Breadcrumbs корректны на всех типах страниц
- [ ] **15.10** Footer: все новые ссылки работают

---

### Phase 1 — Критический путь

```
Sprint 1 ──┐
Sprint 2 ──┤→ Sprint 3 → Sprint 5 → Sprint 6 → Sprint 7 → Sprint 8 → Sprint 9 → Sprint 10 → Sprint 14 → Sprint 15
           │
           ├→ Sprint 4 (параллельно)
           ├→ Sprint 11 (параллельно)
           └→ Sprint 12 (параллельно)
                                                                       Sprint 9 → Sprint 13 (параллельно)
```

**Оценка Phase 1:** ~20 рабочих дней (3-4 недели)
**Результат:** +53 рейтинга, +33 комбинаторных, +6 хабов, новая homepage = **~92 новых URL**

---

### Phase 2: Новые брокеры — Stocks, Options, Futures (высокий уровень)

**Предусловие:** Phase 1 завершена и стабильна.

- [ ] **P2.1** Исследование: 15-20 stock brokers (Fidelity, Schwab, Robinhood, Degiro...)
- [ ] **P2.2** Stock Brokers: YAML-данные, 20-30 рейтингов, хаб `/stock-trading`
- [ ] **P2.3** Options Brokers: 10-15 брокеров, 10-15 рейтингов, хаб `/options-trading`
- [ ] **P2.4** Futures Brokers: 8-12 брокеров, 8-10 рейтингов, хаб `/futures-trading`
- [ ] **P2.5** Обновление навигации и homepage: 8 вертикалей

**Оценка Phase 2:** ~16 рабочих дней (3-4 недели)
**Результат:** +50-55 рейтингов, 3 новых хаба, ~30 новых брокеров

---

### Phase 3: Prop Firms — новая вертикаль (высокий уровень)

**Предусловие:** Phase 2 завершена. Prop Firms = другой тип контента (challenges, payouts, profit split).

- [ ] **P3.1** Исследование: 15-25 prop firms (FTMO, FundedNext, TopStep, The5ers...)
- [ ] **P3.2** Новая модель данных + PropFirmReview.jsx (отдельный шаблон)
- [ ] **P3.3** 15-20 рейтингов, хаб `/prop-trading-firms`
- [ ] **P3.4** QA и SEO-аудит

**Оценка Phase 3:** ~10 рабочих дней (2 недели)
**Результат:** ~35-45 рейтингов, 1 хаб, ~20 prop firms

---

## M5. Методология — уникальная ценность 🎯

**Статус: ПЛАНИРУЕТСЯ**

- [ ] Исследовать методологии конкурентов (BrokerChooser, ForexBrokers.com, FXEmpire)
- [ ] Уникальная концепция RatedBrokers — чем мы отличаемся?
- [ ] Переписать Methodology.jsx — структура, визуал, контент
- [ ] Синхронизировать формулу с данными брокеров
- [ ] **Утверждение Егором**

---

## M6. Шаблоны страниц — идеальный рейтинг и ревью 📐

**Статус: ПЛАНИРУЕТСЯ**

### 6.1 Шаблон рейтинга
- [ ] Ревизия RankingPage.jsx — все breakpoints
- [ ] Quick Verdict, Comparison Table, Education, FAQ
- [ ] Key Finding: уникальный текст для каждого рейтинга

### 6.2 Шаблон ревью
- [ ] Ревизия BrokerReview.jsx
- [ ] E-E-A-T: автор, дата, источники
- [ ] CTA-оптимизация

---

## M7. Warning Pages — "Is [Broker] a Scam?" ⚠️

**Статус: ПЛАНИРУЕТСЯ**

80 warnings + 15 хабов = 95 URL. ~140K-165K запросов/мес.
Дорожная карта: `WARNING-ROADMAP.md`

---

## M8. Контент с нуля ✍️

**Статус: ПЛАНИРУЕТСЯ**

~639,000 слов: ревью (38 × 4,500 сл) + рейтинги (300+ × 5,500 сл).
Порядок: IC Markets (пилот) → Топ-10 → Остальные.

---

## M9. Деплой английской версии 🚀

**Статус: ПЛАНИРУЕТСЯ**

Технический SEO, Core Web Vitals, GSC, GA4, Clarity.

---

## M10+. Масштабирование

- Мультиязычность (RU, ES, AR)
- Интерактивные инструменты (Quiz, Spread Calculator)
- Бэклинк-стратегия
- Видео-ревью

---

## Приоритеты (порядок исполнения)

```
M3.5✅ → M4 ──────────────────→ M5 → M6 → M7 → M8 → M9 → M10+
          ↑                                          🔒
       СЕЙЧАС                                     ЕГОР OK
    Online Brokers                                 (деплой)
    Umbrella: 15 спринтов
    Phase 1 → Phase 2 → Phase 3
```

---

## KPI

| Метрика | Месяц 1 | Месяц 3 | Месяц 6 | Месяц 12 |
|---------|---------|---------|---------|----------|
| Страниц на сайте | 500+ | 600+ | 800+ | 1000+ |
| Проиндексировано | 365+ | 500+ | 700+ | 1000+ |
| Органический трафик / мес | 500 | 5,000 | 25,000 | 100,000 |
| Affiliate clicks / мес | 50 | 500 | 2,500 | 10,000 |
| Конверсии (FTD) / мес | 5 | 50 | 250 | 1,000 |
| Доход / мес | $500 | $5,000 | $25,000 | $100,000 |
| Domain Authority | 10 | 25 | 40 | 55 |
