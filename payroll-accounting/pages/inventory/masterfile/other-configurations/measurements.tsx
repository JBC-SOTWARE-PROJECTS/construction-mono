import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ItemMeasurementComponent = asyncComponent(
  () => import("@/routes/inventory/masterfile/other-configurations/measurements")
);

const ItemMeasurementPage = () => {
  return <ItemMeasurementComponent />;
};

export default ItemMeasurementPage;
