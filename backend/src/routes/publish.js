/**
 * Publication Planner — 4th admin section.
 * Gradual page rollout to avoid Google SpamBrain/Firefly detection.
 * Auto-seeds ~816 pages, auto-schedules 16-week plan, dynamic sitemap.
 */
import { corsHeaders } from '../utils/cors.js';
import { adminHeaderCSS, adminHeaderHTML, adminFooterHTML, adminHeaderScript } from '../utils/adminLayout.js';

function checkKey(url, env) {
  const key = url.searchParams.get('key');
  return key && key === env.API_KEY;
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ═══════════════════════════════════════════════════════════════
// PAGE CATALOG — all ~816 pages for auto-seed
// ═══════════════════════════════════════════════════════════════

const BROKER_SLUGS = [
  'activtrades','admirals','avatrade','axi','blackbull','capital-com','city-index',
  'cmc-markets','dukascopy','eightcap','etoro','exness','forex-com','fp-markets',
  'fusion-markets','fxcm','fxpro','fxtm','go-markets','hfm','ic-markets','ig',
  'interactive-brokers','libertex','naga','oanda','pepperstone','plus500','roboforex',
  'saxo-bank','spreadex','swissquote','thinkmarkets','tickmill','trading-212',
  'vantage','xm','xtb'
];

const SUBPAGE_TABS = ['account','fees','regulation','platforms','deposit','minimum-deposit','alternatives','beginners'];

const THEMATIC_RANKINGS = [
  'forex-overall','forex-beginners','forex-professionals','forex-scalping','forex-day-trading',
  'forex-swing-trading','forex-position-trading','forex-hedging','forex-news-trading',
  'forex-automated','forex-algo','forex-hft','forex-copy-trading','forex-social-trading',
  'forex-signals','forex-ea','forex-grid','forex-carry',
  'low-spread','zero-spread','low-commission','low-cost','no-hidden-fees','no-inactivity-fee',
  'free-deposits','free-withdrawals','instant-withdrawal','cashback','no-requotes','low-slippage',
  'ecn','stp','ndd','market-maker','dma','a-book','fast-execution',
  'micro-accounts','cent-accounts','standard-accounts','demo-accounts','pamm-accounts',
  'mam-accounts','managed-accounts','large-accounts','small-accounts','islamic-accounts',
  'no-min-deposit','1-dollar-deposit','5-dollar-deposit','10-dollar-deposit','50-dollar-deposit',
  '100-dollar-deposit','500-dollar-deposit',
  'high-leverage','leverage-30','leverage-100','leverage-200','leverage-500','leverage-1000','unlimited-leverage',
  'bonus','no-deposit-bonus','deposit-bonus','welcome-bonus','loyalty-program',
  'mt4','mt5','ctrader','tradingview','ninjatrader','zulutrade','prorealtime','proprietary',
  'trading-api','free-vps',
  'trading-apps','apps-iphone','apps-android','crypto-apps','stock-apps',
  'safest','regulated','negative-balance','guaranteed-stop-loss','segregated-accounts',
  'education','research','trading-central','autochartist','economic-calendar','charting','24-7-support',
  'crypto-overall','crypto-bitcoin','crypto-ethereum','crypto-xrp','crypto-solana','crypto-doge',
  'crypto-altcoins','crypto-staking','crypto-copy','crypto-high-lev','crypto-low-spread','crypto-vs-cfd',
  'cfd','stocks','gold','silver','oil','commodities','indices','options','futures','etf','spread-betting','bonds',
  'eurusd','gbpusd','usdjpy','audusd','usdcad','eurgbp','usdchf','nzdusd','exotic','minor',
  'sp500','nasdaq','dow','ftse','dax','nikkei',
  'pay-paypal','pay-skrill','pay-neteller','pay-bitcoin','pay-crypto','pay-credit-card','pay-visa',
  'pay-bank-transfer','pay-apple-pay','pay-google-pay','pay-perfect-money','pay-webmoney','pay-upi','pay-pix',
  'reg-fca','reg-asic','reg-cysec','reg-nfa','reg-bafin','reg-mas','reg-dfsa','reg-fsca','reg-scb','reg-offshore',
  'geo-uk','geo-australia','geo-usa','geo-germany','geo-canada','geo-switzerland','geo-singapore','geo-uae',
  'geo-japan','geo-hongkong','geo-europe','geo-south-africa','geo-india','geo-malaysia','geo-new-zealand',
  'geo-france','geo-spain','geo-italy','geo-netherlands','geo-sweden','geo-saudi','geo-kuwait','geo-qatar',
  'geo-nigeria','geo-philippines','geo-indonesia','geo-turkey','geo-brazil','geo-mexico','geo-pakistan',
  'geo-kenya','geo-ghana','geo-thailand','geo-vietnam','geo-bangladesh','geo-colombia','geo-egypt',
  'geo-poland','geo-romania','geo-south-korea',
  'alt-etoro','alt-ic-markets','alt-pepperstone','alt-xm','alt-exness','alt-ig','alt-plus500',
  'alt-oanda','alt-avatrade','alt-robinhood'
];

const COMBI_TYPES = ['ecn','low-spread','beginners','scalping','mt4','mt5','high-leverage','copy-trading',
  'islamic','cfd','regulated','zero-spread','demo','day-trading','tradingview','trading-apps'];
const COMBI_COUNTRIES = ['uk','australia','usa','germany','singapore','uae','canada','south-africa',
  'india','malaysia','nigeria','new-zealand','philippines','indonesia','kenya'];

function generateCombiSlugs() {
  const slugs = [];
  for (const t of COMBI_TYPES) {
    for (const c of COMBI_COUNTRIES) {
      slugs.push(`best-${t}-forex-brokers-in-${c}`);
    }
  }
  return slugs;
}

const STATIC_PAGES = [
  'home','methodology','about','how-we-make-money','trust-score','contact',
  'rankings','reviews','guides','compare','best-forex-brokers-by-country',
  'platform/metatrader-4','platform/metatrader-5','platform/ctrader','platform/tradingview',
  'regulator/fca','regulator/cysec','regulator/asic','regulator/nfa','regulator/bafin',
  'regulator/mas','regulator/dfsa','regulator/fsca','regulator/scb','regulator/finma',
  'regulator/jfsa','regulator/fma','regulator/cbr','regulator/mifid','regulator/sec',
  'regulator/sebi','regulator/cma','regulator/iiroc','regulator/scm','regulator/bappebti',
  'regulator/bnm','regulator/sec-ph',
  'guide/how-to-choose-a-forex-broker','guide/what-is-forex-trading','guide/forex-trading-strategies',
  'guide/technical-analysis','guide/fundamental-analysis'
];

function buildAllPages() {
  const pages = [];
  // Static pages
  for (const s of STATIC_PAGES) pages.push({ slug: s, page_type: 'static' });
  // Reviews (38)
  for (const b of BROKER_SLUGS) pages.push({ slug: `review/${b}`, page_type: 'review' });
  // Subpages (38 × 8 = 304)
  for (const b of BROKER_SLUGS) {
    for (const tab of SUBPAGE_TABS) {
      pages.push({ slug: `review/${b}/${tab}`, page_type: 'subpage' });
    }
  }
  // Thematic rankings (200)
  for (const r of THEMATIC_RANKINGS) pages.push({ slug: r, page_type: 'ranking' });
  // Combinatorial rankings (240)
  for (const c of generateCombiSlugs()) pages.push({ slug: c, page_type: 'combinatorial' });
  return pages;
}

// ═══════════════════════════════════════════════════════════════
// AUTO-SEED
// ═══════════════════════════════════════════════════════════════

async function ensureSeeded(env) {
  const check = await env.DB.prepare('SELECT COUNT(*) as cnt FROM page_publish').first();
  if (check.cnt > 0) return check.cnt;

  const pages = buildAllPages();
  // D1 batch limit: 100 statements per batch
  const batchSize = 50;
  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    const stmts = batch.map(p =>
      env.DB.prepare('INSERT OR IGNORE INTO page_publish (slug, lang, page_type, status) VALUES (?, ?, ?, ?)')
        .bind(p.slug, 'en', p.page_type, 'draft')
    );
    await env.DB.batch(stmts);
  }
  return pages.length;
}

// ═══════════════════════════════════════════════════════════════
// AUTO-SCHEDULE (16-week algorithm)
// ═══════════════════════════════════════════════════════════════

function randomTime(dateStr) {
  // Random hour 8-21, random minutes 3-57 (never :00)
  const h = 8 + Math.floor(Math.random() * 14);
  const m = 3 + Math.floor(Math.random() * 55);
  return `${dateStr}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00Z`;
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Priority rankings (high-traffic first)
const HIGH_PRIORITY_RANKINGS = [
  'forex-overall','forex-beginners','low-spread','safest','crypto-bitcoin',
  'forex-scalping','ecn','high-leverage','forex-copy-trading','mt4','mt5',
  'forex-day-trading','cfd','forex-automated','regulated','crypto-overall',
  'trading-apps','tradingview','forex-professionals','stocks'
];

function generateSchedule(startDate, pages) {
  const schedule = []; // [{slug, scheduled_at}]
  let dayOffset = 0;

  // Separate pages by type
  const reviews = pages.filter(p => p.page_type === 'review');
  const rankings = pages.filter(p => p.page_type === 'ranking');
  const subpages = pages.filter(p => p.page_type === 'subpage');
  const combinatorial = pages.filter(p => p.page_type === 'combinatorial');
  const staticPages = pages.filter(p => p.page_type === 'static');

  // Sort rankings: high-priority first
  rankings.sort((a, b) => {
    const ai = HIGH_PRIORITY_RANKINGS.indexOf(a.slug);
    const bi = HIGH_PRIORITY_RANKINGS.indexOf(b.slug);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return 0;
  });

  // Top reviews (featured brokers first)
  const topBrokers = ['ic-markets','pepperstone','exness','etoro','xm','fp-markets','avatrade','ig','oanda','plus500'];
  reviews.sort((a, b) => {
    const as = a.slug.replace('review/', '');
    const bs = b.slug.replace('review/', '');
    const ai = topBrokers.indexOf(as);
    const bi = topBrokers.indexOf(bs);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return 0;
  });

  function assign(slug, day) {
    schedule.push({ slug, scheduled_at: randomTime(addDays(startDate, day)) });
  }

  // ── PHASE 1: Foundation (days 0–13) ~45 pages ──

  // Day 0: homepage + 5 top reviews + methodology
  const day0 = ['home', 'methodology'];
  for (const s of day0) assign(s, 0);
  for (let i = 0; i < 5 && i < reviews.length; i++) assign(reviews[i].slug, 0);

  // Day 1-3: 5 reviews per day
  let revIdx = 5;
  for (let d = 1; d <= 3; d++) {
    for (let i = 0; i < 5 && revIdx < reviews.length; i++, revIdx++) {
      assign(reviews[revIdx].slug, d);
    }
  }

  // Day 4: 5 reviews + about + contact
  assign('about', 4);
  assign('contact', 4);
  for (let i = 0; i < 5 && revIdx < reviews.length; i++, revIdx++) {
    assign(reviews[revIdx].slug, 4);
  }

  // Days 5-6: pause (indexation)

  // Day 7: remaining reviews + static
  for (; revIdx < reviews.length; revIdx++) {
    assign(reviews[revIdx].slug, 7);
  }
  // trust-score, how-we-make-money, rankings, reviews, guides, compare
  const day7Static = ['trust-score','how-we-make-money','rankings','reviews','guides','compare','best-forex-brokers-by-country'];
  for (const s of day7Static) assign(s, 7);

  // Days 8-13: 5 top rankings
  const topRankings = rankings.splice(0, 5);
  for (let i = 0; i < topRankings.length; i++) {
    assign(topRankings[i].slug, 8 + Math.floor(i / 2));
  }

  // Remaining static (platforms, regulators, guides)
  const usedStatic = new Set([...day0, ...day7Static, 'about', 'contact']);
  const remainingStatic = staticPages.filter(p => !usedStatic.has(p.slug));
  let staticDay = 10;
  for (let i = 0; i < remainingStatic.length; i++) {
    assign(remainingStatic[i].slug, staticDay + Math.floor(i / 5));
  }

  // ── PHASE 2: Rankings (days 14–41) ~200 thematic rankings ──
  let rankDay = 14;
  let rankPerDay = 7;
  for (let i = 0; i < rankings.length; i++) {
    assign(rankings[i].slug, rankDay + Math.floor(i / rankPerDay));
  }

  // ── PHASE 3: Subpages + Combinatorial (days 42–83) ──
  // Interleave: subpages of top brokers first, then combinatorial
  const mixed = [];
  let si = 0, ci = 0;
  while (si < subpages.length || ci < combinatorial.length) {
    // 6 subpages, then 4 combinatorial per day-batch of 10
    for (let k = 0; k < 6 && si < subpages.length; k++, si++) mixed.push(subpages[si]);
    for (let k = 0; k < 4 && ci < combinatorial.length; k++, ci++) mixed.push(combinatorial[ci]);
  }

  let phase3Day = 42;
  const phase3Rate = 10;
  for (let i = 0; i < mixed.length; i++) {
    assign(mixed[i].slug, phase3Day + Math.floor(i / phase3Rate));
  }

  return schedule;
}

// ═══════════════════════════════════════════════════════════════
// SLUG → URL mapping for sitemap
// ═══════════════════════════════════════════════════════════════

function slugToUrl(slug) {
  if (slug === 'home') return 'https://ratedbrokers.com/';
  return `https://ratedbrokers.com/${slug}`;
}

function pageTypeForSitemap(type) {
  if (type === 'review' || type === 'subpage') return 'reviews';
  if (type === 'ranking' || type === 'combinatorial') return 'rankings';
  return 'static';
}

// ═══════════════════════════════════════════════════════════════
// API HANDLERS
// ═══════════════════════════════════════════════════════════════

// GET /api/admin/publish/pages — JSON list with filters
export async function handlePublishPages(request, env) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkKey(url, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  await ensureSeeded(env);

  const type = url.searchParams.get('type');
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('q');
  const lang = url.searchParams.get('lang') || 'en';

  let sql = 'SELECT * FROM page_publish WHERE lang = ?';
  const params = [lang];

  if (type) { sql += ' AND page_type = ?'; params.push(type); }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (search) { sql += ' AND slug LIKE ?'; params.push(`%${search}%`); }

  sql += ' ORDER BY CASE status WHEN \'published\' THEN 0 WHEN \'scheduled\' THEN 1 ELSE 2 END, scheduled_at ASC, slug ASC';

  const result = await env.DB.prepare(sql).bind(...params).all();
  return Response.json({ pages: result.results, total: result.results.length }, { headers });
}

// PUT /api/admin/publish/pages/:slug — update single page
export async function handlePublishUpdate(request, env, slug) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkKey(url, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const body = await request.json();
  const { action, scheduled_at, notes } = body;
  const lang = body.lang || 'en';
  const decodedSlug = decodeURIComponent(slug);

  if (action === 'publish') {
    await env.DB.prepare(
      'UPDATE page_publish SET status = ?, published_at = datetime(\'now\'), scheduled_at = NULL WHERE slug = ? AND lang = ?'
    ).bind('published', decodedSlug, lang).run();
  } else if (action === 'schedule' && scheduled_at) {
    await env.DB.prepare(
      'UPDATE page_publish SET status = ?, scheduled_at = ?, published_at = NULL WHERE slug = ? AND lang = ?'
    ).bind('scheduled', scheduled_at, decodedSlug, lang).run();
  } else if (action === 'unpublish') {
    await env.DB.prepare(
      'UPDATE page_publish SET status = ?, published_at = NULL, scheduled_at = NULL WHERE slug = ? AND lang = ?'
    ).bind('draft', decodedSlug, lang).run();
  } else if (action === 'notes') {
    await env.DB.prepare(
      'UPDATE page_publish SET notes = ? WHERE slug = ? AND lang = ?'
    ).bind(notes || null, decodedSlug, lang).run();
  } else {
    return Response.json({ error: 'Invalid action' }, { status: 400, headers });
  }

  // Log to publish_log
  if (action === 'publish' || action === 'unpublish') {
    await env.DB.prepare(
      'INSERT INTO publish_log (action, count, slugs, triggered_by) VALUES (?, ?, ?, ?)'
    ).bind(action, 1, JSON.stringify([decodedSlug]), 'manual').run();
  }

  return Response.json({ ok: true, slug: decodedSlug, action }, { headers });
}

// POST /api/admin/publish/batch — batch operations
export async function handlePublishBatch(request, env) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkKey(url, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const { slugs, action, scheduled_at } = await request.json();
  if (!slugs || !Array.isArray(slugs) || !action) {
    return Response.json({ error: 'Invalid payload' }, { status: 400, headers });
  }

  const lang = 'en';
  const batchSize = 50;
  let updated = 0;

  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize);
    let stmts;
    if (action === 'publish') {
      stmts = batch.map(s => env.DB.prepare(
        'UPDATE page_publish SET status = ?, published_at = datetime(\'now\'), scheduled_at = NULL WHERE slug = ? AND lang = ?'
      ).bind('published', s, lang));
    } else if (action === 'schedule') {
      stmts = batch.map(s => env.DB.prepare(
        'UPDATE page_publish SET status = ?, scheduled_at = ? WHERE slug = ? AND lang = ?'
      ).bind('scheduled', scheduled_at || randomTime(new Date().toISOString().slice(0, 10)), s, lang));
    } else if (action === 'unpublish') {
      stmts = batch.map(s => env.DB.prepare(
        'UPDATE page_publish SET status = ?, published_at = NULL, scheduled_at = NULL WHERE slug = ? AND lang = ?'
      ).bind('draft', s, lang));
    } else {
      return Response.json({ error: 'Invalid action' }, { status: 400, headers });
    }
    await env.DB.batch(stmts);
    updated += batch.length;
  }

  return Response.json({ ok: true, updated, action }, { headers });
}

// POST /api/admin/publish/auto-schedule — generate 16-week plan
export async function handlePublishAutoSchedule(request, env) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkKey(url, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  await ensureSeeded(env);

  const { startDate } = await request.json();
  if (!startDate) return Response.json({ error: 'startDate required' }, { status: 400, headers });

  // Get all draft + scheduled pages
  const result = await env.DB.prepare(
    'SELECT slug, page_type FROM page_publish WHERE lang = ? AND status != ?'
  ).bind('en', 'published').all();

  const pages = result.results;
  if (!pages.length) return Response.json({ ok: true, scheduled: 0, message: 'All pages already published' }, { headers });

  const schedule = generateSchedule(startDate, pages);

  // Batch update
  const batchSize = 50;
  for (let i = 0; i < schedule.length; i += batchSize) {
    const batch = schedule.slice(i, i + batchSize);
    const stmts = batch.map(s => env.DB.prepare(
      'UPDATE page_publish SET status = ?, scheduled_at = ? WHERE slug = ? AND lang = ?'
    ).bind('scheduled', s.scheduled_at, s.slug, 'en'));
    await env.DB.batch(stmts);
  }

  return Response.json({ ok: true, scheduled: schedule.length, startDate, weeks: 16 }, { headers });
}

// POST /api/admin/publish/tick — publish all due pages
export async function handlePublishTick(request, env) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkKey(url, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const now = new Date().toISOString();
  const due = await env.DB.prepare(
    'SELECT slug FROM page_publish WHERE status = ? AND scheduled_at <= ? AND lang = ?'
  ).bind('scheduled', now, 'en').all();

  if (!due.results.length) return Response.json({ ok: true, published: 0 }, { headers });

  const stmts = due.results.map(r => env.DB.prepare(
    'UPDATE page_publish SET status = ?, published_at = datetime(\'now\'), scheduled_at = NULL WHERE slug = ? AND lang = ?'
  ).bind('published', r.slug, 'en'));

  // Batch in groups of 50
  for (let i = 0; i < stmts.length; i += 50) {
    await env.DB.batch(stmts.slice(i, i + 50));
  }

  // Log to publish_log
  const slugList = due.results.map(r => r.slug);
  await env.DB.prepare(
    'INSERT INTO publish_log (action, count, slugs, triggered_by) VALUES (?, ?, ?, ?)'
  ).bind('publish', slugList.length, JSON.stringify(slugList), 'manual-tick').run();

  return Response.json({ ok: true, published: due.results.length, slugs: slugList }, { headers });
}

// GET /api/publish/active — PUBLIC (no auth, cached 5min)
export async function handlePublishActive(request, env) {
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' };

  const result = await env.DB.prepare(
    'SELECT slug FROM page_publish WHERE status = ? AND lang = ?'
  ).bind('published', 'en').all();

  return Response.json({ slugs: result.results.map(r => r.slug) }, { headers });
}

// GET /api/sitemap.xml — sitemap index
export async function handleSitemapIndex(request, env) {
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://api.ratedbrokers.com/api/sitemap-reviews.xml</loc></sitemap>
  <sitemap><loc>https://api.ratedbrokers.com/api/sitemap-rankings.xml</loc></sitemap>
  <sitemap><loc>https://api.ratedbrokers.com/api/sitemap-subpages.xml</loc></sitemap>
  <sitemap><loc>https://api.ratedbrokers.com/api/sitemap-static.xml</loc></sitemap>
</sitemapindex>`;

  return new Response(xml, { headers });
}

// GET /api/sitemap-{type}.xml — individual sitemaps
export async function handleSitemapSection(request, env, section) {
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' };

  let typeFilter;
  if (section === 'reviews') typeFilter = "('review','subpage')";
  else if (section === 'rankings') typeFilter = "('ranking','combinatorial')";
  else if (section === 'subpages') typeFilter = "('subpage')";
  else typeFilter = "('static')";

  // For reviews sitemap, only reviews (not subpages)
  let sql;
  if (section === 'reviews') {
    sql = `SELECT slug, published_at FROM page_publish WHERE status = 'published' AND lang = 'en' AND page_type = 'review' ORDER BY slug`;
  } else if (section === 'subpages') {
    sql = `SELECT slug, published_at FROM page_publish WHERE status = 'published' AND lang = 'en' AND page_type = 'subpage' ORDER BY slug`;
  } else if (section === 'rankings') {
    sql = `SELECT slug, published_at FROM page_publish WHERE status = 'published' AND lang = 'en' AND page_type IN ('ranking', 'combinatorial') ORDER BY slug`;
  } else {
    sql = `SELECT slug, published_at FROM page_publish WHERE status = 'published' AND lang = 'en' AND page_type = 'static' ORDER BY slug`;
  }

  const result = await env.DB.prepare(sql).all();

  let urls = '';
  for (const row of result.results) {
    const loc = slugToUrl(row.slug);
    const lastmod = row.published_at ? row.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10);
    urls += `  <url><loc>${esc(loc)}</loc><lastmod>${lastmod}</lastmod></url>\n`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}</urlset>`;

  return new Response(xml, { headers });
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD HTML
// ═══════════════════════════════════════════════════════════════

export async function handlePublishDashboard(request, env) {
  const url = new URL(request.url);
  if (!checkKey(url, env)) {
    return new Response('Unauthorized', { status: 401 });
  }

  await ensureSeeded(env);

  const encodedKey = encodeURIComponent(url.searchParams.get('key'));

  // Stats
  const [total, published, scheduled, draft] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) as c FROM page_publish WHERE lang='en'").first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM page_publish WHERE lang='en' AND status='published'").first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM page_publish WHERE lang='en' AND status='scheduled'").first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM page_publish WHERE lang='en' AND status='draft'").first(),
  ]);

  // Type counts
  const typeCounts = await env.DB.prepare(`
    SELECT page_type, status, COUNT(*) as c FROM page_publish WHERE lang='en'
    GROUP BY page_type, status
  `).all();

  // Next 7 days timeline
  const now = new Date();
  const timeline = [];
  for (let d = 0; d < 7; d++) {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() + d);
    const dateStr = date.toISOString().slice(0, 10);
    const dayPages = await env.DB.prepare(
      "SELECT slug, page_type, scheduled_at FROM page_publish WHERE lang='en' AND status='scheduled' AND scheduled_at >= ? AND scheduled_at < ? ORDER BY scheduled_at"
    ).bind(dateStr + 'T00:00:00Z', dateStr + 'T23:59:59Z').all();
    if (dayPages.results.length > 0) {
      timeline.push({ date: dateStr, pages: dayPages.results });
    }
  }

  // Sitemap status
  const sitemapStats = await env.DB.prepare(`
    SELECT page_type,
      COUNT(*) as total_count,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as pub_count
    FROM page_publish WHERE lang='en'
    GROUP BY page_type
  `).all();

  const totalNum = total.c;
  const pubNum = published.c;
  const schNum = scheduled.c;
  const draftNum = draft.c;
  const pct = totalNum > 0 ? ((pubNum / totalNum) * 100).toFixed(1) : '0';

  // Build type stats for filter pills
  const typeMap = {};
  for (const row of typeCounts.results) {
    if (!typeMap[row.page_type]) typeMap[row.page_type] = { total: 0, published: 0, scheduled: 0, draft: 0 };
    typeMap[row.page_type][row.status] = row.c;
    typeMap[row.page_type].total += row.c;
  }

  // Recent activity from publish_log
  let recentActivity = [];
  try {
    const actResult = await env.DB.prepare(
      'SELECT action, count, slugs, triggered_by, created_at FROM publish_log ORDER BY created_at DESC LIMIT 20'
    ).all();
    recentActivity = actResult.results;
  } catch (e) { /* table may not exist yet */ }

  // Build sitemap display
  const smMap = {};
  for (const row of sitemapStats.results) {
    smMap[row.page_type] = { total: row.total_count, pub: row.pub_count };
  }

  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Publication Planner — Rated.Admin</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0c10; color: #f0f0f0; }
  ${adminHeaderCSS()}

  /* ─── Publish-specific ─── */
  .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .progress-bar-wrap { margin-bottom: 24px; }
  .progress-outer { width: 100%; height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
  .progress-inner { height: 100%; background: linear-gradient(90deg, var(--green-dim), var(--green)); border-radius: 4px; transition: width 0.5s ease; }
  .progress-text { font-size: 12px; color: var(--text-secondary); margin-top: 6px; }

  .timeline-section { margin-bottom: 28px; }
  .timeline-day { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 14px 18px; margin-bottom: 10px; }
  .timeline-day-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .timeline-day-title { font-size: 14px; font-weight: 700; color: var(--text-primary); }
  .timeline-day-count { font-size: 12px; color: var(--text-muted); }
  .timeline-pages { display: flex; flex-wrap: wrap; gap: 6px; }
  .timeline-pill { font-size: 11px; padding: 4px 10px; border-radius: 6px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); color: var(--text-secondary); }

  .filter-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; align-items: center; }
  .filter-pill { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid var(--border); background: transparent; color: var(--text-muted); transition: all 0.15s; }
  .filter-pill:hover { color: var(--text-secondary); border-color: var(--border-hover); }
  .filter-pill.active { color: var(--green); background: var(--green-glow); border-color: rgba(74,222,128,0.2); }

  .search-input { padding: 7px 14px; border-radius: 8px; border: 1px solid var(--border); background: rgba(255,255,255,0.04); color: var(--text-primary); font-size: 13px; width: 220px; outline: none; transition: border-color 0.15s; }
  .search-input:focus { border-color: var(--green); }
  .search-input::placeholder { color: var(--text-muted); }

  .batch-bar { display: none; padding: 10px 18px; background: var(--bg-card-solid); border: 1px solid var(--green); border-radius: 10px; margin-bottom: 14px; align-items: center; gap: 12px; font-size: 13px; color: var(--text-secondary); }
  .batch-bar.visible { display: flex; }
  .batch-count { font-weight: 700; color: var(--green); }

  .status-badge { display: inline-flex; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
  .status-badge.draft { color: var(--text-muted); background: rgba(255,255,255,0.04); }
  .status-badge.scheduled { color: var(--blue); background: var(--blue-glow); }
  .status-badge.published { color: var(--green); background: var(--green-glow); }

  .type-badge { display: inline-flex; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 600; }
  .type-badge.review { color: var(--amber); background: var(--amber-glow); }
  .type-badge.ranking { color: var(--blue); background: var(--blue-glow); }
  .type-badge.subpage { color: var(--purple); background: var(--purple-glow); }
  .type-badge.combinatorial { color: var(--cyan); background: rgba(34,211,238,0.12); }
  .type-badge.static { color: var(--text-secondary); background: rgba(255,255,255,0.06); }

  .actions-panel { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }

  .sitemap-section { margin-top: 24px; }
  .sitemap-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
  .sitemap-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 10px; padding: 14px 16px; }
  .sitemap-card .sm-label { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; font-weight: 600; }
  .sitemap-card .sm-value { font-size: 18px; font-weight: 700; color: var(--text-primary); }
  .sitemap-card .sm-bar { margin-top: 8px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
  .sitemap-card .sm-bar-inner { height: 100%; background: var(--green); border-radius: 2px; }

  /* Modal */
  .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 500; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
  .modal-overlay.open { display: flex; }
  .modal { background: var(--bg-card-solid); border: 1px solid var(--border); border-radius: 16px; padding: 24px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
  .modal h3 { font-size: 16px; font-weight: 700; margin-bottom: 14px; }
  .modal input[type="date"] { padding: 8px 14px; border-radius: 8px; border: 1px solid var(--border); background: rgba(255,255,255,0.06); color: var(--text-primary); font-size: 14px; }
  .modal pre { font-size: 11px; color: var(--text-secondary); background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; overflow-x: auto; max-height: 300px; white-space: pre-wrap; word-break: break-all; }

  .page-row { cursor: pointer; }
  .page-row td { vertical-align: middle; }
  .page-row .slug-text { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; }

  @media (max-width: 768px) {
    .summary-grid { grid-template-columns: repeat(2, 1fr); }
    .sitemap-grid { grid-template-columns: 1fr; }
    .search-input { width: 100%; }
  }
  @media (max-width: 480px) {
    .summary-grid { grid-template-columns: 1fr; }
    .actions-panel { flex-direction: column; }
  }
</style>
</head>
<body>
<div class="admin-shell">
  ${adminHeaderHTML('publish', encodedKey)}
  <div class="admin-body">

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="glass-card c-purple">
        <div class="card-label">Total Pages</div>
        <div class="card-value">${totalNum}</div>
      </div>
      <div class="glass-card c-green">
        <div class="card-label">Published</div>
        <div class="card-value">${pubNum}</div>
      </div>
      <div class="glass-card c-blue">
        <div class="card-label">Scheduled</div>
        <div class="card-value">${schNum}</div>
      </div>
      <div class="glass-card c-amber">
        <div class="card-label">Draft</div>
        <div class="card-value">${draftNum}</div>
      </div>
    </div>

    <!-- Progress -->
    <div class="progress-bar-wrap">
      <div class="progress-outer"><div class="progress-inner" style="width:${pct}%"></div></div>
      <div class="progress-text">${pct}% published &middot; ${pubNum} of ${totalNum} pages indexed</div>
    </div>

    <!-- Actions -->
    <div class="actions-panel">
      <button class="btn-primary" onclick="openAutoSchedule()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        Auto-Schedule 16 Weeks
      </button>
      <button class="btn-info" onclick="publishAllDue()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Publish All Due
      </button>
      <button class="btn-secondary" onclick="openSitemapPreview()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Sitemap Preview
      </button>
    </div>

    <!-- Timeline -->
    ${timeline.length > 0 ? `
    <div class="section-hdr sh-blue"><div class="sh-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div><h2>Upcoming (Next 7 Days)</h2></div>
    <div class="timeline-section">
      ${timeline.map(day => {
        const d = new Date(day.date + 'T00:00:00Z');
        const dayName = dayNames[d.getUTCDay()];
        return `<div class="timeline-day">
          <div class="timeline-day-header">
            <span class="timeline-day-title">${day.date} (${dayName})</span>
            <span class="timeline-day-count">${day.pages.length} page${day.pages.length !== 1 ? 's' : ''}</span>
            <button class="btn-primary" style="padding:5px 12px;font-size:11px" onclick="publishDay('${day.date}')">Publish All</button>
          </div>
          <div class="timeline-pages">${day.pages.map(p => `<span class="timeline-pill">${esc(p.slug)}</span>`).join('')}</div>
        </div>`;
      }).join('')}
    </div>` : ''}

    <!-- Filters -->
    <div class="section-hdr sh-green"><div class="sh-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div><h2>All Pages</h2></div>

    <div class="filter-bar">
      <span style="font-size:11px;color:var(--text-muted);font-weight:700">TYPE:</span>
      <button class="filter-pill active" data-filter="type" data-value="">All (${totalNum})</button>
      <button class="filter-pill" data-filter="type" data-value="review">Reviews (${typeMap.review?.total || 0})</button>
      <button class="filter-pill" data-filter="type" data-value="ranking">Rankings (${typeMap.ranking?.total || 0})</button>
      <button class="filter-pill" data-filter="type" data-value="subpage">Subpages (${typeMap.subpage?.total || 0})</button>
      <button class="filter-pill" data-filter="type" data-value="combinatorial">Combi (${typeMap.combinatorial?.total || 0})</button>
      <button class="filter-pill" data-filter="type" data-value="static">Static (${typeMap.static?.total || 0})</button>
    </div>
    <div class="filter-bar">
      <span style="font-size:11px;color:var(--text-muted);font-weight:700">STATUS:</span>
      <button class="filter-pill active" data-filter="status" data-value="">All</button>
      <button class="filter-pill" data-filter="status" data-value="draft">Draft (${draftNum})</button>
      <button class="filter-pill" data-filter="status" data-value="scheduled">Scheduled (${schNum})</button>
      <button class="filter-pill" data-filter="status" data-value="published">Published (${pubNum})</button>
      <input class="search-input" type="text" placeholder="Search slug..." id="searchInput" oninput="debouncedSearch()">
    </div>

    <!-- Batch Bar -->
    <div class="batch-bar" id="batchBar">
      <span class="batch-count" id="batchCount">0</span> selected:
      <button class="btn-primary" style="padding:5px 12px;font-size:11px" onclick="batchAction('publish')">Publish</button>
      <button class="btn-info" style="padding:5px 12px;font-size:11px" onclick="batchAction('schedule')">Schedule</button>
      <button class="btn-secondary" style="padding:5px 12px;font-size:11px" onclick="batchAction('unpublish')">Unpublish</button>
      <button class="btn-ghost" onclick="clearSelection()">Clear</button>
    </div>

    <!-- Table -->
    <div style="overflow-x:auto">
    <table class="premium-table" id="pagesTable">
      <thead>
        <tr>
          <th style="width:30px"><input type="checkbox" id="selectAll" onchange="toggleSelectAll(this)"></th>
          <th>#</th>
          <th>Slug</th>
          <th>Type</th>
          <th>Status</th>
          <th>Scheduled</th>
          <th>Published</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="tableBody">
        <tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:40px">Loading...</td></tr>
      </tbody>
    </table>
    </div>

    <!-- Pagination -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px" id="pagination"></div>

    <!-- Sitemap Status -->
    <div class="sitemap-section">
      <div class="section-hdr sh-amber"><div class="sh-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><h2>Sitemap Status</h2></div>
      <div class="sitemap-grid">
        ${['review','ranking','subpage','combinatorial','static'].map(t => {
          const s = smMap[t] || { total: 0, pub: 0 };
          const pctS = s.total > 0 ? ((s.pub / s.total) * 100).toFixed(0) : '0';
          return `<div class="sitemap-card">
            <div class="sm-label">${t}</div>
            <div class="sm-value">${s.pub} / ${s.total}</div>
            <div class="sm-bar"><div class="sm-bar-inner" style="width:${pctS}%"></div></div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Recent Activity -->
    ${recentActivity.length > 0 ? `
    <div style="margin-top:28px">
      <div class="section-hdr sh-purple"><div class="sh-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><h2>Recent Activity</h2></div>
      <div style="overflow-x:auto">
        <table class="premium-table">
          <thead><tr><th>Time</th><th>Action</th><th>Count</th><th>Triggered By</th><th>Details</th></tr></thead>
          <tbody>
            ${recentActivity.map(a => {
              const slugs = a.slugs ? JSON.parse(a.slugs) : [];
              const preview = slugs.length <= 3 ? slugs.join(', ') : slugs.slice(0, 3).join(', ') + ' +' + (slugs.length - 3) + ' more';
              const actionColor = a.action === 'publish' || a.action === 'auto-publish' ? 'var(--green)' : a.action === 'unpublish' ? 'var(--red)' : 'var(--text-secondary)';
              const triggerBadge = a.triggered_by === 'cron'
                ? '<span style="font-size:10px;padding:2px 6px;border-radius:4px;background:var(--blue-glow);color:var(--blue);font-weight:700">CRON</span>'
                : '<span style="font-size:10px;padding:2px 6px;border-radius:4px;background:var(--amber-glow);color:var(--amber);font-weight:700">MANUAL</span>';
              return '<tr>' +
                '<td style="white-space:nowrap;font-size:12px">' + esc(a.created_at || '') + '</td>' +
                '<td style="color:' + actionColor + ';font-weight:600;font-size:12px">' + esc(a.action) + '</td>' +
                '<td style="text-align:center;font-weight:700">' + a.count + '</td>' +
                '<td>' + triggerBadge + '</td>' +
                '<td style="font-size:11px;color:var(--text-muted);max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + esc(preview) + '">' + esc(preview) + '</td>' +
                '</tr>';
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}

  </div>
  ${adminFooterHTML()}
</div>

<!-- Auto-Schedule Modal -->
<div class="modal-overlay" id="scheduleModal">
  <div class="modal">
    <h3>Auto-Schedule 16 Weeks</h3>
    <p style="font-size:13px;color:var(--text-secondary);margin-bottom:14px">
      Generate a 16-week rollout plan. All draft & scheduled pages will be assigned dates with randomized times.
    </p>
    <div style="margin-bottom:14px">
      <label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px">Start Date</label>
      <input type="date" id="scheduleStart" value="${new Date().toISOString().slice(0, 10)}">
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-primary" onclick="applyAutoSchedule()">Apply Schedule</button>
      <button class="btn-secondary" onclick="closeModal('scheduleModal')">Cancel</button>
    </div>
  </div>
</div>

<!-- Sitemap Preview Modal -->
<div class="modal-overlay" id="sitemapModal">
  <div class="modal" style="max-width:700px">
    <h3>Sitemap Preview</h3>
    <pre id="sitemapPreviewContent">Loading...</pre>
    <div style="margin-top:12px"><button class="btn-secondary" onclick="closeModal('sitemapModal')">Close</button></div>
  </div>
</div>

<script>
${adminHeaderScript()}

const API_KEY = '${encodedKey}';
const BASE = '/api/admin/publish';
let currentType = '';
let currentStatus = '';
let currentSearch = '';
let currentPage = 0;
const PAGE_SIZE = 50;
let allPages = [];
let selectedSlugs = new Set();

// ─── Init ───
fetchPages();

// ─── Filters ───
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const filter = pill.dataset.filter;
    const value = pill.dataset.value;
    document.querySelectorAll('.filter-pill[data-filter="'+filter+'"]').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    if (filter === 'type') currentType = value;
    if (filter === 'status') currentStatus = value;
    currentPage = 0;
    fetchPages();
  });
});

let searchTimer;
function debouncedSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    currentSearch = document.getElementById('searchInput').value;
    currentPage = 0;
    fetchPages();
  }, 300);
}

async function fetchPages() {
  let url = BASE + '/pages?key=' + API_KEY + '&lang=en';
  if (currentType) url += '&type=' + currentType;
  if (currentStatus) url += '&status=' + currentStatus;
  if (currentSearch) url += '&q=' + encodeURIComponent(currentSearch);

  const res = await fetch(url);
  const data = await res.json();
  allPages = data.pages || [];
  renderTable();
}

function renderTable() {
  const start = currentPage * PAGE_SIZE;
  const slice = allPages.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById('tableBody');

  if (!slice.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:40px">No pages found</td></tr>';
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  tbody.innerHTML = slice.map((p, i) => {
    const num = start + i + 1;
    const checked = selectedSlugs.has(p.slug) ? 'checked' : '';
    return \`<tr class="page-row">
      <td><input type="checkbox" \${checked} onchange="toggleSelect('\${esc(p.slug)}', this)"></td>
      <td style="color:var(--text-muted);font-size:12px">\${num}</td>
      <td class="slug-text">\${esc(p.slug)}</td>
      <td><span class="type-badge \${p.page_type}">\${p.page_type}</span></td>
      <td><span class="status-badge \${p.status}">\${p.status}</span></td>
      <td style="font-size:12px;color:var(--text-muted)">\${p.scheduled_at ? p.scheduled_at.replace('T',' ').slice(0,16) : '—'}</td>
      <td style="font-size:12px;color:var(--text-muted)">\${p.published_at ? p.published_at.replace('T',' ').slice(0,16) : '—'}</td>
      <td>
        \${p.status !== 'published' ? \`<button class="btn-primary" style="padding:3px 10px;font-size:10px" onclick="quickAction('\${esc(p.slug)}','publish')">Publish</button>\` : ''}
        \${p.status === 'published' ? \`<button class="btn-secondary" style="padding:3px 10px;font-size:10px" onclick="quickAction('\${esc(p.slug)}','unpublish')">Unpublish</button>\` : ''}
      </td>
    </tr>\`;
  }).join('');

  // Pagination
  const totalPages = Math.ceil(allPages.length / PAGE_SIZE);
  const pag = document.getElementById('pagination');
  pag.innerHTML = \`
    <span style="font-size:12px;color:var(--text-muted)">Page \${currentPage + 1} of \${totalPages} (\${allPages.length} results)</span>
    <div style="display:flex;gap:6px">
      <button class="btn-secondary" style="padding:4px 12px;font-size:11px" \${currentPage === 0 ? 'disabled' : ''} onclick="goPage(\${currentPage - 1})">Prev</button>
      <button class="btn-secondary" style="padding:4px 12px;font-size:11px" \${currentPage >= totalPages - 1 ? 'disabled' : ''} onclick="goPage(\${currentPage + 1})">Next</button>
    </div>
  \`;
}

function goPage(p) { currentPage = p; renderTable(); }

function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// ─── Selection ───
function toggleSelect(slug, cb) {
  if (cb.checked) selectedSlugs.add(slug); else selectedSlugs.delete(slug);
  updateBatchBar();
}
function toggleSelectAll(cb) {
  const start = currentPage * PAGE_SIZE;
  const slice = allPages.slice(start, start + PAGE_SIZE);
  slice.forEach(p => { if (cb.checked) selectedSlugs.add(p.slug); else selectedSlugs.delete(p.slug); });
  renderTable();
  updateBatchBar();
}
function clearSelection() { selectedSlugs.clear(); document.getElementById('selectAll').checked = false; renderTable(); updateBatchBar(); }
function updateBatchBar() {
  const bar = document.getElementById('batchBar');
  const count = document.getElementById('batchCount');
  if (selectedSlugs.size > 0) { bar.classList.add('visible'); count.textContent = selectedSlugs.size; }
  else { bar.classList.remove('visible'); }
}

// ─── Quick Actions ───
async function quickAction(slug, action) {
  await fetch(BASE + '/pages/' + encodeURIComponent(slug) + '?key=' + API_KEY, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  });
  toast(action === 'publish' ? 'Published' : 'Unpublished');
  setTimeout(() => location.reload(), 500);
}

// ─── Batch ───
async function batchAction(action) {
  if (!selectedSlugs.size) return;
  await fetch(BASE + '/batch?key=' + API_KEY, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slugs: [...selectedSlugs], action })
  });
  toast(selectedSlugs.size + ' pages: ' + action);
  setTimeout(() => location.reload(), 500);
}

// ─── Publish Day ───
async function publishDay(dateStr) {
  const dayPages = allPages.filter(p => p.status === 'scheduled' && p.scheduled_at && p.scheduled_at.startsWith(dateStr));
  if (!dayPages.length) return;
  await fetch(BASE + '/batch?key=' + API_KEY, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slugs: dayPages.map(p => p.slug), action: 'publish' })
  });
  toast(dayPages.length + ' pages published');
  setTimeout(() => location.reload(), 500);
}

// ─── Auto-Schedule ───
function openAutoSchedule() { document.getElementById('scheduleModal').classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

async function applyAutoSchedule() {
  const startDate = document.getElementById('scheduleStart').value;
  if (!startDate) { alert('Select start date'); return; }
  const res = await fetch(BASE + '/auto-schedule?key=' + API_KEY, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate })
  });
  const data = await res.json();
  closeModal('scheduleModal');
  toast('Scheduled ' + data.scheduled + ' pages over 16 weeks');
  setTimeout(() => location.reload(), 800);
}

// ─── Publish All Due ───
async function publishAllDue() {
  const res = await fetch(BASE + '/tick?key=' + API_KEY, { method: 'POST' });
  const data = await res.json();
  toast(data.published + ' pages published');
  setTimeout(() => location.reload(), 500);
}

// ─── Sitemap Preview ───
async function openSitemapPreview() {
  document.getElementById('sitemapModal').classList.add('open');
  document.getElementById('sitemapPreviewContent').textContent = 'Loading...';
  try {
    const res = await fetch('/api/sitemap.xml');
    const text = await res.text();
    document.getElementById('sitemapPreviewContent').textContent = text;
  } catch (e) {
    document.getElementById('sitemapPreviewContent').textContent = 'Error loading sitemap';
  }
}

// ─── Toast ───
function toast(msg, isError) {
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' error' : '');
  el.innerHTML = (isError ? '&#10060; ' : '&#10004; ') + msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
