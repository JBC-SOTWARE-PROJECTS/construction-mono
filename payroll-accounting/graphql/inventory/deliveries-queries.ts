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
        transType {
          id
          description
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

export const GET_RECORDS_RETURN_ITEMS = gql`
  query ($id: UUID) {
    rtsItemByParent(id: $id) {
      id
      item {
        id
        descLong
        item_conversion
        vatable
        unit_of_usage {
          id
          unitDescription
        }
      }
      uou
      returnQty
      returnUnitCost
      return_remarks
      isPosted
    }
  }
`;

export const GET_JOURNAL_RETURN_SUPPLIER = gql`
  query ($id: UUID, $status: Boolean) {
    returnSupplierAccountView(id: $id, status: $status) {
      code
      desc
      debit
      credit
    }
  }
`;

export const UPSERT_RECORD_RETURN_ITEMS = gql`
  mutation (
    $fields: Map_String_ObjectScalar
    $items: [Map_String_ObjectScalar]
    $id: UUID
  ) {
    upsertRTS(fields: $fields, items: $items, id: $id) {
      id
    }
  }
`;

export const DELETE_RECORD_RETURN_ITEM = gql`
  mutation ($id: UUID) {
    removeRtsItem(id: $id) {
      id
    }
  }
`;

export const POST_VOID_RETURN_SUPPLIER = gql`
  mutation ($id: UUID, $items: [Map_String_ObjectScalar], $status: Boolean) {
    postReturnInventory(id: $id, items: $items, status: $status) {
      id
    }
  }
`;
