# Frontend Development Guide

## Prerequisites

- Node.js 16 is the known Docker baseline.
- Yarn 1 is the established package manager and is used in the Docker build/codegen script.
- A running, safe local backend at `http://localhost:5827`, with Redis/PostgreSQL configured for it.
- An approved local account/session for GraphQL introspection and end-to-end workflow checks.

Do not use production credentials, session cookies, or databases to make local setup work.

## Install and run

```bash
cd payroll-accounting
yarn
yarn dev
```

The `dev` script explicitly runs Next.js on port **7001**. The local API base (`apiUrlPrefix`) is `http://localhost:5827` in `shared/settings.ts`.

`frontEndUrl` in the same file still identifies `http://localhost:6060` in development. Some menu items use that value. This is a known configuration mismatch: account for it when testing external-menu links, and change it only as intentional configuration work with the affected link/deployment behavior validated.

The development login imports `defaultaccount` through `shared/devsettings.ts`. That local convenience file is not part of the committed project. Never add real credentials to it or commit it just to satisfy the import; use the team-approved local setup instead.

## Commands

```bash
yarn dev       # Next.js development server on port 7001
yarn lint      # Next.js ESLint checks
yarn build     # production Next.js build/type check
yarn start     # serve an existing production build
yarn codegen   # fetch GraphQL schema and regenerate graphql/gql
```

Run `yarn lint` and `yarn build` for frontend changes when dependencies and environment allow. This codebase has no dedicated test suite/configuration in the current tree, so lint/build are not substitute user-workflow verification.

## TypeScript and imports

`tsconfig.json` enables strict mode, `noEmit`, `isolatedModules`, and the `@/*` alias rooted at the project. Use alias imports for project modules and generated GraphQL types where available. Avoid adding new untyped `any` values when an existing generated type, interface, or local discriminated state type can describe the data.

The project supports some JavaScript for legacy code, but new feature code should follow the existing `.ts`/`.tsx` TypeScript convention. Keep dynamic-route parameters, nullable query values, form values, and GraphQL enum/ID types explicit.

## GraphQL code generation

The backend is code-first GraphQL. The frontend config introspects the local endpoint and writes generated client artifacts into `graphql/gql/`.

```bash
cd payroll-accounting
yarn codegen
```

Run this after a backend schema change that is consumed by the frontend, then review the generated diff. Never hand-edit files in `graphql/gql/`. The current codegen configuration includes authentication material for schema access; treat it as sensitive and never paste it into a terminal log, issue, documentation, or replacement configuration.

If codegen fails, first verify the local backend is running, authentication/session access is valid, and the requested GraphQL schema change is actually deployed locally. Do not bypass codegen by inventing local types for changed schema fields.

## Feature implementation workflow

1. Locate the target URL wrapper in `pages/`, its route implementation, current GraphQL operations/hooks, and backend service.
2. Check how the existing screen applies `AccessManager` roles and `AccessControl` permissions.
3. Identify status/approval/finalization behavior, confirmation dialogs, reporting/upload paths, and company/accounting implications.
4. Make the smallest cohesive change. Keep page, route, component, hook, GraphQL, and backend contracts aligned.
5. Regenerate types if the GraphQL schema changed.
6. Run lint/build and exercise the actual user path with safe local data.

## Verification matrix

| Change | Verify |
| --- | --- |
| New/changed page | direct URL, title/layout, loading state, expected roles, and responsive/basic navigation behavior |
| Query/filter/table | loading, empty result, pagination, filter reset, error response, and data scoped to the signed-in company |
| Mutation/form | form validation, success feedback, server error feedback, refetch/cache refresh, and no duplicate submit |
| Status/action | confirmation/password confirmation where used, invalid-state behavior, permission denial, final view data, and backend result |
| Upload | authenticated multipart request, type/size failure, completed document/image rendering, and cleanup/error state |
| Report/download | correct path/query parameters, new-tab/download result, content for current company, and failure/unauthorized response |
| Backend schema change | regenerated types, compiled call sites, and compatible UI behavior |

For payroll, inventory, accounting, cashiering, or project posting workflows, document whether the backend state/ledger effect was verified. A successful modal close or toast is not sufficient evidence.

## Build and deployment

The Dockerfile uses `node:16-alpine`, installs dependencies with Yarn, runs `yarn build`, then launches `yarn start`. Production API/UI URLs are selected in `shared/settings.ts` by `NODE_ENV`; do not hard-code alternate endpoints in features. Any URL, deployment, cookie, asset CDN, or object-storage change needs an end-to-end authenticated browser check after deployment.

## Working-tree discipline

- Preserve unrelated user changes and generated output.
- Do not broad-format route/component trees as incidental cleanup.
- Review GraphQL generated output, route/menu changes, and configuration edits carefully.
- Do not expose passwords, sessions, API credentials, customer data, payroll figures, or object-storage keys in review notes.
