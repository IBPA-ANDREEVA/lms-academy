# Public page structure

LA02 · Refined after review · 2026-10-26.

Use the [sitemap](./public-sitemap.md) for route/phase definitions and evidence, [flows](./public-user-flows.md) for transitions, and [questions](./public-open-questions.md) for current route decisions and deferred implementation dependencies. **Content requirements** below derive from product/scope documents unless marked proposed. **Section order, CTA wording, anchors and interaction arrangement are design recommendations**, not immutable implementation requirements or approved visual designs. Russian labels are reference copy for review, not final marketing/legal text.

Each sequence illustrates a recommended top-to-bottom arrangement; visual design may combine or reposition sections while preserving required content, destinations and phase boundaries. All public discovery pages begin with the Public header and end with the Public footer defined in the sitemap. Transaction, Identity, Legal and Verification shells use their stated header/footer variants. Those shared elements are part of every sequence, including when abbreviated below.

## Shared sections and interaction contract

| Shared element | Content / behavior | Use |
| --- | --- | --- |
| Public header/mobile menu/footer | Phase-aware navigation, account entry, cart; legal links and disclaimer | All discovery pages; legal pages |
| Breadcrumbs/back link | Home → collection → product; preserve filtered return context when available | Product pages; cart has explicit continue-shopping link |
| Product card | Real title/image, direction/type, level, trainer, available languages, support format, price, applicable lesson/duration facts; title/image → canonical detail; «В корзину» adds eligible product | Home, catalogs; package variant for composition/savings |
| Product facts and trainer profile | Approved metadata, photo and credentials; no implied accreditation | Course/mini-course detail; included-product summaries |
| Curriculum | Ordered public lesson titles/descriptions; accessible expansion, no protected lesson playback/download links | Course and mini-course detail; module if approved |
| Preview player | Approved public preview, labeled controls and loading/error feedback | Product detail, optional approved hero preview |
| Purchase panel | Server offer, current eligibility, price/currency, access/support terms, cart action, refund/disclaimer links | All sellable product details |
| Cart lines / order summary | Consistent product identity, selected language/version if relevant, server totals and validation | Cart, checkout, authorized result |
| Consent block | Approved version links, explicit unselected acknowledgements and text validation | Checkout; final evidence belongs to current payment attempt |
| Form / status feedback | Persistent labels, field errors plus summary, submission state, retry/recovery actions | Auth, checkout, verification/status |
| Policy article | Approved title, issuer, effective version/date and full readable text | Four legal pages |
| Later review/recommendation sections | Only approved real reviews; recommendation policy and eligibility | Phase 3 product/home placements, no standalone routes |

Adding a product keeps the visitor's browsing context and announces success with «Перейти в корзину» → `/cart`; errors preserve context. Once already in cart, recommend «В корзине» → `/cart` rather than silently increasing quantity. Do not invent seat quantities, gift purchases, repurchase rights, or package overlap policy. Known active ownership should point to authorized learning and explain the purchase state; expired ownership requires a decided repurchase rule.

Every data-driven page needs loading, empty, not-found where relevant, and recoverable error presentation. A loading placeholder must not look like an actual price or product. Preserve non-sensitive input on retry; never keep payment secrets. Use text with status colors and icons, semantic headings, visible focus and keyboard-operable controls. Never publish a mandatory disclosure placeholder or enabled button whose destination is absent.

## Home `/` — MVP with later sections

Purpose: explain the academy's learning formats and help the visitor choose a relevant product.

### Core commercial structure

**Hero → Course Discovery → Packages (Phase 2) → Mini-courses → Start in USA (release TBD) → Footer.** The shared Public header precedes this sequence. This is the recommended commercial hierarchy for visual design, not a fixed component-by-component implementation contract. Omit unreleased sections rather than leaving placeholders: the MVP core is Hero → Course Discovery → Mini-courses → Footer.

| Order | Section and content | Actions / destinations | Phase |
| --- | --- | --- | --- |
| 1 | Hero: approved academy identity, concise audience/value statement, actual learning format and image or approved working preview | Primary «Выбрать курс» → `/courses`; secondary «Мини-курсы» → `/mini-courses`. Phase 2 may replace secondary with «Посмотреть пакеты» → `/packages` | MVP; no unsupported outcome, license or QR claim |
| 2 | Course Discovery: small selection of prepared launch courses, key buying facts | Titles → `/courses/[slug]`; card add action; «Все курсы» → `/courses` | MVP; editorial selection, not a personalized recommendation engine |
| 3 | Packages: approved 2/3/6-direction offers or configuration entry, included module, real fixed price/savings | «Посмотреть пакеты» → `/packages`; offer → `/packages/[slug]` | Phase 2; absent in MVP |
| 4 | Mini-courses: recorded-only, no curator/homework review, certificate after mandatory lesson completion and administrator review/manual issuance (PD-010) | Detail → `/mini-courses/[slug]`; add to cart; «Все мини-курсы» → `/mini-courses` | MVP |
| 5 | Start in USA: sanitation, safety, promotion and client-base development; accurate inclusion/standalone explanation | «О модуле» → `/start-in-usa` only when route ships; package link only when published | Proposed standalone purchase route; release TBD (PA-04); absent until approved for publication |
| 6 | Public footer, including full legal navigation | `/offer`, `/privacy`, `/refunds`, `/license-disclaimer` | MVP |

### Optional design sections and integrations

These have no fixed numbered slot in the core structure. Category navigation and “How Learning Works” may be added as sections or integrated into the hero/discovery/product explanations during visual design; neither requires a separate page.

| Design option | Content / destinations | Scope boundary |
| --- | --- | --- |
| Category navigation | Published directions → `/courses?direction=<directionSlug>`; use the same taxonomy as catalog filters | May be included or integrated in MVP design; confirm actual business-selected ready inventory under PD-009 and taxonomy under OQ-017; no engineering minimum course count. This does not remove required catalog filtering or require a separate homepage category block. |
| How Learning Works | Explain recorded lessons, required practice, review and completion for supported courses; distinguish mini-courses. Links → `/courses`, `/license-disclaimer` | Static explanation may be included or integrated in MVP design. An interactive sample at `/#learning-preview` remains a separate unapproved proposal (PA-13), isolated from real learning records. |
| Real moderated reviews / relevant products | Approved content and canonical product links | Phase 3 only; optional placement does not promote the feature into MVP. Omit empty marketing blocks. |

Shared: header/footer, product cards, optional direction navigation/format explanation, later package summaries. Empty featured selection should fall back to available catalog navigation; empty whole catalog needs an honest unavailable state without buy CTAs. Preview failure must leave course navigation usable. Do not show fake testimonials, course counts, placeholder prices or a nonfunctional play icon. Mobile follows the chosen logical reading order, with wrapped category labels, compact course samples and no forced carousel. Keep course discovery prominent when integrating optional sections.

## Course catalog `/courses` — MVP

Purpose: compare main and advanced courses by documented buying criteria.

1. Public header.
2. H1 and concise scope; secondary link «Мини-курсы без куратора» → `/mini-courses`; packages link in Phase 2.
3. Category navigation: «Все» and published directions; selection updates `direction` on this route.
4. Language and level controls, selected filters, reset action and actual result count. Language means course availability, not interface locale. Level labels follow approved metadata, including licensed-practitioner eligibility. Do not add a price slider from an illustrative wireframe price area.
5. Results using shared course cards. Primary path is title/image → `/courses/[slug]`; secondary add-to-cart action is available when sale/eligibility allows. «Сбросить фильтры» removes query state. Additional pagination/load-more is proposed only if launch inventory needs it.
6. Public footer.

Shared: direction navigation, filter controls, result feedback, course cards. States: initial loading; filter update; no matches with reset; no published courses; failed load with retry; stale/unavailable card offer with clear message and refresh. Invalid query values must not strand the visitor. Back from detail restores filters. Mobile may use an accessible filter panel with Apply/Reset, announced result count and focus restoration; direction controls cannot depend on hover or clipped Cyrillic text. No dedicated category page is needed.

## Course detail `/courses/[slug]` — MVP; reviews later

Purpose: make course suitability, teaching, curriculum, terms and price clear before purchase.

1. Public header.
2. Breadcrumbs → `/`, `/courses` (or preserved filtered catalog).
3. Title and course facts: direction, beginner/advanced level, intended audience, available languages, duration, lesson count if real, supported learning format; summary price and primary «В корзину». Secondary «Смотреть превью» → `#preview`. State advanced-course eligibility plainly without inventing proof requirements.
4. Trainer: name, photo, approved credentials and relevant biography. Keep inline; no invented trainer route or assumption trainer and assigned curator are identical.
5. Description and learning outcomes from approved content; prerequisites, required materials, configured support/access terms, completion basis and disclaimer. No guaranteed employment/licensure claims. Do not publish provisional three-month access or a universal support start date as fact.
6. Curriculum `#curriculum`: ordered lessons and approved descriptions; expansion is in-page. Public outlines do not grant access to lessons or downloadable paid materials.
7. Preview `#preview`: working approved public video, available captions/language labels, fallback if unavailable. The interactive learning demo is a separate proposal, not synonymous with required preview video.
8. Reviews `#reviews`: Phase 3 only, real published moderated reviews/rating under approved rules. LA07's “reviews placeholder” is a template seam, not an MVP testimonial or empty ratings widget.
9. Purchase and terms `#enroll`: authoritative amount/currency, product/language details, support versus recording access, relevant materials/fees, completion certificate explanation. Primary add action; then cart link. Secondary `/refunds` and `/license-disclaimer`; offer link `/offer`. Later eligible package link → `/packages/[slug]`, with no forced replacement.
10. Public footer.

Shared: product facts, trainer, curriculum, preview, purchase panel, later reviews. Unknown/unpublished slug → not-found with catalog link; unavailable sale → explanation and catalog return; actual active owner → authorized `/account/courses/[enrollmentId]` when available. Pending price/eligibility disables payment-related actions with reason. Preview failure supports retry without hiding curriculum. Mobile places price/CTA near facts and repeats the same offer state at the end; any sticky action must not cover content or legal text. Long titles and lesson outlines wrap naturally.

## Mini-course catalog `/mini-courses` — MVP

Purpose: distinguish short recorded learning from supported courses.

1. Public header.
2. H1 and format explanation: recorded content, no curator/homework review, certificate eligibility after all mandatory lessons complete under the approved rule, followed by administrator review/manual issuance (PD-010).
3. Direction, available language and applicable level filters using catalog controls; hide meaningless metadata controls rather than assign fictitious levels (PA-01/OQ-088).
4. Mini-course cards with factual title, trainer, duration/languages, direction, price; primary title → `/mini-courses/[slug]`, secondary add action. Use real inventory, not source sample names/prices as production products.
5. «Курсы с куратором» → `/courses`.
6. Public footer.

Shared: catalog filters/results/cards. Same no-match/reset, empty inventory, loading and retry behavior as `/courses`. Mobile follows the catalog filter pattern. A separate listing is recommended for navigational clarity, while data/components remain shared.

## Mini-course detail `/mini-courses/[slug]` — MVP

Purpose: evaluate and buy recorded-only learning without implying personal support.

1. Public header and breadcrumb → `/mini-courses`.
2. Title, direction, language, level if applicable, duration, price, recorded-only label; primary add action; secondary preview anchor.
3. Trainer profile and approved credentials.
4. Outcomes, description, prerequisites, recording access terms; explicit absence of curator/homework review; certificate completion rule and `/license-disclaimer` link.
5. Ordered curriculum with public outlines.
6. Public preview video.
7. Real moderated reviews only in Phase 3.
8. Purchase panel; «В корзину» then `/cart`; secondary `/courses` for supported learning and `/refunds` for terms.
9. Public footer.

Reuse course-detail components with type-specific content; suppress support timers and homework promises. States and mobile order match course detail. Certificate eligibility depends on OQ-021 mandatory-lesson completion; PD-010 then requires administrator evidence review/manual issuance. A purchase does not immediately award a certificate.

## Packages `/packages` — Phase 2

Purpose: compare/select approved bundles with transparent composition and savings.

1. Public header.
2. H1 and package explanation; secondary «Отдельные курсы» → `/courses`.
3. Approved size/configuration choices (source examples 2/3/6 directions plus Start in USA); actual products, eligible options and available languages. Selection stays on this route. Do not imply arbitrary buyer-created combinations until PA-09/OQ-025 is decided.
4. Offer comparison: included courses/module, fixed package price, current comparable separate total and savings from the server. Primary «Подробнее» → `/packages/[slug]`, preserving a validated configuration if configuration is supported. Do not invent a popular/best-value badge.
5. Per-course support, access and completion explanation; legal links.
6. Public footer.

Shared: package selector/summary, product facts, price/savings, legal links. States: loading offers, no published packages → `/courses`, invalid configuration with explanation, price refresh, ownership overlap requiring decided policy. Mobile stacks comparisons and keeps included content visible; no wide matrix requiring horizontal scrolling. No separate `/packages/build` page.

## Package detail `/packages/[slug]` — Phase 2

Purpose: understand exactly what the bundle buys before adding it.

1. Public header and breadcrumb → `/packages`.
2. Name, size/configuration, fixed price and savings; primary add action, secondary «Состав пакета» → `#included`.
3. Included products `#included`: course identities, language, level, trainer and format; each title → canonical course/mini-course detail; Start in USA → its route if published.
4. Per-product outcomes/curriculum summary and individual-detail links; preserve package selection on return.
5. Per-course support and access, prerequisites/eligibility, certificate rules. Do not promise a single package certificate (OQ-053).
6. Itemized separate-price comparison, fixed package total and savings, ownership/overlap disclosure under approved rules; primary add then `/cart`; secondary `/packages` and legal links.
7. Public footer.

Shared: package summary, included-product list, purchase panel. States: nonexistent/unpublished package, no-longer-sellable component, invalid configuration, stale pricing, prior ownership, retry. Never silently swap courses or remove cart lines. Mobile keeps inclusion and price together in reading order; savings must be understandable without color alone.

## Start in USA `/start-in-usa` — proposed standalone purchase route, release TBD

Purpose: explain the documented module and its standalone/package purchase options. PDF p. 2 explicitly supports both; no release task establishes its standalone launch phase. Preserve the proposed standalone purchase route with release TBD (PA-04); Phase 2 packages do not assign this route to Phase 2.

1. Public header and breadcrumb → `/`.
2. Title, audience, approved description and actual format/language/duration metadata.
3. Topics: sanitation, safety, promotion, client-base development; approved outcomes without implying license qualification.
4. Trainer/content-author information and ordered module outline/preview when supplied. These are recommended content fields, not evidence that assets already exist.
5. Access and completion explanation; S1 says no curator. Certificate/homework/access rules need approval, so do not borrow main-course/mini-course rules automatically.
6. Standalone server-priced offer when approved for sale: primary «В корзину» then `/cart`; secondary «Пакеты с модулем» → `/packages` only when packages are published (Phase 2). If informational-only publication is separately approved, state the approved availability/inclusion arrangement and link only to a published offer; this does not replace the proposed standalone purchase route with a package-only decision. Include `/license-disclaimer` and `/refunds` links.
7. Public footer.

Shared: product facts, topic list, purchase panel. Missing price/terms/content blocks sale, not an invented free or waitlist offer. Before route release omit inbound navigation. If informational-only publication is approved, it must clearly disclose availability and avoid disabled purchase dead ends. Mobile follows topic and offer order; no separate module category page.

## Cart `/cart` — MVP; upgrades/promos Phase 2

Purpose: confirm selected products and reach payment with an accurate total.

1. Transaction header; «Продолжить выбор» → `/courses`.
2. H1 and selected-item count.
3. Product lines: type/title → canonical detail, applicable version/language, current price, package components when enabled, remove action. No unsupported quantity selector.
4. Phase 2 eligible package recommendation: explain old selections, replacement contents, extra products, old/new totals and savings. Secondary detail link → `/packages/[slug]`; proposed explicit «Заменить на пакет» changes lines only after approval/confirmation under OQ-027. No automatic replacement.
5. Phase 2 promo input: Apply/Remove updates this cart's server calculation; accepted discount or actionable invalid/expired/ineligible/limit feedback. Do not show in MVP.
6. Summary: subtotal, approved discounts, all applicable mandatory fees/taxes/materials, final amount/currency. Label unresolved calculation errors; do not assume tax-free or universally USD settlement from the cap.
7. Primary «Перейти к оплате» → `/checkout`; short disclosure that final agreements are at checkout; legal links. Secondary continue-shopping → `/courses`.
8. Transaction legal footer.

Shared: cart lines, server summary, later package/promo controls. Empty cart: explanation and course/mini-course links; no enabled checkout. States: loading/repricing, remove failure, changed price requiring review, withdrawn product, eligibility/ownership conflict, cart restoration failure with retry. Don't silently drop paid-access conflicts or substitute products. Mobile shows item details, summary and CTA in order; an optional sticky total cannot conceal line errors.

## Checkout `/checkout` — MVP

Purpose: supply buyer identity, review legal/payment terms and pay once.

1. Transaction header with `/cart` back link.
2. Checkout title and compact selected-product summary, with «Изменить корзину» → `/cart`.
3. Buyer identity: signed-in account or guest details; prominent optional «Уже есть аккаунт? Войти» → `/login?next=/checkout`. Guest path remains possible; do not force standalone registration. Exact additional name/address/phone fields depend on payment, legal and certificate decisions. Show why required fields are collected.
4. Final price breakdown and currency. Phase 2 shows applied promo and eligible discount; recommend editing promo in cart rather than duplicating independently stored promo forms. Server validates current offer, eligibility and USD 2,500 program/package cap according to approved interpretation.
5. Required explicit acknowledgment of all four documents: `/offer`, `/privacy`, `/refunds`, `/license-disclaimer` (PD-006). Recommend distinct unchecked acknowledgements for clarity; no marketing opt-in is implied. Retain immutable published versions and acceptance timestamps/user/order references. Review links preserve checkout state and do not count as acceptance.
6. Embedded Stripe Payment Element (PD-002); final payable amount visible before primary «Оплатить [сумма]». Submission validates buyer/consent/offer and creates a safe payment attempt. Cards, Apple Pay, Google Pay and Klarna are eligibility-dependent; Klarna installments are for eligible one-time purchases. USD pricing/charges/payouts; subscriptions are excluded.
7. Payment progress/error area; provider return → `/checkout/result`; secondary back to `/cart` before payment. Do not restart payment while status is unknown.
8. Transaction legal footer and approved support contact when available.

Shared: buyer form, cart summary, legal acknowledgements, payment status. States: empty cart → recover to `/cart`; validation/unchecked agreements; price/legal-version change requiring renewed review; cap or eligibility rejection; expired session with preserved cart; unavailable provider; duplicate click; payment processing; payment cancellation/failure. Embedded Payment Element is approved; verification timing remains open. Required approved legal documents missing in the selected language block checkout (PD-006). Mobile never hides terms or final price behind a collapsed summary; preserve input and focus after external payment/app return.

## Purchase confirmation `/checkout/result` — MVP

Purpose: communicate the server-confirmed outcome and safely hand the buyer into learning.

1. Transaction header.
2. Authoritative state heading: pending verification, payment confirmed/fulfillment pending, ready, failed, cancelled, or unable to load. A browser success parameter is not evidence.
3. Authorized order summary: purchased products, amount/currency and safe receipt reference once available. Unknown or unauthorized context reveals no buyer/order data.
4. State-specific primary action: pending → recheck existing attempt; ready with authenticated buyer → `/account`; ready guest → secure access/activation instruction then `/account`; failed/cancelled → `/checkout` only after server confirms safe retry. No second payment CTA during unknown/pending status.
5. Receipt/access email explanation, masked destination only when authorized, delivery delay/retry information. Delayed email does not reverse a successful purchase; authenticated entitled users can still enter learning. Guest recovery follows PA-05/PA-12.
6. Secondary `/courses`; approved support channel for stalled fulfillment or delivery.
7. Transaction legal footer.

Shared: status panel, order summary, authenticated handoff. Refresh/back/duplicate return must display the same attempt, never create another purchase. Missing context → safe login with continuation or cart/catalog recovery, not a fabricated success. Mobile foregrounds status and next step, not recommendations. This route handles all outcomes; no separate thank-you, pending and failed pages are needed.

## Identity pages — MVP

Each uses: Identity header → title/instruction → form/status → related actions → legal footer. Forms have visible labels, accessible errors, submit/loading protection and safe continuation. All listed mutations occur server-side. Google/Apple buttons are absent until Phase 3.

| Route / purpose | Ordered content between title and footer | Primary CTA and outcome | Secondary destinations / states |
| --- | --- | --- | --- |
| `/login` / return to account or checkout | Email; password; validation; optional pending-purchase continuation explanation | «Войти» → validated `next`, otherwise `/account` with authorized role context | `/forgot-password`, `/register`; invalid credentials, unverified email → `/verify-email`, blocked/session errors; don't disclose account existence unnecessarily |
| `/register` / voluntary account creation | Explain account purpose; email/password and only approved required fields; privacy/terms links; validation | «Создать аккаунт» → `/verify-email`, retaining allowed continuation | `/login`; existing-email handling must follow OQ-032; submitting cannot grant paid access |
| `/verify-email` / verification lifecycle | Sent instruction or processing token; verified/invalid/expired/already-used state; masked destination if authorized; resend control | Valid proof → approved continuation or `/login` then continuation; resend acts in place | `/login`, corrected-email/restart path under approved policy; rate limit/delivery failure with retry; never promise verification alone enrolls a learner |
| `/forgot-password` / recovery request | Email input; neutral confirmation whether or not account exists | «Отправить ссылку» → sent state on this route | `/login`; invalid email, throttled/unavailable delivery; retain safe destination without exposing account status |
| `/reset-password` / restore credentials | Validate reset proof; new password and approved validation/confirmation controls | «Сохранить пароль» → success then `/login` with safe continuation (recommended) | Invalid/expired proof → `/forgot-password`; used-token handling; no paid access from reset alone |

Shared: identity forms, feedback, token-result panel, continuation handling. Mobile single-column forms must work with keyboard/password manager, long Russian labels and virtual keyboard. Do not collect the entire later student profile during MVP registration without a requirement. Secure guest account activation may reuse verification and password setup surfaces, but activation token purpose and password-reset purpose must remain distinct; no extra activation route is approved by this draft (PA-05).

## Legal pages — MVP

Purpose: let any visitor read the actual applicable terms, including while reviewing checkout. Four RU/EN documents are separate routes for stable linking, immutable published versions and direct consent references (PD-006). Administrators upload/version/publish after legal professional approval through Draft → Approved → Published. Notify affected students of changes; material changes require renewed acknowledgment at the next checkout, editorial changes notification only. Existing course access continues.

| Route | Top-to-bottom content after Public header | Primary / secondary links |
| --- | --- | --- |
| `/offer` | Title; issuer/effective version; contents anchors for long text; full lawyer-approved sale/access terms; approved contact procedure; related legal links; footer | Read/navigate anchors; explicit «Вернуться к оформлению» → `/checkout` only in valid checkout context; otherwise `/courses`; `/refunds`, `/license-disclaimer`, `/privacy` |
| `/privacy` | Title; issuer/effective version; contents; approved processing/retention/rights text and contact mechanism; related policies; footer | Reading/anchors; context return as above; `/offer`, `/refunds`, `/license-disclaimer` |
| `/refunds` | Title; issuer/effective version; contents; approved refund scope, conditions and actual request procedure/contact; related policies; footer | Approved request channel if supplied, not an invented refund form; checkout/catalog return; `/offer` |
| `/license-disclaimer` | Title; issuer/effective version; full approved statement on educational completion versus professional permission; related policies; footer | Checkout/catalog return; `/offer`, `/refunds` |

Shared: policy article, context-return link, legal navigation. Static content may not need a visible loading state; retrieval failure needs retry. Missing/unapproved required legal text blocks production payment; do not silently render blank documents or fallback to a different language. Mobile prioritizes readable text, heading structure and full-width links; avoid narrow multi-column legal text. Historic version publication/URLs remain a legal decision, while accepted versions must be retained in evidence.

## Certificate verification `/certificates/verify/[verificationId]` — Phase 3

Purpose: verify an issued certificate through a QR link without requiring the verifier to log in.

1. Minimal Verification header, academy identity → `/`.
2. Verification heading and authoritative valid/revoked/not-found status, with text independent of color.
3. Only approved public issuance fields: holder name, course, issue date and trainer as specified, subject to privacy decisions OQ-055/OQ-056. No email, progress, homework, contact details or default downloadable certificate file.
4. License disclaimer and `/license-disclaimer` link; published course link only if available, otherwise retain issuance title as text.
5. Secondary academy/catalog navigation → `/`, `/courses`; approved support contact if supplied.
6. Legal footer.

Shared: status panel, issuance summary, disclaimer. States: loading, unavailable service with retry, not found, revoked, superseded behavior pending policy. Failure to load must not be shown as invalid certification. Recommend opaque verification IDs, no public search/list, no search-engine indexing, and abuse controls. Mobile puts status before identity fields and supports long holder/course names. No login wall and no inferred professional license.

## Cross-page mobile and release review

Future implementation should check 1440×900, 768×1024 and 390×844 per [QA](../design/QA.md), plus content-driven breakpoints. Check Cyrillic wrapping, logical heading/focus order, keyboard menu/filter behavior, touch targets, visible cart/payment actions, legal readability, loading/error announcements and reduced motion. Verify RU/EN legal content under PD-006 for MVP; repeat full interface checks when Phase 2 translations ship. Missing translations must be explicit. Font/reference conflicts remain review items and no new visual system is approved here.

No browser UI was implemented or visually tested in LA02. The original draft records reference-image/wireframe inspection; this refinement does not repeat that inspection or establish responsive behavior, contrast or keyboard conformance in a running academy site.
