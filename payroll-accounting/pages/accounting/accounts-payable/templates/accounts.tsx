import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const AccountsTemplateComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/templates/accounts")
);

const APTransactionTypes = () => {
  return <AccountsTemplateComponent />;
};

export default APTransactionTypes;
