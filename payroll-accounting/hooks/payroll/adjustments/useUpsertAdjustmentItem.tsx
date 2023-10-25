import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation (
    $id: UUID
    $category: UUID
    $amount: BigDecimal
    $description: String
  ) {
    data: upsertAdjustmentItem(
      id: $id
      category: $category
      amount: $amount
      description: $description
    ) {
      success
      message
    }
  }
`;

function useUpsertAdjustmentItem(callBack: () => void) {
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

export default useUpsertAdjustmentItem;
