import { messages } from './locales.mjs';

const storageKey = 'charles-language';
const valid = value => value === 'zh' || value === 'en';
const readSaved = () => { try { return localStorage.getItem(storageKey); } catch { return null; } };
const queryLanguage = () => new URL(location.href).searchParams.get('lang');
let language = [queryLanguage(), readSaved(), 'zh'].find(valid);
document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
const attributes = ['aria-label', 'title', 'alt', 'placeholder', 'content'];

function t(key, vars = {}) {
  const message = messages[key]?.[language === 'en' ? 1 : 0] ?? key;
  return message.replace(/\{(\w+)\}/g, (match, name) => String(vars[name] ?? match));
}
function translate(root = document) {
  const selector = ['[data-i18n]', ...attributes.map(name => `[data-i18n-${name}]`)].join(',');
  const elements = [...root.querySelectorAll(selector)];
  if (root.matches?.(selector)) elements.unshift(root);
  for (const element of elements) {
    const vars = JSON.parse(element.getAttribute('data-i18n-vars') || '{}');
    const key = element.getAttribute('data-i18n');
    if (key) element.textContent = t(key, vars);
    for (const name of attributes) {
      const attributeKey = element.getAttribute(`data-i18n-${name}`);
      if (attributeKey) element.setAttribute(name, t(attributeKey, vars));
    }
  }
}
function setText(element, key, vars = {}) {
  element.setAttribute('data-i18n', key);
  element.setAttribute('data-i18n-vars', JSON.stringify(vars));
  element.textContent = t(key, vars);
}
function setAttribute(element, name, key, vars = {}) {
  element.setAttribute(`data-i18n-${name}`, key);
  element.setAttribute('data-i18n-vars', JSON.stringify(vars));
  element.setAttribute(name, t(key, vars));
}
function syncLinks() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || !/(?:\/|\/(?:index|articles|gallery|game)\.html)$/.test(url.pathname)) return;
    url.searchParams.set('lang', language);
    link.setAttribute('href', url.pathname + url.search + url.hash);
  });
}
function syncPickers() {
  document.querySelectorAll('[data-language-picker]').forEach(picker => { picker.hidden = false; });
  document.querySelectorAll('[data-language]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
}
function setLanguage(next, { persist = true, updateUrl = true, announce = true } = {}) {
  if (!valid(next)) return;
  language = next;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  if (persist) { try { localStorage.setItem(storageKey, language); } catch { /* Links carry the preference when storage is unavailable. */ } }
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('lang', language);
    history.replaceState(history.state, '', url);
  }
  translate();
  syncLinks();
  syncPickers();
  window.dispatchEvent(new CustomEvent('site:languagechange', { detail: { language } }));
  if (announce) {
    const status = document.getElementById('language-status');
    if (status) status.textContent = t('language.changed');
  }
}
window.siteI18n = { get language() { return language; }, t, translate, setText, setAttribute, setLanguage };
document.addEventListener('click', event => {
  const button = event.target.closest('[data-language]');
  if (button) setLanguage(button.dataset.language);
});
window.addEventListener('storage', event => {
  if (event.key === storageKey || event.key === null) setLanguage(valid(event.newValue) ? event.newValue : 'zh', { persist: false });
});
window.addEventListener('popstate', () => setLanguage([queryLanguage(), readSaved(), language].find(valid), { announce: false }));
window.addEventListener('pageshow', event => {
  if (event.persisted) setLanguage([readSaved(), queryLanguage(), language].find(valid), { announce: false });
});
document.addEventListener('DOMContentLoaded', () => {
  const status = document.createElement('span');
  status.id = 'language-status';
  status.className = 'language-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  document.body.append(status);
  setLanguage(language, { updateUrl: valid(queryLanguage()), announce: false });
});
