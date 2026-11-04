# Homepage motion visibility follow-up · 2026-11-04

Owner reported that the synchronized entrances were almost invisible. The previous 120px positive intersection margin played scenes below the viewport, while power4.out completed most movement very early. The hero also spent most of its visible travel underneath the opening curtain.

Scope: existing `/` homepage, same fourteen scenes, images, layout, content and controls. No new visual reference or product/release decision; this is a bounded timing adjustment to the owner's existing motion request. No ScrollTrigger dependency or pinning is needed: the existing native intersection trigger already supports an exact viewport entry line.

## Implementation

- `home/composition/home-entrance-motion.tsx`: play at top 85% of viewport height on desktop / 90% on mobile, replacing top +120px below the viewport. The observer and eligibility check share the same rounded pixel inset; resize recreates the observer. Preparation remains before exposure, so the later trigger does not reintroduce visible→hidden flashing.
- `home/composition/home-entrance-scenes.ts`: preserve the authored movement and staggering with timeline playback at 0.7× desktop / 0.6× mobile, approximately 43% / 67% longer than the preceding implementation. Use power2.out for section scenes so more movement remains visible after entry. Hero uses power2.inOut to build through the unchanged splash reveal, keeping visible motion after the curtain clears without adding a delay.
- Effective heading duration: ~1.29s desktop / 1.13s mobile. Cards ~1.36s / 1.19s; portrait images ~1.93s / 1.69s. Hero photograph ~2.14s / 1.88s. Existing smaller mobile distances and all layout/seam/form ownership remain.
- Homepage-only behavior: HomeEntranceMotion `(children,className?)`, HomePage sole consumer; fourteen home scene definitions unchanged. Shared SectionReveal, header, Cut button, navigation curtain and learning/offer interaction durations remain unchanged.
- Existing once-only, focus/pointer cancellation, fast-scroll settling, live reduced-motion, no-JS/late hydration and unmount cleanup remain.

## Verification

`tests/homepage-motion-lifecycle.browser.mjs` now holds an About heading at 98% viewport height for 650ms and verifies it stays prepared, then crosses the real entry line and verifies substantial visible travel remains after 300ms. Existing fixed completion waits were replaced with actual complete-state waits where the longer motion made the old assumptions stale. The frame-by-frame no-flicker and full lifecycle checks remain.

Final results follow below. No complete browser appearance is claimed human-approved. SEO route/content/metadata/canonical/indexability/sitemap/schema contracts are unchanged; production origin and backend/content/legal readiness remain as previously documented.

### Final results

- `pnpm lint`, `pnpm exec tsc --noEmit`, `git diff --check`: pass.
- `node --test tests/catalog-contract.test.mjs tests/demo-cart.test.mjs`: five pass; existing typeless-package warning unchanged.
- Preview and real optimized builds pass (`.next-land03-presence-prod`, `.next-land03-presence-real`); expected real catalog adapter-unavailable diagnostics remain.
- `tests/homepage-motion-lifecycle.browser.mjs`: pass in development and the final optimized preview artifact at 1440×900, 390×844, 360×844 and 768×900. At the 300ms visible sample the first headline line still has 35–43% of its fade remaining (opacity ~0.57–0.65) plus visible translation. The new viewport threshold check passes at every width. Existing per-frame no-flicker, hard refresh, scrolling/jumps, navigation/history, rapid offers, live reduced motion, 4× CPU and no/blocked/late-JS cases pass with no errors.
- `tests/homepage-section-motion.browser.mjs`: all 14 scenes × 4 widths pass on the final optimized build; natural height/stationary seams, cleanup, no replay and preserved input state. The hero assertion samples motion before taking its screenshot, avoiding capture overhead consuming the timeline before sampling.
- `tests/catalog-seo.browser.mjs`: 17 checks each pass in preview/real mode. No SEO changes needed for this timing-only slice; existing origin/content/service dependencies remain.
- Premium strict static audit: zero findings. Actual 1440×900 and 390×844 mid-entry screenshots inspected: photographic crop, Russian typography and section geometry unchanged; heading is visibly mid-reveal after crossing the entry line. Screenshot evidence is not human approval.

Selected evidence: `docs/qa/evidence/homepage-motion-visibility-2026-11-04/`. Actual Chrome walkthrough recordings: `.landing-evidence/presence-production/lifecycle-1440.webm` and `lifecycle-390.webm`. Changes remain uncommitted on `codex/homepage-section-motion`; no push/deploy. Physical-device Safari remains unverified.
