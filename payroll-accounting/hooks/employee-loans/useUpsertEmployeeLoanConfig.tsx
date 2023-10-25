import { EmployeeLoanConfig } from "@/graphql/gql/graphql";
import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
import { useRouter } from "next/router";

const MUTATION = gql`
  mutation ($id: UUID, $config: EmployeeLoanConfigInput) {
    data: upsertEmployeeLoanConfig(id: $id, config: $config) {
      response
      message
    }
  }
`;

function useUpsertEmployeeLoanConfig(callback?: (any: any) => void) {
  const router = useRouter();
  const [mutation, { loading }] = useMutation(MUTATION, {
    onCompleted: (data) => {
      if (callback) {
        message.success(data?.data.message);
        callback(data?.data);
      }
    },
    onError: () => {},
  });

  const mutationFunc = (config: EmployeeLoanConfig) => {
    delete config.__typename;
    mutation({ variables: { id: router?.query?.id, config } });
  };

  const returnValue: [(config: EmployeeLoanConfig) => void, boolean] = [
    mutationFunc,
    loading,
  ];
  return returnValue;
}

export default useUpsertEmployeeLoanConfig;
