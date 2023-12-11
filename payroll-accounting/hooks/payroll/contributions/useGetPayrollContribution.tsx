import { PayrollContribution } from "@/graphql/gql/graphql";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { type } from "os";

const PAYROLL_CONTRIBUTION = gql`
  query ($id: UUID!) {
    data: getContributionByPayrollId(id: $id) {
      message
      success
      response {
        id
        isActivePHIC
        isActiveSSS
        isActiveHDMF
        status
        payroll {
          id
          title
        }
      }
    }
  }
`;

type IReturnValue = [PayrollContribution, boolean, () => void];

/**
 * This hook is used to get payroll contribution module.
 * @param {function} callback - the function to implement after query completion.
 *
 * sample usage -
 * const { data, loading, refetch } = useGetPayrollContribution(callback);
 */
const useGetPayrollContribution = (callback?: (any: any) => void) => {
  const router = useRouter();
  const payroll = router?.query?.id;
  const { data, loading, refetch } = useQuery(PAYROLL_CONTRIBUTION, {
    variables: {
      id: payroll,
    },
    onCompleted: (result) => {
      if (callback) callback(result?.data?.response);
    },
  });

  const returnValue: IReturnValue = [data?.data?.response, loading, refetch];

  return returnValue;
};

export default useGetPayrollContribution;

// only exposing data, refetch, and loading properties from useQuery
