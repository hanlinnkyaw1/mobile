/**
 * Re-copy JSON study data from the parent web project into assets/data.
 * Run from jlpt-burmese-mobile: node scripts/copy-assets.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(__dirname, '..');
const webRoot = path.resolve(mobileRoot, '..');

const destBase = path.join(mobileRoot, 'assets', 'data');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    const st = fs.statSync(from);
    if (st.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

fs.mkdirSync(destBase, { recursive: true });
for (const f of ['grammarMetadata.json', 'preview.json']) {
  fs.copyFileSync(path.join(webRoot, f), path.join(destBase, f));
}
copyDir(path.join(webRoot, 'reading'), path.join(destBase, 'reading'));
const kanjiSrc = path.join(webRoot, 'kanjiFlashCard');
const kanjiDest = path.join(destBase, 'kanji');
fs.mkdirSync(kanjiDest, { recursive: true });
for (const name of fs.readdirSync(kanjiSrc)) {
  if (name.endsWith('.json')) {
    fs.copyFileSync(path.join(kanjiSrc, name), path.join(kanjiDest, name));
  }
}
copyDir(path.join(webRoot, 'oldQVoca', 'vocab'), path.join(destBase, 'vocab'));
console.log('Copied web JSON into assets/data');
