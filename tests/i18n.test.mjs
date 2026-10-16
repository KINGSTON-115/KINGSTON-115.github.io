import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { localizeMarkup } from '../scripts/i18n-markup.mjs';
import { messages } from '../js/locales.mjs';
import { arrowIcon } from '../scripts/arrow-icon.mjs';
import { projectDetails as zh } from '../js/project-data.mjs';
import { projectDetails as en } from '../js/project-data.en.mjs';

test('mixed text preserves icons, line breaks, motion targets and code samples', () => {
  const icon = arrowIcon('se');
  const html = `<h1><span class="title-line"><span>INTO <em>REALITY.</em></span></span></h1><a>探索我的作品 ${icon}</a><pre><code>打开导航菜单</code></pre><script>const text = "作品";</script>`;
  const output = localizeMarkup(html, 'home');
  assert.match(output, /<span class="title-line"><span><l10n-text data-i18n="home.into">成为<\/l10n-text> <em data-i18n="home.reality">现实。<\/em><\/span><\/span>/);
  assert.ok(output.includes(icon), 'translation must preserve vector icons and their geometry');
  assert.match(output, /<pre><code>打开导航菜单<\/code><\/pre>/);
  assert.match(output, /<script>const text = "作品";<\/script>/);
  assert.equal(localizeMarkup(output, 'home'), output);
});

test('existing keys refresh static defaults and preserve unrelated attributes', () => {
  const output = localizeMarkup('<button data-i18n="home.navWork" title="old" data-i18n-title="home.menuOpen" id="keep">Old wording</button>', 'home');
  assert.match(output, /title="打开导航菜单"/);
  assert.match(output, /id="keep">作品<\/button>/);
  assert.equal((output.match(/data-i18n-title=/g) || []).length, 1);
});

test('both languages have matching placeholders and complete project details', () => {
  for (const [key, [chinese, english]] of Object.entries(messages)) {
    assert.ok(chinese && english, key);
    const placeholders = text => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
    assert.deepEqual(placeholders(chinese), placeholders(english), key);
  }
  assert.deepEqual(Object.keys(zh).sort(), Object.keys(en).sort());
  for (const [key, detail] of Object.entries(en)) {
    assert.ok(detail.title && detail.tags.length && detail.content, key);
    assert.doesNotMatch(JSON.stringify(detail), /[\u4e00-\u9fff]/, key);
  }
});

test('all published pages have the shared runtime, selectors and stable annotations', async () => {
  for (const [page, namespace] of [['index', 'home'], ['articles', 'archive'], ['gallery', 'gallery'], ['game', 'game']]) {
    const html = await readFile(new URL(`../${page}.html`, import.meta.url), 'utf8');
    assert.match(html, /src="js\/i18n.min.js"/);
    assert.match(html, /data-language-picker role="group"/);
    assert.equal(localizeMarkup(html, namespace), html, `${page} must be stable across builds`);
    for (const match of html.matchAll(/data-i18n(?:-(?:aria-label|alt|title|placeholder|content))?="([^"]+)"/g)) {
      assert.ok(messages[match[1]], `${page}: unknown translation key ${match[1]}`);
    }
  }
});
