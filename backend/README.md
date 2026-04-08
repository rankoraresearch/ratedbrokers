# Backend — RatedBrokers API

Cloudflare Workers + D1 (SQLite on edge).  
Production: `https://api.ratedbrokers.com`  
Dev: `https://ratedbrokers-api.ratedbrokers.workers.dev`

---

## Deployment

```bash
cd backend
npx wrangler deploy --config wrangler.toml    # deploy to production
npx wrangler secret put API_KEY               # set admin API key
npx wrangler d1 execute ratedbrokers --remote --command "SQL"  # run SQL on production D1
```

Auto-deploy: push to `main` deploys frontend (Cloudflare Pages). Backend deploys manually via `wrangler deploy`.

## Environment

| Variable | Source | Description |
|----------|--------|-------------|
| `FRONTEND_URL` | wrangler.toml | `https://ratedbrokers.com` |
| `API_KEY` | wrangler secret | Admin panel access key |
| `TURNSTILE_SECRET` | wrangler secret | Cloudflare Turnstile CAPTCHA (optional, graceful skip) |
| `DB` | D1 binding | Database `ratedbrokers` (ID: `0583b2f5-...`) |

## Cron Jobs

| Schedule | Task |
|----------|------|
| `0 * * * *` (hourly) | Auto-publish scheduled pages from `page_publish` |
| Daily 06:00 UTC | Link health check — HEAD request to all affiliate URLs |

---

## API Endpoints

### Public (no auth)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/go/:slug` | Affiliate redirect + click tracking |
| POST | `/api/contact` | Contact form submission |
| GET | `/api/rankings/:id/order` | Public ranking order |
| GET | `/api/reviews/:slug/overrides` | Review content overrides for frontend merge. `?lang=en` |
| GET | `/api/publish/active` | List of published page slugs (5 min cache) |
| GET | `/api/sitemap.xml` | Sitemap index |
| GET | `/api/sitemap-{section}.xml` | Sub-sitemaps: reviews, rankings, subpages, static |

### Admin — Click Dashboard (`?key=API_KEY`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/stats/dashboard` | HTML dashboard with charts |
| GET | `/api/stats` | JSON stats (also accepts `X-API-Key` header) |

### Admin — Affiliate Links

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/dashboard` | HTML dashboard |
| GET | `/api/admin/brokers` | JSON list of all brokers |
| POST | `/api/admin/brokers` | Create broker `{slug, name, affiliate_url}` |
| PUT | `/api/admin/brokers/:slug` | Update broker `{affiliate_url, name?}` |
| DELETE | `/api/admin/brokers/:slug` | Delete broker |

### Admin — Ranking Manager

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/rankings/dashboard` | HTML dashboard with drag-drop editor |
| GET | `/api/admin/rankings/:id/brokers` | Brokers + overrides for ranking |
| PUT | `/api/admin/rankings/:id/order` | Save manual ranking order |
| DELETE | `/api/admin/rankings/:id/overrides` | Reset ranking to auto-calculated |

### Admin — Publication Planner

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/publish/dashboard` | HTML dashboard |
| GET | `/api/admin/publish/pages` | JSON pages list |
| PUT | `/api/admin/publish/pages/:slug` | Update page status |
| POST | `/api/admin/publish/batch` | Batch publish/schedule/unpublish |
| POST | `/api/admin/publish/auto-schedule` | Generate 16-week rollout plan |
| POST | `/api/admin/publish/tick` | Publish all due pages (≤ now) |

### Admin — Review Editor

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/reviews/dashboard` | HTML dashboard with Quill rich text editor. `?lang=en` |
| GET | `/api/admin/reviews/:slug/content` | All overrides for broker. `?lang=en` |
| PUT | `/api/admin/reviews/:slug/content` | Save section override `{section, content, edited_by}`. `?lang=en` |
| DELETE | `/api/admin/reviews/:slug/content/:section` | Revert section to original. `?lang=en` |
| GET | `/api/admin/reviews/log` | Recent edit audit log (last 100) |
| GET | `/api/admin/reviews/tokens` | List expert tokens |
| POST | `/api/admin/reviews/tokens` | Create token `{name, email?, lang?, broker_slugs?, expires_days?}` |
| DELETE | `/api/admin/reviews/tokens/:id` | Revoke expert token |

### Admin — Messages

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/messages/dashboard` | HTML dashboard |
| DELETE | `/api/admin/messages/:id` | Delete message |

### Admin — Link Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/linkhealth/dashboard` | HTML dashboard |
| POST | `/api/admin/linkhealth/recheck/:slug` | Re-check single affiliate link |

### Expert Access (`?token=EXPERT_TOKEN`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/expert/dashboard` | Simplified editor UI (Rated.Editor) |
| GET | `/api/expert/reviews/:slug` | Overrides for broker (respects token permissions) |
| PUT | `/api/expert/reviews/:slug` | Save section `{section, content}` |
| DELETE | `/api/expert/reviews/:slug/:section` | Revert section |

---

## D1 Database Schema

### Core

| Table | Purpose | Key |
|-------|---------|-----|
| `brokers` | Slug → affiliate URL mapping | `slug` PK |
| `clicks` | Click tracking (broker, country, referrer, source) | `id` AI |
| `contacts` | Contact form submissions | `id` AI |
| `broker_changes` | Audit log for affiliate URL/name changes | `id` AI |

### Rankings

| Table | Purpose | Key |
|-------|---------|-----|
| `ranking_overrides` | Manual broker positions in rankings | `(ranking_id, broker_slug)` PK |

### Publication

| Table | Purpose | Key |
|-------|---------|-----|
| `page_publish` | Publication status per page/lang | `(slug, lang)` PK |
| `publish_log` | Publication activity log | `id` AI |

### Link Health

| Table | Purpose | Key |
|-------|---------|-----|
| `link_checks` | Affiliate URL health checks | `id` AI |

### Review Editor

| Table | Purpose | Key |
|-------|---------|-----|
| `review_overrides` | Expert content edits (per broker × section × lang) | `UNIQUE(broker_slug, section, lang)` |
| `review_edit_log` | Audit trail for all content edits | `id` AI |
| `expert_tokens` | Access tokens for external experts | `token` UNIQUE |

---

## Route Files

| File | Sections | Endpoints |
|------|----------|-----------|
| `redirect.js` | Affiliate redirect | 1 |
| `stats.js` | Click Dashboard | 2 |
| `contact.js` | Contact form | 1 |
| `admin.js` | Affiliate Links | 5 |
| `rankings.js` | Ranking Manager | 5 |
| `publish.js` | Publication Planner + sitemaps | 10 |
| `reviews.js` | Review Editor + token management | 8 |
| `expert.js` | Expert access | 4 |
| `messages.js` | Messages | 2 |
| `linkhealth.js` | Link Health | 2 |

Shared layout: `utils/adminLayout.js` (header, nav, footer, CSS variables).  
CORS: `utils/cors.js`.
