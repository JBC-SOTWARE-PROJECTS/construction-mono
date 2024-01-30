import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($filter: String,  $page: Int, $size: Int) {
    list: upcomingMaintenanceKms(
        filter: $filter
        page: $page
        size: $size
      ) {
        content {
          id
          scheduleType
          occurrence
          reminderSchedule
          latestUsage
          nextNearest
          asset{
            item{
              id
              descLong
            }
            model
          }
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

const useGetUpcomingPreventivKms = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });
console.log("prevs", data)

  return [data?.list , loading, refetch];
};

export default useGetUpcomingPreventivKms;
