# Backend Architecture

## Purpose and runtime shape

This application is the server for the DiverseTrade operational suite. It provides an annotation-driven GraphQL API for the main business model, purpose-built REST endpoints for uploads/reports/integrations, session-based authentication, PostgreSQL persistence, Redis-backed HTTP sessions, report generation, object storage, and optional WebSocket/SOAP integration.

```mermaid
flowchart LR
    UI[Next.js client] -->|form login| Login[POST /api/authenticate]
    UI -->|session cookie| GQL[/graphql/]
    UI -->|uploads / PDFs / CSVs| REST[REST resources]
    UI -->|SockJS/STOMP when used| WS[/ws]
    Login --> Sec[Spring Security + HISUser]
    GQL --> Sec
    REST --> Sec
    Sec --> Company[SecurityUtils\ncurrent user / company]
    Company --> App[GraphQL services / REST resources]
    App --> Repo[Spring Data repositories / DAO]
    Repo --> PG[(PostgreSQL)]
    App --> Redis[(Redis HTTP sessions)]
    App --> Storage[DigitalOcean Spaces]
    App --> Reports[JasperReports / PDF / CSV]
    PG --> Liquibase[Liquibase master.xml]
```

## Startup and framework configuration

`BackendApplication.groovy` is the `@SpringBootApplication` entry point. It selects the development profile when no active profile is supplied, configures Liquibase package scanning, then starts Spring.

`application.properties` supplies common defaults. The important runtime settings are:

| Area | Current behavior |
| --- | --- |
| HTTP | Server port `5827`; session timeout 60 minutes; forwarded headers enabled |
| Data | PostgreSQL via a manually configured Hikari datasource; JPA DDL is disabled |
| Database change | `DatabaseConfig` runs `classpath:config/liquibase/master.xml` |
| GraphQL | GraphQL SPQR exposes the API; multipart upload support is enabled; application WebSocket GraphQL is disabled |
| Sessions | Spring Session is backed by Redis; Spring Data Redis repositories are disabled |
| Files | Standard multipart limit is 50 MB; DigitalOcean Spaces settings are environment-specific |
| Accounting | `autopostjournal` and costing are feature flags, not universal assumptions |

The backend uses Spring Boot 2.1.6, Gradle 6.7, and Java 8 (`sourceCompatibility = 1.8`). Most application code is Groovy with some Java/generated SOAP classes. See `build.gradle` for the exact dependency set.

### Profiles

`application-dev.properties` and `application-prod.properties` define datasource, Redis, and object-storage differences. The Docker image starts with `--spring.profiles.active=prod`; local boot defaults to `dev` unless overridden. Profile property files currently contain sensitive configuration, so they must never be copied into tickets or docs.

## Code boundaries

| Directory | Responsibility | Notes |
| --- | --- | --- |
| `config/` | Datasource, Liquibase, security, CORS, session, GraphQL support, async, SOAP, WebSocket wiring | Treat as application-wide behavior |
| `security/` | `HISUser`, custom password encoding, user lookup, security/company utilities, audit identity | The Spring principal carries the current company |
| `domain/` | JPA entities, enums, DTOs, shared auditing base | Most persistent IDs are UUIDs |
| `repository/` | Spring Data repositories and database-focused queries | Many are module-specific and some use native SQL/views |
| `dao/` | Generic JPA DAO abstraction | Used by the base GraphQL services |
| `graphqlservices/` | Main application use cases and GraphQL operations | Grouped by business module |
| `services/` | Application/infrastructure services, report tabulation, storage, notifications, scheduling | Not all services are API boundaries |
| `rest/` | Binary reports, uploads, special integrations, older utility endpoints | Use only when HTTP semantics are needed |
| `socket/` | STOMP/SockJS message types/services | Current controller send/receive examples are commented out |
| `memoization/` | Request-scoped caching/memoization support | Check before adding a competing cache |
| `resources/` | Properties, migrations, report templates, static assets, COA resources | Versioned runtime resources |

## Request flow and tenant safety

1. A browser sends form credentials to `/api/authenticate`.
2. `UserDetailsService` loads the `User`, roles, and the employee’s current company, then builds `HISUser`.
3. Spring Security stores the authenticated principal in a Redis-backed HTTP session.
4. A GraphQL/REST controller or service reads the authenticated identity through `SecurityUtils`.
5. A business service uses company-scoped records/queries, repositories, and a transaction where required.
6. JPA auditing gets the current login through `SpringSecurityAuditorAware`; `AbstractAuditingEntity` supplies audit fields.

The company is not merely a UI selection. `SecurityUtils.currentCompanyId()` and `currentCompany()` are the server source of truth. `AbstractDaoCompanyService` sets `companyId` on saves, while feature services/repositories commonly perform their own company filtering. When adding a query or report, use the nearest module’s company pattern and test with an account from a different company. Never use a request-supplied company ID to replace this context for ordinary operations.

## API architecture

### GraphQL

GraphQL SPQR builds the schema from Spring components:

- Service class: `@Component` + `@GraphQLApi`
- Read operation: `@GraphQLQuery`
- Write operation: `@GraphQLMutation`
- Contract parameters: named `@GraphQLArgument`s

Operations are grouped under `graphqlservices/`: accounting, address, assets, billing, cashier, fixed asset, HRM, inventory, payroll, projects, services, and shared administration. This is code-first GraphQL. The exact production contract should be discovered from an authenticated local GraphQL endpoint rather than inferred from a stale hand-maintained schema.

`GraphQLConfig` installs an Open Entity Manager in View filter so GraphQL can resolve lazy relationships. This prevents some lazy-load errors but is not a reason to return broad/recursive entity graphs; design selection sets and repository fetching deliberately.

### REST

REST resources are intentionally focused on binary documents, multipart input, integrations, and legacy data views. They live under `rest/` with functional grouping for accounting, AP, AR, reporting, and miscellaneous resources. See [API and integrations](API_AND_INTEGRATIONS.md) for the route families.

### GraphQL response patterns

Feature services commonly return `GraphQLResVal<T>` or `GraphQLRetVal<T>` containing `response`/`payload`, `success`, `message`, and optionally `returnId`. Other operations return an entity, list, or `Page` directly. Match the nearest operation’s contract; do not normalize unrelated module APIs during a feature task.

## Security, sessions, and CORS

`MultiHttpSecurityConfig` configures:

- form login at `/api/authenticate` and logout at `/api/logout`;
- authenticated access for `/graphql/**`, `/graphiql/**`, and `/api/**`;
- explicit public/legacy exceptions, including `/public/**`, `/ping`, `/`, selected user/project paths, and `/ws/**`;
- method security annotations and an inheritable security-context strategy for async work.

Do not broaden public routes or CORS as a feature shortcut. The current CORS configuration allows all origins while enabling credentials; this is a security-sensitive legacy configuration and should only be changed as a reviewed deployment/security task.

`HttpSessionConfig` chooses a Redis connection factory from `redis.deployment`. `SpringSessionConfiguration` marks cookies `SameSite=None`, HTTP-only, and secure. If a local browser login fails over plain HTTP, diagnose the cookie/security configuration rather than inventing a second authentication path.

## Infrastructure integrations

| Integration | Implementation | Change guidance |
| --- | --- | --- |
| PostgreSQL | Hikari datasource + JPA + repository/DAO layer | Use Liquibase for every schema/data evolution |
| Redis | Spring Session / Lettuce | Preserve session semantics and profile-specific factory behavior |
| Object storage | `DigitalOceanSpaceService` and upload resources | Validate authorization, size, file type, and object lifecycle |
| Reports | JasperReports, DynamicJasper, PDFs/CSVs, templates in `resources/reports` | Test file content, not just HTTP status |
| SOAP | `SoapConfig` and generated Java classes | Keep external contracts backward compatible |
| WebSocket | STOMP/SockJS at `/ws` | See API guide; current application handlers are largely inactive |
| Audit history | Spring Data auditing and Javers dependency | Do not remove audit data/annotations without a migration and review |

## Asynchronous work and notifications

`SpringAsyncConfig` enables async execution with exception-aware task execution. The security context is configured to be inheritable, but an async task still needs deliberate tenant/transaction design; do not assume a request-bound entity manager or a safe company context will survive arbitrary background work. Scheduler and notification services live in `services/scheduler/` and `services/`.

## Architectural constraints to preserve

- Use server-authoritative user/company/permission checks for writes.
- Make multi-entity business changes transactional and leave the aggregate consistent on failure.
- Preserve existing status transitions and accounting integration when extending a workflow.
- Keep binary uploads/downloads and reports in REST; keep normal business data operations in GraphQL.
- Prefer the existing module/service/repository over creating a parallel implementation.
