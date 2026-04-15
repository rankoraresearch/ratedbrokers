// Sprint A production — Playwright+stealth on blocked + no_contact DR≥50
// Usage: node scripts/enrich-donors-headless.mjs [--test=N] [--concurrency=5]
import fs from 'fs';
import { chromium as chromiumRaw } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
chromiumRaw.use(stealth());

process.on('unhandledRejection', (err) => {
  // Swallow Playwright stealth race conditions ("Target page...has been closed")
  if (err && err.message && /Target page, context or browser has been closed|has been closed/i.test(err.message)) return;
  console.error('unhandledRejection:', err?.message || err);
});

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

// ─── Extraction (copy from headless-test) ───
const TIER_PATTERNS = [
  { tier: 1, weight: 100, rx: /^(guest[-_.]?posts?|contribut(e|ing|or)|submissions?|writers?|pitches?)@/i },
  { tier: 2, weight: 80,  rx: /^(editor(s|ial)?|content|newsroom|editorinchief)@/i },
  { tier: 3, weight: 60,  rx: /^(pr|press|media|publicity|communications?|comms?)@/i },
  { tier: 4, weight: 50,  rx: /^(partnerships?|outreach|business|bd|collab(oration)?|biz|marketing|commercial|advertising|sales)@/i },
  { tier: 5, weight: 30,  rx: /^(info|contact|hello|team|admin|support|enquiries|general|subscriptions)@/i },
];
const BAD_LOCAL = /^(noreply|no-?reply|donotreply|do-?not-?reply|postmaster|abuse|webmaster|mailer-daemon|bounce|notifications?)@/i;
const EMAIL_RX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const SHORT_LEGIT = new Set(['pr','bd','hr','cs','it','hi','cx','qa']);
const VALID_TLDS = new Set(['com','net','org','io','co','info','biz','name','me','us','app','dev','ai','xyz','tech','online','site','store','blog','news','pro','agency','email','media','tv','cc','club','today','digital','finance','money','wiki','uk','de','fr','es','it','nl','pl','ca','au','nz','ie','ch','se','no','dk','fi','be','at','cz','pt','gr','ro','ru','ua','by','kz','jp','cn','kr','in','sg','hk','tw','my','th','vn','id','ph','ae','sa','il','tr','za','eg','br','mx','ar','cl','co','pe','ve','uy','ng','ke','ma','tn','dz','gh','tz','ug','zw','bg','hu','sk','si','hr','rs','lt','lv','ee','is','lu','mt','cy','li','mc','sm','va','mk','me','ba','al','md','am','ge','az','kg','uz','tm','tj','mn','kh','la','mm','bd','lk','np','pk','af','iq','ir','sy','jo','lb','ye','om','qa','bh','kw','ps','edu','gov','mil','ac','int','eu','asia','africa']);
const PLACEHOLDER_LOCAL = /^(john|jane|john\.doe|jane\.doe|test|example|sample|foo|bar|demo|user|name|your|yourname|firstname|lastname|admin123|\d+)$/i;
const PLACEHOLDER_HOST = /^(example|test|domain|yoursite|yourdomain|mail|email|site|placeholder|acme)\.(com|org|net|io|co)$/i;
const MONITORING_HOSTS = /(\.|^)(sentry|datadoghq|logrocket|bugsnag|newrelic|rollbar|mixpanel|amplitude|segment)\.(io|com|app)$/i;

function looksLikeRealEmail(email) {
  const m = email.match(/^([^@]+)@([^@]+)$/);
  if (!m) return false;
  const local = m[1].toLowerCase();
  const host = m[2].toLowerCase();
  const hostParts = host.split('.');
  if (hostParts.length < 2) return false;
  const tld = hostParts[hostParts.length - 1];
  if (!VALID_TLDS.has(tld)) return false;
  for (const p of hostParts) {
    if (!p || p.length > 63) return false;
    if (/^\d+x$/.test(p)) return false;
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(p)) return false;
  }
  if (/^(d|k|a|w|s|e|n|i|t|u|r|st|th|ch|en|de|fr|navig|consent|intern|dashboard|document|window|event)$/.test(local)) return false;
  if (local.length < 3 && !SHORT_LEGIT.has(local)) return false;
  if (!/[a-z]/i.test(local)) return false;
  if (/\b(www\.){2,}/i.test(host)) return false;
  for (let i = 0; i < hostParts.length - 1; i++) {
    if (hostParts[i] === hostParts[i+1] && hostParts[i].length > 1) return false;
  }
  if (PLACEHOLDER_LOCAL.test(local)) return false;
  if (PLACEHOLDER_HOST.test(host)) return false;
  if (MONITORING_HOSTS.test(host)) return false;
  if (/^u[0-9a-f]{3,4}/i.test(local)) return false;  // unicode escape prefix
  if (/\.(png|jpg|jpeg|gif|svg|webp|css|js|min|ico|woff|ttf|map|json)\b/i.test(host)) return false;
  return true;
}
function cleanHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
}
function decodeCF(hex) { if (!hex || hex.length < 4) return null; const key = parseInt(hex.substr(0,2),16); let out=''; for (let i=2;i<hex.length;i+=2) out += String.fromCharCode(parseInt(hex.substr(i,2),16)^key); return out; }
function extractEmails(html, baseDomain) {
  const found = new Set();
  const mailtoRx = /mailto:([^\s"'?&<>]+)/gi; let mt;
  while ((mt = mailtoRx.exec(html)) !== null) { const e = decodeURIComponent(mt[1]).trim().toLowerCase(); if (/^[^@]+@[^@]+\.[^@]+$/.test(e)) found.add(e); }
  const cfRx = /data-cfemail="([a-f0-9]+)"/gi; let cf;
  while ((cf = cfRx.exec(html)) !== null) { const d = decodeCF(cf[1]); if (d && /^[^@]+@[^@]+\.[^@]+$/.test(d)) found.add(d.toLowerCase()); }
  const text = cleanHtml(html).replace(/<[^>]+>/g, ' ');
  const matches = text.match(EMAIL_RX) || [];
  for (const m of matches) found.add(m.toLowerCase());
  return Array.from(found).filter(e => !BAD_LOCAL.test(e) && looksLikeRealEmail(e));
}
function scoreEmail(email, baseDomain) {
  for (const t of TIER_PATTERNS) if (t.rx.test(email)) return { tier: t.tier, weight: t.weight + (email.endsWith('@'+baseDomain) ? 10 : 0) };
  if (email.endsWith('@'+baseDomain) || email.endsWith('.'+baseDomain)) {
    if (/^[a-z]+[._][a-z]+@/.test(email)) return { tier: 2, weight: 70 };
    return { tier: 5, weight: 35 };
  }
  return { tier: 9, weight: 5 };
}
function bestEmail(emails, baseDomain) { if (!emails.length) return null; const s = emails.map(e => ({ email: e, ...scoreEmail(e, baseDomain) })); s.sort((a,b)=>b.weight-a.weight); return s[0]; }

function findContactFormUrl(html, baseUrl) {
  const hasForm = /<form[^>]*>/i.test(html);
  if (!hasForm) return null;
  const hasTextarea = /<textarea/i.test(html);
  const hasMsg = /name=["'](?:message|msg|comment|inquiry)["']/i.test(html);
  if (!hasTextarea && !hasMsg) return null;
  return baseUrl;
}

// ─── Playwright visit ───
async function enrichDomain(context, domain) {
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  const result = { domain, emails: new Set(), contactForm: null, pages: [], status: 'no_contact' };
  let homeStatus = null;

  async function visit(url) {
    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 12000 });
      const status = res ? res.status() : 0;
      await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
      const html = await page.content();
      result.pages.push(`${url.replace('https://' + domain, '')}→${status}`);
      return { status, html, url };
    } catch (e) {
      result.pages.push(`${url.replace('https://' + domain, '')}→err`);
      return { status: 0, html: '', url };
    }
  }

  try {
    const home = await visit(`https://${domain}/`);
    homeStatus = home.status;
    if (home.html) for (const e of extractEmails(home.html, domain)) result.emails.add(e);

    // Early exit: if home is hard-blocked, don't waste time on sub-pages
    const homeBlocked = homeStatus === 403 || homeStatus === 429 || homeStatus === 503;
    const homeDead = homeStatus === 404 || homeStatus === 0 || (homeStatus >= 500 && homeStatus !== 503);

    const best0 = bestEmail(Array.from(result.emails), domain);
    if (!homeBlocked && !homeDead && (!best0 || best0.tier > 2)) {
      for (const path of ['/contact', '/contact-us', '/about', '/write-for-us']) {
        const p = await visit(`https://${domain}${path}`);
        if (p.html && p.status !== 403 && p.status !== 429) {
          for (const e of extractEmails(p.html, domain)) result.emails.add(e);
          if (!result.contactForm) result.contactForm = findContactFormUrl(p.html, p.url);
        }
        const best = bestEmail(Array.from(result.emails), domain);
        if (best && best.tier <= 2) break;
      }
    }

    const best = bestEmail(Array.from(result.emails), domain);
    if (best) result.status = 'found';
    else if (result.contactForm) result.status = 'found';
    else if (homeStatus === 403 || homeStatus === 429) result.status = 'blocked';
    else if (homeStatus === 404 || homeStatus >= 500 || homeStatus === 0) result.status = 'dead';
    else result.status = 'no_contact';
    result.best = best;
  } catch (e) {
    result.status = 'dead';
    result.error = e.message.slice(0, 80);
  } finally {
    try { await page.close(); } catch {}
  }
  return result;
}

async function updateDonor(domain, fields, attempt = 1) {
  try {
    const res = await fetch(`${API}/api/admin/donors/${encodeURIComponent(domain)}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    if (!res.ok) console.error(`PUT ${domain}: ${res.status}`);
  } catch (e) {
    if (attempt < 3) { await new Promise(r => setTimeout(r, 2000 * attempt)); return updateDonor(domain, fields, attempt + 1); }
    console.error(`PUT ${domain} failed:`, e.message);
  }
}

async function getTargets(testN) {
  // blocked + no_contact DR≥50
  const [blocked, noContact] = await Promise.all([
    fetch(`${API}/api/admin/donors/list?status=blocked&limit=2000`, { headers: { Authorization: `Bearer ${KEY}` } }).then(r => r.json()),
    fetch(`${API}/api/admin/donors/list?status=no_contact&min_dr=50&limit=2000`, { headers: { Authorization: `Bearer ${KEY}` } }).then(r => r.json()),
  ]);
  const combined = [...blocked.rows, ...noContact.rows];
  const sorted = combined.sort((a, b) => (b.max_dr || 0) - (a.max_dr || 0));
  return testN ? sorted.slice(0, testN) : sorted;
}

async function main() {
  const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const m = a.match(/^--([^=]+)=(.*)$/); return m ? [m[1], m[2]] : [a.replace(/^--/,''), true];
  }));
  const testN = args.test ? parseInt(args.test, 10) : null;
  const conc = parseInt(args.concurrency || '5', 10);

  const targets = await getTargets(testN);
  console.log(`Targets: ${targets.length} (${testN ? 'TEST' : 'FULL'})  concurrency: ${conc}`);

  const browser = await chromiumRaw.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
    locale: 'en-US',
  });

  const stats = { found: 0, no_contact: 0, blocked: 0, dead: 0, upgraded: 0 };
  const start = Date.now();

  for (let i = 0; i < targets.length; i += conc) {
    const batch = targets.slice(i, i + conc);
    const t0 = Date.now();
    const results = await Promise.all(batch.map(d => {
      // Hard timeout 35s per domain (regardless of what Playwright is doing)
      return Promise.race([
        enrichDomain(context, d.domain),
        new Promise(resolve => setTimeout(() => resolve({
          domain: d.domain, status: 'blocked', pages: ['timeout'], best: null, contactForm: null, error: 'hard-timeout-35s',
        }), 35000)),
      ]).catch(e => ({
        domain: d.domain, status: 'dead', pages: [], best: null, contactForm: null, error: e.message,
      }));
    }));

    await Promise.all(results.map(r => {
      const wasPrev = batch.find(b => b.domain === r.domain);
      const upgrade = wasPrev && wasPrev.status !== r.status && r.status === 'found';
      if (upgrade) stats.upgraded++;
      stats[r.status]++;
      return updateDonor(r.domain, {
        email: r.best ? r.best.email : null,
        contact_form_url: !r.best && r.contactForm ? r.contactForm : null,
        contact_page_url: r.best ? `https://${r.domain}/` : (r.contactForm || null),
        status: r.status,
        notes: `[headless] pages: ${r.pages.join(',')}${r.best ? ` | tier${r.best.tier}` : ''}`,
      });
    }));

    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    const pct = (((i + batch.length) / targets.length) * 100).toFixed(1);
    console.log(`  batch ${Math.floor(i/conc)+1}/${Math.ceil(targets.length/conc)}: ${batch.length}d ${dt}s [${pct}%] — upgraded:${stats.upgraded} found:${stats.found}`);
  }

  await browser.close();
  const totalS = ((Date.now() - start) / 1000).toFixed(0);
  console.log(`\nDone ${targets.length} domains in ${totalS}s`);
  console.table(stats);
}
main().catch(e => { console.error(e); process.exit(1); });
