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
          fullName
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
        fullName
        customerType
        address
        telNo
        emailAdd
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
