import { gql } from "@apollo/client";

export const UPSERT_ASSET_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertAsset(id: $id, fields: $fields) {
      id
    }
  }
`;