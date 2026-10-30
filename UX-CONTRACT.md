# Frontend behavior contract

Scope: shared public shell and reusable frontend controls. Sources: [requirements](docs/product/requirements.md), [release scope](docs/product/mvp.md), [sitemap](docs/architecture/public-sitemap.md), [open questions](docs/product/open-questions.md). No working auth, checkout, protected data or destructive production operations exist yet.

| Capability | Canonical owner | Contract |
| --- | --- | --- |
| Form | `src/components/ui/form-controls.tsx` | Real labels, associated hint/error/success, preserved native attributes, password masked by default. Consuming forms use noValidate, focus the first invalid field, preserve values and own validation/pending submission. |
| Select/Listbox | Native SelectField; catalog-local FilterDropdown | The neutral shared control keeps its OS popup. LA06's supplied filter reference requires owned popup geometry, so `src/features/catalog/sections/02-filtering/components/filter-dropdown.tsx` owns its catalog-only option surface, keyboard movement, Escape and focus return. |
| Scrollbar | `src/app/globals.css` | Visible, tokenized document-wide baseline, hover/active fallback, forced colors, stable document gutter. |
| Button | `src/components/ui/button.tsx` | Native action defaults to button, navigation uses ButtonLink, disabled/loading block repeated action, label and size remain stable. Feature owns outcome and permissions. |
| Navigation | `src/features/public-shell` | Caller supplies implemented/published destinations. Mobile native dialog contains focus, closes with Escape, restores trigger, locks background scrolling. Desktop native disclosure closes on Escape/outside interaction/navigation. |
| Feedback | FormControls / owning feature | Inline field errors and status text; no global toast or auth context created without a consumer. |

Russian is the active locale; English is later scope. Catalog categories are native links to caller-owned URLs; the LA06 filters own documented URL query state. CourseCard accepts server-provided facts, price label and action. It does not compute entitlement or start payments. Mini-course copy never implies curator support. Empty taxonomy is omitted; the page owns empty/error/loading results. The owner-requested example cards are visibly marked demonstrations and link only to their marked detail previews; they have no prices or purchase destinations and do not represent published catalog records.

Security remains server-owned per module contracts. UI hiding, course status, link publication, and disabled controls cannot grant or revoke access. Auth continuation, legal documents, checkout consent and certificate claims require authoritative decisions before their screens ship.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
| --- | --- | --- | --- | --- |
| Form | src/components/ui/form-controls.tsx | UX-CONTRACT.md | Labeled text, email, password, checkbox; native semantics | tests/frontend.browser.mjs |
| Select/Listbox | src/components/ui/form-controls.tsx | UX-CONTRACT.md | Native OS popup | tests/frontend.browser.mjs |
| Scrollbar | src/app/globals.css | docs/design/SYSTEM.md | Global visible baseline; forced-colors auto | tests/frontend.browser.mjs |


## LA09 cart review contract

Scope: user-authorized interactive commerce UI; authoritative business sources remain requirements (Cart, purchase, and payment), MVP, modules/Commerce and public-page-structure cart/checkout. Real commerce and legal approval remain unavailable.

- `commerce/CartProvider` owns one root-lifetime cart across header, cart and checkout. Only `NODE_ENV=development` enables demo mutations/restoration. `lms.la09.demo-cart.v1` stores a unique allowlisted array of fixture IDs, never price objects, buyer details, real products or orders. Production ignores it. This does not decide production cart lifetime or account merge policy.
- `CartPreview` is a nonmodal region with native buttons/links, no focus trap or backdrop. Hover bridge/delayed leave prevents accidental closure; Escape restores icon focus; outside interaction, focus exit and navigation dismiss it. Remove restores adjacent-control/surface focus; a root live region announces count changes.
- `CartItems` and `OrderSummary` share source/formatting across consumers. Demo amounts are explicitly nonpayable; missing tax/fee/quote data is never a fabricated zero or server result. Recalculation/unavailable/changed-price/error states disable checkout navigation until the demo state is reset/reviewed.
- Guest email uses TextField with local blur validation and no native validation bubbles or transmission. Existing AuthModal opens outside the email form, preserving email while open. It remains UI-only. No name/address/phone is required without an authoritative requirement.
- Consent is only shown at checkout. Missing approved documents leave three required controls unchecked and disabled; privacy is informational, not a fourth invented consent. No dead policy href or fabricated legal document is published. Payment remains unconditionally unavailable, including with all demo states edited.
- `/preview/components` reuses commerce components and the actual header preview. Verification: `tests/demo-cart.test.mjs`, `tests/commerce.browser.mjs` (development and `COMMERCE_PRODUCTION=1`), plus existing header/frontend suites.
