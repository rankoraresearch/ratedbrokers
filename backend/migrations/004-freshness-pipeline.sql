-- ════════════════════════════════════════════════════════════════════════
-- Migration 004: Freshness Pipeline (monthly broker refresh + watchdogs)
-- Created: 2026-05-07
-- Spec: FRESHNESS-PIPELINE-SPEC.md (root)
--
-- Tables:
--   pipeline_runs    — главная таблица run'ов (Stage 1..5 lifecycle)
--   agent_runs       — каждый запуск Джон/Боб/Лео по одному брокеру
--   agent_findings   — конкретные изменения (поле, было, стало, источник)
--   score_history    — для отката + audit trail
--   signals          — события от daily watchdog'ов
--   broker_status    — archived/active management
--
-- One-shot fail-hard on re-run. См. migrations/003 для full pattern.
--
-- APPLY:
--   cd backend && npx wrangler d1 execute ratedbrokers --local  --file=migrations/004-freshness-pipeline.sql
--   cd backend && npx wrangler d1 execute ratedbrokers --remote --file=migrations/004-freshness-pipeline.sql
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT DEFAULT (datetime('now'))
);

-- ─── 1. pipeline_runs — главная таблица run'ов ───
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status TEXT NOT NULL DEFAULT 'pending',     -- pending | running | awaiting_approval | approved | rejected | published | failed | rolled_back
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at TEXT,
  approved_at TEXT,
  approved_by TEXT,                           -- 'yegor' | future expert email
  current_stage INTEGER DEFAULT 0,            -- 0=not started, 1=COLLECT, 2=VERIFY, 3=SCORE, 4=RE-RANK, 5=APPROVE
  total_brokers INTEGER NOT NULL DEFAULT 0,
  brokers_done INTEGER NOT NULL DEFAULT 0,
  brokers_failed INTEGER NOT NULL DEFAULT 0,
  changes_count INTEGER DEFAULT 0,            -- finalised in Stage 4
  notes TEXT,
  triggered_by TEXT NOT NULL DEFAULT 'manual',
  git_commit_sha TEXT                         -- set after Stage 5 publish
);

CREATE INDEX IF NOT EXISTS idx_pr_status  ON pipeline_runs(status);
CREATE INDEX IF NOT EXISTS idx_pr_started ON pipeline_runs(started_at DESC);

-- ─── 2. agent_runs — каждый запуск агента по одному брокеру ───
CREATE TABLE IF NOT EXISTS agent_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pipeline_run_id INTEGER NOT NULL REFERENCES pipeline_runs(id) ON DELETE CASCADE,
  broker_slug TEXT NOT NULL,
  agent TEXT NOT NULL,                        -- 'john' | 'bob' | 'leo'
  stage INTEGER NOT NULL,                     -- 1 | 2 | 3
  status TEXT NOT NULL DEFAULT 'queued',      -- queued | running | done | failed | skipped
  started_at TEXT,
  finished_at TEXT,
  output_json TEXT,                           -- raw agent response (truncated for storage if large)
  error TEXT,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  cost_usd REAL
);

CREATE INDEX IF NOT EXISTS idx_ar_pipeline ON agent_runs(pipeline_run_id);
CREATE INDEX IF NOT EXISTS idx_ar_broker   ON agent_runs(broker_slug);
CREATE INDEX IF NOT EXISTS idx_ar_status   ON agent_runs(status);

-- ─── 3. agent_findings — конкретные изменения (was → now → verified → approved) ───
CREATE TABLE IF NOT EXISTS agent_findings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pipeline_run_id INTEGER NOT NULL REFERENCES pipeline_runs(id) ON DELETE CASCADE,
  broker_slug TEXT NOT NULL,
  field TEXT NOT NULL,                        -- 'spread' | 'min_deposit' | 'regulations' | etc
  old_value TEXT,                             -- as found in MD before run
  new_value TEXT NOT NULL,                    -- as proposed by Джон
  source_url TEXT,                            -- where Джон found it
  verified INTEGER DEFAULT 0,                 -- 0=pending, 1=Bob verified, -1=Bob rejected
  verified_source_url TEXT,                   -- where Боб cross-checked
  verified_at TEXT,
  approved INTEGER DEFAULT 0,                 -- 0=pending, 1=Yegor approved, -1=Yegor skipped
  is_critical INTEGER DEFAULT 0,              -- license revoked, broker closed = 1
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_af_pipeline ON agent_findings(pipeline_run_id);
CREATE INDEX IF NOT EXISTS idx_af_broker   ON agent_findings(broker_slug);
CREATE INDEX IF NOT EXISTS idx_af_verified ON agent_findings(verified);
CREATE INDEX IF NOT EXISTS idx_af_critical ON agent_findings(is_critical DESC);

-- ─── 4. score_history — для отката + audit trail ───
CREATE TABLE IF NOT EXISTS score_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pipeline_run_id INTEGER REFERENCES pipeline_runs(id) ON DELETE SET NULL,
  broker_slug TEXT NOT NULL,
  score_old REAL,
  score_new REAL,
  delta REAL,
  breakdown_json TEXT,                        -- {"regulation":9.6,"costs":8.8,"trustpilot":9.7,"expert":9.7,"platform":9.5,"execution":9.8}
  needs_review INTEGER DEFAULT 0,             -- 1 if Δ ≥ 0.3 (flagged for Yegor)
  applied INTEGER DEFAULT 0,                  -- 1 after Stage 5 publish
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sh_broker ON score_history(broker_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sh_run    ON score_history(pipeline_run_id);

-- ─── 5. signals — события от daily watchdog'ов (S5) ───
CREATE TABLE IF NOT EXISTS signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,                       -- 'regulator' | 'link_health' | 'news' | 'manual'
  broker_slug TEXT,                           -- nullable (signal could be sitewide)
  severity TEXT NOT NULL DEFAULT 'info',      -- info | warning | critical
  message TEXT NOT NULL,
  detail_json TEXT,                           -- structured payload
  source_url TEXT,
  resolved INTEGER DEFAULT 0,
  resolved_at TEXT,
  resolved_by TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sig_severity ON signals(severity, resolved);
CREATE INDEX IF NOT EXISTS idx_sig_broker   ON signals(broker_slug);
CREATE INDEX IF NOT EXISTS idx_sig_created  ON signals(created_at DESC);

-- ─── 6. broker_status — archived/active management ───
CREATE TABLE IF NOT EXISTS broker_status (
  broker_slug TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'active',      -- active | archived | under_review
  archived_at TEXT,
  archived_reason TEXT,                       -- 'license_revoked' | 'broker_closed' | 'manual'
  updated_at TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO schema_migrations (version) VALUES ('004-freshness-pipeline');
