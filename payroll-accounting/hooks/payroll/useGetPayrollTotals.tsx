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
      timekeeping {
        status
        salaryBreakdown {
          project
          projectName
          company
          companyName
          late
          regular
          overtime
          regularHoliday
          overtimeHoliday
          regularDoubleHoliday
          overtimeDoubleHoliday
          regularSpecialHoliday
          overtimeSpecialHoliday
          total
        }
      }
      loan {
        status
        totalsBreakdown {
          subaccountCode
          description
          amount
          entryType
        }
      }
      contribution {
        status
        totalsBreakdown {
          subaccountCode
          description
          amount
          entryType
        }
      }
      adjustment {
        status
        totalsBreakdown {
          subaccountCode
          description
          amount
          entryType
        }
      }
      otherDeduction {
        status
        totalsBreakdown {
          subaccountCode
          description
          amount
          entryType
        }
      }
      allowance {
        status
        totalsBreakdown {
          subaccountCode
          description
          amount
          entryType
        }
      }
    }
  }
`;

function useGetPayrollTotals(callBack?: (payroll: any) => void) {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(GET_PAYROLL, {
    // skip: usage === PayrollFormUsage.CREATE && true,
    variables: {
      id: router?.query.id,
    },
    fetchPolicy: "network-only",
    onCompleted: (result) => {
      if (callBack) callBack(result?.payroll);
    },
  });

  const returnValue: [Payroll, boolean, () => void] = [
    data?.payroll,
    loading,
    refetch,
  ];
  return returnValue;
}

export default useGetPayrollTotals;
