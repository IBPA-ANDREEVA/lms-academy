# LMS planning audit · 2026-10-30 · updated 2026-11-02

The owner requested Russian epic names, one semantic task prefix per epic, contiguous numbering, completed work in current epic folders and concentrating on one epic with limited dependency exceptions. Applied to the existing Vault, without application implementation.

[Dashboard](</Users/ivanmakovetskyi/Ivan's Vault/Projects/LMS/Dashboard.md>) · [Timeline](</Users/ivanmakovetskyi/Ivan's Vault/Projects/LMS/Timeline.md>) · [Full Project Plan](</Users/ivanmakovetskyi/Ivan's Vault/Projects/LMS/Full Project Plan.md>)

## Current structure

Exactly nine directories under Tasks. The task index is embedded in Full Project Plan; no separate index note remains. All 12 completed notes have moved into their current epic directories and received sequential filenames. A subsequent explicit owner instruction also authorized matching completed-note style and titles. Their current contents/IDs were reformatted; original source bytes are archived, while completed status, estimates, date tags and recorded time ranges remain unchanged. This move is explicitly authorized by the latest user instruction and supersedes the previous fixed-path restriction for this migration only. Task aliases and the retained JSON mapping preserve historical identifiers; original snapshots remain in ZIP archives.

| Epic | Number range | Completed / remaining | Remaining h | MVP / Full verification |
| --- | --- | ---: | ---: | --- |
| 01 · Публичный сайт и каталог | SITE001–SITE022 | 7 / 15 | 72.5 | SITE015 / SITE022 |
| 02 · Основа платформы и аккаунты | BASE001–BASE012 | 4 / 8 | 42.5 | BASE011 / BASE012 |
| 03 · Кабинет ученика и обучение | LEARN001–LEARN012 | 0 / 12 | 60.5 | LEARN008 / LEARN012 |
| 04 · Покупки и рефералы | SALE001–SALE021 | 1 / 20 | 126.0 | SALE010 / SALE021 |
| 05 · Видео и медиахранилище | VIDEO001–VIDEO007 | 0 / 7 | 34.5 | VIDEO006 / VIDEO007 |
| 06 · Домашние работы и кабинет куратора | WORK001–WORK009 | 0 / 9 | 47.0 | WORK007 / WORK009 |
| 07 · Сертификаты и уведомления | CERT001–CERT013 | 0 / 13 | 60.0 | CERT007 / CERT013 |
| 08 · Администрирование и эксплуатация | ADMIN001–ADMIN011 | 0 / 11 | 60.0 | ADMIN008 / ADMIN011 |
| 09 · Доработка и тестирование | QA001–QA006 | 0 / 6 | 34.5 | QA003 / QA006 |

All 101 pending tasks have new canonical IDs with one prefix per epic. Stage metadata and action titles identify preparation, UI, backend, integration and verification without mixing unrelated prefixes. All live tasks and dependencies now use the new IDs; old IDs remain in provenance, compatibility aliases and original archives. 236 original pending scopes remain mapped exactly once; no approved scope or tests were removed. Task CSS and application files remain unchanged.

## Execution order and capacity

Within each phase, pursue the lowest unfinished target epic, enter a prerequisite epic only when blocked, continue its available tasks consecutively, then return when its phase finishes or a further prerequisite is required. Every calendar detour has a recorded target-epic reason. The canonical order is explicit in `Resources/ordered-epics.json`; the generator no longer selects unrelated packages to fill spare hours. Numbers follow the resulting execution order within each epic. Full extensions follow all MVP work; completion of an epic's MVP scope does not require its Full extensions.

One developer; weekdays; 10 h/day and 50 h per ordinary week. The owner explicitly retained weekends and November 26, December 25 and January 1 as non-working days, making those weeks 40 h. No overtime is allocated. Removing the hard two-task daily limit fills the remaining hours with the next canonical task; up to four sequential task entries can occur, including carried-over fragments. Task scope, dependencies, epic focus and estimates are unchanged.

Remaining scope: **332 h MVP + 205.5 h Full = 537.5 h**. Normal capacity before MVP is 250 h, leaving **82 h uncovered**. Capacity through Full is 590 h. All full work weeks before the final week use 50 h (40 h with an excluded day); the January 18 week uses 17.5 h because capability work ends January 18 and final QA is reserved for January 21–26.

Fixed deadlines: **MVP 2026-12-07; Full 2027-01-26; Full feature cutoff 2027-01-20**. Current conditional forecast: **MVP 2026-12-18; Full 2027-01-22**. Previous forecast was December 29 / February 1. Full capability work and verification finish January 18. Target QA phase A remains November 30–December 7 and is missed; phase B runs January 21–22 within its January 21–26 reservation. No deadline or release scope moved. Unknown defect effort and external approval waiting remain outside this optimistic forecast.

MVP dependency chain:

`BASE005 → BASE006 → BASE008 → CERT002 → BASE009 → SITE011 → SITE012 → SALE006 → SALE007 → SALE008 → SALE009 → SALE010 → ADMIN008 → QA001 → QA002 → QA003`.

Full dependency chain:

`BASE005 → BASE006 → BASE008 → CERT002 → BASE009 → SITE011 → SITE012 → SALE006 → SALE007 → SALE008 → SALE017 → SALE019 → SALE020 → ADMIN010 → SALE021 → ADMIN011 → QA004 → QA005 → QA006`.

## Updated artifacts and architecture

The Vault now has only three top-level entry notes: **Dashboard, Timeline, Full Project Plan**. Nine Russian epic notes and all 113 canonical task records remain. Timeline contains one editable generated SVG and expandable weekly/day allocations with task links. Full Project Plan owns scope, order, blockers, estimates and the task index. Dashboard shows current-day work, actual progress and forecasts through the shared Dataview renderer.

Removed 75 obsolete/duplicated files, including separate phase plans, the old guide/index/mapping notes, old weekly notes and the redundant MVP image. They are recoverable from `Resources/Archives/before-50h-2026-11-02.zip`; `Resources/cleanup-2026-11-02.json` lists every removed path and the supplied reference scope. Earlier baseline ZIPs are also in Archives. `Resources/completed-originals.zip` retains original completed notes. The generator, task mappings, estimate review, protected baseline, allocation JSON, validation report and shared view remain as maintenance sources.

The supplied dark horizontal roadmap reference governs epic colors, date alignment, separate work segments and fixed milestone lines only. The new visual retains all nine current epics, actual dates, phase verification markers and the existing approved role model. It does not adopt the reference's obsolete manager epic or old schedule.

Frontend stays in src/features; routes in src/app; seven server domains remain identity, catalog, commerce, learning, assignments, certificates, notifications. No new runtime abstraction or application code. Homework definition relocation and legal-policy publication ownership remain preparation questions. Product/legal/refund/expiry/certificate/route blockers remain unresolved, never inferred from scheduled dates.

## Validation

Generator schedule/check: nine Russian epics, nine task folders, contiguous numbers including completed notes, monotonically increasing per-epic calendar numbers, unique IDs, dependency DAG/order, all original scope mapped once, phase gate coverage, fixed milestones, conserved hours, 10 h/day, 50 h/full week (40 h/excluded-day week), and no avoidable idle capacity when ordered ready work exists. Original archived completed-file SHA-256 values match the protected baseline. Current formatted hashes match the authorized migration record; completed status, date tags, recorded time ranges and historical estimates are checked independently. Protected CSS and runtime hashes match. Vault links/embeds resolve; SVG XML and task fingerprint are current. JavaScript syntax and repository diff whitespace are checked separately.

Application lint/typecheck/build are not applicable to this planning-only edit and were not run. The final roadmap was rendered at 1440×1090 and visually inspected. Dashboard was inspected in live Obsidian. The actual shared view and CSS were also checked with canonical data in a local browser harness at a 390 px panel width: no horizontal overflow, nine epic rows, twelve weekly disclosures, keyboard toggling, empty and error recovery states. This narrow check is not a complete Obsidian plugin-environment test. Detailed evidence is in the Vault `Resources/verification-report.json`. No commit, push, merge or deployment.

## Individual estimate review

All 101 pending packages were reviewed against their work and acceptance criteria: 31 budgets changed and 70 were retained. Total decreased from 552.5 to 537.5 h. Existing UI reuse reduces composition/integration effort; file recovery, financial reconciliation, real-device media checks and restore checks retain or increase dedicated verification time. Each note stores work hours, included local-check hours, total, previous total, review date and rationale. Visible task lines include the total so native daily queries show it. `Resources/estimate-review.json` preserves the per-task calculation. No blanket factor or repeated historical 50% reduction was applied. Completed estimates remain unchanged.
