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
