import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ReleasingChecksComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/releasingchecks")
);

const ReleasingChecks = () => {
  return <ReleasingChecksComponent />;
};

export default ReleasingChecks;
