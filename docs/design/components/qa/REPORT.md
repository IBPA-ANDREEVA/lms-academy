# Component registry verification

Scope: `/dev/components`, an internal local planning and reference manager. No production LMS components, gallery, business policies, approved page sections, deployment or Git commits were created/changed by this task.

## Discovery and decisions

- Inspected the local working tree, section editor/store/approval protocol, product/MVP/questions, public architecture, design entry point/workflow/tokens/component guidance and reference templates.
- Local evidence: **60 page records; 22 approved and 38 pending; 130 eligible approved sections; 66 draft component candidates**. `COVERAGE.md` enumerates all page statuses and exact relationships. Eligibility requires current explicit page approval, reviewed section and non-excluded inclusion. Later-phase and conditional sections retain their release constraints.
- Existing `INVENTORY.md` is retained as historical suggestions with a replacement link. No section checkbox alone was treated as approval. Source IDs, approval revisions and custom homepage sections are preserved. Contact-form business details remain unresolved.
- Component versus variant/composition decisions: course/mini-course cards share a proposed catalog card; account security workflows remain separate forms; public media preview is not a protected lesson player; hero/story/contact are scoped compositions; prices remain commerce-owned; layout/heading primitives contain no product logic.
- All 66 definitions remain draft, all component visuals lack approved references, and all implementations remain not-started. Existing hero/global image evidence was inspected but not automatically imported or approved for other targets.

## Visual evidence

Selected tokens: plum, charcoal, off-white, blush; existing success/warning/error meanings retained. Licensed local Manrope supplies functional text and headings. No expressive display treatment was needed, so this tool does not install or claim exact Unbounded rendering. Global and hero images were opened and their scope/rejection rules read; their photographic split is not applicable to this editor. The editor follows the restrained sibling section workspace instead.

Screenshots at `1440x900.png`, `390x844.png`, `360x800.png`, `768x1024.png` show the navigation/default state. Matching `-editor.png` and `-expanded.png` files show the detail surface and expanded fields. Desktop and 390px images were visually inspected, including the mobile editor. The rail becomes a bounded list above the editor on mobile; three approval columns stack; long text and controls remain within viewport width. A mobile heading specificity issue found during inspection was corrected and screenshots refreshed. The interface remains a functional proposal pending human review; no approved editor-specific reference exists.

## Executed checks

| Check | Result |
|---|---|
| `pnpm lint` | Passed, no diagnostics after excluding the dedicated generated Next output directories |
| `pnpm exec tsc --noEmit` | Passed |
| `pnpm build` | Initial default-directory build passed; a subsequent build conflicted with an existing Next process on Windows. Final build passed cleanly with `COMPONENTS_BUILD_CHECK=1` and `COMPONENTS_WORKSPACE=1`, using `.next-components-production` |
| `pnpm test:components` | 8 tests passed: CRUD/history, relationship validation, image validation, reference CRUD and Markdown sync, independent approval invalidation, strict input validation, concurrent writes/recovery, environment/origin/token guards |
| `tests/component-registry.browser.mjs` | Passed in headless Microsoft Edge via bundled Playwright: select/search, create, edit description/category/priority, add justified usage, upload/preview, explanation save, primary selection, reload persistence, explicit synthetic approval/invalidation, archive/restore, stale-tab conflict, network recovery, generated Markdown/image paths |
| Browser responsive checks | Passed at 1440×900, 390×844, 360×800 and 768×1024; long copy, native-select keyboard behavior, reduced motion, no horizontal overflow |
| `tests/component-registry.visual.mjs` | Passed; refreshed default/editor/expanded screenshots at all four viewports |
| `tests/component-registry.http.mjs` | Passed actual HTTP checks: production UI/JSON/image/POST return 404 with opt-in enabled; foreign Host denied, foreign origin/missing token rejected, path traversal rejected, no-store response verified |
| Premium strict static audit | Passed, zero findings; `premium-audit.json` |

Browser tests use only a uniquely named synthetic fixture with an explicitly automated actor; the fixture, approvals, references and generated test history were removed after validation. No human component was approved. All 60 section-planning JSON files were byte-compared before/after the browser run and were unchanged. `browser-results.json` records the successful run. Initial browser failures exposed implicit label matching problems, which were fixed with explicit accessible names; subsequent failures were test-locator ambiguity and a configuration restart during a write. The interrupted write exercised the documented recovery procedure. Final runs passed.

The existing user section-dev server was left running. The component editor was run separately on loopback port 3001. Production checks use loopback port 3002 and a separate generated directory. Next's streamed development not-found boundary can retain status 200 for a rejected Host, but renders the not-found boundary without the workspace; its data endpoint returns 403. Production editor requests return actual 404 before streaming.

## Practical limits and pending review

- File writes are atomic individually; generated multi-file Markdown synchronization is recoverable through the pending marker, not a filesystem transaction. The store tests exercise recovery and reject concurrent stale writes.
- Reviewer identity is self-entered. This is a trusted local developer tool, not verified authentication or tamper-proof audit. Direct file/Git edits bypass lifecycle enforcement.
- Image signature/size validation is implemented; it is not a full image decoder or malware scan. Explicit MIME/nosniff/sandbox serving and fixed asset directories prevent executable uploads. No production rights are implied.
- Visual and implementation approval controls remain inactive as requested. Only definition approval is live. Source changes are flagged; new component decomposition still requires human/agent analysis rather than automatic invention.
- No screen-reader audit, cross-browser matrix or full 200% zoom/device-IME study was performed. Human approval of the editor layout, all component definitions and every component-level reference remains pending.

## Files and future consumption

Canonical: `registry/*.json`. Projections: `specs/*.md`, `INDEX.md`, `COVERAGE.md`, adjacent reference Markdown and the component block of the global reference index. Prior revisions: `history/<component-id>/<revision>.json`. Images: `../references/components/<component-id>/ref-<UUID>.<ext>`. Runtime: `src/features/component-registry`; thin routes: `src/app/dev/components`. Scripts and tests are named `component-registry`, `dev-components`, `seed-component-registry`, and `sync-component-docs`.

Future tasks must read approved component specs, inspect exact images and explanations, respect unresolved product/release decisions, implement only after review, then verify visually. Archived components are excluded from active plans. Priority recommendations are derived from reuse and release scope in the generated index; they are not approval.
