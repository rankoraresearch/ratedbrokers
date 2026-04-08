/**
 * Reviews — admin section for editing broker review content.
 * Stores overrides in D1 (per broker × section × lang), merges with static content on frontend.
 * Original content loaded from broker-content.json (bundled in Worker, NOT public).
 */
import { corsHeaders } from '../utils/cors.js';
import { adminHeaderCSS, adminHeaderHTML, adminFooterHTML, adminHeaderScript } from '../utils/adminLayout.js';
import { checkAuth, extractKey } from '../utils/auth.js';
import brokerContentJson from '../data/broker-content.json';

// ─── GET /api/admin/broker-content — protected endpoint for original content ───
// Accepts admin key OR expert token (both need broker content for editor)
export async function handleBrokerContent(request, env) {
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };

  // Check admin auth first
  if (checkAuth(request, env)) {
    return Response.json(brokerContentJson, { headers });
  }

  // Check expert token (from query param or Authorization header)
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || (() => {
    const auth = request.headers.get('Authorization');
    return auth?.match(/^Bearer\s+(.+)$/i)?.[1];
  })();
  if (token) {
    const row = await env.DB.prepare(
      'SELECT id FROM expert_tokens WHERE token = ? AND active = 1'
    ).bind(token).first();
    if (row) return Response.json(brokerContentJson, { headers });
  }

  return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()} ${String(dt.getUTCHours()).padStart(2,'0')}:${String(dt.getUTCMinutes()).padStart(2,'0')}`;
}

// All editable sections in broker reviews
const SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'scoring', label: 'Scoring' },
  { key: 'accountIntro', label: 'Account Intro' },
  { key: 'accountOutro', label: 'Account Outro' },
  { key: 'regulation', label: 'Regulation' },
  { key: 'costs', label: 'Costs' },
  { key: 'spreads', label: 'Spreads' },
  { key: 'deposits', label: 'Deposits' },
  { key: 'platforms', label: 'Platforms' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'support', label: 'Support' },
  { key: 'education', label: 'Education' },
  { key: 'trustpilot', label: 'Trustpilot' },
  { key: 'country', label: 'Country' },
  { key: 'verdict', label: 'Verdict' },
];

function getLang(url) {
  return url.searchParams.get('lang') || 'en';
}

// ─── GET /api/reviews/:slug/overrides — PUBLIC (for frontend merge) ───
export async function handleReviewOverridesPublic(request, env, slug) {
  const url = new URL(request.url);
  const lang = getLang(url);
  const headers = {
    ...corsHeaders(request),
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
  };

  const overrides = await env.DB.prepare(
    `SELECT section, content FROM review_overrides WHERE broker_slug = ? AND lang = ? AND status = 'published'`
  ).bind(slug, lang).all();

  const result = {};
  for (const row of overrides.results) {
    result[row.section] = row.content;
  }

  return Response.json(result, { headers });
}

// ─── GET /api/admin/reviews/:slug/content — all overrides for broker (admin) ───
export async function handleReviewContent(request, env, slug) {
  const url = new URL(request.url);
  const lang = getLang(url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkAuth(request, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const overrides = await env.DB.prepare(
    `SELECT section, content, edited_by, status, updated_at FROM review_overrides WHERE broker_slug = ? AND lang = ? ORDER BY section`
  ).bind(slug, lang).all();

  return Response.json({ slug, lang, overrides: overrides.results }, { headers });
}

// ─── PUT /api/admin/reviews/:slug/content — save section override ───
export async function handleReviewContentUpdate(request, env, slug) {
  const url = new URL(request.url);
  const lang = getLang(url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkAuth(request, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers });
  }

  const { section, content, edited_by } = body;

  if (!section || !content) {
    return Response.json({ error: 'section and content are required' }, { status: 400, headers });
  }

  const validSections = SECTIONS.map(s => s.key);
  if (!validSections.includes(section)) {
    return Response.json({ error: `Invalid section: ${section}` }, { status: 400, headers });
  }

  const editor = edited_by || 'admin';

  // Get existing for audit log
  const existing = await env.DB.prepare(
    `SELECT content FROM review_overrides WHERE broker_slug = ? AND section = ? AND lang = ?`
  ).bind(slug, section, lang).first();

  const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

  // Upsert override
  await env.DB.prepare(`
    INSERT INTO review_overrides (broker_slug, section, lang, content, edited_by, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(broker_slug, section, lang) DO UPDATE SET
      content = excluded.content,
      edited_by = excluded.edited_by,
      updated_at = excluded.updated_at
  `).bind(slug, section, lang, content, editor, nowStr).run();

  // Audit log
  await env.DB.prepare(`
    INSERT INTO review_edit_log (broker_slug, section, action, edited_by, old_content, new_content)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(slug, section, existing ? 'update' : 'create', editor, existing?.content || null, content).run();

  return Response.json({ ok: true, slug, section, lang }, { headers });
}

// ─── DELETE /api/admin/reviews/:slug/content/:section — revert to original ───
export async function handleReviewContentDelete(request, env, slug, section) {
  const url = new URL(request.url);
  const lang = getLang(url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkAuth(request, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const existing = await env.DB.prepare(
    `SELECT content FROM review_overrides WHERE broker_slug = ? AND section = ? AND lang = ?`
  ).bind(slug, section, lang).first();

  if (existing) {
    await env.DB.prepare(
      `DELETE FROM review_overrides WHERE broker_slug = ? AND section = ? AND lang = ?`
    ).bind(slug, section, lang).run();

    await env.DB.prepare(`
      INSERT INTO review_edit_log (broker_slug, section, action, edited_by, old_content, new_content)
      VALUES (?, ?, 'revert', 'admin', ?, NULL)
    `).bind(slug, section, existing.content).run();
  }

  return Response.json({ ok: true, slug, section, lang }, { headers });
}

// ─── GET /api/admin/reviews/log — recent edit log ───
export async function handleReviewLog(request, env) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkAuth(request, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const log = await env.DB.prepare(
    `SELECT broker_slug, section, action, edited_by, created_at FROM review_edit_log ORDER BY created_at DESC LIMIT 100`
  ).all();

  return Response.json(log.results, { headers });
}

// ─── GET /api/admin/reviews/tokens — list expert tokens ───
export async function handleTokensList(request, env) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkAuth(request, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const tokens = await env.DB.prepare(
    `SELECT id, token, name, email, lang, broker_slugs, active, created_at, expires_at FROM expert_tokens ORDER BY created_at DESC`
  ).all();

  return Response.json(tokens.results, { headers });
}

// ─── POST /api/admin/reviews/tokens — create expert token ───
export async function handleTokenCreate(request, env) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkAuth(request, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers });
  }

  const { name, email, lang, broker_slugs, expires_days } = body;
  if (!name) return Response.json({ error: 'name is required' }, { status: 400, headers });

  // Generate secure token
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  const token = Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');

  const expiresAt = expires_days
    ? new Date(Date.now() + expires_days * 86400000).toISOString().slice(0, 19).replace('T', ' ')
    : null;

  await env.DB.prepare(`
    INSERT INTO expert_tokens (token, name, email, lang, broker_slugs, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(token, name, email || null, lang || 'en', broker_slugs || null, expiresAt).run();

  return Response.json({ ok: true, token, name }, { headers });
}

// ─── DELETE /api/admin/reviews/tokens/:id — revoke token ───
export async function handleTokenDelete(request, env, id) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkAuth(request, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  await env.DB.prepare('UPDATE expert_tokens SET active = 0 WHERE id = ?').bind(parseInt(id)).run();
  return Response.json({ ok: true }, { headers });
}

// ─── GET /api/admin/reviews/dashboard — HTML Review Editor ───
export async function handleReviewsDashboard(request, env) {
  const url = new URL(request.url);
  if (!checkAuth(request, env)) return new Response('Unauthorized', { status: 401 });

  const encodedKey = encodeURIComponent(extractKey(request));
  const lang = getLang(url);

  // Stats (filtered by lang)
  const [totalOverrides, totalBrokersEdited, recentEdits] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) as c FROM review_overrides WHERE lang = ?").bind(lang).first(),
    env.DB.prepare("SELECT COUNT(DISTINCT broker_slug) as c FROM review_overrides WHERE lang = ?").bind(lang).first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM review_edit_log WHERE created_at >= datetime('now', '-7 days')").first(),
  ]);

  // Broker list with override counts (filtered by lang)
  const brokers = await env.DB.prepare(`
    SELECT b.slug, b.name,
      (SELECT COUNT(*) FROM review_overrides ro WHERE ro.broker_slug = b.slug AND ro.lang = ?) as override_count,
      (SELECT MAX(ro.updated_at) FROM review_overrides ro WHERE ro.broker_slug = b.slug AND ro.lang = ?) as last_edited
    FROM brokers b ORDER BY b.name
  `).bind(lang, lang).all();

  // Recent edit log
  const editLog = await env.DB.prepare(
    `SELECT broker_slug, section, action, edited_by, created_at FROM review_edit_log ORDER BY created_at DESC LIMIT 20`
  ).all();

  const brokerRows = brokers.results.map(b => `
    <tr class="broker-row" data-slug="${esc(b.slug)}" data-name="${esc(b.name.toLowerCase())}" onclick="openEditor('${esc(b.slug)}', '${esc(b.name)}')">
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <img src="https://ratedbrokers.com/logos/${esc(b.slug)}.png" width="28" height="28"
               style="border-radius:6px;background:#1e2130" onerror="this.style.display='none'">
          <span style="font-weight:600;color:var(--text-primary)">${esc(b.name)}</span>
        </div>
      </td>
      <td>
        ${b.override_count > 0
          ? `<span style="display:inline-flex;align-items:center;gap:4px;color:var(--green);font-weight:700;font-size:12px;background:var(--green-glow);padding:3px 10px;border-radius:6px">${b.override_count} edits</span>`
          : `<span style="color:var(--text-muted);font-size:12px">Original</span>`}
      </td>
      <td style="color:var(--text-muted);font-size:12px">${b.last_edited ? fmtDate(b.last_edited) : '—'}</td>
      <td>
        <button class="btn-secondary" style="padding:5px 14px;font-size:11px" onclick="event.stopPropagation();openEditor('${esc(b.slug)}', '${esc(b.name)}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
      </td>
    </tr>
  `).join('');

  const logRows = editLog.results.map(e => `
    <tr>
      <td style="font-size:12px;color:var(--text-muted)">${fmtDate(e.created_at)}</td>
      <td style="font-weight:600;color:var(--text-primary)">${esc(e.broker_slug)}</td>
      <td><span style="color:var(--blue);font-size:12px">${esc(e.section)}</span></td>
      <td>
        <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:5px;${
          e.action === 'create' ? 'color:var(--green);background:var(--green-glow)' :
          e.action === 'update' ? 'color:var(--amber);background:var(--amber-glow)' :
          'color:var(--red);background:var(--red-glow)'
        }">${esc(e.action)}</span>
      </td>
      <td style="font-size:12px;color:var(--text-muted)">${esc(e.edited_by)}</td>
    </tr>
  `).join('');

  const sectionTabsHTML = SECTIONS.map((s, i) => `
    <button class="section-tab ${i === 0 ? 'active' : ''}" data-section="${s.key}" onclick="switchSection('${s.key}', this)">
      ${esc(s.label)}
    </button>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Review Editor — Rated.Admin</title>
<link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0c10; color: #f0f0f0; }
  ${adminHeaderCSS()}

  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
  .search-input { padding: 7px 14px; border-radius: 8px; border: 1px solid var(--border); background: rgba(255,255,255,0.04); color: var(--text-primary); font-size: 13px; width: 280px; outline: none; transition: border-color 0.15s; margin-bottom: 14px; }
  .search-input:focus { border-color: var(--green); }
  .search-input::placeholder { color: var(--text-muted); }

  .broker-row { cursor: pointer; }
  .broker-row:hover td { background: rgba(74,222,128,0.04) !important; }

  /* Language selector */
  .lang-selector {
    display: inline-flex; gap: 4px; margin-bottom: 16px;
  }
  .lang-btn {
    padding: 5px 14px; font-size: 12px; font-weight: 700;
    border: 1px solid var(--border); border-radius: 7px;
    background: transparent; color: var(--text-muted); cursor: pointer;
    transition: all 0.15s;
  }
  .lang-btn:hover { border-color: var(--border-hover); color: var(--text-secondary); }
  .lang-btn.active { color: var(--green); background: var(--green-glow); border-color: rgba(74,222,128,0.15); }

  /* ─── Editor Modal ─── */
  .editor-overlay {
    display: none; position: fixed; inset: 0; z-index: 500;
    background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
    animation: fadeIn 0.2s ease;
  }
  .editor-overlay.open { display: flex; align-items: flex-start; justify-content: center; padding: 40px 20px; overflow-y: auto; }

  .editor-panel {
    background: var(--bg-card-solid); border: 1px solid var(--border);
    border-radius: 16px; width: 100%; max-width: 960px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    animation: slideUp 0.25s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .editor-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid var(--border);
  }
  .editor-header h2 { font-size: 16px; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 10px; }
  .editor-header .broker-logo { width: 32px; height: 32px; border-radius: 8px; background: #1e2130; }

  /* Section tabs */
  .section-tabs {
    display: flex; gap: 2px; padding: 12px 24px; border-bottom: 1px solid var(--border);
    overflow-x: auto; scrollbar-width: none;
  }
  .section-tabs::-webkit-scrollbar { display: none; }
  .section-tab {
    padding: 6px 14px; font-size: 12px; font-weight: 600;
    color: var(--text-muted); background: transparent; border: 1px solid transparent;
    border-radius: 7px; cursor: pointer; white-space: nowrap;
    transition: all 0.15s var(--transition);
  }
  .section-tab:hover { color: var(--text-secondary); background: rgba(255,255,255,0.04); }
  .section-tab.active { color: var(--green); background: var(--green-glow); border-color: rgba(74,222,128,0.15); }
  .section-tab.has-override { position: relative; }
  .section-tab.has-override::after {
    content: ''; position: absolute; top: 4px; right: 4px;
    width: 6px; height: 6px; border-radius: 50%; background: var(--green);
  }

  /* Editor body */
  .editor-body { padding: 20px 24px; }

  /* Quill dark theme overrides */
  .ql-toolbar.ql-snow {
    background: rgba(255,255,255,0.04) !important;
    border: 1px solid var(--border) !important;
    border-radius: 10px 10px 0 0 !important;
  }
  .ql-toolbar .ql-stroke { stroke: var(--text-secondary) !important; }
  .ql-toolbar .ql-fill { fill: var(--text-secondary) !important; }
  .ql-toolbar .ql-picker-label { color: var(--text-secondary) !important; }
  .ql-toolbar button:hover .ql-stroke, .ql-toolbar .ql-active .ql-stroke { stroke: var(--green) !important; }
  .ql-toolbar button:hover .ql-fill, .ql-toolbar .ql-active .ql-fill { fill: var(--green) !important; }
  .ql-toolbar button.ql-active { color: var(--green) !important; }
  .ql-snow .ql-tooltip {
    background: var(--bg-card-solid) !important; border: 1px solid var(--border) !important;
    color: var(--text-primary) !important; box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
    border-radius: 8px !important; z-index: 1000 !important;
  }
  .ql-snow .ql-tooltip input[type="text"] {
    background: rgba(255,255,255,0.06) !important; border: 1px solid var(--border) !important;
    color: var(--text-primary) !important; border-radius: 6px !important; padding: 4px 8px !important;
  }
  .ql-snow .ql-tooltip a { color: var(--green) !important; }
  .ql-container.ql-snow {
    border: 1px solid var(--border) !important;
    border-top: none !important;
    border-radius: 0 0 10px 10px !important;
    background: rgba(255,255,255,0.03) !important;
    min-height: 280px;
  }
  .ql-editor {
    color: var(--text-primary) !important;
    font-size: 15px !important;
    line-height: 1.8 !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    min-height: 280px;
  }
  .ql-editor p { margin-bottom: 12px; }
  .ql-editor a { color: var(--green) !important; text-decoration: underline !important; }
  .ql-editor.ql-blank::before { color: var(--text-muted) !important; font-style: normal !important; }

  .editor-meta {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 8px; font-size: 11px; color: var(--text-muted);
  }

  .editor-status {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 6px;
  }
  .editor-status.original { color: var(--text-muted); background: rgba(255,255,255,0.04); }
  .editor-status.modified { color: var(--green); background: var(--green-glow); }

  .editor-actions {
    display: flex; gap: 8px; padding: 16px 24px;
    border-top: 1px solid var(--border);
    justify-content: space-between;
  }
  .editor-actions .left { display: flex; gap: 8px; }
  .editor-actions .right { display: flex; gap: 8px; }

  /* Two-column layout */
  .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 20px; }

  /* Loading spinner */
  .editor-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 200px; color: var(--text-muted); font-size: 13px;
  }

  @media (max-width: 768px) {
    .summary-grid { grid-template-columns: 1fr; }
    .search-input { width: 100%; }
    .content-grid { grid-template-columns: 1fr; }
    .editor-panel { margin: 10px; }
    .section-tabs { padding: 8px 16px; }
  }
</style>
</head>
<body>
<div class="admin-shell">
  ${adminHeaderHTML('reviews', encodedKey)}
  <div class="admin-body">

    <!-- Language selector (future: more languages) -->
    <div class="lang-selector">
      <button class="lang-btn active" data-lang="en">EN</button>
      <!-- Future languages will be added here -->
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="glass-card c-green">
        <div class="card-label">Section Overrides</div>
        <div class="card-value">${totalOverrides.c}</div>
        <div class="card-sub">Active content edits</div>
      </div>
      <div class="glass-card c-blue">
        <div class="card-label">Brokers Edited</div>
        <div class="card-value">${totalBrokersEdited.c}</div>
        <div class="card-sub">of ${brokers.results.length} total</div>
      </div>
      <div class="glass-card c-amber">
        <div class="card-label">Edits This Week</div>
        <div class="card-value">${recentEdits.c}</div>
        <div class="card-sub">Last 7 days</div>
      </div>
    </div>

    <!-- Instructions (collapsible) -->
    <details style="margin-bottom:20px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:14px;overflow:hidden">
      <summary style="padding:14px 20px;cursor:pointer;font-size:13px;font-weight:700;color:var(--text-secondary);display:flex;align-items:center;gap:8px;user-select:none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        Instructions / Expert Guide
        <span style="font-size:11px;color:var(--text-muted);font-weight:400;margin-left:auto">Click to expand</span>
      </summary>
      <div style="padding:0 20px 16px">
        <div style="display:flex;gap:8px;margin-bottom:10px">
          <button class="btn-secondary" style="font-size:11px;padding:4px 12px" onclick="copyGuide('en')">Copy EN</button>
          <button class="btn-secondary" style="font-size:11px;padding:4px 12px" onclick="copyGuide('ru')">Copy RU</button>
          <button class="btn-secondary" style="font-size:11px;padding:4px 12px" onclick="copyGuide('both')">Copy Both</button>
        </div>
        <textarea id="guideEN" style="display:none">## Review Editor — Guide

### Access

Admin access (full control):
${esc(`https://api.ratedbrokers.com/api/admin/reviews/dashboard?key=YOUR_ADMIN_KEY`)}

Expert access (limited to assigned brokers):
${esc(`https://api.ratedbrokers.com/api/expert/dashboard?token=YOUR_EXPERT_TOKEN`)}

Expert tokens are created by the admin. Each token can be restricted to specific brokers, set to a specific language, and given an expiration date.

### How to Edit a Review

1. Open the Review Editor using your link
2. Find the broker — use search or scroll
3. Click the broker row or Edit button
4. The editor opens with 15 section tabs: Overview, Scoring, Account Intro, Account Outro, Regulation, Costs, Spreads, Deposits, Platforms, Mobile, Support, Education, Trustpilot, Country, Verdict
5. Each tab shows the current text from the review
6. Edit the text. Use double line breaks (Enter twice) to separate paragraphs. Plain text only — no HTML or Markdown.
7. Click Save Changes — goes live within 5 minutes (CDN cache)
8. Green dot on a tab = section has been edited (override active)
9. To undo, click Revert to Original — restores the source text

### Important

- Saving creates an override on top of the original. The original is never lost.
- Revert to Original removes your edit and restores the source text.
- All edits are logged with timestamps and editor name.
- Changes may take up to 5 min to appear on the live site (CDN cache).
- Empty content = the original review has no text for this section.</textarea>
        <textarea id="guideRU" style="display:none">## Review Editor — Руководство

### Доступ

Доступ администратора (полный контроль):
${esc(`https://api.ratedbrokers.com/api/admin/reviews/dashboard?key=ВАШ_КЛЮЧ`)}

Доступ эксперта (только назначенные брокеры):
${esc(`https://api.ratedbrokers.com/api/expert/dashboard?token=ВАШ_ТОКЕН`)}

Токены создаются администратором. Каждый токен может быть ограничен конкретными брокерами, привязан к языку и иметь срок действия.

### Как редактировать обзор

1. Откройте Review Editor по вашей ссылке
2. Найдите брокера через поиск или прокруткой
3. Нажмите на строку или кнопку Edit
4. Откроется редактор с 15 вкладками: Overview, Scoring, Account Intro, Account Outro, Regulation, Costs, Spreads, Deposits, Platforms, Mobile, Support, Education, Trustpilot, Country, Verdict
5. Каждая вкладка показывает текущий текст обзора
6. Отредактируйте текст. Двойной Enter для разделения абзацев. Простой текст — без HTML и Markdown.
7. Нажмите Save Changes — изменения появятся на сайте в течение 5 минут (кэш CDN)
8. Зелёная точка на вкладке = секция отредактирована (override активен)
9. Для отмены нажмите Revert to Original — вернёт оригинальный текст

### Важно

- Сохранение создаёт override поверх оригинала. Оригинал не теряется.
- Revert to Original удаляет правку и возвращает исходный текст.
- Все правки логируются с временными метками и именем редактора.
- Изменения могут появиться на сайте с задержкой до 5 мин (кэш CDN).
- Пустое содержимое = в оригинальном обзоре нет текста для этой секции.</textarea>
        <div id="guidePreview" style="background:rgba(0,0,0,0.3);border:1px solid var(--border);border-radius:8px;padding:14px 16px;font-size:12px;line-height:1.7;color:var(--text-secondary);white-space:pre-wrap;max-height:300px;overflow-y:auto;font-family:'SF Mono','Fira Code',monospace"></div>
      </div>
    </details>

    <!-- Content grid: Brokers + Activity -->
    <div class="content-grid">
      <div>
        <div class="section-hdr sh-green">
          <div class="sh-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <h2>Broker Reviews</h2>
        </div>

        <input type="text" class="search-input" id="brokerSearch" placeholder="Search brokers..." oninput="filterBrokers()">

        <div style="overflow-x:auto">
          <table class="premium-table" id="brokerTable">
            <thead><tr>
              <th>Broker</th><th>Status</th><th>Last Edited</th><th></th>
            </tr></thead>
            <tbody>${brokerRows}</tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="section-hdr sh-amber">
          <div class="sh-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <h2>Recent Activity</h2>
        </div>

        ${editLog.results.length === 0
          ? '<div style="padding:30px;text-align:center;color:var(--text-muted);font-size:13px">No edits yet</div>'
          : `<table class="premium-table">
            <thead><tr><th>Date</th><th>Broker</th><th>Section</th><th>Action</th><th>By</th></tr></thead>
            <tbody>${logRows}</tbody>
          </table>`
        }
      </div>
    </div>

  </div>
  ${adminFooterHTML()}
</div>

<!-- Editor Modal -->
<div class="editor-overlay" id="editorOverlay">
  <div class="editor-panel">
    <div class="editor-header">
      <h2>
        <img class="broker-logo" id="editorLogo" src="" onerror="this.style.display='none'">
        <span id="editorTitle">Edit Broker</span>
      </h2>
      <button class="btn-ghost" onclick="closeEditor()" style="font-size:18px;padding:4px 8px">&times;</button>
    </div>

    <div class="section-tabs" id="sectionTabs">
      ${sectionTabsHTML}
    </div>

    <div class="editor-body">
      <div id="editorQuill"></div>
      <div class="editor-meta">
        <span id="editorStatus" class="editor-status original">Original</span>
        <span id="editorUpdated"></span>
      </div>
    </div>

    <div class="editor-actions">
      <div class="left">
        <button class="btn-danger" id="btnRevert" onclick="revertSection()" disabled>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Revert to Original
        </button>
      </div>
      <div class="right">
        <button class="btn-secondary" onclick="closeEditor()">Cancel</button>
        <button class="btn-primary" id="btnSave" onclick="saveSection()">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Save Changes
        </button>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
<script>
const API_KEY = '${encodedKey}';

function authFetch(url, opts = {}) {
  opts.headers = { ...opts.headers, 'Authorization': 'Bearer ' + API_KEY };
  return fetch(url, opts);
}

const SECTIONS = ${JSON.stringify(SECTIONS)};
const CURRENT_LANG = '${lang}';
const FRONTEND_URL = '${env.FRONTEND_URL || 'https://ratedbrokers.com'}';

let currentSlug = null;
let currentSection = 'overview';
let overridesCache = {};
let originalContent = {};
let brokerContentData = null;
let quill = null;

// ─── Init Quill ───
document.addEventListener('DOMContentLoaded', () => {
  quill = new Quill('#editorQuill', {
    theme: 'snow',
    placeholder: 'Loading content...',
    modules: {
      toolbar: [
        ['bold', 'italic'],
        ['link'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean'],
      ],
    },
  });
});

${adminHeaderScript()}

// ─── Load original broker content (once, cached) ───
async function loadBrokerContent() {
  if (brokerContentData) return brokerContentData;
  try {
    const res = await authFetch('/api/admin/broker-content');
    if (res.ok) { brokerContentData = await res.json(); return brokerContentData; }
  } catch (e) { console.error('Failed to load broker-content:', e); }
  return {};
}

// Convert plain text content (string or array from MD) to HTML for Quill
function contentToHtml(val) {
  if (!val) return '';
  const parts = Array.isArray(val) ? val : [val];
  return parts.map(p => '<p>' + escHtml(String(p)) + '</p>').join('');
}
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Get clean HTML from Quill (strip empty trailing paragraphs)
function getEditorHtml() {
  if (!quill) return '';
  let html = quill.root.innerHTML;
  // Remove Quill's empty default
  if (html === '<p><br></p>') return '';
  // Trim trailing empty paragraphs
  html = html.replace(/(<p><br><\\/p>)+$/g, '');
  return html.trim();
}

// ─── Broker Search ───
function filterBrokers() {
  const q = document.getElementById('brokerSearch').value.toLowerCase();
  document.querySelectorAll('#brokerTable tbody tr').forEach(row => {
    const name = row.dataset.name || '';
    const slug = row.dataset.slug || '';
    row.style.display = (name.includes(q) || slug.includes(q)) ? '' : 'none';
  });
}

// ─── Editor ───
async function openEditor(slug, name) {
  currentSlug = slug;
  currentSection = 'overview';
  overridesCache = {};
  originalContent = {};

  document.getElementById('editorTitle').textContent = name;
  document.getElementById('editorLogo').src = FRONTEND_URL + '/logos/' + slug + '.png';
  document.getElementById('editorOverlay').classList.add('open');
  if (quill) { quill.setText('Loading...'); quill.disable(); }

  // Reset tabs
  document.querySelectorAll('.section-tab').forEach(t => {
    t.classList.remove('active', 'has-override');
    if (t.dataset.section === 'overview') t.classList.add('active');
  });

  // Load original content + overrides in parallel
  const [allContent, overridesRes] = await Promise.all([
    loadBrokerContent(),
    authFetch('/api/admin/reviews/' + slug + '/content?lang=' + CURRENT_LANG).then(r => r.json()).catch(() => ({ overrides: [] })),
  ]);

  if (allContent[slug] && allContent[slug].content) {
    originalContent = allContent[slug].content;
  }

  for (const o of (overridesRes.overrides || [])) {
    overridesCache[o.section] = { content: o.content, edited_by: o.edited_by, updated_at: o.updated_at, status: o.status };
    const tab = document.querySelector('.section-tab[data-section="' + o.section + '"]');
    if (tab) tab.classList.add('has-override');
  }

  if (quill) quill.enable();
  loadSection('overview');
}

function closeEditor() {
  document.getElementById('editorOverlay').classList.remove('open');
  currentSlug = null;
}

function switchSection(section, btn) {
  currentSection = section;
  document.querySelectorAll('.section-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  loadSection(section);
}

function loadSection(section) {
  const status = document.getElementById('editorStatus');
  const updated = document.getElementById('editorUpdated');
  const btnRevert = document.getElementById('btnRevert');

  const override = overridesCache[section];
  const originalHtml = contentToHtml(originalContent[section]);

  if (override) {
    // Override is already HTML — load directly
    if (quill) quill.root.innerHTML = override.content;
    status.textContent = 'Modified';
    status.className = 'editor-status modified';
    updated.textContent = 'Edited: ' + (override.updated_at || '') + ' by ' + (override.edited_by || 'admin');
    btnRevert.disabled = false;
  } else {
    // Original from MD — convert to HTML
    if (quill) quill.root.innerHTML = originalHtml || '<p><br></p>';
    status.textContent = 'Original';
    status.className = 'editor-status original';
    updated.textContent = originalHtml ? 'Content from source MD file' : 'No content for this section';
    btnRevert.disabled = true;
  }
}

async function saveSection() {
  const content = getEditorHtml();
  if (!content) { showToast('Content cannot be empty', true); return; }

  const btn = document.getElementById('btnSave');
  btn.disabled = true;
  btn.innerHTML = 'Saving...';

  try {
    const res = await authFetch('/api/admin/reviews/' + currentSlug + '/content?lang=' + CURRENT_LANG, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: currentSection, content, edited_by: 'admin' }),
    });

    if (res.ok) {
      overridesCache[currentSection] = { content, edited_by: 'admin', updated_at: new Date().toISOString().slice(0,19).replace('T',' ') };
      const tab = document.querySelector('.section-tab[data-section="' + currentSection + '"]');
      if (tab) tab.classList.add('has-override');
      loadSection(currentSection);
      showToast('Saved: ' + currentSection);
    } else {
      const err = await res.json();
      showToast('Error: ' + (err.error || 'Unknown'), true);
    }
  } catch (e) { showToast('Network error', true); }

  btn.disabled = false;
  btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes';
}

async function revertSection() {
  if (!confirm('Revert to original content from MD file?')) return;

  try {
    const res = await authFetch('/api/admin/reviews/' + currentSlug + '/content/' + currentSection + '?lang=' + CURRENT_LANG, {
      method: 'DELETE',
    });

    if (res.ok) {
      delete overridesCache[currentSection];
      const tab = document.querySelector('.section-tab[data-section="' + currentSection + '"]');
      if (tab) tab.classList.remove('has-override');
      loadSection(currentSection);
      showToast('Reverted: ' + currentSection);
    } else { showToast('Error reverting', true); }
  } catch (e) { showToast('Network error', true); }
}

// Close on Escape / overlay click
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEditor(); });
document.getElementById('editorOverlay').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeEditor(); });

// Guide copy
function copyGuide(mode) {
  const en = document.getElementById('guideEN').value;
  const ru = document.getElementById('guideRU').value;
  let text = '';
  if (mode === 'en') text = en;
  else if (mode === 'ru') text = ru;
  else text = en + '\\n\\n---\\n\\n' + ru;
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard'));
  document.getElementById('guidePreview').textContent = text;
}
// Show EN by default
document.addEventListener('DOMContentLoaded', () => {
  const en = document.getElementById('guideEN');
  if (en) document.getElementById('guidePreview').textContent = en.value;
});

function showToast(msg, isError) {
  const t = document.createElement('div');
  t.className = 'toast' + (isError ? ' error' : '');
  t.innerHTML = (isError ? '\\u2717' : '\\u2713') + ' ' + msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
