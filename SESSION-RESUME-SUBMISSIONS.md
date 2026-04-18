# SESSION RESUME — Author Submissions Pipeline

**Если контекст потерян, читай этот файл ПЕРВЫМ.** Он восстановит ход работы.

**Last updated:** 2026-04-18 (актуализировать каждый спринт)
**Current sprint:** Sprint 3 — Auth & Magic Link Invite (code done, codex review pending)
**Mode:** автономный до конца Sprint 8 (approve Егора).
**Last Codex scores:** S1 — 10/10 ✅ · S2 — 10/10 ✅ · S3 — pending

**Sprint 3 итог (code done):**
- `backend/src/utils/authorAuth.js` — token parse, scope/card enforcement, authorizeTarget, generateToken
- `backend/src/routes/admin-author-mgmt.js` — invite/list/patch/rotate endpoints
- `backend/src/routes/author-me.js` — `/api/author/me` профиль
- `backend/src/index.js` — роуты добавлены (5 новых путей)
- `src/pages/AuthorPortalLogin.jsx` — login gate (?token= or manual paste)
- `src/pages/AuthorPortal.jsx` — dashboard placeholder
- `src/App.jsx` — routes `/author` и `/author/portal` перед `/author/:slug`
- Backend deployed к `api.ratedbrokers.com` (version 0d4acea6)
- Frontend build ✅; end-to-end smoke test ✅

**Sprint 2 итог:**
- `backend/migrations/001-author-submissions.sql` применён на **local + remote** D1
- Все 4 новых таблицы + ALTER колонки (expert_tokens, ranking_overrides) на месте
- `schema_migrations.version='001-author-submissions'` в обеих базах
- Fail-hard re-run guard проверен (ERROR duplicate column name)
- Commit `16cfac1` на main, pushed

---

## Что вообще делаем

Строим инфраструктуру для приёма сырых текстов от живых (не-AI) авторов:
- Ревью брокеров по 8 табам (overview/costs/platforms/...)
- SEO-контент тематических рейтингов (intro/key_finding/how_we_ranked/outro/FAQ/meta)
- Карточки брокеров внутри рейтингов (описания)

Авторы логинятся в урезанную зону по magic-link токену, сабмитят raw Markdown, привязанный к цели. Админ принимает → Клод режет и льёт в `review_overrides` / `ranking_content` / `ranking_overrides.description_md_draft` → админ публикует флипом draft→live-слот.

---

## Куда читать

| Файл | Что там |
|------|---------|
| `AUTHOR-SUBMISSIONS-SPEC.md` | **Полная архитектурная спецификация** (approved Codex 10/10). 450 строк: data model, status workflow, 18 endpoints, scope model, security, migration strategy, testing checklist. |
| `SPRINT-AUTHOR-SUBMISSIONS.md` | **Бэклог 8 спринтов.** Sprint 1 закрыт + оценки Codex по всем раундам (5.0→7.4→7.8→9.4→10.0). |
| `logs/2026-04.md` | Детальный лог всех действий по сессиям. Искать "2026-04-18". |
| `memory/status.md` | Общий статус проекта (не путать с этим resume — он специфичен для Submissions) |
| `memory/author-submissions.md` | Memory pointer на эту работу |

---

## Текущий статус по спринтам

- [x] **Sprint 1** — Research & Spec → SPEC готов, **Codex 10/10** ✅
- [ ] **Sprint 2** — D1 Schema & Migration (**in progress**)
- [ ] **Sprint 3** — Auth & Magic Link Invite
- [ ] **Sprint 4** — Author REST API
- [ ] **Sprint 5** — Author Portal UI
- [ ] **Sprint 6** — Admin Review Panel (10-й таб)
- [ ] **Sprint 7** — Processing Helpers (cut & place)
- [ ] **Sprint 8** — Security audit, docs, deploy

Все детали каждого подспринта — в `SPRINT-AUTHOR-SUBMISSIONS.md`.

---

## Протокол работы по каждому спринту

1. `TaskUpdate` → status=`in_progress`
2. Выполнять подспринты последовательно, каждый шаг → в `logs/2026-04.md`
3. После всех подспринтов — обновить SPRINT-AUTHOR-SUBMISSIONS.md (Deliverable + заметки)
4. `git commit` с сообщением `feat(submissions): sprint N — <summary>`
5. Запустить `/codex-review` — оценка 10/10 шкала
6. Зафиксировать оценку в SPRINT-AUTHOR-SUBMISSIONS.md → "### Codex review — Round X (X.X/10 VERDICT)"
7. Если < 10/10 — итерации правок → re-run codex → записать все раунды
8. **Перед `wrangler d1 execute --remote` или `git push` — ОБЯЗАТЕЛЬНО спросить Егора** (destructive/public)
9. `TaskUpdate` → status=`completed`. Обновить этот resume-файл (строку «Current sprint»).

---

## Чего НЕ делать без явного approve Егора

- `wrangler d1 execute --remote` (изменения на prod D1)
- `git push origin main` (деплой на Cloudflare Pages автобилдом)
- `wrangler deploy` (деплой worker'а)
- Любые ALTER на существующих прод-таблицах вне `001-author-submissions.sql`

Local-операции (`--local` wrangler, редактирование файлов, `npm run build`, `git commit`) — делать без спроса.

---

## Если context reset случился прямо сейчас — что делать

1. Прочитай этот файл до конца
2. Прочитай `memory/status.md` (общий проект)
3. Прочитай `SPRINT-AUTHOR-SUBMISSIONS.md` полностью → найди последний спринт со статусом in_progress или pending
4. Прочитай `logs/2026-04.md` — последняя запись покажет где остановились
5. Прочитай `AUTHOR-SUBMISSIONS-SPEC.md` для контекста архитектуры
6. Продолжи работу по протоколу выше. Не переделывай уже сделанное — проверь `git status`, `git log`, content таблиц (`wrangler d1 execute --local --command "SELECT name FROM sqlite_master WHERE type='table'"`)
7. Перед любой destructive-операцией — спроси Егора

## Последняя отметка

**2026-04-18 ~03:55** — Sprint 1+2 закрыты оба 10/10. Commit `16cfac1`, pushed to main. Remote D1 мигрирована (19 queries, 27 rows). Заход в Sprint 3: author auth + magic-link invite. Детали подспринтов 3.1-3.8 — см. SPRINT-AUTHOR-SUBMISSIONS.md.
