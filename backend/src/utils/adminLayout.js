/**
 * Shared admin layout — header, nav, language switcher, footer.
 * Used by both admin.js (Affiliate Admin) and stats.js (Click Dashboard).
 */

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  // Future languages:
  // { code: 'es', flag: '🇪🇸', label: 'Español' },
  // { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  // { code: 'ar', flag: '🇸🇦', label: 'العربية' },
  // { code: 'pt', flag: '🇧🇷', label: 'Português' },
];

const NAV_ITEMS = [
  { id: 'clicks', label: 'Click Dashboard', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>', path: '/api/stats/dashboard' },
  { id: 'affiliate', label: 'Affiliate Links', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>', path: '/api/admin/dashboard' },
  { id: 'rankings', label: 'Rankings', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>', path: '/api/admin/rankings/dashboard' },
];

export function adminHeaderCSS() {
  return `
  :root {
    --bg-base: #0f1117; --bg-card: #1a1d27; --bg-card-hover: #1e2130;
    --border: #2a2d37; --border-hover: #3a3d47;
    --text-primary: #e0e0e0; --text-secondary: #888; --text-muted: #555;
    --green: #4ade80; --green-dim: #059669; --green-glow: rgba(74,222,128,0.15);
    --blue: #60a5fa; --blue-dim: #3b82f6; --blue-glow: rgba(96,165,250,0.15);
    --amber: #fbbf24; --amber-dim: #f59e0b; --amber-glow: rgba(251,191,36,0.15);
    --purple: #a78bfa; --purple-dim: #8b5cf6; --purple-glow: rgba(167,139,250,0.15);
    --red: #f87171; --red-dim: #ef4444; --red-glow: rgba(248,113,113,0.15);
    --cyan: #22d3ee; --cyan-dim: #06b6d4;
  }
  .admin-shell { min-height: 100vh; background: var(--bg-base); display: flex; flex-direction: column; }
  .admin-topbar {
    background: linear-gradient(180deg, #161824 0%, #13151f 100%);
    border-bottom: 1px solid var(--border);
    padding: 0 24px; display: flex; align-items: center; height: 52px;
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(12px);
  }
  .admin-logo {
    font-size: 15px; font-weight: 700; color: #fff; margin-right: 32px;
    display: flex; align-items: center; gap: 8px; text-decoration: none;
    white-space: nowrap; transition: opacity 0.15s;
  }
  .admin-logo:hover { opacity: 0.85; }
  .admin-logo .logo-icon {
    width: 22px; height: 22px; background: linear-gradient(135deg, var(--green) 0%, var(--green-dim) 100%);
    border-radius: 5px; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 900; color: #0f1117; line-height: 1;
  }
  .admin-logo .dot { color: var(--green); }
  .admin-nav { display: flex; gap: 2px; flex: 1; }
  .admin-nav a {
    padding: 14px 16px; font-size: 13px; font-weight: 600;
    color: var(--text-muted); text-decoration: none; position: relative;
    transition: color 0.15s; white-space: nowrap;
    display: flex; align-items: center; gap: 6px;
  }
  .admin-nav a:hover { color: var(--text-secondary); }
  .admin-nav a.active { color: var(--green); }
  .admin-nav a.active::after {
    content: ''; position: absolute; bottom: 0; left: 12px; right: 12px;
    height: 2px; background: linear-gradient(90deg, var(--green), var(--green-dim));
    border-radius: 2px 2px 0 0;
  }
  .admin-right { display: flex; align-items: center; gap: 12px; margin-left: auto; }
  .lang-switcher {
    display: flex; align-items: center; gap: 6px;
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 6px;
    padding: 5px 10px; cursor: pointer; position: relative;
    font-size: 13px; color: #aaa; transition: all 0.15s;
  }
  .lang-switcher:hover { border-color: var(--border-hover); color: var(--text-primary); }
  .lang-flag { font-size: 16px; line-height: 1; }
  .lang-label { font-weight: 600; }
  .lang-dropdown {
    position: absolute; top: calc(100% + 4px); right: 0;
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px;
    padding: 4px; min-width: 160px; display: none; z-index: 200;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .lang-dropdown.open { display: block; }
  .lang-option {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; border-radius: 6px; cursor: pointer;
    font-size: 13px; color: #aaa; transition: all 0.1s;
  }
  .lang-option:hover { background: var(--bg-card-hover); color: var(--text-primary); }
  .lang-option.active { color: var(--green); background: var(--green-glow); }
  .admin-body { padding: 20px 24px; flex: 1; }
  .admin-env {
    font-size: 10px; color: var(--green); background: var(--green-glow);
    padding: 3px 8px; border-radius: 4px; font-weight: 700;
    letter-spacing: 0.5px; text-transform: uppercase;
    border: 1px solid rgba(74,222,128,0.2);
  }
  .admin-footer {
    padding: 12px 24px; border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    font-size: 11px; color: var(--text-muted);
  }
  .admin-footer a { color: var(--text-muted); text-decoration: none; }
  .admin-footer a:hover { color: var(--text-secondary); }
  @media (max-width: 640px) {
    .admin-topbar { padding: 0 12px; height: 48px; }
    .admin-logo { font-size: 13px; margin-right: 16px; }
    .admin-logo .logo-icon { width: 18px; height: 18px; font-size: 10px; }
    .admin-nav a { padding: 12px 10px; font-size: 12px; }
    .admin-nav a svg { display: none; }
    .admin-body { padding: 16px 12px; }
    .lang-label { display: none; }
    .admin-footer { padding: 12px; flex-direction: column; gap: 4px; }
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
  <span>RatedBrokers Admin &middot; Data as of ${now}</span>
  <a href="https://ratedbrokers.com" target="_blank">ratedbrokers.com &nearr;</a>
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
