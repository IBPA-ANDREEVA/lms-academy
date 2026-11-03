# LAND02 — Public motion implementation

2026-11-02 · branch `refactor/landing` · baseline HEAD `eb3665d1d6ec7441c462ba9ad7d20b6944d506f1`.

The working tree already contained substantial owner work: responsive layout/menu/FAQ, Cut parallax, an initial intro/reveal pass, logo, product/planning documentation and tests. This task extends those actual implementations; it does not claim their creation or replace unrelated changes. No commit, push, merge, deployment, dependency or business-rule change.

## Reference and boundaries

Reference: attached “LMS Academy — Complete Motion System & Animation Implementation” text brief. Scope: current home, both catalogs/details, shared public shell, existing auth/cart and actual component preview. Borrowed: drop → impact → flood → reveal, physical layered Cut, short directional panels, deliberate editorial groups, tighter mobile motion. Rejected: layout redesign, new menu/FAQ/sections, course/pricing/testimonial content, backend actions, scroll-jacking and cinematic scrub. No raster reference was supplied for this motion pass. Existing D-017 geometry/typography and D-018 logo remain. Viewports: 1920/1440/1280/1024/768 × 900; 430/390/360/320 × 844. Implementation remains pending human visual review.

## Architecture and changes

Canonical full inventory: [MOTION.md](../design/MOTION.md), including every section's route, implementation file, animated groups, trigger, start/end state, duration/ease, mobile and reduced-motion fallback.

- Root `PublicMotion` owns only eligible first-entry brand motion and explicit hero targets. No full-route fade or transform on sticky ancestors.
- Existing `PageContainer` gains named reveal treatments, implemented by the existing `SectionReveal` client island. It animates selected content groups, not structural backgrounds or full page surfaces. New small `motion-tokens.ts` records common values.
- Existing `LearningOffersShowcase` owns horizontal active-panel/height/background transitions at 360ms desktop, 300ms mobile, with 24/10px travel. Geometry, sticky layout, hashes/history, focus/inert semantics and native gestures remain.
- Catalog switching uses 24/10px travel and clears active height on completion, resize and live reduced motion. ResizeObserver no longer writes a persistent inline height when settled.
- New generic `components/ui/use-disclosure-motion.ts` reuses the native details DOM for four real consumers: FAQ, founder biography, mobile catalog filters and conditional curriculum modules. Reversible current-height transitions, native no-JS behavior, rapid toggles, resize/reduced settlement and cleanup.
- Home-local `use-offer-selection-motion.ts` serves actual CourseShowcase/PackageExplorer/MiniCourseExplorer consumers. It animates only visible replacements, preserves state and cancels on focus/resize/reduced changes. The existing snap hook now preserves the requested pagination choice during native smooth scroll, settles on scrollend/debounced completion and handles interruption.
- MobileNavigation adds short item staggering and trigger-bar transformation to its existing native drawer. AuthModal gains opacity-only 220ms entrance/120ms exit; no positional motion beneath the virtual keyboard. CartPreview keeps its existing reversible 220ms owner.
- The broad global details/dialog/listbox entrance rule is replaced by explicit CSS surface opt-ins for FilterDropdown, desktop header dropdown and PackageBuilder. No competing CSS animation on GSAP owners.
- Existing Cut parallax is retained and verified: foreground −3/−4, depth +5/+6, independent slash/arrow, stable hit target, upright text; 300ms hover, 210ms arrow, 120ms press. Reduced-motion feedback stays nonmoving. Existing component preview demonstrates actual variants/states.
- Linked main/compact cards retain physical lift with lighter mini motion and touch press only. Noninteractive editorial panels remain stationary on hover. Shared neo-brutalist buttons do not retain hover lift on touch.

Home entrance order remains hero → about → founder → learning demo → courses/packages/minis/USA group → reviews → contact → FAQ → shared footer. About uses headline/introduction/benefits with portrait opacity; founder uses portrait/short horizontal typography; contact uses heading/description/form; compact FAQ/reviews avoid heavy movement. Learning demo retains its own changed-panel animation and local photos/comment state. Reviews retain native manual scrolling and blank existing placeholders. Contact delivery stays disabled, without fake success. Conditional trainer/modules are not invented.

## Welcome sequence

Early eligible public entry only, session key `lms.public-intro.v1`; direct catalogs/details supported. Cart/checkout/preview/utility entry excluded, including later internal navigation. Reduced motion, hash/restored scroll, prior interaction, late hydration (>2.5s) skip. Drop appearance 0–160ms, fall/stretch through 410ms, compression through 500ms, flood 430–750ms, solid plum hold, upward wipe 820–1470ms. Home text/CTA stagger at 940ms; total ≤1610ms, watchdog 1800ms. Photograph and all geometry remain in place. The expanding circle is sized at its full final diameter before scaling to avoid magnified raster edges.

Pointer/keyboard/wheel/touch, resize, preference change, visibility loss, pagehide and route change cancel. Overlay is aria-hidden and pointer-transparent, never locks scrolling or focus, and is removed completely. SSR has no overlay and visible text. Strict Mode cleanup cancels the deferred frame; storage denial falls back to an in-memory guard. A storage-denied hard reload cannot persist a session flag.

## Narrow corrections and deviations

Visual comparison caught a production CSS-order collision: the generic Button `position:relative` overrode the hero CTA's existing absolute positioning, placing it behind the header. Scoped `.hero .cta` specificity preserves the existing desktop/mobile geometry; it is not a new layout. The regression now asserts desktop CTA remains below the headline after intro.

Card reveal distances are constrained to 8px desktop/6px mobile to fit existing carousel shadow gutters. Height animation is limited to actual disclosures and active panel size, where a transform cannot preserve document flow. Repeated pointer tracking was intentionally omitted: fixed layered Cut motion already supplies the requested depth without per-pointer work.

No new visual direction outside the supplied brief. Native popup/package dismissal remains immediate; auth/menu use short exits. Footer and transactional pages stay immediately readable. The current mobile tab surface receives existing color feedback rather than a newly designed indicator.

## Accessibility, performance and limits

Visible SSR; no permanent hidden initial text; focused reveals settle; no semantic reorder. Native details work without JavaScript; active/inactive panels retain inert/ARIA semantics. Motion owners use scoped useGSAP, contextSafe for event-created work, dependent reversion, live preference listeners and observer/timer/RAF cleanup. Transform/opacity dominate. No loops, scroll-trigger library, animated blur, whole-page transforms, pointer-state rendering or new dependency. Only transient intro elements request will-change.

**Existing structural blocker:** no-JS dynamic detail requests remain on the existing PPR loading shell while their streamed detail HTML stays in a hidden segment. The new broad no-JS assertion deliberately fails for both detail route kinds. Motion does not cause this, and a routing/cache strategy change is outside this task's motion-only authorization. Home, catalogs, cart, checkout and component preview retain visible server-rendered headings. This prevents claiming the entire requested no-JS definition of done.

Chrome emulation only; physical-device performance, real virtual keyboards, Safari/Firefox and assistive technology are not verified. Real services, published inventory/media/trainer/modules/legal content remain outside scope. Browser captures are not human approval.

## Verification and evidence

[Evidence index](evidence/LAND02-motion-2026-11-02/README.md), [machine-readable motion results](evidence/LAND02-motion-2026-11-02/motion-system-results.json), [layout/interactions](evidence/LAND02-motion-2026-11-02/results.json), [regressions](evidence/LAND02-motion-2026-11-02/regression-results.json).

Final command outcomes are recorded in the evidence index after the final production build. Test timing changes only await the authored 120ms auth exit before preserving the original zero-open-dialog and restored-focus assertions. No meaningful content, safety or interaction assertion is removed. The no-JS detail failure remains explicit.

Final verification summary: lint, TypeScript, production build, strict static audit, diff check, 2 cart unit tests, all 11 existing browser regression suites, the 54-case layout matrix, development Strict Mode interactions and four lifecycle scenarios pass. The normal-motion suite records 94 outcomes across all nine requested widths, with zero browser runtime errors; its two no-JS detail-content assertions remain failed for the documented routing limitation. All 30 live welcome frames are retained. An added assertion confirms streamed hero targets actually animate, not merely that an overlay disappears.

During verification, three issues were corrected: production CTA CSS specificity, carousel pagination changing during native smooth scroll, and shell effects resolving hero targets before streamed children mount. The intro now resolves those targets at the reveal beat, without waiting for images or prolonging loading. Initial auth/header test failures came from checking focus before the authored exit ended; timing-only waits preserve their original semantic assertions. No meaningful test is weakened to conceal the remaining no-JS failure.
