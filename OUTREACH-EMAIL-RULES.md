# Outreach Email Discovery — Rules

> Правила поиска контактов по донорам из `donors` таблицы D1.
> Автор правил: сессия 15.04.2026. Я следую им при enrichment, без импровизации.

---

## 1. Приоритет типа контакта (лестница "best contact")

На каждом домене ищу ВСЕ контакты, но записываю в `email` ОДИН — самый высокий в лестнице. Остальные — в `notes`.

| № | Тип | Примеры | Вес |
|---|-----|---------|-----|
| 1 | Guest posts / write-for-us | `guestposts@`, `contribute@`, `submissions@`, `writers@` | 100 |
| 2 | Editorial | `editor@`, `editorial@`, `editors@`, `content@` | 80 |
| 3 | PR / Media | `pr@`, `press@`, `media@`, `publicity@` | 60 |
| 4 | Outreach / Partnerships | `partnerships@`, `outreach@`, `business@`, `bd@`, `collab@` | 50 |
| 5 | General info/contact | `info@`, `contact@`, `hello@`, `team@`, `admin@` | 30 |
| 6 | Personal editor email | `jane.doe@site.com` (если на странице "Editor: Jane Doe") | 70 (замена #2 если нет общего) |

**Если Guest-Post email найден, он всегда побеждает. Info@ — crash fallback.**

---

## 2. Какие страницы обхожу (порядок приоритета)

На каждом домене пытаюсь открыть в следующем порядке, **stop as soon as found high-tier email**:

```
1. / (homepage — footer, header, mailto в HTML)
2. /write-for-us, /write-for-us/, /writeforus, /guest-post, /guest-posts, /contribute, /submissions
3. /advertise, /advertising, /sponsorship, /sponsored-posts
4. /contact, /contact-us, /contact/
5. /about, /about-us
6. /team, /staff, /editorial-team, /our-team
7. /press, /media, /press-room
```

**Лимит:** макс **3 страницы на домен** (homepage + 2 deeper). Бюджет WebFetch.

**Stop conditions:**
- Нашёл tier-1 или tier-2 email → stop, записываю, идём к следующему домену
- 3 страницы обошёл, ничего → `status='no_contact'` или `blocked`
- Первая страница вернула 403/Cloudflare challenge → пробую `/contact` напрямую. Если снова 403 → `status='blocked'`

---

## 3. Правила извлечения email

1. **Regex для валидации:**
   ```
   /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g
   ```
2. **Фильтрация ложных:**
   - Отбрасываю: `example.com`, `yoursite.com`, `test@`, `noreply@`, `no-reply@`, `donotreply@`
   - Отбрасываю: email c доменом ≠ текущий домен (**кроме** руководящего — если `@gmail.com` прямо на "contact" странице, допускаю, но с пометкой)
   - Отбрасываю: `postmaster@`, `abuse@`, `webmaster@` (transport-уровневые, не outreach)
3. **Unicode / obfuscation:** ловлю `name [at] domain [dot] com`, `name AT domain DOT com`, HTML entities `&#64;`. LLM extracts these.
4. **JS-only email** (rendered via JS из `data-email` или Cloudflare obfuscation `.__cf_email__`): отмечаю `status='blocked'`, в notes "cf_email_protection" — их отдельным пайплайном.

---

## 4. Contact form URL — когда записываю

- Если **нет** email любого tier → записываю URL контактной формы (страница с `<form>` и полями для message/email).
- URL должен быть абсолютным (не относительным): `https://example.com/contact`.
- Проверяю: содержит `<form>` с `<textarea>` или `<input type="email">`.
- **Не** записываю URL если там только newsletter-подписка (`input type="email"` + ни одного textarea) — это лист рассылки, не форма связи.

---

## 5. Статусы

| Status | Когда ставлю |
|--------|--------------|
| `found` | Нашёл валидный email (любого tier) ИЛИ валидный contact form URL |
| `no_contact` | 3 страницы обошёл, email не нашёл, формы нет |
| `blocked` | Cloudflare 403/challenge, JS-only SPA с пустым HTML, consent-gate от которого не отбился |
| `dead` | Все 3 попытки вернули 404/500/таймаут, домен мёртв |
| `pending` | Ещё не обработан (default) |

Обновление `checked_at = datetime('now')` при любой записи.

---

## 6. Колонки в D1 после enrichment

```
email              — one best email (highest tier found)
contact_form_url   — только если нет email
contact_page_url   — URL страницы, где нашёл email (для аудита)
status             — см. §5
notes              — свободный текст: все остальные найденные email, tier#, "cf_email_protection", "JS-SPA", "redirect chain to paywall" и т.д.
checked_at         — timestamp обработки
```

---

## 7. Batch & rate

- Батч: **30 доменов параллельно** (Promise.all) → write to D1 bulk → next batch
- Пауза между батчами: **3 секунды** (anti-rate-limit)
- Retry: 1 повтор при таймауте или 5xx. При 403 — не ретраю (явный block).
- Таймаут на домен: **25 секунд** total (не более 3 страниц × 8s).
- **На 30-40 доменов тратим ~60-90 сек.** 1374 домена = ~60-80 минут.

---

## 8. Что НЕ делаю

- **Не гадаю email-паттерны**: если на сайте нет "editor@brand.com", не пишу его на авось. Outreach на гадание = spam.
- **Не лезу в LinkedIn, Twitter, Facebook profiles** сотрудников — это отдельный пайплайн (Hunter.io / Apollo).
- **Не обхожу** Cloudflare challenges, капчи, consent walls — ставлю `blocked`, Егор разберётся вручную.
- **Не беру** email из PGP-ключей, SSL сертификатов, WHOIS.
- **Не пишу** одинаковый email на ≥10 доменов подряд (признак feed-агрегатора или CMS template — проверяю, возможно `blocked`).

---

## 9. Red flags — домены, которые сразу `blocked`/`dead`

- 10+ redirect chain
- `.blogspot.*`, `.wordpress.com`, `.tumblr.com` поддомены (уже в фильтре merge-скрипта, но на случай если проскочило)
- Expired cert warnings
- Parking pages ("This domain is for sale")
- AdSense-only thin content (single-page auto-generated scam)

Заметил такое → `status='dead'` + `notes='parked'` или `notes='scam-aggregator'`.

---

## 10. Логирование

Каждый батч → строка в логе сессии (`logs/YYYY-MM.md`):
```
HH:MM — enrichment batch N (30 domains): found=21, no_contact=4, blocked=3, dead=2 — 62s
```

После завершения спринта → сводка в `AHREFS-DATA-LOG.md`:
```
Enrichment Sprint N (YYYY-MM-DD): 1,374 Priority → found 890 (65%), no_contact 284, blocked 150, dead 50
```

---

## 11. Эскалация к Егору

Останавливаюсь и пишу Егору в чат **только** если:
- Rate-limited на >50% доменов батча (что-то массово блочит)
- Ahrefs / D1 API вернул 5xx > 10 раз подряд (инфра-сбой)
- Появился паттерн, которого нет в правилах (пример: 20% доменов отдают русскоязычные контакты — нужно ли их отдельно помечать?)

**Иначе** работаю тихо, отчитываюсь по окончании спринта.
