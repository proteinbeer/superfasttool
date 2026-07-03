import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildToolI18n } from './tool-i18n-builder.mjs';
import { getToolI18nConfig } from './tool-i18n.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = buildToolI18n(root, getToolI18nConfig('fantasy-person-name-generator'));
console.log(`Built ${result.pages} localized fantasy-person-name-generator pages.`);
