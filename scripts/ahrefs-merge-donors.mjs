// Merge broker-specific competitor refdomains → deduped donor list for outreach
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const DIR = 'data/ahrefs-refdomains-2026-04-14';
const OUT_XLSX = 'Donor-List-2026-04-15.xlsx';
const OUT_CSV = 'data/donor-list-2026-04-15.csv';

// Broker-specific only (per Егор 15.04: general finance doesn't do broker outreach)
const INCLUDE = [
  'brokerchooser_com.csv',
  'forexbrokers_com.csv',
  'bestbrokers_com.csv',
  'compareforexbrokers_com.csv',
  'fxscouts_com.csv',
  'fxempire_com.csv',
  'tradersunion_com.csv',
];

// Domains to exclude from donor list (trash for outreach)
const EXCLUDE_EXACT = new Set([
  // Self — the competitors themselves
  'brokerchooser.com','forexbrokers.com','bestbrokers.com','compareforexbrokers.com',
  'fxscouts.com','fxempire.com','tradersunion.com',
  'investopedia.com','nerdwallet.com','bankrate.com','investing.com',
  // Social / platform giants (no outreach value)
  'facebook.com','twitter.com','x.com','linkedin.com','instagram.com','youtube.com',
  'tiktok.com','pinterest.com','reddit.com','quora.com','tumblr.com','t.me','whatsapp.com',
  // Search / big tech
  'google.com','google.co.uk','google.de','google.fr','google.es','google.it','bing.com',
  'duckduckgo.com','yahoo.com','yandex.ru','baidu.com','ask.com',
  // URL shorteners / trackers
  'bit.ly','goo.gl','t.co','ow.ly','tinyurl.com','buff.ly','lnkd.in','ift.tt','dlvr.it',
  // Wiki / doc platforms
  'wikipedia.org','wikimedia.org','en.wikipedia.org','archive.org','web.archive.org',
  // Dev / paste / hosting
  'github.com','gitlab.com','pastebin.com','stackoverflow.com','stackexchange.com',
  'gravatar.com','imgur.com','flickr.com','vimeo.com','soundcloud.com','spotify.com',
  // Generic blog platforms
  'blogspot.com','wordpress.com','medium.com','substack.com','tumblr.com','blogger.com',
  // Apps / stores
  'apple.com','microsoft.com','play.google.com','itunes.apple.com','apps.apple.com',
]);

// Substring patterns (domain contains) to exclude
const EXCLUDE_PATTERNS = [
  /\.blogspot\./i, /\.wordpress\.com$/i, /\.tumblr\.com$/i,
  /^amp\./i, /^cache\./i,
  /\.pdf$/i, /\.jpg$/i, /\.png$/i,
];

function isTrash(domain, isSpam) {
  if (!domain) return true;
  if (isSpam === 'true') return true;
  const d = domain.toLowerCase().trim();
  if (EXCLUDE_EXACT.has(d)) return true;
  for (const p of EXCLUDE_PATTERNS) if (p.test(d)) return true;
  return false;
}

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

const merged = new Map();
const statsIn = {};
const statsOut = {};

for (const file of INCLUDE) {
  const source = file.replace('_com.csv', '');
  const text = fs.readFileSync(path.join(DIR, file), 'utf8');
  const rows = parseCSV(text);
  statsIn[source] = rows.length;
  let kept = 0;
  for (const r of rows) {
    if (isTrash(r.domain, r.is_spam)) continue;
    kept++;
    const d = r.domain.toLowerCase().trim();
    const dr = parseFloat(r.domain_rating) || 0;
    const tr = parseInt(r.traffic_domain) || 0;
    const links = parseInt(r.links_to_target) || 0;
    const dofollow = parseInt(r.dofollow_links) || 0;
    if (!merged.has(d)) {
      merged.set(d, {
        domain: d,
        max_dr: dr,
        max_traffic: tr,
        competitors: new Set([source]),
        total_links: links,
        total_dofollow: dofollow,
        first_seen: r.first_seen,
        is_root: r.is_root_domain === 'true',
      });
    } else {
      const e = merged.get(d);
      e.max_dr = Math.max(e.max_dr, dr);
      e.max_traffic = Math.max(e.max_traffic, tr);
      e.competitors.add(source);
      e.total_links += links;
      e.total_dofollow += dofollow;
    }
  }
  statsOut[source] = kept;
}

const all = Array.from(merged.values()).map(e => ({
  domain: e.domain,
  max_dr: +e.max_dr.toFixed(1),
  overlap: e.competitors.size,
  competitors: Array.from(e.competitors).sort().join(', '),
  total_links: e.total_links,
  total_dofollow: e.total_dofollow,
  max_traffic: e.max_traffic,
  is_root: e.is_root,
}));

// Sort: overlap desc, DR desc
all.sort((a, b) => b.overlap - a.overlap || b.max_dr - a.max_dr);

// CSV
const cols = ['domain','max_dr','overlap','competitors','total_links','total_dofollow','max_traffic','is_root'];
const csv = cols.join(',') + '\n' + all.map(r => cols.map(c => {
  const v = r[c]; const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
}).join(',')).join('\n');
fs.writeFileSync(OUT_CSV, csv);

// XLSX with multiple views
const wb = XLSX.utils.book_new();

// Sheet 1: All donors
const wsAll = XLSX.utils.json_to_sheet(all);
wsAll['!cols'] = [ {wch:36},{wch:8},{wch:8},{wch:38},{wch:12},{wch:12},{wch:14},{wch:8} ];
XLSX.utils.book_append_sheet(wb, wsAll, 'All Donors');

// Sheet 2: Top priority (overlap ≥ 2 — donors who linked to 2+ competitors = proven broker-friendly)
const priority = all.filter(r => r.overlap >= 2);
const wsP = XLSX.utils.json_to_sheet(priority);
wsP['!cols'] = wsAll['!cols'];
XLSX.utils.book_append_sheet(wb, wsP, 'Priority (overlap≥2)');

// Sheet 3: High DR (40+, regardless of overlap)
const highDR = all.filter(r => r.max_dr >= 40);
const wsHDR = XLSX.utils.json_to_sheet(highDR);
wsHDR['!cols'] = wsAll['!cols'];
XLSX.utils.book_append_sheet(wb, wsHDR, 'High DR (40+)');

// Sheet 4: Summary
const summary = [
  ...INCLUDE.map(f => {
    const src = f.replace('_com.csv','');
    return { source: src, rows_in: statsIn[src], kept_after_filter: statsOut[src], trash_removed: statsIn[src] - statsOut[src] };
  }),
  { source: '—', rows_in: '—', kept_after_filter: '—', trash_removed: '—' },
  { source: 'TOTAL unique donors', rows_in: '', kept_after_filter: all.length, trash_removed: '' },
  { source: 'Priority (overlap≥2)', rows_in: '', kept_after_filter: priority.length, trash_removed: '' },
  { source: 'High DR (40+)', rows_in: '', kept_after_filter: highDR.length, trash_removed: '' },
  { source: 'DR distribution', rows_in: '', kept_after_filter: '', trash_removed: '' },
  { source: '  DR 90+', rows_in: '', kept_after_filter: all.filter(r=>r.max_dr>=90).length, trash_removed: '' },
  { source: '  DR 80-89', rows_in: '', kept_after_filter: all.filter(r=>r.max_dr>=80&&r.max_dr<90).length, trash_removed: '' },
  { source: '  DR 70-79', rows_in: '', kept_after_filter: all.filter(r=>r.max_dr>=70&&r.max_dr<80).length, trash_removed: '' },
  { source: '  DR 60-69', rows_in: '', kept_after_filter: all.filter(r=>r.max_dr>=60&&r.max_dr<70).length, trash_removed: '' },
  { source: '  DR 50-59', rows_in: '', kept_after_filter: all.filter(r=>r.max_dr>=50&&r.max_dr<60).length, trash_removed: '' },
  { source: '  DR 40-49', rows_in: '', kept_after_filter: all.filter(r=>r.max_dr>=40&&r.max_dr<50).length, trash_removed: '' },
  { source: '  DR <40', rows_in: '', kept_after_filter: all.filter(r=>r.max_dr<40).length, trash_removed: '' },
];
const wsSum = XLSX.utils.json_to_sheet(summary);
wsSum['!cols'] = [ {wch:28},{wch:12},{wch:18},{wch:14} ];
XLSX.utils.book_append_sheet(wb, wsSum, 'Summary');

wb.SheetNames = ['Summary','Priority (overlap≥2)','High DR (40+)','All Donors'];

XLSX.writeFile(wb, OUT_XLSX);
console.log(`Wrote ${OUT_XLSX} (${all.length} unique donors)`);
console.log(`        ${OUT_CSV}`);
console.table(summary);
