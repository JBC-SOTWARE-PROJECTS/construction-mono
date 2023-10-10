import { IPaginationFilters } from "@/utility/interfaces";
import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query ($employeeId: UUID, $page: Int!, $size: Int!) {
    loans: getEmployeeLoanLedger(
      employeeId: $employeeId
      page: $page
      size: $size
    ) {
      content {
        id
        debit
        credit
        runningBalance
        createdDate
        category
        description
      }
      totalPages
      size
      number
      __typename
    }
  }
`;

function useGetEmployeeLoansLedger(
  filterState: IPaginationFilters,
  employeeId: string
) {
  const { data, loading, refetch } = useQuery(QUERY, {
    fetchPolicy: "network-only",
    variables: { ...filterState, employeeId },
  });

  return [data?.loans, loading, refetch, data?.payrolls?.totalElements];
}

export default useGetEmployeeLoansLedger;
