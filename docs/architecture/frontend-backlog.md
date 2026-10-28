# Missing shared frontend components

This is a prioritized backlog, not authorization to build speculative primitives or later-phase features. The separately requested `/preview/components` review route is implemented. Start from an actual page request and its supplied reference. Existing components: [registry](frontend-components.md); page-local candidates: [section audit](frontend-sections.md).

| Priority | Candidate / owner | Reuse evidence and trigger | Blocker |
| --- | --- | --- | --- |
| P0 | Published shell content / public-shell | Four legal links and approved disclaimer across public and focused pages; actual brand/contact data | Approved legal copy, identity, implemented routes |
| P0 | Catalog results feedback / catalog | Both catalogs need loading, no inventory, no matches/reset and error/retry | Real query/state contract and catalog implementation |
| P0 | Commerce summary / commerce | Cart, checkout, result share authoritative price breakdown | Server money/offer contracts; never compute eligibility or price in generic UI |
| P1 | Auth page composition / identity | Login/register/recovery may share instruction and related actions | Build real flows first; PA-05 and identity/continuation policy. Reuse existing fields now |
| P1 | Course facts/curriculum/preview / catalog | Course and mini detail may share factual anatomy | Approved facts and media; keep detail-local until confirmed |
| P1 | Breadcrumb navigation / public-shell | Detail and legal contexts need actual parent destinations | Implemented routes; no universal speculative shell |
| P1 | Accessible confirmation / generic UI | Extract when a production destructive action needs it | No current destructive product flow; retired editor modal is not retained |
| P1 | File upload / assignments | Student submission and revision need protected media controls | Storage/privacy/validation contract, real assignment flow |
| P2 | Status presentation / relevant feature | Learning, assignments, certificates may share accessible status wording | Domain state contracts before abstraction |
| Later | Package offers, promo entry, reviews, recommendations, social sign-in | Recorded future candidates remain in product/architecture specifications | Phase 2/3; never infer release from a mockup |

No standalone MiniCourseCard, compact footer copy, auth-specific button/input or generic Hero is needed. Reuse the existing variants; keep section compositions local. The removed component database contained 66 candidates, most of which were page-local sections rather than shared primitives. Its UI, approval history, generated specs and reference-management infrastructure have been retired after the section audit and preservation of the edited container/button/footer definitions.
