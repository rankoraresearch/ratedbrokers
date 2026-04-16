# Editorial Activity Log — Architecture

Дата: 2026-04-16
Статус: Спецификация (не реализовано)
Автор брифа: Егор + Барбара (concept Author Page A)
Связано: `/proto/author` (Variant A — "Recent activity by …" блок), backend Publish admin

---

## 1. Зачем это нужно

Каждое ревью брокера и тематический рейтинг периодически **переподтверждаются**:
- writer обновляет цифры/контент
- reviewer (старший аналитик) делает методологическое ревью
- fact-checker сверяет данные с реестрами регуляторов / сайтами брокеров

Сейчас:
- `published_at` в `page_publish` фиксирует **только** первую публикацию.
- Нет различия между «обновил автор», «прошёл ревью», «прошёл фактчек».
- Страница автора `/author/:slug` не показывает, *что* и *когда* конкретный человек последний раз трогал.

Цель: иметь **журнал событий** — кто, какую страницу, в какой роли, когда переподтверждал. Это:
- E-E-A-T сигнал: «эта страница факт-чекалась 6 дней назад» в карточке ревью брокера.
- Жильё для блока **Recent activity by [author]** на странице автора.
- Вход в Publication Planner: статус «требует ревью каждые N дней» → автогенерация задач.

---

## 2. Источник правды — Hybrid

| Слой | Где | Что хранит | Меняется как |
|---|---|---|---|
| **Bindings** | MD frontmatter (`content/brokers/{slug}.md`, `src/data/rankingThematic.js` и т.д.) | Кто текущий writer/reviewer/factChecker для этой страницы | Редко, через PR в репо |
| **Events** | D1 `editorial_actions` | Журнал каждого «прошёл проверку» — кто, когда, какая роль | Часто, через админ-панель Publish |

Почему гибрид: bindings важны для git-истории и SSR (autora-byline должен быть в HTML). Events меняются часто и не должны требовать redeploy.

---

## 3. Расширение MD frontmatter

### 3.1 Ревью брокеров — `content/brokers/*.md`

Добавить блок `editorial:` к существующему frontmatter:

```yaml
---
slug: ic-markets
name: IC Markets
# … existing fields …
editorial:
  writer: marcus-chen
  reviewer: elena-petrova
  factChecker: david-kowalski
  reviewCadenceDays: 90      # как часто требуется новое ревью
  factCheckCadenceDays: 30   # как часто фактчек
---
```

### 3.2 Тематические рейтинги

Сейчас рейтинги генерируются из `src/data/rankings.js` + `categoryHubs.js`. Добавить параллельный файл `src/data/rankingEditorial.js`:

```js
export const RANKING_EDITORIAL = {
  "best-ecn-brokers": {
    writer: "marcus-chen",
    reviewer: "elena-petrova",
    factChecker: "david-kowalski",
    reviewCadenceDays: 60,
    factCheckCadenceDays: 30,
  },
  // … 293 рейтинга
};
```

При билде эти данные мёрджатся в финальный `rankings.js` для фронта.

---

## 4. D1 Schema — `editorial_actions`

```sql
CREATE TABLE IF NOT EXISTS editorial_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_slug TEXT NOT NULL,                     -- 'ic-markets' OR 'best-ecn-brokers'
  page_type TEXT NOT NULL,                     -- 'review' | 'ranking'
  page_title TEXT NOT NULL,                    -- denormalized for fast feed render
  page_url  TEXT NOT NULL,                     -- '/reviews/ic-markets'
  author_id TEXT NOT NULL,                     -- 'marcus-chen'
  role TEXT NOT NULL CHECK(role IN ('writer','reviewer','fact-checker')),
  acted_at TEXT NOT NULL,                      -- ISO date 'YYYY-MM-DD' (event date, not insert time)
  note TEXT,                                   -- optional comment from admin
  created_at TEXT DEFAULT (datetime('now'))    -- DB insert timestamp
);

CREATE INDEX IF NOT EXISTS idx_ea_author_date ON editorial_actions(author_id, acted_at DESC);
CREATE INDEX IF NOT EXISTS idx_ea_page_date ON editorial_actions(page_slug, acted_at DESC);
CREATE INDEX IF NOT EXISTS idx_ea_role_date ON editorial_actions(role, acted_at DESC);
```

**Правила:**
- Один автор может иметь несколько строк по одной странице (например, Marcus писал в Apr и фактчекал в May — две строки).
- `acted_at` — это **дата события** (когда автор реально проверил), не дата записи. Админ может задать backdate.
- `note` опциональна: «Updated leverage table after ESMA change».

---

## 5. Backend API

### 5.1 Public (фронт)

```
GET /api/authors/:id/activity?limit=10
→ {
    items: [
      { date: "2026-04-13", role: "writer", page_type: "review",
        title: "IC Markets Review 2026", url: "/reviews/ic-markets" },
      …
    ],
    counts: { writer: 87, reviewer: 12, "fact-checker": 4 },
    last_activity: "2026-04-13"
  }
```
Cache: 5 минут (Cloudflare cache API).

```
GET /api/pages/:slug/editorial
→ {
    bindings: { writer: "marcus-chen", reviewer: "elena-petrova", factChecker: "david-kowalski" },
    last: {
      writer:        { author: "marcus-chen", date: "2026-04-13" },
      reviewer:      { author: "elena-petrova", date: "2026-04-12" },
      "fact-checker":{ author: "david-kowalski", date: "2026-04-10" }
    },
    next_review_due:    "2026-07-12",  // computed from cadence
    next_factcheck_due: "2026-05-10"
  }
```
Используется в карточке ревью брокера: «Last fact-checked Apr 10, 2026 by David Kowalski, CAMS».

### 5.2 Admin (защищены `X-Admin-Key`)

```
POST /api/admin/editorial/log
body: { page_slug, page_type, author_id, role, acted_at?, note? }
→ INSERT INTO editorial_actions
```

```
POST /api/admin/editorial/log-bulk
body: { page_slugs: [...], author_id, role, acted_at, note? }
→ N rows INSERT в одной транзакции
(use case: "Marcus прошёл по 12 forex-ревью за день — отметить все")
```

```
GET /api/admin/editorial/recent?limit=50
→ последние действия для admin Activity Log таба
```

```
GET /api/admin/editorial/due?role=reviewer
→ страницы где `next_review_due <= today`
(use case: dashboard "что просрочено")
```

---

## 6. Admin Publish — UI расширение

В существующей админке `/admin/publish` (см. `[[backend]]` в memory) добавить:

### 6.1 Per-row action menu
В таблице страниц рядом с каждой — выпадающее меню:

```
[ Mark as ▼ ]
  ─ Wrote (today)        → POST log {role: writer}
  ─ Reviewed (today)     → POST log {role: reviewer}
  ─ Fact-checked (today) → POST log {role: fact-checker}
  ─ Custom date…         → modal с date picker + author picker + note
```

Авто-подставляется логин админа как `author_id` (или прикрепить editor через session).

### 6.2 Bulk action panel
Чекбоксы на страницах + bulk-bar внизу:

```
[ 12 selected ]   [Mark as Reviewed by ▼ Elena ▼ Today ▼]   [Apply]
```

### 6.3 Новый таб «Editorial Activity»
Лента всех editorial_actions, фильтры по author / role / page_type / date range. Это и админский audit log, и витрина «когда что обновлялось».

### 6.4 «Due for review» dashboard
Виджет на главной admin страницы: «X страниц просрочены на ревью / Y на фактчек». Клик → список → bulk «Reviewed today by [me]».

---

## 7. Frontend интеграция

### 7.1 Author page `/author/:slug`
- На mount: `fetch('/api/authors/' + id + '/activity?limit=10')`.
- Рендерится в блок **Recent activity by [Name]** (см. `/proto/author` Variant A → `ActivityFeedSection`).
- Trust Ribbon: `LAST UPDATE` = `last_activity` из API.
- Если `loading` — skeleton-rows.
- Если 0 событий — placeholder «No editorial activity logged yet».

### 7.2 Карточка ревью брокера `/reviews/:slug`
В sidebar / hero footer — строка:
```
Reviewed by Marcus Chen, CMT · Last fact-checked Apr 10, 2026 by David Kowalski, CAMS
```
Дата кликабельна → tooltip с историей последних 3 действий по странице.

### 7.3 Тематический рейтинг `/best-{...}`
То же — meta-строка под H1.

---

## 8. Schema.org обновление

В JSON-LD для каждого review/ranking добавить `dateModified` = max(acted_at) по этой странице. Это **критичный** SEO-сигнал свежести (Google смотрит на `dateModified` для запросов с временным intent: "best forex brokers 2026").

```json
{
  "@type": "Article",
  "datePublished": "2026-01-15",
  "dateModified": "2026-04-13",   ← из editorial_actions max(acted_at)
  "author": { "@id": "https://ratedbrokers.com/author/marcus-chen#person" },
  "reviewedBy": { "@id": "https://ratedbrokers.com/author/elena-petrova#person" }
}
```

---

## 9. Миграционный план

| Спринт | Задача |
|---|---|
| 1 | D1 миграция: создать `editorial_actions` + индексы. Бэкап текущей БД. |
| 2 | Backend API: 5 endpoints (log, log-bulk, recent, due, public/activity, public/page-editorial). |
| 3 | MD frontmatter: добавить `editorial:` блок в 38 broker MD + создать `rankingEditorial.js`. Скрипт seed: импортировать defaults в `editorial_actions` как первое событие (writer, дата = published_at). |
| 4 | Admin UI: per-row menu + bulk panel в `/admin/publish`. |
| 5 | Admin UI: новый таб `/admin/editorial-activity`. |
| 6 | Frontend: AuthorPage feed + Trust Ribbon date. |
| 7 | Frontend: Last-checked meta-строка на review/ranking страницах + JSON-LD `dateModified`. |
| 8 | Cron task: `/api/admin/editorial/cron-check-due` ежедневно 09:00 UTC — emails «X страниц просрочены». |

Итого ~12-15 часов работы (без UX-полиша).

---

## 10. Открытые вопросы

1. **Cadence per page или per page-type?** Сейчас в спеке per-page (поле в MD). Альтернатива: дефолты по типу (review = 90/30, ranking = 60/30) + override per-page. Дефолты + override вернее.
2. **Backdating** — разрешить отметить событие задним числом (admin кейс: «забыл залогать, на самом деле был Apr 5»)? Да.
3. **Author authentication** — сейчас admin = один API-key. Нужно ли вводить отдельные логины для авторов (Marcus залогинен как Marcus, не может отметить от имени Elena)? Для V1 — нет, доверяем admin-у. В V2 — добавить multi-user.
4. **Visible на review-странице** — в hero или в sidebar? В hero — больше доверия, в sidebar — не отвлекает. Default: sidebar (как у ForexBrokers.com).
5. **Когда писать дефолтные binding-ы для существующих 38 ревью?** Сейчас все мапятся на Marcus (RANKING_CATEGORY_AUTHORS). Нужно ручное распределение: writer/reviewer/factChecker per page. Это отдельная сессия с Егором.
6. **Как поступать с фиктивными авторами (Marcus/Sarah/Elena/David)?** Пока остаются, но при замене на реальных из `authors_sprint` — events перевязать через миграцию `UPDATE editorial_actions SET author_id = …`.

---

## Связи

- Frontend proto: `src/pages/AuthorProto.jsx` → Variant A → `ActivityFeedSection`
- Existing schema: `backend/schema.sql` → `page_publish`, `publish_log`
- Memory: `[[backend]]`, `[[review-editor]]`, `editorial-teams-research`
- Decision pending: Егор → подтверждение Hybrid (опция A в обсуждении 2026-04-16)
