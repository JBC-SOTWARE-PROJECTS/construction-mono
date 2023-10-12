import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation ($id: UUID, $amount: BigDecimal) {
    data: updatePayrollLoanItemAmount(id: $id, amount: $amount) {
      success
      message
    }
  }
`;

function useUpdateLoanItemAmount(callBack: () => void) {
  const [update, { loading }] = useMutation(MUTATION, {
    onCompleted: (result) => {
      if (callBack) callBack();
      message.success(result?.data?.message);
    },
    onError: () => {
      message.error("Something went wrong, Please try again later.");
    },
  });

  const mutationFn = (amount: number, id: string) => {
    update({ variables: { id, amount } });
  };

  const returnValue: [(amount: number, id: string) => void, boolean] = [
    mutationFn,
    loading,
  ];
  return returnValue;
}

export default useUpdateLoanItemAmount;
