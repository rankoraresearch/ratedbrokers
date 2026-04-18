-- ════════════════════════════════════════════════════════════════════════
-- Migration 002: Token hashing (security hardening)
-- Created: 2026-04-18 (Sprint 8)
-- Spec: AUTHOR-SUBMISSIONS-SPEC.md §8 (security)
--
-- Rationale: storing raw bearer tokens in D1 means a DB leak immediately
-- exposes usable credentials. This migration adds a `token_hash` column
-- (SHA-256 hex digest of the raw token). New invites write the hash;
-- legacy rows (expert_tokens used by expert.js before this change) keep
-- their raw `token` value for back-compat.
--
-- One-shot fail-hard on re-run. See migrations/001 header for full pattern.
-- ════════════════════════════════════════════════════════════════════════

-- Guard table created by migration 001 — safe CREATE IF NOT EXISTS here.
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT DEFAULT (datetime('now'))
);

-- Add token_hash to expert_tokens. Nullable — legacy rows stay on raw
-- `token` lookup path in authorAuth.js; new/rotated rows populate this.
ALTER TABLE expert_tokens ADD COLUMN token_hash TEXT;

-- Unique index on hash for fast lookup and to prevent accidental collisions.
-- Partial index (WHERE token_hash IS NOT NULL) so legacy NULL values don't
-- conflict on the uniqueness constraint.
CREATE UNIQUE INDEX IF NOT EXISTS idx_et_token_hash
  ON expert_tokens(token_hash) WHERE token_hash IS NOT NULL;

INSERT OR IGNORE INTO schema_migrations (version) VALUES ('002-token-hashing');
