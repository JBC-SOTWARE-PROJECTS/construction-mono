import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/purchases/purchase-order")
);

const PurchaseOrderAll = () => {
  return <Component type="all" />;
};

export default PurchaseOrderAll;
