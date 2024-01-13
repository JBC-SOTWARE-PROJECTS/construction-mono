import { gql } from "@apollo/client";

export const GET_DISBURSEMENT_RECORD = gql`
  query (
    $filter: String
    $supplier: UUID
    $status: Boolean
    $start: String
    $end: String
    $page: Int!
    $size: Int!
  ) {
    disbursementFilter(
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
        transType {
          id
          description
        }
        referenceType
        referenceNo
        payeeName
        disNo
        paymentCategory
        disType
        disDate
        cash
        checks
        discountAmount
        ewtAmount
        voucherAmount
        appliedAmount
        status
        isAdvance
        posted
        postedLedger
        postedBy
        remarksNotes
      }
      totalElements
      size
      number
    }
  }
`;

export const UPSERT_DISBURSEMENT_RECORD = gql`
  mutation (
    $fields: Map_String_ObjectScalar
    $checks: [Map_String_ObjectScalar]
    $ap: [Map_String_ObjectScalar]
    $expense: [Map_String_ObjectScalar]
    $wtx: [Map_String_ObjectScalar]
    $id: UUID
  ) {
    disbursementUpsert(
      fields: $fields
      checks: $checks
      ap: $ap
      expense: $expense
      wtx: $wtx
      id: $id
    ) {
      id
    }
  }
`;

export const GET_DISBURSEMENT_AP_APPLICATION = gql`
  query ($id: UUID) {
    apAppByDis(id: $id) {
      id
      payable {
        id
        apvDate
        apNo
        invoiceNo
        discountAmount
        ewtAmount
        netOfVat
        appliedAmount
        debitAmount
        balance
      }
      appliedAmount
      vatRate
      vatInclusive
      vatAmount
      ewtDesc
      ewtRate
      ewtAmount
      grossAmount
      discount
      netAmount
    }
  }
`;

export const REMOVE_DISBURSEMENT_AP = gql`
  mutation ($id: UUID, $parent: UUID) {
    removeApApp(id: $id, parent: $parent) {
      id
    }
  }
`;

export const GET_DISBURSEMENT_CHECKS = gql`
  query ($id: UUID) {
    disCheckByParent(id: $id) {
      id
      bank {
        id
        bankname
      }
      bankBranch
      checkNo
      checkDate
      amount
    }
  }
`;

export const REMOVE_DISBURSEMENT_CHECK = gql`
  mutation ($id: UUID) {
    removeCheck(id: $id) {
      id
    }
  }
`;

export const GET_DISBURSEMENT_EXPENSE = gql`
  query ($id: UUID) {
    disExpByParent(id: $id) {
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
      amount
      remarks
    }
  }
`;

export const REMOVE_DISBURSEMENT_EXPENSE = gql`
  mutation ($id: UUID) {
    removeExpense(id: $id) {
      id
    }
  }
`;

export const GET_DISBURSEMENT_WTX = gql`
  query ($id: UUID) {
    disWtxByParent(id: $id) {
      id
      appliedAmount
      vatRate
      vatInclusive
      vatAmount
      ewtDesc
      ewtRate
      ewtAmount
      grossAmount
      netAmount
    }
  }
`;

export const REMOVE_DISBURSEMENT_WTX = gql`
  mutation ($id: UUID) {
    removeWtx(id: $id) {
      id
    }
  }
`;

export const UPDATE_DISBURSEMENT_STATUS = gql`
  mutation ($id: UUID, $status: String) {
    updateCKStatus(id: $id, status: $status) {
      id
    }
  }
`;

export const UPDATE_REAPPLICATION_STATUS = gql`
  mutation ($id: UUID, $status: String) {
    updateRPStatus(id: $id, status: $status) {
      id
    }
  }
`;

export const GET_REAPPLICATION_RECORD = gql`
  query (
    $filter: String
    $supplier: UUID
    $status: Boolean
    $start: String
    $end: String
    $page: Int!
    $size: Int!
  ) {
    reapplicationPageFilter(
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
        rpNo
        transType {
          id
          description
        }
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
        disbursement {
          id
          disDate
          disNo
          disType
          payeeName
          voucherAmount
          appliedAmount
        }
        referenceNo
        prevApplied
        discountAmount
        ewtAmount
        appliedAmount
        postedLedger
        status
        posted
        remarks
        createdDate
      }
      totalElements
      size
      number
    }
  }
`;

export const GET_RECORDS_AP_REAPPLICATION = gql`
  query ($id: UUID) {
    apReapplication(id: $id) {
      id
      payable {
        id
        apvDate
        apNo
        invoiceNo
        discountAmount
        ewtAmount
        netOfVat
        appliedAmount
        debitAmount
        balance
      }
      appliedAmount
      vatRate
      vatInclusive
      vatAmount
      ewtDesc
      ewtRate
      ewtAmount
      grossAmount
      discount
      netAmount
    }
  }
`;

export const UPSERT_REAPPLICATION_RECORD = gql`
  mutation ($id: UUID) {
    reapplicationUpsert(id: $id) {
      payload
      success
      message
    }
  }
`;

export const UPDATE_REAPPLICATION_RECORD = gql`
  mutation (
    $id: UUID
    $fields: Map_String_ObjectScalar
    $items: [Map_String_ObjectScalar]
  ) {
    updateReapply(id: $id, fields: $fields, items: $items) {
      id
    }
  }
`;

export const PRINT_DISBURSEMENT_CHECKS = gql`
  query (
    $filter: String
    $bank: UUID
    $supplier: UUID
    $start: String
    $end: String
    $size: Int
    $page: Int
  ) {
    printChecks(
      filter: $filter
      bank: $bank
      supplier: $supplier
      start: $start
      end: $end
      size: $size
      page: $page
    ) {
      content {
        id
        disbursement {
          id
          disNo
          disDate
          payeeName
          supplier {
            id
            supplierFullname
          }
        }
        bank {
          id
          bankname
        }
        releasing
        checkDate
        checkNo
        amount
      }
      totalElements
      size
      number
    }
  }
`;

// ========================== post accounting =============================
export const GET_CK_AUTO_ENTRIES = gql`
  query ($id: UUID, $status: Boolean) {
    disAccountView(id: $id, status: $status) {
      code
      desc
      debit
      credit
    }
  }
`;

export const POST_DISBURSEMENT_PAYABLE = gql`
  mutation ($id: UUID, $status: Boolean) {
    postDisbursement(id: $id, status: $status) {
      id
    }
  }
`;

export const POST_ACCOUNT_DISBURSEMENT_MANUAL = gql`
  mutation (
    $id: UUID
    $header: Map_String_ObjectScalar
    $entries: [Map_String_ObjectScalar]
  ) {
    postDsManual(id: $id, header: $header, entries: $entries) {
      payload
      success
      message
    }
  }
`;

export const GET_RP_AUTO_ENTRIES = gql`
  query ($id: UUID, $status: Boolean) {
    reapplyAccountView(id: $id, status: $status) {
      code
      desc
      debit
      credit
    }
  }
`;

export const GET_PCV_AUTO_ENTRIES = gql`
  query ($id: UUID, $status: Boolean) {
    pettyCashAccountView(id: $id, status: $status) {
      code
      desc
      debit
      credit
    }
  }
`;

export const POST_REAPPLICATION_PAYABLE = gql`
  mutation ($id: UUID, $status: Boolean) {
    postReapplication(id: $id, status: $status) {
      id
    }
  }
`;

export const POST_PETTY_CASH_PAYABLE = gql`
  mutation ($id: UUID, $status: Boolean) {
    postPettyCash(id: $id, status: $status) {
      id
    }
  }
`;

export const POST_ACCOUNT_REAPPLICATION_MANUAL = gql`
  mutation (
    $id: UUID
    $header: Map_String_ObjectScalar
    $entries: [Map_String_ObjectScalar]
  ) {
    postReappManual(id: $id, header: $header, entries: $entries) {
      payload
      success
      message
    }
  }
`;

export const POST_ACCOUNT_PETTYCASH_MANUAL = gql`
  mutation (
    $id: UUID
    $header: Map_String_ObjectScalar
    $entries: [Map_String_ObjectScalar]
  ) {
    postPettyCashManual(id: $id, header: $header, entries: $entries) {
      payload
      success
      message
    }
  }
`;
