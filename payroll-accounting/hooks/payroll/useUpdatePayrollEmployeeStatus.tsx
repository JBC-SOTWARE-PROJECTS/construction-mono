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
  mutation ($id: UUID, $status: PayrollEmployeeStatus) {
    data: updatePayrollEmployeeStatus(id: $id, status: $status) {
      success
      message
    }
  }
`;

function useUpdatePayrollEmployeeStatus(callBack?: () => void) {
  const router = useRouter();
  const [update, { loading }] = useMutation(UPDATE_PAYROLL_STATUS, {
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

  const updateStatus = (id: string, status: string) => {
    update({ variables: { id, status } });
  };

  const returnValue: [(d: string, status: string) => void, boolean] = [
    updateStatus,
    loading,
  ];
  return returnValue;
}

export default useUpdatePayrollEmployeeStatus;
