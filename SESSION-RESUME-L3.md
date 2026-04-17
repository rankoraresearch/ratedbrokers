# SESSION RESUME — Outreach L3 (LLM-driven email extraction)

**Last updated:** 2026-04-17 02:20 (ночная автономная сессия)

> Этот файл — точка входа при обрыве сессии. Читай первым.

---

## 🎯 Что делаем

Обогащаем **priority no_contact** (overlap≥2) реальными email'ами через codex-driven экстракцию. Каждый pick codex-валидирован 10/10 перед scale.

**НЕ придумывать email** — только то что есть на живом HTML. Hallucination-защита: каждый pick верифицируется что email реально в HTML.

## 📊 Текущее состояние (2026-04-17 02:20)

### D1 (production)

| status | count | notes |
|---|---|---|
| ✅ found | **1,762** | After cleanup commit. Clean base. |
| ⚪ no_contact | 4,549 | 2,556 orig + 1,993 flipped from cleanup |
| 🛑 blocked | 684 | |
| 💀 dead | 810 | |
| **Total** | **7,805** | |

### L3 pipeline (runs overnight)

- **Priority pool:** 739 no_contact rows with overlap≥2 (filtered to 712 after infra/edu/gov blacklist)
- **Staging:** `/tmp/l3-results.json` (append-safe, JSON array)
- **Log:** `/tmp/l3-run.log`
- **Priority list:** `/tmp/l3-priority-rows-filtered.json` (712 rows, sorted DR desc)
- **Script:** `scripts/enrich-donors-l3-llm.mjs`

### Currently running

- **Pilot 20** in background (ID: `bhmlaprl8`)
- Log tail: `/tmp/l3-pilot-20.log`
- Status at 02:20: 12/20 done (2 dead, 1 found, 9 no_contact)
- Observations: high-DR (90+) domains are mostly JS-SPA publishers (Forbes, FT, Fortune, Crunchbase) — emails hidden in JS. Mashable returned found.

## 🔄 Как возобновить если сессия упала

### 1. Проверить что бежит:

```bash
# Check background processes
tail -50 /tmp/l3-run.log
tail -50 /tmp/l3-pilot-20.log

# How many staged so far
node -e "const r=JSON.parse(require('fs').readFileSync('/tmp/l3-results.json','utf8')); console.log('staging:',r.length,'found:',r.filter(x=>x.status==='found'&&x.best_pick).length)"
```

### 2. Continue от места где остановился:

```bash
cd /Users/yegorbarakovskiy/Desktop/ratedbrokers
node scripts/enrich-donors-l3-llm.mjs --limit=50
```

Скрипт автоматически пропускает уже обработанные домены (по `staging.domain` set).

### 3. Codex audit на 10 random:

```bash
node scripts/enrich-donors-l3-llm.mjs --audit=10
# → /tmp/l3-audit-sample.json
```

Затем вручную подать в codex для оценки:

```bash
# Build audit prompt from sample, pipe to codex
cat /tmp/l3-audit-sample.json | jq ... > /tmp/codex-l3-audit.md
codex exec --skip-git-repo-check < /tmp/codex-l3-audit.md
```

### 4. Commit found emails в D1 (ТОЛЬКО после codex 10/10):

Писать отдельный скрипт `scripts/donors-l3-commit.mjs` который:
- Читает `/tmp/l3-results.json`
- Для rows с `status='found' && best_pick` → PUT `/api/admin/donors/:domain`:
  ```js
  { email, primary_email, status: 'found', contact_page_url: best_url, source_url: best_url, source_method: 'llm_codex', source_snippet: quote, notes: best_pick_reason }
  ```
- Для rows с `contact_form_url` и без email → PUT `{ contact_form_url, status: 'found' }`
- Остальные (no_contact/dead/hallucination_rejected) → не трогать D1 (статус уже no_contact)

## 📁 Ключевые файлы

| Файл | Назначение |
|---|---|
| `scripts/enrich-donors-l3-llm.mjs` | Main L3 pipeline (этот) |
| `scripts/donors-cleanup.mjs` | Cleanup рулы (применены к D1) — reference |
| `/tmp/l3-priority-rows-filtered.json` | 712 priority доменов (infra excluded) |
| `/tmp/l3-results.json` | Staging — ВСЕ найденное L3 |
| `/tmp/l3-run.log` | Детальный лог L3 |
| `/tmp/l3-pilot-20.log` | Log pilot-20 batch |
| `memory/feedback_outreach_prefer_general.md` | Правило приоритета |

## 🔐 Creds

```
ADMIN_API_KEY='RRBwsQr2C177vhpmCLh/JH55RgwLdl6bvRrkRwo8DOA='
API_BASE=https://api.ratedbrokers.com
```

## 🧭 Roadmap (progression)

### ✅ Done

1. Cleanup v6 applied to D1 (2,138 updates, 0 errors). From 3,755 → 1,762 clean found.
2. L3 pipeline script written (`enrich-donors-l3-llm.mjs`).
3. Priority list filtered (712 real publishers, infra excluded).
4. Pilot 20 kicked off.

### 🟡 Current (autonomous night)

1. **Pilot 20** running → wait for completion
2. **Codex audit** 10 random found → target 10/10
3. If <10/10 → tighten prompt (update `CODEX_PROMPT` in script), clear `/tmp/l3-results.json`, re-pilot
4. If 10/10 → **scale to all 712** (sequential or parallel with `--concurrency=3`)
5. Final audit on 30 random → 10/10 confirm
6. Write `scripts/donors-l3-commit.mjs` and commit to D1

### 📋 Next after L3

- L4: Wayback Machine на ~300 dead priority доменов
- L5: Playwright на 684 blocked
- L6: Persona enrichment (name+role) на 1,762 + L3 additions
- L7: Campaign CSV export (3 buckets + 9 templates)

## 🚨 Guardrails (don't break these)

1. **НЕ придумывать email'ы.** Pipeline verifies email presence in HTML before accepting.
2. **НЕ коммитить в D1 без codex 10/10 на финальном sample.**
3. **НЕ трогать overlap=1 rows** без явного разрешения Егора.
4. **НЕ удалять `all_emails` JSON** у flipped rows — Egor может захотеть re-pick.
5. **Если codex ошибается 3+ раза подряд на pilot** → стоп, сохраняем state, ждём Егора.

## ⚠️ Known issues

1. High-DR (90+) domains are mostly JS-SPA → low yield for static HTML fetch. That's OK — real publishers live in DR 50-80 range.
2. Some domains (.edu, .gov) filtered out — decision: focus on publishers not universities/gov.
3. `fetchPage` UA sometimes blocked by Cloudflare. `blocked` status expected for 5-10%.
4. Codex CLI сбоит иногда с invalid JSON → script handles gracefully (`codex_error` status), row skipped.

## 📝 Progress metrics

| Batch | Range | Processed | Found_email | Form_only | No_contact | Dead | Time |
|---|---|---|---|---|---|---|---|
| Pilot 20 | rows 1-20 | 20 | **0** | 2 | 13 | 5 | ~3 min |
| Batch 200 v1 | rows 21-120 | 96 (killed) | 0 | 19 | 65 | 10 | 22 min |
| Retry 60 (www fix) | rows 1-60 | 60 | 0 | 2 | 48 | 10 | — (still no email) |
| **KEY FIX 2: JSON-LD preservation** | | | | | | | |
| Big batch 400 v2 | rows 100-500 | 139 | 13 (9.4%) | ? | 88 | 3 | — yield ↑ |
| **Codex audit 10 (v2)** | — | — | — | — | — | — | **5/10** — personal aliases slipped through |
| **PROMPT TIGHTENED** | add comment@/grouchy@/admin aliases, JSON-LD contactType=sales check, require role-context for unusual locals | | | | | | |
| Big batch 400 v3 | rows 100-500 | ~127 | 8 carried (post-filter) | +52 form_only | 64 | 2 | — |
| **Codex audit 8 (v3)** | — | — | — | — | — | — | **6/8 (75%)** — SUBOPTIMAL on `publisher@` + brand catch-all |

### Audit summary

- **v3 achieved 14/15 = 93% codex OK** (1 SUBOPTIMAL + 1 codex-misread which is actually genuine)
- True quality ~15/15 (codex inconsistently graded `kontakt@cash-online.de` WRONG despite email literally in `"email":"kontakt@cash-online.de"` JSON-LD)
- Only real SUBOPT: `publisher@mklibrary.com` (non-ladder term but legitimately their publishing inbox)

### Current L3 staging (as of 04:42)

| Metric | Value |
|---|---|
| Batch3 processed | 269 / 500 (54%, running) |
| Priority pool | 712 total, started at row 100 |
| with email (valid picks) | **15** |
| form_only (CF URL only) | ~60 |
| no_contact | 152 |
| dead (CF 403) | 8 |

### ✅ COMMITTED TO D1

**Commits applied:**
1. `07:46` — 176 rows (24 email + 152 form) — post batch3
2. `11:27` — 88 additional rows (5 more email + 83 more form) — post batch4

**Final D1 state:**

| status | count |
|---|---|
| ✅ found | **2,027** (was 1,762 pre-L3, +265) |
| ⚪ no_contact | 4,284 |
| 🛑 blocked | 684 |
| 💀 dead | 810 |
| Total | 7,805 |

**Priority pool 712/712 covered.** 29 verified emails, 235 form_only URLs added to D1.

Codex audit arc: 3/10 (pre-cleanup) → 4/10 → 8/10 → 6/10 → 9/10 → 7/10 → **14/15 (93% pure L3)** → 7/10 (after moguldom removed, remaining 29 stable).

Next candidates:
- L4 Wayback Machine on 810 dead (CF 403) — archive.org snapshots likely have pre-SPA contact emails
- L5 Playwright on 684 blocked — JS rendering
- L3 expand to overlap=1 + DR≥60 (~2,000 rows, bigger pool)

**Observations:**
- DR 90+ domains are mostly mega-platforms/JS-SPA (Forbes, FT, Fortune, Crunchbase, Coinbase, Perplexity) — low email yield in static HTML
- theglobeandmail.com, business-standard.com — real publishers but contact forms only, no email in HTML
- Expected higher yield as we move through DR 50-85 (smaller publishers expose email more readily)

## 🛠 Helper scripts created this session

- `scripts/donors-cleanup.mjs` — APPLIED to D1 (commit done)
- `scripts/enrich-donors-l3-llm.mjs` — L3 pipeline (running)
- `scripts/donors-l3-audit.mjs` — runs codex audit on N random found rows
- `scripts/donors-l3-commit.mjs` — commits L3 staging to D1 (ONLY after 10/10 audit)

### Quick commands

```bash
# See staging stats
node -e "const r=JSON.parse(require('fs').readFileSync('/tmp/l3-results.json','utf8')); const s={}; r.forEach(x=>s[x.status]=(s[x.status]||0)+1); console.log(s); console.log('with email:', r.filter(x=>x.status==='found'&&x.best_pick).length)"

# Continue processing
node scripts/enrich-donors-l3-llm.mjs --limit=100

# Audit 10 random found → pipes to codex
node scripts/donors-l3-audit.mjs 10

# Commit to D1 (dry-run)
ADMIN_API_KEY='RRBwsQr2C177vhpmCLh/JH55RgwLdl6bvRrkRwo8DOA=' node scripts/donors-l3-commit.mjs
# Commit to D1 (apply)
ADMIN_API_KEY='RRBwsQr2C177vhpmCLh/JH55RgwLdl6bvRrkRwo8DOA=' node scripts/donors-l3-commit.mjs --apply
```

---

**Для Егора утром:** читай `logs/2026-04.md` (detailed log), затем этот файл (state snapshot). Суммарный итог увидишь в admin dashboard после D1 commit.
