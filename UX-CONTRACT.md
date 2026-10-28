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
