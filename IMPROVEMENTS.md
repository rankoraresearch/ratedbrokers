# IMPROVEMENTS.md — Трекер улучшений архитектуры

Живой документ: что улучшено, что запланировано, как связаны Frontend/Backend/Admin.

---

## Связь сущностей

```
Frontend (React SPA)          Backend (CF Workers + D1)         Admin Panel (Server HTML)
─────────────────────         ──────────────────────────        ────────────────────────
ratedbrokers.com              api.ratedbrokers.com              api.ratedbrokers.com/api/admin/*

src/pages/*.jsx               backend/src/routes/*.js           Embedded HTML в route files
src/data/brokers/*.js ←──── content/brokers/*.md (build)        
src/utils/visitUrl.js ──────► /go/{slug} (redirect.js)
BrokerReview.jsx ────fetch──► /api/reviews/:slug/overrides      Review Editor → review_overrides (D1)
RankingPage.jsx ─────fetch──► /api/rankings/:id/order           Ranking Manager → ranking_overrides (D1)
                              /api/publish/active ◄──────────── Publication Planner → page_publish (D1)
                              /api/sitemap.xml ◄─────────────── Sitemap генерируется из published pages
                              /api/admin/broker-content ◄─────── broker-content.json (bundled в Worker)
```

### Поток данных

```
1. Контент: MD файлы → build-brokers.mjs → JS файлы (frontend) + broker-content.json (backend)
2. Overrides: Admin/Expert → Quill editor → D1 review_overrides → Frontend fetch → merge + render
3. Rankings: Admin → drag-drop → D1 ranking_overrides → Frontend fetch → apply overrides
4. Публикация: Admin → page_publish → sitemap.xml → Google
5. Клики: Frontend CTA → /go/{slug} → D1 clicks → Admin Click Dashboard
```

---

## Выполненные улучшения

### Sprint 1: Security + Performance (08.04.2026)

Коммит: `8ca7469`

#### Security

| # | Улучшение | Файлы | Детали |
|---|-----------|-------|--------|
| S1 | **Auth: Bearer header migration** | `utils/auth.js` (новый), `cors.js`, 7 route files | Централизованная auth: `Authorization: Bearer` header (приоритет) + `X-API-Key` + `?key=` (fallback). ~19 dashboard fetch calls переведены на `authFetch()` |
| S2 | **broker-content.json → protected** | `build-brokers.mjs`, `reviews.js`, `expert.js`, `index.js` | Убран из `public/data/`. Bundled в Worker. Новый endpoint `/api/admin/broker-content` с auth. Принимает admin key + expert tokens |

**Как работает auth теперь:**
```
Browser → ?key=API_KEY → HTML dashboard (первый GET, нельзя поставить header)
Dashboard JS → Authorization: Bearer API_KEY → AJAX вызовы (все CRUD операции)
Expert → ?token=EXPERT_TOKEN → HTML dashboard
Frontend → без auth → public endpoints (overrides, published, sitemap)
```

**checkAuth() проверяет в порядке приоритета:**
1. `Authorization: Bearer <key>` header
2. `X-API-Key` header
3. `?key=` query parameter

#### Performance

| # | Улучшение | Файлы | Детали |
|---|-----------|-------|--------|
| P1 | **React.lazy() code splitting** | `App.jsx` | Все 40+ страниц через `lazy()` + `Suspense`. Каждая — отдельный Vite chunk. Initial bundle уменьшен. `PageLoader` spinner |
| P2 | **Smart Placement** | `wrangler.toml` | `[placement] mode = "smart"` — Workers ближе к D1, -30-50% latency на D1 queries |
| P3 | **Content flash fix** | `BrokerReview.jsx` | `overridesReady` state + `opacity: 0.92→1` transition 0.3s. Без блокировки render |

#### Infrastructure

| # | Улучшение | Файлы | Детали |
|---|-----------|-------|--------|
| I1 | **Staging environment** | `wrangler.toml` | `[env.staging]` — `npx wrangler deploy --env staging`. Тестирование backend без риска для prod |

---

## Запланированные улучшения

### Приоритет: HIGH

| # | Улучшение | Область | Effort | Описание |
|---|-----------|---------|--------|----------|
| H1 | **Broker data lazy loading** | Frontend | 1 спринт | `src/data/brokers/index.js` импортирует все 51 брокера. Dynamic `import()` по slug уменьшит бандл |
| H2 | **Hardcoded strings → t()** | Frontend | 2-3 спринта | ~200-300 English-литералов вне системы `t()`. Header, Footer, Home, BrokerReview, RankingPage, ComparePage, CountryPage, SearchOverlay, SubPageLayout. Нужно для будущей мультиязычности |
| H3 | **D1 Read Replicas** | Backend | 1-2 часа | CF D1 read replicas для read-heavy endpoints. Включить в dashboard settings |

### Приоритет: MEDIUM

| # | Улучшение | Область | Effort | Описание |
|---|-----------|---------|--------|----------|
| M1 | **KV cache для overrides** | Backend | 1 спринт | Cloudflare KV перед D1. Писать в KV при save в админке. TTL 1 час. Frontend SSR → KV (1ms) вместо D1 (5-50ms) |
| M2 | **Centralized SEO helpers** | Frontend | 1 спринт | `useSEO()` hook: title, meta, canonical, og:*, JSON-LD. Сейчас каждая страница устанавливает мета отдельно |
| M3 | **Cloudflare Zaraz** | Infra | 1-2 часа | Edge tag manager. Замена GTM (не блокируется ad-blockers). Бесплатно на Pages |
| M4 | **Admin auth: login page** | Admin | 1 спринт | Login форма → sessionStorage. Убрать `?key=` из URL полностью. Session cookie |

### Приоритет: LOW (будущее)

| # | Улучшение | Область | Effort | Описание |
|---|-----------|---------|--------|----------|
| L1 | **SSR через CF Workers** | Frontend | 2-3 спринта | Vite SSR + `@cloudflare/vite-plugin`. Критично для 40 языков (33K+ страниц). Не нужно для EN-only |
| L2 | **i18n infrastructure** | Full-stack | 3-4 спринта | URL routing `/:lang/*`, LanguageContext state, per-language builds, hreflang sitemaps. Блокер: решение о приоритетных языках |
| L3 | **RTL support** | Frontend | 2 спринта | CSS logical properties для AR/HE. Только после i18n |
| L4 | **Content versioning** | Backend | 1 спринт | `content_hash` в `page_publish`. При обновлении EN → флаг `translation_stale`. Dashboard "Stale Translations" |

---

## Архитектурные заметки

### Auth flow (после Sprint 1)

```
┌─────────────────────────────────────────────────────┐
│                    checkAuth()                       │
│                  utils/auth.js                       │
│                                                      │
│  1. Authorization: Bearer <key>  ← preferred         │
│  2. X-API-Key: <key>             ← legacy (stats)    │
│  3. ?key=<key>                   ← browser fallback   │
│                                                      │
│  extractKey() — достаёт key из любого источника       │
│  для передачи в dashboard HTML/JS                     │
└─────────────────────────────────────────────────────┘
```

### broker-content.json lifecycle

```
content/brokers/*.md
    │ npm run brokers:build
    ▼
backend/src/data/broker-content.json  ← НЕ public
    │ import в Worker bundle
    ▼
GET /api/admin/broker-content         ← auth required (admin key or expert token)
    │ fetch from dashboard JS
    ▼
Review Editor / Expert Editor         ← показывает оригинал рядом с override
```

### Frontend chunk structure (после lazy loading)

```
dist/
├── index-*.js          ~2.1MB (574KB gz)  ← core: React, router, broker data, shared components
├── BrokerReview-*.js   ~48KB              ← review page
├── RankingPage-*.js    ~36KB              ← ranking page
├── BrokerComparison-*  ~49KB              ← compare page
├── Home-*.js           ~varies            ← homepage
├── CountryPage-*.js    ~36KB              ← country pages
├── BrokerSubPage-*.js  ~67KB              ← subpage tabs
├── FindYourBroker-*.js ~43KB              ← quiz
├── ...production       ~10-30KB each      ← other pages
└── ...prototypes       ~10-75KB each      ← proto pages (never loaded in prod)
```

**TODO:** `index-*.js` всё ещё 2.1MB из-за broker data (51 брокер в одном графе). Решение: H1 (dynamic import по slug).

### Admin panel architecture

```
7 разделов — каждый = отдельный route file в backend/src/routes/

┌─────────────┬──────────────────────────────────────────┐
│ Раздел      │ Файл           │ D1 таблицы              │
├─────────────┼────────────────┼─────────────────────────┤
│ Clicks      │ stats.js       │ clicks, brokers         │
│ Affiliate   │ admin.js       │ brokers, broker_changes │
│ Rankings    │ rankings.js    │ ranking_overrides       │
│ Publish     │ publish.js     │ page_publish, publish_log│
│ Reviews     │ reviews.js     │ review_overrides, review_edit_log, expert_tokens │
│ Messages    │ messages.js    │ contacts               │
│ Link Health │ linkhealth.js  │ link_checks, brokers   │
└─────────────┴────────────────┴─────────────────────────┘

Shared: utils/adminLayout.js (header, nav, CSS), utils/auth.js, utils/cors.js
UI: Server-rendered HTML + Chart.js + Quill v2 (CDN)
```

---

## Гайд: как добавлять улучшения

1. **Security fix** → обновить `utils/auth.js` или соответствующий route file
2. **Новый admin раздел** → создать `routes/newSection.js`, добавить route в `index.js`, добавить nav item в `adminLayout.js`
3. **Новый public endpoint** → добавить handler в соответствующий route file + route в `index.js`
4. **Frontend optimization** → изменения в `src/`, проверить `npm run build` (warnings о chunk size)
5. **D1 schema change** → `wrangler d1 execute ratedbrokers --remote --command "ALTER TABLE..."`, обновить `schema.sql`

**Всегда после изменений:**
- `npm run build` — проверить frontend
- `cd backend && npx wrangler deploy --env staging` — протестировать backend
- Обновить этот файл + `logs/YYYY-MM.md`
