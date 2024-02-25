import { gql } from "@apollo/client";

export const GET_RECORDS_DELIVERY_RECEIVING = gql`
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
    recByFiltersPageNoDate(
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
        receivedType
        rrNo
        receiveDate
        userId
        userFullname
        purchaseOrder {
          id
          poNumber
        }
        receivedRefNo
        receivedRefDate
        receivedOffice {
          id
          officeDescription
        }
        supplier {
          id
          supplierFullname
        }
        paymentTerms {
          id
          paymentDesc
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
        receivedRemarks
        fixDiscount
        grossAmount
        totalDiscount
        netDiscount
        amount
        vatRate
        inputTax
        netAmount
        vatInclusive
        isPosted
        isVoid
        account
      }
      totalElements
      totalPages
      size
      number
    }
  }
`;

export const GET_RECORDS_RETURNS = gql`
  query ($filter: String, $office: UUID, $page: Int, $size: Int) {
    rtsByFiltersPage(
      filter: $filter
      office: $office
      page: $page
      size: $size
    ) {
      content {
        id
        rtsNo
        returnDate
        refSrr
        receivedRefNo
        receivedRefDate
        office {
          id
          officeDescription
        }
        supplier {
          id
          supplierFullname
        }
        received_by
        returnBy
        returnUser
        isPosted
        isVoid
      }
      size
      totalElements
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
