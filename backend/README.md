# DiverseTrade Backend

The DiverseTrade backend is a Spring Boot 2.1 application written primarily in Groovy. It exposes the operational system’s business API, handles authentication and company context, owns PostgreSQL persistence and Liquibase migrations, stores sessions in Redis, and renders reports/files.

## Start here

```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=dev'
```

The default API port is `5827`. Starting the application runs Liquibase, so use a disposable local PostgreSQL database and ensure Redis is available. The Gradle build expects approved private-repository credentials (`mavenUser` and `mavenPassword`); never commit them.

```bash
./gradlew build
```

There is currently no `src/test` tree, so a build is a compilation/package check only. Exercise the affected GraphQL/REST workflow with safe local data for behavior changes.

## Documentation

| Document | Use it for |
| --- | --- |
| [Documentation index](docs/README.md) | Navigating the backend documentation set |
| [Architecture](docs/ARCHITECTURE.md) | Components, boundaries, request flow, security, and integrations |
| [Development guide](docs/DEVELOPMENT.md) | Local prerequisites, build/run commands, conventions, and verification |
| [Domain workflows](docs/DOMAIN_WORKFLOWS.md) | Inventory, accounting, HR/payroll, projects, assets, and cross-module rules |
| [API and integrations](docs/API_AND_INTEGRATIONS.md) | GraphQL, REST/report/upload endpoints, sessions, WebSocket, and SOAP |
| [Database and operations](docs/DATABASE_AND_OPERATIONS.md) | PostgreSQL, Liquibase, deployment configuration, reports, files, and operational safety |

Repository-wide developer/AI-agent instructions live in [../docs/SYSTEM_GUIDE.md](../docs/SYSTEM_GUIDE.md) and [../AGENTS.md](../AGENTS.md).
