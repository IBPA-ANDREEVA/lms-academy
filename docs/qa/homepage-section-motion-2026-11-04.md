# Homepage section entrances · 2026-11-04

Branch `codex/homepage-section-motion` was created after landing commit `d3c532c` was pushed to `origin/refactor/landing`. Owner authorizes expressive homepage appearance animations while preserving layout. This second changeset remains on the new branch for review.

## Research and scope

- [Pangram Pangram — Font Characteristics](https://www.awwwards.com/inspiration/pangram-pangram-foundry-font-features): actual video viewed in Chrome. Borrowed emphasis on large typography/deliberate pacing; implemented authored Russian line masks. Rejected font deformation, typeface/background/content/pricing changes.
- [Interaction Library — Scrolling the list sideways](https://www.awwwards.com/inspiration/scrolling-the-list-sideways-interaction-library): actual 5.5-second video viewed in Chrome. Borrowed staged arrival/spatial continuity of real items; implemented short card sequences within existing panels. Rejected 3D shelves, velocity/cursor effects and sideways page scrolling.
- [HOLM](https://www.awwwards.com/sites/holm) / [The Material](https://www.awwwards.com/inspiration/the-material-holm): static photo/type restraint reference only. No video was available; no exact motion behavior is attributed to this image.

Inspected 2026-11-04. These are bounded motion references, not licensed assets or a new brand/layout. Existing photos, colors, fonts, text, routes and release scope remain. No dependency, pin, scroll spacer/replacement, continuous parallax or decorative shape added. Mobile sequences are shorter. Human review of actual browser output remains pending.

## Owners and scenes

HomePage still server-composes numbered sections. Home-local `composition/home-entrance-motion.tsx` renders the same main element and owns lifecycle/observers; `home-entrance-scenes.ts` owns authored targets/choreography. Props `children:ReactNode,className?`; sole consumer HomePage. This is local composition, not a generic primitive.

| Target | Desktop behavior/timing | Mobile |
| --- | --- | --- |
| Hero | Three real lines rise through masks .9s/.1s stagger; photo 1.055→1 scale over 1.5s; supporting copy .8s; whole CTA fades .65s at .24s, preserving hover transform | 75% durations/65% stagger, smaller movement; image 1.025; CTA .45s |
| About/Founder photographs | Images settle inside existing cuts, 1.075→1 scale, 2%→0 translation, 1.35s | 1.035 scale/no translation/~1s; own triggers separate photo-first copy |
| About/Founder copy | Real heading-line masks .9s; copy .8s; benefits/milestones .75s/.065s stagger | 10–12px copy/item rise; headline triggers after photo |
| Learning intro/demo | Intro masks/body; independent demo trigger, tabs .6s/.06s stagger, active media .85s | Shorter; pointer/focus settles before actual learning interaction |
| Courses/packages/minis | Real articles rise 42px and settle .7° to zero, .95s/.1s stagger, once per format | 18px/no rotation; native rail/grid retained |
| Start USA | Actual module child groups .8s/.07s stagger | Shorter; real-mode unpublished state stays direct |
| Reviews | Heading lines plus existing placeholder cards entering from 44px right, 1s/.1s stagger | 16px/shorter; drag/touch/keyboard/dots preserved |
| FAQ | Heading and native details arrival .75s/.055s stagger | Smaller/shorter; disclosure height/shape owner preserved |
| Contact | Heading/body sequence | Shorter; form/inputs never translate or lose values |

All home entrances use `power4.out`. Existing shell timing remains in motion-tokens. Removed the old whole-offer scroll-scrub fade. New card entrances wait until group switching releases data-transitioning and cancel when their panel becomes inert or switching restarts. Panel strip/pullback/natural-height behavior and stationary seams/dock remain group-owned. Shared SectionReveal API/other consumers are unchanged; it defers under data-home-entrances to avoid competing timelines.

## Lifecycle

Scoped useGSAP/contextSafe, live matchMedia, once-only IDs, IntersectionObserver and narrowly filtered MutationObserver with cleanup. SSR/no-JS content is visible. Entrances wait for splash/page wipe and font readiness. Focused scenes skip/settle; pointer interaction settles before native action. Resize/reduced-motion release inline transform/individual transforms/clip/opacity/will-change. Async font readiness cannot start a late tween after unmount. Cached-route return remains readable. No structural section/background/seam/form translation.

## Verification

Full local captures/video: `.landing-evidence/home-motion/`; selected maintained evidence: `docs/qa/evidence/homepage-section-motion-2026-11-04/`. Screenshots are implementation evidence, pending human approval.

- `pnpm lint`, `pnpm exec tsc --noEmit` — pass.
- `node --test tests/catalog-contract.test.mjs tests/demo-cart.test.mjs` — five pass; existing Node typeless-package warning remains.
- `TEST_PREVIEW=true LMS_BUILD_DIR=.next-land03-home-motion pnpm build` and `TEST_PREVIEW=false LMS_BUILD_DIR=.next-land03-home-motion-real pnpm build` — pass. Real mode emits expected structured catalog adapter diagnostics.
- `tests/homepage-section-motion.browser.mjs` — all 14 scenes pass at 1440×900, 390×844, 360×844 and 768×900 in development; final optimized preview artifact also passes at 1440×900/390×844. Assertions cover real line animation, once-only playback, full style release, identical before/after document height and seam metrics, no pins, natural active-panel height, live reduced motion, focused/entered form state, resize, rapid tab switches, route return and visible no-JS content. No page errors.
- `tests/landing-refinements.browser.mjs` — pass after the motion integration at all four widths; prior landing behavior remains covered.
- `tests/catalog-shared.browser.mjs` — final preview/real optimized artifacts pass shared component states, home/mini layout, clipped text, icons and live motion preference.
- `tests/catalog-seo.browser.mjs` — final preview/real optimized artifacts pass all 17 checks each (normal/Twitterbot metadata, sitemap/robots, assets, catalog/cart/detail and publication/preview boundaries).
- Recorded an actual ~24-second 1440×900 Chrome walkthrough at `.landing-evidence/home-motion/homepage-desktop.webm` (about 3 MB). Reference clips were inspected separately; no external artwork was imported into the site.

During verification, a fixed-delay assertion initially sampled a still-finishing .95s card timeline after rapid group switching. It now waits for actual scene completion. Obsolete entrance timelines are also explicitly cancelled when a panel becomes inert/starts switching. A visual pass replaced a hero label-only entrance with a whole-control fade, avoiding an empty button face during the entrance. Final runs pass.

SEO guide/checklist reviewed: no route/metadata/canonical/indexability/sitemap/schema change needed for motion ownership. TEST_PREVIEW boundaries remain. Production SITE_URL, real content/services/legal readiness and live crawler validation remain pending.

Lifecycle correction: the subsequent owner report identified flicker and handoff delays missed by these original final-state tests. The [synchronization audit](animation-synchronization-2026-11-04.md) supersedes the lifecycle section above and adds per-frame regression evidence. Existing choreography/research scope remains.
