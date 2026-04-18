/**
 * Admin-side review panel for content_submissions (10th admin tab).
 *
 * Two endpoint families (SPEC §6.2):
 *   - review-decision (PATCH /:id/status): accepted/rejected/needs_changes only.
 *   - side-effect   (POST  /:id/import-to-{review,ranking,card},
 *                    POST  /:id/publish, POST /:id/revert): atomic batch.
 *
 * The side-effect endpoints themselves are implemented in Sprint 7
 * (admin-submissions-processing.js). This module owns dashboard, list,
 * detail, status PATCH, and bulk review-decision actions.
 */
import { corsHeaders } from '../utils/cors.js';
import { checkAuth, extractKey } from '../utils/auth.js';
import { adminHeaderCSS, adminHeaderHTML, adminFooterHTML, adminHeaderScript } from '../utils/adminLayout.js';

function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function fmt(d) { return d ? String(d).replace('T', ' ').slice(0, 19) : '—'; }
function jsonHeaders(request) { return { ...corsHeaders(request), 'Content-Type': 'application/json' }; }
function err(headers, status, error) { return Response.json({ error }, { status, headers }); }
function nowSql() { return new Date().toISOString().slice(0, 19).replace('T', ' '); }

// ─── JSON: list submissions with filters ───────────────────────────────────
export async function handleAdminSubmissionsList(request, env) {
  const headers = jsonHeaders(request);
  if (!checkAuth(request, env)) return err(headers, 401, 'Unauthorized');

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const type = url.searchParams.get('type');
  const authorId = url.searchParams.get('author_id');
  const lang = url.searchParams.get('lang');
  // Clamp limit to [1, 500]. SQLite treats negative LIMIT as "no limit",
  // so guard against it even though only admins reach this endpoint.
  const rawLimit = parseInt(url.searchParams.get('limit') || '500', 10);
  const limit = Math.max(1, Math.min(Number.isFinite(rawLimit) ? rawLimit : 500, 500));

  const where = [];
  const binds = [];
  if (status) { where.push('cs.status = ?'); binds.push(status); }
  if (type) { where.push('cs.target_type = ?'); binds.push(type); }
  if (authorId) { where.push('cs.author_id = ?'); binds.push(parseInt(authorId, 10)); }
  if (lang) { where.push('cs.lang = ?'); binds.push(lang); }

  const rows = await env.DB.prepare(
    `SELECT cs.id, cs.author_id, cs.target_type, cs.target_slug, cs.target_section,
            cs.target_ranking_broker, cs.lang, cs.title, cs.word_count, cs.status,
            cs.admin_notes, cs.created_at, cs.updated_at, cs.submitted_at,
            cs.accepted_at, cs.processed_at, cs.published_at,
            et.name AS author_name, et.email AS author_email
     FROM content_submissions cs
     LEFT JOIN expert_tokens et ON et.id = cs.author_id
     ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
     ORDER BY cs.updated_at DESC
     LIMIT ?`
  ).bind(...binds, limit).all();

  return Response.json(rows.results || [], { headers });
}

// ─── JSON: single submission + events + imports ────────────────────────────
export async function handleAdminSubmissionGet(request, env, id) {
  const headers = jsonHeaders(request);
  if (!checkAuth(request, env)) return err(headers, 401, 'Unauthorized');

  const submissionId = parseInt(id, 10);
  if (!Number.isFinite(submissionId)) return err(headers, 400, 'Invalid id');

  const row = await env.DB.prepare(
    `SELECT cs.*, et.name AS author_name, et.email AS author_email, et.role AS author_role
     FROM content_submissions cs
     LEFT JOIN expert_tokens et ON et.id = cs.author_id
     WHERE cs.id = ?`
  ).bind(submissionId).first();
  if (!row) return err(headers, 404, 'Submission not found');

  const events = await env.DB.prepare(
    `SELECT id, actor_type, actor_id, event, notes, created_at
     FROM submission_events WHERE submission_id = ? ORDER BY created_at ASC`
  ).bind(submissionId).all();

  const imports = await env.DB.prepare(
    `SELECT id, destination_type, destination_ref, imported_at, imported_by
     FROM submission_imports WHERE submission_id = ? ORDER BY imported_at ASC`
  ).bind(submissionId).all();

  return Response.json({
    ...row,
    events: events.results || [],
    imports: imports.results || [],
  }, { headers });
}

// ─── PATCH status: review-decision ONLY (accepted/rejected/needs_changes) ──
// Body: { decision: 'accept'|'reject'|'request_changes', admin_notes? }
export async function handleAdminSubmissionStatus(request, env, id) {
  const headers = jsonHeaders(request);
  if (!checkAuth(request, env)) return err(headers, 401, 'Unauthorized');

  const submissionId = parseInt(id, 10);
  if (!Number.isFinite(submissionId)) return err(headers, 400, 'Invalid id');

  let body;
  try { body = await request.json(); } catch { return err(headers, 400, 'Invalid JSON'); }
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return err(headers, 400, 'Body must be a JSON object');
  }

  const { decision, admin_notes } = body;
  const decisionMap = {
    accept:          { status: 'accepted',      tsCol: 'accepted_at', event: 'accepted' },
    reject:          { status: 'rejected',      tsCol: 'rejected_at', event: 'rejected' },
    request_changes: { status: 'needs_changes', tsCol: null,          event: 'needs_changes' },
  };
  const spec = decisionMap[decision];
  if (!spec) return err(headers, 400, `decision must be one of: ${Object.keys(decisionMap).join(', ')}`);
  if ((decision === 'reject' || decision === 'request_changes')
      && (!admin_notes || typeof admin_notes !== 'string' || !admin_notes.trim())) {
    return err(headers, 400, `admin_notes required for '${decision}'`);
  }
  if (admin_notes && admin_notes.length > 4096) {
    return err(headers, 400, 'admin_notes too long (≤4096)');
  }

  const now = nowSql();
  const sqlSets = [];
  const binds = [];
  if (admin_notes) { sqlSets.push('admin_notes = ?'); binds.push(admin_notes); }
  if (spec.tsCol)  { sqlSets.push(`${spec.tsCol} = ?`); binds.push(now); }
  sqlSets.push('status = ?'); binds.push(spec.status);
  sqlSets.push('updated_at = ?'); binds.push(now);
  binds.push(submissionId);

  const result = await env.DB.prepare(
    `UPDATE content_submissions SET ${sqlSets.join(', ')}
     WHERE id = ? AND status = 'submitted'`
  ).bind(...binds).run();

  if ((result.meta?.changes ?? 0) === 0) {
    // CAS miss: either not found or already past 'submitted'.
    const existing = await env.DB.prepare(
      `SELECT status FROM content_submissions WHERE id = ?`
    ).bind(submissionId).first();
    if (!existing) return err(headers, 404, 'Submission not found');
    return err(headers, 409, `cannot ${decision} in status '${existing.status}' (must be 'submitted')`);
  }

  await env.DB.prepare(
    `INSERT INTO submission_events (submission_id, actor_type, actor_id, event, notes)
     VALUES (?, 'admin', NULL, ?, ?)`
  ).bind(submissionId, spec.event, admin_notes || null).run();

  return Response.json({ ok: true, id: submissionId, status: spec.status }, { headers });
}

// ─── CSV export (with filters) ─────────────────────────────────────────────
export async function handleAdminSubmissionsExport(request, env) {
  const corsH = corsHeaders(request);
  if (!checkAuth(request, env)) {
    return new Response('Unauthorized', { status: 401, headers: { 'Content-Type': 'text/plain', ...corsH } });
  }
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const from = url.searchParams.get('from'); // YYYY-MM-DD
  const to = url.searchParams.get('to');     // YYYY-MM-DD

  // Validate date params — reject malformed values with 400 rather than crash
  // on Date arithmetic / produce meaningless string comparisons.
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  function parseYmd(s) {
    if (!DATE_RE.test(s)) return null;
    const d = new Date(s + 'T00:00:00Z');
    if (Number.isNaN(d.getTime())) return null;
    // Round-trip check rejects values like 2026-13-40 that Date silently rolls over.
    if (d.toISOString().slice(0, 10) !== s) return null;
    return d;
  }
  if (from && !parseYmd(from)) {
    return new Response('from must be YYYY-MM-DD', { status: 400, headers: { 'Content-Type': 'text/plain', ...corsH } });
  }
  const toDate = to ? parseYmd(to) : null;
  if (to && !toDate) {
    return new Response('to must be YYYY-MM-DD', { status: 400, headers: { 'Content-Type': 'text/plain', ...corsH } });
  }

  const where = [];
  const binds = [];
  if (status) { where.push('cs.status = ?'); binds.push(status); }
  if (from) { where.push('cs.created_at >= ?'); binds.push(from + ' 00:00:00'); }
  if (toDate) {
    // Include the entire end-date day by advancing one calendar day and using strict <.
    const nextDay = new Date(toDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    const nextStr = nextDay.toISOString().slice(0, 10) + ' 00:00:00';
    where.push('cs.created_at < ?'); binds.push(nextStr);
  }

  const rows = await env.DB.prepare(
    `SELECT cs.id, et.name AS author_name, et.email AS author_email,
            cs.target_type, cs.target_slug, cs.target_section, cs.target_ranking_broker,
            cs.lang, cs.title, cs.word_count, cs.status,
            cs.created_at, cs.submitted_at, cs.accepted_at, cs.processed_at, cs.published_at
     FROM content_submissions cs
     LEFT JOIN expert_tokens et ON et.id = cs.author_id
     ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
     ORDER BY cs.created_at DESC`
  ).bind(...binds).all();

  const header = ['id','author_name','author_email','target_type','target_slug',
    'target_section','target_ranking_broker','lang','title','word_count','status',
    'created_at','submitted_at','accepted_at','processed_at','published_at'];
  const csvEscape = (v) => {
    if (v == null) return '';
    let s = String(v);
    // Prevent spreadsheet formula injection: prefix any cell starting with
    // =, +, -, @, tab, or CR with a single quote so Excel/Sheets treat it
    // as text. Applies to user-controlled fields (title, author_name, ...).
    if (s.length > 0 && /^[=+\-@\t\r]/.test(s)) s = "'" + s;
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const lines = [header.join(',')];
  for (const r of rows.results || []) {
    lines.push(header.map(k => csvEscape(r[k])).join(','));
  }
  const csv = lines.join('\n');

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="submissions.csv"',
      ...corsH,
    },
  });
}

// ─── HTML dashboard ────────────────────────────────────────────────────────
export async function handleAdminSubmissionsDashboard(request, env) {
  if (!checkAuth(request, env)) {
    return new Response('Unauthorized. Add ?key=YOUR_API_KEY', {
      status: 401, headers: { 'Content-Type': 'text/plain' },
    });
  }
  const encodedKey = encodeURIComponent(extractKey(request));

  // KPIs
  const [pending, weekCount, total, avgTurnaround] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS c FROM content_submissions WHERE status = 'submitted'").first(),
    env.DB.prepare("SELECT COUNT(*) AS c FROM content_submissions WHERE created_at >= datetime('now','-7 days')").first(),
    env.DB.prepare("SELECT COUNT(*) AS c FROM content_submissions").first(),
    env.DB.prepare(`SELECT AVG((julianday(accepted_at) - julianday(submitted_at)) * 24) AS hours
                    FROM content_submissions
                    WHERE submitted_at IS NOT NULL AND accepted_at IS NOT NULL`).first(),
  ]);

  const shellCSS = adminHeaderCSS();
  const shellHeader = adminHeaderHTML('submissions', encodedKey);
  const shellFooter = adminFooterHTML();
  const shellScript = adminHeaderScript();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Submissions — Rated.Admin</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0c10; color: #f0f0f0; }
  ${shellCSS}
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
  .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; align-items: center; }
  .filters select, .filters input {
    background: rgba(255,255,255,0.04); color: var(--text-primary);
    border: 1px solid var(--border); padding: 7px 12px; border-radius: 8px;
    font-size: 13px; outline: none;
  }
  .filters .spacer { flex: 1; }
  .status-pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 6px;
    font-size: 11px; font-weight: 700;
  }
  .status-draft         { background: rgba(148,163,184,0.15); color: #94a3b8; }
  .status-submitted     { background: rgba(96,165,250,0.15); color: #60a5fa; }
  .status-needs_changes { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .status-accepted      { background: rgba(74,222,128,0.15); color: #4ade80; }
  .status-rejected      { background: rgba(248,113,113,0.15); color: #f87171; }
  .status-processed     { background: rgba(52,211,153,0.18); color: #34d399; }
  .status-published     { background: rgba(52,211,153,0.3); color: #10b981; }
  .status-reverted      { background: rgba(167,139,250,0.15); color: #a78bfa; }

  .detail-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; width: min(640px, 96vw);
    background: #0a0c10; border-left: 1px solid var(--border);
    overflow-y: auto; padding: 24px; z-index: 200;
    transform: translateX(100%); transition: transform 0.25s var(--transition);
  }
  .detail-drawer.open { transform: translateX(0); }
  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
    z-index: 199; opacity: 0; pointer-events: none;
    transition: opacity 0.2s;
  }
  .overlay.visible { opacity: 1; pointer-events: auto; }
  .drawer-close { background: transparent; border: none; color: var(--text-muted); font-size: 22px; cursor: pointer; }
  .body-block {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border); border-radius: 10px;
    padding: 14px; margin-top: 12px;
    font-family: 'SF Mono', Menlo, monospace; font-size: 12px;
    white-space: pre-wrap; word-break: break-word;
    max-height: 400px; overflow-y: auto;
    color: var(--text-secondary);
  }
  .timeline { list-style: none; padding: 0; margin: 10px 0 0; }
  .timeline li {
    font-size: 12px; color: var(--text-secondary);
    padding: 6px 0; border-bottom: 1px dashed var(--border);
  }
  textarea.admin-notes {
    width: 100%; min-height: 80px; padding: 10px;
    background: rgba(255,255,255,0.04); color: var(--text-primary);
    border: 1px solid var(--border); border-radius: 8px;
    font-family: inherit; font-size: 13px; outline: none;
    resize: vertical;
  }
  .action-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
</style>
</head>
<body>
<div class="admin-shell">
  ${shellHeader}
  <main class="admin-body">
    <div class="kpis">
      <div class="glass-card c-amber"><div class="card-label">Pending review</div><div class="card-value">${pending.c}</div></div>
      <div class="glass-card c-blue"><div class="card-label">Last 7 days</div><div class="card-value">${weekCount.c}</div></div>
      <div class="glass-card c-green"><div class="card-label">Total submissions</div><div class="card-value">${total.c}</div></div>
      <div class="glass-card c-cyan"><div class="card-label">Avg turnaround (h)</div><div class="card-value">${avgTurnaround.hours != null ? Number(avgTurnaround.hours).toFixed(1) : '—'}</div></div>
    </div>

    <div class="filters">
      <select id="f-status">
        <option value="">All statuses</option>
        <option value="submitted">Submitted</option>
        <option value="needs_changes">Needs changes</option>
        <option value="accepted">Accepted</option>
        <option value="processed">Processed</option>
        <option value="published">Published</option>
        <option value="rejected">Rejected</option>
        <option value="reverted">Reverted</option>
        <option value="draft">Draft</option>
      </select>
      <select id="f-type">
        <option value="">All types</option>
        <option value="review">Review</option>
        <option value="ranking">Ranking</option>
        <option value="card">Card</option>
      </select>
      <input id="f-author" type="text" placeholder="Author name contains…">
      <input id="f-lang" type="text" placeholder="Lang (en/ru/...)" style="width:120px">
      <div class="spacer"></div>
      <a class="btn-secondary" href="/api/admin/submissions/export.csv?key=${encodedKey}" download>Export CSV</a>
    </div>

    <div class="table-wrap" style="background: var(--glass-bg); backdrop-filter: blur(16px); border-radius: 14px; border: 1px solid var(--glass-border); overflow: hidden;">
      <table class="premium-table">
        <thead>
          <tr>
            <th style="width:50px">#</th>
            <th>Title / Target</th>
            <th>Author</th>
            <th>Type</th>
            <th>Status</th>
            <th>Words</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody id="rows"><tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text-muted)">Loading…</td></tr></tbody>
      </table>
    </div>
  </main>
  ${shellFooter}
</div>

<div class="overlay" id="overlay" onclick="closeDrawer()"></div>
<aside class="detail-drawer" id="drawer">
  <div id="drawer-body" style="color:var(--text-secondary)">—</div>
</aside>

<script>
${shellScript}

const KEY = "${encodedKey}";
const API = (p) => p + (p.includes('?') ? '&' : '?') + 'key=' + KEY;

async function loadList() {
  const params = new URLSearchParams();
  const status = document.getElementById('f-status').value;
  const type = document.getElementById('f-type').value;
  const lang = document.getElementById('f-lang').value.trim();
  if (status) params.set('status', status);
  if (type) params.set('type', type);
  if (lang) params.set('lang', lang);

  const tbody = document.getElementById('rows');
  let res, rows;
  try {
    res = await fetch(API('/api/admin/submissions?' + params.toString()));
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:#f87171">Network error: ' + escapeHtml(e.message) + '</td></tr>';
    return;
  }
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:#f87171">Failed to load: ' + escapeHtml(errBody.error || res.statusText) + '</td></tr>';
    return;
  }
  rows = await res.json();
  const nameFilter = document.getElementById('f-author').value.trim().toLowerCase();
  const filtered = nameFilter
    ? rows.filter(r => (r.author_name || '').toLowerCase().includes(nameFilter))
    : rows;
  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text-muted)">No submissions match filters.</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(r => \`
    <tr onclick="openDrawer(\${r.id})" style="cursor:pointer">
      <td style="color:var(--text-muted);font-size:11px">\${r.id}</td>
      <td>
        <div style="font-weight:600;color:var(--text-primary);font-size:13px">\${escapeHtml(r.title || '(untitled)')}</div>
        <div style="color:var(--text-muted);font-size:11px;margin-top:2px">
          \${escapeHtml(r.target_slug)}\${r.target_section ? ' · ' + escapeHtml(r.target_section) : ''}\${r.target_ranking_broker ? ' · ' + escapeHtml(r.target_ranking_broker) : ''} · \${escapeHtml(r.lang)}
        </div>
      </td>
      <td style="font-size:13px">\${escapeHtml(r.author_name || '—')}<br><span style="color:var(--text-muted);font-size:11px">\${escapeHtml(r.author_email || '')}</span></td>
      <td style="font-size:12px">\${escapeHtml(r.target_type)}</td>
      <td><span class="status-pill status-\${r.status}">\${r.status}</span></td>
      <td style="text-align:right;font-variant-numeric:tabular-nums">\${r.word_count ?? '—'}</td>
      <td style="font-size:11px;color:var(--text-muted);font-family:'SF Mono',monospace">\${escapeHtml(r.updated_at || '—')}</td>
    </tr>
  \`).join('');
}

async function openDrawer(id) {
  const body = document.getElementById('drawer-body');
  body.innerHTML = '<div style="color:var(--text-muted)">Loading…</div>';
  document.getElementById('drawer').classList.add('open');
  document.getElementById('overlay').classList.add('visible');
  let res, s;
  try {
    res = await fetch(API('/api/admin/submissions/' + id));
  } catch (e) {
    body.innerHTML = '<div style="color:#f87171">Network error: ' + escapeHtml(e.message) + '</div>';
    return;
  }
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    body.innerHTML = '<div style="color:#f87171">Failed to load: ' + escapeHtml(errBody.error || res.statusText) + '</div>';
    return;
  }
  s = await res.json();
  body.innerHTML = renderDetail(s);
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('visible');
}

function renderDetail(s) {
  const canDecide = s.status === 'submitted';
  const eventsHtml = (s.events || []).map(e => \`
    <li><strong>\${escapeHtml(e.event)}</strong> · \${escapeHtml(e.actor_type)} \${e.notes ? '· <em>' + escapeHtml(e.notes) + '</em>' : ''}
    <span style="float:right;color:var(--text-muted);font-family:'SF Mono',monospace">\${escapeHtml(e.created_at)}</span></li>
  \`).join('');
  const importsHtml = (s.imports || []).map(i => \`
    <li><strong>\${escapeHtml(i.destination_type)}</strong> → <code>\${escapeHtml(i.destination_ref)}</code>
    <span style="float:right;color:var(--text-muted);font-family:'SF Mono',monospace">\${escapeHtml(i.imported_at)}</span></li>
  \`).join('') || '<li style="color:var(--text-muted)">No imports yet.</li>';

  return \`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <button class="drawer-close" onclick="closeDrawer()">✕</button>
      <span class="status-pill status-\${s.status}">\${s.status}</span>
    </div>
    <h2 style="font-size:18px;color:var(--text-primary);margin-bottom:6px">\${escapeHtml(s.title || '(untitled)')}</h2>
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">
      #\${s.id} · \${escapeHtml(s.target_type)} · \${escapeHtml(s.target_slug)}\${s.target_section ? ' · ' + escapeHtml(s.target_section) : ''}\${s.target_ranking_broker ? ' · ' + escapeHtml(s.target_ranking_broker) : ''} · \${escapeHtml(s.lang)} · \${s.word_count ?? 0} words
    </div>
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">
      Author: <strong>\${escapeHtml(s.author_name || '—')}</strong>
      \${s.author_email ? '· ' + escapeHtml(s.author_email) : ''}
    </div>
    \${s.admin_notes ? '<div style="background:rgba(251,191,36,0.1);color:#fbbf24;padding:10px;border-radius:8px;font-size:13px;margin-bottom:12px"><strong>Admin notes:</strong> ' + escapeHtml(s.admin_notes) + '</div>' : ''}

    <div style="font-weight:700;font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px">Body (raw Markdown)</div>
    <div class="body-block">\${escapeHtml(s.body_md)}</div>

    <div style="font-weight:700;font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin:16px 0 6px">Decision</div>
    \${canDecide ? \`
      <textarea class="admin-notes" id="dr-notes" placeholder="admin notes (required for reject / request changes)"></textarea>
      <div class="action-row">
        <button class="btn-primary" onclick="decide(\${s.id},'accept')">Accept</button>
        <button class="btn-secondary" onclick="decide(\${s.id},'request_changes')">Request changes</button>
        <button class="btn-danger" onclick="decide(\${s.id},'reject')">Reject</button>
      </div>
    \` : '<div style="font-size:12px;color:var(--text-muted)">No review decision available in current status.</div>'}

    <div style="font-weight:700;font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin:16px 0 6px">Imports (destinations)</div>
    <ul class="timeline">\${importsHtml}</ul>

    <div style="font-weight:700;font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin:16px 0 6px">Timeline</div>
    <ul class="timeline">\${eventsHtml || '<li style="color:var(--text-muted)">No events.</li>'}</ul>

    <div style="margin-top:16px;font-size:11px;color:var(--text-muted)">
      Sprint 7 will add Import to Review / Ranking / Card, Publish, and Revert side-effect actions.
    </div>
  \`;
}

async function decide(id, decision) {
  const notes = document.getElementById('dr-notes')?.value?.trim() || '';
  if ((decision === 'reject' || decision === 'request_changes') && !notes) {
    alert('Admin notes required for ' + decision);
    return;
  }
  const res = await fetch(API('/api/admin/submissions/' + id + '/status'), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision, admin_notes: notes || undefined }),
  });
  if (!res.ok) {
    const body = await res.json().catch(()=>({error:'error'}));
    alert('Error: ' + (body.error || res.status));
    return;
  }
  closeDrawer();
  loadList();
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Initial + filter wiring
['f-status','f-type','f-author','f-lang'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => loadList());
  document.getElementById(id).addEventListener('change', () => loadList());
});
loadList();
</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
