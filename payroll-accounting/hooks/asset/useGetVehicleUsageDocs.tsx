import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($vehicleUsageId: UUID, $filter: String,  $page: Int, $size: Int) {
    list: vehicleUsageDocsListPageable(
        vehicleUsageId: $vehicleUsageId
        filter: $filter
        page: $page
        size: $size
      ) {
        content {
          id
          file
          description
          designation
          vehicleUsage{
            id
          }
        }
        size
        totalElements
        number
    }
  }
`;

const useGetVehicleUsageDocs = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });

  return [data?.list , loading, refetch];
};

export default useGetVehicleUsageDocs;
