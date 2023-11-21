import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const useGetOtherDeduction = (
  filter: string,
  onCompleted?: (any: any) => void
) => {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(
    gql`
      query ($filter: String) {
        data: getOtherDeduction(filter: $filter) {
          name
          id
          description
        }
      }
    `,
    {
      variables: {
        filter: filter,
      },
      onCompleted: (result) => {
        if (onCompleted) onCompleted(result?.data);
      },
      fetchPolicy: "network-only",
      // ...params,
    }
  );
  return [
    data?.data,
    loading,
    refetch,
    // dataList: dataList?.data,
  ];
};

export default useGetOtherDeduction;

// only exposing data, refetch, and loading properties from useQuery
