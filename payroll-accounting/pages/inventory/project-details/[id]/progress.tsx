import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const ProjectDetailsComponent = asyncComponent(
  () => import("@/routes/inventory/projects/project-details/progress")
);

const ProjectsDetailsPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Project Management</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN", "ROLE_PROJECT_PROGRESS_REPORT"]}>
        <div className="w-full">
          <ProjectDetailsComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default ProjectsDetailsPage;
