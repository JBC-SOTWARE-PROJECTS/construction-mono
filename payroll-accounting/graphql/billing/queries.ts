import { gql } from "@apollo/client";

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
`;

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
      status
    }
  }
`;

export const GET_BILLING_ITEMS = gql`
  query ($filter: String, $id: UUID, $type: [String]) {
    billingItemByParentType(filter: $filter, id: $id, type: $type) {
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
      status
    }
  }
`;

export const CANCEL_BILLING_ITEM = gql`
  mutation ($id: UUID, $office: UUID) {
    cancelItem(id: $id, office: $office) {
      id
    }
  }
`;

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
`;
