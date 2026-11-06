# Premium public motion redesign — 2026-11-02

Status: implemented; automated and browser verification completed. Human motion review remains pending. Owner supplied the six references in [MOTION.md](../design/MOTION.md), then explicitly limited scroll intensity to preserve the user flow. This task changes presentation only. The pre-existing worktree contains extensive uncommitted product/UI work; those edits are preserved. No commit, push, deployment, Vault changes or business-policy decisions are authorized or performed.

## Scope and design comparison

- Existing plum `#782858`, off-white/white, Manrope and Unbounded remain unchanged; browser checks include actual Russian glyphs.
- Wipe borrows the panel/content directional relationship and async readiness handoff. It is shortened to .24s cover/.32s reveal. Browser history uses a reverse reveal because Next owns immediate popstate commits.
- Circle uses centered clipping/masking and represents a mounted Next loading boundary. It replaces the old timed welcome droplet. It never delays a ready page or runs alongside Wipe.
- HOME-03→04 borrows sticky scale/rounding with no darkening and no added height; desktop only. HOME-06 adds at most 120px of travel when the card row fits. No document snapping, smooth-scroll library, wheel interception or required sequence.
- HOME-06–09 Carousel reuses existing tab controls, mounted state, active-height owner and stationary purple seams. No automatic scroll-driven selection.
- The ordinary catalog grid retains its native layout/filter mechanics; checkout/auth remain functional. References do not approve new claims, fixtures, launch inventory or legal text.

## Implementation owners

New: `home/composition/academy-story.tsx` and CSS; `home/sections/06-courses/components/use-featured-course-scroll.ts`; `public-shell/page-wipe-transition.tsx`, `circle-loader.tsx`, `route-loading.tsx`; `component-preview/motion-preview.tsx` and CSS.

Extended: `public-shell/PublicMotion`, motion tokens, SectionReveal and overlay CSS; HomePage composition; CourseShowcase and local CSS; HOME-08 local media sizing (pre-existing image/title overlap found during visual QA); LearningOffersShowcase and CSS; `(details)/loading.tsx`; the existing component preview. No shared CourseCard, Button, filter, authentication or commerce API changed.

## Verification record

Evidence: [motion results](evidence/premium-motion-2026-11-02/results.json), [Circle results](evidence/premium-motion-2026-11-02/circle-results.json), and the screenshots in the same directory. Chromium/Chrome was used for automated checks; the in-app browser was used to inspect the references, homepage switcher and public navigation. Test tooling reused the installed external Playwright runtime; package dependencies and lockfile were not changed.

| Check | Result |
| --- | --- |
| `pnpm lint` | Passed |
| `pnpm exec tsc --noEmit` | Passed |
| `pnpm build` | Passed; production server on port 3117 used for motion verification, then stopped; existing development server on port 3000 preserved |
| `node tests/premium-motion.browser.mjs` | Passed all 12 groups: 1440×900, 768×900, 390×844, 360×844; reverse story scrub, brief sticky row, rapid/keyboard switches, active height/scroll stability, live reduced motion, routes/focus, back and forward direction, delayed navigation, interruption, resize, failed RSC recovery, single-overlay rule, no-JS home |
| `node tests/circle-loading.browser.mjs` | Passed slow/fast/interrupted/reduced/live-reduced; no uncaught page errors. Test-only localhost proxy delivers the actual Next shell/Flight payload before the resolved detail segment, modeling slow server content without changing app data or adding a route/delay to the app. The resolved page record is delivered later, unchanged. |
| `pnpm test:frontend` | Passed public home, preview, retired routes, forms, loading state and responsive checks at 320–2560px |
| `pnpm test:learning-offers` | Passed four mounted panels, sticky navigation, keyboard/reduced motion, touch isolation, filters, package dialog and release boundaries |
| `node tests/catalog.browser.mjs` | Passed catalog/filter checks |
| `node tests/course-detail.browser.mjs` | Passed 1440/768/390/320px detail checks |
| `node tests/auth-modal.browser.mjs` | Passed 1440/768/390/320px auth UI checks |
| `node tests/commerce.browser.mjs` | Passed on development port 3000: navigation, persistence, cross-tab updates, preview, guest/auth, failures and responsive states. An initial run against production correctly found no development-only demo actions and stopped; rerun used the intended development surface. |
| `node tests/motion-lifecycle.browser.mjs` | Passed 4× CPU, denied sessionStorage, utility entry/internal navigation and slow hydration |
| Premium frontend audit, strict mode | Passed, zero findings |
| `git diff --check` | Passed |

The current focused suite is the motion acceptance evidence. Older LAND02/motion-system matrix scripts were updated to remove obsolete timed-welcome expectations but were not rerun in full. Their no-JS detail assertion remains intact; the existing PPR limitation below is not silently waived.

Visual comparison: the 1440×900 home composition retains the original hero photograph, Cyrillic display typography and palette. The HOME-03/04 handoff changes only scale/corners; the HOME-06 row uses the existing cards. The 390×844 and 360×844 views retain normal vertical flow and existing horizontal controls, with no added scroll sequence. Switcher screenshots show a shared stationary header/seam and two coordinated surfaces during the slide. A pre-existing HOME-08 compact-card media sizing conflict was found during visual QA and fixed locally: the image now stays in its grid column instead of painting over titles. Automated image/content separation and text-range checks supplement document-overflow assertions. Catalog/detail layouts remain the existing compositions. No visual approval is inferred from these checks.

Selected evidence: [course switch completed](evidence/premium-motion-2026-11-02/switch-complete-1440.png), [desktop home](evidence/premium-motion-2026-11-02/home-1440.png), [story handoff](evidence/premium-motion-2026-11-02/story-1440.png), [featured row](evidence/premium-motion-2026-11-02/featured-1440.png), [mobile offers](evidence/premium-motion-2026-11-02/offers-390.png), [Circle during real pending content](evidence/premium-motion-2026-11-02/cold-circle-slow.png).

## Limitations and follow-up

- Existing course fixtures have no approved course images. The independent image transform is conditional and ready for those images; its final visual balance needs verification with actual course photography. No imagery or inventory was invented.
- Existing dynamic detail routes can remain on their streamed fallback with JavaScript disabled because of Next PPR. This predates the motion changes and is recorded in the frontend backlog. Homepage content, all four offer panels and server-rendered section content remain visible without animation JavaScript.
- Circle requires a hydrated, genuinely pending loading boundary. It intentionally does not animate while the JavaScript runtime itself is unavailable, or when the fixture response is already ready before hydration.
- Popstate commits belong to Next, so back navigation mirrors the reveal direction with an immediate cover; it cannot replay the complete departing-page cover before the native history change.
- Physical-device Safari/touch, virtual-keyboard and low-end GPU checks are not claimed. Human visual/motion approval is still required; no new content, legal or launch approval is inferred.

No routing replacement, smooth-scroll library, new dependency, business-logic change, commit or deployment was introduced.
