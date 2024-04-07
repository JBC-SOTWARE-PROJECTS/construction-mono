import { gql } from "@apollo/client";

export const GET_JOURNAL_POSTED = gql`
  query ($id: UUID) {
    ledgerView(id: $id) {
      code
      desc
      debit
      credit
    }
  }
`;

export const GET_SUPPLIER_OPTIONS = gql`
  query ($filter: String!, $size: Int, $page: Int) {
    list: supplier_list_pageable_active(
      filter: $filter
      size: $size
      page: $page
    ) {
      content {
        value: id
        label: supplierFullname
      }
      totalElements
    }
  }
`;

export const GET_SUPPLIER_LIST = gql`
  query ($filter: String!, $size: Int, $page: Int) {
    supplier_list_pageable_active(filter: $filter, size: $size, page: $page) {
      content {
        id
        supplierFullname
        supplierEmail
        paymentTerms {
          id
          paymentDesc
        }
        supplierTypes {
          id
          supplierTypeDesc
        }
        primaryContactPerson
        isVatable
        isVatInclusive
      }
      totalElements
    }
  }
`;

export const GET_OFFICE_OPTIONS = gql`
  query ($filter: String!, $size: Int, $page: Int) {
    list: officePageList(filter: $filter, page: $page, pageSize: $size) {
      content {
        value: id
        label: departmentName
      }
      totalElements
    }
  }
`;

export const GET_RECORDS_PAYABLES = gql`
  query (
    $filter: String
    $supplier: UUID
    $status: Boolean
    $start: String
    $end: String
    $page: Int!
    $size: Int!
  ) {
    apListFilter(
      filter: $filter
      supplier: $supplier
      status: $status
      start: $start
      end: $end
      page: $page
      size: $size
    ) {
      content {
        id
        receiving {
          id
          rrNo
        }
        apNo
        supplier {
          id
          supplierFullname
          supplierEmail
          supplierTypes {
            id
            supplierTypeDesc
          }
          primaryContactPerson
        }
        apCategory
        paymentTerms {
          id
          paymentDesc
        }
        transType {
          id
          description
        }
        apvDate
        dueDate
        invoiceNo
        grossAmount
        discountAmount
        netOfDiscount
        vatRate
        vatAmount
        netOfVat
        ewtAmount
        netAmount
        remarksNotes
        postedLedger
        posted
        appliedAmount
        balance
        status
        postedBy
        disbursement
        dmRefNo
        referenceType
        isBeginningBalance
      }
      totalElements
      size
      number
    }
  }
`;

export const GET_AP_ITEMS = gql`
  query ($id: UUID) {
    detailsByAp(id: $id) {
      id
      transType {
        id
        description
      }
      office {
        id
        officeDescription
      }
      project {
        id
        description
      }
      assets {
        id
        description
      }
      amount
      discRate
      discAmount
      vatInclusive
      vatAmount
      taxDesc
      ewtRate
      ewtAmount
      netAmount
      refNo
      remarksNotes
    }
  }
`;

export const GET_REC_ITEMS_RECORDS = gql`
  query ($id: UUID) {
    recItemByParent(id: $id) {
      id
      receivingReport {
        id
        rrNo
      }
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

export const UPSERT_PAYABLE_RECORD = gql`
  mutation (
    $fields: Map_String_ObjectScalar
    $items: [Map_String_ObjectScalar]
    $id: UUID
  ) {
    upsertPayables(fields: $fields, items: $items, id: $id) {
      id
    }
  }
`;

export const UPDATE_PAYABLE_STATUS = gql`
  mutation ($id: UUID, $status: String) {
    updateAPStatus(id: $id, status: $status) {
      id
    }
  }
`;

export const REMOVE_AP_DETAILS = gql`
  mutation ($id: UUID) {
    removeApDetails(id: $id) {
      id
    }
  }
`;

export const GET_AP_LIST_POSTED_BY_SUPPLIER = gql`
  query ($filter: String, $supplier: UUID) {
    apListBySupplier(filter: $filter, supplier: $supplier) {
      id
      apvDate
      apNo
      invoiceNo
      discountAmount
      ewtAmount
      appliedAmount
      debitAmount
      balance
    }
  }
`;

export const GET_AP_AUTO_ENTRIES = gql`
  query ($id: UUID, $status: Boolean) {
    apAccountView(id: $id, status: $status) {
      code
      desc
      debit
      credit
    }
  }
`;

export const POST_ACCOUNT_PAYABLE = gql`
  mutation ($id: UUID, $status: Boolean) {
    postAp(id: $id, status: $status) {
      id
    }
  }
`;

export const POST_ACCOUNT_PAYABLE_MANUAL = gql`
  mutation (
    $id: UUID
    $header: Map_String_ObjectScalar
    $entries: [Map_String_ObjectScalar]
  ) {
    postApManual(id: $id, header: $header, entries: $entries) {
      payload
      success
      message
    }
  }
`;

export const GET_AP_ADVANCE_SUPPLIER = gql`
  query ($supplier: UUID, $id: UUID) {
    apBeginning(supplier: $supplier, id: $id)
  }
`;
