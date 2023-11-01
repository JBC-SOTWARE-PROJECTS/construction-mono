import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation ($payrollId: UUID, $status: PayrollStatus) {
    data: updatePayrollAdjustmentStatus(
      payrollId: $payrollId
      status: $status
    ) {
      message
    }
  }
`;

interface params {
  payrollId: string;
  status: string;
}
function useUpdatePayrollAdjustmentStatus(callBack?: (result: any) => void) {
  const [mutationFn, { loading }] = useMutation(MUTATION, {
    onCompleted: (result: any) => {
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

export default useUpdatePayrollAdjustmentStatus;
