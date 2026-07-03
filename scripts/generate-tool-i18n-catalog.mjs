import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverToolPages } from './auto-tool-i18n.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const catalogPath = path.join(here, 'tool-i18n.catalog.json');
const languageCodes = ['ko', 'ja', 'zh-CN', 'es', 'de', 'fr', 'pt-BR'];
const manualSlugs = ['fantasy-person-name-generator', 'fantasy-place-name-generator'];
const scanOnly = process.argv.includes('--scan');
const localeArgument = process.argv.find(argument => argument.startsWith('--locale='));
const selectedLanguageCodes = localeArgument ? [localeArgument.split('=')[1]] : languageCodes;
if (selectedLanguageCodes.some(code => !languageCodes.includes(code))) throw new Error(`Unsupported locale: ${selectedLanguageCodes.join(', ')}`);
const tools = discoverToolPages(root, manualSlugs);
const uniqueStrings = [...new Set(tools.flatMap(tool => tool.strings))].sort();

let catalog = { version: 1, generatedAt: null, tools: {}, translations: {} };
if (fs.existsSync(catalogPath)) catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
catalog.tools = Object.fromEntries(tools.map(tool => [tool.slug, tool]));

console.log(`Discovered ${tools.length} automatic tool pages with ${uniqueStrings.length} unique English strings.`);
if (scanOnly) process.exit(0);

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

function batches(values) {
  const output = [];
  let batch = [];
  let length = 0;
  for (const value of values) {
    const addition = value.length + 24;
    if (batch.length >= 18 || length + addition > 2800) {
      output.push(batch);
      batch = [];
      length = 0;
    }
    batch.push(value);
    length += addition;
  }
  if (batch.length) output.push(batch);
  return output;
}

async function translateBatch(values, targetCode) {
  const query = values.map((value, index) => `__SFT_${index}__ ${value}`).join('\n');
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetCode)}&dt=t&q=${encodeURIComponent(query)}`;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'SuperFastTool-Static-I18n/1.0' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const translated = data[0].map(part => part[0]).join('');
      const matches = [...translated.matchAll(/__SFT_(\d+)__\s*([\s\S]*?)(?=__SFT_\d+__|$)/g)];
      const results = Array(values.length);
      for (const match of matches) results[Number(match[1])] = match[2].trim();
      if (results.some(value => !value)) throw new Error(`Expected ${values.length} translations, received ${matches.length}`);
      return results;
    } catch (error) {
      lastError = error;
      await sleep(500 * attempt);
    }
  }
  throw lastError;
}

async function translateSingle(value, targetCode) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetCode)}&dt=t&q=${encodeURIComponent(value)}`;
  const response = await fetch(url, { headers: { 'User-Agent': 'SuperFastTool-Static-I18n/1.0' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return data[0].map(part => part[0]).join('').trim() || value;
}

async function translateValues(values, targetCode) {
  try {
    return await translateBatch(values, targetCode);
  } catch (error) {
    if (values.length === 1) return [await translateSingle(values[0], targetCode)];
    const middle = Math.ceil(values.length / 2);
    const left = await translateValues(values.slice(0, middle), targetCode);
    const right = await translateValues(values.slice(middle), targetCode);
    return [...left, ...right];
  }
}

for (const code of selectedLanguageCodes) {
  const translations = catalog.translations[code] || {};
  const missing = uniqueStrings.filter(value => !translations[value]);
  const pendingBatches = batches(missing);
  console.log(`${code}: ${missing.length} missing strings in ${pendingBatches.length} batches.`);
  for (let index = 0; index < pendingBatches.length; index += 1) {
    const batch = pendingBatches[index];
    const results = await translateValues(batch, code);
    batch.forEach((source, itemIndex) => { translations[source] = results[itemIndex]; });
    if ((index + 1) % 10 === 0 || index + 1 === pendingBatches.length) console.log(`${code}: ${index + 1}/${pendingBatches.length}`);
    await sleep(120);
  }
  catalog.translations[code] = translations;
  catalog.generatedAt = new Date().toISOString();
  fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
}

console.log(`Saved ${catalogPath}.`);
