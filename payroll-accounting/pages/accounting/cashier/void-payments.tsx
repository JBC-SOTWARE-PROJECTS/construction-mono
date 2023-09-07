import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const VoidPaymentComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/accounts")
);

const VoidPayment = () => {
  return <VoidPaymentComponent />;
};

export default VoidPayment;
