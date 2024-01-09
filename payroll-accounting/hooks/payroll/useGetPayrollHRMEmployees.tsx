import { PayrollFormUsage } from "@/components/payroll/PayrollForm";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const GET_EMPLOYEES = gql`
  query ($id: UUID) {
    employees: getPayrollHRMEmployees(id: $id) {
      id
      fullName
      gender
      status
      position {
        description
      }
    }
  }
`;

function useGetPayrollHRMEmployees(
  usage?: string,
  callBack?: (result: any) => void
) {
  const router = useRouter();
  const { data, loading } = useQuery(GET_EMPLOYEES, {
    skip: usage === PayrollFormUsage.CREATE && true,
    variables: {
      id: router?.query.id,
    },
    onCompleted: (result) => {
      if (callBack) callBack(result?.employees);
    },
  });
  return [data?.employees, loading];
}

export default useGetPayrollHRMEmployees;
