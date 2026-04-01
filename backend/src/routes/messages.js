/**
 * Messages — 5th admin section.
 * Contact form submissions viewer.
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

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()} ${String(dt.getUTCHours()).padStart(2,'0')}:${String(dt.getUTCMinutes()).padStart(2,'0')}`;
}

// ─── DELETE /api/admin/messages/:id ───
export async function handleMessageDelete(request, env, id) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkKey(url, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  await env.DB.prepare('DELETE FROM contacts WHERE id = ?').bind(parseInt(id)).run();
  return Response.json({ ok: true }, { headers });
}

// ─── GET /api/admin/messages/dashboard ───
export async function handleMessagesDashboard(request, env) {
  const url = new URL(request.url);
  if (!checkKey(url, env)) return new Response('Unauthorized', { status: 401 });

  const encodedKey = encodeURIComponent(url.searchParams.get('key'));

  // Messages stats
  const [totalMsg, weekMsg, todayMsg] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) as c FROM contacts").first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM contacts WHERE created_at >= datetime('now', '-7 days')").first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM contacts WHERE created_at >= date('now')").first(),
  ]);

  // All messages (newest first)
  const messages = await env.DB.prepare(
    'SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC'
  ).all();

  // Messages rows
  const msgRows = messages.results.map((m, i) => `
    <tr class="msg-row">
      <td style="color:var(--text-muted);font-size:11px">${messages.results.length - i}</td>
      <td style="white-space:nowrap">${fmtDate(m.created_at)}</td>
      <td style="font-weight:600;color:var(--text-primary)">${esc(m.name)}</td>
      <td><a href="mailto:${esc(m.email)}" style="color:var(--blue);text-decoration:none">${esc(m.email)}</a></td>
      <td class="msg-cell" title="${esc(m.message)}">
        <span class="msg-preview">${esc(m.message.length > 80 ? m.message.slice(0, 80) + '…' : m.message)}</span>
        <span class="msg-full" style="display:none">${esc(m.message)}</span>
      </td>
      <td>
        <button class="btn-ghost" style="color:var(--red);padding:4px 8px" onclick="deleteMsg(${m.id},this)" title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Messages — Rated.Admin</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0c10; color: #f0f0f0; }
  ${adminHeaderCSS()}

  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }

  .msg-cell { max-width: 300px; cursor: pointer; }
  .msg-cell:hover .msg-preview { text-decoration: underline; }
  .msg-full { white-space: pre-wrap; word-break: break-word; }

  .search-input { padding: 7px 14px; border-radius: 8px; border: 1px solid var(--border); background: rgba(255,255,255,0.04); color: var(--text-primary); font-size: 13px; width: 260px; outline: none; transition: border-color 0.15s; margin-bottom: 14px; }
  .search-input:focus { border-color: var(--green); }
  .search-input::placeholder { color: var(--text-muted); }

  @media (max-width: 768px) {
    .summary-grid { grid-template-columns: 1fr; }
    .search-input { width: 100%; }
  }
</style>
</head>
<body>
<div class="admin-shell">
  ${adminHeaderHTML('messages', encodedKey)}
  <div class="admin-body">

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="glass-card c-purple">
        <div class="card-label">Total Messages</div>
        <div class="card-value">${totalMsg.c}</div>
      </div>
      <div class="glass-card c-blue">
        <div class="card-label">This Week</div>
        <div class="card-value">${weekMsg.c}</div>
      </div>
      <div class="glass-card c-green">
        <div class="card-label">Today</div>
        <div class="card-value">${todayMsg.c}</div>
      </div>
    </div>

    <!-- Messages Table -->
    <div class="section-hdr sh-purple">
      <div class="sh-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      </div>
      <h2>Contact Messages</h2>
    </div>

    <input type="text" class="search-input" id="msgSearch" placeholder="Search by name, email, or message..." oninput="filterMessages()">

    ${messages.results.length === 0
      ? '<div style="padding:40px;text-align:center;color:var(--text-muted);font-size:14px">No messages yet</div>'
      : `<div style="overflow-x:auto">
        <table class="premium-table" id="msgTable">
          <thead><tr>
            <th>#</th><th>Date</th><th>Name</th><th>Email</th><th>Message</th><th></th>
          </tr></thead>
          <tbody>${msgRows}</tbody>
        </table>
      </div>`
    }

  </div>
  ${adminFooterHTML()}
</div>

<script>
const API_KEY = '${encodedKey}';

${adminHeaderScript()}

// Toggle message expand
document.querySelectorAll('.msg-cell').forEach(cell => {
  cell.addEventListener('click', () => {
    const preview = cell.querySelector('.msg-preview');
    const full = cell.querySelector('.msg-full');
    if (full.style.display === 'none') {
      preview.style.display = 'none';
      full.style.display = 'inline';
    } else {
      preview.style.display = 'inline';
      full.style.display = 'none';
    }
  });
});

// Search messages
function filterMessages() {
  const q = document.getElementById('msgSearch').value.toLowerCase();
  document.querySelectorAll('#msgTable tbody tr').forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
}

// Delete message
async function deleteMsg(id, btn) {
  if (!confirm('Delete this message?')) return;
  btn.disabled = true;
  try {
    const res = await fetch('/api/admin/messages/' + id + '?key=' + API_KEY, { method: 'DELETE' });
    if (res.ok) {
      btn.closest('tr').remove();
      showToast('Message deleted');
    } else {
      showToast('Error deleting message', true);
    }
  } catch (e) {
    showToast('Network error', true);
  }
}

function showToast(msg, isError) {
  const t = document.createElement('div');
  t.className = 'toast' + (isError ? ' error' : '');
  t.innerHTML = (isError ? '\u2717' : '\u2713') + ' ' + msg;
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
