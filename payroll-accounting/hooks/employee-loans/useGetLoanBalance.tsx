import { EmployeeLoanCategory } from "@/graphql/gql/graphql";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const QUERY = gql`
  query ($id: UUID, $category: EmployeeLoanCategory) {
    data: useGetLoanBalance(id: $id, category: $category)
  }
`;

function useGetLoanBalance(category: EmployeeLoanCategory) {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(QUERY, {
    fetchPolicy: "network-only",
    variables: { id: router?.query?.id, category },
  });

  return [data?.data, loading, refetch];
}

export default useGetLoanBalance;
