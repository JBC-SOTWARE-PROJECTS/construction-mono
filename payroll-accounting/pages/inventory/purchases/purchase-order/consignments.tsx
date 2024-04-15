import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/purchases/purchase-order")
);

const PurchaseOrderConsignment = () => {
  // projects, spare-parts, personal, fixed-assets, consignment
  return <Component type="consignment" />;
};

export default PurchaseOrderConsignment;
