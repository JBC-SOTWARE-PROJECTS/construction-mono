import { gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query {
    list: getAllEmployeesBasic {
      id
      fullName
    }
  }
`;

const useGetEmployeesBasic = () => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    fetchPolicy: "network-only",
  });
  return [data?.list || [], loading, refetch];
};

export default useGetEmployeesBasic;
