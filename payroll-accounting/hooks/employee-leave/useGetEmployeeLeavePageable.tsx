import { IPaginationFilters } from "@/utility/interfaces";
import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query (
    $size: Int
    $page: Int
    $filter: String
    $leaveTypes: [LeaveType]
    $status: [LeaveStatus]
  ) {
    page: getEmployeeLeavePageable(
      size: $size
      page: $page
      filter: $filter
      leaveTypes: $leaveTypes
      status: $status
    ) {
      content {
        id
        reason
        type
        status
        dates {
          startDatetime
          endDatetime
        }
        withPay
      }
      totalElements
    }
  }
`;

function useGetEmployeeLeavePageable(filterState: IPaginationFilters) {
  const { data, loading, refetch } = useQuery(QUERY, {
    fetchPolicy: "network-only",
    variables: filterState,
  });

  return [data?.page?.content, loading, refetch, data?.page?.totalElements];
}

export default useGetEmployeeLeavePageable;
