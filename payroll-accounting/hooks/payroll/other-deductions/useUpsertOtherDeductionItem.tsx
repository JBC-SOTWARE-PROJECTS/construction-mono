import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation (
    $id: UUID
    $employee: UUID
    $amount: BigDecimal
    $description: String
    $deductionType: UUID
  ) {
    data: upsertOtherDeductionItem(
      id: $id
      employee: $employee
      amount: $amount
      description: $description
      deductionType: $deductionType
    ) {
      success
      message
    }
  }
`;

interface IParams {
  id?: string;
  employee: string;
  amount: number;
  name: string;
  description: string;
  deductionType: string;
}

function useUpsertOtherDeductionItem(callBack: () => void) {
  const [update, { loading }] = useMutation(MUTATION, {
    onCompleted: (result) => {
      if (callBack) callBack();
      message.success(result?.data?.message);
    },
    onError: () => {
      message.error("Something went wrong, Please try again later.");
    },
  });

  const mutationFn = (params: IParams) => {
    update({ variables: params });
  };

  const returnValue: [(params: IParams) => void, boolean] = [
    mutationFn,
    loading,
  ];
  return returnValue;
}

export default useUpsertOtherDeductionItem;
