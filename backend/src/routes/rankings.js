/**
 * Ranking Manager — Admin panel for managing broker order in 207 rankings.
 * CRUD overrides in D1 ranking_overrides table.
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

// ─── Groups (19 categories) ───
const GROUPS = [
  { code: 'A', label: 'Forex by Style', cat: 'forex' },
  { code: 'B', label: 'Spreads & Costs', cat: 'forex' },
  { code: 'C', label: 'Execution Model', cat: 'forex' },
  { code: 'D', label: 'Account Type', cat: 'forex' },
  { code: 'E', label: 'Minimum Deposit', cat: 'forex' },
  { code: 'F', label: 'Leverage', cat: 'forex' },
  { code: 'G', label: 'Bonus & Promotions', cat: 'forex' },
  { code: 'H', label: 'Trading Platform', cat: 'forex' },
  { code: 'I', label: 'Mobile Apps', cat: 'forex' },
  { code: 'J', label: 'Trust & Safety', cat: 'forex' },
  { code: 'K', label: 'Tools & Features', cat: 'forex' },
  { code: 'L', label: 'Crypto', cat: 'crypto' },
  { code: 'M', label: 'Other Assets', cat: 'assets' },
  { code: 'N', label: 'Currency Pairs', cat: 'forex' },
  { code: 'O', label: 'Indices', cat: 'assets' },
  { code: 'P', label: 'Payment Methods', cat: 'forex' },
  { code: 'Q', label: 'Regulators', cat: 'forex' },
  { code: 'R', label: 'Countries', cat: 'country' },
  { code: 'S', label: 'Alternatives', cat: 'alt' },
];

// ─── 207 Rankings [id, title, group, priority] ───
const _R = [
  // A. Forex by Style (18)
  ['forex-overall','Best Forex Brokers','A',1],
  ['forex-beginners','Best Forex Brokers for Beginners','A',1],
  ['forex-professionals','Best Forex Brokers for Professionals','A',2],
  ['forex-scalping','Best Forex Brokers for Scalping','A',1],
  ['forex-day-trading','Best Forex Brokers for Day Trading','A',1],
  ['forex-swing-trading','Best Forex Brokers for Swing Trading','A',2],
  ['forex-position-trading','Best Forex Brokers for Position Trading','A',3],
  ['forex-hedging','Best Forex Brokers for Hedging','A',2],
  ['forex-news-trading','Best Forex Brokers for News Trading','A',3],
  ['forex-automated','Best Forex Brokers for Automated Trading','A',2],
  ['forex-algo','Best Forex Brokers for Algorithmic Trading','A',2],
  ['forex-hft','Best High-Frequency Trading Brokers','A',3],
  ['forex-copy-trading','Best Copy Trading Platforms','A',1],
  ['forex-social-trading','Best Social Trading Platforms','A',2],
  ['forex-signals','Best Forex Signal Providers','A',2],
  ['forex-ea','Best Forex Brokers for Expert Advisors (EA)','A',3],
  ['forex-grid','Best Forex Brokers for Grid Trading','A',3],
  ['forex-carry','Best Forex Brokers for Carry Trading','A',3],
  // B. Spreads & Costs (12)
  ['low-spread','Lowest Spread Forex Brokers','B',1],
  ['zero-spread','Zero Spread Forex Brokers','B',2],
  ['low-commission','Lowest Commission Forex Brokers','B',2],
  ['low-cost','Best Low Cost Forex Brokers','B',2],
  ['no-hidden-fees','Forex Brokers with No Hidden Fees','B',3],
  ['no-inactivity-fee','Forex Brokers with No Inactivity Fee','B',3],
  ['free-deposits','Forex Brokers with Free Deposits','B',3],
  ['free-withdrawals','Forex Brokers with Free Withdrawals','B',3],
  ['instant-withdrawal','Forex Brokers with Instant Withdrawal','B',2],
  ['cashback','Forex Brokers with Cashback & Rebates','B',3],
  ['no-requotes','Forex Brokers with No Requotes','B',3],
  ['low-slippage','Forex Brokers with Low Slippage','B',3],
  // C. Execution Model (7)
  ['ecn','Best ECN Forex Brokers','C',1],
  ['stp','Best STP Forex Brokers','C',3],
  ['ndd','Best No Dealing Desk (NDD) Brokers','C',2],
  ['market-maker','Market Maker Forex Brokers','C',3],
  ['dma','Best DMA (Direct Market Access) Brokers','C',3],
  ['a-book','Best A-Book Forex Brokers','C',3],
  ['fast-execution','Best Fast Execution Forex Brokers','C',2],
  // D. Account Type (10)
  ['micro-accounts','Forex Brokers with Micro Accounts','D',2],
  ['cent-accounts','Forex Brokers with Cent Accounts','D',3],
  ['standard-accounts','Forex Brokers with Standard Accounts','D',3],
  ['demo-accounts','Best Forex Demo Accounts','D',2],
  ['pamm-accounts','Forex Brokers with PAMM Accounts','D',3],
  ['mam-accounts','Forex Brokers with MAM Accounts','D',3],
  ['managed-accounts','Forex Brokers with Managed Accounts','D',3],
  ['large-accounts','Best Forex Brokers for Large Accounts','D',3],
  ['small-accounts','Best Forex Brokers for Small Accounts','D',2],
  ['islamic-accounts','Best Islamic (Swap-Free) Forex Brokers','D',2],
  // E. Minimum Deposit (7)
  ['no-min-deposit','No Minimum Deposit Forex Brokers','E',2],
  ['1-dollar-deposit','$1 Minimum Deposit Forex Brokers','E',2],
  ['5-dollar-deposit','$5 Minimum Deposit Forex Brokers','E',2],
  ['10-dollar-deposit','$10 Minimum Deposit Forex Brokers','E',2],
  ['50-dollar-deposit','$50 Minimum Deposit Forex Brokers','E',3],
  ['100-dollar-deposit','$100 Minimum Deposit Forex Brokers','E',3],
  ['500-dollar-deposit','$500 Minimum Deposit Forex Brokers','E',3],
  // F. Leverage (7)
  ['high-leverage','Best High Leverage Forex Brokers','F',1],
  ['leverage-30','1:30 Leverage Forex Brokers (EU)','F',3],
  ['leverage-100','1:100 Leverage Forex Brokers','F',3],
  ['leverage-200','1:200 Leverage Forex Brokers','F',3],
  ['leverage-500','1:500 Leverage Forex Brokers','F',2],
  ['leverage-1000','1:1000 Leverage Forex Brokers','F',2],
  ['unlimited-leverage','Unlimited Leverage Forex Brokers','F',3],
  // G. Bonus & Promotions (5)
  ['bonus','Best Forex Brokers with Bonus','G',2],
  ['no-deposit-bonus','No Deposit Bonus Forex Brokers','G',2],
  ['deposit-bonus','Deposit Bonus Forex Brokers','G',2],
  ['welcome-bonus','Welcome Bonus Forex Brokers','G',3],
  ['loyalty-program','Forex Brokers with Loyalty Programs','G',3],
  // H. Trading Platform (10)
  ['mt4','Best MetaTrader 4 (MT4) Brokers','H',1],
  ['mt5','Best MetaTrader 5 (MT5) Brokers','H',1],
  ['ctrader','Best cTrader Brokers','H',2],
  ['tradingview','Best TradingView Brokers','H',1],
  ['ninjatrader','Best NinjaTrader Brokers','H',3],
  ['zulutrade','Best ZuluTrade Brokers','H',3],
  ['prorealtime','Best ProRealTime Brokers','H',3],
  ['proprietary','Forex Brokers with Proprietary Platforms','H',3],
  ['trading-api','Forex Brokers with Trading API','H',3],
  ['free-vps','Forex Brokers with Free VPS','H',2],
  // I. Mobile Apps (5)
  ['trading-apps','Best Forex Trading Apps','I',1],
  ['apps-iphone','Best Forex Apps for iPhone','I',3],
  ['apps-android','Best Forex Apps for Android','I',3],
  ['crypto-apps','Best Crypto Trading Apps','I',2],
  ['stock-apps','Best Stock Trading Apps','I',3],
  // J. Trust & Safety (5)
  ['safest','Safest & Most Trusted Forex Brokers','J',2],
  ['regulated','Best Regulated Forex Brokers','J',2],
  ['negative-balance','Forex Brokers with Negative Balance Protection','J',3],
  ['guaranteed-stop-loss','Forex Brokers with Guaranteed Stop Loss','J',3],
  ['segregated-accounts','Forex Brokers with Segregated Accounts','J',3],
  // K. Tools & Features (7)
  ['education','Best Forex Brokers for Education','K',2],
  ['research','Best Forex Brokers with Research Tools','K',3],
  ['trading-central','Forex Brokers with Trading Central','K',3],
  ['autochartist','Forex Brokers with Autochartist','K',3],
  ['economic-calendar','Forex Brokers with Economic Calendar','K',3],
  ['charting','Best Forex Brokers with Charting Tools','K',3],
  ['24-7-support','Forex Brokers with 24/7 Support','K',3],
  // L. Crypto (12)
  ['crypto-overall','Best Crypto Brokers','L',1],
  ['crypto-bitcoin','Best Bitcoin Trading Platforms','L',1],
  ['crypto-ethereum','Best Ethereum Trading Platforms','L',2],
  ['crypto-xrp','Best Ripple (XRP) Brokers','L',3],
  ['crypto-solana','Best Solana Trading Platforms','L',3],
  ['crypto-doge','Best Dogecoin Brokers','L',3],
  ['crypto-altcoins','Best Altcoin Trading Platforms','L',2],
  ['crypto-staking','Best Crypto Staking Platforms','L',2],
  ['crypto-copy','Best Crypto Copy Trading Platforms','L',3],
  ['crypto-high-lev','Best High Leverage Crypto Brokers','L',2],
  ['crypto-low-spread','Best Low Spread Crypto Brokers','L',3],
  ['crypto-vs-cfd','Crypto Exchanges vs CFD Brokers','L',3],
  // M. Other Assets (12)
  ['cfd','Best CFD Brokers','M',1],
  ['stocks','Best Stock Trading Brokers','M',2],
  ['gold','Best Gold Trading Brokers','M',2],
  ['silver','Best Silver Trading Brokers','M',3],
  ['oil','Best Oil Trading Brokers','M',3],
  ['commodities','Best Commodities Brokers','M',2],
  ['indices','Best Index Trading Brokers','M',2],
  ['options','Best Options Brokers','M',2],
  ['futures','Best Futures Brokers','M',2],
  ['etf','Best ETF Brokers','M',3],
  ['spread-betting','Best Spread Betting Brokers','M',2],
  ['bonds','Best Bond Trading Brokers','M',3],
  // N. Currency Pairs (10)
  ['eurusd','Best EUR/USD Brokers','N',3],
  ['gbpusd','Best GBP/USD Brokers','N',3],
  ['usdjpy','Best USD/JPY Brokers','N',3],
  ['audusd','Best AUD/USD Brokers','N',3],
  ['usdcad','Best USD/CAD Brokers','N',3],
  ['eurgbp','Best EUR/GBP Brokers','N',3],
  ['usdchf','Best USD/CHF Brokers','N',3],
  ['nzdusd','Best NZD/USD Brokers','N',3],
  ['exotic','Best Exotic Pairs Brokers','N',3],
  ['minor','Best Minor Pairs Brokers','N',3],
  // O. Indices (6)
  ['sp500','Best S&P 500 Trading Brokers','O',3],
  ['nasdaq','Best NASDAQ Trading Brokers','O',3],
  ['dow','Best Dow Jones Trading Brokers','O',3],
  ['ftse','Best FTSE 100 Trading Brokers','O',3],
  ['dax','Best DAX Trading Brokers','O',3],
  ['nikkei','Best Nikkei 225 Trading Brokers','O',3],
  // P. Payment Methods (14)
  ['pay-paypal','Forex Brokers Accepting PayPal','P',2],
  ['pay-skrill','Forex Brokers Accepting Skrill','P',3],
  ['pay-neteller','Forex Brokers Accepting Neteller','P',3],
  ['pay-bitcoin','Forex Brokers Accepting Bitcoin','P',2],
  ['pay-crypto','Forex Brokers Accepting Crypto','P',3],
  ['pay-credit-card','Forex Brokers Accepting Credit Cards','P',3],
  ['pay-visa','Forex Brokers Accepting Visa','P',3],
  ['pay-bank-transfer','Forex Brokers Accepting Bank Transfer','P',3],
  ['pay-apple-pay','Forex Brokers Accepting Apple Pay','P',3],
  ['pay-google-pay','Forex Brokers Accepting Google Pay','P',3],
  ['pay-perfect-money','Forex Brokers Accepting Perfect Money','P',3],
  ['pay-webmoney','Forex Brokers Accepting WebMoney','P',3],
  ['pay-upi','Forex Brokers Accepting UPI','P',3],
  ['pay-pix','Forex Brokers Accepting PIX','P',3],
  // Q. Regulators (10)
  ['reg-fca','FCA Regulated Forex Brokers','Q',2],
  ['reg-asic','ASIC Regulated Forex Brokers','Q',2],
  ['reg-cysec','CySEC Regulated Forex Brokers','Q',2],
  ['reg-nfa','NFA / CFTC Regulated Forex Brokers','Q',3],
  ['reg-bafin','BaFin Regulated Forex Brokers','Q',3],
  ['reg-mas','MAS Regulated Forex Brokers','Q',3],
  ['reg-dfsa','DFSA Regulated Forex Brokers','Q',3],
  ['reg-fsca','FSCA Regulated Forex Brokers','Q',3],
  ['reg-scb','SCB Regulated Forex Brokers','Q',3],
  ['reg-offshore','Offshore Forex Brokers','Q',3],
  // R. Countries (40)
  ['geo-uk','Best Forex Brokers UK','R',1],
  ['geo-australia','Best Forex Brokers Australia','R',1],
  ['geo-usa','Best Forex Brokers USA','R',1],
  ['geo-germany','Best Forex Brokers Germany','R',2],
  ['geo-canada','Best Forex Brokers Canada','R',2],
  ['geo-switzerland','Best Forex Brokers Switzerland','R',3],
  ['geo-singapore','Best Forex Brokers Singapore','R',2],
  ['geo-uae','Best Forex Brokers UAE','R',2],
  ['geo-japan','Best Forex Brokers Japan','R',3],
  ['geo-hongkong','Best Forex Brokers Hong Kong','R',3],
  ['geo-europe','Best Forex Brokers Europe','R',2],
  ['geo-south-africa','Best Forex Brokers South Africa','R',2],
  ['geo-india','Best Forex Brokers India','R',2],
  ['geo-malaysia','Best Forex Brokers Malaysia','R',2],
  ['geo-new-zealand','Best Forex Brokers New Zealand','R',3],
  ['geo-france','Best Forex Brokers France','R',3],
  ['geo-spain','Best Forex Brokers Spain','R',3],
  ['geo-italy','Best Forex Brokers Italy','R',3],
  ['geo-netherlands','Best Forex Brokers Netherlands','R',3],
  ['geo-sweden','Best Forex Brokers Sweden','R',3],
  ['geo-saudi','Best Forex Brokers Saudi Arabia','R',2],
  ['geo-kuwait','Best Forex Brokers Kuwait','R',3],
  ['geo-qatar','Best Forex Brokers Qatar','R',3],
  ['geo-nigeria','Best Forex Brokers Nigeria','R',3],
  ['geo-philippines','Best Forex Brokers Philippines','R',3],
  ['geo-indonesia','Best Forex Brokers Indonesia','R',3],
  ['geo-turkey','Best Forex Brokers Turkey','R',3],
  ['geo-brazil','Best Forex Brokers Brazil','R',3],
  ['geo-mexico','Best Forex Brokers Mexico','R',3],
  ['geo-pakistan','Best Forex Brokers Pakistan','R',3],
  ['geo-kenya','Best Forex Brokers Kenya','R',3],
  ['geo-ghana','Best Forex Brokers Ghana','R',3],
  ['geo-thailand','Best Forex Brokers Thailand','R',3],
  ['geo-vietnam','Best Forex Brokers Vietnam','R',3],
  ['geo-bangladesh','Best Forex Brokers Bangladesh','R',3],
  ['geo-colombia','Best Forex Brokers Colombia','R',3],
  ['geo-egypt','Best Forex Brokers Egypt','R',3],
  ['geo-poland','Best Forex Brokers Poland','R',3],
  ['geo-romania','Best Forex Brokers Romania','R',3],
  ['geo-south-korea','Best Forex Brokers South Korea','R',3],
  // S. Alternatives (10)
  ['alt-etoro','Best eToro Alternatives','S',2],
  ['alt-ic-markets','Best IC Markets Alternatives','S',3],
  ['alt-pepperstone','Best Pepperstone Alternatives','S',3],
  ['alt-xm','Best XM Alternatives','S',3],
  ['alt-exness','Best Exness Alternatives','S',3],
  ['alt-ig','Best IG Alternatives','S',3],
  ['alt-plus500','Best Plus500 Alternatives','S',3],
  ['alt-oanda','Best OANDA Alternatives','S',3],
  ['alt-avatrade','Best AvaTrade Alternatives','S',3],
  ['alt-robinhood','Best Robinhood Alternatives for Forex','S',3],
];

const RANKINGS = _R.map(([id, title, group, priority]) => ({ id, title, group, priority }));

// ─── GET /api/admin/rankings/:id/brokers ───
export async function handleRankingBrokers(request, env, rankingId) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };

  if (!checkKey(url, env)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  const ranking = RANKINGS.find(r => r.id === rankingId);
  if (!ranking) {
    return Response.json({ error: 'Ranking not found' }, { status: 404, headers });
  }

  const [brokersResult, overridesResult] = await Promise.all([
    env.DB.prepare(`
      SELECT b.slug, b.name,
        (SELECT COUNT(*) FROM clicks c WHERE c.broker_slug = b.slug AND c.created_at >= date('now', '-30 days')) as clicks_30d
      FROM brokers b ORDER BY b.name
    `).all(),
    env.DB.prepare(`
      SELECT broker_slug, position, featured_label, hidden, notes
      FROM ranking_overrides WHERE ranking_id = ?
    `).bind(rankingId).all(),
  ]);

  const overrideMap = {};
  for (const o of overridesResult.results) {
    overrideMap[o.broker_slug] = o;
  }

  const brokers = brokersResult.results.map(b => ({
    slug: b.slug,
    name: b.name,
    clicks_30d: b.clicks_30d,
    position: overrideMap[b.slug]?.position || 0,
    featured_label: overrideMap[b.slug]?.featured_label || '',
    hidden: overrideMap[b.slug]?.hidden || 0,
    notes: overrideMap[b.slug]?.notes || '',
  }));

  return Response.json({ ranking, brokers }, { headers });
}

// ─── PUT /api/admin/rankings/:id/order ───
export async function handleRankingOrderUpdate(request, env, rankingId) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };

  if (!checkKey(url, env)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  const ranking = RANKINGS.find(r => r.id === rankingId);
  if (!ranking) {
    return Response.json({ error: 'Ranking not found' }, { status: 404, headers });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers });
  }

  if (!Array.isArray(body) || body.length === 0) {
    return Response.json({ error: 'Body must be a non-empty array' }, { status: 400, headers });
  }

  // Validate entries
  for (const item of body) {
    if (!item.slug || typeof item.slug !== 'string') {
      return Response.json({ error: 'Each item must have a slug' }, { status: 400, headers });
    }
  }

  const stmts = [
    env.DB.prepare('DELETE FROM ranking_overrides WHERE ranking_id = ?').bind(rankingId),
  ];

  for (const item of body) {
    stmts.push(
      env.DB.prepare(
        'INSERT INTO ranking_overrides (ranking_id, broker_slug, position, featured_label, hidden, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime(\'now\'))'
      ).bind(
        rankingId,
        item.slug,
        item.position || 0,
        item.featured_label || null,
        item.hidden ? 1 : 0,
        item.notes || null,
      )
    );
  }

  await env.DB.batch(stmts);

  return Response.json({ ok: true, ranking_id: rankingId, count: body.length }, { headers });
}

// ─── DELETE /api/admin/rankings/:id/overrides ───
export async function handleRankingOrderReset(request, env, rankingId) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };

  if (!checkKey(url, env)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  await env.DB.prepare('DELETE FROM ranking_overrides WHERE ranking_id = ?').bind(rankingId).run();

  return Response.json({ ok: true, ranking_id: rankingId }, { headers });
}

// ─── GET /api/rankings/:id/order (public) ───
export async function handleRankingOrderPublic(request, env, rankingId) {
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' };

  const result = await env.DB.prepare(`
    SELECT broker_slug, position, featured_label, hidden
    FROM ranking_overrides WHERE ranking_id = ? ORDER BY position ASC
  `).bind(rankingId).all();

  return Response.json({
    ranking_id: rankingId,
    brokers: result.results.map(r => ({
      slug: r.broker_slug,
      position: r.position,
      featured_label: r.featured_label,
      hidden: r.hidden === 1,
    })),
  }, { headers });
}

// ─── GET /api/admin/rankings/dashboard ── HTML Admin Panel ───
export async function handleRankingsDashboard(request, env) {
  const url = new URL(request.url);

  if (!checkKey(url, env)) {
    return new Response('Unauthorized. Add ?key=YOUR_API_KEY', {
      status: 401, headers: { 'Content-Type': 'text/plain' },
    });
  }

  const key = url.searchParams.get('key');
  const encodedKey = encodeURIComponent(key);

  // Fetch data from D1
  const [overrideCounts, brokerCount, recentChanges] = await Promise.all([
    env.DB.prepare(`
      SELECT ranking_id, COUNT(*) as cnt FROM ranking_overrides GROUP BY ranking_id
    `).all(),
    env.DB.prepare('SELECT COUNT(*) as total FROM brokers').first(),
    env.DB.prepare(`
      SELECT ranking_id, broker_slug, position, featured_label, hidden, updated_at
      FROM ranking_overrides ORDER BY updated_at DESC LIMIT 30
    `).all(),
  ]);

  // Build override count map
  const overrideMap = {};
  let configuredCount = 0;
  for (const row of overrideCounts.results) {
    overrideMap[row.ranking_id] = row.cnt;
    configuredCount++;
  }

  const totalBrokers = brokerCount?.total || 0;
  const totalRankings = RANKINGS.length;

  const rankingsJson = JSON.stringify(RANKINGS);
  const groupsJson = JSON.stringify(GROUPS);
  const overrideMapJson = JSON.stringify(overrideMap);
  const changesJson = JSON.stringify(recentChanges.results);

  const shellCSS = adminHeaderCSS();
  const shellHeader = adminHeaderHTML('rankings', encodedKey);
  const shellFooter = adminFooterHTML();
  const shellScript = adminHeaderScript();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RatedBrokers — Ranking Manager</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg-base); color: var(--text-primary); }
  ${shellCSS}

  /* ─── Summary Cards ─── */
  .summary-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
  .s-card {
    background: var(--bg-card); border-radius: 12px; padding: 18px;
    border: 1px solid var(--border); position: relative; overflow: hidden;
  }
  .s-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; border-radius: 12px 0 0 12px;
  }
  .s-card.green::before { background: var(--green); }
  .s-card.blue::before { background: var(--blue); }
  .s-card.purple::before { background: var(--purple); }
  .s-card .s-label { font-size: 12px; color: var(--text-secondary); font-weight: 500; margin-bottom: 4px; }
  .s-card .s-value { font-size: 26px; font-weight: 800; font-variant-numeric: tabular-nums; }
  .s-card.green .s-value { color: var(--green); }
  .s-card.blue .s-value { color: var(--blue); }
  .s-card.purple .s-value { color: var(--purple); }
  .s-card .s-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

  /* ─── Toolbar ─── */
  .toolbar { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; flex-wrap: wrap; }
  .search {
    background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border);
    padding: 8px 14px 8px 36px; border-radius: 8px; font-size: 14px; width: 300px;
    outline: none; transition: border 0.15s;
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: 10px center;
  }
  .search:focus { border-color: var(--green); }
  .pill {
    background: var(--bg-card); color: var(--text-secondary); border: 1px solid var(--border);
    padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .pill:hover { color: var(--text-primary); border-color: var(--border-hover); }
  .pill.active { border-color: var(--green); color: var(--green); background: var(--green-glow); }

  /* ─── Group ─── */
  .group { margin-bottom: 4px; }
  .group-head {
    display: flex; align-items: center; gap: 8px; padding: 10px 14px;
    cursor: pointer; border-radius: 8px; transition: background 0.15s;
    user-select: none;
  }
  .group-head:hover { background: var(--bg-card); }
  .group-head .arrow { font-size: 10px; color: var(--text-muted); transition: transform 0.2s; width: 14px; }
  .group-head .arrow.open { transform: rotate(90deg); }
  .group-head .code { font-size: 11px; font-weight: 700; color: var(--green); background: var(--green-glow); padding: 2px 6px; border-radius: 4px; }
  .group-head .label { font-size: 14px; font-weight: 600; color: var(--text-primary); }
  .group-head .count { font-size: 11px; color: var(--text-muted); margin-left: auto; }
  .group-body { display: none; padding: 0 0 4px 14px; }
  .group-body.open { display: block; }

  /* ─── Ranking Item ─── */
  .r-item {
    display: flex; align-items: center; gap: 10px; padding: 8px 14px;
    border-radius: 8px; cursor: pointer; transition: all 0.15s;
    border: 1px solid transparent;
  }
  .r-item:hover { background: var(--bg-card); }
  .r-item.selected { background: var(--bg-card); border-color: var(--green); }
  .r-item .r-title { font-size: 13px; color: var(--text-primary); flex: 1; }
  .r-item .r-id { font-size: 10px; color: var(--text-muted); font-family: monospace; }
  .r-item .priority {
    font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;
  }
  .r-item .priority.p1 { color: var(--amber); background: var(--amber-glow); }
  .r-item .priority.p2 { color: var(--blue); background: var(--blue-glow); }
  .r-item .priority.p3 { color: var(--text-muted); background: rgba(42,45,55,0.5); }
  .r-item .status-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }
  .r-item .status-dot.configured { background: var(--green); box-shadow: 0 0 6px rgba(74,222,128,0.4); }
  .r-item .status-dot.natural { background: var(--border); }

  /* ─── Editor ─── */
  .editor-wrap {
    background: var(--bg-card); border-radius: 12px; padding: 20px;
    margin-bottom: 20px; border: 1px solid var(--border);
  }
  .editor-head {
    display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
    position: sticky; top: 0; z-index: 50; background: var(--bg-card);
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .editor-head h2 { font-size: 16px; font-weight: 700; color: var(--text-primary); flex: 1; min-width: 200px; }

  /* ─── Sticky Help Button ─── */
  .help-btn {
    width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border);
    background: var(--bg-base); color: var(--blue); font-weight: 800; font-size: 13px;
    cursor: pointer; position: relative; display: inline-flex; align-items: center;
    justify-content: center; transition: all 0.15s; flex-shrink: 0;
  }
  .help-btn:hover { border-color: var(--blue); background: var(--blue-glow); }
  .help-tooltip {
    display: none; position: absolute; top: calc(100% + 10px); right: 0;
    width: 340px; background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px; z-index: 100;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .help-tooltip::before {
    content: ''; position: absolute; top: -6px; right: 12px;
    width: 10px; height: 10px; background: var(--bg-card);
    border-left: 1px solid var(--border); border-top: 1px solid var(--border);
    transform: rotate(45deg);
  }
  .help-btn:hover .help-tooltip { display: block; }
  .help-tooltip .ht-step {
    display: flex; align-items: flex-start; gap: 8px; padding: 6px 0;
  }
  .help-tooltip .ht-num {
    width: 20px; height: 20px; border-radius: 50%; background: var(--blue-glow);
    color: var(--blue); display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; flex-shrink: 0;
  }
  .help-tooltip .ht-text { font-size: 12px; color: var(--text-secondary); line-height: 1.4; }
  .help-tooltip .ht-text strong { color: var(--text-primary); }
  .btn {
    padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.15s; display: inline-flex;
    align-items: center; gap: 5px;
  }
  .btn-save { background: var(--green-dim); color: #fff; }
  .btn-save:hover { background: #047857; }
  .btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-reset { background: rgba(248,113,113,0.1); color: var(--red); border: 1px solid rgba(248,113,113,0.15); }
  .btn-reset:hover { background: rgba(248,113,113,0.2); }
  .btn-export { background: var(--bg-card-hover); color: var(--text-secondary); border: 1px solid var(--border); }
  .btn-export:hover { color: var(--text-primary); border-color: var(--border-hover); }
  .btn-apply { background: rgba(96,165,250,0.1); color: var(--blue); border: 1px solid rgba(96,165,250,0.15); }
  .btn-apply:hover { background: rgba(96,165,250,0.2); }

  /* ─── Editor Table ─── */
  .ed-table { width: 100%; border-collapse: collapse; }
  .ed-table th, .ed-table td { text-align: left; padding: 8px 10px; font-size: 13px; }
  .ed-table th {
    color: var(--text-muted); font-weight: 600; font-size: 11px; text-transform: uppercase;
    letter-spacing: 0.5px; border-bottom: 1px solid var(--border);
  }
  .ed-table td { border-bottom: 1px solid rgba(42,45,55,0.3); }
  .ed-table tr:hover td { background: rgba(30,33,48,0.3); }
  .ed-table tr.hidden-row td { opacity: 0.4; }
  .ed-table .pos { font-weight: 700; font-variant-numeric: tabular-nums; color: var(--green); width: 32px; text-align: center; }
  .ed-table .broker-name { font-weight: 600; }
  .ed-table .broker-slug { font-size: 10px; color: var(--text-muted); font-family: monospace; }
  .ed-table .clicks { text-align: right; font-variant-numeric: tabular-nums; font-family: monospace; font-size: 12px; color: var(--text-secondary); }
  .ed-table .label-input {
    background: var(--bg-base); color: var(--text-primary); border: 1px solid var(--border);
    padding: 4px 8px; border-radius: 6px; font-size: 12px; width: 140px; outline: none;
  }
  .ed-table .label-input:focus { border-color: var(--green); }
  .ed-table .notes-input {
    background: var(--bg-base); color: var(--text-primary); border: 1px solid var(--border);
    padding: 4px 8px; border-radius: 6px; font-size: 11px; width: 100px; outline: none;
  }
  .ed-table .notes-input:focus { border-color: var(--blue); }
  .status-badge {
    font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px;
  }
  .status-badge.pinned { color: var(--green); background: var(--green-glow); }
  .status-badge.hidden { color: var(--red); background: rgba(248,113,113,0.1); }
  .status-badge.natural { color: var(--text-muted); background: rgba(42,45,55,0.5); }
  .move-btn {
    background: none; border: 1px solid var(--border); color: var(--text-muted);
    width: 24px; height: 24px; border-radius: 4px; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 12px; transition: all 0.15s;
  }
  .move-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-glow); }
  .hide-btn {
    background: none; border: 1px solid var(--border); color: var(--text-muted);
    width: 24px; height: 24px; border-radius: 4px; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 14px; transition: all 0.15s;
  }
  .hide-btn:hover { border-color: var(--red); color: var(--red); }
  .hide-btn.is-hidden { color: var(--green); border-color: var(--green); }
  .ed-actions { display: flex; gap: 3px; white-space: nowrap; }

  .add-broker-row { padding: 12px 10px; }
  .add-select {
    background: var(--bg-base); color: var(--text-primary); border: 1px solid var(--border);
    padding: 6px 10px; border-radius: 6px; font-size: 13px; outline: none; min-width: 200px;
  }
  .add-select:focus { border-color: var(--green); }

  .editor-empty {
    text-align: center; padding: 40px 20px; color: var(--text-muted);
    font-size: 14px;
  }
  .editor-empty .icon { font-size: 32px; margin-bottom: 8px; opacity: 0.3; }

  /* ─── Help Panel ─── */
  .help-panel {
    background: var(--bg-card); border-radius: 12px; padding: 16px 20px;
    border: 1px solid var(--border); margin-bottom: 20px;
    border-left: 3px solid var(--blue); position: relative;
  }
  .help-panel.collapsed .help-body { display: none; }
  .help-toggle {
    display: flex; align-items: center; gap: 8px; cursor: pointer;
    font-size: 13px; font-weight: 700; color: var(--blue); user-select: none;
    background: none; border: none; padding: 0; width: 100%;
    text-align: left;
  }
  .help-toggle .arrow { transition: transform 0.2s; font-size: 10px; }
  .help-panel.collapsed .help-toggle .arrow { transform: rotate(-90deg); }
  .help-body { margin-top: 12px; }
  .help-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
  .help-step {
    display: flex; align-items: flex-start; gap: 10px; padding: 10px;
    background: var(--bg-base); border-radius: 8px;
  }
  .help-step .num {
    width: 24px; height: 24px; border-radius: 50%;
    background: var(--blue-glow); color: var(--blue);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; flex-shrink: 0;
  }
  .help-step .step-text { font-size: 12px; color: var(--text-secondary); line-height: 1.4; }
  .help-step .step-text strong { color: var(--text-primary); }
  .help-tips { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px; }
  .help-tip {
    font-size: 11px; color: var(--text-muted); padding: 4px 10px;
    background: var(--bg-base); border-radius: 6px;
  }
  .help-tip code { color: var(--blue); font-size: 10px; background: var(--blue-glow); padding: 1px 4px; border-radius: 3px; }

  /* ─── Drag & Drop ─── */
  .ed-table tr[draggable] { user-select: none; -webkit-user-select: none; }
  .ed-table tr.dragging { opacity: 0.4; }
  .ed-table tr.drag-over-top { box-shadow: inset 0 2px 0 0 var(--blue); }
  .ed-table tr.drag-over-bottom { box-shadow: inset 0 -2px 0 0 var(--blue); }
  .drag-handle {
    cursor: grab; color: var(--text-muted); font-size: 14px; padding: 0 4px;
    display: inline-flex; align-items: center; user-select: none; -webkit-user-select: none;
  }
  .drag-handle:active { cursor: grabbing; }
  tr.dragging .drag-handle { cursor: grabbing; }

  /* ─── Top 10 Boundary ─── */
  .ed-table tr.top10-boundary td {
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 700;
    color: #60a5fa;
    border-top: 2px dashed #3b82f6;
    border-bottom: none;
    background: rgba(59,130,246,0.06);
    letter-spacing: 0.3px;
  }

  /* ─── Label Presets ─── */
  .label-select {
    background: var(--bg-base); color: var(--text-primary); border: 1px solid var(--border);
    padding: 4px 6px; border-radius: 6px; font-size: 12px; width: 140px; outline: none;
  }
  .label-select:focus { border-color: var(--green); }

  /* ─── Apply to Similar ─── */
  .apply-panel {
    background: var(--bg-base); border: 1px solid var(--border); border-radius: 8px;
    padding: 12px; margin-top: 12px; display: none;
  }
  .apply-panel.open { display: block; }
  .apply-panel label { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 13px; cursor: pointer; }
  .apply-panel input[type=checkbox] { accent-color: var(--green); }

  /* ─── Changes Timeline ─── */
  .changes-wrap {
    background: var(--bg-card); border-radius: 12px; padding: 20px;
    border: 1px solid var(--border); margin-bottom: 20px;
  }
  .section-head {
    display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
  }
  .section-head h2 {
    color: var(--text-secondary); font-size: 12px; text-transform: uppercase;
    letter-spacing: 1px; font-weight: 600;
  }
  .section-head .section-icon {
    width: 24px; height: 24px; border-radius: 6px; display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
  }
  .section-head .section-icon.purple { background: var(--purple-glow); color: var(--purple); }
  .timeline { position: relative; padding-left: 24px; }
  .timeline::before {
    content: ''; position: absolute; left: 8px; top: 4px; bottom: 4px;
    width: 2px; background: linear-gradient(180deg, var(--purple) 0%, var(--border) 100%);
    border-radius: 1px;
  }
  .tl-item { position: relative; padding: 6px 0 12px 16px; }
  .tl-item::before {
    content: ''; position: absolute; left: -20px; top: 10px;
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--purple); border: 2px solid var(--bg-card);
  }
  .tl-item:first-child::before { background: var(--green); }
  .tl-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .tl-ranking { font-weight: 700; font-size: 12px; color: var(--green); font-family: monospace; }
  .tl-broker { font-size: 12px; color: var(--text-primary); }
  .tl-detail { font-size: 11px; color: var(--text-muted); }
  .tl-time { font-size: 10px; color: var(--text-muted); font-family: monospace; margin-left: auto; }
  .empty { color: var(--text-muted); font-style: italic; padding: 24px; text-align: center; }

  /* ─── Toast ─── */
  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: var(--bg-card); border: 1px solid var(--green);
    color: var(--green); padding: 12px 20px; border-radius: 10px;
    font-size: 13px; font-weight: 600; z-index: 999;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    animation: toastIn 0.25s ease, toastOut 0.3s ease 1.5s forwards;
  }
  .toast.error { border-color: var(--red); color: var(--red); }
  @keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes toastOut { to { transform: translateY(20px); opacity: 0; } }

  @media (max-width: 768px) {
    .summary-row { grid-template-columns: 1fr; }
    .search { width: 100%; }
    .toolbar { flex-direction: column; align-items: stretch; }
    .editor-head { flex-direction: column; align-items: flex-start; }
    .help-tooltip { width: 280px; right: -8px; }
    .ed-table { font-size: 12px; }
    .ed-table .label-input { width: 100px; }
    .ed-table .notes-input { width: 70px; }
  }
</style>
</head>
<body>
<div class="admin-shell">
${shellHeader}
<div class="admin-body">

<!-- Summary Cards -->
<div class="summary-row">
  <div class="s-card green">
    <div class="s-label">Total Rankings</div>
    <div class="s-value">${totalRankings}</div>
    <div class="s-sub">thematic landing pages</div>
  </div>
  <div class="s-card blue">
    <div class="s-label">Configured</div>
    <div class="s-value">${configuredCount}</div>
    <div class="s-sub">rankings with custom order</div>
  </div>
  <div class="s-card purple">
    <div class="s-label">Brokers</div>
    <div class="s-value">${totalBrokers}</div>
    <div class="s-sub">available for ranking</div>
  </div>
</div>

<!-- Help Panel -->
<div class="help-panel" id="helpPanel">
  <button class="help-toggle" onclick="toggleHelp()">
    <span class="arrow">&#9660;</span> Getting Started — How to manage rankings
  </button>
  <div class="help-body">
    <div class="help-steps">
      <div class="help-step"><span class="num">1</span><span class="step-text"><strong>Find a ranking</strong> — use search or category pills below</span></div>
      <div class="help-step"><span class="num">2</span><span class="step-text"><strong>Click to open</strong> — the editor loads all 38 brokers</span></div>
      <div class="help-step"><span class="num">3</span><span class="step-text"><strong>Reorder brokers</strong> — use ▲▼ arrows or Pin Top 5</span></div>
      <div class="help-step"><span class="num">4</span><span class="step-text"><strong>Save</strong> — changes go live within 5 min (cached)</span></div>
    </div>
    <div class="help-tips">
      <span class="help-tip">Featured labels appear as badges on the live site</span>
      <span class="help-tip">"Apply to Similar" copies your order to same-group rankings</span>
      <span class="help-tip">"Copy From" loads order from any configured ranking</span>
      <span class="help-tip"><code>Cmd+K</code> for quick search</span>
    </div>
  </div>
</div>

<!-- Toolbar -->
<div class="toolbar">
  <input class="search" id="search" type="text" placeholder="Search ranking by name or ID..." autofocus>
  <button class="pill active" data-cat="all" onclick="setCat('all')">All (${totalRankings})</button>
  <button class="pill" data-cat="forex" onclick="setCat('forex')">Forex</button>
  <button class="pill" data-cat="crypto" onclick="setCat('crypto')">Crypto</button>
  <button class="pill" data-cat="assets" onclick="setCat('assets')">Assets</button>
  <button class="pill" data-cat="country" onclick="setCat('country')">Countries</button>
  <button class="pill" data-cat="alt" onclick="setCat('alt')">Alternatives</button>
</div>

<!-- Rankings List -->
<div id="rankingsList"></div>

<!-- Editor (hidden until a ranking is selected) -->
<div id="editorSection" style="display:none">
  <div class="editor-wrap">
    <div class="editor-head">
      <h2 id="editorTitle">—</h2>
      <button class="btn btn-save" id="btnSave" onclick="saveOrder()" disabled>Save Order</button>
      <button class="btn btn-reset" id="btnReset" onclick="resetOrder()">Reset to Natural</button>
      <button class="btn btn-export" onclick="pinTop5()">Pin Top 5</button>
      <a class="btn btn-export" id="btnPreview" href="#" target="_blank" rel="noopener" style="text-decoration:none">View Live &#x2197;</a>
      <button class="btn btn-export" onclick="exportEditorJSON()">Export JSON</button>
      <button class="btn btn-apply" id="btnApply" onclick="toggleApplyPanel()">Apply to Similar</button>
      <button class="btn btn-apply" onclick="toggleCopyPanel()">Copy From...</button>
      <button class="help-btn" title="Quick help">?<div class="help-tooltip"><div class="ht-step"><span class="ht-num">1</span><span class="ht-text"><strong>Drag rows</strong> to reorder brokers — grab and drop</span></div><div class="ht-step"><span class="ht-num">2</span><span class="ht-text"><strong>Top 10</strong> above the blue line = Quick Grid on the live page</span></div><div class="ht-step"><span class="ht-num">3</span><span class="ht-text"><strong>Labels</strong> appear as badges on the live site</span></div><div class="ht-step"><span class="ht-num">4</span><span class="ht-text"><strong>Save</strong> — changes go live within 5 min (cached)</span></div></div></button>
    </div>
    <div id="editorBody">
      <div class="editor-empty"><div class="icon">&#9776;</div>Loading...</div>
    </div>
    <div class="apply-panel" id="applyPanel"></div>
    <div class="apply-panel" id="copyPanel"></div>
  </div>
</div>

<!-- Recent Changes -->
<div class="changes-wrap">
  <div class="section-head">
    <div class="section-icon purple">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    </div>
    <h2>Recent Changes</h2>
    <span style="font-size:10px;color:var(--text-muted);margin-left:auto">Last 30 overrides</span>
  </div>
  <div id="timeline" class="timeline"></div>
</div>

</div>
${shellFooter}
</div>

<script>
const ENC_KEY = '${encodedKey}';
const RANKINGS = ${rankingsJson};
const GROUPS = ${groupsJson};
const OVERRIDE_MAP = ${overrideMapJson};
const CHANGES = ${changesJson};

const LABEL_PRESETS = ['Top Pick','Editor\\'s Choice','Best Value','Best for Beginners','Lowest Spreads','Most Trusted'];

let currentCat = 'all';
let selectedRankingId = null;
let editorBrokers = [];
let hasChanges = false;

// ─── HELP PANEL ───
function toggleHelp() {
  const panel = document.getElementById('helpPanel');
  panel.classList.toggle('collapsed');
  localStorage.setItem('rb-help-collapsed', panel.classList.contains('collapsed') ? '1' : '');
}
if (localStorage.getItem('rb-help-collapsed') === '1') {
  document.getElementById('helpPanel').classList.add('collapsed');
}

// ─── LABEL PRESET CONTROL ───
function labelControl(slug, currentVal) {
  const isCustom = currentVal && !LABEL_PRESETS.includes(currentVal);
  const selectId = 'lbl-sel-' + slug.replace(/[^a-z0-9]/g,'');
  const inputId = 'lbl-inp-' + slug.replace(/[^a-z0-9]/g,'');

  let html = '<select class="label-select" id="'+selectId+'" onchange="onLabelSelect(\\''+slug+'\\',this)">';
  html += '<option value="">— none —</option>';
  for (const p of LABEL_PRESETS) {
    html += '<option value="'+e(p)+'"'+(currentVal === p ? ' selected' : '')+'>'+e(p)+'</option>';
  }
  html += '<option value="__custom"'+(isCustom ? ' selected' : '')+'>Custom...</option>';
  html += '</select>';
  html += '<input class="label-input" id="'+inputId+'" value="'+e(isCustom ? currentVal : '')+'" placeholder="Custom label" style="display:'+(isCustom ? 'inline-block' : 'none')+';width:120px;margin-left:4px" onchange="setLabel(\\''+slug+'\\',this.value)">';
  return html;
}

function onLabelSelect(slug, selectEl) {
  const val = selectEl.value;
  const inputId = 'lbl-inp-' + slug.replace(/[^a-z0-9]/g,'');
  const inputEl = document.getElementById(inputId);

  if (val === '__custom') {
    inputEl.style.display = 'inline-block';
    inputEl.focus();
    // keep current label if custom was already set
  } else {
    inputEl.style.display = 'none';
    setLabel(slug, val);
  }
}

function e(s) { return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;') : ''; }

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const then = new Date(dateStr + (dateStr.includes('Z') ? '' : 'Z'));
  const mins = Math.floor((now - then) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  if (days < 30) return days + 'd ago';
  return dateStr.slice(0, 10);
}

// ─── RENDER RANKINGS LIST ───
function renderList() {
  const q = document.getElementById('search').value.toLowerCase();
  const container = document.getElementById('rankingsList');

  // Group rankings
  const groupMap = {};
  for (const g of GROUPS) groupMap[g.code] = { ...g, items: [] };
  for (const r of RANKINGS) {
    if (groupMap[r.group]) groupMap[r.group].items.push(r);
  }

  let html = '';
  for (const g of GROUPS) {
    const gd = groupMap[g.code];
    if (!gd.items.length) continue;

    // Category filter
    if (currentCat !== 'all' && g.cat !== currentCat) continue;

    // Search filter on items
    const filtered = gd.items.filter(r =>
      !q || r.title.toLowerCase().includes(q) || r.id.includes(q)
    );
    if (!filtered.length) continue;

    const isOpen = currentCat !== 'all' || q;
    html += '<div class="group">';
    html += '<div class="group-head" onclick="toggleGroup(this)">';
    html += '<span class="arrow'+(isOpen ? ' open' : '')+'">&#9654;</span>';
    html += '<span class="code">' + g.code + '</span>';
    html += '<span class="label">' + e(g.label) + '</span>';
    html += '<span class="count">' + filtered.length + ' rankings</span>';
    html += '</div>';
    html += '<div class="group-body'+(isOpen ? ' open' : '')+'">';
    for (const r of filtered) {
      const isConfigured = !!OVERRIDE_MAP[r.id];
      const isSelected = r.id === selectedRankingId;
      html += '<div class="r-item'+(isSelected ? ' selected' : '')+'" onclick="selectRanking(\\''+r.id+'\\')">';
      html += '<span class="r-title">' + e(r.title) + '</span>';
      html += '<span class="r-id">' + r.id + '</span>';
      html += '<span class="priority p'+r.priority+'">P'+r.priority+'</span>';
      html += '<span class="status-dot '+(isConfigured ? 'configured' : 'natural')+'" title="'+(isConfigured ? 'Configured ('+OVERRIDE_MAP[r.id]+' brokers)' : 'Natural order')+'"></span>';
      html += '</div>';
    }
    html += '</div></div>';
  }

  if (!html) html = '<div class="empty">No rankings match your search</div>';
  container.innerHTML = html;
}

function toggleGroup(el) {
  const arrow = el.querySelector('.arrow');
  const body = el.nextElementSibling;
  arrow.classList.toggle('open');
  body.classList.toggle('open');
}

function setCat(cat) {
  currentCat = cat;
  document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.dataset.cat === cat));
  renderList();
}

document.getElementById('search').addEventListener('input', renderList);

// ─── SELECT RANKING → LOAD EDITOR ───
async function selectRanking(id) {
  selectedRankingId = id;
  hasChanges = false;
  renderList();

  const section = document.getElementById('editorSection');
  section.style.display = 'block';
  const body = document.getElementById('editorBody');
  body.innerHTML = '<div class="editor-empty"><div class="icon">&#8987;</div>Loading brokers...</div>';

  const r = RANKINGS.find(x => x.id === id);
  document.getElementById('editorTitle').textContent = r ? r.title : id;
  document.getElementById('btnSave').disabled = true;

  // Update preview link
  const previewBtn = document.getElementById('btnPreview');
  previewBtn.href = 'https://ratedbrokers.com/best/' + id;

  try {
    const res = await fetch('/api/admin/rankings/' + id + '/brokers?key=' + ENC_KEY);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    editorBrokers = data.brokers;
    renderEditor();
  } catch (err) {
    body.innerHTML = '<div class="editor-empty" style="color:var(--red)">Error: ' + e(err.message) + '</div>';
  }
}

// ─── RENDER EDITOR TABLE ───
function renderEditor() {
  const body = document.getElementById('editorBody');

  // Separate: pinned (position > 0, not hidden), hidden, rest
  const pinned = editorBrokers.filter(b => b.position > 0 && !b.hidden).sort((a,b) => a.position - b.position);
  const hidden = editorBrokers.filter(b => b.hidden);
  const rest = editorBrokers.filter(b => !b.position && !b.hidden).sort((a,b) => a.name.localeCompare(b.name));

  const ordered = [...pinned, ...rest];

  let html = '<table class="ed-table"><thead><tr>';
  html += '<th style="width:24px"></th>';
  html += '<th style="width:32px">#</th>';
  html += '<th>Broker</th>';
  html += '<th style="text-align:right;width:60px">30d</th>';
  html += '<th style="width:150px">Label</th>';
  html += '<th style="width:100px">Notes</th>';
  html += '<th style="width:70px">Status</th>';
  html += '<th style="width:110px">Actions</th>';
  html += '</tr></thead><tbody>';

  ordered.forEach((b, i) => {
    const isPinned = b.position > 0;
    html += '<tr data-slug="'+b.slug+'" draggable="true">';
    html += '<td><span class="drag-handle" title="Drag to reorder">&#9776;</span></td>';
    html += '<td class="pos">' + (i + 1) + '</td>';
    html += '<td><span class="broker-name">' + e(b.name) + '</span><br><span class="broker-slug">' + b.slug + '</span></td>';
    html += '<td class="clicks">' + b.clicks_30d + '</td>';
    html += '<td>' + labelControl(b.slug, b.featured_label) + '</td>';
    html += '<td><input class="notes-input" value="' + e(b.notes) + '" placeholder="notes" onchange="setNotes(\\''+b.slug+'\\',this.value)"></td>';
    html += '<td><span class="status-badge '+(isPinned ? 'pinned' : 'natural')+'">'+(isPinned ? 'Pinned' : 'Natural')+'</span></td>';
    html += '<td class="ed-actions">';
    html += '<button class="move-btn" onclick="moveUp(\\''+b.slug+'\\')" title="Move up">&#9650;</button>';
    html += '<button class="move-btn" onclick="moveDown(\\''+b.slug+'\\')" title="Move down">&#9660;</button>';
    html += '<button class="hide-btn" onclick="toggleHide(\\''+b.slug+'\\')" title="Hide from ranking">&#10005;</button>';
    html += '</td></tr>';
    // Top 10 at a Glance boundary marker
    if (i === 9 && ordered.length > 10) {
      html += '<tr class="top10-boundary"><td colspan="8">&#9650; Top 10 at a Glance — brokers above appear in the quick grid on live page</td></tr>';
    }
  });

  // Hidden brokers
  if (hidden.length > 0) {
    html += '<tr><td colspan="8" style="padding:12px 10px;color:var(--text-muted);font-size:12px;font-weight:600;border-top:2px solid var(--border)">HIDDEN (' + hidden.length + ')</td></tr>';
    for (const b of hidden) {
      html += '<tr class="hidden-row" data-slug="'+b.slug+'">';
      html += '<td></td>';
      html += '<td class="pos" style="color:var(--text-muted)">—</td>';
      html += '<td><span class="broker-name">' + e(b.name) + '</span><br><span class="broker-slug">' + b.slug + '</span></td>';
      html += '<td class="clicks">' + b.clicks_30d + '</td>';
      html += '<td></td>';
      html += '<td><input class="notes-input" value="' + e(b.notes) + '" onchange="setNotes(\\''+b.slug+'\\',this.value)"></td>';
      html += '<td><span class="status-badge hidden">Hidden</span></td>';
      html += '<td class="ed-actions"><button class="hide-btn is-hidden" onclick="toggleHide(\\''+b.slug+'\\')" title="Show in ranking">&#128065;</button></td>';
      html += '</tr>';
    }
  }

  html += '</tbody></table>';
  body.innerHTML = html;
  document.getElementById('btnSave').disabled = !hasChanges;
  initDragDrop();
}

// ─── DRAG & DROP (mouse-based, handle-only) ───
function initDragDrop() {
  const rows = document.querySelectorAll('.ed-table tbody tr[draggable]');
  let dragSlug = null;
  let dragRow = null;
  let placeholder = null;

  rows.forEach(row => {
    const handle = row.querySelector('.drag-handle');
    if (!handle) return;

    // Only the handle initiates native drag
    handle.addEventListener('mousedown', () => {
      row.setAttribute('draggable', 'true');
    });

    // Prevent drag from starting on non-handle clicks
    row.addEventListener('mousedown', ev => {
      if (!ev.target.closest('.drag-handle')) {
        row.setAttribute('draggable', 'false');
      }
    });

    row.addEventListener('dragstart', ev => {
      if (!ev.target.closest('tr')?.querySelector('.drag-handle')) { ev.preventDefault(); return; }
      dragSlug = row.dataset.slug;
      dragRow = row;
      row.classList.add('dragging');
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', dragSlug);
      // Transparent drag image (row itself is dimmed)
      const img = document.createElement('div');
      img.style.cssText = 'position:absolute;top:-9999px';
      document.body.appendChild(img);
      ev.dataTransfer.setDragImage(img, 0, 0);
      setTimeout(() => img.remove(), 0);
    });

    row.addEventListener('dragend', () => {
      if (dragRow) dragRow.classList.remove('dragging');
      dragSlug = null;
      dragRow = null;
      rows.forEach(r => { r.classList.remove('drag-over-top', 'drag-over-bottom'); r.setAttribute('draggable', 'true'); });
    });

    row.addEventListener('dragover', ev => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      if (!dragSlug || row.dataset.slug === dragSlug) return;
      const rect = row.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      rows.forEach(r => r.classList.remove('drag-over-top', 'drag-over-bottom'));
      if (ev.clientY < midY) {
        row.classList.add('drag-over-top');
      } else {
        row.classList.add('drag-over-bottom');
      }
    });

    row.addEventListener('dragleave', () => {
      row.classList.remove('drag-over-top', 'drag-over-bottom');
    });

    row.addEventListener('drop', ev => {
      ev.preventDefault();
      rows.forEach(r => r.classList.remove('drag-over-top', 'drag-over-bottom'));
      if (!dragSlug || row.dataset.slug === dragSlug) return;

      const pinned = editorBrokers.filter(b => b.position > 0 && !b.hidden).sort((a,b) => a.position - b.position);
      const rest = editorBrokers.filter(b => !b.position && !b.hidden).sort((a,b) => a.name.localeCompare(b.name));
      const ordered = [...pinned, ...rest];

      const fromIdx = ordered.findIndex(b => b.slug === dragSlug);
      const toRow = row.dataset.slug;
      let toIdx = ordered.findIndex(b => b.slug === toRow);
      if (fromIdx < 0 || toIdx < 0) return;

      const rect = row.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const insertAfter = ev.clientY >= midY;

      const [moved] = ordered.splice(fromIdx, 1);
      toIdx = ordered.findIndex(b => b.slug === toRow);
      const insertIdx = insertAfter ? toIdx + 1 : toIdx;
      ordered.splice(insertIdx, 0, moved);

      ordered.forEach((b, i) => { b.position = i + 1; });

      markChanged();
      renderEditor();
    });
  });
}

// ─── EDITOR ACTIONS ───
function markChanged() {
  hasChanges = true;
  document.getElementById('btnSave').disabled = false;
}

function moveUp(slug) {
  const pinned = editorBrokers.filter(b => b.position > 0 && !b.hidden).sort((a,b) => a.position - b.position);
  const rest = editorBrokers.filter(b => !b.position && !b.hidden).sort((a,b) => a.name.localeCompare(b.name));
  const ordered = [...pinned, ...rest];

  const idx = ordered.findIndex(b => b.slug === slug);
  if (idx <= 0) return;

  // If moving from rest into pinned territory, assign positions
  const target = ordered[idx];
  const above = ordered[idx - 1];

  // Ensure both have positions
  if (!target.position) target.position = idx + 1;
  if (!above.position) above.position = idx;

  // Swap positions
  const tmp = target.position;
  target.position = above.position;
  above.position = tmp;

  markChanged();
  renderEditor();
}

function moveDown(slug) {
  const pinned = editorBrokers.filter(b => b.position > 0 && !b.hidden).sort((a,b) => a.position - b.position);
  const rest = editorBrokers.filter(b => !b.position && !b.hidden).sort((a,b) => a.name.localeCompare(b.name));
  const ordered = [...pinned, ...rest];

  const idx = ordered.findIndex(b => b.slug === slug);
  if (idx < 0 || idx >= ordered.length - 1) return;

  const target = ordered[idx];
  const below = ordered[idx + 1];

  if (!target.position) target.position = idx + 1;
  if (!below.position) below.position = idx + 2;

  const tmp = target.position;
  target.position = below.position;
  below.position = tmp;

  markChanged();
  renderEditor();
}

function toggleHide(slug) {
  const b = editorBrokers.find(x => x.slug === slug);
  if (!b) return;
  b.hidden = b.hidden ? 0 : 1;
  if (b.hidden) b.position = 0;
  markChanged();
  renderEditor();
}

function setLabel(slug, val) {
  const b = editorBrokers.find(x => x.slug === slug);
  if (b) { b.featured_label = val; markChanged(); }
}

function setNotes(slug, val) {
  const b = editorBrokers.find(x => x.slug === slug);
  if (b) { b.notes = val; markChanged(); }
}

// ─── SAVE ORDER ───
async function saveOrder() {
  if (!selectedRankingId) return;
  const btn = document.getElementById('btnSave');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  // Build payload: only brokers that have been modified (pinned, hidden, or have labels/notes)
  const payload = editorBrokers.filter(b =>
    b.position > 0 || b.hidden || b.featured_label || b.notes
  ).map(b => ({
    slug: b.slug,
    position: b.position || 0,
    featured_label: b.featured_label || '',
    hidden: b.hidden ? true : false,
    notes: b.notes || '',
  }));

  if (payload.length === 0) {
    showToast('Nothing to save — no overrides set', true);
    btn.disabled = false;
    btn.textContent = 'Save Order';
    return;
  }

  try {
    const res = await fetch('/api/admin/rankings/' + selectedRankingId + '/order?key=' + ENC_KEY, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    hasChanges = false;
    OVERRIDE_MAP[selectedRankingId] = payload.length;
    renderList();
    showToast('Saved ' + payload.length + ' overrides for ' + selectedRankingId);
  } catch (err) {
    showToast('Error: ' + err.message, true);
  }

  btn.disabled = false;
  btn.textContent = 'Save Order';
}

// ─── RESET ───
async function resetOrder() {
  if (!selectedRankingId) return;
  if (!confirm('Reset all overrides for this ranking to natural order?')) return;

  try {
    const res = await fetch('/api/admin/rankings/' + selectedRankingId + '/overrides?key=' + ENC_KEY, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed');

    delete OVERRIDE_MAP[selectedRankingId];
    renderList();
    showToast('Reset to natural order');
    selectRanking(selectedRankingId);
  } catch (err) {
    showToast('Error: ' + err.message, true);
  }
}

// ─── EXPORT ───
function exportEditorJSON() {
  if (!selectedRankingId) return;
  const data = {
    ranking_id: selectedRankingId,
    brokers: editorBrokers.filter(b => b.position > 0 || b.hidden || b.featured_label).map(b => ({
      slug: b.slug, position: b.position, featured_label: b.featured_label || undefined,
      hidden: b.hidden ? true : undefined, notes: b.notes || undefined,
    })),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ranking-' + selectedRankingId + '.json';
  a.click();
  showToast('Exported ranking config');
}

// ─── PIN TOP 5 ───
function pinTop5() {
  if (!editorBrokers.length) return;
  const pinned = editorBrokers.filter(b => b.position > 0 && !b.hidden).sort((a,b) => a.position - b.position);
  const rest = editorBrokers.filter(b => !b.position && !b.hidden).sort((a,b) => a.name.localeCompare(b.name));
  const ordered = [...pinned, ...rest];

  for (let i = 0; i < Math.min(5, ordered.length); i++) {
    ordered[i].position = i + 1;
  }
  markChanged();
  renderEditor();
  showToast('Pinned top 5 brokers');
}

// ─── COPY FROM ───
function toggleCopyPanel() {
  const panel = document.getElementById('copyPanel');
  panel.classList.toggle('open');
  if (!panel.classList.contains('open')) return;

  // Show only configured rankings (those in OVERRIDE_MAP)
  const configured = RANKINGS.filter(r => OVERRIDE_MAP[r.id] && r.id !== selectedRankingId);
  if (!configured.length) {
    panel.innerHTML = '<div style="color:var(--text-muted);font-size:13px">No other configured rankings to copy from</div>';
    return;
  }

  let html = '<div style="margin-bottom:8px;font-size:12px;color:var(--text-secondary);font-weight:600">Load order from:</div>';
  html += '<select class="add-select" id="copySource" style="min-width:300px">';
  for (const r of configured) {
    html += '<option value="'+r.id+'">'+e(r.title)+' ('+OVERRIDE_MAP[r.id]+' overrides)</option>';
  }
  html += '</select>';
  html += '<button class="btn btn-save" style="margin-left:8px" onclick="copyFrom()">Load</button>';
  panel.innerHTML = html;
}

async function copyFrom() {
  const sel = document.getElementById('copySource');
  if (!sel) return;
  const sourceId = sel.value;
  if (!sourceId) return;

  try {
    const res = await fetch('/api/admin/rankings/' + sourceId + '/brokers?key=' + ENC_KEY);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // Apply source overrides to current editor
    const sourceMap = {};
    for (const sb of data.brokers) {
      if (sb.position > 0 || sb.hidden || sb.featured_label) sourceMap[sb.slug] = sb;
    }

    for (const b of editorBrokers) {
      const src = sourceMap[b.slug];
      if (src) {
        b.position = src.position;
        b.featured_label = src.featured_label;
        b.hidden = src.hidden;
        b.notes = src.notes;
      } else {
        b.position = 0;
        b.featured_label = '';
        b.hidden = 0;
        b.notes = '';
      }
    }

    markChanged();
    renderEditor();
    document.getElementById('copyPanel').classList.remove('open');
    showToast('Copied order from ' + sourceId);
  } catch (err) {
    showToast('Error: ' + err.message, true);
  }
}

// ─── APPLY TO SIMILAR ───
function toggleApplyPanel() {
  const panel = document.getElementById('applyPanel');
  panel.classList.toggle('open');
  if (!panel.classList.contains('open')) return;

  const r = RANKINGS.find(x => x.id === selectedRankingId);
  if (!r) return;

  const sameGroup = RANKINGS.filter(x => x.group === r.group && x.id !== selectedRankingId);
  if (!sameGroup.length) {
    panel.innerHTML = '<div style="color:var(--text-muted);font-size:13px">No other rankings in this group</div>';
    return;
  }

  let html = '<div style="margin-bottom:8px;font-size:12px;color:var(--text-secondary);font-weight:600">Apply current order to:</div>';
  for (const s of sameGroup) {
    html += '<label><input type="checkbox" value="'+s.id+'"> '+e(s.title)+' <span style="color:var(--text-muted);font-size:10px">('+s.id+')</span></label>';
  }
  html += '<div style="margin-top:8px"><button class="btn btn-save" onclick="applyToSelected()">Apply</button></div>';
  panel.innerHTML = html;
}

async function applyToSelected() {
  const panel = document.getElementById('applyPanel');
  const checked = [...panel.querySelectorAll('input[type=checkbox]:checked')].map(c => c.value);
  if (!checked.length) { showToast('Select at least one ranking', true); return; }

  const payload = editorBrokers.filter(b =>
    b.position > 0 || b.hidden || b.featured_label || b.notes
  ).map(b => ({
    slug: b.slug, position: b.position || 0,
    featured_label: b.featured_label || '', hidden: b.hidden ? true : false,
    notes: b.notes || '',
  }));

  if (!payload.length) { showToast('No overrides to apply', true); return; }

  let ok = 0, fail = 0;
  for (const id of checked) {
    try {
      const res = await fetch('/api/admin/rankings/' + id + '/order?key=' + ENC_KEY, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) { ok++; OVERRIDE_MAP[id] = payload.length; } else fail++;
    } catch { fail++; }
  }

  renderList();
  panel.classList.remove('open');
  showToast('Applied to ' + ok + ' rankings' + (fail ? ', ' + fail + ' failed' : ''));
}

// ─── RENDER CHANGES TIMELINE ───
function renderChanges() {
  const container = document.getElementById('timeline');
  if (!CHANGES.length) {
    container.innerHTML = '<div class="empty">No changes yet</div>';
    return;
  }

  // Build ranking title map for display
  const titleMap = {};
  for (const r of RANKINGS) titleMap[r.id] = r.title;

  container.innerHTML = CHANGES.map(c => {
    const label = c.featured_label ? ' — "' + e(c.featured_label) + '"' : '';
    const action = c.hidden ? 'hidden' : '#' + c.position;
    return '<div class="tl-item">' +
      '<div class="tl-head">' +
        '<span class="tl-ranking">' + e(c.ranking_id) + '</span>' +
        '<span class="tl-broker">' + e(c.broker_slug) + ' &rarr; ' + action + label + '</span>' +
        '<span class="tl-time">' + timeAgo(c.updated_at) + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ─── TOAST ───
function showToast(msg, isError) {
  const t = document.createElement('div');
  t.className = 'toast' + (isError ? ' error' : '');
  t.innerHTML = (isError ? '&#10006; ' : '&#10003; ') + e(msg);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

// ─── INIT ───
renderList();
renderChanges();

document.addEventListener('keydown', ev => {
  if ((ev.metaKey || ev.ctrlKey) && ev.key === 'k') { ev.preventDefault(); document.getElementById('search').focus(); }
});

${shellScript}
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
