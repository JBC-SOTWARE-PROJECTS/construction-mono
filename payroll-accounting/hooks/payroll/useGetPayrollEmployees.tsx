import { PayrollFormUsage } from "@/components/payroll/PayrollForm";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const GET_EMPLOYEES = gql`
  query ($id: UUID) {
    employees: getPayrollEmployees(id: $id) {
      id
      fullName
      position
      withholdingTax
      status
      timekeepingStatus
      contributionStatus
    }
  }
`;

function useGetPayrollEmployees(callBack?: (result: any) => void) {
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

export default useGetPayrollEmployees;
