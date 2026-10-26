# ADR-0001: Feature-based modular monolith

- Status: Accepted
- Date: 2026-10-26
- Owners: Product engineering
- Scope: Application structure and module boundaries
- Related: [Architecture overview](../architecture/overview.md),
  [module boundaries](../architecture/modules.md),
  [product requirements](../product/requirements.md)

## Context

The LMS must support a connected set of workflows: account and role management,
catalog publication, purchase and payment confirmation, enrollment, protected
learning, homework review, certificates, notifications, refunds, and later
commercial operations. These workflows share strong consistency and authorization
requirements. For example, confirmed payment must grant the intended enrollment
once, and confirmed refund must revoke it immediately and auditably if the pending
MVP scope correction is approved.

The product is at an early stage. The repository is a single Next.js App Router
application with seven feature roots, and many provider and product-policy
decisions remain open. The engineering team, including multiple coding agents,
needs clear ownership without paying the operational and coordination cost of a
distributed system.

The architecture must therefore keep changes local, make domain rules testable,
and protect module data while retaining simple in-process calls and database
transactions.

## Decision

Build the LMS as a **feature-based modular monolith** in one Next.js application.

The deployable application is partitioned into these business modules:

- Identity;
- Catalog;
- Commerce;
- Learning;
- Assignments;
- Certificates;
- Notifications.

Each module owns its domain rules, application services, persistence access, and
feature-specific UI. It exposes a deliberately small TypeScript public interface.
Other modules may depend on that interface but may not import its internal files,
repositories, or database implementation, and may not write its tables.

`src/app` remains a delivery/composition layer for App Router pages, layouts,
Server Actions, and Route Handlers. It delegates business behavior to feature
interfaces. Generic UI belongs in `src/components/ui`, shared database plumbing in
`src/db`, and narrowly technical utilities in `src/lib`.

Cross-module work uses:

- synchronous local commands and queries when the caller needs an authoritative
  decision or atomic state change now;
- durable, committed facts for retryable side effects such as notifications;
- explicit transactions for critical workflows that update multiple owners in the
  same database.

This decision establishes the application shape and ownership model. It does not
select a database, ORM, authentication library, external provider, hosting
platform, or background-job product. Recommendations in the architecture overview
remain proposals until their own decision is approved.

## Why this option

The modular monolith matches the current product and team:

- payment, enrollment, refund, and completion flows benefit from local calls and
  transactional consistency;
- one deployment keeps development, test, debugging, and operations tractable for
  the MVP;
- feature ownership reduces conflicts between people or coding agents;
- explicit public contracts prevent the common single-codebase failure mode of
  arbitrary cross-feature access;
- provider adapters and module boundaries preserve replaceable seams without
  inventing distributed infrastructure;
- the design can evolve after real scaling or organizational evidence appears.

## Alternatives considered

### Technical-layer monolith

Organize all controllers, services, repositories, components, and models in global
technical folders.

This is initially familiar but rejected because a change to one business feature
spreads across the repository, ownership is unclear, global service and model
folders become shared mutable territory, and cross-feature rules are difficult to
discover or enforce.

### Microservices by business capability

Deploy identity, commerce, learning, assignments, certificates, and notifications
as separate services with network APIs and independent stores.

This is rejected for the current stage. It would require distributed transactions
or compensations, service authentication, schema/API versioning, queues, tracing,
local orchestration, multiple deployments, and substantially more operational
work. No current scale, isolation, regulatory, or team-ownership requirement
justifies that cost.

### Independently deployed serverless functions

Implement workflows as isolated functions around provider callbacks and UI
operations.

This is rejected as the primary architecture because function boundaries would
fragment domain ownership and make shared transaction, authorization, retry, and
local-testing behavior harder to reason about. The chosen host may execute parts of
the monolith in serverless runtimes, but that is a deployment detail, not the
domain architecture.

### Multi-package monorepo from the start

Place every domain in a separately versioned workspace package.

This is deferred. Compile-time package boundaries can help later, but they add
configuration, build graph, release, and type-sharing overhead before module APIs
have stabilized. Directory and import boundaries inside one application are the
simpler enforceable starting point.

### Framework-centric route ownership

Place data access and business rules next to every App Router page or Route
Handler.

This is rejected because the same rules must be shared by pages, Server Actions,
webhooks, jobs, and administration paths. Route-local rules would duplicate
security and state transitions and would couple domain behavior to React and HTTP.

## Benefits

- One application and one release unit for MVP delivery.
- Local, typed calls for cross-module collaboration.
- Database transactions for critical consistency where the selected store supports
  them.
- Clear feature ownership and smaller review surfaces.
- Business rules testable without rendering React or starting an HTTP server.
- External providers isolated behind owner-specific adapters.
- A path to stronger automated import enforcement once real code exists.
- Fewer coordination points for concurrent coding agents.

## Trade-offs and risks

- Boundaries are partly social until import rules and tests enforce them.
- A shared process allows accidental coupling and a shared database allows
  unauthorized cross-module queries.
- One deployment can release or regress multiple modules together.
- In-process calls can conceal expensive query chains if observability is weak.
- A shared schema requires disciplined ownership and migration coordination.
- Modules may become oversized if teams fail to split use cases and UI into focused
  files.
- Extracting a module later still requires explicit API, data, and consistency
  design; this decision does not make extraction free.

These costs are accepted because they are smaller and more controllable than the
distributed-system costs of the alternatives at the current stage.

## Consequences

### Required

- All new business functionality is assigned to one of the documented module
  owners before implementation.
- Cross-module imports target only the owner's public interface.
- Route files remain thin and do not own business policy or direct database access.
- Repositories are private to their feature; shared database plumbing contains no
  business workflow.
- Critical commands enforce authentication, resource authorization, validation,
  transactionality, auditability, and idempotency appropriate to their risk.
- Business facts needed for history are snapshotted rather than reconstructed from
  mutable catalog or profile data.
- Boundary or ownership changes update `docs/architecture/modules.md` and, when
  significant, receive a new ADR.
- Unresolved product questions remain unresolved in implementation and tests until
  recorded as approved decisions in `docs/product/open-questions.md`.

### Permitted

- Multiple modules may share one physical database and one deployment.
- A workflow-owning service may coordinate public commands from other modules in an
  explicit transaction.
- Read-only reporting projections may combine module-owned data if they do not
  become an operational write path.
- Feature-specific React components may live inside their module; reusable visual
  primitives may move to `src/components/ui` when actual reuse is established.
- Focused technical helpers may live in `src/lib` when they contain no domain
  policy.

### Prohibited

- Importing another feature's internal files, schema objects, repository, or
  provider adapter.
- Writing another module's tables, including from administration code.
- Trusting client-supplied roles, ownership, prices, entitlements, completion, or
  payment state.
- Using browser redirects as payment confirmation.
- Using UI visibility, App Router layout checks, or Proxy as the sole resource
  authorization control.
- Introducing a network service, message broker, or shared abstraction only for a
  hypothetical future need.

## Enforcement and fitness checks

The architecture is healthy when:

- module public surfaces stay small and intentional;
- a business rule has one owner and one tested implementation;
- protected resource tests cover direct server access, not only hidden UI;
- payment, fulfillment, refund, certificate, and notification handlers are safe to
  replay;
- database constraints prevent duplicates and invalid relationships;
- cross-module workflows name their transaction and failure boundaries;
- feature changes normally remain inside one module plus an entry point;
- no `src/components/ui`, `src/lib`, or `src/db` business utility becomes a hidden
  global domain layer.

Code review enforces these rules initially. When the import graph is large enough
to make review unreliable, adopt the smallest lint or dependency-graph check that
enforces the documented rules. That tooling requires its own concrete change; this
ADR does not approve a new dependency.

## When to revisit

Reconsider this decision only with evidence such as:

- one module needs independent scaling that cannot be addressed inside the current
  deployment;
- regulatory or security isolation requires a separate trust or data boundary;
- independent teams need incompatible deployment cadences and stable network
  contracts;
- failure isolation requirements cannot be met in one application;
- build, test, or deployment times remain unacceptable after simpler remediation;
- a provider integration requires a separate runtime that cannot safely coexist.

If extraction becomes justified, first stabilize the module's public commands,
queries, events, ownership, and failure semantics. A later ADR must define data
migration, consistency, observability, security, deployment, and rollback. The
default remains in-process; extraction is not an assumed roadmap item.

## Follow-up decisions

The following need focused decisions before the relevant implementation, but they
do not change this ADR:

- primary database and persistence/migration tooling;
- authentication provider/library and session strategy;
- payment provider and authoritative payment/refund state mapping;
- private object storage and homework-media processing;
- protected-video provider and playback grant model;
- background-job and transactional-outbox execution;
- email delivery provider;
- deployment, observability, backup, and recovery platform choices.

Business-policy prerequisites remain listed in
[`docs/product/open-questions.md`](../product/open-questions.md). The prioritized
architecture-facing subset is maintained in the final section of
[`docs/architecture/overview.md`](../architecture/overview.md).
