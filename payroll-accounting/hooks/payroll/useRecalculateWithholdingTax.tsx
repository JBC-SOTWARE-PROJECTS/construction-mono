import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
import { useRouter } from "next/router";

export const PayrollStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  FINALIZED: "FINALIZED",
};

const ONE = gql`
  mutation ($id: UUID) {
    data: recalculateOneWithholdingTax(id: $id) {
      response
      message
      success
    }
  }
`;

const ALL = gql`
  mutation ($id: UUID) {
    data: recalculateAllWithholdingTax(id: $id) {
      response
      message
      success
    }
  }
`;

function useRecalculateWithholdingTax(callBack?: () => void) {
  const router = useRouter();
  const [one, { loading: loadingOne }] = useMutation(ONE, {
    onCompleted: (res) => {
      if (callBack) {
        callBack();
      }
      message[res?.data?.success ? "success" : "error"](res.data?.message);
    },
    onError: () => {
      message.error("Something went wrong, Please try again later.");
    },
  });

  const [all, { loading: loadingAll }] = useMutation(ALL, {
    onCompleted: (res) => {
      if (callBack) {
        callBack();
      }
      message[res?.data?.success ? "success" : "error"](res.data?.message);
    },
    onError: () => {
      message.error("Something went wrong, Please try again later.");
    },
  });

  const recalculate = (id?: string) => {
    if (id) one({ variables: { id } });
    else all({ variables: { id: router?.query?.id } });
  };

  const returnValue: [(id?: string) => void, boolean] = [
    recalculate,
    loadingAll || loadingOne,
  ];
  return returnValue;
}

export default useRecalculateWithholdingTax;
