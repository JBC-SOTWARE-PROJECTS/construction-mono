# Data and Integrations Guide

## GraphQL client

`utility/graphql-client.ts` owns the singleton Apollo Client. It sends GraphQL requests to `${apiUrlPrefix}/graphql` with `credentials: "include"`, preserving the backend HTTP session.

The default Apollo behavior is intentional:

| Operation | Fetch/error policy |
| --- | --- |
| `watchQuery` | `cache-and-network`, `errorPolicy: all` |
| `query` | `network-only`, `errorPolicy: all` |
| `mutate` | `errorPolicy: all` |

The error link redirects a browser 401 to `/login`. Feature components/hooks still need to render loading/error/result states appropriately; `errorPolicy: all` can deliver partial data and GraphQL errors together. Do not assume every unsuccessful business mutation arrives as a thrown network error.

## GraphQL documents, hooks, and generated types

GraphQL usage is organized in two compatible ways:

- Shared/query-heavy modules use documents under `graphql/<module>/` (account receivables, assets, billing, cashier, chart of accounts, company, employee, inventory, offices, payables, positions).
- Feature-local hooks often define their query/mutation adjacent to reusable behavior under `hooks/`.

The generated client schema types live in `graphql/gql/`. Import `Query`, `Mutation`, entity types, `Maybe`, and enums from there when a type exists. Do not declare a parallel approximation of a backend type just to avoid codegen.

Use the closest existing feature as the contract pattern. Some backend operations return direct data; others wrap results in success/message/payload/response envelopes. Inspect the operation and handle both GraphQL-level errors and the operation’s business success flag/message where present.

### Query/mutation lifecycle

1. Put a reusable remote-data action in a hook when it is shared, nontrivial, or has a stable feature API.
2. Type query/mutation data and variables where the generated schema supports it.
3. Pass explicit filters/pagination/status IDs and do not substitute empty strings for nullable IDs unless the operation expects it.
4. Use `loading` to prevent duplicate submissions and show the project’s standard progress state.
5. On success, use existing `refetch`, cache update, or callback behavior so tables/details reflect the server value.
6. Surface operation/business errors; do not silently close a dialog on failure.

The frontend generally uses zero-based `page` values because the backend uses Spring pagination. Preserve page reset behavior when filters change.

## REST client

The same module exposes Axios helpers: `get`, `post`, `put`, `patch`, and `_delete`. They prefix paths with `apiUrlPrefix`, send cookies (`withCredentials`), and add the existing request headers. Use them for the established login, upload, report, and special REST cases—not for normal GraphQL CRUD.

Do not create an alternate Axios/Apollo configuration inside a feature. Separate clients easily lose cookies, 401 handling, base URLs, and future common behavior.

## Uploads and object-backed documents

Ant Design upload components call backend multipart endpoints with `action: ${apiUrlPrefix}/...`. Current examples cover employee documents/profile pictures, vehicle usage documents, inventory attachments on PR/PO/receiving/issuance/returns, and project progress images.

For an upload change:

1. Use the endpoint already owned by the backend document type.
2. Send the session cookie and preserve the existing upload headers/fields.
3. Track uploading, success, and error states; only persist/refresh the parent record after the expected server result.
4. Display/download object-backed files using the existing URL conventions, without exposing credentials or assuming an arbitrary public URL.
5. Test invalid file, missing ID, permission failure, and the successful displayed/downloaded document.

The backend enforces a 50 MB multipart file/request limit. Client-side limits may improve UX but must not contradict server behavior.

## Reports and downloads

The frontend opens backend REST document/export routes with `window.open`, using either `apiUrlPrefix` or `getUrlPrefix()`. This is used for payroll forms/payslips, inventory transactions/reports, AR invoices/credit notes, AP documents/checks/2307, general ledger data, and financial reports.

Report/download changes must:

- retain required identifiers, date ranges, account/office filters, and path encoding;
- occur from a browser user action so popup blockers do not hide the result;
- preserve session cookies so the report is authenticated;
- handle missing/denied records visibly; and
- be checked against actual generated file content and current-company data.

## Configuration

`shared/settings.ts` centralizes the software name, API base URL, frontend URL, currency display, and object-storage/CDN URL prefix. It switches API/frontend targets according to `NODE_ENV`. `next.config.js` enables React strict mode; `config/config.ts` contains localization/navigation options.

The development script port (7001) and `frontEndUrl` development setting (6060) differ. Do not patch individual feature links around this mismatch. Fix the shared configuration only after determining the intended deployed/local URL and validating all affected custom-path menus.

`codegen.ts` reads the schema from the local backend and contains session configuration. It and any local default-account behavior are sensitive. Do not publish their values or replace them with a committed personal session.

## Cross-origin/session behavior

The browser frontend and local backend run on different origins/ports, so cookie/CORS behavior is essential. Both Apollo and Axios are configured to include credentials. Backend CORS/session-cookie policy must remain compatible with the deployed frontend origin and HTTPS behavior. If login succeeds but the account query returns 401, diagnose the session cookie/CORS/proxy configuration before changing a feature request.

## Integration change checklist

1. Identify whether GraphQL, REST, upload, report, object storage, or configuration is the appropriate integration.
2. Reuse the singleton client/base URL/session behavior.
3. Preserve current-company and permission/status semantics from the backend.
4. Handle loading, partial GraphQL errors, business success flags, and failure feedback.
5. Refetch/update view state after a successful mutation.
6. Regenerate typed GraphQL output after schema changes.
7. Test authenticated, unauthorized, wrong/expired-session, invalid-input, and successful paths with safe data.
