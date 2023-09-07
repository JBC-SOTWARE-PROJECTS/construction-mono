import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const CashierAdminComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/accounts")
);

const CashierAdmin = () => {
  return <CashierAdminComponent />;
};

export default CashierAdmin;
