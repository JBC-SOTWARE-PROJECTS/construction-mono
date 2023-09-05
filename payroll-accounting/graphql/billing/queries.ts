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
