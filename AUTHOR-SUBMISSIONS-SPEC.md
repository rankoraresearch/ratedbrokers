# AUTHOR SUBMISSIONS — Architecture Spec

**Статус:** Sprint 1 deliverable, 2026-04-18. Реализация начинается после approve Егора.

**Область:** приём сырых текстов от живых (не-AI) авторов, которые затем обрабатываются Клодом и публикуются на сайте.

---

## 1. Контекст и ограничения

### Что уже есть в проде
| Компонент | Назначение | Переиспользуем? |
|-----------|------------|-----------------|
| `expert_tokens` (D1) | Per-person токены для редакторов-экспертов (`name`, `email`, `lang`, `broker_slugs`, `active`, `expires_at`) | **Да** — расширяем колонками `role`, `scopes_json` |
| `review_overrides` (D1) | Контент ревью per `(broker, section, lang)` | **Да** — финальный результат обработки сабмита |
| `review_edit_log` (D1) | Аудит правок ревью | **Да** — пишем сюда при Import processed |
| `/api/expert/dashboard` + `expert.js` | HTML-портал для экспертов с токеном | **Паттерн** — копируем архитектурно для Author Portal |
| `adminLayout.js` (NAV_ITEMS) | Топбар админки — сейчас 9 табов (Click / Affiliate / Rankings / Publish / Reviews / Messages / Link Health / Donors / Authors-outreach) | **Да** — добавим **10-й** под именем `Submissions` (не путать с existing «Authors», который = outreach-карта конкурентов) |
| `checkAuth` (`auth.js`) | Admin API key | **Да** — для admin-стороны эндпоинтов |

### Чего нет
- Таблицы для raw-сабмишенов (текст до обработки)
- Хранилища для ranking SEO content (intro/outro/FAQ) — сейчас JS-файл `rankingSeoContent.js` импортится фронтом статически
- Per-card описаний в рейтинге — в `ranking_overrides` есть `notes` (admin-only), но не `description_md` для публикации
- Role-модели: `checkAuth` бинарный (admin key / no)
- Email-рассылки invite: шлём link сами (Egor копипастит автору)

---

## 2. Use cases

### 2.1 Автор ревью брокера
- Получает от Егора ссылку `https://ratedbrokers.com/author?token=abc...`
- Выбирает брокера (из разрешённых в scopes) → пишет большой текст ревью (один сабмит = всё ревью целиком ИЛИ одна секция)
- Сабмитит → ждёт принятия
- Видит статус, может читать admin-notes

### 2.2 Автор тематических рейтингов
- Пишет SEO-текст для конкретного рейтинга (`best-forex-brokers-uk`):
  - Intro (несколько параграфов перед таблицей)
  - Key Finding (1 параграф)
  - How We Ranked (1 параграф)
  - FAQ (N пар вопрос-ответ)
  - Outro (несколько параграфов после таблицы) — сейчас в proto, добавим
- Или пишет per-broker card description (короткий текст под именем брокера в карточке рейтинга)

### 2.3 Админ (Егор)
- Создаёт автора: имя, email, scopes (какие брокеры/рейтинги он может писать), role=`author`
- Копирует magic-link автору
- Видит pipeline всех сабмитов, принимает/отклоняет
- Триггерит «Import to Review Editor» или «Import to Ranking Content» → Клод (или вручную) режет текст и льёт в соответствующую таблицу

---

## 3. Data model (D1)

### 3.1 ALTER `expert_tokens` → supports `author` role
```sql
ALTER TABLE expert_tokens ADD COLUMN role TEXT NOT NULL DEFAULT 'expert';
-- role ∈ ('expert', 'author', 'admin')
ALTER TABLE expert_tokens ADD COLUMN scopes_json TEXT;
-- JSON: {"reviews":["*"]|["slug1","slug2"], "rankings":["*"]|[...], "cards":["*"]|[...]}
-- NULL = (legacy expert) — доступно только старое поле broker_slugs
```

### 3.2 Новая `content_submissions`
```sql
CREATE TABLE IF NOT EXISTS content_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,              -- FK expert_tokens.id
  target_type TEXT NOT NULL,               -- 'review' | 'ranking' | 'card'
  target_slug TEXT NOT NULL,               -- broker_slug (review) | ranking_id (ranking/card)
  target_section TEXT,                     -- review section key (overview, costs, ...) — NULL если весь review целиком
  target_ranking_broker TEXT,              -- only for target_type='card' — broker_slug внутри ranking
  lang TEXT NOT NULL DEFAULT 'en',
  title TEXT,                              -- optional автором
  body_md TEXT NOT NULL,                   -- raw Markdown, санитизированный
  word_count INTEGER,                      -- computed on save
  status TEXT NOT NULL DEFAULT 'draft',
  -- status ∈ ('draft','submitted','needs_changes','accepted','rejected','processed','published','reverted')
  admin_notes TEXT,                        -- видно автору — "please expand costs section"
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  submitted_at TEXT,
  accepted_at TEXT,
  processed_at TEXT,
  published_at TEXT,
  rejected_at TEXT,
  reverted_at TEXT,
  FOREIGN KEY (author_id) REFERENCES expert_tokens(id)
);
CREATE INDEX IF NOT EXISTS idx_cs_author ON content_submissions(author_id);
CREATE INDEX IF NOT EXISTS idx_cs_status ON content_submissions(status);
CREATE INDEX IF NOT EXISTS idx_cs_target ON content_submissions(target_type, target_slug);
```

### 3.2a Новая `submission_imports` — child-table для multi-row импортов
Одна сабмиссия может породить N записей в destination-таблицах (напр., автор прислал всё ревью → режем на 15 секций → 15 строк в `review_overrides`). Поэтому ссылки на destination храним в child-таблице, не одним `processed_ref`.
```sql
CREATE TABLE IF NOT EXISTS submission_imports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  destination_type TEXT NOT NULL,          -- 'review_override' | 'ranking_content' | 'ranking_card'
  destination_ref TEXT NOT NULL,           -- "ic-markets:costs:en" | "best-forex-brokers-uk:en" | "best-forex-brokers-uk:ic-markets:en"
  imported_at TEXT DEFAULT (datetime('now')),
  imported_by TEXT NOT NULL,               -- admin id / 'admin'
  FOREIGN KEY (submission_id) REFERENCES content_submissions(id)
);
CREATE INDEX IF NOT EXISTS idx_si_submission ON submission_imports(submission_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_si_dest_unique
  ON submission_imports(submission_id, destination_type, destination_ref);
```
Уникальный индекс → защита от двойного «Import» (idempotent admin action).

### 3.3 Новая `submission_events` — audit timeline
```sql
CREATE TABLE IF NOT EXISTS submission_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  actor_type TEXT NOT NULL,                -- 'author' | 'admin' | 'system'
  actor_id INTEGER,                        -- author_id or admin (NULL)
  event TEXT NOT NULL,
  -- event ∈ ('created','edited','submitted','accepted','rejected','needs_changes','processed','published','reverted')
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (submission_id) REFERENCES content_submissions(id)
);
CREATE INDEX IF NOT EXISTS idx_se_submission ON submission_events(submission_id);
```

### 3.4 Новая `ranking_content` — D1-хранилище для SEO-блоков рейтинга
Все SEO-поля, которые сейчас генерятся шаблонами в `rankingSeoContent.js`, с двумя parallel-слотами: **draft** (автор/редактор правит) и **published** (видит фронт). Это и есть «publish-gating» для ranking-контента.

```sql
CREATE TABLE IF NOT EXISTS ranking_content (
  ranking_id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  -- Draft slot (edited, not yet live)
  meta_title_draft TEXT,
  meta_desc_draft TEXT,
  intro_md_draft TEXT,
  key_finding_draft TEXT,
  how_we_ranked_draft TEXT,
  outro_md_draft TEXT,
  faq_json_draft TEXT,                     -- JSON array [{q, a}, ...]
  -- Published slot (live on site)
  meta_title TEXT,
  meta_desc TEXT,
  intro_md TEXT,
  key_finding TEXT,
  how_we_ranked TEXT,
  outro_md TEXT,
  faq_json TEXT,
  -- Metadata
  updated_by TEXT NOT NULL DEFAULT 'admin',
  draft_updated_at TEXT,
  published_at TEXT,                       -- NULL = not yet published
  PRIMARY KEY (ranking_id, lang)
);
CREATE INDEX IF NOT EXISTS idx_rc_published ON ranking_content(published_at);
```

**Fallback cascade** в `RankingPage.jsx`:
1. Если есть non-NULL published-поле в `ranking_content` → использовать его
2. Иначе → fallback на сгенерированный `rankingSeoContent.js`

Public endpoint `GET /api/rankings/:id/content` возвращает ТОЛЬКО published-поля (не draft).

### 3.5 ALTER `ranking_overrides` — описание карточки с publish-gating
```sql
ALTER TABLE ranking_overrides ADD COLUMN description_md_draft TEXT;    -- автор сабмитит сюда
ALTER TABLE ranking_overrides ADD COLUMN description_md TEXT;           -- live на сайте
ALTER TABLE ranking_overrides ADD COLUMN description_lang TEXT NOT NULL DEFAULT 'en';
ALTER TABLE ranking_overrides ADD COLUMN description_published_at TEXT; -- NULL = draft only
```
Frontend в `BrokerRankCard.jsx` рендерит `description_md` только если `description_published_at IS NOT NULL`.

### 3.6 Publish gating для `review_overrides` (уже существует)
Существующая колонка `review_overrides.status DEFAULT 'published'` даёт готовый механизм publish-gating. При import-to-review от Claude-обработки:
- Первая запись создаётся с `status='draft'` (невидима на фронте)
- Админ → «Mark Published» → `UPDATE review_overrides SET status='published' WHERE ...`
- Public endpoint `handleReviewOverridesPublic` уже фильтрует `WHERE status='published'` (проверено в коде)

Никаких ALTER на эту таблицу не нужно.

### 3.7 Size limits
- `body_md` ≤ 100 KB (на автора = одна секция или одно ревью; если сильно длиннее — режем на подачи)
- `admin_notes` ≤ 4 KB
- `title` ≤ 200 chars
- `scopes_json` ≤ 8 KB

---

## 4. Status workflow (state machine)

```
     ┌─ author ─────────────────────┐
     │                              │
draft ──submit──▶ submitted ──accept──▶ accepted ──process──▶ processed ──publish──▶ published
     │              │    │                  │
     │              │    └──needs_changes──▶ needs_changes ──(author edits)──▶ submitted
     │              │
     │              └──reject──▶ rejected (terminal)
     │
     └──(delete)──▶ (gone)

(processed | published) ──revert──▶ reverted (admin emergency; clears live-slot only, drafts preserved)
```

**Семантика статусов:**
- `draft` / `submitted` / `needs_changes` / `rejected` — контент НЕ в destination-таблицах
- `accepted` — принят админом, но ещё не обработан (Claude-cut)
- `processed` — обработан и записан в destination (`review_overrides.status='draft'` ИЛИ `ranking_content.*_draft` ИЛИ `ranking_overrides.description_md_draft`) — НЕ виден на фронте
- `published` — destination переведён в live-слот (`review_overrides.status='published'` / `ranking_content.published_at` set / `ranking_overrides.description_published_at` set) — виден на фронте
- `reverted` — live-слот очищен согласно правилам в §6.2 (для `review_overrides` → `status='draft'`; для `ranking_content` → обнуляются live-поля + `published_at=NULL`; для `ranking_card` → обнуляются `description_md` + `description_published_at`). **Draft-слоты сохраняются** — форензика/возможность re-publish

**Разрешения и транзиционные guard'ы (SQL):**
| Переход | Кто | Guard (atomic compare-and-swap) |
|---------|-----|---------|
| create → draft | author | — |
| draft → submitted | author | `UPDATE ... WHERE id=? AND author_id=? AND status='draft'` |
| submitted → accepted/rejected/needs_changes | admin | `UPDATE ... WHERE id=? AND status='submitted'` (через `PATCH /status`) |
| needs_changes → submitted | author | `UPDATE ... WHERE id=? AND author_id=? AND status='needs_changes'` |
| accepted → processed | admin | **НЕ через `PATCH /status`** — только через `POST /import-to-{review,ranking,card}` (batch: CAS + destination INSERT + submission_imports + events) |
| processed → published | admin | **НЕ через `PATCH /status`** — только через `POST /publish` (batch: CAS + flip live-slot на всех записях из `submission_imports`) |
| * → reverted | admin | **НЕ через `PATCH /status`** — только через `POST /revert` (batch: CAS + clear live-slot) |

CAS-guard защищает от race conditions (двойной accept, двойной publish одной сабмиссии).

**Автор не может:** менять submitted/accepted/processed/published/rejected/reverted. Может удалить только draft. DELETE-endpoint проверяет `WHERE id=? AND author_id=? AND status='draft'`.

---

## 5. Scope model

Scopes хранятся как `JSON` в `expert_tokens.scopes_json`. Card-scope двухмерный (ranking × broker) — ranking-scope НЕ даёт автоматически доступ к card-блокам внутри этого ranking.

```json
{
  "reviews": ["*"],
  "rankings": ["best-forex-brokers-uk", "best-forex-brokers-au"],
  "cards": ["best-forex-brokers-uk:ic-markets", "best-forex-brokers-uk:etoro"],
  "langs": ["en"]
}
```

- `reviews`, `rankings`: список slug'ов или `["*"]` = все в категории
- `cards`: список `"<ranking_id>:<broker_slug>"` или `["*"]` = любые карточки. Wildcard-per-ranking: `"best-forex-brokers-uk:*"` = все карточки в одном конкретном рейтинге
- Пустой массив или отсутствие ключа = запрещено в этой категории
- `langs` ограничивает, на каких языках автор может писать

**Enforcement** в `POST /api/author/submissions` и `PATCH /api/author/submissions/:id`:
- Все запросы проходят через `requireAuthor(request, env)` → `{id, scopes, role}`
- `target_type='review'` → check `scopes.reviews` содержит `target_slug` или `"*"`
- `target_type='ranking'` → check `scopes.rankings` содержит `target_slug` или `"*"`
- `target_type='card'` → `target_ranking_broker` **обязателен** (400 если NULL); check `scopes.cards` содержит `"<target_slug>:<target_ranking_broker>"`, `"<target_slug>:*"`, или `"*"`
- `lang` ∈ `scopes.langs` (fallback `["en"]` если не задан)

**Ownership enforcement** на каждом `:id`-endpoint:
- `GET /api/author/submissions/:id` → `WHERE id=? AND author_id=?`
- `PATCH /api/author/submissions/:id` → same
- `DELETE /api/author/submissions/:id` → same + status='draft'
- Автор НЕ может читать сабмиты других авторов даже в read-only

---

## 6. API endpoints

### 6.1 Author-side (требует `?token=` или `Authorization: Bearer`)
| Method | Path | Описание |
|--------|------|----------|
| GET | `/api/author/me` | Профиль + scopes |
| GET | `/api/author/targets` | Доступные цели из scopes. **Reviews** раскрываются server-side до `[{slug,name}]` из D1 brokers. **Rankings/cards** возвращаются как scope entries (`{id,wildcard}` / `{ranking_id,broker_slug,wildcard}`) — frontend hydrates display names из bundled `src/data/rankings.js`. Также возвращает `sections`, `target_types`, `langs` |
| GET | `/api/author/submissions?status=&type=` | Список своих |
| POST | `/api/author/submissions` | Создать draft |
| GET | `/api/author/submissions/:id` | Один + timeline |
| PATCH | `/api/author/submissions/:id` | Обновить draft или submit |
| DELETE | `/api/author/submissions/:id` | Удалить draft |

### 6.2 Admin-side (требует `?key=` или `Authorization: Bearer admin-key`)

Два типа операций: **review-decision** (лёгкие, без side effects) и **side-effect** (импорт в destination / publish / revert — атомарно меняют и submission status, и destination-таблицу).

| Method | Path | Тип | Описание |
|--------|------|-----|----------|
| GET | `/api/admin/submissions/dashboard` | — | HTML |
| GET | `/api/admin/submissions` | — | JSON list с фильтрами |
| GET | `/api/admin/submissions/:id` | — | Detail JSON (+ submission_imports list) |
| PATCH | `/api/admin/submissions/:id/status` | review-decision | **Только `accepted` / `rejected` / `needs_changes`** — лёгкий pass/fail. CAS: `WHERE id=? AND status='submitted'`. Возвращает 409 если нет матча. Статусы `processed` / `published` / `reverted` через этот endpoint **запрещены** (400) |
| POST | `/api/admin/submissions/:id/import-to-review` | side-effect | В одной D1 batch-транзакции: CAS `submission.status='accepted'` → `processed`; INSERT в `review_overrides` c `status='draft'` (для каждой обработанной секции); INSERT в `submission_imports`; INSERT в `submission_events` |
| POST | `/api/admin/submissions/:id/import-to-ranking` | side-effect | Batch: CAS → `processed`; UPSERT в `ranking_content.*_draft` (seven draft-slot columns); INSERT в `submission_imports`; INSERT event |
| POST | `/api/admin/submissions/:id/import-to-card` | side-effect | Batch: CAS → `processed`; UPSERT в `ranking_overrides.description_md_draft` (**только draft, не live**); INSERT в `submission_imports`; INSERT event |
| POST | `/api/admin/submissions/:id/publish` | side-effect | Batch: CAS `submission.status='processed'` → `published` c `published_at=now`; для каждой записи в `submission_imports`: flip destination draft-slot → live-slot (`review_overrides.status='published'`, `ranking_content.<field>=<field>_draft` + `published_at=now`, `ranking_overrides.description_md=description_md_draft` + `description_published_at=now`); INSERT event |
| POST | `/api/admin/submissions/:id/revert` | side-effect | Batch: CAS `submission.status IN ('processed','published')` → `reverted` c `reverted_at=now`; для каждой записи в `submission_imports` **очищаем live-slot, draft НЕ трогаем** (draft остаётся как форензик/re-publish): для `review_override` → `UPDATE review_overrides SET status='draft' WHERE broker_slug=? AND section=? AND lang=?`; для `ranking_content` → `UPDATE ranking_content SET meta_title=NULL, meta_desc=NULL, intro_md=NULL, key_finding=NULL, how_we_ranked=NULL, outro_md=NULL, faq_json=NULL, published_at=NULL WHERE ranking_id=? AND lang=?`; для `ranking_card` → `UPDATE ranking_overrides SET description_md=NULL, description_published_at=NULL WHERE ranking_id=? AND broker_slug=?`; INSERT event |
| GET | `/api/admin/submissions/export.csv` | — | CSV для оплаты авторам |
| POST | `/api/admin/authors/invite` | — | Создать author-токен |
| GET | `/api/admin/authors` | — | Список авторов/экспертов |
| PATCH | `/api/admin/authors/:id` | — | Revoke / update scopes |

**Инвариант:** submission.status меняется на `processed/published/reverted` ТОЛЬКО через side-effect endpoints, которые атомарно изменяют destination. Прямой PATCH status в эти состояния запрещён — устраняется рассинхрон "status=published, но destination всё ещё draft".

### 6.3 Public (для фронта)
| Method | Path | Cache |
|--------|------|-------|
| GET | `/api/rankings/:id/content?lang=en` | 5 min |

---

## 7. UX flow

### 7.1 Author login
1. Егор создаёт автора → получает ссылку `https://ratedbrokers.com/author?token=abc...`
2. Отправляет автору (email/Slack/whatever — вне системы)
3. Автор открывает ссылку → `AuthorPortalLogin.jsx` парсит `?token=`, сохраняет в `localStorage.rb_author_token`, редиректит на `/author/portal`
4. Повторные визиты с того же устройства — без токена в URL

### 7.2 Author Portal
- Header: «Hi, Jane» + «Sign out» (очистка localStorage)
- Tabs: My Submissions / New Submission
- «My Submissions» — таблица: Title | Target | Status (badge) | Updated → клик открывает detail
- «New Submission» форма:
  ```
  [Target Type]  ⦿ Review Tab  ⦾ Ranking Content  ⦾ Broker Card
  [Broker]       dropdown (scoped)      [Section] dropdown (overview/costs/...)
  [Ranking]      dropdown (scoped)      [Broker in Ranking] dropdown (если card)
  [Language]     dropdown
  [Title]        ______________________
  [Body]         [large textarea, MD, 40 rows]
                 Words: 1,234 | Chars: 7,890 | Target: ~1,500 words
  [Save Draft] [Submit for Review]
  ```
- Detail view: body (rendered MD), timeline, admin notes если есть

### 7.3 Admin Submissions tab
- Topbar KPIs: Pending | This week | Avg turnaround | Total processed
- Filters: status, author, target_type, lang, date range
- Table: ID | Author | Target | Title | Status | Updated → клик = detail modal
- Detail: body rendered + raw + metadata + action buttons + notes form + timeline

### 7.4 Processing pipeline (accepted → processed → published)
1. Sub в статусе `accepted`. Админ кликает «Import to Review Editor»
2. Backend: `POST /api/admin/submissions/:id/import-to-review` — в одной D1 batch-транзакции:
   - CAS: `UPDATE content_submissions SET status='processed', processed_at=now WHERE id=? AND status='accepted'`
   - Режет body_md по H2-маркерам `## Section: Costs`, `## Section: Platforms`. N секций → N INSERT
   - Для каждой секции: `INSERT INTO review_overrides (..., status='draft', edited_by='author:<name>') ON CONFLICT UPDATE SET content=..., status='draft'`
   - Для каждой: `INSERT INTO submission_imports (submission_id, destination_type='review_override', destination_ref='<broker>:<section>:<lang>', imported_by='admin')`
   - `INSERT INTO review_edit_log (action='create'|'update', edited_by='author:<name>')` для audit
   - `INSERT INTO submission_events (event='processed')`
3. Submission видно в админке со списком destination-refs из `submission_imports`. Live-сайт пока не видит (draft в `review_overrides.status`)
4. Админ проверяет preview → кликает «Publish»
5. Backend: `POST /api/admin/submissions/:id/publish` — батч:
   - CAS: `UPDATE content_submissions SET status='published', published_at=now WHERE id=? AND status='processed'`
   - Для каждого `submission_imports.destination_ref`: `UPDATE review_overrides SET status='published' WHERE broker_slug=? AND section=? AND lang=?`
   - `INSERT submission_events (event='published')`
6. Публичный endpoint `handleReviewOverridesPublic` фильтрует `WHERE status='published'` — только сейчас контент виден пользователям

Аналогично для `ranking` и `card` — разница только в destination-таблицах и именах draft-slot'ов.

Если нужно откатить: `POST /api/admin/submissions/:id/revert` → submission → `reverted`, все destination'ы из `submission_imports` переводятся в draft (или очищаются по правилам §3.4/§3.5).

---

## 8. Security

| Vector | Контроль |
|--------|----------|
| Broken Access Control | `author_id` всегда из токена, не из body. Каждый endpoint с `:id` включает `WHERE id=? AND author_id=?` (GET/PATCH/DELETE) — см. §5 "Ownership enforcement" |
| Injection | Все SQL параметризованы (existing pattern) |
| XSS (MD render) | На фронте `react-markdown` + `rehype-sanitize` (allowlist). Сервер также прогоняет body_md через allowlist-фильтр перед сохранением. **Canonical allowlist** (один источник истины, SPRINT выравнивается на него): `<p>`, `<strong>`, `<em>`, `<ul>`, `<ol>`, `<li>`, `<a href>` (https:// only), `<h2>`, `<h3>`, `<h4>`, `<code>`, `<pre>`, `<blockquote>`, `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`. Всё остальное — экранируется. Raw HTML внутри MD (`<script>`, event-handlers типа `onload=`, `<iframe>`, `<object>`) — удаляется |
| Rate limit | Invite: 10/hr/admin; Submission create: 30/day/author; Submit: 10/hr/author; Login page: 20/min/IP. Реализация: COUNT из `content_submissions`/`submission_events` за последний интервал |
| CSRF | Bearer-токен в header, не в cookie — CSRF неактуален |
| Token leak | 32-байтные `crypto.getRandomValues`, в URL только при первом логине, затем `localStorage`. Revoke = `expert_tokens.active=0` → `requireAuthor` возвращает 401 |
| CORS | Whitelist: `ratedbrokers.com`, `localhost:5173` |
| Size DoS | `body_md ≤ 100KB`, per-request payload cap 128 KB |
| SSRF | Никаких user-controlled fetch |
| Logging | Все переходы статусов → `submission_events` (кто, когда, от/к) |
| Race conditions (IDOR по status) | Все status-transitions через atomic CAS: `UPDATE ... WHERE id=? AND status IN (allowed_prev)` — см. §4. Если `changes=0` → возвращаем 409 Conflict |
| Duplicate import | `submission_imports` имеет `UNIQUE(submission_id, destination_type, destination_ref)` — повторный «Import» не создаёт дубль в destination |
| Broken publish-gating | Destination-таблицы имеют explicit live-slot (`review_overrides.status='published'`, `ranking_content.published_at NOT NULL`, `ranking_overrides.description_published_at NOT NULL`) — public endpoints фильтруют по live-slot; draft невидим |

**Не делаем в MVP:**
- Email invites (Егор копипастит)
- 2FA
- Revoked token blocklist (используем `active=0`)
- CAPTCHA (токен = уникальный доступ)

---

## 9. Миграция и откат

- Миграция файл: `backend/migrations/001-author-submissions.sql` — **one-shot fail-hard** (НЕ идемпотентна; не SELECT-probe, не транзакция — wrangler exec SQL-файлы без условной логики).
- Поведение:
  - `CREATE TABLE IF NOT EXISTS schema_migrations` — первая строка файла. Безопасно при повторе.
  - Далее `ALTER TABLE ... ADD COLUMN` и `CREATE TABLE IF NOT EXISTS` новые таблиц. ALTER не IF NOT EXISTS — при повторе падает на первом `duplicate column name` и останавливается. Это **и есть** guard: оператор видит ошибку → идёт проверять `SELECT version FROM schema_migrations`.
  - В конце `INSERT OR IGNORE INTO schema_migrations (version) VALUES ('001-author-submissions')` — фиксирует успешное применение. `OR IGNORE` — на случай если оператор вручную вставил версию ранее.
- Pre-check (рекомендуется оператору перед apply):
  ```bash
  wrangler d1 execute ratedbrokers --remote --command="SELECT version FROM schema_migrations WHERE version='001-author-submissions'"
  # Если вернуло строку → уже применено, не запускай миграцию.
  ```
- Partial-failure recovery: если миграция упала в середине (напр. wrangler timeout между ALTER и CREATE), состояние частично применено. Восстановление вручную: проверить `.schema`, докатить недостающие ALTER/CREATE поштучно, вручную `INSERT INTO schema_migrations`.
- Откат:
  - `DROP TABLE content_submissions; DROP TABLE submission_events; DROP TABLE submission_imports; DROP TABLE ranking_content;` + `DELETE FROM schema_migrations WHERE version='001-author-submissions'`
  - ALTER-колонки (`role`, `scopes_json`, `description_md_draft`, `description_md`, `description_lang`, `description_published_at`) нельзя дропнуть на D1 → остаются NULL-овыми (legacy data сохраняется), не мешают дальнейшей работе.

---

## 10. Out of scope (future)

- Автоматическая рассылка email с invite (CF Email Workers / Resend)
- Автоматическое Claude-split по H2 — MVP ручной, админ разбирает сложные кейсы
- Rich-text editor (TipTap / ProseMirror) — MVP текстарея + MD preview
- Версионирование body_md (history) — текущий body обновляется inline
- Workflow «второй reviewer» для финансового контента (peer review)
- Связка с Stripe/invoice для оплаты авторам (сейчас CSV export хватает)
- Диффы body_md перед/после admin правок

---

## 11. Testing checklist (для Sprint 8)

- [ ] Автор A не видит сабмиты автора B
- [ ] Автор A не может создать сабмит для брокера вне scope
- [ ] Автор не может менять status processed→draft
- [ ] Invite токен после revoke (active=0) возвращает 401
- [ ] Markdown с `<script>` → экранирован
- [ ] rate-limit срабатывает
- [ ] Admin import-to-review создаёт правильную запись в `review_overrides`
- [ ] Fallback рейтингов: если `ranking_content` пуст — фронт берёт из JS
- [ ] 2 автора параллельно работают — нет race condition на `PRIMARY KEY (ranking_id, lang)`

---

## 12. Итоговый список тасков по sprint (для Sprint 1 sign-off)

| # | Sprint | Задача |
|---|--------|--------|
| 1 | S2 | `001-author-submissions.sql` — все CREATE/ALTER |
| 2 | S2 | Local apply + remote apply |
| 3 | S3 | `utils/authorAuth.js` — `getAuthor`, `requireAuthor`, `hasScope` |
| 4 | S3 | `routes/admin-author-mgmt.js` — invite / list / patch |
| 5 | S3 | Frontend: `/author` login page |
| 6 | S4 | `routes/author-submissions.js` — все 7 endpoints |
| 7 | S4 | Валидация + rate-limit |
| 8 | S5 | `src/pages/AuthorPortal.jsx` + `AuthorSubmissionForm.jsx` |
| 9 | S6 | `routes/admin-submissions.js` — HTML dashboard + JSON API |
| 10 | S6 | Добавить `Submissions` в `adminLayout.js` NAV_ITEMS |
| 11 | S7 | `ranking_content` public endpoint + merge в `RankingPage.jsx` |
| 12 | S7 | Import helpers (`/import-to-review`, `/import-to-ranking`, `/import-to-card`) |
| 13 | S7 | Auto-split по H2 markers |
| 14 | S8 | OWASP checklist, docs, deploy, smoke test |

---

**Готово к approve.** После Егор confirm → переход к Sprint 2 (D1 schema).
