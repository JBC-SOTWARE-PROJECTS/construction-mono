import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const OTCTransactionComponent = asyncComponent(
  () => import("@/routes/accounting/otc/otc")
);

const OTCTransactions = () => {
  return <OTCTransactionComponent />;
};

export default OTCTransactions;
