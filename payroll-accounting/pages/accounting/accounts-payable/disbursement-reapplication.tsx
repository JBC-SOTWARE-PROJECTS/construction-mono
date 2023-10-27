import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const DisbursementReapplicationComponent = asyncComponent(
  () =>
    import("@/routes/accounting/accounts-payable/disbursement-reapplication")
);

const DisbursementReapplication = () => {
  return <DisbursementReapplicationComponent />;
};

export default DisbursementReapplication;
