import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import { ReportType } from "@/graphql/gql/graphql";

const ProfitAndLoss = asyncComponent(
  () => import("@/routes/accounting/reports/financial-reports/report-generator")
);

const ProfitAndLossPage = () => {
  return <ProfitAndLoss reportType={ReportType.ProfitAndLoss} />;
};

export default ProfitAndLossPage;
