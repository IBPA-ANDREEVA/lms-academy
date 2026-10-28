# Frontend behavior contract

Scope: shared public shell and reusable frontend controls. Sources: [requirements](docs/product/requirements.md), [release scope](docs/product/mvp.md), [sitemap](docs/architecture/public-sitemap.md), [open questions](docs/product/open-questions.md). No working auth, checkout, protected data or destructive production operations exist yet.

| Capability | Canonical owner | Contract |
| --- | --- | --- |
| Form | `src/components/ui/form-controls.tsx` | Real labels, associated hint/error/success, preserved native attributes, password masked by default. Consuming forms use noValidate, focus the first invalid field, preserve values and own validation/pending submission. |
| Select/Listbox | Native SelectField | OS-owned popup explicitly accepted for the current neutral control; use an authored primitive only when a supplied reference requires owned popup geometry. |
| Scrollbar | `src/app/globals.css` | Visible, tokenized document-wide baseline, hover/active fallback, forced colors, stable document gutter. |
| Button | `src/components/ui/button.tsx` | Native action defaults to button, navigation uses ButtonLink, disabled/loading block repeated action, label and size remain stable. Feature owns outcome and permissions. |
| Navigation | `src/features/public-shell` | Caller supplies implemented/published destinations. Mobile native dialog contains focus, closes with Escape, restores trigger, locks background scrolling. Desktop native disclosure closes on Escape/outside interaction/navigation. |
| Feedback | FormControls / owning feature | Inline field errors and status text; no global toast or auth context created without a consumer. |

Russian is the active locale; English is later scope. Catalog categories are native links to caller-owned URLs; no guessed query keys. CourseCard accepts server-provided facts, price label and action. It does not compute entitlement or start payments. Mini-course copy never implies curator support. Empty taxonomy is omitted; the page owns empty/error/loading results. No mock catalog reaches production.

Security remains server-owned per module contracts. UI hiding, course status, link publication, and disabled controls cannot grant or revoke access. Auth continuation, legal documents, checkout consent and certificate claims require authoritative decisions before their screens ship.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
| --- | --- | --- | --- | --- |
| Form | src/components/ui/form-controls.tsx | UX-CONTRACT.md | Labeled text, email, password, checkbox; native semantics | tests/frontend.browser.mjs |
| Select/Listbox | src/components/ui/form-controls.tsx | UX-CONTRACT.md | Native OS popup | tests/frontend.browser.mjs |
| Scrollbar | src/app/globals.css | docs/design/SYSTEM.md | Global visible baseline; forced-colors auto | tests/frontend.browser.mjs |
