/**
 * Shared admin layout — header, nav, language switcher, footer.
 * Premium visual: Vercel/Linear-inspired dark theme.
 * Used by stats.js, admin.js, rankings.js.
 */

const LANGUAGES = [
  { code: 'en', flag: '\u{1F1EC}\u{1F1E7}', label: 'English' },
  // Future languages:
  // { code: 'es', flag: '\u{1F1EA}\u{1F1F8}', label: 'Espa\u00f1ol' },
  // { code: 'de', flag: '\u{1F1E9}\u{1F1EA}', label: 'Deutsch' },
  // { code: 'ar', flag: '\u{1F1F8}\u{1F1E6}', label: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629' },
  // { code: 'pt', flag: '\u{1F1E7}\u{1F1F7}', label: 'Portugu\u00eas' },
];

const NAV_ITEMS = [
  { id: 'clicks', label: 'Click Dashboard', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>', path: '/api/stats/dashboard' },
  { id: 'affiliate', label: 'Affiliate Links', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>', path: '/api/admin/dashboard' },
  { id: 'rankings', label: 'Rankings', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>', path: '/api/admin/rankings/dashboard' },
];

export function adminHeaderCSS() {
  return `
  :root {
    --bg-base: #0a0c10; --bg-card: rgba(22,24,35,0.75); --bg-card-solid: #161823; --bg-card-hover: #1e2130;
    --border: rgba(255,255,255,0.06); --border-hover: rgba(255,255,255,0.12);
    --text-primary: #f0f0f0; --text-secondary: #8b8fa3; --text-muted: #4a4e63;
    --green: #4ade80; --green-dim: #059669; --green-glow: rgba(74,222,128,0.12);
    --blue: #60a5fa; --blue-dim: #3b82f6; --blue-glow: rgba(96,165,250,0.12);
    --amber: #fbbf24; --amber-dim: #f59e0b; --amber-glow: rgba(251,191,36,0.12);
    --purple: #a78bfa; --purple-dim: #8b5cf6; --purple-glow: rgba(167,139,250,0.12);
    --red: #f87171; --red-dim: #ef4444; --red-glow: rgba(248,113,113,0.12);
    --cyan: #22d3ee; --cyan-dim: #06b6d4;
    --glass-bg: rgba(255,255,255,0.03);
    --glass-border: rgba(255,255,255,0.06);
    --transition: cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* ─── Shell ─── */
  .admin-shell { min-height: 100vh; background: var(--bg-base); display: flex; flex-direction: column; }

  /* ─── Topbar ─── */
  .admin-topbar {
    background: linear-gradient(180deg, rgba(16,18,28,0.98) 0%, rgba(10,12,16,0.98) 100%);
    border-bottom: 1px solid var(--border);
    padding: 0 24px; display: flex; align-items: center; height: 56px;
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  }
  .admin-topbar::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--green-dim) 30%, var(--green) 50%, var(--green-dim) 70%, transparent 100%);
    opacity: 0.5;
  }

  /* ─── Logo ─── */
  .admin-logo {
    font-size: 16px; font-weight: 700; color: #fff; margin-right: 36px;
    display: flex; align-items: center; gap: 10px; text-decoration: none;
    white-space: nowrap; transition: opacity 0.2s var(--transition);
  }
  .admin-logo:hover { opacity: 0.85; }
  .admin-logo .logo-icon {
    width: 26px; height: 26px;
    background: linear-gradient(135deg, var(--green) 0%, var(--green-dim) 100%);
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 900; color: #0a0c10; line-height: 1;
    box-shadow: 0 0 12px rgba(74,222,128,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .admin-logo .dot { color: var(--green); }

  /* ─── Nav Pills ─── */
  .admin-nav { display: flex; gap: 4px; flex: 1; }
  .admin-nav a {
    padding: 7px 14px; font-size: 13px; font-weight: 600;
    color: var(--text-muted); text-decoration: none; position: relative;
    transition: all 0.2s var(--transition); white-space: nowrap;
    display: flex; align-items: center; gap: 6px;
    border-radius: 8px; border: 1px solid transparent;
  }
  .admin-nav a:hover {
    color: var(--text-secondary); background: rgba(255,255,255,0.04);
    border-color: var(--border);
  }
  .admin-nav a.active {
    color: var(--green); background: var(--green-glow);
    border-color: rgba(74,222,128,0.15);
    box-shadow: 0 0 12px rgba(74,222,128,0.08);
  }

  /* ─── Right side ─── */
  .admin-right { display: flex; align-items: center; gap: 12px; margin-left: auto; }
  .admin-env {
    font-size: 10px; color: var(--text-secondary); background: rgba(255,255,255,0.06);
    padding: 4px 10px; border-radius: 6px; font-weight: 700;
    letter-spacing: 0.5px; text-transform: uppercase;
    border: 1px solid var(--border);
  }
  .lang-switcher {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 8px;
    padding: 5px 10px; cursor: pointer; position: relative;
    font-size: 13px; color: var(--text-secondary); transition: all 0.2s var(--transition);
  }
  .lang-switcher:hover { border-color: var(--border-hover); color: var(--text-primary); background: rgba(255,255,255,0.06); }
  .lang-flag { font-size: 16px; line-height: 1; }
  .lang-label { font-weight: 600; }
  .lang-dropdown {
    position: absolute; top: calc(100% + 6px); right: 0;
    background: var(--bg-card-solid); border: 1px solid var(--border); border-radius: 10px;
    padding: 4px; min-width: 160px; display: none; z-index: 200;
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    backdrop-filter: blur(20px);
  }
  .lang-dropdown.open { display: block; }
  .lang-option {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; border-radius: 8px; cursor: pointer;
    font-size: 13px; color: var(--text-secondary); transition: all 0.15s;
  }
  .lang-option:hover { background: rgba(255,255,255,0.06); color: var(--text-primary); }
  .lang-option.active { color: var(--green); background: var(--green-glow); }

  /* ─── Body ─── */
  .admin-body { padding: 24px 28px; flex: 1; max-width: 1440px; margin: 0 auto; width: 100%; }

  /* ─── Button System ─── */
  .btn-primary {
    background: linear-gradient(135deg, var(--green-dim) 0%, #047857 100%);
    color: #fff; border: 1px solid rgba(74,222,128,0.2); padding: 8px 18px;
    border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
    transition: all 0.2s var(--transition); display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 2px 8px rgba(5,150,105,0.25);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(5,150,105,0.35); background: linear-gradient(135deg, #047857 0%, #065f46 100%); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

  .btn-danger {
    background: linear-gradient(135deg, var(--red-dim) 0%, #dc2626 100%);
    color: #fff; border: 1px solid rgba(248,113,113,0.2); padding: 8px 18px;
    border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
    transition: all 0.2s var(--transition); display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 2px 8px rgba(239,68,68,0.2);
  }
  .btn-danger:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(239,68,68,0.3); }

  .btn-secondary {
    background: transparent; color: var(--text-secondary);
    border: 1px solid var(--border); padding: 8px 18px;
    border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
    transition: all 0.2s var(--transition); display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-secondary:hover { color: var(--text-primary); border-color: var(--border-hover); background: rgba(255,255,255,0.04); transform: translateY(-1px); }

  .btn-info {
    background: linear-gradient(135deg, var(--blue-dim) 0%, #2563eb 100%);
    color: #fff; border: 1px solid rgba(96,165,250,0.2); padding: 8px 18px;
    border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
    transition: all 0.2s var(--transition); display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 2px 8px rgba(59,130,246,0.2);
  }
  .btn-info:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(59,130,246,0.3); }

  .btn-ghost {
    background: transparent; color: var(--text-muted);
    border: none; padding: 8px 14px;
    border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
    transition: all 0.15s var(--transition); display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-ghost:hover { color: var(--text-secondary); background: rgba(255,255,255,0.04); }

  /* ─── Glass Summary Cards ─── */
  .glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-radius: 14px; padding: 20px 22px;
    border: 1px solid var(--glass-border); position: relative; overflow: hidden;
    transition: all 0.25s var(--transition);
  }
  .glass-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    border-radius: 14px 14px 0 0;
  }
  .glass-card:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-2px); }
  .glass-card.c-green::before { background: linear-gradient(90deg, var(--green), var(--green-dim)); }
  .glass-card.c-blue::before { background: linear-gradient(90deg, var(--blue), var(--blue-dim)); }
  .glass-card.c-amber::before { background: linear-gradient(90deg, var(--amber), var(--amber-dim)); }
  .glass-card.c-purple::before { background: linear-gradient(90deg, var(--purple), var(--purple-dim)); }
  .glass-card.c-cyan::before { background: linear-gradient(90deg, var(--cyan), var(--cyan-dim)); }
  .glass-card .card-label { font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .glass-card .card-value { font-size: 32px; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: -1px; line-height: 1.1; }
  .glass-card.c-green .card-value { color: var(--green); }
  .glass-card.c-blue .card-value { color: var(--blue); }
  .glass-card.c-amber .card-value { color: var(--amber); }
  .glass-card.c-purple .card-value { color: var(--purple); }
  .glass-card.c-cyan .card-value { color: var(--cyan); }
  .glass-card .card-sub { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
  .glass-card .card-spark { position: absolute; bottom: 10px; right: 14px; opacity: 0.6; }
  .glass-card .card-trend { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; border-radius: 6px; padding: 2px 8px; margin-top: 6px; }
  .glass-card .card-trend.up { color: var(--green); background: var(--green-glow); }
  .glass-card .card-trend.down { color: var(--red); background: var(--red-glow); }
  .glass-card .card-trend.flat { color: var(--text-muted); }

  /* ─── Tables — Zebra + Hover Glow ─── */
  .premium-table { width: 100%; border-collapse: collapse; }
  .premium-table th, .premium-table td { text-align: left; padding: 10px 12px; font-size: 13px; }
  .premium-table th {
    color: var(--text-muted); font-weight: 700; font-size: 10px; text-transform: uppercase;
    letter-spacing: 0.8px; border-bottom: 2px solid rgba(255,255,255,0.06);
    background: transparent; padding-top: 12px; padding-bottom: 12px;
  }
  .premium-table td { border-bottom: 1px solid rgba(255,255,255,0.03); transition: all 0.15s; position: relative; }
  .premium-table tbody tr:nth-child(even) td { background: rgba(255,255,255,0.015); }
  .premium-table tbody tr { transition: all 0.15s var(--transition); }
  .premium-table tbody tr:hover td {
    background: rgba(74,222,128,0.03);
  }
  .premium-table tbody tr:hover td:first-child::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
    background: var(--green); border-radius: 0 1px 1px 0;
  }

  /* ─── Section Headers ─── */
  .section-hdr {
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .section-hdr::before {
    content: ''; width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0;
  }
  .section-hdr.sh-green::before { background: var(--green); }
  .section-hdr.sh-blue::before { background: var(--blue); }
  .section-hdr.sh-amber::before { background: var(--amber); }
  .section-hdr.sh-purple::before { background: var(--purple); }
  .section-hdr .sh-icon {
    width: 28px; height: 28px; border-radius: 8px; display: flex;
    align-items: center; justify-content: center; flex-shrink: 0; font-size: 13px;
  }
  .section-hdr.sh-green .sh-icon { background: var(--green-glow); color: var(--green); box-shadow: 0 0 12px rgba(74,222,128,0.1); }
  .section-hdr.sh-blue .sh-icon { background: var(--blue-glow); color: var(--blue); box-shadow: 0 0 12px rgba(96,165,250,0.1); }
  .section-hdr.sh-amber .sh-icon { background: var(--amber-glow); color: var(--amber); box-shadow: 0 0 12px rgba(251,191,36,0.1); }
  .section-hdr.sh-purple .sh-icon { background: var(--purple-glow); color: var(--purple); box-shadow: 0 0 12px rgba(167,139,250,0.1); }
  .section-hdr h2 { color: var(--text-secondary); font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700; margin: 0; }

  /* ─── Footer ─── */
  .admin-footer {
    padding: 16px 28px; position: relative;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 11px; color: var(--text-muted);
  }
  .admin-footer::before {
    content: ''; position: absolute; top: 0; left: 5%; right: 5%; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.2) 30%, rgba(74,222,128,0.4) 50%, rgba(74,222,128,0.2) 70%, transparent 100%);
  }
  .admin-footer a { color: var(--text-muted); text-decoration: none; transition: color 0.15s; }
  .admin-footer a:hover { color: var(--text-secondary); }
  .admin-footer .footer-left { display: flex; align-items: center; gap: 12px; }
  .admin-footer .footer-right { display: flex; align-items: center; gap: 12px; }
  .version-badge {
    font-size: 9px; font-weight: 700; color: var(--text-muted);
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    padding: 2px 8px; border-radius: 4px; letter-spacing: 0.3px;
  }

  /* ─── Toast (shared) ─── */
  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: var(--bg-card-solid); border: 1px solid var(--green);
    color: var(--green); padding: 12px 20px; border-radius: 12px;
    font-size: 13px; font-weight: 600; z-index: 999;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    backdrop-filter: blur(12px);
    animation: toastIn 0.25s ease, toastOut 0.3s ease 1.5s forwards;
  }
  .toast.error { border-color: var(--red); color: var(--red); }
  @keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes toastOut { to { transform: translateY(20px); opacity: 0; } }

  /* ─── Responsive ─── */
  @media (max-width: 640px) {
    .admin-topbar { padding: 0 14px; height: 50px; }
    .admin-logo { font-size: 14px; margin-right: 16px; }
    .admin-logo .logo-icon { width: 22px; height: 22px; font-size: 11px; }
    .admin-nav a { padding: 6px 10px; font-size: 12px; }
    .admin-nav a svg { display: none; }
    .admin-body { padding: 16px 14px; }
    .lang-label { display: none; }
    .admin-footer { padding: 14px; flex-direction: column; gap: 6px; }
  }
`;
}

export function adminHeaderHTML(activePage, encodedKey) {
  const navLinks = NAV_ITEMS.map(item => {
    const isActive = item.id === activePage;
    return `<a href="${item.path}?key=${encodedKey}" class="${isActive ? 'active' : ''}">${item.icon}${item.label}</a>`;
  }).join('');

  const currentLang = LANGUAGES[0];
  const langOptions = LANGUAGES.map(l =>
    `<div class="lang-option ${l.code === currentLang.code ? 'active' : ''}" data-lang="${l.code}">` +
    `<span class="lang-flag">${l.flag}</span><span>${l.label}</span></div>`
  ).join('');

  return `
<div class="admin-topbar">
  <a class="admin-logo" href="/api/stats/dashboard?key=${encodedKey}">
    <span class="logo-icon">R</span>
    Rated<span class="dot">.</span>Admin
  </a>
  <nav class="admin-nav">
    ${navLinks}
  </nav>
  <div class="admin-right">
    <span class="admin-env">EN</span>
    <div class="lang-switcher" onclick="toggleLangDropdown(event)">
      <span class="lang-flag">${currentLang.flag}</span>
      <span class="lang-label">${currentLang.label}</span>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div class="lang-dropdown" id="langDropdown">
        ${langOptions}
      </div>
    </div>
  </div>
</div>`;
}

export function adminFooterHTML() {
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
  return `
<div class="admin-footer">
  <div class="footer-left">
    <span>RatedBrokers Admin</span>
    <span class="version-badge">v1.0</span>
    <span>&middot; ${now}</span>
  </div>
  <div class="footer-right">
    <a href="https://ratedbrokers.com" target="_blank">ratedbrokers.com &nearr;</a>
  </div>
</div>`;
}

export function adminHeaderScript() {
  return `
function toggleLangDropdown(e) {
  e.stopPropagation();
  const dd = document.getElementById('langDropdown');
  dd.classList.toggle('open');
}
document.addEventListener('click', () => {
  document.getElementById('langDropdown').classList.remove('open');
});
`;
}
