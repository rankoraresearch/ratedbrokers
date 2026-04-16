# Outreach Sprints — Contact Enrichment Plan

> 7,805 доноров → поэтапное обогащение контактами для linkbuilding outreach.
> Правила: см. `OUTREACH-EMAIL-RULES.md`. Не отклоняюсь от правил.
> Данные в D1 (`donors` таблица), видны на `/api/admin/donors/dashboard`.

---

## 📊 Статус на 2026-04-16 (вечер)

| Статус | Кол-во | % |
|---|---|---|
| ✅ **found** (email + form) | **3,755** | **48%** |
| — с email | 3,306 | 42% |
| — только форма | 524 | 7% |
| ⚪ no_contact | 2,556 | 33% |
| 🛑 blocked | 684 | 9% |
| 💀 dead | 810 | 10% |

**v2 enrichment (завершено 2026-04-16):**

| Метрика | Значение |
|---|---|
| v2 processed | **3,559 / 3,755** (95%) |
| with primary_email (new v2 pick) | **2,902** |
| with fallback_email_1 | **1,308** |
| with fallback_email_2 | **722** |
| primary changed vs v1 | **497** |
| rescore updates | 120 changed + 12 placeholders cleared |
| errors | **0** |
| **Total emails flat** | **8,620** (primary + fallbacks + rank_N) |

**Выполнено:**
- ✅ Спринт 0 — Калибровка (regex настроен)
- ✅ Спринт 1-4 — Базовый regex прогон всех 7,805 (+3,616 found)
- ✅ Sprint A v1 — Playwright+stealth (+133 → 3,749)
- ✅ Sprint A v2 — hard-timeout 35s (+6 → 3,755)
- ✅ **v2 enrichment** — all_emails + primary + DR-aware scoring + source_snippet (3,559 обработано)
- ✅ **Codex review** — 3 HIGH пофикшены: no-overwrite-on-fail, retry/backoff, structured error log
- ✅ **Recovery 312 затёртых записей**
- ✅ **Dashboard UI** — новые колонки (primary/cat/host/source/fallbacks + tooltip со snippet)
- ✅ **XLSX export** — 9 вкладок, client-side SheetJS в dashboard

**В очереди (план добить оставшиеся 4,050):**
- 🔲 **Layer 3 — Deep Regex v2** — для 2,556 no_contact: footer-priority, reversed, obfuscated entities, SVG text, Squarespace/Wix hidden JSON. Ожидание: **+200-400 emails, ~2ч**
- 🔲 **Layer 4 — Wayback + WHOIS** — для 810 dead: архивные /contact страницы + registrant email. Ожидание: **+50-150 emails, ~1ч**
- 🔲 **Layer 5 — Google Cache + Playwright** — для 684 blocked: обход CF через cached views + stealth Chrome. Ожидание: **+100-250 emails, ~2ч**
- 🔲 **Layer 6 — Persona enrichment** — для 3,306 email'ов: добавить contact_name + contact_role (crawl /team, /about). Удваивает reply rate.
- 🔲 **Layer 7 — Campaign CSV export** — 3 сегментированных CSV + draft outreach templates

---

## Обзор распределения

| Сегмент | Кол-во доменов | % от общего |
|---|---|---|
| Priority (overlap≥2) | 1,374 | 18% |
| High DR без overlap (DR≥70) | ~2,110 | 27% |
| Mid DR без overlap (DR 40-69) | ~3,680 | 47% |
| Low DR (<40) | ~640 | 8% |
| **Всего** | **7,805** | **100%** |

---

## Сегментация по tier (в D1 колонка `tier`)

- `priority` — overlap≥2 (уже линкует 2+ конкурентов = доказанно broker-friendly)
- `high-dr` — DR≥70, overlap=1
- `mid-dr` — DR 40-69, overlap=1
- `low` — DR<40, overlap=1

---

## Спринт 0 — Калибровка (30 мин)

**Цель:** убедиться, что правила работают, прежде чем запускать на 1,374.

**Tasks:**
- [ ] Написать `scripts/enrich-donors.mjs` — парсит 30 случайных Priority доменов, следует правилам из `OUTREACH-EMAIL-RULES.md`
- [ ] Проверить вручную 10 результатов: правильный ли email выбран, корректный ли status
- [ ] Скорректировать extraction prompt и regex если промахиваюсь
- [ ] Убедиться, что admin page видит обновления (`status`, `email`, `checked_at`)

**Exit criteria:** на 30 доменах precision ≥85% (найденные email действительно валидны и best-tier по доступному).

---

## Спринт 1 — Priority Tier (1,374 доменов, ~90 минут)

**Цель:** обогатить все 1,374 overlap≥2 доменов. Это сердце outreach.

**Tasks:**
- [ ] Запустить `enrich-donors.mjs --tier=priority` в фоне
- [ ] Мониторинг через admin dashboard: `found X / 1374`
- [ ] Sub-segment by DR для приоритизации внутри спринта:
   - Sub 1a: `overlap≥2 AND DR≥70` (~200 доменов) — первый батч, 30 мин
   - Sub 1b: `overlap≥2 AND DR 40-69` (~800) — второй, 50 мин
   - Sub 1c: `overlap≥2 AND DR<40` (~370) — третий, 20 мин

**Deliverable:** ~65-75% Priority получат контакты (ожидаемый benchmark).

**Exit criteria:** все 1,374 имеют `status ≠ pending`. Экспортнуть CSV для Егора → `data/outreach-priority-YYYY-MM-DD.csv`.

---

## Спринт 2 — High DR без overlap (~2,110 доменов, ~3 часа)

**Цель:** обогатить DR≥70 доменов, которые ссылались только на 1 конкурента. Менее доказанно broker-friendly, но авторитетные.

**Tasks:**
- [ ] `enrich-donors.mjs --tier=high-dr`
- [ ] Параллельно: начать outreach-кампанию по Priority (Спринт 1 результаты)

**Deliverable:** +1,500-1,700 новых контактов.

---

## Спринт 3 — Mid DR без overlap (~3,680 доменов, ~5 часов)

**Цель:** добить средний tier. Большой объём, средний return.

**Tasks:**
- [ ] `enrich-donors.mjs --tier=mid-dr`
- [ ] **Возможно разбить на 2 подспринта** по 1,840 доменов, если устаю WebFetch лимит

---

## Спринт 4 — Low DR (<40, ~640 доменов) — ОПЦИОНАЛЬНО

**Принимаем решение после Спринта 3:** брать ли. Обычно DR<40 — это маленькие блоги, мусорная ценность.

Пропускаем, если outreach-кампаний по Спринтам 1-3 хватает.

---

## Спринт 5 — Второй проход (retry + Hunter.io)

**Цель:** добить `blocked` и `no_contact` через альтернативные инструменты.

**Tasks:**
- [ ] Все `blocked` → попробовать через headless browser (Playwright) или руками для топ-50 по DR
- [ ] Все `no_contact` DR≥60 → проверить через **Hunter.io / Apollo** API (если Егор даст ключ). Pattern-generation + domain-verification.
- [ ] `cf_email_protection` — расшифровать через `libcf-email` или manual

**Exit criteria:** DR≥60 + overlap≥2 имеют >90% coverage (email или form).

---

## Спринт 6 — Enrichment контактов (имя + должность)

**Цель:** превратить `editor@brand.com` в "Jane Smith, Editor in Chief" — это удваивает reply rate на outreach.

**Tasks:**
- [ ] Для всех `found` с editorial/PR email → WebFetch `/team`, `/about`, извлечь имя + должность
- [ ] Записать в новые колонки `contact_name`, `contact_role` (добавить в схему D1)

**Deliverable:** persona-enriched CSV готов для персонализированного outreach.

---

## Спринт 7 — Campaign-ready экспорт

**Цель:** Егор получает CSV, готовый к загрузке в outreach-инструмент (Pitchbox / BuzzStream / Mailshake / manual).

**Tasks:**
- [ ] Сгруппировать доноры по tier + топике (guest-post / editorial / PR)
- [ ] Для каждой группы — draft outreach template (я пишу, Егор утверждает)
- [ ] Экспорт:
   - `outreach-priority-guestpost.csv`
   - `outreach-priority-editorial.csv`
   - `outreach-high-dr-general.csv`
- [ ] Формат: `domain, dr, overlap, email, contact_name, contact_role, competitors_linked, suggested_template`

---

## Таймлайн

| Спринт | Длительность | Cumulative |
|---|---|---|
| 0 — Калибровка | 30 мин | 0.5h |
| 1 — Priority (1,374) | ~90 мин | 2h |
| 2 — High DR (2,110) | ~3h | 5h |
| 3 — Mid DR (3,680) | ~5h | 10h |
| 4 — Low DR (640) | ~1h | 11h |
| 5 — Retry / Hunter | варьируется | 13h |
| 6 — Persona enrichment | 2-3h | 16h |
| 7 — Campaign export | 1h | 17h |

**Реалистично:** ~2-3 рабочих дня wall clock time, с паузами и проверками Егора между спринтами.

---

## Exit criteria всего плана

- 7,805 доменов имеют `status ≠ pending`
- ≥60% от DR≥40 имеют `email` или `contact_form_url`
- ≥40% от `found` имеют `contact_name` + `contact_role`
- 3 готовых CSV для outreach campaign
- 3 draft templates (guest-post / editorial / PR)

---

## Контроль качества (Егору)

После каждого спринта отчёт в `logs/YYYY-MM.md`:
- found / no_contact / blocked / dead breakdown
- Топ-20 ценных находок (DR≥80 + email)
- Любые паттерны, которые стоит обсудить

Егор может:
- Остановить в любой момент
- Изменить правила (обновить `OUTREACH-EMAIL-RULES.md`)
- Попросить расширить scope или переделать tier
