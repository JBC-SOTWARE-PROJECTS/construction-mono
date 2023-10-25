import { PayrollEmployeeStatus } from "@/graphql/gql/graphql";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

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
const useGetPayrollEmployeeAdjustment = ({
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
      ) {
        data: getAdjustmentEmployees(
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
              items: adjustmentItems {
                id
                description
                amount
                name
                operation
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

  const { data: dataList, loading: loadingList } = useQuery(
    gql`
      query ($payroll: UUID!) {
        data: getAdjustmentEmployeesList(payroll: $payroll) {
          id
          employeeName
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
    dataList: dataList?.data,
  };
};

export default useGetPayrollEmployeeAdjustment;

// only exposing data, refetch, and loading properties from useQuery
