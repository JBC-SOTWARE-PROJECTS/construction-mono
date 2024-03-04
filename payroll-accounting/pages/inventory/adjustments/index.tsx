import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/adjustments")
);

const QuantityAdjustments = () => {
  return <Component />;
};

export default QuantityAdjustments;
