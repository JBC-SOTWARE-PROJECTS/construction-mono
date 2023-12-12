import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation ($id: UUID, $amount: BigDecimal) {
    data: editEmployeeAllowance(id: $id, amount: $amount) {
      success
      message
    }
  }
`;

interface params {
  id: string;
  amount: number;
}
function useEditEmployeeAllowanceAmount(callBack?: (result: any) => void) {
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

export default useEditEmployeeAllowanceAmount;
