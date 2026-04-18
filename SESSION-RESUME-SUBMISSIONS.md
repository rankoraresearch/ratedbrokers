# SESSION RESUME — Author Submissions Pipeline

**Если контекст потерян, читай этот файл ПЕРВЫМ.** Он восстановит ход работы.

**Last updated:** 2026-04-18 (актуализировать каждый спринт)
**Current sprint:** Sprint 2 — D1 Schema & Migration (**paused at 2.6 — ждёт approve Егора на remote apply**)
**Last Codex score:** Sprint 1 — 10.0/10 APPROVED ✅

**Что сделано в Sprint 2 (local):**
- `backend/schema.sql` обновлён (только schema_migrations bookkeeping)
- `backend/migrations/001-author-submissions.sql` написан и **применён локально**
- Все 7 таблиц созданы, ALTER выполнены, `schema_migrations` версия зафиксирована
- Re-run guard проверен: повторный apply → `ERROR duplicate column name: role`
- `backend/README.md` обновлён (Author Submissions + Migrations section)

**Что не сделано:**
- ⏸ 2.6-2.7: `wrangler d1 execute --remote --file=migrations/001-author-submissions.sql` — ЖДЁТ APPROVE ЕГОРА
- ⏸ Codex review Sprint 2 — запустится после remote apply + git commit

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

**2026-04-18 ~02:15** — Sprint 2 подспринты 2.1-2.5 + 2.8 закрыты. Local D1 мигрирована. Жду approve Егора на `wrangler d1 execute --remote --file=backend/migrations/001-author-submissions.sql`. Следующее действие после approve: remote apply → verify schema_migrations на prod → `/codex-review` → git commit → переход в Sprint 3.
