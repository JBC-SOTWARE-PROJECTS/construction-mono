import { gql } from '@apollo/client'

export const UPSERT_FIXED_ASSET = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertFixedAssetItems(id: $id, fields: $fields) {
      success
    }
  }
`
