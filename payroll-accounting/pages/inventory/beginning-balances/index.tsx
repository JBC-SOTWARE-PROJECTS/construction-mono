import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import AccessManager from "@/components/accessControl/AccessManager";

const Component = asyncComponent(
  () => import("@/routes/inventory/beginning-balances")
);

const BeginningBalances = () => {
  return (
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_BEGINNING_BAL"]}>
      <Component />
    </AccessManager>
  );
};

export default BeginningBalances;
