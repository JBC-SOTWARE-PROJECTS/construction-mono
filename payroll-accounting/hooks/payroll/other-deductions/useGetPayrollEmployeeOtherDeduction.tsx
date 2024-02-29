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
const useGetPayrollEmployeeOtherDeduction = ({
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
        data: getOtherDeductionEmployees(
          payroll: $payroll
          page: $page
          size: $size
          filter: $filter
          status: $status
          withItems: $withItems
        ) {
          content {
            id
            status
            employeeName
            employee {
              deductionItems {
                id
                description
                amount
                name
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
        data: getOtherDeductionEmployeesList(payroll: $payroll) {
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

export default useGetPayrollEmployeeOtherDeduction;

// only exposing data, refetch, and loading properties from useQuery
