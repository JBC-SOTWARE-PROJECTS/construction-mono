import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($filter: String,  $page: Int, $size: Int) {
    list: assetRepairMaintenanceListPageable(
        filter: $filter,
        page: $page,
        size: $size
      ) {
        content {
          id
          serviceType
          serviceClassification
          serviceDatetimeStart
          serviceDatetimeFinished
          workDescription
          findings
          workedByEmployees
          status
          rmImage
          inspectionRemarks
          asset{
            id
            description
            item {
              descLong
            }
          }
        }
        size
        totalElements
        number
    }
  }
`;

const useGetAssetRepairMaintenance = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });

  return [data?.list , loading, refetch];
};

export default useGetAssetRepairMaintenance;
