import { gql } from "@apollo/client";

// ================================ accounts template =================================
export const GET_TEMPLATE_ACCOUNTS_ITEMS = gql`
  query ($id: UUID) {
    accountsItemsByParent(id: $id) {
      id
      code
      desc
      accountType
    }
  }
`;

export const UPSERT_TEMPLATE_ACCOUNTS_ITEMS = gql`
  mutation ($id: UUID, $entries: [Map_String_ObjectScalar]) {
    upsertAccountTemplateItem(id: $id, entries: $entries) {
      id
    }
  }
`;

export const REMOVE_TEMPLATE_ACCOUNT_ITEM = gql`
  mutation ($id: UUID) {
    removeAccountTemplateItem(id: $id) {
      id
    }
  }
`;
