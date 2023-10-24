import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query ($filter: String) {
    list: getAdjustmentCategories(filter: $filter) {
      id
      name
      description
      operation
      status
      isDefault
    }
  }
`;

const useGetAdjustmentCategories = (filter: String) => {
  const { data, loading, refetch } = useQuery(QUERY, {
    variables: {
      filter,
    },
  });

  return [data?.list, loading, refetch];
};

export default useGetAdjustmentCategories;
