import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation ($id: UUID, $status: Boolean) {
    data: employeeUpdateStatus(id: $id, status: $status) {
      id
    }
  }
`;

interface params {
  id: string;
  status: boolean;
}
function useUpdateEmployeeStatus(callBack?: (result: any) => void) {
  const [mutationFn, { loading }] = useMutation(MUTATION, {
    onCompleted: (result: any) => {
      message.success("Employee status updated.");
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

export default useUpdateEmployeeStatus;
