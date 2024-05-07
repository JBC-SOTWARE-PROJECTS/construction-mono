import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($filter: String,  $page: Int, $size: Int, $project: UUID) {
    list: vehicleUsageMonitoringPageable(
        filter: $filter,
        page: $page,
        size: $size,
        project: $project
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
          rentalBasis{
            id
            amount
          }
          rentUnitMeasureQuantity
          remarks
          rentalRate
          company
          calculatedRentalFee
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

const useGetVehicleUsageMonitoringByProject = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });

  return [data?.list , loading, refetch];
};

export default useGetVehicleUsageMonitoringByProject;
