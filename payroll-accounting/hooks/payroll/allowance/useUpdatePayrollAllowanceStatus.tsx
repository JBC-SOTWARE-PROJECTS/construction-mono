import { PayrollStatus } from "@/graphql/gql/graphql";
import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation updatePayrollAllowanceStatus(
    $payrollId: UUID
    $status: PayrollStatus
  ) {
    data: updatePayrollAllowanceStatus(payrollId: $payrollId, status: $status) {
      success
      message
      response
    }
  }
`;

interface params {
  payrollId: string;
  status: PayrollStatus;
}
function useUpdatePayrollAllowanceStatus(callBack?: (result: any) => void) {
  const [mutationFn, { loading }] = useMutation(MUTATION, {
    onCompleted: (result: any) => {
      message[result?.data?.success ? "success" : "error"](
        result?.data?.message
      );

      if (callBack) callBack(result?.data);
    },
  });

  const mutation = (params: params) => {
    mutationFn({
      variables: { ...params },
    });
  };
  const returnValue: [(params: params) => void, boolean] = [mutation, loading];
  return returnValue;
}

export default useUpdatePayrollAllowanceStatus;
