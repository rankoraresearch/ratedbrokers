// scripts/donors-cleanup.mjs
// Purge low-quality / mismatched emails from donors table.
// Applies stricter rules than enrich-donors-v2 / donors-rescore:
//   1. HARD-REJECT foreign_domain (3rd-party PR/press emails on other domains)
//   2. HARD-REJECT non-ladder ops inboxes (support/help/sales/jobs/reservas/billing/etc)
//   3. Re-pick primary from all_emails JSON (v2 rows) OR flip to no_contact (v1 rows)
//   4. Keep foreign_provider (gmail/yahoo) ONLY if primary — with 'personal_email' flag
//
// Usage:
//   ADMIN_API_KEY=... node scripts/donors-cleanup.mjs               # dry-run, prints stats
//   ADMIN_API_KEY=... node scripts/donors-cleanup.mjs --sample=20   # + show 20 examples each bucket
//   ADMIN_API_KEY=... node scripts/donors-cleanup.mjs --audit-json  # write /tmp/donors-cleanup-sample.json (10 random post-cleanup rows)
//   ADMIN_API_KEY=... node scripts/donors-cleanup.mjs --apply       # actually PUT changes to D1
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

const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const AUDIT = argv.includes('--audit-json');
const SAMPLE = parseInt((argv.find(a => a.startsWith('--sample=')) || '--sample=8').split('=')[1]);

// ─── Stricter rules ───────────────────────────────────────────────────────

// Hard-reject local parts — never use as outreach, even as fallback.
const NON_OUTREACH_RE = /^(jobs?|careers?|recruit(ing|ment|er)?|hr|human[-_.]?resources|staffing|hiring|investor(s|ship)?|ir|legal|compliance|dmca|privacy|security|vulnerability|gdpr|copyright|trademark|complaints?|tax|accounting|finance|billing|payments?|invoice|purchase|procurement|vendor|supplier|feedback|tips|story|whistle(blower)?|unsubscribe|subscription(s)?|newsletter|opt-?out|reservations?|reservas|bookings?|orders?|shipping|returns?|refunds?|delivery|reception|front[-_.]?desk|appointments?|donations?|donate|volunteer|membership|alumni|alumnus|alumna|alumnae|parents?|students?|admissions?|enrollment|enrol|register|registration|visit(s|or|ors)?|tour(s)?|campus|school|faculty|academic|webmaster|postmaster|abuse|spam|noreply|no[-_.]?reply|donotreply|mailer[-_.]?daemon|root|daemon|bounce|undelivered|sysop|sysadmin|automated|auto[-_.]?reply|notifications?|alerts?|system|technical|tech|help[-_.]?desk|it[-_.]?support|it|ad[-_.]?sales|adsales|ad[-_.]?ops|adops|ad[-_.]?revenue|comments?|letters?|review(s|er)?|correction(s)?|corrigenda)$/i;

// Additional hard-reject: compound commercial locals (anything starting with these commercial prefixes)
const COMMERCIAL_PREFIX_RE = /^(ads?|adsales|adops|adrevenue|advertising|advertise|sponsor|sponsored|sponsorship|sales|marketing|commercial|licensing|licences?|licenses?|affiliate|affiliates|reseller|resellers|wholesale|wholesaler|dealer|dealers|distributor|distributors|mediakit|media[-_.]?kit|buy|purchases?)([-_.].*)?$/i;

// Infrastructure / CDN / alias domains — never real publisher contacts.
const INFRA_DOMAIN_BLACKLIST = new Set([
  'netdna-ssl.com','netdna-cdn.com','maxcdn.com','cloudfront.net','amazonaws.com','cloudflare.com','fastly.net','fastly.com','akamai.net','akamaized.net','akamaihd.net','b-cdn.net','bunnycdn.com','jsdelivr.net','unpkg.com','googleusercontent.com','appspot.com','azureedge.net','azurewebsites.net','herokuapp.com','vercel.app','netlify.app','github.io','gitlab.io','bitbucket.io','wordpress.com','blogspot.com','tumblr.com','medium.com','wixsite.com','squarespace.com',
]);

// Support/help → downgraded (keep only as LAST resort if nothing else)
const SUPPORT_RE = /^(support|help|service|customer[-_.]?(service|care|support)?|care|cs)$/i;

// Sales/marketing → downgraded (not ladder, but usable fallback)
const SALES_RE = /^(sales|marketing|ads?|advertising|advertise|sponsor(ship|ed)?|mediakit|media[-_.]?kit|licensing|licenses?|affiliate(s)?)$/i;

// PLACEHOLDERS
const PLACEHOLDER_HOSTS = new Set([
  'example.com','example.org','example.net','domain.com','yoursite.com','yourdomain.com','test.com','email.com','mail.com','sample.com','website.com','site.com','company.com','foo.com','bar.com',
  'voorbeeld.nl','domein.com','domein.nl','beispiel.de','domain.de','muster.de','exemple.com','exemple.fr','domaine.fr','esempio.it','dominio.it','ejemplo.com','ejemplo.es','dominio.es','primer.ru','test.ru',
]);
const PLACEHOLDER_LOCAL_RE = /^(example|sample|test|foo|bar|baz|yourname|yourmail|firstname|lastname|name|voorbeeld|beispiel|exemple|esempio|ejemplo|primer|xxx|abc|demo|placeholder|changeme)$/i;

const FOREIGN_PROVIDER_HOSTS = new Set([
  'gmail.com','googlemail.com','yahoo.com','yahoo.co.uk','yahoo.co.jp','hotmail.com','hotmail.co.uk','outlook.com','live.com','aol.com','icloud.com','me.com','mac.com','protonmail.com','proton.me','yandex.ru','yandex.com','mail.ru','rambler.ru','gmx.com','gmx.net','zoho.com','fastmail.com','msn.com','ymail.com','bk.ru','list.ru','inbox.ru',
]);

function isPlaceholderEmail(email) {
  const m = email.match(/^([^@]+)@([^@]+)$/);
  if (!m) return true;
  const host = m[2].toLowerCase().replace(/^www\./, '');
  if (PLACEHOLDER_HOSTS.has(host)) return true;
  if (PLACEHOLDER_LOCAL_RE.test(m[1].toLowerCase())) return true;
  return false;
}

function categorize(local) {
  const L = local.toLowerCase();
  if (NON_OUTREACH_RE.test(L)) return 'reject';
  if (COMMERCIAL_PREFIX_RE.test(L)) return 'reject';
  if (PLACEHOLDER_LOCAL_RE.test(L)) return 'reject';
  if (/^(guest[-_.]?posts?|contribut(e|ing|or|ors)?|submissions?|submit|writers?|pitch(es)?|authors?|freelance(rs?)?)$/i.test(L)) return 'guest';
  if (/^(editor(s|ial|-in-chief)?|content|newsroom|news|redaktion|redazione|redakcja|redaktsia|articles|stories)$/i.test(L)) return 'editor';
  if (/^(pr|press|media|publicity|communications?|comms?)$/i.test(L)) return 'pr';
  if (/^(partnerships?|outreach|business|bd|biz(dev)?|collab(oration)?|partner(s)?|deals?)$/i.test(L)) return 'partnerships';
  if (SALES_RE.test(L)) return 'reject';      // now rejected outright (was 'sales')
  if (/^(contact|hello|hi|team|enquir(y|ies|e)|general|office|mail|biuro|bureau|ufficio|oficina|buero|büro|kontakt)$/i.test(L)) return 'contact';
  if (/^admin$/i.test(L)) return 'reject';  // codex: admin@ is operations-leaning, not outreach
  if (/^info$/i.test(L)) return 'info';
  if (SUPPORT_RE.test(L)) return 'reject';    // now rejected outright (was 'support')
  // Prefix patterns
  if (/^editor[._-]/.test(L)) return 'editor';
  if (/^press[._-]/.test(L)) return 'pr';
  if (/^contact[._-]/.test(L)) return 'contact';
  if (/^guest[._-]/.test(L)) return 'guest';
  if (/^news[._-]/.test(L)) return 'editor';
  if (/^contribut/.test(L)) return 'guest';
  if (/^partner/.test(L)) return 'partnerships';
  // Unknown locals → REJECT as primary (codex marks these SUBOPTIMAL/WRONG)
  return 'reject';
}

// Weights per DR band (high / mid / low). Lower is worse. `reject` = 0 ⇒ hard reject.
// STRICT MODE for 10/10 codex target:
//   support/sales/service → 0 (flip row to no_contact, don't leave as primary)
//   other (unclassified) → kept but capped low
function baseWeight(category, dr) {
  const bands = {
    reject:       [  0,   0,   0],
    guest:        [100, 100, 100],
    editor:       [ 95,  90,  85],
    pr:           [ 80,  70,  60],
    partnerships: [ 75,  70,  65],
    contact:      [ 55,  65,  70],
    info:         [ 50,  60,  65],
    other:        [ 35,  40,  45],
    sales:        [  0,   0,   0],  // reject — not in ladder
    support:      [  0,   0,   0],  // reject — operational, not outreach
  };
  const band = dr >= 80 ? 0 : dr >= 60 ? 1 : 2;
  return bands[category]?.[band] ?? 30;
}

function classifyHost(email, donorDomain) {
  const host = email.split('@')[1].toLowerCase().replace(/^www\./, '');
  const donor = donorDomain.toLowerCase().replace(/^www\./, '');
  if (INFRA_DOMAIN_BLACKLIST.has(host) || INFRA_DOMAIN_BLACKLIST.has(donor)) return 'infra';
  if (host === donor) return 'on_domain';
  if (host.endsWith('.' + donor) || donor.endsWith('.' + host)) return 'same_site';
  if (FOREIGN_PROVIDER_HOSTS.has(host)) return 'foreign_provider';
  return 'foreign_domain';
}

// Negative context patterns — when snippet mentions these, the email is for
// letters-to-editor / corrections / customer-service / visits / donations — NOT outreach.
const NEG_CONTEXT_RE = /(letters?[- ]?to[- ]?(the[- ]?)?editor|reader[- ]?letters|letters? &?\s*(feedback|queries|comments)|inaccurac(y|ies)|correction(s|ed)?|factual[- ]?error|error[- ]?in[- ]?our|customer[- ]?(service|care|support)|help[- ]?desk|campus[- ]?visit|admissions?[- ]?(office|inquir|question)|schedule[- ]?a[- ]?(visit|tour|call)|book(ing|[- ]?a[- ]?(room|table|appointment))|reservation|reschedul|register[- ]?(for|here|at|your)|accuracy[- ]?(concern|issue)|report[- ]?(a[- ]?)?(typo|error|inaccuracy)|submit[- ]?a[- ]?(correction|tip)|newsletter[- ]?subscri|unsubscri|opt[- ]?out|rsvp|ticket(s|ing)?|buy[- ]?tickets?|shop|store|checkout|order[- ]?status|return[- ]?policy|refund|shipping[- ]?info|amend[- ]?(the[- ]?)?article|byline|article[- ]?attribut|article[- ]?of[- ]?yours|donor(s)?[- ]?(list|who|wishing|wish[- ]?to|welcome|join|support)|donation(s)?[- ]?(welcome|accept|accepted)|crowdfund|fundrais|support[- ]?our[- ]?(work|foundation|mission|project)|contributions?[- ]?(welcome|accept|appreciate|support)|wish[- ]?to[- ]?support|contribut(ed|ing)[- ]?by|foundation[- ]?is[- ]?(funded|supported)|range[- ]?of[- ]?donors)/i;

// Positive outreach signals — when snippet has these, the email is legit outreach.
const POS_CONTEXT_RE = /(guest[- ]?posts?|contribut(e|ors?|ing|ion)|submit[- ]?(a[- ]?)?(post|article|story|pitch)|pitches?|write[- ]?for[- ]?us|editorial[- ]?(team|inquiry|submiss)|press[- ]?(release|inquir|contact|room)|media[- ]?(kit|inquir|relation|contact)|pr[- ]?inquir|collaborat|partnership|business[- ]?inquir|work[- ]?with[- ]?us)/i;

function finalScore(cand, snippet = '') {
  if (cand.w === 0) return -999;                               // hard reject on category
  if (cand.host === 'foreign_domain') return -999;              // HARD REJECT 3rd-party PR
  if (cand.host === 'foreign_provider') return -999;            // HARD REJECT gmail/yahoo primaries
  if (cand.host === 'infra') return -999;                       // HARD REJECT CDN/alias domains
  const hostBonus = cand.host === 'on_domain' ? 30 : cand.host === 'same_site' ? 20 : 0;
  const methodBonus = cand.m === 'mailto' ? 5 : cand.m === 'cfemail' ? 3 : cand.m === 'json-ld' ? 3 : 0;

  // Context-based penalty/bonus from snippet
  let contextBonus = 0;
  if (snippet) {
    const hasNeg = NEG_CONTEXT_RE.test(snippet);
    const hasPos = POS_CONTEXT_RE.test(snippet);
    if (hasNeg && !hasPos) {
      // Strong negative: the email is tied to non-outreach context. Reject unless positive signal.
      return -999;
    }
    if (hasPos && !hasNeg) contextBonus += 20;   // boost clearly-outreach emails
  }

  return cand.w + hostBonus + methodBonus + contextBonus;
}

function sanitizeEmail(raw) {
  if (!raw) return null;
  let e = String(raw).trim().toLowerCase();
  e = e.replace(/^mailto:\s*/i, '').replace(/^\s*mailto:\s*/i, '');
  e = e.replace(/[?&].*$/, '');  // strip ?subject=... query
  e = e.replace(/[<>'"()]/g, '').trim();
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(e)) return null;
  return e;
}

function pickBest(allEmails, domain, dr, snippet = '') {
  const byEmail = {};
  for (const c of allEmails) {
    const clean = sanitizeEmail(c.email);
    if (!clean) continue;
    if (isPlaceholderEmail(clean)) continue;
    const local = clean.split('@')[0];
    const cat = categorize(local);
    const w = baseWeight(cat, dr);
    const host = classifyHost(clean, domain);
    const cand = { email: clean, cat, w, m: c.m || '', host, method: c.m };
    cand.score = finalScore(cand, snippet);
    if (!byEmail[clean] || byEmail[clean].score < cand.score) byEmail[clean] = cand;
  }
  const sorted = Object.values(byEmail).filter(c => c.score > -500).sort((a, b) => b.score - a.score);
  return sorted;
}

async function listDonors() {
  const res = await fetch(`${API}/api/admin/donors/list?limit=10000&min_dr=0&min_overlap=0&status=found`, {
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

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const rows = await listDonors();
  console.log(`[cleanup] ${rows.length} rows with status='found'`);

  const buckets = {
    SAME: [],           // primary unchanged, still valid
    REPICKED: [],       // primary changed to a better email within all_emails
    V1_KEPT: [],        // v1-only row, email passed new rules
    V1_REJECTED: [],    // v1-only row, email failed — flip to no_contact
    FLIPPED_NO_CONTACT: [],  // v2 row with nothing left after filter
    FORM_ONLY: [],      // no email at all, contact_form_url exists
    ERROR: [],
  };

  for (const r of rows) {
    try {
      const dr = r.max_dr || 50;
      const hasAllEmails = r.all_emails && r.all_emails !== '[]' && r.all_emails !== 'null';
      const hasEmail = r.email || r.primary_email;
      const hasForm = r.contact_form_url;

      if (!hasEmail && hasForm) { buckets.FORM_ONLY.push({ row: r }); continue; }

      if (hasAllEmails) {
        const all = JSON.parse(r.all_emails);
        const sorted = pickBest(all, r.domain, dr, r.source_snippet || '');
        const newPrimary = sorted[0]?.email || null;
        const newFb1 = sorted[1]?.email || null;
        const newFb2 = sorted[2]?.email || null;
        const oldPrimary = r.primary_email || r.email || null;

        if (!newPrimary) {
          buckets.FLIPPED_NO_CONTACT.push({ row: r, oldPrimary, reason: 'all rejected by new rules' });
        } else if (newPrimary !== oldPrimary) {
          buckets.REPICKED.push({ row: r, oldPrimary, newPrimary, newFb1, newFb2, sorted });
        } else {
          buckets.SAME.push({ row: r, newPrimary, newFb1, newFb2, sorted });
        }
      } else {
        // v1-only row: just check the single `email` against new rules
        const em = sanitizeEmail(r.primary_email || r.email);
        if (!em) { buckets.V1_REJECTED.push({ row: r, email: r.email || r.primary_email, reason: 'bad_format' }); continue; }
        if (isPlaceholderEmail(em)) { buckets.V1_REJECTED.push({ row: r, email: em, reason: 'placeholder' }); continue; }
        const local = em.split('@')[0];
        const cat = categorize(local);
        const w = baseWeight(cat, dr);
        const host = classifyHost(em, r.domain);
        if (w === 0) { buckets.V1_REJECTED.push({ row: r, email: em, reason: `non_ladder (${local})` }); continue; }
        if (host === 'foreign_domain') { buckets.V1_REJECTED.push({ row: r, email: em, reason: 'foreign_domain' }); continue; }
        if (host === 'foreign_provider') { buckets.V1_REJECTED.push({ row: r, email: em, reason: 'foreign_provider' }); continue; }
        buckets.V1_KEPT.push({ row: r, email: em, cat, w, host });
      }
    } catch (e) {
      buckets.ERROR.push({ row: r, err: e.message });
    }
  }

  // ─── Stats ────────────────────────────────────────────────────────────────
  console.log();
  console.log('─── CLEANUP PREVIEW ───────────────────────────────────────');
  console.log(`  SAME              (primary unchanged, valid): ${buckets.SAME.length}`);
  console.log(`  REPICKED          (better email in all_emails): ${buckets.REPICKED.length}`);
  console.log(`  V1_KEPT           (legacy email passes new rules): ${buckets.V1_KEPT.length}`);
  console.log(`  V1_REJECTED       (legacy email fails → no_contact): ${buckets.V1_REJECTED.length}`);
  console.log(`  FLIPPED_NO_CONTACT (v2 row, nothing valid left): ${buckets.FLIPPED_NO_CONTACT.length}`);
  console.log(`  FORM_ONLY         (no email, form exists): ${buckets.FORM_ONLY.length}`);
  console.log(`  ERROR             : ${buckets.ERROR.length}`);
  console.log(`  ────────────────────────────────────────────────────────`);
  const stillFound = buckets.SAME.length + buckets.REPICKED.length + buckets.V1_KEPT.length + buckets.FORM_ONLY.length;
  const toNoContact = buckets.V1_REJECTED.length + buckets.FLIPPED_NO_CONTACT.length;
  console.log(`  After cleanup: ${stillFound} found, ${toNoContact} → no_contact, ${buckets.ERROR.length} err`);
  console.log(`  Coverage: ${(stillFound / rows.length * 100).toFixed(1)}% of current "found" remains after stricter rules`);
  console.log();

  // ─── Samples ──────────────────────────────────────────────────────────────
  function sampleShow(name, bucket, fn) {
    if (bucket.length === 0) { console.log(`─── ${name} — empty`); return; }
    console.log(`─── ${name} — ${Math.min(SAMPLE, bucket.length)} / ${bucket.length} random:`);
    const shuffled = [...bucket].sort(() => Math.random() - 0.5).slice(0, SAMPLE);
    for (const s of shuffled) console.log('  ' + fn(s));
    console.log();
  }
  sampleShow('REPICKED', buckets.REPICKED, s => `${s.row.domain.padEnd(32)} ${s.oldPrimary} → ${s.newPrimary} (${s.sorted[0].cat}/${s.sorted[0].host})`);
  sampleShow('V1_REJECTED', buckets.V1_REJECTED, s => `${s.row.domain.padEnd(32)} ${s.email.padEnd(40)} [${s.reason}]`);
  sampleShow('FLIPPED_NO_CONTACT', buckets.FLIPPED_NO_CONTACT, s => `${s.row.domain.padEnd(32)} was ${s.oldPrimary || 'NONE'} (all rejected)`);
  sampleShow('V1_KEPT', buckets.V1_KEPT, s => `${s.row.domain.padEnd(32)} ${s.email.padEnd(40)} [${s.cat}/${s.host}/w${s.w}]`);
  sampleShow('SAME', buckets.SAME, s => `${s.row.domain.padEnd(32)} ${s.newPrimary} (${s.sorted[0].cat}/${s.sorted[0].host})`);

  // ─── Audit JSON (10 random post-cleanup rows for codex) ────────────────
  // Filter: overlap>=2 (priority tier — 2+ competitors already link, broker-friendly proven)
  // Pool: SAME + REPICKED only (rows with snippet evidence). V1_KEPT excluded (no provenance).
  if (AUDIT) {
    const isPriority = r => (r.overlap || 0) >= 2;
    const hasSnippet = r => r.source_snippet && r.source_snippet.length > 20;
    const pool = [
      ...buckets.SAME.filter(s => isPriority(s.row) && hasSnippet(s.row)).map(s => ({ kind: 'SAME', domain: s.row.domain, max_dr: s.row.max_dr, overlap: s.row.overlap, tier: s.row.tier, chosen_email: s.newPrimary, chosen_cat: s.sorted[0].cat, chosen_host: s.sorted[0].host, fb1: s.newFb1, fb2: s.newFb2, contact_page_url: s.row.contact_page_url, source_url: s.row.source_url, source_method: s.row.source_method, source_snippet: (s.row.source_snippet || '').slice(0, 300) })),
      ...buckets.REPICKED.filter(s => isPriority(s.row) && hasSnippet(s.row)).map(s => ({ kind: 'REPICKED', domain: s.row.domain, max_dr: s.row.max_dr, overlap: s.row.overlap, tier: s.row.tier, old_primary: s.oldPrimary, chosen_email: s.newPrimary, chosen_cat: s.sorted[0].cat, chosen_host: s.sorted[0].host, fb1: s.newFb1, fb2: s.newFb2, contact_page_url: s.row.contact_page_url, source_url: s.row.source_url, source_method: s.row.source_method, source_snippet: (s.row.source_snippet || '').slice(0, 300) })),
    ];
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    fs.writeFileSync('/tmp/donors-cleanup-sample.json', JSON.stringify(shuffled, null, 2));
    console.log(`[audit] 10 random post-cleanup rows (priority tier, overlap>=2, with snippet) → /tmp/donors-cleanup-sample.json  — pool=${pool.length}`);
  }

  // ─── Apply ────────────────────────────────────────────────────────────────
  if (!APPLY) {
    console.log('\n[dry-run] no changes written. Re-run with --apply to commit.');
    return;
  }

  console.log('\n[apply] writing changes to D1…');
  let done = 0, errors = 0;
  const total = buckets.REPICKED.length + buckets.V1_REJECTED.length + buckets.FLIPPED_NO_CONTACT.length;
  for (const s of buckets.REPICKED) {
    try {
      const allJson = JSON.stringify(s.sorted.map(c => ({ email: c.email, cat: c.cat, w: c.w, m: c.m, host: c.host, score: c.score })));
      await updateDonor(s.row.domain, { primary_email: s.newPrimary, fallback_email_1: s.newFb1, fallback_email_2: s.newFb2, all_emails: allJson, email: s.newPrimary });
      done++;
    } catch (e) { errors++; if (errors < 5) console.log(`  ERR ${s.row.domain}: ${e.message}`); }
    if (done % 100 === 0) console.log(`  [${done}/${total}] repicked`);
  }
  for (const s of buckets.V1_REJECTED) {
    try {
      await updateDonor(s.row.domain, { status: 'no_contact', email: null, primary_email: null, notes: `cleanup: v1 ${s.reason}` });
      done++;
    } catch (e) { errors++; if (errors < 5) console.log(`  ERR ${s.row.domain}: ${e.message}`); }
    if (done % 100 === 0) console.log(`  [${done}/${total}] v1_rejected`);
  }
  for (const s of buckets.FLIPPED_NO_CONTACT) {
    try {
      await updateDonor(s.row.domain, { status: 'no_contact', primary_email: null, fallback_email_1: null, fallback_email_2: null, email: null, notes: 'cleanup: all emails rejected' });
      done++;
    } catch (e) { errors++; if (errors < 5) console.log(`  ERR ${s.row.domain}: ${e.message}`); }
    if (done % 100 === 0) console.log(`  [${done}/${total}] flipped`);
  }
  console.log(`[apply] done. updated=${done} errors=${errors}`);
}

main().catch(e => { console.error(e); process.exit(1); });
