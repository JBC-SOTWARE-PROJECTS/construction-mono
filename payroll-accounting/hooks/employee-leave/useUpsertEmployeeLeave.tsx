import { EmployeeLeave, SelectedDate } from "@/graphql/gql/graphql";
import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
import dayjs from "dayjs";

const MUTATION = gql`
  mutation (
    $id: UUID
    $employeeId: UUID
    $fields: Map_String_ObjectScalar
    $dates: [SelectedDateInput]
  ) {
    data: upsertEmployeeLeave(
      id: $id
      employeeId: $employeeId
      fields: $fields
      dates: $dates
    ) {
      message
    }
  }
`;

interface params {
  id?: string;
  employeeId: string;
  fields: EmployeeLeave;
  dates: string[];
}
function useUpsertEmployeeLeave(callBack?: (result: any) => void) {
  const [mutationFn, { loading }] = useMutation(MUTATION, {
    onCompleted: (result: any) => {
      message.success(result?.data?.message);
      if (callBack) callBack(result?.data);
    },
  });

  const mutation = (params: params) => {
    let dates;
    if (params.dates?.length !== 0) {
      dates = params.dates?.map((item) => {
        return {
          startDatetime: dayjs(item).startOf("day"),
          endDatetime: dayjs(item).endOf("day"),
        };
      });
    }
    mutationFn({
      variables: { ...params, dates: dates },
    });
  };
  const returnValue: [(params: params) => void, boolean] = [mutation, loading];
  return returnValue;
}

export default useUpsertEmployeeLeave;
