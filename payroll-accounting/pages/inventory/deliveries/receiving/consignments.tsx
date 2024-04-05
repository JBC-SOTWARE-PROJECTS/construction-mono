import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/deliveries/receiving")
);

const ReceivingConsignment = () => {
  // projects, spare-parts, personal, fixed-assets, consignment
  return <Component type="consignment" />;
};

export default ReceivingConsignment;
