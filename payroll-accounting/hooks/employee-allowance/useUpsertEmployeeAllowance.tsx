import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation ($employeeId: UUID, $allowancePackageId: UUID) {
    data: upsertEmployeeAllowances(
      employeeId: $employeeId
      allowancePackageId: $allowancePackageId
    ) {
      success
      message
    }
  }
`;

interface params {
  allowancePackageId?: string;
  employeeId: string;
}
function useUpsertEmployeeAllowance(callBack?: (result: any) => void) {
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

export default useUpsertEmployeeAllowance;
