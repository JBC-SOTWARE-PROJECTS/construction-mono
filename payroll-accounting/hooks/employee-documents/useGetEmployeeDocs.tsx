import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
query ($employee: UUID, $filter: String,  $page: Int, $size: Int) {
  list: employeeDocsListPageable(
      employee: $employee
      filter: $filter
      page: $page
      size: $size
    ) {
      content {
        id
        file
        description
        employee{
          id
        }
      }
      size
      totalElements
      number
  }
}
`;

const useGetEmployeeDocs = (props: QueryHookOptions) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });
  return [data?.list, loading,  refetch];
};

export default useGetEmployeeDocs;
