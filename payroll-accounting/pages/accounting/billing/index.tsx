import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const BillingComponent = asyncComponent(
  () => import("@/routes/accounting/billing/billing")
);

const Billing = () => {
  return <BillingComponent />;
};

export default Billing;
