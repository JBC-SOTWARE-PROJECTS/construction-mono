import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/deliveries/receiving")
);

const ReceivingFixedAsset = () => {
  // projects, spare-parts, personal, fixed-assets, consignment
  return <Component type="fixed-assets" />;
};

export default ReceivingFixedAsset;
