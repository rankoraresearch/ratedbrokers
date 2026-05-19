# Freshness Pipeline — System Spec

**Created:** 2026-05-07 · **Owner:** Yegor + Claude · **Status:** S0 spec frozen, S1+ in progress.

Single source of truth для системы обновления данных о брокерах. Перед каждой следующей сессией начинай с этого файла.

---

## 1. Цель

Каждый брокер на сайте регулярно обновляется по чёткому процессу: AI-агенты собирают данные, верифицируют, пересчитывают trust score, перестраивают позиции в 293 рейтингах. Yegor нажимает одну кнопку **«Старт»** в админке → через ~3-4 часа получает diff → одобряет → сайт обновлён.

Параллельно daily watchdog'и ловят критичные события (отзыв лицензии, падение affiliate URL, news scandals) — без ожидания monthly cycle.

---

## 2. Архитектура — 5-stage pipeline

```
[1. COLLECT]   →   [2. VERIFY]   →   [3. SCORE]   →   [4. RE-RANK]   →   [5. APPROVE]
   Джон             Боб              Лео             автомат           Yegor (gate)
```

| Stage | Кто | Что делает | Куда пишет |
|---|---|---|---|
| 1. COLLECT | Джон (Claude API) | Скрейпит сайт брокера + регулятора, собирает 10 живых полей | `agent_findings` (D1 staging) |
| 2. VERIFY | Боб (Claude API) | Кросс-чек regulatory + цифровых метрик против 2-го источника | `agent_findings.verified` |
| 3. SCORE | Лео (Claude API) | Применяет методологию (6 категорий × веса), пересчитывает trust score | `score_history` |
| 4. RE-RANK | автоматом | Применяет новые score'ы → пересортировывает 293 рейтинга (превью, не публикуется) | preview view |
| 5. APPROVE | Yegor | Per-broker checkboxes → Apply → MD-файлы пишутся → git commit + push → Cloudflare deploy | `content/brokers/*.md` + git |

**До Stage 5 ничего на сайте не меняется.** Всё живёт в D1 staging. Это safety net.

---

## 3. 12 ключевых решений (зафиксированы 2026-05-07)

| # | Решение | Выбор |
|---|---|---|
| 1 | Что Джон собирает | Только живое: spread, commission, regulations, min_deposit, leverage, instruments, platforms, payment_methods, affiliate_url, status. Founders/history не трогаем |
| 2 | Что Боб верифицирует | Regulatory (FCA Register / ASIC / CFTC / NFA / SEC) + цифровые метрики против 2-го источника |
| 3 | Когда Лео решает сам | Δ score < 0.3 — auto. Δ ≥ 0.3 — флаг "needs review", выделяется в Stage 5 |
| 4 | Триггер запуска | Manual button в админке (нет cron). Когда Yegor скажет |
| 5 | Watchdog'и (Layer 1) | Сразу с MVP: regulator daily diff + Link Health (есть) + News alerts |
| 6 | Скорость | Sequential per broker (Джон→Боб→Лео обязательно по порядку), parallel **между** брокерами = 5 одновременно. ~3-5 часов на 52 брокера |
| 7 | Failure handling | Resume from last broker (state в D1, не теряем работу) |
| 8 | Notifications | Email на egorbarakovskiy@gmail.com (Run complete + critical alerts). Без Telegram |
| 9 | Approve UI | Per-broker checkboxes (можно снять отдельные изменения) |
| 10 | Rollback | Кнопка «Revert this run» — git revert MD + restore score из score_history |
| 11 | Закрылся брокер | Auto-archive в D1 + frontmatter, выводится из всех 293 рейтингов, warning banner на review странице |
| 12 | Объём | Full system сразу (~6-8 недель), без Telegram-бота |

---

## 4. D1 Schema (миграция 004)

Файл: `backend/migrations/004-freshness-pipeline.sql`. Использует pattern из `001-author-submissions.sql` и `003-writer-candidates.sql` (fail-hard, schema_migrations table).

### 4.1. `pipeline_runs` — главная таблица run'ов

```sql
CREATE TABLE pipeline_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending|running|awaiting_approval|approved|rejected|published|failed|rolled_back
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at TEXT,
  approved_at TEXT,
  approved_by TEXT,                         -- 'yegor' (admin key) / future expert
  current_stage INTEGER DEFAULT 0,          -- 0..5 (0=not started, 1=COLLECT, etc.)
  total_brokers INTEGER NOT NULL DEFAULT 0,
  brokers_done INTEGER NOT NULL DEFAULT 0,
  brokers_failed INTEGER NOT NULL DEFAULT 0,
  changes_count INTEGER DEFAULT 0,          -- finalised in Stage 4
  notes TEXT,
  triggered_by TEXT NOT NULL DEFAULT 'manual',
  git_commit_sha TEXT                       -- set after Stage 5 publish
);

CREATE INDEX idx_pr_status ON pipeline_runs(status);
CREATE INDEX idx_pr_started ON pipeline_runs(started_at DESC);
```

### 4.2. `agent_runs` — каждый запуск Джон/Боб/Лео по одному брокеру

```sql
CREATE TABLE agent_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pipeline_run_id INTEGER NOT NULL REFERENCES pipeline_runs(id) ON DELETE CASCADE,
  broker_slug TEXT NOT NULL,
  agent TEXT NOT NULL,                      -- 'john' | 'bob' | 'leo'
  stage INTEGER NOT NULL,                   -- 1|2|3
  status TEXT NOT NULL DEFAULT 'queued',    -- queued|running|done|failed|skipped
  started_at TEXT,
  finished_at TEXT,
  output_json TEXT,                         -- raw agent response (truncated for storage)
  error TEXT,
  prompt_tokens INTEGER,                    -- Claude API usage tracking
  completion_tokens INTEGER,
  cost_usd REAL                             -- approximate
);

CREATE INDEX idx_ar_pipeline ON agent_runs(pipeline_run_id);
CREATE INDEX idx_ar_broker ON agent_runs(broker_slug);
CREATE INDEX idx_ar_status ON agent_runs(status);
```

### 4.3. `agent_findings` — конкретные изменения (поле, было, стало)

```sql
CREATE TABLE agent_findings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pipeline_run_id INTEGER NOT NULL REFERENCES pipeline_runs(id) ON DELETE CASCADE,
  broker_slug TEXT NOT NULL,
  field TEXT NOT NULL,                      -- 'spread' | 'min_deposit' | 'regulations' | etc
  old_value TEXT,                           -- as found in MD before run
  new_value TEXT NOT NULL,                  -- as proposed by Джон
  source_url TEXT,                          -- where Джон found it
  verified INTEGER DEFAULT 0,               -- 0=pending, 1=Bob verified, -1=Bob rejected
  verified_source_url TEXT,                 -- where Боб cross-checked
  verified_at TEXT,
  approved INTEGER DEFAULT 0,               -- 0=pending, 1=Yegor approved, -1=Yegor skipped
  is_critical INTEGER DEFAULT 0,            -- license revoked, broker closed = 1
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_af_pipeline ON agent_findings(pipeline_run_id);
CREATE INDEX idx_af_broker ON agent_findings(broker_slug);
CREATE INDEX idx_af_verified ON agent_findings(verified);
CREATE INDEX idx_af_critical ON agent_findings(is_critical DESC);
```

### 4.4. `score_history` — для отката + аудит

```sql
CREATE TABLE score_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pipeline_run_id INTEGER REFERENCES pipeline_runs(id) ON DELETE SET NULL,
  broker_slug TEXT NOT NULL,
  score_old REAL,
  score_new REAL,
  delta REAL,
  breakdown_json TEXT,                      -- {regulation: 9.6, costs: 8.8, ...}
  needs_review INTEGER DEFAULT 0,           -- 1 if Δ ≥ 0.3 (flagged for Yegor)
  applied INTEGER DEFAULT 0,                -- 1 after Stage 5 publish
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_sh_broker ON score_history(broker_slug, created_at DESC);
CREATE INDEX idx_sh_run ON score_history(pipeline_run_id);
```

### 4.5. `signals` — события от watchdog'ов (S5)

```sql
CREATE TABLE signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,                     -- 'regulator' | 'link_health' | 'news' | 'manual'
  broker_slug TEXT,                         -- nullable (signal could be sitewide)
  severity TEXT NOT NULL DEFAULT 'info',    -- info | warning | critical
  message TEXT NOT NULL,
  detail_json TEXT,                         -- structured payload
  source_url TEXT,
  resolved INTEGER DEFAULT 0,
  resolved_at TEXT,
  resolved_by TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_sig_severity ON signals(severity, resolved);
CREATE INDEX idx_sig_broker ON signals(broker_slug);
CREATE INDEX idx_sig_created ON signals(created_at DESC);
```

### 4.6. `broker_status` — archived/active management

```sql
CREATE TABLE broker_status (
  broker_slug TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'active',    -- active | archived | under_review
  archived_at TEXT,
  archived_reason TEXT,                     -- 'license_revoked' | 'broker_closed' | 'manual'
  updated_at TEXT DEFAULT (datetime('now'))
);
```

---

## 5. API Endpoints (S2 — backend)

Все защищены через `checkAuth()` (existing pattern, `?key=` query или `Authorization: Bearer`).

### 5.1. Admin endpoints (write)

| Method | Path | Purpose |
|---|---|---|
| GET  | `/api/admin/refresh/dashboard` | HTML dashboard (live timeline) |
| POST | `/api/admin/refresh/start` | Создать новый pipeline_run, запустить orchestrator |
| GET  | `/api/admin/refresh/active` | JSON state of currently running run (poll for live UI) |
| GET  | `/api/admin/refresh/runs` | List of all past runs (paginated) |
| GET  | `/api/admin/refresh/:id` | Detail of specific run + agent_runs + findings |
| GET  | `/api/admin/refresh/:id/diff` | Approval-screen data: per-broker findings + score deltas + ranking changes |
| POST | `/api/admin/refresh/:id/approve` | Body `{ approved_finding_ids: [...] }` → Stage 5: write MD, git commit, deploy |
| POST | `/api/admin/refresh/:id/reject` | Discard run without applying |
| POST | `/api/admin/refresh/:id/rollback` | Revert MD + restore score_history (post-publish only) |
| POST | `/api/admin/refresh/:id/run-broker/:slug` | Manual on-demand: re-run pipeline for one broker |
| GET  | `/api/admin/signals` | List active signals (watchdog inbox) |
| POST | `/api/admin/signals/:id/resolve` | Mark signal resolved |

### 5.2. Cron-triggered (no auth, internal)

Расширяем существующий `scheduled()` handler в `src/index.js`:
- Hourly tick (already exists for `page_publish`) — добавить опциональный pipeline tick recovery
- Daily 06:00 UTC (already exists for link_check) — add regulator watchdog (FCA/ASIC/CFTC diff) and news alert poller (S5)

---

## 6. Orchestration — long-running jobs

Cloudflare Workers ограничен ~30s CPU time per request. Pipeline на 52 брокерах × 3 агента = ~3-5 часов wall-clock — нужен другой подход.

**Решение:** Self-rescheduling Worker pattern.

1. `POST /admin/refresh/start` — создаёт `pipeline_runs` row в `pending` → возвращает `run_id` мгновенно.
2. Worker через `ctx.waitUntil()` запускает первую batch (5 брокеров параллельно для Stage 1).
3. После каждой batch — записывает прогресс в D1, проверяет `status` (pause / cancel button).
4. Если есть ещё работа — запускает следующую batch через `fetch(self_url + '/tick')` (или Cloudflare Queue).
5. Live UI polls `/admin/refresh/active` каждые 2 секунды → видит прогресс.

**Альтернатива (более robust):** Cloudflare Durable Objects. Решим в S2 — стартуем с self-rescheduling (проще), мигрируем на DO если упрёмся в лимиты.

**Failure recovery:** Если Worker упал в середине batch — следующий tick (cron hourly) подхватит run в `running` со старым `current_stage` и продолжит с `agent_runs.status='queued'`.

---

## 7. Frontend — Admin Dashboard UI

Раздел: `/api/admin/refresh/dashboard`. NAV item «Freshness» (14-й).

### 7.1. Главный экран

```
┌──────────────────────────────────────────────────────────┐
│  Freshness Pipeline                                       │
│                                                          │
│  Last run: #14 — 2026-05-01 — 12 changes — published    │
│  Active run: NONE                                        │
│                                                          │
│  [▶ Start Monthly Refresh]   [Run for one broker ▼]      │
└──────────────────────────────────────────────────────────┘

┌─ Active Signals (3) ──────────────────────────────────┐
│ 🔴 critical · Plus500 · CySEC license suspended (FCA) │
│ 🟡 warning  · eToro    · Trustpilot dropped 4.5 → 3.9 │
│ 🟢 info     · 5 brokers · monthly refresh due         │
└──────────────────────────────────────────────────────┘

┌─ Past Runs ──────────────────────────────────────────┐
│ #14 · 2026-05-01 · published · 12 changes · 4h 12m   │
│ #13 · 2026-04-01 · published · 8 changes  · 3h 45m   │
│ #12 · 2026-03-01 · rolled-back · 2 changes · 2h 10m  │
└──────────────────────────────────────────────────────┘
```

### 7.2. Live run view

Pipeline timeline (5 stages со статусами + прогресс-баром на active stage). Per-broker grid (52 ячейки) — цвет по статусу: queued (gray) / running (amber pulsing) / done (green) / failed (red).

### 7.3. Approval screen (Stage 5)

```
12 brokers changed   |   3 score changes ≥ 0.3   |   1 critical flag

[ ] Select all
[✓] IC Markets    spread RAW: 0.1 → 0.0    score 9.6 → 9.7 (+0.1)
[✓] eToro         crypto fee: 1.0% → 0.9%  score 8.4 → 8.45 (+0.05)
[✓] Plus500       CySEC suspended 🚨       score 8.2 → 6.2 (−2.0) [needs review]
[ ] XM            min_deposit: $5 → $0     score 7.8 → 7.9 (+0.1)
…

Ranking position changes preview:
  /best-forex-brokers:    Plus500 #4 → #18 ⬇
  /best-cfd-brokers:      IC Markets #2 → #1 ⬆
  …

[✗ Reject Run]   [✓ Approve Selected (3) & Publish]
```

---

## 8. MD Writing & Git Integration (S6)

После approve, Stage 5 пишет:
1. Apply approved `agent_findings` к `content/brokers/*.md` (only frontmatter fields, never body)
2. Update `last_verified: <today>` в каждом изменённом файле
3. Single batched commit:

```
refresh: monthly 2026-05 (12 brokers updated)

Changes via Freshness Pipeline run #14.
Stage timestamps: COLLECT 14:23, VERIFY 16:01, SCORE 17:45, APPROVED 18:12.

Brokers updated: ic-markets, etoro, plus500, xm, ...

Co-Authored-By: Джон <john@ratedbrokers.local>
Co-Authored-By: Боб <bob@ratedbrokers.local>
Co-Authored-By: Лео <leo@ratedbrokers.local>
Reviewed-By: Yegor Barakovskiy <egorbarakovskiy@gmail.com>
```

4. `git push origin main` → Cloudflare Pages auto-deploy
5. `pipeline_runs.git_commit_sha` updated, `status='published'`

**Where does git happen?** Cloudflare Workers can't run `git` directly. Options for S6 (decide later):
- **Option A:** GitHub Contents API (worker uses `GITHUB_TOKEN` to commit files via API)
- **Option B:** GitHub Actions trigger (worker dispatches workflow_dispatch event with payload)
- **Option C:** Local script (operator runs `npm run apply-refresh <run-id>` on Mac after approve)

Lean towards **Option A** for full automation. Decide in S6.

---

## 9. Watchdog Layer (S5 — daily background)

Расширяем existing `scheduled()` handler (cron hourly + daily 06:00).

### 9.1. Regulator watchdog (daily 07:00 UTC)

For each broker, for each `regulation`:
- Check FCA Register / ASIC / CFTC / NFA / SEC current status by license number
- If status changed (active → suspended, revoked, etc.) → INSERT into `signals` with severity='critical'
- Email Yegor immediately

Implementation: scrape regulator pages (rate-limited, cached). For FCA: `register.fca.org.uk/s/firm?id=XXX`. For ASIC: similar.

### 9.2. News watchdog (daily 08:00 UTC)

Use Anthropic Claude API to summarise news for each broker:
- Prompt: "Have there been any regulatory actions, scandals, or operational changes for {broker_name} in the past 24 hours?"
- Tool use: WebSearch
- If finding → `signals` with severity='warning'

### 9.3. Link Health (already exists, daily 06:00)

Уже работает. Расширяем — при failure писать в `signals` (не только в `link_checks`).

---

## 10. Email Notifications (S8)

Через Cloudflare Email Workers (или MailChannels free tier для CF Workers).

**Triggers:**
- Pipeline run complete (Stage 4 done, awaiting approval) — digest
- Critical signal (license revoked, broker closed) — instant
- Weekly watchdog summary (every Monday)

**Format:** plain HTML + plaintext fallback. From `noreply@ratedbrokers.com`. Reply-to `egorbarakovskiy@gmail.com`.

---

## 11. Auto-archive (S7)

Trigger conditions:
- `agent_findings` says `regulations[i].status = revoked` AND no other Tier-1 regulator remaining
- `agent_findings` says broker `status = closed`
- Manual signal escalation

Actions:
- `broker_status.status = 'archived'`
- Frontmatter: `status: archived` + `archived_at: <date>` + `archived_reason: <reason>`
- Frontend: `/reviews/{slug}` shows red warning banner above hero
- Removed from all 293 rankings (filter in `rankingFilters.js`)
- Sitemap: still listed but `noindex` meta added

---

## 12. Cost Tracking

Each `agent_runs` row stores `prompt_tokens`, `completion_tokens`, `cost_usd`. Dashboard shows monthly spend total.

**Estimated cost per monthly run:**
- Джон: ~50K input + ~5K output × 52 brokers × $3/$15 per 1M = ~$15
- Боб: ~30K input + ~3K output × 52 = ~$10
- Лео: ~15K input + ~1K output × 52 = ~$5
- **Total ~$30/month** for monthly pipeline.

Watchdog'и: ~$10-20/month (lighter, cached results).

**Hard limit:** API spending limit set at platform.claude.com to $100/month. Worker reads remaining budget before each batch.

---

## 13. Security

- API key stored as Cloudflare secret (`wrangler secret put ANTHROPIC_API_KEY`)
- Admin endpoints behind existing `checkAuth()` (require `API_KEY` env)
- Rate limiting on `/admin/refresh/start` — only 1 active run at a time
- All MD writes go through approval gate (no direct write from agents)
- Rollback button is git-revert based — fully reversible

---

## 14. Sprint Plan

| Phase | Sprint | Description | Days |
|---|---|---|---|
| 1 | **S0** ✅ | This spec | 0.25 |
| 1 | **S1** | D1 migration 004 | 0.5 |
| 1 | **S2** | Backend orchestrator + admin handlers (mock agents) | 2 |
| — | gate | Codex review S0+S1+S2 → 10/10 | — |
| 2 | **S3** | Real Claude API integration (Джон/Боб/Лео) | 2.5 |
| 2 | **S4** | Admin UI dashboard (timeline + approval) | 2.5 |
| — | gate | Codex review S3+S4 → 10/10 | — |
| 3 | **S5** | Watchdogs (regulator + news) | 2 |
| 3 | **S6** | MD writer + GitHub Contents API | 1 |
| — | gate | Codex review S5+S6 → 10/10 | — |
| 4 | **S7** | Auto-archive logic | 0.5 |
| 4 | **S8** | Email notifications | 0.5 |
| 4 | **S9** | Pilot run + Codex review | 1 |
| 4 | **S10** | Production rollout + docs | 0.5 |

**Total:** ~14 рабочих дней. **Календарных** ~6-8 недель (между спринтами Codex review + bugfixes).

---

## 15. Open Questions (locked at S0)

| # | Question | Decision |
|---|---|---|
| Q-A | git integration: Contents API vs GH Action vs local script | Lean Contents API, finalise in S6 |
| Q-B | Orchestration: self-rescheduling Worker vs Durable Objects | Start self-reschedule, migrate if needed |
| Q-C | Email: MailChannels vs CF Email Workers vs SendGrid | Lean MailChannels (free, integrated), finalise in S8 |
| Q-D | Lang scope: only EN MD for now | Yes — RU/DE/ES/AR added later via separate `_lang.md` files |

---

## 16. Resume Pointers

- **MEMORY.md / status.md** entries:
  - `freshness_pipeline_spec` — pointer to this file
  - Update `memory/status.md` "Active Research" section
- **DEPLOY-RUNBOOK.md** — add Freshness Pipeline section after S10
- **CLAUDE.md** (project) — add row to file table:
  - `FRESHNESS-PIPELINE-SPEC.md` | This document, system entry point

---

**Сверяемся с этим документом перед каждым спринтом.** Если архитектура меняется — обновляем spec, не код.
