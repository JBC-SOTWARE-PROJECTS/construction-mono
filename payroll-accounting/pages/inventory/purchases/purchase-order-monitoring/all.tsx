import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/purchases/purchase-order-monitoring")
);

const PurchaseOrderMonitoring = () => {
  return <Component />;
};

export default PurchaseOrderMonitoring;
