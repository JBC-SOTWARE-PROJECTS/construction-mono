import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const AssetComponent = asyncComponent(
  () => import("@/routes/inventory/assets/masterfile")
);

const AssetPage = () => {
  return <AssetComponent />;
};

export default AssetPage;
