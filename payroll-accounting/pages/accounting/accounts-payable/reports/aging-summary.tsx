import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const AgingSummaryComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/reports/agingsummary")
);

const AgingSummarryReport = () => {
  return <AgingSummaryComponent />;
};

export default AgingSummarryReport;
