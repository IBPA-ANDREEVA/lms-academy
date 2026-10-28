# Design instruction entry point

Before UI work, inspect the [frontend pages](../architecture/frontend-pages.md), [sections](../architecture/frontend-sections.md), [shared components](../architecture/frontend-components.md) and [backlog](../architecture/frontend-backlog.md), then the existing implementation.

Source precedence:
1. Product requirements, release scope and unresolved policies determine behavior.
2. Public sitemap and architecture determine route ownership; proposed URLs are not published pages.
3. `DECISIONS.md` records selected visual decisions and exact approval limits.
4. `SYSTEM.md` owns tokens; `DIRECTION.md` owns composition. Runtime mappings are in root `DESIGN.md`.
5. The user supplies the reference for the specific page, section or component being implemented. Inspect the image itself; record scope and differences in the registry/verification note. A reference does not supply real prices, legal text or publication approval.
6. `SCREENS.md`, `COMPONENTS.md` and the frontend registry describe hierarchy, ownership and implementation state.

Read `QA.md` before and after implementation. User references are delivered in the task; the old reference gallery and planning editors are retired. Do not rebuild their storage, generated specs or UI. Implement directly in the requested application route/feature and update the lightweight Markdown registry.

Current scope: the header follows the supplied 2026-10-28 multi-viewport reference. Container/button/footer definitions were preserved from the edited planning records. Other shared styles are bounded proposals using existing tokens. No complete page or browser implementation has human visual approval yet. Home hero composition decisions remain historical direction; request the exact reference and approved media when that section is implemented.

Missing product policy, licensed media or approved legal content must be flagged rather than invented. Missing visual approval does not prevent implementing a reversible, clearly documented proposal within the user's request.

User-authorized exception (2026-10-28): `/preview/components` provides interactive examples of the existing shared components. It does not restore planning records, reference storage or approval tools. Keep previews synchronized with shared APIs.
