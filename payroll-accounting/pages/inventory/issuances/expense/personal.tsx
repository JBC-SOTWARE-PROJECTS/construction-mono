import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/deliveries/receiving")
);

const IssuancesAssets = () => {
  // projects, personal, fixed-assets
  return <Component type="personal" />;
};

export default IssuancesAssets;
