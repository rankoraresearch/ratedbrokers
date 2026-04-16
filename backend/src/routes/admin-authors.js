/**
 * Authors Outreach Map — admin-only dashboard.
 *
 * Was previously /research/authors on the public site (noindex). Moved
 * here so the harvested LinkedIn/contact data is gated behind the admin
 * key instead of shipped in the public JS bundle.
 *
 * Embeds all 580 authors + 96 outlets inline as JSON. Vanilla JS
 * filter/sort. No external assets.
 */
import { adminHeaderCSS, adminHeaderHTML, adminFooterHTML, adminHeaderScript } from '../utils/adminLayout.js';
import { checkAuth, extractKey } from '../utils/auth.js';
import {
  AUTHORS, SITES, CATEGORIES, BEATS, EEAT_TIERS,
  calcAuthorScore, calcAuthoritativeness, calcFinalScore, deriveEEATTier,
} from '../../../src/data/authorsSample.js';

function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Compact per-author record for the embedded JSON. Drops the verbose
// employmentHistory, raw bio (kept short), and signal counts that are
// already encoded in finalScore — keeps the embed under ~600KB.
function compactAuthor(a) {
  const ms = a.mediaSignals || {};
  const ts = a.trustSignals || {};
  return {
    id: a.id,
    name: a.name,
    role: a.role,
    seniority: a.seniority,
    status: a.status,
    bio: a.bio ? a.bio.slice(0, 600) : null,
    site: a.site,
    writesFor: a.writesFor || [a.site],
    badge: a.badge,
    beat: a.beat || [],
    credentials: a.credentials || [],
    certifications: (a.certifications || []).map(c => ({
      name: c.name, issuer: c.issuer, verified: !!c.verified, verifyUrl: c.verifyUrl || null,
    })),
    education: (a.education || []).map(e => ({ degree: e.degree, school: e.school, year: e.year || null })),
    yearsInIndustry: a.yearsInIndustry || null,
    location: a.location || null,
    email: a.email || null,
    linkedin: a.linkedin || null,
    twitter: a.twitter || null,
    muckrack: a.muckrack || null,
    personalSite: a.personalSite || ts.ownedDomain || null,
    authorUrl: a.authorUrl || null,
    needsManualReview: !!a.needsManualReview,
    discoveryMethod: a.discoveryMethod || null,
    notes: a.notes || a.discoveryNote || null,
    ms: {
      qt1: ms.quotedInTier1?.length || 0,
      tv: ms.tvAppearances?.length || 0,
      books: ms.authoredBooks?.length || 0,
      bookTitles: (ms.authoredBooks || []).slice(0, 3),
      kp: !!ms.hasKnowledgePanel,
      mr: ms.muckrackArticleCount || null,
      lf: ms.linkedinFollowers ?? null,
      lc: ms.linkedinConnections || null,
      lfa: ms.linkedinFetchedAt || null,
      tf: ms.twitterFollowers ?? null,
      tfa: ms.twitterFetchedAt || null,
    },
    score: calcAuthorScore(a),
    auth: calcAuthoritativeness(a),
    finalScore: calcFinalScore(a),
    eeatTier: deriveEEATTier(calcAuthoritativeness(a)),
  };
}

export async function handleAdminAuthorsDashboard(request, env) {
  if (!checkAuth(request, env)) return new Response('Unauthorized', { status: 401 });
  const encodedKey = encodeURIComponent(extractKey(request));

  const authors = AUTHORS.filter(Boolean).map(compactAuthor);
  const outlets = {};
  for (const [k, s] of Object.entries(SITES)) {
    outlets[k] = {
      slug: s.slug, name: s.name, dr: s.dr, tier: s.tier,
      url: s.url, category: s.category,
      compRefs: s.competitorBacklinks?.refdomains || 0,
    };
  }
  const beats = Object.fromEntries(Object.entries(BEATS).map(([k, v]) => [k, { label: v.label, color: v.color }]));
  const cats = CATEGORIES;
  const tiers = EEAT_TIERS;

  // Stats
  const total = authors.length;
  const tierS = authors.filter(a => a.eeatTier === 'S').length;
  const tierA = authors.filter(a => a.eeatTier === 'A').length;
  const withLI = authors.filter(a => a.linkedin).length;
  const withFollowers = authors.filter(a => a.ms.tf != null).length;
  const withEmail = authors.filter(a => a.email).length;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
<title>Authors — Rated.Admin</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0c10; color: #f0f0f0; }
  ${adminHeaderCSS()}

  .summary-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; margin-bottom: 24px; }
  @media (max-width: 900px) { .summary-grid { grid-template-columns: repeat(2, 1fr); } }
  .summary-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 10px; padding: 16px; }
  .summary-card .v { font-size: 26px; font-weight: 700; color: var(--text-primary); font-feature-settings: 'tnum'; }
  .summary-card .k { font-size: 11px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

  .filters { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 16px; padding: 14px 16px;
    background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 10px; }
  .filters select, .filters input {
    padding: 6px 10px; background: rgba(0,0,0,0.4); border: 1px solid var(--border);
    color: var(--text-primary); border-radius: 6px; font-size: 13px; font-family: inherit;
  }
  .filters input[type="text"] { min-width: 240px; }
  .filters input[type="number"] { width: 90px; }
  .filters .toggle { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border: 1px solid var(--border);
    border-radius: 6px; cursor: pointer; font-size: 12px; user-select: none; background: rgba(0,0,0,0.3); }
  .filters .toggle.on { background: rgba(34,197,94,0.18); border-color: rgba(34,197,94,0.5); color: #34d399; }
  .filters .count { margin-left: auto; font-size: 12px; color: var(--text-secondary); }

  table.authors { width: 100%; border-collapse: collapse; font-size: 12px; background: var(--bg-card-solid); border-radius: 10px; overflow: hidden; }
  table.authors thead { background: rgba(0,0,0,0.4); }
  table.authors th { text-align: left; padding: 10px 12px; font-weight: 600; color: var(--text-secondary); font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; border-bottom: 1px solid var(--border); cursor: pointer; user-select: none; }
  table.authors th.sortable:hover { color: var(--text-primary); }
  table.authors td { padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: top; }
  table.authors tbody tr:hover { background: rgba(255,255,255,0.03); }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; }
  .badge-S { background: rgba(168,85,247,0.2); color: #c4b5fd; }
  .badge-A { background: rgba(59,130,246,0.2); color: #93c5fd; }
  .badge-B { background: rgba(34,197,94,0.2); color: #86efac; }
  .badge-C { background: rgba(156,163,175,0.2); color: #d1d5db; }
  .badge-T1 { background: rgba(168,85,247,0.2); color: #c4b5fd; }
  .badge-T2 { background: rgba(59,130,246,0.2); color: #93c5fd; }
  .badge-T3 { background: rgba(34,197,94,0.2); color: #86efac; }
  .badge-T4 { background: rgba(156,163,175,0.2); color: #d1d5db; }
  .li-followers { font-weight: 700; color: #93c5fd; font-feature-settings: 'tnum'; text-align: right; min-width: 60px; display: inline-block; }
  .li-conn { font-size: 11px; color: var(--text-muted); }
  .links { display: flex; gap: 6px; }
  .links a { color: var(--text-secondary); text-decoration: none; padding: 2px 6px; border: 1px solid var(--border); border-radius: 4px; font-size: 11px; }
  .links a:hover { color: #34d399; border-color: rgba(34,197,94,0.5); }
  .role-cell { color: var(--text-secondary); max-width: 240px; }
  .name-cell { font-weight: 600; color: var(--text-primary); max-width: 200px; }
  .name-cell .review-flag { display: inline-block; margin-left: 4px; padding: 1px 5px; background: rgba(239,68,68,0.2); color: #fca5a5; border-radius: 3px; font-size: 9px; font-weight: 700; }
  .name-cell .former { display: inline-block; margin-left: 4px; padding: 1px 5px; background: rgba(156,163,175,0.2); color: #9ca3af; border-radius: 3px; font-size: 9px; font-weight: 700; }
  .beat-pill { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 10px; margin-right: 3px; }
  .empty { text-align: center; padding: 60px 20px; color: var(--text-secondary); }
  .score-pill { display: inline-block; min-width: 32px; padding: 3px 8px; border-radius: 999px; font-weight: 700; color: #fff; font-size: 11px; text-align: center; font-feature-settings: 'tnum'; }
</style>
</head>
<body>
${adminHeaderHTML('authors', encodedKey)}

<main class="container">
  <h1 class="page-title">Authors Outreach Map</h1>
  <p class="page-sub">580 authors harvested across 96 outlets. Twitter/X follower counts fetched directly from x.com (S9). LinkedIn followers blocked by anti-bot — not displayed.</p>

  <div class="summary-grid">
    <div class="summary-card"><div class="v">${total}</div><div class="k">Authors</div></div>
    <div class="summary-card"><div class="v" style="color:#c4b5fd">${tierS}</div><div class="k">Tier S</div></div>
    <div class="summary-card"><div class="v" style="color:#93c5fd">${tierA}</div><div class="k">Tier A</div></div>
    <div class="summary-card"><div class="v">${withLI}</div><div class="k">With LinkedIn</div></div>
    <div class="summary-card"><div class="v" style="color:#34d399">${withFollowers}</div><div class="k">X followers ✓</div></div>
    <div class="summary-card"><div class="v">${withEmail}</div><div class="k">Email captured</div></div>
  </div>

  <div class="filters">
    <input id="f-search" type="text" placeholder="Search name, role, bio, beat...">
    <select id="f-tier">
      <option value="all">All E-E-A-T tiers</option>
      <option value="S">Tier S</option><option value="A">Tier A</option>
      <option value="B">Tier B</option><option value="C">Tier C</option>
    </select>
    <select id="f-outletTier">
      <option value="all">All outlet tiers</option>
      <option value="T1">T1 (DR ≥ 90)</option><option value="T2">T2 (70-89)</option>
      <option value="T3">T3 (50-69)</option><option value="T4">T4 (&lt; 50)</option>
    </select>
    <input id="f-minScore" type="number" placeholder="min score" min="0" max="200">
    <input id="f-minFollowers" type="number" placeholder="min followers" min="0">
    <select id="f-sort">
      <option value="finalScore">Sort: Final score ↓</option>
      <option value="followers">Sort: LI followers ↓</option>
      <option value="score">Sort: Base score ↓</option>
      <option value="auth">Sort: E-E-A-T (auth) ↓</option>
      <option value="outletDR">Sort: Outlet DR ↓</option>
      <option value="yearsInIndustry">Sort: Years exp ↓</option>
      <option value="books">Sort: Book count ↓</option>
      <option value="qt1">Sort: Tier-1 quotes ↓</option>
      <option value="tv">Sort: TV apps ↓</option>
      <option value="certCount">Sort: Cert count ↓</option>
      <option value="outletCount">Sort: Outlet count ↓</option>
      <option value="name">Sort: Name A→Z</option>
      <option value="outletName">Sort: Outlet A→Z</option>
    </select>
    <span class="toggle" data-tog="hasLinkedIn">LinkedIn</span>
    <span class="toggle" data-tog="hasEmail">Email</span>
    <span class="toggle" data-tog="hasCerts">Certified</span>
    <span class="toggle" data-tog="hasBook">Book</span>
    <span class="toggle" data-tog="hasTier1">Tier-1 quoted</span>
    <span class="toggle" data-tog="multiOutlet">Multi-outlet</span>
    <span class="toggle on" data-tog="hideReview">Hide ⚠ review</span>
    <span class="count" id="result-count">${total} authors</span>
  </div>

  <table class="authors" id="tbl">
    <thead>
      <tr>
        <th class="sortable" data-sort="finalScore" data-dir="desc">Final ↓</th>
        <th class="sortable" data-sort="eeatTier">EEAT</th>
        <th class="sortable" data-sort="name">Author</th>
        <th>Role</th>
        <th class="sortable" data-sort="outletName">Outlet</th>
        <th class="sortable" data-sort="outletDR">Tier · DR</th>
        <th>Beat</th>
        <th class="sortable" data-sort="yearsInIndustry" title="Years of professional experience in financial journalism / advisory / trading">Yrs exp.</th>
        <th class="sortable" data-sort="followers" style="text-align:right" title="Twitter/X followers (verified from x.com, S9). LinkedIn followers are blocked — not displayed.">X Ⓕ</th>
        <th>Contacts</th>
      </tr>
    </thead>
    <tbody id="tbody"></tbody>
  </table>
</main>

<script id="authors-data" type="application/json">${JSON.stringify(authors).replace(/</g, '\\u003c')}</script>
<script id="outlets-data" type="application/json">${JSON.stringify(outlets).replace(/</g, '\\u003c')}</script>
<script id="beats-data" type="application/json">${JSON.stringify(beats).replace(/</g, '\\u003c')}</script>

<script>
(function() {
  const AUTHORS = JSON.parse(document.getElementById('authors-data').textContent);
  const OUTLETS = JSON.parse(document.getElementById('outlets-data').textContent);
  const BEATS = JSON.parse(document.getElementById('beats-data').textContent);

  // Enrich with computed display + sort fields
  AUTHORS.forEach(a => {
    const o = OUTLETS[a.site] || {};
    a.outletName = o.name || a.site;
    a.outletDR = o.dr || 0;
    a.outletTier = o.tier || 'T4';
    a.outletUrl = o.url || '';
    a.compRefs = o.compRefs || 0;
    a.followers = a.ms.tf; // Twitter/X (verified); LI blocked
    a.isMultiOutlet = (a.writesFor && a.writesFor.length > 1);
    a.books = a.ms.books || 0;
    a.qt1 = a.ms.qt1 || 0;
    a.tv = a.ms.tv || 0;
    a.certCount = (a.certifications || []).length;
    a.outletCount = (a.writesFor || [a.site]).length;
  });

  const state = {
    search: '', tier: 'all', outletTier: 'all', minScore: 0, minFollowers: 0,
    hasLinkedIn: false, hasEmail: false, hasCerts: false, hasBook: false,
    hasTier1: false, multiOutlet: false, hideReview: true,
    sortKey: 'finalScore', sortDir: 'desc',
  };

  function fmtFollowers(n, conn) {
    if (n != null) {
      if (n >= 10000) return Math.round(n / 1000) + 'K';
      if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
      return n.toLocaleString();
    }
    if (conn) return '<span class="li-conn">' + conn + '</span>';
    return '<span class="li-conn">—</span>';
  }

  function scoreColor(n) {
    if (n >= 110) return '#10b981';
    if (n >= 80) return '#3b82f6';
    if (n >= 50) return '#f59e0b';
    return '#6b7280';
  }

  function filtered() {
    const q = state.search.toLowerCase();
    let res = AUTHORS.filter(a => {
      if (state.tier !== 'all' && a.eeatTier !== state.tier) return false;
      if (state.outletTier !== 'all' && a.outletTier !== state.outletTier) return false;
      if (state.minScore && a.finalScore < state.minScore) return false;
      if (state.minFollowers && (a.followers || 0) < state.minFollowers) return false;
      if (state.hasLinkedIn && !a.linkedin) return false;
      if (state.hasEmail && !a.email) return false;
      if (state.hasCerts && !(a.certifications && a.certifications.length)) return false;
      if (state.hasBook && !(a.ms && a.ms.books > 0)) return false;
      if (state.hasTier1 && !(a.ms && a.ms.qt1 > 0)) return false;
      if (state.multiOutlet && !a.isMultiOutlet) return false;
      if (state.hideReview && a.needsManualReview) return false;
      if (q) {
        const hay = (a.name + ' ' + (a.role || '') + ' ' + (a.bio || '') + ' ' + (a.beat || []).join(' ')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const dir = state.sortDir === 'asc' ? 1 : -1;
    res.sort((a, b) => {
      const k = state.sortKey;
      if (k === 'name' || k === 'outletName') return (a[k] || '').localeCompare(b[k] || '') * dir;
      if (k === 'eeatTier') return (a.eeatTier || '').localeCompare(b.eeatTier || '') * dir;
      const av = a[k] != null ? a[k] : -Infinity;
      const bv = b[k] != null ? b[k] : -Infinity;
      return (bv - av) * (dir === 1 ? -1 : 1);
    });
    return res;
  }

  function escHtml(s) { return (s == null ? '' : String(s)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function renderRow(a) {
    const certsBit = (a.certifications || []).map(c => '<span class="badge" style="background:rgba(16,185,129,0.15);color:#6ee7b7;margin-left:4px">' + escHtml(c.name) + (c.verified ? ' ✓' : '') + '</span>').join('');
    const beats = (a.beat || []).slice(0, 3).map(b => {
      const bd = BEATS[b] || { label: b, color: '#94a3b8' };
      return '<span class="beat-pill" style="background:' + bd.color + '22;color:' + bd.color + '">' + escHtml(bd.label) + '</span>';
    }).join('') + ((a.beat || []).length > 3 ? '<span class="li-conn">+' + ((a.beat || []).length - 3) + '</span>' : '');
    const links = [
      a.linkedin ? '<a href="' + escHtml(a.linkedin) + '" target="_blank" title="LinkedIn">in</a>' : '',
      a.twitter ? '<a href="' + escHtml(a.twitter) + '" target="_blank" title="Twitter">X</a>' : '',
      a.muckrack ? '<a href="' + escHtml(a.muckrack) + '" target="_blank" title="Muck Rack">mr</a>' : '',
      a.email ? '<a href="mailto:' + escHtml(a.email) + '" title="Email">@</a>' : '',
      a.personalSite ? '<a href="' + escHtml(a.personalSite) + '" target="_blank" title="Site">site</a>' : '',
      a.authorUrl ? '<a href="' + escHtml(a.authorUrl) + '" target="_blank" title="Author page">page</a>' : '',
    ].filter(Boolean).join('');
    const formerFlag = a.status === 'former' || a.seniority === 'former' ? '<span class="former">FORMER</span>' : '';
    const reviewFlag = a.needsManualReview ? '<span class="review-flag">⚠</span>' : '';
    const followersTitle = a.ms.tfa ? 'X followers — fetched ' + a.ms.tfa.split('T')[0] : '';
    return '<tr>' +
      '<td><span class="score-pill" style="background:' + scoreColor(a.finalScore) + '" title="base ' + a.score + ' × auth +' + a.auth + '">' + a.finalScore + '</span></td>' +
      '<td><span class="badge badge-' + a.eeatTier + '">' + a.eeatTier + '</span></td>' +
      '<td class="name-cell">' + escHtml(a.name) + formerFlag + reviewFlag + certsBit + '</td>' +
      '<td class="role-cell">' + escHtml(a.role || '') + '</td>' +
      '<td>' + (a.outletUrl ? '<a href="' + escHtml(a.outletUrl) + '" target="_blank" style="color:#93c5fd;text-decoration:none">' + escHtml(a.outletName) + '</a>' : escHtml(a.outletName)) + '</td>' +
      '<td><span class="badge badge-' + a.outletTier + '">' + a.outletTier + ' · ' + a.outletDR + '</span></td>' +
      '<td>' + beats + '</td>' +
      '<td>' + (a.yearsInIndustry || '<span class="li-conn">—</span>') + '</td>' +
      '<td style="text-align:right" title="' + escHtml(followersTitle) + '"><span class="li-followers">' + fmtFollowers(a.followers, a.ms.lc) + '</span></td>' +
      '<td><div class="links">' + (links || '<span class="li-conn">—</span>') + '</div></td>' +
      '</tr>';
  }

  function render() {
    const rows = filtered();
    document.getElementById('result-count').textContent = rows.length + ' / ${total} authors';
    const tbody = document.getElementById('tbody');
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" class="empty">No authors match the current filters.</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(renderRow).join('');
  }

  // Wire up filters
  document.getElementById('f-search').addEventListener('input', e => { state.search = e.target.value; render(); });
  document.getElementById('f-tier').addEventListener('change', e => { state.tier = e.target.value; render(); });
  document.getElementById('f-outletTier').addEventListener('change', e => { state.outletTier = e.target.value; render(); });
  document.getElementById('f-minScore').addEventListener('input', e => { state.minScore = Number(e.target.value) || 0; render(); });
  document.getElementById('f-minFollowers').addEventListener('input', e => { state.minFollowers = Number(e.target.value) || 0; render(); });
  document.getElementById('f-sort').addEventListener('change', e => {
    state.sortKey = e.target.value;
    state.sortDir = (e.target.value === 'name' || e.target.value === 'outletName') ? 'asc' : 'desc';
    updateHeaderArrows();
    render();
  });
  document.querySelectorAll('.toggle').forEach(el => {
    el.addEventListener('click', () => {
      const k = el.dataset.tog;
      state[k] = !state[k];
      el.classList.toggle('on');
      render();
    });
  });
  function updateHeaderArrows() {
    document.querySelectorAll('th.sortable').forEach(t => {
      const base = t.textContent.replace(/[↓↑]/g, '').trim();
      t.textContent = base + (t.dataset.sort === state.sortKey ? (state.sortDir === 'desc' ? ' ↓' : ' ↑') : '');
    });
    // Sync dropdown if a header click moved sort to a column-dim
    const dd = document.getElementById('f-sort');
    if (dd && [...dd.options].some(o => o.value === state.sortKey)) dd.value = state.sortKey;
  }

  // Sort by clicking column headers
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const k = th.dataset.sort;
      if (state.sortKey === k) state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
      else { state.sortKey = k; state.sortDir = (k === 'name' || k === 'outletName') ? 'asc' : 'desc'; }
      updateHeaderArrows();
      render();
    });
  });

  render();
})();
</script>

${adminFooterHTML()}
${adminHeaderScript()}
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
      'Cache-Control': 'no-store',
    },
  });
}
