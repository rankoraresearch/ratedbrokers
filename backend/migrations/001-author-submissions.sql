-- ════════════════════════════════════════════════════════════════════════
-- Migration 001: Author Submissions Pipeline
-- Created: 2026-04-18
-- Spec: AUTHOR-SUBMISSIONS-SPEC.md (Codex-approved 10/10)
--
-- ⚠️  ONE-SHOT VERSIONED MIGRATION — NOT IDEMPOTENT.
--     D1 (SQLite) has no "ADD COLUMN IF NOT EXISTS" — re-running after
--     success will fail on ALTER TABLE. The schema_migrations table guards
--     against accidental re-runs via a SELECT probe + INSERT at the end.
--
-- To apply:
--   cd backend && wrangler d1 execute ratedbrokers --local --file=migrations/001-author-submissions.sql
--   cd backend && wrangler d1 execute ratedbrokers --remote --file=migrations/001-author-submissions.sql  (Egor approve only)
--
-- To verify:
--   wrangler d1 execute ratedbrokers --local --command="SELECT version, applied_at FROM schema_migrations"
--
-- To roll back (partial — ALTER cols cannot be dropped on D1):
--   DROP TABLE content_submissions;
--   DROP TABLE submission_events;
--   DROP TABLE submission_imports;
--   DROP TABLE ranking_content;
--   DELETE FROM schema_migrations WHERE version='001-author-submissions';
-- ════════════════════════════════════════════════════════════════════════

-- ─── Step 0: Migration versioning table + re-run guard ───
-- schema_migrations must exist first. CREATE IF NOT EXISTS is safe.
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT DEFAULT (datetime('now'))
);

-- Probe: if migration already applied, the INSERT OR IGNORE at the end
-- becomes a no-op but the ALTER statements above will fail hard. That's
-- the desired behavior — the operator sees the failure and knows to skip.
-- (D1 CLI does not support conditional PL/SQL blocks.)

-- ─── Step 1: Extend expert_tokens with role + scopes ───
-- role: 'expert' (legacy — only broker_slugs), 'author' (new — scopes_json), 'admin' (future)
-- scopes_json: JSON { reviews:[...]|["*"], rankings:[...]|["*"], cards:[...]|["*"], langs:[...] }
ALTER TABLE expert_tokens ADD COLUMN role TEXT NOT NULL DEFAULT 'expert';
ALTER TABLE expert_tokens ADD COLUMN scopes_json TEXT;

-- ─── Step 2: Extend ranking_overrides with description dual-slot ───
-- Per-card description on a broker row inside a ranking, with publish gating.
-- description_md_draft  : edited by author/admin, not visible on site
-- description_md        : live, visible on /ratings/:id
-- description_published_at: NULL = draft-only; NOT NULL = live
ALTER TABLE ranking_overrides ADD COLUMN description_md_draft TEXT;
ALTER TABLE ranking_overrides ADD COLUMN description_md TEXT;
ALTER TABLE ranking_overrides ADD COLUMN description_lang TEXT NOT NULL DEFAULT 'en';
ALTER TABLE ranking_overrides ADD COLUMN description_published_at TEXT;

-- ─── Step 3: Create content_submissions (raw author text) ───
CREATE TABLE IF NOT EXISTS content_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  target_type TEXT NOT NULL,
  target_slug TEXT NOT NULL,
  target_section TEXT,
  target_ranking_broker TEXT,
  lang TEXT NOT NULL DEFAULT 'en',
  title TEXT,
  body_md TEXT NOT NULL,
  word_count INTEGER,
  status TEXT NOT NULL DEFAULT 'draft',
  admin_notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  submitted_at TEXT,
  accepted_at TEXT,
  processed_at TEXT,
  published_at TEXT,
  rejected_at TEXT,
  reverted_at TEXT,
  FOREIGN KEY (author_id) REFERENCES expert_tokens(id)
);
CREATE INDEX IF NOT EXISTS idx_cs_author ON content_submissions(author_id);
CREATE INDEX IF NOT EXISTS idx_cs_status ON content_submissions(status);
CREATE INDEX IF NOT EXISTS idx_cs_target ON content_submissions(target_type, target_slug);

-- ─── Step 4: Create submission_events (audit timeline) ───
CREATE TABLE IF NOT EXISTS submission_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id INTEGER,
  event TEXT NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (submission_id) REFERENCES content_submissions(id)
);
CREATE INDEX IF NOT EXISTS idx_se_submission ON submission_events(submission_id);

-- ─── Step 5: Create submission_imports (submission → destination refs) ───
CREATE TABLE IF NOT EXISTS submission_imports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  destination_type TEXT NOT NULL,
  destination_ref TEXT NOT NULL,
  imported_at TEXT DEFAULT (datetime('now')),
  imported_by TEXT NOT NULL,
  FOREIGN KEY (submission_id) REFERENCES content_submissions(id)
);
CREATE INDEX IF NOT EXISTS idx_si_submission ON submission_imports(submission_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_si_dest_unique
  ON submission_imports(submission_id, destination_type, destination_ref);

-- ─── Step 6: Create ranking_content (SEO content with draft/published slots) ───
CREATE TABLE IF NOT EXISTS ranking_content (
  ranking_id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  meta_title_draft TEXT,
  meta_desc_draft TEXT,
  intro_md_draft TEXT,
  key_finding_draft TEXT,
  how_we_ranked_draft TEXT,
  outro_md_draft TEXT,
  faq_json_draft TEXT,
  meta_title TEXT,
  meta_desc TEXT,
  intro_md TEXT,
  key_finding TEXT,
  how_we_ranked TEXT,
  outro_md TEXT,
  faq_json TEXT,
  updated_by TEXT NOT NULL DEFAULT 'admin',
  draft_updated_at TEXT,
  published_at TEXT,
  PRIMARY KEY (ranking_id, lang)
);
CREATE INDEX IF NOT EXISTS idx_rc_published ON ranking_content(published_at);

-- ─── Step 7: Mark migration as applied ───
INSERT OR IGNORE INTO schema_migrations (version) VALUES ('001-author-submissions');
