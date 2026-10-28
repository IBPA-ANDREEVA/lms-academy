# Component implementation contract

Before making any reusable component:
1. List all actual routes/sections that need the same behavior.
2. Distinguish a reusable VISUAL primitive from a product-specific composition and from a domain feature. `src/components/ui` is not a dumping ground for everything rendered twice.
3. Find a component spec and an exact visual reference. If missing, record `proposal` and request review before globalizing an aesthetic.
4. Define props, semantic HTML, actions/destinations, variants, responsive stacking and state matrix. Derive actual data from domain records. Avoid invented placeholder states presented as live functionality.
5. Test component at desktop and mobile with realistic Russian, long names, prices and error copy.
6. Only then extract and reuse. Do not abstract across dissimilar layouts merely because both contain an image and text.

PRIMITIVES CANDIDATES (`src/components/ui` after inspection):
- Button, IconButton, Link, TextField, Select, Checkbox, Dialog, Disclosure, Badge/Status, InlineMessage, Spinner/Skeleton, Surface/Container, Typography primitives, perhaps MediaFrame.
- These are CANDIDATES, not an order to build all now. Use platform-native controls when sufficient.

PUBLIC COMPOSITIONS CANDIDATES (appropriate shared presentation layer with feature owners):
- PublicHeader, PublicFooter, CourseCard, MiniCourseCard variant, CourseFacts, CategoryFilter, ResultStatus, CartIndicator, PurchasePanel, PriceSummary, MediaPreview, Breadcrumbs.
- CourseCard uses catalog domain data, so component can live in catalog feature with public display API; avoid commerce calculation inside it.
- Header includes only published/phase-valid routes. Never copy Toni&Guy's Teachers/Store/Apply links into this project.

VISUAL GUIDANCE:
- Hero is a SECTION-level composition, not a generic `Hero` component with a thousand props. Its photo-left editorial design belongs in the homepage section spec.
- Button visuals should be plain and strong; a plum primary CTA and a quieter secondary link. No huge pills or shadow-stacked neo-brutalist buttons without reference.
- Course cards prioritize real course photo, level/language, title, trainer, format, actual price and valid add action. Preserve scannability over art-direction stunts.
- Catalog filters, account forms, transaction surfaces, LMS lesson and trainer queue are functional; do not transplant the giant hero letters into them.
- Follow `icons/USAGE.md`. Prefer icons only when useful, and label unclear icons.

STATE CONTRACT (when relevant): default, hover, focus-visible, active/selected, disabled with explanation, submitting/loading, success, empty, error/retry, stale offer, already owned, unavailable, validation, mobile overflow, long copy, keyboard, reduced motion. Do not render disabled buttons with no explanation.

REFERENCE SCOPE:
- A component may inherit global tokens, but only an approved component-level record may define distinctive global treatments (borders, offsets, image masks, hover reveals).
- The current H-001 reference approves no course-card, navbar or form design. Do not infer their appearance from the hero mockup.

VISUAL REVIEW: capture component examples with states and constraints before changing every route. See `components/INVENTORY.md` and `QA.md`.
