import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const PettyCashComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/pettycash-vouchers")
);

const PettyCash = () => {
  return <PettyCashComponent />;
};

export default PettyCash;
