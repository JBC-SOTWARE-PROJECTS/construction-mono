import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const SupplierItemComponent = asyncComponent(
  () => import("@/routes/inventory/masterfile/supplier/items")
);

const SupplierItemPage = () => {
  return <SupplierItemComponent />;
};

export default SupplierItemPage;
