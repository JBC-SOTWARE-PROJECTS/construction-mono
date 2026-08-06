# Frontend Documentation Index

This documentation describes the active Next.js application in `payroll-accounting/`. It is intentionally specific to the current codebase, not a generic Next.js guide. Use the backend’s authenticated live GraphQL schema and nearby feature code as the authority for exact API contracts.

## Read in this order

1. [Architecture](ARCHITECTURE.md) — request lifecycle, layers, routing, layout, context, and access control.
2. [Development](DEVELOPMENT.md) — safe local setup, commands, type generation, and verification.
3. [Feature workflows](FEATURE_WORKFLOWS.md) — business screens and state-sensitive user journeys.
4. [Data and integrations](DATA_AND_INTEGRATIONS.md) — GraphQL, REST, uploads, downloads/reports, and environment configuration.
5. [UI and access conventions](UI_AND_ACCESS_CONVENTIONS.md) — how to add screens, hooks, modals/forms, status actions, and permissions consistently.

## Fast map

| Concern | Main location |
| --- | --- |
| Application/provider shell | `pages/_app.tsx`, `pages/_document.tsx` |
| URL routes | `pages/` |
| Feature screen implementations | `routes/` |
| Reusable UI and dialogs | `components/` |
| GraphQL data hooks | `hooks/`, `graphql/` |
| Generated GraphQL types | `graphql/gql/` |
| Apollo + Axios clients | `utility/graphql-client.ts` |
| Authentication and UI access | `components/accessControl/` |
| Module menus/layout | `components/layout/`, `components/sidebar/` |
| Configuration | `shared/settings.ts`, `next.config.js`, `codegen.ts` |
| Shared types/constants/helpers | `interface/`, `utility/`, `constant/`, `theme/`, `styles/` |

## Ground rules

- `backend/` is the API owner. The frontend must not replace server-side authorization, company isolation, status guards, or accounting behavior with client-only checks.
- Keep URL wrappers in `pages/`, implementations in `routes/`, shared UI in `components/`, and reusable remote-data behavior in `hooks/` unless a nearby feature has an established exception.
- Use generated GraphQL types; regenerate after a schema change. Do not hand-edit `graphql/gql/`.
- Preserve cookie-based authentication and the existing Apollo/Axios client. Do not introduce a feature-specific token flow.
- Treat session cookies, default credentials, API URLs, object-storage URLs, and any configuration values as sensitive. Never copy secrets into documentation, tests, or commits.
- Status actions in inventory, payroll, accounting, and cashiering are business actions. Keep confirmation, permission, mutation, error, and refetch behavior intact.
