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

function isPlaceholder(url) {
  return url && url.includes('camp=RATEDBROKERS');
}

// ─── GET /api/admin/brokers ───
export async function handleAdminList(request, env) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };

  if (!checkKey(url, env)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  const brokers = await env.DB.prepare(`
    SELECT b.slug, b.name, b.affiliate_url,
      (SELECT COUNT(*) FROM clicks c WHERE c.broker_slug = b.slug) as clicks_total,
      (SELECT COUNT(*) FROM clicks c WHERE c.broker_slug = b.slug AND c.created_at >= date('now', '-30 days')) as clicks_30d
    FROM brokers b ORDER BY b.name
  `).all();

  const results = brokers.results.map(b => ({
    ...b,
    is_placeholder: isPlaceholder(b.affiliate_url),
  }));

  return Response.json(results, { headers });
}

// ─── PUT /api/admin/brokers/:slug ───
export async function handleAdminUpdate(request, env, slug) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };

  if (!checkKey(url, env)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers });
  }

  const { affiliate_url, name } = body;

  if (!affiliate_url || typeof affiliate_url !== 'string') {
    return Response.json({ error: 'affiliate_url is required' }, { status: 400, headers });
  }
  if (!affiliate_url.startsWith('https://')) {
    return Response.json({ error: 'affiliate_url must start with https://' }, { status: 400, headers });
  }
  if (name !== undefined && (typeof name !== 'string' || name.length > 200)) {
    return Response.json({ error: 'name must be a string ≤200 characters' }, { status: 400, headers });
  }

  const existing = await env.DB.prepare('SELECT slug, name, affiliate_url FROM brokers WHERE slug = ?').bind(slug).first();
  if (!existing) {
    return Response.json({ error: 'Broker not found' }, { status: 404, headers });
  }

  const changes = [];
  if (affiliate_url !== existing.affiliate_url) {
    changes.push(env.DB.prepare(
      'INSERT INTO broker_changes (broker_slug, field, old_value, new_value) VALUES (?, ?, ?, ?)'
    ).bind(slug, 'affiliate_url', existing.affiliate_url, affiliate_url));
  }
  if (name && name !== existing.name) {
    changes.push(env.DB.prepare(
      'INSERT INTO broker_changes (broker_slug, field, old_value, new_value) VALUES (?, ?, ?, ?)'
    ).bind(slug, 'name', existing.name, name));
  }

  if (name) {
    await env.DB.prepare('UPDATE brokers SET affiliate_url = ?, name = ? WHERE slug = ?')
      .bind(affiliate_url, name, slug).run();
  } else {
    await env.DB.prepare('UPDATE brokers SET affiliate_url = ? WHERE slug = ?')
      .bind(affiliate_url, slug).run();
  }

  if (changes.length > 0) {
    await env.DB.batch(changes);
  }

  return Response.json({ ok: true, slug }, { headers });
}

// ─── POST /api/admin/brokers ───
export async function handleAdminCreate(request, env) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };

  if (!checkKey(url, env)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers });
  }

  const { slug, name, affiliate_url } = body;
  if (!slug || !name || !affiliate_url) {
    return Response.json({ error: 'slug, name, and affiliate_url are required' }, { status: 400, headers });
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return Response.json({ error: 'slug must be lowercase alphanumeric with hyphens' }, { status: 400, headers });
  }
  if (!affiliate_url.startsWith('https://')) {
    return Response.json({ error: 'affiliate_url must start with https://' }, { status: 400, headers });
  }

  const existing = await env.DB.prepare('SELECT slug FROM brokers WHERE slug = ?').bind(slug).first();
  if (existing) {
    return Response.json({ error: 'Broker already exists' }, { status: 409, headers });
  }

  await env.DB.prepare('INSERT INTO brokers (slug, name, affiliate_url) VALUES (?, ?, ?)')
    .bind(slug, name, affiliate_url).run();

  return Response.json({ ok: true, slug }, { status: 201, headers });
}

// ─── DELETE /api/admin/brokers/:slug ───
export async function handleAdminDelete(request, env, slug) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };

  if (!checkKey(url, env)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  const existing = await env.DB.prepare('SELECT slug FROM brokers WHERE slug = ?').bind(slug).first();
  if (!existing) {
    return Response.json({ error: 'Broker not found' }, { status: 404, headers });
  }

  await env.DB.prepare('DELETE FROM brokers WHERE slug = ?').bind(slug).run();

  return Response.json({ ok: true, deleted: slug }, { headers });
}

// ─── GET /api/admin/dashboard ─── HTML Admin Panel ───
export async function handleAdminDashboard(request, env) {
  const url = new URL(request.url);

  if (!checkKey(url, env)) {
    return new Response('Unauthorized. Add ?key=YOUR_API_KEY', {
      status: 401,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const key = url.searchParams.get('key');
  const encodedKey = encodeURIComponent(key);

  const [brokersResult, changesResult] = await Promise.all([
    env.DB.prepare(`
      SELECT b.slug, b.name, b.affiliate_url,
        (SELECT COUNT(*) FROM clicks c WHERE c.broker_slug = b.slug) as clicks_total,
        (SELECT COUNT(*) FROM clicks c WHERE c.broker_slug = b.slug AND c.created_at >= date('now', '-30 days')) as clicks_30d,
        (SELECT MAX(changed_at) FROM broker_changes bc WHERE bc.broker_slug = b.slug) as last_changed
      FROM brokers b ORDER BY b.name
    `).all(),
    env.DB.prepare(`
      SELECT broker_slug, field, old_value, new_value, changed_at
      FROM broker_changes ORDER BY changed_at DESC LIMIT 50
    `).all(),
  ]);

  const brokers = brokersResult.results;
  const changes = changesResult.results;

  const totalBrokers = brokers.length;
  const placeholderCount = brokers.filter(b => isPlaceholder(b.affiliate_url)).length;
  const configuredCount = totalBrokers - placeholderCount;
  const totalClicks = brokers.reduce((s, b) => s + b.clicks_total, 0);
  const configuredPct = totalBrokers > 0 ? Math.round((configuredCount / totalBrokers) * 100) : 0;

  // Extract tracking params from URL
  function extractParams(urlStr) {
    try {
      const u = new URL(urlStr);
      const params = [];
      for (const [k] of u.searchParams) {
        params.push(k);
      }
      return params.slice(0, 5); // max 5 params
    } catch { return []; }
  }

  // JSON data for client-side rendering
  const brokersJson = JSON.stringify(brokers.map(b => ({
    slug: b.slug,
    name: b.name,
    url: b.affiliate_url,
    clicks_total: b.clicks_total,
    clicks_30d: b.clicks_30d,
    placeholder: isPlaceholder(b.affiliate_url),
    last_changed: b.last_changed,
    domain: (() => { try { return new URL(b.affiliate_url).hostname.replace(/^www\./, ''); } catch { return ''; } })(),
    params: extractParams(b.affiliate_url),
  })));

  const changesJson = JSON.stringify(changes);

  // Max clicks for mini bars
  const maxClicks30d = Math.max(...brokers.map(b => b.clicks_30d), 1);

  const shellCSS = adminHeaderCSS();
  const shellHeader = adminHeaderHTML('affiliate', encodedKey);
  const shellFooter = adminFooterHTML();
  const shellScript = adminHeaderScript();

  // SVG progress ring
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (configuredPct / 100) * circumference;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RatedBrokers — Affiliate Admin</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg-base); color: var(--text-primary); }
  ${shellCSS}

  /* ─── Section Headers ─── */
  .section-head {
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .section-head h2 {
    color: var(--text-secondary); font-size: 13px; text-transform: uppercase;
    letter-spacing: 0.8px; font-weight: 700; margin: 0;
  }
  .section-head .section-icon {
    width: 28px; height: 28px; border-radius: 8px; display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
  }
  .section-head .section-icon.green { background: var(--green-glow); color: var(--green); box-shadow: 0 0 12px rgba(74,222,128,0.1); }
  .section-head .section-icon.blue { background: var(--blue-glow); color: var(--blue); box-shadow: 0 0 12px rgba(96,165,250,0.1); }
  .section-head .section-icon.amber { background: var(--amber-glow); color: var(--amber); box-shadow: 0 0 12px rgba(251,191,36,0.1); }
  .section-head .section-icon.purple { background: var(--purple-glow); color: var(--purple); box-shadow: 0 0 12px rgba(167,139,250,0.1); }

  /* ─── Overview Row ─── */
  .overview { display: grid; grid-template-columns: 1fr 2fr; gap: 18px; margin-bottom: 28px; }
  .progress-card {
    background: var(--glass-bg); backdrop-filter: blur(16px);
    border-radius: 14px; padding: 28px;
    border: 1px solid var(--glass-border); display: flex; align-items: center;
    gap: 24px; justify-content: center;
    position: relative; overflow: hidden;
  }
  .progress-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--green), var(--green-dim));
  }
  .progress-ring { position: relative; width: 100px; height: 100px; flex-shrink: 0; }
  .progress-ring svg { transform: rotate(-90deg); }
  .progress-ring .ring-bg { stroke: rgba(255,255,255,0.05); }
  .progress-ring .ring-fill { stroke: var(--green); transition: stroke-dashoffset 1s ease; filter: drop-shadow(0 0 6px rgba(74,222,128,0.3)); }
  .progress-ring .ring-text {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    font-size: 24px; font-weight: 800; color: var(--green); letter-spacing: -0.5px;
  }
  .progress-ring .ring-sub {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, calc(-50% + 14px));
    font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;
  }
  .progress-details { display: flex; flex-direction: column; gap: 10px; }
  .progress-stat { display: flex; align-items: center; gap: 10px; font-size: 14px; }
  .progress-stat .stat-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
  .progress-stat .stat-dot.green { background: var(--green); box-shadow: 0 0 6px rgba(74,222,128,0.4); }
  .progress-stat .stat-dot.amber { background: var(--amber); box-shadow: 0 0 6px rgba(251,191,36,0.4); }
  .progress-stat .stat-dot.muted { background: var(--text-muted); }
  .progress-stat .stat-val { font-weight: 700; margin-left: auto; font-variant-numeric: tabular-nums; }

  /* ─── Stats Cards (glassmorphism) ─── */
  .stats-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

  /* ─── Toolbar ─── */
  .toolbar { display: flex; gap: 8px; margin-bottom: 18px; align-items: center; flex-wrap: wrap; }
  .search {
    background: rgba(255,255,255,0.03); color: var(--text-primary); border: 1px solid var(--border);
    padding: 9px 14px 9px 38px; border-radius: 10px; font-size: 14px; width: 300px;
    outline: none; transition: all 0.2s var(--transition);
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234a4e63' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: 12px center;
  }
  .search:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(74,222,128,0.08); background-color: rgba(255,255,255,0.05); }
  .filter-btn {
    background: transparent; color: var(--text-muted); border: 1px solid var(--border);
    padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s var(--transition);
  }
  .filter-btn:hover { color: var(--text-secondary); border-color: var(--border-hover); background: rgba(255,255,255,0.03); }
  .filter-btn.active { border-color: rgba(74,222,128,0.3); color: var(--green); background: var(--green-glow); box-shadow: 0 0 12px rgba(74,222,128,0.06); }
  .toolbar-right { margin-left: auto; display: flex; gap: 8px; }
  .btn-export {
    background: transparent; color: var(--text-secondary); border: 1px solid var(--border);
    padding: 7px 16px; border-radius: 8px; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.2s var(--transition); display: flex; align-items: center; gap: 6px;
  }
  .btn-export:hover { color: var(--text-primary); border-color: var(--border-hover); background: rgba(255,255,255,0.03); transform: translateY(-1px); }
  .kbd { display: inline-block; font-size: 10px; padding: 2px 6px; background: rgba(255,255,255,0.04); border-radius: 4px; color: var(--text-muted); border: 1px solid var(--border); margin-left: 4px; }

  /* ─── Table ─── */
  .table-wrap {
    background: var(--glass-bg); backdrop-filter: blur(16px);
    border-radius: 14px; padding: 0;
    margin-bottom: 22px; overflow: hidden; border: 1px solid var(--glass-border);
  }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 11px 14px; font-size: 13px; }
  th {
    color: var(--text-muted); font-weight: 700; cursor: pointer; user-select: none;
    white-space: nowrap; background: rgba(255,255,255,0.02);
    border-bottom: 2px solid rgba(255,255,255,0.06);
    transition: color 0.15s; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px;
  }
  th:hover { color: var(--text-secondary); }
  td { border-bottom: 1px solid rgba(255,255,255,0.03); transition: all 0.15s; position: relative; }
  tbody tr:nth-child(even) td { background: rgba(255,255,255,0.015); }
  tbody tr { transition: all 0.15s; }
  tbody tr:hover td { background: rgba(74,222,128,0.03); }
  tbody tr:hover td:first-child::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--green); border-radius: 0 1px 1px 0; }
  th .arrow { font-size: 10px; margin-left: 3px; opacity: 0.3; }
  th.sorted .arrow { opacity: 1; color: var(--green); }
  td.num { text-align: right; font-variant-numeric: tabular-nums; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; }
  .broker-cell { display: flex; align-items: center; gap: 10px; }
  .broker-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, rgba(74,222,128,0.12), rgba(5,150,105,0.08));
    border: 1px solid rgba(74,222,128,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; color: var(--green);
    flex-shrink: 0; text-transform: uppercase;
    box-shadow: 0 0 8px rgba(74,222,128,0.06);
  }
  .broker-info .broker-name { font-weight: 600; color: var(--text-primary); font-size: 13px; }
  .broker-info .broker-slug { color: var(--text-muted); font-size: 11px; font-family: monospace; display: block; margin-top: 1px; }
  .url-cell { max-width: 240px; }
  .url-domain { color: var(--text-secondary); font-size: 12px; font-weight: 500; }
  .url-path { color: var(--text-muted); font-size: 11px; font-family: monospace; display: block; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .url-params { display: flex; gap: 3px; margin-top: 3px; flex-wrap: wrap; }
  .param-tag { font-size: 9px; padding: 1px 5px; border-radius: 3px; font-family: monospace; font-weight: 600; }
  .param-tag.track { background: var(--green-glow); color: var(--green); border: 1px solid rgba(74,222,128,0.15); }
  .param-tag.generic { background: rgba(96,165,250,0.08); color: var(--blue); border: 1px solid rgba(96,165,250,0.1); }
  .click-bar { width: 50px; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.04); overflow: hidden; display: inline-block; vertical-align: middle; margin-right: 6px; }
  .click-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--green-dim), var(--green)); transition: width 0.5s var(--transition); }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; }
  .badge-green { background: var(--green-glow); color: var(--green); border: 1px solid rgba(74,222,128,0.12); }
  .badge-yellow { background: var(--amber-glow); color: var(--amber); border: 1px solid rgba(251,191,36,0.12); }
  .last-changed { font-size: 10px; color: var(--text-muted); font-family: monospace; }
  .actions { display: flex; gap: 4px; white-space: nowrap; }
  .btn { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s var(--transition); }
  .btn:hover { transform: translateY(-1px); }
  .btn-edit { background: rgba(96,165,250,0.08); color: var(--blue); border: 1px solid rgba(96,165,250,0.12); }
  .btn-edit:hover { background: rgba(96,165,250,0.15); box-shadow: 0 2px 8px rgba(96,165,250,0.1); }
  .btn-test { background: rgba(74,222,128,0.08); color: var(--green); border: 1px solid rgba(74,222,128,0.12); }
  .btn-test:hover { background: rgba(74,222,128,0.15); box-shadow: 0 2px 8px rgba(74,222,128,0.1); }
  .btn-copy { background: rgba(167,139,250,0.08); color: var(--purple); border: 1px solid rgba(167,139,250,0.12); }
  .btn-copy:hover { background: rgba(167,139,250,0.15); box-shadow: 0 2px 8px rgba(167,139,250,0.1); }
  .btn-go { background: rgba(251,191,36,0.08); color: var(--amber); border: 1px solid rgba(251,191,36,0.12); }
  .btn-go:hover { background: rgba(251,191,36,0.15); box-shadow: 0 2px 8px rgba(251,191,36,0.1); }
  .btn-save { background: linear-gradient(135deg, var(--green-dim), #047857); color: #fff; border: 1px solid rgba(74,222,128,0.2); box-shadow: 0 2px 8px rgba(5,150,105,0.25); }
  .btn-save:hover { background: linear-gradient(135deg, #047857, #065f46); box-shadow: 0 4px 16px rgba(5,150,105,0.35); }
  .btn-cancel { background: rgba(255,255,255,0.04); color: var(--text-secondary); border: 1px solid var(--border); }

  /* ─── Edit Row ─── */
  .edit-row { background: rgba(74,222,128,0.02); }
  .edit-row td { border-bottom: 1px solid rgba(74,222,128,0.08); }
  .edit-input {
    background: rgba(255,255,255,0.03); color: var(--text-primary);
    border: 1px solid var(--green); padding: 9px 14px; border-radius: 10px;
    width: 100%; font-size: 13px; font-family: monospace; outline: none;
    transition: all 0.2s var(--transition);
  }
  .edit-input:focus { box-shadow: 0 0 0 3px rgba(74,222,128,0.1), 0 0 20px rgba(74,222,128,0.05); }
  .edit-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .edit-hint { font-size: 11px; color: var(--text-muted); }

  /* ─── Toast (uses .toast from layout) ─── */
  .success-flash { animation: flash 1.5s ease; }
  @keyframes flash { 0% { background: rgba(74,222,128,0.08); } 100% { background: transparent; } }

  /* ─── Bulk ─── */
  .bulk-wrap {
    background: var(--glass-bg); backdrop-filter: blur(16px);
    border-radius: 14px; padding: 22px;
    margin-bottom: 22px; border: 1px solid var(--glass-border);
  }
  .bulk-textarea {
    width: 100%; background: rgba(255,255,255,0.03); color: var(--text-primary);
    border: 1px solid var(--border); border-radius: 10px; padding: 14px;
    font-family: monospace; font-size: 13px; min-height: 90px;
    resize: vertical; outline: none; transition: all 0.2s var(--transition);
  }
  .bulk-textarea:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(74,222,128,0.08); }
  .bulk-bar { display: flex; gap: 10px; align-items: center; margin-top: 10px; }
  .bulk-count { color: var(--text-secondary); font-size: 13px; }
  .bulk-preview { margin-top: 10px; max-height: 180px; overflow-y: auto; border-radius: 8px; }
  .bp-item { padding: 6px 10px; font-size: 12px; display: flex; gap: 12px; border-bottom: 1px solid rgba(42,45,55,0.3); }
  .bp-item:last-child { border: none; }
  .bp-item .bp-slug { color: var(--green); font-weight: 600; min-width: 150px; font-family: monospace; }
  .bp-item .bp-url { color: var(--text-muted); word-break: break-all; font-family: monospace; }
  .bp-item .bp-err { color: var(--red); }
  .status-msg { font-size: 13px; }
  .status-msg.ok { color: var(--green); }
  .status-msg.err { color: var(--red); }

  /* ─── History Timeline ─── */
  .changes-wrap {
    background: var(--glass-bg); backdrop-filter: blur(16px);
    border-radius: 14px; padding: 22px;
    border: 1px solid var(--glass-border);
  }
  .timeline { position: relative; padding-left: 24px; }
  .timeline::before {
    content: ''; position: absolute; left: 8px; top: 4px; bottom: 4px;
    width: 2px; background: linear-gradient(180deg, var(--purple) 0%, rgba(255,255,255,0.03) 100%);
    border-radius: 1px;
  }
  .tl-item { position: relative; padding: 8px 0 16px 16px; }
  .tl-item::before {
    content: ''; position: absolute; left: -20px; top: 12px;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--purple); border: 2px solid var(--bg-card-solid);
    box-shadow: 0 0 6px rgba(167,139,250,0.2);
  }
  .tl-item:first-child::before { background: var(--green); box-shadow: 0 0 6px rgba(74,222,128,0.3); }
  .tl-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .tl-broker { font-weight: 700; font-size: 13px; color: var(--text-primary); }
  .tl-field { font-size: 10px; color: var(--purple); background: var(--purple-glow); padding: 1px 6px; border-radius: 3px; font-weight: 600; }
  .tl-time { font-size: 10px; color: var(--text-muted); font-family: monospace; margin-left: auto; }
  .tl-diff { display: flex; gap: 8px; align-items: baseline; font-size: 12px; flex-wrap: wrap; }
  .tl-old { color: var(--red); text-decoration: line-through; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace; font-size: 11px; }
  .tl-arrow { color: var(--text-muted); font-size: 10px; }
  .tl-new { color: var(--green); max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace; font-size: 11px; }

  .empty { color: var(--text-muted); font-style: italic; padding: 24px; text-align: center; }

  @media (max-width: 1100px) {
    .overview { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .stats-cards { grid-template-columns: 1fr; }
    .search { width: 100%; }
    .toolbar { flex-direction: column; align-items: stretch; }
    .toolbar-right { margin-left: 0; }
  }
</style>
</head>
<body>
<div class="admin-shell">
${shellHeader}
<div class="admin-body">

<!-- Overview: Progress Ring + Stats Cards -->
<div class="overview">
  <div class="progress-card">
    <div class="progress-ring">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="${radius}" fill="none" stroke-width="8"/>
        <circle class="ring-fill" cx="50" cy="50" r="${radius}" fill="none" stroke-width="8"
          stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}"/>
      </svg>
      <span class="ring-text">${configuredPct}%</span>
      <span class="ring-sub">configured</span>
    </div>
    <div class="progress-details">
      <div class="progress-stat">
        <span class="stat-dot green"></span>
        <span>Active links</span>
        <span class="stat-val" style="color:var(--green)">${configuredCount}</span>
      </div>
      <div class="progress-stat">
        <span class="stat-dot amber"></span>
        <span>Placeholders</span>
        <span class="stat-val" style="color:var(--amber)">${placeholderCount}</span>
      </div>
      <div class="progress-stat">
        <span class="stat-dot muted"></span>
        <span>Total brokers</span>
        <span class="stat-val">${totalBrokers}</span>
      </div>
    </div>
  </div>
  <div class="stats-cards">
    <div class="glass-card c-green">
      <div class="card-label">Active Links</div>
      <div class="card-value">${configuredCount}</div>
      <div class="card-sub">configured with real URLs</div>
    </div>
    <div class="glass-card c-blue">
      <div class="card-label">Total Clicks (30d)</div>
      <div class="card-value">${brokers.reduce((s, b) => s + b.clicks_30d, 0)}</div>
      <div class="card-sub">across all brokers</div>
    </div>
    <div class="glass-card c-purple">
      <div class="card-label">Total Clicks (All)</div>
      <div class="card-value">${totalClicks}</div>
      <div class="card-sub">since tracking started</div>
    </div>
  </div>
</div>

<!-- Toolbar -->
<div class="toolbar">
  <input class="search" id="search" type="text" placeholder="Search broker name or slug..." autofocus>
  <button class="filter-btn" data-filter="all" onclick="setFilter('all')">All (${totalBrokers})</button>
  <button class="filter-btn" data-filter="active" onclick="setFilter('active')">Active (${configuredCount})</button>
  <button class="filter-btn" data-filter="placeholder" onclick="setFilter('placeholder')">Placeholder (${placeholderCount})</button>
  <div class="toolbar-right">
    <button class="btn-export" onclick="exportJSON()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Export
    </button>
    <span style="font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:4px">
      <kbd class="kbd">&#8984;K</kbd> search
    </span>
  </div>
</div>

<!-- Broker Table -->
<div class="table-wrap">
  <table>
    <thead><tr>
      <th style="width:36px">#</th>
      <th data-sort="name" onclick="setSort('name')">Broker <span class="arrow">&#9650;</span></th>
      <th>Affiliate URL</th>
      <th data-sort="clicks_30d" onclick="setSort('clicks_30d')" style="text-align:right">30d <span class="arrow">&#9660;</span></th>
      <th data-sort="clicks_total" onclick="setSort('clicks_total')" style="text-align:right">All <span class="arrow">&#9660;</span></th>
      <th>Status</th>
      <th style="width:180px">Actions</th>
    </tr></thead>
    <tbody id="tbody"></tbody>
  </table>
  <div id="noResults" class="empty" style="display:none">No brokers match your search</div>
</div>

<!-- Bulk Update -->
<div class="bulk-wrap">
  <div class="section-head">
    <div class="section-icon amber"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></div>
    <h2>Bulk Update</h2>
  </div>
  <p style="color:var(--text-muted);font-size:12px;margin-bottom:8px">Paste lines: <code style="color:var(--green);background:rgba(30,33,48,0.8);padding:2px 8px;border-radius:4px;font-size:12px">slug|https://affiliate-url</code> &mdash; one per line. Tab separator also works.</p>
  <textarea class="bulk-textarea" id="bulkInput" placeholder="ic-markets|https://go.icmarkets.com/visit/?bta=12345&#10;pepperstone|https://track.pepperstone.com/?ref=67890&#10;etoro|https://med.etoro.com/B12345_A67890.aspx" oninput="parseBulk()"></textarea>
  <div class="bulk-preview" id="bulkPreview"></div>
  <div class="bulk-bar">
    <span class="bulk-count" id="bulkCount"></span>
    <button class="btn btn-save" id="bulkApply" onclick="applyBulk()" style="display:none">Apply All</button>
    <span id="bulkStatus" class="status-msg"></span>
  </div>
</div>

<!-- Change History (Timeline) -->
<div class="changes-wrap">
  <div class="section-head">
    <div class="section-icon purple"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
    <h2>Change History</h2>
    <span style="font-size:10px;color:var(--text-muted);margin-left:auto">Last 50 changes</span>
  </div>
  <div id="timeline" class="timeline"></div>
</div>

${shellFooter}

<script>
const API_KEY = '${esc(key)}';
const ENC_KEY = '${encodedKey}';
let BROKERS = ${brokersJson};
const CHANGES = ${changesJson};
const MAX_CLICKS = ${maxClicks30d};
let currentSort = { field: 'name', dir: 'asc' };
let currentFilter = 'all';
let editingSlug = null;

// ─── RENDER BROKERS TABLE ───
function render() {
  const q = document.getElementById('search').value.toLowerCase();
  let list = BROKERS.filter(b => {
    if (currentFilter === 'active' && b.placeholder) return false;
    if (currentFilter === 'placeholder' && !b.placeholder) return false;
    if (q && !b.name.toLowerCase().includes(q) && !b.slug.includes(q) && !b.domain.includes(q)) return false;
    return true;
  });

  list.sort((a, b) => {
    const f = currentSort.field;
    let va = f === 'name' ? a.name.toLowerCase() : a[f];
    let vb = f === 'name' ? b.name.toLowerCase() : b[f];
    if (va < vb) return currentSort.dir === 'asc' ? -1 : 1;
    if (va > vb) return currentSort.dir === 'asc' ? 1 : -1;
    return 0;
  });

  const tbody = document.getElementById('tbody');
  const noRes = document.getElementById('noResults');

  if (list.length === 0) {
    tbody.innerHTML = '';
    noRes.style.display = 'block';
    return;
  }
  noRes.style.display = 'none';

  tbody.innerHTML = list.map((b, i) => {
    const isEditing = editingSlug === b.slug;
    const initial = b.name.charAt(0);

    // Parse URL for display
    let urlDomain = b.domain || '—';
    let urlPath = '';
    try {
      const u = new URL(b.url);
      urlPath = u.pathname + u.search;
      if (urlPath.length > 45) urlPath = urlPath.slice(0, 45) + '...';
    } catch {}

    // Tracking params badges
    const trackKeys = ['bta','nci','ref','aff','camp','utm_source','utm_medium','pid','partner','affiliate','clickid','subid','sub_id','a_aid','a_bid'];
    let paramsHtml = '';
    if (b.params && b.params.length > 0) {
      paramsHtml = '<div class="url-params">' + b.params.map(p => {
        const isTrack = trackKeys.some(k => p.toLowerCase().includes(k));
        return '<span class="param-tag '+(isTrack?'track':'generic')+'">'+esc2(p)+'</span>';
      }).join('') + '</div>';
    }

    // Click bar (mini bar chart per broker)
    const clickPct = MAX_CLICKS > 0 ? Math.round((b.clicks_30d / MAX_CLICKS) * 100) : 0;

    return '<tr id="row-'+b.slug+'" data-slug="'+b.slug+'">' +
      '<td style="color:var(--text-muted);font-size:11px">'+(i+1)+'</td>' +
      '<td><div class="broker-cell">' +
        '<div class="broker-icon">' + esc2(initial) + '</div>' +
        '<div class="broker-info"><span class="broker-name">'+esc2(b.name)+'</span><span class="broker-slug">'+b.slug+'</span></div>' +
      '</div></td>' +
      '<td class="url-cell" title="'+esc2(b.url)+'"><span class="url-domain">'+esc2(urlDomain)+'</span><span class="url-path">'+esc2(urlPath)+'</span>' + paramsHtml + '</td>' +
      '<td class="num"><div class="click-bar"><div class="click-fill" style="width:'+clickPct+'%"></div></div>'+b.clicks_30d+'</td>' +
      '<td class="num">'+b.clicks_total+'</td>' +
      '<td><span class="badge '+(b.placeholder?'badge-yellow':'badge-green')+'">'+(b.placeholder?'Placeholder':'Active')+'</span>' +
        (b.last_changed ? '<br><span class="last-changed">'+timeAgo(b.last_changed)+'</span>' : '') +
      '</td>' +
      '<td class="actions">' +
        '<button class="btn btn-edit" onclick="startEdit(\\''+b.slug+'\\')">Edit</button>' +
        '<button class="btn btn-test" onclick="testRedirect(\\''+b.slug+'\\')" title="Test /go/'+b.slug+'">Test</button>' +
        '<button class="btn btn-copy" onclick="copyUrl(\\''+b.slug+'\\')" title="Copy affiliate URL">Copy</button>' +
        '<button class="btn btn-go" onclick="copyGoUrl(\\''+b.slug+'\\')" title="Copy tracking URL">/go/</button>' +
      '</td></tr>' +
      (isEditing ? editRowHtml(b) : '');
  }).join('');

  // Update sort arrows
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.classList.toggle('sorted', th.dataset.sort === currentSort.field);
    const arrow = th.querySelector('.arrow');
    if (th.dataset.sort === currentSort.field) {
      arrow.innerHTML = currentSort.dir === 'asc' ? '&#9650;' : '&#9660;';
    }
  });
}

function editRowHtml(b) {
  return '<tr class="edit-row" id="edit-'+b.slug+'">' +
    '<td colspan="7" style="padding:14px 12px">' +
    '<div class="edit-bar">' +
    '<input class="edit-input" id="editUrl" value="'+esc2(b.url)+'" style="flex:1;min-width:300px" onkeydown="editKeydown(event,\\''+b.slug+'\\')" placeholder="https://...">' +
    '<button class="btn btn-save" onclick="saveEdit(\\''+b.slug+'\\')">Save</button>' +
    '<button class="btn btn-cancel" onclick="cancelEdit()">Cancel</button>' +
    '</div>' +
    '<div class="edit-hint" style="margin-top:6px">Press <kbd class="kbd">Enter</kbd> to save, <kbd class="kbd">Esc</kbd> to cancel</div>' +
    '</td></tr>';
}

function esc2(s) { return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;') : ''; }

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const then = new Date(dateStr + (dateStr.includes('Z') ? '' : 'Z'));
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  if (days < 30) return days + 'd ago';
  return dateStr.slice(0, 10);
}

// ─── SEARCH ───
document.getElementById('search').addEventListener('input', render);

// ─── FILTER ───
function setFilter(f) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === f));
  render();
}

// ─── SORT ───
function setSort(field) {
  if (currentSort.field === field) {
    currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort = { field, dir: field === 'name' ? 'asc' : 'desc' };
  }
  render();
}

// ─── EDIT ───
function startEdit(slug) {
  editingSlug = slug;
  render();
  const input = document.getElementById('editUrl');
  if (input) { input.focus(); input.select(); }
}

function cancelEdit() {
  editingSlug = null;
  render();
}

function editKeydown(e, slug) {
  if (e.key === 'Enter') { e.preventDefault(); saveEdit(slug); }
  if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
}

async function saveEdit(slug) {
  const input = document.getElementById('editUrl');
  const newUrl = input.value.trim();

  if (!newUrl.startsWith('https://')) {
    input.style.borderColor = 'var(--red)';
    input.style.boxShadow = '0 0 0 3px var(--red-glow)';
    showToast('URL must start with https://', true);
    return;
  }

  const btn = input.parentElement.querySelector('.btn-save');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    const res = await fetch('/api/admin/brokers/' + slug + '?key=' + ENC_KEY, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ affiliate_url: newUrl }),
    });
    const data = await res.json();

    if (!res.ok) {
      input.style.borderColor = 'var(--red)';
      showToast(data.error || 'Error saving', true);
      btn.textContent = 'Save';
      btn.disabled = false;
      return;
    }

    // Update local data
    const b = BROKERS.find(b => b.slug === slug);
    if (b) {
      b.url = newUrl;
      b.placeholder = newUrl.includes('camp=RATEDBROKERS');
      try { b.domain = new URL(newUrl).hostname.replace(/^www\\./, ''); } catch { b.domain = ''; }
      b.last_changed = new Date().toISOString();
    }

    editingSlug = null;
    render();

    const row = document.getElementById('row-' + slug);
    if (row) row.classList.add('success-flash');

    showToast('Saved: ' + slug);
  } catch (e) {
    showToast('Network error', true);
    btn.textContent = 'Save';
    btn.disabled = false;
  }
}

// ─── TEST / COPY ───
function testRedirect(slug) { window.open('/go/' + slug, '_blank'); }
function copyUrl(slug) {
  const b = BROKERS.find(x => x.slug === slug);
  if (!b) return;
  navigator.clipboard.writeText(b.url).then(() => showToast('Copied URL: ' + slug));
}
function copyGoUrl(slug) {
  const goUrl = location.origin + '/go/' + slug;
  navigator.clipboard.writeText(goUrl).then(() => showToast('Copied: /go/' + slug));
}

function showToast(msg, isError) {
  const t = document.createElement('div');
  t.className = 'toast' + (isError ? ' error' : '');
  t.innerHTML = (isError ? '&#10006; ' : '&#10003; ') + esc2(msg);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

// ─── EXPORT JSON ───
function exportJSON() {
  const data = BROKERS.map(b => ({ slug: b.slug, name: b.name, affiliate_url: b.url, status: b.placeholder ? 'placeholder' : 'active' }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ratedbrokers-affiliates-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  showToast('Exported ' + data.length + ' brokers');
}

// ─── BULK PASTE ───
let bulkItems = [];

function parseBulk() {
  const raw = document.getElementById('bulkInput').value.trim();
  const lines = raw.split('\\n').filter(l => l.trim());
  bulkItems = [];
  const preview = document.getElementById('bulkPreview');
  const count = document.getElementById('bulkCount');
  const applyBtn = document.getElementById('bulkApply');

  if (!raw) {
    preview.innerHTML = '';
    count.textContent = '';
    applyBtn.style.display = 'none';
    return;
  }

  let html = '';
  let errors = 0;
  const slugSet = new Set(BROKERS.map(b => b.slug));

  for (const line of lines) {
    const sep = line.includes('|') ? '|' : line.includes('\\t') ? '\\t' : null;
    if (!sep) { html += '<div class="bp-item"><span class="bp-err">&#10006; Invalid format: '+esc2(line.slice(0,60))+'</span></div>'; errors++; continue; }
    const parts = line.split(sep);
    const slug = parts[0].trim().toLowerCase();
    const url = parts.slice(1).join(sep).trim();

    if (!slug || !url.startsWith('https://')) {
      html += '<div class="bp-item"><span class="bp-err">&#10006; '+esc2(slug)+' — URL must start with https://</span></div>';
      errors++;
      continue;
    }
    if (!slugSet.has(slug)) {
      html += '<div class="bp-item"><span class="bp-err">&#10006; Unknown slug: '+esc2(slug)+'</span></div>';
      errors++;
      continue;
    }

    bulkItems.push({ slug, url });
    html += '<div class="bp-item"><span class="bp-slug">&#10003; '+slug+'</span><span class="bp-url">'+esc2(url.length>60?url.slice(0,60)+'...':url)+'</span></div>';
  }

  preview.innerHTML = html;
  count.textContent = bulkItems.length + ' valid' + (errors ? ', ' + errors + ' errors' : '');

  if (bulkItems.length > 0) {
    applyBtn.style.display = 'inline-block';
    applyBtn.disabled = false;
    applyBtn.textContent = 'Apply ' + bulkItems.length + ' URLs';
  } else {
    applyBtn.style.display = 'none';
  }
}

async function applyBulk() {
  const btn = document.getElementById('bulkApply');
  const status = document.getElementById('bulkStatus');
  btn.disabled = true;
  btn.textContent = 'Applying...';
  status.className = 'status-msg';
  status.textContent = '';

  let ok = 0, fail = 0;
  for (const item of bulkItems) {
    try {
      const res = await fetch('/api/admin/brokers/' + item.slug + '?key=' + ENC_KEY, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ affiliate_url: item.url }),
      });
      if (res.ok) {
        ok++;
        const b = BROKERS.find(b => b.slug === item.slug);
        if (b) {
          b.url = item.url;
          b.placeholder = item.url.includes('camp=RATEDBROKERS');
          try { b.domain = new URL(item.url).hostname.replace(/^www\\./, ''); } catch { b.domain = ''; }
        }
      } else { fail++; }
    } catch { fail++; }
  }

  status.className = 'status-msg ' + (fail === 0 ? 'ok' : 'err');
  status.textContent = ok + ' updated' + (fail > 0 ? ', ' + fail + ' failed' : '');

  document.getElementById('bulkInput').value = '';
  document.getElementById('bulkPreview').innerHTML = '';
  document.getElementById('bulkCount').textContent = '';
  btn.style.display = 'none';
  bulkItems = [];
  render();
  showToast(ok + ' URLs updated');
}

// ─── RENDER CHANGES (Timeline) ───
function renderChanges() {
  const container = document.getElementById('timeline');

  if (CHANGES.length === 0) {
    container.innerHTML = '<div class="empty">No changes yet</div>';
    return;
  }
  container.innerHTML = CHANGES.map(c => {
    let oldDisplay = c.old_value || '—';
    let newDisplay = c.new_value || '—';
    // Shorten URLs to domain for readability
    if (c.field === 'affiliate_url') {
      try { oldDisplay = new URL(c.old_value).hostname.replace(/^www\\./, '') + new URL(c.old_value).pathname.slice(0, 20); } catch {}
      try { newDisplay = new URL(c.new_value).hostname.replace(/^www\\./, '') + new URL(c.new_value).pathname.slice(0, 20); } catch {}
    }
    return '<div class="tl-item">' +
      '<div class="tl-head">' +
        '<span class="tl-broker">'+esc2(c.broker_slug)+'</span>' +
        '<span class="tl-field">'+esc2(c.field)+'</span>' +
        '<span class="tl-time">'+timeAgo(c.changed_at)+'</span>' +
      '</div>' +
      '<div class="tl-diff">' +
        '<span class="tl-old" title="'+esc2(c.old_value||'')+'">'+esc2(oldDisplay)+'</span>' +
        '<span class="tl-arrow">&#10142;</span>' +
        '<span class="tl-new" title="'+esc2(c.new_value)+'">'+esc2(newDisplay)+'</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ─── INIT ───
setFilter('all');
render();
renderChanges();

// Global keyboard shortcuts
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); document.getElementById('search').focus(); }
  if (e.key === 'Escape' && editingSlug) cancelEdit();
});

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
