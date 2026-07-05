(() => {
  const storageKey = 'sftPreferredLocale';
  const supported = ["en","ko","ja","zh-CN","es","de","fr","pt-BR"];
  const localizedTools = new Set(["age-calculator","angle-converter","area-converter","audio-metadata-viewer","audio-reverser","audio-speed-changer","audio-trimmer","audio-volume-booster","base64-to-image","bmi-calculator","business-name-generator","calorie-calculator","character-byte-counter","color-converter","color-converter-picker","compound-interest-calculator","currency-converter","data-storage-converter","date-difference-calculator","discount-calculator","doxx-click","energy-converter","fantasy-person-name-generator","fantasy-place-name-generator","fantasy-quest-generator","frequency-converter","fuel-cost-calculator","gacha-summon-simulator","game-loot-generator","gpa-calculator","image-color-picker","image-compressor","image-cropper","image-filter-tool","image-metadata-viewer","image-resizer","image-to-base64","jpg-to-png-converter","loan-payment-calculator","loot-box-simulator","lorem-ipsum-generator","lunch-picker","memory-card-game","mortgage-calculator","mp3-to-wav-converter","mp4-webm-converter","number-base-converter","pace-converter","password-generator","percentage-calculator","png-to-jpg-converter","power-converter","pressure-converter","profit-loss-calculator","random-decision-tools","random-number-generator","random-team-picker","reaction-time-test","rotate-flip-image","rpg-character-generator","rpg-dice-roller","sales-tax-calculator","sci-fi-person-name-generator","sci-fi-place-name-generator","silent-audio-generator","speed-converter","sprite-sheet-editor","stock-crypto-avg-cost-calculator","subtitle-converter","the-impossible-choice","time-duration-calculator","time-zone-converter","timestamp-converter","tip-calculator","tournament-bracket-generator","unit-converter","username-generator","uuid-generator","video-audio-extractor","video-compressor","video-to-gif-converter","video-trimmer","volume-converter","wav-to-mp3-converter","webp-converter","webp-to-png-converter"]);
  const localizedGuides = new Set(["age-calculator","angle-converter","area-converter","audio-metadata-viewer","audio-reverser","audio-speed-changer","audio-trimmer","audio-volume-booster","base64-to-image","bmi-calculator","business-name-generator","calorie-calculator","character-byte-counter","color-converter","color-converter-picker","compound-interest-calculator","currency-converter","data-storage-converter","date-difference-calculator","discount-calculator","energy-converter","fantasy-person-name-generator","fantasy-place-name-generator","fantasy-quest-generator","frequency-converter","fuel-cost-calculator","gacha-summon-simulator","game-loot-generator","gpa-calculator","how-to-calculate-average-stock-cost","image-color-picker","image-compressor","image-cropper","image-filter-tool","image-metadata-viewer","image-resizer","image-to-base64","jpg-to-png-converter","loan-payment-calculator","loot-box-simulator","lorem-ipsum-generator","lunch-picker","memory-card-game","mortgage-calculator","mp3-to-wav-converter","mp4-webm-converter","number-base-converter","pace-converter","password-generator","percentage-calculator","png-to-jpg-converter","power-converter","pressure-converter","profit-loss-calculator","random-decision-tools","random-number-generator","random-team-picker","reaction-time-test","rotate-flip-image","rpg-character-generator","rpg-dice-roller","sales-tax-calculator","sci-fi-person-name-generator","sci-fi-place-name-generator","silent-audio-generator","speed-converter","sprite-sheet-editor","subtitle-converter","the-impossible-choice","time-duration-calculator","time-zone-converter","timestamp-converter","tip-calculator","tournament-bracket-generator","unit-converter","username-generator","uuid-generator","video-audio-extractor","video-compressor","video-to-gif-converter","video-trimmer","volume-converter","wav-to-mp3-converter","webp-converter","webp-to-png-converter"]);
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
