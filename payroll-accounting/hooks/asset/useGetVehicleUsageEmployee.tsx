import { QueryHookOptions, gql, useQuery } from "@apollo/client";


const GET_RECORDS = gql`
query ($filter: String, $page: Int, $size: Int, $usageID: UUID) {
  page: vehicleUsageEmployeeListPageable(filter: $filter, page: $page, size: $size, usageID: $usageID) {
    content {
      id
      designation
      remarks
      timeRenderedStart
      timeRenderedEnd
      employee{
        id
        fullName
      }
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


const useGetVehicleUsageEmployee = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });
console.log("datadata", data)
  return [data?.page , loading, refetch];
};

export default useGetVehicleUsageEmployee;
