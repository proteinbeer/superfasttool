(() => {
  const storageKey = 'sftPreferredLocale';
  const supported = ['en'];
  const set = () => {
    try { localStorage.setItem(storageKey, 'en'); } catch {}
  };
  const pathFor = (_locale, pathname = location.pathname) => pathname;
  set();
  window.SFTLocale = { get: () => 'en', set, pathFor, supported: [...supported] };
})();