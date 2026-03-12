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

## Текущее состояние

| Метрика | Значение |
|---------|----------|
| Брокеров | 1 (IC Markets) |
| Стран | 43 |
| Рейтингов | 207 |
| Гайдов | 25 |
| Платформ | 4 |
| Регуляторов | 10+ |
| Всего страниц | 365+ |
| LOC | ~44,650 |
| Языков | 1 активен / 10 готовы |
| GitHub | rankoraresearch/ratedbrokers (private) |

---

## Что дальше

- [x] Деплой — GitHub Pages + Cloudflare Workers API
- [x] M3 — Идеальный шаблон рейтинга
- [ ] OG-теги и мета-изображения для соцсетей
- [ ] Sitemap.xml (robots.txt есть)
- [ ] Google Search Console + Analytics
- [ ] Контентный аудит: уникальность текстов, keyword density
- [ ] Бэклинк-стратегия
- [ ] Мониторинг позиций (Ahrefs / SEMrush)
