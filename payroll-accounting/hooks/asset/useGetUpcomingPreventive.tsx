import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($filter: String,  $page: Int, $size: Int) {
    list: upcomingMaintenance(
        filter: $filter
        page: $page
        size: $size
      ) {
        content {
          id
          scheduleType
          occurrence
          occurrenceDate
          reminderSchedule
          reminderDate
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

const useGetUpcomingPreventive = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });


  return [data?.list , loading, refetch];
};

export default useGetUpcomingPreventive;
