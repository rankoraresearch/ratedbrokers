# Author Onboarding — Operator Guide

Для Егора: как выдавать доступ живым авторам, принимать их тексты и публиковать на сайте.

---

## Шаг 1 — Создать автора и выдать ссылку

### Самый простой путь: curl (1 команда)

```bash
export API_KEY='...'   # значение из wrangler secret put API_KEY

curl -X POST https://api.ratedbrokers.com/api/admin/authors/invite \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Writer",
    "email": "jane@example.com",
    "role": "author",
    "scopes": {
      "reviews":  ["ic-markets", "etoro", "xm"],
      "rankings": ["best-forex-brokers-uk"],
      "cards":    ["best-forex-brokers-uk:ic-markets", "best-forex-brokers-uk:*"],
      "langs":    ["en"]
    },
    "expires_days": 90
  }'
```

Response:
```json
{
  "ok": true,
  "id": 7,
  "token": "a82b4deb…",
  "invite_url": "https://ratedbrokers.com/author?token=a82b4deb…",
  "name": "Jane Writer",
  "role": "author",
  "lang": "en",
  "expires_at": "2026-07-17 02:35:22"
}
```

**Отправь `invite_url` автору.** Raw token в базе НЕ хранится — только SHA-256 хэш; потерянную ссылку невозможно восстановить, нужно ротировать.

### Scope шорткаты

| Что хочу разрешить | Как написать |
|---|---|
| Любой брокер | `"reviews": ["*"]` |
| Только конкретные брокеры | `"reviews": ["ic-markets", "etoro"]` |
| Любой рейтинг | `"rankings": ["*"]` |
| Карточка одного брокера в одном рейтинге | `"cards": ["best-forex-brokers-uk:ic-markets"]` |
| Любая карточка в конкретном рейтинге | `"cards": ["best-forex-brokers-uk:*"]` |
| Все карточки везде | `"cards": ["*"]` |
| Языки | `"langs": ["en"]` или `["en","ru"]` |

---

## Шаг 2 — Автор работает

1. Открывает invite URL → login gate парсит `?token=`, сохраняет в localStorage, редиректит в `/author/portal`
2. Выбирает `New submission` → target type → picker брокера/рейтинга → пишет MD → Save Draft / Submit for Review
3. Видит свой список submissions со статусами, может редактировать drafts и `needs_changes`

**Важно для авторов** (документируй в письме):
- Для review: разделяй секции через `## Section: Costs`, `## Section: Platforms`, etc. — Клод автоматически распределит по разделам ревью
- Для ranking: структура `## Intro`, `## Key Finding`, `## How We Ranked`, `## Outro`, `## FAQ` с парами `Q:...` / `A:...`
- Для card: обычный MD-текст, один абзац

---

## Шаг 3 — Ты проверяешь submission

1. Открой `https://api.ratedbrokers.com/api/admin/submissions/dashboard?key=$API_KEY`
2. Filter by status=Submitted → увидишь новые
3. Клик на строку → drawer с body
4. Решение:
   - **Accept** → если готово к обработке (опциональные notes)
   - **Request changes** → автор увидит `admin_notes`, сможет отредактировать и re-submit
   - **Reject** → terminal, автор notes увидит

---

## Шаг 4 — Обработка и публикация

После Accept появляются side-effect кнопки в drawer:

1. **Import to Review / Ranking / Card** → Клод (или ты через admin) разрезает body и пишет в draft-slot destination-таблицы. Submission → `processed`. Контент ЕЩЁ не виден публике.
2. Зайди на live-страницу (draft не виден), убедись что всё ок
3. **Publish to live site** → flip draft → live. Контент публикуется.
4. Если срочно нужно откатить: **Revert** → live-slot очищается, draft сохраняется. Можно потом снова Publish.

---

## Шаг 5 — Управление существующими авторами

### Список всех авторов и статусов
```bash
curl -H "Authorization: Bearer $API_KEY" \
  https://api.ratedbrokers.com/api/admin/authors | jq
```

### Изменить scopes
```bash
curl -X PATCH -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{"scopes":{"reviews":["*"],"rankings":["*"],"cards":["*"],"langs":["en"]}}' \
  https://api.ratedbrokers.com/api/admin/authors/7
```

### Отозвать токен (автор сразу 401)
```bash
curl -X PATCH -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{"active":false}' \
  https://api.ratedbrokers.com/api/admin/authors/7
```

### Rotate (новый токен, старый сразу 401)
```bash
curl -X POST -H "Authorization: Bearer $API_KEY" \
  https://api.ratedbrokers.com/api/admin/authors/7/rotate
# Response содержит новый invite_url — отправь автору
```

### Продлить expires
```bash
curl -X PATCH -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{"expires_days":180}' \
  https://api.ratedbrokers.com/api/admin/authors/7
```

### Изменить роль / email / lang
```bash
curl -X PATCH -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{"role":"author","email":"new@email.com","lang":"en"}' \
  https://api.ratedbrokers.com/api/admin/authors/7
```

---

## Шаг 6 — Оплата (когда дойдёт)

CSV экспорт всех сабмитов с фильтрами:
```bash
# Все published за период
curl "https://api.ratedbrokers.com/api/admin/submissions/export.csv?status=published&from=2026-04-01&to=2026-04-30&key=$API_KEY" \
  > submissions-april.csv
```

Колонки: id, author_name, author_email, target_type, target_slug, target_section, target_ranking_broker, lang, title, word_count, status, created_at, submitted_at, accepted_at, processed_at, published_at.

Formula-injection защита встроена.

---

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| Автор говорит «не могу залогиниться» | Скорее всего token expired/revoked. Проверь `GET /api/admin/authors`, посмотри `active` + `expires_at`. Rotate если нужно. |
| Автор пишет чушь или не по теме | Request changes с детальными admin_notes. Они видны автору в Portal. |
| Автор submit'нул, но ничего не появилось на сайте | Статус должен быть `published`. После import статус `processed` (draft в D1, невидимо). Нужен `Publish to live site`. |
| Один рейтинг публикуют двое авторов — как избежать конфликтов? | Публикуются per-field (разные секции ranking_content не конфликтуют). Если оба правят `intro_md` — побеждает последний publisher. |
| Ошибочно опубликовал — срочно снять | Revert в drawer. Или PATCH `review_overrides` status='draft' вручную через Review Editor. |

---

## Security quick check

- Raw tokens хранятся только в `invite_url` response и client localStorage. В D1 — только SHA-256 хэш.
- Токены имеют optional expiry (дефолт unset). Для production рекомендуется 90-180 days.
- Revoke = `active=false` → сразу 401. Rotate = новый токен, старый 401.
- Markdown sanitizer (server + client): `javascript:` / `data:` / `<script>` / event-handlers нейтрализуются на import+render.
- Rate limits: 30 submissions/day, 10 submit-actions/hr per автор.
- CSV export escape'ит formula-injection (`=+-@\t` prefixes).

Полная spec: `AUTHOR-SUBMISSIONS-SPEC.md`.
