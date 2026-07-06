import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, serialize } from 'parse5';
import { toolI18nConfigs } from './tool-i18n.config.mjs';
import { buildLocaleRouting } from './locale-routing-builder.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const baseUrl = 'https://superfasttool.com';
const version = 'v1.2.429';
const catalogPath = path.join(here, 'guide-i18n.catalog.json');
const localeDefinitions = {
  en: { label: 'English', target: 'en' },
  ko: { label: '한국어', target: 'ko' },
  ja: { label: '日本語', target: 'ja' },
  'zh-CN': { label: '简体中文', target: 'zh-CN' },
  es: { label: 'Español', target: 'es' },
  de: { label: 'Deutsch', target: 'de' },
  fr: { label: 'Français', target: 'fr' },
  'pt-BR': { label: 'Português (Brasil)', target: 'pt' }
};
const localeCodes = Object.keys(localeDefinitions);
const guideSlugFor = slug => slug === 'stock-crypto-avg-cost-calculator' ? 'how-to-calculate-average-stock-cost' : slug;
const guideConfigs = toolI18nConfigs.filter(config => config.guideHref);
const guideSlugs = guideConfigs.map(config => guideSlugFor(config.slug));
const toolSlugs = toolI18nConfigs.map(config => config.slug);

function attr(node, name) {
  return node.attrs?.find(item => item.name === name)?.value;
}

function setAttr(node, name, value) {
  node.attrs ||= [];
  const existing = node.attrs.find(item => item.name === name);
  if (existing) existing.value = value;
  else node.attrs.push({ name, value });
}

function hasClass(node, name) {
  return (attr(node, 'class') || '').split(/\s+/).includes(name);
}

function walk(node, visitor, ancestors = []) {
  visitor(node, ancestors);
  for (const child of node.childNodes || []) walk(child, visitor, [...ancestors, node]);
}

function languageControl(code, guideSlug) {
  const items = localeCodes.map(locale => {
    const selected = locale === code;
    const href = locale === 'en' ? `/guides/${guideSlug}/` : `/${locale}/guides/${guideSlug}/`;
    return `<a role="menuitem" data-locale="${locale}" aria-current="${selected}" href="${href}" class="language-item${selected ? ' selected' : ''}"><span>${localeDefinitions[locale].label}</span><small>${locale.toUpperCase()}</small></a>`;
  }).join('');
  return `<div class="language-menu"><button id="languageMenuButton" type="button" aria-haspopup="menu" aria-expanded="false"><span>${localeDefinitions[code].label}</span><span class="language-chevron" aria-hidden="true"></span></button><div id="languageMenu" role="menu" hidden>${items}</div></div>`;
}

function alternateLinks(guideSlug) {
  const links = localeCodes.map(code => {
    const href = code === 'en' ? `${baseUrl}/guides/${guideSlug}/` : `${baseUrl}/${code}/guides/${guideSlug}/`;
    return `<link rel="alternate" hreflang="${code}" href="${href}">`;
  });
  links.push(`<link rel="alternate" hreflang="x-default" href="${baseUrl}/guides/${guideSlug}/">`);
  return `<!-- SFT_GUIDE_I18N_ALTERNATES_START -->${links.join('')}<!-- SFT_GUIDE_I18N_ALTERNATES_END -->`;
}

const menuCss = `.language-menu{position:relative;flex:0 0 auto}.language-menu button{min-width:120px;height:38px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 12px;border:1px solid #18181b;border-radius:8px;background:#18181b;color:#fff;font:800 12px/1 Inter,ui-sans-serif,system-ui;cursor:pointer}.language-chevron{width:7px;height:7px;border-right:2px solid #fff;border-bottom:2px solid #fff;transform:translateY(-2px) rotate(45deg)}.language-menu [role=menu]{position:absolute;right:0;top:calc(100% + 8px);z-index:80;width:190px;padding:6px;border:1px solid #e4e4e7;border-radius:8px;background:#fff;box-shadow:0 16px 40px rgba(24,24,27,.16)}.language-item{display:flex;align-items:center;justify-content:space-between;padding:9px 10px;border-radius:6px;color:#3f3f46;text-decoration:none;font-size:12px;font-weight:800}.language-item:hover{background:#f4f4f5}.language-item.selected{background:#18181b;color:#fff}.language-item small{color:#a1a1aa;font-size:10px}.language-item.selected small{color:#fdba74}[hidden]{display:none!important}`;
const menuScript = `<script>(()=>{const button=document.getElementById('languageMenuButton');const menu=document.getElementById('languageMenu');if(!button||!menu)return;const close=()=>{menu.hidden=true;button.setAttribute('aria-expanded','false')};button.addEventListener('click',event=>{event.stopPropagation();menu.hidden=!menu.hidden;button.setAttribute('aria-expanded',String(!menu.hidden))});document.addEventListener('click',event=>{if(!event.target.closest('.language-menu'))close()});document.addEventListener('keydown',event=>{if(event.key==='Escape')close()})})();</script>`;

function normalizeSource(source, code, guideSlug) {
  let output = source.replace(/v1\.2\.\d+/g, version);
  output = output.replace(/<a class="tool-link"[\s\S]*?<\/a>\s*(?=<section>)/, '');
  output = output.replace(/\s*<!-- SFT_GUIDE_I18N_ALTERNATES_START -->[\s\S]*?<!-- SFT_GUIDE_I18N_ALTERNATES_END -->/g, '');
  output = output.replace(/\s*<script src="\/locale-routing\.js"><\/script>/g, '');
  output = output.replace(/(<link rel="canonical"[^>]+>)/, `$1${alternateLinks(guideSlug)}<script src="/locale-routing.js"></script>`);
  output = output.replace(/<div class="language-menu">[\s\S]*?<\/div><\/div><\/div><\/header>/, `${languageControl(code, guideSlug)}</div></header>`);
  output = output.replace('<div data-guide-language-slot></div>', languageControl(code, guideSlug));
  if (!output.includes("const button=document.getElementById('languageMenuButton')")) output = output.replace('</body>', `${menuScript}</body>`);
  if (!output.includes('.language-menu{position:relative')) output = output.replace('</style>', `${menuCss}</style>`);
  return output;
}

function excludedText(ancestors) {
  if (ancestors.some(node => ['script', 'style'].includes(node.tagName))) return true;
  if (ancestors.some(node => hasClass(node, 'language-menu') || hasClass(node, 'logo-text') || hasClass(node, 'logo-sub-name') || hasClass(node, 'version'))) return true;
  return ancestors.some(node => node.tagName === 'a' && attr(node, 'rel')?.includes('noopener'));
}

function translatable(value) {
  const text = value.trim();
  return text.length > 0 && /[A-Za-z]/.test(text);
}

function collectStrings(html) {
  const document = parse(html);
  const strings = new Set();
  walk(document, (node, ancestors) => {
    if (node.nodeName === '#text' && !excludedText(ancestors) && translatable(node.value)) strings.add(node.value.trim());
    if (node.tagName === 'meta' && ['description', 'og:title', 'og:description'].includes(attr(node, 'name') || attr(node, 'property'))) {
      const value = attr(node, 'content');
      if (translatable(value || '')) strings.add(value.trim());
    }
  });
  return strings;
}

function translateValue(value, translations) {
  const trimmed = value.trim();
  if (!translations[trimmed]) return value;
  const start = value.indexOf(trimmed);
  return value.slice(0, start) + translations[trimmed] + value.slice(start + trimmed.length);
}

function openToolLabel(code, title) {
  return {
    en: `Open ${title}`,
    ko: `${title} 열기`,
    ja: `${title}を開く`,
    'zh-CN': `打开${title}`,
    es: `Abrir ${title}`,
    de: `${title} öffnen`,
    fr: `Ouvrir ${title}`,
    'pt-BR': `Abrir ${title}`
  }[code];
}

function localizeDocument(source, code, guideSlug, toolSlug, translations, config) {
  const document = parse(normalizeSource(source, code, guideSlug));
  const localizedUrl = code === 'en' ? `${baseUrl}/guides/${guideSlug}/` : `${baseUrl}/${code}/guides/${guideSlug}/`;
  const localizedTranslations = { ...translations };
  const englishTitle = config.locales.en.title;
  localizedTranslations[`Open ${englishTitle}`] = openToolLabel(code, config.locales[code].title);
  walk(document, (node, ancestors) => {
    if (node.tagName === 'html') setAttr(node, 'lang', code);
    if (node.nodeName === '#text' && !excludedText(ancestors) && code !== 'en') node.value = translateValue(node.value, localizedTranslations);
    if (node.tagName === 'link' && attr(node, 'rel') === 'canonical') setAttr(node, 'href', localizedUrl);
    if (node.tagName === 'meta') {
      const key = attr(node, 'name') || attr(node, 'property');
      if (['description', 'og:title', 'og:description'].includes(key) && code !== 'en') setAttr(node, 'content', translateValue(attr(node, 'content') || '', localizedTranslations));
      if (key === 'og:url') setAttr(node, 'content', localizedUrl);
    }
    if (node.tagName === 'a') {
      const href = attr(node, 'href');
      if (code !== 'en' && href === '/') setAttr(node, 'href', `/${code}/`);
      if (code !== 'en' && href === `/${toolSlug}/`) setAttr(node, 'href', `/${code}/${toolSlug}/`);
    }
    if (node.tagName === 'script' && attr(node, 'type') === 'application/ld+json' && node.childNodes?.[0]) {
      try {
        const data = JSON.parse(node.childNodes[0].value);
        if (code !== 'en') {
          data.headline = translations[data.headline] || data.headline;
          data.description = translations[data.description] || data.description;
        }
        data.mainEntityOfPage = localizedUrl;
        data.dateModified = '2026-07-03';
        node.childNodes[0].value = JSON.stringify(data);
      } catch {}
    }
  });
  return serialize(document).replace(/v1\.2\.\d+/g, version);
}

const guideRecords = guideSlugs.map(guideSlug => {
  const file = path.join(root, 'guides', guideSlug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`Missing English guide: ${guideSlug}`);
  const source = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
  const toolLink = source.match(/class="tool-link" href="\/([^/]+)\//);
  if (!toolLink) throw new Error(`Missing tool link in guide: ${guideSlug}`);
  const config = toolI18nConfigs.find(item => item.slug === toolLink[1]);
  if (!config) throw new Error(`Missing tool locale config for guide: ${guideSlug}`);
  return { guideSlug, toolSlug: toolLink[1], source, config };
});

const allStrings = [...new Set(guideRecords.flatMap(record => [...collectStrings(normalizeSource(record.source, 'en', record.guideSlug))]))].sort();
const catalog = fs.existsSync(catalogPath) ? JSON.parse(fs.readFileSync(catalogPath, 'utf8')) : { version: 1, translations: {} };
catalog.version = 1;

for (const code of localeCodes.filter(item => item !== 'en')) {
  const missing = allStrings.filter(value => !catalog.translations[code]?.[value]);
  if (missing.length) throw new Error(`${code} is missing ${missing.length} static guide translations:\n${missing.join('\n')}`);
}

for (const record of guideRecords) {
  for (const code of localeCodes) {
    const destination = code === 'en'
      ? path.join(root, 'guides', record.guideSlug, 'index.html')
      : path.join(root, code, 'guides', record.guideSlug, 'index.html');
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, localizeDocument(record.source, code, record.guideSlug, record.toolSlug, catalog.translations[code] || {}, record.config), 'utf8');
  }
}

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
sitemap = sitemap.replace(/\s*<!-- SFT_GUIDE_I18N_START -->[\s\S]*?<!-- SFT_GUIDE_I18N_END -->/g, '');
const guideEntries = localeCodes.filter(code => code !== 'en').flatMap(code => guideSlugs.map(guideSlug => `  <url><loc>${baseUrl}/${code}/guides/${guideSlug}/</loc><lastmod>2026-07-03</lastmod></url>`)).join('\n');
sitemap = sitemap.replace('</urlset>', `  <!-- SFT_GUIDE_I18N_START -->\n${guideEntries}\n  <!-- SFT_GUIDE_I18N_END -->\n</urlset>`);
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

buildLocaleRouting(root, toolSlugs, { guideSlugs });
console.log(`Built ${guideRecords.length * localeCodes.length} localized guide pages from ${allStrings.length} translatable strings.`);
