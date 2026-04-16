-- Broker redirect mapping (slug → affiliate URL)
CREATE TABLE IF NOT EXISTS brokers (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  affiliate_url TEXT NOT NULL
);

-- Click tracking
CREATE TABLE IF NOT EXISTS clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  broker_slug TEXT NOT NULL,
  referrer TEXT,
  country TEXT,
  user_agent TEXT,
  source_page TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_clicks_broker ON clicks(broker_slug);
CREATE INDEX IF NOT EXISTS idx_clicks_date ON clicks(created_at);

-- Broker changes audit log
CREATE TABLE IF NOT EXISTS broker_changes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  broker_slug TEXT NOT NULL,
  field TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT NOT NULL,
  changed_at TEXT DEFAULT (datetime('now'))
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Ranking order overrides (manual positioning of brokers in 207 rankings)
CREATE TABLE IF NOT EXISTS ranking_overrides (
  ranking_id TEXT NOT NULL,
  broker_slug TEXT NOT NULL,
  position INTEGER NOT NULL,
  featured_label TEXT,
  hidden INTEGER DEFAULT 0,
  notes TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (ranking_id, broker_slug)
);
CREATE INDEX IF NOT EXISTS idx_ro_ranking ON ranking_overrides(ranking_id);

-- Publication planner (gradual rollout for Google indexing)
CREATE TABLE IF NOT EXISTS page_publish (
  slug TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  page_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TEXT,
  published_at TEXT,
  priority INTEGER DEFAULT 0,
  notes TEXT,
  PRIMARY KEY (slug, lang)
);
CREATE INDEX IF NOT EXISTS idx_pp_status ON page_publish(status);
CREATE INDEX IF NOT EXISTS idx_pp_scheduled ON page_publish(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_pp_type ON page_publish(page_type);

-- Link health checks (affiliate URL monitoring)
CREATE TABLE IF NOT EXISTS link_checks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  broker_slug TEXT NOT NULL,
  status_code INTEGER,
  ok INTEGER NOT NULL DEFAULT 1,
  error TEXT,
  checked_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_lc_broker ON link_checks(broker_slug);
CREATE INDEX IF NOT EXISTS idx_lc_date ON link_checks(checked_at);

-- Publication activity log
CREATE TABLE IF NOT EXISTS publish_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  slugs TEXT,
  triggered_by TEXT NOT NULL DEFAULT 'cron',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Review content overrides (expert edits via admin panel)
CREATE TABLE IF NOT EXISTS review_overrides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  broker_slug TEXT NOT NULL,
  section TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  content TEXT NOT NULL,
  edited_by TEXT NOT NULL DEFAULT 'admin',
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(broker_slug, section, lang)
);
CREATE INDEX IF NOT EXISTS idx_rvo_broker ON review_overrides(broker_slug);
CREATE INDEX IF NOT EXISTS idx_rvo_lang ON review_overrides(lang);

-- Expert access tokens (separate from admin API key)
CREATE TABLE IF NOT EXISTS expert_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  lang TEXT NOT NULL DEFAULT 'en',
  broker_slugs TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_et_token ON expert_tokens(token);

-- Outreach donors (refdomains from competitor backlink pulls, for linkbuilding)
CREATE TABLE IF NOT EXISTS donors (
  domain TEXT PRIMARY KEY,
  max_dr REAL,
  overlap INTEGER,
  competitors TEXT,
  total_links INTEGER DEFAULT 0,
  total_dofollow INTEGER DEFAULT 0,
  max_traffic INTEGER DEFAULT 0,
  is_root INTEGER DEFAULT 1,
  tier TEXT,
  email TEXT,
  contact_form_url TEXT,
  contact_page_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  checked_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  -- v2 enrichment (2026-04-16): store all emails + provenance
  all_emails TEXT,           -- JSON array: [{email, tier, weight, source_url, source_method, snippet}, ...]
  primary_email TEXT,        -- selected for outreach (DR-aware rules)
  fallback_email_1 TEXT,     -- 2nd choice
  fallback_email_2 TEXT,     -- 3rd choice
  source_url TEXT,           -- where primary_email was extracted from
  source_method TEXT,        -- plain | cfemail | mailto | json-ld | obfuscated
  source_snippet TEXT,       -- 300 chars of HTML around the email (proof of provenance)
  enriched_v2_at TEXT        -- timestamp of v2 re-crawl
);
CREATE INDEX IF NOT EXISTS idx_donors_overlap ON donors(overlap DESC);
CREATE INDEX IF NOT EXISTS idx_donors_dr ON donors(max_dr DESC);
CREATE INDEX IF NOT EXISTS idx_donors_status ON donors(status);
CREATE INDEX IF NOT EXISTS idx_donors_tier ON donors(tier);

-- Review edit audit log
CREATE TABLE IF NOT EXISTS review_edit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  broker_slug TEXT NOT NULL,
  section TEXT NOT NULL,
  action TEXT NOT NULL,
  edited_by TEXT NOT NULL,
  old_content TEXT,
  new_content TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_rel_broker ON review_edit_log(broker_slug);
CREATE INDEX IF NOT EXISTS idx_rel_date ON review_edit_log(created_at);
