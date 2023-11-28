import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const TransactionTypeComponent = asyncComponent(
  () => import("@/routes/inventory/masterfile/transaction-types")
);

const TransactionTypePage = () => {
  return (
    <TransactionTypeComponent
      type="ISSUANCE"
      title="Item Issuance/Expense Transaction Type"
    />
  );
};

export default TransactionTypePage;
