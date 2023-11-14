import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const QUERY = gql`
  query ($id: UUID) {
    data: getPayrollOtherDeductionById(id: $id) {
      id
      status
    }
  }
`;

function useGetPayrollOtherDeduction(callBack?: (result: any) => void) {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(QUERY, {
    variables: {
      id: router?.query.id,
    },
    onCompleted: (result) => {
      if (callBack) callBack(result?.data);
    },
  });
  return [data?.data, loading, refetch];
}

export default useGetPayrollOtherDeduction;
