import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import AccessManager from "@/components/accessControl/AccessManager";

const Component = asyncComponent(
  () => import("@/routes/inventory/adjustments")
);

const QuantityAdjustments = () => {
  return (
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_QUANTITY_ADJUST"]}>
      <Component />
    </AccessManager>
  );
};

export default QuantityAdjustments;
