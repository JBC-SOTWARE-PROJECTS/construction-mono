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

export const GET_RECORDS_PURCHASE_REQ_ITEMS = gql`
  query ($id: UUID) {
    prItemByParent(id: $id) {
      id
      item {
        id
        descLong
      }
      unitMeasurement
      requestedQty
      unitCost
      onHandQty
      remarks
    }
  }
`;

export const UPSERT_RECORD_PURCHASE_REQUEST = gql`
  mutation (
    $id: UUID
    $items: [Map_String_ObjectScalar]
    $fields: Map_String_ObjectScalar
  ) {
    upsertPR(id: $id, items: $items, fields: $fields) {
      id
    }
  }
`;

export const DELETE_RECORD_PURCHASE_REQUEST = gql`
  mutation ($id: UUID) {
    removePrItem(id: $id) {
      id
    }
  }
`;

export const UPSERT_RECORD_PR_STATUS = gql`
  mutation ($status: Boolean, $id: UUID) {
    updatePRStatus(status: $status, id: $id) {
      id
    }
  }
`;

// ====================== purchase order =========================
export const GET_RECORDS_PO_ITEMS = gql`
  query ($id: UUID) {
    poItemByParent(id: $id) {
      id
      item {
        id
        descLong
        item_conversion
      }
      unitMeasurement
      quantity
      unitCost
      prNos
      type
      type_text
    }
  }
`;

export const GET_PR_ITEMS_BY_PRNOS = gql`
  query ($prNos: String, $status: Boolean, $id: UUID) {
    getPrItemInOnePO(prNos: $prNos, status: $status, id: $id) {
      parent {
        id
        prNo
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
        category
        remarks
      }
      items {
        id
        item {
          id
          descLong
          item_conversion
        }
        purchaseRequest {
          id
          prNo
        }
        unitMeasurement
        unitCost
        requestedQty
      }
    }
  }
`;

export const UPSERT_RECORD_PURCHASE_ORDER = gql`
  mutation (
    $id: UUID
    $items: [Map_String_ObjectScalar]
    $forRemove: [Map_String_ObjectScalar]
    $fields: Map_String_ObjectScalar
  ) {
    upsertPO(id: $id, items: $items, forRemove: $forRemove, fields: $fields) {
      id
    }
  }
`;

export const DELETE_RECORD_PO_ITEM = gql`
  mutation ($id: UUID) {
    removePoItem(id: $id) {
      id
    }
  }
`;
