# Public UI fixes — 2026-11-03

Scope: the owner's seven corrections to the public shell and homepage discovery/learning preview. Existing Russian copy, Manrope/Unbounded, supplied logo artwork, routes, TEST_PREVIEW isolation and release boundaries remain authoritative. Guest discovery only; no backend, inventory, payment or enrollment implementation.

## Supplied references

The four attached screenshots are defect evidence, not new product content or final approved layouts:

| Attachment | Target and selected correction | Limits |
| --- | --- | --- |
| `codex-clipboard-80a1b296-416d-40df-a851-3edc6cad4059.png` | Non-home header: opaque entire sticky surface; enlarge existing logo | Desktop header only; homepage overlay remains homepage-only |
| `codex-clipboard-9b3c0137-50a5-4ce2-b851-02030e4f70a1.png` | Mobile home discovery: compact direction filters, correctly aligned larger logo, course rail clipping at screen edges | Demo data is not production inventory; desktop course grid retained |
| `codex-clipboard-82156870-b232-44b8-8e38-28b93a60a4df.png` | Mobile reviews rail: cards continue through both content gutters to screen edges | Blank review layouts remain future-feature placeholders |
| `codex-clipboard-9077dfee-7e4d-44be-89eb-0e60d021ed4e.png` | Mobile menu: remove preview badges/arrows; bounded card composition using existing plum/blush tokens | Existing destinations and unavailable semantics preserved; no new routes |

The written request controls HOME-05: match the public wipe language inside the three steps, forward to the right and backward to the left. No change to page/anchor navigation, inter-section transitions, offer switching or stationary seam geometry. Final menu arrangement and numerical sizes are bounded implementation proposals pending owner review.

## Implementation and consumers

- `src/features/public-shell/public-header.tsx` and `.module.css`: only `/` opts into animated transparency. Other routes have an opaque outer header and white bar. Lockup grows to 36px (32px at compact widths), intrinsic SVG width keeps its visible left edge at the 16px mobile gutter. Tablet mark retained. Root layout and embedded component preview are actual consumers. PublicHeader props unchanged.
- `src/features/public-shell/mobile-navigation.tsx` and `.module.css`: existing native dialog/focus/scroll-lock/Escape lifecycle retained. NavigationEntry receives `showPreviewLabel=false`; learning children become a two-column card group; no disclosure or account arrow. Brand/account/navigation/showAuth/onAuth inputs unchanged. Only PublicHeader consumes it. `.actions .signIn` and `.panel .login` specificity makes production CSS order deterministic.
- HOME-06 `courses-section.module.css` and HOME-08 `mini-courses-section.module.css`: direction filters stay one horizontal row with 44px controls. Canonical CategoryNavigation is reused with its existing API; behavior/styles remain section-local. Filtering and reset still use the same selected state.
- HOME-06 course rail, HOME-10 `reviews-section.module.css`, home-local `learning-offers/offer-carousel.module.css`: mobile scrolling viewport extends across both container gutters, while initial content alignment is preserved by scroll padding. Mini two-column grid exception retained. Existing CourseCard and review content unchanged.
- HOME-05 `components/learning-preview-demo.tsx` and `learning-preview-section.module.css`: mounted hidden/inert panels preserve inputs. A real outgoing panel remains visible until covered; incoming panel is revealed at cover midpoint. Shared `wipeCover=.24`, `wipeReveal=.32`, easing and 12/28px content push are imported from public-shell motion tokens. Stage order determines direction, including skipped steps. Resize, focus, rapid changes and live reduced-motion changes settle/revert scoped GSAP work; enabling motion does not replay the previous transition.
- `src/features/component-preview/component-preview-page.tsx`: header example reuses the actual component; its explanatory copy now describes the mobile menu instead of the removed second navigation row.
- `tests/public-ui-fixes.browser.mjs`: shell route matrix, mobile logo/rail geometry, filter actions, menu labels/Escape/focus, preserved learning input and real direction/interruption checks.

## Verification

Evidence lives in `.header-evidence/public-ui-fixes/` (ignored local captures), with a JSON result file. Desktop 1440x900, tablet 768x900, mobile 390x844 and 360x844. Routes: home, both catalogs, both demo detail kinds, cart, checkout and `/preview/components`. Captures include scrolled course/review rails, menu, learning states and live wipe frames. Browser viewport assertions account for the desktop Chromium reserved scrollbar gutter; carousel boundaries match the document content viewport, not an inner section boundary.

Initial production verification exposed a pre-existing CSS cascade ambiguity: Button's display rule could override the header sign-in hiding rule. With the enlarged logo this overflowed at 360px. Increased owner selector specificity fixes the actual production artifact as well as development. No clipped menu control is hidden to mask it.

Final checks:

- `pnpm lint`: blocked by pre-existing untracked `.next-merge-check` generated output (314 errors / 4919 warnings). This unrelated directory was preserved. A broad retry also caught the temporary inspection script; that task-created script was removed.
- `pnpm exec eslint src tests next.config.ts eslint.config.mjs`: pass.
- `pnpm exec tsc --noEmit`: pass; generated verification-only tsconfig include entries removed afterward.
- `node --test tests/catalog-contract.test.mjs tests/demo-cart.test.mjs`: 4/4 pass.
- `pnpm build`: pass in isolated `.next-land03-ui-final` (`TEST_PREVIEW=true`) and `.next-land03-ui-final-real` (`false`). One attempt to reuse the earlier output directory hit Windows EPERM on a locked route-cache file; fresh isolated final output succeeded without deleting it.
- `node tests/public-ui-fixes.browser.mjs`: pass in development and the final preview production build, at 1440/768/390/360 widths, without page errors. A separate DOM Range check at 360px found no clipped menu text; intentional carousel/filter clipping is confined to their scroll viewports.
- `node tests/catalog-seo.browser.mjs`: preview and non-preview production modes pass, 17 checks each. Existing source-unavailable diagnostics in the non-preview build are expected; no production fallback was introduced.
- `git diff --check`: pass.

Browser scripts use the existing external Playwright runtime at `C:/Users/im061/AppData/Local/Temp/la09-browser-tools/node_modules/playwright` via `PLAYWRIGHT_MODULE`. Final preview server was verified on port 3117; non-preview on 3118. No local server URL is a canonical origin.

Visual motion review additionally caught Tailwind's native hidden rule preventing the outgoing panel from painting. Inactive panels now use owner-scoped `aria-hidden` display styling plus `inert`, allowing only the outgoing presentation to paint until covered while remaining unavailable to assistive technology and interaction. A regression assertion checks this painted state during both directions.

SEO: reviewed `docs/seo/README.md` and checklist. No route, title, canonical, schema, robots or sitemap contract changed. No production origin was invented. Preview remains noindex and demo records stay excluded. Real Catalog readiness/domain/content/legal and live crawler validation remain separate work.

Human visual approval, physical touch/Safari and low-end hardware verification remain pending. Blank reviews and local learning demo behavior are not production services. No commit, deployment or Vault status change.


## Learning wipe coverage correction · 2026-11-03

Owner follow-up reverses HOME-05 step motion: advancing sweeps left, returning sweeps right. `home/sections/05-learning-preview/components/learning-preview-demo.tsx` (LearningPreviewDemo, no props; LearningPreviewSection consumer) places the existing plum curtain at the demo root so it covers the entire interactive surface, including its top step pickers/header. Pickers receive the same outgoing/incoming horizontal push, with the return beginning under the fully covered frame. The owning `.demo` clips the wipe; no page-navigation or inter-section motion changes. Existing form state, hidden/inert panels, keyboard focus and reduced-motion lifecycle remain. Numerical visual treatment awaits owner review. Regression checks now assert reversed direction and that the curtain spans the pickers.

Coverage-correction validation: targeted ESLint, `pnpm exec tsc --noEmit`, updated `tests/public-ui-fixes.browser.mjs` (1440/768/390/360, reversed directions, picker coverage, state/keyboard/reduced-motion checks) and isolated TEST_PREVIEW production build all pass. Browser captures remain in `.header-evidence/public-ui-fixes/`. Human motion review remains pending.
