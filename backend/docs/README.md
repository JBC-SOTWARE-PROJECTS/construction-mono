# Backend Documentation Index

This documentation describes the code under `backend/` as it exists in this repository. It is designed to help a developer understand where a behavior lives before changing it. The runtime GraphQL schema remains the source of truth for exact operation arguments and return fields.

## Read in this order

1. [Architecture](ARCHITECTURE.md) — system boundaries and request/data flow.
2. [Development guide](DEVELOPMENT.md) — get a safe local environment running and follow repository conventions.
3. [Domain workflows](DOMAIN_WORKFLOWS.md) — understand the business process and its accounting/company consequences.
4. [API and integrations](API_AND_INTEGRATIONS.md) — locate the appropriate API boundary and non-GraphQL integrations.
5. [Database and operations](DATABASE_AND_OPERATIONS.md) — make persistence, deployment, files, and reports changes safely.

## Fast map

| Concern | Main location |
| --- | --- |
| Spring application/bootstrap | `src/main/groovy/com/backend/gbp/BackendApplication.groovy` |
| Configuration/security/session | `src/main/groovy/com/backend/gbp/config/`, `security/` |
| Domain entities | `src/main/groovy/com/backend/gbp/domain/` |
| Database access | `repository/`, `dao/` |
| Primary business API | `graphqlservices/` |
| HTTP uploads/reports/integrations | `rest/` |
| Shared application services | `services/` |
| Migrations | `src/main/resources/config/liquibase/` |
| Report templates | `src/main/resources/reports/` |

## Ground rules

- The authenticated company is an application boundary. Use `SecurityUtils.currentCompany()` / `currentCompanyId()` and existing company-aware query patterns.
- Keep workflow rules on the server. Frontend checks do not authorize a mutation.
- Use a new, append-only Liquibase migration for every persisted schema/data change. Never alter an applied migration or reorder the master includes.
- Treat the current property and codegen credentials as secrets even though they are tracked. Do not repeat them in documentation, logs, test data, or new source.
- Before changing payroll, inventory, accounting, or status transitions, trace their ledger and dependent-process effects.
