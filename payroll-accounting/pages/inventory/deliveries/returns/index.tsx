import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/deliveries/returns")
);

const ReceivingAll = () => {
  return <Component />;
};

export default ReceivingAll;
