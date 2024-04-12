import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const BeginningBalanceComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/reports/apBeginning")
);

const APBeginningBalanceReport = () => {
  return <BeginningBalanceComponent />;
};

export default APBeginningBalanceReport;
