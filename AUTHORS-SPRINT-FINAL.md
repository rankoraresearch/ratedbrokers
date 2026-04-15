# Authors Sprint — Final Operational Instruction

Главный документ для запуска спринта на 102 сайта.

**Цель**: страница https://ratedbrokers.com/research/authors с ~500 реальными авторами из 6 категорий источников, enriched с E-E-A-T сигналами, scored, готова для outreach.

**Парные документы** (читать перед стартом):
- `AUTHORS-HARVESTING-PLAYBOOK.md` — методология (10 слоёв, 7 правил)
- `EEAT-AUTHOR-CRITERIA.md` — E-E-A-T характеристики и scoring
- `AHREFS-DATA-LOG.md` — outlet DR + 122K refdomain CSV
- `src/data/authorsSample.js` — MVP dataset (34 авторов, готовая схема)

---

## 1. Вход / выход

### Вход (уже готово)
- **102 сайта** в `src/pages/CompetitorsResearchPage.jsx` (6 категорий: 26 direct competitors, 19 finance editorial, 17 trading media, 19 tier-1 press, 10 crypto, 6 prop firms)
- **11 Ahrefs CSV** с 122K refdomains в `data/ahrefs-refdomains-2026-04-14/`
- **Outlet DR данные** для 5 MVP-сайтов — остальные 97 нужно добавить в SITES
- **34 авторов MVP** (BrokerChooser, NerdWallet, FXStreet, WSJ, Cointelegraph) — используются как эталон

### Выход
1. **Данные**: `src/data/authorsSample.js` → расширен до 500+ авторов (переименовать в `authors.js` когда понятно что это не sample)
2. **Страница**: https://ratedbrokers.com/research/authors (noindex) с полным фильтр-интерфейсом
3. **Лог**: `logs/2026-04.md` с per-site отчётом (coverage, failures, needs_manual_review count)
4. **Sprint summary report**: top-20 Tier S/A targets для первой outreach-волны

---

## 2. Sprint phases — 7 этапов

| Phase | Название | Est | Deliverable | Checkpoint |
|---|---|---|---|---|
| 0 | Pre-flight | 1-2ч | `scripts/authors-sources.json` с author URL pattern для 102 сайтов | ✅ Егор одобряет discovery map |
| 1 | Outlet metadata | 2ч | Все 102 outlets в `SITES{}` с dr, tier, competitorBacklinks | — |
| 2 | Enumeration | 5-7ч | Список всех авторов (имена + URL) per-outlet | — |
| 3 | Layer 5.5 enrichment | 6-8ч | Bio, socials, education, credentials для каждого | ✅ промежуточный отчёт на ~100 авторах |
| 4 | Rule A verification | 2-3ч | Per-author WebSearch для gap-filling | — |
| 5 | E-E-A-T Pass 1 | 2ч | Automatic extraction из bio + cross-ref с 122K CSV | — |
| 6 | Quality pass (Rule E) | 1-2ч | Systematic check всех 7 правил по всем записям | ✅ финальный ревью |
| 7 | Deploy | 30 min | Commit + push → Cloudflare Pages live | — |

**Итого: 20-25 часов работы**, ~500 авторов.

**Phase 8 (опционально, после)**: mini-sprint для top-150 авторов — deep E-E-A-T (FINRA BrokerCheck, Google Scholar, books ISBN, awards). ~2-3ч, ~1200 queries.

---

## 3. Phase 0 — Pre-flight (Discovery map)

### Цель
Для каждого из 102 сайтов заранее узнать:
- Где живут авторы (URL pattern: `/author/{slug}`, `/team/{slug}`, `/authors/{slug}`, `/contributors/{slug}`, `/meet-the-team`, `/editorial-team`, `/{custom-path}`)
- Есть ли Cloudflare/paywall (предупреждение для Phase 2-3)
- Subdomain checks (`about.`, `blog.`, `magazine.`, `news.`)
- Aggregate URL (список всех авторов) vs только per-author pages

### Метод
Для каждого сайта:
```
1. WebSearch: site:{domain} author OR team OR experts
2. WebSearch: site:{domain}/author OR site:{domain}/team
3. Try 10 canonical paths via WebFetch:
   /author/, /authors/, /team/, /contributors/,
   /meet-the-team/, /our-experts/, /editorial-team/,
   /about/team/, /staff/, /people/
4. Если 1-3 пусто:
   - Load homepage HTML, parse nav/footer for team link
   - Check e-e-a-t pages: /editorial-guidelines, /methodology, /how-we-rate
5. Check subdomains: about.{domain}, blog.{domain}, news.{domain}
6. Для tier-1 press (WSJ/FT/Bloomberg/Reuters/CNBC/Forbes):
   → сразу Muck Rack: muckrack.com/media-outlet/{outlet}
```

### Output: `scripts/authors-sources.json`

```json
{
  "brokerchooser": {
    "teamUrl": "https://brokerchooser.com/team",
    "authorUrlPattern": "https://brokerchooser.com/team/{slug}",
    "aggregateUrl": "https://brokerchooser.com/team/analysts-editors",
    "blockStatus": "cloudflare_403",
    "fallbackStrategy": "websearch_primary",
    "subdomainsFound": [],
    "discoveryMethod": "L7+L1",
    "notes": "WebFetch blocked. Use WebSearch + per-author Rule A."
  },
  "wsj": {
    "teamUrl": null,
    "authorUrlPattern": null,
    "aggregateUrl": "https://muckrack.com/media-outlet/wsj",
    "blockStatus": "paywall",
    "fallbackStrategy": "muckrack_primary",
    "discoveryMethod": "L9",
    "notes": "No public author pages. Muck Rack is the canonical source."
  },
  ...
}
```

### Checkpoint 1 — Егор одобряет map
Перед началом Phase 2 показываю этот JSON. Если какие-то URL'ы неправильные — исправляем, потом двигаемся дальше. Это экономит 10+ часов рефакторинга.

---

## 4. Phase 1 — Outlet metadata

### Задача
Каждый из 102 сайтов должен иметь в SITES:
- `dr`, `traffic` (из Ahrefs API или ручного lookup)
- `tier` (T1/T2/T3/T4 из DR)
- `competitorBacklinks{refdomains, totalLinks, topLinker}` (cross-ref с 11 CSV)

### Метод
1. **DR + traffic**: для 5 MVP — уже есть. Для 97 оставшихся:
   - Если месячный лимит Ahrefs восстановился → `scripts/ahrefs-metrics.mjs` batch
   - Если нет → ручной WebSearch «{domain} Ahrefs DR» + Wikipedia-известные значения (WSJ/FT/Bloomberg DR ≈ 92-95)
2. **Competitor backlinks cross-ref**:
   - Для каждого outlet-домена — `grep -E "^{domain}," data/ahrefs-refdomains-2026-04-14/*.csv`
   - Считаем сколько CSV содержат домен = `refdomains` count
   - Суммируем `links_to_target` column = `totalLinks`
   - Argmax по links = `topLinker`

### Автоматизация
Быстрый bash one-liner:
```bash
for outlet in $(cat scripts/outlets.txt); do
  # grep across all competitor CSVs, sum up
done
```

---

## 5. Phase 2 — Enumeration

### Задача
Для каждого сайта получить полный список авторов (имена + author URL если есть).

### Метод per site

**Если `aggregateUrl` есть и открывается**:
```
1. Layer 5.5: WebFetch с промптом Rule C (list ALL URLs)
2. Parse: найти все href вида /author/{slug}, /team/{slug}
3. Store: {name, authorUrl, discoveryMethod: "L5.5_aggregate"}
```

**Если aggregate заблокирован (Cloudflare/paywall)**:
```
1. Multi-query Layer 7 WebSearch:
   site:{outlet}/author "trading"
   site:{outlet}/author "investing"
   site:{outlet}/author "forex"
   site:{outlet}/author "crypto"
   site:{outlet}/author "editor"
   site:{outlet} "written by"
   site:{outlet} "reviewed by"
2. Dedup результатов, extract author URLs
3. Store: {name, authorUrl, discoveryMethod: "L7_multi_query"}
```

**Tier-1 press (WSJ, FT, Bloomberg, Reuters, CNBC, Forbes, BI, etc.)**:
```
1. Muck Rack первый:
   WebFetch: muckrack.com/media-outlet/{slug}
   → parses JSON with journalist list
2. Filter by beat (personal finance / markets / brokers / investing)
3. Если Muck Rack неполный:
   LinkedIn Company People: linkedin.com/company/{brand}/people/
   → scrape top-20 с title containing Writer/Editor/Journalist/Reporter
```

### Cap per site

| Site size | Cap authors |
|---|---|
| Large (Investopedia, NerdWallet, WikiFX, Benzinga, SeekingAlpha) | 30-50 |
| Medium (BrokerChooser, ForexBrokers, Morningstar) | 15-25 |
| Small (TheInvestorsCentre, GoodMoneyGuide, 55Brokers) | 5-15 |
| Tier-1 press | 10-15 (фильтр по beat) |
| Prop firms | 5-8 |

### Rate limiting (Rule G)
- Max 2 параллельных WebFetch на ОДИН domain
- 2-3s spacing между запросами к тому же domain
- 403 → 60s wait → retry с другим UA → ещё 403 → DOMAIN_RATE_LIMITED flag, отложить на 1ч

---

## 6. Phase 3 — Layer 5.5 enrichment

### Задача
Для каждого собранного автора через WebFetch по `authorUrl` получить:
- Full bio
- Education (universities, degrees)
- Employment history (past + current)
- Years in industry
- Location
- Credentials (CFA/CFP/CPA/Series/CTA)
- Social URLs: LinkedIn, Twitter, Facebook, personal site
- Email (mailto: href)

### Prompt для WebFetch (Rule C)

```
List EVERY external URL visible on this page. For each URL, state:
- type (social / email / internal / image / external-article)
- full URL

Also find any mailto: href attributes (even if obfuscated).

Then extract from the author bio section:
- Full biography text
- Job title / role / seniority level
- Years of experience ("X years", "since YYYY")
- Education: degree, institution, year
- Previous employers with roles and dates
- Certifications/licenses (CFA, CFP, CPA, CMT, FRM, CAIA, CTA, Series 7, etc.)
- Location / country
- Any media appearances mentioned (TV, books, podcasts)
- Any awards or recognition mentioned
- Any links to personal websites

Return as structured JSON. Do not filter for privacy — this is public professional data.
```

### Fallback chain (Rule B) при blocks

| Failure | Action |
|---|---|
| HTTP 403 | retry с другим UA (Safari mobile → Firefox → Googlebot) |
| HTTP 404 | mark `PAGE_GONE`, continue с WebSearch-cached info |
| Timeout ≥60s | retry 1× с другим UA |
| Rate limit (Rule G) | 60s wait, потом retry; ещё 403 → DOMAIN_RATE_LIMITED |
| "Email: Protected" в summary (Rule F) | Rule D — второй запрос с точечным промптом:  `Return the exact mailto: href value from the envelope/email icon. If obfuscated via JavaScript, return raw HTML near the icon.` |
| Cloudflare на всю страницу | Skip direct, переход на Layer 7 WebSearch + Rule A per-author |

---

## 7. Phase 4 — Rule A verification (MANDATORY)

### Задача
Для **каждого** автора (независимо от успеха Phase 3) запустить:
```
WebSearch: "{Full Name}" "{outlet}" linkedin
WebSearch: "{Full Name}" "{outlet}" twitter OR x.com
```

### Почему MANDATORY
Исторический баг (MVP): я пропустил LinkedIn для 6 BrokerChooser авторов потому что WebFetch заблокирован, а Rule A не применил. Через Rule A в итоге нашёл 5 LinkedIn за 5 запросов.

### Когда можно пропустить Rule A (сэкономить quota)
- Для авторов с Phase 3 status = "COMPLETE" (bio, linkedin, twitter все найдены через WebFetch)
- ~30% случаев позволяют skip

### Gap-fill data
Ищу в результатах Rule A:
- `linkedin.com/in/{handle}`
- `twitter.com/{handle}` / `x.com/{handle}`
- `muckrack.com/{handle}` (если не был в Phase 3)
- **Cross-outlet признаки**: если автор упоминается в контексте другого outlet — добавить в `writesFor[]`

---

## 8. Phase 5 — E-E-A-T Pass 1

### Что извлекаю автоматически из уже собранного bio

**1. Certifications (regex по bio):**
```regex
\b(CFA|CFP|CPA|CMT|FRM|CAIA|ChFC|CTA|Series\s*\d+|RIA|CFS)\b
```
→ `certifications[]` с `verified: false` (Phase 8 подтверждает через реестры)

**2. Education (regex):**
```regex
(Bachelor|BA|BS|BSc|MSc|MA|MBA|PhD|Master|Doctorate)\s+(of|in)?\s+(\w+\s*\w*)?\s*(at|from)?\s*([A-Z][a-z]+(\s+[A-Z][a-z]+)+\s+(University|College|School))
```
→ `education[{degree, school, year}]`

**3. Employment history:**
Look for "ex-", "previously", "before joining", "worked at", "former" in bio + specific org names (Bloomberg, WSJ, GS, Merrill Lynch, Fisher, etc.)

**4. Years in industry:**
```regex
(\d+)\+?\s*(years|yrs)\s+(of\s+)?(experience|in)
since\s+(\d{4})    → calc from current year
```

**5. Location:**
```regex
(based in|from)\s+[A-Z][a-z]+(?:,\s*[A-Z]{2,})?
```

**6. Media mentions (quotedInTier1):**
Scan bio for: WSJ, Wall Street Journal, Financial Times, FT, Bloomberg, Reuters, CNBC, NYT, New York Times, Forbes, Barron's, MarketWatch, AP, Associated Press.

**7. TV appearances:**
Scan: CNBC, Bloomberg TV, Fox Business, BBC, CBS, NBC, ABC, Today Show, "appeared on".

**8. Books (authored):**
Scan: "authored", "wrote the book", "book \"...\"", ISBN patterns.

### Cross-reference с 122K competitor refdomains (free, уже в репо)

Для каждого outlet:
```bash
grep -c "^{domain}," data/ahrefs-refdomains-2026-04-14/*.csv
```
→ `SITES[outlet].competitorBacklinks.refdomains`

Этот signal inherited per-author: если outlet цитируется 5+ конкурентами → авторы этого outlet получают `+5` к authoritativeness.

### Output: `authoritativenessScore` (0-50) + `eeatTier` (S/A/B/C)

Формула — в `src/data/authorsSample.js::calcAuthoritativeness()` (готова).

---

## 9. Phase 6 — Quality pass (Rule E systematic)

### Задача
Прогнать все 7 правил (A-G) по всем 500 записям как **скрипт**, найти нарушения, зафиксировать.

### Automated checks

```js
for (const author of AUTHORS) {
  // Rule A: per-author WebSearch done?
  if (!author.linkedin && !author.twitter && !author.email) {
    author.needsManualReview = true;
    author.flags.push("NO_SOCIALS_AFTER_RULE_A");
  }

  // Rule F: email observed but not extracted?
  if (author.emailVerified === "observed_obfuscated" && !author.email) {
    author.needsEmailRetry = true;
    author.flags.push("EMAIL_OBFUSCATED_NEEDS_RETRY");
  }

  // Bio sanity: role + bio should both exist
  if (!author.bio || author.bio.length < 20) {
    author.flags.push("BIO_TOO_SHORT");
  }

  // Role conflict: multiple sources give different roles
  if (author.roleConflictSources?.length > 1) {
    author.flags.push("ROLE_CONFLICT");
  }

  // Discovery method tracking
  if (!author.discoveryMethod) {
    author.flags.push("MISSING_DISCOVERY_METHOD");
  }

  // Recompute score (в случае изменений данных)
  author.score = calcAuthorScore(author);
  author.authoritativeness = calcAuthoritativeness(author);
  author.finalScore = calcFinalScore(author);
  author.eeatTier = deriveEEATTier(author.authoritativeness);
}
```

### Итоговый отчёт
- Total authors
- Coverage per outlet (100% / 50%+ / <50% / 0%)
- needsManualReview count (expected 5-10%)
- needsEmailRetry count
- Tier distribution S/A/B/C
- Flagged authors list с причинами

---

## 10. Characteristics — полный список и где хранится

### Основные (collected Phase 2-4)

| Поле | Откуда | Phase |
|---|---|---|
| `name`, `role`, `seniority` | bio + Phase 2 enumeration | 2+3 |
| `site`, `authorUrl` | enumeration | 2 |
| `bio` | Layer 5.5 WebFetch | 3 |
| `linkedin`, `twitter`, `email` | Layer 5.5 + Rule A | 3+4 |
| `muckrack`, `personalSite` | Layer 5.5 + Rule A | 3+4 |
| `badge` (A/B) | auto from beat tags | 5 |
| `writesFor[]` | cross-outlet detection в Phase 4 | 4 |
| `status` (active/former) | bio keywords | 3 |

### E-E-A-T (collected Phase 5)

| Поле | Метод | Phase |
|---|---|---|
| `certifications[]` | regex по bio | 5 |
| `education[]` | regex по bio | 5 |
| `employmentHistory[]` | parse bio + LinkedIn scrape | 5 |
| `yearsInIndustry` | regex "X years" / "since YYYY" | 5 |
| `location` | regex "based in" | 5 |
| `mediaSignals.quotedInTier1[]` | regex top-20 outlet names в bio | 5 |
| `mediaSignals.tvAppearances[]` | regex TV channel names | 5 |
| `mediaSignals.authoredBooks[]` | regex "book", "authored" | 5 |
| `mediaSignals.muckrackArticleCount` | Layer 5.5 на muckrack page | 3 если есть URL |
| `citationSignals.citedByCompetitors` | cross-ref с 122K CSV | 5 |
| `trustSignals.ownedDomain` | WHOIS / bio mention | 5 |
| `trustSignals.linkedinVerified` | LinkedIn scrape (badge icon) | 3 (optional) |
| `trustSignals.finraBrokerCheckStatus` | Phase 8 only | 8 |

### Auto-computed

| Поле | Формула |
|---|---|
| `score` (0-100) | outlet DR × 0.35 + badge + seniority + socials + certs + multi-outlet + competitor-linked |
| `authoritativeness` (0-50) | certs×8 + years + tier-1 mentions + TV + books + muckrack + domain + outlets-count + competitor + FINRA − former |
| `finalScore` | score × (1 + authoritativeness / 100) |
| `eeatTier` | S (≥40) / A (25-39) / B (12-24) / C (<12) |

---

## 11. Circumvention playbook — что делать при блоках

Это самая ценная часть — на опыте MVP.

### 11.1 Cloudflare 403 (BrokerChooser, некоторые другие)

**Симптомы**: WebFetch возвращает 403, curl тоже 403 даже с Safari UA.

**Что делать** (в порядке):
1. **Не сдавайся после одного 403** — это Rule B.
2. Try curl с 5 разными UA:
   ```bash
   curl -A "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)..."
   curl -A "Googlebot/2.1 (+http://www.google.com/bot.html)"
   curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0"
   ```
3. Wayback: `web.archive.org/web/2024/{url}` — Claude Code может не достучаться напрямую, но через WebSearch найти снимки.
4. Google cache: `cache:{url}` через WebSearch.
5. **Rule A — WebSearch per-author** для gap-fill. Это почти всегда даёт LinkedIn (если у автора публичный).

**Что НЕ делать**: не помечать outlet "BLOCKED, skip" — это губит потенциальные 10-20 целей.

### 11.2 Paywall (WSJ, FT, Barron's, Bloomberg)

**Симптомы**: страница частично загружается, но author-bio скрыт.

**Что делать**:
1. **Muck Rack — primary источник** для tier-1 press. 80% журналистов там зарегистрированы.
2. LinkedIn Company People для senior editors (usually public).
3. Google News search: `"{author}" "{outlet}"` — часто первые 3 результата дают bio info.
4. ZoomInfo / RocketReach — email за paywall, но имена + роли открыты.

### 11.3 Rate limit (NerdWallet, возможно другие)

**Симптомы**: 4 параллельных WebFetch → все 403.

**Что делать**:
1. **Rule G с самого начала**: max 2 параллельных к одному domain, 2-3s spacing.
2. На 403 → `sleep 60s` → retry с другим UA.
3. На второй 403 → domain флаг `RATE_LIMITED`, пауза 1 час, resume позже.
4. Параллельно обрабатывать **разные** domains, не один.

### 11.4 Email obfuscated / protected (Rule F)

**Симптомы**: WebFetch summarizer возвращает "Email: Protected" или "Email: Obfuscated".

**Что это значит**: email **ЕСТЬ** на странице, но в виде JS-обфусцированного `<a href="mailto:...">`. Summarizer видит иконку, но не извлекает raw href.

**Что делать (Rule D)**:
```
Second WebFetch pass с промптом:
"Return the EXACT mailto: href attribute value as it appears in HTML. 
Find any <a href="mailto:..."> tags. If obfuscated via JavaScript, 
return the raw HTML snippet around the envelope icon."
```

Если и после этого нет → `emailObservedButNotExtracted: true` flag, Phase 8 ручной check.

### 11.5 404 Page Gone

**Симптомы**: author URL возвращает 404 (автор удалён из сайта после ухода).

**Что делать**:
1. Mark `discoveryNote: "PAGE_GONE"`, `status: "former"`
2. Keep record (former authors имеют networking value)
3. WebSearch fallback даст cached bio info

### 11.6 Google не индексирует новый автор

**Симптомы**: автор недавно присоединился, Google ещё не проиндексировал его страницу.

**Что делать**:
1. WebSearch покажет только 0-1 результат.
2. Если у сайта есть aggregate page — оттуда имя.
3. Layer 5.5 direct fetch через authorUrl pattern (можно guess slug из имени).
4. Если и это провал → пропустить, добавится на следующей итерации через месяц.

### 11.7 Ложные positive-matches в Rule A (имена-омонимы)

**Симптомы**: WebSearch для "John Smith" возвращает LinkedIn совсем не того John Smith.

**Что делать**:
1. **Валидация**: первый результат должен содержать outlet name в title/description.
2. Если outlet не упомянут в первых 3 результатах → skip match, `linkedin: null`.
3. Для имён с омонимами (John Smith, Mike Jones) — более специфичные queries: `"{full name}" "{outlet}" "{exact role}"`.

### 11.8 Muck Rack rate limit / paywall на full profile

**Симптомы**: bio preview видно, но article list за paid tier.

**Что делать**:
1. Имя + outlet + beat — бесплатно видно. Этого достаточно для Phase 2.
2. `muckrackArticleCount` requires scrape — если paid-wall → оставить null, добавить в Phase 8 (с подпиской).

### 11.9 LinkedIn login wall

**Симптомы**: клик на LinkedIn URL → "Please sign in to see profile".

**Что делать**:
1. Public первые 200 char bio часто visible без login.
2. Company People page (`linkedin.com/company/{brand}/people/`) показывает top-10 employees без login.
3. Для deeper scrape — Proxycurl API (paid, отложено).

### 11.10 Обновление bio — role changed vs сайт не обновили

**Симптомы**: Google snippet говорит "Senior Writer", но fresh WebFetch страница говорит "Editor & Content Strategist" (случай Alana Benson).

**Что делать**:
1. **Fresh WebFetch wins** — страница outlet — single source of truth.
2. Google snippet может быть устаревшим (до 30 дней lag).
3. Flag `ROLE_CONFLICT` если разные источники в пределах Phase 3 дают разные роли.

---

## 12. Data collection schema (canonical)

См. `src/data/authorsSample.js` — этот файл готов к масштабированию. Только добавляй записи по тому же шаблону.

Для каждого нового site обновить `SITES{}` map с:
```js
{
  slug, name, url, category (1-6), categoryLabel,
  dr, traffic, tier,
  competitorBacklinks: { refdomains, totalLinks, topLinker }
}
```

Для каждого автора — шаблон record из existing MVP (34 authors). Все поля обязательны в схеме, null допустим если не нашли.

---

## 13. Checkpoints с Егором

### Checkpoint 1 — после Phase 0 (discovery map)
Показать: `scripts/authors-sources.json` с URL pattern для всех 102 сайтов.
Егор проверяет: правильные ли URL? Нет ли пропущенных subdomains? Правильно ли identified paywall/Cloudflare сайты?

### Checkpoint 2 — mid-sprint на ~100 авторах (после Phase 3 enrichment для первых 20 сайтов)
Показать: первые 100 записей на `/research/authors` page. Егор проверяет качество: полные bio, заполненные socials, разумные E-E-A-T tier'ы.
**Правка**: если methodology ломается на каком-то типе outlet — обновляем playbook перед продолжением.

### Checkpoint 3 — финал (после Phase 6 Quality pass)
Показать: полный dataset 500 авторов, filterable, Tier distribution, `needsManualReview` list.
Егор проверяет: выборка Tier S/A совпадает с интуитивным представлением о топ-targets.

### Checkpoint 4 — после Phase 7 deploy
Live URL https://ratedbrokers.com/research/authors работает, noindex, доступна.

---

## 14. Что НЕ делаем (по решению Егора и best practices)

- **Outreach статус-трекинг** (contacted/replied/etc) — отложено до первой outreach-волны
- **`target_url_suggestion`** (ссылки на money pages) — отложено
- **Платные API** (Hunter.io, Proxycurl, Clearbit) — только если free methods дали <50% email coverage
- **Phase 8 deep E-E-A-T** (FINRA BrokerCheck, Scholar, awards) — отдельный mini-sprint для top-150 после основного
- **Tier-1 full journalist enumeration** — cap 15 per outlet (персонал filtered по broker/investing beat)
- **WSJ/FT deep paywall scraping** — Muck Rack primary
- **Subreddit / Quora knowledge mining** — too noisy для автоматизации
- **AI-generated content detection** — не наша задача, фильтруем только FORMER/HIDDEN статусы

---

## 15. Тайминг + параллелизм

### Реалистичный график

**Day 1** (8 часов активной работы):
- 09:00-11:00 — Phase 0 (discovery map) + Checkpoint 1
- 11:00-13:00 — Phase 1 (outlet metadata) + start Phase 2 enumeration
- 13:00-17:00 — Phase 2 full enumeration (102 сайта)

**Day 2** (8 часов):
- 09:00-12:00 — Phase 3 Layer 5.5 enrichment — первые 50 outlets (batch by domain groups)
- 12:00-14:00 — Checkpoint 2 + правки
- 14:00-17:00 — Phase 3 continuation (остальные 50 outlets)

**Day 3** (6 часов):
- 09:00-11:00 — Phase 4 Rule A verification (500 авторов × 2 queries = 1000 WebSearch)
- 11:00-13:00 — Phase 5 E-E-A-T Pass 1 (regex + cross-ref CSV, ~автомат)
- 13:00-14:00 — Phase 6 Quality pass + Checkpoint 3
- 14:00-15:00 — Phase 7 deploy

**Итого 22 часа** (+ 2-3ч buffer на unexpected blocks) = **2-3 рабочих дня**.

### Rate budget
- WebSearch: ~1500-2000 queries total (Phase 2 + Phase 4)
- WebFetch: ~600-800 requests (Phase 3 + Layer 5.5)
- Rate limit per domain: 2 parallel × 2s spacing = ~1800 req/hour peak

---

## 16. Exit criteria (когда спринт considered "done")

✅ 500+ авторов в dataset
✅ Coverage 100% на 102 сайтах (может быть 1-3 AUTHORS_HIDDEN site'а — ок)
✅ Average `needsManualReview` rate ≤ 10%
✅ Top 50 по finalScore — все имеют LinkedIn или email
✅ Tier distribution: S ≥ 20, A ≥ 150, B ≥ 200, C ≥ 50
✅ Filters на странице работают для всех E-E-A-T полей
✅ Page https://ratedbrokers.com/research/authors live, noindex
✅ Log в `logs/2026-04.md` содержит per-outlet summary

---

## 17. После спринта — что дальше

### Immediate next steps
1. **Первая outreach-волна** — 20 Tier S/A targets с конкретным pitch (data-study RatedBrokers 293 rankings)
2. **Phase 8 mini-sprint** — deep E-E-A-T для top-150 (FINRA BrokerCheck verification, Google Scholar h-index, award detection, book ISBN lookup)
3. **Schema.org Person** на наших reviewer-страницах RatedBrokers (параллельная линия — для E-E-A-T на своём сайте)

### Long-term
4. **D1 migration** когда набрали 50+ real outreach responses (статус-трекинг, notes, follow-ups)
5. **Quarterly refresh** — через 90 дней повторный WebSearch pass для проверки role changes, new authors, departures

---

## 18. Documents map (финальная картина)

```
AUTHORS-SPRINT-FINAL.md    ← этот файл — actionable spring plan
AUTHORS-HARVESTING-PLAYBOOK.md ← methodology (10 layers, 7 rules)
EEAT-AUTHOR-CRITERIA.md    ← что считается авторитетом у Google
AHREFS-DATA-LOG.md         ← источник DR + refdomain CSV
logs/2026-04.md            ← per-session log
src/data/authorsSample.js  ← canonical data store
src/pages/AuthorsResearchPage.jsx ← UI
```

---

## 19. Historical lessons — не повторять

1. **Batch-мышление после одного failure** → Rule A теперь MANDATORY (BrokerChooser gap — 6 LinkedIn пропущены)
2. **Rule D применён только к примеру** → Rule E (systematic pass) обязателен (Margarette fix не распространили на остальных 4)
3. **Параллельные WebFetch к одному домену** → Rule G rate limit (NerdWallet 403 на всех 4)
4. **"Protected" принят как "нет"** → Rule F (field exists, retry)
5. **Selective prompt "find X"** → Rule C "list ALL URLs" (summarizer пропускал иконки)
6. **"70-80% coverage достаточно"** → Rule A обязательный (3× improvement в LinkedIn coverage после применения)

---

**Старт спринта**: Егор даёт команду «go» → я начинаю с Phase 0.
Через 22-25 часов работы — страница live с 500+ авторами.

Готов по команде.
