import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const QUERY = gql`
  query ($employeeId: UUID) {
    data: getEmployeeLeaveByEmp(employeeId: $employeeId) {
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
    }
  }
`;

function useGetEmployeeLeave(callBack?: (result: any) => void) {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(QUERY, {
    variables: {
      employeeId: router?.query.id,
    },
    onCompleted: (result) => {
      if (callBack) callBack(result?.data);
    },
  });
  return [data?.data, loading, refetch];
}

export default useGetEmployeeLeave;
