# Entrance initialization and loading handoff · 2026-11-04

Owner follow-up on `codex/homepage-section-motion`. Scope is animation lifecycle repair on the existing homepage and its shared public motion owners; no visual redesign, new loader, route, product data or backend behavior. This supersedes the lifecycle description in `homepage-section-motion-2026-11-04.md`.

## Audit and causes

1. HomeEntranceMotion created `fromTo` timelines inside the intersection callback, after targets were already painted. It also scheduled another animation frame and triggered at 90%/96% of viewport height. Thus visible final content was reset to the starting state too late. Generic SectionReveal repeated the same pattern.
2. Home waited for the splash/wipe's `hidden` attribute and a separate `document.fonts.ready` gate. The splash's entire 800ms reveal completed before the entrance could even be scheduled. They had no readiness/playback handshake. Streamed child hydration can occur after the parent shell's layout effect.
3. Public Wipe also translated headings owned by entrance choreography. Offers previously waited for the full group switch before creating their card timeline, causing another late reset.
4. Cleanup retained only currently running scenes. GSAP context reversion can restore a completed tween's starting snapshot during media changes/React Activity restoration; completed targets also need final style release.
5. Home's selection-feedback hook captured a changed catalog selection in a matchMedia callback. Toggling reduced motion back off could replay that old selection. Initial preview hydration could also run this second card animation alongside the entrance owner.

No hydration mismatch was found in browser console/error collection. Current `src/features` has no ScrollTrigger import/creation; these entrances use IntersectionObserver and actual DOM bounds. Adding ScrollTrigger refresh calls would not address these causes. Native IO tracks layout changes; existing offer ResizeObserver remains the natural-height owner.

Read installed Next guides on Server/Client Components and preventing flashes before hydration. The implementation respects their distinction: a layout effect precedes the hydrated paint, but cannot undo already-painted server HTML. Already-exposed content after late hydration is therefore never hidden again. GSAP references: [React lifecycle/context cleanup](https://gsap.com/resources/React/) and [immediate gsap.set](https://gsap.com/docs/v3/GSAP/gsap.set()/).

## Changes and ownership

- `home/composition/home-entrance-scenes.ts`: applies each target's starting values with `gsap.set` during preparation and builds paused `to` timelines. Includes inactive offer cards, preventing first-exposure resets. Existing durations, stagger, easing, transforms and visual treatments preserved.
- `home/composition/home-entrance-motion.tsx`: scoped layout-lifecycle preparation, separate prepared/playing/complete states, pre-paint mutation handling for actual preview data, and playback from existing timelines. IO begins 120px ahead of the viewport with no extra rAF; skipped scenes settle on fast scroll. Incoming cards begin with their panel reveal instead of after its full switch. Inactive/obsolete work cancels; focus/pointer settles immediately. All owned targets clear after context reversion, including completed scenes. MatchMedia and every observer/listener clean up; seen scenes do not replay.
- `public-shell/motion-handoff.ts`: small shared presentation protocol with explicit ready/reveal events and covering/revealing phases. Actual consumers are PublicMotion, SplashLoader, PageWipeTransition, HomeEntranceMotion and SectionReveal. It contains no router, business state or animation durations.
- `PublicMotion(children)`: parent layout-ready notification; `SplashLoader` adds optional `coordinated=false` (true only in PublicMotion). Standalone MotionPreview retains its original behavior. Homepage readiness is acknowledged by the child after preparation, accounting for streamed hydration and Strict Mode. A microtask releases the ready notification outside GSAP contexts, before paint; no timer/dwell.
- `SplashLoader`: releases the entrance in the same call that starts its existing .8s curtain reveal. Keeps the existing no-JS/reduced-motion bypass and pre-hydration fail-open until actual handoff; failed/late hydration does not strand or re-cover the document.
- `PageWipeTransition`: waits for a visible homepage's preparation, then emits reveal on the same frame as the existing .32s reveal. Removes duplicate translation of headings with their own entrance owner. Navigation/history/anchor/loading/error/watchdog/focus behavior unchanged.
- `SectionReveal`: same public props/consumers; prepares offscreen/covered targets before playback and shares the reveal handoff. Already-exposed content is left visible. Home continues to defer to its local owner.
- `useOfferSelectionMotion(root,selection,compact?)`: CourseShowcase, PackageExplorer and MiniCourseExplorer consumers unchanged. Only a new, visible selection after the entrance is eligible; preference restoration never replays it. Cleanup settles both on preference changes and unmount.

SSR/no-JS markup remains readable, with no global opacity rule. Visible content after failed/delayed enhancement is an intentional direct state. Geometry, fonts, colors, section order, stationary seams, input values and native controls are unchanged. The original user-supplied landing references and Awwwards-inspired scene scope remain; no additional visual approval is claimed.

## Verification

Results and browser captures are in `.landing-evidence/motion-lifecycle-*` and `.landing-evidence/sync-final-regression`; selected evidence is maintained beside this report. Browser lifecycle regression captures computed opacity each animation frame, including ancestor opacity, instead of checking only a final screenshot.

Final checks are recorded below after completion.

SEO: reviewed the guide/checklist; public route URLs, content semantics, metadata, canonicals, robots, sitemap and structured data are unchanged. The project still has no approved production SITE_URL and no connected production catalog adapter. Preview fixtures remain non-indexable. Physical-device Safari and low-end-device visual review remain outside this Chrome verification.

### Final results

- `pnpm lint`, `pnpm exec tsc --noEmit`, `git diff --check`: pass. Existing Git LF/CRLF notices are not diff errors.
- `node --test tests/catalog-contract.test.mjs tests/demo-cart.test.mjs`: 5 pass; existing Node typeless-package warning unchanged.
- `TEST_PREVIEW=true LMS_BUILD_DIR=.next-land03-sync-prod pnpm build` and `TEST_PREVIEW=false LMS_BUILD_DIR=.next-land03-sync-real pnpm build`: pass. Real-mode adapter-not-connected diagnostics remain expected.
- New `tests/homepage-motion-lifecycle.browser.mjs`: pass on final development and optimized preview builds at 1440×900, 390×844, 360×844 and 768×900. Results include cold entry/hard refresh, actual scrolling/large jumps, same-frame curtain/hero handoff, no decreasing visible opacity across sampled frames (including ancestors), 4× CPU throttling, route navigation/back/forward, rapid format changes, live reduced-motion restoration, no-JS, blocked client scripts, and scripts delayed 5.5s beyond the pre-existing fail-open. No browser errors/hydration warnings. No timing delay was added to application code.
- `tests/homepage-section-motion.browser.mjs`: all 14 scenes × 4 widths pass on the optimized preview build. Natural document height and seam coordinates are identical before/after completion, no pin spacers, completed styles released, no replay, form state retained. The previous all-styles-empty assertion was corrected to distinguish deliberately prepared offscreen targets from completed/interrupted ones.
- `tests/landing-refinements.browser.mjs`: pass at all four widths, including packages/cart, upload geometry, repeated dropdown animation, keyboard and text fit.
- `tests/catalog-shared.browser.mjs`: pass for preview and real optimized artifacts, including shared component states, text-range clipping and live motion preference.
- `tests/catalog-seo.browser.mjs`: 17 checks pass for each final preview/real artifact. Metadata/indexability/sitemap/schema behavior unchanged.
- Existing `tests/motion-lifecycle.browser.mjs`: pass for CPU, denied storage, utility navigation and slow hydration (its legacy intro selector is not evidence for the new entrance behavior).
- Premium static audit: zero findings in strict mode. Selected JSON/screenshot evidence: `docs/qa/evidence/animation-synchronization-2026-11-04/`. Inspected actual 1440×900 and 390×844 About frames; existing photographic crop, Cyrillic typography and geometry retained. Recorded actual Chrome walkthroughs at `.landing-evidence/motion-lifecycle-prod/lifecycle-1440.webm` and `lifecycle-390.webm`.

The full-page layout-shift collector observed 0 on refresh/mobile runs, ~0.0023 at 1440px and ~0.00081 at 768px in cold scrolling runs. A separate control reproduced a ~0.00278 shift in the existing header bar docking/height transition with reduced motion and no entrance animations; the animated control reported none. These are not a claim of globally zero CLS. Entrance initialization adds no layout travel or seam displacement in the structural assertions. Existing header behavior is unchanged.

Earlier regression runs exposed and then verified fixes for completed GSAP snapshot restoration, historical selection replay on preference restoration, and late-hydration Strict Mode splash reopening. The final passing evidence supersedes those failed intermediate runs. No new human visual approval or real-device Safari guarantee is inferred. Changes remain uncommitted on `codex/homepage-section-motion`; unrelated backend/planning work is preserved.

Subsequent owner visibility follow-up: the +120px trigger and unchanged-duration descriptions above are superseded by [visible entrance timing](homepage-motion-visibility-2026-11-04.md). Pre-paint preparation, synchronization and cleanup guarantees remain.
