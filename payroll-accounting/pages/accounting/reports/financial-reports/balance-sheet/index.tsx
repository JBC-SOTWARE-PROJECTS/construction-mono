import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import { ReportType } from "@/graphql/gql/graphql";

const BalanceSheet = asyncComponent(
  () => import("@/routes/accounting/reports/financial-reports/report-generator")
);

const BalanceSheetPage = () => {
  return <BalanceSheet reportType={ReportType.BalanceSheet} />;
};

export default BalanceSheetPage;
