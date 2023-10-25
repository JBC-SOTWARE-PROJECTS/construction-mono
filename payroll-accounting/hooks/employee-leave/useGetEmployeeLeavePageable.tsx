import { IPaginationFilters } from "@/utility/interfaces";
import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query (
    $size: Int
    $page: Int
    $filter: String
    $leaveTypes: [LeaveType]
    $status: [LeaveStatus]
    $position: UUID
    $office: UUID
  ) {
    getEmployeeLeavePageable(
      size: $size
      page: $page
      filter: $filter
      leaveTypes: $leaveTypes
      status: $status
      position: $position
      office: $office
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
        createdDate
        employeeId
        fullName
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

  return [
    data?.getEmployeeLeavePageable?.content,
    loading,
    refetch,
    data?.getEmployeeLeavePageable?.totalElements,
  ];
}

export default useGetEmployeeLeavePageable;
