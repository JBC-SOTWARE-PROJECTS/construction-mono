import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const DebitAdviceComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/debitadvice")
);

const DebitAdvice = () => {
  return <DebitAdviceComponent />;
};

export default DebitAdvice;
