# Public architecture review questions

LA02 · Refined after review · 2026-10-26 · Architecture baseline retained; unresolved product decisions remain open.

This register separates current public-routing decisions from design and feature-implementation dependencies. It supplements, and does not replace, the [product decision register](../product/open-questions.md). `PA-*` identifies an LA02 review item, not a new approved requirement or automatically a gate for LA02. Recommendations are options for review. Record approved business decisions in the product register with owner/date/evidence, then reconcile the [sitemap](./public-sitemap.md), [sections](./public-page-structure.md) and [flows](./public-user-flows.md). Suggested owner roles below are not assigned individuals. Existing OQ records and their blocking status remain unchanged; all PA IDs are retained for traceability.

## Current review scope

The existing sitemap and the separation of discovery, commerce, identity and protected workspace are the accepted baseline. Only two unresolved choices need confirmation before public route implementation: **locale URL policy (PA-02)** and **the literal protected namespace (PA-03)**. Do not reopen the catalog split or wait for every launch policy to accept LA02.

| Item | Effect on routing/navigation now | Review timing |
| --- | --- | --- |
| PA-01: catalog boundaries | Retain `/courses` and `/mini-courses` with canonical details and query-based categories | No new sitemap decision; inventory, taxonomy values and filter behavior before LA06/LA07 |
| PA-02: locale URLs | Confirm whether unprefixed RU plus `/en/...` is the URL convention, avoiding a later URL migration | Before route implementation; full English interface content remains Phase 2, but PD-006 RU/EN legal-language access is needed for MVP |
| PA-03: protected namespace | Confirm literal `/account` so protected learning cannot collide with public `/courses/[slug]` | Before route implementation; role-default behavior remains an identity/workspace dependency |
| PA-04: Start in USA | Retain proposed `/start-in-usa`; release TBD means no live navigation until publication approval | Conditional publication decision, not a blocker for MVP sitemap acceptance |

## Retained routing notes

### PA-01 — Catalog boundaries and query taxonomy

- **Evidence:** requirements distinguish main courses, mini-courses, packages and Start in USA; PDF pages 1–2 show product groups. MVP requires courses/mini-courses and direction/language/level filters. OQ-017/OQ-088 leave taxonomy and initial language inventory open.
- **Retained architecture:** `/courses` for main/advanced courses plus a separate `/mini-courses` listing, sharing data and controls; one canonical detail URL per product. The first draft considered an all-product catalog or homepage-only mini-courses; this refinement keeps the existing split rather than reopening those alternatives.
- **Deferred details:** direction/slug conventions, applicable mini-course levels, filter multi-select, labels and initial products remain inventory-driven implementation questions. Query-based categories do not require extra direction landing pages, search or price filters. Single-select controls remain a recommendation unless inventory shows a need for more.
- **Owner / timing:** Product/content + engineering; before LA06/LA07. PD-009 governs authoring/publication; actual ready inventory is business-supplied, while OQ-017/OQ-088 remain in the product register; they do not block retaining the sitemap.

### PA-02 — RU/EN routing and missing translations

- **Evidence:** MVP interface is Russian; full English interface localization is Phase 2. PD-006 requires RU/EN legal documents in MVP and PD-003 requires selectable available RU/EN audio/subtitles. Course language visibility/filtering is MVP. OQ-024/OQ-088 remain unresolved.
- **Options:** (A) unprefixed RU plus `/en/...`; (B) `/ru/...` and `/en/...` with migration redirects; (C) one URL with language preference only.
- **Recommendation:** A preserves the requested public URLs and supports shareable localized pages. Hide enabled EN navigation until approved translations exist. Switch to the equivalent product/page without changing cart, currency or course language. When translation is missing, explain and offer the available language; do not silently relabel RU as EN. Approved legal content is mandatory for a payable locale.
- **Owner / timing:** Product/content + engineering; confirm only the URL convention for current route work. Full interface translation supply/fallback remains Phase 2 under OQ-024/OQ-088, but PD-006 legal-language access must be resolved for MVP without inventing a new route. Agreeing URL policy does not ship the full English interface in MVP. Exact redirect, canonical and language metadata strategy needs implementation design.

### PA-03 — Protected workspace namespace and multi-role entry

- **Evidence:** only `/` is implemented. The modules document includes illustrative `(student)/courses/[courseId]`; installed Next.js route-group documentation confirms groups do not change URLs. Public `/courses/[slug]` would collide with that pattern. OQ-013 leaves default role context open.
- **Options:** (A) literal `/account` namespace; (B) `/learn` plus separate account entry; (C) another explicit namespace approved during workspace IA. Route groups alone cannot separate public and protected product URLs.
- **Recommendation:** `/account` as authorized entry and `/account/courses/[enrollmentId]` for purchased learning. Honor safe purchase continuation before choosing a default role; allow authorized role choice in the account menu. Do not add a public role-picker page now.
- **Owner / timing:** Product + engineering; confirm only the literal namespace for current route work. Default role, role switching and activation/continuation details remain OQ-013 and identity/workspace implementation dependencies. This draft defines handoffs only, not a complete workspace sitemap.

### PA-04 — Start in USA route, release and offer

- **Evidence:** S1 section 2 lists the module, topics and no curator. PDF p. 2 explicitly says it is included in packages or purchased separately. Repository requirements omit that explicit standalone-sale wording; MVP scope has no dedicated standalone module slice. OQ-019 leaves completion/access behavior open.
- **Release decision still open:** the first draft considered a Phase 2 standalone launch, an explicitly approved additional MVP slice, or informational publication before commerce. None is selected here. Package-only sale would narrow the wireframe's standalone intent and requires a recorded decision.
- **Retained proposal:** `/start-in-usa` is a standalone purchase route with **release TBD**, justified by a separate purchasable module, not merely by a header label. Phase 2 packages do not determine its standalone release. Keep the proposed route and omit live entry points until publication is approved; an informational-only section/page would require its own publication decision.
- **Owner / timing:** Product/content + legal where needed; before publishing module promises, not before accepting the MVP sitemap. Record the release decision in the product register when made; retain OQ-019 for completion/access questions. Confirm price, language, duration, access, author, preview/curriculum and certification rules before sale. Do not invent module homework, completion certificate, license qualification or migration advice.

## Deferred decisions by implementation phase

These remain real implementation or release prerequisites, **not additional LA02 review gates**. The detailed PA notes below preserve the earlier analysis and OQ references; the product register remains authoritative for business decisions and its existing records must not be deleted. “Deferred” means resolve at the dependent work, not postpone an MVP obligation to a later release.

| Dependent work | Retained notes | Decision home / timing |
| --- | --- | --- |
| MVP catalog and identity/workspace behavior | PA-01 details; PA-03 role behavior; PA-05 activation/matching; PA-06 carts | PD-009 inventory readiness; OQ-013/OQ-016/OQ-017/OQ-032/OQ-033/OQ-051/OQ-088 before dependent implementation |
| MVP checkout, legal approval and purchase recovery | PA-07 legal/pricing; PA-08 payment/status; PA-10 eligibility/repurchase; PA-12 recovery | Referenced OQs below before payment integration, affected-product sale or launch acceptance; retain `/checkout/result`; Stripe embedded Payment Element is approved by PD-002 |
| MVP learning/commerce scope corrections | PA-17 | PD-004 and residual OQ-037/OQ-048/OQ-049 before dependent implementation/acceptance |
| Phase 2 packages, promotions, localization and analytics | PA-09; PA-11; PA-02 translation behavior | OQ-024–OQ-028/OQ-034–OQ-035/OQ-040–OQ-041/OQ-065/OQ-074–OQ-075/OQ-088 before those features |
| Phase 3 reviews/recommendations and public verification | PA-14; PA-15 | OQ-055/OQ-056/OQ-071–OQ-073 before those features; MVP PDF issuance does not depend on public verification |
| Homepage composition and visual evidence | PA-13; PA-16 | Design review before dependent UI work; optional section placement/demo is not a routing gate |
| Start in USA | PA-04; OQ-019 | Release TBD; decide publication and offer readiness before enabling its navigation/sale |

## Retained purchase implementation notes

### PA-05 — Guest account matching, verification and activation

- **Evidence:** S1 section 3 creates an account after successful payment if absent; requirements allow checkout account creation. OQ-032 explicitly blocks existing-email matching. Email/password, verification and reset are MVP, but activation/verification timing is unspecified.
- **Options:** (A) collect guest buyer details, create/resolve after payment, then secure email activation; (B) verify email ownership before payment while keeping guest checkout and post-payment account creation; (C) mandatory full registration before payment, which changes the documented guest flow and requires explicit approval.
- **Recommendation:** preserve A's documented guest purchase path, with verified ownership before account/learning disclosure; evaluate B for collision prevention. Never automatically sign into an existing account based on typed email. Use secure, purpose-bound links and existing auth surfaces where practical; approve password setup, existing-account collision, typo correction and expired-link recovery together.
- **Owner / timing:** Product + identity/security engineering; blocking checkout/auth integration. OQ-032, OQ-016 and OQ-051 affect related fields/actions. This draft selects neither a provider nor a final token/session lifecycle.

### PA-06 — Cart persistence and account reconciliation

- **Evidence:** PM07 requires persistent multi-product cart; OQ-033 leaves lifetime/session/device behavior open.
- **Options:** (A) merge eligible unique selections after login with visible review; (B) retain current guest cart and offer account cart choice; (C) use account cart and explicitly restore guest choices on request.
- **Recommendation:** A only after defining duplicate/ownership semantics. Preserve selections through auth, reset, verification and legal reading; reprice server-side. Define lifetime, cross-device behavior, logout isolation and consent constraints. Never silently erase either selection or share one person's cart after account switching.
- **Owner / timing:** Product + Commerce/Identity; before PM07 and end-to-end checkout acceptance.

### PA-07 — Remaining legal/pricing readiness

- **Unresolved:** final legally approved RU/EN texts, approval evidence, exact cap/tax/multi-item calculation, refund procedure and legal retention/privacy exceptions. OQ-006, residual OQ-007/OQ-008, OQ-029, OQ-037 and OQ-082/OQ-083 remain dependencies.
- **Approved boundary:** PD-002 fixes USD; PD-006 fixes all four explicit acknowledgments, immutable versions/evidence, language availability blocking, and material/editorial change behavior. These choices are not open alternatives.
- **Owner / timing:** Legal + product + Commerce; before production payment. No final legal text, tax rate, refund period or exemption claim is approved by the workflow decision.

### PA-08 — Remaining payment/status authorization

- **Unresolved:** authoritative Stripe event mapping, terminal states, retry windows, status-access authorization and safe browser/app return behavior under OQ-031/OQ-032. Authoritative confirmed payment grants access, never a browser return flag.
- **Approved boundary:** PD-002 selects Stripe embedded Payment Element, USD and eligible cards/Apple Pay/Google Pay/Klarna one-time purchases. Hosted checkout is no longer an open choice. Verify exact legal entity, settlement configuration and method eligibility before launch.
- **Recommendation:** one `/checkout/result` covering pending, confirmed/preparing, ready, failed and cancelled; authorize order details per buyer/checkout context. No raw order ID as a secret. Learning requires authenticated enrollment authorization.
- **Owner / timing:** Commerce + identity/security engineering with product; before payment integration and launch acceptance.

### PA-09 — Package configuration and cart replacement

- **Evidence:** S1 allows administrator-assembled fixed-price packages; examples and LA12 describe 2/3/6 directions plus module and a builder. These do not define arbitrary buyer composition. OQ-025–OQ-028 cover size, overlap, replacement and changes after sale.
- **Options:** (A) fixed named packages; (B) approved configurable templates with limited choices; (C) unrestricted custom composition with a new pricing policy.
- **Recommendation:** confirm A or B; keep selection within `/packages` and detail. Always display actual included products and comparable savings. Suggest a cart replacement with explicit before/after contents and affirmative acceptance, never an automatic rewrite. Decide prior ownership, duplicate components, proration, snapshot behavior and certificate outcomes before Phase 2.
- **Owner / timing:** Product + Commerce/Catalog; blocks package implementation. A homepage concept or “builder” label does not resolve the configuration policy.

### PA-10 — Eligibility, ownership and repeat purchase

- **Evidence:** advanced courses are for licensed practitioners (OQ-018); active/expired repurchase is not specified; package overlap is OQ-026.
- **Options:** informational eligibility label, buyer declaration, document verification or manual approval; duplicate purchase rejection, renewal or new enrollment for expired access.
- **Recommendation:** show intended level clearly and request a product/legal decision before selling advanced products. For active ownership, guide to current learning instead of accidental repeat purchase; this is a recommendation, not a refund/repurchase policy. Do not invent a document-upload page or auto-renewal. Clarify who buys for whom; gifts/multiple seats are outside confirmed scope.
- **Owner / timing:** Product + legal where relevant; before affected products launch.

### PA-11 — Promotions, attribution and consent boundaries

- **Evidence:** promos/package savings are Phase 2, contextual recommendations Phase 3. OQ-034–OQ-035/OQ-040–OQ-041/OQ-065/OQ-074–OQ-075 leave stacking, usage, attribution, recoverable-cart contact and analytics consent open.
- **Options:** one promo versus stacking; cart-only promo entry versus shared cart/checkout control; attribution precedence and analytics consent according to an approved policy.
- **Recommendation:** one visible promo control in cart with the same server result shown in checkout, pending promotion-policy approval. Keep package eligibility suggestions separate from Phase 3 personalized recommendations. No abandoned-cart marketing/contact or tracking merely because checkout collected an email. Do not silently choose referral-versus-code precedence.
- **Owner / timing:** Product/sales + legal + Commerce; before Phase 2 promotions/tracking.

### PA-12 — Delayed fulfillment, email failure and support escape routes

- **Evidence:** confirmed payment must lead to access and receipt; durable retries required. PD-010 fixes essential admin scope; OQ-006/OQ-069/OQ-080 leave contact identities, remaining notification details and operational recovery incomplete. PD-008 already fixes curator reminder timing. No actual support address/form SLA is supplied.
- **Options:** approved email channel, an existing staffed help channel, or a separately scoped support form; explicit status recheck plus operational escalation after a defined threshold.
- **Recommendation:** choose a real staffed channel and escalation policy before launch; surface it in stalled payment/account-access states and approved footer content. Provide “payment received, access preparing” separately from pending payment; email failure must not encourage repurchase. Define guest typo correction and resend without revealing another account. Do not create a new `/contact` or helpdesk feature from a concept screenshot.
- **Owner / timing:** Product operations + Commerce/Notifications; blocking purchase recovery acceptance.

## Retained design, later-feature and scope notes

### PA-13 — Homepage learning explanation versus interactive demo

- **Evidence:** DIRECTION proposes an interactive learning signature; SCREENS explicitly says it is not a confirmed MVP blocker. LA05 requires an explanation of value, curation, certificates and next actions.
- **Design options:** integrate truthful learning-format information into the hero/discovery/product explanations, or add a dedicated static “How Learning Works” section. Category navigation may likewise be integrated or added during visual design. Neither needs a fixed slot in the core commercial sequence. An interactive homepage sample remains a separate proposal; a dedicated `/demo` page is not part of the sitemap.
- **Recommendation:** preserve Hero → Course Discovery → Packages (Phase 2) → Mini-courses → Start in USA (release TBD) → Footer as the commercial hierarchy, omitting unreleased sections. All section arrangements are design recommendations, not immutable implementation requirements. If an interactive sample is approved and resourced, keep it at `/#learning-preview`, functional, accessible and isolated from learner records. Required course preview video is independent of this optional demo.
- **Owner / timing:** Product/design; during homepage visual design, not a gate for accepting public routing. No interactive demo release is approved here.

### PA-14 — Review placeholders and recommendations

- **Evidence:** LA07 says “reviews placeholder,” but LA14 and Phase 3 schedule actual reviews/recommendations. OQ-071–OQ-073 leave eligibility, moderation, scale, attribution and recommendation method open; Vault ST18 asks for enrolled learners and moderation.
- **Options:** hide the section until launch, show an empty placeholder, or show approved real content after the feature ships.
- **Recommendation:** omit public MVP review widgets/ratings, retain only a future template seam. In Phase 3 use moderated real content with approved attribution; no invented testimonials or “0 reviews” trust filler before capability exists. Keep reviews within product detail; an extra review route is unnecessary. Reconcile ST18 refinements with the product register before collecting reviews.
- **Owner / timing:** Product/content + moderation owner; before Phase 3. Homepage real course selection is not an algorithmic recommendation feature.

### PA-15 — Public certificate verification and privacy

- **Evidence:** S1 and Phase 3 require QR-to-public-page verification with holder, course, date and trainer; OQ-055/OQ-056 leave disclosure/enumeration/revoked/superseded behavior open. MVP PDF certificates do not require public verification.
- **Options:** opaque QR-linked record only; public certificate-number lookup; searchable directory.
- **Recommendation:** `/certificates/verify/[verificationId]` with an opaque stable public identifier, approved minimal fields, clear validity/revocation state, abuse controls and no indexing. No directory, name search, login wall or public PDF download by default. Approve privacy/legal basis, supersession, revoked fields, restoration and old QR behavior before release.
- **Owner / timing:** Product + legal/privacy + Certificates; blocking Phase 3 verification. Disclaimer must never imply professional licensing.

### PA-16 — Typography and visual-reference conflicts

- **Evidence:** AGENTS.md, README, DIRECTION and SCREENS refer to Unbounded; SYSTEM now defines Angry + Manrope and `Angry.otf` exists. Running scaffold still uses Geist/Arial. INDEX.md says no screenshot references are committed, while actual tracked and untracked reference files exist. No per-asset reviewer/date/borrow boundaries are recorded there.
- **Options:** reconcile documents to the approved newer typography; retain existing explicit instruction until approval; record each image's actual approval scope versus broad folder naming.
- **Recommendation:** have the design owner reconcile the source documents and confirm web-font rights before styling. For now, retain the explicit task/repository instruction and do not silently let a conflicting style file override it. Update the reference register in a separate authorized task with precise borrow/do-not-borrow guidance. Do not adopt contact forms, numerical claims, other brands or later-phase features from images.
- **Owner / timing:** Product/design; before UI implementation. LA02 preserves all assets and does not modify design source-of-truth files.

### PA-17 — Remaining launch scope and acceptance

- **Unresolved:** final refund eligibility and post-expiration transitions under OQ-037/OQ-048/OQ-049, plus implementation/acceptance evidence. Countdown remains later scope; PD-010 requires automatic Stripe refunds and full essential administration in MVP. The seven-day window is proposed, not final policy.
- **Approved boundary:** PD-004 establishes server-enforced deadlines, extension/pause permissions, review obligations for timely submissions, and revocation on refunds/closure. Public pages may disclose only the approved behavior; no unlimited access, partial-refund policy or automatic certificate cancellation is implied.
- **Owner / timing:** Product + operations + relevant engineering owners; before MVP learning/commerce acceptance. Resolve remaining questions and the scope/calendar mismatch in the Vault review.

## Original draft inputs and inspection limits

The source-access and visual-inspection notes below are retained from the first draft. This refinement reviews repository documentation and does not repeat the attachment/Vault/image inspection or resolve the missing production inputs.

- The original draft lacked production-ready launch catalog, prices, trainer credentials, course media, module offer, legal copy, merchant/provider, domain, support channel and certificate identity. PD-002 now selects Stripe/account ownership/currency, with exact legal-entity verification still required. PD-009 approves catalog readiness/authoring rules without an engineering minimum course count. Actual ready inventory remains business-supplied; legal texts and identities remain pending under OQ-006/OQ-007/OQ-051/OQ-052; S1/S2 examples are not substitutes.
- The local Vault and both original repository attachments were accessible. No additional independently identified “LMS Academy Docs” file/link was supplied; this review does not claim to have read an unidentified remote source.
- Reference contact sheets from the initial inventory and all five wireframe pages were visually inspected. Additional reference images appeared during the task; those later additions were not reviewed or changed. Reference placement is evidence of files present, not a reviewer approval record. Browser screenshots, responsive behavior, contrast and keyboard interaction were not verified because no UI was implemented in this task.
- No legal research or new legal interpretation was performed. Counsel must decide the actual rules; the USD 2,500 mention reproduces project scope, not external legal advice.
- No UI, application logic, configuration, dependencies, routes or Vault task statuses are changed. No commit or push is part of LA02.

## Remaining review sequence

1. **For route implementation:** confirm the locale URL convention (PA-02) and protected namespace (PA-03), retaining the existing sitemap and catalog split.
2. **For design and each implementation phase:** use the deferred-decision table and existing product-register records. Resolve only the dependencies of that work; no blanket PA-05–PA-17 approval is needed to accept LA02.
3. **Before publishing Start in USA:** record its release and offer decision (PA-04). Until then, preserve the proposed standalone purchase route with release TBD and omit live navigation.
