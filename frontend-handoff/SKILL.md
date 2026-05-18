# Mantel Design System — Agent Skill

When you're designing in the Mantel brand, follow these rules. The longer-form reference lives in the prototype: [seller-proposal-dashboard.netlify.app](https://seller-proposal-dashboard.netlify.app/) and in the cards under `previews/`.

## 1. Always link the stylesheet

```html
<link rel="stylesheet" href="styles/mantel.css">
```

Adjust the relative path if your artifact is in a subfolder. Never duplicate the tokens — always reference CSS variables (`var(--brand-600)`, `var(--ink-800)`, `var(--accent-red)`).

## 2. Files to read first

- `styles/mantel.css` — every token
- `UI Kit.html` — the full dashboard in context (rail, top bar, stats, focus cards, table, activity)
- `previews/Components.html` — every component in isolation
- `previews/Colors.html` — brand + ink scale, accents, lifecycle, avatars

## 3. Typography

- **Geist** (sans) for ALL UI. Weights 400 / 500 / 600 / 700.
- **Geist Mono** for monospace caps (tag labels, eyebrows), tabular numbers in headers.
- Apply `font-feature-settings: "ss01", "ss03", "cv11";` globally (already in `mantel.css`).
- Numbers in every row/cell/badge/timestamp get `font-variant-numeric: tabular-nums`.
- Negative tracking on display sizes only. Body and small text: `letter-spacing: 0` or near.

Type scale (px / line / tracking): `2xs 10.5/14/+.02` · `xs 11.5/16/+.005` · `sm 13/18/0` · `base 14/20/−.005` · `lg 16/22/−.011` · `xl 19/26/−.014` · `2xl 24/30/−.019` · `3xl 30/36/−.022`.

## 4. Color

- **Body text on `ink-800` (#1B1D20). Secondary on `ink-500` (#6A6E75).**
- **Primary action is `brand-600` (#0053A7). Hover steps to `brand-700`.**
- Borders are `ink-200` (input rings) / `ink-150` (section dividers). Cards have **no visible border** — the inset hairline ring carries the edge.
- Page background is `ink-50` (#F8F9FB).
- **Status colors are semantic, never decorative.** Green=signed/strong, amber=cool, red=urgent/lost, violet=reserved. Each ships as a (fg, bg) pair — use both together for tinted surfaces.
- **Proposal lifecycle:** Sent uses Tailwind `cyan` (not brand) to stay distinct from Viewed.
- Avatars: hash the seller id → pick one of 6 warm pastel tones, deterministically. Header user avatar uses the navy gradient + white initials.

## 5. Spacing & radius

- 4px unit. Cards use `1.5rem` (24px) horizontal × `1.25rem` (20px) vertical padding. `2rem` (32px) between stacked sections.
- **All cards: `border-radius: 16px` (rounded-2xl).** No exceptions.
- **All buttons, pickers, search, avatars: `border-radius: 9999px` (fully rounded).**
- Pills/chips: 8px radius. Swatches: 12px. Hero blocks: 20px.

## 6. Shadows

Use the tokens, not raw values:
- `--shadow-card` — all cards (hairline ring + tight drop)
- `--shadow-pop` — popovers, dropdowns, tooltips, modals
- `--shadow-hover` — focus card hover lift (tinted navy)
- `--shadow-focus` — keyboard focus ring (handled globally)

Buttons have **no shadow**.

## 7. Components — use these, don't invent

- **Buttons** all `rounded-full`. Three styles: **Primary** (brand fill, ≤1 per surface), **Secondary** (brand outline, default CTA), **Ghost/icon** (circular, transparent until hover).
- **Status pills** are 13px semibold, 8px radius, fg + tinted bg + matching ring. Stalled / non-actionable reasons use neutral grey only.
- **Strength badge** — 32px circle, tabular nums, three tiers: ≥80 green, 60–79 amber, <60 red.
- **Avatars** — `rounded-full`, hashed tone. Stacked groups overlap `-6px` with a 2px white ring between layers.
- **Tabs** — underline indicator, active = `brand-700` text + `brand-600` 2px bottom border. Counts get tabular-nums and turn red when urgent.
- **Segmented control** — single connected pill, brand outline + dividers, active fills brand-600.
- **Focus cards** — state-tinted bg (`tone-now/urgent/cool/strong`) with matching translucent border. Mono-caps tag top-left, dismiss top-right, name + price, reason, CTA bottom-right. Hover lifts.
- **Activity feed** — borderless rows in a card, `divide-y divide-ink-150`. 32px circular icon bubble (state-tinted) + sentence with **bold** subject + right-aligned tabular timestamp.

## 8. Patterns

- **Column alignment:** numbers right-align with tabular-nums; text/dates/pills/avatars left-align; strength badge centers. Headers match their cell alignment.
- **Scroll containers** fade their edges via `-webkit-mask-image` gradients toggled by JS classes (`.fade-edge-left/-right/-both`).
- **Selection:** `::selection { background: brand-100; color: brand-900; }` (handled globally).
- **Icons:** Lucide only. 16px inside buttons (`w-4 h-4`), 14px in compact pickers and 32px activity bubbles.
- **Live dot:** `pulse-ring` keyframe — box-shadow expands 0 → 6px → 0 over 1.8s. Used for active-viewing indicators.

## 9. Motion

- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` (standard) or `cubic-bezier(0.22, 0.9, 0.2, 1)` (snap). **Never `ease-in-out`.**
- Durations: 220ms default, 320ms for focus card transform, 280/240ms for drawer in/out.

## 10. What NOT to do

- **No emojis** in copy (status pills, seed data, labels, comments).
- **No one-off hexes** — if it's not in the tokens, don't ship it.
- **No status colors for decoration** — only for meaning.
- **No visible card borders** — the inset ring shadow is the edge.
- **No `ease-in-out`** anywhere.
- **No icon sets** outside Lucide.
- **No `#fff → #000` dark mode swap** — re-pick a palette if dark mode ships.
- Don't pad empty space with filler stats, decorative icons, or marketing copy. If a section feels empty, ask the user what belongs there.

## Ship checklist

1. Reuses tokens — no one-off hexes?
2. Status colors used for meaning only?
3. All cards on the 16px / hairline ring / no-border rhythm?
4. Tabular-nums on every numeric cell/badge/timestamp?
5. Buttons rounded-full, ≤1 brand-fill per surface?
6. Coherent on mobile (drawer + stacked headers + hidden pills)?
7. No emojis in copy?
