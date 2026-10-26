# Component Design Rules

For each implemented component record: purpose, anatomy, variants, states, sizes, responsive behavior, accessibility, screenshots, and rejection examples. Add concrete specs only after implementation/approval.

## Buttons
- Primary: plum fill, white Manrope semibold text, readable height, 8px proposed radius. Usually one dominant action per context.
- Secondary: neutral surface or low-emphasis outline; destructive only for destructive actions.
- Support hover, focus-visible, loading, disabled, pressed states; no giant pills, gradient fills, or glow effects.

## Inputs and forms
- Labels remain visible; validation includes text and not only color.
- Natural Russian field lengths; preserve entered values on validation errors.
- Consistent heights, neutral borders, clear focus ring.

## Course modules
- Photography-led course cards with course title, language, level, tutor support, price/CTA when applicable.
- Display only factual data from catalog; do not invent counts or reviews.
- Course cards need not be identical editorial tiles but must remain easy to compare.

## Learning states
- Progress bar with numeric or textual progress.
- Assignment statuses: pending review, accepted, revision required, overdue (if applicable); use icons + text + semantic color.
- Clear deadlines and curator support remaining period.

## Navigation and dense surfaces
- Functional icon set at 20–24px, labels for non-obvious meanings.
- Trainer/admin: flat tables or lists, readable density, sorting/filter controls; avoid cards inside cards.

## Signature iconography
- **Branded category illustrations:** custom approved SVGs, about 40–64px, geometrically related, limited plum and neutrals.
- **Functional icons:** simplified consistent SVG family; an existing utility library is acceptable for conventional controls if visual language remains coherent.
- Initial proposed custom assets: nails, lash extensions, lash lamination, brows, makeup, cosmetology; lessons, assignments, curator, progress, certificate, achievement.
- Generate explorations separately, refine vector geometry in Figma, and approve the actual SVG source before treating as canonical.
- Never improvise inconsistent icon sets or substitute emoji as final artwork.

## Interactive preview
- Use reusable LMS primitives with isolated sample state and explicit demo labels.
- Must respond to interaction; no nonfunctional play buttons, fake uploads, or fake messages presented as real.
- Demo data cannot mutate live enrollments, progress, or student records.
