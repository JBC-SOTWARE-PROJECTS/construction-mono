import { PayrollFormUsage } from "@/components/payroll/PayrollForm";
import { Payroll } from "@/graphql/gql/graphql";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const GET_PAYROLL = gql`
  query ($id: UUID) {
    payroll: getPayrollById(id: $id) {
      id
      title
      dateStart
      dateEnd
      description
      status
      type
      cycle
    }
  }
`;

function useGetOnePayroll(usage?: string, callBack?: (payroll: any) => void) {
  const router = useRouter();
  const { data, loading } = useQuery(GET_PAYROLL, {
    skip: usage === PayrollFormUsage.CREATE && true,
    variables: {
      id: router?.query.id,
    },
    fetchPolicy: "network-only",
    onCompleted: (result) => {
      if (callBack) callBack(result?.payroll);
    },
  });

  const returnValue: [Payroll, boolean] = [data?.payroll, loading];
  return returnValue;
}

export default useGetOnePayroll;
