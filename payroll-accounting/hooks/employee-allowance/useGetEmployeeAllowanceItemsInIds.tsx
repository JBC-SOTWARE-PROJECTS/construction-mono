import { gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($idList: [UUID]) {
    data: getEmployeeAllowanceItemsInIds(idList: $idList) {
      id
      fullName
      allowanceItems {
        id
        name
        allowanceType
        amount
        allowanceId
      }
      allowancePackageId
    }
  }
`;

const useGetEmployeeAllowanceItemsInIds = (idList: string[]) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      idList: idList,
    },
    fetchPolicy: "network-only",
  });
  return [data?.data, loading, refetch];
};

export default useGetEmployeeAllowanceItemsInIds;
