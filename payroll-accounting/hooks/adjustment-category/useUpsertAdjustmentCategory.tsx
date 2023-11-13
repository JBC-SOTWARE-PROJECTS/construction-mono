import { AdjustmentCategory, EmployeeLoan } from "@/graphql/gql/graphql";
import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
interface variables {
  id?: string | null;
  fields: AdjustmentCategory;
}

const MUTATION = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertAdjustmentCategory(id: $id, fields: $fields) {
      response {
        id
      }
      success
      message
    }
  }
`;

function useUpsertAdjustmentCategory(callback?: (any: EmployeeLoan) => void) {
  const [mutation, { loading }] = useMutation(MUTATION, {
    onCompleted: ({ data }) => {
      if (data?.success) {
        message.success(data?.message || "Success!");
        if (callback) {
          callback(data?.data);
        }
      }
    },
    onError: () => {},
  });

  const mutationFunc = (variables: variables) => {
    mutation({ variables: variables });
  };

  const returnValue: [(variables: variables) => void, boolean] = [
    mutationFunc,
    loading,
  ];
  return returnValue;
}

export default useUpsertAdjustmentCategory;
