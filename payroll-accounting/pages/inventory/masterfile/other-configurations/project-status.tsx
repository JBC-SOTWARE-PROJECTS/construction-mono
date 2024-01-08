import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ProjectStatusComponent = asyncComponent(
  () =>
    import("@/routes/inventory/masterfile/other-configurations/project-status")
);

const ProjectStatusPage = () => {
  return <ProjectStatusComponent />;
};

export default ProjectStatusPage;
