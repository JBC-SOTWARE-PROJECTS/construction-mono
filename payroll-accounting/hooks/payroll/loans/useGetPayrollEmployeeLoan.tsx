import { PayrollEmployeeStatus } from "@/graphql/gql/graphql";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

/**
 * This hook is used to get contribution employees.
 * params: Typical parameters used in useQuery({variables, onCompleted, onError, etc..})
 * 
 * These are the following fields required in the "variables" object
 * @param {payroll} - id of the payroll
 * @param {page} - page number
 * @param {size} - page size
 * @param {filter} - filter used for searching employee (employee name)
 * @param {status} - status of the contribution employee
 * 
 * 
 * sample usage -
  const { data, loading, refetch } = useGetContributionEmployees({
    variables: {
      payroll: router?.query?.id,
      ...state,
    },
    fetchPolicy: 'network-only',
  });
 */

export interface variables {
  page: number;
  size: number;
  filter: string;
  status: [PayrollEmployeeStatus] | [];
}

interface IParams {
  variables: variables;
  onCompleted?: (any: any) => void;
}
const useGetPayrollEmployeeLoan = ({ variables, onCompleted }: IParams) => {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(
    gql`
      query (
        $payroll: UUID!
        $page: Int!
        $size: Int!
        $filter: String
        $status: [PayrollEmployeeStatus]
      ) {
        data: getPayrollEmployeeLoan(
          payroll: $payroll
          page: $page
          size: $size
          filter: $filter
          status: $status
        ) {
          content {
            id
            status
            employeeName
            employee {
              id
              loanItems {
                id
                category
                description
                amount
              }
            }
          }
          totalElements
        }
      }
    `,
    {
      variables: {
        ...variables,
        payroll: router?.query?.id,
      },
      onCompleted: (result) => {
        if (onCompleted) onCompleted(result?.data);
      },
      fetchPolicy: "network-only",
      // ...params,
    }
  );
  return {
    data: data?.data,
    loading,
    refetch,
  };
};

export default useGetPayrollEmployeeLoan;

// only exposing data, refetch, and loading properties from useQuery
