import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation ($id: UUID) {
    data: deletePayrollAllowanceItem(id: $id) {
      success
      message
    }
  }
`;

function useDeletePayrollAllowanceItem(callBack?: (result: any) => void) {
  const [mutationFn, { loading }] = useMutation(MUTATION, {
    onCompleted: (result: any) => {
      message.success(result?.data?.message);
      if (callBack) callBack(result?.data);
    },
  });

  const mutation = (id: string) => {
    mutationFn({
      variables: { id },
    });
  };
  const returnValue: [(id: string) => void, boolean] = [mutation, loading];
  return returnValue;
}

export default useDeletePayrollAllowanceItem;
