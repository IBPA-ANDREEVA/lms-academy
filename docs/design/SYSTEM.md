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

### Primary display font: Angry

- **Font:** Angry Regular, provided as `Angry.otf`.
- **Actual weight:** 400. No Bold, Semibold, or Light variants are included.
- **Role:** Primary brand display typography for marketing, hero headlines, prominent page-level H1 headings, expressive H2 headings, and short editorial statements.
- **Character:** Geometric, angular, visually heavy, and uppercase-looking even when lowercase characters are used.
- **Languages:** Supports Russian and English alphabets, including Cyrillic characters used in Ukrainian.
- **Usage:** Short, visually expressive text. Avoid long paragraphs and dense interface elements.
- **Weight handling:** Do not assign unsupported 600–700 weights or generate synthetic bold. Use native Regular 400.
- **Letter spacing:** Start with natural spacing. Adjust optically for large headings only. Avoid aggressive negative tracking that harms Cyrillic readability.
- **Line height:** Approximately 1.05–1.2 for display headings, adjusted after visual review.
- **Character limitations:** The supplied font lacks certain symbols, including `$`, `%`, `@`, and `&`. Use Manrope for strings requiring those characters to prevent inconsistent font fallback.
- **Case:** Do not automatically apply `text-transform: uppercase`. The font already has a visually uppercase appearance.
- **Licensing:** Confirm commercial web-embedding permissions before production deployment.

### Secondary font: Manrope

- **Font:** Manrope, weights 400–700.
- **Role:** Body text, navigation, buttons, forms, tables, course cards, long headings, labels, prices, metadata, and functional content.
- **Workspaces:** Default font for student, trainer, manager, and administrator dashboards.
- **Functional headings:** Use Manrope Semibold or Bold where clarity is more important than editorial expression.
- **Language coverage:** Ensure Cyrillic and Latin subsets are loaded consistently.

### Typography hierarchy

| Element | Font | Desktop size | Mobile size | Weight |
| --- | --- | --- | --- | --- |
| Hero display | Angry | 56–64px | 32–38px | 400 |
| Page H1 (editorial) | Angry | 36–44px | 28–34px | 400 |
| Section H2 (expressive) | Angry | 26–32px | 22–26px | 400 |
| Functional H1/H2 | Manrope | 26–40px | 22–32px | 600–700 |
| Card heading | Manrope | 18–22px | 16–20px | 600–700 |
| Large body | Manrope | 18px | 18px | 400 |
| Body | Manrope | 16px | 16px | 400 |
| Compact UI | Manrope | 14px | 14px | 400–600 |
| Metadata | Manrope | 12–14px | 12–14px | 400–500 |
| Buttons | Manrope | 14–16px | 14–16px | 600–700 |

**Body line heights:**
- Body: 16px / 1.6
- Large body: 18px / 1.55
- Compact UI: 14px / 1.5
- Metadata: 12–14px / 1.5

All proposed sizes must be tuned after screenshot review with the real font assets.

### Typography usage rules

- Angry is the Academy's signature visual font, not the default interface font.
- Use Angry for deliberate visual emphasis rather than every heading.
- Use Manrope for course lessons, assignment instructions, trainer feedback, certificates' detailed information, and dashboards.
- Russian first. Verify actual Cyrillic rendering without fallback mismatch. Test English separately.
- Never force Russian text into artificial uppercase or excessively tight layouts.
- Allow natural text wrapping. Do not reduce important text merely to fit fixed containers.
- Avoid mixing Angry and Manrope within the same text string unless there is a deliberate editorial reason.
- Ensure prices, email addresses, percentages, dates, and other data-heavy strings use Manrope.
- Preserve readable text hierarchy independently of font decoration.

### Font implementation

- Load Angry locally through `next/font/local` using the supplied font asset.
- Declare Angry with weight `400` and `font-display: swap`.
- Disable synthetic font weights for Angry.
- Load Manrope using the appropriate Next.js font integration.
- Expose semantic font tokens such as `--font-display` and `--font-body`, mapped to the loaded font families.
- Use semantic typography utilities rather than repeating font-family declarations throughout individual components.
- Do not use external font CDN dependencies for Angry.
- Confirm the font's web-embedding license before shipping.
- Validate both languages on desktop and mobile.

## Spacing, geometry and layout

- Proposed 4px base unit with 8/12/16/24/32/48/64/96 spacing steps.
- Desktop content max-width 1320px, 12-column conceptual grid; mobile 4-column with 16–20px gutters.
- Primary controls minimum 44px high; radius ~8px; functional cards ~12px, editorial photos 0–4px when appropriate.
- Favor whitespace and open sections over nested cards; shadows reserved for actual elevation.
- Asymmetry is permitted on marketing compositions, not at the expense of reading order or task speed.
- Responsive behavior must be defined by content, not only fixed breakpoints. No horizontal overflow.
- Allow sufficient space for Angry's distinctive character proportions and natural headline wrapping.

## Accessibility

- WCAG AA contrast targets: 4.5:1 normal text, 3:1 large text and meaningful UI graphics.
- Visible keyboard focus and keyboard access to all actions.
- Touch targets should be comfortably usable; don't rely on hover.
- Honor `prefers-reduced-motion`.
- Proper localized dates, currencies, labels, validation and error states.
- Never use Angry's decorative characteristics at the expense of comprehension.
- Prefer Manrope for longer text and high-density interaction areas.
- Verify heading readability at mobile sizes, especially with long Russian words.

## Approved icon collection and existing app status

- The existing `public/icons/` collection is our functional SVG source. Its current indigo `#292556` differs from the agreed accent palette; this is an **unresolved asset-token integration choice**, not permission to introduce indigo as a second brand accent.
- Retain original SVGs until the canonical variant and recoloring policy are approved. See [icon usage](./icons/USAGE.md).
- Current Next.js starter uses Geist, Arial, `lang="en"` and default colors. It does not yet implement these tokens.
- The frontend foundation task must replace the starter typography with Angry + Manrope, establish the corresponding font tokens, configure localization, and implement the approved palette.
- Do not assume the agreed design system is already live.

## Ownership

This document owns exact global design values. Other docs should refer to token names, not duplicate HEX values or independently define typography rules.

`DIRECTION.md` governs overall aesthetic direction, while this document governs font usage, hierarchy, global tokens, spacing, and accessibility requirements.
