/**
 * MD writer — applies approved Freshness Pipeline findings to broker MD files.
 *
 * Spec: FRESHNESS-PIPELINE-SPEC.md §8.
 * Flow (called from handleApproveRun in routes/freshness.js):
 *   1. Pull approved findings grouped by broker_slug.
 *   2. For each broker: GET content/brokers/{slug}.md from GitHub.
 *   3. Parse YAML frontmatter, apply finding values, update last_verified.
 *   4. Stage the new MD content for batched commit via github-client.commitFiles.
 *
 * S6 scope:
 *   - Top-level scalar fields (spread, min_deposit, leverage, ...).
 *   - Top-level array-of-strings (platforms, payment_methods).
 *   - Nested complex shapes (regulations[i].number) — DEFERRED. Findings with
 *     dot-notation field names are reported back as `skipped_fields` so the UI
 *     surfaces what didn't make it into the commit.
 *
 * Safety:
 *   - Only fields listed in WRITABLE_FIELDS are ever updated. Anything else is
 *     refused (defense in depth — Лео-prompted JSON shouldn't sneak `body` in).
 *   - We don't touch the markdown body, only the YAML frontmatter block between
 *     the first two `---` lines.
 */
import yaml from 'js-yaml';
import { getFileContent, commitFiles, isGitDryRun, assertSafePathSegment } from './github-client.js';

// SECURITY (Codex S6 H3): broker_slug must match strict allowlist before being
// interpolated into any GitHub path or commit message. Even though slugs come
// from our brokers table, we re-validate here so a corrupted/poisoned DB row
// cannot escalate into arbitrary file write or commit-message injection.
const SAFE_SLUG_RE = /^[a-z0-9][a-z0-9-]{0,99}$/;

function assertSafeBrokerSlug(slug) {
  if (typeof slug !== 'string' || !SAFE_SLUG_RE.test(slug)) {
    throw new Error(`Invalid broker_slug (must match ^[a-z0-9][a-z0-9-]{0,99}$): ${String(slug).slice(0, 60)}`);
  }
}

// Whitelist of MD frontmatter fields that the pipeline is allowed to mutate.
// This is the same "live data" set agreed in spec §3 row 1 — keep them in lock-step.
export const WRITABLE_FIELDS = new Set([
  'spread', 'avg_spread', 'commission', 'min_deposit', 'leverage',
  'instruments', 'platforms', 'payment_methods', 'tp', 'tp_count',
  'status', 'verdict',  // verdict is updated by Leo when score crosses tier boundary
  'score',              // score is the headline number (Leo recalculates)
]);

const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
const ISO_DATE = () => new Date().toISOString().slice(0, 10);

// Coerce a string value from agent_findings into the right JS type for YAML.
// Numbers: "200" → 200 ; floats: "0.0" → 0.0 ; booleans rare in our schema.
// Arrays: comma-separated → [a, b, c]. Strings stay strings.
function coerceForYaml(field, raw) {
  if (raw === null || raw === undefined) return null;
  const str = String(raw).trim();

  // Array fields — accept JSON array literal or comma-separated.
  if (field === 'platforms' || field === 'payment_methods') {
    if (str.startsWith('[')) {
      try { const parsed = JSON.parse(str); if (Array.isArray(parsed)) return parsed.map(String); } catch {}
    }
    return str.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Numeric scalars — keep as number if it parses cleanly.
  if (field === 'min_deposit' || field === 'tp_count' || field === 'instruments' ||
      field === 'tp' || field === 'score') {
    const n = Number(str.replace(/[, ]/g, ''));
    if (!Number.isNaN(n) && /^[\d.-]/.test(str)) return n;
  }

  // Default: leave as string (spread "0.0", leverage "1:500", etc — all string-typed in our MD).
  return str;
}

// Parse an MD file into { frontmatter (object), body (string) }.
// Returns null if the file doesn't start with `---` frontmatter.
export function parseMd(mdContent) {
  if (typeof mdContent !== 'string') return null;
  const m = mdContent.match(FRONTMATTER_RE);
  if (!m) return null;
  let fm;
  try {
    fm = yaml.load(m[1]);
  } catch (err) {
    throw new Error(`YAML parse error: ${err.message}`);
  }
  if (!fm || typeof fm !== 'object' || Array.isArray(fm)) {
    throw new Error('Frontmatter must be a YAML object');
  }
  return { frontmatter: fm, body: m[2] };
}

// Serialize { frontmatter, body } back into a string.
// Uses js-yaml dump with stable key order (no sort) + double-quoted strings to
// minimise diff noise.
export function serialiseMd({ frontmatter, body }) {
  const yamlText = yaml.dump(frontmatter, {
    indent: 2,
    lineWidth: 200,
    noRefs: true,
    sortKeys: false,
  });
  // js-yaml's dump always ends with \n; we want exactly one trailing newline before `---`.
  const fmBlock = yamlText.replace(/\n+$/, '\n');
  return `---\n${fmBlock}---\n${body}`;
}

// Apply approved findings to a single broker MD.
// findings: Array<{ field, new_value }> already-filtered to approved + verified.
// Returns { content, applied: [...], skipped: [...] }.
export function applyFindingsToMd(mdContent, findings) {
  const parsed = parseMd(mdContent);
  if (!parsed) throw new Error('Broker MD has no YAML frontmatter');

  const applied = [];
  const skipped = [];

  for (const f of findings) {
    if (!f || typeof f.field !== 'string') {
      skipped.push({ field: f?.field, reason: 'invalid finding shape' });
      continue;
    }
    // Reject nested/dot-notation for now (spec §8 — deferred).
    if (f.field.includes('.') || f.field.includes('[')) {
      skipped.push({ field: f.field, reason: 'nested field unsupported in S6' });
      continue;
    }
    if (!WRITABLE_FIELDS.has(f.field)) {
      skipped.push({ field: f.field, reason: 'not in WRITABLE_FIELDS allowlist' });
      continue;
    }
    const coerced = coerceForYaml(f.field, f.new_value);
    parsed.frontmatter[f.field] = coerced;
    applied.push({ field: f.field, new_value: coerced });
  }

  // Always bump last_verified to today when we make ANY change.
  if (applied.length > 0) {
    parsed.frontmatter.last_verified = ISO_DATE();
  }

  return { content: serialiseMd(parsed), applied, skipped };
}

// ─── High-level: prepare + commit ───────────────────────────────────────
//
// findingsByBroker: { [slug]: Array<{ field, new_value }> }
// scoreByBroker:    { [slug]: { score_new, score_old, delta } }  (optional, from Leo)
// runId:            pipeline_runs.id (for commit message)
//
// Returns { commit_sha, branch, file_count, summary } on success.
// Returns { dry_run: true, summary } if isGitDryRun(env) is true.
//
// FAIL-FAST POLICY (Codex S6 H2): ANY per-broker error aborts the whole batch
// before touching GitHub. We never produce a partial publish — either every
// approved broker lands in the commit, or no commit is made and the caller
// rolls back the run state.
export async function applyAndCommit(env, findingsByBroker, scoreByBroker, runId) {
  const summary = { brokers: 0, files: 0, applied: 0, skipped: 0, errors: [] };
  const dryRun = isGitDryRun(env);
  const files = [];

  // Validate ALL slugs upfront so dry-run and prod paths take the same gate.
  for (const slug of Object.keys(findingsByBroker || {})) {
    assertSafeBrokerSlug(slug);
  }

  for (const [slug, findings] of Object.entries(findingsByBroker || {})) {
    if (!findings || findings.length === 0) continue;
    const path = `content/brokers/${slug}.md`;
    // Extra defense-in-depth: each path segment validated against
    // ^[a-zA-Z0-9._-]+$ (github-client also validates, but we double-check here).
    for (const seg of path.split('/')) assertSafePathSegment(seg, 'broker path segment');

    if (dryRun) {
      summary.brokers += 1;
      summary.applied += findings.length;
      continue;
    }

    let current;
    try {
      current = await getFileContent(env, path);
    } catch (err) {
      // FAIL-FAST: surface a clear error and abort the batch.
      throw new Error(`Fetch failed for ${slug}: ${String(err?.message || err).slice(0, 300)}`);
    }
    if (!current) {
      throw new Error(`Fetch failed for ${slug}: MD not found at ${path}`);
    }

    let result;
    try {
      result = applyFindingsToMd(current.content, findings);
    } catch (err) {
      throw new Error(`Apply failed for ${slug}: ${String(err?.message || err).slice(0, 300)}`);
    }

    // If Leo also produced a score change for this broker, fold it in.
    if (scoreByBroker && scoreByBroker[slug] && typeof scoreByBroker[slug].score_new === 'number') {
      const parsed = parseMd(result.content);
      if (parsed) {
        parsed.frontmatter.score = scoreByBroker[slug].score_new;
        if (scoreByBroker[slug].verdict) parsed.frontmatter.verdict = scoreByBroker[slug].verdict;
        result.content = serialiseMd(parsed);
        result.applied.push({ field: 'score', new_value: scoreByBroker[slug].score_new });
      }
    }

    files.push({ path, content: result.content });
    summary.brokers += 1;
    summary.applied += result.applied.length;
    summary.skipped += result.skipped.length;
  }

  if (files.length === 0 && summary.brokers === 0) {
    return { dry_run: dryRun, commit_sha: null, branch: null, file_count: 0, committed_slugs: [], summary };
  }

  if (dryRun) {
    return {
      dry_run: true,
      commit_sha: null,
      branch: env.GITHUB_BRANCH || 'main',
      file_count: summary.brokers,
      committed_slugs: Object.keys(findingsByBroker || {}).filter(s => (findingsByBroker[s] || []).length > 0),
      summary,
    };
  }

  // Commit message — slug list is sanitised (each slug is SAFE_SLUG_RE, so
  // no newlines or trailer-injection vectors).
  const month = new Date().toISOString().slice(0, 7);  // YYYY-MM
  const slugList = files.map(f => f.path.replace(/^content\/brokers\//, '').replace(/\.md$/, ''));
  const message =
    `refresh: monthly ${month} (${files.length} broker${files.length === 1 ? '' : 's'} updated)\n\n` +
    `Changes via Freshness Pipeline run #${runId}.\n` +
    `Brokers: ${slugList.join(', ')}\n\n` +
    `Co-Authored-By: Джон <john@ratedbrokers.local>\n` +
    `Co-Authored-By: Боб <bob@ratedbrokers.local>\n` +
    `Co-Authored-By: Лео <leo@ratedbrokers.local>\n`;

  const result = await commitFiles(env, files, message);
  return { dry_run: false, ...result, committed_slugs: slugList, summary };
}
