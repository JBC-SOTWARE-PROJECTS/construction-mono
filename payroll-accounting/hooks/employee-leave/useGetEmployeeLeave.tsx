import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import usePaginationState from "../usePaginationState";
import dayjs from "dayjs";

const QUERY = gql`
  query (
    $employeeId: UUID
    $size: Int
    $page: Int
    $startDate: Instant
    $endDate: Instant
  ) {
    data: getEmployeeLeaveByEmp(
      employeeId: $employeeId
      employeeId: $employeeId
      size: $size
      page: $page
      startDate: $startDate
      endDate: $endDate
    ) {
      data {
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
      dateCount
    }
  }
`;

function useGetEmployeeLeave(
  startDate?: any,
  endDate?: any,
  callBack?: (result: any) => void
) {
  const router = useRouter();
  const [state, { onNextPage }] = usePaginationState(
    {
      startDate: null,
      endDate: null,
    },
    0,
    25
  );
  const { data, loading, refetch } = useQuery(QUERY, {
    skip: !startDate && !endDate ? true : false,
    variables: {
      employeeId: router?.query.id,
      startDate: dayjs(startDate).startOf("day"),
      endDate: dayjs(endDate).endOf("day"),
      size: state.size,
      page: state.page,
    },
    onCompleted: (result) => {
      if (callBack) callBack(result?.data);
    },
  });

  return [
    data?.data?.data?.content,
    loading,
    refetch,
    data?.data?.data?.totalElements,
    data?.data?.dateCount,
    onNextPage,
  ];
}

export default useGetEmployeeLeave;
