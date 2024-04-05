import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/insuances")
);

const IssuancesAssets = () => {
  // projects, personal, fixed-assets
  return <Component type="personal" issueType="ISSUE" />;
};

export default IssuancesAssets;
