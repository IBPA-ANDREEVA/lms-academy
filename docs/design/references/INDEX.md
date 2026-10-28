# Current visual reference registry

This register replaces all prior `approved/`, `exploratory/`, `rejected/` image folders and AI prompt collections from the previous visual direction. None of those older files is carried into this replacement package. The migration script makes a local backup before removing them when explicitly run with `--apply`.

ACTIVE ASSETS:
- `GLOBAL-001` -> `global/TONI-GUY-01.png`; record `global/TONI-GUY-01.md`. Status: `preferred-reference`, not approved visual reproduction. User-uploaded Toni&Guy Academy screenshot; strong structural inspiration. Do not reuse its logo, text or photograph in production.
- `HOME-HERO-001` -> `pages/home/HOME-HERO-001.png`; record `pages/home/HOME-HERO-001.md`. Status: `selected-direction / liked concept`. Last minimalist AI-generated mockup; user said 'this is good'. It is NOT actual Unbounded, licensed production photography, mobile, functional slider or approved implementation.

Each new visual reference must have:
- Stable ID; target route/section/component; referenced image path or Figma frame; precise status and reviewer/date.
- Origin/rights (source URL, who uploaded/generated it and limitations).
- `Borrow` (specific layout or interaction relations, NOT just 'modern').
- `Reject` (specific aspects explicitly not allowed).
- Crop, hierarchy, dimensions or ratio if grounded; desktop/mobile caveats.
- Content and feature boundaries (no fake statistics/offer/pricing).
- Exact implementation files using it, screenshot QA review and next decision.

APPROVAL IS TARGET-SPECIFIC. A beautiful hero reference is not an approved checkout layout. Screenshot folder naming cannot grant approval. Generated raster contains approximate typography and sometimes mistakes; it must never supersede source tokens, requirements or actual human-reviewed browser screenshot.

TEMPLATES: `templates/REFERENCE.md`, `templates/SECTION.md`, `templates/COMPONENT.md`.

REFERENCE COLLECTION GOAL: for every visually distinct route section and frequently reused component, create a bounded record. Do not collect twenty general websites and expect the developer to interpolate a design. Use references to resolve an actual element-level decision.
