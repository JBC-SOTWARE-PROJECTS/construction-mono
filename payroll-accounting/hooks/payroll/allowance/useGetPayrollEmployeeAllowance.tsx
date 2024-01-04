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
      // ...params,
    }
  );

  // const { data: dataList, loading: loadingList } = useQuery(
  //   gql`
  //     query ($payroll: UUID!) {
  //       data: getAdjustmentEmployeesList(payroll: $payroll) {
  //         id
  //         employeeName
  //       }
  //     }
  //   `,
  //   {
  //     variables: {
  //       ...variables,
  //       payroll: router?.query?.id,
  //     },
  //     onCompleted: (result) => {
  //       if (onCompleted) onCompleted(result?.data);
  //     },
  //     fetchPolicy: "network-only",
  //     // ...params,
  //   }
  // );
  return [
    data?.data?.content,
    loading,
    refetch,
    data?.data?.totalElements,

    // dataList: dataList?.data,
  ];
};

export default useGetPayrollEmployeeAllowance;

// only exposing data, refetch, and loading properties from useQuery
