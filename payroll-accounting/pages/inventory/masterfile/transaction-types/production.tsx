import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const TransactionTypeComponent = asyncComponent(
  () => import("@/routes/inventory/masterfile/transaction-types")
);

const TransactionTypePage = () => {
  return (
    <TransactionTypeComponent
      type="PRODUCTION"
      title="Material Production Transaction Type"
    />
  );
};

export default TransactionTypePage;
