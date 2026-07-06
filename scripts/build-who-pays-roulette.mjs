import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const slug = 'who-pays-roulette';
const title = 'Who Pays? Roulette';
const meta = 'Enter names, spin a slot-machine-style roulette, and let chance decide who pays. Names stay in your browser.';
const destination = path.join(root, slug, 'index.html');
let source = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replaceAll('\r\n', '\n');

// Tool pages live one directory below the hub, so root-load shared assets.
source = source.replaceAll('src="./', 'src="/').replace('href="./favicon.svg"', 'href="/favicon.svg"');

source = source.replace(/<title>[^<]*<\/title>/, `<title>${title} | Super Fast Tool</title>`);
source = source.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${meta}">`);
source = source.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="https://superfasttool.com/${slug}/">`);
source = source.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="https://superfasttool.com/${slug}/">`);
source = source.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title} | Super Fast Tool">`);
source = source.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${meta}">`);
source = source.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${title} | Super Fast Tool">`);
source = source.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${meta}">`);
source = source.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: title,
  url: `https://superfasttool.com/${slug}/`,
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Any',
  description: meta,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Browser-local name roulette', 'Slot-machine reveal', 'Saved name list', 'Celebration animation']
}, null, 4)}\n    </script>`);

const guide = `<section class="tool-guide mx-auto mt-8 max-w-4xl text-left text-xs leading-6 text-zinc-400"><h2 class="mb-4 text-center text-sm font-black text-zinc-500">${title}</h2><div class="mb-4 text-center"><a href="/guides/${slug}/" class="tool-guide-link inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:border-zinc-700 hover:bg-zinc-700"><span aria-hidden="true">&#128214;</span>Guide</a></div><p>Who Pays? Roulette is a playful browser-based name picker that reveals one person with a slot-machine animation. Enter two or more names, spin, and use the result to settle a casual group decision.</p><p class="mt-3">Edit the name list directly to start a new group. The current list is saved only when you press Spin, so simply typing does not overwrite the previously saved list.</p><p class="mt-3">The saved name list stays in this browser and is restored when you return. The list is not sent to a Super Fast Tool server, and clearing browser storage removes it.</p><p class="mt-3">The result is random and intended for lighthearted decisions. Everyone involved should agree to the rules before spinning, especially when money or responsibilities are involved.</p></section>`;
source = source.replace(/<section class="[^\"]*\bmax-w-4xl\b[^\"]*\btext-left\b[^\"]*">[\s\S]*?<\/section>/, guide);
source = source.replace(/(<script type="text\/javascript">)/, `<script>window.SFT_TOOL_PAGE = { cardId: "whoPaysCard", slug: "${slug}", title: "${title}" };</script>\n    $1`);
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, source, 'utf8');
console.log(`Built ${destination}`);
