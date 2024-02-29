import { PayrollEmployeeStatus } from "@/graphql/gql/graphql";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

export interface variables {
  page: number;
  size: number;
  filter: string;
  status: [PayrollEmployeeStatus] | [];
  withItems: boolean;
}

interface IParams {
  variables: variables;
  onCompleted?: (any: any) => void;
}
const useGetPayrollEmployeeAllowance = ({
  variables,
  onCompleted,
}: IParams) => {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(
    gql`
      query (
        $payroll: UUID!
        $page: Int!
        $size: Int!
        $filter: String
        $status: [PayrollEmployeeStatus]
        $withItems: Boolean
      ) {
        data: getPayrollEmployeeAllowance(
          payroll: $payroll
          page: $page
          size: $size
          filter: $filter
          status: $status
          withItems: $withItems
        ) {
          content {
            id
            payrollEmployeeId
            employeeName
            total
            position
            status
            employee {
              id
              allowanceItems {
                id
                name
                originalAmount
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
    }
  );

  const { data: allEmp, loading: loadingAllEmp } = useQuery(
    gql`
      query ($payroll: UUID!) {
        data: getAllPayrollEmployeeAllowance(payroll: $payroll) {
          id
          payrollEmployeeId
          employeeName
        }
      }
    `,
    {
      variables: {
        payroll: router?.query?.id,
      },

      fetchPolicy: "network-only",
    }
  );
  return [
    data?.data?.content,
    loading || loadingAllEmp,
    refetch,
    data?.data?.totalElements,
    allEmp?.data,
  ];
};

export default useGetPayrollEmployeeAllowance;

// only exposing data, refetch, and loading properties from useQuery
