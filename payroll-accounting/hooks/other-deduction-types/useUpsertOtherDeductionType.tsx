import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation ($id: UUID, $name: String, $description: String, $status: Boolean) {
    data: upsertOtherDeductionType(
      id: $id
      name: $name
      description: $description
      status: $status
    ) {
      success
      message
    }
  }
`;

interface params {
  id: string | undefined;
  name: string;
  description: string;
  status: boolean;
}
function useUpsertOtherDeductionType(callBack?: (result: any) => void) {
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

export default useUpsertOtherDeductionType;
