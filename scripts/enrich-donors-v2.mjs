// v2 enrichment: collect ALL emails per domain + DR-aware primary selection + source snippet.
// Re-crawls found-status donors (adds all_emails, primary_email, fallback_*, source_*).
// Usage:
//   ADMIN_API_KEY='...' node scripts/enrich-donors-v2.mjs --sample=20        # dry-run 20 random
//   ADMIN_API_KEY='...' node scripts/enrich-donors-v2.mjs --status=found     # full re-crawl
//   ADMIN_API_KEY='...' node scripts/enrich-donors-v2.mjs --domain=x.com     # one domain
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

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const PATHS = ['/', '/contact', '/contact-us', '/about', '/about-us', '/write-for-us', '/team', '/advertise', '/advertising'];
const EMAIL_RX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

const VALID_TLDS = new Set([
  'com','net','org','io','co','info','biz','name','me','us','app','dev','ai','xyz','tech','online','site','store',
  'blog','news','pro','agency','email','media','tv','cc','club','today','digital','finance','money','wiki',
  'uk','de','fr','es','it','nl','pl','ca','au','nz','ie','ch','se','no','dk','fi','be','at','cz','pt','gr','ro',
  'ru','ua','by','kz','jp','cn','kr','in','sg','hk','tw','my','th','vn','id','ph','ae','sa','il','tr','za','eg',
  'br','mx','ar','cl','pe','ve','uy','ng','ke','ma','tn','dz','gh','tz','ug','zw','bg','hu','sk','si','hr',
  'rs','lt','lv','ee','is','lu','mt','cy','li','mc','sm','va','mk','ba','al','md','am','ge','az','kg','uz',
  'tm','tj','mn','kh','la','mm','bd','lk','np','pk','af','iq','ir','sy','jo','lb','ye','om','qa','bh','kw','ps',
  'edu','gov','mil','ac','int','eu','asia',
]);

// Hard-reject local parts (never primary, never stored)
const BAD_LOCAL = /^(noreply|no-?reply|donotreply|do-?not-?reply|postmaster|abuse|webmaster|mailer-daemon|bounce|notifications?|www|ftp|http|https|root|daemon|username|user|yourname|firstname|lastname|yourname|email|example)@/i;
// Non-outreach-relevant (store but never primary). Match ONLY local part, not trailing chars.
function isNonOutreach(local) {
  return /^(jobs?|careers?|recruit(ing|ment)?|hr|investor(s|ship)?|legal|compliance|dmca|privacy|security|vulnerability|gdpr|copyright|complaints?|tax|accounting|finance|billing|purchase|procurement)$/i.test(local);
}
// Placeholder domains (never real outreach targets)
const PLACEHOLDER_HOSTS = new Set([
  'example.com', 'example.org', 'example.net', 'domain.com', 'yoursite.com',
  'yourdomain.com', 'test.com', 'email.com', 'mail.com', 'sample.com',
  'website.com', 'site.com', 'company.com',
]);
// Known personal email providers — foreign (not owner's site inbox). Store but demote.
const FOREIGN_EMAIL_HOSTS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'hotmail.com', 'outlook.com',
  'live.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com', 'protonmail.com', 'proton.me',
  'yandex.ru', 'yandex.com', 'mail.ru', 'rambler.ru', 'gmx.com', 'gmx.net', 'zoho.com',
  'fastmail.com', 'msn.com', 'ymail.com', 'bk.ru', 'list.ru', 'inbox.ru',
]);

// Email category — one of: guest, editor, pr, partnerships, contact, support, other, non_outreach
function categorize(local) {
  const L = local.toLowerCase();
  if (isNonOutreach(L)) return 'non_outreach';
  if (/^(guest[-_.]?posts?|contribut(e|ing|or)|submissions?|writers?|pitches?)$/i.test(L)) return 'guest';
  if (/^(editor(s|ial)?|content|newsroom|news|redaktion|redazione|redakcja)$/i.test(L)) return 'editor';
  if (/^(pr|press|media|publicity|communications?|comms?)$/i.test(L)) return 'pr';
  if (/^(partnerships?|outreach|business|bd|collab(oration)?|biz(dev)?|marketing|sales)$/i.test(L)) return 'partnerships';
  if (/^(contact|hello|hi|team|admin|reception|enquir(y|ies|e)|general)$/i.test(L)) return 'contact';
  if (/^(info|support|help|customer.?service|service)$/i.test(L)) return 'support';
  const prefix = categorizePrefix(L);
  if (prefix) return prefix;
  return 'other';
}

// DR-aware weight. Returns null for non_outreach (never primary).
function weight(category, dr) {
  if (category === 'non_outreach') return null;
  const bands = {
    guest:        [100, 100, 100],
    editor:       [ 95,  85,  75],
    pr:           [ 85,  55,  35],  // ⬅ DR<60 pr@ heavily deprioritized
    partnerships: [ 70,  55,  45],
    contact:      [ 40,  60,  80],  // ⬅ DR<60 contact@ wins over pr@
    support:      [ 20,  40,  50],
    other:        [ 30,  35,  55],  // personal names: random staff at big sites, owner at small
  };
  const band = dr >= 80 ? 0 : dr >= 60 ? 1 : 2;
  return bands[category]?.[band] ?? 50;
}

// Accept editor.XXX / editor_YYY as editor category too (prefix match).
function categorizePrefix(local) {
  const L = local.toLowerCase();
  if (/^editor[._-]/.test(L)) return 'editor';
  if (/^press[._-]/.test(L)) return 'pr';
  if (/^contact[._-]/.test(L)) return 'contact';
  if (/^guest[._-]/.test(L)) return 'guest';
  if (/^news[._-]/.test(L)) return 'editor';
  return null;
}

function cleanHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<template[^>]*>[\s\S]*?<\/template>/gi, ' ')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
}

function looksLikeRealEmail(email) {
  const m = email.match(/^([^@]+)@([^@]+)$/);
  if (!m) return false;
  const local = m[1].toLowerCase();
  const host = m[2].toLowerCase().replace(/^www\./, '');
  const hostParts = host.split('.');
  if (hostParts.length < 2) return false;
  const tld = hostParts[hostParts.length - 1];
  if (!VALID_TLDS.has(tld)) return false;
  for (const p of hostParts) {
    if (!p || p.length > 63) return false;
    if (/^\d+x$/.test(p)) return false;
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(p)) return false;
  }
  if (local.length < 2) return false;
  if (!/[a-z]/i.test(local)) return false;
  if (BAD_LOCAL.test(email + '@')) return false;
  if (PLACEHOLDER_HOSTS.has(host)) return false;  // reject me@example.com etc
  return true;
}

// Check if email host matches donor domain (on-site) or is a foreign mailbox (gmail etc)
function classifyHost(email, donorDomain) {
  const host = email.split('@')[1].toLowerCase().replace(/^www\./, '');
  const donor = donorDomain.toLowerCase().replace(/^www\./, '');
  if (host === donor) return 'on_domain';
  // subdomain or parent relationship (e.g. support.foo.com vs foo.com)
  if (host.endsWith('.' + donor) || donor.endsWith('.' + host)) return 'same_site';
  if (FOREIGN_EMAIL_HOSTS.has(host)) return 'foreign_provider';
  return 'foreign_domain';
}

function normalizeEmail(e) {
  return e.toLowerCase().replace(/@www\./, '@');
}

function decodeCF(hex) {
  if (!hex || hex.length < 4) return null;
  const key = parseInt(hex.substr(0, 2), 16);
  let out = '';
  for (let i = 2; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.substr(i, 2), 16) ^ key);
  }
  return out;
}

function decodeObfuscated(text) {
  return text
    .replace(/\[\s*at\s*\]/gi, '@').replace(/\(\s*at\s*\)/gi, '@').replace(/\{\s*at\s*\}/gi, '@')
    .replace(/\[\s*dot\s*\]/gi, '.').replace(/\(\s*dot\s*\)/gi, '.').replace(/\{\s*dot\s*\}/gi, '.')
    .replace(/&#64;/g, '@').replace(/&#46;/g, '.').replace(/&commat;/gi, '@');
}

// Extract all emails from html with provenance
function extractEmails(html, url) {
  const results = [];  // {email, method, snippet}

  // 1. mailto: links — highest confidence. Decode URL-escapes, trim whitespace.
  const mailtoRx = /mailto:([^\s"'?&<>]+)/gi;
  let m;
  while ((m = mailtoRx.exec(html)) !== null) {
    let raw = m[1];
    try { raw = decodeURIComponent(raw); } catch {}
    const e = raw.trim().replace(/[\s\u00A0\u200B]+/g, '');
    if (looksLikeRealEmail(e)) {
      const start = Math.max(0, m.index - 150);
      const end = Math.min(html.length, m.index + 150);
      results.push({ email: normalizeEmail(e), method: 'mailto', snippet: html.slice(start, end).replace(/\s+/g, ' ') });
    }
  }

  // 2. Cloudflare email protection
  const cfRx = /data-cfemail="([a-f0-9]+)"/gi;
  let cf;
  while ((cf = cfRx.exec(html)) !== null) {
    const decoded = decodeCF(cf[1]);
    if (decoded && looksLikeRealEmail(decoded)) {
      const start = Math.max(0, cf.index - 150);
      const end = Math.min(html.length, cf.index + 150);
      results.push({ email: normalizeEmail(decoded), method: 'cfemail', snippet: html.slice(start, end).replace(/\s+/g, ' ') });
    }
  }

  // 3. Plain regex on clean html
  const clean = cleanHtml(html);
  const decoded = decodeObfuscated(clean);
  let pm;
  EMAIL_RX.lastIndex = 0;
  while ((pm = EMAIL_RX.exec(decoded)) !== null) {
    const e = pm[1] || pm[0];
    if (looksLikeRealEmail(e)) {
      const start = Math.max(0, pm.index - 150);
      const end = Math.min(decoded.length, pm.index + 150);
      results.push({ email: normalizeEmail(e), method: 'plain', snippet: decoded.slice(start, end).replace(/\s+/g, ' ') });
    }
  }

  // 4. JSON-LD contact points
  const jsonLdRx = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jm;
  while ((jm = jsonLdRx.exec(html)) !== null) {
    try {
      const data = JSON.parse(jm[1].trim());
      const walk = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        if (typeof obj.email === 'string' && looksLikeRealEmail(obj.email)) {
          results.push({ email: normalizeEmail(obj.email), method: 'json-ld', snippet: JSON.stringify(obj).slice(0, 300) });
        }
        for (const v of Object.values(obj)) walk(v);
      };
      walk(data);
    } catch { /* skip invalid JSON-LD */ }
  }

  // Dedup — keep first (strongest) occurrence per email+method
  const seen = new Set();
  return results.filter(r => {
    const k = r.email + '|' + r.method;
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
}

// Select primary + fallbacks from collected emails
function selectPrimary(collected, dr, donorDomain) {
  const byEmail = {};
  for (const c of collected) {
    const local = c.email.split('@')[0];
    const cat = categorize(local);
    const w = weight(cat, dr);
    if (w === null) continue; // non_outreach excluded from primary
    const hostClass = classifyHost(c.email, donorDomain);
    // Host bonus/penalty — on-domain emails are owner's; foreign are much lower confidence
    const hostBonus = hostClass === 'on_domain' ? 30 : hostClass === 'same_site' ? 20 : hostClass === 'foreign_provider' ? -25 : -15;
    const methodBonus = c.method === 'mailto' ? 5 : c.method === 'cfemail' ? 3 : c.method === 'json-ld' ? 3 : 0;
    const depthBonus = c.pageDepth === 'contact' ? 10 : c.pageDepth === 'about' ? 5 : 0;
    const score = w + hostBonus + methodBonus + depthBonus;
    if (!byEmail[c.email] || byEmail[c.email].score < score) {
      byEmail[c.email] = { ...c, category: cat, weight: w, hostClass, score };
    }
  }
  const sorted = Object.values(byEmail).sort((a, b) => b.score - a.score);

  // Hard override: if DR < 60 AND on-domain contact-type exists, force it over pr/press
  if (dr < 60) {
    const contactOnDomain = sorted.find(s => s.category === 'contact' && (s.hostClass === 'on_domain' || s.hostClass === 'same_site'));
    const prFirst = sorted[0] && sorted[0].category === 'pr';
    if (contactOnDomain && prFirst) {
      sorted.splice(sorted.indexOf(contactOnDomain), 1);
      sorted.unshift(contactOnDomain);
    }
  }

  return sorted;
}

async function fetchPage(url, timeoutMs = 12000) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml' },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: 'follow',
    });
    return { status: res.status, html: await res.text(), url: res.url };
  } catch (e) { return { status: 0, error: e.message, url }; }
}

async function crawlDomain(domain, dr) {
  const allCollected = [];
  const pagesHit = [];
  for (const p of PATHS) {
    const url = 'https://' + domain + p;
    const res = await fetchPage(url);
    pagesHit.push(p + '→' + (res.status || 'ERR'));
    if (res.status === 200 && res.html) {
      const depth = p.includes('contact') ? 'contact' : p.includes('about') ? 'about' : 'other';
      const emails = extractEmails(res.html, res.url || url);
      for (const e of emails) allCollected.push({ ...e, url: res.url || url, pageDepth: depth });
    }
    await new Promise(r => setTimeout(r, 300)); // rate limit per-domain
  }
  return { collected: allCollected, pagesHit };
}

async function updateDonor(domain, data) {
  const res = await fetch(`${API}/api/admin/donors/${encodeURIComponent(domain)}`, {
    method: 'PUT',
    headers: { 'x-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${domain} → ${res.status}`);
  return res.json();
}

async function listDonors(params) {
  const qs = new URLSearchParams({ limit: '10000', ...params });
  const res = await fetch(`${API}/api/admin/donors/list?${qs}`, { headers: { 'x-api-key': KEY } });
  if (!res.ok) throw new Error(`list → ${res.status}`);
  const j = await res.json();
  return j.rows;
}

async function main() {
  const args = Object.fromEntries(process.argv.slice(2).map(a => a.split('=').map(s => s.replace(/^--/, ''))));
  const sample = parseInt(args.sample || '0', 10);
  const statusFilter = args.status || 'found';
  const oneDomain = args.domain;

  let rows;
  if (oneDomain) {
    rows = [{ domain: oneDomain, max_dr: parseFloat(args.dr || '50') }];
  } else {
    rows = await listDonors({ status: statusFilter });
    if (sample) {
      rows = [...rows].sort(() => Math.random() - 0.5).slice(0, sample);
    }
  }

  const concurrency = parseInt(args.concurrency || '6', 10);
  console.log(`\n[v2] processing ${rows.length} donors (status=${statusFilter}${sample ? ', sample=' + sample : ''}) concurrency=${concurrency}\n`);
  let ok = 0, primaryChanged = 0, errors = 0, done = 0;

  async function processOne(r) {
    const dr = r.max_dr || 50;
    try {
      const { collected } = await crawlDomain(r.domain, dr);
      const sorted = selectPrimary(collected, dr, r.domain);
      const primary = sorted[0];
      const fallback1 = sorted[1];
      const fallback2 = sorted[2];

      const all_emails_compact = sorted.map(s => ({ email: s.email, cat: s.category, w: s.weight, m: s.method, host: s.hostClass, score: s.score }));

      await updateDonor(r.domain, {
        all_emails: JSON.stringify(all_emails_compact),
        primary_email: primary?.email || null,
        fallback_email_1: fallback1?.email || null,
        fallback_email_2: fallback2?.email || null,
        source_url: primary?.url || null,
        source_method: primary?.method || null,
        source_snippet: primary?.snippet?.slice(0, 300) || null,
        enriched_v2_at: new Date().toISOString(),
      });
      ok++;
      const changed = r.email && primary && normalizeEmail(r.email) !== primary.email;
      if (changed) primaryChanged++;
    } catch (e) {
      errors++;
    } finally {
      done++;
      if (done % 25 === 0 || done === rows.length) {
        const pct = (done / rows.length * 100).toFixed(1);
        console.log(`[${done.toString().padStart(5)}/${rows.length}] ${pct.padStart(5)}% | ok=${ok} changed=${primaryChanged} errors=${errors}`);
      }
    }
  }

  const queue = [...rows];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const r = queue.shift();
      if (r) await processOne(r);
    }
  });
  await Promise.all(workers);

  console.log(`\n[v2] done: ok=${ok} primaryChanged=${primaryChanged} errors=${errors}\n`);
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
