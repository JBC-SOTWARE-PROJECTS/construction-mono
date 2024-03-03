import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(() => import("@/routes/inventory/insuances"));

const QuantityAdjustments = () => {
  return <Component type="all" issueType="EXPENSE" />;
};

export default QuantityAdjustments;
