# rh-ai-deck-builder: Installable Plugin Design

**Repo:** `github.com/rh-mobb/rh-ai-deck-builder` (private)
**Date:** 2026-08-27
**Status:** Approved, pending implementation

## Goal

Make the MOBB deck-creation skill installable by team members via two paths:

1. **Claude plugin** — installs the `mobb-create-deck` skill into Claude Code
2. **npx scaffold** — bootstraps a new Slidev deck from the template without requiring Claude

Both paths are served from the same private repo. No public npm publish, no separate plugin marketplace repo.

## Repository Structure

```
rh-ai-deck-builder/
├── plugins/
│   └── mobb-deck/
│       ├── .claude-plugin/
│       │   └── plugin.json       # Claude plugin manifest
│       ├── skills/
│       │   └── mobb-create-deck/
│       │       └── SKILL.md      # moved from skills/ root
│       └── README.md
├── bin/
│   └── create.js                 # npx scaffold script (Node.js)
├── package.json                  # new root package — enables npx path
└── ... (existing: theme/, template/, addon/, decks/)
```

The existing `skills/mobb-create-deck/SKILL.md` moves into the plugin folder. The `template/` directory (already in the repo) is what the scaffold script copies.

## Claude Plugin

### `plugins/mobb-deck/.claude-plugin/plugin.json`

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

### `plugins/mobb-deck/skills/mobb-create-deck/SKILL.md`

The existing skill content is preserved with two additions:

1. **Bootstrap section** — when no existing deck is present, the skill instructs Claude to scaffold first:
   ```
   npx github:rh-mobb/rh-ai-deck-builder new <deck-name>
   ```
   Then `cd` into the new deck directory before proceeding.

2. **Theme/layout reference** — a concise inline reference of available layouts, components, and frontmatter options so Claude doesn't need to explore the repo at runtime.

The skill trigger description is updated to reflect it is plugin-installed (system-wide), not project-local.

### Installation (team member, one-time)

```bash
/plugins add-marketplace github:rh-mobb/rh-ai-deck-builder
/plugins install rh-ai-deck-builder mobb-deck
```

Requires standard `gh` CLI auth for private repo access, which all team members already have.

## npx Scaffold

### `package.json` (root)

```json
{
  "name": "@rh-mobb/rh-ai-deck-builder",
  "version": "0.1.0",
  "bin": {
    "rh-ai-deck": "./bin/create.js"
  },
  "engines": { "node": ">=18" }
}
```

### `bin/create.js` behavior

Invoked as: `npx github:rh-mobb/rh-ai-deck-builder new <deck-name>`

1. Parse `<deck-name>` from argv — print usage hint and exit if missing
2. Copy `template/` → `./<deck-name>/`
3. Run `npm install` inside the new directory
4. Print next steps:
   ```
   cd <deck-name>
   npm run dev        # start Slidev dev server
   # or open in Claude Code — the mobb-deck skill knows this theme
   ```

No git operations at scaffold time. Works entirely offline after the initial npx fetch because npx downloads the full repo, making `template/` available locally.

## Team Workflow

**One-time Claude setup:**
```bash
/plugins add-marketplace github:rh-mobb/rh-ai-deck-builder
/plugins install rh-ai-deck-builder mobb-deck
```

**Per new deck:**
```bash
npx github:rh-mobb/rh-ai-deck-builder new my-talk
cd my-talk
npm run dev
# open in Claude Code and use the mobb-create-deck skill
```

## Out of Scope

- Version pinning (`npx github:` fetches `main`; tag-based pinning deferred)
- Public npm publish (repo is private; GitHub Packages not needed)
- Publishing to `rh-mobb/mobb-skills` (this plugin is MOBB-internal only)
