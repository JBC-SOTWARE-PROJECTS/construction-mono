import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
import dayjs from "dayjs";

const CALCULATE_ONE_DAY = gql`
  mutation (
    $id: UUID
    $employeeId: UUID
    $startDate: Instant
    $endDate: Instant
  ) {
    data: recalculateOneDay(
      id: $id
      employeeId: $employeeId
      startDate: $startDate
      endDate: $endDate
    ) {
      message
    }
  }
`;

interface params {
  id: string;
  employeeId: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}
function useRecalculateOneLog(callBack?: (result: any) => void) {
  const [mutationFn, { loading }] = useMutation(CALCULATE_ONE_DAY, {
    onCompleted: (result: any) => {
      debugger;
      message.success(result?.data?.message);
      if (callBack) callBack(result?.data);
    },
  });

  const calculate = (params: params) => {
    mutationFn({
      variables: params,
    });
  };
  const returnValue: [(params: params) => void, boolean] = [calculate, loading];
  return returnValue;
}

export default useRecalculateOneLog;
