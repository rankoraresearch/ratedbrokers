/**
 * Watchdog orchestrator (S5.4).
 *
 * Runs all three watchdogs sequentially with isolated error handling — one
 * failed watchdog must not block the others. Used by:
 *   - scheduled() in index.js (daily, after the existing link_check loop)
 *   - POST /api/admin/watchdogs/run-now (operator manual trigger)
 *
 * Returns a summary safe to render in admin UI logs.
 */
import { runLinkHealthWatchdog } from './link-health.js';
import { runNewsWatchdog } from './news.js';
import { runRegulatorWatchdog, loadRegulationsFromDb } from './regulator.js';

async function safeRun(name, fn) {
  const startMs = Date.now();
  try {
    const result = await fn();
    return { name, ok: true, elapsed_ms: Date.now() - startMs, ...result };
  } catch (err) {
    const msg = String(err?.message || err).slice(0, 500);
    console.error(`[watchdog:${name}] failed:`, msg);
    return { name, ok: false, elapsed_ms: Date.now() - startMs, error: msg };
  }
}

/**
 * Run all watchdogs. `flags` lets the caller skip specific ones (useful for
 * cron scheduling: link_health daily at 06:00, news at 08:00, regulator at 07:00).
 *
 * Default: all enabled.
 */
export async function runAllWatchdogs(env, flags = {}) {
  const enable = {
    link_health: flags.link_health !== false,
    news:        flags.news        !== false,
    regulator:   flags.regulator   !== false,
  };

  const results = [];

  if (enable.link_health) {
    results.push(await safeRun('link_health', () => runLinkHealthWatchdog(env)));
  }
  if (enable.news) {
    results.push(await safeRun('news', () => runNewsWatchdog(env)));
  }
  if (enable.regulator) {
    results.push(await safeRun('regulator', async () => {
      const regs = await loadRegulationsFromDb(env);
      return runRegulatorWatchdog(env, regs);
    }));
  }

  return {
    ran_at: new Date().toISOString(),
    results,
  };
}
