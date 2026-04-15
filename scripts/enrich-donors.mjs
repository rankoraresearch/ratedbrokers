// Enrich donors with contacts per OUTREACH-EMAIL-RULES.md
// Usage: node scripts/enrich-donors.mjs --test=20
//        node scripts/enrich-donors.mjs --tier=priority
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

// ─── Tier scoring ───
const TIER_PATTERNS = [
  { tier: 1, weight: 100, rx: /^(guest[-_.]?posts?|contribut(e|ing|or)|submissions?|writers?|pitches?)@/i },
  { tier: 2, weight: 80,  rx: /^(editor(s|ial)?|content|newsroom)@/i },
  { tier: 3, weight: 60,  rx: /^(pr|press|media|publicity|communications?|comms?)@/i },
  { tier: 4, weight: 50,  rx: /^(partnerships?|outreach|business|bd|collab(oration)?|biz|marketing)@/i },
  { tier: 5, weight: 30,  rx: /^(info|contact|hello|team|admin|support|enquiries|general)@/i },
];
const BAD_LOCAL = /^(noreply|no-?reply|donotreply|do-?not-?reply|postmaster|abuse|webmaster|mailer-daemon|bounce|notifications?)@/i;
const EMAIL_RX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

// Accept only "real" TLDs. Rejects .png, .css, .js, .min, .push, .useragent, etc.
const VALID_TLDS = new Set([
  // generic
  'com','net','org','io','co','info','biz','name','me','us','app','dev','ai','xyz','tech','online','site','store',
  'blog','news','pro','agency','email','media','tv','cc','club','today','digital','finance','money','wiki',
  // country (common)
  'uk','de','fr','es','it','nl','pl','ca','au','nz','ie','ch','se','no','dk','fi','be','at','cz','pt','gr','ro',
  'ru','ua','by','kz','jp','cn','kr','in','sg','hk','tw','my','th','vn','id','ph','ae','sa','il','tr','za','eg',
  'br','mx','ar','cl','co','pe','ve','uy','ng','ke','ma','tn','dz','gh','tz','ug','zw','bg','hu','sk','si','hr',
  'rs','lt','lv','ee','is','lu','mt','cy','li','mc','sm','va','mk','me','ba','al','md','am','ge','az','kg','uz',
  'tm','tj','mn','kh','la','mm','bd','lk','np','pk','af','iq','ir','sy','jo','lb','ye','om','qa','bh','kw','ps',
  // academic/gov
  'edu','gov','mil','ac','int',
  // 2-letter generic
  'eu','asia','africa',
]);

function cleanHtml(html) {
  // Strip <script>, <style>, <template>, <svg>, <noscript>, <pre><code> blocks
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<template[^>]*>[\s\S]*?<\/template>/gi, ' ')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
}

// Short local parts that ARE legitimate outreach emails
const SHORT_LEGIT = new Set(['pr','bd','hr','cs','it','hi','cx','qa']);

function looksLikeRealEmail(email) {
  const m = email.match(/^([^@]+)@([^@]+)$/);
  if (!m) return false;
  const local = m[1].toLowerCase();
  const hostParts = m[2].toLowerCase().split('.');
  if (hostParts.length < 2) return false;
  const tld = hostParts[hostParts.length - 1];
  // TLD must be in whitelist
  if (!VALID_TLDS.has(tld)) return false;
  // Each host part must be valid hostname segment
  for (const p of hostParts) {
    if (!p || p.length > 63) return false;
    if (/^\d+x$/.test(p)) return false; // @2x, @3x image artifacts
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(p)) return false;
  }
  // Reject likely JS/framework/single-word-text artifacts
  if (/^(d|k|a|w|s|e|n|i|t|u|r|st|th|ch|en|de|fr|navig|consent|intern|dashboard|document|window|event)$/.test(local)) return false;
  // Local must be >=3 chars OR known short legit (pr, bd, hr, etc)
  if (local.length < 3 && !SHORT_LEGIT.has(local)) return false;
  // Reject if local has no letters at all (digits only)
  if (!/[a-z]/i.test(local)) return false;
  // Reject domains with repeated www (www.www.www artifact from concat bugs)
  if (/\b(www\.){2,}/i.test(m[2])) return false;
  // Reject domains where any subdomain label repeats immediately (foo.foo.bar)
  for (let i = 0; i < hostParts.length - 1; i++) {
    if (hostParts[i] === hostParts[i+1] && hostParts[i].length > 1) return false;
  }
  return true;
}

function decodeCF(hex) {
  // Cloudflare email protection: __cf_email__ with data-cfemail hex
  if (!hex || hex.length < 4) return null;
  const key = parseInt(hex.substr(0, 2), 16);
  let out = '';
  for (let i = 2; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.substr(i, 2), 16) ^ key);
  }
  return out;
}

function decodeObfuscated(text) {
  // Only explicit obfuscation markers (bracketed or parenthesized). NEVER bare "at" (breaks "available", "innovation", "category").
  return text
    .replace(/\[\s*at\s*\]/gi, '@')
    .replace(/\(\s*at\s*\)/gi, '@')
    .replace(/\{\s*at\s*\}/gi, '@')
    .replace(/\s\bAT\b\s/g, '@')   // uppercase AT with spaces (less common but used)
    .replace(/\[\s*dot\s*\]/gi, '.')
    .replace(/\(\s*dot\s*\)/gi, '.')
    .replace(/\{\s*dot\s*\}/gi, '.')
    .replace(/&#64;/g, '@').replace(/&#46;/g, '.')
    .replace(/&commat;/gi, '@');
}

function extractEmails(html, baseDomain) {
  const found = new Set();

  // 1. mailto: links (highest confidence)
  const mailtoRx = /mailto:([^\s"'?&<>]+)/gi;
  let mt;
  while ((mt = mailtoRx.exec(html)) !== null) {
    const e = decodeURIComponent(mt[1]).trim().toLowerCase();
    if (/^[^@]+@[^@]+\.[^@]+$/.test(e)) found.add(e);
  }

  // 2. Cloudflare email protection (data-cfemail)
  const cfRx = /data-cfemail="([a-f0-9]+)"/gi;
  let cf;
  while ((cf = cfRx.exec(html)) !== null) {
    const decoded = decodeCF(cf[1]);
    if (decoded && /^[^@]+@[^@]+\.[^@]+$/.test(decoded)) found.add(decoded.toLowerCase());
  }

  // 3. Visible text — strip script/style/svg/etc first
  const cleaned = cleanHtml(html);
  const textOnly = cleaned.replace(/<[^>]+>/g, ' '); // strip all tags
  const deobfuscated = decodeObfuscated(textOnly);
  const matches = deobfuscated.match(EMAIL_RX) || [];
  for (const m of matches) found.add(m.toLowerCase());

  return Array.from(found).filter(e => {
    if (BAD_LOCAL.test(e)) return false;
    if (/example\.com$|yoursite\.com$|domain\.com$|test\.com$/i.test(e)) return false;
    if (/^(test|demo|sample|user|john\.doe|jane\.doe)@/i.test(e)) return false;
    if (!looksLikeRealEmail(e)) return false;
    return true;
  });
}

function scoreEmail(email, baseDomain) {
  for (const t of TIER_PATTERNS) {
    if (t.rx.test(email)) {
      const bonus = email.endsWith('@' + baseDomain) || email.endsWith('.' + baseDomain) ? 10 : 0;
      return { tier: t.tier, weight: t.weight + bonus };
    }
  }
  // Personal email (name.surname@domain) same-domain = tier 2 equivalent
  if (email.endsWith('@' + baseDomain) || email.endsWith('.' + baseDomain)) {
    if (/^[a-z]+[._][a-z]+@/.test(email)) return { tier: 2, weight: 70 };
    return { tier: 5, weight: 35 };
  }
  return { tier: 9, weight: 5 }; // off-domain email, low priority
}

function bestEmail(emails, baseDomain) {
  if (!emails.length) return null;
  const scored = emails.map(e => ({ email: e, ...scoreEmail(e, baseDomain) }));
  scored.sort((a, b) => b.weight - a.weight);
  return scored[0];
}

function findContactFormUrl(html, baseUrl) {
  // Page has <form> with <textarea> or <input type="email"> + other fields
  const hasForm = /<form[^>]*>/i.test(html);
  if (!hasForm) return null;
  const hasTextarea = /<textarea/i.test(html);
  const hasMsgField = /name=["'](?:message|msg|comment|inquiry)["']/i.test(html);
  const emailInput = /<input[^>]*type=["']?email["']?/i.test(html);
  // Skip if only newsletter signup (email input + submit, no textarea/message)
  if (!hasTextarea && !hasMsgField) return null;
  if (emailInput || hasTextarea) return baseUrl;
  return null;
}

function findLinks(html, base) {
  // Extract /contact, /about, /write-for-us-style links from navigation/footer
  const linkRx = /href=["']([^"']+)["']/gi;
  const paths = new Set();
  let m;
  while ((m = linkRx.exec(html)) !== null) {
    const href = m[1];
    if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    try {
      const u = new URL(href, base);
      if (u.hostname !== new URL(base).hostname) continue;
      paths.add(u.pathname.replace(/\/$/, '') || '/');
    } catch {}
  }
  return paths;
}

const PAGE_ORDER = [
  // Tier 1 — Guest posts / contribute
  '/write-for-us', '/write-for-us/', '/writeforus', '/guest-post', '/guest-posts', '/guestpost',
  '/contribute', '/contributors', '/submissions', '/pitch', '/pitches',
  // Tier 3 — PR / advertise / sponsor
  '/advertise', '/advertising', '/sponsorship', '/sponsored-posts', '/sponsor',
  // Tier 5 — general contact
  '/contact', '/contact-us', '/contact/',
  // Team / about
  '/about', '/about-us', '/team', '/staff', '/editorial-team', '/our-team',
  // Press
  '/press', '/media', '/press-room', '/newsroom',
];

async function fetchPage(url, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, html: text, finalUrl: res.url };
  } catch (e) {
    return { ok: false, error: e.message, html: '' };
  } finally {
    clearTimeout(t);
  }
}

function isBotWall(status, html) {
  if (status === 403 || status === 429 || status === 503) return true;
  if (/cf-browser-verification|Just a moment|cf-chl-|cloudflare-challenge|Attention Required!/i.test(html)) return true;
  if (/Access Denied|blocked for security/i.test(html) && html.length < 5000) return true;
  if (/<body[^>]*>\s*<\/body>/i.test(html) && html.length < 3000) return true; // empty SPA
  return false;
}

async function enrichDomain(domain) {
  const base = `https://${domain}`;
  const allEmails = new Set();
  let contactFormUrl = null;
  let contactPageUrl = null;
  let status = 'no_contact';
  let notes = [];
  const pagesChecked = [];

  // Step 1 — homepage
  let home = await fetchPage(base + '/');
  if (!home.ok && home.status === undefined) {
    // Network error → try http
    home = await fetchPage('http://' + domain + '/');
  }
  if (home.status === 404 || (home.status >= 500 && home.status < 600)) {
    return { domain, status: 'dead', notes: `home ${home.status}`, email: null, contact_form_url: null };
  }
  if (isBotWall(home.status, home.html)) {
    return { domain, status: 'blocked', notes: `bot-wall on / (${home.status})`, email: null, contact_form_url: null };
  }
  if (!home.ok && !home.html) {
    return { domain, status: 'dead', notes: `home ${home.error || home.status}`, email: null, contact_form_url: null };
  }
  pagesChecked.push('/');

  // Extract from homepage
  const homeEmails = extractEmails(home.html, domain);
  homeEmails.forEach(e => allEmails.add(e));

  // Check if found high-tier already — early stop
  const checkBest = () => {
    if (allEmails.size === 0) return null;
    return bestEmail(Array.from(allEmails), domain);
  };

  let best = checkBest();
  if (best && best.tier <= 2) {
    return finalize(domain, best, null, '/', pagesChecked, notes);
  }

  // Step 2 — follow linked contact-style pages from homepage
  const homeLinks = findLinks(home.html, home.finalUrl || base);
  const candidates = [];
  for (const p of PAGE_ORDER) {
    if (homeLinks.has(p)) candidates.push(p);
  }
  // Also try common paths blindly (only first 2 if not linked)
  for (const p of ['/contact', '/about', '/write-for-us']) {
    if (!candidates.includes(p)) candidates.push(p);
  }

  // Limit to 2 additional pages (total 3 per domain per rules)
  const toFetch = candidates.slice(0, 2);

  for (const path of toFetch) {
    const pageUrl = new URL(path, home.finalUrl || base).toString();
    const p = await fetchPage(pageUrl, 7000);
    pagesChecked.push(path);
    if (!p.ok) continue;
    if (isBotWall(p.status, p.html)) continue;

    const emails = extractEmails(p.html, domain);
    emails.forEach(e => allEmails.add(e));

    // Contact form detection on /contact style pages
    if (!contactFormUrl && /contact/i.test(path)) {
      const f = findContactFormUrl(p.html, pageUrl);
      if (f) { contactFormUrl = f; contactPageUrl = pageUrl; }
    }

    best = checkBest();
    if (best && best.tier <= 2) break;
  }

  best = checkBest();
  return finalize(domain, best, contactFormUrl, contactPageUrl, pagesChecked, notes);
}

function finalize(domain, best, formUrl, pageUrl, pages, notes) {
  const allExtras = notes.join(' | ');
  if (best) {
    return {
      domain,
      status: 'found',
      email: best.email,
      contact_form_url: null,
      contact_page_url: pageUrl || `https://${domain}/`,
      notes: `tier${best.tier}, pages: ${pages.join(',')}${allExtras ? ' | ' + allExtras : ''}`,
    };
  }
  if (formUrl) {
    return {
      domain,
      status: 'found',
      email: null,
      contact_form_url: formUrl,
      contact_page_url: pageUrl,
      notes: `contact-form, pages: ${pages.join(',')}${allExtras ? ' | ' + allExtras : ''}`,
    };
  }
  return {
    domain,
    status: 'no_contact',
    email: null,
    contact_form_url: null,
    contact_page_url: null,
    notes: `pages: ${pages.join(',')}${allExtras ? ' | ' + allExtras : ''}`,
  };
}

// ─── D1 interaction ───
async function getPendingDonors(tier, limit) {
  const url = `${API}/api/admin/donors/list?${tier ? `tier=${tier}&` : ''}status=pending&min_dr=0&min_overlap=0&limit=${limit}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } });
  const j = await res.json();
  return j.rows;
}

async function updateDonor(domain, fields, attempt = 1) {
  try {
    const res = await fetch(`${API}/api/admin/donors/${encodeURIComponent(domain)}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    if (!res.ok) console.error(`PUT ${domain}: ${res.status}`, await res.text());
  } catch (e) {
    if (attempt < 3) {
      await new Promise(r => setTimeout(r, 2000 * attempt));
      return updateDonor(domain, fields, attempt + 1);
    }
    console.error(`PUT ${domain} failed after ${attempt} attempts:`, e.message);
  }
}

// ─── Main ───
async function main() {
  const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const m = a.match(/^--([^=]+)=(.*)$/); return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
  }));

  const testMode = args.test ? parseInt(args.test, 10) : null;
  const tier = args.all ? null : (args.tier || 'priority');
  const batchSize = parseInt(args.batch || '10', 10);

  const donors = await getPendingDonors(tier, testMode || 10000);
  console.log(`Loaded ${donors.length} pending donors (tier=${tier || 'ALL'})`);

  const todo = testMode ? donors.slice(0, testMode) : donors;
  const stats = { found: 0, no_contact: 0, blocked: 0, dead: 0 };
  const results = [];
  const start = Date.now();

  for (let i = 0; i < todo.length; i += batchSize) {
    const batch = todo.slice(i, i + batchSize);
    const tBatch = Date.now();
    const batchResults = await Promise.all(batch.map(d => enrichDomain(d.domain).catch(e => ({
      domain: d.domain, status: 'dead', notes: `exception: ${e.message}`, email: null, contact_form_url: null,
    }))));

    // Write to D1
    await Promise.all(batchResults.map(r => updateDonor(r.domain, {
      email: r.email,
      contact_form_url: r.contact_form_url,
      contact_page_url: r.contact_page_url || null,
      status: r.status,
      notes: r.notes,
    })));

    for (const r of batchResults) {
      stats[r.status] = (stats[r.status] || 0) + 1;
      results.push(r);
    }
    const dt = ((Date.now() - tBatch) / 1000).toFixed(1);
    console.log(`  batch ${Math.floor(i/batchSize)+1}/${Math.ceil(todo.length/batchSize)}: ${batch.length} domains, ${dt}s — running stats:`, stats);

    if (i + batchSize < todo.length) await new Promise(r => setTimeout(r, 3000));
  }

  const dtTotal = ((Date.now() - start) / 1000).toFixed(0);
  console.log(`\nDone ${todo.length} domains in ${dtTotal}s`);
  console.table(stats);

  // Sample output (test mode)
  if (testMode) {
    console.log('\n── Sample results ──');
    for (const r of results) {
      const col = r.status === 'found' ? '\x1b[32m' : r.status === 'no_contact' ? '\x1b[90m' : '\x1b[31m';
      console.log(`${col}${r.domain.padEnd(32)} ${r.status.padEnd(12)}\x1b[0m ${r.email || r.contact_form_url || '—'}`);
      if (r.notes) console.log(`  ${'\x1b[90m'}${r.notes}${'\x1b[0m'}`);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
