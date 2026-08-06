# Instructions for AI Agents

This repository’s active application is `backend/` + `payroll-accounting/`. Read [docs/SYSTEM_GUIDE.md](docs/SYSTEM_GUIDE.md) before changing either. `frontend/` is a separate/legacy application unless the user explicitly includes it.

## Non-negotiable rules

- Preserve the authenticated company boundary. Use the server-derived company context; do not trust a client company ID for normal business writes or reads.
- Treat payroll, inventory, and accounting status changes as workflow changes. Trace their ledger/posting and dependent-module effects before editing.
- Keep GraphQL as the default business API. Backend GraphQL services are Spring components annotated with `@GraphQLApi`, `@GraphQLQuery`, and `@GraphQLMutation`; use REST only where its HTTP/binary/multipart purpose fits.
- Every persisted schema/data change needs a **new** Liquibase migration and one appended include in `backend/src/main/resources/config/liquibase/master.xml`. Never modify/reorder applied migrations.
- Frontend URLs belong in `pages/`; feature implementations normally belong in `routes/`; protect pages/actions using the existing `AccessManager` and `AccessControl` patterns.
- After a GraphQL schema change used by the UI, run `yarn codegen` in `payroll-accounting`; do not hand-edit generated `graphql/gql/` files.
- Never disclose, duplicate, or add secrets, session cookies, passwords, database endpoints, or object-storage keys. Do not test against production services without explicit user authorization.

## Verify proportionately

- Backend: `cd backend && ./gradlew build`
- Frontend: `cd payroll-accounting && yarn lint && yarn build`
- Run the affected workflow against safe local data. Explicitly report checks you could not run and whether financial/status/tenant effects were verified.

Known configuration detail: `yarn dev` runs the frontend on port 7001, while a shared `frontEndUrl` setting still uses port 6060. Treat a change to that mismatch as deliberate configuration work, not an incidental edit.
