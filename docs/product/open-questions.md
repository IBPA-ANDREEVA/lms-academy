# LMS open questions

## Purpose

This file contains **unresolved product questions only**: missing choices, ambiguous requirements, and acceptance rules awaiting approval. It is not a place for confirmed decisions, engineering directives, or implementation instructions. Approved product decisions belong in [decisions.md](./decisions.md); engineering requirements belong in the architecture documentation or an ADR. Never infer an answer from a mockup, proposal, or implementation.

Source references: S1 is `ТЗ_онлайн_академия_и_личные_кабинеты.docx`; S2 is `Онлайн_академия_дизайн_платформы.pdf`; P1 is the LMS Vault's `Full Project Plan.md`, phase plans, and `Roadmap.md`; P2 is the LMS Vault's epic task maps and linked task records. Questions derived from an engineering gap rather than an explicit S1 ambiguity are still unresolved recommendations, not approved business decisions. The original attachments are now committed under `docs/references/`; earlier review versions preceded that addition. Vault planning source files are not committed here.

Status vocabulary:

- **Blocking MVP:** a decision is needed for a safe or legally valid first launch.
- **Blocking feature:** the named later feature should not ship without it.
- **Clarify:** implementation can prepare for the decision, but product behavior must not be assumed.

## Highest-priority open questions

| ID | Status | Needed by milestone | Question | Why it matters |
| --- | --- | --- | --- | --- |
| OQ-006 | Blocking MVP | Before legal pages, production email, and certificate templates; no later than MVP acceptance (QA003) | Intentionally deferred: what is the academy's approved name, domain, sender identities, and certificate issuer identity? | Required for branding, email, legal pages, URLs, and certificates. |
| OQ-007 | Blocking MVP | Before QA02 and production checkout | Which final RU/EN texts have legal professional approval for publication, and where is that approval evidence? | Policy-management and consent rules are approved in PD-006; actual legal texts and legal sign-off are still required. |
| OQ-008 | Blocking MVP | Before retention safeguards (INF08) and MVP acceptance (QA003) | Which mandatory legal retention periods, deletion exceptions, and applicable privacy requirements must qualify the approved retention policy? | PD-007 approves the product policy, but explicitly leaves these legal checks pending. |

## Roles, ownership, and authorization

| ID | Status | Question |
| --- | --- | --- |
| OQ-011 | Clarify | With one current trainer/curator per course confirmed by PD-013, may content authorship and the current review assignment belong to different people? What staffing reference is required for mini-courses without curator support? |
| OQ-012 | Clarify | When the single current trainer/curator changes, may an individual student be reassigned, how does the change propagate to existing enrollments/pending attempts, and what history remains visible? Original multiple-curator question is preserved in PD-013; concurrent multi-curator assignment is not assumed. |
| OQ-013 | Clarify | What does role switching look like for a multi-role user, and which role is selected after login? |
| OQ-014 | Clarify | With concurrent student/trainer/manager/administrator memberships under PD-013 and independent referral capabilities, which actions require separation-of-duties controls, including reviewing one's own homework or granting one's own access? |
| OQ-015 | Clarify | What student fields may a curator see beyond display name and course activity? The source explicitly prohibits contact details outside the platform but does not define the allowed profile view. |
| OQ-016 | Clarify | Beyond PD-014's immediate blocking/role-revocation effect, what residual actions may a blocked user take, and what non-destructive lifecycle effects apply to active enrollments, pending homework, messages and financial records? Original wording is preserved in PD-014. |

## Catalog, content, and eligibility

| ID | Status | Question |
| --- | --- | --- |
| OQ-017 | Clarify | Are the six initial directions fixed launch scope, and what taxonomy or slug rules apply when administrators add directions? |
| OQ-018 | Blocking feature | How is eligibility for an advanced course limited to licensed practitioners: declaration, document upload, manual approval, or informational labeling only? |
| OQ-019 | Clarify | Does the Start in the USA module issue a certificate, contribute to a package certificate, contain homework, or have a distinct access duration? |
| OQ-020 | Clarify | Can a lesson have multiple assignments, optional assignments, quizzes, or only the single homework pattern shown in the wireframe? |
| OQ-021 | Blocking MVP | What event marks a video or lesson as viewed: opening it, reaching a percentage, watching a duration, or manually completing it? How are seeking and rewatching handled? **Implementation dependency:** MVP ordered unlocking, progress calculation, mini-course certificate eligibility, and end-to-end acceptance tests require one authoritative completion rule. |
| OQ-022 | Clarify | May administrators change mandatory assignments or lesson order after students enroll? If so, which version governs existing students and certificate eligibility? |
| OQ-023 | Clarify | Is trainer content editing versioned, and what approval or rollback process applies to changes to a published course? |
| OQ-024 | Blocking feature | Who supplies and approves RU/EN translations, audio, subtitles, trainer credentials, and legal text? What happens when only one language exists? |

## Packages, ownership, and pricing

| ID | Status | Question |
| --- | --- | --- |
| OQ-025 | Blocking feature | Are packages limited to exactly 2, 3, or 6 directions plus Start in the USA, or may administrators assemble any number and combination of products? |
| OQ-026 | Blocking feature | What happens when a buyer already owns one or more package components? Is there prorating, upgrade credit, duplicate access, or no eligibility? |
| OQ-027 | Blocking feature | When the cart suggests a package, does it replace selected lines automatically only after consent, or merely link to a package page? |
| OQ-028 | Blocking feature | What happens to existing enrollments when a package's composition or price changes after purchase? |
| OQ-029 | Blocking MVP | How exactly is the USD 2,500 cap applied to taxes, mandatory fees, materials, discounts, multi-product carts, and non-USD payments? Counsel must confirm the BPPE interpretation. |

## Checkout, orders, discounts, and refunds

| ID | Status | Question |
| --- | --- | --- |
| OQ-031 | Blocking MVP | Which payment state is authoritative for fulfillment, and how are asynchronous, disputed, charged-back, or reversed payments handled? |
| OQ-032 | Blocking MVP | Which exact ownership-proof, matching and recovery mechanics link a guest purchase to an existing account, including changed/unreachable email and repeated claims? PD-014 requires ownership verification before linking, never matching email alone, and preserves claimability of paid purchases after activation-link expiry. Original wording is preserved in PD-014. |
| OQ-033 | Clarify | How long does a cart persist, and is it shared across anonymous and authenticated sessions or devices? |
| OQ-034 | Blocking feature | May promo codes stack? Are they single-use per customer? Can a fixed discount exceed the eligible subtotal? How do currency and tax interact with it? |
| OQ-035 | Blocking feature | What happens to promo-code usage counts after cancellation or refund? |
| OQ-036 | Blocking feature | Are partial refunds supported for an order, a package component, or a portion of a course? How are access and accrual reversals prorated? |
| OQ-037 | Blocking MVP | Beyond PD-013's confirmed within-24-hours AND unstarted-course eligibility and administration-handled execution, what legal conditions, reason/evidence requirements, administrator approval steps and failure/recovery handling apply? No package/partial-refund behavior or other financial exceptions are inferred. Original question is preserved in PD-013; the proposed seven-day rule and unattended execution requirement are superseded. |
| OQ-038 | Blocking feature | What constitutes acceptable evidence for authorized-operator manual enrollment, and who may approve or reverse it? |
| OQ-039 | Blocking feature | What order, receipt, tax, and accounting record should a manual enrollment create? |
| OQ-040 | Blocking feature | What is the precedence when referral link, promo code, prior lead ownership, and manual enrollment point to different referral partners? |
| OQ-041 | Blocking feature | How long does referral attribution persist, and is it first-touch, last-touch, promo-specific, or manually overridden? |

## Learning access, homework, and curator support

| ID | Status | Question |
| --- | --- | --- |
| OQ-042 | Blocking MVP | Does sequential unlocking require video completion, lesson completion, accepted homework, or a configurable combination? |
| OQ-043 | Blocking MVP | Which remaining upload-failure recovery acceptance cases must be specified beyond the resumability, progress, interruption recovery, safe retries and original preservation already approved in PD-005? |
| OQ-044 | Blocking MVP | Which malware-scanning, media-moderation and remaining transcoding-failure rules apply to student uploads beyond PD-005 recovery and PD-007 retention safeguards? |
| OQ-045 | Clarify | May a student replace or delete a pending submission? Can they submit another revision before the curator acts? |
| OQ-046 | Clarify | Are there assignment due dates distinct from the two-week support expiry, and who configures them? |
| OQ-047 | Blocking feature | Does message history become read-only after support expires? PD-004 already establishes extension and administrator override permissions; remaining message-history visibility is unresolved. |
| OQ-048 | Blocking MVP | Which detailed post-expiration transitions apply to in-review work, student revisions and certificate eligibility? PD-004 requires curators to review assignments submitted before the permitted deadline even if overdue; it does not settle the remaining transitions. Every submitted assignment needs a valid state and unambiguous next permitted action. |
| OQ-049 | Blocking MVP | Which exact authorized course-opening action activates enrollment under PD-013, and how are accidental/prefetched openings excluded? Which timezone, year/month boundaries, pauses and overlapping-extension rules govern the confirmed one-year standard/three-month mini video access and 14-day supported-course clocks? Package/component and optional-module details remain unresolved; no student-global clock is implied. |

## Certificates

| ID | Status | Question |
| --- | --- | --- |
| OQ-051 | Blocking MVP | Which profile name is printed for each certificate language, and what validation or approval occurs before issue? |
| OQ-052 | Blocking MVP | Which issue date, trainer name, academy identity, signatures, and visual assets are required on the MVP certificate? |
| OQ-053 | Clarify | Does a package produce one package certificate, individual course certificates, or both? |
| OQ-054 | Clarify | May a certificate be regenerated after a name correction? Does it retain its number and date, and how are prior files treated? |
| OQ-055 | Blocking feature | What exact public data may the QR verification page reveal, and how is unwanted enumeration or search prevented? |
| OQ-056 | Blocking feature | What does a revoked or superseded certificate page show, and who may revoke or restore it? |
| OQ-057 | Clarify | Does course content or completion-rule change ever invalidate previously issued certificates? |

## Trainer and referral-partner finance

| ID | Status | Question |
| --- | --- | --- |
| OQ-058 | Blocking feature | When does a student become eligible for a trainer per-student accrual: payment, access grant, support start, first activity, or refund-window expiry? |
| OQ-059 | Blocking feature | Is the mini-course trainer percentage calculated from gross price, discounted subtotal, net receipts, or amount after fees and taxes? |
| OQ-060 | Blocking feature | Is referral-partner commission calculated from gross sales, discounted subtotal, collected cash, or net revenue? |
| OQ-061 | Blocking feature | How are partial refunds, chargebacks, package allocations, complimentary access, and manual enrollments reflected in accruals? |
| OQ-062 | Blocking feature | What payout cadence, currency, minimum threshold, approval workflow, tax documentation, and overseas payout method apply? |
| OQ-063 | Blocking feature | Can configured rates change over time, and must each sale snapshot the rate that applied at attribution? |
| OQ-064 | Clarify | May a payout be reopened or corrected after being marked paid, and what audit trail is required? |

## Leads, abandoned carts, and communications

| ID | Status | Question |
| --- | --- | --- |
| OQ-065 | Blocking feature | What consent makes an abandoned cart recoverable and permits a separately authorized operator to see or contact the buyer? |
| OQ-066 | Blocking feature | How are leads assigned, deduplicated, reassigned, closed, and retained? What statuses are required? |
| OQ-067 | Blocking feature | Which contact channels may authorized operators use, and must contact attempts be recorded? |
| OQ-068 | Clarify | Are student-curator messages plain text only, or do they support attachments, voice, moderation and unread state? What remaining handling details are needed under PD-007 retention? |
| OQ-069 | Clarify | What are the exact timing, retry, deduplication, localization, unsubscribe, and preference rules for each email notification? |
| OQ-070 | Blocking feature | Which push platform is intended, which events deserve push, and how are device permissions and preferences managed? |

## Reviews, recommendations, and analytics

| ID | Status | Question |
| --- | --- | --- |
| OQ-071 | Blocking feature | Who may submit a review, at what completion point, and may one student review a course more than once? |
| OQ-072 | Blocking feature | What rating scale, moderation states, rejection reasons, editing rules, and public attribution apply? |
| OQ-073 | Blocking feature | Are recommendations manually curated, rule-based, or algorithmic, and which inputs may be used? |
| OQ-074 | Blocking feature | What analytics consent and cookie behavior is required before loading Google Analytics or Meta Pixel? |
| OQ-075 | Blocking feature | What is the canonical event taxonomy and attribution model for conversion and acquisition-cost reporting? |
| OQ-076 | Clarify | Which timezone, currency, refund date, and data freshness rules apply to administrative reports? |
| OQ-077 | Clarify | How are completion rate, new buyer, repeat purchase, average review time, and average order value defined? |

## Operations, security, and data governance

| ID | Status | Question |
| --- | --- | --- |
| OQ-078 | Blocking MVP | What recovery point and recovery time objectives apply to the database and private media? Who performs restoration tests? |
| OQ-079 | Blocking MVP | Which administrator actions are routine versus critical audits, and who may inspect them? PD-007 fixes routine retention at 30 days; which legally required periods apply to critical audit records? |
| OQ-080 | Blocking MVP | What production monitoring and alert thresholds cover payment failure, email failure, upload processing, video authorization, and scheduled jobs? |
| OQ-081 | Clarify | Which remaining privacy rights, export procedures and legal deletion exceptions apply beyond PD-007 verified deletion, administrator notification/contact, eligibility checks and permanent certificate evidence? |
| OQ-082 | Clarify | Are minors permitted to purchase or enroll? If so, what guardian consent or privacy requirements apply? |
| OQ-083 | Clarify | Which jurisdictions besides California or BPPE-related rules govern commerce, privacy, tax, education disclaimers, and recordkeeping? |
| OQ-084 | Blocking feature | What remaining device/session threat model and acceptance criteria apply to PD-003 self-managed protected playback? Screen-capture blocking is not guaranteed; DRM is deferred until after MVP. |

## Scope and planning discrepancies

| ID | Status | Question |
| --- | --- | --- |
| OQ-086 | Clarify | Should product reporting continue to use the original feature phases, or should Phase 2 and Phase 3 be renamed to match the Vault's single `post-MVP` implementation window? This documentation preserves the original feature distinction. |
| OQ-087 | Clarify | With MVP 2026-12-07 fixed and 50 hours per ordinary week confirmed, what explicit scope/additional-capacity decision addresses the remaining 82-hour MVP deficit and conditional 2026-12-18 forecast? Full 2027-01-26 remains fixed; its current forecast is 2027-01-22. The owner explicitly retained weekends and the November 26, December 25 and January 1 exclusions. |
| OQ-088 | Clarify | The original MVP says Russian only, while the catalog requirements mention language visibility and filtering. For MVP, should cards show only Russian availability, or must mixed-language inventory already be supported? |
| OQ-089 | Clarify | The original specification includes the student dashboard's upcoming deadlines and curator responses, but the Vault defers messaging and support countdown. Which reduced MVP dashboard states are required? |
| OQ-090 | Blocking MVP | PD-010 requires administrator course-conversation inspection while full student-curator messaging remains Full. What minimum conversation data and request types/statuses must MVP provide, and which underlying operations are authorized? No Full messaging scope is silently promoted or waived. |
| OQ-091 | Blocking feature | What literal restricted operational-log URL and remaining protected account/admin route spellings are approved? PD-010 requires the viewer; UI planning can proceed without inventing routes. |
| OQ-092 | Blocking feature | Given PD-014's approved matrix selections for manager membership, which final resource conditions and capability combinations apply, and how are release discrepancies reconciled with separately authorized referral, lead/contact, financial-view and manual-sale scope? No dashboard or route is inferred. Original wording is preserved in PD-014; OQ-095/OQ-096 cover cross-role and source conflicts. |
| OQ-093 | Blocking MVP | For PD-013 refunds, is exactly 24 hours included, which authoritative payment instant anchors it, when is unstarted status evaluated, and how are activation racing a request/admin execution and delayed provider confirmation handled? |
| OQ-094 | Blocking MVP | How must preservation of all homework attempts, attachments, reviews and feedback under PD-013 qualify PD-007 access-expiry deletion, account deletion and legally required erasure? Which retention periods, exceptions and historical visibility rules apply without losing required review/certificate evidence? |
| OQ-095 | Blocking MVP | What final resource ownership/authorization conditions govern the matrix's Conditional permissions and blank/ambiguous resource context, including Guest-to-authenticated transitions, trainer deadline/access edits, multi-role Allow/Deny/NAN combinations and separation of duties? BASE03-A approves selections, not these interpretations. |
| OQ-096 | Blocking MVP | How should workflows and release allocations be reconciled with the approved matrix: Admin Deny for task/submission/review/file/conversation actions versus older PD-005/008/010 inspection/review requirements; Guest Allow alongside authenticated-owner conditions; MVP stage labels for messaging/certificate revocation versus later or unresolved scope? Selected values remain unchanged; no bypass, scope promotion or completed ownership validation is implied. |
| OQ-097 | Blocking MVP | What numeric window qualifies password reauthentication as recent for sensitive administrator actions, which actions require it, and which genuine authenticated interactions qualify for inactivity refresh? PD-014 excludes background polling and fixes the 30-day absolute/7-day inactivity limits; those limits are not open. |
