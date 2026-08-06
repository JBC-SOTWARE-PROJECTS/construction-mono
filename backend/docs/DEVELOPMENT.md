# Backend Development Guide

## Prerequisites

- JDK 8. The project is configured for Java 8 and its container base is Java 8.
- PostgreSQL and Redis for the `dev` profile.
- Gradle wrapper execution permission (`./gradlew`). The wrapper uses Gradle 6.7.
- Network access and approved credentials for the configured private Maven repository. Provide `mavenUser` and `mavenPassword` through your local/approved secret mechanism; do not place them in source or shell history shared with the team.

## Run locally

```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=dev'
```

The API listens on `http://localhost:5827`. Development configuration expects a local PostgreSQL database and Redis. Startup executes Liquibase migrations, so never use a shared, staging, or production database unless you have explicit authorization and a migration plan.

Before booting, confirm the effective profile and its datasource/object-storage values without copying sensitive values into logs or change notes. The project intentionally sets `hibernate.ddl-auto=none`; schema state must come from Liquibase, not Hibernate auto-DDL.

## Build and verification

```bash
cd backend
./gradlew build
```

This repository currently has no `src/test` directory, so `build` is primarily a compile/package validation. A feature is not complete merely because it compiles. Verify the narrow affected use case with safe local data:

| Change type | Minimum behavior to verify |
| --- | --- |
| GraphQL query | Authenticated response, expected company scope, pagination/filter boundaries, and empty result |
| GraphQL mutation | Success, validation/failure path, persisted data, rollback behavior for multi-write work, and permission denial |
| Status transition | Allowed state, denied invalid state, dependent records, and accounting side effects |
| Database migration | Fresh/local application startup, schema result, required seed/role/reference data, and migration history |
| Upload/report | Authenticated request, content type/file content, size/error path, and company authorization |
| Async/scheduled change | Context/transaction behavior and surfaced exception handling |

When a full runtime check is blocked, say exactly what was not verified. Do not claim that a Gradle build validates a database, session, or financial workflow.

## Everyday code conventions

### Add a GraphQL use case

1. Search `graphqlservices/<module>/` for the closest existing operation and inspect its entity, repository, frontend call, and related migration.
2. Implement in an existing or new Spring `@Component` annotated `@GraphQLApi`.
3. Use `@GraphQLQuery` for reads and `@GraphQLMutation` for state changes. Give arguments explicit `@GraphQLArgument(name = ...)` names.
4. Resolve the current user/company server-side. Apply the module’s authorization and company filter patterns.
5. Mark multi-write operations with `@Transactional(rollbackFor = Exception.class)` when the neighboring workflow does so. Keep all related persistence inside the same unit of work.
6. Return the module’s existing response type/pattern (`GraphQLResVal`, `GraphQLRetVal`, entity, list, or `Page`).
7. If the Next.js application consumes the changed schema, regenerate its types from `payroll-accounting` with `yarn codegen` using approved local authentication.

### Add/change persistence

1. Modify/create the entity in `domain/` and its repository/query only as needed.
2. Add a new SQL/XML migration in the latest relevant `resources/config/liquibase/changelog*` directory.
3. Append the new file once to `resources/config/liquibase/master.xml`.
4. Add permissions/reference data in the migration if the feature requires them.
5. Start against a disposable local database and validate both the migration and the user workflow.

Never edit an old migration that could already be recorded in another database’s `DATABASECHANGELOG`. Never rely on manual production SQL as the only implementation of a schema change.

### Add a REST endpoint

REST is the exception, not the default application API. Use it for multipart uploads, streamed/generated files, external callbacks, or established legacy route families. Add a `@RestController` resource in the relevant `rest/` package, ensure the route is protected by the existing security rules, validate ownership/company access, and return appropriate HTTP/status/content semantics. Do not make a second CRUD API for an entity that GraphQL already owns.

### Add a report or file upload

- Keep report templates/assets under `src/main/resources/reports/<module>/`.
- Build on the matching report resource and DTO convention.
- Enforce the configured 50 MB request/file ceiling or intentionally change it as an operational decision.
- Check authorization before fetching data or issuing an object-storage URL.
- Test with a real PDF/CSV or file round trip, including an invalid/missing reference.

## Transactions, auditing, and time

`AbstractAuditingEntity` supplies created/modified audit fields using `SpringSecurityAuditorAware`, which reads `SecurityUtils.currentLogin()`. Preserve those fields and auditing listeners on new persistent entities where the module convention applies.

The backend globally sets Hibernate JDBC time zone to UTC. Domain services use Java `Instant` and date/time conversions. Be explicit about zone behavior at API/UI boundaries, particularly payroll periods, attendance, reports, and date-range queries. Do not change a date field’s interpretation only in the frontend.

## Security checklist

- Is the route authenticated by default? If not, is public access explicitly justified?
- Does every read/write use the authenticated company and suitable role/permission checks?
- Does the response avoid passwords, secrets, other companies’ data, and unnecessary fields?
- Does an uploaded/downloaded object belong to the current company/user context?
- Did the change avoid adding a key, session cookie, password, or endpoint to documentation/logging?

`/public/passwordEncoder` and other public/legacy utilities already exist. Do not treat their existence as approval to add sensitive public routes.

## Git and review hygiene

- Keep a task focused. Do not reformat/reorder broad source trees or historical migration files incidentally.
- Preserve pre-existing working-tree changes from other contributors.
- Inspect the diff for generated files, migration ordering, and accidental configuration/secret changes.
- State the scope, verification commands/results, and unverified risks at handoff.

## Packaging and Docker

`Dockerfile` expects a built JAR named `build/libs/backend-<version>.jar` and runs the production profile. `build.gradle` and `Dockerfile` currently carry matching explicit version values. If the Gradle version changes, update the packaging expectation deliberately and verify the image build; otherwise Docker deployment will fail to find the JAR.
