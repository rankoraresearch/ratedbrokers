# RatedBrokers

Независимый агрегатор форекс- и криптоброкеров с прозрачной системой рейтингов, ревью и сравнений.
Монетизация — аффилиатные комиссии. Конкуренты: ForexBrokers.com, BestBrokers.com, Investopedia, BrokerChooser.

**Стек:** React 19 + Vite + react-router-dom v7. Inline CSS, без UI-библиотек. i18n на 10 языков.

**SEO-стратегия:** E-E-A-T (верифицированные авторы, реальные деньги, опубликованная формула), schema markup на каждой странице (FAQPage, BreadcrumbList, Review, ItemList), антиканнибализация ключей между страницами, programmatic SEO через 207 тематических рейтингов и 43 страновых страницы.

**Ключевое преимущество:** полностью открытая формула скоринга (6 критериев, 130+ data points) + тестирование на реальных деньгах. Ни один конкурент не публикует формулу целиком.

**Данные:** 52 брокера (детальные ревью 3000+ слов), 43 страны, 288 рейтингов, 240 комбинаторных, 25+ гайдов, 26 экспертных авторов.

**Бэкенд:** Cloudflare Workers + D1 SQLite — click tracking, affiliate management, ranking overrides, publication planner, link health, review editor (Quill WYSIWYG). API reference: [`backend/README.md`](backend/README.md).

**Админ-панель:** 7 разделов — Click Dashboard, Affiliate Links, Rankings, Publish, Messages, Link Health, Review Editor. Руководство: [`ADMIN-GUIDE.md`](ADMIN-GUIDE.md).

**Архитектура:** [`ARCHITECTURE.md`](ARCHITECTURE.md) — frontend structure, data pipeline, deployment.

**Цель:** топ-3 Google по запросам "best forex brokers", "forex broker reviews", "[broker] review" через экспертный контент, техническое SEO и масштабную внутреннюю перелинковку.
