import { IPaginationFilters } from "@/utility/interfaces";
import { gql, useQuery } from "@apollo/client";

const PAYROLL_PAGABLE_QUERY = gql`
  query ($employeeId: UUID, $page: Int!, $size: Int!) {
    loans: getEmployeeLoansByEmployee(
      employeeId: $employeeId
      page: $page
      size: $size
    ) {
      content {
        id
        amount
        employee {
          id
          fullName
        }
        description
        category
        status
        isVoided
      }
      totalPages
      size
      number
      __typename
    }
  }
`;

function useGetEmployeeLoans(filterState: IPaginationFilters) {
  const { data, loading, refetch } = useQuery(PAYROLL_PAGABLE_QUERY, {
    fetchPolicy: "network-only",
    variables: filterState,
  });

  return [
    data?.loans?.content,
    loading,
    refetch,
    data?.payrolls?.totalElements,
  ];
}

export default useGetEmployeeLoans;
