# Catalog switcher flashing correction — 2026-11-04

Target: the owner's repeated intermittent-flash report for the `/courses` ↔ `/mini-courses` format switcher. Existing CatalogExperience owns both route panels. No new visual reference, route, data, service or release behavior. Earlier Cut/menu/home changes remain unchanged. Prepared on `codex/homepage-section-motion`; the branch history records the separate delivery commits.

## Reproduction and cause

Recorded the previous optimized build before editing, sampling 18 switches (ordinary and rapid reversals). Both full-width panels moved only 12% while alpha-crossfading with different durations and easing: outgoing 220ms power2.in, incoming 360ms power3.out. They occupied almost the same screen area while both remained readable. The later DOM sibling also painted above the earlier sibling in both directions, making the visual result direction-dependent. Of 848 sampled moving frames, 358 had both panels above 50% opacity. The screenshot shows duplicate overlapping headings, borders, images and price text. Rapid reversals prolonged this overlap. This is the reproduced defect; the prior completion-state checks did not detect it.

The initial trace did not show a selected-tab rollback or an incoming-opacity restart during ordinary route commits. Do not attribute this reproduction to hydration or a router failure without evidence. The fix also removes the fragile per-kind context reversion/snapshot mechanism so routing and interruptions cannot reinitialize separate panel timelines.

## Change

- `src/features/catalog/components/catalog-experience.tsx`: one scoped, lifetime-owned GSAP controller, one numeric progress tween and complementary xPercent positions. Course and mini-course surfaces share an edge and never overlap. A layout effect redirects the controller when the optimistic kind changes, preserving immediate response without depending on network completion.
- `src/features/catalog/components/catalog-experience.module.css`: opaque existing-background panels. Removed opacity animation entirely. The necessary visual adjustment is a coordinated full-width slide, retaining the 360ms total duration with power2.inOut easing.
- Height interpolates from cached natural panel measurements; ResizeObserver updates these for content/image changes. Resize or live reduced-motion preference settles immediately. Finished/removed controllers clear owned transforms, visibility, will-change and explicit height; observers/listeners and tweens are cleaned up.
- Native tab semantics, keyboard focus, inactive inert panels, query filters, Next routing/history/SEO and all final layouts remain unchanged. No timeout, global hiding or new loading overlay.

## Verification

Added `tests/catalog-switcher-motion.browser.mjs`. It **fails on the previous optimized artifact** at the opaque-surface assertion, and **passes on the corrected optimized artifact**. It exercises 96 switches across 1440×900, 390×844, 360×844 and 768×900, with 650ms delayed RSC responses, 4× CPU throttling on mobile, rapid reversals, query retention, back/forward, hard refresh, keyboard activation, viewport resizing and live reduced motion.

Final optimized run: 4,005 sampled frames, including 3,234 moving frames; no page errors. Each moving frame has opacity 1 on both panels, a shared edge within 1px, and non-collapsed track geometry. Selection never rolls back without new input; progress stays monotonic toward the latest destination, with continuous position across reversals. The continuity bound allows one GSAP ticker frame because the independent sampling rAF can run before that frame's GSAP update; a stricter per-callback speed bound initially flagged a normal forward-moving frame under CPU throttle, not a reversal or opacity flash.

Passed:

- `pnpm lint`, `pnpm exec tsc --noEmit`, `git diff --check`.
- `node --test tests/catalog-contract.test.mjs tests/demo-cart.test.mjs`: 5 passed.
- `pnpm build` for separate `TEST_PREVIEW=true` and `false` artifacts, reserved test SITE_URL `https://academy.example.test`.
- `tests/catalog-switcher-motion.browser.mjs` against development and optimized preview builds.
- `tests/catalog-shared.browser.mjs` against both optimized modes: shared state, text clipping, icon uniqueness and live reduced motion.
- `tests/catalog-seo.browser.mjs` against both optimized modes: 17 checks each, including metadata/indexability, sitemap, robots, detail/cart behavior and assets. No SEO source change needed.
- `tests/public-controls-followup.browser.mjs` against optimized preview: existing menu handoff and responsive HOME-08 regression retained.

Before/after transition screenshots and four settled viewport captures were visually reviewed. No duplicated translucent text remains; final card dimensions/typography and tab layouts match the existing design. Evidence: `docs/qa/evidence/catalog-switcher-flash-2026-11-04/`. Full frame traces remain in `.landing-evidence/switcher/production/`; original trace is `.landing-evidence/switcher/before-trace.json`.

The real-mode Catalog adapter remains unconnected and returns its existing unavailable result/structured diagnostic, without demo fallback. Physical Safari/device testing and human visual approval remain outstanding. Verification preceded the owner-authorized commit/push/PR delivery; no deployment is included. Verification servers use isolated directories/ports and are stopped afterward; owner's port 3000 is untouched.
