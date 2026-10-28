# Section planning interaction contract

Applies only to `/dev/sections`. There is no existing sibling application workflow: `/` remains the Next.js starter. No generic UI primitives or production compositions are created.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
| --- | --- | --- | --- | --- |
| Select/Listbox | Native select in `section-editor.tsx` | This contract | OS-owned popup and keyboard behavior deliberately accepted | Browser keyboard and narrow-width checks |
| Form | Feature editor + `validation.ts` | This contract | Labeled edit fields; strict server validation; preserve draft on failure; no validation bubbles | Validation and browser tests |
| Scrollbar | `workspace.module.css` | DESIGN.md | Visible inherited baseline within tool; native forced-colors behavior | Responsive screenshots and overflow checks |
| Toast | Workspace live region and persistent error block | This contract | Server-confirmed save; errors retain draft and offer download/reload; never auto-dismiss critical errors | Browser save/error tests |
| CRUD | `store.ts` + workspace | This contract and user task | Explicit save, SHA-256 conflict check, atomic document replacement, persistent tombstones | Store and browser tests |
| Confirmation | Feature-native HTML dialog | This contract | Native modal/inert behavior, cancel focus, Escape, focus restoration; name consequence | Required-deletion and approval browser tests |

Page selection remains in the URL using `replaceState`; local search is transient. In-app dirty navigation requires a dialog. Browser unload uses `beforeunload`. A save disables the editor and navigation; drafts remain until the response succeeds. Failure/timeout never reports success. Conflicts offer a JSON draft download and explicit reread, without force-overwrite or automatic merge.

Section deletion is reversible. Required-source removal or inclusion change warns that product obligations remain; backend requires acknowledgement. A new unsaved section can be restored until the next save. Saved removed sections persist in the same page JSON. No file deletion API exists.

Review is explicit. Changed section content clears its reviewed flag server-side. Approval requires reviewer-entered identity, all sections reviewed, no unsaved change, and confirmation. UTC date and revision are server-generated. Any saved edit to an approved page clears approval and returns it to review; old approval evidence remains in history. Structure approval never resolves a product question, URL policy, visual reference or production readiness.

Business-context sources: user task for local-tool authorization, [AGENTS.md](AGENTS.md) for architecture/security and approval limits, [requirements](docs/product/requirements.md), [phases](docs/product/mvp.md), [questions](docs/product/open-questions.md), [public IA](docs/architecture/public-sitemap.md). The tool does not implement billing, customer identity, legal consent, learning or deletion of LMS records.

Persistence is a trusted local developer workflow, not authentication or a tamper-proof audit. Direct edits and Git operations are outside the editor's lifecycle; manually changed approved structures must be reset to `in-review` with `approval: null`. Use the editor for approval-aware editing. Reviewer identity is self-entered, not verified.

## Component registry contract

The user-requested `/dev/components` workflow follows the same native-select, labeled-field, explicit-save, persistent-error, beforeunload and native-dialog behaviors. Its canonical editor owner is `src/features/component-registry/workspace.tsx`; the server/store own its stricter component/reference schemas. The sibling section editor's controls are embedded and have no reusable public API, so this extension does not refactor unrelated section work or introduce production UI primitives. `Field`, `Select`, `Modal`, the live region and mutation dispatcher are reused within the registry. The existing Manrope asset is shared as an asset only.

| Capability | Registry owner | Source / behavior | Verification |
|---|---|---|---|
| Select/Listbox | Feature `Select` / native select | OS popup, keyboard; Russian visible labels | Browser native select checks |
| Form | `Field`, definition/reference editors + `validation.ts` | Explicit save; no native validation bubbles; preserve drafts on failure | Store/browser tests |
| Scrollbar | Scoped `workspace.module.css` | Same selected tokens, visible standards-based scrollbar; forced colors native | Viewport screenshots |
| Toast | One workspace status region + persistent error | Server-confirmed results, partial upload count, draft download/reload | Browser failure recovery |
| CRUD | `store.ts` | SHA-256 conflict check, serialized writes, atomic canonical records, generated projections | Store/browser tests |
| Confirmation | Feature `Modal` with native dialog | Modal/inert, initial cancel focus, Escape and focus restoration; approve/archive/remove/discard | Browser modal checks |
| Upload | Sequential upload dispatcher + validated server assets | 8 MiB, 40 references; partial success explicit; fixed preview dimensions; replace retains history | Upload/store/browser tests |

Selection is URL-backed; search/filter state is intentionally transient in this local planning tool (same override as section search). Definition and reference drafts are never saved automatically. Archive is recoverable soft deletion; usage removals require acknowledgement because page obligations remain. Approval records the explicitly entered reviewer, UTC time and revision; definition vs visual invalidation are independent. Visual/implementation approval controls are inactive in this phase. Product authority and exact persistence/security limits: `docs/design/components/README.md`. Local section approval never resolves new business policy. No external messages, commerce actions or real user records are involved.
