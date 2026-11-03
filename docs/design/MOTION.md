# Public frontend motion

Canonical guide · 2026-11-02 · owner brief: **Premium Motion System Redesign**, with the follow-up “use scroll, but not too much, so it won't affect the user flow.” This supersedes the welcome-droplet and blanket no-scroll-timelines portions of D-019. D-020 records the exact new scope. Existing layout, Russian copy, fonts, colors, content approval and release boundaries still apply. Browser evidence is verification, not human visual approval.

## Reference contract

| Supplied reference | Applied relationship / location | Deliberately excluded |
| --- | --- | --- |
| [Async orchestration](https://async-page-transitions.crnacura.workers.dev/) and [article](https://tympanus.net/codrops/2026/02/26/building-async-page-transitions-in-vanilla-javascript/) | Public navigation overlaps Next prefetch with exit; covered commit, readiness, interruption and cleanup have explicit owners | Custom vanilla router, fetching/replacing HTML, cloned React trees |
| [Interlude Wipe](https://interlude.crnacura.workers.dev/transitions/wipe/) | Right-to-left plum cover, small outgoing push, incoming content follows the exiting panel; mirrored history reveal | Long demo timing, page fade, transactional/utility workflows |
| [StickySections 2](https://tympanus.net/Development/StickySections/index2.html) | HOME-03 holds while HOME-04 arrives, scales to .975 and rounds to 20px over 160px of normal scroll | Darkening/filter, a section stack across the entire site, added scroll distance |
| [StickySections 9](https://tympanus.net/Development/StickySections/index9.html) / [source](https://github.com/codrops/StickySections) | HOME-06 only: brief sticky course row, coordinated card exits, independently moving real images when supplied | Rotation, contrast filter, Lenis, long pinned sequences, ordinary catalog grid |
| [Interlude Carousel](https://interlude.crnacura.workers.dev/transitions/carousel/) | Existing HOME-06–09 tabs: pull back, move outgoing/incoming panels as a strip, expand selection | Page routing, automatic progression, scroll trapping, screenshots or fake page thumbnails |
| [Interlude Circle](https://interlude.crnacura.workers.dev/transitions/circle/) | Genuine cold-entry detail loading: centered circle grows, then an expanding masked hole reveals the ready content | Welcome timer, simulated progress, liquid physics, WebGL, delay after readiness |

Demos and source were inspected. References supply motion relationships only: none of their copy, content, photography, routes or large-screen dimensions become LMS product data. Desktop scroll enhancements are bounded below; mobile and short windows retain ordinary flow.

## Owners and tokens

`src/features/public-shell/motion-tokens.ts` owns JS durations (seconds), eases and distances. Existing CSS button/hover tokens remain with their owners. No global GSAP defaults or new dependencies.

| Pattern | Owner / consumers | Timing and bounds |
| --- | --- | --- |
| Section entrance | `public-shell/section-reveal.tsx` through existing `PageContainer(reveal)`; narrative, catalog, detail, component preview | Heading rises 12px desktop / 6px mobile through a clip; body/card groups 8px / 4px, .48s / .36s, short stagger. No animation of each list item or whole form. |
| Story handoff | Home-only `composition/academy-story.tsx` (`about,founder,seam`), HomePage | CSS sticky; tall content scrolls completely before holding; .975 scale / 20px corners over 160px. No extra document height. ≥1024px wide, ≥650px high only. |
| Featured course beat | Home-only `sections/06-courses/components/use-featured-course-scroll.ts`, CourseShowcase | CSS sticky, 120px extra travel maximum; two or more cards, ≥1100px wide / ≥780px high, cards must fit. Card y −8/−12/−16px and small scales; image scale 1.06→1.015, y +2%→−2%. No fixed/pin spacer. |
| Course format switch | Existing `learning-offers/learning-offers-showcase.tsx` (`panels` tuple), HomePage | .12s pullback to .96 desktop / .98 mobile; .28s / .22s horizontal slide; .16s expand. Incoming/outgoing remain real mounted panels; active height only. Shared seam geometry never transforms. |
| Public Wipe | `public-shell/page-wipe-transition.tsx`, PublicMotion | .24s cover + .32s reveal; 28px desktop / 12px mobile push; no loading hold when content is ready. |
| Circle | `public-shell/circle-loader.tsx` (`active,suppressed=false,inline=false`), PublicMotion and MotionPreview | Show only after 180ms still pending; 12px circle→farthest corner in .38s; completion immediately opens the hole in .28s, even during expansion. No minimum visible time. |

`PublicMotion(children)` remains the root shell composition. `PublicRouteLoading` is the actual `(details)/loading.tsx` UI and registers its lifetime through a small context. MotionPreview is explicitly a manually controlled demonstration, not a production loading simulator. `/preview/components` embeds the actual shared implementations.

## Navigation and loading orchestration

Only ordinary same-origin public links between `/`, `/courses`, `/mini-courses`, and their detail slugs participate. `next/navigation` remains the only router. The click observer preserves modifier/new-tab/download/external/hash behavior. Same-path filters, catalog format buttons, dialogs (including the mobile menu), cart, checkout and the component preview bypass Wipe. There is no generalized navigation wrapper or replacement Link component.

A participating click starts Next prefetch and the .24s outgoing cover together. At the covered frame, it requests `router.push`. `usePathname` and the real loading-boundary lifetime coordinate the reveal. Visible fallbacks keep the cover in place; hidden cached Activity trees are excluded from readiness/focus checks. Errors/not-found reveal their actual app-owned UI. A plain Russian loading label appears on a prolonged cover; a five-second motion watchdog removes the overlay and leaves recovery to Next's visible loading/error state. The watchdog logs only event, phase and public pathname, with no query/user data.

A new click supersedes obsolete animation callbacks and requests the latest Next destination. Escape, Tab, resize, preference changes, visibility loss and pagehide settle presentation; a not-yet-submitted authorized navigation is still handed to Next. The shell stays usable; surfaces never lock the body or capture pointers. Completed navigation focuses the visible main only if focus has not moved elsewhere. No transforms are placed on the page wrapper or shared sticky ancestors.

One additive history-state index is merged with Next's state through its supported `replaceState` integration. No native method is patched. Browser popstate cannot be deferred: it covers immediately and reverses the reveal for a lower known index. Next retains history and scroll restoration. Unknown history entries use a conservative back direction. Hash restoration bypasses the effect.

Circle is reserved for a real cold-entry detail fallback. After the first Wipe, that mounted shell keeps Circle suppressed, including after a slow-response watchdog: the same navigation cannot replace one fullscreen loader with another. Fast loading cancels the 180ms threshold; SSR renders only a readable loading sentence and a hidden decorative surface. Network errors/unmounts end the pending lifetime. Ready static pages never show a loader.

## Accessibility and lifecycle

All animated code lives in scoped `useGSAP` client lifecycles; later callbacks use `contextSafe`. Dynamic effects revert on update. Match-media cleanup restores styles and removes ScrollTriggers, ResizeObservers and listeners; no unscoped `ScrollTrigger.killAll` is used. Live reduced motion removes positional/scroll/overlay effects and makes switches immediate. Native focus/keyboard semantics, existing inputs, filters and forms remain intact.

Sticky course effects tear down while their panel is inactive and when content/viewport no longer fits. Keyboard focus into an editorial sticky area releases its scroll effect. Hidden switcher panels stay inert and aria-hidden even during their visual exit. A rapid switch or resize cancels obsolete transforms; all panels retain their own state. ScrollTrigger refresh follows measured layout changes and settled switches.

SectionReveal renders visible server content. Only selected heading/content groups receive transient styles when entering; no global opacity-zero CSS, line splitting, duplicated text or dependence on image preload. Focus/resize/hash/reduced-motion paths restore normal rendering. Ordinary buttons, disclosures, menus, auth and cart feedback retain their previously verified functional motion. The old session-storage intro, drop/flood sequence and hero-welcome choreography are removed.

## Verification and limits

See [implementation report](../qa/premium-motion-2026-11-02.md) and `tests/premium-motion.browser.mjs` for current evidence. No complete browser implementation is human-approved. Existing course fixtures have no real course photography, so independent image motion is implemented conditionally without inventing images. No production inventory, auth, payment, upload or learning service is added. Real-device Safari/touch and low-end hardware still require review.
