import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import AccessManager from "@/components/accessControl/AccessManager";
import Head from "next/head";

const ProjectComponent = asyncComponent(
  () => import("@/routes/inventory/projects")
);

const ProjectsPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Project Management</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN", "ROLE_PROJECTS"]}>
        <div className="w-full">
          <ProjectComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default ProjectsPage;
