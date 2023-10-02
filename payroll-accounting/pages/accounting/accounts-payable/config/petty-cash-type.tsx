import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const PettyCashTypesComponent = asyncComponent(
  () => import("@/routes/accounting/accounts-payable/config/pettycashtype")
);

const PettyCashTypes = () => {
  return <PettyCashTypesComponent />;
};

export default PettyCashTypes;
