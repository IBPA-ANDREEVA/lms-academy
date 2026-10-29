# Visual decision register — owner decisions made 2026-10-27

Vocabulary:
- `selected`: owner explicitly chose this direction; a specific implementation is not yet approved.
- `preferred-reference`: owner liked the image; only the documented relationships are selected.
- `proposal`: engineering/design suggestion; not approved.
- `blocked`: cannot finalize until a named decision or asset is supplied.
- `approved-implementation`: requires reviewed desktop/mobile browser screenshots. NONE EXISTS YET.

D-001 `selected` — Bold reinterpretation of the original five-page Academy PDF. Preserve business rules, roles, features and useful flows. Layout and art may change completely. Original PDF remains functional evidence.
D-002 `selected` — Display: Unbounded. Functional/body: Manrope. Angry is superseded as brand typography. At decision time Unbounded was missing. Update 2026-10-28: local OFL asset installed; typography must still be verified in each composition.
D-003 `selected` — Typography/graphics-led visual hierarchy. Photography remains vital but does not dictate the entire composition.
D-004 `selected` — Experimental/brutalist composition rather than generic SaaS or soft luxury styling.
D-005 `selected` — Geometry: selective cut-edge architecture plus restrained neo-brutalist outline language. The later chosen minimal hero DOES NOT justify adding cut corners, heavy borders and offset shadows everywhere.
D-006 `selected` — Alternating high-contrast color blocks. Never use meaningless alternation solely for variety.
D-007 `selected` — Semantic narrative: off-white = Explore, plum = Learn, charcoal = Practice, blush = Progress. This is an art-direction mapping, NOT an instruction to recolor every CTA or every application screen by journey phase.
D-008 `selected` — Monumental typography, layered treatments, occasional selective collision. Legibility and responsive fit outrank special effects.
D-009 `selected` — Home hero is a brand statement, not category-navigation-first. One integrated beauty-practice photograph.
D-010 `selected` — Hero: photo LEFT, text RIGHT, asymmetric approximately 40–45% photo / 55–60% text; controlled overlap permitted. Geometry is a starting ratio, not a pixel-locked specification.
D-011 `preferred-reference` — User-provided Toni&Guy Academy screenshot: restrained art-directed beauty photography, sharp structural split, calm off-white type field, horizontal translucent band, powerful compact headline and generous whitespace. Do NOT copy brand/logotype, imagery, navigation items or exact lettering.
D-012 `preferred-reference` — Most recent minimal generated mockup: user explicitly said “this is good” after asking for less text/information. Use as the preferred H-001 visual composition, NOT evidence of exact Unbounded font, final copy, licensed imagery, actual slideshow or verified mobile behavior.
D-013 `selected` — Hero should contain far less secondary text than the earlier complex concept. Remove unnecessary benefits strip, duplicate CTAs, category bar, floating labels and pseudo-controls.

NOT SELECTED / NOT IMPLIED:
- The actual Russian headline text is working copy, not final approved brand language.
- The academy's real name, logo, teacher imagery, product prices, offering inventory and legal messaging are unapproved.
- No homepage slideshow was approved. Numbered UI in the mockup is decorative until a real interaction and content set are specified; default: omit.
- No public `/teachers`, `/shop`, `/contact` routes were approved by the image. Use only route links defined by the architecture documents.
- No global use of hard shadows, translucent bands, cut corners, rotated text, outlined duplicate letters or horizontal index labels was approved.
- No component design, mobile screenshot, navbar variant, course card variant, interactive animation or complete page layout is implementation-approved.

Decision updates: preserve ID and history; add date, explicit owner statement, scope, affected files and screenshot references. Do not silently change `selected` to `approved-implementation`.

2026-10-28 workflow update — Owner requested retirement of the planning routes and reference gallery after shared-component implementation/audit. Frontend source-of-truth inventory now lives in `docs/architecture/frontend-*.md`. Preserve product and historical visual decisions; no archive/gallery infrastructure is retained.

D-014 `selected-direction` — PublicHeader follows the image supplied in this chat on 2026-10-28: rounded white container, aligned wordmark/navigation, desktop dropdown, sticky behavior, tablet overflow and mobile menu panel. Scope is header only. Real route publication and release rules override illustrative menu items. Exact implemented screenshots remain unapproved.

D-015 `definition-preserved` — The edited PageContainer, Button and PublicFooter definitions were migrated into `frontend-components.md` before retiring generated planning records. Container inner widths and gutters, three button families, footer default/compact and dark minimal composition are retained. Exploratory button/footer images are not proof of implementation approval.

D-016 `workflow-selected` — 2026-10-28: owner explicitly requested a new route with a preview for each component. `/preview/components` is authorized as a lightweight live review surface reusing shared code, superseding the blanket preview-route prohibition. The old planning editors, reference gallery, upload/persistence and approval infrastructure remain retired. Preview framing is a functional proposal, not human visual approval.

D-017 `selected-direction` — 2026-10-28 homepage refinement. Owner requested viewport-height hero without CTA connector lines, a smaller rounded collapsed header with side margins, populated header/footer preview entries, filled hamburger panel, compact HOME-06–09 headings and active-height switching, GSAP React learning transitions, numbered section folders and continuous geometric seams. The supplied button screenshot scopes only the Cut family: parallelogram outline, upright text/arrow, detached trailing slash; do not infer product copy, a destination, or a new site-wide treatment. Latest owner correction removes the right-side decorative line and restores purple polygons crossing vertical boundaries; 06–09 must retain the same static shapes across tab changes. Affected owners: public-shell, shared Button, numbered home sections, home composition and learning-offers. Browser evidence is recorded in frontend-verification.md; no screenshot is human implementation approval.
