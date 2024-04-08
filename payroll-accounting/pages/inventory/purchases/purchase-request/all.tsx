import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/purchases/purchase-request")
);

const PurchaseRequestAll = () => {
  // projects, spare-parts, personal, fixed-assets, consignment
  return <Component type="all" />;
};

export default PurchaseRequestAll;
