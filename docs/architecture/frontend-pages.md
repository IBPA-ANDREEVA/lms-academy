# Frontend pages

Source-verified inventory, 2026-11-02; branch `refactor/landing`, HEAD `eb3665d1d6ec7441c462ba9ad7d20b6944d506f1`. Read this with [sections](frontend-sections.md), [shared components](frontend-components.md), and [backlog](frontend-backlog.md) before UI work. Eight route templates exist, resolving fourteen concrete page URLs with the current fixture data. Six are discovery/commerce templates, two are the homepage and review utility; production business integrations remain missing. Planned URL spellings remain subject to the sitemap and PA-02/PA-03; this registry does not approve routes or release policy. `—` means no implementation file exists, not an invitation to create a placeholder route.

| Route / proposal | Page / purpose | Implementation path | Status / phase |
| --- | --- | --- | --- |
| `/preview/components` | Canonical shared-component review utility | `src/app/preview/components/page.tsx` → `src/features/component-preview/component-preview-page.tsx` | WORKING review interactions with labeled DEMO data; noindex. Nine preview sections, in actual order below. Development commerce controls live here. No production transaction. |
| `None` | admin-access — Обеспечить безопасную поддержку запуска. | — | Not implemented; MVP |
| `None` | admin-assignments — Контролировать очередь и назначения. | — | Not implemented; MVP |
| `None` | admin-audit — Проверить необходимые операции запуска. | — | Not implemented; MVP |
| `None` | admin-certificates — Проверить выдачу и разрешённую поддержку. | — | Not implemented; MVP |
| `None` | admin-directions — Управлять таксономией без правки кода. | — | Not implemented; MVP |
| `None` | admin-lessons — Управлять содержанием и доступной последовательностью. | — | Not implemented; MVP |
| `None` | admin-orders — Проверить все разрешённые продажи. | — | Not implemented; MVP |
| `None` | admin-packages — Управлять утверждёнными наборами. | — | Not implemented; Phase 2 |
| `None` | admin-payouts — Сверить расчёты и зарегистрировать выплаты. | — | Not implemented; Phase 2 |
| `None` | admin-products — Управлять продуктами и продажей. | — | Not implemented; MVP |
| `None` | admin-promos — Настроить разрешённые скидки. | — | Not implemented; Phase 2 |
| `None` | admin-rates — Управлять утверждёнными финансовыми условиями. | — | Not implemented; Phase 2 |
| `None` | admin-refund — Зафиксировать подтверждённый возврат с audit и access reversal. | — | Not implemented; MVP |
| `None` | admin-reports — Анализировать согласованные финансовые и учебные показатели. | — | Not implemented; Phase 2 |
| `None` | admin-review-moderation — Публиковать только допустимые отзывы. | — | Not implemented; Phase 3 |
| `None` | admin-templates — Управлять утверждёнными RU/EN шаблонами. | — | Not implemented; MVP |
| `None` | admin-users — Поддержать доступ и роли запуска. | — | Not implemented; MVP |
| `/cart` | Review selections | `src/app/cart/page.tsx` → `src/features/commerce/cart-page.tsx` → `sections/cart-section.tsx` | DEMO: empty by default; populated only by development fixture selection restored from localStorage. Test controls exist only on `/preview/components`. Production ignores fixture storage; server cart missing. MVP. |
| `/certificates/verify/[verificationId]` | certificate-verification — Проверить выдачу по QR без публичного поиска. | — | Not implemented; Phase 3 |
| `/checkout/result` | checkout-result — Показать авторитетный результат и безопасный доступ. | — | Not implemented; MVP |
| `/checkout` | Buyer/agreements/payment availability | `src/app/checkout/page.tsx` → `src/features/commerce/checkout-page.tsx` → `sections/checkout-section.tsx` | DEMO: empty by default; development fixtures expose buyer/summary/three disabled acknowledgments/payment-unavailable UI. PD-006 fourth acknowledgment is missing. Payment/order/identity/legal integrations missing. MVP. |
| `/courses/[slug]` | Main-course detail | `src/app/(details)/courses/[slug]/page.tsx` → `src/features/course-detail/detail-page.tsx` | DEMO: four allowlisted example slugs; five sections render because trainer is absent. Curriculum component exists but receives no modules. Two disabled PurchasePanels; no price, purchase action or video. Unknown slug renders not-found UI. MVP content/integration missing. |
| `/courses` | Main-course catalog | `src/app/(catalog)/courses/page.tsx` (metadata, returns null); `(catalog)/layout.tsx` → `src/features/catalog/catalog-page.tsx` | DEMO: four fixture cards; working URL filtering/reset/history and detail navigation. `publishedCourses` is empty. Visible fixture badges have been removed by the recorded owner follow-up. MVP integration missing. |
| `/forgot-password` | forgot-password — Получить безопасную ссылку. | — | Standalone route not implemented; UI-only recovery view exists in the shared header modal; MVP backend pending |
| `/` | home — Discover the academy and learning formats | `src/app/page.tsx` → `src/features/home/home-page.tsx` | DEMO content and learning/offers interactions; working navigation/disclosure/carousel mechanics. HOME-02–11 order below. Packages Phase 2; reviews Phase 3; Start in USA release unresolved. Contact delivery missing. |
| `/license-disclaimer` | license-disclaimer — Прочесть действующую утверждённую версию. | — | Not implemented; MVP |
| `/login` | login — Войти и продолжить разрешённый сценарий. | — | Standalone route not implemented; UI-only login view exists in `src/features/identity/auth-modal.tsx`, opened by PublicHeader; MVP backend pending |
| `None` | partner-statement — Existing account finance section; Commerce attribution/ledger contracts; Full; pending references. | — | Planned only; supersedes manager-commission under PD-011; no implementation or new URL |
| `None` | admin-manual-sale — Admin commercial operations; separate authorized evidence workflow; Full; OQ-038/039. | — | Planned only; supersedes manager-enrollment under PD-011; no implementation or new URL |
| `None` | admin-leads — Admin/explicitly authorized operations; consent-gated records; Full; OQ-065/066/067. | — | Planned only; supersedes manager-leads under PD-011; no implementation or new URL |
| `None` | account-referrals — Existing trainer/curator/admin or other authorized account section; Full; no manager role. | — | Planned only; supersedes manager-promotions under PD-011; no implementation or new URL |
| `None` | account-attribution — Permitted own-attribution section or authorized admin view; Commerce owner; Full. | — | Planned only; supersedes manager-sales under PD-011; no implementation or new URL |
| `/mini-courses` | Recorded-only catalog | `src/app/(catalog)/mini-courses/page.tsx` (metadata, returns null); same catalog layout/page | DEMO: four fixture cards; working URL filtering and detail navigation. `publishedMiniCourses` is empty. MVP integration missing. |
| `/mini-courses/[slug]` | Recorded-only detail | `src/app/(details)/mini-courses/[slug]/page.tsx` → same DetailPage | DEMO: four example slugs; same five rendered sections and missing content, recorded-only/no-curator copy. Unknown slug renders not-found UI. MVP integration missing. |
| `None` | notification-preferences — Управлять уведомлениями только после утверждения настроек. | — | Not implemented; Conditional |
| `/offer` | offer — Прочесть действующую утверждённую версию. | — | Not implemented; MVP |
| `/packages/[slug]` | package-detail — Понять точный состав и итог покупки. | — | Not implemented; Phase 2 |
| `/packages` | packages — Сравнить разрешённые наборы без предположений о произвольной сборке. | — | Not implemented; Phase 2 |
| `/privacy` | privacy — Прочесть действующую утверждённую версию. | — | Not implemented; MVP |
| `/refunds` | refunds — Прочесть действующую утверждённую версию. | — | Not implemented; MVP |
| `/register` | register — Создать аккаунт без автоматического платного доступа. | — | Standalone route not implemented; UI-only registration view exists in the shared header modal; MVP backend pending |
| `/reset-password` | reset-password — Восстановить учётные данные. | — | Not implemented; MVP |
| `None` | role-context — Выбрать разрешённый рабочий контекст без нового аккаунта. | — | Not implemented; MVP |
| `/start-in-usa` | start-usa — Объяснить модуль, сохранив открытый вопрос публикации и продажи. | — | Not implemented; Unresolved |
| `None` | student-assignment — Отправить или исправить работу и прочесть отзыв. | — | Not implemented; MVP |
| `None` | student-certificates — Проверить завершение и скачать документ. | — | Not implemented; MVP |
| `/account/courses/[enrollmentId]` | student-course — Понять прогресс и перейти к доступному уроку. | — | Not implemented; MVP |
| `/account` | student-dashboard — Продолжить обучение и увидеть состояние работ. | — | Not implemented; MVP |
| `None` | student-lesson — Посмотреть разрешённый урок и выполнить практику. | — | Not implemented; MVP |
| `None` | student-messages — Обсудить обучение с назначенным куратором. | — | Not implemented; Phase 2 |
| `None` | student-profile — Изменить согласованные профильные данные. | — | Not implemented; Phase 2 |
| `None` | student-purchases — Прочесть собственную историю покупок. | — | Not implemented; Phase 2 |
| `None` | student-review — Оставить отзыв по утверждённым правилам. | — | Not implemented; Phase 3 |
| `None` | trainer-courses — Управлять своими черновиками. | — | Not implemented; MVP |
| `None` | trainer-editor — Подготовить материалы к согласованию. | — | Not implemented; MVP |
| `None` | trainer-finance — Проверить собственные начисления и выплаты. | — | Not implemented; Phase 2 |
| `None` | trainer-messages — Ответить назначенному ученику внутри платформы. | — | Not implemented; Phase 2 |
| `None` | trainer-queue — Найти назначенную работу для проверки. | — | Not implemented; MVP |
| `None` | trainer-review — Изучить работу и дать безопасное решение. | — | Not implemented; MVP |
| `/verify-email` | verify-email — Подтвердить владение адресом. | — | Not implemented; MVP |

Public navigation is maintained in `src/features/public-shell/navigation.ts`. Auth modal and commerce presentation exist; authentication/payment services, protected workspaces and legal document routes do not exist. Do not link to their proposed URLs until implemented and released. The existing project name is a working identity, not a final logo approval.


## Current rendered inventory · LAND01 audit, 2026-11-02

This section supersedes earlier implementation descriptions below. `WORKING` is a verified UI operation, not a claim of production business capability. `DEMO` is local/fixture behavior; `MISSING` has no implementation; `BROKEN` requires an observed failure; `NOT VERIFIED` lacks runtime evidence; `OUT OF SCOPE` is deferred. [Audit and verification limits](../qa/LAND01-public-site-audit-2026-11-02.md); [source/consumer evidence](../qa/evidence/LAND01-public-site-2026-11-02/source-inventory.json).

All routes inherit `src/app/layout.tsx`: local fonts + Russian document + skip link → CartProvider → PublicHeader → PublicMotion(children) → PublicSiteFooter. The footer is compact only for `/cart` and `/checkout`; the header is still the public header on both. No separate transaction or identity route shell exists. PageContainer is server-compatible and delegates optional `reveal` to the SectionReveal client island, while route/page compositions are Server Components except the component-preview page and client islands.

| Route | Rendered section order (excluding shared shell) | Local owners and data | Verified states / responsive behavior / missing dependencies |
| --- | --- | --- | --- |
| `/` | 02 Hero → seam → 03 About → seam → 04 Founder → seam → 05 LearningPreview → LearningOffersShowcase(06 Courses, 07 Packages, 08 MiniCourses, 09 StartUSA; one panel active) → 10 Reviews → seam → 11 Contact | `features/home/home-page.tsx`; all numbered sections are under `features/home/sections`. Supplied/static RU story copy, original `public/ibpa` photos, separate home fixtures, local learning/blob state, four blank review cards | Working navigation, disclosure, local demo steps, tabs, filters, carousels and package selection; no lesson playback, upload, curator review, testimonial service or contact delivery. Photo-first narrative stacking on mobile; horizontal nav/inner carousels; sticky offers group. MVP narrative/catalog/contact UI; packages Phase 2, reviews/recommendations Phase 3, StartUSA unresolved. |
| `/courses` | Introduction → Filtering → active CoursesSection | `features/catalog/catalog-page.tsx`, `components/catalog-experience.tsx`; `catalog-data.ts` has four examples and empty publication list | Working direction/language/level query filtering, no-match/reset, tab route switching and history. Same persisted layout for both catalog paths. Mobile hero photo precedes text; filters remain three narrow fields under format tabs. Published records, real counts/live announcements, sale actions and server query/error evidence missing. |
| `/mini-courses` | Same Introduction → same Filtering → active MiniCoursesSection | Same owner, four mini examples; Courses panel remains mounted/inert | Same UI behavior; compact cards, recorded-only facts. No real taxonomy/availability/trainer/price integration. |
| `/courses/[slug]`, `/mini-courses/[slug]` | 01 HeroPurchase → preview seam → 02 VideoPreview → 03 AboutCourse → 04 Curriculum → trainer seam → **05 Trainer omitted** → 06 PurchaseTerms | `features/course-detail/detail-page.tsx`; `detail-data.ts` derives only title/kind/direction/level/language from catalog examples | Five sections render for every current slug. No curriculum rows, no trainer, no price/description/outcomes/public video. Preview anchor and two disabled add controls; explicit unavailable video. Desktop split and overlapping panel; mobile stacked image/facts/purchase. `noindex,nofollow`; unknown slug fallback verified. Offer-state branches beyond unavailable and media-error retry NOT VERIFIED on real routes. |
| `/cart` | Back link/title → CartSection(CartFeedback → empty state **or** CartItems → OrderSummary → actions/caption) | `features/commerce/cart-page.tsx`, `sections/cart-section.tsx`; root CartProvider and allowlisted demo IDs | Empty, filled, removal, corrupt restoration, four fixture scenarios, shared preview and disabled transitions tested. Centered column; no quantities/promo/package upsell. Server persistence/quotes/eligibility missing. Production cart remains empty. |
| `/checkout` | Back link/title → CheckoutSection(CartFeedback → empty state **or** CheckoutBuyer → CheckoutAgreements → CheckoutPayment, plus OrderSummary aside) | `features/commerce/checkout-page.tsx`, `sections/checkout-*.tsx`; email memory-only, shared provider | Desktop form then summary columns; mobile summary visually precedes buyer, remains expanded. Guest email blur validation, optional AuthModal and disabled payment tested. Three unchecked disabled acknowledgments; fourth required privacy acknowledgment missing. No published legal versions/Stripe/order/result route. |
| `/preview/components` | Intro/index → Commerce → PublicHeader → Button → FormControls → CourseCard → CategoryNavigation → SectionHeading → PageContainer → PublicFooter(default then compact) | `features/component-preview/component-preview-page.tsx`; local demonstration state, canonical shared components | Working review utility. Root shell plus embedded header/footer examples intentionally coexist. Noindex; not linked from product nav. Single 539-line client owner is a refactoring candidate; not a missing feature. |

Concrete detail URLs (all rendered at 1440×900 and 390×844):
- `/courses/course-lashes`, `/courses/course-nails`, `/courses/course-lamination`, `/courses/course-brows`.
- `/mini-courses/mini-lashes`, `/mini-courses/mini-nails`, `/mini-courses/mini-brows`, `/mini-courses/mini-makeup`.

Unknown detail slugs use route-local `not-found.tsx` → `features/course-detail/components/detail-not-found.tsx`. `(details)/loading.tsx` and both group `error.tsx` files exist; their real loading/error/recovery lifecycle was not induced. Generic unknown paths use Next's default not-found surface; there is no custom root `not-found.tsx`.

AuthModal is a shared overlay, **not a ninth route**: `features/identity/auth-modal.tsx`, opened by PublicHeader and CheckoutBuyer. Login/Register/Forgot views retain local values while switching, reset on close, show unavailable notices on submit, and never create sessions/accounts/send mail. Registration includes name, surname, repeated password and birthdate; this does not establish approved production data requirements. Social controls are disabled Phase 3 affordances. Standalone auth/reset/verification routes are MISSING, not working alternatives to the modal.

The planned entries in the table above remain scope/backlog records, not additional implemented routes. Full English interface routes, packages routes, protected workspaces and legal/result routes are absent. No implementation acceptance or LAND01 subtask completion is inferred.

## Historical implementation notes (superseded by the source snapshot above)

### Homepage refinement — 2026-10-28

`/` continues to compose shared HOME-01/12 and numbered home-owned HOME-02–11. `home-page.tsx` now inserts shared decorative seams between the vertical sections and the state-preserving, natural-height 06–09 showcase. Hero is viewport-height; navigation, learning-stage motion, compact offer layouts and cross-section geometry are implemented within the existing release constraints. `/preview/components` reflects the revised Cut button and unavailable navigation entries. See the latest verification entry for browser evidence and remaining publication blockers.

## Planning ownership update · 2026-10-30

ADR-0002 preserves every existing frontend implementation and section order.
`src/features` owns UI; seven `src/server` domains own authoritative business
operations. No frontend files or routes changed in this restructuring. PD-011
replaces unimplemented manager-only surfaces with existing-account/admin sections;
these are capability/page identifiers, not approved URL spellings or visual references.
PD-009/010 MVP phase corrections above do not establish implementation.

Planned missing compositions: policy version management (`features/policies`, SALE003),
admin log viewer and student-request monitoring (`features/administration`, AD02;
OQ-090/091), notification center (`features/notifications`, NF03), certificate
review/manual issuance (`features/certificates`, CE02), course editors
(`features/course-authoring`, SITE010). Actual implementation path: none. Props and
consumers must be specified in each UI planning task; no speculative shared
component is created. Missing supplied references stay pending in explicit tasks.

## Public refinement · 2026-11-02

`/` retains `src/features/home/home-page.tsx` and all numbered owners; `/courses` and `/mini-courses` retain `src/features/catalog/catalog-page.tsx`. Updated RU content, six benefits, founder disclosure, staged learning demo, compact offers navigation, single reviews strip, catalog hero overlay/filters and shared card styling. `src/features/public-shell/public-motion.tsx` accepts `children` from the root layout for route fades alongside CSS section-heading entrances on existing public routes, with scoped cleanup and reduced motion. No new page/locale/backend is implied. See [scope and verification](../design/landing-refinement-2026-11-02.md); owner visual approval remains pending.

## Public polish follow-up · 2026-11-02

See [current implementation and verification](../design/public-polish-followup.md). Existing route/section owners remain. PublicHeader and HOME-06–09 now share an attached light navigation surface; HOME-03 CTA is removed; HOME-04 owns `components/founder-story.tsx` (`children`) with animated disclosure. Public fixture explanations are removed per explicit owner instruction, with unavailable actions preserved. PageContainer adds opt-in `reveal` for home narrative and detail sections; Button/ButtonLink retain their APIs with revised Cut motion, also visible in the canonical component preview. Missing real content/services and human visual review remain pending.

## LAND02 current implementation · 2026-11-02

[LAND02 implementation and reference contract](../qa/LAND02-public-site-refinement-2026-11-02.md) supersedes the affected LAND01 presentation descriptions above. `/` adds HOME-12 FAQ after Contact; shell footer retains its public-shell owner (SHELL-FOOTER; historical HOME-12 alias). No route added. Shared shell now has a compact 68px mobile row and native MobileNavigation drawer; no mobile rail. PublicMotion owns session-scoped first-entry drop motion only on eligible discovery/detail paths; functional/preview routes skip it. Mobile hero is content-height rather than viewport-height. Catalogs use compact mobile filter disclosure with selected labels and bounded popups. Both detail kinds retain five rendered sections with honest missing-program recovery and no empty outcomes row. Services/content publication and human visual approval remain missing.

LAND02 owner addition: canonical `components/ui/button.tsx` / `button.module.css` now implement Parallax Cut within the existing `appearance="cut"` API. Stable hit area, independent outline/slash/label/arrow/depth, fine-pointer hover, touch press, keyboard focus and reduced/disabled/loading safeguards. `component-preview/cut-button-preview.tsx` (no props), consumed by the existing Button preview section, demonstrates six requested states and existing variants without another route or shared button component. Full source consumers, state screenshots and real interaction checks are recorded in the [LAND02 report](../qa/LAND02-public-site-refinement-2026-11-02.md). Human visual review remains pending.

## LAND02 motion-only follow-up · 2026-11-02

No new routes or page owners. Root PublicMotion owns first eligible public-entry brand reveal, with cart/checkout/preview/utility exclusions; PageContainer and feature-owned controllers retain the existing hierarchy. See [canonical motion inventory](../design/MOTION.md) and [verification](../qa/LAND02-motion-implementation-2026-11-02.md). No-JS verification additionally exposes the existing detail-route streamed-loading fallback limitation; motion does not hide that content or establish routing compliance.

## Premium motion update · 2026-11-02 (D-020)

Routes, release scope and business data are unchanged. RootLayout still owns PublicMotion. Its new PageWipeTransition coordinates public-link prefetch/cover/commit/reveal using Next's router. The real detail loading entry now renders PublicRouteLoading; CircleLoader is cold-entry only and suppressed after Wipe owns navigation. Cart, checkout, preview, filters, catalog tab buttons, dialogs and hashes retain native/local flow. HomePage composes AcademyStory around existing HOME-03/04; HOME-06 has a large-screen-only 120px featured beat; HOME-06–09 retains its existing group ownership with a Carousel-style switch. `/preview/components` now has ten sections including actual SectionReveal/CircleLoader demonstrations. Props, paths, constraints and verification are in [MOTION.md](../design/MOTION.md) and the [report](../qa/premium-motion-2026-11-02.md). No browser implementation approval or backend completion is claimed.

## Current animation/mobile delta · 2026-11-03 (D-021)

This supersedes conflicting historical motion/mobile notes above. [Evidence and limits](../qa/animation-redesign-2026-11-03.md).

| Routes | Actual owner / consumers | Current behavior and status |
| --- | --- | --- |
| `/` | `features/home/home-page.tsx`, existing numbered section owners | Hero -> About -> Founder -> LearningPreview -> 06–09 offers -> Reviews -> **FAQ -> Contact**. Source folder numbers unchanged. Full-height mobile hero, photo-first narrative sections, fitting tabs, next-card swipe cue. Working UI; existing fixtures/services/publication blockers unchanged. |
| `/courses`, `/mini-courses` | Persistent `features/catalog/components/catalog-experience.tsx` | Bidirectional format animation, one active/inert panel, natural height and results alignment; filters/query state preserved. Compact minis stack their media above content, two mobile columns. No duplicate route implementation. |
| Detail routes | Existing `features/course-detail/detail-page.tsx` + public shell | Shared Cut and section motion preserved; anchor padding corrected. Unknown/unpublished states remain existing route-owned UI. |
| All public discovery routes | `features/public-shell/public-motion.tsx`, PageWipeTransition, SplashLoader, MobileNavigation | Same-page/cross-page hash transition, visible Activity-tree readiness, inactive-offer selection, interruption fallback, mobile menu choreography. Cart/checkout/preview remain outside route wipes. |
| `/preview/components` | Existing ComponentPreviewPage, CutButtonPreview, MotionPreview | Real Lift & Shift and Splash implementations, explicitly labeled demonstration states. No additional preview routes. |
## LAND03/LAND04 current override · 2026-11-03

This section supersedes earlier fixture-mode/metadata/branding descriptions for the affected routes. [Catalog contract](catalog-preview-contract.md), [SEO architecture](../seo/README.md), [verification](../qa/LAND03-04-implementation-2026-11-03.md).

| Actual route / owner | Current implementation and state | Missing work |
| --- | --- | --- |
| Root shell / `src/app/layout.tsx` | Server TEST_PREVIEW + CatalogResult → CatalogProvider → existing CartProvider/header/motion/footer; optional bottom-left PreviewControl. No NODE_ENV demo authorization. New supplied BrandLogo in every shell consumer. | Approved production domain/content; real catalog/Commerce adapters |
| `/`, home owners unchanged | HOME-06/08 use the same catalog projection as listings; HOME-07/09 fictional package/module previews explicitly gated. Production shows unavailable/empty information, no example product links. | Real published content; package/module release remains separate |
| `/courses`, `/mini-courses`, persistent CatalogPage | Existing shared filters/cards plus CatalogState; preview true uses browser-local labeled data, false uses server read result. No unconditional fallback arrays. | Actual source; Admin taxonomy/publication |
| Both product detail routes | Thin routes delegate to `features/course-detail/product-route.tsx` (`kind,slug`), use existing DetailPage. PreviewDetail resolves browser-local state, draft/deleted absent; production rejects demo namespace. Real metadata/schema only from approved published DTO. | Live product read/availability; real purchase actions remain disabled until Commerce integration |
| `/cart`, `/checkout` | Existing sections/rows/summary use preview catalog IDs and USD cents when enabled; otherwise no local demo data. Empty state retained. Checkout payment disabled. | Authoritative cart/quote/legal/payment/enrollment |
| `/preview/components` | Still sole component-review route, noindex; new local CatalogStatesPreview renders actual CatalogState. Shell demonstrates supplied BrandLogo; cards/commerce retain real shared implementations. | Human visual review |
| `/robots.txt`, `/sitemap.xml` | Next metadata routes, not UI pages; explicit static allowlist plus real publication filtering; no URLs without domain/in preview. | Live content invalidation when persistence arrives |

Auth/legal/private routes remain absent. Root metadata is default-noindex; explicit approved static discovery pages opt in only with SITE_URL and preview off. English alternates remain absent.
