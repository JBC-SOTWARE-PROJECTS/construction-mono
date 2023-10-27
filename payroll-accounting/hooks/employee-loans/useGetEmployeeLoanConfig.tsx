import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const QUERY = gql`
  query ($id: UUID) {
    data: getEmployeeLoanConfig(id: $id) {
      cashAdvanceTerm
      cashAdvanceAmount
      equipmentLoanTerm
      equipmentLoanAmount
    }
  }
`;

function useGetEmployeeLoanConfig() {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(QUERY, {
    fetchPolicy: "network-only",
    variables: { id: router?.query?.id },
  });

  return [data?.data, loading, refetch];
}

export default useGetEmployeeLoanConfig;
