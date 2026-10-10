(function (root) {
  'use strict';
  const key = 'cie-hub-theme';
  const system = matchMedia('(prefers-color-scheme: dark)');
  let preference = '';
  try { preference = localStorage.getItem(key) || ''; } catch {}
  if (!['light','dark'].includes(preference)) preference = '';
  let theme = preference || (system.matches ? 'dark' : 'light');
  function syncUI() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const dark = theme === 'dark';
    button.setAttribute('aria-pressed',String(dark));
    button.title = root.HubI18n ? root.HubI18n.t(dark ? 'switchToLight' : 'switchToDark') : dark ? 'Switch to light theme' : 'Switch to dark theme';
  }
  function apply() {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0d1420' : '#f7f7f4';
    syncUI();
  }
  function setTheme(value) {
    if (!['light','dark'].includes(value)) return;
    preference = theme = value;
    try { localStorage.setItem(key,theme); } catch {}
    apply();
  }
  root.HubAppearance = {setTheme,syncUI,get theme(){return theme;}};
  apply();
  system.addEventListener('change',()=>{if (!preference) {theme=system.matches?'dark':'light';apply();}});
})(window);
