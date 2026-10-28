# Button

Generated; canonical: [button.json](../registry/button.json). Stable ID: button. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: primitive. Priority: P0.

## description

Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.

## purpose

Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.

## ownership

ui

## implementationPath

src/components/ui/button.tsx

## requiredData

Accessible label, value/action and parent-supplied applicable state. Domain data remains outside the primitive.

## interactions

Keyboard and pointer activation; visible focus; no action on decorative elements; parent owns side effects.

## states

Default, focus-visible, hover, active, disabled with explanation; pending/error/success when applicable.

## responsive

Keyboard and pointer operable at every width; minimum 44px actions; wrap long Russian labels; no horizontal overflow. Exact geometry and variants require component reference review. No inherited hero layout. 1440×900, 390×844 and 360px verification required.

## variants

Primary / secondary / destructive intent; link navigation uses anchor semantics.

## openQuestions

OQ-029, OQ-030, OQ-033, PA-06, PA-10, OQ-055, OQ-056, OQ-054, PA-15, OQ-031, OQ-032, OQ-069, OQ-080, PA-08, PA-12, OQ-001, OQ-007, OQ-082, OQ-083, PA-05, PA-07, OQ-003, OQ-009, OQ-018, OQ-021, OQ-024, OQ-050, OQ-017, OQ-088, PA-01, OQ-006, PA-04, PA-13, OD-003, OD-004, OD-005, OQ-008, OQ-037, OQ-013, OQ-016, OQ-025, OQ-026, OQ-028, OQ-053, OQ-027, PA-09, OQ-051, OQ-011, OQ-014, PA-03, OQ-019
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [cart / cart--lines](../../section-planning/pages/cart.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [cart / cart--upgrade](../../section-planning/pages/cart.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; Phase 2 / included. Approved structure only.
- [cart / cart--promo](../../section-planning/pages/cart.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; Phase 2 / included. Approved structure only.
- [checkout-result / checkout-result--next](../../section-planning/pages/checkout-result.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [checkout / checkout--buyer](../../section-planning/pages/checkout.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [checkout / checkout--consents](../../section-planning/pages/checkout.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [checkout / checkout--payment](../../section-planning/pages/checkout.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [course-detail / course-detail--purchase](../../section-planning/pages/course-detail.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [courses / courses--directions](../../section-planning/pages/courses.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [courses / courses--results](../../section-planning/pages/courses.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [forgot-password / forgot-password--form-status](../../section-planning/pages/forgot-password.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [forgot-password / forgot-password--recovery](../../section-planning/pages/forgot-password.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [home / home--hero](../../section-planning/pages/home.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 8; current 8; MVP / included. Approved structure only.
- [home / home--course-discovery](../../section-planning/pages/home.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 8; current 8; MVP / included. Approved structure only.
- [home / home--mini-discovery](../../section-planning/pages/home.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 8; current 8; MVP / included. Approved structure only.
- [home / home--d75962b8-69c3-4010-92d2-6e7f8d7806f9](../../section-planning/pages/home.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 8; current 8; MVP / included. Approved structure only.
- [license-disclaimer / license-disclaimer--return](../../section-planning/pages/license-disclaimer.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [login / login--form-status](../../section-planning/pages/login.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [login / login--recovery](../../section-planning/pages/login.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [login / login--social](../../section-planning/pages/login.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; Phase 3 / included. Approved structure only.
- [mini-courses / mini-courses--directions](../../section-planning/pages/mini-courses.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [mini-courses / mini-courses--results](../../section-planning/pages/mini-courses.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [mini-detail / mini-detail--purchase](../../section-planning/pages/mini-detail.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [offer / offer--return](../../section-planning/pages/offer.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [package-detail / package-detail--purchase](../../section-planning/pages/package-detail.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; Phase 2 / included. Approved structure only.
- [packages / packages--configuration](../../section-planning/pages/packages.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; Phase 2 / included. Approved structure only.
- [privacy / privacy--return](../../section-planning/pages/privacy.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [refunds / refunds--return](../../section-planning/pages/refunds.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [register / register--form-status](../../section-planning/pages/register.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [register / register--recovery](../../section-planning/pages/register.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [reset-password / reset-password--form-status](../../section-planning/pages/reset-password.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [reset-password / reset-password--recovery](../../section-planning/pages/reset-password.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [role-context / role-context--choice](../../section-planning/pages/role-context.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [verify-email / verify-email--form-status](../../section-planning/pages/verify-email.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [verify-email / verify-email--recovery](../../section-planning/pages/verify-email.json): Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
