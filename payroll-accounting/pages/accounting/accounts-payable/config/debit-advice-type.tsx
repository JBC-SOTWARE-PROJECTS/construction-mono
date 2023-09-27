import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const DebitAdviceComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/config/debitadvice")
);

const DebitAdviceTypes = () => {
  return <DebitAdviceComponent />;
};

export default DebitAdviceTypes;
