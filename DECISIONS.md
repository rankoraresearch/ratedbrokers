# DECISIONS.md — Технологические решения

Каждое решение принято осознанно. Здесь зафиксировано **что выбрали**, **почему**, и **что отвергли**.

---

## 1. React 19 + Vite (не Next.js, не Astro)

**Выбор:** Чистый SPA с клиентским рендерингом (CSR).

**Почему:**
- Все данные статические (JS-файлы), нет API-вызовов → SSR не даёт преимуществ
- Google-бот исполняет JavaScript и находит JSON-LD schema
- Vite билдит за 1.6 сек (webpack в Next.js — 10-30 сек)
- Деплой на любой CDN без Node.js-рантайма → $0/мес за хостинг
- Нет проблем с гидратацией, кэш-инвалидацией, cold starts

**Отвергнуто:**
- Next.js — избыточен для статических данных, усложняет деплой
- Astro — islands-архитектура не нужна, весь контент интерактивный (поиск, аккордеоны, фильтры)
- Gatsby — медленные билды, устаревшая экосистема

---

## 2. Inline CSS (не Tailwind, не CSS Modules)

**Выбор:** 100% стилей через `style={{}}` в JSX. Единственный CSS-файл — `index.css` (сброс + Google Fonts).

**Почему:**
- Полный контроль над цветами, отступами, responsive через `useMedia()` хук
- Нулевой CSS-бандл (только ~2KB шрифтовых импортов)
- Нет конфликтов имён, нет каскада, нет специфичности
- Responsive через JavaScript: `mob ? "0 16px" : "0 24px"` — проще чем breakpoint-классы

**Отвергнуто:**
- Tailwind — 50KB+ JIT CSS, избыточен для data-driven страниц
- CSS Modules — лишний слой абстракции, не даёт преимуществ при inline-подходе
- styled-components — рантайм-стоимость, проблемы с SSR (если потребуется)

---

## 3. Статические JS-файлы (не API, не CMS, не база данных)

**Выбор:** Каждый брокер, страна, гайд — отдельный .js файл. Данные импортируются и бандлятся в финальный JS.

**Почему:**
- Мгновенная загрузка — данные доступны синхронно при рендере, без waterfall
- Полная история изменений через Git (кто, когда, что менял в данных брокера)
- Нет зависимости от внешних сервисов (API downtime, rate limits, latency)
- Деплой = push статики на CDN, без миграций БД

**Отвергнуто:**
- Headless CMS (Contentful, Strapi) — лишний сервис, latency, стоимость
- PostgreSQL/MongoDB — overkill для 38 брокеров, требует бэкенд
- JSON файлы — JS файлы позволяют экспортировать функции и вычисляемые поля

---

## 4. Без глобального стейт-менеджера (не Redux, не Zustand)

**Выбор:** Только `useState` + `useContext` (для языка).

**Почему:**
- Данные статические — нет async-загрузок, нет cache-invalidation
- Единственный shared state — язык (через `LanguageContext`)
- Каждый компонент управляет своим состоянием (открытый FAQ, выбранный фильтр)
- Проще отладка — React DevTools напрямую, без action/reducer

**Отвергнуто:**
- Redux — бойлерплейт ради одного контекста
- Zustand/Jotai — не нужны при отсутствии async-потоков
- TanStack Query — нет API-запросов для кэширования

---

## 5. Кастомная i18n система (не react-intl, не i18next)

**Выбор:** Собственный `LanguageContext` + динамический импорт языковых файлов.

**Почему:**
- react-intl добавляет 50KB+ к бандлу — наше решение < 2KB
- Два уровня перевода: UI-строки (`ui/en.js`) + контент брокеров (`content/es.js`)
- Динамический `import()` — неактивные языки не загружаются
- Простая интерполяция: `t("key", { name: "IC Markets" })` → замена `{name}` в строке

**Отвергнуто:**
- react-intl — тяжёлый, ICU Message Format избыточен
- i18next — мощный, но лишняя зависимость для простых подстановок

**Текущий статус:** en активен (673 ключа), 9 языков готовы (~475 ключей каждый).

---

## 6. lucide-react (не FontAwesome, не Heroicons)

**Выбор:** lucide-react с кастомным ICON_MAP маппингом.

**Почему:**
- Tree-shakeable — только используемые иконки попадают в бандл (~5KB за 50+ иконок)
- React-компоненты, не шрифтовые файлы — нет FOUT (Flash of Unstyled Text)
- Динамические цвета через `color` prop, размеры через `size`
- Единый 24px grid — визуально консистентно с DM Sans/Outfit

**Отвергнуто:**
- FontAwesome — тяжёлый (100KB+), шрифтовой подход
- Heroicons — ограниченный набор, нет финансовых иконок

---

## 7. Типографика: 4 шрифта

| Шрифт | Использование | Почему именно он |
|-------|--------------|-----------------|
| DM Sans | Body text | Высокая читаемость на 16px, современный sans-serif |
| Outfit | Заголовки (h1-h3) | Геометрический, контрастный, работает на 24px+ |
| Inter | Логотип / бренд | Ultra-bold (800-900) для statement-эффекта |
| JetBrains Mono | Скоры, числа | Monospace — числа 9.7, 8.5 идеально выровнены, нет путаницы 1/l/I |

---

## 8. fuse.js для поиска (не Algolia, не бэкенд)

**Выбор:** Клиентский нечёткий поиск через fuse.js.

**Почему:**
- 7KB gzipped — минимальный footprint
- 306 элементов индексируются за <1ms, поиск <10ms
- "ico marks" → "IC Markets", "bes ecn" → "Best ECN Forex Brokers"
- Не требует сервера, API-ключей, оплаты

**Отвергнуто:**
- Algolia — платный, overkill для 306 элементов
- ElasticSearch — требует бэкенд
- Нативный filter() — нет fuzzy matching

---

## 9. JSON-LD schema через useEffect (не SSR, не плагин)

**Выбор:** Schema markup инжектится в `<head>` через `document.createElement('script')` в `useEffect`.

**Почему:**
- Google-бот исполняет JS и находит JSON-LD
- Полный контроль над структурой (Review, Article, FAQPage, BreadcrumbList, DefinedTerm, ItemList)
- Cleanup через return-функцию useEffect — нет утечек при навигации
- Не требует серверного рендеринга

**Используемые типы:**
- `Review` + `Rating` — ревью брокеров (ratingValue 0-10)
- `FAQPage` — рейтинги, гайды, ревью, сравнения (featured snippets)
- `BreadcrumbList` — все страницы
- `Article` — рейтинги, гайды
- `FinancialService` — карточки брокеров
- `DefinedTerm` — Trust Score
- `HowTo` — методология
- `Organization` + `WebSite` — главная
- `Person` — авторские профили с credentials
- `SoftwareApplication` — платформы
- `ItemList` — лидерборды, списки

---

## 10. Система скоринга: 0–10, 6 критериев, публичная формула (v2)

**Выбор:** Взвешенная формула с полностью опубликованными весами. Research-based подход.

```
Score = Regulation×0.30 + Costs×0.20 + Reputation×0.15 + Transparency×0.15 + Platforms×0.15 + Execution×0.05
```

**Почему именно так:**
- **0–10 шкала** (не 1-5, не 1-99) — интуитивно понятна, достаточная гранулярность
- **6 критериев** — покрывают всё, что важно трейдеру, без информационного шума
- **Публичная формула** — ключевое отличие от конкурентов (ForexBrokers.com — проприетарная, Investopedia — частичная)
- **Regulation = 30%** — безопасность денег первична для финансового продукта
- **Knockout-критерий** — без Tier-1 лицензии брокер не попадает на сайт
- **CySEC = Tier 1** — EU/MiFID framework, investor compensation до €20,000

**v2 изменения (март 2026):**
- Expert Hands-On Test (20%) → Broker Transparency (15%) — честный подход, без фейковых "500+ trades"
- Regulation: 25% → 30%, Platforms: 10% → 15%, Execution: 10% → 5%
- Source of truth: `docs/METHODOLOGY.md`

**5 тиров:** Excellent (9+), Very Good (8-8.9), Good (7-7.9), Fair (6-6.9), Not Recommended (<6)

---

## 11. 207 программатических рейтингов

**Выбор:** Один компонент `RankingPage.jsx` рендерит 207 разных страниц через данные.

**Почему:**
- Каждый рейтинг = отдельный long-tail keyword cluster в Google
- Добавление нового рейтинга = 5 минут (запись в массив + тематические данные)
- Единая структура: intro → comparison table → education → FAQ → рекомендации
- `thematicGenerators.js` автоматически генерирует контент для всех 207 рейтингов

**Отвергнуто:**
- Ручное создание 207 страниц — не масштабируется
- CMS-подход — лишняя зависимость для шаблонных страниц

---

## 12. Аффилиатные ссылки: `rel="nofollow sponsored"`

**Выбор:** Все ссылки на брокеров помечены `rel="nofollow sponsored"` + `target="_blank"`.

**Почему:**
- Google Search Central spec — `sponsored` для платных отношений
- `nofollow` — не передаём PageRank брокерам
- Прозрачность — AffiliateDisclosureBanner на каждой странице
- Отдельная страница `/how-we-make-money` с полным раскрытием

---

## 13. Изображения: fallback-паттерн + CDN для флагов

**Брокер-логотипы:** `/logos/{slug}.png` → при ошибке → инициалы на градиентном фоне.
**Флаги стран:** `flagcdn.com` (внешний CDN) — нет локальных ассетов для 43 флагов.
**Аватары авторов:** `/authors/{slug}.webp` → при ошибке → инициалы.

**Все изображения:** `loading="lazy"` для отложенной загрузки.

---

## 14. Без UI-библиотеки (не Material UI, не Chakra, не Ant Design)

**Выбор:** Все компоненты (кнопки, карточки, аккордеоны, модалки, звёзды) написаны вручную.

**Почему:**
- Нулевой overhead — не загружаем 50-100KB базового CSS
- Точное соответствие бренду (#059669 green, #1e293b navy)
- Stars-компонент: CSS clip-path polygon (5-конечная звезда, half-fill градиент)
- SearchOverlay: `createPortal()` + `overflow: hidden` на body

---

## 15. Деплой: статический билд на CDN

**Выбор:** `vite build` → папка `dist/` → любой статический хостинг.

**Почему:**
- Нет Node.js рантайма → нет cold starts, нет серверных расходов
- CDN раздаёт статику за <100ms глобально
- Варианты: Vercel, Cloudflare Pages, Netlify, AWS S3+CloudFront
- Деплой = `git push` → автобилд → CDN

---

## 16. Markdown как источник данных брокеров (не JS-файлы напрямую)

**Выбор:** Единый MD-файл на каждого брокера (`content/brokers/{slug}.md`) с YAML frontmatter + Markdown body. JS-файлы генерируются автоматически через `npm run brokers:build`.

**Почему:**
- YAML frontmatter — человекочитаемый, легко редактировать и diff'ить
- Markdown body — review-текст с семантическими секциями (## Overview, ## Verdict и т.д.)
- Один файл = один брокер, вся информация в одном месте (данные + контент)
- Валидация через `npm run brokers:validate` — ловит ошибки до билда
- Git diff на MD-файлах читабельнее, чем на JS-объектах
- AI-агенты могут парсить и обновлять YAML frontmatter через Edit

**Отвергнуто:**
- JS-файлы напрямую — сложнее парсить, нет разделения данных и контента
- JSON — нет поддержки длинного текста (review body)
- YAML-only — нет inline Markdown для обзоров
- CMS (Contentful, Sanity) — внешняя зависимость, стоимость, latency

**Pipeline:** `content/brokers/*.md` → `validate-brokers.mjs` → `build-brokers.mjs` → `src/data/brokers/*.js` (gitignored)

---

## 17. Review Editor: D1 overrides + Quill WYSIWYG (не CMS, не git-only)

**Выбор:** Гибридный подход — MD-файлы как base content, D1 overrides поверх. Rich text editor (Quill) в админке.

**Почему:**
- Эксперты редактируют контент без доступа к git/коду
- Оригинал никогда не теряется — override можно удалить, вернув MD-текст
- Мгновенное обновление — без rebuild, без deploy (frontend fetch + merge)
- Graceful fallback — если API недоступен, показывается статика из бандла
- HTML из Quill даёт **bold**, *italic*, [ссылки] — необходимо для SEO-контента
- Мультиязычность — колонка `lang` во всех таблицах, каждый язык редактируется отдельно

**Отвергнуто:**
- Полный CMS (Contentful, Strapi) — внешняя зависимость, стоимость, latency, overkill
- Git-only редактирование — требует технических навыков от экспертов
- Markdown editor — MD → HTML конвертация добавляет сложность, Quill WYSIWYG проще для non-tech

**Архитектура:**
```
Admin/Expert → Quill editor → HTML → D1 (review_overrides)
Frontend → fetch /api/reviews/:slug/overrides → merge HTML over static JS → render
```

---

## 18. AI-агенты для актуализации данных (Джон + Боб)

**Выбор:** Два специализированных AI-агента, запускаемых через Claude Code Task tool. Промпты хранятся в `agents/`.

| Агент | Роль | Редактирует файлы? |
|-------|------|-------------------|
| Джон (Data Collector) | Сбор данных с интернета → обновление MD | Да (Edit) |
| Боб (Fact Checker) | Верификация данных → отчёт | Нет (только Read) |

**Почему два агента, а не один:**
- **Разделение ответственности** — сбор данных ≠ верификация. Один агент и собирает, и проверяет = конфликт интересов
- **Безопасность** — Боб не имеет доступа к Edit, не может случайно испортить данные
- **Гибкость** — можно запустить только проверку без обновления, или обновление без проверки
- **Аудит** — отчёт Боба = независимая верификация того, что Джон сделал корректно

**Почему промпт-файлы, а не хардкод:**
- Легко итерировать промпты без изменения кода
- Версионируются через Git — видно историю изменений инструкций
- Можно добавить новых агентов (редактор контента, SEO-аудитор) по тому же паттерну

**Типичный воркфлоу:**
1. Боб проверяет → отчёт о расхождениях
2. Джон обновляет → правки в MD-файлах
3. `npm run brokers:validate` → валидация
4. Боб перепроверяет → подтверждение

**Отвергнуто:**
- Один универсальный агент — сложный промпт, нет разделения ответственности
- Cron-скрипты (Puppeteer/Playwright) — хрупкие, ломаются при смене вёрстки сайтов
- Ручное обновление — 38 брокеров × 15+ полей = не масштабируется

---

## Сводная таблица

| Решение | Выбор | Альтернативы | Причина |
|---------|-------|-------------|---------|
| Фреймворк | React 19 + Vite | Next.js, Astro, Gatsby | CSR достаточен, быстрый билд |
| Стили | Inline CSS | Tailwind, CSS Modules | Нулевой CSS-бандл, полный контроль |
| Данные | Статические .js | API, CMS, БД | Мгновенная загрузка, Git-история |
| Стейт | useState + useContext | Redux, Zustand | Нет async-потоков |
| i18n | Кастомный контекст | react-intl, i18next | <2KB vs 50KB+ |
| Иконки | lucide-react | FontAwesome, Heroicons | Tree-shakeable, React-нативные |
| Шрифты | DM Sans + Outfit + JetBrains Mono | System fonts | Fintech-эстетика, monospace для скоров |
| Поиск | fuse.js | Algolia, ElasticSearch | Клиентский, 7KB, бесплатный |
| SEO schema | JSON-LD в useEffect | SSR, плагины | Работает с CSR, полный контроль |
| Скоринг | 0-10, 6 критериев, v2 | 1-5, 1-99 | Research-based, knockout Tier-1 |
| Рейтинги | 207 программатических | Ручные страницы | Масштабируется за 5 минут |
| UI | Вручную | Material UI, Chakra | 0KB overhead, точный бренд |
| Деплой | Статика на CDN | Node.js сервер | $0, нет cold starts |
| Данные брокеров | MD (YAML + Markdown) | JS напрямую, JSON, CMS | Человекочитаемо, AI-friendly |
| Актуализация | AI-агенты (Джон + Боб) | Cron-скрипты, ручное | Масштабируется, разделение ответственности |

---

## 14. Online Brokers Umbrella — URL Structure (M4)

**Выбор:** Hybrid (Option C) — хаб-страницы на отдельных URL + flat ranking URL-ы.

**Почему:** 0 редиректов существующих 441 URL. Keywords в URL сохранены (/best-ecn-forex-brokers). Хабы создают topical authority через internal links + breadcrumbs. Google не наказывает flat — наказывает thin content.

**Альтернативы:**
- Option A (всё flat) — нет silos, /rankings превращается в свалку
- Option B (вложенные /forex-brokers/ecn) — 441 редирект, потеря "best" из slug
- Option D (BrokerChooser-style /best-brokers/) — redundant URLs, ассоциация с наказанным BC

**Решение:** C даёт 80% преимуществ B при 0% рисков. Дверь к B открыта для миграции через 6-12 мес.

---

## 15. Один review template для всех типов брокеров (M4)

**Выбор:** Единый BrokerReview.jsx с conditional rendering для пустых секций.

**Почему:** Индустриальный стандарт (BrokerChooser, Investopedia, NerdWallet, ForexBrokers.com — все используют один template). Один брокер = один canonical review. Google ожидает comprehensive review.

**Адаптация:** Секции без данных (Spreads, CostBoxes, Mobile, Support, Education, Country) скрываются автоматически. Breadcrumbs динамические по вертикали. CTA показывает commission вместо pips для non-forex.

**Критический баг:** content fields (overview, verdict, regulation) — build script преобразует один параграф в строку вместо массива. BrokerReview вызывал .map() → TypeError → белый экран. Фикс: нормализация при рендеринге (toArr для array-полей, toString для string-полей).

---

## 16. 9 категорий (вертикалей) брокеров (M4)

**Выбор:** Forex, CFD, Copy Trading, Spread Betting, Crypto (Phase 1) + Stocks, Options, Futures (Phase 2) + Prop Firms (Phase 3).

**Почему:** Конкуренты (BrokerChooser, BestBrokers) используют зонтичный подход "online brokers". Homepage таргетирует "Best Online Brokers 2026" вместо "Best Forex Brokers".

**Реализация:** Hub pages удалены (каннибализация, 07.04), ranking pages = category landing pages. 52 брокера. 293 тематических + 266 комбинаторных рейтингов. 8 категорий в navigation bar. Crypto country expansion: +5 стран (08.04).

---

## 19. Compare Page — мультивертикальный подход (M4)

**Выбор:** Один URL `/compare` с pill-табами вертикалей (client-side фильтрация). BrokerComparison определяет вертикаль автоматически по данным пары.

**Почему:** Один URL проще для internal linking, нет каннибализации с `/compare/{pair}`. Табы визуально показывают breadth of coverage. Compare landing — utility page, не SEO-страница.

**Альтернативы:**
- Отдельные URL `/compare/stocks`, `/compare/forex` — каннибализация, лишние редиректы
- Dropdown-фильтры — более сложный UI для task-oriented страницы

**Vertical detection:** `getComparisonVertical(A, B, hintVertical)` — 3 уровня: 1) explicit hint из curated pair data, 2) shared vertical из broker metadata, 3) "generic" fallback.

---

## 20. Vertical badge — Dot + Text (M4)

**Выбор:** Цветная точка 6px + серый uppercase текст вместо цветного залитого badge.

**Почему:** 7 ярких badge-ей = "винегрет из цветов". Из 6 прототипов (Color, Mono, Ghost, Dot+Text, Left Stripe, 2-Group) выбран Dot+Text — лучший баланс: цветовая дифференциация сохраняется (мягкие пастельные точки), но площадь цвета минимальна. Паттерн Bloomberg/Linear/Figma.

**Альтернативы отвергнуты:**
- Color (текущий) — пёстро
- Mono Text — слишком незаметно
- Ghost Badge — аккуратно, но badge занимает лишнее место
- Left Stripe — элегантно, но требует tooltip для понимания цвета
- 2-Group — спорное деление на trading/investing

---

## 21. Auth: Bearer header + query fallback (Security Sprint, апрель 2026)

**Выбор:** Centralized `checkAuth()` в `utils/auth.js` — принимает `Authorization: Bearer` header (приоритет), `X-API-Key` header, и `?key=` query param (fallback).

**Почему:**
- API Key в query string логируется в access logs, browser history, referrer headers
- Dashboard AJAX calls переведены на `authFetch()` с Bearer header — ключ не в URL
- HTML dashboard pages продолжают использовать `?key=` для первого GET (нельзя поставить header в адресной строке)
- Backwards compatible — старые закладки с `?key=` продолжают работать

**Отвергнуто:**
- Полный отказ от `?key=` — сломает browser navigation к dashboards
- Session cookies — усложнение ради админки с 1-2 пользователями
- OAuth/JWT — overkill для internal tool

---

## 22. broker-content.json: protected endpoint (Security Sprint, апрель 2026)

**Выбор:** Перенос из `public/data/broker-content.json` → bundled в Worker + protected API endpoint `/api/admin/broker-content`.

**Почему:**
- 339KB JSON со всем контентом был доступен публично по предсказуемому URL
- Конкурент мог скачать все обзоры в один клик
- Теперь: файл bundled в Worker code, доступен только через auth endpoint
- Endpoint принимает и admin key, и expert tokens (для Review Editor)

**Pipeline:** `npm run brokers:build` → `backend/src/data/broker-content.json` → `import` в Worker → `/api/admin/broker-content`

---

## 23. React.lazy() code splitting (Performance Sprint, апрель 2026)

**Выбор:** Все страницы в App.jsx загружаются через `React.lazy()` + `Suspense` с `PageLoader` spinner.

**Почему:**
- 40+ страниц (включая 15+ прототипов) статически импортировались в один бандл
- Каждая страница теперь — отдельный chunk, загружается по требованию
- Initial load уменьшается (прототипы не грузятся при посещении /review/etoro)
- Vite автоматически code-splits lazy imports

**Отвергнуто:**
- Env-flag для прототипов — сложнее, чем просто lazy load
- Manual chunking (rollupOptions.manualChunks) — lazy() делает то же автоматически

---

## 24. Smart Placement + Staging (Infra Sprint, апрель 2026)

**Smart Placement:** `[placement] mode = "smart"` в wrangler.toml — Workers запускаются ближе к D1, ускорение D1 queries на 30-50%.

**Staging:** `[env.staging]` — preview environment для тестирования backend изменений перед production deploy. `npx wrangler deploy --env staging`.

---

## 25. Author Page — Variant A "Editorial Authority" + Editorial Activity (16.04.2026)

**Выбор:** Полный редизайн `/author/:slug`. Premium Dark hero + navy Trust Ribbon + white Media Coverage + unified Editorial Activity feed. Peer-review строка на странице автора **удалена**.

**Почему:**
- Предыдущий шаблон (resume-стайл: радужные stat-карточки зелёный/синий/фиолетовый + плоский список ссылок) прямо нарушал `DESIGN-ANTIPATTERNS.md §2/§3` (пастельная палитра per-category) и не давал никаких E-E-A-T-сигналов.
- Консультация Барбары (дизайн) + Била (SEO/E-E-A-T) сошлась на concept A (Editorial Authority WSJ-style). Детальные брифы: `AUTHOR-PAGE-BARBARA.md`, `AUTHOR-PAGE-BILL.md`.
- Единый шаблон с переменными покрывает и analyst-case (Marcus/Sarah/Elena/David), и founder-case (Yegor) — без ветвлений в логике. Для founder: manifesto = mission, trust-метрики = platform-stats, Editorial Activity → Platform Milestones.
- **Peer-review полоса на `/author/:slug` убрана как концептуальная ошибка**: ревью делается НА материал (broker review, ranking), не НА человека. Полоса переезжает на content-страницы (review/ranking) вместе с `dateModified` — там она работает как E-E-A-T для YMYL.
- Фиктивные credentials без verification — риск, флагнутый Билом. Entity graph через `hasCredential.verifyUrl` (ссылки на CFA Institute, FINRA, CMT Association) — отдельный спринт.

**Отвергнуто:**
- Concept B (Analyst Terminal, full-dark page) — нарушает `feedback_dark_rhythm.md` (Premium Dark — якорная секция, не фон всей страницы).
- Concept C (Magazine Profile FT-style с cream-бэндом и pullquote) — рассматривался как fallback, Егор выбрал Concept A.
- Visible verified checkmark badge на аватаре — удалён (Егор называл «ублюдочный зелёный эмодзи»).

**Файлы:**
- `src/pages/AuthorPage.jsx` — полностью переписан под Variant A.
- `src/data/authorActivity.js` — **новый модуль**: `OUTLET_STYLES` (10 wordmarks), `MEDIA_MENTIONS`, `ACTIVITY_FEED`, `MILESTONES`, helpers. Shape 1:1 с будущим API.
- `src/pages/AuthorProto.jsx` — прото с 3 концептами (A/B/C) + тумблер автора, остаётся на `/proto/author` как референс.

---

## 26. Editorial Activity Log — Hybrid архитектура (16.04.2026)

**Выбор:** Bindings writer/reviewer/factChecker в **MD frontmatter** ревью/рейтинга + журнал событий в **D1 таблице `editorial_actions`**. Спека: `EDITORIAL-ACTIVITY-LOG.md`.

**Почему:**
- **Bindings в MD**: источник правды в git, деплой-тайм, SSR-friendly (byline всегда в HTML).
- **Events в D1**: админ может отметить «прошёл фактчек» без PR/redeploy. Связано с существующим разделом Publish (`page_publish`, `publish_log`).
- На фронт: `/api/authors/:id/activity?limit=10` → Editorial Activity feed на author page. На review/ranking: `/api/pages/:slug/editorial` → byline + `dateModified`.
- **`dateModified` в JSON-LD Article** = max(acted_at) по странице — критичный SEO-сигнал свежести для YMYL-запросов ("best forex brokers 2026").

**Отвергнуто:**
- Чистый MD (`updates: [...]` массив в frontmatter) — каждая отметка = commit+redeploy, не масштабируется.
- Чистый D1 (без MD) — нет git-истории bindings, SSR-unfriendly.

**Где это работает на 10/10 (vs weak на author page):**
- Byline + last-checked date на broker review/ranking — ранжируется, YMYL, E-E-A-T материален.
- Author page — trust-asset (entity graph, `Person.sameAs`, `hasCredential`), не money-страница.
- Editorial Activity блок на author page = freshness-сигнал + internal link hub.

**Миграционный план:** 8 спринтов, ~12-15 часов. Этапы в `EDITORIAL-ACTIVITY-LOG.md §9`.

**Статус:** Спека готова. Реализация — отдельный спринт (пока ACTIVITY_FEED живёт как static mock в `authorActivity.js` с shape 1:1 под API).
