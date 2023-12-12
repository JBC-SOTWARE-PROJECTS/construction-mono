import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($id: UUID, $filter: String,  $page: Int, $size: Int) {
    list: preventiveByAsset(
        id: $id
        filter: $filter
        page: $page
        size: $size
      ) {
        content {
          id
          scheduleType
          occurrence
          reminderSchedule
          assetMaintenanceType{
            id
            description
            name
          }
        }
        size
        totalElements
        number
    }
  }
`;

const useGetPreventiveByAsset = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });
  return [data?.list , loading, refetch];
};

export default useGetPreventiveByAsset;
