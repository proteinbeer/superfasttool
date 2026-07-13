import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, serialize } from 'parse5';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const baseUrl = 'https://superfasttool.com';
const version = 'v1.2.456';
const catalogPath = path.join(here, 'tool-note-i18n.catalog.json');
if (!fs.existsSync(catalogPath)) throw new Error('Missing tool-note-i18n.catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const locales = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  'zh-CN': '简体中文',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  'pt-BR': 'Português (Brasil)'
};
const localeCodes = ['en', ...Object.keys(catalog.translations || {})].filter(code => locales[code]);

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

function excludedText(ancestors) {
  if (ancestors.some(node => ['script', 'style'].includes(node.tagName))) return true;
  return ancestors.some(node => hasClass(node, 'language-menu') || hasClass(node, 'logo-text') || hasClass(node, 'logo-sub-name') || hasClass(node, 'version'));
}

function translatable(value) {
  const text = value.trim();
  return text.length > 0 && /[A-Za-z]/.test(text);
}

function translateValue(value, translations) {
  const trimmed = value.trim();
  if (!translations[trimmed]) return value;
  const start = value.indexOf(trimmed);
  return value.slice(0, start) + translations[trimmed] + value.slice(start + trimmed.length);
}

function localizedUrl(slug, code) {
  return code === 'en' ? `${baseUrl}/blog/${slug}/` : `${baseUrl}/${code}/blog/${slug}/`;
}

function languageControl(slug, selectedCode) {
  const items = localeCodes.map(code => {
    const href = code === 'en' ? `/blog/${slug}/` : `/${code}/blog/${slug}/`;
    const selected = code === selectedCode;
    return `<a role="menuitem" data-locale="${code}" aria-current="${selected}" href="${href}" class="language-item${selected ? ' selected' : ''}"><span>${locales[code]}</span><small>${code.toUpperCase()}</small></a>`;
  }).join('');
  return `<div class="language-menu post-language-menu"><button id="languageMenuButton" type="button" aria-haspopup="menu" aria-expanded="false"><span id="languageMenuLabel">${locales[selectedCode]}</span><span class="language-chevron" aria-hidden="true"></span></button><div id="languageMenu" role="menu" hidden>${items}</div></div>`;
}

function alternateLinks(slug) {
  const links = localeCodes.map(code => `<link rel="alternate" hreflang="${code}" href="${localizedUrl(slug, code)}">`);
  links.push(`<link rel="alternate" hreflang="x-default" href="${localizedUrl(slug, 'en')}">`);
  return `<!-- SFT_TOOL_NOTE_I18N_ALTERNATES_START -->${links.join('')}<!-- SFT_TOOL_NOTE_I18N_ALTERNATES_END -->`;
}

function normalizeSource(source, slug) {
  let output = source.replace(/v1\.2\.\d+/g, version);
  output = output.replace(/\s*<!-- SFT_TOOL_NOTE_I18N_ALTERNATES_START -->[\s\S]*?<!-- SFT_TOOL_NOTE_I18N_ALTERNATES_END -->/g, '');
  output = output.replace(/(<link rel="canonical"[^>]+>)/, `$1${alternateLinks(slug)}`);
  output = output.replace(/<div class="language-menu post-language-menu">[\s\S]*?<\/div><\/div>/, languageControl(slug, 'en'));
  return output;
}

function collectStrings(html) {
  const document = parse(html);
  const strings = new Set();
  walk(document, (node, ancestors) => {
    if (node.nodeName === '#text' && !excludedText(ancestors) && translatable(node.value)) strings.add(node.value.trim());
    if (node.tagName === 'meta' && ['description', 'og:title', 'og:description', 'twitter:title', 'twitter:description'].includes(attr(node, 'name') || attr(node, 'property'))) {
      const value = attr(node, 'content');
      if (translatable(value || '')) strings.add(value.trim());
    }
  });
  return strings;
}

function localizeDocument(source, slug, code, translations) {
  const document = parse(normalizeSource(source, slug));
  const url = localizedUrl(slug, code);
  walk(document, (node, ancestors) => {
    if (node.tagName === 'html') setAttr(node, 'lang', code);
    if (node.nodeName === '#text' && !excludedText(ancestors) && code !== 'en') node.value = translateValue(node.value, translations);
    if (node.tagName === 'link' && attr(node, 'rel') === 'canonical') setAttr(node, 'href', url);
    if (node.tagName === 'meta') {
      const key = attr(node, 'name') || attr(node, 'property');
      if (['description', 'og:title', 'og:description', 'twitter:title', 'twitter:description'].includes(key) && code !== 'en') {
        setAttr(node, 'content', translateValue(attr(node, 'content') || '', translations));
      }
      if (key === 'og:url') setAttr(node, 'content', url);
    }
    if (node.tagName === 'a' && code !== 'en') {
      const href = attr(node, 'href');
      if (href === '/') setAttr(node, 'href', `/${code}/`);
      if (/^\/[a-z0-9-]+\/$/.test(href || '') && href !== `/${code}/`) setAttr(node, 'href', `/${code}${href}`);
    }
    if (node.tagName === 'script' && attr(node, 'type') === 'application/ld+json' && node.childNodes?.[0]) {
      try {
        const data = JSON.parse(node.childNodes[0].value);
        if (code !== 'en') {
          data.headline = translations[data.headline] || data.headline;
          data.description = translations[data.description] || data.description;
        }
        data.mainEntityOfPage = url;
        node.childNodes[0].value = JSON.stringify(data);
      } catch {}
    }
  });
  let output = serialize(document).replace(/v1\.2\.\d+/g, version);
  output = output.replace(/<div class="language-menu post-language-menu">[\s\S]*?<\/div><\/div>/, languageControl(slug, code));
  return output.replace(/[ \t]+$/gm, '');
}

const blogRoot = path.join(root, 'blog');
const slugs = fs.readdirSync(blogRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && fs.existsSync(path.join(blogRoot, entry.name, 'index.html')))
  .map(entry => entry.name)
  .sort();
const records = slugs
  .map(slug => ({ slug, source: fs.readFileSync(path.join(blogRoot, slug, 'index.html'), 'utf8').replaceAll('\r\n', '\n') }))
  .filter(record => record.source.includes('aria-label="Tool Notes"'));
const strings = [...new Set(records.flatMap(record => [...collectStrings(normalizeSource(record.source, record.slug))]))].sort();
for (const code of localeCodes.filter(item => item !== 'en')) {
  const missing = strings.filter(value => !catalog.translations?.[code]?.[value]);
  if (missing.length) throw new Error(`${code} is missing ${missing.length} Tool Notes translations.`);
}

for (const record of records) {
  for (const code of localeCodes) {
    const destination = code === 'en'
      ? path.join(blogRoot, record.slug, 'index.html')
      : path.join(root, code, 'blog', record.slug, 'index.html');
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, localizeDocument(record.source, record.slug, code, catalog.translations?.[code] || {}), 'utf8');
  }
}

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
sitemap = sitemap.replace(/\s*<!-- SFT_TOOL_NOTE_I18N_START -->[\s\S]*?<!-- SFT_TOOL_NOTE_I18N_END -->/g, '');
const entries = localeCodes.filter(code => code !== 'en').flatMap(code => slugs.map(slug => `  <url><loc>${localizedUrl(slug, code)}</loc><lastmod>2026-07-04</lastmod></url>`)).join('\n');
sitemap = sitemap.replace('</urlset>', `  <!-- SFT_TOOL_NOTE_I18N_START -->\n${entries}\n  <!-- SFT_TOOL_NOTE_I18N_END -->\n</urlset>`);
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log(`Built ${records.length * localeCodes.length} static Tool Notes pages from ${strings.length} strings.`);
