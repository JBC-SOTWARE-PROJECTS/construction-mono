import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ConsolidationReportComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/accounts")
);

const ConsolidationReport = () => {
  return <ConsolidationReportComponent />;
};

export default ConsolidationReport;
