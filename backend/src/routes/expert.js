/**
 * Expert access — simplified review editor for external experts.
 * Uses expert_tokens instead of admin API key.
 * Experts see only their assigned brokers and can only edit content.
 */
import { corsHeaders } from '../utils/cors.js';
import { adminHeaderCSS, adminFooterHTML } from '../utils/adminLayout.js';

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

async function getExpert(url, env) {
  const token = url.searchParams.get('token');
  if (!token) return null;
  const expert = await env.DB.prepare(
    `SELECT id, token, name, email, lang, broker_slugs, active, expires_at FROM expert_tokens WHERE token = ? AND active = 1`
  ).bind(token).first();
  if (!expert) return null;
  if (expert.expires_at && new Date(expert.expires_at) < new Date()) return null;
  return expert;
}

// ─── GET /api/expert/dashboard — Expert Editor ───
export async function handleExpertDashboard(request, env) {
  const url = new URL(request.url);
  const expert = await getExpert(url, env);
  if (!expert) return new Response('Invalid or expired token', { status: 401 });

  const encodedToken = encodeURIComponent(expert.token);
  const lang = expert.lang;

  // Parse allowed brokers (null = all)
  const allowedSlugs = expert.broker_slugs ? expert.broker_slugs.split(',').map(s => s.trim()) : null;

  // Fetch brokers
  let brokers;
  if (allowedSlugs) {
    const placeholders = allowedSlugs.map(() => '?').join(',');
    brokers = await env.DB.prepare(
      `SELECT b.slug, b.name,
        (SELECT COUNT(*) FROM review_overrides ro WHERE ro.broker_slug = b.slug AND ro.lang = ?) as override_count,
        (SELECT MAX(ro.updated_at) FROM review_overrides ro WHERE ro.broker_slug = b.slug AND ro.lang = ?) as last_edited
      FROM brokers b WHERE b.slug IN (${placeholders}) ORDER BY b.name`
    ).bind(lang, lang, ...allowedSlugs).all();
  } else {
    brokers = await env.DB.prepare(
      `SELECT b.slug, b.name,
        (SELECT COUNT(*) FROM review_overrides ro WHERE ro.broker_slug = b.slug AND ro.lang = ?) as override_count,
        (SELECT MAX(ro.updated_at) FROM review_overrides ro WHERE ro.broker_slug = b.slug AND ro.lang = ?) as last_edited
      FROM brokers b ORDER BY b.name`
    ).bind(lang, lang).all();
  }

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

  const sectionTabsHTML = SECTIONS.map((s, i) => `
    <button class="section-tab ${i === 0 ? 'active' : ''}" data-section="${s.key}" onclick="switchSection('${s.key}', this)">
      ${esc(s.label)}
    </button>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Review Editor — RatedBrokers</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0c10; color: #f0f0f0; }
  ${adminHeaderCSS()}

  .expert-topbar {
    background: linear-gradient(180deg, rgba(16,18,28,0.98) 0%, rgba(10,12,16,0.98) 100%);
    border-bottom: 1px solid var(--border); padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between; height: 56px;
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(20px);
  }
  .expert-topbar::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--blue-dim) 30%, var(--blue) 50%, var(--blue-dim) 70%, transparent 100%);
    opacity: 0.5;
  }
  .expert-logo {
    font-size: 16px; font-weight: 700; color: #fff;
    display: flex; align-items: center; gap: 10px;
  }
  .expert-logo .logo-icon {
    width: 26px; height: 26px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dim) 100%);
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 900; color: #0a0c10;
    box-shadow: 0 0 12px rgba(96,165,250,0.3);
  }
  .expert-user { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); }
  .expert-user .user-badge {
    background: var(--blue-glow); color: var(--blue); padding: 4px 12px;
    border-radius: 6px; font-weight: 700; font-size: 11px;
  }

  .search-input { padding: 7px 14px; border-radius: 8px; border: 1px solid var(--border); background: rgba(255,255,255,0.04); color: var(--text-primary); font-size: 13px; width: 280px; outline: none; transition: border-color 0.15s; margin-bottom: 14px; }
  .search-input:focus { border-color: var(--blue); }
  .search-input::placeholder { color: var(--text-muted); }

  .broker-row { cursor: pointer; }
  .broker-row:hover td { background: rgba(96,165,250,0.04) !important; }

  .editor-overlay {
    display: none; position: fixed; inset: 0; z-index: 500;
    background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
  }
  .editor-overlay.open { display: flex; align-items: flex-start; justify-content: center; padding: 40px 20px; overflow-y: auto; }

  .editor-panel {
    background: var(--bg-card-solid); border: 1px solid var(--border);
    border-radius: 16px; width: 100%; max-width: 960px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .editor-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid var(--border);
  }
  .editor-header h2 { font-size: 16px; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 10px; }
  .editor-header .broker-logo { width: 32px; height: 32px; border-radius: 8px; background: #1e2130; }

  .section-tabs {
    display: flex; gap: 2px; padding: 12px 24px; border-bottom: 1px solid var(--border);
    overflow-x: auto; scrollbar-width: none;
  }
  .section-tabs::-webkit-scrollbar { display: none; }
  .section-tab {
    padding: 6px 14px; font-size: 12px; font-weight: 600;
    color: var(--text-muted); background: transparent; border: 1px solid transparent;
    border-radius: 7px; cursor: pointer; white-space: nowrap;
    transition: all 0.15s;
  }
  .section-tab:hover { color: var(--text-secondary); background: rgba(255,255,255,0.04); }
  .section-tab.active { color: var(--blue); background: var(--blue-glow); border-color: rgba(96,165,250,0.15); }
  .section-tab.has-override { position: relative; }
  .section-tab.has-override::after {
    content: ''; position: absolute; top: 4px; right: 4px;
    width: 6px; height: 6px; border-radius: 50%; background: var(--blue);
  }

  .editor-body { padding: 20px 24px; }
  .editor-textarea {
    width: 100%; min-height: 300px; padding: 16px;
    background: rgba(255,255,255,0.03); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text-primary); font-size: 14px;
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    line-height: 1.7; resize: vertical; outline: none;
  }
  .editor-textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(96,165,250,0.1); }

  .editor-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; font-size: 11px; color: var(--text-muted); }
  .editor-status { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 6px; }
  .editor-status.original { color: var(--text-muted); background: rgba(255,255,255,0.04); }
  .editor-status.modified { color: var(--blue); background: var(--blue-glow); }

  .editor-actions { display: flex; gap: 8px; padding: 16px 24px; border-top: 1px solid var(--border); justify-content: space-between; }
  .editor-actions .left { display: flex; gap: 8px; }
  .editor-actions .right { display: flex; gap: 8px; }

  @media (max-width: 768px) {
    .search-input { width: 100%; }
    .editor-panel { margin: 10px; }
    .section-tabs { padding: 8px 16px; }
  }
</style>
</head>
<body>
<div class="admin-shell">

  <!-- Expert topbar (simplified, no admin nav) -->
  <div class="expert-topbar">
    <div class="expert-logo">
      <span class="logo-icon">R</span>
      Rated<span style="color:var(--blue)">.</span>Editor
    </div>
    <div class="expert-user">
      <span>${esc(expert.name)}</span>
      <span class="user-badge">${lang.toUpperCase()}</span>
    </div>
  </div>

  <div class="admin-body">
    <div style="margin-bottom:20px">
      <h1 style="font-size:20px;font-weight:800;color:var(--text-primary);margin-bottom:4px">Review Editor</h1>
      <p style="font-size:13px;color:var(--text-muted)">${allowedSlugs ? `${brokers.results.length} assigned brokers` : 'All brokers'} &middot; Language: ${lang.toUpperCase()}</p>
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

    <div class="section-tabs" id="sectionTabs">${sectionTabsHTML}</div>

    <div class="editor-body">
      <textarea class="editor-textarea" id="editorTextarea" placeholder="Loading..."></textarea>
      <div class="editor-meta">
        <span id="editorStatus" class="editor-status original">Original</span>
        <span id="editorUpdated"></span>
      </div>
    </div>

    <div class="editor-actions">
      <div class="left">
        <button class="btn-danger" id="btnRevert" onclick="revertSection()" disabled>Revert to Original</button>
      </div>
      <div class="right">
        <button class="btn-secondary" onclick="closeEditor()">Cancel</button>
        <button class="btn-info" id="btnSave" onclick="saveSection()">Save Changes</button>
      </div>
    </div>
  </div>
</div>

<script>
const TOKEN = '${encodedToken}';
const LANG = '${lang}';
const FRONTEND_URL = '${env.FRONTEND_URL || 'https://ratedbrokers.com'}';

let currentSlug = null;
let currentSection = 'overview';
let overridesCache = {};
let originalContent = {};
let brokerContentData = null;

async function loadBrokerContent() {
  if (brokerContentData) return brokerContentData;
  try {
    const res = await fetch(FRONTEND_URL + '/data/broker-content.json');
    if (res.ok) { brokerContentData = await res.json(); return brokerContentData; }
  } catch (e) { console.error(e); }
  return {};
}

function contentToText(val) {
  if (!val) return '';
  if (Array.isArray(val)) return val.join('\\n\\n');
  return String(val);
}

function filterBrokers() {
  const q = document.getElementById('brokerSearch').value.toLowerCase();
  document.querySelectorAll('#brokerTable tbody tr').forEach(row => {
    row.style.display = ((row.dataset.name || '') + (row.dataset.slug || '')).includes(q) ? '' : 'none';
  });
}

async function openEditor(slug, name) {
  currentSlug = slug;
  currentSection = 'overview';
  overridesCache = {};
  originalContent = {};

  document.getElementById('editorTitle').textContent = name;
  document.getElementById('editorLogo').src = FRONTEND_URL + '/logos/' + slug + '.png';
  document.getElementById('editorOverlay').classList.add('open');
  document.getElementById('editorTextarea').value = 'Loading...';
  document.getElementById('editorTextarea').disabled = true;

  document.querySelectorAll('.section-tab').forEach(t => {
    t.classList.remove('active', 'has-override');
    if (t.dataset.section === 'overview') t.classList.add('active');
  });

  const [allContent, overridesRes] = await Promise.all([
    loadBrokerContent(),
    fetch('/api/expert/reviews/' + slug + '?token=' + TOKEN).then(r => r.json()).catch(() => ({ overrides: [] })),
  ]);

  if (allContent[slug] && allContent[slug].content) originalContent = allContent[slug].content;

  for (const o of (overridesRes.overrides || [])) {
    overridesCache[o.section] = { content: o.content, edited_by: o.edited_by, updated_at: o.updated_at };
    const tab = document.querySelector('.section-tab[data-section="' + o.section + '"]');
    if (tab) tab.classList.add('has-override');
  }

  document.getElementById('editorTextarea').disabled = false;
  loadSection('overview');
}

function closeEditor() { document.getElementById('editorOverlay').classList.remove('open'); currentSlug = null; }

function switchSection(section, btn) {
  currentSection = section;
  document.querySelectorAll('.section-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  loadSection(section);
}

function loadSection(section) {
  const textarea = document.getElementById('editorTextarea');
  const status = document.getElementById('editorStatus');
  const updated = document.getElementById('editorUpdated');
  const btnRevert = document.getElementById('btnRevert');
  const override = overridesCache[section];
  const original = contentToText(originalContent[section]);

  if (override) {
    textarea.value = override.content;
    status.textContent = 'Modified'; status.className = 'editor-status modified';
    updated.textContent = 'Edited: ' + (override.updated_at || '') + ' by ' + (override.edited_by || '');
    btnRevert.disabled = false;
  } else {
    textarea.value = original;
    status.textContent = 'Original'; status.className = 'editor-status original';
    updated.textContent = original ? 'Source content' : 'No content for this section';
    btnRevert.disabled = true;
  }
}

async function saveSection() {
  const content = document.getElementById('editorTextarea').value.trim();
  if (!content) { showToast('Content cannot be empty', true); return; }

  const original = contentToText(originalContent[currentSection]);
  if (content === original && !overridesCache[currentSection]) { showToast('No changes', true); return; }

  const btn = document.getElementById('btnSave');
  btn.disabled = true; btn.textContent = 'Saving...';

  try {
    const res = await fetch('/api/expert/reviews/' + currentSlug + '?token=' + TOKEN, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: currentSection, content }),
    });
    if (res.ok) {
      overridesCache[currentSection] = { content, edited_by: '${esc(expert.name)}', updated_at: new Date().toISOString().slice(0,19).replace('T',' ') };
      const tab = document.querySelector('.section-tab[data-section="' + currentSection + '"]');
      if (tab) tab.classList.add('has-override');
      loadSection(currentSection);
      showToast('Saved: ' + currentSection);
    } else {
      const err = await res.json();
      showToast('Error: ' + (err.error || 'Unknown'), true);
    }
  } catch (e) { showToast('Network error', true); }

  btn.disabled = false; btn.textContent = 'Save Changes';
}

async function revertSection() {
  if (!confirm('Revert to original content?')) return;
  try {
    const res = await fetch('/api/expert/reviews/' + currentSlug + '/' + currentSection + '?token=' + TOKEN, { method: 'DELETE' });
    if (res.ok) {
      delete overridesCache[currentSection];
      const tab = document.querySelector('.section-tab[data-section="' + currentSection + '"]');
      if (tab) tab.classList.remove('has-override');
      loadSection(currentSection);
      showToast('Reverted');
    } else { showToast('Error', true); }
  } catch (e) { showToast('Network error', true); }
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEditor(); });
document.getElementById('editorOverlay').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeEditor(); });

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

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

// ─── GET /api/expert/reviews/:slug — overrides for broker (expert auth) ───
export async function handleExpertReviewContent(request, env, slug) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  const expert = await getExpert(url, env);
  if (!expert) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  // Check broker access
  if (expert.broker_slugs) {
    const allowed = expert.broker_slugs.split(',').map(s => s.trim());
    if (!allowed.includes(slug)) return Response.json({ error: 'Access denied for this broker' }, { status: 403, headers });
  }

  const overrides = await env.DB.prepare(
    `SELECT section, content, edited_by, updated_at FROM review_overrides WHERE broker_slug = ? AND lang = ? ORDER BY section`
  ).bind(slug, expert.lang).all();

  return Response.json({ slug, lang: expert.lang, overrides: overrides.results }, { headers });
}

// ─── PUT /api/expert/reviews/:slug — save override (expert auth) ───
export async function handleExpertReviewUpdate(request, env, slug) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  const expert = await getExpert(url, env);
  if (!expert) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  if (expert.broker_slugs) {
    const allowed = expert.broker_slugs.split(',').map(s => s.trim());
    if (!allowed.includes(slug)) return Response.json({ error: 'Access denied' }, { status: 403, headers });
  }

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers });
  }

  const { section, content } = body;
  if (!section || !content) return Response.json({ error: 'section and content required' }, { status: 400, headers });

  const validSections = SECTIONS.map(s => s.key);
  if (!validSections.includes(section)) return Response.json({ error: `Invalid section: ${section}` }, { status: 400, headers });

  const existing = await env.DB.prepare(
    `SELECT content FROM review_overrides WHERE broker_slug = ? AND section = ? AND lang = ?`
  ).bind(slug, section, expert.lang).first();

  const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await env.DB.prepare(`
    INSERT INTO review_overrides (broker_slug, section, lang, content, edited_by, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(broker_slug, section, lang) DO UPDATE SET
      content = excluded.content, edited_by = excluded.edited_by, updated_at = excluded.updated_at
  `).bind(slug, section, expert.lang, content, expert.name, nowStr).run();

  await env.DB.prepare(`
    INSERT INTO review_edit_log (broker_slug, section, action, edited_by, old_content, new_content)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(slug, section, existing ? 'update' : 'create', expert.name, existing?.content || null, content).run();

  return Response.json({ ok: true, slug, section }, { headers });
}

// ─── DELETE /api/expert/reviews/:slug/:section — revert (expert auth) ───
export async function handleExpertReviewDelete(request, env, slug, section) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  const expert = await getExpert(url, env);
  if (!expert) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  if (expert.broker_slugs) {
    const allowed = expert.broker_slugs.split(',').map(s => s.trim());
    if (!allowed.includes(slug)) return Response.json({ error: 'Access denied' }, { status: 403, headers });
  }

  const existing = await env.DB.prepare(
    `SELECT content FROM review_overrides WHERE broker_slug = ? AND section = ? AND lang = ?`
  ).bind(slug, section, expert.lang).first();

  if (existing) {
    await env.DB.prepare(
      `DELETE FROM review_overrides WHERE broker_slug = ? AND section = ? AND lang = ?`
    ).bind(slug, section, expert.lang).run();

    await env.DB.prepare(`
      INSERT INTO review_edit_log (broker_slug, section, action, edited_by, old_content, new_content)
      VALUES (?, ?, 'revert', ?, ?, NULL)
    `).bind(slug, section, expert.name, existing.content).run();
  }

  return Response.json({ ok: true, slug, section }, { headers });
}
