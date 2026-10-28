# Frontend workflow refactor verification

2026-10-28 initial refactor baseline (before the subsequently authorized preview route). Shared implementation and cleanup complete; human visual approval and production content are separate gates.

## Scope and preservation

Audited 60 page plans, all 270 sections and 66 component candidates before removing the editors. There were no rendered LMS sections or working auth/commerce flows to migrate. Preserved the owner-edited PageContainer (revision 3), Button (revision 5), PublicFooter (revision 5), home structure additions, original product/architecture sources and public icon artwork. Manrope/license moved out of the retired feature; Unbounded/license added locally. No runtime dependencies were added.

Implemented PageContainer, Button/ButtonLink, PublicHeader, PublicFooter, FormControls, CourseCard, CategoryNavigation and SectionHeading. Feature interfaces live in `src/features/*/index.ts`; the route remains thin. Shared auth wrappers and redirect utilities were deferred because no real consumers or approved continuation policy exist.

Removed both development page/data routes, both editor features and their state/persistence/upload/approval code, editor-only scripts/tests, generated component/section definitions and reference records/images. Removed editor build-directory flags, type includes, commands and ignore rules. Replaced stale workflow instructions with the registry and eight mandatory AGENTS rules. No new application route, gallery, reference store or preview infrastructure was added. Browser fixtures are test-only, intercepted in memory and never imported by the application.

## Checks

- `pnpm lint`: passed.
- `pnpm exec next typegen` and `pnpm exec tsc --noEmit`: passed.
- `pnpm build`: passed; routes are `/` and framework not-found only. Initial build found stale duplicated generated types referencing retired routes; clearing `.next/dev/types` resolved that cache issue.
- `pnpm test:frontend`: passed with the available external Playwright runtime and Chrome; see invocation below.
- Frontend Design Premium strict static audit: zero findings. It is supplementary evidence, not a substitute for browser testing.
- `git diff --check`: passed. Markdown relative-link scan found no missing targets after migration.

Browser coverage: production home and isolated actual components at widths 320, 360, 390, 768, 800, 920, 1024, 1440, 1920 and 2560. Viewport heights are 844 for narrow phones and 900 otherwise. Verified no horizontal overflow, container inner limits/gutters, Russian document/heading, live internal links, modal focus containment/restoration, Escape, dropdown dismissal, mobile navigation, field label/error associations, password masking/toggle, checkbox/select interaction, owned-course action suppression, disabled/pending duplicate prevention, stable busy-button width and reduced motion. No browser runtime errors. Retired routes and both data endpoints return 404.

Reproduce against a fresh production server (`pnpm start --port 3100` after build):

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright BROWSER_CHANNEL=chrome pnpm test:frontend
```

`PLAYWRIGHT_MODULE` is optional if Playwright is already resolvable locally. This task used the Codex bundled Playwright runtime; it is not a new project dependency. `FRONTEND_URL` defaults to `http://localhost:3100`; `FRONTEND_EVIDENCE` defaults to `/tmp/lms-frontend-qa`. Evidence includes home/component width screenshots, `header-desktop-dropdown.png`, `header-mobile-open.png`, and `results.json`. These are verification output, not design references or a gallery.

## Visual comparison and remaining limits

Header: compared desktop 1440×900, mobile 390×844, narrower mobile and tablet captures to the supplied header image. Preserved white rounded bar, wordmark/nav/action alignment, plum pill action, pale menu trigger, disclosure surface and stacked mobile panel. Uses the project's Manrope and inspected line SVGs, not raster lettering or recreated icons. The container follows the preserved fluid-gutter contract, so outer margins differ from the reference sheet's individual crops. Tablet keeps three visible destinations through 1024px and two below 921px to avoid collisions. All remain available in the menu. A real cart count is optional; the reference has none.

The production shell uses the working project name and only Главная because no other route is published. The full reference arrangement is tested with clearly synthetic, anchor-only fixture data, never shipped as live inventory. EN, packages and Start in USA remain gated. No invented categories, legal copy, course prices, authentication or checkout actions were introduced.

Footer: retained charcoal surface, column hierarchy and thin separators. Uses the working identity rather than the mockup logo; omits unsupported social/newsletter content. Mobile groups stay directly visible instead of optional accordions. Default and compact reuse one implementation. Legal destinations/disclaimer and approved identity/contact data remain release blockers.

Buttons: preserved three distinct silhouettes and interaction families, using exact palette tokens instead of image gradients. Cut and minimal control styling, card layout, field styling and heading sizes remain bounded proposals pending review. Russian Manrope and Unbounded rendering was inspected in browser; a separate fontTools full-glyph audit was unavailable and is not claimed. No screen-reader, Safari or Firefox session was performed.

The homepage is a shell with an honest catalog-unavailable state, not a completed hero or production catalog. Follow the [backlog](frontend-backlog.md) and user-supplied target references for subsequent work. No implementation has been marked human-approved.

## Follow-up: live component preview

The owner subsequently requested a route for every component preview. Added `/preview/components` with eight section anchors and a component index, reusing actual shared imports. Thin route: `src/app/preview/components/page.tsx`; page-local examples/styles: `src/features/component-preview/`. Metadata is noindex; the route has no privileged data or server mutations. Header/footer example links point to explanatory anchors; form inputs remain in memory; course actions only change preview state.

Verification: lint, typecheck, build and strict static audit passed. Extended the existing browser test to visit the actual route at 1440×900, 768×900, 390×844 and 360×844; verified all eight sections, no horizontal overflow, noindex, menu dismissal, loading/reset, invalid-field focus, valid form feedback, course status changes and category selection/reset. Existing home/component regression checks and retired-route 404 checks also passed. Live development URL returned 200. Evidence: `/tmp/lms-frontend-qa/preview-*.png` and `preview-top-{1440,390}.png`.

The preview framing is a restrained, token-based functional proposal, not a new visual direction. Embedded components retain their earlier reference scope. The original reference gallery and planning/editor infrastructure remain removed. Registry and AGENTS rules now explicitly allow this one preview route and require keeping its examples synchronized.
