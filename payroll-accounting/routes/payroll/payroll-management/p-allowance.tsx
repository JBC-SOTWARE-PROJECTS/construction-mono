import PayrollHeader from "@/components/payroll/PayrollHeader";
import { PayrollModule } from "@/graphql/gql/graphql";
import { IPageProps } from "@/utility/interfaces";
import React from "react";

function PayrollAllowance({ account }: IPageProps) {
  return (
    <>
      <PayrollHeader module={PayrollModule.Allowance} extra={<></>} />
    </>
  );
}

export default PayrollAllowance;
