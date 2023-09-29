import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const DebitMemoComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/config/debitmemo")
);

const DebitMemoTypes = () => {
  return <DebitMemoComponent />;
};

export default DebitMemoTypes;
