import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/deliveries/receiving")
);

const IssuanceAll = () => {
  return <Component type="all" />;
};

export default IssuanceAll;
