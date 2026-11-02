# Public-page refinement · 2026-11-02

Status: implemented proposal for owner review, not visual approval.

Scope: `/`, `/courses`, `/mini-courses`, shared public navigation/footer/cart preview, shared CourseCard, and public route-entry motion. Existing owners, release boundaries and fixture labels remain in place. No backend, payment, publication or new locale implementation.

Reference: owner's written request in this chat and the existing founder destination `https://lms-academy-peach.vercel.app/#founder`. The remote URL could not be retrieved by the web tool; the local implementation and existing D-017 geometry are the composition baseline. No new raster reference was supplied. Borrowed relationships: connected plum seams, photographic split sections, Unbounded display and Manrope body, Cut actions. New bounded proposals: rectangular outlined cards with offset shadows, dark active switcher, larger internal spacing, one review/recommendation strip, founder biography disclosure. These are scoped to the requested public surfaces; no new global palette or protected-workspace design.

Owner-provided RU wording is used for the hero, six academy benefits, certificate footnote, founder biography and four milestones. The full biography remains available under “Профессиональный путь”; this disclosure reconciles the supplied long text with the request for less visible text. The unchanged learning introduction is preserved. The catalog's additional informal “Выбери / Найди” copy is neutral/formal now. No English route or content dictionary exists; EN in the component preview is a labeled navigation demonstration. An English-language product audit cannot be claimed before that version exists.

HOME-06–09 visible headings/descriptions are removed and accessible section labels retained. Preview/release limitations remain in panel content after removing switcher badges. Footer preview badges are removed while unavailable entries retain disabled semantics. The CourseCard heading link covers its card; independent actions remain above the link overlay. Landing examples link only to existing labeled detail previews. The third mini-course example uses the existing makeup preview rather than inventing a lamination detail route.

The learning demo now presents video only in step 1, a large upload/comment workspace in step 2, and feedback/revision in step 3. It still has no approved video and transfers no files. Homework state survives tab changes. Reviews and the recommendation placeholder share a single native horizontal strip, with mouse drag, touchpad, touch and keyboard controls; no actual testimonial is fabricated.

Motion: scoped GSAP route fades on an owned wrapper and CSS view-timeline heading entrances (progressive enhancement), existing reversible cart and panel transitions, CSS control hover/disclosure entrances. No transforms on sticky ancestors or shared geometry. Live reduced-motion changes clean up section/route animations and settle catalog transitions. No delayed route navigation or interference with native link semantics.

Verification artifacts: `.landing-evidence/` (home and section captures), `.catalog-evidence/` (both catalogs), existing learning-offers and commerce test evidence paths. Viewports: 1440×900, 768×900, 390×844, 360×844; catalog also checks 320 px. Original photography and Cyrillic fonts remain unchanged. Captures are local review artifacts, not approved design references. No horizontal document overflow was observed in the checked matrix.

Checks and final results are recorded in the delivery response. Required remaining review: owner judgment of the new card/switcher styling, spacing and biography disclosure; English copy when supplied/implemented; actual catalog, lesson and review content remains unpublished.

Hydration correction: the route animation changes only the DOM wrapper owned by PublicMotion, never a streamed page's `main` or heading attributes. CSS view-timeline heading reveals are progressive enhancement; unsupported browsers display the headings normally. Auth modal focus follows committed open/view state without delayed callbacks that could run after close.

Final checks passed:
- `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, `git diff --check`.
- `node tests/landing-refinement.browser.mjs`: copy, six benefits, responsive overflow, distinct demo stages, preserved input, whole-card links, reviews mouse drag/horizontal wheel, reduced motion, browser errors including hydration diagnostics.
- `node tests/catalog.browser.mjs`: both catalogs, full-card navigation, filters/query history, keyboard tabs, sticky offsets and reduced motion.
- `node tests/learning-offers.browser.mjs`: four panel heights, stationary shared geometry, sticky switcher, touch isolation, keyboard/reduced motion and package preview boundaries.
- `node tests/commerce.browser.mjs`: cart disclosure/reversal, empty state, persistence, cross-tab changes, checkout demo, recovery and responsive states.
- `node tests/auth-modal.browser.mjs`: focus, view switching and forms at 1440/768/390/320.
- `node tests/public-header.browser.mjs`: overlay/collapsed/reversal states, navigation, cart and auth at 1440/1024/768/390/320.

Browser runs used `FRONTEND_URL=http://localhost:3000` and `PLAYWRIGHT_MODULE=/Users/ivanmakovetskyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`. The catalog test now scrolls to the filter element rather than assuming every filtered page permits 1000 px of scrolling. Header reversal tests re-establish the collapsed scroll state after native dialog focus restoration. Existing tests use the new empty-cart text and the remaining offers content as the swipe target after title removal.

Visual review inspected home, founder, about, learning preview, offers, catalog and empty-cart captures. Purple seam coordinates remain unchanged; longer supplied copy expands the about/founder content naturally. Compared with the prior implementation, course cards now form a balanced row on desktop and the mobile catalog photograph comes first. The learning video remains a clearly labeled placeholder. Section titles/descriptions requested for removal are absent from HOME-06–09. Development-only demo controls may appear in captures; production continues to exclude them. Final owner visual approval is still pending.
