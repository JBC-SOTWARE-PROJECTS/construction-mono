import { gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($id: UUID) {
    data: employee(id: $id) {
      id
      employeeNo
      fullName
      profilePicture
      position {
        id
        description
      }
      office {
        id
        officeDescription
      }
      emailAddress
      employeeCelNo
      fullAddress
      employeeType
      gender
      isActive
    }
  }
`;

const useGetEmployeeById = (id: any) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: id,
    },
    fetchPolicy: "network-only",
  });
  return [data?.data, loading, , refetch];
};

export default useGetEmployeeById;
