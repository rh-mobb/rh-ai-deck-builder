# rh-ai-deck-builder

A Red Hat-themed [Slidev](https://sli.dev/) presentation system for the MOBB (Managed OpenShift Black Belt) team. Write slides in Markdown, build animated Vue diagrams, and let an AI agent handle the heavy lifting.

---

## Install

### 1. Install the Claude Code skill (one-time setup)

```bash
/plugins add-marketplace github:rh-mobb/rh-ai-deck-builder
/plugins install rh-ai-deck-builder mobb-deck
```

Requires `gh` CLI auth for the private repo.

### 2. Scaffold a new deck

```bash
npx github:rh-mobb/rh-ai-deck-builder new my-talk
cd my-talk
npm run dev
```

### 3. Create slides

In Claude Code, invoke the skill:

```
/mobb-create-deck
```

The agent interviews you (10 questions, one at a time), writes a design doc, then builds the slides and opens a preview at `http://localhost:3030`.

---

## What's in this repo

```
rh-ai-deck-builder/
├── plugins/mobb-deck/  ← Claude Code plugin (mobb-create-deck skill)
├── bin/create.js       ← npx scaffold script
├── theme/              ← slidev-theme-red-hat (Red Hat colours, typography, layouts)
├── addon/              ← slidev-addon-red-hat-components (RhTwoColumn, RhTable, RhTimeline, RhSpectrum)
├── template/           ← pattern library: slides.md with all 15 example formats + AGENTS.md authoring rules
└── decks/              ← one subdirectory per deck; decks/demo/ is gitignored
```

---

## Try the demo

The fastest way to see the full deck-creation workflow is to run the built-in demo. It comes with a pre-written deck brief (OpenShift vs. vanilla Kubernetes) so you don't need to invent a topic.

**Prerequisite:** Install the mobb-deck plugin (see [Install](#install) above).

**Run the demo:**

In Claude Code, invoke the skill in demo mode:

```
/mobb-create-deck demo
```

The agent will:
1. Present a detailed pre-written brief — *Why OpenShift is an application platform and why that makes it superior to vanilla Kubernetes*
2. Ask whether you want to use it, customise it, or supply your own topic
3. Walk through the remaining interview questions one at a time
4. Write the completed deck to `decks/demo/` and open it in your browser

The demo deck is gitignored so you can run it as many times as you like without polluting the repo.

---

## Create a new deck

```bash
# Option A: Scaffold + skill (recommended for new projects)
npx github:rh-mobb/rh-ai-deck-builder new my-talk
cd my-talk
# then in Claude Code:
/mobb-create-deck

# Option B: Inside this repo
# The skill detects it's in the rh-ai-deck-builder repo
# and creates decks under decks/
/mobb-create-deck
```

The agent interviews you (10 questions), writes a design doc, builds the slides, and opens a preview at `http://localhost:3030`.

---

## Work on an existing deck

```bash
cd decks/rosa-comparison   # or any deck directory
npm install                # first time only
npm run dev                # opens http://localhost:3030
```

Navigate to slide `N` at `http://localhost:3030/N`.

---

## Deck structure

Each deck contains only what is unique to it:

```
decks/my-deck/
├── slides.md           ← all slide content
├── DECK_DESIGN.md      ← design doc (created during interview)
├── components/         ← custom Vue components for this deck
└── public/             ← images and static assets
```

The theme, addon components, and CSS variables are shared from `theme/` and `addon/` — changes there apply to every deck automatically.

---

## Further reading

- [`plugins/mobb-deck/skills/mobb-create-deck/SKILL.md`](plugins/mobb-deck/skills/mobb-create-deck/SKILL.md) — full skill documentation: interview questions, design doc template, animation guidelines, and the demo mode brief
- [`template/slides.md`](template/slides.md) — all 15 slide format examples with speaker notes
- [`template/AGENTS.md`](template/AGENTS.md) — authoring rules, component constraints, and the mandatory browser review workflow
- [`addon/README.md`](addon/README.md) — component API reference (RhTwoColumn, RhTable, RhTimeline, RhSpectrum)
- [`theme/README.md`](theme/README.md) — CSS variables and layout helper classes
