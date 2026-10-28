# Coverage and unresolved scope

Inspected baseline: commit `808c6bf` after the owner's branch update. Working tree was clean before this task's implementation. All current product, architecture and design indexes/decisions were inspected; the two retained reference images were opened. The updated branch supersedes the earlier incomplete design snapshot.

## Page and screen boundaries

The 21 public sitemap entries are represented, plus the two proposed protected handoffs `/account` and `/account/courses/[enrollmentId]`. `/` is the sole existing product route and remains starter content. No other product URL is described as confirmed. The public sitemap explicitly labels URL spelling as a recommendation despite acceptance of its architecture baseline.

The remaining records represent documented protected capabilities and conditional surfaces. Their decomposition into independently reviewable screens is a **planning proposal**, not approval for 60 distinct URLs. For example, role context may be a menu, the assignment screen may sit within a lesson, order detail may be a panel, certificate access may be within a course, and administration may combine list/detail/edit views. These choices remain editable at the structure stage.

| Source area | Planning coverage |
| --- | --- |
| Public sitemap and page structure | Home; main/advanced catalog and detail; mini catalog/detail; packages/catalog configuration and detail; Start in USA; cart/checkout/result; five identity pages; four legal documents; public QR verification |
| Student learning / certificates | Dashboard; purchased course; lesson/playback/materials; homework, revisions and feedback; certificate eligibility/download |
| Student Phase 2/3 completion | Course messaging; support countdown as a section; profile; purchase history/receipts; media-language controls as a lesson section; recommendations as a dashboard section; post-course review screen |
| Trainer-curator | Dashboard/review queue; review detail; own courses; draft course/lesson editor; course messages; accruals/payout history; later SLA and voice sections |
| Manager | Attributed sales/orders; leads and recoverable carts; personal codes/referral; evidence-backed manual enrollment; commission statement/reconciliation |
| MVP administration | Users/roles; audit. Access-support and refund/revocation screens are conditional on the unresolved operational substitute and pending MVP scope-correction approvals |
| Full administration | Directions; courses/mini-courses and publication; lessons/materials/order; packages; orders/refunds/manual-evidence/access inspection; promos; curator assignments/quality; rates; certificate templates and registry; payouts/export; reports; Phase 3 review moderation and revocation/QR section |
| Multi-role and notifications | Required role-context surface without an approved URL. Notification-preferences surface is conditional only: OQ-069/070 ask whether/how it exists; no standalone page is claimed as required |

Supplementary local Vault inspection: task inventory for all eight epics, especially ST01–ST18, TR01–TR11, MG01–MG08, AD01–AD17, public/identity tasks and infrastructure. AD04 confirms the minimal role/assignment/audit surface; ST11 confirms later messages/countdown/profile/languages/recommendations. Portable source references in JSON point to repository requirements and release allocations, not machine-specific Vault paths. No schedule or original example price/rate becomes a product promise.

## Capabilities that do not create extra pages

- English is a Phase 2 localization of each eligible surface, with Phase 3 pages still Phase 3. PA-02 leaves URL policy unresolved; no duplicate `/en` tree is invented.
- Pending/success/failure/cancelled payment are states of one result screen, not separate thank-you/error routes.
- Secure guest activation reuses identity/recovery surfaces only if approved; token purpose/account matching remain open. No new activation URL is invented.
- Category selection uses catalog filter state. Trainer biography, curriculum, public preview, reviews and recommendations stay within relevant pages. No trainer directory, public lesson/demo route, standalone recommendation page or package-builder URL.
- Private PDF/material delivery, video grants, payment callbacks, logout and notification delivery are actions/endpoints, not navigation pages.
- Loading, empty, not-found, unauthorized, expired-access and service-error results are explicit section/screen states, not invented sitemap routes.
- No source-backed standalone about, blog, wishlist, contact form, certificate search, self-service refund request or customer helpdesk page was found. These are not added.

## Decisions still needed

Page-level issue IDs are visible in the editor with excerpts from the current registers. Structure approval does not decide them.

- PA-02/03: locale URL policy and literal protected namespace; OQ-013: multi-role defaults.
- PA-04/OQ-019: Start in USA release, offer, completion and access behavior.
- OQ-010/085 and pending scope corrections: exact safe MVP operational screens versus documented substitutes, support expiry and refund revocation allocation.
- OQ-001/007/029/031/032: payment provider, actual legal text, cap interpretation, authoritative states and guest account matching.
- OQ-003/004/021/042/048/049: access clocks, upload policy, completion/unlocking and post-expiry homework lifecycle.
- OQ-011/012/015: trainer/curator separation, assignments and permitted student data.
- OQ-025–028/034–041/058–067: later package, promotion, attribution, refund, leads and financial policies.
- OQ-051–057/071–077: certificate identity/privacy/reissue, reviews, recommendations and reporting definitions.
- OQ-069/070: notification preferences/push surface is unresolved, not a promised standalone settings page.
- OD-001–013: final brand/copy, licensed photography, mobile hero, all non-hero references and component styling remain unapproved. No component references are created here.

Current source information is sufficient for draft hierarchies, not for final screen dimensions or production content. Exact academy identity, launch catalog, prices, trainer credentials, final legal text, providers and most visual references are missing. The editor uses functional Manrope and selected neutral/plum tokens; its layout is a bounded proposal awaiting review. Existing hero references are not applied to the editor.

## Approval gate

Review every page, including later/conditional records; exclude or restructure sections as appropriate and retain the underlying required content. Approvals certify only the saved structure revision. Component identification, ownership extraction, reference collection, real component implementation and `/dev/components` belong to a separately authorized task after this gate.
