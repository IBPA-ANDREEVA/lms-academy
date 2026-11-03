# LAND01 — Public-site UI/UX audit and architecture synchronization

## A. Audit context

- **Date:** November 2, 2026 (America/Los_Angeles).
- **Branch / HEAD:** `refactor/landing` / `eb3665d1d6ec7441c462ba9ad7d20b6944d506f1`.
- **Scope:** current local source and rendered application; audit/documentation only. No UI, test-source, product-policy, dependency, payment/authentication implementation, commit, push or deployment changes.
- **Initial tree:** 17 modified tracked documentation files and three untracked architecture/ADR documents already existed. Their changes were preserved; this task only edits the nine documentation files listed below and creates audit evidence. Snapshot hashes and the initial diff were captured before edits. Source files were clean at start and remain unchanged.
- **Runtime:** existing Next 16.4.3 development server at `http://localhost:3000`; an audit-owned production server at `http://localhost:3109` after `pnpm build`. Chrome through the already bundled Playwright runtime; no repository dependency installed. Node v22.23.1.
- **Route count:** **eight implemented page templates, fourteen concrete URLs**: `/`, `/courses`, `/mini-courses`, `/cart`, `/checkout`, `/preview/components`, four `/courses/<slug>` examples and four `/mini-courses/<slug>` examples. Auth is an overlay, not another route. Unknown-path outcomes are not counted as pages.
- **Viewports:** 1920×900, 1440×900, 1280×900, 1024×900, 768×900, 430×844, 390×844, 360×844, 320×844. Eight representative templates at all nine widths; every additional concrete detail slug at 1440×900 and 390×844. Ninety default/not-found route cases, including six unknown-path cases; 336 PNG screenshots across matrix, state and existing-suite runs. Whole-page captures were preceded by scrolling through the full page to trigger owned reveal animations; important sections and open states were captured separately.
- **Evidence:** [evidence index](evidence/LAND01-public-site-2026-11-02/README.md), [route matrix/text/fonts/network](evidence/LAND01-public-site-2026-11-02/route-matrix.json), [interactive probes](evidence/LAND01-public-site-2026-11-02/interactive-results.json), [follow-up measurements](evidence/LAND01-public-site-2026-11-02/followup-results.json), [touch/keyboard probes](evidence/LAND01-public-site-2026-11-02/extra-results.json), [storage/cross-tab probes](evidence/LAND01-public-site-2026-11-02/final-state-results.json), [exact source APIs and consumers](evidence/LAND01-public-site-2026-11-02/source-inventory.json). Screenshots preserve viewport width; full-page PNG height follows content. Some captures include Next's development indicator, which is not product UI.

### Sources and reference scope

Read AGENTS.md, current diff/config/scripts, all requested product/architecture/design documents, root DESIGN.md/UX-CONTRACT.md, the refinement/polish notes and source implementations. Installed Next guides for layouts/pages, Server/Client Components and error boundaries were checked; `retry` is supported by this installed version, so the detail boundary was not incorrectly flagged using older Next assumptions.

Product/approved decisions override older planned anatomy. The comparison uses D-001–D-017, SYSTEM/DIRECTION/QA and the owner-requested refinements recorded in `docs/design/{landing-refinement-2026-11-02,public-polish-followup}.md`. No new visual reference was attached to this audit. Historic retired/Windows clipboard images are not available at their recorded locations; no pixel-perfect comparison to those missing originals is claimed. The local newspaper image was opened and inspected as the actual catalog asset. Its raster wording is not approved product data or evidence of usage rights.

Borrowed relationships remain photo/type split, selective plum seams, Unbounded display/Manrope functional text, focused Cut controls and restrained transaction anatomy. Hero references do not authorize a catalog/detail redesign. The current hero uses a group portrait and wider photographic field, rather than the historic technique-photo/~40:60 starting relationship; current owner refinements are recorded proposals, with no approved browser implementation. Desktop-only cart/checkout references do not establish mobile approval. No redesign or approval has been inferred.

### Default page evidence

All additional widths and eight concrete detail examples are linked from the evidence index.

| Template | 1440×900 full page | 390×844 full page | Current state |
| --- | --- | --- | --- |
| `/` | [Desktop](evidence/LAND01-public-site-2026-11-02/home-1440.png) | [Mobile](evidence/LAND01-public-site-2026-11-02/home-390.png) | Narrative + local learning/offers demos; disabled contact |
| `/courses` | [Desktop](evidence/LAND01-public-site-2026-11-02/courses-1440.png) | [Mobile](evidence/LAND01-public-site-2026-11-02/courses-390.png) | Four examples, empty published source |
| `/mini-courses` | [Desktop](evidence/LAND01-public-site-2026-11-02/mini-courses-1440.png) | [Mobile](evidence/LAND01-public-site-2026-11-02/mini-courses-390.png) | Four examples, empty published source |
| `/courses/[slug]` | [Desktop](evidence/LAND01-public-site-2026-11-02/course-lashes-1440.png) | [Mobile](evidence/LAND01-public-site-2026-11-02/course-lashes-390.png) | Five rendered sections; no trainer/curriculum/video/offer |
| `/mini-courses/[slug]` | [Desktop](evidence/LAND01-public-site-2026-11-02/mini-lashes-1440.png) | [Mobile](evidence/LAND01-public-site-2026-11-02/mini-lashes-390.png) | Same anatomy; no curator |
| `/cart` | [Desktop empty](evidence/LAND01-public-site-2026-11-02/cart-empty-1440.png) | [Mobile empty](evidence/LAND01-public-site-2026-11-02/cart-empty-390.png) | Empty unless development fixtures explicitly selected |
| `/checkout` | [Desktop empty](evidence/LAND01-public-site-2026-11-02/checkout-empty-1440.png) | [Mobile empty](evidence/LAND01-public-site-2026-11-02/checkout-empty-390.png) | Empty; payment never enabled |
| `/preview/components` | [Desktop](evidence/LAND01-public-site-2026-11-02/component-preview-1440.png) | [Mobile](evidence/LAND01-public-site-2026-11-02/component-preview-390.png) | Nine canonical review sections; labeled demonstration data |

## B. Visual and interaction findings

Severity: **P0** blocks an approved production MVP capability; **P1** significantly impairs layout, content or interaction; **P2** is polish/maintainability. Later-phase service absence is not an MVP blocker. Findings are recommendations; none was implemented in product code.

| ID / severity | Route / viewport / owner | Problem and evidence | Suggested correction |
| --- | --- | --- | --- |
| **V-001 · P1** | Both detail kinds; 1024, 768, 390, 360, 320; course-detail VideoPreviewSection | Media intrinsic aspect-ratio/min-height sizing forces a wider grid; `DetailPage` clips it. At 768 the media right edge is ~945.5px; at 390/360/320 copy/media reach ~411.1px. Text is visibly cut despite `document.scrollWidth===innerWidth`. [Tablet](evidence/LAND01-public-site-2026-11-02/finding-detail-preview-1024.png), [mobile](evidence/LAND01-public-site-2026-11-02/course-lashes-390.png), route/follow-up geometry JSON. 430 fits the viewport, illustrating why a second mobile width matters. | Constrain media/grid children to available width, reconcile min-height with aspect ratio and allow text wrapping. Check actual content bounds, not only root overflow. Preserve composition. |
| **V-002 · P1** | `/`; 320; home FounderSection | Fixed nowrap heading line “КОТОРЫЙ СОЗДАЁТ” reaches x≈336px from x20 and clips under section overflow. [320 focused view](evidence/LAND01-public-site-2026-11-02/finding-founder-title-320.png). | Permit content-driven wrapping or a verified narrow type adjustment within existing Unbounded hierarchy. |
| **V-003 · P1** | `/`; 320; home LearningPreviewDemo | Placeholder min-height/aspect ratio produces a ~302px-wide block inside a much narrower demo body; right edge ~345px. Section overflow hides part of it. [320 focused view](evidence/LAND01-public-site-2026-11-02/finding-learning-media-320.png). | Keep media within its local frame; remove intrinsic-width pressure. Verify all three demo stages and local image previews. |
| **V-004 · P1** | Catalogs; narrow/mobile; catalog FilterDropdown | Open popup geometry is wider than its trigger; middle field can extend past the viewport. Default-state document-overflow tests miss open-state behavior. [Open language popup](evidence/LAND01-public-site-2026-11-02/finding-filter-Язык-390.png); at 390px document width becomes 400px; at 360 it becomes 390px, and at 320 ~377px. Exact measurements are in followup-results.json. | Add collision-aware placement/bounded width; retain catalog-local owner and accessible selection, test 320/360/390/430 plus tablet. |
| **V-005 · P1** | Auth overlay; 1440 and 390; identity AuthModal | Native modal traps focus, but body still scrolls: wheel outside dialog moved page `scrollY` 0→600 at both widths. Closing leaves the shifted page position. [Desktop](evidence/LAND01-public-site-2026-11-02/state-auth-background-scroll-1440.png), [mobile](evidence/LAND01-public-site-2026-11-02/state-auth-background-scroll-390.png), interactive-results.json. | Add owned scroll lock/restoration for open/close, Escape/backdrop/programmatic close/unmount; keep native dialog and input state. |
| **V-006 · P1** | Catalogs; desktop/mobile; FilterDropdown | Click-open leaves focus on trigger; Escape is only handled on the list, so it does not dismiss from that focus position. ArrowDown → option focus → Escape works. Source and extra-results.json record this distinction. [Focused open state](evidence/LAND01-public-site-2026-11-02/finding-filter-escape-390.png). | Handle Escape consistently at the root/trigger and restore focus; expose popup semantics. Do not replace working keyboard selection with a mouse-only control. |
| **V-007 · P1 (content readiness)** | All detail examples; all widths; course-detail | Empty “РЕЗУЛЬТАТЫ” row and an entirely empty curriculum column coexist with full-height editorial sections; trainer returns null. No factual program exists to evaluate. Preview copy says a program is available below. [Desktop](evidence/LAND01-public-site-2026-11-02/course-lashes-1440.png), [mobile](evidence/LAND01-public-site-2026-11-02/mini-lashes-390.png). | Supply approved content through Catalog readiness workflow before publication. Decide honest unavailable/omission treatment with the owner; do not manufacture modules, outcomes or trainers. |
| **V-008 · P2** | `/mini-courses`; 1440/1280; catalog CourseCard compact | Different title/meta wrapping puts arrow CTAs at different vertical positions in a single equal-height row. “В записи” repeats in adjacent lines. [Desktop](evidence/LAND01-public-site-2026-11-02/mini-courses-1440.png). | Align the action row independently of text length and remove redundant format wording at the owning card/content contract. |
| **V-009 · P2** | `/`; 390 filtered to one card; home CourseShowcase | Narrow layout retains two disabled arrows and a single dot when one filtered card fits. Desktop controls are correctly CSS-hidden; this is a narrow filtered-state polish issue. OfferCarousel already suppresses controls when all fit. [Filtered panel](evidence/LAND01-public-site-2026-11-02/finding-home-filtered-controls-390.png), extra-results.json. | Reuse existing home carousel visibility mechanics; avoid decorative controls. |
| **V-010 · P2 / release review** | `/`; all widths; home ReviewsCarousel | Four large empty quote cards occupy an entire marketing section; no separate recommendation content exists. No real testimonial is fabricated, but it is an unfinished public composition. [Desktop](evidence/LAND01-public-site-2026-11-02/home-1440.png), [mobile](evidence/LAND01-public-site-2026-11-02/state-reviews-next-390.png). | Keep real reviews Phase 3. Obtain release treatment for empty presentation; do not invent quotes or silently restore labels removed by the owner. |
| **V-011 · P2** | Header/catalog/reviews; ≤760; public-shell/catalog/home | Header rail targets measure 40px tall; reset 32px; review dots 36px; project SYSTEM target is 44×44px. Mobile filter type is 11px. Inline course-title text height is **not** a separate finding because its link overlay covers the card. [Mobile filters](evidence/LAND01-public-site-2026-11-02/courses-390.png), smallTargets in route-matrix.json. | Increase actual hit areas and verify readable labels without changing brand fonts. |
| **V-012 · P2** | Footer; all widths; public-shell | Footer login/register/legal titles look like navigation but are disabled spans and omit visible “Скоро” cues under the recorded owner direction. Header login does open the modal; footer login does not. [Footer](evidence/LAND01-public-site-2026-11-02/courses-390.png). | Connect identity/legal destinations when implemented; request treatment for unavailable entries consistent with owner direction. Never add dead legal hrefs. |
| **V-013 · P2** | Generic unknown route; 1440/390; app/public-shell | Next default 404 renders English “This page could not be found” inside a Russian shell. Detail not-found UI is Russian. [Mobile](evidence/LAND01-public-site-2026-11-02/generic-404-390.png). | A small app-owned Russian not-found surface can reuse existing shell/recovery pattern in a focused follow-up. |

### What holds together

The selected palette and Cyrillic local fonts render consistently. Default desktop grids, shared gutters, footer stacking, card link overlays, functional input focus rings and visible unavailable purchase states are present. Home narrative section order and shared seam ownership remain intact. Offers geometry does not move across panel changes; inactive panels are inert, active track heights match their panels. Measured sticky nav top equals the **bar** bottom: 74px at 1440, 112px at 390. The historical offers test compares to the whole header (84px at desktop) and incorrectly treats the intended 10px attachment as overlap.

No document-level horizontal overflow occurred in the 90 default/not-found cases. This is explicitly **not** a no-clipping result: V-001–004 cover hidden/interactive overflow. Native carousels/rail intentionally scroll internally. Whole-page/section/contact-sheet inspection covered all nine widths; source copy and focused captures were used for text/state detail. Full-page screenshots can include sticky chrome at capture scroll positions; viewport captures and measured geometry determine overlay findings.

## C. Russian copy, content and approval findings

No product copy was changed. Suggested wording is review material, not approved publication text. Repeated instances are grouped by source owner; full route text snapshots and state screenshots preserve the reviewed strings.

### Unambiguous editorial corrections (can be reviewed without inventing policy)

| ID | Current wording / source | Issue / suggestion | Priority |
| --- | --- | --- | --- |
| C-001 | “Предпросмотр файловрежим” — LearningPreviewDemo upload helper | Concatenated word/unfinished edit. Suggest “Предпросмотр фотографий” for the existing local image picker. [Evidence](evidence/LAND01-public-site-2026-11-02/state-learning-assignment-empty-1440.png). | P1 |
| C-002 | “Оплата … документы … документ недоступен”; public footer “Условия возврата”, preview “Политика возвратов”, checkout “Дисклеймер о лицензии”, footer “Правовая информация о сертификатах” | Same destination concepts use inconsistent labels. Choose one RU glossary with the approved legal titles; do not draft legal substance. | P2 |
| C-003 | Catalog “маникюр/брови/…” versus home “Маникюр/Брови/…” | Inconsistent title capitalization for the same example identities. Normalize display strings when real catalog records replace fixtures. | P2 |
| C-004 | “В записи” plus “В записи, без куратора и проверки работ” on mini cards | Repeated format fact increases wrapping and action misalignment. One concise recorded-only fact is enough. | P2 |
| C-005 | `/mini-courses` hero “Смотреть курсы” | Action scrolls to mini-course filters on that route; generic wording obscures current context. Suggest “Смотреть мини-курсы” for that kind if approved. | P2 |
| C-006 | Empty cart “Выберите обучение, к которому хотите вернуться” | Implies a previous relationship for a first visitor. Suggest a neutral course-selection instruction. | P2 |
| C-007 | Login/checkout/contact mix “Электронная почта”, “Email”, “email”; contact “Напишите ваш вопрос...” | Terminology/punctuation vary. Choose one functional label and ellipsis convention; preserve email examples as examples. Error punctuation should follow the same convention. | P2 |

### Product/content/legal review required

| ID | Observed content / approval boundary | Required action / owner |
| --- | --- | --- |
| C-008 | Academy “Все курсы на русском и английском языках или с субтитрами”; hero/about RU+EN claim. Current examples are RU only; full English interface is Phase 2; PD-009 permits either/both course languages. | Distinguish course-media availability from interface localization, and substantiate any “all courses” claim against actual published records. Owner-supplied copy provenance is recorded in the refinement note; this audit neither disproves nor independently verifies it. Catalog/Public Site. |
| C-009 | “Сертификат после завершения всех уроков” (HOME-08), “По окончании курса выдаётся сертификат” (benefits); detail certificate wording lacks administrator review/manual issuance. | Reconcile with PD-010: completion eligibility plus administrator evidence review/manual issuance for every type. Do not promise automatic issuance. Certificates/Catalog/Public Site. |
| C-010 | Main detail support/access copy says terms remain undecided, although PD-004 approves rules-page acknowledgment, 14 calendar days support and 3 calendar months access. | Integrate approved rule wording and actual product data; preserve OQ-048/049 exceptions. Do not invent starts at payment or fixed day-count months. Learning/Catalog. |
| C-011 | Founder/benefits claim presidency, championship wins, 100+ students, 500+ licensing assistance, 6m-ruble turnover, schools/locations, forum/editorial roles, consulting partnership and reciprocal IBPA discounts. | Current owner-provided wording is traceable to the refinement note, not independent launch evidence. Verify credentials, numbers, partnership/discount authorization, identities and imagery rights before publication; do not silently remove/rewrite owner-supplied facts. Public Site/content approval. |
| C-012 | Taxonomy promises “все направления”, pedicure/permanent makeup, while fixtures use six broader directions and divergent home IDs (`lashes` vs `lash-extensions`). | Align actual offering/taxonomy with approved publication data, without assuming a new category or minimum course count. Catalog. |
| C-013 | Detail preview “программа ниже остаётся доступной для просмотра”, but zero modules render; “Смотреть превью” scrolls to an unavailable-video block. | Use factual availability states or publish real program/preview. No fake play control/video; decorative fallback glyph is not an operable player. course-detail/Catalog. |
| C-014 | Recovery instruction “Мы отправим ссылку…” before an enabled submit that only later says unavailable; login/register similarly reveal unavailability after submit. | Make service availability clear before users enter credentials. No fake success was observed. Production Identity flows remain missing. |
| C-015 | Registration asks birthdate, first/last name, password confirmation; no required/email/password validation or production policy exists. | UI is a demo, not approval to collect additional PII. Confirm minimal production fields and validation within Identity/guest-matching work. |
| C-016 | Checkout has privacy as an informational paragraph, three disabled consents; UX-CONTRACT previously called a fourth consent “invented”. | PD-006 explicitly requires four. Documentation corrected; implementation still missing fourth control/versioned evidence. Commerce + approved policy publication. P0 before payment. |
| C-017 | Example cards/details have no visible demo badges; published arrays are empty. Reviews are blank quotes; package content includes “ПРИМЕР ФОРМАТА”, “Состав курсов будет утверждён”, “Цена не опубликована”; builder says “Размер примера/Макет курса”. | Latest recorded owner direction removes public explanations; preserve that authorization. Actual production publication must require approved data/release gating. Do not treat generic plausible titles as published products, or build real packages from the demo. |
| C-018 | Newspaper raster includes English “COMING SOON”, event date April 22, 2026, address/contact and IBPA wording. It is displayed as catalog photography. | These are pixels in a supplied asset, not LMS course/legal/launch facts. Confirm approved image and usage/crop; do not transcribe its contact/date into product data. |
| C-019 | Brand “LMS Academy”, actual issuer/contact, four legal titles without readable documents; no published certificate disclaimer in shell. | Identity/legal launch content remains pending. The short academy certificate caveat does not replace approved RU/EN legal documents. |
| C-020 | Learning status “РАБОТА ГОТОВА К ПРОВЕРКЕ”, canned curator revision response; local photo/comment retention only. | Keep local demonstration distinct from a real submission/review. Existing “ИНТЕРАКТИВНЫЙ ПРИМЕР ОБУЧЕНИЯ” provides context; no request leaves the browser. Never count it as Assignments/Learning implementation. |

Visible unavailable/placeholder families: neutral ◇/image icons in cards/detail/cart/offers; absent detail lesson count/duration/description/price/access/support/refund data; public preview unavailable; blank outcomes/program/trainer; four empty quote cards; contact-not-connected explanation; auth-unavailable notices; disabled Google/Apple; legal-unavailable checkboxes/text; uncalculated taxes/payable total; disabled payment; development “Тестовый курс/мини-курс” and ruble amounts; preview demonstration headers, test emails/password caution, artificial statuses/loading/form validation. No real price, offer, credential, review, contact channel or legal text was added by the audit.

## D. Actual architecture and structural quality

```text
src/app                         8 page templates, root/group layouts, metadata/fallbacks
src/features/home               10 numbered sections; composition seams; local offers/carousel behavior
src/features/catalog            cards/categories; persistent catalog experience; 4 numbered sections; fixtures
src/features/course-detail      shared detail page; 6 section owners (5 rendered); local detail components/DTOs
src/features/public-shell       header/footer/navigation/container/route motion
src/features/identity           native auth modal, 3 local forms, disabled social actions
src/features/commerce           fixture provider/preview/pages/rows/summary/checkout sections
src/features/component-preview  one client review page (9 sections)
src/components/ui               Button/Link; fields/checkbox/select/messages; SectionHeading
src/assets/fonts                self-hosted Manrope/Unbounded + OFL
src/app/globals.css              global tokens, accessibility/scrollbar baseline
src/db, src/lib, src/app/api     .gitkeep placeholders only
src/server                      absent (seven domain boundaries are target architecture)
```

Page compositions primarily delegate to sections. Existing frontend owners and numbered homepage order are correct. Root CartProvider supplies one state across shell/routes/preview; no duplicate production context was found. Global styling owns tokens; feature modules own local layout/CSS. Server Components compose Client Components and pass children; a client parent does not automatically turn every passed server child into a client implementation.

| ID / classification | Evidence / assessment | Recommended action |
| --- | --- | --- |
| A-001 · KEEP | `home-page.tsx` composes ten numbered owners and four seams; detail-page composes six source owners; routes remain thin. | Preserve Page → Section → local Component hierarchy. Do not migrate UI into route/backend folders. |
| A-002 · KEEP | L1 controls in UI; L2 cards/category/auth/commerce in feature owners; L3 public shell/DetailPage; L4 home-only seams/showcase and section internals. | See exhaustive [component registry](../architecture/frontend-components.md) for APIs, export paths, actual consumers, variants and status. No global MiniCourseCard/Hero/Carousel needed. |
| A-003 · EXTRACT candidate (L5) | Catalog 03 and 04 repeat results grid/empty/reset JSX, already share 03 CSS. | Catalog-local results body could remove drift while preserving both section owners. No extraction performed. |
| A-004 · REUSE candidate | CourseShowcase duplicates home OfferCarousel controls around the same hook; both already have real consumers. | Reuse existing home behavior where appropriate; preserve type-specific presentation. |
| A-005 · REFACTOR | ComponentPreviewPage is 539 lines, nine substantial sections/state groups plus private PreviewSection in one client file. | Split local preview section files; preserve single authorized preview and canonical imports. |
| A-006 · REFACTOR / KEEP boundary | PageContainer now imports GSAP/useGSAP and is client-side for optional reveal, with 28 direct JSX consumers. | Consider separating layout from optional motion after measuring benefit. No bundle/performance cost quantified here; do not claim this is a server-policy violation. |
| A-007 · REFACTOR | Dense CatalogExperience/FilteringSection/commerce JSX and repeated appended CSS overrides in header/offers/cards/home/filtering obscure final rules; old removed review recommendation selectors remain. | Focused formatting/consolidation and unused-style review; no broad refactor in audit. |
| A-008 · KEEP with integration seam | Home imports catalog public components; public shell imports Identity/Commerce public UI. DetailData imports catalog fixture exports. | Replace fixture data coupling with approved Catalog DTO integration; never re-export server runtime through frontend barrels. Home-internal hook imports remain same-feature, not cross-domain breaches. |
| A-009 · REFACTOR contract drift | UX-CONTRACT navigation described a removed mobile dialog; consent paragraph contradicted PD-006; DESIGN described visible fixture labels that source removed. | Corrected documentation to actual behavior/approved requirements; defects remain explicit. No product decision changed. |
| A-010 · REMOVE CANDIDATE | No source reference found for home course-photo-placeholder PNG and starter public SVGs; empty domain-feature directories contain no implementation. | Retain all assets/files. A search hit/no-hit is not authorization to delete artwork or historical work. |
| A-011 · KEEP current local state | Auth session/view state, contact/buyer memory, package/demo selections, scoped animation state are UI-owned and have no real side effects. | Do not move local interaction state into server domains. Authoritative pricing/auth/access/refund/completion remains missing. |
| A-012 · verification debt | Several browser suites assert removed public demo text/controls and old section counts. | Update assertions in a separate focused test task; retain meaningful policy/safety checks. Passing older historical notes does not establish current test results. |

No unused shared public export was proved safe to delete. Section-owned ProductFacts/PreviewPlayer/CourseOutcomes/CurriculumAccordion/TermsList each have one direct owner; two detail routes reuse that composition, not independent duplicated sections. Generic controls are reused for relevant form/actions; intentionally native summaries/radios and catalog-authored popup remain local. No architectural change is justified merely by similar box styling.

## E. Data and functionality status

`WORKING` means the specified browser/UI mechanic was verified. `DEMO` is local/fixture behavior; `MISSING` has no implementation; `BROKEN` is observed failure; `NOT VERIFIED` lacks sufficient evidence; `OUT OF SCOPE` is deferred. A component can have working mechanics while its business capability remains DEMO/MISSING.

| Feature / source | Status and side effects | Future authoritative owner / integration |
| --- | --- | --- |
| Public routes/header/footer/card navigation | WORKING current routes/anchors; disabled footer entries have no href | Public Site presentation; approval/publication workflow supplies content |
| Catalog filters/reset/history | WORKING local URL-array filtering; DEMO records; no query service; click-open Escape BROKEN | Catalog published records/taxonomy/availability |
| Catalog publication | MISSING: `publishedCourses=[]`, `publishedMiniCourses=[]`; 4+4 fallback fixtures rendered in development **and production builds** | Catalog + Administration readiness/approval/publication under PD-009 |
| Home course/mini previews | DEMO 3+3 separate fixtures; direction IDs differ from catalog; links to existing detail examples | Catalog published editorial projections, no duplicated business taxonomy |
| Detail products/program/trainer/media/terms | DEMO allowlisted fixture DTO; program/trainer/media/price missing; unavailable offer only | Catalog/content approval, Learning contract facts, Commerce action |
| Unknown detail slugs | WORKING Russian not-found UI/noindex; streamed HTTP response can be 200 | Next routing outcome; no claim of pre-stream 404 status |
| Public media playback/error retry | NOT VERIFIED on real route: no src exists. Unavailable state works | Catalog-approved preview; private paid playback later Learning/VIDEO001 |
| Home biography/disclosure | WORKING UI; supplied static copy; no external claim verification | Public Site/content approval; actual identity/assets substantiation |
| Home learning | DEMO: local image blobs/comment and canned feedback; no upload/network/progress/enrollment | Learning/Assignments services; PD-003/005 private media requirements |
| Packages/builder | DEMO size/selection/summary; real packages OUT OF SCOPE for MVP (Phase 2) | Catalog package definition + Commerce eligibility/pricing; unresolved overlap rules |
| Start in USA | DEMO four static topics/focus CTA; standalone release unresolved; no route/sale | Catalog/content + explicit release/offer decision |
| Reviews/recommendations | DEMO four blank cards; actual reviews/recommendations OUT OF SCOPE for MVP (Phase 3) | Approved moderation/review capability; do not invent testimonials |
| Contact | WORKING local blur validation, DEMO form; delivery MISSING; no request or success | Public Site delivery integration (SITE014), approved recipient/consent, server validation/abuse controls |
| Auth | DEMO modal/views/password toggle/focus; MISSING login/register/recovery/session/verification/reset; body scroll lock BROKEN | Identity; safe guest matching/continuation; no enabling credentials in audit |
| Social auth | OUT OF SCOPE Phase 3; disabled controls only | Identity approved account-linking/OAuth integration |
| Development cart | DEMO allowlisted IDs in `lms.la09.demo-cart.v1`, unique lines, reload/removal/cross-tab/shared badge; four scenarios; storage-write warning verified; no PII stored | Commerce real cart/persistence/merge policy; source fixtures are not price authority |
| Production cart | MISSING real cart; verified ignores injected demo storage and hides add controls | Commerce + Identity reconciliation contracts |
| Cart preview | WORKING nonmodal hover/click/focus/Escape/outside and mobile tap; data still DEMO | Commerce server cart, narrow privacy-safe DTO |
| Buyer email | WORKING blur validation/state retention across auth modal, memory only; not submitted | Commerce + Identity guest/account contract |
| Legal/consent | MISSING four RU/EN published legal routes/version store/evidence; 3 disabled controls only, PD-006 privacy acknowledgment missing | Administration publication via domain chosen in SALE002; Commerce acceptance/validation |
| Quotes/payment/orders/result/enrollment | MISSING; payment always disabled; no Stripe, order mutation, callback, result route or access grant | Commerce → Catalog/Identity/Learning public contracts under PD-002/006 |
| Price-change/unavailable/error/recalculation | DEMO UI scenarios, navigation correctly disabled; not real concurrency/provider failures | Commerce authoritative errors + PD-001 diagnostics |
| Component preview | WORKING review actions/pending/validation/status choices, labeled DEMO data; no business effects | Existing component owners; keep APIs synchronized |
| Loading/error boundaries | Files exist; genuine route error/loading/retry lifecycle NOT VERIFIED | Future real queries/mutations and targeted failure tests |
| PD-001 diagnostics, protected flows | MISSING server diagnostic/auth/resource/persistence implementations | Seven server domains; no claim that empty frontend demos satisfy security acceptance |
| Full English UI | OUT OF SCOPE for MVP; no locale routes/dictionary; EN preview link is a demo | Phase 2 localization; MVP RU/EN legal documents remain mandatory |

### Console, network, accessibility and motion

No application page/console errors were recorded by the main interactive probe. The default matrix recorded eight repeated development LCP warnings for the about portrait, four Next development `Performance.measure` negative-time errors on unknown dynamic-detail routes, and expected 404 resource/console messages for the intentionally unknown generic path. These are recorded, not hidden; the performance exception is not an observed purchase/auth failure. Production not-found follow-up shows the same Russian detail fallback and no page exceptions; generic unknown path returns 404. No unexpected failed content requests were observed on the implemented default routes. There are no real business endpoints to test for error/privacy-safe diagnostic pairs.

Keyboard focus trapping/restoration, password visibility, native form labeling, local field feedback, tab selection and inert inactive offers were exercised. Contact fields mark requiredness visually but lack native `required` attributes; fix semantics during the real form integration, without enabling delivery. Auth labels/values persist during view switching and reset after close. Registration can scroll inside its viewport; real virtual keyboards were not tested. Catalog ArrowDown/End/Enter selection/reset/history passed when waiting for the scheduled option focus. The first probe sent keys before requestAnimationFrame focus and timed out; corrected evidence is in followup-results.json. One initial rapid-mobile probe timed out under concurrent development compilation; follow-up results distinguish rerun evidence from that harness failure.

Live reduced-motion switching, rapid offer changes/resizing, active-height equality, disclosure motion and Cut hover reduced-motion behavior were checked with current suites/probes. Header/offers geometry stays stationary. Touch was emulated with tap/CDP swipe (inner package carousel moved 0→328px while outer active panel stayed `packages`); it does not establish iOS/Android hardware, Safari/Firefox, virtual-keyboard or assistive-technology acceptance. No axe package was installed; accessible names/roles, focus, field associations, target geometry and specific keyboard paths were inspected directly. No full WCAG certification, complete contrast-over-photography measurement or performance benchmark is claimed. Local font faces report loaded and Cyrillic glyphs were visually inspected; no external font request is used.

## F. Recommended actions

### P0 — production MVP acceptance

1. Integrate approved published Catalog data and readiness/publication controls; replace example fallbacks in released discovery/detail paths. Real program/media/trainer/price/terms are missing. No invented inventory/minimum quota.
2. Deliver Identity email/password/session/verification/recovery and approved guest continuation; current modal is only a demo.
3. Publish legally approved RU/EN policy versions/routes, add the fourth required acknowledgment, retain evidence and block absent-language checkout server-side. The audit corrected documentation only.
4. Deliver server cart/quote/eligibility/USD/cap, approved Stripe Payment Element/event lifecycle, order/result and idempotent Learning access integration. Preserve final refund-policy blockers and automatic eligible-refund requirement; do not enable payment based on UI checks.
5. Provide PD-001 failure diagnostics with real services and acceptance evidence; source-only boundaries are not implemented authorization.

These block the production capabilities they belong to; they are not all UI changes or all LAND01-owned work.

### P1 — significant current UI/content defects

Fix V-001–006 through their existing owners; recheck open states at all affected widths. Resolve empty/misleading program availability and approved certificate/access wording (C-009/010/013/016). Review factual RU/EN/licensing/partnership claims before publication. Connect contact delivery through its planned feature task. Repair stale test expectations so current behavior can be regression-tested without weakening policy checks.

### P2 — polish and maintainability

Align mini-card CTAs/format copy, hide all-fit carousel controls, improve small hit targets, localize generic 404, reconcile unavailable-footer treatment, split preview sections and simplify CSS/dense source. Candidate extractions stay local and require actual consumer review. Retain unreferenced artwork until approved cleanup.

### Later-phase separation

Real packages, promos, commissions/finance and full English remain Phase 2. Reviews/recommendations/social login/public QR remain Phase 3. Blank Phase 3 presentation merits release review, but its missing service is not an MVP blocker. Start in USA standalone publication/release remains unresolved. No later feature was promoted or product question answered.

## Verification commands and results

Browser scripts use `PLAYWRIGHT_MODULE=/Users/ivanmakovetskyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright` and `FRONTEND_URL=http://localhost:3000`, except production commerce at port 3109. Scripts were inspected before execution. For suites with hardcoded legacy evidence folders, temporary byte-for-byte copies changed **only the output path** to this audit's directory, preserving assertions and existing screenshots. No test source or expected result was edited. Logs and audit harness sources are retained in the evidence index.

| Command / suite | Result and limit |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm exec tsc --noEmit` | First concurrent run failed TS6053 because build regenerated `.next/types/{cache-life.d.ts,validator.ts}` during checking. Sequential rerun after build PASS. Not reported as a source type error. |
| `pnpm build` | PASS; eight page templates emitted; local fonts resolved. Does not establish visual/production readiness. |
| `pnpm test:frontend` | FAIL at line 48: six benefits rendered, historical expectation three. Suite stops there; later checks not claimed. |
| `pnpm test:learning-offers` | FAIL at line 113: compares switcher to whole header box; current approved-scope attachment uses bar bottom. Measurements show correct bar attachment/natural heights; later legacy suite steps not all reached. |
| `node …/catalog.browser.mjs` | FAIL waiting for removed “ДЕМОНСТРАЦИЯ СТРАНИЦЫ · ПРОДУКТ НЕ ОПУБЛИКОВАН” notice. Local filter/navigation checked independently. |
| `node …/course-detail.browser.mjs` | FAIL: expects six rendered sections, actual five because trainer absent. Existing modules are empty, so accordion assertions would also lack real rows. |
| `node …/auth-modal.browser.mjs` | FAIL on removed suffix “Это демонстрация интерфейса.”; notices now just say unavailable. Current focus/view/notice behavior captured independently. |
| `node …/commerce.browser.mjs` (development) | FAIL waiting for add-fixture button on `/cart`; it now renders only on `/preview/components`. Current audit seeds there, then tests actual cart/checkout surfaces and scenarios. |
| `node …/public-header.browser.mjs` | PASS at 1440/1024/768/390/320: shell states, nav/cart/auth/reversal. |
| `node …/public-polish.browser.mjs` | PASS at 1440/768/390/360: attachment, quiet tabs, founder disclosure, reduced motion/hydration. |
| `node tests/landing-refinement.browser.mjs` | PASS at 1440/768/390/360: copy/six benefits, local learning state, whole-card links, review drag/wheel, reduced motion. |
| `node --test tests/demo-cart.test.mjs` | PASS, 2 tests; Node module-type warning is recorded. Fixture restoration/formatting only. |
| `COMMERCE_PRODUCTION=1 … node …/commerce.browser.mjs` | PASS against `pnpm start --port 3109`: injected demo storage ignored, no test add actions, checkout empty. No real cart/payment service. |
| Premium static auditor, strict | PASS, zero findings. Static capability scan does not replace this audit's runtime findings. |
| Audit capture/state/follow-up/touch probes | Default matrix completed; interactive findings and harness timing failures retained in JSON. Corrected follow-ups used visible hydrated selectors and waited for option focus; a transient streamed duplicate selector is not classified as a duplicate rendered page. |
| `git diff --check` | PASS; no source or UI edit was needed. |

## G. Acceptance summary

| Acceptance dimension | Outcome |
| --- | --- |
| Inventory | **Completed:** source-discovered eight templates/fourteen concrete URLs, actual section order/conditional omission, shared/local APIs/consumers, data/status/release ownership. No planned route counted as implemented. |
| Visual audit | **Completed for the specified Chrome emulation matrix:** full pages, interactive states, section/cross-page comparison, content and clipped-descendant checks; focused defects documented. This is an audit completion, not a visual pass. |
| Architecture documentation | **Synchronized:** frontend pages/sections/components/backlog, bounded overview/modules/AGENTS updates. DESIGN/UX-CONTRACT corrected only for demonstrably stale fixture/navigation/consent claims. Existing product/planning decisions preserved. |
| Visual approval | **Outstanding:** no approved-implementation browser reference exists; unavailable historical references limit exact comparison. Owner review of current compositions/mobile and changes remains required. |
| Functional implementation | **Outstanding:** real Catalog/Identity/Commerce/legal/contact/private media/domain workflows and PD-001 diagnostics; UI demos do not fulfill them. |
| LAND01-A / LAND01-B | No current authoritative subtask definitions were available in repository files; configured live Vault path is absent on this machine. Neither subtask is marked complete or rewritten. Map this evidence to their actual acceptance criteria before sign-off. UI-related residuals: V-001–006, empty/unapproved content, current regression repair and human review. Architecture evidence is delivered; business contracts/integrations remain missing. |

Updated files: [frontend-pages](../architecture/frontend-pages.md), [frontend-sections](../architecture/frontend-sections.md), [frontend-components](../architecture/frontend-components.md), [frontend-backlog](../architecture/frontend-backlog.md), [overview](../architecture/overview.md), [modules](../architecture/modules.md), [AGENTS](../../AGENTS.md), [DESIGN](../../DESIGN.md), [UX-CONTRACT](../../UX-CONTRACT.md), plus this report/evidence. No application code, approved product decision, historical completed task or existing evidence folder was changed.

**Verified:** current source ownership, rendered page matrix and the specifically recorded local UI behaviors/states. **Unverified or missing:** real backend/business flows, unsupported devices/assistive technology, final content/legal/media approvals, original-reference pixel fidelity and human visual acceptance. The site is not established as production-ready.
