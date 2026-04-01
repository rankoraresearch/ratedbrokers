/**
 * Messages — 5th admin section.
 * Contact form submissions viewer + Link Health monitoring.
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

// ─── POST /api/admin/messages/recheck/:slug ───
export async function handleLinkRecheck(request, env, slug) {
  const url = new URL(request.url);
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkKey(url, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const broker = await env.DB.prepare('SELECT slug, affiliate_url FROM brokers WHERE slug = ?').bind(slug).first();
  if (!broker) return Response.json({ error: 'Broker not found' }, { status: 404, headers });

  try {
    const res = await fetch(broker.affiliate_url, {
      method: 'HEAD', redirect: 'follow',
      headers: { 'User-Agent': 'RatedBrokers-LinkChecker/1.0' },
    });
    await env.DB.prepare(
      'INSERT INTO link_checks (broker_slug, status_code, ok) VALUES (?, ?, ?)'
    ).bind(broker.slug, res.status, res.ok ? 1 : 0).run();
    return Response.json({ ok: true, status_code: res.status, healthy: res.ok }, { headers });
  } catch (err) {
    await env.DB.prepare(
      'INSERT INTO link_checks (broker_slug, status_code, ok, error) VALUES (?, ?, ?, ?)'
    ).bind(broker.slug, 0, 0, err.message.slice(0, 200)).run();
    return Response.json({ ok: true, status_code: 0, healthy: false, error: err.message }, { headers });
  }
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

  // Link health — latest check per broker
  const linkChecks = await env.DB.prepare(`
    SELECT lc.broker_slug, lc.status_code, lc.ok, lc.error, lc.checked_at, b.affiliate_url
    FROM link_checks lc
    JOIN brokers b ON b.slug = lc.broker_slug
    WHERE lc.checked_at = (
      SELECT MAX(lc2.checked_at) FROM link_checks lc2 WHERE lc2.broker_slug = lc.broker_slug
    )
    ORDER BY lc.ok ASC, lc.broker_slug ASC
  `).all();

  // All brokers for unchecked display
  const allBrokers = await env.DB.prepare('SELECT slug, affiliate_url FROM brokers ORDER BY slug').all();
  const checkedSlugs = new Set(linkChecks.results.map(r => r.broker_slug));
  const unchecked = allBrokers.results.filter(b => !checkedSlugs.has(b.slug));
  const brokenCount = linkChecks.results.filter(r => !r.ok).length;

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

  // Link health rows
  const linkRows = linkChecks.results.map(lc => {
    const color = lc.ok ? 'var(--green)' : 'var(--red)';
    const badge = lc.ok
      ? '<span class="status-badge" style="color:var(--green);background:var(--green-glow)">OK</span>'
      : `<span class="status-badge" style="color:var(--red);background:var(--red-glow)">BROKEN</span>`;
    const truncUrl = lc.affiliate_url && lc.affiliate_url.length > 50 ? lc.affiliate_url.slice(0, 50) + '…' : (lc.affiliate_url || '');
    return `
    <tr>
      <td style="font-weight:600;color:var(--text-primary)">${esc(lc.broker_slug)}</td>
      <td><span title="${esc(lc.affiliate_url)}" style="font-size:11px;color:var(--text-muted);font-family:'SF Mono','Fira Code',monospace">${esc(truncUrl)}</span></td>
      <td style="text-align:center">${lc.status_code || '—'}</td>
      <td>${badge}</td>
      <td style="font-size:11px;white-space:nowrap">${fmtDate(lc.checked_at)}</td>
      <td>
        <button class="btn-ghost" style="padding:4px 8px" onclick="recheckLink('${esc(lc.broker_slug)}',this)" title="Re-check">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        </button>
      </td>
    </tr>`;
  }).join('');

  const uncheckedRows = unchecked.map(b => {
    const truncUrl = b.affiliate_url && b.affiliate_url.length > 50 ? b.affiliate_url.slice(0, 50) + '…' : (b.affiliate_url || '');
    return `
    <tr>
      <td style="font-weight:600;color:var(--text-primary)">${esc(b.slug)}</td>
      <td><span title="${esc(b.affiliate_url)}" style="font-size:11px;color:var(--text-muted);font-family:'SF Mono','Fira Code',monospace">${esc(truncUrl)}</span></td>
      <td style="text-align:center;color:var(--text-muted)">—</td>
      <td><span class="status-badge" style="color:var(--text-muted);background:rgba(255,255,255,0.04)">UNCHECKED</span></td>
      <td style="font-size:11px;color:var(--text-muted)">never</td>
      <td>
        <button class="btn-ghost" style="padding:4px 8px" onclick="recheckLink('${esc(b.slug)}',this)" title="Check now">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        </button>
      </td>
    </tr>`;
  }).join('');

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
  .status-badge { display: inline-flex; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
  .alert-bar { padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .alert-bar.warn { background: var(--red-glow); border: 1px solid rgba(248,113,113,0.2); color: var(--red); }
  .alert-bar.ok { background: var(--green-glow); border: 1px solid rgba(74,222,128,0.2); color: var(--green); }

  .msg-cell { max-width: 300px; cursor: pointer; }
  .msg-cell:hover .msg-preview { text-decoration: underline; }
  .msg-full { white-space: pre-wrap; word-break: break-word; }

  .search-input { padding: 7px 14px; border-radius: 8px; border: 1px solid var(--border); background: rgba(255,255,255,0.04); color: var(--text-primary); font-size: 13px; width: 260px; outline: none; transition: border-color 0.15s; margin-bottom: 14px; }
  .search-input:focus { border-color: var(--green); }
  .search-input::placeholder { color: var(--text-muted); }

  .link-section { margin-top: 40px; }

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

    <!-- Link Health -->
    <div class="link-section">
      <div class="section-hdr sh-green">
        <div class="sh-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </div>
        <h2>Affiliate Link Health</h2>
      </div>

      ${brokenCount > 0
        ? `<div class="alert-bar warn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            ${brokenCount} broken affiliate link${brokenCount > 1 ? 's' : ''} detected — revenue at risk
          </div>`
        : linkChecks.results.length > 0
          ? `<div class="alert-bar ok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              All ${linkChecks.results.length} checked links are healthy
            </div>`
          : ''
      }

      <button class="btn-primary" onclick="recheckAll()" style="margin-bottom:14px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        Check All Links
      </button>

      <div style="overflow-x:auto">
        <table class="premium-table" id="linkTable">
          <thead><tr>
            <th>Broker</th><th>URL</th><th style="text-align:center">Code</th><th>Status</th><th>Last Check</th><th></th>
          </tr></thead>
          <tbody>${linkRows}${uncheckedRows}</tbody>
        </table>
      </div>
    </div>

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

// Re-check single link
async function recheckLink(slug, btn) {
  btn.disabled = true;
  btn.innerHTML = '<span style="font-size:11px">...</span>';
  try {
    const res = await fetch('/api/admin/messages/recheck/' + slug + '?key=' + API_KEY, { method: 'POST' });
    const data = await res.json();
    if (data.healthy) {
      showToast(slug + ' — OK (' + data.status_code + ')');
    } else {
      showToast(slug + ' — BROKEN' + (data.error ? ': ' + data.error.slice(0, 60) : ''), true);
    }
    setTimeout(() => location.reload(), 1200);
  } catch (e) {
    showToast('Network error', true);
    btn.disabled = false;
  }
}

// Check all links
async function recheckAll() {
  if (!confirm('Check all affiliate links? This may take a moment.')) return;
  const rows = document.querySelectorAll('#linkTable tbody tr');
  let checked = 0;
  for (const row of rows) {
    const slug = row.querySelector('td')?.textContent?.trim();
    if (!slug) continue;
    const btn = row.querySelector('button');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span style="font-size:11px">...</span>'; }
    try {
      await fetch('/api/admin/messages/recheck/' + slug + '?key=' + API_KEY, { method: 'POST' });
      checked++;
    } catch (e) {}
  }
  showToast('Checked ' + checked + ' links');
  setTimeout(() => location.reload(), 1500);
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
