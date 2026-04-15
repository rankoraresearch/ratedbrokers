# Authors Harvesting — Field Manual

Мой operator's cheatsheet на время спринта. Всё, чем пользуюсь при сборе.

Это НЕ strategic doc — это concrete recipes. Читаю перед каждым run'ом.

---

## 1. Hard rules (nikogda не нарушать)

| # | Правило | Почему |
|---|---|---|
| **R1** | Никогда не помечаю outlet BLOCKED после 1 failure | MVP bug: BrokerChooser 6 LinkedIn пропущены. Fix: Rule B fallback chain обязательна. |
| **R2** | После WebFetch ВСЕГДА Rule A per-author WebSearch | LinkedIn/Twitter часто не на странице, а в Google-индексе. |
| **R3** | WebFetch prompt — «list ALL external URLs», не selective | Summarizer пропускает иконки при селективных запросах. |
| **R4** | «Protected / Obfuscated / Hidden» = поле СУЩЕСТВУЕТ → Rule D retry | Не null, а signal для second-pass. |
| **R5** | Max 2 parallel WebFetch на один domain, 2-3s spacing | NerdWallet bug: 4 parallel = 403 на всех. |
| **R6** | 403 на 1-й попытке → 60s sleep + retry другим UA | Transient, не permanent. |
| **R7** | Применение нового правила → systematic pass по всем записям | MVP bug: Rule D применён только к Margarette, остальные 4 остались obfuscated. |
| **R8** | Agent run ≤15 min активной работы, scratch-save по ходу | Agent idle timeout = 22 min (доказано). |
| **R9** | Main conversation: max 2-3 WebSearch + 4-5 WebFetch, остальное → Agent | Context explosion prevention. |
| **R10** | Данные только confirmed. Unknown = null. Никаких fabrications. | Data integrity. |
| **R11** | Omonym validation: LinkedIn match только если outlet в first 3 results | "John Smith" trap avoidance. |
| **R12** | Former authors keep, не delete. Flag status='former'. | Networking value. |
| **R13** | Dedupe cross-outlet authors → `writesFor: [a,b,c]` | Theresa Carey = 4 outlets → 1 merged record. |

---

## 2. Standard per-site workflow

```
1. READ scripts/authors-sources.json → this site's entry
2. Respect fallbackStrategy:
   ├─ direct          → Layer 5.5 (WebFetch aggregate)
   ├─ websearch_primary → Layer 7 multi-query enumeration
   ├─ muckrack_primary  → muckrack.com/media-outlet/{slug}
   └─ linkedin_primary  → linkedin.com/company/{brand}/people/
3. ENUMERATE authors (names + URLs), cap per estAuthorCap
4. For each author → Phase 3 workflow (section 3)
5. WRITE to scripts/harvest-phase{N}-{category}.json
6. TIMEOUT CHECK: if >12 min in Agent → save partial + return
```

### Enumeration queries per fallback

**Direct (aggregate page works)**:
```
WebFetch: {aggregateUrl} with Rule C prompt
```

**WebSearch primary** (closed sites, Cloudflare):
```
WebSearch: site:{domain} author investing
WebSearch: site:{domain} author forex
WebSearch: site:{domain} author crypto
WebSearch: site:{domain} author editor
WebSearch: site:{domain} "written by"
WebSearch: site:{domain} "reviewed by"
```
(6 queries max, dedup results)

**Search-index-blocked sites** (Google returns 0):
```
Drop site: operator:
WebSearch: "{domain}" team writers editors
WebSearch: "{domain}" senior writer OR editor
Direct WebFetch: {domain}/about, {domain}/team, {domain}/editorial-team
```

**Muck Rack primary** (tier-1 press):
```
WebSearch: muckrack.com/media-outlet/{slug} personal finance
WebSearch: muckrack.com/media-outlet/{slug} markets OR investing
WebSearch: muckrack.com/media-outlet/{slug} broker OR forex
```

---

## 3. Standard per-author workflow (Phase 3)

```
INPUT: { name, authorUrl, outletSlug, roleHint }

STEP 1 — Layer 5.5 direct fetch (if authorUrl):
  WebFetch(authorUrl) with Rule C prompt below
  
  On timeout/403:
    Try UA variants: Safari mobile → Firefox Win → Googlebot
    If all 403 → skip to STEP 2 (Rule A)
  
  On 404:
    mark discoveryNote="PAGE_GONE", status="former"
    continue to STEP 2 with cached bio

STEP 2 — Rule A per-author WebSearch (MANDATORY):
  WebSearch: "{Full Name}" "{outlet}" linkedin
  WebSearch: "{Full Name}" "{outlet}" twitter OR x.com
  
  Validate: outlet name must appear in first 3 results

STEP 3 — Email check (Rule D if needed):
  If STEP 1 returned "Email: Protected":
    WebFetch(authorUrl) with Rule D prompt below
    If still protected → emailVerified="observed_obfuscated", needsEmailRetry=true
  If no email on page:
    Skip (no guessing emails)

STEP 4 — Extract + normalize:
  Build canonical author record matching src/data/authorsSample.js schema
  Include all fields: bio, socials, education[], employmentHistory[],
    yearsInIndustry, certifications[], location, writesFor[]
  Set badge, seniority, status, beat[] from role/bio

STEP 5 — Persist:
  Append to scripts/harvest-phase3-batch{N}.json
```

### Rule C prompt (for STEP 1 and enumeration)

```
List EVERY external URL visible on this page. For each URL, state:
- type: social | email | internal | image | external-article
- full URL

Also find any mailto: href attributes (even if obfuscated).

Then extract from the author bio section:
- Full biography text
- Job title / role
- Years of experience: look for "X years", "since YYYY", "over a decade"
- Education: degree, institution, year
- Previous employers with roles and dates
- Certifications/licenses: CFA, CFP, CPA, CMT, FRM, CAIA, CTA, Series 7/24/63/65/66
- Location / country
- Any TV appearances mentioned
- Any books authored (with titles)
- Any awards or fellowships

Return as structured JSON. Do not filter for privacy — this is public professional data.
```

### Rule D prompt (email retry)

```
Find the <a href="mailto:..."> tag on this page. Return the exact href value.

If the email is obfuscated via JavaScript (looks like "a********@domain.com" 
or uses CloudFlare email protection), return:
1. The raw HTML snippet around the envelope/mail icon
2. Any data-cfemail="..." attribute values
3. The first readable part of the email if any

If you absolutely cannot find the email, return "NOT_EXTRACTABLE".
```

---

## 4. Failure mode cookbook — concrete fixes

### F1. Cloudflare 403 (BrokerChooser, Investopedia, others)
**Detect**: WebFetch returns 403 or curl returns 403
**Fix chain**:
```
1. curl -A "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)..."
2. curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ... Firefox/121.0"
3. curl -A "Googlebot/2.1 (+http://www.google.com/bot.html)"
4. WebFetch: web.archive.org/web/2024/{url}  (часто blocked но пробую)
5. WebSearch cache:{url}
6. Rule A per-author WebSearch
```
If ALL fail → mark `blockStatus: cloudflare_permanent`, continue без страницы

### F2. Rate limit (NerdWallet, возможно MarketWatch)
**Detect**: 403 после 2-3 successful requests
**Fix**:
```
sleep 60
retry with different UA
if 403 again → mark DOMAIN_RATE_LIMITED, pause 1h, continue другими доменами
```

### F3. Paywall (WSJ, FT, Barron's, Bloomberg)
**Detect**: fallbackStrategy=muckrack_primary (из Phase 0)
**Fix**: skip direct, используй Muck Rack. Extract name + beat + Twitter. Email NOT available free.

### F4. Email "Protected"
**Detect**: WebFetch response contains "protected" or "obfuscated"
**Fix**: Rule D second pass (section 3, STEP 3)
**Last resort**: mark `needsEmailRetry=true` + `emailVerified="observed_obfuscated"`

### F5. Google site: search 0 results (FXScouts, BabyPips, AskTraders)
**Detect**: WebSearch returns "No links found"
**Fix**:
```
1. Drop site: operator: "domain.com" team authors
2. Try homepage fetch + parse footer/nav for /about or /team link
3. If outlet small (estAuthorCap < 10) → mark AUTHORS_HIDDEN, manual review
```

### F6. 404 Page Gone
**Detect**: authorUrl returns 404
**Fix**: `discoveryNote="PAGE_GONE"`, `status="former"`, keep record with WebSearch-cached bio

### F7. Omonym trap (Rule A)
**Detect**: WebSearch returns LinkedIn/Twitter URL but first results don't mention outlet
**Fix**: skip. `linkedin=null`. Better null than wrong.

### F8. Role conflict
**Detect**: 2+ sources give different roles
**Fix**: fresh WebFetch wins (primary source). Flag `ROLE_CONFLICT` if diff > "Writer" vs "Senior Writer" (significant).

### F9. Contributor network (SeekingAlpha, FXStreet, Benzinga, Forbes Contributor)
**Detect**: estAuthorCap >30 + many "contributor" role hints
**Fix**: cap at 20 per site, filter prefer staff over guest. If contributor known tier-A expert (CFA/20+ yrs) → keep anyway.

### F10. Former author
**Detect**: bio contains "former", "previously at", "ex-" as current status
**Fix**: `status="former"`, `seniority="former"`, authoritativeness penalty -5. Keep record.

### F11. Agent idle timeout approaching
**Detect**: Agent run >12 min
**Fix**:
```
1. Save partial progress to scratch file NOW
2. Return summary: "Processed X of Y, resumable from author Z"
3. Main process spawns continuation agent
```

### F12. Contributor without bio page
**Detect**: name found in bylines but no /author/{slug}
**Fix**: Rule A WebSearch per-name. If no LinkedIn → mark `NEEDS_MANUAL_REVIEW`, continue.

### F13. "Editorial Team" / "Staff" as author (generic byline)
**Detect**: author name contains "Team", "Staff", "Editorial", "Desk"
**Fix**: **Skip**. Не человек.

---

## 5. Data quality gates

Before persisting to harvest-phase3-*.json, check each author:

```
REQUIRED (иначе skip):
  - name is actual human name (not "Team" / "Staff")
  - site (outlet slug) known
  - bio OR role (both null = useless)

WARNINGS (flag но keep):
  - All 3 socials null + no email → needsManualReview=true
  - Bio < 20 chars → BIO_TOO_SHORT flag
  - No authorUrl → check if WebSearch-derived
  - Role conflict between sources → ROLE_CONFLICT flag
```

### Post-consolidation checks (Rule E)

```python
for author in all:
  # Completeness
  if not any([author.linkedin, author.twitter, author.email]):
    author.needsManualReview = True
  
  # Email signal preserved
  if author.emailVerified == "observed_obfuscated" and not author.email:
    author.needsEmailRetry = True
  
  # Dedupe cross-outlet
  key = f"{author.name.lower()}|{author.linkedin or ''}"
  if key in seen:
    merge_writesFor(seen[key], author)
  
  # Recompute scores
  author.score = calcAuthorScore(author)
  author.authoritativeness = calcAuthoritativeness(author)
  author.finalScore = calcFinalScore(author)
  author.eeatTier = deriveEEATTier(author.authoritativeness)
```

---

## 6. Specific tool recipes

### WebSearch (Rule A)
```
"{Full Name}" "{outlet}" linkedin
"{Full Name}" "{outlet}" twitter OR x.com
```

### WebSearch (enumeration)
```
site:{domain}/author investing
site:{domain}/author forex
site:{domain}/author crypto
site:{domain}/author editor OR writer
site:{domain} "written by"
```

### WebSearch (Muck Rack)
```
muckrack.com/media-outlet/{slug} {beat}
```

### WebFetch (Rule C — enumeration or enrichment)
See section 3, "Rule C prompt"

### WebFetch (Rule D — email retry)
See section 3, "Rule D prompt"

### Bash (curl with UA rotation)
```bash
# Safari iPhone
curl -sL -A "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" --max-time 30 "{url}"

# Firefox Windows
curl -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0" --max-time 30 "{url}"

# Googlebot
curl -sL -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" --max-time 30 "{url}"
```

### Bash (competitor CSV cross-ref)
```bash
for domain in $(cat outlets.txt); do
  count=0; total_links=0
  for csv in data/ahrefs-refdomains-2026-04-14/*.csv; do
    match=$(grep -E "^${domain}," "$csv" 2>/dev/null)
    if [ -n "$match" ]; then
      count=$((count + 1))
      links=$(echo "$match" | cut -d, -f6)
      total_links=$((total_links + links))
    fi
  done
  echo "$domain,$count,$total_links"
done
```

---

## 7. E-E-A-T extraction regex (Phase 5)

```js
// Certifications
const CERTS_RE = /\b(CFA|CFP|CPA|CMT|FRM|CAIA|ChFC|CTA|Series\s*\d+|RIA|CFS|ChFC)\b/g;

// Education
const EDU_RE = /(BA|BS|BSc|MSc|MA|MBA|PhD|Bachelor|Master|Doctorate)[\w\s]+?(at|from)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*\s+(?:University|College|School))/g;

// Years in industry
const YEARS_RE = /(\d+)\+?\s*(?:years|yrs)\s+(?:of\s+)?(?:experience|in)/i;
const SINCE_RE = /since\s+(\d{4})/i;  // years = current_year - match

// Location
const LOC_RE = /(?:based in|from|lives in)\s+([A-Z][a-zA-Z]+(?:,\s*[A-Z]{2,})?)/i;

// Tier-1 press
const TIER1_SOURCES = ["WSJ","Wall Street Journal","FT","Financial Times","Bloomberg","Reuters","CNBC","NYT","New York Times","Barron's","Forbes","MarketWatch","AP","Associated Press","Washington Post","LA Times"];

// TV
const TV_CHANNELS = ["CNBC","Bloomberg TV","Fox Business","BBC","CBS","NBC","ABC","Today Show","World News Tonight","Good Morning America"];

// Books (need quote detection)
const BOOK_RE = /(?:authored|wrote the book|published the book)\s+["""]([^"""]{5,80})["""]/gi;
```

---

## 8. Scoring — formulas уже в authorsSample.js

### authorScore (base, 0-100)
```js
outlet.dr × 0.35
+ badge (A=20, B=10)
+ seniority (chief=18, editor=15, senior=12, staff=8, contributor=5, guest=3, junior=4, former=-15)
+ (linkedin ? 10 : 0) + (muckrack ? 5 : 0) + (twitter ? 3 : 0) + (email ? 5 : 0)
+ certifications.length × 4
+ (writesFor.length > 1 ? 8 : 0)
+ (outlet.competitorBacklinks.refdomains >= 3 ? 5 : 0)
→ clamp 0-100
```

### authoritativeness (E-E-A-T, 0-50)
```js
certifications.length × 8
+ (years >= 15 ? 10 : years / 1.5)
+ quotedInTier1.length × 3
+ min(tvAppearances.length × 2, 6)
+ (authoredBooks.length >= 1 ? 5 : 0)
+ (muckrack ? 3 : 0)
+ (ownedDomain ? 3 : 0)
+ ((writesFor.length - 1) × 3)
+ (outlet competitorBacklinks >= 3 ? 3 : 0)
+ (finraBrokerCheck=clean ? 5 : 0)
- (status=former ? 5 : 0)
→ clamp 0-50
```

### finalScore = authorScore × (1 + authoritativeness / 100)

### eeatTier
- S: auth ≥ 40
- A: auth 25-39
- B: auth 12-24
- C: auth < 12

---

## 9. Commit cadence

```
After Phase 1 (outlet metadata): commit
After each Phase 2 agent returns: scratch file already saved, no git yet
After Phase 3 consolidated: commit
After Phase 4 (Rule A cleanup): commit
After Phase 5 (E-E-A-T extraction): commit
After Phase 6 (Quality + UI merge): commit + push (triggers Cloudflare deploy)
```

### Commit message template
```
feat(authors): Phase {N} — {description}

- X authors added/updated across Y outlets
- Z needsManualReview flagged
- Tier distribution: S={a}, A={b}, B={c}, C={d}

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
```

---

## 10. Stopping conditions (when to pause and ask Egor)

1. **Phase 2 enumeration yields < 250 authors** (target 500) → data gap, investigate
2. **Phase 3 success rate < 60%** (too many NEEDS_MANUAL_REVIEW) → methodology failing
3. **Agent timeout 3× in same phase** → switch to smaller batches
4. **All rate limits hit simultaneously** → pause 1h, resume
5. **Unexpected 4xx patterns** (not 403/404) → report to Egor

---

## 11. Files I use

| File | Purpose | Туда пишу |
|---|---|---|
| `AUTHORS-SPRINT-EXECUTION.md` | Strategic plan | no |
| `AUTHORS-FIELD-MANUAL.md` | This manual — operator's recipes | no |
| `AUTHORS-HARVESTING-PLAYBOOK.md` | Methodology reference | no |
| `EEAT-AUTHOR-CRITERIA.md` | Scoring criteria | no |
| `scripts/authors-sources.json` | Phase 0 output — site map | phase 1 only |
| `scripts/harvest-phase2-cat{N}.json` | Phase 2 scratch | per agent |
| `scripts/harvest-phase3-batch{N}.json` | Phase 3 scratch | per agent |
| `scripts/harvest-consolidated.json` | After Phase 4 | main process |
| `src/data/authorsSample.js` | Canonical data store | Phase 6 only (replace AUTHORS[]) |
| `logs/2026-04.md` | Session log | after each phase |

---

## 12. Quick-reference decision tree

```
New author to enrich?
  ├─ Has authorUrl?
  │    ├─ YES → Layer 5.5 WebFetch
  │    │        ├─ Success → extract with Rule C prompt
  │    │        ├─ 403 → F1 fallback chain
  │    │        ├─ 404 → F6 (PAGE_GONE, former)
  │    │        └─ Timeout → retry 1× with diff UA
  │    └─ NO → Rule A only
  │
  ├─ Has email observed but protected?
  │    └─ YES → Rule D retry
  │
  ├─ Missing LinkedIn/Twitter after Layer 5.5?
  │    └─ YES → Rule A per-author WebSearch (ALWAYS)
  │
  └─ All 3 socials null после всего?
       └─ Mark needsManualReview=true

Outlet blocked?
  ├─ fallbackStrategy = muckrack_primary → skip direct, use Muck Rack
  ├─ fallbackStrategy = websearch_primary → multi-query enumeration
  └─ fallbackStrategy = direct but got 403 → F1 fallback chain

Rate limit hit?
  → sleep 60, retry UA variant, if 2nd 403 → DOMAIN_RATE_LIMITED, pause 1h
```

---

## 13. Constraints reminder (не забыть)

- Language: русский (общение с Егором), English (data/fields)
- No fabrication — unknown = null
- Don't commit secrets
- Don't delete existing data без команды Егора
- Don't push to origin/main без явного разрешения (Cloudflare auto-deploys)
- В коммите Co-Authored-By Claude
- Логирую каждое action в logs/2026-04.md (по ходу, не в конце)

---

## START TRIGGER

После команды Егора «GO» → начинаю:

```
Phase 1 step 1:
  bash scripts/enrich-outlets.mjs  (если скрипт существует)
  OR
  написать scripts/enrich-outlets.mjs + запустить
  → SITES{} с DR/tier/competitorBacklinks для 96 outlets
  → commit

Phase 2 step 1:
  Spawn 6 parallel agents (categories 1-6) with прямой reference на этот field manual
  Each agent writes scripts/harvest-phase2-cat{N}.json
  Wait for all 6 completions (~60-90 min wall-clock)

(continue through all phases per AUTHORS-SPRINT-EXECUTION.md section 4)
```

Готов.
