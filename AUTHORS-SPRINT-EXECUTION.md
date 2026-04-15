# Authors Sprint — Execution Plan v3

Конечный operational план запуска большого спринта по сбору авторов со всех 96 сайтов.

Обновлён 2026-04-15 после Phase 0 (discovery map). Учитывает: 5 багов MVP, поведение Cloudflare/paywall/rate-limit, idle-timeout Agent tool, реалии context window.

**Парные документы**:
- `AUTHORS-HARVESTING-PLAYBOOK.md` — методология (10 layers, 7 rules A-G)
- `EEAT-AUTHOR-CRITERIA.md` — характеристики экспертов (18 категорий, tier S/A/B/C)
- `AUTHORS-SPRINT-FINAL.md` — первая версия плана (заменяется этим документом)
- `scripts/authors-sources.json` — карта 96 сайтов с URL patterns (Phase 0 DONE)
- `src/data/authorsSample.js` — canonical data store (34 MVP authors ready)

---

## 1. Состояние на старте

### ✅ Готово
- **96 сайтов** в `scripts/authors-sources.json` с URL patterns и fallback strategies
- **34 автора MVP** в `src/data/authorsSample.js` с полной E-E-A-T схемой (7 секций)
- **Page** `/research/authors` с 17 фильтрами (включая E-E-A-T: certs, years, tier-1, books, domain, Muck Rack)
- **11 Ahrefs CSV** в `data/ahrefs-refdomains-2026-04-14/` (122K refdomains для cross-ref)
- **Seed imena ~30 авторов** в `notes` поля `authors-sources.json` — быстрый старт Phase 2

### 🔴 Остаётся
- **91 outlet без DR/tier metadata** (5 MVP есть)
- **~460 авторов не собрано** (от 91 сайта)
- **E-E-A-T Pass 2** (deep verification) — отложен в отдельный Phase 8 mini-sprint

### 🎯 Целевой deliverable
- **~500 авторов** на странице `https://ratedbrokers.com/research/authors` (noindex)
- Tier distribution: S≥20, A≥150, B≥200, C≥50
- Coverage 100% по 96 сайтам (max 3-5 AUTHORS_HIDDEN флагов OK)
- All E-E-A-T фильтры работают
- `needsManualReview` ≤10%

---

## 2. Главная стратегия — Agent batching

### Почему нельзя просто продолжить в main conversation

- 96 сайтов × ~3 WebSearch + ~10 WebFetch каждый = ~1300 запросов
- Каждый результат = 2-3K токенов в контекст
- Итого 3-4M токенов на фазы 2+3 — **взорвёт** контекст

### Почему Agent с полным Phase 2 тоже нельзя одним куском

- Agent tool has **idle timeout ~22 минут** (проверено на Phase 0)
- Phase 2+3 на 91 сайт = 8-10ч — не влезет в один Agent run

### Решение: chunked parallel agents

Делаем **5-7 agents параллельно**, каждый обрабатывает **1 категорию (или половину)** по 10-20 сайтов. Каждый agent:
- Пишет промежуточные результаты в свой scratch-файл `scripts/authors-harvest-{agent-id}.json`
- Имеет чёткий timeout-budget (не более 15 минут идентичной работы)
- Returns финальный summary по 10-20 сайтам

После: **main process consolidates** все scratch-файлы в `src/data/authorsSample.js`.

### Почему 5-7 параллельных не конфликтуют

- Каждый пишет в СВОЙ scratch-файл
- Разные domains → нет rate-limit коллизий
- Rule G (2 parallel per domain) соблюдается естественно

---

## 3. Фазы (6 фаз + launch)

### Phase 1 — Outlet metadata (main process, ~1ч)

**Задача**: для каждого из 91 outlet добавить в `SITES{}` map: `dr`, `traffic`, `tier`, `competitorBacklinks`.

**Метод**:
1. Для 91 outlet — script `scripts/enrich-outlets.mjs`:
   - Читает `authors-sources.json`
   - grep по 11 Ahrefs CSV в `data/ahrefs-refdomains-2026-04-14/`
   - Для каждого outlet: сколько refdomains CSV содержат его домен → `competitorBacklinks.refdomains`
   - Sum `links_to_target` → `totalLinks`
   - Argmax → `topLinker`
   - DR pull в случае если Ahrefs API разблокирован (или дефолт по типу outlet)
2. Tier derived: T1 (DR ≥90) / T2 (70-89) / T3 (50-69) / T4 (<50). Ручной fallback для известных outlets:
   - WSJ/FT/Bloomberg/Reuters/NYT/Forbes/CNBC = T1
   - Investopedia/Bankrate/Morningstar = T1
   - Seeking Alpha/Benzinga = T2
   - Tier-по-вертикали knowledge base

**Output**: `src/data/outletsMetadata.js` с 96 записями. Main process merge'ит в `SITES{}` в `authorsSample.js`.

**Без delegation** — быстро, автоматизация.

---

### Phase 2 — Enumeration (6 agents parallel, ~4-6ч wall-clock)

**Задача**: для каждого сайта вытащить список **имён авторов** + authorUrl (если есть).

**Делегация**: 6 agents по категориям:
- Agent 1: category 1 (direct competitors, 26 сайтов — 21 уже обработаны в MVP/batches)
- Agent 2: category 2 (finance editorial, 19 сайтов)
- Agent 3: category 3 (trading media, 16 сайтов — fxstreet done)
- Agent 4: category 4 (tier-1 press, 19 сайтов — wsj done) — **Muck Rack primary**
- Agent 5: category 5 (crypto, 10 сайтов — cointelegraph done)
- Agent 6: category 6 (prop firms, 6 сайтов)

**Prompt для каждого Agent** (template):
```
Read AUTHORS-SPRINT-EXECUTION.md section 3 + AUTHORS-HARVESTING-PLAYBOOK.md.

For each site in category {X} from scripts/authors-sources.json:
1. Use teamUrl + authorUrlPattern + fallbackStrategy to enumerate authors
2. Respect Rule G (rate limit)
3. For each author: extract name + authorUrl (minimum)
4. Cap per site per estAuthorCap field

Write results to scripts/harvest-phase2-cat{X}.json as:
{
  "outlet_slug": [
    { "name": "...", "authorUrl": "...", "roleHint": "...", "discoveryMethod": "L7|L1|L9" },
    ...
  ]
}

Time budget: max 15 minutes. If timeout approaching, save partial + return summary.
Return: short report with count per outlet + any blocks encountered.
```

**Ожидание**: ~500 authors (name + URL) across 96 outlets. No bio/socials yet — только enumeration.

---

### Phase 3 — Layer 5.5 enrichment (10-15 agents batched, ~6-8ч)

**Задача**: для каждого автора с authorUrl → WebFetch + extract: bio, socials (LinkedIn/Twitter/email), education, employment, credentials, years, location.

**Делегация**: по **20 authors per agent**, ~25 agents total. Batched так:
- Batch A: authors 1-100 (first 5 agents parallel, каждый 20 authors)
- Batch B: authors 101-200 (next 5 agents)
- Batch C: authors 201-300 (next 5 agents)
- Batch D: authors 301-400 (next 5 agents)
- Batch E: authors 401-500 (next 5 agents)

**Prompt каждому Agent**:
```
Read AUTHORS-HARVESTING-PLAYBOOK.md (Rules A-G).

For this batch of {20} authors (see harvest-phase2-*.json):
1. For each author with authorUrl:
   - WebFetch с промптом Rule C (list ALL external URLs)
   - Extract: bio, linkedin, twitter, email (mailto), muckrack, personalSite
   - Extract from bio: education, employmentHistory, yearsInIndustry, certifications (regex CFA|CFP|Series X), location
   - Rule F: if "Email: Protected" — Rule D second-pass
   - Rule G: 2 parallel max per domain, 2s spacing, 60s backoff on 403

2. Apply Rule A (MANDATORY): for each author regardless of fetch success:
   - WebSearch "{Full Name}" "{outlet}" linkedin
   - WebSearch "{Full Name}" "{outlet}" twitter OR x.com
   - Fill gap fields

3. Skip Phase 4 (Quality) and Phase 5 (E-E-A-T Pass 1) — только enrichment.

Write results to scripts/harvest-phase3-batch{X}.json in canonical AUTHORS schema
(copy shape from src/data/authorsSample.js existing entry).

Time budget: max 15 minutes per 20 authors. Save partial if timeout.
```

**Failure handling по опыту**:
- **Cloudflare 403** → Rule B fallback chain (5 UA retries + Wayback + Google cache + Rule A)
- **Rate limit (NerdWallet-like)** → 60s sleep + retry с другим UA
- **"Protected" email** → Rule D explicit mailto-href prompt
- **404 Page Gone** → mark `PAGE_GONE`, status `former`
- **Muck Rack paywall** → только basic bio + journalist list, article counts skip

---

### Phase 4 — Rule A verification + cleanup (1 agent, ~2ч)

**Задача**: систематический Rule E pass по всему batch.

**Main process или 1 agent**:
1. Load all `scripts/harvest-phase3-batch*.json`
2. Для каждого автора:
   - Если нет LinkedIn/Twitter/email — run Rule A WebSearch per-author
   - Fill gap'ы
   - Dedup по full name (cross-outlet merge в `writesFor[]`)
3. Сохранить consolidated → `scripts/harvest-consolidated.json`

---

### Phase 5 — E-E-A-T Pass 1 auto-extraction (main process, ~1ч)

**Задача**: auto-regex extraction из bio + cross-ref CSV.

**Script**: `scripts/eeat-pass1.mjs`:
```js
for each author:
  certifications = regex(/CFA|CFP|CPA|CMT|FRM|CAIA|CTA|ChFC|Series\s+\d+|RIA/g)
  yearsInIndustry = parse("X+ years" | "since YYYY")
  education = regex university pattern
  employmentHistory = parse "ex-", "former", "worked at", "previously" + company name
  mediaSignals.quotedInTier1 = scan bio for ["WSJ","FT","Bloomberg","NYT","Barron's","Reuters","CNBC"]
  mediaSignals.tvAppearances = scan for ["CNBC","Fox Business","Today Show","NBC","ABC","CBS"]
  mediaSignals.authoredBooks = scan for "book", "authored", "wrote"
  citationSignals.citedByCompetitors = SITES[author.site].competitorBacklinks.refdomains
  trustSignals.ownedDomain = detect in bio or sameAs
  compute authoritativeness, finalScore, eeatTier
```

**Output**: enriched `scripts/harvest-final.json`.

---

### Phase 6 — Quality pass (Rule E) + Deploy (~1ч)

**Main process**:
1. Load `harvest-final.json`
2. Rule E systematic check:
   - No socials + no email → `needsManualReview: true`
   - Email obfuscated but not extracted → `needsEmailRetry: true`
   - Bio < 20 chars → `BIO_TOO_SHORT` flag
   - Duplicate detection by lowercase name + LinkedIn URL
3. Write final dataset into `src/data/authorsSample.js` (replace AUTHORS array)
4. Rename file → `src/data/authors.js` (больше не sample)
5. Update UI import in `AuthorsResearchPage.jsx`
6. `npm run build` → verify
7. git add + commit + push → Cloudflare Pages auto-deploy
8. Verify live URL `https://ratedbrokers.com/research/authors`

---

## 4. Concrete launch sequence — что я делаю СЕЙЧАС

### Step 1 — Phase 1 (outlet metadata)
Я **сразу начинаю** в main process (без delegation):
1. Написать `scripts/enrich-outlets.mjs`
2. Запустить — за 1 минуту получить `outletsMetadata.js` с 96 outlets
3. Merge в `SITES{}` в `authorsSample.js`
4. Показать тебе итог (96 outlets с DR/tier/competitorBacklinks)

### Step 2 — Phase 2 spawn 6 parallel agents
Запускаю сразу 6 Agent-ов (в фоне), по одному на категорию. Каждый пишет в свой scratch-файл.

Ты получаешь 6 notifications когда они завершатся (параллельно, wall-clock ~30-60 min).

### Step 3 — Consolidate Phase 2 outputs
Когда все 6 agents вернулись:
- Читаю 6 scratch-файлов
- Показываю тебе per-category counts + проблемные сайты
- **Checkpoint 2** — ты одобряешь перед Phase 3

### Step 4 — Phase 3 spawn batched agents
После твоего «go»:
- Spawn ~25 agents batched по 20 authors
- Параллелизм 5-10 одновременно (чтобы не словить rate limit)
- Wall-clock ~2-4ч

### Step 5 — Phase 4+5+6 в main process
После завершения всех batch agents:
- Consolidate → Rule A cleanup → E-E-A-T extraction → Quality pass → Deploy
- ~2-3ч

### Step 6 — Live URL
`https://ratedbrokers.com/research/authors` — с ~500 авторами.

---

## 5. Failure mode catalog — проверено на MVP

### 5.1 Agent idle timeout
**Симптом**: Agent завершается через 22 минуты с «partial response received»
**Что делать**:
- Cap каждого Agent run на 15 минут активной работы
- Agent сохраняет state в scratch-файл **по ходу** (не только в конце)
- Main process может spawnить re-do agent если scratch неполный

### 5.2 Cloudflare 403 (BrokerChooser-like)
**Симптом**: HTTP 403 на WebFetch, curl тоже 403
**Rule B fallback chain**:
1. `curl -A "Safari mobile UA"` → retry
2. `curl -A "Firefox Windows"` → retry
3. `curl -A "Googlebot"` → retry
4. Wayback Machine → если Claude Code может достучаться
5. Google cache через WebSearch
6. **Rule A per-author WebSearch** → почти всегда даёт LinkedIn если есть публичный

### 5.3 Rate limit (NerdWallet-like)
**Симптом**: 4 parallel requests → 403 на всех
**Rule G**:
- Max 2 parallel per domain
- 2-3s spacing
- 403 → `sleep 60s` → retry с другим UA
- 2nd 403 → `DOMAIN_RATE_LIMITED` flag, skip 1ч, continue другими доменами

### 5.4 Paywall (WSJ/FT/Barron's)
**Симптом**: bio скрыт за login wall
**Что делать**: Muck Rack primary. Для senior editors — LinkedIn Company People.

### 5.5 "Email: Protected" (Alana Benson-like)
**Симптом**: WebFetch summary говорит «Email: Protected (obfuscated on page)»
**Rule D second-pass**:
```
WebFetch prompt: "Find the <a href="mailto:..."> tag. Return the exact href value. 
If obfuscated via JavaScript, return the raw HTML near the envelope icon."
```
Если снова пусто → `needsEmailRetry: true`.

### 5.6 Google site: search 0 results (BabyPips/AskTraders/FXScouts)
**Симптом**: `site:domain.com author` returns 0
**Что делать**:
- Drop site: operator: `"domain.com" authors team`
- Direct WebFetch `/about` or `/team` pages
- If blocked → mark `AUTHORS_HIDDEN`

### 5.7 404 Page Gone (Simon Chandler-like)
**Симптом**: authorUrl → 404
**Что делать**: mark `discoveryNote: PAGE_GONE`, `status: former`. Keep record (networking value).

### 5.8 Muck Rack paid-wall
**Симптом**: article counts hidden
**Что делать**: basic name + beat + Twitter bio бесплатно — этого достаточно. Skip article counts для Phase 8.

### 5.9 Contributor networks (SeekingAlpha/FXStreet/Benzinga)
**Симптом**: hundreds of guest contributors
**Что делать**: cap 20 per site, filter only `roleType: staff` или `senior contributors` с активной деятельностью.

### 5.10 Role conflict (Alana Benson had 3 different titles)
**Симптом**: Google snippet vs fresh WebFetch vs ZoomInfo — разные роли
**Что делать**: fresh WebFetch wins. Flag `ROLE_CONFLICT` если источники дают >1 различающиеся роли в пределах Phase 3.

### 5.11 Former authors
**Что делать**: keep record, `status: former`, `seniority: former`. Authoritativeness score penalty -5. Don't outreach первыми, но сохраняем networking value.

### 5.12 Ложные omonym matches (Rule A)
**Симптом**: WebSearch "John Smith" returns wrong John Smith
**Validation**: первые 3 results должны содержать outlet name в title/description. Иначе skip.

### 5.13 Context explosion
**Симптом**: Main conversation runs out of context после 3-4 batch'ей
**Что делать**: всё, что больше 30 min work — через Agent. Main process только consolidates + decides.

---

## 6. Data extraction — E-E-A-T fields per author

### Из bio (regex)

| Field | Pattern |
|---|---|
| `certifications[]` | `\b(CFA|CFP|CPA|CMT|FRM|CAIA|ChFC|CTA|Series\s*\d+|RIA|CFS)\b` |
| `education[]` | `(BA|BS|BSc|MSc|MA|MBA|PhD|Bachelor|Master|Doctorate)\s+(of\|in)?\s+.{3,40}?\s+(at\|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\s+(University|College|School))` |
| `yearsInIndustry` | `(\d+)\+?\s*(years\|yrs)\s+(of\s+)?(experience\|in)` OR `since\s+(\d{4})` |
| `location` | `(based in\|from)\s+[A-Z][a-z]+(?:,\s*[A-Z]{2,})?` |
| `mediaSignals.quotedInTier1[]` | scan for: WSJ, FT, Bloomberg, Reuters, NYT, Barron's, CNBC, MarketWatch, AP, Forbes |
| `mediaSignals.tvAppearances[]` | scan for: CNBC, Bloomberg TV, Fox Business, BBC, CBS, NBC, ABC, Today Show |
| `mediaSignals.authoredBooks[]` | detect: "authored", "wrote the book", `"[A-Z][^"]+"` near "book" |

### Cross-reference с 122K Ahrefs CSV (free)

```bash
for outlet in 96:
  grep -E "^{domain}," data/ahrefs-refdomains-2026-04-14/*.csv | wc -l
  → SITES[outlet].competitorBacklinks.refdomains
```

### Auto-computed (formulas в authorsSample.js)

- `score` (0-100) = outletDR × 0.35 + badge + seniority + socials + certs + multi-outlet + competitor-linked
- `authoritativeness` (0-50) = certs×8 + years + tier-1 + TV + books + muckrack + domain + outlets + competitor + FINRA − former
- `finalScore` = score × (1 + authoritativeness/100)
- `eeatTier` = S (≥40) / A (25-39) / B (12-24) / C (<12)

---

## 7. Success criteria (exit gates)

- [ ] 96 outlets в `SITES{}` с полной metadata
- [ ] ≥400 authors harvested (500 target, 400 acceptable floor)
- [ ] `needsManualReview` rate ≤15%
- [ ] Tier distribution: ≥15 S, ≥100 A, ≥150 B
- [ ] Top 50 по finalScore — 100% имеют хотя бы один contact channel (LinkedIn OR email)
- [ ] Все E-E-A-T фильтры на странице работают
- [ ] `npm run build` — без ошибок
- [ ] Page live на `https://ratedbrokers.com/research/authors`
- [ ] `logs/2026-04.md` содержит per-phase summary

---

## 8. Context management — как не взорваться

### Main process правила
- **Никогда не делаю параллельно больше 2-3 WebSearch** в main conversation
- **Никогда не fetchу больше 4-5 страниц** в main
- Любая работа >30 min → через Agent (background)
- Agent scratch-файлы читаю только после завершения, не во время

### Agent scratch files
- Каждый agent пишет в **свой** JSON: `scripts/harvest-phase{N}-{slug}.json`
- Main process consolidates через Python/Node script
- После consolidation — агенты scratch files можно archive (не удалять — audit trail)

### Checkpoint discipline
- Между Phases — обязательный checkpoint с Егором
- Если промежуточный Phase 2 результат подозрительный → stop and ask Егора перед Phase 3
- Lost work hurts; discipline prevents it

---

## 9. После спринта (post-sprint mini-sprints)

### Phase 7 (1ч) — Deploy + announce
- Cloudflare Pages auto-deploy
- Verify live
- Update CLAUDE.md если нужно

### Phase 8 (2-3ч) — Deep E-E-A-T for top-150
- **Filter**: authors with finalScore ≥ 50
- **Verify**: certs through public registries (CFA Institute, FINRA BrokerCheck, CFP Board)
- **Enrich**:
  - Google Scholar h-index
  - Amazon author page for ISBN
  - Industry awards (Barron's Top, SABEW, Gerald Loeb)
  - Google Knowledge Panel check
- **Mark** verified credentials с `certifications[n].verified: true`

### Phase 9 (2-3ч, параллельная линия) — E-E-A-T на НАШЕМ сайте
- Schema.org Person markup для наших reviewer'ов
- Fact-check линии на review-страницах
- "Reviewed by {expert}" badges

---

## 10. Command reference

### Start Phase 1 (сейчас)
```
node scripts/enrich-outlets.mjs
```

### Phase 2 spawn
```
Agent × 6 with prompt template (section 3.2)
```

### Phase 3 spawn
```
Agent × 25 batched by 20 authors (section 3.3)
```

### Consolidation script
```
node scripts/consolidate-harvest.mjs
```

### Quality check
```
node scripts/quality-pass.mjs
```

### Deploy
```
git add src/data/authors.js
git commit -m "feat: authors research — full dataset 500+ authors"
git push origin main
```

---

## Старт СЕЙЧАС

После твоего «go» я запускаю **Step 1 (Phase 1 outlet metadata)** в main process.
Через ~10 минут — `SITES{}` с DR/tier для 96 outlets.
Дальше — Step 2 (spawn 6 parallel Phase 2 agents).

Готов.
