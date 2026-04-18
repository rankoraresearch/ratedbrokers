# Author Submissions — Sprint Backlog

**Цель:** построить инфраструктуру для приёма сырых текстов от нескольких живых авторов (ревью брокеров × 8 табов, intro/outro тематических рейтингов, карточки брокеров в рейтингах). Автор входит в урезанную зону админки, сабмитит текст, привязанный к цели. Клод (я) потом режет текст по секциям и льёт в `review_overrides` / новые таблицы контента → публикуется на сайте.

**Исходные данные:**
- Уже есть `expert_tokens` (per-expert токены с `name/email/broker_slugs/lang`) — будем расширять до role-based `author`
- Уже есть `review_overrides` (D1 overrides per broker × section × lang) — именно сюда льётся обработанный ревью-контент
- Уже есть `adminLayout.js` с общим хедером, **9 разделами** админки (Click / Affiliate / Rankings / Publish / Reviews / Messages / Link Health / Donors / Authors-outreach), `checkAuth` по API key
- Для ranking-контента (SEO-поля одной строкой: intro/outro/FAQ/meta — все в одной `ranking_content` row) готового хранилища нет — создадим

**Принципы:**
- Расширяем, не дублируем: `expert_tokens` → добавим `role`, `scopes_json`
- Новый **10-й** раздел админки `Submissions` для админа (вижу всё). Existing 9-й таб `Authors` — это outreach-карта конкурентов, не путать
- Отдельный portal `/author/portal` (frontend React route) для авторов (узкий UI, только свои сабмишены)
- Workflow: `draft → submitted → accepted → processed → published` (+ `rejected`, `needs_changes`)
- Мультиязычность: колонка `lang` с самого начала
- Rate-limit, sanitization, audit log — с первого спринта

**Критерий готовности:** автор по magic-link получает доступ, сабмитит сырой MD, админ в админке принимает, я одним кликом режу и публикую на соответствующей странице; всё логируется.

---

## Sprint 1 — Research & Architecture Spec

Цель: зафиксировать архитектуру на бумаге до единой строчки кода. Все решения (табличная схема, статусы, UX, scope-модель) идут в спецификацию, которую ревьюит Егор.

### Подспринты
- **1.1** Inventory auth — прочитать `backend/src/utils/auth.js`, `expert_tokens` usage в `reviews.js`, понять есть ли уже middleware и checkAuth patterns
- **1.2** Inventory content — как BrokerReview.jsx merge'ит overrides; как RankingPage рендерит intro/outro (есть ли D1 источник или только MD)
- **1.3** Scope-модель — решить, что именно в JSON-скоупах (per-broker? per-ranking? per-category? or wildcards)
- **1.4** Target-types — финальный canonical список (из SPEC §3.2): `review` (broker × section), `ranking` (один рейтинг — все SEO-поля одной строкой), `card` (ranking_id × broker_slug)
- **1.5** Status workflow — state machine: разрешённые переходы, кто может что (author vs admin)
- **1.6** Data shape `content_submissions` — все колонки, индексы, внешние ключи
- **1.7** Audit log — таблица `submission_events` (status change, comments) + child-таблица `submission_imports` (destination refs, IDEMPOTENT через UNIQUE-index) — см. SPEC §3.2a
- **1.8** UX flow — нарисовать пути: invite → portal login → new submission → edit → submit → admin review → accept → process → publish
- **1.9** Security model — rate-limit, body size caps, Markdown allowlist, CORS, CSRF
- **1.10** Write `AUTHOR-SUBMISSIONS-SPEC.md` — финальная спека, ~150-200 строк

### Deliverable
`AUTHOR-SUBMISSIONS-SPEC.md` в корне — **готов** (2026-04-18).

Ключевые находки при инвентаризации:
- 9 табов в `adminLayout.NAV_ITEMS` (не 7, как в памяти) — Authors уже занят outreach-картой, новый раздел назовём **Submissions**
- `expert_tokens` + `expert.js` — готовый паттерн токен-auth и token-scoped dashboard, копируем архитектурно
- `review_overrides` — точное место для итогового review-контента (после обработки)
- Ranking SEO контент сейчас в `src/data/rankingSeoContent.js` (JS template); нужна новая D1-таблица `ranking_content` с fallback в JS
- `ranking_overrides` уже есть — добавим `description_md` для per-card описания

### Codex review — Round 1 (2026-04-18)
**Итог: 5/10 → NEEDS_CHANGES** (1 critical, 4 high, 2 medium, 1 low)

Оценки по измерениям:
- Data model correctness: 1.0/2.0
- Status workflow: 0.6/2.0
- Scope enforcement: 1.0/2.0
- Security coverage: 1.0/2.0
- Sprint breakdown completeness: 0.9/2.0

Ключевые замечания и как исправлено:
- **[CRITICAL] processed→published not implementable** — destination-таблицы (`review_overrides`, `ranking_content`, `ranking_overrides.description_md`) сразу делают контент публичным → processed = published по факту. **Fix:** добавлены publish-gating slots (draft vs published) во всех destination; `review_overrides` использует существующий `status` column (draft/published)
- **[HIGH] ranking_content defined two ways** — SPEC §3.4 требовал 7 полей, SPRINT §7.2 сводил к `(position, body_md)`. **Fix:** один canonical shape из SPEC (все SEO-поля одной строкой). Sprint 5.3 и 7.2 переписаны
- **[HIGH] card scopes don't authorize broker** — `scopes.cards` проверял только ranking_id. **Fix:** scope-entry теперь `"<ranking_id>:<broker_slug>"` с поддержкой wildcards per-ranking. Enforcement check обновлён в §5
- **[HIGH] ALTER not idempotent on D1** — `ALTER TABLE ADD COLUMN` падает на повторе. **Fix:** убран claim "idempotent", введён `schema_migrations` version table, миграция теперь one-shot versioned
- **[HIGH] GET/DELETE :id need ownership + CAS on transitions** — небыло явного требования. **Fix:** SPEC §5 добавлен раздел "Ownership enforcement" (WHERE author_id=?), §4 переработан со SQL CAS-guard'ами для всех transitions
- **[MEDIUM] `reverted` missing from enum, no published_at** — **Fix:** расширен enum до 8 persistent состояний (draft/submitted/needs_changes/accepted/rejected/processed/published/reverted), добавлены `accepted_at`, `published_at`, `rejected_at`, `reverted_at`
- **[MEDIUM] processed_ref cannot hold multi-row** — **Fix:** удалён `processed_ref` из `content_submissions`; введена child-таблица `submission_imports` с UNIQUE(submission_id, destination_type, destination_ref) — заодно idempotent import
- **[LOW] tab count inconsistency** — **Fix:** везде "10-й таб Submissions", existing "Authors" явно назван outreach-картой

Обновлены секции спецификации: §1, §3.2, §3.2a (new), §3.4, §3.5, §3.6 (new), §3.7, §4, §5, §8, §9.
Обновлены подспринты: S2.1–2.8 (versioned migration), S5.3 (target types), S6.1 (10th tab), S7.1–7.8 (full rework).

### Codex review — Round 2 (7.4/10 NEEDS_CHANGES, 3 high + 1 med + 1 low)
- [HIGH] import-to-card писал в live-slot description_md → **fixed**: пишется только в `description_md_draft`
- [HIGH] PATCH /status позволял прямой переход в processed/published/reverted → **fixed**: SPEC §6.2 разделён на review-decision (PATCH) и side-effect (POST import/publish/revert). PATCH в processed+ запрещён (400)
- [HIGH] processed_ref всё ещё упоминался как активный → **fixed**: везде заменён на `submission_imports`
- [MEDIUM] `target_ranking_id` vs canonical `target_ranking_broker` в SPRINT §4.4 → **fixed**
- [LOW] stale tab count → **fixed**

### Codex review — Round 3 (7.8/10 NEEDS_CHANGES, 2 high + 1 med + 1 low)
- [HIGH] revert очищал `*_draft` вместо live-полей → **fixed**: per-destination правила в §6.2 (draft сохраняется, live очищается)
- [HIGH] SPRINT §7.8 предлагал несколько подряд POST /import-to-review, что противоречит CAS → **fixed**: один preprocess+один import call с chunked body в batch
- [MEDIUM] spec/sprint drift (markdown allowlist, rate limits) → **fixed**: SPEC §8 canonical, SPRINT ссылается на него
- [LOW] stale terms (`/api/author/portal`, `review_tab`, "7 разделов") → **fixed**: `/author/portal`, `review|ranking|card`, "9 разделов"

### Codex review — Round 4 (9.4/10 APPROVED)
- Все Round-3 HIGH fixed
- 2 LOW wording nits: state diagram `(любой)→reverted` vs CAS guard, summary revert loose → **fixed Round 5**

### Codex review — Round 5 FINAL (10.0/10 APPROVED) ✅
**Dimensions: все 2.0/2.0**
- Data model correctness: 2.0 — submission_imports корректен, draft/live slot split когерентен
- Status workflow: 2.0 — все CAS guards, state-machine и §6.2 contract внутренне согласованы
- Scope enforcement: 2.0 — target-type + ownership checks явны, card wildcards работают
- Security coverage: 2.0 — markdown allowlist + rate limits в SPEC §8 (canonical source)
- Sprint breakdown completeness: 2.0 — 8 спринтов × подспринты покрывают всё требуемое спекой

**SHIPPABLE: YES** — Sprint 2 (schema/migration) может стартовать без дополнительных spec-итераций.

Путь: 5.0 → 7.4 → 7.8 → 9.4 → **10.0** за 5 раундов codex-review, 4 итерации правок.

---

## Sprint 2 — D1 Schema & Migration

Цель: положить все новые таблицы в D1 (local + remote), не ломая существующее.

### Подспринты
- **2.1** ✅ Edit `schema.sql` — добавил только `schema_migrations` (bookkeeping). Новые таблицы и ALTER — только в миграции (не дублировать)
- **2.2 + 2.3** ✅ Write `backend/migrations/001-author-submissions.sql` — versioned one-shot: ALTER expert_tokens (+role, +scopes_json), ALTER ranking_overrides (+description_md_draft, +description_md, +description_lang, +description_published_at), CREATE content_submissions, submission_events, submission_imports, ranking_content. `INSERT OR IGNORE INTO schema_migrations` в конце. D1 не умеет транзакций в SQL-файлах через wrangler — fail-hard при повторе (duplicate column) = guard
- **2.4** ✅ Локально: `wrangler d1 execute --local --file=schema.sql` (init) + `--file=migrations/001-author-submissions.sql` (migration) — обе успешно
- **2.5** ✅ Verify: 7 нужных таблиц существуют; `expert_tokens.role`, `scopes_json`, `ranking_overrides.description_*` колонки на месте; `schema_migrations` содержит версию `001-author-submissions`. Re-run → ERROR "duplicate column name: role" (intended guard)
- **2.6** ✅ Егор approve автономного режима до S8 — включает remote apply
- **2.7** ✅ Remote apply: `wrangler d1 execute --remote --file=migrations/001-author-submissions.sql` → 19 queries, 27 rows written, 0 errors. `schema_migrations` содержит версию `001-author-submissions` (applied_at=2026-04-18 00:47:51). Verify: все 4 новые таблицы (`content_submissions`, `submission_events`, `submission_imports`, `ranking_content`) + ALTER колонки (`expert_tokens.role`, `scopes_json`; `ranking_overrides.description_md_draft/description_md/description_lang/description_published_at`) на месте
- **2.8** ⏸ `backend/README.md` обновление зарезервировано (файл был откачен — оставляем как есть, канонической документацией выступают SPEC + SPRINT docs)

### Deliverable
Local D1 + Remote D1 имеют все новые таблицы + ALTER-колонки; re-run guard проверен (fail-hard duplicate column); `schema_migrations` содержит версию 001 в обеих базах. SPEC + SPRINT canonical docs — `backend/README.md` не обновлён (оставлен как был).

**Статус:** 2.1-2.7 закрыты (local + remote applied). 2.8 (README) — deferred, оставлен в исходном виде интенционально.

Commit: `16cfac1 feat(submissions): S1+S2 — author submissions spec + D1 migration` + push to main.

### Codex review — Round 1 Sprint 2 (8.2/10 APPROVED_WITH_NITS)
- [MEDIUM] Re-run guard docs overpromised — **fixed**: migration header + SPEC §9 переписаны с точным описанием fail-hard behavior, pre-check, partial-failure recovery
- [LOW] `description_lang` NOT NULL drift — **fixed**: SPEC §3.5 синхронизирован с SQL
- [LOW] Status enum "9 состояний" неточно + SQL не документировал enum — **fixed**: inline comment в миграции с перечислением 8 persistent states, SPRINT исправлен на "8 persistent состояний"

### Codex review — Round 2 Sprint 2 (9.7/10 APPROVED_WITH_NITS)
- Все Round-1 findings FIXED
- [LOW] Self-contradiction в 2.8 и deliverable — **fixed Round 3**: приведено в соответствие (README не обновлялся)

### Codex review — Round 3 Sprint 2 FINAL (10.0/10 APPROVED) ✅
- Findings: none
- Все 5 измерений: 2/2
- Residual risk note: read-only review, migration выполнена отдельно с успехом (remote apply + verify)
- Путь Sprint 2: 8.2 → 9.7 → **10.0** за 3 раунда

---

## Sprint 3 — Auth & Author Sessions (Magic Link)

Цель: автор может залогиниться в личную зону через persistent token из invite-письма (генерим в админке, копипастим в письмо автору — отдельный email-воркер пока не ставим).

### Подспринты
- **3.1** ✅ Write `backend/src/utils/authorAuth.js` — `extractToken`, `getAuthor`, `requireAuthor`, `scopeAllows`, `cardScopeAllows`, `authorizeTarget`, `generateToken`. Parses scopes_json, falls back for legacy expert rows (broker_slugs → scopes.reviews)
- **3.2** ✅ Write `backend/src/routes/admin-author-mgmt.js` — `POST /api/admin/authors/invite` с generateToken + scopes validation (card entries format `<ranking>:<broker>` regex) + invite_url assembly
- **3.3** ✅ `GET /api/admin/authors/list` — возвращает авторов с parsed scopes + submission_count
- **3.4** ✅ `PATCH /api/admin/authors/:id` — partial update (name/email/role/lang/scopes/active/expires_days). `POST /api/admin/authors/:id/rotate` — regenerate token, reactivate
- **3.5** ✅ Write `src/pages/AuthorPortalLogin.jsx` — URL `?token=` + localStorage + manual paste fallback + verify via `/api/author/me`. Export `RequireAuthorToken` guard + STORAGE_KEY константа
- **3.6** ✅ `src/pages/AuthorPortal.jsx` — placeholder для S5 (header с именем, scope summary, sign-out, «coming soon» для submissions table). Edit `src/App.jsx` — добавлены routes `/author` (login) и `/author/portal` (dashboard) ПЕРЕД `/author/:slug` (public profile). Static ranking в React Router v7 гарантирует правильное разрешение
- **3.7** ✅ End-to-end smoke test: invite → /me → list → patch scope → rotate (old=401, new=200) → revoke (active=0, 401). Frontend build: ✅ 3.60s, новые chunks AuthorPortal/AuthorPortalLogin присутствуют. Backend deploy: ✅ `wrangler deploy` → prod endpoints отвечают 401 без auth
- **3.8** ✅ `backend/src/routes/author-me.js` создан как отдельный модуль, роутинг в `index.js` добавлен для 5 новых путей (invite/list/:id/:id/rotate/me). Авто-документация — через spec §6

### Deliverable
Админ создаёт автора через `POST /api/admin/authors/invite` → получает invite_url → автор открывает `/author?token=...` → token проверяется через `/api/author/me` → сохраняется в localStorage → редирект на `/author/portal` → видит «Hi, <name>» и scope summary. Backend deployed, frontend build clean.

### Codex review — Sprint 3
- Round 1: 6.9/10 NEEDS_CHANGES — 1 HIGH (expires_days NaN crash) + 3 MEDIUM (guard not wired / URL token leak / canonical path drift) + 2 LOW (scope validation incomplete / CAS limitation)
- Round 2: 8.9/10 APPROVED_WITH_NITS — все Round-1 кроме LOW-6 (CAS — MVP accepted) и LOW-5 partial (LANG_RE `/i` flag pass-through)
- Round 3 FINAL: **10.0/10 APPROVED** ✅ (no findings, все 5 измерений по 2.0/2.0)
- Путь: 6.9 → 8.9 → 10.0 за 3 раунда, 2 итерации правок
- Commits: `93a00e5` (base), `3d00a4b` (round-1 fixes), `8991991` (round-2 nit)

---

## Sprint 4 — Author-side REST API

Цель: все CRUD эндпоинты для авторов, со строгой проверкой «это твоё».

### Подспринты
- **4.1** ✅ Write `backend/src/routes/author-submissions.js` — 6 handlers (targets, create, list, get, patch, delete)
- **4.2** ✅ `GET /api/author/me` — уже в Sprint 3
- **4.3** ✅ `GET /api/author/targets` — раскрывает `scopes.reviews` в список brokers из D1. Rankings/cards возвращаются как scope entries (frontend hydrates из bundled rankings.js)
- **4.4** ✅ `POST /api/author/submissions` — валидация shape + body + scope. Sanitizes body через `sanitizeMarkdownBody` перед INSERT. Word count computed
- **4.5** ✅ `PATCH /api/author/submissions/:id` — edit allowed в `draft` или `needs_changes`. `action='submit'` → status=submitted + submitted_at. CAS guard в UPDATE (WHERE id=? AND author_id=? AND status IN (allowed))
- **4.6** ✅ `GET /api/author/submissions?status=&type=` — фильтры, сортировка updated_at DESC, limit 200
- **4.7** ✅ `GET /api/author/submissions/:id` — detail + events timeline из submission_events
- **4.8** ✅ `DELETE /api/author/submissions/:id` — CAS-safe DELETE WHERE id=? AND author_id=? AND status='draft'. Structured 409 если статус не draft
- **4.9** ✅ Валидации: `body_md ≤ 100KB byte length` (TextEncoder), `title ≤ 200`, MIME strict. Rate limits: create 30/day/author, submit 10/hr/author через COUNT queries
- **4.10** ✅ Write `backend/src/utils/mdSanitize.js` — canonical allowlist SPEC §8. Strips `<script>`, `<iframe>`, `<style>`, event-handlers. Preserves MD syntax. Also adds `rel="nofollow noopener"` на `<a href>` автоматически
- **4.11** ✅ Edit `backend/src/index.js` — 6 новых роутов: GET /targets, POST /submissions, GET /submissions, :id GET/PATCH/DELETE
- **4.12** ✅ End-to-end smoke test — 13 сценариев все зелёные: targets, CRUD, submit, scope (review+card), ownership isolation (Bob can't see Jane's), status-lock, `<script>` sanitization, word count. Backend deployed version `a53468e6`

### Deliverable
7-endpoint REST API работает. Все тесты зелёные (создание, апдейт, сабмит, удаление, списки, detail, scope, sanitization, ownership isolation, rate limits). Backend deployed на `api.ratedbrokers.com`.

### Codex review Sprint 4
- Round 1: 7.7/10 — 1 HIGH (null JSON 500) + 2 MEDIUM (byte cap, /targets) + 2 LOW (target_section/ranking_broker cross-type, dead code)
- Round 2: 9.2/10 — Round-1 все fixed; новая LOW (sanitizer comment + mailto)
- Round 3: 9.8/10 — mailto removed; осталась comment drift
- Round 4 FINAL: **10/10 territory, no findings** ✅
- Путь: 7.7 → 9.2 → 9.8 → 10 за 4 раунда, 3 итерации правок
- Commits: `4a913f4` (base), `0b66398` (R1 fixes), `f8010a7` (R2 nit), `016b3e6` (R3 nit)

---

## Sprint 5 — Author Portal UI

Цель: автор видит свои сабмиты и форму. Минимум красоты, максимум ясности.

### Подспринты
- **5.1** ✅ Маршрут `/author/portal` уже в App.jsx (Sprint 3), обёрнут в `RequireAuthorToken` — уже есть
- **5.2** ✅ Rewrite `src/pages/AuthorPortal.jsx` — 4 views управляются `?view=` query: list / new / detail / edit. Header с name + scope summary + sign-out. 767 строк (от placeholder)
- **5.3** ✅ `SubmissionForm` + `FormFields` внутри AuthorPortal.jsx — три target_type, brokers/rankings/cards pickers гидрируются из `/api/author/targets` + bundled RANKINGS (хелпер `rankingTitle(id)`). Card — два-уровневый picker (ranking → broker внутри). Language select из scope.langs. Title + Body textarea с live char+word counter и контекстными placeholder'ами (H2 markers hints)
- **5.4** ✅ `StatusBadge` — 8 статусов, color+bg+icon mapping (STATUS_META). Фильтр по status в списке
- **5.5** ✅ `SubmissionDetail` — title, target metadata, admin_notes banner, body_md в mono `<pre>` (render без MD parser — чтобы автор видел raw), Timeline событий, action buttons Edit/Submit/Delete в зависимости от статуса
- **5.6** ✅ Светлая тема (match production palette), inline CSS, lucide-react icons, адаптивный `max-width: 960` контейнер
- **5.7** ✅ `useApi` hook — central fetch helper: читает token из localStorage, 401 → clear + redirect to /author, JSON serialization, structured error propagation

### Deliverable
Полная UI в AuthorPortal.jsx: list/new/detail/edit views под routing через `?view=`. Frontend build clean (3.74s). Auth flow end-to-end: login via invite → /author/portal видит name + scope → New submission form с dropdown брокера/рейтинга + textarea → Save Draft / Save & Submit. Detail view с Timeline событий. Edit view для draft/needs_changes.

### Codex review Sprint 5
- Round 1: 6.9/10 NEEDS_CHANGES — 1 HIGH (card scope bug) + 3 MEDIUM (MD render / save&submit orphan / no unmount guards) + 2 LOW
- Round 2: 8.0/10 — Round-1 все fixed; 1 MEDIUM (stale dependent fields) + 1 LOW (flash disappears on redirect)
- Round 3: 9.0/10 — MEDIUM fixed, 1 LOW (flash персистит после успешного retry)
- Round 4 FINAL: **10/10 APPROVED** ✅ (no findings)
- Путь: 6.9 → 8.0 → 9.0 → 10 за 4 раунда, 3 итерации правок
- Commits: `ba5f70c` (base), `32bc6bf` (R1), `9f0bb99` (R2), `813a88f` (R3)
- Deps: +react-markdown, +rehype-sanitize

---

## Sprint 6 — Admin Review Panel (10-й раздел админки)

Цель: админ в едином месте видит все сабмиты, фильтрует, принимает/отклоняет, оставляет notes.

### Подспринты
- **6.1** ✅ Edit `adminLayout.js` NAV_ITEMS — 10-й таб `Submissions` с document-icon SVG, после `Authors`
- **6.2** ✅ Write `backend/src/routes/admin-submissions.js` — HTML dashboard + 4 JSON endpoints
- **6.3** ✅ Dashboard `/api/admin/submissions/dashboard?key=...` — 4 KPI cards (pending / last 7 days / total / avg turnaround hours), filters (status/type/author name/lang), table с clickable rows
- **6.4** ✅ Slide-over drawer на клик — full detail (body_md в `<pre>`, author block, admin_notes banner, imports list, events timeline, decision panel если status='submitted')
- **6.5** ✅ PATCH `/api/admin/submissions/:id/status` с body `{decision, admin_notes}`:
  - accept (notes optional) · request_changes + reject (notes REQUIRED)
  - CAS guard `WHERE status='submitted'`; 409 иначе
  - Side-effect endpoints (import-to-*, publish, revert) остались за Sprint 7
- **6.6** ✅ events + imports рендерятся в drawer как отдельные секции
- **6.7** Bulk select — отложено до S8 polish (не критично для MVP)
- **6.8** ✅ CSV export `/api/admin/submissions/export.csv?status=&from=&to=` — proper CSV escaping, Content-Disposition attachment

### Deliverable
10-й таб Submissions доступен в админке. End-to-end smoke test (10 сценариев) все зелёные: list с фильтрами, detail drawer, accept без notes, reject без notes → 400, reject с notes → 200, CAS 409 на повторный decision, CSV export, HTML dashboard 200. Backend deployed version `609dae6f`.

### Codex review Sprint 6
- Round 1: 8.0/10 APPROVED_WITH_NITS — 2 MEDIUM (limit clamp / CSV end-date) + 2 LOW (body guard / fetch error UI)
- Round 2: 9.3/10 — Round-1 fixed, new MEDIUM (malformed date params crash) + LOW (from validation)
- Round 3: 9.5/10 — date validation FIX, 1 MEDIUM (CSV formula injection) + LOW (CORS on error paths)
- Round 4: 9.5/10 — formula + CORS fixed, 1 LOW (env not passed to corsHeaders)
- Round 5 FINAL: **10/10 APPROVED** ✅ (no findings)
- Путь: 8.0 → 9.3 → 9.5 → 9.5 → 10.0 за 5 раундов, 4 итерации правок
- Commits: `419957b` (base), `ca81659` (R1), `35c251d` (R2), `a54e49b` (R3), `e6b91ff` (R4)

---

## Sprint 7 — Processing: Cut & Place Helpers

Цель: от «submission accepted» до «живой контент на сайте» одним кликом (или парой).

### Подспринты
- **7.1** ✅ `POST /import-to-review` (admin-submissions-processing.js) — `splitReviewBody()` парсит `## Section: <key>` H2 markers, fallback на target_section. Batch: CAS → processed + N INSERT в review_overrides с status='draft' + INSERT в submission_imports (UNIQUE dedup) + review_edit_log audit
- **7.2** ✅ ranking_content использована из Sprint 2 schema (уже созданная). `splitRankingBody()` парсит `## Intro / Key Finding / How We Ranked / Outro / FAQ` headers + `Q:/A:` пары для FAQ; INSERT через ON CONFLICT UPDATE с COALESCE (сохраняет существующие draft-slots, если парсер не увидел секцию)
- **7.3** ✅ `ranking_overrides` уже с ALTER из Sprint 2. `POST /import-to-card` — INSERT с position=999 + ON CONFLICT UPDATE description_md_draft
- **7.4** ✅ `RankingPage.jsx` — новый useEffect fetches `/api/rankings/:id/content?lang=en`, useMemo мержит override поверх bundled SEO_CONTENT (non-NULL override wins per field)
- **7.5** ✅ Расширил `handleRankingOrderPublic`: добавил `description_md` в response (только если published + lang match); `applyOverrides` пробрасывает `_cardDescription` в broker object
- **7.6** ✅ 5 new endpoints: `/import-to-review`, `/import-to-ranking`, `/import-to-card`, `/publish`, `/revert`, plus public `GET /api/rankings/:id/content`
- **7.7** ✅ Admin dashboard drawer расширен: кнопки Import/Publish/Revert появляются по статусу (accepted / processed / processed|published). `sideEffect()` helper на клиенте
- **7.8** ✅ Single-shot import with section split in one batch (CAS guard выполняется один раз, 409 при повторе). `splitReviewBody` чисто server-side, нет manual preprocess

### Deliverable
Полный pipeline end-to-end работает на local и deployed. Smoke test 3 pipelines (review multi-section / ranking / card) все зелёные:
- `review`: split по H2 → 2 строки в review_overrides draft → publish → public endpoint видит обе → revert → draft опять
- `ranking`: parse 5 секций + FAQ с 2 вопросами → draft slots → publish → public `/content?lang=en` возвращает все поля
- `card`: body_md в description_md_draft → publish → public `/order?lang=en` возвращает description_md

Backend deployed `376befac`. Frontend build clean (3.73s).

### Codex review Sprint 7
- Round 1: 3.8/10 — 2 HIGH (row-scoped vs submission-scoped, case-sensitive section) + 3 MEDIUM + 1 MEDIUM
- Round 2: 5.8/10 — per-field imports landed, но ref-variable regression crashed response
- Round 3: 6.4/10 — ref fixed + pre-validation + JSON-LD deps + lang threading; revert provenance issue surfaced
- Round 4: 7.0/10 — provenance guard overcorrected (blocked legitimate reverts), JSON-LD effect coupled с nav
- Round 5: 8.8/10 — spec-compliant unconditional revert, split effects, alive guard; 1 MEDIUM (ranking_card revert description_lang)
- Round 6 FINAL: **10/10 APPROVED** ✅ (no findings)
- Путь: 3.8 → 5.8 → 6.4 → 7.0 → 8.8 → 10 за 6 раундов, 5 итераций правок
- Commits: `27e7faf` (base), `6f84177` (R1), `5313a56` (R2), `1984c42` (R3), `ea44f95` (R4), `b12a193` (R5)

### Deliverable
Обработанный сабмит реально виден на проде.

### Codex review
`— ждёт выполнения —`

---

## Sprint 8 — Security, Docs, Deploy

Цель: закрыть OWASP top-10, обновить доки, выкатить в прод.

### Подспринты
- **8.1** ✅ OWASP audit via codex (`/security-review`-style prompt): выявил 1 CRITICAL (stored XSS через MD link) + 3 HIGH (admin key в URL, plaintext tokens в D1, revert provenance). Все fixes применены где возможно; project-wide items документированы как out-of-scope
- **8.2** ✅ CRITICAL XSS fix: `mdSanitize.js` добавлен link-protocol validator (только https://, http://, mailto:, relative — остальные stripped); `RankingPage.jsx` заменил `dangerouslySetInnerHTML` + regex на `react-markdown` + `rehype-sanitize`
- **8.3** ✅ HIGH token hashing: migration 002 (token_hash column + UNIQUE partial index), `authorAuth.hashToken()` SHA-256, `getAuthor` hash-lookup с fallback на raw (legacy compat), `handleAuthorInvite`/`handleAuthorRotate` populate token_hash. Applied local + remote
- **8.4** ✅ HIGH admin-key `?key=` query param — documented как pre-existing project-wide в SPEC §10; не вводим новые instances
- **8.5** ✅ HIGH revert provenance — documented в SPEC §10 как known limitation; future migration 003 планирована
- **8.6** ✅ Write `AUTHOR-ONBOARDING.md` — operator guide: invite curl, scope shortcuts, drawer actions, management commands (patch/rotate/revoke/extend), CSV export, troubleshooting, security summary
- **8.7** ✅ Edit `ADMIN-GUIDE.md` — добавлены §8 Donors, §9 Authors-outreach (clarification), §10 Submissions (full workflow)
- **8.8** ✅ Memory update: `memory/author-submissions.md` финализирован, `memory/MEMORY.md` pointer отмечен ЗАВЕРШЕНА
- **8.9** ✅ Backend deploy через `wrangler deploy` (version 74b21462), frontend через git push (Cloudflare Pages автобилд)
- **8.10** ✅ Final smoke test: invite → hash-auth /me → rotate (old 401, new 200) → sanitizer XSS test (javascript: URL stripped, text preserved). All green

### Deliverable
Feature полностью в проде, security audited, documented. Real authors могут быть invited (curl команда в AUTHOR-ONBOARDING.md). 18 endpoints operational, migration 001+002 applied local+remote, backend version 74b21462.

### Codex review Sprint 8 (security audit)
- Round 1: 5.0/10 NEEDS_CHANGES — **1 CRITICAL stored XSS** + 3 HIGH (admin ?key=, plaintext tokens, revert provenance)
- Round 2: 6.8/10 — CRITICAL fixed (MD sanitizer + react-markdown), admin ?key= и revert provenance documented в §10; осталась 1 HIGH — raw token still persisted в token column
- Round 3 FINAL: **10/10 APPROVED** ✅ (no findings) — placeholder `hash:<digest>` в token column, real bearer только в invite response
- Путь: 5.0 → 6.8 → 10.0 за 3 раунда, 2 итерации правок
- Commits: (S7 base), `0eafd0d` (R1 security), `735e743` (R2 final)

---

## Post-S8 polish — Inline Invite UI (2026-04-19)

По запросу Егора: управление доступами авторов вынесено прямо в Submissions dashboard, чтобы не требовались curl-команды.

**Что добавлено в `/api/admin/submissions/dashboard`:**
- Раскрывающийся блок **"👤 Invite a new author"** в верхней части дашборда
- Форма с 8 полями: Name, Email, Reviews/Rankings/Cards/Langs scopes (comma-separated), Expires days (1–3650), Role dropdown (author/expert/admin)
- Inline scope hints (`*` wildcard, `ranking:broker` card format, empty=deny)
- Кнопка **Create invite** → POST `/api/admin/authors/invite` → рендер invite URL в зелёном блоке + **Copy invite URL** clipboard button
- Ниже формы — таблица **Existing authors**: имя, email, role, scope summary (`r:N rk:N c:N en`), статус (active/revoked), expires, submission count, inline actions **Rotate / Revoke / Activate** (reuses `/api/admin/authors/:id/rotate` и PATCH `active` shipped in Sprint 3)

**Без backend-изменений** — чисто frontend-расширение уже задеплоенных API.

**Docs updated:** `ADMIN-GUIDE.md §10` (UI first, curl как fallback), `AUTHOR-ONBOARDING.md` Step 1 (UI recommended, curl для scripts).

**Commit:** `aa53160` на main (cherry-picked из `auto-polish-v2` branch, куда случайно попал первый commit).
**Backend version:** `54f4e442` на `api.ratedbrokers.com`.

---

## Оценки

Codex 10/10 шкала: каждая после сдачи спринта. Принцип — запускаю `/codex-review` после коммита спринта, фиксирую оценку + top-3 замечания в этом же файле под «Codex review» конкретного спринта.

## Порядок работы

1. Sprint 1 выполняю сейчас — чистое исследование + спека, без кода
2. После Sprint 1 → codex-review → если 8+/10 → двигаемся в Sprint 2
3. Каждый спринт заканчивается коммитом (`feat(submissions): sprint N — ...`) + логом в `logs/2026-04.md` + обновлением этого файла
