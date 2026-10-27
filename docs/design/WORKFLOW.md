# Design-to-implementation workflow

STEP 1 — Scope: open product requirements, MVP, open questions and route architecture. List real information, page goal, phase, available states and unresolved decisions.
STEP 2 — Decompose: route -> named sections -> section compositions -> shared components -> primitives. Store screen and section requirements under `specs/screens/` and `specs/sections/`; do not proliferate files for trivial wrappers.
STEP 3 — Reference: collect an exact accessible source image or Figma frame for EACH visually distinctive section or widely reused component. Assign an ID, store local asset, write adjacent record: intended target, status, Borrow, Reject, mobile caveats, content accuracy and provenance/rights.
STEP 4 — Decide: human reviewer chooses the direction and records the approved scope in `DECISIONS.md` and the reference record. Screenshot approval of hero does not imply global component approval.
STEP 5 — Specify: define layout relationships, content hierarchy, states, responsive behavior and limitations before coding. Prefer constraints and visual relationships over speculative pixel coordinates.
STEP 6 — Implement: create one section or component, inspect local project, use Next.js/Tailwind idioms, protect architecture boundaries. Put generic primitives in `src/components/ui`, domain composites in their owning feature. Do not create a general-purpose library until repeated real usage is proven.
STEP 7 — Compare: screenshot real browser RU desktop/mobile, compare to exact reference, fix differences and test states/accessibility. Record review evidence.
STEP 8 — Propagate: after component approval, reuse only where matching content/actions exist. Update docs whenever a change is approved.

REFERENCE LEVELS:
- Global = palette, photo treatment, typography/composition grammar; never prescribe page-specific content.
- Screen = route-specific hierarchy.
- Section = specific hero, category index, curriculum module, etc.
- Component = repeated control with states/variants and expected behavior.

APPROVAL:
- `unreviewed`: no human directional decision.
- `exploratory`: example under consideration.
- `preferred-reference`: user explicitly likes a visual; must state exactly what was liked.
- `selected-direction`: owner chose rules; detailed implementation unapproved.
- `approved-implementation`: human reviewed actual responsive browser result.
- `rejected`: explicit reason retained as negative guidance if still relevant.

Do not infer approval from a folder called 'approved'. Future reference collections start empty except the two accurately labeled H-001 sources.
