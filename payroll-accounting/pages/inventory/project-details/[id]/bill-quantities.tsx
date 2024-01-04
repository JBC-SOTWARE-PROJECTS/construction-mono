import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ProjectDetailsComponent = asyncComponent(
  () => import("@/routes/inventory/projects/project-details/bill-quantities")
);

const ProjectsDetailsPage = () => {
  return <ProjectDetailsComponent />;
};

export default ProjectsDetailsPage;
