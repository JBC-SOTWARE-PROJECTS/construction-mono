import { EmployeeLoanCategory } from "@/graphql/gql/graphql";
import { IPaginationFilters } from "@/utility/interfaces";
import { gql, useQuery } from "@apollo/client";

const PAYROLL_PAGABLE_QUERY = gql`
  query (
    $employeeId: UUID
    $page: Int!
    $size: Int!
    $category: EmployeeLoanCategory
  ) {
    loans: getEmployeeLoansByEmployee(
      employeeId: $employeeId
      page: $page
      size: $size
      category: $category
    ) {
      content {
        id
        amount
        createdDate
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

function useGetEmployeeLoans(
  filterState: IPaginationFilters,
  category: EmployeeLoanCategory,
  employeeId: string
) {
  const { data, loading, refetch } = useQuery(PAYROLL_PAGABLE_QUERY, {
    fetchPolicy: "network-only",
    variables: { ...filterState, category, employeeId },
  });

  return [data?.loans, loading, refetch, data?.payrolls?.totalElements];
}

export default useGetEmployeeLoans;
