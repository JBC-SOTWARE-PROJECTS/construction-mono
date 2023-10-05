import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const TransactionTypesComponent = asyncComponent(
  () =>
    import("@/routes/accounting/accounts-payable/config/aptransaction")
);

const APTransactionTypes = () => {
  return <TransactionTypesComponent />;
};

export default APTransactionTypes;
