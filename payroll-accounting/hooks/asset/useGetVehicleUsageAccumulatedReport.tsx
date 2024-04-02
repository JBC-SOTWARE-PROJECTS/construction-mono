import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($filter: String,  $page: Int, $size: Int, $asset: UUID,$startDate: Instant,
    $endDate: Instant ) {
    list: AssetVehicleUsageAccumulationPageable(
        filter: $filter,
        page: $page,
        size: $size,
        asset: $asset,
        startDate: $startDate,
        endDate: $endDate
      ) {
        content {
         asset{
          id
         }
         dateOfUsage
         accumulatedOdo
         accumulatedFuel
        }
        size
        totalElements
        number
    }
  }
`;

const useGetVehicleUsageAccumulatedReport = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });

  return [data?.list , loading, refetch];
};

export default useGetVehicleUsageAccumulatedReport;
