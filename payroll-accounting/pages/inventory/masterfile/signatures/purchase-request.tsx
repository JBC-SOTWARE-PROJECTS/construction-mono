import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const TransactionTypeComponent = asyncComponent(
  () => import("@/routes/inventory/masterfile/signatures")
);

const TransactionTypePage = () => {
  return (
    <TransactionTypeComponent
      type="PR"
      title="Purchase Request Signatures Setup"
    />
  );
};

export default TransactionTypePage;
