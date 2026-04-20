# PROGRESS.md — История разработки RatedBrokers

## Спринт 1 — Фундамент (2 марта 2026)

### `4a28bc4` Initial commit
- Создан проект: React 19 + Vite + react-router-dom v7
- 36 брокеров с полными данными (B, SCORES, ACCOUNTS, SPREADS, FAQ, content)
- 43 страновых страницы с локальными регуляциями и платёжными методами
- Home, BrokerReview, CountryPage, Methodology, HowWeMakeMoneyPage, AboutPage
- Header с мега-меню (5 дропдаунов), Footer (6 колонок)
- Система авторов (26 экспертов с LinkedIn, credentials)
- i18n инфраструктура на 10 языков (en активен)
- ScoreBadge, AuthorByline, Breadcrumb, SearchOverlay (⌘K)
- JSON-LD schema на каждой странице (FAQPage, BreadcrumbList, Review, Article)

### `b61eb71` AllReviewsPage + Header unification
- AllReviewsPage: каталог всех 36 ревью с фильтрами (Top Rated, ECN, MM)
- CountryFlag: переход с emoji на PNG-флаги
- Унификация Header для всех страниц

### `0b8cc0f` In-Depth broker mini-reviews для страновых страниц
- Расширенные карточки брокеров в CountryPage
- Expandable analysis, pros/cons, risk warnings
- Улучшенная SEO-структура страновых страниц

---

## Спринт 2 — SEO Powerhouse (3 марта 2026)

### `32fe0fe` F1 SEO Powerhouse
**Самый большой коммит — полная SEO-машина:**
- **RankingPage:** 207 тематических рейтингов с Quick Verdict, education sections, FAQ, comparison tables
- **BrokerRankCard:** dual CTA, expandable analysis, pro/con pills, broker logos
- **rankingThematic.js:** ручной экспертный контент для 5 приоритетных рейтингов
- **thematicGenerators.js:** универсальный генератор контента для всех 207 рейтингов
- **educationTemplates.js:** 19 категорий образовательного контента + FAQ шаблоны
- **Новые брокеры:** City Index, Spreadex (итого 38)
- **Новые страницы:** AllGuidesPage, ContactPage, TrustScorePage
- **25 гайдов:** от "What Is Forex" до "Trading Psychology"
- **4 платформы:** MT4, MT5, cTrader, TradingView
- **10+ регуляторов:** FCA, ASIC, CySEC, BaFin, MAS и т.д.
- i18n: ranking page strings для всех 10 языков

### `ca3ed56` + `c15e4d6` Очистка репозитория
- Удалены из git: research/ (31 скриншот конкурентов), HTML-прототипы, черновики
- Обновлён .gitignore: .env, .claude/, research/, draft HTML/MD файлы

### `3b92279` PROJECT.md
- Краткое описание проекта, стратегии, конкурентного преимущества

### `228aa8a` PLAN.md
- Полная архитектурная документация: стек, 365+ страниц, 192 файла, SEO-система

---

## Methodology v2 — Честный скоринг (11 марта 2026)

### Переработка методологии
- Новая формула: Regulation 30%, Costs 20%, User Reputation 15%, Broker Transparency 15%, Platforms & Tools 15%, Execution Model 5%
- CySEC перемещён в Tier 1 (EU/MiFID)
- Knockout-критерий: без Tier-1 лицензии брокер не попадает на сайт
- Убраны все фейковые claims ("500+ trades", "30-day live testing", "NLP analysis")
- "Expert Hands-On Test" → "Broker Transparency"
- Новый файл: `docs/METHODOLOGY.md` (source of truth)
- Обновлены: methodologyData.js, trustScoreData.js, Methodology.jsx, ic-markets.md
- Обновлены все 10 языковых файлов i18n

---

## M3 — Идеальный шаблон рейтинга (12 марта 2026)

### `40aca8b` feat: M3 ranking template
- Баг-фикс: 4 CTA ссылки в RankingPage направлены через /go/{slug} бэкенд
- Mobile: метрика в Quick Verdict, touch targets 44px+, короткие Trust Stats лейблы
- Mobile: Comparison Table → карточки с 2-колоночным grid вместо таблицы
- Sticky CTA бар для #1 брокера (IntersectionObserver)
- SEO: ItemList JSON-LD schema, `<main>` + `<header>` семантика
- dateModified → динамическая дата
- CTA текст: "Visit {name}" + promo, Risk warning fontSize 10

### `378a506` fix: GitHub Pages images + API URL
- BrokerLogo: `BASE_URL` prefix для /logos/ путей
- AuthorAvatar + CountryPage: `BASE_URL` для /authors/ путей
- deploy.yml: `VITE_API_URL` env для CI билда
- Корень: Vite base=/ratedbrokers/, пути были от /

---

## M3.2 — Страницы экспертов и авторские блоки (12 марта 2026)

### `0a2820e` feat: AuthorCredits + AuthorPage + Expert section
- **AuthorCredits** — новый компонент: 3 колонки "Written By / Reviewed By / Fact Checked By" с аватарами 36px, LinkedIn, ссылками на /author/{id}
- **AuthorPage** — `/author/:slug`: hero, stats, bio, specialty, peer review блоки, "Articles by {Name}", JSON-LD Person schema
- **AuthorBioCard** — добавлена ссылка "View Full Profile" на AuthorPage
- **Home** — секция "Our Expert Team" с 4 мини-карточками (аватар + имя + роль + ссылка)
- **getReviewerForAuthor()** — маппинг перекрёстной проверки между экспертами
- Заменён AuthorByline → AuthorCredits на 5 страницах: RankingPage, BrokerReview, GuidePage, ForexBrokersPage, CryptoBrokersPage
- Responsive: 3 колонки на desktop, вертикальный стек на mobile

---

## Дизайн-аудит: контраст, читаемость, hover-стандарт (13 марта 2026)

### Контраст текста — системная переработка (~30 файлов)
- **Серые цвета повышены**: `#94a3b8` → `#64748b`, `#64748b` → `#475569`, `#475569` → `#334155` на всех светлых фонах
- **Футер (тёмный фон)**: ссылки `#94a3b8` → `#cbd5e1`, текст `#64748b` → `#94a3b8` — теперь проходит WCAG AA
- **Мелкие шрифты**: исправлены 8px/9px/10px → минимум 11px; labels 11→12px; ответы FAQ 14→15px
- **ScoreBadge**: label 10px → 11px (md), 11px → 12px (lg)
- **AffiliateDisclosureBanner**: 12px `#94a3b8` → 13px `#64748b`

### Hover-состояния — единый стандарт
- `index.css`: глобальные `transition` на `<a>` и `<button>`
- Breadcrumb: hover → `#059669`
- Accordion: hover background на кнопках
- TOC ссылки (BrokerReview, Methodology): hover color
- Read Review кнопки: hover border+color → green
- AuthorBioCard: hover на "View Profile" и LinkedIn CTA
- Filter tabs (AllReviews): hover состояние
- Header mega-menu: section headings `#94a3b8` → `#64748b`

### Затронутые файлы
- `index.css`, 10 компонентов, 21 страница (все основные + вторичные шаблоны)
- Тёмные секции (hero, CTA) сохранены — rgba/accent цвета не тронуты

---

## Логотипы брокеров — попытки и откат (13 марта 2026)

### Попытка 1: Увеличение пропорций
- BrokerLogo.jsx: iconSize 0.65→0.75, pillW 3.2→3.5
- Размеры +20-30% на 8 файлах (BrokerRankCard, Home, BrokerReview, RankingPage, AllReviewsPage, BrokerComparison, CountryPage)
- Результат: Егор — "по-прежнему некрасивые и маленькие"

### Попытка 2: Composite wide logos (icon + текст → sharp)
- `scripts/generate-wide-logos.mjs` — генерация 480x96 PNG из квадратных иконок
- `public/logos/wide/` — 38 файлов
- BrokerLogo.jsx переписан для показа wide image в pill
- Результат: Егор — "текст в логотипе недопустимо, нужны оригинальные"

### Попытка 3: Playwright-скрейпинг 38 сайтов
- Скачивание реальных логотипов из header/nav сайтов брокеров
- Результат: 21/38 (таймауты, cert errors, redirects, SSR)
- Егор: "решение плохое и исполнение, откати"

### Откат
- BrokerLogo.jsx восстановлен к коммитнутой версии (pill: icon + text)
- `public/logos/wide/` удалена
- Скрипты удалены, sharp/playwright убраны из deps
- Размеры в страницах (Home, BrokerRankCard, etc.) остались увеличенными (были закоммичены ранее)

---

## Редизайн секции брокеров на Home (13 марта 2026)

### `2f296ec` feat: add 3 new broker section variants (D, E, F) — set E as active
- **Variant D** — NerdWallet-style горизонтальные строки (top 5, крупные CTA)
- **Variant E** — Compact Power Cards: 5 карточек в ряд (активный вариант)
  - Логотип + название + скор + spread/min dep + регуляторы + Visit Broker CTA
  - #1 с "Editor's Choice" зелёной лентой
  - Mobile: 2 колонки, Tablet: 3 колонки
- **Variant F** — Leaderboard Table: все 10 брокеров в табличном формате
- Все варианты: affiliate tracking через `/go/{slug}`, responsive, hover-эффекты
- `BROKER_VARIANT = "E"` в `src/pages/Home.jsx`
- Конкурентный анализ: NerdWallet, BestBrokers, ForexBrokers.com

---

## Текущее состояние

| Метрика | Значение |
|---------|----------|
| Брокеров | 38 |
| Стран | 43 + 15 combinatorial |
| Рейтингов | 440 (200 thematic + 240 combinatorial) |
| Subpages | 304 (38 × 8 табов) |
| Гайдов | 25 |
| Платформ | 4 |
| Регуляторов | 22 |
| Всего страниц | ~831 |
| Админка | 4 раздела (Clicks, Affiliate, Rankings, Publish) |
| Языков | 1 активен (EN) |
| GitHub | rankoraresearch/ratedbrokers (private) |
| Сайт | ratedbrokers.com (Cloudflare Pages, закрыт от индексации) |
| API | api.ratedbrokers.com (Cloudflare Workers + D1) |

---

## Gradient Duo — единая тёмная hero-плашка (13 марта 2026)

### `HeroBand.jsx` — переписан
- Удалены TriangleMesh, FloatingShapes, DiagonalDivider
- Navy-to-green gradient: `linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)`
- Diagonal line texture (3% opacity) + orange glow accent (6% opacity)
- Props: `children`, `mob`, `tab`, `compact`

### Supporting components обновлены
- **AuthorCredits**: новый `onDark` boolean prop (backward-compatible с `variant="onDark"`)
- **TrustpilotLogo**: `onDark` prop → белый wordmark
- **RegBadge**: `onDark` prop → полупрозрачные цвета для тёмного фона

### 4 страницы переведены на HeroBand
- **RankingPage**: green icon box → translucent, белый H1, centered AuthorCredits onDark
- **PlatformPage**: белая подложка под лого, зелёный badge, compact padding
- **RegulatorPage**: TierBadge с onDark вариантами, кнопки glassmorphic стиль
- **BrokerReview**: glassmorphic sidebar, score/verdict #34d399, orange CTA (#f59e0b), sticky CTA bar

### Sticky CTA bar
- BrokerReview: новый sticky bar (position fixed bottom, navy bg, blur)
- BrokerLogo + Name + Score (#34d399) + Orange Visit CTA (#f59e0b)
- Slide-up animation on scroll > 500px
- RankingPage: sticky bar CTA обновлена на оранжевую (#f59e0b)

### Brand colors
- Navy: #0f172a, Green: #059669/#047857/#34d399
- Orange CTA: #f59e0b (на тёмном фоне), #d97706 (hover)
- Gradient: `135deg, #0f172a → #0f2e24 → #047857`

---

## Barbara Audit — BrokerReview body harmonization (13 марта 2026)

### Проблема
Hero band (Gradient Duo) выглядел мощно, а тело страницы — бледно-зелёное (#f0fdf4 + #86efac). Визуальный диссонанс. AuthorCredits на мобильном — хаотичный flex-wrap.

### `016b386` + `359a00f` — Dark navy anchors + AuthorCredits compact

**CTA блоки (3 шт.):** `#f0fdf4` + зелёная кнопка → navy `#0f172a` + оранжевая `#f59e0b`
**Scoring card:** белая карточка → navy top accent 3px + тёмный footer "Overall Score"
**Verdict card:** бледно-зелёный → dark gradient `#0f172a → #0f2e24`, белый текст, оранжевая CTA
**Right sidebar score:** бледно-зелёный → navy `#0f172a`, green score `#34d399`, orange CTA
**AuthorCredits compact:** новый `compact` prop — строка 1: аватар+автор, строка 2+: остальные с отступом

### Ритм страницы
Hero (dark) → контент → dark CTA → контент → dark scoring footer → контент → dark CTA → ... → dark verdict → dark sidebar. Navy-элементы echo gradient hero по всей странице.

### Затронутые файлы
- `src/pages/BrokerReview.jsx` — CTA, scoring, verdict, sidebar
- `src/components/AuthorCredits.jsx` — compact prop

---

## Breadcrumb standardization (13 марта 2026)

### `016b386` — Унификация padding хлебных крошек

**Проблема:** 5 разных паттернов padding на 17 страницах — прыгали, неодинаковый отступ сверху/снизу.

**Решение:** Стандартизировано в 2 паттерна:
- **Белый фон** (12 страниц): `mob ? "12px 16px 0" : "16px 24px 0"`
- **Border-style** (3 страницы: BrokerReview, RegulatorPage, PlatformPage): `mob ? "10px 0" : "12px 0"`

Удалены лишние wrapper-div с `paddingTop: 0`. Визуально проверено на desktop и mobile.

## Миграция на Cloudflare Pages (17 марта 2026)

### `6d06539` — Миграция GitHub Pages → Cloudflare Pages
- `vite.config.js`: `base: '/ratedbrokers/'` → `base: '/'`
- `deploy.yml`: заменён GitHub Pages workflow на Cloudflare Pages через wrangler
- Добавлен шаг `npm run brokers:build` в CI (раньше отсутствовал)

### `999ad47` — SPA-роутинг для Cloudflare Pages
- Удалён `public/404.html` (GitHub Pages хак)
- Удалён скрипт-декодер URL из `index.html`
- Создан `public/_redirects` (`/* /index.html 200`) — нативный SPA fallback

### `f4555c4` — Фикс белого экрана на кастомном домене
- React Router `basename="/ratedbrokers"` → `basename={import.meta.env.BASE_URL}`
- Хардкод `/ratedbrokers` ломал роутинг на `ratedbrokers.com` (все пути не матчились)

**Инфраструктура:**
- Домен `ratedbrokers.com` (регистратор NameBright)
- NS на Cloudflare (`lynn.ns.cloudflare.com`, `sima.ns.cloudflare.com`)
- DNS: CNAME `@` и `www` → `ratedbrokers.pages.dev` (Proxied)
- SSL: Full, сертификат Google Trust Services
- Индексация закрыта (robots.txt + noindex meta)

---

## Wide Logo System — Review Hero Redesign (23 марта 2026)

### WideLogo компонент (BrokerReview.jsx)
- **Dual Logo System**: каждый брокер — квадратный icon (карточки) + wide wordmark (review hero)
- **38 wide SVG/PNG/JPG** логотипов в `public/logos-wide/`
- Формат: SVG по умолчанию, WIDE_EXT для исключений (capital-com: png, libertex: png, fxpro: jpg)
- **LOGO_BG map**: фон карточки совпадает с фоном SVG (большинство #fff, цветные: exness #ffde02, xm #1a1a2e, trading-212 #000, fxpro #f31112)
- border: `2px solid rgba(255,255,255,0.3)` для контраста с тёмным hero band
- Desktop: 280×88, Mobile: 200×64, borderRadius 14

### Аудит и фиксы
- 12 брокеров имели цвет текста SVG в качестве LOGO_BG (тёмный текст на тёмном фоне) → все исправлены на #fff
- FxPro: .webp → оригинальный JPG с PR Newswire (красный фон, белый серифный шрифт)
- Dukascopy: LOGO_BG исправлен с #ED1C24 на #fff (чёрный текст на красном нечитаемо)

---

## Wide Logo Fixes — 9 брокеров (24 марта 2026)

### `6151f82` fix: wide broker logos — 9 fixes
- **eToro**: удалён risk warning текст из SVG, исправлен viewBox (центрирование)
- **FXTM**: заменён на Wikimedia SVG (глобус: lime #c6d72f + orange #eb5425 + navy текст #151b2a)
- **ThinkMarkets**: "Think" стал видимым (fill: white → #1a1a2e), "Markets" остался зелёным
- **XM**: LOGO_BG изменён с "red" на "#1a1a2e" (белый текст SVG)
- **Swissquote**: заменён SVG (красный эмблем + тёмный текст)
- **Eightcap**: PNG удалён → чистый SVG wordmark (#24b267)
- **Tickmill**: LOGO_BG с "#f04" → "#fff" (SVG уже имел тёмный текст + цветную иконку)
- **Libertex/Capital.com**: нормализован размер растра с 90% до 70% (единый масштаб)
- WIDE_EXT: удалены eightcap и fxtm (теперь SVG)

---

## Clean White — Ranking Card Redesign (25 марта 2026)

### Прототипы
- **RankingProtoWide.jsx** — Dark Crown прототип: 3 варианта (A/B/C) wide лого + Orange CTA
- **LightThemeProto.jsx** — Light Theme прототип: 3 варианта (Clean White, Warm Cream, Navy Authority)
- Роуты: `/proto/ranking-wide`, `/proto/light-theme`

### BrokerRankCard.jsx — Clean White applied
- **Wide wordmark лого**: WideLogo компонент с WIDE_EXT/LOGO_BG maps (из `logos-wide/`)
- **Desktop**: outlined green rank badge → WideLogo 200×60 → Name/Badge/Type → Stats (3 items) → Score
  - Нижняя секция: Regs + Trustpilot → Thematic → DualCTA → RiskWarning
- **Mobile**: Rank+Score header → WideLogo 200×64 centered → Name → DualCTA → TP → Risk → Regs → Stats
- **CTA**: solid green #059669 primary + navy #0f172a outline secondary (вместо gradient + зелёный outline)
- **Rank badge**: outlined (#ecfdf5 bg, #a7f3d0 border) вместо filled

### Home.jsx — All Brokers grid
- Wide логотипы в секции "All 38 Brokers" (4 колонки desktop, 3 tablet, 2 mobile)
- Вертикальные карточки: wide лого + имя + score + arrow

---

## Sub-Pages — 304 новых страницы (30 марта 2026)

### Архитектура
- **Новый роут** `/review/:slug/:tab` → `BrokerSubPage.jsx`
- 8 табов: fees, min-deposit, platforms, regulation, deposit, beginners, alternatives, account
- **304 страницы**: 38 брокеров × 8 табов — все рендерятся без ошибок
- Невалидный таб → `<Navigate to="/review/:slug" />` (redirect)

### Компоненты (`src/components/subpage/`)
- 11 новых файлов: QuickAnswerBox, ProsCons, DataTable, ComparisonBar, CTAInline, FaqSection, VerdictBox, SubPageTabs, SubPageLayout, Typography, index.js
- Извлечены из SubPagesProto.jsx (1242 строки hardcoded IC Markets) → data-driven

### Tab-рендереры (`src/pages/subpage-tabs/`)
- 9 файлов: FeesTab, MinDepositTab, PlatformsTab, RegulationTab, DepositTab, BeginnersTab, AlternativesTab, AccountTab, index.js
- Гибридный подход: 80% данных из YAML (spreads, accounts, deposits, regs, similar), 20% editorial из `SUBPAGES` YAML-секции
- **Все рендереры работают без `subpages:` YAML** — fallback из существующих данных

### Изменённые файлы
- `src/App.jsx` — добавлен роут `review/:slug/:tab`
- `scripts/build-brokers.mjs` — добавлен `SUBPAGES: fm.subpages || {}`
- `src/pages/BrokerReview.jsx` — секция "Deep Dive" в правом sidebar (8 ссылок на sub-pages)

### QA результаты
- 304/304 URL → HTTP 200 (curl batch test)
- Mobile 375px, Tablet 768px, Desktop 1440px — проверены визуально
- CTA → `/go/{slug}` (affiliate tracking)
- Sticky tabs, sticky CTA bar, breadcrumbs — всё работает
- `npm run build` — без ошибок

### `dfe8483` fix: replace sub-page banner with ← Review tab in sticky tab bar
- **Удалён баннер** "Full Review / {name} Review 2026" — занимал место между табами и контентом
- **Удалена pill-кнопка** "← Back to Full Review" рядом с breadcrumb
- **Добавлен таб "← Review"** как первый элемент в sticky tab bar (SubPageTabs.jsx)
  - ArrowLeft иконка + "Review", borderRight разделитель от обычных табов
  - Ведёт на `/review/{slug}`, никогда не active
  - Hover: navy текст + light bg (как остальные табы)
- Breadcrumb остался (в нём кликабельная ссылка "{B.name} Review")
- Неиспользуемый импорт `FileText` удалён из SubPageLayout

---

## Admin Panel Sprint — Affiliate Links + Click Dashboard (31 марта 2026)

### Фаза 1: CRUD API для брокеров
- **Новый файл `backend/src/routes/admin.js`** — полная админ-панель:
  - GET/PUT/POST/DELETE `/api/admin/brokers` — CRUD для affiliate-ссылок
  - GET `/api/admin/dashboard` — HTML-интерфейс для управления ссылками
  - Поиск, фильтры (All/Active/Placeholder), сортировка по колонкам
  - Inline-редактирование: Test/Copy/Edit кнопки, Enter/Escape keybinds
  - Bulk Paste: авто-парсинг `slug|url`, preview перед применением
  - Toast-уведомления об успехе/ошибке
  - Таблица `broker_changes` — аудит лог всех изменений

### Фаза 2: Click Dashboard (переписан)
- **`backend/src/routes/stats.js`** — полная переработка:
  - Period selector: 7d / 30d / 90d
  - Имена брокеров вместо slug'ов
  - Горизонтальная bar chart (Chart.js) — топ брокеров по кликам
  - Inline progress bars в таблице
  - Doughnut chart — распределение по странам
  - Clean referrer domains (без протоколов и www)
  - Live Feed — последние 20 кликов в реальном времени

### Фаза 3: Shared Admin Header
- **Новый файл `backend/src/utils/adminLayout.js`** — shared layout:
  - Sticky topbar с лого "Rated.Admin"
  - Навигация: Click Dashboard ↔ Affiliate Links (с active indicator)
  - Language switcher с флагами (English, расширяемый)
  - Responsive (mobile: compact header, скрытый lang label)

### Фаза 4: Починка 21 незатрекаемой ссылки
- **5 файлов исправлены** — все CTA теперь через `/go/{slug}`:
  - `BrokerComparison.jsx` — 8 ссылок
  - `CountryPage.jsx` — 9 ссылок
  - `ForexBrokersPage.jsx` — 1 ссылка
  - `RegulatorPage.jsx` — 1 ссылка
  - `CryptoBrokersPage.jsx` — 1 ссылка
- `rel` атрибуты: `noopener noreferrer nofollow` → `noopener nofollow sponsored` (SEO)

### Инфраструктура
- `backend/schema.sql` — таблица `broker_changes` (audit log)
- `backend/src/utils/cors.js` — добавлены PUT, DELETE в Allow-Methods
- `backend/src/index.js` — 5 новых маршрутов `/api/admin/*`
- D1 миграция применена на production
- Worker задеплоен, всё работает

---

## Комбинаторные рейтинги + Cleanup (31 марта 2026)

### Phase 1: Cleanup + 4 новых тематических
- Удалён `crypto-vs-cfd` (не брокер-тематика)
- Удалены все 10 `alt-*` (S. Broker Alternatives) — 4 файла
- Добавлены 4 новых: natural-gas, real-stocks, multi-asset, no-kyc
- Итого тематических: 207 → 200

### Phase 2: Комбинаторный движок (240 страниц)
- **Новый файл `src/data/combinatorialRankings.js`** — 16 типов × 15 стран = 240 записей
- COMBI_TYPES: ecn, low-spread, beginners, scalping, mt4, mt5, high-leverage, copy-trading, islamic, cfd, regulated, zero-spread, demo, day-trading, tradingview, trading-apps
- COMBI_COUNTRIES: uk, australia, usa, germany, singapore, uae, canada, south-africa, india, malaysia, nigeria, new-zealand, philippines, indonesia, kenya
- `rankingFilters.js`: TYPE_FILTERS (16) + GEO_FILTERS (15), `getCombiFilter()` = and(type, geo)
- `rankingSeoContent.js`: `makeCombiRanking()` template + 240 авто-SEO записей
- `thematicGenerators.js`: COMBI_TYPE_CONFIGS (16), 240 CONFIGS, combinatorial verdict template
- `educationTemplates.js`: combi- → country education template
- `RankingPage.jsx`: 4-уровневые breadcrumbs для combinatorial (Home → Forex → Country → Title)
- URL: `/best-{type}-forex-brokers-in-{country}` — catch-all `:slug` подхватывает

### Phase 3: Oman (+1 страна)
- **Новый файл `src/data/countries/oman.js`** — 5 брокеров (IC Markets, Exness, XM, Pepperstone, AvaTrade)
- Зарегистрирован в `countries/index.js` (Middle East & Africa)
- geo-oman в rankings, filters, SEO, generators

### AllRankingsPage.jsx — все 440 рейтингов
- Import COMBINATORIAL_RANKINGS + ALL_RANKINGS array
- Таб "Type × Country" для 240 комбинаторных
- SUB_LABELS для 15 стран
- Категория "combinatorial" → "Type × Country Rankings"
- Каунты в title/meta/subtitle → 440

### Коммиты
- `4dd073a` feat: combinatorial rankings engine (200 thematic + 240 Type×Country = 440 pages)
- `fce9c7a` feat: show all 440 rankings on /rankings page

---

## Publication Planner — 4-й раздел админки (1 апреля 2026)

### Архитектура
- **Цель**: градуальная публикация ~831 EN-страниц за 16 недель для защиты от Google SpamBrain/Firefly (March 2026 Spam Update)
- **Принцип**: все страницы есть в SPA-бандле, неопубликованные → noindex, published → sitemap.xml
- **D1 таблица `page_publish`**: slug (PK), lang, page_type, status (draft/scheduled/published), scheduled_at, published_at

### Файлы
- `backend/schema.sql` — +таблица `page_publish` + 3 индекса
- `backend/src/routes/publish.js` — **НОВЫЙ**: dashboard HTML + 8 API handlers
- `backend/src/utils/adminLayout.js` — 4-й таб "Publish" в навигации
- `backend/src/index.js` — +9 роутов для publish

### API (9 эндпоинтов)
- `GET /api/admin/publish/dashboard` — HTML Publication Planner (auth)
- `GET /api/admin/publish/pages` — JSON с фильтрами ?type=&status=&q= (auth)
- `PUT /api/admin/publish/pages/:slug` — publish/schedule/unpublish/notes (auth)
- `POST /api/admin/publish/batch` — batch операции (auth)
- `POST /api/admin/publish/auto-schedule` — 16-week план от startDate (auth)
- `POST /api/admin/publish/tick` — опубликовать все due scheduled (auth)
- `GET /api/publish/active` — **PUBLIC** Cache 5min: список published slugs
- `GET /api/sitemap.xml` — **PUBLIC** sitemap index
- `GET /api/sitemap-{reviews|rankings|subpages|static}.xml` — **PUBLIC** sub-sitemaps

### Auto-Schedule Algorithm (16 недель)
- **Фаза 1** (дни 0-13): ~45 стр — homepage, top reviews, methodology, static
- **Фаза 2** (дни 14-41): ~200 thematic rankings (7-8/день)
- **Фаза 3** (дни 42-83): ~544 subpages + combinatorial (10/день, чередуясь)
- **Анти-детект**: рандомизированные часы 8-21 UTC, минуты 3-57 (никогда :00)

### QA
- Auto-seed: 831 страниц создано (38 reviews + 304 subpages + 200 rankings + 240 combi + 49 static)
- Publish → `/api/publish/active` содержит slug
- Unpublish → slug исчезает из active
- Batch: 5 страниц за раз — ok
- Auto-Schedule: 831 страниц распределены по 95 дням (16 недель)
- Sitemap: валидный XML index + 4 sub-sitemaps, только published URLs
- Tick: не публикует будущие страницы

### Deploy
- D1 миграция: CREATE TABLE page_publish — ok
- Worker deploy: Version `568a8a96` — ok

---

## Sub-ID Click Tracking + Cron Trigger (1 апреля 2026)

### Sub-ID Tracking
- **`src/utils/visitUrl.js`** — `getVisitUrl()` авто-добавляет `?ref={pathname}` ко всем 62 CTA-ссылкам
- **`backend/src/routes/redirect.js`** — читает `?ref=` → сохраняет в `source_page`
- **`backend/schema.sql`** — колонка `source_page TEXT` в таблице `clicks`
- **`backend/src/routes/stats.js`** — таблица "Top Source Pages" в Click Dashboard
- Коммит `e8894d4`

### Cron Trigger
- **`backend/wrangler.toml`** — `[triggers] crons = ["0 * * * *"]` (каждый час в :00)
- **`backend/src/index.js`** — `scheduled()` handler: `UPDATE page_publish SET status='published' WHERE scheduled_at <= now()`
- Автоматическая публикация scheduled страниц без ручного вмешательства
- Deploy: Version `74b94cf3`

---

## AlternativesTab UX Fixes (1 апреля 2026)

### Проблемы (выявлены визуальным аудитом)
- Таблица CompactRow: кнопки и RegBadge'ы наезжали друг на друга (flex без фиксированных колонок)
- VerdictBox: показывал CTA текущего брокера вместо топ-альтернативы
- Comparison Table ("vs Top Alternatives"): 7 колонок → Commission + Regs + CTA слишком узкие
- Sidebar (sticky right panel): показывал текущего брокера на странице альтернатив
- Кнопки "Visit {broker}" разной ширины (имена брокеров разной длины)

### Исправления

**Семантика (Билл CRO):**
- VerdictBox → передаёт `featured[0]` (топ-альтернативу) вместо текущего брокера
- Sidebar на `/alternatives` → показывает "#1 Alternative" с CTA на топ-альтернативу
- Mid-page баннер: "Our Top Pick: {name}" вместо "Compare all brokers"
- CompactRow: RegBadges удалены (Score/Spread/Deposit критичнее для scan speed)

**Layout (Барбара UX):**
- CompactRow: flex → CSS Grid (`1fr 56px 68px 62px 88px` desktop, `1fr 50px 64px 56px 82px` tablet)
- Header перенесён внутрь Card (pixel-perfect alignment с rows)
- Comparison Table: Commission удалён (7→6 колонок), Regs 100px, CTA 80px, `table-layout: fixed`
- Mobile: 2-row layout (logo+name+score / CTA), кнопки фиксированные 120px
- Desktop CTA: `width: 100%` (заполняет grid-ячейку)
- `BrokerSubPage.jsx`: передаёт `tab` (isTab) prop в TabRenderer

### Коммиты
- `55ce5c7` fix: alternatives tab — clean grid, sidebar shows top alternative
- `5f413fc` fix: comparison table overlap — drop Commission col, widen Regs + CTA
- `d15cc5a` fix: alternatives tab grid alignment — responsive tablet/desktop columns, pass tab prop
- `91dc9d0` fix: uniform CTA button sizes — width:100% desktop, fixed 120px mobile

---

## Compare Pages Redesign — мультивертикальность (2-7 апреля 2026)

### ComparePage (/compare) — полный редизайн
- HeroBand gradient с белой picker-карточкой (глубокая тень, оранжевый VS circle)
- 8 pill-табов вертикалей: All / Forex & CFD / Stocks & ETF / Options / Futures / Copy Trading / Crypto / Spread Betting
- 70+ popular pairs по всем вертикалям (Schwab vs Fidelity, NinjaTrader vs TradeStation и т.д.)
- Picker фильтрует дропдауны по выбранной вертикали
- Dot + Text badge (цветная точка 6px + серый текст) — выбран из 6 прототипов
- Accordion "All Comparisons" группировка по брокеру
- Premium dark "Why Compare" карточки
- AuthorCredits + trust stats в hero

### BrokerComparison (/compare/:pair) — мультивертикальный рефактор
- HeroBand gradient с белой VS-карточкой
- Orange CTA на всех кнопках (было зелёный/синий)
- **FIX**: Verdict CTA href=item.b.url → getVisitUrl() — потерянный affiliate трекинг
- **FIX**: NaN для stock-брокеров (parseFloat("N/A"))
- Vertical-adaptive: Spread Table → Commission Table для stocks/options/futures
- Vertical-adaptive: Feature Table (Fractional Shares, DRIP, IPO Access, Extended Hours для stocks)
- Vertical-adaptive: FAQ, verdict, CTA text, breadcrumb, meta description, hero description
- Category cards: winner left border + score progress bar
- Чередование backgrounds между секциями
- CFD disclaimer только для forex/cfd/spread-betting

### Утилиты
- `src/utils/comparisonVertical.js` — getComparisonVertical (с hintVertical), BREADCRUMB_MAP, getCTAText
- `src/data/comparisons.js` — VERTICALS, POPULAR_PAIRS_BY_VERTICAL (7 вертикалей), FEATURED_PAIRS (all verticals union)

### Codex Review — 4 раунда
- Round 1: FEATURED_PAIRS forex-only → all verticals union, "generic" fallback
- Round 2: VERTICAL_PRIORITY reorder, parseFee + pickCheaper, midCTA checks real commissions
- Round 3: snake_case → camelCase (11 полей), hintVertical from curated pair data
- Round 4: duplicate pair vertical resolution (shared vertical preference), honest labels

### Коммиты
- `8c4fcd1` feat: compare pages redesign — multi-vertical, premium UI, adaptive content
- `cb53b82` fix: codex review — 4 findings resolved
- `d597643` fix: codex review round 2 — 4 findings resolved
- `d021f6a` fix: codex review round 3 — snake_case→camelCase, vertical hints, labels
- `e64a900` fix: codex review round 4 — duplicate pair vertical + honest labels

---

## Crypto Country Rankings (8 апреля 2026)

### `f160d22` feat: add 5 crypto country rankings
- +5 новых crypto-страновых рейтингов: Singapore, UAE, India, South Africa, New Zealand
- Усилены SEO-тексты 5 существующих (UK, USA, AU, CA, DE) — с 1-2 предложений до 300+ слов + 4 FAQ
- Fallback fix: вертикально-ограниченный pad (crypto/stocks не получают forex-мусор)
- areaServed JSON-LD для всех страновых рейтингов + _countryName поле
- Markdown rendering в ranking intro (bold + links) через dangerouslySetInnerHTML
- Header мега-меню: 3-колоночный crypto dropdown с "By Country" (desktop + mobile)
- Footer: +2 crypto страны (Singapore, UAE)
- categoryHubs: +2 featuredIds (crypto-singapore, crypto-uae)
- Backend: +10 crypto-страновых в publish.js (sitemap) + admin rankings.js
- Codex reviewed: 5 спринтов (10/10, 10/10, 10/10, 9/10, 9/10)
- **Итого: 293 тематических рейтингов (было 288)**

---

## Текущее состояние (9 апреля 2026)

| Метрика | Значение |
|---------|----------|
| Брокеров | 52 |
| Стран (Forex) | 43 |
| Тематических рейтингов | 293 |
| Комбинаторных рейтингов | 266 |
| Subpages | 416 (52 × 8 табов) |
| Гайдов | 25 |
| URL обзоров | `/reviews/{slug}` (бывш. `/review/{slug}`, 301 redirect) |
| Breadcrumb hub | `getBrokerHub(verticals[0])` в `categoryHubs.js` |

## Что дальше

- [x] Деплой — GitHub Pages + Cloudflare Workers API
- [x] Миграция на Cloudflare Pages + домен ratedbrokers.com
- [x] M3 — Идеальный шаблон рейтинга
- [x] Sub-Pages инфраструктура (304 страницы)
- [x] Admin Panel — affiliate links + click dashboard + ranking manager
- [x] Publication Planner — градуальная публикация + dynamic sitemap
- [ ] Фронтенд-интеграция Publication Planner (noindex для неопубликованных, листинги)
- [x] Cron Trigger для авто-публикации scheduled страниц (`0 * * * *`)
- [ ] Sub-Pages: IC Markets пилотный YAML-контент (8 табов)
- [ ] Sub-Pages: контент для остальных 37 брокеров
- [ ] Навигация: якоря на review vs sub-page табы (UX гармонизация)
- [x] OG-теги для квиза Find Your Broker
### `7766249` Quiz 2.0 — 5 sprints (10 апреля 2026)
- GeoIP race condition fix + share URL basename fix
- Risk warnings подключены к UI квиза (CFD-gated)
- QuickCompareTable включён в результаты
- Platform вопрос → Trading Frequency (daily/weekly/monthly/yearly)
- Budget: 4 → 8 диапазонов
- 12 стран получили маппинг регуляторов (IN, MY, PH, NG, KE, TR, BR, PK, SA, KW, QA, PL)
- "Read Review →" ссылки в Top 10 + QuickCompare
- Compare deep links /compare/{slug1}-vs-{slug2}
- Weak Points "Consider:" для Top 3 (getWeakPoint)
- User Profile Label (getUserProfile)
- Canonical + BreadcrumbList + HowTo JSON-LD schemas
- FAQ dedup (единый QUIZ_FAQ × 8 вопросов)
- SEO content block + Methodology section + Advertiser Disclosure
- OG meta tags с cleanup
- Match % floor: 15% → 5%
- ARIA: role=radio/checkbox, aria-checked, aria-expanded
- Codex reviewed: 9-10/10 на каждый спринт

- [ ] Google Search Console + Analytics
- [ ] Контентный аудит: уникальность текстов, keyword density
- [ ] Бэклинк-стратегия
- [ ] Мониторинг позиций (Ahrefs / SEMrush)

---

## Грандиозный аудит + 14 спринтов исправлений (10 апреля 2026)

Полный аудит сайта: 32 finding (7 CRITICAL, 8 BUG, 10 WARNING, 7 INFO).
Codex-reviewed: каждый спринт 10/10 перед реализацией.
Ветка: `audit-fixes-2026-04-10`

### `9095405` Sprint 1: Data Cleanup
- xm-v2.md merged → xm.md, удалён дубль (51 broker → 51 unique)
- Footer: "36 Brokers" → dynamic `getAllBrokers().length`
- Footer: "Updated Q1 2026" → dynamic `Q${quarter} ${year}`
- Footer: "All Rankings" обе ссылки → `/rankings`
- Footer: Privacy/Terms → `/privacy`, `/terms` (isLink: true)
- AllReviewsPage FAQ: "51+" → dynamic count
- TrustScorePage: distribution title → dynamic `{count}`
- BrokerReview + CountryPage: убраны локальные useMedia()

### `e820c44` Sprint 2: Routing & 404
- NotFoundPage.jsx: branded 404 с ссылками на Home/Rankings/Reviews/Quiz
- RankingPage: invalid slugs → NotFoundPage (вместо redirect на /)
- App.jsx: `<Route path="*">` fallback
- 21 proto route gated `import.meta.env.DEV` — исключены из production bundle

### `75bfe85` Sprint 3: SEO Foundation
- `src/hooks/useSEO.js`: canonical + OG + Twitter Card с cleanup на unmount
- `lastVerified` добавлен в build pipeline (fallback: 2026-03-31)
- Hardcoded dateModified → dynamic в 7 файлах
- `Sitemap:` добавлен в robots.txt
- useSEO интегрирован в Home, BrokerReview, RankingPage

### `64b06d1` Sprint 4: Legal Pages
- PrivacyPage.jsx + TermsPage.jsx (draft pending legal review)
- Routes: `/privacy`, `/terms`

### `77935a9` Sprint 5: CTA & Rel Audit
- CTA fallback: `visitUrl || B.url` → `visitUrl` (safe: getVisitUrl always returns URL)
- `noopener` добавлен ко всем `rel="nofollow sponsored"` в production

### `45002e8` Sprint 6: Bundle Optimization Phase 1
- **Main bundle: 2,109KB → 1,127KB (-47%)**
- fuse.js → separate chunk (18KB, loaded only with search)
- SearchOverlay → lazy loaded (8KB)

### `ccd5821` Sprint 7: Backend Hardening
- Rate limiter: in-memory Map → Cloudflare Cache API
- Ranking overrides: position validation (1-N range)
- CORS: ALLOWED_ORIGINS env variable
- Auth: TODO для cookie migration

### `9110c91` Sprint 8: UX Polish
- SpreadChart: dynamic maxSpread
- Homepage: "View All 43+ Countries" link
- Header: aria-label на burger menu

### `8f56d93` Sprint 9: Ranking Filters Phase A
- 13 vertical bugs fixed (crypto-overall/bitcoin/etc → isCrypto)
- "empty = pass" filter helpers: hasPay(), hasAcct(), hasFeat()
- 3 new YAML fields: payment_methods, account_types, features
- Enum validation в validate-brokers.mjs
- 34 filters updated (16 payment + 5 account + 13 features)
- 5 pilot brokers populated

### `477160e` Sprint 10: Ranking Filters Phase B
- Structured data для всех 51 брокеров
- payment_methods, account_types, features заполнены

### `c635616` Sprint 11: SEO Content
- 38 geo-country ranking pages получили expert SEO content
- Все 293 рейтинга теперь имеют SEO текст

### `86fb443` Sprint 12-14: New Broker Subpages
- 12 брокеров получили 5-tab subpages (fees, regulation, platforms, deposit, beginners)
- Expert E-E-A-T контент с конкретными данными
- Phase A: Robinhood, Fidelity, Charles Schwab, DEGIRO
- Phase B: Webull, E*TRADE, Trade Republic, Moomoo
- Phase C: tastytrade, NinjaTrader, TradeStation, AMP Futures, Optimus Futures

### `bb01e87` License Verification Links (13 апреля 2026)
- Номера лицензий в BrokerReview + RegulationTab → кликабельные ссылки на реестры регуляторов
- 30 licenseCheck URLs из regulators.js, ExternalLink icon, Tier-1 зелёные
- Fix: ASIC URL (auth-gated → public), SEC URL (deprecated → /search)

### `df6e8b8` Country Section Redesign (13 апреля 2026)
- Homepage "Regulated Brokers by Country" — полный редизайн
- 24 уникальных SEO-анкора: "Forex Brokers UK", "Crypto Brokers USA" etc.
- Green Uniform: все ссылки #059669, dot+text, hover underline
- Только реальные вертикали из rankings.js (UK=6, USA=6, AU=3, rest=2)
- ★ Most Popular badge (оранжевый ribbon)
- Broker count, equal card heights, mobile horizontal scroll

### Author Page Redesign + Editorial Activity (16 апреля 2026)

**Задача:** `/author/:slug` выглядела «супер шаблонно» — resume-стайл с радужными stat-карточками, плоский список ссылок, нет media mentions, нет freshness-сигналов. Полный редизайн + архитектура editorial-журнала.

**Агенты-консультанты:**
- `Barbara` — 3 концепта дизайна (A/B/C), бриф в `AUTHOR-PAGE-BARBARA.md`
- `Bill` — SEO/E-E-A-T блоки и риски, бриф в `AUTHOR-PAGE-BILL.md`

**Прото `/proto/author`:** 3 концепта + тумблер автора (Marcus analyst / Yegor founder). Файл `src/pages/AuthorProto.jsx`.

**Выбор:** Concept A (Editorial Authority WSJ-style). Удалена зелёная verified-галка. **Peer-review полоса убрана** с author page как концептуальная ошибка — ревью делается на материал, не на человека; переедет на review/ranking с `dateModified`.

**Реализация (`src/pages/AuthorPage.jsx` полностью переписан):**
- Premium Dark hero (navy→green gradient) + manifesto + credentials pills navy
- Trust Ribbon (mono-цифры): Years / Reviews Written / Review/Fact-check passes / Last Update
- About + Areas
- **Media Coverage** — карточки-цитаты с inline outlet wordmark. 10 стилизованных wordmark-ов (Bloomberg, REUTERS, The Wall Street Journal, FINANCIAL TIMES, CNBC, CNN, Forbes, MarketWatch, BUSINESS INSIDER, The Economist) в одном монохромном стандарте
- **Editorial Activity feed** — единая лента с underline-табами (All/Wrote/Reviewed/Fact-checked) + группировка по месяцам (APRIL 2026 · 7 actions). Orange eyebrow `RECENT ACTIVITY` + orange underline для активного таба. Pure typography, zero цветных чипсов
- Для Yegor (founder): feed → **Platform Milestones** (5 событий), без Media Coverage
- CTA «Have a question for X?»

**Новый data-модуль `src/data/authorActivity.js`:**
- `OUTLET_STYLES` — 10 typography-based wordmarks
- `MEDIA_MENTIONS` — цитаты per author (Marcus 3, Sarah 2, David 1)
- `ACTIVITY_FEED` — editorial events (Marcus 10, Sarah 7, Elena 6, David 6), shape 1:1 с будущим API
- `MILESTONES` — 5 событий для Yegor
- Helpers: `getTrustNumbers`, `getManifesto`, `bucketFeed`, `monthLabel`, `pageTypeLabel`

**Спека editorial-системы:** `EDITORIAL-ACTIVITY-LOG.md` (новый файл)
- Hybrid архитектура: bindings в MD frontmatter + events в D1 `editorial_actions`
- SQL schema + 3 индекса, 6 API endpoints (public + admin)
- Admin Publish расширения: per-row dropdown, bulk panel, Activity Log tab, Due-for-review dashboard
- Frontend: author page feed + byline на review/ranking + JSON-LD `dateModified`
- 8-спринтовый migration plan (~12-15 ч)

**Файлы:**
- `src/pages/AuthorPage.jsx` — rewrite
- `src/data/authorActivity.js` — новый (188 строк)
- `src/pages/AuthorProto.jsx` — новый (3 концепта)
- `EDITORIAL-ACTIVITY-LOG.md`, `AUTHOR-PAGE-BARBARA.md`, `AUTHOR-PAGE-BILL.md` — спеки
- `src/App.jsx` — route `/proto/author`
- `DECISIONS.md §25-26`, `memory/author-page.md` — документация

### `05f3884` Design Audit 2026-04-20 — sitewide polish (merge 23 commits)

**Задача:** Егор на `/regulator/cysec` увидел оставшуюся салатовую кнопку "Verify License". Запрос — sitewide аудит цветов/концепций/стандартов без изменения текстов/логики, с гарантированным откатом. Улучшить Regulator icons, полиш Footer, сделать compact Premium Green hero для тематических рейтингов.

**Процесс:** ветка `design-audit-2026-04-20` с safepoint tags. 9 спринтов (S1–S9) + delayed S9.5. Каждый спринт проходил через `/codex-review` до получения 10/10 (в сумме ~20 проходов Codex). Merge в main только после визуального approve Егора на dev-server и повторных Codex passes.

**Спринты:**

| # | Скоуп | Файлы | Результат |
|---|-------|-------|-----------|
| S1 | RegulatorPage pale-green → Plate B | RegulatorPage.jsx | Verify License, Tier callouts, Score chips переведены |
| S2 | Forex+Crypto landing | ForexBrokersPage, CryptoBrokersPage | 15 экз. pale-green, best-cell highlights → text-only, immutable rail hover pattern sitewide |
| S3 | Country/Ranking/Platform/Guide/AllGuides | 5 файлов | ~14 экз., Pros/Cons symmetry (green/red rails), Pro-Tip amber rail, 3-tier score colors, dead imports |
| S4 | Compare/Quiz/Warning/NotFound | 4 файла | Top-3 Quiz унифицированы без выделения #1 (D2k rule); dead 127-строчный `QuickCompareTable_REMOVED` удалён |
| S5 | Ranking Hero Premium Green | HeroBand.jsx + RankingPage.jsx | Новый prop `variant="green"` (default сохранён); compact hero, amber eyebrow в opaque navy capsule AAA, amber-tinted diagonal texture |
| S6 | Footer editorial refresh | Footer.jsx | Section headings JetBrains Mono 11px amber `#fbbf24` letterSpacing 0.18em sitewide; Affiliate Disclosure дифференцирован от Risk (slate vs amber rail) |
| S7 | Regulator icons polish | 19 SVG в public/regulators/ | Tier-coded dots (green tier-1 / amber tier-2 / red tier-3) + gloss overlay для 3D depth; original design preserved |
| S8 | Sitewide consistency | Home.jsx, AuthorPortal, AuthorsResearchPage | `VERTICAL_MAP` 8 цветов для dots → unified `#059669` (устранён антипаттерн «детская палитра»); admin/research pale-green cleanup |
| S9.5 | Custom CTA → sitewide components | 5 файлов | После критики Егора «цель был полиш, не новые сущности» — 5 мои custom Plate B CTA заменены на `.cta-secondary`, custom Score chip → `<ScoreBadge>` component. -76 строк inline CSS |

**Зафиксированные паттерны (memory/design.md):**
1. **Plate B card**: `bg #fff + border 1.5px #e2e8f0 + border-left 3px [coloured] + box-shadow 0 2px 8px rgba(15,23,42,0.04)`
2. **Plate B CTA hover immutable rail**: меняются только top/right/bottom borders + shadow lift + translateY(-1px). Left rail константен.
3. **Pro-Tip = amber rail**: `bg #fffaf0 + border-left 3px #f59e0b + title #b45309`
4. **Cons card = red rail**: `border-left 3px #dc2626 + heading #b91c1c`
5. **Editorial-eyebrow**: JetBrains Mono 11px amber #fbbf24 letterSpacing 0.18em (Footer + Ranking Hero + How We Rate)
6. **Score badges 3-tier**: `#047857 (≥9.0) / #1d4ed8 (≥8.0) / #b45309 (ниже)`
7. **AAA на dark gradient**: amber text требует **opaque** `#0f172a` capsule (не translucent rgba)
8. **Лидер #1 НЕ выделяется** (D2k rule, sitewide)
9. **CTA не писать ad-hoc**: использовать `.cta-secondary` (green outline), `.cta-primary`/`.cta-orange` (primary amber), `.link-green` (text link). Custom Plate B CTA — anti-pattern

**Анти-паттерны устранены:**
- Pale-green fills (`#ecfdf5`, `#f0fdf4`, `#a7f3d0`, `#d1fae5`, `#bbf7d0`) на production user-facing страницах — 0
- Радужные chips per category (8 разных hue для vertical dots) → unified green
- Выделение лидера #1 цветом в Quiz Top-3
- Синие template-style CTAs на PlatformPage (Official Website blue → green outline)

**Safepoints (origin):**
- `safepoint-design-audit-2026-04-20-0243` — до начала работы
- `safepoint-pre-design-audit-merge-2026-04-20-1319` — прямо перед merge

**Rollback:** `git reset --hard safepoint-pre-design-audit-merge-2026-04-20-1319 && git push --force-with-lease origin main`.
