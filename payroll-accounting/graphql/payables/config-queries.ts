import { gql } from "@apollo/client";


export const GET_TRANSACTION_TYPE_RECORDS = gql`
  query (
    $desc: String
    $type: UUID
    $category: String
    $page: Int!
    $size: Int!
  ) {
    apTransactionPage(
      desc: $desc
      type: $type
      category: $category
      page: $page
      size: $size
    ) {
      content {
        id
        supplierType {
          id
          supplierTypeCode
          supplierTypeDesc
        }
        flagValue
        category
        description
        status
      }
      totalElements
      size
      number
    }
  }
`;

export const UPSERT_TRANSACTION_TYPE = gql`
  mutation ($fields: Map_String_ObjectScalar, $id: UUID) {
    upsertApTransaction(fields: $fields, id: $id) {
      id
    }
  }
`;
// ======================== EXPENSE TRANSACTION TYPES ===================
export const GET_EXP_TRANSACTION_TYPES = gql`
  query ($type: String, $filter: String) {
    transTypeByType(type: $type, filter: $filter) {
      id
      description
      type
      source
      status
      isReverse
      remarks
    }
  }
`;

export const UPSERT_EXP_TRANSACTION_RECORD = gql`
  mutation ($fields: Map_String_ObjectScalar, $id: UUID) {
    upsertExTransType(fields: $fields, id: $id) {
      payload
      success
      message
    }
  }
`;

// =========================== REPORTS ==============================
export const GET_LEDGER_RECORDS = gql`
  query ($supplier: UUID, $start: String, $end: String, $filter: String) {
    apLedger(supplier: $supplier, start: $start, end: $end, filter: $filter) {
      id
      supplier_fullname
      ledger_type
      ledger_date
      ref_no
      ref_id
      debit
      credit
      running_balance
      out_balance
      beg_balance
    }
  }
`;

export const GET_AGING_SUMMARY_RECORDS = gql`
  query ($filter: String, $supplierTypes: UUID, $posted: Boolean) {
    apAgingSummary(
      filter: $filter
      supplierTypes: $supplierTypes
      posted: $posted
    ) {
      id
      supplier
      supplier_type
      current_amount
      day_1_to_31
      day_31_to_60
      day_61_to_90
      day_91_to_120
      older
      total
    }
  }
`;

export const GET_AGING_DETAILED_RECORDS = gql`
  query (
    $filter: String
    $supplier: UUID
    $supplierTypes: UUID
    $posted: Boolean
  ) {
    apAgingDetailed(
      filter: $filter
      supplier: $supplier
      supplierTypes: $supplierTypes
      posted: $posted
    ) {
      id
      ap_no
      supplier
      supplier_type
      ap_category
      invoice_date
      apv_date
      due_date
      invoice_no
      current_amount
      day_1_to_31
      day_31_to_60
      day_61_to_90
      day_91_to_120
      older
      total
    }
  }
`;
