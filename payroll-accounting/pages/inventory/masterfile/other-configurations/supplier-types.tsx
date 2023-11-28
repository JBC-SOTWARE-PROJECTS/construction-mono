import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const SupplierTypesComponent = asyncComponent(
  () =>
    import("@/routes/inventory/masterfile/other-configurations/supplier-types")
);

const SupplierTypePage = () => {
  return <SupplierTypesComponent />;
};

export default SupplierTypePage;
