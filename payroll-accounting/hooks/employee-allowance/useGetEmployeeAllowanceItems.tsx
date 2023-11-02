import { gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($id: UUID) {
    data: employee(id: $id) {
      id
      fullName
      position {
        id
        description
      }
      office {
        id
        officeDescription
      }
      allowanceItems {
        id
        name
        allowanceType
        amount
      }
    }
  }
`;

const useGetEmployeeAllowanceItems = (id: any) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: id,
    },
    fetchPolicy: "network-only",
  });
  return [data?.data, loading, , refetch];
};

export default useGetEmployeeAllowanceItems;
