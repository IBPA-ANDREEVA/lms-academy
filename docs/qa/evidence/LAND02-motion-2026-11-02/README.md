# LAND02 motion evidence · 2026-11-02

[Implementation report](../../LAND02-motion-implementation-2026-11-02.md) · [Canonical motion guide](../../../design/MOTION.md).

Branch `refactor/landing`, baseline `eb3665d1d6ec7441c462ba9ad7d20b6944d506f1`. Production browser origin `http://localhost:3114`; development/Strict Mode check `http://localhost:3000`. Installed Chrome and bundled Playwright, no added dependency. Prior LAND01/LAND02 report artifacts are preserved. Initial failed regression logs are retained with `initial-` prefixes; final results replace only this task's own current evidence.

## Outcomes

| Command / coverage | Result |
| --- | --- |
| `pnpm lint` | PASS, no warnings (`lint.log`) |
| `pnpm build` | PASS (`build.log`); fresh production server started after build |
| `pnpm exec tsc --noEmit` | PASS, sequentially after build (`typecheck.log`) |
| Strict premium static audit | PASS, zero findings (`premium-static-audit.json`) |
| `git diff --check` | PASS |
| `node --test tests/demo-cart.test.mjs` | PASS, 2 tests (`cart-unit.log`) |
| `tests/land02.browser.mjs` | PASS, 54 route/viewport cases + interactions at all 9 requested widths (`results.json`, `matrix.log`) |
| `tests/motion-system.browser.mjs` | Motion checks complete with zero runtime errors; **FAIL** for two pre-existing no-JS detail routing blockers, preserved as assertions (`motion-system-results.json`, `motion-system.log`) |
| `tests/motion-lifecycle.browser.mjs` | PASS: 4× CPU, denied storage, utility entry/internal navigation, >2.5s slow hydration (`lifecycle-results.json`, `lifecycle.log`) |
| Existing Cut, motion, auth, catalog, detail, header, home-10-11, offers, production commerce, polish, frontend suites | PASS; individual logs and `regression-results.json` |
| Development `tests/land02-motion.browser.mjs` | PASS: hash/Back, rapid switching, resize, live reduced motion, FAQ reversal (`strict-mode.log`, `strict-mode/motion-results.json`) |

The last targeted reruns cover the final circle raster sizing, card reveal gutters, carousel pagination fix and short auth exit. The 54-case matrix established clipping/text bounds and all existing layouts; the normal-motion suite separately covers 72 route/viewport combinations including cart/checkout, fast/reverse scrolling, interactions and no-JS audit. Remaining no-JS failure is not hidden or turned into a passing expectation.

## Welcome frame sequences

Thirty real live screenshots, not timeline seeks or generated frames. Desktop: `welcome-1440-00.png` through `welcome-1440-14.png`; mobile: `welcome-390-00.png` through `welcome-390-14.png`. `motion-system-results.json` records elapsed capture times. Browser screenshot overhead and parallel test load make intervals nonuniform; these are frame sequences, not a fixed-frame-rate performance benchmark.

| Stage / example | Desktop | Mobile |
| --- | --- | --- |
| Early drop | [frame 00](welcome-1440-00.png) | [frame 00](welcome-390-00.png) |
| Fall / expansion samples | [frame 02](welcome-1440-02.png) | [frame 02](welcome-390-02.png) |
| Flood / wipe samples | [frame 04](welcome-1440-04.png) | [frame 05](welcome-390-05.png) |
| Revealed composition | [frame 12](welcome-1440-12.png) | [frame 12](welcome-390-12.png) |

Before: [1440](before-1440.png), [390](before-390.png). After: [1440](home-1440.png), [390](home-390.png). Same content, fonts, photograph, cuts and composition; no new layout approval inferred. The explicit hero CTA specificity correction keeps its original desktop placement and is asserted after intro.

## Interaction evidence

- [FAQ 390](faq-390.png), [live reduced preference](faq-reduced-768.png), [founder open](founder-open-390.png).
- [Mobile menu](menu-390.png), [auth](auth-390.png), [filter popup](filter-courses-language-390.png).
- Offers: [courses](offer-0-390.png), [packages](offer-1-390.png), [minis](offer-2-390.png), [USA](offer-3-390.png). Stationary seam geometry and height settlement are asserted; nested native gestures remain.
- Cut: [states desktop](cut-button/cut-states-1440.png), [states mobile](cut-button/cut-states-390.png), [actual hover](cut-button/cut-primary-hover.png), [actual press](cut-button/cut-primary-pressed.png), [computed results](cut-button/cut-results.json).
- No-JS: [home](no-js-home.png); existing detail fallback blockers: [course](no-js-_courses_course-lashes.png), [mini-course](no-js-_mini-courses_mini-lashes.png).
- Normal-motion viewport samples: `motion-_-{width}.png`, `motion-_courses-{width}.png`, `motion-_mini-courses-{width}.png`, detail/cart/checkout/preview equivalents. All nine widths have source results.

## Reproduction

```sh
export PLAYWRIGHT_MODULE=/Users/ivanmakovetskyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright
export FRONTEND_URL=http://localhost:3114
export FRONTEND_EVIDENCE=docs/qa/evidence/LAND02-motion-2026-11-02
pnpm lint
pnpm build
pnpm exec tsc --noEmit
# Start/restart production server AFTER building:
pnpm start --port 3114
# In another terminal:
node tests/land02.browser.mjs
node tests/motion-system.browser.mjs
node tests/motion-lifecycle.browser.mjs
node tests/land02-motion.browser.mjs
node tests/cut-button.browser.mjs
```

Run regressions with separate evidence subdirectories to preserve both result JSON files. Auth/header tests now await the authored exit before asserting the original closed state and restored focus. The review swipe test exposed a real pagination race, fixed in the native snap hook rather than weakening its selected-index assertion. Native curriculum motion is implemented but fixture data has no modules; no conditional trainer or invented course content is claimed verified.

No physical-device, real virtual-keyboard, non-Chromium, screen-reader or human visual approval claim. No paid service/auth/contact/backend behavior implemented. No commit/deploy.
