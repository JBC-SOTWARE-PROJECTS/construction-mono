import { gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query {
    data: fetchAllAllowance {
      id
      name
      allowanceType
      amount
    }
  }
`;

const useGetAllAllowances = () => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    fetchPolicy: "network-only",
  });
  return [data?.data, loading, , refetch];
};

export default useGetAllAllowances;
