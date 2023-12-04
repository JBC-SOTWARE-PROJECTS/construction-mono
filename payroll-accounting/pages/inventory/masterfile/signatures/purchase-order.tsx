import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const TransactionTypeComponent = asyncComponent(
  () => import("@/routes/inventory/masterfile/signatures")
);

const TransactionTypePage = () => {
  return (
    <TransactionTypeComponent
    type="PO"
    title="Purchase Order Signatures Setup"
    />
  );
};

export default TransactionTypePage;
