import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import { ReportType } from "@/graphql/gql/graphql";

const CashPosition = asyncComponent(
  () => import("@/routes/accounting/reports/financial-reports/report-generator")
);

const CashPositionPage = () => {
  return <CashPosition reportType={ReportType.CashPosition} />;
};

export default CashPositionPage;
