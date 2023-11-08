import { gql, useQuery } from "@apollo/client";
import { AllowancePackage } from "@/graphql/gql/graphql";

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
        allowanceId
      }
    }
  }
`;

const useGetOneAllowancePackage = (
  id: any,
  callback: (data: AllowancePackage) => void
) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: id,
    },
    onCompleted: (res) => {
      callback(res?.data);
    },
    skip: !id ? true : false,
    fetchPolicy: "network-only",
  });
  return [data?.data, loading, , refetch];
};

export default useGetOneAllowancePackage;
