import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($asset: UUID) {
    data: vehicleUsageMonitoringLatest(
        asset: $asset
      ) {
          id
          usagePurpose
          route
          startOdometerReading
          endOdometerReading
          startDatetime
          endDatetime
          startFuelReading
          endFuelReading
          rentalBasis{
            id
            amount
          }
          rentUnitMeasureQuantity
          remarks
          rentalRate
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
  }
`;

const useGetVehicleUsageLatest = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });

  return [data?.data , loading, refetch];
};

export default useGetVehicleUsageLatest;
