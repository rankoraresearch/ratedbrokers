# Backend — RatedBrokers API

## Статус: РАБОТАЕТ (31 марта 2026)

Worker задеплоен, custom domain `api.ratedbrokers.com` работает. Click tracking, admin panel, contact form — всё функционирует.

## Стек

| Компонент | Технология |
|-----------|-----------|
| Runtime | Cloudflare Workers (workerd) |
| БД | Cloudflare D1 (SQLite at edge) |
| Фреймворк | Нет — голый Workers fetch handler |
| Deploy | `wrangler deploy` (из `backend/`) |
| URL | `https://api.ratedbrokers.com` |

## Структура

```
backend/
├── wrangler.toml          — конфиг: name=ratedbrokers-api, D1 binding
├── schema.sql             — 4 таблицы (brokers, clicks, contacts, broker_changes)
├── seed.sql               — 38 брокеров (PLACEHOLDER ссылки)
├── .dev.vars              — API_KEY=dev-test-key (локально, в .gitignore)
├── package.json           — wrangler ^3.99.0
└── src/
    ├── index.js           — роутер (9 эндпоинтов)
    ├── routes/
    │   ├── redirect.js    — GET /go/:slug (affiliate redirect + click tracking)
    │   ├── stats.js       — GET /api/stats (JSON) + /api/stats/dashboard (HTML)
    │   ├── admin.js       — CRUD /api/admin/brokers + /api/admin/dashboard (HTML)
    │   └── contact.js     — POST /api/contact
    └── utils/
        ├── cors.js        — CORS whitelist (GET/POST/PUT/DELETE/OPTIONS)
        └── adminLayout.js — shared admin header/nav/language switcher
```

## База данных D1

### Таблица `brokers`
```sql
slug TEXT PRIMARY KEY, name TEXT NOT NULL, affiliate_url TEXT NOT NULL
```

### Таблица `clicks`
```sql
id INTEGER PK AUTOINCREMENT, broker_slug TEXT, referrer TEXT, country TEXT, user_agent TEXT, created_at TEXT
-- Индексы: idx_clicks_broker, idx_clicks_date
```

### Таблица `broker_changes`
```sql
id INTEGER PK AUTOINCREMENT, broker_slug TEXT, field TEXT, old_value TEXT, new_value TEXT, changed_at TEXT
```

### Таблица `contacts`
```sql
id INTEGER PK AUTOINCREMENT, name TEXT, email TEXT, message TEXT, created_at TEXT
```

## Эндпоинты

### 1. `GET /go/:slug` — Affiliate redirect
- 302 redirect → `affiliate_url` из D1
- Асинхронная запись клика (waitUntil)
- Fallback → `FRONTEND_URL` если slug не найден

### 2. `GET /api/stats` — JSON-аналитика (API key header)
### 3. `GET /api/stats/dashboard?key=` — Click Dashboard (HTML)
- Period selector: 7d/30d/90d
- Bar chart + doughnut chart (Chart.js)
- Таблицы: Top Brokers, Countries, Referrers, Live Feed

### 4. `GET /api/admin/brokers?key=` — JSON список брокеров
### 5. `PUT /api/admin/brokers/:slug?key=` — Обновить affiliate URL
### 6. `POST /api/admin/brokers?key=` — Создать брокера
### 7. `DELETE /api/admin/brokers/:slug?key=` — Удалить брокера
### 8. `GET /api/admin/dashboard?key=` — Affiliate Admin (HTML)
- Search, filters (All/Active/Placeholder), sort
- Inline edit, Test/Copy, bulk paste, audit log

### 9. `POST /api/contact` — Контактная форма

## Shared Admin Layout

`adminLayout.js` — единая шапка для обеих HTML-панелей:
- Sticky topbar: лого "Rated.Admin", навигация, language switcher
- NAV_ITEMS: Click Dashboard, Affiliate Links
- Languages: English (расширяемый)

## Секреты

- `API_KEY` — через `wrangler secret put API_KEY`
- Текущий ключ: `RRBwsQr2C177vhpmCLh/JH55RgwLdl6bvRrkRwo8DOA=`
- Локально: `.dev.vars` (в .gitignore)

## CORS

Whitelist: `https://ratedbrokers.com`, `localhost:*`
Methods: `GET, POST, PUT, DELETE, OPTIONS`

## Affiliate Tracking

Фронтенд использует `src/utils/visitUrl.js`:
```js
const apiBase = import.meta.env.VITE_API_URL || '';
export function getVisitUrl(slug, fallbackUrl) {
  if (apiBase) return `${apiBase}/go/${slug}`;
  return fallbackUrl || `https://ratedbrokers.com/go/${slug}`;
}
```

Все CTA на сайте проходят через `/go/{slug}` (21 ранее незатрекаемая ссылка исправлена 31.03.2026).
`rel="noopener nofollow sponsored"` на всех affiliate-ссылках.

## Скрипты

```bash
cd backend
npm run dev          # wrangler dev (локальный сервер)
npm run deploy       # wrangler deploy (на прод)
npm run db:init      # wrangler d1 execute --local --file=schema.sql
npm run db:seed      # wrangler d1 execute --local --file=seed.sql
```
