/* Light / dark theme toggle. Default is light (warm paper);
   the choice is remembered in localStorage under 'fi_theme'. */
(function () {
  const root = document.documentElement;
  const KEY = 'fi_theme';

  function current() {
    return root.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function apply(theme) {
    if (theme === 'dark') root.dataset.theme = 'dark';
    else root.removeAttribute('data-theme');
    try { localStorage.setItem(KEY, theme); } catch (e) {}
  }

  // Normalise any stored value (older builds stored named themes here).
  try {
    const stored = localStorage.getItem(KEY);
    apply(stored === 'dark' ? 'dark' : 'light');
  } catch (e) {}

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#theme-toggle');
    if (!btn) return;
    apply(current() === 'dark' ? 'light' : 'dark');
  });
})();
