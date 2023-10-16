import PayrollHeader from "@/components/payroll/PayrollHeader";
import { PayrollModule } from "@/graphql/gql/graphql";
import { IPageProps } from "@/utility/interfaces";
import React from "react";

function OtherDeductions({ account }: IPageProps) {
  return (
    <>
      <PayrollHeader module={PayrollModule.OtherDeduction} extra={<></>} />
    </>
  );
}

export default OtherDeductions;
