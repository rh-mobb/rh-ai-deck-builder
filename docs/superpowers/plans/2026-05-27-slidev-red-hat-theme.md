# Slidev Red Hat Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a from-scratch Slidev theme (`slidev-theme-red-hat`) implementing Red Hat brand standards via `@rhds/tokens`, with CSS layer architecture, 14 custom layouts, and light/dark support.

**Architecture:** Three CSS layers (tokens → base → layouts) map `@rhds/tokens` to `--slidev-rh-*` custom properties. Vue layout components consume only the `--slidev-rh-*` abstraction. Light/dark switching is centralized in the tokens layer via Slidev's `.dark` class.

**Tech Stack:** Slidev 0.49+, Vue 3 (SFC), `@rhds/tokens` 3.x, CSS `@layer`, Shiki (code highlighting)

**Spec:** `docs/superpowers/specs/2026-05-27-slidev-red-hat-theme-design.md`

**Reference:** Red Hat design tokens source is cloned at `./reference/` — use the YAML files in `reference/tokens/` as the authoritative source for token values.

---

## File Map

### Create (new files)

| File | Responsibility |
|------|---------------|
| `theme/package.json` | Package identity, slidev config, dependencies |
| `theme/index.ts` | Entry point — imports style layers |
| `theme/styles/tokens.css` | `@layer tokens` — imports @rhds/tokens, maps to --slidev-rh-* |
| `theme/styles/base.css` | `@layer base` — typography, resets, element defaults |
| `theme/styles/layouts.css` | `@layer layouts` — per-layout styling |
| `theme/layouts/default.vue` | Standard content slide |
| `theme/layouts/cover.vue` | Title/cover slide |
| `theme/layouts/center.vue` | Centered content |
| `theme/layouts/section.vue` | Section divider |
| `theme/layouts/two-cols.vue` | Two-column split |
| `theme/layouts/two-cols-header.vue` | Header + two columns |
| `theme/layouts/quote.vue` | Blockquote layout |
| `theme/layouts/fact.vue` | Large stat/number display |
| `theme/layouts/statement.vue` | Bold centered statement |
| `theme/layouts/intro.vue` | Speaker introduction |
| `theme/layouts/image.vue` | Full-bleed background image |
| `theme/layouts/image-left.vue` | Image left, content right |
| `theme/layouts/image-right.vue` | Image right, content left |
| `theme/layouts/end.vue` | Closing/CTA slide |
| `theme/setup/shiki.ts` | Code highlighting theme config |
| `theme/slides.md` | Example deck showcasing all layouts |

### Delete (clean slate)

| File | Reason |
|------|--------|
| `theme/styles/index.css` | Replaced by layered CSS architecture |
| `theme/layouts/default.vue` | Replaced by new implementation |
| `theme/index.ts` | Replaced by new implementation |
| `theme/package.json` | Replaced by new implementation |
| `theme/README.md` | Will be recreated if needed |

---

## Task 1: Clean Slate and Package Setup

**Files:**
- Delete: `theme/styles/index.css`, `theme/layouts/default.vue`, `theme/index.ts`, `theme/package.json`, `theme/README.md`
- Create: `theme/package.json`

- [ ] **Step 1: Remove existing theme files**

```bash
rm -rf theme/styles theme/layouts theme/index.ts theme/package.json theme/README.md theme/node_modules theme/package-lock.json
```

- [ ] **Step 2: Create directory structure**

```bash
mkdir -p theme/styles theme/layouts theme/setup theme/public
```

- [ ] **Step 3: Create package.json**

Write `theme/package.json`:

```json
{
  "name": "slidev-theme-red-hat",
  "version": "0.1.0",
  "description": "A Slidev theme implementing Red Hat brand standards",
  "keywords": ["slidev-theme", "slidev", "red-hat"],
  "author": "Paul Czarkowski <paul@redhat.com>",
  "license": "MIT",
  "main": "index.ts",
  "files": [
    "styles",
    "layouts",
    "setup",
    "public",
    "index.ts"
  ],
  "engines": {
    "node": ">=18.0.0",
    "slidev": ">=0.49.0"
  },
  "dependencies": {
    "@rhds/tokens": "^3.1.0"
  },
  "peerDependencies": {
    "@slidev/cli": ">=0.49.0",
    "@slidev/client": ">=0.49.0"
  },
  "slidev": {
    "colorSchema": "both",
    "defaults": {
      "aspectRatio": "16/9",
      "highlighter": "shiki"
    }
  }
}
```

- [ ] **Step 4: Install dependencies**

```bash
cd theme && npm install
```

- [ ] **Step 5: Commit**

```bash
git add theme/package.json theme/package-lock.json
git commit -m "feat(theme): scaffold slidev-theme-red-hat package"
```

---

## Task 2: Tokens Layer

**Files:**
- Create: `theme/styles/tokens.css`

This is the foundation — every other file depends on these `--slidev-rh-*` custom properties.

- [ ] **Step 1: Create tokens.css**

Write `theme/styles/tokens.css`:

```css
@layer tokens {
  @import '@rhds/tokens/css/global.css' layer(tokens);

  :root {
    /* Surface */
    --slidev-rh-bg: var(--rh-color-surface-lightest, #FFFFFF);
    --slidev-rh-bg-alt: var(--rh-color-surface-lighter, #F2F2F2);
    --slidev-rh-surface: var(--rh-color-surface-light, #E0E0E0);

    /* Text */
    --slidev-rh-text-primary: var(--rh-color-text-primary-on-light, #151515);
    --slidev-rh-text-secondary: var(--rh-color-text-secondary-on-light, #4D4D4D);
    --slidev-rh-text-brand: var(--rh-color-brand-red-on-light, #EE0000);

    /* Brand */
    --slidev-rh-brand-red: var(--rh-color-red-50, #EE0000);
    --slidev-rh-brand-red-light: var(--rh-color-red-40, #F56E6E);
    --slidev-rh-brand-red-dark: var(--rh-color-red-60, #A60000);

    /* Accent / Interactive */
    --slidev-rh-accent: var(--rh-color-accent-base-on-light, #0066CC);
    --slidev-rh-link: var(--rh-color-interactive-primary-default-on-light, #0066CC);
    --slidev-rh-link-hover: var(--rh-color-interactive-primary-hover-on-light, #003366);

    /* Border */
    --slidev-rh-border-strong: var(--rh-color-border-strong-on-light, #151515);
    --slidev-rh-border-subtle: var(--rh-color-border-subtle-on-light, #C7C7C7);

    /* Status */
    --slidev-rh-status-danger: var(--rh-color-status-danger-on-light, #B1380B);
    --slidev-rh-status-warning: var(--rh-color-status-warning-on-light, #DCA614);
    --slidev-rh-status-success: var(--rh-color-status-success-on-light, #3D7317);
    --slidev-rh-status-info: var(--rh-color-status-info-on-light, #5E40BE);

    /* Typography */
    --slidev-rh-font-heading: var(--rh-font-family-heading, 'Red Hat Display', Helvetica, Arial, sans-serif);
    --slidev-rh-font-body: var(--rh-font-family-body-text, 'Red Hat Text', Helvetica, Arial, sans-serif);
    --slidev-rh-font-code: var(--rh-font-family-code, 'Red Hat Mono', 'Courier New', Courier, monospace);

    /* Spacing */
    --slidev-rh-space-xs: var(--rh-space-xs, 4px);
    --slidev-rh-space-sm: var(--rh-space-sm, 6px);
    --slidev-rh-space-md: var(--rh-space-md, 8px);
    --slidev-rh-space-lg: var(--rh-space-lg, 16px);
    --slidev-rh-space-xl: var(--rh-space-xl, 24px);
    --slidev-rh-space-2xl: var(--rh-space-2xl, 32px);
    --slidev-rh-space-3xl: var(--rh-space-3xl, 48px);
    --slidev-rh-space-4xl: var(--rh-space-4xl, 64px);
  }

  .dark {
    /* Surface */
    --slidev-rh-bg: var(--rh-color-surface-darkest, #151515);
    --slidev-rh-bg-alt: var(--rh-color-surface-darker, #1F1F1F);
    --slidev-rh-surface: var(--rh-color-surface-dark, #383838);

    /* Text */
    --slidev-rh-text-primary: var(--rh-color-text-primary-on-dark, #FFFFFF);
    --slidev-rh-text-secondary: var(--rh-color-text-secondary-on-dark, #C7C7C7);

    /* Accent / Interactive */
    --slidev-rh-accent: var(--rh-color-accent-base-on-dark, #92C5F9);
    --slidev-rh-link: var(--rh-color-interactive-primary-default-on-dark, #92C5F9);
    --slidev-rh-link-hover: var(--rh-color-interactive-primary-hover-on-dark, #B9DAFC);

    /* Border */
    --slidev-rh-border-strong: var(--rh-color-border-strong-on-dark, #FFFFFF);
    --slidev-rh-border-subtle: var(--rh-color-border-subtle-on-dark, #707070);

    /* Status */
    --slidev-rh-status-danger: var(--rh-color-status-danger-on-dark, #F0561D);
    --slidev-rh-status-warning: var(--rh-color-status-warning-on-dark, #FFCC17);
    --slidev-rh-status-success: var(--rh-color-status-success-on-dark, #87BB62);
    --slidev-rh-status-info: var(--rh-color-status-info-on-dark, #B6A6E9);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add theme/styles/tokens.css
git commit -m "feat(theme): add tokens layer mapping @rhds/tokens to --slidev-rh-*"
```

---

## Task 3: Base Layer

**Files:**
- Create: `theme/styles/base.css`

Global typography, element styling, slide canvas defaults. References only `--slidev-rh-*` tokens.

- [ ] **Step 1: Create base.css**

Write `theme/styles/base.css`:

```css
@layer base {
  /* Slide canvas */
  .slidev-layout {
    background: var(--slidev-rh-bg);
    color: var(--slidev-rh-text-primary);
    font-family: var(--slidev-rh-font-body);
    font-size: 1.125rem;
    line-height: 1.5;
    padding: var(--slidev-rh-space-3xl);
  }

  /* Headings */
  .slidev-layout :is(h1, h2, h3, h4, h5, h6) {
    font-family: var(--slidev-rh-font-heading);
    color: var(--slidev-rh-text-primary);
    line-height: 1.3;
    margin-bottom: var(--slidev-rh-space-lg);
  }

  .slidev-layout h1 {
    font-size: 3rem;
    font-weight: 700;
  }

  .slidev-layout h2 {
    font-size: 2.5rem;
    font-weight: 500;
  }

  .slidev-layout h3 {
    font-size: 2.25rem;
    font-weight: 500;
  }

  .slidev-layout h4 {
    font-size: 1.75rem;
    font-weight: 400;
  }

  .slidev-layout h5 {
    font-size: 1.5rem;
    font-weight: 400;
  }

  .slidev-layout h6 {
    font-size: 1.25rem;
    font-weight: 400;
  }

  /* Body text */
  .slidev-layout p {
    margin-bottom: var(--slidev-rh-space-lg);
  }

  /* Links */
  .slidev-layout a {
    color: var(--slidev-rh-link);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .slidev-layout a:hover {
    color: var(--slidev-rh-link-hover);
    text-decoration: underline;
  }

  /* Lists */
  .slidev-layout :is(ul, ol) {
    margin-bottom: var(--slidev-rh-space-lg);
    padding-left: var(--slidev-rh-space-xl);
  }

  .slidev-layout li {
    margin-bottom: var(--slidev-rh-space-sm);
  }

  .slidev-layout li::marker {
    color: var(--slidev-rh-brand-red);
  }

  /* Code */
  .slidev-layout code {
    font-family: var(--slidev-rh-font-code);
    font-size: 0.9em;
    background: var(--slidev-rh-bg-alt);
    padding: 0.15em 0.4em;
    border-radius: 3px;
    border: 1px solid var(--slidev-rh-border-subtle);
  }

  .slidev-layout pre {
    font-family: var(--slidev-rh-font-code);
    background: var(--slidev-rh-bg-alt);
    border: 1px solid var(--slidev-rh-border-subtle);
    border-radius: 6px;
    padding: var(--slidev-rh-space-lg);
    overflow-x: auto;
    margin-bottom: var(--slidev-rh-space-lg);
  }

  .slidev-layout pre code {
    background: none;
    padding: 0;
    border: none;
    font-size: 0.875rem;
  }

  /* Tables */
  .slidev-layout table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: var(--slidev-rh-space-lg);
  }

  .slidev-layout th {
    font-family: var(--slidev-rh-font-heading);
    font-weight: 500;
    text-align: left;
    padding: var(--slidev-rh-space-md) var(--slidev-rh-space-lg);
    border-bottom: 2px solid var(--slidev-rh-brand-red);
    color: var(--slidev-rh-text-primary);
  }

  .slidev-layout td {
    padding: var(--slidev-rh-space-md) var(--slidev-rh-space-lg);
    border-bottom: 1px solid var(--slidev-rh-border-subtle);
  }

  .slidev-layout tr:hover td {
    background: var(--slidev-rh-bg-alt);
  }

  /* Blockquotes */
  .slidev-layout blockquote {
    border-left: 4px solid var(--slidev-rh-brand-red);
    padding-left: var(--slidev-rh-space-xl);
    margin: var(--slidev-rh-space-lg) 0;
    color: var(--slidev-rh-text-secondary);
    font-style: italic;
  }

  /* Horizontal rule */
  .slidev-layout hr {
    border: none;
    height: 2px;
    background: var(--slidev-rh-border-subtle);
    margin: var(--slidev-rh-space-xl) 0;
  }

  /* Strong / emphasis */
  .slidev-layout strong {
    font-weight: 700;
    color: var(--slidev-rh-text-primary);
  }

  .slidev-layout em {
    font-style: italic;
  }

  /* Shiki code block overrides */
  .slidev-layout .shiki {
    background: var(--slidev-rh-bg-alt) !important;
    border: 1px solid var(--slidev-rh-border-subtle);
    border-radius: 6px;
  }

  /* Mermaid diagram container */
  .slidev-layout .mermaid {
    max-width: 100%;
    overflow: hidden;
  }

  .slidev-layout .mermaid svg {
    max-width: 100%;
    height: auto;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add theme/styles/base.css
git commit -m "feat(theme): add base layer with typography and element defaults"
```

---

## Task 4: Entry Point and Minimal Verification

**Files:**
- Create: `theme/index.ts`
- Create: `theme/slides.md` (minimal, just to verify styles load)

- [ ] **Step 1: Create index.ts**

Write `theme/index.ts`:

```ts
import './styles/tokens.css'
import './styles/base.css'
import './styles/layouts.css'
```

- [ ] **Step 2: Create empty layouts.css placeholder**

Write `theme/styles/layouts.css`:

```css
@layer tokens, base, layouts;

/* Layout-specific styles — populated as layouts are added */
@layer layouts {
}
```

- [ ] **Step 3: Create minimal slides.md for verification**

Write `theme/slides.md`:

```md
---
theme: ./
colorSchema: auto
---

# Slidev Theme Red Hat

A theme implementing Red Hat brand standards.

---

# Typography Test

## Heading 2

### Heading 3

Body text in **Red Hat Text**. Links look like [this](https://redhat.com).

- Bullet one
- Bullet two
- Bullet three

---

# Code Test

Inline `code` and a block:

\`\`\`ts
function greet(name: string): string {
  return \`Hello, \${name}!\`
}
\`\`\`

---

# Dark Mode Test

> Toggle dark mode with the Slidev UI to verify token switching.

| Feature | Light | Dark |
|---------|-------|------|
| Background | #FFFFFF | #151515 |
| Text | #151515 | #FFFFFF |
| Brand Red | #EE0000 | #EE0000 |
```

- [ ] **Step 4: Run dev server to verify styles load**

```bash
cd theme && npx slidev --open false
```

Open `http://localhost:3030` in browser. Verify:
- Red Hat Text font loads for body
- Red Hat Display font loads for headings
- Light mode: white background, dark text
- Dark mode toggle: dark background, white text
- Brand red appears on list markers and table header border
- Code blocks have the alternate background color

- [ ] **Step 5: Commit**

```bash
git add theme/index.ts theme/styles/layouts.css theme/slides.md
git commit -m "feat(theme): add entry point and verification slides"
```

---

## Task 5: Default Layout

**Files:**
- Create: `theme/layouts/default.vue`

The workhorse layout. Content area with 4px red accent bar at top.

- [ ] **Step 1: Create default.vue**

Write `theme/layouts/default.vue`:

```vue
<template>
  <div class="slidev-layout rh-default">
    <div class="rh-accent-bar" />
    <div class="rh-content">
      <slot />
    </div>
    <div class="rh-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.rh-default {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.rh-accent-bar {
  height: 4px;
  background: var(--slidev-rh-brand-red);
  flex-shrink: 0;
}

.rh-content {
  flex: 1;
  padding: var(--slidev-rh-space-3xl);
  overflow: auto;
}

.rh-footer {
  flex-shrink: 0;
  padding: 0 var(--slidev-rh-space-3xl) var(--slidev-rh-space-lg);
}

.rh-footer:empty {
  display: none;
}
</style>
```

- [ ] **Step 2: Add a slide using default layout to slides.md**

Append to `theme/slides.md`:

```md
---
layout: default
---

# Default Layout

This is the standard content slide with a red accent bar at top.

- Content goes here
- With standard padding
- And Red Hat styling
```

- [ ] **Step 3: Verify in browser**

Reload dev server. Verify the default layout slide shows:
- 4px red bar at top
- Content area with 48px padding
- Proper heading and body text styling

- [ ] **Step 4: Commit**

```bash
git add theme/layouts/default.vue theme/slides.md
git commit -m "feat(theme): add default layout with accent bar"
```

---

## Task 6: Cover Layout

**Files:**
- Create: `theme/layouts/cover.vue`

Title/cover slide with centered content and brand treatment.

- [ ] **Step 1: Create cover.vue**

Write `theme/layouts/cover.vue`:

```vue
<template>
  <div class="slidev-layout rh-cover" :style="backgroundStyle">
    <div class="rh-cover-overlay" />
    <div class="rh-cover-content">
      <slot />
    </div>
    <div class="rh-cover-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $frontmatter } = useSlideContext()

const backgroundStyle = computed(() => {
  const image = $frontmatter.image
  if (!image) return {}
  return {
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
})
</script>

<style scoped>
.rh-cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--slidev-rh-space-3xl);
  position: relative;
  background: var(--slidev-rh-bg);
}

.rh-cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--slidev-rh-brand-red) 0%,
    var(--slidev-rh-brand-red-dark) 100%
  );
  opacity: 0.05;
  pointer-events: none;
}

.rh-cover-content {
  position: relative;
  z-index: 1;
  max-width: 80%;
}

.rh-cover-content :deep(h1) {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: var(--slidev-rh-space-xl);
}

.rh-cover-content :deep(p) {
  font-size: 1.25rem;
  color: var(--slidev-rh-text-secondary);
}

.rh-cover-footer {
  position: absolute;
  bottom: var(--slidev-rh-space-xl);
  left: var(--slidev-rh-space-3xl);
  right: var(--slidev-rh-space-3xl);
  text-align: center;
  z-index: 1;
}

.rh-cover-footer:empty {
  display: none;
}

.rh-cover::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--slidev-rh-brand-red);
}
</style>
```

- [ ] **Step 2: Add cover slide to slides.md**

Replace the first slide in `theme/slides.md` with:

```md
---
theme: ./
colorSchema: auto
layout: cover
---

# Slidev Theme Red Hat

A theme implementing Red Hat brand standards

Powered by @rhds/tokens
```

- [ ] **Step 3: Verify in browser**

Verify cover slide:
- Centered title, large heading
- Subtle red gradient overlay on background
- 6px red bar at bottom
- Subtitle text in secondary color

- [ ] **Step 4: Commit**

```bash
git add theme/layouts/cover.vue theme/slides.md
git commit -m "feat(theme): add cover layout with brand treatment"
```

---

## Task 7: Center Layout

**Files:**
- Create: `theme/layouts/center.vue`

- [ ] **Step 1: Create center.vue**

Write `theme/layouts/center.vue`:

```vue
<template>
  <div class="slidev-layout rh-center">
    <div class="rh-accent-bar" />
    <div class="rh-center-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.rh-center {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.rh-accent-bar {
  height: 4px;
  background: var(--slidev-rh-brand-red);
  flex-shrink: 0;
}

.rh-center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--slidev-rh-space-3xl);
}
</style>
```

- [ ] **Step 2: Add to slides.md and verify**

Append to `theme/slides.md`:

```md
---
layout: center
---

# Centered Content

This content is centered both horizontally and vertically.
```

- [ ] **Step 3: Commit**

```bash
git add theme/layouts/center.vue theme/slides.md
git commit -m "feat(theme): add center layout"
```

---

## Task 8: Section Layout

**Files:**
- Create: `theme/layouts/section.vue`

Section divider with alternate background and thick red left accent bar.

- [ ] **Step 1: Create section.vue**

Write `theme/layouts/section.vue`:

```vue
<template>
  <div class="slidev-layout rh-section">
    <div class="rh-section-content">
      <div class="rh-section-accent" />
      <div class="rh-section-text">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rh-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--slidev-rh-bg-alt);
  padding: var(--slidev-rh-space-3xl);
}

.rh-section-content {
  display: flex;
  align-items: flex-start;
  gap: var(--slidev-rh-space-xl);
}

.rh-section-accent {
  width: 8px;
  min-height: 4rem;
  background: var(--slidev-rh-brand-red);
  border-radius: 2px;
  flex-shrink: 0;
  align-self: stretch;
}

.rh-section-text :deep(h1) {
  font-size: 3rem;
  font-weight: 700;
}

.rh-section-text :deep(p) {
  color: var(--slidev-rh-text-secondary);
  font-size: 1.25rem;
  margin-top: var(--slidev-rh-space-lg);
}
</style>
```

- [ ] **Step 2: Add to slides.md and verify**

Append to `theme/slides.md`:

```md
---
layout: section
---

# Section Divider

This marks a new section of the presentation
```

- [ ] **Step 3: Commit**

```bash
git add theme/layouts/section.vue theme/slides.md
git commit -m "feat(theme): add section divider layout"
```

---

## Task 9: Two-Column Layouts

**Files:**
- Create: `theme/layouts/two-cols.vue`
- Create: `theme/layouts/two-cols-header.vue`

- [ ] **Step 1: Create two-cols.vue**

Write `theme/layouts/two-cols.vue`:

```vue
<template>
  <div class="slidev-layout rh-two-cols">
    <div class="rh-accent-bar" />
    <div class="rh-cols-container">
      <div class="rh-col rh-col-left">
        <slot />
      </div>
      <div class="rh-col-divider" />
      <div class="rh-col rh-col-right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rh-two-cols {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.rh-accent-bar {
  height: 4px;
  background: var(--slidev-rh-brand-red);
  flex-shrink: 0;
}

.rh-cols-container {
  flex: 1;
  display: flex;
  gap: 0;
  padding: var(--slidev-rh-space-3xl);
  overflow: auto;
}

.rh-col {
  flex: 1;
  min-width: 0;
}

.rh-col-left {
  padding-right: var(--slidev-rh-space-xl);
}

.rh-col-right {
  padding-left: var(--slidev-rh-space-xl);
}

.rh-col-divider {
  width: 1px;
  background: var(--slidev-rh-border-subtle);
  flex-shrink: 0;
}
</style>
```

- [ ] **Step 2: Create two-cols-header.vue**

Write `theme/layouts/two-cols-header.vue`:

```vue
<template>
  <div class="slidev-layout rh-two-cols-header">
    <div class="rh-accent-bar" />
    <div class="rh-header-area">
      <slot />
    </div>
    <div class="rh-cols-container">
      <div class="rh-col rh-col-left">
        <slot name="left" />
      </div>
      <div class="rh-col-divider" />
      <div class="rh-col rh-col-right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rh-two-cols-header {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.rh-accent-bar {
  height: 4px;
  background: var(--slidev-rh-brand-red);
  flex-shrink: 0;
}

.rh-header-area {
  padding: var(--slidev-rh-space-3xl) var(--slidev-rh-space-3xl) var(--slidev-rh-space-lg);
}

.rh-cols-container {
  flex: 1;
  display: flex;
  gap: 0;
  padding: 0 var(--slidev-rh-space-3xl) var(--slidev-rh-space-3xl);
  overflow: auto;
}

.rh-col {
  flex: 1;
  min-width: 0;
}

.rh-col-left {
  padding-right: var(--slidev-rh-space-xl);
}

.rh-col-right {
  padding-left: var(--slidev-rh-space-xl);
}

.rh-col-divider {
  width: 1px;
  background: var(--slidev-rh-border-subtle);
  flex-shrink: 0;
}
</style>
```

- [ ] **Step 3: Add to slides.md and verify**

Append to `theme/slides.md`:

```md
---
layout: two-cols
---

# Left Column

Content on the left side.

- Point A
- Point B

::right::

# Right Column

Content on the right side.

- Point C
- Point D

---
layout: two-cols-header
---

# Two Columns with Header

This header spans the full width.

::left::

**Left content** goes here.

::right::

**Right content** goes here.
```

- [ ] **Step 4: Commit**

```bash
git add theme/layouts/two-cols.vue theme/layouts/two-cols-header.vue theme/slides.md
git commit -m "feat(theme): add two-cols and two-cols-header layouts"
```

---

## Task 10: Quote Layout

**Files:**
- Create: `theme/layouts/quote.vue`

- [ ] **Step 1: Create quote.vue**

Write `theme/layouts/quote.vue`:

```vue
<template>
  <div class="slidev-layout rh-quote">
    <div class="rh-accent-bar" />
    <div class="rh-quote-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.rh-quote {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.rh-accent-bar {
  height: 4px;
  background: var(--slidev-rh-brand-red);
  flex-shrink: 0;
}

.rh-quote-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--slidev-rh-space-3xl) var(--slidev-rh-space-4xl);
}

.rh-quote-content :deep(blockquote) {
  border-left: 4px solid var(--slidev-rh-brand-red);
  padding-left: var(--slidev-rh-space-2xl);
  margin: 0;
  font-size: 1.5rem;
  font-style: italic;
  color: var(--slidev-rh-text-primary);
  line-height: 1.4;
}

.rh-quote-content :deep(blockquote p:last-child) {
  margin-bottom: 0;
}

.rh-quote-content :deep(p:not(blockquote p)) {
  color: var(--slidev-rh-text-secondary);
  font-size: 1rem;
  margin-top: var(--slidev-rh-space-xl);
  padding-left: var(--slidev-rh-space-2xl);
}
</style>
```

- [ ] **Step 2: Add to slides.md and verify**

Append to `theme/slides.md`:

```md
---
layout: quote
---

> Any sufficiently advanced technology is indistinguishable from magic.

Arthur C. Clarke
```

- [ ] **Step 3: Commit**

```bash
git add theme/layouts/quote.vue theme/slides.md
git commit -m "feat(theme): add quote layout"
```

---

## Task 11: Fact and Statement Layouts

**Files:**
- Create: `theme/layouts/fact.vue`
- Create: `theme/layouts/statement.vue`

- [ ] **Step 1: Create fact.vue**

Write `theme/layouts/fact.vue`:

```vue
<template>
  <div class="slidev-layout rh-fact">
    <div class="rh-accent-bar" />
    <div class="rh-fact-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.rh-fact {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.rh-accent-bar {
  height: 4px;
  background: var(--slidev-rh-brand-red);
  flex-shrink: 0;
}

.rh-fact-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--slidev-rh-space-3xl);
}

.rh-fact-content :deep(h1) {
  font-size: 5rem;
  font-weight: 700;
  color: var(--slidev-rh-brand-red);
  margin-bottom: var(--slidev-rh-space-xl);
  line-height: 1.1;
}

.rh-fact-content :deep(p) {
  font-size: 1.25rem;
  color: var(--slidev-rh-text-secondary);
  max-width: 70%;
}
</style>
```

- [ ] **Step 2: Create statement.vue**

Write `theme/layouts/statement.vue`:

```vue
<template>
  <div class="slidev-layout rh-statement">
    <div class="rh-accent-bar" />
    <div class="rh-statement-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.rh-statement {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.rh-accent-bar {
  height: 4px;
  background: var(--slidev-rh-brand-red);
  flex-shrink: 0;
}

.rh-statement-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--slidev-rh-space-3xl) var(--slidev-rh-space-4xl);
}

.rh-statement-content :deep(h1),
.rh-statement-content :deep(h2) {
  font-family: var(--slidev-rh-font-heading);
  font-size: 2.5rem;
  font-weight: 500;
  line-height: 1.3;
  max-width: 80%;
}

.rh-statement-content :deep(p) {
  font-size: 1.125rem;
  color: var(--slidev-rh-text-secondary);
  margin-top: var(--slidev-rh-space-xl);
  max-width: 70%;
}
</style>
```

- [ ] **Step 3: Add to slides.md and verify**

Append to `theme/slides.md`:

```md
---
layout: fact
---

# 99.95%

Uptime SLA for ROSA with Hosted Control Planes

---
layout: statement
---

# Open source is the foundation of enterprise innovation

It's not just about code — it's about community.
```

- [ ] **Step 4: Commit**

```bash
git add theme/layouts/fact.vue theme/layouts/statement.vue theme/slides.md
git commit -m "feat(theme): add fact and statement layouts"
```

---

## Task 12: Intro Layout

**Files:**
- Create: `theme/layouts/intro.vue`

Speaker introduction with photo and bio.

- [ ] **Step 1: Create intro.vue**

Write `theme/layouts/intro.vue`:

```vue
<template>
  <div class="slidev-layout rh-intro">
    <div class="rh-accent-bar" />
    <div class="rh-intro-content">
      <div v-if="$frontmatter.image" class="rh-intro-photo">
        <img :src="$frontmatter.image" :alt="$frontmatter.imageAlt || 'Speaker photo'" />
      </div>
      <div class="rh-intro-text">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
</script>

<style scoped>
.rh-intro {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.rh-accent-bar {
  height: 4px;
  background: var(--slidev-rh-brand-red);
  flex-shrink: 0;
}

.rh-intro-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--slidev-rh-space-3xl);
  padding: var(--slidev-rh-space-3xl);
}

.rh-intro-photo {
  flex-shrink: 0;
}

.rh-intro-photo img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--slidev-rh-brand-red);
}

.rh-intro-text {
  flex: 1;
}

.rh-intro-text :deep(h1) {
  font-size: 2.5rem;
  margin-bottom: var(--slidev-rh-space-md);
}

.rh-intro-text :deep(h2) {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--slidev-rh-text-secondary);
  margin-bottom: var(--slidev-rh-space-xl);
}

.rh-intro-text :deep(p) {
  color: var(--slidev-rh-text-secondary);
}
</style>
```

- [ ] **Step 2: Add to slides.md and verify**

Append to `theme/slides.md`:

```md
---
layout: intro
image: https://via.placeholder.com/200
---

# Jane Developer

## Principal Engineer, Red Hat

I work on Kubernetes, OpenShift, and cloud-native infrastructure.
Previously at CoreOS and Google.
```

- [ ] **Step 3: Commit**

```bash
git add theme/layouts/intro.vue theme/slides.md
git commit -m "feat(theme): add intro layout for speaker introductions"
```

---

## Task 13: Image Layouts

**Files:**
- Create: `theme/layouts/image.vue`
- Create: `theme/layouts/image-left.vue`
- Create: `theme/layouts/image-right.vue`

- [ ] **Step 1: Create image.vue**

Write `theme/layouts/image.vue`:

```vue
<template>
  <div
    class="slidev-layout rh-image"
    :style="{
      backgroundImage: `url(${$frontmatter.image})`,
      backgroundSize: $frontmatter.backgroundSize || 'cover',
      backgroundPosition: $frontmatter.backgroundPosition || 'center',
    }"
  >
    <div class="rh-image-overlay" />
    <div class="rh-image-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
</script>

<style scoped>
.rh-image {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}

.rh-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    transparent 100%
  );
  pointer-events: none;
}

.rh-image-content {
  position: relative;
  z-index: 1;
  padding: var(--slidev-rh-space-3xl);
  color: #FFFFFF;
}

.rh-image-content :deep(h1),
.rh-image-content :deep(h2),
.rh-image-content :deep(h3),
.rh-image-content :deep(p) {
  color: #FFFFFF;
}
</style>
```

- [ ] **Step 2: Create image-left.vue**

Write `theme/layouts/image-left.vue`:

```vue
<template>
  <div class="slidev-layout rh-image-left">
    <div class="rh-image-side" :style="imageStyle" />
    <div class="rh-content-side">
      <div class="rh-accent-bar" />
      <div class="rh-content-inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $frontmatter } = useSlideContext()

const imageStyle = computed(() => ({
  backgroundImage: `url(${$frontmatter.image})`,
  backgroundSize: $frontmatter.backgroundSize || 'cover',
  backgroundPosition: $frontmatter.backgroundPosition || 'center',
}))
</script>

<style scoped>
.rh-image-left {
  display: flex;
  padding: 0;
}

.rh-image-side {
  width: 50%;
  flex-shrink: 0;
}

.rh-content-side {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.rh-accent-bar {
  height: 4px;
  background: var(--slidev-rh-brand-red);
  flex-shrink: 0;
}

.rh-content-inner {
  flex: 1;
  padding: var(--slidev-rh-space-3xl);
  overflow: auto;
}
</style>
```

- [ ] **Step 3: Create image-right.vue**

Write `theme/layouts/image-right.vue`:

```vue
<template>
  <div class="slidev-layout rh-image-right">
    <div class="rh-content-side">
      <div class="rh-accent-bar" />
      <div class="rh-content-inner">
        <slot />
      </div>
    </div>
    <div class="rh-image-side" :style="imageStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $frontmatter } = useSlideContext()

const imageStyle = computed(() => ({
  backgroundImage: `url(${$frontmatter.image})`,
  backgroundSize: $frontmatter.backgroundSize || 'cover',
  backgroundPosition: $frontmatter.backgroundPosition || 'center',
}))
</script>

<style scoped>
.rh-image-right {
  display: flex;
  padding: 0;
}

.rh-content-side {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.rh-accent-bar {
  height: 4px;
  background: var(--slidev-rh-brand-red);
  flex-shrink: 0;
}

.rh-content-inner {
  flex: 1;
  padding: var(--slidev-rh-space-3xl);
  overflow: auto;
}

.rh-image-side {
  width: 50%;
  flex-shrink: 0;
}
</style>
```

- [ ] **Step 4: Add to slides.md and verify**

Append to `theme/slides.md`:

```md
---
layout: image
image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920
---

# Full Bleed Image

Text overlaid on a full-bleed background image.

---
layout: image-left
image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=960
---

# Image Left

Content on the right side with an image filling the left half.

- Works great for visual storytelling
- Image from frontmatter `image` prop

---
layout: image-right
image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=960
---

# Image Right

Content on the left side with an image filling the right half.

- Mirror of image-left layout
- Same frontmatter API
```

- [ ] **Step 5: Commit**

```bash
git add theme/layouts/image.vue theme/layouts/image-left.vue theme/layouts/image-right.vue theme/slides.md
git commit -m "feat(theme): add image, image-left, and image-right layouts"
```

---

## Task 14: End Layout

**Files:**
- Create: `theme/layouts/end.vue`

Closing/CTA slide with logo and contact area.

- [ ] **Step 1: Create end.vue**

Write `theme/layouts/end.vue`:

```vue
<template>
  <div class="slidev-layout rh-end">
    <div class="rh-end-content">
      <slot />
    </div>
    <div class="rh-end-bar" />
  </div>
</template>

<style scoped>
.rh-end {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--slidev-rh-space-3xl);
  position: relative;
}

.rh-end-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.rh-end-content :deep(h1) {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--slidev-rh-space-xl);
}

.rh-end-content :deep(p) {
  color: var(--slidev-rh-text-secondary);
  font-size: 1.125rem;
  margin-bottom: var(--slidev-rh-space-md);
}

.rh-end-content :deep(a) {
  color: var(--slidev-rh-link);
}

.rh-end-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--slidev-rh-brand-red);
}
</style>
```

- [ ] **Step 2: Add to slides.md and verify**

Append to `theme/slides.md`:

```md
---
layout: end
---

# Thank You

github.com/yourorg/project

your.email@redhat.com
```

- [ ] **Step 3: Commit**

```bash
git add theme/layouts/end.vue theme/slides.md
git commit -m "feat(theme): add end/closing layout"
```

---

## Task 15: Add Footer Slot to All Layouts

**Files:**
- Modify: `theme/layouts/center.vue`, `theme/layouts/section.vue`, `theme/layouts/two-cols.vue`, `theme/layouts/two-cols-header.vue`, `theme/layouts/quote.vue`, `theme/layouts/fact.vue`, `theme/layouts/statement.vue`, `theme/layouts/intro.vue`, `theme/layouts/image.vue`, `theme/layouts/image-left.vue`, `theme/layouts/image-right.vue`, `theme/layouts/end.vue`

The spec requires all layouts to expose an optional `::footer::` slot (hidden by default). The `default.vue` and `cover.vue` layouts already have this. Add it to every other layout.

- [ ] **Step 1: Add footer slot to each layout**

For each layout listed above, add the following just before the closing `</div>` of the root element:

```vue
<div class="rh-footer">
  <slot name="footer" />
</div>
```

And add this to each layout's `<style scoped>`:

```css
.rh-footer {
  position: absolute;
  bottom: var(--slidev-rh-space-md);
  left: var(--slidev-rh-space-3xl);
  right: var(--slidev-rh-space-3xl);
  font-size: 0.75rem;
  color: var(--slidev-rh-text-secondary);
}

.rh-footer:empty {
  display: none;
}
```

Ensure the root element of each layout has `position: relative` so the absolute-positioned footer is anchored to the slide.

- [ ] **Step 2: Verify footer slot works**

Add `::footer::` content to one test slide and verify it appears at the bottom.

- [ ] **Step 3: Commit**

```bash
git add theme/layouts/
git commit -m "feat(theme): add footer slot to all layouts"
```

---

## Task 16: Shiki Code Highlighting Setup

**Files:**
- Create: `theme/setup/shiki.ts`

Configure code highlighting with RHDS-aligned colors for light and dark modes.

- [ ] **Step 1: Create shiki.ts**

Write `theme/setup/shiki.ts`:

```ts
import { defineShikiSetup } from '@slidev/types'

export default defineShikiSetup(() => {
  return {
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  }
})
```

- [ ] **Step 2: Verify code highlighting works**

Confirm that code blocks in the example slides render with syntax highlighting in both light and dark modes. The base.css already handles code block background and border styling.

- [ ] **Step 3: Commit**

```bash
git add theme/setup/shiki.ts
git commit -m "feat(theme): add shiki code highlighting setup"
```

---

## Task 17: Mermaid Diagram Theming

**Files:**
- Create: `theme/setup/mermaid.ts`

Configure Mermaid diagrams to use RHDS-aligned colors.

- [ ] **Step 1: Create mermaid.ts**

Write `theme/setup/mermaid.ts`:

```ts
import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => {
  return {
    theme: 'base',
    themeVariables: {
      primaryColor: '#EE0000',
      primaryTextColor: '#151515',
      primaryBorderColor: '#C7C7C7',
      secondaryColor: '#F2F2F2',
      secondaryTextColor: '#4D4D4D',
      tertiaryColor: '#E0E0E0',
      lineColor: '#C7C7C7',
      textColor: '#151515',
      mainBkg: '#FFFFFF',
      nodeBorder: '#C7C7C7',
      clusterBkg: '#F2F2F2',
      titleColor: '#151515',
      edgeLabelBackground: '#FFFFFF',
      fontFamily: '"Red Hat Text", Helvetica, Arial, sans-serif',
    },
  }
})
```

Note: Mermaid `themeVariables` don't support CSS custom properties — use raw hex values. The `base` theme with light palette provides the best cross-mode readability.

- [ ] **Step 2: Verify with a Mermaid slide and commit**

```bash
git add theme/setup/mermaid.ts
git commit -m "feat(theme): add mermaid diagram theming"
```

---

## Task 18: Brand Assets

**Files:**
- Create: `theme/public/red-hat-logo.svg`

- [ ] **Step 1: Add Red Hat logo SVG**

Source the Red Hat logo from official brand assets. If not available locally, create a placeholder:

Write `theme/public/red-hat-logo.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="currentColor">
  <!-- Replace with official Red Hat logo SVG from https://www.redhat.com/en/about/brand/standards/logo -->
  <text x="10" y="40" font-family="Red Hat Display, sans-serif" font-size="32" font-weight="700" fill="#EE0000">Red Hat</text>
</svg>
```

- [ ] **Step 2: Commit**

```bash
git add theme/public/red-hat-logo.svg
git commit -m "feat(theme): add placeholder brand logo asset"
```

---

## Task 19: Complete Example Slides

**Files:**
- Modify: `theme/slides.md`

Finalize the example deck so it showcases every layout — required for Slidev theme publishing. Consolidate all slides added incrementally in Tasks 5–14 into a clean, ordered deck.

- [ ] **Step 1: Write the final slides.md**

Replace `theme/slides.md` with the complete example deck containing slides in this order:

1. Cover slide (layout: cover)
2. Intro slide (layout: intro)
3. Default slide (layout: default) — typography showcase
4. Two-cols slide (layout: two-cols)
5. Two-cols-header slide (layout: two-cols-header)
6. Section divider (layout: section)
7. Code block slide (layout: default) — code highlighting showcase
8. Mermaid diagram slide (layout: default)
9. Quote slide (layout: quote)
10. Fact slide (layout: fact)
11. Statement slide (layout: statement)
12. Image full-bleed (layout: image)
13. Image-left (layout: image-left)
14. Image-right (layout: image-right)
15. Center slide (layout: center)
16. End slide (layout: end)

Each slide should use realistic Red Hat / open source themed content.

- [ ] **Step 2: Run dev server and walk through all slides**

```bash
cd theme && npx slidev --open false
```

Open `http://localhost:3030` in browser. Click through every slide and verify:
- Each layout renders correctly
- Light/dark toggle works on every slide
- Typography is consistent (Red Hat Display headings, Red Hat Text body)
- Brand red accent bars appear where expected
- No overflow or clipping issues
- Code blocks have proper highlighting
- Mermaid diagrams render with branded colors

- [ ] **Step 3: Commit**

```bash
git add theme/slides.md
git commit -m "feat(theme): complete example deck showcasing all layouts"
```

---

## Task 20: Final Verification and Cleanup

- [ ] **Step 1: Verify theme works as a dependency from a deck**

```bash
cd decks/test-default-theme
```

Update `package.json` to reference the new theme:

```json
{
  "dependencies": {
    "slidev-theme-red-hat": "file:../../theme"
  }
}
```

Update `slides.md` headmatter:

```md
---
theme: slidev-theme-red-hat
---
```

Install and run:

```bash
npm install && npx slidev --open false
```

Verify the theme loads correctly from a consuming deck.

- [ ] **Step 2: Test both color schemes from a deck**

Add `colorSchema: dark` to the headmatter, reload, and verify dark mode renders correctly. Then change to `colorSchema: light` and verify light mode. Then change to `colorSchema: auto` and verify the toggle works.

- [ ] **Step 3: Clean up any issues found during verification**

Fix any layout, styling, or token issues discovered. Each fix should be a targeted edit, not a rewrite.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(theme): complete slidev-theme-red-hat v0.1.0"
```
