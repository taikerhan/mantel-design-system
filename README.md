# Mantel Design System — Frontend Package (v2.0)

Everything you need to ship Mantel-styled UI: tokens, the production stylesheet, the live UI Kit reference, brand assets, and per-area preview pages.

## Quick start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="styles/mantel.css">
</head>
<body>
  <button class="btn btn-primary">Reply now</button>
  <button class="btn btn-secondary">View details</button>

  <div class="mt-field">
    <label class="mt-label">Recipient email</label>
    <input class="mt-input" type="email" placeholder="seller@example.com">
  </div>
</body>
</html>
```

That's it. No build step, no JS dependency, no framework lock-in. Geist + Geist Mono are pulled from Google Fonts at the top of `mantel.css`.

## What's in this package

```
frontend-handoff/
├── styles/
│   └── mantel.css        ← canonical stylesheet (link this)
├── assets/
│   ├── mantel-logo.svg          ← navy wordmark
│   └── mantel-logo-white.svg    ← reversed for dark surfaces
├── tokens.json           ← machine-readable design tokens
├── UI Kit.html           ← live spec sheet, 33 components
├── previews/
│   ├── Brand.html
│   ├── Colors.html
│   ├── Components.html
│   ├── Spacing.html
│   └── Type.html
├── SKILL.md              ← prose rules (when to use what)
└── README.md             ← you are here
```

## Token system

All tokens are defined as CSS custom properties in `mantel.css`. The same values are in `tokens.json` for tooling (Figma, Tailwind config, theme builders).

Headline tokens:
- **Primary** `--brand-600` `#0053A7` (hover `--brand-700`)
- **Body text** `--ink-800` `#1B1D20`
- **Page bg** `--ink-50` `#F8F9FB`
- **Card radius** `--radius-2xl` `16px`
- **Button radius** `--radius-full` `9999px`
- **Form radius** `--radius-md` `8px`
- **Font sans** `Geist`, **Font mono** `Geist Mono`

## Component library

Every component in `mantel.css` is namespaced `mt-*` so it won't collide with your existing class names.

| Area | Classes |
|------|---------|
| Form | `mt-input` · `mt-select` · `mt-textarea` · `mt-switch` · `mt-check` · `mt-radio` · `mt-field` · `mt-label` · `mt-help` |
| Overlays | `mt-modal` · `mt-sheet-right` · `mt-sheet-bottom` · `mt-backdrop` · `mt-overlay-head/-body/-foot` · `mt-grabber` |
| Feedback | `mt-alert` (5 tones) · `mt-toast` + `mt-toast-viewport` (5 tones, CTA actions, inverse) · `mt-tip` (top/bottom/right) |
| Navigation | `mt-pill-tabs` / `mt-pill-tab` (3 sizes + flat) · `mt-crumbs` · `mt-pager` |
| Actions | `mt-menu` · `mt-btn-group` · `mt-btn-split` |
| State | `mt-empty` · `mt-skeleton` (4 variants) |

Buttons use the unprefixed `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-icon` from the base sheet.

## Headline rules

- **Primary action** `--brand-600`. Hover `--brand-700`. ≤1 per surface.
- **Body text** on `--ink-800`. Secondary `--ink-500`.
- **Cards** are 16px radius, white, **no visible border** — use `--shadow-card` inset hairline ring instead.
- **Buttons** are `rounded-full`. Three variants: primary fill, secondary 1px brand border, icon transparent.
- **Form chrome** uses 8px radius with `--ink-400` borders that step to `--ink-500` on hover.
- **Status colors are semantic, never decorative.** Green = signed/strong. Amber = cool. Red = urgent/lost.
- **Numbers** get `font-variant-numeric: tabular-nums` everywhere they appear.
- **No emojis. No ease-in-out. No one-off hexes.**

## Reference & verification

- **`UI Kit.html`** — open it locally to see every component with spec captions, hover states, and live overlay demos (modal, both sheets, toast spawners). The reference frontend should match.
- **`previews/`** — focused preview pages for one area at a time (Brand, Colors, Components, Spacing, Type). Useful for sharing a single concern with a designer.
- **`SKILL.md`** — the *prose* rules: do/don't, when to use which color, ship checklist.

## Known gaps (will land in v2.1)

A few earlier components — `.seg` (segmented control), `.tab` (underline tabs), `.stat` (stat card), `.focus` (focus card), `.row` (table row), `.activity` (activity feed) — currently live inline inside `UI Kit.html` rather than in `mantel.css`. If you need them right now, copy the relevant block from `UI Kit.html`. They'll move to `mantel.css` in v2.1.

## Versioning

This is **v2.0** (May 2026). Changes from v1.0 in this drop:
- Added form controls (input/select/textarea/switch/checkbox/radio) with hover + error + disabled states
- Added overlays (modal, right sheet, bottom sheet) with motion tokens
- Added feedback (alerts 5 tones, toasts with CTA variants + inverse, tooltips)
- Added navigation (pill tabs, breadcrumbs, pagination)
- Added actions (dropdown menu, button group, split button)
- Added state (empty state, skeleton shimmer)
- Single-blue treatment on segmented control + darker form borders + better-fitting button heights inside modal/sheet footers
