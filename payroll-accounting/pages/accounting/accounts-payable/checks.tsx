import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ChecksComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/checks")
);

const PrintChecks = () => {
  return <ChecksComponent />;
};

export default PrintChecks;
