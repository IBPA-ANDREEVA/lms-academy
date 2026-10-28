# LMS frontend design context

Russian-first beauty education. Public discovery uses restrained editorial composition; forms and protected workspaces use quiet functional layouts. Product facts and release scope override decorative references. Read [design guidance](docs/design/README.md), [decisions](docs/design/DECISIONS.md), and the [frontend registry](docs/architecture/frontend-components.md).

Tokens: `docs/design/SYSTEM.md` → `src/app/globals.css` → component CSS modules. Manrope is functional type; Unbounded is short display type, opt-in only. Both are self-hosted through `next/font/local` from `src/assets/fonts`, with their original OFL licenses. No Geist, Arial, synthetic weights, dark-mode auto-recoloring, or third-party font requests.

Container widths and the three button families follow the preserved owner-edited definitions in the registry. Header geometry follows the image supplied in this chat on 2026-10-28 (desktop, dropdown, sticky, tablet and mobile states). The rounded header and pill account action are scoped exceptions, not global geometry. Footer follows the final dark, undecorated direction; all unsupported content is omitted. Other component styles are bounded token-based proposals, not approved designs.

The homepage currently contains the real shared shell and a catalog-unavailable state. It is not the final hero or homepage. No approved brand asset, production photography, catalog, prices, auth, payment or legal documents were invented. Only published routes enter navigation. Implementation status and remaining work live in `docs/architecture/frontend-*.md`.

Future work: user supplies a visual reference and exact target → inspect registry and existing code → implement in the actual page/feature → verify behavior and screenshots → update registry. The user subsequently authorized `/preview/components` as a lightweight live preview of shared implementations; no reference store or editor is restored. QA screenshots are verification artifacts, not a new reference-management system.

Preview layout: quiet Russian component index and vertically separated examples using existing tokens. It has no separate visual reference; framing is a bounded functional proposal, while the embedded components keep their existing designs.
