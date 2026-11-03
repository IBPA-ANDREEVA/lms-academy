# Animation and mobile redesign · 2026-11-03

## Scope and authority

Owner-requested work on `/`, both catalog routes, their shared detail/shell consumers and `/preview/components`. Russian-first public discovery; existing MVP boundaries, later-phase package/USA/review previews and unavailable service states preserved. No source photography, inventory, biography, prices, legal copy, routes, dependencies or authoritative server policies added. Owner explicitly authorized independent local commits; no push/deploy.

Applied skills: frontend-design + frontend-design-premium, gsap-react/core/utils/timeline, relevant scroll/performance guidance, and Browser/computer-use for actual UI checks. Repository design sources and installed Next 16.4.3 guides (useRouter/usePathname and native history integration in Linking and Navigating) were read. No duplicate preview or feature hierarchy introduced.

## Supplied reference contract

All source files were supplied in this chat under `C:/Users/im061/AppData/Local/Temp/`. Filenames below use the `codex-clipboard-` prefix and `.png` suffix.

| Image / file stem | Target and borrowed relationship | Excluded / viewport bounds |
| --- | --- | --- |
| 1 / `402c21b2-82c5-420e-b183-db6225a6fca7` | Shared Cut: small lift/shift with solid offset shadow | Raster wording/type is not data; preserve APIs, focus and disabled states. All widths; hover only where supported. |
| 2 / `8ee6d093-a826-4f12-a5f0-a98a9b382c56` | HOME-06–09 desktop sticky pill in a plum band, clear selected format | No gradients, new icons, fake count or changed inventory. Desktop band; mobile equal fitted tabs. |
| 3 / `a34c6b47-3c06-48ef-88bd-3b0c1304d18e` | Mobile hero: photograph first, strong Russian headline, full-width CTA, first-screen height | Preserve actual BBA logo/photos and Unbounded/Manrope. No generated section number or raster copy. <=760px, 390 and 360 verified. |
| 4 / `01de95db-c607-45d3-8dd8-b6fcb89e1c2b` | Mobile About: photo/angled edge above narrative, two-column benefits | Existing six benefits and footnote retained rather than silently cutting facts to the four-card illustration. <=760px. |
| 5 and 9 / `1908804c-fc76-4f96-be25-af91ddad5c8d`, `51d66515-0b82-422c-ab1f-4fd17aa3a9be` | Mobile Founder: portrait-first, connected plum edge, biography/disclosure, vertical milestones | No new credential claims; actual copy and four milestones retained. <=760px. |
| 6 and 10–13 / `4f6cd860-38d4-4d48-912d-6742d8d96007`, `b4d10266-bbca-47f6-a6f7-8cde80bc4c13`, `ec13f043-d593-4531-bd33-a51dadc924d6`, `a485f258-7fd0-4ab5-b0d2-d009fafb58a3`, `a19e84dc-607c-4c69-9577-f4bf9808f564` | Mobile learning: plum introduction, three fitted step tabs, media/body/CTA stack | Existing lesson placeholder stays honest; no fake play control. Existing copy/local demo retained; coordinated motion is the bounded implementation of the requested more expressive treatment. <=760px. |
| 7 / `a63b47e8-50e2-4904-98f3-b788b7d50d97` | Mobile packages: plum intro, fitted category controls, card and builder sequence | Preserve All + three actual filters, unavailable prices and preview status. No new package policy. <=760px. |
| 8 / `7a7afc01-6a3a-43bd-82b3-3db1e2012427` | Mini catalog: fitted format controls and two-column stacked cards | Preserve actual example titles, missing photos and unavailable purchase state. Mobile grid <=600px. |

Intentional differences: real licensed local fonts replace raster lettering; existing factual content can make sections taller; tablet retains its existing split composition; no new decorative numbers, gradients, icon set or invented video. Direction is selected by the brief; screenshots are **not human implementation approval**.

## Implemented repairs

- Public Wipe now coordinates same-page and cross-page hashes, hidden Next Activity trees, inactive offers and destination focus. Watchdog/interrupt cleanup preserves pending positioning. Regular forward pages start at top.
- Plum Splash replaces Circle/droplet: bounded welcome plus real pending-state variant. Preview reuses the actual loader.
- About/Founder surfaces stay in document flow; their shared seam no longer floats during a shrink/rounding animation.
- All offer formats share one short scroll entrance; removed the course-only sticky beat. Switching back to Courses has the same outgoing/incoming animation and active-height cleanup. Desktop pill/band and mobile fitted tabs share one owner.
- Founder/FAQ use measured whole-details animation. FAQ interpolates shape and height together; FAQ precedes Contact with the existing connecting seam and anchor.
- Learning transitions coordinate a curtain, content, media and measured height. Fixes include retained input and bringing tabs into view after long-to-short stage changes.
- Mobile hero fills the first viewport; photo-first sections follow the supplied references. Shared compact cards stack correctly; mobile catalog minis use two columns. Swipe rails expose the next card, hide bars/mobile arrows and preserve drag/keyboard/dots.
- Cut uses Lift & Shift and a solid shadow. Shared consumer behavior, unavailable states and inverse readability are retained.

## Browser findings and corrections

| Found during review | Correction / evidence |
| --- | --- |
| Anchor timeout discarded the pending scroll; cached hidden routes could be mistaken for ready destinations | Retain request through interruption; check nonzero visible layout before positioning. Fresh reload verified `/courses` -> `/#founder` at 80px on mobile, focus at founder, no stranded wipe. |
| Forward page links retained footer scroll; catalog switches could land below results | Explicit forward scroll at readiness; catalog aligns results and disables scroll anchoring. Fresh production navigation starts at y=0. |
| Learning curtain's CSS pixel translation cancelled its final percentage translation | Explicit `x:0`, clear final transform. Feedback is visible; curtain ends outside the body. |
| Short feedback could finish above the viewport | Scroll the step tabs into view when changing from below them. Verified final tab row at ~80px and retained comment on revision. |
| A global scroll refresh could restore an old scroll position on the first inactive-offer anchor | Removed unnecessary global refreshes on panel switches/heights; the single group entrance only refreshes for an actual upstream disclosure layout change. First package deep link retested at 180px desktop / 136px mobile. |
| One 360px USA topic label overflowed its cell | Stack those topics at <=380px; retain readable 15px labels. |
| Development hot refresh retained persistent motion callbacks | Final navigation checks use a clean reload and the compiled production server, not an old listener closure. |

## Executed verification

Final production captures include `home-390.jpg`, `home-1440.jpg`, `offers-1440.jpg`, `packages-390.jpg`, `catalog-minis-360.jpg`, `founder-390.jpg`, `faq-390.jpg` and `contact-390.jpg`. Earlier diagnostic snapshots are retained as iteration evidence; `browser-results.json` distinguishes the repaired 360px finding from its successful final retest.

Browser: connected in-app Browser via `cua_repl`, production `http://localhost:3001` after `pnpm build`; earlier diagnostic iterations used port 3000. Viewports: 1440x900, 768x1024, 390x844, 360x800. Screenshot directory: [evidence](evidence/animation-redesign-2026-11-03/). No standalone Playwright process was used for browser interaction in this session.

Verified: mobile hero first-screen height (776px + 68px header at 390x844); academy/founder seam; founder open/close and state cleanup; FAQ intermediate corner/shadow/height values and final state; FAQ-to-contact link; all four offer states, return to main, keyboard End and one active/inert panel; learning lesson/assignment/feedback/revision with retained comment; fitted mobile controls and next-card rail cue; review mouse drag (scrollLeft 2 -> 398) and ArrowRight (->758), hidden horizontal bar; mobile menu open/reverse-close/Escape/focus/body-lock and menu-to-auth handoff; catalog switches, English-filter empty state/reset, mini-detail navigation and unavailable purchase controls; shared Cut states/inverse and explicit reduced-motion preview; Splash expansion/clearing and pending-preview completion; cart/checkout empty routes. Text-box scrollWidth, actual text-node Range bounds and document bounds were inspected, alongside screenshots and card media/content placement. Final 360px topic, home/mini/detail text checks passed; visible mobile button/summary targets were >=44px. Rapid switching ended with one active panel, zero height gap and no geometry transforms. Escape interruption and back/forward navigation were also verified; no production warn/error log entries were observed.

Observed FAQ midframes: progress .038 -> .975 -> 1, corner radius 8.66px -> .23px -> 0, shadow .19px -> 4.87px -> 5px. Welcome sample: expanding plum ink -> clearing mask at 19.2% -> hidden, with inline styles removed. These samples establish state interpolation, not a universal frame-rate guarantee.

Commands: `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`; strict premium audit (0 findings) and DESIGN.md lint (0 errors; one expected warning because the existing context is prose-only and canonical tokens are in SYSTEM.md/globals.css). Results saved with evidence. Updated regression source: `tests/premium-motion.browser.mjs`, `tests/circle-loading.browser.mjs` (historical filename; now Splash), `tests/motion-system.browser.mjs`; syntax checked with `node --check`. External Playwright suites were **not executed**; their results are not claimed by the browser walkthrough.

## Design-context reconciliation

| Historical context | Disposition |
| --- | --- |
| Compact mobile hero, FAQ after Contact | Superseded by the owner's full-height hero / FAQ-before-Contact request; documented D-021. |
| Parallax Cut with independent slash | Superseded by supplied Lift & Shift reference; stable hit area and all original APIs retained. |
| Circle and sticky/shrinking portrait/course-only scroll beats | Superseded by Splash and integrated flow/group entrance. Old spec preserved as historical provenance. |
| Default scrollbar guidance | Explicit owner exception for swipe rails; next-card cue plus keyboard/dots retained. |
| Palette/typography/token ownership | Match: existing plum/neutral CSS variables and self-hosted Manrope/Unbounded preserved. |

## Limits and remaining work

No remaining defect was observed in the final checked states; this is not a claim of zero defects in every environment. The Browser exposes viewport controls but no reduced-motion emulation capability: global/live OS preference behavior was source-reviewed, with the actual still Cut preview checked, but full preference switching was not browser-executed. Physical touch, virtual keyboards, Safari, low-end performance, offline/slow/error network stress and conditional curriculum/trainer data remain unverified in this session. Real streamed loading stress and no-JS PPR follow-up remain covered by separately runnable tests/backlog, not by screenshots.

Existing fixture content, blank review placeholders, unapproved factual/legal wording and missing authentication/contact/payment/learning services remain publication blockers. No fake success, price or testimonial was added to fill them. Owner review of final desktop/mobile composition and motion remains pending.

## Delivery commits

- `8ce49c0`: shared Lift & Shift controls and catalog/card repairs.
- `f448af9`: homepage motion, geometry, section ordering and responsive layouts.
- `6714c55`: hash navigation, menu, Splash, shared reveals/anchors and regression-source updates.

Documentation/evidence is committed separately. No push/deploy was performed.
