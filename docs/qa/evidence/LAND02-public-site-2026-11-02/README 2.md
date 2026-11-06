# LAND02 browser evidence · November 2, 2026

See the [implementation, reference scope, issue disposition and FAQ provenance](../../LAND02-public-site-refinement-2026-11-02.md). Branch `refactor/landing`; baseline HEAD `eb3665d1d6ec7441c462ba9ad7d20b6944d506f1`. Initial unrelated documentation/logo/shell work was preserved. These artifacts are verification, not owner visual approval.

Production browser origin: `http://localhost:3112`. Commerce's development-only fixtures were tested at `http://localhost:3000`. Installed Chrome and bundled Playwright; no new dependency. Screenshot viewport: desktop/tablet height 900, mobile height 844, pixel width preserved. Full-page captures extend to content height. Reduced motion is used for the systematic layout matrix; separate motion tests exercise normal and live-changing preferences.

## Direct before / after comparisons

Original LAND01 evidence is unchanged. Both full-page pairs use the same width; focused viewport pairs show changed content rather than claiming pixel-identical scroll position.

| Target | LAND01 baseline | LAND02 current |
| --- | --- | --- |
| Homepage / header / hero, 390 | [Before](../LAND01-public-site-2026-11-02/home-390.png) | [After](home-390.png) |
| Homepage, 1440 | [Before](../LAND01-public-site-2026-11-02/home-1440.png) | [After](home-1440.png) |
| Mobile education navigation | [Before rail/dropdown](../LAND01-public-site-2026-11-02/state-navigation-open-390.png) | [After menu](menu-390.png) |
| Courses catalog, 390 | [Before](../LAND01-public-site-2026-11-02/courses-390.png) | [After](courses-390.png) |
| Mini catalog, 1440 | [Before](../LAND01-public-site-2026-11-02/mini-courses-1440.png) | [After](minis-1440.png) |
| Filter popup, 390 | [Before collision](../LAND01-public-site-2026-11-02/finding-filter-Язык-390.png) | [After bounded popup](filter-courses-language-390.png) |
| Home main courses, 390 | [Before](../LAND01-public-site-2026-11-02/state-offers-0-390.png) | [After](offer-0-390.png) |
| Home mini-courses, 390 | [Before](../LAND01-public-site-2026-11-02/state-offers-2-390.png) | [After](offer-2-390.png) |
| About / founder, 390 | [Before full page](../LAND01-public-site-2026-11-02/home-390.png) | [About](about-390.png), [founder](founder-390.png), [biography expanded](founder-open-390.png) |
| Learning media, 320 | [Before clipping](../LAND01-public-site-2026-11-02/finding-learning-media-320.png) | [After](learning-320.png) |
| Detail media, 390 | [Before](../LAND01-public-site-2026-11-02/course-lashes-390.png) | [After](course-detail-390.png) |
| Auth, 390 | [Before background-scroll defect](../LAND01-public-site-2026-11-02/state-auth-background-scroll-390.png) | [After](auth-390.png); restoration assertions in results/tests |

## New compositions and motion

- FAQ: [1440](faq-1440.png), [390](faq-390.png), [320](faq-320.png), [live reduced motion](faq-reduced-768.png).
- Menu: [390](menu-390.png), [320](menu-320.png). White BBA artwork preserves D-018; preview statuses and real destinations are retained.
- Sticky offers: [courses](offer-0-390.png), [packages](offer-1-390.png), [minis](offer-2-390.png), [USA](offer-3-390.png). Geometry is group-owned and stationary. Outer content swipe does not select another panel; nested carousels keep native horizontal gestures.
- Intro: [early droplet](intro-early.png), [flood/reveal](intro-flood.png). [Solid plum hold](intro-solid-plum.png), [completed reveal](intro-complete.png), [fill geometry](intro-fill-results.json). Independent captures sample a live timeline, so screenshot capture time affects the exact sampled phase. Session, route exclusion, interruption, storage, slow-start and reduced-motion assertions supplement the two images.
- Parallax Cut: [six states at 1440](cut-states-1440.png), [six states at 390](cut-states-390.png), [real primary hover](cut-primary-hover.png), [real primary press](cut-primary-pressed.png), [inverse hover](cut-inverse-hover.png), [keyboard focus](cut-focus.png), [reduced motion](cut-reduced-motion.png). Default/hover/pressed captures for primary, secondary, inverse and link share `cut-{variant}-{state}.png` naming. Actual layers and unchanged colors are recorded in [cut-results.json](cut-results.json).
- [No-JavaScript homepage](no-js-home.png): all four offer panels remain available; native menu/biography/FAQ disclose without hydration, intro has no default overlay.

## Matrix / repeatable checks

`tests/land02.browser.mjs` covers `/`, `/courses`, `/mini-courses`, both representative detail kinds and `/preview/components` at 1920, 1440, 1024, 768, 430, 390, 360 and 320px: 48 default route/width cases, plus menu/auth/filter/empty/history/offer/FAQ states. [results.json](results.json) records document overflow **and text-range/clipping-ancestor bounds**, excluding intentional native horizontal scrollers. Open filter popups are tested separately. Each homepage width captures all four offer panels and local sections. It checks exact active panel height, stable geometry, tab focus, no selection scroll jump, redundant-control removal, modal wheel lock and exact scroll restoration.

`tests/land02-motion.browser.mjs` adds direct hash entry, browser Back to the correct panel, rapid tab switching, resizing, live reduced-motion settling and FAQ reversal. [motion-results.json](motion-results.json).

`tests/cut-button.browser.mjs` verifies actual pseudo-element/label/arrow/depth transforms, stable hit bounds, unchanged resting/hover colors, 120ms press compression, keyboard focus, disabled/loading, live reduced motion and real CDP touch. Chrome applies native touch `:active` feedback at tap completion; the test samples that feedback and verifies it returns to rest while touch-emulated hover cannot move the layers.

[button-consumers.json](button-consumers.json) records actual JSX consumers before evaluating the shared Cut change. [premium-static-audit.json](premium-static-audit.json) is the strict static skill audit; it does not replace browser verification.

Reproduction (installed runtime path for this workstation):

```sh
export PLAYWRIGHT_MODULE=/Users/ivanmakovetskyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright
export FRONTEND_URL=http://localhost:3112
pnpm lint
pnpm build
pnpm exec tsc --noEmit
node tests/frontend.browser.mjs
node tests/land02.browser.mjs
node tests/land02-motion.browser.mjs
node tests/land02-media.browser.mjs
node tests/cut-button.browser.mjs
node tests/auth-modal.browser.mjs
node tests/catalog.browser.mjs
node tests/course-detail.browser.mjs
node tests/public-header.browser.mjs
node tests/landing-refinement.browser.mjs
node tests/public-polish.browser.mjs
node tests/home-10-11.browser.mjs
node tests/learning-offers.browser.mjs
COMMERCE_PRODUCTION=1 node tests/commerce.browser.mjs
node --test tests/demo-cart.test.mjs
FRONTEND_URL=http://localhost:3000 node tests/commerce.browser.mjs
```

Build before starting the production server; restart it after any rebuild. Rebuilding under an already-running server produced stale chunk references in an earlier run; final verification uses one unchanged build and a fresh server. TypeScript checks run after build to avoid generated `.next/types` races.

Legacy assertions were corrected using current source evidence: six benefits and no removed About CTA; real mobile drawer instead of rail; content-height mobile hero; actual detail sections without missing trainer/modules; owner-removed badges; fixture controls only in development component preview; current auth notices; selected tabs' current mobile surface; identity transforms as zero displacement; terminal Cut arrows are decorative and omitted from accessible names. Meaningful navigation, fixture safety, form state, disabled payment and missing-content assertions remain.

## Final outcome

All listed commands passed. The final preview-only click-counter addition was rechecked with build, sequential typecheck, lint/static audit, full frontend suite, Cut interaction suite and [eight-width preview probe](preview-final-results.json); other route behavior is unchanged from the 48-case matrix. [Machine-readable verification and command logs](verification.json). The 48 route/width cases report zero document overflow and no tested text-range clipping. Separate [media bounds](media-results.json) cover 18 local-frame measurements for learning and both detail kinds at 1024/768/430/390/360/320px. Browser suites cover native no-JS menu/FAQ and all offer content, intro lifecycle, URL/history, nested swipe isolation, rapid state changes, reduced motion, and current fixture/unavailable service boundaries. Strict static audit: zero findings. No commit or deployment.

## Limits / review

Chrome emulation and local demo states only. Real devices/virtual keyboards, other engines, assistive-technology sessions, real authentication/payment/contact/media services and launch-content/media/legal approval remain unverified. A storage-disabled document uses its in-memory intro guard for internal navigation; a hard reload cannot preserve a storage-backed session flag when the browser denies that storage. FAQ copy and all new visual compositions remain pending owner review. Existing founder/academy claims and mini-certificate copy remain separate content-review blockers; this task does not silently approve or replace them.
