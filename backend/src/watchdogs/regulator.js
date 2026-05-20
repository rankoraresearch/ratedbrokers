/**
 * Regulator watchdog (S5.3).
 *
 * For each broker's regulations[] entry, verifies the license is still active
 * by querying the regulator's registry. MVP supports:
 *   - FCA Register (UK) — public JSON API at register.fca.org.uk
 *
 * Other regulators (ASIC, CFTC, NFA, SEC, CySEC, BaFin) are PLACEHOLDERS for
 * a follow-up sub-sprint. Each regulator has a unique URL/format so they're
 * added one-by-one.
 *
 * Reads broker regulations from MD frontmatter via a precomputed JSON column
 * in the brokers table. Since S6 hasn't added that column, this MVP relies on
 * a hard-coded fallback: regulations live in agent_findings.detail_json or
 * (future) brokers.regulations_json. For now we skip brokers whose regulations
 * we cannot enumerate from D1 alone — the next sprint will sync MD → D1.
 *
 * For S5 the loop is wired in but a no-op until S6.5 hands us per-broker
 * regulator data. The architecture is in place; the data plumbing follows.
 */
import { createSignal } from './signals.js';
import { archiveBroker } from '../agents/archive.js';

// Tier-1 regulator endpoints (extend as we wire each one).
const REGULATORS = {
  FCA: {
    name: 'FCA (UK)',
    // GET https://register.fca.org.uk/services/V0.1/Firm/{number}
    // Public JSON, no auth. Returns Data[0].Status: "Authorised" | "EEA Authorised" | "Cancelled" | etc.
    url: (licenceNumber) => `https://register.fca.org.uk/services/V0.1/Firm/${encodeURIComponent(licenceNumber)}`,
    parseStatus: (json) => {
      const row = Array.isArray(json?.Data) ? json.Data[0] : null;
      return row?.Status || null;
    },
    isHealthy: (status) => /^Authorised$/i.test(status || '') || /^EEA Authorised$/i.test(status || ''),
  },
  // ASIC, CFTC, NFA, SEC, CySEC, BaFin — TODO in next sub-sprint.
};

const FETCH_TIMEOUT_MS = 10_000;

/**
 * Check one (broker, regulator, licence-number) tuple.
 * Returns { ok, status, error }.
 */
async function checkLicence(regulator, licenceNumber) {
  const def = REGULATORS[regulator];
  if (!def) return { skipped: true, reason: `Regulator ${regulator} not yet implemented` };
  if (!licenceNumber) return { error: 'missing licence number' };

  const url = def.url(licenceNumber);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'ratedbrokers-watchdog/1.0', 'Accept': 'application/json' },
      signal: ctrl.signal,
    });
    if (!res.ok) return { error: `HTTP ${res.status}`, url };
    const json = await res.json().catch(() => null);
    if (!json) return { error: 'invalid JSON response', url };
    const status = def.parseStatus(json);
    if (!status) return { error: 'could not parse status', url };
    return { ok: def.isHealthy(status), status, url };
  } catch (err) {
    return { error: String(err?.message || err).slice(0, 200), url };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * S5 MVP: walks brokers + their regulations, validates each supported tuple.
 *
 * regulationsByBroker should be { slug: [{ name, number }, ...] }.
 * Source of this data is the next sub-sprint (S5.3.1: brokers.regulations_json).
 *
 * @returns {Promise<{ checked: number, ok_count: number, alerts: number, skipped: number, errors: number, unimplemented?: boolean, brokers_in_input?: number }>}
 *
 * Notes:
 *  - Returns `ok_count` (not `ok`) to avoid shadowing the wrapper's `ok: true`
 *    boolean produced by runner.safeRun when spreading the result.
 *  - Codex S5 M1: if input map is empty (e.g. loadRegulationsFromDb returned {})
 *    we MUST surface this as `unimplemented: true` rather than silently
 *    reporting "ok, 0 alerts" — otherwise operators may believe coverage exists
 *    when it doesn't.
 */
export async function runRegulatorWatchdog(env, regulationsByBroker) {
  const brokers_in_input = Object.keys(regulationsByBroker || {}).length;
  if (brokers_in_input === 0) {
    return {
      checked: 0, ok_count: 0, alerts: 0, skipped: 0, errors: 0,
      brokers_in_input: 0,
      unimplemented: true,
      message: 'No regulator data available (S5.3.1 TODO: sync MD regulations → D1). Watchdog is NOT monitoring anything.',
    };
  }

  let checked = 0, okCount = 0, alerts = 0, skipped = 0, errors = 0;

  for (const [slug, regs] of Object.entries(regulationsByBroker || {})) {
    if (!Array.isArray(regs)) continue;
    for (const r of regs) {
      const regulator = String(r?.name || '').toUpperCase();
      const number = r?.number;
      const result = await checkLicence(regulator, number);

      if (result.skipped) { skipped++; continue; }
      if (result.error)   { errors++; continue; }
      checked++;
      if (result.ok) {
        okCount++;
      } else {
        alerts++;
        await createSignal(env, {
          source: 'regulator',
          broker_slug: slug,
          severity: 'critical',
          message: `${regulator} licence ${number} status changed: "${result.status}" (no longer authorised)`,
          detail_json: { regulator, licence_number: number, status: result.status },
          source_url: result.url,
        });
        // S7: auto-archive when a Tier-1 regulator flips. Wrapped so an archive
        // failure does not abort the rest of the regulator loop.
        try {
          await archiveBroker(env, slug, 'license_revoked', `${regulator} status: ${result.status}`);
        } catch (err) {
          console.error(`[regulator] auto-archive failed for ${slug}:`, err?.message || err);
        }
      }
    }
  }

  return { checked, ok_count: okCount, alerts, skipped, errors, brokers_in_input };
}

/**
 * Placeholder data source for S5 MVP — until S6.5 syncs MD → D1, return empty.
 * When the brokers table grows a `regulations_json` column, replace this body
 * with a SELECT and JSON.parse.
 */
export async function loadRegulationsFromDb(_env) {
  // TODO(S5.3.1): SELECT slug, regulations_json FROM brokers WHERE regulations_json IS NOT NULL
  // For now: empty map — the watchdog will be a no-op until the column exists.
  return {};
}
