/**
 * Link Health watchdog (S5.1).
 *
 * Builds on the existing daily link_checks (scheduled() handler in index.js).
 * After each daily check, this watchdog reads the recent history per broker
 * and escalates persistent failures into the `signals` table.
 *
 * Rules:
 *  - 5+ consecutive failed checks (no 'ok' in last 5 entries) → critical signal
 *  - When a successful check returns after a critical signal → auto-resolve
 *
 * This module is invoked from index.js scheduled() after the link check loop.
 */
import { createSignal, resolveOpenSignals } from './signals.js';

const CONSECUTIVE_FAIL_THRESHOLD = 5;
const CONSECUTIVE_FAIL_LOOKBACK = 7;  // pull last 7 to be safe if a day was skipped
// Codex S5 H2: hysteresis before auto-resolve. A single ok=1 flake must NOT
// close a still-ongoing critical signal — require N consecutive OKs.
const CONSECUTIVE_OK_FOR_RESOLVE = 3;

/**
 * Inspect link_checks history per broker; create or clear critical signals.
 *
 * @returns {Promise<{ created: number, resolved: number, brokers_checked: number }>}
 */
export async function runLinkHealthWatchdog(env) {
  const brokers = await env.DB.prepare('SELECT slug, affiliate_url FROM brokers').all();
  let created = 0;
  let resolved = 0;

  for (const b of brokers.results || []) {
    // Pull most-recent link_checks rows for this broker.
    const recent = await env.DB.prepare(
      `SELECT ok, status_code, error, checked_at FROM link_checks
       WHERE broker_slug = ? ORDER BY checked_at DESC LIMIT ?`
    ).bind(b.slug, CONSECUTIVE_FAIL_LOOKBACK).all();

    const rows = recent.results || [];
    if (rows.length === 0) continue;  // brand-new broker, no history yet

    // Count consecutive failures from the most recent entry backwards.
    let consecutiveFails = 0;
    for (const r of rows) {
      if (r.ok === 1 || r.ok === true) break;
      consecutiveFails++;
    }

    if (consecutiveFails >= CONSECUTIVE_FAIL_THRESHOLD) {
      const latest = rows[0];
      const res = await createSignal(env, {
        source: 'link_health',
        broker_slug: b.slug,
        severity: 'critical',
        message: `Affiliate URL down ${consecutiveFails} days in a row (last: HTTP ${latest.status_code || 'n/a'}${latest.error ? ', ' + String(latest.error).slice(0, 80) : ''})`,
        detail_json: { consecutive_fails: consecutiveFails, latest_status: latest.status_code, latest_error: latest.error, url: b.affiliate_url },
        source_url: b.affiliate_url,
      });
      if (res.created) created++;
    } else {
      // Count consecutive OKs from the most recent entry backwards (mirror of fail count).
      let consecutiveOks = 0;
      for (const r of rows) {
        if (r.ok === 1 || r.ok === true) consecutiveOks++;
        else break;
      }
      // Codex S5 H2: only auto-resolve after N consecutive OKs. A single OK
      // flake will NOT close a legitimate ongoing outage signal.
      if (consecutiveOks >= CONSECUTIVE_OK_FOR_RESOLVE) {
        const res = await resolveOpenSignals(env, {
          source: 'link_health',
          broker_slug: b.slug,
          severity: 'critical',
        });
        resolved += res.resolved_count;
      }
    }
  }

  return { created, resolved, brokers_checked: brokers.results?.length ?? 0 };
}
