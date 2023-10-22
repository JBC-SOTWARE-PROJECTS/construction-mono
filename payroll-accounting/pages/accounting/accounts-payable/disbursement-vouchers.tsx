import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const DisbursementComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/disbursement-vouchers")
);

const Disbursement = () => {
  return <DisbursementComponent />;
};

export default Disbursement;
