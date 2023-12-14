import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
import { useRouter } from "next/router";

export const PayrollStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  FINALIZED: "FINALIZED",
};

const UPDATE_PAYROLL_STATUS = gql`
  mutation ($id: UUID, $status: String) {
    updatePayrollStatus(id: $id, status: $status) {
      response {
        id
      }
    }
  }
`;

function useUpdatePayrollStatus(callBack: () => void) {
  const router = useRouter();
  const [update, { loading }] = useMutation(UPDATE_PAYROLL_STATUS, {
    onCompleted: (data) => {
      if (callBack) {
        callBack();
      }
      router.push(
        `/payroll/payroll-management/${data?.updatePayrollStatus?.response?.id}`
      );
    },
    onError: () => {
      message.error("Something went wrong, Please try again later.");
    },
  });

  const updateStatus = (status: string) => {
    update({ variables: { id: router?.query?.id, status } });
  };

  const returnValue: [(status: string) => void, boolean] = [
    updateStatus,
    loading,
  ];
  return returnValue;
}

export default useUpdatePayrollStatus;
