#!/usr/bin/env node
import { execSync } from 'child_process';
import { cpSync, existsSync, writeFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const [,, command, deckName] = process.argv;

if (command !== 'new' || !deckName) {
  console.error('Usage: npx github:rh-mobb/rh-ai-deck-builder new <deck-name>');
  process.exit(1);
}

const dest = resolve(process.cwd(), deckName);

if (existsSync(dest)) {
  console.error(`Error: directory "${deckName}" already exists.`);
  process.exit(1);
}

const skipFilter = (src) =>
  !src.includes('node_modules') && !src.includes('package-lock.json');

console.log(`Creating ${deckName}...`);

cpSync(join(repoRoot, 'template'), dest, { recursive: true, filter: skipFilter });
cpSync(join(repoRoot, 'theme'), join(dest, 'theme'), { recursive: true, filter: skipFilter });
cpSync(join(repoRoot, 'addon'), join(dest, 'addon'), { recursive: true, filter: skipFilter });

const pkg = {
  name: `${deckName}-deck`,
  version: '1.0.0',
  private: true,
  scripts: {
    dev: 'slidev slides.md --open',
    build: 'slidev build slides.md',
    export: 'slidev export slides.md',
  },
  dependencies: {
    '@slidev/cli': '^0.49.0',
    'slidev-theme-red-hat': 'file:./theme',
    'slidev-addon-red-hat-components': 'file:./addon',
  },
};

writeFileSync(join(dest, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

console.log('Installing dependencies...');
execSync('npm install', { cwd: dest, stdio: 'inherit' });

console.log(`
Done! Your deck is ready:

  cd ${deckName}
  npm run dev        # start Slidev dev server

Or open in Claude Code — the mobb-deck skill knows this theme.
`);
