# SEO maintenance — LMS Academy

Canonical instructions for public-route work. Initial findings: [2026-11-03 audit](initial-audit-2026-11-03.md). Repeatable checks: [checklist](verification-checklist.md). Catalog source and preview rules: [contract](../architecture/catalog-preview-contract.md).

## Architecture and configuration

Installed Next 16.4.3 App Router uses its Metadata API and file-based metadata routes. Read the installed guides before changing APIs. `src/lib/site-environment.ts` is server-only. `TEST_PREVIEW` is exact opt-in. `SITE_URL` must be the approved HTTPS origin, without credentials/path/query/hash. Missing/invalid domain means no canonicals/absolute social URLs/schema, an empty sitemap, crawl disallow and noindex. Never derive origin from an untrusted Host header, invent the production domain, or use localhost as a canonical. Domain is not yet supplied. Build/restart with the correct flag/origin; static metadata is part of the artifact.

`src/lib/seo/metadata.ts` owns route-specific Russian title/description, full brand title, canonical, robots, OG and Twitter/X fields. Root `src/app/layout.tsx` provides metadataBase when configured, applicationName and a **noindex default**. Public pages explicitly opt in through `staticMetadata` or verified `productMetadata`. It does not inherit a homepage canonical into child routes. Each helper returns complete sharing objects so Next's shallow metadata merge cannot carry a wrong title/URL from a parent.

Actual public page allowlist: `/`, `/courses`, `/mini-courses`. Catalog query parameters canonicalize to the unfiltered listing; no separate category or language route is invented. Product URLs have one kind-specific slug URL. Published but sale-paused products may be indexable; sale availability is not publication. Only real, approved, published, accessible content can reach product metadata/schema/sitemap. Draft, archived, demo and missing/unavailable products are noindex. An outage uses helpful noindex content, not invented details. Existing unknown routes remain Next 404/noindex.

`/cart`, `/checkout`, `/preview/components` are noindex/nofollow with their own descriptions. Auth currently lives in a modal; standalone auth/legal/student/trainer/admin routes do not exist. Do not create them just for SEO. Future private/auth routes must preserve explicit noindex and server authentication/resource authorization. Future approved legal/informational pages need their own title, description, canonical, public allowlist entry and approved content before sitemap inclusion. Do not generate legal text. Root default-deny helps but is not access control.

## Robots and sitemap

`src/app/robots.ts` uses the file convention. Preview or missing origin disallows crawling everywhere in addition to page noindex. A real configured site allows public crawling, including public noindex utilities so bots can read their directives, while discouraging crawling of private namespaces/API. Robots is not confidentiality or authorization. Never use a robots Disallow as a substitute for noindex, and remember blocking crawling can prevent a crawler from observing noindex. A leaked preview deployment requires removal/access restriction procedures, not a claim that robots guarantees erasure.

`src/app/sitemap.ts` includes only the three implemented static discovery pages plus real Catalog projections passing the defensive `isIndexableProduct` SEO check. Source unavailability retains static routes. No fixture slugs, query variants, cart, auth, private, preview or absent legal URLs appear. Missing domain or preview emits no URLs. Product lastModified uses content updatedAt; do not fabricate freshness for static pages. Backend integration must implement actual publication/unpublication cache invalidation/request-time reads before real records can change; see the catalog contract.

## Structured data

`src/lib/seo/structured-data.ts` builds minimal WebSite/Organization data on the homepage from the supplied public brand name and configured origin. This does not assert legal entity, address, accreditation or social identity. Real published details may produce Course and BreadcrumbList aligned with visible breadcrumbs/title/description and language versions. Mini-courses use Course for their recorded lesson sequence. `src/features/public-shell/structured-data.tsx` serializes and escapes `<` to avoid script injection. No product schema is emitted in preview, on missing/unavailable records or without an origin.

No invented Offer, price, availability, aggregateRating, review, instructor credential, certificate/accreditation, SearchAction or social `sameAs`. There is no search route to advertise. The present schema is basic semantic markup, not a claim of Google rich-result eligibility. Verify field types/required properties against [Schema.org Course](https://schema.org/Course) and [BreadcrumbList](https://schema.org/BreadcrumbList). Follow Google's [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing) and [robots](https://developers.google.com/search/docs/crawling-indexing/robots/intro) guidance. Live Search Console/schema-validator verification remains a deployment/content task.

## Images, logos and icons

The owner supplied IMG_4590.PNG on 2026-11-03. [Brand provenance](../../public/brand/source-provenance.json) records its SHA-256. `public/brand/logo.svg`, `logo-dark.svg` and `mark.svg` are path-based traces, not raster wrappers or replacement typography. The original subtle pixel variation is normalized to sampled flat plum/silver/near-black; dark-background wordmark uses white. Existing concept artwork remains historical, unused by BrandLogo. The current shell uses traced BrandLogo paths with currentColor for readable wordmark on light/dark surfaces; the containing link has the accessible brand name.

Icons have one owner: `src/app/favicon.ico` (16/32/48 RGBA PNG entries), `src/app/icon.svg`, `src/app/apple-icon.png` (180px). Do not add a competing manual metadata.icons declaration. `public/brand/social.png` is the 1200×630 sharing image, declared explicitly only with a configured origin; no file-based OG image duplicates it. `scripts/brand/vectorize-logo.py` and `render-assets.mjs` document reproducible tracing/exports. One-off tracing tools are not runtime dependencies. Inspect actual header/footer/mobile-logo fit whenever proportions change.

Use meaningful Russian alt text for real content images, empty alt/aria-hidden for decorative assets, responsive sizes and dimensions. Test images/fictional trainer illustrations explicitly say demo. Do not present source imagery as proof of licensed use or verified staff identity.

## Future RU/EN

Document lang remains ru and OG locale ru_RU. Course language availability is not page-language localization. Only add hreflang/alternate locale URLs after approved full translated content and actual route architecture exist (PA-02 remains unresolved). Each real language version needs self-canonical, reciprocal hreflang and matching HTML lang/metadata; missing translations must not produce fake alternates or indexable duplicates.

## Mandatory maintenance behavior

For every public route, catalog/detail, metadata, structured-data, sitemap or relevant component change: read this guide, inventory real routes and consumers, update meaningful metadata, verify canonical/indexing, review sitemap and schema, ensure unpublished/preview content remains excluded, execute available SEO checks, and record results/blockers in the task summary. See the checklist for exact commands and rendered-HTML checks. Build success alone proves neither crawler indexing nor human visual approval.

## Python backend boundary · 2026-11-03

ADR-0003 removes TypeScript backend policy. `src/lib/seo/product-indexability.ts` owns only defensive metadata/schema/sitemap exclusion; it does not authorize publication, sale or access. Temporary input shapes come from `src/features/catalog/catalog-view-types.ts`; the disconnected `catalog-source.ts` supplies no real products. Future FastAPI Catalog owns the authoritative public projection; generated OpenAPI integration must preserve this guide and implement invalidation. Routes, canonicals, noindex rules and configured-origin requirements remain unchanged.
