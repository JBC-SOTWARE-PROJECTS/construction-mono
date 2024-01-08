import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($rmId: UUID, $filter: String,$page: Int, $size: Int) {
    list: assetRepairMaintenanceItemListPageable(
        rmId: $rmId,
        filter: $filter,
        page: $page,
        size: $size
      ) {
        content {
          id
          quantity
          basePrice
          itemType
          description
          item {
            id
            descLong
          }
        }
        size
        totalElements
        number
    }
  }
`;

const useGetAssetRepairMaintenanceItem = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });

  return [data?.list , loading, refetch];
};

export default useGetAssetRepairMaintenanceItem;
