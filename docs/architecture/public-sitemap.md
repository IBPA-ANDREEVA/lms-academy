# Public website sitemap

LA02 · Refined after review · 2026-10-26 · Accepted architecture baseline; no implementation or product-policy approval implied.

This proposal separates public discovery, purchase, and account access from protected learning. MVP exposes Russian course and mini-course discovery, cart, checkout, account recovery, and legal documents. Packages and English arrive in Phase 2; reviews and public certificate verification in Phase 3. Start in USA needs an explicit release decision.

Read alongside [page structure](./public-page-structure.md), [user flows](./public-user-flows.md), and [review questions](./public-open-questions.md).

## Architecture at a glance

- **Discovery:** `/`, `/courses`, `/courses/[slug]`, `/mini-courses` and `/mini-courses/[slug]` serve public browsing. Keep one canonical detail URL per product; category navigation uses catalog query filters, not extra landing pages.
- **Commerce:** `/cart` → `/checkout` → `/checkout/result` is the shared purchase path. Guest purchase remains available. The result page requires authorized checkout context; only authoritative payment confirmation grants purchased access.
- **Identity and protected workspace:** login, registration, verification and recovery have a focused shell and preserve safe continuation. `/account` and `/account/courses/[enrollmentId]` are proposed protected handoffs, separate from public product URLs; every protected resource requires server authorization.
- **Phases:** RU discovery, commerce, email/password identity and four legal pages are MVP. Packages, promos and English are Phase 2; reviews, contextual recommendations, social login and public certificate verification are Phase 3. `/start-in-usa` remains a proposed standalone purchase route with **release TBD**, independent of the Phase 2 package schedule.
- **Homepage:** Hero → Course Discovery → Packages (Phase 2) → Mini-courses → Start in USA (release TBD) → Footer is the core commercial sequence. Category navigation and “How Learning Works” may be added or integrated during visual design. Section arrangements are design recommendations, not immutable implementation requirements; unreleased sections and links stay absent.
- **Review now:** settle locale URL policy and the literal protected namespace before route implementation (PA-02/PA-03). Retain the existing catalog split and conditional Start in USA route. Product policies remain in the decision register for their dependent implementation phases; they do not block acceptance of this sitemap.

## Evidence and authority

| Source | Evidence used |
| --- | --- |
| [Product requirements](../product/requirements.md) | Product types, catalog fields, identity, purchase, legal agreements, certificate behavior |
| [Release scope](../product/mvp.md) | MVP / Phase 2 / Phase 3 boundaries; pending scope corrections remain pending |
| [Product decision register](../product/open-questions.md) | Policies that this proposal cannot settle |
| Original technical specification in `docs/references/ТЗ_онлайн_академия_и_личные_кабинеты.docx` | Sections 2–3: catalog and guest account creation after payment; sections 7–8: legal pages, verification, phases |
| Original five-page PDF in `docs/references/Онлайн_академия_дизайн_платформы.pdf` | Pages 1–2: navigation, category filters, cards, packages, mini-courses, Start in USA and footer; pages 3–5: protected workspace handoffs |
| [Architecture](./overview.md), [modules](./modules.md), [ADR-0001](../decisions/0001-modular-monolith.md) | Thin routes, module ownership, server authorization and payment authority |
| [Direction](../design/DIRECTION.md), [system](../design/SYSTEM.md), [screens](../design/SCREENS.md), [components](../design/COMPONENTS.md), [QA](../design/QA.md), [icons](../design/icons/USAGE.md) | Functional hierarchy, accessibility, Russian-first content, selective design signatures |
| [Reference register](../design/references/INDEX.md) and actual reference images | Inspected existing approved/rejected directories; folder names alone do not establish approval scope |
| Local LMS Vault at `/Users/ivanmakovetskyi/Ivan's Vault/Projects/LMS` | Full Project Plan, phase plans, Roadmap, Dashboard, Timeline, epic/task maps and acceptance records; especially LA02–LA14, PM01–PM16, INF15, ST02, ST10 and QA03–QA09 |

The repository documentation and accessible local Vault constitute the available LMS Academy Docs for this review. No separately identified external document or approved legal text was supplied. Vault dates are planning targets, not release promises. Business rules follow the original specification; release allocation follows the repository scope; visual mockups do not advance later features into MVP.

**Labels:** **Requirement** means documented behavior; **Recommendation** means the proposed IA/interaction arrangement; **Open** means approval or missing information blocks a final choice. All URL spellings, query keys, anchors, section ordering, and shell assignments below are recommendations, including those serving required MVP functionality.

## Original draft inspection baseline

The observations below record the first draft's inspection. This refinement changes documentation only; it does not claim a new visual inspection of the source attachments or reference assets.

- The only implemented page is `src/app/page.tsx` at `/`, still the Next.js starter. `src/app/layout.tsx` uses starter metadata, Geist and `lang="en"`; `globals.css` contains starter styling. There are no implemented academy navigation components, auth screens, cart, checkout, product pages, or protected dashboards.
- `src/features` has the seven module placeholders: catalog, identity, commerce, learning, assignments, certificates, notifications. Shared UI, lib, database/schema, API and E2E directories are placeholders. No working commerce or identity integration exists.
- Root configuration is Next.js 16.4.3, React 19.3, TypeScript, Tailwind and pnpm. Installed Next.js route-group and internationalization guides were consulted for URL/layout recommendations; this task changes none of those files.
- Public assets include the existing functional icon collection; `src/app/fonts/Angry.otf` exists. Typography conflicts with AGENTS.md/DIRECTION/README references to Unbounded. Resolve before styling, not by silently picking one.
- Reference images exist despite INDEX.md saying none exist. Six tracked screenshot references and five pre-existing untracked concepts sit under `approved`; rejected examples/contact sheets also exist. Their visual content was inspected as reference evidence, not adopted as product scope. No contact form, metrics, or reviews become MVP requirements from screenshots.
- Initial tracked diff was clean. The five initially untracked reference images were preserved. Additional untracked reference images appeared during the task and were left untouched; the visual inspection above describes the initial snapshot, not those later additions. Only the four LA02 Markdown files are authored by this task.

## Hierarchical sitemap

```text
/                                        MVP homepage
├── courses                              MVP main-course catalog
│   └── [slug]                           MVP main/advanced course detail
├── mini-courses                         MVP mini-course catalog
│   └── [slug]                           MVP mini-course detail
├── packages                             Phase 2 package catalog / selection
│   └── [slug]                           Phase 2 package detail
├── start-in-usa                          Proposed route; phase unresolved
├── cart                                 MVP selected products
├── checkout                             MVP buyer, agreements, payment
│   └── result                           MVP purchase status / confirmation
├── login                                MVP sign-in
├── register                             MVP optional standalone registration
├── verify-email                         MVP verification and resend states
├── forgot-password                      MVP recovery request
├── reset-password                       MVP password reset via secure link
├── offer                                MVP public offer
├── privacy                              MVP privacy policy
├── refunds                              MVP refund policy
├── license-disclaimer                   MVP professional-license disclaimer
└── certificates
    └── verify
        └── [verificationId]             Phase 3 public QR target

Protected handoffs (outside public sitemap; proposed namespace):
/account                                 authorized workspace entry
/account/courses/[enrollmentId]           purchased learning, not public detail
```

No `/certificates` or `/certificates/verify` directory/listing page is implied by this hierarchy. No public student/name search is proposed. Generic not-found and service-error states are route outcomes, not extra sitemap pages.

## Route table

Shells: **Public** = discovery header/footer; **Transaction** = focused commerce shell; **Identity** = focused authentication shell; **Legal** = readable policy within public shell; **Verification** = minimal public trust shell.

| Proposed route | Purpose / principal onward destination | Phase and basis | Access / shell |
| --- | --- | --- | --- |
| `/` | Explain learning formats and lead to `/courses` | MVP; public-site scope, LA05 | Public |
| `/courses` | Filter main/advanced courses and open `/courses/[slug]` | MVP; catalog requirements, LA06 | Public |
| `/courses/[slug]` | Assess course, preview and add to cart | MVP; course records, LA07 | Public |
| `/mini-courses` | Find recorded-only products and their details | MVP behavior; separate listing is IA recommendation | Public |
| `/mini-courses/[slug]` | Assess mini-course and add to cart | MVP; LA07, completion requirements | Public |
| `/packages` | Compare/select eligible package configurations | Phase 2; LA12, PM14 | Public |
| `/packages/[slug]` | Review composition, fixed price, savings; add to cart | Phase 2 behavior; detail route recommended | Public |
| `/start-in-usa` | Explain module; standalone or package purchase when approved | Proposed standalone purchase route; release TBD (PA-04), not assigned to MVP or Phase 2 | Public |
| `/cart` | Review selections, remove items, continue to `/checkout` | MVP; LA08, PM05; upgrades/promos Phase 2 | Guest or signed-in cart owner / Transaction |
| `/checkout` | Buyer details, legal consent, authoritative total, card payment | MVP; PM04–PM08 | Guest or signed-in buyer / Transaction |
| `/checkout/result` | Read verified payment/fulfillment status, enter `/account` | MVP required outcomes; single route recommended | Authorized buyer/checkout context / Transaction |
| `/login` | Authenticate and resume allowed destination | MVP; PM01 | Public entry / Identity |
| `/register` | Voluntary registration, then verification | MVP; PM01, PM03 | Public entry / Identity |
| `/verify-email` | Verification, sent, expired and resend states | MVP; PM03 | Secure token/session as appropriate / Identity |
| `/forgot-password` | Request recovery email | MVP; PM03 | Public entry / Identity |
| `/reset-password` | Set password using valid recovery proof | MVP; PM03 | Valid token required for mutation / Identity |
| `/offer` | Read approved sale terms | MVP; legal requirements, LA10 | Legal |
| `/privacy` | Read approved processing/privacy policy | MVP; legal requirements, LA10 | Legal |
| `/refunds` | Read approved refund conditions/contact procedure | MVP; legal requirements, LA10 | Legal |
| `/license-disclaimer` | Understand certificate does not license practice | MVP; legal requirements, LA10 | Legal |
| `/certificates/verify/[verificationId]` | Verify issuance/status and approved public fields | Phase 3; INF15, certificate trust scope | No login; minimal approved disclosure / Verification |

Transaction pages are public-facing entry surfaces, not publicly readable order records. A query parameter or order number alone must not authorize order disclosure. Payment-provider callbacks, logout actions, media endpoints and reset-token processing endpoints are not navigation pages; their contracts are deferred to implementation/provider decisions.

### Filters, slugs, and language URLs

**Retained architecture:** `/courses` lists main/advanced courses; `/mini-courses` is a distinct view over shared catalog data/components. Cross-link the two. This keeps curator-supported and recorded-only learning clear without creating duplicated product detail URLs. PA-01 retains this split; launch taxonomy and filter details remain implementation decisions.

Use query state such as `/courses?direction=<directionSlug>&language=ru&level=beginner`; this is a URL pattern, not a finalized taxonomy. Direction tabs and direction filters control the same field. Preserve filters and browser Back position. No dedicated direction pages, price filter, search page, comparison tool, or sort controls are required by the sources. Add only after an inventory-driven need is approved.

Maintain one canonical detail URL per product, with stable slugs and redirects for renamed published slugs. Do not infer actual slugs from example course titles. Invalid filters should be explained and removable; unknown products return a useful not-found state.

**Phase 2 recommendation, subject to PA-02:** retain unprefixed RU routes and add `/en` plus the same paths (for example `/en/courses`, `/en/checkout`, `/en/offer`). English versions inherit each route's phase and access restrictions; an English certificate route therefore remains Phase 3. No `/ru` duplicate is proposed. Resolve locale routing before implementation; no routing library is selected. Interface language never changes purchased product identity, course-language availability, cart currency, or payment status.

Index published discovery/detail/legal pages when approved. Recommend excluding cart, checkout/result, identity pages, filter combinations and verification records from search indexing; public verification also needs anti-enumeration controls. Indexing is not access control.

## Global navigation

| Surface | MVP | Later / conditional |
| --- | --- | --- |
| Desktop header | Brand → `/`; «Курсы» → `/courses`; «Мини-курсы» → `/mini-courses`; «Корзина» with server-backed count → `/cart`; «Войти» → `/login` | Phase 2 inserts «Пакеты» → `/packages`; «Старт в США» → `/start-in-usa` only once approved/published; RU/EN control when translations ship |
| Signed-in header | «Личный кабинет» → `/account`, replacing «Войти»; cart stays available | Role menu uses authorized role contexts, not duplicated accounts; role destinations need workspace planning |
| Mobile header/menu | Brand, visible cart, labeled menu toggle; menu contains the same course and account destinations | Same phase rules as desktop; no hover-only nested menus or public learning bottom bar |
| Footer | Brand → `/`; courses and mini-courses; all four legal routes; accurate issuer/disclaimer and approved contact channel if supplied | Add packages/Start in USA only when available; no invented social links, address, accreditation, or newsletter form |
| Checkout shell | Brand → `/`; explicit «Назад в корзину» → `/cart`; sign-in option preserving checkout; all legal links | No promotional header additions during payment |
| Identity shell | Brand → `/`; login/register/recovery cross-links preserving safe continuation; legal links | Social login Phase 3 only |
| Language switcher | No enabled EN option while only RU exists; course language remains visible separately | RU/EN labels, equivalent-page navigation preserving cart/filter context; explicit missing-translation behavior, PA-02 |

Account entry must respect a validated continuation first, then a permitted role context. Recommend student dashboard for a student-only user and purchase continuation into student context for a multi-role buyer. Default multi-role choice remains OQ-013. Logout is an action returning to `/`; it does not authorize sharing the prior user's cart with another user.

## Shared layouts and ownership

**Recommendation:** one common root layout with nested public, transaction, identity and workspace shells. Route groups can organize shells but do not add URL segments or create authorization. In particular, `(student)/courses/[id]` would collide with the public `/courses/[slug]` pattern: the existing example in modules.md is illustrative, not an adopted route. Reserve a literal `/account` namespace for protected learning (PA-03).

Catalog owns listings, course/mini-course/package content and offer projections. Commerce owns cart, checkout and result state; Identity owns authentication and account resolution; Learning owns dashboard handoff and entitlements; Certificates owns public verification; Notifications owns receipt/access delivery. Generic controls may be shared, but a shared shell must not become a domain-logic layer. Legal presentation/version ownership needs agreement between content operations and Commerce's consent record.

## Sections instead of unnecessary pages

- Homepage course discovery is a compact introduction; the dedicated catalog owns exhaustive filtering. Optional category navigation may be integrated into discovery or added during visual design. Its links lead to filtered catalog URLs, not six empty landing pages.
- Trainer profile, curriculum, preview, later reviews, and pricing belong on product detail pages. Do not create trainer directories, standalone curriculum/review pages, or a public lesson route for a preview.
- “How Learning Works” may be added to the homepage or integrated into other sections during visual design; it is not a mandatory separate section. An interactive demo remains an explicitly unapproved design proposal. Prefer `/#learning-preview` if approved, without a separate `/demo` route.
- Packages merit dedicated pages once selectable configurations and detailed terms exist. Keep configuration within `/packages`/detail, not a separate builder route.
- Keep `/start-in-usa` as a proposed standalone purchase route with release TBD (PA-04). Omit its live navigation until publication is approved; an approved informational homepage section is an option, not a sale commitment. Phase 2 packages do not settle the standalone release.
- About, FAQ, contact forms, blog, newsletter, wishlist, public certificate search and self-service refund application routes have no confirmed requirement. Use existing page sections/approved footer contact details where sufficient; propose new routes separately.

## Review gates

The [review register](./public-open-questions.md) limits current route decisions to **locale URL policy (PA-02)** and **the protected namespace (PA-03)**. The catalog split is retained (PA-01); Start in USA's release remains open and blocks only its publication/navigation (PA-04), not MVP public architecture.

Guest identity, cart reconciliation, payment authorization, legal/pricing rules, support and pending scope corrections remain MVP implementation or launch dependencies. Packages/promotions/localization policies belong to Phase 2; review/verification policies belong to Phase 3; section composition and visual evidence belong to design work. Preserve all existing records in the [product decision register](../product/open-questions.md) and the deferred PA notes. This refinement does not mark any OQ as decided or waive a feature's release prerequisites.
