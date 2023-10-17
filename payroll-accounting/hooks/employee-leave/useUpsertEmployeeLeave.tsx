import { EmployeeLeave, SelectedDate } from "@/graphql/gql/graphql";
import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation (
    $id: UUID
    $employeeId: UUID
    $fields: Map_String_ObjectScalar
    $dates: [SelectedDate]
  ) {
    data: upsertEmployeeLeave(payrollId: $payrollId, status: $status) {
      message
    }
  }
`;

interface params {
  id?: string;
  employeeId: string;
  fields: EmployeeLeave;
  dates: SelectedDate[];
}
function useUpdateTimekeepingStatus(callBack?: (result: any) => void) {
  const [mutationFn, { loading }] = useMutation(MUTATION, {
    onCompleted: (result: any) => {
      message.success(result?.data?.message);
      if (callBack) callBack(result?.data);
    },
  });

  const mutation = (params: params) => {
    mutationFn({
      variables: params,
    });
  };
  const returnValue: [(params: params) => void, boolean] = [mutation, loading];
  return returnValue;
}

export default useUpdateTimekeepingStatus;
