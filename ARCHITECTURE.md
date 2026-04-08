# Architecture — RatedBrokers

Архитектура фронтенда, пайплайн данных, деплой.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + react-router-dom v7 |
| Styling | Inline CSS (`style={{}}`), единственный CSS: `index.css` |
| Icons | lucide-react |
| Search | fuse.js (client-side) |
| Hosting | Cloudflare Pages (auto-deploy from `main`) |
| Backend API | Cloudflare Workers + D1 SQLite |
| Domain | `ratedbrokers.com` (Cloudflare DNS) |

---

## Data Pipeline

```
content/brokers/*.md          ← Source of truth (YAML frontmatter + Markdown body)
        │
        ▼
scripts/validate-brokers.mjs  ← npm run brokers:validate
        │
        ▼
scripts/build-brokers.mjs     ← npm run brokers:build
        │
        ├──► src/data/brokers/*.js     ← Auto-generated JS (in .gitignore)
        ├──► src/data/brokers/index.js ← getBrokerData(), getAllBrokers(), etc.
        └──► public/data/broker-content.json ← Original content for admin editor
        │
        ▼
npm run build (vite build)    ← Bundles everything into dist/
        │
        ▼
Cloudflare Pages              ← Serves SPA + static assets
```

**Build command** (Cloudflare Pages): `npm run build`  
Внутри: `brokers:validate` → `brokers:build` → `vite build`

### Content Override Flow (Review Editor)

```
MD files (static, build-time)
        │
        ▼
BrokerReview.jsx loads data ──► Static JS content
        │
        ▼
useEffect fetch ──► api.ratedbrokers.com/api/reviews/:slug/overrides
        │
        ▼
Merge: static content + API overrides (HTML from Quill editor)
        │
        ▼
Render: plain text via <P> | HTML via dangerouslySetInnerHTML
```

Overrides хранятся в D1 (`review_overrides`), не в git. Graceful fallback: если API недоступен — показывается статика.

---

## Frontend Structure

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home.jsx` | Homepage — Top Rated Brokers grid |
| `/review/:slug` | `BrokerReview.jsx` | Broker review (main page) |
| `/review/:slug/:tab` | `SubPage.jsx` | 8 deep-dive tabs (fees, regulation, etc.) |
| `/best/:slug` | `RankingPage.jsx` | 293 thematic rankings |
| `/compare/:pair` | `ComparePage.jsx` | Broker comparisons |
| `/all-reviews` | `AllReviewsPage.jsx` | Catalog of all broker reviews |
| `/all-rankings` | `AllRankingsPage.jsx` | Catalog of all rankings |
| `/country/:slug` | `CountryPage.jsx` | Country-specific broker recommendations |
| `/forex-brokers` | `CategoryHubPage.jsx` | Category hub (Forex, Stocks, etc.) |
| `/guide/:slug` | `GuidePage.jsx` | Educational guides |
| `/regulator/:slug` | `RegulatorPage.jsx` | Regulator detail pages |
| `/platform/:slug` | `PlatformPage.jsx` | Trading platform pages |
| `/author/:id` | `AuthorPage.jsx` | Author bio + articles |
| `/methodology` | `MethodologyPage.jsx` | Scoring methodology |
| `/find-your-broker` | `QuizPage.jsx` | 6-step broker matching quiz |
| `/trust-score` | `TrustScorePage.jsx` | Trust score explanation |
| `/about` | `AboutPage.jsx` | About us |
| `/contact` | `ContactPage.jsx` | Contact form (Turnstile CAPTCHA) |

### Data Files

| Directory | Content |
|-----------|---------|
| `content/brokers/*.md` | 52 broker YAML+MD source files |
| `src/data/brokers/` | Auto-generated JS (gitignored) |
| `src/data/rankings.js` | 293 ranking definitions |
| `src/data/rankingFilters.js` | Filter functions for broker ranking |
| `src/data/rankingSeoContent.js` | SEO content templates for rankings |
| `src/data/combinatorialRankings.js` | 240 country × type combinations |
| `src/data/authors.js` | 26 expert authors |
| `src/data/countries.js` | 43 countries |
| `src/data/guides.js` | 25 guides |
| `src/data/comparisons.js` | Broker comparison pairs |
| `backend/src/data/broker-content.json` | Original content for admin editor (protected, not public) |

### Key Components

| Component | Purpose |
|-----------|---------|
| `BrokerRankCard.jsx` | Broker card in rankings (dual CTA, expandable) |
| `BrokerLogo.jsx` | Square logo renderer |
| `HeroBand.jsx` | Gradient hero band (navy→green) |
| `Breadcrumb.jsx` | Breadcrumb + JSON-LD BreadcrumbList |
| `AuthorCredits.jsx` | Written By / Reviewed By / Fact Checked By |
| `ScoreBadge.jsx` | Gradient score badge (Variant F) |
| `RegBadge.jsx` | Regulator tier badge |

---

## Deployment

### Frontend (Cloudflare Pages)

```
git push origin main → Cloudflare Pages auto-build → live at ratedbrokers.com
```

Build command: `npm run build`  
Output: `dist/`  
SPA fallback: все пути → `index.html`  
Code splitting: `React.lazy()` + `Suspense` — каждая страница в отдельном chunk

### Backend (Cloudflare Workers)

```bash
cd backend
npx wrangler deploy --config wrangler.toml
```

Manual deploy. API available at `api.ratedbrokers.com`.  
Smart Placement enabled — Workers run close to D1 for faster queries.  
Staging: `npx wrangler deploy --env staging`

### D1 Migrations

```bash
cd backend
npx wrangler d1 execute ratedbrokers --remote --command "SQL_HERE"
```

Schema: `backend/schema.sql` (11 таблиц).

---

## Affiliate Tracking

Все CTA ведут через бэкенд `/go/{slug}` для трекинга.

```jsx
const apiBase = import.meta.env.VITE_API_URL || '';
const visitUrl = apiBase ? `${apiBase}/go/${slug}` : B.url;
```

Утилита: `src/utils/visitUrl.js` — единый хелпер `getVisitUrl(slug, fallbackUrl)`.

---

## SEO

- **JSON-LD** на каждой странице: Review, FAQPage, BreadcrumbList, ItemList, Person
- **Robots:** Сайт закрыт (`robots.txt: Disallow: /`, `<meta noindex>`)
- **Sitemap:** Динамическая через API (`/api/sitemap.xml`) из published-страниц
- **Программатический SEO:** 293 рейтингов + 266 комбинаторных + 8 хабов

---

## Related Docs

| File | Content |
|------|---------|
| [`IMPROVEMENTS.md`](IMPROVEMENTS.md) | Improvement tracker: done + planned, Frontend/Backend/Admin relationships |
| [`backend/README.md`](backend/README.md) | Full API reference, DB schema, deployment |
| [`ADMIN-GUIDE.md`](ADMIN-GUIDE.md) | Admin panel — 7 sections guide |
| [`REVIEW-EDITOR-GUIDE.md`](REVIEW-EDITOR-GUIDE.md) | Review Editor instructions (EN/RU) |
| [`DECISIONS.md`](DECISIONS.md) | Technology decisions and rationale |
| [`PROJECT.md`](PROJECT.md) | Project overview and goals |
| [`content/README.md`](content/README.md) | Broker MD file format |
| [`agents/README.md`](agents/README.md) | AI agents (John, Bob, Leo, Barbara, Bill) |
| [`BROKER-TYPES.md`](BROKER-TYPES.md) | Broker type differences |
| [`MILESTONES.md`](MILESTONES.md) | Roadmap |
