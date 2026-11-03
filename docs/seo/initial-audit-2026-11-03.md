# LAND04 initial SEO audit — 2026-11-03

Source inspection completed before implementation. Framework: installed Next 16.4.3 App Router with Cache Components. Actual routes: `/`, `/courses`, `/mini-courses`, both product detail templates, `/cart`, `/checkout`, `/preview/components`. Auth is a modal; legal, student, trainer and admin routes are not implemented. Planned sitemap entries are not actual pages.

| Severity | Evidence / affected routes | Intended correction |
| --- | --- | --- |
| High | CatalogExperience selects example arrays when published arrays are empty; home has separate product fixtures; detail routes resolve fixtures irrespective of environment | Explicit server TEST_PREVIEW gate, common data contract/store, no production fallback, no demo product SEO |
| High | No robots or sitemap implementation | File-convention handlers, real-publication filtering, static discovery URLs retained during outages, no invented domain |
| High | No canonical, metadataBase or per-page description overrides | Central server metadata helper; explicit SITE_URL; query-free canonicals; omit absolute URLs and noindex until domain configured |
| Medium | Root generic title/description; catalog only title; details fixture titles, no descriptions | Russian route descriptions; verified product metadata only; generic noindex metadata for preview/missing/unavailable details |
| Medium | No OG/Twitter fields or share image | Consistent page-specific sharing fields and supplied-logo brand image |
| Medium | Default favicon.ico; existing BrandLogo is a prior vector concept, different from supplied PNG | Trace supplied identity to paths, derive mark favicon/ICO/apple PNG, one file-based icon configuration |
| Medium | Cart, checkout, detail previews and component preview already noindex; no future private-route policy | Preserve noindex, add documented default-deny policy and validation for future private/auth routes; no speculative private route implementation |
| Low | No JSON-LD | Minimal Organization/WebSite only with configured origin, breadcrumbs and Course only from real approved published facts; no ratings/offers invented |
| Low | html lang=ru already correct; no English routes | Preserve ru; no fictional hreflang alternates |
| Review | Existing main/page H1s and card H2/H3s; catalog introduction is shared; meaningful media generally has alt, decorative SVG hidden | Preserve hierarchy, test DOM and image names; previews visibly labeled; do not rewrite approved public copy |
| Review | Internal links use implemented routes or home anchors; unavailable legal/auth entries have no href | Keep absent pages absent; remove fixture-only links from production home/catalog; test missing routes |

Missing production facts: approved origin, backend/publication records, approved legal content, social handles, verified organization legal identity. Public-facing brand name is supported by supplied logo and existing shell, not proof of a legal entity. Existing photography permissions and final public content approval remain release dependencies.

Brand reference: only IMG_4590.PNG supplied (2172×724 RGBA). Scope: mark and two-line Beauty Business Academy lockup, original proportions/letterforms and colors. Reject transparent-canvas artifacts; no use as UI layout reference. Dark-background adaptation may change text to white for contrast, retaining mark identity. No PNG embedded in SVG. Browser visuals remain subject to owner review.
