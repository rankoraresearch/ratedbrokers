/**
 * News watchdog (S5.2).
 *
 * For each active broker, runs a small Claude API call with web_search asking
 * for regulatory actions / scandals / closures in the past 24h. Findings are
 * written as `signals` rows so the admin dashboard can surface them between
 * monthly refreshes.
 *
 * Cost: ~38 brokers × ~$0.20/call ≈ $7-10/month at default Sonnet 4.6.
 * Respects FRESHNESS_TEST_MODE — when set, stubs return no findings (zero cost).
 *
 * Output JSON contract Claude must produce:
 *   {"finding": true|false, "summary": "...", "source_url": "https://..."}
 * Anything else → no signal created.
 */
import Anthropic from '@anthropic-ai/sdk';
import { isTestMode, getDefaultModel } from '../agents/runner.js';
import { createSignal } from './signals.js';

const NEWS_PROMPT_SYSTEM =
`You are a news watchdog for an online-brokers review site. Your sole job is to
look for hard regulatory or operational news about a specific broker in the last
24 hours. You do NOT comment on marketing copy or routine price updates.

A finding qualifies as TRUE only if you see at least one of:
  • License revoked, suspended, withdrawn, or restricted by ANY regulator
  • Significant fine, sanction, enforcement action, court ruling
  • Broker shut down, ceased operations, filed bankruptcy
  • Major data breach, hack, customer fund loss
  • Mass layoffs / sudden leadership change tied to scandal

Routine product updates, marketing campaigns, sponsorships, partnership news,
revenue announcements — these are NOT findings.`;

const NEWS_USER_TEMPLATE = (broker) =>
`Has broker "${broker.name}" (slug: ${broker.slug}) had any qualifying news in the past 24 hours?

Use web_search to check Bloomberg, Reuters, FT, Finance Magnates, FX Empire,
and the broker's primary regulator press pages. Look for date stamps within
the last 24 hours.

Return ONLY this JSON block at the end of your reply:

\`\`\`json
{
  "finding": false,
  "summary": "Brief one-line summary if finding=true, empty otherwise",
  "source_url": "https://... canonical source URL if finding=true, empty otherwise",
  "severity": "warning"
}
\`\`\`

Severity rules: "critical" for license revoke/shutdown/major fraud; "warning"
for fines, lawsuits, smaller enforcement. Default to "warning" if uncertain.`;

const MAX_PROMPT_TOKENS = 2048;

function extractJsonBlock(text) {
  if (!text || typeof text !== 'string') return null;
  const safe = text.length > 32_000 ? text.slice(0, 32_000) : text;
  const m = safe.match(/```json\s*([\s\S]*?)\s*```/);
  const raw = m ? m[1].trim() : safe.trim();
  try { return JSON.parse(raw); } catch { return null; }
}

function finalText(response) {
  if (!Array.isArray(response?.content)) return '';
  return response.content.filter(b => b?.type === 'text').map(b => String(b.text || '')).join('\n');
}

/**
 * Scan one broker for news. Returns { finding, signal_id?, error? }.
 */
async function scanBroker(env, broker) {
  if (isTestMode(env)) {
    return { finding: false, stub: true };
  }
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const model = getDefaultModel(env);

  let response;
  try {
    response = await client.messages.create({
      model,
      max_tokens: MAX_PROMPT_TOKENS,
      system: NEWS_PROMPT_SYSTEM,
      messages: [{ role: 'user', content: NEWS_USER_TEMPLATE(broker) }],
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }],
    });
  } catch (err) {
    return { finding: false, error: `API call failed: ${String(err?.message || err).slice(0, 300)}` };
  }

  const text = finalText(response);
  const parsed = extractJsonBlock(text);
  if (parsed === null) {
    return { finding: false, error: `failed to parse JSON: ${text.slice(0, 200)}` };
  }
  if (parsed.finding !== true) {
    return { finding: false };
  }

  // Codex S5 M2: a finding must include BOTH a non-empty summary AND a valid
  // http/https source URL. Otherwise the signal would be unactionable noise.
  const summary = typeof parsed.summary === 'string' ? parsed.summary.trim().slice(0, 500) : '';
  const sourceUrl = typeof parsed.source_url === 'string' ? parsed.source_url.trim() : '';
  let safeUrl = null;
  try {
    if (sourceUrl) {
      const u = new URL(sourceUrl);
      if (u.protocol === 'http:' || u.protocol === 'https:') safeUrl = u.toString();
    }
  } catch { /* invalid URL — drop */ }

  if (!summary || !safeUrl) {
    return {
      finding: false,
      error: `LLM reported finding=true but missing required fields (summary=${summary ? 'ok' : 'empty'}, source_url=${safeUrl ? 'ok' : 'invalid/missing'}) — refusing to create unactionable signal`,
    };
  }

  const severity = parsed.severity === 'critical' ? 'critical' : 'warning';

  const sig = await createSignal(env, {
    source: 'news',
    broker_slug: broker.slug,
    severity,
    message: summary,
    detail_json: { broker: broker.name, raw_text: text.slice(0, 1000) },
    source_url: safeUrl,
  });
  return { finding: true, signal_id: sig.id, deduplicated: !sig.created };
}

/**
 * Scan ALL active brokers. Returns aggregate counts.
 *
 * @returns {Promise<{ scanned: number, findings: number, signals_created: number, errors: number, skipped_stub: boolean }>}
 */
export async function runNewsWatchdog(env) {
  const skipped_stub = isTestMode(env);
  const brokers = await env.DB.prepare(
    `SELECT b.slug, b.name FROM brokers b
     LEFT JOIN broker_status bs ON bs.broker_slug = b.slug
     WHERE bs.status IS NULL OR bs.status = 'active'`
  ).all();

  let findings = 0;
  let signals_created = 0;
  let errors = 0;

  for (const b of brokers.results || []) {
    const res = await scanBroker(env, b);
    if (res.error) { errors++; continue; }
    if (res.finding) {
      findings++;
      if (res.signal_id && !res.deduplicated) signals_created++;
    }
  }

  return {
    scanned: brokers.results?.length ?? 0,
    findings,
    signals_created,
    errors,
    skipped_stub,
  };
}
