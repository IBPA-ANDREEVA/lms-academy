# Design instruction entry point

USE THIS FILE FIRST for any visual or UI task. This is a practical instruction set for designers and coding agents, not an inspiration essay.

SOURCE PRECEDENCE:
1. Product requirements, phase plan and unresolved product questions determine WHAT may exist and how it behaves.
2. Public architecture docs determine route proposals, page content obligations and navigation contracts. A visual design cannot create routes or approve product decisions.
3. `DECISIONS.md` records the exact visual decisions accepted in this conversation and the limits of each approval.
4. `SYSTEM.md` owns global typography/color/geometry tokens. `DIRECTION.md` owns art direction and composition principles.
5. A screen specification owns the screen hierarchy; a section specification owns a section; a component specification owns a reusable component.
6. `references/INDEX.md` and per-reference records own visual evidence. An IMAGE only applies to its stated target. If the source conflicts with accepted tokens, adapt its relationship, not its original brand identity.
7. Later unapproved sketches, old files and AI-generated mockups cannot override the above.

READING ORDER FOR FRONTEND TASKS:
- `DECISIONS.md` -> `DIRECTION.md` -> `SYSTEM.md`.
- `SCREENS.md` + architecture's `public-page-structure.md` for route scope.
- `COMPONENTS.md` and `components/INVENTORY.md` for reuse and ownership.
- Exact section and component references, if registered.
- `QA.md` before and after implementation.

CURRENT STATE:
- The owner chose a bold reinterpretation of the original wireframe, while preserving all product logic.
- Final style: minimal, editorial, experimental brutalism. Typography + photo outrank decorative geometry.
- A preferred user-provided Toni&Guy layout reference and a liked minimal generated concept are present in `references/`.
- `HOME-HERO-001` has a decided conceptual direction, NOT a browser-tested implementation or approved final component.
- All other sections and shared-component aesthetics are `unreviewed` until separately approved.
- No universal mandatory design signatures. Do not recreate the retired modular-geometry / interactive-preview / custom-icons signatures as global obligations.

STOP/ASK RULE:
If you lack an approved product policy, content, font licensing/asset, image usage right, or page-level reference required for an irreversible choice, flag the issue; implement a clearly labeled reversible proposal only if the task allows. Never invent approval. In normal incremental design work, propose one choice at a time.

FILES:
- `DECISIONS.md`: agreed vs proposed vs blocked.
- `OPEN-DECISIONS.md`: unresolved styling/content questions.
- `DIRECTION.md`: composition / imagery / restraint.
- `SYSTEM.md`: tokens and provisional sizing rules.
- `SCREENS.md`: route-to-section requirements, phases and states.
- `COMPONENTS.md`: component ownership, state contract.
- `components/INVENTORY.md`: planned shared component map (NOT approval to implement all).
- `references/INDEX.md`: assets, reference statuses and record template.
- `references/pages/home/HOME-HERO-001.md`: first section-specific visual direction.
- `QA.md`: visual, functional, responsive tests.
- `WORKFLOW.md`: how to extend the reference system without document drift.
