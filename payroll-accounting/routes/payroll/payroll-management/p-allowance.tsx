import PayrollHeader from "@/components/payroll/PayrollHeader";
import { PayrollEmployeeStatus, PayrollModule } from "@/graphql/gql/graphql";
import useGetPayrollEmployeeAllowance from "@/hooks/payroll/allowance/useGetPayrollEmployeeAllowance";
import useUpdateAllowanceItemAmount from "@/hooks/payroll/allowance/useUpdateAllowanceItemAmount";
import useUpsertPayrollAllowanceItem from "@/hooks/payroll/allowance/useUpsertPayrollAllowanceItem";
import { IPageProps } from "@/utility/interfaces";
import React from "react";

function PayrollAllowance({ account }: IPageProps) {
  const [employees, loading] = useGetPayrollEmployeeAllowance({
    variables: {
      page: 0,
      size: 25,
      filter: "",
      status: [PayrollEmployeeStatus.Draft],
      withItems: true,
    },
    onCompleted: () => {},
  });

  const [upsertItem, loadingUpsertItem] = useUpsertPayrollAllowanceItem();
  const [updateAmount, loadingUpdateAmount] = useUpdateAllowanceItemAmount();

  return (
    <>
      <PayrollHeader module={PayrollModule.Allowance} extra={<></>} />
      <button
        onClick={() => {
          // upsertItem({
          //   allowanceId: "09de4756-d4d5-4808-9ff2-cc8ec4ddc5f9",
          //   employeeId: "5b93c478-3cc7-4c35-a33e-34ddaf3c5abe",
          //   amount: 999,
          // });
          updateAmount({
            id: "dbbcbd98-c983-4e80-9db7-bbdc28b3dd86",
            amount: 88888,
          });
        }}
      >
        Test
      </button>
    </>
  );
}

export default PayrollAllowance;
