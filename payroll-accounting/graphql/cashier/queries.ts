import { gql } from "@apollo/client";

export const GET_ACCOUNTS_FOLIO_RECORD = gql`
  query ($filter: String, $status: Boolean, $page: Int, $size: Int) {
    billingAllByFiltersPage(
      filter: $filter
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        dateTrans
        billNo
        customer {
          id
          fullName
        }
        project {
          id
          projectCode
          description
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
    totalBalances
  }
`;
