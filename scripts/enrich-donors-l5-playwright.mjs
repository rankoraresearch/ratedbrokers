// scripts/enrich-donors-l5-playwright.mjs
// L5: Playwright headless Chromium for status=blocked donors (CF challenge sites).
// Renders JS, waits for CF clearance cookie, then extracts HTML + feeds to codex.
// Shares scoring rules with L3 pipeline.
//
// Usage:
//   node scripts/enrich-donors-l5-playwright.mjs --limit=20 --test           # pilot
//   node scripts/enrich-donors-l5-playwright.mjs --limit=200                 # batch
//   node scripts/enrich-donors-l5-playwright.mjs --audit=10                  # codex audit

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { chromium } from 'playwright';

try {
  const env = fs.readFileSync('.env', 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const API = process.env.API_BASE || 'https://api.ratedbrokers.com';
const KEY = process.env.ADMIN_API_KEY;
if (!KEY) { console.error('ADMIN_API_KEY missing — set via env'); process.exit(1); }

const argv = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v === undefined ? true : v];
}));
const LIMIT = parseInt(argv.limit || '5');
const START = parseInt(argv.start || '0');

const STAGING = '/tmp/l5-results.json';
const LOG = '/tmp/l5-run.log';
const PRIORITY_ROWS_FILE = '/tmp/l5-blocked-rows.json';

const INFRA_DOMAINS = new Set([
  'wordpress.org','wordpress.com','squarespace.com','wixsite.com','webflow.io','ghost.io',
  'github.io','gitlab.io','bitbucket.io','sourceforge.net','blogspot.com','tumblr.com','medium.com','substack.com',
  'bsky.app','telegram.me','t.me','youtube.com','facebook.com','instagram.com','linkedin.com','pinterest.com',
  'reddit.com','discord.com','tiktok.com','vk.com','weibo.com','threads.net','mastodon.social',
  'cloudflare.com','amazonaws.com','cloudfront.net','fastly.net','akamai.net','jsdelivr.net','unpkg.com',
  'msn.com','bing.com','yahoo.com','google.com','baidu.com','apple.com','samsung.com','microsoft.com','amazon.com','ebay.com',
  'aol.com','icloud.com','protonmail.com','proton.me',
]);

function log(msg) {
  const ts = new Date().toISOString().slice(11, 19);
  const line = `[${ts}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
}

function loadStaging() {
  try { return JSON.parse(fs.readFileSync(STAGING, 'utf8')); } catch { return []; }
}

function saveStaging(data) {
  fs.writeFileSync(STAGING, JSON.stringify(data, null, 2));
}

// ─── Playwright fetcher ───────────────────────────────────────────────────

let browserInstance = null;
async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--no-sandbox',
      ],
    });
  }
  return browserInstance;
}

async function fetchWithBrowser(url, timeoutMs = 25000) {
  const browser = await getBrowser();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
  });
  // Remove webdriver flag to bypass basic bot detection
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = await context.newPage();
  try {
    const response = await page.goto(url, { timeout: timeoutMs, waitUntil: 'domcontentloaded' });
    // If CF challenge detected, wait for it to clear
    const initialTitle = await page.title().catch(() => '');
    if (/just a moment|attention required|checking your browser|cloudflare/i.test(initialTitle)) {
      try { await page.waitForFunction(() => !/just a moment|checking your browser/i.test(document.title), { timeout: 15000 }); } catch {}
    }
    // Wait a bit for CF cookies to set
    await page.waitForTimeout(1500);
    const html = await page.content();
    const status = response?.status() || 0;
    await context.close();
    return { html, status, finalUrl: page.url() };
  } catch (e) {
    await context.close().catch(() => {});
    return { error: e.message.slice(0, 200) };
  }
}

// ─── Clean HTML (shared with L3) ──────────────────────────────────────────

function cleanHtml(html, maxLen = 12000) {
  if (!html) return '';
  let s = html;
  const preserved = [];
  s = s.replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, (_, body) => {
    preserved.push('JSONLD:' + body.replace(/\s+/g, ' ').slice(0, 3000));
    return '';
  });
  s = s.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (_, body) => {
    const emails = body.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    return emails && emails.length ? ' ' + emails.slice(0, 5).join(' ') + ' ' : '';
  });
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  if (preserved.length) s = preserved.join(' | ') + ' | ' + s;
  if (s.length > maxLen) s = s.slice(0, maxLen * 0.7) + ' ... [TRUNCATED] ... ' + s.slice(-maxLen * 0.3);
  return s;
}

function decodeCfemailInHtml(html) {
  return html.replace(/data-cfemail=["']([a-f0-9]+)["']/gi, (m, hex) => {
    try {
      const r = parseInt(hex.substr(0, 2), 16);
      let out = '';
      for (let i = 2; i < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.substr(i, 2), 16) ^ r);
      return `data-cfemail="${hex}" CF_DECODED:${out}`;
    } catch { return m; }
  });
}

function discoverContactLinks(html, baseUrl) {
  if (!html) return [];
  const base = new URL(baseUrl);
  const links = new Map();
  const linkRe = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    let href = m[1].trim();
    const anchor = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    let abs;
    try { abs = new URL(href, base).href; } catch { continue; }
    const urlObj = new URL(abs);
    if (urlObj.host !== base.host && urlObj.host !== 'www.' + base.host.replace(/^www\./, '') && 'www.' + urlObj.host !== base.host) continue;
    const label = anchor + ' ' + abs.toLowerCase();
    let priority = 0;
    if (/write[-_ ]?for[-_ ]?us|guest[-_ ]?post|submissions?|contribute/.test(label)) priority = 90;
    else if (/press[-_ ]?room|media[-_ ]?kit|press[-_ ]?inquir/.test(label)) priority = 80;
    else if (/contact[-_ ]?us/.test(label)) priority = 70;
    else if (/\bcontact\b/.test(label)) priority = 60;
    else if (/editorial[-_ ]?team|editorial[-_ ]?staff/.test(label)) priority = 55;
    else if (/about[-_ ]?us/.test(label)) priority = 45;
    else if (/\babout\b/.test(label)) priority = 40;
    else if (/\bteam\b|staff/.test(label)) priority = 35;
    else continue;
    if (!links.has(abs) || links.get(abs) < priority) links.set(abs, priority);
  }
  return [...links.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([url]) => url);
}

// ─── Codex prompt (same as L3, tightened) ─────────────────────────────────

const CODEX_PROMPT = `# Task: Extract the best outreach email from donor website HTML

You are reading HTML from a donor website (Playwright-rendered, post-JS). Find emails visible in the HTML text and pick the BEST one for outreach. If no email but a form exists, return form URL.

## CRITICAL RULES
1. NEVER invent/guess emails. Only return what literally appears.
2. Include EXACT quote from HTML (≤120 chars) for each email.
3. If NO email → {"status": "no_email_visible"} (form URL still ok).
4. \`CF_DECODED:xxx@yyy\` = valid decoded Cloudflare emails.

## PRIORITY (pick highest)
1. guest: guestposts@, contribute@, submissions@, writers@
2. general: info@, contact@, hello@, team@, office@, biuro@, kontakt@
3. editor/pr: editor@, editorial@, press@, pr@, newsroom@, content@, news@, media@, redazione@, redaktion@, redakcja@
4. partnerships: partnerships@, outreach@, business@, bd@, partners@
5. personal (john.smith@) — ONLY if HTML explicitly labels person as editor/journalist. By default SKIP.

## HARD REJECT
- support/help/service/customer-service/care
- sales/adsales/ads/advertising/marketing/licensing/affiliate
- jobs/careers/hr/recruit
- reservas/booking/orders/shipping/returns/refunds
- billing/legal/privacy/finance/tax/compliance/dmca
- noreply/webmaster/postmaster/abuse/unsubscribe
- corrections/letters/feedback/tips/accuracy/amend/comment
- visit/schedule/register/campus/admissions/tour/donate/donations
- admin@/ca@ (operational)
- **Email on 3rd-party domain** ≠ donor → REJECT
- gmail/yahoo/outlook/hotmail/icloud as primary → REJECT
- Nicknames/aliases without editorial role → REJECT (e.g. grouchy@)

## JSON-LD contactType CHECK
If ContactPoint has \`"contactType":"sales"\` or \`"customer service"\` near the email → REJECT.

## CONTEXT CHECK
Snippet with "letters to editor / feedback / corrections / customer service / campus visit / booking / reservation / donation / fundraising" → REJECT that email.

## Personal-name CAUTION
Organization.email JSON-LD alone is NOT enough to accept firstname.lastname@. Skip unless explicit "Editor: Jane Doe" label in HTML.

## DONOR DOMAIN: {{DOMAIN}}

## OUTPUT (strict JSON, NO markdown fences)
{
  "status": "found" | "no_email_visible" | "form_only" | "blocked",
  "emails_found": [{"email":"x@y","role_label":"...","quote":"...","tier":"guest|general|editor|pr|partnerships|personal"}],
  "best_pick": "x@y" | null,
  "best_pick_reason": "≤150 chars",
  "contact_form_url": "https://..." | null,
  "notes": "≤200 chars"
}

Return ONLY JSON.

## HTML TO ANALYZE

`;

async function runCodex(domain, html) {
  const promptBody = CODEX_PROMPT.replace(/\{\{DOMAIN\}\}/g, domain) + html;
  return new Promise((resolve) => {
    const proc = spawn('codex', ['exec', '--skip-git-repo-check', '--cd', '/Users/yegorbarakovskiy/Desktop/ratedbrokers'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let out = '', err = '';
    proc.stdout.on('data', d => out += d.toString());
    proc.stderr.on('data', d => err += d.toString());
    const timeout = setTimeout(() => proc.kill('SIGKILL'), 180000);
    proc.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0 && !out) return resolve({ error: 'codex_fail', stderr: err.slice(0, 500) });
      const m = out.match(/\{[\s\S]*\}/);
      if (!m) return resolve({ error: 'no_json_in_output', raw: out.slice(-500) });
      try { return resolve({ parsed: JSON.parse(m[0]) }); }
      catch { return resolve({ error: 'json_parse_fail', raw: m[0].slice(0, 500) }); }
    });
    proc.stdin.write(promptBody);
    proc.stdin.end();
  });
}

function verifyEmailInHtml(email, html) {
  const emailLower = email.toLowerCase();
  const htmlLower = html.toLowerCase();
  if (htmlLower.includes(emailLower)) return 'direct';
  if (htmlLower.includes('cf_decoded:' + emailLower)) return 'cf_decoded';
  return false;
}

// ─── Process one domain ────────────────────────────────────────────────────

async function processDomain(row) {
  const { domain, max_dr, overlap, tier } = row;
  log(`→ ${domain} (DR${max_dr}, ov${overlap})`);

  if (INFRA_DOMAINS.has(domain)) {
    log(`  skipped: infra`);
    return { domain, max_dr, overlap, tier, status: 'skipped_infra', ts: new Date().toISOString() };
  }

  const result = {
    domain, max_dr, overlap, tier,
    ts: new Date().toISOString(),
    attempts: [],
    best_pick: null,
    contact_form_url: null,
    status: 'no_contact',
    method: 'playwright',
  };

  // 1) Fetch homepage via Playwright
  let homepageHtml = null;
  let homepageUrl = null;
  for (const homeTry of [`https://www.${domain}/`, `https://${domain}/`]) {
    const r = await fetchWithBrowser(homeTry);
    result.attempts.push({ url: homeTry, status: r.status, error: r.error, result: r.error ? 'fetch_fail' : r.status >= 400 ? 'http_error' : 'fetched' });
    if (!r.error && r.status < 400 && r.html) {
      homepageHtml = r.html;
      homepageUrl = r.finalUrl || homeTry;
      break;
    }
  }

  if (!homepageHtml) {
    result.status = 'dead';
    result.notes = 'playwright failed on homepage';
    return result;
  }

  // 2) Discover contact links from homepage
  const discovered = discoverContactLinks(homepageHtml, homepageUrl);
  let combinedHtml = `\n\n=== SOURCE: ${homepageUrl} ===\n${cleanHtml(decodeCfemailInHtml(homepageHtml), 4000)}`;
  let fetchedCount = 1;
  const seen = new Set([homepageUrl]);

  for (const url of discovered) {
    if (fetchedCount >= 3) break;
    if (seen.has(url)) continue;
    seen.add(url);
    const r = await fetchWithBrowser(url);
    result.attempts.push({ url, status: r.status, error: r.error, result: r.error ? 'fetch_fail' : r.status >= 400 ? 'http_error' : 'fetched' });
    if (r.error || r.status >= 400) continue;
    combinedHtml += `\n\n=== SOURCE: ${url} ===\n${cleanHtml(decodeCfemailInHtml(r.html), 5000)}`;
    fetchedCount++;
  }

  // 3) Codex extraction
  const codexResult = await runCodex(domain, combinedHtml.slice(0, 14000));
  if (codexResult.error) {
    result.status = 'codex_error';
    result.notes = codexResult.error;
    return result;
  }

  const parsed = codexResult.parsed;
  result.codex_status = parsed.status;
  result.codex_raw = parsed;

  if (parsed.status === 'no_email_visible' || !parsed.best_pick) {
    result.status = parsed.contact_form_url ? 'found' : 'no_contact';
    if (parsed.contact_form_url) result.contact_form_url = parsed.contact_form_url;
    return result;
  }

  const picked = parsed.best_pick.toLowerCase().trim();
  const verif = verifyEmailInHtml(picked, combinedHtml);
  if (!verif) {
    log(`  ⚠ hallucination: ${picked} not in HTML`);
    result.status = 'hallucination_rejected';
    result.notes = `codex picked ${picked} but not found in HTML`;
    return result;
  }

  const emailDomain = picked.split('@')[1];
  if (emailDomain && !emailDomain.endsWith(domain) && !domain.endsWith(emailDomain)) {
    log(`  ⚠ domain mismatch: ${picked}`);
    result.status = 'domain_mismatch_rejected';
    result.notes = `different domain: ${picked}`;
    return result;
  }

  result.best_pick = picked;
  result.best_pick_reason = parsed.best_pick_reason;
  result.tier_label = parsed.emails_found?.find(e => e.email.toLowerCase() === picked)?.tier || null;
  result.quote = parsed.emails_found?.find(e => e.email.toLowerCase() === picked)?.quote || null;
  result.verification = verif;
  result.contact_form_url = parsed.contact_form_url || null;
  result.status = 'found';
  log(`  ✓ ${picked} (${result.tier_label}, verified=${verif})`);
  return result;
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const rows = JSON.parse(fs.readFileSync(PRIORITY_ROWS_FILE, 'utf8'));
  const staging = loadStaging();
  const done = new Set(staging.map(r => r.domain));
  const todo = rows.slice(START).filter(r => !done.has(r.domain)).slice(0, LIMIT);
  log(`[start] staging=${staging.length}, pool=${rows.length}, todo=${todo.length}`);

  for (let i = 0; i < todo.length; i++) {
    try {
      const result = await processDomain(todo[i]);
      staging.push(result);
      saveStaging(staging);
      log(`[progress] ${i + 1}/${todo.length} ${result.status}${result.best_pick ? ' — ' + result.best_pick : ''}${result.contact_form_url ? ' — form' : ''}`);
    } catch (e) {
      log(`[error] ${todo[i].domain}: ${e.message}`);
      staging.push({ domain: todo[i].domain, status: 'script_error', error: e.message, ts: new Date().toISOString() });
      saveStaging(staging);
    }
  }

  if (browserInstance) await browserInstance.close();
  const withEmail = staging.filter(r => r.status === 'found' && r.best_pick).length;
  const formOnly = staging.filter(r => r.status === 'found' && !r.best_pick).length;
  log(`[end] total=${staging.length} with_email=${withEmail} form_only=${formOnly}`);
}

main().catch(e => { log(`[fatal] ${e.message}\n${e.stack}`); if (browserInstance) browserInstance.close(); process.exit(1); });
