import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const Component = asyncComponent(
  () => import("@/routes/inventory/deliveries/receiving")
);

const ReceivingProjects = () => {
  // projects, spare-parts, personal, fixed-assets, consignment
  return <Component type="projects" />;
};

export default ReceivingProjects;
