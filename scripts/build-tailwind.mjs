/* eslint-disable no-console, no-restricted-syntax, no-continue, import/no-unresolved */
/**
 * Regenerate src/sass/_tailwind.scss from src/sass/_input.scss.
 *
 * This project checks the compiled Tailwind output into the repo instead of
 * running Tailwind inside the webpack build, so a `tw:` class that no source
 * file used before will not exist in the CSS until this is re-run. Symptom:
 * markup looks completely unstyled even though the class names are right.
 *
 * Run it after adding or changing any `tw:` class:
 *
 *     npm run build:tailwind
 *
 * There is no @tailwindcss/cli installed, so this drives the compiler API and
 * scans the source for candidates itself.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { compile } from 'tailwindcss';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SASS_DIR = path.join(ROOT, 'src/sass');
const TW_DIR = path.join(ROOT, 'node_modules/tailwindcss');
const OUT = path.join(SASS_DIR, '_tailwind.scss');

const loadStylesheet = async (id, base) => {
  let file;
  if (id === 'tailwindcss') {
    file = path.join(TW_DIR, 'index.css');
  } else if (id.startsWith('tailwindcss/')) {
    file = path.join(TW_DIR, id.slice('tailwindcss/'.length));
  } else {
    file = path.resolve(base, id);
  }
  if (!path.extname(file)) { file += '.css'; }
  return { path: file, base: path.dirname(file), content: fs.readFileSync(file, 'utf8') };
};

const loadModule = async (id) => {
  throw new Error(`JS plugins are not supported by this script (asked for ${id})`);
};

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '__snapshots__'].includes(entry.name)) { continue; }
      walk(full, out);
    } else if (/\.(jsx?|tsx?|html)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
};

// Deliberately does not break on parens or commas: arbitrary values such as
// shadow-[0_1px_3px_rgba(0,0,0,0.08)] contain both and must stay whole.
const CANDIDATE_RE = /[^\s"'`{}<>=;]*tw:[^\s"'`{}<>=;]*/g;

const candidates = new Set();
for (const file of walk(path.join(ROOT, 'src'))) {
  for (const token of (fs.readFileSync(file, 'utf8').match(CANDIDATE_RE) || [])) {
    candidates.add(token);
  }
}

const compiler = await compile(fs.readFileSync(path.join(SASS_DIR, '_input.scss'), 'utf8'), {
  base: SASS_DIR,
  loadStylesheet,
  loadModule,
});

fs.writeFileSync(OUT, compiler.build([...candidates]));
console.log(`Wrote ${path.relative(ROOT, OUT)} from ${candidates.size} candidates.`);
