import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(() => import("@/routes/inventory/insuances"));

const IssuancesProjects = () => {
  // personal, projects, fixed-assets
  return <Component type="projects" issueType="EXPENSE" />;
};

export default IssuancesProjects;
