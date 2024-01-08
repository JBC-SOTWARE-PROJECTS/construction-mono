import { gql } from '@apollo/client'

export const PAYMENT_TRACKER_OR_UN_POSTED = gql`
  query (
    $filter: String
    $companyId: UUID
    $size: Int
    $receiptType: String
    $page: Int
  ) {
    paymentTracker: getPaymentTrackerByCompanyId(
      filter: $filter
      companyId: $companyId
      size: $size
      receiptType: $receiptType
      page: $page
    ) {
      content {
        id
        companyId
        ornumber
      }
    }
  }
`

export const UPDATE_INSERT_AR_PAYMENT_POSTING = gql`
  mutation UpsertTableARPaymentPosting(
    $id: UUID
    $fields: Map_String_ObjectScalar
  ) {
    upsertTableARPaymentPosting(id: $id, fields: $fields) {
      response {
        id
      }
      success
      message
    }
  }
`

export const FIND_ALL_AR_PAYMENT_POSTING = gql`
  query (
    $search: String
    $size: Int
    $customerId: UUID
    $page: Int
    $status: String
  ) {
    findAllARPaymentPosting(
      search: $search
      size: $size
      customerId: $customerId
      page: $page
      status: $status
    ) {
      content {
        status
        orNumber
        customerName
        paymentDatetime
        arCustomer {
          customerName
          id
        }
        recordNo
        id
        paymentAmount
      }
    }
  }
`

export const FIND_ONE_AR_PAYMENT_POSTING = gql`
  query FindOneARPaymentPosting($id: UUID) {
    paymentPosting: findOneARPaymentPosting(id: $id) {
      id
      arCustomer {
        id
        accountNo
        customerName
        referenceId
      }
      paymentTracker {
        id
        ornumber
        createdDate
      }
      status
      unAppliedAmount
      recordNo
      orNumber
      notes
      paymentAmount
      paymentDatetime
    }
  }
`

export const UPDATE_INSERT_AR_PAYMENT_POSTING_ITEM = gql`
  mutation upsertTableARPaymentPostingItem(
    $id: UUID
    $fields: Map_String_ObjectScalar
  ) {
    paymentPostingItem: upsertTableARPaymentPostingItem(
      id: $id
      fields: $fields
    ) {
      response {
        id
        recordNo
        description
        itemName
        invoiceNo
        customerName
        totalAmountDue
        appliedDiscount
        amountPaid
        createdDate
      }
      success
      message
    }
  }
`
export const FIND_ALL_AR_PAYMENT_POSTING_ITEM_BY_ID = gql`
  query ($id: UUID) {
    paymentPostingItem: findAllPaymentPostingItemByPaymentPostingId(
      paymentPostingId: $id
    ) {
      id
      recordNo
      description
      itemName
      invoiceItems {
        id
      }
      invoiceNo
      customerName
      totalAmountDue
      appliedDiscount
      amountPaid
      createdDate
    }
  }
`

export const SUBMIT_PAYMENT_POSTING = gql`
  mutation (
    $id: UUID
    $fields: Map_String_ObjectScalar
    $entryPosting: Boolean
  ) {
    paymentPosting: paymentPostingApproval(
      id: $id
      fields: $fields
      entryPosting: $entryPosting
    ) {
      success
      message
      response {
        id
      }
    }
  }
`

export const REMOVE_PAYMENT_POSTING_ITEM = gql`
  mutation ($id: UUID) {
    removePaymentPostingItem(id: $id)
  }
`
