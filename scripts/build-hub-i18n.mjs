import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales } from './hub-i18n.locales.mjs';
import { toolI18nConfigs } from './tool-i18n.config.mjs';
import { applyCardTranslationMaps } from './auto-tool-i18n.mjs';
import { buildLocaleRouting } from './locale-routing-builder.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const englishPath = path.join(root, 'index.html');
const version = 'v1.2.456';
const contactPrivacyText = 'When you submit the Contact form, your name, email address, and message are sent to Formspree so the message can be delivered to us. Do not include passwords, payment details, payment information, government identifiers, medical records, or other sensitive information.';
const oldAdvertisingPrivacyText = 'If advertising is added in the future, this policy will be updated to explain ad-related cookies and choices.';
const advertisingPrivacyText = 'Advertising and cookies are explained in the full Privacy Policy, including Google AdSense or related advertising services if they are enabled on the site.';
const advertisingPrivacyTranslations = {
  en: advertisingPrivacyText,
  ko: 'ê´‘ê³  ë° ì¿ í‚¤ì— ê´€í•œ ë‚´ìš©ì€ ì „ì²´ ê°œì¸ì •ë³´ì²˜ë¦¬ë°©ì¹¨ì— ì„¤ëª…ë˜ì–´ ìžˆìœ¼ë©°, ì‚¬ì´íŠ¸ì—ì„œ í™œì„±í™”ëœ ê²½ìš° Google AdSense ë˜ëŠ” ê´€ë ¨ ê´‘ê³  ì„œë¹„ìŠ¤ì— ëŒ€í•œ ë‚´ìš©ë„ í¬í•¨ë©ë‹ˆë‹¤.',
  ja: 'åºƒå‘Šã¨ Cookie ã«ã¤ã„ã¦ã¯ã€ã‚µã‚¤ãƒˆã§æœ‰åŠ¹ã«ãªã£ã¦ã„ã‚‹å ´åˆã® Google AdSense ã¾ãŸã¯é–¢é€£ã™ã‚‹åºƒå‘Šã‚µãƒ¼ãƒ“ã‚¹ã‚’å«ã‚ã€å®Œå…¨ãªãƒ—ãƒ©ã‚¤ãƒã‚·ãƒ¼ãƒãƒªã‚·ãƒ¼ã§èª¬æ˜Žã—ã¦ã„ã¾ã™ã€‚',
  'zh-CN': 'æœ‰å…³å¹¿å‘Šå’Œ Cookie çš„è¯´æ˜Žè¯·å‚é˜…å®Œæ•´çš„éšç§æ”¿ç­–ï¼Œå…¶ä¸­åŒ…æ‹¬ç½‘ç«™å¯ç”¨ Google AdSense æˆ–ç›¸å…³å¹¿å‘ŠæœåŠ¡æ—¶çš„ç›¸å…³å†…å®¹ã€‚',
  es: 'La PolÃ­tica de Privacidad completa explica la publicidad y las cookies, incluido Google AdSense o servicios publicitarios relacionados si estÃ¡n habilitados en el sitio.',
  de: 'Werbung und Cookies werden in der vollstÃ¤ndigen DatenschutzerklÃ¤rung erlÃ¤utert, einschlieÃŸlich Google AdSense oder verwandter Werbedienste, sofern sie auf der Website aktiviert sind.',
  fr: "La Politique de confidentialitÃ© complÃ¨te explique la publicitÃ© et les cookies, y compris Google AdSense ou les services publicitaires associÃ©s s'ils sont activÃ©s sur le site.",
  'pt-BR': 'A PolÃ­tica de Privacidade completa explica publicidade e cookies, incluindo o Google AdSense ou serviÃ§os de publicidade relacionados, caso estejam ativados no site.'
};
const baseUrl = 'https://superfasttool.com';

const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const localeUrl = code => code === 'en' ? `${baseUrl}/` : `${baseUrl}/${code}/`;
const localePath = code => code === 'en' ? '/' : `/${code}/`;

function alternateLinks() {
  const links = Object.keys(locales).map(code => `    <link rel="alternate" hreflang="${code}" href="${localeUrl(code)}">`);
  links.push(`    <link rel="alternate" hreflang="x-default" href="${localeUrl('en')}">`);
  return `<!-- SFT_HUB_I18N_ALTERNATES_START -->\n${links.join('\n')}\n    <!-- SFT_HUB_I18N_ALTERNATES_END -->`;
}

function languageControl(selectedCode) {
  const items = Object.entries(locales).map(([code, locale]) => {
    const selected = code === selectedCode;
    const classes = selected ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-700 hover:bg-zinc-100';
    return `<button type="button" role="menuitem" data-locale="${code}" aria-current="${selected}" class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors ${classes}"><span>${locale.label}</span><span class="text-[10px] ${selected ? 'text-orange-300' : 'text-zinc-300'}">${code.toUpperCase()}</span></button>`;
  }).join('');
  return `<div class="language-menu relative shrink-0" data-sft-language-control><button id="languageMenuButton" type="button" aria-haspopup="menu" aria-expanded="false" class="inline-flex min-w-[7.5rem] items-center justify-between gap-3 rounded-xl border border-zinc-900 bg-zinc-900 px-3 py-2 text-xs font-black text-white shadow-sm transition-colors hover:bg-zinc-700"><span>${locales[selectedCode].label}</span><span id="languageMenuChevron" aria-hidden="true" class="inline-flex h-4 w-4 shrink-0 items-center justify-center transition-transform"><span class="block h-1.5 w-1.5 -translate-y-px rotate-45 border-b-2 border-r-2 border-white"></span></span></button><div id="languageMenu" role="menu" class="absolute right-0 top-full z-[70] mt-2 hidden w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">${items}</div></div>`;
}

function tickerInteractionScript() {
  return `<script id="guideTickerInteraction">(()=>{
    const ticker=document.querySelector('.guide-ticker');
    const scrollArea=ticker?.querySelector('.guide-ticker-scroll');
    const track=ticker?.querySelector('.guide-ticker-track');
    const mobileToggle=ticker?.querySelector('.ticker-mobile-toggle');
    const moreButton=ticker?.querySelector('.ticker-more-button');
    if(!ticker||!scrollArea||!track)return;
    const animationSeconds=42;
    const desktopQuery=window.matchMedia('(hover: hover) and (pointer: fine)');
    const moreLabels={en:'More',ko:'\\uB354 \\uBCF4\\uAE30',ja:'\\u3082\\u3063\\u3068\\u898B\\u308B','zh-CN':'\\u67E5\\u770B\\u66F4\\u591A',es:'M\\u00E1s',de:'Mehr',fr:'Plus','pt-BR':'Mais'};
    let collapseTimer=0;
    const isBlocked=()=>document.body.classList.contains('info-panel-open');
    const loopDistance=()=>track.querySelector('.guide-ticker-link[aria-hidden="true"]')?.offsetTop||track.scrollHeight/2||1;
    const translateY=()=>{
      const transform=getComputedStyle(track).transform;
      if(!transform||transform==='none')return 0;
      if(window.DOMMatrixReadOnly)return new DOMMatrixReadOnly(transform).m42;
      const values=transform.match(/matrix(?:3d)?\\(([^)]+)\\)/)?.[1].split(',').map(Number);
      return values?.length===16?values[13]:(values?.[5]||0);
    };
    const automaticOffset=()=>{
      const distance=loopDistance();
      return ((-translateY()%distance)+distance)%distance;
    };
    const expand=()=>{
      if(isBlocked())return;
      clearTimeout(collapseTimer);
      if(ticker.classList.contains('is-expanded'))return;
      const offset=ticker.classList.contains('is-collapsing')?scrollArea.scrollTop:automaticOffset();
      ticker.classList.remove('is-collapsing');
      ticker.classList.add('is-expanded');
      scrollArea.scrollTop=offset;
    };
    const collapse=(force=false)=>{
      if(!force&&ticker.matches(':focus-within'))return;
      clearTimeout(collapseTimer);
      const offset=scrollArea.scrollTop;
      ticker.classList.remove('is-expanded');
      ticker.classList.add('is-collapsing');
      scrollArea.scrollTop=offset;
      collapseTimer=window.setTimeout(()=>{
        const distance=Math.max(track.scrollHeight,1);
        const progress=(((offset%distance)+distance)%distance)/distance;
        track.style.animationDelay=(-progress*animationSeconds).toFixed(4)+'s';
        scrollArea.scrollTop=0;
        ticker.classList.remove('is-collapsing');
      },240);
    };
    if(desktopQuery.matches){
      ticker.addEventListener('pointerenter',expand);
      ticker.addEventListener('pointerleave',collapse);
      ticker.addEventListener('focusin',expand);
      ticker.addEventListener('focusout',()=>window.setTimeout(()=>{if(!ticker.matches(':focus-within')&&!ticker.matches(':hover'))collapse()},0));
    }
    if(moreButton){
      const locale=document.documentElement.lang||'en';
      const label=moreLabels[locale]||moreLabels.en;
      const labelElement=moreButton.querySelector('.ticker-more-label');
      if(labelElement)labelElement.textContent=label;
      moreButton.setAttribute('aria-label',label);
      moreButton.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        const pending=Array.from(track.querySelectorAll('.guide-ticker-link[data-ticker-pending="true"]')).slice(0,10);
        pending.forEach(link=>link.removeAttribute('data-ticker-pending'));
        if(!track.querySelector('.guide-ticker-link[data-ticker-pending="true"]'))moreButton.hidden=true;
      });
    }
    if(mobileToggle){
      const setToggleState=expanded=>{
        mobileToggle.setAttribute('aria-expanded',String(expanded));
        mobileToggle.setAttribute('aria-label',expanded?'Collapse news list':'Expand news list');
      };
      const collapseMobile=()=>{
        if(!ticker.classList.contains('is-mobile-expanded'))return;
        const offset=scrollArea.scrollTop;
        const distance=Math.max(track.scrollHeight,1);
        const progress=(((offset%distance)+distance)%distance)/distance;
        track.style.animationDelay=(-progress*animationSeconds).toFixed(4)+'s';
        scrollArea.scrollTop=0;
        ticker.classList.remove('is-mobile-expanded');
        setToggleState(false);
      };
      mobileToggle.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        if(isBlocked())return;
        const expanded=ticker.classList.contains('is-mobile-expanded');
        if(expanded){
          collapseMobile();
        }else{
          const offset=automaticOffset();
          ticker.classList.add('is-mobile-expanded');
          scrollArea.scrollTop=offset;
          setToggleState(true);
        }
      });
      new MutationObserver(()=>{
        if(!isBlocked())return;
        if(ticker.classList.contains('is-expanded'))collapse(true);
        collapseMobile();
      }).observe(document.body,{attributes:true,attributeFilter:['class']});
    }else{
      new MutationObserver(()=>{
        if(isBlocked()&&ticker.classList.contains('is-expanded'))collapse(true);
      }).observe(document.body,{attributes:true,attributeFilter:['class']});
    }
  })();</script>`;
}

function navigationScript(code) {
  const urls = Object.fromEntries(Object.keys(locales).map(localeCode => [localeCode, localePath(localeCode)]));
  return `<script id="sftHubLocaleScript">window.SFT_LOCALE=${JSON.stringify(code)};window.SFT_LOCALE_URLS=${JSON.stringify(urls)};document.addEventListener('DOMContentLoaded',()=>{const button=document.getElementById('languageMenuButton');const menu=document.getElementById('languageMenu');const chevron=document.getElementById('languageMenuChevron');if(!button||!menu)return;const close=()=>{menu.classList.add('hidden');button.setAttribute('aria-expanded','false');chevron?.classList.remove('rotate-180')};button.addEventListener('click',event=>{event.stopPropagation();const opening=menu.classList.contains('hidden');menu.classList.toggle('hidden',!opening);button.setAttribute('aria-expanded',String(opening));chevron?.classList.toggle('rotate-180',opening)});menu.addEventListener('click',event=>{const item=event.target.closest('[data-locale]');if(!item)return;window.SFTLocale?.set(item.dataset.locale);const url=window.SFT_LOCALE_URLS[item.dataset.locale];if(url)location.assign(url)});document.addEventListener('click',event=>{if(!event.target.closest('.language-menu'))close()});document.addEventListener('keydown',event=>{if(event.key==='Escape')close()})});</script>`;
}

function prepareSource(source) {
  source = source.replaceAll(oldAdvertisingPrivacyText, advertisingPrivacyText);
  source = source.replace(/\n\s*\/\/ Multilingual translation system\.[\s\S]*?(?=\n\s*<\/script>)/, '');
  source = source.replace(/\s*function getBrowserLanguage\(\) \{[\s\S]*?(?=\n\s*const cardsGrid =)/, '\n');
  source = source.replace(/\n\s*const targetIds = \[[\s\S]*?\n\s*\];/, '');
  source = source.replace(/\n\s*const originalTexts = \{\};\s*\n\s*const translatedTexts = \{\};\s*\n\s*let isTranslated = true;/, '');
  source = source.replace(/\s*\[document\.querySelector\('#translateIcon img'\)\],/, '');
  source = source.replace(/\s*<!-- SFT_HUB_I18N_ALTERNATES_START -->[\s\S]*?<!-- SFT_HUB_I18N_ALTERNATES_END -->/g, '');
  source = source.replace(/(<link rel="canonical"[^>]+>)/, `$1\n    ${alternateLinks()}`);
  source = source.replace(/\s*<script src="\/locale-routing\.js"><\/script>/g, '');
  source = source.replace('<!-- SFT_HUB_I18N_ALTERNATES_END -->', '<!-- SFT_HUB_I18N_ALTERNATES_END -->\n    <script src="/locale-routing.js"></script>');
  let start = source.indexOf('<div class="language-menu relative shrink-0"');
  if (start < 0) start = source.indexOf('<div class="shrink-0 flex items-center gap-2 bg-gray-100/90');
  const marker = '        </div>\n    </header>';
  const end = source.indexOf(marker, start);
  if (start < 0 || end < 0) throw new Error('Missing hub language control');
  source = source.slice(0, start) + languageControl('en') + '\n' + source.slice(end);
  source = source.replace(/\s*<script id="guideTickerInteraction">[\s\S]*?<\/script>/g, '');
  source = source.replace(/\s*<script id="sftHubLocaleScript">[\s\S]*?<\/script>/g, '');
  source = source.replace('</body>', `${tickerInteractionScript()}\n${navigationScript('en')}\n</body>`);
  source = source.replace(/\s*const localizedSlugs = new Set\([^;]+;\s*const localePrefix = [^;]+;\s*fadeToUrl\(`\$\{localePrefix\}\/\$\{slug\}\/`\);/, '\n            fadeToUrl(window.SFTLocale?.pathFor(window.SFTLocale.get(), `/${slug}/`) || `/${slug}/`);');
  source = source.replace('            fadeToUrl(`/${slug}/`);', '            fadeToUrl(window.SFTLocale?.pathFor(window.SFTLocale.get(), `/${slug}/`) || `/${slug}/`);');
  source = source.replace(/\.form-status,\s*#form-status(?:,\s*\[data-form-status\])?\s*\{\s*display:\s*none;\s*\}/, '.form-status,\n        #form-status,\n        [data-form-status] { display: none; }');
  source = source.replace(/\.form-status\.show,\s*#form-status\.show(?:,\s*\[data-form-status\]\.show)?\s*\{\s*display:\s*block;\s*\}/, '.form-status.show,\n        #form-status.show,\n        [data-form-status].show { display: block; }');
  source = source.replace(/\s*contactSentMessage\.textContent\s*=\s*contactSentMessage\.dataset\.successLabel\s*\|\|\s*'Sent';/g, '');
  source = source.replace("contactSentMessage.classList.add('show');", "contactSentMessage.textContent = contactSentMessage.dataset.successLabel || 'Sent';\n                    contactSentMessage.classList.add('show');");
  return source.replace(/v1\.2\.\d+/g, version).replace(/[ \t]+$/gm, '');
}

function localize(source, code, locale) {
  let output = source;
  const url = localeUrl(code);
  output = output.replace(/<html lang="[^"]+">/, `<html lang="${code}">`);
  output = output.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(locale.title)}</title>`);
  output = output.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(locale.meta)}">`);
  output = output.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  output = output.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  output = output.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(locale.title)}">`);
  output = output.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(locale.meta)}">`);
  output = output.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeHtml(locale.title)}">`);
  output = output.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeHtml(locale.meta)}">`);
  output = output.replace(/(<span id="heroTitle1"[^>]*>)[\s\S]*?(<\/span>\s*<span id="heroTitle2")/, `$1<span class="hero-action-word text-zinc-900">${locale.actions[0]}</span><span class="hero-action-word text-zinc-600">, ${locale.actions[1]}</span><span class="hero-action-word text-zinc-400">, ${locale.actions[2]}</span>$2`);
  output = output.replace(/(<div class="guide-ticker[^>]*aria-label=")[^"]*(")/, `$1${locale.latest}$2`);
  output = output.replace(/(<input id="toolSearchInput"[^>]*placeholder=")[^"]*(")/, `$1${locale.search}$2`);
  const ids = ['categoryStarred','categoryAll','categoryGenerator','categoryCalculator','categoryConverter','categoryImage','categoryVideo','categoryAudio','categoryGame'];
  ids.forEach((id, index) => { output = output.replace(new RegExp(`(<span id="${id}">)[^<]*(<\\/span>)`), `$1${locale.categories[index]}$2`); });
  output = output.replace(/(<span id="footerAbout">)[^<]*(<\/span>)/, `$1${locale.about}$2`);
  output = output.replace(/(<span id="footerPolicy">)[^<]*(<\/span>)/, `$1${locale.policy}$2`);
  output = output.replace(/(<span id="footerContact">)[^<]*(<\/span>)/, `$1${locale.contact}$2`);
  const sentLabel = toolI18nConfigs[0]?.locales?.[code]?.sent || 'Sent';
  output = output.replace(/<div id="contactSentMessage"([^>]*)>[\s\S]*?<\/div>/, (match, attributes) => {
    const cleanAttributes = attributes
      .replace(/\s+data-form-status(?:="[^"]*")?/g, '')
      .replace(/\s+data-success-label="[^"]*"/g, '');
    return `<div id="contactSentMessage" data-form-status data-success-label="${escapeHtml(sentLabel)}"${cleanAttributes}></div>`;
  });
  output = output.replace(contactPrivacyText, locale.privacyContact);
  output = output.replaceAll(advertisingPrivacyText, advertisingPrivacyTranslations[code] || advertisingPrivacyText);
  if (code !== 'en') {
    const translationsByCardId = Object.fromEntries(toolI18nConfigs.map(config => {
      const english = config.locales.en;
      const translated = config.locales[code];
      if (!english || !translated) return [config.cardId, {}];
      if (config.mode === 'auto') return [config.cardId, translated.translations || {}];
      const translations = {
        [english.title]: translated.title,
        [english.short]: translated.short
      };
      for (const replacement of config.replacements || []) {
        if (english[replacement.key] && translated[replacement.key]) {
          translations[english[replacement.key]] = translated[replacement.key];
        }
      }
      return [config.cardId, translations];
    }));
    output = applyCardTranslationMaps(output, translationsByCardId);
  }
  output = output.replace(/(<section class="mx-auto mt-8 max-w-4xl[^>]*>\s*<h2[^>]*>)[^<]*(<\/h2>)/, `$1${locale.terms}$2`);
  output = output.replace(/function getBrowserLanguage\(\) \{[\s\S]*?\n        \}/, `function getBrowserLanguage() {\n            return ${JSON.stringify(code)};\n        }`);
  output = output.replace(/<div class="language-menu relative shrink-0" data-sft-language-control>[\s\S]*?<\/div><\/div>/, languageControl(code));
  output = output.replace(/<script id="sftHubLocaleScript">[\s\S]*?<\/script>/, navigationScript(code));
  if (code !== 'en') output = output.replaceAll('src="./', 'src="/').replaceAll('href="./favicon.svg"', 'href="/favicon.svg"');
  return output.replace(/[ \t]+$/gm, '');
}

function updateSitemap() {
  const sitemapPath = path.join(root, 'sitemap.xml');
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  sitemap = sitemap.replace(/\s*<!-- SFT_HUB_I18N_START -->[\s\S]*?<!-- SFT_HUB_I18N_END -->/g, '');
  const entries = Object.keys(locales).filter(code => code !== 'en').map(code => `  <url><loc>${localeUrl(code)}</loc><lastmod>2026-07-03</lastmod></url>`).join('\n');
  sitemap = sitemap.replace('</urlset>', `  <!-- SFT_HUB_I18N_START -->\n${entries}\n  <!-- SFT_HUB_I18N_END -->\n</urlset>`);
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
}

const source = prepareSource(fs.readFileSync(englishPath, 'utf8').replaceAll('\r\n', '\n'));
const guideSlugs = toolI18nConfigs.filter(config => config.guideHref).map(config => config.slug === 'stock-crypto-avg-cost-calculator' ? 'how-to-calculate-average-stock-cost' : config.slug);
buildLocaleRouting(root, toolI18nConfigs.map(config => config.slug), { guideSlugs });
for (const [code, locale] of Object.entries(locales)) {
  const destination = code === 'en' ? englishPath : path.join(root, code, 'index.html');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, localize(source, code, locale), 'utf8');
}
updateSitemap();
console.log(`Built ${Object.keys(locales).length} localized hub pages.`);
