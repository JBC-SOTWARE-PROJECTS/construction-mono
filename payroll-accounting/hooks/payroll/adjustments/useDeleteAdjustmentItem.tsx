import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation ($id: UUID) {
    data: deletePayrollAdjustmentItem(id: $id) {
      success
      message
    }
  }
`;

function useDeleteAdjustmentItem(callBack: () => void) {
  const [update, { loading }] = useMutation(MUTATION, {
    onCompleted: (result) => {
      if (callBack) callBack();
      message.success(result?.data?.message);
    },
    onError: () => {
      message.error("Something went wrong, Please try again later.");
    },
  });

  const mutationFn = (id: string) => {
    update({ variables: { id } });
  };

  const returnValue: [(id: string) => void, boolean] = [mutationFn, loading];
  return returnValue;
}

export default useDeleteAdjustmentItem;
