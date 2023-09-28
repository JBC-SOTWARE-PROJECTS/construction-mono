import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

export const CALCULATE_ONE_EMPLOYEE = gql`
  mutation ($id: UUID) {
    data: calculateOneTimekeepingEmployee(id: $id) {
      message
    }
  }
`;
function useRecalculateOneLog(callBack?: (result: any) => void) {
  const [mutationFn, { loading }] = useMutation(CALCULATE_ONE_EMPLOYEE, {
    onCompleted: (result: any) => {
      debugger;
      message.success(result.data.message);
      if (callBack) callBack(result?.data);
    },
  });

  const calculate = (id: string) => {
    mutationFn({
      variables: {
        id: id,
      },
    });
  };
  const returnValue: [(id: string) => void, boolean] = [calculate, loading];
  return returnValue;
}

export default useRecalculateOneLog;
