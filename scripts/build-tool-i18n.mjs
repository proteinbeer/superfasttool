import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildToolI18n } from './tool-i18n-builder.mjs';
import { toolI18nConfigs } from './tool-i18n.config.mjs';
import { buildLocaleRouting } from './locale-routing-builder.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const requested = args.filter(arg => !arg.startsWith('--'));
const configs = requested.length
  ? toolI18nConfigs.filter(config => requested.includes(config.slug))
  : toolI18nConfigs;

if (requested.length && configs.length !== requested.length) {
  const known = new Set(configs.map(config => config.slug));
  const missing = requested.filter(slug => !known.has(slug));
  throw new Error(`Unknown localized tool: ${missing.join(', ')}`);
}

const guideSlugs = toolI18nConfigs.filter(config => config.guideHref).map(config => config.slug === 'stock-crypto-avg-cost-calculator' ? 'how-to-calculate-average-stock-cost' : config.slug);
const routing = buildLocaleRouting(root, toolI18nConfigs.map(config => config.slug), { write: !checkOnly, guideSlugs });
console.log(`${checkOnly ? 'Checked' : 'Built'} locale routing (${routing.changed ? 'changed' : 'unchanged'}).`);

for (const config of configs) {
  const result = buildToolI18n(root, config, { write: !checkOnly });
  console.log(`${checkOnly ? 'Checked' : 'Built'} ${result.pages} ${config.slug} pages (${result.changed} changed).`);
}
