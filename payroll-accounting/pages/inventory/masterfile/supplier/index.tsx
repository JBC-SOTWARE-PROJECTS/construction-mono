import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const SupplierComponent = asyncComponent(
  () => import("@/routes/inventory/masterfile/supplier")
);

const SupplierPage = () => {
  return <SupplierComponent />;
};

export default SupplierPage;
