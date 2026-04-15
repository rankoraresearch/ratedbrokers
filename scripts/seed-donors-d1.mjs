// Push merged donor list into D1 via admin bulk endpoint.
import fs from 'fs';

const CSV = 'data/donor-list-2026-04-15.csv';
const API = process.env.API_BASE || 'https://api.ratedbrokers.com';
const KEY = process.env.ADMIN_API_KEY;
if (!KEY) { console.error('ADMIN_API_KEY missing'); process.exit(1); }

function parseCSV(text) {
  const lines = text.split('\n').filter(Boolean);
  const header = lines[0].split(',');
  return lines.slice(1).map(l => {
    const cells = [];
    let cur = '', inQ = false;
    for (let i = 0; i < l.length; i++) {
      const c = l[i];
      if (c === '"') { if (inQ && l[i+1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
      else if (c === ',' && !inQ) { cells.push(cur); cur = ''; }
      else cur += c;
    }
    cells.push(cur);
    const row = {};
    header.forEach((h, i) => row[h] = cells[i]);
    return row;
  });
}

function tier(r) {
  if (r.overlap >= 2) return 'priority';
  if (r.max_dr >= 70) return 'high-dr';
  if (r.max_dr >= 40) return 'mid-dr';
  return 'low';
}

const rows = parseCSV(fs.readFileSync(CSV, 'utf8')).map(r => ({
  domain: r.domain,
  max_dr: parseFloat(r.max_dr) || 0,
  overlap: parseInt(r.overlap) || 1,
  competitors: r.competitors,
  total_links: parseInt(r.total_links) || 0,
  total_dofollow: parseInt(r.total_dofollow) || 0,
  max_traffic: parseInt(r.max_traffic) || 0,
  is_root: r.is_root === 'true',
  tier: null,
})).map(r => ({ ...r, tier: tier(r) }));

console.log(`Loaded ${rows.length} donors from CSV`);

const BATCH = 500;
let total = 0;
for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH);
  const res = await fetch(`${API}/api/admin/donors/bulk`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows: batch }),
  });
  if (!res.ok) { console.error(`HTTP ${res.status}:`, await res.text()); process.exit(1); }
  const j = await res.json();
  total += j.inserted;
  process.stdout.write(`\r  seeded ${total} / ${rows.length}`);
}
console.log(`\nDone — ${total} rows in D1`);
