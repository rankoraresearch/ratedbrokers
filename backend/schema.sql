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
