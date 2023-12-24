import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($filter: String,  $page: Int, $size: Int) {
    list: vehicleUsageMonitoringPageable(
        filter: $filter,
        page: $page,
        size: $size
      ) {
        content {
          id
          usagePurpose
          route
          startOdometerReading
          endOdometerReading
          startDatetime
          endDatetime
          startFuelReading
          endFuelReading
          project{
            id
            description
          }
        }
        size
        totalElements
        number
    }
  }
`;

const useGetVehicleUsageMonitoring = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });

  return [data?.list , loading, refetch];
};

export default useGetVehicleUsageMonitoring;
