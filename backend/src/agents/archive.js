/**
 * Auto-archive helper (S7).
 *
 * When a broker is detected as closed / fundamentally compromised (Tier-1
 * license revoked, sustained scandal, business shutdown), the pipeline marks
 * it `archived` in broker_status. The public frontend filters archived slugs
 * out of all 293 rankings; the review page shows a "DO NOT USE" banner.
 *
 * This module owns the D1 writes. Callers (handleApproveRun, regulator
 * watchdog, news watchdog) detect the condition and invoke archiveBroker().
 *
 * Spec: FRESHNESS-PIPELINE-SPEC.md §11.
 */

// Same slug allowlist as md-writer.js — defense-in-depth, even though the slug
// originates from our brokers table.
const SAFE_SLUG_RE = /^[a-z0-9][a-z0-9-]{0,99}$/;
const VALID_REASONS = new Set(['license_revoked', 'broker_closed', 'scandal', 'manual', 'critical_finding']);

function assertSlug(slug) {
  if (typeof slug !== 'string' || !SAFE_SLUG_RE.test(slug)) {
    throw new Error(`Invalid broker_slug: ${String(slug).slice(0, 60)}`);
  }
}

function nowIso() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Mark a broker as archived. Idempotent — re-archiving is a no-op except for
 * refreshing updated_at. Returns { archived: boolean, was_already_archived }.
 *
 * @param {object} env - Worker env (DB binding)
 * @param {string} slug
 * @param {string} reason - one of VALID_REASONS
 * @param {object} [detail] - optional metadata to store in archived_reason
 */
export async function archiveBroker(env, slug, reason, detail = null) {
  assertSlug(slug);
  if (!VALID_REASONS.has(reason)) {
    throw new Error(`Invalid archive reason: ${reason}. Valid: ${[...VALID_REASONS].join(', ')}`);
  }
  const reasonStr = detail ? `${reason}: ${String(detail).slice(0, 200)}` : reason;

  // Check current status — only flip from 'active' to 'archived'.
  const current = await env.DB.prepare(
    `SELECT status FROM broker_status WHERE broker_slug = ?`
  ).bind(slug).first();
  const wasAlreadyArchived = current?.status === 'archived';

  if (wasAlreadyArchived) {
    // Refresh updated_at and reason in case it changed.
    await env.DB.prepare(
      `UPDATE broker_status SET updated_at = ?, archived_reason = ?
       WHERE broker_slug = ? AND status = 'archived'`
    ).bind(nowIso(), reasonStr, slug).run();
    return { archived: false, was_already_archived: true, reason: reasonStr };
  }

  // UPSERT: insert if missing, otherwise update to archived.
  await env.DB.prepare(
    `INSERT INTO broker_status (broker_slug, status, archived_at, archived_reason, updated_at)
     VALUES (?, 'archived', ?, ?, ?)
     ON CONFLICT(broker_slug) DO UPDATE SET
       status = 'archived',
       archived_at = excluded.archived_at,
       archived_reason = excluded.archived_reason,
       updated_at = excluded.updated_at`
  ).bind(slug, nowIso(), reasonStr, nowIso()).run();

  return { archived: true, was_already_archived: false, reason: reasonStr };
}

/**
 * Manual unarchive — reverts an archived broker back to 'active'.
 * Used when auto-archive was a false positive.
 */
export async function unarchiveBroker(env, slug) {
  assertSlug(slug);
  const result = await env.DB.prepare(
    `UPDATE broker_status SET status = 'active', archived_at = NULL,
      archived_reason = NULL, updated_at = ?
     WHERE broker_slug = ? AND status = 'archived'`
  ).bind(nowIso(), slug).run();
  return { unarchived: (result.meta?.changes ?? 0) > 0 };
}

/**
 * List currently archived brokers. Used by:
 *  - admin dashboard (operator view)
 *  - public frontend filter (which slugs to hide from rankings)
 */
export async function listArchivedBrokers(env) {
  const rows = await env.DB.prepare(
    `SELECT broker_slug, archived_at, archived_reason, updated_at
     FROM broker_status WHERE status = 'archived'
     ORDER BY archived_at DESC`
  ).all();
  return rows.results || [];
}

/**
 * Quick lookup for a single broker. Returns 'active' by default if no row.
 */
export async function getBrokerStatus(env, slug) {
  assertSlug(slug);
  const row = await env.DB.prepare(
    `SELECT status, archived_at, archived_reason FROM broker_status WHERE broker_slug = ?`
  ).bind(slug).first();
  return row || { status: 'active', archived_at: null, archived_reason: null };
}
