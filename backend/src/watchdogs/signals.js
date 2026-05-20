/**
 * Shared signals helper for Freshness Pipeline watchdogs (S5).
 *
 * S8 wiring: critical signals that are NEWLY created (not deduped) trigger a
 * notifyCriticalSignal() email. Dedup logic in createSignal ensures we send
 * at most one alert per active condition.
 *
 * All three watchdogs (link-health, news, regulator) produce events that land
 * in the `signals` D1 table (created in migration 004). The admin dashboard
 * reads from `signals WHERE resolved=0` to show active alerts.
 *
 * Dedup invariant: a watchdog should NEVER spam the dashboard with repeated
 * "Plus500 license suspended" entries on consecutive ticks. Use createSignal()
 * which checks for an open signal of the same (source, broker_slug, severity)
 * within DEDUP_WINDOW_HOURS and skips if found.
 *
 * Sources used: 'link_health' | 'news' | 'regulator' | 'manual'
 * Severities:   'info' | 'warning' | 'critical'
 */

// Dedup is now status-based (open signal blocks a new one of the same tuple),
// NOT time-windowed. Codex S5 H1: previously we used a 24h SELECT-then-INSERT
// which (a) raced under concurrent runs and (b) allowed a duplicate to slip
// through once the original aged past the window. The new INSERT ... WHERE NOT
// EXISTS pattern is atomic and only ever produces ONE open signal per
// (source, broker_slug, severity) tuple — a real human resolve is required
// before a new alert of the same kind can fire.

function nowIso() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function isValidSeverity(s) {
  return s === 'info' || s === 'warning' || s === 'critical';
}

function isValidSource(s) {
  return s === 'link_health' || s === 'news' || s === 'regulator' || s === 'manual';
}

// URL allowlist (same allowlist as routes/freshness.js safeHttpUrl) — agent-supplied
// URLs can have weird schemes; we reject anything not http/https before persisting.
function safeHttpUrlForDb(raw) {
  if (!raw) return null;
  try {
    const u = new URL(String(raw));
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.toString().slice(0, 500);
  } catch {
    return null;
  }
}

/**
 * Create a signal — atomic dedup against open signals of the same
 * (source, broker_slug, severity) tuple. No time window: a new alert only
 * fires after the previous one is resolved (manually or auto).
 *
 * Race-safe: uses INSERT ... SELECT WHERE NOT EXISTS so two concurrent runs
 * cannot both insert.
 *
 * @returns {Promise<{ created: boolean, id?: number, reason?: string }>}
 */
export async function createSignal(env, { source, broker_slug, severity, message, detail_json, source_url }) {
  if (!isValidSource(source))     throw new Error(`Invalid source: ${source}`);
  if (!isValidSeverity(severity)) throw new Error(`Invalid severity: ${severity}`);
  if (typeof message !== 'string' || !message.trim()) throw new Error('message is required');

  const slug = broker_slug || null;
  const safeUrl = safeHttpUrlForDb(source_url);
  const safeDetail = detail_json
    ? (typeof detail_json === 'string' ? detail_json.slice(0, 4000) : JSON.stringify(detail_json).slice(0, 4000))
    : null;
  const safeMsg = message.slice(0, 1000);
  const now = nowIso();

  // Atomic insert: only writes a row if no open signal of the same tuple
  // already exists. D1/SQLite uses NULL semantics for broker_slug — handled
  // via two query variants because IS NULL vs = ? differ.
  let result;
  if (slug) {
    result = await env.DB.prepare(
      `INSERT INTO signals (source, broker_slug, severity, message, detail_json, source_url, created_at)
       SELECT ?, ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM signals
         WHERE source = ? AND broker_slug = ? AND severity = ? AND resolved = 0
       )`
    ).bind(source, slug, severity, safeMsg, safeDetail, safeUrl, now,
            source, slug, severity).run();
  } else {
    result = await env.DB.prepare(
      `INSERT INTO signals (source, broker_slug, severity, message, detail_json, source_url, created_at)
       SELECT ?, NULL, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM signals
         WHERE source = ? AND broker_slug IS NULL AND severity = ? AND resolved = 0
       )`
    ).bind(source, severity, safeMsg, safeDetail, safeUrl, now,
            source, severity).run();
  }

  if ((result.meta?.changes ?? 0) === 0) {
    return { created: false, reason: 'open signal already exists for this (source, broker_slug, severity)' };
  }

  const newId = result.meta?.last_row_id;

  // S8: fire-and-forget critical email. Wrapped in try/catch so a mail
  // failure never blocks signal creation. Lazy-imported to avoid cycle:
  // notifications/email.js → no deps on signals.js.
  if (severity === 'critical') {
    try {
      const { notifyCriticalSignal } = await import('../notifications/email.js');
      await notifyCriticalSignal(env, {
        id: newId,
        source,
        broker_slug: slug,
        severity,
        message: safeMsg,
        source_url: safeUrl,
      });
    } catch (err) {
      console.error('[signals] critical email notify failed:', err?.message || err);
    }
  }

  return { created: true, id: newId };
}

/**
 * Auto-resolve open signals when the underlying condition has cleared.
 * Used by link-health when consecutive failures end and health is restored.
 */
export async function resolveOpenSignals(env, { source, broker_slug, severity }) {
  if (!isValidSource(source)) throw new Error(`Invalid source: ${source}`);
  const conditions = ['source = ?', 'resolved = 0'];
  const binds = [source];
  if (broker_slug) { conditions.push('broker_slug = ?'); binds.push(broker_slug); }
  else             { conditions.push('broker_slug IS NULL'); }
  if (severity)    { conditions.push('severity = ?'); binds.push(severity); }

  const r = await env.DB.prepare(
    `UPDATE signals SET resolved = 1, resolved_at = ?, resolved_by = 'auto-watchdog'
     WHERE ${conditions.join(' AND ')}`
  ).bind(nowIso(), ...binds).run();
  return { resolved_count: r.meta?.changes ?? 0 };
}
