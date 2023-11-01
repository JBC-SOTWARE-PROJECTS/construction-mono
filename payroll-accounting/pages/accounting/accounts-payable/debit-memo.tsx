import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const DebitMemoComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/debitmemo")
);

const DebitMemo = () => {
  return <DebitMemoComponent />;
};

export default DebitMemo;
