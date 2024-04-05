import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/purchases/purchase-request")
);

const PurchaseRequestPersonal = () => {
  // projects, spare-parts, personal, fixed-assets, consignment
  return <Component type="personal" />;
};

export default PurchaseRequestPersonal;
