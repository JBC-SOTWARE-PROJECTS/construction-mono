import { PayrollFormUsage } from "@/components/payroll/PayrollForm";
import { PayrollEmployeeStatus } from "@/graphql/gql/graphql";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
export interface variables {
  page: number;
  size: number;
  filter: string;
  status: [PayrollEmployeeStatus] | [];
}
interface IParams {
  variables: variables;
  onCompleted?: (any: any) => void;
}
const GET_EMPLOYEES = gql`
  query (
    $payroll: UUID!
    $page: Int!
    $size: Int!
    $filter: String
    $status: [PayrollEmployeeStatus]
  ) {
    employees: getPayrollEmployeesPageable(
      payroll: $payroll
      page: $page
      size: $size
      filter: $filter
      status: $status
    ) {
      content {
        id
        fullName
        position
        isDisabledWithholdingTax
        withholdingTax
        status
        timekeepingStatus
        contributionStatus
      }
      totalElements
    }
  }
`;

function useGetPayrollEmployeesPageable({ variables, onCompleted }: IParams) {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      ...variables,
      payroll: router?.query?.id,
    },
    onCompleted: (result) => {
      if (onCompleted) onCompleted(result?.employees);
    },
  });
  return [
    data?.employees?.content,
    loading,
    refetch,
    data?.employees?.totalElements,
  ];
}

export default useGetPayrollEmployeesPageable;
