// Export D1 donors table → XLSX with tier/status breakdown.
// Usage: npx wrangler d1 execute ratedbrokers --remote --json --command "SELECT ..." > /tmp/donors-dump.json
//        node scripts/donors-to-xlsx.mjs
import fs from 'fs';
import XLSX from 'xlsx';

const INPUT = process.argv[2] || '/tmp/donors-dump.json';
const OUT = process.argv[3] || `Donor-List-${new Date().toISOString().slice(0,10)}.xlsx`;

const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const rows = raw[0].results;

const wb = XLSX.utils.book_new();

const byStatus = {};
const byTier = {};
let withEmail = 0, withForm = 0, withBoth = 0;
for (const r of rows) {
  byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  byTier[r.tier || 'unknown'] = (byTier[r.tier || 'unknown'] || 0) + 1;
  if (r.email) withEmail++;
  if (r.contact_form_url) withForm++;
  if (r.email && r.contact_form_url) withBoth++;
}

const summary = [
  { metric: 'Total donors', value: rows.length },
  { metric: '— with email', value: withEmail },
  { metric: '— with contact form', value: withForm },
  { metric: '— with both', value: withBoth },
  { metric: '', value: '' },
  { metric: 'Status: found', value: byStatus.found || 0 },
  { metric: 'Status: no_contact', value: byStatus.no_contact || 0 },
  { metric: 'Status: blocked', value: byStatus.blocked || 0 },
  { metric: 'Status: dead', value: byStatus.dead || 0 },
  { metric: '', value: '' },
  { metric: 'Tier: priority (overlap≥2)', value: byTier.priority || 0 },
  { metric: 'Tier: high-dr (DR≥70)', value: byTier['high-dr'] || 0 },
  { metric: 'Tier: mid-dr (DR 40-69)', value: byTier['mid-dr'] || 0 },
  { metric: 'Tier: low (DR<40)', value: byTier.low || 0 },
  { metric: '', value: '' },
  { metric: 'Exported', value: new Date().toISOString() },
];
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Summary');

const cols = ['domain','max_dr','overlap','tier','status','email','contact_form_url','contact_page_url','competitors','total_links','total_dofollow','max_traffic','notes','checked_at'];
function sheet(data, name) {
  const ws = XLSX.utils.json_to_sheet(data, { header: cols });
  ws['!cols'] = cols.map(c => ({ wch: c === 'domain' ? 28 : c === 'competitors' ? 40 : c.startsWith('contact_') ? 40 : c === 'email' ? 32 : 12 }));
  XLSX.utils.book_append_sheet(wb, ws, name);
}

sheet(rows.filter(r => r.status === 'found'), 'Found (3755)');
sheet(rows.filter(r => r.tier === 'priority'), 'Priority (overlap≥2)');
sheet(rows.filter(r => r.status === 'no_contact'), 'No Contact');
sheet(rows.filter(r => r.status === 'blocked'), 'Blocked');
sheet(rows.filter(r => r.status === 'dead'), 'Dead');
sheet(rows, 'All Donors (7805)');

XLSX.writeFile(wb, OUT);
console.log('wrote:', OUT, '|', rows.length, 'rows');
