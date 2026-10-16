import { parse } from 'parse5';
import { messages } from '../js/locales.mjs';

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// Annotate authored HTML at build time; the browser only resolves stable keys.
export function localizeMarkup(html, namespace) {
  const catalog = new Map();
  for (const [key, [zh, en, source = zh]] of Object.entries(messages)) {
    if (key.startsWith(namespace + '.') || key.startsWith('common.')) catalog.set(source, { key, zh });
  }
  const edits = [];
  const insert = (offset, value) => edits.push({ start: offset, end: offset, value });
  function visit(node) {
    const attrs = Object.fromEntries((node.attrs || []).map(attr => [attr.name, attr.value]));
    const loc = node.sourceCodeLocation;
    if (['script', 'style', 'pre', 'code', 'svg'].includes(node.tagName) || 'data-project-content' in attrs || 'data-language-picker' in attrs) return;
    if (loc?.startTag) {
      let annotations = '';
      for (const name of ['aria-label', 'title', 'alt', 'placeholder', 'content']) {
        if (name === 'content' && node.tagName !== 'meta') continue;
        const existingKey = attrs[`data-i18n-${name}`];
        const match = existingKey ? { key: existingKey, zh: messages[existingKey]?.[0] } : catalog.get(attrs[name]);
        if (!match) continue;
        if (!match.zh) throw new Error(`Missing translation: ${existingKey}`);
        const attribute = loc.attrs[name];
        if (!attribute) continue;
        edits.push({ start: attribute.startOffset, end: attribute.endOffset, value: `${name}="${escape(match.zh)}"` });
        if (!existingKey) annotations += ` data-i18n-${name}="${match.key}"`;
      }
      if (annotations) insert(loc.startTag.endOffset - 1, annotations);
    }
    if ('data-i18n' in attrs) {
      const message = messages[attrs['data-i18n']]?.[0];
      if (!message) throw new Error(`Missing translation: ${attrs['data-i18n']}`);
      if (loc?.endTag) {
        const vars = JSON.parse(attrs['data-i18n-vars'] || '{}');
        const value = message.replace(/\{(\w+)\}/g, (match, name) => String(vars[name] ?? match));
        const original = html.slice(loc.startTag.endOffset, loc.endTag.startOffset);
        edits.push({ start: loc.startTag.endOffset, end: loc.endTag.startOffset, value: original.match(/^\s*/)[0] + escape(value) + original.match(/\s*$/)[0] });
      }
      return;
    }
    const children = node.childNodes || [];
    const texts = children.filter(child => child.nodeName === '#text' && child.value.trim());
    for (const child of children) {
      if (child.nodeName !== '#text') { visit(child); continue; }
      const source = child.value.trim();
      const match = catalog.get(source);
      const textLoc = child.sourceCodeLocation;
      if (!match || !textLoc || !loc?.startTag) continue;
      const onlyText = texts.length === 1 && !children.some(child => child.tagName);
      const leading = child.value.match(/^\s*/)[0];
      const trailing = child.value.match(/\s*$/)[0];
      const value = onlyText ? escape(match.zh) : `<l10n-text data-i18n="${match.key}">${escape(match.zh)}</l10n-text>`;
      edits.push({ start: textLoc.startOffset, end: textLoc.endOffset, value: leading + value + trailing });
      if (onlyText) insert(loc.startTag.endOffset - 1, ` data-i18n="${match.key}"`);
    }
  }
  visit(parse(html, { sourceCodeLocationInfo: true }));
  for (const edit of edits.sort((a, b) => b.start - a.start)) html = html.slice(0, edit.start) + edit.value + html.slice(edit.end);
  return html;
}

export const languagePicker = (extraClass = '') => `<div class="language-picker ${extraClass}" data-language-picker role="group" aria-label="选择语言" data-i18n-aria-label="language.label" hidden><button type="button" data-language="zh" lang="zh-CN" aria-pressed="true">中文</button><button type="button" data-language="en" lang="en" aria-pressed="false">EN</button></div>`;
