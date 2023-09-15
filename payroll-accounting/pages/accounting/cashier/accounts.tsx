import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const CashierComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/accounts")
);

const Cashiering = () => {
  return <CashierComponent />;
};

export default Cashiering;
