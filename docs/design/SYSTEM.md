# Design System

> Agreed design values, not yet fully implemented in the current Next.js starter. Align token names with the framework when implementing. `DIRECTION.md` governs aesthetic intent.

## Palette

| Semantic role | Value |
| --- | --- |
| Primary | `#782858` |
| Primary hover | `#64204A` |
| Primary pressed | `#52183D` |
| Primary foreground | `#FFFFFF` |
| Primary subtle | `#F7EFF4` |
| Primary border | `#D9B6CA` |
| Page background | `#FAF9FA` |
| Surface | `#FFFFFF` |
| Muted surface | `#F4F1F3` |
| Foreground | `#1D1B1F` |
| Muted foreground | `#655F67` |
| Border | `#E6E0E5` |
| Focus ring | `#A64E84` |
| Disabled neutral (not text default) | `#ACA5AD` |
| Success text | `#177245` |
| Success background | `#E9F7EF` |
| Warning text | `#91600F` |
| Warning background | `#FFF5DF` |
| Error text | `#B42332` |
| Error background | `#FDEDEF` |
| Info text | `#2455A4` |
| Info background | `#EDF3FF` |

Single brand accent means one brand hue, not the removal of semantic feedback colors. Never communicate status through color alone. Check actual contrast pairs.

## Fonts and roles
- **Unbounded:** marketing display, page-level H1 and expressive H2, typically 600–700; short headings only.
- **Manrope:** body, navigation, buttons, forms, tables, course cards, long headings, trainer/student workspaces; 400–700.
- Russian first. Ensure real Cyrillic font assets/subsets load with no fallback mismatch. Test English too.
- Body: 16px/1.6, large body: 18px/1.55, compact UI: 14px/1.5, metadata: 12–14px/1.5.
- Proposed headings: display 56–64px desktop / 32–38px mobile; H1 36–44px / 28–34px; H2 26–32px / 22–26px. Tune after screenshot review.
- Avoid automatic uppercase or tight tracking on Russian labels. Permit natural wrapping; do not shrink crucial text simply to fit.

## Spacing, geometry and layout
- Proposed 4px base unit with 8/12/16/24/32/48/64/96 spacing steps.
- Desktop content max-width 1320px, 12-column conceptual grid; mobile 4-column with 16–20px gutters.
- Primary controls minimum 44px high; radius ~8px; functional cards ~12px, editorial photos 0–4px when appropriate.
- Favor whitespace and open sections over nested cards; shadows reserved for actual elevation.
- Asymmetry is permitted on marketing compositions, not at the expense of reading order or task speed.
- Responsive behavior must be defined by content, not only fixed breakpoints. No horizontal overflow.

## Accessibility
- WCAG AA contrast targets: 4.5:1 normal text, 3:1 large text and meaningful UI graphics.
- Visible keyboard focus and keyboard access to all actions.
- Touch targets should be comfortably usable; don't rely on hover.
- Honor `prefers-reduced-motion`.
- Proper localized dates, currencies, labels, validation and error states.

## Approved icon collection and existing app status

- The existing `public/icons/` collection is our functional SVG source. Its current indigo `#292556` differs from the agreed accent palette; this is an **unresolved asset-token integration choice**, not permission to introduce indigo as a second brand accent.
- Retain original SVGs until the canonical variant and recoloring policy are approved. See [icon usage](./icons/USAGE.md).
- Current Next.js starter uses Geist, Arial, `lang="en"` and default colors. It does not yet implement these tokens; update application code during a dedicated frontend foundation task, not by assuming the design is already live.

## Ownership
This document owns exact global design values. Other docs should refer to token names, not duplicate HEX values.
