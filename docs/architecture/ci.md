# Frontend CI and CodeQL

Follow-up, 2026-11-10: all six initial TypeScript errors are resolved by preserving unreferenced retired motion copies as `.archive` files; application behavior is unchanged. Frontend type/build checks and the full 156-test isolated PostgreSQL suite pass. The three CodeQL findings have been triaged and fixed locally without dismissals; complete local default suites returned zero findings across 87 JavaScript/TypeScript and 43 Python rules. See the [follow-up evidence](../qa/ci-security-followup-2026-11-10.md) for current results and the pending remote rescan. The initial verification below is retained as historical evidence.

## Frontend checks

`.github/workflows/frontend.yml` uses one Ubuntu 24.04 job, Node.js 22 LTS and the exact `packageManager` version in `package.json` (currently pnpm 12.15.0). Actions are pinned to verified release commit SHAs: checkout 7.0.1, setup-node 7.1.0 and pnpm/action-setup 6.1.1. Update pins deliberately when upgrading. The job has only `contents: read`; checkout does not persist credentials. No secrets or privileged PR trigger are used. pnpm caches its store, installs with `--frozen-lockfile`, and preserves the existing workspace dependency-build policy.

Pushes to `main` run only for the listed frontend paths. Every PR gets the stable **Frontend checks** status; a shallow checkout compares the PR base with GitHub's merge commit and runs the expensive steps only for frontend changes. Keep the shell pathspecs and `push.paths` aligned. This avoids GitHub's permanently pending required checks when a whole workflow is path-filtered. Git errors fail the check; deleted and renamed frontend files count as changes. Superseded runs are cancelled.

Applicable changes run, in order:

```sh
pnpm install --frozen-lockfile
pnpm lint
node --test tests/*.test.mjs
pnpm exec next typegen
pnpm exec tsc --noEmit
pnpm build
```

`TEST_PREVIEW=false` and `NEXT_TELEMETRY_DISABLED=1` are explicit. There is one production build, no preview-mode build matrix, and no failure suppression. Normal step failure stops later steps. Next.js also checks types during its build; no application setting disables that check.

The unit-test glob includes every existing `*.test.mjs` suite. Historical `*.browser.mjs` scripts are not part of this minimal CI: Playwright is absent from the manifest/lockfile, the scripts require an external Chrome/server setup, and several have known stale preview/DOM expectations (see the [public-site audit](../qa/LAND01-public-site-audit-2026-11-02.md)). They remain manual verification debt. Adding a reproducible browser suite requires a pinned browser dependency, explicit server/mode lifecycle and a focused review of those assertions. This workflow does not claim browser or release acceptance.

## CodeQL default setup

The repository is public. On 2026-11-10 (America/Los_Angeles), the GitHub API reported default setup `not-configured` and only the existing backend workflow. Default setup was then enabled for **JavaScript/TypeScript and Python**, with the **Default** query suite and standard GitHub-hosted runners. Both language jobs completed successfully in [initial run 42946347049](https://github.com/IBPA-ANDREEVA/lms-academy/actions/runs/42946347049). GitHub accepted both analyses for `refs/heads/main` at `c07bab86f74236841f3f96fdf69e79e22f94f84e` with no analysis errors. This scans the remote revision, not uncommitted workspace changes.

No advanced CodeQL workflow is needed: both languages work with default setup, which GitHub maintains and uploads to **Security → Code scanning**. Do not add a competing CodeQL workflow or SARIF uploader. Default setup covers pushes to the default/protected branches and PRs targeting those branches, excluding fork PRs, plus a weekly schedule after qualifying push/PR activity. If fork-PR scanning becomes required, review advanced setup explicitly rather than enabling two configurations.

To verify or restore the setup as a repository administrator:

1. **Settings → Actions → General:** keep GitHub Actions enabled; allow the pinned `actions/checkout`, `actions/setup-node`, `pnpm/action-setup` actions and GitHub's CodeQL actions. Keep the default workflow token read-only; no repository secrets are required.
2. **Settings → Advanced Security → Code Security → CodeQL analysis:** choose **Set up → Default**, or **View CodeQL configuration → Edit** for the existing setup. Select **JavaScript/TypeScript** and **Python**, **Default** queries and standard GitHub-hosted runners; enable/save and verify both language analyses succeed. Do not enable paid add-ons for this public repository.
3. Check **Security → Code scanning** for results and tool status. API verification:

   ```sh
   gh api repos/IBPA-ANDREEVA/lms-academy/code-scanning/default-setup
   gh api 'repos/IBPA-ANDREEVA/lms-academy/code-scanning/analyses?per_page=10'
   ```

Initial findings below have now been triaged and fixed locally; see the follow-up evidence above. GitHub alert closure still requires a scan of the pushed fixes:

| Alert | Reported severity | Existing location |
| --- | --- | --- |
| [#3: request forgery](https://github.com/IBPA-ANDREEVA/lms-academy/security/code-scanning/3) | Critical | `tests/circle-loading.browser.mjs:17` |
| [#2: request forgery](https://github.com/IBPA-ANDREEVA/lms-academy/security/code-scanning/2) | Critical | `tests/circle-loading.browser 2.mjs:16` |
| [#1: clear-text storage](https://github.com/IBPA-ANDREEVA/lms-academy/security/code-scanning/1) | High | `backend/scripts/verify_postgres.py:82` |

No finding was dismissed, excluded or suppressed. The PostgreSQL verifier retains its isolated migration/recovery coverage and now avoids the temporary plaintext bootstrap file.

## Manual merge protection

Inspection found no repository rulesets and no protection on `main`. These settings were not changed. After the frontend workflow is pushed through an authorized PR and has reported its check:

1. Open **Settings → Rules → Rulesets → New ruleset → New branch ruleset**. Name it `main CI`, set enforcement to **Active**, target `main`, and leave the bypass list empty.
2. Enable **Require a pull request before merging** and **Require status checks to pass**. Add **Frontend checks**, with **GitHub Actions** as the expected source. Enable **Require branches to be up to date before merging**. Verify the first hosted run; the initial TypeScript blockers are resolved locally.
3. Enable **Require code scanning results**, add **CodeQL**, set **Alerts: Errors** and **Security alerts: High or higher** (recommended initial thresholds). This enforces scan results; successful analysis jobs alone do not mean there are no findings. Review the existing alerts before rollout.
4. Keep force pushes/deletions blocked. Do not enable merge queue without adding and verifying `merge_group` support; this workflow currently handles PRs and pushes.

The existing `backend-database.yml` is byte-for-byte unchanged, including its PostgreSQL build/checksum and isolated verification. Its job is named `verify` and its workflow has top-level path filters. Do **not** make that raw job a globally required status: unrelated PRs would remain pending. Backend merge gating needs a separately reviewed always-reporting check before it can be safely required for every PR. Continue reviewing its result on backend changes.

## Initial local verification — 2026-11-10 (superseded by follow-up)

| Check | Result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed; pnpm 12.15.0, existing lockfile unchanged |
| `pnpm lint` | Passed without warnings after unused test imports were removed |
| `node --test tests/*.test.mjs` | 4 passed; existing Node module-type warnings remain visible |
| `TEST_PREVIEW=false NEXT_TELEMETRY_DISABLED=1 pnpm exec next typegen` | Passed |
| `pnpm exec tsc --noEmit` | Failed: 6 pre-existing errors in tracked duplicate source files, below |
| `TEST_PREVIEW=false NEXT_TELEMETRY_DISABLED=1 pnpm build` | Compiled successfully, then failed on the same TypeScript errors |
| `actionlint` 1.7.12 on both workflows | Passed; temporary official release binary verified against release checksum |
| Change gate / Bash syntax | Passed 24 isolated Git-fixture cases: relevant paths, docs/backend-only changes, no changes, push, deletion, rename and fatal invalid base |
| `git diff --check` | Passed |
| Browser tests / backend checks | Not run; browser tooling is unpinned/uninstalled, backend implementation/workflow unchanged |

The initial unit-test failure was an unused import of deleted `src/server/catalog/policy.ts` in `tests/catalog-contract.test.mjs`. Only unused imports were removed; all assertions are unchanged and no TypeScript business backend was restored.

Initial TypeScript errors: missing `circle-loader` import in `motion-preview 2.tsx:5`; missing `storyOverlap` in `academy-story 2.tsx:29`; missing `featuredTravel` in `use-featured-course-scroll 2.ts:27,29`; missing `circleExpand`/`circleReveal` in `circle-loader 2.tsx:44,51`. The follow-up verified these were unreferenced retired copies and preserved them byte-for-byte as archives; live components and TypeScript strictness are unchanged. No hosted frontend run has occurred: publication remains an authorized-owner action.

## Official references

- [CodeQL default setup](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/configure-code-scanning/configure-code-scanning) and [setup triggers](https://docs.github.com/en/enterprise-cloud@latest/code-security/concepts/code-scanning/setup-types)
- [Code scanning REST API](https://docs.github.com/en/rest/code-scanning/code-scanning)
- [Skipped workflows and pending checks](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs)
- [Required checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) and [CodeQL merge protection](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/manage-your-configuration/set-merge-protection)
- [checkout](https://github.com/actions/checkout), [setup-node](https://github.com/actions/setup-node), [pnpm/action-setup](https://github.com/pnpm/action-setup), [Node.js support](https://nodejs.org/en/about/previous-releases)
