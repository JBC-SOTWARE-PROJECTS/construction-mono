import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const SubsidiaryLedgerComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/reports/subsidiaryledger")
);

const SubsidiaryLedger = () => {
  return <SubsidiaryLedgerComponent />;
};

export default SubsidiaryLedger;
