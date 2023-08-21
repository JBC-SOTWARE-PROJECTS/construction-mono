import { gql } from "@apollo/client";

export const GET_POSITION_RECORDS = gql`
  query ($filter: String!, $size: Int, $page: Int) {
    positionPage(filter: $filter, size: $size, page: $page) {
      content {
        id
        code
        description
        status
      }
      totalElements
      number
      size
    }
  }
`;

export const UPSER_POSITION_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertPosition(id: $id, fields: $fields) {
      id
    }
  }
`;
