# Icon usage — verified repository structure

Verified 2026-10-27 from GitHub tree: `public/icons/` has six STYLE DIRECTORIES: `broken`, `duoline`, `duotone`, `filled`, `line`, `mono`, each containing 130 SVGs (780 total). Earlier guidance describing `name.svg`, `name.1.svg` ... `name.5.svg` is OBSOLETE. Example path shape: `/icons/line/arrow-right-long.svg`. Verify exact spelling in repository; do not construct an uninspected path.

These SVGs are the current functional icon inventory. Do not install Lucide/Heroicons or draw inconsistent substitutes by default. Category illustrations are not automatically part of this library.

DEFAULT: inspect and select `line` style for ordinary controls. Use `filled` for emphasis only if behavior needs it. `duotone`, `duoline`, `mono` and `broken` are opt-in per approved component reference. Do not randomly mix icon styles in one control group.

Build an explicit semantic mapping in code or docs using real paths. Icon variants and exact source need inspection at actual size; path folder alone is not semantic active state. Pair unfamiliar icons with visible text. Decorative imagery should be hidden from assistive tech; actionable buttons need accessible names.

Some SVGs contain indigo `#292556`; this is NOT a project palette approval. Preserve source files. Before using a variant on dark or plum backgrounds, verify contrast and an approved currentColor/recolor pipeline; do not destructively batch replace colors.

Hero H-001 does not need icons beyond a useful arrow on CTA. The reference's numbering/vertical marks are NOT required icon components. No icon should be added just to decorate empty space.
