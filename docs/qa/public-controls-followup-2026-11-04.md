# Public controls follow-up — 2026-11-04

Scope: the latest owner follow-up on mobile navigation, HOME-08 mini discovery, two shared Cut variants, and catalog type switching. Branch: `codex/homepage-section-motion`. The branch history records the separate owner-authorized delivery commits. Earlier landing work was committed separately; no deployment or new publication is implied.

## Reference contract

- `codex-clipboard-367aa3d8-4bb3-4c66-acdf-835e49d77e74.png`: borrow the fine outlined rectangle, plum label/arrow, growing underline and blush hover for **line**. Default legacy `appearance="cut"` uses this treatment.
- `codex-clipboard-3f482418-190e-4019-9905-5e4f6df2af84.png`: borrow rounded blush shape and inset left accent on hover for **soft**. HOME-05 learning controls use it.
- Both images are component references only, not layout/product data. Their numbered headings/descriptive captions are excluded. These latest owner references supersede the earlier angled Double Cut + Panel/slash geometry. Existing Manrope, brand tokens, responsive sizes and native button/link semantics remain. Inverse variants use white ink and translucent white fills on plum. The owner explicitly requested inverse variants; screenshots do not constitute human implementation approval.
- Reference images show no mobile layout. Bounded implementation preserves existing >=44px targets, wrapping text, CSS-only 300ms feedback, reduced-motion/no-motion variants, and stable hit areas.

## Root causes and corrections

1. Mobile link handlers immediately closed the native modal, exposing the old page before the navigation curtain. The native modal is in the top layer, above ordinary z-index curtains. The existing PageWipeTransition now enters that same layer as a manual popover and dispatches explicit navigation start/end events. MobileNavigation releases the body scroll lock at start, keeps the dialog open while covering, suppresses the dialog presentation at the fully covered reveal handoff, and closes it only when navigation finishes. Destination focus is handed off after native focus restoration. Reduced motion, interrupted navigation and watchdog paths release the menu without leaving a scroll lock.
2. Catalog selection derived only from the committed pathname, so route latency delayed all visual feedback. Incoming motion then waited another 120ms, child SectionReveal could compete with the parent, and completion called a second scrollIntoView. CatalogExperience now uses React optimistic selection inside Next's navigation transition, prefetches the two current-filter destinations, starts both panel tweens together (360ms total), captures interrupted poses, and removes the completion scroll. Next still owns route URL, metadata, filters and history. SectionReveal defers to the catalog panel owner. Resize/live reduced motion cleanly settle to natural active height.
3. HOME-08 had separate fact and link rows, including the unwanted certificate label. The requested text is removed; a wrapping toolbar aligns the remaining format note and right-side catalog link. Existing CourseCard, two-column mobile grid and desktop carousel remain canonical.
4. Shared Button/ButtonLink exposes optional `cutVariant: "line" | "soft"` while retaining appearance, intent, size, inverse, fullWidth, loading and native props. No duplicate button implementation. Updated `/preview/components` includes both variants, inverse, hover, focus, disabled and loading states. Actual other consumers remain home catalog links, identity, commerce and course detail.

## Verification

Commands passed:

- `pnpm lint`; `pnpm exec tsc --noEmit`.
- `node --test tests/catalog-contract.test.mjs tests/demo-cart.test.mjs`: 5 passed.
- `pnpm build` separately with `TEST_PREVIEW=true` and `false`, isolated `.next-land03-controls-build` / `.next-land03-controls-real` output directories, reserved test origin `https://academy.example.test`.
- `tests/public-controls-followup.browser.mjs`: frame sampling confirms open native menu throughout covering/revealing; top-layer curtain, released scroll lock, final focus on main, route/hash navigation, refresh, reduced-motion direct navigation, immediate catalog selection, rapid reversals, history, inert panels and responsive mini previews.
- `tests/cut-button.browser.mjs`: line/soft and inverse hover/reversal, stable bounds, keyboard activation/focus, disabled/loading, reduced motion and 1440/768/390/360 widths.
- `tests/catalog-shared.browser.mjs`: passes against both optimized preview and real modes, including text-range clipping, shared empty state and live preference changes.
- `tests/catalog-seo.browser.mjs`: 17 checks per mode. Existing metadata/canonicals/noindex/schema, sitemap, robots, assets, detail and demo-cart behaviors preserved; no SEO source changes required.
- `tests/homepage-motion-lifecycle.browser.mjs`: passes against optimized preview. Four widths, monotonic frame-by-frame entrances, explicit splash handoff, refresh, fast scroll, CPU throttle, navigation/history, live reduced motion, no-JS and failed hydration.

Screenshots reviewed at 1440×900 and 390×844, plus 360×844 and 768×900. Mini cards align; toolbar wraps on phones, stays in one row on desktop; no document or tested text-range overflow. Existing demo card content remains labeled and preview-only. Artifacts: `.landing-evidence/controls/production/` (mini-preview and cut-state PNGs; control frames; shared/SEO and lifecycle results), `.landing-evidence/controls/real/seo/` (real-mode results). Representative captures/results are copied into `docs/qa/evidence/public-controls-followup-2026-11-04/`.

During iteration lint caught a render-local mutation in CutContent (replaced with pure mapping). Browser checks caught an identical soft default/hover tint (corrected to the reference's stronger blush). One dev shared check saw duplicate streamed elements during hot updates; the unchanged check passes against both final optimized artifacts. Production browser runs recorded no page errors.

## Remaining limits

Real Catalog adapter remains unavailable as before; preview-off build emits the existing structured `catalog-adapter-not-connected` diagnostic and helpful unavailable state, never fixture fallback. Production origin/content/service readiness, physical-device Safari verification and human visual approval remain outside this change. No new release-phase behavior, certificate policy or backend capability. Owner's running port 3000 server was not changed. Temporary verification servers were stopped after checks.
