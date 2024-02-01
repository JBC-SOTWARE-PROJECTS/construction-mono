import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/purchases/purchase-request")
);

const PurchaseRequestAll = () => {
  return <Component type="all" />;
};

export default PurchaseRequestAll;
