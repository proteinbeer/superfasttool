import fs from 'node:fs';
import path from 'node:path';
import { applyTranslationMap } from './auto-tool-i18n.mjs';

const baseUrl = 'https://superfasttool.com';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function preserveFooterBrand(value) {
  const text = String(value);
  const match = text.match(/^(.+?\s*2026)\s+.*?([.。]\s*.*)$/);
  return match ? `${match[1]} Super Fast Tool.${match[2].replace(/^[.。]\s*/, ' ')}` : text;
}

function preserveFooterBrandInHtml(source) {
  return source.replace(/<p>([^<]*2026[^<]*)<\/p>/g, (match, text) => {
    return text.trim().indexOf('2026') <= 8 ? `<p>${preserveFooterBrand(text)}</p>` : match;
  });
}

function localeUrl(slug, code) {
  return code === 'en' ? `${baseUrl}/${slug}/` : `${baseUrl}/${code}/${slug}/`;
}

function localePath(slug, code) {
  return code === 'en' ? `/${slug}/` : `/${code}/${slug}/`;
}

function localizedGuidePath(config, code) {
  return code === 'en' ? config.guideHref : `/${code}${config.guideHref}`;
}

function replaceRequired(source, pattern, replacement, label) {
  pattern.lastIndex = 0;
  if (!pattern.test(source)) throw new Error(`Missing ${label}`);
  pattern.lastIndex = 0;
  return source.replace(pattern, replacement);
}

function replaceCapturedText(source, pattern, value, label) {
  return replaceRequired(source, pattern, (...match) => `${match[1]}${escapeHtml(value)}${match[2]}`, label);
}

function alternateLinks(config) {
  const links = Object.keys(config.locales).map(code =>
    `    <link rel="alternate" hreflang="${code}" href="${localeUrl(config.slug, code)}">`
  );
  links.push(`    <link rel="alternate" hreflang="x-default" href="${localeUrl(config.slug, 'en')}">`);
  return `<!-- SFT_I18N_ALTERNATES_START -->\n${links.join('\n')}\n    <!-- SFT_I18N_ALTERNATES_END -->`;
}

function languageControl(config, selectedCode) {
  const items = Object.entries(config.locales).map(([code, locale]) => {
    const selected = code === selectedCode;
    const classes = selected ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-700 hover:bg-zinc-100';
    const codeClasses = selected ? 'text-orange-300' : 'text-zinc-300';
    return `<button type="button" role="menuitem" data-locale="${code}" aria-current="${selected ? 'true' : 'false'}" class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors ${classes}"><span>${escapeHtml(locale.label)}</span><span class="text-[10px] ${codeClasses}">${code.toUpperCase()}</span></button>`;
  }).join('');
  return `<div class="language-menu relative shrink-0" data-sft-language-control><button id="languageMenuButton" type="button" aria-haspopup="menu" aria-expanded="false" class="inline-flex min-w-[7.5rem] items-center justify-between gap-3 rounded-xl border border-zinc-900 bg-zinc-900 px-3 py-2 text-xs font-black text-white shadow-sm transition-colors hover:bg-zinc-700"><span>${escapeHtml(config.locales[selectedCode].label)}</span><span id="languageMenuChevron" aria-hidden="true" class="inline-flex h-4 w-4 shrink-0 items-center justify-center transition-transform"><span class="block h-1.5 w-1.5 -translate-y-px rotate-45 border-b-2 border-r-2 border-white"></span></span></button><div id="languageMenu" role="menu" class="absolute right-0 top-full z-[70] mt-2 hidden w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">${items}</div></div>`;
}

function navigationScript(config, code) {
  const locale = config.locales[code];
  const urls = Object.fromEntries(Object.keys(config.locales).map(localeCode => [localeCode, localePath(config.slug, localeCode)]));
  const labels = { addStar: locale.addStar, removeStar: locale.removeStar };
  return `<script>window.SFT_LOCALE=${JSON.stringify(code)};window.SFT_LOCALE_URLS=${JSON.stringify(urls)};window.SFT_I18N=${JSON.stringify(labels)};document.addEventListener('DOMContentLoaded',()=>{const button=document.getElementById('languageMenuButton');const menu=document.getElementById('languageMenu');const chevron=document.getElementById('languageMenuChevron');if(!button||!menu)return;const closeMenu=()=>{menu.classList.add('hidden');button.setAttribute('aria-expanded','false');chevron?.classList.remove('rotate-180');};button.addEventListener('click',event=>{event.stopPropagation();const opening=menu.classList.contains('hidden');menu.classList.toggle('hidden',!opening);button.setAttribute('aria-expanded',String(opening));chevron?.classList.toggle('rotate-180',opening);});menu.addEventListener('click',event=>{const item=event.target.closest('[data-locale]');if(!item)return;window.SFTLocale?.set(item.dataset.locale);const url=window.SFT_LOCALE_URLS[item.dataset.locale];if(url)location.assign(url);});document.addEventListener('click',event=>{if(!event.target.closest('.language-menu'))closeMenu();});document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});});</script>`;
}

function localizeStructuredData(source, config, locale, url) {
  return replaceRequired(source, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (match, json) => {
    let data;
    try {
      data = JSON.parse(json);
    } catch (error) {
      throw new Error(`Invalid JSON-LD in ${config.slug}: ${error.message}`);
    }
    data.name = locale.title;
    data.url = url;
    data.description = locale.meta;
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 4)}\n    </script>`;
  }, 'JSON-LD');
}

function headerSubtitle(title) {
  const letters = [...`- ${title}`].map(character =>
    `<span class="logo-sub-letter">${character === ' ' ? '&nbsp;' : escapeHtml(character)}</span>`
  ).join('');
  return `<span class="logo-sub-name" aria-label="${escapeHtml(title)}">${letters}</span>`;
}

function prepareSharedSource(source, config, version) {
  source = source.replace(/\n\s*\/\/ Multilingual translation system\.[\s\S]*?(?=\n\s*<\/script>)/, '');
  source = source.replace(/\s*function getBrowserLanguage\(\) \{[\s\S]*?(?=\n\s*const cardsGrid =)/, '\n');
  source = source.replace(/\n\s*const targetIds = \[[\s\S]*?\n\s*\];/, '');
  source = source.replace(/\n\s*const originalTexts = \{\};\s*\n\s*const translatedTexts = \{\};\s*\n\s*let isTranslated = true;/, '');
  source = source.replace(/\s*\[document\.querySelector\('#translateIcon img'\)\],/, '');
  source = source.replace(/<body class="(?![^"]*page-transitions-disabled)/, '<body class="page-transitions-disabled ');
  source = source.replace(/<body class="(?![^"]*\btool-page\b)/, '<body class="tool-page tool-page-loading ');
  source = source.replace(/\s*<!-- SFT_I18N_ALTERNATES_START -->[\s\S]*?<!-- SFT_I18N_ALTERNATES_END -->/g, '');
  source = replaceRequired(source, /(<link rel="canonical"[^>]+>)/, `$1\n    ${alternateLinks(config)}`, 'canonical link');
  source = source.replace(/\s*<script src="\/locale-routing\.js"><\/script>/g, '');
  source = replaceRequired(source, /(<!-- SFT_I18N_ALTERNATES_END -->)/, `$1\n    <script src="/locale-routing.js"></script>`, 'locale router');

  let controlStart = source.indexOf('<div class="language-menu relative shrink-0"');
  if (controlStart < 0) controlStart = source.indexOf('<div class="shrink-0 flex items-center gap-2 bg-gray-100/90');
  const controlEndMarker = '        </div>\n    </header>';
  const controlEnd = source.indexOf(controlEndMarker, controlStart);
  if (controlStart < 0 || controlEnd < 0) throw new Error(`Missing language control in ${config.slug}`);
  source = source.slice(0, controlStart) + languageControl(config, 'en') + '\n' + source.slice(controlEnd);

  source = source.replace(/\s*<script>window\.SFT_LOCALE=.*?<\/script>/g, '');
  source = replaceRequired(source, /(<script>window\.SFT_TOOL_PAGE = \{[^<]+<\/script>)/, `$1\n    ${navigationScript(config, 'en')}`, 'tool page config');
  source = source.replace("starButton.setAttribute('aria-label', isStarred ? 'Remove from Starred' : 'Add to Starred');", "starButton.setAttribute('aria-label', isStarred ? (window.SFT_I18N?.removeStar || 'Remove from Starred') : (window.SFT_I18N?.addStar || 'Add to Starred')); ");
  return source.replace(/v1\.2\.\d+/g, version);
}

function localizeCommon(source, config, code, locale) {
  let output = source;
  const url = localeUrl(config.slug, code);
  const titleWithBrand = `${locale.title} | Super Fast Tool`;

  output = output.replace('<html lang="en">', `<html lang="${code}">`);
  output = output.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(titleWithBrand)}</title>`);
  output = output.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(locale.meta)}">`);
  output = output.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  output = output.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  output = output.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(titleWithBrand)}">`);
  output = output.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(locale.meta)}">`);
  output = output.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeHtml(titleWithBrand)}">`);
  output = output.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeHtml(locale.meta)}">`);
  output = localizeStructuredData(output, config, locale, url);

  output = replaceCapturedText(output, new RegExp(`(<h3 id="${config.titleId}"[^>]*>)[^<]*(<\\/h3>)`), locale.title, 'tool title');
  output = replaceCapturedText(output, new RegExp(`(<p id="${config.descriptionId}"[^>]*>)[^<]*(<\\/p>)`), locale.short, 'tool description');
  for (const replacement of config.replacements) {
    output = replaceCapturedText(output, replacement.pattern, locale[replacement.key], replacement.key);
  }

  output = replaceCapturedText(output, /(<div id="toolBackHome"[\s\S]*?<span[^>]*>[^<]*<\/span>\s*)Back(\s*<\/a>)/, locale.back, 'Back');
  output = replaceCapturedText(output, /(<span id="footerAbout">)[^<]*(<\/span>)/, locale.about, 'footer About');
  output = replaceCapturedText(output, /(<span id="footerPolicy">)[^<]*(<\/span>)/, locale.policy, 'footer Policy');
  output = replaceCapturedText(output, /(<span id="footerContact">)[^<]*(<\/span>)/, locale.contact, 'footer Contact');
  output = replaceCapturedText(output, /(<p id="footerDesc"[^>]*>)[\s\S]*?(<\/p>)/, locale.footer, 'footer description');
  output = output.replace(/<p>(?:&copy;|©|Â©) 2026 Super Fast Tool\.[^<]*<\/p>/, `<p>${escapeHtml(locale.rights)}</p>`);
  output = replaceCapturedText(output, /(<h2 id="infoPanelTitle"[^>]*>)[^<]*(<\/h2>)/, locale.about, 'About title');
  output = preserveFooterBrandInHtml(output);
  output = replaceRequired(output, /(<div id="aboutPanel"[^>]*>)[\s\S]*?(<\/div>\s*<div id="privacyPanel")/, (match, start, end) => `${start}${locale.aboutHtml}${end}`, 'About panel');
  output = replaceCapturedText(output, /(<form id="contactPanel"[\s\S]*?<p[^>]*>)[^<]*(<\/p>)/, locale.contactIntro, 'contact intro');
  output = replaceCapturedText(output, /(<input name="name"[^>]*placeholder=")[^"]*(")/, locale.namePlaceholder, 'name placeholder');
  output = replaceCapturedText(output, /(<input name="email"[^>]*placeholder=")[^"]*(")/, locale.emailPlaceholder, 'email placeholder');
  output = replaceCapturedText(output, /(<textarea name="message"[^>]*placeholder=")[^"]*(")/, locale.messagePlaceholder, 'message placeholder');
  output = replaceCapturedText(output, /(<form id="contactPanel"[\s\S]*?<button type="submit"[^>]*>)[^<]*(<\/button>)/, locale.send, 'Send button');
  output = replaceCapturedText(output, /(<div id="contactSentMessage"[^>]*>)[\s\S]*?(<\/div>)/, locale.sent, 'Sent message');

  const paragraphs = locale.paragraphs.map((text, index) => `<p${index ? ' class="mt-3"' : ''}>${escapeHtml(text)}</p>`).join('\n                ');
  const infoSection = `<section class="mx-auto mt-8 max-w-4xl text-left text-xs leading-6 text-zinc-400"><h2 class="mb-4 text-center text-sm font-black text-zinc-500">${escapeHtml(locale.title)}</h2><div class="mb-4 text-center"><a href="${localizedGuidePath(config, code)}" class="tool-guide-link inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:border-zinc-700 hover:bg-zinc-700"><span aria-hidden="true">&#128214;</span>${escapeHtml(locale.guide)}</a></div>${paragraphs}</section>`;
  output = replaceRequired(output, /<section class="mx-auto mt-8 max-w-4xl text-left text-xs leading-6 text-zinc-400">[\s\S]*?<\/section>/, infoSection, 'tool information section');

  output = output.replace(/<script>window\.SFT_LOCALE=.*?<\/script>/, navigationScript(config, code));
  output = replaceRequired(output, /window\.SFT_TOOL_PAGE = \{ cardId: "[^"]+", slug: "[^"]+", title: "[^"]+" \}/, `window.SFT_TOOL_PAGE = { cardId: "${config.cardId}", slug: "${config.slug}", title: ${JSON.stringify(locale.title)} }`, 'localized tool page config');
  output = replaceRequired(output, /<div class="language-menu relative shrink-0" data-sft-language-control>[\s\S]*?<\/div><\/div>/, languageControl(config, code), 'localized language control');
  if (config.guideHref) output = output.replace(`href="${config.guideHref}"`, `href="${localizedGuidePath(config, code)}"`);

  if (code !== 'en') output = output.replaceAll('src="../', 'src="/').replaceAll('src="./', `src="/${config.slug}/`).replaceAll('href="./', `href="/${config.slug}/`).replaceAll('href="../favicon.svg"', 'href="/favicon.svg"');
  return output.replace(/[ \t]+$/gm, '');
}

function localizeAuto(source, config, code, locale) {
  let output = source;
  const url = localeUrl(config.slug, code);
  const titleWithBrand = `${locale.title} | Super Fast Tool`;

  output = output.replace('<html lang="en">', `<html lang="${code}">`);
  output = output.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(titleWithBrand)}</title>`);
  output = output.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(locale.meta)}">`);
  output = output.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  output = output.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  output = output.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(titleWithBrand)}">`);
  output = output.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(locale.meta)}">`);
  output = output.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeHtml(titleWithBrand)}">`);
  output = output.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeHtml(locale.meta)}">`);
  output = localizeStructuredData(output, config, locale, url);
  output = applyTranslationMap(output, config.cardId, locale.translations || {});
  output = preserveFooterBrandInHtml(output);
  output = output.replace(/<span(?=[^>]*\bclass="[^"]*\blogo-sub-name\b)[^>]*>(?:<span class="logo-sub-letter">[\s\S]*?<\/span>)*<\/span>\s*<\/a>/, `${headerSubtitle(locale.title)}</a>`);
  output = output.replace(/<script>window\.SFT_LOCALE=.*?<\/script>/, navigationScript(config, code));
  output = replaceRequired(output, /window\.SFT_TOOL_PAGE = \{ cardId: "[^"]+", slug: "[^"]+", title: "[^"]+" \}/, `window.SFT_TOOL_PAGE = { cardId: "${config.cardId}", slug: "${config.slug}", title: ${JSON.stringify(locale.title)} }`, 'localized tool page config');
  output = replaceRequired(output, /<div class="language-menu relative shrink-0" data-sft-language-control>[\s\S]*?<\/div><\/div>/, languageControl(config, code), 'localized language control');
  if (config.guideHref) output = output.replace(`href="${config.guideHref}"`, `href="${localizedGuidePath(config, code)}"`);
  if (code !== 'en') output = output.replaceAll('src="../', 'src="/').replaceAll('src="./', `src="/${config.slug}/`).replaceAll('href="./', `href="/${config.slug}/`).replaceAll('href="../favicon.svg"', 'href="/favicon.svg"');
  return output.replace(/[ \t]+$/gm, '');
}

function sitemapMarker(slug) {
  return `SFT_TOOL_I18N_${slug.toUpperCase().replaceAll('-', '_')}`;
}

function updateSitemap(root, config, lastmod, write) {
  const sitemapPath = path.join(root, 'sitemap.xml');
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  for (const marker of [sitemapMarker(config.slug), ...(config.legacySitemapMarkers || [])]) {
    sitemap = sitemap.replace(new RegExp(`\\s*<!-- ${marker}_START -->[\\s\\S]*?<!-- ${marker}_END -->`, 'g'), '');
  }
  const entries = Object.keys(config.locales).filter(code => code !== 'en').map(code =>
    `  <url><loc>${localeUrl(config.slug, code)}</loc><lastmod>${lastmod}</lastmod></url>`
  ).join('\n');
  const marker = sitemapMarker(config.slug);
  sitemap = sitemap.replace('</urlset>', `  <!-- ${marker}_START -->\n${entries}\n  <!-- ${marker}_END -->\n</urlset>`);
  if (write) fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  return sitemap;
}

export function buildToolI18n(root, config, options = {}) {
  const { write = true, version = 'v1.2.408', lastmod = '2026-07-04' } = options;
  const englishPath = path.join(root, config.slug, 'index.html');
  let source = fs.readFileSync(englishPath, 'utf8').replaceAll('\r\n', '\n');
  source = prepareSharedSource(source, config, version);

  const outputs = [];
  for (const [code, locale] of Object.entries(config.locales)) {
    const output = config.mode === 'auto'
      ? localizeAuto(source, config, code, locale)
      : localizeCommon(source, config, code, locale);
    const destination = code === 'en' ? englishPath : path.join(root, code, config.slug, 'index.html');
    outputs.push({ code, destination, output, changed: !fs.existsSync(destination) || fs.readFileSync(destination, 'utf8').replaceAll('\r\n', '\n') !== output });
    if (write) {
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, output, 'utf8');
    }
  }
  updateSitemap(root, config, lastmod, write);
  return { slug: config.slug, pages: outputs.length, changed: outputs.filter(item => item.changed).length, outputs };
}
