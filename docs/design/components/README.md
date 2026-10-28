# Component definition and reference workspace

Run `pnpm dev:components` and open `http://127.0.0.1:3000/dev/components`. Both planning editors are enabled by this loopback-only launcher. An existing dev server must be stopped or a separate port selected (`pnpm dev:components --port 3001`). Ordinary `pnpm dev` does not enable this editor. Production UI, JSON and image requests return 404 even if the opt-in flag is present.

## Authority and workflow

The initial discovery reads local `../section-planning/pages/*.json`, never remote GitHub. A source is eligible only when the page is explicitly approved at its current revision, the section is reviewed and not excluded. Conditional inclusion and release phases remain unchanged. `COVERAGE.md` lists approved and pending pages and exact section coverage. Page structure approval does not approve component architecture, visual treatment, new business policy or release scope.

`registry/<stable-id>.json` is the **single editable source** for component definitions, reference explanations, independent approval dimensions and current lifecycle. `specs/<stable-id>.md`, `INDEX.md`, `COVERAGE.md`, adjacent reference Markdown and the bounded component block in `../references/INDEX.md` are deterministic projections. Do not hand-edit projections. `pnpm docs:components` rebuilds them without changing canonical records. The seed script is one-time and refuses an existing registry.

`INVENTORY.md` remains the historical candidate list. The registry replaces it for active component discovery and approval, without retroactively approving or overwriting those suggestions. New local structures may reveal functionality not yet covered by approved business requirements (notably the home contact section). Their unresolved policies are recorded, never invented.

Future implementation: **read the approved component specification → inspect its exact reference images → read design explanations, Borrow/Reject and mobile limitations → implement within the confirmed release → verify visually**. Read the design entry point and product/architecture sources first. Check the current source revision, dependencies and unresolved questions. Archived records are excluded. No production components or gallery are implemented by this tool.

## Editing

- Search or filter the ownership-grouped sidebar; select a record. The ID stays fixed when the name changes.
- Enter your reviewer/author name. Add a component with a lowercase hyphenated ID; it starts as a draft. Save concise definitions; architecture/behavior and usage details are disclosures.
- Add a usage by selecting an explicitly approved section and writing its justification. Removing usage requires confirmation on save. Source revision changes are flagged and require re-review.
- Save before **Утвердить определение**. The explicit confirmation records your self-entered identity, UTC timestamp and approved revision. Material definition edits return approved definitions to review. Earlier evidence is preserved in snapshots and event history. Reviewer identity is not authenticated identity.
- Archive removes the component from active plans, retaining its stable record, relationships, history and images. Select **Показать архив** to restore it. There is deliberately no hard-delete endpoint.
- The overview shows reuse, dependencies, missing approved definitions, pending page structures and a conservative MVP readiness count. Readiness is planning guidance, never release permission.

Definition states: draft, in-review, changes-requested, approved. Visual states: no-reference, references-added, design-in-review, design-approved. Implementation states: not-started, in-progress, implemented, qa-approved. Only definition approval is enabled now. Uploads never auto-approve visuals; implementation controls remain inactive. A missing approved component reference is explicitly **MISSING REFERENCE**, even when exploratory images exist. Existing hero/global evidence remains scoped to its original target.

## Visual reference management

Upload one or several PNG, JPEG or WebP images. Limits: 8 MiB per image, 40 active references per component, 12 MB streamed JSON request ceiling. The client uploads sequentially and reports partial success; retry only unfinished files. Server checks the actual signature against the extension (PNG header/IHDR/IEND, JPEG SOI/EOI, WebP RIFF type/declared size); PNG dimensions must be positive and at most 16,000 per axis. This is format validation, not a general malware scanner or full image decoder. Files are served only by a guarded image endpoint with explicit MIME, nosniff, sandbox CSP and no-store, never from `public/` or as executable HTML/SVG.

Assets: `../references/components/<component-id>/ref-<UUID>.<ext>`. Server-generated names are independent of uploaded filenames. Canonical records keep the original basename, upload time and optional HTTP(S) provenance URL; URLs are not fetched. Each image has adjacent generated Markdown using the existing reference conventions: target, status, source/rights, explanation, Borrow, Reject, appearance/layout, desktop/mobile, interaction and unresolved details. Click a preview to enlarge it. Edit explanations, reorder with buttons, select a primary direction, remove or replace images. Replacement preserves the reference ID and creates a new immutable asset. Removed/replaced assets are retained; snapshots retain previous explanations. No image license or production rights are inferred.

Changing reference content, image, selection or ordering clears visual approval independently of definition approval. An approved reference explanation edit clears that reference approval too. Component visual approval is not React implementation approval.

## Persistence, recovery and boundaries

The isolated Node layer is `src/features/component-registry`; route files only gate and dispatch. No database, localStorage, commerce records, production modules or secrets in client code. A random session token, same-origin writes, strict loopback Host/forwarding checks and the loopback-bound launcher prevent normal cross-origin/LAN access. This is a trusted developer workflow, not production authentication. Do not expose it through a reverse proxy or bind another launcher to a public interface.

Mutations reject unknown fields, invalid enums, IDs, paths, broken/new unapproved relationships, dependency cycles, stale SHA-256 digests and missing reviewer names. Incoming paths never become write targets. Existing filesystem symlinks within the controlled tree are rejected. JSON and generated files use same-directory temporary writes, fsync and rename. A single directory lock serializes registry/document updates across processes. Do not edit files externally while a write runs; conflict checks detect external changes made before the locked read, not adversarial filesystem races.

Each prior canonical revision is recoverable in `history/<component-id>/<revision>.json`. A `.sync-pending` marker precedes canonical commit. Multi-file projection is not an atomic transaction: after a crash/error, the next GET regenerates derived documentation from canonical JSON before returning data. A failed response may have committed the record: download your local draft, reread and compare instead of blindly retrying creation/upload. The marker and abandoned images are safe recovery evidence; no automatic deletion runs.

If the process dies holding `components/.registry-lock`, stop all registry servers and verify no writer is running before removing **only that empty lock directory**. Then run `pnpm docs:components` and reload. Never remove registry/history/assets to resolve a lock. Direct JSON/Git edits bypass lifecycle enforcement: reset affected approvals and regenerate docs, or use the editor for approval-aware changes.

Validation: `pnpm test:components`, `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`; browser and production-request scripts under `tests/component-registry.*.mjs`. See `qa/REPORT.md` for executed evidence and remaining approval limits.

When another Next dev process owns `.next`, production validation can use the fixed isolated output: set `COMPONENTS_BUILD_CHECK=1` for both `pnpm build` and `pnpm start --hostname 127.0.0.1 --port 3002`. It writes only `.next-components-production`. Set `COMPONENTS_WORKSPACE=1` too when verifying that production still refuses access. Avoid changing Next configuration during active saves/tests; Next restarts can interrupt a write and leave the documented recovery lock. Next also regenerates `next-env.d.ts`; do not run multiple Next configuration/type-generation operations simultaneously.
