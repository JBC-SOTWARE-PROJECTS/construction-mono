import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
import { useRouter } from "next/router";

const UPDATE_STATUS = gql`
  mutation ($payrollId: UUID, $contributionType: ContributionTypes) {
    data: updateContributionTypeStatus(
      payrollId: $payrollId
      contributionType: $contributionType
    ) {
      success
      message
    }
  }
`;

function useUpdateContributionTypeStatus(callBack: () => void) {
  const router = useRouter();
  const [update, { loading }] = useMutation(UPDATE_STATUS, {
    onCompleted: (result) => {
      if (callBack) callBack();
      message.success(result?.data?.message);
    },
    onError: () => {
      message.error("Something went wrong, Please try again later.");
    },
  });

  const updateStatus = (contributionType: string) => {
    update({ variables: { payrollId: router?.query?.id, contributionType } });
  };

  const returnValue: [(status: string) => void, boolean] = [
    updateStatus,
    loading,
  ];
  return returnValue;
}

export default useUpdateContributionTypeStatus;
