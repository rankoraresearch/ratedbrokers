// Export D1 donors → XLSX with v2 fields + provenance.
// Usage:
//   npx wrangler d1 execute ratedbrokers --remote --json --command "SELECT ... FROM donors ..." > /tmp/donors-v2-dump.json
//   node scripts/donors-to-xlsx.mjs /tmp/donors-v2-dump.json Donor-List-2026-04-16.xlsx
import fs from 'fs';
import XLSX from 'xlsx';

const INPUT = process.argv[2] || '/tmp/donors-v2-dump.json';
const OUT = process.argv[3] || `Donor-List-${new Date().toISOString().slice(0,10)}.xlsx`;

const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const rows = raw[0].results;

const wb = XLSX.utils.book_new();

const byStatus = {};
const byTier = {};
const byCategory = {};
const byHostClass = {};
let withEmail = 0, withForm = 0, withBoth = 0, v2Enriched = 0, primaryChanged = 0, withFallback = 0;

function parseAllEmails(s) {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}

for (const r of rows) {
  byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  byTier[r.tier || 'unknown'] = (byTier[r.tier || 'unknown'] || 0) + 1;
  if (r.email) withEmail++;
  if (r.contact_form_url) withForm++;
  if (r.email && r.contact_form_url) withBoth++;
  if (r.enriched_v2_at) v2Enriched++;
  if (r.email && r.primary_email && r.email.toLowerCase() !== r.primary_email.toLowerCase()) primaryChanged++;
  if (r.fallback_email_1) withFallback++;
  const all = parseAllEmails(r.all_emails);
  if (all[0]) {
    byCategory[all[0].cat] = (byCategory[all[0].cat] || 0) + 1;
    byHostClass[all[0].host] = (byHostClass[all[0].host] || 0) + 1;
  }
}

const summary = [
  { metric: 'Total donors', value: rows.length },
  { metric: '', value: '' },
  { metric: '── Contacts ──', value: '' },
  { metric: 'With email (v1 or v2)', value: withEmail },
  { metric: 'With contact form', value: withForm },
  { metric: 'With both', value: withBoth },
  { metric: '', value: '' },
  { metric: '── v2 enrichment ──', value: '' },
  { metric: 'v2-enriched rows', value: v2Enriched },
  { metric: '— primary email changed vs v1', value: primaryChanged },
  { metric: '— has fallback_email_1', value: withFallback },
  { metric: '', value: '' },
  { metric: '── Primary by category ──', value: '' },
  ...Object.entries(byCategory).sort((a,b)=>b[1]-a[1]).map(([k,v]) => ({ metric: 'cat:' + k, value: v })),
  { metric: '', value: '' },
  { metric: '── Primary by host class ──', value: '' },
  ...Object.entries(byHostClass).sort((a,b)=>b[1]-a[1]).map(([k,v]) => ({ metric: 'host:' + k, value: v })),
  { metric: '', value: '' },
  { metric: '── Status ──', value: '' },
  { metric: 'Status: found', value: byStatus.found || 0 },
  { metric: 'Status: no_contact', value: byStatus.no_contact || 0 },
  { metric: 'Status: blocked', value: byStatus.blocked || 0 },
  { metric: 'Status: dead', value: byStatus.dead || 0 },
  { metric: '', value: '' },
  { metric: '── Tier ──', value: '' },
  { metric: 'Tier: priority', value: byTier.priority || 0 },
  { metric: 'Tier: high-dr', value: byTier['high-dr'] || 0 },
  { metric: 'Tier: mid-dr', value: byTier['mid-dr'] || 0 },
  { metric: 'Tier: low', value: byTier.low || 0 },
  { metric: '', value: '' },
  { metric: 'Exported', value: new Date().toISOString() },
];
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Summary');

function flat(r) {
  const all = parseAllEmails(r.all_emails);
  const primaryMeta = all[0] || {};
  return {
    domain: r.domain,
    DR: r.max_dr,
    overlap: r.overlap,
    tier: r.tier,
    status: r.status,
    primary_email: r.primary_email || r.email || '',
    primary_category: primaryMeta.cat || '',
    primary_host: primaryMeta.host || '',
    primary_score: primaryMeta.score || '',
    source_method: r.source_method || '',
    fallback_1: r.fallback_email_1 || '',
    fallback_2: r.fallback_email_2 || '',
    all_emails_count: all.length,
    all_emails_list: all.map(e => e.email).join('; '),
    source_url: r.source_url || '',
    source_snippet: r.source_snippet || '',
    contact_form_url: r.contact_form_url || '',
    competitors: r.competitors || '',
    total_links: r.total_links,
    max_traffic: r.max_traffic,
    v1_email_legacy: r.email || '',
    notes: r.notes || '',
    checked_at: r.checked_at || '',
    enriched_v2_at: r.enriched_v2_at || '',
  };
}

const cols = ['domain','DR','overlap','tier','status','primary_email','primary_category','primary_host','primary_score','source_method','fallback_1','fallback_2','all_emails_count','all_emails_list','source_url','source_snippet','contact_form_url','competitors','total_links','max_traffic','v1_email_legacy','notes','checked_at','enriched_v2_at'];

function addSheet(data, name) {
  const ws = XLSX.utils.json_to_sheet(data.map(flat), { header: cols });
  ws['!cols'] = cols.map(c => {
    if (c === 'domain') return { wch: 30 };
    if (c === 'competitors' || c === 'all_emails_list') return { wch: 50 };
    if (c === 'source_url' || c === 'contact_form_url' || c === 'source_snippet') return { wch: 45 };
    if (c === 'primary_email' || c === 'fallback_1' || c === 'fallback_2' || c === 'v1_email_legacy') return { wch: 32 };
    if (c === 'notes') return { wch: 40 };
    return { wch: 14 };
  });
  XLSX.utils.book_append_sheet(wb, ws, name);
}

const changedRows = rows.filter(r => r.enriched_v2_at && r.email && r.primary_email && r.email.toLowerCase() !== r.primary_email.toLowerCase());
addSheet(changedRows, `Primary Changed (${changedRows.length})`);

const v2Rows = rows.filter(r => r.enriched_v2_at);
addSheet(v2Rows, `v2 Enriched (${v2Rows.length})`);

addSheet(rows.filter(r => r.status === 'found'), `Found (${byStatus.found || 0})`);
addSheet(rows.filter(r => r.tier === 'priority'), `Priority (${byTier.priority || 0})`);
addSheet(rows.filter(r => r.status === 'no_contact'), 'No Contact');
addSheet(rows.filter(r => r.status === 'blocked'), 'Blocked');
addSheet(rows.filter(r => r.status === 'dead'), 'Dead');
addSheet(rows, `All (${rows.length})`);

const flatEmails = [];
for (const r of rows) {
  const all = parseAllEmails(r.all_emails);
  if (all.length === 0 && r.email) {
    flatEmails.push({ domain: r.domain, DR: r.max_dr, email: r.email, is_primary: 'legacy_v1', category: '', host: '', method: '', score: '' });
    continue;
  }
  for (let i = 0; i < all.length; i++) {
    const e = all[i];
    flatEmails.push({
      domain: r.domain, DR: r.max_dr,
      email: e.email,
      is_primary: i === 0 ? 'primary' : i === 1 ? 'fallback_1' : i === 2 ? 'fallback_2' : `rank_${i+1}`,
      category: e.cat || '', host: e.host || '', method: e.m || '', score: e.score || '',
    });
  }
}
const emailCols = ['domain','DR','email','is_primary','category','host','method','score'];
const wsE = XLSX.utils.json_to_sheet(flatEmails, { header: emailCols });
wsE['!cols'] = emailCols.map(c => ({ wch: c === 'domain' ? 30 : c === 'email' ? 36 : 14 }));
XLSX.utils.book_append_sheet(wb, wsE, `All Emails Flat (${flatEmails.length})`);

XLSX.writeFile(wb, OUT);
console.log('wrote:', OUT, '|', rows.length, 'donors |', v2Enriched, 'v2-enriched |', primaryChanged, 'primary changed |', flatEmails.length, 'emails flat');
