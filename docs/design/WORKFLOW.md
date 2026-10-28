# Frontend implementation workflow

1. Read the frontend registry in `docs/architecture/frontend-*.md` and inspect current components/routes/diff.
2. Establish page/section ownership, user goal, release phase and real data from product and architecture docs.
3. Inspect the exact reference supplied by the user. Record what applies, what is illustrative and which states/viewports are unspecified.
4. Reuse fitting shared components; keep page-specific composition local. Extract only justified reuse. Preserve unresolved business policies.
5. Implement directly in the actual application; the authorized `/preview/components` route may demonstrate shared components. Do not restore reference databases, planning editors or generated definition infrastructure.
6. Verify lint, typecheck, build, meaningful behavioral checks and real desktop/mobile screenshots. Compare with the supplied reference and disclose deviations.
7. Update page, section, shared-component and backlog registry entries with actual paths, props, consumers and status.

Visual vocabulary remains: exploratory, preferred-reference, selected-direction, approved-implementation. Only explicit human review can approve the implemented result. A screenshot of one component does not approve the rest of the product.
