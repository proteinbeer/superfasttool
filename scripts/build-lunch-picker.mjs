import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const slug = 'lunch-picker';
const title = 'Lunch Picker';
const description = "Spin a lunch slot machine, customize the menu list, exclude unavailable choices, and let chance choose today's meal.";
const version = 'v1.2.453';

function replaceRequired(source, pattern, replacement, label) {
  pattern.lastIndex = 0;
  if (!pattern.test(source)) throw new Error(`Missing ${label}`);
  pattern.lastIndex = 0;
  return source.replace(pattern, replacement);
}

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function headerSubtitle(value) {
  const letters = [...`- ${value}`].map(character => `<span class="logo-sub-letter">${character === ' ' ? '&nbsp;' : escapeHtml(character)}</span>`).join('');
  return `<span id="headerToolName" class="logo-sub-name text-zinc-400 font-black truncate max-w-[12rem] sm:max-w-xs" aria-label="${escapeHtml(value)}">${letters}</span>`;
}

function languageControl() {
  return '<div class="language-menu relative shrink-0" data-sft-language-control><button id="languageMenuButton" type="button" aria-haspopup="menu" aria-expanded="false" class="inline-flex min-w-[7.5rem] items-center justify-between gap-3 rounded-xl border border-zinc-900 bg-zinc-900 px-3 py-2 text-xs font-black text-white shadow-sm transition-colors hover:bg-zinc-700"><span>English</span><span id="languageMenuChevron" aria-hidden="true" class="inline-flex h-4 w-4 shrink-0 items-center justify-center transition-transform"><span class="block h-1.5 w-1.5 -translate-y-px rotate-45 border-b-2 border-r-2 border-white"></span></span></button><div id="languageMenu" role="menu" class="absolute right-0 top-full z-[70] mt-2 hidden w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl"><button type="button" role="menuitem" data-locale="en" aria-current="true" class="flex w-full items-center justify-between rounded-lg bg-zinc-900 px-3 py-2 text-left text-xs font-bold text-white"><span>English</span><span class="text-[10px] text-orange-300">EN</span></button></div></div>';
}

function buildToolPage() {
  let output = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replaceAll('\r\n', '\n');
  const url = `https://superfasttool.com/${slug}/`;
  output = output.replace(/<title>[^<]*<\/title>/, `<title>${title} | Super Fast Tool</title>`);
  output = output.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`);
  output = output.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  output = output.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  output = output.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title} | Super Fast Tool">`);
  output = output.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`);
  output = output.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${title} | Super Fast Tool">`);
  output = output.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${description}">`);
  output = output.replace(/\s*<link rel="prefetch"[^>]+>/g, '');
  output = output.replace('href="./favicon.svg"', 'href="../favicon.svg"');
  output = replaceRequired(output, /\s*<!-- SFT_HUB_I18N_ALTERNATES_START -->[\s\S]*?<!-- SFT_HUB_I18N_ALTERNATES_END -->/, `\n    <!-- SFT_I18N_ALTERNATES_START -->\n    <link rel="alternate" hreflang="en" href="${url}">\n    <link rel="alternate" hreflang="x-default" href="${url}">\n    <!-- SFT_I18N_ALTERNATES_END -->`, 'alternate links');
  output = replaceRequired(output, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (match, json) => {
    const data = JSON.parse(json);
    data.name = title;
    data.url = url;
    data.description = description;
    data.featureList = ['Preset lunch menus', 'Custom lunch options', 'Excluded choices', 'Recent winner avoidance', 'Slot machine animation'];
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 4)}\n    </script>`;
  }, 'structured data');
  output = output.replace(/<body class="[^"]*">/, '<body class="tool-page page-transitions-disabled bg-tech-grid text-zinc-900 min-h-screen font-sans flex flex-col relative tool-page-ready">');
  output = replaceRequired(output, /<span id="headerToolName"[^>]*><\/span>/, headerSubtitle(title), 'header subtitle');
  output = replaceRequired(output, /<div class="language-menu relative shrink-0" data-sft-language-control>[\s\S]*?<\/div><\/div>/, languageControl(), 'language control');
  output = replaceRequired(output, /<\/head>/, `<style id="sft-tool-critical-open">body.tool-page #cardsGrid > .expandable-card:not(#lunchPickerCard),body.tool-page #cardsGrid > .temp-card,body.tool-page #cardsGrid > .card-placeholder{display:none!important}body.tool-page #cardsGrid{visibility:visible!important;min-height:0}</style>\n</head>`, 'head');
  output = replaceRequired(output, /(<div id="lunchPickerCard"[^>]*class=")([^"]*)(">)/, (match, start, classes, end) => `${start}${classes} tool-page-panel is-expanded active-panel shadow-2xl border-zinc-400${end}`, 'lunch card');
  output = replaceRequired(output, /(<div id="lunchPickerCard"[\s\S]*?<div class="calculator-content )hidden opacity-0 translate-y-2 ([^"]*">)/, '$1$2', 'lunch content');
  output = output.replace('<div id="toolBackHome" class="hidden mt-8 flex justify-center">', '<div id="toolBackHome" class="mt-8 flex justify-center">');
  const information = `<section class="mx-auto mt-8 max-w-4xl text-left text-xs leading-6 text-zinc-400"><h2 class="mb-4 text-center text-sm font-black text-zinc-500">${title}</h2><div class="mb-4 text-center"><a href="/guides/${slug}/" class="tool-guide-link inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:border-zinc-700 hover:bg-zinc-700"><span aria-hidden="true">&#128214;</span>Guide</a></div><p>Lunch Picker is a browser-based meal decision tool with a slot-machine-style reveal. Choose a preset menu or enter your own lunch options, then spin to select one available meal at random.</p><p class="mt-3">Use the exclusion list for sold-out restaurants, dietary conflicts, meals you already had, or anything that is unavailable today. The recent-winner option temporarily favors variety by avoiding the last few results whenever another choice remains.</p><p class="mt-3">Your custom menu, exclusions, preference, and recent results are stored locally in this browser. The tool does not send the lunch list to a Super Fast Tool server, and clearing browser storage removes the saved choices.</p><p class="mt-3">The result is a casual suggestion rather than nutrition or allergy advice. Check ingredients, dietary needs, price, restaurant hours, and availability before ordering or preparing a meal.</p></section>`;
  output = replaceRequired(output, /<section class="mx-auto mt-8 max-w-4xl text-left text-xs leading-6 text-zinc-400">[\s\S]*?<\/section>/, information, 'tool information');
  output = replaceRequired(output, /\s*<script src="\.\/stock-crypto-avg-cost-calculator\.js"><\/script>[\s\S]*?<script src="\.\/game-tools\.js"><\/script>/, '\n    <script src="/lunch-picker-food-additions.js"></script>\n    <script src="/lunch-picker-photo-map.js"></script>\n    <script src="/lunch-picker-foods.js"></script>\n    <script src="/generators.js?v=1.2.440"></script>', 'tool scripts');
  output = replaceRequired(output, /(<script type="text\/javascript">)/, `<script>window.SFT_TOOL_PAGE = { cardId: "lunchPickerCard", slug: "${slug}", title: "${title}" };</script>\n    $1`, 'tool page config');
  output = output.replace(/<script id="sftHubLocaleScript">[\s\S]*?<\/script>/, '<script>window.SFT_LOCALE="en";window.SFT_LOCALE_URLS={"en":"/lunch-picker/"};window.SFT_I18N={"addStar":"Add to Starred","removeStar":"Remove from Starred"};</script>');
  output = output.replace(/v1\.2\.\d+/g, version);
  const destination = path.join(root, slug);
  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(path.join(destination, 'index.html'), output.replace(/[ \t]+$/gm, ''));
}

function buildGuide() {
  let guide = fs.readFileSync(path.join(root, 'guides', 'username-generator', 'index.html'), 'utf8').replaceAll('\r\n', '\n');
  guide = guide.replaceAll('username-generator', slug).replaceAll('Username Generator', title);
  guide = guide.replaceAll('Create quick username ideas for games, apps, and profiles.', "Spin a lunch slot machine and let chance choose today's meal.");
  guide = guide.replace(/(<section><h2>What the tool does<\/h2><p>)[\s\S]*?(<\/p>)/, '$1A lunch picker selects one item from the available menu list. With uniform random selection, every remaining option has the same chance of being chosen.$2');
  guide = guide.replace(/(<section><h2>Practical example<\/h2><p>)[\s\S]*?(<\/p>)/, '$1Choose a preset or enter one meal per line, exclude anything unavailable, and spin. Enabling recent-winner avoidance helps vary several lunches without permanently removing an option.$2');
  guide = guide.replace(/(<section><h2>Accuracy and limitations<\/h2><p>)[\s\S]*?(<\/p>)/, '$1The result is a suggestion, not a dietary recommendation. Check allergies, ingredients, nutrition needs, opening hours, price, and availability before ordering.$2');
  guide = guide.replace(/v1\.2\.\d+/g, version);
  const destination = path.join(root, 'guides', slug);
  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(path.join(destination, 'index.html'), guide);
}

buildToolPage();
buildGuide();
console.log(`Built ${title} tool and guide pages.`);
