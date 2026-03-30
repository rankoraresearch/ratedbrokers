import { corsHeaders } from '../utils/cors.js';
import { adminHeaderCSS, adminHeaderHTML, adminHeaderScript } from '../utils/adminLayout.js';

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
        (SELECT COUNT(*) FROM clicks c WHERE c.broker_slug = b.slug AND c.created_at >= date('now', '-30 days')) as clicks_30d
      FROM brokers b ORDER BY b.name
    `).all(),
    env.DB.prepare(`
      SELECT broker_slug, field, old_value, new_value, changed_at
      FROM broker_changes ORDER BY changed_at DESC LIMIT 30
    `).all(),
  ]);

  const brokers = brokersResult.results;
  const changes = changesResult.results;

  const totalBrokers = brokers.length;
  const placeholderCount = brokers.filter(b => isPlaceholder(b.affiliate_url)).length;
  const configuredCount = totalBrokers - placeholderCount;
  const totalClicks = brokers.reduce((s, b) => s + b.clicks_total, 0);

  // JSON data for client-side rendering
  const brokersJson = JSON.stringify(brokers.map(b => ({
    slug: b.slug,
    name: b.name,
    url: b.affiliate_url,
    clicks_total: b.clicks_total,
    clicks_30d: b.clicks_30d,
    placeholder: isPlaceholder(b.affiliate_url),
  })));

  const changesJson = JSON.stringify(changes);

  const shellCSS = adminHeaderCSS();
  const shellHeader = adminHeaderHTML('affiliate', encodedKey);
  const shellScript = adminHeaderScript();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RatedBrokers — Affiliate Admin</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f1117; color: #e0e0e0; }
  ${shellCSS}
  h2 { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
  .card { background: #1a1d27; border-radius: 10px; padding: 16px; }
  .card .value { font-size: 28px; font-weight: 700; color: #4ade80; font-variant-numeric: tabular-nums; }
  .card .label { font-size: 12px; color: #666; margin-top: 2px; }
  .card .value.yellow { color: #fbbf24; }
  .card .value.blue { color: #60a5fa; }
  .toolbar { display: flex; gap: 10px; margin-bottom: 16px; align-items: center; flex-wrap: wrap; }
  .search { background: #1a1d27; color: #e0e0e0; border: 1px solid #2a2d37; padding: 8px 14px; border-radius: 8px; font-size: 14px; width: 280px; outline: none; transition: border 0.15s; }
  .search:focus { border-color: #4ade80; }
  .filter-btn { background: #1a1d27; color: #888; border: 1px solid #2a2d37; padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .filter-btn:hover, .filter-btn.active { background: #2a2d37; color: #e0e0e0; }
  .filter-btn.active { border-color: #4ade80; color: #4ade80; }
  .sort-label { color: #666; font-size: 12px; margin-left: auto; }
  .table-wrap { background: #1a1d27; border-radius: 10px; padding: 16px; margin-bottom: 24px; overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 9px 10px; border-bottom: 1px solid #22252f; font-size: 13px; }
  th { color: #666; font-weight: 600; cursor: pointer; user-select: none; white-space: nowrap; }
  th:hover { color: #aaa; }
  th .arrow { font-size: 10px; margin-left: 3px; opacity: 0.4; }
  th.sorted .arrow { opacity: 1; color: #4ade80; }
  td.num { text-align: right; font-variant-numeric: tabular-nums; font-family: 'SF Mono', 'Fira Code', monospace; }
  .slug { color: #555; font-size: 11px; font-family: monospace; }
  .url-cell { max-width: 260px; word-break: break-all; color: #777; font-size: 12px; font-family: monospace; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
  .badge-green { background: rgba(74,222,128,0.12); color: #4ade80; }
  .badge-yellow { background: rgba(251,191,36,0.12); color: #fbbf24; }
  .actions { display: flex; gap: 4px; white-space: nowrap; }
  .btn { padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; }
  .btn-edit { background: #2a2d37; color: #e0e0e0; border: 1px solid #3a3d47; }
  .btn-edit:hover { background: #3a3d47; }
  .btn-test { background: rgba(96,165,250,0.12); color: #60a5fa; }
  .btn-test:hover { background: rgba(96,165,250,0.2); }
  .btn-copy { background: rgba(168,85,247,0.12); color: #a855f7; }
  .btn-copy:hover { background: rgba(168,85,247,0.2); }
  .btn-save { background: #059669; color: #fff; }
  .btn-save:hover { background: #047857; }
  .btn-cancel { background: #3a3d47; color: #ccc; }
  .edit-row { background: #12141e; }
  .edit-input { background: #0f1117; color: #e0e0e0; border: 1px solid #4ade80; padding: 8px 10px; border-radius: 6px; width: 100%; font-size: 13px; font-family: monospace; outline: none; }
  .edit-input:focus { box-shadow: 0 0 0 2px rgba(74,222,128,0.2); }
  .success-flash { animation: flash 1.5s ease; }
  @keyframes flash { 0% { background: rgba(74,222,128,0.2); } 100% { background: transparent; } }
  .copied-toast { position: fixed; bottom: 24px; right: 24px; background: #1a1d27; border: 1px solid #4ade80; color: #4ade80; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; z-index: 999; animation: toastIn 0.2s ease, toastOut 0.3s ease 1.2s forwards; }
  @keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes toastOut { to { transform: translateY(20px); opacity: 0; } }
  .bulk-wrap { background: #1a1d27; border-radius: 10px; padding: 16px; margin-bottom: 24px; }
  .bulk-textarea { width: 100%; background: #0f1117; color: #e0e0e0; border: 1px solid #2a2d37; border-radius: 8px; padding: 10px; font-family: monospace; font-size: 13px; min-height: 100px; resize: vertical; outline: none; transition: border 0.15s; }
  .bulk-textarea:focus { border-color: #4ade80; }
  .bulk-bar { display: flex; gap: 10px; align-items: center; margin-top: 10px; }
  .bulk-count { color: #888; font-size: 13px; }
  .bulk-preview { margin-top: 10px; max-height: 180px; overflow-y: auto; }
  .bp-item { padding: 5px 0; border-bottom: 1px solid #1e2130; font-size: 12px; display: flex; gap: 12px; }
  .bp-item .bp-slug { color: #4ade80; font-weight: 600; min-width: 140px; font-family: monospace; }
  .bp-item .bp-url { color: #777; word-break: break-all; font-family: monospace; }
  .bp-item .bp-err { color: #f87171; }
  .status-msg { font-size: 13px; }
  .status-msg.ok { color: #4ade80; }
  .status-msg.err { color: #f87171; }
  .changes-wrap { background: #1a1d27; border-radius: 10px; padding: 16px; }
  .changes-wrap td { font-size: 12px; }
  .changes-wrap .old { color: #f87171; text-decoration: line-through; }
  .changes-wrap .new { color: #4ade80; }
  .changes-wrap .ts { color: #555; font-size: 11px; white-space: nowrap; }
  .empty { color: #444; font-style: italic; padding: 20px; text-align: center; }
  @media (max-width: 768px) {
    .cards { grid-template-columns: repeat(2, 1fr); }
    .search { width: 100%; }
    .toolbar { flex-direction: column; align-items: stretch; }
    .sort-label { margin-left: 0; }
  }
</style>
</head>
<body>
<div class="admin-shell">
${shellHeader}
<div class="admin-body">

<div class="cards">
  <div class="card"><div class="value">${totalBrokers}</div><div class="label">Total Brokers</div></div>
  <div class="card"><div class="value">${configuredCount}</div><div class="label">Active Links</div></div>
  <div class="card"><div class="value yellow">${placeholderCount}</div><div class="label">Placeholders</div></div>
  <div class="card"><div class="value blue">${totalClicks}</div><div class="label">Total Clicks</div></div>
</div>

<div class="toolbar">
  <input class="search" id="search" type="text" placeholder="Search broker name or slug..." autofocus>
  <button class="filter-btn" data-filter="all" onclick="setFilter('all')">All (${totalBrokers})</button>
  <button class="filter-btn" data-filter="active" onclick="setFilter('active')">Active (${configuredCount})</button>
  <button class="filter-btn" data-filter="placeholder" onclick="setFilter('placeholder')">Placeholder (${placeholderCount})</button>
</div>

<div class="table-wrap">
  <table>
    <thead><tr>
      <th style="width:36px">#</th>
      <th data-sort="name" onclick="setSort('name')">Broker <span class="arrow">▲</span></th>
      <th>Current URL</th>
      <th data-sort="clicks_30d" onclick="setSort('clicks_30d')" style="text-align:right">30d <span class="arrow">▼</span></th>
      <th data-sort="clicks_total" onclick="setSort('clicks_total')" style="text-align:right">All <span class="arrow">▼</span></th>
      <th>Status</th>
      <th style="width:140px">Actions</th>
    </tr></thead>
    <tbody id="tbody"></tbody>
  </table>
  <div id="noResults" class="empty" style="display:none">No brokers match your search</div>
</div>

<div class="bulk-wrap">
  <h2>Bulk Update</h2>
  <p style="color:#666;font-size:12px;margin-bottom:8px">Paste lines: <code style="color:#4ade80;background:#1e2130;padding:2px 6px;border-radius:3px">slug|https://url</code></p>
  <textarea class="bulk-textarea" id="bulkInput" placeholder="ic-markets|https://go.icmarkets.com/visit/?bta=12345&#10;pepperstone|https://track.pepperstone.com/?ref=67890" oninput="parseBulk()"></textarea>
  <div class="bulk-preview" id="bulkPreview"></div>
  <div class="bulk-bar">
    <span class="bulk-count" id="bulkCount"></span>
    <button class="btn btn-save" id="bulkApply" onclick="applyBulk()" style="display:none">Apply All</button>
    <span id="bulkStatus" class="status-msg"></span>
  </div>
</div>

<div class="changes-wrap">
  <h2>Change History</h2>
  <table>
    <thead><tr><th>Broker</th><th>Old URL</th><th>New URL</th><th>When</th></tr></thead>
    <tbody id="changesTbody"></tbody>
  </table>
</div>

<script>
const API_KEY = '${esc(key)}';
const ENC_KEY = '${encodedKey}';
let BROKERS = ${brokersJson};
const CHANGES = ${changesJson};
let currentSort = { field: 'name', dir: 'asc' };
let currentFilter = 'all';
let editingSlug = null;

// ─── RENDER BROKERS TABLE ───
function render() {
  const q = document.getElementById('search').value.toLowerCase();
  let list = BROKERS.filter(b => {
    if (currentFilter === 'active' && b.placeholder) return false;
    if (currentFilter === 'placeholder' && !b.placeholder) return false;
    if (q && !b.name.toLowerCase().includes(q) && !b.slug.includes(q)) return false;
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
    const truncUrl = b.url.length > 55 ? b.url.slice(0, 55) + '...' : b.url;
    const isEditing = editingSlug === b.slug;
    return '<tr id="row-'+b.slug+'" data-slug="'+b.slug+'">' +
      '<td style="color:#555">'+(i+1)+'</td>' +
      '<td><strong>'+esc2(b.name)+'</strong><br><span class="slug">'+b.slug+'</span></td>' +
      '<td class="url-cell" title="'+esc2(b.url)+'">'+esc2(truncUrl)+'</td>' +
      '<td class="num">'+b.clicks_30d+'</td>' +
      '<td class="num">'+b.clicks_total+'</td>' +
      '<td><span class="badge '+(b.placeholder?'badge-yellow':'badge-green')+'">'+(b.placeholder?'Placeholder':'Active')+'</span></td>' +
      '<td class="actions">' +
        '<button class="btn btn-edit" onclick="startEdit(\''+b.slug+'\')">Edit</button>' +
        '<button class="btn btn-test" onclick="testRedirect(\''+b.slug+'\')" title="Test /go/'+b.slug+'">Test</button>' +
        '<button class="btn btn-copy" onclick="copyUrl(\''+b.slug+'\')" title="Copy URL">Copy</button>' +
      '</td></tr>' +
      (isEditing ? editRowHtml(b) : '');
  }).join('');

  // Update sort arrows
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.classList.toggle('sorted', th.dataset.sort === currentSort.field);
    const arrow = th.querySelector('.arrow');
    if (th.dataset.sort === currentSort.field) {
      arrow.textContent = currentSort.dir === 'asc' ? '▲' : '▼';
    }
  });
}

function editRowHtml(b) {
  return '<tr class="edit-row" id="edit-'+b.slug+'">' +
    '<td colspan="7" style="padding:12px 10px">' +
    '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
    '<span style="color:#666;font-size:12px;flex-shrink:0">New URL:</span>' +
    '<input class="edit-input" id="editUrl" value="'+esc2(b.url)+'" style="flex:1;min-width:300px" onkeydown="editKeydown(event,\''+b.slug+'\')">' +
    '<button class="btn btn-save" onclick="saveEdit(\''+b.slug+'\')">Save</button>' +
    '<button class="btn btn-cancel" onclick="cancelEdit()">Cancel</button>' +
    '</div></td></tr>';
}

function esc2(s) { return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;') : ''; }

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
    input.style.borderColor = '#f87171';
    input.style.boxShadow = '0 0 0 2px rgba(248,113,113,0.2)';
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
      input.style.borderColor = '#f87171';
      btn.textContent = data.error || 'Error';
      btn.disabled = false;
      return;
    }

    // Update local data
    const b = BROKERS.find(b => b.slug === slug);
    if (b) {
      b.url = newUrl;
      b.placeholder = newUrl.includes('camp=RATEDBROKERS');
    }

    editingSlug = null;
    render();

    // Flash success
    const row = document.getElementById('row-' + slug);
    if (row) row.classList.add('success-flash');

    showToast('Saved: ' + slug);
  } catch (e) {
    btn.textContent = 'Error';
    btn.disabled = false;
  }
}

// ─── TEST REDIRECT ───
function testRedirect(slug) {
  window.open('/go/' + slug, '_blank');
}

// ─── COPY URL ───
function copyUrl(slug) {
  const b = BROKERS.find(x => x.slug === slug);
  if (!b) return;
  navigator.clipboard.writeText(b.url).then(() => showToast('Copied: ' + slug));
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'copied-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1600);
}

// ─── BULK PASTE (auto-parse on input) ───
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
    if (!sep) { html += '<div class="bp-item"><span class="bp-err">Invalid format: '+esc2(line.slice(0,60))+'</span></div>'; errors++; continue; }
    const parts = line.split(sep);
    const slug = parts[0].trim().toLowerCase();
    const url = parts.slice(1).join(sep).trim();

    if (!slug || !url.startsWith('https://')) {
      html += '<div class="bp-item"><span class="bp-err">Invalid: '+esc2(slug)+' — URL must start with https://</span></div>';
      errors++;
      continue;
    }
    if (!slugSet.has(slug)) {
      html += '<div class="bp-item"><span class="bp-err">Unknown slug: '+esc2(slug)+'</span></div>';
      errors++;
      continue;
    }

    bulkItems.push({ slug, url });
    html += '<div class="bp-item"><span class="bp-slug">'+slug+'</span><span class="bp-url">'+esc2(url.length>70?url.slice(0,70)+'...':url)+'</span></div>';
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
        if (b) { b.url = item.url; b.placeholder = item.url.includes('camp=RATEDBROKERS'); }
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

// ─── RENDER CHANGES ───
function renderChanges() {
  const tbody = document.getElementById('changesTbody');
  if (CHANGES.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty">No changes yet</td></tr>';
    return;
  }
  tbody.innerHTML = CHANGES.filter(c => c.field === 'affiliate_url').map(c => {
    const oldDomain = c.old_value ? new URL(c.old_value).hostname : '—';
    const newDomain = new URL(c.new_value).hostname;
    return '<tr>' +
      '<td><strong>'+esc2(c.broker_slug)+'</strong></td>' +
      '<td class="old" title="'+esc2(c.old_value||'')+'">'+esc2(oldDomain)+'</td>' +
      '<td class="new" title="'+esc2(c.new_value)+'">'+esc2(newDomain)+'</td>' +
      '<td class="ts">'+esc2(c.changed_at)+'</td></tr>';
  }).join('');
}

// ─── INIT ───
setFilter('all');
render();
renderChanges();

// Global keyboard shortcut: Cmd/Ctrl+K → focus search
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
