import PayrollHeader from "@/components/payroll/PayrollHeader";
import { PayrollModule } from "@/graphql/gql/graphql";
import { IPageProps } from "@/utility/interfaces";
import React from "react";

function PayrollLoans({ account }: IPageProps) {
  return (
    <>
      <PayrollHeader module={PayrollModule.Loans} extra={<></>} />
    </>
  );
}

export default PayrollLoans;
