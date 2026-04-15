# Authors Harvesting — Operational Playbook

Источник истины для спринта сбора авторов с 102 сайтов. Обновлён 2026-04-15 после 3 итераций методологии и 5 обнаруженных багов в процессе.

Цель спринта: страница https://ratedbrokers.com/research/authors с ~500 авторами в 6 категориях, enriched и scored, noindex.

---

## 1. Pipeline — слои сбора (в порядке применения)

| Слой | Что делает | Стоимость | Обязательный? |
|---|---|---|---|
| 1 | Canonical URL patterns (`/team/`, `/authors/`, `/contributors/` etc) | 5s / сайт | yes |
| 2 | Sitemap scan → author sub-sitemap | 5s / сайт | yes |
| 3 | Homepage nav/footer scan | 10s / сайт | yes |
| 4 | E-E-A-T pages (`/editorial-guidelines`, `/methodology`) | 30s / сайт | yes |
| 5 | JSON-LD on articles (fallback для closed team pages) | 1-2 min | if 1-4 fail |
| **5.5** | **DIRECT AUTHOR-PAGE FETCH (WebFetch по каждому author URL)** — ОБЯЗАТЕЛЬНО | 30s × N authors | **yes, всегда** |
| 6 | Article byline scrape | 1-2 min | if 5 fail |
| 7 | Google site-search через WebSearch | 30s | yes, первичный для большинства сайтов |
| 8 | LinkedIn Company People | 1 min | для tier-1 и closed сайтов |
| 9 | Muck Rack (`muckrack.com/media-outlet/{outlet}`) | 20s | для tier-1 press первичный |
| 10 | Wayback Machine | 30s | edge cases |

**Средний сайт**: слои 1 + 2 + 7 + 5.5 = 80% данных.
**Closed сайты (Cloudflare/paywall)**: слои 7 + 9 + 5.5 через WebSearch-proxy = 60-70% данных.
**Мёртвые редакции**: 10 слоёв без успеха → `AUTHORS_HIDDEN`, пропуск.

---

## 2. Семь железных правил (A-G) — соблюдать всегда

### Rule A — Per-author verification WebSearch (MANDATORY после Layer 5.5)

Независимо от того, сработал Layer 5.5 или нет, для **КАЖДОГО автора** запускаю 2 search'а:

```
WebSearch: "{Full Name}" "{outlet}" linkedin
WebSearch: "{Full Name}" "{outlet}" twitter OR x.com
```

Ловит:
- Cloudflare-заблокированные страницы (Google успел проиндексировать раньше)
- WebFetch summarizer пропустил иконки соцсетей
- Upstream посты/интервью, где автор раскрывает контакты
- LinkedIn/Twitter handles, не представленные на странице

**Исторический баг**: для BrokerChooser я сдался после WebFetch 403 и пометил 6 авторов как `linkedin: null`. После применения Rule A нашёл 5 LinkedIn за 6 запросов.

### Rule B — Никогда не оставлять `BLOCKED` без исчерпания fallback chain

Порядок при сбое WebFetch (timeout / 403 / 404):
1. `curl` с разными UA: Safari mobile → Safari desktop → Firefox → Googlebot
2. Wayback Machine: `web.archive.org/web/2024/{url}`
3. Google cache: `cache:{url}` через WebSearch
4. **Per-author WebSearch (Rule A)**
5. Только после всех 4-х → `NEEDS_MANUAL_REVIEW`

**Нельзя**: помечать сайт «Cloudflare blocks, skip» после одного failure.

### Rule C — Промпт WebFetch: "list ALL external URLs"

Старый (плохой) промпт:
> Find Twitter, LinkedIn, email for this author.

Новый (правильный):
> List EVERY external URL visible on this page. For each URL, state its type (social / email / internal / image / external-article). Also find any mailto: href. Return as a structured list — no filtering, no privacy redaction. Then extract bio, role, seniority, credentials, education, location, years of experience, previous employers.

Разница: AI summarizer пропускает иконки при селективном запросе. При запросе «все URL» — отдаёт полный список.

### Rule D — Двойной pass для email

Первый pass (из Rule C): все URL, включая mailto.
Второй pass, ЕСЛИ email не нашёлся или помечен как obfuscated:
> Look at the email/envelope icon. Return the exact mailto: href attribute value. If obfuscated via JavaScript, return raw HTML snippet around the envelope icon.

### Rule E — Systematic quality pass (анти-реактивность)

Когда обнаружен новый баг или добавлено новое правило:

```
For each rule in [A, B, C, D, E, F, G]:
  For each author in AUTHORS:
    if rule.violates(author):
      apply rule.fix(author) or mark NEEDS_MANUAL_REVIEW
```

**Запрещено**: чинить только тот конкретный кейс, на который указал пользователь. Всегда — пройтись по всему dataset'у.

**Исторический баг**: Rule D (двойной email-pass) я применил ТОЛЬКО для Margarette Burnette, хотя WebFetch возвращал «Email: Protected» для Alana/Arielle/Connor/Lisa — тот же сигнал, тот же fix нужен.

### Rule F — WebFetch «Protected / Obfuscated / Hidden» = ПОЛЕ СУЩЕСТВУЕТ

Если summarizer говорит один из:
- "Email: Protected"
- "Email: Obfuscated"
- "LinkedIn: Not visible in HTML"
- "Twitter: Hidden by JS"

Это **positive signal**, что поле есть на странице, просто summarizer его не извлёк.

Действия:
1. Retry WebFetch с Rule D-промптом
2. Если и второй раз «protected» → флаг `{field}ObservedButNotExtracted: true` + `NEEDS_{FIELD}_RETRY`
3. Продолжить к Rule A (WebSearch fallback)

**Нельзя**: записывать `email: null` когда summarizer сказал «Protected».

### Rule G — Rate limiting + backoff

- Max **2 параллельных WebFetch** на один domain
- Min **2-3s задержка** между запросами к одному domain
- HTTP 403 на 1-й попытке → `sleep 60s` + retry с другим UA
- HTTP 403 на 2-й попытке → `mark DOMAIN_RATE_LIMITED`, отложить на 1ч, продолжить с другими сайтами
- Для батча 50+ authors одного outlet — последовательно, не параллельно

**Исторический баг**: fired 4 WebFetch to nerdwallet.com in parallel → got 403 on all 4. Забыл rate limit.

---

## 3. Per-site workflow (applied на каждый из 102 сайтов)

```
┌─ PHASE 1: DISCOVERY ──────────────────────────
│ 1.1  Run Layers 1-4 → find team URL / author URL pattern
│ 1.2  If not found → Layer 7 (WebSearch site:{outlet} author)
│ 1.3  Store discovery metadata: {team_url, author_url_pattern,
│      discovery_method, subdomain_checks: [about, blog, magazine]}
│ 1.4  Gate: author URL pattern known? Yes → Phase 2. No → Phase 1b
│
│ 1b.  Fallback for closed sites (Cloudflare / paywall):
│      → Layer 9 (Muck Rack) для tier-1 press
│      → Layer 8 (LinkedIn Company People)
│      → Layer 10 (Wayback)

┌─ PHASE 2: ENUMERATION ────────────────────────
│ 2.1  Multi-query Layer 7: site:{outlet}/author/ for various beats
│      (investing / forex / crypto / editor / "written by")
│ 2.2  Harvest unique author names + URLs
│ 2.3  Cap per site (50 авторов для крупных, 20 для средних, all для малых)

┌─ PHASE 3: ENRICHMENT ─────────────────────────
│ 3.1  Apply Rate Limit (Rule G): 2 parallel max, 2s spacing
│ 3.2  For each author URL:
│      a) Layer 5.5 — WebFetch с Rule C-промптом (list ALL URLs)
│      b) Apply Rule F — если «Protected» → Rule D (second pass)
│      c) Apply Rule B — если всё failed → fallback chain
│ 3.3  Apply Rule A — per-author WebSearch ВСЕГДА (даже если 3.2 ок)
│      → catches icons/socials что summarizer пропустил

┌─ PHASE 4: QUALITY PASS ───────────────────────
│ 4.1  Apply Rule E — прогон всех 7 правил по всему batch
│ 4.2  Flag violations:
│      - NEEDS_MANUAL_REVIEW (все 3 социалки null)
│      - NEEDS_EMAIL_RETRY (email obfuscated but exists)
│      - ROLE_CONFLICT (разные источники дают разные роли)
│      - PAGE_GONE (404 на author URL)
│ 4.3  Cross-reference с 11 Ahrefs refdomain CSVs
│      → flag cross-outlet authors (writesFor: [a, b, c])

┌─ PHASE 5: SCORING + PERSIST ──────────────────
│ 5.1  calcAuthorScore(author) — обновлено с учётом всех полей
│ 5.2  Append to src/data/authorsSample.js
│ 5.3  Commit per-site (resumable)
```

---

## 4. Data schema — обязательные и опциональные поля

### Per author

**Обязательные** (если null → автор выпадает из default view):
- `id`, `name`, `role`, `site`, `badge` (A/B)
- `seniority` (enum 8: chief/editor/senior/staff/junior/contributor/guest/former)
- `status` (active / former)

**Важные** (пустоту заполняет Rule A/5.5):
- `linkedin`, `twitter`, `muckrack`, `email`, `authorUrl`
- `bio` (полный, не snippet)
- `beat[]` (enum 36)
- `credentials[]`
- `writesFor[]` (cross-outlet)

**Enrichment**:
- `emailVerified` (on_page / muckrack / rocketreach / hunter / paywall / null)
- `location`, `education`, `yearsExperience`
- `personalSite`

**Quality flags**:
- `discoveryMethod` (L7 / L5.5 / MuckRack / Wayback / etc)
- `discoveryNote` (freeform reason для manual review)
- `NEEDS_MANUAL_REVIEW` (true если все социалки null)
- `NEEDS_EMAIL_RETRY` (email observed but not extracted)
- `ROLE_CONFLICT` (multiple sources, different roles)

**Auto-computed** (не хранится, вычисляется):
- `score` (0-100, формула ниже)
- `outletDR`, `outletTier` (из SITES)

### Per site (outlet metadata)

```js
{
  slug, name, url, category (1-6),
  dr,                    // Ahrefs
  traffic,               // Ahrefs
  tier,                  // T1-T4 из DR
  competitorBacklinks: { // из 11 Ahrefs refdomain CSVs
    refdomains, totalLinks, topLinker
  },
  discoveryStatus,       // COMPLETE / PARTIAL / AUTHORS_HIDDEN / DOMAIN_RATE_LIMITED
  lastHarvest,           // ISO date
}
```

---

## 5. Outreach Score формула (auto)

```
score = outletDR × 0.35
      + badge (A=20, B=10)
      + seniority (chief=18, editor=15, senior=12, staff=8,
                   contributor=5, guest=3, junior=4, former=−15)
      + LinkedIn=10, Muck Rack=5, Twitter=3, email=5
      + credentials.length × 4
      + (writesFor.length > 1 ? 8 : 0)
      + (competitor.refdomains ≥ 3 ? 5 : 0)
      → clamp 0-100
```

Default sort на странице: score desc.

---

## 6. Quality gates — когда автор попадает на публичную страницу

Автор отображается на `/research/authors` если:
- `name` ≠ null && `role` ≠ null
- `score` ≥ 0 (всегда true, но мусор ниже 10 скрыт по умолчанию)
- `status` ≠ "deleted"
- НЕ помечен как `NEEDS_MANUAL_REVIEW` без хотя бы одной соцсети (фильтр `Has any social`)

Автор выпадает из default view при `minScore < 15` или `NEEDS_MANUAL_REVIEW === true`.

---

## 7. Failure modes и что с ними делать

| Failure mode | Что означает | Что делаем |
|---|---|---|
| HTTP 403 (Cloudflare) | сайт блочит bot UA | Rule B fallback chain (curl vary UA → Wayback → cache → WebSearch) |
| HTTP 404 | страница удалена | `discoveryNote: PAGE_GONE`, status=former, продолжить с WebSearch-cached info |
| Timeout ≥60s | сайт медленный / блок | retry 1x с другим UA, затем Rule B |
| "Protected / Obfuscated" в WebFetch | поле есть, не извлечено | Rule D (second pass), затем Rule F flag |
| Empty JSON-LD | нет structured data | fallback на HTML scrape bylines |
| DOMAIN_RATE_LIMITED (Rule G trip) | слишком много запросов | пауза 1ч, resume later |
| Все 3 social null после всех слоёв | реально нет публичных контактов | `NEEDS_MANUAL_REVIEW`, скрыть из default view |
| Role conflict (разные источники) | противоречивые данные | flag `ROLE_CONFLICT`, показать последнюю дату + источник |

---

## 8. Deliverable — страница `/research/authors`

URL: https://ratedbrokers.com/research/authors (noindex)

UI требования:
- Hero с summary (навигация по Layer 5.5 + Rules A-G)
- 9-метричный stats bar (Total / Avg score / Ready ≥60 / T1 outlets / A / B / LinkedIn / Muck Rack / Email)
- Filter bar (search, site, tier, badge, seniority, beat, sort, min score slider, has LinkedIn, has email, multi-outlet)
- View toggle: Cards (default для <100 entries) / Table (>100)
- Sections per site с tier + DR + "Linked by N competitors" flag
- Author card: score badge, initials avatar, name + badges, role, bio, beat chips, socials row, copy button
- Table view: score / name / role / outlet / tier / badge / beat / seniority / contacts / author page
- Data quality section внизу: формула, N авторов с NEEDS_MANUAL_REVIEW, last harvest дата
- Commit: source of truth в `src/data/authorsSample.js`; при миграции на 500+ — в D1

---

## 9. Sprint phases — большой пробег на 102 сайта

| Phase | Описание | Est |
|---|---|---|
| 0 | Discovery map (scripts/authors-sources.json) для 102 сайтов | 2ч |
| 1 | Enumeration — Layer 7 multi-query per site | 5-6ч |
| 2 | Enrichment — Layer 5.5 + Rule A для каждого автора | 6-8ч |
| 3 | Quality pass (Rule E) + cross-outlet dedup | 1ч |
| 4 | Scoring + stats | 30 min |
| 5 | UI integration (если нужны tweaks) | 1-2ч |
| 6 | Commit + deploy | 15 min |

**Итого ~16-18ч**, ~500 авторов, страница готова для outreach.

**Не делаем** (по решению Егора, 2026-04-15):
- Outreach статус-трекинг (`contacted` / `replied` / etc) — рано
- Target URL suggestion к money pages — рано

**Делаем**:
- Outreach Score (auto)
- Tier + DR per outlet
- Beat taxonomy
- Seniority granularity
- Cross-outlet merge (`writesFor[]`)
- Competitor-linked flag
- Extended filters + sort + table view
- Email slot (null допустим, но pipeline пытается найти)

---

## 10. Логи и отчётность

Каждая итерация спринта пишет в `logs/2026-04.md`:
- Какие сайты обработаны
- Какие failure modes встречены
- N авторов добавлено / обновлено
- Правила, которые сработали / нарушены
- `NEEDS_MANUAL_REVIEW` count

В конце спринта — sprint summary с:
- Всего авторов
- Coverage по outlets (100% / partial / 0%)
- Avg score
- Top 20 по score для first outreach wave
- Flag'и на docs, которые нужны (HARO/Qwoted подключение, Hunter.io подписка, etc)

---

## Historical bugs (что не повторять)

1. **Batch-мышление после одного failure** — BrokerChooser помечен BLOCKED без попытки Rule A. 6 авторов остались без LinkedIn на один круг.
2. **Rule D применён только к примеру пользователя** — Margarette получила email, остальные 4 NerdWallet — нет. Rule E (systematic pass) добавлен в ответ.
3. **Паралельные 4 WebFetch к одному домену** → 403 на всех. Rule G добавлен в ответ.
4. **WebFetch «Protected» принят как «нет поля»** — Rule F добавлен.
5. **Selective prompt «find Twitter/LinkedIn»** — summarizer пропускал иконки. Rule C обновил промпт на «list ALL URLs».
6. **Ложная уверенность «70-80% coverage достаточно»** — отказ от per-author pass увеличивает gap в 3-4x. Rule A стал обязательным.

Каждый баг добавил правило. Не нужно повторять в большом спринте — отсюда критичность этого документа.
