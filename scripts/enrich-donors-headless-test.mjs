// Sprint A hypothesis test — Playwright headless + stealth
import { chromium as chromiumRaw } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
chromiumRaw.use(stealth());
const chromium = chromiumRaw;

// Reuse core extraction logic from enrich-donors.mjs
const TIER_PATTERNS = [
  { tier: 1, weight: 100, rx: /^(guest[-_.]?posts?|contribut(e|ing|or)|submissions?|writers?|pitches?)@/i },
  { tier: 2, weight: 80,  rx: /^(editor(s|ial)?|content|newsroom)@/i },
  { tier: 3, weight: 60,  rx: /^(pr|press|media|publicity|communications?|comms?)@/i },
  { tier: 4, weight: 50,  rx: /^(partnerships?|outreach|business|bd|collab(oration)?|biz|marketing)@/i },
  { tier: 5, weight: 30,  rx: /^(info|contact|hello|team|admin|support|enquiries|general)@/i },
];
const BAD_LOCAL = /^(noreply|no-?reply|donotreply|do-?not-?reply|postmaster|abuse|webmaster|mailer-daemon|bounce|notifications?)@/i;
const EMAIL_RX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const SHORT_LEGIT = new Set(['pr','bd','hr','cs','it','hi','cx','qa']);
const VALID_TLDS = new Set(['com','net','org','io','co','info','biz','name','me','us','app','dev','ai','xyz','tech','online','site','store','blog','news','pro','agency','email','media','tv','cc','club','today','digital','finance','money','wiki','uk','de','fr','es','it','nl','pl','ca','au','nz','ie','ch','se','no','dk','fi','be','at','cz','pt','gr','ro','ru','ua','by','kz','jp','cn','kr','in','sg','hk','tw','my','th','vn','id','ph','ae','sa','il','tr','za','eg','br','mx','ar','cl','co','pe','ve','uy','ng','ke','ma','tn','dz','gh','tz','ug','zw','bg','hu','sk','si','hr','rs','lt','lv','ee','is','lu','mt','cy','li','mc','sm','va','mk','me','ba','al','md','am','ge','az','kg','uz','tm','tj','mn','kh','la','mm','bd','lk','np','pk','af','iq','ir','sy','jo','lb','ye','om','qa','bh','kw','ps','edu','gov','mil','ac','int','eu','asia','africa']);

const PLACEHOLDER_LOCAL = /^(john|jane|john\.doe|jane\.doe|test|example|sample|foo|bar|demo|user|name|your|yourname|firstname|lastname|admin123|\d+)$/i;
const PLACEHOLDER_HOST = /^(example|test|domain|yoursite|yourdomain|mail|email|site|placeholder|acme)\.(com|org|net|io|co)$/i;

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
  // Placeholder filters
  if (PLACEHOLDER_LOCAL.test(local)) return false;
  if (PLACEHOLDER_HOST.test(host)) return false;
  if (/^\w{1,3}$/.test(local) && !SHORT_LEGIT.has(local)) return false;
  // Common JS/CSS artifacts to filter
  if (/\.(png|jpg|jpeg|gif|svg|webp|css|js|min|ico|woff|ttf|map|json)\b/i.test(host)) return false;
  return true;
}

function cleanHtml(html) {
  // Keep <script type="application/ld+json"> (structured data) and content inside <script> (React initial state often has contact info)
  // Remove only <style>, <noscript>, <svg>, comments
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

// ─── Playwright ───
const TEST_DOMAINS = [
  // blocked by Cloudflare in v1
  { domain: 'vantagemarkets.com', prev: 'blocked' },
  { domain: 'muckrack.com', prev: 'blocked' },
  { domain: 'beincrypto.com', prev: 'blocked' },
  { domain: 'forexfactory.com', prev: 'blocked' },
  { domain: 'iau.ir', prev: 'blocked' },
  // no_contact with high DR (JS-heavy suspects)
  { domain: 'aol.com', prev: 'no_contact', dr: 91 },
  { domain: 'crunchbase.com', prev: 'no_contact', dr: 91 },
  { domain: 'github.io', prev: 'no_contact', dr: 94 },
  { domain: 'hackernoon.com', prev: 'no_contact', dr: 87 },
  { domain: 'seekingalpha.com', prev: 'no_contact', dr: 91 },
];

async function visitWithPlaywright(context, domain) {
  const results = { domain, emails: new Set(), pagesChecked: [], error: null };
  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  async function visit(url) {
    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      if (!res) { results.pagesChecked.push(`${url}→no-res`); return null; }
      const status = res.status();
      // Accept even 403 HTML — sometimes contact info is still there
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      const html = await page.content();
      results.pagesChecked.push(`${url}→${status}`);
      return html;
    } catch (e) {
      results.pagesChecked.push(`${url}→err:${e.message.slice(0,30)}`);
      return null;
    }
  }

  try {
    const homeHtml = await visit(`https://${domain}/`);
    if (homeHtml) {
      for (const e of extractEmails(homeHtml, domain)) results.emails.add(e);
    }
    // Best-guess contact pages
    if (results.emails.size === 0) {
      for (const path of ['/contact', '/about', '/write-for-us']) {
        const h = await visit(`https://${domain}${path}`);
        if (h) for (const e of extractEmails(h, domain)) results.emails.add(e);
        if (results.emails.size > 0) break;
      }
    }
  } catch (e) {
    results.error = e.message;
  } finally {
    await page.close();
  }
  return results;
}

async function main() {
  console.log(`Launching Chromium (headless)…`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
    locale: 'en-US',
  });

  const results = [];
  const start = Date.now();
  for (const t of TEST_DOMAINS) {
    const tStart = Date.now();
    const r = await visitWithPlaywright(context, t.domain);
    const dt = ((Date.now() - tStart) / 1000).toFixed(1);
    const emails = Array.from(r.emails);
    const best = bestEmail(emails, t.domain);
    results.push({ ...t, ...r, emails, best, dt });
    const color = best ? '\x1b[32m' : '\x1b[90m';
    console.log(`${color}${t.domain.padEnd(26)} prev=${t.prev.padEnd(11)} [${dt}s] ${best ? `tier${best.tier} ${best.email}` : 'nothing'}\x1b[0m`);
    if (emails.length > 1) console.log(`  ${'\x1b[90m'}all: ${emails.join(', ')}${'\x1b[0m'}`);
    if (r.pagesChecked.length) console.log(`  ${'\x1b[90m'}pages: ${r.pagesChecked.join(' ')}${'\x1b[0m'}`);
  }

  await browser.close();
  const totalS = ((Date.now() - start) / 1000).toFixed(0);
  console.log(`\nDone ${TEST_DOMAINS.length} domains in ${totalS}s`);
  const found = results.filter(r => r.best).length;
  console.log(`Found: ${found} / ${TEST_DOMAINS.length}`);
}
main().catch(e => { console.error(e); process.exit(1); });
