# rh-ai-deck-builder: Installable Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the mobb-deck skill installable via the Claude plugin system and bootstrappable via `npx github:rh-mobb/rh-ai-deck-builder new <deck-name>`.

**Architecture:** The repo itself becomes the Claude plugin marketplace. The skill moves from `skills/` into a `plugins/mobb-deck/` structure. A root `package.json` + `bin/create.js` enables `npx github:` scaffolding that copies the template, theme, and addon into a self-contained new deck directory (no external npm registry needed).

**Tech Stack:** Node.js ≥18 (script), Claude Code plugin system (plugin.json + SKILL.md), Slidev 0.49, npm file: dependencies

**Spec:** `docs/superpowers/specs/2026-08-27-rh-ai-deck-builder-installable-design.md`

## Global Constraints

- Node.js ≥ 18 required (uses ESM, `fs.cpSync`)
- Theme package name: `slidev-theme-red-hat` (from `theme/package.json`)
- Addon package name: `slidev-addon-red-hat-components` (from `addon/package.json`)
- Repo: `github.com/rh-mobb/rh-ai-deck-builder` (private)
- Plugin name: `mobb-deck`
- Skill name: `mobb-create-deck`
- All `github:` references in user-facing text use `rh-mobb/rh-ai-deck-builder`
- No public npm publish; scaffold bundles theme + addon locally via `file:` deps

---

### Task 1: Fix template/package.json for local development

The existing `template/package.json` references `@slidev/theme-default` — wrong package. Fix it to use the repo's actual theme and addon via `file:` paths so development within the repo works correctly.

**Files:**
- Modify: `template/package.json`

**Interfaces:**
- Produces: `template/package.json` with correct `file:../theme` and `file:../addon` deps (consumed by Task 5's scaffold script to understand the expected scripts shape)

- [ ] **Step 1: Read current template/package.json**

```bash
cat template/package.json
```

- [ ] **Step 2: Update dependencies**

Replace the `dependencies` block so `template/package.json` reads:

```json
{
  "name": "mobb-deck-template",
  "private": true,
  "scripts": {
    "dev": "slidev slides.md --open",
    "build": "slidev build slides.md",
    "export": "slidev export slides.md"
  },
  "dependencies": {
    "@slidev/cli": "^0.49.0",
    "slidev-theme-red-hat": "file:../theme",
    "slidev-addon-red-hat-components": "file:../addon"
  }
}
```

- [ ] **Step 3: Verify npm install works in template/**

```bash
cd template && rm -rf node_modules package-lock.json && npm install
```

Expected: installs without errors; `node_modules/slidev-theme-red-hat` exists.

- [ ] **Step 4: Commit**

```bash
git add template/package.json template/package-lock.json
git commit -m "fix(template): use local theme and addon dependencies"
```

---

### Task 2: Create Claude plugin manifest and README

Create the plugin directory structure that Claude's plugin system expects.

**Files:**
- Create: `plugins/mobb-deck/.claude-plugin/plugin.json`
- Create: `plugins/mobb-deck/README.md`

**Interfaces:**
- Produces: plugin manifest at `plugins/mobb-deck/.claude-plugin/plugin.json` (consumed by Claude plugin system at install time)

- [ ] **Step 1: Create plugin directory**

```bash
mkdir -p plugins/mobb-deck/.claude-plugin
mkdir -p plugins/mobb-deck/skills/mobb-create-deck
```

- [ ] **Step 2: Write plugin.json**

Create `plugins/mobb-deck/.claude-plugin/plugin.json`:

```json
{
  "name": "mobb-deck",
  "description": "Create Red Hat MOBB branded Slidev presentations",
  "version": "0.1.0",
  "author": {
    "name": "github.com/rh-mobb"
  }
}
```

- [ ] **Step 3: Verify plugin.json is valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('plugins/mobb-deck/.claude-plugin/plugin.json', 'utf8')); console.log('valid')"
```

Expected: prints `valid`

- [ ] **Step 4: Write plugins/mobb-deck/README.md**

Create `plugins/mobb-deck/README.md`:

```markdown
# mobb-deck Claude Plugin

Installs the `mobb-create-deck` skill into Claude Code for creating Red Hat MOBB branded Slidev presentations.

## Install

```bash
/plugins add-marketplace github:rh-mobb/rh-ai-deck-builder
/plugins install rh-ai-deck-builder mobb-deck
```

Requires `gh` CLI auth for private repo access.

## Usage

After installing, use the skill in any Claude Code session:

```
/mobb-create-deck
```

Or reference it naturally: "Use the mobb-create-deck skill to build a deck about X."

## Scaffold a new deck without Claude

```bash
npx github:rh-mobb/rh-ai-deck-builder new my-talk
cd my-talk
npm run dev
```
```

- [ ] **Step 5: Commit**

```bash
git add plugins/
git commit -m "feat(plugin): add mobb-deck Claude plugin manifest and README"
```

---

### Task 3: Move SKILL.md to plugin location and update it

Move the skill from `skills/mobb-create-deck/SKILL.md` into the plugin structure, then update two sections: the bootstrap flow (use `npx github:` instead of vague "find the template") and the "Option B" external project setup (replace manual package.json with scaffold command).

**Files:**
- Create: `plugins/mobb-deck/skills/mobb-create-deck/SKILL.md` (moved + updated)
- Delete: `skills/mobb-create-deck/SKILL.md`

**Interfaces:**
- Consumes: existing skill content from `skills/mobb-create-deck/SKILL.md`
- Produces: updated skill at `plugins/mobb-deck/skills/mobb-create-deck/SKILL.md`

- [ ] **Step 1: Copy skill to plugin location**

```bash
cp skills/mobb-create-deck/SKILL.md plugins/mobb-deck/skills/mobb-create-deck/SKILL.md
```

- [ ] **Step 2: Update the frontmatter description**

In `plugins/mobb-deck/skills/mobb-create-deck/SKILL.md`, change the frontmatter from:

```yaml
---
name: mobb-create-deck
description: Use when creating a presentation deck from a situation or existing project, before writing any slides—interview the user to clarify intent, audience, and scope
---
```

to:

```yaml
---
name: mobb-create-deck
description: Use when creating a Red Hat MOBB Slidev presentation—interviews the user to clarify intent, audience, and scope before writing any slides. Requires the mobb-deck plugin (github:rh-mobb/rh-ai-deck-builder).
---
```

- [ ] **Step 3: Update the "Before the Interview: Template Setup" section**

Find the section starting with `## Before the Interview: Template Setup` and replace it entirely with:

```markdown
## Before the Interview: Template Setup

**Special case: If you're inside the rh-ai-deck-builder repo itself**
- ✅ Template is at `./template/`
- Decks will be created in `./decks/[deck-name]/`
- Proceed directly to the interview

**Normal case: Starting a new deck in a fresh directory**
- Scaffold the project first, then proceed to the interview:

```bash
npx github:rh-mobb/rh-ai-deck-builder new <deck-name>
cd <deck-name>
```

This copies the template, theme, and addon into `./<deck-name>/` and runs `npm install`. The deck is self-contained — no ongoing dependency on the repo.
```

- [ ] **Step 4: Update "Option B: External project" in "After Design Doc Approval: Deck Setup"**

Find the section `### Option B: External project (not in mobb-deck-template)` and replace it with:

```markdown
### Option B: External project (scaffolded via npx)

If the user ran `npx github:rh-mobb/rh-ai-deck-builder new <deck-name>`, the scaffold already handled setup — the deck directory exists with theme, addon, and `npm install` complete. Skip to the interview.

If they haven't scaffolded yet, run:

```bash
npx github:rh-mobb/rh-ai-deck-builder new <deck-name>
cd <deck-name>
```
```

- [ ] **Step 5: Verify the SKILL.md file has no references to `paulczar/mobb-deck-template`**

```bash
grep -n "paulczar\|mobb-deck-template" plugins/mobb-deck/skills/mobb-create-deck/SKILL.md
```

Expected: no output (zero matches). If any found, update them to `rh-mobb/rh-ai-deck-builder`.

- [ ] **Step 6: Delete old skill location**

```bash
rm -rf skills/mobb-create-deck
```

- [ ] **Step 7: Verify old path is gone**

```bash
ls skills/
```

Expected: directory is empty or gone.

- [ ] **Step 8: Commit**

```bash
git add plugins/mobb-deck/skills/
git rm -r skills/mobb-create-deck
git commit -m "feat(skill): move mobb-create-deck into plugin structure, update bootstrap flow"
```

---

### Task 4: Add root package.json

Add the root-level `package.json` that gives this repo a name and `bin` entry, enabling `npx github:rh-mobb/rh-ai-deck-builder new <deck-name>` to work.

**Files:**
- Create: `package.json` (repo root)

**Interfaces:**
- Produces: `package.json` with `"bin": {"rh-ai-deck": "./bin/create.js"}` (consumed by npm/npx at install time, and by Task 5)

- [ ] **Step 1: Verify no root package.json exists**

```bash
ls package.json 2>/dev/null && echo "exists" || echo "does not exist"
```

Expected: `does not exist`

- [ ] **Step 2: Create root package.json**

Create `package.json`:

```json
{
  "name": "@rh-mobb/rh-ai-deck-builder",
  "version": "0.1.0",
  "description": "Red Hat MOBB Slidev deck builder — Claude plugin and scaffold tool",
  "type": "module",
  "bin": {
    "rh-ai-deck": "./bin/create.js"
  },
  "engines": {
    "node": ">=18"
  },
  "keywords": ["slidev", "red-hat", "mobb", "presentation"],
  "author": "github.com/rh-mobb",
  "license": "MIT"
}
```

- [ ] **Step 3: Validate JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('valid')"
```

Expected: prints `valid`

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "feat: add root package.json to enable npx github: scaffold"
```

---

### Task 5: Write bin/create.js scaffold script

Write the Node.js script that copies template/, theme/, and addon/ into a new directory and writes a self-contained package.json with `file:` deps.

**Files:**
- Create: `bin/create.js`

**Interfaces:**
- Consumes: `template/`, `theme/`, `addon/` from the repo root (resolved relative to the script's own location via `import.meta.url`)
- Consumes: CLI args `process.argv` — expects `new <deck-name>`
- Produces: `<deck-name>/` directory in the caller's cwd, fully installed

- [ ] **Step 1: Create bin/ directory**

```bash
mkdir -p bin
```

- [ ] **Step 2: Write bin/create.js**

Create `bin/create.js`:

```javascript
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
```

- [ ] **Step 3: Make the script executable**

```bash
chmod +x bin/create.js
```

- [ ] **Step 4: Smoke test — run the scaffold**

From the repo root:

```bash
node bin/create.js new test-deck-smoke
```

Expected:
- Prints `Creating test-deck-smoke...`
- Prints `Installing dependencies...`
- npm install output
- Prints the "Done!" message with next steps

- [ ] **Step 5: Verify scaffold output structure**

```bash
ls test-deck-smoke/
ls test-deck-smoke/theme/
ls test-deck-smoke/addon/
cat test-deck-smoke/package.json
```

Expected:
- `test-deck-smoke/` contains: `slides.md`, `public/`, `components/`, `AGENTS.md`, `theme/`, `addon/`, `package.json`
- `theme/` contains Slidev theme files (layouts/, styles/, index.ts)
- `addon/` contains addon files (components/, index.ts)
- `package.json` has `"name": "test-deck-smoke-deck"` and `file:./theme`, `file:./addon` deps

- [ ] **Step 6: Verify Slidev can start in the scaffold**

```bash
cd test-deck-smoke && npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3030/
kill %1 2>/dev/null
cd ..
```

Expected: HTTP status `200`

- [ ] **Step 7: Verify error cases**

```bash
# Missing deck name
node bin/create.js new 2>&1 | grep -q "Usage:" && echo "usage error works"

# Existing directory
node bin/create.js new test-deck-smoke 2>&1 | grep -q "already exists" && echo "exists error works"
```

Expected: both print their confirmation message.

- [ ] **Step 8: Clean up smoke test**

```bash
rm -rf test-deck-smoke
```

- [ ] **Step 9: Commit**

```bash
git add bin/create.js
git commit -m "feat: add npx scaffold script (bin/create.js)"
```

---

### Task 6: Update .gitignore and README

Prevent test decks from being committed, and document the two install paths in the root README.

**Files:**
- Modify: `.gitignore`
- Modify: `README.md`

**Interfaces:**
- None (documentation only)

- [ ] **Step 1: Read current .gitignore**

```bash
cat .gitignore
```

- [ ] **Step 2: Add test-deck pattern if not present**

If `.gitignore` doesn't already contain `test-deck-*`, add:

```
test-deck-*
```

- [ ] **Step 3: Read current README.md top section**

```bash
head -60 README.md
```

- [ ] **Step 4: Add install instructions to README.md**

Find the first `##` section and insert the following block before it:

```markdown
## Install

### Claude Code skill (one-time setup)

```bash
/plugins add-marketplace github:rh-mobb/rh-ai-deck-builder
/plugins install rh-ai-deck-builder mobb-deck
```

Requires `gh` CLI auth for the private repo.

### Scaffold a new deck

```bash
npx github:rh-mobb/rh-ai-deck-builder new my-talk
cd my-talk
npm run dev
```

```

- [ ] **Step 5: Commit**

```bash
git add .gitignore README.md
git commit -m "docs: add install instructions for plugin and npx scaffold"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| `plugins/mobb-deck/.claude-plugin/plugin.json` | Task 2 |
| Skill moved from `skills/` to plugin location | Task 3 |
| Skill bootstrap section updated to use npx | Task 3 |
| Root `package.json` with bin field | Task 4 |
| `bin/create.js` copies template + theme + addon | Task 5 |
| `npm install` run in scaffold dest | Task 5 |
| Error on missing deck name | Task 5 step 7 |
| Error on existing directory | Task 5 step 7 |
| `plugins/mobb-deck/README.md` | Task 2 |
| `template/package.json` fixed for local dev | Task 1 |

**Placeholder scan:** No TBDs, TODOs, or "similar to" references. All code blocks are complete.

**Type/name consistency:**
- Theme package name `slidev-theme-red-hat` used consistently in Task 1 and Task 5 (matches `theme/package.json`)
- Addon package name `slidev-addon-red-hat-components` used consistently (matches `addon/package.json`)
- `file:./theme` and `file:./addon` used in Task 5's generated package.json
- `file:../theme` and `file:../addon` used in Task 1's template/package.json (correct relative paths)
