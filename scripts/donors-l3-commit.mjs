// scripts/donors-l3-commit.mjs
// Commit L3 staging results (/tmp/l3-results.json) to D1.
// ONLY run after codex audit confirms 10/10 on random sample.
//
// Usage:
//   ADMIN_API_KEY=... node scripts/donors-l3-commit.mjs              # dry-run, prints what would change
//   ADMIN_API_KEY=... node scripts/donors-l3-commit.mjs --apply      # actual PUT to D1
import fs from 'fs';

try {
  const env = fs.readFileSync('.env', 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const API = process.env.API_BASE || 'https://api.ratedbrokers.com';
const KEY = process.env.ADMIN_API_KEY;
if (!KEY) { console.error('ADMIN_API_KEY missing'); process.exit(1); }

const APPLY = process.argv.includes('--apply');
const STAGING = '/tmp/l3-results.json';

async function updateDonor(domain, data) {
  const res = await fetch(`${API}/api/admin/donors/${encodeURIComponent(domain)}`, {
    method: 'PUT', headers: { 'x-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${domain} → ${res.status}: ${await res.text().catch(() => '')}`);
}

function makePayload(row) {
  const payload = {
    status: 'found',
    source_method: 'llm_codex',
    checked_at: row.ts,
  };
  if (row.best_pick) {
    payload.email = row.best_pick;
    payload.primary_email = row.best_pick;
    payload.source_snippet = (row.quote || row.best_pick_reason || '').slice(0, 500);
    payload.notes = `L3 LLM: ${row.best_pick_reason || ''} [tier=${row.tier_label || '?'}, verified=${row.verification}]`.slice(0, 500);
    // find the source URL where email was actually found (first successful attempt)
    const srcAttempt = (row.attempts || []).find(a => a.result === 'fetched');
    if (srcAttempt) {
      payload.source_url = srcAttempt.url;
      payload.contact_page_url = srcAttempt.url;
    }
  }
  if (row.contact_form_url) {
    payload.contact_form_url = row.contact_form_url;
  }
  return payload;
}

async function main() {
  const staging = JSON.parse(fs.readFileSync(STAGING, 'utf8'));
  const toCommit = staging.filter(r =>
    r.status === 'found' && (r.best_pick || r.contact_form_url)
  );

  console.log(`[commit] staging=${staging.length}, to_commit=${toCommit.length}${APPLY ? ' — APPLYING' : ' — DRY RUN'}`);
  console.log();

  const stats = { applied: 0, errors: 0, with_email: 0, form_only: 0 };

  for (const row of toCommit) {
    const payload = makePayload(row);
    if (row.best_pick) stats.with_email++; else stats.form_only++;

    console.log(`  ${row.domain.padEnd(30)} ${(row.best_pick || '(form)').padEnd(35)} ${row.tier_label || '?'}`);

    if (APPLY) {
      try {
        await updateDonor(row.domain, payload);
        stats.applied++;
      } catch (e) {
        stats.errors++;
        console.log(`    ERR: ${e.message}`);
      }
    }
  }

  console.log();
  console.log(`[commit] ${APPLY ? 'applied' : 'would apply'}: ${toCommit.length}`);
  console.log(`  with email: ${stats.with_email}`);
  console.log(`  form only : ${stats.form_only}`);
  if (APPLY) {
    console.log(`  applied   : ${stats.applied}`);
    console.log(`  errors    : ${stats.errors}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
