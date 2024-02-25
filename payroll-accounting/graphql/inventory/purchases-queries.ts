import { gql } from "@apollo/client";

export const GET_RECORDS_PURCHASE_REQUEST = gql`
  query (
    $filter: String
    $office: UUID
    $category: String
    $status: String
    $project: UUID
    $asset: UUID
    $page: Int
    $size: Int
  ) {
    prByFiltersPageNoDate(
      filter: $filter
      office: $office
      category: $category
      status: $status
      project: $project
      asset: $asset
      page: $page
      size: $size
    ) {
      content {
        id
        prNo
        prDateRequested
        prDateNeeded
        project {
          id
          description
        }
        assets {
          id
          description
        }
        supplier {
          id
          supplierFullname
        }
        requestingOffice {
          id
          officeDescription
        }
        requestedOffice {
          id
          officeDescription
        }
        category
        prType
        isApprove
        status
        userId
        userFullname
        remarks
      }
      totalElements
      totalPages
      size
      number
    }
  }
`;

export const UPSERT_RECORD_ITEM = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertItem(id: $id, fields: $fields) {
      payload
      success
      message
    }
  }
`;

export const GET_RECORDS_PURCHASE_ORDER = gql`
  query (
    $filter: String
    $office: UUID
    $category: String
    $project: UUID
    $asset: UUID
    $supplier: UUID
    $page: Int
    $size: Int
  ) {
    poByFiltersPageNoDate(
      filter: $filter
      office: $office
      category: $category
      project: $project
      asset: $asset
      supplier: $supplier
      page: $page
      size: $size
    ) {
      content {
        id
        poNumber
        preparedDate
        etaDate
        supplier {
          id
          supplierFullname
        }
        paymentTerms {
          id
          paymentDesc
        }
        prNos
        office {
          id
          officeDescription
        }
        project {
          id
          description
        }
        category
        assets {
          id
          description
        }
        remarks
        isApprove
        status
        userId
        preparedBy
        noPr
        isCompleted
        isVoided
        remarks
      }
      totalElements
      totalPages
      size
      number
    }
  }
`;