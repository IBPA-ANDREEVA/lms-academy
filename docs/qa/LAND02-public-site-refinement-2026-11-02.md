# LAND02 — Public motion, mobile composition and FAQ

Status: implemented proposal; browser evidence is engineering verification, not human visual approval. Work remains on `refactor/landing`, baseline HEAD `eb3665d1d6ec7441c462ba9ad7d20b6944d506f1`. Existing documentation, BBA logo and shell edits were preserved. No commit, push, deployment, backend integration or product-policy change.

## Reference contract and implementation plan

Owner supplied a motion/mobile overview (`codex-clipboard-a225d77a-b85e-42ea-8be9-4ddc7b17b634.png`) and section references in `/Users/ivanmakovetskyi/Downloads/LMS_LAND02_section_references/`:

| Reference | Target / borrowed relationships | Limits and rejected content |
| --- | --- | --- |
| Overview | First-entry droplet → impact → plum flood → dissolve; restrained settling; compact photo/message/CTA | No fabricated prices, discounts, trainers, credentials, purchase availability, testimonial or course photography. No scroll hijacking. Intro 1.46 seconds; interruption removes it immediately. |
| `01-faq-desktop.png` | Homepage after Contact: two-column short display heading and ruled question surfaces; active plum offset | Supplied 2880×1800 composition guides desktop proportions, not literal sizes/font shapes or approved wording. |
| `02-faq-mobile.png` | Stacked heading, concise introduction, native disclosure rows, contact anchor | Supplied 780px raster is a 390px layout reference. Seven grounded questions; separate icon column avoids raster's inline plus collisions. |
| `04-courses-mobile.png` | Compact tabs, horizontal direction choices, single readable course card and adjacent controls | No new course titles, media, prices or inventory; existing neutral placeholders become smaller. Existing removal of panel headings is preserved. |
| `05-mini-courses-mobile.png` | Two-column compact mobile cards and quiet metadata/actions | Existing three fixtures and shared CourseCard retained; no fourth invented offer or reference images. Two-column variant is scoped to homepage minis, not all catalogs. |
| `07-hamburger-mobile.png` | Full-height plum navigation, hierarchy, nested education links, prominent account entry | Preserve owner-selected BBA logo (D-018), real destinations and preview status. Native modal with a native-disclosure no-JS fallback. No extra decorative polygon. |

Target: Russian-first public discovery, MVP narrative/catalog/detail presentation; packages Phase 2, reviews Phase 3, StartUSA unresolved. Existing photographs, palette (`#782858`, `#FAF9FA`, `#1D1B1F`, `#F7EFF4`), Unbounded display and Manrope functional typography remain. Mobile information sections use shorter photo fields, tighter typographic groups and a native biography disclosure; these adaptations are bounded proposals pending owner review.

## Implementation and owned contracts

- `public-shell/PublicMotion(children)`: blank SSR overlay host, progressively created transform-only drop/flood, non-intercepting overlay, sessionStorage + in-memory guard; first eligible `/`, catalog or concrete detail entry only. Functional/preview routes excluded. Hash/restored scroll, late startup (>2.5 seconds), reduced motion and hidden tabs skip. Pointer, keyboard, wheel, touch, pagehide, live preference change, route change and unmount clear it. RAF defers the session claim until actual start, avoiding Strict Mode's duplicate effect setup. A 1.9-second watchdog removes interrupted residue. No permanent hidden content or artificial network wait.
- `public-shell/SectionReveal(div props)`: actual reuse through home narrative, both catalog result owners and both detail kinds. PageContainer retains `size/reveal` API but is a layout composition without its own client directive/GSAP implementation. Visible SSR content receives one 16px/450ms entrance on intersection; hash targets and focused content are spared, focus immediately clears in-flight styles. Live reduced motion reverts styles. Sticky ancestors are never transformed.
- `public-shell/MobileNavigation`: native modal drawer, caller-owned navigation/brand/account, Escape/backdrop/close/navigation handling, native focus trap, focus restoration, animated opening/closing, desktop breakpoint cleanup. Desktop navigation is preserved. <=760px header is one 68px row, with a width-constrained full BBA lockup, cart and 44px hamburger. No parallel mobile rail.
- `lib/use-scroll-lock(open)`: shared technical hook for AuthModal and MobileNavigation. Layout effect captures scroll before native `showModal` focus runs; locks body position, restores prior inline styles and exact scroll on close/unmount. Identity still owns form/view state; no auth service added.
- `LearningOffersShowcase(panels)`: existing group geometry, GSAP height/color/content, ResizeObserver, hash/history and inert panels retained. Removes outer swipe routing and selection-driven `scrollIntoView`; intentional hash navigation still scrolls. Tabs scroll horizontally within their own list. Mouse/keyboard focus avoids document anchor-padding jumps. SSR exposes all four panels; enhancement activates one-panel semantics. No-JS surfaces retain their own color contrast.
- Canonical CourseCard: content uses flex + action pushed to bottom; mini format appears once. Compact variant uses a 44px square neo-brutalist detail action. Actual consumers: home Courses/MiniCourses, both catalogs, component preview. No money, offer, access or entitlement logic.
- Home CourseShowcase passes actual visible count to `useSnapCarousel` and hides controls when measured content fits. Home OfferCarousel adds optional `mobileGrid=false`, used only by MiniCourseExplorer; packages retain native horizontal scrolling. Existing filters/cards survive selection.
- Catalog FilteringSection retains URL ownership in CatalogExperience. Native mobile filter disclosure shows selected labels; all three authored fields remain, with full-width direction and two subordinate columns. Popups match trigger width, long labels wrap, options/reset are >=44px, Escape bubbles from trigger or option to the owning root and restores focus. Desktop fields remain open.
- HOME-12 FAQ: `home/sections/12-faq/{faq-section,faq-item,faq-data}`; HomePage composes it immediately after Contact and before shared footer. Footer is SHELL-FOOTER (historical HOME-12 remains an alias). Native details/summary work without JS; scoped GSAP progressively adds reversible height/opacity, rapid toggle and live reduced-motion settling. No new route or global Accordion abstraction.

## LAND01 regression disposition

| Finding | Change |
| --- | --- |
| V-001 | Detail preview/grid children have explicit min-width/max-width and width; removed intrinsic min-height/aspect-ratio width pressure; fallback uses bounded padding. |
| V-002 | Founder display lines wrap, with verified narrow Unbounded scale. |
| V-003 | Learning demo media width bounded to local frame, compact aspect ratio independent of min-height. |
| V-004 / V-006 | Trigger-width popups, wrapping options and root Escape handling; open-state evidence at all widths. |
| V-005 | Shared layout-effect scroll lock precedes native modal focus, handles close/unmount and exact restoration. |
| V-007 | Missing outcomes row omitted; curriculum has an honest unpublished state and real catalog recovery. Removed claim that nonexistent program remains available below. No modules/trainers/video fabricated. |
| V-008 | Shared action alignment and one recorded-only fact. |
| V-009 | Measured canScroll controls; filtered single item has no arrows or dots. |
| V-011 | Mobile rail removed; 44px menu/cart/filter reset/options/review pagination targets. |
| C-001 / C-004 / C-005 / C-006 / C-007 | Fixed joined upload helper, duplicate mini wording, catalog-neutral “Выбрать обучение”, first-visitor cart instruction, electronic-mail labels and ellipsis. |
| C-002 / C-003 | Legal glossary requires approved document titles; real catalog identity capitalization remains with publication data. No legal substance or records inferred. |
| C-008 onward | Existing owner content/claims retained except V-007's specifically authorized honest availability treatment. FAQ does not substantiate academy claims or release production services. |

## FAQ copy provenance / approval

All seven answers are **proposed public wording pending owner editorial/legal review**. `faq-data.ts` is the maintainable copy source.

| Question | Repository basis |
| --- | --- |
| Course vs mini-course | requirements product types, MVP learning; PD-009 curator assignment; mini has no curator/homework review. |
| How learning works | requirements lesson/course structure and MVP learning; recorded lessons/materials/practice without invented program content. |
| Access duration | Complete PD-004: explicit introductory-rules acknowledgment, 3 calendar months independently per enrollment, authorized changes/pauses. No payment-start or 90-day claim. |
| Curator support | Complete PD-004: 14 consecutive calendar days and obligation to review timely submissions; mini excluded. No post-expiry revision-policy inference. |
| Languages | requirements localization + complete PD-009: course-specific RU/EN availability; no promise all courses bilingual or English UI in MVP. |
| Certificate | Complete PD-010: mandatory homework acceptance for courses, mandatory lessons for minis, administrator evidence review and manual issuance in every case. |
| Professional license | requirements certificate/license distinction; no licensing guarantee or jurisdiction-specific legal advice. |

Excluded pending approval: refund window/eligibility (OQ-037 and approved legal policy), prices/payment-method availability, exact course inventory, guaranteed review/issuance dates, post-expiry revisions and calendar edge rules (OQ-048/049), package rules/StartUSA publication, detailed licensing claims. The linked Contact section still explains unavailable delivery; FAQ does not imply working messaging.

## Verification

Reproduction and before/after pairs: [LAND02 evidence](evidence/LAND02-public-site-2026-11-02/README.md). Original LAND01 artifacts are untouched. Automated checks do not establish human visual approval. Final command outcomes and runtime limitations are recorded there. Lint, production build, sequential TypeScript, all 48 route/width cases, motion/media/Cut regressions, existing frontend/auth/catalog/detail/header/home/offers suites, production/development commerce, demo-cart unit tests, strict static audit and diff check passed. Screenshots remain pending human visual review.

## Owner addition — Parallax Cut

Canonical `components/ui/Button` and `ButtonLink` retain their APIs, border, parallelogram/slash geometry, resting colors and typography. `appearance="cut"` alone adds an aria-hidden depth outline and recognizes terminal text arrows as independent decorative spans. Explicit arrow spans remain supported. The stable button hit area never transforms.

Hover/focus: foreground outline and label lift −3px/−4px; depth outline moves +5px/+6px, detached slash independently +6px/−2px, arrow independently +5px right. Duration 300ms, arrow 210ms; controlled cubic easing approximates power3.out. Press: foreground/label +2px/+3px, slash +4px/+2px, arrow +2px and shadow +3px/+4px, compressing layer separation over 120ms. Mouse leave restores every layer. Inverse remains transparent, primary/secondary retain their original text/surface colors; no hover inversion or major recoloring. Hover motion requires a fine hover-capable pointer; touch receives press/release only. Keyboard focus retains an explicit outline. Disabled/loading/aria-disabled/busy cannot trigger the choreography; reduced motion removes every positional transition and depth offset, including a live preference change.

`component-preview/cut-button-preview.tsx` is local to the Button preview section. It reuses canonical Button/ButtonLink for default, hover, pressed, focus-visible, disabled and reduced-motion examples, plus primary/secondary/inverse/link/loading. `data-cut-state` and ancestor `data-cut-reduced-motion` are review-only CSS hooks, not a production business API. The real pointer/keyboard/touch test is `tests/cut-button.browser.mjs`; forced preview samples do not substitute for interaction testing. Enabled examples update a local click counter; no data leaves the page. No GSAP is required for CSS hover/press choreography.

Actual Button/ButtonLink consumers are inventoried in `evidence/LAND02-public-site-2026-11-02/button-consumers.json`: shell/header/menu, identity forms/modal, home learning/offers/contact/carousels, catalog introduction/cards, detail purchase/preview/recovery, commerce preview/cart/checkout/demo controls and the shared-component preview. Minimal/neo-brutalist families retain their existing styling; cut consumers, inverse/disabled/long-label variants and the component preview are included in regression verification.
