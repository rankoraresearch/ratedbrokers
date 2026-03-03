# PLAN.md — Архитектура проекта RatedBrokers

## Стек технологий

| Технология | Назначение |
|-----------|-----------|
| React 19 + Vite | SPA-фреймворк + сборщик |
| react-router-dom v7 | Маршрутизация (языковые префиксы + динамические slug) |
| lucide-react | Иконки (200+ иконок) |
| fuse.js | Нечёткий поиск по брокерам/гайдам |
| Inline CSS | Все стили в JSX, без CSS-фреймворков |
| Custom i18n | Контекст + 10 языков (en активен, 9 готовы) |

**Шрифты:** DM Sans (body), Outfit (заголовки), JetBrains Mono (скоры/числа), Inter (бренд/лейблы)

---

## Архитектура

```
src/
├── App.jsx                  # Роутер (20 route-компонентов)
├── pages/                   # 20 страниц
├── components/              # 17 переиспользуемых компонентов
├── data/                    # 129 файлов статических данных
│   ├── brokers/             # 38 брокеров + index.js
│   ├── countries/           # 43 страны + index.js
│   ├── guides/              # 25 гайдов + index.js
│   ├── platforms/           # 4 платформы + index.js
│   ├── rankings.js          # 207 тематических рейтингов
│   ├── methodologyData.js   # TRUST_SCORE_TIERS, CRITERIA_V2
│   ├── authors.js           # 26 экспертных авторов
│   └── ...                  # SEO-контент, шаблоны, генераторы
├── hooks/                   # useMedia, useSearchIndex
├── i18n/                    # Мультиязычность (10 языков)
│   ├── LanguageContext.jsx  # Провайдер + useTranslation()
│   ├── config.js            # Конфиг языков
│   └── ui/                  # 673 ключа (en), ~475 (остальные)
└── assets/                  # Изображения, логотипы
```

**Поток данных:** статические JS-файлы → getter-функции (getBrokerData, getAllBrokers) → page-компоненты → inline-рендеринг + JSON-LD schema в useEffect.

---

## Все страницы (365+)

### Статические страницы (15)

| URL | Компонент | Назначение |
|-----|-----------|-----------|
| `/` | Home.jsx | Главная: featured брокеры, рейтинги, страны |
| `/best-forex-brokers` | ForexBrokersPage.jsx | Основной рейтинг форекс-брокеров |
| `/best-crypto-brokers` | CryptoBrokersPage.jsx | Основной рейтинг крипто-брокеров |
| `/rankings` | AllRankingsPage.jsx | Каталог всех 207 рейтингов |
| `/reviews` | AllReviewsPage.jsx | Каталог всех 38 обзоров |
| `/guides` | AllGuidesPage.jsx | Каталог всех 25 гайдов |
| `/compare` | ComparePage.jsx | Инструмент сравнения (выбор 2 брокеров) |
| `/best-forex-brokers-by-country` | CountryHubPage.jsx | Хаб: все 43 страны |
| `/methodology` | Methodology.jsx | Методология тестирования |
| `/trust-score` | TrustScorePage.jsx | Trust Score: поиск, тиры, критерии, лидерборд |
| `/how-we-make-money` | HowWeMakeMoneyPage.jsx | Прозрачность монетизации |
| `/about` | AboutPage.jsx | О компании, команда |
| `/contact` | ContactPage.jsx | Контакты |

### Динамические страницы (350+)

| Паттерн | Компонент | Кол-во | Примеры |
|---------|-----------|--------|---------|
| `/review/:slug` | BrokerReview.jsx | 38 | /review/ic-markets, /review/pepperstone |
| `/:slug` | RankingPage.jsx | 207 | /best-forex-brokers-for-beginners, /lowest-spread-forex-brokers |
| `/best-forex-brokers-:countrySlug` | CountryPage.jsx | 43 | /best-forex-brokers-uk, /best-forex-brokers-australia |
| `/guide/:slug` | GuidePage.jsx | 25 | /guide/what-is-forex-trading, /guide/scalping-strategy-guide |
| `/platform/:slug` | PlatformPage.jsx | 4 | /platform/metatrader-4, /platform/ctrader |
| `/regulator/:slug` | RegulatorPage.jsx | 10+ | /regulator/fca, /regulator/asic |
| `/compare/:pair` | BrokerComparison.jsx | ∞ | /compare/ic-markets-vs-pepperstone |

---

## Компоненты (17)

| Компонент | Назначение |
|-----------|-----------|
| Header.jsx | Навигация + мега-меню (5 дропдаунов) + мобильное меню |
| Footer.jsx | 6-колоночный футер + risk warning + affiliate disclosure |
| SearchOverlay.jsx | Глобальный поиск (⌘K) через fuse.js |
| BrokerRankCard.jsx | Карточка брокера в рейтинге (dual CTA, expand, pros/cons) |
| ScoreBadge.jsx | Бейдж скора с цветом по тиру |
| AuthorByline.jsx | Автор + fact-checker + дата обновления |
| AuthorAvatar.jsx | Аватар автора с verified-бейджем |
| AuthorBioCard.jsx | Полная карточка автора |
| Breadcrumb.jsx | Хлебные крошки + BreadcrumbList schema |
| BrokerLogo.jsx | Логотип брокера |
| CountryFlag.jsx | Флаг страны (PNG) |
| RegBadge.jsx | Бейдж регулятора (Tier 1/2/3) |
| Icon.jsx | Обёртка lucide-react + маппинг имён |
| Stars.jsx | Звёздный рейтинг |
| TrustpilotLogo.jsx | Логотип Trustpilot |
| AffiliateDisclosureBanner.jsx | Баннер аффилиатного раскрытия |
| Accordion.jsx | Раскрывающийся FAQ-блок |

---

## Данные

| Сущность | Кол-во | Файлы |
|----------|--------|-------|
| Брокеры | 38 | src/data/brokers/*.js (3000+ слов на ревью) |
| Страны | 43 | src/data/countries/*.js |
| Рейтинги | 207 | rankings.js + rankingThematic.js + thematicGenerators.js |
| Гайды | 25 | src/data/guides/*.js |
| Платформы | 4 | src/data/platforms/*.js |
| Авторы | 26 | authors.js (LinkedIn, credentials, фото) |
| FAQ | 1000+ | Встроены в каждую страницу |

---

## SEO-система

### Schema markup (JSON-LD на каждой странице)

| Тип | Где используется |
|-----|-----------------|
| FAQPage | Рейтинги, гайды, ревью, сравнения, контакты, методология, trust score |
| BreadcrumbList | Все страницы |
| Article | Рейтинги, гайды, форекс/крипто пиллары |
| Review + Rating | Ревью брокеров (ratingValue 0–10) |
| FinancialService | Ревью брокеров |
| HowTo / HowToStep | Методология |
| DefinedTerm | Trust Score |
| ItemList | Лидерборды, списки |
| Organization | Главная, контакты |
| WebSite + SearchAction | Главная |
| Person | Авторские профили |
| SoftwareApplication | Платформы |
| GovernmentOrganization | Страницы регуляторов |
| CollectionPage | Каталог гайдов |

### E-E-A-T сигналы
- 26 верифицированных авторов с LinkedIn-профилями
- Fact-checker на каждом ревью
- Дата обновления (quarterly)
- Полностью опубликованная формула скоринга
- Real-money testing disclosure
- Affiliate transparency page

---

## i18n

| Язык | Код | Статус | Ключей |
|------|-----|--------|--------|
| English | en | Активен | 673 |
| Russian | ru | Готов | ~475 |
| Spanish | es | Готов | ~475 |
| German | de | Готов | ~475 |
| French | fr | Готов | ~475 |
| Portuguese | pt | Готов | ~475 |
| Arabic | ar | Готов (RTL) | ~475 |
| Chinese | zh | Готов | ~475 |
| Japanese | ja | Частично | — |
| Turkish | tr | Готов | ~475 |

---

## Метрики кодовой базы

| Метрика | Значение |
|---------|----------|
| Всего файлов в src/ | 192 (.jsx + .js) |
| Строк кода | ~44,650 LOC |
| Страниц (компонентов) | 20 |
| Компонентов | 17 |
| Файлов данных | 129 |
| Самый большой файл | rankingThematic.js (197 KB) |
| Размер билда (gzip) | ~655 KB (index chunk) |
| Время билда | ~1.6 сек |
