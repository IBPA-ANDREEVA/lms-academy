# Practical route-change SEO checklist

- [ ] Inspect actual `src/app` routes, metadata inheritance and the [guide](README.md). Classify new/renamed/deleted route as approved public, product-derived, private/auth, transaction, or preview; do not infer approval from a design fixture.
- [ ] Confirm TEST_PREVIEW and SITE_URL at build time. Production domain must be approved; no fallback fake origin. Build separately for true/false.
- [ ] Set one meaningful RU title and description, matching visible content; use the central helper. Root defaults to noindex.
- [ ] Check final canonical URL, slash normalization and query stripping. Remove canonical on previews/missing/private outcomes. Renames require backend redirect history, not duplicate detail pages.
- [ ] Inspect OG/Twitter titles, descriptions, absolute image URL and locale; check inherited metadata for conflicts. Do not add absent language alternates/social handles.
- [ ] Request rendered HTML with normal browser and `User-Agent: Twitterbot`; inspect head and streamed metadata, robots and schema. Check 404 and outage separately.
- [ ] Fetch `/sitemap.xml` and `/robots.txt`: static discovery URLs survive source failure; demo/draft/archive/private/auth/cart/checkout/absent routes never enter sitemap. noindex remains separate from access control.
- [ ] Parse every JSON-LD block, verify escaping and facts against visible content and schema.org types; no placeholder offers/reviews/ratings/credentials. With backend unavailable only real static brand schema is possible.
- [ ] Fetch favicon.ico, icon.svg, apple-icon.png and brand/social.png; inspect browser link declarations for duplicates and screenshot logo on light/dark/mobile backgrounds.
- [ ] Check one H1 per main page, logical headings, meaningful image alt and working internal links. Exercise keyboard and mobile; test clipped descendants, not only document overflow.
- [ ] Run `pnpm lint`, `pnpm exec tsc --noEmit`, `node --test tests/catalog-contract.test.mjs tests/demo-cart.test.mjs tests/product-indexability.test.mjs`, `pnpm build` with each environment, and `tests/catalog-seo.browser.mjs` against each running artifact. Use `tests/catalog-preview-recovery.browser.mjs` for preview persistence recovery and `tests/catalog-shared.browser.mjs` for home/mini/shared-state/text-clipping/icon checks. Browser needs the existing external Playwright runtime (set PLAYWRIGHT_MODULE if not globally resolvable).
- [ ] For browser tests set `TEST_PREVIEW=true|false`, `FRONTEND_URL`, optional approved/test SITE_URL (same value used to build), and `FRONTEND_EVIDENCE`. The reserved `https://academy.example.test` in local evidence is not a production domain.
- [ ] Verify preview create/reset/clear/filter/details/cart and paused/draft gating; with preview off, seed old browser storage and verify no demo UI/content appears. Check unavailable source diagnostic alongside helpful UI.
- [ ] Recheck any changed shared consumer on `/preview/components`, home and both product kinds. Document exact command failures and stale legacy test assumptions rather than concealing them.
- [ ] Record remaining backend, domain, content/legal approvals, real product metadata/schema validation, live crawler verification and human visual review dependencies.
