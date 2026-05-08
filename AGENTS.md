# AGENTS.md — mobb-deck-template

This is a Red Hat-themed [Slidev](https://sli.dev/) presentation template. It uses Markdown for content, Vue 3 SFCs for reusable components, and a custom CSS layer over the Slidev default theme. This document is the authoritative guide for AI agents making changes to this template or to any deck derived from it.

---

## Files in this template

| File | Purpose |
|------|---------|
| `slides.md` | 15 example slide formats — the pattern library |
| `AGENTS.md` | This file — authoring rules for AI agents |
| `README.md` | Human usage guide — setup, components, customisation |
| `PROMPT.md` | Ready-to-paste kickoff prompt for generating a first-draft deck from a project repo |
| `styles/index.css` | Red Hat palette, typography, layout helpers |
| `components/` | Vue components: `RhTwoColumn`, `RhTable`, `RhTimeline`, `RhSpectrum` |
| `public/` | Example images; replace with your own |

When helping a user build a new presentation, always check `PROMPT.md` — it defines the expected workflow and output structure.

---

## Stack overview

| Layer | Choice | Notes |
|-------|--------|-------|
| Deck engine | Slidev (`@slidev/cli` ~0.49) | Vite-powered; Markdown → slides |
| Base theme | `@slidev/theme-default` | Customised via `styles/index.css`, not forked |
| UI framework | Vue 3 | Components in `components/` are auto-registered |
| Syntax highlighting | Shiki | Set in frontmatter: `highlighter: shiki` |
| Diagrams | Mermaid | In-Markdown fenced blocks only — see constraints below |
| Styling | Custom CSS + UnoCSS utilities | `styles/index.css` + Tailwind-compatible class names |
| Fonts | Google Fonts — Red Hat Display / Text / JetBrains Mono | Loaded via `@import` in `styles/index.css` |

---

## How to run and review

### Start the dev server

From the template directory:

```bash
npm install
npm run dev
# or: make dev
```

The server starts at **http://localhost:3030**. Navigate to slide `N` at `/N`.

### Mandatory review workflow for slide changes

Do not judge slide quality from Markdown source alone. Layout issues, overflow, and contrast only appear in the browser.

1. Start (or reuse) the dev server.
2. Navigate to the changed slide.
3. Capture a screenshot of the full slide area using the IDE browser tool or equivalent.
4. Evaluate using the screenshot **and** the source:
   - Is anything clipped, overflowing, or overlapping?
   - Does the slide have one clear main idea?
   - Does the red accent, typography, and spacing read well at full-slide scale?
   - If the slide has a diagram or animation, does it still support the spoken story?
5. Propose the smallest fix that solves the issue (spacing class, `text-sm`, splitting a slide).
6. Ask for human feedback before sweeping restyles or large restructures — slides are subjective.

Repeat for **every slide you materially change**.

---

## Editing map

| File | What it controls |
|------|-----------------|
| `slides.md` | All slide content, frontmatter, Mermaid diagrams, speaker notes |
| `styles/index.css` | RH palette variables, typography, layout helpers (`.cols-2`, `.rh-tag`, `.rh-image-slide`) |
| `components/RhTwoColumn.vue` | Two-column slot wrapper |
| `components/RhTable.vue` | Props-driven HTML table with RH styling |
| `components/RhTimeline.vue` | Horizontal milestone timeline — takes `milestones[]` and optional `legend[]` props |
| `components/RhSpectrum.vue` | Maturity/spectrum scale — takes `stages[]` prop |
| `public/` | Static assets (images, SVGs) served at `/filename` |
| `package.json` | Slidev version, npm scripts |

Do not modify `node_modules/`. Do not hard-code version numbers in Terraform-style dependency pins inside `package.json` — let npm resolve ranges (`^0.49.0`).

---

## Slide frontmatter reference

Every slide is separated by `---` on its own line. A slide can carry optional frontmatter:

```yaml
---
layout: section       # Use with class: section-header for landmark slides
class: section-header # Applies the .section-header CSS class to the slide
---
```

```yaml
---
layout: center        # Centres all content; good for quote/closing slides
class: text-center    # Adds Tailwind text-center to the slide root
---
```

Available layouts from `@slidev/theme-default`:

| Layout | Use case |
|--------|----------|
| `default` | Standard content slide (no frontmatter needed) |
| `section` | Section landmark; large heading |
| `center` | Centred content; good for quotes and closing |
| `two-cols` | Built-in two-column with `::right::` divider |
| `image-right` | Image on the right, content on the left |
| `cover` | Full-bleed title slide variant |

The `section-header` class is custom (defined in `styles/index.css`) and must be paired with `layout: section`.

---

## Component authoring patterns

### Props-driven components

Prefer props over slots for structured data (tables, timelines, spectrum stages). This makes the component easy to use in Markdown without JSX-style syntax.

```vue
<script setup>
defineProps({
  items: { type: Array, required: true },
  title: { type: String, default: '' },
})
</script>
```

### Named slots for layout wrappers

Use named slots for layout components where the content is rich Markdown:

```vue
<template>
  <div class="cols-2">
    <div><slot name="left" /></div>
    <div><slot name="right" /></div>
  </div>
</template>
```

Called in Markdown as:

```md
<MyLayout>
  <template #left>

  Left content — Markdown works here, including **bold** and lists.

  </template>
  <template #right>

  Right content

  </template>
</MyLayout>
```

**Important:** leave a blank line after `<template #left>` and before `</template>`. Without it, Slidev does not parse the slot content as Markdown.

### Scoped styles

Use `<style scoped>` for component-specific CSS. For slide-level overrides that need specificity, scope under `.slidev-layout`:

```vue
<style scoped>
.my-component {
  color: var(--rh-red);
}
</style>
```

Do not override `.slidev-layout` styles from inside a component — that belongs in `styles/index.css`.

### Animated components

For CSS-animated SVG components (e.g. packet flow diagrams):
- Inline SVG directly in the template to allow CSS targeting.
- Use `<style scoped>` with `@keyframes` for animation.
- Wrap timing in CSS custom properties so they can be overridden per-instance.
- Reference `var(--rh-*)` palette variables rather than hard-coded hex values.

---

## Mermaid rules (critical)

### Rule 1: Mermaid blocks must be in plain slide Markdown

Mermaid fenced blocks **only render when placed directly in slide Markdown** — not inside Vue component template slots. Slot content bypasses the Mermaid transform pipeline.

```md
<!-- CORRECT: block is in normal slide Markdown -->
# My Slide

Some text.

\```mermaid
flowchart LR
  A --> B
\```
```

```md
<!-- WRONG: block is inside a Vue slot — renders as raw text -->
<RhTwoColumn>
  <template #right>

  \```mermaid
  flowchart LR
    A --> B
  \```

  </template>
</RhTwoColumn>
```

### Rule 2: Use the built-in two-cols layout for Mermaid + text columns

When you need a diagram alongside text, use Slidev's built-in `two-cols` layout:

```md
---
layout: two-cols
---

Left column Markdown content here.

::right::

\```mermaid
flowchart LR
  A --> B
\```
```

### Rule 3: Quote edge labels containing special characters

```
A -->|"O(1) lookup"| B    ← correct: quoted
A -->|O(1) lookup| B      ← breaks: parens parsed as node syntax
```

### Rule 4: Do not use explicit `fill:` / `color:` style statements in Mermaid

Hard-coded `style A fill:#EE0000` breaks in the Slidev Mermaid pipeline and looks bad in dark/light mode transitions. Use the default theme colours or rely on node shape to signal meaning.

### Rule 5: Avoid `end`, `subgraph`, `graph` as bare node IDs

These are reserved keywords that conflict with Mermaid parser rules. Use `endNode`, `processEnd`, etc. instead.

### Fallback: complex topology → PNG in public/

For diagrams that are too dense for Mermaid (many nodes, complex layout), generate a PNG/SVG externally, add it to `public/`, and use the `.rh-image-slide` pattern:

```md
<div class="rh-image-slide">

Caption text

<div class="rh-image-slide__figure">
<img src="/my-diagram.png" alt="Descriptive alt text" />
</div>

</div>
```

---

## CSS scoping rules

All slide typography and layout overrides must be scoped under `.slidev-layout`:

```css
/* Correct: scoped, won't bleed into presenter UI */
.slidev-layout h2 {
  color: var(--rh-blue);
}

/* Wrong: global, can break Slidev's own navigation UI */
h2 {
  color: var(--rh-blue);
}
```

Utility classes like `text-sm`, `mt-4`, `flex`, `items-center` are from Slidev's UnoCSS layer (Tailwind-compatible). Use them freely on elements inside slides. For arbitrary values, use bracket notation: `text-[var(--rh-muted)]`, `bg-[var(--rh-surface)]`.

---

## Sizing images correctly

`max-h-[Xvh]` on images is **relative to the browser viewport**, not Slidev's scaled slide canvas. At small browser windows or in presenter mode, this causes unexpected overflow.

Use the `.rh-image-slide` flex wrapper instead — it fills the available height below the title and caption without overflowing the slide canvas:

```md
<div class="rh-image-slide">

Caption text

<div class="rh-image-slide__figure">
<img src="/diagram.png" alt="Alt text" />
</div>

</div>
```

The supporting CSS in `styles/index.css` handles the flex layout automatically.

---

## Known pitfalls

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| Mermaid in a Vue slot | Raw fenced block rendered as text | Move to plain slide Markdown or use `two-cols` layout |
| `max-h-[Xvh]` on images | Image overflows at small viewports | Use `.rh-image-slide` flex wrapper |
| Goto dialog list visible when closed | Stray list on the right edge of every slide | Patched in `styles/index.css` (`#slidev-goto-dialog:has(input:disabled)`) — do not remove |
| `--base` in `dev` script | 404 on assets during local dev | `--base` belongs only in the `build` script |
| Mermaid edge labels with parens | Diagram parse error | Wrap label in quotes |
| Reserved keyword as node ID | Diagram parse error | Use `endNode`, not `end` |
| Props in Markdown arrays with single quotes | Vue template parse error | Use double quotes inside `:rows="[...]"` |
| Missing blank line inside slot `<template>` | Slot content rendered as raw HTML, not Markdown | Add blank line after `<template #slot>` and before `</template>` |

---

## Speaker notes

Every slide should include a speaker note — an HTML comment block below the slide body:

```md
# My Slide

Slide content here.

<!--
Speaker note: What to say for this slide. What to emphasise.
Transition: how to bridge to the next slide.
-->
```

Notes appear in presenter view. Write them as speaking prompts, not full scripts — one or two sentences per slide is enough.

---

## Self-review checklist

Before handing off any slide work:

- [ ] Dev server runs without errors (`npm run dev`)
- [ ] Every changed slide has been screenshot-reviewed in the browser
- [ ] No text is clipped, overflowing, or overlapping any other element
- [ ] Mermaid diagrams render correctly (not as raw code fences)
- [ ] Images use the `.rh-image-slide` wrapper or explicit `max-h` tuned to the slide
- [ ] Every slide has a speaker note
- [ ] No hard-coded hex colours that conflict with `--rh-*` palette variables
- [ ] `npm run build` succeeds before declaring the deck ready for production

---

## Adding a new slide format

1. Identify the information type and the closest existing format in `slides.md`.
2. Add the new slide **after** the existing examples, with a comment header explaining the format.
3. If the format requires a new component, create it in `components/` following the authoring patterns above.
4. Document the new component in `README.md` (props table, usage example).
5. Screenshot-review the new slide before committing.

---

## Promoting to its own git repo

When extracting this template to a standalone repository:

1. Copy the directory contents (not the parent repo).
2. Run `git init && git add . && git commit -m "Initial commit"`.
3. Update `package.json` `name` and the `build --base` flag to match the new repo name.
4. Remove any references to the parent repo from `README.md`.
5. Verify `make build` succeeds in the new location.
