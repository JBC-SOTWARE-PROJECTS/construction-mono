import { gql } from "@apollo/client";

export const GET_DEBIT_MEMO_RECORDS = gql`
  query (
    $filter: String
    $supplier: UUID
    $type: String
    $start: String
    $end: String
    $status: Boolean
    $page: Int!
    $size: Int!
  ) {
    debitMemoFilter(
      filter: $filter
      supplier: $supplier
      type: $type
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
        bank {
          id
          bankname
        }
        referenceType
        referenceNo
        debitNo
        debitDate
        debitType
        debitCategory
        discount
        ewtAmount
        memoAmount
        appliedAmount
        remarksNotes
        status
        posted
        postedBy
        postedLedger
      }
      totalElements
      size
      number
    }
  }
`;

export const GET_DEBIT_MEMO_TRANSACTIONS = gql`
  query ($id: UUID) {
    apDebitMemo(id: $id) {
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
    dmDetials(id: $id) {
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
      type
      percent
      amount
      remarks
    }
    disWtxByDebitMemo(id: $id) {
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

export const UPSERT_DEBITMEMO_RECORD = gql`
  mutation (
    $id: UUID
    $fields: Map_String_ObjectScalar
    $items: [Map_String_ObjectScalar]
    $details: [Map_String_ObjectScalar]
    $wtx: [Map_String_ObjectScalar]
  ) {
    upsertDebitMemo(
      id: $id
      fields: $fields
      items: $items
      details: $details
      wtx: $wtx
    ) {
      id
    }
  }
`;
export const REMOVE_DM_DETAILS_RECORD = gql`
  mutation ($id: UUID, $parent: UUID) {
    removeDmDetails(id: $id, parent: $parent) {
      id
    }
  }
`;

export const REMOVE_DM_AP_RECORD = gql`
  mutation ($id: UUID, $parent: UUID, $type: String) {
    removeDMAPDetails(id: $id, parent: $parent, type: $type) {
      id
    }
  }
`;

export const UPDATE_DEBITMEMO_STATUS = gql`
  mutation ($id: UUID, $status: String) {
    updateDmStatus(id: $id, status: $status) {
      id
    }
  }
`;

// ====================== queries ========================
export const GET_DM_AUTO_ENTRIES = gql`
  query ($id: UUID, $status: Boolean) {
    dmAccountView(id: $id, status: $status) {
      code
      desc
      debit
      credit
    }
  }
`;

export const POST_DEBITMEMO_PAYABLE = gql`
  mutation ($id: UUID, $status: Boolean) {
    postDM(id: $id, status: $status) {
      id
    }
  }
`;

export const POST_ACCOUNT_DEBITMEMO_MANUAL = gql`
  mutation UpdateItem(
    $id: UUID
    $header: Map_String_ObjectScalar
    $entries: [Map_String_ObjectScalar]
  ) {
    postDManual(id: $id, header: $header, entries: $entries) {
      payload
      success
      message
    }
  }
`;
