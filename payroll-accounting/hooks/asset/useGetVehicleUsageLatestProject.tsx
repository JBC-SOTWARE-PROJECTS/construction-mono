import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($project: UUID) {
    data: vehicleUsageMonitoringProjectLatest(
        project: $project
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
          calculatedRentalFee
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

const useGetVehicleUsageProjectLatest = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });

  return [data?.data , loading, refetch];
};

export default useGetVehicleUsageProjectLatest;
