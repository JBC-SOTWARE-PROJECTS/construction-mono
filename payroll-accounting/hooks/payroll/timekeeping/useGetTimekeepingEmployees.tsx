import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const GET_EMPLOYEES = gql`
  query ($id: UUID) {
    employees: getTimekeepingEmployees(id: $id) {
      id
      employeeId
      fullName
      gender
      status
      position {
        description
      }
    }
  }
`;

function useGetTimekeepingEmployees(callBack?: (result: any) => void) {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      id: router?.query.id,
    },
    onCompleted: (result) => {
      if (callBack) callBack(result?.employees);
    },
  });
  return [data?.employees, loading, refetch];
}

export default useGetTimekeepingEmployees;
