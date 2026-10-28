# FilterControls

Generated; canonical: [filter-controls.json](../registry/filter-controls.json). Stable ID: filter-controls. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: primitive. Priority: P1.

## description

Render accessible selection and reset controls; parent owns query state and catalog policy.

## purpose

Render accessible selection and reset controls; parent owns query state and catalog policy.

## ownership

ui

## implementationPath

src/components/ui/filter-controls.tsx

## requiredData

Accessible label, value/action and parent-supplied applicable state. Domain data remains outside the primitive.

## interactions

Keyboard and pointer activation; visible focus; no action on decorative elements; parent owns side effects.

## states

Default, focus-visible, hover, active, disabled with explanation; pending/error/success when applicable.

## responsive

Keyboard and pointer operable at every width; minimum 44px actions; wrap long Russian labels; no horizontal overflow. Exact geometry and variants require component reference review. No inherited hero layout. 1440×900, 390×844 and 360px verification required.

## variants

Unspecified — human review required.

## openQuestions

OQ-009, OQ-017, OQ-018, OQ-088, PA-01, OQ-025, OQ-026, OQ-027, OQ-028, OQ-053, PA-09
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [courses / courses--directions](../../section-planning/pages/courses.json): Render accessible selection and reset controls; parent owns query state and catalog policy.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [mini-courses / mini-courses--directions](../../section-planning/pages/mini-courses.json): Render accessible selection and reset controls; parent owns query state and catalog policy.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [packages / packages--configuration](../../section-planning/pages/packages.json): Render accessible selection and reset controls; parent owns query state and catalog policy.. Evidence revision 3; current 3; Phase 2 / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
