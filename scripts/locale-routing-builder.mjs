import fs from 'node:fs';
import path from 'node:path';

const supportedLocales = ['en', 'ko', 'ja', 'zh-CN', 'es', 'de', 'fr', 'pt-BR'];

function routingSource(slugs) {
  return `(() => {
  const storageKey = 'sftPreferredLocale';
  const supported = ${JSON.stringify(supportedLocales)};
  const localizedTools = new Set(${JSON.stringify([...slugs].sort())});
  const localizedGuides = new Set(__SFT_GUIDE_SLUGS__);
  const isSupported = locale => supported.includes(locale);
  const partsFor = pathname => pathname.split('/').filter(Boolean);
  const routeFor = pathname => {
    const parts = partsFor(pathname);
    const locale = isSupported(parts[0]) && parts[0] !== 'en' ? parts.shift() : 'en';
    const isTool = parts.length === 1 && localizedTools.has(parts[0]);
    const isGuide = parts.length === 2 && parts[0] === 'guides' && localizedGuides.has(parts[1]);
    return { locale, parts, localizable: parts.length === 0 || isTool || isGuide };
  };
  const read = () => {
    try {
      const locale = localStorage.getItem(storageKey);
      return isSupported(locale) ? locale : null;
    } catch {
      return null;
    }
  };
  const set = locale => {
    if (!isSupported(locale)) return;
    try { localStorage.setItem(storageKey, locale); } catch {}
  };
  const pathFor = (locale, pathname = location.pathname) => {
    if (!isSupported(locale)) locale = 'en';
    const route = routeFor(pathname);
    if (!route.localizable) return pathname;
    const suffix = route.parts.length ? '/' + route.parts.join('/') + '/' : '/';
    return locale === 'en' ? suffix : '/' + locale + suffix;
  };
  const current = routeFor(location.pathname);
  if (current.locale !== 'en') set(current.locale);
  const get = () => read() || current.locale;
  window.SFTLocale = { get, set, pathFor, supported: [...supported] };

  const preferred = get();
  if (current.localizable && current.locale === 'en' && preferred !== 'en') {
    location.replace(pathFor(preferred) + location.search + location.hash);
    return;
  }

  document.addEventListener('click', event => {
    const localeItem = event.target.closest('[data-locale]');
    if (localeItem) set(localeItem.dataset.locale);
  }, true);

  document.addEventListener('DOMContentLoaded', () => {
    const locale = get();
    document.querySelectorAll('a[href]').forEach(anchor => {
      if (anchor.hasAttribute('download')) return;
      let url;
      try { url = new URL(anchor.href, location.href); } catch { return; }
      if (url.origin !== location.origin) return;
      const route = routeFor(url.pathname);
      if (!route.localizable) return;
      url.pathname = pathFor(locale, url.pathname);
      anchor.href = url.pathname + url.search + url.hash;
    });
  });
})();
`;
}

export function buildLocaleRouting(root, slugs, options = {}) {
  const { write = true, guideSlugs = [] } = options;
  const destination = path.join(root, 'locale-routing.js');
  const output = routingSource(slugs).replace('__SFT_GUIDE_SLUGS__', JSON.stringify([...guideSlugs].sort()));
  const changed = !fs.existsSync(destination) || fs.readFileSync(destination, 'utf8').replaceAll('\r\n', '\n') !== output;
  if (write) fs.writeFileSync(destination, output, 'utf8');
  return { destination, changed, output };
}
