import { corsHeaders } from '../utils/cors.js';
import { adminHeaderCSS, adminHeaderHTML, adminFooterHTML, adminHeaderScript } from '../utils/adminLayout.js';

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
    clicks: { today: today.count, week: week.count, month: month.count, allTime: allTime.count },
    topBrokers: topBrokers.results, clicksByDay: clicksByDay.results,
    topCountries: topCountries.results, topReferrers: topReferrers.results,
  }, { headers });
}

// Generate sparkline SVG path from array of values
function sparklineSVG(values, w, h, color) {
  if (!values.length || values.every(v => v === 0)) return '';
  const max = Math.max(...values) || 1;
  const step = w / Math.max(values.length - 1, 1);
  const pts = values.map((v, i) => `${(i * step).toFixed(1)},${(h - (v / max) * h * 0.85 - 1).toFixed(1)}`);
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block">
    <defs><linearGradient id="sg_${color.replace('#','')}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
    </linearGradient></defs>
    <polygon points="${pts.join(' ')} ${w},${h} 0,${h}" fill="url(#sg_${color.replace('#','')})" />
    <polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

export async function handleDashboard(request, env) {
  const url = new URL(request.url);
  if (!checkDashboardKey(url, env)) {
    return new Response('Unauthorized. Add ?key=YOUR_API_KEY', { status: 401, headers: { 'Content-Type': 'text/plain' } });
  }

  const key = url.searchParams.get('key');
  const encodedKey = encodeURIComponent(key);

  const [today, yesterday, week, month, allTime, prevWeek, prevMonth,
    topBrokers, clicksByDay, clicksByDay7, clicksByDay90,
    topCountries, topReferrers, recentClicks, brokerNames,
    heatmapData, totalBrokers,
    brokerTrends] =
    await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-1 day') AND created_at < date('now')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-7 days')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-30 days')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-14 days') AND created_at < date('now', '-7 days')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM clicks WHERE created_at >= date('now', '-60 days') AND created_at < date('now', '-30 days')`).first(),
      env.DB.prepare(`SELECT broker_slug, COUNT(*) as clicks FROM clicks GROUP BY broker_slug ORDER BY clicks DESC`).all(),
      env.DB.prepare(`SELECT date(created_at) as day, COUNT(*) as clicks FROM clicks WHERE created_at >= date('now', '-30 days') GROUP BY day ORDER BY day`).all(),
      env.DB.prepare(`SELECT date(created_at) as day, COUNT(*) as clicks FROM clicks WHERE created_at >= date('now', '-7 days') GROUP BY day ORDER BY day`).all(),
      env.DB.prepare(`SELECT date(created_at) as day, COUNT(*) as clicks FROM clicks WHERE created_at >= date('now', '-90 days') GROUP BY day ORDER BY day`).all(),
      env.DB.prepare(`SELECT country, COUNT(*) as clicks FROM clicks WHERE country IS NOT NULL GROUP BY country ORDER BY clicks DESC LIMIT 15`).all(),
      env.DB.prepare(`SELECT referrer, COUNT(*) as clicks FROM clicks WHERE referrer IS NOT NULL AND referrer != '' GROUP BY referrer ORDER BY clicks DESC LIMIT 20`).all(),
      env.DB.prepare(`SELECT broker_slug, country, referrer, created_at FROM clicks ORDER BY created_at DESC LIMIT 40`).all(),
      env.DB.prepare(`SELECT slug, name FROM brokers`).all(),
      // Heatmap: hour × weekday
      env.DB.prepare(`SELECT cast(strftime('%w', created_at) as integer) as wd, cast(strftime('%H', created_at) as integer) as hr, COUNT(*) as clicks FROM clicks WHERE created_at >= date('now', '-30 days') GROUP BY wd, hr`).all(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM brokers`).first(),
      // Per-broker daily trend (last 7 days, top 10)
      env.DB.prepare(`SELECT broker_slug, date(created_at) as day, COUNT(*) as clicks FROM clicks WHERE created_at >= date('now', '-7 days') GROUP BY broker_slug, day ORDER BY broker_slug, day`).all(),
    ]);

  const nameMap = {};
  brokerNames.results.forEach(b => { nameMap[b.slug] = b.name; });

  // Trends
  const weekTrend = prevWeek.count > 0 ? Math.round(((week.count - prevWeek.count) / prevWeek.count) * 100) : null;
  const monthTrend = prevMonth.count > 0 ? Math.round(((month.count - prevMonth.count) / prevMonth.count) * 100) : null;
  const avgPerDay = month.count > 0 ? (month.count / 30).toFixed(1) : '0';

  // Sparklines for summary cards (last 7 days)
  const spark7 = clicksByDay7.results.map(d => d.clicks);
  const spark30 = clicksByDay.results.slice(-14).map(d => d.clicks);
  const sparkToday = [yesterday.count, today.count];

  const sparkSvgToday = sparklineSVG(sparkToday, 60, 24, '#4ade80');
  const sparkSvg7d = sparklineSVG(spark7, 60, 24, '#60a5fa');
  const sparkSvg30d = sparklineSVG(spark30, 80, 24, '#fbbf24');
  const sparkSvgAll = sparklineSVG(clicksByDay.results.map(d => d.clicks), 80, 24, '#a78bfa');

  // Heatmap: 7×24 grid
  const heatmap = Array.from({ length: 7 }, () => new Array(24).fill(0));
  let heatmapMax = 0;
  heatmapData.results.forEach(r => {
    heatmap[r.wd][r.hr] = r.clicks;
    if (r.clicks > heatmapMax) heatmapMax = r.clicks;
  });

  // Broker trends (sparkline per broker)
  const brokerSparkMap = {};
  brokerTrends.results.forEach(r => {
    if (!brokerSparkMap[r.broker_slug]) brokerSparkMap[r.broker_slug] = [];
    brokerSparkMap[r.broker_slug].push(r.clicks);
  });

  const chartsData = JSON.stringify({
    days30: clicksByDay.results,
    days7: clicksByDay7.results,
    days90: clicksByDay90.results,
  });

  const brokersData = JSON.stringify(topBrokers.results.map(b => ({
    slug: b.broker_slug,
    name: nameMap[b.broker_slug] || b.broker_slug,
    clicks: b.clicks,
    spark: brokerSparkMap[b.broker_slug] || [],
  })));

  const countriesData = JSON.stringify(topCountries.results);
  const heatmapJson = JSON.stringify(heatmap);

  // Source categorization
  const sourceCategories = { internal: 0, organic: 0, direct: 0, social: 0, other: 0 };
  const cleanReferrers = [];
  const mergedRefs = {};
  topReferrers.results.forEach(r => {
    let domain = r.referrer;
    try { domain = new URL(r.referrer).hostname.replace(/^www\./, ''); } catch {}
    mergedRefs[domain] = (mergedRefs[domain] || 0) + r.clicks;
    if (domain.includes('ratedbrokers')) sourceCategories.internal += r.clicks;
    else if (domain.includes('google') || domain.includes('bing') || domain.includes('yahoo') || domain.includes('duckduckgo') || domain.includes('yandex')) sourceCategories.organic += r.clicks;
    else if (domain.includes('facebook') || domain.includes('twitter') || domain.includes('t.co') || domain.includes('linkedin') || domain.includes('reddit') || domain.includes('youtube') || domain.includes('instagram') || domain.includes('tiktok')) sourceCategories.social += r.clicks;
    else sourceCategories.other += r.clicks;
  });
  const directClicks = allTime.count - Object.values(sourceCategories).reduce((s, v) => s + v, 0);
  if (directClicks > 0) sourceCategories.direct = directClicks;

  const referrersClean = Object.entries(mergedRefs).map(([referrer, clicks]) => ({ referrer, clicks })).sort((a, b) => b.clicks - a.clicks);

  const recentData = JSON.stringify(recentClicks.results.map(c => ({
    slug: c.broker_slug,
    name: nameMap[c.broker_slug] || c.broker_slug,
    country: c.country || '—',
    referrer: (() => { try { return new URL(c.referrer).hostname.replace(/^www\./, ''); } catch { return c.referrer || 'direct'; } })(),
    time: c.created_at,
  })));

  const zeroBrokers = brokerNames.results.filter(b => !topBrokers.results.find(t => t.broker_slug === b.slug)).length;

  const shellCSS = adminHeaderCSS();
  const shellHeader = adminHeaderHTML('clicks', encodedKey);
  const shellFooter = adminFooterHTML();
  const shellScript = adminHeaderScript();

  // Estimated revenue (Bill: even rough numbers help)
  const estCPA = 150; // average CPA in forex ($150)
  const estCR = 0.03; // 3% conversion rate
  const estRevenue30 = Math.round(month.count * estCR * estCPA);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RatedBrokers — Click Dashboard</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"><\/script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg-base); color: var(--text-primary); }
  ${shellCSS}

  /* ─── Summary Cards ─── */
  .summary { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px; }
  .s-card {
    background: var(--bg-card); border-radius: 12px; padding: 16px 18px;
    border: 1px solid var(--border); position: relative; overflow: hidden;
    transition: border-color 0.2s, transform 0.15s;
  }
  .s-card:hover { border-color: var(--border-hover); transform: translateY(-1px); }
  .s-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; border-radius: 12px 0 0 12px;
  }
  .s-card.c1::before { background: var(--green); }
  .s-card.c2::before { background: var(--blue); }
  .s-card.c3::before { background: var(--amber); }
  .s-card.c4::before { background: var(--purple); }
  .s-card.c5::before { background: var(--cyan); }
  .s-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
  .s-label { font-size: 11px; color: var(--text-secondary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px; }
  .s-spark { position: absolute; bottom: 8px; right: 12px; opacity: 0.7; }
  .s-value { font-size: 26px; font-weight: 800; font-variant-numeric: tabular-nums; line-height: 1.1; }
  .s-card.c1 .s-value { color: var(--green); }
  .s-card.c2 .s-value { color: var(--blue); }
  .s-card.c3 .s-value { color: var(--amber); }
  .s-card.c4 .s-value { color: var(--purple); }
  .s-card.c5 .s-value { color: var(--cyan); }
  .s-trend { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; border-radius: 4px; padding: 1px 6px; margin-top: 4px; }
  .s-trend.up { color: var(--green); background: var(--green-glow); }
  .s-trend.down { color: var(--red); background: var(--red-glow); }
  .s-trend.flat { color: var(--text-muted); }
  .s-sub { font-size: 10px; color: var(--text-muted); margin-top: 2px; }

  /* ─── Revenue Estimation (Bill) ─── */
  .revenue-bar {
    background: linear-gradient(135deg, rgba(74,222,128,0.06) 0%, rgba(5,150,105,0.03) 100%);
    border: 1px solid rgba(74,222,128,0.15); border-radius: 12px;
    padding: 14px 20px; margin-bottom: 20px;
    display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
  }
  .rev-item { display: flex; flex-direction: column; }
  .rev-val { font-size: 20px; font-weight: 800; color: var(--green); font-variant-numeric: tabular-nums; }
  .rev-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .rev-divider { width: 1px; height: 36px; background: rgba(74,222,128,0.15); }
  .rev-note { font-size: 11px; color: var(--text-muted); margin-left: auto; max-width: 260px; }

  /* ─── Section ─── */
  .sec { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .sec h2 { color: var(--text-secondary); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin: 0; }
  .sec-icon { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 12px; }
  .sec-icon.g { background: var(--green-glow); color: var(--green); }
  .sec-icon.b { background: var(--blue-glow); color: var(--blue); }
  .sec-icon.a { background: var(--amber-glow); color: var(--amber); }
  .sec-icon.p { background: var(--purple-glow); color: var(--purple); }
  .sec-right { margin-left: auto; display: flex; gap: 6px; align-items: center; }

  /* ─── Controls ─── */
  .controls { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; flex-wrap: wrap; }
  .pill { background: var(--bg-card); color: var(--text-secondary); border: 1px solid var(--border); padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .pill:hover { color: var(--text-primary); border-color: var(--border-hover); }
  .pill.on { border-color: var(--green); color: var(--green); background: var(--green-glow); }
  .chart-toggle { margin-left: 8px; display: flex; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border); overflow: hidden; }
  .chart-toggle button { background: none; border: none; color: var(--text-muted); padding: 5px 12px; font-size: 12px; cursor: pointer; transition: all 0.15s; }
  .chart-toggle button:hover { color: var(--text-secondary); }
  .chart-toggle button.on { background: var(--green-glow); color: var(--green); }
  .btn-sm { background: var(--bg-card); color: var(--text-secondary); border: 1px solid var(--border); padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 4px; }
  .btn-sm:hover { color: var(--text-primary); border-color: var(--border-hover); }

  /* ─── Charts & Panels ─── */
  .chart-wrap { background: var(--bg-card); border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid var(--border); }
  canvas { max-height: 260px; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .grid23 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 16px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .panel { background: var(--bg-card); border-radius: 12px; padding: 20px; border: 1px solid var(--border); }

  /* ─── Heatmap (Barbara: GitHub-style) ─── */
  .heatmap-grid { display: grid; grid-template-columns: 40px repeat(24, 1fr); gap: 2px; }
  .hm-label { font-size: 10px; color: var(--text-muted); display: flex; align-items: center; font-weight: 600; }
  .hm-hour { font-size: 9px; color: var(--text-muted); text-align: center; font-weight: 500; }
  .hm-cell {
    aspect-ratio: 1; border-radius: 3px; transition: transform 0.1s, box-shadow 0.1s;
    cursor: default; position: relative;
  }
  .hm-cell:hover { transform: scale(1.4); z-index: 2; box-shadow: 0 0 8px rgba(74,222,128,0.3); }
  .hm-tooltip {
    display: none; position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
    background: #1a1d27; border: 1px solid var(--border); padding: 4px 8px; border-radius: 6px;
    font-size: 10px; white-space: nowrap; z-index: 10; color: var(--text-primary);
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }
  .hm-cell:hover .hm-tooltip { display: block; }

  /* ─── Tables ─── */
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 8px 10px; font-size: 13px; }
  th { color: var(--text-muted); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border); }
  td { border-bottom: 1px solid rgba(42,45,55,0.4); }
  tr:hover td { background: rgba(30,33,48,0.3); }
  .rank-badge { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 6px; font-size: 11px; font-weight: 700; }
  .r1 { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
  .r2 { background: linear-gradient(135deg, #d1d5db, #9ca3af); color: #000; }
  .r3 { background: linear-gradient(135deg, #d97706, #b45309); color: #fff; }
  .rn { background: var(--bg-card-hover); color: var(--text-muted); }
  .b-name { font-weight: 600; color: var(--text-primary); font-size: 13px; }
  .b-slug { color: var(--text-muted); font-size: 10px; font-family: monospace; }
  .bar-cell { width: 36%; }
  .bar-bg { background: rgba(34,37,47,0.8); border-radius: 4px; height: 20px; position: relative; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--green-dim), var(--green)); transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
  .bar-lbl { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.8); }
  .b-spark { display: flex; align-items: center; }

  /* ─── Source Pills ─── */
  .source-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .source-pill { display: flex; align-items: center; gap: 6px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 8px 14px; min-width: 120px; }
  .source-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .source-name { font-size: 12px; color: var(--text-secondary); }
  .source-val { font-size: 14px; font-weight: 700; margin-left: auto; font-variant-numeric: tabular-nums; }

  /* ─── Country ─── */
  .country-cell { display: flex; align-items: center; gap: 6px; }
  .cflag { font-size: 16px; line-height: 1; }

  /* ─── Live ─── */
  .live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); display: inline-block; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
  .live-table td { font-size: 12px; padding: 5px 8px; }
  .live-table .time { color: var(--text-muted); font-size: 11px; white-space: nowrap; font-family: monospace; }

  /* ─── Alert ─── */
  .alert-bar { background: rgba(251,191,36,0.06); border: 1px solid rgba(251,191,36,0.15); border-radius: 10px; padding: 10px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--amber); }

  .empty { color: var(--text-muted); font-style: italic; text-align: center; padding: 24px; }

  @media (max-width: 1100px) { .summary { grid-template-columns: repeat(3, 1fr); } .grid3, .grid23 { grid-template-columns: 1fr; } }
  @media (max-width: 768px) { .summary { grid-template-columns: repeat(2, 1fr); } .grid2 { grid-template-columns: 1fr; } .s-value { font-size: 20px; } .revenue-bar { flex-direction: column; gap: 10px; } .rev-divider { display: none; } .heatmap-grid { gap: 1px; } }
</style>
</head>
<body>
<div class="admin-shell">
${shellHeader}
<div class="admin-body">

${zeroBrokers > 0 ? `<div class="alert-bar">&#9888; <span><strong>${zeroBrokers}</strong> broker${zeroBrokers > 1 ? 's' : ''} with zero clicks</span></div>` : ''}

<!-- Summary Cards with Sparklines -->
<div class="summary">
  <div class="s-card c1">
    <div class="s-top"><span class="s-label">Today</span></div>
    <div class="s-value">${today.count}</div>
    <div class="s-sub">${yesterday.count > 0 ? 'yesterday: ' + yesterday.count : 'clicks today'}</div>
    <div class="s-spark">${sparkSvgToday}</div>
  </div>
  <div class="s-card c2">
    <div class="s-top"><span class="s-label">7 Days</span></div>
    <div class="s-value">${week.count}</div>
    ${weekTrend !== null ? `<span class="s-trend ${weekTrend > 0 ? 'up' : weekTrend < 0 ? 'down' : 'flat'}">${weekTrend > 0 ? '&#9650;' : weekTrend < 0 ? '&#9660;' : '='} ${Math.abs(weekTrend)}%</span>` : ''}
    <div class="s-spark">${sparkSvg7d}</div>
  </div>
  <div class="s-card c3">
    <div class="s-top"><span class="s-label">30 Days</span></div>
    <div class="s-value">${month.count}</div>
    ${monthTrend !== null ? `<span class="s-trend ${monthTrend > 0 ? 'up' : monthTrend < 0 ? 'down' : 'flat'}">${monthTrend > 0 ? '&#9650;' : monthTrend < 0 ? '&#9660;' : '='} ${Math.abs(monthTrend)}%</span>` : ''}
    <div class="s-spark">${sparkSvg30d}</div>
  </div>
  <div class="s-card c4">
    <div class="s-top"><span class="s-label">All Time</span></div>
    <div class="s-value">${allTime.count}</div>
    <div class="s-sub">${totalBrokers.count} brokers</div>
    <div class="s-spark">${sparkSvgAll}</div>
  </div>
  <div class="s-card c5">
    <div class="s-top"><span class="s-label">Avg / Day</span></div>
    <div class="s-value">${avgPerDay}</div>
    <div class="s-sub">last 30d average</div>
  </div>
</div>

<!-- Revenue Estimation (Bill) -->
<div class="revenue-bar">
  <div class="rev-item"><span class="rev-val">${month.count}</span><span class="rev-label">Clicks (30d)</span></div>
  <div class="rev-divider"></div>
  <div class="rev-item"><span class="rev-val">~${Math.round(month.count * estCR)}</span><span class="rev-label">Est. Conversions</span></div>
  <div class="rev-divider"></div>
  <div class="rev-item"><span class="rev-val">$${estRevenue30.toLocaleString()}</span><span class="rev-label">Est. Revenue (30d)</span></div>
  <div class="rev-divider"></div>
  <div class="rev-item"><span class="rev-val">$${(estRevenue30 * 12).toLocaleString()}</span><span class="rev-label">Est. Annual</span></div>
  <span class="rev-note">Based on avg CPA $${estCPA}, ${(estCR*100).toFixed(0)}% conversion rate. Adjust in code.</span>
</div>

<!-- Time Chart -->
<div class="chart-wrap">
  <div class="sec">
    <div class="sec-icon g"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
    <h2>Click Trend</h2>
    <div class="sec-right">
      <div class="chart-toggle" id="chartToggle">
        <button class="on" onclick="setChartType('area')">Area</button>
        <button onclick="setChartType('bar')">Bar</button>
        <button onclick="setChartType('line')">Line</button>
      </div>
    </div>
  </div>
  <div class="controls">
    <button class="pill" data-period="7" onclick="setPeriod(7)">7 days</button>
    <button class="pill on" data-period="30" onclick="setPeriod(30)">30 days</button>
    <button class="pill" data-period="90" onclick="setPeriod(90)">90 days</button>
    <button class="btn-sm" onclick="exportCSV()" style="margin-left:auto">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      CSV
    </button>
  </div>
  <canvas id="timeChart" style="max-height:240px"></canvas>
</div>

<!-- Heatmap -->
<div class="chart-wrap">
  <div class="sec">
    <div class="sec-icon p"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg></div>
    <h2>Activity Heatmap</h2>
    <span style="font-size:10px;color:var(--text-muted);margin-left:auto">Last 30 days &bull; UTC</span>
  </div>
  <div id="heatmapContainer"></div>
</div>

<!-- Broker Performance -->
<div class="grid23">
  <div class="panel">
    <div class="sec">
      <div class="sec-icon b"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg></div>
      <h2>Top Brokers</h2>
    </div>
    <table id="brokersTable"></table>
  </div>
  <div class="panel">
    <div class="sec">
      <div class="sec-icon g"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/><line x1="2" y1="12" x2="22" y2="12"/></svg></div>
      <h2>Countries</h2>
    </div>
    <canvas id="countryChart" style="max-height:200px"></canvas>
    <table id="countriesTable" style="margin-top:10px"></table>
  </div>
</div>

<!-- Sources + Referrers + Live -->
<div class="grid3">
  <div class="panel">
    <div class="sec">
      <div class="sec-icon a"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
      <h2>Traffic Sources</h2>
    </div>
    <div class="source-row" id="sourcePills"></div>
    <div style="margin-top:16px">
      <div class="sec"><h2 style="font-size:10px">Top Referrers</h2></div>
      <table id="referrersTable"></table>
    </div>
  </div>
  <div class="panel" style="grid-column: span 2">
    <div class="sec">
      <span class="live-dot"></span>
      <h2>Recent Clicks</h2>
      <span style="font-size:10px;color:var(--text-muted);margin-left:auto" id="refreshTimer">Refresh in 5:00</span>
    </div>
    <table class="live-table" id="liveTable"></table>
  </div>
</div>

${shellFooter}

<script>
const CD = ${chartsData};
const BK = ${brokersData};
const CT = ${countriesData};
const RF = ${JSON.stringify(referrersClean)};
const RC = ${recentData};
const HM = ${heatmapJson};
const HM_MAX = ${heatmapMax};
const SOURCES = ${JSON.stringify(sourceCategories)};

const FL={US:'🇺🇸',GB:'🇬🇧',DE:'🇩🇪',FR:'🇫🇷',AU:'🇦🇺',CA:'🇨🇦',JP:'🇯🇵',SG:'🇸🇬',AE:'🇦🇪',SA:'🇸🇦',IN:'🇮🇳',BR:'🇧🇷',NL:'🇳🇱',CH:'🇨🇭',SE:'🇸🇪',NO:'🇳🇴',DK:'🇩🇰',FI:'🇫🇮',ES:'🇪🇸',IT:'🇮🇹',PT:'🇵🇹',PL:'🇵🇱',CZ:'🇨🇿',RO:'🇷🇴',HU:'🇭🇺',AT:'🇦🇹',BE:'🇧🇪',IE:'🇮🇪',NZ:'🇳🇿',ZA:'🇿🇦',MX:'🇲🇽',AR:'🇦🇷',CL:'🇨🇱',CO:'🇨🇴',PH:'🇵🇭',TH:'🇹🇭',MY:'🇲🇾',ID:'🇮🇩',VN:'🇻🇳',KR:'🇰🇷',TW:'🇹🇼',HK:'🇭🇰',CN:'🇨🇳',RU:'🇷🇺',UA:'🇺🇦',TR:'🇹🇷',EG:'🇪🇬',NG:'🇳🇬',KE:'🇰🇪',IL:'🇮🇱',QA:'🇶🇦',KW:'🇰🇼',BH:'🇧🇭',CY:'🇨🇾',GR:'🇬🇷',LU:'🇱🇺'};
function fg(c){return FL[c]||'🌍';}
function esc(s){return s?s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'):'';}

// ─── TIME CHART (Area/Bar/Line toggle) ───
let tc, chartType='area';
function initTC(){
  const ctx=document.getElementById('timeChart');
  tc=new Chart(ctx,{
    type:'line',
    data:{labels:[],datasets:[{label:'Clicks',data:[],
      backgroundColor:function(context){
        const chart=context.chart;
        const{ctx:c,chartArea}=chart;
        if(!chartArea)return'rgba(74,222,128,0.15)';
        const g=c.createLinearGradient(0,chartArea.top,0,chartArea.bottom);
        g.addColorStop(0,'rgba(74,222,128,0.25)');g.addColorStop(1,'rgba(74,222,128,0.02)');
        return g;
      },
      borderColor:'#4ade80',borderWidth:2,fill:true,tension:0.35,
      pointRadius:0,pointHoverRadius:5,pointHoverBackgroundColor:'#4ade80',
      pointHoverBorderColor:'#fff',pointHoverBorderWidth:2,
    }]},
    options:{
      responsive:true,interaction:{intersect:false,mode:'index'},
      plugins:{legend:{display:false},tooltip:{backgroundColor:'#1a1d27',titleColor:'#e0e0e0',bodyColor:'#4ade80',borderColor:'#2a2d37',borderWidth:1,cornerRadius:8,padding:10,displayColors:false,
        callbacks:{label:function(c){return c.parsed.y+' clicks';}}
      }},
      scales:{
        x:{ticks:{color:'#555',maxRotation:0,autoSkip:true,maxTicksLimit:15,font:{size:10}},grid:{display:false}},
        y:{ticks:{color:'#555',font:{size:10}},grid:{color:'rgba(42,45,55,0.4)'},beginAtZero:true},
      },
    },
  });
  setPeriod(30);
}

function setChartType(type){
  chartType=type;
  document.querySelectorAll('#chartToggle button').forEach(b=>b.classList.toggle('on',b.textContent.toLowerCase()===type));
  const ds=tc.data.datasets[0];
  if(type==='bar'){tc.config.type='bar';ds.fill=false;ds.borderWidth=0;ds.borderRadius=4;ds.barPercentage=0.7;ds.tension=0;ds.pointRadius=0;
    ds.backgroundColor='rgba(74,222,128,0.6)';ds.hoverBackgroundColor='#4ade80';}
  else if(type==='line'){tc.config.type='line';ds.fill=false;ds.borderWidth=2.5;ds.tension=0.35;ds.pointRadius=2;ds.pointBackgroundColor='#4ade80';
    ds.backgroundColor='transparent';}
  else{tc.config.type='line';ds.fill=true;ds.borderWidth=2;ds.tension=0.35;ds.pointRadius=0;
    ds.backgroundColor=function(context){const chart=context.chart;const{ctx:c,chartArea}=chart;if(!chartArea)return'rgba(74,222,128,0.15)';const g=c.createLinearGradient(0,chartArea.top,0,chartArea.bottom);g.addColorStop(0,'rgba(74,222,128,0.25)');g.addColorStop(1,'rgba(74,222,128,0.02)');return g;};}
  tc.update();
}

function setPeriod(d){
  document.querySelectorAll('.pill[data-period]').forEach(b=>b.classList.toggle('on',+b.dataset.period===d));
  const data=CD['days'+d]||[];
  tc.data.labels=data.map(r=>{const p=r.day.split('-');return p[1]+'/'+p[2];});
  tc.data.datasets[0].data=data.map(r=>r.clicks);
  // Reset chart type properly
  setChartType(chartType);
}

// ─── HEATMAP ───
function renderHeatmap(){
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let h='<div class="heatmap-grid">';
  h+='<div></div>';
  for(let hr=0;hr<24;hr++){h+='<div class="hm-hour">'+(hr%2===0?hr+'':'')+'</div>';}
  for(let d=0;d<7;d++){
    h+='<div class="hm-label">'+days[d]+'</div>';
    for(let hr=0;hr<24;hr++){
      const v=HM[d][hr];
      const intensity=HM_MAX>0?v/HM_MAX:0;
      let bg;
      if(v===0)bg='rgba(42,45,55,0.3)';
      else if(intensity<0.25)bg='rgba(74,222,128,0.15)';
      else if(intensity<0.5)bg='rgba(74,222,128,0.35)';
      else if(intensity<0.75)bg='rgba(74,222,128,0.55)';
      else bg='rgba(74,222,128,0.85)';
      h+='<div class="hm-cell" style="background:'+bg+'"><div class="hm-tooltip">'+days[d]+' '+hr+':00 — '+v+' clicks</div></div>';
    }
  }
  h+='</div>';
  document.getElementById('heatmapContainer').innerHTML=h;
}

// ─── BROKERS ───
function renderBrokers(){
  const top=BK.slice(0,15);
  const mx=top.length>0?top[0].clicks:1;
  document.getElementById('brokersTable').innerHTML=
    '<thead><tr><th style="width:28px">#</th><th>Broker</th><th class="bar-cell"></th><th>7d</th><th>All</th></tr></thead><tbody>'+
    (top.length>0?top.map((b,i)=>{
      const pct=Math.round((b.clicks/mx)*100);
      const rc=i===0?'r1':i===1?'r2':i===2?'r3':'rn';
      // Mini sparkline
      let spark='';
      if(b.spark&&b.spark.length>1){
        const sm=Math.max(...b.spark)||1;
        const pts=b.spark.map((v,j)=>(j*8).toFixed(0)+','+(16-(v/sm)*14).toFixed(1));
        spark='<svg width="'+(b.spark.length*8)+'" height="18" style="opacity:0.6"><polyline points="'+pts.join(' ')+'" fill="none" stroke="'+(i<3?'#4ade80':'#555')+'" stroke-width="1.5" stroke-linecap="round"/></svg>';
      }
      return '<tr><td><span class="rank-badge '+rc+'">'+(i+1)+'</span></td>'+
        '<td><span class="b-name">'+esc(b.name)+'</span><br><span class="b-slug">'+b.slug+'</span></td>'+
        '<td class="bar-cell"><div class="bar-bg"><div class="bar-fill" style="width:'+pct+'%"></div>'+(pct>15?'<span class="bar-lbl">'+pct+'%</span>':'')+'</div></td>'+
        '<td class="b-spark">'+spark+'</td>'+
        '<td style="text-align:right;font-variant-numeric:tabular-nums">'+b.clicks+'</td></tr>';
    }).join(''):'<tr><td colspan="5" class="empty">No clicks yet</td></tr>')+'</tbody>';
}

// ─── COUNTRIES ───
function renderCountries(){
  const top=CT.slice(0,10);
  const total=top.reduce((s,c)=>s+c.clicks,0)||1;
  const colors=['#4ade80','#059669','#34d399','#10b981','#047857','#065f46','#60a5fa','#3b82f6','#a78bfa','#8b5cf6'];
  new Chart(document.getElementById('countryChart'),{
    type:'doughnut',
    data:{labels:top.map(c=>c.country||'?'),datasets:[{data:top.map(c=>c.clicks),backgroundColor:colors,borderWidth:0,hoverOffset:6}]},
    options:{responsive:true,cutout:'68%',plugins:{legend:{display:false},tooltip:{backgroundColor:'#1a1d27',bodyColor:'#4ade80',borderColor:'#2a2d37',borderWidth:1,cornerRadius:8}}},
  });
  document.getElementById('countriesTable').innerHTML=
    top.map(c=>{const p=Math.round(c.clicks/total*100);return'<tr><td><span class="country-cell"><span class="cflag">'+fg(c.country)+'</span>'+esc(c.country||'?')+'</span></td><td style="text-align:right">'+p+'%</td><td style="text-align:right">'+c.clicks+'</td></tr>';}).join('')||'<tr><td class="empty" colspan="3">No data</td></tr>';
}

// ─── SOURCES (Bill) ───
function renderSources(){
  const items=[
    {name:'Internal',val:SOURCES.internal,color:'#4ade80'},
    {name:'Organic',val:SOURCES.organic,color:'#60a5fa'},
    {name:'Direct',val:SOURCES.direct,color:'#a78bfa'},
    {name:'Social',val:SOURCES.social,color:'#f472b6'},
    {name:'Other',val:SOURCES.other,color:'#fbbf24'},
  ].filter(s=>s.val>0);
  document.getElementById('sourcePills').innerHTML=items.map(s=>
    '<div class="source-pill"><span class="source-dot" style="background:'+s.color+'"></span><span class="source-name">'+s.name+'</span><span class="source-val" style="color:'+s.color+'">'+s.val+'</span></div>'
  ).join('');
}

// ─── REFERRERS ───
function renderReferrers(){
  document.getElementById('referrersTable').innerHTML=
    '<tbody>'+(RF.slice(0,10).map(r=>{
      const ic=r.referrer==='direct'?'&#x1F310;':r.referrer.includes('google')?'&#x1F50D;':r.referrer.includes('ratedbrokers')?'&#x1F3E0;':'&#x1F517;';
      return'<tr><td>'+ic+' '+esc(r.referrer)+'</td><td style="text-align:right;font-variant-numeric:tabular-nums">'+r.clicks+'</td></tr>';
    }).join('')||'<tr><td class="empty" colspan="2">No data</td></tr>')+'</tbody>';
}

// ─── LIVE FEED ───
function renderLive(){
  document.getElementById('liveTable').innerHTML=
    RC.slice(0,25).map(c=>{
      const t=c.time?c.time.split('T'):['',''];
      const ts=t.length>1?t[0].slice(5)+' '+t[1].slice(0,5):c.time;
      return'<tr><td><strong>'+esc(c.name)+'</strong></td><td><span class="cflag">'+fg(c.country)+'</span> '+esc(c.country)+'</td><td style="color:var(--text-muted);font-size:11px">'+esc(c.referrer)+'</td><td class="time">'+esc(ts)+'</td></tr>';
    }).join('')||'<tr><td class="empty" colspan="4">No clicks yet</td></tr>';
}

// ─── EXPORT CSV ───
function exportCSV(){
  let csv='Broker,Slug,Clicks\\n';
  BK.forEach(b=>{csv+='"'+b.name+'",'+b.slug+','+b.clicks+'\\n';});
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='clicks-'+new Date().toISOString().slice(0,10)+'.csv';a.click();
}

// ─── AUTO-REFRESH ───
let rs=300;
function tick(){
  const m=Math.floor(rs/60),s=rs%60;
  document.getElementById('refreshTimer').textContent='Refresh in '+m+':'+String(s).padStart(2,'0');
  if(rs<=0){location.reload();return;}
  rs--;setTimeout(tick,1000);
}

// ─── INIT ───
initTC();renderHeatmap();renderBrokers();renderCountries();renderSources();renderReferrers();renderLive();tick();

${shellScript}
</script>
</div>
</div>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
