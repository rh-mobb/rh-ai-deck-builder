# Slidev Red Hat Theme — Design Spec

## Overview

A from-scratch Slidev theme (`slidev-theme-red-hat`) implementing Red Hat brand standards using the official `@rhds/tokens` design token package. The theme supports both light and dark color schemes, ships a full custom layout set, and is structured for eventual npm publishing.

The theme is part of the `mobb-deck-template` monorepo but remains decoupled from the existing `addon/` package (which provides reusable Vue components like RhTwoColumn, RhTable, etc.). Decks reference both independently.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Color scheme | Both (light + dark) | RHDS tokens provide full `on-light`/`on-dark` semantic variants |
| Layouts | Full custom set (14 layouts) | Strong brand identity on every slide |
| Font loading | Via `@rhds/tokens` npm package | Stays in sync with official design system |
| Addon relationship | Separate package | Matches Slidev's theme/addon separation; decks opt in independently |
| Publishing | Publishable (`slidev-theme-red-hat`) | Follow Slidev conventions, use locally via `file:` for now |
| Aspect ratio | 16/9 default | Standard for tech talks and conferences |
| Architecture | CSS layers + RHDS token mapping | Clean abstraction, no specificity wars, centralized light/dark switching |

## Package Structure

```
theme/
├── package.json          # slidev-theme-red-hat
├── index.ts              # entry point, imports styles
├── styles/
│   ├── tokens.css        # @layer tokens — imports @rhds/tokens, maps to --slidev-rh-* vars
│   ├── base.css          # @layer base — typography, resets, slide defaults
│   └── layouts.css       # @layer layouts — per-layout styling
├── layouts/
│   ├── default.vue
│   ├── cover.vue
│   ├── center.vue
│   ├── two-cols.vue
│   ├── two-cols-header.vue
│   ├── section.vue
│   ├── quote.vue
│   ├── fact.vue
│   ├── statement.vue
│   ├── image.vue
│   ├── image-left.vue
│   ├── image-right.vue
│   ├── intro.vue
│   └── end.vue
├── setup/
│   └── shiki.ts          # code highlighting theme config
├── slides.md             # example deck showcasing all layouts (required for publishing)
└── public/
    └── red-hat-logo.svg  # brand assets
```

### package.json

```json
{
  "name": "slidev-theme-red-hat",
  "version": "0.1.0",
  "description": "A Slidev theme implementing Red Hat brand standards",
  "keywords": ["slidev-theme", "slidev", "red-hat"],
  "license": "MIT",
  "main": "index.ts",
  "engines": {
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
      "aspectRatio": "16/9"
    }
  }
}
```

## CSS Layer Architecture

Three CSS layers in cascade order (lowest to highest priority):

```css
@layer tokens, base, layouts;
```

### Tokens Layer (`styles/tokens.css`)

Imports `@rhds/tokens` and maps RHDS tokens to Slidev-specific custom properties. This is the **only** file that references `--rh-*` tokens directly. Everything else uses the `--slidev-rh-*` abstraction.

**Light mode (`:root`):**

| Slidev Token | RHDS Source | Purpose |
|-------------|-------------|---------|
| `--slidev-rh-bg` | `--rh-color-surface-lightest` (#FFFFFF) | Slide background |
| `--slidev-rh-bg-alt` | `--rh-color-surface-lighter` (#F2F2F2) | Alternate background (section slides, code blocks) |
| `--slidev-rh-surface` | `--rh-color-surface-light` (#E0E0E0) | Card/panel surfaces |
| `--slidev-rh-text-primary` | `--rh-color-text-primary-on-light` (#151515) | Primary text |
| `--slidev-rh-text-secondary` | `--rh-color-text-secondary-on-light` (#4D4D4D) | Secondary/muted text |
| `--slidev-rh-text-brand` | `--rh-color-brand-red-on-light` (#EE0000) | Brand-colored text |
| `--slidev-rh-brand-red` | `--rh-color-red-50` (#EE0000) | Primary brand accent |
| `--slidev-rh-brand-red-light` | `--rh-color-red-40` (#F56E6E) | Light brand accent |
| `--slidev-rh-brand-red-dark` | `--rh-color-red-60` (#A60000) | Dark brand accent |
| `--slidev-rh-accent` | `--rh-color-accent-base-on-light` (#0066CC) | Accent color (links, interactive) |
| `--slidev-rh-link` | `--rh-color-interactive-primary-default-on-light` (#0066CC) | Link color |
| `--slidev-rh-link-hover` | `--rh-color-interactive-primary-hover-on-light` (#003366) | Link hover |
| `--slidev-rh-border-strong` | `--rh-color-border-strong-on-light` (#151515) | Strong borders |
| `--slidev-rh-border-subtle` | `--rh-color-border-subtle-on-light` (#C7C7C7) | Subtle borders/dividers |
| `--slidev-rh-status-danger` | `--rh-color-status-danger-on-light` (#B1380B) | Danger/error |
| `--slidev-rh-status-warning` | `--rh-color-status-warning-on-light` (#DCA614) | Warning |
| `--slidev-rh-status-success` | `--rh-color-status-success-on-light` (#3D7317) | Success |
| `--slidev-rh-status-info` | `--rh-color-status-info-on-light` (#5E40BE) | Info |
| `--slidev-rh-font-heading` | `--rh-font-family-heading` | Red Hat Display |
| `--slidev-rh-font-body` | `--rh-font-family-body-text` | Red Hat Text |
| `--slidev-rh-font-code` | `--rh-font-family-code` | Red Hat Mono |
| `--slidev-rh-space-sm` | `--rh-space-sm` (6px) | Small spacing |
| `--slidev-rh-space-md` | `--rh-space-md` (8px) | Medium spacing |
| `--slidev-rh-space-lg` | `--rh-space-lg` (16px) | Large spacing |
| `--slidev-rh-space-xl` | `--rh-space-xl` (24px) | Extra large spacing |
| `--slidev-rh-space-2xl` | `--rh-space-2xl` (32px) | 2x extra large spacing |
| `--slidev-rh-space-3xl` | `--rh-space-3xl` (48px) | 3x extra large spacing (slide padding) |

**Dark mode (`.dark`):** Same `--slidev-rh-*` property names, remapped to `on-dark` RHDS variants:

| Slidev Token | RHDS Source (Dark) | Resolved Value |
|-------------|-------------------|----------------|
| `--slidev-rh-bg` | `--rh-color-surface-darkest` | #151515 |
| `--slidev-rh-bg-alt` | `--rh-color-surface-darker` | #1F1F1F |
| `--slidev-rh-surface` | `--rh-color-surface-dark` | #383838 |
| `--slidev-rh-text-primary` | `--rh-color-text-primary-on-dark` | #FFFFFF |
| `--slidev-rh-text-secondary` | `--rh-color-text-secondary-on-dark` | #C7C7C7 |
| `--slidev-rh-accent` | `--rh-color-accent-base-on-dark` | #92C5F9 |
| `--slidev-rh-link` | `--rh-color-interactive-primary-default-on-dark` | #92C5F9 |
| `--slidev-rh-link-hover` | `--rh-color-interactive-primary-hover-on-dark` | #B9DAFC |
| `--slidev-rh-border-strong` | `--rh-color-border-strong-on-dark` | #FFFFFF |
| `--slidev-rh-border-subtle` | `--rh-color-border-subtle-on-dark` | #707070 |
| `--slidev-rh-status-danger` | `--rh-color-status-danger-on-dark` | #F0561D |
| `--slidev-rh-status-warning` | `--rh-color-status-warning-on-dark` | #FFCC17 |
| `--slidev-rh-status-success` | `--rh-color-status-success-on-dark` | #87BB62 |
| `--slidev-rh-status-info` | `--rh-color-status-info-on-dark` | #B6A6E9 |

Brand red (`--slidev-rh-brand-red: #EE0000`) and typography tokens remain the same in both themes.

### Base Layer (`styles/base.css`)

Global typography, element resets, and slide defaults. All values reference `--slidev-rh-*` tokens only.

- `body` font: `--slidev-rh-font-body`, size `--rh-font-size-body-text-lg` (18px), line-height 1.5
- `h1`–`h6`: `--slidev-rh-font-heading`, sizes from RHDS heading scale (2xl down to xs)
- `h1` weight: 700, `h2`–`h3`: 500, `h4`–`h6`: 400
- `code`, `pre`: `--slidev-rh-font-code`, `--slidev-rh-bg-alt` background
- `a`: `--slidev-rh-link` color, underline on hover
- Slide canvas: `background: var(--slidev-rh-bg)`, `color: var(--slidev-rh-text-primary)`
- Lists: `--slidev-rh-text-primary`, moderate spacing

### Layouts Layer (`styles/layouts.css`)

Per-layout refinements. Highest cascade priority.

- Layout-specific padding overrides
- Accent bar positioning
- Cover/section/end background treatments
- Image layout overlays

## Layouts

### Core Layouts

**`default`** — Standard content slide
- 4px `--slidev-rh-brand-red` accent bar at top
- Content area padded with `--slidev-rh-space-3xl` (48px)
- Default slot for all content

**`cover`** — Title/cover slide
- Full-slide brand treatment, no top accent bar (the whole slide IS the brand moment)
- Centered vertically: title (h1, heading-2xl), subtitle slot, date/event line
- Red Hat logo in bottom corner
- Optional background image via `image` frontmatter prop

**`center`** — Centered content
- No header/footer chrome
- Content centered both horizontally and vertically
- 4px top accent bar

**`end`** — Closing/CTA slide
- Red Hat logo prominent
- CTA text area
- Contact/links section
- Brand red accent treatment

### Content Layouts

**`two-cols`** — Two-column split
- Uses `::right::` slot separator
- Vertical divider line using `--slidev-rh-border-subtle`
- Equal 50/50 split by default
- 4px top accent bar

**`two-cols-header`** — Header + two columns
- Full-width header area (`::default::` slot)
- Two columns below (`::right::` slot for right column)
- 4px top accent bar

**`section`** — Section divider
- `--slidev-rh-bg-alt` background
- Large heading (`heading-2xl`) with `--slidev-rh-font-heading` weight 700
- Thick (8px) `--slidev-rh-brand-red` left accent bar beside the heading
- Optional subtitle/description text

**`quote`** — Blockquote
- 4px `--slidev-rh-brand-red` left border on the quote block
- Quote text in `--slidev-rh-font-body`, italic, slightly larger size
- Attribution line in `--slidev-rh-text-secondary`
- 4px top accent bar

**`fact`** — Data/stat display
- Large number/stat in `--slidev-rh-brand-red`, `heading-2xl` size or larger
- Description text below in `--slidev-rh-text-secondary`
- Centered layout
- 4px top accent bar

**`statement`** — Bold statement
- Centered, larger body text
- `--slidev-rh-font-heading` for emphasis
- 4px top accent bar

**`intro`** — Speaker introduction
- Photo area (circular crop) on one side
- Name, title, bio text on the other
- 4px top accent bar

### Image Layouts

**`image`** — Full-bleed background image
- Image fills entire slide via `background-image` from `image` frontmatter
- Optional semi-transparent overlay for text readability
- No top accent bar (image fills to edges)

**`image-left`** — Image left, content right
- Left half: image via `image` frontmatter
- Right half: content slot with standard padding
- 4px top accent bar on right half only

**`image-right`** — Image right, content left
- Mirror of `image-left`

### Common Layout Elements

- **Top accent bar:** 4px `--slidev-rh-brand-red` pseudo-element at top of slide (most layouts)
- **Slide padding:** `--slidev-rh-space-3xl` (48px) default
- **Footer slot:** All layouts expose an optional `::footer::` slot, hidden by default

## Code Highlighting (Shiki)

Configured in `setup/shiki.ts`:

- **Light theme:** Based on `vitesse-light`, keyword tokens recolored: keywords #EE0000, strings #0066CC, types #37A3A3, comments #707070
- **Dark theme:** Based on `vitesse-dark`, keyword tokens recolored: keywords #F56E6E, strings #92C5F9, types #63BDBD, comments #A3A3A3
- Code block styling: `--slidev-rh-bg-alt` background, `--slidev-rh-font-code` font, `--slidev-rh-border-subtle` border
- Line highlighting: `--slidev-rh-brand-red` at 10% opacity

## Mermaid Diagram Theming

- Light mode: Mermaid `default` theme with RHDS-derived `themeVariables`
- Dark mode: Mermaid `dark` theme with RHDS dark palette values
- `primaryColor`: `--rh-color-red-50` (#EE0000)
- `primaryTextColor`: maps to text-primary for current scheme
- `lineColor`: maps to border-subtle for current scheme
- Node backgrounds map to surface tokens
- Column overflow prevention (existing fix preserved)

## Migration Path

After the theme is complete and verified:

1. **Addon update:** Update `addon/` components to use `--slidev-rh-*` tokens instead of hardcoded color values
2. **Deck references:** Update each deck's `package.json` to reference the new theme (`"slidev-theme-red-hat": "file:../../theme"`)
3. **Frontmatter:** Update each deck's `slides.md` headmatter to `theme: slidev-theme-red-hat`
4. **Verification:** Test each deck in both light and dark modes, check all layouts render correctly
5. **Template update:** Update `template/` to reference the new theme and token conventions

## Out of Scope

- Publishing to npm (future task — structure supports it but we won't publish yet)
- New addon components (addon stays separate, updated to use new tokens)
- Animated components (remain in addon or per-deck components)
- International font support (RHDS tokens include Noto Sans variants but we won't configure these initially)
