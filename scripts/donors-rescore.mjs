// Re-score primary_email from existing all_emails JSON — no HTTP fetches.
// Use after updating scoring rules in enrich-donors-v2.mjs.
// Usage: ADMIN_API_KEY=... node scripts/donors-rescore.mjs [--dry-run]
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

const args = Object.fromEntries(process.argv.slice(2).map(a => a.split('=').map(s => s.replace(/^--/, ''))));
const DRY_RUN = args['dry-run'] === 'true' || args['dry-run'] === '1' || process.argv.includes('--dry-run');

// ─── Import scoring rules from v2 script ─────────────────────────────
// Keep in sync with scripts/enrich-donors-v2.mjs.
function isNonOutreach(local) {
  return /^(jobs?|careers?|recruit(ing|ment)?|hr|investor(s|ship)?|legal|compliance|dmca|privacy|security|vulnerability|gdpr|copyright|complaints?|tax|accounting|finance|billing|purchase|procurement|corrections?|feedback|tips|story|whistle(blower)?|unsubscribe|subscription|subscriptions|newsletter|opt-?out)$/i.test(local);
}
function isPlaceholderLocal(local) {
  return /^(example|sample|test|foo|bar|baz|yourname|yourmail|firstname|lastname|name|voorbeeld|beispiel|exemple|esempio|ejemplo|primer|xxx|abc)$/i.test(local);
}
const PLACEHOLDER_HOSTS = new Set([
  'example.com','example.org','example.net','domain.com','yoursite.com','yourdomain.com','test.com','email.com','mail.com','sample.com','website.com','site.com','company.com','foo.com','bar.com',
  'voorbeeld.nl','domein.com','domein.nl','beispiel.de','domain.de','muster.de','exemple.com','exemple.fr','domaine.fr','esempio.it','dominio.it','ejemplo.com','ejemplo.es','dominio.es','primer.ru','test.ru',
]);
const FOREIGN_EMAIL_HOSTS = new Set([
  'gmail.com','googlemail.com','yahoo.com','yahoo.co.uk','hotmail.com','outlook.com','live.com','aol.com','icloud.com','me.com','mac.com','protonmail.com','proton.me','yandex.ru','yandex.com','mail.ru','rambler.ru','gmx.com','gmx.net','zoho.com','fastmail.com','msn.com','ymail.com','bk.ru','list.ru','inbox.ru',
]);

function categorize(local) {
  const L = local.toLowerCase();
  if (isNonOutreach(L)) return 'non_outreach';
  if (/^(guest[-_.]?posts?|contribut(e|ing|or)|submissions?|writers?|pitches?)$/i.test(L)) return 'guest';
  if (/^(editor(s|ial)?|content|newsroom|news|redaktion|redazione|redakcja)$/i.test(L)) return 'editor';
  if (/^(pr|press|media|publicity|communications?|comms?)$/i.test(L)) return 'pr';
  if (/^(partnerships?|outreach|business|bd|collab(oration)?|biz(dev)?|marketing|sales)$/i.test(L)) return 'partnerships';
  if (/^(contact|hello|hi|team|admin|reception|enquir(y|ies|e)|general)$/i.test(L)) return 'contact';
  if (/^(info|support|help|customer.?service|service)$/i.test(L)) return 'support';
  if (/^editor[._-]/.test(L)) return 'editor';
  if (/^press[._-]/.test(L)) return 'pr';
  if (/^contact[._-]/.test(L)) return 'contact';
  if (/^guest[._-]/.test(L)) return 'guest';
  if (/^news[._-]/.test(L)) return 'editor';
  return 'other';
}
function weight(category, dr) {
  if (category === 'non_outreach') return null;
  const bands = {
    guest:        [100, 100, 100],
    editor:       [ 95,  85,  75],
    pr:           [ 85,  55,  35],
    partnerships: [ 70,  55,  45],
    contact:      [ 40,  60,  80],
    support:      [ 20,  40,  50],
    other:        [ 30,  35,  55],
  };
  const band = dr >= 80 ? 0 : dr >= 60 ? 1 : 2;
  return bands[category]?.[band] ?? 50;
}
function classifyHost(email, donorDomain) {
  const host = email.split('@')[1].toLowerCase().replace(/^www\./, '');
  const donor = donorDomain.toLowerCase().replace(/^www\./, '');
  if (host === donor) return 'on_domain';
  if (host.endsWith('.' + donor) || donor.endsWith('.' + host)) return 'same_site';
  if (FOREIGN_EMAIL_HOSTS.has(host)) return 'foreign_provider';
  return 'foreign_domain';
}
function isPlaceholderEmail(email) {
  const m = email.match(/^([^@]+)@([^@]+)$/);
  if (!m) return true;
  const host = m[2].toLowerCase().replace(/^www\./, '');
  if (PLACEHOLDER_HOSTS.has(host)) return true;
  if (isPlaceholderLocal(m[1].toLowerCase())) return true;
  return false;
}

function rescore(allEmails, domain, dr) {
  // allEmails: array of {email, cat, w, m, host, score} from stored JSON
  const byEmail = {};
  for (const c of allEmails) {
    if (isPlaceholderEmail(c.email)) continue; // new placeholder filters
    const local = c.email.split('@')[0];
    const cat = categorize(local);
    const w = weight(cat, dr);
    if (w === null) continue;
    const hostClass = classifyHost(c.email, domain);
    const hostBonus = hostClass === 'on_domain' ? 30 : hostClass === 'same_site' ? 20 : hostClass === 'foreign_provider' ? -25 : -15;
    const methodBonus = c.m === 'mailto' ? 5 : c.m === 'cfemail' ? 3 : c.m === 'json-ld' ? 3 : 0;
    const score = w + hostBonus + methodBonus;
    if (!byEmail[c.email] || byEmail[c.email].score < score) {
      byEmail[c.email] = { email: c.email, cat, w, m: c.m || '', host: hostClass, score };
    }
  }
  const sorted = Object.values(byEmail).sort((a, b) => b.score - a.score);
  if (dr < 60) {
    const contactOnDomain = sorted.find(s => s.cat === 'contact' && (s.host === 'on_domain' || s.host === 'same_site'));
    const prFirst = sorted[0] && sorted[0].cat === 'pr';
    if (contactOnDomain && prFirst) {
      sorted.splice(sorted.indexOf(contactOnDomain), 1);
      sorted.unshift(contactOnDomain);
    }
  }
  return sorted;
}

async function listDonors() {
  const res = await fetch(`${API}/api/admin/donors/list?limit=10000&min_dr=0&min_overlap=0`, {
    headers: { 'x-api-key': KEY },
  });
  if (!res.ok) throw new Error(`list → ${res.status}`);
  const j = await res.json();
  return j.rows;
}

async function updateDonor(domain, data) {
  const res = await fetch(`${API}/api/admin/donors/${encodeURIComponent(domain)}`, {
    method: 'PUT', headers: { 'x-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${domain} → ${res.status}`);
}

async function main() {
  const rows = await listDonors();
  const v2Rows = rows.filter(r => r.all_emails && r.all_emails !== '[]');
  console.log(`[rescore] ${v2Rows.length} rows with all_emails JSON${DRY_RUN ? ' — DRY RUN' : ''}`);

  let changed = 0, unchanged = 0, errors = 0, placeholderCleared = 0;
  for (let i = 0; i < v2Rows.length; i++) {
    const r = v2Rows[i];
    try {
      const allEmails = JSON.parse(r.all_emails);
      const sorted = rescore(allEmails, r.domain, r.max_dr || 50);
      const newPrimary = sorted[0]?.email || null;
      const newFb1 = sorted[1]?.email || null;
      const newFb2 = sorted[2]?.email || null;
      const oldPrimary = r.primary_email || null;

      if (newPrimary !== oldPrimary || newFb1 !== r.fallback_email_1 || newFb2 !== r.fallback_email_2) {
        if (!newPrimary && oldPrimary) placeholderCleared++;
        if (!DRY_RUN) {
          await updateDonor(r.domain, {
            primary_email: newPrimary,
            fallback_email_1: newFb1,
            fallback_email_2: newFb2,
            all_emails: JSON.stringify(sorted.map(s => ({ email: s.email, cat: s.cat, w: s.w, m: s.m, host: s.host, score: s.score }))),
          });
        }
        changed++;
        if (changed <= 20) console.log(`  ${r.domain.padEnd(32)} ${(oldPrimary || 'NONE').padEnd(32)} → ${newPrimary || 'NONE (cleared)'}`);
      } else {
        unchanged++;
      }
    } catch (e) { errors++; if (errors < 5) console.log(`  ERR ${r.domain}: ${e.message}`); }
    if ((i + 1) % 200 === 0) console.log(`  [${i+1}/${v2Rows.length}] changed=${changed} cleared=${placeholderCleared} errors=${errors}`);
  }
  console.log(`\n[rescore] done. changed=${changed} cleared_placeholder=${placeholderCleared} unchanged=${unchanged} errors=${errors}`);
}

main().catch(e => { console.error(e); process.exit(1); });
