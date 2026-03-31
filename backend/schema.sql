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
