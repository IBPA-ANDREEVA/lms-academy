# Page structure review workspace

Review the section hierarchy before any shared-component identification. All 60 initial page/screen records are **Draft**; no user approval is inferred. This is structure planning, not a production-page implementation or component gallery.

## Run locally

```sh
pnpm install
pnpm dev:sections
```

Open http://127.0.0.1:3000/dev/sections. The launcher explicitly enables the tool and binds Next to loopback. To change the port: `pnpm dev:sections --port 3002`. Ordinary `pnpm dev` leaves it unavailable unless `SECTIONS_WORKSPACE=1` is explicitly supplied. Never expose the development server through a tunnel or reverse proxy.

Choose a page, expand a section, edit, reorder or add, and **Save changes**. Mark saved sections reviewed and save the checkmarks. Enter your own reviewer name, then approve the page explicitly. Use page notes when requesting changes. A subsequent save invalidates approval. Changing selected page with a dirty draft asks before discarding it. Saved data survives reload and server restart; unsaved data is not autosaved.

## Sources of truth

- `pages/<stable-page-id>.json`: one version-controlled document per route/screen. Contains original page scope, ordered sections, notes, review status, approval metadata, revision history and removed-section recovery data.
- `INVENTORY.md`: initial review map with all pages and their sections. It is an inspection snapshot, not a second editing source; the running tool reads JSON directly.
- `COVERAGE.md`: grouping choices, non-page capabilities, missing decisions and scope boundaries.
- `qa/`: actual browser screenshots and validation evidence. These are not visual approval.
- `src/features/section-planning/model.ts`: TypeScript data contract; `validation.ts`: strict mutation validator; `store.ts`: atomic persistence; `server.ts`: local HTTP guards.

Array order is canonical; `position` is normalized on every save. Section IDs are stable across reorder and restore. Each section has required content, purpose/action, interactions, data dependencies, source paths, phase/inclusion, responsive suggestions, states, visual notes and a reviewed flag. An approved page applies to its exact saved revision; section review alone is not approval.

Page route/scope metadata stays read-only in the UI because it records source evidence. Editors may propose different compositions without silently changing those obligations. New sections start conditional/unreviewed. Page notes should explain any moved or excluded required content. Original required-content summaries remain visible even after a section is removed.

`scripts/seed-section-plans.mjs` is the one-time historical bootstrap, not a regeneration command. It uses exclusive writes and refuses to overwrite existing files. Edit the JSON through the workspace; do not rerun the seed to replace reviews.

## Safety, conflicts and recovery

- Both page and HTTP entry points deny non-development use. Production GET/POST returns 404 even with the opt-in variable set. Production route code does not import the file store.
- Reads and writes require a loopback Host/URL. Writes additionally require matching Origin, JSON content type and a random process-local token issued by the read endpoint. Next's same-host forwarded header is accepted; other forwarded hosts are rejected. No CORS allowance.
- Requests are streamed with a 512KB bound. Strict allowed keys, lengths, enums, unique IDs, page ownership, source-path syntax and acknowledgement checks run server-side. Client data never chooses a filesystem path. Only known page IDs in the fixed planning directory are writable; file symlinks are rejected.
- A per-page filesystem lock serializes writers. SHA-256 of the loaded file prevents a stale browser or manually edited file from being overwritten. Save writes a unique sibling temporary file, flushes it, then renames the complete document, including history and approval, into place. A failed write does not deliberately fall back to truncating the existing document.
- If another editor wins, download the on-screen draft, explicitly reread, and reconcile. No force-overwrite control exists. A development restart/HMR may rotate the token; download a draft before rereading if a token error occurs.
- On a process crash, a `<page>.json.lock` directory can remain. Stop all editors/servers, inspect the page JSON and Git diff, then remove only that named empty lock directory. Do not remove an active writer's lock. Orphan `*.tmp` files are not read as pages. They may be inspected for recovery.
- Removed saved sections can be restored after reload. Revision history stores action/reviewer/time/status and prior approval evidence; full past content is recovered from Git. Do not assume uncommitted file history is a complete version backup.
- Reviewer names are self-entered, not authenticated signatures. This tool trusts the local repository owner and is not safe as a multi-user hosted administration service. Direct manual JSON/Git edits bypass approval lifecycle: reset approval yourself or edit through the workspace. No LMS student, payment, media or account data is involved.

No commit, deployment, product-policy resolution, component extraction, production header/card/button, or `/dev/components` gallery is part of this task. Stop here for the owner's review.
