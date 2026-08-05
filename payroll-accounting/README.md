# DiverseTrade Payroll & Accounting Frontend

This is the active DiverseTrade browser application. It is a Next.js 13 Pages Router application built with React, TypeScript, Apollo Client, and Ant Design. It provides the user interface for inventory, accounting, HR/payroll, projects, assets, and administration through the backend’s session-authenticated GraphQL and REST APIs.

## Start here

```bash
cd payroll-accounting
yarn
yarn dev
```

The development server runs on `http://localhost:7001`; the local backend API is configured at `http://localhost:5827`. See [Development](docs/DEVELOPMENT.md) for prerequisites, code generation, configuration, and safe verification.

## Documentation

| Document | Use it for |
| --- | --- |
| [Documentation index](docs/README.md) | Navigating the frontend documentation set |
| [Architecture](docs/ARCHITECTURE.md) | App shell, routing, state, layout, authentication, and API flow |
| [Development](docs/DEVELOPMENT.md) | Setup, scripts, TypeScript, GraphQL codegen, and delivery checks |
| [Feature workflows](docs/FEATURE_WORKFLOWS.md) | Inventory, accounting, HR/payroll, projects, assets, and administration UI flows |
| [Data and integrations](docs/DATA_AND_INTEGRATIONS.md) | Apollo, REST, uploads, reports/downloads, configuration, and error handling |
| [UI and access conventions](docs/UI_AND_ACCESS_CONVENTIONS.md) | Page/route composition, components/hooks, forms, roles, permissions, and status changes |

Repository-wide developer/AI-agent instructions are in [../docs/SYSTEM_GUIDE.md](../docs/SYSTEM_GUIDE.md) and [../AGENTS.md](../AGENTS.md). Backend contract and operational documentation is in [../backend/docs/README.md](../backend/docs/README.md).
