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

## Approved functional icon library

- The existing SVGs under `public/icons/` are the chosen **functional icon collection**. Do not generate replacements, mix in Lucide variants, or silently substitute generic icons.
- Each base name has six filenames (unsuffixed plus `.1`–`.5`); those suffixes are alternate artworks **not automatically interchangeable states**. See [icon usage rules](./icons/USAGE.md).
- Icons currently use a 24×24 viewBox, primarily 1.5px rounded strokes, and often hardcode indigo `#292556`. Recoloring to `currentColor`, charcoal or plum requires a separately approved migration; do not overwrite source assets.
- Use semantic, named icon mappings rather than guessing filenames by array index or suffix.
- Branded category illustrations (nails, lashes, lamination, brows, makeup, cosmetology) are **not approved or present as a separate documented collection**; design them later as a distinct visual asset task.
- Keep accessible labels where an action is not obvious; purely decorative SVGs can have an empty alt.

## Interactive preview
- Use reusable LMS primitives with isolated sample state and explicit demo labels.
- Must respond to interaction; no nonfunctional play buttons, fake uploads, or fake messages presented as real.
- Demo data cannot mutate live enrollments, progress, or student records.
