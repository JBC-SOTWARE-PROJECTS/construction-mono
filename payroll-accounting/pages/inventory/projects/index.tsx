import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ProjectComponent = asyncComponent(
  () => import("@/routes/inventory/projects")
);

const ProjectsPage = () => {
  return <ProjectComponent />;
};

export default ProjectsPage;
