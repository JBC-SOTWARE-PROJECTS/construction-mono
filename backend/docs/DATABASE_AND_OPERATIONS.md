# Database and Operations Guide

## PostgreSQL and JPA

`DatabaseConfig.groovy` creates a Hikari datasource from the active profile and enables JPA repositories, auditing, and transaction management. It supports either a JDBC URL or a PostgreSQL datasource class with database/server properties; it rejects a configuration that supplies both URL and database name.

JPA configuration intentionally disables automatic schema management (`hibernate.ddl-auto=none`). The database contract is maintained by Liquibase. Entity changes without a migration are incomplete.

The application sets Hibernate JDBC time zone to UTC. Use `Instant` and explicit zone conversion at reporting/UI boundaries. Review date-range and database-view behavior carefully when adding payroll, attendance, ledger, or report fields.

## Liquibase

The `SpringLiquibase` bean runs this master changelog on startup:

```text
src/main/resources/config/liquibase/master.xml
```

The master includes an ordered history of XML and SQL files across `changelog`, `changelog1`, `changelog2`, `changelog3`, and `changelog4`. It includes initial schema, data, functions/views, roles/permissions, and later module changes.

### Safe migration procedure

1. Inspect the last includes in `master.xml` and choose the current project convention/directory.
2. Create one new, descriptive migration file. Include DDL, indexes/constraints, reference data, view/function changes, and permission seeds required by the feature.
3. Append a single include to the end of `master.xml` using the project’s `classpath:` / `relativeToChangelogFile` style.
4. Apply it only to a disposable local database by starting the application.
5. Inspect `DATABASECHANGELOG`, the changed schema, and the affected GraphQL/REST business path.
6. For destructive/data-transforming migrations, prepare a backup and rollback/recovery approach before requesting deployment.

### Rules

- Never edit, rename, move, remove, or reorder a migration already in the master file. Liquibase checksums and deployed histories depend on it.
- Do not add a migration without adding it to `master.xml`; it will never run.
- Do not rely on `hibernate.ddl-auto`, a local manual update, or a production console fix in place of a migration.
- Be conservative with table rewrites, non-null columns, large backfills, indexes, and view/function changes. Existing data volumes and report dependencies may make them expensive.
- Search migration history for a table/view/function before creating a new definition. The changelog contains historical names and some repeated numbering.

## Data ownership and audit trails

Most domain entities use UUID identifiers and many inherit `AbstractAuditingEntity`, which provides `createdBy`, `createdDate`, `lastModifiedBy`, and `lastModifiedDate`. JPA auditing gets the actor from Spring Security. Javers is also present for change history.

Preserve audit/company columns and migration defaults for new rows. Bulk SQL and background jobs must be designed consciously around audit context and tenant scoping; they do not automatically obtain a normal request principal.

## Redis sessions

HTTP sessions are stored through Spring Session Redis. The active Redis connection factory is selected by `redis.deployment`:

| Setting | Connection behavior |
| --- | --- |
| `dev` | Default local Lettuce connection factory |
| `docker` | Lettuce using configured host/port |
| `openshift` | Lettuce using configured host/port |
| `secured` | Lettuce using configured host/port/password |

The development profile uses `redis.deployment=dev`; do not assume custom host/port/password values are used in that branch without reading `HttpSessionConfig`. Redis outage and session cookie issues can appear as unexplained login/account GraphQL errors, so verify session health before diagnosing an application authorization bug.

## Configuration and secrets

Configuration comes from common and profile property files. It controls datasource/Redis, API limits, object storage, feature flags, GraphQL compression, message broker host, and logging. Some checked-in configuration contains sensitive values.

- Never print, commit, screenshot, or add secret values to documentation, test fixtures, shell scripts, or generated code.
- New credentials should come from approved deployment/local secret injection rather than additional hard-coded properties.
- Do not point developer machines at production data/object storage to shortcut setup.
- Existing exposed values should be reported privately for rotation; do not repeat them in a code-review description.
- Keep defaults and profile-specific behavior aligned when introducing a new required property. A missing prod property may only fail in deployment.

## Reports and generated files

Report templates are under `src/main/resources/reports/`, organized for AP, AR, billing, inventory, and payroll. Additional fonts are bundled under `fonts/` because Jasper/PDF output depends on them. Generated reports are served from REST resources and can expose sensitive commercial/payroll data.

When changing a report:

1. locate the template, REST resource, DTO/query, and frontend download caller;
2. verify the report source data is company-scoped and status-correct;
3. test PDF/CSV content, dates, pagination, fonts, totals, and file name—not only the endpoint status;
4. verify a user without access cannot retrieve another company’s document.

## Object storage

Object storage is accessed through `DigitalOceanSpaceService`. Files are used for employee documents, profile pictures, project/inventory attachments, and asset vehicle-usage documents. Treat the database record and remote object as one user-visible operation: avoid leaving an active row for a failed upload or deleting a document record without considering the remote object. Changes to storage naming, URL format, lifecycle, or credentials affect existing records and need a migration/compatibility plan.

## Docker and deployment

The backend Dockerfile:

- uses a Java 8-based image;
- expects `build/libs/backend-<project version>.jar`;
- copies bundled fonts into the JRE font directory;
- exposes port `5827`; and
- starts with the `prod` Spring profile.

The hard-coded Docker JAR version must stay aligned with `build.gradle`’s `version`. Verify this whenever changing releases. Build and deployment also need access to the private Maven repository; do not bake its credentials into the image.

The backend uses forwarded headers and a secure session cookie configuration, so deployment behind a TLS-terminating reverse proxy must preserve the appropriate forwarding/protocol behavior. Verify real login/session behavior in the target environment after proxy/cookie changes.

## Operations checklist

Before deploying a backend change, confirm:

- the target profile has every new configuration value and no sensitive value was added to source;
- Liquibase migration is append-only, reviewed, and tested against representative data;
- the JAR version matches Docker packaging expectations;
- Redis/session, PostgreSQL, report fonts/templates, and object-storage dependencies are reachable;
- API changes have compatible frontend handling or a coordinated rollout;
- payroll, inventory, and accounting modifications have a business/ledger verification plan;
- logs and operational messages do not expose credentials, personally identifiable data, payroll figures, or session identifiers.
