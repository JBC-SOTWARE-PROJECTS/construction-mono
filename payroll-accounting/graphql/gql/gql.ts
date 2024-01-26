/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation DeleteIntegration($integrationId: UUID) {\n    deleteIntegration(integrationId: $integrationId)\n  }\n": types.DeleteIntegrationDocument,
    "\n  mutation DeleteIntegrationItem(\n    $integrationId: UUID\n    $integrationItemId: UUID\n  ) {\n    deleteIntegrationItem(\n      integrationId: $integrationId\n      integrationItemId: $integrationItemId\n    )\n  }\n": types.DeleteIntegrationItemDocument,
    "\n  mutation AddSubAccount($id: UUID, $accountId: UUID) {\n    addSubAccountToIntegration(id: $id, accountId: $accountId)\n  }\n": types.AddSubAccountDocument,
    "\n  mutation UpdateIntegrationItem(\n    $fields: Map_String_ObjectScalar\n    $integrationId: UUID\n    $integrationItemId: UUID\n  ) {\n    updateIntegrationItem(\n      fields: $fields\n      integrationId: $integrationId\n      integrationItemId: $integrationItemId\n    )\n  }\n": types.UpdateIntegrationItemDocument,
    "\n  mutation TransferIntegration($id: UUID, $fields: Map_String_ObjectScalar) {\n    transferIntegration(id: $id, fields: $fields)\n  }\n": types.TransferIntegrationDocument,
    "\n  mutation updatePayrollAllowanceStatus(\n    $payrollId: UUID\n    $status: PayrollStatus\n  ) {\n    data: updatePayrollAllowanceStatus(payrollId: $payrollId, status: $status) {\n      success\n      message\n      response\n    }\n  }\n": types.UpdatePayrollAllowanceStatusDocument,
    "\n  mutation updatePayrollContributionStatus(\n    $payrollId: UUID\n    $status: PayrollStatus\n  ) {\n    data: updatePayrollContributionStatus(\n      payrollId: $payrollId\n      status: $status\n    ) {\n      success\n      message\n      response\n    }\n  }\n": types.UpdatePayrollContributionStatusDocument,
    "\n  mutation ChangePassword($username: String, $password: String) {\n    newPassword: changePassword(username: $username, password: $password)\n  }\n": types.ChangePasswordDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteIntegration($integrationId: UUID) {\n    deleteIntegration(integrationId: $integrationId)\n  }\n"): (typeof documents)["\n  mutation DeleteIntegration($integrationId: UUID) {\n    deleteIntegration(integrationId: $integrationId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteIntegrationItem(\n    $integrationId: UUID\n    $integrationItemId: UUID\n  ) {\n    deleteIntegrationItem(\n      integrationId: $integrationId\n      integrationItemId: $integrationItemId\n    )\n  }\n"): (typeof documents)["\n  mutation DeleteIntegrationItem(\n    $integrationId: UUID\n    $integrationItemId: UUID\n  ) {\n    deleteIntegrationItem(\n      integrationId: $integrationId\n      integrationItemId: $integrationItemId\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddSubAccount($id: UUID, $accountId: UUID) {\n    addSubAccountToIntegration(id: $id, accountId: $accountId)\n  }\n"): (typeof documents)["\n  mutation AddSubAccount($id: UUID, $accountId: UUID) {\n    addSubAccountToIntegration(id: $id, accountId: $accountId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateIntegrationItem(\n    $fields: Map_String_ObjectScalar\n    $integrationId: UUID\n    $integrationItemId: UUID\n  ) {\n    updateIntegrationItem(\n      fields: $fields\n      integrationId: $integrationId\n      integrationItemId: $integrationItemId\n    )\n  }\n"): (typeof documents)["\n  mutation UpdateIntegrationItem(\n    $fields: Map_String_ObjectScalar\n    $integrationId: UUID\n    $integrationItemId: UUID\n  ) {\n    updateIntegrationItem(\n      fields: $fields\n      integrationId: $integrationId\n      integrationItemId: $integrationItemId\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation TransferIntegration($id: UUID, $fields: Map_String_ObjectScalar) {\n    transferIntegration(id: $id, fields: $fields)\n  }\n"): (typeof documents)["\n  mutation TransferIntegration($id: UUID, $fields: Map_String_ObjectScalar) {\n    transferIntegration(id: $id, fields: $fields)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updatePayrollAllowanceStatus(\n    $payrollId: UUID\n    $status: PayrollStatus\n  ) {\n    data: updatePayrollAllowanceStatus(payrollId: $payrollId, status: $status) {\n      success\n      message\n      response\n    }\n  }\n"): (typeof documents)["\n  mutation updatePayrollAllowanceStatus(\n    $payrollId: UUID\n    $status: PayrollStatus\n  ) {\n    data: updatePayrollAllowanceStatus(payrollId: $payrollId, status: $status) {\n      success\n      message\n      response\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updatePayrollContributionStatus(\n    $payrollId: UUID\n    $status: PayrollStatus\n  ) {\n    data: updatePayrollContributionStatus(\n      payrollId: $payrollId\n      status: $status\n    ) {\n      success\n      message\n      response\n    }\n  }\n"): (typeof documents)["\n  mutation updatePayrollContributionStatus(\n    $payrollId: UUID\n    $status: PayrollStatus\n  ) {\n    data: updatePayrollContributionStatus(\n      payrollId: $payrollId\n      status: $status\n    ) {\n      success\n      message\n      response\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangePassword($username: String, $password: String) {\n    newPassword: changePassword(username: $username, password: $password)\n  }\n"): (typeof documents)["\n  mutation ChangePassword($username: String, $password: String) {\n    newPassword: changePassword(username: $username, password: $password)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;