/**
 * Shared admin layout — header, nav, language switcher.
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
  { id: 'clicks', label: 'Click Dashboard', path: '/api/stats/dashboard' },
  { id: 'affiliate', label: 'Affiliate Links', path: '/api/admin/dashboard' },
];

export function adminHeaderCSS() {
  return `
  .admin-shell { min-height: 100vh; background: #0f1117; }
  .admin-topbar {
    background: #13151f; border-bottom: 1px solid #1e2130;
    padding: 0 24px; display: flex; align-items: center; height: 52px;
    position: sticky; top: 0; z-index: 100;
  }
  .admin-logo {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 15px; font-weight: 700; color: #fff; margin-right: 32px;
    display: flex; align-items: center; gap: 8px; text-decoration: none;
    white-space: nowrap;
  }
  .admin-logo .dot { color: #4ade80; }
  .admin-nav { display: flex; gap: 2px; flex: 1; }
  .admin-nav a {
    padding: 14px 16px; font-size: 13px; font-weight: 600;
    color: #666; text-decoration: none; position: relative;
    transition: color 0.15s; white-space: nowrap;
  }
  .admin-nav a:hover { color: #ccc; }
  .admin-nav a.active {
    color: #4ade80;
  }
  .admin-nav a.active::after {
    content: ''; position: absolute; bottom: 0; left: 12px; right: 12px;
    height: 2px; background: #4ade80; border-radius: 2px 2px 0 0;
  }
  .admin-right { display: flex; align-items: center; gap: 12px; margin-left: auto; }
  .lang-switcher {
    display: flex; align-items: center; gap: 6px;
    background: #1a1d27; border: 1px solid #2a2d37; border-radius: 6px;
    padding: 5px 10px; cursor: pointer; position: relative;
    font-size: 13px; color: #aaa; transition: all 0.15s;
  }
  .lang-switcher:hover { border-color: #3a3d47; color: #e0e0e0; }
  .lang-flag { font-size: 16px; line-height: 1; }
  .lang-label { font-weight: 600; }
  .lang-dropdown {
    position: absolute; top: calc(100% + 4px); right: 0;
    background: #1a1d27; border: 1px solid #2a2d37; border-radius: 8px;
    padding: 4px; min-width: 160px; display: none; z-index: 200;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .lang-dropdown.open { display: block; }
  .lang-option {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; border-radius: 6px; cursor: pointer;
    font-size: 13px; color: #aaa; transition: all 0.1s;
  }
  .lang-option:hover { background: #22252f; color: #e0e0e0; }
  .lang-option.active { color: #4ade80; background: rgba(74,222,128,0.08); }
  .admin-body { padding: 20px 24px; }
  .admin-env {
    font-size: 11px; color: #333; background: #1a1d27;
    padding: 3px 8px; border-radius: 4px; font-weight: 600;
    letter-spacing: 0.5px; text-transform: uppercase;
  }
  @media (max-width: 640px) {
    .admin-topbar { padding: 0 12px; height: 48px; }
    .admin-logo { font-size: 13px; margin-right: 16px; }
    .admin-nav a { padding: 12px 10px; font-size: 12px; }
    .admin-body { padding: 16px 12px; }
    .lang-label { display: none; }
  }
`;
}

export function adminHeaderHTML(activePage, encodedKey) {
  const navLinks = NAV_ITEMS.map(item => {
    const isActive = item.id === activePage;
    return `<a href="${item.path}?key=${encodedKey}" class="${isActive ? 'active' : ''}">${item.label}</a>`;
  }).join('');

  const currentLang = LANGUAGES[0];
  const langOptions = LANGUAGES.map(l =>
    `<div class="lang-option ${l.code === currentLang.code ? 'active' : ''}" data-lang="${l.code}">` +
    `<span class="lang-flag">${l.flag}</span><span>${l.label}</span></div>`
  ).join('');

  return `
<div class="admin-topbar">
  <a class="admin-logo" href="/api/stats/dashboard?key=${encodedKey}">
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
