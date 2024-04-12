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
        account {
          id
          description
        }
        refAp
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

export const GET_JOURNAL_RECEIVING_REPORT = gql`
  query ($id: UUID, $status: Boolean) {
    receivingAccountView(id: $id, status: $status) {
      code
      desc
      debit
      credit
    }
  }
`;

export const POST_VOID_RECEIVING_REPORT = gql`
  mutation ($id: UUID, $items: [Map_String_ObjectScalar], $status: Boolean) {
    receivingPostInventory(id: $id, items: $items, status: $status) {
      id
    }
  }
`;

export const GET_RECEIVING_ITEMS = gql`
  query ($id: UUID) {
    recItemByParent(id: $id) {
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
      refPoItem {
        id
        purchaseOrder {
          id
          poNumber
        }
        qtyInSmall
        deliveredQty
        deliveryBalance
        unitCost
      }
      receiveQty
      receiveUnitCost
      recInventoryCost
      discountRate
      receiveDiscountCost
      isFg
      isDiscount
      isPartial
      isCompleted
      isTax
      expirationDate
      totalAmount
      inputTax
      netAmount
      isPosted
    }
  }
`;

export const GET_PO_ITEMS = gql`
  query ($id: UUID) {
    getPurchaserOrderChildren(id: $id) {
      parent {
        id
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
        remarks
      }
      items {
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
        purchaseOrder {
          id
          poNumber
        }
        unitMeasurement
        quantity
        unitCost
        qtyInSmall
        deliveredQty
        deliveryBalance
      }
    }
  }
`;

export const UPSERT_RECORD_DELIVERY_RECEIVING = gql`
  mutation (
    $id: UUID
    $items: [Map_String_ObjectScalar]
    $forRemove: [Map_String_ObjectScalar]
    $fields: Map_String_ObjectScalar
  ) {
    upsertRecNew(
      id: $id
      items: $items
      forRemove: $forRemove
      fields: $fields
    ) {
      id
    }
  }
`;

export const DELETE_RECORD_REC_ITEM = gql`
  mutation ($id: UUID) {
    removeRecItem(id: $id) {
      id
    }
  }
`;

export const REDO_SRR_TRANSACTION = gql`
  mutation ($id: UUID) {
    redoReceiving(id: $id) {
      id
    }
  }
`;

export const CHECKING_PO = gql`
  mutation ($id: UUID) {
    setToCompleted(id: $id) {
      id
    }
  }
`;

export const DRAFT_APV = gql`
  mutation ($id: UUID) {
    upsertPayablesByRec(id: $id) {
      id
    }
  }
`;
