/**
 * Link Health — 6th admin section.
 * Affiliate URL monitoring: status checks, broken link alerts, re-check.
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

// ─── POST /api/admin/linkhealth/recheck/:slug ───
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

// ─── GET /api/admin/linkhealth/dashboard ───
export async function handleLinkHealthDashboard(request, env) {
  const url = new URL(request.url);
  if (!checkKey(url, env)) return new Response('Unauthorized', { status: 401 });

  const encodedKey = encodeURIComponent(url.searchParams.get('key'));

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

  const totalBrokers = allBrokers.results.length;
  const checkedCount = linkChecks.results.length;
  const healthyCount = linkChecks.results.filter(r => r.ok).length;
  const brokenCount = linkChecks.results.filter(r => !r.ok).length;

  // Check history — last 50
  let history = [];
  try {
    const histResult = await env.DB.prepare(
      'SELECT broker_slug, status_code, ok, error, checked_at FROM link_checks ORDER BY checked_at DESC LIMIT 50'
    ).all();
    history = histResult.results;
  } catch (e) {}

  // Link health rows
  const linkRows = linkChecks.results.map(lc => {
    const badge = lc.ok
      ? '<span class="status-badge" style="color:var(--green);background:var(--green-glow)">OK</span>'
      : '<span class="status-badge" style="color:var(--red);background:var(--red-glow)">BROKEN</span>';
    const truncUrl = lc.affiliate_url && lc.affiliate_url.length > 60 ? lc.affiliate_url.slice(0, 60) + '…' : (lc.affiliate_url || '');
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
    const truncUrl = b.affiliate_url && b.affiliate_url.length > 60 ? b.affiliate_url.slice(0, 60) + '…' : (b.affiliate_url || '');
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

  // History rows
  const historyRows = history.map(h => {
    const badge = h.ok
      ? '<span style="color:var(--green);font-size:11px;font-weight:700">OK</span>'
      : '<span style="color:var(--red);font-size:11px;font-weight:700">FAIL</span>';
    return `<tr>
      <td style="font-size:11px;white-space:nowrap">${fmtDate(h.checked_at)}</td>
      <td style="font-weight:600">${esc(h.broker_slug)}</td>
      <td style="text-align:center">${h.status_code || '—'}</td>
      <td>${badge}</td>
      <td style="font-size:11px;color:var(--text-muted);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(h.error || '')}</td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Link Health — Rated.Admin</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0c10; color: #f0f0f0; }
  ${adminHeaderCSS()}

  .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .status-badge { display: inline-flex; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
  .alert-bar { padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .alert-bar.warn { background: var(--red-glow); border: 1px solid rgba(248,113,113,0.2); color: var(--red); }
  .alert-bar.ok { background: var(--green-glow); border: 1px solid rgba(74,222,128,0.2); color: var(--green); }
  .alert-bar.info { background: var(--blue-glow); border: 1px solid rgba(96,165,250,0.2); color: var(--blue); }

  .history-section { margin-top: 36px; }

  @media (max-width: 768px) {
    .summary-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .summary-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<div class="admin-shell">
  ${adminHeaderHTML('linkhealth', encodedKey)}
  <div class="admin-body">

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="glass-card c-purple">
        <div class="card-label">Total Brokers</div>
        <div class="card-value">${totalBrokers}</div>
      </div>
      <div class="glass-card c-green">
        <div class="card-label">Healthy</div>
        <div class="card-value">${healthyCount}</div>
      </div>
      <div class="glass-card c-red" style="--card-accent:var(--red)">
        <div class="card-label">Broken</div>
        <div class="card-value" style="color:${brokenCount > 0 ? 'var(--red)' : 'var(--text-muted)'}">${brokenCount}</div>
      </div>
      <div class="glass-card c-amber">
        <div class="card-label">Unchecked</div>
        <div class="card-value">${unchecked.length}</div>
      </div>
    </div>

    ${brokenCount > 0
      ? `<div class="alert-bar warn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          ${brokenCount} broken affiliate link${brokenCount > 1 ? 's' : ''} — every broken link is lost revenue
        </div>`
      : checkedCount > 0
        ? `<div class="alert-bar ok">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            All ${checkedCount} checked links are healthy
          </div>`
        : `<div class="alert-bar info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            No links checked yet — click "Check All Links" or wait for daily cron (06:00 UTC)
          </div>`
    }

    <!-- Actions -->
    <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap">
      <button class="btn-primary" onclick="recheckAll()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        Check All Links
      </button>
      ${brokenCount > 0 ? `<button class="btn-danger" onclick="recheckBroken()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Re-check Broken Only
      </button>` : ''}
    </div>

    <!-- Links Table -->
    <div class="section-hdr sh-green">
      <div class="sh-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      </div>
      <h2>Affiliate Links (${totalBrokers})</h2>
    </div>

    <div style="overflow-x:auto">
      <table class="premium-table" id="linkTable">
        <thead><tr>
          <th>Broker</th><th>URL</th><th style="text-align:center">Code</th><th>Status</th><th>Last Check</th><th></th>
        </tr></thead>
        <tbody>${linkRows}${uncheckedRows}</tbody>
      </table>
    </div>

    <!-- Check History -->
    ${history.length > 0 ? `
    <div class="history-section">
      <div class="section-hdr sh-blue">
        <div class="sh-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h2>Recent Check History</h2>
      </div>
      <div style="overflow-x:auto">
        <table class="premium-table">
          <thead><tr><th>Time</th><th>Broker</th><th style="text-align:center">Code</th><th>Result</th><th>Error</th></tr></thead>
          <tbody>${historyRows}</tbody>
        </table>
      </div>
    </div>` : ''}

  </div>
  ${adminFooterHTML()}
</div>

<script>
const API_KEY = '${encodedKey}';

${adminHeaderScript()}

// Re-check single link
async function recheckLink(slug, btn) {
  btn.disabled = true;
  btn.innerHTML = '<span style="font-size:11px">...</span>';
  try {
    const res = await fetch('/api/admin/linkhealth/recheck/' + slug + '?key=' + API_KEY, { method: 'POST' });
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
  if (!confirm('Check all ${totalBrokers} affiliate links? This may take a minute.')) return;
  await batchCheck('#linkTable tbody tr');
}

// Re-check broken only
async function recheckBroken() {
  await batchCheck('#linkTable tbody tr', true);
}

async function batchCheck(selector, brokenOnly) {
  const rows = document.querySelectorAll(selector);
  let checked = 0;
  for (const row of rows) {
    if (brokenOnly) {
      const badge = row.querySelector('.status-badge');
      if (badge && !badge.textContent.includes('BROKEN')) continue;
    }
    const slug = row.querySelector('td')?.textContent?.trim();
    if (!slug) continue;
    const btn = row.querySelector('button');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span style="font-size:11px">...</span>'; }
    try {
      await fetch('/api/admin/linkhealth/recheck/' + slug + '?key=' + API_KEY, { method: 'POST' });
      checked++;
    } catch (e) {}
  }
  showToast('Checked ' + checked + ' links');
  setTimeout(() => location.reload(), 1500);
}

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
