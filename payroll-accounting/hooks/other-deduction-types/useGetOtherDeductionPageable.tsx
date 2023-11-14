import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

export interface variables {
  page: number;
  size: number;
  filter: string;
}

const useGetOtherDeductionPageable = (
  variables: variables,
  onCompleted: (any: any) => void
) => {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(
    gql`
      query ($filter: String, $page: Int, $size: Int) {
        data: getOtherDeductionPageable(
          filter: $filter
          page: $page
          size: $size
        ) {
          content {
            name
            id
            description
            status
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
  return [
    data?.data?.content,
    loading,
    refetch,
    data?.data?.totalElements,

    // dataList: dataList?.data,
  ];
};

export default useGetOtherDeductionPageable;

// only exposing data, refetch, and loading properties from useQuery
