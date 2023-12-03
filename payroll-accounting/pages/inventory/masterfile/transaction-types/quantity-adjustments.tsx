import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const QuantityAdjustmentTypeComponent = asyncComponent(
  () =>
    import(
      "@/routes/inventory/masterfile/transaction-types/quantity-adjustments"
    )
);

const QuantityAdjustmentTypePage = () => {
  return <QuantityAdjustmentTypeComponent />;
};

export default QuantityAdjustmentTypePage;
