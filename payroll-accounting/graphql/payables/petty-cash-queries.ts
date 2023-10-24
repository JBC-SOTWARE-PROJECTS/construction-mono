import { gql } from "@apollo/client";

export const GET_PETTY_CASH_RECORDS = gql`
  query (
    $filter: String
    $payee: String
    $status: Boolean
    $start: String
    $end: String
    $page: Int!
    $size: Int!
  ) {
    pettyCashPage(
      filter: $filter
      payee: $payee
      status: $status
      start: $start
      end: $end
      page: $page
      size: $size
    ) {
      content {
        id
        transType {
          id
          description
        }
        payeeName
        pcvNo
        pcvDate
        pcvCategory
        amountIssued
        amountUsed
        amountUnused
        vatInclusive
        vatRate
        status
        posted
        postedLedger
        remarks
        posted_by
      }
      totalElements
      size
      number
    }
  }
`;

export const GET_RECORDS_ITEMS = gql`
  query ($filter: String, $page: Int, $size: Int) {
    itemsByFilterOnly(filter: $filter, page: $page, size: $size) {
      content {
        id
        sku
        itemCode
        item_group {
          id
          itemDescription
        }
        item_category {
          id
          categoryDescription
        }
        descLong
        brand
        unitMeasurement
        unit_of_purchase {
          id
          unitDescription
        }
        unit_of_usage {
          id
          unitDescription
        }
        item_conversion
        active
        production
        consignment
        fixAsset
      }
      totalElements
      totalPages
      size
      number
    }
  }
`;

export const UPSERT_PETTY_CASH_RECORD = gql`
  mutation (
    $id: UUID
    $fields: Map_String_ObjectScalar
    $items: [Map_String_ObjectScalar]
    $others: [Map_String_ObjectScalar]
  ) {
    upsertPettyCashAccounting(
      id: $id
      fields: $fields
      items: $items
      others: $others
    ) {
      id
    }
  }
`;

export const UPDATE_PETTY_CASH_STATUS = gql`
  mutation ($id: UUID, $status: String) {
    updatePettyCashStatus(id: $id, status: $status) {
      id
    }
  }
`;

export const GET_PCV_ITEMS = gql`
  query ($id: UUID) {
    purchaseItemsByPetty(id: $id) {
      id
      item {
        id
        descLong
        unitMeasurement
        sku
        itemCode
        item_conversion
        item_group {
          id
          itemDescription
        }
        item_category {
          id
          categoryDescription
        }
        unit_of_purchase {
          id
          unitDescription
        }
        unit_of_usage {
          id
          unitDescription
        }
      }
      department {
        id
        departmentName
      }
      uou
      descLong
      unitMeasurement
      qty
      unitCost
      inventoryCost
      grossAmount
      discRate
      discAmount
      netDiscount
      expirationDate
      lotNo
      isVat
      vatAmount
      netAmount
      isPosted
    }
    othersByPetty(id: $id) {
      id
      transType {
        id
        description
      }
      department {
        id
        departmentName
      }
      amount
      remarks
    }
  }
`;

export const REMOVE_PETTYCASH_OTHERS = gql`
  mutation ($id: UUID) {
    removeOthersById(id: $id) {
      id
    }
  }
`;

export const REMOVE_PETTYCASH_ITEM = gql`
  mutation ($id: UUID) {
    removePettyCashItemById(id: $id) {
      id
    }
  }
`;
