# Admin Panel — Руководство

Админ-панель RatedBrokers — 7 разделов для управления контентом, трафиком и публикацией.

**Базовый URL:** `https://api.ratedbrokers.com`  
**Авторизация:** `?key=API_KEY` в каждом URL  
**Дизайн:** Dark theme (Vercel/Linear-style), responsive

---

## 1. Click Dashboard

**URL:** `/api/stats/dashboard?key=...`

Аналитика кликов по affiliate-ссылкам.

- **Summary cards:** Total clicks, Today, 7-day/30-day trends
- **Top brokers:** Таблица кликов по брокерам за выбранный период
- **Geographic heatmap:** Клики по странам
- **Referrer analysis:** Откуда приходят клики (домены)
- **Live feed:** Последние 40 кликов с метаданными (IP, source page, referrer)
- **Period selector:** 7d / 30d / 90d

---

## 2. Affiliate Links

**URL:** `/api/admin/dashboard?key=...`

Управление affiliate URL-ами всех брокеров.

- **Список брокеров:** slug, name, affiliate URL, 30-day clicks
- **Редактирование:** Inline edit affiliate URL и name
- **Аудит:** История изменений (old → new) с датами
- **Create/Delete:** Добавление и удаление брокеров
- **Bulk Import:** Вставка множества URL через paste (tab/pipe separated)
- **Export:** JSON export всех данных
- **Progress ring:** % настроенных URL (vs placeholder)

---

## 3. Rankings

**URL:** `/api/admin/rankings/dashboard?key=...`

Управление позициями брокеров в 207+ рейтингах.

- **19 групп рейтингов** (A-S): Forex by Style, Spreads, Execution, Account Type, и т.д.
- **Drag-and-drop:** Ручная перестановка позиций
- **Featured labels:** Назначение лейблов ("Best Overall", "Editor's Choice", и т.д.)
- **Hide brokers:** Скрытие брокеров из конкретного рейтинга
- **Pin Top 5:** Зафиксировать первые 5 позиций
- **Copy From:** Копировать порядок из другого рейтинга
- **Preview Link:** Ссылка на live-превью рейтинга
- **Reset:** Сброс к автоматическому расчёту
- **Top 10 marker:** Синяя пунктирная линия = Quick Grid на сайте

---

## 4. Publish

**URL:** `/api/admin/publish/dashboard?key=...`

Планировщик публикации страниц (831+ страниц EN).

- **Статусы:** Draft → Scheduled → Published
- **Auto-Schedule:** 16-недельный rollout с рандомизированным временем (anti-SpamBrain)
- **Batch operations:** Publish / Schedule / Unpublish множества страниц
- **Page types:** reviews, subpages, thematic, combinatorial, static
- **Tick:** Ручной запуск публикации due-страниц
- **Cron:** Автоматическая публикация каждый час
- **Sitemap:** Динамическая генерация sitemap.xml из published-страниц

---

## 5. Messages

**URL:** `/api/admin/messages/dashboard?key=...`

Просмотр заявок из контактной формы.

- **Список сообщений:** Имя, email, текст, дата
- **Поиск:** По имени, email, тексту
- **Expand:** Клик для полного текста
- **Delete:** Удаление отдельных сообщений
- **Stats:** Total / This Week / Today

---

## 6. Link Health

**URL:** `/api/admin/linkhealth/dashboard?key=...`

Мониторинг здоровья affiliate-ссылок.

- **Статусы:** OK (green) / BROKEN (red) / UNCHECKED (gray)
- **Auto-check:** Ежедневно в 06:00 UTC (HEAD request)
- **Manual recheck:** Кнопка для проверки отдельной ссылки
- **History:** Последние 50 проверок с HTTP-кодами и ошибками
- **Summary:** Total / Checked / Healthy / Broken

---

## 7. Review Editor

**URL:** `/api/admin/reviews/dashboard?key=...&lang=en`

Редактирование текстов обзоров брокеров. Подробная инструкция: [`REVIEW-EDITOR-GUIDE.md`](REVIEW-EDITOR-GUIDE.md).

- **Список брокеров:** С индикатором кол-ва правок и даты последнего редактирования
- **Rich text editor:** Quill WYSIWYG — **Bold**, *Italic*, [Link], списки
- **15 секций:** Overview, Scoring, Account Intro/Outro, Regulation, Costs, Spreads, Deposits, Platforms, Mobile, Support, Education, Trustpilot, Country, Verdict
- **Save / Revert:** Сохранение override или откат к оригиналу из MD-файла
- **Audit log:** Кто, когда, что менял (Recent Activity)
- **Green dots:** Индикатор отредактированных секций на табах
- **Мультиязычность:** `?lang=en` (сейчас EN, в будущем DE/ES/AR)

### Экспертный доступ

**URL:** `/api/expert/dashboard?token=EXPERT_TOKEN`

Упрощённый интерфейс для внешних экспертов (Rated.Editor, blue theme). Без навигации по остальным разделам админки.

- Эксперт видит только назначенные ему брокеры
- Токены создаются админом через API (см. [`REVIEW-EDITOR-GUIDE.md`](REVIEW-EDITOR-GUIDE.md))
- Токен может быть ограничен по брокерам, языку, сроку действия

---

## 8. Donors *(outreach backlinks)*
Адрес: `/api/admin/donors/dashboard`

Карта ~2,070 refdomains-донаторов для linkbuilding. Фильтры по DR/tier/status. Per-row details с emails + forms.

---

## 9. Authors *(outreach research)*
Адрес: `/api/admin/authors/dashboard`

Карта 579 авторов-конкурентов (не путать с Submissions!). Top Picks tab с realistic scoring. Не для управления нашими авторами — для research.

---

## 10. Submissions *(Author Submissions Pipeline)*
Адрес: `/api/admin/submissions/dashboard`

Приём сырых MD-текстов от живых авторов. Full pipeline: draft → submitted → accepted → processed → published (+ rejected, needs_changes, reverted).

### Что видит админ
- 4 KPI: Pending / Last 7 days / Total / Avg turnaround (hours)
- Фильтры: status, type (review/ranking/card), author name, lang
- Таблица сабмитов, click → slide-over drawer

### Drawer действия (по статусу)

**`submitted` →** PATCH `/status` review-decision:
- **Accept** → `accepted`
- **Request changes** → `needs_changes` (admin_notes обязательны, видны автору)
- **Reject** → `rejected` (admin_notes обязательны, terminal)

**`accepted` →** POST side-effect endpoints (атомарно с destination mutation):
- **Import to Review** (`target_type=review`) — body_md разрезается по `## Section: <key>` markers → N строк в `review_overrides` со `status='draft'`
- **Import to Ranking** (`target_type=ranking`) — body_md парсится по `## Intro / ## Key Finding / ## How We Ranked / ## Outro / ## FAQ` (с `Q:/A:` парами) → draft-slots в `ranking_content`
- **Import to Card** (`target_type=card`) — body_md → `ranking_overrides.description_md_draft`

**`processed` →** POST `/publish` — flip destination draft-slot → live-slot (контент становится виден публично).

**`processed` или `published` →** POST `/revert` — emergency unpublish, clear live-slot. Draft preserved, можно re-publish.

### Invite автора (UI — рекомендуемый путь)
Прямо в дашборде Submissions раскрывается блок **"👤 Invite a new author"**. Поля:
- **Name** (обязательно) · **Email** (опционально — для связи)
- **Reviews scope** — comma-separated slugs (`ic-markets,etoro`) или `*` для всех
- **Rankings scope** — аналогично (`forex-overall,best-forex-brokers-uk`) или `*`
- **Cards scope** — формат `ranking:broker` (`forex-overall:ic-markets`), per-ranking wildcard `forex-overall:*`, или глобальный `*`
- **Languages** — `en` (или несколько через запятую)
- **Expires** — дни до истечения (дефолт 90, макс 3650)
- **Role** — `Author` (дефолт — submits через portal) / `Expert` (legacy) / `Admin`

Пустое поле scope = запрещено. После submit появляется кнопка **"Copy invite URL"** — отправь её автору. Raw token виден ОДИН раз; он не хранится в базе (только SHA-256 хэш).

Ниже формы — таблица **Existing authors** с кнопками:
- **Rotate** — генерит новый токен (старый сразу 401). Используй если старую ссылку потеряли или компрометация
- **Revoke / Activate** — гасит/включает доступ мгновенно

### Invite автора (curl — для скриптов)
```bash
curl -X POST https://api.ratedbrokers.com/api/admin/authors/invite \
  -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"Jane Writer","email":"jane@example.com","role":"author",
       "scopes":{"reviews":["ic-markets","etoro"],"rankings":["best-forex-brokers-uk"],"cards":["best-forex-brokers-uk:etoro"],"langs":["en"]},
       "expires_days":90}'
```
Response содержит `invite_url` — копипастни автору. Токен хэшируется в D1 (SHA-256), raw видим только в invite response.

### Управление авторами
- `GET /api/admin/authors` — список
- `PATCH /api/admin/authors/:id` — update scopes / active / expires
- `POST /api/admin/authors/:id/rotate` — regenerate token (старый токен сразу 401)

### Export
- `GET /api/admin/submissions/export.csv?status=&from=&to=` — CSV для оплаты авторам (с formula-injection guard)

Подробнее: `AUTHOR-SUBMISSIONS-SPEC.md` (full architecture), `AUTHOR-ONBOARDING.md` (operator how-to).

---

## Навигация

Все 10 разделов доступны через верхнюю панель навигации (sticky topbar). Логотип "Rated.Admin" ведёт на Click Dashboard.

Общий дизайн: dark theme, glass-card summary, premium-table, green accent (#4ade80).

---

## Техническая реализация

- **Runtime:** Cloudflare Workers (edge, serverless)
- **Database:** Cloudflare D1 (SQLite, 11 таблиц)
- **Auth:** API Key в query parameter `?key=...`
- **UI:** Server-rendered HTML с embedded JS (не React — отдельное приложение)
- **Charts:** Chart.js (CDN) в Stats Dashboard
- **Rich Editor:** Quill v2 (CDN) в Review Editor
- **Layout:** Shared `adminLayout.js` — header, nav, footer, CSS variables

Полная API-документация: [`backend/README.md`](backend/README.md)
