import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(() => import("@/routes/inventory/insuances"));

const IssuanceAll = () => {
  return <Component type="all" issueType="ISSUE" />;
};

export default IssuanceAll;
