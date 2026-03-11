import { corsHeaders } from '../utils/cors.js';

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
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401, headers }
    );
  }

  const today = await env.DB.prepare(
    `SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now')`
  ).first();

  const week = await env.DB.prepare(
    `SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-7 days')`
  ).first();

  const month = await env.DB.prepare(
    `SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-30 days')`
  ).first();

  const allTime = await env.DB.prepare(
    `SELECT COUNT(*) as count FROM clicks`
  ).first();

  const topBrokers = await env.DB.prepare(
    `SELECT broker_slug, COUNT(*) as clicks FROM clicks GROUP BY broker_slug ORDER BY clicks DESC LIMIT 20`
  ).all();

  const clicksByDay = await env.DB.prepare(
    `SELECT date(created_at) as day, COUNT(*) as clicks FROM clicks WHERE created_at >= date('now', '-30 days') GROUP BY day ORDER BY day`
  ).all();

  const topCountries = await env.DB.prepare(
    `SELECT country, COUNT(*) as clicks FROM clicks WHERE country IS NOT NULL GROUP BY country ORDER BY clicks DESC LIMIT 20`
  ).all();

  const topReferrers = await env.DB.prepare(
    `SELECT referrer, COUNT(*) as clicks FROM clicks WHERE referrer IS NOT NULL AND referrer != '' GROUP BY referrer ORDER BY clicks DESC LIMIT 20`
  ).all();

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

  // Fetch all data
  const [today, week, month, allTime, topBrokers, clicksByDay, topCountries, topReferrers] =
    await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-7 days')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-30 days')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks`).first(),
      env.DB.prepare(`SELECT broker_slug, COUNT(*) as clicks FROM clicks GROUP BY broker_slug ORDER BY clicks DESC LIMIT 20`).all(),
      env.DB.prepare(`SELECT date(created_at) as day, COUNT(*) as clicks FROM clicks WHERE created_at >= date('now', '-30 days') GROUP BY day ORDER BY day`).all(),
      env.DB.prepare(`SELECT country, COUNT(*) as clicks FROM clicks WHERE country IS NOT NULL GROUP BY country ORDER BY clicks DESC LIMIT 10`).all(),
      env.DB.prepare(`SELECT referrer, COUNT(*) as clicks FROM clicks WHERE referrer IS NOT NULL AND referrer != '' GROUP BY referrer ORDER BY clicks DESC LIMIT 10`).all(),
    ]);

  const brokersRows = topBrokers.results.map(
    r => `<tr><td>${esc(r.broker_slug)}</td><td>${r.clicks}</td></tr>`
  ).join('');

  const countriesRows = topCountries.results.map(
    r => `<tr><td>${esc(r.country)}</td><td>${r.clicks}</td></tr>`
  ).join('');

  const referrersRows = topReferrers.results.map(
    r => `<tr><td>${esc(r.referrer)}</td><td>${r.clicks}</td></tr>`
  ).join('');

  const chartLabels = JSON.stringify(clicksByDay.results.map(r => r.day));
  const chartData = JSON.stringify(clicksByDay.results.map(r => r.clicks));

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RatedBrokers — Click Dashboard</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f1117; color: #e0e0e0; padding: 24px; }
  h1 { color: #fff; margin-bottom: 24px; font-size: 24px; }
  h2 { color: #aaa; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .card { background: #1a1d27; border-radius: 12px; padding: 20px; }
  .card .value { font-size: 32px; font-weight: 700; color: #4ade80; }
  .card .label { font-size: 13px; color: #888; margin-top: 4px; }
  .chart-container { background: #1a1d27; border-radius: 12px; padding: 20px; margin-bottom: 32px; }
  canvas { max-height: 300px; }
  .tables { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
  .table-wrap { background: #1a1d27; border-radius: 12px; padding: 20px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #2a2d37; font-size: 14px; }
  th { color: #888; font-weight: 500; }
  td:last-child { text-align: right; font-variant-numeric: tabular-nums; }
</style>
</head>
<body>
<h1>RatedBrokers — Click Dashboard</h1>

<div class="cards">
  <div class="card"><div class="value">${today.count}</div><div class="label">Today</div></div>
  <div class="card"><div class="value">${week.count}</div><div class="label">Last 7 days</div></div>
  <div class="card"><div class="value">${month.count}</div><div class="label">Last 30 days</div></div>
  <div class="card"><div class="value">${allTime.count}</div><div class="label">All time</div></div>
</div>

<div class="chart-container">
  <h2>Clicks — Last 30 Days</h2>
  <canvas id="chart"></canvas>
</div>

<div class="tables">
  <div class="table-wrap">
    <h2>Top Brokers</h2>
    <table><tr><th>Broker</th><th>Clicks</th></tr>${brokersRows || '<tr><td colspan="2">No data yet</td></tr>'}</table>
  </div>
  <div class="table-wrap">
    <h2>Top Countries</h2>
    <table><tr><th>Country</th><th>Clicks</th></tr>${countriesRows || '<tr><td colspan="2">No data yet</td></tr>'}</table>
  </div>
  <div class="table-wrap">
    <h2>Top Referrers</h2>
    <table><tr><th>Referrer</th><th>Clicks</th></tr>${referrersRows || '<tr><td colspan="2">No data yet</td></tr>'}</table>
  </div>
</div>

<script>
new Chart(document.getElementById('chart'), {
  type: 'bar',
  data: {
    labels: ${chartLabels},
    datasets: [{
      label: 'Clicks',
      data: ${chartData},
      backgroundColor: '#4ade80',
      borderRadius: 4,
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#666' }, grid: { display: false } },
      y: { ticks: { color: '#666' }, grid: { color: '#2a2d37' }, beginAtZero: true }
    }
  }
});
</script>
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
