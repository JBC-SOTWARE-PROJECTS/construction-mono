import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const MUTATION = gql`
  mutation (
    $id: UUID
    $employee: [UUID]
    $category: UUID
    $amount: BigDecimal
    $description: String
    $subaccountCode: String
  ) {
    data: upsertAdjustmentItem(
      id: $id
      employee: $employee
      category: $category
      amount: $amount
      description: $description
      subaccountCode: $subaccountCode
    ) {
      success
      message
    }
  }
`;

interface IParams {
  id?: [string];
  employee: string;
  amount: number;
  category: string;
  description: string;
  subaccountCode: string;
}

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

  const mutationFn = (params: IParams) => {
    update({ variables: params });
  };

  const returnValue: [(params: IParams) => void, boolean] = [
    mutationFn,
    loading,
  ];
  return returnValue;
}

export default useUpsertAdjustmentItem;
