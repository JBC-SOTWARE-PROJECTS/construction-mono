import { PayrollStatus } from "@/graphql/gql/graphql";
import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation updatePayrollContributionStatus(
    $payrollId: UUID
    $status: PayrollStatus
  ) {
    data: updatePayrollContributionStatus(
      payrollId: $payrollId
      status: $status
    ) {
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
function useUpdatePayrollContributionStatus(callBack?: (result: any) => void) {
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

export default useUpdatePayrollContributionStatus;
