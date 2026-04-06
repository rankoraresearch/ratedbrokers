# Review Editor — Guide / Руководство

---

## English

### What is Review Editor?

Review Editor allows experts to edit broker review texts directly through the admin panel — without accessing the codebase or Git. Changes appear on the live site instantly.

### Access

**Admin access** (full control — all brokers, token management):
```
https://api.ratedbrokers.com/api/admin/reviews/dashboard?key=YOUR_ADMIN_KEY
```

**Expert access** (limited — only assigned brokers, no admin features):
```
https://api.ratedbrokers.com/api/expert/dashboard?token=YOUR_EXPERT_TOKEN
```

Expert tokens are created by the admin. Each token can be:
- Restricted to specific brokers (e.g. only Exness and IC Markets)
- Set to a specific language (EN, DE, ES, etc.)
- Given an expiration date

### How to Edit a Review

1. Open the Review Editor using your link (admin or expert)
2. Find the broker you want to edit — use the search bar or scroll the list
3. Click on the broker row or the **Edit** button
4. The editor modal opens with **15 section tabs**:
   - Overview, Scoring, Account Intro, Account Outro, Regulation, Costs, Spreads, Deposits, Platforms, Mobile, Support, Education, Trustpilot, Country, Verdict
5. Each tab shows the **current text** from the review
6. Edit the text in the textarea
   - Use **double line breaks** (`Enter` twice) to separate paragraphs
   - The text is plain text — no HTML or Markdown formatting needed
7. Click **Save Changes** — the override is saved and goes live within 5 minutes (CDN cache)
8. Green dot on a tab = this section has been edited (override active)
9. To undo your changes, click **Revert to Original** — this removes the override and restores the original text from the source file

### Important Notes

- Saving creates an **override** on top of the original text. The original is never lost.
- **Revert to Original** removes your edit and restores the source text.
- All edits are logged with timestamps and editor name.
- Changes are cached for 5 minutes — after saving, it may take up to 5 min to appear on the live site.
- If the editor shows empty content for a section, it means the original review doesn't have text for that section.

### For Admins: Managing Expert Tokens

Create a token via API:
```bash
curl -X POST "https://api.ratedbrokers.com/api/admin/reviews/tokens?key=ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "lang": "en",
    "broker_slugs": "exness,ic-markets,pepperstone",
    "expires_days": 30
  }'
```

- `name` (required) — expert's name (shown in audit log)
- `email` — optional, for your records
- `lang` — language code (default: "en")
- `broker_slugs` — comma-separated list of broker slugs, or omit for access to all brokers
- `expires_days` — token lifetime in days, or omit for no expiration

The response contains the `token` — share the expert link:
```
https://api.ratedbrokers.com/api/expert/dashboard?token=GENERATED_TOKEN
```

To revoke a token:
```bash
curl -X DELETE "https://api.ratedbrokers.com/api/admin/reviews/tokens/TOKEN_ID?key=ADMIN_KEY"
```

---

## Русский

### Что такое Review Editor?

Review Editor позволяет экспертам редактировать тексты обзоров брокеров напрямую через админ-панель — без доступа к коду или Git. Изменения появляются на сайте мгновенно.

### Доступ

**Доступ администратора** (полный контроль — все брокеры, управление токенами):
```
https://api.ratedbrokers.com/api/admin/reviews/dashboard?key=ВАШ_АДМИН_КЛЮЧ
```

**Доступ эксперта** (ограниченный — только назначенные брокеры):
```
https://api.ratedbrokers.com/api/expert/dashboard?token=ВАШ_ТОКЕН
```

Токены экспертов создаются администратором. Каждый токен может быть:
- Ограничен конкретными брокерами (например, только Exness и IC Markets)
- Привязан к конкретному языку (EN, DE, ES и т.д.)
- С ограниченным сроком действия

### Как редактировать обзор

1. Откройте Review Editor по вашей ссылке (админ или эксперт)
2. Найдите нужного брокера — используйте поиск или прокрутите список
3. Нажмите на строку брокера или кнопку **Edit**
4. Откроется редактор с **15 вкладками секций**:
   - Overview, Scoring, Account Intro, Account Outro, Regulation, Costs, Spreads, Deposits, Platforms, Mobile, Support, Education, Trustpilot, Country, Verdict
5. Каждая вкладка показывает **текущий текст** из обзора
6. Отредактируйте текст в текстовом поле
   - Используйте **двойной перенос строки** (`Enter` дважды) для разделения абзацев
   - Текст — простой текст, без HTML или Markdown
7. Нажмите **Save Changes** — изменение сохраняется и появится на сайте в течение 5 минут (кэш CDN)
8. Зелёная точка на вкладке = эта секция была отредактирована (override активен)
9. Чтобы отменить изменения, нажмите **Revert to Original** — это удалит override и вернёт оригинальный текст

### Важно

- Сохранение создаёт **override** поверх оригинального текста. Оригинал никогда не теряется.
- **Revert to Original** удаляет вашу правку и восстанавливает исходный текст.
- Все правки логируются с временными метками и именем редактора.
- Изменения кэшируются на 5 минут — после сохранения может потребоваться до 5 мин, чтобы правка появилась на сайте.
- Если редактор показывает пустое содержимое для секции, значит в оригинальном обзоре нет текста для этой секции.

### Для администраторов: управление токенами экспертов

Создание токена через API:
```bash
curl -X POST "https://api.ratedbrokers.com/api/admin/reviews/tokens?key=АДМИН_КЛЮЧ" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Петров",
    "email": "ivan@example.com",
    "lang": "en",
    "broker_slugs": "exness,ic-markets,pepperstone",
    "expires_days": 30
  }'
```

- `name` (обязательно) — имя эксперта (отображается в аудит-логе)
- `email` — опционально, для ваших записей
- `lang` — код языка (по умолчанию: "en")
- `broker_slugs` — список slug-ов брокеров через запятую, или не указывать для доступа ко всем
- `expires_days` — срок жизни токена в днях, или не указывать для бессрочного

Ответ содержит `token` — отправьте эксперту ссылку:
```
https://api.ratedbrokers.com/api/expert/dashboard?token=СГЕНЕРИРОВАННЫЙ_ТОКЕН
```

Отзыв токена:
```bash
curl -X DELETE "https://api.ratedbrokers.com/api/admin/reviews/tokens/TOKEN_ID?key=АДМИН_КЛЮЧ"
```
