import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const AccountsPayableComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/payables")
);

const AccountsPayablePage = () => {
  return <AccountsPayableComponent />;
};

export default AccountsPayablePage;
