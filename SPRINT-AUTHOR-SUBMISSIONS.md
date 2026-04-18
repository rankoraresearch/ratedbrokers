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
**(запуск сейчас)**

---

## Sprint 5 — Author Portal UI

Цель: автор видит свои сабмиты и форму. Минимум красоты, максимум ясности.

### Подспринты
- **5.1** Маршрут в React: `/author/portal` (новый в `src/App.jsx`, lazy-loaded). Gate: нет токена → login. Есть → dashboard
- **5.2** `src/pages/AuthorPortal.jsx` — три секции: header (имя автора + «sign out»), «My Submissions» table, «New Submission» button
- **5.3** `src/pages/AuthorSubmissionForm.jsx` — форма:
  - Target Type (radio: **Review Tab** / **Ranking Content** / **Broker Card in Ranking**) — Ranking-тип охватывает все SEO-поля одного рейтинга (intro + key finding + how we ranked + outro + FAQ + meta)
  - В зависимости: picker брокера + picker секции ИЛИ picker рейтинга (+ picker брокера для card type — обязателен)
  - Language (en default; dropdown если scope позволяет)
  - Title (одна строка)
  - Body (textarea ~40 rows, Markdown, live char/word counter + target range hint). Для Ranking-типа — структурная подсказка: H2-маркеры `## Intro`, `## Key Finding`, `## How We Ranked`, `## Outro`, `## FAQ` (пары Q:/A:). Для Review-типа — `## Section: <name>`
  - «Save Draft» / «Submit for Review» buttons
- **5.4** Список статусов — badges цветов (draft серый, submitted синий, accepted зелёный, processed ярко-зелёный, rejected красный, needs_changes жёлтый)
- **5.5** View submission page: показывает body_md rendered (react-markdown + hardened), admin notes если есть, история
- **5.6** Десктоп и мобила, тёмная тема как в админке, lucide иконки
- **5.7** Все fetch'и — через helper `authorApi.js` с `Authorization: Bearer <token>`

### Deliverable
Работающий autoportal на живом сайте.

### Codex review
`— ждёт выполнения —`

---

## Sprint 6 — Admin Review Panel (10-й раздел админки)

Цель: админ в едином месте видит все сабмиты, фильтрует, принимает/отклоняет, оставляет notes.

### Подспринты
- **6.1** Добавить 10-й таб `Submissions` в `adminHeaderHTML` NAV_ITEMS (adminLayout.js). Не путать с existing `Authors` (9-й таб, outreach-карта конкурентов). Место — после `Reviews`
- **6.2** `backend/src/routes/admin-submissions.js` — dashboard HTML + JSON API
- **6.3** `GET /api/admin/submissions/dashboard?key=...` — HTML: топ-бар stats (pending / this week / turnaround), фильтры (status, author, target_type, lang), таблица сабмитов
- **6.4** Detail view: `?id=123` — полный body_md с syntax highlight, метаданные автора, timeline статусов, форма «admin_notes»
- **6.5** Actions (review-decision через `PATCH /:id/status`):
  - Accept → status=accepted
  - Request changes → status=needs_changes, required admin_notes
  - Reject → status=rejected, required admin_notes

  Actions (side-effect через dedicated endpoints — каждый атомарно меняет и submission, и destination):
  - Import to Review/Ranking/Card → `POST /:id/import-to-{review,ranking,card}` → status=processed, INSERT в `submission_imports`
  - Publish → `POST /:id/publish` → status=published + flip destination draft→live
  - Revert → `POST /:id/revert` → status=reverted + clear destination live-slot

  Прямой PATCH status в processed/published/reverted запрещён (400) — см. SPEC §6.2 инвариант.
- **6.6** Audit timeline в submission_events
- **6.7** Bulk select + bulk accept/reject (чекбоксы)
- **6.8** Экспорт CSV (все сабмиты с фильтрами) — удобно для бухгалтерии оплаты авторам

### Deliverable
Полный цикл доступен админу через UI.

### Codex review
`— ждёт выполнения —`

---

## Sprint 7 — Processing: Cut & Place Helpers

Цель: от «submission accepted» до «живой контент на сайте» одним кликом (или парой).

### Подспринты
- **7.1** Для `target_type=review`: import-helper пишет в `review_overrides` с `status='draft'` (уже существующая колонка). Публикация отдельным шагом — «Mark Published» флипает `status='published'`. Автоматическая разметка секций: если body содержит H2 `## Section: Costs`, разрезаем по ним и раскидываем по нескольким секциям. Multi-row → несколько INSERT в `submission_imports`.
- **7.2** Новая таблица `ranking_content` — **полная shape из SPEC §3.4** (draft + published slots для meta_title, meta_desc, intro_md, key_finding, how_we_ranked, outro_md, faq_json). Не position-based, а slot-based (все 7 полей на одной строке `(ranking_id, lang)`).
- **7.3** ALTER `ranking_overrides`: добавить `description_md_draft`, `description_md`, `description_lang`, `description_published_at` — publish-gating для per-card описаний. Author правит draft, admin публикует.
- **7.4** Frontend `src/pages/RankingPage.jsx` — fetch `/api/rankings/:id/content` (CORS public, cache 5min) → возвращает ТОЛЬКО published-поля. Cascade: если поле NULL → fallback на `rankingSeoContent.js`.
- **7.5** Frontend `src/components/BrokerRankCard.jsx` — рендерит `description_md` только если `description_published_at IS NOT NULL` (draft невидим). Public endpoint уже возвращает только published.
- **7.6** Admin endpoints:
  - `POST /api/admin/submissions/:id/import-to-review` — Claude-cut в `review_overrides.status='draft'`, INSERT в `submission_imports`, submission → status=`processed`
  - `POST /api/admin/submissions/:id/import-to-ranking` — в `ranking_content.*_draft`, submission → `processed`
  - `POST /api/admin/submissions/:id/import-to-card` — в `ranking_overrides.description_md_draft`, submission → `processed`
  - `POST /api/admin/submissions/:id/publish` — flip destination draft-slot → live-slot (CAS guard), submission → `published`, save `published_at`
  - `POST /api/admin/submissions/:id/revert` — clear live-slot (emergency unpublish), submission → `reverted`
- **7.7** UI в submission detail: кнопки соответствуют target_type, after successful import показывается список записей из `submission_imports` (где лежит обработанный контент)
- **7.8** Manual Claude-driven split: если submission = всё ревью одним блоком без H2-маркеров — я разбираю body на секции **в preprocess-шаге перед вызовом endpoint**, затем делаю ОДИН `POST /import-to-review` с already-chunked body (endpoint принимает body как массив `{section, content}` или plain body + server-side split). CAS `status='accepted'→'processed'` срабатывает один раз; все N строк в `review_overrides` и `submission_imports` — в одной D1 batch-транзакции. Повторный вызов upload'а НЕ возможен (status уже processed → 409). Если после processing нужно дослать ещё секцию — отдельный submission от автора (не append к processed).

### Deliverable
Обработанный сабмит реально виден на проде.

### Codex review
`— ждёт выполнения —`

---

## Sprint 8 — Security, Docs, Deploy

Цель: закрыть OWASP top-10, обновить доки, выкатить в прод.

### Подспринты
- **8.1** OWASP checklist:
  - Broken Access Control: автор не может читать чужие submissions (тест с двумя токенами)
  - Cryptographic: токены случайные (crypto.randomUUID или crypto.getRandomValues(32)), не из Math.random
  - Injection: все SQL параметризованы (проверить)
  - Insecure Design: rate-limit согласно SPEC §8 — invite **10/hr/admin**, submission create **30/day/author**, submit **10/hr/author**, login **20/min/IP**
  - Security Misconfiguration: CORS whitelist включает только ratedbrokers.com + localhost для dev
  - XSS: Markdown render с sanitizer, не пропускаем raw HTML
  - CSRF: Bearer token в Authorization header (не cookie) — CSRF не актуален
  - SSRF: не делаем downstream fetch по user-controlled URL
  - Logging: все admin-действия в submission_events
- **8.2** Turnstile на login page для авторов? — не нужно, раз заходят по уникальному long token
- **8.3** Обновить `backend/README.md` — новые endpoints, env, schema
- **8.4** Обновить `ADMIN-GUIDE.md` — новый 10-й раздел `Submissions`
- **8.5** Новый doc `AUTHOR-ONBOARDING.md` — инструкция для Егора: как создать нового автора, выдать scope, выслать magic-link
- **8.6** Обновить `memory/backend.md` и `memory/MEMORY.md`
- **8.7** Тестовый автор: создать через админку, Егор логинится как автор, делает тестовый сабмит, я обрабатываю end-to-end
- **8.8** git commit (детальный message), push в main → Cloudflare Pages автобилд
- **8.9** `cd backend && wrangler deploy` — для API воркера
- **8.10** Smoke test в проде: invite → login → submit → admin accept → process → visible on /reviews/ic-markets

### Deliverable
Feature в проде, доступна реальным авторам.

### Codex review
`— ждёт выполнения —`

---

## Оценки

Codex 10/10 шкала: каждая после сдачи спринта. Принцип — запускаю `/codex-review` после коммита спринта, фиксирую оценку + top-3 замечания в этом же файле под «Codex review» конкретного спринта.

## Порядок работы

1. Sprint 1 выполняю сейчас — чистое исследование + спека, без кода
2. После Sprint 1 → codex-review → если 8+/10 → двигаемся в Sprint 2
3. Каждый спринт заканчивается коммитом (`feat(submissions): sprint N — ...`) + логом в `logs/2026-04.md` + обновлением этого файла
