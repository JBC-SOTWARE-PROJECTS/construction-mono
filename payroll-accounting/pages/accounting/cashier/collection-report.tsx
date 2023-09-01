import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const CollectionReportComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/accounts")
);

const CollectionReport = () => {
  return <CollectionReportComponent />;
};

export default CollectionReport;
