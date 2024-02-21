import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($filter: String,  $page: Int, $size: Int, $asset: UUID) {
    list: vehicleUsageMonitoringPageable(
        filter: $filter,
        page: $page,
        size: $size,
        asset: $asset
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
          company
          asset{
            id
          }
          project{
            id
            description
          }
          item {
            id
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
