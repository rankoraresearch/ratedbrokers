/**
 * Freshness Pipeline — agent runners (S3).
 *
 * Wraps Джон/Боб/Лео prompts (sourced from /agents/*.md) into Claude API calls.
 * Each runner returns structured output + token usage + cost so the orchestrator
 * can persist findings/scores/audit trail into D1.
 *
 * Test mode: when env.FRESHNESS_TEST_MODE === '1' (explicit opt-in only), runners
 * return deterministic stubs instead of calling the API. This lets local dev,
 * smoke tests, and Codex review run without burning tokens. A missing API key in
 * production now fails loudly via getClient() — never silently falls back to stubs.
 *
 * Spec: FRESHNESS-PIPELINE-SPEC.md §2 (5-stage pipeline).
 */
import Anthropic from '@anthropic-ai/sdk';

// Bundled at build time via wrangler.toml `rules = [{type="Text", globs=["**/*.md"]}]`.
// Source files are the authoritative human-readable specs in /agents/.
import johnPromptMd from '../../../agents/john-data-collector.md';
import bobPromptMd  from '../../../agents/bob-fact-checker.md';
import leoPromptMd  from '../../../agents/leo-rating-calculator.md';

const DEFAULT_MODEL = 'claude-sonnet-4-6';

// Per-1M-token pricing in USD. Source: docs.anthropic.com/en/docs/about-claude/models.
// Update when Anthropic changes prices. Falls back to default model pricing if model is unknown.
const PRICING = {
  'claude-sonnet-4-6':         { input: 3,    output: 15 },
  'claude-opus-4-7':           { input: 15,   output: 75 },
  'claude-haiku-4-5-20251001': { input: 0.8,  output: 4  },
};

const MAX_OUTPUT_TOKENS = 4096;
const MAX_RAW_AUDIT_CHARS = 2000;

// ─── Public helpers ──────────────────────────────────────────────────────
export function getDefaultModel(env) {
  return env.FRESHNESS_MODEL || DEFAULT_MODEL;
}

// SAFETY: test mode requires an EXPLICIT opt-in. We do not infer it from a
// missing ANTHROPIC_API_KEY — that would let a production deploy with a
// forgotten secret silently emit deterministic fake findings (Codex S3 H1).
// Production with no key now fails loudly via getClient().
export function isTestMode(env) {
  return env.FRESHNESS_TEST_MODE === '1';
}

// ─── Internal: client + cost calc ────────────────────────────────────────
function getClient(env) {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY is missing. Set the secret via `wrangler secret put ANTHROPIC_API_KEY`, ' +
      'or set FRESHNESS_TEST_MODE=1 explicitly to use stub agents (local/dev only).'
    );
  }
  return new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
}

function calcCost(model, inputTokens, outputTokens) {
  const p = PRICING[model] || PRICING[DEFAULT_MODEL];
  return ((Number(inputTokens) || 0) * p.input + (Number(outputTokens) || 0) * p.output) / 1_000_000;
}

function usageFromResponse(model, response) {
  const u = response?.usage || {};
  const it = u.input_tokens ?? 0;
  const ot = u.output_tokens ?? 0;
  return { input_tokens: it, output_tokens: ot, cost_usd: calcCost(model, it, ot) };
}

// Extract first ```json ... ``` code-fenced block from text, fall back to whole text.
// Returns parsed object or null. Truncates input to 32k chars defensively.
function extractJsonBlock(text) {
  if (!text || typeof text !== 'string') return null;
  const safe = text.length > 32_000 ? text.slice(0, 32_000) : text;
  const m = safe.match(/```json\s*([\s\S]*?)\s*```/);
  const raw = m ? m[1].trim() : safe.trim();
  try { return JSON.parse(raw); } catch { return null; }
}

// Concatenate all `text` content blocks from a Claude response.
function finalText(response) {
  if (!Array.isArray(response?.content)) return '';
  return response.content.filter(b => b?.type === 'text').map(b => String(b.text || '')).join('\n');
}

// Reject URLs that aren't http/https BEFORE persisting to D1 (Codex S3 M1).
// Mirrors safeHttpUrl() in routes/freshness.js — keeping ingestion in lock-step
// with the render-side guard so a future caller cannot bypass the allowlist.
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

// Sanitise a single finding object into the shape we persist.
function normaliseFinding(f) {
  if (!f || typeof f !== 'object' || !f.field || f.new_value === undefined || f.new_value === null) {
    return null;
  }
  return {
    field: String(f.field).slice(0, 100),
    old_value: f.old_value === undefined || f.old_value === null ? null : String(f.old_value).slice(0, 1000),
    new_value: String(f.new_value).slice(0, 1000),
    source_url: safeHttpUrlForDb(f.source_url),  // null if scheme not http/https
  };
}

// ─── Stage 1: John (COLLECT) ─────────────────────────────────────────────
const JOHN_USER_TEMPLATE = (broker) =>
`Update broker: ${broker.slug}
Name: ${broker.name}
Affiliate URL (do not modify): ${broker.affiliate_url}

Use web_search to research what has changed for this broker since the last update.
Focus ONLY on these "live" fields (per FRESHNESS-PIPELINE-SPEC.md §3 row 1):
spread, avg_spread, commission, min_deposit, leverage, instruments, platforms,
regulations, payment_methods, tp, tp_count, status.

Do NOT touch: founders, history, headquarters, story body — those are out of scope.

After research, output exactly one JSON code block at the end of your reply:

\`\`\`json
{
  "findings": [
    { "field": "spread", "old_value": "0.1", "new_value": "0.0", "source_url": "https://..." }
  ],
  "no_changes": ["regulations", "platforms"],
  "could_not_verify": [],
  "is_critical": false
}
\`\`\`

Rules:
- Only emit a finding when you have a real source_url (http or https). No fabrications.
- Set "is_critical": true if you discover the broker shut down OR a Tier-1 license was revoked.
- If no changes detected for any field, return findings: [].`;

export async function runJohn(env, broker) {
  if (isTestMode(env)) return runJohnStub(broker);

  const client = getClient(env);
  const model = getDefaultModel(env);

  const response = await client.messages.create({
    model,
    max_tokens: MAX_OUTPUT_TOKENS,
    system: johnPromptMd,
    messages: [{ role: 'user', content: JOHN_USER_TEMPLATE(broker) }],
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
  });

  const text = finalText(response);
  const parsed = extractJsonBlock(text);

  // Codex S3 H2: malformed/missing JSON must surface as a failure, not a silent no-op.
  // (parsed === null) means extractJsonBlock could not parse anything — either the model
  // returned no JSON block, returned multiple bad blocks, or returned malformed JSON.
  if (parsed === null) {
    throw new Error(`John: failed to parse JSON output. First 300 chars: ${text.slice(0, 300)}`);
  }

  const findingsRaw = Array.isArray(parsed.findings) ? parsed.findings : [];
  const findings = findingsRaw.map(normaliseFinding).filter(Boolean);

  return {
    findings,
    is_critical: parsed.is_critical === true,
    usage: usageFromResponse(model, response),
    raw_text: text.slice(0, MAX_RAW_AUDIT_CHARS),
  };
}

// ─── Stage 2: Bob (VERIFY) ───────────────────────────────────────────────
const BOB_USER_TEMPLATE = (broker, findings) =>
`Verify these proposed changes to broker "${broker.slug}" (${broker.name}).
Each item was scraped by Джон. Cross-check against a SECOND independent source
(regulator registry, official broker page, Trustpilot — different domain than
the original source where possible).

Findings to verify:
${JSON.stringify(findings.map(f => ({ id: f.id, field: f.field, new_value: f.new_value, source_url: f.source_url })), null, 2)}

Output exactly one JSON code block:

\`\`\`json
{
  "verified": [
    { "id": 123, "verified_source_url": "https://second-source.example/..." }
  ],
  "rejected": [
    { "id": 124, "reason": "Could not corroborate via FCA Register" }
  ]
}
\`\`\`

Rules:
- Only mark "verified" when a SECOND source corroborates the new_value.
- Use http or https URLs only. No fabrications.
- "rejected" items will be flagged in the approval UI for manual decision.`;

export async function runBob(env, broker, findings) {
  if (!Array.isArray(findings) || findings.length === 0) {
    // Nothing to verify — Stage 2 is a no-op for this broker.
    return { verified: [], rejected: [], usage: { input_tokens: 0, output_tokens: 0, cost_usd: 0 }, raw_text: '' };
  }
  if (isTestMode(env)) return runBobStub(broker, findings);

  const client = getClient(env);
  const model = getDefaultModel(env);

  const response = await client.messages.create({
    model,
    max_tokens: MAX_OUTPUT_TOKENS,
    system: bobPromptMd,
    messages: [{ role: 'user', content: BOB_USER_TEMPLATE(broker, findings) }],
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
  });

  const text = finalText(response);
  const parsed = extractJsonBlock(text);

  // Codex S3 H2: malformed/missing JSON must surface as a failure.
  if (parsed === null) {
    throw new Error(`Bob: failed to parse JSON output. First 300 chars: ${text.slice(0, 300)}`);
  }

  const findingIds = new Set(findings.map(f => f.id));

  const verified = (Array.isArray(parsed.verified) ? parsed.verified : [])
    .filter(v => v && Number.isInteger(v.id) && findingIds.has(v.id))
    .map(v => ({
      id: v.id,
      // Codex S3 M1: scheme allowlist on Bob's verification URL — same guard as John's source_url.
      verified_source_url: safeHttpUrlForDb(v.verified_source_url),
    }));

  const rejected = (Array.isArray(parsed.rejected) ? parsed.rejected : [])
    .filter(r => r && Number.isInteger(r.id) && findingIds.has(r.id))
    .map(r => ({
      id: r.id,
      reason: r.reason ? String(r.reason).slice(0, 500) : 'unspecified',
    }));

  return { verified, rejected, usage: usageFromResponse(model, response), raw_text: text.slice(0, MAX_RAW_AUDIT_CHARS) };
}

// ─── Stage 3: Leo (SCORE) ────────────────────────────────────────────────
const LEO_USER_TEMPLATE = (broker, currentScore, currentBreakdown, verifiedFindings) =>
`Recalculate the trust score for broker "${broker.slug}" (${broker.name}).

Current score: ${currentScore ?? 'unknown'}
Current breakdown (if known): ${JSON.stringify(currentBreakdown || null)}

Verified findings from Bob (only these are valid inputs):
${JSON.stringify(verifiedFindings, null, 2)}

Apply the methodology in your system prompt (6 weighted criteria, knockout rules).
Output exactly one JSON code block:

\`\`\`json
{
  "score_new": 9.7,
  "score_old": 9.6,
  "delta": 0.1,
  "breakdown": {
    "regulation": 9.6,
    "costs": 8.8,
    "trustpilot": 9.7,
    "expert": 9.7,
    "platform": 9.5,
    "execution": 9.8
  },
  "rationale": "Trustpilot rose from 4.7 to 4.8 (+0.1)."
}
\`\`\`

Rules:
- Round score_new to 1 decimal.
- If verifiedFindings is empty, return delta = 0 and score_new = score_old.
- Do not fabricate metrics. Use only the verified findings + your methodology.`;

export async function runLeo(env, broker, verifiedFindings, currentScore, currentBreakdown) {
  if (isTestMode(env)) return runLeoStub(broker, verifiedFindings, currentScore);

  const client = getClient(env);
  const model = getDefaultModel(env);

  const response = await client.messages.create({
    model,
    max_tokens: MAX_OUTPUT_TOKENS,
    system: leoPromptMd,
    messages: [{ role: 'user', content: LEO_USER_TEMPLATE(broker, currentScore, currentBreakdown, verifiedFindings) }],
    // No web_search — Leo works only with verified inputs and methodology.
  });

  const text = finalText(response);
  const parsed = extractJsonBlock(text);

  // Codex S3 H2: malformed/missing JSON must surface as a failure.
  if (parsed === null) {
    throw new Error(`Leo: failed to parse JSON output. First 300 chars: ${text.slice(0, 300)}`);
  }

  const scoreOld = typeof parsed.score_old === 'number' ? parsed.score_old : (typeof currentScore === 'number' ? currentScore : null);
  const scoreNew = typeof parsed.score_new === 'number' ? Math.round(parsed.score_new * 10) / 10 : scoreOld;
  const delta = (scoreNew !== null && scoreOld !== null) ? Math.round((scoreNew - scoreOld) * 100) / 100 : 0;

  return {
    score_old: scoreOld,
    score_new: scoreNew,
    delta,
    breakdown: parsed.breakdown && typeof parsed.breakdown === 'object' ? parsed.breakdown : null,
    rationale: typeof parsed.rationale === 'string' ? parsed.rationale.slice(0, 1000) : '',
    usage: usageFromResponse(model, response),
    raw_text: text.slice(0, MAX_RAW_AUDIT_CHARS),
  };
}

// ─── Deterministic stubs (test mode) ─────────────────────────────────────
// Used when ANTHROPIC_API_KEY is empty or FRESHNESS_TEST_MODE=1. They reproduce
// the same data shape as the real runners so the orchestrator and tests do not
// branch on test/prod paths.

function hashSeed(slug, salt = 0) {
  let h = (salt | 0) || 1;
  for (let i = 0; i < slug.length; i++) h = ((h * 33) + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function runJohnStub(broker) {
  const seed = hashSeed(broker.slug, 1);
  const seedPct = seed % 100;
  if (seedPct < 30) {
    return { findings: [], is_critical: false, usage: { input_tokens: 0, output_tokens: 0, cost_usd: 0 }, raw_text: '[STUB] no changes' };
  }
  const pool = [
    { field: 'spread',      old_value: '0.1',  new_value: '0.0',  source_url: `https://${broker.slug}.com/forex-spreads` },
    { field: 'min_deposit', old_value: '200',  new_value: '100',  source_url: `https://${broker.slug}.com/account-types` },
    { field: 'leverage',    old_value: '1:500', new_value: '1:1000', source_url: `https://${broker.slug}.com/leverage` },
    { field: 'commission',  old_value: '$3.50/lot', new_value: '$3.00/lot', source_url: `https://${broker.slug}.com/pricing` },
    { field: 'tp',          old_value: '4.7',  new_value: '4.8',  source_url: `https://www.trustpilot.com/review/${broker.slug}.com` },
    { field: 'instruments', old_value: '2,250+', new_value: '2,400+', source_url: `https://${broker.slug}.com/markets` },
  ];
  const count = (hashSeed(broker.slug, 100) % 3) + 1;
  const picks = [];
  for (let i = 0; i < count; i++) {
    const c = pool[hashSeed(broker.slug, 200 + i) % pool.length];
    if (!picks.find(p => p.field === c.field)) picks.push(c);
  }
  return { findings: picks, is_critical: false, usage: { input_tokens: 0, output_tokens: 0, cost_usd: 0 }, raw_text: '[STUB] mock findings' };
}

function runBobStub(_broker, findings) {
  // Stub: verify all findings (real Bob would cross-check against second source).
  const verified = findings.map(f => ({ id: f.id, verified_source_url: `https://verified.example/${f.field}` }));
  return { verified, rejected: [], usage: { input_tokens: 0, output_tokens: 0, cost_usd: 0 }, raw_text: '[STUB] auto-verified' };
}

function runLeoStub(broker, verifiedFindings, currentScore) {
  if (!verifiedFindings || verifiedFindings.length === 0) {
    const score = typeof currentScore === 'number' ? currentScore : null;
    return {
      score_old: score, score_new: score, delta: 0, breakdown: null,
      rationale: '[STUB] no verified findings, score unchanged',
      usage: { input_tokens: 0, output_tokens: 0, cost_usd: 0 }, raw_text: '[STUB]',
    };
  }
  const seed = hashSeed(broker.slug, 500) % 100;
  let raw;
  if (seed < 70)      raw = (seed % 20) - 10;
  else if (seed < 90) raw = (seed % 40) - 20;
  else                raw = (seed % 60) - 30;
  const delta = Math.round(raw) / 100;
  const oldScore = typeof currentScore === 'number' ? currentScore : 8.0 + ((broker.slug.charCodeAt(0) % 20) / 10);
  const newScore = Math.round((oldScore + delta) * 10) / 10;
  return {
    score_old: oldScore,
    score_new: newScore,
    delta: Math.round(delta * 100) / 100,
    breakdown: { regulation: 9.5, costs: 8.8, trustpilot: 9.5, expert: 9.0, platform: 9.2, execution: 9.3 },
    rationale: '[STUB] deterministic delta based on slug hash',
    usage: { input_tokens: 0, output_tokens: 0, cost_usd: 0 },
    raw_text: '[STUB]',
  };
}
