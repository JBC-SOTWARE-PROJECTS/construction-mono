import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation ($employeeId: [UUID], $allowanceId: UUID, $amount: BigDecimal) {
    data: upsertPayrollAllowanceItem(
      employeeId: $employeeId
      allowanceId: $allowanceId
      amount: $amount
    ) {
      success
      message
    }
  }
`;

interface params {
  allowanceId: [string];
  employeeId: string;
  amount: number;
}
function useUpsertPayrollAllowanceItem(callBack?: (result: any) => void) {
  const [mutationFn, { loading }] = useMutation(MUTATION, {
    onCompleted: (result: any) => {
      message.success(result?.data?.message);
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

export default useUpsertPayrollAllowanceItem;
