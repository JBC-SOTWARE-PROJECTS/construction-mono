import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/deliveries/receiving")
);

const IssuancesProjects = () => {
  // personal, projects, fixed-assets
  return <Component type="projects" />;
};

export default IssuancesProjects;
