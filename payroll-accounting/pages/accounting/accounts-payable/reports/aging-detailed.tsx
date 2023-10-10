import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const AgingDetailedComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/reports/agingdetailed")
);

const AgingDetailedReport = () => {
  return <AgingDetailedComponent />;
};

export default AgingDetailedReport;
