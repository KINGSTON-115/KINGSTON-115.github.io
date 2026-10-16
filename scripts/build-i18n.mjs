import { readFile, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { localizeMarkup, languagePicker } from './i18n-markup.mjs';

for (const [page, namespace] of [['articles', 'archive'], ['gallery', 'gallery'], ['game', 'game']]) {
  const path = new URL(`../${page}.html`, import.meta.url);
  let html = await readFile(path, 'utf8');
  if (!html.includes('src="js/i18n.min.js"')) html = html.replace('</head>', '    <script src="js/i18n.min.js"></script>\n</head>');
  if (!html.includes('data-language-picker role=')) html = html.replace('</body>', `    ${languagePicker(`language-floating${page === 'game' ? ' language-game' : ''}`)}\n</body>`);
  if (page === 'game' && !html.includes('language-overlay')) {
    html = html.replace(/(<button id="(?:startButton|resumeButton|restartButton)"[^>]*>[\s\S]*?<\/button>)/g, `$1\n        ${languagePicker('language-overlay')}`);
  }
  if (page === 'gallery' && !html.includes('language-lightbox')) {
    html = html.replace('<!-- Close Control -->', `${languagePicker('language-lightbox')}\n        <!-- Close Control -->`);
  }
  await writeFile(path, localizeMarkup(html, namespace));
}
await build({ entryPoints: ['js/i18n.js'], bundle: true, minify: true, format: 'iife', outfile: 'js/i18n.min.js', legalComments: 'inline' });
console.log('Built shared Chinese/English translations for all four pages.');
