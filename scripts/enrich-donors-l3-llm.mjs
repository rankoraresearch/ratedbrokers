// scripts/enrich-donors-l3-llm.mjs
// L3: LLM-driven email extraction from priority no_contact donors.
// Pipeline:
//   1. Fetch /contact, /about, /team (3 pages max, stop on first found email)
//   2. Strip scripts/styles, trim to 12k chars
//   3. Pipe HTML to codex CLI with strict extraction prompt
//   4. Parse JSON response, validate email appears in HTML (anti-hallucination)
//   5. Apply ladder rules, pick best, write to staging JSON
//   6. After each batch of N: run codex audit on 10 random
//
// Staging: /tmp/l3-results.json (append-safe)
// Audit:   /tmp/l3-audit-*.json
// Log:     /tmp/l3-run.log
//
// Usage:
//   node scripts/enrich-donors-l3-llm.mjs --limit=20 --test          # pilot
//   node scripts/enrich-donors-l3-llm.mjs --start=20 --limit=100     # next batch
//   node scripts/enrich-donors-l3-llm.mjs --audit=10                 # codex audit 10 random from results

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const argv = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v === undefined ? true : v];
}));

const LIMIT = parseInt(argv.limit || '10');
const START = parseInt(argv.start || '0');
const TEST = argv.test;
const AUDIT = argv.audit;
const CONCURRENCY = parseInt(argv.concurrency || '1');   // parallel codex calls

const PRIORITY_ROWS_FILE = fs.existsSync('/tmp/l3-priority-rows-filtered.json') ? '/tmp/l3-priority-rows-filtered.json' : '/tmp/l3-priority-rows.json';
const PRIORITY_ROWS = JSON.parse(fs.readFileSync(PRIORITY_ROWS_FILE, 'utf8'));
const STAGING = '/tmp/l3-results.json';
const LOG = '/tmp/l3-run.log';

// Infra/CMS/blogging platforms + social + mega-portals — not real outreach targets.
const INFRA_DOMAINS = new Set([
  'wordpress.org','wordpress.com','squarespace.com','wixsite.com','webflow.io','ghost.io',
  'github.io','gitlab.io','bitbucket.io','sourceforge.net',
  'blogspot.com','tumblr.com','medium.com','substack.com','beehiiv.com','note.com','livejournal.com',
  'cloudflare.com','amazonaws.com','cloudfront.net','fastly.net','fastly.com','akamai.net','akamaized.net','jsdelivr.net','unpkg.com',
  'googleusercontent.com','appspot.com','herokuapp.com','vercel.app','netlify.app',
  'netdna-ssl.com','netdna-cdn.com','maxcdn.com','b-cdn.net','bunnycdn.com',
  'archive.org','web.archive.org',
  // Social platforms
  'bsky.app','telegram.me','t.me','youtube.com','youtu.be','twitter.com','x.com','facebook.com','fb.com','instagram.com','linkedin.com','pinterest.com','reddit.com','discord.com','discord.gg','tiktok.com','vk.com','weibo.com','threads.net','mastodon.social','tumbex.com','snapchat.com','whatsapp.com',
  // Mega portals / search engines
  'msn.com','bing.com','yahoo.com','duckduckgo.com','google.com','goo.gl','baidu.com','yandex.com','ask.com',
  // Corp / hardware
  'apple.com','samsung.com','microsoft.com','amazon.com','amzn.to','ebay.com','alibaba.com','aliexpress.com',
  // Domain registrars / dns
  'uk.com','us.com','eu.com','free.fr','tk.com',
  // Community / Q&A
  'goodreads.com','stackoverflow.com','quora.com','stackexchange.com',
  // Email providers (personal)
  'aol.com','protonmail.com','proton.me','icloud.com',
]);

function log(msg) {
  const ts = new Date().toISOString().slice(11, 19);
  const line = `[${ts}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
}

function loadStaging() {
  try { return JSON.parse(fs.readFileSync(STAGING, 'utf8')); }
  catch { return []; }
}

function saveStaging(data) {
  fs.writeFileSync(STAGING, JSON.stringify(data, null, 2));
}

function alreadyProcessed(domain, staging) {
  return staging.find(r => r.domain === domain);
}

// Fetch HTML with browser-like UA. Returns { html, status, finalUrl } or { error }.
async function fetchPage(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });
    clearTimeout(timer);
    const html = await res.text();
    return { html, status: res.status, finalUrl: res.url };
  } catch (e) {
    clearTimeout(timer);
    return { error: e.name === 'AbortError' ? 'timeout' : e.message };
  }
}

// Strip non-content scripts/styles/comments but PRESERVE JSON-LD and inline app data
// which often contain Organization.email / ContactPoint.email.
function cleanHtml(html, maxLen = 12000) {
  if (!html) return '';
  let s = html;

  // Extract and preserve JSON-LD + inline data blobs (emails often live here)
  const preserved = [];
  s = s.replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, (_, body) => {
    preserved.push('JSONLD:' + body.replace(/\s+/g, ' ').slice(0, 3000));
    return '';
  });
  // Extract Next.js / Nuxt / inline data contents that often have `"email":"..."`
  s = s.replace(/<script[^>]*id=["'](?:__NEXT_DATA__|__NUXT__|__INITIAL_STATE__|__APOLLO_STATE__)["'][^>]*>([\s\S]*?)<\/script>/gi, (_, body) => {
    // pull out any email patterns or structured contact bits
    const emails = body.match(/"email"\s*:\s*"[^"]+"|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi);
    if (emails) preserved.push('INLINE:' + emails.slice(0, 10).join(' ; '));
    return '';
  });
  // Generic inline script: keep only email-looking substrings
  s = s.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (_, body) => {
    const emails = body.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    if (emails && emails.length) return ' ' + emails.slice(0, 5).join(' ') + ' ';
    return '';
  });
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/\s+/g, ' ').trim();

  // Prepend preserved JSON-LD / inline blobs
  if (preserved.length) s = preserved.join(' | ') + ' | ' + s;

  if (s.length > maxLen) {
    s = s.slice(0, maxLen * 0.7) + ' ... [TRUNCATED] ... ' + s.slice(-maxLen * 0.3);
  }
  return s;
}

// Decode Cloudflare email-protection span (data-cfemail="HEX") → plain email
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

// Deobfuscate common patterns: name [at] domain [dot] com etc
function deobfuscate(html) {
  let s = html;
  s = s.replace(/\s*[\[\(]?\s*(at|AT)\s*[\]\)]?\s*/g, '@');
  s = s.replace(/\s*[\[\(]?\s*(dot|DOT)\s*[\]\)]?\s*/g, '.');
  s = s.replace(/&#64;/g, '@').replace(/&#46;/g, '.');
  s = s.replace(/&#x40;/gi, '@').replace(/&#x2E;/gi, '.');
  return s;
}

const CODEX_PROMPT = `# Task: Extract the best outreach email from donor website HTML

You are reading HTML from a donor website. Find emails visible IN THE HTML TEXT and pick the BEST one for cold outreach to propose guest posts, press release placements, or editorial inclusions.

## CRITICAL RULES

1. **NEVER invent or guess emails.** Only return emails that literally appear in the HTML.
2. For every email you return, include the EXACT quote from HTML (≤120 chars around the email).
3. If NO email is visible → return \`{"status": "no_email_visible"}\`.
4. \`CF_DECODED:xxx@yyy\` markers mean a Cloudflare-protected email was successfully decoded — those ARE valid extracted emails, treat them as present.

## PRIORITY ORDER (pick highest)

1. **Guest-post** inboxes — \`guestposts@\`, \`contribute@\`, \`submissions@\`, \`writers@\`, \`authors@\`
2. **General** inboxes — \`info@\`, \`contact@\`, \`hello@\`, \`team@\`, \`office@\`, \`biuro@\`, \`kontakt@\`, \`bureau@\`, \`ufficio@\`, \`oficina@\`, \`mail@\`
3. **Editorial/PR** inboxes — \`editor@\`, \`editorial@\`, \`press@\`, \`pr@\`, \`newsroom@\`, \`content@\`, \`news@\`, \`media@\`, \`redazione@\`, \`redaktion@\`, \`redakcja@\`
4. **Partnerships** — \`partnerships@\`, \`business@\`, \`bd@\`, \`partners@\`, \`collab@\`, \`outreach@\`
5. **Personal** (john.smith@domain) — ONLY last resort, ONLY if HTML labels person as editor/journalist/contributor; by default **SKIP**

## HARD REJECT (never pick, even if only option)

- Operational: \`support@\`, \`help@\`, \`service@\`, \`customer-service@\`, \`care@\`
- Commercial: \`sales@\`, \`adsales@\`, \`ads@\`, \`advertising@\`, \`marketing@\`, \`licensing@\`, \`affiliate@\`
- HR: \`jobs@\`, \`careers@\`, \`hr@\`, \`recruit@\`
- Transactional: \`reservas@\`, \`booking@\`, \`orders@\`, \`shipping@\`, \`returns@\`, \`refunds@\`
- Departmental: \`billing@\`, \`legal@\`, \`privacy@\`, \`finance@\`, \`tax@\`, \`accounting@\`, \`compliance@\`, \`dmca@\`
- System: \`noreply@\`, \`webmaster@\`, \`postmaster@\`, \`abuse@\`, \`unsubscribe@\`, \`mailer-daemon@\`
- Editorial-adjacent (NOT outreach): \`corrections@\`, \`letters@\`, \`feedback@\`, \`tips@\`, \`accuracy@\`, \`amend@\`, **\`comment@\`, \`comments@\`** (reader comment submissions, letters lane)
- Topic-mismatch ops: \`visit@\`, \`schedule@\`, \`register@\`, \`campus@\`, \`admissions@\`, \`tour@\`, \`donate@\`, \`donations@\`
- Generic admin: \`admin@\`, \`ca@\` (subdomain admin aliases)
- Nicknames / aliases without clear editorial context: \`grouchy@\`, \`boss@\`, nicknames that don't look like firstname/lastname/role — REJECT
- **Email on 3rd-party domain** (email-domain ≠ donor-domain) — REJECT as it's PR/press-release contact of another org
- **gmail.com / yahoo.com / outlook.com / hotmail.com / icloud.com / protonmail.com / yandex.ru / mail.ru etc** — REJECT as primary (personal providers suggest unofficial setup)

## JSON-LD contactType CHECK

If JSON-LD \`ContactPoint\` or \`Organization\` markup contains \`"contactType":"sales"\` or \`"contactType":"customer service"\` or \`"contactType":"technical support"\` near the email → **REJECT that email**. Only accept JSON-LD emails with contactType = "customer support" if NO better ladder email is visible AND contactType is \`"editorial"\`, \`"press"\`, \`"media"\`, \`"information"\`, \`"general"\`, or absent.

## Role-context requirement for UNUSUAL locals

If local-part is NOT one of the common ladder terms (info, contact, hello, team, editor, press, pr, news, newsroom, partnerships, business, guestpost, contribute), you **MUST** find in the surrounding HTML (±150 chars) at least ONE clear role/intent word:
- "editorial", "editor", "press", "media", "newsroom", "contact", "info", "general inquiry"
- "submit", "write for us", "guest post", "contribute"
- "partnership", "collaboration", "business inquiry"

If NO such word near the email → treat as SUBOPTIMAL, pick \`info@/contact@/hello@\` instead if available, else return \`no_email_visible\`.

## Personal-name CAUTION

Even if email is in JSON-LD Organization.email:
- If local looks like firstname.lastname@ or firstname@ (alias) WITHOUT explicit "Editor: Jane Doe" or "Contributor: John Smith" label in HTML → **SKIP**, set status to \`no_email_visible\`.
- Do NOT rescue personal picks via JSON-LD Organization.email alone.

## CONTEXT CHECK (snippet around email)

**Negative context** → reject that specific email:
- "letters to editor / feedback / queries / reader letters"
- "customer service / support / helpdesk"
- "corrections / inaccuracies / factual error / amend article / byline"
- "campus visit / schedule a visit / admissions / tour"
- "booking / reservation / reschedule"
- "donations / fundraising / contributions welcome / support our foundation"
- "unsubscribe / newsletter subscription"
- "buy tickets / shop / checkout / return policy / refund"

**Positive context** → boost:
- "guest post / contribute / submissions / write for us"
- "press release / press inquiries / media kit / press room"
- "editorial team / editorial inquiry / story pitch / story ideas"
- "partnership / business inquiry / collaboration"

## DONOR DOMAIN

The site you're reading is: **{{DOMAIN}}**

## OUTPUT FORMAT (strict JSON, NO markdown fences, NO extra text)

\`\`\`
{
  "status": "found" | "no_email_visible" | "form_only" | "blocked",
  "emails_found": [
    {"email": "x@y", "role_label": "Editorial Team" | "Contact" | null, "quote": "...exact HTML text around email...", "tier": "guest"|"general"|"editor"|"pr"|"partnerships"|"personal"}
  ],
  "best_pick": "x@y" | null,
  "best_pick_reason": "why this is best, ≤150 chars",
  "contact_form_url": "https://..." | null,
  "notes": "anything unusual, ≤200 chars"
}
\`\`\`

Return ONLY the JSON object. No markdown, no explanation before/after.

## HTML TO ANALYZE

`;

async function runCodex(domain, html) {
  const promptBody = CODEX_PROMPT.replace(/\{\{DOMAIN\}\}/g, domain) + html;
  return new Promise((resolve) => {
    const proc = spawn('codex', ['exec', '--skip-git-repo-check', '--cd', '/Users/yegorbarakovskiy/Desktop/ratedbrokers'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let out = '';
    let err = '';
    proc.stdout.on('data', d => out += d.toString());
    proc.stderr.on('data', d => err += d.toString());
    const timeout = setTimeout(() => proc.kill('SIGKILL'), 180000);
    proc.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0 && !out) return resolve({ error: 'codex_fail', stderr: err.slice(0, 500) });
      // Parse JSON from output — codex may wrap in extra text
      const m = out.match(/\{[\s\S]*\}/);
      if (!m) return resolve({ error: 'no_json_in_output', raw: out.slice(-500) });
      try {
        const parsed = JSON.parse(m[0]);
        return resolve({ parsed, raw_tokens_hint: out.match(/tokens used\s+(\d+)/)?.[1] });
      } catch (e) {
        return resolve({ error: 'json_parse_fail', raw: m[0].slice(0, 500) });
      }
    });
    proc.stdin.write(promptBody);
    proc.stdin.end();
  });
}

// Verify email actually appears in fetched HTML (anti-hallucination)
function verifyEmailInHtml(email, html) {
  const emailLower = email.toLowerCase();
  const htmlLower = html.toLowerCase();
  // Check direct presence
  if (htmlLower.includes(emailLower)) return 'direct';
  // Check CF_DECODED: marker
  if (htmlLower.includes('cf_decoded:' + emailLower)) return 'cf_decoded';
  // Check obfuscated: name AT domain DOT com
  const [local, host] = emailLower.split('@');
  if (!local || !host) return false;
  const hostParts = host.split('.');
  const obfRe = new RegExp(local.replace(/[.]/g, '[.]') + '\\s*\\[?\\(?\\s*at\\s*\\]?\\)?\\s*' + hostParts.join('\\s*\\[?\\(?\\s*dot\\s*\\]?\\)?\\s*'), 'i');
  if (obfRe.test(html)) return 'obfuscated';
  // HTML entities version
  const htmlEntityEmail = emailLower.replace('@', '&#64;');
  if (htmlLower.includes(htmlEntityEmail)) return 'entity';
  return false;
}

const PROBE_PATHS = ['/contact', '/contact-us', '/contact/', '/about', '/about-us', '/write-for-us', '/advertise', '/team', '/editorial-team', '/contacts', '/contacto', '/kontakt', '/contatto'];

// Parse homepage HTML for links to contact/about/write-for-us pages.
// Returns array of absolute URLs in priority order.
function discoverContactLinks(html, baseUrl) {
  if (!html) return [];
  const base = new URL(baseUrl);
  const links = new Map();  // URL → priority (higher better)

  const linkRe = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    let href = m[1].trim();
    const anchor = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;

    let abs;
    try { abs = new URL(href, base).href; } catch { continue; }
    const urlObj = new URL(abs);
    if (urlObj.host !== base.host && urlObj.host !== 'www.' + base.host.replace(/^www\./, '') && 'www.' + urlObj.host !== base.host) continue;  // only same host

    const hrefLow = abs.toLowerCase();
    const label = anchor + ' ' + hrefLow;

    let priority = 0;
    if (/write[-_ ]?for[-_ ]?us|guest[-_ ]?post|submissions?|contribute/.test(label)) priority = 90;
    else if (/press[-_ ]?room|press[-_ ]?kit|media[-_ ]?kit|press[-_ ]?inquir/.test(label)) priority = 80;
    else if (/contact[-_ ]?us/.test(label)) priority = 70;
    else if (/\bcontact\b/.test(label)) priority = 60;
    else if (/editorial[-_ ]?team|editorial[-_ ]?staff|editorial[-_ ]?board/.test(label)) priority = 55;
    else if (/about[-_ ]?us/.test(label)) priority = 45;
    else if (/\babout\b/.test(label)) priority = 40;
    else if (/\bteam\b|staff/.test(label)) priority = 35;
    else if (/advertise|advertising|sponsor/.test(label)) priority = 30;
    else continue;

    if (!links.has(abs) || links.get(abs) < priority) links.set(abs, priority);
  }

  return [...links.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([url]) => url);
}

async function processDomain(row) {
  const { domain, max_dr, overlap, tier } = row;
  log(`→ ${domain} (DR${max_dr}, ov${overlap})`);

  // Skip infra domains
  if (INFRA_DOMAINS.has(domain)) {
    log(`  skipped: infra domain`);
    return { domain, max_dr, overlap, tier, status: 'skipped_infra', ts: new Date().toISOString() };
  }

  const result = {
    domain, max_dr, overlap, tier,
    ts: new Date().toISOString(),
    attempts: [],
    best_pick: null,
    best_pick_reason: null,
    quote: null,
    tier_label: null,
    contact_form_url: null,
    status: 'no_contact',
    notes: '',
  };

  // STRATEGY: fetch homepage first. Parse links to contact/about/write-for-us.
  // Use those REAL links. Fall back to guessed paths if homepage has no contact links.
  let combinedHtmlSoFar = '';
  let homepageHtml = null;
  let homepageUrl = null;
  let fetchedCount = 0;

  for (const homeTry of [`https://www.${domain}/`, `https://${domain}/`]) {
    const fetched = await fetchPage(homeTry);
    result.attempts.push({ url: homeTry, status: fetched.status, error: fetched.error, result: fetched.error || fetched.status >= 400 ? 'http_error' : 'fetched' });
    if (!fetched.error && fetched.status < 400 && fetched.html) {
      homepageHtml = fetched.html;
      homepageUrl = homeTry;
      break;
    }
  }

  // Build URL list: discovered links first, then fallback guesses
  const urls = [];
  if (homepageHtml) {
    const discovered = discoverContactLinks(homepageHtml, homepageUrl);
    for (const u of discovered) urls.push({ url: u, path: new URL(u).pathname, variant: 'discovered' });
  }
  const fallbackPaths = ['/contact-us', '/contact', '/write-for-us', '/about', '/about-us', '/press', '/contacts'];
  for (const p of fallbackPaths) {
    urls.push({ url: `https://www.${domain}${p}`, path: p, variant: 'www' });
    urls.push({ url: `https://${domain}${p}`, path: p, variant: 'bare' });
  }

  // Start combined HTML with homepage (if fetched) to give codex footer context
  if (homepageHtml) {
    const decoded = decodeCfemailInHtml(homepageHtml);
    combinedHtmlSoFar += `\n\n=== SOURCE: ${homepageUrl} ===\n${cleanHtml(decoded, 4000)}`;
    fetchedCount = 1;
  }

  const seenUrls = new Set(homepageUrl ? [homepageUrl] : []);
  const seenPath = new Set();
  for (const entry of urls) {
    if (!entry.url) continue;
    if (fetchedCount >= 4) break;  // cap at 4 total (homepage + 3 deeper)
    if (seenUrls.has(entry.url)) continue;
    if (entry.variant === 'bare' && seenPath.has(entry.path)) continue;
    seenUrls.add(entry.url);

    const fetched = await fetchPage(entry.url);
    const attempt = { url: entry.url, status: fetched.status, error: fetched.error };

    if (fetched.error) {
      attempt.result = 'fetch_fail';
      result.attempts.push(attempt);
      continue;
    }

    if (fetched.status >= 400) {
      attempt.result = 'http_error';
      result.attempts.push(attempt);
      continue;
    }

    const decoded = decodeCfemailInHtml(fetched.html);
    const cleanedHtml = cleanHtml(decoded, 5000);
    combinedHtmlSoFar += `\n\n=== SOURCE: ${entry.url} ===\n${cleanedHtml}`;
    attempt.result = 'fetched';
    attempt.html_size = cleanedHtml.length;
    attempt.variant = entry.variant;
    result.attempts.push(attempt);
    seenPath.add(entry.path);
    fetchedCount++;
  }
  const combinedHtml = combinedHtmlSoFar;

  if (combinedHtml.trim().length < 100) {
    result.status = 'dead';
    result.notes = 'all pages failed';
    return result;
  }

  // Run codex
  const codexResult = await runCodex(domain, combinedHtml.slice(0, 14000));

  if (codexResult.error) {
    result.status = 'codex_error';
    result.notes = `codex: ${codexResult.error}${codexResult.raw ? ' | ' + codexResult.raw : ''}`;
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

  // Anti-hallucination: verify email appears in fetched HTML
  const verification = verifyEmailInHtml(picked, combinedHtml);
  if (!verification) {
    log(`  ⚠ hallucination? ${picked} NOT in HTML for ${domain}`);
    result.status = 'hallucination_rejected';
    result.notes = `codex picked ${picked} but not found in HTML`;
    return result;
  }

  // Verify domain match (codex should've already done this, but double-check)
  const emailDomain = picked.split('@')[1];
  if (emailDomain && !emailDomain.endsWith(domain) && !domain.endsWith(emailDomain)) {
    log(`  ⚠ domain mismatch: ${picked} vs ${domain}`);
    result.status = 'domain_mismatch_rejected';
    result.notes = `codex picked ${picked} — different domain`;
    return result;
  }

  result.best_pick = picked;
  result.best_pick_reason = parsed.best_pick_reason;
  result.tier_label = parsed.emails_found?.find(e => e.email.toLowerCase() === picked)?.tier || null;
  result.quote = parsed.emails_found?.find(e => e.email.toLowerCase() === picked)?.quote || null;
  result.verification = verification;
  result.contact_form_url = parsed.contact_form_url || null;
  result.status = 'found';
  log(`  ✓ ${picked} (${result.tier_label}, verified=${verification})`);
  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  if (AUDIT) {
    // Audit mode: pull 10 random found results and print for codex review
    const results = loadStaging();
    const found = results.filter(r => r.status === 'found' && r.best_pick);
    const shuffled = [...found].sort(() => Math.random() - 0.5).slice(0, parseInt(AUDIT));
    fs.writeFileSync('/tmp/l3-audit-sample.json', JSON.stringify(shuffled, null, 2));
    log(`[audit] ${shuffled.length} random found rows → /tmp/l3-audit-sample.json`);
    return;
  }

  const staging = loadStaging();
  const processedDomains = new Set(staging.map(r => r.domain));
  log(`[start] staging has ${staging.length} rows; priority pool=${PRIORITY_ROWS.length}`);

  const todo = PRIORITY_ROWS.slice(START).filter(r => !processedDomains.has(r.domain)).slice(0, LIMIT);
  log(`[start] processing ${todo.length} (start=${START}, limit=${LIMIT})`);

  for (let i = 0; i < todo.length; i++) {
    const row = todo[i];
    try {
      const result = await processDomain(row);
      staging.push(result);
      saveStaging(staging);
      log(`[progress] ${i + 1}/${todo.length} done — status=${result.status}${result.best_pick ? ' — ' + result.best_pick : ''}`);
    } catch (e) {
      log(`[error] ${row.domain}: ${e.message}`);
      staging.push({ domain: row.domain, status: 'script_error', error: e.message, ts: new Date().toISOString() });
      saveStaging(staging);
    }
  }

  // Final summary
  const allFound = staging.filter(r => r.status === 'found' && r.best_pick);
  const allNoContact = staging.filter(r => r.status === 'no_contact');
  const allBlocked = staging.filter(r => ['blocked', 'dead', 'codex_error'].includes(r.status));
  const allSkipped = staging.filter(r => r.status === 'skipped_infra');
  log(`[end] total staging=${staging.length}: found=${allFound.length} no_contact=${allNoContact.length} blocked/dead/err=${allBlocked.length} skipped_infra=${allSkipped.length}`);
}

main().catch(e => { log(`[fatal] ${e.message}\n${e.stack}`); process.exit(1); });
