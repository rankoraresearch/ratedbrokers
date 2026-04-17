// scripts/donors-l3-audit.mjs
// Pull N random found-rows from L3 staging and run codex audit.
// Usage:
//   node scripts/donors-l3-audit.mjs [N]     # default N=10
import fs from 'fs';
import { spawn } from 'child_process';

const N = parseInt(process.argv[2] || '10');
const STAGING = '/tmp/l3-results.json';

const staging = JSON.parse(fs.readFileSync(STAGING, 'utf8'));
const found = staging.filter(r => r.status === 'found' && r.best_pick);
console.log(`[audit] staging has ${staging.length} rows, ${found.length} with email, sampling ${N} random`);

if (found.length < N) {
  console.log(`[audit] not enough found rows (${found.length}) for audit of ${N}. Exiting.`);
  process.exit(0);
}

const sample = [...found].sort(() => Math.random() - 0.5).slice(0, N);

// Build codex audit prompt
let prompt = `# Task: Audit ${N} random L3-extracted donor emails

RatedBrokers outreach database. Each row below is an email extracted by an LLM pipeline from a live donor website HTML. Verify:

1. Is the email a credible outreach target?
2. Does the quote from HTML support the pick (not hallucination)?
3. Is it on-domain (or justified exception)?

Valid outreach types: guest posts, press releases, editorial pitches, partnerships, expert quotes.

## Ladder (pick highest-tier)
- guest (100): guestposts@, contribute@, submissions@
- general (30): info@, contact@, hello@, team@, office@, biuro@
- editor (80): editor@, editorial@, press@, pr@, newsroom@
- partnerships (50): partnerships@, business@, bd@

## HARD REJECT
support/help/sales/ads/jobs/careers/reservas/billing/legal/admin/corrections/letters/feedback/noreply/webmaster + foreign_domain + gmail/yahoo/outlook as primary.

## For each row
Rate: OK / SUBOPTIMAL / WRONG — 1-line reason.
End with: Precision X/${N}.

## Rows

`;

sample.forEach((r, i) => {
  prompt += `### [${i + 1}] ${r.domain} (DR ${r.max_dr}, ov ${r.overlap})\n`;
  prompt += `- chosen: **${r.best_pick}** (tier=${r.tier_label || '?'}, verified=${r.verification})\n`;
  prompt += `- reason: ${r.best_pick_reason || '(none)'}\n`;
  prompt += `- quote from HTML: \`${(r.quote || '').replace(/\s+/g, ' ').slice(0, 200)}\`\n\n`;
});

prompt += `\n## Output format
\`\`\`
[1] ${sample[0]?.domain} — OK/SUBOPTIMAL/WRONG — ...
...

Precision: X/${N}
\`\`\`
`;

fs.writeFileSync('/tmp/l3-audit-prompt.md', prompt);
console.log(`[audit] prompt written → /tmp/l3-audit-prompt.md`);
console.log(`[audit] invoking codex (timeout 180s)...`);

// Run codex
const proc = spawn('codex', ['exec', '--skip-git-repo-check', '--cd', '/Users/yegorbarakovskiy/Desktop/ratedbrokers'], {
  stdio: ['pipe', 'inherit', 'inherit'],
});
const t = setTimeout(() => { proc.kill('SIGKILL'); console.log('[audit] codex timeout'); }, 180000);
proc.on('close', (code) => { clearTimeout(t); console.log(`[audit] codex exit=${code}`); });
proc.stdin.write(prompt);
proc.stdin.end();
