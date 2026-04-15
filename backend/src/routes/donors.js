/**
 * Donors — outreach target list (refdomains from competitor backlink pulls).
 * Read-only dashboard for now; enrichment pipeline fills contacts later.
 */
import { corsHeaders } from '../utils/cors.js';
import { adminHeaderCSS, adminHeaderHTML, adminFooterHTML, adminHeaderScript } from '../utils/adminLayout.js';
import { checkAuth, extractKey } from '../utils/auth.js';

function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── POST /api/admin/donors/bulk — seed batch INSERT OR REPLACE ───
export async function handleDonorsBulk(request, env) {
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkAuth(request, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const body = await request.json();
  const rows = body.rows || [];
  if (!Array.isArray(rows) || rows.length === 0) return Response.json({ error: 'no rows' }, { status: 400, headers });
  if (rows.length > 2000) return Response.json({ error: 'max 2000 rows per batch' }, { status: 400, headers });

  const stmts = rows.map(r => env.DB.prepare(
    `INSERT OR REPLACE INTO donors (domain, max_dr, overlap, competitors, total_links, total_dofollow, max_traffic, is_root, tier)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    r.domain,
    r.max_dr || 0,
    r.overlap || 1,
    r.competitors || '',
    r.total_links || 0,
    r.total_dofollow || 0,
    r.max_traffic || 0,
    r.is_root ? 1 : 0,
    r.tier || null,
  ));
  await env.DB.batch(stmts);
  return Response.json({ ok: true, inserted: rows.length }, { headers });
}

// ─── GET /api/admin/donors/list — JSON list with filters ───
export async function handleDonorsList(request, env) {
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkAuth(request, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const url = new URL(request.url);
  const tier = url.searchParams.get('tier');
  const status = url.searchParams.get('status');
  const minDr = parseFloat(url.searchParams.get('min_dr') || '0');
  const minOverlap = parseInt(url.searchParams.get('min_overlap') || '0', 10);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '500', 10), 10000);
  const offset = parseInt(url.searchParams.get('offset') || '0', 10);

  const where = ['max_dr >= ?', 'overlap >= ?'];
  const args = [minDr, minOverlap];
  if (tier) { where.push('tier = ?'); args.push(tier); }
  if (status) { where.push('status = ?'); args.push(status); }

  const sql = `SELECT * FROM donors WHERE ${where.join(' AND ')} ORDER BY overlap DESC, max_dr DESC LIMIT ? OFFSET ?`;
  const rs = await env.DB.prepare(sql).bind(...args, limit, offset).all();
  return Response.json({ rows: rs.results, count: rs.results.length }, { headers });
}

// ─── PUT /api/admin/donors/:domain — update contact fields ───
export async function handleDonorUpdate(request, env, domain) {
  const headers = { ...corsHeaders(request), 'Content-Type': 'application/json' };
  if (!checkAuth(request, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const body = await request.json();
  const allowed = ['email','contact_form_url','contact_page_url','status','notes','tier'];
  const sets = [];
  const args = [];
  for (const k of allowed) {
    if (body[k] !== undefined) { sets.push(`${k} = ?`); args.push(body[k]); }
  }
  if (sets.length === 0) return Response.json({ error: 'nothing to update' }, { status: 400, headers });
  sets.push("checked_at = datetime('now')");
  args.push(domain);
  await env.DB.prepare(`UPDATE donors SET ${sets.join(', ')} WHERE domain = ?`).bind(...args).run();
  return Response.json({ ok: true }, { headers });
}

// ─── GET /api/admin/donors/dashboard ───
export async function handleDonorsDashboard(request, env) {
  if (!checkAuth(request, env)) return new Response('Unauthorized', { status: 401 });

  const encodedKey = encodeURIComponent(extractKey(request));

  // Stats
  const [total, priority, highDR, found, pending] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) as c FROM donors").first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM donors WHERE overlap >= 2").first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM donors WHERE max_dr >= 40").first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM donors WHERE status = 'found'").first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM donors WHERE status = 'pending'").first(),
  ]);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
<title>Donors — Rated.Admin</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0c10; color: #f0f0f0; }
  ${adminHeaderCSS()}

  .summary-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 24px; }
  @media (max-width: 900px) { .summary-grid { grid-template-columns: repeat(2, 1fr); } }

  .filters { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 16px; padding: 14px 16px;
    background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 10px; }
  .filters label { font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; }
  .filters select, .filters input {
    padding: 6px 10px; background: rgba(0,0,0,0.4); border: 1px solid var(--border);
    color: var(--text-primary); border-radius: 6px; font-size: 13px; font-family: inherit;
  }
  .filters input[type="number"] { width: 70px; }
  .filters input[type="text"] { width: 160px; }

  .table-wrap { background: var(--bg-card-solid); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .table-scroll { max-height: 70vh; overflow-y: auto; }
  .premium-table thead { position: sticky; top: 0; background: #161823; z-index: 1; }
  .dr-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 700;
    font-variant-numeric: tabular-nums; min-width: 32px; text-align: center; }
  .dr-90 { background: rgba(74,222,128,0.18); color: var(--green); }
  .dr-70 { background: rgba(34,211,238,0.15); color: var(--cyan); }
  .dr-50 { background: rgba(251,191,36,0.15); color: var(--amber); }
  .dr-30 { background: rgba(167,139,250,0.15); color: var(--purple); }
  .dr-0  { background: rgba(248,113,113,0.12); color: var(--red); }
  .overlap-chip { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 700;
    background: rgba(245,158,11,0.15); color: var(--amber); }
  .status-pill { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
  .status-pending { background: rgba(139,143,163,0.15); color: var(--text-secondary); }
  .status-found { background: rgba(74,222,128,0.18); color: var(--green); }
  .status-no_contact, .status-blocked, .status-dead { background: rgba(248,113,113,0.12); color: var(--red); }
  .competitors-cell { font-size: 11px; color: var(--text-secondary); max-width: 260px; white-space: normal; line-height: 1.4; }
  .domain-cell a { color: var(--text-primary); text-decoration: none; font-weight: 500; }
  .domain-cell a:hover { color: var(--blue); text-decoration: underline; }

  .loading { text-align: center; padding: 60px; color: var(--text-muted); }
</style>
</head>
<body>
<div class="admin-shell">
  ${adminHeaderHTML('donors', encodedKey)}

  <main class="admin-main">
    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:20px">
      <div>
        <h1 style="font-size:24px;font-weight:700">Donors — Outreach List</h1>
        <p style="font-size:13px;color:var(--text-secondary);margin-top:4px">
          Refdomains from 7 broker-specific competitors (merged, deduped, filtered).
          Source: Ahrefs pull 2026-04-15. Noindex, admin-only.
        </p>
      </div>
    </div>

    <div class="summary-grid">
      <div class="glass-card"><div class="card-label">Total donors</div><div class="card-value">${total.c.toLocaleString()}</div></div>
      <div class="glass-card"><div class="card-label">Priority (overlap≥2)</div><div class="card-value" style="color:var(--amber)">${priority.c.toLocaleString()}</div></div>
      <div class="glass-card"><div class="card-label">High DR (40+)</div><div class="card-value" style="color:var(--cyan)">${highDR.c.toLocaleString()}</div></div>
      <div class="glass-card"><div class="card-label">Found contacts</div><div class="card-value" style="color:var(--green)">${found.c.toLocaleString()}</div></div>
      <div class="glass-card"><div class="card-label">Pending</div><div class="card-value" style="color:var(--text-secondary)">${pending.c.toLocaleString()}</div></div>
    </div>

    <div class="filters">
      <label>Min DR <input type="number" id="f_dr" value="40" min="0" max="100"></label>
      <label>Min overlap <input type="number" id="f_ov" value="0" min="0" max="11"></label>
      <label>Status
        <select id="f_status">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="found">Found</option>
          <option value="no_contact">No contact</option>
          <option value="blocked">Blocked</option>
          <option value="dead">Dead</option>
        </select>
      </label>
      <label>Search <input type="text" id="f_search" placeholder="domain contains..."></label>
      <label>Limit
        <select id="f_limit">
          <option>200</option><option>500</option><option selected>1000</option><option>2000</option><option>5000</option><option value="10000">All (10k)</option>
        </select>
      </label>
      <button class="btn-primary" onclick="loadDonors()">Apply</button>
      <span id="count" style="margin-left:auto;font-size:12px;color:var(--text-secondary)"></span>
    </div>

    <div class="table-wrap">
      <div class="table-scroll">
        <table class="premium-table">
          <thead>
            <tr>
              <th style="width:40px">#</th>
              <th>Domain</th>
              <th style="width:60px">DR</th>
              <th style="width:60px">Ovl</th>
              <th>Linked from</th>
              <th style="width:80px">Traffic</th>
              <th>Email</th>
              <th>Form</th>
              <th style="width:100px">Status</th>
            </tr>
          </thead>
          <tbody id="rows"><tr><td colspan="9" class="loading">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
  </main>

  ${adminFooterHTML()}
</div>

<script>
  const KEY = "${encodedKey}";
  ${adminHeaderScript()}

  function drClass(dr) {
    if (dr >= 90) return 'dr-90';
    if (dr >= 70) return 'dr-70';
    if (dr >= 50) return 'dr-50';
    if (dr >= 30) return 'dr-30';
    return 'dr-0';
  }

  async function loadDonors() {
    const dr = document.getElementById('f_dr').value || 0;
    const ov = document.getElementById('f_ov').value || 0;
    const st = document.getElementById('f_status').value;
    const search = document.getElementById('f_search').value.trim().toLowerCase();
    const limit = document.getElementById('f_limit').value;

    const params = new URLSearchParams({ min_dr: dr, min_overlap: ov, limit });
    if (st) params.set('status', st);

    document.getElementById('rows').innerHTML = '<tr><td colspan="9" class="loading">Loading...</td></tr>';
    const res = await fetch('/api/admin/donors/list?' + params, { headers: { 'Authorization': 'Bearer ' + decodeURIComponent(KEY) } });
    const { rows } = await res.json();
    const filtered = search ? rows.filter(r => r.domain.includes(search)) : rows;
    document.getElementById('count').textContent = filtered.length + ' / ' + rows.length + ' shown';

    if (filtered.length === 0) {
      document.getElementById('rows').innerHTML = '<tr><td colspan="9" class="loading">No results.</td></tr>';
      return;
    }

    const html = filtered.map((r, i) => {
      const dr = r.max_dr || 0;
      const traffic = (r.max_traffic || 0).toLocaleString();
      const status = r.status || 'pending';
      const email = r.email ? '<a href="mailto:' + r.email + '" style="color:var(--blue)">' + r.email + '</a>' : '—';
      const form = r.contact_form_url ? '<a href="' + r.contact_form_url + '" target="_blank" rel="noopener" style="color:var(--blue)">form</a>' : '—';
      return '<tr>' +
        '<td style="color:var(--text-muted);font-size:11px">' + (i+1) + '</td>' +
        '<td class="domain-cell"><a href="https://' + r.domain + '" target="_blank" rel="noopener noreferrer nofollow">' + r.domain + '</a></td>' +
        '<td><span class="dr-badge ' + drClass(dr) + '">' + dr.toFixed(0) + '</span></td>' +
        '<td><span class="overlap-chip">' + (r.overlap || 1) + '</span></td>' +
        '<td class="competitors-cell">' + (r.competitors || '') + '</td>' +
        '<td style="color:var(--text-secondary);font-variant-numeric:tabular-nums">' + traffic + '</td>' +
        '<td>' + email + '</td>' +
        '<td>' + form + '</td>' +
        '<td><span class="status-pill status-' + status + '">' + status.replace('_',' ') + '</span></td>' +
      '</tr>';
    }).join('');
    document.getElementById('rows').innerHTML = html;
  }

  loadDonors();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
