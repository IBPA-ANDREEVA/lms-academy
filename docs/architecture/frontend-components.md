# Shared frontend components

Read [pages](frontend-pages.md), [sections](frontend-sections.md), and [backlog](frontend-backlog.md) first. This file records implemented code, not visual approval. Import feature components through their `index.ts`; generic primitives can be imported directly from `src/components/ui`.

| Component / path | Purpose and props | Current use / next consumers | Status |
| --- | --- | --- | --- |
| PageContainer — `src/features/public-shell/page-container.tsx` | Horizontal alignment only. Native div props, `size: wide (default) / content / reading / fullBleed`, `children`, `className`. | Header, footer, HomePage; future public pages | Implemented; definition preserved from approved revision 3 |
| Button / ButtonLink — `src/components/ui/button.tsx` | Native button or Next Link semantics sharing appearance. `appearance: minimal / cut / neoBrutalist`, `intent: primary / secondary / destructive`, `size: sm / md / lg`, `inverse`, `fullWidth`. Button adds `loading`, native `disabled`; defaults to `type=button`. | Header menu/account, PasswordField; future forms and commerce | Implemented; definition revision 5 retained; exploratory visual reference, review pending |
| PublicHeader — `src/features/public-shell/public-header.tsx` | `brand`, published `navigation` (optional children), optional `account`, `cart` with count, and real `locales` links. Sticky white container, desktop disclosure and native modal mobile navigation. | Root layout; future public routes | Implemented from user-supplied 2026-10-28 header reference; browser-verified; human review pending |
| PublicFooter — `src/features/public-shell/public-footer.tsx` | `brand`, published `groups`, `legalLinks`, optional approved `disclaimer`, verified `contact`/`issuer`, `variant: default / compact`, `className`. | Root layout; focused variant for future auth/commerce/legal | Implemented; definition revision 5 retained; final dark reference interpreted, visual review pending |
| FormControls — `src/components/ui/form-controls.tsx` | TextField: native input props + `label`, `hint`, `error`, `success`; PasswordField adds masking toggle; Checkbox takes ReactNode label; SelectField takes native select props/options; FormMessage takes `tone: info / error / success`, children. | Password behavior is ready; forms not implemented. Shared future identity, checkout, profile fields | Implemented; neutral token-based proposal |
| CourseCard — `src/features/catalog/course-card.tsx` | `course`: real href/title/kind, optional image/direction/level/language/trainer/duration/format/server-formatted priceLabel. `headingLevel`, `status: available / owned / in-cart / unavailable / stale`, optional domain-owned `action`. | No live course data. Future home course/mini selection and both catalogs | Implemented; no invented catalog; token-based visual proposal |
| CategoryNavigation — `src/features/catalog/category-navigation.tsx` | `items: {id,label,href}[]`, `resetHref`, `selectedId`, localized `label`, `pending`. Native links preserve caller-provided query state. Empty taxonomy renders nothing. | Future home discovery and both catalogs; no published taxonomy yet | Implemented; token-based visual proposal |
| SectionHeading — `src/components/ui/section-heading.tsx` | `children`, `as: h1 / h2 / h3`, `id`, `description`, `display`, `className`. Functional Manrope by default; display opt-in Unbounded. | HomePage; future section headings | Implemented; neutral proposal |

## Preserved layout and appearance decisions

PageContainer caps the **inner content** at 1920px wide, 1440px content, or 760px reading; outer gutters are `clamp(20px, 4.1667vw, 96px)`. FullBleed fills its parent without gutters, not the viewport from inside a constrained ancestor. It owns no vertical spacing, background or grid. These values supersede the earlier generic 1320px candidate.

Button appearance and semantic intent are separate. NeoBrutalist has a 2px border and hard offset shadow; Cut has one chamfered corner and a blush hover; Minimal has modest rounding and a restrained surface highlight. Target heights: 44/48/56px. Disabled/loading block activation; busy keeps label and geometry. CSS motion is suppressed under reduced motion. The header's pill account action is a scoped reference-specific class, not a new duplicated button.

PublicHeader borrows the supplied image's white rounded bar, restrained shadow, wordmark alignment, dropdown, plum account action, cart and pale circular menu trigger. Full desktop above 1024px; tablet through 1024px keeps three navigation items (two below 921px); 768px and below moves navigation into the dialog. All links remain available in that dialog. Native dialog plus explicit Tab wrapping supplies focus containment, Escape and inert background; closing restores trigger focus. Desktop disclosure supports keyboard, Escape, outside click and navigation closure. No hover-only navigation. Existing line SVGs are used as CSS masks in currentColor without changing source artwork.

Reference content is conditional: packages, EN and Start in USA are not released by an image. The only public product route is `/` (a separate `/preview/components` review utility is available), so the current shell intentionally shows only Главная and the working project identity, with no cart/account/locale controls. No production links point at nonexistent screens. Tests may supply fixture links without publishing them.

PublicFooter borrows charcoal contrast, restrained plum accents, column hierarchy and thin separators; it does not copy the mockup logo, social accounts, newsletter, EN or invented legal copy. Mobile groups remain directly visible (the source allows optional disclosure). Compact shares the same implementation and legal content. Four approved legal destinations and a signed-off certificate disclaimer are release blockers; the current shell omits them while missing rather than supplying fabricated text or broken links.

Generic auth wrappers and redirect utilities were not extracted: no identity flow exists yet. Reuse PasswordField and FormControls when those flows are implemented. Client UI is never an authorization boundary.

## Future changes

Update this table's props, actual consumers and status whenever code changes. Page-specific layouts stay in their feature. Human approval must identify the exact reviewed scope; passing lint/build does not establish visual approval.

Verification commands, screenshots and deviations: [frontend verification](frontend-verification.md).

## Live previews

Every component in this table is also used by `src/features/component-preview/component-preview-page.tsx`, served at `/preview/components`. The user explicitly requested this route after retiring the old workflow. It shows all button families/intents/sizes/loading/disabled/inverse, header navigation/menu, footer default/compact, form feedback and validation, course/mini-course statuses, category selection, functional/display headings and all four container sizes. Keep this preview synchronized after component changes. Demonstration content has no business side effects; it does not publish later-phase features. The page is marked noindex and is not linked from public product navigation.
