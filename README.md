# mobb-deck-template

A Red Hat-themed [Slidev](https://sli.dev/) presentation system for the MOBB (Managed OpenShift Black Belt) team. Write slides in Markdown, build animated Vue diagrams, and let an AI agent handle the heavy lifting.

---

## What's in this repo

```
mobb-deck-template/
├── theme/          ← slidev-theme-red-hat-deck  (Red Hat colours, typography, layouts)
├── addon/          ← slidev-addon-red-hat-components  (RhTwoColumn, RhTable, RhTimeline, RhSpectrum)
├── template/       ← pattern library: slides.md with all 15 example formats + AGENTS.md authoring rules
├── decks/          ← one subdirectory per deck; decks/demo/ is gitignored
└── DECK_CREATION_SKILL.md  ← AI agent skill for creating new decks
```

---

## Try the demo

The fastest way to see the full deck-creation workflow is to run the built-in demo. It comes with a pre-written deck brief (OpenShift vs. vanilla Kubernetes) so you don't need to invent a topic.

**Prerequisite:** Install the Slidev skills if you haven't already:

```bash
npx skills add slidevjs/slidev
```

**Run the demo:**

In your AI agent (Claude Code, Cursor, etc.), invoke the deck creation skill in demo mode:

```
/deck-creation demo
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
# 1. Invoke the skill in your agent
/deck-creation

# 2. Answer the 10 interview questions (the agent asks one at a time)
# 3. Approve the design doc
# 4. The agent writes slides, installs deps, and opens a preview at http://localhost:3030
```

Your deck is created in `decks/[your-deck-name]/`. Each deck is a minimal package that pulls in the shared theme and addon — no copying, no duplication.

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

- [`DECK_CREATION_SKILL.md`](DECK_CREATION_SKILL.md) — full skill documentation: interview questions, design doc template, animation guidelines, and the demo mode brief
- [`template/slides.md`](template/slides.md) — all 15 slide format examples with speaker notes
- [`template/AGENTS.md`](template/AGENTS.md) — authoring rules, component constraints, and the mandatory browser review workflow
- [`addon/README.md`](addon/README.md) — component API reference (RhTwoColumn, RhTable, RhTimeline, RhSpectrum)
- [`theme/README.md`](theme/README.md) — CSS variables and layout helper classes
