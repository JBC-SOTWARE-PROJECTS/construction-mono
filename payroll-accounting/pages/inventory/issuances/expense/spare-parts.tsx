import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(() => import("@/routes/inventory/insuances"));

const IssuanceSpareParts = () => {
  // projects, spare-parts, personal, fixed-assets, consignment
  return <Component type="spare-parts" issueType="EXPENSE" />;
};

export default IssuanceSpareParts;
