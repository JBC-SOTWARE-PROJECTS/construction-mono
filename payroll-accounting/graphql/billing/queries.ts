import { gql } from "@apollo/client"

export const GET_BILLING_RECORDS = gql`
  query ($filter: String, $status: Boolean, $page: Int, $size: Int) {
    billingByFiltersPageProjects(
      filter: $filter
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        dateTrans
        billNo
        project {
          id
          projectCode
          description
        }
        customer {
          id
          customerName
        }
        otcName
        locked
        lockedBy
        balance
        status
      }
      size
      totalElements
      number
    }
  }
`

export const GET_BILLING_INFO_BY_ID = gql`
  query ($id: UUID) {
    billingById(id: $id) {
      id
      dateTrans
      billNo
      project {
        id
        projectCode
        description
        location {
          id
          fullAddress
        }
        status
      }
      customer {
        id
        customerName
        customerType
        address
        contactNo
        contactEmail
      }
      otcName
      locked
      lockedBy
      balance
      totals
      deductions
      payments
      projectWorkAccomplishId
      projectWorkAccomplishNo
      status
    }
  }
`

export const GET_BILLING_ITEMS = gql`
  query ($filter: String, $id: UUID, $type: [String], $active: Boolean) {
    billingItemByParentType(
      filter: $filter
      id: $id
      type: $type
      active: $active
    ) {
      id
      transDate
      recordNo
      description
      qty
      debit
      credit
      subTotal
      itemType
      transType
      orNum
      lastModifiedBy
      projectCostId
      projectWorkAccomplishmentItemId
      status
    }
  }
`

export const CANCEL_BILLING_ITEM = gql`
  mutation ($id: UUID, $office: UUID) {
    cancelItem(id: $id, office: $office) {
      id
    }
  }
`

export const GET_OTC_RECORD = gql`
  query ($filter: String, $status: Boolean, $page: Int, $size: Int) {
    billingOTCByFiltersPage(
      filter: $filter
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        dateTrans
        billNo
        otcName
        locked
        lockedBy
        balance
        status
      }
      size
      totalElements
      number
    }
  }
`

export const ADD_BILLING_ITEM_PROJECT_SERVICES = gql`
  mutation ($billingId: UUID, $fields: Map_String_ObjectScalar) {
    addProjectService(billingId: $billingId, fields: $fields) {
      message
      success
    }
  }
`

export const DELETE_BILLING_ITEM_BY_ID = gql`
  mutation ($id: UUID) {
    removeBillingItemProjectService(id: $id) {
      message
      success
    }
  }
`

export const LOCK_BILLING = gql`
  mutation ($id: UUID, $type: String) {
    lockBilling(id: $id, type: $type) {
      id
      locked
    }
  }
`

export const ADD_DEDUCTIONS = gql`
  mutation (
    $fields: Map_String_ObjectScalar
    $id: UUID
    $items: [Map_String_ObjectScalar]
  ) {
    addDeductions(fields: $fields, id: $id, items: $items)
  }
`

export const DEDUCTION_DETAILS = gql`
  query ($id: UUID) {
    deductionItemsById(id: $id) {
      id
      refBillItem {
        id
        recordNo
        description
      }
      amount
    }
  }
`
