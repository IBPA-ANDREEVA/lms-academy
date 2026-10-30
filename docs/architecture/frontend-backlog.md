# Missing shared frontend components

This is a prioritized backlog, not authorization to build speculative primitives or later-phase features. The separately requested `/preview/components` review route is implemented. Start from an actual page request and its supplied reference. Existing components: [registry](frontend-components.md); page-local candidates: [section audit](frontend-sections.md).

| Priority | Candidate / owner | Reuse evidence and trigger | Blocker |
| --- | --- | --- | --- |
| P0 | Published shell content / public-shell | Four legal links and approved disclaimer across public and focused pages; actual brand/contact data | Approved legal copy, identity, implemented routes |
| P0 | Catalog results feedback / catalog | Both catalogs need loading, no inventory, no matches/reset and error/retry | Real query/state contract and catalog implementation |
| P0 | Commerce summary / commerce | Cart, checkout, result share authoritative price breakdown | Server money/offer contracts; never compute eligibility or price in generic UI |
| P1 | Auth route and service composition / identity | UI-only modal now shares login/register/recovery presentation | Standalone sitemap routes, verification/reset, PA-05 and identity/continuation policy; connect real server flows later |
| P1 | Published course-detail data / course-detail | Shared detail anatomy, preview fallback and curriculum accordion now serve both dynamic routes | OQ-009 inventory, approved trainer/media, access/support/refund terms and real commerce interface |
| P1 | Breadcrumb navigation / public-shell | Detail and legal contexts need actual parent destinations | Implemented routes; no universal speculative shell |
| P1 | Accessible confirmation / generic UI | Extract when a production destructive action needs it | No current destructive product flow; retired editor modal is not retained |
| P1 | File upload / assignments | Student submission and revision need protected media controls | Storage/privacy/validation contract, real assignment flow |
| P2 | Status presentation / relevant feature | Learning, assignments, certificates may share accessible status wording | Domain state contracts before abstraction |
| Later | Package offers, promo entry, reviews, recommendations, social sign-in | Recorded future candidates remain in product/architecture specifications | Phase 2/3; never infer release from a mockup |

No standalone MiniCourseCard, compact footer copy, auth-specific button/input or generic Hero is needed. Reuse the existing variants; keep section compositions local. The removed component database contained 66 candidates, most of which were page-local sections rather than shared primitives. Its UI, approval history, generated specs and reference-management infrastructure have been retired after the section audit and preservation of the edited container/button/footer definitions.

2026-10-28 HOME-06–09 update: the owner-requested homepage showcase and local package-builder preview are implemented. This does not resolve catalog publication, course eligibility, package pricing/overlap, or Start in USA release blockers. CourseCard and CategoryNavigation are reused; carousel and media presentation are shared only inside the home feature. No production package or checkout service was introduced.

2026-10-28 HOME-10/11 update: the Phase 3 reviews area is a visually complete carousel of unmistakable layout placeholders, with a separate recommendation placeholder. Publication, moderation, permissions and real content remain Phase 3 work. The contact form visually matches the supplied composition and validates locally, but submission is disabled because the owner explicitly deferred backend implementation. Server validation, rate limiting, spam protection, error/loading/success delivery states and consent policy must be built with the real endpoint before enabling it. No fake success or network request exists.

2026-10-28 refinement: header/footer preview navigation is filled using home anchors and disabled «Скоро» entries. This completes preview layout only; real account/cart/legal destinations and approved content remain blocked above. HOME-05/06–09 motion, natural-height panels, compact headings, menu behavior and static cross-section geometry are implemented and browser-checked. No additional generic animation or section-wrapper abstraction is needed.


LA09 update (2026-10-29): cart preview, `/cart`, `/checkout`, shared rows/summary and development test controls are implemented. The commerce-summary UI candidate is now owned by commerce; its authoritative server contract remains pending. Remaining launch dependencies: catalog offers/eligibility, server pricing/taxes/currency/cap interpretation, cart lifetime and account reconciliation (PA-06/OQ-033), guest account matching, approved legal text/versions/consent evidence, selected provider and idempotent payment/order lifecycle. None is resolved by the demo UI. No checkout-result simulation was added.
