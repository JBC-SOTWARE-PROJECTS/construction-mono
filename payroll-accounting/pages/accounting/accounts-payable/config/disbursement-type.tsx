import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const DisbursementTypesComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/config/disbursetransaction")
);

const DisbursementTypes = () => {
  return <DisbursementTypesComponent />;
};

export default DisbursementTypes;
