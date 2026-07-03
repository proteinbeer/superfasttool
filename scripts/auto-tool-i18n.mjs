import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';

const translatableAttributes = new Set(['placeholder', 'aria-label', 'title']);

function getAttribute(node, name) {
  return node.attrs?.find(attribute => attribute.name === name)?.value;
}

function hasClass(node, className) {
  return (getAttribute(node, 'class') || '').split(/\s+/).includes(className);
}

function walk(node, visit, blocked = false) {
  const nextBlocked = blocked || node.nodeName === 'script' || node.nodeName === 'style' || node.nodeName === 'svg';
  visit(node, nextBlocked);
  for (const child of node.childNodes || []) walk(child, visit, nextBlocked);
  if (node.content) walk(node.content, visit, nextBlocked);
}

function findNode(root, predicate) {
  let found;
  walk(root, node => {
    if (!found && predicate(node)) found = node;
  });
  return found;
}

function normalizedText(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function isTranslatable(value) {
  const text = normalizedText(value);
  if (text.length < 2 || text.length > 1200 || !/[A-Za-z]/.test(text)) return false;
  if (/^https?:\/\//i.test(text) || /^[-+]?\d+(?:[.,:/-]\d+)*\s*%?$/.test(text)) return false;
  return true;
}

function scopeNodes(document, cardId) {
  const scopes = [];
  const add = node => {
    if (node && !scopes.includes(node)) scopes.push(node);
  };
  add(findNode(document, node => getAttribute(node, 'id') === cardId));
  add(findNode(document, node => getAttribute(node, 'id') === 'toolBackHome'));
  add(findNode(document, node => getAttribute(node, 'id') === 'infoPanel'));
  add(findNode(document, node => node.tagName === 'footer'));
  add(findNode(document, node => node.tagName === 'section' && hasClass(node, 'max-w-4xl') && hasClass(node, 'leading-6')));
  return scopes;
}

export function extractTranslatableStrings(source, cardId) {
  const document = parse(source, { sourceCodeLocationInfo: true });
  const values = new Set();
  const seen = new Set();
  for (const scope of scopeNodes(document, cardId)) {
    walk(scope, (node, blocked) => {
      if (blocked || seen.has(node)) return;
      seen.add(node);
      if (node.nodeName === '#text' && isTranslatable(node.value)) values.add(normalizedText(node.value));
      for (const attribute of node.attrs || []) {
        if (translatableAttributes.has(attribute.name) && isTranslatable(attribute.value)) values.add(normalizedText(attribute.value));
      }
    });
  }
  return [...values];
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', '&quot;');
}

export function applyTranslationMap(source, cardId, translations) {
  const document = parse(source, { sourceCodeLocationInfo: true });
  const replacements = new Map();
  const seen = new Set();
  for (const scope of scopeNodes(document, cardId)) {
    walk(scope, (node, blocked) => {
      if (blocked || seen.has(node)) return;
      seen.add(node);
      if (node.nodeName === '#text' && node.sourceCodeLocation) {
        const key = normalizedText(node.value);
        const translated = translations[key];
        if (translated && translated !== key) {
          const { startOffset, endOffset } = node.sourceCodeLocation;
          const raw = source.slice(startOffset, endOffset);
          const leading = raw.match(/^\s*/)?.[0] || '';
          const trailing = raw.match(/\s*$/)?.[0] || '';
          replacements.set(`${startOffset}:${endOffset}`, { startOffset, endOffset, value: `${leading}${escapeHtml(translated)}${trailing}` });
        }
      }
      for (const attribute of node.attrs || []) {
        if (!translatableAttributes.has(attribute.name)) continue;
        const key = normalizedText(attribute.value);
        const translated = translations[key];
        const location = node.sourceCodeLocation?.attrs?.[attribute.name];
        if (translated && translated !== key && location) {
          replacements.set(`${location.startOffset}:${location.endOffset}`, {
            startOffset: location.startOffset,
            endOffset: location.endOffset,
            value: `${attribute.name}="${escapeAttribute(translated)}"`
          });
        }
      }
    });
  }
  return [...replacements.values()]
    .sort((a, b) => b.startOffset - a.startOffset)
    .reduce((output, replacement) => output.slice(0, replacement.startOffset) + replacement.value + output.slice(replacement.endOffset), source);
}

export function applyCardTranslationMaps(source, translationsByCardId) {
  const document = parse(source, { sourceCodeLocationInfo: true });
  const replacements = new Map();

  for (const [cardId, translations] of Object.entries(translationsByCardId)) {
    if (!translations || !Object.keys(translations).length) continue;
    const card = findNode(document, node => getAttribute(node, 'id') === cardId);
    if (!card) continue;

    walk(card, (node, blocked) => {
      if (blocked) return;
      if (node.nodeName === '#text' && node.sourceCodeLocation) {
        const key = normalizedText(node.value);
        const translated = translations[key];
        if (translated && translated !== key) {
          const { startOffset, endOffset } = node.sourceCodeLocation;
          const raw = source.slice(startOffset, endOffset);
          const leading = raw.match(/^\s*/)?.[0] || '';
          const trailing = raw.match(/\s*$/)?.[0] || '';
          replacements.set(`${startOffset}:${endOffset}`, {
            startOffset,
            endOffset,
            value: `${leading}${escapeHtml(translated)}${trailing}`
          });
        }
      }

      for (const attribute of node.attrs || []) {
        if (!translatableAttributes.has(attribute.name)) continue;
        const key = normalizedText(attribute.value);
        const translated = translations[key];
        const location = node.sourceCodeLocation?.attrs?.[attribute.name];
        if (translated && translated !== key && location) {
          replacements.set(`${location.startOffset}:${location.endOffset}`, {
            startOffset: location.startOffset,
            endOffset: location.endOffset,
            value: `${attribute.name}="${escapeAttribute(translated)}"`
          });
        }
      }
    });
  }

  return [...replacements.values()]
    .sort((a, b) => b.startOffset - a.startOffset)
    .reduce((output, replacement) => output.slice(0, replacement.startOffset) + replacement.value + output.slice(replacement.endOffset), source);
}

export function discoverToolPages(root, excludedSlugs = []) {
  const excluded = new Set(excludedSlugs);
  const tools = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'doxx-click') continue;
    const indexPath = path.join(root, entry.name, 'index.html');
    if (!fs.existsSync(indexPath)) continue;
    const source = fs.readFileSync(indexPath, 'utf8').replaceAll('\r\n', '\n');
    const configMatch = source.match(/window\.SFT_TOOL_PAGE = \{ cardId: "([^"]+)", slug: "([^"]+)", title: "([^"]+)" \}/);
    if (!configMatch) continue;
    const [, cardId, slug, title] = configMatch;
    if (excluded.has(slug)) continue;
    const meta = source.match(/<meta name="description" content="([^"]*)">/)?.[1] || '';
    const guideHref = source.match(/<a href="([^"]+)" class="tool-guide-link/)?.[1] || `/guides/${slug}/`;
    const strings = extractTranslatableStrings(source, cardId);
    for (const value of [title, meta]) if (value && !strings.includes(value)) strings.push(value);
    tools.push({ slug, cardId, title, meta, guideHref, strings });
  }
  return tools.sort((a, b) => a.slug.localeCompare(b.slug));
}
