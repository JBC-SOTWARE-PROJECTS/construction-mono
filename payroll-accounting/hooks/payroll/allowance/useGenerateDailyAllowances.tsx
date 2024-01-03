import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
import { useRouter } from "next/router";

const MUTATION = gql`
  mutation ($payrollId: UUID, $payrollEmployeeId: UUID) {
    data: generateDailyAllowances(
      payrollId: $payrollId
      payrollEmployeeId: $payrollEmployeeId
    ) {
      response
      success
      message
    }
  }
`;

function useGenerateDailyAllowances(callBack?: (result: any) => void) {
  const router = useRouter();
  const [mutationFn, { loading }] = useMutation(MUTATION, {
    onCompleted: (result: any) => {
      message.success(result?.data?.message);
      if (callBack) callBack(result?.data);
    },
  });

  const mutation = (payrollEmployeeId?: string) => {
    mutationFn({
      variables: {
        payrollEmployeeId: payrollEmployeeId,
        payrollId: !payrollEmployeeId ? router?.query?.id : null,
      },
    });
  };
  const returnValue: [(payrollEmployeeId: string) => void, boolean] = [
    mutation,
    loading,
  ];
  return returnValue;
}

export default useGenerateDailyAllowances;
