import { gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($id: UUID) {
    data: getAllowancePackageById(id: $id) {
      id
      name
      allowanceItems {
        id
        name
        allowanceType
        amount
      }
    }
  }
`;

const useGetOneAllowancePackage = (id: any) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: id,
    },
    skip: !id ? true : false,
    fetchPolicy: "network-only",
  });
  return [data?.data, loading, , refetch];
};

export default useGetOneAllowancePackage;
