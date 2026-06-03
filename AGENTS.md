# AGENTS.md - mobb-deck-template (repo development)

This is the repo-level guide for AI agents **working on the repo itself** — editing the theme, addon, template, or skills. For rules about writing slide content in a deck, see `template/AGENTS.md`.

---

## Repo structure

```
mobb-deck-template/
  theme/          # Slidev theme: slidev-theme-red-hat-deck
  addon/          # Vue component addon: slidev-addon-red-hat-components
  template/       # Starter template for new decks
  decks/          # Actual decks (each is a standalone npm project)
  skills/         # Claude skills (on-demand, not auto-loaded)
  CLAUDE.md       # Claude Code session instructions
  AGENTS.md       # This file
```

---

## Component map

| Directory | Package name | What it contains |
|-----------|-------------|-----------------|
| `theme/` | `slidev-theme-red-hat-deck` | 14 Slidev layouts, CSS tokens, utility classes |
| `addon/` | `slidev-addon-red-hat-components` | `RhTwoColumn`, `RhTable`, `RhTimeline`, `RhSpectrum` |
| `template/` | (not published) | Example `slides.md`, `AGENTS.md`, `README.md` for new decks |
| `decks/<name>/` | (not published) | Each deck is a self-contained npm project |
| `skills/mobb-create-deck/` | (Claude skill) | Interview-driven deck creation workflow |

---

## Working on the theme

The theme has its own `slides.md` that uses `theme: ./` so you can preview changes live:

```bash
cd theme
npm install
npm run dev    # starts at http://localhost:3030
```

- **Layouts** live in `theme/layouts/` as `.vue` files. Adding a layout = adding a file there; Slidev auto-registers them.
- **Tokens** are in `theme/styles/tokens.css`. The shorthand aliases (`--rh-red`, `--rh-muted`, etc.) are the public API - do not remove or rename them.
- **Utility classes** are in `theme/styles/layouts.css`.
- After any layout or style change, screenshot-review `theme/slides.md` in the browser.
- Documentation: `theme/README.md` (human) and `theme/AGENTS.md` (agent layout/token reference).

---

## Working on the addon

The addon provides Vue components auto-registered in any deck that lists it in `addons:`:

```bash
cd addon
npm install
```

There is no standalone dev server for the addon. Test changes by running a deck that uses it:

```bash
cd decks/spike-resilience
npm run dev
```

- Components live in `addon/components/`. File name = component name (PascalCase).
- All components should use `--rh-*` CSS token variables, not hardcoded hex values.
- Props-driven components (table, timeline, spectrum) are preferred over slot-based when the data is structured.
- After adding or changing a component, update `addon/README.md`.

---

## Working on the template

The template is a starter for new decks. It is not a runnable deck itself — it is copied when creating a new deck.

- `template/slides.md` — reference slide patterns (one of every format)
- `template/AGENTS.md` — authoring rules for deck authors and AI agents writing slide content
- `template/README.md` — human setup guide

When you add a new layout to the theme or a new component to the addon, add a usage example in `template/slides.md` and document the rules in `template/AGENTS.md`.

---

## Working on a deck

Each deck under `decks/` is a standalone npm project. Its `package.json` links to the theme and addon via `file:` paths:

```json
{
  "dependencies": {
    "slidev-theme-red-hat-deck": "file:../../theme",
    "slidev-addon-red-hat-components": "file:../../addon"
  }
}
```

To develop a deck:

```bash
cd decks/<name>
npm install
npm run dev    # starts at http://localhost:3030
```

After any slide change, screenshot-review in the browser. See `template/AGENTS.md` for the full mandatory review workflow.

---

## Creating a new deck

When the user asks to create a deck, read and follow `skills/mobb-create-deck/SKILL.md`.

The skill runs an interview to establish the deck's purpose, audience, structure, and narrative before writing any slides. It is not auto-loaded — read it on demand when deck creation is requested.

**Do not skip the interview.** Decks written without establishing the Know-Feel-Do framework and SCR narrative first produce generic, unfocused output.

New deck directory structure:

```
decks/<name>/
  slides.md          # All slide content
  package.json       # npm project, links to theme and addon
  components/        # Deck-specific Vue components (auto-registered)
  public/            # Static assets served at /filename
  DECK_DESIGN.md     # Design doc produced by the skill interview
```

---

## Skills system

Skills live in `skills/` and follow the Claude Code skill format (YAML frontmatter + Markdown body):

```
skills/
  mobb-create-deck/
    SKILL.md
```

Skills are **not auto-loaded**. They are referenced from `CLAUDE.md` with on-demand read instructions. This keeps them out of the context window until needed.

To add a new skill:
1. Create `skills/<skill-name>/SKILL.md` with valid frontmatter (`name:`, `description:`).
2. Add a `Read` instruction to `CLAUDE.md` describing when to invoke it.
3. The `description:` field must start with "Use when..." and describe triggering conditions only — not the skill's workflow.

---

## Cross-cutting rules

These apply everywhere in the repo:

- **No em-dashes** (`—`, U+2014) in any file — `.md`, `.vue`, `.ts`, `.css`, YAML, everywhere. Use a spaced hyphen ` - ` instead.
- **Screenshot review is mandatory** for any visible slide change. Do not declare work done based on Markdown source alone.
- **CSS token public API** — `--rh-red`, `--rh-blue`, `--rh-green`, `--rh-yellow`, `--rh-muted`, `--rh-surface`, `--rh-border` are the stable shorthand aliases. The `--slidev-rh-*` prefixed variables are internal — deck authors and component code should use the shorthand aliases.
- **No `var(--rh-*)` in animated diagram Vue components** — use explicit RGBA values. Tokens are calibrated for slide typography on light backgrounds, not diagram canvases.
- **Speaker notes on every slide** — HTML comment block below slide body.

---

## Documentation map

| Question | Where to look |
|----------|--------------|
| What layouts does the theme provide? | `theme/README.md`, `theme/AGENTS.md` |
| What are the CSS tokens? | `theme/styles/tokens.css`, `theme/AGENTS.md` |
| How do I use RhTwoColumn / RhTable / etc.? | `addon/README.md` |
| How do I write slide content correctly? | `template/AGENTS.md` |
| How do I create a new deck? | `skills/mobb-create-deck/SKILL.md` |
| What patterns are available for animated components? | `template/AGENTS.md` → "Animated components" |
