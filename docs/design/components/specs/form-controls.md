# FormControls

Generated; canonical: [form-controls.json](../registry/form-controls.json). Stable ID: form-controls. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: primitive. Priority: P0.

## description

Provide labeled inputs and field-level feedback; domain owns validation and consent semantics.

## purpose

Provide labeled inputs and field-level feedback; domain owns validation and consent semantics.

## ownership

ui

## implementationPath

src/components/ui/form-controls.tsx

## requiredData

Accessible label, value/action and parent-supplied applicable state. Domain data remains outside the primitive.

## interactions

Keyboard and pointer activation; visible focus; no action on decorative elements; parent owns side effects.

## states

Default, focus-visible, hover, active, disabled with explanation; pending/error/success when applicable.

## responsive

Keyboard and pointer operable at every width; minimum 44px actions; wrap long Russian labels; no horizontal overflow. Exact geometry and variants require component reference review. No inherited hero layout. 1440×900, 390×844 and 360px verification required.

## variants

Text/email/password/checkbox are primitive variants, not one universal business form.

## openQuestions

OQ-029, OQ-030, OQ-033, PA-06, PA-10, OQ-001, OQ-007, OQ-031, OQ-032, OQ-082, OQ-083, PA-05, PA-07, OQ-069, OQ-006, OQ-009, OQ-017, PA-04, PA-13, OD-003, OD-004, OD-005, OQ-013, OQ-016, OQ-051
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [cart / cart--promo](../../section-planning/pages/cart.json): Provide labeled inputs and field-level feedback; domain owns validation and consent semantics.. Evidence revision 3; current 3; Phase 2 / included. Approved structure only.
- [checkout / checkout--buyer](../../section-planning/pages/checkout.json): Provide labeled inputs and field-level feedback; domain owns validation and consent semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [checkout / checkout--consents](../../section-planning/pages/checkout.json): Provide labeled inputs and field-level feedback; domain owns validation and consent semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [forgot-password / forgot-password--form-status](../../section-planning/pages/forgot-password.json): Provide labeled inputs and field-level feedback; domain owns validation and consent semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [home / home--d75962b8-69c3-4010-92d2-6e7f8d7806f9](../../section-planning/pages/home.json): Provide labeled inputs and field-level feedback; domain owns validation and consent semantics.. Evidence revision 8; current 8; MVP / included. Approved structure only.
- [login / login--form-status](../../section-planning/pages/login.json): Provide labeled inputs and field-level feedback; domain owns validation and consent semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [register / register--form-status](../../section-planning/pages/register.json): Provide labeled inputs and field-level feedback; domain owns validation and consent semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [reset-password / reset-password--form-status](../../section-planning/pages/reset-password.json): Provide labeled inputs and field-level feedback; domain owns validation and consent semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [verify-email / verify-email--form-status](../../section-planning/pages/verify-email.json): Provide labeled inputs and field-level feedback; domain owns validation and consent semantics.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
