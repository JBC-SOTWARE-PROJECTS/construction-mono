import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const AccountsTemplateComponent = asyncComponent(
  () => import("@/routes/accounting/accounting-setup/templates")
);

const AccountsTemplate = () => {
  return <AccountsTemplateComponent />;
};

export default AccountsTemplate;
