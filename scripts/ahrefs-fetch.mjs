// Fetches keyword data from Ahrefs API v3 for all 293 rankings + 51 reviews
import fs from 'fs';
try {
  const env = fs.readFileSync('.env', 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const KEY = process.env.AHREFS_API_KEY;
if (!KEY) { console.error('AHREFS_API_KEY missing'); process.exit(1); }

const FIELDS = 'keyword,volume,difficulty,cpc,traffic_potential,parent_topic,global_volume,clicks,intents';
const BASE = 'https://api.ahrefs.com/v3/keywords-explorer/overview';

// Country detection from keyword name
const COUNTRY_MAP = {
  'uk': 'gb', 'united kingdom': 'gb',
  'usa': 'us', 'u.s.': 'us', 'u.s': 'us', 'united states': 'us', 'america': 'us',
  'australia': 'au',
  'canada': 'ca',
  'germany': 'de', 'deutschland': 'de',
  'france': 'fr',
  'spain': 'es',
  'italy': 'it',
  'netherlands': 'nl',
  'switzerland': 'ch',
  'singapore': 'sg',
  'uae': 'ae', 'dubai': 'ae',
  'india': 'in',
  'south africa': 'za',
  'new zealand': 'nz',
  'japan': 'jp',
  'brazil': 'br',
  'mexico': 'mx',
  'ireland': 'ie',
  'europe': 'de', // proxy
};

function detectCountry(kw) {
  const lower = kw.toLowerCase();
  for (const [name, code] of Object.entries(COUNTRY_MAP)) {
    if (lower.includes(name)) return code;
  }
  return 'us';
}

async function fetchBatch(keywords, country) {
  const url = `${BASE}?select=${FIELDS}&country=${country}&keywords=${encodeURIComponent(keywords.join(','))}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${KEY}`, Accept: 'application/json' } });
  if (!res.ok) { console.error(`HTTP ${res.status} ${country}:`, await res.text().catch(()=>'')); return []; }
  const data = await res.json();
  return (data.keywords || []).map(k => ({ ...k, _country: country }));
}

async function main() {
  const seed = JSON.parse(fs.readFileSync('data/kw-seed.json', 'utf8'));
  const all = [
    ...seed.rankings.map(r => ({ type: 'ranking', name: r.name, keyword: r.keyword })),
    ...seed.reviews.map(r => ({ type: 'review', name: r.name, keyword: r.keyword })),
  ];
  console.log(`Fetching ${all.length} keywords...`);

  // Group by country
  const byCountry = {};
  for (const it of all) {
    const c = detectCountry(it.keyword);
    (byCountry[c] ??= []).push(it);
  }
  console.log('Countries:', Object.fromEntries(Object.entries(byCountry).map(([c,a])=>[c,a.length])));

  const results = [];
  for (const [country, items] of Object.entries(byCountry)) {
    // batch size 50
    for (let i = 0; i < items.length; i += 50) {
      const chunk = items.slice(i, i + 50);
      const kws = chunk.map(c => c.keyword);
      const data = await fetchBatch(kws, country);
      // Map back by exact keyword
      const map = new Map(data.map(d => [d.keyword, d]));
      for (const it of chunk) {
        const d = map.get(it.keyword) || {};
        results.push({
          type: it.type,
          name: it.name,
          keyword: it.keyword,
          country,
          volume: d.volume ?? 0,
          global_volume: d.global_volume ?? 0,
          difficulty: d.difficulty ?? null,
          cpc: d.cpc ?? 0, // cents
          traffic_potential: d.traffic_potential ?? 0,
          parent_topic: d.parent_topic ?? '',
          clicks: d.clicks ?? 0,
          intents: d.intents ?? {},
        });
      }
      process.stdout.write('.');
    }
  }
  console.log(`\nDone: ${results.length} rows`);
  fs.writeFileSync('data/kw-ahrefs.json', JSON.stringify(results, null, 2));
  console.log('Saved data/kw-ahrefs.json');
}
main().catch(e => { console.error(e); process.exit(1); });
