# Frontend implementation and integration backlog

This is a prioritized backlog, not authorization to build speculative primitives or later-phase features. The separately requested `/preview/components` review route is implemented. Start from an actual page request and its supplied reference. Existing components: [registry](frontend-components.md); page-local candidates: [section audit](frontend-sections.md).

## Current source-audited backlog · 2026-11-02

See [LAND01 findings and evidence](../qa/LAND01-public-site-audit-2026-11-02.md). Existing components are not missing work: CatalogExperience + result sections, PurchasePanel, CartItems/OrderSummary/CartPreview, AuthModal and shared form controls already exist. Integration gaps extend those owners rather than recreating them. P0 below means a production MVP acceptance blocker; it is not authorization to enable a service or invent content/policy.

| Priority / action | Existing owner / concrete next work | Actual evidence / dependency |
| --- | --- | --- |
| P0 · integrate | Catalog + public presentation: replace empty published arrays/example fallback with approved published records, real taxonomy/facts/media/trainer/program/price/availability | Four catalog + four mini fixtures; all detail products lack factual content. PD-009, OQ-017/018/021–024; no minimum launch inventory quota. Preserve latest owner instruction about visible fixture labels; publishing fixtures is not a substitute. |
| P0 · integrate | Commerce: server cart, persistence/account reconciliation, current quote/eligibility/USD/cap, Stripe attempts/events/order/result and enrollment integration | Root CartProvider is development-only local fixture state; production cart empty. Extend existing rows/summary. PD-002/006/010; OQ-029/031/032/033/036/037 and legal/tax readiness. |
| P0 · correct contract/integrate | CheckoutAgreements: four explicit required acknowledgments with approved versions; real public legal pages/footer links; server validation/evidence | Only three disabled checkboxes; privacy is text. PD-006 requires all four; payment remains disabled. Final RU/EN legal text and SALE002 publication-owner preparation remain blocking. |
| P0 · integrate | Identity: actual registration/login/recovery/verification/reset/session and safe checkout continuation, using current modal/form owners | AuthModal only displays unavailable notices. Standalone routes and session/server interfaces missing; field requirements/guest matching must be approved. Do not collect birthdate as a new product requirement from UI alone. |
| P1 · fix | Detail VideoPreviewSection: intrinsic/minimum media dimensions force grid wider than viewport; remove clipping without masking content | Measured media overflow at tablet and text/media clipping on mobile despite zero document scroll. Preserve selected layout; see V-001. |
| P1 · fix | Home founder heading and learning placeholder: narrow-width content must fit its own container | 320px founder nowrap heading and aspect-ratio/min-height placeholder extend off edge; V-002/V-003. |
| P1 · fix | AuthModal: lock/unlock background scroll and preserve scroll position across all close paths | Background scroll moved 0→600 while modal open at 1440 and 390. Do not replace native dialog merely to solve this. |
| P1 · verify/fix | Catalog FilterDropdown: popup collision/size/keyboard dismissal at narrow widths; result-count/announcement state | Existing authored control, not a missing generic Select. Native SelectField serves preview/demo controls. Add runtime checks before broader reuse. |
| P1 · integrate | HOME-11 ContactForm delivery | Existing local validation/disabled explanation is correct. SITE014: approved recipient/consent, server validation, abuse controls, honest pending/success/failure + diagnostics. No fake success. |
| P1 · content | Detail copy: do not promise “program below” when no modules; implement approved access/support/certificate text from actual published contracts | Empty outcomes/curriculum, absent trainer, no public video; PD-004/010 already settle core activation/durations/manual issuance, residual questions remain. |
| P1 · verification | Update stale frontend/catalog/detail/auth/commerce/learning-offers test expectations in a focused follow-up | Current audit reruns fail on historical counts/labels/control locations and old header-box geometry. Do not weaken production-policy assertions to make suites pass. No test-source edits in audit. |
| P2 · EXTRACT candidate | Catalog-local results body shared by numbered course/mini result sections | Duplicate grid/empty/reset JSX and same CSS; retain section owners. No global product-card rewrite. |
| P2 · REUSE candidate | Home CourseShowcase → existing home OfferCarousel where appropriate | Repeated useSnapCarousel controls; narrow controls remain for a single filtered card; desktop controls are correctly hidden. Keep reviews drag behavior local. |
| P2 · REFACTOR | Split nine substantial preview sections into local files; format dense catalog interaction code; consolidate superseded CSS rules | 539-line client preview owner; repeated November override blocks across header/offers/home/filter CSS. No architecture migration or new generic wrapper. |
| P2 · review | Touch targets/font sizes/focus in narrow filters and shell; consistent visible/accessible labels | Header rail 40px, filter reset 32px, mobile filter text 11px; target policy 44px. Card title link overlay is full-card and must not be falsely classified by inline text height alone. |
| P2 · REMOVE CANDIDATE | Unreferenced course placeholder PNG and starter public SVGs | No source consumers found; **retain assets**, cleanup requires approval. Empty legacy domain feature directories likewise do not prove an implemented backend. |
| Later · OUT OF SCOPE for MVP | Real packages/pricing/promos/finance/full English (Phase 2); reviews/recommendations/social/QR (Phase 3); Start in USA standalone release unresolved | Existing homepage local previews do not release these capabilities. Placeholder reviews are not an MVP service blocker; their public empty presentation still requires release review. |

Retain genuine future candidates below until actual approved consumers/contracts exist: admin consequence confirmations, private resumable assignment upload, domain status presentation, legal article/return composition. Do not implement speculative primitives from the backlog. Shared-component modifications must review all actual consumers and `/preview/components`; visual approval stays outstanding.


## Retained future candidates and historical follow-ups

This table describes missing integration or future consumers, not absence of existing frontend owners. Dated notes below preserve prior context; current counts/labels/state paths are in the audited registries.

| Priority | Candidate / owner | Reuse evidence and trigger | Blocker |
| --- | --- | --- | --- |
| P0 | Published shell content / public-shell | Four legal links and approved disclaimer across public and focused pages; actual brand/contact data | Approved legal copy, identity, implemented routes |
| P0 | Catalog results feedback / catalog | Both catalogs need loading, no inventory, no matches/reset and error/retry | Real server query/state contract; existing result sections must be extended |
| P0 | Authoritative Commerce summary integration / commerce | Cart/checkout reuse OrderSummary; result is missing; all need authoritative quote data | Server money/offer contracts; never compute eligibility or price in generic UI |
| P1 | Auth route and service composition / identity | UI-only modal now shares login/register/recovery presentation | Standalone sitemap routes, verification/reset, PA-05 and identity/continuation policy; connect real server flows later |
| P1 | Published course-detail data / course-detail | Shared detail anatomy, preview fallback and curriculum accordion now serve both dynamic routes | PD-009 business-selected ready inventory (no engineering minimum count), approved trainer/media, access/support/refund terms and real commerce interface |
| P1 | Breadcrumb navigation / public-shell | Detail and legal contexts need actual parent destinations | Implemented routes; no universal speculative shell |
| P1 | Accessible confirmation / generic UI | PD-010 requires consequence-explaining confirmations across sensitive admin actions; extract when implementing actual consumers | Admin action/permission contracts and reviewed screen references; retired editor modal is not retained |
| P1 | File upload / assignments | Student submission and revision need protected media controls | Storage/privacy/validation contract, real assignment flow |
| P2 | Status presentation / relevant feature | Learning, assignments, certificates may share accessible status wording | Domain state contracts before abstraction |
| Later | Package offers, promo entry, reviews, recommendations, social sign-in | Recorded future candidates remain in product/architecture specifications | Phase 2/3; never infer release from a mockup |

No standalone MiniCourseCard, compact footer copy, auth-specific button/input or generic Hero is needed. Reuse the existing variants; keep section compositions local. The removed component database contained 66 candidates, most of which were page-local sections rather than shared primitives. Its UI, approval history, generated specs and reference-management infrastructure have been retired after the section audit and preservation of the edited container/button/footer definitions.

2026-10-28 HOME-06–09 update: the owner-requested homepage showcase and local package-builder preview are implemented. This does not resolve catalog publication, course eligibility, package pricing/overlap, or Start in USA release blockers. CourseCard and CategoryNavigation are reused; carousel and media presentation are shared only inside the home feature. No production package or checkout service was introduced.

2026-10-28 HOME-10/11 update: the Phase 3 reviews area was implemented as a layout preview; current source has four blank cards in one strip and no separate recommendation component. Publication, moderation, permissions and real content remain Phase 3 work. The contact form visually matches the supplied composition and validates locally, but submission is disabled because the owner explicitly deferred backend implementation. Server validation, rate limiting, spam protection, error/loading/success delivery states and consent policy must be built with the real endpoint before enabling it. No fake success or network request exists.

2026-10-28 refinement: header/footer preview navigation is filled using home anchors and disabled «Скоро» entries. This completes preview layout only; real account/legal services and approved content remain blocked; `/cart` and `/checkout` routes now exist. HOME-05/06–09 motion, natural-height panels, compact headings, menu behavior and static cross-section geometry are implemented and browser-checked. No additional generic animation or section-wrapper abstraction is needed.


LA09 update (2026-10-29): cart preview, `/cart`, `/checkout`, shared rows/summary and development test controls are implemented. The commerce-summary UI candidate is now owned by commerce; its authoritative server contract remains pending. Remaining launch dependencies: catalog offers/eligibility, server pricing/taxes/currency/cap interpretation, cart lifetime and account reconciliation (PA-06/OQ-033), guest account matching, approved legal text/versions/consent evidence, Stripe integration and idempotent payment/order lifecycle. Provider choice is approved by PD-002; PD-010 also requires automatic eligible refunds, with final eligibility still OQ-037. None is implemented by the demo UI. No checkout-result simulation was added.

## Revised delivery ownership · 2026-10-30

See [development workflow](development-workflow.md) and [planning audit](planning-audit-2026-10-30.md). Public UI remains implemented with fixtures; server integration is pending. Course authoring, access, assignments, certificates, notifications and admin screens each have explicit UI planning/reference/implementation/integration tasks in the Vault. References are not approved by this plan. PD-011 removes manager-only UI; referral/statement sections live in existing authorized account/admin features and consume Commerce contracts. No duplicate shared component is authorized.


Nine-epic planning update (2026-10-30): SITE008 verifies only residual public UI gaps; SITE013 connects the existing home/catalog/detail components; SITE014 owns the currently disabled HOME-11 contact delivery, including server validation, abuse controls, approved consent/recipient and real success/failure states. No homepage section or shared component is scheduled for recreation. Current task IDs and retired-ID aliases are in the Vault mapping; implementation paths and approval scopes above are unchanged.

2026-11-02 public polish: requested copy/layout/card/motion work is recorded in [verification](../design/landing-refinement-2026-11-02.md). Human review of the card/switcher proposals and founder disclosure remains pending. English routes/content are not implemented, so the request to audit the English experience is limited to currently existing demonstration strings. Real course, video, review and commerce integrations remain separate backlog items.

## Public polish follow-up · 2026-11-02

See [current implementation and verification](../design/public-polish-followup.md). Existing route/section owners remain. PublicHeader and HOME-06–09 now share an attached light navigation surface; HOME-03 CTA is removed; HOME-04 owns `components/founder-story.tsx` (`children`) with animated disclosure. Public fixture explanations are removed per explicit owner instruction, with unavailable actions preserved. PageContainer adds opt-in `reveal` for home narrative and detail sections; Button/ButtonLink retain their APIs with revised Cut motion, also visible in the canonical component preview. Missing real content/services and human visual review remain pending.

## LAND02 disposition · 2026-11-02

[LAND02 implementation and reference contract](../qa/LAND02-public-site-refinement-2026-11-02.md) records the implemented V-001–006, V-008/009/011 repairs, safe V-007 presentation, mobile motion/navigation/card/filter composition and HOME-12 FAQ. Prior LAND01 findings remain historical evidence, not current unresolved defects for these paths. Browser evidence and real command outcomes are linked from that report. No backend capability is completed by these UI changes.

Remaining: owner visual review and FAQ editorial/legal review; C-002 legal title approval, C-003 real catalog identity normalization, C-008 onward factual claims/content; V-010 review release treatment, V-012 unavailable footer links, V-013 generic Russian not-found follow-up. Published inventory, media rights, identity/contact/checkout/learning/certificate services and approved legal versions remain missing. No final public copy/production capability approval is inferred.

LAND02 owner addition: canonical `components/ui/button.tsx` / `button.module.css` now implement Parallax Cut within the existing `appearance="cut"` API. Stable hit area, independent outline/slash/label/arrow/depth, fine-pointer hover, touch press, keyboard focus and reduced/disabled/loading safeguards. `component-preview/cut-button-preview.tsx` (no props), consumed by the existing Button preview section, demonstrates six requested states and existing variants without another route or shared button component. Full source consumers, state screenshots and real interaction checks are recorded in the [LAND02 report](../qa/LAND02-public-site-refinement-2026-11-02.md). Human visual review remains pending.

## LAND02 motion follow-up · 2026-11-02

Motion owners and values are implemented in [MOTION.md](../design/MOTION.md). Remaining review: human desktop/mobile motion approval; real-device/virtual-keyboard and non-Chromium verification. Routing follow-up: with JavaScript disabled, current dynamic detail routes can remain on `src/app/(details)/loading.tsx` while their streamed content remains in a hidden PPR segment. This is not an opacity/reveal defect; preserve the no-JS content assertion and resolve in a routing slice. Conditional trainer/curriculum content still needs real fixtures before claiming runtime verification. No backend scope or launch content approval is inferred.

## Premium motion disposition · 2026-11-02

The owner's new D-020 brief replaces the timed first-session intro with real loading, adds bounded desktop scroll behavior, Carousel-style switching and public Wipe orchestration. [MOTION.md](../design/MOTION.md) records current ownership and constraints; the [verification report](../qa/premium-motion-2026-11-02.md) records actual checks. Remaining: human motion approval, physical-device/Safari/low-end testing, real course-image verification when approved assets/data exist. Existing no-JS streamed detail/PPR limitation is tracked separately and is not treated as completed business/routing work by these animations. No delivery milestone, phase or service capability changed.

## D-021 disposition · 2026-11-03

Requested animation/mobile repairs are implemented in existing owners; [QA](../qa/animation-redesign-2026-11-03.md) records actual browser findings, corrections, checks and limits. Do not reopen removed story pin/course-only scroll/Circle behavior as regressions: the owner explicitly replaced them. Existing browser regression sources have been updated to D-021; their external Playwright runner was not executed in this Browser-only verification session.

Still pending: human visual/motion approval; physical touch/Safari/low-end and live OS reduced-motion checks; actual streamed loading/network-error stress execution; no-JS detail/PPR follow-up; published content/legal/identity/contact/commerce/learning services and conditional curriculum/trainer data. Working fixtures, local demo feedback and screenshots are not backend completion or launch approval. No Vault status or delivery deadline changed.
## LAND03/LAND04 disposition · 2026-11-03

Implemented: explicit TEST_PREVIEW gating, centralized browser-local catalog/cart examples, labeled demo cards/detail, distinct loading/empty/no-match/unavailable UI, CatalogState reuse, production source boundary/contracts, no production fixture fallback, SEO allowlist/default-noindex/metadata/sitemap/robots/schema conventions, supplied-logo SVG/icon exports and permanent SEO checks. Historical NODE_ENV-only demo and unconditional-empty-array fallback descriptions are superseded.

Still missing: real Catalog persistence and Admin readiness/publication/price/taxonomy flows; actual source error/timeout/request-time/cache invalidation; server Commerce cart/quote/checkout; approved public content/domain/legal/media permissions; live crawler/product-schema verification; human visual approval. No task completion, real database, payment, enrollment, publishing authority or Vault evidence is inferred. CatalogState extraction candidate is now implemented for demonstrated consumers, not generalized into a UI framework.


## Public UI fixes · 2026-11-03

Owner-requested non-home header opacity, larger/aligned mobile logo, compact home direction filters, edge-to-edge mobile card rails, simplified menu and directional HOME-05 wipe are implemented in existing owners. [Verification and reference scope](../qa/public-ui-fixes-2026-11-03.md). Pending: owner visual review, physical touch/Safari/low-end checks and existing content/service dependencies. No new shared primitive, backend capability, release promotion or task completion inferred.


## Catalog and sticky-layout follow-up · 2026-11-03

The owner’s sticky connection, desktop review clipping, compact course/mini catalog entry and upward mobile page-navigation corrections are implemented in the existing owners. These supersede the affected historical hero/bridge/horizontal-mobile notes. Human visual review and physical Safari/touch validation remain pending; backend/content/domain dependencies remain unchanged. [Paths, reference scope and verification](../qa/catalog-layout-followup-2026-11-03.md).


## Learning wipe coverage correction · 2026-11-03

Owner follow-up reverses HOME-05 step motion: advancing sweeps left, returning sweeps right. `home/sections/05-learning-preview/components/learning-preview-demo.tsx` (LearningPreviewDemo, no props; LearningPreviewSection consumer) places the existing plum curtain at the demo root so it covers the entire interactive surface, including its top step pickers/header. Pickers receive the same outgoing/incoming horizontal push, with the return beginning under the fully covered frame. The owning `.demo` clips the wipe; no page-navigation or inter-section motion changes. Existing form state, hidden/inert panels, keyboard focus and reduced-motion lifecycle remain. Numerical visual treatment awaits owner review. Regression checks now assert reversed direction and that the curtain spans the pickers.


## Preview and motion refinement · 2026-11-03

Implemented the owner's preview simplification, full-card navigation, catalog heading hierarchy, actual popup scrollbar hit-zone repair, flat-rest Cut, server-visible welcome splash, downward mobile wipe and bidirectional dock fade. Preserve missing real services/content/domain/legal approvals. Remaining: human appearance/motion review, physical touch/Safari/low-end QA, existing no-JS streamed detail limitation, generated-output lint hygiene, legacy test expectations for removed heading/home filters/upward wipe. No capability epic or Vault completion inferred. [Reference scope, contracts and evidence](../qa/preview-refinement-2026-11-03.md).


## Python backend migration · 2026-11-03

[ADR-0003](../decisions/0003-python-backend-architecture.md) supersedes TypeScript backend placement. Existing frontend owners/props/JSX remain unchanged. Future authoritative operations live in `backend/app/modules` and are consumed over HTTP using generated OpenAPI contracts. Current backend directories are empty, not delivered services. Catalog preview remains gated solely by `TEST_PREVIEW=true`, regardless of NODE_ENV. See [integration](frontend-backend-integration.md) and [migration evidence](../qa/python-backend-migration-2026-11-03.md) for the retained frontend-only Catalog view types, disconnected source, SEO consumer paths and missing real integration.
## Landing refinements - 2026-11-04

Completed in owner-requested preview scope: stable outgoing upload height, repeated dropdown animation, Contact inversion/removals, top-right catalog links, review drag affordance and canonical Double Cut + Panel. Package preview now shares catalog/cart IDs and state controls; PackageBuilder is unconsumed historical source, not production integration. Production package contracts/pricing/overlap policy, Commerce, contact delivery, real reviews and human visual review remain pending at their existing phase/owners. No missing backend capability is counted as delivered. [Verification](../qa/landing-refinements-2026-11-04.md).


## Homepage appearance motion - 2026-11-04

Owner-requested homepage entrance implementation is available on codex/homepage-section-motion. Authored typography/photo/card sequences and interruption/state/viewport tests replace prior generic homepage entry treatment; no backend capability, new page or future-phase feature delivered. Existing visual-review, authentic-content/service/legal readiness dependencies remain. [Research and evidence](../qa/homepage-section-motion-2026-11-04.md).

## Entrance lifecycle correction - 2026-11-04

Resolved the owner-reported visible-to-hidden flicker, post-loader scheduling gap, late scroll trigger, stale completed-style restoration and selection replay. Tests now sample the complete lifecycle, not only final positions. Existing human visual review, physical Safari/touch, real content/services/legal and production-origin dependencies remain; no delivery epic is marked complete. [Audit and evidence](../qa/animation-synchronization-2026-11-04.md).

## Homepage entrance visibility - 2026-11-04

Existing `/` -> HomePage -> home/composition/HomeEntranceMotion (`children,className?`) and home-entrance-scenes retain all fourteen home section owners/consumers. The owner-requested visibility adjustment changes only the viewport entry line (85% desktop / 90% mobile) and local timeline pacing/easing; prepared states, loader handoff, interaction/cancellation, data and natural geometry remain. Shared SectionReveal/control timings are unchanged. Status: implemented; human appearance review and existing content/service dependencies remain. [Paths, timing and verification](../qa/homepage-motion-visibility-2026-11-04.md).

## Public controls follow-up · 2026-11-04

Owner references replace Double Cut + Panel with `Button`/`ButtonLink` (`@/components/ui/button`) `appearance="cut", cutVariant?: "line" | "soft"` (default line), preserving existing intent/size/inverse/fullWidth/loading/native props. Line uses an extending underline; soft uses an inset accent. Both have white-ink inverse styles for plum and reduced-motion feedback. HOME-05 uses soft; home catalog links, identity, commerce, detail and `/preview/components` reuse the canonical family. The preview shows both versions and inverse/interaction states.

`public-shell/mobile-navigation.tsx` and `page-wipe-transition.tsx` keep the native menu open through navigation, release its scroll lock at start, cover it with the existing curtain in the top layer, and close at the completion event. During reveal the still-open menu is visually suppressed under the curtain; destination focus is restored at completion. No additional loading surface or delay.

`catalog/components/catalog-experience.tsx` remains the persistent `/courses` and `/mini-courses` owner (no props). Optimistic kind selection immediately starts one simultaneous 360ms panel/height transition; Next still owns URL, metadata and history. Generic SectionReveal defers to this owner. Interrupted poses, reduced motion and resize settle cleanly. HOME-08 `MiniCourseExplorer` keeps the existing CourseCard/OfferCarousel, removes the requested certificate label and aligns the remaining format note with the catalog link in a wrapping toolbar. No service, route or product policy changes.

Status: implemented and browser-verified; human visual approval, physical Safari testing and existing real-catalog/service readiness remain. [Reference scope, root causes and verification](../qa/public-controls-followup-2026-11-04.md).

## Catalog switcher flash correction · 2026-11-04

`CatalogExperience` (`src/features/catalog/components/catalog-experience.tsx`, no props; persistent CatalogPage consumer on `/courses` and `/mini-courses`) replaces the overlapping transparent panel transition with two opaque adjacent surfaces driven by one progress tween. The scoped GSAP controller persists across kind updates; a plain layout effect redirects it, preserving current position on rapid reversal instead of reverting/rebuilding DOM tweens. Duration remains 360ms, with coordinated power2.inOut translation/height. CSS ownership remains `catalog-experience.module.css`; no new shared component or route. Optimistic selection, URL/filter/history ownership, inert panels and natural settled height remain. Resize/live reduced motion settle; observers/listeners/tween/styles clean up on unmount. Status: verified in optimized browser builds; human visual review and physical Safari remain unverified. [Cause and frame regression evidence](../qa/catalog-switcher-flash-2026-11-04.md).
