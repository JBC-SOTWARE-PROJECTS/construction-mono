import { gql } from "@apollo/client";

export const GET_2307_LIST_PAGE = gql`
  query (
    $filter: String!
    $supplier: UUID
    $start: String
    $end: String
    $status: Boolean
    $size: Int
    $page: Int
  ) {
    wtxListPage(
      filter: $filter
      supplier: $supplier
      start: $start
      end: $end
      status: $status
      size: $size
      page: $page
    ) {
      content {
        id
        refId
        sourceDoc
        refNo
        wtxDate
        supplier {
          id
          supplierFullname
        }
        type
        gross
        vatAmount
        netVat
        ewtAmount
        process
        wtxConsolidated
      }
      totalElements
      size
      number
    }
  }
`;
export const GET_2307_CONSOLIDATED_PAGE = gql`
  query (
    $filter: String!
    $supplier: UUID
    $start: String
    $end: String
    $size: Int
    $page: Int
  ) {
    wtxConListPage(
      filter: $filter
      supplier: $supplier
      start: $start
      end: $end
      size: $size
      page: $page
    ) {
      content {
        id
        refNo
        dateFrom
        dateTo
        supplier {
          id
          supplierFullname
        }
        remarks
        ewtAmount
        createdDate
      }
      totalElements
      size
      number
    }
  }
`;

export const UPSERT_CONSOLIDATED_WTX = gql`
  mutation (
    $fields: Map_String_ObjectScalar
    $items: [Map_String_ObjectScalar]
    $id: UUID
    $supplier: UUID
  ) {
    upsertConsolidated(
      fields: $fields
      items: $items
      id: $id
      supplier: $supplier
    ) {
      id
    }
  }
`;

export const GET_WTX_LIST_BY_REF = gql`
  query ($id: UUID) {
    wtxListByRef(id: $id) {
      id
      wtxDate
      sourceDoc
      refNo
      supplier {
        id
        supplierFullname
      }
      ewtAmount
    }
  }
`;

export const REMOVE_WTX_FROM_CONSOLIDATED = gql`
  mutation ($id: UUID, $status: Boolean, $ref: UUID) {
    update2307(id: $id, status: $status, ref: $ref) {
      id
    }
  }
`;