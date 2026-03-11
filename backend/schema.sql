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

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
