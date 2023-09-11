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
 * @param {department} - department of the employee
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
const useGetContributionEmployees = ({ variables, onCompleted }: IParams) => {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(
    gql`
      query (
        $payroll: UUID!
        $page: Int!
        $size: Int!
        $filter: String
        $status: [PayrollEmployeeStatus]
        $department: UUID
      ) {
        getContributionEmployeesByPayrollId(
          payroll: $payroll
          page: $page
          size: $size
          filter: $filter
          status: $status
          department: $department
        ) {
          message
          success
          response {
            content {
              id
              department
              employeeName
              total
              status
              sssEE
              sssER
              sssWispER
              sssWispEE
              sssEETotal
              sssERTotal
              phicEE
              phicER
              hdmfER
              hdmfEE
              isActiveSSS
              isActivePHIC
              isActiveHDMF
              basicSalary
              total
            }
            totalElements
          }
        }
      }
    `,
    {
      variables: {
        ...variables,
        payroll: router?.query?.id,
      },
      onCompleted: (result) => {
        if (onCompleted)
          onCompleted(result?.getContributionEmployeesByPayrollId);
      },
      fetchPolicy: "network-only",
      // ...params,
    }
  );
  return {
    data: data?.getContributionEmployeesByPayrollId,
    loading,
    refetch,
  };
};

export default useGetContributionEmployees;

// only exposing data, refetch, and loading properties from useQuery
