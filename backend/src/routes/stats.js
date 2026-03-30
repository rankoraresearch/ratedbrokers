import { corsHeaders } from '../utils/cors.js';
import { adminHeaderCSS, adminHeaderHTML, adminHeaderScript } from '../utils/adminLayout.js';

function checkApiKey(request, env) {
  const key = request.headers.get('X-API-Key');
  return key && key === env.API_KEY;
}

function checkDashboardKey(url, env) {
  const key = url.searchParams.get('key');
  return key && key === env.API_KEY;
}

export async function handleStats(request, env) {
  const headers = corsHeaders(request);

  if (!checkApiKey(request, env)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  const [today, week, month, allTime, topBrokers, clicksByDay, topCountries, topReferrers] =
    await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-7 days')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-30 days')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks`).first(),
      env.DB.prepare(`SELECT broker_slug, COUNT(*) as clicks FROM clicks GROUP BY broker_slug ORDER BY clicks DESC LIMIT 20`).all(),
      env.DB.prepare(`SELECT date(created_at) as day, COUNT(*) as clicks FROM clicks WHERE created_at >= date('now', '-30 days') GROUP BY day ORDER BY day`).all(),
      env.DB.prepare(`SELECT country, COUNT(*) as clicks FROM clicks WHERE country IS NOT NULL GROUP BY country ORDER BY clicks DESC LIMIT 20`).all(),
      env.DB.prepare(`SELECT referrer, COUNT(*) as clicks FROM clicks WHERE referrer IS NOT NULL AND referrer != '' GROUP BY referrer ORDER BY clicks DESC LIMIT 20`).all(),
    ]);

  return Response.json({
    clicks: {
      today: today.count,
      week: week.count,
      month: month.count,
      allTime: allTime.count,
    },
    topBrokers: topBrokers.results,
    clicksByDay: clicksByDay.results,
    topCountries: topCountries.results,
    topReferrers: topReferrers.results,
  }, { headers });
}

export async function handleDashboard(request, env) {
  const url = new URL(request.url);

  if (!checkDashboardKey(url, env)) {
    return new Response('Unauthorized. Add ?key=YOUR_API_KEY', {
      status: 401,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const key = url.searchParams.get('key');
  const encodedKey = encodeURIComponent(key);

  // Fetch all data in parallel
  const [today, week, month, allTime, topBrokers, clicksByDay, clicksByDay7, clicksByDay90, topCountries, topReferrers, recentClicks, brokerNames] =
    await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-7 days')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-30 days')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks`).first(),
      env.DB.prepare(`SELECT broker_slug, COUNT(*) as clicks FROM clicks GROUP BY broker_slug ORDER BY clicks DESC`).all(),
      env.DB.prepare(`SELECT date(created_at) as day, COUNT(*) as clicks FROM clicks WHERE created_at >= date('now', '-30 days') GROUP BY day ORDER BY day`).all(),
      env.DB.prepare(`SELECT date(created_at) as day, COUNT(*) as clicks FROM clicks WHERE created_at >= date('now', '-7 days') GROUP BY day ORDER BY day`).all(),
      env.DB.prepare(`SELECT date(created_at) as day, COUNT(*) as clicks FROM clicks WHERE created_at >= date('now', '-90 days') GROUP BY day ORDER BY day`).all(),
      env.DB.prepare(`SELECT country, COUNT(*) as clicks FROM clicks WHERE country IS NOT NULL GROUP BY country ORDER BY clicks DESC LIMIT 15`).all(),
      env.DB.prepare(`SELECT referrer, COUNT(*) as clicks FROM clicks WHERE referrer IS NOT NULL AND referrer != '' GROUP BY referrer ORDER BY clicks DESC LIMIT 15`).all(),
      env.DB.prepare(`SELECT broker_slug, country, referrer, created_at FROM clicks ORDER BY created_at DESC LIMIT 30`).all(),
      env.DB.prepare(`SELECT slug, name FROM brokers`).all(),
    ]);

  // Build name map
  const nameMap = {};
  brokerNames.results.forEach(b => { nameMap[b.slug] = b.name; });

  // Prepare JSON data for client
  const chartsData = JSON.stringify({
    days30: clicksByDay.results,
    days7: clicksByDay7.results,
    days90: clicksByDay90.results,
  });

  const brokersData = JSON.stringify(topBrokers.results.map(b => ({
    slug: b.broker_slug,
    name: nameMap[b.broker_slug] || b.broker_slug,
    clicks: b.clicks,
  })));

  const countriesData = JSON.stringify(topCountries.results);

  // Clean referrers — show only domain
  const cleanReferrers = topReferrers.results.map(r => {
    let domain = r.referrer;
    try { domain = new URL(r.referrer).hostname.replace(/^www\./, ''); } catch {}
    return { referrer: domain, clicks: r.clicks };
  });
  // Merge same domains
  const mergedRefs = {};
  cleanReferrers.forEach(r => { mergedRefs[r.referrer] = (mergedRefs[r.referrer] || 0) + r.clicks; });
  const referrersClean = Object.entries(mergedRefs).map(([referrer, clicks]) => ({ referrer, clicks })).sort((a, b) => b.clicks - a.clicks);

  const recentData = JSON.stringify(recentClicks.results.map(c => ({
    slug: c.broker_slug,
    name: nameMap[c.broker_slug] || c.broker_slug,
    country: c.country || '—',
    referrer: (() => { try { return new URL(c.referrer).hostname.replace(/^www\./, ''); } catch { return c.referrer || 'direct'; } })(),
    time: c.created_at,
  })));

  const shellCSS = adminHeaderCSS();
  const shellHeader = adminHeaderHTML('clicks', encodedKey);
  const shellScript = adminHeaderScript();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RatedBrokers — Click Dashboard</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"><\/script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f1117; color: #e0e0e0; }
  ${shellCSS}
  h2 { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
  .card { background: #1a1d27; border-radius: 10px; padding: 16px; }
  .card .value { font-size: 28px; font-weight: 700; color: #4ade80; font-variant-numeric: tabular-nums; }
  .card .label { font-size: 12px; color: #666; margin-top: 2px; }
  .period-bar { display: flex; gap: 6px; margin-bottom: 16px; }
  .period-btn { background: #1a1d27; color: #888; border: 1px solid #2a2d37; padding: 5px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .period-btn:hover { color: #e0e0e0; }
  .period-btn.active { border-color: #4ade80; color: #4ade80; background: rgba(74,222,128,0.08); }
  .chart-wrap { background: #1a1d27; border-radius: 10px; padding: 16px; margin-bottom: 24px; }
  canvas { max-height: 260px; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .panel { background: #1a1d27; border-radius: 10px; padding: 16px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 7px 10px; border-bottom: 1px solid #22252f; font-size: 13px; }
  th { color: #666; font-weight: 600; }
  td:last-child { text-align: right; font-variant-numeric: tabular-nums; }
  .rank { color: #555; font-size: 11px; width: 24px; }
  .broker-name { font-weight: 600; color: #e0e0e0; }
  .broker-slug { color: #555; font-size: 11px; margin-left: 6px; }
  .bar-cell { width: 40%; }
  .bar-bg { background: #22252f; border-radius: 3px; height: 16px; position: relative; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #059669, #4ade80); transition: width 0.4s ease; }
  .country-flag { font-size: 16px; margin-right: 6px; }
  .live-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; display: inline-block; margin-right: 6px; animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  .live-table td { font-size: 12px; padding: 5px 8px; }
  .live-table .time { color: #555; font-size: 11px; white-space: nowrap; }
  .live-table .country { color: #888; }
  .live-table .ref { color: #666; font-size: 11px; }
  .empty { color: #444; font-style: italic; text-align: center; padding: 20px; }
  @media (max-width: 900px) { .grid2, .grid3 { grid-template-columns: 1fr; } .cards { grid-template-columns: repeat(2, 1fr); } }
</style>
</head>
<body>
<div class="admin-shell">
${shellHeader}
<div class="admin-body">

<div class="cards">
  <div class="card"><div class="value">${today.count}</div><div class="label">Today</div></div>
  <div class="card"><div class="value">${week.count}</div><div class="label">Last 7 days</div></div>
  <div class="card"><div class="value">${month.count}</div><div class="label">Last 30 days</div></div>
  <div class="card"><div class="value">${allTime.count}</div><div class="label">All time</div></div>
</div>

<div class="period-bar">
  <button class="period-btn" data-period="7" onclick="setPeriod(7)">7 days</button>
  <button class="period-btn active" data-period="30" onclick="setPeriod(30)">30 days</button>
  <button class="period-btn" data-period="90" onclick="setPeriod(90)">90 days</button>
</div>

<div class="chart-wrap">
  <h2>Clicks Over Time</h2>
  <canvas id="timeChart"></canvas>
</div>

<div class="grid2">
  <div class="panel">
    <h2>Top Brokers</h2>
    <table id="brokersTable"></table>
  </div>
  <div class="panel">
    <h2>Clicks by Broker</h2>
    <canvas id="brokerChart" style="max-height:340px"></canvas>
  </div>
</div>

<div class="grid3">
  <div class="panel">
    <h2>Top Countries</h2>
    <canvas id="countryChart" style="max-height:240px"></canvas>
    <table id="countriesTable" style="margin-top:12px"></table>
  </div>
  <div class="panel">
    <h2>Top Referrers</h2>
    <table id="referrersTable"></table>
  </div>
  <div class="panel">
    <h2><span class="live-dot"></span>Recent Clicks</h2>
    <table class="live-table" id="liveTable"></table>
  </div>
</div>

<script>
const CHARTS_DATA = ${chartsData};
const BROKERS = ${brokersData};
const COUNTRIES = ${countriesData};
const REFERRERS = ${JSON.stringify(referrersClean)};
const RECENT = ${recentData};

// ─── TIME CHART ───
let timeChart;
function initTimeChart() {
  const ctx = document.getElementById('timeChart');
  timeChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: [], datasets: [{ label: 'Clicks', data: [], backgroundColor: '#4ade80', borderRadius: 3, barPercentage: 0.7 }] },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a1d27', titleColor: '#e0e0e0', bodyColor: '#4ade80', borderColor: '#2a2d37', borderWidth: 1 } },
      scales: {
        x: { ticks: { color: '#555', maxRotation: 0, autoSkip: true, maxTicksLimit: 15, font: { size: 11 } }, grid: { display: false } },
        y: { ticks: { color: '#555', font: { size: 11 } }, grid: { color: '#1e2130' }, beginAtZero: true },
      },
    },
  });
  setPeriod(30);
}

function setPeriod(days) {
  document.querySelectorAll('.period-btn').forEach(b => b.classList.toggle('active', +b.dataset.period === days));
  const key = 'days' + days;
  const data = CHARTS_DATA[key] || [];
  timeChart.data.labels = data.map(r => { const d = r.day.split('-'); return d[1]+'/'+d[2]; });
  timeChart.data.datasets[0].data = data.map(r => r.clicks);
  timeChart.update();
}

// ─── BROKER TABLE + BAR CHART ───
function renderBrokers() {
  const top = BROKERS.slice(0, 20);
  const maxClicks = top.length > 0 ? top[0].clicks : 1;

  document.getElementById('brokersTable').innerHTML =
    '<tr><th style="width:24px">#</th><th>Broker</th><th class="bar-cell"></th><th>Clicks</th></tr>' +
    top.map((b, i) => {
      const pct = Math.round((b.clicks / maxClicks) * 100);
      return '<tr>' +
        '<td class="rank">' + (i+1) + '</td>' +
        '<td><span class="broker-name">' + esc(b.name) + '</span><span class="broker-slug">' + b.slug + '</span></td>' +
        '<td class="bar-cell"><div class="bar-bg"><div class="bar-fill" style="width:'+pct+'%"></div></div></td>' +
        '<td>' + b.clicks + '</td></tr>';
    }).join('') || '<tr><td colspan="4" class="empty">No clicks yet</td></tr>';

  // Horizontal bar chart
  const chartTop = top.slice(0, 12);
  new Chart(document.getElementById('brokerChart'), {
    type: 'bar',
    data: {
      labels: chartTop.map(b => b.name),
      datasets: [{
        data: chartTop.map(b => b.clicks),
        backgroundColor: chartTop.map((_, i) => i === 0 ? '#4ade80' : i < 3 ? '#059669' : '#1e4d3a'),
        borderRadius: 4,
        barPercentage: 0.65,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#555', font: { size: 11 } }, grid: { color: '#1e2130' }, beginAtZero: true },
        y: { ticks: { color: '#ccc', font: { size: 12, weight: 600 } }, grid: { display: false } },
      },
    },
  });
}

// ─── COUNTRIES ───
function renderCountries() {
  const top = COUNTRIES.slice(0, 10);
  const total = top.reduce((s, c) => s + c.clicks, 0) || 1;

  // Doughnut chart
  const colors = ['#4ade80','#059669','#34d399','#10b981','#047857','#065f46','#064e3b','#60a5fa','#3b82f6','#2563eb'];
  new Chart(document.getElementById('countryChart'), {
    type: 'doughnut',
    data: {
      labels: top.map(c => c.country || 'Unknown'),
      datasets: [{
        data: top.map(c => c.clicks),
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 4,
      }],
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#1a1d27', titleColor: '#e0e0e0', bodyColor: '#4ade80', borderColor: '#2a2d37', borderWidth: 1 },
      },
    },
  });

  document.getElementById('countriesTable').innerHTML =
    top.map(c => {
      const pct = Math.round((c.clicks / total) * 100);
      return '<tr><td>' + esc(c.country || 'Unknown') + '</td><td>' + pct + '%</td><td>' + c.clicks + '</td></tr>';
    }).join('') || '<tr><td class="empty" colspan="3">No data</td></tr>';
}

// ─── REFERRERS ───
function renderReferrers() {
  document.getElementById('referrersTable').innerHTML =
    '<tr><th>Source</th><th>Clicks</th></tr>' +
    REFERRERS.slice(0, 12).map(r =>
      '<tr><td>' + esc(r.referrer) + '</td><td>' + r.clicks + '</td></tr>'
    ).join('') || '<tr><td class="empty" colspan="2">No data</td></tr>';
}

// ─── LIVE FEED ───
function renderLive() {
  document.getElementById('liveTable').innerHTML =
    RECENT.slice(0, 20).map(c => {
      const t = c.time ? c.time.split('T') : ['',''];
      const timeStr = t.length > 1 ? t[0].slice(5) + ' ' + t[1].slice(0,5) : c.time;
      return '<tr>' +
        '<td><span class="broker-name">' + esc(c.name) + '</span></td>' +
        '<td class="country">' + esc(c.country) + '</td>' +
        '<td class="ref">' + esc(c.referrer) + '</td>' +
        '<td class="time">' + esc(timeStr) + '</td></tr>';
    }).join('') || '<tr><td class="empty" colspan="4">No clicks yet</td></tr>';
}

function esc(s) { return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''; }

// ─── INIT ───
initTimeChart();
renderBrokers();
renderCountries();
renderReferrers();
renderLive();

${shellScript}
</script>
</div>
</div>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function esc(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
